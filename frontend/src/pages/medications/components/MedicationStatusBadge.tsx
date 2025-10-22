/**
 * MedicationStatusBadge Component
 * Purpose: Status indicator badge
 * Features: Color-coded status, active/inactive/discontinued
 */

import React from 'react';

interface MedicationStatusBadgeProps {
  status?: string;
}

const MedicationStatusBadge: React.FC<MedicationStatusBadgeProps> = ({ status = 'ACTIVE' }) => {
  return (
    <div className={`medication-status-badge status-${status.toLowerCase()}`}>
      {status}
    </div>
  );
};

export default MedicationStatusBadge;
