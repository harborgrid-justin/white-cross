/**
 * SubscriptionCard Component
 * 
 * Subscription Card for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SubscriptionCardProps {
  className?: string;
}

/**
 * SubscriptionCard component - Subscription Card
 */
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ className = '' }) => {
  return (
    <div className={`subscription-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Subscription Card functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
