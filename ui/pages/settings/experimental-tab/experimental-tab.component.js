import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '../../../components/ui/toggle-button';
import {
  getNumberOfSettingsInSection,
  handleSettingsRefs,
} from '../../../helpers/utils/settings-search';
import { EVENT } from '../../../../shared/constants/metametrics';
import Typography from '../../../components/ui/typography/typography';
import {
  COLORS,
  TYPOGRAPHY,
  FONT_WEIGHT,
} from '../../../helpers/constants/design-system';

export default class ExperimentalTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  static propTypes = {
    useNftDetection: PropTypes.bool,
    setUseNftDetection: PropTypes.func,
    setOpenSeaEnabled: PropTypes.func,
    openSeaEnabled: PropTypes.bool,
    improvedTokenAllowanceEnabled: PropTypes.bool,
    setImprovedTokenAllowanceEnabled: PropTypes.func,
    transactionSecurityCheckEnabled: PropTypes.bool,
    setTransactionSecurityCheckEnabled: PropTypes.func,
  };

  settingsRefs = Array(
    getNumberOfSettingsInSection(
      this.context.t,
      this.context.t('experimental'),
    ),
  )
    .fill(undefined)
    .map(() => {
      return React.createRef();
    });

  componentDidUpdate() {
    const { t } = this.context;
    handleSettingsRefs(t, t('experimental'), this.settingsRefs);
  }

  componentDidMount() {
    const { t } = this.context;
    handleSettingsRefs(t, t('experimental'), this.settingsRefs);
  }

  renderOpenSeaEnabledToggle() {
    if (!process.env.NFTS_V1) {
      return null;
    }
    const { t } = this.context;
    const {
      openSeaEnabled,
      setOpenSeaEnabled,
      useNftDetection,
      setUseNftDetection,
    } = this.props;

    return (
      <div
        ref={this.settingsRefs[1]}
        className="settings-page__content-row--parent"
      >
        <div className="settings-page__content-item">
          <span>{t('enableOpenSeaAPI')}</span>
          <div className="settings-page__content-description">
            {t('enableOpenSeaAPIDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={openSeaEnabled}
              onToggle={(value) => {
                this.context.trackEvent({
                  category: EVENT.CATEGORIES.SETTINGS,
                  event: 'Enabled/Disable OpenSea',
                  properties: {
                    action: 'Enabled/Disable OpenSea',
                    legacy_event: true,
                  },
                });
                // value is positive when being toggled off
                if (value && useNftDetection) {
                  setUseNftDetection(false);
                }
                setOpenSeaEnabled(!value);
              }}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderImprovedTokenAllowanceToggle() {
    const { t } = this.context;
    const { improvedTokenAllowanceEnabled, setImprovedTokenAllowanceEnabled } =
      this.props;

    return (
      <div ref={this.settingsRefs[2]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>{t('improvedTokenAllowance')}</span>
          <div className="settings-page__content-description">
            {t('improvedTokenAllowanceDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={improvedTokenAllowanceEnabled}
              onToggle={(value) => {
                this.context.trackEvent({
                  category: EVENT.CATEGORIES.SETTINGS,
                  event: 'Enabled/Disable ImprovedTokenAllowance',
                  properties: {
                    action: 'Enabled/Disable ImprovedTokenAllowance',
                    legacy_event: true,
                  },
                });
                setImprovedTokenAllowanceEnabled(!value);
              }}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderTransactionSecurityCheckToggle() {
    const { t } = this.context;

    const {
      transactionSecurityCheckEnabled,
      setTransactionSecurityCheckEnabled,
    } = this.props;

    return (
      <div ref={this.settingsRefs[1]} className="settings-page__content-row">
        <div className="settings-page__content-item">
          <span>
            <Typography variant={TYPOGRAPHY.H4} fontWeight={FONT_WEIGHT.BOLD}>
              {t('transactionSecurityCheck')}
            </Typography>
          </span>
          <div className="settings-page__content-description">
            <Typography variant={TYPOGRAPHY.H6} color={COLORS.TEXT_ALTERNATIVE}>
              {t('transactionSecurityCheckDescription', [
                <a key="transaction_security_provider_link">
                  {t('learnMoreUpperCase')}
                </a>,
              ])}
            </Typography>
            <Typography
              marginTop={2}
              marginBottom={1}
              variant={TYPOGRAPHY.H6}
              color={COLORS.TEXT_ALTERNATIVE}
            >
              {t('selectProvider')}
            </Typography>
            <div className="settings-page__content-item-col settings-page__content-item-col-open-sea">
              <Typography
                variant={TYPOGRAPHY.H5}
                color={COLORS.TEXT_DEFAULT}
                fontWeight="500"
              >
                {t('openSea')}
              </Typography>
              <ToggleButton
                value={transactionSecurityCheckEnabled}
                onToggle={(value) => {
                  this.context.trackEvent({
                    category: EVENT.CATEGORIES.SETTINGS,
                    event: 'Enabled/Disable TransactionSecurityCheck',
                    properties: {
                      action: 'Enabled/Disable TransactionSecurityCheck',
                      legacy_event: true,
                    },
                  });
                  setTransactionSecurityCheckEnabled(!value);
                }}
              />
            </div>
            <Typography variant={TYPOGRAPHY.H6} color={COLORS.TEXT_MUTED}>
              {t('moreComingSoon')}
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="settings-page__body">
        {process.env.TRANSACTION_SECURITY_PROVIDER &&
          this.renderTransactionSecurityCheckToggle()}
        {this.renderImprovedTokenAllowanceToggle()}
        {this.renderOpenSeaEnabledToggle()}
      </div>
    );
  }
}
