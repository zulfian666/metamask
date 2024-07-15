import type { Json, JsonRpcRequest } from '@metamask/utils';

import {
  BaseController,
  type ControllerGetStateAction,
  type ControllerStateChangeEvent,
  type RestrictedControllerMessenger,
} from '@metamask/base-controller';
import {
  BtcAccountType,
  KeyringClient,
  type Balance,
  type CaipAssetType,
  type InternalAccount,
  isEvmAccountType,
} from '@metamask/keyring-api';
import type { HandleSnapRequest } from '@metamask/snaps-controllers';
import type { SnapId } from '@metamask/snaps-sdk';
import { HandlerType } from '@metamask/snaps-utils';
import type { Draft } from 'immer';
import type {
  AccountsControllerChangeEvent,
  AccountsControllerState,
} from '@metamask/accounts-controller';
import { isBtcMainnetAddress } from '../../../../shared/lib/multichain';
import { Poller } from './Poller';

const controllerName = 'BalancesController';

/**
 * State used by the {@link BalancesController} to cache account balances.
 */
export type BalancesControllerState = {
  balances: {
    [account: string]: {
      [asset: string]: {
        amount: string;
        unit: string;
      };
    };
  };
};

/**
 * Default state of the {@link BalancesController}.
 */
export const defaultState: BalancesControllerState = { balances: {} };

/**
 * Returns the state of the {@link BalancesController}.
 */
export type BalancesControllerGetStateAction = ControllerGetStateAction<
  typeof controllerName,
  BalancesControllerState
>;

/**
 * Updates the balances of all supported accounts.
 */
export type BalancesControllerUpdateBalancesAction = {
  type: `${typeof controllerName}:updateBalances`;
  handler: BalancesController['updateBalances'];
};

/**
 * Event emitted when the state of the {@link BalancesController} changes.
 */
export type BalancesControllerStateChange = ControllerStateChangeEvent<
  typeof controllerName,
  BalancesControllerState
>;

/**
 * Actions exposed by the {@link BalancesController}.
 */
export type BalancesControllerActions =
  | BalancesControllerGetStateAction
  | BalancesControllerUpdateBalancesAction;

/**
 * Events emitted by {@link BalancesController}.
 */
export type BalancesControllerEvents = BalancesControllerStateChange;

/**
 * Actions that this controller is allowed to call.
 */
export type AllowedActions = HandleSnapRequest;

/**
 * Events that this controller is allowed to subscribe.
 */
export type AllowedEvents = AccountsControllerChangeEvent;

/**
 * Messenger type for the BalancesController.
 */
export type BalancesControllerMessenger = RestrictedControllerMessenger<
  typeof controllerName,
  BalancesControllerActions | AllowedActions,
  BalancesControllerEvents | AllowedEvents,
  AllowedActions['type'],
  AllowedEvents['type']
>;

/**
 * {@link BalancesController}'s metadata.
 *
 * This allows us to choose if fields of the state should be persisted or not
 * using the `persist` flag; and if they can be sent to Sentry or not, using
 * the `anonymous` flag.
 */
const balancesControllerMetadata = {
  balances: {
    persist: true,
    anonymous: false,
  },
};

const BTC_TESTNET_ASSETS = ['bip122:000000000933ea01ad0ee984209779ba/slip44:0'];
const BTC_MAINNET_ASSETS = ['bip122:000000000019d6689c085ae165831e93/slip44:0'];
export const BTC_AVG_BLOCK_TIME = 600000; // 10 minutes in milliseconds

/**
 * The BalancesController is responsible for fetching and caching account
 * balances.
 */
export class BalancesController extends BaseController<
  typeof controllerName,
  BalancesControllerState,
  BalancesControllerMessenger
> {
  #poller: Poller;

  // TODO: remove once action is implemented
  #listMultichainAccounts: () => InternalAccount[];

  constructor({
    messenger,
    state,
    listMultichainAccounts,
  }: {
    messenger: BalancesControllerMessenger;
    state: BalancesControllerState;
    listMultichainAccounts: () => InternalAccount[];
  }) {
    super({
      messenger,
      name: controllerName,
      metadata: balancesControllerMetadata,
      state: {
        ...defaultState,
        ...state,
      },
    });

    this.messagingSystem.subscribe(
      'AccountsController:stateChange',
      (newState) => this.#handleOnAccountsControllerChange(newState),
    );

    this.#listMultichainAccounts = listMultichainAccounts;
    this.#poller = new Poller(() => this.updateBalances(), BTC_AVG_BLOCK_TIME);
  }

  /**
   * Starts the polling process.
   */
  async start(): Promise<void> {
    this.#poller.start();
  }

  /**
   * Stops the polling process.
   */
  async stop(): Promise<void> {
    this.#poller.stop();
  }

  /**
   * Lists the accounts that we should get balances for.
   *
   * Currently, we only get balances for P2WPKH accounts, but this will change
   * in the future when we start support other non-EVM account types.
   *
   * @returns A list of accounts that we should get balances for.
   */
  async #listAccounts(): Promise<InternalAccount[]> {
    const accounts = this.#listMultichainAccounts();

    return accounts.filter((account) => account.type === BtcAccountType.P2wpkh);
  }

  /**
   * Updates the balances of all supported accounts. This method doesn't return
   * anything, but it updates the state of the controller.
   */
  async updateBalances() {
    const accounts = await this.#listAccounts();
    const partialState: BalancesControllerState = { balances: {} };

    for (const account of accounts) {
      if (account.metadata.snap) {
        partialState.balances[account.id] = await this.#getBalances(
          account.id,
          account.metadata.snap.id,
          isBtcMainnetAddress(account.address)
            ? BTC_MAINNET_ASSETS
            : BTC_TESTNET_ASSETS,
        );
      }
    }

    this.update((state: Draft<BalancesControllerState>) => ({
      ...state,
      ...partialState,
    }));
  }

  /**
   * Handles changes in the accounts state, specifically when new non-EVM accounts are added.
   *
   * @param newState - The new state of the accounts controller.
   */
  #handleOnAccountsControllerChange(newState: AccountsControllerState) {
    // If we have any new non-EVM accounts, we just update non-EVM balances
    const newNonEvmAccounts = Object.values(
      newState.internalAccounts.accounts,
    ).filter((account) => !isEvmAccountType(account.type));
    if (newNonEvmAccounts.length) {
      this.updateBalances();
    }
  }

  /**
   * Get the balances for an account.
   *
   * @param accountId - ID of the account to get balances for.
   * @param snapId - ID of the Snap which manages the account.
   * @param assetTypes - Array of asset types to get balances for.
   * @returns A map of asset types to balances.
   */
  async #getBalances(
    accountId: string,
    snapId: string,
    assetTypes: CaipAssetType[],
  ): Promise<Record<CaipAssetType, Balance>> {
    return await this.#getClient(snapId).getAccountBalances(
      accountId,
      assetTypes,
    );
  }

  /**
   * Gets a `KeyringClient` for a Snap.
   *
   * @param snapId - ID of the Snap to get the client for.
   * @returns A `KeyringClient` for the Snap.
   */
  #getClient(snapId: string): KeyringClient {
    return new KeyringClient({
      send: async (request: JsonRpcRequest) =>
        (await this.messagingSystem.call('SnapController:handleRequest', {
          snapId: snapId as SnapId,
          origin: 'metamask',
          handler: HandlerType.OnKeyringRequest,
          request,
        })) as Promise<Json>,
    });
  }
}
