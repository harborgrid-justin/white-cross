/**
 * Provider Domain Types
 * Provider and facility-related interfaces
 */

import type { Address } from './patient.types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  licenseNumber: string;
  email: string;
  phone: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  address: Address;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
