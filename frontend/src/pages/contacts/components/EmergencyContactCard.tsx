/**
 * EmergencyContactCard Component
 * 
 * Emergency Contact Card for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmergencyContactCardProps {
  className?: string;
}

/**
 * EmergencyContactCard component - Emergency Contact Card
 */
const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({ className = '' }) => {
  return (
    <div className={`emergency-contact-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Emergency Contact Card functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactCard;
