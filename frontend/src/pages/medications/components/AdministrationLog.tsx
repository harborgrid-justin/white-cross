/**
 * AdministrationLog Component
 * Purpose: Log of administered medications
 * Features: Time, dose, administrator, student signature
 */

import React from 'react';

interface AdministrationLogProps {
  medicationId?: string;
}

const AdministrationLog: React.FC<AdministrationLogProps> = ({ medicationId }) => {
  return (
    <div className="administration-log">
      <h2>Administration Log</h2>
      {medicationId ? (
        <p>Displaying administration log for medication ID: {medicationId}</p>
      ) : (
        <p>Displaying global administration log.</p>
      )}
    </div>
  );
};

export default AdministrationLog;
