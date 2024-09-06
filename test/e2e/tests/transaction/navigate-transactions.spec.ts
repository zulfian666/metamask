import { Suite } from 'mocha';
import { strict as assert } from 'assert';
import { Driver } from '../../webdriver/driver';
import {
  withFixtures,
  openDapp,
  unlockWallet,
  generateGanacheOptions,
} from '../../helpers';
import FixtureBuilder = require('../../fixture-builder');
import HomePage from '../../page-objects/pages/home-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';

describe('Navigate transactions', function (this: Suite) {
  it('should navigate the unapproved transactions', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withPreferencesControllerTxSimulationsDisabled()
          .withTransactionControllerMultipleTransactions()
          .build(),
        ganacheOptions: generateGanacheOptions({ hardfork: 'london' }),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        const homePage = new HomePage(driver);
        await homePage.waitForTotalAmountToLoad('3.0000315');

        const confirmTransactionPage = new ConfirmTransactionPage(driver);
        await confirmTransactionPage.navigateTransactions();
      },
    );
  });
});
