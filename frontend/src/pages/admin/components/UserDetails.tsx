/**
 * UserDetails Component
 * 
 * User Details for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UserDetailsProps {
  className?: string;
}

/**
 * UserDetails component - User Details
 */
const UserDetails: React.FC<UserDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`user-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>User Details functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
