import nanoid from 'nanoid';
import { MethodNames } from '@metamask/permission-controller';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from '../../lib/multichain-api/caip25permissions';
import {
  getEthAccounts,
  setEthAccounts,
} from '../../lib/multichain-api/adapters/caip-permission-adapter-eth-accounts';
import { setPermittedEthChainIds } from '../../lib/multichain-api/adapters/caip-permission-adapter-permittedChains';
import {
  CaveatTypes,
  RestrictedMethods,
} from '../../../../shared/constants/permissions';
import { PermissionNames } from './specifications';

export function getPermissionBackgroundApiMethods({
  permissionController,
  approvalController,
  networkController,
}) {
  // To add more than one account when already connected to the dapp
  const addMoreAccounts = (origin, accountOrAccounts) => {
    const accounts = Array.isArray(accountOrAccounts)
      ? accountOrAccounts
      : [accountOrAccounts];

    let caip25Caveat;
    try {
      caip25Caveat = permissionController.getCaveat(
        origin,
        Caip25EndowmentPermissionName,
        Caip25CaveatType,
      );
    } catch (err) {
      // noop
    }

    if (!caip25Caveat) {
      throw new Error('tried to add accounts when none have been permissioned'); // TODO: better error
    }

    const ethAccounts = getEthAccounts(caip25Caveat.value);

    const updatedEthAccounts = Array.from(
      new Set([...ethAccounts, ...accounts]),
    );

    const updatedCaveatValue = setEthAccounts(
      caip25Caveat.value,
      updatedEthAccounts,
    );

    permissionController.updateCaveat(
      origin,
      Caip25EndowmentPermissionName,
      Caip25CaveatType,
      updatedCaveatValue,
    );
  };

  return {
    addPermittedAccount: (origin, account) => addMoreAccounts(origin, account),

    addMorePermittedAccounts: (origin, accounts) =>
      addMoreAccounts(origin, accounts),

    removePermittedAccount: (origin, account) => {
      let caip25Caveat;
      try {
        caip25Caveat = permissionController.getCaveat(
          origin,
          Caip25EndowmentPermissionName,
          Caip25CaveatType,
        );
      } catch (err) {
        // noop
      }

      if (!caip25Caveat) {
        throw new Error(
          'tried to remove accounts when none have been permissioned',
        ); // TODO: better error
      }

      const existingAccounts = getEthAccounts(caip25Caveat.value);

      const remainingAccounts = existingAccounts.filter(
        (existingAccount) => existingAccount !== account,
      );

      if (remainingAccounts.length === existingAccounts.length) {
        return;
      }

      if (remainingAccounts.length === 0) {
        permissionController.revokePermission(
          origin,
          Caip25EndowmentPermissionName,
        );
      } else {
        const updatedCaveatValue = setEthAccounts(
          caip25Caveat.value,
          remainingAccounts,
        );
        permissionController.updateCaveat(
          origin,
          Caip25EndowmentPermissionName,
          Caip25CaveatType,
          updatedCaveatValue,
        );
      }
    },

    requestAccountsPermissionWithId: (origin) => {
      const { chainId } =
        networkController.getNetworkConfigurationByNetworkClientId(
          networkController.state.selectedNetworkClientId,
        );

      const id = nanoid();
      // NOTE: the eth_accounts/permittedChains approvals will be combined in the future.
      // Until they are actually combined, when testing, you must request both
      // eth_accounts and permittedChains together.
      approvalController
        .addAndShowApprovalRequest({
          id,
          origin,
          requestData: {
            metadata: {
              id,
              origin,
            },
            permissions: {
              [RestrictedMethods.eth_accounts]: {},
              [PermissionNames.permittedChains]: {
                caveats: [
                  {
                    type: CaveatTypes.restrictNetworkSwitching,
                    value: [chainId],
                  },
                ],
              },
            },
          },
          type: MethodNames.requestPermissions,
        })
        .then((legacyApproval) => {
          let caveatValue = {
            requiredScopes: {},
            optionalScopes: {},
            isMultichainOrigin: false,
          };
          caveatValue = setPermittedEthChainIds(
            caveatValue,
            legacyApproval.approvedChainIds,
          );

          caveatValue = setEthAccounts(
            caveatValue,
            legacyApproval.approvedAccounts,
          );

          permissionController.grantPermissions({
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
          });
        });

      return id;
    },
  };
}
