/* eslint-disable @typescript-eslint/no-explicit-any */
import { PPOMController } from '@metamask/ppom-validator';
import { PPOM } from '@blockaid/ppom_release';
import {
  TransactionController,
  TransactionParams,
  normalizeTransactionParams,
} from '@metamask/transaction-controller';
import { SignatureController } from '@metamask/signature-controller';
import { Message } from '@metamask/message-manager';
import {
  BlockaidReason,
  BlockaidResultType,
} from '../../../../shared/constants/security-provider';
import { AppStateController } from '../../controllers/app-state';
import {
  generateSecurityAlertId,
  updateSecurityAlertResponse,
  validateRequestWithPPOM,
} from './ppom-util';
import { SecurityAlertResponse } from './types';

jest.mock('@metamask/transaction-controller', () => ({
  ...jest.requireActual('@metamask/transaction-controller'),
  normalizeTransactionParams: jest.fn(),
}));

const SECURITY_ALERT_ID_MOCK = '1234-5678';
const TRANSACTION_ID_MOCK = '123';

const REQUEST_MOCK = {
  method: 'eth_signTypedData_v4',
  params: [],
};

const SECURITY_ALERT_RESPONSE_MOCK: SecurityAlertResponse = {
  result_type: 'success',
  reason: 'success',
};

const TRANSACTION_PARAMS_MOCK_1: TransactionParams = {
  to: '0x123',
  from: '0x123',
  value: '0x123',
};

const TRANSACTION_PARAMS_MOCK_2: TransactionParams = {
  ...TRANSACTION_PARAMS_MOCK_1,
  to: '0x456',
};

function createPPOMMock() {
  return {
    validateJsonRpc: jest.fn(),
  } as unknown as jest.Mocked<PPOM>;
}

function createPPOMControllerMock() {
  return {
    usePPOM: jest.fn(),
  } as unknown as jest.Mocked<PPOMController>;
}

function createErrorMock() {
  const error = new Error('Test error message');
  error.name = 'Test Error';

  return error;
}

function createAppStateControllerMock() {
  return {
    addSignatureSecurityAlertResponse: jest.fn(),
  } as unknown as jest.Mocked<AppStateController>;
}

function createSignatureControllerMock(
  messages: SignatureController['messages'],
) {
  return {
    messages,
  } as unknown as jest.Mocked<SignatureController>;
}

function createTransactionControllerMock(
  state: TransactionController['state'],
) {
  return {
    state,
    updateSecurityAlertResponse: jest.fn(),
  } as unknown as jest.Mocked<TransactionController>;
}

describe('PPOM Utils', () => {
  const normalizeTransactionParamsMock = jest.mocked(
    normalizeTransactionParams,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  describe('validateRequestWithPPOM', () => {
    it('returns response from validation with PPOM instance via controller', async () => {
      const ppom = createPPOMMock();
      const ppomController = createPPOMControllerMock();

      ppom.validateJsonRpc.mockResolvedValue(SECURITY_ALERT_RESPONSE_MOCK);

      ppomController.usePPOM.mockImplementation(
        (callback) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback(ppom as any) as any,
      );

      const response = await validateRequestWithPPOM({
        ppomController,
        request: REQUEST_MOCK,
        securityAlertId: SECURITY_ALERT_ID_MOCK,
      });

      expect(response).toStrictEqual({
        ...SECURITY_ALERT_RESPONSE_MOCK,
        securityAlertId: SECURITY_ALERT_ID_MOCK,
      });

      expect(ppom.validateJsonRpc).toHaveBeenCalledTimes(1);
      expect(ppom.validateJsonRpc).toHaveBeenCalledWith(REQUEST_MOCK);
    });

    it('returns error response if validation with PPOM instance throws', async () => {
      const ppom = createPPOMMock();
      const ppomController = createPPOMControllerMock();

      ppom.validateJsonRpc.mockRejectedValue(createErrorMock());

      ppomController.usePPOM.mockImplementation(
        (callback) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback(ppom as any) as any,
      );

      const response = await validateRequestWithPPOM({
        ppomController,
        request: REQUEST_MOCK,
        securityAlertId: SECURITY_ALERT_ID_MOCK,
      });

      expect(response).toStrictEqual({
        result_type: BlockaidResultType.Errored,
        reason: BlockaidReason.errored,
        description: 'Test Error: Test error message',
      });
    });

    it('returns error response if controller throws', async () => {
      const ppomController = createPPOMControllerMock();

      ppomController.usePPOM.mockRejectedValue(createErrorMock());

      const response = await validateRequestWithPPOM({
        ppomController,
        request: REQUEST_MOCK,
        securityAlertId: SECURITY_ALERT_ID_MOCK,
      });

      expect(response).toStrictEqual({
        result_type: BlockaidResultType.Errored,
        reason: BlockaidReason.errored,
        description: 'Test Error: Test error message',
      });
    });

    it('normalizes request if method is eth_sendTransaction', async () => {
      const ppom = createPPOMMock();
      const ppomController = createPPOMControllerMock();

      ppomController.usePPOM.mockImplementation(
        (callback) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback(ppom as any) as any,
      );

      normalizeTransactionParamsMock.mockReturnValue(TRANSACTION_PARAMS_MOCK_2);

      const request = {
        ...REQUEST_MOCK,
        method: 'eth_sendTransaction',
        params: [TRANSACTION_PARAMS_MOCK_1],
      };

      await validateRequestWithPPOM({
        ppomController,
        request,
        securityAlertId: SECURITY_ALERT_ID_MOCK,
      });

      expect(ppom.validateJsonRpc).toHaveBeenCalledTimes(1);
      expect(ppom.validateJsonRpc).toHaveBeenCalledWith({
        ...request,
        params: [TRANSACTION_PARAMS_MOCK_2],
      });

      expect(normalizeTransactionParamsMock).toHaveBeenCalledTimes(1);
      expect(normalizeTransactionParamsMock).toHaveBeenCalledWith(
        TRANSACTION_PARAMS_MOCK_1,
      );
    });
  });

  describe('generateSecurityAlertId', () => {
    it('returns uuid', () => {
      const securityAlertId = generateSecurityAlertId();

      expect(securityAlertId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u,
      );
    });
  });

  describe('updateSecurityAlertResponse', () => {
    it('adds response to app state controller if matching message found', async () => {
      const appStateController = createAppStateControllerMock();

      const signatureController = createSignatureControllerMock({
        '123': {
          securityAlertResponse: {
            ...SECURITY_ALERT_RESPONSE_MOCK,
            securityAlertId: SECURITY_ALERT_ID_MOCK,
          },
        } as unknown as Message,
      });

      await updateSecurityAlertResponse({
        appStateController,
        method: 'eth_signTypedData_v4',
        securityAlertId: SECURITY_ALERT_ID_MOCK,
        securityAlertResponse: SECURITY_ALERT_RESPONSE_MOCK,
        signatureController,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionController: {} as any,
      });

      expect(
        appStateController.addSignatureSecurityAlertResponse,
      ).toHaveBeenCalledTimes(1);

      expect(
        appStateController.addSignatureSecurityAlertResponse,
      ).toHaveBeenCalledWith(SECURITY_ALERT_RESPONSE_MOCK);
    });

    it('adds response to transaction controller if matching transaction found', async () => {
      const transactionController = createTransactionControllerMock({
        transactions: [
          {
            id: TRANSACTION_ID_MOCK,
            securityAlertResponse: {
              securityAlertId: SECURITY_ALERT_ID_MOCK,
            },
          },
        ],
      } as any);

      await updateSecurityAlertResponse({
        appStateController: {} as any,
        method: 'eth_sendTransaction',
        securityAlertId: SECURITY_ALERT_ID_MOCK,
        securityAlertResponse: SECURITY_ALERT_RESPONSE_MOCK,
        signatureController: {} as any,
        transactionController,
      });

      expect(
        transactionController.updateSecurityAlertResponse,
      ).toHaveBeenCalledTimes(1);

      expect(
        transactionController.updateSecurityAlertResponse,
      ).toHaveBeenCalledWith(TRANSACTION_ID_MOCK, SECURITY_ALERT_RESPONSE_MOCK);
    });
  });
});
