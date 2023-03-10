// TODO: Plan to deprecate this file once `processGetPlumeSignature` is added to eth-json-rpc-middleware
// https://github.com/MetaMask/eth-json-rpc-middleware/pull/198
import { ethErrors } from 'eth-rpc-errors';
import { createAsyncMiddleware } from 'json-rpc-engine';

export function createGetPlumeSignatureMiddleware({
  processGetPlumeSignature,
}) {
  return createAsyncMiddleware(async (req, res, next) => {
    if (!processGetPlumeSignature) {
      throw ethErrors.rpc.methodNotSupported();
    }
    const { method, params } = req;
    if (method !== 'eth_getPlumeSignature') {
      next();
      return;
    }
    const [data, from] = params;
    res.result = await processGetPlumeSignature({ data, from }, req);
  });
}
