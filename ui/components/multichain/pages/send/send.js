<<<<<<< HEAD
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  ButtonIcon,
  HeaderBase,
  IconName,
  PickerNetwork,
  Text,
} from '../../../component-library';
import {
  SEND_STAGES,
  getDraftTransactionExists,
  getRecipient,
  getSendStage,
} from '../../../../ducks/send';
import {
  getCurrentNetwork,
  getSelectedIdentity,
  getTestNetworkBackgroundColor,
} from '../../../../selectors';
import { toggleNetworkMenu } from '../../../../store/actions';
import { AccountPicker } from '../../account-picker';

export const Send = () => {
  const dispatch = useDispatch();

  // Layout
  const testNetworkBackgroundColor = useSelector(getTestNetworkBackgroundColor);
  const currentNetwork = useSelector(getCurrentNetwork);

  // Send wiring
  const draftTransactionExists = useSelector(getDraftTransactionExists);
  const sendStage = useSelector(getSendStage);

  // Account
  const selectedIdentity = useSelector(getSelectedIdentity);

  // Recipient
  const recipient = useSelector(getRecipient);

  return (
    <Box>
      <HeaderBase
        startAccessory={() => <ButtonIcon iconName={IconName.LeftArrow} />}
      >
        Send
      </HeaderBase>
      <Box>
        <PickerNetwork
          avatarNetworkProps={{
            backgroundColor: testNetworkBackgroundColor,
          }}
          margin={2}
          label={currentNetwork?.nickname}
          src={currentNetwork?.rpcPrefs?.imageUrl}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dispatch(toggleNetworkMenu());
          }}
        />
        {draftTransactionExists &&
        [SEND_STAGES.EDIT, SEND_STAGES.DRAFT].includes(sendStage)
          ? 'Edit Mode'
          : 'New Mode'}
      </Box>

      <Text>From</Text>
      <AccountPicker
        address={selectedIdentity.address}
        name={selectedIdentity.name}
        onClick={() => console.log('Choose Account!')}
        showAddress
      />
    </Box>
=======
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { I18nContext } from '../../../../contexts/i18n';
import {
  ButtonIcon,
  ButtonIconSize,
  ButtonPrimary,
  ButtonPrimarySize,
  ButtonSecondary,
  ButtonSecondarySize,
  IconName,
} from '../../../component-library';
import { Content, Footer, Header, Page } from '../page';
import {
  SEND_STAGES,
  getDraftTransactionExists,
  getDraftTransactionID,
  getSendStage,
  resetSendState,
  startNewDraftTransaction,
} from '../../../../ducks/send';
import { AssetType } from '../../../../../shared/constants/transaction';
import { cancelTx, showQrScanner } from '../../../../store/actions';
import { DEFAULT_ROUTE } from '../../../../helpers/constants/routes';
import { getMostRecentOverviewPage } from '../../../../ducks/history/history';
import {
  SendPageAccountPicker,
  SendPageRecipientInput,
  SendPageNetworkPicker,
  SendPageRecipient,
} from './components';

export const SendPage = () => {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();

  const startedNewDraftTransaction = useRef(false);
  const draftTransactionExists = useSelector(getDraftTransactionExists);
  const draftTransactionID = useSelector(getDraftTransactionID);
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const sendStage = useSelector(getSendStage);

  const history = useHistory();
  const location = useLocation();

  const cleanup = useCallback(() => {
    dispatch(resetSendState());
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

  const onCancel = useCallback(() => {
    if (draftTransactionID) {
      dispatch(cancelTx({ id: draftTransactionID }));
    }
    dispatch(resetSendState());

    const nextRoute =
      sendStage === SEND_STAGES.EDIT ? DEFAULT_ROUTE : mostRecentOverviewPage;
    history.push(nextRoute);
  });

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
        <SendPageNetworkPicker />
        <SendPageAccountPicker />
        <SendPageRecipientInput />
        <SendPageRecipient />
      </Content>
      <Footer>
        <ButtonSecondary onClick={onCancel} size={ButtonSecondarySize.Lg} block>
          {t('cancel')}
        </ButtonSecondary>
        <ButtonPrimary size={ButtonPrimarySize.Lg} block disabled>
          {t('confirm')}
        </ButtonPrimary>
      </Footer>
    </Page>
>>>>>>> upstream/multichain-swaps-controller
  );
};
