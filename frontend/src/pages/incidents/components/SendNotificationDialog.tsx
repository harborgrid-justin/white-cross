/**
 * SendNotificationDialog Component
 * 
 * Send Notification Dialog for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SendNotificationDialogProps {
  className?: string;
}

/**
 * SendNotificationDialog component - Send Notification Dialog
 */
const SendNotificationDialog: React.FC<SendNotificationDialogProps> = ({ className = '' }) => {
  return (
    <div className={`send-notification-dialog ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Notification Dialog</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Send Notification Dialog functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationDialog;
