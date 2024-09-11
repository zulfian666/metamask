import React from 'react';
import { useSelector } from 'react-redux';
import {
  ConfirmInfoRow,
  ConfirmInfoRowAddress,
  ConfirmInfoRowDivider,
} from '../../../../../../../components/app/confirm/info/row';
import { ConfirmInfoSection } from '../../../../../../../components/app/confirm/info/row/section';
import { useI18nContext } from '../../../../../../../hooks/useI18nContext';
import { selectConfirmationAdvancedDetailsOpen } from '../../../../../selectors/preferences';
import { useDecodedTransactionData } from '../../hooks/useDecodedTransactionData';
import { Container } from '../transaction-data/transaction-data';
import {
  MethodDataRow,
  OriginRow,
  RecipientRow,
} from '../transaction-details/transaction-details';

export const ApproveDetails = () => {
  const showAdvancedDetails = useSelector(
    selectConfirmationAdvancedDetailsOpen,
  );

  return (
    <ConfirmInfoSection>
      <Spender />
      <OriginRow />
      {showAdvancedDetails && (
        <>
          <RecipientRow />
          <MethodDataRow />
        </>
      )}
    </ConfirmInfoSection>
  );
};

const Spender = () => {
  const t = useI18nContext();

  const decodedResponse = useDecodedTransactionData();

  const { value, pending } = decodedResponse;

  if (pending) {
    return <Container isLoading />;
  }

  if (!value) {
    return null;
  }

  return (
    <>
      <ConfirmInfoRow label={t('spender')} tooltip={t('spenderTooltipDesc')}>
        <ConfirmInfoRowAddress address={value.data[0].params[0].value} />
      </ConfirmInfoRow>

      <ConfirmInfoRowDivider />
    </>
  );
};
