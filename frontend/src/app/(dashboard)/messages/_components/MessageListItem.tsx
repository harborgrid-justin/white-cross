/**
 * MessageListItem Component
 * Individual message item in the message list
 */

'use client';

import React from 'react';
import { Eye, Star, CheckCircle, Archive, User, Paperclip, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthcareMessage } from './types/message.types';
import { getPriorityBadgeColor, getTypeIcon } from './utils/messageHelpers';
import { formatTimestamp } from './utils/messageFormatters';

interface MessageListItemProps {
  message: HealthcareMessage;
  isSelected: boolean;
  onSelect: (messageId: string, selected: boolean) => void;
  onClick: (message: HealthcareMessage) => void;
  onMarkAsRead: (messageId: string) => void;
  onStar: (messageId: string) => void;
  onAcknowledge: (messageId: string) => void;
  onArchive: (messageId: string) => void;
}

/**
 * Individual message list item component
 * Displays message preview with quick action buttons
 */
export const MessageListItem: React.FC<MessageListItemProps> = React.memo(({
  message,
  isSelected,
  onSelect,
  onClick,
  onMarkAsRead,
  onStar,
  onAcknowledge,
  onArchive
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(message.id, e.target.checked);
  };

  const handleClick = () => {
    onClick(message);
  };

  const stopPropagation = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        message.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      } ${
        message.priority === 'emergency' ? 'bg-red-50 border-l-4 border-l-red-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Selection Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            aria-label={`Select message from ${message.from.name}`}
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Message Type Icon */}
              {getTypeIcon(message.type)}

              {/* Sender Info */}
              <span className="font-semibold text-gray-900">{message.from.name}</span>
              <span className="text-sm text-gray-500">({message.from.role})</span>

              {/* Priority Badge */}
              <Badge className={`${getPriorityBadgeColor(message.priority)} text-xs`}>
                {message.priority.toUpperCase()}
              </Badge>

              {/* Encryption Indicator */}
              {message.isEncrypted && (
                <div className="relative group">
                  <Lock className="h-3 w-3 text-gray-400" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Encrypted message
                  </span>
                </div>
              )}

              {/* Acknowledgment Required */}
              {message.requiresAcknowledgment && !message.acknowledgedAt && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  ACK REQUIRED
                </Badge>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-sm text-gray-500 flex-shrink-0">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          {/* Subject */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {message.subject}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-700 text-sm mb-2 line-clamp-2">{message.content}</p>

          {/* Related Student */}
          {message.relatedStudent && (
            <div className="flex items-center gap-1 mb-2">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                Student: {message.relatedStudent.name}
              </span>
            </div>
          )}

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Paperclip className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                {message.attachments.length} attachment
                {message.attachments.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Tags */}
          {message.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {message.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
              {message.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{message.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {message.status === 'unread' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => stopPropagation(e, () => onMarkAsRead(message.id))}
              title="Mark as read"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => stopPropagation(e, () => onStar(message.id))}
            title="Star message"
          >
            <Star
              className={`h-4 w-4 ${
                message.status === 'starred'
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-400'
              }`}
            />
          </Button>

          {message.requiresAcknowledgment && !message.acknowledgedAt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => stopPropagation(e, () => onAcknowledge(message.id))}
              title="Acknowledge message"
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => stopPropagation(e, () => onArchive(message.id))}
            title="Archive message"
          >
            <Archive className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
});

MessageListItem.displayName = 'MessageListItem';
