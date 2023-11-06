import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import log from 'loglevel';
import { cloneDeep } from 'lodash';
import * as actions from '../../store/actions';
import txHelper from '../../helpers/utils/tx-helper';
import SignatureRequest from '../../components/app/signature-request';
import SignatureRequestSIWE from '../../components/app/signature-request-siwe';
import SignatureRequestOriginal from '../../components/app/signature-request-original';
import Loading from '../../components/ui/loading-screen';
import { useRouting } from '../../hooks/useRouting';
import {
  getTotalUnapprovedSignatureRequestCount,
  ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
  getSelectedAccount,
  ///: END:ONLY_INCLUDE_IN
} from '../../selectors';
import { MESSAGE_TYPE } from '../../../shared/constants/app';
import { TransactionStatus } from '../../../shared/constants/transaction';
import { getSendTo } from '../../ducks/send';
import { getProviderConfig } from '../../ducks/metamask/metamask';

const SIGN_MESSAGE_TYPE = {
  MESSAGE: 'message',
  PERSONAL: 'personal',
  TYPED: 'typed',
};

const signatureSelect = (txData) => {
  const {
    type,
    msgParams: { version, siwe },
  } = txData;

  // Temporarily direct only v3 and v4 requests to new code.
  if (
    type === MESSAGE_TYPE.ETH_SIGN_TYPED_DATA &&
    (version === 'V3' || version === 'V4')
  ) {
    return SignatureRequest;
  }

  if (siwe?.isSIWEMessage) {
    return SignatureRequestSIWE;
  }

  return SignatureRequestOriginal;
};

const stopPropagation = (event) => {
  if (event?.stopPropagation) {
    event.stopPropagation();
  }
};

const ConfirmTxScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { navigateToMostRecentOverviewPage } = useRouting();
  const unapprovedMessagesTotal = useSelector(
    getTotalUnapprovedSignatureRequestCount,
  );
  const sendTo = useSelector(getSendTo);
  const {
    unapprovedTxs,
    identities,
    currentNetworkTxList,
    currentCurrency,
    unapprovedMsgs,
    unapprovedPersonalMsgs,
    unapprovedTypedMessages,
    blockGasLimit,
  } = useSelector((state) => state.metamask);
  const { chainId } = useSelector(getProviderConfig);
  const { txId: index } = useSelector((state) => state.appState);

  ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
  const selectedAccount = useSelector(getSelectedAccount);
  ///: END:ONLY_INCLUDE_IN

  const [prevValue, setPrevValues] = useState();

  useEffect(() => {
    const unconfTxList = txHelper(
      unapprovedTxs || {},
      {},
      {},
      {},
      {},
      {},
      chainId,
    );
    if (unconfTxList.length === 0 && !sendTo && unapprovedMessagesTotal === 0) {
      navigateToMostRecentOverviewPage();
    }
<<<<<<< HEAD
  }, []);
=======
  }, [
    chainId,
    navigateToMostRecentOverviewPage,
    sendTo,
    unapprovedMessagesTotal,
    unapprovedTxs,
  ]);
>>>>>>> upstream/multichain-swaps-controller

  useEffect(() => {
    if (!prevValue) {
      setPrevValues({ index, unapprovedTxs });
      return;
    }

<<<<<<< HEAD
    let prevTx;
    const { params: { id: transactionId } = {} } = match;
    if (transactionId) {
      prevTx = currentNetworkTxList.find(({ id }) => `${id}` === transactionId);
    } else {
      const { index: prevIndex, unapprovedTxs: prevUnapprovedTxs } = prevValue;
      const prevUnconfTxList = txHelper(
        prevUnapprovedTxs,
=======
      let prevTx;
      const { params: { id: transactionId } = {} } = match;
      if (transactionId) {
        prevTx = currentNetworkTxList.find(
          ({ id }) => `${id}` === transactionId,
        );
      } else {
        const { index: prevIndex, unapprovedTxs: prevUnapprovedTxs } =
          prevValue;
        const prevUnconfTxList = txHelper(
          prevUnapprovedTxs,
          {},
          {},
          {},
          {},
          {},
          chainId,
        );
        const prevTxData = prevUnconfTxList[prevIndex] || {};
        prevTx =
          currentNetworkTxList.find(({ id }) => id === prevTxData.id) || {};
      }

      const unconfTxList = txHelper(
        unapprovedTxs || {},
>>>>>>> upstream/multichain-swaps-controller
        {},
        {},
        {},
        {},
        {},
        chainId,
      );
      const prevTxData = prevUnconfTxList[prevIndex] || {};
      prevTx =
        currentNetworkTxList.find(({ id }) => id === prevTxData.id) || {};
    }

    const unconfTxList = txHelper(
      unapprovedTxs || {},
      {},
      {},
      {},
      networkId,
      chainId,
    );

    if (prevTx && prevTx.status === TransactionStatus.dropped) {
      dispatch(
        actions.showModal({
          name: 'TRANSACTION_CONFIRMED',
          onSubmit: () => navigateToMostRecentOverviewPage(),
        }),
      );
      return;
    }

    if (unconfTxList.length === 0 && !sendTo && unapprovedMessagesTotal === 0) {
      navigateToMostRecentOverviewPage();
    }

    setPrevValues({ index, unapprovedTxs });
  }, [
    chainId,
    currentNetworkTxList,
    match,
    networkId,
    sendTo,
    unapprovedMessagesTotal,
    unapprovedTxs,
  ]);

  const getTxData = () => {
    const { params: { id: transactionId } = {} } = match;

    const unconfTxList = txHelper(
      unapprovedTxs || {},
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      {},
      {},
      unapprovedTypedMessages,
      chainId,
    );

    log.info(`rendering a combined ${unconfTxList.length} unconf msgs & txs`);

    const unconfirmedTx = transactionId
      ? unconfTxList.find(({ id }) => `${id}` === transactionId)
      : unconfTxList[index];
    return cloneDeep(unconfirmedTx);
<<<<<<< HEAD
  };
=======
  }, [
    chainId,
    index,
    match,
    unapprovedMsgs,
    unapprovedPersonalMsgs,
    unapprovedTxs,
    unapprovedTypedMessages,
  ]);
>>>>>>> upstream/multichain-swaps-controller

  const txData = getTxData() || {};

  const { msgParams } = txData;
  if (!msgParams) {
    return <Loading />;
  }

  const signMessage = (type) => (event) => {
    stopPropagation(event);
    const params = txData.msgParams;
    params.metamaskId = txData.id;
    let action;
    if (type === SIGN_MESSAGE_TYPE.MESSAGE) {
      action = actions.signMsg;
    } else if (type === SIGN_MESSAGE_TYPE.PERSONAL) {
      action = actions.signPersonalMsg;
    } else {
      action = actions.signTypedMsg;
    }
    return dispatch(action?.(params));
  };

  const cancelMessage = (type) => (event) => {
    stopPropagation(event);
    let action;
    if (type === SIGN_MESSAGE_TYPE.MESSAGE) {
      action = actions.cancelMsg;
    } else if (type === SIGN_MESSAGE_TYPE.PERSONAL) {
      action = actions.cancelPersonalMsg;
    } else {
      action = actions.cancelTypedMsg;
    }
    return dispatch(action(txData));
  };

  const getTextRecord = (ensName, recordName) => {
    return dispatch(actions.getTextRecord(ensName, recordName));
  };

  const SigComponent = signatureSelect(txData);

  return (
    <SigComponent
      txData={txData}
      key={txData.id}
      identities={identities}
      currentCurrency={currentCurrency}
      blockGasLimit={blockGasLimit}
      signMessage={signMessage(SIGN_MESSAGE_TYPE.MESSAGE)}
      signPersonalMessage={signMessage(SIGN_MESSAGE_TYPE.PERSONAL)}
      signTypedMessage={signMessage(SIGN_MESSAGE_TYPE.TYPED)}
      cancelMessage={cancelMessage(SIGN_MESSAGE_TYPE.MESSAGE)}
      cancelPersonalMessage={cancelMessage(SIGN_MESSAGE_TYPE.PERSONAL)}
      cancelTypedMessage={cancelMessage(SIGN_MESSAGE_TYPE.TYPED)}
      getTextRecord={getTextRecord}
      ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
      selectedAccount={selectedAccount}
      ///: END:ONLY_INCLUDE_IN
    />
  );
};

ConfirmTxScreen.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default withRouter(ConfirmTxScreen);
