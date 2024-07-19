import { strict as assert } from 'assert';
import { Suite } from 'mocha';
import {
  scrollAndConfirmAndAssertConfirm,
  withRedesignConfirmationFixtures,
} from '../helpers';
import {
  DAPP_HOST_ADDRESS,
  WINDOW_TITLES,
  openDapp,
  switchToNotificationWindow,
  unlockWallet,
} from '../../../helpers';
import { Ganache } from '../../../seeder/ganache';
import { Driver } from '../../../webdriver/driver';

describe('Confirmation Signature - Sign Typed Data V4', function (this: Suite) {
  if (!process.env.ENABLE_CONFIRMATION_REDESIGN) {
    return;
  }

  it('initiates and confirms', async function () {
    await withRedesignConfirmationFixtures(
      this.test?.fullTitle(),
      async ({
        driver,
        ganacheServer,
      }: {
        driver: Driver;
        ganacheServer: Ganache;
      }) => {
        const addresses = await ganacheServer.getAccounts();
        const publicAddress = addresses?.[0] as string;

        await unlockWallet(driver);
        await openDapp(driver);
        await driver.clickElement('#signTypedDataV4');
        await switchToNotificationWindow(driver);

        await assertInfoValues(driver);
        await scrollAndConfirmAndAssertConfirm(driver);
        await assertVerifiedResults(driver, publicAddress);
      },
    );
  });

  it('initiates and rejects', async function () {
    await withRedesignConfirmationFixtures(
      this.test?.fullTitle(),
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await openDapp(driver);
        await driver.clickElement('#signTypedDataV4');
        await switchToNotificationWindow(driver);

        await driver.clickElement(
          '[data-testid="confirm-footer-cancel-button"]',
        );

        await driver.waitUntilXWindowHandles(2);
        await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);

        const rejectionResult = await driver.waitForSelector({
          css: '#signTypedDataV4Result',
          text: 'Error: User rejected the request.',
        });
        assert.ok(rejectionResult);
      },
    );
  });
});

async function assertInfoValues(driver: Driver) {
  const origin = driver.findElement({ text: DAPP_HOST_ADDRESS });
  const contractPetName = driver.findElement({
    css: '.name__value',
    text: '0xCcCCc...ccccC',
  });

  const primaryType = driver.findElement({ text: 'Mail' });
  const contents = driver.findElement({ text: 'Hello, Bob!' });
  const fromName = driver.findElement({ text: 'Cow' });
  const fromAddressNum0 = driver.findElement({
    css: '.name__value',
    text: '0xCD2a3...DD826',
  });
  const toName = driver.findElement({ text: 'Bob' });
  const toAddressNum2 = driver.findElement({
    css: '.name__value',
    text: '0xB0B0b...00000',
  });
  const attachment = driver.findElement({ text: '0x' });

  assert.ok(await origin, 'origin');
  assert.ok(await contractPetName, 'contractPetName');
  assert.ok(await primaryType, 'primaryType');
  assert.ok(await contents, 'contents');
  assert.ok(await fromName, 'fromName');
  assert.ok(await fromAddressNum0, 'fromAddressNum0');
  assert.ok(await toName, 'toName');
  assert.ok(await toAddressNum2, 'toAddressNum2');
  assert.ok(await attachment, 'attachment');
}

async function assertVerifiedResults(driver: Driver, publicAddress: string) {
  await driver.waitUntilXWindowHandles(2);
  await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);
  await driver.clickElement('#signTypedDataV4Verify');

  const verifyResult = await driver.findElement('#signTypedDataV4Result');
  await driver.waitForSelector({
    css: '#signTypedDataV4VerifyResult',
    text: publicAddress,
  });
  const verifyRecoverAddress = await driver.findElement(
    '#signTypedDataV4VerifyResult',
  );

  assert.equal(
    await verifyResult.getText(),
    '0xcd2f9c55840f5e1bcf61812e93c1932485b524ca673b36355482a4fbdf52f692684f92b4f4ab6f6c8572dacce46bd107da154be1c06939b855ecce57a1616ba71b',
  );
  assert.equal(await verifyRecoverAddress.getText(), publicAddress);
}
