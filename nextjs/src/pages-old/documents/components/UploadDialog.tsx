/**
 * UploadDialog Component
 * 
 * Upload Dialog for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface UploadDialogProps {
  className?: string;
}

/**
 * UploadDialog component - Upload Dialog
 */
const UploadDialog: React.FC<UploadDialogProps> = ({ className = '' }) => {
  return (
    <div className={`upload-dialog ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Dialog</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Upload Dialog functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default UploadDialog;
