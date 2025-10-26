/**
 * ImageViewer Component
 * 
 * Image Viewer for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ImageViewerProps {
  className?: string;
}

/**
 * ImageViewer component - Image Viewer
 */
const ImageViewer: React.FC<ImageViewerProps> = ({ className = '' }) => {
  return (
    <div className={`image-viewer ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Viewer</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Image Viewer functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
