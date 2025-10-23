/**
 * NotificationList Component
 * 
 * Notification List for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface NotificationListProps {
  className?: string;
}

/**
 * NotificationList component - Notification List
 */
const NotificationList: React.FC<NotificationListProps> = ({ className = '' }) => {
  return (
    <div className={`notification-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Notification List functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
