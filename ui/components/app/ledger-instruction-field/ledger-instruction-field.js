import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import log from 'loglevel';
import {
  LEDGER_TRANSPORT_TYPES,
  LEDGER_USB_VENDOR_ID,
  WEBHID_CONNECTED_STATUSES,
} from '../../../../shared/constants/hardware-wallets';
import {
  PLATFORM_FIREFOX,
  ENVIRONMENT_TYPE_FULLSCREEN,
} from '../../../../shared/constants/app';

import {
  setLedgerWebHidConnectedStatus,
  getLedgerWebHidConnectedStatus,
} from '../../../ducks/app/app';

import Typography from '../../ui/typography/typography';
import Button from '../../ui/button';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  COLORS,
  FONT_WEIGHT,
  TYPOGRAPHY,
} from '../../../helpers/constants/design-system';
import Dialog from '../../ui/dialog';
import {
  getPlatform,
  getEnvironmentType,
} from '../../../../app/scripts/lib/util';
import { getLedgerTransportType } from '../../../ducks/metamask/metamask';

const renderInstructionStep = (text, show = true, color = COLORS.PRIMARY3) => {
  return (
    show && (
      <Typography
        boxProps={{ margin: 0 }}
        color={color}
        fontWeight={FONT_WEIGHT.BOLD}
        variant={TYPOGRAPHY.H7}
      >
        {text}
      </Typography>
    )
  );
};

export default function LedgerInstructionField({ showDataInstruction }) {
  const t = useI18nContext();
  const dispatch = useDispatch();

  const webHidConnectedStatus = useSelector(getLedgerWebHidConnectedStatus);
  const ledgerTransportType = useSelector(getLedgerTransportType);
  const environmentType = getEnvironmentType();
  const environmentTypeIsFullScreen =
    environmentType === ENVIRONMENT_TYPE_FULLSCREEN;

  const checkWebHidStatusRef = useRef();
  checkWebHidStatusRef.current = () => {
    if (
      ledgerTransportType === LEDGER_TRANSPORT_TYPES.WEBHID &&
      webHidConnectedStatus !== WEBHID_CONNECTED_STATUSES.CONNECTED
    ) {
      window.navigator.hid.getDevices().then((devices) => {
        const webHidIsConnected = devices.some(
          (device) => device.vendorId === Number(LEDGER_USB_VENDOR_ID),
        );
        dispatch(
          setLedgerWebHidConnectedStatus(
            webHidIsConnected
              ? WEBHID_CONNECTED_STATUSES.CONNECTED
              : WEBHID_CONNECTED_STATUSES.NOT_CONNECTED,
          ),
        );
      });
    }
  };

  useEffect(() => {
    checkWebHidStatusRef.current();
  }, []);

  const usingLedgerLive = ledgerTransportType === LEDGER_TRANSPORT_TYPES.LIVE;
  const usingWebHID = ledgerTransportType === LEDGER_TRANSPORT_TYPES.WEBHID;

  const isFirefox = getPlatform() === PLATFORM_FIREFOX;

  return (
    <div>
      <div className="confirm-detail-row">
        <Dialog type="message">
          <div className="ledger-live-dialog">
            {renderInstructionStep(t('ledgerConnectionInstructionHeader'))}
            {renderInstructionStep(
              `- ${t('ledgerConnectionInstructionStepOne')}`,
              !isFirefox && usingLedgerLive,
            )}
            {renderInstructionStep(
              `- ${t('ledgerConnectionInstructionStepTwo')}`,
              !isFirefox && usingLedgerLive,
            )}
            {renderInstructionStep(
              `- ${t('ledgerConnectionInstructionStepThree')}`,
            )}
            {renderInstructionStep(
              `- ${t('ledgerConnectionInstructionStepFour')}`,
              showDataInstruction,
            )}
            {renderInstructionStep(
              <span>
                <Button
                  type="link"
                  onClick={async () => {
                    try {
                      if (environmentTypeIsFullScreen) {
                        const connectedDevices = await window.navigator.hid.requestDevice(
                          {
                            filters: [{ vendorId: LEDGER_USB_VENDOR_ID }],
                          },
                        );
                        const webHidIsConnected = connectedDevices.some(
                          (device) =>
                            device.vendorId === Number(LEDGER_USB_VENDOR_ID),
                        );
                        dispatch(
                          setLedgerWebHidConnectedStatus({
                            webHidConnectedStatus: webHidIsConnected
                              ? WEBHID_CONNECTED_STATUSES.CONNECTED
                              : WEBHID_CONNECTED_STATUSES.NOT_CONNECTED,
                          }),
                        );
                      } else {
                        global.platform.openExtensionInBrowser(
                          null,
                          null,
                          true,
                        );
                      }
                    } catch (e) {
                      log.error(e);
                    }
                  }}
                >
                  {environmentTypeIsFullScreen
                    ? t('clickToConnectLedgerViaWebHID')
                    : t('openFullScreenForLedgerWebHid')}
                </Button>
              </span>,
              usingWebHID &&
                webHidConnectedStatus ===
                  WEBHID_CONNECTED_STATUSES.NOT_CONNECTED,
              COLORS.SECONDARY1,
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

LedgerInstructionField.propTypes = {
  showDataInstruction: PropTypes.bool,
};
