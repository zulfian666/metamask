import { Driver } from '../../webdriver/driver';
import { getApp } from '../pages/app';
import HeaderNavbar from '../pages/header-navbar';

export const enableSmartTransactions = async (driver: Driver) => {
  const app = await getApp(driver);
  const navHeader = await app.getHeaderNavbar();
  const settingsPage = await navHeader.openSettings();
  const advancedSettingsPage = await settingsPage.openAdvancedTab();
  await advancedSettingsPage.toggleSmartTransactions();
  await settingsPage.closeSettings();
};
