'use client';

import React from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import type { CommunicationNotification } from '../types';
import { getTypeIcon, getPriorityColor, getChannelIcon } from '../utils';

interface NotificationItemProps {
  notification: CommunicationNotification;
  isSelected: boolean;
  onToggleSelection: (id: string, selected: boolean) => void;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onArchive: (id: string) => void;
}

/**
 * NotificationItem component - displays a single notification with actions
 */
export const NotificationItem: React.FC<NotificationItemProps> = React.memo(({
  notification,
  isSelected,
  onToggleSelection,
  onRead,
  onDismiss,
  onArchive
}) => {
  return (
    <div
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
            checked={isSelected}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onToggleSelection(notification.id, e.target.checked);
            }}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Select notification: ${notification.title}`}
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
              onClick={() => onRead(notification.id)}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Mark as read"
              aria-label="Mark as read"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}
          {notification.status !== 'dismissed' && (
            <button
              onClick={() => onDismiss(notification.id)}
              className="p-1 text-gray-400 hover:text-yellow-600"
              title="Dismiss"
              aria-label="Dismiss notification"
            >
              <EyeSlashIcon className="h-4 w-4" />
            </button>
          )}
          {notification.status !== 'archived' && (
            <button
              onClick={() => onArchive(notification.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Archive"
              aria-label="Archive notification"
            >
              <ArchiveBoxIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';
