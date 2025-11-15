/**
 * @fileoverview Student Health Data Service
 * @module lib/services/health
 * @description API service for fetching student health records, allergies, and medications
 */

import { serverGet } from '@/lib/api/nextjs-client';

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
 * @param studentId - Student UUID
 * @returns Promise<HealthSummary>
 */
export async function getStudentHealthSummary(studentId: string): Promise<HealthSummary> {
  try {
    // Fetch health records from the correct endpoint
    const healthRecordsResponse = await serverGet<{data: HealthRecord[], pagination: Record<string, unknown>}>(
      `/api/students/${studentId}/health-records`,
      { page: 1, limit: 100 }
    );

    // For now, return a mock summary structure until other endpoints are available
    // TODO: Integrate with actual allergy and medication endpoints when available
    const healthSummary: HealthSummary = {
      healthRecords: healthRecordsResponse.data || [],
      allergies: [], // TODO: Fetch from allergies endpoint when available
      medications: [], // TODO: Fetch from medications endpoint when available
      summary: {
        totalRecords: healthRecordsResponse.data?.length || 0,
        totalAllergies: 0, // TODO: Update when allergies endpoint is available
        totalMedications: 0, // TODO: Update when medications endpoint is available
        recentVisits: healthRecordsResponse.data?.filter(record => {
          const recordDate = new Date(record.recordDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return recordDate >= thirtyDaysAgo;
        }).length || 0,
      },
    };

    return healthSummary;
  } catch (error) {
    console.error('Error fetching student health summary:', error);
    throw new Error('Failed to fetch health summary');
  }
}

/**
 * Fetch student health records with pagination
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
    const response = await serverGet<{data: HealthRecord[], pagination: Record<string, unknown>}>(
      `/api/students/${studentId}/health-records`,
      { page, limit }
    );
    return response;
  } catch (error) {
    console.error('Error fetching health records:', error);
    throw new Error('Failed to fetch health records');
  }
}

/**
 * Fetch student allergies
 * @param studentId - Student UUID
 * @returns Promise<Allergy[]>
 */
export async function getStudentAllergies(studentId: string): Promise<Allergy[]> {
  try {
    // For now, fetch from health summary until separate allergy endpoint is available
    const summary = await getStudentHealthSummary(studentId);
    return summary.allergies || [];
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
    // For now, fetch from health summary until separate medication endpoint is available
    const summary = await getStudentHealthSummary(studentId);
    return summary.medications || [];
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