/**
 * ComplianceEvidenceControls component
 * Search, filter, and view mode controls for evidence
 */

import React from 'react'
import { Search, Upload } from 'lucide-react'
import type { ComplianceEvidenceControlsProps } from './ComplianceEvidenceTypes'

/**
 * ComplianceEvidenceControls component
 *
 * Provides controls for:
 * - Search functionality
 * - Type filtering
 * - Category filtering
 * - Status filtering
 * - Priority filtering
 * - View mode selection
 * - Upload action
 */
export default function ComplianceEvidenceControls({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  viewMode,
  onViewModeChange,
  onUploadEvidence
}: ComplianceEvidenceControlsProps) {
  return (
    <div className="space-y-4">
      {/* Header with Upload Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Evidence Library</h2>
          <p className="text-gray-600 mt-1">Manage compliance evidence and documentation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onUploadEvidence}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Upload new evidence"
          >
            <Upload className="h-4 w-4" />
            Upload Evidence
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search evidence"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFilterTypeChange(e.target.value as typeof filterType)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="screenshot">Screenshot</option>
            <option value="certificate">Certificate</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFilterCategoryChange(e.target.value as typeof filterCategory)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="audit">Audit</option>
            <option value="training">Training</option>
            <option value="policy">Policy</option>
            <option value="incident">Incident</option>
            <option value="regulatory">Regulatory</option>
            <option value="assessment">Assessment</option>
            <option value="monitoring">Monitoring</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFilterStatusChange(e.target.value as typeof filterStatus)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under-review">Under Review</option>
            <option value="archived">Archived</option>
          </select>

          {/* View Mode */}
          <select
            value={viewMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onViewModeChange(e.target.value as typeof viewMode)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Change view mode"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="table">Table View</option>
          </select>
        </div>
      </div>
    </div>
  )
}
