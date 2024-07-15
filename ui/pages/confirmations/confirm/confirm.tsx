import React, { useState } from 'react';
///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
import { MMISignatureMismatchBanner } from '../../../components/institutional/signature-mismatch-banner';
///: END:ONLY_INCLUDE_IF
import { Page } from '../../../components/multichain/pages/page';
import { GasFeeContextProvider } from '../../../contexts/gasFee';
import { TransactionModalContextProvider } from '../../../contexts/transaction-modal';
import AdvancedGasFeePopover from '../components/advanced-gas-fee-popover';
import { BlockaidLoadingIndicator } from '../components/confirm/blockaid-loading-indicator';
import { ConfirmAlerts } from '../components/confirm/confirm-alerts';
import { Footer } from '../components/confirm/footer';
import { Header } from '../components/confirm/header';
import { Info } from '../components/confirm/info';
import { LedgerInfo } from '../components/confirm/ledger-info';
import { Nav } from '../components/confirm/nav';
import { PluggableSection } from '../components/confirm/pluggable-section';
import ScrollToBottom from '../components/confirm/scroll-to-bottom';
import { Title } from '../components/confirm/title';
import EditGasFeePopover from '../components/edit-gas-fee-popover';
import setCurrentConfirmation from '../hooks/setCurrentConfirmation';
import syncConfirmPath from '../hooks/syncConfirmPath';

const EIP1559TransactionGasModal = () => {
  return (
    <>
      <EditGasFeePopover />
      <AdvancedGasFeePopover />
    </>
  );
};

const Confirm = () => {
  const currentConfirmation = setCurrentConfirmation();
  syncConfirmPath();

  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  return (
    <TransactionModalContextProvider>
      {/* This context should be removed once we implement the new edit gas fees popovers */}
      <GasFeeContextProvider transaction={currentConfirmation}>
        <EIP1559TransactionGasModal />
        <ConfirmAlerts>
          <Page className="confirm_wrapper">
            <Nav />
            <Header
              showAdvancedDetails={showAdvancedDetails}
              setShowAdvancedDetails={setShowAdvancedDetails}
            />
            <ScrollToBottom showAdvancedDetails={showAdvancedDetails}>
              {
                ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
                <MMISignatureMismatchBanner />
                ///: END:ONLY_INCLUDE_IF
              }
              <BlockaidLoadingIndicator />
              <LedgerInfo />
              <Title />
              <Info showAdvancedDetails={showAdvancedDetails} />
              <PluggableSection />
            </ScrollToBottom>
            <Footer />
          </Page>
        </ConfirmAlerts>
      </GasFeeContextProvider>
    </TransactionModalContextProvider>
  );
};

export default Confirm;
