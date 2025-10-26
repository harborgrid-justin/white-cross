/**
 * WF-AC-COMP-010 | IpRestrictionForm.tsx - IP Restriction Form
 * Purpose: Form for adding IP restrictions
 * Dependencies: react, redux, lucide-react
 * Exports: IpRestrictionForm component
 * Last Updated: 2025-10-24
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/shared/store-hooks-index';
import { addIpRestriction } from '../store';
import { Shield, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const IpRestrictionForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    ipAddress: '',
    type: 'WHITELIST',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(addIpRestriction(formData)).unwrap();
      toast.success('IP restriction added successfully');
      navigate('/access-control/ip-restrictions');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add restriction');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add IP Restriction</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IP Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g., 192.168.1.1 or 192.168.1.0/24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="WHITELIST">Whitelist (Allow)</option>
              <option value="BLACKLIST">Blacklist (Block)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/access-control/ip-restrictions')}
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
              <span>Add Restriction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IpRestrictionForm;
