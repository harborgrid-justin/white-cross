/**
 * WebhookForm Component
 * 
 * Webhook Form for integration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface WebhookFormProps {
  className?: string;
}

/**
 * WebhookForm component - Webhook Form
 */
const WebhookForm: React.FC<WebhookFormProps> = ({ className = '' }) => {
  return (
    <div className={`webhook-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Webhook Form functionality</p>
          <p className="text-sm mt-2">Connected to integration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default WebhookForm;
