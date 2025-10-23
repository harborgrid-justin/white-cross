/**
 * QuickIncidentForm Component
 * 
 * Quick Incident Form for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface QuickIncidentFormProps {
  className?: string;
}

/**
 * QuickIncidentForm component - Quick Incident Form
 */
const QuickIncidentForm: React.FC<QuickIncidentFormProps> = ({ className = '' }) => {
  return (
    <div className={`quick-incident-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Incident Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Quick Incident Form functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default QuickIncidentForm;
