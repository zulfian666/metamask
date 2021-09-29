const semver = require('semver');
const { version } = require('../../package.json');

const BuildTypes = {
  beta: 'beta',
  flask: 'flask',
  main: 'main',
};

/**
 * Map the current version to a format that is compatible with each browser.
 *
 * The given version number is assumed to be a SemVer version number. Additionally, if the version
 * has a prerelease component, it is assumed to have the format "<build type>.<build version",
 * where the build version is a positive integer.
 *
 * @param {string} currentVersion - The current version.
 * @param {string[]} platforms - A list of browsers to generate versions for.
 * @returns {Object} An object with the browser as the key and the browser-specific version object
 * as the value.  For example, the version `9.6.0-beta.1` would return the object
 * `{ firefox: { version: '9.6.0.beta1' }, chrome: { version: '9.6.0.1', version_name: 'beta' } }`.
 */
function getBrowserVersionMap(platforms) {
  const major = semver.major(version);
  const minor = semver.minor(version);
  const patch = semver.patch(version);
  const prerelease = semver.prerelease(version);

  let buildType;
  let buildVersion;
  if (prerelease) {
    if (prerelease.length !== 2) {
      throw new Error(`Invalid prerelease version: '${prerelease.join('.')}'`);
    }
    buildType = prerelease[0];
    buildVersion = prerelease[1];
    if (!String(buildVersion).match(/^\d+$/u)) {
      throw new Error(`Invalid prerelease build version: '${buildVersion}'`);
    } else if (buildType !== BuildTypes.beta) {
      throw new Error(`Invalid prerelease build type: ${buildType}`);
    }
  }

  return platforms.reduce((platformMap, platform) => {
    const versionParts = [major, minor, patch];
    const browserSpecificVersion = {};
    if (prerelease) {
      if (platform === 'firefox') {
        versionParts.push(`${buildType}${buildVersion}`);
      } else {
        versionParts.push(buildVersion);
        browserSpecificVersion.version_name = buildType;
      }
    }
    browserSpecificVersion.version = versionParts.join('.');
    platformMap[platform] = browserSpecificVersion;
    return platformMap;
  }, {});
}

module.exports = {
  BuildTypes,
  getBrowserVersionMap,
};
