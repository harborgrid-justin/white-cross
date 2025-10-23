/**
 * TemplateCard Component
 * 
 * Template Card for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface TemplateCardProps {
  className?: string;
}

/**
 * TemplateCard component - Template Card
 */
const TemplateCard: React.FC<TemplateCardProps> = ({ className = '' }) => {
  return (
    <div className={`template-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Template Card functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
