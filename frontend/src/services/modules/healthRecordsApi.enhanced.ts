/**
 * Enhanced Health Records API Service
 *
 * SOA-compliant service layer with:
 * - Type-safe API integration
 * - Request/response validation with Zod
 * - Comprehensive error handling
 * - Audit logging for HIPAA compliance
 * - Circuit breaker awareness
 * - Retry strategies
 *
 * @module healthRecordsApi.enhanced
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { z } from 'zod';
import { AxiosError } from 'axios';

// ============================================================================
// Type Definitions & Validation Schemas
// ============================================================================

// Core Types
export interface HealthRecord {
  id: string;
  studentId: string;
  type: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'VISION' | 'HEARING' | 'PHYSICAL_EXAM';
  title: string;
  description: string;
  provider: string;
  date: string;
  vitals?: VitalSigns;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface VitalSigns {
  height?: string;
  weight?: string;
  bloodPressure?: string;
  pulse?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  dateIdentified?: string;
  providerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  status: 'ACTIVE' | 'MANAGED' | 'RESOLVED';
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  diagnosedDate?: string;
  carePlan?: string;
  nextReview?: string;
  medications?: string[];
  restrictions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  manufacturer?: string;
  lotNumber?: string;
  dateAdministered?: string;
  administeredBy?: string;
  dose?: string;
  site?: string;
  route?: string;
  dueDate?: string;
  nextDueDate?: string;
  compliant: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthMeasurement {
  id: string;
  studentId: string;
  date: string;
  height: string;
  weight: string;
  bmi: string;
  headCircumference?: string;
  percentiles?: {
    height: number;
    weight: number;
    bmi: number;
  };
  notes?: string;
  createdAt: string;
}

export interface Screening {
  id: string;
  studentId: string;
  type: 'VISION' | 'HEARING' | 'SCOLIOSIS' | 'DENTAL' | 'DEVELOPMENTAL';
  date: string;
  result: 'PASS' | 'REFER' | 'RESCREEN';
  provider: string;
  details?: Record<string, any>;
  notes?: string;
  followUpRequired?: boolean;
  createdAt: string;
}

export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    grade: string;
  };
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  recentVitals?: VitalSigns;
  vaccinations: VaccinationRecord[];
  lastPhysical?: string;
  alerts: HealthAlert[];
  completeness: number;
}

export interface HealthAlert {
  id: string;
  type: 'ALLERGY' | 'CHRONIC_CONDITION' | 'VACCINATION_DUE' | 'MEDICATION' | 'SCREENING_DUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  date: string;
  acknowledged: boolean;
}

// Filter & Request Types
export interface HealthRecordFilters {
  type?: HealthRecord['type'];
  dateFrom?: string;
  dateTo?: string;
  provider?: string;
  studentId?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateHealthRecordRequest {
  studentId: string;
  type: HealthRecord['type'];
  title: string;
  description: string;
  provider: string;
  date: string;
  vitals?: VitalSigns;
}

export interface CreateAllergyRequest {
  studentId: string;
  allergen: string;
  severity: Allergy['severity'];
  reaction?: string;
  treatment?: string;
  dateIdentified?: string;
  providerName?: string;
}

export interface CreateChronicConditionRequest {
  studentId: string;
  condition: string;
  status: ChronicCondition['status'];
  severity: ChronicCondition['severity'];
  diagnosedDate?: string;
  carePlan?: string;
  nextReview?: string;
}

export interface CreateVaccinationRequest {
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  manufacturer?: string;
  lotNumber?: string;
  dateAdministered?: string;
  administeredBy?: string;
  dose?: string;
  site?: string;
  route?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Validation Schemas
// ============================================================================

const vitalSignsSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodPressure: z.string().optional(),
  pulse: z.string().optional(),
  temperature: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
});

const createHealthRecordSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  type: z.enum(['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'VISION', 'HEARING', 'PHYSICAL_EXAM']),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  provider: z.string().min(1, 'Provider name is required'),
  date: z.string().min(1, 'Date is required'),
  vitals: vitalSignsSchema.optional(),
});

const createAllergySchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  allergen: z.string().min(1, 'Allergen is required'),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  reaction: z.string().optional(),
  treatment: z.string().optional(),
  dateIdentified: z.string().optional(),
  providerName: z.string().optional(),
});

const createChronicConditionSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  condition: z.string().min(1, 'Condition is required'),
  status: z.enum(['ACTIVE', 'MANAGED', 'RESOLVED']),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  diagnosedDate: z.string().optional(),
  carePlan: z.string().optional(),
  nextReview: z.string().optional(),
});

const createVaccinationSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  vaccineType: z.string().min(1, 'Vaccine type is required'),
  manufacturer: z.string().optional(),
  lotNumber: z.string().optional(),
  dateAdministered: z.string().optional(),
  administeredBy: z.string().optional(),
  dose: z.string().optional(),
  site: z.string().optional(),
  route: z.string().optional(),
});

// ============================================================================
// Custom Error Classes
// ============================================================================

export class HealthRecordsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HealthRecordsApiError';
  }
}

export class ValidationError extends HealthRecordsApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
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

export class NotFoundError extends HealthRecordsApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class CircuitBreakerError extends HealthRecordsApiError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'CIRCUIT_BREAKER_OPEN');
    this.name = 'CircuitBreakerError';
  }
}

// ============================================================================
// Error Handler
// ============================================================================

function handleApiError(error: unknown, context: string): never {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    throw new ValidationError(
      firstError.message,
      error.errors
    );
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const code = error.response?.data?.code;

    switch (status) {
      case 401:
        throw new UnauthorizedError(message);
      case 403:
        throw new ForbiddenError(message);
      case 404:
        throw new NotFoundError(context);
      case 503:
        throw new CircuitBreakerError(message);
      default:
        throw new HealthRecordsApiError(
          message || `Failed to ${context}`,
          status,
          code,
          error.response?.data
        );
    }
  }

  if (error instanceof Error) {
    throw new HealthRecordsApiError(error.message);
  }

  throw new HealthRecordsApiError(`Unknown error during ${context}`);
}

// ============================================================================
// Utility Functions
// ============================================================================

function buildQueryParams(params: Record<string, any>): URLSearchParams {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  return queryParams;
}

function extractResponseData<T>(response: any): T {
  // Handle different response formats
  if (response.data?.data !== undefined) {
    return response.data.data;
  }
  if (response.data !== undefined) {
    return response.data;
  }
  return response;
}

// ============================================================================
// Health Records API Service Class
// ============================================================================

export class HealthRecordsApiService {
  private auditLog(action: string, studentId: string, details?: any): void {
    // Log PHI access for HIPAA compliance
    apiInstance.post('/audit/access-log', {
      action,
      studentId,
      resourceType: 'HEALTH_RECORD',
      timestamp: new Date().toISOString(),
      details,
    }).catch(err => {
      console.error('Failed to log audit event:', err);
    });
  }

  // ========================================
  // Health Records
  // ========================================

  async getStudentHealthRecords(
    studentId: string,
    filters: HealthRecordFilters = {}
  ): Promise<HealthRecord[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const queryParams = buildQueryParams({
        ...filters,
        studentId,
      });

      const response = await apiInstance.get<ApiResponse<HealthRecord[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/student/${studentId}?${queryParams.toString()}`
      );

      this.auditLog('VIEW_HEALTH_RECORDS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get student health records');
    }
  }

  async getHealthRecordById(id: string): Promise<HealthRecord> {
    try {
      if (!id) {
        throw new ValidationError('Health record ID is required');
      }

      const response = await apiInstance.get<ApiResponse<HealthRecord>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/${id}`
      );

      const record = extractResponseData<HealthRecord>(response);
      this.auditLog('VIEW_HEALTH_RECORD', record.studentId, { recordId: id });

      return record;
    } catch (error) {
      throw handleApiError(error, 'get health record');
    }
  }

  async createHealthRecord(data: CreateHealthRecordRequest): Promise<HealthRecord> {
    try {
      const validated = createHealthRecordSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<HealthRecord>>(
        API_ENDPOINTS.HEALTH_RECORDS,
        validated
      );

      const record = extractResponseData<HealthRecord>(response);
      this.auditLog('CREATE_HEALTH_RECORD', data.studentId, { recordId: record.id });

      return record;
    } catch (error) {
      throw handleApiError(error, 'create health record');
    }
  }

  async updateHealthRecord(
    id: string,
    data: Partial<CreateHealthRecordRequest>
  ): Promise<HealthRecord> {
    try {
      if (!id) {
        throw new ValidationError('Health record ID is required');
      }

      const response = await apiInstance.put<ApiResponse<HealthRecord>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/${id}`,
        data
      );

      const record = extractResponseData<HealthRecord>(response);
      this.auditLog('UPDATE_HEALTH_RECORD', record.studentId, { recordId: id });

      return record;
    } catch (error) {
      throw handleApiError(error, 'update health record');
    }
  }

  async deleteHealthRecord(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Health record ID is required');
      }

      // Get record first to log student ID
      const record = await this.getHealthRecordById(id);

      await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/${id}`);

      this.auditLog('DELETE_HEALTH_RECORD', record.studentId, { recordId: id });
    } catch (error) {
      throw handleApiError(error, 'delete health record');
    }
  }

  // ========================================
  // Allergies
  // ========================================

  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<Allergy[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${studentId}`
      );

      this.auditLog('VIEW_ALLERGIES', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get student allergies');
    }
  }

  async createAllergy(data: CreateAllergyRequest): Promise<Allergy> {
    try {
      const validated = createAllergySchema.parse(data);

      const response = await apiInstance.post<ApiResponse<Allergy>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/allergies`,
        validated
      );

      const allergy = extractResponseData<Allergy>(response);
      this.auditLog('CREATE_ALLERGY', data.studentId, { allergyId: allergy.id });

      return allergy;
    } catch (error) {
      throw handleApiError(error, 'create allergy');
    }
  }

  async updateAllergy(id: string, data: Partial<CreateAllergyRequest>): Promise<Allergy> {
    try {
      if (!id) {
        throw new ValidationError('Allergy ID is required');
      }

      const response = await apiInstance.put<ApiResponse<Allergy>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}`,
        data
      );

      const allergy = extractResponseData<Allergy>(response);
      this.auditLog('UPDATE_ALLERGY', allergy.studentId, { allergyId: id });

      return allergy;
    } catch (error) {
      throw handleApiError(error, 'update allergy');
    }
  }

  async deleteAllergy(id: string, studentId: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Allergy ID is required');
      }

      await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}`);

      this.auditLog('DELETE_ALLERGY', studentId, { allergyId: id });
    } catch (error) {
      throw handleApiError(error, 'delete allergy');
    }
  }

  async verifyAllergy(id: string, verifiedBy: string): Promise<Allergy> {
    try {
      if (!id || !verifiedBy) {
        throw new ValidationError('Allergy ID and verifier are required');
      }

      const response = await apiInstance.post<ApiResponse<Allergy>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}/verify`,
        { verifiedBy }
      );

      const allergy = extractResponseData<Allergy>(response);
      this.auditLog('VERIFY_ALLERGY', allergy.studentId, { allergyId: id, verifiedBy });

      return allergy;
    } catch (error) {
      throw handleApiError(error, 'verify allergy');
    }
  }

  // ========================================
  // Chronic Conditions
  // ========================================

  async getStudentChronicConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<ChronicCondition[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${studentId}`
      );

      this.auditLog('VIEW_CHRONIC_CONDITIONS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get student chronic conditions');
    }
  }

  async createChronicCondition(data: CreateChronicConditionRequest): Promise<ChronicCondition> {
    try {
      const validated = createChronicConditionSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<ChronicCondition>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions`,
        validated
      );

      const condition = extractResponseData<ChronicCondition>(response);
      this.auditLog('CREATE_CHRONIC_CONDITION', data.studentId, { conditionId: condition.id });

      return condition;
    } catch (error) {
      throw handleApiError(error, 'create chronic condition');
    }
  }

  async updateChronicCondition(
    id: string,
    data: Partial<CreateChronicConditionRequest>
  ): Promise<ChronicCondition> {
    try {
      if (!id) {
        throw new ValidationError('Chronic condition ID is required');
      }

      const response = await apiInstance.put<ApiResponse<ChronicCondition>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${id}`,
        data
      );

      const condition = extractResponseData<ChronicCondition>(response);
      this.auditLog('UPDATE_CHRONIC_CONDITION', condition.studentId, { conditionId: id });

      return condition;
    } catch (error) {
      throw handleApiError(error, 'update chronic condition');
    }
  }

  async deleteChronicCondition(id: string, studentId: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Chronic condition ID is required');
      }

      await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${id}`);

      this.auditLog('DELETE_CHRONIC_CONDITION', studentId, { conditionId: id });
    } catch (error) {
      throw handleApiError(error, 'delete chronic condition');
    }
  }

  // ========================================
  // Vaccinations
  // ========================================

  async getVaccinationRecords(studentId: string): Promise<VaccinationRecord[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<VaccinationRecord[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations/${studentId}`
      );

      this.auditLog('VIEW_VACCINATIONS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get vaccination records');
    }
  }

  async createVaccinationRecord(data: CreateVaccinationRequest): Promise<VaccinationRecord> {
    try {
      const validated = createVaccinationSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<VaccinationRecord>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations`,
        validated
      );

      const vaccination = extractResponseData<VaccinationRecord>(response);
      this.auditLog('CREATE_VACCINATION', data.studentId, { vaccinationId: vaccination.id });

      return vaccination;
    } catch (error) {
      throw handleApiError(error, 'create vaccination record');
    }
  }

  async updateVaccinationRecord(
    id: string,
    data: Partial<CreateVaccinationRequest>
  ): Promise<VaccinationRecord> {
    try {
      if (!id) {
        throw new ValidationError('Vaccination record ID is required');
      }

      const response = await apiInstance.put<ApiResponse<VaccinationRecord>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations/${id}`,
        data
      );

      const vaccination = extractResponseData<VaccinationRecord>(response);
      this.auditLog('UPDATE_VACCINATION', vaccination.studentId, { vaccinationId: id });

      return vaccination;
    } catch (error) {
      throw handleApiError(error, 'update vaccination record');
    }
  }

  async deleteVaccinationRecord(id: string, studentId: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Vaccination record ID is required');
      }

      await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations/${id}`);

      this.auditLog('DELETE_VACCINATION', studentId, { vaccinationId: id });
    } catch (error) {
      throw handleApiError(error, 'delete vaccination record');
    }
  }

  // ========================================
  // Growth & Measurements
  // ========================================

  async getGrowthMeasurements(studentId: string): Promise<GrowthMeasurement[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<GrowthMeasurement[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/growth/${studentId}`
      );

      this.auditLog('VIEW_GROWTH_MEASUREMENTS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get growth measurements');
    }
  }

  async createGrowthMeasurement(
    studentId: string,
    data: Omit<GrowthMeasurement, 'id' | 'studentId' | 'createdAt'>
  ): Promise<GrowthMeasurement> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.post<ApiResponse<GrowthMeasurement>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/growth/${studentId}`,
        data
      );

      const measurement = extractResponseData<GrowthMeasurement>(response);
      this.auditLog('CREATE_GROWTH_MEASUREMENT', studentId, { measurementId: measurement.id });

      return measurement;
    } catch (error) {
      throw handleApiError(error, 'create growth measurement');
    }
  }

  // ========================================
  // Screenings
  // ========================================

  async getScreenings(studentId: string): Promise<Screening[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<Screening[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/screenings/${studentId}`
      );

      this.auditLog('VIEW_SCREENINGS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get screenings');
    }
  }

  async createScreening(
    studentId: string,
    data: Omit<Screening, 'id' | 'studentId' | 'createdAt'>
  ): Promise<Screening> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.post<ApiResponse<Screening>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/screenings/${studentId}`,
        data
      );

      const screening = extractResponseData<Screening>(response);
      this.auditLog('CREATE_SCREENING', studentId, { screeningId: screening.id });

      return screening;
    } catch (error) {
      throw handleApiError(error, 'create screening');
    }
  }

  // ========================================
  // Vitals
  // ========================================

  async getRecentVitals(studentId: string, limit: number = 10): Promise<VitalSigns[]> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const queryParams = buildQueryParams({ limit });

      const response = await apiInstance.get<ApiResponse<VitalSigns[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/vitals/${studentId}?${queryParams.toString()}`
      );

      this.auditLog('VIEW_VITALS', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get recent vitals');
    }
  }

  async recordVitals(studentId: string, vitals: VitalSigns): Promise<HealthRecord> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      vitalSignsSchema.parse(vitals);

      const response = await apiInstance.post<ApiResponse<HealthRecord>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/vitals/${studentId}`,
        vitals
      );

      const record = extractResponseData<HealthRecord>(response);
      this.auditLog('RECORD_VITALS', studentId, { recordId: record.id });

      return record;
    } catch (error) {
      throw handleApiError(error, 'record vitals');
    }
  }

  // ========================================
  // Health Summary
  // ========================================

  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get<ApiResponse<HealthSummary>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/summary/${studentId}`
      );

      this.auditLog('VIEW_HEALTH_SUMMARY', studentId);

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get health summary');
    }
  }

  // ========================================
  // Search & Reporting
  // ========================================

  async searchHealthRecords(
    query: string,
    filters: HealthRecordFilters = {}
  ): Promise<HealthRecord[]> {
    try {
      const queryParams = buildQueryParams({
        q: query,
        ...filters,
      });

      const response = await apiInstance.get<ApiResponse<HealthRecord[]>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/search?${queryParams.toString()}`
      );

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'search health records');
    }
  }

  async getAllRecords(
    pagination: PaginationParams = {},
    filters: HealthRecordFilters = {}
  ): Promise<PaginatedResponse<HealthRecord>> {
    try {
      const queryParams = buildQueryParams({
        ...pagination,
        ...filters,
      });

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}?${queryParams.toString()}`
      );

      return extractResponseData(response);
    } catch (error) {
      throw handleApiError(error, 'get all records');
    }
  }

  // ========================================
  // Import/Export
  // ========================================

  async exportHealthHistory(
    studentId: string,
    format: 'pdf' | 'json' = 'pdf'
  ): Promise<Blob> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      const response = await apiInstance.get(
        `${API_ENDPOINTS.HEALTH_RECORDS}/export/${studentId}?format=${format}`,
        { responseType: 'blob' }
      );

      this.auditLog('EXPORT_HEALTH_HISTORY', studentId, { format });

      return response.data;
    } catch (error) {
      throw handleApiError(error, 'export health history');
    }
  }

  async importHealthRecords(
    studentId: string,
    file: File
  ): Promise<{ imported: number; errors: any[] }> {
    try {
      if (!studentId) {
        throw new ValidationError('Student ID is required');
      }

      if (!file) {
        throw new ValidationError('File is required');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiInstance.post<ApiResponse<{ imported: number; errors: any[] }>>(
        `${API_ENDPOINTS.HEALTH_RECORDS}/import/${studentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = extractResponseData<{ imported: number; errors: any[] }>(response);
      this.auditLog('IMPORT_HEALTH_RECORDS', studentId, { imported: result.imported });

      return result;
    } catch (error) {
      throw handleApiError(error, 'import health records');
    }
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const healthRecordsApiService = new HealthRecordsApiService();
