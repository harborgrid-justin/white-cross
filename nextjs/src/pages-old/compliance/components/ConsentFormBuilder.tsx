/**
 * ConsentFormBuilder Component
 * Build and configure consent forms
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { createConsentForm, selectLoading } from '../store';

const ConsentFormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const loading = useAppSelector(state => selectLoading(state).operations);

  const [formData, setFormData] = useState({
    formName: '',
    formType: 'GENERAL',
    description: '',
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createConsentForm(formData)).unwrap();
      navigate('/compliance/consent/forms');
    } catch (error) {
      console.error('Error saving consent form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Consent Form' : 'Create Consent Form'}
        </h1>
        <button onClick={() => navigate('/compliance/consent/forms')} className="btn btn-ghost">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="label required">Form Name</label>
          <input
            type="text"
            value={formData.formName}
            onChange={(e) => setFormData({ ...formData, formName: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Form Type</label>
          <select
            value={formData.formType}
            onChange={(e) => setFormData({ ...formData, formType: e.target.value })}
            className="input"
          >
            <option value="GENERAL">General Consent</option>
            <option value="MEDICAL">Medical Consent</option>
            <option value="PHOTO">Photo Release</option>
            <option value="TRIP">Field Trip</option>
          </select>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="input"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <button type="button" onClick={() => navigate('/compliance/consent/forms')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : id ? 'Update Form' : 'Create Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsentFormBuilder;
