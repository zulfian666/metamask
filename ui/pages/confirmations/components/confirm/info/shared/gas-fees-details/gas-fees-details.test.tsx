import { act } from '@testing-library/react';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { genUnapprovedContractInteractionConfirmation } from '../../../../../../../../test/data/confirmations/contract-interaction';
import mockState from '../../../../../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../../../../../test/lib/render-helpers';
import { getGasFeeTimeEstimate } from '../../../../../../../store/actions';
import { GasFeesDetails } from './gas-fees-details';

jest.mock('../../../../../../../store/actions', () => ({
  ...jest.requireActual('../../../../../../../store/actions'),
  getGasFeeTimeEstimate: jest.fn(),
}));

describe('<GasFeesDetails />', () => {
  const middleware = [thunk];

  it('renders component for gas fees section with advanced details toggled off', async () => {
    (getGasFeeTimeEstimate as jest.Mock).mockImplementation(() =>
      Promise.resolve({ upperTimeBound: '1000' }),
    );

    const state = {
      ...mockState,
      confirm: {
        currentConfirmation: genUnapprovedContractInteractionConfirmation(),
      },
    };
    const mockStore = configureMockStore(middleware)(state);
    let container;
    await act(async () => {
      const renderResult = renderWithProvider(
        <GasFeesDetails
          setShowCustomizeGasPopover={() => console.log('open popover')}
          showAdvancedDetails={false}
        />,
        mockStore,
      );
      container = renderResult.container;

      // Wait for any asynchronous operations to complete
      await new Promise(setImmediate);
    });

    expect(container).toMatchSnapshot();
  });

  it('renders component for gas fees section with advanced details toggled on', async () => {
    (getGasFeeTimeEstimate as jest.Mock).mockImplementation(() =>
      Promise.resolve({ upperTimeBound: '1000' }),
    );

    const state = {
      ...mockState,
      confirm: {
        currentConfirmation: genUnapprovedContractInteractionConfirmation(),
      },
    };
    const mockStore = configureMockStore(middleware)(state);
    let container;
    await act(async () => {
      const renderResult = renderWithProvider(
        <GasFeesDetails
          setShowCustomizeGasPopover={() => console.log('open popover')}
          showAdvancedDetails={true}
        />,
        mockStore,
      );
      container = renderResult.container;

      // Wait for any asynchronous operations to complete
      await new Promise(setImmediate);
    });

    expect(container).toMatchSnapshot();
  });
});
