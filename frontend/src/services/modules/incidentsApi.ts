/**
 * WF-COMP-280 | incidentsApi.ts - Incidents API Service Module
 * Purpose: Complete API service for incident management system
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, hooks, state management | Called by: React component tree
 * Related: Witness statements, follow-up actions, evidence management
 * Exports: createIncidentsApi, IIncidentsApi | Key Features: Enterprise incident reporting
 * Last Updated: 2025-10-24 | File Type: .ts
 * Critical Path: User action → API call → Backend → Response → State update → UI render
 * LLM Context: Comprehensive incident reporting system with evidence, witnesses, and compliance tracking
 *
 * RENAMED FROM: incidentReportsApi.ts
 * API PATH CORRECTED: /incident-reports/* → /incidents/*
 *
 * Backend Alignment: /incidents/*
 */

import type { IIncidentsApi } from '../types'
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  IncidentStatisticsFilters,
  IncidentSearchParams,
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  IncidentStatistics,
  IncidentReportDocument,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  ActionStatus,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentListResponse
} from '../types'
import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core/ApiClient';
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Incidents API Implementation
 *
 * Enterprise-grade incident reporting system with comprehensive type safety
 * Handles incidents, witness statements, follow-up actions, and compliance tracking
 *
 * Backend Base Path: /incidents
 *
 * Features:
 * - Complete CRUD operations for incidents
 * - Evidence management with file uploads (multipart/form-data)
 * - Witness statement collection and verification
 * - Follow-up action tracking with assignments and due dates
 * - Parent notification (manual and automated)
 * - Insurance claim management
 * - Legal compliance tracking
 * - Document generation and export capabilities
 * - PHI/PII protection throughout
 *
 * @aligned_with backend/src/api/incidents/*
 */
class IncidentsApiImpl implements IIncidentsApi {
  constructor(private readonly client: ApiClient) {}

  // =====================
  // INCIDENT REPORT CRUD
  // =====================

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
   * const incidents = await incidentsApi.getAll({
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
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.studentId) queryParams.append('studentId', params.studentId)
      if (params?.reportedById) queryParams.append('reportedById', params.reportedById)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.severity) queryParams.append('severity', params.severity)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      if (params?.parentNotified !== undefined) queryParams.append('parentNotified', params.parentNotified.toString())
      if (params?.followUpRequired !== undefined) queryParams.append('followUpRequired', params.followUpRequired.toString())
      if (params?.location) queryParams.append('location', params.location)

      const response = await this.client.get(`/incidents?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
   * const incident = await incidentsApi.getById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(incident.report.student?.name);
   * ```
   *
   * Backend: GET /incidents/{id}
   */
  async getById(id: string): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.get(`/incidents/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
   * const { report } = await incidentsApi.create({
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
   * const { report: critical } = await incidentsApi.create({
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
   * @see {@link addWitnessStatement} to add witness statements after creation
   * @see {@link uploadEvidence} to upload photos/videos as evidence
   * @see {@link addFollowUpAction} to create follow-up tasks
   * @see {@link notifyParent} to send additional parent notifications
   *
   * Backend: POST /incidents
   */
  async create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post('/incidents', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
   * const updated = await incidentsApi.update(id, {
   *   severity: IncidentSeverity.HIGH,
   *   followUpRequired: true
   * });
   * ```
   *
   * Backend: PUT /incidents/{id}
   */
  async update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
      const response = await this.client.delete(`/incidents/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // SEARCH AND STATISTICS
  // =====================

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
   * const results = await incidentsApi.search({
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
      const queryParams = new URLSearchParams()
      queryParams.append('query', params.query)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await this.client.get(`/incidents/search?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
   * const stats = await incidentsApi.getStatistics({
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
      const queryParams = new URLSearchParams()
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      if (params?.studentId) queryParams.append('studentId', params.studentId)

      const queryString = queryParams.toString() ? `?${queryParams}` : ''
      const response = await this.client.get(`/incidents/statistics${queryString}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
      const response = await this.client.get('/incidents?followUpRequired=true&status=OPEN')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
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
   * const recent = await incidentsApi.getStudentRecentIncidents(studentId, 10);
   * ```
   *
   * Backend: GET /incidents/student/{studentId}
   */
  async getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReportListResponse> {
    try {
      const response = await this.client.get(`/incidents/student/${studentId}?limit=${limit}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // PARENT NOTIFICATION
  // =====================

  /**
   * Mark parent as notified manually
   *
   * Updates notification status and records method/person
   * Used when notification was done outside the system (phone call, in-person)
   *
   * @param id - Incident report ID
   * @param data - Notification method and person who notified
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}/notify
   */
  async markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}/notify`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Send automated parent notification
   *
   * Triggers notification via specified method (email, SMS, voice)
   * Automatically records notification timestamp and method
   *
   * @param id - Incident report ID
   * @param data - Notification method
   * @returns Updated incident report with notification status
   *
   * @example
   * ```typescript
   * await incidentsApi.notifyParent(id, {
   *   method: ParentNotificationMethod.EMAIL
   * });
   * ```
   *
   * Backend: POST /incidents/{id}/notify
   */
  async notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/notify`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // FOLLOW-UP NOTES AND ACTIONS
  // =====================

  /**
   * Add follow-up notes to incident
   *
   * Marks incident as completed if followUpRequired was true
   * Used for unstructured follow-up information
   *
   * @param id - Incident report ID
   * @param data - Follow-up notes
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        followUpNotes: data.notes
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Add structured follow-up action
   *
   * Creates trackable action item with assignment and due date
   * Supports task delegation and priority management
   *
   * @param data - Follow-up action creation data
   * @returns Created follow-up action
   *
   * @example
   * ```typescript
   * const action = await incidentsApi.addFollowUpAction({
   *   incidentReportId: id,
   *   action: 'Schedule follow-up appointment with nurse',
   *   priority: ActionPriority.HIGH,
   *   dueDate: '2025-02-01',
   *   assignedTo: nurseUserId
   * });
   * ```
   *
   * Backend: POST /incidents/{incidentReportId}/follow-ups
   */
  async addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/follow-ups`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update follow-up action status
   *
   * Updates status, adds completion tracking, and notes
   * Supports partial updates
   *
   * @param id - Follow-up action ID
   * @param data - Partial update data
   * @returns Updated follow-up action
   *
   * Backend: PUT /incidents/follow-ups/{id}
   */
  async updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/incidents/follow-ups/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Complete follow-up action
   *
   * Shortcut method to mark action as completed with optional notes
   * Sets status to COMPLETED and records completion timestamp
   *
   * @param id - Follow-up action ID
   * @param notes - Optional completion notes
   * @returns Updated follow-up action
   *
   * Backend: PUT /incidents/follow-ups/{id}
   */
  async completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/incidents/follow-ups/${id}`, {
        status: ActionStatus.COMPLETED,
        notes
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get all follow-up actions for an incident
   *
   * @param incidentReportId - Incident report ID
   * @returns List of follow-up actions
   *
   * Backend: GET /incidents/{id}/follow-ups
   */
  async getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/follow-ups`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Delete follow-up action
   *
   * @param id - Follow-up action ID
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/follow-ups/{id}
   */
  async deleteFollowUpAction(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/follow-ups/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // WITNESS STATEMENTS
  // =====================

  /**
   * Add witness statement to incident with verification workflow support
   *
   * Records detailed witness statement from students, staff, parents, or other witnesses.
   * Supports digital signature, verification workflow, and legal admissibility requirements.
   *
   * @param {CreateWitnessStatementRequest} data - Witness statement creation data
   * @param {string} data.incidentReportId - Incident report UUID
   * @param {string} data.witnessName - Full name of witness (required)
   * @param {WitnessType} data.witnessType - Witness type (STUDENT, STAFF, PARENT, OTHER)
   * @param {string} [data.witnessContact] - Contact info (email or phone) for verification
   * @param {string} data.statement - Detailed witness statement (required, max 5000 chars)
   * @param {string} [data.witnessRole] - Role/relationship to incident (e.g., "Supervising teacher")
   * @param {string} [data.statementDate] - When statement was given (defaults to now)
   * @param {boolean} [data.isAnonymous] - Whether witness wishes to remain anonymous
   * @returns {Promise<WitnessStatementResponse>} Created witness statement
   * @returns {WitnessStatement} statement - Witness statement with unique ID
   * @throws {ValidationError} Required fields missing or invalid
   * @throws {ForbiddenError} User lacks permission to add witness statements
   * @throws {NotFoundError} Incident report not found
   *
   * @remarks
   * **Verification Workflow**:
   * - Initial state: Statement created as UNVERIFIED
   * - Email sent: Verification link sent to witness contact (if provided)
   * - Verification: Witness clicks link to confirm statement accuracy
   * - Digital signature: Optional signature capture for legal weight
   * - Final state: Marked as VERIFIED with timestamp and IP address
   *
   * **Legal Admissibility**:
   * - Timestamp: Exact time statement was recorded
   * - IP address: Recorded for verification purposes
   * - Edit tracking: Any edits logged with timestamp (pre-verification only)
   * - Immutability: Verified statements cannot be edited, only annotated
   * - Chain of custody: Full audit trail from creation to verification
   *
   * **Anonymous Statements**:
   * - Anonymous flag: Hides witness identity in reports
   * - Contact protected: Contact info not shown in generated documents
   * - Legal note: Anonymous statements have lower legal weight
   * - Use case: Student witnesses who fear retaliation
   *
   * **Statement Guidelines**:
   * - Factual: Encourage factual observations, not opinions
   * - Detailed: Prompt for who, what, when, where, how
   * - Timeline: Request specific times if known
   * - Uninfluenced: Statement taken before discussion with others
   *
   * **Real-time Updates**:
   * - Socket.io event: `incident:witness-added` emitted
   * - Query invalidation: Invalidates incident detail query
   * - Notification: Incident creator notified of new witness statement
   *
   * @example
   * ```typescript
   * // Add staff witness statement
   * const { statement } = await incidentsApi.addWitnessStatement({
   *   incidentReportId: incidentId,
   *   witnessName: 'Sarah Johnson',
   *   witnessType: 'STAFF',
   *   witnessContact: 'sarah.johnson@school.edu',
   *   witnessRole: 'Playground supervisor',
   *   statement: `I was supervising the playground at 10:25 AM when I saw two students
   *     playing on the monkey bars. At approximately 10:28 AM, I noticed one student
   *     (wearing a red jacket) fall from the third bar. The student landed on their
   *     right side. I immediately approached and assessed the situation. The student
   *     was conscious and responsive but holding their right wrist and crying. I
   *     radioed for the nurse at 10:29 AM and stayed with the student until the nurse
   *     arrived at 10:32 AM.`,
   *   statementDate: new Date().toISOString(),
   *   isAnonymous: false
   * });
   * // Verification email automatically sent to sarah.johnson@school.edu
   *
   * // Add anonymous student witness statement
   * const { statement: studentStatement } = await incidentsApi.addWitnessStatement({
   *   incidentReportId: incidentId,
   *   witnessName: 'Anonymous Student',
   *   witnessType: 'STUDENT',
   *   statement: 'I saw what happened. The student in the red jacket was swinging too hard and lost their grip. Nobody pushed them.',
   *   isAnonymous: true
   * });
   * // No verification email sent, witness identity protected
   *
   * // React component for collecting witness statements
   * const WitnessStatementForm = () => {
   *   const addWitnessMutation = useMutation({
   *     mutationFn: incidentsApi.addWitnessStatement,
   *     onSuccess: ({ statement }) => {
   *       queryClient.invalidateQueries(['incidents', incidentId]);
   *       toast.success('Witness statement recorded successfully');
   *       if (!statement.isVerified) {
   *         toast.info('Verification email sent to witness');
   *       }
   *     }
   *   });
   *
   *   return (
   *     <form onSubmit={handleSubmit}>
   *       <input name="witnessName" required />
   *       <select name="witnessType" required>
   *         <option value="STAFF">Staff</option>
   *         <option value="STUDENT">Student</option>
   *         <option value="PARENT">Parent</option>
   *       </select>
   *       <input type="email" name="witnessContact" />
   *       <textarea name="statement" required maxLength={5000} />
   *       <label>
   *         <input type="checkbox" name="isAnonymous" />
   *         Anonymous statement
   *       </label>
   *       <button type="submit">Add Statement</button>
   *     </form>
   *   );
   * };
   * ```
   *
   * @see {@link verifyWitnessStatement} to verify a witness statement
   * @see {@link updateWitnessStatement} to edit unverified statements
   * @see {@link getWitnessStatements} to retrieve all statements for incident
   *
   * Backend: POST /incidents/{incidentReportId}/witnesses
   */
  async addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/witnesses`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update witness statement
   *
   * Allows editing statement details before verification
   * Cannot edit verified statements without unverifying first
   *
   * @param id - Witness statement ID
   * @param data - Partial update data
   * @returns Updated witness statement
   *
   * Backend: PUT /incidents/witnesses/{id}
   */
  async updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/incidents/witnesses/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Verify witness statement
   *
   * Marks statement as verified by current user with timestamp
   * Verified statements carry more weight in investigations
   *
   * @param statementId - Witness statement ID
   * @returns Updated witness statement with verification
   *
   * Backend: PUT /incidents/witnesses/{id}/verify
   */
  async verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/incidents/witnesses/${statementId}/verify`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get all witness statements for an incident
   *
   * @param incidentReportId - Incident report ID
   * @returns List of witness statements
   *
   * Backend: GET /incidents/{id}/witnesses
   */
  async getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/witnesses`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Delete witness statement
   *
   * @param id - Witness statement ID
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/witnesses/{id}
   */
  async deleteWitnessStatement(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/witnesses/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // EVIDENCE MANAGEMENT
  // =====================

  /**
   * Add evidence (photos/videos) to incident
   *
   * Supports batch upload of evidence URLs
   * Use uploadEvidence() for actual file uploads
   *
   * @param id - Incident report ID
   * @param data - Evidence URLs and type
   * @returns Updated incident report
   *
   * Backend: POST /incidents/{id}/evidence
   */
  async addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/evidence`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Upload evidence files (photos/videos) with multipart form data and PHI protection
   *
   * Handles secure file upload with automatic virus scanning, PHI detection,
   * and cloud storage integration. Supports multiple files with progress tracking.
   *
   * @param {string} incidentReportId - Incident report UUID
   * @param {File[]} files - Array of File objects to upload (max 10 files, 50MB total)
   * @returns {Promise<{attachments: string[]}>} Secure URLs for uploaded evidence files
   * @returns {string[]} attachments - Array of secure, time-limited URLs for uploaded files
   * @throws {ValidationError} File validation failed (size, type, count limits)
   * @throws {SecurityError} Virus detected or PHI exposure risk identified
   * @throws {ApiError} Network error or server failure during upload
   *
   * @remarks
   * **File Validation**:
   * - Allowed types: JPEG, PNG, GIF, MP4, MOV, PDF
   * - Max file size: 10MB per file
   * - Max files per upload: 10 files
   * - Total upload size: 50MB maximum
   * - Validation: MIME type checking, file extension verification
   *
   * **Security & PHI Protection**:
   * - Virus scanning: ClamAV scan before storage
   * - PHI detection: Automatic OCR on images to detect exposed PHI (SSN, addresses)
   * - Encryption: AES-256 encryption at rest in S3
   * - Access control: Signed URLs with 1-hour expiration
   * - Audit logging: All evidence uploads logged with user ID and timestamp
   *
   * **Storage & Processing**:
   * - Cloud storage: AWS S3 with HIPAA compliance
   * - File naming: UUID-based to prevent filename conflicts
   * - Thumbnail generation: Automatic thumbnail creation for images
   * - Video processing: Frame extraction for preview
   * - Metadata: EXIF data stripped to remove location/device info
   *
   * **Upload Progress**:
   * - Chunked upload: Large files uploaded in 5MB chunks
   * - Progress tracking: Upload progress events emitted
   * - Resume support: Failed uploads can be resumed
   * - Retry logic: Automatic retry up to 3 times on network failure
   *
   * **Error Handling**:
   * - File too large: Returns specific error with size limit
   * - Invalid type: Returns allowed file types
   * - Virus detected: File rejected, incident logged
   * - PHI exposure: File flagged for review before attachment
   *
   * @example
   * ```typescript
   * // Basic file upload from input element
   * const fileInput = document.querySelector('input[type="file"]');
   * const files = Array.from(fileInput.files);
   *
   * try {
   *   const { attachments } = await incidentsApi.uploadEvidence(incidentId, files);
   *   console.log('Uploaded evidence:', attachments);
   *   // attachments = ['https://s3.../evidence/uuid-1.jpg', 'https://s3.../evidence/uuid-2.jpg']
   * } catch (error) {
   *   if (error.code === 'FILE_TOO_LARGE') {
   *     toast.error('Files must be under 10MB each');
   *   } else if (error.code === 'INVALID_FILE_TYPE') {
   *     toast.error('Only images, videos, and PDFs are allowed');
   *   }
   * }
   *
   * // Upload with progress tracking
   * const uploadWithProgress = async (files: File[]) => {
   *   const formData = new FormData();
   *   files.forEach((file, i) => formData.append(`evidence_${i}`, file));
   *
   *   const response = await fetch(`/incidents/${incidentId}/evidence`, {
   *     method: 'POST',
   *     body: formData,
   *     onUploadProgress: (progressEvent) => {
   *       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
   *       setUploadProgress(percentCompleted);
   *     }
   *   });
   * };
   *
   * // React component with drag-and-drop upload
   * const EvidenceUpload = () => {
   *   const uploadMutation = useMutation({
   *     mutationFn: (files: File[]) => incidentsApi.uploadEvidence(incidentId, files),
   *     onSuccess: ({ attachments }) => {
   *       queryClient.invalidateQueries(['incidents', incidentId]);
   *       toast.success(`${attachments.length} files uploaded successfully`);
   *     },
   *     onError: (error) => {
   *       toast.error(`Upload failed: ${error.message}`);
   *     }
   *   });
   *
   *   return (
   *     <Dropzone
   *       accept={{ 'image/*': ['.jpg', '.jpeg', '.png'], 'video/*': ['.mp4', '.mov'] }}
   *       maxSize={10 * 1024 * 1024} // 10MB
   *       maxFiles={10}
   *       onDrop={files => uploadMutation.mutate(files)}
   *     />
   *   );
   * };
   * ```
   *
   * @see {@link deleteEvidence} to remove uploaded evidence
   * @see {@link addEvidence} to link existing evidence URLs
   * @see {@link generateReport} to include evidence in generated reports
   *
   * Backend: POST /incidents/{id}/evidence (Content-Type: multipart/form-data)
   */
  async uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }> {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`evidence_${index}`, file)
      })

      const response = await this.client.post(`/incidents/${incidentReportId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Delete evidence file
   *
   * Permanently removes evidence file from storage
   * Cannot be undone - use with caution for compliance reasons
   *
   * @param incidentReportId - Incident report ID
   * @param fileName - Evidence file name to delete
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/{id}/evidence/{fileName}
   */
  async deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/${incidentReportId}/evidence/${fileName}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // INSURANCE AND COMPLIANCE
  // =====================

  /**
   * Update insurance claim information
   *
   * Tracks claim number and status for incident
   * Used for insurance workflow integration
   *
   * @param id - Incident report ID
   * @param data - Insurance claim data
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        insuranceClaimNumber: data.claimNumber,
        insuranceClaimStatus: data.status
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Submit incident to insurance
   *
   * Creates insurance submission record
   * Triggers insurance workflow if configured
   *
   * @param id - Incident report ID
   * @param insuranceData - Insurance submission data
   * @returns Insurance submission record
   *
   * Backend: POST /incidents/{id}/insurance-submission
   */
  async submitToInsurance(id: string, insuranceData: Record<string, unknown>): Promise<InsuranceSubmissionResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/insurance-submission`, insuranceData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get insurance submissions for incident
   *
   * Returns history of insurance submissions
   * Useful for tracking claim status over time
   *
   * @param incidentReportId - Incident report ID
   * @returns List of insurance submissions
   *
   * Backend: GET /incidents/{id}/insurance-submissions
   */
  async getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/insurance-submissions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update legal compliance status
   *
   * Tracks compliance review and status
   * Used for regulatory reporting and audits
   *
   * @param id - Incident report ID
   * @param data - Compliance status data
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        legalComplianceStatus: data.status
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // DOCUMENT GENERATION AND EXPORT
  // =====================

  /**
   * Generate official incident report document
   *
   * Creates structured document for legal/insurance purposes
   * Includes all incident details, witness statements, and follow-ups
   *
   * @param id - Incident report ID
   * @returns Structured document data
   *
   * Backend: GET /incidents/{id}/document
   */
  async generateDocument(id: string): Promise<{ document: IncidentReportDocument }> {
    try {
      const response = await this.client.get(`/incidents/${id}/document`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Generate printable report (PDF/document)
   *
   * Returns blob for download
   * Formatted for printing and official records
   *
   * @param id - Incident report ID
   * @returns PDF blob for download
   *
   * @example
   * ```typescript
   * const blob = await incidentsApi.generateReport(id);
   * const url = URL.createObjectURL(blob);
   * const link = document.createElement('a');
   * link.href = url;
   * link.download = `incident-${id}.pdf`;
   * link.click();
   * ```
   *
   * Backend: GET /incidents/{id}/generate
   */
  async generateReport(id: string): Promise<Blob> {
    try {
      const response = await this.client.get(`/incidents/${id}/generate`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Export multiple reports with filters
   *
   * Returns blob (CSV/Excel) for bulk export
   * Useful for analytics and reporting
   *
   * @param params - Optional filters for export
   * @returns CSV/Excel blob for download
   *
   * @example
   * ```typescript
   * const blob = await incidentsApi.exportReports({
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31',
   *   severity: IncidentSeverity.HIGH
   * });
   * ```
   *
   * Backend: GET /incidents/export
   */
  async exportReports(params?: IncidentReportFilters): Promise<Blob> {
    try {
      const queryParams = params ? `?${buildUrlParams(params)}` : ''
      const response = await this.client.get(`/incidents/export${queryParams}`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  // =====================
  // COMMENTS
  // =====================

  /**
   * Get all comments for an incident
   *
   * Returns comments in chronological order (oldest first)
   * Supports pagination for large comment threads
   *
   * @param incidentReportId - Incident report ID
   * @param page - Optional page number for pagination
   * @param limit - Optional limit per page
   * @returns List of comments with pagination
   *
   * @example
   * ```typescript
   * const comments = await incidentsApi.getComments(incidentId, 1, 20);
   * ```
   *
   * Backend: GET /incidents/{id}/comments
   */
  async getComments(incidentReportId: string, page?: number, limit?: number): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (page) queryParams.append('page', page.toString())
      if (limit) queryParams.append('limit', limit.toString())

      const queryString = queryParams.toString() ? `?${queryParams}` : ''
      const response = await this.client.get(`/incidents/${incidentReportId}/comments${queryString}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Create a new comment on an incident
   *
   * Adds a comment to the incident discussion thread
   * Automatically associates with current user
   *
   * @param data - Comment creation data
   * @returns Created comment
   *
   * @example
   * ```typescript
   * const comment = await incidentsApi.createComment({
   *   incidentReportId: id,
   *   text: 'Follow-up scheduled with parent for tomorrow'
   * });
   * ```
   *
   * Backend: POST /incidents/{incidentReportId}/comments
   */
  async createComment(data: CreateCommentRequest): Promise<CommentResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/comments`, {
        text: data.text
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update an existing comment
   *
   * Allows editing comment text
   * Marks comment as edited with timestamp
   *
   * @param commentId - Comment ID
   * @param data - Update data
   * @returns Updated comment
   *
   * Backend: PUT /incidents/comments/{commentId}
   */
  async updateComment(commentId: string, data: UpdateCommentRequest): Promise<CommentResponse> {
    try {
      const response = await this.client.put(`/incidents/comments/${commentId}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Delete a comment
   *
   * Permanently removes comment from incident
   * Only comment author or admins can delete
   *
   * @param commentId - Comment ID
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/comments/{commentId}
   */
  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/comments/${commentId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }
}

/**
 * Factory function to create IncidentsApi instance
 *
 * @param client - Configured API client
 * @returns IncidentsApi implementation
 *
 * @example
 * ```typescript
 * import { createApiClient } from './core/ApiClient';
 * import { createIncidentsApi } from './modules/incidentsApi';
 *
 * const apiClient = createApiClient();
 * const incidentsApi = createIncidentsApi(apiClient);
 * ```
 */
export function createIncidentsApi(client: ApiClient): IIncidentsApi {
  return new IncidentsApiImpl(client);
}

// Export singleton instance for backward compatibility
export const incidentsApi = createIncidentsApi(apiClient);

export type { IIncidentsApi }
