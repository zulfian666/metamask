import { strict as assert } from 'assert';
import { Context } from 'mocha';
import { CHAIN_IDS } from '../../../../shared/constants/network';
import FixtureBuilder from '../../fixture-builder';
import {
  defaultGanacheOptions,
  openActionMenuAndStartSendFlow,
  unlockWallet,
  withSetUp,
} from '../../helpers';
import { Driver } from '../../webdriver/driver';
import { RECIPIENT_ADDRESS_MOCK } from '../simulation-details/types';

describe('AssetPickerSendFlow', function () {
  const chainId = CHAIN_IDS.MAINNET;

  const fixtures = {
    fixtures: new FixtureBuilder({ inputChainId: chainId }).build(),
    ganacheOptions: {
      ...defaultGanacheOptions,
      chainId: parseInt(chainId, 16),
    },
  };

  it('should send token using asset picker modal', async function () {
    const ethConversionInUsd = 10000;

    await withSetUp(
      {
        ...fixtures,
        title: (this as Context).test?.fullTitle(),
        ethConversionInUsd,
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        // Open the send flow
        openActionMenuAndStartSendFlow(driver);

        await driver.fill('[data-testid="ens-input"]', RECIPIENT_ADDRESS_MOCK);
        await driver.fill('.unit-input__input', '2');

        const isDest = 'dest';
        const buttons = await driver.findElements(
          '[data-testid="asset-picker-button"]',
        );
        const indexOfButtonToClick = isDest ? 1 : 0;
        await buttons[indexOfButtonToClick].click();

        // check that the name , crypto amount and fiat amount are correctly displayed
        const tokenListName = await (
          await driver.findElement(
            '[data-testid="multichain-token-list-item-token-name"]',
          )
        ).getText();

        assert.equal(tokenListName, 'Ethereum');

        const tokenListValue = await (
          await driver.findElement(
            '[data-testid="multichain-token-list-item-value"]',
          )
        ).getText();

        assert.equal(tokenListValue, '25 ETH');

        const tokenListSecondaryValue = await (
          await driver.findElement(
            '[data-testid="multichain-token-list-item-secondary-value"]',
          )
        ).getText();

        assert.equal(tokenListSecondaryValue, '$250,000.00');

        // Search for BNB
        const searchInputField = await driver.waitForSelector(
          '[data-testid="asset-picker-modal-search-input"]',
        );
        await searchInputField.sendKeys('CHZ');

        // check that BNB is disabled
        const [, tkn] = await driver.findElements(
          '[data-testid="multichain-token-list-button"]',
        );

        await tkn.click();
        const isSelected = await tkn.isSelected();
        assert.equal(isSelected, false);
      },
    );
  });
});
