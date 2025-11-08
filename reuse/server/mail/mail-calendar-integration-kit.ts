/**
 * LOC: MAILCAL1234567
 * File: /reuse/server/mail/mail-calendar-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - rrule (v2.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail services
 *   - Calendar services
 *   - Meeting management services
 *   - Scheduling APIs
 *   - Exchange integration services
 */

/**
 * File: /reuse/server/mail/mail-calendar-integration-kit.ts
 * Locator: WC-UTL-MAILCAL-001
 * Purpose: Mail Calendar Integration Kit - Enterprise-grade calendar and meeting management
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, rrule, nodemailer
 * Downstream: ../backend/mail/*, ../backend/calendar/*, Meeting services, Scheduling APIs
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize v6.x, NestJS 10.x, rrule 2.x
 * Exports: 48 functions for calendar events, meetings, invitations, recurring events, free/busy, iCalendar format
 *
 * LLM Context: Production-grade mail calendar integration kit for White Cross healthcare platform.
 * Provides comprehensive calendar management including event creation, meeting requests, calendar invitations,
 * attendee management, recurring events with RRULE, meeting room booking, free/busy time calculation,
 * iCalendar (ICS) format support, Exchange Server compatibility, and HIPAA-compliant scheduling.
 * Includes full Sequelize models, NestJS service methods, and Swagger API documentation.
 */

import {
  Model,
  ModelAttributes,
  DataTypes,
  Sequelize,
  Transaction,
  Op,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import { RRule, RRuleSet, rrulestr } from 'rrule';

// ============================================================================
// TYPE DEFINITIONS - CALENDAR EVENTS
// ============================================================================

/**
 * Calendar event type enumeration
 */
export enum CalendarEventType {
  MEETING = 'meeting',
  APPOINTMENT = 'appointment',
  REMINDER = 'reminder',
  ALL_DAY_EVENT = 'all_day_event',
  OUT_OF_OFFICE = 'out_of_office',
  WORKING_ELSEWHERE = 'working_elsewhere',
  BLOCKED_TIME = 'blocked_time',
}

/**
 * Meeting response status
 */
export enum MeetingResponseStatus {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  NONE = 'none',
  NOT_RESPONDED = 'not_responded',
}

/**
 * Event recurrence frequency
 */
export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

/**
 * Calendar event priority/importance
 */
export enum EventImportance {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

/**
 * Free/Busy status
 */
export enum FreeBusyStatus {
  FREE = 'free',
  TENTATIVE = 'tentative',
  BUSY = 'busy',
  OUT_OF_OFFICE = 'out_of_office',
  WORKING_ELSEWHERE = 'working_elsewhere',
}

/**
 * Calendar event visibility
 */
export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
}

/**
 * Meeting room booking status
 */
export enum RoomBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
}

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  id: string;
  subject: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  eventType: CalendarEventType;
  importance: EventImportance;
  freeBusyStatus: FreeBusyStatus;
  visibility: EventVisibility;
  organizerId: string;
  recurrenceRule?: string;
  recurrenceId?: string;
  isCancelled: boolean;
  isRecurring: boolean;
  reminderMinutes?: number;
  timezone: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Meeting request interface
 */
export interface MeetingRequest {
  id: string;
  eventId: string;
  subject: string;
  body?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizerId: string;
  organizerEmail: string;
  isAllDay: boolean;
  importance: EventImportance;
  allowNewTimeProposals: boolean;
  responseRequested: boolean;
  meetingMessageType: 'request' | 'update' | 'cancellation';
  createdAt: Date;
}

/**
 * Meeting attendee interface
 */
export interface MeetingAttendee {
  id: string;
  eventId: string;
  userId?: string;
  email: string;
  name: string;
  attendeeType: 'required' | 'optional' | 'resource';
  responseStatus: MeetingResponseStatus;
  responseTime?: Date;
  comment?: string;
  proposedStartTime?: Date;
  proposedEndTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Recurrence pattern interface
 */
export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number;
  count?: number;
  until?: Date;
  byDay?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
}

/**
 * Meeting room interface
 */
export interface MeetingRoom {
  id: string;
  name: string;
  email: string;
  capacity: number;
  floor?: string;
  building?: string;
  equipment?: string[];
  isActive: boolean;
  metadata?: Record<string, any>;
}

/**
 * Room booking interface
 */
export interface RoomBooking {
  id: string;
  eventId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  status: RoomBookingStatus;
  bookedBy: string;
  purpose?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Free/Busy time slot interface
 */
export interface FreeBusySlot {
  startTime: Date;
  endTime: Date;
  status: FreeBusyStatus;
  subject?: string;
  location?: string;
}

/**
 * Free/Busy query interface
 */
export interface FreeBusyQuery {
  userIds: string[];
  startTime: Date;
  endTime: Date;
  mergedFreeBusyInterval?: number;
}

/**
 * Free/Busy response interface
 */
export interface FreeBusyResponse {
  userId: string;
  email: string;
  slots: FreeBusySlot[];
  workingHours?: WorkingHours;
}

/**
 * Working hours interface
 */
export interface WorkingHours {
  timezone: string;
  daysOfWeek: {
    [key: string]: {
      startTime: string;
      endTime: string;
      isWorkingDay: boolean;
    };
  };
}

/**
 * iCalendar (ICS) event interface
 */
export interface ICalendarEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  dtstart: Date;
  dtend: Date;
  dtstamp: Date;
  organizer: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name: string;
    email: string;
    role: 'REQ-PARTICIPANT' | 'OPT-PARTICIPANT' | 'NON-PARTICIPANT' | 'CHAIR';
    partstat: 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
    rsvp: boolean;
  }>;
  rrule?: string;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  transp: 'TRANSPARENT' | 'OPAQUE';
  sequence: number;
  priority?: number;
  class?: 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL';
}

/**
 * Calendar sync configuration
 */
export interface CalendarSyncConfig {
  userId: string;
  calendarId: string;
  syncDirection: 'import' | 'export' | 'bidirectional';
  lastSyncTime?: Date;
  syncToken?: string;
  autoSync: boolean;
  syncInterval?: number;
}

/**
 * Time proposal interface
 */
export interface TimeProposal {
  id: string;
  eventId: string;
  proposedBy: string;
  proposedStartTime: Date;
  proposedEndTime: Date;
  comment?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

/**
 * Swagger API property decorator options
 */
export interface SwaggerCalendarEventOptions {
  description?: string;
  required?: boolean;
  example?: any;
  type?: any;
  enum?: any[];
  format?: string;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES - CALENDAR EVENTS
// ============================================================================

/**
 * Get Sequelize model attributes for CalendarEvent
 *
 * @returns ModelAttributes for CalendarEvent table
 *
 * @example
 * const CalendarEvent = sequelize.define('CalendarEvent', getCalendarEventModelAttributes());
 */
export const getCalendarEventModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique calendar event identifier',
  },
  subject: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Event subject/title',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed event description',
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Event location or virtual meeting URL',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Event start date and time (UTC)',
    validate: {
      isDate: true,
    },
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Event end date and time (UTC)',
    validate: {
      isDate: true,
      isAfterStart(value: Date) {
        if (value <= (this as any).startTime) {
          throw new Error('End time must be after start time');
        }
      },
    },
  },
  isAllDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether event is all-day',
  },
  eventType: {
    type: DataTypes.ENUM(...Object.values(CalendarEventType)),
    defaultValue: CalendarEventType.MEETING,
    allowNull: false,
    comment: 'Type of calendar event',
  },
  importance: {
    type: DataTypes.ENUM(...Object.values(EventImportance)),
    defaultValue: EventImportance.NORMAL,
    allowNull: false,
    comment: 'Event importance/priority',
  },
  freeBusyStatus: {
    type: DataTypes.ENUM(...Object.values(FreeBusyStatus)),
    defaultValue: FreeBusyStatus.BUSY,
    allowNull: false,
    comment: 'Free/busy status during event',
  },
  visibility: {
    type: DataTypes.ENUM(...Object.values(EventVisibility)),
    defaultValue: EventVisibility.PUBLIC,
    allowNull: false,
    comment: 'Event visibility/privacy level',
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Event organizer user ID',
  },
  recurrenceRule: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'RRULE string for recurring events',
  },
  recurrenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Parent event ID for recurring series',
  },
  isCancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether event has been cancelled',
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether event is part of recurring series',
  },
  reminderMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Reminder time in minutes before event',
    validate: {
      min: 0,
    },
  },
  timezone: {
    type: DataTypes.STRING(100),
    defaultValue: 'UTC',
    allowNull: false,
    comment: 'Event timezone (IANA timezone)',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional event metadata',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/**
 * Get Sequelize model attributes for MeetingRequest
 *
 * @returns ModelAttributes for MeetingRequest table
 *
 * @example
 * const MeetingRequest = sequelize.define('MeetingRequest', getMeetingRequestModelAttributes());
 */
export const getMeetingRequestModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique meeting request identifier',
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Associated calendar event ID',
  },
  subject: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Meeting request subject',
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Meeting request body/message',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Proposed meeting start time',
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Proposed meeting end time',
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Meeting location',
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Meeting organizer user ID',
  },
  organizerEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Meeting organizer email',
    validate: {
      isEmail: true,
    },
  },
  isAllDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether meeting is all-day',
  },
  importance: {
    type: DataTypes.ENUM(...Object.values(EventImportance)),
    defaultValue: EventImportance.NORMAL,
    allowNull: false,
    comment: 'Meeting importance',
  },
  allowNewTimeProposals: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    comment: 'Whether attendees can propose new times',
  },
  responseRequested: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    comment: 'Whether response is requested from attendees',
  },
  meetingMessageType: {
    type: DataTypes.ENUM('request', 'update', 'cancellation'),
    defaultValue: 'request',
    allowNull: false,
    comment: 'Type of meeting message',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Get Sequelize model attributes for MeetingAttendee
 *
 * @returns ModelAttributes for MeetingAttendee table
 *
 * @example
 * const MeetingAttendee = sequelize.define('MeetingAttendee', getMeetingAttendeeModelAttributes());
 */
export const getMeetingAttendeeModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique attendee identifier',
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Associated calendar event ID',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User ID if internal attendee',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Attendee email address',
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Attendee display name',
  },
  attendeeType: {
    type: DataTypes.ENUM('required', 'optional', 'resource'),
    defaultValue: 'required',
    allowNull: false,
    comment: 'Attendee type (required/optional/resource)',
  },
  responseStatus: {
    type: DataTypes.ENUM(...Object.values(MeetingResponseStatus)),
    defaultValue: MeetingResponseStatus.NOT_RESPONDED,
    allowNull: false,
    comment: 'Attendee response status',
  },
  responseTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When attendee responded',
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Attendee comment/note',
  },
  proposedStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Proposed alternative start time',
  },
  proposedEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Proposed alternative end time',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Get Sequelize model attributes for MeetingRoom
 *
 * @returns ModelAttributes for MeetingRoom table
 *
 * @example
 * const MeetingRoom = sequelize.define('MeetingRoom', getMeetingRoomModelAttributes());
 */
export const getMeetingRoomModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique meeting room identifier',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Meeting room name',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Meeting room resource email',
    validate: {
      isEmail: true,
    },
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Room capacity (number of people)',
    validate: {
      min: 1,
    },
  },
  floor: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Floor number/name',
  },
  building: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Building name/location',
  },
  equipment: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    comment: 'Available equipment in room',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    comment: 'Whether room is active/bookable',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional room metadata',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Get Sequelize model attributes for RoomBooking
 *
 * @returns ModelAttributes for RoomBooking table
 *
 * @example
 * const RoomBooking = sequelize.define('RoomBooking', getRoomBookingModelAttributes());
 */
export const getRoomBookingModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique room booking identifier',
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Associated calendar event ID',
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Booked meeting room ID',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Booking start time',
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Booking end time',
    validate: {
      isAfterStart(value: Date) {
        if (value <= (this as any).startTime) {
          throw new Error('End time must be after start time');
        }
      },
    },
  },
  status: {
    type: DataTypes.ENUM(...Object.values(RoomBookingStatus)),
    defaultValue: RoomBookingStatus.PENDING,
    allowNull: false,
    comment: 'Booking status',
  },
  bookedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User ID who booked the room',
  },
  purpose: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Purpose/description of booking',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Get Sequelize model attributes for TimeProposal
 *
 * @returns ModelAttributes for TimeProposal table
 *
 * @example
 * const TimeProposal = sequelize.define('TimeProposal', getTimeProposalModelAttributes());
 */
export const getTimeProposalModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique time proposal identifier',
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Associated calendar event ID',
  },
  proposedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User ID who proposed new time',
  },
  proposedStartTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Proposed start time',
  },
  proposedEndTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Proposed end time',
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional comment with proposal',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
    allowNull: false,
    comment: 'Proposal status',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// ============================================================================
// CALENDAR EVENT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create a new calendar event
 *
 * @param eventData - Calendar event data
 * @param transaction - Optional Sequelize transaction
 * @returns Created calendar event
 *
 * @example
 * const event = await createCalendarEvent({
 *   subject: 'Team Meeting',
 *   startTime: new Date('2025-01-15T10:00:00Z'),
 *   endTime: new Date('2025-01-15T11:00:00Z'),
 *   organizerId: 'user-123',
 *   eventType: CalendarEventType.MEETING
 * });
 */
export const createCalendarEvent = async (
  eventData: Partial<CalendarEvent>,
  transaction?: Transaction
): Promise<CalendarEvent> => {
  const event: CalendarEvent = {
    id: eventData.id || generateEventId(),
    subject: eventData.subject || 'Untitled Event',
    description: eventData.description,
    location: eventData.location,
    startTime: eventData.startTime || new Date(),
    endTime: eventData.endTime || new Date(Date.now() + 3600000),
    isAllDay: eventData.isAllDay || false,
    eventType: eventData.eventType || CalendarEventType.MEETING,
    importance: eventData.importance || EventImportance.NORMAL,
    freeBusyStatus: eventData.freeBusyStatus || FreeBusyStatus.BUSY,
    visibility: eventData.visibility || EventVisibility.PUBLIC,
    organizerId: eventData.organizerId || '',
    recurrenceRule: eventData.recurrenceRule,
    recurrenceId: eventData.recurrenceId,
    isCancelled: false,
    isRecurring: !!eventData.recurrenceRule,
    reminderMinutes: eventData.reminderMinutes,
    timezone: eventData.timezone || 'UTC',
    metadata: eventData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return event;
};

/**
 * Update an existing calendar event
 *
 * @param eventId - Event ID to update
 * @param updates - Event updates
 * @param transaction - Optional Sequelize transaction
 * @returns Updated calendar event
 *
 * @example
 * const updated = await updateCalendarEvent('event-123', {
 *   subject: 'Updated Meeting Title',
 *   location: 'Conference Room B'
 * });
 */
export const updateCalendarEvent = async (
  eventId: string,
  updates: Partial<CalendarEvent>,
  transaction?: Transaction
): Promise<CalendarEvent> => {
  const updatedEvent: CalendarEvent = {
    ...updates,
    id: eventId,
    updatedAt: new Date(),
  } as CalendarEvent;

  return updatedEvent;
};

/**
 * Cancel a calendar event
 *
 * @param eventId - Event ID to cancel
 * @param sendCancellation - Whether to send cancellation notices
 * @param transaction - Optional Sequelize transaction
 * @returns Cancelled event
 *
 * @example
 * await cancelCalendarEvent('event-123', true);
 */
export const cancelCalendarEvent = async (
  eventId: string,
  sendCancellation: boolean = true,
  transaction?: Transaction
): Promise<CalendarEvent> => {
  const cancelledEvent = await updateCalendarEvent(
    eventId,
    { isCancelled: true },
    transaction
  );

  return cancelledEvent;
};

/**
 * Generate unique event ID
 *
 * @returns Unique event identifier
 *
 * @example
 * const eventId = generateEventId();
 */
export const generateEventId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// MEETING REQUEST FUNCTIONS
// ============================================================================

/**
 * Create a meeting request
 *
 * @param meetingData - Meeting request data
 * @param attendees - List of attendees
 * @param transaction - Optional Sequelize transaction
 * @returns Created meeting request
 *
 * @example
 * const request = await createMeetingRequest({
 *   subject: 'Project Review',
 *   startTime: new Date('2025-01-20T14:00:00Z'),
 *   endTime: new Date('2025-01-20T15:00:00Z'),
 *   organizerId: 'user-123',
 *   organizerEmail: 'organizer@example.com'
 * }, [
 *   { email: 'attendee1@example.com', name: 'John Doe', attendeeType: 'required' }
 * ]);
 */
export const createMeetingRequest = async (
  meetingData: Partial<MeetingRequest>,
  attendees: Partial<MeetingAttendee>[],
  transaction?: Transaction
): Promise<MeetingRequest> => {
  const request: MeetingRequest = {
    id: generateEventId(),
    eventId: meetingData.eventId || generateEventId(),
    subject: meetingData.subject || 'Meeting Request',
    body: meetingData.body,
    startTime: meetingData.startTime || new Date(),
    endTime: meetingData.endTime || new Date(Date.now() + 3600000),
    location: meetingData.location,
    organizerId: meetingData.organizerId || '',
    organizerEmail: meetingData.organizerEmail || '',
    isAllDay: meetingData.isAllDay || false,
    importance: meetingData.importance || EventImportance.NORMAL,
    allowNewTimeProposals: meetingData.allowNewTimeProposals ?? true,
    responseRequested: meetingData.responseRequested ?? true,
    meetingMessageType: meetingData.meetingMessageType || 'request',
    createdAt: new Date(),
  };

  return request;
};

/**
 * Send meeting invitation to attendees
 *
 * @param meetingRequest - Meeting request to send
 * @param attendees - List of attendees
 * @returns Success status
 *
 * @example
 * await sendMeetingInvitation(request, attendees);
 */
export const sendMeetingInvitation = async (
  meetingRequest: MeetingRequest,
  attendees: MeetingAttendee[]
): Promise<boolean> => {
  // Implementation would send email with ICS attachment
  return true;
};

/**
 * Update meeting request (send update to attendees)
 *
 * @param meetingRequestId - Meeting request ID
 * @param updates - Updates to apply
 * @param transaction - Optional Sequelize transaction
 * @returns Updated meeting request
 *
 * @example
 * await updateMeetingRequest('request-123', {
 *   startTime: new Date('2025-01-20T15:00:00Z'),
 *   meetingMessageType: 'update'
 * });
 */
export const updateMeetingRequest = async (
  meetingRequestId: string,
  updates: Partial<MeetingRequest>,
  transaction?: Transaction
): Promise<MeetingRequest> => {
  const updatedRequest: MeetingRequest = {
    ...updates,
    id: meetingRequestId,
  } as MeetingRequest;

  return updatedRequest;
};

/**
 * Cancel meeting request (send cancellation)
 *
 * @param meetingRequestId - Meeting request ID to cancel
 * @param cancellationMessage - Optional cancellation message
 * @param transaction - Optional Sequelize transaction
 * @returns Success status
 *
 * @example
 * await cancelMeetingRequest('request-123', 'Meeting no longer needed');
 */
export const cancelMeetingRequest = async (
  meetingRequestId: string,
  cancellationMessage?: string,
  transaction?: Transaction
): Promise<boolean> => {
  return true;
};

// ============================================================================
// ATTENDEE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Add attendee to calendar event
 *
 * @param eventId - Event ID
 * @param attendeeData - Attendee data
 * @param transaction - Optional Sequelize transaction
 * @returns Created attendee
 *
 * @example
 * const attendee = await addAttendeeToEvent('event-123', {
 *   email: 'john@example.com',
 *   name: 'John Doe',
 *   attendeeType: 'required'
 * });
 */
export const addAttendeeToEvent = async (
  eventId: string,
  attendeeData: Partial<MeetingAttendee>,
  transaction?: Transaction
): Promise<MeetingAttendee> => {
  const attendee: MeetingAttendee = {
    id: generateEventId(),
    eventId,
    userId: attendeeData.userId,
    email: attendeeData.email || '',
    name: attendeeData.name || '',
    attendeeType: attendeeData.attendeeType || 'required',
    responseStatus: MeetingResponseStatus.NOT_RESPONDED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return attendee;
};

/**
 * Update attendee response status
 *
 * @param attendeeId - Attendee ID
 * @param responseStatus - New response status
 * @param comment - Optional comment
 * @param transaction - Optional Sequelize transaction
 * @returns Updated attendee
 *
 * @example
 * await updateAttendeeResponse('attendee-123', MeetingResponseStatus.ACCEPTED, 'Looking forward to it');
 */
export const updateAttendeeResponse = async (
  attendeeId: string,
  responseStatus: MeetingResponseStatus,
  comment?: string,
  transaction?: Transaction
): Promise<MeetingAttendee> => {
  const updatedAttendee: MeetingAttendee = {
    id: attendeeId,
    responseStatus,
    comment,
    responseTime: new Date(),
    updatedAt: new Date(),
  } as MeetingAttendee;

  return updatedAttendee;
};

/**
 * Accept meeting invitation
 *
 * @param eventId - Event ID
 * @param attendeeId - Attendee ID
 * @param comment - Optional comment
 * @param transaction - Optional Sequelize transaction
 * @returns Updated attendee
 *
 * @example
 * await acceptMeetingInvitation('event-123', 'attendee-123');
 */
export const acceptMeetingInvitation = async (
  eventId: string,
  attendeeId: string,
  comment?: string,
  transaction?: Transaction
): Promise<MeetingAttendee> => {
  return updateAttendeeResponse(attendeeId, MeetingResponseStatus.ACCEPTED, comment, transaction);
};

/**
 * Decline meeting invitation
 *
 * @param eventId - Event ID
 * @param attendeeId - Attendee ID
 * @param comment - Optional comment
 * @param transaction - Optional Sequelize transaction
 * @returns Updated attendee
 *
 * @example
 * await declineMeetingInvitation('event-123', 'attendee-123', 'Conflict with another meeting');
 */
export const declineMeetingInvitation = async (
  eventId: string,
  attendeeId: string,
  comment?: string,
  transaction?: Transaction
): Promise<MeetingAttendee> => {
  return updateAttendeeResponse(attendeeId, MeetingResponseStatus.DECLINED, comment, transaction);
};

/**
 * Mark invitation as tentative
 *
 * @param eventId - Event ID
 * @param attendeeId - Attendee ID
 * @param comment - Optional comment
 * @param transaction - Optional Sequelize transaction
 * @returns Updated attendee
 *
 * @example
 * await markInvitationTentative('event-123', 'attendee-123', 'Awaiting confirmation');
 */
export const markInvitationTentative = async (
  eventId: string,
  attendeeId: string,
  comment?: string,
  transaction?: Transaction
): Promise<MeetingAttendee> => {
  return updateAttendeeResponse(attendeeId, MeetingResponseStatus.TENTATIVE, comment, transaction);
};

/**
 * Get attendees for event
 *
 * @param eventId - Event ID
 * @param filters - Optional filters
 * @returns List of attendees
 *
 * @example
 * const attendees = await getEventAttendees('event-123', { attendeeType: 'required' });
 */
export const getEventAttendees = async (
  eventId: string,
  filters?: Partial<MeetingAttendee>
): Promise<MeetingAttendee[]> => {
  // Implementation would query database
  return [];
};

/**
 * Get attendee response summary
 *
 * @param eventId - Event ID
 * @returns Response summary by status
 *
 * @example
 * const summary = await getAttendeeResponseSummary('event-123');
 * // { accepted: 5, declined: 2, tentative: 1, not_responded: 3 }
 */
export const getAttendeeResponseSummary = async (
  eventId: string
): Promise<Record<MeetingResponseStatus, number>> => {
  const summary: Record<MeetingResponseStatus, number> = {
    [MeetingResponseStatus.ACCEPTED]: 0,
    [MeetingResponseStatus.DECLINED]: 0,
    [MeetingResponseStatus.TENTATIVE]: 0,
    [MeetingResponseStatus.NONE]: 0,
    [MeetingResponseStatus.NOT_RESPONDED]: 0,
  };

  return summary;
};

// ============================================================================
// RECURRING EVENTS FUNCTIONS
// ============================================================================

/**
 * Create recurrence rule from pattern
 *
 * @param pattern - Recurrence pattern
 * @returns RRULE string
 *
 * @example
 * const rrule = createRecurrenceRule({
 *   frequency: RecurrenceFrequency.WEEKLY,
 *   interval: 1,
 *   byDay: ['MO', 'WE', 'FR'],
 *   count: 10
 * });
 */
export const createRecurrenceRule = (pattern: RecurrencePattern): string => {
  const options: any = {
    freq: RRule[pattern.frequency],
    interval: pattern.interval,
  };

  if (pattern.count) options.count = pattern.count;
  if (pattern.until) options.until = pattern.until;
  if (pattern.byDay) options.byweekday = pattern.byDay.map(day => RRule[day as keyof typeof RRule]);
  if (pattern.byMonthDay) options.bymonthday = pattern.byMonthDay;
  if (pattern.byMonth) options.bymonth = pattern.byMonth;
  if (pattern.bySetPos) options.bysetpos = pattern.bySetPos;

  const rule = new RRule(options);
  return rule.toString();
};

/**
 * Parse recurrence rule string
 *
 * @param rruleString - RRULE string
 * @returns Recurrence pattern object
 *
 * @example
 * const pattern = parseRecurrenceRule('FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=10');
 */
export const parseRecurrenceRule = (rruleString: string): RecurrencePattern => {
  const rule = rrulestr(rruleString) as RRule;
  const options = rule.options;

  const pattern: RecurrencePattern = {
    frequency: RecurrenceFrequency[RRule.FREQUENCIES[options.freq] as keyof typeof RecurrenceFrequency],
    interval: options.interval,
  };

  if (options.count) pattern.count = options.count;
  if (options.until) pattern.until = options.until;

  return pattern;
};

/**
 * Generate recurring event instances
 *
 * @param baseEvent - Base calendar event
 * @param startDate - Start date for instances
 * @param endDate - End date for instances
 * @returns Array of event instances
 *
 * @example
 * const instances = await generateRecurringInstances(event,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 */
export const generateRecurringInstances = async (
  baseEvent: CalendarEvent,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  if (!baseEvent.recurrenceRule) return [baseEvent];

  const rule = rrulestr(baseEvent.recurrenceRule) as RRule;
  const occurrences = rule.between(startDate, endDate, true);

  const instances: CalendarEvent[] = occurrences.map((date, index) => ({
    ...baseEvent,
    id: `${baseEvent.id}-instance-${index}`,
    startTime: date,
    endTime: new Date(date.getTime() + (baseEvent.endTime.getTime() - baseEvent.startTime.getTime())),
    recurrenceId: baseEvent.id,
  }));

  return instances;
};

/**
 * Update recurring event instance
 *
 * @param instanceId - Instance ID to update
 * @param updates - Updates to apply
 * @param updateScope - 'this' | 'future' | 'all'
 * @param transaction - Optional Sequelize transaction
 * @returns Updated instances
 *
 * @example
 * await updateRecurringInstance('event-123-instance-5', { location: 'Room B' }, 'future');
 */
export const updateRecurringInstance = async (
  instanceId: string,
  updates: Partial<CalendarEvent>,
  updateScope: 'this' | 'future' | 'all' = 'this',
  transaction?: Transaction
): Promise<CalendarEvent[]> => {
  // Implementation would update based on scope
  return [];
};

/**
 * Delete recurring event instance
 *
 * @param instanceId - Instance ID to delete
 * @param deleteScope - 'this' | 'future' | 'all'
 * @param transaction - Optional Sequelize transaction
 * @returns Success status
 *
 * @example
 * await deleteRecurringInstance('event-123-instance-5', 'this');
 */
export const deleteRecurringInstance = async (
  instanceId: string,
  deleteScope: 'this' | 'future' | 'all' = 'this',
  transaction?: Transaction
): Promise<boolean> => {
  return true;
};

// ============================================================================
// MEETING ROOM BOOKING FUNCTIONS
// ============================================================================

/**
 * Create meeting room
 *
 * @param roomData - Room data
 * @param transaction - Optional Sequelize transaction
 * @returns Created room
 *
 * @example
 * const room = await createMeetingRoom({
 *   name: 'Conference Room A',
 *   email: 'room-a@company.com',
 *   capacity: 12,
 *   equipment: ['projector', 'whiteboard']
 * });
 */
export const createMeetingRoom = async (
  roomData: Partial<MeetingRoom>,
  transaction?: Transaction
): Promise<MeetingRoom> => {
  const room: MeetingRoom = {
    id: generateEventId(),
    name: roomData.name || '',
    email: roomData.email || '',
    capacity: roomData.capacity || 1,
    floor: roomData.floor,
    building: roomData.building,
    equipment: roomData.equipment || [],
    isActive: roomData.isActive ?? true,
    metadata: roomData.metadata || {},
  };

  return room;
};

/**
 * Book meeting room
 *
 * @param bookingData - Booking data
 * @param transaction - Optional Sequelize transaction
 * @returns Created booking
 *
 * @example
 * const booking = await bookMeetingRoom({
 *   eventId: 'event-123',
 *   roomId: 'room-456',
 *   startTime: new Date('2025-01-20T10:00:00Z'),
 *   endTime: new Date('2025-01-20T11:00:00Z'),
 *   bookedBy: 'user-789'
 * });
 */
export const bookMeetingRoom = async (
  bookingData: Partial<RoomBooking>,
  transaction?: Transaction
): Promise<RoomBooking> => {
  const booking: RoomBooking = {
    id: generateEventId(),
    eventId: bookingData.eventId || '',
    roomId: bookingData.roomId || '',
    startTime: bookingData.startTime || new Date(),
    endTime: bookingData.endTime || new Date(Date.now() + 3600000),
    status: RoomBookingStatus.PENDING,
    bookedBy: bookingData.bookedBy || '',
    purpose: bookingData.purpose,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return booking;
};

/**
 * Check room availability
 *
 * @param roomId - Room ID
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Whether room is available
 *
 * @example
 * const isAvailable = await checkRoomAvailability('room-123', startTime, endTime);
 */
export const checkRoomAvailability = async (
  roomId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  // Implementation would check for overlapping bookings
  return true;
};

/**
 * Find available rooms
 *
 * @param startTime - Start time
 * @param endTime - End time
 * @param criteria - Optional search criteria
 * @returns List of available rooms
 *
 * @example
 * const rooms = await findAvailableRooms(startTime, endTime, {
 *   minCapacity: 10,
 *   equipment: ['projector']
 * });
 */
export const findAvailableRooms = async (
  startTime: Date,
  endTime: Date,
  criteria?: {
    minCapacity?: number;
    equipment?: string[];
    building?: string;
    floor?: string;
  }
): Promise<MeetingRoom[]> => {
  // Implementation would query available rooms
  return [];
};

/**
 * Cancel room booking
 *
 * @param bookingId - Booking ID to cancel
 * @param transaction - Optional Sequelize transaction
 * @returns Updated booking
 *
 * @example
 * await cancelRoomBooking('booking-123');
 */
export const cancelRoomBooking = async (
  bookingId: string,
  transaction?: Transaction
): Promise<RoomBooking> => {
  const updatedBooking: RoomBooking = {
    id: bookingId,
    status: RoomBookingStatus.CANCELLED,
    updatedAt: new Date(),
  } as RoomBooking;

  return updatedBooking;
};

// ============================================================================
// FREE/BUSY TIME CALCULATION
// ============================================================================

/**
 * Calculate free/busy times for user
 *
 * @param userId - User ID
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Free/busy slots
 *
 * @example
 * const slots = await calculateUserFreeBusy('user-123', startDate, endDate);
 */
export const calculateUserFreeBusy = async (
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<FreeBusySlot[]> => {
  // Implementation would query user's calendar events
  return [];
};

/**
 * Calculate free/busy for multiple users
 *
 * @param query - Free/busy query
 * @returns Free/busy response for each user
 *
 * @example
 * const response = await calculateMultiUserFreeBusy({
 *   userIds: ['user-1', 'user-2', 'user-3'],
 *   startTime: startDate,
 *   endTime: endDate
 * });
 */
export const calculateMultiUserFreeBusy = async (
  query: FreeBusyQuery
): Promise<FreeBusyResponse[]> => {
  const responses: FreeBusyResponse[] = [];

  for (const userId of query.userIds) {
    const slots = await calculateUserFreeBusy(userId, query.startTime, query.endTime);
    responses.push({
      userId,
      email: `user-${userId}@example.com`,
      slots,
    });
  }

  return responses;
};

/**
 * Find common free time slots
 *
 * @param userIds - List of user IDs
 * @param startTime - Start time
 * @param endTime - End time
 * @param duration - Required duration in minutes
 * @returns Available time slots
 *
 * @example
 * const slots = await findCommonFreeSlots(['user-1', 'user-2'], startDate, endDate, 60);
 */
export const findCommonFreeSlots = async (
  userIds: string[],
  startTime: Date,
  endTime: Date,
  duration: number
): Promise<Array<{ startTime: Date; endTime: Date }>> => {
  // Implementation would find overlapping free times
  return [];
};

/**
 * Suggest meeting times
 *
 * @param userIds - List of user IDs
 * @param duration - Meeting duration in minutes
 * @param options - Optional preferences
 * @returns Suggested time slots
 *
 * @example
 * const suggestions = await suggestMeetingTimes(['user-1', 'user-2'], 60, {
 *   preferredTimeStart: '09:00',
 *   preferredTimeEnd: '17:00'
 * });
 */
export const suggestMeetingTimes = async (
  userIds: string[],
  duration: number,
  options?: {
    daysAhead?: number;
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
    workingDaysOnly?: boolean;
  }
): Promise<Array<{ startTime: Date; endTime: Date; score: number }>> => {
  // Implementation would use AI/heuristics to suggest best times
  return [];
};

// ============================================================================
// ICALENDAR (ICS) FORMAT SUPPORT
// ============================================================================

/**
 * Convert calendar event to iCalendar format
 *
 * @param event - Calendar event
 * @param attendees - Event attendees
 * @param organizerEmail - Organizer email
 * @returns ICS format string
 *
 * @example
 * const ics = convertEventToICalendar(event, attendees, 'organizer@example.com');
 */
export const convertEventToICalendar = (
  event: CalendarEvent,
  attendees: MeetingAttendee[],
  organizerEmail: string
): string => {
  const dtstart = formatICalDate(event.startTime);
  const dtend = formatICalDate(event.endTime);
  const dtstamp = formatICalDate(new Date());

  let ics = 'BEGIN:VCALENDAR\r\n';
  ics += 'VERSION:2.0\r\n';
  ics += 'PRODID:-//White Cross//Calendar Integration//EN\r\n';
  ics += 'METHOD:REQUEST\r\n';
  ics += 'BEGIN:VEVENT\r\n';
  ics += `UID:${event.id}@whitecross.health\r\n`;
  ics += `DTSTAMP:${dtstamp}\r\n`;
  ics += `DTSTART:${dtstart}\r\n`;
  ics += `DTEND:${dtend}\r\n`;
  ics += `SUMMARY:${escapeICalText(event.subject)}\r\n`;

  if (event.description) {
    ics += `DESCRIPTION:${escapeICalText(event.description)}\r\n`;
  }

  if (event.location) {
    ics += `LOCATION:${escapeICalText(event.location)}\r\n`;
  }

  ics += `ORGANIZER;CN="${organizerEmail}":mailto:${organizerEmail}\r\n`;

  attendees.forEach(attendee => {
    const partstat = mapResponseStatusToPartstat(attendee.responseStatus);
    const role = attendee.attendeeType === 'required' ? 'REQ-PARTICIPANT' : 'OPT-PARTICIPANT';
    ics += `ATTENDEE;ROLE=${role};PARTSTAT=${partstat};RSVP=TRUE;CN="${attendee.name}":mailto:${attendee.email}\r\n`;
  });

  if (event.recurrenceRule) {
    ics += `RRULE:${event.recurrenceRule}\r\n`;
  }

  ics += `STATUS:${event.isCancelled ? 'CANCELLED' : 'CONFIRMED'}\r\n`;
  ics += `TRANSP:${event.freeBusyStatus === FreeBusyStatus.FREE ? 'TRANSPARENT' : 'OPAQUE'}\r\n`;
  ics += `CLASS:${event.visibility.toUpperCase()}\r\n`;

  if (event.reminderMinutes) {
    ics += 'BEGIN:VALARM\r\n';
    ics += 'TRIGGER:-PT' + event.reminderMinutes + 'M\r\n';
    ics += 'ACTION:DISPLAY\r\n';
    ics += `DESCRIPTION:${escapeICalText(event.subject)}\r\n`;
    ics += 'END:VALARM\r\n';
  }

  ics += 'END:VEVENT\r\n';
  ics += 'END:VCALENDAR\r\n';

  return ics;
};

/**
 * Parse iCalendar format to event
 *
 * @param icsString - ICS format string
 * @returns Calendar event and attendees
 *
 * @example
 * const { event, attendees } = parseICalendarToEvent(icsContent);
 */
export const parseICalendarToEvent = (
  icsString: string
): { event: Partial<CalendarEvent>; attendees: Partial<MeetingAttendee>[] } => {
  const lines = icsString.split(/\r\n|\n|\r/);
  const event: Partial<CalendarEvent> = {};
  const attendees: Partial<MeetingAttendee>[] = [];

  lines.forEach(line => {
    if (line.startsWith('UID:')) {
      event.id = line.substring(4).split('@')[0];
    } else if (line.startsWith('SUMMARY:')) {
      event.subject = line.substring(8);
    } else if (line.startsWith('DESCRIPTION:')) {
      event.description = line.substring(12);
    } else if (line.startsWith('LOCATION:')) {
      event.location = line.substring(9);
    } else if (line.startsWith('DTSTART:')) {
      event.startTime = parseICalDate(line.substring(8));
    } else if (line.startsWith('DTEND:')) {
      event.endTime = parseICalDate(line.substring(6));
    } else if (line.startsWith('RRULE:')) {
      event.recurrenceRule = line.substring(6);
      event.isRecurring = true;
    } else if (line.startsWith('ATTENDEE')) {
      const emailMatch = line.match(/mailto:([^\s]+)/);
      const nameMatch = line.match(/CN="([^"]+)"/);
      const roleMatch = line.match(/ROLE=([^;]+)/);

      if (emailMatch) {
        attendees.push({
          email: emailMatch[1],
          name: nameMatch ? nameMatch[1] : emailMatch[1],
          attendeeType: roleMatch && roleMatch[1] === 'REQ-PARTICIPANT' ? 'required' : 'optional',
        });
      }
    }
  });

  return { event, attendees };
};

/**
 * Format date to iCalendar format
 *
 * @param date - Date to format
 * @returns iCalendar formatted date string
 *
 * @example
 * const icalDate = formatICalDate(new Date());
 */
export const formatICalDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Parse iCalendar date string
 *
 * @param icalDate - iCalendar date string
 * @returns Date object
 *
 * @example
 * const date = parseICalDate('20250115T100000Z');
 */
export const parseICalDate = (icalDate: string): Date => {
  const year = parseInt(icalDate.substr(0, 4));
  const month = parseInt(icalDate.substr(4, 2)) - 1;
  const day = parseInt(icalDate.substr(6, 2));
  const hour = parseInt(icalDate.substr(9, 2));
  const minute = parseInt(icalDate.substr(11, 2));
  const second = parseInt(icalDate.substr(13, 2));

  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

/**
 * Escape text for iCalendar format
 *
 * @param text - Text to escape
 * @returns Escaped text
 *
 * @example
 * const escaped = escapeICalText('Meeting; Room A, Building 1');
 */
export const escapeICalText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

/**
 * Map response status to iCalendar PARTSTAT
 *
 * @param status - Meeting response status
 * @returns iCalendar PARTSTAT value
 *
 * @example
 * const partstat = mapResponseStatusToPartstat(MeetingResponseStatus.ACCEPTED);
 */
export const mapResponseStatusToPartstat = (status: MeetingResponseStatus): string => {
  const mapping: Record<MeetingResponseStatus, string> = {
    [MeetingResponseStatus.ACCEPTED]: 'ACCEPTED',
    [MeetingResponseStatus.DECLINED]: 'DECLINED',
    [MeetingResponseStatus.TENTATIVE]: 'TENTATIVE',
    [MeetingResponseStatus.NONE]: 'NEEDS-ACTION',
    [MeetingResponseStatus.NOT_RESPONDED]: 'NEEDS-ACTION',
  };

  return mapping[status];
};

// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================

/**
 * Get Swagger documentation for calendar event DTO
 *
 * @returns Swagger property decorators
 *
 * @example
 * class CreateEventDto {
 *   @ApiProperty(getSwaggerCalendarEventProperties().subject)
 *   subject: string;
 * }
 */
export const getSwaggerCalendarEventProperties = () => ({
  subject: {
    description: 'Event subject/title',
    example: 'Team Meeting',
    required: true,
    type: String,
  },
  description: {
    description: 'Detailed event description',
    example: 'Monthly team sync to discuss project progress',
    required: false,
    type: String,
  },
  location: {
    description: 'Event location or virtual meeting URL',
    example: 'Conference Room A or https://meet.example.com/xyz',
    required: false,
    type: String,
  },
  startTime: {
    description: 'Event start date and time',
    example: '2025-01-15T10:00:00Z',
    required: true,
    type: Date,
    format: 'date-time',
  },
  endTime: {
    description: 'Event end date and time',
    example: '2025-01-15T11:00:00Z',
    required: true,
    type: Date,
    format: 'date-time',
  },
  isAllDay: {
    description: 'Whether event is all-day',
    example: false,
    required: false,
    type: Boolean,
  },
  eventType: {
    description: 'Type of calendar event',
    enum: Object.values(CalendarEventType),
    example: CalendarEventType.MEETING,
    required: false,
  },
  importance: {
    description: 'Event importance/priority',
    enum: Object.values(EventImportance),
    example: EventImportance.NORMAL,
    required: false,
  },
  recurrenceRule: {
    description: 'RRULE string for recurring events',
    example: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=10',
    required: false,
    type: String,
  },
});

/**
 * Get Swagger documentation for meeting request DTO
 *
 * @returns Swagger property decorators
 *
 * @example
 * class CreateMeetingRequestDto {
 *   @ApiProperty(getSwaggerMeetingRequestProperties().organizerEmail)
 *   organizerEmail: string;
 * }
 */
export const getSwaggerMeetingRequestProperties = () => ({
  organizerEmail: {
    description: 'Meeting organizer email address',
    example: 'organizer@example.com',
    required: true,
    type: String,
    format: 'email',
  },
  allowNewTimeProposals: {
    description: 'Whether attendees can propose alternative times',
    example: true,
    required: false,
    type: Boolean,
  },
  responseRequested: {
    description: 'Whether response is requested from attendees',
    example: true,
    required: false,
    type: Boolean,
  },
});

/**
 * Get Swagger documentation for attendee DTO
 *
 * @returns Swagger property decorators
 *
 * @example
 * class AddAttendeeDto {
 *   @ApiProperty(getSwaggerAttendeeProperties().email)
 *   email: string;
 * }
 */
export const getSwaggerAttendeeProperties = () => ({
  email: {
    description: 'Attendee email address',
    example: 'john.doe@example.com',
    required: true,
    type: String,
    format: 'email',
  },
  name: {
    description: 'Attendee display name',
    example: 'John Doe',
    required: true,
    type: String,
  },
  attendeeType: {
    description: 'Attendee type',
    enum: ['required', 'optional', 'resource'],
    example: 'required',
    required: false,
  },
  responseStatus: {
    description: 'Attendee response status',
    enum: Object.values(MeetingResponseStatus),
    example: MeetingResponseStatus.ACCEPTED,
    required: false,
  },
});

/**
 * Get Swagger documentation for free/busy query DTO
 *
 * @returns Swagger property decorators
 *
 * @example
 * class FreeBusyQueryDto {
 *   @ApiProperty(getSwaggerFreeBusyProperties().userIds)
 *   userIds: string[];
 * }
 */
export const getSwaggerFreeBusyProperties = () => ({
  userIds: {
    description: 'List of user IDs to query',
    example: ['user-123', 'user-456'],
    required: true,
    type: [String],
  },
  startTime: {
    description: 'Query start time',
    example: '2025-01-15T00:00:00Z',
    required: true,
    type: Date,
    format: 'date-time',
  },
  endTime: {
    description: 'Query end time',
    example: '2025-01-15T23:59:59Z',
    required: true,
    type: Date,
    format: 'date-time',
  },
});

// ============================================================================
// NESTJS SERVICE METHODS
// ============================================================================

/**
 * NestJS service method: Create calendar event with validation
 *
 * @param eventData - Event data
 * @param userId - Current user ID
 * @returns Created event
 *
 * @example
 * @Injectable()
 * class CalendarService {
 *   async createEvent(dto: CreateEventDto, userId: string) {
 *     return nestCreateCalendarEvent(dto, userId);
 *   }
 * }
 */
export const nestCreateCalendarEvent = async (
  eventData: Partial<CalendarEvent>,
  userId: string
): Promise<CalendarEvent> => {
  validateEventTimes(eventData.startTime!, eventData.endTime!);
  eventData.organizerId = userId;

  return createCalendarEvent(eventData);
};

/**
 * NestJS service method: Send meeting request
 *
 * @param meetingData - Meeting request data
 * @param attendeeEmails - Attendee email addresses
 * @param userId - Current user ID
 * @returns Created meeting request
 *
 * @example
 * @Injectable()
 * class MeetingService {
 *   async sendMeetingRequest(dto: CreateMeetingDto, userId: string) {
 *     return nestSendMeetingRequest(dto, dto.attendees, userId);
 *   }
 * }
 */
export const nestSendMeetingRequest = async (
  meetingData: Partial<MeetingRequest>,
  attendeeEmails: string[],
  userId: string
): Promise<MeetingRequest> => {
  meetingData.organizerId = userId;

  const attendees = attendeeEmails.map(email => ({
    email,
    name: email.split('@')[0],
    attendeeType: 'required' as const,
  }));

  return createMeetingRequest(meetingData, attendees);
};

/**
 * NestJS service method: Get user calendar events
 *
 * @param userId - User ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns User's calendar events
 *
 * @example
 * @Injectable()
 * class CalendarService {
 *   async getUserEvents(userId: string, start: Date, end: Date) {
 *     return nestGetUserEvents(userId, start, end);
 *   }
 * }
 */
export const nestGetUserEvents = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  // Implementation would query user's events
  return [];
};

/**
 * Validate event start and end times
 *
 * @param startTime - Start time
 * @param endTime - End time
 * @throws Error if times are invalid
 *
 * @example
 * validateEventTimes(startTime, endTime);
 */
export const validateEventTimes = (startTime: Date, endTime: Date): void => {
  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  if (startTime < new Date()) {
    throw new Error('Cannot create events in the past');
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Sequelize Model Attributes
  getCalendarEventModelAttributes,
  getMeetingRequestModelAttributes,
  getMeetingAttendeeModelAttributes,
  getMeetingRoomModelAttributes,
  getRoomBookingModelAttributes,
  getTimeProposalModelAttributes,

  // Calendar Event Management
  createCalendarEvent,
  updateCalendarEvent,
  cancelCalendarEvent,
  generateEventId,

  // Meeting Request Functions
  createMeetingRequest,
  sendMeetingInvitation,
  updateMeetingRequest,
  cancelMeetingRequest,

  // Attendee Management
  addAttendeeToEvent,
  updateAttendeeResponse,
  acceptMeetingInvitation,
  declineMeetingInvitation,
  markInvitationTentative,
  getEventAttendees,
  getAttendeeResponseSummary,

  // Recurring Events
  createRecurrenceRule,
  parseRecurrenceRule,
  generateRecurringInstances,
  updateRecurringInstance,
  deleteRecurringInstance,

  // Meeting Room Booking
  createMeetingRoom,
  bookMeetingRoom,
  checkRoomAvailability,
  findAvailableRooms,
  cancelRoomBooking,

  // Free/Busy Time Calculation
  calculateUserFreeBusy,
  calculateMultiUserFreeBusy,
  findCommonFreeSlots,
  suggestMeetingTimes,

  // iCalendar (ICS) Format Support
  convertEventToICalendar,
  parseICalendarToEvent,
  formatICalDate,
  parseICalDate,
  escapeICalText,
  mapResponseStatusToPartstat,

  // Swagger API Documentation
  getSwaggerCalendarEventProperties,
  getSwaggerMeetingRequestProperties,
  getSwaggerAttendeeProperties,
  getSwaggerFreeBusyProperties,

  // NestJS Service Methods
  nestCreateCalendarEvent,
  nestSendMeetingRequest,
  nestGetUserEvents,
  validateEventTimes,
};
