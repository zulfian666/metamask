import { ethErrors } from 'eth-rpc-errors';
import { omit } from 'lodash';
import { MESSAGE_TYPE } from '../../../../../shared/constants/app';
import {
  ETH_SYMBOL,
  CHAIN_ID_TO_TYPE_MAP,
  NETWORK_TO_NAME_MAP,
} from '../../../../../shared/constants/network';
import {
  isPrefixedFormattedHexString,
  isSafeChainId,
} from '../../../../../shared/modules/network.utils';

const switchEthereumChain = {
  methodNames: [MESSAGE_TYPE.SWITCH_ETHEREUM_CHAIN],
  implementation: switchEthereumChainHandler,
};
export default switchEthereumChain;

function findExistingNetwork(chainId, findCustomRpcBy) {
  if (chainId in CHAIN_ID_TO_TYPE_MAP) {
    return {
      chainId,
      nickname: NETWORK_TO_NAME_MAP[chainId],
      ticker: ETH_SYMBOL,
    };
  }

  return findCustomRpcBy({ chainId });
}

async function switchEthereumChainHandler(
  req,
  res,
  _next,
  end,
  { getCurrentChainId, findCustomRpcBy, updateRpcTarget, requestUserApproval },
) {
  if (!req.params?.[0] || typeof req.params[0] !== 'object') {
    return end(
      ethErrors.rpc.invalidParams({
        message: `Expected single, object parameter. Received:\n${JSON.stringify(
          req.params,
        )}`,
      }),
    );
  }

  const { origin } = req;

  const { chainId } = req.params[0];

  const otherKeys = Object.keys(omit(req.params[0], ['chainId']));

  if (otherKeys.length > 0) {
    return end(
      ethErrors.rpc.invalidParams({
        message: `Received unexpected keys on object parameter. Unsupported keys:\n${otherKeys}`,
      }),
    );
  }

  const _chainId = typeof chainId === 'string' && chainId.toLowerCase();

  if (!isPrefixedFormattedHexString(_chainId)) {
    return end(
      ethErrors.rpc.invalidParams({
        message: `Expected 0x-prefixed, unpadded, non-zero hexadecimal string 'chainId'. Received:\n${chainId}`,
      }),
    );
  }

  if (!isSafeChainId(parseInt(_chainId, 16))) {
    return end(
      ethErrors.rpc.invalidParams({
        message: `Invalid chain ID "${_chainId}": numerical value greater than max safe value. Received:\n${chainId}`,
      }),
    );
  }

  const existingNetwork = findExistingNetwork(_chainId, findCustomRpcBy);

  if (existingNetwork) {
    const currentChainId = getCurrentChainId();
    if (currentChainId === _chainId) {
      res.result = null;
      return end();
    }
    try {
      await updateRpcTarget(
        await requestUserApproval({
          origin,
          type: MESSAGE_TYPE.SWITCH_ETHEREUM_CHAIN,
          requestData: {
            rpcUrl: existingNetwork.rpcUrl,
            chainId: existingNetwork.chainId,
            nickname: existingNetwork.nickname,
            ticker: existingNetwork.ticker,
          },
        }),
      );
      res.result = null;
    } catch (error) {
      return end(error);
    }
    return end();
  }
  return end(
    ethErrors.provider.custom({
      code: 4902, // To-be-standardized "unrecognized chain ID" error
      message: `Unrecognized chain ID "${chainId}". Try adding the chain using ${MESSAGE_TYPE.ADD_ETHEREUM_CHAIN} first.`,
    }),
  );
}
