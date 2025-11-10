/**
 * ASSET WARRANTY MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset warranty management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive warranty tracking including:
 * - Warranty registration and activation
 * - Warranty claim processing and tracking
 * - Warranty expiration tracking and alerts
 * - Extended warranty management
 * - Warranty cost recovery and reimbursement
 * - Vendor warranty coordination
 * - Warranty analytics and reporting
 * - Warranty renewal management
 * - Service level agreement (SLA) tracking
 * - Warranty compliance verification
 * - Multi-tier warranty support
 * - Proactive maintenance under warranty
 *
 * @module AssetWarrantyCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   registerAssetWarranty,
 *   createWarrantyClaim,
 *   processWarrantyClaim,
 *   trackWarrantyExpiration,
 *   WarrantyType,
 *   WarrantyStatus
 * } from './asset-warranty-commands';
 *
 * // Register warranty
 * const warranty = await registerAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001',
 *   startDate: new Date(),
 *   durationMonths: 36,
 *   coverageDetails: 'Full parts and labor'
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Warranty types
 */
export declare enum WarrantyType {
    MANUFACTURER = "manufacturer",
    EXTENDED = "extended",
    SERVICE_CONTRACT = "service_contract",
    THIRD_PARTY = "third_party",
    MAINTENANCE_AGREEMENT = "maintenance_agreement",
    LABOR_ONLY = "labor_only",
    PARTS_ONLY = "parts_only",
    COMPREHENSIVE = "comprehensive"
}
/**
 * Warranty status
 */
export declare enum WarrantyStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    EXPIRING_SOON = "expiring_soon",
    SUSPENDED = "suspended",
    CANCELLED = "cancelled",
    TRANSFERRED = "transferred"
}
/**
 * Warranty claim status
 */
export declare enum WarrantyClaimStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PARTIALLY_APPROVED = "partially_approved",
    CANCELLED = "cancelled"
}
/**
 * Coverage type
 */
export declare enum CoverageType {
    PARTS = "parts",
    LABOR = "labor",
    PARTS_AND_LABOR = "parts_and_labor",
    PREVENTIVE_MAINTENANCE = "preventive_maintenance",
    ON_SITE_SERVICE = "on_site_service",
    NEXT_DAY_SERVICE = "next_day_service",
    REPLACEMENT = "replacement",
    LOANER_EQUIPMENT = "loaner_equipment"
}
/**
 * Claim priority
 */
export declare enum ClaimPriority {
    CRITICAL = "critical",
    HIGH = "high",
    NORMAL = "normal",
    LOW = "low"
}
/**
 * Warranty registration data
 */
export interface WarrantyRegistrationData {
    assetId: string;
    warrantyType: WarrantyType;
    vendorId: string;
    warrantyNumber?: string;
    startDate: Date;
    durationMonths: number;
    coverageDetails: string;
    coverageTypes?: CoverageType[];
    terms?: string;
    exclusions?: string[];
    cost?: number;
    registeredBy: string;
    proofOfPurchase?: string[];
}
/**
 * Warranty claim data
 */
export interface WarrantyClaimData {
    warrantyId: string;
    assetId: string;
    claimType: string;
    issueDescription: string;
    failureDate: Date;
    reportedBy: string;
    priority?: ClaimPriority;
    estimatedCost?: number;
    diagnosticInfo?: string;
    photos?: string[];
    attachments?: string[];
}
/**
 * Claim approval data
 */
export interface ClaimApprovalData {
    claimId: string;
    approvedBy: string;
    approved: boolean;
    approvedAmount?: number;
    decisionNotes: string;
    conditions?: string[];
    approvalDate: Date;
}
/**
 * Warranty cost recovery
 */
export interface WarrantyCostRecovery {
    claimId: string;
    totalClaimAmount: number;
    approvedAmount: number;
    recoveredAmount: number;
    outOfPocketExpense: number;
    recoveryPercentage: number;
    reimbursementDate?: Date;
}
/**
 * Warranty analytics
 */
export interface WarrantyAnalytics {
    totalWarranties: number;
    activeWarranties: number;
    expiringSoon: number;
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    totalClaimValue: number;
    totalRecoveredValue: number;
    averageClaimAmount: number;
    claimApprovalRate: number;
}
/**
 * Asset Warranty Model
 */
export declare class AssetWarranty extends Model {
    id: string;
    assetId: string;
    warrantyNumber?: string;
    warrantyType: WarrantyType;
    status: WarrantyStatus;
    vendorId: string;
    startDate: Date;
    endDate: Date;
    durationMonths: number;
    coverageDetails: string;
    coverageTypes?: string[];
    terms?: string;
    exclusions?: string[];
    cost?: number;
    proofOfPurchase?: string[];
    registeredBy: string;
    registrationDate: Date;
    autoRenew: boolean;
    renewalDate?: Date;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    serviceLevelAgreement?: Record<string, any>;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    claims?: WarrantyClaim[];
}
/**
 * Warranty Claim Model
 */
export declare class WarrantyClaim extends Model {
    id: string;
    claimNumber: string;
    warrantyId: string;
    assetId: string;
    claimType: string;
    issueDescription: string;
    failureDate: Date;
    reportedBy: string;
    reportDate: Date;
    status: WarrantyClaimStatus;
    priority: ClaimPriority;
    estimatedCost?: number;
    actualCost?: number;
    claimedAmount?: number;
    approvedAmount?: number;
    reimbursedAmount?: number;
    diagnosticInfo?: string;
    photos?: string[];
    attachments?: string[];
    submittedDate?: Date;
    reviewedBy?: string;
    reviewDate?: Date;
    approvedBy?: string;
    approvalDate?: Date;
    vendorResponse?: string;
    vendorReferenceNumber?: string;
    serviceTechnician?: string;
    serviceStartDate?: Date;
    serviceCompletionDate?: Date;
    resolutionDescription?: string;
    partsReplaced?: string[];
    laborHours?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    warranty?: AssetWarranty;
    statusHistory?: ClaimStatusHistory[];
}
/**
 * Claim Status History Model
 */
export declare class ClaimStatusHistory extends Model {
    id: string;
    claimId: string;
    previousStatus?: WarrantyClaimStatus;
    status: WarrantyClaimStatus;
    changedBy: string;
    changedAt: Date;
    notes?: string;
    createdAt: Date;
    claim?: WarrantyClaim;
}
/**
 * Warranty Expiration Alert Model
 */
export declare class WarrantyExpirationAlert extends Model {
    id: string;
    warrantyId: string;
    alertDate: Date;
    daysUntilExpiration: number;
    alertMessage: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedDate?: Date;
    actionTaken?: string;
    createdAt: Date;
    updatedAt: Date;
    warranty?: AssetWarranty;
}
/**
 * Registers asset warranty
 *
 * @param data - Warranty registration data
 * @param transaction - Optional database transaction
 * @returns Created warranty
 *
 * @example
 * ```typescript
 * const warranty = await registerAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001',
 *   startDate: new Date('2024-01-01'),
 *   durationMonths: 36,
 *   coverageDetails: 'Comprehensive parts and labor coverage',
 *   coverageTypes: [CoverageType.PARTS_AND_LABOR, CoverageType.ON_SITE_SERVICE],
 *   registeredBy: 'user-001'
 * });
 * ```
 */
export declare function registerAssetWarranty(data: WarrantyRegistrationData, transaction?: Transaction): Promise<AssetWarranty>;
/**
 * Updates warranty details
 *
 * @param warrantyId - Warranty ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated warranty
 *
 * @example
 * ```typescript
 * await updateWarranty('warranty-123', {
 *   contactPerson: 'John Doe',
 *   contactPhone: '555-0123',
 *   autoRenew: true
 * });
 * ```
 */
export declare function updateWarranty(warrantyId: string, updates: Partial<AssetWarranty>, transaction?: Transaction): Promise<AssetWarranty>;
/**
 * Gets warranty by ID
 *
 * @param warrantyId - Warranty ID
 * @param includeClaims - Whether to include claims
 * @returns Warranty details
 *
 * @example
 * ```typescript
 * const warranty = await getWarrantyById('warranty-123', true);
 * ```
 */
export declare function getWarrantyById(warrantyId: string, includeClaims?: boolean): Promise<AssetWarranty>;
/**
 * Gets all warranties for asset
 *
 * @param assetId - Asset ID
 * @returns Asset warranties
 *
 * @example
 * ```typescript
 * const warranties = await getAssetWarranties('asset-123');
 * ```
 */
export declare function getAssetWarranties(assetId: string): Promise<AssetWarranty[]>;
/**
 * Gets active warranty for asset
 *
 * @param assetId - Asset ID
 * @returns Active warranty or null
 *
 * @example
 * ```typescript
 * const warranty = await getActiveWarranty('asset-123');
 * ```
 */
export declare function getActiveWarranty(assetId: string): Promise<AssetWarranty | null>;
/**
 * Creates warranty claim
 *
 * @param data - Warranty claim data
 * @param transaction - Optional database transaction
 * @returns Created claim
 *
 * @example
 * ```typescript
 * const claim = await createWarrantyClaim({
 *   warrantyId: 'warranty-123',
 *   assetId: 'asset-456',
 *   claimType: 'Equipment Malfunction',
 *   issueDescription: 'Device stops working after 30 minutes of operation',
 *   failureDate: new Date(),
 *   reportedBy: 'user-001',
 *   priority: ClaimPriority.HIGH,
 *   estimatedCost: 2500
 * });
 * ```
 */
export declare function createWarrantyClaim(data: WarrantyClaimData, transaction?: Transaction): Promise<WarrantyClaim>;
/**
 * Submits warranty claim
 *
 * @param claimId - Claim ID
 * @param submittedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await submitWarrantyClaim('claim-123', 'user-001');
 * ```
 */
export declare function submitWarrantyClaim(claimId: string, submittedBy: string, transaction?: Transaction): Promise<WarrantyClaim>;
/**
 * Processes warranty claim approval
 *
 * @param data - Claim approval data
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await processWarrantyClaim({
 *   claimId: 'claim-123',
 *   approvedBy: 'vendor-mgr-001',
 *   approved: true,
 *   approvedAmount: 2500,
 *   decisionNotes: 'Approved - covered under warranty terms',
 *   approvalDate: new Date()
 * });
 * ```
 */
export declare function processWarrantyClaim(data: ClaimApprovalData, transaction?: Transaction): Promise<WarrantyClaim>;
/**
 * Updates claim with service details
 *
 * @param claimId - Claim ID
 * @param serviceData - Service information
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await updateClaimServiceDetails('claim-123', {
 *   vendorReferenceNumber: 'VND-REF-456',
 *   serviceTechnician: 'Tech Mike Johnson',
 *   serviceStartDate: new Date(),
 *   partsReplaced: ['Main Circuit Board', 'Power Supply Unit'],
 *   laborHours: 4.5
 * });
 * ```
 */
export declare function updateClaimServiceDetails(claimId: string, serviceData: {
    vendorReferenceNumber?: string;
    serviceTechnician?: string;
    serviceStartDate?: Date;
    serviceCompletionDate?: Date;
    partsReplaced?: string[];
    laborHours?: number;
    actualCost?: number;
    resolutionDescription?: string;
}, transaction?: Transaction): Promise<WarrantyClaim>;
/**
 * Completes warranty claim
 *
 * @param claimId - Claim ID
 * @param completedBy - User ID
 * @param finalCost - Final repair cost
 * @param resolution - Resolution description
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await completeWarrantyClaim(
 *   'claim-123',
 *   'user-001',
 *   2450,
 *   'Equipment repaired and tested, fully functional'
 * );
 * ```
 */
export declare function completeWarrantyClaim(claimId: string, completedBy: string, finalCost: number, resolution: string, transaction?: Transaction): Promise<WarrantyClaim>;
/**
 * Records warranty cost recovery
 *
 * @param claimId - Claim ID
 * @param reimbursedAmount - Amount reimbursed by vendor
 * @param reimbursementDate - Date of reimbursement
 * @param transaction - Optional database transaction
 * @returns Cost recovery summary
 *
 * @example
 * ```typescript
 * const recovery = await recordWarrantyCostRecovery(
 *   'claim-123',
 *   2200,
 *   new Date()
 * );
 * ```
 */
export declare function recordWarrantyCostRecovery(claimId: string, reimbursedAmount: number, reimbursementDate: Date, transaction?: Transaction): Promise<WarrantyCostRecovery>;
/**
 * Calculates total cost recovery for warranty
 *
 * @param warrantyId - Warranty ID
 * @returns Cost recovery summary
 *
 * @example
 * ```typescript
 * const summary = await calculateWarrantyCostRecovery('warranty-123');
 * ```
 */
export declare function calculateWarrantyCostRecovery(warrantyId: string): Promise<{
    totalClaims: number;
    totalClaimValue: number;
    totalApprovedValue: number;
    totalRecoveredValue: number;
    totalOutOfPocket: number;
    averageRecoveryRate: number;
}>;
/**
 * Tracks warranty expirations and creates alerts
 *
 * @param daysAhead - Days to look ahead for expirations
 * @returns Expiring warranties
 *
 * @example
 * ```typescript
 * const expiring = await trackWarrantyExpiration(90);
 * ```
 */
export declare function trackWarrantyExpiration(daysAhead?: number): Promise<AssetWarranty[]>;
/**
 * Gets expiration alerts
 *
 * @param acknowledgedOnly - Filter by acknowledged status
 * @returns Expiration alerts
 *
 * @example
 * ```typescript
 * const alerts = await getExpirationAlerts(false);
 * ```
 */
export declare function getExpirationAlerts(acknowledgedOnly?: boolean): Promise<WarrantyExpirationAlert[]>;
/**
 * Acknowledges expiration alert
 *
 * @param alertId - Alert ID
 * @param acknowledgedBy - User ID
 * @param actionTaken - Action description
 * @param transaction - Optional database transaction
 * @returns Updated alert
 *
 * @example
 * ```typescript
 * await acknowledgeExpirationAlert(
 *   'alert-123',
 *   'user-001',
 *   'Extended warranty purchased for additional 12 months'
 * );
 * ```
 */
export declare function acknowledgeExpirationAlert(alertId: string, acknowledgedBy: string, actionTaken?: string, transaction?: Transaction): Promise<WarrantyExpirationAlert>;
/**
 * Renews warranty
 *
 * @param warrantyId - Warranty ID
 * @param renewalData - Renewal details
 * @param transaction - Optional database transaction
 * @returns New warranty
 *
 * @example
 * ```typescript
 * const renewed = await renewWarranty('warranty-123', {
 *   durationMonths: 12,
 *   cost: 500,
 *   renewedBy: 'user-001'
 * });
 * ```
 */
export declare function renewWarranty(warrantyId: string, renewalData: {
    durationMonths: number;
    cost?: number;
    renewedBy: string;
    notes?: string;
}, transaction?: Transaction): Promise<AssetWarranty>;
/**
 * Generates warranty analytics
 *
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Warranty analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateWarrantyAnalytics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateWarrantyAnalytics(startDate: Date, endDate: Date): Promise<WarrantyAnalytics>;
/**
 * Searches warranties with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered warranties
 *
 * @example
 * ```typescript
 * const warranties = await searchWarranties({
 *   status: WarrantyStatus.ACTIVE,
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001'
 * });
 * ```
 */
export declare function searchWarranties(filters: {
    status?: WarrantyStatus | WarrantyStatus[];
    warrantyType?: WarrantyType | WarrantyType[];
    vendorId?: string;
    assetId?: string;
    expiringWithinDays?: number;
}, options?: FindOptions): Promise<{
    warranties: AssetWarranty[];
    total: number;
}>;
declare const _default: {
    AssetWarranty: typeof AssetWarranty;
    WarrantyClaim: typeof WarrantyClaim;
    ClaimStatusHistory: typeof ClaimStatusHistory;
    WarrantyExpirationAlert: typeof WarrantyExpirationAlert;
    registerAssetWarranty: typeof registerAssetWarranty;
    updateWarranty: typeof updateWarranty;
    getWarrantyById: typeof getWarrantyById;
    getAssetWarranties: typeof getAssetWarranties;
    getActiveWarranty: typeof getActiveWarranty;
    createWarrantyClaim: typeof createWarrantyClaim;
    submitWarrantyClaim: typeof submitWarrantyClaim;
    processWarrantyClaim: typeof processWarrantyClaim;
    updateClaimServiceDetails: typeof updateClaimServiceDetails;
    completeWarrantyClaim: typeof completeWarrantyClaim;
    recordWarrantyCostRecovery: typeof recordWarrantyCostRecovery;
    calculateWarrantyCostRecovery: typeof calculateWarrantyCostRecovery;
    trackWarrantyExpiration: typeof trackWarrantyExpiration;
    getExpirationAlerts: typeof getExpirationAlerts;
    acknowledgeExpirationAlert: typeof acknowledgeExpirationAlert;
    renewWarranty: typeof renewWarranty;
    generateWarrantyAnalytics: typeof generateWarrantyAnalytics;
    searchWarranties: typeof searchWarranties;
};
export default _default;
//# sourceMappingURL=asset-warranty-commands.d.ts.map