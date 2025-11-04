/**
 * TypeScript type definitions for CommunicationNotifications
 */

/**
 * Notification delivery channel types
 */
export type NotificationChannelType = 'email' | 'sms' | 'push' | 'in_app';

/**
 * Notification category types
 */
export type NotificationCategory = 'emergency' | 'appointment' | 'medication' | 'general' | 'system';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification status types
 */
export type NotificationStatus = 'unread' | 'read' | 'dismissed' | 'archived';

/**
 * Notification type for visual indicators
 */
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

/**
 * Channel delivery status
 */
export type ChannelDeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed';

/**
 * Notification frequency options
 */
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly';

/**
 * Sort options for notifications
 */
export type NotificationSortBy = 'date' | 'priority' | 'category';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Quiet hours configuration
 */
export interface QuietHoursConfig {
  enabled: boolean;
  start_time: string;
  end_time: string;
}

/**
 * Channel delivery information
 */
export interface ChannelDelivery {
  type: NotificationChannelType;
  status: ChannelDeliveryStatus;
  sent_at?: string;
  error_message?: string;
}

/**
 * Notification metadata
 */
export interface NotificationMetadata {
  student_id?: string;
  student_name?: string;
  sender_id?: string;
  sender_name?: string;
  communication_id?: string;
  auto_dismiss_at?: string;
}

/**
 * Notification preference settings
 */
export interface NotificationPreference {
  id: string;
  type: NotificationChannelType;
  category: NotificationCategory;
  enabled: boolean;
  priority_threshold: NotificationPriority;
  quiet_hours: QuietHoursConfig;
  frequency: NotificationFrequency;
  recipients: string[];
}

/**
 * Communication notification item
 */
export interface CommunicationNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: ChannelDelivery[];
  metadata: NotificationMetadata;
  created_at: string;
  updated_at: string;
  read_at?: string;
  dismissed_at?: string;
}

/**
 * Props for the CommunicationNotifications component
 */
export interface CommunicationNotificationsProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Student ID to filter notifications */
  studentId?: string;
  /** Show only unread notifications */
  showUnreadOnly?: boolean;
  /** Callback when notification is read */
  onNotificationRead?: (notificationId: string) => void;
  /** Callback when notification is dismissed */
  onNotificationDismiss?: (notificationId: string) => void;
  /** Callback when notification is archived */
  onNotificationArchive?: (notificationId: string) => void;
  /** Callback when preferences are updated */
  onPreferencesUpdate?: (preferences: NotificationPreference[]) => void;
}

/**
 * Filter state for notifications
 */
export interface NotificationFilters {
  searchQuery: string;
  category: string;
  priority: string;
  status: string;
  sortBy: NotificationSortBy;
  sortOrder: SortOrder;
}
