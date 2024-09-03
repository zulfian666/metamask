import { ControllerMessenger } from '@metamask/base-controller';
import { KeyringController } from '@metamask/keyring-controller';
import { wordlist } from '@metamask/scure-bip39/dist/wordlists/english';
import { UI_NOTIFICATIONS } from '../../../shared/notifications';
import { E2E_SRP, defaultFixture } from '../../../test/e2e/default-fixture';
import FixtureBuilder from '../../../test/e2e/fixture-builder';
import { encryptorFactory } from '../lib/encryptor-factory';
import FIXTURES_CONFIG from './fixtures-flags';
import { FIXTURES_APP_STATE } from './with-app-state';
import { FIXTURES_NETWORKS } from './with-networks';
import { FIXTURES_PREFERENCES } from './with-preferences';
import { FIXTURES_ERC20_TOKENS } from './with-erc20-tokens';
import { withAddressBook } from './with-address-book';
import { withConfirmedTransactions } from './with-confirmed-transactions';
import { withUnreadNotifications } from './with-unread-notifications';

/**
 * Generates the wallet state based on the fixtures configuration or the fixtures file.
 *
 * @returns {Promise<object>} The generated wallet state.
 */
export async function generateWalletState() {
  const config = FIXTURES_CONFIG;
  const fixtureBuilder = new FixtureBuilder({ inputChainId: '0xaa36a7' });

  const { vault, accounts } = await generateVaultAndAccount(
    process.env.TEST_SRP || E2E_SRP,
    process.env.PASSWORD,
    config,
  );

  fixtureBuilder
    .withAccountsController(generateAccountsControllerState(accounts))
    .withAddressBookController(generateAddressBookControllerState(config))
    .withAnnouncementController(generateAnnouncementControllerState())
    .withAppStateController(FIXTURES_APP_STATE)
    .withKeyringController(generateKeyringControllerState(vault))
    .withNetworkController(generateNetworkControllerState(config))
    .withNotificationServicesController(
      generateNotificationControllerState(accounts[0], config),
    )
    .withPreferencesController(
      generatePreferencesControllerState(config, accounts),
    )
    .withTokensController(generateTokensControllerState(accounts[0], config))
    .withTransactionController(
      generateTransactionControllerState(accounts[0], config),
    );

  return fixtureBuilder.fixture.data;
}

/**
 * Generates a new vault and account based on the provided seed phrase and password.
 *
 * @param {string} encodedSeedPhrase - The encoded seed phrase.
 * @param {string} password - The password for the vault.
 * @param {object} config - The configuration object.
 * @returns {Promise<{vault: object, account: string}>} The generated vault and account.
 */
async function generateVaultAndAccount(encodedSeedPhrase, password, config) {
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

  const accounts = [];
  const account = krCtrl.state.keyrings[0].accounts[0];
  accounts.push(account);

  for (let i = 1; i < config.withAccounts; i++) {
    const newAccount = await krCtrl.addNewAccount(i);
    accounts.push(newAccount);
  }
  const { vault } = krCtrl.state;

  return { vault, accounts };
}

/**
 * Generates the state for the KeyringController.
 *
 * @param {object} vault - The vault object.
 * @returns {object} The generated KeyringController state.
 */
function generateKeyringControllerState(vault) {
  console.log('Generating KeyringController state');

  return {
    ...defaultFixture().data.KeyringController,
    vault,
  };
}

/**
 * Generates the state for the AccountsController.
 *
 * @param {string} accounts - The account addresses.
 * @returns {object} The generated AccountsController state.
 */
function generateAccountsControllerState(accounts) {
  console.log('Generating AccountsController state');
  const internalAccounts = {
    selectedAccount: 'account-id',
    accounts: {},
  };

  accounts.forEach((account, index) => {
    internalAccounts.accounts[`acount-id-${index}`] = {
      selectedAccount: 'account-id',
      id: 'account-id',
      address: account,
      metadata: {
        name: `Account ${index + 1}`,
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
    };
  });
  return {
    internalAccounts,
  };
}

/**
 * Generates the state for the AddressBookController.
 *
 * @param {object} config - The configuration object.
 * @returns {object} The generated AddressBookController state.
 */
function generateAddressBookControllerState(config) {
  console.log('Generating AddressBookController state');

  const numEntries = config.withContacts;
  if (numEntries > 0) {
    return withAddressBook(numEntries);
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
  console.log('Generating AnnouncementController state');

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
 * Generates the state for the NotificationController.
 *
 * @param {string} account - The account address to add the notifications to.
 * @param {object} config - The configuration object.
 * @returns {object} The generated NotificationController state.
 */
function generateNotificationControllerState(account, config) {
  console.log('Generating NotificationController state');

  let notifications = {};

  if (config.withUnreadNotifications > 0) {
    notifications = withUnreadNotifications(
      account,
      config.withUnreadNotifications,
    );
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
  console.log('Generating NetworkController state');

  const defaultNetworkState = {
    ...defaultFixture().data.NetworkController,
    networkConfigurations: {},
    networksMetadata: {
      sepolia: {
        EIPS: {
          1559: true,
        },
        status: 'available',
      },
    },
    selectedNetworkClientId: 'sepolia',
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
 * @param {string} accounts - The account addresses.
 * @returns {object} The generated PreferencesController state.
 */
function generatePreferencesControllerState(config, accounts) {
  console.log('Generating PreferencesController state');
  let preferencesControllerState = {};

  if (config.withPreferences) {
    preferencesControllerState = FIXTURES_PREFERENCES;
  }

  // Add account identities
  preferencesControllerState.identities = Object.assign(
    ...accounts.map((address, index) => ({
      [address]: {
        address,
        lastSelected: 1725363500048,
        name: `Account ${index + 1}`,
      },
    })),
  );

  preferencesControllerState.lostIdentities = Object.assign(
    ...accounts.map((address, index) => ({
      [address]: {
        address,
        lastSelected: 1725363500048,
        name: `Account ${index + 1}`,
      },
    })),
  );

  return preferencesControllerState;
}

/**
 * Generates the state for the TokensController.
 *
 * @param {string} account - The account address to add the transactions to.
 * @param {object} config - The configuration object.
 * @returns {object} The generated TokensController state.
 */
function generateTokensControllerState(account, config) {
  console.log('Generating TokensController state');

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
  console.log('Generating TransactionController state');

  let transactions = {};

  if (config.withConfirmedTransactions > 0) {
    transactions = withConfirmedTransactions(
      account,
      config.withConfirmedTransactions,
    );
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
