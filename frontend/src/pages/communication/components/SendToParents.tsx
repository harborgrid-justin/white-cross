/**
 * SendToParents Component
 * 
 * Send To Parents for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SendToParentsProps {
  className?: string;
}

/**
 * SendToParents component - Send To Parents
 */
const SendToParents: React.FC<SendToParentsProps> = ({ className = '' }) => {
  return (
    <div className={`send-to-parents ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send To Parents</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Send To Parents functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SendToParents;
