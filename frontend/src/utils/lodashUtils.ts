/**
 * WF-COMP-343 | lodashUtils.ts - Main barrel export for lodash utilities
 * Purpose: Re-exports all lodash utility modules for backward compatibility
 * Upstream: React, external libs | Dependencies: lodash utility modules
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: All utility objects | Key Features: Barrel export pattern
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: Main barrel export for refactored lodashUtils modules
 */

// Import all utility modules
export { arrayUtils } from './lodashUtils.arrays';
export { objectUtils } from './lodashUtils.objects';
export { stringUtils } from './lodashUtils.strings';
export { functionUtils, dateUtils, validationUtils, mathUtils } from './lodashUtils.functions';
export { reactUtils, healthcareUtils } from './lodashUtils.react';

// Re-import for default export
import { arrayUtils } from './lodashUtils.arrays';
import { objectUtils } from './lodashUtils.objects';
import { stringUtils } from './lodashUtils.strings';
import { functionUtils, dateUtils, validationUtils, mathUtils } from './lodashUtils.functions';
import { reactUtils, healthcareUtils } from './lodashUtils.react';

/**
 * Default export object containing all utility modules
 * Maintains backward compatibility with existing imports
 */
export default {
  arrayUtils,
  objectUtils,
  stringUtils,
  functionUtils,
  dateUtils,
  validationUtils,
  mathUtils,
  reactUtils,
  healthcareUtils,
};
