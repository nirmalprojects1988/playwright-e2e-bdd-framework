import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CONFIG } from '../constants/config';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username = CONFIG.UI.CREDENTIALS.STANDARD_USER.username, 
             password = CONFIG.UI.CREDENTIALS.STANDARD_USER.password) {
    await this.navigate();
    const userInput = await this.getByPlaceholder('Username');
    await userInput.fill(username);
    const passInput = await this.getByPlaceholder('Password');
    await passInput.fill(password);
    const loginBtn = await this.getByRole('button', { name: 'LOGIN' });
    await loginBtn.click();
  }
}