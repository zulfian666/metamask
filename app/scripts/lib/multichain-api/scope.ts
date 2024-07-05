import { toHex } from '@metamask/controller-utils';
import { InternalAccount } from '@metamask/keyring-api';
import { NetworkClientId } from '@metamask/network-controller';
import {
  CaipAccountId,
  CaipChainId,
  CaipReference,
  Hex,
  isCaipChainId,
  isCaipNamespace,
  parseCaipAccountId,
  parseCaipChainId,
} from '@metamask/utils';
import { isEqualCaseInsensitive } from '../../../../shared/modules/string-utils';

export type Scope = CaipChainId | CaipReference;

export type ScopeObject = {
  scopes?: CaipChainId[];
  methods: string[];
  notifications: string[];
  accounts?: CaipAccountId[];
  rpcDocuments?: string[];
  rpcEndpoints?: string[];
};

export type ScopesObject = Record<Scope, ScopeObject>;

export type Caip25Authorization =
  | {
      requiredScopes: ScopesObject;
      optionalScopes?: ScopesObject;
      sessionProperties?: Record<string, unknown>;
    }
  | ({
      requiredScopes?: ScopesObject;
      optionalScopes: ScopesObject;
    } & {
      sessionProperties?: Record<string, unknown>;
    });

const parseScopeString = (
  scopeString: string,
): {
  namespace?: string;
  reference?: string;
} => {
  if (isCaipNamespace(scopeString)) {
    return {
      namespace: scopeString,
    };
  }
  if (isCaipChainId(scopeString)) {
    return parseCaipChainId(scopeString);
  }

  return {};
};

// Make this an assert
export const isValidScope = (
  scopeString: string,
  scopeObject: ScopeObject,
): boolean => {
  const { namespace, reference } = parseScopeString(scopeString);

  if (!namespace && !reference) {
    return false;
  }

  const {
    scopes,
    methods,
    notifications,
    accounts,
    rpcDocuments,
    rpcEndpoints,
    ...restScopeObject
  } = scopeObject;

  // These assume that the namespace has a notion of chainIds
  if (reference && scopes && scopes.length > 0) {
    // TODO: Probably requires refactoring this helper a bit
    // When a badly-formed request includes a chainId mismatched to scope
    //   code = 5203
    //   message = "Scope/chain mismatch"
    // When a badly-formed request defines one chainId two ways
    //  code = 5204
    //  message = "ChainId defined in two different scopes"
    return false;
  }
  if (namespace && scopes) {
    const areScopesValid = scopes.every((scope) => {
      try {
        return parseCaipChainId(scope).namespace === namespace;
      } catch (e) {
        // parsing caipChainId failed
        console.log(e);
        return false;
      }
    });

    if (!areScopesValid) {
      return false;
    }
  }

  const areMethodsValid = methods.every(
    (method) => typeof method === 'string' && method !== '',
  );
  if (!areMethodsValid) {
    return false;
  }

  const areNotificationsValid = notifications.every(
    (notification) => typeof notification === 'string' && notification !== '',
  );
  if (!areNotificationsValid) {
    return false;
  }

  // Note we are not validating the chainId here, only the namespace
  const areAccountsValid = (accounts || []).every((account) => {
    try {
      return parseCaipAccountId(account).chain.namespace === namespace;
    } catch (e) {
      // parsing caipAccountId failed
      console.log(e);
      return false;
    }
  });

  if (!areAccountsValid) {
    return false;
  }
  // not validating rpcDocuments or rpcEndpoints currently

  // unexpected properties found on scopeObject
  if (Object.keys(restScopeObject).length !== 0) {
    return false;
  }

  return true;
};

// TODO: Needs to go into a capabilties/routing controller
export const isSupportedNotification = (notification: string): boolean => {
  return ['accountsChanged', 'chainChanged'].includes(notification);
};

// TODO: Remove this after bumping utils
enum KnownCaipNamespace {
  /** EIP-155 compatible chains. */
  Eip155 = 'eip155',
  Wallet = 'wallet', // Needs to be added to utils
}

export const isSupportedScopeString = (
  scopeString: string,
  findNetworkClientIdByChainId: (chainId: Hex) => NetworkClientId,
) => {
  const isNamespaceScoped = isCaipNamespace(scopeString);
  const isChainScoped = isCaipChainId(scopeString);

  if (isNamespaceScoped) {
    switch (scopeString) {
      case KnownCaipNamespace.Wallet:
        return true;
      case KnownCaipNamespace.Eip155:
        return true;
      default:
        return false;
    }
  }

  if (isChainScoped) {
    const { namespace, reference } = parseCaipChainId(scopeString);
    switch (namespace) {
      case KnownCaipNamespace.Eip155:
        try {
          findNetworkClientIdByChainId(toHex(reference));
          return true;
        } catch (err) {
          console.log(
            'failed to find network client that can serve chainId',
            err,
          );
        }
        return false;
      default:
        return false;
    }
  }

  return false;
};

export const isSupportedAccount = (
  account: CaipAccountId,
  getInternalAccounts: () => InternalAccount[],
) => {
  const {
    address,
    chain: { namespace },
  } = parseCaipAccountId(account);
  switch (namespace) {
    case KnownCaipNamespace.Eip155:
      try {
        return getInternalAccounts().some(
          (internalAccount) =>
            ['eip155:eoa', 'eip155:erc4337'].includes(internalAccount.type) &&
            isEqualCaseInsensitive(address, internalAccount.address),
        );
      } catch (err) {
        console.log('failed to check if account is supported by wallet', err);
      }
      return false;
    default:
      return false;
  }
};

/**
 * Flattens a ScopeString and ScopeObject into a separate
 * ScopeString and ScopeObject for each scope in the `scopes` value
 * if defined. Returns the ScopeString and ScopeObject unmodified if
 * it cannot be flattened
 *
 * @param scopeString - The string representing the scopeObject
 * @param scopeObject - The object that defines the scope
 * @returns a map of caipChainId to ScopeObjects
 */
export const flattenScope = (
  scopeString: string,
  scopeObject: ScopeObject,
): ScopesObject => {
  const isChainScoped = isCaipChainId(scopeString);

  if (isChainScoped) {
    return { [scopeString]: scopeObject };
  }

  // TODO: Either change `scopes` to `references` or do a namespace check here?
  // Do we need to handle the case where chain scoped is passed in with `scopes` defined too?

  const { scopes, ...restScopeObject } = scopeObject;
  const scopeMap: Record<CaipChainId, ScopeObject> = {};
  scopes?.forEach((scope) => {
    scopeMap[scope] = restScopeObject;
  });
  return scopeMap;
};

// DRY THIS
function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

export const mergeScopeObject = (
  // scopeStringA: CaipChainId,
  scopeObjectA: ScopeObject,
  // scopeStringB: CaipChainId,
  scopeObjectB: ScopeObject,
) => {
  // if (scopeStringA !== scopeStringB) {
  //   throw new Error('cannot merge ScopeObjects for different ScopeStrings')
  // }

  // TODO: Should we be verifying that these scopeStrings are flattened / the scopeObjects do not contain `scopes` array?

  const mergedScopeObject: ScopeObject = {
    methods: unique([...scopeObjectA.methods, ...scopeObjectB.methods]),
    notifications: unique([
      ...scopeObjectA.notifications,
      ...scopeObjectB.notifications,
    ]),
  };

  if (scopeObjectA.accounts || scopeObjectB.accounts) {
    mergedScopeObject.accounts = unique([
      ...(scopeObjectA.accounts ?? []),
      ...(scopeObjectB.accounts ?? []),
    ]);
  }

  if (scopeObjectA.rpcDocuments || scopeObjectB.rpcDocuments) {
    mergedScopeObject.rpcDocuments = unique([
      ...(scopeObjectA.rpcDocuments ?? []),
      ...(scopeObjectB.rpcDocuments ?? []),
    ]);
  }

  if (scopeObjectA.rpcEndpoints || scopeObjectB.rpcEndpoints) {
    mergedScopeObject.rpcEndpoints = unique([
      ...(scopeObjectA.rpcEndpoints ?? []),
      ...(scopeObjectB.rpcEndpoints ?? []),
    ]);
  }

  return mergedScopeObject;
};

export const mergeFlattenedScopes = (
  scopeA: Record<CaipChainId, ScopeObject>,
  scopeB: Record<CaipChainId, ScopeObject>,
): Record<CaipChainId, ScopeObject> => {
  const scope: Record<CaipChainId, ScopeObject> = {};

  Object.entries(scopeA).forEach(([_, { scopes }]) => {
    if (scopes) {
      throw new Error('unexpected `scopes` property');
    }
  });

  Object.entries(scopeB).forEach(([_, { scopes }]) => {
    if (scopes) {
      throw new Error('unexpected `scopes` property');
    }
  });

  Object.keys(scopeA).forEach((_scopeString: string) => {
    const scopeString = _scopeString as CaipChainId;
    const scopeObjectA = scopeA[scopeString];
    const scopeObjectB = scopeB[scopeString];

    if (scopeObjectA && scopeObjectB) {
      scope[scopeString] = mergeScopeObject(scopeObjectA, scopeObjectB);
    } else {
      scope[scopeString] = scopeObjectA;
    }
  });

  Object.keys(scopeB).forEach((_scopeString: string) => {
    const scopeString = _scopeString as CaipChainId;
    const scopeObjectA = scopeA[scopeString];
    const scopeObjectB = scopeB[scopeString];

    if (!scopeObjectA && scopeObjectB) {
      scope[scopeString] = scopeObjectB;
    }
  });

  return scope;
};
