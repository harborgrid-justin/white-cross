/**
 * Incident Reports Store - Async Thunks
 * 
 * Redux async thunks for incident reports operations
 * 
 * @module stores/slices/incidentReports/thunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { incidentsApi } from '@/services/modules/incidentsApi';
import type {
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  IncidentSearchParams,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
} from '@/types/domain/incidents';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:incident-reports-thunks');

/**
 * Fetch incident reports with pagination and filters.
 *
 * Retrieves paginated list of incident reports with optional filtering by student,
 * type, severity, status, and date range. Supports server-side pagination and sorting.
 *
 * @async
 * @function fetchIncidentReports
 *
 * @param {IncidentReportFilters} [filters] - Optional filter criteria
 * @param {string} [filters.studentId] - Filter by specific student
 * @param {IncidentType[]} [filters.types] - Filter by incident types
 * @param {IncidentSeverity[]} [filters.severity] - Filter by severity levels
 * @param {IncidentStatus[]} [filters.status] - Filter by status values
 * @param {string} [filters.startDate] - Filter by start date (ISO 8601)
 * @param {string} [filters.endDate] - Filter by end date (ISO 8601)
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 *
 * @returns {Promise<{reports: IncidentReport[], pagination: PaginationMeta}>} Paginated incident reports
 *
 * @throws {Error} When API request fails or user lacks permissions
 *
 * @example
 * ```typescript
 * // Fetch recent high-severity incidents
 * dispatch(fetchIncidentReports({
 *   severity: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
 *   startDate: '2025-01-01',
 *   page: 1,
 *   limit: 20
 * }));
 * ```
 */
export const fetchIncidentReports = createAsyncThunk(
  'incidentReports/fetchIncidentReports',
  async (filters: IncidentReportFilters | undefined, { rejectWithValue }) => {
    try {
      log('Fetching incident reports with filters:', filters);
      const response = await incidentsApi.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incident reports';
      log('Error fetching incident reports:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch single incident report by ID.
 *
 * Retrieves complete incident report with all associations including student data,
 * reporter information, witness statements, and follow-up actions.
 *
 * @async
 * @function fetchIncidentReportById
 *
 * @param {string} id - Incident report unique identifier
 *
 * @returns {Promise<IncidentReport>} Complete incident report with associations
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * This operation performs eager loading of related data. For performance,
 * witness statements and follow-up actions can be loaded separately using
 * `fetchWitnessStatements` and `fetchFollowUpActions` if needed.
 *
 * @example
 * ```typescript
 * // Load incident detail for editing
 * dispatch(fetchIncidentReportById('incident-123'));
 * ```
 */
export const fetchIncidentReportById = createAsyncThunk(
  'incidentReports/fetchIncidentReportById',
  async (id: string, { rejectWithValue }) => {
    try {
      log('Fetching incident report by ID:', id);
      const response = await incidentsApi.getById(id);
      return response.report;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incident report';
      log('Error fetching incident report:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create new incident report.
 *
 * Creates incident report with automatic parent notification for high/critical severity.
 * Implements optimistic UI updates for immediate feedback. Validates required fields
 * and enforces business rules before submission.
 *
 * @async
 * @function createIncidentReport
 *
 * @param {CreateIncidentReportRequest} data - Incident report data
 * @param {string} data.studentId - Student unique identifier
 * @param {IncidentType} data.type - Incident type (INJURY, ILLNESS, BEHAVIORAL, etc.)
 * @param {IncidentSeverity} data.severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
 * @param {string} data.description - Detailed incident description
 * @param {string} [data.location] - Incident location
 * @param {string} [data.actionsTaken] - Actions taken by staff
 * @param {string} data.occurredAt - Incident occurrence timestamp (ISO 8601)
 * @param {boolean} [data.parentNotified=false] - Whether parent was notified
 * @param {boolean} [data.followUpRequired=false] - Whether follow-up is needed
 *
 * @returns {Promise<IncidentReport>} Created incident report
 *
 * @throws {Error} When validation fails or API request fails
 *
 * @remarks
 * ## Automatic Notifications
 *
 * - **HIGH severity**: Triggers automatic parent/guardian email notification
 * - **CRITICAL severity**: Triggers multi-channel notification (email + SMS + voice call)
 *
 * ## Audit Trail
 *
 * All incident creations are logged in the compliance audit system with:
 * - User who created the report
 * - Creation timestamp
 * - IP address and session information
 *
 * @example
 * ```typescript
 * // Create injury incident with automatic notification
 * dispatch(createIncidentReport({
 *   studentId: 'student-123',
 *   type: IncidentType.INJURY,
 *   severity: IncidentSeverity.HIGH,
 *   description: 'Student fell on playground, scraped knee',
 *   location: 'Playground - Swing Set Area',
 *   actionsTaken: 'First aid administered, ice pack applied, bandage applied',
 *   occurredAt: new Date().toISOString(),
 *   parentNotified: false,  // Will be set to true after automatic notification
 *   followUpRequired: true
 * }));
 * ```
 */
export const createIncidentReport = createAsyncThunk(
  'incidentReports/createIncidentReport',
  async (data: CreateIncidentReportRequest, { rejectWithValue }) => {
    try {
      log('Creating incident report:', data);
      const response = await incidentsApi.create(data);
      toast.success('Incident report created successfully');
      return response.report;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create incident report';
      log('Error creating incident report:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update existing incident report.
 *
 * Updates incident report with partial data. Supports optimistic UI updates
 * for immediate feedback. Validates permissions and business rules before update.
 *
 * @async
 * @function updateIncidentReport
 *
 * @param {Object} params - Update parameters
 * @param {string} params.id - Incident report unique identifier
 * @param {UpdateIncidentReportRequest} params.data - Partial update data
 *
 * @returns {Promise<IncidentReport>} Updated incident report
 *
 * @throws {Error} When incident not found, validation fails, or user lacks permissions
 *
 * @remarks
 * Updates are subject to RBAC (Role-Based Access Control):
 * - Only the original reporter or administrators can update incidents
 * - Certain fields (e.g., student ID) cannot be modified after creation
 * - All updates are logged in the audit trail
 *
 * @example
 * ```typescript
 * // Update incident status and add resolution notes
 * dispatch(updateIncidentReport({
 *   id: 'incident-123',
 *   data: {
 *     status: IncidentStatus.RESOLVED,
 *     resolutionNotes: 'Parent contacted, follow-up scheduled',
 *     parentNotified: true
 *   }
 * }));
 * ```
 */
export const updateIncidentReport = createAsyncThunk(
  'incidentReports/updateIncidentReport',
  async (
    { id, data }: { id: string; data: UpdateIncidentReportRequest },
    { rejectWithValue }
  ) => {
    try {
      log('Updating incident report:', id, data);
      const response = await incidentsApi.update(id, data);
      toast.success('Incident report updated successfully');
      return response.report;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update incident report';
      log('Error updating incident report:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Delete incident report.
 *
 * Soft-deletes incident report for HIPAA compliance (archival rather than true deletion).
 * Requires administrator permissions. All related data (witness statements,
 * follow-up actions) are also archived.
 *
 * @async
 * @function deleteIncidentReport
 *
 * @param {string} id - Incident report unique identifier
 *
 * @returns {Promise<string>} Deleted incident ID
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * ## HIPAA Compliance Note
 *
 * This operation performs a soft delete (sets isActive=false) rather than
 * physically removing the record. This ensures:
 * - Audit trail preservation
 * - Data recovery capability if needed
 * - Compliance with healthcare data retention regulations
 *
 * Use with caution - consider changing status to CLOSED instead of deleting.
 *
 * @example
 * ```typescript
 * // Archive incident report (soft delete)
 * dispatch(deleteIncidentReport('incident-123'));
 * ```
 */
export const deleteIncidentReport = createAsyncThunk(
  'incidentReports/deleteIncidentReport',
  async (id: string, { rejectWithValue }) => {
    try {
      log('Deleting incident report:', id);
      await incidentsApi.delete(id);
      toast.success('Incident report deleted successfully');
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete incident report';
      log('Error deleting incident report:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Search incident reports.
 *
 * Performs full-text search across incident descriptions, locations, actions taken,
 * and student names. Supports pagination and returns ranked results by relevance.
 *
 * @async
 * @function searchIncidentReports
 *
 * @param {IncidentSearchParams} params - Search parameters
 * @param {string} params.query - Search query text
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string[]} [params.types] - Filter by incident types
 * @param {string[]} [params.severity] - Filter by severity levels
 *
 * @returns {Promise<{reports: IncidentReport[], pagination: PaginationMeta}>} Search results
 *
 * @throws {Error} When search fails or query is invalid
 *
 * @remarks
 * Search is performed server-side with full-text indexing for performance.
 * Results are ranked by relevance and filtered by user permissions.
 *
 * @example
 * ```typescript
 * // Search for playground injuries
 * dispatch(searchIncidentReports({
 *   query: 'playground injury',
 *   types: [IncidentType.INJURY],
 *   page: 1,
 *   limit: 10
 * }));
 * ```
 */
export const searchIncidentReports = createAsyncThunk(
  'incidentReports/searchIncidentReports',
  async (params: IncidentSearchParams, { rejectWithValue }) => {
    try {
      log('Searching incident reports:', params);
      const response = await incidentsApi.search(params);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search incident reports';
      log('Error searching incident reports:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch witness statements for incident.
 *
 * Retrieves all witness statements associated with the specified incident report.
 * Includes statement content, witness information, timestamps, and verification status.
 *
 * @async
 * @function fetchWitnessStatements
 *
 * @param {string} incidentReportId - Incident report unique identifier
 *
 * @returns {Promise<WitnessStatement[]>} Array of witness statements
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * Witness statements are immutable once marked as verified. This ensures
 * audit trail integrity and prevents tampering with evidence.
 *
 * @example
 * ```typescript
 * // Load witness statements for incident detail view
 * dispatch(fetchWitnessStatements('incident-123'));
 * ```
 */
export const fetchWitnessStatements = createAsyncThunk(
  'incidentReports/fetchWitnessStatements',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching witness statements for incident:', incidentReportId);
      const response = await incidentsApi.getWitnessStatements(incidentReportId);
      return response.statements;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch witness statements';
      log('Error fetching witness statements:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create witness statement.
 *
 * Records statement from student, staff member, parent, or other witness.
 * Captures statement content, witness information, and contact details.
 *
 * @async
 * @function createWitnessStatement
 *
 * @param {CreateWitnessStatementRequest} data - Witness statement data
 * @param {string} data.incidentReportId - Related incident ID
 * @param {string} data.witnessName - Name of witness providing statement
 * @param {('STUDENT'|'STAFF'|'PARENT'|'OTHER')} data.witnessType - Type of witness
 * @param {string} data.statement - Statement content
 * @param {string} [data.contactInfo] - Witness contact information
 *
 * @returns {Promise<WitnessStatement>} Created witness statement
 *
 * @throws {Error} When validation fails or API request fails
 *
 * @remarks
 * ## Verification Workflow
 *
 * 1. Statement is created in PENDING status
 * 2. Administrator reviews statement for completeness
 * 3. Administrator marks statement as VERIFIED
 * 4. Verified statements become immutable (audit trail preservation)
 *
 * ## Digital Signatures
 *
 * For legal compliance, witness statements can include digital signatures.
 * This provides non-repudiation and authenticity verification.
 *
 * @example
 * ```typescript
 * // Add teacher witness statement
 * dispatch(createWitnessStatement({
 *   incidentReportId: 'incident-123',
 *   witnessName: 'Jane Doe',
 *   witnessType: 'STAFF',
 *   statement: 'I observed the student fall from the swing...',
 *   contactInfo: 'jane.doe@school.edu'
 * }));
 * ```
 */
export const createWitnessStatement = createAsyncThunk(
  'incidentReports/createWitnessStatement',
  async (data: CreateWitnessStatementRequest, { rejectWithValue }) => {
    try {
      log('Creating witness statement:', data);
      const response = await incidentsApi.addWitnessStatement(data);
      toast.success('Witness statement added successfully');
      return response.statement;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add witness statement';
      log('Error creating witness statement:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch follow-up actions for incident.
 *
 * Retrieves all follow-up actions associated with the specified incident report.
 * Includes action descriptions, assignments, priorities, due dates, and completion status.
 *
 * @async
 * @function fetchFollowUpActions
 *
 * @param {string} incidentReportId - Incident report unique identifier
 *
 * @returns {Promise<FollowUpAction[]>} Array of follow-up actions
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * Follow-up actions support assignment tracking and automated escalation
 * for overdue items. Completion status is tracked with notes and outcomes.
 *
 * @example
 * ```typescript
 * // Load follow-up actions for incident detail view
 * dispatch(fetchFollowUpActions('incident-123'));
 * ```
 */
export const fetchFollowUpActions = createAsyncThunk(
  'incidentReports/fetchFollowUpActions',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching follow-up actions for incident:', incidentReportId);
      const response = await incidentsApi.getFollowUpActions(incidentReportId);
      return response.actions;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch follow-up actions';
      log('Error fetching follow-up actions:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create follow-up action.
 *
 * Creates trackable action item with assignment, priority, and due date.
 * Actions can be assigned to staff members with automatic notification.
 *
 * @async
 * @function createFollowUpAction
 *
 * @param {CreateFollowUpActionRequest} data - Follow-up action data
 * @param {string} data.incidentReportId - Related incident ID
 * @param {string} data.description - Action description
 * @param {string} [data.assignedTo] - User ID of assigned staff member
 * @param {('LOW'|'MEDIUM'|'HIGH'|'URGENT')} data.priority - Action priority
 * @param {string} [data.dueDate] - Due date (ISO 8601)
 *
 * @returns {Promise<FollowUpAction>} Created follow-up action
 *
 * @throws {Error} When validation fails or API request fails
 *
 * @remarks
 * ## Assignment Notification
 *
 * When an action is assigned to a staff member, they receive:
 * - Email notification with action details
 * - In-app notification
 * - Calendar event (if due date specified)
 *
 * ## Escalation Rules
 *
 * Overdue actions trigger automatic escalation:
 * - 1 day overdue: Reminder to assignee
 * - 3 days overdue: Notification to supervisor
 * - 7 days overdue: Notification to administrator
 *
 * @example
 * ```typescript
 * // Create urgent follow-up action with assignment
 * dispatch(createFollowUpAction({
 *   incidentReportId: 'incident-123',
 *   description: 'Schedule parent meeting to discuss incident',
 *   assignedTo: 'user-789',
 *   priority: 'URGENT',
 *   dueDate: '2025-01-20T17:00:00Z'
 * }));
 * ```
 */
export const createFollowUpAction = createAsyncThunk(
  'incidentReports/createFollowUpAction',
  async (data: CreateFollowUpActionRequest, { rejectWithValue }) => {
    try {
      log('Creating follow-up action:', data);
      const response = await incidentsApi.addFollowUpAction(data);
      toast.success('Follow-up action created successfully');
      return response.action;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up action';
      log('Error creating follow-up action:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
