import React from 'react';
import SnapInstallWarning from './snap-install-warning';

export default {
  title: 'Components/App/snaps/SnapInstallWarning',
  component: SnapInstallWarning,
  argTypes: {
    onCancel: {
      action: 'onCancel',
    },
    onSubmit: {
      action: 'onSubmit',
    },
    warnings: {
      control: 'array',
    },
    snapName: {
      control: 'text',
    },
    isOpen: {
      control: 'boolean',
    },
  },
  args: {
    snapName: 'Snap Name',
    isOpen: true,
    warnings: [
      { message: 'Warning 1', id: '1' },
      { message: 'Warning 2', id: '2' },
    ],
  },
};

export const DefaultStory = (args) => <SnapInstallWarning {...args} />;

DefaultStory.storyName = 'Default';
