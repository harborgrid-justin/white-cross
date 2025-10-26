'use client';

/**
 * Notification Card Component
 *
 * Individual notification display (Server Component for optimal performance)
 */

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  MessageSquare,
  Calendar,
  Pill,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/lib/validations/notification.schemas';

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type: NotificationType) {
  const iconClass = 'h-5 w-5';
  const icons: Record<NotificationType, React.ReactNode> = {
    message: <MessageSquare className={cn(iconClass, 'text-blue-500')} />,
    broadcast: <Bell className={cn(iconClass, 'text-purple-500')} />,
    appointment: <Calendar className={cn(iconClass, 'text-green-500')} />,
    medication: <Pill className={cn(iconClass, 'text-orange-500')} />,
    incident: <AlertTriangle className={cn(iconClass, 'text-red-500')} />,
    'health-alert': <AlertCircle className={cn(iconClass, 'text-red-600')} />,
    system: <Info className={cn(iconClass, 'text-gray-500')} />,
    reminder: <Bell className={cn(iconClass, 'text-yellow-500')} />
  };
  return icons[type] || <Bell className={iconClass} />;
}

/**
 * Get priority indicator color
 */
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'normal':
      return 'bg-blue-500';
    case 'low':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get notification type badge color
 */
function getTypeBadgeVariant(type: NotificationType): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'health-alert':
    case 'incident':
      return 'destructive';
    case 'message':
    case 'broadcast':
      return 'default';
    case 'appointment':
    case 'medication':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function NotificationCard({
  notification,
  onClick,
  showActions = true,
  compact = false,
  className
}: NotificationCardProps) {
  const {
    id,
    type,
    title,
    message,
    priority,
    isRead,
    createdAt,
    actionText,
    actionUrl
  } = notification;

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md cursor-pointer',
        !isRead && 'border-primary bg-primary/5',
        compact && 'p-3',
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  'font-medium text-sm line-clamp-1',
                  !isRead && 'font-semibold'
                )}>
                  {title}
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
                {priority !== 'normal' && (
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      getPriorityColor(priority)
                    )}
                    title={`${priority} priority`}
                  />
                )}
              </div>
            </div>

            {/* Message */}
            {!compact && message && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {message}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getTypeBadgeVariant(type)} className="text-xs capitalize">
                {type.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
              {!isRead && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
            </div>

            {/* Action Button */}
            {showActions && actionUrl && actionText && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(actionUrl, '_blank');
                }}
              >
                {actionText}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact version of NotificationCard for badges/dropdowns
 */
export function NotificationCardCompact({
  notification,
  onClick,
  className
}: Omit<NotificationCardProps, 'compact' | 'showActions'>) {
  return (
    <NotificationCard
      notification={notification}
      onClick={onClick}
      compact
      showActions={false}
      className={className}
    />
  );
}

/**
 * Notification Card Skeleton for loading states
 */
export function NotificationCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
            <div className="flex gap-2 mt-2">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
