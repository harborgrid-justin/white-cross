/**
 * MessageCard Component
 * 
 * Message Card for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MessageCardProps {
  className?: string;
}

/**
 * MessageCard component - Message Card
 */
const MessageCard: React.FC<MessageCardProps> = ({ className = '' }) => {
  return (
    <div className={`message-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Message Card functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
