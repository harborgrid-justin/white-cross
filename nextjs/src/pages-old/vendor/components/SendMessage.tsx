/**
 * SendMessage Component
 * 
 * Send Message for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SendMessageProps {
  className?: string;
}

/**
 * SendMessage component - Send Message
 */
const SendMessage: React.FC<SendMessageProps> = ({ className = '' }) => {
  return (
    <div className={`send-message ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Send Message functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
