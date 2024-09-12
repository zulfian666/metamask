// Please do not add any more items to this list.
// This list is temporary and the goal is to reduce it to 0, meaning all requests are mocked in our e2e tests.
const WHITE_LISTED_URLS = [
  'https://account.api.cx.metamask.io/networks/1/tokens',
  'https://account.api.cx.metamask.io/networks/10/tokens',
  'https://account.api.cx.metamask.io/networks/100/tokens',
  'https://account.api.cx.metamask.io/networks/1101/tokens',
  'https://account.api.cx.metamask.io/networks/1284/tokens',
  'https://account.api.cx.metamask.io/networks/1285/tokens',
  'https://account.api.cx.metamask.io/networks/1313161554/tokens',
  'https://account.api.cx.metamask.io/networks/137/tokens',
  'https://account.api.cx.metamask.io/networks/25/tokens',
  'https://account.api.cx.metamask.io/networks/250/tokens',
  'https://account.api.cx.metamask.io/networks/324/tokens',
  'https://account.api.cx.metamask.io/networks/42161/tokens',
  'https://account.api.cx.metamask.io/networks/42220/tokens',
  'https://account.api.cx.metamask.io/networks/43114/tokens',
  'https://account.api.cx.metamask.io/networks/56/tokens',
  'https://account.api.cx.metamask.io/networks/59144/tokens',
  'https://account.api.cx.metamask.io/networks/8453/tokens',
  'https://accounts.google.com/ListAccounts?gpsia=1&source=ChromiumBrowser&json=standard',
  'https://acl.execution.metamask.io/latest/registry.json',
  'https://acl.execution.metamask.io/latest/signature.json',
  'https://api-v2.lens.dev/',
  'https://api.lens.dev/',
  'https://api.segment.io/v1/batch',
  'https://api.segment.io/v1/i',
  'https://api.segment.io/v1/t',
  'https://api.web3modal.com/getWalletImage/018b2d52-10e9-4158-1fde-a5d5bac5aa00',
  'https://api.web3modal.com/getWalletImage/45f2f08e-fc0c-4d62-3e63-404e72170500',
  'https://api.web3modal.com/getWalletImage/68e8063a-ff69-4941-3b40-af09e2fcd700',
  'https://api.web3modal.com/getWalletImage/7677b54f-3486-46e2-4e37-bf8747814f00',
  'https://api.web3modal.com/getWallets?page=1&entries=4',
  'https://api.web3modal.com/public/getAssetImage/07ba87ed-43aa-4adf-4540-9e6a2b9cae00',
  'https://api.web3modal.com/public/getAssetImage/ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400',
  'https://authentication.api.cx.metamask.io/siwe/verify',
  'https://bafkreifvhjdf6ve4jfv6qytqtux5nd4nwnelioeiqx5x2ez5yrgrzk7ypi.ipfs.dweb.link/',
  'https://bafybeidxfmwycgzcp4v2togflpqh2gnibuexjy4m4qqwxp7nh3jx5zlh4y.ipfs.dweb.link/1.json',
  'https://bridge.api.cx.metamask.io/getTokens?chainId=1',
  'https://cdn.contentful.com/spaces/jdkgyfmyd9sw/environments/master/entries?content_type=productAnnouncement&order=-sys.createdAt&fields.clients=portfolio',
  'https://cdn.segment.com/analytics-next/bundles/ajs-destination.bundle.ed53a26b6edc80c65d73.js',
  'https://cdn.segment.com/analytics-next/bundles/schemaFilter.bundle.5c2661f67b4b71a6d9bd.js',
  'https://cdn.segment.com/analytics.js/v1/2f64suG6gtrhDVI2rGCUgH9hbfp4NJ12/analytics.min.js',
  'https://cdn.segment.com/analytics.js/v1/MHae0tTVRqyHDim9qQ9ablSZpvm3Tvzc/analytics.min.js',
  'https://cdn.segment.com/v1/projects/2f64suG6gtrhDVI2rGCUgH9hbfp4NJ12/settings',
  'https://cdn.segment.com/v1/projects/MHae0tTVRqyHDim9qQ9ablSZpvm3Tvzc/settings',
  'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.14.1/css/mdb.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css',
  'https://chainid.network/chains.json',
  'https://d6tizftlrpuof.cloudfront.net/themes/production/consensys-button-8ad6c4bb549247e0276dd160e2d8e00d.png',
  'https://doesntexist.test/customRPC',
  'https://etherscan.io/favicon.ico',
  'https://execution.metamask.io/iframe/6.6.2/bundle.js',
  'https://execution.metamask.io/iframe/6.6.2/index.html',
  'https://gas.api.cx.metamask.io/networks/1/gasPrices',
  'https://gas.api.cx.metamask.io/networks/1/suggestedGasFees',
  'https://gas.api.cx.metamask.io/networks/1337/suggestedGasFees',
  'https://github.com/favicon.ico',
  'https://lattice.gridplus.io/?keyring=MetaMask&forceLogin=true',
  'https://metamask.github.io/eth-ledger-bridge-keyring',
  'https://metamask.github.io/eth-ledger-bridge-keyring/',
  'https://metamask.github.io/eth-ledger-bridge-keyring/bundle.js',
  'https://metamask.github.io/favicon.ico',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/72585f70-0b8c9d47690d7fe2ac87.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/app-acf97414441c8da8c710.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/component---src-pages-index-tsx-5cfb3411e9d4665335b8.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/f36c6662-e3e593644ccdf91e0df1.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/framework-7f36badc7ddb1e3597e8.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/500.html/page-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/app-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/index/page-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Bold.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Medium.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Regular.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/webpack-runtime-aa57915fb3e4eb554525.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/72585f70-b0685205a809efe121dc.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/app-5331ee4ad1d5e0ac8d54.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/component---src-pages-index-tsx-1a885d3a2aa4b3b7a091.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/f36c6662-7e78236bba23a76b6101.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/favicon-32x32.png?v=96ce3237722cfe869f93249367a3fca1',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/favicon.svg?v=96ce3237722cfe869f93249367a3fca1',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/framework-fe667a09be4a08a9b5f4.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/page-data/app-data.json',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/page-data/index/page-data.json',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Bold.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Medium.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Regular.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW-.woff',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/webpack-runtime-35853b86ee7228936852.js',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/apple-touch-icon-1024x1024.png',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/favicon-16x16.png',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/favicon.ico',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/main.js',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/test-data.json',
  'https://metamask.github.io/test-dapp/metamask-fox.svg',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ANTANI',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=PHP,USD',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
  'https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD',
  'https://min-api.cryptocompare.com/data/price?fsym=TEST&tsyms=USD',
  'https://nft.api.cx.metamask.io/collections?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&chainId=1',
  'https://o1377931.ingest.sentry.io/api/6689755/envelope/?sentry_key=be397d53390141cda058e18f3749c8e4&sentry_version=7&sentry_client=sentry.javascript.react%2F7.102.1',
  'https://on-ramp-content.api.cx.metamask.io/regions/networks?context=extension',
  'https://on-ramp.api.cx.metamask.io/eligibility/mm-card?id=',
  'https://on-ramp.api.cx.metamask.io/eligibility/mm-card?id=0x01a92b9df8ce522a8f98161a97378bfdb2cce64f2d4293657e7eefe818d9ffbc',
  'https://on-ramp.api.cx.metamask.io/eligibility/mm-card?id=0xb1b1aa3036452bf32c1159266d1886279e4890ba907ed275e39fbc56906a8be2',
  'https://on-ramp.api.cx.metamask.io/eligibility/mm-card?id=7ea301c0-6a98-11ef-a19e-f3acaa606eca',
  'https://on-ramp.api.cx.metamask.io/eligibility/mm-card?id=8af26790-6a98-11ef-bee7-5553e37c0097',
  'https://portfolio.metamask.io/assets/AccountsMultiSelectDropdown-9e2b61d0.js',
  'https://portfolio.metamask.io/assets/BalanceConversionText-e8458c4f.js',
  'https://portfolio.metamask.io/assets/DownloadMobileApp-9278feb8.js',
  'https://portfolio.metamask.io/assets/EuclidCircularB-Bold-ce69f859.woff2',
  'https://portfolio.metamask.io/assets/EuclidCircularB-Light-83a50db7.woff2',
  'https://portfolio.metamask.io/assets/EuclidCircularB-Medium-07114fb3.woff2',
  'https://portfolio.metamask.io/assets/EuclidCircularB-Regular-d44b3701.woff2',
  'https://portfolio.metamask.io/assets/EuclidCircularB-Semibold-e2e968f4.woff2',
  'https://portfolio.metamask.io/assets/GenericError-4cf31668.js',
  'https://portfolio.metamask.io/assets/LoadingPulseCircle-5fb146d3.js',
  'https://portfolio.metamask.io/assets/Maintenance-ae1f892f.js',
  'https://portfolio.metamask.io/assets/SparklesIcon-d4c4fb1e.js',
  'https://portfolio.metamask.io/assets/SwapElement-e8cb8d58.js',
  'https://portfolio.metamask.io/assets/SwapToken-f1103743.js',
  'https://portfolio.metamask.io/assets/TableError-3e4618fd.js',
  'https://portfolio.metamask.io/assets/TableLoading-420ea867.js',
  'https://portfolio.metamask.io/assets/TokenDetail-99e20333.js',
  'https://portfolio.metamask.io/assets/bootstrap-61672557.css',
  'https://portfolio.metamask.io/assets/bootstrap-7c5c33c8.js',
  'https://portfolio.metamask.io/assets/buyRoutes-7a1c150e.js',
  'https://portfolio.metamask.io/assets/chartjs-plugin-crosshair.esm-34f1689e.js',
  'https://portfolio.metamask.io/assets/differenceInMilliseconds-d6e71353.js',
  'https://portfolio.metamask.io/assets/faChevronDown-a9475498.js',
  'https://portfolio.metamask.io/assets/index-10f017aa.js',
  'https://portfolio.metamask.io/assets/index-184b0bea.js',
  'https://portfolio.metamask.io/assets/index-6d5a5f87.js',
  'https://portfolio.metamask.io/assets/index-8bf212a1.css',
  'https://portfolio.metamask.io/assets/index-8dc68a2a.js',
  'https://portfolio.metamask.io/assets/index-8e4169de.js',
  'https://portfolio.metamask.io/assets/index-a1e9650c.js',
  'https://portfolio.metamask.io/assets/index-af8eaab0.js',
  'https://portfolio.metamask.io/assets/index-b14e9253.js',
  'https://portfolio.metamask.io/assets/index-b14e9253.js',
  'https://portfolio.metamask.io/assets/index-c6a288c7.js',
  'https://portfolio.metamask.io/assets/metamask-fox-b8558514.svg',
  'https://portfolio.metamask.io/assets/portfolio-logo-b0c23761.svg',
  'https://portfolio.metamask.io/assets/portfolio-logo-dark-34c7653e.svg',
  'https://portfolio.metamask.io/assets/sellRoutes-44d8e71c.js',
  'https://portfolio.metamask.io/assets/useBreakpoint-f1843395.js',
  'https://portfolio.metamask.io/assets/useCexBalancesStatus-a42a6216.js',
  'https://portfolio.metamask.io/assets/useLDVariation-7848242a.js',
  'https://portfolio.metamask.io/assets/useSearchQuery-0403b373.js',
  'https://portfolio.metamask.io/assets/useSortTableData-53faf8b9.js',
  'https://portfolio.metamask.io/bridge?metamaskEntry=ext_bridge_button&metametricsId=null&metricsEnabled=false&marketingEnabled=false',
  'https://portfolio.metamask.io/bridge?metamaskEntry=ext_bridge_button&metametricsId=null&metricsEnabled=false&marketingEnabled=false&token=0x581c3C1A2A4EBDE2A0Df29B5cf4c116E42945947',
  'https://portfolio.metamask.io/bridge?metamaskEntry=ext_bridge_button&metametricsId=null&metricsEnabled=false&marketingEnabled=false&token=native',
  'https://portfolio.metamask.io/favicon.ico',
  'https://portfolio.metamask.io/favicon.png',
  'https://price.api.cx.metamask.io/v1/chains/0x1/historical-prices/0x0000000000000000000000000000000000000000?vsCurrency=usd&timePeriod=1D',
  'https://price.api.cx.metamask.io/v1/chains/0x1/historical-prices/0x581c3C1A2A4EBDE2A0Df29B5cf4c116E42945947?vsCurrency=usd&timePeriod=1D',
  'https://price.api.cx.metamask.io/v1/chains/0x38/historical-prices/0x0D8775F648430679A709E98d2b0Cb6250d2887EF?vsCurrency=usd&timePeriod=1D',
  'https://price.api.cx.metamask.io/v1/chains/1/spot-prices/0x0000000000000000000000000000000000000000',
  'https://price.api.cx.metamask.io/v1/exchange-rates?baseCurrency=usd',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x06AF07097C9Eeb7fD685c692751D5C66dB49c215%2C0x514910771AF9Ca656af840dff83E8264EcF986CA%2C0x7d4b8Cce0591C9044a22ee543533b72E976E36C3&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x06af07097c9eeb7fd685c692751d5c66db49c215%2C0x514910771af9ca656af840dff83e8264ecf986ca%2C0x7d4b8cce0591c9044a22ee543533b72e976e36c3&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x2EFA2Cb29C2341d8E5Ba7D3262C9e9d6f1Bf3711&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x581c3C1A2A4EBDE2A0Df29B5cf4c116E42945947&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x6b175474e89094c44da98b954eedeac495271d0f&vsCurrency=usd&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/1/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/10/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/42161/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/56/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x0D8775F648430679A709E98d2b0Cb6250d2887EF&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/56/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000%2C0x0d8775f648430679a709e98d2b0cb6250d2887ef&vsCurrency=ETH&includeMarketData=true',
  'https://price.api.cx.metamask.io/v2/chains/56/spot-prices?tokenAddresses=0x0000000000000000000000000000000000000000&vsCurrency=ETH&includeMarketData=true',
  'https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json',
  'https://registry.npmjs.org/@metamask/bip32-example-snap/-/bip32-example-snap-0.35.0-flask.1.tgz',
  'https://registry.npmjs.org/@metamask/bip32-example-snap/-/bip32-example-snap-0.35.2-flask.1.tgz',
  'https://registry.npmjs.org/@metamask/bip32-example-snap/-/bip32-example-snap-2.2.0.tgz',
  'https://registry.npmjs.org/@metamask/bip44-example-snap/-/bip44-example-snap-2.1.2.tgz',
  'https://registry.npmjs.org/@metamask/client-status-example-snap/-/client-status-example-snap-1.0.2.tgz',
  'https://registry.npmjs.org/@metamask/cronjob-example-snap/-/cronjob-example-snap-2.1.3.tgz',
  'https://registry.npmjs.org/@metamask/dialog-example-snap/-/dialog-example-snap-2.3.0.tgz',
  'https://registry.npmjs.org/@metamask/ethereum-provider-example-snap/-/ethereum-provider-example-snap-2.1.2.tgz',
  'https://registry.npmjs.org/@metamask/get-entropy-example-snap/-/get-entropy-example-snap-2.1.2.tgz',
  'https://registry.npmjs.org/@metamask/get-file-example-snap/-/get-file-example-snap-1.1.2.tgz',
  'https://registry.npmjs.org/@metamask/home-page-example-snap/-/home-page-example-snap-1.1.2.tgz',
  'https://registry.npmjs.org/@metamask/images-example-snap/-/images-example-snap-1.1.0.tgz',
  'https://registry.npmjs.org/@metamask/insights-example-snap/-/insights-example-snap-2.2.2.tgz',
  'https://registry.npmjs.org/@metamask/interactive-ui-example-snap/-/interactive-ui-example-snap-2.2.0.tgz',
  'https://registry.npmjs.org/@metamask/jsx-example-snap/-/jsx-example-snap-1.1.1.tgz',
  'https://registry.npmjs.org/@metamask/lifecycle-hooks-example-snap/-/lifecycle-hooks-example-snap-2.1.2.tgz',
  'https://registry.npmjs.org/@metamask/localization-example-snap/-/localization-example-snap-1.1.3.tgz',
  'https://registry.npmjs.org/@metamask/manage-state-example-snap/-/manage-state-example-snap-2.2.2.tgz',
  'https://registry.npmjs.org/@metamask/name-lookup-example-snap/-/name-lookup-example-snap-3.1.0.tgz',
  'https://registry.npmjs.org/@metamask/network-example-snap/-/network-example-snap-2.1.2.tgz',
  'https://registry.npmjs.org/@metamask/notification-example-snap/-/notification-example-snap-2.1.3.tgz',
  'https://registry.npmjs.org/@metamask/signature-insights-example-snap/-/signature-insights-example-snap-1.0.2.tgz',
  'https://registry.npmjs.org/@metamask/snap-simple-keyring-snap/-/snap-simple-keyring-snap-1.1.2.tgz',
  'https://registry.npmjs.org/@metamask/wasm-example-snap/-/wasm-example-snap-2.1.3.tgz',
  'https://responsive-rpc.test/',
  'https://sentry.io/api/0000000/envelope/?sentry_key=fake&sentry_version=7&sentry_client=sentry.javascript.browser%2F8.19.0',
  'https://sourcify.dev/server/files/any/1337/0x',
  'https://staking.api.cx.metamask.io/v1/pooled-staking/eligibility?addresses=',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0x0000000000000000000000000000000000000000.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0x581c3c1a2a4ebde2a0df29b5cf4c116e42945947.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0x86002be4cdd922de1ccb831582bf99284b99ac12.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/1337/0xc6bdb96e29c38dc43f014eed44de4106a6a8eb5f.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x0d8775f648430679a709e98d2b0cb6250d2887ef.png',
  'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  'https://swap.api.cx.metamask.io/networks/1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=1000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=2000000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=3000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=1000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=50000000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.metaswap.codefi.network/networks/1/topAssets',
  'https://token.api.cx.metamask.io/assets/networkLogos/ethereum.svg',
  'https://token.api.cx.metamask.io/token/0x539?address=0x0c54fccd2e384b4bb6f2e405bf5cbc15a017aafb',
  'https://token.api.cx.metamask.io/token/0x539?address=0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  'https://token.api.cx.metamask.io/token/0x539?address=0xcccccccccccccccccccccccccccccccccccccccc',
  'https://token.api.cx.metamask.io/token/0x539?address=0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
  'https://token.api.cx.metamask.io/tokens/0x13881?occurrenceFloor=100&includeNativeAssets=false',
  'https://token.api.cx.metamask.io/tokens/0x1a4?occurrenceFloor=100&includeNativeAssets=false',
  'https://token.api.cx.metamask.io/tokens/0x66eed?occurrenceFloor=100&includeNativeAssets=false',
  'https://token.api.cx.metamask.io/tokens/0xa?occurrenceFloor=100&includeNativeAssets=false',
  'https://token.api.cx.metamask.io/tokens/1000?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/1338?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/1?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/420?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/421613?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/42161?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://token.api.cx.metamask.io/tokens/80001?occurrenceFloor=3&includeNativeAssets=false&includeDuplicateSymbolAssets=false&includeTokenFees=false&includeAssetType=false&includeERC20Permit=false&includeStorage=false',
  'https://tx-sentinel-ethereum-mainnet.api.cx.metamask.io/',
  'https://tx-sentinel-ethereum-mainnet.api.cx.metamask.io/networks',
  'https://unresponsive-rpc.test/',
  'https://w.usabilla.com/ade130c1096e.js?lv=1',
  'https://websites.cdn.getfeedback.com/embed/aaeNy60jTL/gf.js',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x048226a0',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x095ea7b3',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x23b872dd',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x2e1a7d4d',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x39509351',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x5f575529',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x60806040',
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=0xd0e30db0',
];

const WHITE_LISTED_HOSTS = [
  'app.launchdarkly.com',
  'clientstream.launchdarkly.com',
  'content-autofill.googleapis.com',
  'events.launchdarkly.com',
  'firefox.settings.services.mozilla.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  '*gvt1.com',
  'shavar.services.mozilla.com',
  'start.metamask.io',
  'widget.intercom.io'
];

module.exports = { WHITE_LISTED_HOSTS, WHITE_LISTED_URLS };
