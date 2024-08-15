import { migrate, version } from './126';
import { SnapEndowments } from '@metamask/snaps-rpc-methods';
import { CaveatFactories, PermissionNames } from '../controllers/permissions';
import { CaveatTypes } from '../../../shared/constants/permissions.ts';
import { CHAIN_IDS, NETWORK_TYPES } from '../../../shared/constants/network.ts';

const oldVersion = 125;
const newVersion = 126;

const MOCK_ORIGIN = 'http://example.com';
const MOCK_SNAP_ID = 'npm:foo-snap';

jest.useFakeTimers();
jest.setSystemTime(1723635247705);

function getMockState(selectedNetworkClientId: string = NETWORK_TYPES.MAINNET, networkConfigurations = {}) {
  return {
    meta: { version: oldVersion },
    data: {
      NetworkController: {
        selectedNetworkClientId,
        networkConfigurations,
      },

      PermissionController: {
        subjects: {
          [MOCK_SNAP_ID]: {
            permissions: {
              [SnapEndowments.EthereumProvider]: {
                caveats: [],
                date: 1664187844588,
                id: 'izn0WGUO8cvq_jqvLQuQP',
                invoker: MOCK_ORIGIN,
                parentCapability: SnapEndowments.EthereumProvider,
              },
            },
          },
        }
      },

      SelectedNetworkController: {
        domains: {}
      }
    },
  };
}

describe('migration #126', () => {
  afterEach(() => jest.resetAllMocks());

  it('updates the version metadata', async () => {
    const oldStorage = {
      meta: { version: oldVersion },
      data: {},
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({ version });
  });

  it('adds the network endowment to Snaps with the `endowment:ethereum-provider` permission', async () => {
    const oldStorage = getMockState();

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data.PermissionController).toStrictEqual({
      subjects: {
        [MOCK_SNAP_ID]: {
          permissions: {
            [SnapEndowments.EthereumProvider]: {
              caveats: [],
              date: 1664187844588,
              id: 'izn0WGUO8cvq_jqvLQuQP',
              invoker: MOCK_ORIGIN,
              parentCapability: SnapEndowments.EthereumProvider,
            },
            [PermissionNames.permittedChains]: {
              caveats: [
                CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                  [CHAIN_IDS.MAINNET],
                )
              ],
              date: 1723635247705,
              id: expect.any(String),
              invoker: MOCK_SNAP_ID,
              parentCapability: PermissionNames.permittedChains,
            }
          },
        },
      }
    });

    expect(newStorage.data.SelectedNetworkController).toStrictEqual({
      domains: {
        [MOCK_SNAP_ID]: NETWORK_TYPES.MAINNET
      }
    });
  });

  it('uses the current selected network client ID to determine the chain ID', async () => {
    const oldStorage = getMockState(NETWORK_TYPES.SEPOLIA);

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data.PermissionController).toStrictEqual({
      subjects: {
        [MOCK_SNAP_ID]: {
          permissions: {
            [SnapEndowments.EthereumProvider]: {
              caveats: [],
              date: 1664187844588,
              id: 'izn0WGUO8cvq_jqvLQuQP',
              invoker: MOCK_ORIGIN,
              parentCapability: SnapEndowments.EthereumProvider,
            },
            [PermissionNames.permittedChains]: {
              caveats: [
                CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                  [CHAIN_IDS.SEPOLIA],
                )
              ],
              date: 1723635247705,
              id: expect.any(String),
              invoker: MOCK_SNAP_ID,
              parentCapability: PermissionNames.permittedChains,
            }
          },
        },
      }
    });

    expect(newStorage.data.SelectedNetworkController).toStrictEqual({
      domains: {
        [MOCK_SNAP_ID]: NETWORK_TYPES.SEPOLIA
      }
    });
  });

  it('uses the network from network configurations if set', async () => {
    const oldStorage = getMockState(NETWORK_TYPES.SEPOLIA, {
      [NETWORK_TYPES.SEPOLIA]: {
        chainId: CHAIN_IDS.LINEA_SEPOLIA,
      },
    });

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data.PermissionController).toStrictEqual({
      subjects: {
        [MOCK_SNAP_ID]: {
          permissions: {
            [SnapEndowments.EthereumProvider]: {
              caveats: [],
              date: 1664187844588,
              id: 'izn0WGUO8cvq_jqvLQuQP',
              invoker: MOCK_ORIGIN,
              parentCapability: SnapEndowments.EthereumProvider,
            },
            [PermissionNames.permittedChains]: {
              caveats: [
                CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                  [CHAIN_IDS.LINEA_SEPOLIA],
                )
              ],
              date: 1723635247705,
              id: expect.any(String),
              invoker: MOCK_SNAP_ID,
              parentCapability: PermissionNames.permittedChains,
            }
          },
        },
      }
    });

    expect(newStorage.data.SelectedNetworkController).toStrictEqual({
      domains: {
        [MOCK_SNAP_ID]: NETWORK_TYPES.SEPOLIA
      }
    });
  });

  // @ts-expect-error - Property `each` does not exist on type `TestFunction`.
  it.each([
    {},
    {
      networkControllerState: [],
      permissionControllerState: {
        subjects: {
          [MOCK_SNAP_ID]: {
            permissions: {
              [SnapEndowments.EthereumProvider]: {
                caveats: [],
                date: 1664187844588,
                id: 'izn0WGUO8cvq_jqvLQuQP',
                invoker: MOCK_ORIGIN,
                parentCapability: SnapEndowments.EthereumProvider,
              },
              [PermissionNames.permittedChains]: {
                caveats: [
                  CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                    [CHAIN_IDS.SEPOLIA],
                  )
                ],
                date: 1723635247705,
                id: expect.any(String),
                invoker: MOCK_SNAP_ID,
                parentCapability: PermissionNames.permittedChains,
              }
            },
          },
        }
      },
      selectedNetworkControllerState: {
        domains: {}
      },
    },
    {
      networkControllerState: {
        selectedNetworkClientId: NETWORK_TYPES.MAINNET,
      },
      permissionControllerState: [],
      selectedNetworkControllerState: {
        domains: {}
      },
    },
    {
      networkControllerState: {
        selectedNetworkClientId: NETWORK_TYPES.MAINNET,
      },
      permissionControllerState: {
        subjects: {
          [MOCK_SNAP_ID]: {
            permissions: {
              [SnapEndowments.EthereumProvider]: {
                caveats: [],
                date: 1664187844588,
                id: 'izn0WGUO8cvq_jqvLQuQP',
                invoker: MOCK_ORIGIN,
                parentCapability: SnapEndowments.EthereumProvider,
              },
              [PermissionNames.permittedChains]: {
                caveats: [
                  CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                    [CHAIN_IDS.SEPOLIA],
                  )
                ],
                date: 1723635247705,
                id: expect.any(String),
                invoker: MOCK_SNAP_ID,
                parentCapability: PermissionNames.permittedChains,
              }
            },
          },
        }
      },
      selectedNetworkControllerState: [],
    },
    {
      networkControllerState: {
        selectedNetworkClientId: 0,
      },
      permissionControllerState: {
        subjects: {
          [MOCK_SNAP_ID]: {
            permissions: {
              [SnapEndowments.EthereumProvider]: {
                caveats: [],
                date: 1664187844588,
                id: 'izn0WGUO8cvq_jqvLQuQP',
                invoker: MOCK_ORIGIN,
                parentCapability: SnapEndowments.EthereumProvider,
              },
              [PermissionNames.permittedChains]: {
                caveats: [
                  CaveatFactories[CaveatTypes.restrictNetworkSwitching](
                    [CHAIN_IDS.SEPOLIA],
                  )
                ],
                date: 1723635247705,
                id: expect.any(String),
                invoker: MOCK_SNAP_ID,
                parentCapability: PermissionNames.permittedChains,
              }
            },
          },
        }
      },
      selectedNetworkControllerState: {
        domains: {}
      },
    },
  ])('does not update the state if the state is invalid (#%#)', async (data: Record<string, unknown>) => {
    const oldStorage = {
      meta: { version: oldVersion },
      data,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage).toStrictEqual({
      meta: { version: newVersion },
      data
    });
  })
});
