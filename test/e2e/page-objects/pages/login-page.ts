import { Driver } from '../../webdriver/driver';

class LoginPage {
  private driver: Driver;

  private passwordInput: string;

  private unlockButton: string;

  private welcomeBackMessage: object;

  constructor(driver: Driver) {
    this.driver = driver;
    this.passwordInput = '[data-testid="unlock-password"]';
    this.unlockButton = '[data-testid="unlock-submit"]';
    this.welcomeBackMessage = {
      css: '.unlock-page__title',
      text: 'Welcome back!',
    };
  }

  async check_pageIsLoaded(): Promise<void> {
    try {
      await this.driver.waitForSelector(this.welcomeBackMessage);
      await this.driver.waitForSelector(this.passwordInput);
      await this.driver.waitForSelector(this.unlockButton);
    } catch (e) {
      console.log('Timeout while waiting for login page to be loaded', e);
      throw e;
    }
    console.log('Login page is loaded');
  }

  async fillPassword(password: string): Promise<void> {
    await this.driver.fill(this.passwordInput, password);
  }

  async clickUnlockButton(): Promise<void> {
    await this.driver.clickElement(this.unlockButton);
  }
}

export default LoginPage;
