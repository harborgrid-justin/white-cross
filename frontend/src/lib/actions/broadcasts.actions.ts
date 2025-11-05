/**
 * @fileoverview Broadcast Management Server Actions - Main Entry Point
 * @module app/broadcasts/actions
 *
 * HIPAA-compliant server actions for broadcast communication management.
 * This file serves as the main entry point and re-exports from specialized modules.
 *
 * Architecture:
 * - broadcasts.types.ts - TypeScript interfaces and types
 * - broadcasts.cache.ts - Cached data fetching functions
 * - broadcasts.crud.ts - Create and update operations
 * - broadcasts.delivery.ts - Broadcast delivery operations
 * - broadcasts.templates.ts - Template management
 * - broadcasts.analytics.ts - Statistics and analytics
 * - broadcasts.forms.ts - Form data handling
 * - broadcasts.utils.ts - Utility functions
 *
 * NOTE: This barrel file does NOT have 'use server' directive.
 * The 'use server' directive is present in implementation files that define
 * actual Server Actions. Barrel files cannot have 'use server' when re-exporting.
 */

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  Broadcast,
  CreateBroadcastData,
  UpdateBroadcastData,
  BroadcastTemplate,
  CreateBroadcastTemplateData,
  UpdateBroadcastTemplateData,
  BroadcastFilters,
  BroadcastAnalytics,
  BroadcastStats,
} from './broadcasts.types';

export { BROADCAST_CACHE_TAGS } from './broadcasts.types';

// ==========================================
// CACHE FUNCTIONS
// ==========================================

export {
  getBroadcast,
  getBroadcasts,
  getBroadcastTemplate,
  getBroadcastTemplates,
  getBroadcastAnalytics,
} from './broadcasts.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createBroadcastAction,
  updateBroadcastAction,
} from './broadcasts.crud';

// ==========================================
// DELIVERY OPERATIONS
// ==========================================

export {
  sendBroadcastAction,
} from './broadcasts.delivery';

// ==========================================
// TEMPLATE OPERATIONS
// ==========================================

export {
  createBroadcastTemplateAction,
} from './broadcasts.templates';

// ==========================================
// ANALYTICS FUNCTIONS
// ==========================================

export {
  getBroadcastStats,
  getBroadcastDashboardData,
  getBroadcastOverview,
} from './broadcasts.analytics';

// ==========================================
// FORM HANDLING
// ==========================================

export {
  createBroadcastFromForm,
  createBroadcastTemplateFromForm,
} from './broadcasts.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  broadcastExists,
  broadcastTemplateExists,
  getBroadcastCount,
  getBroadcastTemplateCount,
  clearBroadcastCache,
} from './broadcasts.utils';
