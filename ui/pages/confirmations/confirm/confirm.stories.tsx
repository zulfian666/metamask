import React from 'react';
import { Provider } from 'react-redux';
import { cloneDeep } from 'lodash';
import { unapprovedPersonalSignMsg, signatureRequestSIWE } from '../../../../test/data/confirmations/personal_sign';
import { unapprovedTypedSignMsgV1, unapprovedTypedSignMsgV4, permitSignatureMsg } from '../../../../test/data/confirmations/typed_sign';
import mockState from '../../../../test/data/mock-state.json';
import configureStore from '../../../store/store';
import ConfirmPage from './confirm';

const ConfirmPageStory = {
  title: 'Pages/Confirm/ConfirmPage',
  decorators: [(story) => <div style={{ height: '600px' }}>{story()}</div>],
}

const argsSignature = {
  data: '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765',
  from: '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc',
  origin: 'https://metamask.github.io',
}

const argTypesSignature = {
  data: {
    control: 'text',
    description: '(non-param) overrides msgParams.data',
  },
  from: {
    control: 'text',
    description: '(non-param) overrides msgParams.from',
  },
  origin: {
    control: 'text',
    description: '(non-param) overrides msgParams.origin',
  },
}

function SignatureStoryTemplate(args, confirmation) {
  const { data, from, origin } = args;
  const mockConfirmation = cloneDeep(confirmation);

  mockConfirmation.msgParams.data = data;
  mockConfirmation.msgParams.from = from;
  mockConfirmation.msgParams.origin = origin;

  const store = configureStore({
    confirm: {
      currentConfirmation: mockConfirmation,
    },
    metamask: { ...mockState.metamask },
  });

  return <Provider store={store}><ConfirmPage /></Provider>;
}

export const PersonalSignStory = (args) => {
  return SignatureStoryTemplate(args, unapprovedPersonalSignMsg);
};

PersonalSignStory.storyName = 'Personal Sign';
PersonalSignStory.args = argsSignature;
PersonalSignStory.argTypes = argTypesSignature;

export const SignInWithEthereumSIWEStory = (args) => {
  return SignatureStoryTemplate(args, signatureRequestSIWE);
};

SignInWithEthereumSIWEStory.storyName = 'Sign-in With Ethereum (SIWE)';
SignInWithEthereumSIWEStory.args = {
  ...argsSignature,
  data: signatureRequestSIWE.msgParams.data,
};
SignInWithEthereumSIWEStory.argTypes = argTypesSignature;

export const SignTypedDataStory = (args) => {
  return SignatureStoryTemplate(args, unapprovedTypedSignMsgV1);
};

SignTypedDataStory.storyName = 'SignTypedData';
SignTypedDataStory.args = {
  ...argsSignature,
  data: unapprovedTypedSignMsgV1.msgParams.data,
};
SignTypedDataStory.argTypes = {
  ...argTypesSignature,
  data: {
    control: 'array',
    description: '(non-param) overrides msgParams.data',
  },
};

export const PermitStory = (args) => {
  return SignatureStoryTemplate(args, permitSignatureMsg);
};

PermitStory.storyName = 'SignTypedData Permit';
PermitStory.args = {
  ...argsSignature,
  data: permitSignatureMsg.msgParams.data,
};
PermitStory.argTypes = argTypesSignature;

export const SignTypedDataV4Story = (args) => {
  return SignatureStoryTemplate(args, unapprovedTypedSignMsgV4);
};

SignTypedDataV4Story.storyName = 'SignTypedData V4';
SignTypedDataV4Story.args = {
  ...argsSignature,
  data: unapprovedTypedSignMsgV4.msgParams.data,
};
SignTypedDataV4Story.argTypes = argTypesSignature;


export default ConfirmPageStory;
