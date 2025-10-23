/**
 * UserProfile Component
 * 
 * User Profile for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UserProfileProps {
  className?: string;
}

/**
 * UserProfile component - User Profile
 */
const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  return (
    <div className={`user-profile ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
        <div className="text-center text-gray-500 py-8">
          <p>User Profile functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
