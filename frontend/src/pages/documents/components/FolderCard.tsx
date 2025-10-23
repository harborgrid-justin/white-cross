/**
 * FolderCard Component
 * 
 * Folder Card for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface FolderCardProps {
  className?: string;
}

/**
 * FolderCard component - Folder Card
 */
const FolderCard: React.FC<FolderCardProps> = ({ className = '' }) => {
  return (
    <div className={`folder-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Folder Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Folder Card functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
