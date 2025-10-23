/**
 * SMSTemplates Component
 * 
 * S M S Templates for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SMSTemplatesProps {
  className?: string;
}

/**
 * SMSTemplates component - S M S Templates
 */
const SMSTemplates: React.FC<SMSTemplatesProps> = ({ className = '' }) => {
  return (
    <div className={`s-m-s-templates ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">S M S Templates</h3>
        <div className="text-center text-gray-500 py-8">
          <p>S M S Templates functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SMSTemplates;
