/**
 * PolicyList Component
 * 
 * Policy List for compliance module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PolicyListProps {
  className?: string;
}

/**
 * PolicyList component - Policy List
 */
const PolicyList: React.FC<PolicyListProps> = ({ className = '' }) => {
  return (
    <div className={`policy-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Policy List functionality</p>
          <p className="text-sm mt-2">Connected to compliance Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyList;
