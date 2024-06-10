import { CHAIN_IDS } from './network';

export const ALLOWED_BRIDGE_CHAIN_IDS = [
  CHAIN_IDS.MAINNET,
  CHAIN_IDS.BSC,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.ZKSYNC_ERA,
  CHAIN_IDS.AVALANCHE,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.ARBITRUM,
  CHAIN_IDS.LINEA_MAINNET,
  CHAIN_IDS.BASE,
];

export const TRUSTED_BRIDGE_SIGNER =
  '0x533FbF047Ed13C20e263e2576e41c747206d1348';

export const SIG_LEN = 130;
