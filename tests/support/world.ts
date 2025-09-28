import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';

export class CustomWorld extends World {
  private browser!: Browser;
  private context!: BrowserContext;
  public page!: Page;

  constructor(options: any) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    const loginPage = new LoginPage(this.page);
    await loginPage.login();
  }

  async teardown() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);