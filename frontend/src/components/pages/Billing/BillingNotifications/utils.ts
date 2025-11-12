/**
 * Utility functions for Billing Notifications
 */

import type {
  NotificationType,
  NotificationPriority,
  NotificationChannel
} from './types';
import { TYPE_CONFIGS, PRIORITY_CONFIGS, CHANNEL_ICONS } from './constants';

/**
 * Gets notification type configuration
 */
export const getTypeConfig = (type: NotificationType) => {
  return TYPE_CONFIGS[type];
};

/**
 * Gets priority configuration
 */
export const getPriorityConfig = (priority: NotificationPriority) => {
  return PRIORITY_CONFIGS[priority];
};

/**
 * Gets channel icon component
 */
export const getChannelIcon = (channel: NotificationChannel) => {
  return CHANNEL_ICONS[channel];
};

/**
 * Formats currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
