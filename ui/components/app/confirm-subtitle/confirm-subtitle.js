import React from 'react';
import PropTypes from 'prop-types';
import { ERC1155, ERC721 } from '@metamask/controller-utils';
import { useSelector } from 'react-redux';

import { SECONDARY } from '../../../helpers/constants/common';
import {
  Color,
  FONT_WEIGHT,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { getShouldShowFiat } from '../../../selectors';
import { useTransactionInfo } from '../../../hooks/useTransactionInfo';
import { Text } from '../../component-library';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';

const ConfirmSubTitle = ({
  txData,
  hexTransactionAmount,
  subtitleComponent,
  assetStandard,
}) => {
  const shouldShowFiat = useSelector(getShouldShowFiat);
  const { isNftTransfer } = useTransactionInfo(txData);

  if (
    !shouldShowFiat &&
    !isNftTransfer &&
    assetStandard !== ERC1155 &&
    assetStandard !== ERC721
  ) {
    return null;
  }

  if (subtitleComponent) {
    return subtitleComponent;
  }

  return (
    <Text
      as="h5"
      ellipsis
      fontWeight={FONT_WEIGHT.NORMAL}
      variant={TextVariant.bodyMd}
      color={Color.textAlternative}
    >
      <UserPreferencedCurrencyDisplay
        value={hexTransactionAmount}
        type={SECONDARY}
        showEthLogo
        hideLabel
      />
    </Text>
  );
};

ConfirmSubTitle.propTypes = {
  assetStandard: PropTypes.string,
  hexTransactionAmount: PropTypes.string,
  subtitleComponent: PropTypes.element,
  txData: PropTypes.object.isRequired,
};

export default ConfirmSubTitle;
