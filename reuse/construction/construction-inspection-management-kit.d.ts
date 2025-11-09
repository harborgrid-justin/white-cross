/**
 * LOC: CONST-IM-001
 * File: /reuse/construction/construction-inspection-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Construction quality management systems
 *   - Inspection scheduling services
 *   - Compliance and code verification modules
 */
import { ConstructionInspection } from './models/construction-inspection.model';
import { InspectionDeficiency } from './models/inspection-deficiency.model';
import { InspectionChecklistItem } from './models/inspection-checklist-item.model';
import { InspectionType, InspectionStatus, InspectionResult, InspectorType } from './types/inspection.types';
import { ScheduleInspectionDto } from './dto/schedule-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { CreateDeficiencyDto } from './dto/create-deficiency.dto';
import { ResolveDeficiencyDto } from './dto/resolve-deficiency.dto';
import { VerifyDeficiencyDto } from './dto/verify-deficiency.dto';
/**
 * Schedules a new construction inspection
 *
 * @param request - Inspection schedule request
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   inspectionType: InspectionType.FOUNDATION,
 *   projectId: 'project-123',
 *   location: 'Building A, Grid 1-5',
 *   scheduledDate: new Date('2025-01-15T09:00:00'),
 *   requestedBy: 'user-456'
 * });
 * ```
 */
export declare function scheduleInspection(request: InspectionScheduleRequest): Promise<ConstructionInspection>;
/**
 * Generates a unique inspection number
 *
 * @param type - Inspection type
 * @param projectId - Project identifier
 * @returns Formatted inspection number
 *
 * @example
 * ```typescript
 * const inspNumber = generateInspectionNumber(InspectionType.FOUNDATION, 'PRJ-001');
 * // Returns: "INS-PRJ001-FND-001"
 * ```
 */
export declare function generateInspectionNumber(type: InspectionType, projectId: string): string;
/**
 * Reschedules an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param newDate - New scheduled date
 * @param reason - Reschedule reason
 * @param userId - User rescheduling
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await rescheduleInspection('insp-123', new Date('2025-01-16T10:00:00'), 'Site not ready', 'user-456');
 * ```
 */
export declare function rescheduleInspection(inspectionId: string, newDate: Date, reason: string, userId: string): Promise<ConstructionInspection>;
/**
 * Cancels an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param reason - Cancellation reason
 * @param userId - User cancelling
 *
 * @example
 * ```typescript
 * await cancelInspection('insp-123', 'Work not complete', 'user-456');
 * ```
 */
export declare function cancelInspection(inspectionId: string, reason: string, userId: string): Promise<void>;
/**
 * Assigns inspector to inspection
 *
 * @param inspectionId - Inspection identifier
 * @param inspectorId - Inspector user ID
 * @param inspectorType - Type of inspector
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await assignInspector('insp-123', 'inspector-456', InspectorType.MUNICIPAL);
 * ```
 */
export declare function assignInspector(inspectionId: string, inspectorId: string, inspectorType: InspectorType): Promise<ConstructionInspection>;
/**
 * Gets inspector availability for scheduling
 *
 * @param inspectorId - Inspector identifier
 * @param startDate - Start date for availability check
 * @param endDate - End date for availability check
 * @returns Inspector availability
 *
 * @example
 * ```typescript
 * const availability = await getInspectorAvailability('inspector-123', startDate, endDate);
 * ```
 */
export declare function getInspectorAvailability(inspectorId: string, startDate: Date, endDate: Date): Promise<InspectorAvailability>;
/**
 * Starts an inspection
 *
 * @param inspectionId - Inspection identifier
 * @param inspectorId - Inspector starting the inspection
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await startInspection('insp-123', 'inspector-456');
 * ```
 */
export declare function startInspection(inspectionId: string, inspectorId: string): Promise<ConstructionInspection>;
/**
 * Completes an inspection with results
 *
 * @param inspectionId - Inspection identifier
 * @param result - Inspection result
 * @param comments - Inspector comments
 * @param attachments - Attachment URLs
 * @param inspectorId - Inspector completing the inspection
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await completeInspection('insp-123', InspectionResult.PASS, 'All items compliant', [], 'inspector-456');
 * ```
 */
export declare function completeInspection(inspectionId: string, result: InspectionResult, comments: string, attachments: string[], inspectorId: string): Promise<ConstructionInspection>;
/**
 * Searches inspections with filters
 *
 * @param filters - Search filters
 * @returns Filtered inspections
 *
 * @example
 * ```typescript
 * const inspections = await searchInspections({
 *   projectId: 'project-123',
 *   status: InspectionStatus.SCHEDULED
 * });
 * ```
 */
export declare function searchInspections(filters: InspectionFilter): Promise<ConstructionInspection[]>;
/**
 * Creates inspection checklist items from template
 *
 * @param inspectionId - Inspection identifier
 * @param templateId - Checklist template ID
 * @returns Created checklist items
 *
 * @example
 * ```typescript
 * const items = await createChecklistFromTemplate('insp-123', 'template-foundation');
 * ```
 */
export declare function createChecklistFromTemplate(inspectionId: string, templateId: string): Promise<InspectionChecklistItem[]>;
/**
 * Updates checklist item status
 *
 * @param itemId - Checklist item ID
 * @param isCompliant - Compliance status
 * @param notes - Inspector notes
 * @param photos - Photo URLs
 * @param inspectorId - Inspector updating item
 * @returns Updated item
 *
 * @example
 * ```typescript
 * await updateChecklistItem('item-123', true, 'Meets code requirements', [], 'inspector-456');
 * ```
 */
export declare function updateChecklistItem(itemId: string, isCompliant: boolean, notes: string, photos: string[], inspectorId: string): Promise<InspectionChecklistItem>;
/**
 * Marks checklist item as not applicable
 *
 * @param itemId - Checklist item ID
 * @param reason - Reason for N/A
 * @param inspectorId - Inspector marking N/A
 *
 * @example
 * ```typescript
 * await markChecklistItemNA('item-123', 'Not in scope for this phase', 'inspector-456');
 * ```
 */
export declare function markChecklistItemNA(itemId: string, reason: string, inspectorId: string): Promise<void>;
/**
 * Gets checklist completion status
 *
 * @param inspectionId - Inspection identifier
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const status = await getChecklistCompletionStatus('insp-123');
 * ```
 */
export declare function getChecklistCompletionStatus(inspectionId: string): Promise<{
    total: number;
    completed: number;
    compliant: number;
    nonCompliant: number;
    notApplicable: number;
}>;
/**
 * Creates a deficiency from inspection
 *
 * @param deficiencyData - Deficiency data
 * @param userId - User creating deficiency
 * @returns Created deficiency
 *
 * @example
 * ```typescript
 * const deficiency = await createDeficiency({
 *   inspectionId: 'insp-123',
 *   title: 'Improper rebar spacing',
 *   description: 'Rebar spacing exceeds code requirements in Grid A-3',
 *   severity: DeficiencySeverity.MAJOR,
 *   location: 'Foundation, Grid A-3',
 *   codeReference: 'ACI 318-19 Section 7.6'
 * }, 'inspector-456');
 * ```
 */
export declare function createDeficiency(deficiencyData: Omit<InspectionDeficiency, 'id' | 'deficiencyNumber' | 'status' | 'createdAt' | 'updatedAt'>, userId: string): Promise<InspectionDeficiency>;
/**
 * Generates a unique deficiency number
 *
 * @param inspectionNumber - Parent inspection number
 * @returns Formatted deficiency number
 *
 * @example
 * ```typescript
 * const defNumber = generateDeficiencyNumber('INS-PRJ001-FND-001');
 * // Returns: "DEF-INS-PRJ001-FND-001-001"
 * ```
 */
export declare function generateDeficiencyNumber(inspectionNumber: string): string;
/**
 * Assigns deficiency to contractor or team
 *
 * @param deficiencyId - Deficiency identifier
 * @param assignedTo - User/team ID to assign to
 * @param dueDate - Due date for resolution
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await assignDeficiency('def-123', 'contractor-456', new Date('2025-01-20'));
 * ```
 */
export declare function assignDeficiency(deficiencyId: string, assignedTo: string, dueDate: Date): Promise<InspectionDeficiency>;
/**
 * Marks deficiency as resolved
 *
 * @param deficiencyId - Deficiency identifier
 * @param resolutionNotes - Resolution description
 * @param photos - Photo URLs of resolution
 * @param userId - User resolving deficiency
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await resolveDeficiency('def-123', 'Corrected rebar spacing per code', ['photo1.jpg'], 'contractor-456');
 * ```
 */
export declare function resolveDeficiency(deficiencyId: string, resolutionNotes: string, photos: string[], userId: string): Promise<InspectionDeficiency>;
/**
 * Verifies deficiency resolution
 *
 * @param deficiencyId - Deficiency identifier
 * @param verificationNotes - Verification notes
 * @param approved - Whether resolution is approved
 * @param inspectorId - Inspector verifying
 * @returns Updated deficiency
 *
 * @example
 * ```typescript
 * await verifyDeficiency('def-123', 'Resolution meets code requirements', true, 'inspector-456');
 * ```
 */
export declare function verifyDeficiency(deficiencyId: string, verificationNotes: string, approved: boolean, inspectorId: string): Promise<InspectionDeficiency>;
/**
 * Gets open deficiencies for project
 *
 * @param projectId - Project identifier
 * @returns Open deficiencies
 *
 * @example
 * ```typescript
 * const openDeficiencies = await getOpenDeficiencies('project-123');
 * ```
 */
export declare function getOpenDeficiencies(projectId: string): Promise<InspectionDeficiency[]>;
/**
 * Gets critical deficiencies requiring immediate attention
 *
 * @param projectId - Project identifier
 * @returns Critical deficiencies
 *
 * @example
 * ```typescript
 * const critical = await getCriticalDeficiencies('project-123');
 * ```
 */
export declare function getCriticalDeficiencies(projectId: string): Promise<InspectionDeficiency[]>;
/**
 * Gets overdue deficiencies
 *
 * @param projectId - Project identifier
 * @returns Overdue deficiencies
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueDeficiencies('project-123');
 * ```
 */
export declare function getOverdueDeficiencies(projectId: string): Promise<InspectionDeficiency[]>;
/**
 * Requests third-party inspection
 *
 * @param inspectionType - Type of inspection
 * @param projectId - Project identifier
 * @param location - Inspection location
 * @param preferredDate - Preferred inspection date
 * @param requestedBy - User requesting inspection
 * @returns Created inspection request
 *
 * @example
 * ```typescript
 * const request = await requestThirdPartyInspection(
 *   InspectionType.THIRD_PARTY,
 *   'project-123',
 *   'Building A, Foundation',
 *   new Date('2025-01-20'),
 *   'user-456'
 * );
 * ```
 */
export declare function requestThirdPartyInspection(inspectionType: InspectionType, projectId: string, location: string, preferredDate: Date, requestedBy: string): Promise<ConstructionInspection>;
/**
 * Uploads third-party inspection report
 *
 * @param inspectionId - Inspection identifier
 * @param reportUrl - Report file URL
 * @param summary - Report summary
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await uploadThirdPartyReport('insp-123', 'https://storage/report.pdf', 'All items pass inspection');
 * ```
 */
export declare function uploadThirdPartyReport(inspectionId: string, reportUrl: string, summary: string): Promise<ConstructionInspection>;
/**
 * Validates code compliance for inspection
 *
 * @param inspectionId - Inspection identifier
 * @returns Compliance validation results
 *
 * @example
 * ```typescript
 * const validation = await validateCodeCompliance('insp-123');
 * ```
 */
export declare function validateCodeCompliance(inspectionId: string): Promise<{
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Links inspection to permit
 *
 * @param inspectionId - Inspection identifier
 * @param permitId - Permit identifier
 *
 * @example
 * ```typescript
 * await linkInspectionToPermit('insp-123', 'permit-456');
 * ```
 */
export declare function linkInspectionToPermit(inspectionId: string, permitId: string): Promise<void>;
/**
 * Gets inspections for permit
 *
 * @param permitId - Permit identifier
 * @returns Inspections linked to permit
 *
 * @example
 * ```typescript
 * const inspections = await getInspectionsByPermit('permit-123');
 * ```
 */
export declare function getInspectionsByPermit(permitId: string): Promise<ConstructionInspection[]>;
/**
 * Gets inspection statistics for project
 *
 * @param projectId - Project identifier
 * @returns Inspection statistics
 *
 * @example
 * ```typescript
 * const stats = await getInspectionStatistics('project-123');
 * ```
 */
export declare function getInspectionStatistics(projectId: string): Promise<InspectionStatistics>;
/**
 * Generates deficiency trend report
 *
 * @param projectId - Project identifier
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Deficiency trends
 *
 * @example
 * ```typescript
 * const trends = await generateDeficiencyTrendReport('project-123', startDate, endDate);
 * ```
 */
export declare function generateDeficiencyTrendReport(projectId: string, startDate: Date, endDate: Date): Promise<DeficiencyTrend[]>;
/**
 * Generates inspection pass rate report
 *
 * @param projectId - Project identifier
 * @returns Pass rate by inspection type
 *
 * @example
 * ```typescript
 * const passRates = await generateInspectionPassRateReport('project-123');
 * ```
 */
export declare function generateInspectionPassRateReport(projectId: string): Promise<Record<InspectionType, number>>;
/**
 * Construction Inspection Management Controller
 * Provides RESTful API endpoints for inspection operations
 */
export declare class ConstructionInspectionController {
    /**
     * Schedule a new inspection
     */
    schedule(scheduleDto: ScheduleInspectionDto): Promise<ConstructionInspection>;
    /**
     * Search inspections
     */
    search(projectId?: string, inspectionType?: InspectionType, status?: InspectionStatus): Promise<ConstructionInspection[]>;
    /**
     * Get inspection by ID
     */
    findOne(id: string): Promise<any>;
    /**
     * Update inspection
     */
    update(id: string, updateDto: UpdateInspectionDto): Promise<any>;
    /**
     * Start inspection
     */
    start(id: string): Promise<ConstructionInspection>;
    /**
     * Complete inspection
     */
    complete(id: string, completeDto: CompleteInspectionDto): Promise<ConstructionInspection>;
    /**
     * Create deficiency
     */
    createDeficiencyEndpoint(deficiencyDto: CreateDeficiencyDto): Promise<InspectionDeficiency>;
    /**
     * Resolve deficiency
     */
    resolveDeficiencyEndpoint(id: string, resolveDto: ResolveDeficiencyDto): Promise<InspectionDeficiency>;
    /**
     * Verify deficiency
     */
    verifyDeficiencyEndpoint(id: string, verifyDto: VerifyDeficiencyDto): Promise<InspectionDeficiency>;
    /**
     * Get open deficiencies
     */
    getOpenDeficienciesEndpoint(projectId: string): Promise<InspectionDeficiency[]>;
    /**
     * Get project statistics
     */
    getStatistics(projectId: string): Promise<InspectionStatistics>;
    /**
     * Validate code compliance
     */
    validateCompliance(id: string): Promise<{
        isCompliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
}
declare const _default: {
    scheduleInspection: typeof scheduleInspection;
    generateInspectionNumber: typeof generateInspectionNumber;
    rescheduleInspection: typeof rescheduleInspection;
    cancelInspection: typeof cancelInspection;
    assignInspector: typeof assignInspector;
    getInspectorAvailability: typeof getInspectorAvailability;
    startInspection: typeof startInspection;
    completeInspection: typeof completeInspection;
    searchInspections: typeof searchInspections;
    createChecklistFromTemplate: typeof createChecklistFromTemplate;
    updateChecklistItem: typeof updateChecklistItem;
    markChecklistItemNA: typeof markChecklistItemNA;
    getChecklistCompletionStatus: typeof getChecklistCompletionStatus;
    createDeficiency: typeof createDeficiency;
    generateDeficiencyNumber: typeof generateDeficiencyNumber;
    assignDeficiency: typeof assignDeficiency;
    resolveDeficiency: typeof resolveDeficiency;
    verifyDeficiency: typeof verifyDeficiency;
    getOpenDeficiencies: typeof getOpenDeficiencies;
    getCriticalDeficiencies: typeof getCriticalDeficiencies;
    getOverdueDeficiencies: typeof getOverdueDeficiencies;
    requestThirdPartyInspection: typeof requestThirdPartyInspection;
    uploadThirdPartyReport: typeof uploadThirdPartyReport;
    validateCodeCompliance: typeof validateCodeCompliance;
    linkInspectionToPermit: typeof linkInspectionToPermit;
    getInspectionsByPermit: typeof getInspectionsByPermit;
    getInspectionStatistics: typeof getInspectionStatistics;
    generateDeficiencyTrendReport: typeof generateDeficiencyTrendReport;
    generateInspectionPassRateReport: typeof generateInspectionPassRateReport;
    ConstructionInspection: typeof ConstructionInspection;
    InspectionDeficiency: typeof InspectionDeficiency;
    InspectionChecklistItem: typeof InspectionChecklistItem;
    ConstructionInspectionController: typeof ConstructionInspectionController;
};
export default _default;
//# sourceMappingURL=construction-inspection-management-kit.d.ts.map