/**
 * @fileoverview Emergency Contacts Controller - Business logic for emergency contact management and notifications
 *
 * Manages emergency contact CRUD operations, multi-channel notification workflows, and contact
 * verification processes. Critical for emergency situations, ensuring schools can quickly reach
 * parents and guardians when student health or safety issues arise.
 *
 * Key responsibilities:
 * - Emergency contact management with priority levels (PRIMARY, SECONDARY, EMERGENCY_ONLY)
 * - Multi-channel notification dispatch (SMS, email, voice)
 * - Contact verification and validation
 * - Business rule enforcement (minimum PRIMARY contact requirement)
 * - Notification delivery tracking and reporting
 *
 * @module operations/controllers/emergencyContacts
 */

import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { EmergencyContactService } from '../../../../services/emergencyContactService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse
} from '../../../shared/utils';

/**
 * Emergency Contacts Controller
 *
 * Handles all emergency contact operations including creation, updates, deletion,
 * notification dispatch, and verification. Enforces critical business rules to ensure
 * every student has appropriate emergency contact coverage.
 *
 * @class EmergencyContactsController
 */
export class EmergencyContactsController {
  /**
   * Get all emergency contacts for a student
   *
   * Retrieves complete list of emergency contacts for a student, ordered by priority
   * level (PRIMARY, SECONDARY, EMERGENCY_ONLY). Used for contact management interfaces
   * and emergency notification workflows. Returns active contacts with full details
   * including phone, email, relationship, and notification preferences.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.studentId: Student UUID to retrieve contacts for
   *   - auth.credentials: JWT credentials for access control
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - contacts: Array of emergency contact objects ordered by priority
   * @throws {NotFoundError} When student ID does not exist
   * @throws {AuthorizationError} When user lacks access to student contacts
   *
   * @example
   * // Nurse retrieving student emergency contacts
   * const request = {
   *   params: { studentId: 'student-uuid-123' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.getStudentContacts(request, h);
   * // Returns: {
   * //   contacts: [
   * //     { id: 'contact-1', name: 'Jane Doe', relationship: 'MOTHER', priority: 'PRIMARY', phone: '555-0100' },
   * //     { id: 'contact-2', name: 'John Doe', relationship: 'FATHER', priority: 'PRIMARY', phone: '555-0101' }
   * //   ]
   * // }
   */
  static async getStudentContacts(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const contacts = await EmergencyContactService.getStudentEmergencyContacts(studentId);

    return successResponse(h, { contacts });
  }

  /**
   * Create new emergency contact
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const contact = await EmergencyContactService.createEmergencyContact(request.payload);

    return createdResponse(h, { contact });
  }

  /**
   * Update emergency contact
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const contact = await EmergencyContactService.updateEmergencyContact(id, request.payload);

    return successResponse(h, { contact });
  }

  /**
   * Delete emergency contact (soft delete) - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async delete(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await EmergencyContactService.deleteEmergencyContact(id);

    return h.response().code(204);
  }

  /**
   * Send emergency notification to all contacts for a student
   */
  static async sendEmergencyNotification(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const results = await EmergencyContactService.sendEmergencyNotification(
      studentId,
      request.payload
    );

    return successResponse(h, { results });
  }

  /**
   * Send notification to specific contact
   */
  static async sendContactNotification(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await EmergencyContactService.sendContactNotification(
      id,
      request.payload
    );

    return successResponse(h, { result });
  }

  /**
   * Verify emergency contact information
   */
  static async verifyContact(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { method } = request.payload;

    const result = await EmergencyContactService.verifyContact(id, method);

    return successResponse(h, { result });
  }

  /**
   * Get emergency contact statistics
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const stats = await EmergencyContactService.getContactStatistics();

    return successResponse(h, { stats });
  }

  /**
   * Get emergency contact by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const contact = await EmergencyContactService.getEmergencyContactById(id);

    if (!contact) {
      throw Boom.notFound('Emergency contact not found');
    }

    return successResponse(h, { contact });
  }
}
