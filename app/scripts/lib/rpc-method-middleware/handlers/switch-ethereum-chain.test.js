import { ethErrors } from 'eth-rpc-errors';
import {
  CHAIN_IDS,
  NETWORK_TYPES,
} from '../../../../../shared/constants/network';
import switchEthereumChain from './switch-ethereum-chain';
import EthChainUtils from './ethereum-chain-utils';

jest.mock('./ethereum-chain-utils', () => ({
  ...jest.requireActual('./ethereum-chain-utils'),
  switchChain: jest.fn(),
}));

const NON_INFURA_CHAIN_ID = '0x123456789';

const mockRequestUserApproval = ({ requestData }) => {
  return Promise.resolve(requestData.toNetworkConfiguration);
};

const createMockMainnetConfiguration = () => ({
  id: 123,
  chainId: CHAIN_IDS.MAINNET,
  type: NETWORK_TYPES.MAINNET,
});

const createMockLineaMainnetConfiguration = () => ({
  id: 1234,
  chainId: CHAIN_IDS.LINEA_MAINNET,
  type: NETWORK_TYPES.LINEA_MAINNET,
});

const createMockedHandler = () => {
  const next = jest.fn();
  const end = jest.fn();
  const mocks = {
    findNetworkConfigurationBy: jest
      .fn()
      .mockReturnValue(createMockMainnetConfiguration()),
    setActiveNetwork: jest.fn(),
    getCaveat: jest.fn(),
    getCurrentChainIdForDomain: jest.fn().mockReturnValue(NON_INFURA_CHAIN_ID),
    requestUserApproval: jest.fn().mockImplementation(mockRequestUserApproval),
    requestPermissionApprovalForOrigin: jest.fn(),
    updateCaveat: jest.fn(),
  };
  const response = {};
  const handler = (request) =>
    switchEthereumChain.implementation(request, response, next, end, mocks);

  return {
    mocks,
    response,
    next,
    end,
    handler,
  };
};

describe('switchEthereumChainHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns null if the current chain id for the domain matches the chainId in the params', async () => {
    const { end, response, handler } = createMockedHandler();
    await handler({
      origin: 'example.com',
      params: [
        {
          chainId: NON_INFURA_CHAIN_ID,
        },
      ],
    });

    expect(response.result).toStrictEqual(null);
    expect(end).toHaveBeenCalled();
    expect(EthChainUtils.switchChain).not.toHaveBeenCalled();
  });

  it('throws an error if unable to find a network matching the chainId in the params', async () => {
    const { mocks, end, handler } = createMockedHandler();
    mocks.getCurrentChainIdForDomain.mockReturnValue('0x1');
    mocks.findNetworkConfigurationBy.mockReturnValue({});

    await handler({
      origin: 'example.com',
      params: [
        {
          chainId: NON_INFURA_CHAIN_ID,
        },
      ],
    });

    expect(end).toHaveBeenCalledWith(
      ethErrors.provider.custom({
        code: 4902,
        message: `Unrecognized chain ID "${NON_INFURA_CHAIN_ID}". Try adding the chain using wallet_addEthereumChain first.`,
      }),
    );
    expect(EthChainUtils.switchChain).not.toHaveBeenCalled();
  });

  it('tries to switch the network', async () => {
    const { mocks, end, handler } = createMockedHandler();
    mocks.findNetworkConfigurationBy
      .mockReturnValueOnce(createMockMainnetConfiguration())
      .mockReturnValueOnce(createMockLineaMainnetConfiguration());
    await handler({
      origin: 'example.com',
      params: [
        {
          chainId: '0xdeadbeef',
        },
      ],
    });

    expect(EthChainUtils.switchChain).toHaveBeenCalledWith(
      {},
      end,
      'example.com',
      '0xdeadbeef',
      {
        fromNetworkConfiguration: createMockLineaMainnetConfiguration(),
        toNetworkConfiguration: createMockMainnetConfiguration(),
      },
      createMockMainnetConfiguration().id,
      null,
      {
        setActiveNetwork: mocks.setActiveNetwork,
        requestUserApproval: mocks.requestUserApproval,
        getCaveat: mocks.getCaveat,
        updateCaveat: mocks.updateCaveat,
        requestPermissionApprovalForOrigin:
          mocks.requestPermissionApprovalForOrigin,
      },
    );
  });

  it('should return an error if an unexpected parameter is provided', async () => {
    const { end, handler } = createMockedHandler();

    const unexpectedParam = 'unexpected';

    await handler({
      origin: 'example.com',
      params: [
        {
          chainId: createMockMainnetConfiguration().chainId,
          [unexpectedParam]: 'parameter',
        },
      ],
    });

    expect(end).toHaveBeenCalledWith(
      ethErrors.rpc.invalidParams({
        message: `Received unexpected keys on object parameter. Unsupported keys:\n${unexpectedParam}`,
      }),
    );
  });

  it('should return error for invalid chainId', async () => {
    const { handler, end } = createMockedHandler();

    await handler({
      origin: 'example.com',
      params: [{ chainId: 'invalid_chain_id' }],
    });

    expect(end).toHaveBeenCalledWith(
      ethErrors.rpc.invalidParams({
        message: `Expected 0x-prefixed, unpadded, non-zero hexadecimal string 'chainId'. Received:\ninvalid_chain_id`,
      }),
    );
  });
});
