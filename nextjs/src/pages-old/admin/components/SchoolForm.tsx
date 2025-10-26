/**
 * SchoolForm Component
 * 
 * School Form for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolFormProps {
  className?: string;
}

/**
 * SchoolForm component - School Form
 */
const SchoolForm: React.FC<SchoolFormProps> = ({ className = '' }) => {
  return (
    <div className={`school-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>School Form functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolForm;
