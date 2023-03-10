import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { goHome, plumeMsg, cancelPlumeSignature } from '../../store/actions';
import {
  getTargetAccountWithSendEtherInfo,
  unconfirmedTransactionsListSelector,
  conversionRateSelector,
} from '../../selectors';
import { clearConfirmTransaction } from '../../ducks/confirm-transaction/confirm-transaction.duck';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import { getNativeCurrency } from '../../ducks/metamask/metamask';
import ConfirmPlumeSignature from './confirm-plume-signature.component';

function mapStateToProps(state) {
  const {
    metamask: { subjectMetadata = {} },
  } = state;

  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state);

  const txData = unconfirmedTransactions[0];

  const {
    msgParams: { from },
  } = txData;

  const fromAccount = getTargetAccountWithSendEtherInfo(state, from);

  return {
    txData,
    subjectMetadata,
    fromAccount,
    requester: null,
    requesterAddress: null,
    conversionRate: conversionRateSelector(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    nativeCurrency: getNativeCurrency(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goHome: () => dispatch(goHome()),
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    plumeSignature: (msgData, event) => {
      const params = msgData.msgParams;
      params.metamaskId = msgData.id;
      event.stopPropagation(event);
      return dispatch(plumeMsg(params));
    },
    cancelPlumeSignature: (msgData, event) => {
      event.stopPropagation(event);
      return dispatch(cancelPlumeSignature(msgData));
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmPlumeSignature);
