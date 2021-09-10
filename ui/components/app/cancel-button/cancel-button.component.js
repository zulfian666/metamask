import { Tooltip } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Button from '../../ui/button';
import { getMaximumGasTotalInHexWei } from '../../../../shared/modules/gas.utils';
import { getConversionRate } from '../../../ducks/metamask/metamask';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useIncrementedGasFees } from '../../../hooks/useIncrementedGasFees';
import { isBalanceSufficient } from '../../../pages/send/send.utils';
import { getSelectedAccount } from '../../../selectors';

export default function CancelButton({
  cancelTransaction,
  transactionGroup,
  detailsModal,
}) {
  const t = useI18nContext();

  const customCancelGasSettings = useIncrementedGasFees(transactionGroup);

  const selectedAccount = useSelector(getSelectedAccount);
  const conversionRate = useSelector(getConversionRate);

  const hasEnoughCancelGas = isBalanceSufficient({
    amount: '0x0',
    gasTotal: getMaximumGasTotalInHexWei(customCancelGasSettings),
    balance: selectedAccount.balance,
    conversionRate,
  });

  const btn = (
    <Button
      onClick={cancelTransaction}
      rounded={!detailsModal}
      type={detailsModal ? 'raise' : null}
      className={classnames({
        'transaction-list-item__header-button': !detailsModal,
        'transaction-list-item-details__header-button': detailsModal,
      })}
      disabled={!hasEnoughCancelGas}
    >
      {t('cancel')}
    </Button>
  );
  return hasEnoughCancelGas ? (
    btn
  ) : (
    <Tooltip title={t('notEnoughGas')} position="bottom">
      <div>{btn}</div>
    </Tooltip>
  );
}

CancelButton.propTypes = {
  transactionGroup: PropTypes.object,
  cancelTransaction: PropTypes.func,
  detailsModal: PropTypes.bool,
};
