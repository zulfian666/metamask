const { strict: assert } = require('assert');
const {
  TEST_SEED_PHRASE_TWO,
  withFixtures,
  locateAccountBalanceDOM,
} = require('../../helpers');
const FixtureBuilder = require('../../fixture-builder');

describe('MetaMask Responsive UI', function () {
  it('Creating a new wallet @no-mmi', async function () {
    const driverOptions = { openDevToolsForTabs: true };

    await withFixtures(
      {
        fixtures: new FixtureBuilder({ onboarding: true }).build(),
        driverOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await driver.navigate();
        // agree to terms of use
        await driver.clickElement('[data-testid="onboarding-terms-checkbox"]');

        // welcome
        await driver.clickElement('[data-testid="onboarding-create-wallet"]');

        // metrics
        await driver.clickElement('[data-testid="metametrics-no-thanks"]');

        // create password
        await driver.fill(
          '[data-testid="create-password-new"]',
          'correct horse battery staple',
        );
        await driver.fill(
          '[data-testid="create-password-confirm"]',
          'correct horse battery staple',
        );
        await driver.clickElement('[data-testid="create-password-terms"]');
        await driver.clickElement('[data-testid="create-password-wallet"]');

        // secure wallet
        await driver.clickElement('[data-testid="secure-wallet-recommended"]');

        // review
        await driver.clickElement('[data-testid="recovery-phrase-reveal"]');
        const chipTwo = await (
          await driver.findElement('[data-testid="recovery-phrase-chip-2"]')
        ).getText();
        const chipThree = await (
          await driver.findElement('[data-testid="recovery-phrase-chip-3"]')
        ).getText();
        const chipSeven = await (
          await driver.findElement('[data-testid="recovery-phrase-chip-7"]')
        ).getText();
        await driver.clickElement('[data-testid="recovery-phrase-next"]');

        // confirm
        await driver.fill('[data-testid="recovery-phrase-input-2"]', chipTwo);
        await driver.fill('[data-testid="recovery-phrase-input-3"]', chipThree);
        await driver.fill('[data-testid="recovery-phrase-input-7"]', chipSeven);
        await driver.clickElement('[data-testid="recovery-phrase-confirm"]');

        // complete
        await driver.clickElement('[data-testid="onboarding-complete-done"]');

        // pin extension
        await driver.clickElement('[data-testid="pin-extension-next"]');
        await driver.clickElement('[data-testid="pin-extension-done"]');
        await driver.assertElementNotPresent('.loading-overlay__spinner');
        // assert balance
        const balance = await driver.findElement(
          '[data-testid="eth-overview__primary-currency"]',
        );
        assert.ok(/^0\sETH$/u.test(await balance.getText()));
      },
    );
  });

  it('Importing existing wallet from lock page', async function () {
    const driverOptions = { openDevToolsForTabs: true };

    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        driverOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver, ganacheServer }) => {
        await driver.navigate();

        // Import Secret Recovery Phrase
        const restoreSeedLink = await driver.findClickableElement(
          '.unlock-page__link',
        );
        assert.equal(await restoreSeedLink.getText(), 'Forgot password?');
        await restoreSeedLink.click();

        await driver.pasteIntoField(
          '[data-testid="import-srp__srp-word-0"]',
          TEST_SEED_PHRASE_TWO,
        );

        await driver.fill('#password', 'correct horse battery staple');
        await driver.fill('#confirm-password', 'correct horse battery staple');
        await driver.press('#confirm-password', driver.Key.ENTER);

        // balance renders
        await locateAccountBalanceDOM(driver, ganacheServer);
      },
    );
  });
});
