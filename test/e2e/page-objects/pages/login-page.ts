import { Driver } from '../../webdriver/driver';
import HomePage from './homepage';

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
      css: '[data-testid="unlock-page-title"]',
      text: 'Welcome back!',
    };
  }

  async check_pageIsLoaded(): Promise<LoginPage> {
    try {
      await this.driver.waitForMultipleSelectors([
        this.welcomeBackMessage,
        this.passwordInput,
        this.unlockButton,
      ]);
    } catch (e) {
      console.log('Timeout while waiting for login page to be loaded', e);
      throw e;
    }
    console.log('Login page is loaded');
    return this;
  }

  async fillPassword(password: string): Promise<void> {
    await this.driver.fill(this.passwordInput, password);
  }

  async clickUnlockButton(): Promise<void> {
    await this.driver.clickElement(this.unlockButton);
  }

  async login(password: string): Promise<HomePage> {
    await this.fillPassword(password);
    await this.clickUnlockButton();
    // user lands on homepage after logging in with password
    return new HomePage(this.driver).check_pageIsLoaded();
  }
}

export default LoginPage;
