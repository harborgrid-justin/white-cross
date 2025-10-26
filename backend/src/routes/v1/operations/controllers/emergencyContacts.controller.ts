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
import {
  EmergencyContactService,
  CreateEmergencyContactData,
  UpdateEmergencyContactData,
  NotificationData
} from '../../../../services/emergencyContactService';
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
   * Create new emergency contact for a student
   *
   * Creates a new emergency contact record with full contact information and notification
   * preferences. Validates business rules including phone/email format, relationship type,
   * and ensures at least one PRIMARY contact exists per student. Supports multiple contact
   * methods (phone, email) and priority levels for emergency notification workflows.
   *
   * Business Rules:
   * - Each student must have at least one PRIMARY contact
   * - Phone numbers validated for format (E.164 international format)
   * - Email addresses validated for RFC 5322 format
   * - Relationship type from predefined enum (MOTHER, FATHER, GUARDIAN, etc.)
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - payload.studentId: Student UUID to associate contact with (required)
   *   - payload.firstName: Contact first name (2-50 chars)
   *   - payload.lastName: Contact last name (2-50 chars)
   *   - payload.relationship: Relationship to student (MOTHER, FATHER, GUARDIAN, etc.)
   *   - payload.priority: Contact priority level (PRIMARY, SECONDARY, EMERGENCY_ONLY)
   *   - payload.phone: Primary phone number (optional but recommended)
   *   - payload.phoneSecondary: Secondary phone number (optional)
   *   - payload.email: Email address (optional but recommended)
   *   - payload.address: Physical address (optional)
   *   - payload.canPickup: Boolean indicating pickup authorization (default: false)
   *   - payload.notes: Additional notes about contact (optional, max 500 chars)
   *   - auth.credentials: JWT credentials with userId
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 201 response with:
   *   - contact: Created emergency contact object with generated UUID
   * @throws {ValidationError} When required fields missing or format invalid
   * @throws {NotFoundError} When student ID does not exist
   * @throws {ConflictError} When contact already exists with same name for student
   *
   * @example
   * // Nurse adding mother as primary emergency contact during enrollment
   * const request = {
   *   payload: {
   *     studentId: 'student-uuid-123',
   *     firstName: 'Jane',
   *     lastName: 'Doe',
   *     relationship: 'MOTHER',
   *     priority: 'PRIMARY',
   *     phone: '+15550100',
   *     phoneSecondary: '+15550101',
   *     email: 'jane.doe@email.com',
   *     canPickup: true,
   *     notes: 'Works from home, available during school hours'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.create(request, h);
   * // Returns: { contact: { id: 'contact-uuid', firstName: 'Jane', ... } }
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const contact = await EmergencyContactService.createEmergencyContact(
      request.payload as CreateEmergencyContactData
    );

    return createdResponse(h, { contact });
  }

  /**
   * Update emergency contact information
   *
   * Updates existing emergency contact details with partial field updates. Supports
   * modification of contact information, priority level, authorization status, and
   * notification preferences. Validates business rules to ensure at least one PRIMARY
   * contact remains active for the student.
   *
   * Business Rules:
   * - Cannot remove last PRIMARY contact for a student
   * - Phone/email format validation applied to any updated values
   * - Priority level changes validated for student contact coverage
   * - Audit trail maintained for all changes (HIPAA compliance)
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Emergency contact UUID to update (required)
   *   - payload.firstName: Updated first name (optional, 2-50 chars)
   *   - payload.lastName: Updated last name (optional, 2-50 chars)
   *   - payload.relationship: Updated relationship (optional)
   *   - payload.priority: Updated priority level (optional)
   *   - payload.phone: Updated primary phone (optional)
   *   - payload.phoneSecondary: Updated secondary phone (optional)
   *   - payload.email: Updated email address (optional)
   *   - payload.address: Updated physical address (optional)
   *   - payload.canPickup: Updated pickup authorization (optional)
   *   - payload.notes: Updated notes (optional, max 500 chars)
   *   - auth.credentials: JWT credentials with userId
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - contact: Updated emergency contact object with modified fields
   * @throws {NotFoundError} When emergency contact ID does not exist
   * @throws {ValidationError} When updated field values invalid
   * @throws {ConflictError} When update violates PRIMARY contact requirement
   *
   * @example
   * // Nurse updating contact phone number after parent notification
   * const request = {
   *   params: { id: 'contact-uuid-123' },
   *   payload: {
   *     phone: '+15550102',
   *     email: 'jane.doe.new@email.com',
   *     notes: 'Updated contact info as of 2024-11-01'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.update(request, h);
   * // Returns: { contact: { id: 'contact-uuid-123', phone: '+15550102', ... } }
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const contact = await EmergencyContactService.updateEmergencyContact(
      id,
      request.payload as UpdateEmergencyContactData
    );

    return successResponse(h, { contact });
  }

  /**
   * Delete emergency contact (soft delete)
   *
   * Performs soft deletion of emergency contact by setting isActive=false and recording
   * deletion timestamp and user. Contact record preserved for audit trail and historical
   * reference but excluded from active contact lists and notification workflows.
   *
   * Business Rules:
   * - Cannot delete last PRIMARY contact for a student (must have at least one)
   * - Soft delete only - record preserved in database for audit compliance
   * - Deletion logged in audit trail with userId and timestamp
   * - Successful deletion returns HTTP 204 No Content per REST standards
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Emergency contact UUID to delete (required)
   *   - auth.credentials: JWT credentials with userId for audit logging
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 204 No Content response (empty body)
   * @throws {NotFoundError} When emergency contact ID does not exist
   * @throws {ConflictError} When attempting to delete last PRIMARY contact
   * @throws {AuthorizationError} When user lacks permission to delete contacts
   *
   * @example
   * // Nurse removing outdated secondary contact
   * const request = {
   *   params: { id: 'contact-uuid-secondary' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.delete(request, h);
   * // Returns: HTTP 204 with empty body
   */
  static async delete(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await EmergencyContactService.deleteEmergencyContact(id);

    return h.response().code(204);
  }

  /**
   * Send emergency notification to all contacts for a student
   *
   * Dispatches urgent notifications through multiple channels (SMS, email, voice) to all
   * active emergency contacts ordered by priority level. Critical for immediate parent/guardian
   * notification during medical emergencies, injuries, or urgent situations requiring pickup.
   *
   * Notification Workflow:
   * (1) Retrieve all active emergency contacts for student
   * (2) Sort by priority: PRIMARY → SECONDARY → EMERGENCY_ONLY
   * (3) For each contact, attempt delivery via specified channels:
   *     - SMS: Via Twilio API if phone number present
   *     - Email: Via SendGrid if email address present
   *     - Voice: Via Twilio voice call if phone number present and CRITICAL severity
   * (4) Track delivery status for each contact/channel combination
   * (5) Log all attempts for audit trail and delivery confirmation
   * (6) Return comprehensive delivery report with success/failure details
   *
   * All notifications include:
   * - Student name and grade level
   * - Emergency type and severity level
   * - Callback number for school nurse or office
   * - Timestamp and school location
   *
   * CRITICAL PHI ENDPOINT - All notifications logged for HIPAA compliance
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.studentId: Student UUID to send notifications for (required)
   *   - payload.message: Emergency message text (10-1000 chars, required)
   *   - payload.channels: Array of channels ['SMS', 'EMAIL', 'VOICE'] (required)
   *   - payload.severity: Emergency severity 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' (required)
   *   - payload.emergencyType: Type of emergency (MEDICAL, INJURY, BEHAVIORAL, OTHER)
   *   - payload.callbackNumber: School phone for parents to call (optional, e.g., '555-SCHOOL-1')
   *   - payload.location: School location where emergency occurred (optional)
   *   - auth.credentials: JWT credentials with userId for audit logging
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - results: Array of {contactId, name, channel, status, deliveredAt, error} per delivery attempt
   *   - summary: {total, successful, failed} delivery count summary
   * @throws {NotFoundError} When student has no active emergency contacts
   * @throws {ValidationError} When message, channels, or severity invalid
   *
   * @example
   * // Nurse sending critical emergency notification for injured student
   * const request = {
   *   params: { studentId: 'student-uuid-123' },
   *   payload: {
   *     message: 'Your child sustained a head injury during recess. Currently conscious and alert, ice applied. Monitoring for symptoms. Please call immediately.',
   *     channels: ['SMS', 'VOICE'],
   *     severity: 'CRITICAL',
   *     emergencyType: 'INJURY',
   *     callbackNumber: '555-SCHOOL-1',
   *     location: 'Playground - East Side'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.sendEmergencyNotification(request, h);
   * // Returns: {
   * //   results: [
   * //     { contactId: 'c1', name: 'Jane Doe', channel: 'SMS', status: 'DELIVERED', deliveredAt: '2024-11-01T14:23:00Z' },
   * //     { contactId: 'c1', name: 'Jane Doe', channel: 'VOICE', status: 'DELIVERED', deliveredAt: '2024-11-01T14:23:05Z' },
   * //     { contactId: 'c2', name: 'John Doe', channel: 'SMS', status: 'FAILED', error: 'Invalid phone number' }
   * //   ],
   * //   summary: { total: 3, successful: 2, failed: 1 }
   * // }
   */
  static async sendEmergencyNotification(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const payload = request.payload as NotificationData;
    const results = await EmergencyContactService.sendEmergencyNotification(
      studentId,
      request.payload as NotificationData
    );

    return successResponse(h, { results });
  }

  /**
   * Send notification to specific emergency contact
   *
   * Sends targeted notification to a single emergency contact through specified channel(s).
   * Used for non-emergency communications like appointment reminders, pickup notifications,
   * or contact verification requests. Unlike sendEmergencyNotification, this targets one
   * contact and supports lower-priority messaging workflows.
   *
   * Use Cases:
   * - Appointment reminder notifications
   * - Student pickup notifications
   * - Contact information verification requests
   * - General announcements or updates
   * - Test notifications for contact validation
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Emergency contact UUID to notify (required)
   *   - payload.message: Notification message text (10-1000 chars, required)
   *   - payload.channel: Single channel 'SMS' | 'EMAIL' | 'VOICE' (required)
   *   - payload.messageType: Type of message (REMINDER, PICKUP, VERIFICATION, ANNOUNCEMENT)
   *   - payload.callbackNumber: Optional callback number for replies
   *   - auth.credentials: JWT credentials with userId
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - result: Delivery result {status, deliveredAt, messageId, error}
   * @throws {NotFoundError} When emergency contact ID does not exist
   * @throws {ValidationError} When message or channel invalid
   * @throws {BadRequestError} When contact missing required info for channel (e.g., no phone for SMS)
   *
   * @example
   * // Nurse sending appointment reminder to specific parent
   * const request = {
   *   params: { id: 'contact-uuid-123' },
   *   payload: {
   *     message: 'Reminder: Your child has a health screening appointment tomorrow at 10:00 AM. Please ensure they arrive on time.',
   *     channel: 'SMS',
   *     messageType: 'REMINDER',
   *     callbackNumber: '555-SCHOOL-1'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.sendContactNotification(request, h);
   * // Returns: { result: { status: 'DELIVERED', deliveredAt: '2024-11-01T08:15:00Z', messageId: 'sms-123' } }
   */
  static async sendContactNotification(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const payload = request.payload as NotificationData;
    const result = await EmergencyContactService.sendContactNotification(
      id,
      request.payload as NotificationData
    );

    return successResponse(h, { result });
  }

  /**
   * Verify emergency contact information
   *
   * Initiates contact verification workflow to confirm phone/email validity and reachability.
   * Sends verification code or link via specified method and tracks verification status.
   * Ensures emergency contacts remain current and functional for critical notifications.
   *
   * Verification Process:
   * (1) Generate unique verification code (6 digits for SMS, token for email)
   * (2) Send verification message via specified method (SMS or EMAIL)
   * (3) Store verification attempt with expiration (15 minutes)
   * (4) Return verification ID for subsequent confirmation
   * (5) Mark contact as verified upon successful code entry
   *
   * Business Rules:
   * - Verification codes expire after 15 minutes
   * - Maximum 3 verification attempts per hour per contact
   * - Successful verification updates contact.verifiedAt timestamp
   * - Annual re-verification recommended for compliance
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Emergency contact UUID to verify (required)
   *   - payload.method: Verification method 'SMS' | 'EMAIL' (required)
   *   - auth.credentials: JWT credentials with userId
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - result: Verification result {verificationId, method, sentAt, expiresAt, attemptsRemaining}
   * @throws {NotFoundError} When emergency contact ID does not exist
   * @throws {ValidationError} When method invalid or contact missing required info
   * @throws {TooManyRequestsError} When verification attempts exceeded (rate limit)
   *
   * @example
   * // Nurse initiating SMS verification for newly added contact
   * const request = {
   *   params: { id: 'contact-uuid-123' },
   *   payload: {
   *     method: 'SMS'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.verifyContact(request, h);
   * // Returns: {
   * //   result: {
   * //     verificationId: 'verify-uuid',
   * //     method: 'SMS',
   * //     sentAt: '2024-11-01T09:00:00Z',
   * //     expiresAt: '2024-11-01T09:15:00Z',
   * //     attemptsRemaining: 2
   * //   }
   * // }
   */
  static async verifyContact(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { method } = request.payload as { method: 'sms' | 'email' | 'voice' };

    const result = await EmergencyContactService.verifyContact(id, method);

    return successResponse(h, { result });
  }

  /**
   * Get emergency contact statistics and analytics
   *
   * Retrieves comprehensive analytics on emergency contact coverage, verification status,
   * notification delivery rates, and compliance metrics. Used for administrative oversight,
   * compliance reporting, and identifying students with incomplete contact information.
   *
   * Statistics Included:
   * - Total contacts by priority level (PRIMARY, SECONDARY, EMERGENCY_ONLY)
   * - Contact coverage: students with 0, 1, 2+ PRIMARY contacts
   * - Verification status: verified vs unverified contacts
   * - Notification delivery rates by channel (SMS, EMAIL, VOICE)
   * - Contact relationship distribution (MOTHER, FATHER, GUARDIAN, etc.)
   * - Average contacts per student
   * - Students missing required contact information
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - auth.credentials: JWT credentials (ADMIN role recommended for full stats)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - stats: Statistics object with contact analytics and compliance metrics
   * @throws {AuthorizationError} When user lacks permission for statistics access
   *
   * @example
   * // Admin reviewing emergency contact compliance metrics
   * const request = {
   *   auth: { credentials: { userId: 'admin-uuid', roles: ['ADMIN'] } }
   * };
   * const response = await EmergencyContactsController.getStatistics(request, h);
   * // Returns: {
   * //   stats: {
   * //     totalContacts: 523,
   * //     byPriority: { PRIMARY: 310, SECONDARY: 178, EMERGENCY_ONLY: 35 },
   * //     coverage: { noContacts: 3, oneContact: 12, twoOrMore: 140 },
   * //     verificationRate: 0.87,
   * //     deliveryRates: { SMS: 0.94, EMAIL: 0.89, VOICE: 0.76 },
   * //     averageContactsPerStudent: 3.37,
   * //     missingInfo: { noPhone: 8, noEmail: 42 }
   * //   }
   * // }
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const stats = await EmergencyContactService.getContactStatistics();

    return successResponse(h, { stats });
  }

  /**
   * Get emergency contact by ID
   *
   * Retrieves complete details for a single emergency contact including full contact
   * information, notification preferences, verification status, and relationship details.
   * Used for contact detail views, editing workflows, and notification configuration.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Emergency contact UUID to retrieve (required)
   *   - auth.credentials: JWT credentials for access control
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - contact: Complete emergency contact object with all fields
   * @throws {NotFoundError} When emergency contact ID does not exist
   * @throws {AuthorizationError} When user lacks access to contact details
   *
   * @example
   * // Nurse viewing contact details before updating
   * const request = {
   *   params: { id: 'contact-uuid-123' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await EmergencyContactsController.getById(request, h);
   * // Returns: {
   * //   contact: {
   * //     id: 'contact-uuid-123',
   * //     studentId: 'student-uuid',
   * //     firstName: 'Jane',
   * //     lastName: 'Doe',
   * //     relationship: 'MOTHER',
   * //     priority: 'PRIMARY',
   * //     phone: '+15550100',
   * //     email: 'jane.doe@email.com',
   * //     canPickup: true,
   * //     verifiedAt: '2024-09-15T10:00:00Z',
   * //     isActive: true
   * //   }
   * // }
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
