/**
 * Emergency User Type Definitions
 *
 * Type definitions for emergency users including contact information,
 * roles, specializations, and availability.
 *
 * @module hooks/domains/emergency/types/emergencyUserTypes
 */

export interface ContactAvailability {
  weekdays: { start: string; end: string };
  weekends: { start: string; end: string };
  holidays: { available: boolean; contact?: string };
  timezone: string;
}

export interface EmergencyUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  role: string;
  isEmergencyContact: boolean;
  specializations: string[];
  certifications: string[];
  availability: ContactAvailability;
}
