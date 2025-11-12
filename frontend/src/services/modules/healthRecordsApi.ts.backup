/**
 * Complete Enterprise-Grade Health Records API Client
 *
 * Comprehensive management of student health records with 100% backend coverage:
 * - Main health records operations
 * - Allergies management with safety checks
 * - Chronic conditions tracking with care plans
 * - Vaccinations and compliance tracking
 * - Health screenings management
 * - Growth measurements and trends
 * - Vital signs tracking and alerts
 * - Bulk import/export operations
 * - PHI access logging and security (HIPAA compliant)
 *
 * @module services/modules/healthRecordsApi
 */

import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types';
import { auditService, AuditAction, AuditResourceType } from '../audit';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS - MAIN HEALTH RECORDS
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - ALLERGIES
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - CHRONIC CONDITIONS
// ==========================================

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
  emergencyProtocol?: string;
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
  emergencyProtocol?: string;
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
  emergencyProtocol?: string;
  isActive?: boolean;
}

export interface CarePlanUpdate {
  carePlan: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  emergencyProtocol?: string;
  nextReviewDate?: string;
}

// ==========================================
// TYPE DEFINITIONS - VACCINATIONS
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - SCREENINGS
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - GROWTH MEASUREMENTS
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - VITAL SIGNS
// ==========================================

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
    systolic?: number;
    diastolic?: number;
  }>;
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  alerts: string[];
}

// ==========================================
// TYPE DEFINITIONS - HEALTH SUMMARY
// ==========================================

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

// ==========================================
// TYPE DEFINITIONS - BULK IMPORT
// ==========================================

export interface BulkImportRequest {
  records: HealthRecordCreate[];
  validateOnly?: boolean;
  continueOnError?: boolean;
}

export interface BulkImportResult {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    record: HealthRecordCreate;
    error: string;
    field?: string;
  }>;
  warnings: Array<{
    index: number;
    record: HealthRecordCreate;
    warning: string;
  }>;
  imported: HealthRecord[];
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const healthRecordCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required').max(5000),
  diagnosis: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  provider: z.string().max(255).optional(),
  providerNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional().or(z.literal('')),
  location: z.string().max(255).optional(),
  notes: z.string().max(10000).optional(),
  attachments: z.array(z.string()).optional(),
  isConfidential: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
});

const allergyCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  allergen: z.string().min(1, 'Allergen is required').max(255),
  allergyType: z.nativeEnum(AllergyType),
  severity: z.nativeEnum(AllergySeverity),
  reaction: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).optional(),
  treatment: z.string().max(1000).optional(),
  onsetDate: z.string().optional(),
  diagnosedBy: z.string().max(255).optional(),
  verified: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

const chronicConditionCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  condition: z.string().min(1, 'Condition is required').max(255),
  icdCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format').optional().or(z.literal('')),
  diagnosedDate: z.string().min(1, 'Diagnosed date is required'),
  status: z.nativeEnum(ConditionStatus),
  severity: z.nativeEnum(ConditionSeverity),
  notes: z.string().max(2000).optional(),
  carePlan: z.string().max(10000).optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  diagnosedBy: z.string().max(255).optional(),
  nextReviewDate: z.string().optional(),
  emergencyProtocol: z.string().max(5000).optional(),
});

const carePlanUpdateSchema = z.object({
  carePlan: z.string().min(1, 'Care plan is required').max(10000),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  emergencyProtocol: z.string().max(5000).optional(),
  nextReviewDate: z.string().optional(),
});

const vaccinationCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineName: z.string().min(1, 'Vaccine name is required').max(255),
  vaccineType: z.string().min(1, 'Vaccine type is required').max(100),
  cvxCode: z.string().max(10).optional(),
  doseNumber: z.number().int().min(1).optional(),
  totalDoses: z.number().int().min(1).optional(),
  administeredDate: z.string().min(1, 'Administered date is required'),
  expirationDate: z.string().optional(),
  lotNumber: z.string().max(50).optional(),
  manufacturer: z.string().max(255).optional(),
  administeredBy: z.string().max(255).optional(),
  administeredByNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional().or(z.literal('')),
  site: z.string().max(50).optional(),
  route: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  status: z.nativeEnum(VaccinationStatus).optional(),
  reactions: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  nextDueDate: z.string().optional(),
});

const screeningCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  screeningType: z.nativeEnum(ScreeningType),
  screeningDate: z.string().min(1, 'Screening date is required'),
  performedBy: z.string().min(1, 'Performed by is required').max(255),
  outcome: z.nativeEnum(ScreeningOutcome),
  results: z.string().max(5000).optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().max(255).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const growthMeasurementCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  measurementDate: z.string().min(1, 'Measurement date is required'),
  height: z.number().positive('Height must be positive').max(300, 'Height seems unrealistic').optional(),
  weight: z.number().positive('Weight must be positive').max(500, 'Weight seems unrealistic').optional(),
  headCircumference: z.number().positive().max(100, 'Head circumference seems unrealistic').optional(),
  measuredBy: z.string().min(1, 'Measured by is required').max(255),
  notes: z.string().max(2000).optional(),
});

const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recordDate: z.string().min(1, 'Record date is required'),
  temperature: z.number().min(35, 'Temperature too low').max(42, 'Temperature too high').optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().int().min(50, 'BP systolic too low').max(250, 'BP systolic too high').optional(),
  bloodPressureDiastolic: z.number().int().min(30, 'BP diastolic too low').max(150, 'BP diastolic too high').optional(),
  heartRate: z.number().int().min(30, 'Heart rate too low').max(250, 'Heart rate too high').optional(),
  respiratoryRate: z.number().int().min(8, 'Respiratory rate too low').max(60, 'Respiratory rate too high').optional(),
  oxygenSaturation: z.number().min(0).max(100, 'O2 saturation must be 0-100%').optional(),
  pain: z.number().int().min(0).max(10, 'Pain scale is 0-10').optional(),
  glucose: z.number().min(0).max(600, 'Glucose level seems unrealistic').optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
  recordedBy: z.string().min(1, 'Recorded by is required').max(255),
});

const bulkImportSchema = z.object({
  records: z.array(healthRecordCreateSchema).min(1, 'At least one record is required').max(1000, 'Maximum 1000 records per bulk import'),
  validateOnly: z.boolean().optional(),
  continueOnError: z.boolean().optional(),
});

// ==========================================
// API CLIENT CLASS
// ==========================================

export class HealthRecordsApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(private readonly client: ApiClient) {}

  /**
   * Log PHI access for HIPAA compliance
   */
  private async logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> {
    try {
      await auditService.logPHIAccess(action, studentId, resourceType, resourceId);
    } catch (error) {
      // Never fail main operation due to audit logging
      console.error('Failed to log PHI access:', error);
    }
  }

  /**
   * Sanitize error messages to prevent PHI exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'An error occurred');
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

      const response = await this.client.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single health record by ID
   */
  async getRecordById(id: string): Promise<HealthRecord> {
    try {
      const response = await this.client.get<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);

      return record;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new health record
   */
  async createRecord(data: HealthRecordCreate): Promise<HealthRecord> {
    try {
      healthRecordCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<HealthRecord>>(
        this.baseEndpoint,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_HEALTH_RECORD, data.studentId, AuditResourceType.HEALTH_RECORD, record.id);

      return record;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing health record
   */
  async updateRecord(id: string, data: HealthRecordUpdate): Promise<HealthRecord> {
    try {
      const response = await this.client.put<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);

      return record;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a health record (soft delete)
   */
  async deleteRecord(id: string): Promise<void> {
    try {
      const record = await this.getRecordById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get comprehensive health summary for a student
   */
  async getSummary(studentId: string): Promise<HealthSummary> {
    try {
      const response = await this.client.get<ApiResponse<HealthSummary>>(
        `${this.baseEndpoint}/${studentId}/summary`
      );

      await this.logPHIAccess(AuditAction.VIEW_HEALTH_SUMMARY, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data.data!;
    } catch (error) {
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

      const response = await this.client.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/search?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Export health records for a student
   */
  async exportRecords(studentId: string, format: 'pdf' | 'json' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/export?format=${format}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk import health records with comprehensive validation
   */
  async bulkImportRecords(data: BulkImportRequest): Promise<BulkImportResult> {
    try {
      bulkImportSchema.parse(data);

      const response = await this.client.post<ApiResponse<BulkImportResult>>(
        `${this.baseEndpoint}/bulk-import`,
        data
      );

      const result = response.data.data!;

      // Log PHI access for each unique student
      const uniqueStudentIds = [...new Set(data.records.map(r => r.studentId))];
      await Promise.all(
        uniqueStudentIds.map(studentId =>
          this.logPHIAccess(AuditAction.IMPORT_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD)
        )
      );

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
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
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/allergies/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single allergy by ID
   */
  async getAllergyById(id: string): Promise<Allergy> {
    try {
      const response = await this.client.get<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new allergy record
   */
  async createAllergy(data: AllergyCreate): Promise<Allergy> {
    try {
      allergyCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_ALLERGY, data.studentId, AuditResourceType.ALLERGY, allergy.id);

      return allergy;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing allergy
   */
  async updateAllergy(id: string, data: AllergyUpdate): Promise<Allergy> {
    try {
      const response = await this.client.put<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    try {
      const allergy = await this.getAllergyById(id);
      await this.client.delete(`${this.baseEndpoint}/allergies/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get critical/life-threatening allergies for a student
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/allergies/student/${studentId}/critical`
      );

      await this.logPHIAccess(AuditAction.VIEW_CRITICAL_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
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
      const response = await this.client.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/conditions/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITIONS, studentId, AuditResourceType.CHRONIC_CONDITION);

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single chronic condition by ID
   */
  async getConditionById(id: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.get<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new chronic condition
   */
  async createCondition(data: ChronicConditionCreate): Promise<ChronicCondition> {
    try {
      chronicConditionCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_CHRONIC_CONDITION, data.studentId, AuditResourceType.CHRONIC_CONDITION, condition.id);

      return condition;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing chronic condition
   */
  async updateCondition(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    try {
      const response = await this.client.put<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update care plan for a chronic condition
   */
  async updateCarePlan(id: string, carePlan: CarePlanUpdate): Promise<ChronicCondition> {
    try {
      carePlanUpdateSchema.parse(carePlan);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}/care-plan`,
        carePlan
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CARE_PLAN, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a chronic condition
   */
  async deleteCondition(id: string): Promise<void> {
    try {
      const condition = await this.getConditionById(id);
      await this.client.delete(`${this.baseEndpoint}/conditions/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);
    } catch (error) {
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
      const response = await this.client.get<ApiResponse<{ vaccinations: Vaccination[] }>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.vaccinations;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single vaccination by ID
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    try {
      const response = await this.client.get<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new vaccination record
   */
  async createVaccination(data: VaccinationCreate): Promise<Vaccination> {
    try {
      vaccinationCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VACCINATION, data.studentId, AuditResourceType.VACCINATION, vaccination.id);

      return vaccination;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing vaccination
   */
  async updateVaccination(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    try {
      const response = await this.client.put<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a vaccination record
   */
  async deleteVaccination(id: string): Promise<void> {
    try {
      const vaccination = await this.getVaccinationById(id);
      await this.client.delete(`${this.baseEndpoint}/vaccinations/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check vaccination compliance for a student
   */
  async checkCompliance(studentId: string): Promise<VaccinationCompliance> {
    try {
      const response = await this.client.get<ApiResponse<VaccinationCompliance>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}/compliance`
      );

      await this.logPHIAccess(AuditAction.CHECK_VACCINATION_COMPLIANCE, studentId, AuditResourceType.VACCINATION);

      return response.data.data!;
    } catch (error) {
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
      const response = await this.client.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/screenings/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single screening by ID
   */
  async getScreeningById(id: string): Promise<Screening> {
    try {
      const response = await this.client.get<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new screening
   */
  async createScreening(data: ScreeningCreate): Promise<Screening> {
    try {
      screeningCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_SCREENING, data.studentId, AuditResourceType.SCREENING, screening.id);

      return screening;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing screening
   */
  async updateScreening(id: string, data: ScreeningUpdate): Promise<Screening> {
    try {
      const response = await this.client.put<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a screening
   */
  async deleteScreening(id: string): Promise<void> {
    try {
      const screening = await this.getScreeningById(id);
      await this.client.delete(`${this.baseEndpoint}/screenings/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);
    } catch (error) {
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
      const response = await this.client.get<ApiResponse<{ screenings: Array<{
        student: { id: string; firstName: string; lastName: string; studentNumber: string };
        screeningType: ScreeningType;
        lastScreeningDate?: string;
        dueDate: string;
        daysOverdue: number;
      }> }>>(
        `${this.baseEndpoint}/screenings/due`
      );

      return response.data.data!.screenings;
    } catch (error) {
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
      const response = await this.client.get<ApiResponse<{ measurements: GrowthMeasurement[] }>>(
        `${this.baseEndpoint}/growth/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!.measurements;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single growth measurement by ID
   */
  async getGrowthMeasurementById(id: string): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.get<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);

      return measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new growth measurement
   */
  async createGrowthMeasurement(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_GROWTH_MEASUREMENT, data.studentId, AuditResourceType.GROWTH_MEASUREMENT, measurement.id);

      return measurement;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing growth measurement
   */
  async updateGrowthMeasurement(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.put<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);

      return measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a growth measurement
   */
  async deleteGrowthMeasurement(id: string): Promise<void> {
    try {
      const measurement = await this.getGrowthMeasurementById(id);
      await this.client.delete(`${this.baseEndpoint}/growth/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth trends for a student
   */
  async getGrowthTrends(studentId: string): Promise<GrowthTrend> {
    try {
      const response = await this.client.get<ApiResponse<GrowthTrend>>(
        `${this.baseEndpoint}/growth/student/${studentId}/trends`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_TRENDS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!;
    } catch (error) {
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

      const response = await this.client.get<ApiResponse<{ vitals: VitalSigns[] }>>(
        `${this.baseEndpoint}/vitals/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!.vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs by ID
   */
  async getVitalSignsById(id: string): Promise<VitalSigns> {
    try {
      const response = await this.client.get<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create new vital signs record
   */
  async createVitalSigns(data: VitalSignsCreate): Promise<VitalSigns> {
    try {
      vitalSignsCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VITAL_SIGNS, data.studentId, AuditResourceType.VITAL_SIGNS, vitals.id);

      return vitals;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update vital signs
   */
  async updateVitalSigns(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    try {
      const response = await this.client.put<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete vital signs
   */
  async deleteVitalSigns(id: string): Promise<void> {
    try {
      const vitals = await this.getVitalSignsById(id);
      await this.client.delete(`${this.baseEndpoint}/vitals/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);
    } catch (error) {
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

      const response = await this.client.get<ApiResponse<VitalSignsTrend>>(
        `${this.baseEndpoint}/vitals/student/${studentId}/trends?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_TRENDS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

export function createHealthRecordsApi(client: ApiClient): HealthRecordsApi {
  return new HealthRecordsApi(client);
}

/**
 * Singleton instance of HealthRecordsApi
 * Pre-configured with the default apiClient
 */
export const healthRecordsApi = createHealthRecordsApi(apiClient);

// Type aliases for backward compatibility
export type VaccinationRecord = Vaccination;
export type CreateHealthRecordRequest = HealthRecordCreate;
export type CreateAllergyRequest = AllergyCreate;
export type CreateChronicConditionRequest = ChronicConditionCreate;
export type CreateVaccinationRequest = VaccinationCreate;
