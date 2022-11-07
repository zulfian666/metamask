import { prependZero } from '../../../shared/modules/string-utils';

export default class BackupController {
  constructor(opts = {}) {
    const {
      preferencesController,
      addressBookController,
      trackMetaMetricsEvent,
    } = opts;

    this.preferencesController = preferencesController;
    this.addressBookController = addressBookController;
    this._trackMetaMetricsEvent = trackMetaMetricsEvent;
  }

  async restoreUserData(jsonString) {
    const existingPreferences = this.preferencesController.store.getState();
    const { preferences, addressBook } = JSON.parse(jsonString);
    if (preferences) {
      preferences.identities = existingPreferences.identities;
      preferences.lostIdentities = existingPreferences.lostIdentities;
      preferences.selectedAddress = existingPreferences.selectedAddress;

      this.preferencesController.store.updateState(preferences);
    }

    if (addressBook) {
      this.addressBookController.update(addressBook, true);
    }

    if (preferences && addressBook) {
      this._trackMetaMetricsEvent({
        event: 'User Data Imported',
        category: 'Backup',
      });
    }
  }

  async backupUserData() {
    const userData = {
      preferences: { ...this.preferencesController.store.getState() },
      addressBook: { ...this.addressBookController.state },
    };

    /**
     * We can remove these properties since we will won't be restoring identities from backup
     */
    delete userData.preferences.identities;
    delete userData.preferences.lostIdentities;
    delete userData.preferences.selectedAddress;

    const result = JSON.stringify(userData);

    const date = new Date();

    const prefixZero = (num) => prependZero(num, 2);

    /*
     * userData.YYYY_MM_DD_HH_mm_SS e.g userData.2022_01_13_13_45_56
     * */
    const userDataFileName = `MetaMaskUserData.${date.getFullYear()}_${prefixZero(
      date.getMonth() + 1,
    )}_${prefixZero(date.getDay())}_${prefixZero(date.getHours())}_${prefixZero(
      date.getMinutes(),
    )}_${prefixZero(date.getDay())}.json`;

    return { fileName: userDataFileName, data: result };
  }
}
