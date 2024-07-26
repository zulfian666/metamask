import { ControllerMessenger } from '@metamask/base-controller';
import { KeyringController } from '@metamask/keyring-controller';
import { wordlist } from '@metamask/scure-bip39/dist/wordlists/english';
import { UI_NOTIFICATIONS } from '../../shared/notifications';
import { E2E_SRP, defaultFixture } from '../../test/e2e/default-fixture';
import { encryptorFactory } from './lib/encryptor-factory';

import { FIXTURES_NETWORKS } from './fixtures/with-networks';
import { FIXTURES_PREFERENCES } from './fixtures/with-preferences';
import { FIXTURES_ADDRESS_BOOK } from './fixtures/with-address-book';
import { FIXTURES_TRANSACTIONS } from './fixtures/with-transactions';
import { FIXTURES_ERC20_TOKENS } from './fixtures/with-tokens';
import { FIXTURES_METAMASK_NOTIFICATIONS } from './fixtures/with-notifications';

const stateGenerators = {
  networks: generateNetworkControllerState,
  addressBook: generateAddressBookControllerState,
  preferences: generatePreferencesControllerState,
  keyrings: generateKeyringControllerState,
  accounts: generateAccountsControllerState,
}

export async function generateWalletState() {
  const state = defaultFixture('0xaa36a7').data;

  state.AppStateController = generateAppStateControllerState();
  state.AnnouncementController = generateAnnouncementControllerState();
  state.NetworkController = generateNetworkControllerState();
  state.AddressBookController = generateAddressBookControllerState();
  state.PreferencesController = generatePreferencesControllerState();
  state.TransactionController = generateTransactionControllerState();
  state.TokensController = generateTokensControllerState();
  state.MetamaskNotificationsController = generateMetamaskNotificationsControllerState();

  if (process.env.PASSWORD) {
    const { vault, account } = await generateVaultAndAccount(
      process.env.TEST_SRP || E2E_SRP,
      process.env.PASSWORD,
    );

    state.KeyringController = generateKeyringControllerState(vault);
    state.AccountsController = generateAccountsControllerState(account);
  }

  return state;
}

// dismiss product tour
function generateAppStateControllerState() {
  return {
    ...defaultFixture().data.AppStateController,
    showProductTour: false,
  };
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

  return {
    ...defaultFixture().data.AnnouncementController,
    announcements: {
      ...defaultFixture().data.AnnouncementController.announcements,
      ...allAnnouncementsAlreadyShown,
    },
  };
}

// configure 'Sepolia' network
// TODO: Support for local node
function generateNetworkControllerState() {
  return {
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
      ...FIXTURES_NETWORKS,
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
    ...defaultFixture().data.AccountsController,
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
        'account-id': {
          id: 'account-id',
          address: account,
          metadata: {
            name: 'Account 2',
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

function generatePreferencesControllerState() {
  return {
    ...defaultFixture().data.PreferencesController,
    preferences: {
      ...FIXTURES_PREFERENCES,
    },
  };
}

function generateAddressBookControllerState() {
  return {
    ...defaultFixture().data.AddressBookController,
    addressBook: {
      ...FIXTURES_ADDRESS_BOOK,
    },
  };
}


function generateTransactionControllerState() {
  return {
    ...defaultFixture().data.TransactionController,
    transactions: {
      ...FIXTURES_TRANSACTIONS,
    },
  };
}

function generateTokensControllerState() {
  return {
    ...defaultFixture().data.TokensController,
    transactions: {
      ...FIXTURES_ERC20_TOKENS,
    },
  };
}

function generateMetamaskNotificationsControllerState() {
  return {
    ...defaultFixture().data.MetamaskNotificationsController,
    notifications: {
      ...FIXTURES_METAMASK_NOTIFICATIONS,
    },
  };
}