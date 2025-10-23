/**
 * WebhookCard Component
 * 
 * Webhook Card for integration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface WebhookCardProps {
  className?: string;
}

/**
 * WebhookCard component - Webhook Card
 */
const WebhookCard: React.FC<WebhookCardProps> = ({ className = '' }) => {
  return (
    <div className={`webhook-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Webhook Card functionality</p>
          <p className="text-sm mt-2">Connected to integration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default WebhookCard;
