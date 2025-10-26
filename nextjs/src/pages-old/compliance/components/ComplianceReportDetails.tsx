/**
 * WF-COM-020 | ComplianceReportDetails Component
 * Purpose: Display detailed view of a compliance report
 * Dependencies: Redux store, routing
 * Features: Full report view, PDF export, edit navigation
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit2, Download, ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchComplianceReport,
  selectSelectedReport,
  selectLoading
} from '../store';

/**
 * ComplianceReportDetails - Detailed view of compliance report
 *
 * @example
 * ```tsx
 * <ComplianceReportDetails />
 * ```
 */
const ComplianceReportDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const report = useAppSelector(selectSelectedReport);
  const loading = useAppSelector(state => selectLoading(state).operations);

  useEffect(() => {
    if (id) {
      dispatch(fetchComplianceReport(id));
    }
  }, [id, dispatch]);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/compliance/reports')}
            className="btn btn-ghost"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {report.reportName || 'Compliance Report'}
            </h1>
            <p className="text-gray-600 mt-1">Compliance Report Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => navigate(`/compliance/reports/${id}/edit`)}
            className="btn btn-primary flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{report.description || 'No description provided.'}</p>
              </div>

              {report.findings && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Findings</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{report.findings}</p>
                  </div>
                </div>
              )}

              {report.recommendations && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{report.recommendations}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Report Type</p>
                  <p className="text-sm text-gray-600">{report.reportType}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Created Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {report.createdBy && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created By</p>
                    <p className="text-sm text-gray-600">{report.createdBy.name || 'System'}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`badge ${
                    report.status === 'COMPLETED' ? 'badge-success' :
                    report.status === 'PENDING' ? 'badge-warning' :
                    report.status === 'DRAFT' ? 'badge-secondary' :
                    'badge-default'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportDetails;
