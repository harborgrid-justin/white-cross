/**
 * @fileoverview Real-Time Notification Center Component
 * @module components/realtime/NotificationCenter
 *
 * Displays real-time notifications from WebSocket events.
 * Features:
 * - Real-time notification updates
 * - Unread count badge
 * - Notification filtering
 * - Mark as read/unread
 * - Notification actions
 * - Persistent storage
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketEvent } from '@/services/websocket/WebSocketService';
import { Bell, X, Check, AlertTriangle, Info, Heart, Pill } from 'lucide-react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Notification {
  id: string;
  type: 'emergency' | 'medication' | 'appointment' | 'health' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationCenterProps {
  maxNotifications?: number;
  autoMarkAsRead?: boolean;
  showBadge?: boolean;
}

// ==========================================
// NOTIFICATION STORAGE
// ==========================================

const STORAGE_KEY = 'white-cross-notifications';

function loadNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load notifications from storage', error);
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications to storage', error);
  }
}

// ==========================================
// COMPONENT
// ==========================================

export function NotificationCenter({
  maxNotifications = 50,
  autoMarkAsRead = false,
  showBadge = true
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { isConnected, subscribe, unsubscribe, markNotificationAsRead: wsMarkAsRead } = useWebSocket();

  // ==========================================
  // NOTIFICATION HELPERS
  // ==========================================

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, maxNotifications);
      saveNotifications(updated);
      return updated;
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
        badge: '/badge-icon.png',
        tag: notification.id
      });
    }
  }, [maxNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });

    // Notify WebSocket
    wsMarkAsRead(notificationId);
  }, [wsMarkAsRead]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  // ==========================================
  // WEBSOCKET EVENT HANDLERS
  // ==========================================

  useEffect(() => {
    // Emergency alerts
    const handleEmergencyAlert = (data: any) => {
      addNotification({
        id: `emergency-${Date.now()}`,
        type: 'emergency',
        title: 'EMERGENCY ALERT',
        message: data.message || 'Emergency situation requires immediate attention',
        timestamp: Date.now(),
        read: false,
        priority: 'high',
        metadata: data
      });
    };

    // Medication reminders
    const handleMedicationReminder = (data: any) => {
      addNotification({
        id: `medication-${Date.now()}`,
        type: 'medication',
        title: 'Medication Reminder',
        message: data.message || `Time to administer medication for ${data.studentName}`,
        timestamp: Date.now(),
        read: false,
        priority: 'medium',
        actionUrl: `/medications/${data.medicationId}`,
        metadata: data
      });
    };

    // Health notifications
    const handleHealthNotification = (data: any) => {
      addNotification({
        id: `health-${Date.now()}`,
        type: 'health',
        title: 'Health Notification',
        message: data.message,
        timestamp: Date.now(),
        read: false,
        priority: 'medium',
        actionUrl: data.studentId ? `/students/${data.studentId}` : undefined,
        metadata: data
      });
    };

    // Student health alerts
    const handleStudentHealthAlert = (data: any) => {
      addNotification({
        id: `student-health-${Date.now()}`,
        type: 'health',
        title: 'Student Health Alert',
        message: data.message || 'Student requires immediate attention',
        timestamp: Date.now(),
        read: false,
        priority: 'high',
        actionUrl: `/students/${data.studentId}`,
        metadata: data
      });
    };

    // Subscribe to events
    subscribe(WebSocketEvent.EMERGENCY_ALERT, handleEmergencyAlert);
    subscribe(WebSocketEvent.MEDICATION_REMINDER, handleMedicationReminder);
    subscribe(WebSocketEvent.HEALTH_NOTIFICATION, handleHealthNotification);
    subscribe(WebSocketEvent.STUDENT_HEALTH_ALERT, handleStudentHealthAlert);

    // Cleanup
    return () => {
      unsubscribe(WebSocketEvent.EMERGENCY_ALERT, handleEmergencyAlert);
      unsubscribe(WebSocketEvent.MEDICATION_REMINDER, handleMedicationReminder);
      unsubscribe(WebSocketEvent.HEALTH_NOTIFICATION, handleHealthNotification);
      unsubscribe(WebSocketEvent.STUDENT_HEALTH_ALERT, handleStudentHealthAlert);
    };
  }, [subscribe, unsubscribe, addNotification]);

  // ==========================================
  // REQUEST NOTIFICATION PERMISSION
  // ==========================================

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ==========================================
  // AUTO MARK AS READ
  // ==========================================

  useEffect(() => {
    if (autoMarkAsRead && isOpen) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoMarkAsRead, markAllAsRead]);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-blue-500" />;
      case 'health':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'appointment':
        return <Info className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />

        {/* Badge */}
        {showBadge && unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}
          aria-label={isConnected ? 'Connected' : 'Disconnected'}
        />
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                filter === 'unread'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-2 border-b border-gray-200">
            <button
              onClick={markAllAsRead}
              className="flex-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="flex-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
              disabled={notifications.length === 0}
            >
              Clear all
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    } ${getPriorityColor(notification.priority)} border-l-4`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 ml-2 bg-blue-600 rounded-full" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            View details →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
