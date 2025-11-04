/**
 * @fileoverview Report History Component - Reports list with actions
 * @module app/(dashboard)/reports/_components/ReportHistory
 * @category Reports - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Download,
  Share2,
  Edit,
  Pause,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Users,
  Target,
  Calendar,
  FileText
} from 'lucide-react';
import {
  getCategoryBadgeVariant,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  formatDate
} from './utils';
import type { ReportHistoryProps, Report } from './types';

/**
 * Report Item Component
 *
 * Individual report card with status, metadata, and actions
 */
interface ReportItemProps {
  report: Report;
  isSelected: boolean;
  onToggleSelection: (reportId: string) => void;
}

function ReportItem({ report, isSelected, onToggleSelection }: ReportItemProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(report.id)}
            className="mt-1"
            aria-label={`Select report: ${report.title}`}
          />

          {/* Report Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {report.title}
              </h4>
              <Badge variant={getCategoryBadgeVariant(report.category)} className="text-xs">
                {report.category}
              </Badge>
              <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs">
                {report.status}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(report.priority)} className="text-xs">
                {report.priority}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{report.description}</p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {report.generatedBy}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {report.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(report.createdAt)}
              </span>
              {report.size && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {report.size}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {report.downloadCount} downloads
              </span>
              {report.schedule && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  {report.schedule}
                </span>
              )}
            </div>

            {/* Tags */}
            {report.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {report.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {report.status === 'COMPLETED' && (
            <>
              <Button variant="ghost" size="sm" aria-label="View report">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Download report">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Share report">
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {report.status === 'PROCESSING' && (
            <Button variant="ghost" size="sm" aria-label="Pause report generation">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {report.status === 'DRAFT' && (
            <Button variant="ghost" size="sm" aria-label="Edit report">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" aria-label="Open report details">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ReportHistory Component
 *
 * Displays list of reports with filtering, sorting, and bulk selection.
 *
 * Features:
 * - Report list with detailed metadata
 * - Bulk selection support
 * - Status-based action buttons
 * - Tag display
 * - Refresh functionality
 * - Loading skeleton states
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState(new Set());
 *
 * <ReportHistory
 *   reports={reports}
 *   selectedReports={selected}
 *   onToggleSelection={(id) => {
 *     const newSet = new Set(selected);
 *     newSet.has(id) ? newSet.delete(id) : newSet.add(id);
 *     setSelected(newSet);
 *   }}
 * />
 * ```
 */
export function ReportHistory({
  reports,
  loading = false,
  selectedReports,
  onToggleSelection,
  onRefresh
}: ReportHistoryProps) {
  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <p className="text-sm text-gray-500">
              {reports.length} reports • {selectedReports.size} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              aria-label="Refresh reports list"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" aria-label="Change view mode">
              View: List
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-6">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                isSelected={selectedReports.has(report.id)}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
