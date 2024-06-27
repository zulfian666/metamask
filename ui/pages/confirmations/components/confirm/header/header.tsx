import React, { Dispatch, SetStateAction } from 'react';
import {
  AvatarNetwork,
  AvatarNetworkSize,
  Box,
  Text,
} from '../../../../../components/component-library';
import Identicon from '../../../../../components/ui/identicon';
import {
  AlignItems,
  Display,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../../../helpers/constants/design-system';
import { getAvatarNetworkColor } from '../../../../../helpers/utils/accounts';
import useConfirmationNetworkInfo from '../../../hooks/useConfirmationNetworkInfo';
import useConfirmationRecipientInfo from '../../../hooks/useConfirmationRecipientInfo';
import HeaderInfo from './header-info';

const Header = ({
  showAdvancedDetails,
  setShowAdvancedDetails,
}: {
  showAdvancedDetails: boolean;
  setShowAdvancedDetails: Dispatch<SetStateAction<boolean>>;
}) => {
  const { networkImageUrl, networkDisplayName } = useConfirmationNetworkInfo();
  const { senderAddress: fromAddress, senderName: fromName } =
    useConfirmationRecipientInfo();

  return (
    <Box
      display={Display.Flex}
      className="confirm_header__wrapper"
      alignItems={AlignItems.center}
      justifyContent={JustifyContent.spaceBetween}
    >
      <Box alignItems={AlignItems.flexStart} display={Display.Flex} padding={4}>
        <Box display={Display.Flex} marginTop={2}>
          <Identicon address={fromAddress} diameter={32} />
          <AvatarNetwork
            src={networkImageUrl}
            name={networkDisplayName}
            size={AvatarNetworkSize.Xs}
            backgroundColor={getAvatarNetworkColor(networkDisplayName)}
            className="confirm_header__avatar-network"
          />
        </Box>
        <Box marginInlineStart={4}>
          <Text
            color={TextColor.textDefault}
            variant={TextVariant.bodyMdMedium}
          >
            {fromName}
          </Text>
          <Text color={TextColor.textAlternative}>{networkDisplayName}</Text>
        </Box>
      </Box>
      <Box alignItems={AlignItems.flexEnd} display={Display.Flex} padding={4}>
        <HeaderInfo
          showAdvancedDetails={showAdvancedDetails}
          setShowAdvancedDetails={setShowAdvancedDetails}
        />
      </Box>
    </Box>
  );
};

export default Header;
