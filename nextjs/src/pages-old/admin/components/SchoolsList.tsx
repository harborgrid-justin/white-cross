/**
 * SchoolsList Component
 * 
 * Schools List for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolsListProps {
  className?: string;
}

/**
 * SchoolsList component - Schools List
 */
const SchoolsList: React.FC<SchoolsListProps> = ({ className = '' }) => {
  return (
    <div className={`schools-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schools List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Schools List functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolsList;
