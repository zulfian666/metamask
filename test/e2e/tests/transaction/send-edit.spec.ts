import { Suite } from 'mocha';
import { strict as assert } from 'assert';
import { Driver } from '../../webdriver/driver';
import {
  withFixtures,
  defaultGanacheOptions,
  unlockWallet,
  generateGanacheOptions,
} from '../../helpers';
import FixtureBuilder = require('../../fixture-builder');
import HomePage from '../../page-objects/pages/home/home-page';
import SendTokenPage from '../../page-objects/pages/send/send-token-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';
import EditGasFeePage from '../../page-objects/pages/edit-gas-fee-page';

describe('Editing Confirm Transaction', function (this: Suite) {
  it('goes back from confirm page to edit eth value, gas price and gas limit', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withTransactionControllerTypeOneTransaction()
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        const confirmTransactionPage = new ConfirmTransactionPage(driver);
        await confirmTransactionPage.validateSendAmount('1');
        await confirmTransactionPage.validateGasFee('0.00025');

        const sendTokenPage = new SendTokenPage(driver);
        await sendTokenPage.clickBackButton();
        await sendTokenPage.inputAmount('2.2');
        await sendTokenPage.clickContinue();

        const editGasFeePage = new EditGasFeePage(driver);
        await editGasFeePage.openEditGasFeePopover();
        await editGasFeePage.setGasPrice('8');
        await editGasFeePage.setGasLimit('100000');
        await editGasFeePage.saveChanges();

        await confirmTransactionPage.validateGasFee('0.0008');
        await confirmTransactionPage.confirmTransaction();

        const homePage = new HomePage(driver);
        await homePage.goToActivityList();
        await homePage.check_completedTxNumberDisplayedInActivity();
        await homePage.check_txAmountInActivity('-2.2 ETH');
      },
    );
  });
});
