import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/react';

import { ApprovalType } from '@metamask/controller-utils';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import Confirmation from '../confirmation';
import { CHAIN_IDS } from '../../../../shared/constants/network';

jest.mock('../../../../shared/lib/fetch-with-cache');

const middleware = [thunk];
const mockApprovalId = 1;
const mockApproval = {
  id: mockApprovalId,
  origin: 'https://test-dapp.metamask.io',
  requestData: {
    header: [
      {
        key: 'headerText',
        element: 'Typography',
        children: 'Error mock',
        props: {
          variant: 'h2',
          class: 'header-mock-class',
        },
      },
    ],
    message: 'Error message',
  },
};

const mockBaseStore = {
  metamask: {
    pendingApprovals: {
      [mockApprovalId]: mockApproval,
    },
    approvalFlows: [],
    subjectMetadata: {},
  },
};

describe('error template', () => {
  it('matches the snapshot', async () => {
    const testStore = {
      metamask: {
        ...mockBaseStore.metamask,
        providerConfig: {
          type: 'test',
          id: CHAIN_IDS.LOCALHOST,
        },
        pendingApprovals: {
          [mockApprovalId]: {
            ...mockApproval,
            type: ApprovalType.ResultError,
          },
        },
      },
    };
    const store = configureMockStore(middleware)(testStore);
    const { getByText, container } = renderWithProvider(
      <Confirmation />,
      store,
    );
    await waitFor(() => {
      expect(getByText('Error mock')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });
});
