import { LedgerBridge } from '@metamask/eth-ledger-bridge-keyring';
import {
  LedgerAction,
  OffscreenCommunicationEvents,
  OffscreenCommunicationTarget,
} from '../../../../shared/constants/offscreen-communication';

type LedgerMessage = {
  target: OffscreenCommunicationTarget;
  event: OffscreenCommunicationEvents;
};

type LedgerResponse<T = unknown> = {
  success: boolean;
  payload?: T;
  error?: string;
};

/**
 * This class is used as a custom bridge for the Ledger connection. Every
 * hardware wallet keyring also requires a bridge that has a known interface
 * that the keyring can call into for specific functions. The bridge then makes
 * whatever calls or requests it needs to in order to fulfill the request from
 * the keyring. In this case, the bridge is used to communicate with the
 * Offscreen Document. Inside the Offscreen document the ledger script is
 * loaded and registers a listener for these calls and communicate with the
 * ledger device via the ledger keyring iframe. The ledger keyring iframe is
 * added to the offscreen.html file directly.
 */
export class LedgerOffscreenBridge implements LedgerBridge {
  isDeviceConnected = false;

  init() {
    chrome.runtime.onMessage.addListener((msg: LedgerMessage) => {
      if (
        msg.target === OffscreenCommunicationTarget.extension &&
        msg.event === OffscreenCommunicationEvents.ledgerDeviceConnect
      ) {
        this.isDeviceConnected = true;
      }
    });

    return Promise.resolve();
  }

  destroy() {
    // TODO: remove listener
    return Promise.resolve();
  }

  attemptMakeApp() {
    return new Promise<boolean>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.makeApp,
        },
        (response: LedgerResponse) => {
          if (response.success) {
            resolve(true);
          } else if (response.error) {
            reject(response.error);
          } else {
            reject(new Error('Unknown error occurred'));
          }
        },
      );
    });
  }

  updateTransportMethod(transportType: string) {
    return new Promise<boolean>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.updateTransport,
          params: { transportType },
        },
        (response: LedgerResponse) => {
          if (response.success) {
            resolve(true);
          } else {
            reject(new Error('Ledger transport could not be updated'));
          }
        },
      );
    });
  }

  getPublicKey(params: { hdPath: string }) {
    return new Promise<{
      publicKey: string;
      address: string;
      chainCode?: string;
    }>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.getPublicKey,
          params,
        },
        (
          response: LedgerResponse<{
            publicKey: string;
            address: string;
            chainCode?: string;
          }>,
        ) => {
          if (response.success && response.payload) {
            resolve(response.payload);
          } else {
            reject(new Error(response.error || 'Unknown error occurred'));
          }
        },
      );
    });
  }

  deviceSignTransaction(params: { hdPath: string; tx: string }) {
    return new Promise<{
      v: string;
      s: string;
      r: string;
    }>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.signTransaction,
          params,
        },
        (response: LedgerResponse<{ v: string; s: string; r: string }>) => {
          if (response.success && response.payload) {
            resolve(response.payload);
          } else {
            reject(new Error(response.error || 'Unknown error occurred'));
          }
        },
      );
    });
  }

  deviceSignMessage(params: { hdPath: string; message: string }) {
    return new Promise<{
      v: number;
      s: string;
      r: string;
    }>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.signPersonalMessage,
          params,
        },
        (response: LedgerResponse<{ v: number; s: string; r: string }>) => {
          if (response.success && response.payload) {
            resolve(response.payload);
          } else {
            reject(new Error(response.error || 'Unknown error occurred'));
          }
        },
      );
    });
  }

  deviceSignTypedData(params: {
    hdPath: string;
    domainSeparatorHex: string;
    hashStructMessageHex: string;
  }) {
    return new Promise<{
      v: number;
      s: string;
      r: string;
    }>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: OffscreenCommunicationTarget.ledgerOffscreen,
          action: LedgerAction.signTypedData,
          params,
        },
        (response: LedgerResponse<{ v: number; s: string; r: string }>) => {
          if (response.success && response.payload) {
            resolve(response.payload);
          } else {
            reject(new Error(response.error || 'Unknown error occurred'));
          }
        },
      );
    });
  }
}
