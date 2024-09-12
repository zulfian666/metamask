import { Driver } from '../../webdriver/driver';
import { BasePage } from './base-page';
import HeaderNavbar from './header-navbar';
import { SettingsPage } from './settings-page';
import HomePage from './homepage';
import LoginPage from './login-page';

// Top level page object for the app.
class App extends BasePage {
  constructor(driver: Driver) {
    super(driver);
  }

  async getHeaderNavbar(): Promise<HeaderNavbar> {
    // TODO: Ensure that the header navbar is visible.
    return new HeaderNavbar(this.driver);
  }

  async getHomePage(): Promise<HomePage> {
    return new HomePage(this.driver).check_pageIsLoaded();
  }

  async getLoginPage(): Promise<LoginPage> {
    return new LoginPage(this.driver).check_pageIsLoaded();
  }

  async openSettings(): Promise<SettingsPage> {
    const headerNavbar = await this.getHeaderNavbar();
    return headerNavbar.openSettings();
  }
}

export const getApp = async (driver: Driver): Promise<App> => {
  const app = new App(driver);
  // TODO: Ensure that the app is loaded.
  return app;
};
