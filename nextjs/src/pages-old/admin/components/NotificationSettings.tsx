/**
 * NotificationSettings Component
 * 
 * Notification Settings for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface NotificationSettingsProps {
  className?: string;
}

/**
 * NotificationSettings component - Notification Settings
 */
const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  return (
    <div className={`notification-settings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Notification Settings functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
