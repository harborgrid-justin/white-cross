/**
 * LOC: CITIZEN_SERVICES_INTEGRATION_KIT_001
 * File: /reuse/government/citizen-services-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government citizen portal services
 *   - Permit and license systems
 *   - Service request management platforms
 *   - Payment integration services
 *   - Citizen notification systems
 */

/**
 * File: /reuse/government/citizen-services-integration-kit.ts
 * Locator: WC-GOV-CITIZEN-SERVICES-INT-001
 * Purpose: Comprehensive Citizen Services Integration Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Citizen portal services, Permit systems, License management, Payment processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government citizen services and integration functions
 *
 * LLM Context: Enterprise-grade citizen services integration for government agencies.
 * Provides comprehensive citizen portal integration, service request management, permit application
 * processing, license renewal workflows, online payment integration, citizen notification system,
 * service level agreements, citizen feedback tracking, self-service portals, multi-channel service
 * delivery, citizen authentication, and service catalog management with full Sequelize/NestJS/Swagger integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Service request types
 */
export enum ServiceRequestType {
  PERMIT_APPLICATION = 'PERMIT_APPLICATION',
  LICENSE_RENEWAL = 'LICENSE_RENEWAL',
  COMPLAINT = 'COMPLAINT',
  INFORMATION_REQUEST = 'INFORMATION_REQUEST',
  PROPERTY_INQUIRY = 'PROPERTY_INQUIRY',
  CODE_VIOLATION = 'CODE_VIOLATION',
  PUBLIC_WORKS_REQUEST = 'PUBLIC_WORKS_REQUEST',
  ZONING_REQUEST = 'ZONING_REQUEST',
  INSPECTION_REQUEST = 'INSPECTION_REQUEST',
  DOCUMENT_REQUEST = 'DOCUMENT_REQUEST',
}

/**
 * Service request status
 */
export enum ServiceRequestStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_INSPECTION = 'PENDING_INSPECTION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

/**
 * Permit types
 */
export enum PermitType {
  BUILDING = 'BUILDING',
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  MECHANICAL = 'MECHANICAL',
  DEMOLITION = 'DEMOLITION',
  SIGN = 'SIGN',
  FENCE = 'FENCE',
  SIDEWALK = 'SIDEWALK',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
  TEMPORARY_USE = 'TEMPORARY_USE',
  ZONING_VARIANCE = 'ZONING_VARIANCE',
}

/**
 * Permit status
 */
export enum PermitStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  DENIED = 'DENIED',
}

/**
 * License types
 */
export enum LicenseType {
  BUSINESS = 'BUSINESS',
  PROFESSIONAL = 'PROFESSIONAL',
  CONTRACTOR = 'CONTRACTOR',
  VENDOR = 'VENDOR',
  LIQUOR = 'LIQUOR',
  FOOD_SERVICE = 'FOOD_SERVICE',
  HEALTH_CARE = 'HEALTH_CARE',
  CHILD_CARE = 'CHILD_CARE',
  ANIMAL = 'ANIMAL',
  TAXI_RIDESHARE = 'TAXI_RIDESHARE',
}

/**
 * License status
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  INACTIVE = 'INACTIVE',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment method
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  ACH = 'ACH',
  ECHECK = 'ECHECK',
  CASH = 'CASH',
  CHECK = 'CHECK',
  MONEY_ORDER = 'MONEY_ORDER',
}

/**
 * Notification channel
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  PORTAL = 'PORTAL',
  MAIL = 'MAIL',
}

/**
 * Service level priority
 */
export enum ServicePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Citizen service request
 */
export interface CitizenServiceRequest {
  id: string;
  requestNumber: string;
  requestType: ServiceRequestType;
  status: ServiceRequestStatus;
  priority: ServicePriority;
  citizenId: string;
  title: string;
  description: string;
  department: string;
  assignedTo?: string;
  submittedDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  address?: ServiceAddress;
  attachments: string[];
  statusHistory: StatusUpdate[];
  metadata?: Record<string, any>;
}

/**
 * Status update
 */
export interface StatusUpdate {
  updateId: string;
  status: ServiceRequestStatus;
  updatedBy: string;
  updatedDate: Date;
  comment?: string;
}

/**
 * Service address
 */
export interface ServiceAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  parcelId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Permit application
 */
export interface PermitApplication {
  id: string;
  permitNumber: string;
  permitType: PermitType;
  status: PermitStatus;
  applicantId: string;
  applicantName: string;
  projectAddress: ServiceAddress;
  projectDescription: string;
  estimatedValue?: number;
  applicationDate: Date;
  approvalDate?: Date;
  expirationDate?: Date;
  issuedDate?: Date;
  reviewedBy?: string;
  inspections: PermitInspection[];
  fees: PermitFee[];
  documents: string[];
  conditions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Permit inspection
 */
export interface PermitInspection {
  inspectionId: string;
  inspectionType: string;
  scheduledDate?: Date;
  completedDate?: Date;
  inspectorId?: string;
  result?: 'passed' | 'failed' | 'conditional';
  notes?: string;
}

/**
 * Permit fee
 */
export interface PermitFee {
  feeId: string;
  feeType: string;
  amount: number;
  paid: boolean;
  paidDate?: Date;
  paymentId?: string;
}

/**
 * License application
 */
export interface LicenseApplication {
  id: string;
  licenseNumber: string;
  licenseType: LicenseType;
  status: LicenseStatus;
  holderId: string;
  holderName: string;
  businessName?: string;
  businessAddress?: ServiceAddress;
  issueDate?: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  fees: number;
  paid: boolean;
  paymentId?: string;
  documents: string[];
  conditions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Online payment transaction
 */
export interface PaymentTransaction {
  id: string;
  transactionNumber: string;
  citizenId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  requestId?: string;
  permitId?: string;
  licenseId?: string;
  description: string;
  initiatedDate: Date;
  completedDate?: Date;
  confirmationNumber?: string;
  gatewayResponse?: string;
  refundAmount?: number;
  refundDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Citizen notification
 */
export interface CitizenNotification {
  id: string;
  citizenId: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  relatedRequestId?: string;
  relatedPermitId?: string;
  relatedLicenseId?: string;
  sentDate?: Date;
  deliveredDate?: Date;
  readDate?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  retryCount: number;
  metadata?: Record<string, any>;
}

/**
 * Service level agreement
 */
export interface ServiceLevelAgreement {
  id: string;
  serviceType: ServiceRequestType;
  responseTimeHours: number;
  resolutionTimeDays: number;
  escalationTimeHours?: number;
  description: string;
  active: boolean;
  effectiveDate: Date;
  metadata?: Record<string, any>;
}

/**
 * Citizen feedback
 */
export interface CitizenFeedback {
  id: string;
  citizenId: string;
  requestId?: string;
  rating: number; // 1-5
  category: string;
  comments?: string;
  submittedDate: Date;
  respondedBy?: string;
  responseDate?: Date;
  response?: string;
  metadata?: Record<string, any>;
}

/**
 * Self-service portal session
 */
export interface PortalSession {
  id: string;
  citizenId: string;
  sessionToken: string;
  loginDate: Date;
  expirationDate: Date;
  lastActivityDate: Date;
  ipAddress: string;
  deviceInfo?: string;
  active: boolean;
}

/**
 * Service catalog item
 */
export interface ServiceCatalogItem {
  id: string;
  serviceName: string;
  serviceCode: string;
  description: string;
  category: string;
  department: string;
  requestType: ServiceRequestType;
  fee?: number;
  processingTime?: string;
  requirements: string[];
  onlineAvailable: boolean;
  formUrl?: string;
  active: boolean;
  metadata?: Record<string, any>;
}

/**
 * Citizen profile
 */
export interface CitizenProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: ServiceAddress;
  dateOfBirth?: Date;
  accountCreatedDate: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredNotificationChannel: NotificationChannel;
  metadata?: Record<string, any>;
}

/**
 * Multi-channel service delivery
 */
export interface ServiceDeliveryChannel {
  channelId: string;
  channelName: string;
  channelType: 'online' | 'in_person' | 'phone' | 'mail' | 'mobile_app';
  available: boolean;
  supportedServices: string[];
  hours?: string;
  location?: string;
  contactInfo?: string;
}

// ============================================================================
// CITIZEN PORTAL INTEGRATION
// ============================================================================

/**
 * Creates a citizen service request
 */
export function createServiceRequest(params: {
  requestType: ServiceRequestType;
  citizenId: string;
  title: string;
  description: string;
  department: string;
  priority?: ServicePriority;
  address?: ServiceAddress;
}): CitizenServiceRequest {
  const requestNumber = generateRequestNumber();

  return {
    id: crypto.randomUUID(),
    requestNumber,
    requestType: params.requestType,
    status: ServiceRequestStatus.SUBMITTED,
    priority: params.priority || ServicePriority.MEDIUM,
    citizenId: params.citizenId,
    title: params.title,
    description: params.description,
    department: params.department,
    submittedDate: new Date(),
    address: params.address,
    attachments: [],
    statusHistory: [],
  };
}

/**
 * Generates unique request number
 */
export function generateRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SR-${timestamp}-${random}`;
}

/**
 * Updates service request status
 */
export function updateServiceRequestStatus(
  request: CitizenServiceRequest,
  newStatus: ServiceRequestStatus,
  updatedBy: string,
  comment?: string,
): CitizenServiceRequest {
  const statusUpdate: StatusUpdate = {
    updateId: crypto.randomUUID(),
    status: newStatus,
    updatedBy,
    updatedDate: new Date(),
    comment,
  };

  return {
    ...request,
    status: newStatus,
    statusHistory: [...request.statusHistory, statusUpdate],
  };
}

/**
 * Assigns service request to staff
 */
export function assignServiceRequest(
  request: CitizenServiceRequest,
  assignedTo: string,
  assignedBy: string,
): CitizenServiceRequest {
  return updateServiceRequestStatus(
    { ...request, assignedTo },
    ServiceRequestStatus.IN_PROGRESS,
    assignedBy,
    `Assigned to ${assignedTo}`,
  );
}

/**
 * Completes service request
 */
export function completeServiceRequest(
  request: CitizenServiceRequest,
  completedBy: string,
): CitizenServiceRequest {
  return {
    ...updateServiceRequestStatus(request, ServiceRequestStatus.COMPLETED, completedBy),
    actualCompletionDate: new Date(),
  };
}

/**
 * Gets service requests by status
 */
export function getServiceRequestsByStatus(
  requests: CitizenServiceRequest[],
  status: ServiceRequestStatus,
): CitizenServiceRequest[] {
  return requests.filter(req => req.status === status);
}

// ============================================================================
// SERVICE REQUEST MANAGEMENT
// ============================================================================

/**
 * Calculates expected completion date based on SLA
 */
export function calculateExpectedCompletionDate(
  request: CitizenServiceRequest,
  sla: ServiceLevelAgreement,
): Date {
  const completionDate = new Date(request.submittedDate);
  completionDate.setDate(completionDate.getDate() + sla.resolutionTimeDays);
  return completionDate;
}

/**
 * Checks if request is overdue
 */
export function isRequestOverdue(
  request: CitizenServiceRequest,
  currentDate: Date = new Date(),
): boolean {
  if (!request.expectedCompletionDate || request.status === ServiceRequestStatus.COMPLETED) {
    return false;
  }

  return currentDate > request.expectedCompletionDate;
}

/**
 * Gets overdue service requests
 */
export function getOverdueRequests(
  requests: CitizenServiceRequest[],
  currentDate: Date = new Date(),
): CitizenServiceRequest[] {
  return requests.filter(req => isRequestOverdue(req, currentDate));
}

/**
 * Escalates service request
 */
export function escalateServiceRequest(
  request: CitizenServiceRequest,
  escalatedBy: string,
  reason: string,
): CitizenServiceRequest {
  return {
    ...request,
    priority: ServicePriority.HIGH,
    statusHistory: [
      ...request.statusHistory,
      {
        updateId: crypto.randomUUID(),
        status: request.status,
        updatedBy: escalatedBy,
        updatedDate: new Date(),
        comment: `ESCALATED: ${reason}`,
      },
    ],
  };
}

// ============================================================================
// PERMIT APPLICATION PROCESSING
// ============================================================================

/**
 * Creates a permit application
 */
export function createPermitApplication(params: {
  permitType: PermitType;
  applicantId: string;
  applicantName: string;
  projectAddress: ServiceAddress;
  projectDescription: string;
  estimatedValue?: number;
}): PermitApplication {
  const permitNumber = generatePermitNumber();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  return {
    id: crypto.randomUUID(),
    permitNumber,
    permitType: params.permitType,
    status: PermitStatus.DRAFT,
    applicantId: params.applicantId,
    applicantName: params.applicantName,
    projectAddress: params.projectAddress,
    projectDescription: params.projectDescription,
    estimatedValue: params.estimatedValue,
    applicationDate: new Date(),
    expirationDate,
    inspections: [],
    fees: [],
    documents: [],
  };
}

/**
 * Generates permit number
 */
export function generatePermitNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `P${year}-${timestamp}${random}`;
}

/**
 * Submits permit application
 */
export function submitPermitApplication(
  permit: PermitApplication,
): PermitApplication {
  return {
    ...permit,
    status: PermitStatus.SUBMITTED,
    applicationDate: new Date(),
  };
}

/**
 * Approves permit application
 */
export function approvePermitApplication(
  permit: PermitApplication,
  reviewedBy: string,
): PermitApplication {
  return {
    ...permit,
    status: PermitStatus.APPROVED,
    reviewedBy,
    approvalDate: new Date(),
  };
}

/**
 * Issues permit
 */
export function issuePermit(
  permit: PermitApplication,
): PermitApplication {
  return {
    ...permit,
    status: PermitStatus.ISSUED,
    issuedDate: new Date(),
  };
}

/**
 * Adds inspection to permit
 */
export function addPermitInspection(
  permit: PermitApplication,
  inspection: PermitInspection,
): PermitApplication {
  return {
    ...permit,
    inspections: [...permit.inspections, inspection],
  };
}

/**
 * Schedules permit inspection
 */
export function schedulePermitInspection(params: {
  inspectionType: string;
  scheduledDate: Date;
  inspectorId: string;
}): PermitInspection {
  return {
    inspectionId: crypto.randomUUID(),
    inspectionType: params.inspectionType,
    scheduledDate: params.scheduledDate,
    inspectorId: params.inspectorId,
  };
}

/**
 * Records inspection result
 */
export function recordInspectionResult(
  inspection: PermitInspection,
  result: 'passed' | 'failed' | 'conditional',
  notes?: string,
): PermitInspection {
  return {
    ...inspection,
    completedDate: new Date(),
    result,
    notes,
  };
}

// ============================================================================
// LICENSE RENEWAL WORKFLOWS
// ============================================================================

/**
 * Creates a license application
 */
export function createLicenseApplication(params: {
  licenseType: LicenseType;
  holderId: string;
  holderName: string;
  businessName?: string;
  businessAddress?: ServiceAddress;
  fees: number;
}): LicenseApplication {
  const licenseNumber = generateLicenseNumber();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  return {
    id: crypto.randomUUID(),
    licenseNumber,
    licenseType: params.licenseType,
    status: LicenseStatus.ACTIVE,
    holderId: params.holderId,
    holderName: params.holderName,
    businessName: params.businessName,
    businessAddress: params.businessAddress,
    issueDate: new Date(),
    expirationDate,
    fees: params.fees,
    paid: false,
    documents: [],
  };
}

/**
 * Generates license number
 */
export function generateLicenseNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `L${year}-${timestamp}${random}`;
}

/**
 * Renews license
 */
export function renewLicense(
  license: LicenseApplication,
  renewalPeriodYears: number = 1,
): LicenseApplication {
  const newExpirationDate = new Date(license.expirationDate || new Date());
  newExpirationDate.setFullYear(newExpirationDate.getFullYear() + renewalPeriodYears);

  return {
    ...license,
    status: LicenseStatus.ACTIVE,
    renewalDate: new Date(),
    expirationDate: newExpirationDate,
    paid: false,
  };
}

/**
 * Gets licenses expiring soon
 */
export function getLicensesExpiringSoon(
  licenses: LicenseApplication[],
  daysThreshold: number = 30,
): LicenseApplication[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return licenses.filter(
    license =>
      license.status === LicenseStatus.ACTIVE &&
      license.expirationDate &&
      license.expirationDate <= thresholdDate &&
      license.expirationDate > new Date(),
  );
}

/**
 * Suspends license
 */
export function suspendLicense(
  license: LicenseApplication,
  reason: string,
): LicenseApplication {
  return {
    ...license,
    status: LicenseStatus.SUSPENDED,
    metadata: {
      ...license.metadata,
      suspensionReason: reason,
      suspensionDate: new Date().toISOString(),
    },
  };
}

// ============================================================================
// ONLINE PAYMENT INTEGRATION
// ============================================================================

/**
 * Creates a payment transaction
 */
export function createPaymentTransaction(params: {
  citizenId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  requestId?: string;
  permitId?: string;
  licenseId?: string;
}): PaymentTransaction {
  const transactionNumber = generateTransactionNumber();

  return {
    id: crypto.randomUUID(),
    transactionNumber,
    citizenId: params.citizenId,
    amount: params.amount,
    paymentMethod: params.paymentMethod,
    status: PaymentStatus.PENDING,
    requestId: params.requestId,
    permitId: params.permitId,
    licenseId: params.licenseId,
    description: params.description,
    initiatedDate: new Date(),
  };
}

/**
 * Generates transaction number
 */
export function generateTransactionNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

/**
 * Processes payment
 */
export function processPayment(
  transaction: PaymentTransaction,
  confirmationNumber: string,
  gatewayResponse?: string,
): PaymentTransaction {
  return {
    ...transaction,
    status: PaymentStatus.COMPLETED,
    completedDate: new Date(),
    confirmationNumber,
    gatewayResponse,
  };
}

/**
 * Refunds payment
 */
export function refundPayment(
  transaction: PaymentTransaction,
  refundAmount: number,
): PaymentTransaction {
  return {
    ...transaction,
    status: PaymentStatus.REFUNDED,
    refundAmount,
    refundDate: new Date(),
  };
}

/**
 * Validates payment amount
 */
export function validatePaymentAmount(
  amount: number,
  minAmount: number = 0.01,
  maxAmount: number = 999999.99,
): { valid: boolean; error?: string } {
  if (amount < minAmount) {
    return { valid: false, error: `Amount must be at least $${minAmount}` };
  }

  if (amount > maxAmount) {
    return { valid: false, error: `Amount cannot exceed $${maxAmount}` };
  }

  return { valid: true };
}

// ============================================================================
// CITIZEN NOTIFICATION SYSTEM
// ============================================================================

/**
 * Creates a citizen notification
 */
export function createCitizenNotification(params: {
  citizenId: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  relatedRequestId?: string;
  relatedPermitId?: string;
  relatedLicenseId?: string;
}): CitizenNotification {
  return {
    id: crypto.randomUUID(),
    citizenId: params.citizenId,
    channel: params.channel,
    subject: params.subject,
    message: params.message,
    relatedRequestId: params.relatedRequestId,
    relatedPermitId: params.relatedPermitId,
    relatedLicenseId: params.relatedLicenseId,
    status: 'pending',
    retryCount: 0,
  };
}

/**
 * Sends notification
 */
export function sendNotification(
  notification: CitizenNotification,
): CitizenNotification {
  return {
    ...notification,
    status: 'sent',
    sentDate: new Date(),
  };
}

/**
 * Marks notification as delivered
 */
export function markNotificationDelivered(
  notification: CitizenNotification,
): CitizenNotification {
  return {
    ...notification,
    status: 'delivered',
    deliveredDate: new Date(),
  };
}

/**
 * Marks notification as read
 */
export function markNotificationRead(
  notification: CitizenNotification,
): CitizenNotification {
  return {
    ...notification,
    status: 'read',
    readDate: new Date(),
  };
}

/**
 * Retries failed notification
 */
export function retryNotification(
  notification: CitizenNotification,
): CitizenNotification {
  return {
    ...notification,
    status: 'pending',
    retryCount: notification.retryCount + 1,
  };
}

// ============================================================================
// SERVICE LEVEL AGREEMENTS
// ============================================================================

/**
 * Creates a service level agreement
 */
export function createServiceLevelAgreement(params: {
  serviceType: ServiceRequestType;
  responseTimeHours: number;
  resolutionTimeDays: number;
  escalationTimeHours?: number;
  description: string;
}): ServiceLevelAgreement {
  return {
    id: crypto.randomUUID(),
    serviceType: params.serviceType,
    responseTimeHours: params.responseTimeHours,
    resolutionTimeDays: params.resolutionTimeDays,
    escalationTimeHours: params.escalationTimeHours,
    description: params.description,
    active: true,
    effectiveDate: new Date(),
  };
}

/**
 * Checks SLA compliance
 */
export function checkSLACompliance(
  request: CitizenServiceRequest,
  sla: ServiceLevelAgreement,
  currentDate: Date = new Date(),
): { compliant: boolean; breachType?: string } {
  const responseTime = calculateResponseTime(request);
  if (responseTime > sla.responseTimeHours * 60) {
    return { compliant: false, breachType: 'response_time' };
  }

  if (request.expectedCompletionDate && currentDate > request.expectedCompletionDate) {
    return { compliant: false, breachType: 'resolution_time' };
  }

  return { compliant: true };
}

/**
 * Calculates response time in minutes
 */
export function calculateResponseTime(request: CitizenServiceRequest): number {
  if (request.statusHistory.length === 0) {
    const now = new Date();
    return (now.getTime() - request.submittedDate.getTime()) / (1000 * 60);
  }

  const firstResponse = request.statusHistory[0];
  return (firstResponse.updatedDate.getTime() - request.submittedDate.getTime()) / (1000 * 60);
}

// ============================================================================
// CITIZEN FEEDBACK TRACKING
// ============================================================================

/**
 * Creates citizen feedback
 */
export function createCitizenFeedback(params: {
  citizenId: string;
  requestId?: string;
  rating: number;
  category: string;
  comments?: string;
}): CitizenFeedback {
  return {
    id: crypto.randomUUID(),
    citizenId: params.citizenId,
    requestId: params.requestId,
    rating: Math.max(1, Math.min(5, params.rating)),
    category: params.category,
    comments: params.comments,
    submittedDate: new Date(),
  };
}

/**
 * Responds to feedback
 */
export function respondToFeedback(
  feedback: CitizenFeedback,
  respondedBy: string,
  response: string,
): CitizenFeedback {
  return {
    ...feedback,
    respondedBy,
    responseDate: new Date(),
    response,
  };
}

/**
 * Calculates average rating
 */
export function calculateAverageRating(feedbacks: CitizenFeedback[]): number {
  if (feedbacks.length === 0) return 0;

  const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  return totalRating / feedbacks.length;
}

/**
 * Gets feedback by rating range
 */
export function getFeedbackByRatingRange(
  feedbacks: CitizenFeedback[],
  minRating: number,
  maxRating: number,
): CitizenFeedback[] {
  return feedbacks.filter(fb => fb.rating >= minRating && fb.rating <= maxRating);
}

// ============================================================================
// SELF-SERVICE PORTALS
// ============================================================================

/**
 * Creates portal session
 */
export function createPortalSession(params: {
  citizenId: string;
  ipAddress: string;
  deviceInfo?: string;
}): PortalSession {
  const sessionToken = generateSessionToken();
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);

  return {
    id: crypto.randomUUID(),
    citizenId: params.citizenId,
    sessionToken,
    loginDate: new Date(),
    expirationDate,
    lastActivityDate: new Date(),
    ipAddress: params.ipAddress,
    deviceInfo: params.deviceInfo,
    active: true,
  };
}

/**
 * Generates session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validates portal session
 */
export function validatePortalSession(
  session: PortalSession,
  currentDate: Date = new Date(),
): { valid: boolean; reason?: string } {
  if (!session.active) {
    return { valid: false, reason: 'Session inactive' };
  }

  if (currentDate > session.expirationDate) {
    return { valid: false, reason: 'Session expired' };
  }

  return { valid: true };
}

/**
 * Updates session activity
 */
export function updateSessionActivity(session: PortalSession): PortalSession {
  return {
    ...session,
    lastActivityDate: new Date(),
  };
}

/**
 * Terminates portal session
 */
export function terminatePortalSession(session: PortalSession): PortalSession {
  return {
    ...session,
    active: false,
  };
}

// ============================================================================
// SERVICE CATALOG MANAGEMENT
// ============================================================================

/**
 * Creates service catalog item
 */
export function createServiceCatalogItem(params: {
  serviceName: string;
  serviceCode: string;
  description: string;
  category: string;
  department: string;
  requestType: ServiceRequestType;
  fee?: number;
  processingTime?: string;
  requirements: string[];
  onlineAvailable: boolean;
  formUrl?: string;
}): ServiceCatalogItem {
  return {
    id: crypto.randomUUID(),
    serviceName: params.serviceName,
    serviceCode: params.serviceCode,
    description: params.description,
    category: params.category,
    department: params.department,
    requestType: params.requestType,
    fee: params.fee,
    processingTime: params.processingTime,
    requirements: params.requirements,
    onlineAvailable: params.onlineAvailable,
    formUrl: params.formUrl,
    active: true,
  };
}

/**
 * Searches service catalog
 */
export function searchServiceCatalog(
  items: ServiceCatalogItem[],
  keyword: string,
): ServiceCatalogItem[] {
  const lowerKeyword = keyword.toLowerCase();

  return items.filter(
    item =>
      item.active &&
      (item.serviceName.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.category.toLowerCase().includes(lowerKeyword)),
  );
}

/**
 * Gets services by category
 */
export function getServicesByCategory(
  items: ServiceCatalogItem[],
  category: string,
): ServiceCatalogItem[] {
  return items.filter(item => item.active && item.category === category);
}

/**
 * Gets online available services
 */
export function getOnlineServices(items: ServiceCatalogItem[]): ServiceCatalogItem[] {
  return items.filter(item => item.active && item.onlineAvailable);
}

// ============================================================================
// CITIZEN AUTHENTICATION
// ============================================================================

/**
 * Creates citizen profile
 */
export function createCitizenProfile(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: ServiceAddress;
  dateOfBirth?: Date;
}): CitizenProfile {
  return {
    id: crypto.randomUUID(),
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phone: params.phone,
    address: params.address,
    dateOfBirth: params.dateOfBirth,
    accountCreatedDate: new Date(),
    emailVerified: false,
    phoneVerified: false,
    preferredNotificationChannel: NotificationChannel.EMAIL,
  };
}

/**
 * Verifies citizen email
 */
export function verifyCitizenEmail(profile: CitizenProfile): CitizenProfile {
  return {
    ...profile,
    emailVerified: true,
  };
}

/**
 * Verifies citizen phone
 */
export function verifyCitizenPhone(profile: CitizenProfile): CitizenProfile {
  return {
    ...profile,
    phoneVerified: true,
  };
}

/**
 * Updates notification preferences
 */
export function updateNotificationPreferences(
  profile: CitizenProfile,
  channel: NotificationChannel,
): CitizenProfile {
  return {
    ...profile,
    preferredNotificationChannel: channel,
  };
}

// ============================================================================
// MULTI-CHANNEL SERVICE DELIVERY
// ============================================================================

/**
 * Creates service delivery channel
 */
export function createServiceDeliveryChannel(params: {
  channelName: string;
  channelType: 'online' | 'in_person' | 'phone' | 'mail' | 'mobile_app';
  supportedServices: string[];
  hours?: string;
  location?: string;
  contactInfo?: string;
}): ServiceDeliveryChannel {
  return {
    channelId: crypto.randomUUID(),
    channelName: params.channelName,
    channelType: params.channelType,
    available: true,
    supportedServices: params.supportedServices,
    hours: params.hours,
    location: params.location,
    contactInfo: params.contactInfo,
  };
}

/**
 * Gets available channels for service
 */
export function getAvailableChannelsForService(
  channels: ServiceDeliveryChannel[],
  serviceId: string,
): ServiceDeliveryChannel[] {
  return channels.filter(
    channel => channel.available && channel.supportedServices.includes(serviceId),
  );
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model for CitizenServiceRequest
 */
export const CitizenServiceRequestModel = {
  tableName: 'citizen_service_requests',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    requestNumber: { type: 'STRING', allowNull: false, unique: true },
    requestType: { type: 'ENUM', values: Object.values(ServiceRequestType) },
    status: { type: 'ENUM', values: Object.values(ServiceRequestStatus) },
    priority: { type: 'ENUM', values: Object.values(ServicePriority) },
    citizenId: { type: 'UUID', allowNull: false },
    title: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    department: { type: 'STRING', allowNull: false },
    assignedTo: { type: 'STRING', allowNull: true },
    submittedDate: { type: 'DATE', allowNull: false },
    expectedCompletionDate: { type: 'DATE', allowNull: true },
    actualCompletionDate: { type: 'DATE', allowNull: true },
    address: { type: 'JSON', allowNull: true },
    attachments: { type: 'JSON', defaultValue: [] },
    statusHistory: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['requestNumber'] },
    { fields: ['citizenId'] },
    { fields: ['status'] },
    { fields: ['requestType'] },
    { fields: ['submittedDate'] },
  ],
};

/**
 * Sequelize model for PermitApplication
 */
export const PermitApplicationModel = {
  tableName: 'permit_applications',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    permitNumber: { type: 'STRING', allowNull: false, unique: true },
    permitType: { type: 'ENUM', values: Object.values(PermitType) },
    status: { type: 'ENUM', values: Object.values(PermitStatus) },
    applicantId: { type: 'UUID', allowNull: false },
    applicantName: { type: 'STRING', allowNull: false },
    projectAddress: { type: 'JSON', allowNull: false },
    projectDescription: { type: 'TEXT', allowNull: false },
    estimatedValue: { type: 'DECIMAL(15,2)', allowNull: true },
    applicationDate: { type: 'DATE', allowNull: false },
    approvalDate: { type: 'DATE', allowNull: true },
    expirationDate: { type: 'DATE', allowNull: true },
    issuedDate: { type: 'DATE', allowNull: true },
    reviewedBy: { type: 'STRING', allowNull: true },
    inspections: { type: 'JSON', defaultValue: [] },
    fees: { type: 'JSON', defaultValue: [] },
    documents: { type: 'JSON', defaultValue: [] },
    conditions: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['permitNumber'] },
    { fields: ['applicantId'] },
    { fields: ['status'] },
    { fields: ['permitType'] },
    { fields: ['applicationDate'] },
  ],
};

/**
 * Sequelize model for LicenseApplication
 */
export const LicenseApplicationModel = {
  tableName: 'license_applications',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    licenseNumber: { type: 'STRING', allowNull: false, unique: true },
    licenseType: { type: 'ENUM', values: Object.values(LicenseType) },
    status: { type: 'ENUM', values: Object.values(LicenseStatus) },
    holderId: { type: 'UUID', allowNull: false },
    holderName: { type: 'STRING', allowNull: false },
    businessName: { type: 'STRING', allowNull: true },
    businessAddress: { type: 'JSON', allowNull: true },
    issueDate: { type: 'DATE', allowNull: true },
    expirationDate: { type: 'DATE', allowNull: true },
    renewalDate: { type: 'DATE', allowNull: true },
    fees: { type: 'DECIMAL(10,2)', allowNull: false },
    paid: { type: 'BOOLEAN', defaultValue: false },
    paymentId: { type: 'UUID', allowNull: true },
    documents: { type: 'JSON', defaultValue: [] },
    conditions: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['licenseNumber'] },
    { fields: ['holderId'] },
    { fields: ['status'] },
    { fields: ['licenseType'] },
    { fields: ['expirationDate'] },
  ],
};

/**
 * Sequelize model for PaymentTransaction
 */
export const PaymentTransactionModel = {
  tableName: 'payment_transactions',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    transactionNumber: { type: 'STRING', allowNull: false, unique: true },
    citizenId: { type: 'UUID', allowNull: false },
    amount: { type: 'DECIMAL(10,2)', allowNull: false },
    paymentMethod: { type: 'ENUM', values: Object.values(PaymentMethod) },
    status: { type: 'ENUM', values: Object.values(PaymentStatus) },
    requestId: { type: 'UUID', allowNull: true },
    permitId: { type: 'UUID', allowNull: true },
    licenseId: { type: 'UUID', allowNull: true },
    description: { type: 'STRING', allowNull: false },
    initiatedDate: { type: 'DATE', allowNull: false },
    completedDate: { type: 'DATE', allowNull: true },
    confirmationNumber: { type: 'STRING', allowNull: true },
    gatewayResponse: { type: 'TEXT', allowNull: true },
    refundAmount: { type: 'DECIMAL(10,2)', allowNull: true },
    refundDate: { type: 'DATE', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['transactionNumber'] },
    { fields: ['citizenId'] },
    { fields: ['status'] },
    { fields: ['initiatedDate'] },
  ],
};

// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================

/**
 * Example NestJS service for citizen services
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CitizenServicesService {
 *   constructor(
 *     @InjectModel(CitizenServiceRequestModel)
 *     private requestRepo: Repository<CitizenServiceRequest>,
 *   ) {}
 *
 *   async createServiceRequest(dto: CreateServiceRequestDto): Promise<CitizenServiceRequest> {
 *     const request = createServiceRequest(dto);
 *     return this.requestRepo.save(request);
 *   }
 *
 *   async getOverdueRequests(): Promise<CitizenServiceRequest[]> {
 *     const allRequests = await this.requestRepo.find();
 *     return getOverdueRequests(allRequests);
 *   }
 * }
 * ```
 */
export const CitizenServicesServiceExample = `
@Injectable()
export class CitizenServicesService {
  constructor(
    @InjectModel(CitizenServiceRequestModel)
    private requestRepo: Repository<CitizenServiceRequest>,
    @InjectModel(PermitApplicationModel)
    private permitRepo: Repository<PermitApplication>,
    @InjectModel(PaymentTransactionModel)
    private paymentRepo: Repository<PaymentTransaction>,
  ) {}

  async processServiceRequest(
    requestId: string,
    action: string,
    userId: string,
  ): Promise<CitizenServiceRequest> {
    const request = await this.requestRepo.findOne({ where: { id: requestId } });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    let updatedRequest: CitizenServiceRequest;

    switch (action) {
      case 'assign':
        updatedRequest = assignServiceRequest(request, userId, userId);
        break;
      case 'complete':
        updatedRequest = completeServiceRequest(request, userId);
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    return this.requestRepo.save(updatedRequest);
  }
}
`;

// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================

/**
 * Swagger DTO for creating service request
 */
export const CreateServiceRequestDto = {
  schema: {
    type: 'object',
    required: ['requestType', 'citizenId', 'title', 'description', 'department'],
    properties: {
      requestType: { type: 'string', enum: Object.values(ServiceRequestType) },
      citizenId: { type: 'string', format: 'uuid' },
      title: { type: 'string', example: 'Pothole Repair Request' },
      description: { type: 'string', example: 'Large pothole on Main Street causing traffic issues' },
      department: { type: 'string', example: 'Public Works' },
      priority: { type: 'string', enum: Object.values(ServicePriority) },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zipCode: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Swagger DTO for permit application
 */
export const CreatePermitApplicationDto = {
  schema: {
    type: 'object',
    required: [
      'permitType',
      'applicantId',
      'applicantName',
      'projectAddress',
      'projectDescription',
    ],
    properties: {
      permitType: { type: 'string', enum: Object.values(PermitType) },
      applicantId: { type: 'string', format: 'uuid' },
      applicantName: { type: 'string', example: 'John Smith' },
      projectAddress: {
        type: 'object',
        properties: {
          street: { type: 'string', example: '123 Main St' },
          city: { type: 'string', example: 'Springfield' },
          state: { type: 'string', example: 'IL' },
          zipCode: { type: 'string', example: '62701' },
        },
      },
      projectDescription: { type: 'string', example: 'Residential addition - 500 sq ft' },
      estimatedValue: { type: 'number', example: 75000 },
    },
  },
};

/**
 * Swagger DTO for payment transaction
 */
export const CreatePaymentTransactionDto = {
  schema: {
    type: 'object',
    required: ['citizenId', 'amount', 'paymentMethod', 'description'],
    properties: {
      citizenId: { type: 'string', format: 'uuid' },
      amount: { type: 'number', example: 150.00 },
      paymentMethod: { type: 'string', enum: Object.values(PaymentMethod) },
      description: { type: 'string', example: 'Building permit fee' },
      requestId: { type: 'string', format: 'uuid' },
      permitId: { type: 'string', format: 'uuid' },
      licenseId: { type: 'string', format: 'uuid' },
    },
  },
};

/**
 * Swagger response schema for service request
 */
export const ServiceRequestResponse = {
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      requestNumber: { type: 'string', example: 'SR-ABC123' },
      requestType: { type: 'string', enum: Object.values(ServiceRequestType) },
      status: { type: 'string', enum: Object.values(ServiceRequestStatus) },
      priority: { type: 'string', enum: Object.values(ServicePriority) },
      title: { type: 'string' },
      description: { type: 'string' },
      submittedDate: { type: 'string', format: 'date-time' },
      expectedCompletionDate: { type: 'string', format: 'date-time' },
    },
  },
};
