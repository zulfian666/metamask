let mapStateToProps;
let mapDispatchToProps;

jest.mock('react-redux', () => ({
  connect: (ms, md) => {
    mapStateToProps = ms;
    mapDispatchToProps = md;
    return () => ({});
  },
}));

jest.mock('../../../../selectors', () => ({
  getAddressBook: (s) => [{ name: `mockAddressBook:${s}` }],
  getAddressBookEntry: (s) => `mockAddressBookEntry:${s}`,
  getMetaMaskAccountsOrdered: () => [
    { name: `account1:mockState` },
    { name: `account2:mockState` },
  ],
}));
<<<<<<< HEAD
<<<<<<< HEAD

jest.mock('../../../../ducks/domains', () => ({
  getDomainResolution: (s) => `mockSendDomainResolution:${s}`,
  getDomainError: (s) => `mockSendDomainResolutionError:${s}`,
  getDomainWarning: (s) => `mockSendDomainResolutionWarning:${s}`,
=======
jest.mock('../../../../ducks/uns', () => ({
  getUnsResolution: (s) => `mockSendUnsResolution:${s}`,
  getUnsError: (s) => `mockSendUnsResolutionError:${s}`,
  getUnsWarning: (s) => `mockSendUnsResolutionWarning:${s}`,
}));
jest.mock('../../../../ducks/ens', () => ({
  getEnsResolution: (s) => `mockSendEnsResolution:${s}`,
  getEnsError: (s) => `mockSendEnsResolutionError:${s}`,
  getEnsWarning: (s) => `mockSendEnsResolutionWarning:${s}`,
>>>>>>> 8e33b41b9 (working through unit tests)
  useMyAccountsForRecipientSearch: (s) =>
    `useMyAccountsForRecipientSearch:${s}`,
=======
jest.mock('../../../../ducks/domain', () => ({
  getDomainResolution: (s) => `mockSendDomainResolution:${s}`,
  getDomainError: (s) => `mockSendDomainResolutionError:${s}`,
  getDomainWarning: (s) => `mockSendDomainResolutionWarning:${s}`,
>>>>>>> 1f8b43e69 (combines UNS and ENS basic resolution into one module and generalizes their state to domains rather than their individual names)
}));

jest.mock('../../../../ducks/send', () => ({
  updateRecipient: ({ address, nickname }) =>
    `{mockUpdateRecipient: {address: ${address}, nickname: ${nickname}}}`,
  updateRecipientUserInput: (s) => `mockUpdateRecipientUserInput:${s}`,
  useMyAccountsForRecipientSearch: (s) =>
    `mockUseMyAccountsForRecipientSearch:${s}`,
  useContactListForRecipientSearch: (s) =>
    `mockUseContactListForRecipientSearch:${s}`,
  getIsUsingMyAccountForRecipientSearch: (s) =>
    `mockGetIsUsingMyAccountForRecipientSearch:${s}`,
  getRecipientUserInput: (s) => `mockRecipientUserInput:${s}`,
  getRecipient: (s) => `mockRecipient:${s}`,
}));

require('./add-recipient.container');

describe('add-recipient container', () => {
  describe('mapStateToProps()', () => {
    it('should map the correct properties to props', () => {
      expect(mapStateToProps('mockState')).toStrictEqual({
        addressBook: [{ name: 'mockAddressBook:mockState' }],
        addressBookEntryName: undefined,
        contacts: [{ name: 'mockAddressBook:mockState' }],
<<<<<<< HEAD
<<<<<<< HEAD
        domainResolution: 'mockSendDomainResolution:mockState',
        domainError: 'mockSendDomainResolutionError:mockState',
        domainWarning: 'mockSendDomainResolutionWarning:mockState',
=======
        unsResolution: 'mockSendUnsResolution:mockState',
        unsError: 'mockSendUnsResolutionError:mockState',
        unsWarning: 'mockSendUnsResolutionWarning:mockState',
        ensResolution: 'mockSendEnsResolution:mockState',
        ensError: 'mockSendEnsResolutionError:mockState',
        ensWarning: 'mockSendEnsResolutionWarning:mockState',
>>>>>>> 8e33b41b9 (working through unit tests)
=======
        domainResolution: 'mockSendDomainResolution:mockState',
        domainError: 'mockSendDomainResolutionError:mockState',
        domainWarning: 'mockSendDomainResolutionWarning:mockState',
>>>>>>> 1f8b43e69 (combines UNS and ENS basic resolution into one module and generalizes their state to domains rather than their individual names)
        nonContacts: [],
        ownedAccounts: [
          { name: 'account1:mockState' },
          { name: 'account2:mockState' },
        ],
        isUsingMyAccountsForRecipientSearch:
          'mockGetIsUsingMyAccountForRecipientSearch:mockState',
        userInput: 'mockRecipientUserInput:mockState',
        recipient: 'mockRecipient:mockState',
      });
    });
  });

  describe('mapDispatchToProps()', () => {
    describe('updateRecipient()', () => {
      const dispatchSpy = jest.fn();

      const mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy);

      it('should dispatch an action', () => {
        mapDispatchToPropsObject.updateRecipient({
          address: 'mockAddress',
          nickname: 'mockNickname',
        });

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy.mock.calls[0][0]).toStrictEqual(
          '{mockUpdateRecipient: {address: mockAddress, nickname: mockNickname}}',
        );
      });
    });
  });
});
