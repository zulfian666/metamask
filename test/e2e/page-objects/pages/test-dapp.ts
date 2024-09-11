import { Driver } from '../../webdriver/driver';

const DAPP_HOST_ADDRESS = '127.0.0.1:8080';
const DAPP_URL = `http://${DAPP_HOST_ADDRESS}`;

class TestDapp {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async open({
    contractAddress,
    url = DAPP_URL,
  }: {
    contractAddress?: string;
    url?: string;
  }) {
    const dappUrl = contractAddress
      ? `${url}/?contract=${contractAddress}`
      : url;

    return await this.driver.openNewPage(dappUrl);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(method: string, params: any[]) {
    await this.open({
      url: `${DAPP_URL}/request?method=${method}&params=${JSON.stringify(
        params,
      )}`,
    });
  }
}

export default TestDapp;
