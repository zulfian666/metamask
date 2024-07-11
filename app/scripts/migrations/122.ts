import { cloneDeep } from 'lodash';

type VersionedData = {
  meta: { version: number };
  data: Record<string, unknown>;
};

export const version = 122;

/**
 * This migration sets the preference `showConfirmationAdvancedDetails` to
 * `true` if the user has enabled `useNonceField` or `sendHexData`.
 *
 * @param originalVersionedData - Versioned MetaMask extension state, exactly
 * what we persist to dist.
 * @param originalVersionedData.meta - State metadata.
 * @param originalVersionedData.meta.version - The current state version.
 * @param originalVersionedData.data - The persisted MetaMask state, keyed by
 * controller.
 * @returns Updated versioned MetaMask extension state.
 */
export async function migrate(
  originalVersionedData: VersionedData,
): Promise<VersionedData> {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  transformState(versionedData.data);
  return versionedData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformState(state: Record<string, any>) {
  const preferencesState = state?.PreferencesController?.preferences;
  if (!preferencesState) {
    return state;
  }

  const isCustomNonceFieldEnabled = state?.PreferencesController?.useNonceField;
  const isHexDataVisibilityEnabled =
    state?.PreferencesController?.featureFlags?.sendHexData;

  preferencesState.showConfirmationAdvancedDetails =
    isCustomNonceFieldEnabled || isHexDataVisibilityEnabled;

  return state;
}
