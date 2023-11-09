import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toChecksumHexAddress } from '@metamask/controller-utils';
///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
import { useSelector } from 'react-redux';
import { getCustodianIconForAddress } from '../../../selectors/institutional/selectors';
import { getSelectedAddress } from '../../../selectors';
///: END:ONLY_INCLUDE_IN
import { ButtonBase, IconName } from '../../component-library';
import {
  BackgroundColor,
  TextVariant,
  TextColor,
  Size,
  BorderRadius,
  AlignItems,
  ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
  Display,
  ///: END:ONLY_INCLUDE_IN
} from '../../../helpers/constants/design-system';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { shortenAddress } from '../../../helpers/utils/util';
import Tooltip from '../../ui/tooltip/tooltip';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MINUTE } from '../../../../shared/constants/time';
///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
import { Box } from '../../component-library';
///: END:ONLY_INCLUDE_IN

export const AddressCopyButton = ({
  address,
  shorten = false,
  wrap = false,
  onClick,
}) => {
  const checksummedAddress = toChecksumHexAddress(address);
  const displayAddress = shorten
    ? shortenAddress(checksummedAddress)
    : checksummedAddress;
  const [copied, handleCopy] = useCopyToClipboard(MINUTE);
  const t = useI18nContext();

  ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
  const selectedAddress = useSelector(getSelectedAddress);
  const custodianIcon = useSelector((state) =>
    getCustodianIconForAddress(state, selectedAddress),
  );
  ///: END:ONLY_INCLUDE_IN

  return (
    <Tooltip position="bottom" title={copied ? t('copiedExclamation') : null}>
      <ButtonBase
        backgroundColor={BackgroundColor.primaryMuted}
        onClick={() => {
          handleCopy(checksummedAddress);
          onClick?.();
        }}
        paddingRight={4}
        paddingLeft={4}
        size={Size.SM}
        variant={TextVariant.bodySm}
        color={TextColor.primaryDefault}
        endIconName={copied ? IconName.CopySuccess : IconName.Copy}
        className={classnames('multichain-address-copy-button', {
          'multichain-address-copy-button__address--wrap': wrap,
        })}
        borderRadius={BorderRadius.pill}
        alignItems={AlignItems.center}
        data-testid="address-copy-button-text"
      >
        {
          ///: BEGIN:ONLY_INCLUDE_IN(build-mmi)
          custodianIcon && (
            <Box
              display={Display.Flex}
              alignItems={AlignItems.center}
              className="custody-logo"
              data-testid="custody-logo"
            >
              <img
                src={custodianIcon}
                className="custody-logo--icon"
                alt="custody icon"
              />
              {displayAddress}
            </Box>
          )
          ///: END:ONLY_INCLUDE_IN
        }
        {
          ///: BEGIN:ONLY_INCLUDE_IN(build-main,build-beta,build-flask)
          displayAddress
          ///: END:ONLY_INCLUDE_IN
        }
      </ButtonBase>
    </Tooltip>
  );
};

AddressCopyButton.propTypes = {
  /**
   * Address to be copied
   */
  address: PropTypes.string.isRequired,
  /**
   * Represents if the address should be shortened
   */
  shorten: PropTypes.bool,
  /**
   * Represents if the element should wrap to multiple lines
   */
  wrap: PropTypes.bool,
  /**
   * Fires when the button is clicked
   */
  onClick: PropTypes.func,
};
