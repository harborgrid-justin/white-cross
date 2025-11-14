/**
 * Module Loader Helper
 * White Cross School Health Platform
 *
 * Provides helper functions for conditionally loading modules based on
 * configuration without direct process.env access.
 *
 * This allows app.module.ts to avoid direct process.env access while
 * still supporting feature flags for conditional module loading.
 */

import { DynamicModule, Type } from '@nestjs/common';

/**
 * Configuration for conditional module loading
 */
export interface ConditionalModuleConfig {
  /**
   * The module to load
   */
  module: Type<any> | DynamicModule;

  /**
   * Condition function that determines if module should be loaded
   * This is evaluated at import time, so it must use process.env directly
   */
  condition: () => boolean;

  /**
   * Description of what this condition checks (for logging)
   */
  description?: string;
}

/**
 * Conditionally load modules based on environment variables
 *
 * NOTE: This helper is allowed to use process.env because it's in the config/
 * directory and is specifically designed to bridge the gap between module
 * imports (which happen before ConfigService is available) and configuration.
 *
 * @param configs - Array of module configurations
 * @returns Array of modules that meet their conditions
 *
 * @example
 * ```typescript
 * ...loadConditionalModules([
 *   {
 *     module: AnalyticsModule,
 *     condition: () => process.env.ENABLE_ANALYTICS !== 'false',
 *     description: 'Analytics Module (disabled with ENABLE_ANALYTICS=false)',
 *   },
 *   {
 *     module: ReportModule,
 *     condition: () => process.env.ENABLE_REPORTING !== 'false',
 *     description: 'Report Module (disabled with ENABLE_REPORTING=false)',
 *   },
 * ]),
 * ```
 */
export function loadConditionalModules(
  configs: ConditionalModuleConfig[],
): Array<Type<any> | DynamicModule> {
  const loadedModules: Array<Type<any> | DynamicModule> = [];

  for (const config of configs) {
    if (config.condition()) {
      loadedModules.push(config.module);
    }
  }

  return loadedModules;
}

/**
 * Standard feature flag condition helpers
 * These provide consistent feature flag checking across the application
 */
export const FeatureFlags = {
  /**
   * Check if analytics is enabled
   * Default: true (opt-out)
   */
  isAnalyticsEnabled: (): boolean => process.env.ENABLE_ANALYTICS !== 'false',

  /**
   * Check if reporting is enabled
   * Default: true (opt-out)
   */
  isReportingEnabled: (): boolean => process.env.ENABLE_REPORTING !== 'false',

  /**
   * Check if dashboard is enabled
   * Default: true (opt-out)
   */
  isDashboardEnabled: (): boolean => process.env.ENABLE_DASHBOARD !== 'false',

  /**
   * Check if advanced features are enabled
   * Default: true (opt-out)
   */
  isAdvancedFeaturesEnabled: (): boolean =>
    process.env.ENABLE_ADVANCED_FEATURES !== 'false',

  /**
   * Check if enterprise features are enabled
   * Default: true (opt-out)
   */
  isEnterpriseEnabled: (): boolean => process.env.ENABLE_ENTERPRISE !== 'false',

  /**
   * Check if discovery mode is enabled
   * Default: false (opt-in, development only)
   */
  isDiscoveryEnabled: (): boolean =>
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_DISCOVERY === 'true',

  /**
   * Check if CLI mode is enabled
   * Default: false (opt-in)
   */
  isCliModeEnabled: (): boolean => process.env.CLI_MODE === 'true',
};
