# Appointment and Communication Services - Comprehensive JSDoc Documentation

This document provides comprehensive JSDoc documentation standards for all appointment and communication service files in the backend.

## Table of Contents

1. [Appointment Services](#appointment-services)
2. [Communication Services](#communication-services)
3. [Business Rules Reference](#business-rules-reference)
4. [Compliance Notes](#compliance-notes)

---

## Appointment Services

### appointmentService.ts - Main Facade

```typescript
/**
 * @fileoverview Appointment Management Service - Unified Facade
 * @module services/appointment/appointmentService
 * @description Main orchestration layer for comprehensive appointment management system.
 * Provides a unified interface using the Facade pattern to coordinate multiple specialized
 * appointment services including scheduling, availability checking, reminders, waitlist
 * management, and recurring appointments.
 *
 * Key Features:
 * - Smart appointment scheduling with conflict detection
 * - Real-time nurse availability checking (8 AM - 5 PM, Mon-Fri)
 * - Automated multi-channel reminder system (24hr, 2hr, 30min before)
 * - Waitlist management with automatic slot filling
 * - Recurring appointment patterns (daily, weekly, monthly)
 * - Comprehensive appointment lifecycle management
 * - Calendar integration (iCal export)
 * - Business hours validation and enforcement
 *
 * Business Rules:
 * - Working hours: Monday-Friday, 8:00 AM - 5:00 PM
 * - Duration: 15-120 minutes in 15-minute increments
 * - Default duration: 30 minutes
 * - Buffer time: 15 minutes between appointments
 * - Maximum: 16 appointments per nurse per day
 * - Minimum cancellation notice: 2 hours
 *
 * @compliance HIPAA - Secure handling of student health appointment data
 * @compliance Business Hours - Validates all appointments within working hours
 *
 * @requires ./appointment/crudOperations
 * @requires ./appointment/AppointmentAvailabilityService
 * @requires ./appointment/AppointmentReminderService
 */

/**
 * @class AppointmentService
 * @description Main appointment service facade that delegates to specialized modules
 *
 * @example
 * // Schedule a new appointment
 * const appointment = await AppointmentService.createAppointment({
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   scheduledAt: new Date('2024-01-15T14:00:00'),
 *   type: 'ROUTINE_CHECKUP',
 *   duration: 30,
 *   reason: 'Annual health screening'
 * });
 */

/**
 * @method createAppointment
 * @description Create a new appointment with availability validation and automatic reminder scheduling
 * @async
 * @static
 *
 * @param {CreateAppointmentData} data - Appointment creation data
 * @param {string} data.studentId - Student UUID
 * @param {string} data.nurseId - Assigned nurse UUID
 * @param {Date} data.scheduledAt - Appointment date/time (must be within business hours)
 * @param {string} data.type - Appointment type (ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, etc.)
 * @param {number} data.duration - Duration in minutes (15-120, must be in 15-min increments)
 * @param {string} [data.reason] - Reason for appointment
 * @param {string} [data.notes] - Additional notes
 *
 * @returns {Promise<Appointment>} Created appointment with reminder records
 *
 * @throws {ValidationError} When scheduledAt is not in business hours
 * @throws {ValidationError} When duration is invalid (not 15-120 min or not 15-min increment)
 * @throws {ConflictError} When nurse has conflicting appointment
 * @throws {NotFoundError} When student or nurse not found
 *
 * @business Monday-Friday, 8 AM - 5 PM only
 * @business Duration: 15-120 minutes in 15-minute increments
 * @business Automatic reminder: 24 hours, 2 hours, and 30 minutes before
 * @business Buffer time: 15 minutes between appointments
 *
 * @compliance HIPAA - Appointment data encrypted at rest and in transit
 *
 * @example
 * const appointment = await AppointmentService.createAppointment({
 *   studentId: 'student-uuid',
 *   nurseId: 'nurse-uuid',
 *   scheduledAt: new Date('2024-01-15T14:00:00'),
 *   type: 'ROUTINE_CHECKUP',
 *   duration: 30,
 *   reason: 'Annual health screening'
 * });
 * // Returns: {
 * //   id: 'appt-uuid',
 * //   status: 'SCHEDULED',
 * //   scheduledAt: '2024-01-15T14:00:00Z',
 * //   reminders: [...]
 * // }
 */

/**
 * @method checkAvailability
 * @description Check if nurse is available for specified time slot
 * @async
 * @static
 *
 * @param {string} nurseId - Nurse UUID to check
 * @param {Date} startTime - Proposed start time
 * @param {number} duration - Duration in minutes
 * @param {string} [excludeAppointmentId] - Appointment ID to exclude (for rescheduling)
 *
 * @returns {Promise<Appointment[]>} Array of conflicting appointments (empty if available)
 *
 * @business Checks for conflicts within duration + 15-minute buffer
 * @business Only checks SCHEDULED and IN_PROGRESS appointments
 *
 * @example
 * const conflicts = await AppointmentService.checkAvailability(
 *   'nurse-uuid',
 *   new Date('2024-01-15T14:00:00'),
 *   30
 * );
 *
 * if (conflicts.length === 0) {
 *   console.log('Time slot is available');
 * } else {
 *   console.log('Conflicts found:', conflicts);
 * }
 */

/**
 * @method getAvailableSlots
 * @description Get all available time slots for a nurse on a specific date
 * @async
 * @static
 *
 * @param {string} nurseId - Nurse UUID
 * @param {Date} date - Date to check (time portion ignored)
 * @param {number} [slotDuration=30] - Duration of each slot in minutes
 *
 * @returns {Promise<AvailabilitySlot[]>} Array of available time slots
 * @returns {Date} return[].start - Slot start time
 * @returns {Date} return[].end - Slot end time
 * @returns {boolean} return[].available - Whether slot is available
 * @returns {Object} [return[].conflictingAppointment] - Details if slot unavailable
 *
 * @business Slots generated from 8:00 AM to 5:00 PM
 * @business Excludes lunch break (12:00 PM - 1:00 PM) if applicable
 *
 * @example
 * const slots = await AppointmentService.getAvailableSlots(
 *   'nurse-uuid',
 *   new Date('2024-01-15'),
 *   30
 * );
 *
 * const availableSlots = slots.filter(s => s.available);
 * console.log(`Found ${availableSlots.length} available 30-minute slots`);
 */

/**
 * @method cancelAppointment
 * @description Cancel an appointment and trigger waitlist processing
 * @async
 * @static
 *
 * @param {string} id - Appointment ID to cancel
 * @param {string} [reason] - Cancellation reason
 *
 * @returns {Promise<Appointment>} Updated appointment with CANCELLED status
 *
 * @throws {ValidationError} When cancellation is less than 2 hours before appointment
 * @throws {NotFoundError} When appointment not found
 * @throws {StateError} When appointment cannot be cancelled (already completed/cancelled)
 *
 * @business Minimum 2 hours notice required
 * @business Triggers automatic waitlist processing to fill slot
 * @business Cancels all associated reminders
 *
 * @example
 * const cancelled = await AppointmentService.cancelAppointment(
 *   'appt-uuid',
 *   'Student illness'
 * );
 * // Automatically checks waitlist and notifies next student
 */

/**
 * @method scheduleReminders
 * @description Schedule automatic reminders for an appointment
 * @async
 * @static
 *
 * @param {string} appointmentId - Appointment ID
 *
 * @returns {Promise<AppointmentReminder[]>} Array of scheduled reminders
 *
 * @business Creates 3 reminders: 24hr (EMAIL), 2hr (SMS), 30min (SMS)
 * @business Sends to primary emergency contact
 * @business Only schedules future reminders (skips past times)
 *
 * @compliance TCPA - Only sends SMS to contacts with consent
 * @compliance CAN-SPAM - Includes unsubscribe link in emails
 *
 * @example
 * const reminders = await AppointmentService.scheduleReminders('appt-uuid');
 * console.log(`Scheduled ${reminders.length} reminders`);
 */
```

### appointmentSchedulingService.ts - AI-Powered Scheduling

```typescript
/**
 * @fileoverview AI-Powered Appointment Scheduling Service
 * @module services/appointment/appointmentSchedulingService
 * @description Intelligent appointment scheduling with conflict detection,
 * optimization algorithms, and predictive scheduling suggestions.
 *
 * Key Features:
 * - Smart conflict detection and resolution
 * - AI-powered scheduling suggestions
 * - Multi-factor optimization (time, provider, resources)
 * - Historical pattern analysis
 * - Automated schedule optimization
 * - Resource utilization tracking
 *
 * @requires ../config/database
 * @requires sequelize
 */

/**
 * @class AppointmentSchedulingService
 * @description Advanced scheduling with AI-powered optimization
 */

/**
 * @method getSchedulingSuggestions
 * @description Generate AI-powered scheduling suggestions based on multiple factors
 * @async
 *
 * @param {Object} params - Scheduling parameters
 * @param {number} params.patientId - Patient ID
 * @param {string} params.appointmentType - Type of appointment
 * @param {string} params.urgency - Urgency level (urgent, high, normal, low)
 * @param {SchedulingConstraints} [params.constraints] - Optional constraints
 * @param {string[]} [params.constraints.preferredDays] - Preferred days of week
 * @param {string[]} [params.constraints.preferredTimes] - Preferred time slots
 * @param {number[]} [params.constraints.providerPreferences] - Preferred provider IDs
 *
 * @returns {Promise<SchedulingSuggestion[]>} Array of scheduling suggestions
 * @returns {Date} return[].dateTime - Suggested date/time
 * @returns {number} return[].providerId - Suggested provider
 * @returns {string} return[].providerName - Provider name
 * @returns {number} return[].confidence - Confidence score (0-1)
 * @returns {string[]} return[].reasoning - Reasons for suggestion
 *
 * @business Urgency affects time horizon: urgent=1 day, high=3 days, normal=7 days, low=14 days
 * @business Uses patient history, provider specialization, no-show rates
 * @business Optimizes for minimal wait time and provider match
 *
 * @example
 * const suggestions = await schedulingService.getSchedulingSuggestions({
 *   patientId: 123,
 *   appointmentType: 'CARDIOLOGY_CONSULTATION',
 *   urgency: 'high',
 *   constraints: {
 *     preferredDays: ['Monday', 'Wednesday'],
 *     preferredTimes: ['09:00', '14:00']
 *   }
 * });
 *
 * console.log(`Top suggestion: ${suggestions[0].dateTime}`);
 * console.log(`Confidence: ${(suggestions[0].confidence * 100).toFixed(1)}%`);
 */

/**
 * @method checkConflicts
 * @description Comprehensive conflict checking across multiple dimensions
 * @async
 *
 * @param {Object} params - Conflict check parameters
 * @param {number} params.providerId - Provider ID
 * @param {Date} params.dateTime - Proposed date/time
 * @param {number} params.duration - Duration in minutes
 * @param {number} [params.excludeAppointmentId] - Appointment to exclude
 * @param {number} [params.roomId] - Room ID if applicable
 * @param {boolean} [params.checkPatientConflicts=false] - Check patient double-booking
 * @param {boolean} [params.checkResourceConflicts=false] - Check equipment availability
 *
 * @returns {Promise<ConflictCheckResult>} Conflict analysis result
 * @returns {boolean} return.hasConflicts - Whether conflicts exist
 * @returns {ConflictDetails[]} return.conflicts - Array of conflict details
 *
 * @typedef {Object} ConflictDetails
 * @property {'provider_busy'|'room_occupied'|'patient_conflict'|'resource_unavailable'} type - Conflict type
 * @property {'low'|'medium'|'high'|'critical'} severity - Conflict severity
 * @property {string} description - Human-readable description
 * @property {number} [conflictingAppointmentId] - ID of conflicting appointment
 * @property {Date[]} [suggestedAlternatives] - Alternative time slots
 *
 * @business Checks provider availability, room availability, and resource allocation
 * @business Provides alternative time suggestions when conflicts found
 *
 * @example
 * const result = await schedulingService.checkConflicts({
 *   providerId: 1,
 *   dateTime: new Date('2024-01-15T14:00:00'),
 *   duration: 60,
 *   checkResourceConflicts: true
 * });
 *
 * if (result.hasConflicts) {
 *   console.log('Conflicts detected:');
 *   result.conflicts.forEach(c => {
 *     console.log(`- ${c.type}: ${c.description}`);
 *     if (c.suggestedAlternatives) {
 *       console.log(`  Alternatives: ${c.suggestedAlternatives.join(', ')}`);
 *     }
 *   });
 * }
 */

/**
 * @method optimizeSchedule
 * @description Optimize existing schedule to maximize efficiency
 * @async
 *
 * @param {Object} params - Optimization parameters
 * @param {Date} params.startDate - Start date for optimization
 * @param {Date} params.endDate - End date for optimization
 * @param {number} [params.providerId] - Specific provider (or all if omitted)
 * @param {string} [params.department] - Specific department
 *
 * @returns {Promise<OptimizationResult>} Optimization results
 * @returns {ScheduleStats} return.originalSchedule - Statistics before optimization
 * @returns {ScheduleStats} return.optimizedSchedule - Statistics after optimization
 * @returns {OptimizationMetrics} return.improvements - Improvement metrics
 * @returns {ScheduleChange[]} return.changes - Proposed schedule changes
 * @returns {string[]} return.recommendedActions - Recommended actions
 *
 * @business Optimizes for: utilization rate, wait time reduction, conflict elimination
 * @business Maintains patient preferences and minimum notice requirements
 * @business Requires patient consent for schedule changes
 *
 * @example
 * const optimization = await schedulingService.optimizeSchedule({
 *   startDate: new Date('2024-01-15'),
 *   endDate: new Date('2024-01-19'),
 *   providerId: 1
 * });
 *
 * console.log('Improvements:');
 * console.log(`- Utilization: ${optimization.improvements.utilizationIncrease}`);
 * console.log(`- Wait time: ${optimization.improvements.waitTimeReduction}`);
 * console.log(`- Conflicts: ${optimization.improvements.conflictReduction}`);
 */
```

### AppointmentReminderService.ts - Multi-Channel Reminders

```typescript
/**
 * @fileoverview Appointment Reminder Service
 * @module services/appointment/AppointmentReminderService
 * @description Manages automated appointment reminders across multiple channels
 * (EMAIL, SMS, VOICE) with configurable timing and retry logic.
 *
 * Key Features:
 * - Multi-channel reminder delivery (Email, SMS, Voice)
 * - Three-tier reminder system (24hr, 2hr, 30min)
 * - Automatic retry on delivery failure
 * - Emergency contact prioritization
 * - Reminder status tracking and reporting
 * - Compliance with TCPA and CAN-SPAM
 *
 * Reminder Timeline:
 * - 24 hours before: EMAIL to primary contact
 * - 2 hours before: SMS to primary contact
 * - 30 minutes before: SMS to primary contact
 *
 * @compliance TCPA - SMS only sent with consent
 * @compliance CAN-SPAM - Email includes unsubscribe
 * @compliance HIPAA - No PHI in reminder messages
 *
 * @requires ../../database/models
 * @requires ../../utils/logger
 */

/**
 * @class AppointmentReminderService
 * @description Service for scheduling and sending appointment reminders
 */

/**
 * @method scheduleReminders
 * @description Schedule all automatic reminders for an appointment
 * @async
 * @static
 *
 * @param {string} appointmentId - Appointment UUID
 *
 * @returns {Promise<AppointmentReminder[]>} Array of scheduled reminder records
 *
 * @throws {NotFoundError} When appointment not found
 * @throws {ValidationError} When appointment has no valid emergency contacts
 *
 * @business Creates 3 reminders at predefined intervals
 * @business 24hr: EMAIL reminder
 * @business 2hr: SMS reminder
 * @business 30min: SMS reminder
 * @business Sends to PRIMARY emergency contact (highest priority)
 * @business Skips reminders if scheduled time already passed
 *
 * @compliance TCPA - Checks SMS consent before scheduling SMS reminders
 * @compliance HIPAA - Generic message with no specific health information
 *
 * @example
 * const reminders = await AppointmentReminderService.scheduleReminders('appt-uuid');
 *
 * console.log(`Scheduled ${reminders.length} reminders:`);
 * reminders.forEach(r => {
 *   console.log(`- ${r.type} at ${r.scheduledFor}`);
 * });
 *
 * // Output:
 * // Scheduled 3 reminders:
 * // - EMAIL at 2024-01-14T14:00:00Z (24hr before)
 * // - SMS at 2024-01-15T12:00:00Z (2hr before)
 * // - SMS at 2024-01-15T13:30:00Z (30min before)
 */

/**
 * @method sendReminder
 * @description Send a scheduled reminder through appropriate channel
 * @async
 * @static
 *
 * @param {string} reminderId - Reminder UUID
 *
 * @returns {Promise<void>} Resolves when reminder sent successfully
 *
 * @throws {NotFoundError} When reminder or appointment not found
 * @throws {ValidationError} When no valid contact information available
 * @throws {DeliveryError} When reminder delivery fails
 *
 * @business Sends via EMAIL, SMS, or VOICE based on reminder.type
 * @business Sends to PRIMARY emergency contact
 * @business Updates reminder status to SENT on success
 * @business Updates reminder status to FAILED with reason on error
 * @business Logs all delivery attempts for audit trail
 *
 * @compliance HIPAA - Message contains no specific health details
 * @compliance TCPA - SMS includes opt-out instructions
 * @compliance CAN-SPAM - Email includes unsubscribe link
 *
 * @example
 * try {
 *   await AppointmentReminderService.sendReminder('reminder-uuid');
 *   console.log('Reminder sent successfully');
 * } catch (error) {
 *   if (error.name === 'ValidationError') {
 *     console.error('No valid contact info:', error.message);
 *   } else {
 *     console.error('Delivery failed:', error.message);
 *   }
 * }
 */

/**
 * @method processPendingReminders
 * @description Batch process all pending reminders that are due
 * @async
 * @static
 *
 * @returns {Promise<ProcessingResult>} Processing statistics
 * @returns {number} return.total - Total reminders processed
 * @returns {number} return.sent - Successfully sent reminders
 * @returns {number} return.failed - Failed reminders
 *
 * @business Processes up to 50 reminders per batch
 * @business Selects reminders with status=SCHEDULED and scheduledFor <= now
 * @business Continues processing on individual failures
 * @business Logs detailed results for monitoring
 *
 * @schedule Recommended: Run every 5-15 minutes via cron
 *
 * @example
 * // Run from cron job or scheduled task
 * const result = await AppointmentReminderService.processPendingReminders();
 *
 * console.log('Reminder Processing Summary:');
 * console.log(`Total: ${result.total}`);
 * console.log(`Sent: ${result.sent}`);
 * console.log(`Failed: ${result.failed}`);
 * console.log(`Success Rate: ${(result.sent / result.total * 100).toFixed(1)}%`);
 *
 * // Setup in cron:
 * // */10 * * * * node scripts/process-reminders.js
 */
```

### AppointmentAvailabilityService.ts - Availability Checking

```typescript
/**
 * @fileoverview Appointment Availability Service
 * @module services/appointment/AppointmentAvailabilityService
 * @description Real-time availability checking and slot generation for nurse schedules.
 * Provides conflict detection and available time slot calculation within business hours.
 *
 * Key Features:
 * - Real-time conflict detection
 * - Available slot generation
 * - Buffer time enforcement (15 minutes)
 * - Business hours validation (8 AM - 5 PM, Mon-Fri)
 * - Multi-appointment overlap checking
 *
 * @requires ../../database/models
 * @requires ../../utils/logger
 */

/**
 * @class AppointmentAvailabilityService
 * @description Manages nurse availability and conflict checking
 */

/**
 * @method checkAvailability
 * @description Check if nurse is available for specified time period
 * @async
 * @static
 *
 * @param {string} nurseId - Nurse UUID
 * @param {Date} startTime - Proposed start time
 * @param {number} duration - Duration in minutes
 * @param {string} [excludeAppointmentId] - Appointment ID to exclude (for rescheduling)
 *
 * @returns {Promise<Appointment[]>} Array of conflicting appointments (empty if available)
 *
 * @business Checks conflicts within requested time + 30min buffer
 * @business Only checks SCHEDULED and IN_PROGRESS appointments
 * @business Excludes specified appointment (useful for rescheduling)
 * @business Includes student details in conflict records
 *
 * @example
 * const conflicts = await AppointmentAvailabilityService.checkAvailability(
 *   'nurse-uuid',
 *   new Date('2024-01-15T14:00:00'),
 *   30
 * );
 *
 * if (conflicts.length > 0) {
 *   console.log('Nurse unavailable due to conflicts:');
 *   conflicts.forEach(c => {
 *     const studentName = `${c.student.firstName} ${c.student.lastName}`;
 *     console.log(`- ${c.scheduledAt}: ${studentName}`);
 *   });
 * } else {
 *   console.log('Nurse available for this time slot');
 * }
 */

/**
 * @method getAvailableSlots
 * @description Generate all available time slots for a nurse on specific date
 * @async
 * @static
 *
 * @param {string} nurseId - Nurse UUID
 * @param {Date} date - Date to check (time portion ignored)
 * @param {number} [slotDuration=30] - Duration of each slot in minutes
 *
 * @returns {Promise<AvailabilitySlot[]>} Array of time slots with availability status
 * @returns {Date} return[].start - Slot start time
 * @returns {Date} return[].end - Slot end time
 * @returns {boolean} return[].available - Whether slot is available
 * @returns {ConflictInfo} [return[].conflictingAppointment] - Details if unavailable
 *
 * @business Generates slots from 8:00 AM to 5:00 PM
 * @business Slot duration typically 15, 30, or 60 minutes
 * @business Marks slots as unavailable if any conflict exists
 * @business Provides conflict details for unavailable slots
 *
 * @example
 * const slots = await AppointmentAvailabilityService.getAvailableSlots(
 *   'nurse-uuid',
 *   new Date('2024-01-15'),
 *   30 // 30-minute slots
 * );
 *
 * // Show first 5 available slots
 * const available = slots.filter(s => s.available).slice(0, 5);
 * console.log('Next available slots:');
 * available.forEach(slot => {
 *   const time = slot.start.toLocaleTimeString('en-US', {
 *     hour: 'numeric',
 *     minute: '2-digit'
 *   });
 *   console.log(`- ${time}`);
 * });
 *
 * // Calculate utilization
 * const utilization = (slots.filter(s => !s.available).length / slots.length * 100).toFixed(1);
 * console.log(`Nurse utilization: ${utilization}%`);
 */
```

---

## Communication Services

### communicationService.ts - Main Communication Service

```typescript
/**
 * @fileoverview Communication Service - HIPAA-Compliant Messaging
 * @module services/communication/communicationService
 * @description Comprehensive communication service providing secure, HIPAA-compliant
 * messaging across multiple channels (Email, SMS, Push, Voice) with template management,
 * broadcast capabilities, and delivery tracking.
 *
 * Key Features:
 * - Multi-channel messaging (Email, SMS, Push Notifications, Voice)
 * - HIPAA-compliant message validation and encryption
 * - Message template management with variable substitution
 * - Broadcast messaging with audience targeting
 * - Scheduled message delivery
 * - Comprehensive delivery tracking
 * - Emergency alert system
 * - Multi-language support
 *
 * Security Features:
 * - PHI detection and sanitization
 * - Content validation against HIPAA guidelines
 * - Encryption in transit and at rest
 * - Audit logging of all communications
 * - Recipient consent verification (TCPA compliance)
 *
 * @compliance HIPAA - Secure PHI handling, encryption, audit trails
 * @compliance TCPA - SMS consent verification, opt-out handling
 * @compliance CAN-SPAM - Email unsubscribe, identification requirements
 *
 * @requires ../database/models
 * @requires ../utils/logger
 * @requires ../utils/communicationValidation
 */

/**
 * @class CommunicationService
 * @description Main service for all communication operations
 */

/**
 * @method sendMessage
 * @description Send message to specific recipients with HIPAA-compliant encryption
 * @async
 * @static
 *
 * @param {CreateMessageData} data - Message data
 * @param {Recipient[]} data.recipients - Array of recipients
 * @param {string} data.recipients[].type - Recipient type (NURSE, PARENT, EMERGENCY_CONTACT)
 * @param {string} data.recipients[].id - Recipient UUID
 * @param {string} [data.recipients[].email] - Email address (required for EMAIL channel)
 * @param {string} [data.recipients[].phoneNumber] - Phone number (required for SMS/VOICE)
 * @param {string} [data.recipients[].pushToken] - Push token (required for PUSH_NOTIFICATION)
 * @param {MessageType[]} data.channels - Delivery channels (EMAIL, SMS, PUSH_NOTIFICATION, VOICE)
 * @param {string} [data.subject] - Message subject (required for EMAIL)
 * @param {string} data.content - Message content
 * @param {MessagePriority} data.priority - Priority (URGENT, HIGH, MEDIUM, LOW)
 * @param {MessageCategory} data.category - Category (EMERGENCY, APPOINTMENT, MEDICATION, GENERAL)
 * @param {string} [data.templateId] - Template UUID if using template
 * @param {Date} [data.scheduledAt] - Schedule for future delivery
 * @param {string[]} [data.attachments] - Attachment file paths
 * @param {string} data.senderId - Sender UUID
 *
 * @returns {Promise<MessageResult>} Created message and delivery statuses
 * @returns {Message} return.message - Created message record
 * @returns {MessageDeliveryStatusResult[]} return.deliveryStatuses - Delivery status for each recipient/channel
 *
 * @throws {ValidationError} When message content fails HIPAA compliance
 * @throws {ValidationError} When recipients missing required contact info
 * @throws {ValidationError} When content exceeds length limits for channel
 * @throws {ValidationError} When scheduled time is in the past
 *
 * @business SMS: Max 160 characters (warns at 150)
 * @business Email: Max 50,000 characters
 * @business Push: Max 178 characters
 * @business Voice: Max 500 characters (TTS limits)
 * @business Emergency messages auto-elevated to URGENT priority
 *
 * @compliance HIPAA - Content scanned for PHI, encrypted in transit/rest
 * @compliance TCPA - SMS only sent to recipients with consent on file
 * @compliance CAN-SPAM - Emails include unsubscribe link and sender ID
 *
 * @security PHI detection prevents explicit health information in messages
 * @security All delivery attempts logged for audit compliance
 *
 * @example
 * // Send immediate message
 * const result = await CommunicationService.sendMessage({
 *   recipients: [
 *     {
 *       type: 'PARENT',
 *       id: 'parent-uuid',
 *       email: 'parent@example.com',
 *       phoneNumber: '+15551234567'
 *     }
 *   ],
 *   channels: ['EMAIL', 'SMS'],
 *   subject: 'Medication Reminder',
 *   content: 'Please ensure your child brings their inhaler tomorrow.',
 *   priority: 'HIGH',
 *   category: 'MEDICATION',
 *   senderId: 'nurse-uuid'
 * });
 *
 * console.log(`Message ${result.message.id} sent`);
 * console.log('Delivery statuses:');
 * result.deliveryStatuses.forEach(status => {
 *   console.log(`- ${status.channel}: ${status.status}`);
 * });
 *
 * @example
 * // Schedule future message
 * const scheduled = await CommunicationService.sendMessage({
 *   recipients: [...],
 *   channels: ['EMAIL'],
 *   subject: 'Upcoming Health Screening',
 *   content: 'Reminder: Annual health screening next week',
 *   priority: 'MEDIUM',
 *   category: 'APPOINTMENT',
 *   scheduledAt: new Date('2024-01-15T08:00:00'),
 *   senderId: 'nurse-uuid'
 * });
 */

/**
 * @method sendBroadcastMessage
 * @description Send message to multiple audiences with targeting
 * @async
 * @static
 *
 * @param {BroadcastMessageData} data - Broadcast message data
 * @param {BroadcastAudience} data.audience - Audience targeting criteria
 * @param {string[]} [data.audience.grades] - Grade levels to include
 * @param {string[]} [data.audience.nurseIds] - Specific nurses to include
 * @param {string[]} [data.audience.studentIds] - Specific students to include
 * @param {boolean} [data.audience.includeParents] - Include parents
 * @param {boolean} [data.audience.includeEmergencyContacts] - Include emergency contacts
 * @param {MessageType[]} data.channels - Delivery channels
 * @param {string} [data.subject] - Message subject
 * @param {string} data.content - Message content
 * @param {MessagePriority} data.priority - Message priority
 * @param {MessageCategory} data.category - Message category
 * @param {string} data.senderId - Sender UUID
 * @param {Date} [data.scheduledAt] - Schedule for future delivery
 *
 * @returns {Promise<MessageResult>} Created message and delivery statuses
 *
 * @throws {ValidationError} When content fails HIPAA compliance
 * @throws {ValidationError} When no recipients match criteria
 * @throws {ValidationError} When recipient count exceeds broadcast limit (10,000)
 *
 * @business Maximum 10,000 recipients per broadcast
 * @business Emergency broadcasts auto-elevated to URGENT
 * @business Processes in batches to avoid timeout
 *
 * @compliance HIPAA - Broadcast content validated for generic messaging only
 * @compliance TCPA - Only includes recipients with consent for chosen channels
 *
 * @example
 * // School-wide announcement
 * const broadcast = await CommunicationService.sendBroadcastMessage({
 *   audience: {
 *     grades: ['K', '1', '2', '3', '4', '5'],
 *     includeParents: true,
 *     includeEmergencyContacts: false
 *   },
 *   channels: ['EMAIL', 'SMS'],
 *   subject: 'School Closure Due to Weather',
 *   content: 'School will be closed tomorrow due to weather conditions.',
 *   priority: 'URGENT',
 *   category: 'EMERGENCY',
 *   senderId: 'admin-uuid'
 * });
 *
 * console.log(`Broadcast sent to ${broadcast.deliveryStatuses.length} recipients`);
 *
 * @example
 * // Targeted grade-level message
 * const gradeMessage = await CommunicationService.sendBroadcastMessage({
 *   audience: {
 *     grades: ['5'],
 *     includeParents: true
 *   },
 *   channels: ['EMAIL'],
 *   subject: '5th Grade Field Trip Permission Slips',
 *   content: 'Please complete and return field trip permission slips by Friday.',
 *   priority: 'MEDIUM',
 *   category: 'GENERAL',
 *   senderId: 'teacher-uuid'
 * });
 */

/**
 * @method sendEmergencyAlert
 * @description Send high-priority emergency alert to staff
 * @async
 * @static
 *
 * @param {EmergencyAlertData} alert - Emergency alert configuration
 * @param {string} alert.title - Alert title (max 100 chars)
 * @param {string} alert.message - Alert message (max 500 chars)
 * @param {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} alert.severity - Alert severity
 * @param {'ALL_STAFF'|'NURSES_ONLY'|'SPECIFIC_GROUPS'} alert.audience - Target audience
 * @param {string[]} [alert.groups] - Specific group IDs (if audience is SPECIFIC_GROUPS)
 * @param {MessageType[]} alert.channels - Delivery channels (recommend all)
 * @param {string} alert.senderId - Alert sender UUID
 *
 * @returns {Promise<MessageResult>} Created alert and delivery statuses
 *
 * @throws {ValidationError} When title or message exceeds length limits
 * @throws {ValidationError} When no staff match audience criteria
 *
 * @business Always uses URGENT priority regardless of severity
 * @business Sends immediately (no scheduling)
 * @business Delivers via all specified channels simultaneously
 * @business Logged in emergency alert audit trail
 *
 * @compliance HIPAA - Emergency alerts contain no PHI
 * @compliance Emergency Protocol - Staff notified within 2 minutes
 *
 * @example
 * // Critical emergency alert
 * const alert = await CommunicationService.sendEmergencyAlert({
 *   title: 'Medical Emergency - Room 205',
 *   message: 'Immediate assistance required in Room 205. All available nurses respond.',
 *   severity: 'CRITICAL',
 *   audience: 'NURSES_ONLY',
 *   channels: ['SMS', 'PUSH_NOTIFICATION', 'EMAIL'],
 *   senderId: 'nurse-uuid'
 * });
 *
 * console.log(`Emergency alert sent to ${alert.deliveryStatuses.length} staff members`);
 *
 * @example
 * // Weather alert
 * const weatherAlert = await CommunicationService.sendEmergencyAlert({
 *   title: 'Severe Weather Warning',
 *   message: 'Tornado warning in effect. All students move to designated shelter areas.',
 *   severity: 'HIGH',
 *   audience: 'ALL_STAFF',
 *   channels: ['SMS', 'PUSH_NOTIFICATION'],
 *   senderId: 'admin-uuid'
 * });
 */

/**
 * @method getMessageDeliveryStatus
 * @description Get detailed delivery status for a message
 * @async
 * @static
 *
 * @param {string} messageId - Message UUID
 *
 * @returns {Promise<DeliveryStatusResult>} Delivery status and summary
 * @returns {MessageDelivery[]} return.deliveries - Individual delivery records
 * @returns {DeliverySummary} return.summary - Aggregated statistics
 * @returns {number} return.summary.total - Total deliveries
 * @returns {number} return.summary.pending - Pending deliveries
 * @returns {number} return.summary.sent - Sent deliveries
 * @returns {number} return.summary.delivered - Confirmed deliveries
 * @returns {number} return.summary.failed - Failed deliveries
 * @returns {number} return.summary.bounced - Bounced deliveries
 *
 * @business Tracks status for each recipient/channel combination
 * @business Provides delivery timestamps for audit trail
 * @business Includes failure reasons for troubleshooting
 *
 * @example
 * const status = await CommunicationService.getMessageDeliveryStatus('message-uuid');
 *
 * console.log('Delivery Summary:');
 * console.log(`Total: ${status.summary.total}`);
 * console.log(`Delivered: ${status.summary.delivered}`);
 * console.log(`Failed: ${status.summary.failed}`);
 * console.log(`Success Rate: ${(status.summary.delivered / status.summary.total * 100).toFixed(1)}%`);
 *
 * // Show failed deliveries
 * const failed = status.deliveries.filter(d => d.status === 'FAILED');
 * if (failed.length > 0) {
 *   console.log('\nFailed Deliveries:');
 *   failed.forEach(f => {
 *     console.log(`- ${f.recipientId} via ${f.channel}: ${f.failureReason}`);
 *   });
 * }
 */

/**
 * @method processScheduledMessages
 * @description Process and send all scheduled messages that are due
 * @async
 * @static
 *
 * @returns {Promise<number>} Number of messages processed
 *
 * @business Finds messages with scheduledAt <= now and PENDING deliveries
 * @business Processes messages in batches
 * @business Updates delivery status for each attempt
 * @business Continues processing on individual failures
 *
 * @schedule Recommended: Run every 5 minutes via cron
 *
 * @example
 * // Run from cron job
 * const processed = await CommunicationService.processScheduledMessages();
 * console.log(`Processed ${processed} scheduled messages`);
 *
 * // Setup in cron:
 * // */5 * * * * node scripts/process-scheduled-messages.js
 */
```

### messageOperations.ts - Core Message Operations

```typescript
/**
 * @fileoverview Core Message Operations Module
 * @module services/communication/messageOperations
 * @description Core message sending and retrieval operations with comprehensive
 * HIPAA compliance validation. Handles individual and transactional message operations.
 *
 * Key Features:
 * - Transactional message creation and delivery
 * - HIPAA-compliant content validation
 * - Multi-channel delivery orchestration
 * - Delivery status tracking
 * - Message retrieval with pagination
 *
 * @compliance HIPAA - PHI detection and encryption
 * @compliance TCPA - SMS consent verification
 * @compliance CAN-SPAM - Email compliance
 *
 * @requires ../../database/models
 * @requires ../../utils/logger
 * @requires ./channelService
 */

/**
 * @function sendMessage
 * @description Send message with full HIPAA compliance validation
 * @async
 *
 * @param {CreateMessageData} data - Message data
 * @returns {Promise<MessageResult>} Message and delivery statuses
 *
 * @throws {ValidationError} HIPAA compliance failure
 * @throws {ValidationError} Invalid content for channel
 * @throws {ValidationError} Missing required contact information
 *
 * @business Uses database transaction for atomicity
 * @business Rolls back on any delivery failure
 * @business Creates audit log entry for compliance
 *
 * @compliance HIPAA - Content and subject scanned for PHI
 * @compliance TCPA - SMS consent verified before sending
 *
 * @example
 * const result = await sendMessage({
 *   recipients: [{
 *     type: 'PARENT',
 *     id: 'parent-uuid',
 *     email: 'parent@example.com'
 *   }],
 *   channels: ['EMAIL'],
 *   subject: 'Health Form Reminder',
 *   content: 'Please complete annual health form',
 *   priority: 'MEDIUM',
 *   category: 'GENERAL',
 *   senderId: 'nurse-uuid'
 * });
 */

/**
 * @function getMessages
 * @description Retrieve messages with pagination and filtering
 * @async
 *
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=20] - Items per page (max 100)
 * @param {MessageFilters} [filters={}] - Optional filters
 * @param {string} [filters.senderId] - Filter by sender
 * @param {MessageCategory} [filters.category] - Filter by category
 * @param {MessagePriority} [filters.priority] - Filter by priority
 * @param {Date} [filters.dateFrom] - Filter from date
 * @param {Date} [filters.dateTo] - Filter to date
 *
 * @returns {Promise<PaginatedMessages>} Paginated message results
 * @returns {Message[]} return.messages - Message records
 * @returns {PaginationMeta} return.pagination - Pagination metadata
 *
 * @business Orders by createdAt DESC (newest first)
 * @business Includes sender, template, and delivery associations
 *
 * @example
 * const result = await getMessages(1, 20, {
 *   category: 'MEDICATION',
 *   dateFrom: new Date('2024-01-01'),
 *   priority: 'HIGH'
 * });
 *
 * console.log(`Page ${result.pagination.page} of ${result.pagination.pages}`);
 * console.log(`${result.messages.length} messages`);
 */

/**
 * @function getMessageById
 * @description Retrieve single message with full details
 * @async
 *
 * @param {string} id - Message UUID
 *
 * @returns {Promise<Message|null>} Message with associations or null
 *
 * @business Includes sender details, template, and all deliveries
 * @business Returns null if not found (does not throw)
 *
 * @example
 * const message = await getMessageById('message-uuid');
 *
 * if (message) {
 *   console.log(`From: ${message.sender.firstName} ${message.sender.lastName}`);
 *   console.log(`Recipients: ${message.recipientCount}`);
 *   console.log(`Deliveries: ${message.deliveries.length}`);
 * }
 */
```

### channelService.ts - Multi-Channel Delivery

```typescript
/**
 * @fileoverview Communication Channel Service
 * @module services/communication/channelService
 * @description Low-level integration with communication service providers for
 * Email, SMS, Push Notifications, and Voice calls. Provides unified interface
 * for multiple provider options (SendGrid, Twilio, FCM, etc.).
 *
 * Key Features:
 * - Multi-provider support (configurable via environment)
 * - Email: SMTP, SendGrid, AWS SES
 * - SMS: Twilio, AWS SNS, Vonage
 * - Push: Firebase FCM, Apple APNS, OneSignal
 * - Voice: Twilio Voice, AWS Connect, Plivo
 * - Translation: Google, AWS, Azure
 * - Automatic provider failover
 * - Provider-specific configuration
 *
 * @compliance HIPAA - Encryption in transit (TLS/SSL)
 * @compliance TCPA - Provider-level opt-out handling
 *
 * @requires ../../utils/logger
 */

/**
 * @function sendViaChannel
 * @description Send message via specified communication channel
 * @async
 *
 * @param {MessageType} channel - Communication channel
 * @param {ChannelSendData} data - Message data
 * @param {string} data.to - Recipient address/number/token
 * @param {string} [data.subject] - Subject (Email only)
 * @param {string} data.content - Message content
 * @param {MessagePriority} data.priority - Message priority
 * @param {string[]} [data.attachments] - Attachment paths (Email only)
 *
 * @returns {Promise<ChannelSendResult>} Send result with external ID
 * @returns {string} return.externalId - Provider's message ID for tracking
 *
 * @throws {Error} When channel not supported
 * @throws {Error} When provider integration fails
 *
 * @business Uses environment variables for provider selection
 * @business Falls back to mock mode if provider not configured
 * @business Logs all send attempts for audit trail
 *
 * @compliance HIPAA - Uses TLS/SSL for all transmissions
 *
 * @example
 * // Send email
 * const emailResult = await sendViaChannel('EMAIL', {
 *   to: 'recipient@example.com',
 *   subject: 'Test Message',
 *   content: 'This is a test email',
 *   priority: 'MEDIUM'
 * });
 * console.log(`Email sent: ${emailResult.externalId}`);
 *
 * @example
 * // Send SMS
 * const smsResult = await sendViaChannel('SMS', {
 *   to: '+15551234567',
 *   content: 'This is a test SMS',
 *   priority: 'HIGH'
 * });
 * console.log(`SMS sent: ${smsResult.externalId}`);
 */

/**
 * @function translateMessage
 * @description Translate message content to target language
 * @async
 *
 * @param {string} content - Content to translate
 * @param {string} targetLanguage - Target language code (ISO 639-1)
 *
 * @returns {Promise<string>} Translated content
 *
 * @business Supports: Google Cloud Translation, AWS Translate, Azure Translator
 * @business Returns original content if translation fails
 * @business Auto-detects source language
 *
 * @example
 * const translated = await translateMessage(
 *   'Your appointment is tomorrow at 2 PM',
 *   'es'
 * );
 * console.log(translated);
 * // Output: "Su cita es mañana a las 2 PM"
 */
```

---

## Business Rules Reference

### Appointment Business Rules

1. **Business Hours**
   - Monday-Friday only
   - 8:00 AM - 5:00 PM
   - No weekend appointments
   - No holiday appointments

2. **Duration Rules**
   - Minimum: 15 minutes
   - Maximum: 120 minutes
   - Must be in 15-minute increments
   - Default: 30 minutes

3. **Buffer Time**
   - 15 minutes between appointments
   - Prevents nurse overload
   - Allows for documentation time

4. **Capacity**
   - Maximum 16 appointments per nurse per day
   - Calculated as: (9 hours × 60 minutes) / (30 min avg + 15 min buffer) = 12-16 slots

5. **Cancellation Policy**
   - Minimum 2 hours notice required
   - Triggers automatic waitlist processing
   - Cancels all associated reminders

6. **Reminder Timeline**
   - 24 hours before: EMAIL
   - 2 hours before: SMS
   - 30 minutes before: SMS
   - Sent to primary emergency contact

### Communication Business Rules

1. **Message Length Limits**
   - SMS: 160 characters (warns at 150)
   - Email: 50,000 characters
   - Push Notification: 178 characters
   - Voice (TTS): 500 characters

2. **Priority Handling**
   - URGENT: Delivered immediately, all channels
   - HIGH: Delivered within 5 minutes
   - MEDIUM: Delivered within 15 minutes
   - LOW: Delivered within 1 hour

3. **Broadcast Limits**
   - Maximum 10,000 recipients per broadcast
   - Processed in batches of 1,000
   - Prevents system overload

4. **Emergency Alerts**
   - Always URGENT priority
   - Delivered to all specified channels simultaneously
   - No scheduling (immediate only)
   - Logged in emergency audit trail

5. **Consent Requirements**
   - SMS: Requires explicit opt-in
   - Email: Requires email address on file
   - Push: Requires device token
   - Voice: Requires phone number with voice consent

---

## Compliance Notes

### HIPAA Compliance

1. **PHI Protection**
   - All messages scanned for explicit health information
   - Generic wording required for reminders
   - No specific diagnosis or treatment details
   - Encrypted in transit (TLS 1.2+) and at rest (AES-256)

2. **Audit Requirements**
   - All message sending logged
   - Delivery attempts tracked
   - Access logs maintained
   - Audit trail preserved for 7 years

3. **Patient Rights**
   - Right to opt-out of communications
   - Right to choose communication channels
   - Right to access communication history

### TCPA Compliance

1. **SMS Requirements**
   - Express written consent required
   - Opt-out instructions in every SMS
   - Consent tracked in database
   - No SMS to numbers without consent

2. **Voice Call Requirements**
   - Prior express consent required
   - Do Not Call list checking
   - Call time restrictions (8 AM - 9 PM local time)

3. **Record Keeping**
   - Consent records maintained
   - Opt-out requests logged
   - Compliance reports available

### CAN-SPAM Compliance

1. **Email Requirements**
   - Clear sender identification
   - Accurate subject lines
   - Unsubscribe link in every email
   - Physical mailing address included

2. **Opt-Out Handling**
   - Unsubscribe processed within 10 days
   - One-click unsubscribe option
   - No opt-out fee or burden

---

## Implementation Examples

### Complete Appointment Scheduling Flow

```typescript
// 1. Check availability
const conflicts = await AppointmentService.checkAvailability(
  'nurse-uuid',
  new Date('2024-01-15T14:00:00'),
  30
);

if (conflicts.length > 0) {
  // 2. Get alternative slots if conflicts exist
  const slots = await AppointmentService.getAvailableSlots(
    'nurse-uuid',
    new Date('2024-01-15'),
    30
  );

  const nextAvailable = slots.find(s => s.available);
  console.log(`Next available: ${nextAvailable.start}`);

} else {
  // 3. Create appointment
  const appointment = await AppointmentService.createAppointment({
    studentId: 'student-uuid',
    nurseId: 'nurse-uuid',
    scheduledAt: new Date('2024-01-15T14:00:00'),
    type: 'ROUTINE_CHECKUP',
    duration: 30,
    reason: 'Annual health screening'
  });

  // 4. Reminders automatically scheduled
  console.log(`Appointment ${appointment.id} created with 3 reminders`);
}
```

### Complete Communication Flow

```typescript
// 1. Send immediate notification
const notification = await CommunicationService.sendMessage({
  recipients: [
    {
      type: 'PARENT',
      id: 'parent-uuid',
      email: 'parent@example.com',
      phoneNumber: '+15551234567'
    }
  ],
  channels: ['EMAIL', 'SMS'],
  subject: 'Appointment Confirmation',
  content: 'Your child has an appointment tomorrow at 2 PM',
  priority: 'HIGH',
  category: 'APPOINTMENT',
  senderId: 'nurse-uuid'
});

// 2. Check delivery status
const status = await CommunicationService.getMessageDeliveryStatus(
  notification.message.id
);

console.log(`Delivered: ${status.summary.delivered}/${status.summary.total}`);

// 3. Send broadcast if needed
if (needsSchoolWideAlert) {
  const broadcast = await CommunicationService.sendBroadcastMessage({
    audience: {
      grades: ['K', '1', '2', '3', '4', '5'],
      includeParents: true
    },
    channels: ['EMAIL'],
    subject: 'School Announcement',
    content: 'Important update for all families',
    priority: 'MEDIUM',
    category: 'GENERAL',
    senderId: 'admin-uuid'
  });
}
```

---

## Environment Configuration

### Email Provider Configuration

```bash
# SMTP (default)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@school.edu
SMTP_PASS=password
SMTP_FROM=noreply@school.edu

# SendGrid
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM=noreply@school.edu

# AWS SES
EMAIL_PROVIDER=aws-ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
SES_FROM=noreply@school.edu
```

### SMS Provider Configuration

```bash
# Twilio (default)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+15551234567

# AWS SNS
SMS_PROVIDER=aws-sns
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Vonage
SMS_PROVIDER=vonage
VONAGE_API_KEY=xxx
VONAGE_API_SECRET=xxx
VONAGE_PHONE_NUMBER=15551234567
```

### Push Notification Configuration

```bash
# Firebase FCM (default)
PUSH_PROVIDER=fcm
FCM_SERVER_KEY=xxx
FCM_PROJECT_ID=xxx
FCM_CLIENT_EMAIL=xxx
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Apple APNS
PUSH_PROVIDER=apns
APNS_KEY_ID=xxx
APNS_TEAM_ID=xxx
APNS_KEY_PATH=/path/to/apns-key.p8
APNS_TOPIC=com.school.whitecross

# OneSignal
PUSH_PROVIDER=onesignal
ONESIGNAL_APP_ID=xxx
ONESIGNAL_API_KEY=xxx
```

---

## Summary

This comprehensive documentation provides:

1. **Complete JSDoc examples** for all major appointment and communication services
2. **Business rules** clearly documented with examples
3. **Compliance features** explained with HIPAA, TCPA, and CAN-SPAM requirements
4. **Implementation examples** showing real-world usage patterns
5. **Configuration guidance** for all service providers
6. **Error handling** with appropriate exception types
7. **Security considerations** for PHI and sensitive data

All service files should follow these documentation standards to maintain consistency and provide excellent developer experience.
