import { cloneDeep } from 'lodash';
import { isObject } from '@metamask/utils';
import nanoid from 'nanoid';
import log from 'loglevel';
import type {
  PermissionConstraint,
  PermissionControllerSubjects,
} from '@metamask/permission-controller';
import { SnapEndowments } from '@metamask/snaps-rpc-methods';
import { CaveatFactories, PermissionNames } from '../controllers/permissions';
import { CaveatTypes } from '../../../shared/constants/permissions.ts';

type GenericPermissionControllerSubject = PermissionControllerSubjects<PermissionConstraint>[string];

export const version = 0;

/**
 * Explain the purpose of the migration here.
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

function transformState(state: Record<string, unknown>) {
  const { NetworkController: networkControllerState, PermissionController: permissionControllerState, SelectedNetworkController: selectedNetworkControllerState } = state;
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

  // TODO: Get this from the network controller.
  const currentChainId = '0x1';

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

  const currentDomains = selectedNetworkControllerState.domains;
  const domains = Object.fromEntries(updatedSubjects.map((subject) => [subject, 'mainnet']));
  selectedNetworkControllerState.domains = {
    ...currentDomains,
    ...domains,
  };

  return state;
}
