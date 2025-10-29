/**
 * @fileoverview Notifications Slice - In-App Notifications Management
 * @module stores/slices/notificationsSlice
 * @category Store
 *
 * Manages in-app notifications, alerts, and toast messages.
 * Session-only (NOT persisted to localStorage for HIPAA compliance).
 *
 * Features:
 * - Real-time notification management
 * - Toast notifications
 * - Priority-based display
 * - Read/unread tracking
 * - Auto-dismiss logic
 * - SSR-compatible (session-only)
 * - NOT persisted (PHI may be in notifications)
 *
 * @example
 * ```typescript
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 * import { addNotification, markAsRead } from '@/stores/slices/notificationsSlice';
 *
 * function NotificationCenter() {
 *   const notifications = useAppSelector(state => state.notifications.items);
 *   const dispatch = useAppDispatch();
 *
 *   const notify = () => {
 *     dispatch(addNotification({
 *       title: 'New Appointment',
 *       message: 'You have a new appointment scheduled',
 *       type: 'info',
 *       priority: 'medium',
 *     }));
 *   };
 *
 *   return (
 *     <div>
 *       {notifications.map(notif => (
 *         <NotificationItem
 *           key={notif.id}
 *           {...notif}
 *           onRead={() => dispatch(markAsRead(notif.id))}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

/**
 * Notification type
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Single notification item
 */
export interface Notification {
  /**
   * Unique notification ID
   */
  id: string;

  /**
   * Notification title
   */
  title: string;

  /**
   * Notification message body
   */
  message: string;

  /**
   * Notification type
   */
  type: NotificationType;

  /**
   * Priority level
   */
  priority: NotificationPriority;

  /**
   * Read status
   */
  read: boolean;

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Optional action link
   */
  actionUrl?: string;

  /**
   * Optional action label
   */
  actionLabel?: string;

  /**
   * Auto-dismiss after milliseconds (0 = no auto-dismiss)
   */
  autoDismiss?: number;

  /**
   * Optional metadata (e.g., studentId, medicationId)
   * Note: May contain references to PHI entities
   */
  metadata?: Record<string, any>;
}

/**
 * Notifications state interface
 */
export interface NotificationsState {
  /**
   * All notifications
   */
  items: Notification[];

  /**
   * Total unread count
   */
  unreadCount: number;

  /**
   * Show notification center
   */
  showCenter: boolean;

  /**
   * Enable toast notifications
   */
  toastsEnabled: boolean;

  /**
   * Enable sound for notifications
   */
  soundEnabled: boolean;
}

/**
 * Initial notifications state
 */
const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  showCenter: false,
  toastsEnabled: true,
  soundEnabled: false,
};

/**
 * Notifications slice with reducers
 */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Add a new notification
     */
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: nanoid(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      // Add to beginning (newest first)
      state.items.unshift(notification);

      // Update unread count
      state.unreadCount += 1;

      // Limit to 100 notifications
      if (state.items.length > 100) {
        state.items = state.items.slice(0, 100);
      }
    },

    /**
     * Add multiple notifications
     */
    addNotifications: (state, action: PayloadAction<Array<Omit<Notification, 'id' | 'read' | 'createdAt'>>>) => {
      const notifications: Notification[] = action.payload.map(notif => ({
        ...notif,
        id: nanoid(),
        read: false,
        createdAt: new Date().toISOString(),
      }));

      state.items.unshift(...notifications);
      state.unreadCount += notifications.length;

      // Limit to 100 notifications
      if (state.items.length > 100) {
        state.items = state.items.slice(0, 100);
      }
    },

    /**
     * Mark notification as read
     */
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    /**
     * Remove notification
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.items[index].read;
        state.items.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },

    /**
     * Clear read notifications
     */
    clearReadNotifications: (state) => {
      state.items = state.items.filter(n => !n.read);
    },

    /**
     * Toggle notification center visibility
     */
    toggleNotificationCenter: (state) => {
      state.showCenter = !state.showCenter;
    },

    /**
     * Set notification center visibility
     */
    setShowCenter: (state, action: PayloadAction<boolean>) => {
      state.showCenter = action.payload;
    },

    /**
     * Toggle toasts enabled
     */
    toggleToasts: (state) => {
      state.toastsEnabled = !state.toastsEnabled;
    },

    /**
     * Set toasts enabled
     */
    setToastsEnabled: (state, action: PayloadAction<boolean>) => {
      state.toastsEnabled = action.payload;
    },

    /**
     * Toggle sound enabled
     */
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    /**
     * Set sound enabled
     */
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
  },
});

// Export actions
export const {
  addNotification,
  addNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  toggleNotificationCenter,
  setShowCenter,
  toggleToasts,
  setToastsEnabled,
  toggleSound,
  setSoundEnabled,
} = notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer;

// Selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationsState }) => state.notifications.unreadCount;
export const selectShowCenter = (state: { notifications: NotificationsState }) => state.notifications.showCenter;
export const selectToastsEnabled = (state: { notifications: NotificationsState }) => state.notifications.toastsEnabled;
export const selectSoundEnabled = (state: { notifications: NotificationsState }) => state.notifications.soundEnabled;

/**
 * Select unread notifications
 */
export const selectUnreadNotifications = (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter(n => !n.read);

/**
 * Select notifications by type
 */
export const selectNotificationsByType = (type: NotificationType) => (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter(n => n.type === type);

/**
 * Select notifications by priority
 */
export const selectNotificationsByPriority = (priority: NotificationPriority) => (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter(n => n.priority === priority);

/**
 * Select critical unread notifications
 */
export const selectCriticalUnreadNotifications = (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter(n => !n.read && n.priority === 'critical');
