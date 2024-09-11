import { providerErrors } from '@metamask/rpc-errors';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from '../caip25permissions';
import { mergeScopes } from '../scope';

export async function CaipPermissionAdapterMiddleware(
  request,
  _response,
  next,
  end,
  hooks,
) {
  const { networkClientId, method } = request;

  let caveat;
  try {
    caveat = hooks.getCaveat(
      request.origin,
      Caip25EndowmentPermissionName,
      Caip25CaveatType,
    );
  } catch (err) {
    // noop
  }
  if (!caveat?.value.isMultichainOrigin) {
    return next();
  }

  const { chainId } =
    hooks.getNetworkConfigurationByNetworkClientId(networkClientId);

  const scope = `eip155:${parseInt(chainId, 16)}`;

  const scopeObject = mergeScopes(
    caveat.value.requiredScopes,
    caveat.value.optionalScopes,
  )[scope];

  if (!scopeObject?.methods?.includes(method)) {
    return end(providerErrors.unauthorized());
  }

  return next();
}
