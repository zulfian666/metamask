import { Suite } from 'mocha';
import { strict as assert } from 'assert';
import { Driver } from '../../webdriver/driver';
import {
  withFixtures,
  openDapp,
  logInWithBalanceValidation,
  openActionMenuAndStartSendFlow,
  unlockWallet,
  WINDOW_TITLES,
  defaultGanacheOptions,
} from '../../helpers';
import FixtureBuilder = require('../../fixture-builder');
import { SMART_CONTRACTS } from '../../seeder/smart-contracts';
import HomePage from '../../page-objects/pages/home-page';
import SendTokenPage from '../../page-objects/pages/send/send-token-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';

describe('Send ETH', function (this: Suite) {
  describe('from inside MetaMask', function () {
    it('finds the transaction in the transactions list using default gas', async function () {
      await withFixtures(
        {
          fixtures: new FixtureBuilder().build(),
          ganacheOptions: defaultGanacheOptions,
          title: this.test?.fullTitle(),
        },
        async ({ driver, ganacheServer }: { driver: Driver; ganacheServer: any }) => {
          await logInWithBalanceValidation(driver, ganacheServer);

          const homePage = new HomePage(driver);
          await homePage.startSendFlow();

          const sendTokenPage = new SendTokenPage(driver);
          await sendTokenPage.fillRecipient('0x2f318C334780961FB129D2a6c30D0763d9a5C970');
          await sendTokenPage.inputAmount('1000');

          // Check for insufficient funds error
          await sendTokenPage.check_insufficientFundsError();

          // Clear the amount
          await sendTokenPage.clearAmount();

          // Check that the error is gone
          await sendTokenPage.check_noInsufficientFundsError();

          // Use max amount
          await sendTokenPage.clickMaxButton();
          await sendTokenPage.check_amountExceeds24();

          // Clear and set amount to 1
          await sendTokenPage.clearAmount();
          await sendTokenPage.inputAmount('1');

          await sendTokenPage.clickContinue();

          const confirmTransactionPage = new ConfirmTransactionPage(driver);
          await confirmTransactionPage.confirmTransaction();

          await homePage.goToActivityList();
          await homePage.check_completedTxNumberDisplayedInActivity();
          await homePage.check_txAmountInActivity('-1 ETH');
        },
      );
    });

    // ... Rest of the test cases will be implemented in subsequent edits
  });
});
