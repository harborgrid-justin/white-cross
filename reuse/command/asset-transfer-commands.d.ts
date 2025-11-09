/**
 * ASSET TRANSFER MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset transfer management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive transfer workflows including:
 * - Inter-location transfers with tracking
 * - Inter-department transfers and assignments
 * - Custody transfers and chain of custody
 * - Transfer documentation and compliance
 * - Shipping management and logistics
 * - Multi-level transfer approvals
 * - Transfer cost tracking and allocation
 * - Complete transfer history and audit trails
 * - Bulk transfer operations
 * - Transfer request workflows
 * - Asset condition verification
 * - Transfer insurance and liability
 * - Real-time transfer status tracking
 *
 * @module AssetTransferCommands
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
 *   initiateAssetTransfer,
 *   approveTransferRequest,
 *   trackTransferShipment,
 *   completeTransfer,
 *   TransferType,
 *   TransferStatus
 * } from './asset-transfer-commands';
 *
 * // Initiate transfer
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department relocation',
 *   targetTransferDate: new Date('2024-07-01')
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Transfer types
 */
export declare enum TransferType {
    INTER_LOCATION = "inter_location",
    INTER_DEPARTMENT = "inter_department",
    INTER_FACILITY = "inter_facility",
    CUSTODY_CHANGE = "custody_change",
    EMPLOYEE_ASSIGNMENT = "employee_assignment",
    TEMPORARY_LOAN = "temporary_loan",
    PERMANENT_TRANSFER = "permanent_transfer",
    RETURN_FROM_LOAN = "return_from_loan",
    MAINTENANCE_TRANSFER = "maintenance_transfer",
    STORAGE_TRANSFER = "storage_transfer"
}
/**
 * Transfer status
 */
export declare enum TransferStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold",
    DELAYED = "delayed"
}
/**
 * Shipping method
 */
export declare enum ShippingMethod {
    INTERNAL_COURIER = "internal_courier",
    THIRD_PARTY_CARRIER = "third_party_carrier",
    FREIGHT = "freight",
    AIR_FREIGHT = "air_freight",
    HAND_CARRY = "hand_carry",
    POSTAL_SERVICE = "postal_service",
    WHITE_GLOVE = "white_glove"
}
/**
 * Transfer priority
 */
export declare enum TransferPriority {
    CRITICAL = "critical",
    HIGH = "high",
    NORMAL = "normal",
    LOW = "low"
}
/**
 * Asset transfer request data
 */
export interface TransferRequestData {
    assetId: string;
    transferType: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
    fromDepartmentId?: string;
    toDepartmentId?: string;
    fromCustodianId?: string;
    toCustodianId?: string;
    requestedBy: string;
    reason: string;
    targetTransferDate?: Date;
    expectedReturnDate?: Date;
    priority?: TransferPriority;
    requiresInsurance?: boolean;
    specialHandling?: string;
    notes?: string;
    attachments?: string[];
}
/**
 * Transfer approval data
 */
export interface TransferApprovalData {
    transferId: string;
    approverId: string;
    approved: boolean;
    comments?: string;
    conditions?: string[];
    approvalDate: Date;
}
/**
 * Shipping details
 */
export interface ShippingDetails {
    shippingMethod: ShippingMethod;
    carrier?: string;
    trackingNumber?: string;
    shippingCost?: number;
    insuranceValue?: number;
    insuranceCost?: number;
    estimatedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    packagingRequirements?: string;
    specialInstructions?: string;
}
/**
 * Transfer cost breakdown
 */
export interface TransferCostBreakdown {
    shippingCost: number;
    packagingCost: number;
    insuranceCost: number;
    handlingFee: number;
    laborCost: number;
    documentationFee: number;
    otherCosts: number;
    totalCost: number;
}
/**
 * Transfer verification data
 */
export interface TransferVerification {
    verifiedBy: string;
    verificationDate: Date;
    conditionOnDeparture?: string;
    conditionOnArrival?: string;
    damageReported?: boolean;
    damageDescription?: string;
    photosOnDeparture?: string[];
    photosOnArrival?: string[];
    signatureOnDeparture?: string;
    signatureOnArrival?: string;
}
/**
 * Bulk transfer data
 */
export interface BulkTransferData {
    assetIds: string[];
    transferType: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
    fromDepartmentId?: string;
    toDepartmentId?: string;
    requestedBy: string;
    reason: string;
    targetTransferDate?: Date;
}
/**
 * Bulk transfer result
 */
export interface BulkTransferResult {
    totalAssets: number;
    successful: number;
    failed: number;
    transferIds: string[];
    errors: Array<{
        assetId: string;
        error: string;
    }>;
}
/**
 * Asset Transfer Model
 */
export declare class AssetTransfer extends Model {
    id: string;
    transferNumber: string;
    assetId: string;
    transferType: TransferType;
    status: TransferStatus;
    priority: TransferPriority;
    fromLocationId?: string;
    toLocationId?: string;
    fromDepartmentId?: string;
    toDepartmentId?: string;
    fromCustodianId?: string;
    toCustodianId?: string;
    requestedBy: string;
    requestDate: Date;
    reason: string;
    targetTransferDate?: Date;
    actualTransferDate?: Date;
    expectedReturnDate?: Date;
    actualReturnDate?: Date;
    requiresApproval: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    requiresInsurance: boolean;
    insuranceValue?: number;
    shippingDetails?: ShippingDetails;
    transferCost?: number;
    costBreakdown?: TransferCostBreakdown;
    costAllocationDepartmentId?: string;
    specialHandling?: string;
    departureVerification?: Partial<TransferVerification>;
    arrivalVerification?: Partial<TransferVerification>;
    conditionOnDeparture?: string;
    conditionOnArrival?: string;
    damageReported: boolean;
    damageDescription?: string;
    notes?: string;
    attachments?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    approvals?: TransferApproval[];
    statusHistory?: TransferStatusHistory[];
    auditLogs?: TransferAuditLog[];
}
/**
 * Transfer Approval Model
 */
export declare class TransferApproval extends Model {
    id: string;
    transferId: string;
    approverId: string;
    approvalLevel: number;
    approved?: boolean;
    approvalDate?: Date;
    comments?: string;
    conditions?: string[];
    notified: boolean;
    createdAt: Date;
    updatedAt: Date;
    transfer?: AssetTransfer;
}
/**
 * Transfer Status History Model
 */
export declare class TransferStatusHistory extends Model {
    id: string;
    transferId: string;
    previousStatus?: TransferStatus;
    status: TransferStatus;
    changedBy: string;
    changedAt: Date;
    locationAtChange?: string;
    notes?: string;
    createdAt: Date;
    transfer?: AssetTransfer;
}
/**
 * Transfer Audit Log Model
 */
export declare class TransferAuditLog extends Model {
    id: string;
    transferId: string;
    actionType: string;
    actionDescription: string;
    performedBy: string;
    actionTimestamp: Date;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    transfer?: AssetTransfer;
}
/**
 * Transfer Template Model - For common transfer routes
 */
export declare class TransferTemplate extends Model {
    id: string;
    templateName: string;
    transferType: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
    defaultShippingMethod?: ShippingMethod;
    estimatedTransitDays?: number;
    estimatedCost?: number;
    requiredApprovers?: string[];
    specialInstructions?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Initiates a new asset transfer
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department consolidation',
 *   targetTransferDate: new Date('2024-07-01'),
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
export declare function initiateAssetTransfer(data: TransferRequestData, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Generates unique transfer number
 *
 * @returns Transfer number
 *
 * @example
 * ```typescript
 * const transferNumber = await generateTransferNumber();
 * // Returns: "TRF-2024-001234"
 * ```
 */
export declare function generateTransferNumber(): Promise<string>;
/**
 * Updates transfer status
 *
 * @param transferId - Transfer ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param location - Optional current location
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await updateTransferStatus(
 *   'transfer-123',
 *   TransferStatus.IN_TRANSIT,
 *   'user-001',
 *   'Asset picked up by courier',
 *   'Warehouse A - Loading Dock'
 * );
 * ```
 */
export declare function updateTransferStatus(transferId: string, status: TransferStatus, updatedBy: string, notes?: string, location?: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Submits transfer for approval
 *
 * @param transferId - Transfer ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await submitTransferForApproval('transfer-123', 'user-001');
 * ```
 */
export declare function submitTransferForApproval(transferId: string, submittedBy: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Processes transfer approval
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await approveTransferRequest({
 *   transferId: 'transfer-123',
 *   approverId: 'mgr-001',
 *   approved: true,
 *   comments: 'Approved - asset available for transfer',
 *   approvalDate: new Date()
 * });
 * ```
 */
export declare function approveTransferRequest(data: TransferApprovalData, transaction?: Transaction): Promise<TransferApproval>;
/**
 * Gets transfer with all approvals
 *
 * @param transferId - Transfer ID
 * @returns Transfer with approvals
 *
 * @example
 * ```typescript
 * const transfer = await getTransferWithApprovals('transfer-123');
 * ```
 */
export declare function getTransferWithApprovals(transferId: string): Promise<AssetTransfer>;
/**
 * Assigns shipping details to transfer
 *
 * @param transferId - Transfer ID
 * @param shippingDetails - Shipping information
 * @param assignedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await assignShippingDetails('transfer-123', {
 *   shippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   carrier: 'FedEx',
 *   trackingNumber: '1Z999AA10123456784',
 *   shippingCost: 125.50,
 *   insuranceValue: 50000,
 *   estimatedDeliveryDate: new Date('2024-07-05')
 * }, 'user-001');
 * ```
 */
export declare function assignShippingDetails(transferId: string, shippingDetails: ShippingDetails, assignedBy: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Tracks shipment status update
 *
 * @param transferId - Transfer ID
 * @param trackingUpdate - Tracking information
 * @param updatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await trackTransferShipment('transfer-123', {
 *   currentLocation: 'Memphis, TN Distribution Center',
 *   status: 'In Transit',
 *   estimatedDelivery: new Date('2024-07-05'),
 *   lastUpdate: new Date()
 * }, 'system');
 * ```
 */
export declare function trackTransferShipment(transferId: string, trackingUpdate: {
    currentLocation?: string;
    status?: string;
    estimatedDelivery?: Date;
    lastUpdate: Date;
    notes?: string;
}, updatedBy: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Records departure verification
 *
 * @param transferId - Transfer ID
 * @param verification - Departure verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordDepartureVerification('transfer-123', {
 *   verifiedBy: 'warehouse-001',
 *   verificationDate: new Date(),
 *   conditionOnDeparture: 'Excellent',
 *   photosOnDeparture: ['https://storage/photo1.jpg'],
 *   signatureOnDeparture: 'base64-signature-data'
 * });
 * ```
 */
export declare function recordDepartureVerification(transferId: string, verification: Partial<TransferVerification>, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Records arrival verification
 *
 * @param transferId - Transfer ID
 * @param verification - Arrival verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordArrivalVerification('transfer-123', {
 *   verifiedBy: 'warehouse-002',
 *   verificationDate: new Date(),
 *   conditionOnArrival: 'Good',
 *   damageReported: false,
 *   photosOnArrival: ['https://storage/arrival1.jpg'],
 *   signatureOnArrival: 'base64-signature-data'
 * });
 * ```
 */
export declare function recordArrivalVerification(transferId: string, verification: Partial<TransferVerification>, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Calculates transfer cost
 *
 * @param transferId - Transfer ID
 * @param costDetails - Cost component details
 * @param transaction - Optional database transaction
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateTransferCost('transfer-123', {
 *   shippingCost: 125.50,
 *   packagingCost: 35.00,
 *   insuranceCost: 50.00,
 *   handlingFee: 25.00,
 *   laborCost: 75.00
 * });
 * ```
 */
export declare function calculateTransferCost(transferId: string, costDetails: {
    shippingCost?: number;
    packagingCost?: number;
    insuranceCost?: number;
    handlingFee?: number;
    laborCost?: number;
    documentationFee?: number;
    otherCosts?: number;
}, transaction?: Transaction): Promise<TransferCostBreakdown>;
/**
 * Allocates transfer cost to department
 *
 * @param transferId - Transfer ID
 * @param departmentId - Department to charge
 * @param allocatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await allocateTransferCost('transfer-123', 'dept-002', 'admin-001');
 * ```
 */
export declare function allocateTransferCost(transferId: string, departmentId: string, allocatedBy: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Completes asset transfer
 *
 * @param transferId - Transfer ID
 * @param completedBy - User ID
 * @param finalNotes - Optional final notes
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 *
 * @example
 * ```typescript
 * await completeTransfer('transfer-123', 'user-001',
 *   'Asset successfully transferred, all documentation complete'
 * );
 * ```
 */
export declare function completeTransfer(transferId: string, completedBy: string, finalNotes?: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Cancels asset transfer
 *
 * @param transferId - Transfer ID
 * @param cancelledBy - User ID
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Cancelled transfer
 *
 * @example
 * ```typescript
 * await cancelTransfer('transfer-123', 'user-001',
 *   'Asset no longer required at destination'
 * );
 * ```
 */
export declare function cancelTransfer(transferId: string, cancelledBy: string, reason: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Initiates bulk asset transfer
 *
 * @param data - Bulk transfer data
 * @param transaction - Optional database transaction
 * @returns Bulk transfer result
 *
 * @example
 * ```typescript
 * const result = await initiateBulkTransfer({
 *   assetIds: ['asset-001', 'asset-002', 'asset-003'],
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Office relocation',
 *   targetTransferDate: new Date('2024-08-01')
 * });
 * ```
 */
export declare function initiateBulkTransfer(data: BulkTransferData, transaction?: Transaction): Promise<BulkTransferResult>;
/**
 * Bulk approves transfers
 *
 * @param transferIds - Array of transfer IDs
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Bulk approval result
 *
 * @example
 * ```typescript
 * const result = await bulkApproveTransfers(
 *   ['transfer-001', 'transfer-002', 'transfer-003'],
 *   'mgr-001',
 *   'Batch approved for Q3 office move'
 * );
 * ```
 */
export declare function bulkApproveTransfers(transferIds: string[], approverId: string, comments?: string, transaction?: Transaction): Promise<{
    successful: number;
    failed: number;
    errors: Array<{
        transferId: string;
        error: string;
    }>;
}>;
/**
 * Creates transfer template
 *
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createTransferTemplate({
 *   templateName: 'HQ to Branch Office A',
 *   transferType: TransferType.INTER_FACILITY,
 *   fromLocationId: 'loc-hq',
 *   toLocationId: 'loc-branch-a',
 *   defaultShippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   estimatedTransitDays: 3,
 *   estimatedCost: 150
 * });
 * ```
 */
export declare function createTransferTemplate(templateData: {
    templateName: string;
    transferType: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
    defaultShippingMethod?: ShippingMethod;
    estimatedTransitDays?: number;
    estimatedCost?: number;
    requiredApprovers?: string[];
    specialInstructions?: string;
}, transaction?: Transaction): Promise<TransferTemplate>;
/**
 * Creates transfer from template
 *
 * @param templateId - Template ID
 * @param assetId - Asset to transfer
 * @param requestedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createTransferFromTemplate(
 *   'template-123',
 *   'asset-456',
 *   'user-001'
 * );
 * ```
 */
export declare function createTransferFromTemplate(templateId: string, assetId: string, requestedBy: string, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Gets transfer audit trail
 *
 * @param transferId - Transfer ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getTransferAuditTrail('transfer-123');
 * ```
 */
export declare function getTransferAuditTrail(transferId: string): Promise<TransferAuditLog[]>;
/**
 * Gets transfer status history
 *
 * @param transferId - Transfer ID
 * @returns Status history
 *
 * @example
 * ```typescript
 * const history = await getTransferStatusHistory('transfer-123');
 * ```
 */
export declare function getTransferStatusHistory(transferId: string): Promise<TransferStatusHistory[]>;
/**
 * Generates transfer analytics report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @param filters - Optional filters
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateTransferReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateTransferReport(startDate: Date, endDate: Date, filters?: {
    transferType?: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
}): Promise<{
    totalTransfers: number;
    byType: Record<TransferType, number>;
    byStatus: Record<TransferStatus, number>;
    averageTransitDays: number;
    totalCost: number;
    onTimeDelivery: number;
    damageRate: number;
}>;
/**
 * Searches transfers with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered transfers
 *
 * @example
 * ```typescript
 * const results = await searchTransfers({
 *   status: TransferStatus.IN_TRANSIT,
 *   fromLocationId: 'loc-001',
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
export declare function searchTransfers(filters: {
    status?: TransferStatus | TransferStatus[];
    transferType?: TransferType | TransferType[];
    assetId?: string;
    fromLocationId?: string;
    toLocationId?: string;
    requestedBy?: string;
    priority?: TransferPriority;
    startDate?: Date;
    endDate?: Date;
}, options?: FindOptions): Promise<{
    transfers: AssetTransfer[];
    total: number;
}>;
declare const _default: {
    AssetTransfer: typeof AssetTransfer;
    TransferApproval: typeof TransferApproval;
    TransferStatusHistory: typeof TransferStatusHistory;
    TransferAuditLog: typeof TransferAuditLog;
    TransferTemplate: typeof TransferTemplate;
    initiateAssetTransfer: typeof initiateAssetTransfer;
    generateTransferNumber: typeof generateTransferNumber;
    updateTransferStatus: typeof updateTransferStatus;
    submitTransferForApproval: typeof submitTransferForApproval;
    approveTransferRequest: typeof approveTransferRequest;
    getTransferWithApprovals: typeof getTransferWithApprovals;
    assignShippingDetails: typeof assignShippingDetails;
    trackTransferShipment: typeof trackTransferShipment;
    recordDepartureVerification: typeof recordDepartureVerification;
    recordArrivalVerification: typeof recordArrivalVerification;
    calculateTransferCost: typeof calculateTransferCost;
    allocateTransferCost: typeof allocateTransferCost;
    completeTransfer: typeof completeTransfer;
    cancelTransfer: typeof cancelTransfer;
    initiateBulkTransfer: typeof initiateBulkTransfer;
    bulkApproveTransfers: typeof bulkApproveTransfers;
    createTransferTemplate: typeof createTransferTemplate;
    createTransferFromTemplate: typeof createTransferFromTemplate;
    getTransferAuditTrail: typeof getTransferAuditTrail;
    getTransferStatusHistory: typeof getTransferStatusHistory;
    generateTransferReport: typeof generateTransferReport;
    searchTransfers: typeof searchTransfers;
};
export default _default;
//# sourceMappingURL=asset-transfer-commands.d.ts.map