/**
 * WF-AC-COMP-007 | SecurityIncidentForm.tsx - Security Incident Form
 * Purpose: Form for creating/editing security incidents
 * Dependencies: react, redux, lucide-react
 * Exports: SecurityIncidentForm component
 * Last Updated: 2025-10-24
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { createSecurityIncident, updateSecurityIncident, selectSecurityIncidents } from '../store';
import { AlertTriangle, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityIncidentForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const incidents = useAppSelector(selectSecurityIncidents);

  const isEditMode = Boolean(id);
  const existingIncident = incidents.find(i => i.id === id);

  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    userId: ''
  });

  useEffect(() => {
    if (isEditMode && existingIncident) {
      setFormData({
        type: existingIncident.type || '',
        severity: existingIncident.severity || '',
        title: existingIncident.title || '',
        description: existingIncident.description || '',
        userId: existingIncident.userId || ''
      });
    }
  }, [isEditMode, existingIncident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && id) {
        await dispatch(updateSecurityIncident({ id, updates: formData })).unwrap();
        toast.success('Incident updated successfully');
      } else {
        await dispatch(createSecurityIncident(formData)).unwrap();
        toast.success('Incident reported successfully');
      }
      navigate('/access-control/incidents');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save incident');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Incident' : 'Report Security Incident'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select type...</option>
              <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
              <option value="DATA_BREACH">Data Breach</option>
              <option value="FAILED_LOGIN_ATTEMPTS">Failed Login Attempts</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
              <option value="POLICY_VIOLATION">Policy Violation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select severity...</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief incident summary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Detailed incident description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID (if applicable)
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Related user ID"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/access-control/incidents')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isEditMode ? 'Update' : 'Report'} Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityIncidentForm;
