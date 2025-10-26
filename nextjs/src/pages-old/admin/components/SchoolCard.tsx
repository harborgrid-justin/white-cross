/**
 * SchoolCard Component
 * 
 * School Card for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolCardProps {
  className?: string;
}

/**
 * SchoolCard component - School Card
 */
const SchoolCard: React.FC<SchoolCardProps> = ({ className = '' }) => {
  return (
    <div className={`school-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>School Card functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;
