/**
 * @fileoverview Personal Information Component - Editable personal details section
 * @module app/(dashboard)/profile/_components/ProfileContent/PersonalInformation
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { User, Edit3, Save, X } from 'lucide-react';

interface PersonalInformationProps {
  profile: {
    firstName: string;
    lastName: string;
    title: string;
    department: string;
  };
  onSave?: (data: { firstName: string; lastName: string; title: string; department: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function PersonalInformation({ profile, onSave, isSubmitting = false }: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title,
    department: profile.department,
  });

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(formData);
        setIsEditing(false);
      } catch (error) {
        // Error handling is done in parent component
        console.error('Failed to save personal information:', error);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      department: profile.department,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-700"
          disabled={isSubmitting}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={isEditing ? formData.firstName : profile.firstName}
              onChange={(e) => isEditing && setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={isEditing ? formData.lastName : profile.lastName}
              onChange={(e) => isEditing && setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            value={isEditing ? formData.title : profile.title}
            onChange={(e) => isEditing && setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            id="department"
            type="text"
            value={isEditing ? formData.department : profile.department}
            onChange={(e) => isEditing && setFormData(prev => ({ ...prev, department: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
