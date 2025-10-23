/**
 * DataSources Component
 * 
 * Data Sources for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DataSourcesProps {
  className?: string;
}

/**
 * DataSources component - Data Sources
 */
const DataSources: React.FC<DataSourcesProps> = ({ className = '' }) => {
  return (
    <div className={`data-sources ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Data Sources functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
