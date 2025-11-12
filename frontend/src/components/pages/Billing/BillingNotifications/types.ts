/**
 * Type definitions for the Billing Notifications module
 */

/**
 * Notification types
 */
export type NotificationType = 'payment-received' | 'payment-overdue' | 'invoice-sent' | 'invoice-viewed' |
  'payment-failed' | 'reminder-sent' | 'system-alert' | 'billing-update' | 'collection-notice';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification status types
 */
export type NotificationStatus = 'unread' | 'read' | 'archived' | 'starred';

/**
 * Notification delivery channel types
 */
export type NotificationChannel = 'email' | 'sms' | 'in-app' | 'push' | 'webhook';

/**
 * Billing notification interface
 */
export interface BillingNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  patientId?: string;
  patientName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount?: number;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  starredAt?: string;
  scheduledFor?: string;
  sentAt?: string;
  deliveryStatus?: {
    email?: 'pending' | 'sent' | 'delivered' | 'failed';
    sms?: 'pending' | 'sent' | 'delivered' | 'failed';
    push?: 'pending' | 'sent' | 'delivered' | 'failed';
  };
}

/**
 * Notification template interface
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  content: string;
  channels: NotificationChannel[];
  enabled: boolean;
  schedule?: {
    enabled: boolean;
    delay: number;
    unit: 'minutes' | 'hours' | 'days';
    repeat?: {
      enabled: boolean;
      interval: number;
      maxRepeats: number;
    };
  };
}

/**
 * Props for the BillingNotifications component
 */
export interface BillingNotificationsProps {
  /** Array of billing notifications */
  notifications?: BillingNotification[];
  /** Available notification templates */
  templates?: NotificationTemplate[];
  /** Unread notifications count */
  unreadCount?: number;
  /** Loading state */
  loading?: boolean;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  filters?: {
    type: NotificationType[];
    priority: NotificationPriority[];
    status: NotificationStatus[];
    channel: NotificationChannel[];
  };
  /** Custom CSS classes */
  className?: string;
  /** Notification click handler */
  onNotificationClick?: (notification: BillingNotification) => void;
  /** Mark as read handler */
  onMarkAsRead?: (notificationIds: string[]) => void;
  /** Mark as unread handler */
  onMarkAsUnread?: (notificationIds: string[]) => void;
  /** Star notification handler */
  onStarNotification?: (notificationId: string) => void;
  /** Archive notification handler */
  onArchiveNotification?: (notificationIds: string[]) => void;
  /** Delete notification handler */
  onDeleteNotification?: (notificationIds: string[]) => void;
  /** Send notification handler */
  onSendNotification?: (templateId: string, recipientId: string) => void;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: BillingNotificationsProps['filters']) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
}

/**
 * Props for the NotificationItem component
 */
export interface NotificationItemProps {
  notification: BillingNotification;
  isSelected: boolean;
  onSelect: (notificationId: string, selected: boolean) => void;
  onNotificationClick?: (notification: BillingNotification) => void;
  onStarNotification?: (notificationId: string) => void;
}
