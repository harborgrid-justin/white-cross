/**
 * StatusBadge Component
 *
 * Badge component displaying incident status with color-coded visual indicators.
 * Supports workflow states from draft to closed with appropriate styling and icons.
 *
 * @module pages/incidents/components/StatusBadge
 */

import React from 'react';
import {
  FileEdit,
  Send,
  Search,
  CheckCircle2,
  XCircle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Incident status workflow states
 */
export type IncidentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

/**
 * Props for the StatusBadge component
 *
 * @interface StatusBadgeProps
 *
 * @property {IncidentStatus} status - Current status of the incident
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Size variant of the badge
 * @property {boolean} [showIcon=true] - Whether to display the status icon
 * @property {string} [className] - Additional CSS classes
 */
export interface StatusBadgeProps {
  /** Current status of the incident */
  status: IncidentStatus;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon for status */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Configuration object for incident statuses
 * Maps each status to its visual properties (label, colors, icon)
 */
const statusConfig: Record<
  IncidentStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: LucideIcon;
  }
> = {
  DRAFT: {
    label: 'Draft',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-700',
    icon: FileEdit
  },
  SUBMITTED: {
    label: 'Submitted',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: Send
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-800 dark:text-purple-200',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: Search
  },
  RESOLVED: {
    label: 'Resolved',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-200',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: CheckCircle2
  },
  CLOSED: {
    label: 'Closed',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    icon: XCircle
  }
};

/**
 * Size configuration for the badge
 */
const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 text-xs gap-1',
    icon: 12
  },
  md: {
    container: 'px-2.5 py-0.5 text-sm gap-1.5',
    icon: 14
  },
  lg: {
    container: 'px-3 py-1 text-base gap-2',
    icon: 16
  }
};

/**
 * StatusBadge - Display incident status with color-coded styling and icons
 *
 * Visual badge component for incident workflow states. Provides clear status indication
 * throughout the incident lifecycle from creation to closure.
 *
 * **Features:**
 * - Color-coded status levels
 * - Status-appropriate icons
 * - Three size variants
 * - Pill-shaped badge design
 * - Dark mode support
 * - Full accessibility with ARIA labels
 *
 * **Status Workflow:**
 * - DRAFT: Gray - Initial creation, incomplete
 * - SUBMITTED: Blue - Submitted for review
 * - UNDER_REVIEW: Purple - Being actively reviewed
 * - RESOLVED: Green - Issue resolved, pending closure
 * - CLOSED: Dark Gray - Incident closed and archived
 *
 * @component
 * @param {StatusBadgeProps} props - Component props
 * @returns {JSX.Element} Rendered status badge
 *
 * @example
 * ```tsx
 * // Basic submitted status badge
 * <StatusBadge status="SUBMITTED" />
 *
 * // Small badge without icon
 * <StatusBadge status="DRAFT" size="sm" showIcon={false} />
 *
 * // Large resolved badge with custom class
 * <StatusBadge status="RESOLVED" size="lg" className="shadow-sm" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full transition-colors duration-200',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.container,
        className
      )}
      role="status"
      aria-label={`Incident status: ${config.label}`}
    >
      {showIcon && (
        <Icon
          size={sizeStyles.icon}
          className="flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="leading-none">{config.label}</span>
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';

export default React.memo(StatusBadge);
