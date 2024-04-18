import { cloneDeep, isEmpty } from 'lodash';
import {
  TransactionMeta,
  TransactionStatus,
} from '@metamask/transaction-controller';

type VersionedData = {
  meta: { version: number };
  data: Record<string, unknown>;
};

export const version = 115;

// Target date is December 8, 2023 - 00:00:00 UTC
export const TARGET_DATE = new Date('2023-12-08T00:00:00Z').getTime();

/**
 * This migration sets the `status` to `failed` for all transactions created before December 8, 2023 that are still `approved` or `signed`.
 *
 * @param originalVersionedData
 */
export async function migrate(
  originalVersionedData: VersionedData,
): Promise<VersionedData> {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  transformState(versionedData.data);
  return versionedData;
}

// TODO: Replace `any` with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STUCK_STATES = [TransactionStatus.approved, TransactionStatus.signed];

function transformState(state: Record<string, any>) {
  const transactions = state?.TransactionController?.transactions ?? {};
  
  for (const tx of Object.values(transactions)) {
    if (
      tx.time < TARGET_DATE &&
      STUCK_STATES.includes(tx.status)
    ) {
      tx.status = TransactionStatus.failed;
    }
  }
}
