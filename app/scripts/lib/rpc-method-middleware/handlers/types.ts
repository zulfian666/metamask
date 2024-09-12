import { OriginString } from '@metamask/permission-controller';
import { JsonRpcParams, JsonRpcRequest } from '@metamask/utils';

export type HandlerWrapper = {
  methodNames: [string] | string[];
  hookNames: Record<string, boolean>;
};

export type HandlerRequestType<Params extends JsonRpcParams = JsonRpcParams> =
  Required<JsonRpcRequest<Params>> & {
    origin: OriginString;
  };
