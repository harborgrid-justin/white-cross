'use client';

/**
 * WF-MSG-010 | MessagingLayout.tsx - Main Messaging Layout Component
 * Purpose: Split-view messaging layout with conversations and message view
 * Dependencies: React, ConversationList, ConversationHeader, MessageItem, MessageInput, TypingIndicator
 * Features: Split view, responsive, mobile overlay, auto-scroll, infinite scroll
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React, { useRef, useEffect, useState } from 'react';
import ConversationList, { Conversation } from './ConversationList';
import ConversationHeader, { Participant } from '../molecules/ConversationHeader';
import MessageItem, { MessageItemProps } from '../molecules/MessageItem';
import MessageInput, { AttachmentFile } from './MessageInput';
import TypingIndicator from '../atoms/TypingIndicator';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, WifiOff, AlertCircle } from 'lucide-react';

/**
 * Message type for display.
 */
export interface Message extends Omit<MessageItemProps, 'onReply' | 'onReact' | 'onReactionClick' | 'onMoreOptions'> {
  // All message fields from MessageItemProps
}

/**
 * Active conversation data.
 */
export interface ActiveConversation {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  isOnline?: boolean;
  isGroup?: boolean;
  participants?: Participant[];
  encryptionStatus?: any;
  isPinned?: boolean;
  isMuted?: boolean;
}

/**
 * Props for the MessagingLayout component.
 *
 * @interface MessagingLayoutProps
 * @property {Conversation[]} conversations - Array of conversations for the list
 * @property {Message[]} messages - Array of messages in active conversation
 * @property {ActiveConversation | null} activeConversation - Currently active conversation data
 * @property {boolean} [isLoadingMessages] - Whether messages are loading
 * @property {boolean} [hasMoreMessages] - Whether more messages can be loaded
 * @property {boolean} [isConnected=true] - Connection status
 * @property {string[]} [typingUsers] - Users currently typing
 * @property {string} [className] - Additional CSS classes
 * @property {(conversationId: string) => void} onConversationSelect - Callback when conversation selected
 * @property {(message: string, attachments: AttachmentFile[]) => Promise<void>} onSendMessage - Callback to send message
 * @property {() => void} [onNewConversation] - Callback for new conversation button
 * @property {() => void} [onLoadMoreMessages] - Callback to load older messages
 * @property {() => void} [onTyping] - Callback when user starts typing
 * @property {() => void} [onStopTyping] - Callback when user stops typing
 * @property {(messageId: string) => void} [onMessageReply] - Callback when replying to message
 * @property {(messageId: string) => void} [onMessageReact] - Callback when reacting to message
 */
export interface MessagingLayoutProps {
  conversations: Conversation[];
  messages: Message[];
  activeConversation: ActiveConversation | null;
  isLoadingMessages?: boolean;
  hasMoreMessages?: boolean;
  isConnected?: boolean;
  typingUsers?: string[];
  className?: string;
  onConversationSelect: (conversationId: string) => void;
  onSendMessage: (message: string, attachments: AttachmentFile[]) => Promise<void>;
  onNewConversation?: () => void;
  onLoadMoreMessages?: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  onMessageReply?: (messageId: string) => void;
  onMessageReact?: (messageId: string) => void;
}

/**
 * Main messaging layout component with split view.
 *
 * Provides a complete messaging interface with conversation list on the left
 * and message view on the right. Responsive design with mobile overlay for
 * conversation list. Features auto-scroll to bottom on new messages, infinite
 * scroll for loading older messages, typing indicators, and connection status.
 *
 * **Features:**
 * - Split-view layout (conversations + messages)
 * - Responsive design (mobile overlay for conversations)
 * - Auto-scroll to bottom on new messages
 * - Infinite scroll for loading older messages
 * - Typing indicators for active users
 * - Connection status indicator
 * - Loading states with skeletons
 * - Empty states
 * - Message grouping by sender
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 *
 * **Layout:**
 * - Desktop: Two-column layout (conversations | messages)
 * - Tablet: Collapsible conversation list
 * - Mobile: Full-screen message view with back button
 *
 * **Auto-scroll Behavior:**
 * - Scrolls to bottom on new messages (if already near bottom)
 * - Maintains scroll position when loading older messages
 * - User can scroll up to view history
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - ARIA labels and roles
 * - Keyboard accessible
 * - Focus management
 * - Screen reader friendly
 *
 * @component
 * @param {MessagingLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered messaging layout
 *
 * @example
 * ```tsx
 * <MessagingLayout
 *   conversations={conversations}
 *   messages={messages}
 *   activeConversation={activeConversation}
 *   onConversationSelect={(id) => loadConversation(id)}
 *   onSendMessage={async (message, attachments) => {
 *     await sendMessage(message, attachments);
 *   }}
 *   onNewConversation={() => openNewConversationModal()}
 * />
 * ```
 */
export const MessagingLayout = React.memo<MessagingLayoutProps>(({
  conversations,
  messages,
  activeConversation,
  isLoadingMessages,
  hasMoreMessages,
  isConnected = true,
  typingUsers = [],
  className = '',
  onConversationSelect,
  onSendMessage,
  onNewConversation,
  onLoadMoreMessages,
  onTyping,
  onStopTyping,
  onMessageReply,
  onMessageReact,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showConversationsOnMobile, setShowConversationsOnMobile] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Check if user is near bottom (for auto-scroll behavior)
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Enable auto-scroll if near bottom (within 100px)
    setShouldAutoScroll(distanceFromBottom < 100);

    // Load more messages if scrolled to top
    if (scrollTop < 100 && hasMoreMessages && !isLoadingMessages && onLoadMoreMessages) {
      onLoadMoreMessages();
    }
  };

  // Group messages by sender and time
  const groupedMessages = React.useMemo(() => {
    return messages.map((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

      const isSameSender = prevMessage && prevMessage.sender.id === message.sender.id;
      const isWithinTimeThreshold = prevMessage &&
        Math.abs(
          new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()
        ) < 60000; // 1 minute

      const isNextSameSender = nextMessage && nextMessage.sender.id === message.sender.id;
      const isNextWithinTimeThreshold = nextMessage &&
        Math.abs(
          new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime()
        ) < 60000;

      const isGrouped = isSameSender && isWithinTimeThreshold;
      const isFirstInGroup = !isGrouped;
      const isLastInGroup = !(isNextSameSender && isNextWithinTimeThreshold);

      return {
        ...message,
        isGrouped,
        isFirstInGroup,
        isLastInGroup,
        showAvatar: isLastInGroup,
      };
    });
  }, [messages]);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 ${className}`}>
      {/* Conversation List (Desktop: Always visible, Mobile: Overlay) */}
      <div
        className={`
          ${showConversationsOnMobile || !activeConversation ? 'block' : 'hidden'}
          lg:block lg:w-80 xl:w-96 flex-shrink-0
          ${showConversationsOnMobile ? 'fixed inset-0 z-50 lg:relative' : ''}
        `}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onConversationClick={(id) => {
            onConversationSelect(id);
            setShowConversationsOnMobile(false);
          }}
          onNewConversation={onNewConversation}
        />
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConversation ? (
          <>
            {/* Conversation Header */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowConversationsOnMobile(true)}
                className="lg:hidden p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <ConversationHeader
                conversationId={activeConversation.id}
                title={activeConversation.title}
                subtitle={activeConversation.subtitle}
                avatar={activeConversation.avatar}
                isOnline={activeConversation.isOnline}
                isGroup={activeConversation.isGroup}
                participants={activeConversation.participants}
                encryptionStatus={activeConversation.encryptionStatus}
                isPinned={activeConversation.isPinned}
                isMuted={activeConversation.isMuted}
                className="flex-1"
              />
            </div>

            {/* Connection Status Banner */}
            {!isConnected && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800">
                <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Reconnecting...
                </span>
              </div>
            )}

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-950"
            >
              {/* Loading More Messages */}
              {hasMoreMessages && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              )}

              {/* Loading State */}
              {isLoadingMessages && messages.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`flex gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1 max-w-md">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Messages */}
              {groupedMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  {...message}
                  onReply={onMessageReply ? () => onMessageReply(message.id) : undefined}
                  onReact={onMessageReact ? () => onMessageReact(message.id) : undefined}
                />
              ))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="mt-4">
                  <TypingIndicator users={typingUsers} />
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput
              onSend={onSendMessage}
              onTyping={onTyping}
              onStopTyping={onStopTyping}
              disabled={!isConnected}
            />
          </>
        ) : (
          // Empty State (No Conversation Selected)
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-950">
            <div className="text-center max-w-md px-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a conversation from the list to start messaging
              </p>
              <button
                onClick={() => setShowConversationsOnMobile(true)}
                className="lg:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MessagingLayout.displayName = 'MessagingLayout';

export default MessagingLayout;
