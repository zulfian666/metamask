import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import NftsItems from '../nfts-items';
import {
  JustifyContent,
  FlexDirection,
  AlignItems,
  Size,
  Display,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { getIsMainnet, getUseNftDetection } from '../../../selectors';
import { EXPERIMENTAL_ROUTE } from '../../../helpers/constants/routes';
import {
  checkAndUpdateAllNftsOwnershipStatus,
  detectNfts,
} from '../../../store/actions';
import { useNftsCollections } from '../../../hooks/useNftsCollections';
import { Box, ButtonLink, IconName } from '../../component-library';
import NftsDetectionNotice from '../nfts-detection-notice';

export default function NftsTab({ onAddNFT }) {
  const useNftDetection = useSelector(getUseNftDetection);
  const isMainnet = useSelector(getIsMainnet);
  const history = useHistory();
  const t = useI18nContext();
  const dispatch = useDispatch();

  const { nftsLoading, collections, previouslyOwnedCollection } =
    useNftsCollections();

  const onEnableAutoDetect = () => {
    history.push(EXPERIMENTAL_ROUTE);
  };

  const onRefresh = () => {
    if (isMainnet) {
      dispatch(detectNfts());
    }
    checkAndUpdateAllNftsOwnershipStatus();
  };

  if (nftsLoading) {
    return <div className="nfts-tab__loading">{t('loadingNFTs')}</div>;
  }

  return (
    <Box className="nfts-tab">
      {Object.keys(collections).length > 0 ||
      previouslyOwnedCollection.nfts.length > 0 ? (
        <NftsItems
          collections={collections}
          previouslyOwnedCollection={previouslyOwnedCollection}
        />
      ) : (
        <>{isMainnet && !useNftDetection ? <NftsDetectionNotice /> : null}</>
      )}
      <Box
        className="nfts-tab__buttons"
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        alignItems={AlignItems.flexStart}
        margin={4}
        gap={2}
        marginBottom={2}
      >
        <ButtonLink
          size={Size.MD}
          data-testid="import-nft-button"
          startIconName={IconName.Add}
          onClick={onAddNFT}
        >
          {t('importNFT')}
        </ButtonLink>
        {!isMainnet && Object.keys(collections).length < 1 ? null : (
          <>
            <Box
              className="nfts-tab__link"
              justifyContent={JustifyContent.flexEnd}
            >
              {isMainnet && !useNftDetection ? (
                <ButtonLink
                  size={Size.MD}
                  startIconName={IconName.Setting}
                  data-testid="refresh-list-button"
                  onClick={onEnableAutoDetect}
                >
                  {t('enableAutoDetect')}
                </ButtonLink>
              ) : (
                <ButtonLink
                  size={Size.MD}
                  startIconName={IconName.Refresh}
                  data-testid="refresh-list-button"
                  onClick={onRefresh}
                >
                  {t('refreshList')}
                </ButtonLink>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

NftsTab.propTypes = {
  onAddNFT: PropTypes.func.isRequired,
};
