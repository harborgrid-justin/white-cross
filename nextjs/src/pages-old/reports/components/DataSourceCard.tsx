/**
 * DataSourceCard Component
 * 
 * Data Source Card for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DataSourceCardProps {
  className?: string;
}

/**
 * DataSourceCard component - Data Source Card
 */
const DataSourceCard: React.FC<DataSourceCardProps> = ({ className = '' }) => {
  return (
    <div className={`data-source-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Data Source Card functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DataSourceCard;
