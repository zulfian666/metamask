import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { Box, Text } from '../../component-library';
import {
  AlignItems,
  BackgroundColor,
  BorderColor,
  BorderRadius,
  BorderStyle,
  Display,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { getSelectedInternalAccount } from '../../../selectors';

import { TokenStandard } from '../../../../shared/constants/transaction';
import {
  getCurrentDraftTransaction,
  type Amount,
  type Asset,
} from '../../../ducks/send';
import MaxClearButton from './max-clear-button';
import {
  AssetPicker,
  type AssetPickerProps,
} from './asset-picker/asset-picker';
import { SwappableCurrencyInput } from './swappable-currency-input/swappable-currency-input';
import { AssetBalance } from './asset-balance/asset-balance';
import { getIsFiatPrimary } from './utils';

type AssetPickerAmountProps = OverridingUnion<
  AssetPickerProps,
  {
    // all of these props should be explicitly received
    asset: Asset;
    amount: Amount;
    isAmountLoading?: boolean;
    /**
     * Callback for when the amount changes; disables the input when undefined
     */
    onAmountChange?: (newAmount: string) => void;
  }
>;

// A component that combines an asset picker with an input for the amount to send.
export const AssetPickerAmount = ({
  asset,
  amount,
  onAmountChange,
  isAmountLoading,
  ...assetPickerProps
}: AssetPickerAmountProps) => {
  const selectedAccount = useSelector(getSelectedInternalAccount);
  const t = useI18nContext();

  const isFiatPrimary = useSelector(getIsFiatPrimary);

  const { swapQuotesError } = useSelector(getCurrentDraftTransaction);
  const isDisabled = !onAmountChange;
  const isSwapsErrorShown = isDisabled && swapQuotesError;

  const [isFocused, setIsFocused] = useState(false);

  const { error } = amount;

  useEffect(() => {
    if (!asset) {
      throw new Error('No asset is drafted for sending');
    }
  }, [selectedAccount]);

  let borderColor = BorderColor.borderDefault;

  if (isDisabled) {
    // if disabled, do not show source-side border colors
    if (isSwapsErrorShown) {
      borderColor = BorderColor.errorDefault;
    }
  } else if (amount.error) {
    borderColor = BorderColor.errorDefault;
  } else if (isFocused && !isDisabled) {
    borderColor = BorderColor.primaryDefault;
  }

  return (
    <Box className="asset-picker-amount">
      <Box
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        display={Display.Flex}
        alignItems={AlignItems.center}
        backgroundColor={BackgroundColor.backgroundDefault}
        borderRadius={BorderRadius.LG}
        borderColor={borderColor}
        borderStyle={BorderStyle.solid}
        borderWidth={1}
        marginTop={1}
        marginBottom={1}
        padding={1}
        // apply extra padding if there isn't an input component to apply it
        paddingTop={asset.details?.standard === TokenStandard.ERC721 ? 4 : 1}
        paddingBottom={asset.details?.standard === TokenStandard.ERC721 ? 4 : 1}
      >
        <AssetPicker asset={asset} {...assetPickerProps} />
        <SwappableCurrencyInput
          onAmountChange={onAmountChange}
          assetType={asset.type}
          asset={asset}
          amount={amount}
          isAmountLoading={isAmountLoading}
        />
      </Box>
      <Box display={Display.Flex}>
        {/* Only show balance if mutable */}
        {onAmountChange && <AssetBalance asset={asset} error={error} />}
        {isSwapsErrorShown && (
          <Text variant={TextVariant.bodySm} color={TextColor.errorDefault}>
            {t(swapQuotesError)}
          </Text>
        )}
        {/* The fiat value will always leave dust and is often inaccurate anyways */}
        {!isFiatPrimary && onAmountChange && <MaxClearButton asset={asset} />}
      </Box>
    </Box>
  );
};
