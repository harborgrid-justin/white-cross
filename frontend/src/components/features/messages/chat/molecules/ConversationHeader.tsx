'use client';

/**
 * WF-MSG-007 | ConversationHeader.tsx - Conversation Header Component
 * Purpose: Display conversation header with participant info and actions
 * Dependencies: React, Avatar, EncryptionBadge, lucide-react
 * Features: Participant info, online status, actions menu, search, call buttons
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import EncryptionBadge, { EncryptionStatusType } from '../atoms/EncryptionBadge';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Users,
  Info,
  Volume2,
  VolumeX,
  Pin,
  Archive,
  Trash2,
} from 'lucide-react';
import { Menu } from '@headlessui/react';

/**
 * Participant information for group conversations.
 */
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

/**
 * Props for the ConversationHeader component.
 *
 * @interface ConversationHeaderProps
 * @property {string} conversationId - Unique conversation identifier
 * @property {string} title - Conversation title (name or group name)
 * @property {string} [subtitle] - Subtitle text (e.g., "Active 2m ago", "3 participants")
 * @property {string} [avatar] - Conversation avatar URL
 * @property {boolean} [isOnline] - Whether participant is online (1:1 chats)
 * @property {boolean} [isGroup] - Whether this is a group conversation
 * @property {Participant[]} [participants] - Group participants (for groups)
 * @property {EncryptionStatusType} [encryptionStatus] - Encryption status
 * @property {boolean} [isPinned] - Whether conversation is pinned
 * @property {boolean} [isMuted] - Whether notifications are muted
 * @property {string} [className] - Additional CSS classes
 * @property {() => void} [onAudioCall] - Callback for audio call button
 * @property {() => void} [onVideoCall] - Callback for video call button
 * @property {() => void} [onSearch] - Callback for search button
 * @property {() => void} [onShowInfo] - Callback for show info button
 * @property {() => void} [onToggleMute] - Callback for toggle mute
 * @property {() => void} [onTogglePin] - Callback for toggle pin
 * @property {() => void} [onArchive] - Callback for archive conversation
 * @property {() => void} [onDelete] - Callback for delete conversation
 * @property {() => void} [onEncryptionClick] - Callback when encryption badge clicked
 */
export interface ConversationHeaderProps {
  conversationId: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  isOnline?: boolean;
  isGroup?: boolean;
  participants?: Participant[];
  encryptionStatus?: EncryptionStatusType;
  isPinned?: boolean;
  isMuted?: boolean;
  className?: string;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  onSearch?: () => void;
  onShowInfo?: () => void;
  onToggleMute?: () => void;
  onTogglePin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onEncryptionClick?: () => void;
}

/**
 * Conversation header component for messaging interface.
 *
 * Displays conversation information and actions at the top of the message view.
 * Shows participant avatar, name, online status, encryption status, and action
 * buttons for calling, searching, and accessing conversation options.
 *
 * **Features:**
 * - Participant avatar with online indicator
 * - Conversation title and subtitle
 * - Encryption status badge (clickable for details)
 * - Group participant count and avatars
 * - Action buttons (audio call, video call, search, info)
 * - Dropdown menu with additional options
 * - Pin/unpin conversation
 * - Mute/unmute notifications
 * - Archive conversation
 * - Delete conversation
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 * - Responsive design (collapses actions on mobile)
 *
 * **Action Menu Options:**
 * - Show conversation info
 * - Toggle mute notifications
 * - Toggle pin conversation
 * - Archive conversation
 * - Delete conversation
 *
 * **Accessibility:**
 * - Semantic header element
 * - Descriptive aria-labels
 * - Keyboard accessible buttons
 * - Focus indicators
 * - Screen reader friendly
 *
 * @component
 * @param {ConversationHeaderProps} props - Component props
 * @returns {JSX.Element} Rendered conversation header
 *
 * @example
 * ```tsx
 * // Simple 1:1 conversation header
 * <ConversationHeader
 *   conversationId="conv1"
 *   title="Alice Johnson"
 *   subtitle="Active now"
 *   avatar="/alice.jpg"
 *   isOnline={true}
 *   onAudioCall={() => startAudioCall()}
 *   onVideoCall={() => startVideoCall()}
 * />
 *
 * // Group conversation header with encryption
 * <ConversationHeader
 *   conversationId="conv2"
 *   title="Project Team"
 *   subtitle="5 participants"
 *   isGroup={true}
 *   participants={[...]}
 *   encryptionStatus="verified"
 *   onEncryptionClick={() => showEncryptionDetails()}
 * />
 *
 * // Pinned and muted conversation
 * <ConversationHeader
 *   conversationId="conv3"
 *   title="Support Chat"
 *   isPinned={true}
 *   isMuted={true}
 *   onTogglePin={() => togglePin()}
 *   onToggleMute={() => toggleMute()}
 *   onSearch={() => openSearch()}
 * />
 * ```
 */
export const ConversationHeader = React.memo<ConversationHeaderProps>(({
  conversationId,
  title,
  subtitle,
  avatar,
  isOnline,
  isGroup,
  participants = [],
  encryptionStatus,
  isPinned,
  isMuted,
  className = '',
  onAudioCall,
  onVideoCall,
  onSearch,
  onShowInfo,
  onToggleMute,
  onTogglePin,
  onArchive,
  onDelete,
  onEncryptionClick,
}) => {
  return (
    <header
      className={`
        flex items-center justify-between gap-3
        px-4 py-3 border-b border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        ${className}
      `}
    >
      {/* Left Section: Avatar and Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {isGroup && participants.length > 0 ? (
            // Group avatar (multiple avatars)
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant) => (
                <Avatar
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  size="sm"
                  shape="circle"
                  className="ring-2 ring-white dark:ring-gray-900"
                />
              ))}
            </div>
          ) : (
            // Single avatar
            <>
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
            </>
          )}
        </div>

        {/* Conversation Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h2>
            {encryptionStatus && (
              <EncryptionBadge
                status={encryptionStatus}
                size="sm"
                onClick={onEncryptionClick}
              />
            )}
            {isGroup && (
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Audio Call */}
        {onAudioCall && (
          <button
            onClick={onAudioCall}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Start audio call"
            title="Audio call"
          >
            <Phone className="h-5 w-5" />
          </button>
        )}

        {/* Video Call */}
        {onVideoCall && (
          <button
            onClick={onVideoCall}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Start video call"
            title="Video call"
          >
            <Video className="h-5 w-5" />
          </button>
        )}

        {/* Search */}
        {onSearch && (
          <button
            onClick={onSearch}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Search in conversation"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* More Options Menu */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </Menu.Button>

          <Menu.Items
            className="
              absolute right-0 mt-2 w-56 origin-top-right
              bg-white dark:bg-gray-800
              rounded-lg shadow-lg ring-1 ring-black ring-opacity-5
              focus:outline-none z-10
            "
          >
            <div className="py-1">
              {/* Show Info */}
              {onShowInfo && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onShowInfo}
                      className={`
                        ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                        flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                      `}
                    >
                      <Info className="h-4 w-4" />
                      Conversation info
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Toggle Mute */}
              {onToggleMute && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onToggleMute}
                      className={`
                        ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                        flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                      `}
                    >
                      {isMuted ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      {isMuted ? 'Unmute notifications' : 'Mute notifications'}
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Toggle Pin */}
              {onTogglePin && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onTogglePin}
                      className={`
                        ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                        flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                      `}
                    >
                      <Pin className="h-4 w-4" />
                      {isPinned ? 'Unpin conversation' : 'Pin conversation'}
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Divider */}
              {(onArchive || onDelete) && <div className="border-t border-gray-200 dark:border-gray-700 my-1" />}

              {/* Archive */}
              {onArchive && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onArchive}
                      className={`
                        ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                        flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                      `}
                    >
                      <Archive className="h-4 w-4" />
                      Archive conversation
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Delete */}
              {onDelete && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onDelete}
                      className={`
                        ${active ? 'bg-red-100 dark:bg-red-900/30' : ''}
                        flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400
                      `}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete conversation
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
});

ConversationHeader.displayName = 'ConversationHeader';

export default ConversationHeader;
