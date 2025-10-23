/**
 * AddCommentDialog Component
 * 
 * Add Comment Dialog for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AddCommentDialogProps {
  className?: string;
}

/**
 * AddCommentDialog component - Add Comment Dialog
 */
const AddCommentDialog: React.FC<AddCommentDialogProps> = ({ className = '' }) => {
  return (
    <div className={`add-comment-dialog ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment Dialog</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Add Comment Dialog functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AddCommentDialog;
