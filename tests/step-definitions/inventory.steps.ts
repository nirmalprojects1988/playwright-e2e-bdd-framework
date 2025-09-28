import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { InventoryPage } from '@/pages/inventory.page';

let inventoryPage: InventoryPage;

Given('I am on the inventory page', async function() {
  inventoryPage = new InventoryPage(this.page);
  await inventoryPage.navigate();
});

Then('I should see product items', async function() {
  const items = await inventoryPage.getInventoryItems();
  expect(items.length).toBeGreaterThan(0);
});

Then('the inventory should show correct item count', async function() {
  const items = await inventoryPage.getInventoryItems();
  expect(items.length).toBe(6); // SauceDemo has 6 items by default
});

When('I add {string} to cart', async function(productName: string) {
  await inventoryPage.addToCart(productName);
});

Then('the cart badge should show {string}', async function(count: string) {
  const badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toBe(count);
});

Then('the item should be added to my cart', async function() {
  const cartItems = await inventoryPage.getCartItems();
  expect(cartItems.length).toBe(1);
});