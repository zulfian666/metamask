import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { NonEmptyArray } from '@metamask/utils';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Display,
  FlexDirection,
  IconColor,
  JustifyContent,
  TextAlign,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { getURLHost } from '../../../helpers/utils/util';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  getConnectedSitesList,
  getNonTestNetworks,
  getOrderedConnectedAccountsForConnectedDapp,
  getPermissionSubjects,
  getPermittedChainsForSelectedTab,
  getSelectedInternalAccount,
} from '../../../selectors';
import {
  AvatarFavicon,
  AvatarFaviconSize,
  Box,
  Button,
  ButtonIcon,
  ButtonIconSize,
  ButtonSecondarySize,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  IconSize,
  Text,
} from '../../../components/component-library/index';
import {
  Content,
  Footer,
  Header,
  Page,
} from '../../../components/multichain/pages/page/index';
import { SiteCell } from '../../../components/multichain/pages/review-permissions-page/index';

export const ConnectPage = ({
  request,
  rejectPermissionsRequest,
  permissionsRequestId,
  approveConnection,
}: {
  request: any;
  permissionsRequestId: string;
  rejectPermissionsRequest: () => void;
  approveConnection: (requestId: string) => void;
}) => {
  const t = useI18nContext();
  const networksList = useSelector(getNonTestNetworks);
  const selectedAccount = useSelector(getSelectedInternalAccount);

  // TODO we should check if there are actually specifically requested accounts and preselect them and otherwise default
  // to the selectedAccount
  const onConfirm = () => {
    const _request = {
      ...request,
      permissions: { ...request.permissions },
      approvedAccounts: selectedAccount.address,
      approvedChainIds: networksList.map((network) => network.chainId),
    };
    approveConnection(_request);
  };
  return (
    <Page
      data-testid="connections-page"
      className="main-container connections-page"
    >
      <Header backgroundColor={BackgroundColor.backgroundDefault}>
        <Text>Connect with MetaMask</Text>
        <Text>This site wants to: </Text>
      </Header>
      <Content padding={0}>
        <SiteCell
          networks={networksList}
          accounts={[selectedAccount]}
          onAccountsClick={() => console.log('test')}
          onNetworksClick={() => console.log('testing')}
        />
      </Content>
      <Footer>
        <Box display={Display.Flex} gap={4} width={BlockSize.Full}>
          <Button
            block
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Lg}
            data-testid="cancel-btn"
            onClick={rejectPermissionsRequest}
          >
            {t('cancel')}
          </Button>
          <Button
            block
            data-testid="confirm-btn"
            size={ButtonSize.Lg}
            onClick={onConfirm}
          >
            {t('confirm')}
          </Button>
        </Box>
      </Footer>{' '}
    </Page>
  );
};
