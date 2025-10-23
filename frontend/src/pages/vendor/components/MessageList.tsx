/**
 * MessageList Component
 * 
 * Message List for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MessageListProps {
  className?: string;
}

/**
 * MessageList component - Message List
 */
const MessageList: React.FC<MessageListProps> = ({ className = '' }) => {
  return (
    <div className={`message-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Message List functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
