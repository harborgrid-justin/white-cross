/**
 * @fileoverview Emergency Contact Component - Emergency contact information management
 * @module app/(dashboard)/profile/_components/EmergencyContact
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { AlertTriangle, Edit3, X, Save } from 'lucide-react';

interface EmergencyContactData {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactProps {
  emergencyContact: EmergencyContactData;
  onUpdateEmergencyContact: (contactData: EmergencyContactData) => Promise<void>;
  isUpdating?: boolean;
}

export function EmergencyContact({
  emergencyContact,
  onUpdateEmergencyContact,
  isUpdating = false
}: EmergencyContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmergencyContactData>({ ...emergencyContact });
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when props change
  const resetFormData = () => {
    setFormData({ ...emergencyContact });
    setHasChanges(false);
  };

  const handleInputChange = (field: keyof EmergencyContactData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onUpdateEmergencyContact(formData);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
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

  // Validation
  const isFormValid = formData.name.trim() !== '' && 
                     formData.relationship.trim() !== '' && 
                     formData.phone.trim() !== '';

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Emergency Contact</h2>
        </div>
        <button 
          onClick={isEditing ? handleCancel : handleEdit}
          disabled={isUpdating}
          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
          title={isEditing ? "Cancel editing" : "Edit emergency contact"}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Contact Name */}
        <div>
          <label htmlFor="emergency-name" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            id="emergency-name"
            type="text"
            value={isEditing ? formData.name : emergencyContact.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter contact name"
            required
          />
        </div>

        {/* Relationship */}
        <div>
          <label htmlFor="emergency-relationship" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <select
              id="emergency-relationship"
              value={formData.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Partner">Partner</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              type="text"
              value={emergencyContact.relationship}
              disabled
              aria-label="Emergency contact relationship"
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
            />
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="emergency-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="emergency-phone"
            type="tel"
            value={isEditing ? formData.phone : emergencyContact.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium mb-1">
                Important Information
              </p>
              <p className="text-sm text-amber-700">
                This person will be contacted in case of emergency. Please ensure all information is current and accurate.
              </p>
            </div>
          </div>
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
            * All fields are required
          </div>
        )}
      </div>
    </div>
  );
}
