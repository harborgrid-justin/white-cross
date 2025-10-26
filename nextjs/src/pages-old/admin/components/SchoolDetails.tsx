/**
 * SchoolDetails Component
 * 
 * School Details for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolDetailsProps {
  className?: string;
}

/**
 * SchoolDetails component - School Details
 */
const SchoolDetails: React.FC<SchoolDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`school-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>School Details functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;
