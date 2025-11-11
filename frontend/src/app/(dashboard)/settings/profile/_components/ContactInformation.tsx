/**
 * @fileoverview Contact Information Component - User contact details management
 * @module app/(dashboard)/profile/_components/ContactInformation
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Edit3, X, Save } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ContactInformationProps {
  email: string;
  phone: string;
  address: Address;
  onUpdateContact: (contactData: {
    email: string;
    phone: string;
    address: Address;
  }) => Promise<void>;
  isUpdating?: boolean;
}

export function ContactInformation({
  email,
  phone,
  address,
  onUpdateContact,
  isUpdating = false
}: ContactInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email,
    phone,
    address: { ...address }
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when props change
  const resetFormData = () => {
    setFormData({
      email,
      phone,
      address: { ...address }
    });
    setHasChanges(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1] as keyof Address;
        updated.address = { ...prev.address, [addressField]: value };
      } else if (field === 'email') {
        updated.email = value;
      } else if (field === 'phone') {
        updated.phone = value;
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onUpdateContact(formData);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update contact information:', error);
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

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </div>
        <button 
          onClick={isEditing ? handleCancel : handleEdit}
          disabled={isUpdating}
          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
          title={isEditing ? "Cancel editing" : "Edit contact information"}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Email Address */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              id="contact-email"
              type="email"
              value={isEditing ? formData.email : email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <input
              id="contact-phone"
              type="tel"
              value={isEditing ? formData.phone : phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="space-y-2">
            {/* Street Address */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <input
                id="contact-street"
                type="text"
                value={isEditing ? formData.address.street : address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="Street Address"
                disabled={!isEditing}
                className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid gap-2 sm:grid-cols-3 pl-6">
              <input
                id="contact-city"
                type="text"
                value={isEditing ? formData.address.city : address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="City"
                disabled={!isEditing}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                id="contact-state"
                type="text"
                value={isEditing ? formData.address.state : address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                placeholder="State"
                disabled={!isEditing}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                id="contact-zip"
                type="text"
                value={isEditing ? formData.address.zipCode : address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                placeholder="ZIP Code"
                disabled={!isEditing}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save/Cancel Actions */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
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
      </div>
    </div>
  );
}
