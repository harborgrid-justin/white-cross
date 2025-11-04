/**
 * Medical Record Domain Types
 * Medical records, vitals, diagnoses, procedures, and lab results
 */

import type { Medication, Allergy } from './patient.types';

// ============================================================================
// ENUMS
// ============================================================================

export enum VitalType {
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  TEMPERATURE = 'temperature',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  OXYGEN_SATURATION = 'oxygen_saturation',
  BLOOD_GLUCOSE = 'blood_glucose',
  RESPIRATORY_RATE = 'respiratory_rate'
}

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface VitalSigns {
  id: string;
  patientId: string;
  type: VitalType;
  value: number;
  unit: string;
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  code: string; // ICD-10 code
  description: string;
  type: string; // primary, secondary, etc.
  status: string;
  onsetDate?: string;
  resolvedDate?: string;
  diagnosedBy: string;
  confidence: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  patientId: string;
  code: string; // CPT code
  description: string;
  performedDate: string;
  performedBy: string;
  facility: string;
  duration?: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  result: string;
  unit?: string;
  referenceRange: string;
  status: string;
  orderedDate: string;
  resultDate: string;
  orderedBy: string;
  labFacility: string;
  isAbnormal: boolean;
  isCritical: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId: string;
  visitDate: string;
  visitType: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  assessment: string;
  plan: string;
  vitals: VitalSigns[];
  medications: Medication[];
  allergies: Allergy[];
  diagnoses: Diagnosis[];
  procedures: Procedure[];
  labResults: LabResult[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  type: string;
  priority: Priority;
  message: string;
  source: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  isActive: boolean;
}

export interface HealthMetrics {
  totalPatients: number;
  activePatients: number;
  appointmentsToday: number;
  criticalAlerts: number;
  avgAppointmentDuration: number;
  patientSatisfactionScore: number;
  noShowRate: number;
  departmentUtilization: Record<string, number>;
  providerWorkload: Record<string, number>;
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

export interface MedicalRecordFilters {
  patientId?: string;
  providerId?: string[];
  visitDateRange?: [string, string];
  diagnosisCode?: string[];
  hasLabResults?: boolean;
  hasProcedures?: boolean;
  search?: string;
}
