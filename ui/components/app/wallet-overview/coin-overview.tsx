import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { zeroAddress } from 'ethereumjs-util';

import { CaipChainId } from '@metamask/utils';
import type { Hex } from '@metamask/utils';
import { I18nContext } from '../../../contexts/i18n';
import Tooltip from '../../ui/tooltip';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import {
  getPreferences,
  getTokensMarketData,
  ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
  SwapsEthToken,
  ///: END:ONLY_INCLUDE_IF
} from '../../../selectors';
import Spinner from '../../ui/spinner';
import { useIsOriginalNativeTokenSymbol } from '../../../hooks/useIsOriginalNativeTokenSymbol';
import { showPrimaryCurrency } from '../../../../shared/modules/currency-display.utils';
import { PercentageAndAmountChange } from '../../multichain/token-list-item/price/percentage-and-amount-change/percentage-and-amount-change';
import {
  getMultichainIsEvm,
  getMultichainProviderConfig,
  getMultichainShouldShowFiat,
} from '../../../selectors/multichain';
import WalletOverview from './wallet-overview';
import CoinButtons from './coin-buttons';

export type CoinOverviewProps = {
  balance: string;
  balanceIsCached: boolean;
  className?: string;
  classPrefix?: string;
  chainId: CaipChainId | Hex;
  ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
  // FIXME: This seems to be for Ethereum only
  defaultSwapsToken?: SwapsEthToken;
  isBridgeChain: boolean;
  isBuyableChain: boolean;
  ///: END:ONLY_INCLUDE_IF
  isSwapsChain: boolean;
  isSigningEnabled: boolean;
};

export const CoinOverview = ({
  balance,
  balanceIsCached,
  className,
  classPrefix = 'coin',
  chainId,
  ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
  defaultSwapsToken,
  isBridgeChain,
  isBuyableChain,
  ///: END:ONLY_INCLUDE_IF
  isSwapsChain,
  isSigningEnabled,
}: CoinOverviewProps) => {
  ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
  // Pre-conditions
  if (isSwapsChain && defaultSwapsToken === undefined) {
    throw new Error('defaultSwapsToken is required');
  }
  ///: END:ONLY_INCLUDE_IF

  const t = useContext(I18nContext);
  const isEvm = useSelector(getMultichainIsEvm);
  const showFiat = useSelector(getMultichainShouldShowFiat);
  const { useNativeCurrencyAsPrimaryCurrency } = useSelector(getPreferences);
  const { ticker, type, rpcUrl } = useSelector(getMultichainProviderConfig);
  const isOriginalNativeSymbol = useIsOriginalNativeTokenSymbol(
    chainId,
    ticker,
    type,
    rpcUrl,
  );
  const tokensMarketData = useSelector(getTokensMarketData);

  return (
    <WalletOverview
      balance={
        <Tooltip
          position="top"
          title={t('balanceOutdated')}
          disabled={!balanceIsCached}
        >
          <div className={`${classPrefix}-overview__balance`}>
            <div className={`${classPrefix}-overview__primary-container`}>
              {balance ? (
                <UserPreferencedCurrencyDisplay
                  style={{ display: 'contents' }}
                  className={classnames(
                    `${classPrefix}-overview__primary-balance`,
                    {
                      [`${classPrefix}-overview__cached-balance`]:
                        balanceIsCached,
                    },
                  )}
                  data-testid={`${classPrefix}-overview__primary-currency`}
                  value={balance}
                  type={
                    showPrimaryCurrency(
                      isOriginalNativeSymbol,
                      useNativeCurrencyAsPrimaryCurrency,
                    )
                      ? PRIMARY
                      : SECONDARY
                  }
                  ethNumberOfDecimals={4}
                  hideTitle
                />
              ) : (
                <Spinner className="loading-overlay__spinner" />
              )}
              {balanceIsCached && (
                <span className={`${classPrefix}-overview__cached-star`}>
                  *
                </span>
              )}
            </div>
            {showFiat && isOriginalNativeSymbol && balance && (
              <UserPreferencedCurrencyDisplay
                className={classnames({
                  [`${classPrefix}__cached-secondary-balance`]: balanceIsCached,
                  [`${classPrefix}__secondary-balance`]: !balanceIsCached,
                })}
                data-testid={`${classPrefix}-overview__secondary-currency`}
                value={balance}
                type={SECONDARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
            )}
            {isEvm && (
              <PercentageAndAmountChange
                value={tokensMarketData?.[zeroAddress()]?.pricePercentChange1d}
              />
            )}
          </div>
        </Tooltip>
      }
      buttons={
        <CoinButtons
          {...{
            chainId,
            isSwapsChain,
            isSigningEnabled,
            ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
            isBridgeChain,
            isBuyableChain,
            defaultSwapsToken,
            ///: END:ONLY_INCLUDE_IF
            classPrefix,
          }}
        />
      }
      className={className}
    />
  );
};
