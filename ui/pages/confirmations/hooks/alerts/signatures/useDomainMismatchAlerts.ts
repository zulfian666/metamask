import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  isValidSIWEOrigin,
  WrappedSIWERequest,
} from '@metamask/controller-utils';

import { Alert } from '../../../../../ducks/confirm-alerts/confirm-alerts';
import { Severity } from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { currentConfirmationSelector } from '../../../../../selectors';

import { SignatureRequestType } from '../../../types/confirm';
import { isSIWESignatureRequest } from '../../../utils';

export default function useDomainMismatchAlerts(): Alert[] {
  const t = useI18nContext();

  const currentConfirmation = useSelector(
    currentConfirmationSelector,
  ) as SignatureRequestType;
  const { msgParams } = currentConfirmation || {};

  const isSIWE = isSIWESignatureRequest(currentConfirmation);
  const isInvalidSIWEDomain =
    isSIWE && !isValidSIWEOrigin(msgParams as WrappedSIWERequest);

  const alerts = useMemo(() => {
    if (!isInvalidSIWEDomain) {
      return [];
    }

    return [
      {
        field: 'requestFrom',
        key: 'requestFrom',
        message: t('alertMessageSignInDomainMismatch'),
        reason: t('alertReasonSignIn'),
        severity: Severity.Danger,
      },
    ] as Alert[];
  }, [isInvalidSIWEDomain, t]);

  return alerts;
}
