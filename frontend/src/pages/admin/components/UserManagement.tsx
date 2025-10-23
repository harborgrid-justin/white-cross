/**
 * UserManagement Component
 * 
 * User Management for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UserManagementProps {
  className?: string;
}

/**
 * UserManagement component - User Management
 */
const UserManagement: React.FC<UserManagementProps> = ({ className = '' }) => {
  return (
    <div className={`user-management ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
        <div className="text-center text-gray-500 py-8">
          <p>User Management functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
