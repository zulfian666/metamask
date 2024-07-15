import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import {
  TransactionMeta,
  TransactionType,
} from '@metamask/transaction-controller';
import {
  currentConfirmationSelector,
  getApprovedAndSignedTransactions,
} from '../../../../../selectors';
import { Severity } from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { Alert } from '../../../../../ducks/confirm-alerts/confirm-alerts';
import { REDESIGN_TRANSACTION_TYPES } from '../../../utils';

export function useSigningOrSubmittingAlerts(): Alert[] {
  const t = useI18nContext();
  const currentConfirmation = useSelector(currentConfirmationSelector);
  const { type } = (currentConfirmation ?? {}) as TransactionMeta;

  const signingOrSubmittingTransactions = useSelector(
    getApprovedAndSignedTransactions,
  );

  const isValidType = REDESIGN_TRANSACTION_TYPES.includes(
    type as TransactionType,
  );

  const isSigningOrSubmitting =
    isValidType && signingOrSubmittingTransactions.length > 0;

  return useMemo(() => {
    if (!isSigningOrSubmitting) {
      return [];
    }

    return [
      {
        isBlocking: true,
        key: 'signingOrSubmitting',
        message: t('alertMessageSigningOrSubmitting'),
        severity: Severity.Warning,
      },
    ];
  }, [isSigningOrSubmitting]);
}
