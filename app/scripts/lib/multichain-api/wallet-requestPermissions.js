import { pick } from 'lodash';
import { isPlainObject } from '@metamask/controller-utils';
import { invalidParams, MethodNames } from '@metamask/permission-controller';
import {
  CaveatTypes,
  RestrictedMethods,
} from '../../../../shared/constants/permissions';
import { PermissionNames } from '../../controllers/permissions';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from './caip25permissions';
import { setEthAccounts } from './adapters/caip-permission-adapter-eth-accounts';
import { setPermittedEthChainIds } from './adapters/caip-permission-adapter-permittedChains';

export const requestPermissionsHandler = {
  methodNames: [MethodNames.requestPermissions],
  implementation: requestPermissionsImplementation,
  hookNames: {
    requestPermissionsForOrigin: true,
    getPermissionsForOrigin: true,
    updateCaveat: true,
    grantPermissions: true,
    requestPermissionApprovalForOrigin: true,
    getAccounts: true,
    getNetworkConfigurationByNetworkClientId: true,
  },
};

/**
 * Request Permissions implementation to be used in JsonRpcEngine middleware.
 *
 * @param req - The JsonRpcEngine request
 * @param res - The JsonRpcEngine result object
 * @param _next - JsonRpcEngine next() callback - unused
 * @param end - JsonRpcEngine end() callback
 * @param options - Method hooks passed to the method implementation
 * @param options.requestPermissionsForOrigin - The specific method hook needed for this method implementation
 * @param options.getPermissionsForOrigin
 * @param options.updateCaveat
 * @param options.grantPermissions
 * @param options.requestPermissionApprovalForOrigin
 * @param options.getAccounts
 * @param options.getNetworkConfigurationByNetworkClientId
 * @returns A promise that resolves to nothing
 */
async function requestPermissionsImplementation(
  req,
  res,
  _next,
  end,
  {
    requestPermissionsForOrigin,
    getPermissionsForOrigin,
    updateCaveat,
    grantPermissions,
    requestPermissionApprovalForOrigin,
    getAccounts,
    getNetworkConfigurationByNetworkClientId,
  },
) {
  const { origin, params, networkClientId } = req;

  if (!Array.isArray(params) || !isPlainObject(params[0])) {
    return end(invalidParams({ data: { request: req } }));
  }

  const [requestedPermissions] = params;
  delete requestedPermissions[Caip25EndowmentPermissionName];

  const legacyRequestedPermissions = pick(requestedPermissions, [
    RestrictedMethods.eth_accounts,
    PermissionNames.permittedChains,
  ]);
  delete requestedPermissions[RestrictedMethods.eth_accounts];
  delete requestedPermissions[PermissionNames.permittedChains];

  // We manually handle eth_accounts and permittedChains permissions
  // by calling the ApprovalController rather than the PermissionController
  // because these two permissions do not actually exist in the Permssion
  // Specifications. Calling the PermissionController with them will
  // cause an error to be thrown. Instead, we will use the approval result
  // from the ApprovalController to form a CAIP-25 permission later.
  let legacyApproval;
  const haveLegacyPermissions =
    Object.keys(legacyRequestedPermissions).length > 0;
  if (haveLegacyPermissions) {
    if (!legacyRequestedPermissions[RestrictedMethods.eth_accounts]) {
      legacyRequestedPermissions[RestrictedMethods.eth_accounts] = {};
    }

    if (!legacyRequestedPermissions[PermissionNames.permittedChains]) {
      const { chainId } =
        getNetworkConfigurationByNetworkClientId(networkClientId);
      legacyRequestedPermissions[PermissionNames.permittedChains] = {
        caveats: [
          {
            type: CaveatTypes.restrictNetworkSwitching,
            value: [chainId],
          },
        ],
      };
    }

    legacyApproval = await requestPermissionApprovalForOrigin(
      legacyRequestedPermissions,
    );
  }

  let grantedPermissions = {};
  // Request permissions from the PermissionController for any permissions other
  // than eth_accounts and permittedChains in the params. If no permissions
  // are in the params, then request empty permissions from the PermissionController
  // to get an appropriate error to be returned to the dapp.
  if (
    (Object.keys(requestedPermissions).length === 0 &&
      !haveLegacyPermissions) ||
    Object.keys(requestedPermissions).length > 0
  ) {
    const [_grantedPermissions] = await requestPermissionsForOrigin(
      requestedPermissions,
    );
    // permissions are frozen and must be cloned before modified
    grantedPermissions = { ..._grantedPermissions };
  }

  if (legacyApproval) {
    // NOTE: the eth_accounts/permittedChains approvals will be combined in the future.
    // We assume that approvedAccounts and permittedChains are both defined here.
    // Until they are actually combined, when testing, you must request both
    // eth_accounts and permittedChains together.
    let caveatValue = {
      requiredScopes: {},
      optionalScopes: {},
      isMultichainOrigin: false,
    };
    caveatValue = setPermittedEthChainIds(
      caveatValue,
      legacyApproval.approvedChainIds,
    );

    caveatValue = setEthAccounts(caveatValue, legacyApproval.approvedAccounts);

    const permissions = getPermissionsForOrigin(origin) || {};
    let caip25Endowment = permissions[Caip25EndowmentPermissionName];
    const existingCaveat = caip25Endowment?.caveats.find(
      ({ type }) => type === Caip25CaveatType,
    );
    if (existingCaveat) {
      if (existingCaveat.value.isMultichainOrigin) {
        return end(
          new Error('cannot modify permission granted from multichain flow'),
        ); // TODO: better error
      }

      updateCaveat(
        origin,
        Caip25EndowmentPermissionName,
        Caip25CaveatType,
        caveatValue,
      );
    } else {
      caip25Endowment = grantPermissions({
        subject: { origin },
        approvedPermissions: {
          [Caip25EndowmentPermissionName]: {
            caveats: [
              {
                type: Caip25CaveatType,
                value: caveatValue,
              },
            ],
          },
        },
      })[Caip25EndowmentPermissionName];
    }

    // We cannot derive ethAccounts directly from the CAIP-25 permission
    // because the accounts will not be in order of lastSelected
    const ethAccounts = await getAccounts();

    grantedPermissions[RestrictedMethods.eth_accounts] = {
      ...caip25Endowment,
      parentCapability: RestrictedMethods.eth_accounts,
      caveats: [
        {
          type: CaveatTypes.restrictReturnedAccounts,
          value: ethAccounts,
        },
      ],
    };

    grantedPermissions[PermissionNames.permittedChains] = {
      ...caip25Endowment,
      parentCapability: PermissionNames.permittedChains,
      caveats: [
        {
          type: CaveatTypes.restrictNetworkSwitching,
          value: legacyApproval.approvedChainIds,
        },
      ],
    };
  }

  res.result = Object.values(grantedPermissions);
  return end();
}
