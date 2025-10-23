/**
 * EmailCard Component
 * 
 * Email Card for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmailCardProps {
  className?: string;
}

/**
 * EmailCard component - Email Card
 */
const EmailCard: React.FC<EmailCardProps> = ({ className = '' }) => {
  return (
    <div className={`email-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Email Card functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmailCard;
