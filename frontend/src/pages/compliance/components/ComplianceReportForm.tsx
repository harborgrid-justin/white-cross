/**
 * WF-COM-019 | ComplianceReportForm Component
 * Purpose: Form for creating and editing compliance reports
 * Dependencies: Redux store, form validation
 * Features: Multi-step form, validation, draft saving
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  createComplianceReport,
  updateComplianceReport,
  fetchComplianceReport,
  selectSelectedReport,
  selectLoading
} from '../store';

interface ReportFormData {
  reportName: string;
  reportType: string;
  description: string;
  period: string;
  status: string;
  findings: string;
  recommendations: string;
}

/**
 * ComplianceReportForm - Create/Edit compliance reports
 *
 * @example
 * ```tsx
 * <ComplianceReportForm />
 * ```
 */
const ComplianceReportForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const selectedReport = useAppSelector(selectSelectedReport);
  const loading = useAppSelector(state => selectLoading(state).operations);

  const [formData, setFormData] = useState<ReportFormData>({
    reportName: '',
    reportType: 'HIPAA',
    description: '',
    period: 'MONTHLY',
    status: 'DRAFT',
    findings: '',
    recommendations: ''
  });

  const [errors, setErrors] = useState<Partial<ReportFormData>>({});

  // Load existing report if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchComplianceReport(id));
    }
  }, [id, dispatch]);

  // Populate form with existing report data
  useEffect(() => {
    if (selectedReport && id) {
      setFormData({
        reportName: selectedReport.reportName || '',
        reportType: selectedReport.reportType || 'HIPAA',
        description: selectedReport.description || '',
        period: selectedReport.period || 'MONTHLY',
        status: selectedReport.status || 'DRAFT',
        findings: selectedReport.findings || '',
        recommendations: selectedReport.recommendations || ''
      });
    }
  }, [selectedReport, id]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<ReportFormData> = {};

    if (!formData.reportName.trim()) {
      newErrors.reportName = 'Report name is required';
    }

    if (!formData.reportType) {
      newErrors.reportType = 'Report type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (id) {
        await dispatch(updateComplianceReport({ id, updates: formData })).unwrap();
      } else {
        await dispatch(createComplianceReport(formData)).unwrap();
      }
      navigate('/compliance/reports');
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ReportFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Compliance Report' : 'Create Compliance Report'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Update the compliance report details' : 'Create a new compliance report'}
          </p>
        </div>
        <button
          onClick={() => navigate('/compliance/reports')}
          className="btn btn-ghost"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Name */}
          <div>
            <label htmlFor="reportName" className="label required">
              Report Name
            </label>
            <input
              type="text"
              id="reportName"
              name="reportName"
              value={formData.reportName}
              onChange={handleChange}
              className={`input ${errors.reportName ? 'input-error' : ''}`}
              placeholder="Enter report name"
            />
            {errors.reportName && (
              <p className="text-sm text-red-600 mt-1">{errors.reportName}</p>
            )}
          </div>

          {/* Report Type */}
          <div>
            <label htmlFor="reportType" className="label required">
              Report Type
            </label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className={`input ${errors.reportType ? 'input-error' : ''}`}
            >
              <option value="HIPAA">HIPAA Compliance</option>
              <option value="FERPA">FERPA Compliance</option>
              <option value="AUDIT">Audit Report</option>
              <option value="INCIDENT">Incident Report</option>
              <option value="SECURITY">Security Assessment</option>
            </select>
            {errors.reportType && (
              <p className="text-sm text-red-600 mt-1">{errors.reportType}</p>
            )}
          </div>

          {/* Period */}
          <div>
            <label htmlFor="period" className="label">
              Period
            </label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="input"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUAL">Annual</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending Review</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Provide a detailed description of this compliance report..."
          />
        </div>

        {/* Findings */}
        <div>
          <label htmlFor="findings" className="label">
            Findings
          </label>
          <textarea
            id="findings"
            name="findings"
            value={formData.findings}
            onChange={handleChange}
            rows={6}
            className="input"
            placeholder="Document compliance findings and observations..."
          />
        </div>

        {/* Recommendations */}
        <div>
          <label htmlFor="recommendations" className="label">
            Recommendations
          </label>
          <textarea
            id="recommendations"
            name="recommendations"
            value={formData.recommendations}
            onChange={handleChange}
            rows={6}
            className="input"
            placeholder="Provide recommendations for addressing compliance issues..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/compliance/reports')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : id ? 'Update Report' : 'Create Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplianceReportForm;
