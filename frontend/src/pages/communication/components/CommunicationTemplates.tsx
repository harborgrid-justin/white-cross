/**
 * CommunicationTemplates Component
 * 
 * Communication Templates for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CommunicationTemplatesProps {
  className?: string;
}

/**
 * CommunicationTemplates component - Communication Templates
 */
const CommunicationTemplates: React.FC<CommunicationTemplatesProps> = ({ className = '' }) => {
  return (
    <div className={`communication-templates ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Templates</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Communication Templates functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTemplates;
