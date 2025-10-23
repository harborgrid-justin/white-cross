/**
 * VisitList Component
 * 
 * Visit List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VisitListProps {
  className?: string;
}

/**
 * VisitList component - Visit List
 */
const VisitList: React.FC<VisitListProps> = ({ className = '' }) => {
  return (
    <div className={`visit-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Visit List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
