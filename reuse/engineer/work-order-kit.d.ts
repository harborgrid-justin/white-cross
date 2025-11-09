/**
 * WORK ORDER MANAGEMENT KIT
 *
 * Comprehensive work order management system for maintenance, repairs, and service requests.
 * Provides 45 specialized functions covering:
 * - Work order creation and initialization
 * - Priority and urgency classification
 * - Assignment and routing logic
 * - Status tracking and workflow management
 * - Time and labor tracking
 * - Material requisition and usage
 * - Work order completion and sign-off
 * - Preventive maintenance scheduling
 * - Recurring work order templates
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant audit logging
 *
 * @module WorkOrderKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all operations are audited and logged
 * @example
 * ```typescript
 * import {
 *   createWorkOrder,
 *   assignWorkOrder,
 *   trackLaborTime,
 *   completeWorkOrder
 * } from './work-order-kit';
 *
 * // Create a new work order
 * const workOrder = await createWorkOrder({
 *   title: 'HVAC System Repair',
 *   priority: 'high',
 *   facilityId: 'facility-123',
 *   requestedBy: 'user-456'
 * });
 *
 * // Assign to technician
 * await assignWorkOrder(workOrder.id, {
 *   assignedTo: 'tech-789',
 *   estimatedHours: 4
 * });
 * ```
 */
/**
 * Work order priority levels
 */
export declare enum WorkOrderPriority {
    EMERGENCY = "emergency",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    ROUTINE = "routine"
}
/**
 * Work order status values
 */
export declare enum WorkOrderStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    VERIFIED = "verified",
    CANCELLED = "cancelled",
    CLOSED = "closed"
}
/**
 * Work order types
 */
export declare enum WorkOrderType {
    CORRECTIVE = "corrective",
    PREVENTIVE = "preventive",
    INSPECTION = "inspection",
    EMERGENCY = "emergency",
    PROJECT = "project",
    SAFETY = "safety",
    COMPLIANCE = "compliance"
}
/**
 * Recurrence patterns for preventive maintenance
 */
export declare enum RecurrencePattern {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMIANNUAL = "semiannual",
    ANNUAL = "annual"
}
/**
 * Labor time entry types
 */
export declare enum LaborTimeType {
    REGULAR = "regular",
    OVERTIME = "overtime",
    WEEKEND = "weekend",
    HOLIDAY = "holiday",
    EMERGENCY = "emergency"
}
/**
 * Work order interface
 */
export interface WorkOrder {
    id: string;
    workOrderNumber: string;
    title: string;
    description: string;
    type: WorkOrderType;
    priority: WorkOrderPriority;
    status: WorkOrderStatus;
    facilityId: string;
    locationId?: string;
    assetId?: string;
    requestedBy: string;
    assignedTo?: string;
    assignedTeam?: string;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    estimatedCost?: number;
    actualCost?: number;
    dueDate?: Date;
    completedDate?: Date;
    verifiedDate?: Date;
    verifiedBy?: string;
    notes?: string;
    attachments?: string[];
    tags?: string[];
    parentWorkOrderId?: string;
    templateId?: string;
    recurrencePattern?: RecurrencePattern;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Labor time entry interface
 */
export interface LaborTimeEntry {
    id: string;
    workOrderId: string;
    technicianId: string;
    technicianName: string;
    startTime: Date;
    endTime: Date;
    hours: number;
    timeType: LaborTimeType;
    hourlyRate: number;
    totalCost: number;
    description?: string;
    billable: boolean;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
}
/**
 * Material requisition interface
 */
export interface MaterialRequisition {
    id: string;
    workOrderId: string;
    materialId: string;
    materialName: string;
    quantity: number;
    unitOfMeasure: string;
    unitCost: number;
    totalCost: number;
    requestedBy: string;
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    issuedBy?: string;
    issuedAt?: Date;
    status: 'pending' | 'approved' | 'issued' | 'cancelled';
    notes?: string;
}
/**
 * Work order template interface
 */
export interface WorkOrderTemplate {
    id: string;
    name: string;
    description: string;
    type: WorkOrderType;
    priority: WorkOrderPriority;
    estimatedHours: number;
    taskList: WorkOrderTask[];
    requiredSkills: string[];
    requiredMaterials: TemplateMaterial[];
    recurrencePattern?: RecurrencePattern;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Work order task interface
 */
export interface WorkOrderTask {
    id: string;
    workOrderId: string;
    sequence: number;
    title: string;
    description: string;
    estimatedMinutes: number;
    actualMinutes?: number;
    completedBy?: string;
    completedAt?: Date;
    isCompleted: boolean;
    isMandatory: boolean;
    requiresSignOff: boolean;
    signedOffBy?: string;
    signedOffAt?: Date;
}
/**
 * Template material interface
 */
export interface TemplateMaterial {
    materialId: string;
    materialName: string;
    quantity: number;
    unitOfMeasure: string;
    isOptional: boolean;
}
/**
 * Work order completion data
 */
export interface WorkOrderCompletion {
    completionNotes: string;
    actualHours: number;
    completionDate: Date;
    requiresFollowUp: boolean;
    followUpNotes?: string;
    attachments?: string[];
    signatureData?: string;
    verificationChecklist?: Record<string, boolean>;
}
/**
 * Work order assignment data
 */
export interface WorkOrderAssignment {
    assignedTo?: string;
    assignedTeam?: string;
    estimatedHours: number;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    assignmentNotes?: string;
    requiredSkills?: string[];
}
/**
 * Work order metrics interface
 */
export interface WorkOrderMetrics {
    totalWorkOrders: number;
    openWorkOrders: number;
    completedWorkOrders: number;
    averageCompletionTime: number;
    averageCost: number;
    onTimeCompletion: number;
    overdueCount: number;
    emergencyCount: number;
    preventiveMaintenanceCompliance: number;
}
/**
 * Create work order DTO
 */
export declare class CreateWorkOrderDto {
    title: string;
    description: string;
    type: WorkOrderType;
    priority: WorkOrderPriority;
    facilityId: string;
    locationId?: string;
    assetId?: string;
    requestedBy: string;
    dueDate?: Date;
    estimatedHours?: number;
    notes?: string;
    tags?: string[];
}
/**
 * Update work order DTO
 */
export declare class UpdateWorkOrderDto {
    title?: string;
    description?: string;
    priority?: WorkOrderPriority;
    status?: WorkOrderStatus;
    dueDate?: Date;
    notes?: string;
}
/**
 * Assign work order DTO
 */
export declare class AssignWorkOrderDto {
    assignedTo?: string;
    assignedTeam?: string;
    estimatedHours: number;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    assignmentNotes?: string;
}
/**
 * Labor time entry DTO
 */
export declare class CreateLaborTimeDto {
    workOrderId: string;
    technicianId: string;
    startTime: Date;
    endTime: Date;
    timeType: LaborTimeType;
    description?: string;
    billable: boolean;
}
/**
 * Material requisition DTO
 */
export declare class CreateMaterialRequisitionDto {
    workOrderId: string;
    materialId: string;
    quantity: number;
    notes?: string;
}
/**
 * Complete work order DTO
 */
export declare class CompleteWorkOrderDto {
    completionNotes: string;
    actualHours: number;
    requiresFollowUp: boolean;
    followUpNotes?: string;
    attachments?: string[];
}
/**
 * Creates a new work order with auto-generated work order number
 *
 * @param data - Work order creation data
 * @param userId - User creating the work order
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const workOrder = await createWorkOrder({
 *   title: 'Replace HVAC Filter',
 *   type: WorkOrderType.PREVENTIVE,
 *   priority: WorkOrderPriority.MEDIUM,
 *   facilityId: 'facility-123'
 * }, 'user-456');
 * ```
 */
export declare function createWorkOrder(data: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'status' | 'createdAt' | 'updatedAt'>, userId: string): Promise<WorkOrder>;
/**
 * Generates a unique work order number based on type and facility
 *
 * @param type - Work order type
 * @param facilityId - Facility identifier
 * @returns Formatted work order number
 *
 * @example
 * ```typescript
 * const woNumber = generateWorkOrderNumber(WorkOrderType.PREVENTIVE, 'FAC-001');
 * // Returns: "WO-PM-FAC001-20250108-001"
 * ```
 */
export declare function generateWorkOrderNumber(type: WorkOrderType, facilityId: string): string;
/**
 * Creates a work order from a template
 *
 * @param templateId - Template identifier
 * @param overrides - Override template values
 * @param userId - User creating the work order
 * @returns Created work order with template data
 *
 * @example
 * ```typescript
 * const workOrder = await createWorkOrderFromTemplate(
 *   'template-123',
 *   { facilityId: 'facility-456', dueDate: new Date() },
 *   'user-789'
 * );
 * ```
 */
export declare function createWorkOrderFromTemplate(templateId: string, overrides: Partial<WorkOrder>, userId: string): Promise<WorkOrder>;
/**
 * Submits a draft work order for processing
 *
 * @param workOrderId - Work order identifier
 * @param submittedBy - User submitting the work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * const submitted = await submitWorkOrder('wo-123', 'user-456');
 * ```
 */
export declare function submitWorkOrder(workOrderId: string, submittedBy: string): Promise<WorkOrder>;
/**
 * Initializes recurring work orders from template
 *
 * @param templateId - Template identifier
 * @param startDate - Start date for recurrence
 * @param endDate - End date for recurrence
 * @param userId - User initializing recurrence
 * @returns Array of created work orders
 *
 * @example
 * ```typescript
 * const workOrders = await initializeRecurringWorkOrders(
 *   'template-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31'),
 *   'user-456'
 * );
 * ```
 */
export declare function initializeRecurringWorkOrders(templateId: string, startDate: Date, endDate: Date, userId: string): Promise<WorkOrder[]>;
/**
 * Calculates work order priority based on multiple factors
 *
 * @param factors - Priority calculation factors
 * @returns Calculated priority level
 *
 * @example
 * ```typescript
 * const priority = calculateWorkOrderPriority({
 *   isSafetyIssue: true,
 *   impactLevel: 'high',
 *   downtime: true,
 *   patientImpact: true
 * });
 * // Returns: WorkOrderPriority.EMERGENCY
 * ```
 */
export declare function calculateWorkOrderPriority(factors: {
    isSafetyIssue?: boolean;
    isEmergency?: boolean;
    impactLevel?: 'critical' | 'high' | 'medium' | 'low';
    downtime?: boolean;
    patientImpact?: boolean;
    regulatoryRequirement?: boolean;
    assetCriticality?: number;
}): WorkOrderPriority;
/**
 * Escalates work order priority based on age and status
 *
 * @param workOrder - Work order to evaluate
 * @returns Updated priority if escalation is needed
 *
 * @example
 * ```typescript
 * const newPriority = escalateWorkOrderPriority(workOrder);
 * if (newPriority !== workOrder.priority) {
 *   await updateWorkOrderPriority(workOrder.id, newPriority);
 * }
 * ```
 */
export declare function escalateWorkOrderPriority(workOrder: WorkOrder): WorkOrderPriority;
/**
 * Gets work orders requiring priority escalation
 *
 * @param workOrders - Array of work orders to check
 * @returns Work orders needing escalation
 *
 * @example
 * ```typescript
 * const needsEscalation = getWorkOrdersNeedingEscalation(allWorkOrders);
 * for (const wo of needsEscalation) {
 *   await escalateAndNotify(wo);
 * }
 * ```
 */
export declare function getWorkOrdersNeedingEscalation(workOrders: WorkOrder[]): WorkOrder[];
/**
 * Prioritizes work order queue based on multiple criteria
 *
 * @param workOrders - Work orders to prioritize
 * @returns Sorted array by priority
 *
 * @example
 * ```typescript
 * const prioritizedQueue = prioritizeWorkOrderQueue(pendingWorkOrders);
 * ```
 */
export declare function prioritizeWorkOrderQueue(workOrders: WorkOrder[]): WorkOrder[];
/**
 * Assigns work order to technician or team
 *
 * @param workOrderId - Work order identifier
 * @param assignment - Assignment details
 * @param assignedBy - User making the assignment
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * const assigned = await assignWorkOrder('wo-123', {
 *   assignedTo: 'tech-456',
 *   estimatedHours: 4,
 *   scheduledStartDate: new Date()
 * }, 'manager-789');
 * ```
 */
export declare function assignWorkOrder(workOrderId: string, assignment: WorkOrderAssignment, assignedBy: string): Promise<WorkOrder>;
/**
 * Automatically routes work order to best available technician
 *
 * @param workOrderId - Work order identifier
 * @param criteria - Routing criteria
 * @returns Assigned technician information
 *
 * @example
 * ```typescript
 * const assignment = await autoRouteWorkOrder('wo-123', {
 *   requiredSkills: ['HVAC', 'Electrical'],
 *   preferredShift: 'day',
 *   maxDistance: 50
 * });
 * ```
 */
export declare function autoRouteWorkOrder(workOrderId: string, criteria: {
    requiredSkills?: string[];
    preferredShift?: 'day' | 'night' | 'any';
    maxDistance?: number;
    preferredTeam?: string;
}): Promise<{
    technicianId: string;
    estimatedArrival: Date;
    confidence: number;
}>;
/**
 * Reassigns work order to different technician
 *
 * @param workOrderId - Work order identifier
 * @param newAssignee - New technician ID
 * @param reason - Reassignment reason
 * @param reassignedBy - User making the reassignment
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await reassignWorkOrder('wo-123', 'tech-new', 'Original tech unavailable', 'supervisor-456');
 * ```
 */
export declare function reassignWorkOrder(workOrderId: string, newAssignee: string, reason: string, reassignedBy: string): Promise<WorkOrder>;
/**
 * Schedules work order for specific date and time
 *
 * @param workOrderId - Work order identifier
 * @param schedule - Scheduling details
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await scheduleWorkOrder('wo-123', {
 *   startDate: new Date('2025-01-15T08:00:00'),
 *   endDate: new Date('2025-01-15T12:00:00'),
 *   notes: 'Coordinate with facility manager'
 * });
 * ```
 */
export declare function scheduleWorkOrder(workOrderId: string, schedule: {
    startDate: Date;
    endDate: Date;
    notes?: string;
}): Promise<WorkOrder>;
/**
 * Optimizes work order schedule for maximum efficiency
 *
 * @param workOrders - Work orders to schedule
 * @param constraints - Scheduling constraints
 * @returns Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = optimizeWorkOrderSchedule(workOrders, {
 *   availableTechnicians: ['tech-1', 'tech-2'],
 *   timeWindow: { start: new Date(), end: new Date(Date.now() + 7*24*60*60*1000) }
 * });
 * ```
 */
export declare function optimizeWorkOrderSchedule(workOrders: WorkOrder[], constraints: {
    availableTechnicians?: string[];
    timeWindow?: {
        start: Date;
        end: Date;
    };
    maxHoursPerDay?: number;
}): Array<{
    workOrderId: string;
    assignedTo: string;
    scheduledStart: Date;
    scheduledEnd: Date;
}>;
/**
 * Updates work order status with validation
 *
 * @param workOrderId - Work order identifier
 * @param newStatus - New status
 * @param userId - User updating status
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await updateWorkOrderStatus('wo-123', WorkOrderStatus.IN_PROGRESS, 'tech-456');
 * ```
 */
export declare function updateWorkOrderStatus(workOrderId: string, newStatus: WorkOrderStatus, userId: string): Promise<WorkOrder>;
/**
 * Validates work order status transition
 *
 * @param currentStatus - Current status
 * @param newStatus - Proposed new status
 * @throws Error if transition is invalid
 *
 * @example
 * ```typescript
 * validateStatusTransition(WorkOrderStatus.DRAFT, WorkOrderStatus.COMPLETED); // Throws error
 * validateStatusTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS); // OK
 * ```
 */
export declare function validateStatusTransition(currentStatus: WorkOrderStatus, newStatus: WorkOrderStatus): void;
/**
 * Gets work order status history
 *
 * @param workOrderId - Work order identifier
 * @returns Status change history
 *
 * @example
 * ```typescript
 * const history = await getWorkOrderStatusHistory('wo-123');
 * ```
 */
export declare function getWorkOrderStatusHistory(workOrderId: string): Promise<Array<{
    status: WorkOrderStatus;
    timestamp: Date;
    userId: string;
}>>;
/**
 * Holds work order with reason
 *
 * @param workOrderId - Work order identifier
 * @param reason - Reason for hold
 * @param userId - User placing hold
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await holdWorkOrder('wo-123', 'Awaiting parts delivery', 'tech-456');
 * ```
 */
export declare function holdWorkOrder(workOrderId: string, reason: string, userId: string): Promise<WorkOrder>;
/**
 * Resumes held work order
 *
 * @param workOrderId - Work order identifier
 * @param userId - User resuming work
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await resumeWorkOrder('wo-123', 'tech-456');
 * ```
 */
export declare function resumeWorkOrder(workOrderId: string, userId: string): Promise<WorkOrder>;
/**
 * Tracks labor time for work order
 *
 * @param entry - Labor time entry data
 * @returns Created labor time entry
 *
 * @example
 * ```typescript
 * const timeEntry = await trackLaborTime({
 *   workOrderId: 'wo-123',
 *   technicianId: 'tech-456',
 *   startTime: new Date('2025-01-08T08:00:00'),
 *   endTime: new Date('2025-01-08T12:00:00'),
 *   timeType: LaborTimeType.REGULAR,
 *   billable: true
 * });
 * ```
 */
export declare function trackLaborTime(entry: Omit<LaborTimeEntry, 'id' | 'hours' | 'totalCost' | 'approved' | 'createdAt' | 'technicianName'>): Promise<LaborTimeEntry>;
/**
 * Calculates total labor hours for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total labor hours
 *
 * @example
 * ```typescript
 * const totalHours = await calculateTotalLaborHours('wo-123');
 * ```
 */
export declare function calculateTotalLaborHours(workOrderId: string): Promise<number>;
/**
 * Calculates total labor cost for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total labor cost
 *
 * @example
 * ```typescript
 * const totalCost = await calculateTotalLaborCost('wo-123');
 * ```
 */
export declare function calculateTotalLaborCost(workOrderId: string): Promise<number>;
/**
 * Approves labor time entry
 *
 * @param entryId - Labor entry identifier
 * @param approvedBy - User approving the entry
 * @returns Updated labor entry
 *
 * @example
 * ```typescript
 * await approveLaborTime('entry-123', 'supervisor-456');
 * ```
 */
export declare function approveLaborTime(entryId: string, approvedBy: string): Promise<LaborTimeEntry>;
/**
 * Gets labor time entries for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Array of labor time entries
 *
 * @example
 * ```typescript
 * const entries = await getLaborTimeEntries('wo-123');
 * ```
 */
export declare function getLaborTimeEntries(workOrderId: string): Promise<LaborTimeEntry[]>;
/**
 * Calculates overtime hours for technician
 *
 * @param technicianId - Technician identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Overtime hours breakdown
 *
 * @example
 * ```typescript
 * const overtime = await calculateOvertimeHours('tech-123', startDate, endDate);
 * ```
 */
export declare function calculateOvertimeHours(technicianId: string, startDate: Date, endDate: Date): Promise<{
    regular: number;
    overtime: number;
    weekend: number;
    holiday: number;
}>;
/**
 * Creates material requisition for work order
 *
 * @param requisition - Requisition data
 * @returns Created material requisition
 *
 * @example
 * ```typescript
 * const req = await createMaterialRequisition({
 *   workOrderId: 'wo-123',
 *   materialId: 'mat-456',
 *   materialName: 'HVAC Filter',
 *   quantity: 2,
 *   unitOfMeasure: 'each',
 *   unitCost: 45.00,
 *   requestedBy: 'tech-789'
 * });
 * ```
 */
export declare function createMaterialRequisition(requisition: Omit<MaterialRequisition, 'id' | 'totalCost' | 'requestedAt' | 'status'>): Promise<MaterialRequisition>;
/**
 * Approves material requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approvedBy - User approving requisition
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await approveMaterialRequisition('req-123', 'supervisor-456');
 * ```
 */
export declare function approveMaterialRequisition(requisitionId: string, approvedBy: string): Promise<MaterialRequisition>;
/**
 * Issues materials from requisition
 *
 * @param requisitionId - Requisition identifier
 * @param issuedBy - User issuing materials
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await issueMaterials('req-123', 'warehouse-456');
 * ```
 */
export declare function issueMaterials(requisitionId: string, issuedBy: string): Promise<MaterialRequisition>;
/**
 * Calculates total material cost for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total material cost
 *
 * @example
 * ```typescript
 * const materialCost = await calculateTotalMaterialCost('wo-123');
 * ```
 */
export declare function calculateTotalMaterialCost(workOrderId: string): Promise<number>;
/**
 * Gets material requisitions for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Array of material requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await getMaterialRequisitionsForWorkOrder('wo-123');
 * ```
 */
export declare function getMaterialRequisitionsForWorkOrder(workOrderId: string): Promise<MaterialRequisition[]>;
/**
 * Completes work order with required information
 *
 * @param workOrderId - Work order identifier
 * @param completion - Completion data
 * @param userId - User completing work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await completeWorkOrder('wo-123', {
 *   completionNotes: 'Replaced HVAC filter, system running normally',
 *   actualHours: 2.5,
 *   completionDate: new Date(),
 *   requiresFollowUp: false
 * }, 'tech-456');
 * ```
 */
export declare function completeWorkOrder(workOrderId: string, completion: WorkOrderCompletion, userId: string): Promise<WorkOrder>;
/**
 * Verifies completed work order
 *
 * @param workOrderId - Work order identifier
 * @param verificationData - Verification details
 * @param verifiedBy - User verifying work
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await verifyWorkOrder('wo-123', {
 *   notes: 'Work verified, system operational',
 *   checklist: { safety: true, quality: true, cleanup: true }
 * }, 'supervisor-456');
 * ```
 */
export declare function verifyWorkOrder(workOrderId: string, verificationData: {
    notes: string;
    checklist?: Record<string, boolean>;
}, verifiedBy: string): Promise<WorkOrder>;
/**
 * Closes verified work order
 *
 * @param workOrderId - Work order identifier
 * @param userId - User closing work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await closeWorkOrder('wo-123', 'admin-456');
 * ```
 */
export declare function closeWorkOrder(workOrderId: string, userId: string): Promise<WorkOrder>;
/**
 * Cancels work order with reason
 *
 * @param workOrderId - Work order identifier
 * @param reason - Cancellation reason
 * @param userId - User cancelling work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await cancelWorkOrder('wo-123', 'Duplicate request', 'admin-456');
 * ```
 */
export declare function cancelWorkOrder(workOrderId: string, reason: string, userId: string): Promise<WorkOrder>;
/**
 * Creates preventive maintenance schedule
 *
 * @param schedule - Schedule configuration
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPreventiveMaintenanceSchedule({
 *   assetId: 'asset-123',
 *   templateId: 'template-456',
 *   recurrencePattern: RecurrencePattern.MONTHLY,
 *   startDate: new Date()
 * });
 * ```
 */
export declare function createPreventiveMaintenanceSchedule(schedule: {
    assetId: string;
    templateId: string;
    recurrencePattern: RecurrencePattern;
    startDate: Date;
    endDate?: Date;
}): Promise<{
    scheduleId: string;
    workOrders: WorkOrder[];
}>;
/**
 * Calculates preventive maintenance compliance
 *
 * @param assetId - Asset identifier
 * @param period - Evaluation period
 * @returns Compliance percentage
 *
 * @example
 * ```typescript
 * const compliance = await calculatePMCompliance('asset-123', {
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * });
 * ```
 */
export declare function calculatePMCompliance(assetId: string, period: {
    startDate: Date;
    endDate: Date;
}): Promise<number>;
/**
 * Gets overdue preventive maintenance work orders
 *
 * @param facilityId - Facility identifier
 * @returns Array of overdue PM work orders
 *
 * @example
 * ```typescript
 * const overdue = await getOverduePMWorkOrders('facility-123');
 * ```
 */
export declare function getOverduePMWorkOrders(facilityId: string): Promise<WorkOrder[]>;
/**
 * Work Order Management Controller
 * Provides RESTful API endpoints for work order operations
 */
export declare class WorkOrderController {
    /**
     * Create a new work order
     */
    create(createDto: CreateWorkOrderDto): Promise<WorkOrder>;
    /**
     * Get all work orders with filtering
     */
    findAll(status?: WorkOrderStatus, priority?: WorkOrderPriority, facilityId?: string): Promise<never[]>;
    /**
     * Get work order by ID
     */
    findOne(id: string): Promise<WorkOrder>;
    /**
     * Update work order
     */
    update(id: string, updateDto: UpdateWorkOrderDto): Promise<{
        updatedAt: Date;
        title: string;
        description: string;
        priority: WorkOrderPriority;
        status: WorkOrderStatus;
        dueDate?: Date;
        notes?: string;
        id: string;
        workOrderNumber: string;
        type: WorkOrderType;
        facilityId: string;
        locationId?: string;
        assetId?: string;
        requestedBy: string;
        assignedTo?: string;
        assignedTeam?: string;
        scheduledStartDate?: Date;
        scheduledEndDate?: Date;
        actualStartDate?: Date;
        actualEndDate?: Date;
        estimatedHours?: number;
        actualHours?: number;
        estimatedCost?: number;
        actualCost?: number;
        completedDate?: Date;
        verifiedDate?: Date;
        verifiedBy?: string;
        attachments?: string[];
        tags?: string[];
        parentWorkOrderId?: string;
        templateId?: string;
        recurrencePattern?: RecurrencePattern;
        createdAt: Date;
        createdBy: string;
        updatedBy?: string;
        metadata?: Record<string, any>;
    }>;
    /**
     * Assign work order
     */
    assign(id: string, assignDto: AssignWorkOrderDto): Promise<WorkOrder>;
    /**
     * Complete work order
     */
    complete(id: string, completeDto: CompleteWorkOrderDto): Promise<WorkOrder>;
    /**
     * Add labor time entry
     */
    addLabor(id: string, laborDto: CreateLaborTimeDto): Promise<LaborTimeEntry>;
    /**
     * Add material requisition
     */
    addMaterial(id: string, materialDto: CreateMaterialRequisitionDto): Promise<MaterialRequisition>;
}
declare const _default: {
    createWorkOrder: typeof createWorkOrder;
    generateWorkOrderNumber: typeof generateWorkOrderNumber;
    createWorkOrderFromTemplate: typeof createWorkOrderFromTemplate;
    submitWorkOrder: typeof submitWorkOrder;
    initializeRecurringWorkOrders: typeof initializeRecurringWorkOrders;
    calculateWorkOrderPriority: typeof calculateWorkOrderPriority;
    escalateWorkOrderPriority: typeof escalateWorkOrderPriority;
    getWorkOrdersNeedingEscalation: typeof getWorkOrdersNeedingEscalation;
    prioritizeWorkOrderQueue: typeof prioritizeWorkOrderQueue;
    assignWorkOrder: typeof assignWorkOrder;
    autoRouteWorkOrder: typeof autoRouteWorkOrder;
    reassignWorkOrder: typeof reassignWorkOrder;
    scheduleWorkOrder: typeof scheduleWorkOrder;
    optimizeWorkOrderSchedule: typeof optimizeWorkOrderSchedule;
    updateWorkOrderStatus: typeof updateWorkOrderStatus;
    validateStatusTransition: typeof validateStatusTransition;
    getWorkOrderStatusHistory: typeof getWorkOrderStatusHistory;
    holdWorkOrder: typeof holdWorkOrder;
    resumeWorkOrder: typeof resumeWorkOrder;
    trackLaborTime: typeof trackLaborTime;
    calculateTotalLaborHours: typeof calculateTotalLaborHours;
    calculateTotalLaborCost: typeof calculateTotalLaborCost;
    approveLaborTime: typeof approveLaborTime;
    calculateOvertimeHours: typeof calculateOvertimeHours;
    createMaterialRequisition: typeof createMaterialRequisition;
    approveMaterialRequisition: typeof approveMaterialRequisition;
    issueMaterials: typeof issueMaterials;
    calculateTotalMaterialCost: typeof calculateTotalMaterialCost;
    completeWorkOrder: typeof completeWorkOrder;
    verifyWorkOrder: typeof verifyWorkOrder;
    closeWorkOrder: typeof closeWorkOrder;
    cancelWorkOrder: typeof cancelWorkOrder;
    createPreventiveMaintenanceSchedule: typeof createPreventiveMaintenanceSchedule;
    calculatePMCompliance: typeof calculatePMCompliance;
    getOverduePMWorkOrders: typeof getOverduePMWorkOrders;
    WorkOrderController: typeof WorkOrderController;
};
export default _default;
//# sourceMappingURL=work-order-kit.d.ts.map