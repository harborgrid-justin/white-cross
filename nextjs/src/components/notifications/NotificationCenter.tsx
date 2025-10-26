/**
 * Notification Center Component
 *
 * Full notification management UI with filtering, grouping, and real-time updates
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import {
  Bell,
  CheckCircle,
  Archive,
  Trash2,
  Filter,
  MoreVertical,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Pill,
  AlertTriangle,
  Settings,
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSocket } from '@/lib/socket/SocketContext';
import type { Notification, NotificationType } from '@/lib/validations/notification.schemas';
import {
  markNotificationAsReadAction,
  markAllAsReadAction,
  archiveNotificationAction,
  deleteNotificationAction
} from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface NotificationCenterProps {
  initialNotifications?: Notification[];
  onRefresh?: () => Promise<void>;
  className?: string;
}

type FilterType = 'all' | 'unread' | NotificationType;

export function NotificationCenter({
  initialNotifications = [],
  onRefresh,
  className
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { onNotification } = useSocket();

  // Real-time notification updates
  useEffect(() => {
    const unsubscribe = onNotification((newNotification) => {
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.some(n => n.id === newNotification.id)) {
          return prev;
        }
        return [newNotification, ...prev];
      });
    });

    return unsubscribe;
  }, [onNotification]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filter === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (filter !== 'all') {
      result = result.filter(n => n.type === filter);
    }

    return result;
  }, [notifications, filter]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      earlier: []
    };

    filteredNotifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      if (isToday(date)) {
        groups.today.push(notification);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
      toast.success('Notifications refreshed');
    } catch (error) {
      toast.error('Failed to refresh notifications');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsReadAction({ notificationId });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      );
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadAction({});
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await archiveNotificationAction({ notificationId });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification archived');
    } catch (error) {
      toast.error('Failed to archive notification');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotificationAction({ notificationId });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, React.ReactNode> = {
      message: <MessageSquare className="h-5 w-5 text-blue-500" />,
      broadcast: <Bell className="h-5 w-5 text-purple-500" />,
      appointment: <Calendar className="h-5 w-5 text-green-500" />,
      medication: <Pill className="h-5 w-5 text-orange-500" />,
      incident: <AlertTriangle className="h-5 w-5 text-red-500" />,
      'health-alert': <AlertCircle className="h-5 w-5 text-red-600" />,
      system: <Info className="h-5 w-5 text-gray-500" />,
      reminder: <Bell className="h-5 w-5 text-yellow-500" />
    };
    return icons[type] || <Bell className="h-5 w-5" />;
  };

  const getPriorityColor = (priority: string) => {
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
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationGroup = (title: string, notificationList: Notification[]) => {
    if (notificationList.length === 0) return null;

    return (
      <div key={title}>
        <div className="px-4 py-2 bg-muted/50">
          <p className="text-sm font-semibold text-muted-foreground uppercase">{title}</p>
        </div>
        <div className="divide-y">
          {notificationList.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'p-4 transition-colors hover:bg-accent',
                !notification.isRead && 'bg-blue-50 dark:bg-blue-950/20'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'font-medium text-sm',
                        !notification.isRead && 'font-semibold'
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                        {notification.priority !== 'normal' && (
                          <div className={cn(
                            'h-2 w-2 rounded-full',
                            getPriorityColor(notification.priority)
                          )} />
                        )}
                        {!notification.isRead && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.isRead && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        {notification.actionUrl && (
                          <DropdownMenuItem onClick={() => window.open(notification.actionUrl, '_blank')}>
                            <Info className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(notification.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Action Button */}
                  {notification.actionUrl && notification.actionText && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 h-auto p-0"
                      onClick={() => window.open(notification.actionUrl, '_blank')}
                    >
                      {notification.actionText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/communications/notifications/settings'}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <Separator className="my-1" />
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="broadcast">Broadcasts</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
              <SelectItem value="medication">Medications</SelectItem>
              <SelectItem value="incident">Incidents</SelectItem>
              <SelectItem value="health-alert">Health Alerts</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              {filter !== 'all'
                ? `No ${filter} notifications`
                : 'You're all caught up!'}
            </p>
          </div>
        ) : (
          <div>
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('Earlier', groupedNotifications.earlier)}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` (filtered)`}
          </p>
        </div>
      )}
    </div>
  );
}
