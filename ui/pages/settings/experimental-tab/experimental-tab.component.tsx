import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '../../../components/ui/toggle-button';
import {
  getNumberOfSettingRoutesInTab,
  handleSettingsRefs,
} from '../../../helpers/utils/settings-search';
///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
///: END:ONLY_INCLUDE_IF

import {
  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  Text,
  ///: END:ONLY_INCLUDE_IF
  Box,
} from '../../../components/component-library';

import {
  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  TextColor,
  TextVariant,
  ///: END:ONLY_INCLUDE_IF
  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  FontWeight,
  ///: END:ONLY_INCLUDE_IF
} from '../../../helpers/constants/design-system';

type ExperimentalTabProps = {
  bitcoinSupportEnabled: boolean;
  setBitcoinSupportEnabled: (value: boolean) => void;
  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  addSnapAccountEnabled: boolean;
  setAddSnapAccountEnabled: (value: boolean) => void;
  ///: END:ONLY_INCLUDE_IF
  useRequestQueue: boolean;
  setUseRequestQueue: (value: boolean) => void;
  petnamesEnabled: boolean;
  setPetnamesEnabled: (value: boolean) => void;
  featureNotificationsEnabled: boolean;
  setFeatureNotificationsEnabled: (value: boolean) => void;
  redesignedConfirmationsEnabled: boolean;
  setRedesignedConfirmationsEnabled: (value: boolean) => void;
};

export default class ExperimentalTab extends PureComponent<ExperimentalTabProps> {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  settingsRefs = Array(
    getNumberOfSettingRoutesInTab(
      this.context.t,
      this.context.t('experimental'),
    ),
  )
    .fill(undefined)
    .map(() => {
      return React.createRef<HTMLSpanElement>();
    });

  componentDidUpdate() {
    const { t } = this.context;
    handleSettingsRefs(t, t('experimental'), this.settingsRefs);
  }

  componentDidMount() {
    const { t } = this.context;
    handleSettingsRefs(t, t('experimental'), this.settingsRefs);
  }

  renderToggleSection({
    title,
    description,
    toggleValue,
    toggleCallback,
    toggleDataTestId,
    toggleContainerDataTestId,
    toggleOffLabel,
    toggleOnLabel,
  }: {
    title: string;
    description: string;
    toggleValue: boolean;
    toggleCallback: (value: boolean) => void;
    toggleContainerDataTestId?: string;
    toggleDataTestId: string;
    toggleOffLabel: string;
    toggleOnLabel: string;
  }) {
    return (
      <Box
        ref={this.settingsRefs[0]}
        className="settings-page__content-row settings-page__content-row-experimental"
      >
        <div className="settings-page__content-item">
          <span>{title}</span>
          <div className="settings-page__content-description">
            {description}
          </div>
        </div>

        <div
          className="settings-page__content-item-col"
          data-testid={toggleContainerDataTestId}
        >
          <ToggleButton
            value={toggleValue}
            onToggle={toggleCallback}
            offLabel={toggleOffLabel}
            onLabel={toggleOnLabel}
            dataTestId={toggleDataTestId}
          />
        </div>
      </Box>
    );
  }

  renderTogglePetnames() {
    const { t } = this.context;
    const { petnamesEnabled, setPetnamesEnabled } = this.props;

    return this.renderToggleSection({
      title: t('petnamesEnabledToggle'),
      description: t('petnamesEnabledToggleDescription'),
      toggleValue: petnamesEnabled,
      toggleCallback: (value) => setPetnamesEnabled(!value),
      toggleDataTestId: 'toggle-petnames',
      toggleOffLabel: t('off'),
      toggleOnLabel: t('on'),
    });
  }

  renderToggleRedesignedConfirmations() {
    const { t } = this.context;
    const {
      redesignedConfirmationsEnabled,
      setRedesignedConfirmationsEnabled,
    } = this.props;

    return this.renderToggleSection({
      title: t('redesignedConfirmationsEnabledToggle'),
      description: t('redesignedConfirmationsToggleDescription'),
      toggleValue: redesignedConfirmationsEnabled,
      toggleCallback: (value) => setRedesignedConfirmationsEnabled(!value),
      toggleDataTestId: 'toggle-redesigned-confirmations',
      toggleOffLabel: t('off'),
      toggleOnLabel: t('on'),
    });
  }

  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  renderKeyringSnapsToggle() {
    const { t, trackEvent } = this.context;
    const { addSnapAccountEnabled, setAddSnapAccountEnabled } = this.props;

    return (
      <>
        <Text
          variant={TextVariant.headingSm}
          as="h4"
          color={TextColor.textAlternative}
          marginBottom={2}
          fontWeight={FontWeight.Bold}
        >
          {t('snaps')}
        </Text>
        <div className="settings-page__content-item">
          <span>{t('snapAccounts')}</span>
          <div className="settings-page__content-description">
            <Text
              variant={TextVariant.bodySm}
              as="h6"
              color={TextColor.textAlternative}
            >
              {t('snapAccountsDescription')}
            </Text>
          </div>
        </div>
        {this.renderToggleSection({
          title: t('addSnapAccountToggle'),
          description: t('addSnapAccountsDescription'),
          toggleValue: addSnapAccountEnabled,
          toggleCallback: (value) => {
            trackEvent({
              event: MetaMetricsEventName.AddSnapAccountEnabled,
              category: MetaMetricsEventCategory.Settings,
              properties: {
                enabled: !value,
              },
            });
            setAddSnapAccountEnabled(!value);
          },
          toggleContainerDataTestId: 'add-account-snap-toggle-div',
          toggleDataTestId: 'add-account-snap-toggle-button',
          toggleOffLabel: t('off'),
          toggleOnLabel: t('on'),
        })}
      </>
    );
  }
  ///: END:ONLY_INCLUDE_IF

  renderToggleRequestQueue() {
    const { t } = this.context;
    const { useRequestQueue, setUseRequestQueue } = this.props;
    return this.renderToggleSection({
      title: t('toggleRequestQueueField'),
      description: t('toggleRequestQueueDescription'),
      toggleValue: useRequestQueue || false,
      toggleCallback: (value) => setUseRequestQueue(!value),
      toggleContainerDataTestId: 'experimental-setting-toggle-request-queue',
      toggleDataTestId: 'experimental-setting-toggle-request-queue',
      toggleOffLabel: t('toggleRequestQueueOff'),
      toggleOnLabel: t('toggleRequestQueueOn'),
    });
  }

  renderNotificationsToggle() {
    const { t } = this.context;
    const { featureNotificationsEnabled, setFeatureNotificationsEnabled } =
      this.props;

    return this.renderToggleSection({
      title: t('notificationsFeatureToggle'),
      description: t('notificationsFeatureToggleDescription'),
      toggleValue: featureNotificationsEnabled,
      toggleCallback: (value) => setFeatureNotificationsEnabled(!value),
      toggleDataTestId: 'toggle-notifications',
      toggleOffLabel: t('off'),
      toggleOnLabel: t('on'),
    });
  }

  ///: BEGIN:ONLY_INCLUDE_IF(build-flask)
  // We're only setting the code fences here since
  // we should remove it for the feature release
  renderBitcoinSupport() {
    const { t, trackEvent } = this.context;
    const { bitcoinSupportEnabled, setBitcoinSupportEnabled } = this.props;

    return (
      <>
        <Text
          variant={TextVariant.headingSm}
          as="h4"
          color={TextColor.textAlternative}
          marginBottom={2}
          fontWeight={FontWeight.Bold}
        >
          {t('bitcoinSupportSectionTitle')}
        </Text>
        {this.renderToggleSection({
          title: t('bitcoinSupportToggleTitle'),
          description: t('bitcoinSupportToggleDescription'),
          toggleValue: bitcoinSupportEnabled,
          toggleCallback: (value) => {
            trackEvent({
              event: MetaMetricsEventName.BitcoinSupportToggled,
              category: MetaMetricsEventCategory.Settings,
              properties: {
                enabled: !value,
              },
            });
            setBitcoinSupportEnabled(!value);
          },
          toggleDataTestId: 'bitcoin-support-toggle',
          toggleOffLabel: t('off'),
          toggleOnLabel: t('on'),
        })}
      </>
    );
  }
  ///: END:ONLY_INCLUDE_IF

  render() {
    return (
      <div className="settings-page__body">
        {this.renderTogglePetnames()}
        {this.renderToggleRedesignedConfirmations()}
        {process.env.NOTIFICATIONS ? this.renderNotificationsToggle() : null}
        {this.renderToggleRequestQueue()}
        {/* Section: Account Management Snaps */}
        {
          ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
          this.renderKeyringSnapsToggle()
          ///: END:ONLY_INCLUDE_IF
        }
        {
          ///: BEGIN:ONLY_INCLUDE_IF(build-flask)
          // We're only setting the code fences here since
          // we should remove it for the feature release

          /* Section: Bitcoin Accounts */
          this.renderBitcoinSupport()
          ///: END:ONLY_INCLUDE_IF
        }
      </div>
    );
  }
}
