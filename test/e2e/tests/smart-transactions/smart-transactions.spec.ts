import {
  buildQuote,
  reviewQuote,
  waitForTransactionToComplete,
  checkActivityTransaction,
} from '../swaps/shared';
import { withFixturesForSmartTransactions } from './shared';
import { MOCK_REQUEST_SWAP_GET_FEES } from './mock-request-getFees';

describe('smart transactions @no-mmi', function () {
  it.only('Completes a Swap between ETH and DAI', async function () {
    await withFixturesForSmartTransactions(
      {
        title: this.test?.fullTitle(),
        mockRequests: [MOCK_REQUEST_SWAP_GET_FEES],
      },
      async ({ driver }) => {
        await buildQuote(driver, {
          amount: 2,
          swapTo: 'DAI',
        });
        await reviewQuote(driver, {
          amount: 2,
          swapFrom: 'TESTETH',
          swapTo: 'DAI',
        });
        await driver.delay(30000);

        await driver.clickElement({ text: 'Swap', tag: 'button' });
        await waitForTransactionToComplete(driver, { tokenName: 'DAI' });
        await checkActivityTransaction(driver, {
          index: 0,
          amount: '2',
          swapFrom: 'TESTETH',
          swapTo: 'DAI',
        });
      },
    );
  });
});
