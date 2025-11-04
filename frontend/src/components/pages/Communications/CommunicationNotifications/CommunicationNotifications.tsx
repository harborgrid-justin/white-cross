'use client';

import React from 'react';
import {
  BellIcon,
  BellSlashIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { CommunicationNotificationsProps, CommunicationNotification, NotificationPreference } from './types';
import { useNotifications, useNotificationFilters, useNotificationPreferences, useBulkActions } from './hooks';
import { NotificationItem } from './components/NotificationItem';
import { NotificationFilters } from './components/NotificationFilters';
import { PreferencesModal } from './components/PreferencesModal';

// Mock data - replace with actual API calls
const mockNotifications: CommunicationNotification[] = [
  {
    id: 'notif-1',
    title: 'Emergency: Student Allergic Reaction',
    message: 'Michael Smith had an allergic reaction. EpiPen administered, 911 called. Please contact school immediately.',
    type: 'error',
    category: 'emergency',
    priority: 'urgent',
    status: 'read',
    channels: [
      { type: 'push', status: 'delivered', sent_at: '2024-03-24T14:20:30Z' },
      { type: 'sms', status: 'delivered', sent_at: '2024-03-24T14:20:45Z' },
      { type: 'email', status: 'delivered', sent_at: '2024-03-24T14:21:00Z' }
    ],
    metadata: {
      student_id: 'student-2',
      student_name: 'Michael Smith',
      sender_id: 'nurse-2',
      sender_name: 'Robert Davis'
    },
    created_at: '2024-03-24T14:20:00Z',
    updated_at: '2024-03-24T14:22:00Z',
    read_at: '2024-03-24T14:22:00Z'
  },
  {
    id: 'notif-2',
    title: 'Appointment Reminder',
    message: 'Sarah Johnson has a scheduled health check-up tomorrow at 10:00 AM. Please ensure all forms are completed.',
    type: 'info',
    category: 'appointment',
    priority: 'medium',
    status: 'unread',
    channels: [
      { type: 'email', status: 'delivered', sent_at: '2024-03-25T09:00:00Z' },
      { type: 'in_app', status: 'delivered', sent_at: '2024-03-25T09:00:00Z' }
    ],
    metadata: {
      student_id: 'student-1',
      student_name: 'Sarah Johnson',
      sender_id: 'system',
      sender_name: 'System Notification',
      auto_dismiss_at: '2024-03-26T10:00:00Z'
    },
    created_at: '2024-03-25T09:00:00Z',
    updated_at: '2024-03-25T09:00:00Z'
  },
  {
    id: 'notif-3',
    title: 'Medication Administration Due',
    message: 'Emma Wilson\'s inhaler medication is due for administration at 2:00 PM today.',
    type: 'warning',
    category: 'medication',
    priority: 'high',
    status: 'unread',
    channels: [
      { type: 'push', status: 'delivered', sent_at: '2024-03-25T13:30:00Z' },
      { type: 'in_app', status: 'delivered', sent_at: '2024-03-25T13:30:00Z' }
    ],
    metadata: {
      student_id: 'student-3',
      student_name: 'Emma Wilson',
      sender_id: 'system',
      sender_name: 'Medication System'
    },
    created_at: '2024-03-25T13:30:00Z',
    updated_at: '2024-03-25T13:30:00Z'
  },
  {
    id: 'notif-4',
    title: 'New Message from Parent',
    message: 'Mary Johnson sent a message regarding Sarah\'s inhaler usage and recent symptoms.',
    type: 'info',
    category: 'general',
    priority: 'medium',
    status: 'dismissed',
    channels: [
      { type: 'in_app', status: 'delivered', sent_at: '2024-03-25T12:15:30Z' }
    ],
    metadata: {
      student_id: 'student-1',
      student_name: 'Sarah Johnson',
      sender_id: 'parent-1',
      sender_name: 'Mary Johnson',
      communication_id: 'comm-123'
    },
    created_at: '2024-03-25T12:15:00Z',
    updated_at: '2024-03-25T12:20:00Z',
    dismissed_at: '2024-03-25T12:20:00Z'
  }
];

const mockPreferences: NotificationPreference[] = [
  {
    id: 'pref-1',
    type: 'email',
    category: 'emergency',
    enabled: true,
    priority_threshold: 'high',
    quiet_hours: { enabled: false, start_time: '22:00', end_time: '08:00' },
    frequency: 'immediate',
    recipients: ['nurse@school.edu', 'principal@school.edu']
  },
  {
    id: 'pref-2',
    type: 'sms',
    category: 'emergency',
    enabled: true,
    priority_threshold: 'urgent',
    quiet_hours: { enabled: false, start_time: '22:00', end_time: '08:00' },
    frequency: 'immediate',
    recipients: ['+1234567890']
  },
  {
    id: 'pref-3',
    type: 'push',
    category: 'medication',
    enabled: true,
    priority_threshold: 'medium',
    quiet_hours: { enabled: true, start_time: '21:00', end_time: '07:00' },
    frequency: 'immediate',
    recipients: []
  },
  {
    id: 'pref-4',
    type: 'in_app',
    category: 'general',
    enabled: true,
    priority_threshold: 'low',
    quiet_hours: { enabled: false, start_time: '22:00', end_time: '08:00' },
    frequency: 'immediate',
    recipients: []
  }
];

/**
 * CommunicationNotifications component for managing notification preferences and delivery
 *
 * Features:
 * - Notification preference management
 * - Multi-channel delivery (email, SMS, push, in-app)
 * - Priority-based filtering and routing
 * - Quiet hours and frequency controls
 * - Delivery status tracking
 * - Bulk operations (mark all read, dismiss, archive)
 * - Real-time notification updates
 * - Customizable notification categories
 *
 * @component
 * @example
 * ```tsx
 * <CommunicationNotifications
 *   studentId="student-123"
 *   showUnreadOnly={true}
 *   onNotificationRead={(id) => handleRead(id)}
 *   onNotificationDismiss={(id) => handleDismiss(id)}
 *   onPreferencesUpdate={(prefs) => handlePrefsUpdate(prefs)}
 * />
 * ```
 */
export const CommunicationNotifications: React.FC<CommunicationNotificationsProps> = ({
  className = '',
  isLoading = false,
  error,
  studentId,
  showUnreadOnly = false,
  onNotificationRead,
  onNotificationDismiss,
  onNotificationArchive,
  onPreferencesUpdate
}) => {
  // Custom hooks for state management
  const {
    notifications,
    unreadCount,
    handleNotificationRead,
    handleNotificationDismiss,
    handleNotificationArchive
  } = useNotifications(studentId, mockNotifications);

  const {
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
  } = useNotificationFilters(notifications, showUnreadOnly);

  const {
    preferences,
    showPreferences,
    togglePreferences,
    handlePreferenceUpdate
  } = useNotificationPreferences(mockPreferences, onPreferencesUpdate);

  const {
    selectedNotifications,
    toggleSelection,
    handleBulkMarkRead,
    handleBulkDismiss,
    handleBulkArchive
  } = useBulkActions(
    notifications,
    (ids) => ids.forEach(id => handleNotificationRead(id)),
    (ids) => ids.forEach(id => handleNotificationDismiss(id)),
    (ids) => ids.forEach(id => handleNotificationArchive(id))
  );

  // Wrap callbacks with external handlers
  const onRead = (id: string) => {
    handleNotificationRead(id);
    onNotificationRead?.(id);
  };

  const onDismiss = (id: string) => {
    handleNotificationDismiss(id);
    onNotificationDismiss?.(id);
  };

  const onArchive = (id: string) => {
    handleNotificationArchive(id);
    onNotificationArchive?.(id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading notifications</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BellIcon className="h-6 w-6 text-gray-900" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              {unreadCount} unread • {notifications.length} total
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={togglePreferences}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2 inline" />
            Preferences
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
        selectedCount={selectedNotifications.length}
        onBulkMarkRead={handleBulkMarkRead}
        onBulkDismiss={handleBulkDismiss}
        onBulkArchive={handleBulkArchive}
      />

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BellSlashIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedNotifications.includes(notification.id)}
              onToggleSelection={toggleSelection}
              onRead={onRead}
              onDismiss={onDismiss}
              onArchive={onArchive}
            />
          ))
        )}
      </div>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferences}
        preferences={preferences}
        onClose={togglePreferences}
        onPreferenceUpdate={handlePreferenceUpdate}
      />
    </div>
  );
};

export default CommunicationNotifications;
