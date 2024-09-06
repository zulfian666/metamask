import { strict as assert } from 'assert';
import { Driver } from '../../webdriver/driver';
import { DEFAULT_GANACHE_ETH_BALANCE_DEC } from '../../constants';
import HeaderNavbar from './header-navbar';

class HomePage {
  private driver: Driver;

  private sendButton: string;
  private activityTab: string;
  private tokensTab: string;
  private balance: string;
  private completedTransactions: string;
  private confirmedTransactions: object;
  private transactionAmountsInActivity: string;

  public headerNavbar: HeaderNavbar;

  constructor(driver: Driver) {
    this.driver = driver;
    this.headerNavbar = new HeaderNavbar(driver);
    this.sendButton = '[data-testid="eth-overview-send"]';
    this.activityTab = '[data-testid="account-overview__activity-tab"]';
    this.tokensTab = '[data-testid="account-overview__asset-tab"]';
    this.confirmedTransactions = {
      text: 'Confirmed',
      css: '.transaction-status-label--confirmed',
    };
    this.balance = '[data-testid="eth-overview__primary-currency"]';
    this.completedTransactions = '[data-testid="activity-list-item"]';
    this.transactionAmountsInActivity =
      '[data-testid="transaction-list-item-primary-currency"]';
  }

  /**
   * Checks if the home page is loaded by waiting for specific elements to be present.
   * @throws {Error} If the page fails to load within the timeout period.
   */
  async check_pageIsLoaded(): Promise<void> {
    try {
      await this.driver.waitForMultipleSelectors([
        this.sendButton,
        this.activityTab,
        this.tokensTab,
      ]);
      console.log('Home page is loaded');
    } catch (e) {
      console.error('Timeout while waiting for home page to be loaded', e);
      throw new Error('Home page failed to load');
    }
  }

  /**
   * Checks if the expected balance is displayed on the home page.
   * @param expectedBalance - The expected balance to be displayed. Defaults to DEFAULT_GANACHE_ETH_BALANCE_DEC.
   * @throws {Error} If the expected balance is not displayed within the timeout period.
   */
  async check_expectedBalanceIsDisplayed(
    expectedBalance: string = DEFAULT_GANACHE_ETH_BALANCE_DEC,
  ): Promise<void> {
    try {
      await this.driver.waitForSelector({
        css: this.balance,
        text: `${expectedBalance} ETH`,
      });
      console.log(
        `Expected balance ${expectedBalance} ETH is displayed on homepage`,
      );
    } catch (e) {
      const balance = await this.driver.waitForSelector(this.balance);
      const currentBalance = parseFloat(await balance.getText());
      const errorMessage = `Expected balance ${expectedBalance} ETH, got balance ${currentBalance} ETH`;
      console.error(errorMessage, e);
      throw new Error(errorMessage);
    }
  }

  /**
   * Initiates the send flow by clicking the send button.
   */
  async startSendFlow(): Promise<void> {
    console.log('Starting send flow');
    await this.driver.clickElement(this.sendButton);
  }

  /**
   * Navigates to the activity list tab.
   */
  async goToActivityList(): Promise<void> {
    console.log('Opening activity tab on homepage');
    await this.driver.clickElement(this.activityTab);
  }

  /**
   * Checks if the specified number of confirmed transactions are displayed in the activity list.
   * @param expectedNumber - The number of confirmed transactions expected. Defaults to 1.
   * @throws {Error} If the expected number of transactions is not displayed within the timeout period.
   */
  async check_confirmedTxNumberDisplayedInActivity(
    expectedNumber: number = 1,
  ): Promise<void> {
    console.log(
      `Waiting for ${expectedNumber} confirmed transaction(s) to be displayed in activity list`,
    );
    try {
      await this.driver.wait(async () => {
        const confirmedTxs = await this.driver.findElements(
          this.confirmedTransactions,
        );
        return confirmedTxs.length === expectedNumber;
      }, 10000);
      console.log(
        `${expectedNumber} confirmed transaction(s) found in activity list on homepage`,
      );
    } catch (e) {
      console.error(`Failed to find ${expectedNumber} confirmed transaction(s)`, e);
      throw new Error(`Expected ${expectedNumber} confirmed transaction(s) not found in activity list`);
    }
  }

  /**
   * Checks if the specified number of completed transactions are displayed in the activity list.
   * @param expectedNumber - The number of completed transactions expected. Defaults to 1.
   * @throws {Error} If the expected number of transactions is not displayed within the timeout period.
   */
  async check_completedTxNumberDisplayedInActivity(
    expectedNumber: number = 1,
  ): Promise<void> {
    console.log(
      `Waiting for ${expectedNumber} completed transaction(s) to be displayed in activity list`,
    );
    try {
      await this.driver.wait(async () => {
        const completedTxs = await this.driver.findElements(
          this.completedTransactions,
        );
        return completedTxs.length === expectedNumber;
      }, 10000);
      console.log(
        `${expectedNumber} completed transaction(s) found in activity list on homepage`,
      );
    } catch (e) {
      console.error(`Failed to find ${expectedNumber} completed transaction(s)`, e);
      throw new Error(`Expected ${expectedNumber} completed transaction(s) not found in activity list`);
    }
  }

  /**
   * Checks if a specified transaction amount at the specified index matches the expected one.
   * @param expectedAmount - The expected transaction amount. Defaults to '-1 ETH'.
   * @param expectedNumber - The 1-based index of the transaction in the activity list. Defaults to 1.
   * @throws {Error} If the transaction amount does not match the expected amount.
   */
  async check_txAmountInActivity(
    expectedAmount: string = '-1 ETH',
    expectedNumber: number = 1,
  ): Promise<void> {
    console.log(`Checking transaction amount for transaction ${expectedNumber}`);
    try {
      const transactionAmounts = await this.driver.findElements(
        this.transactionAmountsInActivity,
      );
      const transactionAmountsText = await transactionAmounts[
        expectedNumber - 1
      ].getText();
      assert.equal(
        transactionAmountsText,
        expectedAmount,
        `${transactionAmountsText} is displayed as transaction amount instead of ${expectedAmount} for transaction ${expectedNumber}`,
      );
      console.log(
        `Amount for transaction ${expectedNumber} is displayed as ${expectedAmount}`,
      );
    } catch (e) {
      console.error(`Failed to verify transaction amount`, e);
      throw new Error(`Transaction amount verification failed for transaction ${expectedNumber}`);
    }
  }

  /**
   * Waits for the total amount to load on the home page.
   * @param expectedAmount - The expected total amount to be displayed.
   * @throws {Error} If the expected amount is not displayed within the timeout period.
   */
  async waitForTotalAmountToLoad(expectedAmount: string): Promise<void> {
    console.log(`Waiting for total amount ${expectedAmount} to load`);
    try {
      await this.driver.waitForSelector({
        css: this.balance,
        text: expectedAmount,
      });
      console.log(`Total amount ${expectedAmount} loaded successfully`);
    } catch (e) {
      console.error(`Failed to load total amount ${expectedAmount}`, e);
      throw new Error(`Total amount ${expectedAmount} did not load within the expected time`);
    }
  }
}

export default HomePage;
