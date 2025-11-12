'use client';

import React from 'react';
import {
  User,
  DollarSign,
  FileText,
  CheckCircle,
  Star,
  StarOff,
  Eye,
  MoreVertical
} from 'lucide-react';

import type { NotificationItemProps } from './types';
import { getTypeConfig, getPriorityConfig, getChannelIcon, formatCurrency } from './utils';

/**
 * NotificationItem Component
 *
 * Renders an individual notification card with all its details and actions
 *
 * @param props - NotificationItem component props
 * @returns JSX element representing a notification card
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected,
  onSelect,
  onNotificationClick,
  onStarNotification
}) => {
  const typeConfig = getTypeConfig(notification.type);
  const priorityConfig = getPriorityConfig(notification.priority);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${
        notification.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSelect(notification.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-2"
        />

        {/* Notification icon */}
        <div className={`p-2 rounded-lg ${typeConfig.color} mt-1`}>
          <TypeIcon className="w-5 h-5" />
        </div>

        {/* Notification content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg font-semibold ${
                notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
                  {notification.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onStarNotification?.(notification.id)}
                className="p-1 text-gray-400 hover:text-yellow-500 rounded"
                aria-label={notification.status === 'starred' ? 'Unstar' : 'Star'}
              >
                {notification.status === 'starred' ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => onNotificationClick?.(notification)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                aria-label="View notification"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-3">{notification.message}</p>

          {/* Notification metadata */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {notification.patientName && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{notification.patientName}</span>
                </div>
              )}

              {notification.amount !== undefined && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(notification.amount)}</span>
                </div>
              )}

              {notification.invoiceNumber && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span>{notification.invoiceNumber}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Delivery channels */}
              <div className="flex items-center space-x-1">
                {notification.channels.map((channel) => {
                  const ChannelIcon = getChannelIcon(channel);
                  const status = notification.deliveryStatus?.[channel as keyof typeof notification.deliveryStatus];
                  return (
                    <div key={channel} className="relative">
                      <ChannelIcon className={`w-4 h-4 ${
                        status === 'delivered' ? 'text-green-500' :
                        status === 'failed' ? 'text-red-500' :
                        status === 'sent' ? 'text-blue-500' :
                        'text-gray-400'
                      }`} />
                      {status === 'delivered' && (
                        <CheckCircle className="w-2 h-2 text-green-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                  );
                })}
              </div>

              <span className="text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
