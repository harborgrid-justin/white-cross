import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';

// Document types and categories
export type DocumentType = 'medical_record' | 'immunization_record' | 'medication_record' | 'incident_report' | 'emergency_contact' | 'consent_form' | 'allergy_record' | 'insurance_card' | 'iep_504' | 'health_plan' | 'prescription' | 'lab_result' | 'x_ray' | 'photo' | 'video' | 'other';
export type DocumentStatus = 'active' | 'archived' | 'pending_review' | 'expired' | 'requires_update' | 'confidential';
export type AccessLevel = 'public' | 'staff_only' | 'nurse_only' | 'admin_only' | 'restricted';

interface DocumentFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: DocumentType | 'all';
  setTypeFilter: (type: DocumentType | 'all') => void;
  statusFilter: DocumentStatus | 'all';
  setStatusFilter: (status: DocumentStatus | 'all') => void;
  accessFilter: AccessLevel | 'all';
  setAccessFilter: (access: AccessLevel | 'all') => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  setSortBy: (sort: 'name' | 'date' | 'size' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const DocumentFiltersComponent: React.FC<DocumentFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  accessFilter,
  setAccessFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters
}) => {
  const clearAllFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setAccessFilter('all');
    setSearchQuery('');
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents, students, or tags..."
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

      {/* Advanced Filters */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level
              </label>
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as AccessLevel | 'all')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size' | 'type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort documents by"
              >
                <option value="date">Date Modified</option>
                <option value="name">Name</option>
                <option value="size">File Size</option>
                <option value="type">Document Type</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
