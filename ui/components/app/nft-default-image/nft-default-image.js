import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TextVariant } from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { Text } from '../../component-library';
import Box from '../../ui/box/box';

export default function NftDefaultImage({ name, tokenId, clickable = false }) {
  const t = useI18nContext();
  return (
    <Box
      tabIndex={0}
      data-testid="nft-default-image"
      className={classnames('nft-default', {
        'nft-default__clickable': clickable,
      })}
    >
      <Text variant={TextVariant.bodySm} as="h6" className="nft-default__text">
        {name ?? t('unknownCollection')} <br /> #{tokenId}
      </Text>
    </Box>
  );
}

NftDefaultImage.propTypes = {
  /**
   * The name of the NFT collection if not supplied will default to "Unnamed collection"
   */
  name: PropTypes.string,
  /**
   * The token id of the nft
   */
  tokenId: PropTypes.string,
  /**
   * Controls the css class for the cursor hover
   */
  clickable: PropTypes.bool,
};
