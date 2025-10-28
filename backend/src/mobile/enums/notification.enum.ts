/**
 * Mobile notification enums
 */

export enum NotificationPlatform {
  FCM = 'FCM',           // Firebase Cloud Messaging (Android)
  APNS = 'APNS',         // Apple Push Notification Service (iOS)
  WEB_PUSH = 'WEB_PUSH', // Web Push API
  SMS = 'SMS',           // Fallback SMS
  EMAIL = 'EMAIL'        // Fallback Email
}

export enum NotificationPriority {
  CRITICAL = 'CRITICAL',   // Immediate delivery, sound, vibration
  HIGH = 'HIGH',           // High priority, sound
  NORMAL = 'NORMAL',       // Normal delivery
  LOW = 'LOW'              // Low priority, no sound
}

export enum NotificationCategory {
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
  INCIDENT = 'INCIDENT',
  SCREENING = 'SCREENING',
  IMMUNIZATION = 'IMMUNIZATION',
  MESSAGE = 'MESSAGE',
  EMERGENCY = 'EMERGENCY',
  REMINDER = 'REMINDER',
  ALERT = 'ALERT',
  SYSTEM = 'SYSTEM'
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export enum DeliveryStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  RATE_LIMITED = 'RATE_LIMITED',
  TIMEOUT = 'TIMEOUT'
}
