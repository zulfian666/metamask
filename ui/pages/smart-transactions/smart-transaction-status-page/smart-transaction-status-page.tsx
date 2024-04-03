import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  SmartTransactionStatuses,
  SmartTransaction,
} from '@metamask/smart-transactions-controller/dist/types';

import {
  Box,
  Text,
  Icon,
  IconName,
  IconSize,
  Button,
  ButtonVariant,
  ButtonSecondary,
} from '../../../components/component-library';
import {
  AlignItems,
  BlockSize,
  BorderStyle,
  Display,
  FlexDirection,
  JustifyContent,
  TextVariant,
  TextColor,
  FontWeight,
  IconColor,
  TextAlign,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { getCurrentChainId } from '../../../selectors';
import { getFeatureFlagsByChainId } from '../../../../shared/modules/selectors';
import { BaseUrl } from '../../../../shared/constants/urls';
import { hideLoadingIndication } from '../../../store/actions';

type RequestState = {
  smartTransaction?: SmartTransaction;
  isDapp: boolean;
};

export type SmartTransactionStatusPageProps = {
  requestState: RequestState;
  onCloseExtension: () => void;
  onViewActivity: () => void;
};

const SMART_TRANSACTIONS_EXPECTED_DEADLINE_FALLBACK = 45;
const SMART_TRANSACTIONS_MAX_DEADLINE_FALLBACK = 150;

export const showRemainingTimeInMinAndSec = (
  remainingTimeInSec: number,
): string => {
  if (!Number.isInteger(remainingTimeInSec)) {
    return '0:00';
  }
  const minutes = Math.floor(remainingTimeInSec / 60);
  const seconds = remainingTimeInSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getDisplayValues = ({
  t,
  countdown,
  isSmartTransactionPending,
  isSmartTransactionTakingTooLong,
  isSmartTransactionSuccess,
  isSmartTransactionCancelled,
}: {
  t: ReturnType<typeof useI18nContext>;
  countdown: JSX.Element | undefined;
  isSmartTransactionPending: boolean;
  isSmartTransactionTakingTooLong: boolean;
  isSmartTransactionSuccess: boolean;
  isSmartTransactionCancelled: boolean;
}) => {
  if (isSmartTransactionPending && isSmartTransactionTakingTooLong) {
    return {
      title: t('smartTransactionTakingTooLong'),
      description: t('smartTransactionTakingTooLongDescription', [countdown]),
      iconName: IconName.Clock,
      iconColor: IconColor.primaryDefault,
    };
  } else if (isSmartTransactionPending) {
    return {
      title: t('smartTransactionPending'),
      description: t('stxEstimatedCompletion', [countdown]),
      iconName: IconName.Clock,
      iconColor: IconColor.primaryDefault,
    };
  } else if (isSmartTransactionSuccess) {
    return {
      title: t('smartTransactionSuccess'),
      iconName: IconName.Confirmation,
      iconColor: IconColor.successDefault,
    };
  } else if (isSmartTransactionCancelled) {
    return {
      title: t('smartTransactionCancelled'),
      description: t('smartTransactionCancelledDescription', [countdown]),
      iconName: IconName.Danger,
      iconColor: IconColor.errorDefault,
    };
  }
  // E.g. reverted or unknown statuses.
  return {
    title: t('smartTransactionError'),
    description: t('smartTransactionErrorDescription'),
    iconName: IconName.Danger,
    iconColor: IconColor.errorDefault,
  };
};

export const SmartTransactionStatusPage = ({
  requestState,
  onCloseExtension,
  onViewActivity,
}: SmartTransactionStatusPageProps) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const { smartTransaction, isDapp } = requestState;
  const isSmartTransactionPending =
    !smartTransaction ||
    smartTransaction.status === SmartTransactionStatuses.PENDING;
  const isSmartTransactionSuccess =
    smartTransaction?.status === SmartTransactionStatuses.SUCCESS;
  const isSmartTransactionCancelled = Boolean(
    smartTransaction?.status?.startsWith(SmartTransactionStatuses.CANCELLED),
  );
  const featureFlags: {
    smartTransactions?: {
      expectedDeadline?: number;
      maxDeadline?: number;
    };
  } | null = useSelector(getFeatureFlagsByChainId);
  const stxEstimatedDeadline =
    featureFlags?.smartTransactions?.expectedDeadline ||
    SMART_TRANSACTIONS_EXPECTED_DEADLINE_FALLBACK;
  const stxMaxDeadline =
    featureFlags?.smartTransactions?.maxDeadline ||
    SMART_TRANSACTIONS_MAX_DEADLINE_FALLBACK;
  const [timeLeftForPendingStxInSec, setTimeLeftForPendingStxInSec] =
    useState(stxEstimatedDeadline);
  const [isSmartTransactionTakingTooLong, setIsSmartTransactionTakingTooLong] =
    useState(false);
  const chainId: string = useSelector(getCurrentChainId);
  const stxDeadline = isSmartTransactionTakingTooLong
    ? stxMaxDeadline
    : stxEstimatedDeadline;

  const countdown = isSmartTransactionPending ? (
    <Text
      display={Display.InlineBlock}
      textAlign={TextAlign.Center}
      color={TextColor.textAlternative}
      variant={TextVariant.bodySm}
      className="smart-transaction-status-page__countdown"
    >
      {showRemainingTimeInMinAndSec(timeLeftForPendingStxInSec)}
    </Text>
  ) : undefined;

  const { title, description, iconName, iconColor } = getDisplayValues({
    t,
    countdown,
    isSmartTransactionPending,
    isSmartTransactionTakingTooLong,
    isSmartTransactionSuccess,
    isSmartTransactionCancelled,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isSmartTransactionPending) {
      const calculateRemainingTime = () => {
        const secondsAfterStxSubmission = smartTransaction?.creationTime
          ? Math.round((Date.now() - smartTransaction.creationTime) / 1000)
          : 0;
        if (secondsAfterStxSubmission > stxDeadline) {
          if (isSmartTransactionTakingTooLong) {
            setTimeLeftForPendingStxInSec(0);
            clearInterval(intervalId);
            return;
          }
          setIsSmartTransactionTakingTooLong(true);
        }
        setTimeLeftForPendingStxInSec(stxDeadline - secondsAfterStxSubmission);
      };
      intervalId = setInterval(calculateRemainingTime, 1000);
      calculateRemainingTime();
    }
    return () => clearInterval(intervalId);
  }, [isSmartTransactionPending, isSmartTransactionTakingTooLong]);

  useEffect(() => {
    dispatch(hideLoadingIndication());
  }, []);

  const uuid = smartTransaction?.uuid;
  const portfolioSmartTransactionStatusUrl = uuid
    ? `${BaseUrl.Portfolio}/networks/${chainId}/smart-transactions/${uuid}`
    : undefined;

  return (
    <Box
      className="smart-transaction-status-page"
      height={BlockSize.Full}
      width={BlockSize.Full}
      display={Display.Flex}
      borderStyle={BorderStyle.none}
      flexDirection={FlexDirection.Column}
      alignItems={AlignItems.center}
      marginBottom={0}
    >
      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        alignItems={AlignItems.center}
        justifyContent={JustifyContent.center}
        paddingLeft={10}
        paddingRight={10}
        style={{ flexGrow: 1 }}
      >
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          alignItems={AlignItems.center}
        >
          <Box display={Display.Flex} style={{ fontSize: '48px' }}>
            <Icon
              name={iconName}
              color={iconColor}
              size={IconSize.Inherit}
              marginBottom={4}
            />
          </Box>
          <Text
            color={TextColor.textDefault}
            variant={TextVariant.headingMd}
            as="h4"
            fontWeight={FontWeight.Bold}
          >
            {title}
          </Text>
        </Box>
        {isSmartTransactionPending && (
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Column}
            alignItems={AlignItems.center}
            width={BlockSize.Full}
          >
            <div className="smart-transaction-status-page__loading-bar-container">
              <div
                className="smart-transaction-status-page__loading-bar"
                style={{
                  width: `${
                    (100 / stxDeadline) *
                    (stxDeadline - timeLeftForPendingStxInSec)
                  }%`,
                }}
              />
            </div>
          </Box>
        )}
        {description && (
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Column}
            alignItems={AlignItems.center}
          >
            <Text
              marginTop={2}
              color={TextColor.textAlternative}
              variant={TextVariant.bodySm}
            >
              {description}
            </Text>
          </Box>
        )}
        {portfolioSmartTransactionStatusUrl && (
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Column}
            marginTop={2}
          >
            <Button
              type="link"
              variant={ButtonVariant.Link}
              onClick={() => {
                if (!isSmartTransactionPending) {
                  onCloseExtension();
                }
                global.platform.openTab({
                  url: portfolioSmartTransactionStatusUrl,
                });
              }}
            >
              {t('viewTransaction')}
            </Button>
          </Box>
        )}
      </Box>
      <Box
        className="smart-transaction-status-page__footer"
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        width={BlockSize.Full}
        padding={4}
        paddingBottom={0}
      >
        {isDapp && !isSmartTransactionPending && (
          <ButtonSecondary
            data-testid="smart-transaction-status-page-footer-close-button"
            onClick={onCloseExtension}
            width={BlockSize.Full}
            marginTop={3}
          >
            {t('closeExtension')}
          </ButtonSecondary>
        )}
        {!isDapp && (
          <ButtonSecondary
            data-testid="smart-transaction-status-page-footer-close-button"
            onClick={onViewActivity}
            width={BlockSize.Full}
            marginTop={3}
          >
            {t('viewActivity')}
          </ButtonSecondary>
        )}
      </Box>
    </Box>
  );
};

export default SmartTransactionStatusPage;
