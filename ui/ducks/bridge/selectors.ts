import { NetworkState } from '@metamask/network-controller';
import { uniqBy } from 'lodash';
import {
  getIsBridgeEnabled,
  getNetworkConfigurationsByChainId,
} from '../../selectors';
import { ALLOWED_BRIDGE_CHAIN_IDS } from '../../../shared/constants/bridge';
import {
  BridgeControllerState,
  BridgeFeatureFlagsKey,
} from '../../../app/scripts/controllers/bridge/types';
import { FEATURED_RPCS } from '../../../shared/constants/network';
import { createDeepEqualSelector } from '../../selectors/util';
import { getProviderConfig } from '../metamask/metamask';
import { BridgeState } from './bridge';

// TODO add swaps state
type BridgeAppState = {
  metamask: NetworkState & { bridgeState: BridgeControllerState } & {
    useExternalServices: boolean;
  };
  bridge: BridgeState;
};

export const getFromChain = (state: BridgeAppState) => getProviderConfig(state);
export const getToChain = (state: BridgeAppState) => state.bridge.toChain;

export const getAllBridgeableNetworks = createDeepEqualSelector(
  getNetworkConfigurationsByChainId,
  (networkConfigurationsByChainId) => {
    return uniqBy(
      [...Object.values(networkConfigurationsByChainId), ...FEATURED_RPCS],
      'chainId',
    ).filter(({ chainId }) =>
      ALLOWED_BRIDGE_CHAIN_IDS.includes(
        chainId as (typeof ALLOWED_BRIDGE_CHAIN_IDS)[number],
      ),
    );
  },
);
export const getFromChains = createDeepEqualSelector(
  getAllBridgeableNetworks,
  (state: BridgeAppState) => state.metamask.bridgeState?.bridgeFeatureFlags,
  (allBridgeableNetworks, bridgeFeatureFlags) =>
    allBridgeableNetworks.filter(({ chainId }) =>
      bridgeFeatureFlags[BridgeFeatureFlagsKey.NETWORK_SRC_ALLOWLIST].includes(
        chainId,
      ),
    ),
);
export const getToChains = createDeepEqualSelector(
  getAllBridgeableNetworks,
  (state: BridgeAppState) => state.metamask.bridgeState?.bridgeFeatureFlags,
  (allBridgeableNetworks, bridgeFeatureFlags) =>
    allBridgeableNetworks.filter(({ chainId }) =>
      bridgeFeatureFlags[BridgeFeatureFlagsKey.NETWORK_DEST_ALLOWLIST].includes(
        chainId,
      ),
    ),
);

export const getIsBridgeTx = createDeepEqualSelector(
  getFromChain,
  getToChain,
  (state: BridgeAppState) => getIsBridgeEnabled(state),
  (fromChain, toChain, isBridgeEnabled: boolean) =>
    isBridgeEnabled &&
    toChain !== null &&
    fromChain !== undefined &&
    fromChain.chainId !== toChain.chainId,
);
