/**
 * Notifications Content Component
 *
 * Client component for notifications list
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Check, Trash2, Archive, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  archiveNotifications,
  deleteNotifications
} from '@/lib/actions/communications.actions';
import type { Notification, NotificationType } from '@/lib/validations/notification.schemas';
import { useNotificationListener } from '@/lib/socket/SocketContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function NotificationsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    loadNotifications();
  }, [typeFilter]);

  // Listen for real-time notifications
  useNotificationListener((notification) => {
    setNotifications(prev => [notification, ...prev]);
  });

  const loadNotifications = async () => {
    setIsLoading(true);

    const result = await getNotifications({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (result.success && result.data) {
      setNotifications(result.data.notifications);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load notifications'
      });
    }

    setIsLoading(false);
  };

  const handleMarkAsRead = async (notificationIds: string[]) => {
    const result = await markNotificationsAsRead(notificationIds);

    if (result.success) {
      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id)
            ? { ...n, status: 'read' as const, readAt: new Date() }
            : n
        )
      );
      setSelectedIds([]);
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead();

    if (result.success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' as const, readAt: new Date() }))
      );
      toast({
        title: 'All notifications marked as read'
      });
    }
  };

  const handleArchive = async () => {
    if (selectedIds.length === 0) return;

    const result = await archiveNotifications(selectedIds);

    if (result.success) {
      toast({
        title: 'Notifications archived',
        description: `${selectedIds.length} notification(s) archived`
      });
      setSelectedIds([]);
      loadNotifications();
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await deleteNotifications(selectedIds);

    if (result.success) {
      toast({
        title: 'Notifications deleted',
        description: `${selectedIds.length} notification(s) deleted`
      });
      setSelectedIds([]);
      loadNotifications();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread') {
      handleMarkAsRead([notification.id]);
    }

    const primaryAction = notification.actions.find(a => a.primary);
    if (primaryAction?.url) {
      router.push(primaryAction.url);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your notifications
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/communications/notifications/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Filter */}
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as NotificationType | 'all')}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="broadcast">Broadcasts</SelectItem>
            <SelectItem value="appointment">Appointments</SelectItem>
            <SelectItem value="medication">Medications</SelectItem>
            <SelectItem value="incident">Incidents</SelectItem>
            <SelectItem value="health_alert">Health Alerts</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="reminder">Reminders</SelectItem>
          </SelectContent>
        </Select>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive ({selectedIds.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="space-y-1 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-semibold">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 hover:bg-accent cursor-pointer transition-colors relative group',
                  notification.status === 'unread' && 'bg-blue-50 dark:bg-blue-950/20'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0">
                    {notification.icon || getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {notification.status === 'unread' && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {notification.imageUrl && (
                        <img
                          src={notification.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                    {notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {notification.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant={action.primary ? 'default' : 'outline'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (action.url) {
                                router.push(action.url);
                              }
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
