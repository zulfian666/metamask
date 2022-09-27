import { connect } from 'react-redux';
import {
  getAddressBook,
  getAddressBookEntry,
  getMetaMaskAccountsOrdered,
} from '../../../../selectors';

import {
  updateRecipient,
  updateRecipientUserInput,
  useMyAccountsForRecipientSearch,
  useContactListForRecipientSearch,
  getIsUsingMyAccountForRecipientSearch,
  getRecipientUserInput,
  getRecipient,
  addHistoryEntry,
} from '../../../../ducks/send';
import {
<<<<<<< HEAD
  getDomainResolution,
  getDomainError,
  getDomainWarning,
} from '../../../../ducks/domains';
=======
  getDomainError,
  getDomainWarning,
  getDomainResolution,
} from '../../../../ducks/domain';
>>>>>>> 1f8b43e69 (combines UNS and ENS basic resolution into one module and generalizes their state to domains rather than their individual names)
import AddRecipient from './add-recipient.component';

export default connect(mapStateToProps, mapDispatchToProps)(AddRecipient);

function mapStateToProps(state) {
  const domainResolution = getDomainResolution(state);
  let addressBookEntryName = '';
<<<<<<< HEAD
  if (ensResolution) {
    const addressBookEntry = getAddressBookEntry(state, ensResolution) || {};
=======
  if (domainResolution) {
    const addressBookEntry = getAddressBookEntry(state, domainResolution) || {};
>>>>>>> 1f8b43e69 (combines UNS and ENS basic resolution into one module and generalizes their state to domains rather than their individual names)
    addressBookEntryName = addressBookEntry.name;
  }

  const addressBook = getAddressBook(state);

  const ownedAccounts = getMetaMaskAccountsOrdered(state);

  return {
    addressBook,
    addressBookEntryName,
    contacts: addressBook.filter(({ name }) => Boolean(name)),
    domainResolution,
    domainError: getDomainError(state),
    domainWarning: getDomainWarning(state),
    nonContacts: addressBook.filter(({ name }) => !name),
    ownedAccounts,
    isUsingMyAccountsForRecipientSearch:
      getIsUsingMyAccountForRecipientSearch(state),
    userInput: getRecipientUserInput(state),
    recipient: getRecipient(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addHistoryEntry: (entry) => dispatch(addHistoryEntry(entry)),
    updateRecipient: ({ address, nickname }) =>
      dispatch(updateRecipient({ address, nickname })),
    updateRecipientUserInput: (newInput) =>
      dispatch(updateRecipientUserInput(newInput)),
    useMyAccountsForRecipientSearch: () =>
      dispatch(useMyAccountsForRecipientSearch()),
    useContactListForRecipientSearch: () =>
      dispatch(useContactListForRecipientSearch()),
  };
}
