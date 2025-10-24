/**
 * IntegrationForm Component
 * Form for creating and editing integrations
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { createIntegration, updateIntegration, selectLoading } from '../store';

const IntegrationForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { integrationId } = useParams<{ integrationId: string }>();
  const loading = useAppSelector(state => selectLoading(state).currentIntegration);

  const [formData, setFormData] = useState({
    name: '',
    type: 'SIS',
    description: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (integrationId) {
        await dispatch(updateIntegration({ id: integrationId, data: formData })).unwrap();
      } else {
        await dispatch(createIntegration(formData)).unwrap();
      }
      navigate('/integration/list');
    } catch (error) {
      console.error('Error saving integration:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {integrationId ? 'Edit Integration' : 'Create Integration'}
        </h1>
        <button onClick={() => navigate('/integration/list')} className="btn btn-ghost">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="label required">Integration Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label required">Integration Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input"
          >
            <option value="SIS">Student Information System</option>
            <option value="EHR">Electronic Health Records</option>
            <option value="LMS">Learning Management System</option>
            <option value="HR">Human Resources</option>
            <option value="FINANCE">Finance</option>
            <option value="HEALTH">Health System</option>
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
          <button type="button" onClick={() => navigate('/integration/list')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : integrationId ? 'Update Integration' : 'Create Integration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IntegrationForm;
