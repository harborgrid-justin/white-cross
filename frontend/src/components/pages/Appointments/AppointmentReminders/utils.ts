import {
  Mail,
  MessageSquare,
  Phone,
  Bell
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReminderType, ReminderStatus, ReminderTiming } from './types';

/**
 * Type information for reminder notification channels
 *
 * @interface ReminderTypeInfo
 * @property {LucideIcon} icon - Icon component for the reminder type
 * @property {string} color - Tailwind text color class
 * @property {string} bg - Tailwind background color class
 */
export interface ReminderTypeInfo {
  icon: LucideIcon;
  color: string;
  bg: string;
}

/**
 * Gets icon, color, and background styling for a reminder type
 *
 * @param {ReminderType} type - The reminder notification channel type
 * @returns {ReminderTypeInfo} Icon component and styling classes
 *
 * @example
 * const { icon: Icon, color, bg } = getReminderTypeInfo('email');
 * // Returns: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100' }
 */
export const getReminderTypeInfo = (type: ReminderType): ReminderTypeInfo => {
  const typeInfoMap: Record<ReminderType, ReminderTypeInfo> = {
    email: {
      icon: Mail,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    sms: {
      icon: MessageSquare,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    phone: {
      icon: Phone,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    push: {
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  };

  return typeInfoMap[type];
};

/**
 * Gets Tailwind color classes for a reminder delivery status
 *
 * @param {ReminderStatus} status - The reminder delivery status
 * @returns {string} Combined text and background color classes
 *
 * @example
 * const colorClasses = getStatusColor('delivered');
 * // Returns: 'text-green-600 bg-green-100'
 */
export const getStatusColor = (status: ReminderStatus): string => {
  const statusColorMap: Record<ReminderStatus, string> = {
    scheduled: 'text-blue-600 bg-blue-100',
    sent: 'text-yellow-600 bg-yellow-100',
    delivered: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100',
    cancelled: 'text-gray-600 bg-gray-100'
  };

  return statusColorMap[status];
};

/**
 * Converts reminder timing value to human-readable text
 *
 * @param {ReminderTiming} timing - The timing value relative to appointment
 * @returns {string} Human-readable timing description
 *
 * @example
 * const text = getTimingText('1day');
 * // Returns: '1 day before'
 */
export const getTimingText = (timing: ReminderTiming): string => {
  const timingTextMap: Record<ReminderTiming, string> = {
    '15min': '15 minutes before',
    '30min': '30 minutes before',
    '1hour': '1 hour before',
    '2hours': '2 hours before',
    '4hours': '4 hours before',
    '1day': '1 day before',
    '2days': '2 days before',
    '1week': '1 week before'
  };

  return timingTextMap[timing];
};
