import { Page } from '@playwright/test';
import { CONFIG } from '../constants/config';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string = '') {
    await this.page.goto(`${CONFIG.UI.BASE_URL}${path}`);
  }

  async getByTestId(testId: string) {
    return this.page.getByTestId(testId);
  }

  async getByPlaceholder(placeholder: string) {
    return this.page.getByPlaceholder(placeholder);
  }

  async getByRole(role: 'button' | 'link' | 'textbox' | 'img' | 'heading' | 'checkbox' | 'radio' | 'tab' | 'menuitem', 
                options?: { name: string }) {
    return this.page.getByRole(role, options);
  }

  async getByText(text: string) {
    return this.page.getByText(text);
  }
}