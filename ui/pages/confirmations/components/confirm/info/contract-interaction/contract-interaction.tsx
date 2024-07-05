import { TransactionMeta } from '@metamask/transaction-controller';
import React from 'react';
import { useSelector } from 'react-redux';
import { ConfirmInfoSection } from '../../../../../../components/app/confirm/info/row/section';
import { currentConfirmationSelector } from '../../../../../../selectors';
import { SimulationDetails } from '../../../simulation-details';
import { useAdvancedDetailsHandler } from '../contexts/advanced-details-context';
import { AdvancedDetails } from '../shared/advanced-details/advanced-details';
import { GasFeesSection } from '../shared/gas-fees-section/gas-fees-section';
import { TransactionDetails } from '../shared/transaction-details/transaction-details';

const ContractInteractionInfo = () => {
  const transactionMeta = useSelector(
    currentConfirmationSelector,
  ) as TransactionMeta;

  const { showAdvancedDetails } = useAdvancedDetailsHandler();

  if (!transactionMeta?.txParams) {
    return null;
  }

  return (
    <>
      <ConfirmInfoSection noPadding>
        <SimulationDetails
          simulationData={transactionMeta.simulationData}
          transactionId={transactionMeta.id}
          isTransactionsRedesign
        />
      </ConfirmInfoSection>
      <TransactionDetails />
      <GasFeesSection />
      {showAdvancedDetails && <AdvancedDetails />}
    </>
  );
};

export default ContractInteractionInfo;
