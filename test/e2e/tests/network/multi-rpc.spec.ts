import { strict as assert } from 'assert';
import { Suite } from 'mocha';
import FixtureBuilder from '../../fixture-builder';
import {
  defaultGanacheOptions,
  importSRPOnboardingFlow,
  regularDelayMs,
  TEST_SEED_PHRASE,
  unlockWallet,
  withFixtures,
} from '../../helpers';
import { Driver } from '../../webdriver/driver';
import { Mockttp } from '../../mock-e2e';

describe('MultiRpc:', function (this: Suite) {
  it('should migrate to multi rpc', async function () {
    async function mockRPCURLAndChainId(mockServer: Mockttp) {
      return [
        await mockServer
          .forPost('https://responsive-rpc.test/')
          .thenCallback(() => ({
            statusCode: 200,
            json: {
              id: '1694444405781',
              jsonrpc: '2.0',
              result: '0xa4b1',
            },
          })),
      ];
    }
    await withFixtures(
      {
        fixtures: new FixtureBuilder({ onboarding: true })
          .withNetworkController({
            providerConfig: {
              rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
            },
            networkConfigurations: {
              networkConfigurationId: {
                chainId: '0x539',
                nickname: 'Localhost 8545',
                rpcUrl: 'http://localhost:8545',
                ticker: 'ETH',
                rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
              },
              '2ce66016-8aab-47df-b27f-318c80865eb0': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb0',
                nickname: 'Arbitrum mainnet',
                rpcPrefs: {},
                rpcUrl: 'https://arbitrum-mainnet.infura.io',
                ticker: 'ETH',
              },
              '2ce66016-8aab-47df-b27f-318c80865eb1': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb1',
                nickname: 'Arbitrum mainnet 2',
                rpcPrefs: {},
                rpcUrl: 'https://responsive-rpc.test/',
                ticker: 'ETH',
              },
            },
            selectedNetworkClientId: 'networkConfigurationId',
          })
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
        testSpecificMock: mockRPCURLAndChainId,
      },

      async ({ driver }: { driver: Driver }) => {
        const password = 'password';

        await driver.navigate();

        await importSRPOnboardingFlow(driver, TEST_SEED_PHRASE, password);

        await driver.delay(regularDelayMs);

        // complete
        await driver.clickElement('[data-testid="onboarding-complete-done"]');

        // pin extension
        await driver.clickElement('[data-testid="pin-extension-next"]');
        await driver.clickElement('[data-testid="pin-extension-done"]');

        // pin extension walkthrough screen
        await driver.findElement('[data-testid="account-menu-icon"]');

        // Avoid a stale element error
        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        await driver.clickElement(
          '[data-testid="network-rpc-name-button-0xa4b1"]',
        );
        const menuItems = await driver.findElements('.networks-tab__item');

        // check rpc number
        assert.equal(menuItems.length, 2);
      },
    );
  });

  it('should select rpc from modal', async function () {
    async function mockRPCURLAndChainId(mockServer: Mockttp) {
      return [
        await mockServer
          .forPost('https://responsive-rpc.test/')
          .thenCallback(() => ({
            statusCode: 200,
            json: {
              id: '1694444405781',
              jsonrpc: '2.0',
              result: '0xa4b1',
            },
          })),
      ];
    }
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withNetworkController({
            providerConfig: {
              rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
            },
            networkConfigurations: {
              networkConfigurationId: {
                chainId: '0x539',
                nickname: 'Localhost 8545',
                rpcUrl: 'http://localhost:8545',
                ticker: 'ETH',
                rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
              },
              '2ce66016-8aab-47df-b27f-318c80865eb0': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb0',
                nickname: 'Arbitrum mainnet',
                rpcPrefs: {},
                rpcUrl: 'https://arbitrum-mainnet.infura.io',
                ticker: 'ETH',
              },
              '2ce66016-8aab-47df-b27f-318c80865eb1': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb1',
                nickname: 'Arbitrum mainnet 2',
                rpcPrefs: {},
                rpcUrl: 'https://responsive-rpc.test/',
                ticker: 'ETH',
              },
            },
            selectedNetworkClientId: 'networkConfigurationId',
          })
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
        testSpecificMock: mockRPCURLAndChainId,
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        // Avoid a stale element error
        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        // select second rpc
        await driver.clickElement(
          '[data-testid="network-rpc-name-button-0xa4b1"]',
        );

        await driver.delay(regularDelayMs);
        await driver.clickElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        const arbitrumRpcUsed = await driver.findElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        const existRpcUsed = arbitrumRpcUsed !== undefined;
        assert.equal(existRpcUsed, true, 'Second Rpc is used');
      },
    );
  });

  it('should select rpc from edit menu', async function () {
    async function mockRPCURLAndChainId(mockServer: Mockttp) {
      return [
        await mockServer
          .forPost('https://responsive-rpc.test/')
          .thenCallback(() => ({
            statusCode: 200,
            json: {
              id: '1694444405781',
              jsonrpc: '2.0',
              result: '0xa4b1',
            },
          })),
      ];
    }
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withNetworkController({
            providerConfig: {
              rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
            },
            networkConfigurations: {
              networkConfigurationId: {
                chainId: '0x539',
                nickname: 'Localhost 8545',
                rpcUrl: 'http://localhost:8545',
                ticker: 'ETH',
                rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
              },
              '2ce66016-8aab-47df-b27f-318c80865eb0': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb0',
                nickname: 'Arbitrum mainnet',
                rpcPrefs: {},
                rpcUrl: 'https://arbitrum-mainnet.infura.io',
                ticker: 'ETH',
              },
              '2ce66016-8aab-47df-b27f-318c80865eb1': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb1',
                nickname: 'Arbitrum mainnet 2',
                rpcPrefs: {},
                rpcUrl: 'https://responsive-rpc.test/',
                ticker: 'ETH',
              },
            },
            selectedNetworkClientId: 'networkConfigurationId',
          })
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
        testSpecificMock: mockRPCURLAndChainId,
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);

        // Avoid a stale element error
        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        // Go to Edit Menu
        const networkMenu = await driver.findElement(
          '[data-testid="network-list-item-options-button-0xa4b1"]',
        );
        await networkMenu.click();

        const editButton = await driver.findElement(
          '[data-testid="network-list-item-options-edit"]',
        );
        editButton.click();

        const rpcButtonMenu = await driver.findElement(
          '[data-testid="test-add-rpc-drop-down"]',
        );
        rpcButtonMenu.click();

        await driver.delay(regularDelayMs);
        await driver.clickElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        await driver.clickElement({
          text: 'Save',
          tag: 'button',
        });

        // Validate the network was edited
        const networkEdited = await driver.isElementPresent({
          text: '“Arbitrum One” was successfully edited!',
        });
        assert.equal(
          networkEdited,
          true,
          '“Arbitrum One” was successfully edited!',
        );

        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        const arbitrumRpcUsed = await driver.findElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        const existRpcUsed = arbitrumRpcUsed !== undefined;
        assert.equal(existRpcUsed, true, 'Second Rpc is used');
      },
    );
  });

  it('should select rpc from settings', async function () {
    async function mockRPCURLAndChainId(mockServer: Mockttp) {
      return [
        await mockServer
          .forPost('https://responsive-rpc.test/')
          .thenCallback(() => ({
            statusCode: 200,
            json: {
              id: '1694444405781',
              jsonrpc: '2.0',
              result: '0xa4b1',
            },
          })),
      ];
    }
    await withFixtures(
      {
        fixtures: new FixtureBuilder({ onboarding: true })
          .withNetworkController({
            providerConfig: {
              rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
            },
            networkConfigurations: {
              networkConfigurationId: {
                chainId: '0x539',
                nickname: 'Localhost 8545',
                rpcUrl: 'http://localhost:8545',
                ticker: 'ETH',
                rpcPrefs: { blockExplorerUrl: 'https://etherscan.io/' },
              },
              '2ce66016-8aab-47df-b27f-318c80865eb0': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb0',
                nickname: 'Arbitrum mainnet',
                rpcPrefs: {},
                rpcUrl: 'https://arbitrum-mainnet.infura.io',
                ticker: 'ETH',
              },
              '2ce66016-8aab-47df-b27f-318c80865eb1': {
                chainId: '0xa4b1',
                id: '2ce66016-8aab-47df-b27f-318c80865eb1',
                nickname: 'Arbitrum mainnet 2',
                rpcPrefs: {},
                rpcUrl: 'https://responsive-rpc.test/',
                ticker: 'ETH',
              },
            },
            selectedNetworkClientId: 'networkConfigurationId',
          })
          .build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
        testSpecificMock: mockRPCURLAndChainId,
      },

      async ({ driver }: { driver: Driver }) => {
        const password = 'password';

        await driver.navigate();

        await importSRPOnboardingFlow(driver, TEST_SEED_PHRASE, password);

        await driver.delay(regularDelayMs);

        // go to advanced settigns
        await driver.clickElement({
          text: 'Advanced configuration',
        });

        // open edit modal
        await driver.clickElement({
          text: 'arbitrum-mainnet.infura.io',
          tag: 'p',
        });

        const rpcButtonMenu = await driver.findElement(
          '[data-testid="test-add-rpc-drop-down"]',
        );
        rpcButtonMenu.click();

        await driver.delay(regularDelayMs);
        await driver.clickElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        await driver.clickElement({
          text: 'Save',
          tag: 'button',
        });

        await driver.clickElement({
          text: 'Done',
          tag: 'button',
        });

        // Validate the network was edited
        const networkEdited = await driver.isElementPresent({
          text: '“Arbitrum One” was successfully edited!',
        });
        assert.equal(
          networkEdited,
          true,
          '“Arbitrum One” was successfully edited!',
        );

        await driver.delay(regularDelayMs);
        await driver.clickElement('[data-testid="network-display"]');

        const arbitrumRpcUsed = await driver.findElement({
          text: 'Arbitrum mainnet 2',
          tag: 'button',
        });

        const existRpcUsed = arbitrumRpcUsed !== undefined;
        assert.equal(existRpcUsed, true, 'Second Rpc is used');
      },
    );
  });
});
