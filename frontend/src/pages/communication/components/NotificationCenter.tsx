/**
 * NotificationCenter Component
 * 
 * Notification Center for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface NotificationCenterProps {
  className?: string;
}

/**
 * NotificationCenter component - Notification Center
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  return (
    <div className={`notification-center ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Center</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Notification Center functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
