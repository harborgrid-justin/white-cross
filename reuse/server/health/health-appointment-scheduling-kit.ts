/**
 * LOC: HEALTHAPPTKIT001
 * File: /reuse/server/health/health-appointment-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - date-fns
 *   - rrule (recurrence rule library)
 *   - ical-generator
 *   - twilio (SMS notifications)
 *   - @sendgrid/mail (email notifications)
 *
 * DOWNSTREAM (imported by):
 *   - Appointment scheduling services
 *   - Calendar integration services
 *   - Patient portal services
 *   - Provider scheduling interfaces
 *   - Resource management services
 *   - Notification services
 */

/**
 * File: /reuse/server/health/health-appointment-scheduling-kit.ts
 * Locator: WC-HEALTH-APPTKIT-001
 * Purpose: Comprehensive Healthcare Appointment Scheduling Kit - Epic MyChart-level appointment management
 *
 * Upstream: Independent utility module for healthcare appointment scheduling operations
 * Downstream: ../backend/*, Scheduling services, Calendar integrations, Notification services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, date-fns, rrule, ical-generator
 * Exports: 45 utility functions for appointment booking, scheduling, reminders, waitlists, telehealth, resources
 *
 * LLM Context: Enterprise-grade appointment scheduling utilities for White Cross healthcare platform.
 * Provides comprehensive appointment lifecycle management (booking, rescheduling, cancellation),
 * slot availability checking with complex rules, recurring appointments with series management,
 * waitlist automation, multi-channel reminders (SMS, email, push), no-show tracking with penalties,
 * telehealth vs in-person appointment types, multi-provider coordination, resource scheduling
 * (rooms, equipment), conflict resolution, calendar integration (iCal, Google Calendar), and
 * patient self-scheduling with customizable rules for HIPAA-compliant healthcare operations.
 */

import { Injectable } from '@nestjs/common';
import { addDays, addMinutes, startOfDay, endOfDay, isWithinInterval, parseISO, format } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Appointment type enumeration
 */
export enum AppointmentType {
  IN_PERSON = 'in_person',
  TELEHEALTH = 'telehealth',
  PHONE = 'phone',
  HOME_VISIT = 'home_visit',
}

/**
 * Appointment status enumeration
 */
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

/**
 * Appointment priority levels
 */
export enum AppointmentPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
  FOLLOW_UP = 'follow_up',
}

/**
 * Reminder channel types
 */
export enum ReminderChannel {
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
  PHONE = 'phone',
}

/**
 * Appointment data structure
 */
export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  facilityId: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  reasonForVisit: string;
  chiefComplaint?: string;
  specialInstructions?: string;
  telehealth?: TelehealthDetails;
  seriesId?: string; // For recurring appointments
  resources?: ResourceAllocation[];
  reminders?: ReminderSchedule[];
  cancellationReason?: string;
  cancellationTime?: Date;
  noShowRecorded?: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Telehealth appointment details
 */
export interface TelehealthDetails {
  platform: 'zoom' | 'teams' | 'webex' | 'custom';
  meetingUrl: string;
  meetingId: string;
  password?: string;
  dialInNumber?: string;
  waitingRoomEnabled: boolean;
  recordingEnabled: boolean;
}

/**
 * Resource allocation for appointments
 */
export interface ResourceAllocation {
  resourceId: string;
  resourceType: 'room' | 'equipment' | 'staff';
  resourceName: string;
  startTime: Date;
  endTime: Date;
  confirmed: boolean;
}

/**
 * Reminder schedule configuration
 */
export interface ReminderSchedule {
  id: string;
  channel: ReminderChannel;
  scheduledTime: Date;
  sent: boolean;
  sentAt?: Date;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
}

/**
 * Appointment slot availability
 */
export interface AppointmentSlot {
  slotId: string;
  providerId: string;
  facilityId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  available: boolean;
  appointmentTypes: AppointmentType[];
  maxBookings: number;
  currentBookings: number;
  teleheathCapable: boolean;
}

/**
 * Slot availability query
 */
export interface SlotAvailabilityQuery {
  providerId?: string;
  facilityId?: string;
  appointmentType?: AppointmentType;
  startDate: Date;
  endDate: Date;
  duration?: number;
  specialty?: string;
  preferredDays?: number[]; // 0-6, Sunday-Saturday
  preferredTimeStart?: string; // HH:mm format
  preferredTimeEnd?: string; // HH:mm format
}

/**
 * Recurring appointment pattern
 */
export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 for weekly patterns
  dayOfMonth?: number; // For monthly patterns
  endDate?: Date;
  occurrences?: number; // Alternative to endDate
}

/**
 * Appointment series
 */
export interface AppointmentSeries {
  seriesId: string;
  patientId: string;
  providerId: string;
  pattern: RecurringPattern;
  appointmentTemplate: Partial<Appointment>;
  appointments: string[]; // Array of appointment IDs
  createdAt: Date;
  active: boolean;
}

/**
 * Waitlist entry
 */
export interface WaitlistEntry {
  id: string;
  patientId: string;
  providerId?: string;
  facilityId: string;
  appointmentType: AppointmentType;
  priority: AppointmentPriority;
  desiredDate?: Date;
  desiredTimeRange?: { start: string; end: string };
  duration: number;
  reasonForVisit: string;
  addedAt: Date;
  expiresAt?: Date;
  notified: boolean;
  slotOffered?: string;
  status: 'active' | 'offered' | 'scheduled' | 'expired' | 'cancelled';
}

/**
 * Appointment booking request
 */
export interface AppointmentBookingRequest {
  patientId: string;
  providerId: string;
  facilityId: string;
  appointmentType: AppointmentType;
  startTime: Date;
  duration: number;
  reasonForVisit: string;
  priority?: AppointmentPriority;
  teleheathRequired?: boolean;
  resourceRequirements?: ResourceRequirement[];
  specialInstructions?: string;
}

/**
 * Resource requirement
 */
export interface ResourceRequirement {
  resourceType: 'room' | 'equipment' | 'staff';
  resourceId?: string; // Specific resource or any available
  required: boolean;
}

/**
 * Rescheduling request
 */
export interface RescheduleRequest {
  appointmentId: string;
  newStartTime: Date;
  reason: string;
  notifyPatient: boolean;
  notifyProvider: boolean;
}

/**
 * Cancellation request
 */
export interface CancellationRequest {
  appointmentId: string;
  reason: string;
  cancelledBy: 'patient' | 'provider' | 'system';
  notifyPatient: boolean;
  notifyProvider: boolean;
  offerReschedule: boolean;
}

/**
 * No-show tracking
 */
export interface NoShowRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  providerId: string;
  appointmentDate: Date;
  recordedAt: Date;
  recordedBy: string;
  penaltyApplied: boolean;
  penaltyType?: 'warning' | 'fee' | 'restriction' | 'none';
  penaltyAmount?: number;
  notes?: string;
}

/**
 * Patient scheduling rules
 */
export interface PatientSchedulingRules {
  patientId: string;
  maxAdvanceBookingDays: number;
  maxConcurrentAppointments: number;
  requiresApproval: boolean;
  restrictedProviders?: string[];
  restrictedFacilities?: string[];
  allowedAppointmentTypes: AppointmentType[];
  noShowCount: number;
  noShowPenalty?: 'none' | 'warning' | 'restricted' | 'blocked';
  cancellationCount: number;
  lastNoShowDate?: Date;
}

/**
 * Provider availability schedule
 */
export interface ProviderSchedule {
  providerId: string;
  facilityId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number; // minutes
  breakTimes?: { start: string; end: string }[];
  appointmentTypes: AppointmentType[];
  maxConcurrentAppointments: number;
  teleheathEnabled: boolean;
}

/**
 * Conflict resolution result
 */
export interface ConflictResolution {
  hasConflict: boolean;
  conflicts: AppointmentConflict[];
  resolution?: 'override' | 'adjust' | 'reject';
  suggestedAlternatives?: Date[];
}

/**
 * Appointment conflict details
 */
export interface AppointmentConflict {
  type: 'double_booking' | 'resource_unavailable' | 'provider_unavailable' | 'facility_closed' | 'patient_conflict';
  conflictingAppointmentId?: string;
  conflictingResourceId?: string;
  message: string;
  severity: 'warning' | 'error';
}

/**
 * Calendar export format
 */
export interface CalendarExport {
  format: 'ical' | 'google' | 'outlook';
  data: string;
  url?: string;
  subscription?: boolean;
}

// ============================================================================
// SECTION 1: APPOINTMENT BOOKING AND MANAGEMENT (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a new appointment booking with validation.
 *
 * @param {AppointmentBookingRequest} request - Appointment booking details
 * @param {string} bookedBy - User ID who is booking
 * @returns {Promise<Appointment>} Created appointment
 *
 * @example
 * ```typescript
 * const appointment = await bookAppointment({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   facilityId: 'facility-789',
 *   appointmentType: AppointmentType.IN_PERSON,
 *   startTime: new Date('2025-01-15T10:00:00'),
 *   duration: 30,
 *   reasonForVisit: 'Annual physical examination',
 *   priority: AppointmentPriority.ROUTINE
 * }, 'admin-001');
 * ```
 */
export async function bookAppointment(
  request: AppointmentBookingRequest,
  bookedBy: string
): Promise<Appointment> {
  const appointment: Appointment = {
    id: generateAppointmentId(),
    patientId: request.patientId,
    providerId: request.providerId,
    facilityId: request.facilityId,
    appointmentType: request.appointmentType,
    status: AppointmentStatus.SCHEDULED,
    priority: request.priority || AppointmentPriority.ROUTINE,
    startTime: request.startTime,
    endTime: addMinutes(request.startTime, request.duration),
    duration: request.duration,
    reasonForVisit: request.reasonForVisit,
    specialInstructions: request.specialInstructions,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      bookedBy,
      bookingChannel: 'system',
    },
  };

  // Allocate resources if needed
  if (request.resourceRequirements) {
    appointment.resources = await allocateResources(
      request.resourceRequirements,
      request.startTime,
      request.duration
    );
  }

  // Create telehealth session if required
  if (request.teleheathRequired) {
    appointment.telehealth = await createTelehealthSession(appointment);
  }

  return appointment;
}

/**
 * 2. Validates appointment slot availability before booking.
 *
 * @param {AppointmentBookingRequest} request - Booking request to validate
 * @returns {Promise<ConflictResolution>} Validation result with conflicts
 *
 * @example
 * ```typescript
 * const validation = await validateAppointmentSlot({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   facilityId: 'facility-789',
 *   appointmentType: AppointmentType.TELEHEALTH,
 *   startTime: new Date('2025-01-15T14:00:00'),
 *   duration: 60,
 *   reasonForVisit: 'Follow-up consultation'
 * });
 *
 * if (validation.hasConflict) {
 *   console.log('Conflicts:', validation.conflicts);
 *   console.log('Suggested alternatives:', validation.suggestedAlternatives);
 * }
 * ```
 */
export async function validateAppointmentSlot(
  request: AppointmentBookingRequest
): Promise<ConflictResolution> {
  const conflicts: AppointmentConflict[] = [];

  // Check provider availability
  const providerAvailable = await checkProviderAvailability(
    request.providerId,
    request.startTime,
    request.duration
  );

  if (!providerAvailable) {
    conflicts.push({
      type: 'provider_unavailable',
      message: 'Provider is not available at the requested time',
      severity: 'error',
    });
  }

  // Check facility hours
  const facilityOpen = await checkFacilityHours(request.facilityId, request.startTime);

  if (!facilityOpen) {
    conflicts.push({
      type: 'facility_closed',
      message: 'Facility is closed at the requested time',
      severity: 'error',
    });
  }

  // Check for patient conflicts
  const patientConflicts = await findPatientConflicts(request.patientId, request.startTime, request.duration);

  if (patientConflicts.length > 0) {
    conflicts.push({
      type: 'patient_conflict',
      conflictingAppointmentId: patientConflicts[0],
      message: 'Patient has another appointment at this time',
      severity: 'error',
    });
  }

  const hasConflict = conflicts.length > 0;
  const suggestedAlternatives = hasConflict
    ? await findAlternativeSlots(request, 5)
    : undefined;

  return {
    hasConflict,
    conflicts,
    resolution: hasConflict ? 'reject' : undefined,
    suggestedAlternatives,
  };
}

/**
 * 3. Reschedules an existing appointment to a new time.
 *
 * @param {RescheduleRequest} request - Reschedule request details
 * @returns {Promise<Appointment>} Updated appointment
 *
 * @example
 * ```typescript
 * const rescheduled = await rescheduleAppointment({
 *   appointmentId: 'appt-789',
 *   newStartTime: new Date('2025-01-20T11:00:00'),
 *   reason: 'Patient requested different time',
 *   notifyPatient: true,
 *   notifyProvider: true
 * });
 *
 * console.log('New appointment time:', rescheduled.startTime);
 * ```
 */
export async function rescheduleAppointment(request: RescheduleRequest): Promise<Appointment> {
  // Retrieve original appointment
  const original = await getAppointmentById(request.appointmentId);

  // Validate new slot
  const validation = await validateAppointmentSlot({
    patientId: original.patientId,
    providerId: original.providerId,
    facilityId: original.facilityId,
    appointmentType: original.appointmentType,
    startTime: request.newStartTime,
    duration: original.duration,
    reasonForVisit: original.reasonForVisit,
  });

  if (validation.hasConflict) {
    throw new Error('Cannot reschedule: new time slot has conflicts');
  }

  // Update appointment
  const updated: Appointment = {
    ...original,
    startTime: request.newStartTime,
    endTime: addMinutes(request.newStartTime, original.duration),
    status: AppointmentStatus.RESCHEDULED,
    updatedAt: new Date(),
    metadata: {
      ...original.metadata,
      rescheduleReason: request.reason,
      previousStartTime: original.startTime,
      rescheduledAt: new Date(),
    },
  };

  // Send notifications
  if (request.notifyPatient) {
    await sendRescheduleNotification(updated, 'patient');
  }

  if (request.notifyProvider) {
    await sendRescheduleNotification(updated, 'provider');
  }

  return updated;
}

/**
 * 4. Cancels an appointment with notifications.
 *
 * @param {CancellationRequest} request - Cancellation request details
 * @returns {Promise<Appointment>} Cancelled appointment
 *
 * @example
 * ```typescript
 * const cancelled = await cancelAppointment({
 *   appointmentId: 'appt-789',
 *   reason: 'Patient illness',
 *   cancelledBy: 'patient',
 *   notifyPatient: true,
 *   notifyProvider: true,
 *   offerReschedule: true
 * });
 *
 * if (cancelled.status === AppointmentStatus.CANCELLED) {
 *   console.log('Cancellation successful');
 * }
 * ```
 */
export async function cancelAppointment(request: CancellationRequest): Promise<Appointment> {
  const appointment = await getAppointmentById(request.appointmentId);

  const updated: Appointment = {
    ...appointment,
    status: AppointmentStatus.CANCELLED,
    cancellationReason: request.reason,
    cancellationTime: new Date(),
    updatedAt: new Date(),
    metadata: {
      ...appointment.metadata,
      cancelledBy: request.cancelledBy,
    },
  };

  // Release allocated resources
  if (appointment.resources) {
    await releaseResources(appointment.resources);
  }

  // Check waitlist for this slot
  await processWaitlistForSlot(appointment);

  // Send notifications
  if (request.notifyPatient) {
    await sendCancellationNotification(updated, 'patient', request.offerReschedule);
  }

  if (request.notifyProvider) {
    await sendCancellationNotification(updated, 'provider', false);
  }

  return updated;
}

/**
 * 5. Confirms an appointment (patient acknowledgment).
 *
 * @param {string} appointmentId - Appointment ID to confirm
 * @param {string} confirmedBy - User ID confirming
 * @returns {Promise<Appointment>} Confirmed appointment
 *
 * @example
 * ```typescript
 * const confirmed = await confirmAppointment('appt-789', 'patient-123');
 * console.log('Appointment confirmed:', confirmed.status === AppointmentStatus.CONFIRMED);
 * ```
 */
export async function confirmAppointment(appointmentId: string, confirmedBy: string): Promise<Appointment> {
  const appointment = await getAppointmentById(appointmentId);

  const updated: Appointment = {
    ...appointment,
    status: AppointmentStatus.CONFIRMED,
    updatedAt: new Date(),
    metadata: {
      ...appointment.metadata,
      confirmedBy,
      confirmedAt: new Date(),
    },
  };

  return updated;
}

/**
 * 6. Marks patient as checked in for appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} checkedInBy - Staff member ID
 * @returns {Promise<Appointment>} Updated appointment
 *
 * @example
 * ```typescript
 * const checkedIn = await checkInAppointment('appt-789', 'staff-456');
 * console.log('Check-in time:', checkedIn.metadata.checkedInAt);
 * ```
 */
export async function checkInAppointment(appointmentId: string, checkedInBy: string): Promise<Appointment> {
  const appointment = await getAppointmentById(appointmentId);

  const updated: Appointment = {
    ...appointment,
    status: AppointmentStatus.CHECKED_IN,
    updatedAt: new Date(),
    metadata: {
      ...appointment.metadata,
      checkedInBy,
      checkedInAt: new Date(),
    },
  };

  return updated;
}

/**
 * 7. Marks appointment as completed with outcome.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {object} outcome - Appointment outcome details
 * @returns {Promise<Appointment>} Completed appointment
 *
 * @example
 * ```typescript
 * const completed = await completeAppointment('appt-789', {
 *   completedBy: 'provider-456',
 *   duration: 35, // Actual duration
 *   followUpRequired: true,
 *   followUpInDays: 30,
 *   notes: 'Patient improving, continue current medication'
 * });
 * ```
 */
export async function completeAppointment(
  appointmentId: string,
  outcome: {
    completedBy: string;
    duration?: number;
    followUpRequired?: boolean;
    followUpInDays?: number;
    notes?: string;
  }
): Promise<Appointment> {
  const appointment = await getAppointmentById(appointmentId);

  const updated: Appointment = {
    ...appointment,
    status: AppointmentStatus.COMPLETED,
    updatedAt: new Date(),
    metadata: {
      ...appointment.metadata,
      ...outcome,
      completedAt: new Date(),
    },
  };

  // Schedule follow-up if needed
  if (outcome.followUpRequired && outcome.followUpInDays) {
    await scheduleFollowUp(appointment, outcome.followUpInDays);
  }

  return updated;
}

/**
 * 8. Records a no-show for missed appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} recordedBy - Staff member ID
 * @param {boolean} applyPenalty - Whether to apply no-show penalty
 * @returns {Promise<NoShowRecord>} No-show record
 *
 * @example
 * ```typescript
 * const noShow = await recordNoShow('appt-789', 'staff-456', true);
 * console.log('Penalty applied:', noShow.penaltyApplied);
 * console.log('Penalty type:', noShow.penaltyType);
 * ```
 */
export async function recordNoShow(
  appointmentId: string,
  recordedBy: string,
  applyPenalty: boolean = true
): Promise<NoShowRecord> {
  const appointment = await getAppointmentById(appointmentId);

  // Update appointment status
  await updateAppointmentStatus(appointmentId, AppointmentStatus.NO_SHOW);

  // Get patient rules to determine penalty
  const patientRules = await getPatientSchedulingRules(appointment.patientId);
  const penalty = applyPenalty ? determineNoShowPenalty(patientRules) : undefined;

  const record: NoShowRecord = {
    id: generateNoShowId(),
    appointmentId,
    patientId: appointment.patientId,
    providerId: appointment.providerId,
    appointmentDate: appointment.startTime,
    recordedAt: new Date(),
    recordedBy,
    penaltyApplied: applyPenalty,
    penaltyType: penalty?.type,
    penaltyAmount: penalty?.amount,
  };

  // Update patient rules
  await incrementPatientNoShowCount(appointment.patientId);

  // Check waitlist for released slot
  await processWaitlistForSlot(appointment);

  return record;
}

// ============================================================================
// SECTION 2: SLOT AVAILABILITY AND MANAGEMENT (Functions 9-15)
// ============================================================================

/**
 * 9. Finds available appointment slots based on criteria.
 *
 * @param {SlotAvailabilityQuery} query - Availability search criteria
 * @returns {Promise<AppointmentSlot[]>} Available slots
 *
 * @example
 * ```typescript
 * const slots = await findAvailableSlots({
 *   providerId: 'provider-456',
 *   facilityId: 'facility-789',
 *   appointmentType: AppointmentType.IN_PERSON,
 *   startDate: new Date('2025-01-15'),
 *   endDate: new Date('2025-01-20'),
 *   duration: 30,
 *   preferredDays: [1, 3, 5], // Monday, Wednesday, Friday
 *   preferredTimeStart: '09:00',
 *   preferredTimeEnd: '17:00'
 * });
 *
 * console.log(`Found ${slots.length} available slots`);
 * ```
 */
export async function findAvailableSlots(query: SlotAvailabilityQuery): Promise<AppointmentSlot[]> {
  const slots: AppointmentSlot[] = [];
  let currentDate = startOfDay(query.startDate);
  const endDate = endOfDay(query.endDate);

  while (currentDate <= endDate) {
    // Skip if not a preferred day
    if (query.preferredDays && !query.preferredDays.includes(currentDate.getDay())) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    // Get provider schedule for this day
    const schedule = await getProviderSchedule(query.providerId, currentDate);

    if (schedule) {
      const daySlots = generateSlotsFromSchedule(
        schedule,
        currentDate,
        query.duration || 30,
        query.preferredTimeStart,
        query.preferredTimeEnd
      );

      // Filter out booked slots
      const availableSlots = await filterBookedSlots(daySlots, query.appointmentType);
      slots.push(...availableSlots);
    }

    currentDate = addDays(currentDate, 1);
  }

  return slots;
}

/**
 * 10. Checks if a specific time slot is available.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startTime - Slot start time
 * @param {number} duration - Duration in minutes
 * @returns {Promise<boolean>} True if slot is available
 *
 * @example
 * ```typescript
 * const isAvailable = await isSlotAvailable(
 *   'provider-456',
 *   new Date('2025-01-15T10:00:00'),
 *   30
 * );
 *
 * if (isAvailable) {
 *   console.log('Slot is available for booking');
 * }
 * ```
 */
export async function isSlotAvailable(
  providerId: string,
  startTime: Date,
  duration: number
): Promise<boolean> {
  // Check provider schedule
  const hasSchedule = await checkProviderAvailability(providerId, startTime, duration);
  if (!hasSchedule) return false;

  // Check for existing appointments
  const conflicts = await findProviderConflicts(providerId, startTime, duration);
  return conflicts.length === 0;
}

/**
 * 11. Blocks time slots for maintenance or breaks.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startTime - Block start time
 * @param {Date} endTime - Block end time
 * @param {string} reason - Reason for blocking
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await blockTimeSlot(
 *   'provider-456',
 *   new Date('2025-01-15T12:00:00'),
 *   new Date('2025-01-15T13:00:00'),
 *   'Lunch break'
 * );
 * ```
 */
export async function blockTimeSlot(
  providerId: string,
  startTime: Date,
  endTime: Date,
  reason: string
): Promise<void> {
  // Create a blocked appointment
  const blockAppointment: Partial<Appointment> = {
    id: generateAppointmentId(),
    providerId,
    patientId: 'BLOCKED',
    startTime,
    endTime,
    duration: (endTime.getTime() - startTime.getTime()) / 60000,
    status: AppointmentStatus.SCHEDULED,
    reasonForVisit: reason,
    metadata: {
      blocked: true,
      blockReason: reason,
    },
  };

  // Save block (implementation specific)
}

/**
 * 12. Releases blocked time slots.
 *
 * @param {string} blockId - Block ID to release
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseBlockedSlot('block-123');
 * console.log('Time slot released and available for booking');
 * ```
 */
export async function releaseBlockedSlot(blockId: string): Promise<void> {
  // Delete the blocked appointment (implementation specific)
}

/**
 * 13. Gets provider's availability summary for a date range.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startDate - Range start date
 * @param {Date} endDate - Range end date
 * @returns {Promise<object>} Availability summary
 *
 * @example
 * ```typescript
 * const summary = await getProviderAvailabilitySummary(
 *   'provider-456',
 *   new Date('2025-01-15'),
 *   new Date('2025-01-20')
 * );
 *
 * console.log('Total slots:', summary.totalSlots);
 * console.log('Available slots:', summary.availableSlots);
 * console.log('Utilization rate:', summary.utilizationRate);
 * ```
 */
export async function getProviderAvailabilitySummary(
  providerId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  utilizationRate: number;
}> {
  const slots = await findAvailableSlots({
    providerId,
    startDate,
    endDate,
  });

  const totalSlots = slots.length;
  const availableSlots = slots.filter(s => s.available).length;
  const bookedSlots = totalSlots - availableSlots;
  const blockedSlots = slots.filter(s => s.maxBookings === 0).length;
  const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

  return {
    totalSlots,
    availableSlots,
    bookedSlots,
    blockedSlots,
    utilizationRate,
  };
}

/**
 * 14. Finds next available slot for provider.
 *
 * @param {string} providerId - Provider ID
 * @param {number} duration - Required duration in minutes
 * @param {AppointmentType} appointmentType - Type of appointment
 * @returns {Promise<AppointmentSlot | null>} Next available slot
 *
 * @example
 * ```typescript
 * const nextSlot = await findNextAvailableSlot(
 *   'provider-456',
 *   30,
 *   AppointmentType.TELEHEALTH
 * );
 *
 * if (nextSlot) {
 *   console.log('Next available:', nextSlot.startTime);
 * }
 * ```
 */
export async function findNextAvailableSlot(
  providerId: string,
  duration: number,
  appointmentType: AppointmentType
): Promise<AppointmentSlot | null> {
  const startDate = new Date();
  const endDate = addDays(startDate, 90); // Look 90 days ahead

  const slots = await findAvailableSlots({
    providerId,
    appointmentType,
    startDate,
    endDate,
    duration,
  });

  return slots.length > 0 ? slots[0] : null;
}

/**
 * 15. Calculates optimal appointment duration based on visit type.
 *
 * @param {string} visitType - Type of visit/procedure
 * @param {boolean} isNewPatient - Whether patient is new
 * @returns {number} Recommended duration in minutes
 *
 * @example
 * ```typescript
 * const duration = calculateOptimalDuration('physical_exam', true);
 * console.log(`Recommended duration: ${duration} minutes`);
 * // Output: Recommended duration: 60 minutes (new patient physical)
 * ```
 */
export function calculateOptimalDuration(visitType: string, isNewPatient: boolean): number {
  const baseDurations: Record<string, number> = {
    physical_exam: 45,
    follow_up: 15,
    consultation: 30,
    procedure: 60,
    vaccination: 15,
    lab_work: 20,
  };

  const base = baseDurations[visitType] || 30;
  return isNewPatient ? base + 15 : base; // Add 15 minutes for new patients
}

// ============================================================================
// SECTION 3: RECURRING APPOINTMENTS AND SERIES (Functions 16-21)
// ============================================================================

/**
 * 16. Creates a recurring appointment series.
 *
 * @param {Partial<Appointment>} template - Appointment template
 * @param {RecurringPattern} pattern - Recurrence pattern
 * @returns {Promise<AppointmentSeries>} Created series
 *
 * @example
 * ```typescript
 * const series = await createRecurringAppointments({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   facilityId: 'facility-789',
 *   appointmentType: AppointmentType.IN_PERSON,
 *   duration: 30,
 *   reasonForVisit: 'Physical therapy session'
 * }, {
 *   frequency: 'weekly',
 *   interval: 1,
 *   daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
 *   occurrences: 12 // 4 weeks, 3 times per week
 * });
 *
 * console.log(`Created ${series.appointments.length} appointments`);
 * ```
 */
export async function createRecurringAppointments(
  template: Partial<Appointment>,
  pattern: RecurringPattern
): Promise<AppointmentSeries> {
  const seriesId = generateSeriesId();
  const appointments: string[] = [];

  // Generate dates based on pattern
  const dates = generateRecurrenceDates(
    template.startTime!,
    pattern
  );

  // Create appointment for each date
  for (const date of dates) {
    const appointment = await bookAppointment({
      patientId: template.patientId!,
      providerId: template.providerId!,
      facilityId: template.facilityId!,
      appointmentType: template.appointmentType!,
      startTime: date,
      duration: template.duration!,
      reasonForVisit: template.reasonForVisit!,
      priority: template.priority,
    }, 'system');

    // Link to series
    appointment.seriesId = seriesId;
    appointments.push(appointment.id);
  }

  const series: AppointmentSeries = {
    seriesId,
    patientId: template.patientId!,
    providerId: template.providerId!,
    pattern,
    appointmentTemplate: template,
    appointments,
    createdAt: new Date(),
    active: true,
  };

  return series;
}

/**
 * 17. Updates all appointments in a recurring series.
 *
 * @param {string} seriesId - Series ID
 * @param {Partial<Appointment>} updates - Updates to apply
 * @param {boolean} updateFutureOnly - Only update future appointments
 * @returns {Promise<number>} Number of appointments updated
 *
 * @example
 * ```typescript
 * const updated = await updateAppointmentSeries('series-123', {
 *   providerId: 'provider-789', // Change provider for all appointments
 *   duration: 45 // Extend duration
 * }, true);
 *
 * console.log(`Updated ${updated} future appointments`);
 * ```
 */
export async function updateAppointmentSeries(
  seriesId: string,
  updates: Partial<Appointment>,
  updateFutureOnly: boolean = true
): Promise<number> {
  const series = await getAppointmentSeries(seriesId);
  let updatedCount = 0;

  for (const appointmentId of series.appointments) {
    const appointment = await getAppointmentById(appointmentId);

    // Skip past appointments if updateFutureOnly
    if (updateFutureOnly && appointment.startTime < new Date()) {
      continue;
    }

    // Apply updates
    await updateAppointment(appointmentId, updates);
    updatedCount++;
  }

  return updatedCount;
}

/**
 * 18. Cancels all appointments in a series.
 *
 * @param {string} seriesId - Series ID
 * @param {string} reason - Cancellation reason
 * @param {boolean} cancelFutureOnly - Only cancel future appointments
 * @returns {Promise<number>} Number of appointments cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await cancelAppointmentSeries(
 *   'series-123',
 *   'Patient moved to different city',
 *   true
 * );
 *
 * console.log(`Cancelled ${cancelled} future appointments`);
 * ```
 */
export async function cancelAppointmentSeries(
  seriesId: string,
  reason: string,
  cancelFutureOnly: boolean = true
): Promise<number> {
  const series = await getAppointmentSeries(seriesId);
  let cancelledCount = 0;

  for (const appointmentId of series.appointments) {
    const appointment = await getAppointmentById(appointmentId);

    // Skip past appointments if cancelFutureOnly
    if (cancelFutureOnly && appointment.startTime < new Date()) {
      continue;
    }

    await cancelAppointment({
      appointmentId,
      reason,
      cancelledBy: 'system',
      notifyPatient: true,
      notifyProvider: true,
      offerReschedule: false,
    });

    cancelledCount++;
  }

  // Mark series as inactive
  await updateSeriesStatus(seriesId, false);

  return cancelledCount;
}

/**
 * 19. Generates recurrence dates from pattern.
 *
 * @param {Date} startDate - Series start date
 * @param {RecurringPattern} pattern - Recurrence pattern
 * @returns {Date[]} Array of appointment dates
 *
 * @example
 * ```typescript
 * const dates = generateRecurrenceDates(
 *   new Date('2025-01-15T10:00:00'),
 *   {
 *     frequency: 'weekly',
 *     interval: 2, // Every 2 weeks
 *     daysOfWeek: [2, 4], // Tuesday, Thursday
 *     occurrences: 8
 *   }
 * );
 *
 * console.log(`Generated ${dates.length} appointment dates`);
 * ```
 */
export function generateRecurrenceDates(startDate: Date, pattern: RecurringPattern): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  let count = 0;

  const maxOccurrences = pattern.occurrences || 52; // Default to 1 year of weekly appointments
  const endDate = pattern.endDate || addDays(startDate, 365);

  while (count < maxOccurrences && currentDate <= endDate) {
    // Check if current date matches pattern
    if (matchesRecurrencePattern(currentDate, startDate, pattern)) {
      dates.push(new Date(currentDate));
      count++;
    }

    // Advance to next potential date
    currentDate = advanceByPattern(currentDate, pattern);
  }

  return dates;
}

/**
 * 20. Checks if date matches recurrence pattern.
 *
 * @param {Date} date - Date to check
 * @param {Date} startDate - Pattern start date
 * @param {RecurringPattern} pattern - Recurrence pattern
 * @returns {boolean} True if date matches pattern
 *
 * @example
 * ```typescript
 * const matches = matchesRecurrencePattern(
 *   new Date('2025-01-22'),
 *   new Date('2025-01-15'),
 *   { frequency: 'weekly', interval: 1, daysOfWeek: [3] }
 * );
 * ```
 */
export function matchesRecurrencePattern(
  date: Date,
  startDate: Date,
  pattern: RecurringPattern
): boolean {
  const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  switch (pattern.frequency) {
    case 'daily':
      return daysDiff % pattern.interval === 0;

    case 'weekly':
    case 'biweekly':
      const weeksDiff = Math.floor(daysDiff / 7);
      const interval = pattern.frequency === 'biweekly' ? 2 : pattern.interval;
      const dayOfWeek = date.getDay();
      return weeksDiff % interval === 0 && (!pattern.daysOfWeek || pattern.daysOfWeek.includes(dayOfWeek));

    case 'monthly':
      const monthsDiff = (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth());
      return monthsDiff % pattern.interval === 0 && (!pattern.dayOfMonth || date.getDate() === pattern.dayOfMonth);

    case 'yearly':
      const yearsDiff = date.getFullYear() - startDate.getFullYear();
      return yearsDiff % pattern.interval === 0 &&
        date.getMonth() === startDate.getMonth() &&
        date.getDate() === startDate.getDate();

    default:
      return false;
  }
}

/**
 * 21. Modifies a single appointment in a recurring series.
 *
 * @param {string} appointmentId - Appointment ID to modify
 * @param {Partial<Appointment>} updates - Updates to apply
 * @param {boolean} detachFromSeries - Whether to remove from series
 * @returns {Promise<Appointment>} Updated appointment
 *
 * @example
 * ```typescript
 * const modified = await modifySeriesAppointment('appt-789', {
 *   startTime: new Date('2025-01-15T11:00:00'), // Different time
 *   duration: 60 // Different duration
 * }, true);
 *
 * console.log('Appointment detached from series:', !modified.seriesId);
 * ```
 */
export async function modifySeriesAppointment(
  appointmentId: string,
  updates: Partial<Appointment>,
  detachFromSeries: boolean = false
): Promise<Appointment> {
  const appointment = await getAppointmentById(appointmentId);

  if (detachFromSeries) {
    delete updates.seriesId;
  }

  return updateAppointment(appointmentId, updates);
}

// ============================================================================
// SECTION 4: WAITLIST MANAGEMENT (Functions 22-27)
// ============================================================================

/**
 * 22. Adds patient to appointment waitlist.
 *
 * @param {WaitlistEntry} entry - Waitlist entry details
 * @returns {Promise<WaitlistEntry>} Created waitlist entry
 *
 * @example
 * ```typescript
 * const waitlistEntry = await addToWaitlist({
 *   id: generateWaitlistId(),
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   facilityId: 'facility-789',
 *   appointmentType: AppointmentType.IN_PERSON,
 *   priority: AppointmentPriority.URGENT,
 *   desiredDate: new Date('2025-01-20'),
 *   desiredTimeRange: { start: '09:00', end: '12:00' },
 *   duration: 30,
 *   reasonForVisit: 'Follow-up consultation',
 *   addedAt: new Date(),
 *   expiresAt: addDays(new Date(), 30),
 *   notified: false,
 *   status: 'active'
 * });
 * ```
 */
export async function addToWaitlist(entry: WaitlistEntry): Promise<WaitlistEntry> {
  // Validate patient is eligible for waitlist
  const rules = await getPatientSchedulingRules(entry.patientId);

  if (rules.noShowPenalty === 'blocked') {
    throw new Error('Patient is blocked from scheduling due to no-show history');
  }

  return entry; // Save to database
}

/**
 * 23. Processes waitlist when slot becomes available.
 *
 * @param {Appointment} cancelledAppointment - Cancelled/freed appointment
 * @returns {Promise<WaitlistEntry[]>} Notified waitlist entries
 *
 * @example
 * ```typescript
 * const notified = await processWaitlistForSlot(cancelledAppointment);
 * console.log(`Notified ${notified.length} waitlist patients`);
 * ```
 */
export async function processWaitlistForSlot(
  cancelledAppointment: Appointment
): Promise<WaitlistEntry[]> {
  // Find matching waitlist entries
  const entries = await findMatchingWaitlistEntries({
    providerId: cancelledAppointment.providerId,
    facilityId: cancelledAppointment.facilityId,
    appointmentType: cancelledAppointment.appointmentType,
    startTime: cancelledAppointment.startTime,
    duration: cancelledAppointment.duration,
  });

  // Sort by priority and add date
  const sorted = sortWaitlistByPriority(entries);

  const notified: WaitlistEntry[] = [];

  // Notify top candidates
  for (const entry of sorted.slice(0, 3)) {
    await notifyWaitlistOpportunity(entry, cancelledAppointment);
    entry.status = 'offered';
    entry.slotOffered = cancelledAppointment.id;
    entry.notified = true;
    notified.push(entry);
  }

  return notified;
}

/**
 * 24. Removes patient from waitlist.
 *
 * @param {string} waitlistId - Waitlist entry ID
 * @param {string} reason - Removal reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFromWaitlist('waitlist-123', 'Patient scheduled elsewhere');
 * ```
 */
export async function removeFromWaitlist(waitlistId: string, reason: string): Promise<void> {
  const entry = await getWaitlistEntry(waitlistId);
  entry.status = 'cancelled';
  entry.metadata = { ...entry.metadata, cancellationReason: reason };
  // Save updated entry
}

/**
 * 25. Gets patient's position in waitlist.
 *
 * @param {string} waitlistId - Waitlist entry ID
 * @returns {Promise<number>} Position in queue (1-indexed)
 *
 * @example
 * ```typescript
 * const position = await getWaitlistPosition('waitlist-123');
 * console.log(`You are number ${position} on the waitlist`);
 * ```
 */
export async function getWaitlistPosition(waitlistId: string): Promise<number> {
  const entry = await getWaitlistEntry(waitlistId);
  const allEntries = await findMatchingWaitlistEntries({
    providerId: entry.providerId,
    facilityId: entry.facilityId,
    appointmentType: entry.appointmentType,
  });

  const sorted = sortWaitlistByPriority(allEntries.filter(e => e.status === 'active'));
  return sorted.findIndex(e => e.id === waitlistId) + 1;
}

/**
 * 26. Converts waitlist entry to appointment.
 *
 * @param {string} waitlistId - Waitlist entry ID
 * @param {Date} appointmentTime - Scheduled time
 * @returns {Promise<Appointment>} Created appointment
 *
 * @example
 * ```typescript
 * const appointment = await convertWaitlistToAppointment(
 *   'waitlist-123',
 *   new Date('2025-01-20T10:00:00')
 * );
 *
 * console.log('Appointment created:', appointment.id);
 * ```
 */
export async function convertWaitlistToAppointment(
  waitlistId: string,
  appointmentTime: Date
): Promise<Appointment> {
  const entry = await getWaitlistEntry(waitlistId);

  const appointment = await bookAppointment({
    patientId: entry.patientId,
    providerId: entry.providerId!,
    facilityId: entry.facilityId,
    appointmentType: entry.appointmentType,
    startTime: appointmentTime,
    duration: entry.duration,
    reasonForVisit: entry.reasonForVisit,
    priority: entry.priority,
  }, 'system');

  // Update waitlist entry
  entry.status = 'scheduled';
  entry.metadata = { ...entry.metadata, appointmentId: appointment.id };

  return appointment;
}

/**
 * 27. Expires old waitlist entries automatically.
 *
 * @returns {Promise<number>} Number of entries expired
 *
 * @example
 * ```typescript
 * const expired = await expireOldWaitlistEntries();
 * console.log(`Expired ${expired} old waitlist entries`);
 * ```
 */
export async function expireOldWaitlistEntries(): Promise<number> {
  const now = new Date();
  const entries = await getAllActiveWaitlistEntries();

  let expiredCount = 0;

  for (const entry of entries) {
    if (entry.expiresAt && entry.expiresAt < now) {
      entry.status = 'expired';
      expiredCount++;
    }
  }

  return expiredCount;
}

// ============================================================================
// SECTION 5: APPOINTMENT REMINDERS (Functions 28-32)
// ============================================================================

/**
 * 28. Schedules appointment reminders for multiple channels.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {ReminderChannel[]} channels - Channels to use
 * @param {number[]} hoursBeforeArray - Hours before appointment for each reminder
 * @returns {Promise<ReminderSchedule[]>} Scheduled reminders
 *
 * @example
 * ```typescript
 * const reminders = await scheduleAppointmentReminders(
 *   'appt-789',
 *   [ReminderChannel.SMS, ReminderChannel.EMAIL, ReminderChannel.PUSH],
 *   [24, 2] // 24 hours and 2 hours before
 * );
 *
 * console.log(`Scheduled ${reminders.length} reminders`);
 * ```
 */
export async function scheduleAppointmentReminders(
  appointmentId: string,
  channels: ReminderChannel[],
  hoursBeforeArray: number[]
): Promise<ReminderSchedule[]> {
  const appointment = await getAppointmentById(appointmentId);
  const reminders: ReminderSchedule[] = [];

  for (const hoursBefore of hoursBeforeArray) {
    const reminderTime = new Date(appointment.startTime.getTime() - hoursBefore * 60 * 60 * 1000);

    for (const channel of channels) {
      const reminder: ReminderSchedule = {
        id: generateReminderId(),
        channel,
        scheduledTime: reminderTime,
        sent: false,
      };

      reminders.push(reminder);
    }
  }

  return reminders;
}

/**
 * 29. Sends appointment reminder via specified channel.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {ReminderChannel} channel - Channel to send reminder
 * @returns {Promise<boolean>} True if sent successfully
 *
 * @example
 * ```typescript
 * const sent = await sendAppointmentReminder('appt-789', ReminderChannel.SMS);
 *
 * if (sent) {
 *   console.log('SMS reminder sent successfully');
 * }
 * ```
 */
export async function sendAppointmentReminder(
  appointmentId: string,
  channel: ReminderChannel
): Promise<boolean> {
  const appointment = await getAppointmentById(appointmentId);
  const patient = await getPatient(appointment.patientId);
  const provider = await getProvider(appointment.providerId);

  const message = formatReminderMessage(appointment, provider);

  switch (channel) {
    case ReminderChannel.SMS:
      return sendSMSReminder(patient.phoneNumber, message);

    case ReminderChannel.EMAIL:
      return sendEmailReminder(patient.email, 'Appointment Reminder', message);

    case ReminderChannel.PUSH:
      return sendPushNotification(patient.deviceTokens, message);

    case ReminderChannel.PHONE:
      return schedulePhoneReminder(patient.phoneNumber, message);

    default:
      return false;
  }
}

/**
 * 30. Processes due reminders in batch.
 *
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await processDueReminders();
 * console.log(`Sent ${sent} appointment reminders`);
 * ```
 */
export async function processDueReminders(): Promise<number> {
  const now = new Date();
  const dueReminders = await getDueReminders(now);

  let sentCount = 0;

  for (const reminder of dueReminders) {
    try {
      const sent = await sendReminderById(reminder.id);
      if (sent) {
        reminder.sent = true;
        reminder.sentAt = new Date();
        sentCount++;
      }
    } catch (error) {
      console.error(`Failed to send reminder ${reminder.id}:`, error);
    }
  }

  return sentCount;
}

/**
 * 31. Records reminder acknowledgment from patient.
 *
 * @param {string} reminderId - Reminder ID
 * @param {Date} acknowledgedAt - Acknowledgment time
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await acknowledgeReminder('reminder-456', new Date());
 * console.log('Patient confirmed receipt of reminder');
 * ```
 */
export async function acknowledgeReminder(reminderId: string, acknowledgedAt: Date): Promise<void> {
  const reminder = await getReminder(reminderId);
  reminder.acknowledged = true;
  reminder.acknowledgedAt = acknowledgedAt;
  // Save updated reminder
}

/**
 * 32. Customizes reminder message template.
 *
 * @param {Appointment} appointment - Appointment details
 * @param {object} provider - Provider details
 * @returns {string} Formatted reminder message
 *
 * @example
 * ```typescript
 * const message = formatReminderMessage(appointment, provider);
 * console.log(message);
 * // Output: "Reminder: You have an appointment with Dr. Smith on Jan 15 at 10:00 AM
 * //          at White Cross Medical Center. Please arrive 15 minutes early."
 * ```
 */
export function formatReminderMessage(appointment: Appointment, provider: any): string {
  const dateStr = format(appointment.startTime, 'MMM dd');
  const timeStr = format(appointment.startTime, 'h:mm a');

  let message = `Reminder: You have an appointment with ${provider.name} on ${dateStr} at ${timeStr}`;

  if (appointment.appointmentType === AppointmentType.TELEHEALTH && appointment.telehealth) {
    message += `\n\nTelehealth Link: ${appointment.telehealth.meetingUrl}`;
  } else {
    message += `\n\nLocation: ${provider.facilityName}`;
  }

  message += '\n\nPlease arrive 15 minutes early. Reply CONFIRM to confirm or CANCEL to cancel.';

  return message;
}

// ============================================================================
// SECTION 6: NO-SHOW TRACKING AND PENALTIES (Functions 33-36)
// ============================================================================

/**
 * 33. Gets patient's no-show history.
 *
 * @param {string} patientId - Patient ID
 * @param {number} months - Months of history to retrieve
 * @returns {Promise<NoShowRecord[]>} No-show records
 *
 * @example
 * ```typescript
 * const history = await getPatientNoShowHistory('patient-123', 12);
 * console.log(`Patient has ${history.length} no-shows in past year`);
 * ```
 */
export async function getPatientNoShowHistory(
  patientId: string,
  months: number = 12
): Promise<NoShowRecord[]> {
  const since = addDays(new Date(), -30 * months);
  // Query no-show records for patient since date
  return []; // Placeholder
}

/**
 * 34. Determines appropriate no-show penalty.
 *
 * @param {PatientSchedulingRules} rules - Patient scheduling rules
 * @returns {object} Penalty details
 *
 * @example
 * ```typescript
 * const penalty = determineNoShowPenalty(patientRules);
 * console.log('Penalty type:', penalty.type);
 * console.log('Penalty amount:', penalty.amount);
 * ```
 */
export function determineNoShowPenalty(
  rules: PatientSchedulingRules
): { type: 'warning' | 'fee' | 'restriction' | 'none'; amount?: number } {
  if (rules.noShowCount === 0) {
    return { type: 'warning' };
  } else if (rules.noShowCount === 1) {
    return { type: 'fee', amount: 25 };
  } else if (rules.noShowCount === 2) {
    return { type: 'fee', amount: 50 };
  } else {
    return { type: 'restriction' };
  }
}

/**
 * 35. Applies penalty to patient account.
 *
 * @param {string} patientId - Patient ID
 * @param {NoShowRecord} record - No-show record
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyNoShowPenalty('patient-123', noShowRecord);
 * console.log('Penalty applied to patient account');
 * ```
 */
export async function applyNoShowPenalty(patientId: string, record: NoShowRecord): Promise<void> {
  if (!record.penaltyApplied) return;

  switch (record.penaltyType) {
    case 'fee':
      await addPatientCharge(patientId, record.penaltyAmount!, 'No-show fee');
      break;

    case 'restriction':
      await updatePatientSchedulingRules(patientId, {
        requiresApproval: true,
        noShowPenalty: 'restricted',
      });
      break;

    case 'warning':
      await sendPenaltyWarning(patientId, 'no-show');
      break;
  }
}

/**
 * 36. Clears no-show penalties after grace period.
 *
 * @param {string} patientId - Patient ID
 * @param {number} graceMonths - Months of good behavior required
 * @returns {Promise<boolean>} True if penalties cleared
 *
 * @example
 * ```typescript
 * const cleared = await clearNoShowPenalties('patient-123', 6);
 *
 * if (cleared) {
 *   console.log('Patient penalties cleared after 6 months of good behavior');
 * }
 * ```
 */
export async function clearNoShowPenalties(patientId: string, graceMonths: number): Promise<boolean> {
  const rules = await getPatientSchedulingRules(patientId);

  if (!rules.lastNoShowDate) return false;

  const monthsSinceLastNoShow =
    (new Date().getTime() - rules.lastNoShowDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsSinceLastNoShow >= graceMonths) {
    await updatePatientSchedulingRules(patientId, {
      noShowCount: 0,
      noShowPenalty: 'none',
      requiresApproval: false,
    });
    return true;
  }

  return false;
}

// ============================================================================
// SECTION 7: TELEHEALTH AND MULTI-PROVIDER (Functions 37-40)
// ============================================================================

/**
 * 37. Creates telehealth session for appointment.
 *
 * @param {Appointment} appointment - Appointment details
 * @returns {Promise<TelehealthDetails>} Telehealth session details
 *
 * @example
 * ```typescript
 * const session = await createTelehealthSession(appointment);
 * console.log('Meeting URL:', session.meetingUrl);
 * console.log('Meeting ID:', session.meetingId);
 * ```
 */
export async function createTelehealthSession(appointment: Appointment): Promise<TelehealthDetails> {
  // Integration with telehealth platform (Zoom, Teams, etc.)
  const session: TelehealthDetails = {
    platform: 'zoom',
    meetingUrl: `https://zoom.us/j/${generateMeetingId()}`,
    meetingId: generateMeetingId(),
    password: generateMeetingPassword(),
    waitingRoomEnabled: true,
    recordingEnabled: false,
  };

  return session;
}

/**
 * 38. Schedules multi-provider appointment.
 *
 * @param {string[]} providerIds - Array of provider IDs
 * @param {AppointmentBookingRequest} request - Booking request
 * @returns {Promise<Appointment>} Created multi-provider appointment
 *
 * @example
 * ```typescript
 * const multiProviderAppt = await scheduleMultiProviderAppointment(
 *   ['provider-456', 'provider-789', 'provider-012'],
 *   {
 *     patientId: 'patient-123',
 *     facilityId: 'facility-789',
 *     appointmentType: AppointmentType.IN_PERSON,
 *     startTime: new Date('2025-01-15T14:00:00'),
 *     duration: 60,
 *     reasonForVisit: 'Multi-disciplinary consultation'
 *   }
 * );
 * ```
 */
export async function scheduleMultiProviderAppointment(
  providerIds: string[],
  request: Omit<AppointmentBookingRequest, 'providerId'>
): Promise<Appointment> {
  // Validate all providers are available
  for (const providerId of providerIds) {
    const available = await checkProviderAvailability(providerId, request.startTime, request.duration);
    if (!available) {
      throw new Error(`Provider ${providerId} is not available`);
    }
  }

  // Create primary appointment with first provider
  const appointment = await bookAppointment(
    {
      ...request,
      providerId: providerIds[0],
    },
    'system'
  );

  // Link other providers
  appointment.metadata = {
    ...appointment.metadata,
    multiProvider: true,
    additionalProviders: providerIds.slice(1),
  };

  return appointment;
}

/**
 * 39. Validates telehealth readiness for patient.
 *
 * @param {string} patientId - Patient ID
 * @returns {Promise<object>} Readiness assessment
 *
 * @example
 * ```typescript
 * const readiness = await validateTelehealthReadiness('patient-123');
 *
 * if (!readiness.ready) {
 *   console.log('Issues:', readiness.issues);
 *   // Output: ['No verified email', 'Browser not compatible']
 * }
 * ```
 */
export async function validateTelehealthReadiness(
  patientId: string
): Promise<{ ready: boolean; issues: string[] }> {
  const patient = await getPatient(patientId);
  const issues: string[] = [];

  if (!patient.email || !patient.emailVerified) {
    issues.push('No verified email address');
  }

  if (!patient.phoneNumber || !patient.phoneVerified) {
    issues.push('No verified phone number');
  }

  if (!patient.hasAcceptedTelehealthConsent) {
    issues.push('Telehealth consent not signed');
  }

  // Additional technical checks could be added
  // - Browser compatibility
  // - Internet connection speed
  // - Camera/microphone permissions

  return {
    ready: issues.length === 0,
    issues,
  };
}

/**
 * 40. Sends telehealth session link to patient.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {ReminderChannel[]} channels - Channels to send link
 * @returns {Promise<boolean>} True if sent successfully
 *
 * @example
 * ```typescript
 * const sent = await sendTelehealthLink(
 *   'appt-789',
 *   [ReminderChannel.EMAIL, ReminderChannel.SMS]
 * );
 *
 * if (sent) {
 *   console.log('Telehealth link sent to patient');
 * }
 * ```
 */
export async function sendTelehealthLink(
  appointmentId: string,
  channels: ReminderChannel[]
): Promise<boolean> {
  const appointment = await getAppointmentById(appointmentId);

  if (!appointment.telehealth) {
    throw new Error('Appointment is not a telehealth appointment');
  }

  const patient = await getPatient(appointment.patientId);
  const message = `Your telehealth appointment is ready!\n\nJoin here: ${appointment.telehealth.meetingUrl}\nMeeting ID: ${appointment.telehealth.meetingId}\nPassword: ${appointment.telehealth.password || 'None'}`;

  let success = true;

  for (const channel of channels) {
    switch (channel) {
      case ReminderChannel.EMAIL:
        success = success && await sendEmailReminder(patient.email, 'Telehealth Appointment Link', message);
        break;

      case ReminderChannel.SMS:
        success = success && await sendSMSReminder(patient.phoneNumber, message);
        break;
    }
  }

  return success;
}

// ============================================================================
// SECTION 8: RESOURCE SCHEDULING AND CALENDAR INTEGRATION (Functions 41-45)
// ============================================================================

/**
 * 41. Allocates resources for appointment.
 *
 * @param {ResourceRequirement[]} requirements - Resource requirements
 * @param {Date} startTime - Appointment start time
 * @param {number} duration - Duration in minutes
 * @returns {Promise<ResourceAllocation[]>} Allocated resources
 *
 * @example
 * ```typescript
 * const allocated = await allocateResources([
 *   { resourceType: 'room', required: true },
 *   { resourceType: 'equipment', resourceId: 'xray-01', required: true }
 * ], new Date('2025-01-15T10:00:00'), 30);
 *
 * console.log('Allocated resources:', allocated);
 * ```
 */
export async function allocateResources(
  requirements: ResourceRequirement[],
  startTime: Date,
  duration: number
): Promise<ResourceAllocation[]> {
  const allocations: ResourceAllocation[] = [];
  const endTime = addMinutes(startTime, duration);

  for (const req of requirements) {
    let resourceId = req.resourceId;

    // Find available resource if not specified
    if (!resourceId) {
      resourceId = await findAvailableResource(req.resourceType, startTime, endTime);
    }

    if (!resourceId && req.required) {
      throw new Error(`Required resource of type ${req.resourceType} not available`);
    }

    if (resourceId) {
      const allocation: ResourceAllocation = {
        resourceId,
        resourceType: req.resourceType,
        resourceName: await getResourceName(resourceId),
        startTime,
        endTime,
        confirmed: true,
      };

      allocations.push(allocation);
    }
  }

  return allocations;
}

/**
 * 42. Releases allocated resources.
 *
 * @param {ResourceAllocation[]} allocations - Allocations to release
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseResources(appointment.resources);
 * console.log('Resources released and available for booking');
 * ```
 */
export async function releaseResources(allocations: ResourceAllocation[]): Promise<void> {
  for (const allocation of allocations) {
    // Mark resource as available (implementation specific)
    await markResourceAvailable(allocation.resourceId, allocation.startTime, allocation.endTime);
  }
}

/**
 * 43. Exports appointment to iCalendar format.
 *
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<CalendarExport>} iCal export data
 *
 * @example
 * ```typescript
 * const ical = await exportToICalendar('appt-789');
 * console.log('Download this .ics file:', ical.data);
 * ```
 */
export async function exportToICalendar(appointmentId: string): Promise<CalendarExport> {
  const appointment = await getAppointmentById(appointmentId);
  const provider = await getProvider(appointment.providerId);

  // Generate iCal format
  const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//White Cross//Appointment System//EN
BEGIN:VEVENT
UID:${appointment.id}@whitecross.com
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(appointment.startTime)}
DTEND:${formatICalDate(appointment.endTime)}
SUMMARY:Appointment with ${provider.name}
DESCRIPTION:${appointment.reasonForVisit}
LOCATION:${appointment.appointmentType === AppointmentType.TELEHEALTH ? appointment.telehealth?.meetingUrl : provider.facilityAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  return {
    format: 'ical',
    data: icalData,
  };
}

/**
 * 44. Creates Google Calendar event link.
 *
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<CalendarExport>} Google Calendar export
 *
 * @example
 * ```typescript
 * const googleCal = await exportToGoogleCalendar('appt-789');
 * console.log('Add to Google Calendar:', googleCal.url);
 * ```
 */
export async function exportToGoogleCalendar(appointmentId: string): Promise<CalendarExport> {
  const appointment = await getAppointmentById(appointmentId);
  const provider = await getProvider(appointment.providerId);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Appointment with ${provider.name}`,
    dates: `${formatGoogleDate(appointment.startTime)}/${formatGoogleDate(appointment.endTime)}`,
    details: appointment.reasonForVisit,
    location: appointment.appointmentType === AppointmentType.TELEHEALTH
      ? appointment.telehealth?.meetingUrl || ''
      : provider.facilityAddress,
  });

  const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

  return {
    format: 'google',
    data: '',
    url,
  };
}

/**
 * 45. Syncs appointments with external calendar system.
 *
 * @param {string} patientId - Patient ID
 * @param {string} calendarProvider - Calendar provider (google, outlook, apple)
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<number>} Number of appointments synced
 *
 * @example
 * ```typescript
 * const synced = await syncWithExternalCalendar(
 *   'patient-123',
 *   'google',
 *   googleOAuthToken
 * );
 *
 * console.log(`Synced ${synced} appointments to Google Calendar`);
 * ```
 */
export async function syncWithExternalCalendar(
  patientId: string,
  calendarProvider: string,
  accessToken: string
): Promise<number> {
  const appointments = await getPatientUpcomingAppointments(patientId);
  let syncedCount = 0;

  for (const appointment of appointments) {
    try {
      await syncAppointmentToCalendar(appointment, calendarProvider, accessToken);
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync appointment ${appointment.id}:`, error);
    }
  }

  return syncedCount;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateAppointmentId(): string {
  return `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSeriesId(): string {
  return `series-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateWaitlistId(): string {
  return `waitlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateReminderId(): string {
  return `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateNoShowId(): string {
  return `noshow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateMeetingId(): string {
  return Math.random().toString(10).substr(2, 10);
}

function generateMeetingPassword(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function advanceByPattern(date: Date, pattern: RecurringPattern): Date {
  switch (pattern.frequency) {
    case 'daily':
      return addDays(date, 1);
    case 'weekly':
    case 'biweekly':
      return addDays(date, 1);
    case 'monthly':
      return addDays(date, 1);
    case 'yearly':
      return addDays(date, 1);
    default:
      return addDays(date, 1);
  }
}

function sortWaitlistByPriority(entries: WaitlistEntry[]): WaitlistEntry[] {
  return entries.sort((a, b) => {
    // Priority first
    const priorityOrder = { emergency: 0, urgent: 1, follow_up: 2, routine: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by added date
    return a.addedAt.getTime() - b.addedAt.getTime();
  });
}

// Placeholder functions (would be implemented with actual database/service calls)
async function getAppointmentById(id: string): Promise<Appointment> { return {} as Appointment; }
async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> { return {} as Appointment; }
async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> { }
async function getPatientSchedulingRules(patientId: string): Promise<PatientSchedulingRules> { return {} as PatientSchedulingRules; }
async function updatePatientSchedulingRules(patientId: string, updates: Partial<PatientSchedulingRules>): Promise<void> { }
async function incrementPatientNoShowCount(patientId: string): Promise<void> { }
async function checkProviderAvailability(providerId: string, startTime: Date, duration: number): Promise<boolean> { return true; }
async function checkFacilityHours(facilityId: string, time: Date): Promise<boolean> { return true; }
async function findPatientConflicts(patientId: string, startTime: Date, duration: number): Promise<string[]> { return []; }
async function findProviderConflicts(providerId: string, startTime: Date, duration: number): Promise<string[]> { return []; }
async function findAlternativeSlots(request: AppointmentBookingRequest, count: number): Promise<Date[]> { return []; }
async function sendRescheduleNotification(appointment: Appointment, recipient: string): Promise<void> { }
async function sendCancellationNotification(appointment: Appointment, recipient: string, offerReschedule: boolean): Promise<void> { }
async function scheduleFollowUp(appointment: Appointment, daysFromNow: number): Promise<void> { }
async function getProviderSchedule(providerId: string | undefined, date: Date): Promise<ProviderSchedule | null> { return null; }
async function generateSlotsFromSchedule(schedule: ProviderSchedule, date: Date, duration: number, startTime?: string, endTime?: string): Promise<AppointmentSlot[]> { return []; }
async function filterBookedSlots(slots: AppointmentSlot[], appointmentType?: AppointmentType): Promise<AppointmentSlot[]> { return slots; }
async function getAppointmentSeries(seriesId: string): Promise<AppointmentSeries> { return {} as AppointmentSeries; }
async function updateSeriesStatus(seriesId: string, active: boolean): Promise<void> { }
async function findMatchingWaitlistEntries(criteria: any): Promise<WaitlistEntry[]> { return []; }
async function notifyWaitlistOpportunity(entry: WaitlistEntry, appointment: Appointment): Promise<void> { }
async function getWaitlistEntry(id: string): Promise<WaitlistEntry> { return {} as WaitlistEntry; }
async function getAllActiveWaitlistEntries(): Promise<WaitlistEntry[]> { return []; }
async function getPatient(patientId: string): Promise<any> { return {}; }
async function getProvider(providerId: string): Promise<any> { return {}; }
async function sendSMSReminder(phone: string, message: string): Promise<boolean> { return true; }
async function sendEmailReminder(email: string, subject: string, message: string): Promise<boolean> { return true; }
async function sendPushNotification(tokens: string[], message: string): Promise<boolean> { return true; }
async function schedulePhoneReminder(phone: string, message: string): Promise<boolean> { return true; }
async function getDueReminders(time: Date): Promise<ReminderSchedule[]> { return []; }
async function sendReminderById(id: string): Promise<boolean> { return true; }
async function getReminder(id: string): Promise<ReminderSchedule> { return {} as ReminderSchedule; }
async function addPatientCharge(patientId: string, amount: number, description: string): Promise<void> { }
async function sendPenaltyWarning(patientId: string, type: string): Promise<void> { }
async function findAvailableResource(type: string, startTime: Date, endTime: Date): Promise<string | null> { return null; }
async function getResourceName(resourceId: string): Promise<string> { return ''; }
async function markResourceAvailable(resourceId: string, startTime: Date, endTime: Date): Promise<void> { }
async function getPatientUpcomingAppointments(patientId: string): Promise<Appointment[]> { return []; }
async function syncAppointmentToCalendar(appointment: Appointment, provider: string, token: string): Promise<void> { }

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Appointment Booking and Management
  bookAppointment,
  validateAppointmentSlot,
  rescheduleAppointment,
  cancelAppointment,
  confirmAppointment,
  checkInAppointment,
  completeAppointment,
  recordNoShow,

  // Slot Availability and Management
  findAvailableSlots,
  isSlotAvailable,
  blockTimeSlot,
  releaseBlockedSlot,
  getProviderAvailabilitySummary,
  findNextAvailableSlot,
  calculateOptimalDuration,

  // Recurring Appointments
  createRecurringAppointments,
  updateAppointmentSeries,
  cancelAppointmentSeries,
  generateRecurrenceDates,
  matchesRecurrencePattern,
  modifySeriesAppointment,

  // Waitlist Management
  addToWaitlist,
  processWaitlistForSlot,
  removeFromWaitlist,
  getWaitlistPosition,
  convertWaitlistToAppointment,
  expireOldWaitlistEntries,

  // Appointment Reminders
  scheduleAppointmentReminders,
  sendAppointmentReminder,
  processDueReminders,
  acknowledgeReminder,
  formatReminderMessage,

  // No-Show Tracking
  getPatientNoShowHistory,
  determineNoShowPenalty,
  applyNoShowPenalty,
  clearNoShowPenalties,

  // Telehealth and Multi-Provider
  createTelehealthSession,
  scheduleMultiProviderAppointment,
  validateTelehealthReadiness,
  sendTelehealthLink,

  // Resource Scheduling and Calendar Integration
  allocateResources,
  releaseResources,
  exportToICalendar,
  exportToGoogleCalendar,
  syncWithExternalCalendar,
};
