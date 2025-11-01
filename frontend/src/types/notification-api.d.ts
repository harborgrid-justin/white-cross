/**
 * Notification API Type Extensions
 * Extends browser Notification API types
 */

// Extend the NotificationOptions interface
interface NotificationOptions {
  vibrate?: number[] | number; // Vibration pattern for mobile devices
}
