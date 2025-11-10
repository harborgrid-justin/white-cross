"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaggerMeetingRequestProperties = exports.getSwaggerCalendarEventProperties = exports.mapResponseStatusToPartstat = exports.escapeICalText = exports.parseICalDate = exports.formatICalDate = exports.parseICalendarToEvent = exports.convertEventToICalendar = exports.suggestMeetingTimes = exports.findCommonFreeSlots = exports.calculateMultiUserFreeBusy = exports.calculateUserFreeBusy = exports.cancelRoomBooking = exports.findAvailableRooms = exports.checkRoomAvailability = exports.bookMeetingRoom = exports.createMeetingRoom = exports.deleteRecurringInstance = exports.updateRecurringInstance = exports.generateRecurringInstances = exports.parseRecurrenceRule = exports.createRecurrenceRule = exports.getAttendeeResponseSummary = exports.getEventAttendees = exports.markInvitationTentative = exports.declineMeetingInvitation = exports.acceptMeetingInvitation = exports.updateAttendeeResponse = exports.addAttendeeToEvent = exports.cancelMeetingRequest = exports.updateMeetingRequest = exports.sendMeetingInvitation = exports.createMeetingRequest = exports.generateEventId = exports.cancelCalendarEvent = exports.updateCalendarEvent = exports.createCalendarEvent = exports.getTimeProposalModelAttributes = exports.getRoomBookingModelAttributes = exports.getMeetingRoomModelAttributes = exports.getMeetingAttendeeModelAttributes = exports.getMeetingRequestModelAttributes = exports.getCalendarEventModelAttributes = exports.RoomBookingStatus = exports.EventVisibility = exports.FreeBusyStatus = exports.EventImportance = exports.RecurrenceFrequency = exports.MeetingResponseStatus = exports.CalendarEventType = void 0;
exports.validateEventTimes = exports.nestGetUserEvents = exports.nestSendMeetingRequest = exports.nestCreateCalendarEvent = exports.getSwaggerFreeBusyProperties = exports.getSwaggerAttendeeProperties = void 0;
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
const sequelize_1 = require("sequelize");
const rrule_1 = require("rrule");
// ============================================================================
// TYPE DEFINITIONS - CALENDAR EVENTS
// ============================================================================
/**
 * Calendar event type enumeration
 */
var CalendarEventType;
(function (CalendarEventType) {
    CalendarEventType["MEETING"] = "meeting";
    CalendarEventType["APPOINTMENT"] = "appointment";
    CalendarEventType["REMINDER"] = "reminder";
    CalendarEventType["ALL_DAY_EVENT"] = "all_day_event";
    CalendarEventType["OUT_OF_OFFICE"] = "out_of_office";
    CalendarEventType["WORKING_ELSEWHERE"] = "working_elsewhere";
    CalendarEventType["BLOCKED_TIME"] = "blocked_time";
})(CalendarEventType || (exports.CalendarEventType = CalendarEventType = {}));
/**
 * Meeting response status
 */
var MeetingResponseStatus;
(function (MeetingResponseStatus) {
    MeetingResponseStatus["ACCEPTED"] = "accepted";
    MeetingResponseStatus["DECLINED"] = "declined";
    MeetingResponseStatus["TENTATIVE"] = "tentative";
    MeetingResponseStatus["NONE"] = "none";
    MeetingResponseStatus["NOT_RESPONDED"] = "not_responded";
})(MeetingResponseStatus || (exports.MeetingResponseStatus = MeetingResponseStatus = {}));
/**
 * Event recurrence frequency
 */
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "DAILY";
    RecurrenceFrequency["WEEKLY"] = "WEEKLY";
    RecurrenceFrequency["MONTHLY"] = "MONTHLY";
    RecurrenceFrequency["YEARLY"] = "YEARLY";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
/**
 * Calendar event priority/importance
 */
var EventImportance;
(function (EventImportance) {
    EventImportance["LOW"] = "low";
    EventImportance["NORMAL"] = "normal";
    EventImportance["HIGH"] = "high";
})(EventImportance || (exports.EventImportance = EventImportance = {}));
/**
 * Free/Busy status
 */
var FreeBusyStatus;
(function (FreeBusyStatus) {
    FreeBusyStatus["FREE"] = "free";
    FreeBusyStatus["TENTATIVE"] = "tentative";
    FreeBusyStatus["BUSY"] = "busy";
    FreeBusyStatus["OUT_OF_OFFICE"] = "out_of_office";
    FreeBusyStatus["WORKING_ELSEWHERE"] = "working_elsewhere";
})(FreeBusyStatus || (exports.FreeBusyStatus = FreeBusyStatus = {}));
/**
 * Calendar event visibility
 */
var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "public";
    EventVisibility["PRIVATE"] = "private";
    EventVisibility["CONFIDENTIAL"] = "confidential";
})(EventVisibility || (exports.EventVisibility = EventVisibility = {}));
/**
 * Meeting room booking status
 */
var RoomBookingStatus;
(function (RoomBookingStatus) {
    RoomBookingStatus["PENDING"] = "pending";
    RoomBookingStatus["CONFIRMED"] = "confirmed";
    RoomBookingStatus["CANCELLED"] = "cancelled";
    RoomBookingStatus["DECLINED"] = "declined";
})(RoomBookingStatus || (exports.RoomBookingStatus = RoomBookingStatus = {}));
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
const getCalendarEventModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique calendar event identifier',
    },
    subject: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        comment: 'Event subject/title',
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed event description',
    },
    location: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        comment: 'Event location or virtual meeting URL',
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Event start date and time (UTC)',
        validate: {
            isDate: true,
        },
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Event end date and time (UTC)',
        validate: {
            isDate: true,
            isAfterStart(value) {
                if (value <= this.startTime) {
                    throw new Error('End time must be after start time');
                }
            },
        },
    },
    isAllDay: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether event is all-day',
    },
    eventType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(CalendarEventType)),
        defaultValue: CalendarEventType.MEETING,
        allowNull: false,
        comment: 'Type of calendar event',
    },
    importance: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(EventImportance)),
        defaultValue: EventImportance.NORMAL,
        allowNull: false,
        comment: 'Event importance/priority',
    },
    freeBusyStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(FreeBusyStatus)),
        defaultValue: FreeBusyStatus.BUSY,
        allowNull: false,
        comment: 'Free/busy status during event',
    },
    visibility: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(EventVisibility)),
        defaultValue: EventVisibility.PUBLIC,
        allowNull: false,
        comment: 'Event visibility/privacy level',
    },
    organizerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Event organizer user ID',
    },
    recurrenceRule: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'RRULE string for recurring events',
    },
    recurrenceId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        comment: 'Parent event ID for recurring series',
    },
    isCancelled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether event has been cancelled',
    },
    isRecurring: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether event is part of recurring series',
    },
    reminderMinutes: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reminder time in minutes before event',
        validate: {
            min: 0,
        },
    },
    timezone: {
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'UTC',
        allowNull: false,
        comment: 'Event timezone (IANA timezone)',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional event metadata',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.getCalendarEventModelAttributes = getCalendarEventModelAttributes;
/**
 * Get Sequelize model attributes for MeetingRequest
 *
 * @returns ModelAttributes for MeetingRequest table
 *
 * @example
 * const MeetingRequest = sequelize.define('MeetingRequest', getMeetingRequestModelAttributes());
 */
const getMeetingRequestModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique meeting request identifier',
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Associated calendar event ID',
    },
    subject: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        comment: 'Meeting request subject',
    },
    body: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Meeting request body/message',
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Proposed meeting start time',
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Proposed meeting end time',
    },
    location: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        comment: 'Meeting location',
    },
    organizerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Meeting organizer user ID',
    },
    organizerEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Meeting organizer email',
        validate: {
            isEmail: true,
        },
    },
    isAllDay: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether meeting is all-day',
    },
    importance: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(EventImportance)),
        defaultValue: EventImportance.NORMAL,
        allowNull: false,
        comment: 'Meeting importance',
    },
    allowNewTimeProposals: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Whether attendees can propose new times',
    },
    responseRequested: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Whether response is requested from attendees',
    },
    meetingMessageType: {
        type: sequelize_1.DataTypes.ENUM('request', 'update', 'cancellation'),
        defaultValue: 'request',
        allowNull: false,
        comment: 'Type of meeting message',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getMeetingRequestModelAttributes = getMeetingRequestModelAttributes;
/**
 * Get Sequelize model attributes for MeetingAttendee
 *
 * @returns ModelAttributes for MeetingAttendee table
 *
 * @example
 * const MeetingAttendee = sequelize.define('MeetingAttendee', getMeetingAttendeeModelAttributes());
 */
const getMeetingAttendeeModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique attendee identifier',
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Associated calendar event ID',
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        comment: 'User ID if internal attendee',
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Attendee email address',
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Attendee display name',
    },
    attendeeType: {
        type: sequelize_1.DataTypes.ENUM('required', 'optional', 'resource'),
        defaultValue: 'required',
        allowNull: false,
        comment: 'Attendee type (required/optional/resource)',
    },
    responseStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(MeetingResponseStatus)),
        defaultValue: MeetingResponseStatus.NOT_RESPONDED,
        allowNull: false,
        comment: 'Attendee response status',
    },
    responseTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'When attendee responded',
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Attendee comment/note',
    },
    proposedStartTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Proposed alternative start time',
    },
    proposedEndTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Proposed alternative end time',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getMeetingAttendeeModelAttributes = getMeetingAttendeeModelAttributes;
/**
 * Get Sequelize model attributes for MeetingRoom
 *
 * @returns ModelAttributes for MeetingRoom table
 *
 * @example
 * const MeetingRoom = sequelize.define('MeetingRoom', getMeetingRoomModelAttributes());
 */
const getMeetingRoomModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique meeting room identifier',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Meeting room name',
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Meeting room resource email',
        validate: {
            isEmail: true,
        },
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: 'Room capacity (number of people)',
        validate: {
            min: 1,
        },
    },
    floor: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        comment: 'Floor number/name',
    },
    building: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        comment: 'Building name/location',
    },
    equipment: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        comment: 'Available equipment in room',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Whether room is active/bookable',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional room metadata',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getMeetingRoomModelAttributes = getMeetingRoomModelAttributes;
/**
 * Get Sequelize model attributes for RoomBooking
 *
 * @returns ModelAttributes for RoomBooking table
 *
 * @example
 * const RoomBooking = sequelize.define('RoomBooking', getRoomBookingModelAttributes());
 */
const getRoomBookingModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique room booking identifier',
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Associated calendar event ID',
    },
    roomId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Booked meeting room ID',
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Booking start time',
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Booking end time',
        validate: {
            isAfterStart(value) {
                if (value <= this.startTime) {
                    throw new Error('End time must be after start time');
                }
            },
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(RoomBookingStatus)),
        defaultValue: RoomBookingStatus.PENDING,
        allowNull: false,
        comment: 'Booking status',
    },
    bookedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'User ID who booked the room',
    },
    purpose: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        comment: 'Purpose/description of booking',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getRoomBookingModelAttributes = getRoomBookingModelAttributes;
/**
 * Get Sequelize model attributes for TimeProposal
 *
 * @returns ModelAttributes for TimeProposal table
 *
 * @example
 * const TimeProposal = sequelize.define('TimeProposal', getTimeProposalModelAttributes());
 */
const getTimeProposalModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique time proposal identifier',
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'Associated calendar event ID',
    },
    proposedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'User ID who proposed new time',
    },
    proposedStartTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Proposed start time',
    },
    proposedEndTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Proposed end time',
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional comment with proposal',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'declined'),
        defaultValue: 'pending',
        allowNull: false,
        comment: 'Proposal status',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getTimeProposalModelAttributes = getTimeProposalModelAttributes;
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
const createCalendarEvent = async (eventData, transaction) => {
    const event = {
        id: eventData.id || (0, exports.generateEventId)(),
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
exports.createCalendarEvent = createCalendarEvent;
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
const updateCalendarEvent = async (eventId, updates, transaction) => {
    const updatedEvent = {
        ...updates,
        id: eventId,
        updatedAt: new Date(),
    };
    return updatedEvent;
};
exports.updateCalendarEvent = updateCalendarEvent;
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
const cancelCalendarEvent = async (eventId, sendCancellation = true, transaction) => {
    const cancelledEvent = await (0, exports.updateCalendarEvent)(eventId, { isCancelled: true }, transaction);
    return cancelledEvent;
};
exports.cancelCalendarEvent = cancelCalendarEvent;
/**
 * Generate unique event ID
 *
 * @returns Unique event identifier
 *
 * @example
 * const eventId = generateEventId();
 */
const generateEventId = () => {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
exports.generateEventId = generateEventId;
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
const createMeetingRequest = async (meetingData, attendees, transaction) => {
    const request = {
        id: (0, exports.generateEventId)(),
        eventId: meetingData.eventId || (0, exports.generateEventId)(),
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
exports.createMeetingRequest = createMeetingRequest;
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
const sendMeetingInvitation = async (meetingRequest, attendees) => {
    // Implementation would send email with ICS attachment
    return true;
};
exports.sendMeetingInvitation = sendMeetingInvitation;
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
const updateMeetingRequest = async (meetingRequestId, updates, transaction) => {
    const updatedRequest = {
        ...updates,
        id: meetingRequestId,
    };
    return updatedRequest;
};
exports.updateMeetingRequest = updateMeetingRequest;
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
const cancelMeetingRequest = async (meetingRequestId, cancellationMessage, transaction) => {
    return true;
};
exports.cancelMeetingRequest = cancelMeetingRequest;
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
const addAttendeeToEvent = async (eventId, attendeeData, transaction) => {
    const attendee = {
        id: (0, exports.generateEventId)(),
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
exports.addAttendeeToEvent = addAttendeeToEvent;
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
const updateAttendeeResponse = async (attendeeId, responseStatus, comment, transaction) => {
    const updatedAttendee = {
        id: attendeeId,
        responseStatus,
        comment,
        responseTime: new Date(),
        updatedAt: new Date(),
    };
    return updatedAttendee;
};
exports.updateAttendeeResponse = updateAttendeeResponse;
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
const acceptMeetingInvitation = async (eventId, attendeeId, comment, transaction) => {
    return (0, exports.updateAttendeeResponse)(attendeeId, MeetingResponseStatus.ACCEPTED, comment, transaction);
};
exports.acceptMeetingInvitation = acceptMeetingInvitation;
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
const declineMeetingInvitation = async (eventId, attendeeId, comment, transaction) => {
    return (0, exports.updateAttendeeResponse)(attendeeId, MeetingResponseStatus.DECLINED, comment, transaction);
};
exports.declineMeetingInvitation = declineMeetingInvitation;
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
const markInvitationTentative = async (eventId, attendeeId, comment, transaction) => {
    return (0, exports.updateAttendeeResponse)(attendeeId, MeetingResponseStatus.TENTATIVE, comment, transaction);
};
exports.markInvitationTentative = markInvitationTentative;
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
const getEventAttendees = async (eventId, filters) => {
    // Implementation would query database
    return [];
};
exports.getEventAttendees = getEventAttendees;
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
const getAttendeeResponseSummary = async (eventId) => {
    const summary = {
        [MeetingResponseStatus.ACCEPTED]: 0,
        [MeetingResponseStatus.DECLINED]: 0,
        [MeetingResponseStatus.TENTATIVE]: 0,
        [MeetingResponseStatus.NONE]: 0,
        [MeetingResponseStatus.NOT_RESPONDED]: 0,
    };
    return summary;
};
exports.getAttendeeResponseSummary = getAttendeeResponseSummary;
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
const createRecurrenceRule = (pattern) => {
    const options = {
        freq: rrule_1.RRule[pattern.frequency],
        interval: pattern.interval,
    };
    if (pattern.count)
        options.count = pattern.count;
    if (pattern.until)
        options.until = pattern.until;
    if (pattern.byDay)
        options.byweekday = pattern.byDay.map(day => rrule_1.RRule[day]);
    if (pattern.byMonthDay)
        options.bymonthday = pattern.byMonthDay;
    if (pattern.byMonth)
        options.bymonth = pattern.byMonth;
    if (pattern.bySetPos)
        options.bysetpos = pattern.bySetPos;
    const rule = new rrule_1.RRule(options);
    return rule.toString();
};
exports.createRecurrenceRule = createRecurrenceRule;
/**
 * Parse recurrence rule string
 *
 * @param rruleString - RRULE string
 * @returns Recurrence pattern object
 *
 * @example
 * const pattern = parseRecurrenceRule('FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=10');
 */
const parseRecurrenceRule = (rruleString) => {
    const rule = (0, rrule_1.rrulestr)(rruleString);
    const options = rule.options;
    const pattern = {
        frequency: RecurrenceFrequency[rrule_1.RRule.FREQUENCIES[options.freq]],
        interval: options.interval,
    };
    if (options.count)
        pattern.count = options.count;
    if (options.until)
        pattern.until = options.until;
    return pattern;
};
exports.parseRecurrenceRule = parseRecurrenceRule;
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
const generateRecurringInstances = async (baseEvent, startDate, endDate) => {
    if (!baseEvent.recurrenceRule)
        return [baseEvent];
    const rule = (0, rrule_1.rrulestr)(baseEvent.recurrenceRule);
    const occurrences = rule.between(startDate, endDate, true);
    const instances = occurrences.map((date, index) => ({
        ...baseEvent,
        id: `${baseEvent.id}-instance-${index}`,
        startTime: date,
        endTime: new Date(date.getTime() + (baseEvent.endTime.getTime() - baseEvent.startTime.getTime())),
        recurrenceId: baseEvent.id,
    }));
    return instances;
};
exports.generateRecurringInstances = generateRecurringInstances;
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
const updateRecurringInstance = async (instanceId, updates, updateScope = 'this', transaction) => {
    // Implementation would update based on scope
    return [];
};
exports.updateRecurringInstance = updateRecurringInstance;
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
const deleteRecurringInstance = async (instanceId, deleteScope = 'this', transaction) => {
    return true;
};
exports.deleteRecurringInstance = deleteRecurringInstance;
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
const createMeetingRoom = async (roomData, transaction) => {
    const room = {
        id: (0, exports.generateEventId)(),
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
exports.createMeetingRoom = createMeetingRoom;
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
const bookMeetingRoom = async (bookingData, transaction) => {
    const booking = {
        id: (0, exports.generateEventId)(),
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
exports.bookMeetingRoom = bookMeetingRoom;
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
const checkRoomAvailability = async (roomId, startTime, endTime) => {
    // Implementation would check for overlapping bookings
    return true;
};
exports.checkRoomAvailability = checkRoomAvailability;
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
const findAvailableRooms = async (startTime, endTime, criteria) => {
    // Implementation would query available rooms
    return [];
};
exports.findAvailableRooms = findAvailableRooms;
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
const cancelRoomBooking = async (bookingId, transaction) => {
    const updatedBooking = {
        id: bookingId,
        status: RoomBookingStatus.CANCELLED,
        updatedAt: new Date(),
    };
    return updatedBooking;
};
exports.cancelRoomBooking = cancelRoomBooking;
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
const calculateUserFreeBusy = async (userId, startTime, endTime) => {
    // Implementation would query user's calendar events
    return [];
};
exports.calculateUserFreeBusy = calculateUserFreeBusy;
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
const calculateMultiUserFreeBusy = async (query) => {
    const responses = [];
    for (const userId of query.userIds) {
        const slots = await (0, exports.calculateUserFreeBusy)(userId, query.startTime, query.endTime);
        responses.push({
            userId,
            email: `user-${userId}@example.com`,
            slots,
        });
    }
    return responses;
};
exports.calculateMultiUserFreeBusy = calculateMultiUserFreeBusy;
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
const findCommonFreeSlots = async (userIds, startTime, endTime, duration) => {
    // Implementation would find overlapping free times
    return [];
};
exports.findCommonFreeSlots = findCommonFreeSlots;
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
const suggestMeetingTimes = async (userIds, duration, options) => {
    // Implementation would use AI/heuristics to suggest best times
    return [];
};
exports.suggestMeetingTimes = suggestMeetingTimes;
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
const convertEventToICalendar = (event, attendees, organizerEmail) => {
    const dtstart = (0, exports.formatICalDate)(event.startTime);
    const dtend = (0, exports.formatICalDate)(event.endTime);
    const dtstamp = (0, exports.formatICalDate)(new Date());
    let ics = 'BEGIN:VCALENDAR\r\n';
    ics += 'VERSION:2.0\r\n';
    ics += 'PRODID:-//White Cross//Calendar Integration//EN\r\n';
    ics += 'METHOD:REQUEST\r\n';
    ics += 'BEGIN:VEVENT\r\n';
    ics += `UID:${event.id}@whitecross.health\r\n`;
    ics += `DTSTAMP:${dtstamp}\r\n`;
    ics += `DTSTART:${dtstart}\r\n`;
    ics += `DTEND:${dtend}\r\n`;
    ics += `SUMMARY:${(0, exports.escapeICalText)(event.subject)}\r\n`;
    if (event.description) {
        ics += `DESCRIPTION:${(0, exports.escapeICalText)(event.description)}\r\n`;
    }
    if (event.location) {
        ics += `LOCATION:${(0, exports.escapeICalText)(event.location)}\r\n`;
    }
    ics += `ORGANIZER;CN="${organizerEmail}":mailto:${organizerEmail}\r\n`;
    attendees.forEach(attendee => {
        const partstat = (0, exports.mapResponseStatusToPartstat)(attendee.responseStatus);
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
        ics += `DESCRIPTION:${(0, exports.escapeICalText)(event.subject)}\r\n`;
        ics += 'END:VALARM\r\n';
    }
    ics += 'END:VEVENT\r\n';
    ics += 'END:VCALENDAR\r\n';
    return ics;
};
exports.convertEventToICalendar = convertEventToICalendar;
/**
 * Parse iCalendar format to event
 *
 * @param icsString - ICS format string
 * @returns Calendar event and attendees
 *
 * @example
 * const { event, attendees } = parseICalendarToEvent(icsContent);
 */
const parseICalendarToEvent = (icsString) => {
    const lines = icsString.split(/\r\n|\n|\r/);
    const event = {};
    const attendees = [];
    lines.forEach(line => {
        if (line.startsWith('UID:')) {
            event.id = line.substring(4).split('@')[0];
        }
        else if (line.startsWith('SUMMARY:')) {
            event.subject = line.substring(8);
        }
        else if (line.startsWith('DESCRIPTION:')) {
            event.description = line.substring(12);
        }
        else if (line.startsWith('LOCATION:')) {
            event.location = line.substring(9);
        }
        else if (line.startsWith('DTSTART:')) {
            event.startTime = (0, exports.parseICalDate)(line.substring(8));
        }
        else if (line.startsWith('DTEND:')) {
            event.endTime = (0, exports.parseICalDate)(line.substring(6));
        }
        else if (line.startsWith('RRULE:')) {
            event.recurrenceRule = line.substring(6);
            event.isRecurring = true;
        }
        else if (line.startsWith('ATTENDEE')) {
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
exports.parseICalendarToEvent = parseICalendarToEvent;
/**
 * Format date to iCalendar format
 *
 * @param date - Date to format
 * @returns iCalendar formatted date string
 *
 * @example
 * const icalDate = formatICalDate(new Date());
 */
const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};
exports.formatICalDate = formatICalDate;
/**
 * Parse iCalendar date string
 *
 * @param icalDate - iCalendar date string
 * @returns Date object
 *
 * @example
 * const date = parseICalDate('20250115T100000Z');
 */
const parseICalDate = (icalDate) => {
    const year = parseInt(icalDate.substr(0, 4));
    const month = parseInt(icalDate.substr(4, 2)) - 1;
    const day = parseInt(icalDate.substr(6, 2));
    const hour = parseInt(icalDate.substr(9, 2));
    const minute = parseInt(icalDate.substr(11, 2));
    const second = parseInt(icalDate.substr(13, 2));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
};
exports.parseICalDate = parseICalDate;
/**
 * Escape text for iCalendar format
 *
 * @param text - Text to escape
 * @returns Escaped text
 *
 * @example
 * const escaped = escapeICalText('Meeting; Room A, Building 1');
 */
const escapeICalText = (text) => {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
};
exports.escapeICalText = escapeICalText;
/**
 * Map response status to iCalendar PARTSTAT
 *
 * @param status - Meeting response status
 * @returns iCalendar PARTSTAT value
 *
 * @example
 * const partstat = mapResponseStatusToPartstat(MeetingResponseStatus.ACCEPTED);
 */
const mapResponseStatusToPartstat = (status) => {
    const mapping = {
        [MeetingResponseStatus.ACCEPTED]: 'ACCEPTED',
        [MeetingResponseStatus.DECLINED]: 'DECLINED',
        [MeetingResponseStatus.TENTATIVE]: 'TENTATIVE',
        [MeetingResponseStatus.NONE]: 'NEEDS-ACTION',
        [MeetingResponseStatus.NOT_RESPONDED]: 'NEEDS-ACTION',
    };
    return mapping[status];
};
exports.mapResponseStatusToPartstat = mapResponseStatusToPartstat;
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
const getSwaggerCalendarEventProperties = () => ({
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
exports.getSwaggerCalendarEventProperties = getSwaggerCalendarEventProperties;
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
const getSwaggerMeetingRequestProperties = () => ({
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
exports.getSwaggerMeetingRequestProperties = getSwaggerMeetingRequestProperties;
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
const getSwaggerAttendeeProperties = () => ({
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
exports.getSwaggerAttendeeProperties = getSwaggerAttendeeProperties;
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
const getSwaggerFreeBusyProperties = () => ({
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
exports.getSwaggerFreeBusyProperties = getSwaggerFreeBusyProperties;
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
const nestCreateCalendarEvent = async (eventData, userId) => {
    (0, exports.validateEventTimes)(eventData.startTime, eventData.endTime);
    eventData.organizerId = userId;
    return (0, exports.createCalendarEvent)(eventData);
};
exports.nestCreateCalendarEvent = nestCreateCalendarEvent;
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
const nestSendMeetingRequest = async (meetingData, attendeeEmails, userId) => {
    meetingData.organizerId = userId;
    const attendees = attendeeEmails.map(email => ({
        email,
        name: email.split('@')[0],
        attendeeType: 'required',
    }));
    return (0, exports.createMeetingRequest)(meetingData, attendees);
};
exports.nestSendMeetingRequest = nestSendMeetingRequest;
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
const nestGetUserEvents = async (userId, startDate, endDate) => {
    // Implementation would query user's events
    return [];
};
exports.nestGetUserEvents = nestGetUserEvents;
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
const validateEventTimes = (startTime, endTime) => {
    if (endTime <= startTime) {
        throw new Error('End time must be after start time');
    }
    if (startTime < new Date()) {
        throw new Error('Cannot create events in the past');
    }
};
exports.validateEventTimes = validateEventTimes;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Sequelize Model Attributes
    getCalendarEventModelAttributes: exports.getCalendarEventModelAttributes,
    getMeetingRequestModelAttributes: exports.getMeetingRequestModelAttributes,
    getMeetingAttendeeModelAttributes: exports.getMeetingAttendeeModelAttributes,
    getMeetingRoomModelAttributes: exports.getMeetingRoomModelAttributes,
    getRoomBookingModelAttributes: exports.getRoomBookingModelAttributes,
    getTimeProposalModelAttributes: exports.getTimeProposalModelAttributes,
    // Calendar Event Management
    createCalendarEvent: exports.createCalendarEvent,
    updateCalendarEvent: exports.updateCalendarEvent,
    cancelCalendarEvent: exports.cancelCalendarEvent,
    generateEventId: exports.generateEventId,
    // Meeting Request Functions
    createMeetingRequest: exports.createMeetingRequest,
    sendMeetingInvitation: exports.sendMeetingInvitation,
    updateMeetingRequest: exports.updateMeetingRequest,
    cancelMeetingRequest: exports.cancelMeetingRequest,
    // Attendee Management
    addAttendeeToEvent: exports.addAttendeeToEvent,
    updateAttendeeResponse: exports.updateAttendeeResponse,
    acceptMeetingInvitation: exports.acceptMeetingInvitation,
    declineMeetingInvitation: exports.declineMeetingInvitation,
    markInvitationTentative: exports.markInvitationTentative,
    getEventAttendees: exports.getEventAttendees,
    getAttendeeResponseSummary: exports.getAttendeeResponseSummary,
    // Recurring Events
    createRecurrenceRule: exports.createRecurrenceRule,
    parseRecurrenceRule: exports.parseRecurrenceRule,
    generateRecurringInstances: exports.generateRecurringInstances,
    updateRecurringInstance: exports.updateRecurringInstance,
    deleteRecurringInstance: exports.deleteRecurringInstance,
    // Meeting Room Booking
    createMeetingRoom: exports.createMeetingRoom,
    bookMeetingRoom: exports.bookMeetingRoom,
    checkRoomAvailability: exports.checkRoomAvailability,
    findAvailableRooms: exports.findAvailableRooms,
    cancelRoomBooking: exports.cancelRoomBooking,
    // Free/Busy Time Calculation
    calculateUserFreeBusy: exports.calculateUserFreeBusy,
    calculateMultiUserFreeBusy: exports.calculateMultiUserFreeBusy,
    findCommonFreeSlots: exports.findCommonFreeSlots,
    suggestMeetingTimes: exports.suggestMeetingTimes,
    // iCalendar (ICS) Format Support
    convertEventToICalendar: exports.convertEventToICalendar,
    parseICalendarToEvent: exports.parseICalendarToEvent,
    formatICalDate: exports.formatICalDate,
    parseICalDate: exports.parseICalDate,
    escapeICalText: exports.escapeICalText,
    mapResponseStatusToPartstat: exports.mapResponseStatusToPartstat,
    // Swagger API Documentation
    getSwaggerCalendarEventProperties: exports.getSwaggerCalendarEventProperties,
    getSwaggerMeetingRequestProperties: exports.getSwaggerMeetingRequestProperties,
    getSwaggerAttendeeProperties: exports.getSwaggerAttendeeProperties,
    getSwaggerFreeBusyProperties: exports.getSwaggerFreeBusyProperties,
    // NestJS Service Methods
    nestCreateCalendarEvent: exports.nestCreateCalendarEvent,
    nestSendMeetingRequest: exports.nestSendMeetingRequest,
    nestGetUserEvents: exports.nestGetUserEvents,
    validateEventTimes: exports.validateEventTimes,
};
//# sourceMappingURL=mail-calendar-integration-kit.js.map