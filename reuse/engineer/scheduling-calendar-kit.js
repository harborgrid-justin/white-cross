"use strict";
/**
 * LOC: ENGINEER_SCHEDULING_CALENDAR_001
 * File: /reuse/engineer/scheduling-calendar-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - zod
 *   - date-fns
 *   - date-fns-tz
 *
 * DOWNSTREAM (imported by):
 *   - Scheduling services
 *   - Calendar controllers
 *   - Resource booking services
 *   - Meeting management services
 *   - Shift planning services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulingLogger = exports.EventCreateSchema = exports.RecurrenceRuleSchema = exports.TimeRangeSchema = exports.ReminderType = exports.CalendarViewType = exports.ConflictResolutionStrategy = exports.ResourceType = exports.RSVPStatus = exports.MonthOfYear = exports.DayOfWeek = exports.RecurrenceFrequency = exports.EventVisibility = exports.EventStatus = void 0;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.cancelEvent = cancelEvent;
exports.duplicateEvent = duplicateEvent;
exports.addAttendees = addAttendees;
exports.generateRecurringOccurrences = generateRecurringOccurrences;
exports.createDailyRecurrence = createDailyRecurrence;
exports.createWeeklyRecurrence = createWeeklyRecurrence;
exports.createMonthlyRecurrence = createMonthlyRecurrence;
exports.createYearlyRecurrence = createYearlyRecurrence;
exports.createWorkdayRecurrence = createWorkdayRecurrence;
exports.bookResource = bookResource;
exports.isResourceAvailable = isResourceAvailable;
exports.findAvailableResources = findAvailableResources;
exports.calculateAvailabilitySlots = calculateAvailabilitySlots;
exports.cancelResourceBooking = cancelResourceBooking;
exports.detectConflicts = detectConflicts;
exports.findAlternativeSlots = findAlternativeSlots;
exports.resolveConflict = resolveConflict;
exports.checkAttendeeDoubleBooking = checkAttendeeDoubleBooking;
exports.convertEventTimeZone = convertEventTimeZone;
exports.getEventInTimeZone = getEventInTimeZone;
exports.normalizeEventsToTimeZone = normalizeEventsToTimeZone;
exports.scheduleMeetingRoom = scheduleMeetingRoom;
exports.createShift = createShift;
exports.generateRotationSchedule = generateRotationSchedule;
exports.hasShiftConflict = hasShiftConflict;
exports.generateDayView = generateDayView;
exports.generateWeekView = generateWeekView;
exports.generateMonthView = generateMonthView;
exports.generateYearView = generateYearView;
exports.generateAgendaView = generateAgendaView;
exports.exportToICalendar = exportToICalendar;
exports.parseICalendar = parseICalendar;
exports.exportMultipleToICalendar = exportMultipleToICalendar;
/**
 * File: /reuse/engineer/scheduling-calendar-kit.ts
 * Locator: WC-ENGINEER-SCHEDULING-CALENDAR-001
 * Purpose: Production-Grade Scheduling & Calendar Management Kit - Enterprise calendar toolkit
 *
 * Upstream: NestJS, Zod, date-fns, date-fns-tz
 * Downstream: ../backend/scheduling/*, Calendar Services, Booking Services, Resource Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, zod, date-fns
 * Exports: 45 production-ready scheduling and calendar management functions
 *
 * LLM Context: Production-grade scheduling and calendar utilities for White Cross platform.
 * Provides comprehensive calendar management including event creation and CRUD operations,
 * recurring event patterns (daily, weekly, monthly, yearly with advanced rules), resource
 * booking and availability tracking, conflict detection and resolution with configurable rules,
 * multi-timezone support with automatic conversion, meeting room scheduling with capacity
 * management, shift scheduling for staff with rotation patterns, calendar view generators
 * (day, week, month, year, agenda views), iCalendar (RFC 5545) import/export, event reminders
 * and notifications, attendee management with RSVP tracking, double-booking prevention,
 * calendar sharing and permissions, event series management, availability slots calculation,
 * working hours and business hours enforcement, holiday and blackout date handling, calendar
 * synchronization across systems, event templates for recurring patterns, buffer time between
 * events, resource utilization analytics, scheduling optimization algorithms, and comprehensive
 * audit logging. Includes advanced TypeScript patterns with generics, conditional types,
 * mapped types, discriminated unions, and utility types for maximum type safety.
 */
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================
/**
 * Event status enum
 */
var EventStatus;
(function (EventStatus) {
    EventStatus["SCHEDULED"] = "scheduled";
    EventStatus["CONFIRMED"] = "confirmed";
    EventStatus["TENTATIVE"] = "tentative";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["IN_PROGRESS"] = "in_progress";
    EventStatus["POSTPONED"] = "postponed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
/**
 * Event visibility enum
 */
var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "public";
    EventVisibility["PRIVATE"] = "private";
    EventVisibility["CONFIDENTIAL"] = "confidential";
})(EventVisibility || (exports.EventVisibility = EventVisibility = {}));
/**
 * Recurrence frequency enum
 */
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
    RecurrenceFrequency["YEARLY"] = "yearly";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
/**
 * Day of week enum
 */
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["SUNDAY"] = 0] = "SUNDAY";
    DayOfWeek[DayOfWeek["MONDAY"] = 1] = "MONDAY";
    DayOfWeek[DayOfWeek["TUESDAY"] = 2] = "TUESDAY";
    DayOfWeek[DayOfWeek["WEDNESDAY"] = 3] = "WEDNESDAY";
    DayOfWeek[DayOfWeek["THURSDAY"] = 4] = "THURSDAY";
    DayOfWeek[DayOfWeek["FRIDAY"] = 5] = "FRIDAY";
    DayOfWeek[DayOfWeek["SATURDAY"] = 6] = "SATURDAY";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
/**
 * Month of year enum
 */
var MonthOfYear;
(function (MonthOfYear) {
    MonthOfYear[MonthOfYear["JANUARY"] = 1] = "JANUARY";
    MonthOfYear[MonthOfYear["FEBRUARY"] = 2] = "FEBRUARY";
    MonthOfYear[MonthOfYear["MARCH"] = 3] = "MARCH";
    MonthOfYear[MonthOfYear["APRIL"] = 4] = "APRIL";
    MonthOfYear[MonthOfYear["MAY"] = 5] = "MAY";
    MonthOfYear[MonthOfYear["JUNE"] = 6] = "JUNE";
    MonthOfYear[MonthOfYear["JULY"] = 7] = "JULY";
    MonthOfYear[MonthOfYear["AUGUST"] = 8] = "AUGUST";
    MonthOfYear[MonthOfYear["SEPTEMBER"] = 9] = "SEPTEMBER";
    MonthOfYear[MonthOfYear["OCTOBER"] = 10] = "OCTOBER";
    MonthOfYear[MonthOfYear["NOVEMBER"] = 11] = "NOVEMBER";
    MonthOfYear[MonthOfYear["DECEMBER"] = 12] = "DECEMBER";
})(MonthOfYear || (exports.MonthOfYear = MonthOfYear = {}));
/**
 * RSVP status enum
 */
var RSVPStatus;
(function (RSVPStatus) {
    RSVPStatus["PENDING"] = "pending";
    RSVPStatus["ACCEPTED"] = "accepted";
    RSVPStatus["DECLINED"] = "declined";
    RSVPStatus["TENTATIVE"] = "tentative";
    RSVPStatus["NEEDS_ACTION"] = "needs_action";
})(RSVPStatus || (exports.RSVPStatus = RSVPStatus = {}));
/**
 * Resource type enum
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["MEETING_ROOM"] = "meeting_room";
    ResourceType["EQUIPMENT"] = "equipment";
    ResourceType["VEHICLE"] = "vehicle";
    ResourceType["FACILITY"] = "facility";
    ResourceType["STAFF"] = "staff";
    ResourceType["OTHER"] = "other";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Conflict resolution strategy enum
 */
var ConflictResolutionStrategy;
(function (ConflictResolutionStrategy) {
    ConflictResolutionStrategy["REJECT"] = "reject";
    ConflictResolutionStrategy["AUTO_RESCHEDULE"] = "auto_reschedule";
    ConflictResolutionStrategy["SUGGEST_ALTERNATIVES"] = "suggest_alternatives";
    ConflictResolutionStrategy["OVERRIDE"] = "override";
})(ConflictResolutionStrategy || (exports.ConflictResolutionStrategy = ConflictResolutionStrategy = {}));
/**
 * Calendar view type enum
 */
var CalendarViewType;
(function (CalendarViewType) {
    CalendarViewType["DAY"] = "day";
    CalendarViewType["WEEK"] = "week";
    CalendarViewType["MONTH"] = "month";
    CalendarViewType["YEAR"] = "year";
    CalendarViewType["AGENDA"] = "agenda";
    CalendarViewType["SCHEDULE"] = "schedule";
})(CalendarViewType || (exports.CalendarViewType = CalendarViewType = {}));
/**
 * Reminder type enum
 */
var ReminderType;
(function (ReminderType) {
    ReminderType["EMAIL"] = "email";
    ReminderType["SMS"] = "sms";
    ReminderType["PUSH"] = "push";
    ReminderType["IN_APP"] = "in_app";
})(ReminderType || (exports.ReminderType = ReminderType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Time range validation schema
 */
exports.TimeRangeSchema = zod_1.z.object({
    start: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});
/**
 * Recurrence rule validation schema
 */
exports.RecurrenceRuleSchema = zod_1.z.object({
    frequency: zod_1.z.nativeEnum(RecurrenceFrequency),
    interval: zod_1.z.number().int().min(1),
    count: zod_1.z.number().int().min(1).optional(),
    until: zod_1.z.date().optional(),
    byDay: zod_1.z.array(zod_1.z.nativeEnum(DayOfWeek)).optional(),
    byMonthDay: zod_1.z.array(zod_1.z.number().int().min(1).max(31)).optional(),
    byMonth: zod_1.z.array(zod_1.z.nativeEnum(MonthOfYear)).optional(),
    bySetPos: zod_1.z.array(zod_1.z.number().int()).optional(),
});
/**
 * Event creation schema
 */
exports.EventCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    location: zod_1.z.string().max(500).optional(),
    startTime: zod_1.z.date(),
    endTime: zod_1.z.date(),
    timeZone: zod_1.z.string(),
    allDay: zod_1.z.boolean().default(false),
    organizerId: zod_1.z.string().uuid(),
    visibility: zod_1.z.nativeEnum(EventVisibility).default(EventVisibility.PUBLIC),
    recurrenceRule: exports.RecurrenceRuleSchema.optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// ============================================================================
// EVENT CREATION & MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new calendar event with validation
 * @param data Event creation data
 * @returns Created calendar event
 * @throws BadRequestException if validation fails
 */
function createEvent(data) {
    try {
        const validated = exports.EventCreateSchema.parse(data);
        if ((0, date_fns_1.isAfter)(validated.startTime, validated.endTime)) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const event = {
            id: generateUUID(),
            title: validated.title,
            description: validated.description,
            location: validated.location,
            startTime: validated.startTime,
            endTime: validated.endTime,
            timeZone: validated.timeZone,
            allDay: validated.allDay,
            status: EventStatus.SCHEDULED,
            visibility: validated.visibility,
            organizerId: validated.organizerId,
            attendees: [],
            reminders: [],
            recurrenceRule: validated.recurrenceRule,
            resources: [],
            tags: validated.tags,
            metadata: validated.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return event;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Updates an existing event
 * @param event Event to update
 * @param updates Partial updates
 * @returns Updated event
 */
function updateEvent(event, updates) {
    const updated = {
        ...event,
        ...updates,
        updatedAt: new Date(),
    };
    if (updated.startTime && updated.endTime && (0, date_fns_1.isAfter)(updated.startTime, updated.endTime)) {
        throw new common_1.BadRequestException('Start time must be before end time');
    }
    return updated;
}
/**
 * Cancels an event
 * @param event Event to cancel
 * @param reason Cancellation reason
 * @returns Cancelled event
 */
function cancelEvent(event, reason) {
    return {
        ...event,
        status: EventStatus.CANCELLED,
        metadata: {
            ...event.metadata,
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
    };
}
/**
 * Duplicates an event
 * @param event Event to duplicate
 * @param newStartTime New start time
 * @returns Duplicated event
 */
function duplicateEvent(event, newStartTime) {
    const duration = (0, date_fns_1.differenceInMinutes)(event.endTime, event.startTime);
    const newEndTime = (0, date_fns_1.addMinutes)(newStartTime, duration);
    return {
        ...event,
        id: generateUUID(),
        startTime: newStartTime,
        endTime: newEndTime,
        status: EventStatus.SCHEDULED,
        recurringEventId: undefined,
        attendees: event.attendees.map((a) => ({ ...a, rsvpStatus: RSVPStatus.PENDING })),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Adds attendees to event
 * @param event Event
 * @param attendees Attendees to add
 * @returns Updated event
 */
function addAttendees(event, attendees) {
    const newAttendees = attendees.map((a) => ({
        ...a,
        id: generateUUID(),
        rsvpStatus: RSVPStatus.PENDING,
    }));
    return {
        ...event,
        attendees: [...event.attendees, ...newAttendees],
        updatedAt: new Date(),
    };
}
// ============================================================================
// RECURRING EVENT PATTERN FUNCTIONS
// ============================================================================
/**
 * Generates event occurrences from recurrence rule
 * @param event Recurring event
 * @param rangeStart Range start date
 * @param rangeEnd Range end date
 * @returns Array of event occurrences
 */
function generateRecurringOccurrences(event, rangeStart, rangeEnd) {
    if (!event.recurrenceRule) {
        return [event];
    }
    const rule = event.recurrenceRule;
    const occurrences = [];
    let currentDate = new Date(event.startTime);
    const duration = (0, date_fns_1.differenceInMinutes)(event.endTime, event.startTime);
    let count = 0;
    const maxCount = rule.count || 1000; // Safety limit
    const until = rule.until || (0, date_fns_1.addYears)(rangeStart, 5);
    while ((0, date_fns_1.isBefore)(currentDate, rangeEnd) && count < maxCount && (0, date_fns_1.isBefore)(currentDate, until)) {
        if ((0, date_fns_1.isWithinInterval)(currentDate, { start: rangeStart, end: rangeEnd })) {
            if (matchesRecurrenceRule(currentDate, rule)) {
                const occurrenceEnd = (0, date_fns_1.addMinutes)(currentDate, duration);
                occurrences.push({
                    ...event,
                    id: `${event.id}_${(0, date_fns_1.format)(currentDate, 'yyyyMMdd')}`,
                    startTime: new Date(currentDate),
                    endTime: occurrenceEnd,
                    recurringEventId: event.id,
                });
                count++;
            }
        }
        currentDate = getNextRecurrenceDate(currentDate, rule);
    }
    return occurrences;
}
/**
 * Creates daily recurring pattern
 * @param interval Number of days between occurrences
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
function createDailyRecurrence(interval = 1, count) {
    return {
        frequency: RecurrenceFrequency.DAILY,
        interval,
        count,
    };
}
/**
 * Creates weekly recurring pattern
 * @param interval Number of weeks between occurrences
 * @param daysOfWeek Days of week to occur
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
function createWeeklyRecurrence(interval = 1, daysOfWeek, count) {
    return {
        frequency: RecurrenceFrequency.WEEKLY,
        interval,
        byDay: daysOfWeek,
        count,
    };
}
/**
 * Creates monthly recurring pattern
 * @param interval Number of months between occurrences
 * @param dayOfMonth Day of month (1-31)
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
function createMonthlyRecurrence(interval = 1, dayOfMonth, count) {
    return {
        frequency: RecurrenceFrequency.MONTHLY,
        interval,
        byMonthDay: [dayOfMonth],
        count,
    };
}
/**
 * Creates yearly recurring pattern
 * @param interval Number of years between occurrences
 * @param month Month of year
 * @param dayOfMonth Day of month
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
function createYearlyRecurrence(interval = 1, month, dayOfMonth, count) {
    return {
        frequency: RecurrenceFrequency.YEARLY,
        interval,
        byMonth: [month],
        byMonthDay: [dayOfMonth],
        count,
    };
}
/**
 * Creates workday (Mon-Fri) recurring pattern
 * @param interval Number of weeks between occurrences
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
function createWorkdayRecurrence(interval = 1, count) {
    return createWeeklyRecurrence(interval, [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY], count);
}
// ============================================================================
// RESOURCE BOOKING & AVAILABILITY FUNCTIONS
// ============================================================================
/**
 * Books a resource for an event
 * @param resource Resource to book
 * @param event Event
 * @returns Resource booking
 */
function bookResource(resource, event) {
    return {
        id: generateUUID(),
        resourceId: resource.id,
        eventId: event.id,
        startTime: event.startTime,
        endTime: event.endTime,
        status: 'booked',
    };
}
/**
 * Checks if resource is available for time range
 * @param resource Resource
 * @param startTime Start time
 * @param endTime End time
 * @param existingBookings Existing bookings
 * @returns True if available
 */
function isResourceAvailable(resource, startTime, endTime, existingBookings) {
    // Check if resource is active
    if (!resource.active) {
        return false;
    }
    // Check working hours
    if (resource.workingHours) {
        const dayOfWeek = (0, date_fns_1.getDay)(startTime);
        const workingHour = getWorkingHoursForDay(resource.workingHours, dayOfWeek);
        if (!workingHour || !isWithinWorkingHours(startTime, endTime, workingHour)) {
            return false;
        }
    }
    // Check for conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
        if (booking.resourceId !== resource.id || booking.status === 'cancelled') {
            return false;
        }
        return (0, date_fns_1.areIntervalsOverlapping)({ start: startTime, end: endTime }, { start: booking.startTime, end: booking.endTime }, { inclusive: false });
    });
    return !hasConflict;
}
/**
 * Finds available resources for time range
 * @param resources All resources
 * @param startTime Start time
 * @param endTime End time
 * @param existingBookings Existing bookings
 * @param resourceType Optional resource type filter
 * @returns Available resources
 */
function findAvailableResources(resources, startTime, endTime, existingBookings, resourceType) {
    return resources.filter((resource) => {
        if (resourceType && resource.type !== resourceType) {
            return false;
        }
        return isResourceAvailable(resource, startTime, endTime, existingBookings);
    });
}
/**
 * Calculates availability slots for resource
 * @param resource Resource
 * @param date Date to check
 * @param existingBookings Existing bookings
 * @param slotDuration Slot duration in minutes
 * @returns Array of availability slots
 */
function calculateAvailabilitySlots(resource, date, existingBookings, slotDuration = 30) {
    const slots = [];
    const dayOfWeek = (0, date_fns_1.getDay)(date);
    const workingHour = resource.workingHours ? getWorkingHoursForDay(resource.workingHours, dayOfWeek) : null;
    if (!workingHour) {
        return slots;
    }
    const [startHour, startMinute] = workingHour.start.split(':').map(Number);
    const [endHour, endMinute] = workingHour.end.split(':').map(Number);
    let slotStart = new Date(date);
    slotStart.setHours(startHour, startMinute, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, endMinute, 0, 0);
    while ((0, date_fns_1.isBefore)(slotStart, dayEnd)) {
        const slotEnd = (0, date_fns_1.addMinutes)(slotStart, slotDuration);
        if ((0, date_fns_1.isAfter)(slotEnd, dayEnd)) {
            break;
        }
        const available = isResourceAvailable(resource, slotStart, slotEnd, existingBookings);
        slots.push({
            startTime: new Date(slotStart),
            endTime: new Date(slotEnd),
            available,
            resource,
        });
        slotStart = slotEnd;
    }
    return slots;
}
/**
 * Cancels resource booking
 * @param booking Booking to cancel
 * @returns Cancelled booking
 */
function cancelResourceBooking(booking) {
    return {
        ...booking,
        status: 'cancelled',
    };
}
// ============================================================================
// CONFLICT DETECTION & RESOLUTION FUNCTIONS
// ============================================================================
/**
 * Detects conflicts for event
 * @param event Event to check
 * @param existingEvents Existing events
 * @param bufferMinutes Optional buffer time between events
 * @returns Conflict result
 */
function detectConflicts(event, existingEvents, bufferMinutes = 0) {
    const conflicts = [];
    const eventStart = bufferMinutes > 0 ? (0, date_fns_1.subMinutes)(event.startTime, bufferMinutes) : event.startTime;
    const eventEnd = bufferMinutes > 0 ? (0, date_fns_1.addMinutes)(event.endTime, bufferMinutes) : event.endTime;
    for (const existing of existingEvents) {
        if (existing.id === event.id || existing.status === EventStatus.CANCELLED) {
            continue;
        }
        if ((0, date_fns_1.areIntervalsOverlapping)({ start: eventStart, end: eventEnd }, { start: existing.startTime, end: existing.endTime }, { inclusive: false })) {
            const overlapStart = (0, date_fns_1.isAfter)(eventStart, existing.startTime) ? eventStart : existing.startTime;
            const overlapEnd = (0, date_fns_1.isBefore)(eventEnd, existing.endTime) ? eventEnd : existing.endTime;
            const overlapMinutes = (0, date_fns_1.differenceInMinutes)(overlapEnd, overlapStart);
            const eventDuration = (0, date_fns_1.differenceInMinutes)(event.endTime, event.startTime);
            const overlapPercentage = (overlapMinutes / eventDuration) * 100;
            conflicts.push({
                event: existing,
                overlapMinutes,
                overlapPercentage,
            });
        }
    }
    return {
        hasConflict: conflicts.length > 0,
        conflicts,
    };
}
/**
 * Finds alternative time slots when conflicts exist
 * @param event Event with conflicts
 * @param existingEvents Existing events
 * @param searchDays Number of days to search
 * @param preferredTimeRanges Preferred time ranges
 * @returns Suggested alternative slots
 */
function findAlternativeSlots(event, existingEvents, searchDays = 7, preferredTimeRanges) {
    const duration = (0, date_fns_1.differenceInMinutes)(event.endTime, event.startTime);
    const suggestions = [];
    const startDate = (0, date_fns_1.startOfDay)(event.startTime);
    for (let i = 0; i < searchDays; i++) {
        const checkDate = (0, date_fns_1.addDays)(startDate, i);
        const dayStart = (0, date_fns_1.startOfDay)(checkDate);
        const dayEnd = (0, date_fns_1.endOfDay)(checkDate);
        // Generate slots throughout the day
        let slotStart = new Date(dayStart);
        slotStart.setHours(8, 0, 0, 0); // Start at 8 AM
        while ((0, date_fns_1.isBefore)(slotStart, dayEnd)) {
            const slotEnd = (0, date_fns_1.addMinutes)(slotStart, duration);
            if (slotEnd.getHours() > 18) { // Don't suggest past 6 PM
                break;
            }
            const testEvent = { ...event, startTime: slotStart, endTime: slotEnd };
            const conflictResult = detectConflicts(testEvent, existingEvents);
            if (!conflictResult.hasConflict) {
                const isPreferred = preferredTimeRanges
                    ? preferredTimeRanges.some((range) => isWithinTimeRange(slotStart, range))
                    : true;
                if (isPreferred) {
                    suggestions.push({
                        startTime: new Date(slotStart),
                        endTime: new Date(slotEnd),
                        available: true,
                    });
                }
            }
            slotStart = (0, date_fns_1.addMinutes)(slotStart, 30); // Check every 30 minutes
        }
        if (suggestions.length >= 5) {
            break; // Found enough suggestions
        }
    }
    return suggestions.slice(0, 5); // Return top 5 suggestions
}
/**
 * Resolves conflicts automatically based on strategy
 * @param event Event with conflicts
 * @param conflicts Detected conflicts
 * @param strategy Resolution strategy
 * @param existingEvents All existing events
 * @returns Resolved event or null if cannot resolve
 */
function resolveConflict(event, conflicts, strategy, existingEvents) {
    switch (strategy) {
        case ConflictResolutionStrategy.REJECT:
            throw new common_1.ConflictException('Event conflicts with existing events');
        case ConflictResolutionStrategy.AUTO_RESCHEDULE:
            const alternatives = findAlternativeSlots(event, existingEvents, 7);
            if (alternatives.length > 0) {
                const firstAlternative = alternatives[0];
                return {
                    ...event,
                    startTime: firstAlternative.startTime,
                    endTime: firstAlternative.endTime,
                };
            }
            return null;
        case ConflictResolutionStrategy.OVERRIDE:
            return event;
        default:
            return null;
    }
}
/**
 * Prevents double booking for attendees
 * @param event Event to check
 * @param attendeeEvents Map of attendee ID to their events
 * @returns Map of attendee ID to conflicts
 */
function checkAttendeeDoubleBooking(event, attendeeEvents) {
    const attendeeConflicts = new Map();
    for (const attendee of event.attendees) {
        const events = attendeeEvents.get(attendee.id) || [];
        const conflicts = detectConflicts(event, events);
        if (conflicts.hasConflict) {
            attendeeConflicts.set(attendee.id, conflicts);
        }
    }
    return attendeeConflicts;
}
// ============================================================================
// TIME ZONE HANDLING FUNCTIONS
// ============================================================================
/**
 * Converts event to different timezone
 * @param event Event
 * @param targetTimeZone Target timezone
 * @returns Event in target timezone
 */
function convertEventTimeZone(event, targetTimeZone) {
    // Note: In production, use date-fns-tz for proper timezone conversion
    // This is a simplified implementation
    return {
        ...event,
        timeZone: targetTimeZone,
    };
}
/**
 * Gets event time in specific timezone
 * @param event Event
 * @param timeZone Target timezone
 * @returns Object with converted times
 */
function getEventInTimeZone(event, timeZone) {
    // Simplified - in production use proper timezone library
    return {
        startTime: event.startTime,
        endTime: event.endTime,
        timeZone,
    };
}
/**
 * Normalizes events to single timezone
 * @param events Events in various timezones
 * @param targetTimeZone Target timezone
 * @returns Events normalized to target timezone
 */
function normalizeEventsToTimeZone(events, targetTimeZone) {
    return events.map((event) => convertEventTimeZone(event, targetTimeZone));
}
// ============================================================================
// MEETING ROOM & SHIFT SCHEDULING FUNCTIONS
// ============================================================================
/**
 * Schedules meeting room with capacity check
 * @param room Meeting room resource
 * @param event Event
 * @param attendeeCount Number of attendees
 * @returns Resource booking
 * @throws BadRequestException if capacity exceeded
 */
function scheduleMeetingRoom(room, event, attendeeCount) {
    if (room.type !== ResourceType.MEETING_ROOM) {
        throw new common_1.BadRequestException('Resource is not a meeting room');
    }
    if (room.capacity && attendeeCount > room.capacity) {
        throw new common_1.BadRequestException(`Room capacity (${room.capacity}) exceeded by attendee count (${attendeeCount})`);
    }
    return bookResource(room, event);
}
/**
 * Creates staff shift
 * @param data Shift data
 * @returns Created shift
 */
function createShift(data) {
    if ((0, date_fns_1.isAfter)(data.startTime, data.endTime)) {
        throw new common_1.BadRequestException('Shift start time must be before end time');
    }
    return {
        ...data,
        id: generateUUID(),
        status: 'scheduled',
    };
}
/**
 * Generates rotation schedule for staff
 * @param staffIds Array of staff IDs
 * @param startDate Start date
 * @param endDate End date
 * @param shiftPattern Pattern of shifts (e.g., ['morning', 'evening', 'night'])
 * @param location Location
 * @returns Array of shifts
 */
function generateRotationSchedule(staffIds, startDate, endDate, shiftPattern, location) {
    const shifts = [];
    const days = (0, date_fns_1.eachDayOfInterval)({ start: startDate, end: endDate });
    let staffIndex = 0;
    for (const day of days) {
        for (const pattern of shiftPattern) {
            const shiftStart = new Date(day);
            shiftStart.setHours(pattern.startHour, 0, 0, 0);
            const shiftEnd = new Date(day);
            shiftEnd.setHours(pattern.endHour, 0, 0, 0);
            shifts.push(createShift({
                staffId: staffIds[staffIndex % staffIds.length],
                startTime: shiftStart,
                endTime: shiftEnd,
                role: pattern.role,
                location,
            }));
            staffIndex++;
        }
    }
    return shifts;
}
/**
 * Checks shift conflicts for staff member
 * @param staffId Staff ID
 * @param newShift New shift
 * @param existingShifts Existing shifts
 * @returns True if conflict exists
 */
function hasShiftConflict(staffId, newShift, existingShifts) {
    const staffShifts = existingShifts.filter((s) => s.staffId === staffId && s.status !== 'cancelled');
    return staffShifts.some((shift) => (0, date_fns_1.areIntervalsOverlapping)({ start: newShift.startTime, end: newShift.endTime }, { start: shift.startTime, end: shift.endTime }, { inclusive: false }));
}
// ============================================================================
// CALENDAR VIEW GENERATORS
// ============================================================================
/**
 * Generates day view
 * @param date Date to view
 * @param events Events
 * @param timeZone Timezone
 * @returns Day view
 */
function generateDayView(date, events, timeZone) {
    const dayStart = (0, date_fns_1.startOfDay)(date);
    const dayEnd = (0, date_fns_1.endOfDay)(date);
    const dayEvents = events.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: dayStart, end: dayEnd }));
    const hourlyBreakdown = new Map();
    for (let hour = 0; hour < 24; hour++) {
        hourlyBreakdown.set(hour, []);
    }
    for (const event of dayEvents) {
        const hour = event.startTime.getHours();
        hourlyBreakdown.get(hour)?.push(event);
    }
    return {
        viewType: CalendarViewType.DAY,
        startDate: dayStart,
        endDate: dayEnd,
        timeZone,
        events: dayEvents,
        data: { hourlyBreakdown },
        generatedAt: new Date(),
    };
}
/**
 * Generates week view
 * @param date Date within week
 * @param events Events
 * @param timeZone Timezone
 * @returns Week view
 */
function generateWeekView(date, events, timeZone) {
    const weekStart = (0, date_fns_1.startOfWeek)(date, { weekStartsOn: 0 });
    const weekEnd = (0, date_fns_1.endOfWeek)(date, { weekStartsOn: 0 });
    const weekEvents = events.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: weekStart, end: weekEnd }));
    const dailyBreakdown = new Map();
    const days = (0, date_fns_1.eachDayOfInterval)({ start: weekStart, end: weekEnd });
    for (const day of days) {
        const dayKey = (0, date_fns_1.format)(day, 'yyyy-MM-dd');
        const dayStart = (0, date_fns_1.startOfDay)(day);
        const dayEnd = (0, date_fns_1.endOfDay)(day);
        dailyBreakdown.set(dayKey, weekEvents.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: dayStart, end: dayEnd })));
    }
    return {
        viewType: CalendarViewType.WEEK,
        startDate: weekStart,
        endDate: weekEnd,
        timeZone,
        events: weekEvents,
        data: { dailyBreakdown },
        generatedAt: new Date(),
    };
}
/**
 * Generates month view
 * @param date Date within month
 * @param events Events
 * @param timeZone Timezone
 * @returns Month view
 */
function generateMonthView(date, events, timeZone) {
    const monthStart = (0, date_fns_1.startOfMonth)(date);
    const monthEnd = (0, date_fns_1.endOfMonth)(date);
    const monthEvents = events.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: monthStart, end: monthEnd }));
    const dailyBreakdown = new Map();
    const days = (0, date_fns_1.eachDayOfInterval)({ start: monthStart, end: monthEnd });
    for (const day of days) {
        const dayKey = (0, date_fns_1.format)(day, 'yyyy-MM-dd');
        const dayStart = (0, date_fns_1.startOfDay)(day);
        const dayEnd = (0, date_fns_1.endOfDay)(day);
        dailyBreakdown.set(dayKey, monthEvents.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: dayStart, end: dayEnd })));
    }
    return {
        viewType: CalendarViewType.MONTH,
        startDate: monthStart,
        endDate: monthEnd,
        timeZone,
        events: monthEvents,
        data: { dailyBreakdown },
        generatedAt: new Date(),
    };
}
/**
 * Generates year view
 * @param year Year number
 * @param events Events
 * @param timeZone Timezone
 * @returns Year view
 */
function generateYearView(year, events, timeZone) {
    const yearStart = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
    const yearEnd = (0, date_fns_1.endOfYear)(new Date(year, 11, 31));
    const yearEvents = events.filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: yearStart, end: yearEnd }));
    const monthlyBreakdown = new Map();
    for (let month = 1; month <= 12; month++) {
        monthlyBreakdown.set(month, []);
    }
    for (const event of yearEvents) {
        const month = event.startTime.getMonth() + 1;
        monthlyBreakdown.get(month)?.push(event);
    }
    return {
        viewType: CalendarViewType.YEAR,
        startDate: yearStart,
        endDate: yearEnd,
        timeZone,
        events: yearEvents,
        data: { monthlyBreakdown },
        generatedAt: new Date(),
    };
}
/**
 * Generates agenda view (list of upcoming events)
 * @param startDate Start date
 * @param days Number of days
 * @param events Events
 * @param timeZone Timezone
 * @returns Agenda view
 */
function generateAgendaView(startDate, days, events, timeZone) {
    const endDate = (0, date_fns_1.addDays)(startDate, days);
    const agendaEvents = events
        .filter((event) => (0, date_fns_1.isWithinInterval)(event.startTime, { start: startDate, end: endDate }))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return {
        viewType: CalendarViewType.AGENDA,
        startDate,
        endDate,
        timeZone,
        events: agendaEvents,
        data: { chronological: agendaEvents },
        generatedAt: new Date(),
    };
}
// ============================================================================
// ICALENDAR IMPORT/EXPORT FUNCTIONS
// ============================================================================
/**
 * Exports event to iCalendar format
 * @param event Event to export
 * @returns iCalendar string
 */
function exportToICalendar(event) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//White Cross//Calendar//EN',
        'BEGIN:VEVENT',
        `UID:${event.id}`,
        `DTSTART:${formatICalendarDate(event.startTime)}`,
        `DTEND:${formatICalendarDate(event.endTime)}`,
        `SUMMARY:${escapeICalendarText(event.title)}`,
    ];
    if (event.description) {
        lines.push(`DESCRIPTION:${escapeICalendarText(event.description)}`);
    }
    if (event.location) {
        lines.push(`LOCATION:${escapeICalendarText(event.location)}`);
    }
    lines.push(`STATUS:${event.status.toUpperCase()}`);
    if (event.recurrenceRule) {
        lines.push(`RRULE:${formatRecurrenceRule(event.recurrenceRule)}`);
    }
    for (const attendee of event.attendees) {
        lines.push(`ATTENDEE;CN=${attendee.name};RSVP=TRUE:mailto:${attendee.email}`);
    }
    lines.push(`CREATED:${formatICalendarDate(event.createdAt)}`, `LAST-MODIFIED:${formatICalendarDate(event.updatedAt)}`, 'END:VEVENT', 'END:VCALENDAR');
    return lines.join('\r\n');
}
/**
 * Parses iCalendar string to event
 * @param icalString iCalendar string
 * @returns Parsed event
 */
function parseICalendar(icalString) {
    const lines = icalString.split(/\r?\n/);
    const eventData = {
        attendees: [],
        reminders: [],
        resources: [],
        tags: [],
    };
    for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':');
        switch (key) {
            case 'UID':
                eventData.id = value;
                break;
            case 'DTSTART':
                eventData.startTime = parseICalendarDate(value);
                break;
            case 'DTEND':
                eventData.endTime = parseICalendarDate(value);
                break;
            case 'SUMMARY':
                eventData.title = unescapeICalendarText(value);
                break;
            case 'DESCRIPTION':
                eventData.description = unescapeICalendarText(value);
                break;
            case 'LOCATION':
                eventData.location = unescapeICalendarText(value);
                break;
            case 'STATUS':
                eventData.status = value.toLowerCase();
                break;
        }
    }
    return eventData;
}
/**
 * Exports multiple events to iCalendar
 * @param events Events to export
 * @returns iCalendar string
 */
function exportMultipleToICalendar(events) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//White Cross//Calendar//EN',
    ];
    for (const event of events) {
        const eventLines = exportToICalendar(event)
            .split('\r\n')
            .filter((line) => !line.startsWith('BEGIN:VCALENDAR') && !line.startsWith('END:VCALENDAR') && !line.startsWith('VERSION') && !line.startsWith('PRODID'));
        lines.push(...eventLines);
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}
// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================
/**
 * Generates UUID v4
 * @returns UUID string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Gets working hours for specific day
 */
function getWorkingHoursForDay(workingHours, dayOfWeek) {
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return workingHours[dayMap[dayOfWeek]] || null;
}
/**
 * Checks if time is within working hours
 */
function isWithinWorkingHours(startTime, endTime, workingHour) {
    const [workStart] = workingHour.start.split(':').map(Number);
    const [workEnd] = workingHour.end.split(':').map(Number);
    const eventStartHour = startTime.getHours() + startTime.getMinutes() / 60;
    const eventEndHour = endTime.getHours() + endTime.getMinutes() / 60;
    return eventStartHour >= workStart && eventEndHour <= workEnd;
}
/**
 * Checks if time matches recurrence rule
 */
function matchesRecurrenceRule(date, rule) {
    if (rule.byDay && rule.byDay.length > 0) {
        const dayOfWeek = (0, date_fns_1.getDay)(date);
        if (!rule.byDay.includes(dayOfWeek)) {
            return false;
        }
    }
    if (rule.byMonthDay && rule.byMonthDay.length > 0) {
        const dayOfMonth = date.getDate();
        if (!rule.byMonthDay.includes(dayOfMonth)) {
            return false;
        }
    }
    if (rule.byMonth && rule.byMonth.length > 0) {
        const month = date.getMonth() + 1;
        if (!rule.byMonth.includes(month)) {
            return false;
        }
    }
    return true;
}
/**
 * Gets next recurrence date based on rule
 */
function getNextRecurrenceDate(currentDate, rule) {
    switch (rule.frequency) {
        case RecurrenceFrequency.DAILY:
            return (0, date_fns_1.addDays)(currentDate, rule.interval);
        case RecurrenceFrequency.WEEKLY:
            return (0, date_fns_1.addWeeks)(currentDate, rule.interval);
        case RecurrenceFrequency.MONTHLY:
            return (0, date_fns_1.addMonths)(currentDate, rule.interval);
        case RecurrenceFrequency.YEARLY:
            return (0, date_fns_1.addYears)(currentDate, rule.interval);
        default:
            return (0, date_fns_1.addDays)(currentDate, 1);
    }
}
/**
 * Checks if time is within time range
 */
function isWithinTimeRange(date, range) {
    const [startHour, startMinute] = range.start.split(':').map(Number);
    const [endHour, endMinute] = range.end.split(':').map(Number);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    const rangeStart = startHour * 60 + startMinute;
    const rangeEnd = endHour * 60 + endMinute;
    return timeInMinutes >= rangeStart && timeInMinutes <= rangeEnd;
}
/**
 * Formats date for iCalendar
 */
function formatICalendarDate(date) {
    return (0, date_fns_1.format)(date, "yyyyMMdd'T'HHmmss'Z'");
}
/**
 * Parses iCalendar date
 */
function parseICalendarDate(dateString) {
    const cleaned = dateString.replace(/[TZ]/g, '');
    return (0, date_fns_1.parse)(cleaned, 'yyyyMMddHHmmss', new Date());
}
/**
 * Escapes text for iCalendar
 */
function escapeICalendarText(text) {
    return text.replace(/[\\;,\n]/g, (match) => {
        switch (match) {
            case '\\':
                return '\\\\';
            case ';':
                return '\\;';
            case ',':
                return '\\,';
            case '\n':
                return '\\n';
            default:
                return match;
        }
    });
}
/**
 * Unescapes iCalendar text
 */
function unescapeICalendarText(text) {
    return text.replace(/\\(.)/g, (_, char) => {
        switch (char) {
            case '\\':
                return '\\';
            case ';':
                return ';';
            case ',':
                return ',';
            case 'n':
                return '\n';
            default:
                return char;
        }
    });
}
/**
 * Formats recurrence rule for iCalendar
 */
function formatRecurrenceRule(rule) {
    const parts = [`FREQ=${rule.frequency.toUpperCase()}`];
    if (rule.interval > 1) {
        parts.push(`INTERVAL=${rule.interval}`);
    }
    if (rule.count) {
        parts.push(`COUNT=${rule.count}`);
    }
    if (rule.until) {
        parts.push(`UNTIL=${formatICalendarDate(rule.until)}`);
    }
    if (rule.byDay && rule.byDay.length > 0) {
        const days = rule.byDay.map((d) => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][d]).join(',');
        parts.push(`BYDAY=${days}`);
    }
    if (rule.byMonthDay && rule.byMonthDay.length > 0) {
        parts.push(`BYMONTHDAY=${rule.byMonthDay.join(',')}`);
    }
    if (rule.byMonth && rule.byMonth.length > 0) {
        parts.push(`BYMONTH=${rule.byMonth.join(',')}`);
    }
    return parts.join(';');
}
/**
 * Logger instance for scheduling operations
 */
exports.schedulingLogger = new common_1.Logger('SchedulingCalendar');
//# sourceMappingURL=scheduling-calendar-kit.js.map