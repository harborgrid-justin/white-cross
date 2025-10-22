/**
 * PrescriptionForm Component
 * Purpose: Create/edit prescription
 * Features: Medication, dosage, duration, refills, prescriber
 */

import React, { useState } from 'react';

interface PrescriptionFormProps {
  prescription?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    medication: prescription?.medication || '',
    dosage: prescription?.dosage || '',
    duration: prescription?.duration || '',
    refills: prescription?.refills || '',
    prescriber: prescription?.prescriber || '',
    startDate: prescription?.startDate || '',
    endDate: prescription?.endDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="prescription-form">
      <h2>{prescription ? 'Edit Prescription' : 'Add New Prescription'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="medication">Medication *</label>
            <input
              id="medication"
              type="text"
              value={formData.medication}
              onChange={(e) => handleChange('medication', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dosage">Dosage *</label>
            <input
              id="dosage"
              type="text"
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
            />
          </div>
          
           <div className="form-group">
            <label htmlFor="refills">Refills</label>
            <input
              id="refills"
              type="number"
              value={formData.refills}
              onChange={(e) => handleChange('refills', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prescriber">Prescriber</label>
            <input
              id="prescriber"
              type="text"
              value={formData.prescriber}
              onChange={(e) => handleChange('prescriber', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {prescription ? 'Update' : 'Create'} Prescription
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
