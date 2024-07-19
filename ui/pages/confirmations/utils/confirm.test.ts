import { ApprovalRequest } from '@metamask/approval-controller';
import { ApprovalType } from '@metamask/controller-utils';
import { TransactionType } from '@metamask/transaction-controller';

import {
  isSignatureApprovalRequest,
  isSignatureTransactionType,
  parseSanitizeTypedDataMessage,
  parseTypedDataMessage,
} from './confirm';

const typedDataMsg =
  '{"domain":{"chainId":97,"name":"Ether Mail","verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC","version":"1"},"message":{"contents":"Hello, Bob!","from":{"name":"Cow","wallets":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF","0x06195827297c7A80a443b6894d3BDB8824b43896"]},"to":[{"name":"Bob","wallets":["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person[]"},{"name":"contents","type":"string"}],"Person":[{"name":"name","type":"string"},{"name":"wallets","type":"address[]"}]}}';

describe('confirm util', () => {
  describe('isSignatureApprovalRequest', () => {
    it('returns true for signature approval requests', () => {
      const result = isSignatureApprovalRequest({
        type: ApprovalType.PersonalSign,
        // TODO: Replace `any` with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as ApprovalRequest<any>);
      expect(result).toStrictEqual(true);
    });
    it('returns false for request not of type signature', () => {
      const result = isSignatureApprovalRequest({
        type: ApprovalType.Transaction,
        // TODO: Replace `any` with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as ApprovalRequest<any>);
      expect(result).toStrictEqual(false);
    });
  });

  describe('parseTypedDataMessage', () => {
    it('parses data passed correctly', () => {
      const result = parseTypedDataMessage('{"test": "dummy"}');
      expect(result.test).toBe('dummy');
    });
    it('throw error for invalid typedDataMessage', () => {
      expect(() => {
        parseSanitizeTypedDataMessage('');
      }).toThrow();
    });
  });

  describe('parseSanitizeTypedDataMessage', () => {
    it('parses and sanitizes data passed correctly', () => {
      const result = parseSanitizeTypedDataMessage(typedDataMsg);
      expect(result.sanitizedMessage.type).toBe('Mail');
      expect(result.primaryType).toBe('Mail');
    });
    it('throw error for invalid typedDataMessage', () => {
      expect(() => {
        parseSanitizeTypedDataMessage('{}');
      }).toThrow();
    });
  });

  describe('isSignatureTransactionType', () => {
    it('returns true for signature transaction requests', () => {
      const result = isSignatureTransactionType({
        type: TransactionType.personalSign,
      });
      expect(result).toStrictEqual(true);
    });
    it('returns false for request not of type signature', () => {
      const result = isSignatureTransactionType({
        type: TransactionType.contractInteraction,
      });
      expect(result).toStrictEqual(false);
    });
  });
});
