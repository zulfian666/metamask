import { createScaffoldMiddleware, mergeMiddleware } from 'json-rpc-engine';
import {
  createBlockRefMiddleware,
  createRetryOnEmptyMiddleware,
  createBlockCacheMiddleware,
  createInflightCacheMiddleware,
  createBlockTrackerInspectorMiddleware,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware';

import { createInfuraMiddleware } from '@metamask/eth-json-rpc-infura';
import { PollingBlockTracker } from 'eth-block-tracker';
import createFilterMiddleware from 'eth-json-rpc-filters';
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager';

import { BUILT_IN_NETWORKS } from '../../../../shared/constants/network';

export default function createInfuraClient({ network, projectId }) {
  const infuraMiddleware = createInfuraMiddleware({
    network,
    projectId,
    maxAttempts: 5,
    source: 'metamask',
  });
  const infuraProvider = providerFromMiddleware(infuraMiddleware);
  const blockTracker = new PollingBlockTracker({ provider: infuraProvider });

  const filterMiddleware = createFilterMiddleware({
    infuraProvider,
    blockTracker,
  });
  const subscriptionManager = createSubscriptionManager({
    infuraProvider,
    blockTracker,
  });

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockRefMiddleware({ blockTracker, provider: infuraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infuraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infuraMiddleware,
    filterMiddleware,
    subscriptionManager.middleware,
  ]);
  return { networkMiddleware, blockTracker, subscriptionManager };
}

function createNetworkAndChainIdMiddleware({ network }) {
  if (!BUILT_IN_NETWORKS[network]) {
    throw new Error(`createInfuraClient - unknown network "${network}"`);
  }

  const { chainId, networkId } = BUILT_IN_NETWORKS[network];

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: networkId,
  });
}
