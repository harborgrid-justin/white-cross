/**
 * MedicationScheduleForm Component
 * Purpose: Configure administration schedule
 * Features: Times, frequency, duration, special instructions
 */

import React, { useState } from 'react';

interface MedicationScheduleFormProps {
  schedule?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const MedicationScheduleForm: React.FC<MedicationScheduleFormProps> = ({
  schedule,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    times: schedule?.times || [],
    frequency: schedule?.frequency || '',
    duration: schedule?.duration || '',
    specialInstructions: schedule?.specialInstructions || '',
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
    <div className="medication-schedule-form">
      <h2>Configure Medication Schedule</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="times">Times</label>
          <input
            id="times"
            type="text"
            value={formData.times}
            onChange={(e) => handleChange('times', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
          >
            <option value="">Select Frequency</option>
            <option value="ONCE_DAILY">Once Daily</option>
            <option value="TWICE_DAILY">Twice Daily</option>
            <option value="THREE_TIMES_DAILY">Three Times Daily</option>
            <option value="AS_NEEDED">As Needed</option>
          </select>
        </div>

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
          <label htmlFor="specialInstructions">Special Instructions</label>
          <textarea
            id="specialInstructions"
            value={formData.specialInstructions}
            onChange={(e) => handleChange('specialInstructions', e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Schedule
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationScheduleForm;
