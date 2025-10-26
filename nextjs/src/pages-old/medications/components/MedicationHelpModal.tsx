/**
 * MedicationHelpModal Component
 * Purpose: Help and documentation modal
 * Features: Contextual help, drug references, procedures
 */

import React from 'react';

interface MedicationHelpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MedicationHelpModal: React.FC<MedicationHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="medication-help-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h2>Medication Help & Documentation</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="modal-body">
          <h3>Quick Help</h3>
          <p>Find help and documentation for medication management.</p>
          <ul>
            <li>How to add a medication</li>
            <li>How to administer medications</li>
            <li>Understanding drug interactions</li>
            <li>Medication administration records (MAR)</li>
          </ul>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MedicationHelpModal;
