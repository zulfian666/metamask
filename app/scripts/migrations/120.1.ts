import { cloneDeep, isObject } from 'lodash';
import { hasProperty } from '@metamask/utils';

type VersionedData = {
  meta: { version: number };
  data: Record<string, unknown>;
};

export const version = 120.1;

/**
 * Add a default value for importTime in the InternalAccount
 *
 * @param originalVersionedData
 */
export async function migrate(
  originalVersionedData: VersionedData,
): Promise<VersionedData> {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  transformState(versionedData.data);
  return versionedData;
}

function transformState(
  state: Record<string, unknown>,
): Record<string, unknown> {
  // Existing users who do not have UserStorageController state.
  // Provide some initial state & nullify `isProfileSyncingEnabled`
  if (!hasProperty(state, 'UserStorageController')) {
    state.UserStorageController = {
      isProfileSyncingEnabled: null,
    };
    return state;
  }

  // Existing users who do have UserStorageController state.
  // nullify `isProfileSyncingEnabled`
  if (
    isObject(state.UserStorageController) &&
    hasProperty(state.UserStorageController, 'isProfileSyncingEnabled')
  ) {
    state.UserStorageController.isProfileSyncingEnabled = null;
    return state;
  }

  return state;
}
