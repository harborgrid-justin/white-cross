import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle, XCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Timeline event status
 */
export type TimelineEventStatus = 'completed' | 'current' | 'pending' | 'error' | 'cancelled';

/**
 * Timeline event
 */
export interface TimelineEvent {
  /** Unique event ID */
  id: string;
  /** Event title */
  title: string;
  /** Event description */
  description?: string;
  /** Event timestamp */
  timestamp: Date | string;
  /** Event status */
  status: TimelineEventStatus;
  /** Event author/actor */
  actor?: string;
  /** Custom icon */
  icon?: React.ElementType;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Custom badge */
  badge?: {
    label: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  };
}

/**
 * StatusTimeline props
 */
export interface StatusTimelineProps {
  /** Array of timeline events */
  events: TimelineEvent[];
  /** Variant for styling */
  variant?: 'default' | 'compact' | 'detailed';
  /** Show connecting lines */
  showLines?: boolean;
  /** Custom className */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Date format function */
  formatDate?: (date: Date | string) => string;
}

const statusConfig: Record<TimelineEventStatus, {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}> = {
  completed: {
    icon: Check,
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-500 dark:border-green-400'
  },
  current: {
    icon: Clock,
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-500 dark:border-blue-400'
  },
  pending: {
    icon: Circle,
    iconColor: 'text-gray-400 dark:text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-500 dark:border-red-400'
  },
  cancelled: {
    icon: XCircle,
    iconColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-400 dark:border-gray-500'
  }
};

const defaultFormatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(d);
};

/**
 * StatusTimeline - Display chronological status history with visual timeline
 *
 * @example
 * ```tsx
 * const events: TimelineEvent[] = [
 *   {
 *     id: '1',
 *     title: 'Application Submitted',
 *     description: 'Student application received',
 *     timestamp: new Date('2024-01-15'),
 *     status: 'completed',
 *     actor: 'Parent (John Doe)'
 *   },
 *   {
 *     id: '2',
 *     title: 'Under Review',
 *     description: 'Application being reviewed by admin',
 *     timestamp: new Date('2024-01-16'),
 *     status: 'current',
 *     actor: 'Admin (Jane Smith)'
 *   }
 * ];
 *
 * <StatusTimeline events={events} variant="detailed" />
 * ```
 */
export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  events,
  variant = 'default',
  showLines = true,
  className,
  emptyMessage = 'No timeline events',
  formatDate = defaultFormatDate
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)} role="list" aria-label="Status timeline">
      {events.map((event, index) => {
        const config = statusConfig[event.status];
        const Icon = event.icon || config.icon;
        const isLast = index === events.length - 1;

        return (
          <div
            key={event.id}
            className={cn(
              'relative flex gap-4',
              variant === 'compact' ? 'pb-4' : 'pb-8'
            )}
            role="listitem"
          >
            {/* Timeline Line */}
            {showLines && !isLast && (
              <div
                className="absolute left-5 top-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              />
            )}

            {/* Icon */}
            <div className={cn(
              'relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2',
              config.bgColor,
              config.borderColor,
              event.status === 'current' ? 'ring-4 ring-blue-100 dark:ring-blue-900/20 animate-pulse' : undefined
            )}>
              <Icon className={cn('h-5 w-5', config.iconColor)} aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-semibold text-gray-900 dark:text-gray-100',
                    variant === 'compact' ? 'text-sm' : 'text-base'
                  )}>
                    {event.title}
                  </h4>
                  <p className={cn(
                    'text-gray-500 dark:text-gray-400',
                    variant === 'compact' ? 'text-xs' : 'text-sm'
                  )}>
                    {formatDate(event.timestamp)}
                    {event.actor && <span> · {event.actor}</span>}
                  </p>
                </div>
                {event.badge && (
                  <Badge
                    variant={event.badge.variant || 'default'}
                    size="sm"
                  >
                    {event.badge.label}
                  </Badge>
                )}
              </div>

              {event.description && variant !== 'compact' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.description}
                </p>
              )}

              {event.metadata && variant === 'detailed' && Object.keys(event.metadata).length > 0 && (
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="font-medium text-gray-500 dark:text-gray-400">{key}:</dt>
                      <dd className="text-gray-900 dark:text-gray-100">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

StatusTimeline.displayName = 'StatusTimeline';

export default React.memo(StatusTimeline);



