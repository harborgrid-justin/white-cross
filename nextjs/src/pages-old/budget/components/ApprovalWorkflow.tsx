/**
 * ApprovalWorkflow Component
 * 
 * Approval process management for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface ApprovalWorkflowProps {
  className?: string;
}

/**
 * ApprovalWorkflow component - Approval process management
 */
const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`approval-workflow ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval process management</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Approval process management functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
