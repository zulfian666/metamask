import { TransactionMeta } from '@metamask/transaction-controller';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Severity } from '../../../../../helpers/constants/design-system';
import { Alert } from '../../../../../ducks/confirm-alerts/confirm-alerts';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { currentConfirmationSelector } from '../../../selectors';
import { RowAlertKey } from '../../../../../components/app/confirm/info/row/constants';
import { getIsNetworkBusyByChainId } from '../../../../../ducks/metamask/metamask';

export function useNetworkBusyAlerts(): Alert[] {
  const t = useI18nContext();

  const currentConfirmation = useSelector(currentConfirmationSelector) as
    | TransactionMeta
    | undefined;

  const isNetworkBusy = useSelector((state) =>
    getIsNetworkBusyByChainId(state, currentConfirmation?.chainId),
  );

  const showAlert = currentConfirmation?.chainId && isNetworkBusy;

  return useMemo(() => {
    if (!showAlert) {
      return [];
    }

    return [
      {
        field: RowAlertKey.EstimatedFee,
        key: 'networkBusy',
        message: t('alertMessageNetworkBusy'),
        reason: t('alertReasonNetworkBusy'),
        severity: Severity.Warning,
      },
    ];
  }, [showAlert]);
}
