/**
 * CreateOrderWizard Component
 * 
 * Create Order Wizard for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CreateOrderWizardProps {
  className?: string;
}

/**
 * CreateOrderWizard component - Create Order Wizard
 */
const CreateOrderWizard: React.FC<CreateOrderWizardProps> = ({ className = '' }) => {
  return (
    <div className={`create-order-wizard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Order Wizard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Create Order Wizard functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderWizard;
