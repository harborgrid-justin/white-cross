/**
 * @fileoverview Configuration Management Barrel Export
 * @module core/config
 *
 * Comprehensive configuration management utilities including environment variable
 * parsing, file loading, validation, secrets management, and feature flags.
 *
 * @example Environment variable parsing
 * ```typescript
 * import { parseEnvArray, parseEnvDuration, parseEnvURL } from '@reuse/core/config';
 *
 * const hosts = parseEnvArray('DATABASE_HOSTS', ',');
 * const timeout = parseEnvDuration('SESSION_TIMEOUT');
 * const apiUrl = parseEnvURL('API_URL');
 * ```
 *
 * @example Configuration hierarchy
 * ```typescript
 * import { createConfigHierarchy } from '@reuse/core/config';
 *
 * const config = createConfigHierarchy(
 *   ['default', 'production', 'local'],
 *   { baseDir: './config', extension: '.json' }
 * );
 * ```
 *
 * @example Feature flags
 * ```typescript
 * import { createFeatureFlagService } from '@reuse/core/config';
 *
 * const flags = createFeatureFlagService({
 *   newUI: { enabled: true, rollout: 50 },
 *   betaFeatures: { enabled: true, segments: ['beta-testers'] }
 * });
 *
 * if (flags.isEnabled('newUI', { userId: user.id })) {
 *   // Show new UI
 * }
 * ```
 */
export * from './parsers';
export * from './validation';
export * from './secrets';
export * from './feature-flags';
export * from './management-kit';
export * from './environment-kit';
export { default as ConfigManagementKit } from './management-kit';
export { default as EnvironmentKit } from './environment-kit';
//# sourceMappingURL=index.d.ts.map