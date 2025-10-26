/**
 * DocumentsDashboard Component
 * 
 * Documents Dashboard for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentsDashboardProps {
  className?: string;
}

/**
 * DocumentsDashboard component - Documents Dashboard
 */
const DocumentsDashboard: React.FC<DocumentsDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`documents-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Documents Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsDashboard;
