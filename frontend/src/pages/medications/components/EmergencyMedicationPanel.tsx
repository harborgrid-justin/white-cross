/**
 * EmergencyMedicationPanel Component
 * Purpose: Emergency medication quick access
 * Features: EpiPens, rescue inhalers, emergency protocols
 */

import React from 'react';

const EmergencyMedicationPanel: React.FC = () => {
  return (
    <div className="emergency-medication-panel">
      <div className="emergency-header">
        <h2>🚨 Emergency Medications</h2>
        <p>Quick access to emergency medications and protocols</p>
      </div>
      
      <div className="emergency-medications">
        <div className="emergency-category">
          <h3>EpiPens</h3>
          <p>Students with severe allergies</p>
        </div>
        
        <div className="emergency-category">
          <h3>Rescue Inhalers</h3>
          <p>Students with asthma</p>
        </div>
        
        <div className="emergency-category">
          <h3>Seizure Medications</h3>
          <p>Students with epilepsy</p>
        </div>
        
        <div className="emergency-category">
          <h3>Glucose/Insulin</h3>
          <p>Students with diabetes</p>
        </div>
      </div>
      
      <div className="emergency-protocols">
        <h3>Emergency Protocols</h3>
        <button className="protocol-button">View Anaphylaxis Protocol</button>
        <button className="protocol-button">View Asthma Protocol</button>
        <button className="protocol-button">View Seizure Protocol</button>
        <button className="protocol-button">View Diabetic Emergency Protocol</button>
      </div>
    </div>
  );
};

export default EmergencyMedicationPanel;
