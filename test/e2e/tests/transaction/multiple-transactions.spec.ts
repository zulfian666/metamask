import { Suite } from 'mocha';
import { strict as assert } from 'assert';
import { Driver } from '../../webdriver/driver';
import {
  withFixtures,
  openDapp,
  regularDelayMs,
  unlockWallet,
  generateGanacheOptions,
  WINDOW_TITLES,
} from '../../helpers';
import FixtureBuilder = require('../../fixture-builder');
import HomePage from '../../page-objects/pages/home/home-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';

/**
 * Test suite for multiple transactions in MetaMask.
 * This suite tests the creation, confirmation, and rejection of multiple queued transactions.
 */

/**
 * Test suite for handling multiple transactions in MetaMask.
 * These tests ensure that the wallet can correctly queue, confirm, and reject multiple transactions.
 */
describe('Multiple transactions', function (this: Suite) {
  /**
   * Test case: Create multiple queued transactions and confirm them.
   * This test simulates a user initiating multiple transactions and confirming them in sequence.
   */
  it('creates multiple queued transactions, then confirms', async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        ganacheOptions: generateGanacheOptions({ hardfork: 'london' }),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        try {
          await unlockWallet(driver);

          const homePage = new HomePage(driver);
          const confirmTransactionPage = new ConfirmTransactionPage(driver);

          await openDapp(driver);
          await driver.clickElement({ text: 'Send EIP 1559 Transaction', tag: 'button' });
          await driver.waitUntilXWindowHandles(3);
          await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);

          await driver.clickElement({ text: 'Send EIP 1559 Transaction', tag: 'button' });
          await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

          await driver.waitForSelector({ text: 'Reject 2 transactions', tag: 'a' });
          await confirmTransactionPage.confirmTransaction();
          await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

          await driver.assertElementNotPresent('.page-container__footer-secondary a');
          await confirmTransactionPage.confirmTransaction();

          await driver.waitUntilXWindowHandles(2);
          await driver.switchToWindowWithTitle(WINDOW_TITLES.ExtensionInFullScreenView);
          await driver.delay(regularDelayMs);

          await homePage.goToActivityList();
          await homePage.check_completedTxNumberDisplayedInActivity(2);
        } catch (error) {
          console.error('Error in multiple transactions test:', error);
          throw new Error(`Failed to create and confirm multiple transactions: ${error.message}`);
        }
      }
    );
  });

  /**
   * Test case: Create multiple queued transactions and reject them.
   * This test simulates a user initiating multiple transactions and rejecting them in sequence.
   */
  it('creates multiple queued transactions, then rejects', async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        ganacheOptions: generateGanacheOptions({ hardfork: 'london' }),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        try {
          await unlockWallet(driver);

          const homePage = new HomePage(driver);
          const confirmTransactionPage = new ConfirmTransactionPage(driver);

          await openDapp(driver);
          await driver.clickElement({ text: 'Send EIP 1559 Transaction', tag: 'button' });
          await driver.waitUntilXWindowHandles(3);
          await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);

          await driver.clickElement({ text: 'Send EIP 1559 Transaction', tag: 'button' });
          await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

          await driver.waitForSelector({ text: 'Reject 2 transactions', tag: 'a' });
          await driver.clickElement({ text: 'Reject', tag: 'button' });
          await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

          await driver.assertElementNotPresent('.page-container__footer-secondary a');
          await driver.clickElement({ text: 'Reject', tag: 'button' });

          await driver.waitUntilXWindowHandles(2);
          await driver.switchToWindowWithTitle(WINDOW_TITLES.ExtensionInFullScreenView);
          await driver.delay(regularDelayMs);

          await homePage.goToActivityList();
          await homePage.check_completedTxNumberDisplayedInActivity(0);
        } catch (error) {
          console.error('Error in multiple transactions rejection test:', error);
          throw new Error(`Failed to create and reject multiple transactions: ${(error as Error).message}`);
        }
      }
    );
  });
});
