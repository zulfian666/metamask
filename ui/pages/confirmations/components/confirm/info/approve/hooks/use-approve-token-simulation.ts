import { TransactionMeta } from '@metamask/transaction-controller';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIntlLocale } from '../../../../../../../ducks/locale/locale';
import { SPENDING_CAP_UNLIMITED_MSG } from '../../../../../constants';
import { useDecodedTransactionData } from '../../hooks/useDecodedTransactionData';
import { useIsNFT } from './use-is-nft';

const UNLIMITED_THRESHOLD = 10 ** 15;

function isSpendingCapUnlimited(decodedSpendingCap: number) {
  return decodedSpendingCap >= UNLIMITED_THRESHOLD;
}

export const useApproveTokenSimulation = (
  transactionMeta: TransactionMeta,
  decimals: string,
) => {
  const locale = useSelector(getIntlLocale);
  const { isNFT, pending: isNFTPending } = useIsNFT(transactionMeta);
  const decodedResponse = useDecodedTransactionData();
  const { value, pending } = decodedResponse;

  const decodedSpendingCap = useMemo(() => {
    return value
      ? new BigNumber(value.data[0].params[1].value)
          .dividedBy(new BigNumber(10).pow(Number(decimals)))
          .toNumber()
      : 0;
  }, [value, decimals]);

  const formattedSpendingCap = useMemo(() => {
    return isNFT
      ? decodedSpendingCap
      : new Intl.NumberFormat(locale).format(decodedSpendingCap);
  }, [decodedSpendingCap, isNFT, locale]);

  const spendingCap = useMemo(() => {
    if (!isNFT && isSpendingCapUnlimited(decodedSpendingCap)) {
      return SPENDING_CAP_UNLIMITED_MSG;
    }
    const tokenPrefix = isNFT ? '#' : '';
    return `${tokenPrefix}${formattedSpendingCap}`;
  }, [decodedSpendingCap, formattedSpendingCap, isNFT]);

  return {
    spendingCap,
    formattedSpendingCap,
    value,
    pending: pending || isNFTPending,
  };
};
