import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { ChainId, hexToBN } from '@metamask/controller-utils';
import { Hex } from '@metamask/utils';
import {
  getAllTokens,
  getCurrentCurrency,
  getSelectedInternalAccountWithBalance,
  getShouldHideZeroBalanceTokens,
  getTokenExchangeRates,
} from '../selectors';
import { getConversionRate } from '../ducks/metamask/metamask';
import {
  SWAPS_CHAINID_DEFAULT_TOKEN_MAP,
  SwapsTokenObject,
  TokenBucketPriority,
} from '../../shared/constants/swaps';
import { getValueFromWeiHex } from '../../shared/modules/conversion.utils';
import { EtherDenomination } from '../../shared/constants/common';
import {
  AssetWithDisplayData,
  ERC20Asset,
  NativeAsset,
  TokenWithBalance,
} from '../components/multichain/asset-picker-amount/asset-picker-modal/types';
import { AssetType } from '../../shared/constants/transaction';
import { isSwapsDefaultTokenSymbol } from '../../shared/modules/swaps.utils';
import { useTokenTracker } from './useTokenTracker';
import { getRenderableTokenData } from './useTokensToSearch';

/*
Sorts tokenList by query match, balance/popularity, all other tokens
*/
export const useTokensWithFiltering = (
  tokenList: Record<string, SwapsTokenObject>,
  topTokens: { address: string }[],
  chainId: ChainId | Hex,
  sortOrder: TokenBucketPriority = TokenBucketPriority.owned,
) => {
  // Only inlucdes non-native tokens
  const allDetectedTokens = useSelector(getAllTokens);
  const { address: selectedAddress, balance: balanceOnActiveChain } =
    useSelector(getSelectedInternalAccountWithBalance);

  const allDetectedTokensForChainAndAddress =
    allDetectedTokens?.[chainId]?.[selectedAddress] ?? [];

  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  );
  const {
    tokensWithBalances: erc20TokensWithBalances,
  }: { tokensWithBalances: TokenWithBalance[] } = useTokenTracker({
    tokens: allDetectedTokensForChainAndAddress,
    address: selectedAddress,
    hideZeroBalanceTokens: Boolean(shouldHideZeroBalanceTokens),
  });

  const tokenConversionRates = useSelector(getTokenExchangeRates, isEqual);
  const conversionRate = useSelector(getConversionRate);
  const currentCurrency = useSelector(getCurrentCurrency);

  const sortedErc20TokensWithBalances = useMemo(
    () =>
      erc20TokensWithBalances.sort(
        (a, b) => Number(b.string) - Number(a.string),
      ),
    [erc20TokensWithBalances],
  );

  const filteredTokenListGenerator = useCallback(
    (shouldAddToken: (symbol: string, address?: string) => boolean) => {
      const buildTokenData = (
        token: SwapsTokenObject,
      ):
        | AssetWithDisplayData<NativeAsset>
        | AssetWithDisplayData<ERC20Asset>
        | undefined => {
        if (shouldAddToken(token.symbol, token.address)) {
          return getRenderableTokenData(
            {
              ...token,
              type: isSwapsDefaultTokenSymbol(token.symbol, chainId)
                ? AssetType.native
                : AssetType.token,
              image: token.iconUrl,
            },
            tokenConversionRates,
            conversionRate,
            currentCurrency,
            chainId,
            tokenList,
          );
        }
        return undefined;
      };

      return (function* (): Generator<
        AssetWithDisplayData<NativeAsset> | AssetWithDisplayData<ERC20Asset>
      > {
        const balance = hexToBN(balanceOnActiveChain);
        const nativeToken = buildTokenData({
          ...SWAPS_CHAINID_DEFAULT_TOKEN_MAP[
            chainId as keyof typeof SWAPS_CHAINID_DEFAULT_TOKEN_MAP
          ],
          ...(sortOrder === TokenBucketPriority.owned
            ? {
                balance: balanceOnActiveChain,
                string: getValueFromWeiHex({
                  value: balance,
                  numberOfDecimals: 4,
                  toDenomination: EtherDenomination.ETH,
                }),
              }
            : {}),
        });
        if (nativeToken) {
          yield nativeToken;
        }

        if (sortOrder === TokenBucketPriority.owned) {
          for (const token of sortedErc20TokensWithBalances) {
            if (
              tokenList?.[token.address] ??
              tokenList?.[token.address.toLowerCase()]
            ) {
              const tokenWithTokenListData = buildTokenData({
                ...token,
                ...(token.address
                  ? tokenList?.[token.address] ??
                    tokenList?.[token.address.toLowerCase()]
                  : {}),
              });
              if (tokenWithTokenListData) {
                yield tokenWithTokenListData;
              }
            }
          }
        }

        for (const t of topTokens) {
          const token =
            tokenList?.[t.address] ?? tokenList?.[t.address.toLowerCase()];
          if (token) {
            const tokenWithTokenListData = buildTokenData(token);
            if (tokenWithTokenListData) {
              yield tokenWithTokenListData;
            }
          }
        }

        for (const token of Object.values(tokenList)) {
          const tokenWithTokenListData = buildTokenData(token);
          if (tokenWithTokenListData) {
            yield tokenWithTokenListData;
          }
        }
      })();
    },
    [
      balanceOnActiveChain,
      sortedErc20TokensWithBalances,
      topTokens,
      tokenConversionRates,
      conversionRate,
      currentCurrency,
      chainId,
      tokenList,
    ],
  );

  return filteredTokenListGenerator;
};
