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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  estimatedResolution?: number; // in minutes
  actualResolution?: number; // in minutes
  satisfactionRating?: number; // 1-5
  feedback?: string;
  attachments?: ServiceAttachment[];
  tags?: string[];
}

type ServiceCategory =
  | 'cleaning'
  | 'maintenance'
  | 'it_support'
  | 'security'
  | 'hvac'
  | 'reception'
  | 'catering'
  | 'supplies'
  | 'accessibility'
  | 'parking'
  | 'concierge'
  | 'other';

type ServicePriority = 'urgent' | 'high' | 'normal' | 'low';

type ServiceStatus =
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'in_progress'
  | 'pending_approval'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

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

type VisitorStatus =
  | 'pre_registered'
  | 'expected'
  | 'checked_in'
  | 'on_premises'
  | 'checked_out'
  | 'no_show'
  | 'denied';

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

type PackageStatus =
  | 'received'
  | 'stored'
  | 'ready_for_pickup'
  | 'notified'
  | 'picked_up'
  | 'returned_to_sender'
  | 'lost';

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

type ConciergeServiceType =
  | 'restaurant_reservation'
  | 'event_tickets'
  | 'transportation'
  | 'travel_booking'
  | 'dry_cleaning'
  | 'car_wash'
  | 'grocery_delivery'
  | 'gift_purchase'
  | 'meeting_setup'
  | 'other';

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
  setupTime: number; // in minutes
  cleanupTime: number; // in minutes
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

type BookingStatus =
  | 'requested'
  | 'pending_approval'
  | 'approved'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

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
  availableDays: number[]; // 0-6 (Sunday-Saturday)
  minimumReservation?: number; // in minutes
  maximumReservation?: number; // in minutes
  advanceBookingDays: number;
  cancellationPolicy: string;
  rules?: string[];
  isActive: boolean;
}

type AmenityType =
  | 'fitness_center'
  | 'conference_room'
  | 'lounge'
  | 'rooftop'
  | 'game_room'
  | 'phone_booth'
  | 'wellness_room'
  | 'parking_space'
  | 'bike_storage'
  | 'shower'
  | 'kitchen'
  | 'terrace'
  | 'other';

interface OperatingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
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
  responseTime: number; // in minutes
  resolutionTime: number; // in minutes
  availabilityHours: string;
  escalationPath: string[];
  performanceTargets: {
    firstResponseRate: number; // percentage
    resolutionRate: number; // percentage
    satisfactionTarget: number; // 1-5 rating
  };
}

interface TenantSatisfactionSurvey {
  id: string;
  propertyId: string;
  tenantId: string;
  surveyType: 'service_request' | 'quarterly' | 'annual' | 'exit' | 'event';
  relatedEntityId?: string; // Service request ID, event ID, etc.
  submittedAt: Date;
  responses: SurveyResponse[];
  overallRating: number; // 1-5
  npsScore?: number; // 0-10
  wouldRecommend: boolean;
  comments?: string;
}

interface SurveyResponse {
  question: string;
  category: 'service' | 'facilities' | 'staff' | 'communication' | 'value' | 'other';
  rating: number; // 1-5
  comment?: string;
}

interface EmployeeExperienceMetrics {
  propertyId: string;
  tenantId: string;
  period: { startDate: Date; endDate: Date };
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
  slaCompliance: number; // percentage
  byCategory: Record<ServiceCategory, number>;
  byPriority: Record<ServicePriority, number>;
  trends: {
    weekOverWeek: number; // percentage change
    monthOverMonth: number;
  };
}

// ============================================================================
// FACILITY SERVICE REQUESTS
// ============================================================================

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
export const createServiceRequest = (requestData: Partial<ServiceRequest>): ServiceRequest => {
  const now = new Date();

  const request: ServiceRequest = {
    id: requestData.id || `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: requestData.propertyId!,
    tenantId: requestData.tenantId!,
    requestedBy: requestData.requestedBy!,
    requestedByEmail: requestData.requestedByEmail!,
    category: requestData.category || 'other',
    priority: requestData.priority || 'normal',
    status: requestData.status || 'submitted',
    title: requestData.title || '',
    description: requestData.description || '',
    location: requestData.location || '',
    createdAt: requestData.createdAt || now,
    updatedAt: now,
    scheduledDate: requestData.scheduledDate,
    completedAt: requestData.completedAt,
    assignedTo: requestData.assignedTo,
    estimatedResolution: requestData.estimatedResolution,
    actualResolution: requestData.actualResolution,
    satisfactionRating: requestData.satisfactionRating,
    feedback: requestData.feedback,
    attachments: requestData.attachments || [],
    tags: requestData.tags || [],
  };

  return request;
};

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
export const assignServiceRequest = (
  request: ServiceRequest,
  assigneeId: string,
): ServiceRequest => {
  return {
    ...request,
    assignedTo: assigneeId,
    status: request.status === 'submitted' ? 'assigned' : request.status,
    updatedAt: new Date(),
  };
};

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
export const updateServiceRequestStatus = (
  request: ServiceRequest,
  newStatus: ServiceStatus,
): ServiceRequest => {
  const now = new Date();

  const updated: ServiceRequest = {
    ...request,
    status: newStatus,
    updatedAt: now,
  };

  // Auto-set completion timestamp
  if (newStatus === 'completed' && !updated.completedAt) {
    updated.completedAt = now;
    updated.actualResolution = Math.floor(
      (now.getTime() - request.createdAt.getTime()) / (1000 * 60)
    );
  }

  return updated;
};

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
export const calculateServicePriorityScore = (request: ServiceRequest): number => {
  let score = 0;

  // Priority base score
  const priorityScores: Record<ServicePriority, number> = {
    urgent: 50,
    high: 35,
    normal: 20,
    low: 10,
  };
  score += priorityScores[request.priority];

  // Age factor (older requests get higher priority)
  const ageInHours = Math.floor(
    (Date.now() - request.createdAt.getTime()) / (1000 * 60 * 60)
  );
  score += Math.min(ageInHours * 2, 30); // Cap at +30

  // Category urgency
  const urgentCategories: ServiceCategory[] = ['security', 'hvac', 'accessibility'];
  if (urgentCategories.includes(request.category)) {
    score += 20;
  }

  return score;
};

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
export const sortServiceRequestsByPriority = (
  requests: ServiceRequest[],
): ServiceRequest[] => {
  return [...requests].sort((a, b) => {
    return calculateServicePriorityScore(b) - calculateServicePriorityScore(a);
  });
};

// ============================================================================
// VISITOR MANAGEMENT
// ============================================================================

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
export const preRegisterVisitor = (visitorData: Partial<Visitor>): Visitor => {
  const now = new Date();

  const visitor: Visitor = {
    id: visitorData.id || `VIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: visitorData.propertyId!,
    firstName: visitorData.firstName!,
    lastName: visitorData.lastName!,
    email: visitorData.email,
    phone: visitorData.phone,
    company: visitorData.company,
    visitPurpose: visitorData.visitPurpose!,
    hostName: visitorData.hostName!,
    hostEmail: visitorData.hostEmail!,
    hostTenantId: visitorData.hostTenantId!,
    expectedArrival: visitorData.expectedArrival!,
    actualArrival: visitorData.actualArrival,
    actualDeparture: visitorData.actualDeparture,
    status: 'pre_registered',
    badgeNumber: visitorData.badgeNumber,
    parkingSpot: visitorData.parkingSpot,
    specialInstructions: visitorData.specialInstructions,
    checkInLocation: visitorData.checkInLocation || 'Main Reception',
    isPreRegistered: true,
    requiresEscort: visitorData.requiresEscort || false,
    visitType: visitorData.visitType || 'business',
    createdAt: now,
    updatedAt: now,
  };

  return visitor;
};

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
export const checkInVisitor = (
  visitor: Visitor,
  badgeNumber: string,
  parkingSpot?: string,
): Visitor => {
  const now = new Date();

  return {
    ...visitor,
    status: 'checked_in',
    actualArrival: now,
    badgeNumber,
    parkingSpot,
    updatedAt: now,
  };
};

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
export const checkOutVisitor = (visitor: Visitor): Visitor => {
  const now = new Date();

  return {
    ...visitor,
    status: 'checked_out',
    actualDeparture: now,
    updatedAt: now,
  };
};

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
export const sendVisitorNotification = (
  visitor: Visitor,
  notificationType: 'pre_arrival' | 'arrival' | 'waiting' | 'no_show',
): object => {
  const messages: Record<string, string> = {
    pre_arrival: `${visitor.firstName} ${visitor.lastName} is scheduled to arrive at ${visitor.expectedArrival.toLocaleTimeString()}`,
    arrival: `${visitor.firstName} ${visitor.lastName} from ${visitor.company || 'N/A'} has arrived`,
    waiting: `${visitor.firstName} ${visitor.lastName} is waiting at reception`,
    no_show: `${visitor.firstName} ${visitor.lastName} did not arrive for scheduled visit`,
  };

  return {
    visitorId: visitor.id,
    hostEmail: visitor.hostEmail,
    type: notificationType,
    subject: `Visitor ${notificationType === 'arrival' ? 'Arrival' : 'Update'}`,
    message: messages[notificationType],
    sentAt: new Date(),
    channels: ['email', 'sms'],
  };
};

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
export const getCurrentVisitors = (
  visitors: Visitor[],
  propertyId: string,
): Visitor[] => {
  return visitors.filter(
    v => v.propertyId === propertyId && (v.status === 'checked_in' || v.status === 'on_premises')
  );
};

// ============================================================================
// MAIL AND PACKAGE HANDLING
// ============================================================================

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
export const recordPackageDelivery = (packageData: Partial<MailPackage>): MailPackage => {
  const now = new Date();

  const mailPackage: MailPackage = {
    id: packageData.id || `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: packageData.propertyId!,
    trackingNumber: packageData.trackingNumber,
    recipientName: packageData.recipientName!,
    recipientTenantId: packageData.recipientTenantId!,
    recipientUnit: packageData.recipientUnit!,
    carrier: packageData.carrier || 'other',
    packageType: packageData.packageType || 'package',
    size: packageData.size || 'medium',
    status: 'received',
    receivedDate: now,
    receivedBy: packageData.receivedBy!,
    notifiedAt: packageData.notifiedAt,
    pickedUpAt: packageData.pickedUpAt,
    pickedUpBy: packageData.pickedUpBy,
    storageLocation: packageData.storageLocation!,
    requiresSignature: packageData.requiresSignature || false,
    isFragile: packageData.isFragile || false,
    notes: packageData.notes,
    imageUrl: packageData.imageUrl,
  };

  return mailPackage;
};

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
export const notifyPackageRecipient = (mailPackage: MailPackage): MailPackage => {
  return {
    ...mailPackage,
    status: 'notified',
    notifiedAt: new Date(),
  };
};

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
export const recordPackagePickup = (
  mailPackage: MailPackage,
  pickedUpBy: string,
): MailPackage => {
  return {
    ...mailPackage,
    status: 'picked_up',
    pickedUpAt: new Date(),
    pickedUpBy,
  };
};

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
export const getPendingPackages = (
  packages: MailPackage[],
  tenantId: string,
): MailPackage[] => {
  return packages.filter(
    pkg => pkg.recipientTenantId === tenantId &&
    !['picked_up', 'returned_to_sender', 'lost'].includes(pkg.status)
  );
};

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
export const generatePackageStorageReport = (
  packages: MailPackage[],
  propertyId: string,
): object => {
  const propertyPackages = packages.filter(pkg => pkg.propertyId === propertyId);
  const stored = propertyPackages.filter(pkg =>
    ['received', 'stored', 'ready_for_pickup', 'notified'].includes(pkg.status)
  );

  const bySize: Record<PackageSize, number> = {
    small: 0,
    medium: 0,
    large: 0,
    oversized: 0,
  };

  stored.forEach(pkg => {
    bySize[pkg.size]++;
  });

  const averageStorageTime = stored
    .map(pkg => {
      const endTime = pkg.pickedUpAt?.getTime() || Date.now();
      return (endTime - pkg.receivedDate.getTime()) / (1000 * 60 * 60); // hours
    })
    .reduce((sum, time) => sum + time, 0) / (stored.length || 1);

  return {
    propertyId,
    totalStored: stored.length,
    bySize,
    byCarrier: propertyPackages.reduce((acc, pkg) => {
      acc[pkg.carrier] = (acc[pkg.carrier] || 0) + 1;
      return acc;
    }, {} as Record<PackageCarrier, number>),
    averageStorageTime: Math.round(averageStorageTime * 100) / 100,
    requiresSignature: stored.filter(pkg => pkg.requiresSignature).length,
    overduePickups: stored.filter(pkg => {
      const daysSinceReceived = (Date.now() - pkg.receivedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceReceived > 7;
    }).length,
  };
};

// ============================================================================
// CONCIERGE SERVICES
// ============================================================================

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
export const createConciergeRequest = (
  requestData: Partial<ConciergeRequest>,
): ConciergeRequest => {
  const request: ConciergeRequest = {
    id: requestData.id || `CONC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: requestData.propertyId!,
    tenantId: requestData.tenantId!,
    requestedBy: requestData.requestedBy!,
    requestType: requestData.requestType!,
    priority: requestData.priority || 'normal',
    status: requestData.status || 'submitted',
    description: requestData.description || '',
    requestedDate: requestData.requestedDate || new Date(),
    desiredCompletionDate: requestData.desiredCompletionDate,
    completedAt: requestData.completedAt,
    assignedTo: requestData.assignedTo,
    cost: requestData.cost,
    isPaid: requestData.isPaid || false,
    notes: requestData.notes,
    satisfactionRating: requestData.satisfactionRating,
  };

  return request;
};

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
export const completeConciergeRequest = (
  request: ConciergeRequest,
  cost: number,
  completionNotes: string,
): ConciergeRequest => {
  return {
    ...request,
    status: 'completed',
    completedAt: new Date(),
    cost,
    notes: completionNotes,
  };
};

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
export const calculateConciergeUtilization = (
  requests: ConciergeRequest[],
  tenantId: string,
  startDate: Date,
  endDate: Date,
): object => {
  const filtered = requests.filter(
    req =>
      req.tenantId === tenantId &&
      req.requestedDate >= startDate &&
      req.requestedDate <= endDate
  );

  const completed = filtered.filter(req => req.status === 'completed');

  const byType = filtered.reduce((acc, req) => {
    acc[req.requestType] = (acc[req.requestType] || 0) + 1;
    return acc;
  }, {} as Record<ConciergeServiceType, number>);

  const totalCost = completed.reduce((sum, req) => sum + (req.cost || 0), 0);

  return {
    tenantId,
    period: { startDate, endDate },
    totalRequests: filtered.length,
    completedRequests: completed.length,
    completionRate: filtered.length > 0 ? (completed.length / filtered.length) * 100 : 0,
    byType,
    totalCost: Math.round(totalCost * 100) / 100,
    averageSatisfaction:
      completed.filter(r => r.satisfactionRating).length > 0
        ? completed.reduce((sum, r) => sum + (r.satisfactionRating || 0), 0) /
          completed.filter(r => r.satisfactionRating).length
        : 0,
  };
};

// ============================================================================
// EVENT SPACE MANAGEMENT
// ============================================================================

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
export const createEventSpace = (spaceData: Partial<EventSpace>): EventSpace => {
  const space: EventSpace = {
    id: spaceData.id || `SPACE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: spaceData.propertyId!,
    name: spaceData.name!,
    floor: spaceData.floor!,
    capacity: spaceData.capacity || 0,
    amenities: spaceData.amenities || [],
    hourlyRate: spaceData.hourlyRate || 0,
    halfDayRate: spaceData.halfDayRate || 0,
    fullDayRate: spaceData.fullDayRate || 0,
    isAvailable: spaceData.isAvailable !== undefined ? spaceData.isAvailable : true,
    features: spaceData.features || [],
    setupTime: spaceData.setupTime || 30,
    cleanupTime: spaceData.cleanupTime || 30,
    images: spaceData.images || [],
    restrictions: spaceData.restrictions || [],
  };

  return space;
};

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
export const createEventBooking = (
  bookingData: Partial<EventBooking>,
  space: EventSpace,
): EventBooking => {
  const now = new Date();
  const startTime = bookingData.startTime!;
  const endTime = bookingData.endTime!;

  // Calculate duration in hours
  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  // Calculate cost
  let totalCost = 0;
  if (durationHours <= 4) {
    totalCost = space.hourlyRate * Math.ceil(durationHours);
  } else if (durationHours <= 6) {
    totalCost = space.halfDayRate;
  } else {
    totalCost = space.fullDayRate;
  }

  const booking: EventBooking = {
    id: bookingData.id || `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    spaceId: space.id,
    propertyId: space.propertyId,
    tenantId: bookingData.tenantId!,
    organizerName: bookingData.organizerName!,
    organizerEmail: bookingData.organizerEmail!,
    eventTitle: bookingData.eventTitle!,
    eventDescription: bookingData.eventDescription || '',
    startTime,
    endTime,
    expectedAttendees: bookingData.expectedAttendees || 0,
    setupRequirements: bookingData.setupRequirements || [],
    cateringNeeded: bookingData.cateringNeeded || false,
    cateringDetails: bookingData.cateringDetails,
    avNeeds: bookingData.avNeeds || [],
    status: 'requested',
    totalCost,
    depositPaid: false,
    depositAmount: totalCost * 0.25, // 25% deposit
    specialRequests: bookingData.specialRequests,
    createdAt: now,
    approvedBy: bookingData.approvedBy,
    approvedAt: bookingData.approvedAt,
  };

  return booking;
};

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
export const checkEventSpaceAvailability = (
  space: EventSpace,
  startTime: Date,
  endTime: Date,
  existingBookings: EventBooking[],
): boolean => {
  if (!space.isAvailable) {
    return false;
  }

  // Add setup and cleanup time to the requested window
  const setupStartTime = new Date(startTime.getTime() - space.setupTime * 60 * 1000);
  const cleanupEndTime = new Date(endTime.getTime() + space.cleanupTime * 60 * 1000);

  // Check for conflicts with existing bookings
  const hasConflict = existingBookings
    .filter(booking =>
      booking.spaceId === space.id &&
      !['cancelled', 'completed'].includes(booking.status)
    )
    .some(booking => {
      const existingStart = booking.startTime;
      const existingEnd = booking.endTime;

      return (
        (setupStartTime >= existingStart && setupStartTime < existingEnd) ||
        (cleanupEndTime > existingStart && cleanupEndTime <= existingEnd) ||
        (setupStartTime <= existingStart && cleanupEndTime >= existingEnd)
      );
    });

  return !hasConflict;
};

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
export const approveEventBooking = (
  booking: EventBooking,
  approvedBy: string,
): EventBooking => {
  return {
    ...booking,
    status: 'approved',
    approvedBy,
    approvedAt: new Date(),
  };
};

// ============================================================================
// AMENITY MANAGEMENT
// ============================================================================

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
export const createAmenity = (amenityData: Partial<Amenity>): Amenity => {
  const amenity: Amenity = {
    id: amenityData.id || `AMN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: amenityData.propertyId!,
    name: amenityData.name!,
    type: amenityData.type!,
    location: amenityData.location!,
    capacity: amenityData.capacity || 0,
    isReservable: amenityData.isReservable !== undefined ? amenityData.isReservable : true,
    requiresPayment: amenityData.requiresPayment || false,
    costPerHour: amenityData.costPerHour,
    operatingHours: amenityData.operatingHours || {},
    availableDays: amenityData.availableDays || [1, 2, 3, 4, 5], // Monday-Friday
    minimumReservation: amenityData.minimumReservation || 30,
    maximumReservation: amenityData.maximumReservation || 180,
    advanceBookingDays: amenityData.advanceBookingDays || 14,
    cancellationPolicy: amenityData.cancellationPolicy || 'No cancellation fee',
    rules: amenityData.rules || [],
    isActive: amenityData.isActive !== undefined ? amenityData.isActive : true,
  };

  return amenity;
};

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
export const createAmenityReservation = (
  reservationData: Partial<AmenityReservation>,
  amenity: Amenity,
): AmenityReservation => {
  const now = new Date();
  const startTime = reservationData.startTime!;
  const endTime = reservationData.endTime!;

  // Calculate cost
  let totalCost: number | undefined;
  if (amenity.requiresPayment && amenity.costPerHour) {
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    totalCost = Math.round(durationHours * amenity.costPerHour * 100) / 100;
  }

  const reservation: AmenityReservation = {
    id: reservationData.id || `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    amenityId: amenity.id,
    tenantId: reservationData.tenantId!,
    reservedBy: reservationData.reservedBy!,
    reservedByEmail: reservationData.reservedByEmail!,
    startTime,
    endTime,
    attendees: reservationData.attendees || 1,
    purpose: reservationData.purpose,
    status: 'active',
    totalCost,
    isPaid: !amenity.requiresPayment, // Auto-mark as paid if no payment required
    createdAt: now,
    checkInTime: reservationData.checkInTime,
    checkOutTime: reservationData.checkOutTime,
    notes: reservationData.notes,
  };

  return reservation;
};

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
export const validateAmenityReservation = (
  amenity: Amenity,
  startTime: Date,
  endTime: Date,
  existingReservations: AmenityReservation[],
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if amenity is active and reservable
  if (!amenity.isActive) {
    errors.push('Amenity is not currently available');
  }

  if (!amenity.isReservable) {
    errors.push('This amenity cannot be reserved');
  }

  // Check duration
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  if (amenity.minimumReservation && durationMinutes < amenity.minimumReservation) {
    errors.push(`Minimum reservation is ${amenity.minimumReservation} minutes`);
  }

  if (amenity.maximumReservation && durationMinutes > amenity.maximumReservation) {
    errors.push(`Maximum reservation is ${amenity.maximumReservation} minutes`);
  }

  // Check advance booking window
  const daysInAdvance = (startTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysInAdvance > amenity.advanceBookingDays) {
    errors.push(`Cannot book more than ${amenity.advanceBookingDays} days in advance`);
  }

  // Check day of week
  const dayOfWeek = startTime.getDay();
  if (!amenity.availableDays.includes(dayOfWeek)) {
    errors.push('Amenity is not available on this day');
  }

  // Check for conflicts
  const hasConflict = existingReservations
    .filter(res => res.amenityId === amenity.id && res.status === 'active')
    .some(res => {
      return (
        (startTime >= res.startTime && startTime < res.endTime) ||
        (endTime > res.startTime && endTime <= res.endTime) ||
        (startTime <= res.startTime && endTime >= res.endTime)
      );
    });

  if (hasConflict) {
    errors.push('Time slot is already reserved');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
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
export const cancelAmenityReservation = (
  reservation: AmenityReservation,
  amenity: Amenity,
): { reservation: AmenityReservation; refundAmount: number; refundPercentage: number } => {
  const now = new Date();
  const hoursUntilStart = (reservation.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Calculate refund based on cancellation policy
  let refundPercentage = 0;
  if (hoursUntilStart >= 24) {
    refundPercentage = 100; // Full refund
  } else if (hoursUntilStart >= 12) {
    refundPercentage = 50; // 50% refund
  } else {
    refundPercentage = 0; // No refund
  }

  const refundAmount = reservation.totalCost
    ? Math.round((reservation.totalCost * refundPercentage) / 100 * 100) / 100
    : 0;

  const cancelledReservation: AmenityReservation = {
    ...reservation,
    status: 'cancelled',
  };

  return {
    reservation: cancelledReservation,
    refundAmount,
    refundPercentage,
  };
};

// ============================================================================
// SERVICE LEVEL TRACKING
// ============================================================================

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
export const defineServiceLevelAgreement = (
  category: ServiceCategory,
  slaData: Partial<ServiceLevelAgreement>,
): ServiceLevelAgreement => {
  const sla: ServiceLevelAgreement = {
    category,
    responseTime: slaData.responseTime || 60,
    resolutionTime: slaData.resolutionTime || 480,
    availabilityHours: slaData.availabilityHours || '8am-6pm weekdays',
    escalationPath: slaData.escalationPath || ['staff', 'supervisor', 'manager'],
    performanceTargets: slaData.performanceTargets || {
      firstResponseRate: 90,
      resolutionRate: 85,
      satisfactionTarget: 4.0,
    },
  };

  return sla;
};

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
export const calculateSLACompliance = (
  requests: ServiceRequest[],
  sla: ServiceLevelAgreement,
): object => {
  const categoryRequests = requests.filter(req => req.category === sla.category);
  const completed = categoryRequests.filter(req => req.status === 'completed');

  // Calculate response time compliance
  const responseCompliance = categoryRequests.filter(req => {
    if (req.status === 'submitted') return false;
    // In real implementation, would check actual first response timestamp
    const responseMinutes = (req.updatedAt.getTime() - req.createdAt.getTime()) / (1000 * 60);
    return responseMinutes <= sla.responseTime;
  });

  // Calculate resolution time compliance
  const resolutionCompliance = completed.filter(req => {
    if (!req.actualResolution) return false;
    return req.actualResolution <= sla.resolutionTime;
  });

  // Calculate satisfaction compliance
  const satisfactionCompliance = completed.filter(req => {
    if (!req.satisfactionRating) return false;
    return req.satisfactionRating >= sla.performanceTargets.satisfactionTarget;
  });

  const totalRequests = categoryRequests.length;

  return {
    category: sla.category,
    totalRequests,
    responseCompliance: {
      count: responseCompliance.length,
      rate: totalRequests > 0 ? (responseCompliance.length / totalRequests) * 100 : 0,
      target: sla.performanceTargets.firstResponseRate,
    },
    resolutionCompliance: {
      count: resolutionCompliance.length,
      rate: completed.length > 0 ? (resolutionCompliance.length / completed.length) * 100 : 0,
      target: sla.performanceTargets.resolutionRate,
    },
    satisfactionCompliance: {
      count: satisfactionCompliance.length,
      averageRating:
        completed.filter(r => r.satisfactionRating).length > 0
          ? completed.reduce((sum, r) => sum + (r.satisfactionRating || 0), 0) /
            completed.filter(r => r.satisfactionRating).length
          : 0,
      target: sla.performanceTargets.satisfactionTarget,
    },
    overallCompliance:
      totalRequests > 0
        ? ((responseCompliance.length + resolutionCompliance.length) / (totalRequests * 2)) * 100
        : 0,
  };
};

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
export const identifyEscalations = (
  requests: ServiceRequest[],
  slas: ServiceLevelAgreement[],
): Array<{ request: ServiceRequest; reason: string; escalationLevel: number }> => {
  const escalations: Array<{ request: ServiceRequest; reason: string; escalationLevel: number }> = [];

  for (const request of requests) {
    if (['completed', 'cancelled'].includes(request.status)) {
      continue;
    }

    const sla = slas.find(s => s.category === request.category);
    if (!sla) continue;

    const ageMinutes = (Date.now() - request.createdAt.getTime()) / (1000 * 60);

    // Check response time breach
    if (request.status === 'submitted' && ageMinutes > sla.responseTime) {
      const escalationLevel = Math.floor(ageMinutes / sla.responseTime);
      escalations.push({
        request,
        reason: `No response after ${Math.round(ageMinutes)} minutes (SLA: ${sla.responseTime} min)`,
        escalationLevel: Math.min(escalationLevel, sla.escalationPath.length - 1),
      });
    }

    // Check resolution time breach
    if (
      !['submitted', 'completed', 'cancelled'].includes(request.status) &&
      ageMinutes > sla.resolutionTime
    ) {
      const escalationLevel = Math.floor(ageMinutes / sla.resolutionTime);
      escalations.push({
        request,
        reason: `Unresolved after ${Math.round(ageMinutes)} minutes (SLA: ${sla.resolutionTime} min)`,
        escalationLevel: Math.min(escalationLevel, sla.escalationPath.length - 1),
      });
    }
  }

  return escalations;
};

// ============================================================================
// TENANT SATISFACTION SURVEYS
// ============================================================================

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
export const createSatisfactionSurvey = (
  surveyData: Partial<TenantSatisfactionSurvey>,
): TenantSatisfactionSurvey => {
  const survey: TenantSatisfactionSurvey = {
    id: surveyData.id || `SURVEY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: surveyData.propertyId!,
    tenantId: surveyData.tenantId!,
    surveyType: surveyData.surveyType || 'quarterly',
    relatedEntityId: surveyData.relatedEntityId,
    submittedAt: surveyData.submittedAt || new Date(),
    responses: surveyData.responses || [],
    overallRating: surveyData.overallRating || 0,
    npsScore: surveyData.npsScore,
    wouldRecommend: surveyData.wouldRecommend || false,
    comments: surveyData.comments,
  };

  return survey;
};

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
export const calculateNPS = (surveys: TenantSatisfactionSurvey[]): object => {
  const withNPS = surveys.filter(s => s.npsScore !== undefined && s.npsScore !== null);

  if (withNPS.length === 0) {
    return { score: 0, promoters: 0, passives: 0, detractors: 0, totalResponses: 0 };
  }

  const promoters = withNPS.filter(s => s.npsScore! >= 9).length;
  const passives = withNPS.filter(s => s.npsScore! >= 7 && s.npsScore! <= 8).length;
  const detractors = withNPS.filter(s => s.npsScore! <= 6).length;

  const promoterPercentage = (promoters / withNPS.length) * 100;
  const detractorPercentage = (detractors / withNPS.length) * 100;
  const npsScore = Math.round(promoterPercentage - detractorPercentage);

  return {
    score: npsScore,
    promoters: Math.round(promoterPercentage),
    passives: Math.round((passives / withNPS.length) * 100),
    detractors: Math.round(detractorPercentage),
    totalResponses: withNPS.length,
  };
};

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
export const analyzeSatisfactionTrends = (
  surveys: TenantSatisfactionSurvey[],
  propertyId: string,
): object => {
  const propertySurveys = surveys.filter(s => s.propertyId === propertyId);

  // Group by month
  const monthlyScores: Record<string, number[]> = {};

  propertySurveys.forEach(survey => {
    const monthKey = survey.submittedAt.toISOString().substring(0, 7); // YYYY-MM
    if (!monthlyScores[monthKey]) {
      monthlyScores[monthKey] = [];
    }
    monthlyScores[monthKey].push(survey.overallRating);
  });

  // Calculate monthly averages
  const monthlyAverages = Object.entries(monthlyScores).map(([month, scores]) => ({
    month,
    averageRating: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    responseCount: scores.length,
  }));

  // Calculate trend direction
  const sortedMonths = monthlyAverages.sort((a, b) => a.month.localeCompare(b.month));
  const trend =
    sortedMonths.length >= 2
      ? sortedMonths[sortedMonths.length - 1].averageRating > sortedMonths[0].averageRating
        ? 'improving'
        : 'declining'
      : 'stable';

  // Category breakdown
  const categoryScores: Record<string, number[]> = {};
  propertySurveys.forEach(survey => {
    survey.responses.forEach(response => {
      if (!categoryScores[response.category]) {
        categoryScores[response.category] = [];
      }
      categoryScores[response.category].push(response.rating);
    });
  });

  const categoryAverages = Object.entries(categoryScores).map(([category, scores]) => ({
    category,
    averageRating: scores.reduce((sum, score) => sum + score, 0) / scores.length,
  }));

  return {
    propertyId,
    monthlyTrends: sortedMonths,
    trend,
    overallAverage:
      propertySurveys.reduce((sum, s) => sum + s.overallRating, 0) / (propertySurveys.length || 1),
    categoryAverages,
    totalSurveys: propertySurveys.length,
  };
};

// ============================================================================
// SERVICE REQUEST FULFILLMENT
// ============================================================================

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
export const generateServicePerformanceMetrics = (
  requests: ServiceRequest[],
  startDate: Date,
  endDate: Date,
): ServicePerformanceMetrics => {
  const filtered = requests.filter(
    req => req.createdAt >= startDate && req.createdAt <= endDate
  );

  const completed = filtered.filter(req => req.status === 'completed');

  // Calculate average response time (time to first status change)
  const responseTimes = filtered
    .filter(req => req.status !== 'submitted')
    .map(req => (req.updatedAt.getTime() - req.createdAt.getTime()) / (1000 * 60));

  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

  // Calculate average resolution time
  const resolutionTimes = completed
    .filter(req => req.actualResolution)
    .map(req => req.actualResolution!);

  const averageResolutionTime =
    resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
      : 0;

  // Calculate satisfaction score
  const satisfactionRatings = completed
    .filter(req => req.satisfactionRating)
    .map(req => req.satisfactionRating!);

  const satisfactionScore =
    satisfactionRatings.length > 0
      ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length
      : 0;

  // Group by category
  const byCategory = filtered.reduce((acc, req) => {
    acc[req.category] = (acc[req.category] || 0) + 1;
    return acc;
  }, {} as Record<ServiceCategory, number>);

  // Group by priority
  const byPriority = filtered.reduce((acc, req) => {
    acc[req.priority] = (acc[req.priority] || 0) + 1;
    return acc;
  }, {} as Record<ServicePriority, number>);

  // SLA compliance (simplified - assumes 60 min response, 480 min resolution)
  const slaCompliant = completed.filter(req => {
    return req.actualResolution && req.actualResolution <= 480;
  });

  const slaCompliance =
    completed.length > 0 ? (slaCompliant.length / completed.length) * 100 : 0;

  return {
    totalRequests: filtered.length,
    completedRequests: completed.length,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    averageResolutionTime: Math.round(averageResolutionTime * 100) / 100,
    satisfactionScore: Math.round(satisfactionScore * 100) / 100,
    slaCompliance: Math.round(slaCompliance * 100) / 100,
    byCategory,
    byPriority,
    trends: {
      weekOverWeek: 0, // Would calculate from historical data
      monthOverMonth: 0,
    },
  };
};

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
export const prioritizeServiceQueue = (
  requests: ServiceRequest[],
  slas: ServiceLevelAgreement[],
): ServiceRequest[] => {
  return [...requests].sort((a, b) => {
    // Calculate priority scores
    const scoreA = calculateServicePriorityScore(a);
    const scoreB = calculateServicePriorityScore(b);

    // Check for SLA breaches
    const slaA = slas.find(s => s.category === a.category);
    const slaB = slas.find(s => s.category === b.category);

    const ageMinutesA = (Date.now() - a.createdAt.getTime()) / (1000 * 60);
    const ageMinutesB = (Date.now() - b.createdAt.getTime()) / (1000 * 60);

    const breachA = slaA && ageMinutesA > slaA.responseTime;
    const breachB = slaB && ageMinutesB > slaB.responseTime;

    // SLA breaches get highest priority
    if (breachA && !breachB) return -1;
    if (!breachA && breachB) return 1;

    // Otherwise sort by priority score
    return scoreB - scoreA;
  });
};

// ============================================================================
// EMPLOYEE EXPERIENCE SERVICES
// ============================================================================

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
export const calculateEmployeeExperience = (data: {
  propertyId: string;
  tenantId: string;
  period: { startDate: Date; endDate: Date };
  serviceRequests: ServiceRequest[];
  amenityReservations: AmenityReservation[];
  eventBookings: EventBooking[];
  surveys: TenantSatisfactionSurvey[];
}): EmployeeExperienceMetrics => {
  const { propertyId, tenantId, period, serviceRequests, amenityReservations, eventBookings, surveys } = data;

  // Filter data by tenant and period
  const tenantRequests = serviceRequests.filter(
    req =>
      req.tenantId === tenantId &&
      req.createdAt >= period.startDate &&
      req.createdAt <= period.endDate
  );

  const tenantReservations = amenityReservations.filter(
    res =>
      res.tenantId === tenantId &&
      res.createdAt >= period.startDate &&
      res.createdAt <= period.endDate
  );

  const tenantEvents = eventBookings.filter(
    evt =>
      evt.tenantId === tenantId &&
      evt.createdAt >= period.startDate &&
      evt.createdAt <= period.endDate
  );

  const tenantSurveys = surveys.filter(
    srv =>
      srv.tenantId === tenantId &&
      srv.submittedAt >= period.startDate &&
      srv.submittedAt <= period.endDate
  );

  // Calculate metrics
  const completedRequests = tenantRequests.filter(req => req.status === 'completed');
  const avgResolutionTime =
    completedRequests.length > 0
      ? completedRequests.reduce((sum, req) => sum + (req.actualResolution || 0), 0) /
        completedRequests.length
      : 0;

  const satisfactionScore =
    tenantSurveys.length > 0
      ? tenantSurveys.reduce((sum, srv) => sum + srv.overallRating, 0) / tenantSurveys.length
      : 0;

  const npsData = calculateNPS(tenantSurveys);

  return {
    propertyId,
    tenantId,
    period,
    serviceRequestCount: tenantRequests.length,
    averageResolutionTime: Math.round(avgResolutionTime),
    satisfactionScore: Math.round(satisfactionScore * 100) / 100,
    amenityUsage: tenantReservations.length,
    eventParticipation: tenantEvents.length,
    npsScore: (npsData as { score: number }).score,
    retentionIndicators: {
      leaseRenewalLikelihood: satisfactionScore >= 4.0 ? 85 : 60, // Simplified calculation
      spaceExpansionInterest: tenantEvents.length > 2 ? 70 : 40,
      referralCount: tenantSurveys.filter(s => s.wouldRecommend).length,
    },
  };
};

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
export const generateWorkplaceDashboard = (
  propertyId: string,
  allData: {
    serviceRequests: ServiceRequest[];
    visitors: Visitor[];
    packages: MailPackage[];
    amenityReservations: AmenityReservation[];
    eventBookings: EventBooking[];
    surveys: TenantSatisfactionSurvey[];
  },
): object => {
  const { serviceRequests, visitors, packages, amenityReservations, eventBookings, surveys } = allData;

  // Filter by property
  const propertyRequests = serviceRequests.filter(req => req.propertyId === propertyId);
  const propertyVisitors = visitors.filter(v => v.propertyId === propertyId);
  const propertyPackages = packages.filter(pkg => pkg.propertyId === propertyId);
  const propertySurveys = surveys.filter(srv => srv.propertyId === propertyId);

  // Active metrics
  const activeServiceRequests = propertyRequests.filter(req =>
    !['completed', 'cancelled'].includes(req.status)
  ).length;

  const currentVisitors = propertyVisitors.filter(v =>
    ['checked_in', 'on_premises'].includes(v.status)
  ).length;

  const pendingPackages = propertyPackages.filter(pkg =>
    !['picked_up', 'returned_to_sender', 'lost'].includes(pkg.status)
  ).length;

  const upcomingReservations = amenityReservations.filter(res =>
    res.status === 'active' && res.startTime > new Date()
  ).length;

  const upcomingEvents = eventBookings.filter(evt =>
    ['approved', 'confirmed'].includes(evt.status) && evt.startTime > new Date()
  ).length;

  // Satisfaction metrics
  const recentSurveys = propertySurveys.filter(srv => {
    const daysAgo = (Date.now() - srv.submittedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  });

  const avgSatisfaction =
    recentSurveys.length > 0
      ? recentSurveys.reduce((sum, srv) => sum + srv.overallRating, 0) / recentSurveys.length
      : 0;

  const npsData = calculateNPS(recentSurveys);

  return {
    propertyId,
    activeMetrics: {
      serviceRequests: activeServiceRequests,
      visitorsOnPremises: currentVisitors,
      pendingPackages,
      upcomingReservations,
      upcomingEvents,
    },
    satisfactionMetrics: {
      averageRating: Math.round(avgSatisfaction * 100) / 100,
      npsScore: (npsData as { score: number }).score,
      surveyResponseRate: recentSurveys.length,
    },
    alerts: {
      overdueServiceRequests: propertyRequests.filter(req => {
        const ageHours = (Date.now() - req.createdAt.getTime()) / (1000 * 60 * 60);
        return !['completed', 'cancelled'].includes(req.status) && ageHours > 24;
      }).length,
      overduePackages: propertyPackages.filter(pkg => {
        const daysSinceReceived = (Date.now() - pkg.receivedDate.getTime()) / (1000 * 60 * 60 * 24);
        return !['picked_up', 'returned_to_sender', 'lost'].includes(pkg.status) && daysSinceReceived > 7;
      }).length,
      expectedVisitors: propertyVisitors.filter(v =>
        v.status === 'expected' && v.expectedArrival < new Date()
      ).length,
    },
  };
};

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
export const generateVisitorBadge = (
  visitor: Visitor,
  badgeNumber: number,
): object => {
  return {
    badgeNumber: `BADGE-${badgeNumber.toString().padStart(4, '0')}`,
    visitorName: `${visitor.firstName} ${visitor.lastName}`,
    company: visitor.company || 'Guest',
    hostName: visitor.hostName,
    visitDate: visitor.expectedArrival.toLocaleDateString(),
    validUntil: visitor.expectedArrival.toLocaleDateString(),
    checkInTime: visitor.actualArrival?.toLocaleTimeString() || 'Not checked in',
    accessLevel: visitor.requiresEscort ? 'Escorted' : 'General',
    parkingSpot: visitor.parkingSpot || 'N/A',
    specialInstructions: visitor.specialInstructions || '',
    qrCode: `VIS-${visitor.id}-${badgeNumber}`, // QR code data for scanning
    issuedAt: new Date(),
    propertyId: visitor.propertyId,
  };
};

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
export const sendBulkTenantNotification = (
  propertyId: string,
  tenantIds: string[],
  notification: {
    subject: string;
    message: string;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    channels: Array<'email' | 'sms' | 'push' | 'in_app'>;
    scheduledFor?: Date;
    expiresAt?: Date;
    actionUrl?: string;
  },
): object => {
  const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: notificationId,
    propertyId,
    recipientCount: tenantIds.length,
    recipients: tenantIds,
    subject: notification.subject,
    message: notification.message,
    priority: notification.priority,
    channels: notification.channels,
    scheduledFor: notification.scheduledFor || new Date(),
    expiresAt: notification.expiresAt,
    actionUrl: notification.actionUrl,
    status: notification.scheduledFor && notification.scheduledFor > new Date() ? 'scheduled' : 'sent',
    sentAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };
};

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
export const trackAmenityUtilization = (
  amenity: Amenity,
  reservations: AmenityReservation[],
  startDate: Date,
  endDate: Date,
): object => {
  const amenityReservations = reservations.filter(
    res =>
      res.amenityId === amenity.id &&
      res.startTime >= startDate &&
      res.startTime <= endDate
  );

  const completed = amenityReservations.filter(res => res.status === 'completed');
  const cancelled = amenityReservations.filter(res => res.status === 'cancelled');
  const noShows = amenityReservations.filter(res => res.status === 'no_show');

  // Calculate total available hours
  const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const averageHoursPerDay = 12; // Simplified - would calculate from operating hours
  const totalAvailableHours = daysInPeriod * averageHoursPerDay;

  // Calculate reserved hours
  const totalReservedHours = amenityReservations.reduce((sum, res) => {
    const hours = (res.endTime.getTime() - res.startTime.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  // Calculate revenue
  const totalRevenue = amenityReservations
    .filter(res => res.totalCost)
    .reduce((sum, res) => sum + (res.totalCost || 0), 0);

  // Find peak usage times
  const hourlyUsage: Record<number, number> = {};
  amenityReservations.forEach(res => {
    const hour = res.startTime.getHours();
    hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
  });

  const peakHours = Object.entries(hourlyUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({ hour: parseInt(hour), reservations: count }));

  return {
    amenityId: amenity.id,
    amenityName: amenity.name,
    period: { startDate, endDate },
    totalReservations: amenityReservations.length,
    completedReservations: completed.length,
    cancelledReservations: cancelled.length,
    noShowRate: amenityReservations.length > 0 ? (noShows.length / amenityReservations.length) * 100 : 0,
    utilizationRate: totalAvailableHours > 0 ? (totalReservedHours / totalAvailableHours) * 100 : 0,
    totalReservedHours: Math.round(totalReservedHours * 100) / 100,
    totalAvailableHours,
    averageReservationDuration: amenityReservations.length > 0
      ? totalReservedHours / amenityReservations.length
      : 0,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageRevenuePerReservation: amenityReservations.length > 0
      ? Math.round((totalRevenue / amenityReservations.length) * 100) / 100
      : 0,
    peakUsageTimes: peakHours,
    uniqueUsers: new Set(amenityReservations.map(res => res.tenantId)).size,
  };
};

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
export const exportWorkplaceServicesReport = (
  propertyId: string,
  startDate: Date,
  endDate: Date,
  allData: {
    serviceRequests: ServiceRequest[];
    visitors: Visitor[];
    packages: MailPackage[];
    amenityReservations: AmenityReservation[];
    eventBookings: EventBooking[];
    surveys: TenantSatisfactionSurvey[];
    conciergeRequests: ConciergeRequest[];
  },
): object => {
  const {
    serviceRequests,
    visitors,
    packages,
    amenityReservations,
    eventBookings,
    surveys,
    conciergeRequests,
  } = allData;

  // Filter by property and date range
  const periodRequests = serviceRequests.filter(
    req => req.propertyId === propertyId && req.createdAt >= startDate && req.createdAt <= endDate
  );

  const periodVisitors = visitors.filter(
    v => v.propertyId === propertyId && v.expectedArrival >= startDate && v.expectedArrival <= endDate
  );

  const periodPackages = packages.filter(
    pkg => pkg.propertyId === propertyId && pkg.receivedDate >= startDate && pkg.receivedDate <= endDate
  );

  const periodReservations = amenityReservations.filter(
    res => res.startTime >= startDate && res.startTime <= endDate
  );

  const periodEvents = eventBookings.filter(
    evt => evt.propertyId === propertyId && evt.startTime >= startDate && evt.startTime <= endDate
  );

  const periodSurveys = surveys.filter(
    srv => srv.propertyId === propertyId && srv.submittedAt >= startDate && srv.submittedAt <= endDate
  );

  const periodConcierge = conciergeRequests.filter(
    req => req.propertyId === propertyId && req.requestedDate >= startDate && req.requestedDate <= endDate
  );

  // Generate service performance metrics
  const serviceMetrics = generateServicePerformanceMetrics(periodRequests, startDate, endDate);

  // Calculate NPS
  const npsData = calculateNPS(periodSurveys);

  // Calculate package metrics
  const packageMetrics = generatePackageStorageReport(periodPackages, propertyId);

  return {
    reportMetadata: {
      propertyId,
      reportPeriod: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      generatedAt: new Date().toISOString(),
      reportType: 'comprehensive_workplace_services',
    },
    executiveSummary: {
      totalServiceRequests: periodRequests.length,
      totalVisitors: periodVisitors.length,
      totalPackages: periodPackages.length,
      totalAmenityReservations: periodReservations.length,
      totalEvents: periodEvents.length,
      totalSurveyResponses: periodSurveys.length,
      totalConciergeRequests: periodConcierge.length,
      overallSatisfactionScore:
        periodSurveys.length > 0
          ? Math.round(
              (periodSurveys.reduce((sum, s) => sum + s.overallRating, 0) / periodSurveys.length) * 100
            ) / 100
          : 0,
      npsScore: (npsData as { score: number }).score,
    },
    servicePerformance: serviceMetrics,
    visitorManagement: {
      totalVisitors: periodVisitors.length,
      checkedIn: periodVisitors.filter(v => v.status === 'checked_in' || v.status === 'checked_out').length,
      noShows: periodVisitors.filter(v => v.status === 'no_show').length,
      byVisitType: periodVisitors.reduce((acc, v) => {
        acc[v.visitType] = (acc[v.visitType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageVisitDuration:
        periodVisitors.filter(v => v.actualArrival && v.actualDeparture).length > 0
          ? Math.round(
              periodVisitors
                .filter(v => v.actualArrival && v.actualDeparture)
                .reduce((sum, v) => {
                  const duration = (v.actualDeparture!.getTime() - v.actualArrival!.getTime()) / (1000 * 60 * 60);
                  return sum + duration;
                }, 0) /
                periodVisitors.filter(v => v.actualArrival && v.actualDeparture).length *
                100
            ) / 100
          : 0,
    },
    packageManagement: packageMetrics,
    amenityUtilization: {
      totalReservations: periodReservations.length,
      completedReservations: periodReservations.filter(r => r.status === 'completed').length,
      cancelledReservations: periodReservations.filter(r => r.status === 'cancelled').length,
      noShowRate:
        periodReservations.length > 0
          ? Math.round((periodReservations.filter(r => r.status === 'no_show').length / periodReservations.length) * 10000) / 100
          : 0,
      totalRevenue: Math.round(
        periodReservations.reduce((sum, r) => sum + (r.totalCost || 0), 0) * 100
      ) / 100,
    },
    eventManagement: {
      totalEvents: periodEvents.length,
      completedEvents: periodEvents.filter(e => e.status === 'completed').length,
      totalAttendees: periodEvents.reduce((sum, e) => sum + e.expectedAttendees, 0),
      totalRevenue: Math.round(periodEvents.reduce((sum, e) => sum + e.totalCost, 0) * 100) / 100,
      byStatus: periodEvents.reduce((acc, e) => {
        acc[e.status] = (acc[e.status] || 0) + 1;
        return acc;
      }, {} as Record<BookingStatus, number>),
    },
    conciergeServices: {
      totalRequests: periodConcierge.length,
      completedRequests: periodConcierge.filter(r => r.status === 'completed').length,
      totalRevenue: Math.round(periodConcierge.reduce((sum, r) => sum + (r.cost || 0), 0) * 100) / 100,
      byServiceType: periodConcierge.reduce((acc, r) => {
        acc[r.requestType] = (acc[r.requestType] || 0) + 1;
        return acc;
      }, {} as Record<ConciergeServiceType, number>),
      averageSatisfaction:
        periodConcierge.filter(r => r.satisfactionRating).length > 0
          ? Math.round(
              (periodConcierge.reduce((sum, r) => sum + (r.satisfactionRating || 0), 0) /
                periodConcierge.filter(r => r.satisfactionRating).length) *
                100
            ) / 100
          : 0,
    },
    tenantSatisfaction: {
      totalSurveys: periodSurveys.length,
      averageOverallRating:
        periodSurveys.length > 0
          ? Math.round((periodSurveys.reduce((sum, s) => sum + s.overallRating, 0) / periodSurveys.length) * 100) / 100
          : 0,
      nps: npsData,
      wouldRecommendPercentage:
        periodSurveys.length > 0
          ? Math.round((periodSurveys.filter(s => s.wouldRecommend).length / periodSurveys.length) * 10000) / 100
          : 0,
    },
  };
};
