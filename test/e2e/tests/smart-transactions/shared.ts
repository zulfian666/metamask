import { MockttpServer } from 'mockttp';
import { ServerOptions } from 'ganache';
import FixtureBuilder from '../../fixture-builder';
import { unlockWallet, withFixtures } from '../../helpers';
import { Driver } from '../../webdriver/driver';
import { mockEthDaiTrade } from '../swaps/shared';

export const ganacheOptions: ServerOptions & { miner: { blockTime?: number } } =
  {
    wallet: {
      accounts: [
        {
          secretKey:
            '0x7C9529A67102755B7E6102D6D950AC5D5863C98713805CEC576B945B15B71EAC',
          balance: 25000000000000000000n,
        },
      ],
    },
    miner: { blockTime: 10 },
  };

export type MockRequest<Request = object, Response = object> = {
  url: string;
  request: Request;
  response: Response;
};

export async function withFixturesForSmartTransactions(
  {
    title,
    mockRequests,
  }: {
    title?: string;
    inputChainId?: string;
    mockRequests: MockRequest[];
  },
  test: (args: { driver: Driver }) => Promise<void>,
) {
  const testSpecificMock = async (mockServer: MockttpServer) => {
    await mockEthDaiTrade(mockServer);
    await Promise.all(
      mockRequests.map(
        async ({ url, request, response }) =>
          await mockServer
            .forPost(url)
            .withJsonBody(request)
            .thenJson(200, response),
      ),
    );
  };
  await withFixtures(
    {
      fixtures: new FixtureBuilder()
        .withPermissionControllerConnectedToTestDapp()
        .withPreferencesControllerSmartTransactionsOptedIn()
        .build(),
      title,
      testSpecificMock,
      dapp: true,
      ganacheOptions,
    },
    async ({ driver }) => {
      await unlockWallet(driver);
      await test({ driver });
    },
  );
}
