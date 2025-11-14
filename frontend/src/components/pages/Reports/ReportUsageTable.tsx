/**
 * ReportUsageTable Component
 *
 * Displays a collapsible table of report usage analytics
 */

import React from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { ReportUsage } from './ReportAnalytics.types';
import { formatNumber, formatDuration } from './ReportAnalytics.helpers';

interface ReportUsageTableProps {
  reportUsage: ReportUsage[];
  expanded: boolean;
  onToggle: () => void;
}

const ReportUsageTable: React.FC<ReportUsageTableProps> = ({
  reportUsage,
  expanded,
  onToggle
}) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left"
        aria-label="Toggle report usage section"
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
        )}
        <h2 className="text-lg font-semibold text-gray-900">Report Usage Analytics</h2>
      </button>

      {expanded && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportUsage.slice(0, 10).map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.reportName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(report.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(report.downloads)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(report.avgExecutionTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(report.popularityScore, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{report.popularityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.lastUsed).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportUsageTable;
