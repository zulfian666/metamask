import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getAccountLink } from '@metamask/etherscan-link';
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
} from '../../../../../../selectors';
import { I18nContext } from '../../../../../../contexts/i18n';

import Button from '../../../../../ui/button';
import Tooltip from '../../../../../ui/tooltip';

const Accreditation = ({ fetchVia, address }) => {
  const t = useContext(I18nContext);
  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const addressLink = getAccountLink(address, chainId, rpcPrefs);

  const AccreditationLink = () => {
    return (
      <>
        <Typography
          variant={TYPOGRAPHY.H7}
          className="accreditation__prefix"
          boxProps={{ margin: 0 }}
        >
          {t('transactionDecodingAccreditationVerified')}
        </Typography>
        <Button
          type="link"
          className="accreditation__link"
          onClick={() => {
            global.platform.openTab({
              url: addressLink,
            });
          }}
          target="_blank"
          rel="noopener noreferrer"
          title={t('etherscanView')}
        >
          {fetchVia}
        </Button>
        <Typography variant={TYPOGRAPHY.H7} boxProps={{ margin: 0 }}>
          {t('transactionDecodingAccreditationDecoded')}
        </Typography>
      </>
    );
  };

  return (
    <div className="accreditation">
      <div className="accreditation__tooltip">
        <Tooltip position="top" arrow>
          <i className="fa fa-info-circle" />
        </Tooltip>
      </div>
      <div className="accreditation__info">
        <AccreditationLink />
      </div>
    </div>
  );
};

Accreditation.propTypes = {
  fetchVia: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default Accreditation;
