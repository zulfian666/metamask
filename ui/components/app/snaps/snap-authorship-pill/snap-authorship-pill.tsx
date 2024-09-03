import React from 'react';
import { useSelector } from 'react-redux';
import { Box, IconSize, Text } from '../../../component-library';
import { SnapIcon } from '../snap-icon';
import { getSnapMetadata } from '../../../../selectors';
import {
  AlignItems,
  BackgroundColor,
  BorderRadius,
  Display,
  FlexDirection,
  TextColor,
  TextVariant,
} from '../../../../helpers/constants/design-system';

type SnapAuthorshipPillProps = {
  snapId: string;
  onClick: () => void;
};

const SnapAuthorshipPill: React.FC<SnapAuthorshipPillProps> = ({
  snapId,
  onClick,
}) => {
  const { name: snapName } = useSelector((state) =>
    // @ts-expect-error ts is picking up the wrong type for the selector
    getSnapMetadata(state, snapId),
  );

  return (
    <Box
      className="snap-authorship-pill"
      display={Display.Flex}
      flexDirection={FlexDirection.Row}
      alignItems={AlignItems.center}
      backgroundColor={BackgroundColor.backgroundAlternative}
      borderRadius={BorderRadius.pill}
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={1}
      paddingRight={2}
      style={{ width: '150px' }}
      onClick={onClick}
    >
      <SnapIcon avatarSize={IconSize.Sm} snapId={snapId} />
      <Text
        color={TextColor.textAlternative}
        variant={TextVariant.bodySm}
        ellipsis
        paddingLeft={4}
      >
        {snapName}
      </Text>
    </Box>
  );
};

export default SnapAuthorshipPill;
