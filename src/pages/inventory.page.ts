import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate('inventory.html');
  }

  async getInventoryItems() {
    await this.page.waitForSelector('.inventory_list');
    return this.page.locator('.inventory_item').all();
  }

  async addToCart(productName: string) {
    await this.page.waitForSelector('.inventory_list');
    const item = await this.page.locator('.inventory_item')
      .filter({ hasText: productName }).first();
    await item.locator('.btn_primary').click();
  }

  async getCartBadgeCount() {
    try {
      const badge = await this.page.locator('.shopping_cart_badge');
      const text = await badge.textContent();
      return text || '0';
    } catch {
      return '0';
    }
  }

  async getCartItems() {
    const cartIcon = await this.page.locator('.shopping_cart_link');
    await cartIcon.click();
    return this.page.locator('.cart_item').all();
  }
}