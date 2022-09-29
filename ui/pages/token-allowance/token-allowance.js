import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from '../../components/ui/box/box';
import NetworkAccountBalanceHeader from '../../components/app/network-account-balance-header/network-account-balance-header';
import UrlIcon from '../../components/ui/url-icon/url-icon';
import Typography from '../../components/ui/typography/typography';
import {
  ALIGN_ITEMS,
  BLOCK_SIZES,
  COLORS,
  DISPLAY,
  FLEX_DIRECTION,
  FONT_WEIGHT,
  JUSTIFY_CONTENT,
  TEXT_ALIGN,
  TYPOGRAPHY,
} from '../../helpers/constants/design-system';
import { I18nContext } from '../../contexts/i18n';
import ContractTokenValues from '../../components/ui/contract-token-values/contract-token-values';
import Button from '../../components/ui/button';
import ReviewSpendingCap from '../../components/ui/review-spending-cap/review-spending-cap';
import { PageContainerFooter } from '../../components/ui/page-container';
import ContractDetailsModal from '../../components/app/modals/contract-details-modal/contract-details-modal';
import GasDetailsItem from '../../components/app/gas-details-item/gas-details-item';
import MultiLayerFeeMessage from '../../components/app/multilayer-fee-message/multi-layer-fee-message';
import { formatCurrency } from '../../helpers/utils/confirm-tx.util';
import {
  getCurrentAccountWithSendEtherInfo,
  getNetworkIdentifier,
  transactionFeeSelector,
  getKnownMethodData,
  getRpcPrefsForCurrentProvider,
} from '../../selectors';
import { NETWORK_TO_NAME_MAP } from '../../../shared/constants/network';
import {
  cancelTx,
  updateAndApproveTx,
  updateCustomNonce,
} from '../../store/actions';
import { clearConfirmTransaction } from '../../ducks/confirm-transaction/confirm-transaction.duck';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import EditGasFeeButton from '../../components/app/edit-gas-fee-button/edit-gas-fee-button';

export default function TokenAllowance({
  origin,
  siteImage,
  showCustomizeGasModal,
  useNonceField,
  currentCurrency,
  nativeCurrency,
  ethTransactionTotal,
  fiatTransactionTotal,
  hexTransactionTotal,
  txData,
  isMultiLayerFeeNetwork,
  supportsEIP1559V2,
  userAddress,
  tokenAddress,
  data,
  isSetApproveForAll,
  setApproveForAllArg,
  customTxParamsData,
  dappProposedTokenAmount,
  currentTokenBalance,
  toAddress,
  tokenSymbol,
}) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);

  const [showContractDetails, setShowContractDetails] = useState(false);
  const [showFullTxDetails, setShowFullTxDetails] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);

  const currentAccount = useSelector(getCurrentAccountWithSendEtherInfo);
  const networkIdentifier = useSelector(getNetworkIdentifier);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);

  let fullTxData = { ...txData };

  if (customTxParamsData) {
    fullTxData = {
      ...fullTxData,
      txParams: {
        ...fullTxData.txParams,
        data: customTxParamsData,
      },
    };
  }

  const fee = useSelector((state) => transactionFeeSelector(state, fullTxData));
  const methodData = useSelector((state) => getKnownMethodData(state, data));

  const networkName =
    NETWORK_TO_NAME_MAP[fullTxData.chainId] || networkIdentifier;

  const customNonceValue = '';
  const customNonceMerge = (transactionData) =>
    customNonceValue
      ? {
          ...transactionData,
          customNonceValue,
        }
      : transactionData;

  const handleReject = () => {
    dispatch(cancelTx(fullTxData)).then(() => {
      dispatch(clearConfirmTransaction());
      dispatch(updateCustomNonce(''));
      history.push(mostRecentOverviewPage);
    });
  };

  const handleApprove = () => {
    const { name } = methodData;

    if (fee.gasEstimationObject.baseFeePerGas) {
      fullTxData.estimatedBaseFee = fee.gasEstimationObject.baseFeePerGas;
    }

    if (name) {
      fullTxData.contractMethodName = name;
    }

    if (dappProposedTokenAmount) {
      fullTxData.dappProposedTokenAmount = dappProposedTokenAmount;
      fullTxData.originalApprovalAmount = dappProposedTokenAmount;
    }

    if (currentTokenBalance) {
      fullTxData.currentTokenBalance = currentTokenBalance;
    }

    dispatch(updateAndApproveTx(customNonceMerge(fullTxData))).then(() => {
      dispatch(clearConfirmTransaction());
      dispatch(updateCustomNonce(''));
      history.push(mostRecentOverviewPage);
    });
  };

  const renderApproveContentCard = ({
    showHeader = true,
    symbol,
    title,
    showEdit,
    showAdvanceGasFeeOptions = false,
    onEditClick,
    content,
    footer,
    noBorder,
  }) => {
    return (
      <Box
        className={classnames({
          'token-allowance-container__card': !noBorder,
          'token-allowance-container__card--no-border': noBorder,
        })}
      >
        {showHeader && (
          <Box
            display={DISPLAY.FLEX}
            flexDirection={FLEX_DIRECTION.ROW}
            alignItems={ALIGN_ITEMS.CENTER}
            justifyContent={JUSTIFY_CONTENT.FLEX_END}
            className="token-allowance-container__card-header"
          >
            {supportsEIP1559V2 && title === t('transactionFee') ? null : (
              <>
                <Box className="token-allowance-container__card-header__symbol">
                  {symbol}
                </Box>
                <Box
                  marginLeft={4}
                  className="token-allowance-container__card-header__title"
                >
                  <Typography
                    variant={TYPOGRAPHY.H6}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {title}
                  </Typography>
                </Box>
              </>
            )}
            {showEdit && (!showAdvanceGasFeeOptions || !supportsEIP1559V2) && (
              <Box width={BLOCK_SIZES.ONE_SIXTH}>
                <Button type="link" onClick={() => onEditClick()}>
                  <Typography
                    variant={TYPOGRAPHY.H7}
                    color={COLORS.PRIMARY_DEFAULT}
                  >
                    {t('edit')}
                  </Typography>
                </Button>
              </Box>
            )}
            {showEdit && showAdvanceGasFeeOptions && supportsEIP1559V2 && (
              <EditGasFeeButton />
            )}
          </Box>
        )}
        <Box
          marginTop={1}
          marginBottom={3}
          className="token-allowance-container__card-content"
        >
          {content}
        </Box>
        {footer}
      </Box>
    );
  };

  const renderTransactionDetailsContent = () => {
    if (!isMultiLayerFeeNetwork && supportsEIP1559V2) {
      return <GasDetailsItem />;
    }
    return (
      <Box
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.ROW}
        justifyContent={JUSTIFY_CONTENT.SPACE_BETWEEN}
      >
        {isMultiLayerFeeNetwork ? (
          <Box
            display={DISPLAY.FLEX}
            flexDirection={FLEX_DIRECTION.COLUMN}
            className="token-allowance-container__transaction-details-extra-content"
          >
            <Box
              display={DISPLAY.FLEX}
              justifyContent={JUSTIFY_CONTENT.SPACE_BETWEEN}
            >
              <Typography
                variant={TYPOGRAPHY.H6}
                fontWeight={FONT_WEIGHT.NORMAL}
                color={COLORS.TEXT_MUTED}
              >
                <span>{t('transactionDetailLayer2GasHeading')}</span>
                {`${ethTransactionTotal} ${nativeCurrency}`}
              </Typography>
            </Box>
            <MultiLayerFeeMessage
              transaction={fullTxData}
              layer2fee={hexTransactionTotal}
              nativeCurrency={nativeCurrency}
              plainStyle
            />
          </Box>
        ) : (
          <>
            <Box>
              <Typography
                variant={TYPOGRAPHY.H7}
                color={COLORS.TEXT_ALTERNATIVE}
              >
                {t('feeAssociatedRequest')}
              </Typography>
            </Box>
            <Box
              display={DISPLAY.FLEX}
              flexDirection={FLEX_DIRECTION.COLUMN}
              alignItems={ALIGN_ITEMS.FLEX_END}
              textAlign={TEXT_ALIGN.RIGHT}
            >
              <Box>
                <Typography
                  variant={TYPOGRAPHY.H4}
                  fontWeight={FONT_WEIGHT.BOLD}
                  color={COLORS.TEXT_DEFAULT}
                >
                  {formatCurrency(fiatTransactionTotal, currentCurrency)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant={TYPOGRAPHY.H6}
                  fontWeight={FONT_WEIGHT.NORMAL}
                  color={COLORS.TEXT_MUTED}
                >
                  {`${ethTransactionTotal} ${nativeCurrency}`}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  };

  const renderDataContent = () => {
    return (
      <Box display={DISPLAY.FLEX} flexDirection={FLEX_DIRECTION.COLUMN}>
        <Box>
          <Typography variant={TYPOGRAPHY.H7} color={COLORS.TEXT_ALTERNATIVE}>
            {isSetApproveForAll
              ? t('functionSetApprovalForAll')
              : t('functionApprove')}
          </Typography>
        </Box>
        {isSetApproveForAll && setApproveForAllArg !== undefined ? (
          <Box>
            <Typography variant={TYPOGRAPHY.H7} color={COLORS.TEXT_ALTERNATIVE}>
              {`${t('parameters')}: ${setApproveForAllArg}`}
            </Typography>
          </Box>
        ) : null}
        <Box
          marginRight={4}
          className="token-allowance-container__data__data-block"
        >
          <Typography variant={TYPOGRAPHY.H7} color={COLORS.TEXT_ALTERNATIVE}>
            {data}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderFullDetails = () => {
    return (
      <Box
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.COLUMN}
        alignItems={ALIGN_ITEMS.CENTER}
        className="token-allowance-container__full-tx-content"
      >
        <Box className="token-allowance-container__data">
          {renderApproveContentCard({
            symbol: <i className="fa fa-file" />,
            title: 'Data',
            content: renderDataContent(),
            noBorder: true,
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box className="token-allowance-container page-container">
      <Box
        paddingLeft={4}
        paddingRight={4}
        alignItems={ALIGN_ITEMS.CENTER}
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.ROW}
        justifyContent={JUSTIFY_CONTENT.SPACE_BETWEEN}
      >
        <Box>
          {!isFirstPage && (
            <Button type="inline" onClick={() => setIsFirstPage(true)}>
              <Typography
                variant={TYPOGRAPHY.H6}
                color={COLORS.TEXT_MUTED}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                {'<'} {t('back')}
              </Typography>
            </Button>
          )}
        </Box>
        <Box textAlign={TEXT_ALIGN.END}>
          <Typography
            variant={TYPOGRAPHY.H7}
            color={COLORS.TEXT_MUTED}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {isFirstPage ? 1 : 2} {t('ofTextNofM')} 2
          </Typography>
        </Box>
      </Box>
      <NetworkAccountBalanceHeader
        networkName={networkName}
        accountName={currentAccount.name}
        accountBalance={currentTokenBalance}
        tokenName={tokenSymbol}
        accountAddress={userAddress}
      />
      <Box
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.ROW}
        justifyContent={JUSTIFY_CONTENT.CENTER}
      >
        <Box
          display={DISPLAY.FLEX}
          alignItems={ALIGN_ITEMS.CENTER}
          marginTop={6}
          marginRight={12}
          marginBottom={8}
          marginLeft={12}
          paddingTop={2}
          paddingRight={4}
          paddingBottom={2}
          paddingLeft={2}
          className="token-allowance-container__icon-display-content"
        >
          <UrlIcon
            className="token-allowance-container__icon-display-content__siteimage-identicon"
            fallbackClassName="token-allowance-container__icon-display-content__siteimage-identicon"
            name={origin}
            url={siteImage}
          />
          <Typography
            variant={TYPOGRAPHY.H6}
            fontWeight={FONT_WEIGHT.NORMAL}
            color={COLORS.TEXT_ALTERNATIVE}
            boxProps={{ marginLeft: 1, marginTop: 2 }}
          >
            {origin}
          </Typography>
        </Box>
      </Box>
      <Box marginBottom={5}>
        <Typography
          variant={TYPOGRAPHY.H3}
          fontWeight={FONT_WEIGHT.BOLD}
          align={TEXT_ALIGN.CENTER}
        >
          {isFirstPage ? t('setSpendingCap') : t('reviewSpendingCap')}
        </Typography>
      </Box>
      <Box>
        <ContractTokenValues
          tokenName={tokenSymbol}
          address={tokenAddress}
          chainId={fullTxData.chainId}
          rpcPrefs={rpcPrefs}
        />
      </Box>
      <Box
        marginTop={1}
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.ROW}
        justifyContent={JUSTIFY_CONTENT.CENTER}
      >
        <Button
          type="link"
          onClick={() => setShowContractDetails(true)}
          className="token-allowance-container__verify-link"
        >
          <Typography variant={TYPOGRAPHY.H6} color={COLORS.PRIMARY_DEFAULT}>
            {t('verifyContractDetails')}
          </Typography>
        </Button>
      </Box>
      <Box margin={[4, 4, 3, 4]}>
        <ReviewSpendingCap
          tokenName={tokenSymbol}
          currentTokenBalance={parseFloat(currentTokenBalance)}
          tokenValue={10}
          onEdit={() => setIsFirstPage(true)}
        />
      </Box>
      {!isFirstPage && (
        <Box className="token-allowance-container__card-wrapper">
          {renderApproveContentCard({
            symbol: <i className="fa fa-tag" />,
            title: t('transactionFee'),
            showEdit: true,
            showAdvanceGasFeeOptions: true,
            onEditClick: showCustomizeGasModal,
            content: renderTransactionDetailsContent(),
            noBorder: useNonceField || !showFullTxDetails,
          })}
        </Box>
      )}
      <Box
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.ROW}
        justifyContent={JUSTIFY_CONTENT.CENTER}
      >
        <Button
          type="link"
          onClick={() => setShowFullTxDetails(!showFullTxDetails)}
          className="token-allowance-container__view-details"
        >
          <Typography
            variant={TYPOGRAPHY.H6}
            color={COLORS.PRIMARY_DEFAULT}
            marginRight={1}
          >
            {t('viewDetails')}
          </Typography>
          {showFullTxDetails ? (
            <i className="fa fa-sm fa-angle-up" />
          ) : (
            <i className="fa fa-sm fa-angle-down" />
          )}
        </Button>
      </Box>
      {showFullTxDetails ? renderFullDetails() : null}
      <PageContainerFooter
        cancelText={t('reject')}
        submitText={isFirstPage ? t('next') : t('approveButtonText')}
        onCancel={() => handleReject()}
        onSubmit={() => (isFirstPage ? setIsFirstPage(false) : handleApprove())}
      />
      {showContractDetails && (
        <ContractDetailsModal
          tokenName={tokenSymbol}
          onClose={() => setShowContractDetails(false)}
          tokenAddress={tokenAddress}
          toAddress={toAddress}
          chainId={fullTxData.chainId}
          rpcPrefs={rpcPrefs}
          origin={origin}
          siteImage={siteImage}
        />
      )}
    </Box>
  );
}

TokenAllowance.propTypes = {
  /**
   * Dapp URL
   */
  origin: PropTypes.string,
  /**
   * Dapp image
   */
  siteImage: PropTypes.string,
  /**
   * Function that is supposed to open the customized gas modal
   */
  showCustomizeGasModal: PropTypes.func,
  /**
   * Whether nonce field should be used or not
   */
  useNonceField: PropTypes.bool,
  /**
   * Current fiat currency (e.g. USD)
   */
  currentCurrency: PropTypes.string,
  /**
   * Current native currency (e.g. RopstenETH)
   */
  nativeCurrency: PropTypes.string,
  /**
   * Total sum of the transaction in native currency
   */
  ethTransactionTotal: PropTypes.string,
  /**
   * Total sum of the transaction in fiat currency
   */
  fiatTransactionTotal: PropTypes.string,
  /**
   * Total sum of the transaction converted to hex value
   */
  hexTransactionTotal: PropTypes.string,
  /**
   * Current transaction
   */
  txData: PropTypes.object,
  /**
   * Is multi-layer fee network or not
   */
  isMultiLayerFeeNetwork: PropTypes.bool,
  /**
   * Is the enhanced gas fee enabled or not
   */
  supportsEIP1559V2: PropTypes.bool,
  /**
   * User's address
   */
  userAddress: PropTypes.string,
  /**
   * Address of the token that is waiting to be allowed
   */
  tokenAddress: PropTypes.string,
  /**
   * Current transaction data
   */
  data: PropTypes.string,
  /**
   * Is set approve for all or not
   */
  isSetApproveForAll: PropTypes.bool,
  /**
   * Whether a current set approval for all transaction will approve or revoke access
   */
  setApproveForAllArg: PropTypes.bool,
  /**
   * Custom transaction parameters data made by the user (fees)
   */
  customTxParamsData: PropTypes.object,
  /**
   * Token amount proposed by the Dapp
   */
  dappProposedTokenAmount: PropTypes.string,
  /**
   * Token balance of the current account
   */
  currentTokenBalance: PropTypes.string,
  /**
   * Contract address requesting spending cap
   */
  toAddress: PropTypes.string,
  /**
   * Symbol of the token that is waiting to be allowed
   */
  tokenSymbol: PropTypes.string,
};
