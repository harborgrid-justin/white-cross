/**
 * AllergyForm Component
 * 
 * Allergy Form for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AllergyFormProps {
  className?: string;
}

/**
 * AllergyForm component - Allergy Form
 */
const AllergyForm: React.FC<AllergyFormProps> = ({ className = '' }) => {
  return (
    <div className={`allergy-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergy Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Allergy Form functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AllergyForm;
