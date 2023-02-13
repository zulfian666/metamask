import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';
import classnames from 'classnames';

import AccountListItem from '../../components/app/account-list-item';
import Identicon from '../../components/ui/identicon';
import Tooltip from '../../components/ui/tooltip';
import Copy from '../../components/ui/icon/copy-icon.component';
import { PageContainerFooter } from '../../components/ui/page-container';

import { EVENT } from '../../../shared/constants/metametrics';
import { SECOND } from '../../../shared/constants/time';
import { Numeric } from '../../../shared/modules/Numeric';
import { EtherDenomination } from '../../../shared/constants/common';

export default class ConfirmDecryptMessage extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    trackEvent: PropTypes.func.isRequired,
  };

  static propTypes = {
    fromAccount: PropTypes.shape({
      address: PropTypes.string.isRequired,
      balance: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    clearConfirmTransaction: PropTypes.func.isRequired,
    cancelDecryptMessage: PropTypes.func.isRequired,
    decryptMessage: PropTypes.func.isRequired,
    decryptMessageInline: PropTypes.func.isRequired,
    conversionRate: PropTypes.number,
    history: PropTypes.object.isRequired,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    requesterAddress: PropTypes.string,
    txData: PropTypes.object,
    subjectMetadata: PropTypes.object,
    nativeCurrency: PropTypes.string.isRequired,
  };

  state = {
    fromAccount: this.props.fromAccount,
    copyToClipboardPressed: false,
    hasCopied: false,
  };

  copyMessage = () => {
    copyToClipboard(this.state.rawMessage);
    this.context.trackEvent({
      category: EVENT.CATEGORIES.MESSAGES,
      event: 'Copy',
      properties: {
        action: 'Plume Signature Copy',
        legacy_event: true,
      },
    });
    this.setState({ hasCopied: true });
    setTimeout(() => this.setState({ hasCopied: false }), SECOND * 3);
  };

  renderHeader = () => {
    return (
      <div className="request-plume-signature__header">
        <div className="request-plume-signature__header-background" />

        <div className="request-plume-signature__header__text">
          {this.context.t('decryptRequest')}
        </div>

        <div className="request-plume-signature__header__tip-container">
          <div className="request-plume-signature__header__tip" />
        </div>
      </div>
    );
  };

  renderAccount = () => {
    const { fromAccount } = this.state;
    const { t } = this.context;

    return (
      <div className="request-plume-signature__account">
        <div className="request-plume-signature__account-text">
          {`${t('account')}:`}
        </div>

        <div className="request-plume-signature__account-item">
          <AccountListItem account={fromAccount} />
        </div>
      </div>
    );
  };

  renderBalance = () => {
    const { conversionRate, nativeCurrency } = this.props;
    const {
      fromAccount: { balance },
    } = this.state;
    const { t } = this.context;

    const nativeCurrencyBalance = new Numeric(
      balance,
      16,
      EtherDenomination.WEI,
    )
      .applyConversionRate(conversionRate)
      .round(6)
      .toBase(10);

    return (
      <div className="request-plume-signature__balance">
        <div className="request-plume-signature__balance-text">
          {`${t('balance')}:`}
        </div>
        <div className="request-plume-signature__balance-value">
          {`${nativeCurrencyBalance} ${nativeCurrency}`}
        </div>
      </div>
    );
  };

  renderRequestIcon = () => {
    const { requesterAddress } = this.props;

    return (
      <div className="request-plume-signature__request-icon">
        <Identicon diameter={40} address={requesterAddress} />
      </div>
    );
  };

  renderAccountInfo = () => {
    return (
      <div className="request-plume-signature__account-info">
        {this.renderAccount()}
        {this.renderRequestIcon()}
        {this.renderBalance()}
      </div>
    );
  };

  renderBody = () => {
    const { decryptMessageInline, subjectMetadata, txData } = this.props;
    const { t } = this.context;

    const targetSubjectMetadata = subjectMetadata[txData.msgParams.origin];
    const name = targetSubjectMetadata?.name || txData.msgParams.origin;
    const notice = t('decryptMessageNotice', [txData.msgParams.origin]);

    const {
      hasCopied,
      hasDecrypted,
      hasError,
      rawMessage,
      errorMessage,
      copyToClipboardPressed,
    } = this.state;

    return (
      <div className="request-plume-signature__body">
        {this.renderAccountInfo()}
        <div className="request-plume-signature__visual">
          <section>
            {targetSubjectMetadata?.iconUrl ? (
              <img
                className="request-plume-signature__visual-identicon"
                src={targetSubjectMetadata.iconUrl}
                alt=""
              />
            ) : (
              <i className="request-plume-signature__visual-identicon--default">
                {name.charAt(0).toUpperCase()}
              </i>
            )}
            <div className="request-plume-signature__notice">{notice}</div>
          </section>
        </div>
        <div className="request-plume-signature__message">
          <div className="request-plume-signature__message-text">
            {!hasDecrypted && !hasError ? txData.msgParams.data : rawMessage}
            {hasError ? errorMessage : ''}
          </div>
          <div
            className={classnames('request-decrypt-message__message-cover', {
              'request-decrypt-message__message-lock--pressed':
                hasDecrypted || hasError,
            })}
          />
          <div
            className={classnames('request-decrypt-message__message-lock', {
              'request-decrypt-message__message-lock--pressed':
                hasDecrypted || hasError,
            })}
            onClick={(event) => {
              decryptMessageInline(txData, event).then((result) => {
                if (result.error) {
                  this.setState({
                    hasError: true,
                    errorMessage: this.context.t('decryptInlineError', [
                      result.error,
                    ]),
                  });
                } else {
                  this.setState({
                    hasDecrypted: true,
                    rawMessage: result.rawData,
                  });
                }
              });
            }}
          >
            <div className="request-plume-signature__message-lock__container">
              <i className="fa fa-lock fa-lg request-decrypt-message__message-lock__container__icon" />
              <div className="request-plume-signature__message-lock__container__text">
                {t('decryptMetamask')}
              </div>
            </div>
          </div>
        </div>
        {hasDecrypted ? (
          <div
            className={classnames({
              'request-decrypt-message__message-copy': true,
              'request-decrypt-message__message-copy--pressed':
                copyToClipboardPressed,
            })}
            onClick={() => this.copyMessage()}
            onMouseDown={() => this.setState({ copyToClipboardPressed: true })}
            onMouseUp={() => this.setState({ copyToClipboardPressed: false })}
          >
            <Tooltip
              position="bottom"
              title={hasCopied ? t('copiedExclamation') : t('copyToClipboard')}
              wrapperClassName="request-plume-signature__message-copy-tooltip"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div className="request-plume-signature__message-copy-text">
                {t('decryptCopy')}
              </div>
              <Copy size={17} color="var(--color-primary-default)" />
            </Tooltip>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  renderFooter = () => {
    const {
      cancelDecryptMessage,
      clearConfirmTransaction,
      decryptMessage,
      history,
      mostRecentOverviewPage,
      txData,
    } = this.props;
    const { trackEvent, t } = this.context;

    return (
      <PageContainerFooter
        cancelText={t('cancel')}
        submitText={t('decrypt')}
        onCancel={async (event) => {
          await cancelDecryptMessage(txData, event);
          trackEvent({
            category: EVENT.CATEGORIES.MESSAGES,
            event: 'Cancel',
            properties: {
              action: 'Decrypt Message Request',
              legacy_event: true,
            },
          });
          clearConfirmTransaction();
          history.push(mostRecentOverviewPage);
        }}
        onSubmit={async (event) => {
          await decryptMessage(txData, event);
          trackEvent({
            category: EVENT.CATEGORIES.MESSAGES,
            event: 'Confirm',
            properties: {
              action: 'Decrypt Message Request',
              legacy_event: true,
            },
          });
          clearConfirmTransaction();
          history.push(mostRecentOverviewPage);
        }}
      />
    );
  };

  render = () => {
    return (
      <div className="request-plume-signature__container">
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    );
  };
}
