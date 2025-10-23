/**
 * IncidentNotes Component
 * 
 * Incident Notes for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentNotesProps {
  className?: string;
}

/**
 * IncidentNotes component - Incident Notes
 */
const IncidentNotes: React.FC<IncidentNotesProps> = ({ className = '' }) => {
  return (
    <div className={`incident-notes ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Notes</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Notes functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentNotes;
