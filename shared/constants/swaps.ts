import {
  ETH_TOKEN_IMAGE_URL,
  TEST_ETH_TOKEN_IMAGE_URL,
  BNB_TOKEN_IMAGE_URL,
  MATIC_TOKEN_IMAGE_URL,
  AVAX_TOKEN_IMAGE_URL,
  CURRENCY_SYMBOLS,
  CHAIN_IDS,
} from './network';

export const QUOTES_EXPIRED_ERROR = 'quotes-expired';
export const SWAP_FAILED_ERROR = 'swap-failed-error';
export const ERROR_FETCHING_QUOTES = 'error-fetching-quotes';
export const QUOTES_NOT_AVAILABLE_ERROR = 'quotes-not-avilable';
export const CONTRACT_DATA_DISABLED_ERROR = 'contract-data-disabled';
export const OFFLINE_FOR_MAINTENANCE = 'offline-for-maintenance';
export const SWAPS_FETCH_ORDER_CONFLICT = 'swaps-fetch-order-conflict';
export const SLIPPAGE_OVER_LIMIT_ERROR = 'slippage-over-limit';
export const SLIPPAGE_VERY_HIGH_ERROR = 'slippage-very-high';
export const SLIPPAGE_TOO_LOW_ERROR = 'slippage-too-low';
export const SLIPPAGE_NEGATIVE_ERROR = 'slippage-negative';

export const MAX_ALLOWED_SLIPPAGE = 15;

// An address that the metaswap-api recognizes as the default token for the current network,
// in place of the token address that ERC-20 tokens have
const DEFAULT_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface SwapsTokenObject {
  /**
   * The symbol of token object
   */
  symbol: string;
  /**
   * The name for the network
   */
  name: string;
  /**
   * An address that the metaswap-api recognizes as the default token
   */
  address: string;
  /**
   * Number of digits after decimal point
   */
  decimals: number;
  /**
   * URL for token icon
   */
  iconUrl: string;
}

export const ETH_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.ETH,
  name: 'Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: ETH_TOKEN_IMAGE_URL,
};

export const BNB_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.BNB,
  name: 'Binance Coin',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: BNB_TOKEN_IMAGE_URL,
} as const;

export const MATIC_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.MATIC,
  name: 'Matic',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: MATIC_TOKEN_IMAGE_URL,
} as const;

export const AVAX_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.AVALANCHE,
  name: 'Avalanche',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: AVAX_TOKEN_IMAGE_URL,
} as const;

export const TEST_ETH_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.TEST_ETH,
  name: 'Test Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: TEST_ETH_TOKEN_IMAGE_URL,
} as const;

export const GOERLI_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  symbol: CURRENCY_SYMBOLS.ETH,
  name: 'Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: TEST_ETH_TOKEN_IMAGE_URL,
} as const;

export const ARBITRUM_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  ...ETH_SWAPS_TOKEN_OBJECT,
} as const;

export const OPTIMISM_SWAPS_TOKEN_OBJECT: SwapsTokenObject = {
  ...ETH_SWAPS_TOKEN_OBJECT,
} as const;

// A gas value for ERC20 approve calls that should be sufficient for all ERC20 approve implementations
export const DEFAULT_ERC20_APPROVE_GAS = '0x1d4c0';

// Contract addresses below should be in lowercase.
const MAINNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';
const TESTNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';
const BSC_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';
const POLYGON_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';
const AVALANCHE_CONTRACT_ADDRESS = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31';
const OPTIMISM_CONTRACT_ADDRESS = '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6';
const ARBITRUM_CONTRACT_ADDRESS = '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6';

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

export const WETH_OPTIMISM_CONTRACT_ADDRESS =
  '0x4200000000000000000000000000000000000006';
export const WETH_ARBITRUM_CONTRACT_ADDRESS =
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

const SWAPS_TESTNET_CHAIN_ID = '0x539';

export const MMI_SWAPS_URL = 'https://metamask-institutional.io/swap';

export const SWAPS_API_V2_BASE_URL = 'https://swap.metaswap.codefi.network';
export const SWAPS_DEV_API_V2_BASE_URL = 'https://swap.dev-api.cx.metamask.io';
export const GAS_API_BASE_URL = 'https://gas-api.metaswap.codefi.network';
export const GAS_DEV_API_BASE_URL =
  'https://gas-api.metaswap-dev.codefi.network';

const BSC_DEFAULT_BLOCK_EXPLORER_URL = 'https://bscscan.com/';
const MAINNET_DEFAULT_BLOCK_EXPLORER_URL = 'https://etherscan.io/';
const GOERLI_DEFAULT_BLOCK_EXPLORER_URL = 'https://goerli.etherscan.io/';
const POLYGON_DEFAULT_BLOCK_EXPLORER_URL = 'https://polygonscan.com/';
const AVALANCHE_DEFAULT_BLOCK_EXPLORER_URL = 'https://snowtrace.io/';
const OPTIMISM_DEFAULT_BLOCK_EXPLORER_URL = 'https://optimistic.etherscan.io/';
const ARBITRUM_DEFAULT_BLOCK_EXPLORER_URL = 'https://arbiscan.io/';

export const ALLOWED_PROD_SWAPS_CHAIN_IDS = [
  CHAIN_IDS.MAINNET,
  SWAPS_TESTNET_CHAIN_ID,
  CHAIN_IDS.BSC,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.AVALANCHE,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.ARBITRUM,
] as const;

export const ALLOWED_DEV_SWAPS_CHAIN_IDS = [
  ...ALLOWED_PROD_SWAPS_CHAIN_IDS,
  CHAIN_IDS.GOERLI,
] as const;

export const ALLOWED_SMART_TRANSACTIONS_CHAIN_IDS = [
  CHAIN_IDS.MAINNET,
  CHAIN_IDS.GOERLI,
] as const;

export const SWAPS_CHAINID_CONTRACT_ADDRESS_MAP = {
  [CHAIN_IDS.MAINNET]: MAINNET_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: TESTNET_CONTRACT_ADDRESS,
  [CHAIN_IDS.BSC]: BSC_CONTRACT_ADDRESS,
  [CHAIN_IDS.POLYGON]: POLYGON_CONTRACT_ADDRESS,
  [CHAIN_IDS.GOERLI]: TESTNET_CONTRACT_ADDRESS,
  [CHAIN_IDS.AVALANCHE]: AVALANCHE_CONTRACT_ADDRESS,
  [CHAIN_IDS.OPTIMISM]: OPTIMISM_CONTRACT_ADDRESS,
  [CHAIN_IDS.ARBITRUM]: ARBITRUM_CONTRACT_ADDRESS,
} as const;

export const SWAPS_WRAPPED_TOKENS_ADDRESSES = {
  [CHAIN_IDS.MAINNET]: WETH_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: WETH_CONTRACT_ADDRESS,
  [CHAIN_IDS.BSC]: WBNB_CONTRACT_ADDRESS,
  [CHAIN_IDS.POLYGON]: WMATIC_CONTRACT_ADDRESS,
  [CHAIN_IDS.GOERLI]: WETH_GOERLI_CONTRACT_ADDRESS,
  [CHAIN_IDS.AVALANCHE]: WAVAX_CONTRACT_ADDRESS,
  [CHAIN_IDS.OPTIMISM]: WETH_OPTIMISM_CONTRACT_ADDRESS,
  [CHAIN_IDS.ARBITRUM]: WETH_ARBITRUM_CONTRACT_ADDRESS,
} as const;

export const ALLOWED_CONTRACT_ADDRESSES = {
  [CHAIN_IDS.MAINNET]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.MAINNET],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.MAINNET],
  ],
  [SWAPS_TESTNET_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[SWAPS_TESTNET_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[SWAPS_TESTNET_CHAIN_ID],
  ],
  [CHAIN_IDS.GOERLI]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.GOERLI],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.GOERLI],
  ],
  [CHAIN_IDS.BSC]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.BSC],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.BSC],
  ],
  [CHAIN_IDS.POLYGON]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.POLYGON],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.POLYGON],
  ],
  [CHAIN_IDS.AVALANCHE]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.AVALANCHE],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.AVALANCHE],
  ],
  [CHAIN_IDS.OPTIMISM]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.OPTIMISM],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.OPTIMISM],
  ],
  [CHAIN_IDS.ARBITRUM]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[CHAIN_IDS.ARBITRUM],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[CHAIN_IDS.ARBITRUM],
  ],
} as const;

export const SWAPS_CHAINID_DEFAULT_TOKEN_MAP = {
  [CHAIN_IDS.MAINNET]: ETH_SWAPS_TOKEN_OBJECT,
  [SWAPS_TESTNET_CHAIN_ID]: TEST_ETH_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.BSC]: BNB_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.POLYGON]: MATIC_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.GOERLI]: GOERLI_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.AVALANCHE]: AVAX_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.OPTIMISM]: OPTIMISM_SWAPS_TOKEN_OBJECT,
  [CHAIN_IDS.ARBITRUM]: ARBITRUM_SWAPS_TOKEN_OBJECT,
} as const;

export const SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP = {
  [CHAIN_IDS.BSC]: BSC_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.MAINNET]: MAINNET_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.POLYGON]: POLYGON_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.GOERLI]: GOERLI_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.AVALANCHE]: AVALANCHE_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.OPTIMISM]: OPTIMISM_DEFAULT_BLOCK_EXPLORER_URL,
  [CHAIN_IDS.ARBITRUM]: ARBITRUM_DEFAULT_BLOCK_EXPLORER_URL,
} as const;

export const ETHEREUM = 'ethereum';
export const POLYGON = 'polygon';
export const BSC = 'bsc';
export const GOERLI = 'goerli';
export const AVALANCHE = 'avalanche';
export const OPTIMISM = 'optimism';
export const ARBITRUM = 'arbitrum';

export const SWAPS_CLIENT_ID = 'extension';

export enum TokenBucketPriority {
  owned = 'owned',
  top = 'top',
}

export enum Slippage {
  default = 2,
  high = 3,
}
