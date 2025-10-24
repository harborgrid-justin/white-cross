/**
 * WF-COM-018 | ComplianceReportsList Component
 * Purpose: Display list of compliance reports with filtering and pagination
 * Dependencies: Redux store, compliance types
 * Features: Sortable list, filters, pagination, role-based access
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Filter, Plus, Download, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchComplianceReports,
  selectReports,
  selectLoading,
  selectReportsPagination,
  setReportFilters,
  setReportsPagination
} from '../store';

/**
 * ComplianceReportsList - Main list view for compliance reports
 *
 * Displays compliance reports with:
 * - Filtering by type, status, date range
 * - Pagination support
 * - Quick actions (view, download)
 * - Create new report button
 *
 * @example
 * ```tsx
 * <ComplianceReportsList />
 * ```
 */
const ComplianceReportsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectReports);
  const loading = useAppSelector(state => selectLoading(state).reports);
  const pagination = useAppSelector(selectReportsPagination);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    reportType: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Fetch reports on mount
  useEffect(() => {
    dispatch(fetchComplianceReports());
  }, [dispatch]);

  /**
   * Handle filter application
   */
  const handleApplyFilters = () => {
    dispatch(setReportFilters(localFilters));
    dispatch(fetchComplianceReports());
  };

  /**
   * Handle pagination change
   */
  const handlePageChange = (newPage: number) => {
    dispatch(setReportsPagination({ page: newPage }));
    dispatch(fetchComplianceReports());
  };

  /**
   * Navigate to report details
   */
  const handleViewReport = (reportId: string) => {
    navigate(`/compliance/reports/${reportId}`);
  };

  /**
   * Navigate to create new report
   */
  const handleCreateReport = () => {
    navigate('/compliance/reports/new');
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-600 mt-1">Manage and view compliance reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={handleCreateReport}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Report Type</label>
              <select
                className="input"
                value={localFilters.reportType}
                onChange={(e) => setLocalFilters({ ...localFilters, reportType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="HIPAA">HIPAA</option>
                <option value="FERPA">FERPA</option>
                <option value="AUDIT">Audit</option>
                <option value="INCIDENT">Incident</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input"
                value={localFilters.startDate}
                onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                className="input"
                value={localFilters.endDate}
                onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleApplyFilters} className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Created By</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No reports found. Create your first report to get started.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="font-medium">{report.reportName || report.title || 'Untitled Report'}</td>
                    <td>
                      <span className="badge badge-info">{report.reportType}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        report.status === 'COMPLETED' ? 'badge-success' :
                        report.status === 'PENDING' ? 'badge-warning' :
                        report.status === 'DRAFT' ? 'badge-secondary' :
                        'badge-default'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>{report.createdBy?.name || 'System'}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="btn btn-sm btn-ghost"
                          title="View Report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reports
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-sm btn-secondary"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-sm btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceReportsList;
