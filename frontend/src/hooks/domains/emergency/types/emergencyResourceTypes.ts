/**
 * Emergency Resource Type Definitions
 *
 * Type definitions for emergency resources including resource tracking,
 * maintenance schedules, and supplier information.
 *
 * @module hooks/domains/emergency/types/emergencyResourceTypes
 */

import type { EmergencyUser } from './emergencyUserTypes';
import type { IncidentLocation } from './emergencyIncidentTypes';

export interface EmergencyResource {
  id: string;
  name: string;
  type: ResourceType;
  category: string;
  description: string;
  location: IncidentLocation;
  quantity: number;
  availableQuantity: number;
  unit: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'UNAVAILABLE';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  lastInspected?: string;
  inspectedBy?: EmergencyUser;
  maintenanceSchedule?: MaintenanceSchedule;
  supplier?: ResourceSupplier;
  cost?: number;
  purchaseDate?: string;
  warrantyExpiry?: string;
  specifications?: Record<string, any>;
  operatingInstructions?: string;
  safetyNotes?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceType {
  id: string;
  name: string;
  category: string;
  description: string;
  standardSpecs: Record<string, any>;
}

export interface MaintenanceSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  lastMaintenance?: string;
  nextMaintenance: string;
  maintenanceNotes?: string;
}

export interface ResourceSupplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  supportHours: string;
}
