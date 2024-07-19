import React, { useCallback, useState } from 'react';

import { SecurityProvider } from '../../../../../shared/constants/security-provider';
import {
  Box,
  Button,
  ButtonLink,
  ButtonLinkSize,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  IconSize,
  Text,
} from '../../../component-library';
import {
  AlignItems,
  TextAlign,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import useAlerts from '../../../../hooks/useAlerts';
import { AlertModal } from '../alert-modal';
import { AcknowledgeCheckboxBase } from '../alert-modal/alert-modal';
import { MultipleAlertModal } from '../multiple-alert-modal';

export type ConfirmAlertModalProps = {
  /** The unique key representing the specific alert field. */
  alertKey: string;
  /** Callback function that is called when the cancel button is clicked. */
  onCancel: () => void;
  /** The function to be executed when the modal needs to be closed. */
  onClose: () => void;
  /** Callback function that is called when the submit button is clicked. */
  onSubmit: () => void;
  /** The owner ID of the relevant alert from the `confirmAlerts` reducer. */
  ownerId: string;
};

function ConfirmButtons({
  onCancel,
  onSubmit,
  isConfirmed,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  isConfirmed: boolean;
}) {
  const t = useI18nContext();
  return (
    <>
      <Button
        block
        onClick={onCancel}
        size={ButtonSize.Lg}
        variant={ButtonVariant.Secondary}
        data-testid="confirm-alert-modal-cancel-button"
      >
        {t('reject')}
      </Button>
      <Button
        variant={ButtonVariant.Primary}
        onClick={onSubmit}
        size={ButtonSize.Lg}
        data-testid="confirm-alert-modal-submit-button"
        disabled={!isConfirmed}
        danger
        startIconName={IconName.Danger}
      >
        {t('confirm')}
      </Button>
    </>
  );
}

function ConfirmDetails({
  onAlertLinkClick,
}: {
  onAlertLinkClick?: () => void;
}) {
  const t = useI18nContext();
  return (
    <>
      <Box alignItems={AlignItems.center} textAlign={TextAlign.Center}>
        <Text variant={TextVariant.bodyMd}>
          {t('confirmAlertModalDetails')}
        </Text>
        <ButtonLink
          paddingTop={5}
          paddingBottom={5}
          size={ButtonLinkSize.Inherit}
          textProps={{
            variant: TextVariant.bodyMd,
            alignItems: AlignItems.flexStart,
          }}
          as="a"
          onClick={onAlertLinkClick}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={'confirm-alert-modal-review-all-alerts'}
        >
          <Icon
            name={IconName.SecuritySearch}
            size={IconSize.Inherit}
            marginLeft={1}
          />
          {t('alertModalReviewAllAlerts')}
        </ButtonLink>
      </Box>
    </>
  );
}

export function ConfirmAlertModal({
  alertKey,
  onCancel,
  onClose,
  onSubmit,
  ownerId,
}: ConfirmAlertModalProps) {
  const t = useI18nContext();
  const { alerts, unconfirmedDangerAlerts } = useAlerts(ownerId);

  const selectedAlert = alerts.find((alert) => alert.key === alertKey);

  const [confirmCheckbox, setConfirmCheckbox] = useState<boolean>(false);
  // if there are multiple alerts, show the multiple alert modal
  const [multipleAlertModalVisible, setMultipleAlertModalVisible] =
    useState<boolean>(unconfirmedDangerAlerts.length > 1);

  const handleCloseMultipleAlertModal = useCallback(() => {
    setMultipleAlertModalVisible(false);
  }, []);

  const handleOpenMultipleAlertModal = useCallback(() => {
    setMultipleAlertModalVisible(true);
  }, []);

  const handleConfirmCheckbox = useCallback(() => {
    setConfirmCheckbox(!confirmCheckbox);
  }, [confirmCheckbox, selectedAlert]);

  if (!selectedAlert) {
    return null;
  }

  if (multipleAlertModalVisible) {
    return (
      <MultipleAlertModal
        alertKey={alertKey}
        ownerId={ownerId}
        onFinalAcknowledgeClick={handleCloseMultipleAlertModal}
        onClose={handleCloseMultipleAlertModal}
      />
    );
  }

  return (
    <AlertModal
      ownerId={ownerId}
      onAcknowledgeClick={onClose}
      alertKey={alertKey}
      onClose={onClose}
      customTitle={t('confirmAlertModalTitle')}
      customDetails={
        selectedAlert?.provider === SecurityProvider.Blockaid ? (
          SecurityProvider.Blockaid
        ) : (
          <ConfirmDetails onAlertLinkClick={handleOpenMultipleAlertModal} />
        )
      }
      customAcknowledgeCheckbox={
        <AcknowledgeCheckboxBase
          selectedAlert={selectedAlert}
          isConfirmed={confirmCheckbox}
          onCheckboxClick={handleConfirmCheckbox}
          label={
            selectedAlert?.provider === SecurityProvider.Blockaid
              ? t('confirmAlertModalAcknowledgeBlockaid')
              : t('confirmAlertModalAcknowledge')
          }
        />
      }
      customAcknowledgeButton={
        <ConfirmButtons
          onCancel={onCancel}
          onSubmit={onSubmit}
          isConfirmed={confirmCheckbox}
        />
      }
      enableProvider={false}
    />
  );
}
