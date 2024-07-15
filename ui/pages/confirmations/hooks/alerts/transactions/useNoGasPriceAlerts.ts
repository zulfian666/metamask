import { useSelector } from 'react-redux';
import {
  TransactionMeta,
  UserFeeLevel,
} from '@metamask/transaction-controller';
import { useMemo } from 'react';
import { Alert } from '../../../../../ducks/confirm-alerts/confirm-alerts';
import {
  currentConfirmationSelector,
  getNoGasPriceFetched,
} from '../../../../../selectors';
import { txParamsAreDappSuggested } from '../../../../../../shared/modules/transaction.utils';
import { Severity } from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import {
  AlertActionKey,
  RowAlertKey,
} from '../../../../../components/app/confirm/info/row/constants';

export function useNoGasPriceAlerts(): Alert[] {
  const t = useI18nContext();
  const isNoGasPriceFetched = useSelector(getNoGasPriceFetched);

  const currentConfirmation = useSelector(currentConfirmationSelector) as
    | TransactionMeta
    | undefined;

  const isNotCustomGasPrice =
    currentConfirmation?.userFeeLevel &&
    currentConfirmation.userFeeLevel !== UserFeeLevel.CUSTOM &&
    !txParamsAreDappSuggested(currentConfirmation);

  const noGasPrice = isNotCustomGasPrice && isNoGasPriceFetched;

  return useMemo(() => {
    if (!noGasPrice) {
      return [];
    }

    return [
      {
        actions: [
          {
            key: AlertActionKey.ShowAdvancedGasFeeModal,
            label: t('alertActionUpdateGasFee'),
          },
        ],
        field: RowAlertKey.EstimatedFee,
        isBlocking: true,
        key: 'noGasPrice',
        message: t('alertMessageNoGasPrice'),
        reason: t('alertReasonNoGasPrice'),
        severity: Severity.Warning,
      },
    ];
  }, [noGasPrice]);
}
