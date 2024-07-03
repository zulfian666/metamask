import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/jest';
import configureStore from '../../../store/store';
import mockState from '../../../../test/data/mock-state.json';
import { MOCK_ACCOUNT_BIP122_P2WPKH } from '../../../../test/data/mock-accounts';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventLinkType,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  MULTICHAIN_NETWORK_BLOCK_EXPLORER_URL_MAP,
  MULTICHAIN_TOKEN_IMAGE_MAP,
  MultichainNetworks,
} from '../../../../shared/constants/multichain/networks';
import TransactionList from './transaction-list.component';

const defaultState = {
  metamask: {
    ...mockState.metamask,
    transactions: [],
  },
};

const btcState = {
  metamask: {
    ...mockState.metamask,
    internalAccounts: {
      ...mockState.metamask.internalAccounts,
      accounts: {
        ...mockState.metamask.internalAccounts.accounts,
        [MOCK_ACCOUNT_BIP122_P2WPKH.id]: MOCK_ACCOUNT_BIP122_P2WPKH,
      },
      selectedAccount: MOCK_ACCOUNT_BIP122_P2WPKH.id,
    },
    selectedAddress: MOCK_ACCOUNT_BIP122_P2WPKH.address,
    providerConfig: {
      chainId: MultichainNetworks.BITCOIN_TESTNET,
      rpcUrl: '',
      ticker: 'BTC',
      nickname: 'Bitcoin (testnet)',
      id: 'btc-testnet',
      type: 'rpc',
      rpcPrefs: {
        imageUrl: MULTICHAIN_TOKEN_IMAGE_MAP[MultichainNetworks.BITCOIN],
        blockExplorerUrl:
          MULTICHAIN_NETWORK_BLOCK_EXPLORER_URL_MAP[
            MultichainNetworks.BITCOIN_TESTNET
          ],
      },
      isAddressCompatible: true,
    },
    transactions: [],
  },
};

const mockTrackEvent = jest.fn();

const render = (state = defaultState) => {
  const store = configureStore(state);
  return renderWithProvider(
    <MetaMetricsContext.Provider value={mockTrackEvent}>
      <TransactionList />
    </MetaMetricsContext.Provider>,
    store,
  );
};

describe('TransactionList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders TransactionList component and shows You have no transactions text', () => {
    render();
    expect(screen.getByText('You have no transactions')).toBeInTheDocument();
  });

  it('renders TransactionList component and shows Bitcoin activity is not supported text', () => {
    render(btcState);

    expect(
      screen.getByText('Bitcoin activity is not supported'),
    ).toBeInTheDocument();
    const viewOnExplorerBtn = screen.getByRole('button', {
      name: 'View on block explorer',
    });
    expect(viewOnExplorerBtn).toBeInTheDocument();
    fireEvent.click(viewOnExplorerBtn);
    expect(mockTrackEvent).toHaveBeenCalledWith({
      event: MetaMetricsEventName.ExternalLinkClicked,
      category: MetaMetricsEventCategory.Navigation,
      properties: {
        link_type: MetaMetricsEventLinkType.AccountTracker,
        location: 'Activity Tab',
        url_domain: 'blockstream.info',
      },
    });
  });
});
