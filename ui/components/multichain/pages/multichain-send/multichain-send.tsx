import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { I18nContext } from '../../../../contexts/i18n';
import {
  ButtonIcon,
  ButtonIconSize,
  ButtonPrimary,
  ButtonPrimarySize,
  ButtonSecondary,
  ButtonSecondarySize,
  IconName,
  Box,
} from '../../../component-library';

import { Content, Footer, Header, Page } from '../page';

import {
  BackgroundColor,
  JustifyContent,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import { SendPageAccountPicker } from '../send/components';
import { useMultichainSelector } from '../../../../hooks/useMultichainSelector';
import {
  getCurrentMultichainDraftTransaction,
  getCurrentMultichainDraftTransactionId,
  getMultichainNetwork,
} from '../../../../selectors/multichain';
import { getSelectedInternalAccount } from '../../../../selectors';
import {
  clearDraft,
  startNewMultichainDraftTransaction,
} from '../../../../ducks/multichain-send/multichain-send';
import Spinner from '../../../ui/spinner';
import { MultichainFee } from './components/fee';
import { SendPageRecipientInput } from './components/recipient-input';
import { MultichainAssetPickerAmount } from './components/asset-picker-amount';
import { MultichainNotices } from './components/multichain-notices';

export const MultichainSendPage = () => {
  const t = useContext(I18nContext);
  const history = useHistory();
  const selectedAccount = useSelector(getSelectedInternalAccount);
  const multichainNetwork = useMultichainSelector(
    getMultichainNetwork,
    selectedAccount,
  );
  const dispatch = useDispatch();
  const draftTransactionExists = useSelector(
    getCurrentMultichainDraftTransactionId,
  );

  useEffect(() => {
    if (!draftTransactionExists) {
      dispatch(
        startNewMultichainDraftTransaction({
          account: selectedAccount,
          network: multichainNetwork.chainId,
        }),
      );
    }
  }, [draftTransactionExists]);

  const draftTransaction = useSelector(getCurrentMultichainDraftTransaction);

  const onCancel = () => {
    dispatch(clearDraft());
    history.push('/home');
  };

  const onSubmit = () => {
    history.push(`/multichain-confirm-transaction/${draftTransactionExists}`);
  };

  const submitDisabled = !draftTransaction?.valid;
  const isSendFormShown = draftTransactionExists;

  return (
    <Page className="multichain-send-page">
      <Header
        textProps={{
          variant: TextVariant.headingSm,
        }}
        justifyContent={JustifyContent.center}
        startAccessory={
          <ButtonIcon
            size={ButtonIconSize.Sm}
            ariaLabel={t('back')}
            iconName={IconName.ArrowLeft}
            onClick={onCancel}
          />
        }
      >
        {t('send')}
      </Header>
      {draftTransaction ? (
        <Content>
          <Content>
            <SendPageAccountPicker />
            {isSendFormShown && (
              <MultichainAssetPickerAmount
                error={draftTransaction.transactionParams.sendAsset.error}
                asset={
                  draftTransaction.transactionParams.sendAsset.assetDetails
                }
                amount={{
                  error: draftTransaction.transactionParams.sendAsset.error,
                  value: draftTransaction.transactionParams.sendAsset.amount,
                }}
              />
            )}
            <Box marginTop={6}>
              {isSendFormShown && <SendPageRecipientInput />}
            </Box>
            {isSendFormShown && (
              <MultichainFee
                asset={draftTransaction.transactionParams.sendAsset}
                backgroundColor={BackgroundColor.backgroundAlternative}
                estimatedFee={draftTransaction.transactionParams.fee}
              />
            )}
            <MultichainNotices network={multichainNetwork.chainId} />
          </Content>
        </Content>
      ) : (
        <Spinner />
      )}

      <Footer>
        <ButtonSecondary onClick={onCancel} size={ButtonSecondarySize.Lg} block>
          {t('cancel')}
        </ButtonSecondary>

        <ButtonPrimary
          onClick={onSubmit}
          // loading={isSubmitting}
          size={ButtonPrimarySize.Lg}
          disabled={submitDisabled}
          block
        >
          {t('review')}
        </ButtonPrimary>
      </Footer>
    </Page>
  );
};
