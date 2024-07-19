const {
  defaultGanacheOptions,
  withFixtures,
  switchToNotificationWindow,
  unlockWallet,
  WINDOW_TITLES,
} = require('../helpers');
const FixtureBuilder = require('../fixture-builder');
const { TEST_SNAPS_WEBSITE_URL } = require('./enums');

describe('Test Snap update', function () {
  it('can install an old and then updated version', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        // open a new tab and navigate to test snaps page and connect
        await driver.driver.get(TEST_SNAPS_WEBSITE_URL);

        // wait for page to load
        await driver.waitForSelector({
          text: 'Installed Snaps',
          tag: 'h2',
        });

        // find and scroll to the correct card and connect to update snap
        const snapButton = await driver.findElement('#connectUpdate');
        await driver.scrollToElement(snapButton);
        await driver.delay(1000);
        await driver.clickElement('#connectUpdate');

        // switch to metamask extension and click connect
        await switchToNotificationWindow(driver, 2);
        await driver.clickElement({
          text: 'Connect',
          tag: 'button',
        });

        await driver.waitForSelector({ text: 'Confirm' });

        // scroll to bottom
        await driver.clickElementSafe('[data-testid="snap-install-scroll"]');

        await driver.clickElement({
          text: 'Confirm',
          tag: 'button',
        });

        // wait for permissions popover, click checkboxes and confirm
        const permissionsConfirmButtonSelector =
          '[data-testid="snap-install-warning-modal-confirm"]';
        await driver.waitForSelector(permissionsConfirmButtonSelector);
        await driver.clickElement('.mm-checkbox__input');

        await driver.findClickableElement(permissionsConfirmButtonSelector);
        await driver.clickElementAndWaitToDisappear(
          permissionsConfirmButtonSelector,
        );

        // finish the permission with OK button
        await driver.clickElement('[data-testid="page-container-footer-next"]');

        // navigate to test snap page
        await driver.switchToWindowWithTitle(WINDOW_TITLES.TestSnaps);

        // wait for npm installation success
        await driver.waitForSelector({
          css: '#connectUpdate',
          text: 'Reconnect to Update Snap',
        });

        // find and scroll to the correct card and click first
        const snapButton2 = await driver.findElement('#connectUpdateNew');
        await driver.scrollToElement(snapButton2);
        await driver.delay(1000);
        await driver.clickElement('#connectUpdateNew');

        // switch to metamask extension and update
        await switchToNotificationWindow(driver, 2);
        await driver.waitForSelector({ text: 'Update request' });

        // Scroll to bottom of dialog
        await driver.clickElementSafe('[data-testid="snap-update-scroll"]');
        // Click confirm button
        await driver.clickElementAndWaitToDisappear(
          '[data-testid="page-container-footer-next"]',
        );
        // When it is confirmed, click okay button
        await driver.waitForSelector({ text: 'OK' });
        await driver.clickElement('[data-testid="page-container-footer-next"]');

        // navigate to test snap page
        await driver.switchToWindowWithTitle(WINDOW_TITLES.TestSnaps);

        // look for the correct version text
        await driver.waitForSelector({
          css: '#updateSnapVersion',
          text: '"0.35.2-flask.1"',
        });
      },
    );
  });
});
