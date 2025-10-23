/**
 * IncidentReportForm Component
 * 
 * Incident Report Form for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentReportFormProps {
  className?: string;
}

/**
 * IncidentReportForm component - Incident Report Form
 */
const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ className = '' }) => {
  return (
    <div className={`incident-report-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Report Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Report Form functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportForm;
