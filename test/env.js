import { generateIconNames } from '../development/generate-icon-names.js';
process.env.METAMASK_ENV = 'test';

/**
 * Used for testing components that use the Icon component
 * 'ui/components/component-library/icon/icon.js'
 */

process.env.ICON_NAMES = generateIconNames();
