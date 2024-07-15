import { Meta } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import {
  DEPOSIT_METHOD_DATA,
  genUnapprovedContractInteractionConfirmation,
} from '../../../../../../../../test/data/confirmations/contract-interaction';
import mockState from '../../../../../../../../test/data/mock-state.json';
import configureStore from '../../../../../../../store/store';
import { AdvancedDetails } from './advanced-details';

const store = configureStore({
  ...mockState,
  metamask: {
    ...mockState.metamask,
    use4ByteResolution: true,
    knownMethodData: {
      [DEPOSIT_METHOD_DATA]: {
        name: 'Deposit',
        params: [],
      },
    },
  },
  confirm: {
    currentConfirmation: genUnapprovedContractInteractionConfirmation(),
  },
});

const Story = {
  title: 'Pages/Confirmations/Components/Confirm/Info/Shared/AdvancedDetails',
  component: AdvancedDetails,
  decorators: [
    (story: () => Meta<typeof AdvancedDetails>) => (
      <Provider store={store}>{story()}</Provider>
    ),
  ],
};

export default Story;

export const DefaultStory = () => <AdvancedDetails />;

DefaultStory.storyName = 'Default';
