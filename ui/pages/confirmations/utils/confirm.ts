import { ApprovalRequest } from '@metamask/approval-controller';
import { ApprovalType } from '@metamask/controller-utils';
import { TransactionType } from '@metamask/transaction-controller';
import { Json } from '@metamask/utils';

import { EIP712_PRIMARY_TYPE_PERMIT } from '../../../../shared/constants/transaction';
import { parseTypedDataMessage } from '../../../../shared/modules/transaction.utils';
import { sanitizeMessage } from '../../../helpers/utils/util';
import { SignatureRequestType } from '../types/confirm';
import { TYPED_SIGNATURE_VERSIONS } from '../constants';

export const REDESIGN_APPROVAL_TYPES = [
  ApprovalType.EthSignTypedData,
  ApprovalType.PersonalSign,
];

export const REDESIGN_TRANSACTION_TYPES = [
  ...(process.env.ENABLE_CONFIRMATION_REDESIGN
    ? [TransactionType.contractInteraction]
    : []),
] as const;

const SIGNATURE_APPROVAL_TYPES = [
  ApprovalType.EthSign,
  ApprovalType.PersonalSign,
  ApprovalType.EthSignTypedData,
];

export const isSignatureApprovalRequest = (
  request: ApprovalRequest<Record<string, Json>>,
) => SIGNATURE_APPROVAL_TYPES.includes(request.type as ApprovalType);

export const SIGNATURE_TRANSACTION_TYPES = [
  TransactionType.personalSign,
  TransactionType.signTypedData,
];

export const isSignatureTransactionType = (request?: Record<string, unknown>) =>
  request &&
  SIGNATURE_TRANSACTION_TYPES.includes(request.type as TransactionType);

export const parseSanitizeTypedDataMessage = (dataToParse: string) => {
  const { message, primaryType, types } = parseTypedDataMessage(dataToParse);
  const sanitizedMessage = sanitizeMessage(message, primaryType, types);
  return { sanitizedMessage, primaryType };
};

export const isSIWESignatureRequest = (request: SignatureRequestType) =>
  Boolean(request?.msgParams?.siwe?.isSIWEMessage);

export const isPermitSignatureRequest = (request: SignatureRequestType) => {
  if (
    !request ||
    !isSignatureTransactionType(request) ||
    request.type !== 'eth_signTypedData' ||
    request.msgParams?.version?.toUpperCase() === TYPED_SIGNATURE_VERSIONS.V1
  ) {
    return false;
  }
  const { primaryType } = parseTypedDataMessage(
    request.msgParams?.data as string,
  );
  return primaryType === EIP712_PRIMARY_TYPE_PERMIT;
};
