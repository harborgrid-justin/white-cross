/**
 * HearingScreening Component
 * 
 * Hearing Screening for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HearingScreeningProps {
  className?: string;
}

/**
 * HearingScreening component - Hearing Screening
 */
const HearingScreening: React.FC<HearingScreeningProps> = ({ className = '' }) => {
  return (
    <div className={`hearing-screening ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hearing Screening</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Hearing Screening functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HearingScreening;
