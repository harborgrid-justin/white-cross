/**
 * WF-COM-021 | ReportGeneratorModal Component
 * Purpose: Modal for generating compliance reports
 * Dependencies: Redux store
 * Features: Report generation wizard
 */

import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { generateComplianceReport, selectLoading } from '../store';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => selectLoading(state).operations);

  const [reportType, setReportType] = useState('HIPAA');
  const [period, setPeriod] = useState('MONTHLY');

  const handleGenerate = async () => {
    try {
      await dispatch(generateComplianceReport({ reportType, period })).unwrap();
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Generate Compliance Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="label">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              <option value="HIPAA">HIPAA Compliance</option>
              <option value="FERPA">FERPA Compliance</option>
              <option value="AUDIT">Audit Report</option>
              <option value="SECURITY">Security Assessment</option>
            </select>
          </div>

          <div>
            <label className="label">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;
