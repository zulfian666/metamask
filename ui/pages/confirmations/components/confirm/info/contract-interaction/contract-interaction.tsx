import { TransactionMeta } from '@metamask/transaction-controller';
import React from 'react';
import { useSelector } from 'react-redux';
import { ConfirmInfoSection } from '../../../../../../components/app/confirm/info/row/section';
import { currentConfirmationSelector } from '../../../../../../selectors';
import { SimulationDetails } from '../../../simulation-details';
import { AdvancedDetails } from '../shared/advanced-details/advanced-details';
import { GasFeesSection } from '../shared/gas-fees-section/gas-fees-section';
import { TransactionDetails } from '../shared/transaction-details/transaction-details';

type InfoProps = {
  showAdvancedDetails: boolean;
};

const ContractInteractionInfo: React.FC<InfoProps> = ({
  showAdvancedDetails,
}) => {
  const transactionMeta = useSelector(
    currentConfirmationSelector,
  ) as TransactionMeta;

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
      <GasFeesSection showAdvancedDetails={showAdvancedDetails} />
      {showAdvancedDetails && <AdvancedDetails />}
    </>
  );
};

export default ContractInteractionInfo;
