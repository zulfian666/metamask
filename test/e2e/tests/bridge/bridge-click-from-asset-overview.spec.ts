import { Suite } from 'mocha';
import { withFixtures, logInWithBalanceValidation } from '../../helpers';
import { Ganache } from '../../seeder/ganache';
import GanacheContractAddressRegistry from '../../seeder/ganache-contract-address-registry';
import { Driver } from '../../webdriver/driver';
import { BridgePage, getBridgeFixtures } from './bridge-test-utils';

describe('Click bridge button from asset page @no-mmi', function (this: Suite) {
  it('loads portfolio tab when flag is turned off', async function () {
    await withFixtures(
      // withErc20 param is false, as we test it manually below
      getBridgeFixtures(this.test?.fullTitle(), undefined, false),
      async ({
        driver,
        ganacheServer,
        contractRegistry,
      }: {
        driver: Driver;
        ganacheServer: Ganache;
        contractRegistry: GanacheContractAddressRegistry;
      }) => {
        const bridgePage = new BridgePage(driver);
        await logInWithBalanceValidation(driver, ganacheServer);

        // ETH
        await bridgePage.loadAssetPage(contractRegistry);
        await bridgePage.load('coin-overview');
        await bridgePage.verifyPortfolioTab(
          'https://portfolio.metamask.io/bridge?metametricsId=null',
        );

        await bridgePage.reloadHome();

        // TST
        await bridgePage.loadAssetPage(contractRegistry, 'TST');
        await bridgePage.load('token-overview');
        await bridgePage.verifyPortfolioTab(
          'https://portfolio.metamask.io/bridge?metametricsId=null',
        );
      },
    );
  });
});
