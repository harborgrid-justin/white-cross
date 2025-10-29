'use client';

/**
 * WF-MSG-001 | MessageTimestamp.tsx - Message Timestamp Component
 * Purpose: Display relative message timestamps with full date on hover
 * Dependencies: React, date-fns
 * Features: Relative time, full date on hover, auto-update, accessibility
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

/**
 * Props for the MessageTimestamp component.
 *
 * @interface MessageTimestampProps
 * @property {Date | string} timestamp - The message timestamp (Date object or ISO string)
 * @property {boolean} [showSeconds=false] - Show seconds in relative time
 * @property {boolean} [alwaysShowDate=false] - Always show full date instead of relative
 * @property {string} [className] - Additional CSS classes
 * @property {('short' | 'long')} [format='short'] - Format style (e.g., "2m" vs "2 minutes ago")
 */
export interface MessageTimestampProps {
  timestamp: Date | string;
  showSeconds?: boolean;
  alwaysShowDate?: boolean;
  className?: string;
  format?: 'short' | 'long';
}

/**
 * Formats a timestamp into a short relative format (e.g., "2m", "1h", "3d").
 *
 * @param {Date} date - The date to format
 * @returns {string} Short relative time string
 */
const formatShortRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;

  return format(date, 'MMM d');
};

/**
 * Formats a timestamp into a contextual display format.
 *
 * Shows:
 * - Time only if today (e.g., "2:30 PM")
 * - "Yesterday" with time if yesterday
 * - Day of week if this week (e.g., "Monday")
 * - Date if this year (e.g., "Mar 15")
 * - Full date if older (e.g., "Mar 15, 2024")
 *
 * @param {Date} date - The date to format
 * @returns {string} Contextual time string
 */
const formatContextualTime = (date: Date): string => {
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisYear(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
};

/**
 * Message timestamp component for displaying message times.
 *
 * Displays timestamps in a user-friendly format with automatic updates
 * and full date on hover. Supports both short relative formats (2m, 1h)
 * and long relative formats (2 minutes ago, 1 hour ago).
 *
 * **Features:**
 * - Automatic time updates every minute
 * - Relative time display (e.g., "2m ago", "1h ago")
 * - Full date on hover via title attribute
 * - Short and long format options
 * - Contextual time formatting
 * - Accessibility with time element
 * - Dark mode support
 *
 * **Accessibility:**
 * - Uses semantic <time> element
 * - datetime attribute for machine-readable format
 * - title attribute for full date on hover
 * - Screen reader friendly
 *
 * @component
 * @param {MessageTimestampProps} props - Component props
 * @returns {JSX.Element} Rendered timestamp element
 *
 * @example
 * ```tsx
 * // Short format (default)
 * <MessageTimestamp timestamp={new Date()} />
 * // Output: "2m"
 *
 * // Long format
 * <MessageTimestamp timestamp={message.createdAt} format="long" />
 * // Output: "2 minutes ago"
 *
 * // Always show full date
 * <MessageTimestamp timestamp={date} alwaysShowDate />
 * // Output: "Oct 29, 2025 2:30 PM"
 *
 * // With custom styling
 * <MessageTimestamp
 *   timestamp={message.timestamp}
 *   className="text-xs text-gray-500"
 * />
 * ```
 */
export const MessageTimestamp = React.memo<MessageTimestampProps>(({
  timestamp,
  showSeconds = false,
  alwaysShowDate = false,
  className = '',
  format: formatStyle = 'short',
}) => {
  const [displayTime, setDisplayTime] = useState<string>('');

  // Convert string to Date if needed
  const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  useEffect(() => {
    const updateTime = () => {
      if (alwaysShowDate) {
        setDisplayTime(format(dateObj, 'MMM d, yyyy h:mm a'));
      } else if (formatStyle === 'short') {
        setDisplayTime(formatShortRelativeTime(dateObj));
      } else {
        setDisplayTime(formatDistanceToNow(dateObj, { addSuffix: true, includeSeconds: showSeconds }));
      }
    };

    updateTime();

    // Update every minute for relative times
    if (!alwaysShowDate) {
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [dateObj, alwaysShowDate, formatStyle, showSeconds]);

  // Full date for title attribute (shown on hover)
  const fullDate = format(dateObj, 'PPpp'); // e.g., "Oct 29, 2025, 2:30:00 PM"

  return (
    <time
      dateTime={dateObj.toISOString()}
      title={fullDate}
      className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}
      aria-label={`Sent ${fullDate}`}
    >
      {displayTime}
    </time>
  );
});

MessageTimestamp.displayName = 'MessageTimestamp';

export default MessageTimestamp;
