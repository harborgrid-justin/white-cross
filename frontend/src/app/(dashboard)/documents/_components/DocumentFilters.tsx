/**
 * DocumentFilters Component
 * Provides search, filtering, sorting, and view mode controls
 */

import React from 'react';
import {
  Plus,
  Upload,
  Download,
  Filter,
  Share2,
  Archive,
  List,
  Grid3x3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';
import type { DocumentType, DocumentStatus, AccessLevel, ViewMode } from './types/document.types';

interface DocumentFiltersProps {
  // Search and filter state
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: DocumentType | 'all';
  onTypeFilterChange: (type: DocumentType | 'all') => void;
  statusFilter: DocumentStatus | 'all';
  onStatusFilterChange: (status: DocumentStatus | 'all') => void;
  accessFilter: AccessLevel | 'all';
  onAccessFilterChange: (access: AccessLevel | 'all') => void;

  // Sort state
  sortBy: 'name' | 'date' | 'size' | 'type';
  onSortByChange: (sortBy: 'name' | 'date' | 'size' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;

  // View state
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;

  // Filter visibility
  showFilters: boolean;
  onToggleFilters: () => void;

  // Clear filters
  onClearFilters: () => void;

  // Bulk actions
  selectedCount: number;
  onBulkDownload?: () => void;
  onBulkShare?: () => void;
  onBulkArchive?: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  accessFilter,
  onAccessFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  selectedCount,
  onBulkDownload,
  onBulkShare,
  onBulkArchive,
}) => {
  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Primary Actions */}
          <div className="flex items-center gap-3">
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>

            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>

            {/* Bulk Actions */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <span className="text-sm text-gray-600">{selectedCount} selected</span>
                {onBulkDownload && (
                  <Button variant="outline" size="sm" onClick={onBulkDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                {onBulkShare && (
                  <Button variant="outline" size="sm" onClick={onBulkShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
                {onBulkArchive && (
                  <Button variant="outline" size="sm" onClick={onBulkArchive}>
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            <div className="w-64">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search documents, students, or tags..."
              />
            </div>

            <Button
              variant="outline"
              onClick={onToggleFilters}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid view"
                aria-label="Switch to grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="List view"
                aria-label="Switch to list view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid gap-4 md:grid-cols-5">
              {/* Document Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => onTypeFilterChange(e.target.value as DocumentType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by document type"
                >
                  <option value="all">All Types</option>
                  <option value="medical_record">Medical Records</option>
                  <option value="immunization_record">Immunization Records</option>
                  <option value="allergy_record">Allergy Records</option>
                  <option value="incident_report">Incident Reports</option>
                  <option value="iep_504">IEP/504 Plans</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    onStatusFilterChange(e.target.value as DocumentStatus | 'all')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by document status"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="archived">Archived</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Access Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select
                  value={accessFilter}
                  onChange={(e) => onAccessFilterChange(e.target.value as AccessLevel | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by access level"
                >
                  <option value="all">All Levels</option>
                  <option value="public">Public</option>
                  <option value="staff_only">Staff Only</option>
                  <option value="nurse_only">Nurse Only</option>
                  <option value="admin_only">Admin Only</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    onSortByChange(e.target.value as 'name' | 'date' | 'size' | 'type')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sort documents by"
                >
                  <option value="date">Date Modified</option>
                  <option value="name">Name</option>
                  <option value="size">File Size</option>
                  <option value="type">Document Type</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" onClick={onClearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
