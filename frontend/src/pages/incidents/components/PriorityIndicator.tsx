/**
 * PriorityIndicator Component
 *
 * Flexible visual priority indicator with multiple display styles.
 * Supports dot, flag, and bar styles with animated urgent priority.
 *
 * @module pages/incidents/components/PriorityIndicator
 */

import React from 'react';
import { Flag, Circle, LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Incident priority levels
 */
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Display style variants for priority indicator
 */
export type PriorityStyle = 'dot' | 'flag' | 'bar';

/**
 * Props for the PriorityIndicator component
 *
 * @interface PriorityIndicatorProps
 *
 * @property {IncidentPriority} priority - Priority level of the incident
 * @property {PriorityStyle} [style='dot'] - Visual style of the indicator
 * @property {boolean} [showLabel=false] - Whether to display the priority label
 * @property {string} [className] - Additional CSS classes
 */
export interface PriorityIndicatorProps {
  /** Priority level of the incident */
  priority: IncidentPriority;
  /** Visual style variant */
  style?: PriorityStyle;
  /** Show priority label text */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Configuration object for priority levels
 * Maps each priority to its visual properties (label, color, animation)
 */
const priorityConfig: Record<
  IncidentPriority,
  {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    animate: boolean;
  }
> = {
  LOW: {
    label: 'Low',
    color: 'bg-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-700 dark:text-green-300',
    animate: false
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    animate: false
  },
  HIGH: {
    label: 'High',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-700 dark:text-orange-300',
    animate: false
  },
  URGENT: {
    label: 'Urgent',
    color: 'bg-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-700 dark:text-red-300',
    animate: true
  }
};

/**
 * Dot style indicator component
 */
const DotIndicator: React.FC<{
  priority: IncidentPriority;
  showLabel: boolean;
  className?: string;
}> = ({ priority, showLabel, className }) => {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      <div className="relative">
        <Circle
          size={12}
          className={cn(
            'fill-current',
            config.color.replace('bg-', 'text-'),
            config.animate && 'animate-pulse'
          )}
          aria-hidden="true"
        />
        {config.animate && (
          <Circle
            size={12}
            className={cn(
              'absolute inset-0 fill-current opacity-75 animate-ping',
              config.color.replace('bg-', 'text-')
            )}
            aria-hidden="true"
          />
        )}
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

/**
 * Flag style indicator component
 */
const FlagIndicator: React.FC<{
  priority: IncidentPriority;
  showLabel: boolean;
  className?: string;
}> = ({ priority, showLabel, className }) => {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      <div className="relative">
        <Flag
          size={16}
          className={cn(
            'fill-current',
            config.color.replace('bg-', 'text-'),
            config.animate && 'animate-pulse'
          )}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

/**
 * Bar style indicator component
 */
const BarIndicator: React.FC<{
  priority: IncidentPriority;
  showLabel: boolean;
  className?: string;
}> = ({ priority, showLabel, className }) => {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      <div
        className={cn(
          'w-1 h-6 rounded-full',
          config.color,
          config.animate && 'animate-pulse'
        )}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

/**
 * PriorityIndicator - Visual priority indicator with multiple display styles
 *
 * Flexible indicator component for displaying incident priority levels.
 * Supports three visual styles (dot, flag, bar) with optional labels
 * and automatic animation for urgent priorities.
 *
 * **Features:**
 * - Three display styles: dot, flag, bar
 * - Color-coded priority levels (traffic light pattern)
 * - Animated pulse effect for urgent priorities
 * - Optional text labels
 * - Dark mode support
 * - Full accessibility with ARIA labels
 * - Minimal, compact design
 *
 * **Priority Levels:**
 * - LOW: Green - Routine priority
 * - MEDIUM: Yellow - Moderate priority
 * - HIGH: Orange - High priority
 * - URGENT: Red - Immediate attention required (animated)
 *
 * **Display Styles:**
 * - dot: Colored circle indicator (traffic light style)
 * - flag: Flag icon indicator
 * - bar: Vertical colored bar (ideal for list items)
 *
 * @component
 * @param {PriorityIndicatorProps} props - Component props
 * @returns {JSX.Element} Rendered priority indicator
 *
 * @example
 * ```tsx
 * // Dot indicator with label
 * <PriorityIndicator priority="URGENT" style="dot" showLabel />
 *
 * // Flag indicator without label
 * <PriorityIndicator priority="HIGH" style="flag" />
 *
 * // Bar indicator for list items
 * <PriorityIndicator priority="MEDIUM" style="bar" />
 *
 * // Minimal dot indicator
 * <PriorityIndicator priority="LOW" />
 * ```
 */
export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  style = 'dot',
  showLabel = false,
  className
}) => {
  const config = priorityConfig[priority];

  // Render appropriate style variant
  switch (style) {
    case 'flag':
      return (
        <FlagIndicator
          priority={priority}
          showLabel={showLabel}
          className={className}
        />
      );
    case 'bar':
      return (
        <BarIndicator
          priority={priority}
          showLabel={showLabel}
          className={className}
        />
      );
    case 'dot':
    default:
      return (
        <DotIndicator
          priority={priority}
          showLabel={showLabel}
          className={className}
        />
      );
  }
};

PriorityIndicator.displayName = 'PriorityIndicator';

export default React.memo(PriorityIndicator);
