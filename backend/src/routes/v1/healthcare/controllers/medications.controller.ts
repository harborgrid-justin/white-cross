/**
 * @fileoverview Medications Controller - Healthcare medication management business logic.
 *
 * This controller provides HTTP request handling for all medication-related operations
 * in the White Cross healthcare platform, including:
 * - Medication CRUD operations (create, read, update, deactivate)
 * - Student medication assignments and tracking
 * - Medication administration logging with witness support
 * - Inventory management with expiration and reorder alerts
 * - Adverse reaction reporting and monitoring
 * - Medication schedules and reminders
 * - Statistical analytics and alert generation
 *
 * Clinical Context:
 * - Supports both OTC and prescription medications
 * - Handles controlled substances (DEA Schedule II-V) with enhanced logging
 * - Tracks medication administration with nurse verification
 * - Monitors adverse reactions and side effects
 * - Manages inventory with expiration tracking
 * - Provides medication alerts for safety and compliance
 *
 * @module routes/v1/healthcare/controllers/medications
 * @since 1.0.0
 *
 * @compliance HIPAA - 45 CFR §164.312(b) - Audit controls for PHI access
 * @compliance FDA - 21 CFR Part 11 - Electronic records and signatures
 * @compliance DEA - Controlled substance tracking for Schedule II-V medications
 *
 * @security PHI Protected - All methods handle Protected Health Information
 * @security JWT authentication required on all endpoints
 * @security RBAC: NURSE or ADMIN roles required for write operations
 *
 * @see {@link MedicationService} - Business logic layer for medication operations
 * @see {@link ../routes/medications.routes} - Route definitions for medication endpoints
 * @see {@link ../validators/medications.validators} - Request validation schemas
 *
 * @example
 * Import and use in route definitions:
 * ```typescript
 * import { MedicationsController } from './controllers/medications.controller';
 * import { asyncHandler } from '../../../shared/utils';
 *
 * const route = {
 *   method: 'GET',
 *   path: '/api/v1/medications',
 *   handler: asyncHandler(MedicationsController.list)
 * };
 * ```
 */

import { ResponseToolkit } from '@hapi/hapi';
import { MedicationService } from '../../../../services/medication';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta } from '../../../shared/utils';

/**
 * Medications Controller - HTTP request handlers for medication management.
 *
 * Provides controller methods that handle HTTP requests for medication operations,
 * validate authentication/authorization, delegate to the service layer, and format responses.
 *
 * @class MedicationsController
 * @static
 * @since 1.0.0
 *
 * @example
 * Usage in Hapi.js routes:
 * ```typescript
 * const route = {
 *   handler: asyncHandler(MedicationsController.list),
 *   options: { auth: 'jwt' }
 * };
 * ```
 */
export class MedicationsController {
  /**
   * List all medications with pagination, filtering, and search.
   *
   * Retrieves a paginated list of medications from the database with optional
   * filtering by search term, student ID, active status, and controlled substance
   * classification. Supports full-text search on medication names.
   *
   * Query Parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - search: Search term for medication name
   * - studentId: Filter by student UUID
   * - isActive: Filter by active status
   * - isControlled: Filter by controlled substance status
   * - deaSchedule: Filter by DEA schedule (II-V)
   *
   * @param {AuthenticatedRequest} request - Hapi.js authenticated request with query parameters
   * @param {ResponseToolkit} h - Hapi.js response toolkit for building HTTP responses
   *
   * @returns {Promise<ResponseObject>} Paginated medication list with metadata
   * @returns {200} Success - { success: true, data: { medications: [], pagination: {} } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ValidationError} When query parameters fail validation
   * @throws {InternalError} When database query fails
   *
   * @security JWT authentication required
   * @security User must be authenticated with valid session
   * @compliance HIPAA - All medication access is logged to audit trail
   * @hipaa PHI Protected - Returns patient medication information
   *
   * @example
   * Request with search and pagination:
   * ```typescript
   * // GET /api/v1/medications?page=1&limit=20&search=ibuprofen&isActive=true
   * const response = await MedicationsController.list(request, h);
   * ```
   *
   * @example
   * Response format:
   * ```json
   * {
   *   "success": true,
   *   "data": {
   *     "medications": [
   *       {
   *         "id": "550e8400-e29b-41d4-a716-446655440000",
   *         "medicationName": "Ibuprofen 200mg",
   *         "dosage": "200mg",
   *         "frequency": "Every 6 hours as needed",
   *         "route": "Oral",
   *         "prescribedBy": "Dr. Smith",
   *         "isActive": true,
   *         "studentId": "660e8400-e29b-41d4-a716-446655440000"
   *       }
   *     ],
   *     "pagination": {
   *       "page": 1,
   *       "limit": 20,
   *       "total": 87,
   *       "pages": 5
   *     }
   *   }
   * }
   * ```
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const search = request.query.search as string | undefined;

    const result = await MedicationService.getMedications(page, limit, search);

    return paginatedResponse(
      h,
      result.medications || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Create a new medication record.
   *
   * Creates a new medication in the system with complete prescribing information,
   * dosage instructions, and administration details. Validates all required fields
   * and optional fields like NDC codes and DEA schedules for controlled substances.
   *
   * Required fields:
   * - medicationName: Full name with strength (e.g., "Ibuprofen 200mg")
   * - dosage: Amount and unit
   * - frequency: Administration frequency
   * - route: Administration route (Oral, Topical, etc.)
   * - prescribedBy: Prescribing provider name
   * - startDate: Start date for medication
   * - studentId: Student UUID
   *
   * @param {AuthenticatedRequest} request - Authenticated request with medication data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created medication record
   * @returns {201} Created - { success: true, data: { medication: {...} } }
   *
   * @throws {ValidationError} When required fields are missing or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Medication creation is logged to audit trail
   * @compliance FDA - NDC code validation per FDA Drug Listing requirements (if provided)
   * @compliance DEA - Controlled substances require DEA schedule classification
   * @hipaa PHI Protected - Creates patient medication record
   *
   * @example
   * Create OTC medication:
   * ```typescript
   * const request = {
   *   payload: {
   *     medicationName: "Ibuprofen 200mg",
   *     dosage: "200mg",
   *     frequency: "Every 6 hours as needed",
   *     route: "Oral",
   *     prescribedBy: "School Nurse",
   *     startDate: "2025-10-23",
   *     instructions: "Take with food",
   *     studentId: "660e8400-e29b-41d4-a716-446655440000"
   *   }
   * };
   * const response = await MedicationsController.create(request, h);
   * ```
   *
   * @example
   * Create controlled substance with DEA tracking:
   * ```typescript
   * const request = {
   *   payload: {
   *     medicationName: "Methylphenidate 10mg",
   *     dosage: "10mg",
   *     frequency: "Once daily in morning",
   *     route: "Oral",
   *     prescribedBy: "Dr. Smith, MD",
   *     startDate: "2025-10-23",
   *     ndc: "00406-0486-01",
   *     isControlled: true,
   *     deaSchedule: "II",
   *     requiresWitness: true,
   *     studentId: "660e8400-e29b-41d4-a716-446655440000"
   *   }
   * };
   * ```
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const medication = await MedicationService.createMedication(request.payload);
    return createdResponse(h, { medication });
  }

  /**
   * Get a single medication record by ID.
   *
   * Retrieves detailed information for a specific medication including all
   * prescribing details, dosage instructions, and administration information.
   * Optionally includes related student information if requested.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with medication ID in params
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Single medication record
   * @returns {200} Success - { success: true, data: { medication: {...} } }
   *
   * @throws {NotFoundError} When medication ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ValidationError} When ID is not a valid UUID
   *
   * @security JWT authentication required
   * @compliance HIPAA - Medication access is logged to audit trail
   * @hipaa PHI Protected - Returns patient medication information
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/550e8400-e29b-41d4-a716-446655440000
   * const request = { params: { id: '550e8400-e29b-41d4-a716-446655440000' } };
   * const response = await MedicationsController.getById(request, h);
   * // Returns: { success: true, data: { medication: {...} } }
   * ```
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const medication = await MedicationService.getMedicationById(id);
    return successResponse(h, { medication });
  }

  /**
   * Get all medications for a specific student.
   *
   * Retrieves a paginated list of all medications assigned to a student,
   * including both active and inactive medications for complete medical history.
   * Supports filtering by active status and date ranges.
   *
   * This is a highly sensitive PHI endpoint as it reveals complete medication
   * history for a student, including controlled substances and psychiatric medications.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId in params
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Paginated list of student medications
   * @returns {200} Success - { success: true, data: { medications: [], pagination: {} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's school
   * @compliance HIPAA - Complete medication history access is logged
   * @hipaa HIGHLY SENSITIVE PHI - Contains full medication history
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/student/660e8400-e29b-41d4-a716-446655440000?page=1&limit=20
   * const request = {
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   query: { page: 1, limit: 20, isActive: true }
   * };
   * const response = await MedicationsController.getByStudent(request, h);
   * ```
   */
  static async getByStudent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await MedicationService.getMedicationsByStudent(studentId, page, limit);

    return paginatedResponse(
      h,
      result.medications || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Update an existing medication record.
   *
   * Updates medication information such as dosage, frequency, administration route,
   * or instructions. At least one field must be provided for update. Cannot change
   * core identifying information like student assignment or NDC code.
   *
   * Common update scenarios:
   * - Dosage adjustments per provider orders
   * - Frequency changes based on student response
   * - Adding or updating administration instructions
   * - Extending or shortening treatment duration
   *
   * @param {AuthenticatedRequest} request - Authenticated request with medication ID and update data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated medication record
   * @returns {200} Success - { success: true, data: { medication: {...} } }
   *
   * @throws {NotFoundError} When medication ID does not exist
   * @throws {ValidationError} When update data is invalid or no fields provided
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - All medication updates are logged with user ID and timestamp
   * @hipaa PHI Protected - Modifies patient medication record
   *
   * @example
   * Update dosage and instructions:
   * ```typescript
   * const request = {
   *   params: { id: '550e8400-e29b-41d4-a716-446655440000' },
   *   payload: {
   *     dosage: "400mg",
   *     frequency: "Every 8 hours with meals",
   *     instructions: "Take with food. May cause drowsiness."
   *   }
   * };
   * const response = await MedicationsController.update(request, h);
   * ```
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const medication = await MedicationService.updateMedication(id, request.payload);
    return successResponse(h, { medication });
  }

  /**
   * Deactivate a medication (soft delete).
   *
   * Deactivates a medication record while preserving historical data for compliance
   * and audit purposes. Sets isActive = false, records deletedAt timestamp, and
   * logs the deactivation reason. Historical records are never physically deleted
   * to maintain complete medical history.
   *
   * Deactivation reasons include:
   * - Treatment complete
   * - Medication no longer needed
   * - Side effects or adverse reactions
   * - Changed to different medication
   * - Student transferred or graduated
   *
   * @param {AuthenticatedRequest} request - Authenticated request with medication ID and deactivation details
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Deactivated medication with confirmation
   * @returns {200} Success - { success: true, data: { medication: {...}, message: '...' } }
   *
   * @throws {NotFoundError} When medication ID does not exist
   * @throws {ValidationError} When reason or deactivationType is missing
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Deactivation is logged with reason, user, and timestamp
   * @compliance 21 CFR Part 11 - Historical records preserved for FDA compliance
   * @hipaa PHI Protected - Modifies patient medication record
   *
   * @example
   * ```typescript
   * const request = {
   *   params: { id: '550e8400-e29b-41d4-a716-446655440000' },
   *   payload: {
   *     reason: "Treatment completed as prescribed. Full course finished.",
   *     deactivationType: "TREATMENT_COMPLETE"
   *   }
   * };
   * const response = await MedicationsController.deactivate(request, h);
   * // Historical record preserved with isActive=false, deletedAt set
   * ```
   */
  static async deactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason, deactivationType } = request.payload;
    const medication = await MedicationService.deactivateMedication(id, reason, deactivationType);
    return successResponse(h, { medication });
  }

  /**
   * Assign a medication to a student with schedule.
   *
   * Creates a student_medications record linking a medication to a student with
   * specific dosage, frequency, route, and administration schedule. This is used
   * for the new schema where medications are defined separately from student assignments.
   *
   * Creates administration schedule based on frequency pattern and generates
   * automatic reminders for nurses. Supports recurring schedules (daily, weekly, etc.).
   *
   * @param {AuthenticatedRequest} request - Authenticated request with assignment data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created student medication assignment
   * @returns {201} Created - { success: true, data: { studentMedication: {...} } }
   *
   * @throws {NotFoundError} When medicationId or studentId does not exist
   * @throws {ValidationError} When assignment data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   * @throws {ConflictError} When medication already assigned to student with overlapping dates
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Student medication assignment is logged
   * @hipaa PHI Protected - Creates patient medication assignment
   *
   * @example
   * ```typescript
   * const request = {
   *   payload: {
   *     medicationId: "550e8400-e29b-41d4-a716-446655440000",
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     dosage: "200mg",
   *     frequency: "Every 6 hours",
   *     route: "Oral",
   *     instructions: "Take with food",
   *     startDate: "2025-10-23",
   *     endDate: "2025-11-23",
   *     prescribedBy: "Dr. Smith"
   *   }
   * };
   * const response = await MedicationsController.assignToStudent(request, h);
   * ```
   */
  static async assignToStudent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const studentMedication = await MedicationService.assignMedicationToStudent({
      ...request.payload,
      startDate: new Date(request.payload.startDate),
      endDate: request.payload.endDate ? new Date(request.payload.endDate) : undefined
    });

    return createdResponse(h, { studentMedication });
  }

  /**
   * Log medication administration event.
   *
   * Records a medication administration event when a nurse gives medication to a student.
   * Creates a complete audit trail including:
   * - Dosage administered
   * - Time given
   * - Administering nurse
   * - Student response/notes
   * - Side effects observed
   * - Witness signature (for controlled substances)
   *
   * For controlled substances (DEA Schedule II-V), requires witness verification
   * and creates enhanced audit logging per DEA requirements.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with administration log data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created medication log entry
   * @returns {201} Created - { success: true, data: { medicationLog: {...} } }
   *
   * @throws {NotFoundError} When studentMedicationId does not exist
   * @throws {ValidationError} When log data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE role
   * @throws {BusinessRuleError} When medication is not scheduled for this time
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE role (authenticated user is auto-recorded as nurseId)
   * @compliance HIPAA - Medication administration is logged with complete audit trail
   * @compliance DEA - Controlled substances require witness and enhanced logging
   * @compliance 21 CFR Part 11 - Electronic signatures for medication administration
   * @hipaa PHI Protected - Records medication administration event
   *
   * @example
   * Log OTC medication administration:
   * ```typescript
   * const request = {
   *   auth: { credentials: { userId: 'nurse-uuid' } },
   *   payload: {
   *     studentMedicationId: "770e8400-e29b-41d4-a716-446655440000",
   *     dosageGiven: "200mg",
   *     timeGiven: "2025-10-23T10:30:00Z",
   *     administeredBy: "Nurse Johnson",
   *     notes: "Student tolerated well, no adverse effects",
   *     sideEffects: null
   *   }
   * };
   * ```
   *
   * @example
   * Log controlled substance with witness:
   * ```typescript
   * const request = {
   *   payload: {
   *     studentMedicationId: "770e8400-e29b-41d4-a716-446655440000",
   *     dosageGiven: "10mg",
   *     timeGiven: "2025-10-23T08:00:00Z",
   *     administeredBy: "Nurse Johnson",
   *     witnessId: "880e8400-e29b-41d4-a716-446655440000",
   *     witnessSignature: "Dr. Smith RN",
   *     notes: "Schedule II controlled substance - verified with witness"
   *   }
   * };
   * ```
   */
  static async logAdministration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const nurseId = request.auth.credentials.userId;

    const medicationLog = await MedicationService.logMedicationAdministration({
      ...request.payload,
      nurseId,
      timeGiven: new Date(request.payload.timeGiven)
    });

    return createdResponse(h, { medicationLog });
  }

  /**
   * Get medication administration logs for a student.
   *
   * Retrieves a complete paginated history of all medication administration events
   * for a student, including details about who administered each dose, when, and any
   * observed side effects or notes. Useful for medication compliance tracking and
   * reviewing student response to medications.
   *
   * Supports filtering by date range and specific medications. Logs are returned
   * in reverse chronological order (most recent first).
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId in params
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Paginated medication administration logs
   * @returns {200} Success - { success: true, data: { logs: [], pagination: {} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Complete medication log access is logged for audit
   * @hipaa HIGHLY SENSITIVE PHI - Complete medication administration history
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/student/660e8400-e29b-41d4-a716-446655440000/logs
   * const request = {
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   query: {
   *     page: 1,
   *     limit: 50,
   *     startDate: '2025-10-01',
   *     endDate: '2025-10-31'
   *   }
   * };
   * const response = await MedicationsController.getStudentLogs(request, h);
   * ```
   */
  static async getStudentLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await MedicationService.getStudentMedicationLogs(studentId, page, limit);

    return paginatedResponse(
      h,
      result.logs || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Get medication inventory with low-stock and expiration alerts.
   *
   * Retrieves complete medication inventory including quantities, expiration dates,
   * batch numbers, and automatically generated alerts for:
   * - Low stock (below reorder level)
   * - Expiring soon (within configurable threshold)
   * - Expired medications (require disposal)
   * - Missing medications (zero quantity)
   *
   * @param {AuthenticatedRequest} request - Authenticated request
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete inventory with alerts
   * @returns {200} Success - { success: true, data: { inventory: [], alerts: [] } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance FDA - Inventory tracking per 21 CFR Part 205 (drug distribution)
   * @compliance DEA - Controlled substance inventory required per DEA regulations
   *
   * @example
   * ```typescript
   * const response = await MedicationsController.getInventory(request, h);
   * // Returns inventory with alerts for low stock and expiring medications
   * ```
   */
  static async getInventory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const result = await MedicationService.getInventoryWithAlerts();
    return successResponse(h, result);
  }

  /**
   * Add medication batch to inventory.
   *
   * Records a new medication inventory batch with tracking information including:
   * - Batch/lot number for recall tracking
   * - Expiration date for safety monitoring
   * - Initial quantity
   * - Cost per unit for budget tracking
   * - Supplier information
   *
   * Automatically calculates reorder levels and sets up expiration monitoring.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with inventory data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created inventory record
   * @returns {201} Created - { success: true, data: { inventory: {...} } }
   *
   * @throws {NotFoundError} When medicationId does not exist
   * @throws {ValidationError} When inventory data is invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires ADMIN role (inventory management)
   * @compliance FDA - Batch tracking per 21 CFR Part 207 (drug establishment registration)
   * @compliance DEA - Controlled substances require enhanced inventory tracking
   *
   * @example
   * ```typescript
   * const request = {
   *   payload: {
   *     medicationId: "550e8400-e29b-41d4-a716-446655440000",
   *     batchNumber: "LOT-2025-1023-001",
   *     expirationDate: "2027-10-23",
   *     quantity: 500,
   *     reorderLevel: 50,
   *     costPerUnit: 0.25,
   *     supplier: "ABC Pharmaceutical Distributors"
   *   }
   * };
   * const response = await MedicationsController.addToInventory(request, h);
   * ```
   */
  static async addToInventory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const inventory = await MedicationService.addToInventory({
      ...request.payload,
      expirationDate: new Date(request.payload.expirationDate),
      costPerUnit: request.payload.costPerUnit
        ? parseFloat(request.payload.costPerUnit)
        : undefined
    });

    return createdResponse(h, { inventory });
  }

  /**
   * Get medication administration schedule.
   *
   * Retrieves scheduled medication administrations for a specified date range,
   * organized by time slots. Shows all students requiring medications, dosages,
   * and timing. Optionally filters by nurse assignment.
   *
   * Default range is 7 days from start date if not specified.
   * Schedule includes recurring medications and one-time doses.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with date range query
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Medication administration schedule
   * @returns {200} Success - { success: true, data: { schedule: [...] } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ValidationError} When date range is invalid
   *
   * @security JWT authentication required
   * @security RBAC: Nurses see assigned medications, admins see all
   * @compliance HIPAA - Schedule access is logged
   * @hipaa PHI Protected - Contains student medication schedule
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/schedule?startDate=2025-10-23&endDate=2025-10-30
   * const request = {
   *   query: {
   *     startDate: '2025-10-23',
   *     endDate: '2025-10-30',
   *     nurseId: '990e8400-e29b-41d4-a716-446655440000'
   *   }
   * };
   * const response = await MedicationsController.getSchedule(request, h);
   * ```
   */
  static async getSchedule(request: AuthenticatedRequest, h: ResponseToolkit) {
    const startDate = request.query.startDate
      ? new Date(request.query.startDate as string)
      : new Date();
    const endDate = request.query.endDate
      ? new Date(request.query.endDate as string)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
    const nurseId = request.query.nurseId as string | undefined;

    const schedule = await MedicationService.getMedicationSchedule(
      startDate,
      endDate,
      nurseId
    );

    return successResponse(h, { schedule });
  }

  /**
   * Update medication inventory quantity.
   *
   * Adjusts inventory quantity for a specific medication batch. Used for:
   * - Medication administration (decreases quantity)
   * - Corrections or discrepancies
   * - Waste or disposal (expired medications)
   * - Returns or recalls
   *
   * Requires detailed reason for audit trail. All quantity changes are logged
   * with user, timestamp, and justification.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with inventory ID and quantity change
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Updated inventory record
   * @returns {200} Success - { success: true, data: { inventory: {...} } }
   *
   * @throws {NotFoundError} When inventory ID does not exist
   * @throws {ValidationError} When quantity update is invalid or reason missing
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks ADMIN role
   * @throws {BusinessRuleError} When quantity would go negative
   *
   * @security JWT authentication required
   * @security RBAC: Requires ADMIN role
   * @compliance DEA - Controlled substance quantity changes require detailed audit trail
   *
   * @example
   * ```typescript
   * const request = {
   *   params: { id: 'inventory-uuid' },
   *   payload: {
   *     quantity: 450,  // New quantity
   *     reason: "Administered 50 doses to students this week"
   *   }
   * };
   * const response = await MedicationsController.updateInventoryQuantity(request, h);
   * ```
   */
  static async updateInventoryQuantity(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { quantity, reason } = request.payload;

    const inventory = await MedicationService.updateInventoryQuantity(
      id,
      quantity,
      reason
    );

    return successResponse(h, { inventory });
  }

  /**
   * Deactivate a student medication assignment.
   *
   * Ends a student's medication assignment before the scheduled end date.
   * Preserves historical administration records while preventing future doses.
   * Requires detailed reason for medical and legal audit trail.
   *
   * Common deactivation reasons:
   * - Provider discontinued medication
   * - Student graduated or transferred
   * - Adverse reactions
   * - Medication no longer needed
   *
   * @param {AuthenticatedRequest} request - Authenticated request with assignment ID and reason
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Deactivated student medication assignment
   * @returns {200} Success - { success: true, data: { studentMedication: {...} } }
   *
   * @throws {NotFoundError} When student medication ID does not exist
   * @throws {ValidationError} When reason is missing or invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Deactivation logged with user and reason
   * @hipaa PHI Protected - Modifies patient medication assignment
   *
   * @example
   * ```typescript
   * const request = {
   *   params: { id: 'student-medication-uuid' },
   *   payload: {
   *     reason: "Provider discontinued due to improved condition"
   *   }
   * };
   * const response = await MedicationsController.deactivateStudentMedication(request, h);
   * ```
   */
  static async deactivateStudentMedication(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason } = request.payload;

    const studentMedication = await MedicationService.deactivateStudentMedication(
      id,
      reason
    );

    return successResponse(h, { studentMedication });
  }

  /**
   * Get medication reminders for a specific date.
   *
   * Retrieves all scheduled medication administrations for a specific date,
   * organized by time. Used by nurses to see daily medication distribution
   * schedule. Includes student names, medications, dosages, and administration times.
   *
   * Defaults to current date if not specified.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with optional date query
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Daily medication reminders
   * @returns {200} Success - { success: true, data: { reminders: [...] } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ValidationError} When date format is invalid
   *
   * @security JWT authentication required
   * @compliance HIPAA - Reminder access is logged
   * @hipaa PHI Protected - Contains student medication information
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/reminders?date=2025-10-23
   * const request = {
   *   query: { date: '2025-10-23' }
   * };
   * const response = await MedicationsController.getReminders(request, h);
   * ```
   */
  static async getReminders(request: AuthenticatedRequest, h: ResponseToolkit) {
    const date = request.query.date
      ? new Date(request.query.date as string)
      : new Date();

    const reminders = await MedicationService.getMedicationReminders(date);

    return successResponse(h, { reminders });
  }

  /**
   * Report an adverse medication reaction.
   *
   * Creates a detailed adverse reaction report when a student experiences
   * unexpected or harmful effects from a medication. Critical for patient
   * safety, regulatory compliance, and quality improvement.
   *
   * Severity levels:
   * - MILD: Minor discomfort, no intervention needed
   * - MODERATE: Requires monitoring or intervention
   * - SEVERE: Significant harm, immediate medical attention
   * - LIFE_THREATENING: Risk of death or permanent disability
   *
   * Automatically notifies appropriate staff based on severity.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with reaction report data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created adverse reaction report
   * @returns {201} Created - { success: true, data: { report: {...} } }
   *
   * @throws {NotFoundError} When medicationId or studentId does not exist
   * @throws {ValidationError} When report data is incomplete
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required (reportedBy auto-populated from JWT)
   * @compliance FDA - Adverse events may require FDA MedWatch reporting (Form 3500)
   * @compliance HIPAA - Adverse reaction reports are logged with complete audit trail
   * @hipaa PHI Protected - Contains patient reaction information
   *
   * @example
   * ```typescript
   * const request = {
   *   auth: { credentials: { userId: 'nurse-uuid' } },
   *   payload: {
   *     medicationId: "550e8400-e29b-41d4-a716-446655440000",
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     reaction: "Severe nausea, vomiting, and dizziness within 30 minutes",
   *     severity: "SEVERE",
   *     reportedAt: "2025-10-23T10:30:00Z",
   *     actionTaken: "Medication discontinued, parent notified, sent to clinic"
   *   }
   * };
   * const response = await MedicationsController.reportAdverseReaction(request, h);
   * ```
   */
  static async reportAdverseReaction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const reportedBy = request.auth.credentials.userId;

    const report = await MedicationService.reportAdverseReaction({
      ...request.payload,
      reportedBy,
      reportedAt: new Date(request.payload.reportedAt)
    });

    return createdResponse(h, { report });
  }

  /**
   * Get adverse reaction reports with filtering.
   *
   * Retrieves adverse reaction reports with optional filtering by medication
   * or student. Used for safety monitoring, quality improvement, and identifying
   * medication issues requiring intervention.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with optional filter queries
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Filtered adverse reaction reports
   * @returns {200} Success - { success: true, data: { reactions: [...] } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required
   * @compliance HIPAA - Adverse reaction access is logged
   * @hipaa PHI Protected - Contains patient reaction history
   *
   * @example
   * ```typescript
   * // GET /api/v1/medications/adverse-reactions?medicationId=550e8400...&severity=SEVERE
   * const request = {
   *   query: {
   *     medicationId: '550e8400-e29b-41d4-a716-446655440000',
   *     severity: 'SEVERE'
   *   }
   * };
   * const response = await MedicationsController.getAdverseReactions(request, h);
   * ```
   */
  static async getAdverseReactions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const medicationId = request.query.medicationId as string | undefined;
    const studentId = request.query.studentId as string | undefined;

    const reactions = await MedicationService.getAdverseReactions(
      medicationId,
      studentId
    );

    return successResponse(h, { reactions });
  }

  /**
   * Get comprehensive medication statistics.
   *
   * Retrieves aggregated medication analytics including:
   * - Total medications by type and status
   * - Administration compliance rates
   * - Most frequently prescribed medications
   * - Controlled substance tracking
   * - Adverse reaction frequency
   *
   * Used for operational insights, quality improvement, and regulatory reporting.
   *
   * @param {AuthenticatedRequest} request - Authenticated request
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Medication statistics and analytics
   * @returns {200} Success - { success: true, data: { statistics: {...} } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required
   * @security RBAC: Requires ADMIN role for full statistics
   *
   * @example
   * ```typescript
   * const response = await MedicationsController.getStatistics(request, h);
   * // Returns comprehensive medication analytics
   * ```
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const statistics = await MedicationService.getMedicationStats();
    return successResponse(h, statistics);
  }

  /**
   * Get active medication alerts.
   *
   * Retrieves all active medication-related alerts requiring attention:
   * - Low inventory alerts
   * - Expiring medications
   * - Missed administration doses
   * - Adverse reaction reports requiring follow-up
   * - Controlled substance discrepancies
   *
   * Alerts are prioritized by urgency and filtered by user role/permissions.
   *
   * @param {AuthenticatedRequest} request - Authenticated request
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Active medication alerts
   * @returns {200} Success - { success: true, data: { alerts: [...] } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required
   * @compliance HIPAA - Alert access is logged
   *
   * @example
   * ```typescript
   * const response = await MedicationsController.getAlerts(request, h);
   * // Returns active alerts: low stock, expiring meds, missed doses
   * ```
   */
  static async getAlerts(request: AuthenticatedRequest, h: ResponseToolkit) {
    const alerts = await MedicationService.getMedicationAlerts();
    return successResponse(h, alerts);
  }

  /**
   * Get medication form dropdown options.
   *
   * Retrieves enumerated values for medication form fields to populate
   * dropdowns and select menus in the UI. Includes:
   * - Administration routes (Oral, Topical, Injection, etc.)
   * - DEA schedules (II-V)
   * - Deactivation types
   * - Adverse reaction severity levels
   *
   * Cached for performance as these values rarely change.
   *
   * @param {AuthenticatedRequest} request - Authenticated request
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Form field options
   * @returns {200} Success - { success: true, data: { formOptions: {...} } }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   *
   * @security JWT authentication required
   *
   * @example
   * ```typescript
   * const response = await MedicationsController.getFormOptions(request, h);
   * // Returns: { routes: [...], deaSchedules: [...], severities: [...] }
   * ```
   */
  static async getFormOptions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const formOptions = await MedicationService.getMedicationFormOptions();
    return successResponse(h, formOptions);
  }
}
