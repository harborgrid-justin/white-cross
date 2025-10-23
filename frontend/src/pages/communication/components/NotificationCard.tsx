/**
 * NotificationCard Component
 * 
 * Notification Card for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface NotificationCardProps {
  className?: string;
}

/**
 * NotificationCard component - Notification Card
 */
const NotificationCard: React.FC<NotificationCardProps> = ({ className = '' }) => {
  return (
    <div className={`notification-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Notification Card functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
