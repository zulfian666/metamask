import { cloneDeep } from 'lodash';
import {
  hasProperty,
  isObject,
  RuntimeObject,
} from '@metamask/utils';
import nanoid from 'nanoid';
import log from 'loglevel';
import type {
  PermissionConstraint,
  PermissionControllerSubjects,
} from '@metamask/permission-controller';
import { SnapEndowments } from '@metamask/snaps-rpc-methods';
import { CaveatFactories, PermissionNames } from '../controllers/permissions';
import { CaveatTypes } from '../../../shared/constants/permissions';
import { BUILT_IN_NETWORKS } from '../../../shared/constants/network';

type GenericPermissionControllerSubject = PermissionControllerSubjects<PermissionConstraint>[string];

export const version = 126;

/**
 * This migration adds the `permittedChains` permission to all Snaps that have
 * the `endowment:ethereum-provider` permission, and sets the selected chain ID
 * for each Snap to the current selected network chain ID.
 *
 * This is necessary following the Amon Hen v2 changes to the network controller
 * and other related controllers, as the `permittedChains` permission is now
 * required to use the Ethereum provider and switch networks.
 *
 * To simplify the use for Snaps, we automatically add the `permittedChains`
 * permission with the current selected network chain ID to all Snaps that have
 * the `endowment:ethereum-provider` permission.
 *
 * @param originalVersionedData - Versioned MetaMask extension state, exactly what we persist to dist.
 * @param originalVersionedData.meta - State metadata.
 * @param originalVersionedData.meta.version - The current state version.
 * @param originalVersionedData.data - The persisted MetaMask state, keyed by controller.
 * @returns Updated versioned MetaMask extension state.
 */
export async function migrate(originalVersionedData: {
  meta: { version: number };
  data: Record<string, unknown>;
}) {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  versionedData.data = transformState(versionedData.data);
  return versionedData;
}

/**
 * Get the chain ID for the current selected network client ID (i.e., `mainnet`)
 * from the network controller state.
 *
 * If the chain ID is not found, the default chain ID `0x1` (Ethereum mainnet)
 * is returned.
 *
 * @param networkControllerState - The network controller state.
 * @returns The chain ID.
 */
function getChainId(networkControllerState: RuntimeObject) {
  const { selectedNetworkClientId, networkConfigurations } = networkControllerState;

  if (typeof selectedNetworkClientId !== 'string' || !isObject(networkConfigurations)) {
    return '0x1';
  }

  if (hasProperty(networkConfigurations, selectedNetworkClientId)) {
    const networkConfiguration = networkConfigurations[selectedNetworkClientId];
    if (isObject(networkConfiguration) && typeof networkConfiguration.chainId === 'string') {
      return networkConfiguration.chainId;
    }
  }

  return BUILT_IN_NETWORKS[selectedNetworkClientId as keyof typeof BUILT_IN_NETWORKS]?.chainId ?? '0x1';
}

/**
 * Transform the MetaMask extension state to add the `permittedChains`
 * permission to all Snaps that have the `endowment:ethereum-provider`
 * permission.
 *
 * If the `NetworkController`, `PermissionController`, or
 * `SelectedNetworkController` state is not found or is not an object, the state
 * is returned as-is.
 *
 * @param state - The MetaMask extension state.
 * @returns The updated MetaMask extension state.
 */
function transformState(state: Record<string, unknown>) {
  const { NetworkController: networkControllerState, PermissionController: permissionControllerState, SelectedNetworkController: selectedNetworkControllerState } = state;

  if (!networkControllerState || !isObject(networkControllerState)) {
    log.warn('Skipping migration: `NetworkController` state not found or is not an object.');
    return state;
  }

  if (!permissionControllerState || !isObject(permissionControllerState)) {
    log.warn('Skipping migration: `PermissionController` state not found or is not an object.');
    return state;
  }

  if (!isObject(permissionControllerState.subjects)) {
    log.warn('Skipping migration: `PermissionController.subjects` state is not an object.');
    return state;
  }

  if (!selectedNetworkControllerState || !isObject(selectedNetworkControllerState)) {
    log.warn('Skipping migration: `SelectedNetworkController` state not found or is not an object.');
    return state;
  }

  if (!isObject(selectedNetworkControllerState.domains)) {
    log.warn('Skipping migration: `SelectedNetworkController.domains` state is not an object.');
    return state;
  }

  const { selectedNetworkClientId } = networkControllerState;
  if (typeof selectedNetworkClientId !== 'string') {
    log.warn('Skipping migration: `NetworkController.selectedNetworkClientId` is not a string.');
    return state;
  }

  const currentChainId = getChainId(networkControllerState);
  const updatedSubjects: string[] = [];

  // Add permission to use the current globally selected network to all Snaps
  // that have the `endowment:ethereum-provider` permission.
  const entries = Object.entries(permissionControllerState.subjects) as [string, GenericPermissionControllerSubject][];
  permissionControllerState.subjects = entries.reduce<PermissionControllerSubjects<PermissionConstraint>>((accumulator, [key, subject]) => {
    const permissionKeys = Object.keys(subject.permissions);
    const needsMigration = permissionKeys.includes(SnapEndowments.EthereumProvider) && !permissionKeys.includes(PermissionNames.permittedChains);
    if (!needsMigration) {
      return accumulator;
    }

    updatedSubjects.push(key);

    const newSubject: GenericPermissionControllerSubject = {
      ...subject,
      permissions: {
        ...subject.permissions,
        [PermissionNames.permittedChains]: {
          caveats: [
            CaveatFactories[CaveatTypes.restrictNetworkSwitching](
              [currentChainId],
            )
          ],
          date: Date.now(),
          id: nanoid(),
          invoker: key,
          parentCapability: PermissionNames.permittedChains,
        },
      }
    }

    return {
      ...accumulator,
      [key]: newSubject
    }
  }, {});

  // Update the selected network controller state to include the current chain
  // ID for each Snap.
  const currentDomains = selectedNetworkControllerState.domains;
  const domains = Object.fromEntries(updatedSubjects.map((subject) => [subject, selectedNetworkClientId]));
  selectedNetworkControllerState.domains = {
    ...currentDomains,
    ...domains,
  };

  return state;
}
