/**
 * @fileoverview Notification GraphQL Hooks
 *
 * Custom hooks for real-time notification subscriptions
 *
 * @module graphql/hooks/useNotifications
 * @since 1.0.0
 */

'use client';

import { useSubscription, ApolloError } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import {
  NOTIFICATION_SUBSCRIPTION,
  SYSTEM_NOTIFICATION_SUBSCRIPTION,
  EMERGENCY_ALERT_SUBSCRIPTION,
} from '../subscriptions';
import { handleGraphQLError } from '../utils';

/**
 * Hook to subscribe to user notifications
 */
export const useNotifications = (
  userId: string,
  onNotification?: (notification: any) => void
) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data, loading, error } = useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId,
    onData: ({ data }) => {
      if (data.data?.notificationReceived) {
        const notification = data.data.notificationReceived;
        setNotifications((prev) => [notification, ...prev]);

        if (onNotification) {
          onNotification(notification);
        }
      }
    },
  });

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    latestNotification: data?.notificationReceived,
    loading,
    error: error ? handleGraphQLError(error) : null,
    clearNotifications,
    removeNotification,
  };
};

/**
 * Hook to subscribe to system notifications
 */
export const useSystemNotifications = (
  onNotification?: (notification: any) => void
) => {
  const { data, loading, error } = useSubscription(SYSTEM_NOTIFICATION_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.systemNotificationReceived && onNotification) {
        onNotification(data.data.systemNotificationReceived);
      }
    },
  });

  return {
    notification: data?.systemNotificationReceived,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to subscribe to emergency alerts
 */
export const useEmergencyAlerts = (
  onAlert?: (alert: any) => void
) => {
  const [alerts, setAlerts] = useState<any[]>([]);

  const { data, loading, error } = useSubscription(EMERGENCY_ALERT_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.emergencyAlertReceived) {
        const alert = data.data.emergencyAlertReceived;
        setAlerts((prev) => [alert, ...prev]);

        if (onAlert) {
          onAlert(alert);
        }

        // Play alert sound or show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Emergency Alert', {
            body: alert.message,
            icon: '/emergency-icon.png',
            tag: alert.id,
          });
        }
      }
    },
  });

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    latestAlert: data?.emergencyAlertReceived,
    loading,
    error: error ? handleGraphQLError(error) : null,
    clearAlerts,
  };
};
