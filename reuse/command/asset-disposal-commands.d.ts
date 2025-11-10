/**
 * ASSET DISPOSAL MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset disposal management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive disposal workflows including:
 * - Disposal workflows and approval processes
 * - Salvage value calculation and optimization
 * - Multiple disposal methods (sale, donation, scrap, trade-in)
 * - Environmental disposal requirements and compliance
 * - Disposal documentation and audit trails
 * - Asset write-off processing
 * - Disposal approvals and authorization
 * - Disposal vendor management
 * - Revenue recovery tracking
 * - Disposal cost management
 * - Certificate of destruction
 * - Data sanitization requirements
 * - Regulatory compliance (EPA, WEEE, RoHS)
 *
 * @module AssetDisposalCommands
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
 *   initiateAssetDisposal,
 *   calculateSalvageValue,
 *   processDisposalApproval,
 *   generateCertificateOfDestruction,
 *   DisposalRequest,
 *   DisposalMethod
 * } from './asset-disposal-commands';
 *
 * // Initiate disposal request
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'End of useful life',
 *   estimatedValue: 5000,
 *   requestedBy: 'user-001'
 * });
 *
 * // Calculate salvage value
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'fair',
 *   assetCondition: 'good',
 *   demandLevel: 'high'
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Disposal methods
 */
export declare enum DisposalMethod {
    SALE = "sale",
    DONATION = "donation",
    SCRAP = "scrap",
    RECYCLE = "recycle",
    TRADE_IN = "trade_in",
    DESTRUCTION = "destruction",
    RETURN_TO_VENDOR = "return_to_vendor",
    CANNIBALIZE = "cannibalize",
    LANDFILL = "landfill",
    HAZARDOUS_WASTE = "hazardous_waste"
}
/**
 * Disposal request status
 */
export declare enum DisposalStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold"
}
/**
 * Approval status
 */
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ESCALATED = "escalated",
    WITHDRAWN = "withdrawn"
}
/**
 * Environmental classification
 */
export declare enum EnvironmentalClassification {
    NON_HAZARDOUS = "non_hazardous",
    HAZARDOUS = "hazardous",
    ELECTRONIC_WASTE = "electronic_waste",
    CHEMICAL = "chemical",
    BIOLOGICAL = "biological",
    RADIOACTIVE = "radioactive",
    UNIVERSAL_WASTE = "universal_waste"
}
/**
 * Data sanitization level
 */
export declare enum DataSanitizationLevel {
    NONE = "none",
    BASIC_WIPE = "basic_wipe",
    DOD_3_PASS = "dod_3_pass",
    DOD_7_PASS = "dod_7_pass",
    GUTMANN = "gutmann",
    PHYSICAL_DESTRUCTION = "physical_destruction",
    DEGAUSSING = "degaussing"
}
/**
 * Asset disposal request data
 */
export interface DisposalRequestData {
    assetId: string;
    disposalMethod: DisposalMethod;
    reason: string;
    requestedBy: string;
    estimatedValue?: number;
    targetDisposalDate?: Date;
    disposalVendorId?: string;
    requiresDataSanitization?: boolean;
    sanitizationLevel?: DataSanitizationLevel;
    environmentalClassification?: EnvironmentalClassification;
    notes?: string;
    attachments?: string[];
}
/**
 * Salvage value calculation parameters
 */
export interface SalvageValueParams {
    marketConditions?: 'excellent' | 'good' | 'fair' | 'poor';
    assetCondition?: 'excellent' | 'good' | 'fair' | 'poor';
    demandLevel?: 'high' | 'medium' | 'low';
    urgency?: 'immediate' | 'normal' | 'flexible';
    includeShippingCost?: boolean;
    includeRestorationCost?: boolean;
}
/**
 * Salvage value result
 */
export interface SalvageValueResult {
    assetId: string;
    originalCost: number;
    currentBookValue: number;
    estimatedMarketValue: number;
    salvageValue: number;
    restorationCost: number;
    shippingCost: number;
    netSalvageValue: number;
    calculationDate: Date;
    confidenceLevel: number;
    factors: Record<string, any>;
}
/**
 * Disposal approval data
 */
export interface DisposalApprovalData {
    disposalRequestId: string;
    approverId: string;
    decision: ApprovalStatus;
    comments?: string;
    conditions?: string[];
    approvalDate: Date;
}
/**
 * Environmental disposal requirements
 */
export interface EnvironmentalRequirements {
    classification: EnvironmentalClassification;
    requiresPermit: boolean;
    permitNumbers?: string[];
    handlingInstructions: string;
    regulatoryCompliance: string[];
    certifiedVendorRequired: boolean;
    manifestRequired: boolean;
    disposalFacilityType?: string;
    transportationRequirements?: string;
}
/**
 * Certificate of destruction data
 */
export interface CertificateOfDestructionData {
    disposalRequestId: string;
    certificateNumber: string;
    issuedBy: string;
    issuedDate: Date;
    destructionMethod: string;
    destructionDate: Date;
    witnessList?: string[];
    photographicEvidence?: string[];
    videoEvidence?: string[];
    certificationStandard?: string;
}
/**
 * Disposal cost breakdown
 */
export interface DisposalCostBreakdown {
    vendorFees: number;
    transportationCost: number;
    sanitizationCost: number;
    certificationCost: number;
    environmentalFees: number;
    administrativeCost: number;
    totalCost: number;
}
/**
 * Revenue recovery tracking
 */
export interface RevenueRecovery {
    saleAmount?: number;
    tradeInValue?: number;
    salvageValue?: number;
    taxDeduction?: number;
    totalRecovery: number;
    recoveryPercentage: number;
}
/**
 * Disposal Request Model
 */
export declare class DisposalRequest extends Model {
    id: string;
    requestNumber: string;
    assetId: string;
    disposalMethod: DisposalMethod;
    status: DisposalStatus;
    reason: string;
    requestedBy: string;
    requestDate: Date;
    estimatedValue?: number;
    actualValue?: number;
    targetDisposalDate?: Date;
    actualDisposalDate?: Date;
    disposalVendorId?: string;
    requiresDataSanitization: boolean;
    sanitizationLevel?: DataSanitizationLevel;
    sanitizationCompleted: boolean;
    sanitizationDate?: Date;
    sanitizedBy?: string;
    environmentalClassification?: EnvironmentalClassification;
    permitRequired: boolean;
    permitNumbers?: string[];
    approvalRequired: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    disposalCost?: number;
    costBreakdown?: DisposalCostBreakdown;
    revenueRecovery?: RevenueRecovery;
    certificateOfDestructionId?: string;
    notes?: string;
    attachments?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    approvals?: DisposalApproval[];
    auditLogs?: DisposalAuditLog[];
}
/**
 * Disposal Approval Model
 */
export declare class DisposalApproval extends Model {
    id: string;
    disposalRequestId: string;
    approverId: string;
    approvalLevel: number;
    status: ApprovalStatus;
    approvalDate?: Date;
    comments?: string;
    conditions?: string[];
    notified: boolean;
    createdAt: Date;
    updatedAt: Date;
    disposalRequest?: DisposalRequest;
}
/**
 * Disposal Vendor Model
 */
export declare class DisposalVendor extends Model {
    id: string;
    vendorCode: string;
    vendorName: string;
    disposalMethodsOffered: DisposalMethod[];
    certifications?: string[];
    isCertified: boolean;
    environmentalCompliance?: string[];
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: Record<string, any>;
    serviceAreas?: string[];
    pricingStructure?: Record<string, any>;
    performanceRating?: number;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Certificate of Destruction Model
 */
export declare class CertificateOfDestruction extends Model {
    id: string;
    certificateNumber: string;
    disposalRequestId: string;
    issuedBy: string;
    issuedDate: Date;
    destructionMethod: string;
    destructionDate: Date;
    destructionLocation?: string;
    witnessList?: string[];
    photographicEvidence?: string[];
    videoEvidence?: string[];
    certificationStandard?: string;
    complianceVerification?: string[];
    digitalSignature?: string;
    certificateDocumentUrl?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    disposalRequest?: DisposalRequest;
}
/**
 * Disposal Audit Log Model
 */
export declare class DisposalAuditLog extends Model {
    id: string;
    disposalRequestId: string;
    actionType: string;
    actionDescription: string;
    performedBy: string;
    actionTimestamp: Date;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    disposalRequest?: DisposalRequest;
}
/**
 * Initiates a new asset disposal request
 *
 * @param data - Disposal request data
 * @param transaction - Optional database transaction
 * @returns Created disposal request
 *
 * @example
 * ```typescript
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'Equipment upgrade, existing unit fully functional',
 *   requestedBy: 'user-001',
 *   estimatedValue: 15000,
 *   targetDisposalDate: new Date('2024-06-30')
 * });
 * ```
 */
export declare function initiateAssetDisposal(data: DisposalRequestData, transaction?: Transaction): Promise<DisposalRequest>;
/**
 * Generates unique disposal request number
 *
 * @returns Disposal request number
 *
 * @example
 * ```typescript
 * const requestNumber = await generateDisposalRequestNumber();
 * // Returns: "DISP-2024-001234"
 * ```
 */
export declare function generateDisposalRequestNumber(): Promise<string>;
/**
 * Updates disposal request status
 *
 * @param requestId - Disposal request ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await updateDisposalStatus(
 *   'disposal-123',
 *   DisposalStatus.PENDING_APPROVAL,
 *   'user-001',
 *   'Ready for management review'
 * );
 * ```
 */
export declare function updateDisposalStatus(requestId: string, status: DisposalStatus, updatedBy: string, notes?: string, transaction?: Transaction): Promise<DisposalRequest>;
/**
 * Submits disposal request for approval
 *
 * @param requestId - Disposal request ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await submitDisposalForApproval('disposal-123', 'user-001');
 * ```
 */
export declare function submitDisposalForApproval(requestId: string, submittedBy: string, transaction?: Transaction): Promise<DisposalRequest>;
/**
 * Gets required approval levels for disposal request
 *
 * @param disposal - Disposal request
 * @returns Array of approval level requirements
 *
 * @example
 * ```typescript
 * const levels = await getRequiredApprovalLevels(disposalRequest);
 * ```
 */
export declare function getRequiredApprovalLevels(disposal: DisposalRequest): Promise<Array<{
    level: number;
    approverId: string;
    roleName: string;
}>>;
/**
 * Processes disposal approval decision
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await processDisposalApproval({
 *   disposalRequestId: 'disposal-123',
 *   approverId: 'user-mgr-001',
 *   decision: ApprovalStatus.APPROVED,
 *   comments: 'Approved for disposal via certified vendor',
 *   approvalDate: new Date()
 * });
 * ```
 */
export declare function processDisposalApproval(data: DisposalApprovalData, transaction?: Transaction): Promise<DisposalApproval>;
/**
 * Gets disposal request with all approvals
 *
 * @param requestId - Disposal request ID
 * @returns Disposal request with approvals
 *
 * @example
 * ```typescript
 * const disposal = await getDisposalWithApprovals('disposal-123');
 * console.log(disposal.approvals);
 * ```
 */
export declare function getDisposalWithApprovals(requestId: string): Promise<DisposalRequest>;
/**
 * Calculates salvage value for asset
 *
 * @param assetId - Asset ID
 * @param params - Calculation parameters
 * @param transaction - Optional database transaction
 * @returns Salvage value calculation result
 *
 * @example
 * ```typescript
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'good',
 *   assetCondition: 'fair',
 *   demandLevel: 'medium',
 *   urgency: 'normal',
 *   includeShippingCost: true,
 *   includeRestorationCost: true
 * });
 * ```
 */
export declare function calculateSalvageValue(assetId: string, params?: SalvageValueParams, transaction?: Transaction): Promise<SalvageValueResult>;
/**
 * Optimizes salvage value through market analysis
 *
 * @param assetId - Asset ID
 * @param targetRevenue - Target revenue amount
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeSalvageValue('asset-123', 50000);
 * ```
 */
export declare function optimizeSalvageValue(assetId: string, targetRevenue?: number): Promise<{
    currentEstimate: SalvageValueResult;
    recommendations: Array<{
        strategy: string;
        expectedValue: number;
        timeline: string;
        riskLevel: 'low' | 'medium' | 'high';
    }>;
    optimalStrategy: string;
}>;
/**
 * Compares disposal methods by financial impact
 *
 * @param assetId - Asset ID
 * @returns Comparison of disposal methods
 *
 * @example
 * ```typescript
 * const comparison = await compareDisposalMethods('asset-123');
 * ```
 */
export declare function compareDisposalMethods(assetId: string): Promise<Array<{
    method: DisposalMethod;
    estimatedRevenue: number;
    estimatedCost: number;
    netValue: number;
    timeline: string;
    complexity: 'low' | 'medium' | 'high';
}>>;
/**
 * Determines environmental requirements for asset disposal
 *
 * @param assetId - Asset ID
 * @param disposalMethod - Disposal method
 * @returns Environmental requirements
 *
 * @example
 * ```typescript
 * const requirements = await getEnvironmentalRequirements(
 *   'asset-123',
 *   DisposalMethod.RECYCLE
 * );
 * ```
 */
export declare function getEnvironmentalRequirements(assetId: string, disposalMethod: DisposalMethod): Promise<EnvironmentalRequirements>;
/**
 * Validates disposal vendor compliance
 *
 * @param vendorId - Disposal vendor ID
 * @param requirements - Environmental requirements
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVendorCompliance('vendor-123', requirements);
 * ```
 */
export declare function validateVendorCompliance(vendorId: string, requirements: EnvironmentalRequirements): Promise<{
    compliant: boolean;
    missingCertifications: string[];
    warnings: string[];
}>;
/**
 * Processes data sanitization for asset
 *
 * @param requestId - Disposal request ID
 * @param sanitizationData - Sanitization details
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await processDataSanitization('disposal-123', {
 *   sanitizationLevel: DataSanitizationLevel.DOD_7_PASS,
 *   sanitizedBy: 'tech-001',
 *   sanitizationDate: new Date(),
 *   verificationMethod: 'Visual inspection and software verification',
 *   certificateUrl: 'https://storage/cert-123.pdf'
 * });
 * ```
 */
export declare function processDataSanitization(requestId: string, sanitizationData: {
    sanitizationLevel: DataSanitizationLevel;
    sanitizedBy: string;
    sanitizationDate: Date;
    verificationMethod?: string;
    certificateUrl?: string;
    notes?: string;
}, transaction?: Transaction): Promise<DisposalRequest>;
/**
 * Generates certificate of destruction
 *
 * @param data - Certificate data
 * @param transaction - Optional database transaction
 * @returns Created certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateCertificateOfDestruction({
 *   disposalRequestId: 'disposal-123',
 *   certificateNumber: 'COD-2024-001234',
 *   issuedBy: 'Certified Disposal Vendor Inc.',
 *   issuedDate: new Date(),
 *   destructionMethod: 'Industrial shredding and smelting',
 *   destructionDate: new Date(),
 *   witnessList: ['John Doe', 'Jane Smith'],
 *   photographicEvidence: ['https://storage/photo1.jpg'],
 *   certificationStandard: 'NAID AAA Certification'
 * });
 * ```
 */
export declare function generateCertificateOfDestruction(data: CertificateOfDestructionData, transaction?: Transaction): Promise<CertificateOfDestruction>;
/**
 * Validates destruction documentation
 *
 * @param certificateId - Certificate ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDestructionDocumentation('cert-123');
 * ```
 */
export declare function validateDestructionDocumentation(certificateId: string): Promise<{
    valid: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Registers new disposal vendor
 *
 * @param vendorData - Vendor registration data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerDisposalVendor({
 *   vendorCode: 'DV-2024-001',
 *   vendorName: 'Green Disposal Solutions Inc.',
 *   disposalMethodsOffered: [DisposalMethod.RECYCLE, DisposalMethod.SCRAP],
 *   certifications: ['R2', 'e-Stewards', 'ISO 14001'],
 *   isCertified: true,
 *   contactEmail: 'contact@greendisposal.com',
 *   contactPhone: '555-0123'
 * });
 * ```
 */
export declare function registerDisposalVendor(vendorData: {
    vendorCode: string;
    vendorName: string;
    disposalMethodsOffered: DisposalMethod[];
    certifications?: string[];
    isCertified?: boolean;
    environmentalCompliance?: string[];
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: Record<string, any>;
    serviceAreas?: string[];
    pricingStructure?: Record<string, any>;
}, transaction?: Transaction): Promise<DisposalVendor>;
/**
 * Updates vendor performance rating
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Completed disposal request ID
 * @param rating - Performance rating (1-5)
 * @param feedback - Optional feedback
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', 'disposal-456', 4.5,
 *   'Excellent service, timely completion'
 * );
 * ```
 */
export declare function updateVendorPerformance(vendorId: string, disposalRequestId: string, rating: number, feedback?: string, transaction?: Transaction): Promise<DisposalVendor>;
/**
 * Gets certified vendors for disposal method
 *
 * @param disposalMethod - Disposal method
 * @param environmentalClassification - Optional environmental classification filter
 * @returns Certified vendors
 *
 * @example
 * ```typescript
 * const vendors = await getCertifiedVendors(
 *   DisposalMethod.RECYCLE,
 *   EnvironmentalClassification.ELECTRONIC_WASTE
 * );
 * ```
 */
export declare function getCertifiedVendors(disposalMethod: DisposalMethod, environmentalClassification?: EnvironmentalClassification): Promise<DisposalVendor[]>;
/**
 * Evaluates vendor for disposal request
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Disposal request ID
 * @returns Vendor evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorForDisposal('vendor-123', 'disposal-456');
 * ```
 */
export declare function evaluateVendorForDisposal(vendorId: string, disposalRequestId: string): Promise<{
    vendor: DisposalVendor;
    suitabilityScore: number;
    strengths: string[];
    concerns: string[];
    recommendation: 'highly_recommended' | 'recommended' | 'acceptable' | 'not_recommended';
}>;
/**
 * Calculates total disposal cost
 *
 * @param requestId - Disposal request ID
 * @param costDetails - Cost detail inputs
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateDisposalCost('disposal-123', {
 *   vendorFees: 2500,
 *   transportationCost: 750,
 *   sanitizationCost: 500,
 *   certificationCost: 300
 * });
 * ```
 */
export declare function calculateDisposalCost(requestId: string, costDetails: {
    vendorFees?: number;
    transportationCost?: number;
    sanitizationCost?: number;
    certificationCost?: number;
    environmentalFees?: number;
    administrativeCost?: number;
}): Promise<DisposalCostBreakdown>;
/**
 * Tracks revenue recovery from disposal
 *
 * @param requestId - Disposal request ID
 * @param revenueData - Revenue details
 * @param transaction - Optional database transaction
 * @returns Revenue recovery summary
 *
 * @example
 * ```typescript
 * const recovery = await trackRevenueRecovery('disposal-123', {
 *   saleAmount: 15000,
 *   taxDeduction: 5000
 * });
 * ```
 */
export declare function trackRevenueRecovery(requestId: string, revenueData: {
    saleAmount?: number;
    tradeInValue?: number;
    salvageValue?: number;
    taxDeduction?: number;
}, transaction?: Transaction): Promise<RevenueRecovery>;
/**
 * Completes disposal request
 *
 * @param requestId - Disposal request ID
 * @param completionData - Completion details
 * @param transaction - Optional database transaction
 * @returns Completed disposal request
 *
 * @example
 * ```typescript
 * await completeDisposal('disposal-123', {
 *   completedBy: 'user-001',
 *   actualDisposalDate: new Date(),
 *   finalNotes: 'Asset disposed via certified recycler, all documentation on file'
 * });
 * ```
 */
export declare function completeDisposal(requestId: string, completionData: {
    completedBy: string;
    actualDisposalDate: Date;
    finalNotes?: string;
}, transaction?: Transaction): Promise<DisposalRequest>;
/**
 * Gets disposal audit trail
 *
 * @param requestId - Disposal request ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getDisposalAuditTrail('disposal-123');
 * ```
 */
export declare function getDisposalAuditTrail(requestId: string): Promise<DisposalAuditLog[]>;
/**
 * Generates disposal compliance report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateDisposalComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateDisposalComplianceReport(startDate: Date, endDate: Date): Promise<{
    totalDisposals: number;
    byMethod: Record<DisposalMethod, number>;
    byStatus: Record<DisposalStatus, number>;
    environmentalCompliance: {
        hazardousDisposals: number;
        certifiedVendorUsage: number;
        certificatesIssued: number;
    };
    financialSummary: {
        totalCosts: number;
        totalRecovery: number;
        netImpact: number;
    };
}>;
/**
 * Searches disposal requests with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered disposal requests
 *
 * @example
 * ```typescript
 * const results = await searchDisposalRequests({
 *   status: DisposalStatus.PENDING_APPROVAL,
 *   disposalMethod: DisposalMethod.SALE,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare function searchDisposalRequests(filters: {
    status?: DisposalStatus | DisposalStatus[];
    disposalMethod?: DisposalMethod | DisposalMethod[];
    assetId?: string;
    requestedBy?: string;
    startDate?: Date;
    endDate?: Date;
    vendorId?: string;
    requiresApproval?: boolean;
}, options?: FindOptions): Promise<{
    requests: DisposalRequest[];
    total: number;
}>;
declare const _default: {
    DisposalRequest: typeof DisposalRequest;
    DisposalApproval: typeof DisposalApproval;
    DisposalVendor: typeof DisposalVendor;
    CertificateOfDestruction: typeof CertificateOfDestruction;
    DisposalAuditLog: typeof DisposalAuditLog;
    initiateAssetDisposal: typeof initiateAssetDisposal;
    generateDisposalRequestNumber: typeof generateDisposalRequestNumber;
    updateDisposalStatus: typeof updateDisposalStatus;
    submitDisposalForApproval: typeof submitDisposalForApproval;
    getRequiredApprovalLevels: typeof getRequiredApprovalLevels;
    processDisposalApproval: typeof processDisposalApproval;
    getDisposalWithApprovals: typeof getDisposalWithApprovals;
    calculateSalvageValue: typeof calculateSalvageValue;
    optimizeSalvageValue: typeof optimizeSalvageValue;
    compareDisposalMethods: typeof compareDisposalMethods;
    getEnvironmentalRequirements: typeof getEnvironmentalRequirements;
    validateVendorCompliance: typeof validateVendorCompliance;
    processDataSanitization: typeof processDataSanitization;
    generateCertificateOfDestruction: typeof generateCertificateOfDestruction;
    validateDestructionDocumentation: typeof validateDestructionDocumentation;
    registerDisposalVendor: typeof registerDisposalVendor;
    updateVendorPerformance: typeof updateVendorPerformance;
    getCertifiedVendors: typeof getCertifiedVendors;
    evaluateVendorForDisposal: typeof evaluateVendorForDisposal;
    calculateDisposalCost: typeof calculateDisposalCost;
    trackRevenueRecovery: typeof trackRevenueRecovery;
    completeDisposal: typeof completeDisposal;
    getDisposalAuditTrail: typeof getDisposalAuditTrail;
    generateDisposalComplianceReport: typeof generateDisposalComplianceReport;
    searchDisposalRequests: typeof searchDisposalRequests;
};
export default _default;
//# sourceMappingURL=asset-disposal-commands.d.ts.map