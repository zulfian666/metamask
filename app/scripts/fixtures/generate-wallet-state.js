import { ControllerMessenger } from '@metamask/base-controller';
import { KeyringController } from '@metamask/keyring-controller';
import { wordlist } from '@metamask/scure-bip39/dist/wordlists/english';
import { UI_NOTIFICATIONS } from '../../../shared/notifications';
import { E2E_SRP, defaultFixture } from '../../../test/e2e/default-fixture';
import FixtureBuilder from '../../../test/e2e/fixture-builder';
import { encryptorFactory } from '../lib/encryptor-factory';
import FIXTURES_CONFIG from './fixtures-config';
import { FIXTURES_ADDRESS_BOOK } from './with-address-book';
import { FIXTURES_APP_STATE } from './with-app-state';
import { FIXTURES_CONFIRMED_TRANSACTIONS } from './with-confirmed-transactions';
import { FIXTURES_NETWORKS } from './with-networks';
import { FIXTURES_PREFERENCES } from './with-preferences';
import { FIXTURES_READ_NOTIFICATIONS } from './with-read-notifications';
import { FIXTURES_ERC20_TOKENS } from './with-erc20-tokens';
import { FIXTURES_UNREAD_NOTIFICATIONS } from './with-unread-notifications';

export async function generateWalletState(config = FIXTURES_CONFIG) {
  const fixtureBuilder = new FixtureBuilder({ inputChainId: '0xaa36a7' });

  const { vault, account } = await generateVaultAndAccount(
    process.env.TEST_SRP || E2E_SRP,
    process.env.PASSWORD,
  );

  fixtureBuilder
    .withKeyringController(generateKeyringControllerState(vault))
    .withAccountsController(generateAccountsControllerState(account))
    .withAddressBookController(generateAddressBookControllerState(config))
    .withAnnouncementController(generateAnnouncementControllerState())
    .withAppStateController(FIXTURES_APP_STATE)
    .withMetamaskNotificationsController(
      generateMetamaskNotificationsControllerState(config),
    )
    .withNetworkController(generateNetworkControllerState(config))
    .withPreferencesController(generatePreferencesControllerState(config))
    .withTokensController(
      generateTokensControllerState(account, FIXTURES_ERC20_TOKENS, config),
    )
    .withTransactionController(
      generateTransactionControllerState(account, config),
    );

  return fixtureBuilder.fixture.data;
}

async function generateVaultAndAccount(encodedSeedPhrase, password) {
  const controllerMessenger = new ControllerMessenger();
  const keyringControllerMessenger = controllerMessenger.getRestricted({
    name: 'KeyringController',
  });
  const krCtrl = new KeyringController({
    encryptor: encryptorFactory(600_000),
    messenger: keyringControllerMessenger,
  });

  const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase);
  const _convertMnemonicToWordlistIndices = (mnemonic) => {
    const indices = mnemonic
      .toString()
      .split(' ')
      .map((word) => wordlist.indexOf(word));
    return new Uint8Array(new Uint16Array(indices).buffer);
  };

  await krCtrl.createNewVaultAndRestore(
    password,
    _convertMnemonicToWordlistIndices(seedPhraseAsBuffer),
  );

  const { vault } = krCtrl.state;
  const account = krCtrl.state.keyrings[0].accounts[0];

  return { vault, account };
}

function generateKeyringControllerState(vault) {
  return {
    ...defaultFixture().data.KeyringController,
    vault,
  };
}

function generateAccountsControllerState(account) {
  return {
    internalAccounts: {
      selectedAccount: 'account-id',
      accounts: {
        'account-id': {
          id: 'account-id',
          address: account,
          metadata: {
            name: 'Account 1',
            lastSelected: 1665507600000,
            keyring: {
              type: 'HD Key Tree',
            },
          },
          options: {},
          methods: [
            'personal_sign',
            'eth_sign',
            'eth_signTransaction',
            'eth_signTypedData_v1',
            'eth_signTypedData_v3',
            'eth_signTypedData_v4',
          ],
          type: 'eip155:eoa',
        },
      },
    },
  };
}

function generateAddressBookControllerState(config) {
  if (config.withAddressBook) {
    return FIXTURES_ADDRESS_BOOK;
  }
  return {};
}

// dismiss 'what's new' modals
function generateAnnouncementControllerState() {
  const allAnnouncementsAlreadyShown = Object.keys(UI_NOTIFICATIONS).reduce(
    (acc, val) => {
      acc[val] = {
        ...UI_NOTIFICATIONS[val],
        isShown: true,
      };
      return acc;
    },
    {},
  );

  return allAnnouncementsAlreadyShown;
}

function generateMetamaskNotificationsControllerState(config) {
  const notifications = {};

  if (config.withReadNotifications) {
    Object.assign(notifications, FIXTURES_READ_NOTIFICATIONS);
  }

  if (config.withUnreadNotifications) {
    Object.assign(notifications, FIXTURES_UNREAD_NOTIFICATIONS);
  }

  return notifications;
}

function generateNetworkControllerState(config) {
  const defaultNetworkState = {
    ...defaultFixture().data.NetworkController,
    providerConfig: {
      chainId: '0xaa36a7',
      rpcPrefs: {
        blockExplorerUrl: 'https://sepolia.etherscan.io',
      },
      ticker: 'SepoliaETH',
      type: 'sepolia',
    },
    networkConfigurations: {
      networkConfigurationId: {
        chainId: '0xaa36a7',
        nickname: 'Sepolia',
        rpcPrefs: {},
        rpcUrl: 'https://sepolia.infura.io/v3/6c21df2a8dcb4a77b9bbcc1b65ee9ded',
        ticker: 'SepoliaETH',
        networkConfigurationId: 'networkConfigurationId',
      },
    },
  };

  if (config.withNetworks) {
    return {
      ...defaultNetworkState,
      ...FIXTURES_NETWORKS,
    };
  }
  return defaultNetworkState;
}

function generatePreferencesControllerState(config) {
  if (config.withPreferences) {
    return FIXTURES_PREFERENCES;
  }
  return {};
}

function generateTokensControllerState(account, tokens, config) {
  if (config.withErc20Tokens) {
    // Update the `address` key in all tokens
    for (const token of tokens.tokens) {
      updateAddressKey(token, account);
    }
    return tokens;
  }
  return {};
}

function generateTransactionControllerState(account, config) {
  const transactions = {};

  if (config.withConfirmedTransactions) {
    // Update the `from` key in all confirmed transactions
    for (const txId in FIXTURES_CONFIRMED_TRANSACTIONS) {
      if (
        Object.prototype.hasOwnProperty.call(
          FIXTURES_CONFIRMED_TRANSACTIONS,
          txId,
        )
      ) {
        transactions[txId] = updateFromKey(
          FIXTURES_CONFIRMED_TRANSACTIONS[txId],
          account,
        );
      }
    }
  }

  return transactions;
}

// Helper functions to update fixtures data dynamically
function updateKey(obj, targetKey, newValue) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === targetKey) {
        obj[key] = newValue;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        updateKey(obj[key], targetKey, newValue);
      }
    }
  }
  return obj;
}

function updateAddressKey(obj, newAddress) {
  return updateKey(obj, 'address', newAddress);
}

function updateFromKey(obj, account) {
  return updateKey(obj, 'from', account);
}
