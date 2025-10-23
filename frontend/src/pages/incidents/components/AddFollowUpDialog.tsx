/**
 * AddFollowUpDialog Component
 * 
 * Add Follow Up Dialog for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AddFollowUpDialogProps {
  className?: string;
}

/**
 * AddFollowUpDialog component - Add Follow Up Dialog
 */
const AddFollowUpDialog: React.FC<AddFollowUpDialogProps> = ({ className = '' }) => {
  return (
    <div className={`add-follow-up-dialog ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Follow Up Dialog</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Add Follow Up Dialog functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AddFollowUpDialog;
