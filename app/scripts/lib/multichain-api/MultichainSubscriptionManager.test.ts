import MultichainSubscriptionManager from './MultichainSubscriptionManager';

const newHeadsNotificationMock = {
  method: 'eth_subscription',
  params: {
    result: {
      difficulty: '0x15d9223a23aa',
      extraData: '0xd983010305844765746887676f312e342e328777696e646f7773',
      gasLimit: '0x47e7c4',
      gasUsed: '0x38658',
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      miner: '0xf8b483dba2c3b7176a3da549ad41a48bb3121069',
      nonce: '0x084149998194cc5f',
      number: '0x1348c9',
      parentHash:
        '0x7736fab79e05dc611604d22470dadad26f56fe494421b5b333de816ce1f25701',
      receiptRoot:
        '0x2fab35823ad00c7bb388595cb46652fe7886e00660a01e867824d3dceb1c8d36',
      sha3Uncles:
        '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      stateRoot:
        '0xb3346685172db67de536d8765c43c31009d0eb3bd9c501c9be3229203f15f378',
      timestamp: '0x56ffeff8',
    },
  },
};

describe('MultichainSubscriptionManager', () => {
  it('should subscribe to a domain and scope', () => {
    const domain = 'example.com';
    const scope = 'eip155:1';
    const mockFindNetworkClientIdByChainId = jest.fn();
    const mockGetNetworkClientById = jest.fn().mockImplementation(() => ({
      blockTracker: {},
      provider: {},
    }));
    const subscriptionManager = new MultichainSubscriptionManager({
      findNetworkClientIdByChainId: mockFindNetworkClientIdByChainId,
      getNetworkClientById: mockGetNetworkClientById,
    });
    const onNotificationSpy = jest.fn();

    subscriptionManager.on('notification', onNotificationSpy);
    subscriptionManager.subscribe(scope, domain);
    subscriptionManager.subscriptionManagerByChain[scope].events.emit(
      'notification',
      newHeadsNotificationMock,
    );
    expect(onNotificationSpy).toHaveBeenCalledWith(domain, {
      method: 'wallet_notify',
      params: {
        scope,
        notification: newHeadsNotificationMock,
      },
    });
  });

  it('should unsubscribe from a domain and scope', () => {
    const domain = 'example.com';
    const scope = 'eip155:1';
    const mockFindNetworkClientIdByChainId = jest.fn();
    const mockGetNetworkClientById = jest.fn().mockImplementation(() => ({
      blockTracker: {},
      provider: {},
    }));
    const subscriptionManager = new MultichainSubscriptionManager({
      findNetworkClientIdByChainId: mockFindNetworkClientIdByChainId,
      getNetworkClientById: mockGetNetworkClientById,
    });
    const onNotificationSpy = jest.fn();
    subscriptionManager.on('notification', onNotificationSpy);
    subscriptionManager.subscribe(scope, domain);
    const scopeSubscriptionManager =
      subscriptionManager.subscriptionManagerByChain[scope];
    subscriptionManager.unsubscribe(scope, domain);
    scopeSubscriptionManager.events.emit(
      'notification',
      newHeadsNotificationMock,
    );

    expect(onNotificationSpy).not.toHaveBeenCalled();
  });

  it('should unsubscribe from a scope', () => {
    const domain = 'example.com';
    const scope = 'eip155:1';
    const mockFindNetworkClientIdByChainId = jest.fn();
    const mockGetNetworkClientById = jest.fn().mockImplementation(() => ({
      blockTracker: {},
      provider: {},
    }));
    const subscriptionManager = new MultichainSubscriptionManager({
      findNetworkClientIdByChainId: mockFindNetworkClientIdByChainId,
      getNetworkClientById: mockGetNetworkClientById,
    });
    const onNotificationSpy = jest.fn();
    subscriptionManager.on('notification', onNotificationSpy);
    subscriptionManager.subscribe(scope, domain);
    const scopeSubscriptionManager =
      subscriptionManager.subscriptionManagerByChain[scope];
    subscriptionManager.unsubscribeScope(scope);
    scopeSubscriptionManager.events.emit(
      'notification',
      newHeadsNotificationMock,
    );

    expect(onNotificationSpy).not.toHaveBeenCalled();
  });

  it('should unsubscribe all', () => {
    const domain = 'example.com';
    const scope = 'eip155:1';
    const mockFindNetworkClientIdByChainId = jest.fn();
    const mockGetNetworkClientById = jest.fn().mockImplementation(() => ({
      blockTracker: {},
      provider: {},
    }));
    const subscriptionManager = new MultichainSubscriptionManager({
      findNetworkClientIdByChainId: mockFindNetworkClientIdByChainId,
      getNetworkClientById: mockGetNetworkClientById,
    });
    const onNotificationSpy = jest.fn();
    subscriptionManager.on('notification', onNotificationSpy);
    subscriptionManager.subscribe(scope, domain);
    const scope2 = 'eip155:2';
    subscriptionManager.subscribe(scope2, domain);
    const scopeSubscriptionManager =
      subscriptionManager.subscriptionManagerByChain[scope];
    const scopeSubscriptionManager2 =
      subscriptionManager.subscriptionManagerByChain[scope2];
    subscriptionManager.unsubscribeAll();
    scopeSubscriptionManager.events.emit(
      'notification',
      newHeadsNotificationMock,
    );
    scopeSubscriptionManager2.events.emit(
      'notification',
      newHeadsNotificationMock,
    );

    expect(onNotificationSpy).not.toHaveBeenCalled();
  });
});
