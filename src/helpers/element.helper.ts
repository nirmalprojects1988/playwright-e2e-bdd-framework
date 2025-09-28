import { ElementHandle, Locator, Page } from '@playwright/test';

type WaitOptions = {
  timeout?: number;
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
};

type ClickOptions = {
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
  delay?: number;
};

type RoleType =
  | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner'
  | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox'
  | 'complementary' | 'contentinfo' | 'definition' | 'dialog' | 'directory'
  | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group'
  | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log'
  | 'main' | 'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'meter'
  | 'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar'
  | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader'
  | 'scrollbar' | 'search' | 'searchbox' | 'separator' | 'slider' | 'spinbutton'
  | 'status' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term'
  | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem';

export class ElementHelper {
  constructor(private page: Page) {}

  /**
   * Find element by test ID
   */
  async getByTestId(testId: string): Promise<Locator> {
    return this.page.getByTestId(testId);
  }

  /**
   * Find element by placeholder text
   */
  async getByPlaceholder(placeholder: string): Promise<Locator> {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Find element by role (button, link, etc.)
   */
  async getByRole(role: RoleType, options?: { name?: string, exact?: boolean }): Promise<Locator> {
    return this.page.getByRole(role, options);
  }

  /**
   * Find element by visible text content
   */
  async getByText(text: string, options?: { exact?: boolean }): Promise<Locator> {
    return this.page.getByText(text, options);
  }

  /**
   * Find element by label text
   */
  async getByLabel(label: string, options?: { exact?: boolean }): Promise<Locator> {
    return this.page.getByLabel(label, options);
  }

  /**
   * Wait for element with timeout
   */
  async waitForElement(selector: string, options?: WaitOptions): Promise<ElementHandle | null> {
    return this.page.waitForSelector(selector, {
      state: options?.state || 'visible',
      timeout: options?.timeout || 5000
    });
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string | Locator, options?: ClickOptions & WaitOptions): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    try {
      await element.waitFor({ state: options?.state || 'visible', timeout: options?.timeout });
      await element.click(options);
    } catch (error) {
      // Retry once if element is not clickable
      await this.page.waitForTimeout(1000);
      await element.click(options);
    }
  }

  /**
   * Fill input with value and verify
   */
  async fillInput(selector: string | Locator, value: string, options?: WaitOptions): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: options?.state || 'visible', timeout: options?.timeout });
    await element.fill(value);
    
    // Verify the input value
    const actualValue = await element.inputValue();
    if (actualValue !== value) {
      await element.fill(value); // Retry once
    }
  }

  /**
   * Get text content with optional trim
   */
  async getText(selector: string | Locator, trim: boolean = true): Promise<string | null> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const text = await element.textContent();
    return trim ? text?.trim() ?? null : text;
  }

  /**
   * Check if element exists
   */
  async exists(selector: string | Locator, timeout: number = 1000): Promise<boolean> {
    try {
      const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
      await element.waitFor({ state: 'attached', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible and stable
   */
  async waitForStableElement(selector: string | Locator, timeout: number = 5000): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible', timeout });
    
    // Wait for element to be stable (no size/position changes)
    await this.page.waitForTimeout(500);
  }

  /**
   * Drag and drop element
   */
  async dragAndDrop(
    source: string | Locator,
    target: string | Locator,
    options?: WaitOptions
  ): Promise<void> {
    const sourceElement = typeof source === 'string' ? this.page.locator(source) : source;
    const targetElement = typeof target === 'string' ? this.page.locator(target) : target;

    await sourceElement.waitFor({ state: options?.state || 'visible', timeout: options?.timeout });
    await targetElement.waitFor({ state: options?.state || 'visible', timeout: options?.timeout });

    await sourceElement.dragTo(targetElement);
  }

  /**
   * Get all elements matching selector
   */
  async getAll(selector: string | Locator): Promise<Locator[]> {
    const elements = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return elements.all();
  }

  /**
   * Select option from dropdown by text
   */
  async selectOption(
    selector: string | Locator,
    optionText: string,
    options?: WaitOptions
  ): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: options?.state || 'visible', timeout: options?.timeout });
    await element.selectOption({ label: optionText });
  }
}