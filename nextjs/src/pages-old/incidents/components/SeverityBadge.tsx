/**
 * SeverityBadge Component
 *
 * Badge component displaying incident severity levels with color-coded visual indicators.
 * Supports LOW, MEDIUM, HIGH, and CRITICAL severity levels with appropriate styling and icons.
 *
 * @module pages/incidents/components/SeverityBadge
 */

import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  XOctagon,
  AlertOctagon,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Incident severity levels
 */
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Props for the SeverityBadge component
 *
 * @interface SeverityBadgeProps
 *
 * @property {IncidentSeverity} severity - Severity level of the incident
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Size variant of the badge
 * @property {boolean} [showIcon=true] - Whether to display the severity icon
 * @property {string} [className] - Additional CSS classes
 */
export interface SeverityBadgeProps {
  /** Severity level of the incident */
  severity: IncidentSeverity;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon for severity level */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Configuration object for severity levels
 * Maps each severity to its visual properties (label, colors, icon)
 */
const severityConfig: Record<
  IncidentSeverity,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: LucideIcon;
  }
> = {
  LOW: {
    label: 'Low',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-200',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: AlertCircle
  },
  MEDIUM: {
    label: 'Medium',
    bgColor: 'bg-amber-100 dark:bg-amber-900',
    textColor: 'text-amber-800 dark:text-amber-200',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: AlertTriangle
  },
  HIGH: {
    label: 'High',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-800 dark:text-orange-200',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: XOctagon
  },
  CRITICAL: {
    label: 'Critical',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-200',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: AlertOctagon
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
 * SeverityBadge - Display incident severity with color-coded styling and icons
 *
 * Visual badge component for incident severity levels. Provides immediate visual feedback
 * about incident priority with color-coding and optional icons.
 *
 * **Features:**
 * - Color-coded severity levels (green, amber, orange, red)
 * - Optional severity icons
 * - Three size variants
 * - Dark mode support
 * - Full accessibility with ARIA labels
 * - Rounded pill shape
 *
 * **Severity Levels:**
 * - LOW: Green - Minor incidents requiring routine follow-up
 * - MEDIUM: Amber - Moderate incidents requiring timely attention
 * - HIGH: Orange - Serious incidents requiring prompt action
 * - CRITICAL: Red - Emergency incidents requiring immediate response
 *
 * @component
 * @param {SeverityBadgeProps} props - Component props
 * @returns {JSX.Element} Rendered severity badge
 *
 * @example
 * ```tsx
 * // Basic critical severity badge
 * <SeverityBadge severity="CRITICAL" />
 *
 * // Small badge without icon
 * <SeverityBadge severity="LOW" size="sm" showIcon={false} />
 *
 * // Large high severity badge with custom class
 * <SeverityBadge severity="HIGH" size="lg" className="shadow-sm" />
 * ```
 */
export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = severityConfig[severity];
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
      aria-label={`Incident severity: ${config.label}`}
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

SeverityBadge.displayName = 'SeverityBadge';

export default React.memo(SeverityBadge);
