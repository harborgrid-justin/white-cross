/**
 * NotificationStatus Component
 *
 * Status indicator badge for parent notification delivery status.
 * Provides color-coded visual feedback for notification states with tooltips.
 *
 * @module pages/incidents/components/NotificationStatus
 */

import React from 'react';
import {
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  Eye,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Notification delivery status states
 */
export type NotificationStatusType =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'READ';

/**
 * Props for the NotificationStatus component
 *
 * @interface NotificationStatusProps
 *
 * @property {NotificationStatusType} status - Current status of the notification
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Size variant of the status indicator
 * @property {boolean} [showIcon=true] - Whether to display the status icon
 * @property {boolean} [showTooltip=true] - Whether to show tooltip on hover
 * @property {string} [tooltip] - Custom tooltip text (auto-generated if not provided)
 * @property {string} [className] - Additional CSS classes
 */
export interface NotificationStatusProps {
  /** Current status of the notification */
  status: NotificationStatusType;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon for status */
  showIcon?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Custom tooltip text */
  tooltip?: string;
  /** Custom className */
  className?: string;
}

/**
 * Configuration object for notification statuses
 * Maps each status to its visual properties (label, colors, icon, tooltip)
 */
const statusConfig: Record<
  NotificationStatusType,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: LucideIcon;
    defaultTooltip: string;
  }
> = {
  PENDING: {
    label: 'Pending',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-300 dark:border-gray-700',
    icon: Clock,
    defaultTooltip: 'Notification queued for delivery'
  },
  SENT: {
    label: 'Sent',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-300 dark:border-blue-800',
    icon: Send,
    defaultTooltip: 'Notification sent to recipient'
  },
  DELIVERED: {
    label: 'Delivered',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-200',
    borderColor: 'border-green-300 dark:border-green-800',
    icon: CheckCircle2,
    defaultTooltip: 'Notification delivered successfully'
  },
  FAILED: {
    label: 'Failed',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-200',
    borderColor: 'border-red-300 dark:border-red-800',
    icon: XCircle,
    defaultTooltip: 'Notification delivery failed'
  },
  READ: {
    label: 'Read',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    icon: Eye,
    defaultTooltip: 'Notification read by recipient'
  }
};

/**
 * Size configuration for the status badge
 */
const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 text-xs gap-1',
    icon: 12
  },
  md: {
    container: 'px-2.5 py-1 text-sm gap-1.5',
    icon: 14
  },
  lg: {
    container: 'px-3 py-1.5 text-base gap-2',
    icon: 16
  }
};

/**
 * NotificationStatus - Display notification delivery status with color-coded styling
 *
 * Visual badge component for notification delivery states. Provides clear status indication
 * for parent notifications throughout the incident notification lifecycle.
 *
 * **Features:**
 * - Color-coded status levels
 * - Status-appropriate icons
 * - Three size variants
 * - Pill-shaped badge design
 * - Hover tooltips with status details
 * - Dark mode support
 * - Full accessibility with ARIA labels
 *
 * **Status Lifecycle:**
 * - PENDING: Gray - Notification queued, not yet sent
 * - SENT: Blue - Notification sent to delivery system
 * - DELIVERED: Green - Notification successfully delivered
 * - FAILED: Red - Notification delivery failed
 * - READ: Emerald - Notification opened/read by recipient
 *
 * @component
 * @param {NotificationStatusProps} props - Component props
 * @returns {JSX.Element} Rendered notification status badge
 *
 * @example
 * ```tsx
 * // Basic delivered status
 * <NotificationStatus status="DELIVERED" />
 *
 * // Small badge without icon
 * <NotificationStatus status="SENT" size="sm" showIcon={false} />
 *
 * // Large badge with custom tooltip
 * <NotificationStatus
 *   status="FAILED"
 *   size="lg"
 *   tooltip="Email delivery failed - invalid address"
 * />
 * ```
 */
export const NotificationStatus: React.FC<NotificationStatusProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showTooltip = true,
  tooltip,
  className
}) => {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;
  const tooltipText = tooltip || config.defaultTooltip;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full transition-colors duration-200',
        'relative group',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.container,
        className
      )}
      role="status"
      aria-label={`Notification status: ${config.label}`}
      title={showTooltip ? tooltipText : undefined}
    >
      {showIcon && (
        <Icon
          size={sizeStyles.icon}
          className="flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="leading-none">{config.label}</span>

      {/* Tooltip */}
      {showTooltip && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                     bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
                     opacity-0 group-hover:opacity-100 pointer-events-none
                     transition-opacity duration-200 whitespace-nowrap z-10
                     shadow-lg"
          role="tooltip"
        >
          {tooltipText}
          {/* Tooltip arrow */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2
                       border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
};

NotificationStatus.displayName = 'NotificationStatus';

export default React.memo(NotificationStatus);
