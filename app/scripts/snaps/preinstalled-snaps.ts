import type { PreinstalledSnap } from '@metamask/snaps-controllers';
import MessageSigningSnap from '@metamask/message-signing-snap/dist/preinstalled-snap.json';
import AccountWatcherSnap from '@metamask/account-watcher/dist/preinstalled-snap.json';
///: BEGIN:ONLY_INCLUDE_IF(build-flask)
import BitcoinWalletSnap from '@metamask/bitcoin-wallet-snap/dist/preinstalled-snap.json';
///: END:ONLY_INCLUDE_IF

const PREINSTALLED_SNAPS: readonly PreinstalledSnap[] = Object.freeze([
  MessageSigningSnap as PreinstalledSnap,
  AccountWatcherSnap as PreinstalledSnap,
  ///: BEGIN:ONLY_INCLUDE_IF(build-flask)
  BitcoinWalletSnap as PreinstalledSnap,
  ///: END:ONLY_INCLUDE_IF
]);

export default PREINSTALLED_SNAPS;
