import React from 'react';
import {
  AlignItems,
  Display,
  FlexDirection,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { Box, Text } from '../../component-library';
import { AssetPill } from './asset-pill';
import { AmountPill } from './amount-pill';
import { BalanceChange } from './types';
import { IndividualFiatDisplay } from './fiat-display';

/**
 * Displays a single balance change, including the asset, amount, and fiat value.
 *
 * @param props
 * @param props.label
 * @param props.showFiat
 * @param props.balanceChange
 */
export const BalanceChangeRow: React.FC<{
  label?: string;
  showFiat?: boolean;
  balanceChange: BalanceChange;
}> = ({ label, showFiat, balanceChange }) => {
  const { asset, amount, fiatAmount } = balanceChange;
  return (
    <Box
      data-testid="simulation-details-balance-change-row"
      display={Display.Flex}
      flexDirection={FlexDirection.Row}
      alignItems={AlignItems.flexStart}
    >
      {label && <Text variant={TextVariant.bodyMd}>{label}</Text>}
      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        alignItems={AlignItems.flexEnd}
        gap={1}
        marginLeft={'auto'}
      >
        <Box display={Display.Flex} flexDirection={FlexDirection.Row} gap={1}>
          <AmountPill asset={asset} amount={amount} />
          <AssetPill asset={asset} />
        </Box>
        {showFiat && <IndividualFiatDisplay fiatAmount={fiatAmount} />}
      </Box>
    </Box>
  );
};
