/**
 * MessagesContent Component (Refactored)
 * Orchestrates all message-related sub-components
 * Provides healthcare messaging interface for school health systems
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MessagesContentProps, HealthcareMessage, BulkActionType } from './types/message.types';
import { useMessages } from './hooks/useMessages';
import { useMessageFilters } from './hooks/useMessageFilters';
import { useMessageActions } from './hooks/useMessageActions';
import { MessageStats } from './MessageStats';
import { MessageFilters } from './MessageFilters';
import { MessageList } from './MessageList';
import { MessageDetail } from './MessageDetail';

/**
 * Main messages content component
 * Coordinates message loading, filtering, and actions
 */
const MessagesContent: React.FC<MessagesContentProps> = ({ initialMessages = [] }) => {
  // Message data and statistics
  const { messages, setMessages, loading, stats } = useMessages(initialMessages);

  // Message filtering and search
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    priorityFilter,
    setPriorityFilter,
    showFilters,
    setShowFilters,
    filteredMessages,
    clearFilters
  } = useMessageFilters(messages);

  // Message actions
  const {
    handleMarkAsRead,
    handleStarMessage,
    handleArchiveMessage,
    handleAcknowledgeMessage,
    handleBulkAction
  } = useMessageActions(setMessages);

  // UI state
  const [selectedMessage, setSelectedMessage] = useState<HealthcareMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Handle message selection for bulk actions
  const handleSelectMessage = (messageId: string, selected: boolean) => {
    const newSelected = new Set(selectedMessages);
    if (selected) {
      newSelected.add(messageId);
    } else {
      newSelected.delete(messageId);
    }
    setSelectedMessages(newSelected);
  };

  // Handle bulk action and clear selections if successful
  const handleBulkActionWrapper = (action: BulkActionType) => {
    const success = handleBulkAction(action, selectedMessages);
    if (success !== false) {
      setSelectedMessages(new Set());
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Healthcare Message Statistics */}
      <MessageStats stats={stats} />

      {/* Message Actions and Filters */}
      <MessageFilters
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
        selectedMessages={selectedMessages}
        onBulkAction={handleBulkActionWrapper}
        stats={stats}
      />

      {/* Messages List */}
      <MessageList
        messages={filteredMessages}
        selectedMessages={selectedMessages}
        onSelectMessage={handleSelectMessage}
        onMessageClick={setSelectedMessage}
        onMarkAsRead={handleMarkAsRead}
        onStar={handleStarMessage}
        onAcknowledge={handleAcknowledgeMessage}
        onArchive={handleArchiveMessage}
        searchQuery={searchQuery}
        filter={filter}
      />

      {/* Message Detail Modal */}
      <MessageDetail
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onAcknowledge={handleAcknowledgeMessage}
        onArchive={handleArchiveMessage}
      />
    </div>
  );
};

export default MessagesContent;
