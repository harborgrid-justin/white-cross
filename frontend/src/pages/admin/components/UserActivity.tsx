/**
 * UserActivity Component
 * 
 * User Activity for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UserActivityProps {
  className?: string;
}

/**
 * UserActivity component - User Activity
 */
const UserActivity: React.FC<UserActivityProps> = ({ className = '' }) => {
  return (
    <div className={`user-activity ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
        <div className="text-center text-gray-500 py-8">
          <p>User Activity functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UserActivity;
