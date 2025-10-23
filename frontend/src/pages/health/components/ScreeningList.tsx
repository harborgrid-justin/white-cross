/**
 * ScreeningList Component
 * 
 * Screening List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ScreeningListProps {
  className?: string;
}

/**
 * ScreeningList component - Screening List
 */
const ScreeningList: React.FC<ScreeningListProps> = ({ className = '' }) => {
  return (
    <div className={`screening-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Screening List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ScreeningList;
