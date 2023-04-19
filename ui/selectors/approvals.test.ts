import { ApprovalType } from '@metamask/controller-utils';
import { hasPendingApprovals } from './approvals';

describe('approval selectors', () => {
  const mockedState = {
    metamask: {
      pendingApprovals: [
        {
          id: '1',
          origin: 'origin',
          time: Date.now(),
          type: ApprovalType.WatchAsset,
          requestData: null,
          requestState: null,
        },
        {
          id: '2',
          origin: 'origin',
          time: Date.now(),
          type: ApprovalType.EthSignTypedData,
          requestData: null,
          requestState: null,
        },
      ],
    },
  };

  describe('hasPendingApprovals', () => {
    it('should return true if there is a pending approval request', () => {
      const result = hasPendingApprovals(mockedState, ApprovalType.WatchAsset);

      expect(result).toBe(true);
    });

    it('should return false if there is no pending approval request', () => {
      const result = hasPendingApprovals(mockedState, ApprovalType.Transaction);

      expect(result).toBe(false);
    });
  });
});
