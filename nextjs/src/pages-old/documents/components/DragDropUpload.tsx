/**
 * DragDropUpload Component
 * 
 * Drag Drop Upload for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DragDropUploadProps {
  className?: string;
}

/**
 * DragDropUpload component - Drag Drop Upload
 */
const DragDropUpload: React.FC<DragDropUploadProps> = ({ className = '' }) => {
  return (
    <div className={`drag-drop-upload ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drag Drop Upload</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Drag Drop Upload functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DragDropUpload;
