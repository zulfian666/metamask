import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { I18nContext } from '../../../contexts/i18n';
import ActionableMessage from '../actionable-message';
import Box from '../box';
import Typography from '../typography';
import {
  ALIGN_ITEMS,
  BLOCK_SIZES,
  COLORS,
  DISPLAY,
  FLEX_DIRECTION,
  TYPOGRAPHY,
} from '../../../helpers/constants/design-system';
import Button from '../button';

const AddNetwork = ({
  onBackClick,
  onAddNetworkClick,
  onAddNetworkManuallyClick,
  featuredRPCS,
}) => {
  const t = useContext(I18nContext);

  const onBack = () => {
    onBackClick();
  };

  const onAddNetwork = () => {
    onAddNetworkClick();
  };

  const onAddNetworkManually = () => {
    onAddNetworkManuallyClick();
  };

  const nets = featuredRPCS
    .sort((a, b) => (a.ticker > b.ticker ? 1 : -1))
    .slice(0, 5);

  return (
    <Box className="add-network__wrapper">
      <Box
        height={BLOCK_SIZES.TWO_TWELFTHS}
        padding={[4, 0, 4, 0]}
        display={DISPLAY.FLEX}
        alignItems={ALIGN_ITEMS.CENTER}
        flexDirection={FLEX_DIRECTION.ROW}
        className="add-network__header"
      >
        <img
          src="./images/caret-left-black.svg"
          alt=""
          onClick={onBack}
          className="add-network__header__back-icon"
        />
        <Typography variant={TYPOGRAPHY.H3} color={COLORS.BLACK}>
          {t('addNetwork')}
        </Typography>
      </Box>
      <Box
        height={BLOCK_SIZES.FOUR_FIFTHS}
        width={BLOCK_SIZES.TEN_TWELFTHS}
        margin={[0, 6, 0, 6]}
      >
        <Typography
          variant={TYPOGRAPHY.H6}
          color={COLORS.UI4}
          margin={[4, 0, 0, 0]}
        >
          {t('addFromAListOfPopularNetworks')}
        </Typography>
        <Typography
          variant={TYPOGRAPHY.H7}
          color={COLORS.UI3}
          margin={[4, 0, 3, 0]}
        >
          {t('customNetworks')}
        </Typography>
        {nets.map((item, index) => (
          <Box
            key={index}
            display={DISPLAY.FLEX}
            alignItems={ALIGN_ITEMS.CENTER}
            marginBottom={6}
          >
            <img
              className="add-network__token-image"
              src={item?.rpcPrefs?.imageUrl}
              alt=""
            />
            <Typography variant={TYPOGRAPHY.H7} color={COLORS.BLACK}>
              {item.ticker}
            </Typography>
            <img
              className="add-network__add-icon"
              src="./images/times.svg"
              alt=""
              onClick={onAddNetwork}
            />
          </Box>
        ))}
      </Box>
      <Box
        height={BLOCK_SIZES.ONE_TWELFTH}
        padding={[4, 4, 4, 4]}
        className="add-network__footer"
      >
        <Button type="link" onClick={onAddNetworkManually}>
          <Typography variant={TYPOGRAPHY.H6} color={COLORS.PRIMARY1}>
            {t('addANetworkManually')}
          </Typography>
        </Button>
        <ActionableMessage
          type="warning"
          message={
            <>
              {t('onlyInteractWith')}
              <a
                href="https://metamask.zendesk.com/hc/en-us/articles/4417500466971"
                target="_blank"
                className="add-network__footer__link"
                rel="noreferrer"
              >
                {' '}
                {t('endOfFlowMessage9')}
              </a>
            </>
          }
          iconFillColor="#f8c000"
          useIcon
          withRightButton
        />
      </Box>
    </Box>
  );
};

AddNetwork.propTypes = {
  onBackClick: PropTypes.func,
  onAddNetworkClick: PropTypes.func,
  onAddNetworkManuallyClick: PropTypes.func,
  featuredRPCS: PropTypes.array,
};

export default AddNetwork;
