/**
 * LOC: WARRMGMT1234567
 * File: /reuse/construction/construction-warranty-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *   - ../encryption-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Warranty controllers
 *   - Claims processing engines
 *   - Contractor management systems
 */
/**
 * File: /reuse/construction/construction-warranty-management-kit.ts
 * Locator: WC-CONST-WARR-001
 * Purpose: Comprehensive Construction Warranty Management & Claims Processing System
 *
 * Upstream: Error handling, validation, auditing, encryption utilities
 * Downstream: ../backend/*, Warranty controllers, claims services, contractor management, cost tracking, document management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, @nestjs/passport, @nestjs/jwt
 * Exports: 40+ utility functions for warranty tracking, registration, claims processing, expiration tracking, contractor callbacks, cost analytics, extended warranty, document management
 *
 * LLM Context: Enterprise-grade construction warranty management system for White Cross healthcare facility construction.
 * Provides warranty registration, claim submission and processing, expiration tracking and renewal workflows, contractor callback scheduling,
 * warranty cost tracking and analytics, extended warranty management, comprehensive document management, audit trails, compliance verification,
 * automated notifications, performance metrics, and role-based access control for secure warranty operations.
 *
 * SECURITY FEATURES:
 * - JWT authentication with role-based access control (RBAC)
 * - Role-specific guards for warranty operations
 * - Encrypted sensitive warranty data (cost, contractor info)
 * - Audit logging for all warranty and claim operations
 * - Permission-based authorization (create, read, update, delete)
 * - Rate limiting for claim submissions
 * - CSRF protection for state-changing operations
 * - Field-level encryption for contractor payment details
 */
import { Sequelize, Transaction } from 'sequelize';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WarrantyType, WarrantyStatus, ClaimStatus, ClaimPriority, CallbackStatus, NotificationFrequency } from './types/warranty.types';
/**
 * Role-based access control roles for warranty management
 */
export declare enum WarrantyRole {
    ADMIN = "ADMIN",
    WARRANTY_MANAGER = "WARRANTY_MANAGER",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    CONTRACTOR = "CONTRACTOR",
    INSPECTOR = "INSPECTOR",
    FINANCE = "FINANCE",
    VIEWER = "VIEWER"
}
/**
 * Warranty-specific permissions
 */
export declare enum WarrantyPermission {
    CREATE_WARRANTY = "warranty:create",
    READ_WARRANTY = "warranty:read",
    UPDATE_WARRANTY = "warranty:update",
    DELETE_WARRANTY = "warranty:delete",
    APPROVE_CLAIM = "claim:approve",
    PROCESS_CLAIM = "claim:process",
    VIEW_COSTS = "costs:view",
    MANAGE_CONTRACTORS = "contractors:manage",
    EXPORT_DATA = "warranty:export"
}
/**
 * Decorator to specify required roles for warranty operations
 */
export declare const RequireWarrantyRoles: (...roles: WarrantyRole[]) => any;
/**
 * Decorator to specify required permissions for warranty operations
 */
export declare const RequireWarrantyPermissions: (...permissions: WarrantyPermission[]) => any;
/**
 * Role-based access guard for warranty operations
 */
export declare class WarrantyRolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Permission-based access guard for warranty operations
 */
export declare class WarrantyPermissionsGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
export declare enum WarrantyType {
    MANUFACTURER = "MANUFACTURER",
    CONTRACTOR = "CONTRACTOR",
    SUBCONTRACTOR = "SUBCONTRACTOR",
    SUPPLIER = "SUPPLIER",
    EXTENDED = "EXTENDED",
    LABOR = "LABOR",
    MATERIALS = "MATERIALS",
    WORKMANSHIP = "WORKMANSHIP",
    SYSTEM = "SYSTEM"
}
export declare enum WarrantyStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PENDING_ACTIVATION = "PENDING_ACTIVATION",
    EXPIRING_SOON = "EXPIRING_SOON",
    EXPIRED = "EXPIRED",
    RENEWED = "RENEWED",
    TERMINATED = "TERMINATED",
    SUSPENDED = "SUSPENDED"
}
export declare enum ClaimStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED",
    DISPUTED = "DISPUTED"
}
export declare enum ClaimPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
    EMERGENCY = "EMERGENCY"
}
export declare enum CallbackStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED"
}
export declare enum NotificationFrequency {
    IMMEDIATE = "IMMEDIATE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY"
}
interface WarrantyData {
    projectId: number;
    warrantyNumber: string;
    warrantyType: WarrantyType;
    title: string;
    description: string;
    component: string;
    location: string;
    contractorId: number;
    contractorName: string;
    contractorContact: string;
    manufacturerId?: number;
    manufacturerName?: string;
    startDate: Date;
    endDate: Date;
    durationMonths: number;
    coverageAmount: number;
    deductible: number;
    terms: string;
    exclusions: string[];
    conditions: string[];
    status: WarrantyStatus;
    documentUrls: string[];
    certificateNumber?: string;
    policyNumber?: string;
    insuranceProvider?: string;
}
interface ClaimData {
    warrantyId: number;
    claimNumber: string;
    title: string;
    description: string;
    issueDate: Date;
    reportedBy: string;
    priority: ClaimPriority;
    component: string;
    location: string;
    defectDescription: string;
    estimatedCost: number;
    actualCost?: number;
    status: ClaimStatus;
    assignedTo?: string;
    reviewedBy?: string;
    approvedBy?: string;
    rejectionReason?: string;
    photos: string[];
    documents: string[];
}
interface CallbackSchedule {
    claimId: number;
    warrantyId: number;
    contractorId: number;
    scheduledDate: Date;
    scheduledTime: string;
    estimatedDuration: number;
    location: string;
    workDescription: string;
    status: CallbackStatus;
    contactPerson: string;
    contactPhone: string;
    specialInstructions?: string;
}
interface WarrantyCost {
    warrantyId?: number;
    claimId?: number;
    costType: 'REGISTRATION' | 'CLAIM' | 'REPAIR' | 'EXTENDED' | 'ADMIN';
    description: string;
    amount: number;
    currency: string;
    incurredDate: Date;
    paidBy: string;
    reimbursed: boolean;
    reimbursementAmount?: number;
    invoiceNumber?: string;
    approvedBy?: string;
}
interface ExtendedWarrantyOption {
    warrantyId: number;
    extensionMonths: number;
    additionalCost: number;
    newEndDate: Date;
    terms: string;
    conditions: string[];
    offeredBy: string;
    validUntil: Date;
    approved: boolean;
    purchasedDate?: Date;
}
interface WarrantyDocument {
    warrantyId: number;
    documentType: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    version: number;
    isActive: boolean;
    expirationDate?: Date;
}
interface WarrantyMetrics {
    projectId: number;
    period: string;
    totalWarranties: number;
    activeWarranties: number;
    expiredWarranties: number;
    expiringWithin30Days: number;
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    pendingClaims: number;
    totalClaimCost: number;
    averageResolutionDays: number;
    callbacksScheduled: number;
    callbacksCompleted: number;
    contractorPerformanceScore: number;
}
/**
 * Sequelize model for Construction Warranty Management with comprehensive tracking.
 * Includes encryption for sensitive contractor and cost information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionWarranty model
 *
 * @example
 * ```typescript
 * const ConstructionWarranty = createConstructionWarrantyModel(sequelize);
 * const warranty = await ConstructionWarranty.create({
 *   projectId: 1,
 *   warrantyNumber: 'WRN-2025-001',
 *   warrantyType: WarrantyType.CONTRACTOR,
 *   title: 'HVAC System Warranty',
 *   status: WarrantyStatus.ACTIVE,
 *   createdBy: 'warranty.manager'
 * });
 * ```
 */
export declare const createConstructionWarrantyModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectId: number;
        warrantyNumber: string;
        warrantyType: WarrantyType;
        title: string;
        description: string;
        component: string;
        location: string;
        contractorId: number;
        contractorName: string;
        contractorContact: string;
        manufacturerId: number | null;
        manufacturerName: string | null;
        startDate: Date;
        endDate: Date;
        durationMonths: number;
        coverageAmount: number;
        deductible: number;
        terms: string;
        exclusions: string[];
        conditions: string[];
        status: WarrantyStatus;
        documentUrls: string[];
        certificateNumber: string | null;
        policyNumber: string | null;
        insuranceProvider: string | null;
        notificationsSent: number;
        lastNotificationDate: Date | null;
        extendedWarranty: boolean;
        originalWarrantyId: number | null;
        autoRenewalEnabled: boolean;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Warranty Claims with comprehensive tracking and audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WarrantyClaim model
 *
 * @example
 * ```typescript
 * const WarrantyClaim = createWarrantyClaimModel(sequelize);
 * const claim = await WarrantyClaim.create({
 *   warrantyId: 1,
 *   claimNumber: 'CLM-2025-001',
 *   title: 'HVAC Temperature Control Issue',
 *   priority: ClaimPriority.HIGH,
 *   status: ClaimStatus.SUBMITTED,
 *   createdBy: 'facility.manager'
 * });
 * ```
 */
export declare const createWarrantyClaimModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        warrantyId: number;
        claimNumber: string;
        title: string;
        description: string;
        issueDate: Date;
        reportedBy: string;
        reportedByContact: string;
        priority: ClaimPriority;
        component: string;
        location: string;
        defectDescription: string;
        rootCause: string | null;
        estimatedCost: number;
        actualCost: number | null;
        laborCost: number | null;
        materialCost: number | null;
        status: ClaimStatus;
        assignedTo: string | null;
        assignedDate: Date | null;
        reviewedBy: string | null;
        reviewedDate: Date | null;
        reviewNotes: string | null;
        approvedBy: string | null;
        approvedDate: Date | null;
        rejectionReason: string | null;
        resolutionDate: Date | null;
        resolutionDescription: string | null;
        photos: string[];
        documents: string[];
        callbackScheduled: boolean;
        callbackDate: Date | null;
        completionDate: Date | null;
        completionNotes: string | null;
        satisfactionRating: number | null;
        feedback: string | null;
        escalated: boolean;
        escalationLevel: number;
        escalationReason: string | null;
        disputeReason: string | null;
        disputeResolution: string | null;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Registers a new construction warranty with complete tracking.
 * Requires WARRANTY_MANAGER or ADMIN role.
 *
 * @param {Partial<WarrantyData>} warrantyData - Warranty registration data
 * @param {string} createdBy - User creating the warranty
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created warranty record
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN role
 * - Permissions: CREATE_WARRANTY
 * - Audit: Logs warranty creation
 * - Encryption: Sensitive cost and contact data
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const warranty = await registerWarranty({
 *   projectId: 1,
 *   warrantyType: WarrantyType.CONTRACTOR,
 *   title: 'HVAC System 5-Year Warranty',
 *   startDate: new Date('2025-01-01'),
 *   durationMonths: 60,
 *   contractorId: 15
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const registerWarranty: (warrantyData: Partial<WarrantyData>, createdBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates existing warranty information with audit trail.
 * Requires WARRANTY_MANAGER or ADMIN role.
 *
 * @param {number} warrantyId - Warranty ID to update
 * @param {Partial<WarrantyData>} updates - Warranty updates
 * @param {string} updatedBy - User performing update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Updated warranty record
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN role
 * - Permissions: UPDATE_WARRANTY
 * - Audit: Logs all changes with before/after values
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const updated = await updateWarranty(1, {
 *   status: WarrantyStatus.ACTIVE,
 *   certificateNumber: 'CERT-2025-001'
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const updateWarranty: (warrantyId: number, updates: Partial<WarrantyData>, updatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Activates a pending warranty and starts coverage period.
 * Requires WARRANTY_MANAGER or ADMIN role.
 *
 * @param {number} warrantyId - Warranty ID to activate
 * @param {string} activatedBy - User activating warranty
 * @param {Date} [effectiveDate] - Effective activation date
 * @returns {Promise<object>} Activated warranty
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN role
 * - Permissions: UPDATE_WARRANTY
 * - Audit: Logs activation with timestamp
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const activated = await activateWarranty(1, 'warranty.manager@company.com');
 * ```
 */
export declare const activateWarranty: (warrantyId: number, activatedBy: string, effectiveDate?: Date) => Promise<any>;
/**
 * Retrieves warranty details by ID or warranty number.
 * Requires valid JWT authentication.
 *
 * @param {number | string} identifier - Warranty ID or warranty number
 * @returns {Promise<object>} Warranty details
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 * - Filters: Role-based data visibility
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const warranty = await getWarrantyById(1);
 * // Or by warranty number
 * const warranty = await getWarrantyById('WRN-2025-001');
 * ```
 */
export declare const getWarrantyById: (identifier: number | string) => Promise<any>;
/**
 * Lists warranties with filtering, pagination, and role-based access.
 * Supports complex filtering by status, type, date ranges, and contractor.
 *
 * @param {object} filters - Filter criteria
 * @param {object} pagination - Pagination options
 * @param {string} requestedBy - User requesting list
 * @returns {Promise<object>} Paginated warranty list
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 * - Filters: Role-based visibility
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const warranties = await listWarranties({
 *   projectId: 1,
 *   status: [WarrantyStatus.ACTIVE, WarrantyStatus.EXPIRING_SOON],
 *   warrantyType: WarrantyType.CONTRACTOR
 * }, { page: 1, limit: 20 }, 'user@company.com');
 * ```
 */
export declare const listWarranties: (filters: {
    projectId?: number;
    status?: WarrantyStatus[];
    warrantyType?: WarrantyType[];
    contractorId?: number;
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
    component?: string;
    search?: string;
}, pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}, requestedBy: string) => Promise<any>;
/**
 * Submits a new warranty claim for review.
 * Rate-limited to prevent spam submissions.
 *
 * @param {Partial<ClaimData>} claimData - Claim submission data
 * @param {string} submittedBy - User submitting claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Created claim record
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: Any authenticated user can submit
 * - Rate Limit: 10 claims per hour per user
 * - Audit: Logs claim submission
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, ThrottlerGuard)
 * @Throttle(10, 3600) // 10 per hour
 * const claim = await submitWarrantyClaim({
 *   warrantyId: 1,
 *   title: 'HVAC Temperature Control Issue',
 *   priority: ClaimPriority.HIGH,
 *   defectDescription: 'System fails to maintain temperature'
 * }, 'facility.manager@company.com');
 * ```
 */
export declare const submitWarrantyClaim: (claimData: Partial<ClaimData>, submittedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Reviews and updates warranty claim status.
 * Requires WARRANTY_MANAGER, PROJECT_MANAGER, or ADMIN role.
 *
 * @param {number} claimId - Claim ID to review
 * @param {object} reviewData - Review information
 * @param {string} reviewedBy - User performing review
 * @returns {Promise<object>} Updated claim
 *
 * @security
 * - Requires: WARRANTY_MANAGER, PROJECT_MANAGER, or ADMIN
 * - Permissions: PROCESS_CLAIM
 * - Audit: Logs review with notes
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const reviewed = await reviewWarrantyClaim(1, {
 *   status: ClaimStatus.APPROVED,
 *   reviewNotes: 'Valid claim, coverage confirmed',
 *   assignTo: 'contractor.smith@company.com'
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const reviewWarrantyClaim: (claimId: number, reviewData: {
    status: ClaimStatus;
    reviewNotes: string;
    assignTo?: string;
    estimatedCost?: number;
}, reviewedBy: string) => Promise<any>;
/**
 * Approves warranty claim for processing.
 * Requires ADMIN or WARRANTY_MANAGER with APPROVE_CLAIM permission.
 *
 * @param {number} claimId - Claim ID to approve
 * @param {string} approvedBy - User approving claim
 * @param {string} [approvalNotes] - Optional approval notes
 * @returns {Promise<object>} Approved claim
 *
 * @security
 * - Requires: ADMIN or WARRANTY_MANAGER
 * - Permissions: APPROVE_CLAIM
 * - Audit: Logs approval with user and timestamp
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard, WarrantyPermissionsGuard)
 * @RequireWarrantyRoles(WarrantyRole.ADMIN, WarrantyRole.WARRANTY_MANAGER)
 * @RequireWarrantyPermissions(WarrantyPermission.APPROVE_CLAIM)
 * const approved = await approveWarrantyClaim(
 *   1,
 *   'admin@company.com',
 *   'Approved for immediate repair'
 * );
 * ```
 */
export declare const approveWarrantyClaim: (claimId: number, approvedBy: string, approvalNotes?: string) => Promise<any>;
/**
 * Rejects warranty claim with reason.
 * Requires WARRANTY_MANAGER or ADMIN role.
 *
 * @param {number} claimId - Claim ID to reject
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} rejectedBy - User rejecting claim
 * @returns {Promise<object>} Rejected claim
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN
 * - Permissions: APPROVE_CLAIM
 * - Audit: Logs rejection with detailed reason
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const rejected = await rejectWarrantyClaim(
 *   1,
 *   'Issue not covered under warranty terms - user error',
 *   'warranty.manager@company.com'
 * );
 * ```
 */
export declare const rejectWarrantyClaim: (claimId: number, rejectionReason: string, rejectedBy: string) => Promise<any>;
/**
 * Updates claim processing status and tracks progress.
 * Requires assigned user, warranty manager, or admin.
 *
 * @param {number} claimId - Claim ID to update
 * @param {object} statusUpdate - Status update information
 * @param {string} updatedBy - User updating status
 * @returns {Promise<object>} Updated claim
 *
 * @security
 * - Requires: Valid JWT token
 * - Authorization: Must be assigned user or manager
 * - Audit: Logs status changes
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const updated = await updateClaimStatus(1, {
 *   status: ClaimStatus.IN_PROGRESS,
 *   actualCost: 2500.00,
 *   notes: 'Parts ordered, repair scheduled'
 * }, 'contractor.smith@company.com');
 * ```
 */
export declare const updateClaimStatus: (claimId: number, statusUpdate: {
    status: ClaimStatus;
    actualCost?: number;
    laborCost?: number;
    materialCost?: number;
    notes?: string;
    completionDate?: Date;
}, updatedBy: string) => Promise<any>;
/**
 * Checks for warranties expiring soon and triggers notifications.
 * Automated job runs daily to identify expiring warranties.
 *
 * @param {number} daysThreshold - Days before expiration to notify
 * @param {string} [projectId] - Optional specific project
 * @returns {Promise<object[]>} List of expiring warranties
 *
 * @security
 * - Requires: System service account or ADMIN
 * - Audit: Logs notification triggers
 *
 * @example
 * ```typescript
 * // Scheduled job (cron)
 * @Cron('0 8 * * *') // Daily at 8 AM
 * async checkExpiringWarranties() {
 *   const expiring = await checkWarrantyExpirations(30);
 *   // Send notifications
 * }
 * ```
 */
export declare const checkWarrantyExpirations: (daysThreshold: number, projectId?: number) => Promise<any[]>;
/**
 * Sends warranty expiration notifications to stakeholders.
 * Supports multiple notification channels (email, SMS, system).
 *
 * @param {number} warrantyId - Warranty ID
 * @param {string[]} recipients - Notification recipients
 * @param {NotificationFrequency} frequency - Notification frequency
 * @returns {Promise<object>} Notification result
 *
 * @security
 * - Requires: System service or WARRANTY_MANAGER
 * - Audit: Logs all notifications sent
 *
 * @example
 * ```typescript
 * const notification = await sendExpirationNotification(
 *   1,
 *   ['project.manager@company.com', 'warranty.manager@company.com'],
 *   NotificationFrequency.WEEKLY
 * );
 * ```
 */
export declare const sendExpirationNotification: (warrantyId: number, recipients: string[], frequency: NotificationFrequency) => Promise<any>;
/**
 * Initiates warranty renewal process.
 * Creates renewal workflow and notification sequence.
 *
 * @param {number} warrantyId - Warranty to renew
 * @param {object} renewalOptions - Renewal configuration
 * @param {string} initiatedBy - User initiating renewal
 * @returns {Promise<object>} Renewal workflow
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN
 * - Permissions: UPDATE_WARRANTY
 * - Audit: Logs renewal initiation
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const renewal = await initiateWarrantyRenewal(1, {
 *   extensionMonths: 12,
 *   newTerms: 'Updated warranty terms',
 *   autoRenew: false
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const initiateWarrantyRenewal: (warrantyId: number, renewalOptions: {
    extensionMonths: number;
    newTerms?: string;
    autoRenew?: boolean;
    contactContractor?: boolean;
}, initiatedBy: string) => Promise<any>;
/**
 * Processes automatic warranty renewal based on configuration.
 * Triggered by scheduled job for auto-renewal enabled warranties.
 *
 * @param {number} warrantyId - Warranty to auto-renew
 * @returns {Promise<object>} Renewal result
 *
 * @security
 * - Requires: System service account
 * - Audit: Logs automatic renewal
 *
 * @example
 * ```typescript
 * @Cron('0 2 * * *') // Daily at 2 AM
 * async processAutoRenewals() {
 *   const eligible = await findAutoRenewalEligible();
 *   for (const warranty of eligible) {
 *     await processWarrantyAutoRenewal(warranty.id);
 *   }
 * }
 * ```
 */
export declare const processWarrantyAutoRenewal: (warrantyId: number) => Promise<any>;
/**
 * Retrieves complete warranty renewal history.
 * Shows all renewal attempts, approvals, and extensions.
 *
 * @param {number} warrantyId - Warranty ID
 * @returns {Promise<object[]>} Renewal history
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const history = await getWarrantyRenewalHistory(1);
 * ```
 */
export declare const getWarrantyRenewalHistory: (warrantyId: number) => Promise<any[]>;
/**
 * Schedules contractor callback for warranty work.
 * Creates callback appointment and sends notifications.
 *
 * @param {Partial<CallbackSchedule>} scheduleData - Callback details
 * @param {string} scheduledBy - User scheduling callback
 * @returns {Promise<object>} Created callback schedule
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: Assigned claim user or manager
 * - Audit: Logs callback scheduling
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const callback = await scheduleContractorCallback({
 *   claimId: 1,
 *   contractorId: 15,
 *   scheduledDate: new Date('2025-02-01'),
 *   scheduledTime: '09:00',
 *   estimatedDuration: 120,
 *   location: 'Building A, Room 205'
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const scheduleContractorCallback: (scheduleData: Partial<CallbackSchedule>, scheduledBy: string) => Promise<any>;
/**
 * Updates callback status and tracks completion.
 * Handles status changes, rescheduling, and completion.
 *
 * @param {number} callbackId - Callback ID
 * @param {object} statusUpdate - Status update data
 * @param {string} updatedBy - User updating status
 * @returns {Promise<object>} Updated callback
 *
 * @security
 * - Requires: Valid JWT token
 * - Authorization: Contractor or manager only
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const updated = await updateCallbackStatus(1, {
 *   status: CallbackStatus.COMPLETED,
 *   completionNotes: 'Issue resolved successfully',
 *   actualDuration: 90
 * }, 'contractor.smith@company.com');
 * ```
 */
export declare const updateCallbackStatus: (callbackId: number, statusUpdate: {
    status: CallbackStatus;
    completionNotes?: string;
    actualDuration?: number;
    rescheduledDate?: Date;
    rescheduledTime?: string;
}, updatedBy: string) => Promise<any>;
/**
 * Retrieves contractor callback schedule with filtering.
 * Supports filtering by date range, contractor, status.
 *
 * @param {object} filters - Filter criteria
 * @param {object} pagination - Pagination options
 * @returns {Promise<object>} Paginated callback list
 *
 * @security
 * - Requires: Valid JWT token
 * - Filters: Role-based visibility
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const callbacks = await getContractorCallbackSchedule({
 *   contractorId: 15,
 *   status: [CallbackStatus.SCHEDULED, CallbackStatus.CONFIRMED],
 *   dateFrom: new Date('2025-02-01'),
 *   dateTo: new Date('2025-02-28')
 * }, { page: 1, limit: 20 });
 * ```
 */
export declare const getContractorCallbackSchedule: (filters: {
    contractorId?: number;
    claimId?: number;
    status?: CallbackStatus[];
    dateFrom?: Date;
    dateTo?: Date;
}, pagination: {
    page: number;
    limit: number;
}) => Promise<any>;
/**
 * Confirms contractor callback appointment.
 * Contractor confirms availability for scheduled callback.
 *
 * @param {number} callbackId - Callback ID
 * @param {string} confirmedBy - Contractor confirming
 * @param {string} [notes] - Confirmation notes
 * @returns {Promise<object>} Confirmed callback
 *
 * @security
 * - Requires: CONTRACTOR role or manager
 * - Audit: Logs confirmation
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.CONTRACTOR, WarrantyRole.WARRANTY_MANAGER)
 * const confirmed = await confirmContractorCallback(
 *   1,
 *   'contractor.smith@company.com',
 *   'Confirmed - will arrive 15 minutes early'
 * );
 * ```
 */
export declare const confirmContractorCallback: (callbackId: number, confirmedBy: string, notes?: string) => Promise<any>;
/**
 * Completes callback and collects satisfaction feedback.
 * Final step in callback workflow with quality rating.
 *
 * @param {number} callbackId - Callback ID
 * @param {object} completionData - Completion details
 * @param {string} completedBy - User marking complete
 * @returns {Promise<object>} Completed callback
 *
 * @security
 * - Requires: Valid JWT token
 * - Authorization: Contractor or manager
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const completed = await completeContractorCallback(1, {
 *   workPerformed: 'Replaced faulty component',
 *   satisfactionRating: 5,
 *   feedback: 'Excellent service',
 *   followUpRequired: false
 * }, 'facility.manager@company.com');
 * ```
 */
export declare const completeContractorCallback: (callbackId: number, completionData: {
    workPerformed: string;
    satisfactionRating: number;
    feedback?: string;
    followUpRequired: boolean;
}, completedBy: string) => Promise<any>;
/**
 * Records warranty-related costs with encryption.
 * Tracks all costs including claims, repairs, administration.
 *
 * @param {Partial<WarrantyCost>} costData - Cost information
 * @param {string} recordedBy - User recording cost
 * @returns {Promise<object>} Created cost record
 *
 * @security
 * - Requires: FINANCE or WARRANTY_MANAGER role
 * - Permissions: VIEW_COSTS
 * - Encryption: Cost amounts encrypted at rest
 * - Audit: Logs all cost entries
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.FINANCE, WarrantyRole.WARRANTY_MANAGER)
 * const cost = await recordWarrantyCost({
 *   claimId: 1,
 *   costType: 'REPAIR',
 *   description: 'HVAC component replacement',
 *   amount: 2500.00,
 *   currency: 'USD',
 *   incurredDate: new Date()
 * }, 'finance.manager@company.com');
 * ```
 */
export declare const recordWarrantyCost: (costData: Partial<WarrantyCost>, recordedBy: string) => Promise<any>;
/**
 * Calculates total warranty costs by project or warranty.
 * Aggregates all cost types with breakdown.
 *
 * @param {object} filters - Cost filter criteria
 * @param {string} requestedBy - User requesting calculation
 * @returns {Promise<object>} Cost summary
 *
 * @security
 * - Requires: FINANCE, WARRANTY_MANAGER, or ADMIN
 * - Permissions: VIEW_COSTS
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.FINANCE, WarrantyRole.ADMIN)
 * const costs = await calculateWarrantyCosts({
 *   projectId: 1,
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31'),
 *   includeReimbursed: true
 * }, 'finance.manager@company.com');
 * ```
 */
export declare const calculateWarrantyCosts: (filters: {
    projectId?: number;
    warrantyId?: number;
    costType?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    includeReimbursed?: boolean;
}, requestedBy: string) => Promise<any>;
/**
 * Tracks warranty claim reimbursements.
 * Records when costs are reimbursed by contractor or insurance.
 *
 * @param {number} costId - Cost record ID
 * @param {object} reimbursementData - Reimbursement details
 * @param {string} processedBy - User processing reimbursement
 * @returns {Promise<object>} Updated cost record
 *
 * @security
 * - Requires: FINANCE or ADMIN role
 * - Permissions: VIEW_COSTS
 * - Audit: Logs reimbursement processing
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.FINANCE, WarrantyRole.ADMIN)
 * const reimbursed = await trackCostReimbursement(1, {
 *   reimbursementAmount: 2500.00,
 *   reimbursedBy: 'HVAC Solutions Inc.',
 *   reimbursementDate: new Date(),
 *   paymentMethod: 'Check',
 *   referenceNumber: 'CHK-2025-001'
 * }, 'finance.manager@company.com');
 * ```
 */
export declare const trackCostReimbursement: (costId: number, reimbursementData: {
    reimbursementAmount: number;
    reimbursedBy: string;
    reimbursementDate: Date;
    paymentMethod: string;
    referenceNumber: string;
}, processedBy: string) => Promise<any>;
/**
 * Generates warranty cost analytics and trends.
 * Provides insights into cost patterns and projections.
 *
 * @param {object} parameters - Analysis parameters
 * @returns {Promise<object>} Cost analytics
 *
 * @security
 * - Requires: FINANCE or ADMIN role
 * - Permissions: VIEW_COSTS, EXPORT_DATA
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.FINANCE, WarrantyRole.ADMIN)
 * const analytics = await generateWarrantyCostAnalytics({
 *   projectId: 1,
 *   period: 'yearly',
 *   includeProjections: true
 * });
 * ```
 */
export declare const generateWarrantyCostAnalytics: (parameters: {
    projectId?: number;
    period: "monthly" | "quarterly" | "yearly";
    includeProjections?: boolean;
}) => Promise<any>;
/**
 * Exports warranty cost data for financial reporting.
 * Generates detailed cost reports in multiple formats.
 *
 * @param {object} exportCriteria - Export configuration
 * @param {string} exportedBy - User requesting export
 * @returns {Promise<object>} Export result
 *
 * @security
 * - Requires: FINANCE or ADMIN role
 * - Permissions: EXPORT_DATA
 * - Audit: Logs all data exports
 * - Rate Limit: 10 exports per hour
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard, ThrottlerGuard)
 * @RequireWarrantyRoles(WarrantyRole.FINANCE, WarrantyRole.ADMIN)
 * @RequireWarrantyPermissions(WarrantyPermission.EXPORT_DATA)
 * @Throttle(10, 3600)
 * const export = await exportWarrantyCostData({
 *   projectId: 1,
 *   format: 'xlsx',
 *   dateRange: { from: '2024-01-01', to: '2024-12-31' },
 *   includeDetails: true
 * }, 'finance.manager@company.com');
 * ```
 */
export declare const exportWarrantyCostData: (exportCriteria: {
    projectId?: number;
    format: "csv" | "xlsx" | "pdf";
    dateRange: {
        from: string;
        to: string;
    };
    includeDetails: boolean;
}, exportedBy: string) => Promise<any>;
/**
 * Creates extended warranty offer for existing warranty.
 * Generates pricing and terms for warranty extension.
 *
 * @param {Partial<ExtendedWarrantyOption>} optionData - Extension details
 * @param {string} createdBy - User creating offer
 * @returns {Promise<object>} Extended warranty offer
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN
 * - Permissions: CREATE_WARRANTY
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const offer = await createExtendedWarrantyOffer({
 *   warrantyId: 1,
 *   extensionMonths: 24,
 *   additionalCost: 8000.00,
 *   terms: 'Same coverage with extended duration',
 *   validUntil: new Date('2025-03-31')
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const createExtendedWarrantyOffer: (optionData: Partial<ExtendedWarrantyOption>, createdBy: string) => Promise<any>;
/**
 * Approves and activates extended warranty purchase.
 * Processes payment and extends warranty coverage.
 *
 * @param {number} offerId - Extended warranty offer ID
 * @param {string} approvedBy - User approving purchase
 * @param {object} paymentInfo - Payment details
 * @returns {Promise<object>} Activated extended warranty
 *
 * @security
 * - Requires: ADMIN or PROJECT_MANAGER with approval authority
 * - Permissions: UPDATE_WARRANTY
 * - Audit: Logs approval and payment
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.ADMIN, WarrantyRole.PROJECT_MANAGER)
 * const activated = await approveExtendedWarranty(1, 'admin@company.com', {
 *   paymentMethod: 'Purchase Order',
 *   poNumber: 'PO-2025-001',
 *   amount: 8000.00
 * });
 * ```
 */
export declare const approveExtendedWarranty: (offerId: number, approvedBy: string, paymentInfo: {
    paymentMethod: string;
    poNumber?: string;
    amount: number;
}) => Promise<any>;
/**
 * Retrieves available extended warranty options.
 * Lists extension offers for specific warranty.
 *
 * @param {number} warrantyId - Warranty ID
 * @returns {Promise<object[]>} Available options
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const options = await getExtendedWarrantyOptions(1);
 * ```
 */
export declare const getExtendedWarrantyOptions: (warrantyId: number) => Promise<any[]>;
/**
 * Calculates extended warranty pricing based on factors.
 * Uses component age, claim history, and coverage for pricing.
 *
 * @param {object} pricingFactors - Factors for pricing
 * @returns {Promise<object>} Pricing calculation
 *
 * @security
 * - Requires: WARRANTY_MANAGER or FINANCE role
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.FINANCE)
 * const pricing = await calculateExtendedWarrantyPricing({
 *   warrantyId: 1,
 *   extensionMonths: 24,
 *   componentAge: 36,
 *   claimHistory: 2,
 *   coverageAmount: 50000
 * });
 * ```
 */
export declare const calculateExtendedWarrantyPricing: (pricingFactors: {
    warrantyId: number;
    extensionMonths: number;
    componentAge: number;
    claimHistory: number;
    coverageAmount: number;
}) => Promise<any>;
/**
 * Compares extended warranty vs replacement costs.
 * Provides cost-benefit analysis for decision making.
 *
 * @param {number} warrantyId - Warranty to analyze
 * @param {number} replacementCost - Estimated replacement cost
 * @returns {Promise<object>} Comparison analysis
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const comparison = await compareExtendedWarrantyVsReplacement(1, 45000);
 * ```
 */
export declare const compareExtendedWarrantyVsReplacement: (warrantyId: number, replacementCost: number) => Promise<any>;
/**
 * Uploads warranty document with metadata.
 * Stores warranty certificates, terms, and related docs.
 *
 * @param {Partial<WarrantyDocument>} documentData - Document information
 * @param {Buffer} fileBuffer - File content
 * @param {string} uploadedBy - User uploading document
 * @returns {Promise<object>} Uploaded document record
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: UPDATE_WARRANTY
 * - Validation: File type, size limits
 * - Virus scan: Required before storage
 * - Audit: Logs document uploads
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadDocument(@UploadedFile() file: Express.Multer.File) {
 *   const doc = await uploadWarrantyDocument({
 *     warrantyId: 1,
 *     documentType: 'certificate',
 *     title: 'Original Warranty Certificate'
 *   }, file.buffer, 'user@company.com');
 * }
 * ```
 */
export declare const uploadWarrantyDocument: (documentData: Partial<WarrantyDocument>, fileBuffer: Buffer, uploadedBy: string) => Promise<any>;
/**
 * Retrieves warranty documents with access control.
 * Returns documents based on user permissions.
 *
 * @param {number} warrantyId - Warranty ID
 * @param {string} [documentType] - Optional document type filter
 * @returns {Promise<object[]>} List of documents
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 * - Filters: Role-based document visibility
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const documents = await getWarrantyDocuments(1, 'certificate');
 * ```
 */
export declare const getWarrantyDocuments: (warrantyId: number, documentType?: string) => Promise<any[]>;
/**
 * Updates warranty document metadata or replaces file.
 * Handles document versioning and activation.
 *
 * @param {number} documentId - Document ID
 * @param {object} updates - Document updates
 * @param {string} updatedBy - User updating document
 * @returns {Promise<object>} Updated document
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN
 * - Permissions: UPDATE_WARRANTY
 * - Audit: Logs document changes
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const updated = await updateWarrantyDocument(1, {
 *   title: 'Updated Warranty Certificate',
 *   version: 2,
 *   expirationDate: new Date('2025-12-31')
 * }, 'warranty.manager@company.com');
 * ```
 */
export declare const updateWarrantyDocument: (documentId: number, updates: Partial<WarrantyDocument>, updatedBy: string) => Promise<any>;
/**
 * Archives or deletes warranty document.
 * Soft delete with audit trail preservation.
 *
 * @param {number} documentId - Document ID to archive
 * @param {string} archivedBy - User archiving document
 * @param {boolean} permanentDelete - Whether to permanently delete
 * @returns {Promise<object>} Archive result
 *
 * @security
 * - Requires: ADMIN role for permanent delete
 * - Permissions: DELETE_WARRANTY
 * - Audit: Logs deletion with reason
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.ADMIN)
 * const archived = await archiveWarrantyDocument(
 *   1,
 *   'admin@company.com',
 *   false // soft delete
 * );
 * ```
 */
export declare const archiveWarrantyDocument: (documentId: number, archivedBy: string, permanentDelete?: boolean) => Promise<any>;
/**
 * Generates signed URL for secure document access.
 * Provides time-limited access to warranty documents.
 *
 * @param {number} documentId - Document ID
 * @param {string} requestedBy - User requesting access
 * @param {number} expirationMinutes - URL expiration in minutes
 * @returns {Promise<object>} Signed URL
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: READ_WARRANTY
 * - URL expires after specified time
 * - Single-use optional
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const signedUrl = await generateDocumentAccessUrl(
 *   1,
 *   'user@company.com',
 *   60 // 1 hour expiration
 * );
 * ```
 */
export declare const generateDocumentAccessUrl: (documentId: number, requestedBy: string, expirationMinutes?: number) => Promise<any>;
/**
 * Generates comprehensive warranty metrics dashboard.
 * Provides KPIs and performance indicators.
 *
 * @param {object} parameters - Dashboard parameters
 * @returns {Promise<WarrantyMetrics>} Warranty metrics
 *
 * @security
 * - Requires: Valid JWT token
 * - Role-based data aggregation
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const metrics = await generateWarrantyMetrics({
 *   projectId: 1,
 *   period: '2024-Q4'
 * });
 * ```
 */
export declare const generateWarrantyMetrics: (parameters: {
    projectId?: number;
    period: string;
    includeProjections?: boolean;
}) => Promise<WarrantyMetrics>;
/**
 * Analyzes contractor performance based on warranty data.
 * Evaluates callback completion, claim resolution, satisfaction.
 *
 * @param {number} contractorId - Contractor to analyze
 * @param {object} timeframe - Analysis timeframe
 * @returns {Promise<object>} Performance analysis
 *
 * @security
 * - Requires: WARRANTY_MANAGER or ADMIN
 * - Permissions: MANAGE_CONTRACTORS
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.WARRANTY_MANAGER, WarrantyRole.ADMIN)
 * const performance = await analyzeContractorPerformance(15, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const analyzeContractorPerformance: (contractorId: number, timeframe: {
    startDate: Date;
    endDate: Date;
}) => Promise<any>;
/**
 * Identifies warranty trends and patterns.
 * Analyzes claim patterns, failure modes, cost trends.
 *
 * @param {object} analysisParams - Analysis parameters
 * @returns {Promise<object>} Trend analysis
 *
 * @security
 * - Requires: Valid JWT token
 * - Aggregated data only
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * const trends = await identifyWarrantyTrends({
 *   projectId: 1,
 *   timeframe: 'yearly',
 *   includeProjections: true
 * });
 * ```
 */
export declare const identifyWarrantyTrends: (analysisParams: {
    projectId?: number;
    timeframe: "monthly" | "quarterly" | "yearly";
    includeProjections?: boolean;
}) => Promise<any>;
/**
 * Generates warranty compliance report.
 * Ensures warranty management meets regulatory requirements.
 *
 * @param {object} reportParams - Report parameters
 * @returns {Promise<object>} Compliance report
 *
 * @security
 * - Requires: ADMIN or WARRANTY_MANAGER
 * - Audit: Logs report generation
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyRolesGuard)
 * @RequireWarrantyRoles(WarrantyRole.ADMIN, WarrantyRole.WARRANTY_MANAGER)
 * const report = await generateWarrantyComplianceReport({
 *   projectId: 1,
 *   reportType: 'annual',
 *   includeAuditTrail: true
 * });
 * ```
 */
export declare const generateWarrantyComplianceReport: (reportParams: {
    projectId?: number;
    reportType: "monthly" | "quarterly" | "annual";
    includeAuditTrail?: boolean;
}) => Promise<any>;
/**
 * Exports comprehensive warranty report.
 * Generates detailed warranty and claim reports for stakeholders.
 *
 * @param {object} exportConfig - Export configuration
 * @param {string} exportedBy - User requesting export
 * @returns {Promise<object>} Export result
 *
 * @security
 * - Requires: Valid JWT token
 * - Permissions: EXPORT_DATA
 * - Rate Limit: 5 exports per hour
 * - Audit: Logs exports
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, WarrantyPermissionsGuard, ThrottlerGuard)
 * @RequireWarrantyPermissions(WarrantyPermission.EXPORT_DATA)
 * @Throttle(5, 3600)
 * const report = await exportWarrantyReport({
 *   projectId: 1,
 *   format: 'pdf',
 *   includeCharts: true,
 *   includeCostBreakdown: true,
 *   dateRange: { from: '2024-01-01', to: '2024-12-31' }
 * }, 'manager@company.com');
 * ```
 */
export declare const exportWarrantyReport: (exportConfig: {
    projectId?: number;
    format: "pdf" | "xlsx" | "csv";
    includeCharts?: boolean;
    includeCostBreakdown?: boolean;
    dateRange: {
        from: string;
        to: string;
    };
}, exportedBy: string) => Promise<any>;
export {};
//# sourceMappingURL=construction-warranty-management-kit.d.ts.map