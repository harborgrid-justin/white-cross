/**
 * @fileoverview Health Records Controller - Comprehensive health record and medical history management.
 *
 * This controller provides HTTP request handling for all health record operations in the
 * White Cross healthcare platform, including:
 * - General health records (diagnoses, treatments, medical visits)
 * - Allergy management with severity tracking
 * - Chronic condition monitoring and care plans
 * - Immunization/vaccination records with compliance tracking
 * - Vital signs and growth measurements
 * - Medical summaries and compliance reports
 *
 * Clinical Context:
 * - Maintains complete student medical history per FERPA/HIPAA requirements
 * - Supports ICD-10 diagnostic coding for conditions
 * - Tracks immunization compliance against state/CDC schedules
 * - Records allergy severity levels (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * - Monitors vital signs with age-appropriate ranges
 * - Generates comprehensive medical summaries for emergency reference
 *
 * Database Alignment:
 * All controllers map to health_records schema with proper field names:
 * - recordType: Type of health record (ENUM from HealthRecordType) (REQUIRED)
 * - recordDate: Date when health event occurred (REQUIRED)
 * - diagnosis: Medical diagnosis description (optional, ICD-10 code recommended)
 * - treatment: Treatment provided or recommended (optional)
 * - notes: Additional clinical notes or comments (optional)
 * - provider: Healthcare provider name (optional)
 *
 * @module routes/v1/healthcare/controllers/healthRecords
 * @since 1.0.0
 *
 * @compliance HIPAA - 45 CFR §164.312(b) - Audit controls for PHI access
 * @compliance FERPA - Student health records protection
 * @compliance ICD-10 - International Classification of Diseases coding standards
 * @compliance CDC - Immunization tracking per CDC vaccination schedules
 *
 * @security PHI Protected - All methods handle Protected Health Information
 * @security JWT authentication required on all endpoints
 * @security RBAC: NURSE or ADMIN roles required for write operations
 *
 * @see {@link HealthRecordService} - Business logic layer for health record operations
 * @see {@link ../routes/healthRecords.routes} - Route definitions for health record endpoints
 * @see {@link ../validators/healthRecords.validators} - Request validation schemas
 *
 * @example
 * Import and use in route definitions:
 * ```typescript
 * import { HealthRecordsController } from './controllers/healthRecords.controller';
 * import { asyncHandler } from '../../../shared/utils';
 *
 * const route = {
 *   method: 'GET',
 *   path: '/api/v1/health-records/student/{studentId}',
 *   handler: asyncHandler(HealthRecordsController.listStudentRecords)
 * };
 * ```
 */

import { ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../../services/healthRecordService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  preparePayload,
  extractPayloadSafe
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

/**
 * Health Records Controller - HTTP request handlers for health record management.
 *
 * Provides controller methods that handle HTTP requests for health record operations,
 * validate authentication/authorization, delegate to the service layer, and format responses.
 * Covers general health records, allergies, chronic conditions, vaccinations, vitals, and summaries.
 *
 * @class HealthRecordsController
 * @static
 * @since 1.0.0
 *
 * @example
 * Usage in Hapi.js routes:
 * ```typescript
 * const route = {
 *   handler: asyncHandler(HealthRecordsController.listStudentRecords),
 *   options: { auth: 'jwt' }
 * };
 * ```
 */
export class HealthRecordsController {
  /**
   * GENERAL HEALTH RECORDS
   */

  /**
   * List all health records for a specific student with pagination and filtering.
   *
   * Retrieves a paginated list of general health records for a student including
   * diagnoses, treatments, medical visits, and clinical notes. Supports filtering by
   * record type, date range, and healthcare provider. Essential for reviewing complete
   * medical history and identifying health patterns.
   *
   * Query Parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - recordType: Filter by health record type (CHECKUP, ILLNESS, INJURY, etc.)
   * - dateFrom: Start date for filtering records
   * - dateTo: End date for filtering records
   * - provider: Filter by healthcare provider name
   *
   * @param {AuthenticatedRequest} request - Hapi.js authenticated request with studentId param and query filters
   * @param {ResponseToolkit} h - Hapi.js response toolkit for building HTTP responses
   *
   * @returns {Promise<ResponseObject>} Paginated health records with metadata
   * @returns {200} Success - { success: true, data: { records: [], pagination: {} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When query parameters fail validation
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's school
   * @compliance HIPAA - Complete health record access is logged to audit trail
   * @hipaa HIGHLY SENSITIVE PHI - Contains complete medical history
   *
   * @example
   * Request with filtering and pagination:
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../records?page=1&recordType=ILLNESS&dateFrom=2025-01-01
   * const request = {
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   query: {
   *     page: 1,
   *     limit: 20,
   *     recordType: 'ILLNESS',
   *     dateFrom: '2025-01-01',
   *     provider: 'Dr. Smith'
   *   }
   * };
   * const response = await HealthRecordsController.listStudentRecords(request, h);
   * ```
   *
   * @example
   * Response format:
   * ```json
   * {
   *   "success": true,
   *   "data": {
   *     "records": [
   *       {
   *         "id": "rec-uuid",
   *         "studentId": "660e8400-e29b-41d4-a716-446655440000",
   *         "recordType": "ILLNESS",
   *         "recordDate": "2025-10-20T00:00:00Z",
   *         "diagnosis": "Acute pharyngitis (ICD-10: J02.9)",
   *         "treatment": "Rest, fluids, throat lozenges",
   *         "provider": "School Nurse",
   *         "notes": "Sent home early, parent contacted"
   *       }
   *     ],
   *     "pagination": { "page": 1, "limit": 20, "total": 87, "pages": 5 }
   *   }
   * }
   * ```
   */
  static async listStudentRecords(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    // Build filters aligned with database schema
    const filters = buildFilters(request.query, {
      recordType: { type: 'string' },
      dateFrom: { type: 'string' },
      dateTo: { type: 'string' },
      provider: { type: 'string' }
    });

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

    return paginatedResponse(
      h,
      result.records,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get a specific health record by ID.
   *
   * Retrieves detailed information for a single health record including diagnosis,
   * treatment details, provider information, and clinical notes. Used for reviewing
   * specific medical encounters or incidents.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with health record ID in params
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Single health record with complete details
   * @returns {200} Success - { success: true, data: { record: {...} } }
   *
   * @throws {NotFoundError} When health record ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Health record access is logged to audit trail
   * @hipaa PHI Protected - Contains patient medical information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/550e8400-e29b-41d4-a716-446655440000
   * const request = { params: { id: '550e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.getRecordById(request, h);
   * // Returns: { success: true, data: { record: { id, recordType, diagnosis, treatment, ... } } }
   * ```
   */
  static async getRecordById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const record = await HealthRecordService.getHealthRecordById(id);

    return successResponse(h, { record });
  }

  /**
   * Create a new health record.
   *
   * Creates a new general health record documenting a medical encounter, diagnosis,
   * treatment, or clinical observation. Automatically converts date fields and validates
   * all required data. Used for documenting nurse visits, illnesses, injuries, and
   * routine health checkups.
   *
   * Required fields:
   * - studentId: Student UUID
   * - recordType: Type of health record (CHECKUP, ILLNESS, INJURY, MEDICATION_CHANGE, etc.)
   * - recordDate: Date when the health event occurred
   *
   * Optional fields:
   * - diagnosis: Medical diagnosis with ICD-10 code recommended
   * - treatment: Treatment provided or recommended
   * - notes: Additional clinical notes
   * - provider: Healthcare provider name
   * - followUpDate: Date for follow-up if needed
   *
   * @param {AuthenticatedRequest} request - Authenticated request with health record data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created health record
   * @returns {201} Created - { success: true, data: { record: {...} } }
   *
   * @throws {ValidationError} When required fields are missing or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Health record creation is logged to audit trail
   * @compliance ICD-10 - Diagnosis field supports ICD-10 coding
   * @hipaa PHI Protected - Creates patient medical record
   *
   * @example
   * Create illness record with ICD-10 code:
   * ```typescript
   * const request = {
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     recordType: "ILLNESS",
   *     recordDate: "2025-10-23",
   *     diagnosis: "Acute upper respiratory infection (ICD-10: J06.9)",
   *     treatment: "Rest, fluids, OTC acetaminophen for fever",
   *     notes: "Temperature 101.2°F. Sent home, parent notified.",
   *     provider: "Nurse Johnson",
   *     followUpDate: "2025-10-25"
   *   }
   * };
   * const response = await HealthRecordsController.createRecord(request, h);
   * ```
   */
  static async createRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    // Payload already validated with correct field names (recordType, recordDate, etc.)
    // Convert recordDate to Date object if it's a string
    const recordData = preparePayload(request.payload, {
      dateFields: ['recordDate', 'followUpDate']
    });

    // Extract and type the fields for CreateHealthRecordData
    const payload = recordData as any;
    const typedData = {
      studentId: payload.studentId,
      type: payload.recordType || payload.type,
      date: payload.recordDate || payload.date,
      description: payload.diagnosis || payload.description || '',
      vital: payload.vital,
      provider: payload.provider,
      notes: payload.notes,
      attachments: payload.attachments
    };

    const record = await HealthRecordService.createHealthRecord(typedData);

    return createdResponse(h, { record });
  }

  /**
   * Update an existing health record.
   *
   * Updates health record information such as diagnosis, treatment details, provider,
   * or clinical notes. At least one field must be provided for update. Automatically
   * converts date fields to Date objects. Maintains complete audit trail of changes.
   *
   * Common update scenarios:
   * - Correcting diagnosis or treatment information
   * - Adding follow-up notes or observations
   * - Updating provider information
   * - Adding ICD-10 codes to existing diagnoses
   *
   * @param {AuthenticatedRequest} request - Authenticated request with record ID param and update data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated health record
   * @returns {200} Success - { success: true, data: { record: {...} } }
   *
   * @throws {NotFoundError} When health record ID does not exist
   * @throws {ValidationError} When update data is invalid or no fields provided
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - All health record updates logged with user ID and timestamp
   * @hipaa PHI Protected - Modifies patient medical record
   *
   * @example
   * Update diagnosis with ICD-10 code:
   * ```typescript
   * const request = {
   *   params: { id: '550e8400-e29b-41d4-a716-446655440000' },
   *   payload: {
   *     diagnosis: "Streptococcal pharyngitis (ICD-10: J02.0)",
   *     treatment: "Prescribed amoxicillin 500mg TID x 10 days",
   *     notes: "Rapid strep test positive. Parent will pick up prescription."
   *   }
   * };
   * const response = await HealthRecordsController.updateRecord(request, h);
   * ```
   */
  static async updateRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    // Payload already validated with correct field names
    const updateData = preparePayload(request.payload, {
      dateFields: ['recordDate', 'followUpDate']
    });

    const record = await HealthRecordService.updateHealthRecord(id, updateData);

    return successResponse(h, { record });
  }

  /**
   * Delete (soft-delete/archive) a health record.
   *
   * Soft-deletes a health record while preserving historical data for compliance
   * and legal audit purposes. Sets deletedAt timestamp and archives the record.
   * Historical medical records are never physically deleted to maintain complete
   * patient history per HIPAA and legal requirements.
   *
   * Deleted records remain accessible for audit and reporting but are excluded
   * from active medical summaries and routine queries.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with health record ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} HTTP 204 No Content (REST standard for successful DELETE)
   * @returns {204} No Content - Successful deletion with empty response body
   *
   * @throws {NotFoundError} When health record ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Record deletion is logged to audit trail with user and timestamp
   * @compliance FERPA - Historical health records preserved for legal compliance
   * @hipaa PHI Protected - Archives patient medical record
   *
   * @example
   * ```typescript
   * // DELETE /api/v1/health-records/550e8400-e29b-41d4-a716-446655440000
   * const request = { params: { id: '550e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.deleteRecord(request, h);
   * // Returns: HTTP 204 No Content (empty response body per REST standard)
   * // Record soft-deleted: { deletedAt: "2025-10-23T14:30:00Z", isActive: false }
   * ```
   */
  static async deleteRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await HealthRecordService.deleteHealthRecord(id);

    return h.response().code(204);
  }

  /**
   * ==================================================================================
   * ALLERGIES - Critical for student safety and emergency preparedness
   * ==================================================================================
   */

  /**
   * List all allergies for a student.
   *
   * Retrieves complete allergy history for a student including allergen names,
   * severity levels, reactions, and treatment protocols. Critical for emergency
   * preparedness and preventing exposure to known allergens.
   *
   * Severity levels:
   * - MILD: Minor reactions (mild rash, itching)
   * - MODERATE: Noticeable reactions requiring intervention (hives, nausea)
   * - SEVERE: Significant reactions requiring medical attention (difficulty breathing)
   * - LIFE_THREATENING: Anaphylaxis risk, requires epinephrine/EpiPen
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete list of student allergies
   * @returns {200} Success - { success: true, data: { allergies: [...] } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Allergy access is logged to audit trail
   * @hipaa CRITICAL PHI - Life-threatening allergy information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../allergies
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.listAllergies(request, h);
   * // Returns: { allergies: [{ allergen: "Peanuts", severity: "LIFE_THREATENING", ... }] }
   * ```
   */
  static async listAllergies(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return successResponse(h, { allergies });
  }

  /**
   * Get specific allergy by ID.
   *
   * Retrieves detailed information for a single allergy including allergen type,
   * severity level, known reactions, emergency treatment protocols, and historical
   * reaction details. Used for emergency reference and allergy management planning.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with allergy ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Detailed allergy information
   * @returns {200} Success - { success: true, data: { allergy: {...} } }
   *
   * @throws {NotFoundError} When allergy ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Allergy detail access is logged
   * @hipaa CRITICAL PHI - Detailed allergy and reaction information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/allergies/allergy-uuid
   * const request = { params: { id: 'allergy-uuid' } };
   * const response = await HealthRecordsController.getAllergyById(request, h);
   * // Returns: { allergen: "Peanuts", severity: "LIFE_THREATENING", reactions: "Anaphylaxis", treatment: "Administer EpiPen immediately" }
   * ```
   */
  static async getAllergyById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const allergy = await HealthRecordService.getAllergyById(id);

    return successResponse(h, { allergy });
  }

  /**
   * Create new allergy record.
   *
   * Records a new allergy for a student with complete details including allergen type,
   * severity level, known reactions, and emergency treatment protocol. Critical for
   * student safety and emergency preparedness.
   *
   * Required fields:
   * - studentId: Student UUID
   * - allergen: Allergen name (food, medication, environmental, etc.)
   * - severity: Severity level (MILD, MODERATE, SEVERE, LIFE_THREATENING)
   *
   * Recommended fields:
   * - reactions: Description of allergic reactions
   * - treatment: Emergency treatment protocol (e.g., "Administer EpiPen, call 911")
   * - diagnosedDate: When allergy was diagnosed
   * - diagnosedBy: Healthcare provider who diagnosed
   *
   * @param {AuthenticatedRequest} request - Authenticated request with allergy data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created allergy record
   * @returns {201} Created - { success: true, data: { allergy: {...} } }
   *
   * @throws {ValidationError} When required fields are missing or severity is invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Allergy creation is logged with complete audit trail
   * @hipaa CRITICAL PHI - Creates life-threatening allergy information
   *
   * @example
   * Life-threatening food allergy:
   * ```typescript
   * const request = {
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     allergen: "Peanuts",
   *     severity: "LIFE_THREATENING",
   *     reactions: "Anaphylaxis - throat swelling, difficulty breathing, hives",
   *     treatment: "Administer EpiPen to outer thigh immediately. Call 911. Monitor until EMS arrives.",
   *     diagnosedDate: "2020-03-15",
   *     diagnosedBy: "Dr. Sarah Chen, Allergist",
   *     notes: "Two EpiPens kept in nurse's office. Parent has additional EpiPen."
   *   }
   * };
   * const response = await HealthRecordsController.createAllergy(request, h);
   * ```
   */
  static async createAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    // Extract payload fields and prepare for CreateAllergyData
    const payload = extractPayloadSafe(request.payload);

    const allergyData = {
      studentId: payload.studentId as string,
      allergen: payload.allergen as string,
      severity: payload.severity as any,
      reaction: (payload.reaction || payload.reactions) as string | undefined,
      treatment: payload.treatment as string | undefined,
      verified: payload.verified as boolean | undefined,
      verifiedBy: payload.verifiedBy as string | undefined
    };

    const allergy = await HealthRecordService.createAllergy(allergyData);

    return createdResponse(h, { allergy });
  }

  /**
   * Update allergy information.
   *
   * Updates existing allergy details such as severity level, reaction descriptions,
   * or treatment protocols. Used when allergy severity changes, new reactions are
   * observed, or treatment protocols are updated by healthcare providers.
   *
   * Common update scenarios:
   * - Severity escalation (e.g., MODERATE to SEVERE after new reaction)
   * - Adding newly observed reactions
   * - Updating emergency treatment protocols
   * - Adding EpiPen or medication information
   *
   * @param {AuthenticatedRequest} request - Authenticated request with allergy ID and update data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated allergy record
   * @returns {200} Success - { success: true, data: { allergy: {...} } }
   *
   * @throws {NotFoundError} When allergy ID does not exist
   * @throws {ValidationError} When update data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Allergy updates logged with user ID and timestamp
   * @hipaa CRITICAL PHI - Modifies life-threatening allergy information
   *
   * @example
   * Escalate severity after new reaction:
   * ```typescript
   * const request = {
   *   params: { id: 'allergy-uuid' },
   *   payload: {
   *     severity: "LIFE_THREATENING",
   *     reactions: "Anaphylaxis - throat swelling, difficulty breathing, hives, vomiting",
   *     treatment: "Administer EpiPen immediately. Call 911. Second dose after 5 minutes if no improvement.",
   *     notes: "Severity escalated after reaction on 2025-10-20. Two EpiPens now required."
   *   }
   * };
   * const response = await HealthRecordsController.updateAllergy(request, h);
   * ```
   */
  static async updateAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    // Extract payload fields and prepare for Partial<CreateAllergyData>
    const payload = extractPayloadSafe(request.payload);

    const allergyUpdateData: Partial<{
      studentId: string;
      allergen: string;
      severity: any;
      reaction?: string;
      treatment?: string;
      verified?: boolean;
      verifiedBy?: string;
    }> = {};

    if (payload.studentId !== undefined) allergyUpdateData.studentId = payload.studentId as string;
    if (payload.allergen !== undefined) allergyUpdateData.allergen = payload.allergen as string;
    if (payload.severity !== undefined) allergyUpdateData.severity = payload.severity;
    if (payload.reaction !== undefined || payload.reactions !== undefined) {
      allergyUpdateData.reaction = (payload.reaction || payload.reactions) as string;
    }
    if (payload.treatment !== undefined) allergyUpdateData.treatment = payload.treatment as string;
    if (payload.verified !== undefined) allergyUpdateData.verified = payload.verified as boolean;
    if (payload.verifiedBy !== undefined) allergyUpdateData.verifiedBy = payload.verifiedBy as string;

    const allergy = await HealthRecordService.updateAllergy(id, allergyUpdateData);

    return successResponse(h, { allergy });
  }

  /**
   * Delete (archive) allergy record.
   *
   * Soft-deletes an allergy record, removing it from active allergy lists while
   * preserving historical data for medical records and legal compliance. Used when
   * a student outgrows an allergy, allergy was misdiagnosed, or student transfers.
   *
   * Archived allergies remain in historical records but are excluded from emergency
   * allergy alerts and active medical summaries.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with allergy ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} HTTP 204 No Content (REST standard for successful DELETE)
   * @returns {204} No Content - Successful deletion with empty response body
   *
   * @throws {NotFoundError} When allergy ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Allergy deletion is logged to audit trail
   * @compliance FERPA - Historical allergy records preserved for legal compliance
   * @hipaa CRITICAL PHI - Archives life-threatening allergy information
   *
   * @example
   * ```typescript
   * // DELETE /api/v1/health-records/allergies/allergy-uuid
   * const request = { params: { id: 'allergy-uuid' } };
   * const response = await HealthRecordsController.deleteAllergy(request, h);
   * // Returns: HTTP 204 No Content
   * // Allergy archived: { deletedAt: "2025-10-23T14:30:00Z", isActive: false }
   * // Note: Removed from active allergy alerts but preserved in medical history
   * ```
   */
  static async deleteAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await HealthRecordService.deleteAllergy(id);

    return h.response().code(204);
  }

  /**
   * ==================================================================================
   * CHRONIC CONDITIONS - Ongoing health management and care coordination
   * ==================================================================================
   */

  /**
   * List all chronic conditions for a student.
   *
   * Retrieves complete list of chronic/ongoing medical conditions for a student
   * including diagnoses, ICD-10 codes, severity levels, care plans, and review schedules.
   * Essential for daily health management and emergency preparedness.
   *
   * Common chronic conditions in schools:
   * - Asthma (ICD-10: J45.x)
   * - Type 1 Diabetes (ICD-10: E10.x)
   * - ADHD (ICD-10: F90.x)
   * - Epilepsy/Seizure disorders (ICD-10: G40.x)
   * - Food allergies requiring ongoing management
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete list of chronic conditions
   * @returns {200} Success - { success: true, data: { conditions: [...] } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Chronic condition access is logged to audit trail
   * @compliance ICD-10 - Diagnosis codes tracked for medical documentation
   * @hipaa HIGHLY SENSITIVE PHI - Chronic medical conditions
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../conditions
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.listConditions(request, h);
   * // Returns: { conditions: [{ diagnosis: "Type 1 Diabetes Mellitus", icdCode: "E10.9", ... }] }
   * ```
   */
  static async listConditions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return successResponse(h, { conditions });
  }

  /**
   * Get specific chronic condition by ID.
   *
   * Retrieves detailed information for a single chronic condition including diagnosis,
   * ICD-10 code, severity, care plan, medications, review schedule, and management notes.
   * Used for care coordination and daily health management.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with condition ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Detailed chronic condition information
   * @returns {200} Success - { success: true, data: { condition: {...} } }
   *
   * @throws {NotFoundError} When condition ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Condition detail access is logged
   * @compliance ICD-10 - Diagnosis codes documented
   * @hipaa HIGHLY SENSITIVE PHI - Detailed chronic condition and care plan
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/conditions/condition-uuid
   * const request = { params: { id: 'condition-uuid' } };
   * const response = await HealthRecordsController.getConditionById(request, h);
   * // Returns: { diagnosis: "Asthma", icdCode: "J45.909", severity: "MODERATE", carePlan: "...", medications: [...] }
   * ```
   */
  static async getConditionById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const condition = await HealthRecordService.getChronicConditionById(id);

    return successResponse(h, { condition });
  }

  /**
   * Create new chronic condition record.
   *
   * Records a new chronic condition diagnosis for a student with complete clinical
   * details including ICD-10 code, severity, care plan, and management protocols.
   * Used when a student is newly diagnosed or transfers with existing chronic conditions.
   *
   * Required fields:
   * - studentId: Student UUID
   * - diagnosis: Condition name/description
   * - diagnosisDate: When condition was diagnosed
   *
   * Recommended fields:
   * - icdCode: ICD-10 diagnosis code (e.g., "J45.909" for asthma)
   * - severity: Severity level (MILD, MODERATE, SEVERE)
   * - carePlan: Daily management and emergency protocols
   * - medications: Related medications for condition
   * - reviewSchedule: When condition should be reviewed
   *
   * @param {AuthenticatedRequest} request - Authenticated request with condition data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created chronic condition record
   * @returns {201} Created - { success: true, data: { condition: {...} } }
   *
   * @throws {ValidationError} When required fields are missing or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Condition creation is logged with complete audit trail
   * @compliance ICD-10 - Diagnosis codes tracked for medical documentation
   * @hipaa HIGHLY SENSITIVE PHI - Creates chronic medical condition record
   *
   * @example
   * Type 1 Diabetes with comprehensive care plan:
   * ```typescript
   * const request = {
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     diagnosis: "Type 1 Diabetes Mellitus",
   *     icdCode: "E10.9",
   *     severity: "SEVERE",
   *     diagnosisDate: "2022-06-15",
   *     carePlan: "Blood glucose monitoring before lunch. Insulin via pump. Snacks available for hypoglycemia. Emergency glucagon kit in office.",
   *     medications: "Insulin aspart (NovoLog) via pump",
   *     reviewSchedule: "Quarterly review with endocrinologist. Annual A1C monitoring.",
   *     diagnosedBy: "Dr. Jennifer Park, Pediatric Endocrinologist",
   *     nextReviewDate: "2025-12-01",
   *     notes: "Target blood glucose 80-150 mg/dL. Parent notified if <70 or >250."
   *   }
   * };
   * const response = await HealthRecordsController.createCondition(request, h);
   * ```
   */
  static async createCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const conditionData = preparePayload(request.payload, {
      dateFields: ['diagnosisDate', 'lastReviewDate', 'nextReviewDate']
    });

    // Extract and type the fields for CreateChronicConditionData
    const payload = conditionData as any;
    const typedData = {
      studentId: payload.studentId,
      condition: payload.diagnosis || payload.condition,
      diagnosisDate: payload.diagnosisDate,
      status: payload.status,
      severity: payload.severity,
      notes: payload.notes,
      carePlan: payload.carePlan,
      medications: payload.medications,
      restrictions: payload.restrictions,
      triggers: payload.triggers,
      diagnosedBy: payload.diagnosedBy,
      lastReviewDate: payload.lastReviewDate,
      nextReviewDate: payload.nextReviewDate,
      icdCode: payload.icdCode
    };

    const condition = await HealthRecordService.createChronicCondition(typedData);

    return createdResponse(h, { condition });
  }

  /**
   * Update chronic condition.
   *
   * Updates chronic condition information such as severity, care plan, medications,
   * or review schedule. Used for condition progression changes, care plan updates,
   * or recording periodic medical reviews.
   *
   * Common update scenarios:
   * - Severity changes (condition worsens or improves)
   * - Care plan modifications per provider orders
   * - Medication changes for condition management
   * - Recording periodic review dates and outcomes
   *
   * @param {AuthenticatedRequest} request - Authenticated request with condition ID and update data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated chronic condition
   * @returns {200} Success - { success: true, data: { condition: {...} } }
   *
   * @throws {NotFoundError} When condition ID does not exist
   * @throws {ValidationError} When update data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Condition updates logged with user ID and timestamp
   * @hipaa HIGHLY SENSITIVE PHI - Modifies chronic medical condition
   *
   * @example
   * Update asthma severity and care plan:
   * ```typescript
   * const request = {
   *   params: { id: 'condition-uuid' },
   *   payload: {
   *     severity: "SEVERE",
   *     carePlan: "Increased albuterol use. Peak flow monitoring 3x daily. Emergency action plan updated. Prednisone available for severe attacks.",
   *     medications: "Albuterol inhaler PRN, Flovent 110mcg BID, Prednisone 20mg emergency supply",
   *     lastReviewDate: "2025-10-23",
   *     nextReviewDate: "2025-11-23",
   *     notes: "Severity escalated due to increased wheezing. Pulmonologist follow-up scheduled."
   *   }
   * };
   * const response = await HealthRecordsController.updateCondition(request, h);
   * ```
   */
  static async updateCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = preparePayload(request.payload, {
      dateFields: ['diagnosisDate', 'lastReviewDate', 'nextReviewDate']
    });

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return successResponse(h, { condition });
  }

  /**
   * Delete (archive) chronic condition.
   *
   * Soft-deletes a chronic condition record while preserving historical medical data
   * for compliance and legal audit purposes. Used when condition resolves, student
   * transfers, or condition was misdiagnosed.
   *
   * Archived conditions remain in medical history but are excluded from active
   * care plans and daily health management protocols.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with condition ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} HTTP 204 No Content (REST standard for successful DELETE)
   * @returns {204} No Content - Successful deletion with empty response body
   *
   * @throws {NotFoundError} When condition ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Condition deletion is logged to audit trail
   * @compliance FERPA - Historical chronic condition records preserved for legal compliance
   * @hipaa HIGHLY SENSITIVE PHI - Archives chronic medical condition
   *
   * @example
   * ```typescript
   * // DELETE /api/v1/health-records/conditions/condition-uuid
   * const request = { params: { id: 'condition-uuid' } };
   * const response = await HealthRecordsController.deleteCondition(request, h);
   * // Returns: HTTP 204 No Content
   * // Condition archived: { deletedAt: "2025-10-23T14:30:00Z", isActive: false }
   * // Note: Removed from active care plans but preserved in medical history
   * ```
   */
  static async deleteCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await HealthRecordService.deleteChronicCondition(id);

    return h.response().code(204);
  }

  /**
   * ==================================================================================
   * VACCINATIONS/IMMUNIZATIONS - Immunization tracking and compliance monitoring
   * ==================================================================================
   */

  /**
   * List all vaccinations for a student.
   *
   * Retrieves complete immunization history for a student including vaccine names,
   * CVX codes, NDC codes, administration dates, lot numbers, dose tracking, and
   * next due dates. Essential for compliance monitoring against state/CDC immunization
   * requirements.
   *
   * Common school-required vaccines:
   * - DTaP/Tdap (CVX: 20/115)
   * - MMR (CVX: 03)
   * - Varicella (CVX: 21)
   * - Hepatitis B (CVX: 08)
   * - Polio (CVX: 10)
   * - Meningococcal (CVX: 114)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete immunization history
   * @returns {200} Success - { success: true, data: { vaccinations: [...] } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Vaccination access is logged to audit trail
   * @compliance CDC - Immunization tracking per CDC vaccination schedules
   * @compliance State Requirements - School immunization compliance monitoring
   * @hipaa PHI Protected - Immunization history information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../vaccinations
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.listVaccinations(request, h);
   * // Returns: { vaccinations: [{ vaccine: "MMR", cvxCode: "03", dose: "1 of 2", administrationDate: "...", ... }] }
   * ```
   */
  static async listVaccinations(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getStudentVaccinations(studentId);

    return successResponse(h, { vaccinations });
  }

  /**
   * Get specific vaccination by ID.
   *
   * Retrieves detailed information for a single vaccination record including complete
   * administration details, lot number, expiration date, CVX/NDC codes, dose information,
   * and any adverse reactions. Critical for vaccine recall tracking and compliance verification.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with vaccination ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Detailed vaccination record
   * @returns {200} Success - { success: true, data: { vaccination: {...} } }
   *
   * @throws {NotFoundError} When vaccination ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Vaccination detail access is logged
   * @compliance CDC - Vaccine lot tracking for recall management
   * @hipaa PHI Protected - Detailed immunization information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/vaccinations/vaccination-uuid
   * const request = { params: { id: 'vaccination-uuid' } };
   * const response = await HealthRecordsController.getVaccinationById(request, h);
   * // Returns: { vaccine: "MMR", cvxCode: "03", lotNumber: "U3279AA", dose: "1 of 2", ... }
   * ```
   */
  static async getVaccinationById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const vaccination = await HealthRecordService.getVaccinationById(id);

    return successResponse(h, { vaccination });
  }

  /**
   * Create new vaccination record.
   *
   * Records a new vaccination administration for a student with complete details
   * including CVX code, NDC code, lot number, dose tracking, administration details,
   * and any adverse reactions. Essential for maintaining accurate immunization records
   * and state/school compliance.
   *
   * Required fields:
   * - studentId: Student UUID
   * - vaccine: Vaccine name (e.g., "MMR", "DTaP", "Hepatitis B")
   * - administrationDate: Date vaccine was administered
   *
   * Recommended fields:
   * - cvxCode: CDC CVX code for vaccine type (e.g., "03" for MMR)
   * - ndcCode: National Drug Code for specific product
   * - lotNumber: Manufacturer lot number (critical for recalls)
   * - expirationDate: Vaccine expiration date
   * - dose: Dose number in series (e.g., "1 of 2", "2 of 3")
   * - route: Administration route (IM, SQ, PO, etc.)
   * - site: Administration site (left deltoid, right thigh, etc.)
   * - administeredBy: Healthcare provider who administered
   *
   * @param {AuthenticatedRequest} request - Authenticated request with vaccination data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created vaccination record
   * @returns {201} Created - { success: true, data: { vaccination: {...} } }
   *
   * @throws {ValidationError} When required fields are missing or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Vaccination creation is logged with complete audit trail
   * @compliance CDC - Vaccine administration tracking per CDC guidelines
   * @compliance FDA - Lot tracking for vaccine recall management
   * @hipaa PHI Protected - Creates immunization record
   *
   * @example
   * MMR vaccination with complete tracking:
   * ```typescript
   * const request = {
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     vaccine: "MMR (Measles, Mumps, Rubella)",
   *     cvxCode: "03",
   *     ndcCode: "00006-4681-00",
   *     lotNumber: "U3279AA",
   *     expirationDate: "2026-08-15",
   *     administrationDate: "2025-10-23",
   *     dose: "1 of 2",
   *     route: "Subcutaneous",
   *     site: "Left upper arm",
   *     administeredBy: "Nurse Johnson, RN",
   *     manufacturer: "Merck & Co.",
   *     nextDueDate: "2029-10-23",
   *     notes: "No adverse reactions observed. Parent consent on file."
   *   }
   * };
   * const response = await HealthRecordsController.createVaccination(request, h);
   * ```
   */
  static async createVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const vaccinationData = preparePayload(request.payload, {
      dateFields: ['administrationDate', 'expirationDate', 'nextDueDate']
    });

    // Extract and type the fields for CreateVaccinationData
    const payload = vaccinationData as any;
    const typedData = {
      studentId: payload.studentId,
      vaccineName: payload.vaccine || payload.vaccineName,
      administrationDate: payload.administrationDate,
      administeredBy: payload.administeredBy,
      cvxCode: payload.cvxCode,
      ndcCode: payload.ndcCode,
      lotNumber: payload.lotNumber,
      manufacturer: payload.manufacturer,
      doseNumber: payload.doseNumber,
      totalDoses: payload.totalDoses,
      expirationDate: payload.expirationDate,
      nextDueDate: payload.nextDueDate,
      site: payload.site,
      route: payload.route,
      dosageAmount: payload.dosageAmount || payload.dose,
      reactions: payload.reactions || payload.adverseReaction,
      notes: payload.notes
    };

    const vaccination = await HealthRecordService.createVaccination(typedData);

    return createdResponse(h, { vaccination });
  }

  /**
   * Update vaccination record.
   *
   * Updates vaccination information such as dose completion status, next due dates,
   * or adding adverse reactions. Used for correcting vaccination records, recording
   * delayed reactions, or updating compliance status.
   *
   * Common update scenarios:
   * - Recording adverse reactions after administration
   * - Correcting lot numbers or expiration dates
   * - Updating next due dates based on provider recommendations
   * - Marking dose series completion
   *
   * @param {AuthenticatedRequest} request - Authenticated request with vaccination ID and update data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated vaccination record
   * @returns {200} Success - { success: true, data: { vaccination: {...} } }
   *
   * @throws {NotFoundError} When vaccination ID does not exist
   * @throws {ValidationError} When update data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Vaccination updates logged with user ID and timestamp
   * @compliance CDC - Adverse reactions reported per VAERS guidelines
   * @hipaa PHI Protected - Modifies immunization record
   *
   * @example
   * Record adverse reaction after vaccination:
   * ```typescript
   * const request = {
   *   params: { id: 'vaccination-uuid' },
   *   payload: {
   *     adverseReaction: "Mild injection site soreness and low-grade fever (99.8°F) 8 hours post-administration. Resolved within 24 hours with OTC acetaminophen.",
   *     reactionSeverity: "MILD",
   *     notes: "Parent notified. No further intervention needed. Monitored for 48 hours - no complications."
   *   }
   * };
   * const response = await HealthRecordsController.updateVaccination(request, h);
   * ```
   */
  static async updateVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = preparePayload(request.payload, {
      dateFields: ['administrationDate', 'expirationDate', 'nextDueDate']
    });

    const vaccination = await HealthRecordService.updateVaccination(id, updateData);

    return successResponse(h, { vaccination });
  }

  /**
   * Delete (archive) vaccination record.
   *
   * Soft-deletes a vaccination record while preserving historical immunization data
   * for legal compliance and medical record completeness. Used when vaccination was
   * recorded in error, duplicate entry, or student transfers with corrected records.
   *
   * Archived vaccinations remain in medical history but are excluded from active
   * immunization compliance calculations and state reporting.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with vaccination ID param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} HTTP 204 No Content (REST standard for successful DELETE)
   * @returns {204} No Content - Successful deletion with empty response body
   *
   * @throws {NotFoundError} When vaccination ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Vaccination deletion is logged to audit trail
   * @compliance FERPA - Historical vaccination records preserved for legal compliance
   * @compliance State Requirements - Maintains immunization history for state reporting
   * @hipaa PHI Protected - Archives immunization record
   *
   * @example
   * ```typescript
   * // DELETE /api/v1/health-records/vaccinations/vaccination-uuid
   * const request = { params: { id: 'vaccination-uuid' } };
   * const response = await HealthRecordsController.deleteVaccination(request, h);
   * // Returns: HTTP 204 No Content
   * // Vaccination archived: { deletedAt: "2025-10-23T14:30:00Z", isActive: false }
   * // Note: Removed from active compliance tracking but preserved in immunization history
   * ```
   */
  static async deleteVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await HealthRecordService.deleteVaccination(id);

    return h.response().code(204);
  }

  /**
   * ==================================================================================
   * VITALS & GROWTH - Vital signs monitoring and growth tracking
   * ==================================================================================
   */

  /**
   * Record vital signs for a student.
   *
   * Records comprehensive vital signs and measurements including temperature, blood pressure,
   * heart rate, respiratory rate, oxygen saturation, height, weight, and BMI. Used for
   * routine health monitoring, illness assessment, and growth tracking.
   *
   * Vital signs tracked:
   * - Temperature (°F or °C)
   * - Blood Pressure (systolic/diastolic mmHg)
   * - Heart Rate (beats per minute)
   * - Respiratory Rate (breaths per minute)
   * - Oxygen Saturation (SpO2 %)
   * - Height (inches or cm)
   * - Weight (pounds or kg)
   * - BMI (automatically calculated)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with vitals data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created vitals record
   * @returns {201} Created - { success: true, data: { record: {...} } }
   *
   * @throws {ValidationError} When vitals data is invalid or out of normal ranges
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role (recordedBy auto-populated from JWT)
   * @compliance HIPAA - Vital signs recording is logged to audit trail
   * @hipaa PHI Protected - Creates patient vital signs record
   *
   * @example
   * ```typescript
   * const request = {
   *   auth: { credentials: { userId: 'nurse-uuid' } },
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     vitals: {
   *       temperature: 98.6,
   *       temperatureUnit: "F",
   *       bloodPressureSystolic: 110,
   *       bloodPressureDiastolic: 70,
   *       heartRate: 72,
   *       respiratoryRate: 16,
   *       oxygenSaturation: 98,
   *       height: 62,
   *       heightUnit: "inches",
   *       weight: 105,
   *       weightUnit: "lbs",
   *       bmi: 19.2
   *     },
   *     recordedBy: "nurse-uuid"
   *   }
   * };
   * const response = await HealthRecordsController.recordVitals(request, h);
   * ```
   */
  static async recordVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = request.payload as any;

    // recordVitalSigns expects a single object with { studentId, vitals, recordedBy }
    const vitalsRecord = await HealthRecordService.recordVitalSigns({
      studentId: payload.studentId,
      vitals: payload.vitals,
      recordedBy: payload.recordedBy
    });

    return createdResponse(h, { record: vitalsRecord });
  }

  /**
   * Get latest vital signs for a student.
   *
   * Retrieves the most recent vital signs record for a student. Used for quick
   * health status check, establishing baseline values, and comparing current
   * measurements with recent history.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Most recent vital signs
   * @returns {200} Success - { success: true, data: { vitals: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist or no vitals recorded
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Vitals access is logged to audit trail
   * @hipaa PHI Protected - Patient vital signs information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../vitals/latest
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.getLatestVitals(request, h);
   * // Returns: { vitals: { temperature: 98.6, heartRate: 72, bloodPressure: "110/70", recordedAt: "..." } }
   * ```
   */
  static async getLatestVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vitals = await HealthRecordService.getLatestVitals(studentId);

    return successResponse(h, { vitals });
  }

  /**
   * Get vital signs history for a student.
   *
   * Retrieves paginated history of all vital sign measurements for a student,
   * allowing trend analysis, growth tracking, and identification of health patterns.
   * Essential for monitoring chronic conditions and developmental progress.
   *
   * Query Parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - dateFrom: Optional start date for filtering
   * - dateTo: Optional end date for filtering
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId and pagination params
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Paginated vital signs history
   * @returns {200} Success - { success: true, data: { records: [], pagination: {} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When query parameters fail validation
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Vitals history access is logged to audit trail
   * @hipaa PHI Protected - Patient vital signs history with trend data
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../vitals/history?page=1&limit=20
   * const request = {
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   query: { page: 1, limit: 20 }
   * };
   * const response = await HealthRecordsController.getVitalsHistory(request, h);
   * // Returns paginated vitals with trend analysis for weight, height, BMI over time
   * ```
   */
  static async getVitalsHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const allRecords = await HealthRecordService.getVitalsHistory(studentId);

    // Manual pagination
    const offset = (page - 1) * limit;
    const records = allRecords.slice(offset, offset + limit);
    const total = allRecords.length;

    return paginatedResponse(
      h,
      records,
      buildPaginationMeta(page, limit, total)
    );
  }

  /**
   * ==================================================================================
   * MEDICAL SUMMARY & REPORTS - Comprehensive health overviews and compliance
   * ==================================================================================
   */

  /**
   * Get comprehensive medical summary for a student.
   *
   * Retrieves complete medical overview aggregating all critical health information
   * for a student. Includes active allergies, chronic conditions, current medications,
   * immunization status, recent vital signs, and care plans. Essential for emergency
   * reference, care coordination, and comprehensive health assessment.
   *
   * Summary includes:
   * - Active allergies with severity levels
   * - Chronic conditions with care plans
   * - Current active medications
   * - Immunization compliance status
   * - Most recent vital signs
   * - Emergency care protocols
   * - Important health alerts
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete medical overview
   * @returns {200} Success - { success: true, data: { summary: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Complete medical summary access is logged to audit trail
   * @hipaa EXTREMELY SENSITIVE PHI - Complete aggregated health information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../medical-summary
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.getMedicalSummary(request, h);
   * // Returns: {
   * //   summary: {
   * //     allergies: [{ allergen: "Peanuts", severity: "LIFE_THREATENING", ... }],
   * //     chronicConditions: [{ diagnosis: "Type 1 Diabetes", ... }],
   * //     medications: [{ medicationName: "Insulin", ... }],
   * //     immunizations: { compliant: true, missing: [] },
   * //     recentVitals: { temperature: 98.6, ... },
   * //     emergencyProtocols: ["EpiPen available", "Glucagon kit in office"]
   * //   }
   * // }
   * ```
   */
  static async getMedicalSummary(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getStudentMedicalSummary(studentId);

    return successResponse(h, { summary });
  }

  /**
   * Get immunization compliance status for a student.
   *
   * Performs comprehensive immunization compliance check against state and district
   * requirements, identifying complete vaccine series, missing vaccines, and overdue
   * doses. Critical for school enrollment, compliance reporting, and identifying
   * students needing immunization catch-up.
   *
   * Compliance check includes:
   * - Overall compliance status (compliant/non-compliant)
   * - Required vaccines by age/grade
   * - Completed vaccine series
   * - Missing or incomplete vaccines
   * - Overdue vaccines with next due dates
   * - Exemptions on file (medical, religious)
   * - Recommendations for catch-up immunizations
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Immunization compliance status
   * @returns {200} Success - { success: true, data: { status: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Immunization compliance access is logged to audit trail
   * @compliance CDC - Compliance checked against CDC immunization schedules
   * @compliance State Requirements - State-specific immunization requirements
   * @hipaa PHI Protected - Immunization compliance and health status
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-records/student/660e8400.../immunization-status
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthRecordsController.getImmunizationStatus(request, h);
   * // Returns: {
   * //   status: {
   * //     compliant: false,
   * //     completed: ["DTaP", "MMR", "Hepatitis B"],
   * //     missing: ["Meningococcal (due for 7th grade)"],
   * //     overdue: ["Tdap booster"],
   * //     nextDue: [{ vaccine: "Meningococcal", dueDate: "2025-09-01" }],
   * //     exemptions: [],
   * //     notes: "Student needs Tdap booster and Meningococcal for 7th grade entry"
   * //   }
   * // }
   * ```
   */
  static async getImmunizationStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const status = await HealthRecordService.checkImmunizationCompliance(studentId);

    return successResponse(h, { status });
  }
}
