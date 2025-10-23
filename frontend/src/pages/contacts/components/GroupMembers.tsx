/**
 * GroupMembers Component
 * 
 * Group Members for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface GroupMembersProps {
  className?: string;
}

/**
 * GroupMembers component - Group Members
 */
const GroupMembers: React.FC<GroupMembersProps> = ({ className = '' }) => {
  return (
    <div className={`group-members ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Group Members functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;
