/**
 * EmailTemplates Component
 * 
 * Email Templates for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmailTemplatesProps {
  className?: string;
}

/**
 * EmailTemplates component - Email Templates
 */
const EmailTemplates: React.FC<EmailTemplatesProps> = ({ className = '' }) => {
  return (
    <div className={`email-templates ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Email Templates functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;
