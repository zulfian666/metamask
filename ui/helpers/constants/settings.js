import {
  ALERTS_ROUTE,
  ADVANCED_ROUTE,
  SECURITY_ROUTE,
  GENERAL_ROUTE,
  ABOUT_US_ROUTE,
  NETWORKS_ROUTE,
  CONTACT_LIST_ROUTE,
  EXPERIMENTAL_ROUTE,
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  SNAPS_LIST_ROUTE,
  ///: END:ONLY_INCLUDE_IN
} from './routes';

export const SETTINGS_CONSTANTS = [
  {
    tabKey: 'general',
    sectionKey: 'currencyConversion',
    descriptionKey: '',
    route: `${GENERAL_ROUTE}#currency-conversion`,
    icon: 'fa fa-cog',
  },
  {
    tabKey: 'general',
    sectionKey: 'primaryCurrencySetting',
    descriptionKey: 'primaryCurrencySettingDescription',
    route: `${GENERAL_ROUTE}#primary-currency`,
    icon: 'fa fa-cog',
  },
  {
    tabKey: 'general',
    sectionKey: 'currentLanguage',
    descriptionKey: '',
    route: `${GENERAL_ROUTE}#current-language`,
    icon: 'fa fa-cog',
  },
  {
    tabKey: 'general',
    sectionKey: 'accountIdenticon',
    descriptionKey: '',
    route: `${GENERAL_ROUTE}#account-identicon`,
    icon: 'fa fa-cog',
  },
  {
    tabKey: 'general',
    sectionKey: 'hideZeroBalanceTokens',
    descriptionKey: '',
    route: `${GENERAL_ROUTE}#zero-balancetokens`,
    icon: 'fa fa-cog',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'stateLogs',
    descriptionKey: 'stateLogsDescription',
    route: `${ADVANCED_ROUTE}#state-logs`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'syncWithMobile',
    descriptionKey: '',
    route: `${ADVANCED_ROUTE}#sync-withmobile`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'resetAccount',
    descriptionKey: 'resetAccountDescription',
    route: `${ADVANCED_ROUTE}#reset-account`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'showAdvancedGasInline',
    descriptionKey: 'showAdvancedGasInlineDescription',
    route: `${ADVANCED_ROUTE}#advanced-gascontrols`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'showHexData',
    descriptionKey: 'showHexDataDescription',
    route: `${ADVANCED_ROUTE}#show-hexdata`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'showFiatConversionInTestnets',
    descriptionKey: 'showFiatConversionInTestnetsDescription',
    route: `${ADVANCED_ROUTE}#conversion-testnetworks`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'showTestnetNetworks',
    descriptionKey: 'showTestnetNetworksDescription',
    route: `${ADVANCED_ROUTE}#show-testnets`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'nonceField',
    descriptionKey: 'nonceFieldDescription',
    route: `${ADVANCED_ROUTE}#customize-nonce`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'autoLockTimeLimit',
    descriptionKey: 'autoLockTimeLimitDescription',
    route: `${ADVANCED_ROUTE}#autolock-timer`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'syncWithThreeBox',
    descriptionKey: 'syncWithThreeBoxDescription',
    route: `${ADVANCED_ROUTE}#sync-with3box`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'ipfsGateway',
    descriptionKey: 'ipfsGatewayDescription',
    route: `${ADVANCED_ROUTE}#ipfs-gateway`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'preferredLedgerConnectionType',
    descriptionKey: 'preferredLedgerConnectionType',
    route: `${ADVANCED_ROUTE}#ledger-connection`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'advanced',
    sectionKey: 'dismissReminderField',
    descriptionKey: 'dismissReminderDescriptionField',
    route: `${ADVANCED_ROUTE}#dimiss-secretrecovery`,
    icon: 'fas fa-sliders-h',
  },
  {
    tabKey: 'contacts',
    sectionKey: 'contacts',
    descriptionKey: 'contacts',
    route: CONTACT_LIST_ROUTE,
    icon: 'fa fa-address-book',
  },
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  {
    tabKey: 'snaps',
    sectionKey: 'snaps',
    descriptionKey: 'snaps',
    route: SNAPS_LIST_ROUTE,
    icon: 'fa fa-flask',
  },
  ///: END:ONLY_INCLUDE_IN
  {
    tabKey: 'securityAndPrivacy',
    sectionKey: 'revealSeedWords',
    descriptionKey: 'revealSeedWords',
    route: `${SECURITY_ROUTE}#reveal-secretrecovery`,
    icon: 'fa fa-lock',
  },
  {
    tabKey: 'securityAndPrivacy',
    sectionKey: 'showIncomingTransactions',
    descriptionKey: 'showIncomingTransactionsDescription',
    route: `${SECURITY_ROUTE}#incoming-transaction`,
    icon: 'fa fa-lock',
  },
  {
    tabKey: 'securityAndPrivacy',
    sectionKey: 'usePhishingDetection',
    descriptionKey: 'usePhishingDetectionDescription',
    route: `${SECURITY_ROUTE}#phishing-detection`,
    icon: 'fa fa-lock',
  },
  {
    tabKey: 'securityAndPrivacy',
    sectionKey: 'participateInMetaMetrics',
    descriptionKey: 'participateInMetaMetricsDescription',
    route: `${SECURITY_ROUTE}#metrametrics`,
    icon: 'fa fa-lock',
  },
  {
    tabKey: 'alerts',
    sectionKey: 'alertSettingsUnconnectedAccount',
    descriptionKey: 'alertSettingsUnconnectedAccount',
    route: `${ALERTS_ROUTE}#unconnected-account`,
    icon: 'fa fa-bell',
  },
  {
    tabKey: 'alerts',
    sectionKey: 'alertSettingsWeb3ShimUsage',
    descriptionKey: 'alertSettingsWeb3ShimUsage',
    route: `${ALERTS_ROUTE}#web3-shimusage`,
    icon: 'fa fa-bell',
  },
  {
    tabKey: 'networks',
    sectionKey: 'mainnet',
    descriptionKey: 'mainnet',
    route: `${NETWORKS_ROUTE}#networks-mainnet`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'networks',
    sectionKey: 'ropsten',
    descriptionKey: 'ropsten',
    route: `${NETWORKS_ROUTE}#networks-ropsten`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'networks',
    sectionKey: 'rinkeby',
    descriptionKey: 'rinkeby',
    route: `${NETWORKS_ROUTE}#networks-rinkeby`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'networks',
    sectionKey: 'goerli',
    descriptionKey: 'goerli',
    route: `${NETWORKS_ROUTE}#networks-goerli`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'networks',
    sectionKey: 'kovan',
    descriptionKey: 'kovan',
    route: `${NETWORKS_ROUTE}#networks-kovan`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'networks',
    sectionKey: 'localhost',
    descriptionKey: 'localhost',
    route: `${NETWORKS_ROUTE}#networks-localhost`,
    icon: 'fa fa-plug',
  },
  {
    tabKey: 'about',
    sectionKey: 'metamaskVersion',
    descriptionKey: 'builtAroundTheWorld',
    route: `${ABOUT_US_ROUTE}#version`,
    icon: 'fa fa-info-circle',
  },
  {
    tabKey: 'about',
    sectionKey: 'links',
    descriptionKey: '',
    route: `${ABOUT_US_ROUTE}#links`,
    icon: 'fa fa-info-circle',
  },
  {
    tabKey: 'about',
    sectionKey: 'privacyMsg',
    descriptionKey: 'privacyMsg',
    route: `${ABOUT_US_ROUTE}#privacy-policy`,
    icon: 'fa fa-info-circle',
  },
  {
    tabKey: 'about',
    sectionKey: 'terms',
    descriptionKey: 'terms',
    route: `${ABOUT_US_ROUTE}#terms`,
    icon: 'fa fa-info-circle',
  },

  {
    tabKey: 'about',
    sectionKey: 'attributions',
    descriptionKey: 'attributions',
    route: `${ABOUT_US_ROUTE}#attributions`,
    icon: 'fa fa-info-circle',
  },

  {
    tabKey: 'about',
    sectionKey: 'supportCenter',
    descriptionKey: 'supportCenter',
    route: `${ABOUT_US_ROUTE}#supportcenter`,
    icon: 'fa fa-info-circle',
  },

  {
    tabKey: 'about',
    sectionKey: 'visitWebSite',
    descriptionKey: 'visitWebSite',
    route: `${ABOUT_US_ROUTE}#visitwebsite`,
    icon: 'fa fa-info-circle',
  },

  {
    tabKey: 'about',
    sectionKey: 'contactUs',
    descriptionKey: 'contactUs',
    route: `${ABOUT_US_ROUTE}#contactus`,
    icon: 'fa fa-info-circle',
  },
  {
    tabKey: 'experimental',
    sectionKey: 'enableEIP1559V2',
    descriptionKey: 'enableEIP1559V2Description',
    route: `${EXPERIMENTAL_ROUTE}#enable-advanced-gas`,
    icon: 'fa fa-flask',
  },
  {
    /** TODO: Remove during TOKEN_DETECTION_V2 feature flag clean up */
    tabKey: 'advanced',
    sectionKey: 'tokenDetection',
    descriptionKey: 'tokenDetectionToggleDescription',
    route: `${ADVANCED_ROUTE}#token-description`,
    icon: 'fas fa-sliders-h',
    featureFlag: 'TOKEN_DETECTION_V2',
  },
  {
    /** TODO: Remove during TOKEN_DETECTION_V2 feature flag clean up */
    tabKey: 'experimental',
    sectionKey: 'useTokenDetection',
    descriptionKey: 'useTokenDetectionDescription',
    route: `${EXPERIMENTAL_ROUTE}#token-description`,
    icon: 'fa fa-flask',
  },
  {
    tabKey: 'experimental',
    sectionKey: 'enableOpenSeaAPI',
    descriptionKey: 'enableOpenSeaAPIDescription',
    route: `${EXPERIMENTAL_ROUTE}#opensea-api`,
    icon: 'fa fa-flask',
    featureFlag: 'COLLECTIBLES_V1',
  },
  {
    tabKey: 'experimental',
    sectionKey: 'useCollectibleDetection',
    descriptionKey: 'useCollectibleDetectionDescription',
    route: `${EXPERIMENTAL_ROUTE}#autodetect-nfts`,
    icon: 'fa fa-flask',
    featureFlag: 'COLLECTIBLES_V1',
  },
];
