/**
 * Emergency Contact Type Definitions
 *
 * Type definitions for emergency contacts including contact information,
 * availability tracking, and specializations.
 *
 * @module hooks/domains/emergency/types/emergencyContactTypes
 */

import type { EmergencyUser, ContactAvailability } from './emergencyUserTypes';

export interface EmergencyContact {
  id: string;
  name: string;
  title: string;
  organization?: string;
  department?: string;
  contactType: 'INTERNAL' | 'EXTERNAL' | 'VENDOR' | 'AGENCY' | 'MEDIA';
  priority: number;
  isOn24x7: boolean;
  isPrimary: boolean;
  phone: string;
  mobile?: string;
  email: string;
  alternativeEmail?: string;
  address?: ContactAddress;
  specializations: string[];
  availability: ContactAvailability;
  notes?: string;
  lastContacted?: string;
  isActive: boolean;
  createdBy: EmergencyUser;
  createdAt: string;
  updatedAt: string;
}

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
