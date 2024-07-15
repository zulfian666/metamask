import React from 'react';
import configureMockStore from 'redux-mock-store';
import { within } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/jest/rendering';
import mockState from '../../../../test/data/mock-state.json';
import {
  MAINNET_DISPLAY_NAME,
  NETWORK_TYPES,
  CHAIN_IDS,
} from '../../../../shared/constants/network';
import TransactionBreakdown from '.';

function getActualDataFrom(transactionBreakdownRows) {
  return transactionBreakdownRows.map((transactionBreakdownRow) => {
    const title = within(transactionBreakdownRow).getByTestId(
      'transaction-breakdown-row-title',
    );
    const value = within(transactionBreakdownRow).getByTestId(
      'transaction-breakdown-row-value',
    );
    return [title.textContent, value.textContent];
  });
}

describe('TransactionBreakdown', () => {
  const store = configureMockStore()({
    metamask: {
      currencyRates: {},
      preferences: {},
      providerConfig: {
        chainId: CHAIN_IDS.MAINNET,
        nickname: MAINNET_DISPLAY_NAME,
        type: NETWORK_TYPES.MAINNET,
      },
      internalAccounts: mockState.metamask.internalAccounts,
      completedOnboarding: true,
    },
  });

  describe('with a typical non-EIP-1559 transaction', () => {
    it('renders properly', () => {
      const { getAllByTestId } = renderWithProvider(
        <TransactionBreakdown
          nonce="0x1d" // 29
          transaction={{
            txParams: {
              gas: '0xb72a', // 46,890
              gasPrice: '0x930c19db', // 2,467,043,803
              value: '0x2386f26fc10000', // 10,000,000,000,000,000
            },
          }}
          primaryCurrency="-0.01 ETH"
        />,
        store,
      );

      expect(
        getActualDataFrom(getAllByTestId('transaction-breakdown-row')),
      ).toStrictEqual([
        ['Nonce', '29'],
        ['Amount', '-0.01 ETH'],
        ['Gas limit (units)', '46890'],
        ['Gas price', '2.467043803'],
        ['Total', '0.01011568ETH'],
      ]);
    });
  });

  describe('with a typical EIP-1559 transaction', () => {
    it('renders properly', () => {
      const { getAllByTestId } = renderWithProvider(
        <TransactionBreakdown
          nonce="0x1d" // 29
          transaction={{
            txParams: {
              gas: '0xb72a', // 46,890
              maxFeePerGas: '0xb2d05e00', // 3,000,000,000
              maxPriorityFeePerGas: '0x930c19d4', // 2,467,043,796
              value: '0x2386f26fc10000', // 10,000,000,000,000,000
            },
            txReceipt: {
              gasUsed: '7a1c', // 31,260
              effectiveGasPrice: '0x930c19db', // 2,467,043,803
            },
            baseFeePerGas: '0x7', // 7
          }}
          primaryCurrency="-0.01 ETH"
        />,
        store,
      );

      expect(
        getActualDataFrom(getAllByTestId('transaction-breakdown-row')),
      ).toStrictEqual([
        ['Nonce', '29'],
        ['Amount', '-0.01 ETH'],
        ['Gas limit (units)', '46890'],
        ['Gas used (units)', '31260'],
        ['Base fee (GWEI)', '0.000000007'],
        ['Priority fee (GWEI)', '2.467043796'],
        ['Total gas fee', '0.000077ETH'],
        ['Max fee per gas', '0.000000003ETH'],
        ['Total', '0.01007712ETH'],
      ]);
    });
  });

  describe('with swap+send transaction', () => {
    it('renders properly', () => {
      const { getAllByTestId } = renderWithProvider(
        <TransactionBreakdown
          nonce="0x72" // 114
          transaction={{
            baseFeePerGas: '0x18205f063',
            destinationTokenAddress:
              '0x0000000000000000000000000000000000000000',
            destinationTokenAmount: '2223344229978020',
            destinationTokenDecimals: 18,
            destinationTokenSymbol: 'ETH',
            sourceTokenAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
            sourceTokenAmount: '33425656732428330864',
            sourceTokenDecimals: 18,
            sourceTokenSymbol: 'BAT',
            status: 'confirmed',
            swapAndSendRecipient: '0xc6f6ca03d790168758285264bcbf7fb30d27322b',
            txParams: {
              gas: '0x3c3d6',
              maxFeePerGas: '0x1da1d1cff',
              maxPriorityFeePerGas: '0x53417a0',
            },
            txReceipt: {
              cumulativeGasUsed: '0xa1d718',
              effectiveGasPrice: '0x1873a0803',
              gasUsed: '0x2fa69',
            },
            type: 'swapAndSend',
          }}
          primaryCurrency="-0.01 ETH"
        />,
        store,
      );

      expect(
        getActualDataFrom(getAllByTestId('transaction-breakdown-row')),
      ).toStrictEqual([
        ['Nonce', '114'],
        ['Amount Sent', '33.425656732428330864 BAT'],
        ['Amount Received', '0.00222334422997802 ETH'],
        ['Gas limit (units)', '246742'],
        ['Gas used (units)', '195177'],
        ['Base fee (GWEI)', '6.476394595'],
        ['Priority fee (GWEI)', '0.0873'],
        ['Total gas fee', '0.001281ETH'],
        ['Max fee per gas', '0.000000008ETH'],
        ['Total', '0.00128108ETH'],
      ]);
    });
  });
});
