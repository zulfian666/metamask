import React from 'react';
import Box from '../../ui/box';
import {
  ICON_NAMES,
  Button,
  ButtonIcon,
  BUTTON_ICON_SIZES,
  BUTTON_SIZES,
  Text,
} from '..';
import {
  AlignItems,
  Color,
  TextVariant,
  TEXT_ALIGN,
} from '../../../helpers/constants/design-system';
import { HeaderBase } from './header-base';
import README from './README.mdx';

const marginSizeControlOptions = [
  undefined,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  'auto',
];

export default {
  title: 'Components/ComponentLibrary/HeaderBase',
  component: HeaderBase,
  parameters: {
    docs: {
      page: README,
    },
    backgrounds: { default: 'alternative' },
  },
  argTypes: {
    className: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    marginTop: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginRight: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginBottom: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginLeft: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
  },
};

export const DefaultStory = (args) => {
  return <HeaderBase {...args} />;
};

DefaultStory.args = {
  children: (
    <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
      Title is sentence case no period
    </Text>
  ),
  startAccessory: (
    <ButtonIcon
      size={BUTTON_ICON_SIZES.SM}
      iconName={ICON_NAMES.ARROW_LEFT}
      ariaLabel="back"
    />
  ),
  endAccessory: (
    <ButtonIcon
      size={BUTTON_ICON_SIZES.SM}
      iconName={ICON_NAMES.CLOSE}
      ariaLabel="close"
    />
  ),
};

DefaultStory.storyName = 'Default';

export const Children = (args) => {
  return (
    <HeaderBase {...args}>
      <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
        Title is sentence case no period
      </Text>
    </HeaderBase>
  );
};

export const StartAccessory = (args) => {
  return (
    <HeaderBase
      marginBottom={4}
      startAccessory={
        <ButtonIcon
          size={BUTTON_ICON_SIZES.SM}
          iconName={ICON_NAMES.ARROW_LEFT}
          ariaLabel="back"
        />
      }
      {...args}
    >
      <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
        Title is sentence case no period
      </Text>
    </HeaderBase>
  );
};

export const EndAccessory = (args) => {
  return (
    <HeaderBase
      marginBottom={4}
      endAccessory={
        <ButtonIcon
          size={BUTTON_ICON_SIZES.SM}
          iconName={ICON_NAMES.CLOSE}
          ariaLabel="close"
        />
      }
      {...args}
    >
      <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
        Title is sentence case no period
      </Text>
    </HeaderBase>
  );
};

export const UseCaseDemos = (args) => (
  <>
    <Text>children only assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase marginBottom={4} {...args}>
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>children and endAccessory assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        endAccessory={
          <ButtonIcon
            backgroundColor={Color.errorAlternative}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.CLOSE}
            ariaLabel="close"
          />
        }
        {...args}
      >
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>children and startAccessory assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        startAccessory={
          <ButtonIcon
            backgroundColor={Color.mainnet}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.ARROW_LEFT}
            ariaLabel="back"
          />
        }
        {...args}
      >
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>children, startAccessory, and endAccessory assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        startAccessory={
          <ButtonIcon
            backgroundColor={Color.mainnet}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.ARROW_LEFT}
            ariaLabel="back"
          />
        }
        endAccessory={
          <ButtonIcon
            backgroundColor={Color.errorAlternative}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.CLOSE}
            ariaLabel="close"
          />
        }
        {...args}
      >
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>children, startAccessory, and endAccessory assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        startAccessory={
          <Button
            backgroundColor={Color.mainnet}
            style={{ whiteSpace: 'nowrap' }}
            size={BUTTON_SIZES.SM}
          >
            Unlock Now
          </Button>
        }
        endAccessory={
          <ButtonIcon
            backgroundColor={Color.errorAlternative}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.CLOSE}
            ariaLabel="close"
          />
        }
        {...args}
      >
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>
      children, startAccessory, and endAccessory assigned with prop alignItems=
      {AlignItems.center} passed at HeaderBase
    </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        alignItems={AlignItems.center}
        startAccessory={
          <ButtonIcon
            backgroundColor={Color.mainnet}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.CLOSE}
            ariaLabel="close"
          />
        }
        endAccessory={
          <Button
            backgroundColor={Color.errorAlternative}
            size={BUTTON_SIZES.SM}
          >
            Download
          </Button>
        }
        {...args}
      >
        <Text
          variant={TextVariant.headingSm}
          textAlign={TEXT_ALIGN.CENTER}
          backgroundColor={Color.goerli}
        >
          Title is sentence case no period
        </Text>
      </HeaderBase>
    </Box>
    <Text>startAccessory and endAccessory assigned </Text>
    <Box backgroundColor={Color.warningAlternative}>
      <HeaderBase
        marginBottom={4}
        startAccessory={
          <Button backgroundColor={Color.mainnet} size={BUTTON_SIZES.SM}>
            Unlock
          </Button>
        }
        endAccessory={
          <ButtonIcon
            backgroundColor={Color.errorAlternative}
            size={BUTTON_ICON_SIZES.SM}
            iconName={ICON_NAMES.CLOSE}
            ariaLabel="close"
          />
        }
        {...args}
      ></HeaderBase>
    </Box>
  </>
);
