<<<<<<< HEAD
import React, { useCallback, useContext, useEffect, useState } from 'react';
=======
import React, {
  useCallback,
  useContext,
  ///: BEGIN:ONLY_INCLUDE_IN(blockaid)
  useEffect,
  ///: END:ONLY_INCLUDE_IN
  useState,
} from 'react';
>>>>>>> upstream/multichain-swaps-controller
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import log from 'loglevel';
import { parseDomainParts } from '@metamask/controller-utils';
import { BannerAlert, Text } from '../../component-library';
import Popover from '../../ui/popover';
import Checkbox from '../../ui/check-box';
import Button from '../../ui/button';
import { I18nContext } from '../../../contexts/i18n';
import { PageContainerFooter } from '../../ui/page-container';
import { isAddressLedger } from '../../../ducks/metamask/metamask';
import {
  accountsWithSendEtherInfoSelector,
  getSubjectMetadata,
  getTotalUnapprovedMessagesCount,
  unconfirmedMessagesHashSelector,
} from '../../../selectors';
import { getAccountByAddress, valuesFor } from '../../../helpers/utils/util';
import { formatMessageParams } from '../../../../shared/modules/siwe';
import { clearConfirmTransaction } from '../../../ducks/confirm-transaction/confirm-transaction.duck';

import {
  SEVERITIES,
  TextVariant,
} from '../../../helpers/constants/design-system';

import SecurityProviderBannerMessage from '../security-provider-banner-message/security-provider-banner-message';
import { SECURITY_PROVIDER_MESSAGE_SEVERITIES } from '../security-provider-banner-message/security-provider-banner-message.constants';
import ConfirmPageContainerNavigation from '../confirm-page-container/confirm-page-container-navigation';
import { getMostRecentOverviewPage } from '../../../ducks/history/history';
<<<<<<< HEAD
import { showModal, cancelMsgs } from '../../../store/actions';
=======
///: BEGIN:ONLY_INCLUDE_IN(blockaid)
import BlockaidBannerAlert from '../security-provider-banner-alert/blockaid-banner-alert/blockaid-banner-alert';
import { getBlockaidMetricsParams } from '../../../helpers/utils/metrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
///: END:ONLY_INCLUDE_IN
>>>>>>> upstream/multichain-swaps-controller
import LedgerInstructionField from '../ledger-instruction-field';

import SignatureRequestHeader from '../signature-request-header';
import Header from './signature-request-siwe-header';
import Message from './signature-request-siwe-message';

export const isValidSIWEOrigin = (req, signableDomains) => {
  try {
    const { origin, siwe } = req;

    // origin = scheme://[user[:password]@]domain[:port]
    // origin is supplied by environment and must match domain claim in message
    if (!origin || !siwe?.parsedMessage?.domain) {
      return false;
    }

    const originParts = new URL(origin);
    const domainParts = parseDomainParts(
      siwe.parsedMessage.domain,
      originParts.protocol,
    );

    console.log("isValidSIWEOrigin", originParts, domainParts)

    const substitutes = {
      ".eth.limo$": ".eth",
      ".eth.link$": ".eth",
      ".": "."
    }


    const isValidHostname = Object.entries(substitutes).some(([pattern, substitute]) => {
      const originHostName = originParts.hostname.replace(new RegExp(pattern), substitute)
      const domainHostNames = [...signableDomains, domainParts.hostname]
      return domainHostNames.some(domainHostName => {
        console.log("compare", domainHostName, originHostName)
        return domainHostName.localeCompare(originHostName, undefined, {
          sensitivity: 'accent',
        }) === 0
      })
    })

    if (!isValidHostname) {
      return false;
    }

    if (domainParts.port !== '' && domainParts.port !== originParts.port) {
      // If origin port is not specified, protocol default is implied
      return (
        originParts.port === '' &&
        domainParts.port === DEFAULT_PORTS_BY_PROTOCOL[originParts.protocol]
      );
    }

    if (
      domainParts.username !== '' &&
      domainParts.username !== originParts.username
    ) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default function SignatureRequestSIWE({
  txData,
  cancelPersonalMessage,
  signPersonalMessage,
  getTextRecord,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const t = useContext(I18nContext);

  const allAccounts = useSelector(accountsWithSendEtherInfoSelector);
  const subjectMetadata = useSelector(getSubjectMetadata);

  const messagesCount = useSelector(getTotalUnapprovedMessagesCount);
  const messagesList = useSelector(unconfirmedMessagesHashSelector);
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  ///: BEGIN:ONLY_INCLUDE_IN(blockaid)
  const trackEvent = useContext(MetaMetricsContext);
  ///: END:ONLY_INCLUDE_IN

  ///: BEGIN:ONLY_INCLUDE_IN(blockaid)
  useEffect(() => {
    if (txData.securityAlertResponse) {
      const blockaidMetricsParams = getBlockaidMetricsParams(
        txData.securityAlertResponse,
      );

      trackEvent({
        category: MetaMetricsEventCategory.Transactions,
        event: MetaMetricsEventName.SignatureRequested,
        properties: {
          action: 'Sign Request',
          ...blockaidMetricsParams,
        },
      });
    }
  }, [txData?.securityAlertResponse]);
  ///: END:ONLY_INCLUDE_IN

  const {
    msgParams: {
      from,
      origin,
      siwe: { parsedMessage },
    },
  } = txData;


  const isLedgerWallet = useSelector((state) => isAddressLedger(state, from));

  const fromAccount = getAccountByAddress(allAccounts, from);
  const targetSubjectMetadata = subjectMetadata[origin];

  const isMatchingAddress =
    from.toLowerCase() === parsedMessage.address.toLowerCase();



  const [isShowingDomainWarning, setIsShowingDomainWarning] = useState(false);
  const [hasAgreedToDomainWarning, setHasAgreedToDomainWarning] =
    useState(false);
  const [signableDomains, setSignableDomains] = useState([]);

  const isSIWEDomainValid = isValidSIWEOrigin({...txData.msgParams
    // , origin: "http://jiexi.eth.limo/"
  }, signableDomains);

  const showSecurityProviderBanner =
    (txData?.securityProviderResponse?.flagAsDangerous !== undefined &&
      txData?.securityProviderResponse?.flagAsDangerous !==
        SECURITY_PROVIDER_MESSAGE_SEVERITIES.NOT_MALICIOUS) ||
    (txData?.securityProviderResponse &&
      Object.keys(txData.securityProviderResponse).length === 0);

  useEffect(() => {
    const effect = async () => {
      try {
        const textRecord = await getTextRecord(parsedMessage.domain, "signableDomains")
        console.log("got text record", textRecord)
        setSignableDomains(textRecord.split(","))
      } catch (e) {
        console.log("got error fetching text record", textRecord, e)
        setSignableDomains([])
      }
    }
    effect()
  }, [parsedMessage.domain, setSignableDomains])

  const onSign = useCallback(
    async (event) => {
      try {
        await signPersonalMessage(event);
      } catch (e) {
        log.error(e);
      }
    },
    [signPersonalMessage],
  );

  const onCancel = useCallback(
    async (event) => {
      try {
        await cancelPersonalMessage(event);
      } catch (e) {
        log.error(e);
      }
    },
    [cancelPersonalMessage],
  );

  const handleCancelAll = () => {
    const unapprovedTxCount = messagesCount;

    dispatch(
      showModal({
        name: 'REJECT_TRANSACTIONS',
        unapprovedTxCount,
        onSubmit: async () => {
          await dispatch(cancelMsgs(valuesFor(messagesList)));
          dispatch(clearConfirmTransaction());
          history.push(mostRecentOverviewPage);
        },
      }),
    );
  };

  const rejectNText = t('rejectRequestsN', [messagesCount]);

  return (
    <div className="signature-request-siwe">
      <div className="request-signature__navigation">
        <ConfirmPageContainerNavigation />
      </div>
      <SignatureRequestHeader txData={txData} />
      <Header
        fromAccount={fromAccount}
        domain={origin}
        isSIWEDomainValid={isSIWEDomainValid}
        subjectMetadata={targetSubjectMetadata}
      />

      {showSecurityProviderBanner && (
        <SecurityProviderBannerMessage
          securityProviderResponse={txData.securityProviderResponse}
        />
      )}

      <Message data={formatMessageParams(parsedMessage, t)} />
      {!isMatchingAddress && (
        <BannerAlert
          severity={SEVERITIES.WARNING}
          marginLeft={4}
          marginRight={4}
          marginBottom={4}
        >
          {t('SIWEAddressInvalid', [
            parsedMessage.address,
            fromAccount.address,
          ])}
        </BannerAlert>
      )}

      {isLedgerWallet && (
        <div className="confirm-approve-content__ledger-instruction-wrapper">
          <LedgerInstructionField showDataInstruction />
        </div>
      )}

      {!isSIWEDomainValid && (
        <BannerAlert
          severity={SEVERITIES.DANGER}
          marginLeft={4}
          marginRight={4}
          marginBottom={4}
        >
          <Text variant={TextVariant.bodyMdBold}>
            {t('SIWEDomainInvalidTitle')}
          </Text>{' '}
          <Text>{t('SIWEDomainInvalidText')}</Text>
        </BannerAlert>
      )}
      <PageContainerFooter
        footerClassName="signature-request-siwe__page-container-footer"
        onCancel={onCancel}
        onSubmit={
          isSIWEDomainValid ? onSign : () => setIsShowingDomainWarning(true)
        }
        cancelText={t('cancel')}
        submitText={t('signin')}
        submitButtonType={isSIWEDomainValid ? 'primary' : 'danger-primary'}
      />
      {messagesCount > 1 ? (
        <Button
          type="link"
          className="request-signature__container__reject"
          onClick={(e) => {
            e.preventDefault();
            handleCancelAll();
          }}
        >
          {rejectNText}
        </Button>
      ) : null}
      {isShowingDomainWarning && (
        <Popover
          onClose={() => setIsShowingDomainWarning(false)}
          title={t('SIWEWarningTitle')}
          subtitle={t('SIWEWarningSubtitle')}
          className="signature-request-siwe__warning-popover"
          footerClassName="signature-request-siwe__warning-popover__footer"
          footer={
            <PageContainerFooter
              footerClassName="signature-request-siwe__warning-popover__footer__warning-footer"
              onCancel={() => setIsShowingDomainWarning(false)}
              cancelText={t('cancel')}
              cancelButtonType="default"
              onSubmit={onSign}
              submitText={t('confirm')}
              submitButtonType="danger-primary"
              disabled={!hasAgreedToDomainWarning}
            />
          }
        >
          <div className="signature-request-siwe__warning-popover__checkbox-wrapper">
            <Checkbox
              id="signature-request-siwe_domain-checkbox"
              checked={hasAgreedToDomainWarning}
              className="signature-request-siwe__warning-popover__checkbox-wrapper__checkbox"
              onClick={() => setHasAgreedToDomainWarning((checked) => !checked)}
            />
            <label
              className="signature-request-siwe__warning-popover__checkbox-wrapper__label"
              htmlFor="signature-request-siwe_domain-checkbox"
            >
              {t('SIWEDomainWarningBody', [parsedMessage.domain])}
            </label>
          </div>
        </Popover>
      )}
    </div>
  );
}

SignatureRequestSIWE.propTypes = {
  /**
   * The display content of transaction data
   */
  txData: PropTypes.object.isRequired,
  /**
   * Handler for cancel button
   */
  cancelPersonalMessage: PropTypes.func.isRequired,
  /**
   * Handler for sign button
   */
  signPersonalMessage: PropTypes.func.isRequired,
  /**
   * TODO
   */
  getTextRecord: PropTypes.func.isRequired,
};
