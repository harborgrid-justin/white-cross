/**
 * AllergyList Component
 * 
 * Allergy List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AllergyListProps {
  className?: string;
}

/**
 * AllergyList component - Allergy List
 */
const AllergyList: React.FC<AllergyListProps> = ({ className = '' }) => {
  return (
    <div className={`allergy-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergy List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Allergy List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AllergyList;
