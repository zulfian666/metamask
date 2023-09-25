import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component';
import Dialog from '../../../components/ui/dialog';
import {
  BannerAlert,
  ButtonLink,
  ButtonLinkSize,
} from '../../../components/component-library';
import { Severity } from '../../../helpers/constants/design-system';
import {
  ETH_GAS_PRICE_FETCH_WARNING_KEY,
  GAS_PRICE_FETCH_FAILURE_ERROR_KEY,
  GAS_PRICE_EXCESSIVE_ERROR_KEY,
} from '../../../helpers/constants/error-keys';
import { AssetType } from '../../../../shared/constants/transaction';
import { CONTRACT_ADDRESS_LINK } from '../../../helpers/constants/common';
import GasDisplay from '../gas-display';
import SendAmountRow from './send-amount-row';
import SendHexDataRow from './send-hex-data-row';
import SendAssetRow from './send-asset-row';
import SendGasRow from './send-gas-row';

export default class SendContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    showHexData: PropTypes.bool,
    warning: PropTypes.string,
    error: PropTypes.string,
    gasIsExcessive: PropTypes.bool.isRequired,
    isEthGasPrice: PropTypes.bool,
    noGasPrice: PropTypes.bool,
    networkOrAccountNotSupports1559: PropTypes.bool,
    asset: PropTypes.object,
    assetError: PropTypes.string,
    recipient: PropTypes.object,
    acknowledgeRecipientWarning: PropTypes.func,
    recipientWarningAcknowledged: PropTypes.bool,
    isMultiLayerFeeNetwork: PropTypes.bool,
  };

  render() {
    const {
      warning,
      error,
      gasIsExcessive,
      isEthGasPrice,
      noGasPrice,
      networkOrAccountNotSupports1559,
      asset,
      assetError,
      recipient,
      recipientWarningAcknowledged,
      isMultiLayerFeeNetwork,
    } = this.props;

    let gasError;
    if (gasIsExcessive) {
      gasError = GAS_PRICE_EXCESSIVE_ERROR_KEY;
    } else if (noGasPrice) {
      gasError = GAS_PRICE_FETCH_FAILURE_ERROR_KEY;
    }
    const showHexData =
      this.props.showHexData &&
      asset.type !== AssetType.token &&
      asset.type !== AssetType.NFT;

    const showKnownRecipientWarning =
      recipient.warning === 'knownAddressRecipient';

    return (
      <PageContainerContent>
        <div className="send-v2__form">
          {assetError ? this.renderError(assetError) : null}
          {isEthGasPrice
            ? this.renderWarning(ETH_GAS_PRICE_FETCH_WARNING_KEY)
            : null}
          {error ? this.renderError(error) : null}
          {warning ? this.renderWarning() : null}
          {showKnownRecipientWarning && !recipientWarningAcknowledged
            ? this.renderRecipientWarning()
            : null}
          <SendAssetRow />
          <SendAmountRow />
          {networkOrAccountNotSupports1559 ? <SendGasRow /> : null}
          {showHexData ? <SendHexDataRow /> : null}
          {!isMultiLayerFeeNetwork && <GasDisplay gasError={gasError} />}
        </div>
      </PageContainerContent>
    );
  }

  renderWarning(gasWarning = '') {
    const { t } = this.context;
    const { warning } = this.props;
    return (
      <Dialog type="warning" className="send__error-dialog">
        {gasWarning === '' ? t(warning) : t(gasWarning)}
      </Dialog>
    );
  }

  renderRecipientWarning() {
    const { acknowledgeRecipientWarning } = this.props;
    const { t } = this.context;
    return (
      <BannerAlert
        marginLeft={4}
        marginRight={4}
        data-testid="send-warning"
        severity={Severity.Danger}
        description={t('sendingToTokenContractWarning', [
          <ButtonLink
            key="contractWarningSupport"
            className="send__warning-container__link"
            href={CONTRACT_ADDRESS_LINK}
            externalLink
            size={ButtonLinkSize.Inherit}
          >
            {t('learnMoreUpperCase')}
          </ButtonLink>,
        ])}
        descriptionProps={{
          'data-testid': 'send-warning-description',
        }}
        actionButtonLabel={t('tooltipApproveButton')}
        actionButtonOnClick={acknowledgeRecipientWarning}
        actionButtonProps={{
          'data-testid': 'send-warning-action-button',
        }}
      />
    );
  }

  renderError(error) {
    const { t } = this.context;
    return (
      <Dialog type="error" className="send__error-dialog">
        {t(error)}
      </Dialog>
    );
  }
}
