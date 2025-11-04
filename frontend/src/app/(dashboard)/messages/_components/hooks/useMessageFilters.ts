/**
 * Custom hook for managing message filtering and search
 */

import { useState, useMemo } from 'react';
import {
  HealthcareMessage,
  MessageFilterType,
  MessageType,
  MessagePriority
} from '../types/message.types';

/**
 * Hook for managing message filters, search, and sorting
 * @param messages - Array of messages to filter
 * @returns Filter state, setters, and filtered messages
 */
export const useMessageFilters = (messages: HealthcareMessage[]) => {
  const [filter, setFilter] = useState<MessageFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MessageType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter messages based on current filters
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(msg => msg.status === 'unread');
    } else if (filter === 'starred') {
      filtered = filtered.filter(msg => msg.status === 'starred');
    } else if (filter === 'archived') {
      filtered = filtered.filter(msg => msg.status === 'archived');
    } else if (filter === 'emergency') {
      filtered = filtered.filter(msg => msg.type === 'emergency' || msg.priority === 'emergency');
    } else if (filter === 'medical') {
      filtered = filtered.filter(msg => msg.type === 'medical');
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(msg => msg.type === typeFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(msg => msg.priority === priorityFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(query) ||
        msg.content.toLowerCase().includes(query) ||
        msg.from.name.toLowerCase().includes(query) ||
        msg.tags.some(tag => tag.toLowerCase().includes(query)) ||
        msg.relatedStudent?.name.toLowerCase().includes(query)
      );
    }

    // Sort by priority and timestamp
    return filtered.sort((a, b) => {
      // Emergency messages first
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;

      // Then by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [messages, filter, typeFilter, priorityFilter, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  return {
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
  };
};
