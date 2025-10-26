/**
 * CertificationList Component
 * 
 * Certification List for compliance module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CertificationListProps {
  className?: string;
}

/**
 * CertificationList component - Certification List
 */
const CertificationList: React.FC<CertificationListProps> = ({ className = '' }) => {
  return (
    <div className={`certification-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Certification List functionality</p>
          <p className="text-sm mt-2">Connected to compliance Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CertificationList;
