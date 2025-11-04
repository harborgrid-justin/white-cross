/**
 * @fileoverview Communications API Service - Unified communications management
 * @module services/modules/communicationsApi
 * @version 2.0.0 - Consolidated Edition (Refactored)
 * @category Services
 *
 * **DEPRECATED**: This file has been refactored into smaller, focused modules.
 * It now re-exports from the new structure for backward compatibility.
 *
 * **New Structure**:
 * - `communications/broadcastsApi.ts` - Broadcast operations
 * - `communications/directMessagesApi.ts` - Direct messaging
 * - `communications/templatesApi.ts` - Template management
 * - `communications/deliveryTrackingApi.ts` - Delivery tracking
 * - `communications/index.ts` - Unified facade
 *
 * ## Migration Guide
 *
 * **Before**:
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communicationsApi';
 * const api = createCommunicationsApi(apiClient);
 * await api.sendBroadcast(id);
 * ```
 *
 * **After**:
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communications';
 * const api = createCommunicationsApi(apiClient);
 * await api.broadcasts.sendBroadcast(id);
 * ```
 *
 * **Or use specific APIs**:
 * ```typescript
 * import { createBroadcastsApi } from '@/services/modules/communications/broadcastsApi';
 * const broadcastsApi = createBroadcastsApi(apiClient);
 * await broadcastsApi.sendBroadcast(id);
 * ```
 *
 * ## Benefits of Refactoring
 *
 * - **Better Organization**: Each concern is in its own file
 * - **Smaller Files**: Each module is under 300 LOC
 * - **Type Safety**: No duplicate type definitions
 * - **Maintainability**: Easier to locate and modify specific functionality
 * - **Tree Shaking**: Better bundle optimization
 * - **Testing**: Easier to test individual modules
 *
 * @deprecated Use `@/services/modules/communications` instead
 */

// Re-export everything from the new structure for backward compatibility
export * from './communications';
export { createCommunicationsApi } from './communications';

/**
 * Legacy CommunicationsApi class re-export
 * @deprecated Use the new module structure
 */
export { CommunicationsApi } from './communications';
