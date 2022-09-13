import {
  MAINNET_CHAIN_ID,
  ETH_SYMBOL,
  TEST_ETH_SYMBOL,
  BNB_SYMBOL,
  TEST_ETH_TOKEN_IMAGE_URL,
  BNB_TOKEN_IMAGE_URL,
  BSC_CHAIN_ID,
  POLYGON_CHAIN_ID,
  MATIC_SYMBOL,
  MATIC_TOKEN_IMAGE_URL,
  GOERLI_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  AVALANCHE_SYMBOL,
  AVAX_TOKEN_IMAGE_URL,
} from './network';

export const QUOTES_EXPIRED_ERROR = 'quotes-expired';
export const SWAP_FAILED_ERROR = 'swap-failed-error';
export const ERROR_FETCHING_QUOTES = 'error-fetching-quotes';
export const QUOTES_NOT_AVAILABLE_ERROR = 'quotes-not-avilable';
export const CONTRACT_DATA_DISABLED_ERROR = 'contract-data-disabled';
export const OFFLINE_FOR_MAINTENANCE = 'offline-for-maintenance';
export const SWAPS_FETCH_ORDER_CONFLICT = 'swaps-fetch-order-conflict';

// An address that the metaswap-api recognizes as the default token for the current network, in place of the token address that ERC-20 tokens have
const DEFAULT_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETH_SWAPS_TOKEN_OBJECT = {
  symbol: ETH_SYMBOL,
  name: 'Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: './images/black-eth-logo.svg',
};

export const BNB_SWAPS_TOKEN_OBJECT = {
  symbol: BNB_SYMBOL,
  name: 'Binance Coin',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: BNB_TOKEN_IMAGE_URL,
};

export const MATIC_SWAPS_TOKEN_OBJECT = {
  symbol: MATIC_SYMBOL,
  name: 'Matic',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: MATIC_TOKEN_IMAGE_URL,
};

export const AVAX_SWAPS_TOKEN_OBJECT = {
  symbol: AVALANCHE_SYMBOL,
  name: 'Avalanche',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: AVAX_TOKEN_IMAGE_URL,
};

export const TEST_ETH_SWAPS_TOKEN_OBJECT = {
  symbol: TEST_ETH_SYMBOL,
  name: 'Test Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: TEST_ETH_TOKEN_IMAGE_URL,
};

export const GOERLI_SWAPS_TOKEN_OBJECT = {
  symbol: ETH_SYMBOL,
  name: 'Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: TEST_ETH_TOKEN_IMAGE_URL,
};

// A gas value for ERC20 approve calls that should be sufficient for all ERC20 approve implementations
export const DEFAULT_ERC20_APPROVE_GAS = '0x1d4c0';

const MAINNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';

const TESTNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';

const BSC_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';

// It's the same as we use for BSC.
const POLYGON_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';

const AVALANCHE_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';

export const WETH_CONTRACT_ADDRESS =
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
export const WETH_GOERLI_CONTRACT_ADDRESS =
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
export const WBNB_CONTRACT_ADDRESS =
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
export const WMATIC_CONTRACT_ADDRESS =
  '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
export const WAVAX_CONTRACT_ADDRESS =
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';

const SWAPS_TESTNET_CHAIN_ID = '0x539';

export const SWAPS_API_V2_BASE_URL = 'https://swap.metaswap.codefi.network';
export const SWAPS_DEV_API_V2_BASE_URL =
  'https://swap.metaswap-dev.codefi.network';
export const GAS_API_BASE_URL = 'https://gas-api.metaswap.codefi.network';
export const GAS_DEV_API_BASE_URL =
  'https://gas-api.metaswap-dev.codefi.network';

const BSC_DEFAULT_BLOCK_EXPLORER_URL = 'https://bscscan.com/';
const MAINNET_DEFAULT_BLOCK_EXPLORER_URL = 'https://etherscan.io/';
const GOERLI_DEFAULT_BLOCK_EXPLORER_URL = 'https://goerli.etherscan.io/';
const POLYGON_DEFAULT_BLOCK_EXPLORER_URL = 'https://polygonscan.com/';
const AVALANCHE_DEFAULT_BLOCK_EXPLORER_URL = 'https://snowtrace.io/';

export const ALLOWED_PROD_SWAPS_CHAIN_IDS = [
  MAINNET_CHAIN_ID,
  SWAPS_TESTNET_CHAIN_ID,
  BSC_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
];

export const ALLOWED_DEV_SWAPS_CHAIN_IDS = [
  ...ALLOWED_PROD_SWAPS_CHAIN_IDS,
  GOERLI_CHAIN_ID,
];

export const ALLOWED_SMART_TRANSACTIONS_CHAIN_IDS = [
  MAINNET_CHAIN_ID,
  GOERLI_CHAIN_ID,
];

export const SWAPS_CHAINID_CONTRACT_ADDRESS_MAP = {
  [MAINNET_CHAIN_ID]: MAINNET_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: TESTNET_CONTRACT_ADDRESS,
  [BSC_CHAIN_ID]: BSC_CONTRACT_ADDRESS,
  [POLYGON_CHAIN_ID]: POLYGON_CONTRACT_ADDRESS,
  [GOERLI_CHAIN_ID]: TESTNET_CONTRACT_ADDRESS,
  [AVALANCHE_CHAIN_ID]: AVALANCHE_CONTRACT_ADDRESS,
};

export const SWAPS_WRAPPED_TOKENS_ADDRESSES = {
  [MAINNET_CHAIN_ID]: WETH_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: WETH_CONTRACT_ADDRESS,
  [BSC_CHAIN_ID]: WBNB_CONTRACT_ADDRESS,
  [POLYGON_CHAIN_ID]: WMATIC_CONTRACT_ADDRESS,
  [GOERLI_CHAIN_ID]: WETH_GOERLI_CONTRACT_ADDRESS,
  [AVALANCHE_CHAIN_ID]: WAVAX_CONTRACT_ADDRESS,
};

export const ALLOWED_CONTRACT_ADDRESSES = {
  [MAINNET_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[MAINNET_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[MAINNET_CHAIN_ID],
  ],
  [SWAPS_TESTNET_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[SWAPS_TESTNET_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[SWAPS_TESTNET_CHAIN_ID],
  ],
  [GOERLI_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[GOERLI_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[GOERLI_CHAIN_ID],
  ],
  [BSC_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[BSC_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[BSC_CHAIN_ID],
  ],
  [POLYGON_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[POLYGON_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[POLYGON_CHAIN_ID],
  ],
  [AVALANCHE_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[AVALANCHE_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[AVALANCHE_CHAIN_ID],
  ],
};

export const SWAPS_CHAINID_DEFAULT_TOKEN_MAP = {
  [MAINNET_CHAIN_ID]: ETH_SWAPS_TOKEN_OBJECT,
  [SWAPS_TESTNET_CHAIN_ID]: TEST_ETH_SWAPS_TOKEN_OBJECT,
  [BSC_CHAIN_ID]: BNB_SWAPS_TOKEN_OBJECT,
  [POLYGON_CHAIN_ID]: MATIC_SWAPS_TOKEN_OBJECT,
  [GOERLI_CHAIN_ID]: GOERLI_SWAPS_TOKEN_OBJECT,
  [AVALANCHE_CHAIN_ID]: AVAX_SWAPS_TOKEN_OBJECT,
};

export const SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP = {
  [BSC_CHAIN_ID]: BSC_DEFAULT_BLOCK_EXPLORER_URL,
  [MAINNET_CHAIN_ID]: MAINNET_DEFAULT_BLOCK_EXPLORER_URL,
  [POLYGON_CHAIN_ID]: POLYGON_DEFAULT_BLOCK_EXPLORER_URL,
  [GOERLI_CHAIN_ID]: GOERLI_DEFAULT_BLOCK_EXPLORER_URL,
  [AVALANCHE_CHAIN_ID]: AVALANCHE_DEFAULT_BLOCK_EXPLORER_URL,
};

export const ETHEREUM = 'ethereum';
export const POLYGON = 'polygon';
export const BSC = 'bsc';
export const GOERLI = 'goerli';
export const AVALANCHE = 'avalanche';

export const SWAPS_CLIENT_ID = 'extension';

export const TOKEN_BUCKET_PRIORITY = {
  OWNED: 'owned',
  TOP: 'top',
};

export const SLIPPAGE = {
  DEFAULT: 2,
  HIGH: 3,
};
