/**
 * ASSET CONFIGURATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset configuration management system providing comprehensive
 * functionality for configuration items, baselines, change management, version control,
 * configuration audits, CMDB integration, and drift detection. Competes with ServiceNow CMDB
 * and BMC Helix CMDB solutions.
 *
 * Features:
 * - Configuration Item (CI) management
 * - Configuration baselines and snapshots
 * - Change control and approval workflows
 * - Version control and history tracking
 * - Configuration drift detection
 * - CMDB integration and synchronization
 * - Relationship mapping (CI dependencies)
 * - Configuration audits and compliance
 * - Impact analysis
 * - Rollback and restore capabilities
 *
 * @module AssetConfigurationCommands
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
 *   createConfigurationItem,
 *   createBaseline,
 *   detectConfigurationDrift,
 *   createChangeRequest,
 *   ConfigurationItem,
 *   ChangeRequestStatus
 * } from './asset-configuration-commands';
 *
 * // Create configuration item
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     os: 'Ubuntu 22.04',
 *     cpu: '8 cores',
 *     memory: '32GB'
 *   },
 *   version: '1.0.0'
 * });
 *
 * // Create baseline
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456'
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Configuration Item Type
 */
export declare enum CIType {
    SERVER = "server",
    NETWORK_DEVICE = "network_device",
    STORAGE = "storage",
    DATABASE = "database",
    APPLICATION = "application",
    MIDDLEWARE = "middleware",
    WORKSTATION = "workstation",
    MOBILE_DEVICE = "mobile_device",
    VIRTUAL_MACHINE = "virtual_machine",
    CONTAINER = "container",
    CLOUD_SERVICE = "cloud_service",
    FACILITY = "facility",
    MANUFACTURING_EQUIPMENT = "manufacturing_equipment",
    VEHICLE = "vehicle"
}
/**
 * CI Status
 */
export declare enum CIStatus {
    PLANNED = "planned",
    IN_DEVELOPMENT = "in_development",
    IN_TESTING = "in_testing",
    OPERATIONAL = "operational",
    MAINTENANCE = "maintenance",
    RETIRED = "retired",
    DECOMMISSIONED = "decommissioned"
}
/**
 * Change Request Status
 */
export declare enum ChangeRequestStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ROLLED_BACK = "rolled_back"
}
/**
 * Change Priority
 */
export declare enum ChangePriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Change Type
 */
export declare enum ChangeType {
    STANDARD = "standard",
    NORMAL = "normal",
    EMERGENCY = "emergency",
    MAJOR = "major"
}
/**
 * Relationship Type
 */
export declare enum RelationshipType {
    DEPENDS_ON = "depends_on",
    HOSTED_ON = "hosted_on",
    CONNECTED_TO = "connected_to",
    USES = "uses",
    PART_OF = "part_of",
    MANAGES = "manages",
    RUNS_ON = "runs_on",
    BACKED_UP_BY = "backed_up_by",
    REPLICATED_TO = "replicated_to"
}
/**
 * Drift Status
 */
export declare enum DriftStatus {
    COMPLIANT = "compliant",
    DRIFT_DETECTED = "drift_detected",
    CRITICAL_DRIFT = "critical_drift",
    REVIEWING = "reviewing",
    REMEDIATED = "remediated"
}
/**
 * Audit Status
 */
export declare enum AuditStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Baseline Status
 */
export declare enum BaselineStatus {
    DRAFT = "draft",
    APPROVED = "approved",
    ACTIVE = "active",
    ARCHIVED = "archived",
    DEPRECATED = "deprecated"
}
/**
 * Configuration Item Data
 */
export interface ConfigurationItemData {
    assetId: string;
    ciType: CIType;
    name: string;
    description?: string;
    attributes: Record<string, any>;
    version: string;
    owner?: string;
    custodian?: string;
    location?: string;
    environment?: string;
    criticality?: string;
    tags?: string[];
}
/**
 * Baseline Data
 */
export interface BaselineData {
    name: string;
    description?: string;
    ciIds: string[];
    approvedBy: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    tags?: string[];
}
/**
 * Change Request Data
 */
export interface ChangeRequestData {
    ciId: string;
    changeType: ChangeType;
    priority: ChangePriority;
    title: string;
    description: string;
    justification: string;
    requestedBy: string;
    proposedChanges: Record<string, any>;
    implementationPlan?: string;
    rollbackPlan?: string;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    impactedCIs?: string[];
    requiredApprovers?: string[];
    attachments?: string[];
}
/**
 * CI Relationship Data
 */
export interface CIRelationshipData {
    sourceCI: string;
    targetCI: string;
    relationshipType: RelationshipType;
    description?: string;
    attributes?: Record<string, any>;
}
/**
 * Configuration Snapshot Data
 */
export interface ConfigurationSnapshotData {
    ciId: string;
    snapshotType: string;
    configuration: Record<string, any>;
    capturedBy: string;
    reason?: string;
    tags?: string[];
}
/**
 * Drift Detection Data
 */
export interface DriftDetectionData {
    ciId: string;
    baselineId: string;
    detectedBy?: string;
    driftDetails: DriftDetail[];
    severity: string;
}
/**
 * Drift Detail
 */
export interface DriftDetail {
    attribute: string;
    expectedValue: any;
    actualValue: any;
    deviation: string;
    impact: string;
}
/**
 * Configuration Audit Data
 */
export interface ConfigurationAuditData {
    ciIds: string[];
    auditType: string;
    auditedBy: string;
    scheduledDate: Date;
    scope: string;
    checklistItems?: string[];
}
/**
 * Version History Entry
 */
export interface VersionHistoryEntry {
    version: string;
    timestamp: Date;
    changedBy: string;
    changeType: string;
    changes: Record<string, any>;
    reason?: string;
}
/**
 * Configuration Item Model
 */
export declare class ConfigurationItem extends Model {
    id: string;
    ciNumber: string;
    assetId: string;
    ciType: CIType;
    name: string;
    description?: string;
    status: CIStatus;
    attributes: Record<string, any>;
    version: string;
    owner?: string;
    custodian?: string;
    location?: string;
    environment?: string;
    criticality?: string;
    tags?: string[];
    lastVerifiedDate?: Date;
    lastModifiedBy?: string;
    checksum?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    snapshots?: ConfigurationSnapshot[];
    outgoingRelationships?: CIRelationship[];
    incomingRelationships?: CIRelationship[];
    changeRequests?: ChangeRequest[];
    static generateCINumber(instance: ConfigurationItem): Promise<void>;
    static updateChecksum(instance: ConfigurationItem): Promise<void>;
}
/**
 * Configuration Baseline Model
 */
export declare class ConfigurationBaseline extends Model {
    id: string;
    baselineNumber: string;
    name: string;
    description?: string;
    status: BaselineStatus;
    configurationSnapshot: Record<string, any>;
    ciIds: string[];
    approvedBy?: string;
    approvalDate?: Date;
    effectiveDate?: Date;
    expirationDate?: Date;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    driftRecords?: DriftRecord[];
    static generateBaselineNumber(instance: ConfigurationBaseline): Promise<void>;
}
/**
 * Change Request Model
 */
export declare class ChangeRequest extends Model {
    id: string;
    changeNumber: string;
    ciId: string;
    changeType: ChangeType;
    priority: ChangePriority;
    status: ChangeRequestStatus;
    title: string;
    description: string;
    justification: string;
    requestedBy: string;
    proposedChanges: Record<string, any>;
    implementationPlan?: string;
    rollbackPlan?: string;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    impactedCIs?: string[];
    requiredApprovers?: string[];
    approvals?: Record<string, any>[];
    attachments?: string[];
    riskAssessment?: string;
    implementedBy?: string;
    implementationNotes?: string;
    rollbackPerformed: boolean;
    rollbackReason?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    configurationItem?: ConfigurationItem;
    static generateChangeNumber(instance: ChangeRequest): Promise<void>;
}
/**
 * CI Relationship Model
 */
export declare class CIRelationship extends Model {
    id: string;
    sourceCI: string;
    targetCI: string;
    relationshipType: RelationshipType;
    description?: string;
    attributes?: Record<string, any>;
    isActive: boolean;
    establishedDate: Date;
    severedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    sourceConfiguration?: ConfigurationItem;
    targetConfiguration?: ConfigurationItem;
}
/**
 * Configuration Snapshot Model
 */
export declare class ConfigurationSnapshot extends Model {
    id: string;
    ciId: string;
    snapshotType: string;
    configuration: Record<string, any>;
    capturedAt: Date;
    capturedBy: string;
    reason?: string;
    tags?: string[];
    checksum?: string;
    sizeBytes?: number;
    createdAt: Date;
    updatedAt: Date;
    configurationItem?: ConfigurationItem;
}
/**
 * Drift Record Model
 */
export declare class DriftRecord extends Model {
    id: string;
    ciId: string;
    baselineId: string;
    status: DriftStatus;
    driftDetails: DriftDetail[];
    severity: string;
    detectedAt: Date;
    detectedBy?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    resolutionNotes?: string;
    autoRemediated: boolean;
    createdAt: Date;
    updatedAt: Date;
    configurationItem?: ConfigurationItem;
    baseline?: ConfigurationBaseline;
}
/**
 * Configuration Audit Model
 */
export declare class ConfigurationAudit extends Model {
    id: string;
    auditNumber: string;
    auditType: string;
    status: AuditStatus;
    ciIds: string[];
    scheduledDate: Date;
    startedDate?: Date;
    completedDate?: Date;
    auditedBy: string;
    scope: string;
    checklistItems?: string[];
    findings?: Record<string, any>[];
    complianceScore?: number;
    recommendations?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    static generateAuditNumber(instance: ConfigurationAudit): Promise<void>;
}
/**
 * Version History Model
 */
export declare class ConfigurationVersionHistory extends Model {
    id: string;
    ciId: string;
    version: string;
    previousVersion?: string;
    changedAt: Date;
    changedBy: string;
    changeType: string;
    changes: Record<string, any>;
    previousConfiguration?: Record<string, any>;
    newConfiguration: Record<string, any>;
    reason?: string;
    changeRequestId?: string;
    createdAt: Date;
    updatedAt: Date;
    configurationItem?: ConfigurationItem;
}
/**
 * Creates a configuration item
 *
 * @param data - Configuration item data
 * @param transaction - Optional database transaction
 * @returns Created configuration item
 *
 * @example
 * ```typescript
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   name: 'Production Web Server 01',
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     ipAddress: '10.0.1.50',
 *     os: 'Ubuntu 22.04 LTS',
 *     cpu: '16 cores',
 *     memory: '64GB'
 *   },
 *   version: '1.0.0',
 *   environment: 'production'
 * });
 * ```
 */
export declare function createConfigurationItem(data: ConfigurationItemData, transaction?: Transaction): Promise<ConfigurationItem>;
/**
 * Updates configuration item
 *
 * @param ciId - CI identifier
 * @param updates - Fields to update
 * @param userId - User making the update
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await updateConfigurationItem('ci-123', {
 *   attributes: { memory: '128GB' },
 *   version: '1.1.0'
 * }, 'user-456');
 * ```
 */
export declare function updateConfigurationItem(ciId: string, updates: Partial<ConfigurationItem>, userId: string, transaction?: Transaction): Promise<ConfigurationItem>;
/**
 * Gets configuration item by ID
 *
 * @param ciId - CI identifier
 * @param includeRelationships - Include relationships
 * @returns Configuration item
 *
 * @example
 * ```typescript
 * const ci = await getConfigurationItem('ci-123', true);
 * ```
 */
export declare function getConfigurationItem(ciId: string, includeRelationships?: boolean): Promise<ConfigurationItem>;
/**
 * Gets CIs by type
 *
 * @param ciType - CI type
 * @param options - Query options
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const servers = await getConfigurationItemsByType(CIType.SERVER);
 * ```
 */
export declare function getConfigurationItemsByType(ciType: CIType, options?: FindOptions): Promise<ConfigurationItem[]>;
/**
 * Gets CIs by environment
 *
 * @param environment - Environment name
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const prodCIs = await getConfigurationItemsByEnvironment('production');
 * ```
 */
export declare function getConfigurationItemsByEnvironment(environment: string): Promise<ConfigurationItem[]>;
/**
 * Verifies configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User verifying
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await verifyConfigurationItem('ci-123', 'user-456');
 * ```
 */
export declare function verifyConfigurationItem(ciId: string, userId: string, transaction?: Transaction): Promise<ConfigurationItem>;
/**
 * Decommissions configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User decommissioning
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await decommissionConfigurationItem('ci-123', 'user-456');
 * ```
 */
export declare function decommissionConfigurationItem(ciId: string, userId: string, transaction?: Transaction): Promise<ConfigurationItem>;
/**
 * Creates configuration baseline
 *
 * @param data - Baseline data
 * @param transaction - Optional database transaction
 * @returns Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   description: 'Quarterly production environment baseline',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456',
 *   effectiveDate: new Date('2024-10-01')
 * });
 * ```
 */
export declare function createBaseline(data: BaselineData, transaction?: Transaction): Promise<ConfigurationBaseline>;
/**
 * Approves baseline
 *
 * @param baselineId - Baseline identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await approveBaseline('baseline-123', 'manager-456');
 * ```
 */
export declare function approveBaseline(baselineId: string, approverId: string, transaction?: Transaction): Promise<ConfigurationBaseline>;
/**
 * Activates baseline
 *
 * @param baselineId - Baseline identifier
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await activateBaseline('baseline-123');
 * ```
 */
export declare function activateBaseline(baselineId: string, transaction?: Transaction): Promise<ConfigurationBaseline>;
/**
 * Gets active baselines
 *
 * @returns Active baselines
 *
 * @example
 * ```typescript
 * const activeBaselines = await getActiveBaselines();
 * ```
 */
export declare function getActiveBaselines(): Promise<ConfigurationBaseline[]>;
/**
 * Compares CI against baseline
 *
 * @param ciId - CI identifier
 * @param baselineId - Baseline identifier
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const diff = await compareToBaseline('ci-123', 'baseline-456');
 * ```
 */
export declare function compareToBaseline(ciId: string, baselineId: string): Promise<{
    matches: boolean;
    differences: DriftDetail[];
}>;
/**
 * Creates change request
 *
 * @param data - Change request data
 * @param transaction - Optional database transaction
 * @returns Created change request
 *
 * @example
 * ```typescript
 * const change = await createChangeRequest({
 *   ciId: 'ci-123',
 *   changeType: ChangeType.NORMAL,
 *   priority: ChangePriority.MEDIUM,
 *   title: 'Upgrade OS to Ubuntu 24.04',
 *   description: 'Upgrade operating system for security patches',
 *   justification: 'Current version EOL in 3 months',
 *   requestedBy: 'user-456',
 *   proposedChanges: { os: 'Ubuntu 24.04 LTS' },
 *   implementationPlan: 'Take snapshot, upgrade, test, validate',
 *   rollbackPlan: 'Restore from snapshot'
 * });
 * ```
 */
export declare function createChangeRequest(data: ChangeRequestData, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Submits change request for approval
 *
 * @param changeId - Change request ID
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await submitChangeRequest('change-123');
 * ```
 */
export declare function submitChangeRequest(changeId: string, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Approves change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await approveChangeRequest('change-123', 'manager-456', 'Approved for implementation');
 * ```
 */
export declare function approveChangeRequest(changeId: string, approverId: string, comments?: string, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Rejects change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rejectChangeRequest('change-123', 'manager-456', 'Insufficient testing plan');
 * ```
 */
export declare function rejectChangeRequest(changeId: string, approverId: string, reason: string, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Implements change request
 *
 * @param changeId - Change request ID
 * @param implementerId - User implementing
 * @param notes - Implementation notes
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await implementChangeRequest('change-123', 'tech-789', 'Upgrade completed successfully');
 * ```
 */
export declare function implementChangeRequest(changeId: string, implementerId: string, notes?: string, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Rolls back change request
 *
 * @param changeId - Change request ID
 * @param userId - User performing rollback
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rollbackChangeRequest('change-123', 'tech-789', 'Service degradation detected');
 * ```
 */
export declare function rollbackChangeRequest(changeId: string, userId: string, reason: string, transaction?: Transaction): Promise<ChangeRequest>;
/**
 * Gets change requests by status
 *
 * @param status - Change request status
 * @returns Change requests
 *
 * @example
 * ```typescript
 * const pending = await getChangeRequestsByStatus(ChangeRequestStatus.SUBMITTED);
 * ```
 */
export declare function getChangeRequestsByStatus(status: ChangeRequestStatus): Promise<ChangeRequest[]>;
/**
 * Analyzes change impact
 *
 * @param changeId - Change request ID
 * @returns Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeChangeImpact('change-123');
 * ```
 */
export declare function analyzeChangeImpact(changeId: string): Promise<{
    directImpact: ConfigurationItem[];
    indirectImpact: ConfigurationItem[];
    totalImpacted: number;
}>;
/**
 * Creates CI relationship
 *
 * @param data - Relationship data
 * @param transaction - Optional database transaction
 * @returns Created relationship
 *
 * @example
 * ```typescript
 * await createCIRelationship({
 *   sourceCI: 'ci-app-1',
 *   targetCI: 'ci-db-1',
 *   relationshipType: RelationshipType.DEPENDS_ON,
 *   description: 'Application depends on database'
 * });
 * ```
 */
export declare function createCIRelationship(data: CIRelationshipData, transaction?: Transaction): Promise<CIRelationship>;
/**
 * Removes CI relationship
 *
 * @param relationshipId - Relationship ID
 * @param transaction - Optional database transaction
 * @returns Updated relationship
 *
 * @example
 * ```typescript
 * await removeCIRelationship('rel-123');
 * ```
 */
export declare function removeCIRelationship(relationshipId: string, transaction?: Transaction): Promise<CIRelationship>;
/**
 * Gets CI relationships
 *
 * @param ciId - CI identifier
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Relationships
 *
 * @example
 * ```typescript
 * const rels = await getCIRelationships('ci-123', 'both');
 * ```
 */
export declare function getCIRelationships(ciId: string, direction?: 'outgoing' | 'incoming' | 'both'): Promise<CIRelationship[]>;
/**
 * Gets CI dependency tree
 *
 * @param ciId - CI identifier
 * @param depth - Maximum depth
 * @returns Dependency tree
 *
 * @example
 * ```typescript
 * const tree = await getCIDependencyTree('ci-123', 3);
 * ```
 */
export declare function getCIDependencyTree(ciId: string, depth?: number): Promise<any>;
/**
 * Creates configuration snapshot
 *
 * @param data - Snapshot data
 * @param transaction - Optional database transaction
 * @returns Created snapshot
 *
 * @example
 * ```typescript
 * await createConfigurationSnapshot({
 *   ciId: 'ci-123',
 *   snapshotType: 'scheduled',
 *   configuration: currentConfig,
 *   capturedBy: 'user-456',
 *   reason: 'Weekly backup'
 * });
 * ```
 */
export declare function createConfigurationSnapshot(data: ConfigurationSnapshotData, transaction?: Transaction): Promise<ConfigurationSnapshot>;
/**
 * Gets CI snapshots
 *
 * @param ciId - CI identifier
 * @param limit - Maximum snapshots to return
 * @returns Snapshots
 *
 * @example
 * ```typescript
 * const snapshots = await getCISnapshots('ci-123', 10);
 * ```
 */
export declare function getCISnapshots(ciId: string, limit?: number): Promise<ConfigurationSnapshot[]>;
/**
 * Restores from snapshot
 *
 * @param snapshotId - Snapshot ID
 * @param userId - User restoring
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await restoreFromSnapshot('snapshot-123', 'user-456');
 * ```
 */
export declare function restoreFromSnapshot(snapshotId: string, userId: string, transaction?: Transaction): Promise<ConfigurationItem>;
/**
 * Detects configuration drift
 *
 * @param data - Drift detection data
 * @param transaction - Optional database transaction
 * @returns Drift record
 *
 * @example
 * ```typescript
 * const drift = await detectConfigurationDrift({
 *   ciId: 'ci-123',
 *   baselineId: 'baseline-456',
 *   driftDetails: [
 *     {
 *       attribute: 'memory',
 *       expectedValue: '64GB',
 *       actualValue: '32GB',
 *       deviation: 'Memory reduced',
 *       impact: 'high'
 *     }
 *   ],
 *   severity: 'high'
 * });
 * ```
 */
export declare function detectConfigurationDrift(data: DriftDetectionData, transaction?: Transaction): Promise<DriftRecord>;
/**
 * Scans for drift against baseline
 *
 * @param baselineId - Baseline ID
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const drifts = await scanForDrift('baseline-123');
 * ```
 */
export declare function scanForDrift(baselineId: string): Promise<DriftRecord[]>;
/**
 * Remediates drift
 *
 * @param driftId - Drift record ID
 * @param userId - User remediating
 * @param notes - Remediation notes
 * @param transaction - Optional database transaction
 * @returns Updated drift record
 *
 * @example
 * ```typescript
 * await remediateDrift('drift-123', 'user-456', 'Restored to baseline configuration');
 * ```
 */
export declare function remediateDrift(driftId: string, userId: string, notes?: string, transaction?: Transaction): Promise<DriftRecord>;
/**
 * Gets drift records by status
 *
 * @param status - Drift status
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const activeDrifts = await getDriftRecordsByStatus(DriftStatus.DRIFT_DETECTED);
 * ```
 */
export declare function getDriftRecordsByStatus(status: DriftStatus): Promise<DriftRecord[]>;
/**
 * Creates configuration audit
 *
 * @param data - Audit data
 * @param transaction - Optional database transaction
 * @returns Created audit
 *
 * @example
 * ```typescript
 * const audit = await createConfigurationAudit({
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   auditType: 'compliance',
 *   auditedBy: 'auditor-123',
 *   scheduledDate: new Date('2024-12-01'),
 *   scope: 'Production environment quarterly audit',
 *   checklistItems: ['Verify configuration', 'Check compliance', 'Review changes']
 * });
 * ```
 */
export declare function createConfigurationAudit(data: ConfigurationAuditData, transaction?: Transaction): Promise<ConfigurationAudit>;
/**
 * Starts configuration audit
 *
 * @param auditId - Audit ID
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await startConfigurationAudit('audit-123');
 * ```
 */
export declare function startConfigurationAudit(auditId: string, transaction?: Transaction): Promise<ConfigurationAudit>;
/**
 * Completes configuration audit
 *
 * @param auditId - Audit ID
 * @param findings - Audit findings
 * @param complianceScore - Compliance score
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await completeConfigurationAudit('audit-123', findings, 95.5, 'All items compliant');
 * ```
 */
export declare function completeConfigurationAudit(auditId: string, findings: Record<string, any>[], complianceScore: number, recommendations?: string, transaction?: Transaction): Promise<ConfigurationAudit>;
/**
 * Gets audits by status
 *
 * @param status - Audit status
 * @returns Audits
 *
 * @example
 * ```typescript
 * const scheduled = await getAuditsByStatus(AuditStatus.SCHEDULED);
 * ```
 */
export declare function getAuditsByStatus(status: AuditStatus): Promise<ConfigurationAudit[]>;
/**
 * Gets version history for CI
 *
 * @param ciId - CI identifier
 * @param limit - Maximum records
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('ci-123', 20);
 * ```
 */
export declare function getVersionHistory(ciId: string, limit?: number): Promise<ConfigurationVersionHistory[]>;
/**
 * Compares two versions
 *
 * @param ciId - CI identifier
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Version comparison
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('ci-123', '1.0.0', '2.0.0');
 * ```
 */
export declare function compareVersions(ciId: string, version1: string, version2: string): Promise<{
    differences: any;
    added: string[];
    removed: string[];
    modified: string[];
}>;
declare const _default: {
    ConfigurationItem: typeof ConfigurationItem;
    ConfigurationBaseline: typeof ConfigurationBaseline;
    ChangeRequest: typeof ChangeRequest;
    CIRelationship: typeof CIRelationship;
    ConfigurationSnapshot: typeof ConfigurationSnapshot;
    DriftRecord: typeof DriftRecord;
    ConfigurationAudit: typeof ConfigurationAudit;
    ConfigurationVersionHistory: typeof ConfigurationVersionHistory;
    createConfigurationItem: typeof createConfigurationItem;
    updateConfigurationItem: typeof updateConfigurationItem;
    getConfigurationItem: typeof getConfigurationItem;
    getConfigurationItemsByType: typeof getConfigurationItemsByType;
    getConfigurationItemsByEnvironment: typeof getConfigurationItemsByEnvironment;
    verifyConfigurationItem: typeof verifyConfigurationItem;
    decommissionConfigurationItem: typeof decommissionConfigurationItem;
    createBaseline: typeof createBaseline;
    approveBaseline: typeof approveBaseline;
    activateBaseline: typeof activateBaseline;
    getActiveBaselines: typeof getActiveBaselines;
    compareToBaseline: typeof compareToBaseline;
    createChangeRequest: typeof createChangeRequest;
    submitChangeRequest: typeof submitChangeRequest;
    approveChangeRequest: typeof approveChangeRequest;
    rejectChangeRequest: typeof rejectChangeRequest;
    implementChangeRequest: typeof implementChangeRequest;
    rollbackChangeRequest: typeof rollbackChangeRequest;
    getChangeRequestsByStatus: typeof getChangeRequestsByStatus;
    analyzeChangeImpact: typeof analyzeChangeImpact;
    createCIRelationship: typeof createCIRelationship;
    removeCIRelationship: typeof removeCIRelationship;
    getCIRelationships: typeof getCIRelationships;
    getCIDependencyTree: typeof getCIDependencyTree;
    createConfigurationSnapshot: typeof createConfigurationSnapshot;
    getCISnapshots: typeof getCISnapshots;
    restoreFromSnapshot: typeof restoreFromSnapshot;
    detectConfigurationDrift: typeof detectConfigurationDrift;
    scanForDrift: typeof scanForDrift;
    remediateDrift: typeof remediateDrift;
    getDriftRecordsByStatus: typeof getDriftRecordsByStatus;
    createConfigurationAudit: typeof createConfigurationAudit;
    startConfigurationAudit: typeof startConfigurationAudit;
    completeConfigurationAudit: typeof completeConfigurationAudit;
    getAuditsByStatus: typeof getAuditsByStatus;
    getVersionHistory: typeof getVersionHistory;
    compareVersions: typeof compareVersions;
};
export default _default;
//# sourceMappingURL=asset-configuration-commands.d.ts.map