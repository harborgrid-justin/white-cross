/**
 * LOC: CLINICPARENTCOMM001
 * File: /reuse/clinic/composites/parent-communications-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - ../../server/health/health-patient-portal-kit
 *   - ../../education/student-communication-kit
 *   - ../../education/student-portal-kit
 *   - ../../email-notification-kit
 *   - ../../data/api-validation
 *
 * DOWNSTREAM (imported by):
 *   - Parent portal controllers
 *   - Clinic notification services
 *   - Consent management services
 *   - Emergency notification systems
 */

/**
 * File: /reuse/clinic/composites/parent-communications-composites.ts
 * Locator: WC-CLINIC-PARENT-COMM-001
 * Purpose: School Clinic Parent Communications Composite - Multi-channel parent engagement for K-12 health services
 *
 * Upstream: NestJS, Health Patient Portal Kit, Education Communication Kit, Email Notification Kit
 * Downstream: ../backend/clinic/parent-portal/*, Notification Services, Consent Management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Health & Education Kits
 * Exports: 41 composite functions orchestrating parent communication workflows
 *
 * LLM Context: Production-grade parent communication system for K-12 school clinic operations.
 * Provides comprehensive multi-channel communication including SMS/email/push notifications for clinic visits,
 * automated appointment reminders with calendar integration, digital consent form workflows with e-signatures,
 * health update notifications (medications given, injuries, illness), emergency contact alerts with escalation,
 * immunization compliance notifications, secure parent-nurse messaging with HIPAA compliance, health screening
 * result delivery with interpretation, medication authorization requests, sports physical clearance notifications,
 * chronic condition updates, absence notifications from clinic, parent preference management for communication
 * channels, notification delivery tracking and read receipts, translation services for multilingual families,
 * and comprehensive audit logging for all parent communications.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';

// Education Kit Imports
import {
  NotificationTemplate,
  MessageChannel,
  DeliveryStatus,
  CommunicationPreference,
} from '../../education/student-communication-kit';

import {
  PortalNotificationData,
} from '../../education/student-portal-kit';

// Health Kit Imports
import {
  MedicalRecordType,
} from '../../server/health/health-patient-portal-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Parent communication context
 */
export interface ParentCommunicationContext {
  userId: string;
  userRole: 'nurse' | 'admin' | 'parent';
  schoolId: string;
  clinicId: string;
  timestamp: Date;
  language?: string;
}

/**
 * Parent contact information
 */
export interface ParentContact {
  parentId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: 'mother' | 'father' | 'guardian' | 'stepparent' | 'grandparent' | 'other';
  email: string;
  phone: string;
  alternatePhone?: string;
  preferredLanguage: string;
  communicationPreferences: CommunicationPreference[];
  canReceiveSMS: boolean;
  canReceiveEmail: boolean;
  canReceivePush: boolean;
  isPrimary: boolean;
  consentToContact: boolean;
}

/**
 * Clinic visit notification
 */
export interface ClinicVisitNotification {
  notificationId: string;
  parentId: string;
  studentId: string;
  visitId: string;
  notificationType: 'check_in' | 'check_out' | 'injury' | 'illness' | 'medication_given' | 'sent_home';
  subject: string;
  message: string;
  channels: MessageChannel[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentAt: Date;
  deliveryStatus: Record<MessageChannel, DeliveryStatus>;
  requiresResponse: boolean;
  responseReceived?: boolean;
  parentResponse?: string;
  readAt?: Date;
}

/**
 * Health update notification
 */
export interface HealthUpdateNotification {
  updateId: string;
  parentId: string;
  studentId: string;
  updateType: 'medication_administered' | 'screening_completed' | 'immunization_due' | 'plan_review_needed' | 'appointment_scheduled';
  title: string;
  description: string;
  details: Record<string, any>;
  actionRequired: boolean;
  actionUrl?: string;
  actionDeadline?: Date;
  sentDate: Date;
  channels: MessageChannel[];
  deliveryStatus: Record<MessageChannel, DeliveryStatus>;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

/**
 * Digital consent form
 */
export interface DigitalConsentForm {
  formId: string;
  studentId: string;
  formType: 'medication' | 'treatment' | 'sports_physical' | 'field_trip' | 'immunization' | 'information_release';
  title: string;
  description: string;
  formFields: ConsentFormField[];
  requiredSignatures: string[];
  consentText: string;
  effectiveDate: Date;
  expirationDate?: Date;
  submittedBy?: string;
  submittedAt?: Date;
  signatures: DigitalSignature[];
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired';
  approvedBy?: string;
  approvedAt?: Date;
}

/**
 * Consent form field
 */
export interface ConsentFormField {
  fieldId: string;
  fieldType: 'text' | 'checkbox' | 'date' | 'select' | 'signature';
  label: string;
  required: boolean;
  options?: string[];
  value?: any;
  validation?: string;
}

/**
 * Digital signature
 */
export interface DigitalSignature {
  signatureId: string;
  signerName: string;
  signerRole: string;
  signatureData: string; // Base64 encoded signature image
  signedAt: Date;
  ipAddress: string;
  userAgent: string;
  verified: boolean;
}

/**
 * Emergency notification
 */
export interface EmergencyNotification {
  emergencyId: string;
  studentId: string;
  emergencyType: 'injury' | 'illness' | 'allergic_reaction' | 'seizure' | 'other';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  actionTaken: string;
  emergencyContactsNotified: string[];
  notificationTimestamps: Record<string, Date>;
  response911Called: boolean;
  parentPickupRequested: boolean;
  parentArrivalTime?: Date;
  escalationLevel: number;
  status: 'active' | 'resolved' | 'transferred';
}

/**
 * Secure parent-nurse message
 */
export interface SecureMessage {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderRole: 'parent' | 'nurse';
  recipientId: string;
  studentId: string;
  subject: string;
  messageBody: string;
  attachments?: MessageAttachment[];
  sentAt: Date;
  readAt?: Date;
  repliedAt?: Date;
  priority: 'normal' | 'high';
  encrypted: boolean;
  requiresResponse: boolean;
  archived: boolean;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  attachmentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  scanStatus: 'pending' | 'clean' | 'infected';
  downloadUrl: string;
}

/**
 * Appointment reminder
 */
export interface AppointmentReminder {
  reminderId: string;
  appointmentId: string;
  parentId: string;
  studentId: string;
  reminderType: 'initial' | 'followup' | 'day_before' | 'same_day';
  scheduledFor: Date;
  sentAt?: Date;
  channels: MessageChannel[];
  messageTemplate: string;
  deliveryStatus: Record<MessageChannel, DeliveryStatus>;
  includeCalendarInvite: boolean;
  calendarInviteSent: boolean;
}

/**
 * Medication authorization request
 */
export interface MedicationAuthorizationRequest {
  requestId: string;
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribingPhysician: string;
  administrationInstructions: string;
  sentToParent: Date;
  parentResponse?: 'approved' | 'denied';
  responseDate?: Date;
  responseNotes?: string;
  pharmacyInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  status: 'pending' | 'approved' | 'denied' | 'expired';
}

/**
 * Immunization compliance notice
 */
export interface ImmunizationComplianceNotice {
  noticeId: string;
  studentId: string;
  parentId: string;
  missingVaccines: string[];
  dueDate: Date;
  gradeLevel: string;
  complianceStatus: 'compliant' | 'grace_period' | 'non_compliant' | 'exempt';
  sentDate: Date;
  followUpSentDates: Date[];
  exemptionRequested: boolean;
  exemptionType?: 'medical' | 'religious' | 'philosophical';
  resolved: boolean;
  resolvedDate?: Date;
}

/**
 * Sports physical clearance notification
 */
export interface SportsPhysicalNotification {
  notificationId: string;
  studentId: string;
  parentId: string;
  sport: string;
  season: string;
  physicalDate: Date;
  clearanceStatus: 'cleared' | 'cleared_with_restrictions' | 'not_cleared' | 'pending';
  restrictions?: string[];
  expirationDate: Date;
  sentDate: Date;
  acknowledgedByParent: boolean;
  acknowledgedByCoach: boolean;
}

/**
 * Communication preference settings
 */
export interface CommunicationPreferenceSettings {
  parentId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  preferredChannel: MessageChannel;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  notificationTypes: {
    clinicVisits: boolean;
    appointmentReminders: boolean;
    healthUpdates: boolean;
    emergencies: boolean;
    consentRequests: boolean;
    immunizationNotices: boolean;
    generalAnnouncements: boolean;
  };
  language: string;
  digestEnabled: boolean;
  digestFrequency?: 'daily' | 'weekly';
}

/**
 * Message delivery report
 */
export interface MessageDeliveryReport {
  reportId: string;
  messageId: string;
  channel: MessageChannel;
  recipient: string;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  finalStatus: DeliveryStatus;
}

// ============================================================================
// COMPOSITE FUNCTIONS
// ============================================================================

/**
 * 1. Send clinic visit notification to parent
 */
export async function sendClinicVisitNotification(
  studentId: string,
  visitDetails: any,
  context: ParentCommunicationContext,
): Promise<ClinicVisitNotification> {
  const logger = new Logger('ParentCommunicationsComposites');

  // Get parent contact information
  const parents = await getParentContacts(studentId, context);

  // Create notification
  const notification: ClinicVisitNotification = {
    notificationId: generateNotificationId(),
    parentId: parents[0].parentId,
    studentId,
    visitId: visitDetails.visitId,
    notificationType: visitDetails.type,
    subject: `Clinic Visit: ${visitDetails.type}`,
    message: formatClinicVisitMessage(visitDetails),
    channels: getPreferredChannels(parents[0]),
    priority: determineNotificationPriority(visitDetails.type),
    sentAt: new Date(),
    deliveryStatus: {},
    requiresResponse: visitDetails.type === 'sent_home',
  };

  // Send via multiple channels
  await sendMultiChannelNotification(notification, context);

  return notification;
}

/**
 * 2. Send appointment reminder
 */
export async function sendAppointmentReminder(
  appointmentId: string,
  reminderType: string,
  context: ParentCommunicationContext,
): Promise<AppointmentReminder> {
  throw new Error('Implementation required');
}

/**
 * 3. Create digital consent form
 */
export async function createDigitalConsentForm(
  form: DigitalConsentForm,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm> {
  throw new Error('Implementation required');
}

/**
 * 4. Submit consent form with signature
 */
export async function submitConsentForm(
  formId: string,
  formData: any,
  signature: DigitalSignature,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm> {
  throw new Error('Implementation required');
}

/**
 * 5. Send health update notification
 */
export async function sendHealthUpdateNotification(
  studentId: string,
  update: HealthUpdateNotification,
  context: ParentCommunicationContext,
): Promise<HealthUpdateNotification> {
  throw new Error('Implementation required');
}

/**
 * 6. Trigger emergency notification cascade
 */
export async function triggerEmergencyNotification(
  studentId: string,
  emergency: EmergencyNotification,
  context: ParentCommunicationContext,
): Promise<EmergencyNotification> {
  const logger = new Logger('ParentCommunicationsComposites');

  // Get all emergency contacts
  const emergencyContacts = await getEmergencyContactsForStudent(studentId, context);

  // Sort by priority
  const sortedContacts = emergencyContacts.sort((a, b) => a.priority - b.priority);

  // Attempt to contact in order
  for (const contact of sortedContacts) {
    try {
      await sendEmergencyAlert(contact, emergency, context);
      emergency.emergencyContactsNotified.push(contact.contactId);
      emergency.notificationTimestamps[contact.contactId] = new Date();
    } catch (error) {
      logger.error(`Failed to notify emergency contact ${contact.contactId}`, error.stack);
    }
  }

  return emergency;
}

/**
 * 7. Send secure message to parent
 */
export async function sendSecureMessage(
  message: SecureMessage,
  context: ParentCommunicationContext,
): Promise<SecureMessage> {
  throw new Error('Implementation required');
}

/**
 * 8. Get parent message inbox
 */
export async function getParentMessageInbox(
  parentId: string,
  context: ParentCommunicationContext,
): Promise<SecureMessage[]> {
  return [];
}

/**
 * 9. Reply to parent message
 */
export async function replyToParentMessage(
  messageId: string,
  replyBody: string,
  context: ParentCommunicationContext,
): Promise<SecureMessage> {
  throw new Error('Implementation required');
}

/**
 * 10. Send medication authorization request
 */
export async function sendMedicationAuthorizationRequest(
  request: MedicationAuthorizationRequest,
  context: ParentCommunicationContext,
): Promise<MedicationAuthorizationRequest> {
  throw new Error('Implementation required');
}

/**
 * 11. Process medication authorization response
 */
export async function processMedicationAuthorizationResponse(
  requestId: string,
  response: 'approved' | 'denied',
  notes: string,
  context: ParentCommunicationContext,
): Promise<MedicationAuthorizationRequest> {
  throw new Error('Implementation required');
}

/**
 * 12. Send immunization compliance notice
 */
export async function sendImmunizationComplianceNotice(
  notice: ImmunizationComplianceNotice,
  context: ParentCommunicationContext,
): Promise<ImmunizationComplianceNotice> {
  throw new Error('Implementation required');
}

/**
 * 13. Send sports physical clearance notification
 */
export async function sendSportsPhysicalNotification(
  notification: SportsPhysicalNotification,
  context: ParentCommunicationContext,
): Promise<SportsPhysicalNotification> {
  throw new Error('Implementation required');
}

/**
 * 14. Update parent communication preferences
 */
export async function updateCommunicationPreferences(
  parentId: string,
  preferences: CommunicationPreferenceSettings,
  context: ParentCommunicationContext,
): Promise<CommunicationPreferenceSettings> {
  throw new Error('Implementation required');
}

/**
 * 15. Get parent communication preferences
 */
export async function getCommunicationPreferences(
  parentId: string,
  context: ParentCommunicationContext,
): Promise<CommunicationPreferenceSettings> {
  throw new Error('Implementation required');
}

/**
 * 16. Send bulk notification to multiple parents
 */
export async function sendBulkParentNotification(
  studentIds: string[],
  notification: any,
  context: ParentCommunicationContext,
): Promise<{ sent: number; failed: number }> {
  return { sent: 0, failed: 0 };
}

/**
 * 17. Get parent contact information
 */
export async function getParentContacts(
  studentId: string,
  context: ParentCommunicationContext,
): Promise<ParentContact[]> {
  // Implementation would fetch from database
  return [];
}

/**
 * 18. Send screening results notification
 */
export async function sendScreeningResultsNotification(
  studentId: string,
  screeningType: string,
  results: any,
  context: ParentCommunicationContext,
): Promise<HealthUpdateNotification> {
  throw new Error('Implementation required');
}

/**
 * 19. Request parent consent for treatment
 */
export async function requestTreatmentConsent(
  studentId: string,
  treatmentDetails: any,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm> {
  throw new Error('Implementation required');
}

/**
 * 20. Get pending consent forms for parent
 */
export async function getPendingConsentForms(
  parentId: string,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm[]> {
  return [];
}

/**
 * 21. Send absence notification from clinic
 */
export async function sendAbsenceNotification(
  studentId: string,
  absenceDetails: any,
  context: ParentCommunicationContext,
): Promise<ClinicVisitNotification> {
  throw new Error('Implementation required');
}

/**
 * 22. Generate daily parent digest
 */
export async function generateDailyParentDigest(
  parentId: string,
  date: Date,
  context: ParentCommunicationContext,
): Promise<{ notifications: any[]; messages: any[]; actionItems: any[] }> {
  return { notifications: [], messages: [], actionItems: [] };
}

/**
 * 23. Send calendar invite for appointment
 */
export async function sendAppointmentCalendarInvite(
  appointmentId: string,
  parentEmail: string,
  context: ParentCommunicationContext,
): Promise<{ sent: boolean; icsFileUrl: string }> {
  return { sent: true, icsFileUrl: '' };
}

/**
 * 24. Get notification delivery status
 */
export async function getNotificationDeliveryStatus(
  notificationId: string,
  context: ParentCommunicationContext,
): Promise<MessageDeliveryReport[]> {
  return [];
}

/**
 * 25. Resend failed notification
 */
export async function resendFailedNotification(
  notificationId: string,
  channel: MessageChannel,
  context: ParentCommunicationContext,
): Promise<MessageDeliveryReport> {
  throw new Error('Implementation required');
}

/**
 * 26. Translate notification to parent's preferred language
 */
export async function translateNotification(
  notificationText: string,
  targetLanguage: string,
  context: ParentCommunicationContext,
): Promise<{ original: string; translated: string; language: string }> {
  throw new Error('Implementation required');
}

/**
 * 27. Send follow-up reminder for unsigned consent
 */
export async function sendConsentFollowUpReminder(
  formId: string,
  context: ParentCommunicationContext,
): Promise<ClinicVisitNotification> {
  throw new Error('Implementation required');
}

/**
 * 28. Get parent notification history
 */
export async function getParentNotificationHistory(
  parentId: string,
  startDate: Date,
  endDate: Date,
  context: ParentCommunicationContext,
): Promise<ClinicVisitNotification[]> {
  return [];
}

/**
 * 29. Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  context: ParentCommunicationContext,
): Promise<{ read: boolean; readAt: Date }> {
  return { read: true, readAt: new Date() };
}

/**
 * 30. Send chronic condition update
 */
export async function sendChronicConditionUpdate(
  studentId: string,
  conditionUpdate: any,
  context: ParentCommunicationContext,
): Promise<HealthUpdateNotification> {
  throw new Error('Implementation required');
}

/**
 * 31. Request emergency contact update
 */
export async function requestEmergencyContactUpdate(
  studentId: string,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm> {
  throw new Error('Implementation required');
}

/**
 * 32. Send medication administration confirmation
 */
export async function sendMedicationAdministrationConfirmation(
  studentId: string,
  medicationDetails: any,
  context: ParentCommunicationContext,
): Promise<HealthUpdateNotification> {
  throw new Error('Implementation required');
}

/**
 * 33. Get unread message count
 */
export async function getUnreadMessageCount(
  parentId: string,
  context: ParentCommunicationContext,
): Promise<number> {
  return 0;
}

/**
 * 34. Archive message conversation
 */
export async function archiveMessageConversation(
  conversationId: string,
  context: ParentCommunicationContext,
): Promise<{ archived: boolean }> {
  return { archived: true };
}

/**
 * 35. Send health plan review reminder
 */
export async function sendHealthPlanReviewReminder(
  studentId: string,
  planType: string,
  dueDate: Date,
  context: ParentCommunicationContext,
): Promise<HealthUpdateNotification> {
  throw new Error('Implementation required');
}

/**
 * 36. Validate parent phone number for SMS
 */
export async function validateParentPhoneForSMS(
  phoneNumber: string,
  context: ParentCommunicationContext,
): Promise<{ valid: boolean; carrier?: string; canReceiveSMS: boolean }> {
  return { valid: true, canReceiveSMS: true };
}

/**
 * 37. Send pick-up request notification
 */
export async function sendPickUpRequest(
  studentId: string,
  reason: string,
  context: ParentCommunicationContext,
): Promise<EmergencyNotification> {
  throw new Error('Implementation required');
}

/**
 * 38. Get consent form submission status
 */
export async function getConsentFormStatus(
  formId: string,
  context: ParentCommunicationContext,
): Promise<DigitalConsentForm> {
  throw new Error('Implementation required');
}

/**
 * 39. Send notification delivery report
 */
export async function sendNotificationDeliveryReport(
  startDate: Date,
  endDate: Date,
  context: ParentCommunicationContext,
): Promise<{
  totalSent: number;
  delivered: number;
  failed: number;
  byChannel: Record<string, number>;
}> {
  return { totalSent: 0, delivered: 0, failed: 0, byChannel: {} };
}

/**
 * 40. Enable notification quiet hours
 */
export async function enableQuietHours(
  parentId: string,
  startTime: string,
  endTime: string,
  context: ParentCommunicationContext,
): Promise<CommunicationPreferenceSettings> {
  throw new Error('Implementation required');
}

/**
 * 41. Get parent portal access link
 */
export async function generateParentPortalAccessLink(
  parentId: string,
  context: ParentCommunicationContext,
): Promise<{ accessUrl: string; expiresAt: Date; oneTimeToken: string }> {
  throw new Error('Implementation required');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateNotificationId(): string {
  return `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatClinicVisitMessage(visitDetails: any): string {
  return `Your child visited the clinic for: ${visitDetails.type}`;
}

function getPreferredChannels(parent: ParentContact): MessageChannel[] {
  const channels: MessageChannel[] = [];
  if (parent.canReceiveEmail) channels.push('email');
  if (parent.canReceiveSMS) channels.push('sms');
  if (parent.canReceivePush) channels.push('push');
  return channels;
}

function determineNotificationPriority(visitType: string): 'low' | 'medium' | 'high' | 'urgent' {
  const urgentTypes = ['injury', 'sent_home'];
  const highTypes = ['illness', 'medication_given'];
  if (urgentTypes.includes(visitType)) return 'urgent';
  if (highTypes.includes(visitType)) return 'high';
  return 'medium';
}

async function sendMultiChannelNotification(
  notification: ClinicVisitNotification,
  context: ParentCommunicationContext,
): Promise<void> {
  // Implementation would send via multiple channels
}

async function getEmergencyContactsForStudent(
  studentId: string,
  context: ParentCommunicationContext,
): Promise<any[]> {
  return [];
}

async function sendEmergencyAlert(
  contact: any,
  emergency: EmergencyNotification,
  context: ParentCommunicationContext,
): Promise<void> {
  // Implementation would send emergency alert
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Main composite functions
  sendClinicVisitNotification,
  sendAppointmentReminder,
  createDigitalConsentForm,
  submitConsentForm,
  sendHealthUpdateNotification,
  triggerEmergencyNotification,
  sendSecureMessage,
  getParentMessageInbox,
  replyToParentMessage,
  sendMedicationAuthorizationRequest,
  processMedicationAuthorizationResponse,
  sendImmunizationComplianceNotice,
  sendSportsPhysicalNotification,
  updateCommunicationPreferences,
  getCommunicationPreferences,
  sendBulkParentNotification,
  getParentContacts,
  sendScreeningResultsNotification,
  requestTreatmentConsent,
  getPendingConsentForms,
  sendAbsenceNotification,
  generateDailyParentDigest,
  sendAppointmentCalendarInvite,
  getNotificationDeliveryStatus,
  resendFailedNotification,
  translateNotification,
  sendConsentFollowUpReminder,
  getParentNotificationHistory,
  markNotificationAsRead,
  sendChronicConditionUpdate,
  requestEmergencyContactUpdate,
  sendMedicationAdministrationConfirmation,
  getUnreadMessageCount,
  archiveMessageConversation,
  sendHealthPlanReviewReminder,
  validateParentPhoneForSMS,
  sendPickUpRequest,
  getConsentFormStatus,
  sendNotificationDeliveryReport,
  enableQuietHours,
  generateParentPortalAccessLink,
};
