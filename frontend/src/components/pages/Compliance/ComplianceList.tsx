'use client';

import React, { useState } from 'react';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  User,
  Calendar,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Grid,
  List,
  Users,
  Settings
} from 'lucide-react';
import { ComplianceRequirement, ComplianceStatus, ComplianceCategory, CompliancePriority } from './ComplianceCard';

/**
 * View mode types
 */
type ViewMode = 'grid' | 'list' | 'table' | 'kanban';

/**
 * Props for the ComplianceList component
 */
interface ComplianceListProps {
  /** Array of compliance requirements */
  requirements?: ComplianceRequirement[];
  /** Loading state */
  loading?: boolean;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Selected requirement IDs for bulk operations */
  selectedRequirements?: string[];
  /** Current page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Total items count */
  totalItems?: number;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  activeFilters?: {
    status: string[];
    category: string[];
    priority: string[];
    assignee: string[];
  };
  /** Custom CSS classes */
  className?: string;
  /** Requirement click handler */
  onRequirementClick?: (requirement: ComplianceRequirement) => void;
  /** View details handler */
  onViewDetails?: (requirement: ComplianceRequirement) => void;
  /** Edit requirement handler */
  onEditRequirement?: (requirement: ComplianceRequirement) => void;
  /** Delete requirement handler */
  onDeleteRequirement?: (requirement: ComplianceRequirement) => void;
  /** Download evidence handler */
  onDownloadEvidence?: (requirement: ComplianceRequirement, evidenceId: string) => void;
  /** Share requirement handler */
  onShareRequirement?: (requirement: ComplianceRequirement) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, requirementIds: string[]) => void;
}

/**
 * ComplianceList Component
 * 
 * A comprehensive list component for displaying compliance requirements with multiple
 * view modes (grid, list, table, kanban), bulk operations, pagination, and filtering.
 * Features responsive design and accessibility support.
 * 
 * @param props - ComplianceList component props
 * @returns JSX element representing the compliance requirements list
 */
const ComplianceList = ({
  requirements = [],
  loading = false,
  viewMode = 'grid',
  selectedRequirements = [],
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 12,
  totalItems = 0,
  searchTerm = '',
  activeFilters = {
    status: [],
    category: [],
    priority: [],
    assignee: []
  },
  className = '',
  onRequirementClick,
  onViewDetails,
  onEditRequirement,
  onDeleteRequirement,
  onDownloadEvidence,
  onShareRequirement,
  onSelectionChange,
  onPageChange,
  onViewModeChange,
  onBulkActions
}: ComplianceListProps) => {
  // State
  const [showBulkActions, setShowBulkActions] = useState(false);

  /**
   * Gets status configuration
   */
  const getStatusConfig = (status: ComplianceStatus) => {
    const configs = {
      compliant: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Compliant'
      },
      'non-compliant': {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertCircle,
        label: 'Non-Compliant'
      },
      pending: {
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Clock,
        label: 'Pending'
      },
      expired: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Expired'
      },
      warning: {
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        icon: AlertTriangle,
        label: 'Warning'
      }
    };
    return configs[status];
  };

  /**
   * Gets category configuration
   */
  const getCategoryConfig = (category: ComplianceCategory) => {
    const configs = {
      hipaa: { label: 'HIPAA', color: 'bg-blue-100 text-blue-800' },
      ferpa: { label: 'FERPA', color: 'bg-purple-100 text-purple-800' },
      clia: { label: 'CLIA', color: 'bg-green-100 text-green-800' },
      osha: { label: 'OSHA', color: 'bg-orange-100 text-orange-800' },
      state: { label: 'State', color: 'bg-indigo-100 text-indigo-800' },
      federal: { label: 'Federal', color: 'bg-red-100 text-red-800' },
      local: { label: 'Local', color: 'bg-gray-100 text-gray-800' },
      internal: { label: 'Internal', color: 'bg-teal-100 text-teal-800' }
    };
    return configs[category];
  };

  /**
   * Gets priority configuration
   */
  const getPriorityConfig = (priority: CompliancePriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      critical: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Handles requirement selection
   */
  const handleRequirementSelect = (requirementId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedRequirements, requirementId]
      : selectedRequirements.filter(id => id !== requirementId);
    onSelectionChange?.(newSelection);
  };

  /**
   * Handles select all
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? requirements.map(req => req.id) : [];
    onSelectionChange?.(newSelection);
  };

  /**
   * Renders requirement card for grid view
   */
  const renderRequirementCard = (requirement: ComplianceRequirement) => {
    const statusConfig = getStatusConfig(requirement.status);
    const categoryConfig = getCategoryConfig(requirement.category);
    const priorityConfig = getPriorityConfig(requirement.priority);
    const StatusIcon = statusConfig.icon;
    const completedTasks = requirement.tasks.filter(task => task.completed).length;
    const daysUntilDue = Math.ceil((new Date(requirement.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div
        key={requirement.id}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onRequirementClick?.(requirement)}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRequirementClick?.(requirement);
          }
        }}
        aria-label={`Compliance requirement: ${requirement.title}`}
      >
        {/* Selection checkbox */}
        <div className="flex items-start justify-between mb-4">
          <input
            type="checkbox"
            checked={selectedRequirements.includes(requirement.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              handleRequirementSelect(requirement.id, e.target.checked);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {requirement.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {requirement.description}
          </p>
        </div>

        {/* Priority and Due Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-sm font-medium capitalize ${priorityConfig.color}`}>
              {requirement.priority}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {daysUntilDue > 0 ? `${daysUntilDue}d left` : 
               daysUntilDue === 0 ? 'Due today' : 'Overdue'}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{requirement.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${requirement.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{requirement.assignedToName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(requirement);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditRequirement?.(requirement);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Edit requirement"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders requirement row for table view
   */
  const renderRequirementRow = (requirement: ComplianceRequirement) => {
    const statusConfig = getStatusConfig(requirement.status);
    const categoryConfig = getCategoryConfig(requirement.category);
    const priorityConfig = getPriorityConfig(requirement.priority);
    const StatusIcon = statusConfig.icon;

    return (
      <tr
        key={requirement.id}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => onRequirementClick?.(requirement)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedRequirements.includes(requirement.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleRequirementSelect(requirement.id, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                {requirement.title}
              </div>
              <div className="text-sm text-gray-500 max-w-xs truncate">
                {requirement.description}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
            {categoryConfig.label}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-sm font-medium capitalize ${priorityConfig.color}`}>
              {requirement.priority}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(requirement.dueDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${requirement.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{requirement.progress}%</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {requirement.assignedToName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(requirement);
              }}
              className="text-blue-600 hover:text-blue-900"
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditRequirement?.(requirement);
              }}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Edit requirement"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDeleteRequirement?.(requirement);
              }}
              className="text-red-600 hover:text-red-900"
              aria-label="Delete requirement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header with bulk actions */}
      {selectedRequirements.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRequirements.length} requirement{selectedRequirements.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => onSelectionChange?.([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkActions?.('export', selectedRequirements)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 
                         bg-white border border-blue-200 rounded hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => onBulkActions?.('assign', selectedRequirements)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 
                         bg-white border border-blue-200 rounded hover:bg-blue-50"
              >
                <User className="w-4 h-4 mr-2" />
                Assign
              </button>
              <button
                onClick={() => onBulkActions?.('delete', selectedRequirements)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 
                         bg-white border border-red-200 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {requirements.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(activeFilters).some(arr => arr.length > 0)
                ? 'No compliance requirements match your current search or filters.'
                : 'No compliance requirements have been created yet.'
              }
            </p>
            {searchTerm || Object.values(activeFilters).some(arr => arr.length > 0) ? (
              <button
                onClick={() => {/* Clear filters */}}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 
                         bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {requirements.map(renderRequirementCard)}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {requirements.map(renderRequirementCard)}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedRequirements.length === requirements.length && requirements.length > 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requirements.map(renderRequirementRow)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + Math.max(1, currentPage - 2);
                        return (
                          <button
                            key={page}
                            onClick={() => onPageChange?.(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComplianceList;
