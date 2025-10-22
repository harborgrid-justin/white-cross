/**
 * MedicationDetails Component
 * Purpose: Detailed view of a medication
 * Features: Full details, history, interactions, side effects
 */

import React from 'react';

interface MedicationDetailsProps {
  medication?: any;
}

export const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  medication
}) => {
  return (
    <div className="medication-details">
      <h2>Medication Details</h2>
      {medication ? (
        <>
          <p>Name: {medication.name}</p>
          <p>Dosage: {medication.dosage}</p>
          <p>Route: {medication.route}</p>
          {/* Add more details here */}
        </>
      ) : (
        <p>No medication selected.</p>
      )}
    </div>
  );
};

export default MedicationDetails;
