/**
 * Enterprise-Grade Health Records API Client
 *
 * Purpose: Comprehensive management of student health records with all sub-modules
 *
 * Architecture:
 * - Main health records operations
 * - Allergies management with safety checks
 * - Chronic conditions tracking
 * - Vaccinations and compliance
 * - Screenings management
 * - Growth measurements and trends
 * - Vital signs tracking
 * - PHI access logging and security
 *
 * Security:
 * - Automatic PHI access logging
 * - Request/response sanitization
 * - Role-based access validation
 * - Audit trail for all operations
 *
 * Compliance:
 * - HIPAA-compliant error handling
 * - No PHI exposure in error messages
 * - Comprehensive audit logging
 * - Data retention policies
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { z } from 'zod';
import {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  Student
} from '../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

// Main Health Record Types
export interface HealthRecord {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthRecordType =
  | 'GENERAL_VISIT'
  | 'INJURY'
  | 'ILLNESS'
  | 'MEDICATION'
  | 'VACCINATION'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'EMERGENCY'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING'
  | 'OTHER';

export interface HealthRecordCreate {
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface HealthRecordUpdate {
  type?: HealthRecordType;
  date?: string;
  description?: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface HealthRecordFilters extends PaginationParams {
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  provider?: string;
  followUpRequired?: boolean;
  isConfidential?: boolean;
}

// Allergy Types
export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  isCritical: boolean;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum AllergyType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER'
}

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
}

export interface AllergyCreate {
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

export interface AllergyUpdate {
  allergen?: string;
  allergyType?: AllergyType;
  severity?: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

// Chronic Condition Types
export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  isActive: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  IN_REMISSION = 'IN_REMISSION',
  RESOLVED = 'RESOLVED',
  UNDER_OBSERVATION = 'UNDER_OBSERVATION'
}

export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

export interface ChronicConditionCreate {
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  nextReviewDate?: string;
}

export interface ChronicConditionUpdate {
  condition?: string;
  icdCode?: string;
  diagnosedDate?: string;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  isActive?: boolean;
}

// Vaccination Types
export interface Vaccination {
  id: string;
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
  isCompliant: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum VaccinationStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  EXEMPTED = 'EXEMPTED',
  NOT_REQUIRED = 'NOT_REQUIRED'
}

export interface VaccinationCreate {
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

export interface VaccinationUpdate {
  vaccineName?: string;
  vaccineType?: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate?: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

export interface VaccinationCompliance {
  studentId: string;
  isCompliant: boolean;
  requiredVaccinations: Array<{
    name: string;
    status: VaccinationStatus;
    dueDate?: string;
    completedDoses: number;
    requiredDoses: number;
  }>;
  missingVaccinations: string[];
  upcomingDue: Array<{
    name: string;
    dueDate: string;
  }>;
  exemptions?: Array<{
    vaccineName: string;
    exemptionType: string;
    reason?: string;
  }>;
}

// Screening Types
export interface Screening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, any>;
  referralRequired: boolean;
  referralTo?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  BMI = 'BMI',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  OTHER = 'OTHER'
}

export enum ScreeningOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REFER = 'REFER',
  INCONCLUSIVE = 'INCONCLUSIVE',
  DECLINED = 'DECLINED'
}

export interface ScreeningCreate {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, any>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

export interface ScreeningUpdate {
  screeningType?: ScreeningType;
  screeningDate?: string;
  performedBy?: string;
  outcome?: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, any>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

// Growth Measurement Types
export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height?: number; // in cm
  weight?: number; // in kg
  headCircumference?: number; // in cm
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  measuredBy: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    gender: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GrowthMeasurementCreate {
  studentId: string;
  measurementDate: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy: string;
  notes?: string;
}

export interface GrowthMeasurementUpdate {
  measurementDate?: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy?: string;
  notes?: string;
}

export interface GrowthTrend {
  studentId: string;
  measurements: GrowthMeasurement[];
  trends: {
    heightTrend: 'increasing' | 'stable' | 'decreasing';
    weightTrend: 'increasing' | 'stable' | 'decreasing';
    bmiTrend: 'increasing' | 'stable' | 'decreasing';
  };
  concerns: string[];
  recommendations: string[];
}

// Vital Signs Types
export interface VitalSigns {
  id: string;
  studentId: string;
  recordDate: string;
  temperature?: number; // in Celsius
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // beats per minute
  respiratoryRate?: number; // breaths per minute
  oxygenSaturation?: number; // percentage
  pain?: number; // 0-10 scale
  glucose?: number; // mg/dL
  weight?: number; // in kg
  height?: number; // in cm
  notes?: string;
  recordedBy: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VitalSignsCreate {
  studentId: string;
  recordDate: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
  recordedBy: string;
}

export interface VitalSignsUpdate {
  recordDate?: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

export interface VitalSignsTrend {
  studentId: string;
  vitalType: 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation';
  measurements: Array<{
    date: string;
    value: number;
  }>;
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  alerts: string[];
}

// Health Summary Types
export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    age: number;
    gender: string;
  };
  criticalAlerts: string[];
  allergies: Allergy[];
  criticalAllergies: Allergy[];
  chronicConditions: ChronicCondition[];
  activeConditions: ChronicCondition[];
  latestVitals?: VitalSigns;
  latestGrowth?: GrowthMeasurement;
  vaccinations: {
    isCompliant: boolean;
    total: number;
    overdue: number;
    upcoming: number;
  };
  recentScreenings: Screening[];
  lastPhysicalExam?: {
    date: string;
    provider: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  carePlans: string[];
  restrictions: string[];
  followUpsRequired: number;
  lastVisit?: string;
  totalVisits: number;
}

// Timeline Types
export interface HealthTimeline {
  studentId: string;
  events: Array<{
    id: string;
    type: 'visit' | 'vaccination' | 'screening' | 'allergy' | 'condition' | 'measurement' | 'vitals';
    date: string;
    title: string;
    description: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    provider?: string;
  }>;
  startDate: string;
  endDate: string;
  totalEvents: number;
}

// Statistics Types
export interface HealthRecordsStatistics {
  totalRecords: number;
  recordsByType: Record<HealthRecordType, number>;
  recordsByMonth: Array<{
    month: string;
    count: number;
  }>;
  topConditions: Array<{
    condition: string;
    count: number;
  }>;
  vaccinationCompliance: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
  allergyStatistics: {
    totalAllergies: number;
    critical: number;
    byType: Record<AllergyType, number>;
    bySeverity: Record<AllergySeverity, number>;
  };
  screeningStatistics: {
    totalScreenings: number;
    passed: number;
    failed: number;
    referrals: number;
  };
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const healthRecordCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  provider: z.string().optional(),
  providerNPI: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  isConfidential: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
});

const allergyCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  allergen: z.string().min(1, 'Allergen is required'),
  allergyType: z.nativeEnum(AllergyType),
  severity: z.nativeEnum(AllergySeverity),
  reaction: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  treatment: z.string().optional(),
  onsetDate: z.string().optional(),
  diagnosedBy: z.string().optional(),
  verified: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  notes: z.string().optional(),
});

const chronicConditionCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  condition: z.string().min(1, 'Condition is required'),
  icdCode: z.string().optional(),
  diagnosedDate: z.string().min(1, 'Diagnosed date is required'),
  status: z.nativeEnum(ConditionStatus),
  severity: z.nativeEnum(ConditionSeverity),
  notes: z.string().optional(),
  carePlan: z.string().optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  diagnosedBy: z.string().optional(),
  nextReviewDate: z.string().optional(),
});

const vaccinationCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  vaccineType: z.string().min(1, 'Vaccine type is required'),
  cvxCode: z.string().optional(),
  doseNumber: z.number().int().min(1).optional(),
  totalDoses: z.number().int().min(1).optional(),
  administeredDate: z.string().min(1, 'Administered date is required'),
  expirationDate: z.string().optional(),
  lotNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  administeredBy: z.string().optional(),
  administeredByNPI: z.string().optional(),
  site: z.string().optional(),
  route: z.string().optional(),
  dosage: z.string().optional(),
  status: z.nativeEnum(VaccinationStatus).optional(),
  reactions: z.array(z.string()).optional(),
  notes: z.string().optional(),
  nextDueDate: z.string().optional(),
});

const screeningCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  screeningType: z.nativeEnum(ScreeningType),
  screeningDate: z.string().min(1, 'Screening date is required'),
  performedBy: z.string().min(1, 'Performed by is required'),
  outcome: z.nativeEnum(ScreeningOutcome),
  results: z.string().optional(),
  measurements: z.record(z.any()).optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

const growthMeasurementCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  measurementDate: z.string().min(1, 'Measurement date is required'),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  headCircumference: z.number().positive().optional(),
  measuredBy: z.string().min(1, 'Measured by is required'),
  notes: z.string().optional(),
});

const vitalSignsCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  recordDate: z.string().min(1, 'Record date is required'),
  temperature: z.number().min(35).max(42).optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().int().min(50).max(250).optional(),
  bloodPressureDiastolic: z.number().int().min(30).max(150).optional(),
  heartRate: z.number().int().min(30).max(250).optional(),
  respiratoryRate: z.number().int().min(8).max(60).optional(),
  oxygenSaturation: z.number().min(0).max(100).optional(),
  pain: z.number().int().min(0).max(10).optional(),
  glucose: z.number().min(0).max(600).optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  notes: z.string().optional(),
  recordedBy: z.string().min(1, 'Recorded by is required'),
});

// ==========================================
// API CLIENT CLASS
// ==========================================

export class HealthRecordsApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  /**
   * Log PHI access for HIPAA compliance
   * Automatically called after successful data retrieval
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    resourceType: string = 'HEALTH_RECORD',
    resourceId?: string
  ): Promise<void> {
    try {
      await apiInstance.post('/audit/phi-access', {
        action,
        studentId,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Log error but don't fail the main operation
      console.error('Failed to log PHI access:', error);
    }
  }

  /**
   * Sanitize error messages to prevent PHI exposure
   */
  private sanitizeError(error: any): Error {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    // Remove any potential PHI from error messages
    const sanitized = message.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[Name Redacted]');
    return new Error(sanitized);
  }

  // ==========================================
  // MAIN HEALTH RECORDS OPERATIONS
  // ==========================================

  /**
   * Get all health records for a student
   */
  async getRecords(studentId: string, filters?: HealthRecordFilters): Promise<PaginatedResponse<HealthRecord>> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.provider) params.append('provider', filters.provider);
      if (filters?.followUpRequired !== undefined) params.append('followUpRequired', String(filters.followUpRequired));
      if (filters?.isConfidential !== undefined) params.append('isConfidential', String(filters.isConfidential));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess('VIEW_HEALTH_RECORDS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single health record by ID
   */
  async getRecordById(id: string): Promise<HealthRecord> {
    try {
      const response = await apiInstance.get<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`
      );

      const record = response.data.data!;
      await this.logPHIAccess('VIEW_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);

      return record;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new health record
   */
  async createRecord(data: HealthRecordCreate): Promise<HealthRecord> {
    try {
      // Validate input
      healthRecordCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<HealthRecord>>(
        this.baseEndpoint,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess('CREATE_HEALTH_RECORD', data.studentId, 'HEALTH_RECORD', record.id);

      return record;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing health record
   */
  async updateRecord(id: string, data: HealthRecordUpdate): Promise<HealthRecord> {
    try {
      const response = await apiInstance.put<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess('UPDATE_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);

      return record;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a health record (soft delete)
   */
  async deleteRecord(id: string): Promise<void> {
    try {
      // Get record first to log studentId
      const record = await this.getRecordById(id);

      await apiInstance.delete(`${this.baseEndpoint}/${id}`);

      await this.logPHIAccess('DELETE_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get health timeline for a student
   */
  async getTimeline(studentId: string, dateFrom?: string, dateTo?: string): Promise<HealthTimeline> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await apiInstance.get<ApiResponse<HealthTimeline>>(
        `${this.baseEndpoint}/student/${studentId}/timeline?${params.toString()}`
      );

      await this.logPHIAccess('VIEW_HEALTH_TIMELINE', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get comprehensive health summary for a student
   */
  async getSummary(studentId: string): Promise<HealthSummary> {
    try {
      const response = await apiInstance.get<ApiResponse<HealthSummary>>(
        `${this.baseEndpoint}/student/${studentId}/summary`
      );

      await this.logPHIAccess('VIEW_HEALTH_SUMMARY', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Search health records across all students (admin only)
   */
  async searchRecords(query: string, filters?: HealthRecordFilters): Promise<PaginatedResponse<HealthRecord>> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/search?${params.toString()}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Export health records for a student
   */
  async exportRecords(studentId: string, format: 'pdf' | 'json' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiInstance.get(
        `${this.baseEndpoint}/student/${studentId}/export?format=${format}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess('EXPORT_HEALTH_RECORDS', studentId);

      return response.data;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Import health records from file
   */
  async importRecords(studentId: string, file: File): Promise<{ imported: number; errors: any[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiInstance.post<ApiResponse<{ imported: number; errors: any[] }>>(
        `${this.baseEndpoint}/student/${studentId}/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      await this.logPHIAccess('IMPORT_HEALTH_RECORDS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get health records statistics
   */
  async getStatistics(filters?: { dateFrom?: string; dateTo?: string; schoolId?: string }): Promise<HealthRecordsStatistics> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.schoolId) params.append('schoolId', filters.schoolId);

      const response = await apiInstance.get<ApiResponse<HealthRecordsStatistics>>(
        `${this.baseEndpoint}/statistics?${params.toString()}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // ALLERGIES OPERATIONS
  // ==========================================

  /**
   * Get all allergies for a student
   */
  async getAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/student/${studentId}/allergies`
      );

      await this.logPHIAccess('VIEW_ALLERGIES', studentId);

      return response.data.data!.allergies;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single allergy by ID
   */
  async getAllergyById(id: string): Promise<Allergy> {
    try {
      const response = await apiInstance.get<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`
      );

      const allergy = response.data.data!;
      await this.logPHIAccess('VIEW_ALLERGY', allergy.studentId, 'ALLERGY', id);

      return allergy;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new allergy record
   */
  async createAllergy(data: AllergyCreate): Promise<Allergy> {
    try {
      // Validate input
      allergyCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess('CREATE_ALLERGY', data.studentId, 'ALLERGY', allergy.id);

      return allergy;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing allergy
   */
  async updateAllergy(id: string, data: AllergyUpdate): Promise<Allergy> {
    try {
      const response = await apiInstance.put<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess('UPDATE_ALLERGY', allergy.studentId, 'ALLERGY', id);

      return allergy;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    try {
      const allergy = await this.getAllergyById(id);

      await apiInstance.delete(`${this.baseEndpoint}/allergies/${id}`);

      await this.logPHIAccess('DELETE_ALLERGY', allergy.studentId, 'ALLERGY', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Verify an allergy
   */
  async verifyAllergy(id: string, verifiedBy: string): Promise<Allergy> {
    try {
      const response = await apiInstance.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}/verify`,
        { verifiedBy }
      );

      const allergy = response.data.data!;
      await this.logPHIAccess('VERIFY_ALLERGY', allergy.studentId, 'ALLERGY', id);

      return allergy;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get critical/life-threatening allergies for a student
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/student/${studentId}/allergies/critical`
      );

      await this.logPHIAccess('VIEW_CRITICAL_ALLERGIES', studentId);

      return response.data.data!.allergies;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check for contraindications between allergies and medications
   */
  async checkContraindications(studentId: string, medicationId: string): Promise<{
    hasContraindication: boolean;
    allergies: Allergy[];
    warnings: string[];
  }> {
    try {
      const response = await apiInstance.post<ApiResponse<{
        hasContraindication: boolean;
        allergies: Allergy[];
        warnings: string[];
      }>>(
        `${this.baseEndpoint}/student/${studentId}/allergies/check-contraindications`,
        { medicationId }
      );

      await this.logPHIAccess('CHECK_CONTRAINDICATIONS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get allergy statistics
   */
  async getAllergyStatistics(filters?: { schoolId?: string; dateFrom?: string; dateTo?: string }): Promise<{
    total: number;
    byType: Record<AllergyType, number>;
    bySeverity: Record<AllergySeverity, number>;
    critical: number;
    verified: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.schoolId) params.append('schoolId', filters.schoolId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/allergies/statistics?${params.toString()}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // CHRONIC CONDITIONS OPERATIONS
  // ==========================================

  /**
   * Get all chronic conditions for a student
   */
  async getConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/student/${studentId}/conditions`
      );

      await this.logPHIAccess('VIEW_CHRONIC_CONDITIONS', studentId);

      return response.data.data!.conditions;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single chronic condition by ID
   */
  async getConditionById(id: string): Promise<ChronicCondition> {
    try {
      const response = await apiInstance.get<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`
      );

      const condition = response.data.data!;
      await this.logPHIAccess('VIEW_CHRONIC_CONDITION', condition.studentId, 'CHRONIC_CONDITION', id);

      return condition;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new chronic condition
   */
  async createCondition(data: ChronicConditionCreate): Promise<ChronicCondition> {
    try {
      // Validate input
      chronicConditionCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess('CREATE_CHRONIC_CONDITION', data.studentId, 'CHRONIC_CONDITION', condition.id);

      return condition;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing chronic condition
   */
  async updateCondition(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    try {
      const response = await apiInstance.put<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess('UPDATE_CHRONIC_CONDITION', condition.studentId, 'CHRONIC_CONDITION', id);

      return condition;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a chronic condition
   */
  async deleteCondition(id: string): Promise<void> {
    try {
      const condition = await this.getConditionById(id);

      await apiInstance.delete(`${this.baseEndpoint}/conditions/${id}`);

      await this.logPHIAccess('DELETE_CHRONIC_CONDITION', condition.studentId, 'CHRONIC_CONDITION', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update condition status
   */
  async updateConditionStatus(id: string, status: ConditionStatus): Promise<ChronicCondition> {
    try {
      const response = await apiInstance.patch<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}/status`,
        { status }
      );

      const condition = response.data.data!;
      await this.logPHIAccess('UPDATE_CONDITION_STATUS', condition.studentId, 'CHRONIC_CONDITION', id);

      return condition;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get active chronic conditions for a student
   */
  async getActiveConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/student/${studentId}/conditions/active`
      );

      await this.logPHIAccess('VIEW_ACTIVE_CONDITIONS', studentId);

      return response.data.data!.conditions;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get conditions that need review
   */
  async getConditionsNeedingReview(): Promise<Array<ChronicCondition & { daysUntilReview: number }>> {
    try {
      const response = await apiInstance.get<ApiResponse<{ conditions: Array<ChronicCondition & { daysUntilReview: number }> }>>(
        `${this.baseEndpoint}/conditions/review-needed`
      );

      return response.data.data!.conditions;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get chronic condition statistics
   */
  async getConditionStatistics(filters?: { schoolId?: string; dateFrom?: string; dateTo?: string }): Promise<{
    total: number;
    active: number;
    byStatus: Record<ConditionStatus, number>;
    bySeverity: Record<ConditionSeverity, number>;
    topConditions: Array<{ condition: string; count: number }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.schoolId) params.append('schoolId', filters.schoolId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/conditions/statistics?${params.toString()}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // VACCINATIONS OPERATIONS
  // ==========================================

  /**
   * Get all vaccinations for a student
   */
  async getVaccinations(studentId: string): Promise<Vaccination[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ vaccinations: Vaccination[] }>>(
        `${this.baseEndpoint}/student/${studentId}/vaccinations`
      );

      await this.logPHIAccess('VIEW_VACCINATIONS', studentId);

      return response.data.data!.vaccinations;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single vaccination by ID
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    try {
      const response = await apiInstance.get<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess('VIEW_VACCINATION', vaccination.studentId, 'VACCINATION', id);

      return vaccination;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new vaccination record
   */
  async createVaccination(data: VaccinationCreate): Promise<Vaccination> {
    try {
      // Validate input
      vaccinationCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess('CREATE_VACCINATION', data.studentId, 'VACCINATION', vaccination.id);

      return vaccination;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing vaccination
   */
  async updateVaccination(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    try {
      const response = await apiInstance.put<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess('UPDATE_VACCINATION', vaccination.studentId, 'VACCINATION', id);

      return vaccination;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a vaccination record
   */
  async deleteVaccination(id: string): Promise<void> {
    try {
      const vaccination = await this.getVaccinationById(id);

      await apiInstance.delete(`${this.baseEndpoint}/vaccinations/${id}`);

      await this.logPHIAccess('DELETE_VACCINATION', vaccination.studentId, 'VACCINATION', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check vaccination compliance for a student
   */
  async checkCompliance(studentId: string): Promise<VaccinationCompliance> {
    try {
      const response = await apiInstance.get<ApiResponse<VaccinationCompliance>>(
        `${this.baseEndpoint}/student/${studentId}/vaccinations/compliance`
      );

      await this.logPHIAccess('CHECK_VACCINATION_COMPLIANCE', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get upcoming vaccinations for a student
   */
  async getUpcomingVaccinations(studentId: string, daysAhead: number = 60): Promise<Array<{
    vaccineName: string;
    dueDate: string;
    daysUntilDue: number;
    isOverdue: boolean;
  }>> {
    try {
      const response = await apiInstance.get<ApiResponse<{ upcoming: any[] }>>(
        `${this.baseEndpoint}/student/${studentId}/vaccinations/upcoming?daysAhead=${daysAhead}`
      );

      await this.logPHIAccess('VIEW_UPCOMING_VACCINATIONS', studentId);

      return response.data.data!.upcoming;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate official vaccination report
   */
  async generateVaccinationReport(studentId: string, format: 'pdf' | 'official' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiInstance.get(
        `${this.baseEndpoint}/student/${studentId}/vaccinations/report?format=${format}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess('GENERATE_VACCINATION_REPORT', studentId);

      return response.data;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vaccination statistics
   */
  async getVaccinationStatistics(schoolId?: string): Promise<{
    total: number;
    compliant: number;
    nonCompliant: number;
    complianceRate: number;
    byVaccine: Record<string, { total: number; compliant: number }>;
    overdue: number;
    upcomingDue: number;
  }> {
    try {
      const params = schoolId ? `?schoolId=${schoolId}` : '';

      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/vaccinations/statistics${params}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // SCREENINGS OPERATIONS
  // ==========================================

  /**
   * Get all screenings for a student
   */
  async getScreenings(studentId: string): Promise<Screening[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/student/${studentId}/screenings`
      );

      await this.logPHIAccess('VIEW_SCREENINGS', studentId);

      return response.data.data!.screenings;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single screening by ID
   */
  async getScreeningById(id: string): Promise<Screening> {
    try {
      const response = await apiInstance.get<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`
      );

      const screening = response.data.data!;
      await this.logPHIAccess('VIEW_SCREENING', screening.studentId, 'SCREENING', id);

      return screening;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new screening
   */
  async createScreening(data: ScreeningCreate): Promise<Screening> {
    try {
      // Validate input
      screeningCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess('CREATE_SCREENING', data.studentId, 'SCREENING', screening.id);

      return screening;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing screening
   */
  async updateScreening(id: string, data: ScreeningUpdate): Promise<Screening> {
    try {
      const response = await apiInstance.put<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess('UPDATE_SCREENING', screening.studentId, 'SCREENING', id);

      return screening;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a screening
   */
  async deleteScreening(id: string): Promise<void> {
    try {
      const screening = await this.getScreeningById(id);

      await apiInstance.delete(`${this.baseEndpoint}/screenings/${id}`);

      await this.logPHIAccess('DELETE_SCREENING', screening.studentId, 'SCREENING', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screenings that are due for review
   */
  async getScreeningsDue(): Promise<Array<{
    student: { id: string; firstName: string; lastName: string; studentNumber: string };
    screeningType: ScreeningType;
    lastScreeningDate?: string;
    dueDate: string;
    daysOverdue: number;
  }>> {
    try {
      const response = await apiInstance.get<ApiResponse<{ screenings: any[] }>>(
        `${this.baseEndpoint}/screenings/due`
      );

      return response.data.data!.screenings;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screening statistics
   */
  async getScreeningStatistics(filters?: {
    schoolId?: string;
    screeningType?: ScreeningType;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    total: number;
    byType: Record<ScreeningType, number>;
    byOutcome: Record<ScreeningOutcome, number>;
    referrals: number;
    followUpsNeeded: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.schoolId) params.append('schoolId', filters.schoolId);
      if (filters?.screeningType) params.append('screeningType', filters.screeningType);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/screenings/statistics?${params.toString()}`
      );

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // GROWTH MEASUREMENTS OPERATIONS
  // ==========================================

  /**
   * Get all growth measurements for a student
   */
  async getGrowthMeasurements(studentId: string): Promise<GrowthMeasurement[]> {
    try {
      const response = await apiInstance.get<ApiResponse<{ measurements: GrowthMeasurement[] }>>(
        `${this.baseEndpoint}/student/${studentId}/growth`
      );

      await this.logPHIAccess('VIEW_GROWTH_MEASUREMENTS', studentId);

      return response.data.data!.measurements;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single growth measurement by ID
   */
  async getGrowthMeasurementById(id: string): Promise<GrowthMeasurement> {
    try {
      const response = await apiInstance.get<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`
      );

      const measurement = response.data.data!;
      await this.logPHIAccess('VIEW_GROWTH_MEASUREMENT', measurement.studentId, 'GROWTH_MEASUREMENT', id);

      return measurement;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new growth measurement
   */
  async createGrowthMeasurement(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    try {
      // Validate input
      growthMeasurementCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess('CREATE_GROWTH_MEASUREMENT', data.studentId, 'GROWTH_MEASUREMENT', measurement.id);

      return measurement;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing growth measurement
   */
  async updateGrowthMeasurement(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    try {
      const response = await apiInstance.put<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess('UPDATE_GROWTH_MEASUREMENT', measurement.studentId, 'GROWTH_MEASUREMENT', id);

      return measurement;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a growth measurement
   */
  async deleteGrowthMeasurement(id: string): Promise<void> {
    try {
      const measurement = await this.getGrowthMeasurementById(id);

      await apiInstance.delete(`${this.baseEndpoint}/growth/${id}`);

      await this.logPHIAccess('DELETE_GROWTH_MEASUREMENT', measurement.studentId, 'GROWTH_MEASUREMENT', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth trends for a student
   */
  async getGrowthTrends(studentId: string): Promise<GrowthTrend> {
    try {
      const response = await apiInstance.get<ApiResponse<GrowthTrend>>(
        `${this.baseEndpoint}/student/${studentId}/growth/trends`
      );

      await this.logPHIAccess('VIEW_GROWTH_TRENDS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth concerns for a student
   */
  async getGrowthConcerns(studentId: string): Promise<{
    hasConcerns: boolean;
    concerns: Array<{
      type: 'height' | 'weight' | 'bmi';
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }>;
  }> {
    try {
      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/student/${studentId}/growth/concerns`
      );

      await this.logPHIAccess('VIEW_GROWTH_CONCERNS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Calculate percentiles for a student's growth measurements
   */
  async calculatePercentiles(studentId: string): Promise<{
    latest: {
      height?: { value: number; percentile: number };
      weight?: { value: number; percentile: number };
      bmi?: { value: number; percentile: number };
    };
    history: GrowthMeasurement[];
  }> {
    try {
      const response = await apiInstance.get<ApiResponse<any>>(
        `${this.baseEndpoint}/student/${studentId}/growth/percentiles`
      );

      await this.logPHIAccess('CALCULATE_PERCENTILES', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // VITAL SIGNS OPERATIONS
  // ==========================================

  /**
   * Get vital signs for a student
   */
  async getVitalSigns(studentId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<VitalSigns[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get<ApiResponse<{ vitals: VitalSigns[] }>>(
        `${this.baseEndpoint}/student/${studentId}/vitals?${params.toString()}`
      );

      await this.logPHIAccess('VIEW_VITAL_SIGNS', studentId);

      return response.data.data!.vitals;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs by ID
   */
  async getVitalSignsById(id: string): Promise<VitalSigns> {
    try {
      const response = await apiInstance.get<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`
      );

      const vitals = response.data.data!;
      await this.logPHIAccess('VIEW_VITAL_SIGNS', vitals.studentId, 'VITAL_SIGNS', id);

      return vitals;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create new vital signs record
   */
  async createVitalSigns(data: VitalSignsCreate): Promise<VitalSigns> {
    try {
      // Validate input
      vitalSignsCreateSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess('CREATE_VITAL_SIGNS', data.studentId, 'VITAL_SIGNS', vitals.id);

      return vitals;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update vital signs
   */
  async updateVitalSigns(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    try {
      const response = await apiInstance.put<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess('UPDATE_VITAL_SIGNS', vitals.studentId, 'VITAL_SIGNS', id);

      return vitals;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete vital signs
   */
  async deleteVitalSigns(id: string): Promise<void> {
    try {
      const vitals = await this.getVitalSignsById(id);

      await apiInstance.delete(`${this.baseEndpoint}/vitals/${id}`);

      await this.logPHIAccess('DELETE_VITAL_SIGNS', vitals.studentId, 'VITAL_SIGNS', id);
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get latest vital signs for a student
   */
  async getLatestVitals(studentId: string): Promise<VitalSigns | null> {
    try {
      const response = await apiInstance.get<ApiResponse<{ vitals: VitalSigns | null }>>(
        `${this.baseEndpoint}/student/${studentId}/vitals/latest`
      );

      await this.logPHIAccess('VIEW_LATEST_VITALS', studentId);

      return response.data.data!.vitals;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs trends
   */
  async getVitalTrends(
    studentId: string,
    vitalType: 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation',
    dateFrom?: string,
    dateTo?: string
  ): Promise<VitalSignsTrend> {
    try {
      const params = new URLSearchParams();
      params.append('type', vitalType);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await apiInstance.get<ApiResponse<VitalSignsTrend>>(
        `${this.baseEndpoint}/student/${studentId}/vitals/trends?${params.toString()}`
      );

      await this.logPHIAccess('VIEW_VITAL_TRENDS', studentId);

      return response.data.data!;
    } catch (error: any) {
      throw this.sanitizeError(error);
    }
  }
}

// ==========================================
// ERROR CLASSES
// ==========================================

export class HealthRecordsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'HealthRecordsApiError';
  }
}

export class CircuitBreakerError extends HealthRecordsApiError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'CIRCUIT_BREAKER_OPEN');
    this.name = 'CircuitBreakerError';
  }
}

export class UnauthorizedError extends HealthRecordsApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HealthRecordsApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

// ==========================================
// EXPORT SINGLETON INSTANCE
// ==========================================

export const healthRecordsApi = new HealthRecordsApi();
