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
 * Appointment type enumeration
 */
export declare enum AppointmentType {
    IN_PERSON = "in_person",
    TELEHEALTH = "telehealth",
    PHONE = "phone",
    HOME_VISIT = "home_visit"
}
/**
 * Appointment status enumeration
 */
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked_in",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled"
}
/**
 * Appointment priority levels
 */
export declare enum AppointmentPriority {
    ROUTINE = "routine",
    URGENT = "urgent",
    EMERGENCY = "emergency",
    FOLLOW_UP = "follow_up"
}
/**
 * Reminder channel types
 */
export declare enum ReminderChannel {
    SMS = "sms",
    EMAIL = "email",
    PUSH = "push",
    PHONE = "phone"
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
    duration: number;
    reasonForVisit: string;
    chiefComplaint?: string;
    specialInstructions?: string;
    telehealth?: TelehealthDetails;
    seriesId?: string;
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
    preferredDays?: number[];
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
}
/**
 * Recurring appointment pattern
 */
export interface RecurringPattern {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    endDate?: Date;
    occurrences?: number;
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
    appointments: string[];
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
    desiredTimeRange?: {
        start: string;
        end: string;
    };
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
    resourceId?: string;
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
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    breakTimes?: {
        start: string;
        end: string;
    }[];
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
export declare function bookAppointment(request: AppointmentBookingRequest, bookedBy: string): Promise<Appointment>;
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
export declare function validateAppointmentSlot(request: AppointmentBookingRequest): Promise<ConflictResolution>;
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
export declare function rescheduleAppointment(request: RescheduleRequest): Promise<Appointment>;
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
export declare function cancelAppointment(request: CancellationRequest): Promise<Appointment>;
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
export declare function confirmAppointment(appointmentId: string, confirmedBy: string): Promise<Appointment>;
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
export declare function checkInAppointment(appointmentId: string, checkedInBy: string): Promise<Appointment>;
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
export declare function completeAppointment(appointmentId: string, outcome: {
    completedBy: string;
    duration?: number;
    followUpRequired?: boolean;
    followUpInDays?: number;
    notes?: string;
}): Promise<Appointment>;
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
export declare function recordNoShow(appointmentId: string, recordedBy: string, applyPenalty?: boolean): Promise<NoShowRecord>;
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
export declare function findAvailableSlots(query: SlotAvailabilityQuery): Promise<AppointmentSlot[]>;
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
export declare function isSlotAvailable(providerId: string, startTime: Date, duration: number): Promise<boolean>;
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
export declare function blockTimeSlot(providerId: string, startTime: Date, endTime: Date, reason: string): Promise<void>;
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
export declare function releaseBlockedSlot(blockId: string): Promise<void>;
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
export declare function getProviderAvailabilitySummary(providerId: string, startDate: Date, endDate: Date): Promise<{
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    blockedSlots: number;
    utilizationRate: number;
}>;
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
export declare function findNextAvailableSlot(providerId: string, duration: number, appointmentType: AppointmentType): Promise<AppointmentSlot | null>;
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
export declare function calculateOptimalDuration(visitType: string, isNewPatient: boolean): number;
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
export declare function createRecurringAppointments(template: Partial<Appointment>, pattern: RecurringPattern): Promise<AppointmentSeries>;
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
export declare function updateAppointmentSeries(seriesId: string, updates: Partial<Appointment>, updateFutureOnly?: boolean): Promise<number>;
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
export declare function cancelAppointmentSeries(seriesId: string, reason: string, cancelFutureOnly?: boolean): Promise<number>;
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
export declare function generateRecurrenceDates(startDate: Date, pattern: RecurringPattern): Date[];
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
export declare function matchesRecurrencePattern(date: Date, startDate: Date, pattern: RecurringPattern): boolean;
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
export declare function modifySeriesAppointment(appointmentId: string, updates: Partial<Appointment>, detachFromSeries?: boolean): Promise<Appointment>;
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
export declare function addToWaitlist(entry: WaitlistEntry): Promise<WaitlistEntry>;
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
export declare function processWaitlistForSlot(cancelledAppointment: Appointment): Promise<WaitlistEntry[]>;
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
export declare function removeFromWaitlist(waitlistId: string, reason: string): Promise<void>;
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
export declare function getWaitlistPosition(waitlistId: string): Promise<number>;
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
export declare function convertWaitlistToAppointment(waitlistId: string, appointmentTime: Date): Promise<Appointment>;
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
export declare function expireOldWaitlistEntries(): Promise<number>;
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
export declare function scheduleAppointmentReminders(appointmentId: string, channels: ReminderChannel[], hoursBeforeArray: number[]): Promise<ReminderSchedule[]>;
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
export declare function sendAppointmentReminder(appointmentId: string, channel: ReminderChannel): Promise<boolean>;
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
export declare function processDueReminders(): Promise<number>;
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
export declare function acknowledgeReminder(reminderId: string, acknowledgedAt: Date): Promise<void>;
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
export declare function formatReminderMessage(appointment: Appointment, provider: any): string;
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
export declare function getPatientNoShowHistory(patientId: string, months?: number): Promise<NoShowRecord[]>;
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
export declare function determineNoShowPenalty(rules: PatientSchedulingRules): {
    type: 'warning' | 'fee' | 'restriction' | 'none';
    amount?: number;
};
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
export declare function applyNoShowPenalty(patientId: string, record: NoShowRecord): Promise<void>;
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
export declare function clearNoShowPenalties(patientId: string, graceMonths: number): Promise<boolean>;
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
export declare function createTelehealthSession(appointment: Appointment): Promise<TelehealthDetails>;
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
export declare function scheduleMultiProviderAppointment(providerIds: string[], request: Omit<AppointmentBookingRequest, 'providerId'>): Promise<Appointment>;
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
export declare function validateTelehealthReadiness(patientId: string): Promise<{
    ready: boolean;
    issues: string[];
}>;
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
export declare function sendTelehealthLink(appointmentId: string, channels: ReminderChannel[]): Promise<boolean>;
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
export declare function allocateResources(requirements: ResourceRequirement[], startTime: Date, duration: number): Promise<ResourceAllocation[]>;
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
export declare function releaseResources(allocations: ResourceAllocation[]): Promise<void>;
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
export declare function exportToICalendar(appointmentId: string): Promise<CalendarExport>;
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
export declare function exportToGoogleCalendar(appointmentId: string): Promise<CalendarExport>;
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
export declare function syncWithExternalCalendar(patientId: string, calendarProvider: string, accessToken: string): Promise<number>;
declare const _default: {
    bookAppointment: typeof bookAppointment;
    validateAppointmentSlot: typeof validateAppointmentSlot;
    rescheduleAppointment: typeof rescheduleAppointment;
    cancelAppointment: typeof cancelAppointment;
    confirmAppointment: typeof confirmAppointment;
    checkInAppointment: typeof checkInAppointment;
    completeAppointment: typeof completeAppointment;
    recordNoShow: typeof recordNoShow;
    findAvailableSlots: typeof findAvailableSlots;
    isSlotAvailable: typeof isSlotAvailable;
    blockTimeSlot: typeof blockTimeSlot;
    releaseBlockedSlot: typeof releaseBlockedSlot;
    getProviderAvailabilitySummary: typeof getProviderAvailabilitySummary;
    findNextAvailableSlot: typeof findNextAvailableSlot;
    calculateOptimalDuration: typeof calculateOptimalDuration;
    createRecurringAppointments: typeof createRecurringAppointments;
    updateAppointmentSeries: typeof updateAppointmentSeries;
    cancelAppointmentSeries: typeof cancelAppointmentSeries;
    generateRecurrenceDates: typeof generateRecurrenceDates;
    matchesRecurrencePattern: typeof matchesRecurrencePattern;
    modifySeriesAppointment: typeof modifySeriesAppointment;
    addToWaitlist: typeof addToWaitlist;
    processWaitlistForSlot: typeof processWaitlistForSlot;
    removeFromWaitlist: typeof removeFromWaitlist;
    getWaitlistPosition: typeof getWaitlistPosition;
    convertWaitlistToAppointment: typeof convertWaitlistToAppointment;
    expireOldWaitlistEntries: typeof expireOldWaitlistEntries;
    scheduleAppointmentReminders: typeof scheduleAppointmentReminders;
    sendAppointmentReminder: typeof sendAppointmentReminder;
    processDueReminders: typeof processDueReminders;
    acknowledgeReminder: typeof acknowledgeReminder;
    formatReminderMessage: typeof formatReminderMessage;
    getPatientNoShowHistory: typeof getPatientNoShowHistory;
    determineNoShowPenalty: typeof determineNoShowPenalty;
    applyNoShowPenalty: typeof applyNoShowPenalty;
    clearNoShowPenalties: typeof clearNoShowPenalties;
    createTelehealthSession: typeof createTelehealthSession;
    scheduleMultiProviderAppointment: typeof scheduleMultiProviderAppointment;
    validateTelehealthReadiness: typeof validateTelehealthReadiness;
    sendTelehealthLink: typeof sendTelehealthLink;
    allocateResources: typeof allocateResources;
    releaseResources: typeof releaseResources;
    exportToICalendar: typeof exportToICalendar;
    exportToGoogleCalendar: typeof exportToGoogleCalendar;
    syncWithExternalCalendar: typeof syncWithExternalCalendar;
};
export default _default;
//# sourceMappingURL=health-appointment-scheduling-kit.d.ts.map