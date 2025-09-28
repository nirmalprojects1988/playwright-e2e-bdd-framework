import { Browser, chromium, Page } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { CONFIG } from '@/constants/config';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();
  
  // Login and save storage state
  const loginPage = new LoginPage(page);
  await loginPage.login();
  
  // Create fixtures directory if it doesn't exist
  const fixturesDir = path.join(process.cwd(), 'src/fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Save signed-in state
  const storage = await page.context().storageState();
  const authFile = path.join(fixturesDir, 'auth.json');
  fs.writeFileSync(authFile, JSON.stringify(storage));
  
  await browser.close();
}

export default globalSetup;