'use client';

/**
 * WF-MSG-005 | MessageItem.tsx - Individual Message Bubble Component
 * Purpose: Display individual chat message with bubble styling
 * Dependencies: React, Avatar, MessageTimestamp, MessageStatus, EncryptionBadge
 * Features: Sent/received styling, avatars, timestamps, status, reactions, accessibility
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import MessageTimestamp from '../atoms/MessageTimestamp';
import MessageStatus, { MessageStatusType } from '../atoms/MessageStatus';
import EncryptionBadge, { EncryptionStatusType } from '../atoms/EncryptionBadge';
import { Paperclip, Reply, MoreVertical, Smile } from 'lucide-react';

/**
 * Message attachment type.
 */
export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
}

/**
 * Message reaction type.
 */
export interface MessageReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

/**
 * Props for the MessageItem component.
 *
 * @interface MessageItemProps
 * @property {string} id - Unique message identifier
 * @property {string} content - Message text content
 * @property {Date | string} timestamp - Message timestamp
 * @property {boolean} isSent - Whether message was sent by current user
 * @property {object} sender - Sender information
 * @property {string} sender.id - Sender user ID
 * @property {string} sender.name - Sender display name
 * @property {string} [sender.avatar] - Sender avatar URL
 * @property {MessageStatusType} [status] - Delivery/read status (for sent messages)
 * @property {EncryptionStatusType} [encryptionStatus] - Encryption status
 * @property {MessageAttachment[]} [attachments] - File attachments
 * @property {MessageReaction[]} [reactions] - Message reactions
 * @property {boolean} [showAvatar=true] - Show sender avatar
 * @property {boolean} [isGrouped=false] - Part of grouped messages (same sender, close timestamps)
 * @property {boolean} [isFirstInGroup=true] - First message in a group
 * @property {boolean} [isLastInGroup=true] - Last message in a group
 * @property {string} [className] - Additional CSS classes
 * @property {() => void} [onReply] - Callback when reply button clicked
 * @property {() => void} [onReact] - Callback when react button clicked
 * @property {(emoji: string) => void} [onReactionClick] - Callback when reaction clicked
 * @property {() => void} [onMoreOptions] - Callback when more options clicked
 */
export interface MessageItemProps {
  id: string;
  content: string;
  timestamp: Date | string;
  isSent: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  status?: MessageStatusType;
  encryptionStatus?: EncryptionStatusType;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  showAvatar?: boolean;
  isGrouped?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  className?: string;
  onReply?: () => void;
  onReact?: () => void;
  onReactionClick?: (emoji: string) => void;
  onMoreOptions?: () => void;
}

/**
 * Individual message bubble component for chat interface.
 *
 * Displays a single chat message with bubble styling, appropriate alignment
 * for sent/received messages, avatars, timestamps, delivery status, and
 * optional encryption indicators. Supports attachments, reactions, and
 * message grouping for consecutive messages from the same sender.
 *
 * **Features:**
 * - Sent/received message alignment and styling
 * - Message bubbles with appropriate colors
 * - Sender avatar (hideable for grouped messages)
 * - Timestamps with relative time
 * - Delivery/read status indicators
 * - Encryption status badges
 * - File attachments display
 * - Message reactions with emoji
 * - Message grouping for consecutive messages
 * - Reply and more options actions
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 * - Responsive design
 *
 * **Message Grouping:**
 * When consecutive messages are from the same sender within a short time:
 * - First message: Shows avatar, full bubble
 * - Middle messages: No avatar, reduced spacing
 * - Last message: Includes timestamp
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - ARIA labels for actions
 * - Keyboard accessible buttons
 * - Screen reader friendly
 * - Focus indicators
 *
 * @component
 * @param {MessageItemProps} props - Component props
 * @returns {JSX.Element} Rendered message bubble
 *
 * @example
 * ```tsx
 * // Sent message with status
 * <MessageItem
 *   id="msg1"
 *   content="Hello, how are you?"
 *   timestamp={new Date()}
 *   isSent={true}
 *   sender={{ id: '1', name: 'Me', avatar: '/avatar.jpg' }}
 *   status="read"
 * />
 *
 * // Received message with encryption
 * <MessageItem
 *   id="msg2"
 *   content="I'm doing great, thanks!"
 *   timestamp={new Date()}
 *   isSent={false}
 *   sender={{ id: '2', name: 'Alice', avatar: '/alice.jpg' }}
 *   encryptionStatus="verified"
 * />
 *
 * // Message with attachments and reactions
 * <MessageItem
 *   id="msg3"
 *   content="Check out this file"
 *   timestamp={new Date()}
 *   isSent={false}
 *   sender={{ id: '2', name: 'Alice' }}
 *   attachments={[{ id: '1', name: 'document.pdf', size: 1024, type: 'pdf', url: '/file.pdf' }]}
 *   reactions={[{ emoji: '👍', count: 3, userReacted: true }]}
 *   onReactionClick={(emoji) => console.log('Clicked', emoji)}
 * />
 *
 * // Grouped message (middle of group)
 * <MessageItem
 *   id="msg4"
 *   content="Another message"
 *   timestamp={new Date()}
 *   isSent={false}
 *   sender={{ id: '2', name: 'Alice' }}
 *   isGrouped={true}
 *   isFirstInGroup={false}
 *   isLastInGroup={false}
 *   showAvatar={false}
 * />
 * ```
 */
export const MessageItem = React.memo<MessageItemProps>(({
  id,
  content,
  timestamp,
  isSent,
  sender,
  status,
  encryptionStatus,
  attachments = [],
  reactions = [],
  showAvatar = true,
  isGrouped = false,
  isFirstInGroup = true,
  isLastInGroup = true,
  className = '',
  onReply,
  onReact,
  onReactionClick,
  onMoreOptions,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div
      className={`
        flex items-start gap-2 group
        ${isSent ? 'flex-row-reverse' : 'flex-row'}
        ${isGrouped && !isFirstInGroup ? 'mt-1' : 'mt-4'}
        ${className}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar (for received messages) */}
      {!isSent && (
        <div className="flex-shrink-0">
          {showAvatar && isLastInGroup ? (
            <Avatar
              src={sender.avatar}
              alt={sender.name}
              size="sm"
              shape="circle"
            />
          ) : (
            <div className="w-8 h-8" /> // Spacer for grouped messages
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`
          flex flex-col max-w-[70%] sm:max-w-[60%]
          ${isSent ? 'items-end' : 'items-start'}
        `}
      >
        {/* Sender name (for received messages, first in group) */}
        {!isSent && isFirstInGroup && (
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-3">
            {sender.name}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`
            relative px-4 py-2 rounded-2xl
            ${isSent
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            }
            ${isGrouped && !isFirstInGroup && isSent ? 'rounded-tr-md' : ''}
            ${isGrouped && !isFirstInGroup && !isSent ? 'rounded-tl-md' : ''}
            ${isGrouped && !isLastInGroup && isSent ? 'rounded-br-md' : ''}
            ${isGrouped && !isLastInGroup && !isSent ? 'rounded-bl-md' : ''}
            shadow-sm
          `}
        >
          {/* Encryption Badge (if encrypted) */}
          {encryptionStatus && (
            <div className="mb-2">
              <EncryptionBadge
                status={encryptionStatus}
                size="sm"
              />
            </div>
          )}

          {/* Message Content */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {content}
          </p>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    ${isSent
                      ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }
                    transition-colors
                  `}
                >
                  <Paperclip className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                    <p className="text-xs opacity-75">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 ml-3">
            {reactions.map((reaction, index) => (
              <button
                key={`${reaction.emoji}-${index}`}
                onClick={() => onReactionClick?.(reaction.emoji)}
                className={`
                  inline-flex items-center gap-1 px-2 py-0.5
                  rounded-full text-xs font-medium
                  transition-all
                  ${reaction.userReacted
                    ? 'bg-blue-100 border border-blue-300 dark:bg-blue-900/30 dark:border-blue-600'
                    : 'bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }
                  hover:scale-105 hover:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  dark:focus:ring-offset-gray-900
                `}
                aria-label={`${reaction.emoji} reaction, ${reaction.count} ${reaction.count === 1 ? 'person' : 'people'}`}
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-700 dark:text-gray-300">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and Status (last in group) */}
        {isLastInGroup && (
          <div
            className={`
              flex items-center gap-2 mt-1 text-xs
              ${isSent ? 'flex-row-reverse' : 'flex-row'}
            `}
          >
            <MessageTimestamp timestamp={timestamp} />
            {isSent && status && (
              <MessageStatus status={status} />
            )}
          </div>
        )}
      </div>

      {/* Message Actions (hover) */}
      {(showActions || false) && (
        <div
          className={`
            flex items-center gap-1 opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            ${isSent ? 'flex-row-reverse' : 'flex-row'}
          `}
        >
          {onReply && (
            <button
              onClick={onReply}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="Reply to message"
              title="Reply"
            >
              <Reply className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {onReact && (
            <button
              onClick={onReact}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="React to message"
              title="React"
            >
              <Smile className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {onMoreOptions && (
            <button
              onClick={onMoreOptions}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="More options"
              title="More"
            >
              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
