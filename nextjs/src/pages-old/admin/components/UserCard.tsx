/**
 * UserCard Component
 * 
 * User Card for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UserCardProps {
  className?: string;
}

/**
 * UserCard component - User Card
 */
const UserCard: React.FC<UserCardProps> = ({ className = '' }) => {
  return (
    <div className={`user-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>User Card functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
