/**
 * Push Notification Entity
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and interfaces
export {
  PushNotification
} from '../../database/models/push-notification.model';

export type {
  NotificationAction,
  NotificationDeliveryResult
} from '../../database/models/push-notification.model';
