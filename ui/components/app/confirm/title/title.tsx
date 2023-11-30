import React from 'react';
import { Text } from '../../../component-library';
import {
  TextVariant,
  TextAlign,
  TextColor,
} from '../../../../helpers/constants/design-system';

interface ConfirmTitleProps {
  title: string;
  description: string;
}

export const ConfirmTitle: React.FC<ConfirmTitleProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <Text
        variant={TextVariant.headingLg}
        paddingTop={4}
        paddingBottom={2}
        textAlign={TextAlign.Center}
      >
        {title}
      </Text>
      <Text
        paddingBottom={4}
        color={TextColor.textAlternative}
        textAlign={TextAlign.Center}
      >
        {description}
      </Text>
    </>
  );
};
