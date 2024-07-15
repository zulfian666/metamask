import { TransactionMeta } from '@metamask/transaction-controller';
import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import {
  ConfirmInfoRow,
  ConfirmInfoRowVariant,
} from '../../../../../../../components/app/confirm/info/row';
import { Box } from '../../../../../../../components/component-library';
import {
  AlignItems,
  Display,
} from '../../../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../../../hooks/useI18nContext';
import { currentConfirmationSelector } from '../../../../../../../selectors';
import GasTiming from '../../../../gas-timing/gas-timing.component';
import { useEIP1559TxFees } from '../../hooks/useEIP1559TxFees';
import { useFeeCalculations } from '../../hooks/useFeeCalculations';
import { useSupportsEIP1559 } from '../../hooks/useSupportsEIP1559';
import { EditGasFeesRow } from '../edit-gas-fees-row/edit-gas-fees-row';
import { GasFeesRow } from '../gas-fees-row/gas-fees-row';

export const GasFeesDetails = ({
  setShowCustomizeGasPopover,
  showAdvancedDetails,
}: {
  setShowCustomizeGasPopover: Dispatch<SetStateAction<boolean>>;
  showAdvancedDetails: boolean;
}) => {
  const t = useI18nContext();

  const transactionMeta = useSelector(
    currentConfirmationSelector,
  ) as TransactionMeta;

  const { maxFeePerGas, maxPriorityFeePerGas } =
    useEIP1559TxFees(transactionMeta);
  const { supportsEIP1559 } = useSupportsEIP1559(transactionMeta);

  const hasLayer1GasFee = Boolean(transactionMeta?.layer1GasFee);

  const {
    estimatedFiatFee,
    estimatedNativeFee,
    l1FiatFee,
    l1NativeFee,
    l2FiatFee,
    l2NativeFee,
    maxFiatFee,
    maxNativeFee,
  } = useFeeCalculations(transactionMeta);

  if (!transactionMeta?.txParams) {
    return null;
  }

  return (
    <>
      <EditGasFeesRow
        fiatFee={estimatedFiatFee}
        nativeFee={estimatedNativeFee}
        supportsEIP1559={supportsEIP1559}
        setShowCustomizeGasPopover={setShowCustomizeGasPopover}
      />
      {showAdvancedDetails && hasLayer1GasFee && (
        <>
          <GasFeesRow
            label={t('l1Fee')}
            tooltipText={t('l1FeeTooltip')}
            fiatFee={l1FiatFee}
            nativeFee={l1NativeFee}
          />
          <GasFeesRow
            label={t('l2Fee')}
            tooltipText={t('l2FeeTooltip')}
            fiatFee={l2FiatFee}
            nativeFee={l2NativeFee}
          />
        </>
      )}
      {supportsEIP1559 && (
        <ConfirmInfoRow
          label={t('speed')}
          variant={ConfirmInfoRowVariant.Default}
        >
          <Box display={Display.Flex} alignItems={AlignItems.center}>
            <GasTiming
              maxFeePerGas={maxFeePerGas}
              maxPriorityFeePerGas={maxPriorityFeePerGas}
            />
          </Box>
        </ConfirmInfoRow>
      )}
      {showAdvancedDetails && (
        <GasFeesRow
          label={t('maxFee')}
          tooltipText={t('maxFeeTooltip')}
          fiatFee={maxFiatFee}
          nativeFee={maxNativeFee}
        />
      )}
    </>
  );
};
