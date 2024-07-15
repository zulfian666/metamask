import { AccountsController } from '@metamask/accounts-controller';
import { PPOMController } from '@metamask/ppom-validator';
import { NetworkController } from '@metamask/network-controller';
import {
  Json,
  JsonRpcParams,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@metamask/utils';
import { detectSIWE } from '@metamask/controller-utils';

import { MESSAGE_TYPE } from '../../../../shared/constants/app';
import { SIGNING_METHODS } from '../../../../shared/constants/transaction';
import { PreferencesController } from '../../controllers/preferences';
import { AppStateController } from '../../controllers/app-state';
import {
  LOADING_SECURITY_ALERT_RESPONSE,
  SECURITY_PROVIDER_SUPPORTED_CHAIN_IDS,
} from '../../../../shared/constants/security-provider';
import {
  generateSecurityAlertId,
  handlePPOMError,
  validateRequestWithPPOM,
} from './ppom-util';
import { SecurityAlertResponse } from './types';

const CONFIRMATION_METHODS = Object.freeze([
  'eth_sendRawTransaction',
  'eth_sendTransaction',
  ...SIGNING_METHODS,
]);

/**
 * Middleware function that handles JSON RPC requests.
 * This function will be called for every JSON RPC request.
 * It will call the PPOM to check if the request is malicious or benign.
 * If the request is benign, it will be forwarded to the next middleware.
 * If the request is malicious or warning, it will trigger the PPOM alert dialog,
 * after the user has confirmed or rejected the request,
 * the request will be forwarded to the next middleware, together with the PPOM response.
 *
 * @param ppomController - Instance of PPOMController.
 * @param preferencesController - Instance of PreferenceController.
 * @param networkController - Instance of NetworkController.
 * @param appStateController
 * @param accountsController - Instance of AccountsController.
 * @param updateSecurityAlertResponse
 * @returns PPOMMiddleware function.
 */
export function createPPOMMiddleware<
  Params extends JsonRpcParams,
  Result extends Json,
>(
  ppomController: PPOMController,
  preferencesController: PreferencesController,
  networkController: NetworkController,
  appStateController: AppStateController,
  accountsController: AccountsController,
  updateSecurityAlertResponse: (
    method: string,
    signatureAlertId: string,
    securityAlertResponse: SecurityAlertResponse,
  ) => void,
) {
  return async (
    req: JsonRpcRequest<Params>,
    _res: JsonRpcResponse<Result>,
    next: () => void,
  ) => {
    try {
      const securityAlertsEnabled =
        preferencesController.store.getState()?.securityAlertsEnabled;

      const { chainId } = networkController.state.providerConfig;

      if (
        !securityAlertsEnabled ||
        !CONFIRMATION_METHODS.includes(req.method) ||
        !SECURITY_PROVIDER_SUPPORTED_CHAIN_IDS.includes(chainId)
      ) {
        return;
      }

      const { isSIWEMessage } = detectSIWE({ data: req?.params?.[0] });
      if (isSIWEMessage) {
        return;
      }

      if (req.method === MESSAGE_TYPE.ETH_SEND_TRANSACTION) {
        const { to: toAddress } = req?.params?.[0] ?? {};
        const internalAccounts = accountsController.listAccounts();
        const isToInternalAccount = internalAccounts.some(
          ({ address }) => address?.toLowerCase() === toAddress?.toLowerCase(),
        );
        if (isToInternalAccount) {
          return;
        }
      }

      const securityAlertId = generateSecurityAlertId();

      validateRequestWithPPOM({
        ppomController,
        request: req,
        securityAlertId,
        chainId,
      }).then((securityAlertResponse) => {
        updateSecurityAlertResponse(
          req.method,
          securityAlertId,
          securityAlertResponse,
        );
      });

      const loadingSecurityAlertResponse: SecurityAlertResponse = {
        ...LOADING_SECURITY_ALERT_RESPONSE,
        securityAlertId,
      };

      if (SIGNING_METHODS.includes(req.method)) {
        appStateController.addSignatureSecurityAlertResponse(
          loadingSecurityAlertResponse,
        );
      }

      req.securityAlertResponse = loadingSecurityAlertResponse;
    } catch (error) {
      req.securityAlertResponse = handlePPOMError(
        error,
        'Error createPPOMMiddleware: ',
      );
    } finally {
      next();
    }
  };
}
