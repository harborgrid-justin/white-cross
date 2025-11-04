/**
 * CommunicationNotifications module
 *
 * Exports the main component, types, and sub-components for external use
 */

// Main component (default export for backward compatibility)
export { CommunicationNotifications as default } from './CommunicationNotifications';
export { CommunicationNotifications } from './CommunicationNotifications';

// Type exports
export type {
  CommunicationNotification,
  NotificationPreference,
  CommunicationNotificationsProps,
  NotificationChannelType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
  ChannelDeliveryStatus,
  NotificationFrequency,
  NotificationSortBy,
  SortOrder,
  QuietHoursConfig,
  ChannelDelivery,
  NotificationMetadata,
  NotificationFilters
} from './types';

// Sub-component exports (optional, for advanced usage)
export { NotificationItem } from './components/NotificationItem';
export { NotificationFilters } from './components/NotificationFilters';
export { PreferencesModal } from './components/PreferencesModal';
export { ChannelSettings } from './components/ChannelSettings';
export { QuietHours } from './components/QuietHours';
export { PrioritySettings } from './components/PrioritySettings';

// Utility exports (optional, for advanced usage)
export {
  getTypeIcon,
  getPriorityColor,
  getChannelIcon,
  filterBySearch,
  filterByCategory,
  filterByPriority,
  filterByStatus,
  sortNotifications,
  applyFiltersAndSort
} from './utils';

// Hook exports (optional, for advanced usage)
export {
  useNotifications,
  useNotificationFilters,
  useNotificationPreferences,
  useBulkActions
} from './hooks';
