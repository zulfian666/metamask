import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { I18nContext } from '../../../../contexts/i18n';
import {
  ButtonIcon,
  ButtonIconSize,
  ButtonPrimary,
  ButtonPrimarySize,
  ButtonSecondary,
  ButtonSecondarySize,
  IconName,
  Box,
} from '../../../component-library';
import { Content, Footer, Header, Page } from '../page';
import {
  SEND_STAGES,
  getCurrentDraftTransaction,
  getDraftTransactionExists,
  getDraftTransactionID,
  getRecipient,
  getRecipientWarningAcknowledgement,
  getSendErrors,
  getSendStage,
  isSendFormInvalid,
  resetSendState,
  signTransaction,
  startNewDraftTransaction,
  updateSendAmount,
  updateSendAsset,
} from '../../../../ducks/send';
import {
  TokenStandard,
  AssetType,
} from '../../../../../shared/constants/transaction';
import { MetaMetricsContext } from '../../../../contexts/metametrics';
import { INSUFFICIENT_FUNDS_ERROR } from '../../../../pages/confirmations/send/send.constants';
import { cancelTx, showQrScanner } from '../../../../store/actions';
import {
  DEFAULT_ROUTE,
  SEND_ROUTE,
} from '../../../../helpers/constants/routes';
import { MetaMetricsEventCategory } from '../../../../../shared/constants/metametrics';
import { getMostRecentOverviewPage } from '../../../../ducks/history/history';
import { AssetPickerAmount } from '../..';
import useUpdateSwapsState from '../../../../hooks/useUpdateSwapsState';
import {
  SendPageAccountPicker,
  SendPageRecipientContent,
  SendPageRecipient,
  SendPageRecipientInput,
} from './components';

export const SendPage = () => {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();

  const startedNewDraftTransaction = useRef(false);
  const draftTransactionExists = useSelector(getDraftTransactionExists);

  const {
    sendAsset: transactionAsset,
    amount,
    receiveAsset,
  } = useSelector(getCurrentDraftTransaction);
  const draftTransactionID = useSelector(getDraftTransactionID);
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const sendStage = useSelector(getSendStage);

  const history = useHistory();
  const location = useLocation();
  const trackEvent = useContext(MetaMetricsContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectToken = useCallback(
    (token, isReceived) => {
      const tokenType = token.type.toUpperCase();
      switch (tokenType) {
        case TokenStandard.ERC20:
        case 'TOKEN':
          token.type = AssetType.token;
          token.standard = TokenStandard.ERC20;
          break;
        case TokenStandard.ERC721:
          token.type = AssetType.NFT;
          token.standard = TokenStandard.ERC721;
          token.isERC721 = true;
          break;
        case TokenStandard.ERC1155:
          token.type = AssetType.NFT;
          token.standard = TokenStandard.ERC1155;
          break;
        default:
          if (tokenType === 'NATIVE') {
            break;
          }
          token.type = AssetType.unknown;
          token.standard = TokenStandard.none;
          break;
      }

      token.image = token.image ?? token.iconUrl;

      if (token.type === AssetType.native) {
        dispatch(
          updateSendAsset({
            type: token.type,
            details: token,
            skipComputeEstimatedGasLimit: false,
            isReceived,
          }),
        );
      } else {
        dispatch(
          updateSendAsset({
            type: token.type ?? AssetType.token,
            details: {
              ...token,
              standard: token.standard ?? TokenStandard.ERC20,
            },
            skipComputeEstimatedGasLimit: false,
            isReceived,
          }),
        );
      }
      history.push(SEND_ROUTE);
    },
    [dispatch, history],
  );

  const cleanup = useCallback(() => {
    dispatch(resetSendState());
    setIsSubmitting(false);
  }, [dispatch]);

  /**
   * It is possible to route to this page directly, either by typing in the url
   * or by clicking the browser back button after progressing to the confirm
   * screen. In the case where a draft transaction does not yet exist, this
   * hook is responsible for creating it. We will assume that this is a native
   * asset send.
   */
  useEffect(() => {
    if (
      draftTransactionExists === false &&
      startedNewDraftTransaction.current === false
    ) {
      startedNewDraftTransaction.current = true;
      dispatch(startNewDraftTransaction({ type: AssetType.native }));
    }
  }, [draftTransactionExists, dispatch]);

  useEffect(() => {
    window.addEventListener('beforeunload', cleanup);
  }, [cleanup]);

  useEffect(() => {
    if (location.search === '?scan=true') {
      dispatch(showQrScanner());

      // Clear the queryString param after showing the modal
      const [cleanUrl] = window.location.href.split('?');
      window.history.pushState({}, null, `${cleanUrl}`);
      window.location.hash = '#send';
    }
  }, [location, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetSendState());
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [dispatch, cleanup]);

  const onCancel = () => {
    if (draftTransactionID) {
      dispatch(cancelTx({ id: draftTransactionID }));
    }
    dispatch(resetSendState());

    const nextRoute =
      sendStage === SEND_STAGES.EDIT ? DEFAULT_ROUTE : mostRecentOverviewPage;
    history.push(nextRoute);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    await dispatch(signTransaction(history));
    // prevents state update on unmounted component error
    if (isSubmitting) {
      setIsSubmitting(false);
    }
    trackEvent({
      category: MetaMetricsEventCategory.Transactions,
      event: 'Complete',
      properties: {
        action: 'Edit Screen',
        legacy_event: true,
      },
    });
  };

  // Submit button
  const recipient = useSelector(getRecipient);
  const showKnownRecipientWarning =
    recipient.warning === 'knownAddressRecipient';
  const recipientWarningAcknowledged = useSelector(
    getRecipientWarningAcknowledgement,
  );
  const requireContractAddressAcknowledgement =
    showKnownRecipientWarning && !recipientWarningAcknowledged;

  const sendErrors = useSelector(getSendErrors);
  const isInvalidSendForm = useSelector(isSendFormInvalid);

  const isGasTooLow =
    sendErrors.gasFee === INSUFFICIENT_FUNDS_ERROR &&
    sendErrors.amount !== INSUFFICIENT_FUNDS_ERROR;

  const submitDisabled =
    (isInvalidSendForm && !isGasTooLow) ||
    requireContractAddressAcknowledgement;

  const isSendFormShown =
    draftTransactionExists &&
    [SEND_STAGES.EDIT, SEND_STAGES.DRAFT].includes(sendStage);

  const handleSelectSendToken = useCallback(
    (newToken) => handleSelectToken(newToken, false),
    [handleSelectToken],
  );

  useUpdateSwapsState();

  const onAmountChange = useCallback(
    (newAmountRaw, newAmountFormatted) =>
      dispatch(updateSendAmount(newAmountRaw, newAmountFormatted)),
    [dispatch],
  );

  const isSwapAndSend =
    transactionAsset?.details?.address !== receiveAsset?.details?.address;

  return (
    <Page className="multichain-send-page">
      <Header
        startAccessory={
          <ButtonIcon
            size={ButtonIconSize.Sm}
            ariaLabel={t('back')}
            iconName={IconName.ArrowLeft}
            onClick={onCancel}
          />
        }
      >
        {t('sendAToken')}
      </Header>
      <Content>
        <SendPageAccountPicker />
        {isSendFormShown && (
          <AssetPickerAmount
            asset={transactionAsset}
            amount={amount}
            onAssetChange={handleSelectSendToken}
            onAmountChange={onAmountChange}
          />
        )}
        <Box marginTop={6}>
          <SendPageRecipientInput />
          {isSendFormShown ? (
            <SendPageRecipientContent
              requireContractAddressAcknowledgement={
                requireContractAddressAcknowledgement
              }
              onAssetChange={handleSelectToken}
            />
          ) : (
            <SendPageRecipient />
          )}
        </Box>
      </Content>
      <Footer>
        <ButtonSecondary
          className="multichain-send-page__nav-button"
          onClick={onCancel}
          size={ButtonSecondarySize.Lg}
          block
        >
          {sendStage === SEND_STAGES.EDIT ? t('reject') : t('cancel')}
        </ButtonSecondary>
        <Tooltip
          className="multichain-send-page__nav-button"
          title={t('sendSwapSubmissionWarning')}
          disabled={!isSwapAndSend}
          arrow
          hideOnClick={false}
          // explicitly inherit display since Tooltip will default to block
          style={{
            display: 'inline-flex',
          }}
        >
          <ButtonPrimary
            onClick={onSubmit}
            loading={isSubmitting}
            size={ButtonPrimarySize.Lg}
            disabled={submitDisabled || isSubmitting}
            block
          >
            {t(isSwapAndSend ? 'confirm' : 'continue')}
          </ButtonPrimary>
        </Tooltip>
      </Footer>
    </Page>
  );
};
