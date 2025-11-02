'use client';

/**
 * WF-MSG-006 | ConversationItem.tsx - Conversation Preview Item
 * Purpose: Display conversation preview in conversation list
 * Dependencies: React, Avatar, MessageTimestamp, EncryptionBadge
 * Features: Unread badge, preview, timestamp, avatar, encryption indicator
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import MessageTimestamp from '../atoms/MessageTimestamp';
import EncryptionBadge, { EncryptionStatusType } from '../atoms/EncryptionBadge';
import { Pin, Volume2, VolumeX } from 'lucide-react';

/**
 * Props for the ConversationItem component.
 *
 * @interface ConversationItemProps
 * @property {string} id - Unique conversation identifier
 * @property {string} title - Conversation title (participant name or group name)
 * @property {string} [avatar] - Conversation avatar URL
 * @property {string} lastMessagePreview - Preview text of last message
 * @property {Date | string} lastMessageTime - Timestamp of last message
 * @property {number} unreadCount - Number of unread messages
 * @property {boolean} [isOnline] - Whether participant is online (for 1:1 chats)
 * @property {boolean} [isPinned] - Whether conversation is pinned
 * @property {boolean} [isMuted] - Whether notifications are muted
 * @property {EncryptionStatusType} [encryptionStatus] - Encryption status
 * @property {boolean} [isActive] - Whether this conversation is currently selected
 * @property {boolean} [isTyping] - Whether participant is typing
 * @property {string} [className] - Additional CSS classes
 * @property {() => void} onClick - Callback when conversation is clicked
 */
export interface ConversationItemProps {
  id: string;
  title: string;
  avatar?: string;
  lastMessagePreview: string;
  lastMessageTime: Date | string;
  unreadCount: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  encryptionStatus?: EncryptionStatusType;
  isActive?: boolean;
  isTyping?: boolean;
  className?: string;
  onClick: () => void;
}

/**
 * Conversation item component for conversation list.
 *
 * Displays a conversation preview with avatar, title, last message preview,
 * timestamp, unread count badge, and various indicators (pinned, muted,
 * online, typing, encryption). Supports active state highlighting.
 *
 * **Features:**
 * - Participant avatar with online indicator
 * - Conversation title (name or group name)
 * - Last message preview (truncated)
 * - Relative timestamp
 * - Unread count badge
 * - Pinned indicator
 * - Muted indicator
 * - Typing indicator
 * - Encryption status badge
 * - Active state highlighting
 * - Hover effects
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 * - Responsive design
 *
 * **Visual Hierarchy:**
 * - Unread conversations: Bold title, blue accent
 * - Active conversation: Blue background
 * - Pinned conversations: Pin icon
 * - Muted conversations: Muted icon
 *
 * **Accessibility:**
 * - Semantic button element
 * - Descriptive aria-label
 * - Keyboard accessible
 * - Focus indicators
 * - Screen reader friendly
 *
 * @component
 * @param {ConversationItemProps} props - Component props
 * @returns {JSX.Element} Rendered conversation item
 *
 * @example
 * ```tsx
 * // Simple conversation
 * <ConversationItem
 *   id="conv1"
 *   title="Alice Johnson"
 *   lastMessagePreview="Hey, how are you?"
 *   lastMessageTime={new Date()}
 *   unreadCount={0}
 *   onClick={() => openConversation('conv1')}
 * />
 *
 * // Conversation with unread messages
 * <ConversationItem
 *   id="conv2"
 *   title="Bob Smith"
 *   avatar="/bob.jpg"
 *   lastMessagePreview="Can we schedule a meeting?"
 *   lastMessageTime={new Date()}
 *   unreadCount={3}
 *   isOnline={true}
 *   onClick={() => openConversation('conv2')}
 * />
 *
 * // Active pinned conversation with encryption
 * <ConversationItem
 *   id="conv3"
 *   title="Team Chat"
 *   lastMessagePreview="Project update shared"
 *   lastMessageTime={new Date()}
 *   unreadCount={0}
 *   isPinned={true}
 *   isActive={true}
 *   encryptionStatus="verified"
 *   onClick={() => openConversation('conv3')}
 * />
 *
 * // Muted conversation with typing indicator
 * <ConversationItem
 *   id="conv4"
 *   title="Support Group"
 *   lastMessagePreview="Alice is typing..."
 *   lastMessageTime={new Date()}
 *   unreadCount={5}
 *   isMuted={true}
 *   isTyping={true}
 *   onClick={() => openConversation('conv4')}
 * />
 * ```
 */
export const ConversationItem = React.memo<ConversationItemProps>(({
  id,
  title,
  avatar,
  lastMessagePreview,
  lastMessageTime,
  unreadCount,
  isOnline,
  isPinned,
  isMuted,
  encryptionStatus,
  isActive,
  isTyping,
  className = '',
  onClick,
}) => {
  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 flex items-center gap-3
        transition-all duration-200
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent'
        }
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
        ${className}
      `}
      aria-label={`
        ${title} conversation.
        ${hasUnread ? `${unreadCount} unread messages.` : 'No unread messages.'}
        Last message: ${lastMessagePreview}
        ${isPinned ? 'Pinned.' : ''}
        ${isMuted ? 'Muted.' : ''}
        ${isTyping ? 'User is typing.' : ''}
      `}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={avatar}
          alt={title}
          size="md"
          shape="circle"
        />
        {isOnline && (
          <span
            className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
            aria-label="Online"
          />
        )}
      </div>

      {/* Conversation Info */}
      <div className="flex-1 min-w-0 text-left">
        {/* Title and Timestamp Row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3
              className={`
                text-sm truncate
                ${hasUnread
                  ? 'font-bold text-gray-900 dark:text-white'
                  : 'font-medium text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {title}
            </h3>

            {/* Indicators */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isPinned && (
                <Pin
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                  aria-label="Pinned"
                />
              )}
              {isMuted && (
                <VolumeX
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                  aria-label="Muted"
                />
              )}
              {encryptionStatus && (
                <EncryptionBadge
                  status={encryptionStatus}
                  size="sm"
                />
              )}
            </div>
          </div>

          <MessageTimestamp
            timestamp={lastMessageTime}
            format="short"
            className={hasUnread ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}
          />
        </div>

        {/* Last Message Preview */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`
              text-sm truncate flex-1
              ${isTyping
                ? 'text-blue-600 dark:text-blue-400 italic'
                : hasUnread
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {lastMessagePreview}
          </p>

          {/* Unread Badge */}
          {hasUnread && (
            <span
              className="
                flex-shrink-0 inline-flex items-center justify-center
                min-w-[20px] h-5 px-1.5
                bg-blue-600 text-white
                text-xs font-bold rounded-full
              "
              aria-label={`${unreadCount} unread messages`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

ConversationItem.displayName = 'ConversationItem';

export default ConversationItem;


