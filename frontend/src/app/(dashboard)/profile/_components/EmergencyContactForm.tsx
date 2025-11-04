/**
 * @fileoverview Emergency contact form component
 * @module app/(dashboard)/profile/_components/EmergencyContactForm
 * @category Profile - Components
 */

'use client';

import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';
import { useEditMode } from './hooks/useEditMode';
import { EditButton, FormActions } from './ui';

interface EmergencyContactFormProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  disabled?: boolean;
}

/**
 * Emergency contact form component
 * Handles editing of emergency contact information
 *
 * @component
 * @example
 * ```tsx
 * <EmergencyContactForm
 *   profile={userProfile}
 *   onSave={handleSave}
 * />
 * ```
 */
export function EmergencyContactForm({ profile, onSave, disabled = false }: EmergencyContactFormProps) {
  const { isEditing, toggleEditing, cancelEditing } = useEditMode();
  const [formData, setFormData] = useState({
    emergencyContact: {
      name: profile.emergencyContact.name,
      relationship: profile.emergencyContact.relationship,
      phone: profile.emergencyContact.phone
    }
  });

  // Reset form data when profile changes or editing is cancelled
  useEffect(() => {
    setFormData({
      emergencyContact: {
        name: profile.emergencyContact.name,
        relationship: profile.emergencyContact.relationship,
        phone: profile.emergencyContact.phone
      }
    });
  }, [profile, isEditing]);

  const handleSave = async () => {
    await onSave(formData);
    cancelEditing();
  };

  const handleCancel = () => {
    setFormData({
      emergencyContact: {
        name: profile.emergencyContact.name,
        relationship: profile.emergencyContact.relationship,
        phone: profile.emergencyContact.phone
      }
    });
    cancelEditing();
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Emergency Contact</h2>
        </div>
        <EditButton isEditing={isEditing} onClick={toggleEditing} />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            id="emergencyName"
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, name: e.target.value }
            }))}
            disabled={!isEditing || disabled}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship
          </label>
          <input
            id="emergencyRelationship"
            type="text"
            value={formData.emergencyContact.relationship}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
            }))}
            disabled={!isEditing || disabled}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="emergencyPhone"
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
            }))}
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
