'use client';

import React, { useEffect, useState } from 'react';
import { Notification, NotificationPriority } from '../types/notification';
import { useNotificationSound } from '../hooks';

export interface NotificationToastProps {
  notification: Notification;
  userId: string;
  onDismiss?: () => void;
  onAction?: (actionId: string) => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * NotificationToast Component
 *
 * Real-time toast notification popup
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  userId,
  onDismiss,
  onAction,
  duration = 5000,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { playSound } = useNotificationSound(userId);

  useEffect(() => {
    // Play sound when notification appears
    playSound(notification.type, notification.priority);

    // Auto-dismiss after duration (unless emergency)
    if (notification.priority !== NotificationPriority.EMERGENCY && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification, duration, playSound, onDismiss]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const priorityStyles = {
    [NotificationPriority.LOW]: 'border-l-gray-400 bg-white',
    [NotificationPriority.MEDIUM]: 'border-l-blue-500 bg-blue-50',
    [NotificationPriority.HIGH]: 'border-l-yellow-500 bg-yellow-50',
    [NotificationPriority.URGENT]: 'border-l-orange-500 bg-orange-50',
    [NotificationPriority.EMERGENCY]: 'border-l-red-600 bg-red-50 animate-pulse',
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50 w-96 max-w-full
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div
        className={`
          border-l-4 rounded-lg shadow-lg p-4
          ${priorityStyles[notification.priority]}
        `}
        role="alert"
        aria-live={notification.priority === NotificationPriority.EMERGENCY ? 'assertive' : 'polite'}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {notification.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {notification.message}
            </p>

            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {notification.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAction?.(action.id);
                      handleDismiss();
                    }}
                    className="px-3 py-1 text-xs font-medium bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * NotificationToastContainer Component
 *
 * Manages multiple toast notifications
 */
export const NotificationToastContainer: React.FC<{
  userId: string;
  notifications: Notification[];
  onDismiss: (id: string) => void;
  maxToasts?: number;
}> = ({ userId, notifications, onDismiss, maxToasts = 3 }) => {
  const visibleNotifications = notifications.slice(0, maxToasts);

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ transform: `translateY(${index * 110}px)` }}
        >
          <NotificationToast
            notification={notification}
            userId={userId}
            onDismiss={() => onDismiss(notification.id)}
          />
        </div>
      ))}
    </>
  );
};
