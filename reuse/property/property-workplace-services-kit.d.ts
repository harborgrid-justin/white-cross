/**
 * LOC: PROP-WS-001
 * File: /reuse/property/property-workplace-services-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Tenant experience platforms
 *   - Workplace services modules
 */
/**
 * File: /reuse/property/property-workplace-services-kit.ts
 * Locator: WC-PROP-WS-001
 * Purpose: Workplace Services Management Kit - Comprehensive workplace experience and service delivery
 *
 * Upstream: Independent utility module for workplace services operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for workplace services, visitor management, concierge, amenities, and tenant experience
 *
 * LLM Context: Enterprise-grade workplace services management utilities for modern property management systems.
 * Provides facility service requests, visitor management, mail/package handling, concierge services, event
 * space booking, amenity reservations, service level tracking, satisfaction surveys, and comprehensive
 * employee experience features. Essential for creating premium workplace environments, enhancing tenant
 * satisfaction, and delivering exceptional building services.
 */
interface ServiceRequest {
    id: string;
    propertyId: string;
    tenantId: string;
    requestedBy: string;
    requestedByEmail: string;
    category: ServiceCategory;
    priority: ServicePriority;
    status: ServiceStatus;
    title: string;
    description: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    scheduledDate?: Date;
    completedAt?: Date;
    assignedTo?: string;
    estimatedResolution?: number;
    actualResolution?: number;
    satisfactionRating?: number;
    feedback?: string;
    attachments?: ServiceAttachment[];
    tags?: string[];
}
type ServiceCategory = 'cleaning' | 'maintenance' | 'it_support' | 'security' | 'hvac' | 'reception' | 'catering' | 'supplies' | 'accessibility' | 'parking' | 'concierge' | 'other';
type ServicePriority = 'urgent' | 'high' | 'normal' | 'low';
type ServiceStatus = 'submitted' | 'acknowledged' | 'assigned' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled' | 'on_hold';
interface ServiceAttachment {
    id: string;
    requestId: string;
    url: string;
    filename: string;
    type: string;
    uploadedAt: Date;
}
interface Visitor {
    id: string;
    propertyId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    visitPurpose: string;
    hostName: string;
    hostEmail: string;
    hostTenantId: string;
    expectedArrival: Date;
    actualArrival?: Date;
    actualDeparture?: Date;
    status: VisitorStatus;
    badgeNumber?: string;
    parkingSpot?: string;
    specialInstructions?: string;
    checkInLocation: string;
    isPreRegistered: boolean;
    requiresEscort: boolean;
    visitType: 'business' | 'delivery' | 'contractor' | 'interview' | 'event' | 'other';
    createdAt: Date;
    updatedAt: Date;
}
type VisitorStatus = 'pre_registered' | 'expected' | 'checked_in' | 'on_premises' | 'checked_out' | 'no_show' | 'denied';
interface MailPackage {
    id: string;
    propertyId: string;
    trackingNumber?: string;
    recipientName: string;
    recipientTenantId: string;
    recipientUnit: string;
    carrier: PackageCarrier;
    packageType: PackageType;
    size: PackageSize;
    status: PackageStatus;
    receivedDate: Date;
    receivedBy: string;
    notifiedAt?: Date;
    pickedUpAt?: Date;
    pickedUpBy?: string;
    storageLocation: string;
    requiresSignature: boolean;
    isFragile: boolean;
    notes?: string;
    imageUrl?: string;
}
type PackageCarrier = 'usps' | 'fedex' | 'ups' | 'dhl' | 'amazon' | 'courier' | 'other';
type PackageType = 'letter' | 'package' | 'box' | 'envelope' | 'pallet' | 'other';
type PackageSize = 'small' | 'medium' | 'large' | 'oversized';
type PackageStatus = 'received' | 'stored' | 'ready_for_pickup' | 'notified' | 'picked_up' | 'returned_to_sender' | 'lost';
interface ConciergeRequest {
    id: string;
    propertyId: string;
    tenantId: string;
    requestedBy: string;
    requestType: ConciergeServiceType;
    priority: ServicePriority;
    status: ServiceStatus;
    description: string;
    requestedDate: Date;
    desiredCompletionDate?: Date;
    completedAt?: Date;
    assignedTo?: string;
    cost?: number;
    isPaid: boolean;
    notes?: string;
    satisfactionRating?: number;
}
type ConciergeServiceType = 'restaurant_reservation' | 'event_tickets' | 'transportation' | 'travel_booking' | 'dry_cleaning' | 'car_wash' | 'grocery_delivery' | 'gift_purchase' | 'meeting_setup' | 'other';
interface EventSpace {
    id: string;
    propertyId: string;
    name: string;
    floor: string;
    capacity: number;
    amenities: string[];
    hourlyRate: number;
    halfDayRate: number;
    fullDayRate: number;
    isAvailable: boolean;
    features: SpaceFeature[];
    setupTime: number;
    cleanupTime: number;
    images?: string[];
    restrictions?: string[];
}
interface SpaceFeature {
    name: string;
    type: 'technology' | 'furniture' | 'catering' | 'accessibility' | 'other';
    description: string;
}
interface EventBooking {
    id: string;
    spaceId: string;
    propertyId: string;
    tenantId: string;
    organizerName: string;
    organizerEmail: string;
    eventTitle: string;
    eventDescription: string;
    startTime: Date;
    endTime: Date;
    expectedAttendees: number;
    setupRequirements?: string[];
    cateringNeeded: boolean;
    cateringDetails?: string;
    avNeeds?: string[];
    status: BookingStatus;
    totalCost: number;
    depositPaid: boolean;
    depositAmount?: number;
    specialRequests?: string;
    createdAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
}
type BookingStatus = 'requested' | 'pending_approval' | 'approved' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
interface Amenity {
    id: string;
    propertyId: string;
    name: string;
    type: AmenityType;
    location: string;
    capacity: number;
    isReservable: boolean;
    requiresPayment: boolean;
    costPerHour?: number;
    operatingHours: OperatingHours;
    availableDays: number[];
    minimumReservation?: number;
    maximumReservation?: number;
    advanceBookingDays: number;
    cancellationPolicy: string;
    rules?: string[];
    isActive: boolean;
}
type AmenityType = 'fitness_center' | 'conference_room' | 'lounge' | 'rooftop' | 'game_room' | 'phone_booth' | 'wellness_room' | 'parking_space' | 'bike_storage' | 'shower' | 'kitchen' | 'terrace' | 'other';
interface OperatingHours {
    monday?: {
        open: string;
        close: string;
    };
    tuesday?: {
        open: string;
        close: string;
    };
    wednesday?: {
        open: string;
        close: string;
    };
    thursday?: {
        open: string;
        close: string;
    };
    friday?: {
        open: string;
        close: string;
    };
    saturday?: {
        open: string;
        close: string;
    };
    sunday?: {
        open: string;
        close: string;
    };
}
interface AmenityReservation {
    id: string;
    amenityId: string;
    tenantId: string;
    reservedBy: string;
    reservedByEmail: string;
    startTime: Date;
    endTime: Date;
    attendees: number;
    purpose?: string;
    status: 'active' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
    totalCost?: number;
    isPaid: boolean;
    createdAt: Date;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
}
interface ServiceLevelAgreement {
    category: ServiceCategory;
    responseTime: number;
    resolutionTime: number;
    availabilityHours: string;
    escalationPath: string[];
    performanceTargets: {
        firstResponseRate: number;
        resolutionRate: number;
        satisfactionTarget: number;
    };
}
interface TenantSatisfactionSurvey {
    id: string;
    propertyId: string;
    tenantId: string;
    surveyType: 'service_request' | 'quarterly' | 'annual' | 'exit' | 'event';
    relatedEntityId?: string;
    submittedAt: Date;
    responses: SurveyResponse[];
    overallRating: number;
    npsScore?: number;
    wouldRecommend: boolean;
    comments?: string;
}
interface SurveyResponse {
    question: string;
    category: 'service' | 'facilities' | 'staff' | 'communication' | 'value' | 'other';
    rating: number;
    comment?: string;
}
interface EmployeeExperienceMetrics {
    propertyId: string;
    tenantId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    serviceRequestCount: number;
    averageResolutionTime: number;
    satisfactionScore: number;
    amenityUsage: number;
    eventParticipation: number;
    npsScore: number;
    retentionIndicators: {
        leaseRenewalLikelihood: number;
        spaceExpansionInterest: number;
        referralCount: number;
    };
}
interface ServicePerformanceMetrics {
    totalRequests: number;
    completedRequests: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    satisfactionScore: number;
    slaCompliance: number;
    byCategory: Record<ServiceCategory, number>;
    byPriority: Record<ServicePriority, number>;
    trends: {
        weekOverWeek: number;
        monthOverMonth: number;
    };
}
/**
 * Creates a new facility service request.
 *
 * @param {Partial<ServiceRequest>} requestData - Service request data
 * @returns {ServiceRequest} Created service request
 *
 * @example
 * ```typescript
 * const request = createServiceRequest({
 *   propertyId: 'PROP-001',
 *   tenantId: 'TENANT-123',
 *   requestedBy: 'John Doe',
 *   requestedByEmail: 'john@company.com',
 *   category: 'cleaning',
 *   priority: 'normal',
 *   title: 'Office cleaning needed',
 *   description: 'Please clean conference room after event',
 *   location: 'Floor 5, Conference Room B'
 * });
 * ```
 */
export declare const createServiceRequest: (requestData: Partial<ServiceRequest>) => ServiceRequest;
/**
 * Assigns a service request to a staff member.
 *
 * @param {ServiceRequest} request - Service request to assign
 * @param {string} assigneeId - Staff member ID
 * @returns {ServiceRequest} Updated service request
 *
 * @example
 * ```typescript
 * const assigned = assignServiceRequest(request, 'staff-456');
 * ```
 */
export declare const assignServiceRequest: (request: ServiceRequest, assigneeId: string) => ServiceRequest;
/**
 * Updates service request status with automatic timestamp tracking.
 *
 * @param {ServiceRequest} request - Service request
 * @param {ServiceStatus} newStatus - New status
 * @returns {ServiceRequest} Updated service request
 *
 * @example
 * ```typescript
 * const updated = updateServiceRequestStatus(request, 'completed');
 * ```
 */
export declare const updateServiceRequestStatus: (request: ServiceRequest, newStatus: ServiceStatus) => ServiceRequest;
/**
 * Calculates service request priority score for queue management.
 *
 * @param {ServiceRequest} request - Service request
 * @returns {number} Priority score (higher = more urgent)
 *
 * @example
 * ```typescript
 * const score = calculateServicePriorityScore(request);
 * // Returns: 85 (for urgent request)
 * ```
 */
export declare const calculateServicePriorityScore: (request: ServiceRequest) => number;
/**
 * Sorts service requests by priority for processing queue.
 *
 * @param {ServiceRequest[]} requests - Array of service requests
 * @returns {ServiceRequest[]} Sorted requests (highest priority first)
 *
 * @example
 * ```typescript
 * const sorted = sortServiceRequestsByPriority(requests);
 * ```
 */
export declare const sortServiceRequestsByPriority: (requests: ServiceRequest[]) => ServiceRequest[];
/**
 * Pre-registers a visitor for upcoming visit.
 *
 * @param {Partial<Visitor>} visitorData - Visitor data
 * @returns {Visitor} Pre-registered visitor record
 *
 * @example
 * ```typescript
 * const visitor = preRegisterVisitor({
 *   propertyId: 'PROP-001',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane@example.com',
 *   company: 'Acme Corp',
 *   visitPurpose: 'Business meeting',
 *   hostName: 'John Doe',
 *   hostEmail: 'john@company.com',
 *   hostTenantId: 'TENANT-123',
 *   expectedArrival: new Date('2025-11-09T14:00:00'),
 *   visitType: 'business'
 * });
 * ```
 */
export declare const preRegisterVisitor: (visitorData: Partial<Visitor>) => Visitor;
/**
 * Checks in a visitor and assigns badge.
 *
 * @param {Visitor} visitor - Visitor to check in
 * @param {string} badgeNumber - Assigned badge number
 * @param {string} parkingSpot - Assigned parking spot (optional)
 * @returns {Visitor} Updated visitor with check-in details
 *
 * @example
 * ```typescript
 * const checkedIn = checkInVisitor(visitor, 'BADGE-123', 'P2-45');
 * ```
 */
export declare const checkInVisitor: (visitor: Visitor, badgeNumber: string, parkingSpot?: string) => Visitor;
/**
 * Checks out a visitor and collects badge.
 *
 * @param {Visitor} visitor - Visitor to check out
 * @returns {Visitor} Updated visitor with check-out details
 *
 * @example
 * ```typescript
 * const checkedOut = checkOutVisitor(visitor);
 * ```
 */
export declare const checkOutVisitor: (visitor: Visitor) => Visitor;
/**
 * Sends visitor notification to host.
 *
 * @param {Visitor} visitor - Visitor information
 * @param {string} notificationType - Type of notification
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendVisitorNotification(visitor, 'arrival');
 * ```
 */
export declare const sendVisitorNotification: (visitor: Visitor, notificationType: "pre_arrival" | "arrival" | "waiting" | "no_show") => object;
/**
 * Gets current visitors on premises.
 *
 * @param {Visitor[]} visitors - All visitor records
 * @param {string} propertyId - Property ID
 * @returns {Visitor[]} Currently checked-in visitors
 *
 * @example
 * ```typescript
 * const onPremises = getCurrentVisitors(allVisitors, 'PROP-001');
 * ```
 */
export declare const getCurrentVisitors: (visitors: Visitor[], propertyId: string) => Visitor[];
/**
 * Records incoming mail or package delivery.
 *
 * @param {Partial<MailPackage>} packageData - Package information
 * @returns {MailPackage} Recorded package
 *
 * @example
 * ```typescript
 * const pkg = recordPackageDelivery({
 *   propertyId: 'PROP-001',
 *   trackingNumber: '1Z999AA10123456784',
 *   recipientName: 'John Doe',
 *   recipientTenantId: 'TENANT-123',
 *   recipientUnit: 'Suite 500',
 *   carrier: 'ups',
 *   packageType: 'box',
 *   size: 'medium',
 *   receivedBy: 'Reception Staff',
 *   storageLocation: 'Mailroom A-15',
 *   requiresSignature: true
 * });
 * ```
 */
export declare const recordPackageDelivery: (packageData: Partial<MailPackage>) => MailPackage;
/**
 * Notifies recipient of package arrival.
 *
 * @param {MailPackage} mailPackage - Package to notify about
 * @returns {MailPackage} Updated package with notification timestamp
 *
 * @example
 * ```typescript
 * const notified = notifyPackageRecipient(pkg);
 * ```
 */
export declare const notifyPackageRecipient: (mailPackage: MailPackage) => MailPackage;
/**
 * Records package pickup.
 *
 * @param {MailPackage} mailPackage - Package being picked up
 * @param {string} pickedUpBy - Person picking up package
 * @returns {MailPackage} Updated package with pickup details
 *
 * @example
 * ```typescript
 * const pickedUp = recordPackagePickup(pkg, 'John Doe');
 * ```
 */
export declare const recordPackagePickup: (mailPackage: MailPackage, pickedUpBy: string) => MailPackage;
/**
 * Gets pending packages for a tenant.
 *
 * @param {MailPackage[]} packages - All packages
 * @param {string} tenantId - Tenant ID
 * @returns {MailPackage[]} Pending packages for tenant
 *
 * @example
 * ```typescript
 * const pending = getPendingPackages(allPackages, 'TENANT-123');
 * ```
 */
export declare const getPendingPackages: (packages: MailPackage[], tenantId: string) => MailPackage[];
/**
 * Generates package storage report.
 *
 * @param {MailPackage[]} packages - All packages
 * @param {string} propertyId - Property ID
 * @returns {object} Storage report with analytics
 *
 * @example
 * ```typescript
 * const report = generatePackageStorageReport(packages, 'PROP-001');
 * ```
 */
export declare const generatePackageStorageReport: (packages: MailPackage[], propertyId: string) => object;
/**
 * Creates a concierge service request.
 *
 * @param {Partial<ConciergeRequest>} requestData - Concierge request data
 * @returns {ConciergeRequest} Created concierge request
 *
 * @example
 * ```typescript
 * const request = createConciergeRequest({
 *   propertyId: 'PROP-001',
 *   tenantId: 'TENANT-123',
 *   requestedBy: 'John Doe',
 *   requestType: 'restaurant_reservation',
 *   priority: 'normal',
 *   description: 'Dinner reservation for 4 at upscale Italian restaurant',
 *   desiredCompletionDate: new Date('2025-11-15T19:00:00')
 * });
 * ```
 */
export declare const createConciergeRequest: (requestData: Partial<ConciergeRequest>) => ConciergeRequest;
/**
 * Completes a concierge request with details.
 *
 * @param {ConciergeRequest} request - Concierge request
 * @param {number} cost - Service cost (if applicable)
 * @param {string} completionNotes - Completion notes
 * @returns {ConciergeRequest} Completed request
 *
 * @example
 * ```typescript
 * const completed = completeConciergeRequest(
 *   request,
 *   25.00,
 *   'Reservation confirmed at La Bella Vista for 4 guests at 7pm'
 * );
 * ```
 */
export declare const completeConciergeRequest: (request: ConciergeRequest, cost: number, completionNotes: string) => ConciergeRequest;
/**
 * Calculates concierge service utilization metrics.
 *
 * @param {ConciergeRequest[]} requests - All concierge requests
 * @param {string} tenantId - Tenant ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateConciergeUtilization(
 *   requests,
 *   'TENANT-123',
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const calculateConciergeUtilization: (requests: ConciergeRequest[], tenantId: string, startDate: Date, endDate: Date) => object;
/**
 * Creates an event space listing.
 *
 * @param {Partial<EventSpace>} spaceData - Event space data
 * @returns {EventSpace} Created event space
 *
 * @example
 * ```typescript
 * const space = createEventSpace({
 *   propertyId: 'PROP-001',
 *   name: 'Skyline Conference Center',
 *   floor: '15th Floor',
 *   capacity: 50,
 *   amenities: ['Projector', 'Whiteboard', 'Video Conferencing'],
 *   hourlyRate: 150,
 *   halfDayRate: 500,
 *   fullDayRate: 900,
 *   features: [
 *     { name: '4K Projector', type: 'technology', description: 'High-definition projection' }
 *   ]
 * });
 * ```
 */
export declare const createEventSpace: (spaceData: Partial<EventSpace>) => EventSpace;
/**
 * Creates an event space booking.
 *
 * @param {Partial<EventBooking>} bookingData - Booking data
 * @param {EventSpace} space - Event space being booked
 * @returns {EventBooking} Created booking
 *
 * @example
 * ```typescript
 * const booking = createEventBooking({
 *   tenantId: 'TENANT-123',
 *   organizerName: 'Jane Smith',
 *   organizerEmail: 'jane@company.com',
 *   eventTitle: 'Q4 All-Hands Meeting',
 *   eventDescription: 'Company-wide quarterly meeting',
 *   startTime: new Date('2025-11-15T14:00:00'),
 *   endTime: new Date('2025-11-15T17:00:00'),
 *   expectedAttendees: 45,
 *   cateringNeeded: true,
 *   avNeeds: ['Microphone', 'Projector']
 * }, eventSpace);
 * ```
 */
export declare const createEventBooking: (bookingData: Partial<EventBooking>, space: EventSpace) => EventBooking;
/**
 * Checks event space availability for requested time.
 *
 * @param {EventSpace} space - Event space
 * @param {Date} startTime - Requested start time
 * @param {Date} endTime - Requested end time
 * @param {EventBooking[]} existingBookings - Existing bookings
 * @returns {boolean} True if available
 *
 * @example
 * ```typescript
 * const available = checkEventSpaceAvailability(
 *   space,
 *   new Date('2025-11-15T14:00:00'),
 *   new Date('2025-11-15T17:00:00'),
 *   existingBookings
 * );
 * ```
 */
export declare const checkEventSpaceAvailability: (space: EventSpace, startTime: Date, endTime: Date, existingBookings: EventBooking[]) => boolean;
/**
 * Approves an event booking.
 *
 * @param {EventBooking} booking - Booking to approve
 * @param {string} approvedBy - Approver ID
 * @returns {EventBooking} Approved booking
 *
 * @example
 * ```typescript
 * const approved = approveEventBooking(booking, 'manager-123');
 * ```
 */
export declare const approveEventBooking: (booking: EventBooking, approvedBy: string) => EventBooking;
/**
 * Creates an amenity for reservation system.
 *
 * @param {Partial<Amenity>} amenityData - Amenity data
 * @returns {Amenity} Created amenity
 *
 * @example
 * ```typescript
 * const amenity = createAmenity({
 *   propertyId: 'PROP-001',
 *   name: 'Fitness Center',
 *   type: 'fitness_center',
 *   location: '2nd Floor',
 *   capacity: 20,
 *   isReservable: true,
 *   requiresPayment: false,
 *   operatingHours: {
 *     monday: { open: '06:00', close: '22:00' },
 *     tuesday: { open: '06:00', close: '22:00' }
 *   },
 *   availableDays: [1, 2, 3, 4, 5],
 *   advanceBookingDays: 7,
 *   cancellationPolicy: '24 hours notice required'
 * });
 * ```
 */
export declare const createAmenity: (amenityData: Partial<Amenity>) => Amenity;
/**
 * Creates an amenity reservation.
 *
 * @param {Partial<AmenityReservation>} reservationData - Reservation data
 * @param {Amenity} amenity - Amenity being reserved
 * @returns {AmenityReservation} Created reservation
 *
 * @example
 * ```typescript
 * const reservation = createAmenityReservation({
 *   tenantId: 'TENANT-123',
 *   reservedBy: 'John Doe',
 *   reservedByEmail: 'john@company.com',
 *   startTime: new Date('2025-11-10T08:00:00'),
 *   endTime: new Date('2025-11-10T09:00:00'),
 *   attendees: 1,
 *   purpose: 'Morning workout'
 * }, amenity);
 * ```
 */
export declare const createAmenityReservation: (reservationData: Partial<AmenityReservation>, amenity: Amenity) => AmenityReservation;
/**
 * Validates amenity reservation against business rules.
 *
 * @param {Amenity} amenity - Amenity to reserve
 * @param {Date} startTime - Requested start time
 * @param {Date} endTime - Requested end time
 * @param {AmenityReservation[]} existingReservations - Existing reservations
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAmenityReservation(
 *   amenity,
 *   startTime,
 *   endTime,
 *   existingReservations
 * );
 * if (validation.isValid) {
 *   // Create reservation
 * }
 * ```
 */
export declare const validateAmenityReservation: (amenity: Amenity, startTime: Date, endTime: Date, existingReservations: AmenityReservation[]) => {
    isValid: boolean;
    errors: string[];
};
/**
 * Cancels an amenity reservation.
 *
 * @param {AmenityReservation} reservation - Reservation to cancel
 * @param {Amenity} amenity - Associated amenity
 * @returns {object} Cancellation result with refund information
 *
 * @example
 * ```typescript
 * const result = cancelAmenityReservation(reservation, amenity);
 * ```
 */
export declare const cancelAmenityReservation: (reservation: AmenityReservation, amenity: Amenity) => {
    reservation: AmenityReservation;
    refundAmount: number;
    refundPercentage: number;
};
/**
 * Defines service level agreement for a service category.
 *
 * @param {ServiceCategory} category - Service category
 * @param {Partial<ServiceLevelAgreement>} slaData - SLA data
 * @returns {ServiceLevelAgreement} Defined SLA
 *
 * @example
 * ```typescript
 * const sla = defineServiceLevelAgreement('hvac', {
 *   responseTime: 30,
 *   resolutionTime: 240,
 *   availabilityHours: '24/7',
 *   escalationPath: ['technician', 'supervisor', 'director'],
 *   performanceTargets: {
 *     firstResponseRate: 95,
 *     resolutionRate: 90,
 *     satisfactionTarget: 4.2
 *   }
 * });
 * ```
 */
export declare const defineServiceLevelAgreement: (category: ServiceCategory, slaData: Partial<ServiceLevelAgreement>) => ServiceLevelAgreement;
/**
 * Calculates SLA compliance for service requests.
 *
 * @param {ServiceRequest[]} requests - Service requests
 * @param {ServiceLevelAgreement} sla - SLA to measure against
 * @returns {object} SLA compliance metrics
 *
 * @example
 * ```typescript
 * const compliance = calculateSLACompliance(requests, sla);
 * // Returns: { complianceRate: 92.5, breaches: 3, ... }
 * ```
 */
export declare const calculateSLACompliance: (requests: ServiceRequest[], sla: ServiceLevelAgreement) => object;
/**
 * Identifies service requests requiring SLA escalation.
 *
 * @param {ServiceRequest[]} requests - Active service requests
 * @param {ServiceLevelAgreement[]} slas - SLA definitions
 * @returns {Array<{request: ServiceRequest, reason: string}>} Requests requiring escalation
 *
 * @example
 * ```typescript
 * const escalations = identifyEscalations(activeRequests, slas);
 * ```
 */
export declare const identifyEscalations: (requests: ServiceRequest[], slas: ServiceLevelAgreement[]) => Array<{
    request: ServiceRequest;
    reason: string;
    escalationLevel: number;
}>;
/**
 * Creates a tenant satisfaction survey.
 *
 * @param {Partial<TenantSatisfactionSurvey>} surveyData - Survey data
 * @returns {TenantSatisfactionSurvey} Created survey
 *
 * @example
 * ```typescript
 * const survey = createSatisfactionSurvey({
 *   propertyId: 'PROP-001',
 *   tenantId: 'TENANT-123',
 *   surveyType: 'service_request',
 *   relatedEntityId: 'SR-456',
 *   responses: [
 *     { question: 'How satisfied were you with the response time?', category: 'service', rating: 5 },
 *     { question: 'Was the issue resolved to your satisfaction?', category: 'service', rating: 4 }
 *   ],
 *   overallRating: 4.5,
 *   wouldRecommend: true
 * });
 * ```
 */
export declare const createSatisfactionSurvey: (surveyData: Partial<TenantSatisfactionSurvey>) => TenantSatisfactionSurvey;
/**
 * Calculates Net Promoter Score (NPS) from surveys.
 *
 * @param {TenantSatisfactionSurvey[]} surveys - Surveys with NPS scores
 * @returns {object} NPS analysis
 *
 * @example
 * ```typescript
 * const nps = calculateNPS(surveys);
 * // Returns: { score: 42, promoters: 60, passives: 30, detractors: 10 }
 * ```
 */
export declare const calculateNPS: (surveys: TenantSatisfactionSurvey[]) => object;
/**
 * Analyzes satisfaction trends over time.
 *
 * @param {TenantSatisfactionSurvey[]} surveys - Historical surveys
 * @param {string} propertyId - Property ID
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = analyzeSatisfactionTrends(surveys, 'PROP-001');
 * ```
 */
export declare const analyzeSatisfactionTrends: (surveys: TenantSatisfactionSurvey[], propertyId: string) => object;
/**
 * Generates service performance metrics.
 *
 * @param {ServiceRequest[]} requests - Service requests
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {ServicePerformanceMetrics} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = generateServicePerformanceMetrics(
 *   requests,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateServicePerformanceMetrics: (requests: ServiceRequest[], startDate: Date, endDate: Date) => ServicePerformanceMetrics;
/**
 * Prioritizes service request queue based on multiple factors.
 *
 * @param {ServiceRequest[]} requests - Pending service requests
 * @param {ServiceLevelAgreement[]} slas - SLA definitions
 * @returns {ServiceRequest[]} Prioritized request queue
 *
 * @example
 * ```typescript
 * const queue = prioritizeServiceQueue(pendingRequests, slas);
 * ```
 */
export declare const prioritizeServiceQueue: (requests: ServiceRequest[], slas: ServiceLevelAgreement[]) => ServiceRequest[];
/**
 * Calculates comprehensive employee experience metrics.
 *
 * @param {object} data - All service data
 * @returns {EmployeeExperienceMetrics} Experience metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateEmployeeExperience({
 *   propertyId: 'PROP-001',
 *   tenantId: 'TENANT-123',
 *   period: { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') },
 *   serviceRequests: requests,
 *   amenityReservations: reservations,
 *   eventBookings: bookings,
 *   surveys: surveys
 * });
 * ```
 */
export declare const calculateEmployeeExperience: (data: {
    propertyId: string;
    tenantId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    serviceRequests: ServiceRequest[];
    amenityReservations: AmenityReservation[];
    eventBookings: EventBooking[];
    surveys: TenantSatisfactionSurvey[];
}) => EmployeeExperienceMetrics;
/**
 * Generates workplace experience dashboard data.
 *
 * @param {string} propertyId - Property ID
 * @param {object} allData - All workplace services data
 * @returns {object} Dashboard metrics and insights
 *
 * @example
 * ```typescript
 * const dashboard = generateWorkplaceDashboard('PROP-001', {
 *   serviceRequests,
 *   visitors,
 *   packages,
 *   amenityReservations,
 *   eventBookings,
 *   surveys
 * });
 * ```
 */
export declare const generateWorkplaceDashboard: (propertyId: string, allData: {
    serviceRequests: ServiceRequest[];
    visitors: Visitor[];
    packages: MailPackage[];
    amenityReservations: AmenityReservation[];
    eventBookings: EventBooking[];
    surveys: TenantSatisfactionSurvey[];
}) => object;
/**
 * Generates visitor access badge information.
 *
 * @param {Visitor} visitor - Visitor to generate badge for
 * @param {number} badgeNumber - Badge number
 * @returns {object} Badge information for printing/display
 *
 * @example
 * ```typescript
 * const badge = generateVisitorBadge(visitor, 1234);
 * // Use badge data to print physical badge or display digital badge
 * ```
 */
export declare const generateVisitorBadge: (visitor: Visitor, badgeNumber: number) => object;
/**
 * Sends bulk notification to tenants (building announcements).
 *
 * @param {string} propertyId - Property ID
 * @param {string[]} tenantIds - Array of tenant IDs to notify
 * @param {object} notification - Notification details
 * @returns {object} Notification result
 *
 * @example
 * ```typescript
 * const result = sendBulkTenantNotification('PROP-001', ['TENANT-123', 'TENANT-456'], {
 *   subject: 'Scheduled Maintenance',
 *   message: 'HVAC maintenance scheduled for Saturday 8am-12pm',
 *   priority: 'normal',
 *   channels: ['email', 'push']
 * });
 * ```
 */
export declare const sendBulkTenantNotification: (propertyId: string, tenantIds: string[], notification: {
    subject: string;
    message: string;
    priority: "urgent" | "high" | "normal" | "low";
    channels: Array<"email" | "sms" | "push" | "in_app">;
    scheduledFor?: Date;
    expiresAt?: Date;
    actionUrl?: string;
}) => object;
/**
 * Tracks amenity utilization and popularity metrics.
 *
 * @param {Amenity} amenity - Amenity to analyze
 * @param {AmenityReservation[]} reservations - All reservations
 * @param {Date} startDate - Analysis period start
 * @param {Date} endDate - Analysis period end
 * @returns {object} Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = trackAmenityUtilization(
 *   amenity,
 *   reservations,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const trackAmenityUtilization: (amenity: Amenity, reservations: AmenityReservation[], startDate: Date, endDate: Date) => object;
/**
 * Exports comprehensive workplace services report.
 *
 * @param {string} propertyId - Property ID
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {object} allData - All workplace services data
 * @returns {object} Comprehensive report data
 *
 * @example
 * ```typescript
 * const report = exportWorkplaceServicesReport('PROP-001',
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30'),
 *   { serviceRequests, visitors, packages, amenityReservations, eventBookings, surveys }
 * );
 * // Use report data to generate PDF, Excel, or dashboard visualizations
 * ```
 */
export declare const exportWorkplaceServicesReport: (propertyId: string, startDate: Date, endDate: Date, allData: {
    serviceRequests: ServiceRequest[];
    visitors: Visitor[];
    packages: MailPackage[];
    amenityReservations: AmenityReservation[];
    eventBookings: EventBooking[];
    surveys: TenantSatisfactionSurvey[];
    conciergeRequests: ConciergeRequest[];
}) => object;
export {};
//# sourceMappingURL=property-workplace-services-kit.d.ts.map