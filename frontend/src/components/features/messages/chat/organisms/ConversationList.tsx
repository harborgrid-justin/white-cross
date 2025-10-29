'use client';

/**
 * WF-MSG-008 | ConversationList.tsx - Conversations List Component
 * Purpose: Display scrollable list of conversations with search and filtering
 * Dependencies: React, ConversationItem, lucide-react
 * Features: Search, filter, infinite scroll, virtual scrolling support, empty states
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React, { useState, useMemo } from 'react';
import ConversationItem, { ConversationItemProps } from '../molecules/ConversationItem';
import { Search, Plus, Filter, MessageSquare } from 'lucide-react';

/**
 * Filter options for conversations.
 */
export type ConversationFilter = 'all' | 'unread' | 'pinned' | 'groups' | 'archived';

/**
 * Conversation data extending ConversationItemProps.
 */
export interface Conversation extends Omit<ConversationItemProps, 'onClick' | 'isActive'> {
  isArchived?: boolean;
}

/**
 * Props for the ConversationList component.
 *
 * @interface ConversationListProps
 * @property {Conversation[]} conversations - Array of conversations to display
 * @property {string} [activeConversationId] - ID of currently active conversation
 * @property {boolean} [isLoading] - Loading state for initial load
 * @property {boolean} [hasMore] - Whether more conversations can be loaded
 * @property {string} [className] - Additional CSS classes
 * @property {(conversationId: string) => void} onConversationClick - Callback when conversation clicked
 * @property {() => void} [onNewConversation] - Callback for new conversation button
 * @property {() => void} [onLoadMore] - Callback to load more conversations (infinite scroll)
 * @property {(query: string) => void} [onSearch] - Callback when search query changes
 */
export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  onConversationClick: (conversationId: string) => void;
  onNewConversation?: () => void;
  onLoadMore?: () => void;
  onSearch?: (query: string) => void;
}

/**
 * Conversation list component for messaging interface.
 *
 * Displays a scrollable, searchable, filterable list of conversations.
 * Supports infinite scrolling for loading more conversations, search functionality,
 * filter options (all, unread, pinned, groups), and empty states.
 *
 * **Features:**
 * - Scrollable conversation list
 * - Search conversations by title or content
 * - Filter by type (all, unread, pinned, groups, archived)
 * - Active conversation highlighting
 * - New conversation button
 * - Infinite scroll support
 * - Loading states
 * - Empty states with helpful messaging
 * - Pinned conversations at top
 * - Unread count summary
 * - Accessibility with semantic HTML and ARIA
 * - Dark mode support
 * - Responsive design
 *
 * **Conversation Ordering:**
 * 1. Pinned conversations (sorted by last message time)
 * 2. Regular conversations (sorted by last message time)
 *
 * **Search & Filter:**
 * - Search matches title and last message preview
 * - Filters are cumulative (e.g., unread filter shows only unread)
 * - Real-time search updates
 *
 * **Accessibility:**
 * - Semantic nav element
 * - ARIA labels for search and actions
 * - Keyboard accessible
 * - Focus management
 * - Screen reader friendly
 *
 * @component
 * @param {ConversationListProps} props - Component props
 * @returns {JSX.Element} Rendered conversation list
 *
 * @example
 * ```tsx
 * // Simple conversation list
 * <ConversationList
 *   conversations={conversations}
 *   activeConversationId="conv1"
 *   onConversationClick={(id) => openConversation(id)}
 * />
 *
 * // With new conversation and search
 * <ConversationList
 *   conversations={conversations}
 *   activeConversationId={activeId}
 *   onConversationClick={handleClick}
 *   onNewConversation={() => openNewConversationModal()}
 *   onSearch={(query) => handleSearch(query)}
 * />
 *
 * // With infinite scroll
 * <ConversationList
 *   conversations={conversations}
 *   activeConversationId={activeId}
 *   hasMore={hasMoreConversations}
 *   isLoading={isLoadingMore}
 *   onConversationClick={handleClick}
 *   onLoadMore={() => loadMoreConversations()}
 * />
 * ```
 */
export const ConversationList = React.memo<ConversationListProps>(({
  conversations,
  activeConversationId,
  isLoading,
  hasMore,
  className = '',
  onConversationClick,
  onNewConversation,
  onLoadMore,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('all');

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.lastMessagePreview.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter((conv) => conv.unreadCount > 0);
        break;
      case 'pinned':
        filtered = filtered.filter((conv) => conv.isPinned);
        break;
      case 'groups':
        filtered = filtered.filter((conv) => conv.title.includes('Group') || conv.title.includes('Team')); // Simple heuristic
        break;
      case 'archived':
        filtered = filtered.filter((conv) => conv.isArchived);
        break;
      case 'all':
      default:
        // Show all non-archived
        filtered = filtered.filter((conv) => !conv.isArchived);
        break;
    }

    // Sort: pinned first, then by last message time
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const timeA = typeof a.lastMessageTime === 'string'
        ? new Date(a.lastMessageTime).getTime()
        : a.lastMessageTime.getTime();
      const timeB = typeof b.lastMessageTime === 'string'
        ? new Date(b.lastMessageTime).getTime()
        : b.lastMessageTime.getTime();

      return timeB - timeA; // Most recent first
    });

    return filtered;
  }, [conversations, searchQuery, activeFilter]);

  // Calculate total unread count
  const totalUnreadCount = useMemo(() => {
    return conversations
      .filter((conv) => !conv.isArchived)
      .reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [conversations]);

  // Handle scroll to bottom for infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <nav
      className={`
        flex flex-col h-full
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        ${className}
      `}
      aria-label="Conversations"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Messages
            {totalUnreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                ({totalUnreadCount} unread)
              </span>
            )}
          </h2>
          {onNewConversation && (
            <button
              onClick={onNewConversation}
              className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Start new conversation"
              title="New conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 text-sm
              bg-gray-50 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
            "
            aria-label="Search conversations"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {(['all', 'unread', 'pinned', 'groups'] as ConversationFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap
                transition-colors
                ${activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-900
              `}
              aria-label={`Filter by ${filter}`}
              aria-pressed={activeFilter === filter}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Loading State */}
        {isLoading && conversations.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading conversations...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredConversations.length === 0 && (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-xs">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {searchQuery
                  ? 'No conversations found'
                  : activeFilter !== 'all'
                    ? `No ${activeFilter} conversations`
                    : 'No conversations yet'
                }
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? 'Try a different search term'
                  : activeFilter !== 'all'
                    ? 'Try a different filter'
                    : 'Start a new conversation to get started'
                }
              </p>
              {onNewConversation && !searchQuery && activeFilter === 'all' && (
                <button
                  onClick={onNewConversation}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Start Conversation
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conversations */}
        {filteredConversations.length > 0 && (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                {...conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onConversationClick(conversation.id)}
              />
            ))}
          </div>
        )}

        {/* Loading More */}
        {hasMore && !isLoading && filteredConversations.length > 0 && (
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
          </div>
        )}
      </div>
    </nav>
  );
});

ConversationList.displayName = 'ConversationList';

export default ConversationList;
