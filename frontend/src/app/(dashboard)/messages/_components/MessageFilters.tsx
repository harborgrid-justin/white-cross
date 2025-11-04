/**
 * MessageFilters Component
 * Provides search, filtering, and bulk action controls for messages
 */

'use client';

import React from 'react';
import { Plus, Filter, Eye, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';
import { Card } from '@/components/ui/card';
import {
  MessageFilterType,
  MessageType,
  MessagePriority,
  MessageStats,
  BulkActionType
} from './types/message.types';

interface MessageFiltersProps {
  // Filter state
  filter: MessageFilterType;
  setFilter: (filter: MessageFilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: MessageType | 'all';
  setTypeFilter: (type: MessageType | 'all') => void;
  priorityFilter: MessagePriority | 'all';
  setPriorityFilter: (priority: MessagePriority | 'all') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;

  // Bulk actions
  selectedMessages: Set<string>;
  onBulkAction: (action: BulkActionType) => void;

  // Statistics for filter tabs
  stats: MessageStats;
}

/**
 * Message filters and actions component
 * Handles search, filtering, and bulk operations
 */
export const MessageFilters: React.FC<MessageFiltersProps> = ({
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
  clearFilters,
  selectedMessages,
  onBulkAction,
  stats
}) => {
  return (
    <Card>
      {/* Primary Actions and Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Primary Actions */}
          <div className="flex items-center gap-3">
            <Link href="/messages/new">
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </Link>

            {/* Bulk Actions */}
            {selectedMessages.size > 0 && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <span className="text-sm text-gray-600">
                  {selectedMessages.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('read')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('archive')}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3">
            <div className="w-64">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search messages, senders, or students..."
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="message-type-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message Type
                </label>
                <select
                  id="message-type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as MessageType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="emergency">Emergency</option>
                  <option value="medical">Medical</option>
                  <option value="appointment">Appointments</option>
                  <option value="medication">Medication</option>
                  <option value="incident">Incidents</option>
                  <option value="parent_communication">Parent Communication</option>
                  <option value="staff_notification">Staff Notifications</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority Level
                </label>
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as MessagePriority | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="emergency">Emergency</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Messages', count: stats.total },
            { key: 'unread', label: 'Unread', count: stats.unread },
            { key: 'emergency', label: 'Emergency', count: stats.emergency },
            { key: 'medical', label: 'Medical', count: stats.medical },
            { key: 'starred', label: 'Starred', count: stats.starred },
            { key: 'archived', label: 'Archived', count: stats.archived }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as MessageFilterType)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
