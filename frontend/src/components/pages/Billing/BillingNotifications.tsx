/**
 * BillingNotifications - Main export file
 *
 * This file has been refactored into smaller, more maintainable modules.
 * All functionality is preserved and can be accessed through this main export.
 */

export { default } from './BillingNotifications/BillingNotifications';
export * from './BillingNotifications/types';
export { DEFAULT_NOTIFICATIONS, DEFAULT_TEMPLATES } from './BillingNotifications/constants';
export * from './BillingNotifications/utils';
