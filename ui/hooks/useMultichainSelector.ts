import { useSelector, DefaultRootState } from 'react-redux';
import { InternalAccount } from '@metamask/keyring-api';
import {
  AccountsState,
  getSelectedInternalAccount,
} from '../selectors/accounts';

export function useMultichainSelector<
  TState = DefaultRootState,
  TSelected = unknown,
>(
  selector: (state: TState, account?: InternalAccount) => TSelected,
  account?: InternalAccount,
) {
  return useSelector((state: TState) => {
    // We either pass an account or fallback to the currently selected one
    return selector(
      state,
      account || getSelectedInternalAccount(state as AccountsState),
    );
  });
}
