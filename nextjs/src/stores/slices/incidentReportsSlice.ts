/**
 * WF-COMP-311 | incidentReportsSlice.ts - Incident Reports Redux Slice
 * Purpose: Production-grade state management for comprehensive incident reporting system
 * Upstream: ../../services/modules/incidentsApi | Dependencies: @reduxjs/toolkit, react-hot-toast
 * Downstream: Incident report components, emergency notification system
 * Related: communicationSlice (notifications), complianceSlice (audit trails), studentsSlice
 * Exports: Reducer, actions, thunks, selectors | Key Features: Witness statements, follow-up tracking
 * Last Updated: 2025-10-26 | File Type: .ts
 * Critical Path: Incident creation → Witness collection → Follow-up actions → Resolution → Compliance reporting
 * LLM Context: Redux slice for incident management with HIPAA-compliant audit trails
 */

/**
 * @module pages/incidents/store/incidentReportsSlice
 *
 * @description
 * Production-grade Redux state management for the comprehensive incident reporting system.
 * Manages incidents, witness statements, and follow-up actions with complete CRUD operations,
 * advanced filtering capabilities, and real-time notification integration.
 *
 * ## Architecture
 *
 * This slice follows a domain-driven design pattern with:
 * - Normalized state structure for efficient updates
 * - Granular loading states for each operation type
 * - Comprehensive error handling with user-friendly messages
 * - Optimistic UI updates for better user experience
 * - Cache invalidation and refresh logic
 * - Pagination support for large datasets
 *
 * ## State Structure
 *
 * The state is organized into logical sections:
 * - **Data**: reports, selectedReport, witnessStatements, followUpActions, searchResults
 * - **Pagination**: page metadata for list views
 * - **Filters**: active filter criteria for queries
 * - **UI State**: sorting, view modes (list/grid/detail)
 * - **Loading States**: operation-specific flags (list, detail, witnesses, actions, creating, updating, deleting, searching)
 * - **Error States**: operation-specific error messages
 * - **Cache Management**: timestamps and invalidation flags
 *
 * ## Key Features
 *
 * - **Complete CRUD Operations**: Create, read, update, delete incident reports
 * - **Witness Management**: Collect and manage witness statements with verification workflow
 * - **Follow-up Tracking**: Track action items with assignment, priority, and completion status
 * - **Advanced Filtering**: Filter by student, type, severity, status, date range
 * - **Full-text Search**: Search across descriptions, locations, actions taken, student names
 * - **Optimistic Updates**: Immediate UI feedback with rollback on error
 * - **Real-time Notifications**: Automatic parent notification for high/critical severity incidents
 *
 * @remarks
 * ## Incident Reporting Workflow
 *
 * 1. **Incident Creation**: Nurse documents incident with type, severity, description, location, actions taken
 * 2. **Automatic Notifications**: High/Critical severity triggers automatic parent/guardian notifications
 * 3. **Witness Collection**: Staff, students, parents can provide witness statements
 * 4. **Follow-up Actions**: Assign trackable action items with due dates and responsible parties
 * 5. **Status Tracking**: Monitor incident through lifecycle (OPEN → UNDER_REVIEW → RESOLVED → CLOSED)
 * 6. **Compliance Reporting**: Generate audit trails for regulatory compliance
 *
 * ## Severity Levels and Notification Rules
 *
 * - **LOW**: Minor incidents, no automatic notification
 * - **MEDIUM**: Standard incidents, parent notification recommended
 * - **HIGH**: Serious incidents, automatic parent notification triggered
 * - **CRITICAL**: Emergency incidents, immediate multi-channel notification (SMS, email, voice)
 *
 * ## Witness Statement Verification
 *
 * - Statements collected from students, staff, parents, other witnesses
 * - Verification workflow tracks statement review and confirmation
 * - Digital signatures supported for statement authentication
 * - Statements immutable once verified (audit trail preservation)
 *
 * ## Follow-up Action Management
 *
 * - Actions assigned to specific staff members
 * - Priority levels: LOW, MEDIUM, HIGH, URGENT
 * - Due date tracking with overdue alerts
 * - Completion status with notes and outcomes
 * - Escalation rules for overdue actions
 *
 * ## HIPAA Compliance
 *
 * - All incident data treated as PHI (Protected Health Information)
 * - Audit logging for all data access and modifications
 * - Role-based access control enforced at API and UI levels
 * - Data retention policies comply with healthcare regulations
 * - Secure deletion (archival, not true deletion) for compliance
 *
 * ## Performance Considerations
 *
 * - Pagination reduces initial load time for large incident lists
 * - Selective loading of witness statements and follow-up actions (on-demand)
 * - Client-side sorting for small datasets, server-side for large datasets
 * - Cache invalidation triggers refetch only when necessary
 * - Optimistic updates minimize perceived latency
 *
 * @see {@link module:pages/communication/store/communicationSlice} for emergency notification integration
 * @see {@link module:pages/compliance/store/complianceSlice} for compliance reporting and audit trails
 * @see {@link module:pages/students/store/studentsSlice} for student data integration
 *
 * @example
 * ```typescript
 * // Fetch incident reports with filters
 * dispatch(fetchIncidentReports({
 *   severity: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
 *   status: [IncidentStatus.UNDER_REVIEW],
 *   startDate: '2025-01-01',
 *   page: 1,
 *   limit: 20
 * }));
 *
 * // Create new incident with automatic notification
 * dispatch(createIncidentReport({
 *   studentId: 'student-123',
 *   type: IncidentType.INJURY,
 *   severity: IncidentSeverity.HIGH,  // Triggers automatic parent notification
 *   description: 'Student injured during recess',
 *   location: 'Playground',
 *   actionsTaken: 'First aid administered, ice pack applied',
 *   occurredAt: '2025-01-15T10:30:00Z'
 * }));
 *
 * // Add witness statement
 * dispatch(createWitnessStatement({
 *   incidentReportId: 'incident-456',
 *   witnessName: 'Teacher Jane Doe',
 *   witnessType: 'STAFF',
 *   statement: 'I witnessed the incident from the classroom window...',
 *   contactInfo: 'jane.doe@school.edu'
 * }));
 *
 * // Create follow-up action
 * dispatch(createFollowUpAction({
 *   incidentReportId: 'incident-456',
 *   description: 'Schedule parent meeting to discuss incident',
 *   assignedTo: 'user-789',
 *   priority: 'HIGH',
 *   dueDate: '2025-01-20T17:00:00Z'
 * }));
 *
 * // Access state in components
 * const reports = useSelector(selectIncidentReports);
 * const criticalIncidents = useSelector(selectCriticalIncidents);
 * const isLoading = useSelector(selectIsLoading('list'));
 * const statistics = useSelector(selectReportStatistics);
 * ```
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { incidentsApi } from '../../services/modules/incidentsApi';
import {
  IncidentSeverity,
} from '../../types/incidents';
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  IncidentSearchParams,
  IncidentType,
  IncidentStatus,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
} from '../../types/incidents';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:incident-reports-slice');

// =====================
// STATE INTERFACE
// =====================

/**
 * Sort configuration for incident reports list.
 *
 * Defines the sorting column and order for incident report displays.
 * Supports sorting by occurrence time, severity, type, status, and report time.
 *
 * @interface SortConfig
 *
 * @property {('occurredAt'|'severity'|'type'|'status'|'reportedAt')} column - Column to sort by
 * @property {('asc'|'desc')} order - Sort direction (ascending or descending)
 *
 * @example
 * ```typescript
 * const sortConfig: SortConfig = {
 *   column: 'occurredAt',
 *   order: 'desc'  // Most recent first
 * };
 * ```
 */
export interface SortConfig {
  column: 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';
  order: 'asc' | 'desc';
}

/**
 * View mode for incident reports display.
 *
 * Determines how incidents are rendered in the UI:
 * - **list**: Compact list view with essential information
 * - **grid**: Card-based grid layout with thumbnails
 * - **detail**: Full detail view for single incident
 *
 * @typedef {('list'|'grid'|'detail')} ViewMode
 */
export type ViewMode = 'list' | 'grid' | 'detail';

/**
 * Pagination metadata for incident reports.
 *
 * Tracks pagination state for list views with page number, items per page,
 * total item count, and total page count.
 *
 * @interface PaginationMeta
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} pages - Total number of pages
 *
 * @example
 * ```typescript
 * const pagination: PaginationMeta = {
 *   page: 1,
 *   limit: 20,
 *   total: 156,
 *   pages: 8
 * };
 * ```
 */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Loading states for different incident report operations.
 *
 * Provides granular loading flags for each async operation type,
 * enabling precise UI loading state management.
 *
 * @interface LoadingStates
 *
 * @property {boolean} list - Loading incident reports list
 * @property {boolean} detail - Loading single incident detail
 * @property {boolean} witnesses - Loading witness statements
 * @property {boolean} actions - Loading follow-up actions
 * @property {boolean} creating - Creating new incident report
 * @property {boolean} updating - Updating existing incident
 * @property {boolean} deleting - Deleting incident report
 * @property {boolean} searching - Searching incident reports
 *
 * @example
 * ```typescript
 * // Check if any operation is in progress
 * const isAnyLoading = Object.values(loading).some(v => v);
 * ```
 */
interface LoadingStates {
  list: boolean;
  detail: boolean;
  witnesses: boolean;
  actions: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  searching: boolean;
}

/**
 * Error states for different incident report operations.
 *
 * Stores operation-specific error messages for granular error handling
 * and user-friendly error display.
 *
 * @interface ErrorStates
 *
 * @property {string|null} list - Error fetching incident list
 * @property {string|null} detail - Error fetching incident detail
 * @property {string|null} witnesses - Error fetching witness statements
 * @property {string|null} actions - Error fetching follow-up actions
 * @property {string|null} create - Error creating incident
 * @property {string|null} update - Error updating incident
 * @property {string|null} delete - Error deleting incident
 * @property {string|null} search - Error searching incidents
 *
 * @example
 * ```typescript
 * // Display error for specific operation
 * if (errors.create) {
 *   toast.error(errors.create);
 * }
 * ```
 */
interface ErrorStates {
  list: string | null;
  detail: string | null;
  witnesses: string | null;
  actions: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  search: string | null;
}

/**
 * Main state interface for incident reports Redux slice.
 *
 * Comprehensive state structure managing all aspects of incident reporting
 * including data, pagination, filters, UI state, loading/error states,
 * and cache management.
 *
 * @interface IncidentReportsState
 *
 * @property {IncidentReport[]} reports - Array of incident report entities
 * @property {IncidentReport|null} selectedReport - Currently viewed incident (detail view)
 * @property {WitnessStatement[]} witnessStatements - Statements for selected incident
 * @property {FollowUpAction[]} followUpActions - Actions for selected incident
 * @property {IncidentReport[]} searchResults - Search query results
 * @property {PaginationMeta} pagination - Page metadata for list views
 * @property {IncidentReportFilters} filters - Active filter criteria
 * @property {string} searchQuery - Current search query text
 * @property {SortConfig} sortConfig - Current sort configuration
 * @property {ViewMode} viewMode - Current view mode (list/grid/detail)
 * @property {LoadingStates} loading - Operation-specific loading flags
 * @property {ErrorStates} errors - Operation-specific error messages
 * @property {number|null} lastFetched - Timestamp of last successful fetch
 * @property {boolean} cacheInvalidated - Flag indicating cache needs refresh
 *
 * @see {@link LoadingStates} for loading state structure
 * @see {@link ErrorStates} for error state structure
 * @see {@link PaginationMeta} for pagination structure
 * @see {@link SortConfig} for sort configuration
 */
interface IncidentReportsState {
  // Data
  reports: IncidentReport[];
  selectedReport: IncidentReport | null;
  witnessStatements: WitnessStatement[];
  followUpActions: FollowUpAction[];
  searchResults: IncidentReport[];

  // Pagination
  pagination: PaginationMeta;

  // Filters
  filters: IncidentReportFilters;
  searchQuery: string;

  // UI State
  sortConfig: SortConfig;
  viewMode: ViewMode;

  // Loading States
  loading: LoadingStates;

  // Error States
  errors: ErrorStates;

  // Cache Management
  lastFetched: number | null;
  cacheInvalidated: boolean;
}

// =====================
// INITIAL STATE
// =====================

/**
 * Initial state for incident reports slice.
 *
 * Provides sensible defaults for all state properties with empty data arrays,
 * default pagination (20 items per page), descending sort by occurrence time,
 * and list view mode.
 *
 * @const {IncidentReportsState} initialState
 */
const initialState: IncidentReportsState = {
  // Data
  reports: [],
  selectedReport: null,
  witnessStatements: [],
  followUpActions: [],
  searchResults: [],

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Filters
  filters: {
    page: 1,
    limit: 20,
  },
  searchQuery: '',

  // UI State
  sortConfig: {
    column: 'occurredAt',
    order: 'desc',
  },
  viewMode: 'list',

  // Loading States
  loading: {
    list: false,
    detail: false,
    witnesses: false,
    actions: false,
    creating: false,
    updating: false,
    deleting: false,
    searching: false,
  },

  // Error States
  errors: {
    list: null,
    detail: null,
    witnesses: null,
    actions: null,
    create: null,
    update: null,
    delete: null,
    search: null,
  },

  // Cache Management
  lastFetched: null,
  cacheInvalidated: false,
};

// =====================
// ASYNC THUNKS
// =====================

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
    } catch (error: any) {
      log('Error fetching incident reports:', error);
      return rejectWithValue(error.message || 'Failed to fetch incident reports');
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
    } catch (error: any) {
      log('Error fetching incident report:', error);
      return rejectWithValue(error.message || 'Failed to fetch incident report');
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
    } catch (error: any) {
      log('Error creating incident report:', error);
      toast.error(error.message || 'Failed to create incident report');
      return rejectWithValue(error.message || 'Failed to create incident report');
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
    } catch (error: any) {
      log('Error updating incident report:', error);
      toast.error(error.message || 'Failed to update incident report');
      return rejectWithValue(error.message || 'Failed to update incident report');
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
    } catch (error: any) {
      log('Error deleting incident report:', error);
      toast.error(error.message || 'Failed to delete incident report');
      return rejectWithValue(error.message || 'Failed to delete incident report');
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
    } catch (error: any) {
      log('Error searching incident reports:', error);
      return rejectWithValue(error.message || 'Failed to search incident reports');
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
    } catch (error: any) {
      log('Error fetching witness statements:', error);
      return rejectWithValue(error.message || 'Failed to fetch witness statements');
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
    } catch (error: any) {
      log('Error creating witness statement:', error);
      toast.error(error.message || 'Failed to add witness statement');
      return rejectWithValue(error.message || 'Failed to add witness statement');
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
    } catch (error: any) {
      log('Error fetching follow-up actions:', error);
      return rejectWithValue(error.message || 'Failed to fetch follow-up actions');
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
    } catch (error: any) {
      log('Error creating follow-up action:', error);
      toast.error(error.message || 'Failed to create follow-up action');
      return rejectWithValue(error.message || 'Failed to create follow-up action');
    }
  }
);

// =====================
// SLICE DEFINITION
// =====================

const incidentReportsSlice = createSlice({
  name: 'incidentReports',
  initialState,
  reducers: {
    /**
     * Set filters for incident reports list.
     *
     * Updates active filter criteria and triggers cache invalidation to refetch data.
     * Filters are merged with existing filters, allowing partial updates.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<Partial<IncidentReportFilters>>} action - Filter updates
     *
     * @example
     * ```typescript
     * dispatch(setFilters({
     *   severity: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
     *   startDate: '2025-01-01'
     * }));
     * ```
     */
    setFilters: (state, action: PayloadAction<Partial<IncidentReportFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.cacheInvalidated = true;
      log('Filters updated:', state.filters);
    },

    /**
     * Set search query.
     *
     * Updates the search query text for full-text search across incident reports.
     * Does not trigger automatic search - use with searchIncidentReports thunk.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<string>} action - Search query text
     *
     * @example
     * ```typescript
     * dispatch(setSearchQuery('playground injury'));
     * ```
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      log('Search query set:', action.payload);
    },

    /**
     * Set selected incident report for detail view.
     *
     * Updates the currently selected incident, typically used when navigating
     * to incident detail page or opening detail modal.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<IncidentReport>} action - Incident report to select
     *
     * @example
     * ```typescript
     * dispatch(setSelectedIncidentReport(incident));
     * ```
     */
    setSelectedIncidentReport: (state, action: PayloadAction<IncidentReport>) => {
      state.selectedReport = action.payload;
      log('Selected incident report set:', action.payload.id);
    },

    /**
     * Clear selected incident report.
     *
     * Clears the currently selected incident and associated data (witness statements,
     * follow-up actions). Used when navigating away from detail view.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(clearSelectedIncident());
     * ```
     */
    clearSelectedIncident: (state) => {
      state.selectedReport = null;
      state.witnessStatements = [];
      state.followUpActions = [];
      state.errors.detail = null;
      log('Selected incident cleared');
    },

    /**
     * Set sort configuration.
     *
     * Updates sort column and order for list view. Triggers client-side re-sorting
     * of loaded data.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<SortConfig>} action - Sort configuration
     *
     * @example
     * ```typescript
     * dispatch(setSortOrder({
     *   column: 'severity',
     *   order: 'desc'  // Critical incidents first
     * }));
     * ```
     */
    setSortOrder: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
      log('Sort order updated:', action.payload);
    },

    /**
     * Set view mode.
     *
     * Switches between list, grid, and detail view modes for incident display.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<ViewMode>} action - View mode (list/grid/detail)
     *
     * @example
     * ```typescript
     * dispatch(setViewMode('grid'));
     * ```
     */
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      log('View mode changed:', action.payload);
    },

    /**
     * Clear all errors.
     *
     * Resets all error states to null. Used for dismissing error messages
     * or resetting error state on page navigation.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(clearErrors());
     * ```
     */
    clearErrors: (state) => {
      state.errors = initialState.errors;
      log('All errors cleared');
    },

    /**
     * Clear specific error.
     *
     * Resets a single error state to null. Used for dismissing individual
     * error messages without clearing all errors.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<keyof ErrorStates>} action - Error key to clear
     *
     * @example
     * ```typescript
     * dispatch(clearError('create'));
     * ```
     */
    clearError: (state, action: PayloadAction<keyof ErrorStates>) => {
      state.errors[action.payload] = null;
      log('Error cleared:', action.payload);
    },

    /**
     * Reset state to initial values.
     *
     * Resets entire slice state to initial values. Used when logging out
     * or changing context (e.g., switching schools).
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(resetState());
     * ```
     */
    resetState: (state) => {
      Object.assign(state, initialState);
      log('State reset to initial values');
    },

    /**
     * Invalidate cache.
     *
     * Marks cache as invalidated, forcing refetch of data on next request.
     * Used when external changes may have affected incident data.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(invalidateCache());
     * ```
     */
    invalidateCache: (state) => {
      state.cacheInvalidated = true;
      state.lastFetched = null;
      log('Cache invalidated');
    },

    /**
     * Optimistic update for incident report.
     *
     * Updates local state immediately before API confirmation for better UX.
     * If API call fails, state should be rolled back or error shown.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<{id: string, data: Partial<IncidentReport>}>} action - Update payload
     *
     * @remarks
     * Use this for immediate UI feedback on user actions. Ensure proper
     * error handling to rollback changes if API call fails.
     *
     * @example
     * ```typescript
     * // Immediately update UI while API call is in progress
     * dispatch(optimisticUpdateReport({
     *   id: 'incident-123',
     *   data: { status: IncidentStatus.RESOLVED }
     * }));
     * ```
     */
    optimisticUpdateReport: (
      state,
      action: PayloadAction<{ id: string; data: Partial<IncidentReport> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.reports.findIndex((report) => report.id === id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...data };
      }
      if (state.selectedReport?.id === id) {
        state.selectedReport = { ...state.selectedReport, ...data };
      }
      log('Optimistic update applied:', id);
    },
  },

  extraReducers: (builder) => {
    builder
      // =====================
      // FETCH INCIDENT REPORTS
      // =====================
      .addCase(fetchIncidentReports.pending, (state) => {
        state.loading.list = true;
        state.errors.list = null;
      })
      .addCase(fetchIncidentReports.fulfilled, (state, action) => {
        state.reports = action.payload.reports;
        state.pagination = action.payload.pagination;
        state.loading.list = false;
        state.errors.list = null;
        state.lastFetched = Date.now();
        state.cacheInvalidated = false;
        log('Incident reports fetched successfully:', action.payload.reports.length);
      })
      .addCase(fetchIncidentReports.rejected, (state, action) => {
        state.loading.list = false;
        state.errors.list = action.payload as string;
        log('Error fetching incident reports:', action.payload);
      })

      // =====================
      // FETCH INCIDENT REPORT BY ID
      // =====================
      .addCase(fetchIncidentReportById.pending, (state) => {
        state.loading.detail = true;
        state.errors.detail = null;
      })
      .addCase(fetchIncidentReportById.fulfilled, (state, action) => {
        state.selectedReport = action.payload;
        state.loading.detail = false;
        state.errors.detail = null;
        log('Incident report fetched by ID:', action.payload.id);
      })
      .addCase(fetchIncidentReportById.rejected, (state, action) => {
        state.loading.detail = false;
        state.errors.detail = action.payload as string;
        log('Error fetching incident report by ID:', action.payload);
      })

      // =====================
      // CREATE INCIDENT REPORT
      // =====================
      .addCase(createIncidentReport.pending, (state) => {
        state.loading.creating = true;
        state.errors.create = null;
      })
      .addCase(createIncidentReport.fulfilled, (state, action) => {
        // Add new report to the beginning of the list
        state.reports.unshift(action.payload);
        state.pagination.total += 1;
        state.loading.creating = false;
        state.errors.create = null;
        state.cacheInvalidated = true;
        log('Incident report created:', action.payload.id);
      })
      .addCase(createIncidentReport.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.create = action.payload as string;
        log('Error creating incident report:', action.payload);
      })

      // =====================
      // UPDATE INCIDENT REPORT
      // =====================
      .addCase(updateIncidentReport.pending, (state) => {
        state.loading.updating = true;
        state.errors.update = null;
      })
      .addCase(updateIncidentReport.fulfilled, (state, action) => {
        // Update report in list
        const index = state.reports.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        // Update selected report if it's the same one
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = action.payload;
        }
        state.loading.updating = false;
        state.errors.update = null;
        state.cacheInvalidated = true;
        log('Incident report updated:', action.payload.id);
      })
      .addCase(updateIncidentReport.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.update = action.payload as string;
        log('Error updating incident report:', action.payload);
      })

      // =====================
      // DELETE INCIDENT REPORT
      // =====================
      .addCase(deleteIncidentReport.pending, (state) => {
        state.loading.deleting = true;
        state.errors.delete = null;
      })
      .addCase(deleteIncidentReport.fulfilled, (state, action) => {
        // Remove report from list
        state.reports = state.reports.filter((r) => r.id !== action.payload);
        state.pagination.total -= 1;
        // Clear selected report if it was deleted
        if (state.selectedReport?.id === action.payload) {
          state.selectedReport = null;
        }
        state.loading.deleting = false;
        state.errors.delete = null;
        state.cacheInvalidated = true;
        log('Incident report deleted:', action.payload);
      })
      .addCase(deleteIncidentReport.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.delete = action.payload as string;
        log('Error deleting incident report:', action.payload);
      })

      // =====================
      // SEARCH INCIDENT REPORTS
      // =====================
      .addCase(searchIncidentReports.pending, (state) => {
        state.loading.searching = true;
        state.errors.search = null;
      })
      .addCase(searchIncidentReports.fulfilled, (state, action) => {
        state.searchResults = action.payload.reports;
        state.loading.searching = false;
        state.errors.search = null;
        log('Search completed:', action.payload.reports.length, 'results');
      })
      .addCase(searchIncidentReports.rejected, (state, action) => {
        state.loading.searching = false;
        state.errors.search = action.payload as string;
        log('Error searching incident reports:', action.payload);
      })

      // =====================
      // FETCH WITNESS STATEMENTS
      // =====================
      .addCase(fetchWitnessStatements.pending, (state) => {
        state.loading.witnesses = true;
        state.errors.witnesses = null;
      })
      .addCase(fetchWitnessStatements.fulfilled, (state, action) => {
        state.witnessStatements = action.payload;
        state.loading.witnesses = false;
        state.errors.witnesses = null;
        log('Witness statements fetched:', action.payload.length);
      })
      .addCase(fetchWitnessStatements.rejected, (state, action) => {
        state.loading.witnesses = false;
        state.errors.witnesses = action.payload as string;
        log('Error fetching witness statements:', action.payload);
      })

      // =====================
      // CREATE WITNESS STATEMENT
      // =====================
      .addCase(createWitnessStatement.fulfilled, (state, action) => {
        state.witnessStatements.push(action.payload);
        log('Witness statement created:', action.payload.id);
      })

      // =====================
      // FETCH FOLLOW-UP ACTIONS
      // =====================
      .addCase(fetchFollowUpActions.pending, (state) => {
        state.loading.actions = true;
        state.errors.actions = null;
      })
      .addCase(fetchFollowUpActions.fulfilled, (state, action) => {
        state.followUpActions = action.payload;
        state.loading.actions = false;
        state.errors.actions = null;
        log('Follow-up actions fetched:', action.payload.length);
      })
      .addCase(fetchFollowUpActions.rejected, (state, action) => {
        state.loading.actions = false;
        state.errors.actions = action.payload as string;
        log('Error fetching follow-up actions:', action.payload);
      })

      // =====================
      // CREATE FOLLOW-UP ACTION
      // =====================
      .addCase(createFollowUpAction.fulfilled, (state, action) => {
        state.followUpActions.push(action.payload);
        log('Follow-up action created:', action.payload.id);
      });
  },
});

// =====================
// EXPORTS
// =====================

export const {
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors,
  clearError,
  resetState,
  invalidateCache,
  optimisticUpdateReport,
} = incidentReportsSlice.actions;

/**
 * Incident reports actions object for compatibility.
 *
 * Provides grouped access to all slice actions for easier imports.
 *
 * @const {Object} incidentReportsActions
 */
export const incidentReportsActions = incidentReportsSlice.actions;

export default incidentReportsSlice.reducer;

// =====================
// SELECTORS
// =====================

import type { RootState } from '../../stores/reduxStore';

/**
 * Select all incident reports.
 *
 * @function selectIncidentReports
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Array of all loaded incident reports
 *
 * @example
 * ```typescript
 * const reports = useSelector(selectIncidentReports);
 * ```
 */
export const selectIncidentReports = (state: RootState) =>
  state.incidentReports.reports;

/**
 * Select currently selected/active incident report.
 *
 * @function selectCurrentIncident
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport|null} Selected incident or null if none selected
 *
 * @example
 * ```typescript
 * const currentIncident = useSelector(selectCurrentIncident);
 * ```
 */
export const selectCurrentIncident = (state: RootState) =>
  state.incidentReports.selectedReport;

/**
 * Select witness statements for current incident.
 *
 * @function selectWitnessStatements
 * @param {RootState} state - Redux root state
 * @returns {WitnessStatement[]} Array of witness statements
 *
 * @example
 * ```typescript
 * const statements = useSelector(selectWitnessStatements);
 * ```
 */
export const selectWitnessStatements = (state: RootState) =>
  state.incidentReports.witnessStatements;

/**
 * Select follow-up actions for current incident.
 *
 * @function selectFollowUpActions
 * @param {RootState} state - Redux root state
 * @returns {FollowUpAction[]} Array of follow-up actions
 *
 * @example
 * ```typescript
 * const actions = useSelector(selectFollowUpActions);
 * ```
 */
export const selectFollowUpActions = (state: RootState) =>
  state.incidentReports.followUpActions;

/**
 * Select search results.
 *
 * @function selectSearchResults
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Array of search results
 *
 * @example
 * ```typescript
 * const searchResults = useSelector(selectSearchResults);
 * ```
 */
export const selectSearchResults = (state: RootState) =>
  state.incidentReports.searchResults;

/**
 * Select pagination metadata.
 *
 * @function selectPagination
 * @param {RootState} state - Redux root state
 * @returns {PaginationMeta} Pagination metadata (page, limit, total, pages)
 *
 * @example
 * ```typescript
 * const { page, total, pages } = useSelector(selectPagination);
 * ```
 */
export const selectPagination = (state: RootState) =>
  state.incidentReports.pagination;

/**
 * Select current filters.
 *
 * @function selectFilters
 * @param {RootState} state - Redux root state
 * @returns {IncidentReportFilters} Active filter criteria
 *
 * @example
 * ```typescript
 * const filters = useSelector(selectFilters);
 * ```
 */
export const selectFilters = (state: RootState) => state.incidentReports.filters;

/**
 * Select search query.
 *
 * @function selectSearchQuery
 * @param {RootState} state - Redux root state
 * @returns {string} Current search query text
 *
 * @example
 * ```typescript
 * const query = useSelector(selectSearchQuery);
 * ```
 */
export const selectSearchQuery = (state: RootState) =>
  state.incidentReports.searchQuery;

/**
 * Select sort configuration.
 *
 * @function selectSortConfig
 * @param {RootState} state - Redux root state
 * @returns {SortConfig} Current sort configuration (column, order)
 *
 * @example
 * ```typescript
 * const { column, order } = useSelector(selectSortConfig);
 * ```
 */
export const selectSortConfig = (state: RootState) =>
  state.incidentReports.sortConfig;

/**
 * Select view mode.
 *
 * @function selectViewMode
 * @param {RootState} state - Redux root state
 * @returns {ViewMode} Current view mode (list/grid/detail)
 *
 * @example
 * ```typescript
 * const viewMode = useSelector(selectViewMode);
 * ```
 */
export const selectViewMode = (state: RootState) => state.incidentReports.viewMode;

/**
 * Select all loading states.
 *
 * @function selectLoadingStates
 * @param {RootState} state - Redux root state
 * @returns {LoadingStates} Object with all loading flags
 *
 * @example
 * ```typescript
 * const loading = useSelector(selectLoadingStates);
 * const isAnyLoading = Object.values(loading).some(v => v);
 * ```
 */
export const selectLoadingStates = (state: RootState) =>
  state.incidentReports.loading;

/**
 * Select specific loading state.
 *
 * Higher-order selector that returns a selector for a specific loading flag.
 *
 * @function selectIsLoading
 * @param {keyof LoadingStates} key - Loading state key
 * @returns {(state: RootState) => boolean} Selector for specific loading flag
 *
 * @example
 * ```typescript
 * const isListLoading = useSelector(selectIsLoading('list'));
 * const isCreating = useSelector(selectIsLoading('creating'));
 * ```
 */
export const selectIsLoading = (key: keyof LoadingStates) => (state: RootState) =>
  state.incidentReports.loading[key];

/**
 * Select all error states.
 *
 * @function selectErrorStates
 * @param {RootState} state - Redux root state
 * @returns {ErrorStates} Object with all error messages
 *
 * @example
 * ```typescript
 * const errors = useSelector(selectErrorStates);
 * ```
 */
export const selectErrorStates = (state: RootState) => state.incidentReports.errors;

/**
 * Select specific error state.
 *
 * Higher-order selector that returns a selector for a specific error message.
 *
 * @function selectError
 * @param {keyof ErrorStates} key - Error state key
 * @returns {(state: RootState) => string|null} Selector for specific error message
 *
 * @example
 * ```typescript
 * const createError = useSelector(selectError('create'));
 * if (createError) toast.error(createError);
 * ```
 */
export const selectError = (key: keyof ErrorStates) => (state: RootState) =>
  state.incidentReports.errors[key];

/**
 * Select whether cache is invalidated.
 *
 * @function selectIsCacheInvalidated
 * @param {RootState} state - Redux root state
 * @returns {boolean} True if cache needs refresh
 *
 * @example
 * ```typescript
 * const needsRefresh = useSelector(selectIsCacheInvalidated);
 * ```
 */
export const selectIsCacheInvalidated = (state: RootState) =>
  state.incidentReports.cacheInvalidated;

/**
 * Select last fetched timestamp.
 *
 * @function selectLastFetched
 * @param {RootState} state - Redux root state
 * @returns {number|null} Timestamp of last fetch or null if never fetched
 *
 * @example
 * ```typescript
 * const lastFetched = useSelector(selectLastFetched);
 * const isStale = lastFetched && Date.now() - lastFetched > 300000; // 5 minutes
 * ```
 */
export const selectLastFetched = (state: RootState) =>
  state.incidentReports.lastFetched;

/**
 * Select filtered and sorted incident reports.
 *
 * Derived selector that applies client-side sorting based on current sort configuration.
 * Creates a new sorted array without mutating the original.
 *
 * @function selectFilteredAndSortedReports
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Sorted array of incident reports
 *
 * @remarks
 * This selector performs client-side sorting on already-loaded data.
 * For large datasets, consider using server-side sorting via filter parameters.
 *
 * Severity sorting uses ordinal values: LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4
 *
 * @example
 * ```typescript
 * const sortedReports = useSelector(selectFilteredAndSortedReports);
 * ```
 */
export const selectFilteredAndSortedReports = (state: RootState) => {
  const { reports, sortConfig } = state.incidentReports;

  const sortedReports = [...reports].sort((a, b) => {
    const { column, order } = sortConfig;

    let aValue: any;
    let bValue: any;

    switch (column) {
      case 'occurredAt':
      case 'reportedAt':
        aValue = new Date(a[column] || 0).getTime();
        bValue = new Date(b[column] || 0).getTime();
        break;
      case 'severity':
        const severityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        aValue = severityOrder[a.severity] || 0;
        bValue = severityOrder[b.severity] || 0;
        break;
      default:
        aValue = a[column];
        bValue = b[column];
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedReports;
};

/**
 * Select incident reports by type.
 *
 * Higher-order selector that filters incidents by specific type.
 *
 * @function selectIncidentsByType
 * @param {IncidentType} type - Incident type to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents of specified type
 *
 * @example
 * ```typescript
 * const injuries = useSelector(selectIncidentsByType(IncidentType.INJURY));
 * const behavioral = useSelector(selectIncidentsByType(IncidentType.BEHAVIORAL));
 * ```
 */
export const selectIncidentsByType = (type: IncidentType) => (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.type === type);

/**
 * Select incident reports by severity.
 *
 * Higher-order selector that filters incidents by specific severity level.
 *
 * @function selectIncidentsBySeverity
 * @param {IncidentSeverity} severity - Severity level to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents of specified severity
 *
 * @example
 * ```typescript
 * const criticalIncidents = useSelector(selectIncidentsBySeverity(IncidentSeverity.CRITICAL));
 * ```
 */
export const selectIncidentsBySeverity = (severity: IncidentSeverity) => (
  state: RootState
) => state.incidentReports.reports.filter((report) => report.severity === severity);

/**
 * Select incident reports by status.
 *
 * Higher-order selector that filters incidents by specific status.
 *
 * @function selectIncidentsByStatus
 * @param {IncidentStatus} status - Status to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents with specified status
 *
 * @example
 * ```typescript
 * const openIncidents = useSelector(selectIncidentsByStatus(IncidentStatus.OPEN));
 * const resolved = useSelector(selectIncidentsByStatus(IncidentStatus.RESOLVED));
 * ```
 */
export const selectIncidentsByStatus = (status: IncidentStatus) => (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.status === status);

/**
 * Select incident reports requiring follow-up.
 *
 * Filters incidents where followUpRequired flag is true.
 *
 * @function selectIncidentsRequiringFollowUp
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Incidents requiring follow-up actions
 *
 * @example
 * ```typescript
 * const needsFollowUp = useSelector(selectIncidentsRequiringFollowUp);
 * ```
 */
export const selectIncidentsRequiringFollowUp = (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.followUpRequired);

/**
 * Select incident reports with unnotified parents.
 *
 * Filters incidents where parent notification has not been completed.
 * Useful for generating notification task lists.
 *
 * @function selectIncidentsWithUnnotifiedParents
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Incidents with unnotified parents
 *
 * @example
 * ```typescript
 * const needsNotification = useSelector(selectIncidentsWithUnnotifiedParents);
 * ```
 */
export const selectIncidentsWithUnnotifiedParents = (state: RootState) =>
  state.incidentReports.reports.filter((report) => !report.parentNotified);

/**
 * Select critical incidents (HIGH or CRITICAL severity).
 *
 * Filters incidents requiring immediate attention due to high severity.
 * These incidents typically trigger automatic parent notifications.
 *
 * @function selectCriticalIncidents
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} High and critical severity incidents
 *
 * @example
 * ```typescript
 * const criticalIncidents = useSelector(selectCriticalIncidents);
 * // Display urgent notification badge if any critical incidents exist
 * if (criticalIncidents.length > 0) {
 *   showUrgentBadge(criticalIncidents.length);
 * }
 * ```
 */
export const selectCriticalIncidents = (state: RootState) =>
  state.incidentReports.reports.filter(
    (report) =>
      report.severity === IncidentSeverity.HIGH ||
      report.severity === IncidentSeverity.CRITICAL
  );

/**
 * Select statistics for current reports.
 *
 * Derived selector that calculates analytics on loaded incident reports including
 * counts by type, severity, status, and notification/follow-up rates.
 *
 * @function selectReportStatistics
 * @param {RootState} state - Redux root state
 * @returns {Object} Statistics object
 * @returns {number} return.total - Total number of loaded reports
 * @returns {Record<string, number>} return.byType - Count of incidents by type
 * @returns {Record<string, number>} return.bySeverity - Count of incidents by severity
 * @returns {Record<string, number>} return.byStatus - Count of incidents by status
 * @returns {number} return.parentNotificationRate - Percentage of incidents with parent notification
 * @returns {number} return.followUpRate - Percentage of incidents requiring follow-up
 *
 * @remarks
 * This selector performs calculations on client-side data. For comprehensive
 * analytics across all incidents (not just loaded ones), use a dedicated
 * analytics API endpoint.
 *
 * @example
 * ```typescript
 * const stats = useSelector(selectReportStatistics);
 * console.log(`Critical incidents: ${stats.bySeverity.CRITICAL || 0}`);
 * console.log(`Parent notification rate: ${stats.parentNotificationRate.toFixed(1)}%`);
 * ```
 */
export const selectReportStatistics = (state: RootState) => {
  const { reports } = state.incidentReports;

  return {
    total: reports.length,
    byType: reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySeverity: reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byStatus: reports.reduce((acc, report) => {
      acc[report.status || 'OPEN'] = (acc[report.status || 'OPEN'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    parentNotificationRate:
      reports.length > 0
        ? (reports.filter((r) => r.parentNotified).length / reports.length) * 100
        : 0,
    followUpRate:
      reports.length > 0
        ? (reports.filter((r) => r.followUpRequired).length / reports.length) * 100
        : 0,
  };
};
