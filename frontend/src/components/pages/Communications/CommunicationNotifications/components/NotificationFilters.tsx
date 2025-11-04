'use client';

import React from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import type { NotificationSortBy, SortOrder } from '../types';

interface NotificationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: NotificationSortBy;
  onSortByChange: (sortBy: NotificationSortBy) => void;
  sortOrder: SortOrder;
  onSortOrderToggle: () => void;
  selectedCount: number;
  onBulkMarkRead: () => void;
  onBulkDismiss: () => void;
  onBulkArchive: () => void;
}

/**
 * NotificationFilters component - provides filtering, sorting, and bulk action controls
 */
export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  selectedCount,
  onBulkMarkRead,
  onBulkDismiss,
  onBulkArchive
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search notifications"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="emergency">Emergency</option>
          <option value="appointment">Appointment</option>
          <option value="medication">Medication</option>
          <option value="general">General</option>
          <option value="system">System</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onPriorityChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="dismissed">Dismissed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Sort and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortByChange(e.target.value as NotificationSortBy)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={onSortOrderToggle}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkMarkRead}
              className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Mark Read
            </button>
            <button
              onClick={onBulkDismiss}
              className="px-2 py-1 text-xs font-medium text-yellow-600 hover:text-yellow-800"
            >
              Dismiss
            </button>
            <button
              onClick={onBulkArchive}
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
