'use client';

/**
 * WF-COMP-NAV-010 | NotificationCenter.tsx - Notification Center Component
 * Purpose: Notification dropdown with mark as read, filtering
 * Dependencies: react, lucide-react
 * Features: Mark as read, filter by type, relative timestamps
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'next/link' // Migrated from react-router-dom
import {
  Bell, X, Check, CheckCheck, AlertCircle, Info, CheckCircle,
  AlertTriangle, Clock
} from 'lucide-react'
import { useNavigation } from '../../contexts/NavigationContext'

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Notification item structure.
 *
 * @property {string} id - Unique identifier for the notification
 * @property {string} title - Notification title/heading
 * @property {string} message - Detailed notification message
 * @property {'info' | 'success' | 'warning' | 'error'} type - Notification severity type
 * @property {number} timestamp - Unix timestamp of notification creation
 * @property {boolean} read - Whether the notification has been read
 * @property {string} [actionUrl] - Optional URL to navigate to when clicked
 */
interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  read: boolean
  actionUrl?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts a timestamp to a relative time string.
 *
 * Formats timestamps as human-readable relative time:
 * - Less than 1 minute: "Just now"
 * - Less than 1 hour: "Xm ago"
 * - Less than 1 day: "Xh ago"
 * - 1+ days: "Xd ago"
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 *
 * @example
 * ```ts
 * getRelativeTime(Date.now() - 300000) // "5m ago"
 * getRelativeTime(Date.now() - 3600000) // "1h ago"
 * ```
 */
function getRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ============================================================================
// MAIN NOTIFICATION CENTER COMPONENT
// ============================================================================

/**
 * Notification center dropdown component.
 *
 * Displays a dropdown panel with application notifications including:
 * - Real-time notifications
 * - Read/unread status
 * - Filter by all or unread
 * - Mark individual or all as read
 * - Relative timestamps
 * - Type-based icons (info, success, warning, error)
 * - Click to navigate to related content
 *
 * Features:
 * - Dropdown positioned at top-right of screen
 * - Filter tabs for all/unread notifications
 * - Unread count badge
 * - Mark all as read action
 * - Individual notification click handling
 * - Type-based color coding and icons
 * - Relative time display (e.g., "5m ago")
 * - Click outside to close
 * - Scrollable list for many notifications
 * - Empty state for no notifications
 * - Dark mode support
 * - Accessible with ARIA labels
 * - Smooth animations
 *
 * Notification Types:
 * - info: Blue icon, general information
 * - success: Green icon, successful actions
 * - warning: Yellow icon, warnings/alerts
 * - error: Red icon, errors/critical issues
 *
 * State Management:
 * - Open/close state managed by NavigationContext
 * - Notifications managed locally (would be from API in production)
 * - Read/unread state persisted in component
 *
 * @returns JSX element representing the notification dropdown, or null if closed
 *
 * @example
 * ```tsx
 * // Used in AppLayout
 * <NotificationCenter />
 * ```
 */
export const NotificationCenter = memo(() => {
  const router = useRouter()
  const { notificationOpen, setNotificationOpen } = useNavigation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock notifications - in real app, this would come from API/state management
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Appointment',
      message: 'Student John Doe has a scheduled appointment at 2:00 PM',
      type: 'info',
      timestamp: Date.now() - 300000,
      read: false,
      actionUrl: '/appointments/1'
    },
    {
      id: '2',
      title: 'Medication Alert',
      message: 'Low inventory for Aspirin - reorder required',
      type: 'warning',
      timestamp: Date.now() - 3600000,
      read: false,
      actionUrl: '/inventory'
    },
    {
      id: '3',
      title: 'Incident Report Submitted',
      message: 'New incident report requires your review',
      type: 'error',
      timestamp: Date.now() - 7200000,
      read: true,
      actionUrl: '/incident-reports/3'
    },
  ])

  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationOpen(false)
      }
    }

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationOpen, setNotificationOpen])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }, [])

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      setNotificationOpen(false)
    }
  }, [navigate, setNotificationOpen, markAsRead])

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  if (!notificationOpen) return null

  return (
    <div className="fixed inset-0 z-40" style={{ pointerEvents: notificationOpen ? 'auto' : 'none' }}>
      <div
        ref={dropdownRef}
        className="
          absolute right-4 top-16 w-96 max-w-[calc(100vw-2rem)]
          rounded-lg shadow-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          overflow-hidden
          animate-slideIn
        "
        style={{ maxHeight: 'calc(100vh - 5rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="
                px-2 py-0.5 text-xs font-medium rounded-full
                bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200
              ">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setNotificationOpen(false)}
            className="
              p-1 rounded-md text-gray-400 hover:text-gray-600
              dark:hover:text-gray-300 transition-colors
            "
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`
              flex-1 px-4 py-2 text-sm font-medium
              transition-colors duration-200
              ${filter === 'all'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`
              flex-1 px-4 py-2 text-sm font-medium
              transition-colors duration-200
              ${filter === 'unread'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={markAllAsRead}
              className="
                flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400
                hover:text-primary-700 dark:hover:text-primary-300
                transition-colors
              "
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 15rem)' }}>
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    px-4 py-3 cursor-pointer
                    transition-colors duration-200
                    ${!notification.read
                      ? 'bg-primary-50 dark:bg-primary-900 dark:bg-opacity-10'
                      : 'bg-white dark:bg-gray-800'
                    }
                    hover:bg-gray-50 dark:hover:bg-gray-700
                  `}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-primary-600" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

NotificationCenter.displayName = 'NotificationCenter'

export default NotificationCenter
