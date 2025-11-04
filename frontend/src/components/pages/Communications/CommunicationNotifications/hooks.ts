/**
 * Custom hooks for CommunicationNotifications
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CommunicationNotification,
  NotificationPreference,
  NotificationSortBy,
  SortOrder
} from './types';
import { applyFiltersAndSort } from './utils';

/**
 * Hook for managing notification data and CRUD operations
 */
export const useNotifications = (
  studentId?: string,
  mockNotifications?: CommunicationNotification[]
) => {
  const [notifications, setNotifications] = useState<CommunicationNotification[]>([]);

  // Load notifications (currently using mock data)
  useEffect(() => {
    if (mockNotifications) {
      let data = [...mockNotifications];

      // Filter by student if specified
      if (studentId) {
        data = data.filter(notif => notif.metadata.student_id === studentId);
      }

      setNotifications(data);
    }
  }, [studentId, mockNotifications]);

  // Mark notification as read
  const handleNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId
        ? { ...notif, status: 'read' as const, read_at: new Date().toISOString() }
        : notif
    ));
  }, []);

  // Dismiss notification
  const handleNotificationDismiss = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId
        ? { ...notif, status: 'dismissed' as const, dismissed_at: new Date().toISOString() }
        : notif
    ));
  }, []);

  // Archive notification
  const handleNotificationArchive = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId
        ? { ...notif, status: 'archived' as const }
        : notif
    ));
  }, []);

  // Get unread count
  const unreadCount = useMemo(
    () => notifications.filter(n => n.status === 'unread').length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    handleNotificationRead,
    handleNotificationDismiss,
    handleNotificationArchive
  };
};

/**
 * Hook for managing notification filters and search
 */
export const useNotificationFilters = (
  notifications: CommunicationNotification[],
  initialShowUnreadOnly?: boolean
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialShowUnreadOnly ? 'unread' : 'all');
  const [sortBy, setSortBy] = useState<NotificationSortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Memoized filtered and sorted notifications
  const filteredNotifications = useMemo(() => {
    return applyFiltersAndSort(notifications, {
      searchQuery,
      category: selectedCategory,
      priority: selectedPriority,
      status: selectedStatus,
      sortBy,
      sortOrder
    });
  }, [notifications, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filteredNotifications
  };
};

/**
 * Hook for managing notification preferences
 */
export const useNotificationPreferences = (
  mockPreferences?: NotificationPreference[],
  onPreferencesUpdate?: (preferences: NotificationPreference[]) => void
) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load preferences
  useEffect(() => {
    if (mockPreferences) {
      setPreferences(mockPreferences);
    }
  }, [mockPreferences]);

  // Update a preference
  const handlePreferenceUpdate = useCallback((
    prefId: string,
    updates: Partial<NotificationPreference>
  ) => {
    const updatedPrefs = preferences.map(pref =>
      pref.id === prefId ? { ...pref, ...updates } : pref
    );
    setPreferences(updatedPrefs);
    onPreferencesUpdate?.(updatedPrefs);
  }, [preferences, onPreferencesUpdate]);

  // Toggle preferences modal
  const togglePreferences = useCallback(() => {
    setShowPreferences(prev => !prev);
  }, []);

  return {
    preferences,
    showPreferences,
    setShowPreferences,
    togglePreferences,
    handlePreferenceUpdate
  };
};

/**
 * Hook for managing bulk notification operations
 */
export const useBulkActions = (
  notifications: CommunicationNotification[],
  onRead?: (ids: string[]) => void,
  onDismiss?: (ids: string[]) => void,
  onArchive?: (ids: string[]) => void
) => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Toggle notification selection
  const toggleSelection = useCallback((notificationId: string, selected: boolean) => {
    if (selected) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  }, []);

  // Bulk mark as read
  const handleBulkMarkRead = useCallback(() => {
    onRead?.(selectedNotifications);
    setSelectedNotifications([]);
  }, [selectedNotifications, onRead]);

  // Bulk dismiss
  const handleBulkDismiss = useCallback(() => {
    onDismiss?.(selectedNotifications);
    setSelectedNotifications([]);
  }, [selectedNotifications, onDismiss]);

  // Bulk archive
  const handleBulkArchive = useCallback(() => {
    onArchive?.(selectedNotifications);
    setSelectedNotifications([]);
  }, [selectedNotifications, onArchive]);

  return {
    selectedNotifications,
    toggleSelection,
    handleBulkMarkRead,
    handleBulkDismiss,
    handleBulkArchive
  };
};
