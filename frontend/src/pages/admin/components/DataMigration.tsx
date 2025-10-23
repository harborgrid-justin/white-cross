/**
 * DataMigration Component
 * 
 * Data Migration for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DataMigrationProps {
  className?: string;
}

/**
 * DataMigration component - Data Migration
 */
const DataMigration: React.FC<DataMigrationProps> = ({ className = '' }) => {
  return (
    <div className={`data-migration ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Migration</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Data Migration functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DataMigration;
