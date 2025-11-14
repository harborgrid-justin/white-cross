'use client';

import React, { useState } from 'react';
import {
  Eye,
  Download,
  BarChart3,
  Star,
  Bookmark,
  MoreVertical
} from 'lucide-react';
import ReportCard from './ReportCard';
import type { Report } from './ReportCard';
import type { ReportViewProps } from './ReportList.types';
import { getCategoryInfo, getStatusInfo } from './ReportList.utils';

/**
 * Grid view component for displaying reports in a grid layout
 *
 * @param props - ReportViewProps
 * @returns JSX element representing the grid view
 */
export const ReportGridView: React.FC<ReportViewProps> = ({
  reports,
  bulkSelection,
  selectedReports,
  canManage,
  canRun,
  canShare,
  onReportClick,
  onViewReport,
  onRunReport,
  onDownloadReport,
  onShareReport,
  onToggleBookmark,
  onToggleFavorite,
  onSelectionChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          variant="default"
          selectable={bulkSelection}
          selected={selectedReports.includes(report.id)}
          canManage={canManage}
          canRun={canRun}
          canShare={canShare}
          onClick={onReportClick}
          onView={onViewReport}
          onRun={onRunReport}
          onDownload={onDownloadReport}
          onShare={onShareReport}
          onToggleBookmark={onToggleBookmark}
          onToggleFavorite={onToggleFavorite}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
};

/**
 * List view component for displaying reports in a compact list layout
 *
 * @param props - ReportViewProps
 * @returns JSX element representing the list view
 */
export const ReportListView: React.FC<ReportViewProps> = ({
  reports,
  bulkSelection,
  selectedReports,
  canManage,
  canRun,
  canShare,
  onReportClick,
  onViewReport,
  onRunReport,
  onDownloadReport,
  onShareReport,
  onToggleBookmark,
  onToggleFavorite,
  onSelectionChange
}) => {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          variant="compact"
          selectable={bulkSelection}
          selected={selectedReports.includes(report.id)}
          canManage={canManage}
          canRun={canRun}
          canShare={canShare}
          onClick={onReportClick}
          onView={onViewReport}
          onRun={onRunReport}
          onDownload={onDownloadReport}
          onShare={onShareReport}
          onToggleBookmark={onToggleBookmark}
          onToggleFavorite={onToggleFavorite}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
};

/**
 * Props for ReportTableView component
 */
interface ReportTableViewProps extends ReportViewProps {
  /** Select all handler */
  onSelectAll?: (selected: boolean) => void;
}

/**
 * Table view component for displaying reports in a detailed table layout
 *
 * @param props - ReportTableViewProps
 * @returns JSX element representing the table view
 */
export const ReportTableView: React.FC<ReportTableViewProps> = ({
  reports,
  bulkSelection,
  selectedReports,
  canRun,
  onReportClick,
  onViewReport,
  onRunReport,
  onDownloadReport,
  onSelectionChange,
  onSelectAll
}) => {
  const [hoveredReport, setHoveredReport] = useState<string | null>(null);

  /**
   * Handles select all checkbox change
   */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(e.target.checked);
  };

  /**
   * Handles individual row selection change
   */
  const handleRowSelectionChange = (reportId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange?.(reportId, e.target.checked);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {bulkSelection && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === reports.length && reports.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all reports"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metrics
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => {
              const categoryInfo = getCategoryInfo(report.category);
              const statusInfo = getStatusInfo(report.status);
              const CategoryIcon = categoryInfo.icon;

              return (
                <tr
                  key={report.id}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${selectedReports.includes(report.id) ? 'bg-blue-50' : ''}
                  `}
                  onMouseEnter={() => setHoveredReport(report.id)}
                  onMouseLeave={() => setHoveredReport(null)}
                >
                  {bulkSelection && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => handleRowSelectionChange(report.id, e)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select report ${report.title}`}
                      />
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`p-2 rounded-lg ${categoryInfo.color.replace('text-', 'text-').replace('600', '100')}
                                    ${categoryInfo.color.replace('text-', 'bg-').replace('600', '100')}`}
                        >
                          <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => onReportClick?.(report)}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {report.title}
                          </button>
                          {report.isFavorite && (
                            <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
                          )}
                          {report.isBookmarked && (
                            <Bookmark className="w-4 h-4 ml-1 text-blue-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{categoryInfo.label}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.author.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.lastUpdated.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {report.metrics.views}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {report.metrics.downloads}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onViewReport && (
                        <button
                          onClick={() => onViewReport(report.id)}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {canRun && onRunReport && (
                        <button
                          onClick={() => onRunReport(report.id)}
                          className="text-gray-400 hover:text-green-600"
                          title="Run Report"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      )}

                      {onDownloadReport && (
                        <button
                          onClick={() => onDownloadReport(report.id, 'pdf')}
                          className="text-gray-400 hover:text-purple-600"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      <button className="text-gray-400 hover:text-gray-600" title="More Options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
