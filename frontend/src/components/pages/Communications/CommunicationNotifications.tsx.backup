'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BellIcon,
  BellAlertIcon,
  BellSlashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

/**
 * Notification preference settings
 */
interface NotificationPreference {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  category: 'emergency' | 'appointment' | 'medication' | 'general' | 'system';
  enabled: boolean;
  priority_threshold: 'low' | 'medium' | 'high' | 'urgent';
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  recipients: string[];
}

/**
 * Notification item
 */
interface CommunicationNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'emergency' | 'appointment' | 'medication' | 'general' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'dismissed' | 'archived';
  channels: Array<{
    type: 'email' | 'sms' | 'push' | 'in_app';
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    sent_at?: string;
    error_message?: string;
  }>;
  metadata: {
    student_id?: string;
    student_name?: string;
    sender_id?: string;
    sender_name?: string;
    communication_id?: string;
    auto_dismiss_at?: string;
  };
  created_at: string;
  updated_at: string;
  read_at?: string;
  dismissed_at?: string;
}

/**
 * Props for the CommunicationNotifications component
 */
interface CommunicationNotificationsProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Student ID to filter notifications */
  studentId?: string;
  /** Show only unread notifications */
  showUnreadOnly?: boolean;
  /** Callback when notification is read */
  onNotificationRead?: (notificationId: string) => void;
  /** Callback when notification is dismissed */
  onNotificationDismiss?: (notificationId: string) => void;
  /** Callback when notification is archived */
  onNotificationArchive?: (notificationId: string) => void;
  /** Callback when preferences are updated */
  onPreferencesUpdate?: (preferences: NotificationPreference[]) => void;
}

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
}): React.ReactElement => {
  // State management
  const [notifications, setNotifications] = useState<CommunicationNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(showUnreadOnly ? 'unread' : 'all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        {
          type: 'push',
          status: 'delivered',
          sent_at: '2024-03-24T14:20:30Z'
        },
        {
          type: 'sms',
          status: 'delivered',
          sent_at: '2024-03-24T14:20:45Z'
        },
        {
          type: 'email',
          status: 'delivered',
          sent_at: '2024-03-24T14:21:00Z'
        }
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
        {
          type: 'email',
          status: 'delivered',
          sent_at: '2024-03-25T09:00:00Z'
        },
        {
          type: 'in_app',
          status: 'delivered',
          sent_at: '2024-03-25T09:00:00Z'
        }
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
        {
          type: 'push',
          status: 'delivered',
          sent_at: '2024-03-25T13:30:00Z'
        },
        {
          type: 'in_app',
          status: 'delivered',
          sent_at: '2024-03-25T13:30:00Z'
        }
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
        {
          type: 'in_app',
          status: 'delivered',
          sent_at: '2024-03-25T12:15:30Z'
        }
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
      quiet_hours: {
        enabled: false,
        start_time: '22:00',
        end_time: '08:00'
      },
      frequency: 'immediate',
      recipients: ['nurse@school.edu', 'principal@school.edu']
    },
    {
      id: 'pref-2',
      type: 'sms',
      category: 'emergency',
      enabled: true,
      priority_threshold: 'urgent',
      quiet_hours: {
        enabled: false,
        start_time: '22:00',
        end_time: '08:00'
      },
      frequency: 'immediate',
      recipients: ['+1234567890']
    },
    {
      id: 'pref-3',
      type: 'push',
      category: 'medication',
      enabled: true,
      priority_threshold: 'medium',
      quiet_hours: {
        enabled: true,
        start_time: '21:00',
        end_time: '07:00'
      },
      frequency: 'immediate',
      recipients: []
    },
    {
      id: 'pref-4',
      type: 'in_app',
      category: 'general',
      enabled: true,
      priority_threshold: 'low',
      quiet_hours: {
        enabled: false,
        start_time: '22:00',
        end_time: '08:00'
      },
      frequency: 'immediate',
      recipients: []
    }
  ];

  // Load data
  useEffect(() => {
    const loadData = () => {
      let data = [...mockNotifications];
      
      // Filter by student if specified
      if (studentId) {
        data = data.filter(notif => notif.metadata.student_id === studentId);
      }
      
      setNotifications(data);
      setPreferences(mockPreferences);
    };
    
    loadData();
  }, [studentId]);

  // Filter notifications
  const filteredNotifications = useCallback(() => {
    let filtered = [...notifications];
    
    // Text search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchLower) ||
        notif.message.toLowerCase().includes(searchLower) ||
        (notif.metadata.student_name && notif.metadata.student_name.toLowerCase().includes(searchLower)) ||
        (notif.metadata.sender_name && notif.metadata.sender_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notif => notif.category === selectedCategory);
    }
    
    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notif => notif.priority === selectedPriority);
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(notif => notif.status === selectedStatus);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return filtered;
  }, [notifications, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy, sortOrder]);

  // Handle notification actions
  const handleNotificationRead = (notificationId: string): void => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: 'read' as const, read_at: new Date().toISOString() }
        : notif
    ));
    onNotificationRead?.(notificationId);
  };

  const handleNotificationDismiss = (notificationId: string): void => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: 'dismissed' as const, dismissed_at: new Date().toISOString() }
        : notif
    ));
    onNotificationDismiss?.(notificationId);
  };

  const handleNotificationArchive = (notificationId: string): void => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: 'archived' as const }
        : notif
    ));
    onNotificationArchive?.(notificationId);
  };

  // Handle bulk operations
  const handleBulkMarkRead = (): void => {
    const updates = selectedNotifications.map(id => ({
      ...notifications.find(n => n.id === id)!,
      status: 'read' as const,
      read_at: new Date().toISOString()
    }));
    
    setNotifications(prev => prev.map(notif => 
      selectedNotifications.includes(notif.id) 
        ? { ...notif, status: 'read' as const, read_at: new Date().toISOString() }
        : notif
    ));
    
    setSelectedNotifications([]);
  };

  const handleBulkDismiss = (): void => {
    setNotifications(prev => prev.map(notif => 
      selectedNotifications.includes(notif.id) 
        ? { ...notif, status: 'dismissed' as const, dismissed_at: new Date().toISOString() }
        : notif
    ));
    
    setSelectedNotifications([]);
  };

  const handleBulkArchive = (): void => {
    setNotifications(prev => prev.map(notif => 
      selectedNotifications.includes(notif.id) 
        ? { ...notif, status: 'archived' as const }
        : notif
    ));
    
    setSelectedNotifications([]);
  };

  // Handle preference updates
  const handlePreferenceUpdate = (prefId: string, updates: Partial<NotificationPreference>): void => {
    const updatedPrefs = preferences.map(pref => 
      pref.id === prefId ? { ...pref, ...updates } : pref
    );
    setPreferences(updatedPrefs);
    onPreferencesUpdate?.(updatedPrefs);
  };

  // Get type icon
  const getTypeIcon = (type: CommunicationNotification['type']) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: CommunicationNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'push':
        return <BellIcon className="h-4 w-4" />;
      case 'in_app':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
  };

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
    ) as React.ReactElement;
  }

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
    ) as React.ReactElement;
  }

  const filtered = filteredNotifications();
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

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
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2 inline" />
            Preferences
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search notifications"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="emergency">Emergency</option>
            <option value="appointment">Appointment</option>
            <option value="medication">Medication</option>
            <option value="general">General</option>
            <option value="system">System</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="dismissed">Dismissed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Sort and Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'date' | 'priority' | 'category')}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {selectedNotifications.length} selected
              </span>
              <button
                onClick={handleBulkMarkRead}
                className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Mark Read
              </button>
              <button
                onClick={handleBulkDismiss}
                className="px-2 py-1 text-xs font-medium text-yellow-600 hover:text-yellow-800"
              >
                Dismiss
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
              >
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BellSlashIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filtered.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                notification.status === 'unread' 
                  ? 'border-blue-500 bg-blue-50' 
                  : notification.priority === 'urgent'
                  ? 'border-red-500'
                  : notification.priority === 'high'
                  ? 'border-orange-500'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        setSelectedNotifications(prev => [...prev, notification.id]);
                      } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                      }
                    }}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-medium ${
                        notification.status === 'unread' 
                          ? 'text-gray-900' 
                          : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {notification.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        {notification.metadata.student_name && (
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{notification.metadata.student_name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notification.channels.map((channel, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-1 ${
                              channel.status === 'delivered' 
                                ? 'text-green-600' 
                                : channel.status === 'failed'
                                ? 'text-red-600'
                                : 'text-gray-400'
                            }`}
                            title={`${channel.type}: ${channel.status}`}
                          >
                            {getChannelIcon(channel.type)}
                            {channel.status === 'delivered' && <CheckIcon className="h-3 w-3" />}
                            {channel.status === 'failed' && <XMarkIcon className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-4">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleNotificationRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Mark as read"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  )}
                  {notification.status !== 'dismissed' && (
                    <button
                      onClick={() => handleNotificationDismiss(notification.id)}
                      className="p-1 text-gray-400 hover:text-yellow-600"
                      title="Dismiss"
                    >
                      <EyeSlashIcon className="h-4 w-4" />
                    </button>
                  )}
                  {notification.status !== 'archived' && (
                    <button
                      onClick={() => handleNotificationArchive(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {preferences.map((preference) => (
                  <div key={preference.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(preference.type)}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {preference.type} Notifications
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            Category: {preference.category}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preference.enabled}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            handlePreferenceUpdate(preference.id, { enabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {preference.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-gray-700 mb-1">Priority Threshold</label>
                          <select
                            value={preference.priority_threshold}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                              handlePreferenceUpdate(preference.id, { 
                                priority_threshold: e.target.value as 'low' | 'medium' | 'high' | 'urgent' 
                              })
                            }
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-1">Frequency</label>
                          <select
                            value={preference.frequency}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                              handlePreferenceUpdate(preference.id, { 
                                frequency: e.target.value as 'immediate' | 'hourly' | 'daily' | 'weekly' 
                              })
                            }
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="immediate">Immediate</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id={`quiet-${preference.id}`}
                              checked={preference.quiet_hours.enabled}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handlePreferenceUpdate(preference.id, { 
                                  quiet_hours: { ...preference.quiet_hours, enabled: e.target.checked }
                                })
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`quiet-${preference.id}`} className="text-gray-700">
                              Enable quiet hours
                            </label>
                          </div>
                          
                          {preference.quiet_hours.enabled && (
                            <div className="flex items-center space-x-2 ml-6">
                              <input
                                type="time"
                                value={preference.quiet_hours.start_time}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handlePreferenceUpdate(preference.id, { 
                                    quiet_hours: { ...preference.quiet_hours, start_time: e.target.value }
                                  })
                                }
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={preference.quiet_hours.end_time}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handlePreferenceUpdate(preference.id, { 
                                    quiet_hours: { ...preference.quiet_hours, end_time: e.target.value }
                                  })
                                }
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationNotifications;
