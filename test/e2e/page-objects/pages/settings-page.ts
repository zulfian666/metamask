import {
  ADVANCED_ROUTE,
  GENERAL_ROUTE,
  CONTACT_LIST_ROUTE,
  SECURITY_ROUTE,
  ALERTS_ROUTE,
  NETWORKS_ROUTE,
  ABOUT_US_ROUTE,
} from '../../../../ui/helpers/constants/routes';
import { Driver } from '../../webdriver/driver';

export class AdvancedSettingsPage {
  private driver: Driver;

  private smartTransactionsToggle: string;

  constructor(driver: Driver) {
    this.driver = driver;
    this.smartTransactionsToggle =
      '[data-testid="advanced-setting-enable-smart-transactions"] label';
  }

  async toggleSmartTransactions(): Promise<void> {
    const smartTransactionsToggle = await this.driver.findElement(
      this.smartTransactionsToggle,
    );
    await this.driver.scrollToElement(smartTransactionsToggle);

    await this.driver.clickElement(this.smartTransactionsToggle);
  }
}

export class SettingsPage {
  private driver: Driver;

  private generalTab: string;

  private advancedTab: string;

  private contactsTab: string;

  private securityTab: string;

  private alertsTab: string;

  private networksTab: string;

  private aboutUsTab: string;

  private closeSettingsButton: string;

  constructor(driver: Driver) {
    this.driver = driver;
    this.generalTab = `[data-testid="${GENERAL_ROUTE}"]`;
    this.advancedTab = `[data-testid="${ADVANCED_ROUTE}"]`;
    this.contactsTab = `[data-testid="${CONTACT_LIST_ROUTE}"]`;
    this.securityTab = `[data-testid="${SECURITY_ROUTE}"]`;
    this.alertsTab = `[data-testid="${ALERTS_ROUTE}"]`;
    this.networksTab = `[data-testid="${NETWORKS_ROUTE}"]`;
    this.aboutUsTab = `[data-testid="${ABOUT_US_ROUTE}"]`;
    this.closeSettingsButton = '[data-testid="close-settings"]';
  }

  async openGeneralTab(): Promise<void> {
    await this.driver.clickElement(this.generalTab);
  }

  async openAdvancedTab(): Promise<AdvancedSettingsPage> {
    await this.driver.clickElement(this.advancedTab);
    return new AdvancedSettingsPage(this.driver);
  }

  async openContactsTab(): Promise<void> {
    await this.driver.clickElement(this.contactsTab);
  }

  async openSecurityTab(): Promise<void> {
    await this.driver.clickElement(this.securityTab);
  }

  async openAlertsTab(): Promise<void> {
    await this.driver.clickElement(this.alertsTab);
  }

  async openNetworksTab(): Promise<void> {
    await this.driver.clickElement(this.networksTab);
  }

  async openAboutUsTab(): Promise<void> {
    await this.driver.clickElement(this.aboutUsTab);
  }

  async closeSettings(): Promise<void> {
    await this.driver.clickElement(this.closeSettingsButton);
  }
}
