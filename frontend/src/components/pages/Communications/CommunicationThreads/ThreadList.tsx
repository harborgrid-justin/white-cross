/**
 * WF-COMP-317 | ThreadList.tsx - Communication thread list component
 * Purpose: Display and manage list of communication threads with search
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: ThreadList component | Key Features: Thread listing, search, selection
 * Last Updated: 2025-11-11 | File Type: .tsx
 * Critical Path: Thread data → List rendering → User selection → Parent callback
 * LLM Context: Thread list component, part of modular communication architecture
 */

'use client';

import React, { useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

import type { ThreadListProps, CommunicationThread } from './types';

/**
 * ThreadList component for displaying and managing communication threads
 * 
 * Features:
 * - Search functionality
 * - Thread filtering
 * - Selection handling
 * - Unread count indicators
 * - Priority and status badges
 * - Responsive design
 * 
 * @component
 */
export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  selectedThread,
  searchQuery,
  onSearchChange,
  onThreadSelect,
  className = ''
}) => {
  // Filter threads based on search query
  const filteredThreads = useMemo(() => {
    if (!searchQuery) return threads;
    
    const searchLower = searchQuery.toLowerCase();
    return threads.filter(thread =>
      (thread.subject && thread.subject.toLowerCase().includes(searchLower)) ||
      thread.participants.some(p => p.name.toLowerCase().includes(searchLower)) ||
      thread.messages.some(m => m.content.toLowerCase().includes(searchLower)) ||
      (thread.metadata.student_name && thread.metadata.student_name.toLowerCase().includes(searchLower))
    );
  }, [threads, searchQuery]);

  // Handle thread selection with read status update
  const handleThreadSelect = (thread: CommunicationThread): void => {
    onThreadSelect(thread);
  };

  // Get priority color classes
  const getPriorityColor = (priority: CommunicationThread['priority']): string => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status color classes
  const getStatusColor = (status: CommunicationThread['status']): string => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      case 'archived':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'No conversations found matching your search' : 'No conversations found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => handleThreadSelect(thread)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedThread?.id === thread.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {thread.subject || `${thread.type.charAt(0).toUpperCase() + thread.type.slice(1)} Thread`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {thread.metadata.student_name}
                    </p>
                  </div>
                  {thread.metadata.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {thread.metadata.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(thread.priority)}`}>
                    {thread.priority}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(thread.status)}`}>
                    {thread.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {thread.participants.length} participant{thread.participants.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(thread.metadata.last_activity).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {thread.messages.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {thread.messages[thread.messages.length - 1]?.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadList;
