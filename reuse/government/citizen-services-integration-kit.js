"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestResponse = exports.CreatePaymentTransactionDto = exports.CreatePermitApplicationDto = exports.CreateServiceRequestDto = exports.CitizenServicesServiceExample = exports.PaymentTransactionModel = exports.LicenseApplicationModel = exports.PermitApplicationModel = exports.CitizenServiceRequestModel = exports.ServicePriority = exports.NotificationChannel = exports.PaymentMethod = exports.PaymentStatus = exports.LicenseStatus = exports.LicenseType = exports.PermitStatus = exports.PermitType = exports.ServiceRequestStatus = exports.ServiceRequestType = void 0;
exports.createServiceRequest = createServiceRequest;
exports.generateRequestNumber = generateRequestNumber;
exports.updateServiceRequestStatus = updateServiceRequestStatus;
exports.assignServiceRequest = assignServiceRequest;
exports.completeServiceRequest = completeServiceRequest;
exports.getServiceRequestsByStatus = getServiceRequestsByStatus;
exports.calculateExpectedCompletionDate = calculateExpectedCompletionDate;
exports.isRequestOverdue = isRequestOverdue;
exports.getOverdueRequests = getOverdueRequests;
exports.escalateServiceRequest = escalateServiceRequest;
exports.createPermitApplication = createPermitApplication;
exports.generatePermitNumber = generatePermitNumber;
exports.submitPermitApplication = submitPermitApplication;
exports.approvePermitApplication = approvePermitApplication;
exports.issuePermit = issuePermit;
exports.addPermitInspection = addPermitInspection;
exports.schedulePermitInspection = schedulePermitInspection;
exports.recordInspectionResult = recordInspectionResult;
exports.createLicenseApplication = createLicenseApplication;
exports.generateLicenseNumber = generateLicenseNumber;
exports.renewLicense = renewLicense;
exports.getLicensesExpiringSoon = getLicensesExpiringSoon;
exports.suspendLicense = suspendLicense;
exports.createPaymentTransaction = createPaymentTransaction;
exports.generateTransactionNumber = generateTransactionNumber;
exports.processPayment = processPayment;
exports.refundPayment = refundPayment;
exports.validatePaymentAmount = validatePaymentAmount;
exports.createCitizenNotification = createCitizenNotification;
exports.sendNotification = sendNotification;
exports.markNotificationDelivered = markNotificationDelivered;
exports.markNotificationRead = markNotificationRead;
exports.retryNotification = retryNotification;
exports.createServiceLevelAgreement = createServiceLevelAgreement;
exports.checkSLACompliance = checkSLACompliance;
exports.calculateResponseTime = calculateResponseTime;
exports.createCitizenFeedback = createCitizenFeedback;
exports.respondToFeedback = respondToFeedback;
exports.calculateAverageRating = calculateAverageRating;
exports.getFeedbackByRatingRange = getFeedbackByRatingRange;
exports.createPortalSession = createPortalSession;
exports.generateSessionToken = generateSessionToken;
exports.validatePortalSession = validatePortalSession;
exports.updateSessionActivity = updateSessionActivity;
exports.terminatePortalSession = terminatePortalSession;
exports.createServiceCatalogItem = createServiceCatalogItem;
exports.searchServiceCatalog = searchServiceCatalog;
exports.getServicesByCategory = getServicesByCategory;
exports.getOnlineServices = getOnlineServices;
exports.createCitizenProfile = createCitizenProfile;
exports.verifyCitizenEmail = verifyCitizenEmail;
exports.verifyCitizenPhone = verifyCitizenPhone;
exports.updateNotificationPreferences = updateNotificationPreferences;
exports.createServiceDeliveryChannel = createServiceDeliveryChannel;
exports.getAvailableChannelsForService = getAvailableChannelsForService;
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
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Service request types
 */
var ServiceRequestType;
(function (ServiceRequestType) {
    ServiceRequestType["PERMIT_APPLICATION"] = "PERMIT_APPLICATION";
    ServiceRequestType["LICENSE_RENEWAL"] = "LICENSE_RENEWAL";
    ServiceRequestType["COMPLAINT"] = "COMPLAINT";
    ServiceRequestType["INFORMATION_REQUEST"] = "INFORMATION_REQUEST";
    ServiceRequestType["PROPERTY_INQUIRY"] = "PROPERTY_INQUIRY";
    ServiceRequestType["CODE_VIOLATION"] = "CODE_VIOLATION";
    ServiceRequestType["PUBLIC_WORKS_REQUEST"] = "PUBLIC_WORKS_REQUEST";
    ServiceRequestType["ZONING_REQUEST"] = "ZONING_REQUEST";
    ServiceRequestType["INSPECTION_REQUEST"] = "INSPECTION_REQUEST";
    ServiceRequestType["DOCUMENT_REQUEST"] = "DOCUMENT_REQUEST";
})(ServiceRequestType || (exports.ServiceRequestType = ServiceRequestType = {}));
/**
 * Service request status
 */
var ServiceRequestStatus;
(function (ServiceRequestStatus) {
    ServiceRequestStatus["SUBMITTED"] = "SUBMITTED";
    ServiceRequestStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ServiceRequestStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    ServiceRequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ServiceRequestStatus["PENDING_INSPECTION"] = "PENDING_INSPECTION";
    ServiceRequestStatus["APPROVED"] = "APPROVED";
    ServiceRequestStatus["REJECTED"] = "REJECTED";
    ServiceRequestStatus["COMPLETED"] = "COMPLETED";
    ServiceRequestStatus["CANCELLED"] = "CANCELLED";
    ServiceRequestStatus["ON_HOLD"] = "ON_HOLD";
})(ServiceRequestStatus || (exports.ServiceRequestStatus = ServiceRequestStatus = {}));
/**
 * Permit types
 */
var PermitType;
(function (PermitType) {
    PermitType["BUILDING"] = "BUILDING";
    PermitType["ELECTRICAL"] = "ELECTRICAL";
    PermitType["PLUMBING"] = "PLUMBING";
    PermitType["MECHANICAL"] = "MECHANICAL";
    PermitType["DEMOLITION"] = "DEMOLITION";
    PermitType["SIGN"] = "SIGN";
    PermitType["FENCE"] = "FENCE";
    PermitType["SIDEWALK"] = "SIDEWALK";
    PermitType["SPECIAL_EVENT"] = "SPECIAL_EVENT";
    PermitType["TEMPORARY_USE"] = "TEMPORARY_USE";
    PermitType["ZONING_VARIANCE"] = "ZONING_VARIANCE";
})(PermitType || (exports.PermitType = PermitType = {}));
/**
 * Permit status
 */
var PermitStatus;
(function (PermitStatus) {
    PermitStatus["DRAFT"] = "DRAFT";
    PermitStatus["SUBMITTED"] = "SUBMITTED";
    PermitStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    PermitStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    PermitStatus["APPROVED"] = "APPROVED";
    PermitStatus["ISSUED"] = "ISSUED";
    PermitStatus["EXPIRED"] = "EXPIRED";
    PermitStatus["REVOKED"] = "REVOKED";
    PermitStatus["DENIED"] = "DENIED";
})(PermitStatus || (exports.PermitStatus = PermitStatus = {}));
/**
 * License types
 */
var LicenseType;
(function (LicenseType) {
    LicenseType["BUSINESS"] = "BUSINESS";
    LicenseType["PROFESSIONAL"] = "PROFESSIONAL";
    LicenseType["CONTRACTOR"] = "CONTRACTOR";
    LicenseType["VENDOR"] = "VENDOR";
    LicenseType["LIQUOR"] = "LIQUOR";
    LicenseType["FOOD_SERVICE"] = "FOOD_SERVICE";
    LicenseType["HEALTH_CARE"] = "HEALTH_CARE";
    LicenseType["CHILD_CARE"] = "CHILD_CARE";
    LicenseType["ANIMAL"] = "ANIMAL";
    LicenseType["TAXI_RIDESHARE"] = "TAXI_RIDESHARE";
})(LicenseType || (exports.LicenseType = LicenseType = {}));
/**
 * License status
 */
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["PENDING_RENEWAL"] = "PENDING_RENEWAL";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
    LicenseStatus["REVOKED"] = "REVOKED";
    LicenseStatus["INACTIVE"] = "INACTIVE";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
/**
 * Payment status
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * Payment method
 */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["ACH"] = "ACH";
    PaymentMethod["ECHECK"] = "ECHECK";
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CHECK"] = "CHECK";
    PaymentMethod["MONEY_ORDER"] = "MONEY_ORDER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
/**
 * Notification channel
 */
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["PORTAL"] = "PORTAL";
    NotificationChannel["MAIL"] = "MAIL";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
/**
 * Service level priority
 */
var ServicePriority;
(function (ServicePriority) {
    ServicePriority["CRITICAL"] = "CRITICAL";
    ServicePriority["HIGH"] = "HIGH";
    ServicePriority["MEDIUM"] = "MEDIUM";
    ServicePriority["LOW"] = "LOW";
})(ServicePriority || (exports.ServicePriority = ServicePriority = {}));
// ============================================================================
// CITIZEN PORTAL INTEGRATION
// ============================================================================
/**
 * Creates a citizen service request
 */
function createServiceRequest(params) {
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
function generateRequestNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `SR-${timestamp}-${random}`;
}
/**
 * Updates service request status
 */
function updateServiceRequestStatus(request, newStatus, updatedBy, comment) {
    const statusUpdate = {
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
function assignServiceRequest(request, assignedTo, assignedBy) {
    return updateServiceRequestStatus({ ...request, assignedTo }, ServiceRequestStatus.IN_PROGRESS, assignedBy, `Assigned to ${assignedTo}`);
}
/**
 * Completes service request
 */
function completeServiceRequest(request, completedBy) {
    return {
        ...updateServiceRequestStatus(request, ServiceRequestStatus.COMPLETED, completedBy),
        actualCompletionDate: new Date(),
    };
}
/**
 * Gets service requests by status
 */
function getServiceRequestsByStatus(requests, status) {
    return requests.filter(req => req.status === status);
}
// ============================================================================
// SERVICE REQUEST MANAGEMENT
// ============================================================================
/**
 * Calculates expected completion date based on SLA
 */
function calculateExpectedCompletionDate(request, sla) {
    const completionDate = new Date(request.submittedDate);
    completionDate.setDate(completionDate.getDate() + sla.resolutionTimeDays);
    return completionDate;
}
/**
 * Checks if request is overdue
 */
function isRequestOverdue(request, currentDate = new Date()) {
    if (!request.expectedCompletionDate || request.status === ServiceRequestStatus.COMPLETED) {
        return false;
    }
    return currentDate > request.expectedCompletionDate;
}
/**
 * Gets overdue service requests
 */
function getOverdueRequests(requests, currentDate = new Date()) {
    return requests.filter(req => isRequestOverdue(req, currentDate));
}
/**
 * Escalates service request
 */
function escalateServiceRequest(request, escalatedBy, reason) {
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
function createPermitApplication(params) {
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
function generatePermitNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `P${year}-${timestamp}${random}`;
}
/**
 * Submits permit application
 */
function submitPermitApplication(permit) {
    return {
        ...permit,
        status: PermitStatus.SUBMITTED,
        applicationDate: new Date(),
    };
}
/**
 * Approves permit application
 */
function approvePermitApplication(permit, reviewedBy) {
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
function issuePermit(permit) {
    return {
        ...permit,
        status: PermitStatus.ISSUED,
        issuedDate: new Date(),
    };
}
/**
 * Adds inspection to permit
 */
function addPermitInspection(permit, inspection) {
    return {
        ...permit,
        inspections: [...permit.inspections, inspection],
    };
}
/**
 * Schedules permit inspection
 */
function schedulePermitInspection(params) {
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
function recordInspectionResult(inspection, result, notes) {
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
function createLicenseApplication(params) {
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
function generateLicenseNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `L${year}-${timestamp}${random}`;
}
/**
 * Renews license
 */
function renewLicense(license, renewalPeriodYears = 1) {
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
function getLicensesExpiringSoon(licenses, daysThreshold = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return licenses.filter(license => license.status === LicenseStatus.ACTIVE &&
        license.expirationDate &&
        license.expirationDate <= thresholdDate &&
        license.expirationDate > new Date());
}
/**
 * Suspends license
 */
function suspendLicense(license, reason) {
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
function createPaymentTransaction(params) {
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
function generateTransactionNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `TXN-${timestamp}-${random}`;
}
/**
 * Processes payment
 */
function processPayment(transaction, confirmationNumber, gatewayResponse) {
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
function refundPayment(transaction, refundAmount) {
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
function validatePaymentAmount(amount, minAmount = 0.01, maxAmount = 999999.99) {
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
function createCitizenNotification(params) {
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
function sendNotification(notification) {
    return {
        ...notification,
        status: 'sent',
        sentDate: new Date(),
    };
}
/**
 * Marks notification as delivered
 */
function markNotificationDelivered(notification) {
    return {
        ...notification,
        status: 'delivered',
        deliveredDate: new Date(),
    };
}
/**
 * Marks notification as read
 */
function markNotificationRead(notification) {
    return {
        ...notification,
        status: 'read',
        readDate: new Date(),
    };
}
/**
 * Retries failed notification
 */
function retryNotification(notification) {
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
function createServiceLevelAgreement(params) {
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
function checkSLACompliance(request, sla, currentDate = new Date()) {
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
function calculateResponseTime(request) {
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
function createCitizenFeedback(params) {
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
function respondToFeedback(feedback, respondedBy, response) {
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
function calculateAverageRating(feedbacks) {
    if (feedbacks.length === 0)
        return 0;
    const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return totalRating / feedbacks.length;
}
/**
 * Gets feedback by rating range
 */
function getFeedbackByRatingRange(feedbacks, minRating, maxRating) {
    return feedbacks.filter(fb => fb.rating >= minRating && fb.rating <= maxRating);
}
// ============================================================================
// SELF-SERVICE PORTALS
// ============================================================================
/**
 * Creates portal session
 */
function createPortalSession(params) {
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
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}
/**
 * Validates portal session
 */
function validatePortalSession(session, currentDate = new Date()) {
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
function updateSessionActivity(session) {
    return {
        ...session,
        lastActivityDate: new Date(),
    };
}
/**
 * Terminates portal session
 */
function terminatePortalSession(session) {
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
function createServiceCatalogItem(params) {
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
function searchServiceCatalog(items, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return items.filter(item => item.active &&
        (item.serviceName.toLowerCase().includes(lowerKeyword) ||
            item.description.toLowerCase().includes(lowerKeyword) ||
            item.category.toLowerCase().includes(lowerKeyword)));
}
/**
 * Gets services by category
 */
function getServicesByCategory(items, category) {
    return items.filter(item => item.active && item.category === category);
}
/**
 * Gets online available services
 */
function getOnlineServices(items) {
    return items.filter(item => item.active && item.onlineAvailable);
}
// ============================================================================
// CITIZEN AUTHENTICATION
// ============================================================================
/**
 * Creates citizen profile
 */
function createCitizenProfile(params) {
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
function verifyCitizenEmail(profile) {
    return {
        ...profile,
        emailVerified: true,
    };
}
/**
 * Verifies citizen phone
 */
function verifyCitizenPhone(profile) {
    return {
        ...profile,
        phoneVerified: true,
    };
}
/**
 * Updates notification preferences
 */
function updateNotificationPreferences(profile, channel) {
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
function createServiceDeliveryChannel(params) {
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
function getAvailableChannelsForService(channels, serviceId) {
    return channels.filter(channel => channel.available && channel.supportedServices.includes(serviceId));
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model for CitizenServiceRequest
 */
exports.CitizenServiceRequestModel = {
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
exports.PermitApplicationModel = {
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
exports.LicenseApplicationModel = {
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
exports.PaymentTransactionModel = {
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
exports.CitizenServicesServiceExample = `
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
exports.CreateServiceRequestDto = {
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
exports.CreatePermitApplicationDto = {
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
exports.CreatePaymentTransactionDto = {
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
exports.ServiceRequestResponse = {
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
//# sourceMappingURL=citizen-services-integration-kit.js.map