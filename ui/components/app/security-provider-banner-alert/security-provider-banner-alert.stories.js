import React from 'react';
import { Severity } from '../../../helpers/constants/design-system';
import { ButtonLink, BUTTON_LINK_SIZES, Text } from '../../component-library';
import { SecurityProvider } from '../../../../shared/constants/security-provider';
import SecurityProviderBannerAlert from './security-provider-banner-alert';

const mockPlainText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sapien tellus, elementum sit ' +
  'amet laoreet vitae, semper in est. Nulla vel tristique felis. Donec non tellus eget neque cursus malesuada.';

const MockDescriptionWithLinks = () => (
  <>
    Description shouldn’t repeat title. 1-3 lines. Can contain a{' '}
    <ButtonLink size={BUTTON_LINK_SIZES.INHERIT}>hyperlink</ButtonLink>. It can
    also contain a toggle to enable progressive disclosure.
  </>
);

const MockDetailsList = () => (
  <Text as="ul">
    <li>• List item</li>
    <li>• List item</li>
    <li>• List item</li>
    <li>• List item</li>
  </Text>
);

export default {
  title: 'Components/App/SecurityProviderBannerAlert',
  argTypes: {
    description: {
      control: {
        type: 'select',
      },
      options: ['plainText', 'withLinks'],
      mapping: {
        plainText: mockPlainText,
        withLinks: <MockDescriptionWithLinks />,
      },
    },
    details: {
      control: {
        type: 'select',
      },
      options: ['none', 'plainText', 'withList'],
      mapping: {
        none: null,
        plainText: mockPlainText,
        withList: <MockDetailsList />,
      },
    },
    provider: {
      control: {
        type: 'select',
      },
      options: [Object.values(SecurityProvider)],
    },
    severity: {
      control: {
        type: 'select',
      },
      options: [Severity.Danger, Severity.Warning],
    },
    title: {
      control: 'text',
    },
  },
  args: {
    title: 'Title is sentence case no period',
    description: <MockDescriptionWithLinks />,
    details: <MockDetailsList />,
    provider: SecurityProvider.Blockaid,
  },
};

export const DefaultStory = (args) => (
  <SecurityProviderBannerAlert severity={Severity.Danger} {...args} />
);
DefaultStory.storyName = 'Default';

export const Warning = (args) => (
  <SecurityProviderBannerAlert severity={Severity.Warning} {...args} />
);
