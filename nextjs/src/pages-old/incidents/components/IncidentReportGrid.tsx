/**
 * IncidentReportGrid Component
 *
 * Grid/card view layout for displaying incident reports.
 * Responsive grid that adapts from 1 to 3 columns based on screen size.
 *
 * @module pages/incidents/components/IncidentReportGrid
 *
 * Features:
 * - Responsive grid layout (1-3 columns)
 * - Uses IncidentReportCard for each item
 * - Pagination controls
 * - Loading state with skeleton cards
 * - Empty state when no incidents
 * - Optimized for dashboard and overview pages
 * - HIPAA-compliant data display
 *
 * @example
 * ```tsx
 * <IncidentReportGrid
 *   incidents={incidents}
 *   loading={loading}
 *   onView={handleView}
 *   onEdit={handleEdit}
 *   page={1}
 *   totalPages={5}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */

import React from 'react';
import IncidentReportCard from './IncidentReportCard';
import { Button } from '@/components/ui/buttons/Button';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { IncidentReport } from '@/types/incidents';
import { cn } from '@/utils/cn';

/**
 * Props for IncidentReportGrid component
 */
interface IncidentReportGridProps {
  /** Array of incident reports to display */
  incidents: IncidentReport[];
  /** Loading state indicator */
  loading?: boolean;
  /** Callback when viewing an incident */
  onView?: (incidentId: string) => void;
  /** Callback when editing an incident */
  onEdit?: (incidentId: string) => void;
  /** Current page number (for pagination) */
  page?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingCardSkeleton - Skeleton placeholder for loading state
 */
const LoadingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * IncidentReportGrid Component
 *
 * Displays incident reports in a responsive grid of cards.
 * Supports pagination and provides comprehensive incident overview.
 */
const IncidentReportGrid: React.FC<IncidentReportGridProps> = ({
  incidents,
  loading = false,
  onView,
  onEdit,
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  /**
   * Handle view incident
   */
  const handleView = (incident: IncidentReport) => {
    onView?.(incident.id);
  };

  /**
   * Handle edit incident
   */
  const handleEdit = (incident: IncidentReport) => {
    onEdit?.(incident.id);
  };

  /**
   * Handle previous page
   */
  const handlePrevPage = () => {
    if (page > 1 && onPageChange) {
      onPageChange(page - 1);
    }
  };

  /**
   * Handle next page
   */
  const handleNextPage = () => {
    if (page < totalPages && onPageChange) {
      onPageChange(page + 1);
    }
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={cn('incident-report-grid', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (incidents.length === 0) {
    return (
      <div className={cn('incident-report-grid', className)}>
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No incident reports found"
          description="There are no incident reports to display. Create your first incident report to get started."
        />
      </div>
    );
  }

  return (
    <div className={cn('incident-report-grid', className)}>
      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {incidents.map((incident) => (
          <IncidentReportCard
            key={incident.id}
            incident={incident}
            onView={() => handleView(incident)}
            onEdit={() => handleEdit(incident)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNum: number;

                // Calculate which page numbers to show
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (page <= 3) {
                  pageNum = index + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = page - 2 + index;
                }

                const isCurrentPage = pageNum === page;

                return (
                  <Button
                    key={pageNum}
                    variant={isCurrentPage ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                    className={cn(
                      'w-10',
                      isCurrentPage && 'pointer-events-none'
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

IncidentReportGrid.displayName = 'IncidentReportGrid';

export default IncidentReportGrid;
