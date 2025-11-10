/**
 * LOC: PROP-RES-001
 * File: /reuse/property/property-reservations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Reservation booking modules
 *   - Resource management systems
 */
/**
 * File: /reuse/property/property-reservations-kit.ts
 * Locator: WC-PROP-RES-001
 * Purpose: Property Reservations Kit - Comprehensive conference room and resource reservation management
 *
 * Upstream: Independent utility module for property reservation operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for reservation management, scheduling, resource booking, and analytics
 *
 * LLM Context: Enterprise-grade reservation management utilities for property management systems.
 * Provides conference room booking, resource availability checking, recurring reservations, catering
 * coordination, AV equipment management, parking space allocation, desk hoteling, cancellation handling,
 * no-show tracking, and comprehensive usage analytics. Essential for maintaining efficient space
 * utilization and resource management.
 */
interface Reservation {
    id: string;
    propertyId: string;
    type: ReservationType;
    resourceId: string;
    resourceName: string;
    userId: string;
    userName: string;
    userEmail: string;
    startTime: Date;
    endTime: Date;
    status: ReservationStatus;
    attendeeCount?: number;
    purpose?: string;
    setupType?: SetupType;
    catering?: CateringRequest;
    avEquipment?: AVEquipmentRequest[];
    parkingSpaces?: ParkingSpaceRequest[];
    specialRequirements?: string;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    checkInTime?: Date;
    checkOutTime?: Date;
    isRecurring: boolean;
    recurrencePattern?: RecurrencePattern;
    parentReservationId?: string;
    cost?: number;
    depositRequired?: number;
    depositPaid?: boolean;
    notes?: ReservationNote[];
}
type ReservationType = 'conference_room' | 'meeting_room' | 'desk' | 'hot_desk' | 'parking_space' | 'event_space' | 'equipment' | 'amenity';
type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'expired';
type SetupType = 'theater' | 'classroom' | 'boardroom' | 'u_shape' | 'banquet' | 'cocktail' | 'hollow_square' | 'custom';
interface Resource {
    id: string;
    propertyId: string;
    name: string;
    type: ReservationType;
    capacity: number;
    location: string;
    floor?: string;
    features: string[];
    amenities: string[];
    hourlyRate?: number;
    halfDayRate?: number;
    fullDayRate?: number;
    minimumBookingMinutes: number;
    maximumBookingMinutes: number;
    advanceBookingDays: number;
    isActive: boolean;
    maintenanceSchedule?: MaintenanceWindow[];
    images?: string[];
}
interface MaintenanceWindow {
    startTime: Date;
    endTime: Date;
    reason: string;
    recurringDays?: number[];
}
interface CateringRequest {
    id: string;
    reservationId: string;
    cateringType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages' | 'full_service';
    menuItems: string[];
    attendeeCount: number;
    dietaryRestrictions?: string[];
    deliveryTime: Date;
    setupInstructions?: string;
    estimatedCost?: number;
    vendorId?: string;
    status: 'requested' | 'confirmed' | 'delivered' | 'cancelled';
}
interface AVEquipmentRequest {
    id: string;
    reservationId: string;
    equipmentType: string;
    quantity: number;
    deliveryTime: Date;
    setupRequired: boolean;
    technicalSupportNeeded: boolean;
    status: 'requested' | 'confirmed' | 'delivered' | 'returned';
}
interface ParkingSpaceRequest {
    id: string;
    reservationId: string;
    spaceType: 'standard' | 'accessible' | 'ev_charging' | 'motorcycle' | 'oversized';
    quantity: number;
    vehiclePlates?: string[];
    startTime: Date;
    endTime: Date;
    status: 'requested' | 'confirmed' | 'cancelled';
}
interface RecurrencePattern {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    endDate?: Date;
    occurrenceCount?: number;
    generatedReservations: string[];
}
interface ReservationNote {
    id: string;
    reservationId: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    isInternal: boolean;
}
interface AvailabilitySlot {
    resourceId: string;
    resourceName: string;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    reason?: string;
}
interface ReservationConflict {
    resourceId: string;
    conflictingReservationId: string;
    startTime: Date;
    endTime: Date;
    type: 'overlap' | 'maintenance' | 'buffer_time';
}
interface NoShowRecord {
    reservationId: string;
    userId: string;
    resourceId: string;
    scheduledStartTime: Date;
    recordedAt: Date;
    penaltyApplied?: number;
    notificationSent: boolean;
}
interface UsageAnalytics {
    resourceId: string;
    resourceName: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalReservations: number;
    completedReservations: number;
    cancelledReservations: number;
    noShowCount: number;
    totalHoursBooked: number;
    totalHoursUsed: number;
    utilizationRate: number;
    averageBookingDuration: number;
    peakUsageHours: {
        hour: number;
        count: number;
    }[];
    topUsers: {
        userId: string;
        userName: string;
        bookingCount: number;
    }[];
    revenue?: number;
}
interface ReservationValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestedAlternatives?: AvailabilitySlot[];
}
/**
 * Creates a new conference room reservation.
 *
 * @param {Partial<Reservation>} reservationData - Reservation data
 * @returns {Reservation} Created reservation
 *
 * @example
 * ```typescript
 * const reservation = createReservation({
 *   propertyId: 'PROP-001',
 *   type: 'conference_room',
 *   resourceId: 'ROOM-101',
 *   resourceName: 'Executive Conference Room A',
 *   userId: 'user-123',
 *   userName: 'John Smith',
 *   userEmail: 'john.smith@example.com',
 *   startTime: new Date('2025-11-10T10:00:00'),
 *   endTime: new Date('2025-11-10T12:00:00'),
 *   attendeeCount: 12,
 *   purpose: 'Quarterly Board Meeting',
 *   setupType: 'boardroom'
 * });
 * ```
 */
export declare const createReservation: (reservationData: Partial<Reservation>) => Reservation;
/**
 * Confirms a pending reservation.
 *
 * @param {Reservation} reservation - Reservation to confirm
 * @param {string} confirmedBy - User confirming the reservation
 * @returns {Reservation} Confirmed reservation
 *
 * @example
 * ```typescript
 * const confirmed = confirmReservation(reservation, 'manager-456');
 * ```
 */
export declare const confirmReservation: (reservation: Reservation, confirmedBy: string) => Reservation;
/**
 * Checks in a user for their reservation.
 *
 * @param {Reservation} reservation - Reservation to check in
 * @param {Date} checkInTime - Check-in timestamp
 * @returns {Reservation} Updated reservation
 *
 * @example
 * ```typescript
 * const checkedIn = checkInReservation(reservation, new Date());
 * ```
 */
export declare const checkInReservation: (reservation: Reservation, checkInTime?: Date) => Reservation;
/**
 * Checks out a user from their reservation.
 *
 * @param {Reservation} reservation - Reservation to check out
 * @param {Date} checkOutTime - Check-out timestamp
 * @returns {Reservation} Updated reservation
 *
 * @example
 * ```typescript
 * const checkedOut = checkOutReservation(reservation, new Date());
 * ```
 */
export declare const checkOutReservation: (reservation: Reservation, checkOutTime?: Date) => Reservation;
/**
 * Calculates reservation duration in minutes.
 *
 * @param {Reservation} reservation - Reservation
 * @returns {number} Duration in minutes
 *
 * @example
 * ```typescript
 * const duration = calculateReservationDuration(reservation);
 * // Returns: 120 (for 2-hour reservation)
 * ```
 */
export declare const calculateReservationDuration: (reservation: Reservation) => number;
/**
 * Checks if a resource is available for a specific time slot.
 *
 * @param {string} resourceId - Resource ID
 * @param {Date} startTime - Requested start time
 * @param {Date} endTime - Requested end time
 * @param {Reservation[]} existingReservations - Existing reservations
 * @param {Resource} resource - Resource details
 * @returns {boolean} True if available
 *
 * @example
 * ```typescript
 * const available = checkResourceAvailability(
 *   'ROOM-101',
 *   new Date('2025-11-10T10:00:00'),
 *   new Date('2025-11-10T12:00:00'),
 *   existingReservations,
 *   resource
 * );
 * ```
 */
export declare const checkResourceAvailability: (resourceId: string, startTime: Date, endTime: Date, existingReservations: Reservation[], resource: Resource) => boolean;
/**
 * Finds available time slots for a resource on a specific date.
 *
 * @param {string} resourceId - Resource ID
 * @param {Date} date - Date to check
 * @param {number} durationMinutes - Desired duration in minutes
 * @param {Reservation[]} existingReservations - Existing reservations
 * @param {Resource} resource - Resource details
 * @returns {AvailabilitySlot[]} Available time slots
 *
 * @example
 * ```typescript
 * const slots = findAvailableSlots(
 *   'ROOM-101',
 *   new Date('2025-11-10'),
 *   120,
 *   existingReservations,
 *   resource
 * );
 * ```
 */
export declare const findAvailableSlots: (resourceId: string, date: Date, durationMinutes: number, existingReservations: Reservation[], resource: Resource) => AvailabilitySlot[];
/**
 * Detects reservation conflicts for a proposed booking.
 *
 * @param {Partial<Reservation>} proposedReservation - Proposed reservation
 * @param {Reservation[]} existingReservations - Existing reservations
 * @returns {ReservationConflict[]} Array of conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectReservationConflicts(
 *   proposedReservation,
 *   existingReservations
 * );
 * ```
 */
export declare const detectReservationConflicts: (proposedReservation: Partial<Reservation>, existingReservations: Reservation[]) => ReservationConflict[];
/**
 * Suggests alternative resources when primary is unavailable.
 *
 * @param {Resource} primaryResource - Requested resource
 * @param {Resource[]} allResources - All available resources
 * @param {Date} startTime - Requested start time
 * @param {Date} endTime - Requested end time
 * @param {Reservation[]} existingReservations - Existing reservations
 * @returns {Resource[]} Alternative available resources
 *
 * @example
 * ```typescript
 * const alternatives = suggestAlternativeResources(
 *   primaryResource,
 *   allResources,
 *   startTime,
 *   endTime,
 *   existingReservations
 * );
 * ```
 */
export declare const suggestAlternativeResources: (primaryResource: Resource, allResources: Resource[], startTime: Date, endTime: Date, existingReservations: Reservation[]) => Resource[];
/**
 * Validates a reservation request against business rules.
 *
 * @param {Partial<Reservation>} reservation - Reservation to validate
 * @param {Resource} resource - Resource being reserved
 * @param {Reservation[]} existingReservations - Existing reservations
 * @returns {ReservationValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReservationRequest(
 *   reservationData,
 *   resource,
 *   existingReservations
 * );
 * if (validation.isValid) {
 *   // Proceed with booking
 * }
 * ```
 */
export declare const validateReservationRequest: (reservation: Partial<Reservation>, resource: Resource, existingReservations: Reservation[]) => ReservationValidationResult;
/**
 * Creates a recurring reservation pattern.
 *
 * @param {Partial<Reservation>} baseReservation - Base reservation data
 * @param {RecurrencePattern} pattern - Recurrence pattern
 * @returns {Reservation} Parent recurring reservation
 *
 * @example
 * ```typescript
 * const recurring = createRecurringReservation(
 *   baseReservation,
 *   {
 *     frequency: 'weekly',
 *     interval: 1,
 *     daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
 *     endDate: new Date('2025-12-31')
 *   }
 * );
 * ```
 */
export declare const createRecurringReservation: (baseReservation: Partial<Reservation>, pattern: RecurrencePattern) => Reservation;
/**
 * Generates individual reservations from a recurring pattern.
 *
 * @param {Reservation} recurringReservation - Parent recurring reservation
 * @param {number} maxOccurrences - Maximum number of occurrences to generate
 * @returns {Reservation[]} Generated individual reservations
 *
 * @example
 * ```typescript
 * const instances = generateRecurringInstances(recurringReservation, 20);
 * ```
 */
export declare const generateRecurringInstances: (recurringReservation: Reservation, maxOccurrences?: number) => Reservation[];
/**
 * Updates a recurring reservation series.
 *
 * @param {Reservation} recurringReservation - Parent recurring reservation
 * @param {Partial<Reservation>} updates - Updates to apply
 * @param {'this' | 'following' | 'all'} scope - Update scope
 * @returns {Reservation} Updated reservation
 *
 * @example
 * ```typescript
 * const updated = updateRecurringSeries(
 *   recurringReservation,
 *   { attendeeCount: 20 },
 *   'following'
 * );
 * ```
 */
export declare const updateRecurringSeries: (recurringReservation: Reservation, updates: Partial<Reservation>, scope: "this" | "following" | "all") => Reservation;
/**
 * Cancels a recurring reservation series.
 *
 * @param {Reservation} recurringReservation - Parent recurring reservation
 * @param {'this' | 'following' | 'all'} scope - Cancellation scope
 * @param {string} reason - Cancellation reason
 * @returns {Reservation} Cancelled reservation
 *
 * @example
 * ```typescript
 * const cancelled = cancelRecurringSeries(
 *   recurringReservation,
 *   'all',
 *   'Project postponed'
 * );
 * ```
 */
export declare const cancelRecurringSeries: (recurringReservation: Reservation, scope: "this" | "following" | "all", reason: string) => Reservation;
/**
 * Adds catering request to a reservation.
 *
 * @param {Reservation} reservation - Reservation
 * @param {Omit<CateringRequest, 'id' | 'reservationId'>} cateringData - Catering request data
 * @returns {Reservation} Updated reservation with catering
 *
 * @example
 * ```typescript
 * const withCatering = addCateringToReservation(reservation, {
 *   cateringType: 'lunch',
 *   menuItems: ['Sandwiches', 'Salads', 'Beverages'],
 *   attendeeCount: 15,
 *   dietaryRestrictions: ['vegetarian', 'gluten-free'],
 *   deliveryTime: new Date('2025-11-10T11:45:00'),
 *   status: 'requested'
 * });
 * ```
 */
export declare const addCateringToReservation: (reservation: Reservation, cateringData: Omit<CateringRequest, "id" | "reservationId">) => Reservation;
/**
 * Calculates estimated catering cost.
 *
 * @param {CateringRequest} catering - Catering request
 * @param {number} costPerPerson - Cost per person
 * @returns {number} Estimated total cost
 *
 * @example
 * ```typescript
 * const cost = calculateCateringCost(cateringRequest, 25.00);
 * // Returns: 375.00 (for 15 people)
 * ```
 */
export declare const calculateCateringCost: (catering: CateringRequest, costPerPerson: number) => number;
/**
 * Updates catering request status.
 *
 * @param {CateringRequest} catering - Catering request
 * @param {CateringRequest['status']} newStatus - New status
 * @returns {CateringRequest} Updated catering request
 *
 * @example
 * ```typescript
 * const confirmed = updateCateringStatus(cateringRequest, 'confirmed');
 * ```
 */
export declare const updateCateringStatus: (catering: CateringRequest, newStatus: CateringRequest["status"]) => CateringRequest;
/**
 * Generates catering order summary.
 *
 * @param {CateringRequest} catering - Catering request
 * @returns {object} Catering summary
 *
 * @example
 * ```typescript
 * const summary = generateCateringSummary(cateringRequest);
 * ```
 */
export declare const generateCateringSummary: (catering: CateringRequest) => object;
/**
 * Adds AV equipment request to a reservation.
 *
 * @param {Reservation} reservation - Reservation
 * @param {Omit<AVEquipmentRequest, 'id' | 'reservationId'>} equipmentData - Equipment request data
 * @returns {Reservation} Updated reservation with AV equipment
 *
 * @example
 * ```typescript
 * const withAV = addAVEquipmentToReservation(reservation, {
 *   equipmentType: 'Projector and Screen',
 *   quantity: 1,
 *   deliveryTime: new Date('2025-11-10T09:45:00'),
 *   setupRequired: true,
 *   technicalSupportNeeded: false,
 *   status: 'requested'
 * });
 * ```
 */
export declare const addAVEquipmentToReservation: (reservation: Reservation, equipmentData: Omit<AVEquipmentRequest, "id" | "reservationId">) => Reservation;
/**
 * Removes AV equipment from a reservation.
 *
 * @param {Reservation} reservation - Reservation
 * @param {string} equipmentId - Equipment request ID to remove
 * @returns {Reservation} Updated reservation
 *
 * @example
 * ```typescript
 * const updated = removeAVEquipmentFromReservation(reservation, 'AV-123');
 * ```
 */
export declare const removeAVEquipmentFromReservation: (reservation: Reservation, equipmentId: string) => Reservation;
/**
 * Updates AV equipment status.
 *
 * @param {AVEquipmentRequest} equipment - Equipment request
 * @param {AVEquipmentRequest['status']} newStatus - New status
 * @returns {AVEquipmentRequest} Updated equipment request
 *
 * @example
 * ```typescript
 * const delivered = updateAVEquipmentStatus(equipmentRequest, 'delivered');
 * ```
 */
export declare const updateAVEquipmentStatus: (equipment: AVEquipmentRequest, newStatus: AVEquipmentRequest["status"]) => AVEquipmentRequest;
/**
 * Generates AV equipment checklist.
 *
 * @param {string} equipmentType - Type of equipment
 * @returns {string[]} Setup checklist
 *
 * @example
 * ```typescript
 * const checklist = generateAVSetupChecklist('Projector and Screen');
 * ```
 */
export declare const generateAVSetupChecklist: (equipmentType: string) => string[];
/**
 * Adds parking space request to a reservation.
 *
 * @param {Reservation} reservation - Reservation
 * @param {Omit<ParkingSpaceRequest, 'id' | 'reservationId'>} parkingData - Parking request data
 * @returns {Reservation} Updated reservation with parking
 *
 * @example
 * ```typescript
 * const withParking = addParkingToReservation(reservation, {
 *   spaceType: 'standard',
 *   quantity: 3,
 *   vehiclePlates: ['ABC123', 'XYZ789'],
 *   startTime: new Date('2025-11-10T09:30:00'),
 *   endTime: new Date('2025-11-10T13:00:00'),
 *   status: 'requested'
 * });
 * ```
 */
export declare const addParkingToReservation: (reservation: Reservation, parkingData: Omit<ParkingSpaceRequest, "id" | "reservationId">) => Reservation;
/**
 * Checks parking availability for a time period.
 *
 * @param {string} propertyId - Property ID
 * @param {ParkingSpaceRequest['spaceType']} spaceType - Type of parking space
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {number} quantity - Number of spaces needed
 * @param {ParkingSpaceRequest[]} existingRequests - Existing parking requests
 * @param {number} totalCapacity - Total parking capacity
 * @returns {boolean} True if available
 *
 * @example
 * ```typescript
 * const available = checkParkingAvailability(
 *   'PROP-001',
 *   'standard',
 *   startTime,
 *   endTime,
 *   3,
 *   existingRequests,
 *   50
 * );
 * ```
 */
export declare const checkParkingAvailability: (propertyId: string, spaceType: ParkingSpaceRequest["spaceType"], startTime: Date, endTime: Date, quantity: number, existingRequests: ParkingSpaceRequest[], totalCapacity: number) => boolean;
/**
 * Updates parking space request status.
 *
 * @param {ParkingSpaceRequest} parking - Parking request
 * @param {ParkingSpaceRequest['status']} newStatus - New status
 * @returns {ParkingSpaceRequest} Updated parking request
 *
 * @example
 * ```typescript
 * const confirmed = updateParkingStatus(parkingRequest, 'confirmed');
 * ```
 */
export declare const updateParkingStatus: (parking: ParkingSpaceRequest, newStatus: ParkingSpaceRequest["status"]) => ParkingSpaceRequest;
/**
 * Creates a desk hoteling reservation.
 *
 * @param {Partial<Reservation>} deskData - Desk reservation data
 * @returns {Reservation} Desk reservation
 *
 * @example
 * ```typescript
 * const deskReservation = createDeskReservation({
 *   propertyId: 'PROP-001',
 *   resourceId: 'DESK-42',
 *   resourceName: 'Hot Desk 42',
 *   userId: 'user-123',
 *   userName: 'Jane Doe',
 *   userEmail: 'jane.doe@example.com',
 *   startTime: new Date('2025-11-10T09:00:00'),
 *   endTime: new Date('2025-11-10T17:00:00')
 * });
 * ```
 */
export declare const createDeskReservation: (deskData: Partial<Reservation>) => Reservation;
/**
 * Finds available desks in a specific area.
 *
 * @param {string} propertyId - Property ID
 * @param {string} floor - Floor level
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Resource[]} allDesks - All desk resources
 * @param {Reservation[]} existingReservations - Existing reservations
 * @returns {Resource[]} Available desks
 *
 * @example
 * ```typescript
 * const desks = findAvailableDesks(
 *   'PROP-001',
 *   '3rd Floor',
 *   startTime,
 *   endTime,
 *   allDesks,
 *   existingReservations
 * );
 * ```
 */
export declare const findAvailableDesks: (propertyId: string, floor: string, startTime: Date, endTime: Date, allDesks: Resource[], existingReservations: Reservation[]) => Resource[];
/**
 * Generates desk usage report for a user.
 *
 * @param {string} userId - User ID
 * @param {Reservation[]} reservations - User's desk reservations
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Desk usage report
 *
 * @example
 * ```typescript
 * const report = generateDeskUsageReport(
 *   'user-123',
 *   userReservations,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateDeskUsageReport: (userId: string, reservations: Reservation[], startDate: Date, endDate: Date) => object;
/**
 * Cancels a reservation.
 *
 * @param {Reservation} reservation - Reservation to cancel
 * @param {string} cancelledBy - User cancelling the reservation
 * @param {string} reason - Cancellation reason
 * @returns {Reservation} Cancelled reservation
 *
 * @example
 * ```typescript
 * const cancelled = cancelReservation(
 *   reservation,
 *   'user-123',
 *   'Meeting postponed to next week'
 * );
 * ```
 */
export declare const cancelReservation: (reservation: Reservation, cancelledBy: string, reason: string) => Reservation;
/**
 * Modifies an existing reservation.
 *
 * @param {Reservation} reservation - Reservation to modify
 * @param {Partial<Reservation>} updates - Updates to apply
 * @param {Reservation[]} existingReservations - Existing reservations for conflict checking
 * @param {Resource} resource - Resource details
 * @returns {Reservation} Updated reservation
 * @throws {Error} If modification creates conflicts
 *
 * @example
 * ```typescript
 * const modified = modifyReservation(
 *   reservation,
 *   { endTime: new Date('2025-11-10T13:00:00'), attendeeCount: 20 },
 *   existingReservations,
 *   resource
 * );
 * ```
 */
export declare const modifyReservation: (reservation: Reservation, updates: Partial<Reservation>, existingReservations: Reservation[], resource: Resource) => Reservation;
/**
 * Extends a reservation duration.
 *
 * @param {Reservation} reservation - Reservation to extend
 * @param {number} additionalMinutes - Minutes to add
 * @param {Reservation[]} existingReservations - Existing reservations
 * @param {Resource} resource - Resource details
 * @returns {Reservation} Extended reservation
 *
 * @example
 * ```typescript
 * const extended = extendReservation(
 *   reservation,
 *   30,
 *   existingReservations,
 *   resource
 * );
 * ```
 */
export declare const extendReservation: (reservation: Reservation, additionalMinutes: number, existingReservations: Reservation[], resource: Resource) => Reservation;
/**
 * Calculates cancellation penalty based on timing.
 *
 * @param {Reservation} reservation - Reservation being cancelled
 * @param {Date} cancellationTime - When cancellation is being made
 * @returns {number} Penalty amount
 *
 * @example
 * ```typescript
 * const penalty = calculateCancellationPenalty(reservation, new Date());
 * // Returns: 50.00 (if cancelling within penalty period)
 * ```
 */
export declare const calculateCancellationPenalty: (reservation: Reservation, cancellationTime?: Date) => number;
/**
 * Records a no-show for a reservation.
 *
 * @param {Reservation} reservation - Reservation that was no-show
 * @param {number} penaltyAmount - Penalty to apply
 * @returns {NoShowRecord} No-show record
 *
 * @example
 * ```typescript
 * const noShow = recordNoShow(reservation, 25.00);
 * ```
 */
export declare const recordNoShow: (reservation: Reservation, penaltyAmount?: number) => NoShowRecord;
/**
 * Marks a reservation as no-show.
 *
 * @param {Reservation} reservation - Reservation
 * @returns {Reservation} Updated reservation
 *
 * @example
 * ```typescript
 * const noShow = markAsNoShow(reservation);
 * ```
 */
export declare const markAsNoShow: (reservation: Reservation) => Reservation;
/**
 * Identifies potential no-shows based on time.
 *
 * @param {Reservation[]} reservations - Active reservations
 * @param {number} gracePeriodMinutes - Grace period after start time
 * @returns {Reservation[]} Reservations that are likely no-shows
 *
 * @example
 * ```typescript
 * const potentialNoShows = identifyPotentialNoShows(activeReservations, 15);
 * ```
 */
export declare const identifyPotentialNoShows: (reservations: Reservation[], gracePeriodMinutes?: number) => Reservation[];
/**
 * Calculates user's no-show rate.
 *
 * @param {string} userId - User ID
 * @param {NoShowRecord[]} noShowRecords - No-show records
 * @param {Reservation[]} allReservations - All user reservations
 * @returns {object} No-show statistics
 *
 * @example
 * ```typescript
 * const stats = calculateNoShowRate('user-123', noShows, reservations);
 * ```
 */
export declare const calculateNoShowRate: (userId: string, noShowRecords: NoShowRecord[], allReservations: Reservation[]) => object;
/**
 * Generates comprehensive usage analytics for a resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} resourceName - Resource name
 * @param {Reservation[]} reservations - Reservations for the resource
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {UsageAnalytics} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = generateUsageAnalytics(
 *   'ROOM-101',
 *   'Conference Room A',
 *   reservations,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateUsageAnalytics: (resourceId: string, resourceName: string, reservations: Reservation[], startDate: Date, endDate: Date) => UsageAnalytics;
/**
 * Generates property-wide reservation summary.
 *
 * @param {string} propertyId - Property ID
 * @param {Reservation[]} reservations - All reservations
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Property summary
 *
 * @example
 * ```typescript
 * const summary = generatePropertyReservationSummary(
 *   'PROP-001',
 *   allReservations,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generatePropertyReservationSummary: (propertyId: string, reservations: Reservation[], startDate: Date, endDate: Date) => object;
/**
 * Identifies underutilized resources.
 *
 * @param {UsageAnalytics[]} analytics - Analytics for all resources
 * @param {number} threshold - Utilization threshold (percentage)
 * @returns {UsageAnalytics[]} Underutilized resources
 *
 * @example
 * ```typescript
 * const underutilized = identifyUnderutilizedResources(allAnalytics, 30);
 * ```
 */
export declare const identifyUnderutilizedResources: (analytics: UsageAnalytics[], threshold?: number) => UsageAnalytics[];
/**
 * Calculates reservation cost based on duration and resource rates.
 *
 * @param {Resource} resource - Resource being reserved
 * @param {Date} startTime - Reservation start time
 * @param {Date} endTime - Reservation end time
 * @returns {number} Total cost
 *
 * @example
 * ```typescript
 * const cost = calculateReservationCost(
 *   resource,
 *   new Date('2025-11-10T10:00:00'),
 *   new Date('2025-11-10T14:00:00')
 * );
 * ```
 */
export declare const calculateReservationCost: (resource: Resource, startTime: Date, endTime: Date) => number;
/**
 * Generates revenue report by resource type.
 *
 * @param {Reservation[]} reservations - All reservations
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Revenue breakdown by type
 *
 * @example
 * ```typescript
 * const revenue = generateRevenueReport(
 *   reservations,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateRevenueReport: (reservations: Reservation[], startDate: Date, endDate: Date) => object;
export {};
//# sourceMappingURL=property-reservations-kit.d.ts.map