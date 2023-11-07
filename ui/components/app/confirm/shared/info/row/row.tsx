import React from 'react';
import Tooltip from '../../../../../ui/tooltip/tooltip';
import { Box, Icon, IconName, Text } from '../../../../../component-library';
import {
  AlignItems,
  BackgroundColor,
  BorderRadius,
  Color,
  Display,
  FlexDirection,
  FlexWrap,
  IconColor,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../../../../helpers/constants/design-system';

export enum ConfirmInfoRowVariant {
  Default = 'default',
  Critical = 'critical',
  Warning = 'warning',
}

export type ConfirmInfoRowProps = {
  label: string;
  children: React.ReactNode | string;
  tooltip?: string;
  variant?: ConfirmInfoRowVariant;
};

const BACKGROUND_COLORS = {
  [ConfirmInfoRowVariant.Default]: undefined,
  [ConfirmInfoRowVariant.Critical]: BackgroundColor.errorMuted,
  [ConfirmInfoRowVariant.Warning]: BackgroundColor.warningMuted,
};

const TEXT_COLORS = {
  [ConfirmInfoRowVariant.Default]: TextColor.textAlternative,
  [ConfirmInfoRowVariant.Critical]: Color.errorAlternative,
  [ConfirmInfoRowVariant.Warning]: Color.warningAlternative,
};

const TOOLTIP_ICONS = {
  [ConfirmInfoRowVariant.Default]: IconName.Question,
  [ConfirmInfoRowVariant.Critical]: IconName.Warning,
  [ConfirmInfoRowVariant.Warning]: IconName.Warning,
};

export const ConfirmInfoRow = ({
  label,
  children,
  variant = ConfirmInfoRowVariant.Default,
  tooltip,
}: ConfirmInfoRowProps) => (
  <Box
    display={Display.Flex}
    flexDirection={FlexDirection.Row}
    justifyContent={JustifyContent.spaceBetween}
    flexWrap={FlexWrap.Wrap}
    backgroundColor={BACKGROUND_COLORS[variant]}
    borderRadius={BorderRadius.SM}
    marginTop={2}
    marginBottom={2}
    paddingLeft={1}
    paddingRight={1}
  >
    <Box
      display={Display.Flex}
      flexDirection={FlexDirection.Row}
      justifyContent={JustifyContent.center}
      alignItems={AlignItems.center}
    >
      <Text
        variant={TextVariant.bodyMdMedium}
        color={TEXT_COLORS[variant] as TextColor}
      >
        {label}
      </Text>
      {tooltip && tooltip.length > 0 && (
        <Tooltip title={tooltip} style={{ display: 'flex' }}>
          <Icon
            name={TOOLTIP_ICONS[variant]}
            marginLeft={1}
            color={TEXT_COLORS[variant] as unknown as IconColor}
          />
        </Tooltip>
      )}
    </Box>
    {typeof children === 'string' ? (
      <Text color={TEXT_COLORS[variant] as TextColor}>{children}</Text>
    ) : (
      children
    )}
  </Box>
);
