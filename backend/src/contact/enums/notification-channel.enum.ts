/**
 * Valid notification channels for emergency contact communication
 */
export const VALID_NOTIFICATION_CHANNELS = ['sms', 'email', 'voice'] as const;

/**
 * Type definition for notification channels
 */
export type NotificationChannel = (typeof VALID_NOTIFICATION_CHANNELS)[number];
