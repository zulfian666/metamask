const { Browser } = require('selenium-webdriver');
const { Driver } = require('./driver');
const ChromeDriver = require('./chrome');
const FirefoxDriver = require('./firefox');

async function buildWebDriver({ responsive, port } = {}) {
  const browser = process.env.SELENIUM_BROWSER;

  const {
    driver: seleniumDriver,
    extensionId,
    extensionUrl,
  } = await buildBrowserWebDriver(browser, { responsive, port });
  const driver = new Driver(seleniumDriver, browser, extensionUrl);

  // Wait for fetch mock service worker to start, and for background to initialize
  await driver.delay(2000);

  return {
    driver,
    extensionId,
  };
}

async function buildBrowserWebDriver(browser, webDriverOptions) {
  switch (browser) {
    case Browser.CHROME: {
      return await ChromeDriver.build(webDriverOptions);
    }
    case Browser.FIREFOX: {
      return await FirefoxDriver.build(webDriverOptions);
    }
    default: {
      throw new Error(`Unrecognized browser: ${browser}`);
    }
  }
}

module.exports = {
  buildWebDriver,
};
