import { GasFeeEstimates } from '@metamask/gas-fee-controller';
import { TransactionMeta } from '@metamask/transaction-controller';
import { Hex } from '@metamask/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { EtherDenomination } from '../../../../../../../shared/constants/common';
import {
  addHexes,
  getEthConversionFromWeiHex,
  getValueFromWeiHex,
  multiplyHexes,
} from '../../../../../../../shared/modules/conversion.utils';
import { getConversionRate } from '../../../../../../ducks/metamask/metamask';
import { useFiatFormatter } from '../../../../../../hooks/useFiatFormatter';
import { useGasFeeEstimates } from '../../../../../../hooks/useGasFeeEstimates';
import { getCurrentCurrency } from '../../../../../../selectors';
import { HEX_ZERO } from '../shared/constants';
import { getGasFeeEstimate } from './getGasFeesEstimate';
import { useEIP1559TxFees } from './useEIP1559TxFees';
import { useSupportsEIP1559 } from './useSupportsEIP1559';

const EMPTY_FEE = '';
const EMPTY_FEES = {
  currentCurrencyFee: EMPTY_FEE,
  nativeCurrencyFee: EMPTY_FEE,
};

export function useFeeCalculations(transactionMeta: TransactionMeta) {
  const currentCurrency = useSelector(getCurrentCurrency);
  const conversionRate = useSelector(getConversionRate);
  const fiatFormatter = useFiatFormatter();

  const getFeesFromHex = useCallback(
    (hexFee: string) => {
      const nativeCurrencyFee =
        getEthConversionFromWeiHex({
          value: hexFee,
          fromCurrency: EtherDenomination.GWEI,
          numberOfDecimals: 4,
        }) || `0 ${EtherDenomination.ETH}`;

      const currentCurrencyFee = fiatFormatter(
        Number(
          getValueFromWeiHex({
            value: hexFee,
            conversionRate,
            fromCurrency: EtherDenomination.GWEI,
            toCurrency: currentCurrency,
            numberOfDecimals: 2,
          }),
        ),
      );

      return { currentCurrencyFee, nativeCurrencyFee };
    },
    [conversionRate, currentCurrency, fiatFormatter],
  );

  const { maxFeePerGas, maxPriorityFeePerGas } =
    useEIP1559TxFees(transactionMeta);
  const { supportsEIP1559 } = useSupportsEIP1559(transactionMeta);
  const gasEstimate = getGasFeeEstimate(transactionMeta, supportsEIP1559);

  const { gasFeeEstimates } = useGasFeeEstimates(
    transactionMeta.networkClientId,
  );
  const estimatedBaseFee = (gasFeeEstimates as GasFeeEstimates)
    ?.estimatedBaseFee;

  const layer1GasFee = transactionMeta?.layer1GasFee as string;
  const hasLayer1GasFee = Boolean(layer1GasFee);

  // L1 fee
  const feesL1 = useMemo(
    () => (hasLayer1GasFee ? getFeesFromHex(layer1GasFee) : EMPTY_FEES),
    [layer1GasFee],
  );

  // L2 fee
  const feesL2 = useMemo(
    () => (hasLayer1GasFee ? getFeesFromHex(gasEstimate) : EMPTY_FEES),
    [gasEstimate],
  );

  // Max fee
  const gasLimit =
    transactionMeta?.dappSuggestedGasFees?.gas ||
    transactionMeta?.txParams?.gas ||
    HEX_ZERO;
  const gasPrice = transactionMeta?.txParams?.gasPrice || HEX_ZERO;

  const maxFee = useMemo(() => {
    if (supportsEIP1559) {
      return multiplyHexes(maxFeePerGas as Hex, gasLimit as Hex);
    }
    return multiplyHexes(gasPrice as Hex, gasLimit as Hex);
  }, [supportsEIP1559, maxFeePerGas, gasLimit, gasPrice]);

  const { currentCurrencyFee: maxFiatFee, nativeCurrencyFee: maxNativeFee } =
    getFeesFromHex(maxFee);

  // Estimated fee
  const estimatedFees = useMemo(() => {
    if (hasLayer1GasFee) {
      // Logic for L2 transactions with L1 and L2 fee components
      const estimatedTotalFeesForL2 = addHexes(gasEstimate, layer1GasFee);

      return getFeesFromHex(estimatedTotalFeesForL2);
    }

    // Logic for any network without L1 and L2 fee components
    const minimumFeePerGas = addHexes(
      estimatedBaseFee || HEX_ZERO,
      maxPriorityFeePerGas,
    );

    const estimatedFee = multiplyHexes(
      supportsEIP1559 ? (minimumFeePerGas as Hex) : (gasPrice as Hex),
      gasLimit as Hex,
    );

    return getFeesFromHex(estimatedFee);
  }, [gasEstimate, transactionMeta, estimatedBaseFee, getFeesFromHex]);

  return {
    estimatedFiatFee: estimatedFees.currentCurrencyFee,
    estimatedNativeFee: estimatedFees.nativeCurrencyFee,
    l1FiatFee: feesL1.currentCurrencyFee,
    l1NativeFee: feesL1.nativeCurrencyFee,
    l2FiatFee: feesL2.currentCurrencyFee,
    l2NativeFee: feesL2.nativeCurrencyFee,
    maxFiatFee,
    maxNativeFee,
  };
}
