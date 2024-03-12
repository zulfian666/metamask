import { NameType } from '@metamask/name-controller';
import { useSelector } from 'react-redux';
import { toChecksumAddress } from 'ethereumjs-util';
import { getMemoizedMetadataContractName } from '../selectors';
import { getNftContractsOnCurrentChain } from '../ducks/metamask/metamask';
import { useName } from './useName';
import { useFirstPartyContractName } from './useFirstPartyContractName';

/**
 * Attempts to resolve the name for the given parameters.
 *
 * @param value
 * @param type
 * @param variation
 * @returns An object with two properties:
 * - `name` {string|null} - The display name, if it can be resolved, otherwise null.
 * - `hasPetname` {boolean} - True if there is a petname for the given address.
 */
export function useDisplayName(
  value: string,
  type: NameType,
  variation?: string,
): { name: string | null; hasPetname: boolean } {
  const nameEntry = useName(value, type, variation);

  const firstPartyContractName = useFirstPartyContractName(
    value,
    type,
    variation,
  );

  const contractName = useSelector((state) =>
    (getMemoizedMetadataContractName as any)(state, value),
  );

  const watchedNftName = useSelector(getNftContractsOnCurrentChain)[
    toChecksumAddress(value)
  ]?.name;

  const name =
    nameEntry?.name ||
    firstPartyContractName ||
    contractName ||
    watchedNftName ||
    null;

  const hasPetname = Boolean(nameEntry?.name);

  return {
    name,
    hasPetname,
  };
}
