'use client';

/**
 * Notification Bell Component
 *
 * Dropdown notification center with real-time updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Archive, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useNotificationListener } from '@/lib/socket/SocketContext';
import {
  getNotifications,
  getNotificationCount,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotifications
} from '@/lib/actions/communications.actions';
import type { Notification, NotificationCount } from '@/lib/validations/notification.schemas';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState<NotificationCount | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Load notification count on mount
  useEffect(() => {
    loadNotificationCount();
  }, []);

  // Listen for real-time notifications
  useNotificationListener((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setCount(prev => ({
      total: (prev?.total || 0) + 1,
      unread: (prev?.unread || 0) + 1,
      byType: {
        ...prev?.byType,
        [notification.type]: ((prev?.byType?.[notification.type] || 0) + 1) as number
      }
    }));

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  });

  const loadNotifications = async () => {
    setIsLoading(true);
    const result = await getNotifications({
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (result.success && result.data) {
      setNotifications(result.data.notifications);
    }
    setIsLoading(false);
  };

  const loadNotificationCount = async () => {
    const result = await getNotificationCount();
    if (result.success && result.data) {
      setCount(result.data);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationsAsRead([notificationId]);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, status: 'read' as const, readAt: new Date() }
          : n
      )
    );
    setCount(prev => prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : null);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev =>
      prev.map(n => ({ ...n, status: 'read' as const, readAt: new Date() }))
    );
    setCount(prev => prev ? { ...prev, unread: 0 } : null);
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotifications([notificationId]);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setCount(prev => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (notification.status === 'unread') {
      handleMarkAsRead(notification.id);
    }

    // Navigate if action URL exists
    const primaryAction = notification.actions.find(a => a.primary);
    if (primaryAction?.url) {
      router.push(primaryAction.url);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      message: '💬',
      broadcast: '📢',
      appointment: '📅',
      medication: '💊',
      incident: '⚠️',
      health_alert: '🏥',
      system: '⚙️',
      reminder: '⏰',
      mention: '@',
      reply: '↩️'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || colors.normal;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count && count.unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {count.unread > 99 ? '99+' : count.unread}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.some(n => n.status === 'unread') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    'px-4 py-3 hover:bg-accent cursor-pointer transition-colors relative group',
                    notification.status === 'unread' && 'bg-blue-50 dark:bg-blue-950/20'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('text-2xl', getPriorityColor(notification.priority))}>
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-1">
                          {notification.title}
                        </p>
                        {notification.status === 'unread' && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                    {notification.status === 'unread' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push('/communications/notifications');
            setIsOpen(false);
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
