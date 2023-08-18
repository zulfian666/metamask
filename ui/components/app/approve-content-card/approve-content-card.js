import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useSelector } from 'react-redux';

import EditGasFeeButton from '../edit-gas-fee-button/edit-gas-fee-button';
import { Text, Box, Button, BUTTON_VARIANT } from '../../component-library';
import {
  AlignItems,
  BlockSize,
  Display,
  FlexDirection,
  FontWeight,
  JustifyContent,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import { I18nContext } from '../../../contexts/i18n';
import { getPreferences } from '../../../selectors';
import { ConfirmGasDisplay } from '../confirm-gas-display';
import MultiLayerFeeMessage from '../multilayer-fee-message/multi-layer-fee-message';
import { formatCurrency } from '../../../helpers/utils/confirm-tx.util';
import TransactionDetailItem from '../transaction-detail-item/transaction-detail-item.component';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';

export default function ApproveContentCard({
  showHeader = true,
  symbol,
  title,
  showEdit,
  showAdvanceGasFeeOptions = false,
  onEditClick,
  footer,
  noBorder,
  supportsEIP1559,
  renderTransactionDetailsContent,
  renderDataContent,
  isMultiLayerFeeNetwork,
  ethTransactionTotal,
  nativeCurrency,
  fullTxData,
  hexMinimumTransactionFee,
  hexTransactionTotal,
  fiatTransactionTotal,
  currentCurrency,
  isSetApproveForAll,
  isApprovalOrRejection,
  data,
  userAcknowledgedGasMissing,
  renderSimulationFailureWarning,
  useCurrencyRateCheck,
}) {
  const t = useContext(I18nContext);
  const { useNativeCurrencyAsPrimaryCurrency } = useSelector(getPreferences);

  return (
    <Box
      className={classnames({
        'approve-content-card-container__card': !noBorder,
        'approve-content-card-container__card--no-border': noBorder,
      })}
    >
      {showHeader && (
        <Box
          className="approve-content-card-container__card-header"
          display={Display.Flex}
          flexDirection={FlexDirection.Row}
          alignItems={AlignItems.center}
        >
          {supportsEIP1559 && title === t('transactionFee') ? null : (
            <Box display={Display.Flex} gap={1}>
              {symbol}
              <Text fontWeight={FontWeight.Bold}>{title}</Text>
            </Box>
          )}
          {showEdit && (!showAdvanceGasFeeOptions || !supportsEIP1559) && (
            <Button
              variant={BUTTON_VARIANT.LINK}
              onClick={() => onEditClick()}
              marginLeft="auto"
            >
              {t('edit')}
            </Button>
          )}
          {showEdit &&
            showAdvanceGasFeeOptions &&
            supportsEIP1559 &&
            !renderSimulationFailureWarning && (
              <EditGasFeeButton
                userAcknowledgedGasMissing={userAcknowledgedGasMissing}
              />
            )}
        </Box>
      )}
      <Box className="approve-content-card-container__card-content">
        {renderTransactionDetailsContent &&
          (!isMultiLayerFeeNetwork &&
          supportsEIP1559 &&
          !renderSimulationFailureWarning ? (
            <ConfirmGasDisplay
              userAcknowledgedGasMissing={userAcknowledgedGasMissing}
            />
          ) : (
            <Box
              display={Display.Flex}
              flexDirection={FlexDirection.Row}
              justifyContent={JustifyContent.spaceBetween}
            >
              {isMultiLayerFeeNetwork ? (
                <Box
                  display={Display.Flex}
                  flexDirection={FlexDirection.Column}
                  width={BlockSize.Full}
                >
                  <TransactionDetailItem
                    key="approve-content-card-min-tx-fee"
                    detailTitle={t('transactionDetailLayer2GasHeading')}
                    detailTotal={
                      <UserPreferencedCurrencyDisplay
                        type={PRIMARY}
                        value={hexMinimumTransactionFee}
                        hideLabel={!useNativeCurrencyAsPrimaryCurrency}
                        numberOfDecimals={18}
                      />
                    }
                    detailText={
                      <UserPreferencedCurrencyDisplay
                        type={SECONDARY}
                        value={hexMinimumTransactionFee}
                        hideLabel={Boolean(useNativeCurrencyAsPrimaryCurrency)}
                      />
                    }
                    noBold
                    flexWidthValues
                  />
                  <MultiLayerFeeMessage
                    transaction={fullTxData}
                    layer2fee={hexTransactionTotal}
                    nativeCurrency={nativeCurrency}
                    plainStyle
                  />
                </Box>
              ) : (
                <>
                  <Text color={TextColor.textAlternative}>
                    {t('feeAssociatedRequest')}
                  </Text>
                  <Box
                    display={Display.Flex}
                    flexDirection={FlexDirection.Column}
                    alignItems={AlignItems.flexEnd}
                    textAlign={TextAlign.Right}
                  >
                    {useCurrencyRateCheck && (
                      <Text
                        as="h4"
                        variant={TextVariant.headingSm}
                        color={TextColor.textDefault}
                      >
                        {formatCurrency(fiatTransactionTotal, currentCurrency)}
                      </Text>
                    )}
                    <Text color={TextColor.textMuted}>
                      {`${ethTransactionTotal} ${nativeCurrency}`}
                    </Text>
                  </Box>
                </>
              )}
            </Box>
          ))}
        {renderDataContent && (
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Column}
            width={BlockSize.Full}
          >
            <Text color={TextColor.textAlternative}>
              {isSetApproveForAll
                ? t('functionSetApprovalForAll')
                : t('functionApprove')}
            </Text>
            {isSetApproveForAll && isApprovalOrRejection !== undefined ? (
              <Text color={TextColor.textAlternative}>
                {`${t('parameters')}: ${isApprovalOrRejection}`}
              </Text>
            ) : null}
            <Text
              className="approve-content-card-container__data-block"
              color={TextColor.textAlternative}
            >
              {data}
            </Text>
          </Box>
        )}
      </Box>
      {footer}
    </Box>
  );
}

ApproveContentCard.propTypes = {
  /**
   * Whether to show header including icon, transaction fee text and edit button
   */
  showHeader: PropTypes.bool,
  /**
   * Symbol icon
   */
  symbol: PropTypes.node,
  /**
   * Title to be included in the header
   */
  title: PropTypes.string,
  /**
   * Whether to show edit button or not
   */
  showEdit: PropTypes.bool,
  /**
   * Whether to show advanced gas fee options or not
   */
  showAdvanceGasFeeOptions: PropTypes.bool,
  /**
   * Should open customize gas modal when edit button is clicked
   */
  onEditClick: PropTypes.func,
  /**
   * Footer to be shown
   */
  footer: PropTypes.node,
  /**
   * Whether to include border-bottom or not
   */
  noBorder: PropTypes.bool,
  /**
   * Is enhanced gas fee enabled or not
   */
  supportsEIP1559: PropTypes.bool,
  /**
   * Whether to render transaction details content or not
   */
  renderTransactionDetailsContent: PropTypes.bool,
  /**
   * Whether to render data content or not
   */
  renderDataContent: PropTypes.bool,
  /**
   * Is multi-layer fee network or not
   */
  isMultiLayerFeeNetwork: PropTypes.bool,
  /**
   * Total sum of the transaction in native currency
   */
  ethTransactionTotal: PropTypes.string,
  /**
   * Current native currency
   */
  nativeCurrency: PropTypes.string,
  /**
   * Current transaction
   */
  fullTxData: PropTypes.object,
  /**
   * Total sum of the transaction converted to hex value
   */
  hexTransactionTotal: PropTypes.string,
  /**
   * Minimum transaction fee converted to hex value
   */
  hexMinimumTransactionFee: PropTypes.string,
  /**
   * Total sum of the transaction in fiat currency
   */
  fiatTransactionTotal: PropTypes.string,
  /**
   * Current fiat currency
   */
  currentCurrency: PropTypes.string,
  /**
   * Is set approve for all or not
   */
  isSetApproveForAll: PropTypes.bool,
  /**
   * Whether a current set approval for all transaction will approve or revoke access
   */
  isApprovalOrRejection: PropTypes.bool,
  /**
   * Current transaction data
   */
  data: PropTypes.string,
  /**
   * User acknowledge gas is missing or not
   */
  userAcknowledgedGasMissing: PropTypes.bool,
  /**
   * Render simulation failure warning
   */
  renderSimulationFailureWarning: PropTypes.bool,
  /**
   * Fiat conversion control
   */
  useCurrencyRateCheck: PropTypes.bool,
};
