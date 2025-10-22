/**
 * PrescriptionCard Component
 * Purpose: Individual prescription card
 * Features: Medication, dosage, refills, expiration
 */

import React from 'react';

interface PrescriptionCardProps {
  prescription?: any;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription }) => {
  return (
    <div className="prescription-card">
      <h3>Prescription</h3>
      {prescription ? (
        <>
          <p>Medication: {prescription.medication}</p>
          <p>Dosage: {prescription.dosage}</p>
        </>
      ) : (
        <p>No prescription data provided.</p>
      )}
    </div>
  );
};

export default PrescriptionCard;
