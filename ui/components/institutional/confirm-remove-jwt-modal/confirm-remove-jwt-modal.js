import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import CustodyAccountList from '../../../pages/institutional/connect-custody/account-list';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { removeAccount } from '../../../store/actions';
import withModalProps from '../../../helpers/higher-order-components/with-modal-props';
import {
  Box,
  Text,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZES,
} from '../../component-library';
import {
  BorderRadius,
  Display,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';

const ConfirmRemoveJWT = ({
  custodyAccountDetails,
  accounts,
  token,
  hideModal,
}) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);
  const [tokenAccounts, setTokenAccounts] = useState([]);

  useEffect(() => {
    const lowercasedTokenAddress = token.toLowerCase();

    const filteredAccounts = custodyAccountDetails.filter((item) => {
      const addressLower = item.address.toLowerCase();
      return accounts.find((acc) => acc.address.toLowerCase() === addressLower);
    });

    const tokens = filteredAccounts
      .filter(({ authDetails }) => {
        const getToken =
          authDetails?.token ?? authDetails?.jwt ?? authDetails?.refreshToken;
        return getToken?.toLowerCase() === lowercasedTokenAddress;
      })
      .map(({ address, name, labels, authDetails }) => {
        const lowercasedAddress = address.toLowerCase();
        const account = accounts.find(
          ({ address: adressAcc }) =>
            adressAcc.toLowerCase() === lowercasedAddress,
        );
        const balance = account?.balance;
        const getToken =
          authDetails?.token ?? authDetails?.jwt ?? authDetails?.refreshToken;
        return { address, name, labels, balance, token: getToken };
      });

    setTokenAccounts(tokens);
  }, [accounts, custodyAccountDetails, token]);

  const handleRemove = async () => {
    try {
      for (const account of tokenAccounts) {
        await dispatch(removeAccount(account.address.toLowerCase()));
      }
      hideModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  return (
    <Modal isOpen onClose={hideModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader onClose={hideModal}>{t('removeJWT')}</ModalHeader>
        <Box
          display={Display.Flex}
          padding={2}
          borderRadius={BorderRadius.SM}
          className="confirm-action-jwt__jwt"
        >
          {showMore && token ? token : `...${token.slice(-9)}`}
        </Box>
        {!showMore && (
          <Text
            color={TextColor.goerli}
            marginLeft={2}
            className="confirm-action-jwt__show-more"
          >
            <a rel="noopener noreferrer" onClick={handleShowMore}>
              {t('showMore')}
            </a>
          </Text>
        )}
        <Text
          as="h6"
          textAlign={TextAlign.Center}
          variant={TextVariant.bodySm}
          marginTop={2}
        >
          {t('removeJWTDescription')}
        </Text>
        <Box className="confirm-action-jwt__accounts-list">
          <CustodyAccountList accounts={tokenAccounts} rawList />
        </Box>
        <Box display={Display.Flex}>
          <Button
            block
            variant={BUTTON_VARIANT.PRIMARY}
            size={BUTTON_SIZES.LG}
            onClick={handleRemove}
          >
            {t('remove')}
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};

ConfirmRemoveJWT.propTypes = {
  hideModal: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired,
  custodyAccountDetails: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default withModalProps(memo(ConfirmRemoveJWT));
