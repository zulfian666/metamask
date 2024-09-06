import { Suite } from 'mocha';
import { Driver } from '../../webdriver/driver';
import {
  defaultGanacheOptions,
  withFixtures,
} from '../../helpers';
import { SMART_CONTRACTS } from '../../seeder/smart-contracts';
import FixtureBuilder = require('../../fixture-builder');
import { loginWithBalanceValidation } from '../../page-objects/flows/login.flow';
import HomePage from '../../page-objects/pages/home-page';
import SendTokenPage from '../../page-objects/pages/send/send-token-page';
import ConfirmTransactionPage from '../../page-objects/pages/confirm-transaction-page';

const hexPrefixedAddress = '0x2f318C334780961FB129D2a6c30D0763d9a5C970';
const nonHexPrefixedAddress = hexPrefixedAddress.substring(2);

describe('Send ETH to a 40 character hexadecimal address', function (this: Suite) {
  it('should ensure the address is prefixed with 0x when pasted and should send ETH to a valid hexadecimal address', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withPreferencesControllerPetnamesDisabled()
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },
      async ({ driver, ganacheServer }: { driver: Driver; ganacheServer: any }) => {
        await loginWithBalanceValidation(driver, ganacheServer);

        const homePage = new HomePage(driver);
        const sendTokenPage = new SendTokenPage(driver);
        const confirmTransactionPage = new ConfirmTransactionPage(driver);

        await homePage.startSendFlow();
        await sendTokenPage.fillRecipient(nonHexPrefixedAddress);
        await sendTokenPage.validateAddressFormatting('0x2f318...5C970');
        await sendTokenPage.clickContinue();

        await confirmTransactionPage.confirmTransaction();

        await homePage.goToActivityList();
        await homePage.openFirstActivityLogItem();
        await homePage.openActivityDetails();
        await homePage.clickRecipientAddress();
        await homePage.validateAddressInActivityLog(hexPrefixedAddress);
      },
    );
  });

  // ... Rest of the test cases will be implemented in subsequent edits
});
