/**
 * @fileoverview System API Legacy Compatibility Layer
 *
 * @deprecated This service is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/admin.monitoring and @/lib/actions/admin.settings instead.
 * See: /src/services/modules/DEPRECATED.md for migration guide
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // Before:
 * import { systemApi } from '@/services/modules/systemApi';
 * const health = await systemApi.getHealthStatus();
 * const settings = await systemApi.getSettings();
 *
 * // After:
 * import { getSystemHealth } from '@/lib/actions/admin.monitoring';
 * import { getSystemSettings } from '@/lib/actions/admin.settings';
 * const health = await getSystemHealth();
 * const settings = await getSystemSettings();
 * ```
 *
 * This file provides backward compatibility for the legacy systemApi import.
 * The actual implementation has been refactored into a modular structure
 * located in the ./systemApi/ directory for better maintainability.
 */

// Re-export everything from the modular systemApi implementation
export * from './systemApi/index';

// Default export for backward compatibility
export { default } from './systemApi/index';
