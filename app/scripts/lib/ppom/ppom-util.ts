import { PPOMController } from '@metamask/ppom-validator';
import {
  TransactionController,
  TransactionParams,
  normalizeTransactionParams,
} from '@metamask/transaction-controller';
import { Hex, JsonRpcRequest } from '@metamask/utils';
import { v4 as uuid } from 'uuid';
import { PPOM } from '@blockaid/ppom_release';
import { SignatureController } from '@metamask/signature-controller';
import {
  BlockaidReason,
  BlockaidResultType,
  SecurityAlertSource,
} from '../../../../shared/constants/security-provider';
import { SIGNING_METHODS } from '../../../../shared/constants/transaction';
import { AppStateController } from '../../controllers/app-state';
import { SecurityAlertResponse } from './types';
import {
  isSecurityAlertsAPIEnabled,
  validateWithSecurityAlertsAPI,
} from './security-alerts-api';

const { sentry } = global;

const METHOD_SEND_TRANSACTION = 'eth_sendTransaction';

const SECURITY_ALERT_RESPONSE_ERROR = {
  result_type: BlockaidResultType.Errored,
  reason: BlockaidReason.errored,
};

export async function validateRequestWithPPOM({
  ppomController,
  request,
  securityAlertId,
  chainId,
}: {
  ppomController: PPOMController;
  request: JsonRpcRequest;
  securityAlertId: string;
  chainId: Hex;
}): Promise<SecurityAlertResponse> {
  try {
    const normalizedRequest = normalizePPOMRequest(request);

    const ppomResponse = isSecurityAlertsAPIEnabled()
      ? await validateWithAPI(ppomController, chainId, normalizedRequest)
      : await validateWithController(ppomController, normalizedRequest);

    return {
      ...ppomResponse,
      securityAlertId,
    };
  } catch (error: unknown) {
    return handlePPOMError(error, 'Error validating JSON RPC using PPOM: ');
  }
}

export function generateSecurityAlertId(): string {
  return uuid();
}

export async function updateSecurityAlertResponse({
  appStateController,
  method,
  securityAlertId,
  securityAlertResponse,
  signatureController,
  transactionController,
}: {
  appStateController: AppStateController;
  method: string;
  securityAlertId: string;
  securityAlertResponse: SecurityAlertResponse;
  signatureController: SignatureController;
  transactionController: TransactionController;
}) {
  const isSignatureRequest = SIGNING_METHODS.includes(method);

  const confirmation = await findConfirmationBySecurityAlertId(
    securityAlertId,
    method,
    signatureController,
    transactionController,
  );

  if (isSignatureRequest) {
    appStateController.addSignatureSecurityAlertResponse(securityAlertResponse);
  } else {
    transactionController.updateSecurityAlertResponse(
      confirmation.id,
      securityAlertResponse,
    );
  }
}

export function handlePPOMError(
  error: unknown,
  logMessage: string,
): SecurityAlertResponse {
  const errorData = getErrorData(error);
  const description = getErrorMessage(error);

  sentry?.captureException(error);
  console.error(logMessage, errorData);

  return {
    ...SECURITY_ALERT_RESPONSE_ERROR,
    description,
  };
}

function normalizePPOMRequest(request: JsonRpcRequest): JsonRpcRequest {
  if (request.method !== METHOD_SEND_TRANSACTION) {
    return request;
  }

  const transactionParams = (request.params?.[0] || {}) as TransactionParams;
  const normalizedParams = normalizeTransactionParams(transactionParams);

  return {
    ...request,
    params: [normalizedParams],
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return JSON.stringify(error);
}

function getErrorData(error: unknown) {
  if (typeof error === 'object' || typeof error === 'string') {
    return error;
  }

  return JSON.stringify(error);
}

async function findConfirmationBySecurityAlertId(
  securityAlertId: string,
  method: string,
  signatureController: SignatureController,
  transactionController: TransactionController,
) {
  const isSignatureRequest = SIGNING_METHODS.includes(method);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let confirmation;

    if (isSignatureRequest) {
      confirmation = Object.values(signatureController.messages).find(
        (message) =>
          message.securityAlertResponse?.securityAlertId === securityAlertId,
      );
    } else {
      confirmation = transactionController.state.transactions.find(
        (meta) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (meta.securityAlertResponse as any)?.securityAlertId ===
          securityAlertId,
      );
    }

    if (confirmation) {
      return confirmation;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function validateWithController(
  ppomController: PPOMController,
  request: JsonRpcRequest,
): Promise<SecurityAlertResponse> {
  const response = (await ppomController.usePPOM((ppom: PPOM) =>
    ppom.validateJsonRpc(request),
  )) as SecurityAlertResponse;

  return {
    ...response,
    source: SecurityAlertSource.Local,
  };
}

async function validateWithAPI(
  ppomController: PPOMController,
  chainId: string,
  request: JsonRpcRequest,
): Promise<SecurityAlertResponse> {
  try {
    const response = await validateWithSecurityAlertsAPI(chainId, request);

    return {
      ...response,
      source: SecurityAlertSource.API,
    };
  } catch (error: unknown) {
    handlePPOMError(error, `Error validating request with security alerts API`);
    return await validateWithController(ppomController, request);
  }
}
