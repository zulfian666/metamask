import { ControllerMessenger } from '@metamask/base-controller';
import { KeyringController } from '@metamask/keyring-controller';
import { wordlist } from '@metamask/scure-bip39/dist/wordlists/english';
import { UI_NOTIFICATIONS } from '../../../shared/notifications';
import { E2E_SRP, defaultFixture } from '../../../test/e2e/default-fixture';
import FixtureBuilder from '../../../test/e2e/fixture-builder';
import { encryptorFactory } from '../lib/encryptor-factory';
import FIXTURES_CONFIG from './fixtures-config';
import FIXTURES_FILE from './fixtures-state.json';
import { FIXTURES_ADDRESS_BOOK } from './with-address-book';
import { FIXTURES_APP_STATE } from './with-app-state';
import { FIXTURES_CONFIRMED_TRANSACTIONS } from './with-confirmed-transactions';
import { FIXTURES_NETWORKS } from './with-networks';
import { FIXTURES_PREFERENCES } from './with-preferences';
import { FIXTURES_READ_NOTIFICATIONS } from './with-read-notifications';
import { FIXTURES_ERC20_TOKENS } from './with-erc20-tokens';
import { FIXTURES_UNREAD_NOTIFICATIONS } from './with-unread-notifications';

/**
 * Generates the wallet state based on the fixtures configuration or the fixtures file.
 *
 * @returns {Promise<object>} The generated wallet state.
 */
export async function generateWalletState() {
  const fixturesFileData = FIXTURES_FILE.data;
  if (Object.keys(fixturesFileData).length !== 0) {
    console.log('Wallet state coming from fixtures-state.json file');
    return fixturesFileData;
  }
  console.log('Wallet state generated according to the fixtures-config file');

  const config = FIXTURES_CONFIG;
  const fixtureBuilder = new FixtureBuilder({ inputChainId: '0xaa36a7' });

  const { vault, account } = await generateVaultAndAccount(
    process.env.TEST_SRP || E2E_SRP,
    process.env.PASSWORD,
  );

  fixtureBuilder
    .withAccountsController(generateAccountsControllerState(account))
    .withAddressBookController(generateAddressBookControllerState(config))
    .withAnnouncementController(generateAnnouncementControllerState())
    .withAppStateController(FIXTURES_APP_STATE)
    .withKeyringController(generateKeyringControllerState(vault))
    .withMetamaskNotificationsController(
      generateMetamaskNotificationsControllerState(config),
    )
    .withNetworkController(generateNetworkControllerState(config))
    .withPreferencesController(generatePreferencesControllerState(config))
    .withTokensController(generateTokensControllerState(account, config))
    .withTransactionController(
      generateTransactionControllerState(account, config),
    );

  return fixtureBuilder.fixture.data;
}

/**
 * Generates a new vault and account based on the provided seed phrase and password.
 *
 * @param {string} encodedSeedPhrase - The encoded seed phrase.
 * @param {string} password - The password for the vault.
 * @returns {Promise<{vault: object, account: string}>} The generated vault and account.
 */
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

/**
 * Generates the state for the KeyringController.
 *
 * @param {object} vault - The vault object.
 * @returns {object} The generated KeyringController state.
 */
function generateKeyringControllerState(vault) {
  return {
    ...defaultFixture().data.KeyringController,
    vault,
  };
}

/**
 * Generates the state for the AccountsController.
 *
 * @param {string} account - The account address.
 * @returns {object} The generated AccountsController state.
 */
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

/**
 * Generates the state for the AddressBookController.
 *
 * @param {object} config - The configuration object.
 * @returns {object} The generated AddressBookController state.
 */
function generateAddressBookControllerState(config) {
  if (config.withAddressBook) {
    return FIXTURES_ADDRESS_BOOK;
  }
  return {};
}

/**
 * Generates the state for the AnnouncementController.
 * All the what's new modals are dismissed for convenience.
 *
 * @returns {object} The generated AnnouncementController state.
 */
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

/**
 * Generates the state for the MetamaskNotificationsController.
 *
 * @param {object} config - The configuration object.
 * @returns {object} The generated MetamaskNotificationsController state.
 */
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

/**
 * Generates the state for the NetworkController.
 * Sepolia is always pre-loaded and set as the active provider.
 *
 * @param {object} config - The configuration object.
 * @returns {object} The generated NetworkController state.
 */
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

/**
 * Generates the state for the PreferencesController.
 *
 * @param {object} config - The configuration object.
 * @returns {object} The generated PreferencesController state.
 */
function generatePreferencesControllerState(config) {
  if (config.withPreferences) {
    return FIXTURES_PREFERENCES;
  }
  return {};
}

/**
 * Generates the state for the TokensController.
 *
 * @param {string} account - The account address to add the transactions to.
 * @param {object} config - The configuration object.
 * @returns {object} The generated TokensController state.
 */
function generateTokensControllerState(account, config) {
  const tokens = FIXTURES_ERC20_TOKENS;
  if (config.withErc20Tokens) {
    // Update the `address` key in all tokens
    for (const token of tokens.tokens) {
      updateKey(token, 'address', account);
    }
    return tokens;
  }
  return {};
}

/**
 * Generates the state for the TransactionController.
 *
 * @param {string} account - The account address to add the transactions to.
 * @param {object} config - The configuration object.
 * @returns {object} The generated TransactionController state.
 */
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
        transactions[txId] = updateKey(
          FIXTURES_CONFIRMED_TRANSACTIONS[txId],
          'from',
          account,
        );
      }
    }
  }

  return transactions;
}

/**
 * Updates the specified key in the given object with a new value.
 *
 * @param {object} obj - The object to update.
 * @param {string} targetKey - The key to update.
 * @param {*} newValue - The new value to set.
 * @returns {object} The updated object.
 */
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
