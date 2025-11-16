/**
 * @fileoverview Student Health Data Service
 * @module lib/services/health
 * @description API service for fetching student health records, allergies, and medications
 */

import { requireMinimumRole } from '@/identity-access/lib/session';
import { 
  getHealthRecordsAction, 
  getStudentAllergiesAction 
} from '@/lib/actions/health-records.actions';
import { getStudentMedications as getStudentMedicationsAction } from '@/lib/actions/medications.actions';

export interface HealthRecord {
  id: string;
  recordType: string;
  title: string;
  description: string;
  recordDate: string;
  provider?: string;
  facility?: string;
  diagnosis?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpCompleted: boolean;
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  allergyType: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  symptoms?: string;
  treatment?: string;
  emergencyProtocol?: string;
  diagnosedDate?: string;
  diagnosedBy?: string;
  verified: boolean;
  epiPenRequired: boolean;
  epiPenLocation?: string;
  epiPenExpiration?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
}

export interface StudentMedication {
  id: string;
  studentId: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  prescribedBy: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
}

export interface HealthSummary {
  healthRecords: HealthRecord[];
  allergies: Allergy[];
  medications: StudentMedication[];
  summary: {
    totalRecords: number;
    totalAllergies: number;
    totalMedications: number;
    recentVisits: number;
  };
}

/**
 * Fetch comprehensive health summary for a student
 * Requires NURSE role or higher to access health records
 * @param studentId - Student UUID
 * @returns Promise<HealthSummary>
 */
export async function getStudentHealthSummary(studentId: string): Promise<HealthSummary> {
  try {
    // Verify user has permission to access health records
    await requireMinimumRole('NURSE');
    
    // Fetch all health data concurrently using Server Actions for better performance
    const [healthRecordsResponse, allergiesResponse, medicationsResponse] = await Promise.all([
      // Fetch health records using Server Action
      getHealthRecordsAction(studentId).catch(() => ({ success: false, data: [] })),
      // Fetch allergies using Server Action
      getStudentAllergiesAction(studentId).catch(() => ({ success: false, data: [] })),
      // Fetch medications using Server Action
      getStudentMedicationsAction(studentId).catch(() => [])
    ]);

    const healthRecords = (healthRecordsResponse.success ? healthRecordsResponse.data : []) as HealthRecord[];
    const allergies = (allergiesResponse.success ? allergiesResponse.data : []) as Allergy[];
    const medications = medicationsResponse as StudentMedication[];

    // Calculate summary statistics
    const recentVisits = healthRecords.filter(record => {
      const recordDate = new Date(record.recordDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }).length;

    const healthSummary: HealthSummary = {
      healthRecords,
      allergies,
      medications,
      summary: {
        totalRecords: healthRecords.length,
        totalAllergies: allergies.length,
        totalMedications: medications.length,
        recentVisits,
      },
    };

    return healthSummary;
  } catch (error) {
    console.error('Error fetching student health summary:', error);
    
    // Return fallback data instead of throwing
    // This allows the UI to render gracefully when the API is unavailable
    const fallbackSummary: HealthSummary = {
      healthRecords: [],
      allergies: [],
      medications: [],
      summary: {
        totalRecords: 0,
        totalAllergies: 0,
        totalMedications: 0,
        recentVisits: 0,
      },
    };
    
    console.warn(`Returning fallback health data for student ${studentId} due to API error`);
    return fallbackSummary;
  }
}

/**
 * Fetch student health records with pagination
 * Requires NURSE role or higher to access health records
 * @param studentId - Student UUID
 * @param page - Page number (default: 1)
 * @param limit - Records per page (default: 20)
 * @returns Promise<{data: HealthRecord[], pagination: any}>
 */
export async function getStudentHealthRecords(
  studentId: string, 
  page: number = 1, 
  limit: number = 20
): Promise<{data: HealthRecord[], pagination: Record<string, unknown>}> {
  try {
    // Verify user has permission to access health records
    await requireMinimumRole('NURSE');
    
    // Use Server Action to fetch health records
    const response = await getHealthRecordsAction(studentId);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch health records');
    }
    
    const records = response.data as HealthRecord[];
    
    // Simulate pagination since Server Action doesn't support it yet
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecords = records.slice(startIndex, endIndex);
    
    return {
      data: paginatedRecords,
      pagination: {
        page,
        limit,
        total: records.length,
        totalPages: Math.ceil(records.length / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching health records:', error);
    
    // Return fallback data instead of throwing
    const fallbackResponse = {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
    
    console.warn(`Returning fallback health records for student ${studentId} due to API error`);
    return fallbackResponse;
  }
}

/**
 * Fetch student allergies
 * @param studentId - Student UUID
 * @returns Promise<Allergy[]>
 */
export async function getStudentAllergies(studentId: string): Promise<Allergy[]> {
  try {
    // Verify user has permission to access health records
    await requireMinimumRole('NURSE');
    
    // Use Server Action to fetch allergies directly
    const response = await getStudentAllergiesAction(studentId);
    
    if (!response.success) {
      console.warn(`Failed to fetch allergies for student ${studentId}:`, response.error);
      return [];
    }
    
    return (response.data as Allergy[]) || [];
  } catch (error) {
    console.error('Error fetching student allergies:', error);
    return [];
  }
}

/**
 * Fetch student medications
 * @param studentId - Student UUID
 * @returns Promise<StudentMedication[]>
 */
export async function getStudentMedications(studentId: string): Promise<StudentMedication[]> {
  try {
    // Verify user has permission to access health records
    await requireMinimumRole('NURSE');
    
    // Use Server Action to fetch medications directly
    const medications = await getStudentMedicationsAction(studentId);
    return (medications as StudentMedication[]) || [];
  } catch (error) {
    console.error('Error fetching student medications:', error);
    return [];
  }
}

/**
 * Transform backend health records for display
 */
export function transformHealthRecordsForDisplay(records: HealthRecord[]) {
  const recordsByType = records.reduce((acc, record) => {
    const type = record.recordType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(record);
    return acc;
  }, {} as Record<string, HealthRecord[]>);

  return {
    appointments: recordsByType['CHECKUP'] || recordsByType['PHYSICAL_EXAM'] || [],
    conditions: records.filter(r => 
      r.recordType === 'CHRONIC_CONDITION_REVIEW' || 
      r.diagnosis
    ),
    allRecords: records
  };
}

/**
 * Get severity display properties for allergies
 */
export function getAllergySeverityProps(severity: string) {
  switch (severity) {
    case 'SEVERE':
    case 'LIFE_THREATENING':
      return {
        className: 'bg-red-100 text-red-800 border-red-200',
        color: 'red'
      };
    case 'MODERATE':
      return {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        color: 'orange'
      };
    case 'MILD':
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        color: 'yellow'
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        color: 'gray'
      };
  }
}
