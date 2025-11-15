/**
 * Incidents API - Core CRUD Operations
 *
 * @deprecated This service module is deprecated and will be removed on 2026-06-30.
 * Please migrate to Server Actions in @/lib/actions/incidents.* instead.
 *
 * **MIGRATION GUIDE**:
 * ```typescript
 * // ❌ OLD: Service Module Pattern
 * import { IncidentsCore } from '@/services/modules/incidentsApi/incidents';
 * const incidentsCore = new IncidentsCore(apiClient);
 *
 * const incidents = await incidentsCore.getAll({ page: 1, limit: 20, severity: 'HIGH' });
 * const incident = await incidentsCore.getById(id);
 * const result = await incidentsCore.create(data);
 * await incidentsCore.update(id, updates);
 * const stats = await incidentsCore.getStatistics({ dateFrom, dateTo });
 *
 * // ✅ NEW: Server Actions Pattern
 * import {
 *   getIncidents,
 *   getIncident,
 *   createIncident,
 *   updateIncident,
 *   deleteIncident
 * } from '@/lib/actions/incidents.crud';
 * import { getIncidentAnalytics } from '@/lib/actions/incidents.analytics';
 *
 * // CRUD operations (Server Components or Server Actions)
 * const response = await getIncidents({ page: 1, limit: 20, severity: 'HIGH' });
 * const incidents = response.incidents; // Note: returns { incidents, pagination }
 *
 * const incident = await getIncident(id);
 *
 * // Mutations (returns { success, id?, error? })
 * const result = await createIncident(data);
 * if (result.success) {
 *   console.log('Created incident:', result.id);
 * }
 *
 * const updateResult = await updateIncident(id, updates);
 * if (updateResult.success) {
 *   // Handle success
 * }
 *
 * // Analytics
 * const analytics = await getIncidentAnalytics({ dateFrom, dateTo });
 * ```
 *
 * **METHOD MAPPING**:
 * - `getAll()` → `getIncidents()` from `@/lib/actions/incidents.crud`
 * - `getById()` → `getIncident()` from `@/lib/actions/incidents.crud`
 * - `create()` → `createIncident()` from `@/lib/actions/incidents.crud`
 * - `update()` → `updateIncident()` from `@/lib/actions/incidents.crud`
 * - `delete()` → `deleteIncident()` from `@/lib/actions/incidents.crud`
 * - `search()` → Use `getIncidents()` with filter parameters
 * - `getStatistics()` → `getIncidentAnalytics()` from `@/lib/actions/incidents.analytics`
 * - `getFollowUpRequired()` → `getIncidentsRequiringFollowUp()` from `@/lib/actions/incidents.crud`
 * - `getStudentRecentIncidents()` → `getStudentRecentIncidents()` from `@/lib/actions/incidents.crud`
 *
 * **KEY DIFFERENCES**:
 * - Server Actions use `'use server'` directive
 * - Mutations return `{ success, id?, error? }` pattern
 * - Queries return data directly (cached)
 * - Automatic cache invalidation with `revalidatePath()`
 * - No need to instantiate classes
 *
 * Core incident report CRUD operations with search and statistics
 *
 * @module services/modules/incidentsApi/incidents
 */

import type { ApiClient } from '../../core/ApiClient';
import { extractApiData, handleApiError, buildUrlParams } from '../../utils/apiUtils';
import type {
  IncidentReportFilters,
  IncidentReportListResponse,
  IncidentReportResponse,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentSearchParams,
  IncidentStatisticsFilters,
  IncidentStatistics
} from './types';

/**
 * Core incident report operations
 */
export class IncidentsCore {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all incident reports with pagination and filtering
   *
   * Supports comprehensive filtering by student, type, severity, status, and date range
   *
   * @param params - Optional filters for querying incidents
   * @returns Paginated list of incident reports with metadata
   *
   * @example
   * ```typescript
   * const incidents = await incidentsCore.getAll({
   *   severity: IncidentSeverity.HIGH,
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   *
   * Backend: GET /incidents
   */
  async getAll(params?: IncidentReportFilters): Promise<IncidentReportListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.studentId) queryParams.append('studentId', params.studentId);
      if (params?.reportedById) queryParams.append('reportedById', params.reportedById);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.severity) queryParams.append('severity', params.severity);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params?.parentNotified !== undefined) queryParams.append('parentNotified', params.parentNotified.toString());
      if (params?.followUpRequired !== undefined) queryParams.append('followUpRequired', params.followUpRequired.toString());
      if (params?.location) queryParams.append('location', params.location);

      const response = await this.client.get(`/incidents?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get incident report by ID with full associations
   *
   * Includes student, reporter, witness statements, and follow-up actions
   *
   * @param id - Incident report ID (UUID)
   * @returns Single incident report with all related data
   * @throws ApiError if incident not found or access denied
   *
   * @example
   * ```typescript
   * const incident = await incidentsCore.getById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(incident.report.student?.name);
   * ```
   *
   * Backend: GET /incidents/{id}
   */
  async getById(id: string): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.get(`/incidents/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Create new incident report with automatic workflows and notifications
   *
   * Creates incident with severity-based parent notification, automatic follow-up
   * scheduling, and compliance tracking. Validates all required fields and PHI handling.
   *
   * @param {CreateIncidentReportRequest} data - Incident report creation data
   * @param {string} data.studentId - Student UUID (required)
   * @param {string} data.reportedById - Reporter user UUID (typically nurse or staff)
   * @param {IncidentType} data.type - Incident type (INJURY, ILLNESS, BEHAVIORAL, etc.)
   * @param {IncidentSeverity} data.severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
   * @param {string} data.description - Detailed incident description (required, max 5000 chars)
   * @param {string} data.location - Location where incident occurred
   * @param {string} data.occurredAt - ISO 8601 datetime when incident occurred
   * @param {string} data.actionsTaken - Actions taken by reporter (required)
   * @param {boolean} [data.followUpRequired] - Whether follow-up is needed (default: auto-determined by severity)
   * @param {string} [data.injuryDescription] - Detailed injury description for INJURY type
   * @returns {Promise<IncidentReportResponse>} Created incident with generated ID and associations
   * @throws {ValidationError} Required fields missing or invalid
   * @throws {ForbiddenError} User lacks permission to create incidents
   * @throws {ApiError} Network or server error during creation
   *
   * @remarks
   * **Automated Workflows**:
   * - **Parent Notification**: HIGH/CRITICAL severity triggers immediate multi-channel notification
   * - **Follow-up Creation**: Severity-based automatic follow-up task assignment
   * - **Compliance Tracking**: Legal compliance status initialized based on incident type
   * - **Witness Prompts**: System prompts for witness statements for INJURY/BEHAVIORAL incidents
   *
   * **Emergency Escalation**:
   * - CRITICAL severity → Immediate notification to parent, administrator, and emergency contacts
   * - Notification channels: SMS, Email, Push (parallel delivery)
   * - Escalation timer: If parent not reached within 15 minutes, escalate to emergency contacts
   * - Delivery tracking: All notification attempts logged for compliance
   *
   * **Real-time Notifications**:
   * - Socket.io event: `incident:created` emitted to dashboards
   * - Event payload: `{ incidentId, studentId, severity, type }`
   * - Subscribers: Nurse dashboard, admin dashboard, parent app
   * - Query invalidation: Invalidates incident list queries
   *
   * **TanStack Query Optimistic Updates**:
   * ```typescript
   * const { mutate } = useMutation({
   *   mutationFn: incidentsApi.create,
   *   onMutate: async (newIncident) => {
   *     await queryClient.cancelQueries(['incidents', 'list'])
   *     const previous = queryClient.getQueryData(['incidents', 'list'])
   *     queryClient.setQueryData(['incidents', 'list'], old => [newIncident, ...old])
   *     return { previous }
   *   },
   *   onError: (err, variables, context) => {
   *     queryClient.setQueryData(['incidents', 'list'], context.previous)
   *   },
   *   onSuccess: (data) => {
   *     queryClient.invalidateQueries(['incidents'])
   *     // Show success notification
   *     toast.success('Incident report created successfully')
   *   }
   * })
   * ```
   *
   * **Audit Trail**:
   * - Action logged: INCIDENT_CREATED
   * - PHI access: Student information, incident details
   * - Compliance: 7-year retention for legal requirements
   * - Immutable: Created incidents cannot be deleted, only updated/archived
   *
   * **Compliance Requirements**:
   * - FERPA: Student privacy protected, access control enforced
   * - State reporting: Certain incident types auto-flagged for state reporting
   * - Insurance: Injury incidents auto-linked to insurance claim workflow
   * - Legal: Serious incidents flagged for legal review
   *
   * @example
   * ```typescript
   * // Create playground injury incident
   * const { report } = await incidentsCore.create({
   *   studentId: 'student-uuid-123',
   *   reportedById: currentUser.id,
   *   type: 'INJURY',
   *   severity: 'MEDIUM',
   *   description: 'Student fell from monkey bars during recess. Complained of wrist pain.',
   *   location: 'Playground - Monkey Bar Area',
   *   occurredAt: new Date().toISOString(),
   *   actionsTaken: 'Applied ice pack to wrist, assessed for swelling. Student able to move fingers. Parent contacted and advised to monitor overnight.',
   *   injuryDescription: 'Possible wrist sprain, no visible deformity',
   *   followUpRequired: true
   * });
   * // MEDIUM severity triggers parent notification via email/SMS
   *
   * // Create critical allergic reaction incident
   * const { report: critical } = await incidentsCore.create({
   *   studentId: 'student-uuid-456',
   *   reportedById: currentUser.id,
   *   type: 'MEDICAL_EMERGENCY',
   *   severity: 'CRITICAL',
   *   description: 'Student experienced severe allergic reaction after lunch. Epinephrine administered.',
   *   location: 'Cafeteria',
   *   occurredAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
   *   actionsTaken: 'EpiPen administered at 12:15 PM. 911 called at 12:16 PM. Parent contacted at 12:17 PM. Ambulance arrived at 12:25 PM.',
   *   followUpRequired: true
   * });
   * // CRITICAL severity triggers immediate multi-channel emergency notification
   * // Parent, emergency contacts, and administrator notified simultaneously
   * ```
   *
   * Backend: POST /incidents
   */
  async create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post('/incidents', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Update existing incident report
   *
   * Supports partial updates with type safety
   * All fields are optional except id
   *
   * @param id - Incident report ID
   * @param data - Partial update data
   * @returns Updated incident report
   * @throws ApiError if update fails or incident not found
   *
   * @example
   * ```typescript
   * const updated = await incidentsCore.update(id, {
   *   severity: IncidentSeverity.HIGH,
   *   followUpRequired: true
   * });
   * ```
   *
   * Backend: PUT /incidents/{id}
   */
  async update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Delete incident report
   *
   * **WARNING**: Use with caution - consider archiving instead for compliance
   * Deletion may be restricted based on incident status and compliance requirements
   *
   * @param id - Incident report ID
   * @returns Success indicator
   * @throws ApiError if deletion not allowed or incident not found
   *
   * Backend: DELETE /incidents/{id}
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/${id}`);
      return response.data as { success: boolean };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Search incident reports
   *
   * Searches across description, location, actions taken, and student names
   * Supports pagination for large result sets
   *
   * @param params - Search parameters including query string
   * @returns Matching incident reports
   *
   * @example
   * ```typescript
   * const results = await incidentsCore.search({
   *   query: 'playground fall',
   *   page: 1,
   *   limit: 10
   * });
   * ```
   *
   * Backend: GET /incidents/search
   */
  async search(params: IncidentSearchParams): Promise<IncidentReportListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', params.query);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await this.client.get(`/incidents/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get incident statistics with optional date range filtering
   *
   * Returns analytics by type, severity, location, and notification rates
   * Useful for dashboard widgets and reporting
   *
   * @param params - Optional filters (date range, student)
   * @returns Aggregated incident statistics
   *
   * @example
   * ```typescript
   * const stats = await incidentsCore.getStatistics({
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31'
   * });
   * console.log(stats.byType, stats.bySeverity);
   * ```
   *
   * Backend: GET /incidents/statistics
   */
  async getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params?.studentId) queryParams.append('studentId', params.studentId);

      const queryString = queryParams.toString() ? `?${queryParams}` : '';
      const response = await this.client.get(`/incidents/statistics${queryString}`);
      return response.data as IncidentStatistics;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get incidents requiring follow-up
   *
   * Returns all open incidents with followUpRequired flag set to true
   * Sorted by severity and date
   *
   * @returns List of incidents requiring follow-up
   *
   * Backend: GET /incidents (filtered by followUpRequired=true)
   */
  async getFollowUpRequired(): Promise<IncidentReportListResponse> {
    try {
      const response = await this.client.get('/incidents?followUpRequired=true&status=OPEN');
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get recent incidents for a specific student
   *
   * Useful for displaying student incident history
   * Returns most recent incidents first
   *
   * @param studentId - Student ID
   * @param limit - Maximum number of incidents to return (default: 5)
   * @returns Recent incidents for the student
   *
   * @example
   * ```typescript
   * const recent = await incidentsCore.getStudentRecentIncidents(studentId, 10);
   * ```
   *
   * Backend: GET /incidents/student/{studentId}
   */
  async getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReportListResponse> {
    try {
      const response = await this.client.get(`/incidents/student/${studentId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }
}
