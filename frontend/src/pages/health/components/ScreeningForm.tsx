/**
 * ScreeningForm Component
 * 
 * Screening Form for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ScreeningFormProps {
  className?: string;
}

/**
 * ScreeningForm component - Screening Form
 */
const ScreeningForm: React.FC<ScreeningFormProps> = ({ className = '' }) => {
  return (
    <div className={`screening-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Screening Form functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ScreeningForm;
