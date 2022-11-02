const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');
const { TEST_SNAPS_WEBSITE_URL } = require('./enums');

describe('Test Snap update', function () {
  it('can install an old and then updated version', async function () {
    const ganacheOptions = {
      accounts: [
        {
          secretKey:
            '0x7C9529A67102755B7E6102D6D950AC5D5863C98713805CEC576B945B15B71EAC',
          balance: 25000000000000000000,
        },
      ],
    };
    await withFixtures(
      {
        fixtures: 'imported-account',
        ganacheOptions,
        failOnConsoleError: false,
        title: this.test.title,
      },
      async ({ driver }) => {
        await driver.navigate();

        // enter pw into extension
        await driver.fill('#password', 'correct horse battery staple');
        await driver.press('#password', driver.Key.ENTER);

        // open a new tab and navigate to test snaps page and connect
        await driver.openNewPage(TEST_SNAPS_WEBSITE_URL);

        // find and scroll to the correct card and click first
        const snapButton = await driver.findElement('#connectUpdate');
        await driver.scrollToElement(snapButton);
        await driver.delay(500);
        await driver.clickElement('#connectUpdate');

        // switch to metamask extension and click connect
        await driver.waitUntilXWindowHandles(3, 3000, 10000);
        let windowHandles = await driver.getAllWindowHandles();
        const extensionPage = windowHandles[0];
        await driver.switchToWindowWithTitle(
          'MetaMask Notification',
          windowHandles,
        );
        await driver.clickElement(
          {
            text: 'Connect',
            tag: 'button',
          },
          10000,
        );

        await driver.delay(1000);

        // approve install of snap
        windowHandles = await driver.getAllWindowHandles();
        await driver.switchToWindowWithTitle(
          'MetaMask Notification',
          windowHandles,
        );
        await driver.clickElement({
          text: 'Approve & install',
          tag: 'button',
        });

        // navigate to test snap page
        await driver.waitUntilXWindowHandles(2, 3000, 10000);
        windowHandles = await driver.getAllWindowHandles();
        await driver.switchToWindowWithTitle('Test Snaps', windowHandles);
        await driver.delay(1000);

        // find and scroll to the correct card and click first
        const snapButton2 = await driver.findElement('#connectUpdateNew');
        await driver.scrollToElement(snapButton2);
        await driver.delay(500);
        await driver.clickElement('#connectUpdateNew');

        // switch to metamask extension and click connect
        await driver.waitUntilXWindowHandles(3, 3000, 10000);
        await driver.delay(1000);

        // approve update of snap
        windowHandles = await driver.getAllWindowHandles();
        await driver.switchToWindowWithTitle(
          'MetaMask Notification',
          windowHandles,
        );
        await driver.clickElement({
          text: 'Approve & update',
          tag: 'button',
        });

        // navigate to test snap page
        await driver.waitUntilXWindowHandles(2, 3000, 10000);
        windowHandles = await driver.getAllWindowHandles();
        await driver.switchToWindowWithTitle('Test Snaps', windowHandles);

        // look for the correct version text
        const versionResult = await driver.findElement('#updateSnapVersion');
        assert.equal(await versionResult.getText(), '"2.0.0"');
      },
    );
  });
});
