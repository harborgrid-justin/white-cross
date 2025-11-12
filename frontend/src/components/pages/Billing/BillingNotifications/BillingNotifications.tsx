'use client';

import React, { useState } from 'react';
import {
  Bell,
  Settings,
  Search,
  RefreshCw,
  Archive,
  Trash2,
  Filter,
  ChevronDown
} from 'lucide-react';

import type {
  BillingNotificationsProps,
  BillingNotification
} from './types';
import { DEFAULT_NOTIFICATIONS, DEFAULT_TEMPLATES } from './constants';
import NotificationItem from './NotificationItem';

/**
 * BillingNotifications Component
 *
 * A comprehensive notification management system for billing-related communications
 * with patients, including payment reminders, invoice notifications, and system alerts.
 * Features template management, scheduling, and multi-channel delivery.
 *
 * @param props - BillingNotifications component props
 * @returns JSX element representing the billing notifications interface
 */
const BillingNotifications: React.FC<BillingNotificationsProps> = ({
  notifications = DEFAULT_NOTIFICATIONS,
  templates = DEFAULT_TEMPLATES,
  unreadCount = 0,
  loading = false,
  searchTerm = '',
  filters = {
    type: [],
    priority: [],
    status: [],
    channel: []
  },
  className = '',
  onNotificationClick,
  onMarkAsRead,
  onMarkAsUnread,
  onStarNotification,
  onArchiveNotification,
  onDeleteNotification,
  onSendNotification,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onSettings
}) => {
  // State
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');

  /**
   * Handles notification selection
   */
  const handleNotificationSelect = (notificationId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedNotifications, notificationId]
      : selectedNotifications.filter(id => id !== notificationId);
    setSelectedNotifications(newSelection);
  };

  /**
   * Handles select all notifications
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? notifications.map(n => n.id) : [];
    setSelectedNotifications(newSelection);
  };

  /**
   * Gets filtered notifications based on active tab and filters
   */
  const getFilteredNotifications = (): BillingNotification[] => {
    let filtered = notifications;

    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => n.status === 'unread');
        break;
      case 'starred':
        filtered = filtered.filter(n => n.status === 'starred');
        break;
      case 'archived':
        filtered = filtered.filter(n => n.status === 'archived');
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(n => filters.type.includes(n.type));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(n => filters.priority.includes(n.priority));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(n => filters.status.includes(n.status));
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className={`bg-white min-h-screen ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Notifications</h1>
                <p className="text-gray-600">
                  Manage billing communications and alerts
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadCount} unread
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                aria-label="Refresh notifications"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={onSettings}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Notification settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Notifications', count: notifications.length },
                { id: 'unread', label: 'Unread', count: notifications.filter(n => n.status === 'unread').length },
                { id: 'starred', label: 'Starred', count: notifications.filter(n => n.status === 'starred').length },
                { id: 'archived', label: 'Archived', count: notifications.filter(n => n.status === 'archived').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <button
                onClick={() => onMarkAsRead?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600
                         bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
              >
                Mark Read
              </button>
              <button
                onClick={() => onArchiveNotification?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600
                         bg-gray-50 border border-gray-200 rounded hover:bg-gray-100"
              >
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </button>
              <button
                onClick={() => onDeleteNotification?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600
                         bg-red-50 border border-red-200 rounded hover:bg-red-100"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {searchTerm || Object.values(filters).some(arr => arr.length > 0)
                ? 'No notifications match your current search or filters.'
                : 'No notifications to display.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isSelected={selectedNotifications.includes(notification.id)}
                onSelect={handleNotificationSelect}
                onNotificationClick={onNotificationClick}
                onStarNotification={onStarNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingNotifications;
