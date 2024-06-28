import { numberToHex, parseCaipChainId } from '@metamask/utils';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from './caip25permissions';

export async function providerRequestHandler(
  request,
  _response,
  next,
  end,
  hooks,
) {
  const { scope, request: wrappedRequest } = request.params;

  const caveat = hooks.getCaveat(
    request.origin,
    Caip25EndowmentPermissionName,
    Caip25CaveatType,
  );
  if (!caveat) {
    return end(new Error('missing CAIP-25 endowment'));
  }

  // TODO: consider case when scope is defined in requireScopes and optionalScopes
  const scopeObject =
    caveat.value.requiredScopes[scope] || caveat.value.optionalScopes[scope];

  if (!scopeObject) {
    return end(new Error('unauthorized (scopeObject missing)'));
  }

  if (!scopeObject.methods.includes(wrappedRequest.method)) {
    return end(new Error('unauthorized (method missing in scopeObject)'));
  }

  // Do we need to try catch this?
  const { reference } = parseCaipChainId(scope);

  let networkClientId;
  networkClientId = hooks.findNetworkClientIdByChainId(
    numberToHex(parseInt(reference, 10)),
  );

  if (!networkClientId) {
    networkClientId = hooks.getSelectedNetworkClientId();
  }

  Object.assign(request, {
    networkClientId,
    method: wrappedRequest.method,
    params: wrappedRequest.params,
  });
  return next();
}