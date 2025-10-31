/**
 * Students Data Types and Utilities
 * 
 * Contains type definitions, interfaces, and data utilities for student management functionality
 */

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  grade: string;
  studentId: string;
  email?: string;
  phone?: string;
  address?: Address;
  parentGuardian?: ParentGuardian[];
  medicalInfo?: MedicalInfo;
  emergencyContacts?: EmergencyContact[];
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  enrollmentDate: string;
  lastUpdate?: string;
  photoUrl?: string;
  allergies?: Allergy[];
  medications?: Medication[];
  immunizations?: Immunization[];
  healthConditions?: HealthCondition[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface ParentGuardian {
  id: string;
  type: 'parent' | 'guardian' | 'emergency';
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: Address;
  isPrimary: boolean;
  canPickup: boolean;
  canReceiveMedicalInfo: boolean;
}

export interface MedicalInfo {
  bloodType?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  physicianName?: string;
  physicianPhone?: string;
  medicalNotes?: string;
  lastPhysical?: string;
  nextPhysicalDue?: string;
}

export interface EmergencyContact extends ParentGuardian {
  priority: number;
  relationship: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  treatment?: string;
  notes?: string;
  diagnosedDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'inhaled' | 'other';
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  sideEffects?: string[];
  isControlled: boolean;
  requiresSupervision: boolean;
}

export interface Immunization {
  id: string;
  vaccine: string;
  dateAdministered: string;
  administeredBy: string;
  lotNumber?: string;
  nextDue?: string;
  isRequired: boolean;
  exemptionType?: 'medical' | 'religious' | 'personal';
}

export interface HealthCondition {
  id: string;
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
  managementPlan?: string;
  restrictions?: string[];
  accommodations?: string[];
  isActive: boolean;
}

export interface StudentFilters {
  grade?: string;
  status?: Student['status'];
  hasAllergies?: boolean;
  hasMedications?: boolean;
  nurseId?: string;
  search?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  withAllergies: number;
  withMedications: number;
  withHealthConditions: number;
}

/**
 * Status color mappings for UI display
 */
export const studentStatusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  transferred: 'bg-blue-100 text-blue-800',
  graduated: 'bg-purple-100 text-purple-800',
} as const;

/**
 * Grade level mappings
 */
export const gradeLevels = {
  'pre-k': 'Pre-K',
  'kindergarten': 'Kindergarten',
  '1': '1st Grade',
  '2': '2nd Grade',
  '3': '3rd Grade',
  '4': '4th Grade',
  '5': '5th Grade',
  '6': '6th Grade',
  '7': '7th Grade',
  '8': '8th Grade',
  '9': '9th Grade',
  '10': '10th Grade',
  '11': '11th Grade',
  '12': '12th Grade',
} as const;

/**
 * Priority level mappings for allergies and health conditions
 */
export const severityColors = {
  mild: 'bg-yellow-100 text-yellow-800',
  moderate: 'bg-orange-100 text-orange-800',
  severe: 'bg-red-100 text-red-800',
  'life-threatening': 'bg-red-200 text-red-900 font-bold',
} as const;

/**
 * Utility functions
 */
export const studentUtils = {
  /**
   * Get full name of student
   */
  getFullName: (student: Student): string => {
    const parts = [student.firstName, student.middleName, student.lastName].filter(Boolean);
    return parts.join(' ');
  },

  /**
   * Get age from date of birth
   */
  getAge: (dateOfBirth: string): number => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    
    return age;
  },

  /**
   * Check if student has critical health alerts
   */
  hasCriticalAlerts: (student: Student): boolean => {
    const hasLifeThreateningAllergies = student.allergies?.some(
      allergy => allergy.severity === 'life-threatening'
    ) ?? false;
    
    const hasSevereHealthConditions = student.healthConditions?.some(
      condition => condition.severity === 'severe' && condition.isActive
    ) ?? false;
    
    return hasLifeThreateningAllergies || hasSevereHealthConditions;
  },

  /**
   * Get primary emergency contact
   */
  getPrimaryContact: (student: Student): EmergencyContact | undefined => {
    return student.emergencyContacts?.find(contact => contact.isPrimary);
  },

  /**
   * Format student ID for display
   */
  formatStudentId: (studentId: string): string => {
    // Add any formatting logic for student IDs
    return studentId.toUpperCase();
  },

  /**
   * Get next immunization due
   */
  getNextImmunizationDue: (student: Student): Immunization | undefined => {
    const upcomingImmunizations = student.immunizations?.filter(
      imm => imm.nextDue && new Date(imm.nextDue) > new Date()
    );
    
    return upcomingImmunizations?.sort((a, b) => 
      new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime()
    )[0];
  }
};