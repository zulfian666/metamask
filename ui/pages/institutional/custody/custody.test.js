import React from 'react';
import configureMockStore from 'redux-mock-store';
import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import thunk from 'redux-thunk';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import CustodyPage from '.';

const mockedConnectCustodyAddresses = jest
  .fn()
  .mockReturnValue({ type: 'TYPE' });
const mockedGetCustodianJWTList = jest
  .fn()
  .mockImplementation(() => async (dispatch) => {
    const jwtList = ['jwt1', 'jwt2', 'jwt3'];
    dispatch({ type: 'TYPE', payload: jwtList });
    return jwtList;
  });

const mockedGetCustodianAccounts = jest.fn().mockReturnValue({ type: 'TYPE' });
const mockedGetCustodianToken = jest.fn().mockReturnValue('testJWT');

jest.mock('../../../store/institutional/institution-background', () => ({
  mmiActionsFactory: () => ({
    getCustodianToken: mockedGetCustodianToken,
    getCustodianAccounts: mockedGetCustodianAccounts,
    getCustodianJWTList: mockedGetCustodianJWTList,
    connectCustodyAddresses: mockedConnectCustodyAddresses,
  }),
}));

describe('CustodyPage', function () {
  const mockStore = {
    metamask: {
      providerConfig: { chainId: 0x1, type: 'test' },
      institutionalFeatures: {
        connectRequests: [],
      },
      mmiConfiguration: {
        portfolio: {
          enabled: true,
          url: 'https://portfolio.io',
        },
        custodians: [
          {
            type: 'Saturn A',
            name: 'Saturn A',
            apiUrl: 'https://saturn-custody.dev.metamask-institutional.io',
            iconUrl:
              'https://saturn-custody-ui.dev.metamask-institutional.io/saturn.svg',
            displayName: 'Saturn Custody A',
            production: true,
            refreshTokenUrl: null,
            isNoteToTraderSupported: false,
            version: 1,
          },
          {
            type: 'Saturn B',
            name: 'Saturn B',
            apiUrl: 'https://saturn-custody.dev.metamask-institutional.io',
            iconUrl:
              'https://saturn-custody-ui.dev.metamask-institutional.io/saturn.svg',
            displayName: 'Saturn Custody B',
            production: true,
            refreshTokenUrl: null,
            isNoteToTraderSupported: false,
            version: 1,
          },
        ],
      },
      preferences: {
        useNativeCurrencyAsPrimaryCurrency: true,
      },
      appState: {
        isLoading: false,
      },
      history: {
        mostRecentOverviewPage: '/',
      },
    },
  };

  const store = configureMockStore([thunk])(mockStore);

  it('renders the list of custodians in mmiController when there is no accounts from connectRequest', async () => {
    act(() => {
      renderWithProvider(<CustodyPage />, store);
    });

    await waitFor(() => {
      const connectCustodyBtn = screen.getAllByTestId('custody-connect-button');
      expect(connectCustodyBtn[0]).toBeDefined();
    });
  });

  it('renders jwt token list when there is no accounts and custodian is selected from the list of custodians in mmiController', async () => {
    act(() => {
      renderWithProvider(<CustodyPage />, store);
    });

    await waitFor(() => {
      const custodyBtns = screen.getAllByTestId('custody-connect-button');
      fireEvent.click(custodyBtns[0]);
    });

    await waitFor(() => {
      expect(screen.getByTestId('jwt-form-connect-button')).toBeInTheDocument();
      expect(mockedGetCustodianJWTList).toHaveBeenCalled();
    });
  });

  it('renders jwt token list when first custodian is selected, showing the jwt form and testing the sorting function', async () => {
    const newMockStore = {
      ...mockStore,
      metamask: {
        ...mockStore.metamask,
        mmiConfiguration: {
          ...mockStore.metamask.mmiConfiguration,
          custodians: [
            {
              ...mockStore.metamask.mmiConfiguration.custodians[0],
              name: 'saturn b',
              displayName: 'Saturn Custody B',
            },
            {
              ...mockStore.metamask.mmiConfiguration.custodians[1],
              name: 'saturn a',
              displayName: 'Saturn Custody A',
            },
            {
              ...mockStore.metamask.mmiConfiguration.custodians[2],
              name: 'saturn c',
              displayName: 'Saturn Custody C',
            },
          ],
        },
      },
    };

    const newStore = configureMockStore([thunk])(newMockStore);

    await act(async () => {
      renderWithProvider(<CustodyPage />, newStore);
    });

    await waitFor(() => {
      // Saturn Custody A will be the first one to appear
      const saturnCustodyA = screen.getByText('Saturn Custody A');
      const parentContainer = saturnCustodyA.closest('ul');
      expect(parentContainer).toMatchSnapshot();
    });
  });

  it('renders PulseLoader when loading state is true', async () => {
    mockedGetCustodianToken.mockImplementation(
      () => new Promise((resolve) => resolve(null)),
    );
    mockedGetCustodianAccounts.mockImplementation(
      () => new Promise((resolve) => resolve(null)),
    );

    await act(async () => {
      renderWithProvider(<CustodyPage />, store);
      expect(screen.getByTestId('pulse-loader')).toBeDefined();
    });
  });

  it('renders custody accounts list when I have accounts from connectRequest', async () => {
    mockedGetCustodianAccounts.mockImplementation(() => async (dispatch) => {
      const accounts = [
        {
          name: 'Saturn Test Name',
          address: '0x123',
          balance: '0x1',
          custodianDetails: 'custodianDetails',
          labels: [{ key: 'key', value: 'testLabels' }],
          chanId: 'chanId',
        },
      ];
      dispatch({ type: 'TYPE', payload: accounts });
      return accounts;
    });

    const newMockStore = {
      ...mockStore,
      metamask: {
        ...mockStore.metamask,
        institutionalFeatures: {
          connectRequests: [
            {
              token: 'token',
              environment: 'Saturn A',
              service: 'Saturn A',
              apiUrl: 'url',
            },
          ],
        },
      },
    };

    const newStore = configureMockStore([thunk])(newMockStore);

    await act(async () => {
      renderWithProvider(<CustodyPage />, newStore);
    });

    await waitFor(() => {
      expect(screen.getByTestId('select-all-accounts')).toBeDefined();
      expect(screen.getByText('0x123')).toBeDefined();
      expect(screen.getByText('testLabels')).toBeDefined();
      expect(screen.getByText('Saturn Test Name')).toBeDefined();
    });
  });

  it('renders custodian list, initiates connect custodian, displays jwt token list, clicks connect button, and finally shows "no accounts available" message', async () => {
    mockedGetCustodianAccounts.mockImplementation(() => async (dispatch) => {
      const accounts = [];
      dispatch({ type: 'TYPE', payload: accounts });
      return accounts;
    });

    act(() => {
      renderWithProvider(<CustodyPage />, store);
    });

    await waitFor(() => {
      const custodyBtns = screen.getAllByTestId('custody-connect-button');
      fireEvent.click(custodyBtns[0]);
    });

    await waitFor(() => {
      const connectBtn = screen.getByTestId('jwt-form-connect-button');
      fireEvent.click(connectBtn);
    });

    expect(screen.getByTestId('custody-accounts-empty')).toBeDefined();
  });
});
