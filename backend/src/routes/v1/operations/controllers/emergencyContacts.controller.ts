/**
 * Emergency Contacts Controller
 * Business logic for emergency contact management and notifications
 */

import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { EmergencyContactService } from '../../../../services/emergencyContactService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse
} from '../../../shared/utils';

export class EmergencyContactsController {
  /**
   * Get all emergency contacts for a student
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
