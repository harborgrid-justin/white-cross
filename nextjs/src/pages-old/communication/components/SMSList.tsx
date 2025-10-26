/**
 * SMSList Component
 * 
 * S M S List for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SMSListProps {
  className?: string;
}

/**
 * SMSList component - S M S List
 */
const SMSList: React.FC<SMSListProps> = ({ className = '' }) => {
  return (
    <div className={`s-m-s-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">S M S List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>S M S List functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SMSList;
