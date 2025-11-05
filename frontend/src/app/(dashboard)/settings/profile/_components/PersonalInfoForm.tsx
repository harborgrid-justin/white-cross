/**
 * @fileoverview Personal information form component
 * @module app/(dashboard)/profile/_components/PersonalInfoForm
 * @category Profile - Components
 */

'use client';

import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';
import { useEditMode } from './hooks/useEditMode';
import { EditButton, FormActions } from './ui';

interface PersonalInfoFormProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  disabled?: boolean;
}

/**
 * Personal information form component
 * Handles editing of first name, last name, title, and department
 *
 * @component
 * @example
 * ```tsx
 * <PersonalInfoForm
 *   profile={userProfile}
 *   onSave={handleSave}
 * />
 * ```
 */
export function PersonalInfoForm({ profile, onSave, disabled = false }: PersonalInfoFormProps) {
  const { isEditing, toggleEditing, cancelEditing } = useEditMode();
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title,
    department: profile.department
  });

  // Reset form data when profile changes or editing is cancelled
  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      department: profile.department
    });
  }, [profile, isEditing]);

  const handleSave = async () => {
    await onSave(formData);
    cancelEditing();
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      department: profile.department
    });
    cancelEditing();
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <EditButton isEditing={isEditing} onClick={toggleEditing} />
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
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing || disabled}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing || disabled}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={!isEditing || disabled}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            id="department"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            disabled={!isEditing || disabled}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isEditing && (
          <FormActions
            onSave={handleSave}
            onCancel={handleCancel}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
