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
import { ModelAttributes, Transaction } from 'sequelize';
/**
 * Calendar event type enumeration
 */
export declare enum CalendarEventType {
    MEETING = "meeting",
    APPOINTMENT = "appointment",
    REMINDER = "reminder",
    ALL_DAY_EVENT = "all_day_event",
    OUT_OF_OFFICE = "out_of_office",
    WORKING_ELSEWHERE = "working_elsewhere",
    BLOCKED_TIME = "blocked_time"
}
/**
 * Meeting response status
 */
export declare enum MeetingResponseStatus {
    ACCEPTED = "accepted",
    DECLINED = "declined",
    TENTATIVE = "tentative",
    NONE = "none",
    NOT_RESPONDED = "not_responded"
}
/**
 * Event recurrence frequency
 */
export declare enum RecurrenceFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}
/**
 * Calendar event priority/importance
 */
export declare enum EventImportance {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high"
}
/**
 * Free/Busy status
 */
export declare enum FreeBusyStatus {
    FREE = "free",
    TENTATIVE = "tentative",
    BUSY = "busy",
    OUT_OF_OFFICE = "out_of_office",
    WORKING_ELSEWHERE = "working_elsewhere"
}
/**
 * Calendar event visibility
 */
export declare enum EventVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    CONFIDENTIAL = "confidential"
}
/**
 * Meeting room booking status
 */
export declare enum RoomBookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    DECLINED = "declined"
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
/**
 * Get Sequelize model attributes for CalendarEvent
 *
 * @returns ModelAttributes for CalendarEvent table
 *
 * @example
 * const CalendarEvent = sequelize.define('CalendarEvent', getCalendarEventModelAttributes());
 */
export declare const getCalendarEventModelAttributes: () => ModelAttributes;
/**
 * Get Sequelize model attributes for MeetingRequest
 *
 * @returns ModelAttributes for MeetingRequest table
 *
 * @example
 * const MeetingRequest = sequelize.define('MeetingRequest', getMeetingRequestModelAttributes());
 */
export declare const getMeetingRequestModelAttributes: () => ModelAttributes;
/**
 * Get Sequelize model attributes for MeetingAttendee
 *
 * @returns ModelAttributes for MeetingAttendee table
 *
 * @example
 * const MeetingAttendee = sequelize.define('MeetingAttendee', getMeetingAttendeeModelAttributes());
 */
export declare const getMeetingAttendeeModelAttributes: () => ModelAttributes;
/**
 * Get Sequelize model attributes for MeetingRoom
 *
 * @returns ModelAttributes for MeetingRoom table
 *
 * @example
 * const MeetingRoom = sequelize.define('MeetingRoom', getMeetingRoomModelAttributes());
 */
export declare const getMeetingRoomModelAttributes: () => ModelAttributes;
/**
 * Get Sequelize model attributes for RoomBooking
 *
 * @returns ModelAttributes for RoomBooking table
 *
 * @example
 * const RoomBooking = sequelize.define('RoomBooking', getRoomBookingModelAttributes());
 */
export declare const getRoomBookingModelAttributes: () => ModelAttributes;
/**
 * Get Sequelize model attributes for TimeProposal
 *
 * @returns ModelAttributes for TimeProposal table
 *
 * @example
 * const TimeProposal = sequelize.define('TimeProposal', getTimeProposalModelAttributes());
 */
export declare const getTimeProposalModelAttributes: () => ModelAttributes;
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
export declare const createCalendarEvent: (eventData: Partial<CalendarEvent>, transaction?: Transaction) => Promise<CalendarEvent>;
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
export declare const updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>, transaction?: Transaction) => Promise<CalendarEvent>;
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
export declare const cancelCalendarEvent: (eventId: string, sendCancellation?: boolean, transaction?: Transaction) => Promise<CalendarEvent>;
/**
 * Generate unique event ID
 *
 * @returns Unique event identifier
 *
 * @example
 * const eventId = generateEventId();
 */
export declare const generateEventId: () => string;
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
export declare const createMeetingRequest: (meetingData: Partial<MeetingRequest>, attendees: Partial<MeetingAttendee>[], transaction?: Transaction) => Promise<MeetingRequest>;
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
export declare const sendMeetingInvitation: (meetingRequest: MeetingRequest, attendees: MeetingAttendee[]) => Promise<boolean>;
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
export declare const updateMeetingRequest: (meetingRequestId: string, updates: Partial<MeetingRequest>, transaction?: Transaction) => Promise<MeetingRequest>;
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
export declare const cancelMeetingRequest: (meetingRequestId: string, cancellationMessage?: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const addAttendeeToEvent: (eventId: string, attendeeData: Partial<MeetingAttendee>, transaction?: Transaction) => Promise<MeetingAttendee>;
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
export declare const updateAttendeeResponse: (attendeeId: string, responseStatus: MeetingResponseStatus, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
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
export declare const acceptMeetingInvitation: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
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
export declare const declineMeetingInvitation: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
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
export declare const markInvitationTentative: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
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
export declare const getEventAttendees: (eventId: string, filters?: Partial<MeetingAttendee>) => Promise<MeetingAttendee[]>;
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
export declare const getAttendeeResponseSummary: (eventId: string) => Promise<Record<MeetingResponseStatus, number>>;
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
export declare const createRecurrenceRule: (pattern: RecurrencePattern) => string;
/**
 * Parse recurrence rule string
 *
 * @param rruleString - RRULE string
 * @returns Recurrence pattern object
 *
 * @example
 * const pattern = parseRecurrenceRule('FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=10');
 */
export declare const parseRecurrenceRule: (rruleString: string) => RecurrencePattern;
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
export declare const generateRecurringInstances: (baseEvent: CalendarEvent, startDate: Date, endDate: Date) => Promise<CalendarEvent[]>;
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
export declare const updateRecurringInstance: (instanceId: string, updates: Partial<CalendarEvent>, updateScope?: "this" | "future" | "all", transaction?: Transaction) => Promise<CalendarEvent[]>;
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
export declare const deleteRecurringInstance: (instanceId: string, deleteScope?: "this" | "future" | "all", transaction?: Transaction) => Promise<boolean>;
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
export declare const createMeetingRoom: (roomData: Partial<MeetingRoom>, transaction?: Transaction) => Promise<MeetingRoom>;
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
export declare const bookMeetingRoom: (bookingData: Partial<RoomBooking>, transaction?: Transaction) => Promise<RoomBooking>;
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
export declare const checkRoomAvailability: (roomId: string, startTime: Date, endTime: Date) => Promise<boolean>;
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
export declare const findAvailableRooms: (startTime: Date, endTime: Date, criteria?: {
    minCapacity?: number;
    equipment?: string[];
    building?: string;
    floor?: string;
}) => Promise<MeetingRoom[]>;
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
export declare const cancelRoomBooking: (bookingId: string, transaction?: Transaction) => Promise<RoomBooking>;
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
export declare const calculateUserFreeBusy: (userId: string, startTime: Date, endTime: Date) => Promise<FreeBusySlot[]>;
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
export declare const calculateMultiUserFreeBusy: (query: FreeBusyQuery) => Promise<FreeBusyResponse[]>;
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
export declare const findCommonFreeSlots: (userIds: string[], startTime: Date, endTime: Date, duration: number) => Promise<Array<{
    startTime: Date;
    endTime: Date;
}>>;
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
export declare const suggestMeetingTimes: (userIds: string[], duration: number, options?: {
    daysAhead?: number;
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
    workingDaysOnly?: boolean;
}) => Promise<Array<{
    startTime: Date;
    endTime: Date;
    score: number;
}>>;
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
export declare const convertEventToICalendar: (event: CalendarEvent, attendees: MeetingAttendee[], organizerEmail: string) => string;
/**
 * Parse iCalendar format to event
 *
 * @param icsString - ICS format string
 * @returns Calendar event and attendees
 *
 * @example
 * const { event, attendees } = parseICalendarToEvent(icsContent);
 */
export declare const parseICalendarToEvent: (icsString: string) => {
    event: Partial<CalendarEvent>;
    attendees: Partial<MeetingAttendee>[];
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
export declare const formatICalDate: (date: Date) => string;
/**
 * Parse iCalendar date string
 *
 * @param icalDate - iCalendar date string
 * @returns Date object
 *
 * @example
 * const date = parseICalDate('20250115T100000Z');
 */
export declare const parseICalDate: (icalDate: string) => Date;
/**
 * Escape text for iCalendar format
 *
 * @param text - Text to escape
 * @returns Escaped text
 *
 * @example
 * const escaped = escapeICalText('Meeting; Room A, Building 1');
 */
export declare const escapeICalText: (text: string) => string;
/**
 * Map response status to iCalendar PARTSTAT
 *
 * @param status - Meeting response status
 * @returns iCalendar PARTSTAT value
 *
 * @example
 * const partstat = mapResponseStatusToPartstat(MeetingResponseStatus.ACCEPTED);
 */
export declare const mapResponseStatusToPartstat: (status: MeetingResponseStatus) => string;
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
export declare const getSwaggerCalendarEventProperties: () => {
    subject: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
    };
    description: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
    };
    location: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
    };
    startTime: {
        description: string;
        example: string;
        required: boolean;
        type: DateConstructor;
        format: string;
    };
    endTime: {
        description: string;
        example: string;
        required: boolean;
        type: DateConstructor;
        format: string;
    };
    isAllDay: {
        description: string;
        example: boolean;
        required: boolean;
        type: BooleanConstructor;
    };
    eventType: {
        description: string;
        enum: CalendarEventType[];
        example: CalendarEventType;
        required: boolean;
    };
    importance: {
        description: string;
        enum: EventImportance[];
        example: EventImportance;
        required: boolean;
    };
    recurrenceRule: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
    };
};
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
export declare const getSwaggerMeetingRequestProperties: () => {
    organizerEmail: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
        format: string;
    };
    allowNewTimeProposals: {
        description: string;
        example: boolean;
        required: boolean;
        type: BooleanConstructor;
    };
    responseRequested: {
        description: string;
        example: boolean;
        required: boolean;
        type: BooleanConstructor;
    };
};
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
export declare const getSwaggerAttendeeProperties: () => {
    email: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
        format: string;
    };
    name: {
        description: string;
        example: string;
        required: boolean;
        type: StringConstructor;
    };
    attendeeType: {
        description: string;
        enum: string[];
        example: string;
        required: boolean;
    };
    responseStatus: {
        description: string;
        enum: MeetingResponseStatus[];
        example: MeetingResponseStatus;
        required: boolean;
    };
};
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
export declare const getSwaggerFreeBusyProperties: () => {
    userIds: {
        description: string;
        example: string[];
        required: boolean;
        type: StringConstructor[];
    };
    startTime: {
        description: string;
        example: string;
        required: boolean;
        type: DateConstructor;
        format: string;
    };
    endTime: {
        description: string;
        example: string;
        required: boolean;
        type: DateConstructor;
        format: string;
    };
};
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
export declare const nestCreateCalendarEvent: (eventData: Partial<CalendarEvent>, userId: string) => Promise<CalendarEvent>;
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
export declare const nestSendMeetingRequest: (meetingData: Partial<MeetingRequest>, attendeeEmails: string[], userId: string) => Promise<MeetingRequest>;
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
export declare const nestGetUserEvents: (userId: string, startDate: Date, endDate: Date) => Promise<CalendarEvent[]>;
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
export declare const validateEventTimes: (startTime: Date, endTime: Date) => void;
declare const _default: {
    getCalendarEventModelAttributes: () => ModelAttributes;
    getMeetingRequestModelAttributes: () => ModelAttributes;
    getMeetingAttendeeModelAttributes: () => ModelAttributes;
    getMeetingRoomModelAttributes: () => ModelAttributes;
    getRoomBookingModelAttributes: () => ModelAttributes;
    getTimeProposalModelAttributes: () => ModelAttributes;
    createCalendarEvent: (eventData: Partial<CalendarEvent>, transaction?: Transaction) => Promise<CalendarEvent>;
    updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>, transaction?: Transaction) => Promise<CalendarEvent>;
    cancelCalendarEvent: (eventId: string, sendCancellation?: boolean, transaction?: Transaction) => Promise<CalendarEvent>;
    generateEventId: () => string;
    createMeetingRequest: (meetingData: Partial<MeetingRequest>, attendees: Partial<MeetingAttendee>[], transaction?: Transaction) => Promise<MeetingRequest>;
    sendMeetingInvitation: (meetingRequest: MeetingRequest, attendees: MeetingAttendee[]) => Promise<boolean>;
    updateMeetingRequest: (meetingRequestId: string, updates: Partial<MeetingRequest>, transaction?: Transaction) => Promise<MeetingRequest>;
    cancelMeetingRequest: (meetingRequestId: string, cancellationMessage?: string, transaction?: Transaction) => Promise<boolean>;
    addAttendeeToEvent: (eventId: string, attendeeData: Partial<MeetingAttendee>, transaction?: Transaction) => Promise<MeetingAttendee>;
    updateAttendeeResponse: (attendeeId: string, responseStatus: MeetingResponseStatus, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
    acceptMeetingInvitation: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
    declineMeetingInvitation: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
    markInvitationTentative: (eventId: string, attendeeId: string, comment?: string, transaction?: Transaction) => Promise<MeetingAttendee>;
    getEventAttendees: (eventId: string, filters?: Partial<MeetingAttendee>) => Promise<MeetingAttendee[]>;
    getAttendeeResponseSummary: (eventId: string) => Promise<Record<MeetingResponseStatus, number>>;
    createRecurrenceRule: (pattern: RecurrencePattern) => string;
    parseRecurrenceRule: (rruleString: string) => RecurrencePattern;
    generateRecurringInstances: (baseEvent: CalendarEvent, startDate: Date, endDate: Date) => Promise<CalendarEvent[]>;
    updateRecurringInstance: (instanceId: string, updates: Partial<CalendarEvent>, updateScope?: "this" | "future" | "all", transaction?: Transaction) => Promise<CalendarEvent[]>;
    deleteRecurringInstance: (instanceId: string, deleteScope?: "this" | "future" | "all", transaction?: Transaction) => Promise<boolean>;
    createMeetingRoom: (roomData: Partial<MeetingRoom>, transaction?: Transaction) => Promise<MeetingRoom>;
    bookMeetingRoom: (bookingData: Partial<RoomBooking>, transaction?: Transaction) => Promise<RoomBooking>;
    checkRoomAvailability: (roomId: string, startTime: Date, endTime: Date) => Promise<boolean>;
    findAvailableRooms: (startTime: Date, endTime: Date, criteria?: {
        minCapacity?: number;
        equipment?: string[];
        building?: string;
        floor?: string;
    }) => Promise<MeetingRoom[]>;
    cancelRoomBooking: (bookingId: string, transaction?: Transaction) => Promise<RoomBooking>;
    calculateUserFreeBusy: (userId: string, startTime: Date, endTime: Date) => Promise<FreeBusySlot[]>;
    calculateMultiUserFreeBusy: (query: FreeBusyQuery) => Promise<FreeBusyResponse[]>;
    findCommonFreeSlots: (userIds: string[], startTime: Date, endTime: Date, duration: number) => Promise<Array<{
        startTime: Date;
        endTime: Date;
    }>>;
    suggestMeetingTimes: (userIds: string[], duration: number, options?: {
        daysAhead?: number;
        preferredTimeStart?: string;
        preferredTimeEnd?: string;
        workingDaysOnly?: boolean;
    }) => Promise<Array<{
        startTime: Date;
        endTime: Date;
        score: number;
    }>>;
    convertEventToICalendar: (event: CalendarEvent, attendees: MeetingAttendee[], organizerEmail: string) => string;
    parseICalendarToEvent: (icsString: string) => {
        event: Partial<CalendarEvent>;
        attendees: Partial<MeetingAttendee>[];
    };
    formatICalDate: (date: Date) => string;
    parseICalDate: (icalDate: string) => Date;
    escapeICalText: (text: string) => string;
    mapResponseStatusToPartstat: (status: MeetingResponseStatus) => string;
    getSwaggerCalendarEventProperties: () => {
        subject: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
        };
        description: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
        };
        location: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
        };
        startTime: {
            description: string;
            example: string;
            required: boolean;
            type: DateConstructor;
            format: string;
        };
        endTime: {
            description: string;
            example: string;
            required: boolean;
            type: DateConstructor;
            format: string;
        };
        isAllDay: {
            description: string;
            example: boolean;
            required: boolean;
            type: BooleanConstructor;
        };
        eventType: {
            description: string;
            enum: CalendarEventType[];
            example: CalendarEventType;
            required: boolean;
        };
        importance: {
            description: string;
            enum: EventImportance[];
            example: EventImportance;
            required: boolean;
        };
        recurrenceRule: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
        };
    };
    getSwaggerMeetingRequestProperties: () => {
        organizerEmail: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
            format: string;
        };
        allowNewTimeProposals: {
            description: string;
            example: boolean;
            required: boolean;
            type: BooleanConstructor;
        };
        responseRequested: {
            description: string;
            example: boolean;
            required: boolean;
            type: BooleanConstructor;
        };
    };
    getSwaggerAttendeeProperties: () => {
        email: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
            format: string;
        };
        name: {
            description: string;
            example: string;
            required: boolean;
            type: StringConstructor;
        };
        attendeeType: {
            description: string;
            enum: string[];
            example: string;
            required: boolean;
        };
        responseStatus: {
            description: string;
            enum: MeetingResponseStatus[];
            example: MeetingResponseStatus;
            required: boolean;
        };
    };
    getSwaggerFreeBusyProperties: () => {
        userIds: {
            description: string;
            example: string[];
            required: boolean;
            type: StringConstructor[];
        };
        startTime: {
            description: string;
            example: string;
            required: boolean;
            type: DateConstructor;
            format: string;
        };
        endTime: {
            description: string;
            example: string;
            required: boolean;
            type: DateConstructor;
            format: string;
        };
    };
    nestCreateCalendarEvent: (eventData: Partial<CalendarEvent>, userId: string) => Promise<CalendarEvent>;
    nestSendMeetingRequest: (meetingData: Partial<MeetingRequest>, attendeeEmails: string[], userId: string) => Promise<MeetingRequest>;
    nestGetUserEvents: (userId: string, startDate: Date, endDate: Date) => Promise<CalendarEvent[]>;
    validateEventTimes: (startTime: Date, endTime: Date) => void;
};
export default _default;
//# sourceMappingURL=mail-calendar-integration-kit.d.ts.map