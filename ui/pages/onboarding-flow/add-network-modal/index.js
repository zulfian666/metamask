import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../hooks/useI18nContext';

import { hideModal } from '../../../store/actions';

import Typography from '../../../components/ui/typography/typography';
import Box from '../../../components/ui/box/box';
import {
  TEXT_ALIGN,
  TypographyVariant,
  FONT_WEIGHT,
} from '../../../helpers/constants/design-system';

import NetworksForm from '../../settings/networks-tab/networks-form/networks-form';

export default function AddNetworkModal({
  newNetworkMenuDesignActive = false,
}) {
  const dispatch = useDispatch();
  const t = useI18nContext();

  const closeCallback = () =>
    dispatch(hideModal({ name: 'ONBOARDING_ADD_NETWORK' }));

  return (
    <>
      {newNetworkMenuDesignActive ? null : (
        <Box paddingTop={4}>
          <Typography
            variant={TypographyVariant.H4}
            align={TEXT_ALIGN.CENTER}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {t('onboardingMetametricsModalTitle')}
          </Typography>
        </Box>
      )}
      <NetworksForm
        addNewNetwork
        restrictHeight
        setActiveOnSubmit
        networksToRender={[]}
        cancelCallback={closeCallback}
        submitCallback={closeCallback}
        newNetworkMenuDesignActive={newNetworkMenuDesignActive}
      />
    </>
  );
}

AddNetworkModal.propTypes = {
  newNetworkMenuDesignActive: PropTypes.bool,
};

AddNetworkModal.defaultProps = {
  newNetworkMenuDesignActive: false,
};
