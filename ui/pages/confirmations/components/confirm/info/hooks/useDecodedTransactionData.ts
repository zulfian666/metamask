import { Hex } from '@metamask/utils';
import { useSelector } from 'react-redux';
import { TransactionMeta } from '@metamask/transaction-controller';
import {
  AsyncResult,
  useAsyncResult,
} from '../../../../../../hooks/useAsyncResult';
import { decodeTransactionData } from '../../../../../../store/actions';
import { DecodedTransactionDataResponse } from '../../../../../../../shared/types/transaction-decode';
import { currentConfirmationSelector } from '../../../../selectors';

export function useDecodedTransactionData(): AsyncResult<
  DecodedTransactionDataResponse | undefined
> {
  const currentConfirmation = useSelector(currentConfirmationSelector) as
    | TransactionMeta
    | undefined;

  const chainId = currentConfirmation?.chainId as Hex;
  const contractAddress = currentConfirmation?.txParams?.to as Hex;
  const transactionData = currentConfirmation?.txParams?.data as Hex;

  return useAsyncResult(async () => {
    if (!transactionData?.length) {
      return undefined;
    }

    return await decodeTransactionData({
      transactionData,
      chainId,
      contractAddress,
    });
  }, [transactionData, chainId, contractAddress]);
}
