import migration78 from './078';

describe('migration #78', () => {
  it('should update the version metadata', async () => {
    const oldStorage = {
      meta: {
        version: 77,
      },
    };

    const newStorage = await migration78.migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({
      version: 78,
    });
  });

  it('should remove the "collectiblesDetectionNoticeDismissed" and "collectiblesDropdownState"', async () => {
    const oldStorage = {
      meta: {
        version: 77,
      },
      data: {
        metamask: {
          collectiblesDetectionNoticeDismissed: false,
          collectiblesDropdownState: {},
        },
      },
    };

    const newStorage = await migration78.migrate(oldStorage);
    expect(newStorage).toStrictEqual({
      meta: {
        version: 78,
      },
      data: {
        metamask: {
          nftDetectionNoticeDismissed: false,
          nftsDropdownState: {},
        },
      },
    });
  });

  it('should make no changes if "collectiblesDetectionNoticeDismissed" never existed', async () => {
    const oldStorage = {
      meta: {
        version: 77,
      },
      data: {
        metamask: {
          isInitialized: true,
          isUnlocked: true,
          isAccountMenuOpen: false,
          identities: {
            '0x00000': {
              address: '0x00000',
              lastSelected: 1675966229118,
              name: 'Account 1',
            },
            '0x00001': {
              address: '0x00001',
              name: 'Account 2',
            },
          },
          unapprovedTxs: {},
          frequentRpcList: [],
          addressBook: {},
          popupGasPollTokens: [],
          notificationGasPollTokens: [],
          fullScreenGasPollTokens: [],
          recoveryPhraseReminderHasBeenShown: false,
          recoveryPhraseReminderLastShown: 1675966206345,
          outdatedBrowserWarningLastShown: 1675966206345,
          showTestnetMessageInDropdown: true,
          showBetaHeader: false,
          trezorModel: null,
          qrHardware: {},
        },
      },
    };

    const newStorage = await migration78.migrate(oldStorage);
    expect(newStorage).toStrictEqual({
      meta: {
        version: 78,
      },
      data: {
        metamask: {
          isInitialized: true,
          isUnlocked: true,
          isAccountMenuOpen: false,
          identities: {
            '0x00000': {
              address: '0x00000',
              lastSelected: 1675966229118,
              name: 'Account 1',
            },
            '0x00001': {
              address: '0x00001',
              name: 'Account 2',
            },
          },
          unapprovedTxs: {},
          frequentRpcList: [],
          addressBook: {},
          popupGasPollTokens: [],
          notificationGasPollTokens: [],
          fullScreenGasPollTokens: [],
          recoveryPhraseReminderHasBeenShown: false,
          recoveryPhraseReminderLastShown: 1675966206345,
          outdatedBrowserWarningLastShown: 1675966206345,
          showTestnetMessageInDropdown: true,
          showBetaHeader: false,
          trezorModel: null,
          qrHardware: {},
        },
      },
    });
  });
  it('should make no changes if "collectiblesDropdownState" never existed', async () => {
    const oldStorage = {
      meta: {
        version: 77,
      },
      data: {
        metamask: {
          isInitialized: true,
          isUnlocked: true,
          isAccountMenuOpen: false,
          identities: {
            '0x00000': {
              address: '0x00000',
              lastSelected: 1675966229118,
              name: 'Account 1',
            },
            '0x00001': {
              address: '0x00001',
              name: 'Account 2',
            },
          },
          unapprovedTxs: {},
          frequentRpcList: [],
          addressBook: {},
          popupGasPollTokens: [],
          notificationGasPollTokens: [],
          fullScreenGasPollTokens: [],
          recoveryPhraseReminderHasBeenShown: false,
          recoveryPhraseReminderLastShown: 1675966206345,
          outdatedBrowserWarningLastShown: 1675966206345,
          showTestnetMessageInDropdown: true,
          showBetaHeader: false,
          trezorModel: null,
          qrHardware: {},
        },
      },
    };

    const newStorage = await migration78.migrate(oldStorage);
    expect(newStorage).toStrictEqual({
      meta: {
        version: 78,
      },
      data: {
        metamask: {
          isInitialized: true,
          isUnlocked: true,
          isAccountMenuOpen: false,
          identities: {
            '0x00000': {
              address: '0x00000',
              lastSelected: 1675966229118,
              name: 'Account 1',
            },
            '0x00001': {
              address: '0x00001',
              name: 'Account 2',
            },
          },
          unapprovedTxs: {},
          frequentRpcList: [],
          addressBook: {},
          popupGasPollTokens: [],
          notificationGasPollTokens: [],
          fullScreenGasPollTokens: [],
          recoveryPhraseReminderHasBeenShown: false,
          recoveryPhraseReminderLastShown: 1675966206345,
          outdatedBrowserWarningLastShown: 1675966206345,
          showTestnetMessageInDropdown: true,
          showBetaHeader: false,
          trezorModel: null,
          qrHardware: {},
        },
      },
    });
  });
});
