/**
 * GroupList Component
 * 
 * Group List for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface GroupListProps {
  className?: string;
}

/**
 * GroupList component - Group List
 */
const GroupList: React.FC<GroupListProps> = ({ className = '' }) => {
  return (
    <div className={`group-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Group List functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default GroupList;
