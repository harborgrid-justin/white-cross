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
 * Service request types
 */
export declare enum ServiceRequestType {
    PERMIT_APPLICATION = "PERMIT_APPLICATION",
    LICENSE_RENEWAL = "LICENSE_RENEWAL",
    COMPLAINT = "COMPLAINT",
    INFORMATION_REQUEST = "INFORMATION_REQUEST",
    PROPERTY_INQUIRY = "PROPERTY_INQUIRY",
    CODE_VIOLATION = "CODE_VIOLATION",
    PUBLIC_WORKS_REQUEST = "PUBLIC_WORKS_REQUEST",
    ZONING_REQUEST = "ZONING_REQUEST",
    INSPECTION_REQUEST = "INSPECTION_REQUEST",
    DOCUMENT_REQUEST = "DOCUMENT_REQUEST"
}
/**
 * Service request status
 */
export declare enum ServiceRequestStatus {
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_INSPECTION = "PENDING_INSPECTION",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
/**
 * Permit types
 */
export declare enum PermitType {
    BUILDING = "BUILDING",
    ELECTRICAL = "ELECTRICAL",
    PLUMBING = "PLUMBING",
    MECHANICAL = "MECHANICAL",
    DEMOLITION = "DEMOLITION",
    SIGN = "SIGN",
    FENCE = "FENCE",
    SIDEWALK = "SIDEWALK",
    SPECIAL_EVENT = "SPECIAL_EVENT",
    TEMPORARY_USE = "TEMPORARY_USE",
    ZONING_VARIANCE = "ZONING_VARIANCE"
}
/**
 * Permit status
 */
export declare enum PermitStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    APPROVED = "APPROVED",
    ISSUED = "ISSUED",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED",
    DENIED = "DENIED"
}
/**
 * License types
 */
export declare enum LicenseType {
    BUSINESS = "BUSINESS",
    PROFESSIONAL = "PROFESSIONAL",
    CONTRACTOR = "CONTRACTOR",
    VENDOR = "VENDOR",
    LIQUOR = "LIQUOR",
    FOOD_SERVICE = "FOOD_SERVICE",
    HEALTH_CARE = "HEALTH_CARE",
    CHILD_CARE = "CHILD_CARE",
    ANIMAL = "ANIMAL",
    TAXI_RIDESHARE = "TAXI_RIDESHARE"
}
/**
 * License status
 */
export declare enum LicenseStatus {
    ACTIVE = "ACTIVE",
    PENDING_RENEWAL = "PENDING_RENEWAL",
    EXPIRED = "EXPIRED",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED",
    INACTIVE = "INACTIVE"
}
/**
 * Payment status
 */
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED"
}
/**
 * Payment method
 */
export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    ACH = "ACH",
    ECHECK = "ECHECK",
    CASH = "CASH",
    CHECK = "CHECK",
    MONEY_ORDER = "MONEY_ORDER"
}
/**
 * Notification channel
 */
export declare enum NotificationChannel {
    EMAIL = "EMAIL",
    SMS = "SMS",
    PUSH = "PUSH",
    PORTAL = "PORTAL",
    MAIL = "MAIL"
}
/**
 * Service level priority
 */
export declare enum ServicePriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
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
    rating: number;
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
/**
 * Creates a citizen service request
 */
export declare function createServiceRequest(params: {
    requestType: ServiceRequestType;
    citizenId: string;
    title: string;
    description: string;
    department: string;
    priority?: ServicePriority;
    address?: ServiceAddress;
}): CitizenServiceRequest;
/**
 * Generates unique request number
 */
export declare function generateRequestNumber(): string;
/**
 * Updates service request status
 */
export declare function updateServiceRequestStatus(request: CitizenServiceRequest, newStatus: ServiceRequestStatus, updatedBy: string, comment?: string): CitizenServiceRequest;
/**
 * Assigns service request to staff
 */
export declare function assignServiceRequest(request: CitizenServiceRequest, assignedTo: string, assignedBy: string): CitizenServiceRequest;
/**
 * Completes service request
 */
export declare function completeServiceRequest(request: CitizenServiceRequest, completedBy: string): CitizenServiceRequest;
/**
 * Gets service requests by status
 */
export declare function getServiceRequestsByStatus(requests: CitizenServiceRequest[], status: ServiceRequestStatus): CitizenServiceRequest[];
/**
 * Calculates expected completion date based on SLA
 */
export declare function calculateExpectedCompletionDate(request: CitizenServiceRequest, sla: ServiceLevelAgreement): Date;
/**
 * Checks if request is overdue
 */
export declare function isRequestOverdue(request: CitizenServiceRequest, currentDate?: Date): boolean;
/**
 * Gets overdue service requests
 */
export declare function getOverdueRequests(requests: CitizenServiceRequest[], currentDate?: Date): CitizenServiceRequest[];
/**
 * Escalates service request
 */
export declare function escalateServiceRequest(request: CitizenServiceRequest, escalatedBy: string, reason: string): CitizenServiceRequest;
/**
 * Creates a permit application
 */
export declare function createPermitApplication(params: {
    permitType: PermitType;
    applicantId: string;
    applicantName: string;
    projectAddress: ServiceAddress;
    projectDescription: string;
    estimatedValue?: number;
}): PermitApplication;
/**
 * Generates permit number
 */
export declare function generatePermitNumber(): string;
/**
 * Submits permit application
 */
export declare function submitPermitApplication(permit: PermitApplication): PermitApplication;
/**
 * Approves permit application
 */
export declare function approvePermitApplication(permit: PermitApplication, reviewedBy: string): PermitApplication;
/**
 * Issues permit
 */
export declare function issuePermit(permit: PermitApplication): PermitApplication;
/**
 * Adds inspection to permit
 */
export declare function addPermitInspection(permit: PermitApplication, inspection: PermitInspection): PermitApplication;
/**
 * Schedules permit inspection
 */
export declare function schedulePermitInspection(params: {
    inspectionType: string;
    scheduledDate: Date;
    inspectorId: string;
}): PermitInspection;
/**
 * Records inspection result
 */
export declare function recordInspectionResult(inspection: PermitInspection, result: 'passed' | 'failed' | 'conditional', notes?: string): PermitInspection;
/**
 * Creates a license application
 */
export declare function createLicenseApplication(params: {
    licenseType: LicenseType;
    holderId: string;
    holderName: string;
    businessName?: string;
    businessAddress?: ServiceAddress;
    fees: number;
}): LicenseApplication;
/**
 * Generates license number
 */
export declare function generateLicenseNumber(): string;
/**
 * Renews license
 */
export declare function renewLicense(license: LicenseApplication, renewalPeriodYears?: number): LicenseApplication;
/**
 * Gets licenses expiring soon
 */
export declare function getLicensesExpiringSoon(licenses: LicenseApplication[], daysThreshold?: number): LicenseApplication[];
/**
 * Suspends license
 */
export declare function suspendLicense(license: LicenseApplication, reason: string): LicenseApplication;
/**
 * Creates a payment transaction
 */
export declare function createPaymentTransaction(params: {
    citizenId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    description: string;
    requestId?: string;
    permitId?: string;
    licenseId?: string;
}): PaymentTransaction;
/**
 * Generates transaction number
 */
export declare function generateTransactionNumber(): string;
/**
 * Processes payment
 */
export declare function processPayment(transaction: PaymentTransaction, confirmationNumber: string, gatewayResponse?: string): PaymentTransaction;
/**
 * Refunds payment
 */
export declare function refundPayment(transaction: PaymentTransaction, refundAmount: number): PaymentTransaction;
/**
 * Validates payment amount
 */
export declare function validatePaymentAmount(amount: number, minAmount?: number, maxAmount?: number): {
    valid: boolean;
    error?: string;
};
/**
 * Creates a citizen notification
 */
export declare function createCitizenNotification(params: {
    citizenId: string;
    channel: NotificationChannel;
    subject: string;
    message: string;
    relatedRequestId?: string;
    relatedPermitId?: string;
    relatedLicenseId?: string;
}): CitizenNotification;
/**
 * Sends notification
 */
export declare function sendNotification(notification: CitizenNotification): CitizenNotification;
/**
 * Marks notification as delivered
 */
export declare function markNotificationDelivered(notification: CitizenNotification): CitizenNotification;
/**
 * Marks notification as read
 */
export declare function markNotificationRead(notification: CitizenNotification): CitizenNotification;
/**
 * Retries failed notification
 */
export declare function retryNotification(notification: CitizenNotification): CitizenNotification;
/**
 * Creates a service level agreement
 */
export declare function createServiceLevelAgreement(params: {
    serviceType: ServiceRequestType;
    responseTimeHours: number;
    resolutionTimeDays: number;
    escalationTimeHours?: number;
    description: string;
}): ServiceLevelAgreement;
/**
 * Checks SLA compliance
 */
export declare function checkSLACompliance(request: CitizenServiceRequest, sla: ServiceLevelAgreement, currentDate?: Date): {
    compliant: boolean;
    breachType?: string;
};
/**
 * Calculates response time in minutes
 */
export declare function calculateResponseTime(request: CitizenServiceRequest): number;
/**
 * Creates citizen feedback
 */
export declare function createCitizenFeedback(params: {
    citizenId: string;
    requestId?: string;
    rating: number;
    category: string;
    comments?: string;
}): CitizenFeedback;
/**
 * Responds to feedback
 */
export declare function respondToFeedback(feedback: CitizenFeedback, respondedBy: string, response: string): CitizenFeedback;
/**
 * Calculates average rating
 */
export declare function calculateAverageRating(feedbacks: CitizenFeedback[]): number;
/**
 * Gets feedback by rating range
 */
export declare function getFeedbackByRatingRange(feedbacks: CitizenFeedback[], minRating: number, maxRating: number): CitizenFeedback[];
/**
 * Creates portal session
 */
export declare function createPortalSession(params: {
    citizenId: string;
    ipAddress: string;
    deviceInfo?: string;
}): PortalSession;
/**
 * Generates session token
 */
export declare function generateSessionToken(): string;
/**
 * Validates portal session
 */
export declare function validatePortalSession(session: PortalSession, currentDate?: Date): {
    valid: boolean;
    reason?: string;
};
/**
 * Updates session activity
 */
export declare function updateSessionActivity(session: PortalSession): PortalSession;
/**
 * Terminates portal session
 */
export declare function terminatePortalSession(session: PortalSession): PortalSession;
/**
 * Creates service catalog item
 */
export declare function createServiceCatalogItem(params: {
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
}): ServiceCatalogItem;
/**
 * Searches service catalog
 */
export declare function searchServiceCatalog(items: ServiceCatalogItem[], keyword: string): ServiceCatalogItem[];
/**
 * Gets services by category
 */
export declare function getServicesByCategory(items: ServiceCatalogItem[], category: string): ServiceCatalogItem[];
/**
 * Gets online available services
 */
export declare function getOnlineServices(items: ServiceCatalogItem[]): ServiceCatalogItem[];
/**
 * Creates citizen profile
 */
export declare function createCitizenProfile(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: ServiceAddress;
    dateOfBirth?: Date;
}): CitizenProfile;
/**
 * Verifies citizen email
 */
export declare function verifyCitizenEmail(profile: CitizenProfile): CitizenProfile;
/**
 * Verifies citizen phone
 */
export declare function verifyCitizenPhone(profile: CitizenProfile): CitizenProfile;
/**
 * Updates notification preferences
 */
export declare function updateNotificationPreferences(profile: CitizenProfile, channel: NotificationChannel): CitizenProfile;
/**
 * Creates service delivery channel
 */
export declare function createServiceDeliveryChannel(params: {
    channelName: string;
    channelType: 'online' | 'in_person' | 'phone' | 'mail' | 'mobile_app';
    supportedServices: string[];
    hours?: string;
    location?: string;
    contactInfo?: string;
}): ServiceDeliveryChannel;
/**
 * Gets available channels for service
 */
export declare function getAvailableChannelsForService(channels: ServiceDeliveryChannel[], serviceId: string): ServiceDeliveryChannel[];
/**
 * Sequelize model for CitizenServiceRequest
 */
export declare const CitizenServiceRequestModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        requestNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        requestType: {
            type: string;
            values: ServiceRequestType[];
        };
        status: {
            type: string;
            values: ServiceRequestStatus[];
        };
        priority: {
            type: string;
            values: ServicePriority[];
        };
        citizenId: {
            type: string;
            allowNull: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        department: {
            type: string;
            allowNull: boolean;
        };
        assignedTo: {
            type: string;
            allowNull: boolean;
        };
        submittedDate: {
            type: string;
            allowNull: boolean;
        };
        expectedCompletionDate: {
            type: string;
            allowNull: boolean;
        };
        actualCompletionDate: {
            type: string;
            allowNull: boolean;
        };
        address: {
            type: string;
            allowNull: boolean;
        };
        attachments: {
            type: string;
            defaultValue: never[];
        };
        statusHistory: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for PermitApplication
 */
export declare const PermitApplicationModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        permitNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        permitType: {
            type: string;
            values: PermitType[];
        };
        status: {
            type: string;
            values: PermitStatus[];
        };
        applicantId: {
            type: string;
            allowNull: boolean;
        };
        applicantName: {
            type: string;
            allowNull: boolean;
        };
        projectAddress: {
            type: string;
            allowNull: boolean;
        };
        projectDescription: {
            type: string;
            allowNull: boolean;
        };
        estimatedValue: {
            type: string;
            allowNull: boolean;
        };
        applicationDate: {
            type: string;
            allowNull: boolean;
        };
        approvalDate: {
            type: string;
            allowNull: boolean;
        };
        expirationDate: {
            type: string;
            allowNull: boolean;
        };
        issuedDate: {
            type: string;
            allowNull: boolean;
        };
        reviewedBy: {
            type: string;
            allowNull: boolean;
        };
        inspections: {
            type: string;
            defaultValue: never[];
        };
        fees: {
            type: string;
            defaultValue: never[];
        };
        documents: {
            type: string;
            defaultValue: never[];
        };
        conditions: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for LicenseApplication
 */
export declare const LicenseApplicationModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        licenseNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        licenseType: {
            type: string;
            values: LicenseType[];
        };
        status: {
            type: string;
            values: LicenseStatus[];
        };
        holderId: {
            type: string;
            allowNull: boolean;
        };
        holderName: {
            type: string;
            allowNull: boolean;
        };
        businessName: {
            type: string;
            allowNull: boolean;
        };
        businessAddress: {
            type: string;
            allowNull: boolean;
        };
        issueDate: {
            type: string;
            allowNull: boolean;
        };
        expirationDate: {
            type: string;
            allowNull: boolean;
        };
        renewalDate: {
            type: string;
            allowNull: boolean;
        };
        fees: {
            type: string;
            allowNull: boolean;
        };
        paid: {
            type: string;
            defaultValue: boolean;
        };
        paymentId: {
            type: string;
            allowNull: boolean;
        };
        documents: {
            type: string;
            defaultValue: never[];
        };
        conditions: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for PaymentTransaction
 */
export declare const PaymentTransactionModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        transactionNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        citizenId: {
            type: string;
            allowNull: boolean;
        };
        amount: {
            type: string;
            allowNull: boolean;
        };
        paymentMethod: {
            type: string;
            values: PaymentMethod[];
        };
        status: {
            type: string;
            values: PaymentStatus[];
        };
        requestId: {
            type: string;
            allowNull: boolean;
        };
        permitId: {
            type: string;
            allowNull: boolean;
        };
        licenseId: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        initiatedDate: {
            type: string;
            allowNull: boolean;
        };
        completedDate: {
            type: string;
            allowNull: boolean;
        };
        confirmationNumber: {
            type: string;
            allowNull: boolean;
        };
        gatewayResponse: {
            type: string;
            allowNull: boolean;
        };
        refundAmount: {
            type: string;
            allowNull: boolean;
        };
        refundDate: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
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
export declare const CitizenServicesServiceExample = "\n@Injectable()\nexport class CitizenServicesService {\n  constructor(\n    @InjectModel(CitizenServiceRequestModel)\n    private requestRepo: Repository<CitizenServiceRequest>,\n    @InjectModel(PermitApplicationModel)\n    private permitRepo: Repository<PermitApplication>,\n    @InjectModel(PaymentTransactionModel)\n    private paymentRepo: Repository<PaymentTransaction>,\n  ) {}\n\n  async processServiceRequest(\n    requestId: string,\n    action: string,\n    userId: string,\n  ): Promise<CitizenServiceRequest> {\n    const request = await this.requestRepo.findOne({ where: { id: requestId } });\n\n    if (!request) {\n      throw new NotFoundException('Service request not found');\n    }\n\n    let updatedRequest: CitizenServiceRequest;\n\n    switch (action) {\n      case 'assign':\n        updatedRequest = assignServiceRequest(request, userId, userId);\n        break;\n      case 'complete':\n        updatedRequest = completeServiceRequest(request, userId);\n        break;\n      default:\n        throw new BadRequestException('Invalid action');\n    }\n\n    return this.requestRepo.save(updatedRequest);\n  }\n}\n";
/**
 * Swagger DTO for creating service request
 */
export declare const CreateServiceRequestDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            requestType: {
                type: string;
                enum: ServiceRequestType[];
            };
            citizenId: {
                type: string;
                format: string;
            };
            title: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            department: {
                type: string;
                example: string;
            };
            priority: {
                type: string;
                enum: ServicePriority[];
            };
            address: {
                type: string;
                properties: {
                    street: {
                        type: string;
                    };
                    city: {
                        type: string;
                    };
                    state: {
                        type: string;
                    };
                    zipCode: {
                        type: string;
                    };
                };
            };
        };
    };
};
/**
 * Swagger DTO for permit application
 */
export declare const CreatePermitApplicationDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            permitType: {
                type: string;
                enum: PermitType[];
            };
            applicantId: {
                type: string;
                format: string;
            };
            applicantName: {
                type: string;
                example: string;
            };
            projectAddress: {
                type: string;
                properties: {
                    street: {
                        type: string;
                        example: string;
                    };
                    city: {
                        type: string;
                        example: string;
                    };
                    state: {
                        type: string;
                        example: string;
                    };
                    zipCode: {
                        type: string;
                        example: string;
                    };
                };
            };
            projectDescription: {
                type: string;
                example: string;
            };
            estimatedValue: {
                type: string;
                example: number;
            };
        };
    };
};
/**
 * Swagger DTO for payment transaction
 */
export declare const CreatePaymentTransactionDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            citizenId: {
                type: string;
                format: string;
            };
            amount: {
                type: string;
                example: number;
            };
            paymentMethod: {
                type: string;
                enum: PaymentMethod[];
            };
            description: {
                type: string;
                example: string;
            };
            requestId: {
                type: string;
                format: string;
            };
            permitId: {
                type: string;
                format: string;
            };
            licenseId: {
                type: string;
                format: string;
            };
        };
    };
};
/**
 * Swagger response schema for service request
 */
export declare const ServiceRequestResponse: {
    schema: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            requestNumber: {
                type: string;
                example: string;
            };
            requestType: {
                type: string;
                enum: ServiceRequestType[];
            };
            status: {
                type: string;
                enum: ServiceRequestStatus[];
            };
            priority: {
                type: string;
                enum: ServicePriority[];
            };
            title: {
                type: string;
            };
            description: {
                type: string;
            };
            submittedDate: {
                type: string;
                format: string;
            };
            expectedCompletionDate: {
                type: string;
                format: string;
            };
        };
    };
};
//# sourceMappingURL=citizen-services-integration-kit.d.ts.map