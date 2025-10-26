/**
 * HearingHistory Component
 * 
 * Hearing History for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HearingHistoryProps {
  className?: string;
}

/**
 * HearingHistory component - Hearing History
 */
const HearingHistory: React.FC<HearingHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`hearing-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hearing History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Hearing History functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HearingHistory;
