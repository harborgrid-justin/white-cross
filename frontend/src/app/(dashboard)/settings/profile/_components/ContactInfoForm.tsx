/**
 * @fileoverview Contact information form component
 * @module app/(dashboard)/profile/_components/ContactInfoForm
 * @category Profile - Components
 */

'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';
import { useEditMode } from './hooks/useEditMode';
import { EditButton, FormActions } from './ui';

interface ContactInfoFormProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  disabled?: boolean;
}

/**
 * Contact information form component
 * Handles editing of email, phone, and address
 *
 * @component
 * @example
 * ```tsx
 * <ContactInfoForm
 *   profile={userProfile}
 *   onSave={handleSave}
 * />
 * ```
 */
export function ContactInfoForm({ profile, onSave, disabled = false }: ContactInfoFormProps) {
  const { isEditing, toggleEditing, cancelEditing } = useEditMode();
  const [formData, setFormData] = useState({
    email: profile.email,
    phone: profile.phone,
    address: {
      street: profile.address.street,
      city: profile.address.city,
      state: profile.address.state,
      zipCode: profile.address.zipCode
    }
  });

  // Reset form data when profile changes or editing is cancelled
  useEffect(() => {
    setFormData({
      email: profile.email,
      phone: profile.phone,
      address: {
        street: profile.address.street,
        city: profile.address.city,
        state: profile.address.state,
        zipCode: profile.address.zipCode
      }
    });
  }, [profile, isEditing]);

  const handleSave = async () => {
    await onSave(formData);
    cancelEditing();
  };

  const handleCancel = () => {
    setFormData({
      email: profile.email,
      phone: profile.phone,
      address: {
        street: profile.address.street,
        city: profile.address.city,
        state: profile.address.state,
        zipCode: profile.address.zipCode
      }
    });
    cancelEditing();
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </div>
        <EditButton isEditing={isEditing} onClick={toggleEditing} />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing || disabled}
              className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing || disabled}
              className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                placeholder="Street Address"
                disabled={!isEditing || disabled}
                className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3 pl-6">
              <input
                id="city"
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                placeholder="City"
                disabled={!isEditing || disabled}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                id="state"
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                placeholder="State"
                disabled={!isEditing || disabled}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                id="zipCode"
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, zipCode: e.target.value }
                }))}
                placeholder="ZIP Code"
                disabled={!isEditing || disabled}
                className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
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
