// Messages and descriptions for these locale keys are in app/_locales/en/messages.json

/**
 * I'm trying something new here, where notifications get names that are translated
 * into numbers in only one place. This should make merge conflicts easier.
 */
export const NOTIFICATION_DROP_LEDGER_FIREFOX = 25;
export const NOTIFICATION_U2F_LEDGER_LIVE = 28;
export const NOTIFICATION_BLOCKAID_DEFAULT = 29;
export const NOTIFICATION_PETNAMES = 31;
export const NOTIFICATION_SIMULATIONS = 33;

type NotificationImage = {
  src: string;
  width: string;
};

type UINotification = {
  id: number;
  date: string | null;
  image?: NotificationImage;
};

// Assuming all keys in UI_NOTIFICATIONS are of the same structure
type UINotifications = {
  [key: number]: UINotification;
};

export const UI_NOTIFICATIONS: UINotifications = {
  8: {
    id: 8,
    date: '2021-11-01',
  },
  20: {
    id: 20,
    date: null,
  },
  24: {
    id: 24,
    date: null,
  },
  // This syntax is unusual, but very helpful here.  It's equivalent to `UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX] =`
  [NOTIFICATION_DROP_LEDGER_FIREFOX]: {
    id: Number(NOTIFICATION_DROP_LEDGER_FIREFOX),
    date: null,
  },
  [NOTIFICATION_U2F_LEDGER_LIVE]: {
    id: Number(NOTIFICATION_U2F_LEDGER_LIVE),
    date: null,
  },
  ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
  [NOTIFICATION_BLOCKAID_DEFAULT]: {
    id: Number(NOTIFICATION_BLOCKAID_DEFAULT),
    date: null,
  },
  ///: END:ONLY_INCLUDE_IF
  [NOTIFICATION_PETNAMES]: {
    id: Number(NOTIFICATION_PETNAMES),
    date: null,
    image: {
      src: 'images/petnames-whatsnew-banner.svg',
      width: '100%',
    },
  },
  [NOTIFICATION_SIMULATIONS]: {
    id: Number(NOTIFICATION_SIMULATIONS),
    date: '2024-04-09',
  },
};

type TranslationFunction = (key: string) => string;

type TranslatedUINotification = {
  id: number;
  date: string | null;
  image?: NotificationImage;
  title: string;
  description: string[] | string;
  actionText?: string;
};

type TranslatedUINotifications = {
  [key: number | string]: TranslatedUINotification;
};

const formatDate = (
  date: string | null,
  formattedLocale: string | undefined,
): string => {
  let parsedDate: Date;
  if (date) {
    const dateParts = date.split('-');
    parsedDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
    );
  } else {
    parsedDate = new Date();
  }

  return new Intl.DateTimeFormat(formattedLocale).format(parsedDate);
};

export const getTranslatedUINotifications = (
  t: TranslationFunction,
  locale: string,
  ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
  theme: string,
  ///: END:ONLY_INCLUDE_IF
): TranslatedUINotifications => {
  // Added return type here
  const formattedLocale = locale?.replace('_', '-');

  return {
    8: {
      ...UI_NOTIFICATIONS[8],
      title: t('notifications8Title'),
      description: [
        t('notifications8DescriptionOne'),
        t('notifications8DescriptionTwo'),
      ],
      date: formatDate(UI_NOTIFICATIONS[8].date, formattedLocale),
      actionText: t('notifications8ActionText'),
    },
    20: {
      ...UI_NOTIFICATIONS[20],
      title: t('notifications20Title'),
      description: [t('notifications20Description')],
      actionText: t('notifications20ActionText'),
      date: UI_NOTIFICATIONS[20].date
        ? formatDate(UI_NOTIFICATIONS[20].date, formattedLocale)
        : '',
    },
    24: {
      ...UI_NOTIFICATIONS[24],
      title: t('notifications24Title'),
      description: t('notifications24Description'),
      actionText: t('notifications24ActionText'),
      date: UI_NOTIFICATIONS[24].date
        ? formatDate(UI_NOTIFICATIONS[24].date, formattedLocale)
        : '',
    },
    // This syntax is unusual, but very helpful here.  It's equivalent to `unnamedObject[NOTIFICATION_DROP_LEDGER_FIREFOX] =`
    [NOTIFICATION_DROP_LEDGER_FIREFOX]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX],
      title: t('notificationsDropLedgerFirefoxTitle'),
      description: [t('notificationsDropLedgerFirefoxDescription')],
      date: UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX].date
        ? formatDate(
            UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX].date,
            formattedLocale,
          )
        : '',
    },
    [NOTIFICATION_U2F_LEDGER_LIVE]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_U2F_LEDGER_LIVE],
      title: t('notificationsU2FLedgerLiveTitle'),
      description: [t('notificationsU2FLedgerLiveDescription')],
      date: UI_NOTIFICATIONS[NOTIFICATION_U2F_LEDGER_LIVE].date
        ? formatDate(
            UI_NOTIFICATIONS[NOTIFICATION_U2F_LEDGER_LIVE].date,
            formattedLocale,
          )
        : '',
    },
    ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
    [NOTIFICATION_BLOCKAID_DEFAULT]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_BLOCKAID_DEFAULT],
      title: t('notificationsBlockaidDefaultTitle'),
      description: [
        t('notificationsBlockaidDefaultDescriptionOne'),
        t('notificationsBlockaidDefaultDescriptionTwo'),
      ],
      actionText: t('notificationsBlockaidDefaultDescriptionActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_BLOCKAID_DEFAULT].date
        ? formatDate(
            UI_NOTIFICATIONS[NOTIFICATION_BLOCKAID_DEFAULT].date,
            formattedLocale,
          )
        : '',
      image:
        theme === 'dark'
          ? {
              src: 'images/blockaid-whats-new-theme-dark.svg',
              width: '100%',
            }
          : {
              src: 'images/blockaid-whats-new.svg',
              width: '100%',
            },
    },
    ///: END:ONLY_INCLUDE_IF
    [NOTIFICATION_PETNAMES]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_PETNAMES],
      title: t('notificationsPetnamesTitle'),
      description: [
        t('notificationsPetnamesDescriptionOne'),
        t('notificationsPetnamesDescriptionTwo'),
      ],
      actionText: t('notificationsPetnamesActionText'),
      date: '',
    },
    [NOTIFICATION_SIMULATIONS]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_SIMULATIONS],
      title: t('simulationsSettingSubHeader'),
      description: [
        t('notificationsSimulationsDescriptionOne'),
        t('notificationsSimulationsDescriptionTwo'),
      ],
      actionText: t('gotIt'),
      date: '',
      image:
        theme === 'dark'
          ? {
              src: 'images/simulations-whatsnew-banner-dark.svg',
              width: '100%',
            }
          : {
              src: 'images/simulations-whatsnew-banner.svg',
              width: '100%',
            },
    },
  };
};
