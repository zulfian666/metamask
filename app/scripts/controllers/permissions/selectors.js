import { createSelector } from 'reselect';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from '../../lib/multichain-api/caip25permissions';
import { getEthAccounts } from '../../lib/multichain-api/adapters/caip-permission-adapter-eth-accounts';

/**
 * This file contains selectors for PermissionController selector event
 * subscriptions, used to detect whenever a subject's accounts change so that
 * we can notify the subject via the `accountsChanged` provider event.
 */

/**
 * @param {Record<string, Record<string, unknown>>} state - The
 * PermissionController state.
 * @returns {Record<string, unknown>} The PermissionController subjects.
 */
const getSubjects = (state) => state.subjects;

/**
 * Get the permitted accounts for each subject, keyed by origin.
 * The values of the returned map are immutable values from the
 * PermissionController state.
 *
 * @returns {Map<string, string[]>} The current origin:accounts[] map.
 */
export const getPermittedAccountsByOrigin = createSelector(
  getSubjects,
  (subjects) => {
    return Object.values(subjects).reduce((originToAccountsMap, subject) => {
      const caveats =
        subject.permissions?.[Caip25EndowmentPermissionName]?.caveats || [];

      const caveat = caveats.find(({ type }) => type === Caip25CaveatType);

      if (caveat) {
        const ethAccounts = getEthAccounts(caveat.value);
        originToAccountsMap.set(subject.origin, ethAccounts);
      }
      return originToAccountsMap;
    }, new Map());
  },
);

/**
 * Get the authorized CAIP-25 scopes for each subject, keyed by origin.
 * The values of the returned map are immutable values from the
 * PermissionController state.
 *
 * @returns {Map<string, Caip25Authorization>} The current origin:authorization map.
 */
export const getAuthorizedScopesByOrigin = createSelector(
  getSubjects,
  (subjects) => {
    return Object.values(subjects).reduce(
      (originToAuthorizationsMap, subject) => {
        const caveats =
          subject.permissions?.[Caip25EndowmentPermissionName]?.caveats || [];

        const caveat = caveats.find(({ type }) => type === Caip25CaveatType);

        if (caveat) {
          originToAuthorizationsMap.set(subject.origin, caveat.value);
        }
        return originToAuthorizationsMap;
      },
      new Map(),
    );
  },
);

/**
 * Given the current and previous exposed accounts for each PermissionController
 * subject, returns a new map containing all accounts that have changed.
 * The values of each map must be immutable values directly from the
 * PermissionController state, or an empty array instantiated in this
 * function.
 *
 * @param {Map<string, string[]>} newAccountsMap - The new origin:accounts[] map.
 * @param {Map<string, string[]>} [previousAccountsMap] - The previous origin:accounts[] map.
 * @returns {Map<string, string[]>} The origin:accounts[] map of changed accounts.
 */
export const getChangedAccounts = (newAccountsMap, previousAccountsMap) => {
  if (previousAccountsMap === undefined) {
    return newAccountsMap;
  }

  const changedAccounts = new Map();
  if (newAccountsMap === previousAccountsMap) {
    return changedAccounts;
  }

  const newOrigins = new Set([...newAccountsMap.keys()]);

  for (const origin of previousAccountsMap.keys()) {
    const newAccounts = newAccountsMap.get(origin) ?? [];

    // The values of these maps are references to immutable values, which is why
    // a strict equality check is enough for diffing. The values are either from
    // PermissionController state, or an empty array initialized in the previous
    // call to this function. `newAccountsMap` will never contain any empty
    // arrays.
    if (previousAccountsMap.get(origin) !== newAccounts) {
      changedAccounts.set(origin, newAccounts);
    }

    newOrigins.delete(origin);
  }

  // By now, newOrigins is either empty or contains some number of previously
  // unencountered origins, and all of their accounts have "changed".
  for (const origin of newOrigins.keys()) {
    changedAccounts.set(origin, newAccountsMap.get(origin));
  }
  return changedAccounts;
};

/**
 * Given the current and previous exposed CAIP-25 authorization for each PermissionController
 * subject, returns a new map containing all authorizations that have changed.
 * The values of each map must be immutable values directly from the
 * PermissionController state, or an empty object instantiated in this
 * function.
 *
 * @param {Map<string, Caip25Authorization>} newAuthorizationsMap - The new origin:authorization map.
 * @param {Map<string, Caip25Authorization>} [previousAuthorizationsMap] - The previous origin:authorization map.
 * @returns {Map<string, Caip25Authorization>} The origin:authorization map of changed authorizations.
 */
export const getChangedAuthorizations = (
  newAuthorizationsMap,
  previousAuthorizationsMap,
) => {
  if (previousAuthorizationsMap === undefined) {
    return newAuthorizationsMap;
  }

  const changedAuthorizations = new Map();
  if (newAuthorizationsMap === previousAuthorizationsMap) {
    return changedAuthorizations;
  }

  const newOrigins = new Set([...newAuthorizationsMap.keys()]);

  for (const origin of previousAuthorizationsMap.keys()) {
    const newAuthorizations = newAuthorizationsMap.get(origin) ?? {
      requiredScopes: {},
      optionalScopes: {},
    };

    // The values of these maps are references to immutable values, which is why
    // a strict equality check is enough for diffing. The values are either from
    // PermissionController state, or an empty object initialized in the previous
    // call to this function. `newAuthorizationsMap` will never contain any empty
    // objects.
    if (previousAuthorizationsMap.get(origin) !== newAuthorizations) {
      changedAuthorizations.set(origin, newAuthorizations);
    }

    newOrigins.delete(origin);
  }

  // By now, newOrigins is either empty or contains some number of previously
  // unencountered origins, and all of their authorizations have "changed".
  for (const origin of newOrigins.keys()) {
    changedAuthorizations.set(origin, newAuthorizationsMap.get(origin));
  }
  return changedAuthorizations;
};

/**
 *
 * @param {Map<string, Caip25Authorization>} newAuthorizationsMap - The new origin:authorization map.
 * @param {Map<string, Caip25Authorization>} [previousAuthorizationsMap] - The previous origin:authorization map.
 * @returns {Map<string, Caip25Authorization>} The origin:authorization map of changed authorizations.
 */
export const getRemovedAuthorizations = (
  newAuthorizationsMap,
  previousAuthorizationsMap,
) => {
  const removedAuthorizations = new Map();

  // If there are no previous authorizations, there are no removed authorizations.
  // OR If the new authorizations map is the same as the previous authorizations map,
  // there are no removed authorizations
  if (
    previousAuthorizationsMap === undefined ||
    newAuthorizationsMap === previousAuthorizationsMap
  ) {
    return removedAuthorizations;
  }

  const previousOrigins = new Set([...previousAuthorizationsMap.keys()]);
  for (const origin of newAuthorizationsMap.keys()) {
    previousOrigins.delete(origin);
  }

  for (const origin of previousOrigins.keys()) {
    removedAuthorizations.set(origin, previousAuthorizationsMap.get(origin));
  }

  return removedAuthorizations;
};
