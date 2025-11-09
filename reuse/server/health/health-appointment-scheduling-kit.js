"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderChannel = exports.AppointmentPriority = exports.AppointmentStatus = exports.AppointmentType = void 0;
exports.bookAppointment = bookAppointment;
exports.validateAppointmentSlot = validateAppointmentSlot;
exports.rescheduleAppointment = rescheduleAppointment;
exports.cancelAppointment = cancelAppointment;
exports.confirmAppointment = confirmAppointment;
exports.checkInAppointment = checkInAppointment;
exports.completeAppointment = completeAppointment;
exports.recordNoShow = recordNoShow;
exports.findAvailableSlots = findAvailableSlots;
exports.isSlotAvailable = isSlotAvailable;
exports.blockTimeSlot = blockTimeSlot;
exports.releaseBlockedSlot = releaseBlockedSlot;
exports.getProviderAvailabilitySummary = getProviderAvailabilitySummary;
exports.findNextAvailableSlot = findNextAvailableSlot;
exports.calculateOptimalDuration = calculateOptimalDuration;
exports.createRecurringAppointments = createRecurringAppointments;
exports.updateAppointmentSeries = updateAppointmentSeries;
exports.cancelAppointmentSeries = cancelAppointmentSeries;
exports.generateRecurrenceDates = generateRecurrenceDates;
exports.matchesRecurrencePattern = matchesRecurrencePattern;
exports.modifySeriesAppointment = modifySeriesAppointment;
exports.addToWaitlist = addToWaitlist;
exports.processWaitlistForSlot = processWaitlistForSlot;
exports.removeFromWaitlist = removeFromWaitlist;
exports.getWaitlistPosition = getWaitlistPosition;
exports.convertWaitlistToAppointment = convertWaitlistToAppointment;
exports.expireOldWaitlistEntries = expireOldWaitlistEntries;
exports.scheduleAppointmentReminders = scheduleAppointmentReminders;
exports.sendAppointmentReminder = sendAppointmentReminder;
exports.processDueReminders = processDueReminders;
exports.acknowledgeReminder = acknowledgeReminder;
exports.formatReminderMessage = formatReminderMessage;
exports.getPatientNoShowHistory = getPatientNoShowHistory;
exports.determineNoShowPenalty = determineNoShowPenalty;
exports.applyNoShowPenalty = applyNoShowPenalty;
exports.clearNoShowPenalties = clearNoShowPenalties;
exports.createTelehealthSession = createTelehealthSession;
exports.scheduleMultiProviderAppointment = scheduleMultiProviderAppointment;
exports.validateTelehealthReadiness = validateTelehealthReadiness;
exports.sendTelehealthLink = sendTelehealthLink;
exports.allocateResources = allocateResources;
exports.releaseResources = releaseResources;
exports.exportToICalendar = exportToICalendar;
exports.exportToGoogleCalendar = exportToGoogleCalendar;
exports.syncWithExternalCalendar = syncWithExternalCalendar;
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Appointment type enumeration
 */
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["IN_PERSON"] = "in_person";
    AppointmentType["TELEHEALTH"] = "telehealth";
    AppointmentType["PHONE"] = "phone";
    AppointmentType["HOME_VISIT"] = "home_visit";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
/**
 * Appointment status enumeration
 */
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "scheduled";
    AppointmentStatus["CONFIRMED"] = "confirmed";
    AppointmentStatus["CHECKED_IN"] = "checked_in";
    AppointmentStatus["IN_PROGRESS"] = "in_progress";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELLED"] = "cancelled";
    AppointmentStatus["NO_SHOW"] = "no_show";
    AppointmentStatus["RESCHEDULED"] = "rescheduled";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
/**
 * Appointment priority levels
 */
var AppointmentPriority;
(function (AppointmentPriority) {
    AppointmentPriority["ROUTINE"] = "routine";
    AppointmentPriority["URGENT"] = "urgent";
    AppointmentPriority["EMERGENCY"] = "emergency";
    AppointmentPriority["FOLLOW_UP"] = "follow_up";
})(AppointmentPriority || (exports.AppointmentPriority = AppointmentPriority = {}));
/**
 * Reminder channel types
 */
var ReminderChannel;
(function (ReminderChannel) {
    ReminderChannel["SMS"] = "sms";
    ReminderChannel["EMAIL"] = "email";
    ReminderChannel["PUSH"] = "push";
    ReminderChannel["PHONE"] = "phone";
})(ReminderChannel || (exports.ReminderChannel = ReminderChannel = {}));
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
async function bookAppointment(request, bookedBy) {
    const appointment = {
        id: generateAppointmentId(),
        patientId: request.patientId,
        providerId: request.providerId,
        facilityId: request.facilityId,
        appointmentType: request.appointmentType,
        status: AppointmentStatus.SCHEDULED,
        priority: request.priority || AppointmentPriority.ROUTINE,
        startTime: request.startTime,
        endTime: (0, date_fns_1.addMinutes)(request.startTime, request.duration),
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
        appointment.resources = await allocateResources(request.resourceRequirements, request.startTime, request.duration);
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
async function validateAppointmentSlot(request) {
    const conflicts = [];
    // Check provider availability
    const providerAvailable = await checkProviderAvailability(request.providerId, request.startTime, request.duration);
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
async function rescheduleAppointment(request) {
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
    const updated = {
        ...original,
        startTime: request.newStartTime,
        endTime: (0, date_fns_1.addMinutes)(request.newStartTime, original.duration),
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
async function cancelAppointment(request) {
    const appointment = await getAppointmentById(request.appointmentId);
    const updated = {
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
async function confirmAppointment(appointmentId, confirmedBy) {
    const appointment = await getAppointmentById(appointmentId);
    const updated = {
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
async function checkInAppointment(appointmentId, checkedInBy) {
    const appointment = await getAppointmentById(appointmentId);
    const updated = {
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
async function completeAppointment(appointmentId, outcome) {
    const appointment = await getAppointmentById(appointmentId);
    const updated = {
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
async function recordNoShow(appointmentId, recordedBy, applyPenalty = true) {
    const appointment = await getAppointmentById(appointmentId);
    // Update appointment status
    await updateAppointmentStatus(appointmentId, AppointmentStatus.NO_SHOW);
    // Get patient rules to determine penalty
    const patientRules = await getPatientSchedulingRules(appointment.patientId);
    const penalty = applyPenalty ? determineNoShowPenalty(patientRules) : undefined;
    const record = {
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
async function findAvailableSlots(query) {
    const slots = [];
    let currentDate = (0, date_fns_1.startOfDay)(query.startDate);
    const endDate = (0, date_fns_1.endOfDay)(query.endDate);
    while (currentDate <= endDate) {
        // Skip if not a preferred day
        if (query.preferredDays && !query.preferredDays.includes(currentDate.getDay())) {
            currentDate = (0, date_fns_1.addDays)(currentDate, 1);
            continue;
        }
        // Get provider schedule for this day
        const schedule = await getProviderSchedule(query.providerId, currentDate);
        if (schedule) {
            const daySlots = generateSlotsFromSchedule(schedule, currentDate, query.duration || 30, query.preferredTimeStart, query.preferredTimeEnd);
            // Filter out booked slots
            const availableSlots = await filterBookedSlots(daySlots, query.appointmentType);
            slots.push(...availableSlots);
        }
        currentDate = (0, date_fns_1.addDays)(currentDate, 1);
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
async function isSlotAvailable(providerId, startTime, duration) {
    // Check provider schedule
    const hasSchedule = await checkProviderAvailability(providerId, startTime, duration);
    if (!hasSchedule)
        return false;
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
async function blockTimeSlot(providerId, startTime, endTime, reason) {
    // Create a blocked appointment
    const blockAppointment = {
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
async function releaseBlockedSlot(blockId) {
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
async function getProviderAvailabilitySummary(providerId, startDate, endDate) {
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
async function findNextAvailableSlot(providerId, duration, appointmentType) {
    const startDate = new Date();
    const endDate = (0, date_fns_1.addDays)(startDate, 90); // Look 90 days ahead
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
function calculateOptimalDuration(visitType, isNewPatient) {
    const baseDurations = {
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
async function createRecurringAppointments(template, pattern) {
    const seriesId = generateSeriesId();
    const appointments = [];
    // Generate dates based on pattern
    const dates = generateRecurrenceDates(template.startTime, pattern);
    // Create appointment for each date
    for (const date of dates) {
        const appointment = await bookAppointment({
            patientId: template.patientId,
            providerId: template.providerId,
            facilityId: template.facilityId,
            appointmentType: template.appointmentType,
            startTime: date,
            duration: template.duration,
            reasonForVisit: template.reasonForVisit,
            priority: template.priority,
        }, 'system');
        // Link to series
        appointment.seriesId = seriesId;
        appointments.push(appointment.id);
    }
    const series = {
        seriesId,
        patientId: template.patientId,
        providerId: template.providerId,
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
async function updateAppointmentSeries(seriesId, updates, updateFutureOnly = true) {
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
async function cancelAppointmentSeries(seriesId, reason, cancelFutureOnly = true) {
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
function generateRecurrenceDates(startDate, pattern) {
    const dates = [];
    let currentDate = new Date(startDate);
    let count = 0;
    const maxOccurrences = pattern.occurrences || 52; // Default to 1 year of weekly appointments
    const endDate = pattern.endDate || (0, date_fns_1.addDays)(startDate, 365);
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
function matchesRecurrencePattern(date, startDate, pattern) {
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
async function modifySeriesAppointment(appointmentId, updates, detachFromSeries = false) {
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
async function addToWaitlist(entry) {
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
async function processWaitlistForSlot(cancelledAppointment) {
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
    const notified = [];
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
async function removeFromWaitlist(waitlistId, reason) {
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
async function getWaitlistPosition(waitlistId) {
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
async function convertWaitlistToAppointment(waitlistId, appointmentTime) {
    const entry = await getWaitlistEntry(waitlistId);
    const appointment = await bookAppointment({
        patientId: entry.patientId,
        providerId: entry.providerId,
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
async function expireOldWaitlistEntries() {
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
async function scheduleAppointmentReminders(appointmentId, channels, hoursBeforeArray) {
    const appointment = await getAppointmentById(appointmentId);
    const reminders = [];
    for (const hoursBefore of hoursBeforeArray) {
        const reminderTime = new Date(appointment.startTime.getTime() - hoursBefore * 60 * 60 * 1000);
        for (const channel of channels) {
            const reminder = {
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
async function sendAppointmentReminder(appointmentId, channel) {
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
async function processDueReminders() {
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
        }
        catch (error) {
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
async function acknowledgeReminder(reminderId, acknowledgedAt) {
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
function formatReminderMessage(appointment, provider) {
    const dateStr = (0, date_fns_1.format)(appointment.startTime, 'MMM dd');
    const timeStr = (0, date_fns_1.format)(appointment.startTime, 'h:mm a');
    let message = `Reminder: You have an appointment with ${provider.name} on ${dateStr} at ${timeStr}`;
    if (appointment.appointmentType === AppointmentType.TELEHEALTH && appointment.telehealth) {
        message += `\n\nTelehealth Link: ${appointment.telehealth.meetingUrl}`;
    }
    else {
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
async function getPatientNoShowHistory(patientId, months = 12) {
    const since = (0, date_fns_1.addDays)(new Date(), -30 * months);
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
function determineNoShowPenalty(rules) {
    if (rules.noShowCount === 0) {
        return { type: 'warning' };
    }
    else if (rules.noShowCount === 1) {
        return { type: 'fee', amount: 25 };
    }
    else if (rules.noShowCount === 2) {
        return { type: 'fee', amount: 50 };
    }
    else {
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
async function applyNoShowPenalty(patientId, record) {
    if (!record.penaltyApplied)
        return;
    switch (record.penaltyType) {
        case 'fee':
            await addPatientCharge(patientId, record.penaltyAmount, 'No-show fee');
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
async function clearNoShowPenalties(patientId, graceMonths) {
    const rules = await getPatientSchedulingRules(patientId);
    if (!rules.lastNoShowDate)
        return false;
    const monthsSinceLastNoShow = (new Date().getTime() - rules.lastNoShowDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
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
async function createTelehealthSession(appointment) {
    // Integration with telehealth platform (Zoom, Teams, etc.)
    const session = {
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
async function scheduleMultiProviderAppointment(providerIds, request) {
    // Validate all providers are available
    for (const providerId of providerIds) {
        const available = await checkProviderAvailability(providerId, request.startTime, request.duration);
        if (!available) {
            throw new Error(`Provider ${providerId} is not available`);
        }
    }
    // Create primary appointment with first provider
    const appointment = await bookAppointment({
        ...request,
        providerId: providerIds[0],
    }, 'system');
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
async function validateTelehealthReadiness(patientId) {
    const patient = await getPatient(patientId);
    const issues = [];
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
async function sendTelehealthLink(appointmentId, channels) {
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
async function allocateResources(requirements, startTime, duration) {
    const allocations = [];
    const endTime = (0, date_fns_1.addMinutes)(startTime, duration);
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
            const allocation = {
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
async function releaseResources(allocations) {
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
async function exportToICalendar(appointmentId) {
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
async function exportToGoogleCalendar(appointmentId) {
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
async function syncWithExternalCalendar(patientId, calendarProvider, accessToken) {
    const appointments = await getPatientUpcomingAppointments(patientId);
    let syncedCount = 0;
    for (const appointment of appointments) {
        try {
            await syncAppointmentToCalendar(appointment, calendarProvider, accessToken);
            syncedCount++;
        }
        catch (error) {
            console.error(`Failed to sync appointment ${appointment.id}:`, error);
        }
    }
    return syncedCount;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateAppointmentId() {
    return `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateSeriesId() {
    return `series-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateWaitlistId() {
    return `waitlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateReminderId() {
    return `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateNoShowId() {
    return `noshow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateMeetingId() {
    return Math.random().toString(10).substr(2, 10);
}
function generateMeetingPassword() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}
function formatICalDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function formatGoogleDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function advanceByPattern(date, pattern) {
    switch (pattern.frequency) {
        case 'daily':
            return (0, date_fns_1.addDays)(date, 1);
        case 'weekly':
        case 'biweekly':
            return (0, date_fns_1.addDays)(date, 1);
        case 'monthly':
            return (0, date_fns_1.addDays)(date, 1);
        case 'yearly':
            return (0, date_fns_1.addDays)(date, 1);
        default:
            return (0, date_fns_1.addDays)(date, 1);
    }
}
function sortWaitlistByPriority(entries) {
    return entries.sort((a, b) => {
        // Priority first
        const priorityOrder = { emergency: 0, urgent: 1, follow_up: 2, routine: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by added date
        return a.addedAt.getTime() - b.addedAt.getTime();
    });
}
// Placeholder functions (would be implemented with actual database/service calls)
async function getAppointmentById(id) { return {}; }
async function updateAppointment(id, updates) { return {}; }
async function updateAppointmentStatus(id, status) { }
async function getPatientSchedulingRules(patientId) { return {}; }
async function updatePatientSchedulingRules(patientId, updates) { }
async function incrementPatientNoShowCount(patientId) { }
async function checkProviderAvailability(providerId, startTime, duration) { return true; }
async function checkFacilityHours(facilityId, time) { return true; }
async function findPatientConflicts(patientId, startTime, duration) { return []; }
async function findProviderConflicts(providerId, startTime, duration) { return []; }
async function findAlternativeSlots(request, count) { return []; }
async function sendRescheduleNotification(appointment, recipient) { }
async function sendCancellationNotification(appointment, recipient, offerReschedule) { }
async function scheduleFollowUp(appointment, daysFromNow) { }
async function getProviderSchedule(providerId, date) { return null; }
async function generateSlotsFromSchedule(schedule, date, duration, startTime, endTime) { return []; }
async function filterBookedSlots(slots, appointmentType) { return slots; }
async function getAppointmentSeries(seriesId) { return {}; }
async function updateSeriesStatus(seriesId, active) { }
async function findMatchingWaitlistEntries(criteria) { return []; }
async function notifyWaitlistOpportunity(entry, appointment) { }
async function getWaitlistEntry(id) { return {}; }
async function getAllActiveWaitlistEntries() { return []; }
async function getPatient(patientId) { return {}; }
async function getProvider(providerId) { return {}; }
async function sendSMSReminder(phone, message) { return true; }
async function sendEmailReminder(email, subject, message) { return true; }
async function sendPushNotification(tokens, message) { return true; }
async function schedulePhoneReminder(phone, message) { return true; }
async function getDueReminders(time) { return []; }
async function sendReminderById(id) { return true; }
async function getReminder(id) { return {}; }
async function addPatientCharge(patientId, amount, description) { }
async function sendPenaltyWarning(patientId, type) { }
async function findAvailableResource(type, startTime, endTime) { return null; }
async function getResourceName(resourceId) { return ''; }
async function markResourceAvailable(resourceId, startTime, endTime) { }
async function getPatientUpcomingAppointments(patientId) { return []; }
async function syncAppointmentToCalendar(appointment, provider, token) { }
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
//# sourceMappingURL=health-appointment-scheduling-kit.js.map