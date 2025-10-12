/**
 * Incident Reports Table Component
 *
 * Displays the main table of incident reports with sorting and actions
 *
 * @module components/IncidentReportsTable
 */

import React from 'react';
import { Eye, CheckCircle, Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IncidentReport, IncidentStatus } from '../../../types/incidents';
import {
  getIncidentSeverityColor,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
} from '../../../types/incidents';
import type { IncidentSortColumn } from '../types';

interface IncidentReportsTableProps {
  reports: IncidentReport[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalReports: number;
  totalPages: number;
  pageSizeOptions: number[];
  sortColumn: IncidentSortColumn;
  onViewIncident: (reportId: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (column: IncidentSortColumn) => void;
  getSortIndicator: (column: IncidentSortColumn) => string;
}

/**
 * Get status badge color
 */
const getStatusColor = (status?: IncidentStatus) => {
  switch (status) {
    case 'OPEN':
      return 'text-blue-600 bg-blue-100';
    case 'INVESTIGATING':
      return 'text-yellow-600 bg-yellow-100';
    case 'RESOLVED':
      return 'text-green-600 bg-green-100';
    case 'CLOSED':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Table component for incident reports
 */
export default function IncidentReportsTable({
  reports,
  isLoading,
  page,
  pageSize,
  totalReports,
  totalPages,
  pageSizeOptions,
  sortColumn,
  onViewIncident,
  onPageChange,
  onPageSizeChange,
  onSort,
  getSortIndicator,
}: IncidentReportsTableProps) {
  return (
    <div className="card">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Incident Reports
            {isLoading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {reports.length > 0 ? ((page - 1) * pageSize + 1) : 0} to{' '}
              {Math.min(page * pageSize, totalReports)} of {totalReports}
            </span>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('occurredAt')}
                >
                  Date {getSortIndicator('occurredAt')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('type')}
                >
                  Type {getSortIndicator('type')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('severity')}
                >
                  Severity {getSortIndicator('severity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('status')}
                >
                  Status {getSortIndicator('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onViewIncident(report.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.occurredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getIncidentTypeLabel(report.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIncidentSeverityColor(
                        report.severity
                      )}`}
                    >
                      {getIncidentSeverityLabel(report.severity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.student
                      ? `${report.student.firstName} ${report.student.lastName}`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status || 'OPEN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {report.parentNotified && (
                        <span
                          className="text-green-600"
                          title="Parent Notified"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </span>
                      )}
                      {report.followUpRequired && (
                        <span
                          className="text-orange-600"
                          title="Follow-up Required"
                        >
                          <Clock className="h-4 w-4" />
                        </span>
                      )}
                      {report.insuranceClaimNumber && (
                        <span
                          className="text-blue-600"
                          title="Insurance Claim Filed"
                        >
                          <Shield className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewIncident(report.id);
                      }}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {reports.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
