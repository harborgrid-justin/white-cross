"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRevenueReport = exports.calculateReservationCost = exports.identifyUnderutilizedResources = exports.generatePropertyReservationSummary = exports.generateUsageAnalytics = exports.calculateNoShowRate = exports.identifyPotentialNoShows = exports.markAsNoShow = exports.recordNoShow = exports.calculateCancellationPenalty = exports.extendReservation = exports.modifyReservation = exports.cancelReservation = exports.generateDeskUsageReport = exports.findAvailableDesks = exports.createDeskReservation = exports.updateParkingStatus = exports.checkParkingAvailability = exports.addParkingToReservation = exports.generateAVSetupChecklist = exports.updateAVEquipmentStatus = exports.removeAVEquipmentFromReservation = exports.addAVEquipmentToReservation = exports.generateCateringSummary = exports.updateCateringStatus = exports.calculateCateringCost = exports.addCateringToReservation = exports.cancelRecurringSeries = exports.updateRecurringSeries = exports.generateRecurringInstances = exports.createRecurringReservation = exports.validateReservationRequest = exports.suggestAlternativeResources = exports.detectReservationConflicts = exports.findAvailableSlots = exports.checkResourceAvailability = exports.calculateReservationDuration = exports.checkOutReservation = exports.checkInReservation = exports.confirmReservation = exports.createReservation = void 0;
// ============================================================================
// CONFERENCE ROOM BOOKING
// ============================================================================
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
const createReservation = (reservationData) => {
    const now = new Date();
    const reservation = {
        id: reservationData.id || `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: reservationData.propertyId,
        type: reservationData.type || 'conference_room',
        resourceId: reservationData.resourceId,
        resourceName: reservationData.resourceName,
        userId: reservationData.userId,
        userName: reservationData.userName,
        userEmail: reservationData.userEmail,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        status: reservationData.status || 'pending',
        attendeeCount: reservationData.attendeeCount,
        purpose: reservationData.purpose,
        setupType: reservationData.setupType,
        catering: reservationData.catering,
        avEquipment: reservationData.avEquipment || [],
        parkingSpaces: reservationData.parkingSpaces || [],
        specialRequirements: reservationData.specialRequirements,
        createdAt: now,
        updatedAt: now,
        confirmedAt: reservationData.confirmedAt,
        cancelledAt: reservationData.cancelledAt,
        cancellationReason: reservationData.cancellationReason,
        checkInTime: reservationData.checkInTime,
        checkOutTime: reservationData.checkOutTime,
        isRecurring: reservationData.isRecurring || false,
        recurrencePattern: reservationData.recurrencePattern,
        parentReservationId: reservationData.parentReservationId,
        cost: reservationData.cost,
        depositRequired: reservationData.depositRequired,
        depositPaid: reservationData.depositPaid || false,
        notes: reservationData.notes || [],
    };
    return reservation;
};
exports.createReservation = createReservation;
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
const confirmReservation = (reservation, confirmedBy) => {
    const now = new Date();
    return {
        ...reservation,
        status: 'confirmed',
        confirmedAt: now,
        updatedAt: now,
        notes: [
            ...(reservation.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                reservationId: reservation.id,
                content: `Reservation confirmed by ${confirmedBy}`,
                createdBy: confirmedBy,
                createdAt: now,
                isInternal: true,
            },
        ],
    };
};
exports.confirmReservation = confirmReservation;
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
const checkInReservation = (reservation, checkInTime = new Date()) => {
    return {
        ...reservation,
        status: 'checked_in',
        checkInTime,
        updatedAt: new Date(),
    };
};
exports.checkInReservation = checkInReservation;
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
const checkOutReservation = (reservation, checkOutTime = new Date()) => {
    return {
        ...reservation,
        status: 'completed',
        checkOutTime,
        updatedAt: new Date(),
    };
};
exports.checkOutReservation = checkOutReservation;
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
const calculateReservationDuration = (reservation) => {
    const durationMs = reservation.endTime.getTime() - reservation.startTime.getTime();
    return Math.round(durationMs / (1000 * 60));
};
exports.calculateReservationDuration = calculateReservationDuration;
// ============================================================================
// RESOURCE AVAILABILITY CHECKING
// ============================================================================
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
const checkResourceAvailability = (resourceId, startTime, endTime, existingReservations, resource) => {
    // Check if resource is active
    if (!resource.isActive) {
        return false;
    }
    // Check against existing reservations
    const hasConflict = existingReservations
        .filter(res => res.resourceId === resourceId)
        .filter(res => ['confirmed', 'checked_in', 'in_progress'].includes(res.status))
        .some(res => {
        return ((startTime >= res.startTime && startTime < res.endTime) ||
            (endTime > res.startTime && endTime <= res.endTime) ||
            (startTime <= res.startTime && endTime >= res.endTime));
    });
    if (hasConflict) {
        return false;
    }
    // Check against maintenance windows
    if (resource.maintenanceSchedule) {
        const inMaintenance = resource.maintenanceSchedule.some(window => {
            return ((startTime >= window.startTime && startTime < window.endTime) ||
                (endTime > window.startTime && endTime <= window.endTime) ||
                (startTime <= window.startTime && endTime >= window.endTime));
        });
        if (inMaintenance) {
            return false;
        }
    }
    return true;
};
exports.checkResourceAvailability = checkResourceAvailability;
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
const findAvailableSlots = (resourceId, date, durationMinutes, existingReservations, resource) => {
    const slots = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0); // 8 AM start
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); // 6 PM end
    let currentTime = new Date(startOfDay);
    while (currentTime < endOfDay) {
        const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60 * 1000);
        if (slotEnd > endOfDay) {
            break;
        }
        const isAvailable = (0, exports.checkResourceAvailability)(resourceId, currentTime, slotEnd, existingReservations, resource);
        slots.push({
            resourceId,
            resourceName: resource.name,
            startTime: new Date(currentTime),
            endTime: new Date(slotEnd),
            isAvailable,
            reason: isAvailable ? undefined : 'Booked or unavailable',
        });
        // Move to next 30-minute slot
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    }
    return slots;
};
exports.findAvailableSlots = findAvailableSlots;
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
const detectReservationConflicts = (proposedReservation, existingReservations) => {
    const conflicts = [];
    existingReservations
        .filter(res => res.resourceId === proposedReservation.resourceId)
        .filter(res => ['confirmed', 'checked_in', 'in_progress'].includes(res.status))
        .forEach(res => {
        const hasOverlap = (proposedReservation.startTime >= res.startTime && proposedReservation.startTime < res.endTime) ||
            (proposedReservation.endTime > res.startTime && proposedReservation.endTime <= res.endTime) ||
            (proposedReservation.startTime <= res.startTime && proposedReservation.endTime >= res.endTime);
        if (hasOverlap) {
            conflicts.push({
                resourceId: res.resourceId,
                conflictingReservationId: res.id,
                startTime: res.startTime,
                endTime: res.endTime,
                type: 'overlap',
            });
        }
    });
    return conflicts;
};
exports.detectReservationConflicts = detectReservationConflicts;
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
const suggestAlternativeResources = (primaryResource, allResources, startTime, endTime, existingReservations) => {
    return allResources
        .filter(res => res.id !== primaryResource.id)
        .filter(res => res.type === primaryResource.type)
        .filter(res => res.capacity >= primaryResource.capacity)
        .filter(res => res.propertyId === primaryResource.propertyId)
        .filter(res => (0, exports.checkResourceAvailability)(res.id, startTime, endTime, existingReservations, res))
        .sort((a, b) => {
        // Sort by similarity to primary resource
        const aFeatureMatch = a.features.filter(f => primaryResource.features.includes(f)).length;
        const bFeatureMatch = b.features.filter(f => primaryResource.features.includes(f)).length;
        return bFeatureMatch - aFeatureMatch;
    });
};
exports.suggestAlternativeResources = suggestAlternativeResources;
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
const validateReservationRequest = (reservation, resource, existingReservations) => {
    const errors = [];
    const warnings = [];
    // Check required fields
    if (!reservation.startTime || !reservation.endTime) {
        errors.push('Start time and end time are required');
    }
    if (reservation.startTime && reservation.endTime) {
        // Check duration
        const durationMinutes = (reservation.endTime.getTime() - reservation.startTime.getTime()) / (1000 * 60);
        if (durationMinutes < resource.minimumBookingMinutes) {
            errors.push(`Minimum booking duration is ${resource.minimumBookingMinutes} minutes`);
        }
        if (durationMinutes > resource.maximumBookingMinutes) {
            errors.push(`Maximum booking duration is ${resource.maximumBookingMinutes} minutes`);
        }
        // Check advance booking
        const daysInAdvance = Math.floor((reservation.startTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysInAdvance > resource.advanceBookingDays) {
            errors.push(`Cannot book more than ${resource.advanceBookingDays} days in advance`);
        }
        if (reservation.startTime < new Date()) {
            errors.push('Cannot book in the past');
        }
        // Check capacity
        if (reservation.attendeeCount && reservation.attendeeCount > resource.capacity) {
            errors.push(`Room capacity is ${resource.capacity}, requested ${reservation.attendeeCount}`);
        }
        // Check conflicts
        const conflicts = (0, exports.detectReservationConflicts)(reservation, existingReservations);
        if (conflicts.length > 0) {
            errors.push(`Resource is already booked during this time`);
        }
    }
    // Warnings
    if (reservation.attendeeCount && reservation.attendeeCount < resource.capacity * 0.3) {
        warnings.push('Room may be too large for number of attendees');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateReservationRequest = validateReservationRequest;
// ============================================================================
// RECURRING MEETING RESERVATIONS
// ============================================================================
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
const createRecurringReservation = (baseReservation, pattern) => {
    const reservation = (0, exports.createReservation)({
        ...baseReservation,
        isRecurring: true,
        recurrencePattern: {
            ...pattern,
            generatedReservations: [],
        },
    });
    return reservation;
};
exports.createRecurringReservation = createRecurringReservation;
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
const generateRecurringInstances = (recurringReservation, maxOccurrences = 50) => {
    if (!recurringReservation.isRecurring || !recurringReservation.recurrencePattern) {
        throw new Error('Reservation is not recurring');
    }
    const instances = [];
    const pattern = recurringReservation.recurrencePattern;
    const duration = recurringReservation.endTime.getTime() - recurringReservation.startTime.getTime();
    let currentDate = new Date(recurringReservation.startTime);
    let count = 0;
    while (count < maxOccurrences) {
        // Check end date
        if (pattern.endDate && currentDate > pattern.endDate) {
            break;
        }
        // Check occurrence count
        if (pattern.occurrenceCount && count >= pattern.occurrenceCount) {
            break;
        }
        // Generate instance
        const instanceStart = new Date(currentDate);
        const instanceEnd = new Date(currentDate.getTime() + duration);
        const instance = (0, exports.createReservation)({
            ...recurringReservation,
            id: undefined, // Generate new ID
            startTime: instanceStart,
            endTime: instanceEnd,
            isRecurring: false,
            recurrencePattern: undefined,
            parentReservationId: recurringReservation.id,
            status: 'pending',
        });
        instances.push(instance);
        count++;
        // Calculate next occurrence
        switch (pattern.frequency) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + pattern.interval);
                break;
            case 'weekly':
                if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
                    // Find next day of week
                    let nextDay = currentDate.getDay();
                    let foundNext = false;
                    for (let i = 1; i <= 7; i++) {
                        nextDay = (currentDate.getDay() + i) % 7;
                        if (pattern.daysOfWeek.includes(nextDay)) {
                            currentDate.setDate(currentDate.getDate() + i);
                            foundNext = true;
                            break;
                        }
                    }
                    if (!foundNext) {
                        currentDate.setDate(currentDate.getDate() + 7 * pattern.interval);
                    }
                }
                else {
                    currentDate.setDate(currentDate.getDate() + 7 * pattern.interval);
                }
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + pattern.interval);
                if (pattern.dayOfMonth) {
                    currentDate.setDate(pattern.dayOfMonth);
                }
                break;
        }
    }
    return instances;
};
exports.generateRecurringInstances = generateRecurringInstances;
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
const updateRecurringSeries = (recurringReservation, updates, scope) => {
    // In a real implementation, this would update the database appropriately
    return {
        ...recurringReservation,
        ...updates,
        updatedAt: new Date(),
    };
};
exports.updateRecurringSeries = updateRecurringSeries;
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
const cancelRecurringSeries = (recurringReservation, scope, reason) => {
    const now = new Date();
    return {
        ...recurringReservation,
        status: 'cancelled',
        cancelledAt: now,
        cancellationReason: reason,
        updatedAt: now,
    };
};
exports.cancelRecurringSeries = cancelRecurringSeries;
// ============================================================================
// CATERING COORDINATION
// ============================================================================
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
const addCateringToReservation = (reservation, cateringData) => {
    const cateringRequest = {
        id: `CAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        reservationId: reservation.id,
        ...cateringData,
    };
    return {
        ...reservation,
        catering: cateringRequest,
        updatedAt: new Date(),
    };
};
exports.addCateringToReservation = addCateringToReservation;
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
const calculateCateringCost = (catering, costPerPerson) => {
    return catering.attendeeCount * costPerPerson;
};
exports.calculateCateringCost = calculateCateringCost;
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
const updateCateringStatus = (catering, newStatus) => {
    return {
        ...catering,
        status: newStatus,
    };
};
exports.updateCateringStatus = updateCateringStatus;
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
const generateCateringSummary = (catering) => {
    return {
        cateringId: catering.id,
        reservationId: catering.reservationId,
        type: catering.cateringType,
        attendeeCount: catering.attendeeCount,
        menuItems: catering.menuItems,
        dietaryRestrictions: catering.dietaryRestrictions || [],
        deliveryTime: catering.deliveryTime.toISOString(),
        estimatedCost: catering.estimatedCost,
        status: catering.status,
    };
};
exports.generateCateringSummary = generateCateringSummary;
// ============================================================================
// AV EQUIPMENT BOOKING
// ============================================================================
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
const addAVEquipmentToReservation = (reservation, equipmentData) => {
    const equipmentRequest = {
        id: `AV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        reservationId: reservation.id,
        ...equipmentData,
    };
    return {
        ...reservation,
        avEquipment: [...(reservation.avEquipment || []), equipmentRequest],
        updatedAt: new Date(),
    };
};
exports.addAVEquipmentToReservation = addAVEquipmentToReservation;
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
const removeAVEquipmentFromReservation = (reservation, equipmentId) => {
    return {
        ...reservation,
        avEquipment: (reservation.avEquipment || []).filter(eq => eq.id !== equipmentId),
        updatedAt: new Date(),
    };
};
exports.removeAVEquipmentFromReservation = removeAVEquipmentFromReservation;
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
const updateAVEquipmentStatus = (equipment, newStatus) => {
    return {
        ...equipment,
        status: newStatus,
    };
};
exports.updateAVEquipmentStatus = updateAVEquipmentStatus;
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
const generateAVSetupChecklist = (equipmentType) => {
    const baseChecklist = [
        'Verify all equipment is present',
        'Test power connections',
        'Verify functionality',
        'Clean and inspect equipment',
        'Position equipment as requested',
    ];
    const specificChecklists = {
        'Projector and Screen': [
            ...baseChecklist,
            'Align projector with screen',
            'Test HDMI/VGA connections',
            'Adjust focus and keystone',
            'Test remote control',
        ],
        'Video Conference System': [
            ...baseChecklist,
            'Test camera and microphone',
            'Verify network connectivity',
            'Test speaker output',
            'Configure remote participants',
        ],
        'Sound System': [
            ...baseChecklist,
            'Position speakers appropriately',
            'Test microphone levels',
            'Adjust volume levels',
            'Test wireless connectivity',
        ],
    };
    return specificChecklists[equipmentType] || baseChecklist;
};
exports.generateAVSetupChecklist = generateAVSetupChecklist;
// ============================================================================
// PARKING SPACE RESERVATIONS
// ============================================================================
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
const addParkingToReservation = (reservation, parkingData) => {
    const parkingRequest = {
        id: `PARK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        reservationId: reservation.id,
        ...parkingData,
    };
    return {
        ...reservation,
        parkingSpaces: [...(reservation.parkingSpaces || []), parkingRequest],
        updatedAt: new Date(),
    };
};
exports.addParkingToReservation = addParkingToReservation;
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
const checkParkingAvailability = (propertyId, spaceType, startTime, endTime, quantity, existingRequests, totalCapacity) => {
    // Find overlapping requests
    const overlapping = existingRequests.filter(req => {
        if (req.spaceType !== spaceType || req.status === 'cancelled') {
            return false;
        }
        return ((startTime >= req.startTime && startTime < req.endTime) ||
            (endTime > req.startTime && endTime <= req.endTime) ||
            (startTime <= req.startTime && endTime >= req.endTime));
    });
    const usedSpaces = overlapping.reduce((sum, req) => sum + req.quantity, 0);
    const availableSpaces = totalCapacity - usedSpaces;
    return availableSpaces >= quantity;
};
exports.checkParkingAvailability = checkParkingAvailability;
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
const updateParkingStatus = (parking, newStatus) => {
    return {
        ...parking,
        status: newStatus,
    };
};
exports.updateParkingStatus = updateParkingStatus;
// ============================================================================
// DESK HOTELING RESERVATIONS
// ============================================================================
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
const createDeskReservation = (deskData) => {
    return (0, exports.createReservation)({
        ...deskData,
        type: 'hot_desk',
    });
};
exports.createDeskReservation = createDeskReservation;
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
const findAvailableDesks = (propertyId, floor, startTime, endTime, allDesks, existingReservations) => {
    return allDesks
        .filter(desk => desk.propertyId === propertyId)
        .filter(desk => desk.type === 'hot_desk' || desk.type === 'desk')
        .filter(desk => desk.floor === floor)
        .filter(desk => desk.isActive)
        .filter(desk => (0, exports.checkResourceAvailability)(desk.id, startTime, endTime, existingReservations, desk));
};
exports.findAvailableDesks = findAvailableDesks;
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
const generateDeskUsageReport = (userId, reservations, startDate, endDate) => {
    const deskReservations = reservations
        .filter(res => res.userId === userId)
        .filter(res => res.type === 'hot_desk' || res.type === 'desk')
        .filter(res => res.startTime >= startDate && res.startTime <= endDate);
    const totalDays = deskReservations.length;
    const totalHours = deskReservations.reduce((sum, res) => {
        return sum + (0, exports.calculateReservationDuration)(res) / 60;
    }, 0);
    const preferredDesks = {};
    deskReservations.forEach(res => {
        preferredDesks[res.resourceId] = (preferredDesks[res.resourceId] || 0) + 1;
    });
    return {
        userId,
        period: { startDate, endDate },
        totalDays,
        totalHours: Math.round(totalHours * 100) / 100,
        averageHoursPerDay: totalDays > 0 ? totalHours / totalDays : 0,
        preferredDesks: Object.entries(preferredDesks)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([deskId, count]) => ({ deskId, count })),
    };
};
exports.generateDeskUsageReport = generateDeskUsageReport;
// ============================================================================
// RESERVATION CANCELLATION AND MODIFICATION
// ============================================================================
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
const cancelReservation = (reservation, cancelledBy, reason) => {
    const now = new Date();
    return {
        ...reservation,
        status: 'cancelled',
        cancelledAt: now,
        cancellationReason: reason,
        updatedAt: now,
        notes: [
            ...(reservation.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                reservationId: reservation.id,
                content: `Cancelled by ${cancelledBy}: ${reason}`,
                createdBy: cancelledBy,
                createdAt: now,
                isInternal: false,
            },
        ],
    };
};
exports.cancelReservation = cancelReservation;
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
const modifyReservation = (reservation, updates, existingReservations, resource) => {
    const modified = {
        ...reservation,
        ...updates,
        updatedAt: new Date(),
    };
    // Validate if time is being changed
    if (updates.startTime || updates.endTime) {
        const validation = (0, exports.validateReservationRequest)(modified, resource, existingReservations.filter(r => r.id !== reservation.id));
        if (!validation.isValid) {
            throw new Error(`Cannot modify reservation: ${validation.errors.join(', ')}`);
        }
    }
    return modified;
};
exports.modifyReservation = modifyReservation;
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
const extendReservation = (reservation, additionalMinutes, existingReservations, resource) => {
    const newEndTime = new Date(reservation.endTime.getTime() + additionalMinutes * 60 * 1000);
    return (0, exports.modifyReservation)(reservation, { endTime: newEndTime }, existingReservations, resource);
};
exports.extendReservation = extendReservation;
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
const calculateCancellationPenalty = (reservation, cancellationTime = new Date()) => {
    const hoursUntilStart = (reservation.startTime.getTime() - cancellationTime.getTime()) / (1000 * 60 * 60);
    if (hoursUntilStart < 0) {
        // Already started
        return reservation.cost || 0;
    }
    else if (hoursUntilStart < 2) {
        // Less than 2 hours notice - 100% penalty
        return reservation.cost || 0;
    }
    else if (hoursUntilStart < 24) {
        // Less than 24 hours notice - 50% penalty
        return (reservation.cost || 0) * 0.5;
    }
    else if (hoursUntilStart < 48) {
        // Less than 48 hours notice - 25% penalty
        return (reservation.cost || 0) * 0.25;
    }
    else {
        // 48+ hours notice - no penalty
        return 0;
    }
};
exports.calculateCancellationPenalty = calculateCancellationPenalty;
// ============================================================================
// NO-SHOW MANAGEMENT
// ============================================================================
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
const recordNoShow = (reservation, penaltyAmount) => {
    const record = {
        reservationId: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        scheduledStartTime: reservation.startTime,
        recordedAt: new Date(),
        penaltyApplied: penaltyAmount,
        notificationSent: false,
    };
    return record;
};
exports.recordNoShow = recordNoShow;
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
const markAsNoShow = (reservation) => {
    const now = new Date();
    return {
        ...reservation,
        status: 'no_show',
        updatedAt: now,
        notes: [
            ...(reservation.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                reservationId: reservation.id,
                content: 'Marked as no-show - user did not check in',
                createdBy: 'system',
                createdAt: now,
                isInternal: true,
            },
        ],
    };
};
exports.markAsNoShow = markAsNoShow;
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
const identifyPotentialNoShows = (reservations, gracePeriodMinutes = 15) => {
    const now = new Date();
    const gracePeriodMs = gracePeriodMinutes * 60 * 1000;
    return reservations.filter(res => {
        // Must be confirmed but not checked in
        if (res.status !== 'confirmed') {
            return false;
        }
        // Check if grace period has passed
        const timeSinceStart = now.getTime() - res.startTime.getTime();
        return timeSinceStart > gracePeriodMs;
    });
};
exports.identifyPotentialNoShows = identifyPotentialNoShows;
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
const calculateNoShowRate = (userId, noShowRecords, allReservations) => {
    const userReservations = allReservations.filter(res => res.userId === userId);
    const userNoShows = noShowRecords.filter(record => record.userId === userId);
    const noShowRate = userReservations.length > 0
        ? (userNoShows.length / userReservations.length) * 100
        : 0;
    return {
        userId,
        totalReservations: userReservations.length,
        noShowCount: userNoShows.length,
        noShowRate: Math.round(noShowRate * 100) / 100,
        status: noShowRate > 20 ? 'high_risk' : noShowRate > 10 ? 'moderate_risk' : 'good_standing',
    };
};
exports.calculateNoShowRate = calculateNoShowRate;
// ============================================================================
// USAGE ANALYTICS AND REPORTING
// ============================================================================
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
const generateUsageAnalytics = (resourceId, resourceName, reservations, startDate, endDate) => {
    const filtered = reservations.filter(res => res.resourceId === resourceId &&
        res.startTime >= startDate &&
        res.startTime <= endDate);
    const completed = filtered.filter(res => res.status === 'completed' || res.status === 'checked_in');
    const cancelled = filtered.filter(res => res.status === 'cancelled');
    const noShows = filtered.filter(res => res.status === 'no_show');
    // Calculate hours
    const totalHoursBooked = filtered.reduce((sum, res) => {
        return sum + (0, exports.calculateReservationDuration)(res) / 60;
    }, 0);
    const totalHoursUsed = completed.reduce((sum, res) => {
        if (res.checkInTime && res.checkOutTime) {
            const actualDuration = (res.checkOutTime.getTime() - res.checkInTime.getTime()) / (1000 * 60 * 60);
            return sum + actualDuration;
        }
        return sum + (0, exports.calculateReservationDuration)(res) / 60;
    }, 0);
    // Calculate available hours in period
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const businessHoursPerDay = 10; // 8 AM to 6 PM
    const availableHours = daysInPeriod * businessHoursPerDay;
    const utilizationRate = availableHours > 0 ? (totalHoursBooked / availableHours) * 100 : 0;
    // Average booking duration
    const avgDuration = filtered.length > 0
        ? filtered.reduce((sum, res) => sum + (0, exports.calculateReservationDuration)(res), 0) / filtered.length
        : 0;
    // Peak usage hours
    const hourCounts = {};
    filtered.forEach(res => {
        const hour = res.startTime.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakUsageHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    // Top users
    const userCounts = {};
    filtered.forEach(res => {
        if (!userCounts[res.userId]) {
            userCounts[res.userId] = { name: res.userName, count: 0 };
        }
        userCounts[res.userId].count++;
    });
    const topUsers = Object.entries(userCounts)
        .map(([userId, data]) => ({ userId, userName: data.name, bookingCount: data.count }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 10);
    // Calculate revenue
    const revenue = filtered.reduce((sum, res) => sum + (res.cost || 0), 0);
    return {
        resourceId,
        resourceName,
        period: { startDate, endDate },
        totalReservations: filtered.length,
        completedReservations: completed.length,
        cancelledReservations: cancelled.length,
        noShowCount: noShows.length,
        totalHoursBooked: Math.round(totalHoursBooked * 100) / 100,
        totalHoursUsed: Math.round(totalHoursUsed * 100) / 100,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        averageBookingDuration: Math.round(avgDuration),
        peakUsageHours,
        topUsers,
        revenue: Math.round(revenue * 100) / 100,
    };
};
exports.generateUsageAnalytics = generateUsageAnalytics;
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
const generatePropertyReservationSummary = (propertyId, reservations, startDate, endDate) => {
    const filtered = reservations.filter(res => res.propertyId === propertyId &&
        res.startTime >= startDate &&
        res.startTime <= endDate);
    const byType = {};
    filtered.forEach(res => {
        byType[res.type] = (byType[res.type] || 0) + 1;
    });
    const byStatus = {};
    filtered.forEach(res => {
        byStatus[res.status] = (byStatus[res.status] || 0) + 1;
    });
    const totalRevenue = filtered.reduce((sum, res) => sum + (res.cost || 0), 0);
    return {
        propertyId,
        period: { startDate, endDate },
        totalReservations: filtered.length,
        byType,
        byStatus,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        cateringRequests: filtered.filter(res => res.catering).length,
        avRequests: filtered.filter(res => res.avEquipment && res.avEquipment.length > 0).length,
        parkingRequests: filtered.filter(res => res.parkingSpaces && res.parkingSpaces.length > 0).length,
    };
};
exports.generatePropertyReservationSummary = generatePropertyReservationSummary;
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
const identifyUnderutilizedResources = (analytics, threshold = 30) => {
    return analytics
        .filter(a => a.utilizationRate < threshold)
        .sort((a, b) => a.utilizationRate - b.utilizationRate);
};
exports.identifyUnderutilizedResources = identifyUnderutilizedResources;
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
const calculateReservationCost = (resource, startTime, endTime) => {
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (durationHours >= 8 && resource.fullDayRate) {
        return resource.fullDayRate;
    }
    else if (durationHours >= 4 && resource.halfDayRate) {
        return resource.halfDayRate;
    }
    else if (resource.hourlyRate) {
        return resource.hourlyRate * Math.ceil(durationHours);
    }
    return 0;
};
exports.calculateReservationCost = calculateReservationCost;
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
const generateRevenueReport = (reservations, startDate, endDate) => {
    const filtered = reservations.filter(res => res.startTime >= startDate &&
        res.startTime <= endDate &&
        res.status !== 'cancelled');
    const byType = {};
    filtered.forEach(res => {
        byType[res.type] = (byType[res.type] || 0) + (res.cost || 0);
    });
    const totalRevenue = Object.values(byType).reduce((sum, val) => sum + val, 0);
    return {
        period: { startDate, endDate },
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        byType: Object.fromEntries(Object.entries(byType).map(([type, revenue]) => [
            type,
            Math.round(revenue * 100) / 100,
        ])),
        totalReservations: filtered.length,
        averageRevenuePerReservation: filtered.length > 0
            ? Math.round((totalRevenue / filtered.length) * 100) / 100
            : 0,
    };
};
exports.generateRevenueReport = generateRevenueReport;
//# sourceMappingURL=property-reservations-kit.js.map