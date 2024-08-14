import { migrate, version } from './126';
import { SnapEndowments } from '@metamask/snaps-rpc-methods';
import { CaveatFactories, PermissionNames } from '../controllers/permissions';
import { CaveatTypes } from '../../../shared/constants/permissions.ts';

const oldVersion = 125;

const MOCK_ORIGIN = 'http://example.com';
const MOCK_SNAP_ID = 'npm:foo-snap';
const MOCK_CHAIN_ID = '0x1';

jest.useFakeTimers();
jest.setSystemTime(1723635247705);

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
    const oldStorage = {
      meta: { version: oldVersion },
      data: {
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
                  [MOCK_CHAIN_ID],
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
        [MOCK_SNAP_ID]: 'mainnet'
      }
    });
  });
});
