/**
 * QuickMedicationForm Component
 * Purpose: Simplified quick entry form
 * Features: Essential fields, common medications, fast entry
 */

import React, { useState } from 'react';

interface QuickMedicationFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const QuickMedicationForm: React.FC<QuickMedicationFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    studentId: '',
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
    <div className="quick-medication-form">
      <h2>Quick Add Medication</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Medication Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
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

        <div className="form-group">
          <label htmlFor="studentId">Student ID *</label>
          <input
            id="studentId"
            type="text"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Medication
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickMedicationForm;
