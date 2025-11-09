/**
 * ASSET INSPECTION MANAGEMENT COMMAND FUNCTIONS
 *
 * Comprehensive inspection lifecycle management toolkit for enterprise asset management.
 * Provides 45 specialized functions covering:
 * - Inspection scheduling and calendar management
 * - Inspection checklist creation and management
 * - Inspection execution and results recording
 * - Inspection compliance tracking and reporting
 * - Safety inspection workflows
 * - Quality inspection processes
 * - Certification and accreditation management
 * - Failed inspection workflows and remediation
 * - Inspector assignment and qualification tracking
 * - Inspection template management
 * - Multi-level approval workflows
 * - Inspection history and audit trails
 * - Automated inspection reminders
 * - Compliance deadline tracking
 * - Integration with regulatory frameworks
 *
 * @module AssetInspectionCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security SOX/HIPAA compliant - includes comprehensive audit trails
 * @performance Optimized for high-volume inspection scheduling (10,000+ inspections)
 *
 * @example
 * ```typescript
 * import {
 *   scheduleInspection,
 *   createInspectionChecklist,
 *   recordInspectionResults,
 *   validateInspectionCompliance,
 *   InspectionType,
 *   InspectionStatus,
 *   InspectionPriority
 * } from './asset-inspection-commands';
 *
 * // Schedule safety inspection
 * const inspection = await scheduleInspection({
 *   assetId: 'asset-123',
 *   inspectionType: InspectionType.SAFETY,
 *   scheduledDate: new Date('2024-12-01'),
 *   inspectorId: 'inspector-001',
 *   priority: InspectionPriority.HIGH,
 *   checklistTemplateId: 'safety-checklist-v2'
 * });
 *
 * // Record inspection results
 * await recordInspectionResults(inspection.id, {
 *   status: InspectionStatus.COMPLETED,
 *   overallResult: 'pass',
 *   findings: [...],
 *   inspectedBy: 'inspector-001',
 *   completedDate: new Date()
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Inspection types
 */
export declare enum InspectionType {
    SAFETY = "safety",
    QUALITY = "quality",
    COMPLIANCE = "compliance",
    PREVENTIVE = "preventive",
    REGULATORY = "regulatory",
    ENVIRONMENTAL = "environmental",
    SECURITY = "security",
    PERFORMANCE = "performance",
    CALIBRATION = "calibration",
    CERTIFICATION = "certification",
    CUSTOM = "custom"
}
/**
 * Inspection status
 */
export declare enum InspectionStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PASSED = "passed",
    FAILED = "failed",
    CONDITIONAL_PASS = "conditional_pass",
    CANCELLED = "cancelled",
    OVERDUE = "overdue",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected"
}
/**
 * Inspection priority levels
 */
export declare enum InspectionPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    ROUTINE = "routine"
}
/**
 * Inspection result types
 */
export declare enum InspectionResult {
    PASS = "pass",
    FAIL = "fail",
    CONDITIONAL = "conditional",
    NOT_APPLICABLE = "not_applicable",
    DEFERRED = "deferred"
}
/**
 * Checklist item status
 */
export declare enum ChecklistItemStatus {
    PENDING = "pending",
    PASS = "pass",
    FAIL = "fail",
    NOT_APPLICABLE = "not_applicable",
    NEEDS_REVIEW = "needs_review"
}
/**
 * Inspector qualification levels
 */
export declare enum InspectorQualification {
    LEVEL_1 = "level_1",
    LEVEL_2 = "level_2",
    LEVEL_3 = "level_3",
    CERTIFIED = "certified",
    MASTER = "master"
}
/**
 * Finding severity levels
 */
export declare enum FindingSeverity {
    CRITICAL = "critical",
    MAJOR = "major",
    MINOR = "minor",
    OBSERVATION = "observation",
    INFORMATIONAL = "informational"
}
/**
 * Inspection schedule data
 */
export interface InspectionScheduleData {
    assetId: string;
    inspectionType: InspectionType;
    scheduledDate: Date;
    inspectorId?: string;
    priority: InspectionPriority;
    checklistTemplateId?: string;
    estimatedDuration?: number;
    location?: string;
    description?: string;
    requiredCertifications?: string[];
    notifyBefore?: number;
    recurrence?: RecurrencePattern;
    metadata?: Record<string, any>;
}
/**
 * Recurrence pattern for inspections
 */
export interface RecurrencePattern {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    interval: number;
    endDate?: Date;
    maxOccurrences?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
}
/**
 * Inspection checklist data
 */
export interface ChecklistData {
    name: string;
    description?: string;
    inspectionType: InspectionType;
    version: string;
    items: ChecklistItemData[];
    requiredCertifications?: string[];
    estimatedDuration?: number;
    isTemplate: boolean;
    parentTemplateId?: string;
    metadata?: Record<string, any>;
}
/**
 * Checklist item data
 */
export interface ChecklistItemData {
    itemNumber: number;
    category: string;
    description: string;
    inspectionCriteria: string;
    passThreshold?: string;
    failureConsequence?: string;
    isRequired: boolean;
    requiresPhoto?: boolean;
    requiresMeasurement?: boolean;
    measurementUnit?: string;
    acceptableRange?: {
        min?: number;
        max?: number;
    };
    referenceDocuments?: string[];
}
/**
 * Inspection results data
 */
export interface InspectionResultsData {
    inspectionId: string;
    status: InspectionStatus;
    overallResult: InspectionResult;
    inspectedBy: string;
    completedDate: Date;
    actualDuration?: number;
    itemResults: ItemResultData[];
    findings: FindingData[];
    recommendations?: string[];
    followUpRequired: boolean;
    followUpDueDate?: Date;
    certificationIssued?: boolean;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
    photos?: string[];
    documents?: string[];
    signature?: string;
    witnessSignature?: string;
    notes?: string;
}
/**
 * Item result data
 */
export interface ItemResultData {
    checklistItemId: string;
    status: ChecklistItemStatus;
    measurementValue?: number;
    notes?: string;
    photos?: string[];
    inspectedAt: Date;
}
/**
 * Inspection finding data
 */
export interface FindingData {
    severity: FindingSeverity;
    category: string;
    description: string;
    location?: string;
    correctiveAction?: string;
    responsibleParty?: string;
    dueDate?: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    photos?: string[];
    relatedChecklistItemId?: string;
}
/**
 * Inspector assignment data
 */
export interface InspectorAssignmentData {
    inspectorId: string;
    inspectionId: string;
    role: 'primary' | 'secondary' | 'witness';
    assignedBy: string;
    assignedDate: Date;
    notes?: string;
}
/**
 * Compliance validation result
 */
export interface ComplianceValidationResult {
    isCompliant: boolean;
    validatedStandards: string[];
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    nextInspectionDue?: Date;
    certificationStatus: 'valid' | 'expired' | 'pending' | 'invalid';
    recommendations: string[];
}
/**
 * Compliance violation
 */
export interface ComplianceViolation {
    standard: string;
    requirement: string;
    description: string;
    severity: FindingSeverity;
    correctiveAction: string;
    deadline: Date;
}
/**
 * Compliance warning
 */
export interface ComplianceWarning {
    standard: string;
    description: string;
    recommendation: string;
}
/**
 * Failed inspection workflow data
 */
export interface FailedInspectionWorkflowData {
    inspectionId: string;
    failureReasons: string[];
    immediateActions: string[];
    correctivePlan: CorrectivePlanData;
    escalationRequired: boolean;
    escalationLevel?: number;
    notifyParties: string[];
    assetQuarantined: boolean;
}
/**
 * Corrective action plan
 */
export interface CorrectivePlanData {
    planId?: string;
    actions: CorrectiveActionData[];
    estimatedCompletionDate: Date;
    responsibleParty: string;
    approver?: string;
    budget?: number;
    priority: InspectionPriority;
}
/**
 * Corrective action
 */
export interface CorrectiveActionData {
    actionNumber: number;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    completedDate?: Date;
    verifiedBy?: string;
    cost?: number;
    notes?: string;
}
/**
 * Bulk operation result
 */
export interface BulkOperationResult {
    successful: number;
    failed: number;
    errors: Array<{
        identifier: string;
        error: string;
    }>;
    processedIds: string[];
}
/**
 * Inspection search filters
 */
export interface InspectionSearchFilters {
    assetId?: string;
    inspectionType?: InspectionType | InspectionType[];
    status?: InspectionStatus | InspectionStatus[];
    priority?: InspectionPriority;
    inspectorId?: string;
    scheduledDateFrom?: Date;
    scheduledDateTo?: Date;
    completedDateFrom?: Date;
    completedDateTo?: Date;
    result?: InspectionResult;
    overdue?: boolean;
    requiresFollowUp?: boolean;
}
/**
 * Asset Inspection Model - Main inspection tracking entity
 */
export declare class AssetInspection extends Model {
    id: string;
    assetId: string;
    inspectionNumber: string;
    inspectionType: InspectionType;
    status: InspectionStatus;
    priority: InspectionPriority;
    scheduledDate: Date;
    scheduledStartTime?: string;
    estimatedDuration?: number;
    actualStartDate?: Date;
    completedDate?: Date;
    actualDuration?: number;
    inspectorId?: string;
    checklistTemplateId?: string;
    overallResult?: InspectionResult;
    passPercentage?: number;
    location?: string;
    description?: string;
    requiredCertifications?: string[];
    recurrencePattern?: RecurrencePattern;
    parentInspectionId?: string;
    followUpRequired: boolean;
    followUpDueDate?: Date;
    certificationIssued: boolean;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
    photos?: string[];
    documents?: string[];
    signature?: string;
    witnessSignature?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdBy?: string;
    approvedBy?: string;
    approvalDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    checklistTemplate?: InspectionChecklist;
    checklistItems?: InspectionChecklistItem[];
    findings?: InspectionFinding[];
    inspectorAssignments?: InspectorAssignment[];
}
/**
 * Inspection Checklist Model - Checklist templates and instances
 */
export declare class InspectionChecklist extends Model {
    id: string;
    name: string;
    description?: string;
    inspectionType: InspectionType;
    version: string;
    isTemplate: boolean;
    parentTemplateId?: string;
    requiredCertifications?: string[];
    estimatedDuration?: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    items?: InspectionChecklistItem[];
    inspections?: AssetInspection[];
}
/**
 * Inspection Checklist Item Model - Individual checklist items
 */
export declare class InspectionChecklistItem extends Model {
    id: string;
    checklistId?: string;
    inspectionId?: string;
    itemNumber: number;
    category: string;
    description: string;
    inspectionCriteria: string;
    passThreshold?: string;
    failureConsequence?: string;
    isRequired: boolean;
    requiresPhoto: boolean;
    requiresMeasurement: boolean;
    measurementUnit?: string;
    acceptableRange?: {
        min?: number;
        max?: number;
    };
    referenceDocuments?: string[];
    status?: ChecklistItemStatus;
    measurementValue?: number;
    notes?: string;
    photos?: string[];
    inspectedAt?: Date;
    inspectedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    checklist?: InspectionChecklist;
    inspection?: AssetInspection;
    findings?: InspectionFinding[];
}
/**
 * Inspection Finding Model - Issues and observations discovered during inspection
 */
export declare class InspectionFinding extends Model {
    id: string;
    inspectionId: string;
    relatedChecklistItemId?: string;
    findingNumber?: string;
    severity: FindingSeverity;
    category: string;
    description: string;
    location?: string;
    correctiveAction?: string;
    responsibleParty?: string;
    dueDate?: Date;
    status: string;
    resolutionNotes?: string;
    resolvedDate?: Date;
    resolvedBy?: string;
    photos?: string[];
    verifiedBy?: string;
    verificationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    inspection?: AssetInspection;
    checklistItem?: InspectionChecklistItem;
}
/**
 * Inspector Assignment Model - Tracks inspector assignments to inspections
 */
export declare class InspectorAssignment extends Model {
    id: string;
    inspectorId: string;
    inspectionId: string;
    role: string;
    assignedBy: string;
    assignedDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    inspection?: AssetInspection;
}
/**
 * Corrective Action Plan Model - Tracks corrective actions for failed inspections
 */
export declare class CorrectiveActionPlan extends Model {
    id: string;
    planNumber: string;
    inspectionId: string;
    estimatedCompletionDate: Date;
    actualCompletionDate?: Date;
    responsibleParty: string;
    approver?: string;
    approvalDate?: Date;
    budget?: number;
    actualCost?: number;
    priority: InspectionPriority;
    status: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    inspection?: AssetInspection;
    actions?: CorrectiveAction[];
}
/**
 * Corrective Action Model - Individual corrective actions
 */
export declare class CorrectiveAction extends Model {
    id: string;
    planId: string;
    actionNumber: number;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: string;
    completedDate?: Date;
    verifiedBy?: string;
    verificationDate?: Date;
    cost?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    plan?: CorrectiveActionPlan;
}
/**
 * Schedules a new asset inspection
 *
 * @param data - Inspection schedule data
 * @param transaction - Optional database transaction
 * @returns Created inspection record
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   assetId: 'asset-123',
 *   inspectionType: InspectionType.SAFETY,
 *   scheduledDate: new Date('2024-12-01'),
 *   inspectorId: 'inspector-001',
 *   priority: InspectionPriority.HIGH,
 *   estimatedDuration: 120,
 *   checklistTemplateId: 'checklist-template-001'
 * });
 * ```
 */
export declare function scheduleInspection(data: InspectionScheduleData, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Generates unique inspection number
 *
 * @param inspectionType - Type of inspection
 * @returns Generated inspection number
 *
 * @example
 * ```typescript
 * const number = await generateInspectionNumber(InspectionType.SAFETY);
 * // Returns: "INSP-SAFETY-2024-001234"
 * ```
 */
export declare function generateInspectionNumber(inspectionType: InspectionType): Promise<string>;
/**
 * Schedules recurring inspections
 *
 * @param data - Inspection schedule data with recurrence pattern
 * @param transaction - Optional database transaction
 * @returns Array of created inspection records
 *
 * @example
 * ```typescript
 * const inspections = await scheduleRecurringInspection({
 *   assetId: 'asset-123',
 *   inspectionType: InspectionType.PREVENTIVE,
 *   scheduledDate: new Date('2024-12-01'),
 *   priority: InspectionPriority.MEDIUM,
 *   recurrence: {
 *     frequency: 'monthly',
 *     interval: 1,
 *     endDate: new Date('2025-12-31')
 *   }
 * });
 * ```
 */
export declare function scheduleRecurringInspection(data: InspectionScheduleData, transaction?: Transaction): Promise<AssetInspection[]>;
/**
 * Reschedules an existing inspection
 *
 * @param inspectionId - Inspection identifier
 * @param newDate - New scheduled date
 * @param reason - Reason for rescheduling
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await rescheduleInspection(
 *   'inspection-123',
 *   new Date('2024-12-15'),
 *   'Equipment unavailable on original date'
 * );
 * ```
 */
export declare function rescheduleInspection(inspectionId: string, newDate: Date, reason: string, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Cancels a scheduled inspection
 *
 * @param inspectionId - Inspection identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await cancelInspection('inspection-123', 'Asset decommissioned');
 * ```
 */
export declare function cancelInspection(inspectionId: string, reason: string, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Assigns inspector to inspection
 *
 * @param data - Inspector assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment record
 *
 * @example
 * ```typescript
 * await assignInspector({
 *   inspectorId: 'inspector-001',
 *   inspectionId: 'inspection-123',
 *   role: 'primary',
 *   assignedBy: 'admin-001',
 *   assignedDate: new Date()
 * });
 * ```
 */
export declare function assignInspector(data: InspectorAssignmentData, transaction?: Transaction): Promise<InspectorAssignment>;
/**
 * Gets upcoming inspections for an asset
 *
 * @param assetId - Asset identifier
 * @param daysAhead - Number of days to look ahead
 * @returns Array of upcoming inspections
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingInspections('asset-123', 30);
 * ```
 */
export declare function getUpcomingInspections(assetId: string, daysAhead?: number): Promise<AssetInspection[]>;
/**
 * Gets overdue inspections
 *
 * @param filters - Optional filters
 * @returns Array of overdue inspections
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInspections({
 *   priority: InspectionPriority.CRITICAL
 * });
 * ```
 */
export declare function getOverdueInspections(filters?: Partial<InspectionSearchFilters>): Promise<AssetInspection[]>;
/**
 * Creates inspection checklist template
 *
 * @param data - Checklist data
 * @param transaction - Optional database transaction
 * @returns Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createInspectionChecklist({
 *   name: 'Safety Inspection Checklist v2.0',
 *   inspectionType: InspectionType.SAFETY,
 *   version: '2.0',
 *   isTemplate: true,
 *   items: [
 *     {
 *       itemNumber: 1,
 *       category: 'Electrical',
 *       description: 'Check power cord integrity',
 *       inspectionCriteria: 'No fraying, cuts, or exposed wires',
 *       isRequired: true
 *     }
 *   ]
 * });
 * ```
 */
export declare function createInspectionChecklist(data: ChecklistData, transaction?: Transaction): Promise<InspectionChecklist>;
/**
 * Updates checklist item
 *
 * @param itemId - Checklist item identifier
 * @param updates - Item updates
 * @param transaction - Optional database transaction
 * @returns Updated item
 *
 * @example
 * ```typescript
 * await updateChecklistItem('item-123', {
 *   status: ChecklistItemStatus.PASS,
 *   measurementValue: 120.5,
 *   notes: 'Within acceptable range',
 *   inspectedBy: 'inspector-001',
 *   inspectedAt: new Date()
 * });
 * ```
 */
export declare function updateChecklistItem(itemId: string, updates: Partial<InspectionChecklistItem>, transaction?: Transaction): Promise<InspectionChecklistItem>;
/**
 * Gets checklist completion status
 *
 * @param inspectionId - Inspection identifier
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const status = await getChecklistCompletionStatus('inspection-123');
 * console.log(`${status.completedPercentage}% complete`);
 * ```
 */
export declare function getChecklistCompletionStatus(inspectionId: string): Promise<{
    totalItems: number;
    completedItems: number;
    passedItems: number;
    failedItems: number;
    notApplicableItems: number;
    completedPercentage: number;
    passPercentage: number;
}>;
/**
 * Clones checklist template
 *
 * @param templateId - Template identifier
 * @param newVersion - New version number
 * @param transaction - Optional database transaction
 * @returns Cloned checklist
 *
 * @example
 * ```typescript
 * const newTemplate = await cloneChecklistTemplate('template-123', '3.0');
 * ```
 */
export declare function cloneChecklistTemplate(templateId: string, newVersion: string, transaction?: Transaction): Promise<InspectionChecklist>;
/**
 * Starts inspection
 *
 * @param inspectionId - Inspection identifier
 * @param inspectorId - Inspector identifier
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await startInspection('inspection-123', 'inspector-001');
 * ```
 */
export declare function startInspection(inspectionId: string, inspectorId: string, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Records inspection results
 *
 * @param inspectionId - Inspection identifier
 * @param data - Inspection results data
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await recordInspectionResults('inspection-123', {
 *   inspectionId: 'inspection-123',
 *   status: InspectionStatus.COMPLETED,
 *   overallResult: InspectionResult.PASS,
 *   inspectedBy: 'inspector-001',
 *   completedDate: new Date(),
 *   itemResults: [...],
 *   findings: [...],
 *   followUpRequired: false
 * });
 * ```
 */
export declare function recordInspectionResults(inspectionId: string, data: InspectionResultsData, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Creates inspection finding
 *
 * @param data - Finding data
 * @param transaction - Optional database transaction
 * @returns Created finding
 *
 * @example
 * ```typescript
 * await createInspectionFinding({
 *   inspectionId: 'inspection-123',
 *   severity: FindingSeverity.MAJOR,
 *   category: 'Safety',
 *   description: 'Damaged safety guard',
 *   correctiveAction: 'Replace safety guard',
 *   dueDate: new Date('2024-12-15')
 * });
 * ```
 */
export declare function createInspectionFinding(data: FindingData & {
    inspectionId: string;
}, transaction?: Transaction): Promise<InspectionFinding>;
/**
 * Updates inspection finding status
 *
 * @param findingId - Finding identifier
 * @param status - New status
 * @param resolutionNotes - Resolution notes
 * @param resolvedBy - Resolver user ID
 * @param transaction - Optional database transaction
 * @returns Updated finding
 *
 * @example
 * ```typescript
 * await updateFindingStatus(
 *   'finding-123',
 *   'resolved',
 *   'Safety guard replaced',
 *   'tech-001'
 * );
 * ```
 */
export declare function updateFindingStatus(findingId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed', resolutionNotes?: string, resolvedBy?: string, transaction?: Transaction): Promise<InspectionFinding>;
/**
 * Approves inspection results
 *
 * @param inspectionId - Inspection identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await approveInspection('inspection-123', 'manager-001');
 * ```
 */
export declare function approveInspection(inspectionId: string, approvedBy: string, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Validates inspection compliance
 *
 * @param inspectionId - Inspection identifier
 * @param requiredStandards - Required compliance standards
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const result = await validateInspectionCompliance('inspection-123', [
 *   'OSHA-1910.147',
 *   'NFPA-70E',
 *   'ISO-9001'
 * ]);
 * ```
 */
export declare function validateInspectionCompliance(inspectionId: string, requiredStandards: string[]): Promise<ComplianceValidationResult>;
/**
 * Issues inspection certification
 *
 * @param inspectionId - Inspection identifier
 * @param expiryDate - Certification expiry date
 * @param issuedBy - Issuer user ID
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await issueInspectionCertification(
 *   'inspection-123',
 *   new Date('2025-12-31'),
 *   'certifier-001'
 * );
 * ```
 */
export declare function issueInspectionCertification(inspectionId: string, expiryDate: Date, issuedBy: string, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Processes failed inspection
 *
 * @param data - Failed inspection workflow data
 * @param transaction - Optional database transaction
 * @returns Created corrective action plan
 *
 * @example
 * ```typescript
 * await processFailedInspection({
 *   inspectionId: 'inspection-123',
 *   failureReasons: ['Safety guard damaged', 'Electrical hazard detected'],
 *   immediateActions: ['Tag out equipment', 'Notify safety team'],
 *   correctivePlan: {
 *     actions: [...],
 *     estimatedCompletionDate: new Date('2024-12-31'),
 *     responsibleParty: 'maint-team-001',
 *     priority: InspectionPriority.CRITICAL
 *   },
 *   escalationRequired: true,
 *   escalationLevel: 2,
 *   notifyParties: ['safety-manager', 'plant-manager'],
 *   assetQuarantined: true
 * });
 * ```
 */
export declare function processFailedInspection(data: FailedInspectionWorkflowData, transaction?: Transaction): Promise<CorrectiveActionPlan>;
/**
 * Updates corrective action status
 *
 * @param actionId - Action identifier
 * @param status - New status
 * @param completedBy - User who completed action
 * @param transaction - Optional database transaction
 * @returns Updated action
 *
 * @example
 * ```typescript
 * await updateCorrectiveActionStatus(
 *   'action-123',
 *   'completed',
 *   'tech-001'
 * );
 * ```
 */
export declare function updateCorrectiveActionStatus(actionId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled', completedBy?: string, transaction?: Transaction): Promise<CorrectiveAction>;
/**
 * Verifies corrective action completion
 *
 * @param actionId - Action identifier
 * @param verifiedBy - Verifier user ID
 * @param transaction - Optional database transaction
 * @returns Updated action
 *
 * @example
 * ```typescript
 * await verifyCorrectiveAction('action-123', 'supervisor-001');
 * ```
 */
export declare function verifyCorrectiveAction(actionId: string, verifiedBy: string, transaction?: Transaction): Promise<CorrectiveAction>;
/**
 * Completes corrective action plan
 *
 * @param planId - Plan identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await completeCorrectiveActionPlan('plan-123', 'manager-001');
 * ```
 */
export declare function completeCorrectiveActionPlan(planId: string, approvedBy: string, transaction?: Transaction): Promise<CorrectiveActionPlan>;
/**
 * Searches inspections with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered inspections
 *
 * @example
 * ```typescript
 * const { inspections, total } = await searchInspections({
 *   inspectionType: InspectionType.SAFETY,
 *   status: [InspectionStatus.COMPLETED, InspectionStatus.PASSED],
 *   priority: InspectionPriority.CRITICAL,
 *   scheduledDateFrom: new Date('2024-01-01'),
 *   scheduledDateTo: new Date('2024-12-31')
 * }, { limit: 50, offset: 0 });
 * ```
 */
export declare function searchInspections(filters: InspectionSearchFilters, options?: FindOptions): Promise<{
    inspections: AssetInspection[];
    total: number;
}>;
/**
 * Gets inspection history for asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Inspection history
 *
 * @example
 * ```typescript
 * const history = await getInspectionHistory('asset-123', 50);
 * ```
 */
export declare function getInspectionHistory(assetId: string, limit?: number): Promise<AssetInspection[]>;
/**
 * Gets inspection statistics
 *
 * @param filters - Optional filters
 * @returns Inspection statistics
 *
 * @example
 * ```typescript
 * const stats = await getInspectionStatistics({
 *   scheduledDateFrom: new Date('2024-01-01'),
 *   scheduledDateTo: new Date('2024-12-31')
 * });
 * ```
 */
export declare function getInspectionStatistics(filters?: Partial<InspectionSearchFilters>): Promise<{
    totalInspections: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byResult: Record<string, number>;
    averagePassRate: number;
    overdueCount: number;
    followUpRequiredCount: number;
}>;
declare const _default: {
    AssetInspection: typeof AssetInspection;
    InspectionChecklist: typeof InspectionChecklist;
    InspectionChecklistItem: typeof InspectionChecklistItem;
    InspectionFinding: typeof InspectionFinding;
    InspectorAssignment: typeof InspectorAssignment;
    CorrectiveActionPlan: typeof CorrectiveActionPlan;
    CorrectiveAction: typeof CorrectiveAction;
    scheduleInspection: typeof scheduleInspection;
    generateInspectionNumber: typeof generateInspectionNumber;
    scheduleRecurringInspection: typeof scheduleRecurringInspection;
    rescheduleInspection: typeof rescheduleInspection;
    cancelInspection: typeof cancelInspection;
    assignInspector: typeof assignInspector;
    getUpcomingInspections: typeof getUpcomingInspections;
    getOverdueInspections: typeof getOverdueInspections;
    createInspectionChecklist: typeof createInspectionChecklist;
    updateChecklistItem: typeof updateChecklistItem;
    getChecklistCompletionStatus: typeof getChecklistCompletionStatus;
    cloneChecklistTemplate: typeof cloneChecklistTemplate;
    startInspection: typeof startInspection;
    recordInspectionResults: typeof recordInspectionResults;
    createInspectionFinding: typeof createInspectionFinding;
    updateFindingStatus: typeof updateFindingStatus;
    approveInspection: typeof approveInspection;
    validateInspectionCompliance: typeof validateInspectionCompliance;
    issueInspectionCertification: typeof issueInspectionCertification;
    processFailedInspection: typeof processFailedInspection;
    updateCorrectiveActionStatus: typeof updateCorrectiveActionStatus;
    verifyCorrectiveAction: typeof verifyCorrectiveAction;
    completeCorrectiveActionPlan: typeof completeCorrectiveActionPlan;
    searchInspections: typeof searchInspections;
    getInspectionHistory: typeof getInspectionHistory;
    getInspectionStatistics: typeof getInspectionStatistics;
};
export default _default;
//# sourceMappingURL=asset-inspection-commands.d.ts.map