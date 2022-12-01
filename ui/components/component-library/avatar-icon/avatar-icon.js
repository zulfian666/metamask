import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AvatarBase } from '../avatar-base';
import Box from '../../ui/box/box';
import { ICON_NAMES, Icon } from '../icon';
import {
  COLORS,
  BORDER_COLORS,
  SIZES,
  DISPLAY,
  ALIGN_ITEMS,
  JUSTIFY_CONTENT,
  BACKGROUND_COLORS,
} from '../../../helpers/constants/design-system';

import { AVATAR_ICON_SIZES } from './avatar-icon.constants';

export const AvatarIcon = ({
  ariaLabel,
  size = SIZES.MD,
  className,
  iconProps,
  iconName,
  ...props
}) => {
  return (
    <AvatarBase
      size={size}
      display={DISPLAY.FLEX}
      alignItems={ALIGN_ITEMS.CENTER}
      justifyContent={JUSTIFY_CONTENT.CENTER}
      backgroundColor={BACKGROUND_COLORS.INFO_MUTED}
      borderColor={BORDER_COLORS.TRANSPARENT}
      className={classnames('avatar-icon', className)}
      {...props}
    >
      <Icon
        name={iconName}
        color={COLORS.INFO_DEFAULT}
        size={size}
        aria-label={ariaLabel}
        {...iconProps}
      />
    </AvatarBase>
  );
};

AvatarIcon.propTypes = {
  /**
   *  String that adds an accessible name for AvatarIcon
   */
  ariaLabel: PropTypes.string.isRequired,
  /**
   * Props for the fallback icon. All Icon props can be used
   */
  iconProps: PropTypes.shape(Icon.PropTypes),
  /**
   *
   * The name of the icon to display. Should be one of ICON_NAMES
   */
  iconName: PropTypes.oneOf(Object.values(ICON_NAMES)).isRequired,
  /**
   * The size of the AvatarIcon
   * Possible values could be 'SIZES.XS' 16px, 'SIZES.SM' 24px, 'SIZES.MD' 32px, 'SIZES.LG' 40px, 'SIZES.XL' 48px
   * Defaults to SIZES.MD
   */
  size: PropTypes.oneOf(Object.values(AVATAR_ICON_SIZES)),
  /**
   * Additional classNames to be added to the AvatarIcon
   */
  className: PropTypes.string,
  /**
   * AvatarIcon also accepts all Box props including but not limited to
   * className, as(change root element of HTML element) and margin props
   */
  ...Box.propTypes,
};
