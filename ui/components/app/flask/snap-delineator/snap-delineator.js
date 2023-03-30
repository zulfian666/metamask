import React from 'react';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import {
  BorderStyle,
  BorderColor,
  BorderRadius,
  AlignItems,
  BackgroundColor,
  IconColor,
  TextVariant,
  TextColor,
} from '../../../../helpers/constants/design-system';
import Box from '../../../ui/box';
import {
  AvatarIcon,
  ICON_NAMES,
  ICON_SIZES,
  Text,
} from '../../../component-library';
import { DelineatorStyle } from '../../../../helpers/constants/flask';

export const SnapDelineator = ({
  snapName,
  style = DelineatorStyle.default,
  children,
}) => {
  const t = useI18nContext();
  const isError = style === DelineatorStyle.error;
  return (
    <Box
      className="snap-delineator__wrapper"
      borderStyle={BorderStyle.solid}
      borderColor={BorderColor.borderDefault}
      borderRadius={BorderRadius.LG}
      backgroundColor={
        isError ? BackgroundColor.errorMuted : BackgroundColor.backgroundDefault
      }
    >
      <Box
        className="snap-delineator__header"
        alignItems={AlignItems.center}
        paddingLeft={1}
        paddingRight={1}
        paddingTop={1}
        paddingBottom={1}
      >
        <AvatarIcon
          iconName={ICON_NAMES.SNAPS}
          size={ICON_SIZES.XS}
          backgroundColor={
            isError ? IconColor.errorDefault : IconColor.infoDefault
          }
          margin={1}
          iconProps={{
            size: ICON_SIZES.XS,
            color: IconColor.infoInverse,
          }}
        />
        <Text
          variant={TextVariant.bodySm}
          color={isError ? TextColor.errorDefault : TextColor.default}
          className="snap-delineator__header__text"
          marginLeft={1}
          marginTop={0}
          marginBottom={0}
        >
          {t(isError ? 'errorWithSnap' : 'contentFromSnap', [snapName])}
        </Text>
      </Box>
      <Box className="snap-delineator__content" padding={4}>
        {children}
      </Box>
    </Box>
  );
};

SnapDelineator.propTypes = {
  snapName: PropTypes.string,
  style: PropTypes.string,
  children: PropTypes.ReactNode,
};
