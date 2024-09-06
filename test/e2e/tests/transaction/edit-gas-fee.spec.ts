import { Suite } from 'mocha';
import {
  withFixtures,
  openDapp,
  unlockWallet,
  generateGanacheOptions,
  WINDOW_TITLES,
} from '../../helpers';
import FixtureBuilder = require('../../fixture-builder');
import { Driver } from '../../webdriver/driver';
import EditGasFeePage from '../../page-objects/pages/edit-gas-fee-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';
import HomePage from '../../page-objects/pages/homepage';

describe('Editing Confirm Transaction', function (this: Suite) {
  it('allows selecting high, medium, low gas estimates on edit gas fee popover @no-mmi', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withTransactionControllerTypeTwoTransaction()
          .build(),
        ganacheOptions: generateGanacheOptions({ hardfork: 'london' }),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        const editGasFeePage = new EditGasFeePage(driver);
        const confirmTransactionPage = new ConfirmTransactionPage(driver);
        const homePage = new HomePage(driver);

        await confirmTransactionPage.validateSendAmount('1');

        // Update estimates to high
        await editGasFeePage.openEditGasFeePopover();
        await editGasFeePage.selectGasOption('high');
        await editGasFeePage.waitForGasOptionLabel('Aggressive');

        // Update estimates to medium
        await editGasFeePage.openEditGasFeePopover();
        await editGasFeePage.selectGasOption('medium');
        await editGasFeePage.waitForGasOptionLabel('Market');

        // Update estimates to low
        await editGasFeePage.openEditGasFeePopover();
        await editGasFeePage.selectGasOption('low');
        await editGasFeePage.waitForGasOptionLabel('Slow');
        await editGasFeePage.waitForLowGasFeeAlert();

        // Confirm the transaction
        await confirmTransactionPage.confirmTransaction();

        // Verify transaction in activity list
        await homePage.goToActivityList();
        await homePage.check_completedTxNumberDisplayedInActivity();
        await homePage.check_txAmountInActivity('-1 ETH');
      },
    );
  });

  it('allows accessing advance gas fee popover from edit gas fee popover', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withTransactionControllerTypeTwoTransaction()
          .build(),
        ganacheOptions: generateGanacheOptions({ hardfork: 'london' }),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        const editGasFeePage = new EditGasFeePage(driver);
        const confirmTransactionPage = new ConfirmTransactionPage(driver);
        const homePage = new HomePage(driver);

        await confirmTransactionPage.validateSendAmount('1');

        await editGasFeePage.openEditGasFeePopover();
        await editGasFeePage.openAdvancedGasFeePopover();

        await editGasFeePage.setBaseFee('8.5');
        await editGasFeePage.setPriorityFee('8.5');
        await editGasFeePage.saveDefaultValues();
        await editGasFeePage.editGasLimit('100000');

        await editGasFeePage.saveChanges();

        await confirmTransactionPage.validateGasFee('0.00085');
        await confirmTransactionPage.confirmTransaction();

        await homePage.goToActivityList();
        await homePage.check_completedTxNumberDisplayedInActivity();
        await homePage.check_txAmountInActivity('-1 ETH');
      },
    );
  });
});
