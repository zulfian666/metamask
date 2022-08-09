import React, { useContext } from 'react';

import { SUPPORT_REQUEST_LINK } from '../../../helpers/constants/common';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  EVENT,
  EVENT_NAMES,
  CONTEXT_FIELDS,
} from '../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';

const BetaHomeFooter = () => {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);

  return (
    <>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={SUPPORT_REQUEST_LINK}
        onClick={() => {
          trackEvent(
            {
              category: EVENT.CATEGORIES.FOOTER,
              event: EVENT_NAMES.SUPPORT_LINK_CLICKED,
              properties: {
                url: SUPPORT_REQUEST_LINK,
              },
            },
            {
              contextFieldsIntoProperties: [CONTEXT_FIELDS.PAGE_TITLE],
            },
          );
        }}
      >
        {t('needHelpSubmitTicket')}
      </a>{' '}
      |{' '}
      <a
        href="https://community.metamask.io/c/metamask-beta"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('needHelpFeedback')}
      </a>
    </>
  );
};

export default BetaHomeFooter;
