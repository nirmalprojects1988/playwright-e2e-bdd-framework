import { chromium } from '@playwright/test';
import { LoginPage } from './pages/login.page';

async function testSetup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.login();

  await page.waitForTimeout(5000); // Wait to see if login worked
  await browser.close();
}

testSetup();