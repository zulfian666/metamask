import { createSlice } from '@reduxjs/toolkit';
import log from 'loglevel';
import networkMap from 'ethereum-ens-network-map';
import { isConfusing } from 'unicode-confusables';
import { isHexString } from 'ethereumjs-util';
import { ethers } from 'ethers';

import { getCurrentChainId } from '../selectors';
import {
  CHAIN_ID_TO_NETWORK_ID_MAP,
  MAINNET_NETWORK_ID,
  NETWORK_ID_TO_ETHERS_NETWORK_NAME_MAP,
} from '../../shared/constants/network';
import {
  UNS_NOT_REGISTERED,
  UNS_RECORD_NOT_FOUND,
  UNS_UNSPECIFIED_RESOLVER,
  UNS_RESOLUTION_ERROR,
  UNS_CONFUSING_ERROR,
  UNS_UNKNOWN_ERROR,
} from '../pages/send/send.constants';
import {
  isValidUnstoppableDomainName,
  buildJson,
} from '../helpers/utils/util';
import { CHAIN_CHANGED } from '../store/actionConstants';
import {
  BURN_ADDRESS,
  isBurnAddress,
  isValidHexAddress,
} from '../../shared/modules/hexstring-utils';
import Resolution from "@unstoppabledomains/resolution";

// Local Constants
const ZERO_X_ERROR_ADDRESS = '0x';

const initialState = {
  stage: 'UNINITIALIZED',
  resolution: null,
  error: null,
  warning: null,
  network: null,
  domainName: null,
};

export const unsInitialState = initialState;

const name = 'UNS';

let provider = null;

const slice = createSlice({
  name,
  initialState,
  reducers: {
    unsLookup: (state, action) => {
      // first clear out the previous state
      state.resolution = null;
      state.error = null;
      state.warning = null;
      state.domainName = null;
      const { address, unsName, error } = action.payload;

      if (error) {
        if (isValidUnstoppableDomainName(unsName)) {
          state.error =
            error.code === 'UnregisteredDomain'
              ? UNS_NOT_REGISTERED
              : UNS_RESOLUTION_ERROR;
        } else if (error.code === 'RecordNotFound') {
          state.error = UNS_RECORD_NOT_FOUND;
        } else if (error.code === 'UnspecifiedResolver') {
          state.error = UNS_UNSPECIFIED_RESOLVER;
        } else {
          log.error(error);
          state.error = UNS_UNKNOWN_ERROR;
        }
      } else if (address) {
        if (address === BURN_ADDRESS) {
          state.error = UNS_NOT_REGISTERED;
        } else if (address === ZERO_X_ERROR_ADDRESS) {
          state.error = UNS_RESOLUTION_ERROR;
        } else {
          state.resolution = address;
          state.domainName = unsName;
        }
        if (isValidUnstoppableDomainName(address) && isConfusing(address)) {
          state.warning = UNS_CONFUSING_ERROR;
        }
      } else {
        state.error = UNS_NOT_REGISTERED;
      }
    },
    enableUnsLookup: (state, action) => {
      state.stage = 'INITIALIZED';
      state.error = null;
      state.resolution = null;
      state.warning = null;
      state.network = action.payload;
    },
    disableUnsLookup: (state) => {
      state.stage = 'NO_NETWORK_SUPPORT';
      state.error = null;
      state.warning = null;
      state.resolution = null;
      state.network = null;
    },

    resetUnsResolution: (state) => {
      state.resolution = null;
      state.warning = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CHAIN_CHANGED, (state, action) => {
      if (action.payload !== state.currentChainId) {
        state.stage = 'UNINITIALIZED';
        provider = null;
      }
    });
  },
});

const { reducer, actions } = slice;
export default reducer;

const {
  unsLookup,
  enableUnsLookup,
  disableUnsLookup,
  resetUnsResolution,
} = actions;
export { resetUnsResolution }

export function initializeUnsSlice() {
  return (dispatch, getState) => {
    const state = getState();
    const chainId = getCurrentChainId(state);
    const network = CHAIN_ID_TO_NETWORK_ID_MAP[chainId];
    const networkName = NETWORK_ID_TO_ETHERS_NETWORK_NAME_MAP[network];
    const unsAddress = networkMap[network];
    const networkIsSupported = Boolean(unsAddress);
    if (networkIsSupported) {
      provider = new ethers.providers.Web3Provider(global.ethereumProvider, {
        chainId: parseInt(network, 10),
        name: networkName,
        unsAddress,
      });
      dispatch(enableUnsLookup(network));
    } else {
      provider = null;
      dispatch(disableUnsLookup());
    }
  };
}
export async function resolveMultiChainUNS(unsName, symbol, version) {
  let object = {}
  const resolution = new Resolution();
  object.unsName = unsName;
  object.currency = symbol;
  object.version = version;
  object.address = await resolution
    .multiChainAddr(unsName, symbol, version)
    .catch((err) => {
      object.error = err.code
    });
  return object
}
export function prepareResolutionCall(unsName) {
  //decides between multi and single chain
  //route between resolution calls
  return async (dispatch, getState, result) => {
    let state = getState();
    if (state[name].stage === 'UNINITIALIZED') {
      await dispatch(initializeUnsSlice());
    }
    let json = buildJson();
    for (let i = 0; i < json.singleChain.length; i++) {
      if (state.send.draftTransactions[state.send.currentTransactionUUID].asset.type === 'NATIVE') {
        if (state.metamask.nativeCurrency === json.singleChain[i]) {
          result = 'SINGLE_CHAIN';
          break;
        } else result = 'MULTI_CHAIN';
      } else result = 'MULTI_CHAIN';
    }
    if (result === 'SINGLE_CHAIN') {
      let object = await resolveUNS(unsName, state.metamask.nativeCurrency);
      await dispatch(
        unsLookup({
          unsName: object.unsName,
          address: object.address,
          error: object.error,
        }),
      );
    } else if (result === 'MULTI_CHAIN') {
      let object = {};
      if (state.send.draftTransactions[state.send.currentTransactionUUID].asset.type === 'NATIVE') {
        object = await resolveMultiChainUNS(unsName, state.metamask.nativeCurrency, state.metamask.nativeCurrency);
      } else {
        object = await resolveMultiChainUNS(unsName, state.send.draftTransactions[state.send.currentTransactionUUID].asset.details.symbol, state.send.draftTransactions[state.send.currentTransactionUUID].asset.details.standard);
      }
      await dispatch(
        unsLookup({
          unsName: object.unsName,
          address: object.address,
          error: object.error,
        }),
      );
    }
  }
}
export async function resolveUNS(unsName, currency) {
  let object = {}
  const resolution = new Resolution();
  object.unsName = unsName;
  object.currency = currency;
  object.address = await resolution
    .addr(unsName, currency)
    .catch((err) => {
      object.error = err.code
    });
  return object
};


export function getUnsResolution(state) {
  return state[name].resolution;
}

export function getUnsError(state) {
  return state[name].error;
}

export function getUnsWarning(state) {
  return state[name].warning;
}
