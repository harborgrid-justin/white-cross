/**
 * Health Records Data Types and Utilities
 * 
 * This file contains all the TypeScript interfaces, types, and utility functions
 * related to health records management in the White Cross Healthcare Platform.
 */

import { z } from 'zod';

// ============================================================================
// Core Health Record Interfaces
// ============================================================================

/**
 * Main health record interface
 */
export interface HealthRecord {
  id: string;
  studentId: string;
  studentName?: string;
  recordType: 'medication' | 'allergy' | 'immunization' | 'condition' | 'incident' | 'visit';
  title: string;
  description: string;
  date: string; // ISO date string
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'resolved' | 'pending';
  recordedBy: string; // User ID of the healthcare professional
  recordedByName?: string;
  attachments?: HealthRecordAttachment[];
  medications?: MedicationRecord[];
  allergies?: AllergyRecord[];
  immunizations?: ImmunizationRecord[];
  conditions?: MedicalCondition[];
  vitals?: VitalSigns[];
  notes?: string;
  followUp?: {
    required: boolean;
    date?: string;
    instructions?: string;
  };
  parentNotified?: boolean;
  emergencyContact?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medication record interface
 */
export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  sideEffects?: string[];
  status: 'active' | 'completed' | 'discontinued' | 'on-hold';
  schoolAdministration?: {
    required: boolean;
    time?: string;
    instructions?: string;
    lastGiven?: string;
  };
}

/**
 * Allergy record interface
 */
export interface AllergyRecord {
  id: string;
  allergen: string;
  type: 'food' | 'environmental' | 'medication' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms: string[];
  treatment: string;
  epiPenRequired?: boolean;
  onsetDate?: string;
  lastReaction?: string;
  notes?: string;
}

/**
 * Immunization record interface
 */
export interface ImmunizationRecord {
  id: string;
  vaccine: string;
  dateGiven: string;
  provider: string;
  lotNumber?: string;
  site?: string;
  route?: string;
  doseNumber?: number;
  nextDue?: string;
  reactions?: string[];
  exempt?: boolean;
  exemptionReason?: string;
}

/**
 * Medical condition interface
 */
export interface MedicalCondition {
  id: string;
  condition: string;
  diagnosedDate?: string;
  icd10Code?: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'chronic' | 'under-treatment';
  symptoms?: string[];
  triggers?: string[];
  treatment?: string;
  restrictions?: string[];
  accommodations?: string[];
  emergencyPlan?: string;
}

/**
 * Vital signs interface
 */
export interface VitalSigns {
  id: string;
  recordDate: string;
  temperature?: number;
  temperatureUnit?: 'F' | 'C';
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  heightUnit?: 'in' | 'cm';
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  bmi?: number;
  notes?: string;
}

/**
 * Health record attachment interface
 */
export interface HealthRecordAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

/**
 * Health record filter interface for searches and reports
 */
export interface HealthRecordFilter {
  studentId?: string;
  recordType?: HealthRecord['recordType'][];
  dateRange?: {
    start: string;
    end: string;
  };
  severity?: HealthRecord['severity'][];
  status?: HealthRecord['status'][];
  recordedBy?: string;
  hasFollowUp?: boolean;
  searchQuery?: string;
}

// ============================================================================
// Default Values and Constants
// ============================================================================

/**
 * Default health record for forms
 */
export const defaultHealthRecord: Partial<HealthRecord> = {
  recordType: 'visit',
  severity: 'low',
  status: 'active',
  parentNotified: false,
  emergencyContact: false,
  followUp: {
    required: false
  }
};

/**
 * Default medication record
 */
export const defaultMedicationRecord: Partial<MedicationRecord> = {
  route: 'oral',
  status: 'active',
  schoolAdministration: {
    required: false
  }
};

/**
 * Default allergy record
 */
export const defaultAllergyRecord: Partial<AllergyRecord> = {
  type: 'food',
  severity: 'mild',
  symptoms: [],
  epiPenRequired: false
};

/**
 * Health record types with labels and colors
 */
export const healthRecordTypes = [
  { value: 'medication', label: 'Medication', color: 'blue', icon: '💊' },
  { value: 'allergy', label: 'Allergy', color: 'red', icon: '⚠️' },
  { value: 'immunization', label: 'Immunization', color: 'green', icon: '💉' },
  { value: 'condition', label: 'Medical Condition', color: 'orange', icon: '🩺' },
  { value: 'incident', label: 'Incident Report', color: 'yellow', icon: '📋' },
  { value: 'visit', label: 'Nurse Visit', color: 'purple', icon: '🏥' }
] as const;

/**
 * Severity levels with colors and descriptions
 */
export const severityLevels = [
  { value: 'low', label: 'Low', color: 'green', description: 'Minor concern, routine care' },
  { value: 'medium', label: 'Medium', color: 'yellow', description: 'Moderate concern, monitoring needed' },
  { value: 'high', label: 'High', color: 'orange', description: 'Significant concern, action required' },
  { value: 'critical', label: 'Critical', color: 'red', description: 'Urgent care needed, emergency response' }
] as const;

/**
 * Status options with labels and colors
 */
export const statusOptions = [
  { value: 'active', label: 'Active', color: 'blue' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'resolved', label: 'Resolved', color: 'green' },
  { value: 'pending', label: 'Pending', color: 'yellow' }
] as const;

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Health record validation schema
 */
export const healthRecordSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  recordType: z.enum(['medication', 'allergy', 'immunization', 'condition', 'incident', 'visit']),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  date: z.string().min(1, 'Date is required'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['active', 'inactive', 'resolved', 'pending']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  parentNotified: z.boolean().optional(),
  emergencyContact: z.boolean().optional()
});

/**
 * Medication record validation schema
 */
export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  route: z.enum(['oral', 'topical', 'injection', 'inhalation', 'other']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  prescribedBy: z.string().min(1, 'Prescriber is required'),
  instructions: z.string().min(1, 'Instructions are required')
});

/**
 * Allergy record validation schema
 */
export const allergySchema = z.object({
  allergen: z.string().min(1, 'Allergen is required'),
  type: z.enum(['food', 'environmental', 'medication', 'other']),
  severity: z.enum(['mild', 'moderate', 'severe', 'life-threatening']),
  symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  treatment: z.string().min(1, 'Treatment information is required'),
  epiPenRequired: z.boolean().optional()
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Health record utility functions
 */
export const healthRecordUtils = {
  /**
   * Format a date for display
   */
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Format a date and time for display
   */
  formatDateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get the color variant for a record type
   */
  getRecordTypeColor: (type: HealthRecord['recordType']): string => {
    const typeConfig = healthRecordTypes.find(t => t.value === type);
    return typeConfig?.color || 'gray';
  },

  /**
   * Get the color variant for severity level
   */
  getSeverityColor: (severity: HealthRecord['severity']): string => {
    const severityConfig = severityLevels.find(s => s.value === severity);
    return severityConfig?.color || 'gray';
  },

  /**
   * Get the color variant for status
   */
  getStatusColor: (status: HealthRecord['status']): string => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig?.color || 'gray';
  },

  /**
   * Format record type for display
   */
  formatRecordType: (type: HealthRecord['recordType']): string => {
    const typeConfig = healthRecordTypes.find(t => t.value === type);
    return typeConfig?.label || type;
  },

  /**
   * Format severity for display
   */
  formatSeverity: (severity: HealthRecord['severity']): string => {
    if (!severity) return 'Not specified';
    const severityConfig = severityLevels.find(s => s.value === severity);
    return severityConfig?.label || severity;
  },

  /**
   * Format status for display
   */
  formatStatus: (status: HealthRecord['status']): string => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig?.label || status;
  },

  /**
   * Check if a record requires immediate attention
   */
  requiresAttention: (record: HealthRecord): boolean => {
    return record.severity === 'critical' || 
           record.severity === 'high' || 
           (!!record.followUp?.required && !!record.followUp.date && 
            new Date(record.followUp.date) <= new Date());
  },

  /**
   * Check if a medication is due for school administration
   */
  isMedicationDue: (medication: MedicationRecord): boolean => {
    if (!medication.schoolAdministration?.required || !medication.schoolAdministration.time) {
      return false;
    }

    const now = new Date();
    const [hours, minutes] = medication.schoolAdministration.time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Check if we're past the scheduled time and medication hasn't been given today
    if (now >= scheduledTime) {
      const lastGiven = medication.schoolAdministration.lastGiven;
      if (!lastGiven) return true;

      const lastGivenDate = new Date(lastGiven);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastGivenDate.setHours(0, 0, 0, 0);

      return lastGivenDate < today;
    }

    return false;
  },

  /**
   * Get health records that need follow-up
   */
  getFollowUpRecords: (records: HealthRecord[]): HealthRecord[] => {
    const now = new Date();
    return records.filter(record => 
      record.followUp?.required && 
      record.followUp.date && 
      new Date(record.followUp.date) <= now
    );
  },

  /**
   * Get active medications for a student
   */
  getActiveMedications: (records: HealthRecord[]): MedicationRecord[] => {
    return records
      .filter(record => record.recordType === 'medication' && record.status === 'active')
      .flatMap(record => record.medications || [])
      .filter(med => med.status === 'active');
  },

  /**
   * Get active allergies for a student
   */
  getActiveAllergies: (records: HealthRecord[]): AllergyRecord[] => {
    return records
      .filter(record => record.recordType === 'allergy' && record.status === 'active')
      .flatMap(record => record.allergies || []);
  },

  /**
   * Check if student has any critical health alerts
   */
  hasCriticalAlerts: (records: HealthRecord[]): boolean => {
    return records.some(record => 
      record.severity === 'critical' && record.status === 'active'
    );
  },

  /**
   * Generate health summary for a student
   */
  generateHealthSummary: (records: HealthRecord[]): {
    activeMedications: number;
    activeAllergies: number;
    criticalAlerts: number;
    pendingFollowUps: number;
  } => {
    const activeMedications = healthRecordUtils.getActiveMedications(records).length;
    const activeAllergies = healthRecordUtils.getActiveAllergies(records).length;
    const criticalAlerts = records.filter(r => r.severity === 'critical' && r.status === 'active').length;
    const pendingFollowUps = healthRecordUtils.getFollowUpRecords(records).length;

    return {
      activeMedications,
      activeAllergies,
      criticalAlerts,
      pendingFollowUps
    };
  }
};

/**
 * Medication utility functions
 */
export const medicationUtils = {
  /**
   * Check if medication is due for administration
   */
  isDue: (medication: MedicationRecord): boolean => {
    return healthRecordUtils.isMedicationDue(medication);
  },

  /**
   * Format medication frequency for display
   */
  formatFrequency: (frequency: string): string => {
    const frequencyMap: Record<string, string> = {
      'once-daily': 'Once daily',
      'twice-daily': 'Twice daily',
      'three-times-daily': 'Three times daily',
      'four-times-daily': 'Four times daily',
      'as-needed': 'As needed',
      'before-meals': 'Before meals',
      'after-meals': 'After meals'
    };
    
    return frequencyMap[frequency] || frequency;
  },

  /**
   * Get next administration time
   */
  getNextAdministrationTime: (medication: MedicationRecord): string | null => {
    if (!medication.schoolAdministration?.required || !medication.schoolAdministration.time) {
      return null;
    }

    const [hours, minutes] = medication.schoolAdministration.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If we've passed today's time, schedule for tomorrow
    if (now >= scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    return scheduledTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};