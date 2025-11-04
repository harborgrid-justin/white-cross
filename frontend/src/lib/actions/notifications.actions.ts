/**
 * @fileoverview Notification Management Server Actions - Next.js v14+ Compatible
 * @module app/notifications/actions
 *
 * Main entry point for notification system server actions.
 * This file re-exports all notification functionality from specialized modules.
 *
 * HIPAA-compliant server actions for notification system with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all notification operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Architecture:
 * - notifications.types.ts - Type definitions and interfaces
 * - notifications.cache.ts - Cache configuration and cached data functions
 * - notifications.crud.ts - Core CRUD operations
 * - notifications.preferences.ts - Preference management
 * - notifications.templates.ts - Template operations
 * - notifications.forms.ts - Form data handling
 * - notifications.utils.ts - Utility and dashboard functions
 */

'use server';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  ActionResult,
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
  NotificationPreferences,
  UpdateNotificationPreferencesData,
  NotificationTemplate,
  CreateNotificationTemplateData,
  NotificationFilters,
  NotificationAnalytics,
} from './notifications.types';

// ==========================================
// CACHE CONFIGURATION & FUNCTIONS
// ==========================================

export {
  NOTIFICATION_CACHE_TAGS,
  getNotification,
  getNotifications,
  getNotificationPreferences,
  getNotificationTemplates,
  getNotificationAnalytics,
} from './notifications.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createNotificationAction,
  updateNotificationAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from './notifications.crud';

// ==========================================
// PREFERENCES OPERATIONS
// ==========================================

export {
  updateNotificationPreferencesAction,
} from './notifications.preferences';

// ==========================================
// TEMPLATE OPERATIONS
// ==========================================

export {
  createNotificationTemplateAction,
} from './notifications.templates';

// ==========================================
// FORM HANDLING
// ==========================================

export {
  createNotificationFromForm,
  updateNotificationPreferencesFromForm,
} from './notifications.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  notificationExists,
  getNotificationCount,
  getUnreadNotificationCount,
  getNotificationOverview,
  getNotificationsStats,
  getNotificationsDashboardData,
  clearNotificationCache,
} from './notifications.utils';
