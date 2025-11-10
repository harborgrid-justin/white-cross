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
import { z } from 'zod';
/**
 * Event status enum
 */
export declare enum EventStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    TENTATIVE = "tentative",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress",
    POSTPONED = "postponed"
}
/**
 * Event visibility enum
 */
export declare enum EventVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    CONFIDENTIAL = "confidential"
}
/**
 * Recurrence frequency enum
 */
export declare enum RecurrenceFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
/**
 * Day of week enum
 */
export declare enum DayOfWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
/**
 * Month of year enum
 */
export declare enum MonthOfYear {
    JANUARY = 1,
    FEBRUARY = 2,
    MARCH = 3,
    APRIL = 4,
    MAY = 5,
    JUNE = 6,
    JULY = 7,
    AUGUST = 8,
    SEPTEMBER = 9,
    OCTOBER = 10,
    NOVEMBER = 11,
    DECEMBER = 12
}
/**
 * RSVP status enum
 */
export declare enum RSVPStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    TENTATIVE = "tentative",
    NEEDS_ACTION = "needs_action"
}
/**
 * Resource type enum
 */
export declare enum ResourceType {
    MEETING_ROOM = "meeting_room",
    EQUIPMENT = "equipment",
    VEHICLE = "vehicle",
    FACILITY = "facility",
    STAFF = "staff",
    OTHER = "other"
}
/**
 * Conflict resolution strategy enum
 */
export declare enum ConflictResolutionStrategy {
    REJECT = "reject",
    AUTO_RESCHEDULE = "auto_reschedule",
    SUGGEST_ALTERNATIVES = "suggest_alternatives",
    OVERRIDE = "override"
}
/**
 * Calendar view type enum
 */
export declare enum CalendarViewType {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
    AGENDA = "agenda",
    SCHEDULE = "schedule"
}
/**
 * Reminder type enum
 */
export declare enum ReminderType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
/**
 * Time zone identifier (IANA timezone)
 */
export type TimeZone = string;
/**
 * Duration in minutes
 */
export type DurationMinutes = number;
/**
 * Recurrence rule (iCalendar RRULE)
 */
export interface RecurrenceRule {
    frequency: RecurrenceFrequency;
    interval: number;
    count?: number;
    until?: Date;
    byDay?: DayOfWeek[];
    byMonthDay?: number[];
    byMonth?: MonthOfYear[];
    bySetPos?: number[];
}
/**
 * Event attendee
 */
export interface EventAttendee {
    id: string;
    email: string;
    name: string;
    role: 'organizer' | 'required' | 'optional' | 'resource';
    rsvpStatus: RSVPStatus;
    responseDate?: Date;
    comment?: string;
}
/**
 * Event reminder
 */
export interface EventReminder {
    id: string;
    type: ReminderType;
    minutesBefore: number;
    sent: boolean;
    sentAt?: Date;
}
/**
 * Generic calendar event
 */
export interface CalendarEvent<T extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    title: string;
    description?: string;
    location?: string;
    startTime: Date;
    endTime: Date;
    timeZone: TimeZone;
    allDay: boolean;
    status: EventStatus;
    visibility: EventVisibility;
    organizerId: string;
    attendees: EventAttendee[];
    reminders: EventReminder[];
    recurrenceRule?: RecurrenceRule;
    recurringEventId?: string;
    resources: ResourceBooking[];
    tags: string[];
    color?: string;
    metadata?: T;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Resource booking
 */
export interface ResourceBooking {
    id: string;
    resourceId: string;
    eventId: string;
    startTime: Date;
    endTime: Date;
    status: 'booked' | 'confirmed' | 'cancelled';
    metadata?: Record<string, unknown>;
}
/**
 * Resource definition
 */
export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    capacity?: number;
    location?: string;
    description?: string;
    amenities?: string[];
    timeZone: TimeZone;
    workingHours?: WorkingHours;
    active: boolean;
    metadata?: Record<string, unknown>;
}
/**
 * Working hours configuration
 */
export interface WorkingHours {
    monday?: TimeRange;
    tuesday?: TimeRange;
    wednesday?: TimeRange;
    thursday?: TimeRange;
    friday?: TimeRange;
    saturday?: TimeRange;
    sunday?: TimeRange;
}
/**
 * Time range
 */
export interface TimeRange {
    start: string;
    end: string;
}
/**
 * Availability slot
 */
export interface AvailabilitySlot {
    startTime: Date;
    endTime: Date;
    available: boolean;
    resource?: Resource;
    conflictingEvents?: CalendarEvent[];
}
/**
 * Conflict detection result
 */
export interface ConflictResult {
    hasConflict: boolean;
    conflicts: {
        event: CalendarEvent;
        overlapMinutes: number;
        overlapPercentage: number;
    }[];
    suggestions?: AvailabilitySlot[];
}
/**
 * Calendar view data
 */
export interface CalendarView<T = unknown> {
    viewType: CalendarViewType;
    startDate: Date;
    endDate: Date;
    timeZone: TimeZone;
    events: CalendarEvent[];
    data: T;
    generatedAt: Date;
}
/**
 * Shift definition
 */
export interface Shift {
    id: string;
    staffId: string;
    startTime: Date;
    endTime: Date;
    role: string;
    location: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
    breakDuration?: number;
    metadata?: Record<string, unknown>;
}
/**
 * iCalendar event (RFC 5545)
 */
export interface ICalendarEvent {
    uid: string;
    dtstart: string;
    dtend: string;
    summary: string;
    description?: string;
    location?: string;
    status: string;
    rrule?: string;
    attendee?: string[];
    organizer?: string;
    created?: string;
    lastModified?: string;
}
/**
 * Extract date fields from type
 */
export type DateFields<T> = {
    [K in keyof T]: T[K] extends Date ? K : never;
}[keyof T];
/**
 * Event with specific status
 */
export type EventWithStatus<S extends EventStatus> = CalendarEvent & {
    status: S;
};
/**
 * Recurring event type
 */
export type RecurringEvent = CalendarEvent & {
    recurrenceRule: RecurrenceRule;
};
/**
 * Non-recurring event type
 */
export type SingleEvent = CalendarEvent & {
    recurrenceRule?: never;
    recurringEventId?: never;
};
/**
 * Discriminated union for events
 */
export type Event = RecurringEvent | SingleEvent;
/**
 * Mapped type for required time fields
 */
export type RequiredTimeFields<T> = T & {
    startTime: Date;
    endTime: Date;
    timeZone: TimeZone;
};
/**
 * Time range validation schema
 */
export declare const TimeRangeSchema: any;
/**
 * Recurrence rule validation schema
 */
export declare const RecurrenceRuleSchema: any;
/**
 * Event creation schema
 */
export declare const EventCreateSchema: any;
/**
 * Creates a new calendar event with validation
 * @param data Event creation data
 * @returns Created calendar event
 * @throws BadRequestException if validation fails
 */
export declare function createEvent<T extends Record<string, unknown> = Record<string, unknown>>(data: z.infer<typeof EventCreateSchema> & {
    metadata?: T;
}): CalendarEvent<T>;
/**
 * Updates an existing event
 * @param event Event to update
 * @param updates Partial updates
 * @returns Updated event
 */
export declare function updateEvent<T extends Record<string, unknown>>(event: CalendarEvent<T>, updates: Partial<Omit<CalendarEvent<T>, 'id' | 'createdAt'>>): CalendarEvent<T>;
/**
 * Cancels an event
 * @param event Event to cancel
 * @param reason Cancellation reason
 * @returns Cancelled event
 */
export declare function cancelEvent<T extends Record<string, unknown>>(event: CalendarEvent<T>, reason?: string): CalendarEvent<T>;
/**
 * Duplicates an event
 * @param event Event to duplicate
 * @param newStartTime New start time
 * @returns Duplicated event
 */
export declare function duplicateEvent<T extends Record<string, unknown>>(event: CalendarEvent<T>, newStartTime: Date): CalendarEvent<T>;
/**
 * Adds attendees to event
 * @param event Event
 * @param attendees Attendees to add
 * @returns Updated event
 */
export declare function addAttendees<T extends Record<string, unknown>>(event: CalendarEvent<T>, attendees: Omit<EventAttendee, 'id' | 'rsvpStatus'>[]): CalendarEvent<T>;
/**
 * Generates event occurrences from recurrence rule
 * @param event Recurring event
 * @param rangeStart Range start date
 * @param rangeEnd Range end date
 * @returns Array of event occurrences
 */
export declare function generateRecurringOccurrences<T extends Record<string, unknown>>(event: CalendarEvent<T>, rangeStart: Date, rangeEnd: Date): CalendarEvent<T>[];
/**
 * Creates daily recurring pattern
 * @param interval Number of days between occurrences
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
export declare function createDailyRecurrence(interval?: number, count?: number): RecurrenceRule;
/**
 * Creates weekly recurring pattern
 * @param interval Number of weeks between occurrences
 * @param daysOfWeek Days of week to occur
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
export declare function createWeeklyRecurrence(interval: number | undefined, daysOfWeek: DayOfWeek[], count?: number): RecurrenceRule;
/**
 * Creates monthly recurring pattern
 * @param interval Number of months between occurrences
 * @param dayOfMonth Day of month (1-31)
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
export declare function createMonthlyRecurrence(interval: number | undefined, dayOfMonth: number, count?: number): RecurrenceRule;
/**
 * Creates yearly recurring pattern
 * @param interval Number of years between occurrences
 * @param month Month of year
 * @param dayOfMonth Day of month
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
export declare function createYearlyRecurrence(interval: number | undefined, month: MonthOfYear, dayOfMonth: number, count?: number): RecurrenceRule;
/**
 * Creates workday (Mon-Fri) recurring pattern
 * @param interval Number of weeks between occurrences
 * @param count Number of occurrences
 * @returns Recurrence rule
 */
export declare function createWorkdayRecurrence(interval?: number, count?: number): RecurrenceRule;
/**
 * Books a resource for an event
 * @param resource Resource to book
 * @param event Event
 * @returns Resource booking
 */
export declare function bookResource(resource: Resource, event: CalendarEvent): ResourceBooking;
/**
 * Checks if resource is available for time range
 * @param resource Resource
 * @param startTime Start time
 * @param endTime End time
 * @param existingBookings Existing bookings
 * @returns True if available
 */
export declare function isResourceAvailable(resource: Resource, startTime: Date, endTime: Date, existingBookings: ResourceBooking[]): boolean;
/**
 * Finds available resources for time range
 * @param resources All resources
 * @param startTime Start time
 * @param endTime End time
 * @param existingBookings Existing bookings
 * @param resourceType Optional resource type filter
 * @returns Available resources
 */
export declare function findAvailableResources(resources: Resource[], startTime: Date, endTime: Date, existingBookings: ResourceBooking[], resourceType?: ResourceType): Resource[];
/**
 * Calculates availability slots for resource
 * @param resource Resource
 * @param date Date to check
 * @param existingBookings Existing bookings
 * @param slotDuration Slot duration in minutes
 * @returns Array of availability slots
 */
export declare function calculateAvailabilitySlots(resource: Resource, date: Date, existingBookings: ResourceBooking[], slotDuration?: number): AvailabilitySlot[];
/**
 * Cancels resource booking
 * @param booking Booking to cancel
 * @returns Cancelled booking
 */
export declare function cancelResourceBooking(booking: ResourceBooking): ResourceBooking;
/**
 * Detects conflicts for event
 * @param event Event to check
 * @param existingEvents Existing events
 * @param bufferMinutes Optional buffer time between events
 * @returns Conflict result
 */
export declare function detectConflicts<T extends Record<string, unknown>>(event: CalendarEvent<T>, existingEvents: CalendarEvent[], bufferMinutes?: number): ConflictResult;
/**
 * Finds alternative time slots when conflicts exist
 * @param event Event with conflicts
 * @param existingEvents Existing events
 * @param searchDays Number of days to search
 * @param preferredTimeRanges Preferred time ranges
 * @returns Suggested alternative slots
 */
export declare function findAlternativeSlots<T extends Record<string, unknown>>(event: CalendarEvent<T>, existingEvents: CalendarEvent[], searchDays?: number, preferredTimeRanges?: TimeRange[]): AvailabilitySlot[];
/**
 * Resolves conflicts automatically based on strategy
 * @param event Event with conflicts
 * @param conflicts Detected conflicts
 * @param strategy Resolution strategy
 * @param existingEvents All existing events
 * @returns Resolved event or null if cannot resolve
 */
export declare function resolveConflict<T extends Record<string, unknown>>(event: CalendarEvent<T>, conflicts: ConflictResult, strategy: ConflictResolutionStrategy, existingEvents: CalendarEvent[]): CalendarEvent<T> | null;
/**
 * Prevents double booking for attendees
 * @param event Event to check
 * @param attendeeEvents Map of attendee ID to their events
 * @returns Map of attendee ID to conflicts
 */
export declare function checkAttendeeDoubleBooking<T extends Record<string, unknown>>(event: CalendarEvent<T>, attendeeEvents: Map<string, CalendarEvent[]>): Map<string, ConflictResult>;
/**
 * Converts event to different timezone
 * @param event Event
 * @param targetTimeZone Target timezone
 * @returns Event in target timezone
 */
export declare function convertEventTimeZone<T extends Record<string, unknown>>(event: CalendarEvent<T>, targetTimeZone: TimeZone): CalendarEvent<T>;
/**
 * Gets event time in specific timezone
 * @param event Event
 * @param timeZone Target timezone
 * @returns Object with converted times
 */
export declare function getEventInTimeZone(event: CalendarEvent, timeZone: TimeZone): {
    startTime: Date;
    endTime: Date;
    timeZone: TimeZone;
};
/**
 * Normalizes events to single timezone
 * @param events Events in various timezones
 * @param targetTimeZone Target timezone
 * @returns Events normalized to target timezone
 */
export declare function normalizeEventsToTimeZone<T extends Record<string, unknown>>(events: CalendarEvent<T>[], targetTimeZone: TimeZone): CalendarEvent<T>[];
/**
 * Schedules meeting room with capacity check
 * @param room Meeting room resource
 * @param event Event
 * @param attendeeCount Number of attendees
 * @returns Resource booking
 * @throws BadRequestException if capacity exceeded
 */
export declare function scheduleMeetingRoom(room: Resource, event: CalendarEvent, attendeeCount: number): ResourceBooking;
/**
 * Creates staff shift
 * @param data Shift data
 * @returns Created shift
 */
export declare function createShift(data: Omit<Shift, 'id' | 'status'>): Shift;
/**
 * Generates rotation schedule for staff
 * @param staffIds Array of staff IDs
 * @param startDate Start date
 * @param endDate End date
 * @param shiftPattern Pattern of shifts (e.g., ['morning', 'evening', 'night'])
 * @param location Location
 * @returns Array of shifts
 */
export declare function generateRotationSchedule(staffIds: string[], startDate: Date, endDate: Date, shiftPattern: Array<{
    role: string;
    startHour: number;
    endHour: number;
}>, location: string): Shift[];
/**
 * Checks shift conflicts for staff member
 * @param staffId Staff ID
 * @param newShift New shift
 * @param existingShifts Existing shifts
 * @returns True if conflict exists
 */
export declare function hasShiftConflict(staffId: string, newShift: Shift, existingShifts: Shift[]): boolean;
/**
 * Generates day view
 * @param date Date to view
 * @param events Events
 * @param timeZone Timezone
 * @returns Day view
 */
export declare function generateDayView(date: Date, events: CalendarEvent[], timeZone: TimeZone): CalendarView<{
    hourlyBreakdown: Map<number, CalendarEvent[]>;
}>;
/**
 * Generates week view
 * @param date Date within week
 * @param events Events
 * @param timeZone Timezone
 * @returns Week view
 */
export declare function generateWeekView(date: Date, events: CalendarEvent[], timeZone: TimeZone): CalendarView<{
    dailyBreakdown: Map<string, CalendarEvent[]>;
}>;
/**
 * Generates month view
 * @param date Date within month
 * @param events Events
 * @param timeZone Timezone
 * @returns Month view
 */
export declare function generateMonthView(date: Date, events: CalendarEvent[], timeZone: TimeZone): CalendarView<{
    dailyBreakdown: Map<string, CalendarEvent[]>;
}>;
/**
 * Generates year view
 * @param year Year number
 * @param events Events
 * @param timeZone Timezone
 * @returns Year view
 */
export declare function generateYearView(year: number, events: CalendarEvent[], timeZone: TimeZone): CalendarView<{
    monthlyBreakdown: Map<number, CalendarEvent[]>;
}>;
/**
 * Generates agenda view (list of upcoming events)
 * @param startDate Start date
 * @param days Number of days
 * @param events Events
 * @param timeZone Timezone
 * @returns Agenda view
 */
export declare function generateAgendaView(startDate: Date, days: number, events: CalendarEvent[], timeZone: TimeZone): CalendarView<{
    chronological: CalendarEvent[];
}>;
/**
 * Exports event to iCalendar format
 * @param event Event to export
 * @returns iCalendar string
 */
export declare function exportToICalendar(event: CalendarEvent): string;
/**
 * Parses iCalendar string to event
 * @param icalString iCalendar string
 * @returns Parsed event
 */
export declare function parseICalendar(icalString: string): CalendarEvent;
/**
 * Exports multiple events to iCalendar
 * @param events Events to export
 * @returns iCalendar string
 */
export declare function exportMultipleToICalendar(events: CalendarEvent[]): string;
/**
 * Logger instance for scheduling operations
 */
export declare const schedulingLogger: any;
//# sourceMappingURL=scheduling-calendar-kit.d.ts.map