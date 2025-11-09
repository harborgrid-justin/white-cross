/**
 * ASSET VENDOR MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade vendor management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive vendor lifecycle management including:
 * - Vendor master data management and onboarding
 * - Vendor performance tracking and scorecards
 * - Vendor contracts and agreements
 * - Service level agreements (SLAs) and monitoring
 * - Vendor evaluation and qualification
 * - Preferred vendor lists and tier management
 * - Vendor pricing and rate management
 * - Vendor communication and collaboration
 * - Vendor compliance and certification tracking
 * - Purchase order and invoice management
 * - Vendor risk assessment
 * - Multi-location vendor support
 *
 * @module AssetVendorCommands
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
 *   createVendor,
 *   evaluateVendorPerformance,
 *   createVendorContract,
 *   trackVendorSLA,
 *   VendorStatus,
 *   VendorTier
 * } from './asset-vendor-commands';
 *
 * // Create vendor
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'Tech Solutions Inc.',
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED,
 *   contactInfo: { email: 'contact@techsolutions.com', phone: '555-0123' }
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Vendor types
 */
export declare enum VendorType {
    MANUFACTURER = "manufacturer",
    DISTRIBUTOR = "distributor",
    SERVICE_PROVIDER = "service_provider",
    MAINTENANCE_PROVIDER = "maintenance_provider",
    RESELLER = "reseller",
    OEM = "oem",
    CONTRACTOR = "contractor",
    CONSULTANT = "consultant"
}
/**
 * Vendor status
 */
export declare enum VendorStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_APPROVAL = "pending_approval",
    BLACKLISTED = "blacklisted",
    UNDER_REVIEW = "under_review"
}
/**
 * Vendor tier
 */
export declare enum VendorTier {
    STRATEGIC = "strategic",
    PREFERRED = "preferred",
    APPROVED = "approved",
    CONDITIONAL = "conditional",
    PROBATIONARY = "probationary"
}
/**
 * Contract status
 */
export declare enum ContractStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated",
    RENEWED = "renewed",
    SUSPENDED = "suspended"
}
/**
 * SLA status
 */
export declare enum SLAStatus {
    MET = "met",
    NOT_MET = "not_met",
    EXCEEDED = "exceeded",
    PENDING = "pending",
    NA = "na"
}
/**
 * Performance rating
 */
export declare enum PerformanceRating {
    EXCELLENT = "excellent",
    GOOD = "good",
    SATISFACTORY = "satisfactory",
    NEEDS_IMPROVEMENT = "needs_improvement",
    POOR = "poor"
}
/**
 * Vendor data
 */
export interface VendorData {
    vendorCode: string;
    vendorName: string;
    vendorType: VendorType;
    tier?: VendorTier;
    taxId?: string;
    website?: string;
    businessAddress?: Record<string, any>;
    billingAddress?: Record<string, any>;
    contactInfo: {
        primaryContact?: string;
        email?: string;
        phone?: string;
        fax?: string;
    };
    paymentTerms?: string;
    bankingInfo?: Record<string, any>;
    certifications?: string[];
    insuranceCoverage?: string[];
    createdBy: string;
}
/**
 * Contract data
 */
export interface VendorContractData {
    vendorId: string;
    contractNumber: string;
    contractType: string;
    startDate: Date;
    endDate: Date;
    autoRenew?: boolean;
    renewalNoticeDays?: number;
    contractValue?: number;
    paymentSchedule?: string;
    terms?: string;
    deliverables?: string[];
    createdBy: string;
}
/**
 * SLA definition
 */
export interface SLADefinition {
    vendorId: string;
    slaName: string;
    metricType: string;
    targetValue: number;
    unit: string;
    measurementFrequency: string;
    penaltyForBreach?: string;
    description?: string;
}
/**
 * Performance evaluation data
 */
export interface PerformanceEvaluationData {
    vendorId: string;
    evaluationPeriodStart: Date;
    evaluationPeriodEnd: Date;
    evaluatedBy: string;
    overallRating: PerformanceRating;
    qualityScore: number;
    deliveryScore: number;
    communicationScore: number;
    pricingScore: number;
    responseTimeScore: number;
    comments?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
}
/**
 * Vendor scorecard
 */
export interface VendorScorecard {
    vendorId: string;
    period: string;
    overallScore: number;
    qualityScore: number;
    deliveryScore: number;
    communicationScore: number;
    pricingScore: number;
    responseTimeScore: number;
    slaComplianceRate: number;
    onTimeDeliveryRate: number;
    defectRate: number;
    totalTransactions: number;
    totalSpend: number;
    rating: PerformanceRating;
}
/**
 * Vendor pricing
 */
export interface VendorPricing {
    vendorId: string;
    itemCode: string;
    itemDescription: string;
    unitPrice: number;
    currency: string;
    effectiveDate: Date;
    expirationDate?: Date;
    minimumOrderQuantity?: number;
    volumeDiscounts?: Array<{
        quantity: number;
        discountPercentage: number;
    }>;
}
/**
 * Vendor Model
 */
export declare class AssetVendor extends Model {
    id: string;
    vendorCode: string;
    vendorName: string;
    vendorType: VendorType;
    status: VendorStatus;
    tier?: VendorTier;
    taxId?: string;
    website?: string;
    businessAddress?: Record<string, any>;
    billingAddress?: Record<string, any>;
    contactInfo: Record<string, any>;
    paymentTerms?: string;
    bankingInfo?: Record<string, any>;
    certifications?: string[];
    insuranceCoverage?: string[];
    performanceScore?: number;
    qualityScore?: number;
    deliveryScore?: number;
    totalSpend: number;
    lastEvaluationDate?: Date;
    nextEvaluationDate?: Date;
    onboardingDate?: Date;
    isActive: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    contracts?: VendorContract[];
    slas?: VendorSLA[];
    evaluations?: VendorPerformanceEvaluation[];
    pricing?: VendorPricingModel[];
}
/**
 * Vendor Contract Model
 */
export declare class VendorContract extends Model {
    id: string;
    contractNumber: string;
    vendorId: string;
    contractType: string;
    status: ContractStatus;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    renewalNoticeDays?: number;
    contractValue?: number;
    paymentSchedule?: string;
    terms?: string;
    deliverables?: string[];
    contractDocumentUrl?: string;
    createdBy: string;
    approvedBy?: string;
    approvalDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    vendor?: AssetVendor;
}
/**
 * Vendor SLA Model
 */
export declare class VendorSLA extends Model {
    id: string;
    vendorId: string;
    slaName: string;
    metricType: string;
    targetValue: number;
    unit: string;
    measurementFrequency?: string;
    currentValue?: number;
    compliancePercentage?: number;
    penaltyForBreach?: string;
    description?: string;
    isActive: boolean;
    lastMeasuredDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    vendor?: AssetVendor;
    measurements?: SLAMeasurement[];
}
/**
 * SLA Measurement Model
 */
export declare class SLAMeasurement extends Model {
    id: string;
    slaId: string;
    measurementDate: Date;
    measuredValue: number;
    targetValue: number;
    variance?: number;
    status: SLAStatus;
    measuredBy: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    sla?: VendorSLA;
}
/**
 * Vendor Performance Evaluation Model
 */
export declare class VendorPerformanceEvaluation extends Model {
    id: string;
    vendorId: string;
    evaluationPeriodStart: Date;
    evaluationPeriodEnd: Date;
    evaluationDate: Date;
    evaluatedBy: string;
    overallRating: PerformanceRating;
    qualityScore: number;
    deliveryScore: number;
    communicationScore: number;
    pricingScore: number;
    responseTimeScore: number;
    overallScore?: number;
    comments?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    createdAt: Date;
    updatedAt: Date;
    vendor?: AssetVendor;
}
/**
 * Vendor Pricing Model
 */
export declare class VendorPricingModel extends Model {
    id: string;
    vendorId: string;
    itemCode: string;
    itemDescription?: string;
    unitPrice: number;
    currency: string;
    effectiveDate: Date;
    expirationDate?: Date;
    minimumOrderQuantity?: number;
    leadTimeDays?: number;
    volumeDiscounts?: Array<{
        quantity: number;
        discountPercentage: number;
    }>;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    vendor?: AssetVendor;
}
/**
 * Creates new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'ABC Manufacturing Inc.',
 *   vendorType: VendorType.MANUFACTURER,
 *   tier: VendorTier.APPROVED,
 *   contactInfo: {
 *     primaryContact: 'John Smith',
 *     email: 'john.smith@abcmfg.com',
 *     phone: '555-0123'
 *   },
 *   paymentTerms: 'Net 30',
 *   createdBy: 'user-001'
 * });
 * ```
 */
export declare function createVendor(data: VendorData, transaction?: Transaction): Promise<AssetVendor>;
/**
 * Updates vendor information
 *
 * @param vendorId - Vendor ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendor('vendor-123', {
 *   tier: VendorTier.PREFERRED,
 *   paymentTerms: 'Net 45',
 *   contactInfo: { email: 'newemail@vendor.com' }
 * });
 * ```
 */
export declare function updateVendor(vendorId: string, updates: Partial<VendorData>, transaction?: Transaction): Promise<AssetVendor>;
/**
 * Approves vendor
 *
 * @param vendorId - Vendor ID
 * @param approvedBy - User ID
 * @param tier - Assigned tier
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await approveVendor('vendor-123', 'mgr-001', VendorTier.APPROVED);
 * ```
 */
export declare function approveVendor(vendorId: string, approvedBy: string, tier?: VendorTier, transaction?: Transaction): Promise<AssetVendor>;
/**
 * Gets vendor by ID
 *
 * @param vendorId - Vendor ID
 * @param includeRelated - Whether to include related data
 * @returns Vendor details
 *
 * @example
 * ```typescript
 * const vendor = await getVendorById('vendor-123', true);
 * ```
 */
export declare function getVendorById(vendorId: string, includeRelated?: boolean): Promise<AssetVendor>;
/**
 * Searches vendors with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors({
 *   status: VendorStatus.ACTIVE,
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED
 * });
 * ```
 */
export declare function searchVendors(filters: {
    status?: VendorStatus | VendorStatus[];
    vendorType?: VendorType | VendorType[];
    tier?: VendorTier | VendorTier[];
    searchTerm?: string;
    minPerformanceScore?: number;
}, options?: FindOptions): Promise<{
    vendors: AssetVendor[];
    total: number;
}>;
/**
 * Creates vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createVendorContract({
 *   vendorId: 'vendor-123',
 *   contractNumber: 'CNT-2024-001',
 *   contractType: 'Service Agreement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   autoRenew: true,
 *   contractValue: 100000,
 *   createdBy: 'user-001'
 * });
 * ```
 */
export declare function createVendorContract(data: VendorContractData, transaction?: Transaction): Promise<VendorContract>;
/**
 * Activates vendor contract
 *
 * @param contractId - Contract ID
 * @param approvedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateVendorContract('contract-123', 'mgr-001');
 * ```
 */
export declare function activateVendorContract(contractId: string, approvedBy: string, transaction?: Transaction): Promise<VendorContract>;
/**
 * Gets expiring contracts
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(90);
 * ```
 */
export declare function getExpiringContracts(daysAhead?: number): Promise<VendorContract[]>;
/**
 * Creates vendor SLA
 *
 * @param data - SLA definition
 * @param transaction - Optional database transaction
 * @returns Created SLA
 *
 * @example
 * ```typescript
 * const sla = await createVendorSLA({
 *   vendorId: 'vendor-123',
 *   slaName: 'Response Time SLA',
 *   metricType: 'response_time',
 *   targetValue: 24,
 *   unit: 'hours',
 *   measurementFrequency: 'monthly',
 *   penaltyForBreach: '5% credit on monthly invoice'
 * });
 * ```
 */
export declare function createVendorSLA(data: SLADefinition, transaction?: Transaction): Promise<VendorSLA>;
/**
 * Records SLA measurement
 *
 * @param slaId - SLA ID
 * @param measuredValue - Measured value
 * @param measuredBy - User ID
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns SLA measurement
 *
 * @example
 * ```typescript
 * await recordSLAMeasurement('sla-123', 22, 'user-001',
 *   'Average response time for January'
 * );
 * ```
 */
export declare function recordSLAMeasurement(slaId: string, measuredValue: number, measuredBy: string, notes?: string, transaction?: Transaction): Promise<SLAMeasurement>;
/**
 * Gets SLA compliance report
 *
 * @param vendorId - Vendor ID
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns SLA compliance summary
 *
 * @example
 * ```typescript
 * const report = await getSLAComplianceReport(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getSLAComplianceReport(vendorId: string, startDate: Date, endDate: Date): Promise<{
    vendorId: string;
    totalSLAs: number;
    measurements: number;
    metCount: number;
    notMetCount: number;
    complianceRate: number;
    slaDetails: Array<{
        slaName: string;
        metricType: string;
        complianceRate: number;
    }>;
}>;
/**
 * Evaluates vendor performance
 *
 * @param data - Evaluation data
 * @param transaction - Optional database transaction
 * @returns Performance evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorPerformance({
 *   vendorId: 'vendor-123',
 *   evaluationPeriodStart: new Date('2024-01-01'),
 *   evaluationPeriodEnd: new Date('2024-06-30'),
 *   evaluatedBy: 'mgr-001',
 *   overallRating: PerformanceRating.GOOD,
 *   qualityScore: 85,
 *   deliveryScore: 90,
 *   communicationScore: 88,
 *   pricingScore: 82,
 *   responseTimeScore: 87
 * });
 * ```
 */
export declare function evaluateVendorPerformance(data: PerformanceEvaluationData, transaction?: Transaction): Promise<VendorPerformanceEvaluation>;
/**
 * Generates vendor scorecard
 *
 * @param vendorId - Vendor ID
 * @param period - Time period
 * @returns Vendor scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123', '2024-Q2');
 * ```
 */
export declare function generateVendorScorecard(vendorId: string, period: string): Promise<VendorScorecard>;
/**
 * Creates vendor pricing
 *
 * @param data - Pricing data
 * @param transaction - Optional database transaction
 * @returns Vendor pricing
 *
 * @example
 * ```typescript
 * const pricing = await createVendorPricing({
 *   vendorId: 'vendor-123',
 *   itemCode: 'PART-001',
 *   itemDescription: 'Replacement Part A',
 *   unitPrice: 125.50,
 *   currency: 'USD',
 *   effectiveDate: new Date(),
 *   minimumOrderQuantity: 10
 * });
 * ```
 */
export declare function createVendorPricing(data: VendorPricing, transaction?: Transaction): Promise<VendorPricingModel>;
/**
 * Gets current pricing for item
 *
 * @param vendorId - Vendor ID
 * @param itemCode - Item code
 * @returns Current pricing or null
 *
 * @example
 * ```typescript
 * const pricing = await getVendorPricing('vendor-123', 'PART-001');
 * ```
 */
export declare function getVendorPricing(vendorId: string, itemCode: string): Promise<VendorPricingModel | null>;
declare const _default: {
    AssetVendor: typeof AssetVendor;
    VendorContract: typeof VendorContract;
    VendorSLA: typeof VendorSLA;
    SLAMeasurement: typeof SLAMeasurement;
    VendorPerformanceEvaluation: typeof VendorPerformanceEvaluation;
    VendorPricingModel: typeof VendorPricingModel;
    createVendor: typeof createVendor;
    updateVendor: typeof updateVendor;
    approveVendor: typeof approveVendor;
    getVendorById: typeof getVendorById;
    searchVendors: typeof searchVendors;
    createVendorContract: typeof createVendorContract;
    activateVendorContract: typeof activateVendorContract;
    getExpiringContracts: typeof getExpiringContracts;
    createVendorSLA: typeof createVendorSLA;
    recordSLAMeasurement: typeof recordSLAMeasurement;
    getSLAComplianceReport: typeof getSLAComplianceReport;
    evaluateVendorPerformance: typeof evaluateVendorPerformance;
    generateVendorScorecard: typeof generateVendorScorecard;
    createVendorPricing: typeof createVendorPricing;
    getVendorPricing: typeof getVendorPricing;
};
export default _default;
//# sourceMappingURL=asset-vendor-commands.d.ts.map