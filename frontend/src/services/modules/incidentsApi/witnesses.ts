/**
 * Incidents API - Witness Statements
 * 
 * Witness statement management with verification workflow
 * 
 * @module services/modules/incidentsApi/witnesses
 */

import type { ApiClient } from '../../core/ApiClient';
import { handleApiError } from '../../utils/apiUtils';
import type {
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementResponse,
  WitnessStatementListResponse
} from './types';

/**
 * Witness statement operations
 */
export class WitnessStatements {
  constructor(private readonly client: ApiClient) {}

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
   * const { statement } = await witnesses.add({
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
   * const { statement: studentStatement } = await witnesses.add({
   *   incidentReportId: incidentId,
   *   witnessName: 'Anonymous Student',
   *   witnessType: 'STUDENT',
   *   statement: 'I saw what happened. The student in the red jacket was swinging too hard and lost their grip. Nobody pushed them.',
   *   isAnonymous: true
   * });
   * // No verification email sent, witness identity protected
   * ```
   *
   * Backend: POST /incidents/{incidentReportId}/witnesses
   */
  async add(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/witnesses`, data);
      return response.data as WitnessStatementResponse;
    } catch (error) {
      throw handleApiError(error as Error);
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
  async update(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/incidents/witnesses/${id}`, data);
      return response.data as WitnessStatementResponse;
    } catch (error) {
      throw handleApiError(error as Error);
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
  async verify(statementId: string): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/incidents/witnesses/${statementId}/verify`);
      return response.data as WitnessStatementResponse;
    } catch (error) {
      throw handleApiError(error as Error);
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
  async getAll(incidentReportId: string): Promise<WitnessStatementListResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/witnesses`);
      return response.data as WitnessStatementListResponse;
    } catch (error) {
      throw handleApiError(error as Error);
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
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/witnesses/${id}`);
      return response.data as { success: boolean };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }
}
