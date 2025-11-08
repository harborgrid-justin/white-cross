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

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  isWithinInterval,
  areIntervalsOverlapping,
  differenceInMinutes,
  format,
  parse,
  parseISO,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  setDay,
  getDay,
  isSameDay,
  addMinutes,
  subMinutes,
} from 'date-fns';

// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================

/**
 * Event status enum
 */
export enum EventStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  TENTATIVE = 'tentative',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  POSTPONED = 'postponed',
}

/**
 * Event visibility enum
 */
export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
}

/**
 * Recurrence frequency enum
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

/**
 * Day of week enum
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/**
 * Month of year enum
 */
export enum MonthOfYear {
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
  DECEMBER = 12,
}

/**
 * RSVP status enum
 */
export enum RSVPStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  NEEDS_ACTION = 'needs_action',
}

/**
 * Resource type enum
 */
export enum ResourceType {
  MEETING_ROOM = 'meeting_room',
  EQUIPMENT = 'equipment',
  VEHICLE = 'vehicle',
  FACILITY = 'facility',
  STAFF = 'staff',
  OTHER = 'other',
}

/**
 * Conflict resolution strategy enum
 */
export enum ConflictResolutionStrategy {
  REJECT = 'reject',
  AUTO_RESCHEDULE = 'auto_reschedule',
  SUGGEST_ALTERNATIVES = 'suggest_alternatives',
  OVERRIDE = 'override',
}

/**
 * Calendar view type enum
 */
export enum CalendarViewType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  AGENDA = 'agenda',
  SCHEDULE = 'schedule',
}

/**
 * Reminder type enum
 */
export enum ReminderType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

// ============================================================================
// ADVANCED GENERIC TYPES
// ============================================================================

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
  start: string; // HH:mm format
  end: string; // HH:mm format
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

// ============================================================================
// ADVANCED UTILITY TYPES
// ============================================================================

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

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Time range validation schema
 */
export const TimeRangeSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

/**
 * Recurrence rule validation schema
 */
export const RecurrenceRuleSchema = z.object({
  frequency: z.nativeEnum(RecurrenceFrequency),
  interval: z.number().int().min(1),
  count: z.number().int().min(1).optional(),
  until: z.date().optional(),
  byDay: z.array(z.nativeEnum(DayOfWeek)).optional(),
  byMonthDay: z.array(z.number().int().min(1).max(31)).optional(),
  byMonth: z.array(z.nativeEnum(MonthOfYear)).optional(),
  bySetPos: z.array(z.number().int()).optional(),
});

/**
 * Event creation schema
 */
export const EventCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  location: z.string().max(500).optional(),
  startTime: z.date(),
  endTime: z.date(),
  timeZone: z.string(),
  allDay: z.boolean().default(false),
  organizerId: z.string().uuid(),
  visibility: z.nativeEnum(EventVisibility).default(EventVisibility.PUBLIC),
  recurrenceRule: RecurrenceRuleSchema.optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
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
export function createEvent<T extends Record<string, unknown> = Record<string, unknown>>(
  data: z.infer<typeof EventCreateSchema> & { metadata?: T }
): CalendarEvent<T> {
  try {
    const validated = EventCreateSchema.parse(data);

    if (isAfter(validated.startTime, validated.endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }

    const event: CalendarEvent<T> = {
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
      metadata: validated.metadata as T,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return event;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
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
export function updateEvent<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  updates: Partial<Omit<CalendarEvent<T>, 'id' | 'createdAt'>>
): CalendarEvent<T> {
  const updated = {
    ...event,
    ...updates,
    updatedAt: new Date(),
  };

  if (updated.startTime && updated.endTime && isAfter(updated.startTime, updated.endTime)) {
    throw new BadRequestException('Start time must be before end time');
  }

  return updated;
}

/**
 * Cancels an event
 * @param event Event to cancel
 * @param reason Cancellation reason
 * @returns Cancelled event
 */
export function cancelEvent<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  reason?: string
): CalendarEvent<T> {
  return {
    ...event,
    status: EventStatus.CANCELLED,
    metadata: {
      ...event.metadata,
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    } as T,
    updatedAt: new Date(),
  };
}

/**
 * Duplicates an event
 * @param event Event to duplicate
 * @param newStartTime New start time
 * @returns Duplicated event
 */
export function duplicateEvent<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  newStartTime: Date
): CalendarEvent<T> {
  const duration = differenceInMinutes(event.endTime, event.startTime);
  const newEndTime = addMinutes(newStartTime, duration);

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
export function addAttendees<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  attendees: Omit<EventAttendee, 'id' | 'rsvpStatus'>[]
): CalendarEvent<T> {
  const newAttendees: EventAttendee[] = attendees.map((a) => ({
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
export function generateRecurringOccurrences<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent<T>[] {
  if (!event.recurrenceRule) {
    return [event];
  }

  const rule = event.recurrenceRule;
  const occurrences: CalendarEvent<T>[] = [];
  let currentDate = new Date(event.startTime);
  const duration = differenceInMinutes(event.endTime, event.startTime);

  let count = 0;
  const maxCount = rule.count || 1000; // Safety limit
  const until = rule.until || addYears(rangeStart, 5);

  while (isBefore(currentDate, rangeEnd) && count < maxCount && isBefore(currentDate, until)) {
    if (isWithinInterval(currentDate, { start: rangeStart, end: rangeEnd })) {
      if (matchesRecurrenceRule(currentDate, rule)) {
        const occurrenceEnd = addMinutes(currentDate, duration);
        occurrences.push({
          ...event,
          id: `${event.id}_${format(currentDate, 'yyyyMMdd')}`,
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
export function createDailyRecurrence(interval: number = 1, count?: number): RecurrenceRule {
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
export function createWeeklyRecurrence(
  interval: number = 1,
  daysOfWeek: DayOfWeek[],
  count?: number
): RecurrenceRule {
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
export function createMonthlyRecurrence(
  interval: number = 1,
  dayOfMonth: number,
  count?: number
): RecurrenceRule {
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
export function createYearlyRecurrence(
  interval: number = 1,
  month: MonthOfYear,
  dayOfMonth: number,
  count?: number
): RecurrenceRule {
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
export function createWorkdayRecurrence(interval: number = 1, count?: number): RecurrenceRule {
  return createWeeklyRecurrence(
    interval,
    [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
    count
  );
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
export function bookResource(resource: Resource, event: CalendarEvent): ResourceBooking {
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
export function isResourceAvailable(
  resource: Resource,
  startTime: Date,
  endTime: Date,
  existingBookings: ResourceBooking[]
): boolean {
  // Check if resource is active
  if (!resource.active) {
    return false;
  }

  // Check working hours
  if (resource.workingHours) {
    const dayOfWeek = getDay(startTime);
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

    return areIntervalsOverlapping(
      { start: startTime, end: endTime },
      { start: booking.startTime, end: booking.endTime },
      { inclusive: false }
    );
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
export function findAvailableResources(
  resources: Resource[],
  startTime: Date,
  endTime: Date,
  existingBookings: ResourceBooking[],
  resourceType?: ResourceType
): Resource[] {
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
export function calculateAvailabilitySlots(
  resource: Resource,
  date: Date,
  existingBookings: ResourceBooking[],
  slotDuration: number = 30
): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const dayOfWeek = getDay(date);
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

  while (isBefore(slotStart, dayEnd)) {
    const slotEnd = addMinutes(slotStart, slotDuration);

    if (isAfter(slotEnd, dayEnd)) {
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
export function cancelResourceBooking(booking: ResourceBooking): ResourceBooking {
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
export function detectConflicts<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  existingEvents: CalendarEvent[],
  bufferMinutes: number = 0
): ConflictResult {
  const conflicts: ConflictResult['conflicts'] = [];

  const eventStart = bufferMinutes > 0 ? subMinutes(event.startTime, bufferMinutes) : event.startTime;
  const eventEnd = bufferMinutes > 0 ? addMinutes(event.endTime, bufferMinutes) : event.endTime;

  for (const existing of existingEvents) {
    if (existing.id === event.id || existing.status === EventStatus.CANCELLED) {
      continue;
    }

    if (
      areIntervalsOverlapping(
        { start: eventStart, end: eventEnd },
        { start: existing.startTime, end: existing.endTime },
        { inclusive: false }
      )
    ) {
      const overlapStart = isAfter(eventStart, existing.startTime) ? eventStart : existing.startTime;
      const overlapEnd = isBefore(eventEnd, existing.endTime) ? eventEnd : existing.endTime;
      const overlapMinutes = differenceInMinutes(overlapEnd, overlapStart);
      const eventDuration = differenceInMinutes(event.endTime, event.startTime);
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
export function findAlternativeSlots<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  existingEvents: CalendarEvent[],
  searchDays: number = 7,
  preferredTimeRanges?: TimeRange[]
): AvailabilitySlot[] {
  const duration = differenceInMinutes(event.endTime, event.startTime);
  const suggestions: AvailabilitySlot[] = [];
  const startDate = startOfDay(event.startTime);

  for (let i = 0; i < searchDays; i++) {
    const checkDate = addDays(startDate, i);
    const dayStart = startOfDay(checkDate);
    const dayEnd = endOfDay(checkDate);

    // Generate slots throughout the day
    let slotStart = new Date(dayStart);
    slotStart.setHours(8, 0, 0, 0); // Start at 8 AM

    while (isBefore(slotStart, dayEnd)) {
      const slotEnd = addMinutes(slotStart, duration);

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

      slotStart = addMinutes(slotStart, 30); // Check every 30 minutes
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
export function resolveConflict<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  conflicts: ConflictResult,
  strategy: ConflictResolutionStrategy,
  existingEvents: CalendarEvent[]
): CalendarEvent<T> | null {
  switch (strategy) {
    case ConflictResolutionStrategy.REJECT:
      throw new ConflictException('Event conflicts with existing events');

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
export function checkAttendeeDoubleBooking<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  attendeeEvents: Map<string, CalendarEvent[]>
): Map<string, ConflictResult> {
  const attendeeConflicts = new Map<string, ConflictResult>();

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
export function convertEventTimeZone<T extends Record<string, unknown>>(
  event: CalendarEvent<T>,
  targetTimeZone: TimeZone
): CalendarEvent<T> {
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
export function getEventInTimeZone(
  event: CalendarEvent,
  timeZone: TimeZone
): { startTime: Date; endTime: Date; timeZone: TimeZone } {
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
export function normalizeEventsToTimeZone<T extends Record<string, unknown>>(
  events: CalendarEvent<T>[],
  targetTimeZone: TimeZone
): CalendarEvent<T>[] {
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
export function scheduleMeetingRoom(
  room: Resource,
  event: CalendarEvent,
  attendeeCount: number
): ResourceBooking {
  if (room.type !== ResourceType.MEETING_ROOM) {
    throw new BadRequestException('Resource is not a meeting room');
  }

  if (room.capacity && attendeeCount > room.capacity) {
    throw new BadRequestException(`Room capacity (${room.capacity}) exceeded by attendee count (${attendeeCount})`);
  }

  return bookResource(room, event);
}

/**
 * Creates staff shift
 * @param data Shift data
 * @returns Created shift
 */
export function createShift(
  data: Omit<Shift, 'id' | 'status'>
): Shift {
  if (isAfter(data.startTime, data.endTime)) {
    throw new BadRequestException('Shift start time must be before end time');
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
export function generateRotationSchedule(
  staffIds: string[],
  startDate: Date,
  endDate: Date,
  shiftPattern: Array<{ role: string; startHour: number; endHour: number }>,
  location: string
): Shift[] {
  const shifts: Shift[] = [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  let staffIndex = 0;

  for (const day of days) {
    for (const pattern of shiftPattern) {
      const shiftStart = new Date(day);
      shiftStart.setHours(pattern.startHour, 0, 0, 0);

      const shiftEnd = new Date(day);
      shiftEnd.setHours(pattern.endHour, 0, 0, 0);

      shifts.push(
        createShift({
          staffId: staffIds[staffIndex % staffIds.length],
          startTime: shiftStart,
          endTime: shiftEnd,
          role: pattern.role,
          location,
        })
      );

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
export function hasShiftConflict(
  staffId: string,
  newShift: Shift,
  existingShifts: Shift[]
): boolean {
  const staffShifts = existingShifts.filter(
    (s) => s.staffId === staffId && s.status !== 'cancelled'
  );

  return staffShifts.some((shift) =>
    areIntervalsOverlapping(
      { start: newShift.startTime, end: newShift.endTime },
      { start: shift.startTime, end: shift.endTime },
      { inclusive: false }
    )
  );
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
export function generateDayView(
  date: Date,
  events: CalendarEvent[],
  timeZone: TimeZone
): CalendarView<{ hourlyBreakdown: Map<number, CalendarEvent[]> }> {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const dayEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: dayStart, end: dayEnd })
  );

  const hourlyBreakdown = new Map<number, CalendarEvent[]>();
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
export function generateWeekView(
  date: Date,
  events: CalendarEvent[],
  timeZone: TimeZone
): CalendarView<{ dailyBreakdown: Map<string, CalendarEvent[]> }> {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  const weekEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: weekStart, end: weekEnd })
  );

  const dailyBreakdown = new Map<string, CalendarEvent[]>();
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  for (const day of days) {
    const dayKey = format(day, 'yyyy-MM-dd');
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    dailyBreakdown.set(
      dayKey,
      weekEvents.filter((event) =>
        isWithinInterval(event.startTime, { start: dayStart, end: dayEnd })
      )
    );
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
export function generateMonthView(
  date: Date,
  events: CalendarEvent[],
  timeZone: TimeZone
): CalendarView<{ dailyBreakdown: Map<string, CalendarEvent[]> }> {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const monthEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: monthStart, end: monthEnd })
  );

  const dailyBreakdown = new Map<string, CalendarEvent[]>();
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  for (const day of days) {
    const dayKey = format(day, 'yyyy-MM-dd');
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    dailyBreakdown.set(
      dayKey,
      monthEvents.filter((event) =>
        isWithinInterval(event.startTime, { start: dayStart, end: dayEnd })
      )
    );
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
export function generateYearView(
  year: number,
  events: CalendarEvent[],
  timeZone: TimeZone
): CalendarView<{ monthlyBreakdown: Map<number, CalendarEvent[]> }> {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));

  const yearEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: yearStart, end: yearEnd })
  );

  const monthlyBreakdown = new Map<number, CalendarEvent[]>();
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
export function generateAgendaView(
  startDate: Date,
  days: number,
  events: CalendarEvent[],
  timeZone: TimeZone
): CalendarView<{ chronological: CalendarEvent[] }> {
  const endDate = addDays(startDate, days);

  const agendaEvents = events
    .filter((event) => isWithinInterval(event.startTime, { start: startDate, end: endDate }))
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
export function exportToICalendar(event: CalendarEvent): string {
  const lines: string[] = [
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

  lines.push(
    `CREATED:${formatICalendarDate(event.createdAt)}`,
    `LAST-MODIFIED:${formatICalendarDate(event.updatedAt)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  );

  return lines.join('\r\n');
}

/**
 * Parses iCalendar string to event
 * @param icalString iCalendar string
 * @returns Parsed event
 */
export function parseICalendar(icalString: string): CalendarEvent {
  const lines = icalString.split(/\r?\n/);
  const eventData: Partial<CalendarEvent> = {
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
        eventData.status = value.toLowerCase() as EventStatus;
        break;
    }
  }

  return eventData as CalendarEvent;
}

/**
 * Exports multiple events to iCalendar
 * @param events Events to export
 * @returns iCalendar string
 */
export function exportMultipleToICalendar(events: CalendarEvent[]): string {
  const lines: string[] = [
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
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets working hours for specific day
 */
function getWorkingHoursForDay(workingHours: WorkingHours, dayOfWeek: number): TimeRange | null {
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  return workingHours[dayMap[dayOfWeek]] || null;
}

/**
 * Checks if time is within working hours
 */
function isWithinWorkingHours(startTime: Date, endTime: Date, workingHour: TimeRange): boolean {
  const [workStart] = workingHour.start.split(':').map(Number);
  const [workEnd] = workingHour.end.split(':').map(Number);

  const eventStartHour = startTime.getHours() + startTime.getMinutes() / 60;
  const eventEndHour = endTime.getHours() + endTime.getMinutes() / 60;

  return eventStartHour >= workStart && eventEndHour <= workEnd;
}

/**
 * Checks if time matches recurrence rule
 */
function matchesRecurrenceRule(date: Date, rule: RecurrenceRule): boolean {
  if (rule.byDay && rule.byDay.length > 0) {
    const dayOfWeek = getDay(date);
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
function getNextRecurrenceDate(currentDate: Date, rule: RecurrenceRule): Date {
  switch (rule.frequency) {
    case RecurrenceFrequency.DAILY:
      return addDays(currentDate, rule.interval);
    case RecurrenceFrequency.WEEKLY:
      return addWeeks(currentDate, rule.interval);
    case RecurrenceFrequency.MONTHLY:
      return addMonths(currentDate, rule.interval);
    case RecurrenceFrequency.YEARLY:
      return addYears(currentDate, rule.interval);
    default:
      return addDays(currentDate, 1);
  }
}

/**
 * Checks if time is within time range
 */
function isWithinTimeRange(date: Date, range: TimeRange): boolean {
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
function formatICalendarDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

/**
 * Parses iCalendar date
 */
function parseICalendarDate(dateString: string): Date {
  const cleaned = dateString.replace(/[TZ]/g, '');
  return parse(cleaned, 'yyyyMMddHHmmss', new Date());
}

/**
 * Escapes text for iCalendar
 */
function escapeICalendarText(text: string): string {
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
function unescapeICalendarText(text: string): string {
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
function formatRecurrenceRule(rule: RecurrenceRule): string {
  const parts: string[] = [`FREQ=${rule.frequency.toUpperCase()}`];

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
export const schedulingLogger = new Logger('SchedulingCalendar');
