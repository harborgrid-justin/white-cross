/**
 * @fileoverview Personal Information Component - Editable personal details section
 * @module app/(dashboard)/profile/_components/PersonalInformation
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { User, Edit3, X, Save } from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  employeeId: string;
  hireDate: string;
}

interface PersonalInformationProps {
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (info: Partial<PersonalInfo>) => Promise<void>;
  isUpdating?: boolean;
}

export function PersonalInformation({
  personalInfo,
  onUpdatePersonalInfo,
  isUpdating = false
}: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...personalInfo });
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when props change
  const resetFormData = () => {
    setFormData({ ...personalInfo });
    setHasChanges(false);
  };

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Only send changed fields
      const changes: Partial<PersonalInfo> = {};
      Object.keys(formData).forEach(key => {
        const fieldKey = key as keyof PersonalInfo;
        if (formData[fieldKey] !== personalInfo[fieldKey]) {
          changes[fieldKey] = formData[fieldKey];
        }
      });

      if (Object.keys(changes).length > 0) {
        await onUpdatePersonalInfo(changes);
      }
      
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update personal information:', error);
      // Error handling is managed by parent component
    }
  };

  const handleCancel = () => {
    resetFormData();
    setIsEditing(false);
  };

  const handleEdit = () => {
    resetFormData();
    setIsEditing(true);
  };

  // Validation - check if required fields are filled
  const isFormValid = formData.firstName.trim() !== '' && 
                      formData.lastName.trim() !== '' && 
                      formData.title.trim() !== '';

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <button 
          onClick={isEditing ? handleCancel : handleEdit}
          disabled={isUpdating}
          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
          title={isEditing ? "Cancel editing" : "Edit personal information"}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* First Name and Last Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="personal-firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="personal-firstName"
              type="text"
              value={isEditing ? formData.firstName : personalInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <label htmlFor="personal-lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="personal-lastName"
              type="text"
              value={isEditing ? formData.lastName : personalInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
        
        {/* Job Title */}
        <div>
          <label htmlFor="personal-title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-title"
            type="text"
            value={isEditing ? formData.title : personalInfo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter job title"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="personal-department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            id="personal-department"
            type="text"
            value={isEditing ? formData.department : personalInfo.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter department"
          />
        </div>

        {/* Employee ID - Read only */}
        <div>
          <label htmlFor="personal-employeeId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            id="personal-employeeId"
            type="text"
            value={personalInfo.employeeId}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
            aria-label="Employee ID (read-only)"
          />
          <p className="text-xs text-gray-500 mt-1">Employee ID cannot be changed</p>
        </div>

        {/* Hire Date - Read only */}
        <div>
          <label htmlFor="personal-hireDate" className="block text-sm font-medium text-gray-700 mb-1">
            Hire Date
          </label>
          <input
            id="personal-hireDate"
            type="text"
            value={new Date(personalInfo.hireDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
            aria-label="Hire date (read-only)"
          />
          <p className="text-xs text-gray-500 mt-1">Hire date is set by HR</p>
        </div>

        {/* Save/Cancel Actions */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSave}
              disabled={!hasChanges || !isFormValid || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {isEditing && !isFormValid && (
          <div className="text-sm text-red-600">
            * Required fields must be filled out
          </div>
        )}
      </div>
    </div>
  );
}
