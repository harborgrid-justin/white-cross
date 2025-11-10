/**
 * ASSET MAINTENANCE COMMAND FUNCTIONS
 *
 * Enterprise-grade asset maintenance management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Preventive maintenance scheduling and execution
 * - Corrective maintenance workflows
 * - Maintenance request management
 * - Work order generation and tracking
 * - Technician assignment and dispatch
 * - Parts inventory and procurement
 * - Maintenance history tracking
 * - Downtime tracking and analysis
 * - PM schedule optimization
 * - Equipment reliability metrics
 *
 * @module AssetMaintenanceCommands
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
 *   createMaintenanceRequest,
 *   createWorkOrder,
 *   schedulePreventiveMaintenance,
 *   assignTechnician,
 *   MaintenanceRequest,
 *   WorkOrderStatus
 * } from './asset-maintenance-commands';
 *
 * // Create maintenance request
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Machine making unusual noise',
 *   requestedBy: 'user-456'
 * });
 *
 * // Create work order from request
 * const workOrder = await createWorkOrder({
 *   maintenanceRequestId: request.id,
 *   assignedTechnicianId: 'tech-789',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Maintenance type
 */
export declare enum MaintenanceType {
    PREVENTIVE = "preventive",
    PREDICTIVE = "predictive",
    CORRECTIVE = "corrective",
    EMERGENCY = "emergency",
    ROUTINE = "routine",
    BREAKDOWN = "breakdown"
}
/**
 * Maintenance priority
 */
export declare enum MaintenancePriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Work order status
 */
export declare enum WorkOrderStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    PENDING_PARTS = "pending_parts"
}
/**
 * Request status
 */
export declare enum RequestStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    WORK_ORDER_CREATED = "work_order_created",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * PM schedule frequency
 */
export declare enum ScheduleFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual",
    ANNUAL = "annual",
    BI_ANNUAL = "bi_annual",
    METER_BASED = "meter_based",
    CONDITION_BASED = "condition_based"
}
/**
 * Part status
 */
export declare enum PartStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    ISSUED = "issued",
    ON_ORDER = "on_order",
    OUT_OF_STOCK = "out_of_stock"
}
/**
 * Downtime category
 */
export declare enum DowntimeCategory {
    PLANNED = "planned",
    UNPLANNED = "unplanned",
    EMERGENCY = "emergency"
}
/**
 * Failure mode
 */
export declare enum FailureMode {
    MECHANICAL = "mechanical",
    ELECTRICAL = "electrical",
    ELECTRONIC = "electronic",
    SOFTWARE = "software",
    OPERATOR_ERROR = "operator_error",
    ENVIRONMENTAL = "environmental",
    WEAR_AND_TEAR = "wear_and_tear",
    MATERIAL_DEFECT = "material_defect"
}
/**
 * Maintenance request data
 */
export interface MaintenanceRequestData {
    assetId: string;
    requestType: MaintenanceType;
    priority: MaintenancePriority;
    description: string;
    requestedBy: string;
    departmentId?: string;
    locationId?: string;
    symptoms?: string[];
    attachments?: string[];
    requestedCompletionDate?: Date;
}
/**
 * Work order data
 */
export interface WorkOrderData {
    maintenanceRequestId?: string;
    assetId: string;
    maintenanceType: MaintenanceType;
    priority: MaintenancePriority;
    description: string;
    assignedTechnicianId?: string;
    scheduledStartDate: Date;
    scheduledEndDate?: Date;
    estimatedDuration?: number;
    instructions?: string;
    safetyRequirements?: string[];
    requiredParts?: PartRequirement[];
    requiredTools?: string[];
}
/**
 * Part requirement
 */
export interface PartRequirement {
    partId: string;
    partNumber: string;
    description: string;
    quantity: number;
    unitCost?: number;
    available?: boolean;
}
/**
 * Work order completion data
 */
export interface WorkOrderCompletionData {
    workOrderId: string;
    completedBy: string;
    completionDate: Date;
    actualDuration: number;
    workPerformed: string;
    partsUsed?: PartUsage[];
    findings?: string;
    recommendations?: string;
    followUpRequired: boolean;
    followUpNotes?: string;
}
/**
 * Part usage
 */
export interface PartUsage {
    partId: string;
    quantityUsed: number;
    laborHours?: number;
    notes?: string;
}
/**
 * PM schedule data
 */
export interface PMScheduleData {
    assetId: string;
    scheduleType: MaintenanceType;
    frequency: ScheduleFrequency;
    frequencyValue?: number;
    meterBasedTrigger?: number;
    description: string;
    tasks: MaintenanceTask[];
    estimatedDuration: number;
    requiredSkills?: string[];
    requiredParts?: PartRequirement[];
    startDate: Date;
    endDate?: Date;
}
/**
 * Maintenance task
 */
export interface MaintenanceTask {
    sequence: number;
    description: string;
    estimatedDuration: number;
    safetyNotes?: string;
    qualityCheckpoints?: string[];
}
/**
 * Downtime record data
 */
export interface DowntimeRecordData {
    assetId: string;
    category: DowntimeCategory;
    startTime: Date;
    endTime?: Date;
    reason: string;
    failureMode?: FailureMode;
    impactedOperations?: string[];
    workOrderId?: string;
    estimatedLoss?: number;
}
/**
 * Technician assignment data
 */
export interface TechnicianAssignmentData {
    workOrderId: string;
    technicianId: string;
    assignedDate: Date;
    primaryTechnician: boolean;
    estimatedHours?: number;
    skillsRequired?: string[];
}
/**
 * Part reservation data
 */
export interface PartReservationData {
    workOrderId: string;
    partId: string;
    quantity: number;
    reservedBy: string;
    requiredBy: Date;
}
/**
 * Maintenance Request Model
 */
export declare class MaintenanceRequest extends Model {
    id: string;
    requestNumber: string;
    assetId: string;
    requestType: MaintenanceType;
    status: RequestStatus;
    priority: MaintenancePriority;
    description: string;
    requestedBy: string;
    departmentId?: string;
    locationId?: string;
    symptoms?: string[];
    attachments?: string[];
    requestedCompletionDate?: Date;
    approvedBy?: string;
    approvalDate?: Date;
    rejectionReason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    workOrders?: WorkOrder[];
    static generateRequestNumber(instance: MaintenanceRequest): Promise<void>;
}
/**
 * Work Order Model
 */
export declare class WorkOrder extends Model {
    id: string;
    workOrderNumber: string;
    maintenanceRequestId?: string;
    assetId: string;
    maintenanceType: MaintenanceType;
    status: WorkOrderStatus;
    priority: MaintenancePriority;
    description: string;
    assignedTechnicianId?: string;
    scheduledStartDate: Date;
    scheduledEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    instructions?: string;
    safetyRequirements?: string[];
    requiredParts?: PartRequirement[];
    requiredTools?: string[];
    workPerformed?: string;
    partsUsed?: PartUsage[];
    laborHours?: number;
    findings?: string;
    recommendations?: string;
    followUpRequired: boolean;
    followUpNotes?: string;
    completedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    maintenanceRequest?: MaintenanceRequest;
    technicianAssignments?: TechnicianAssignment[];
    partReservations?: PartReservation[];
    static generateWorkOrderNumber(instance: WorkOrder): Promise<void>;
}
/**
 * PM Schedule Model
 */
export declare class PMSchedule extends Model {
    id: string;
    assetId: string;
    scheduleType: MaintenanceType;
    frequency: ScheduleFrequency;
    frequencyValue?: number;
    meterBasedTrigger?: number;
    description: string;
    tasks: MaintenanceTask[];
    estimatedDuration: number;
    requiredSkills?: string[];
    requiredParts?: PartRequirement[];
    startDate: Date;
    endDate?: Date;
    lastPerformedDate?: Date;
    nextDueDate?: Date;
    isActive: boolean;
    totalExecutions: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Technician Assignment Model
 */
export declare class TechnicianAssignment extends Model {
    id: string;
    workOrderId: string;
    technicianId: string;
    assignedDate: Date;
    primaryTechnician: boolean;
    estimatedHours?: number;
    actualHours?: number;
    skillsRequired?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    workOrder?: WorkOrder;
}
/**
 * Part Inventory Model
 */
export declare class PartInventory extends Model {
    id: string;
    partNumber: string;
    description: string;
    category?: string;
    manufacturer?: string;
    status: PartStatus;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
    reorderPoint?: number;
    reorderQuantity?: number;
    unitCost?: number;
    locationId?: string;
    binLocation?: string;
    isCritical: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    reservations?: PartReservation[];
}
/**
 * Part Reservation Model
 */
export declare class PartReservation extends Model {
    id: string;
    workOrderId: string;
    partId: string;
    quantityReserved: number;
    quantityIssued: number;
    status: string;
    reservedBy: string;
    requiredBy: Date;
    issuedBy?: string;
    issuedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    workOrder?: WorkOrder;
    part?: PartInventory;
}
/**
 * Downtime Record Model
 */
export declare class DowntimeRecord extends Model {
    id: string;
    assetId: string;
    category: DowntimeCategory;
    startTime: Date;
    endTime?: Date;
    durationMinutes?: number;
    reason: string;
    failureMode?: FailureMode;
    impactedOperations?: string[];
    workOrderId?: string;
    estimatedLoss?: number;
    rootCause?: string;
    correctiveActions?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Maintenance History Model
 */
export declare class MaintenanceHistory extends Model {
    id: string;
    assetId: string;
    workOrderId: string;
    maintenanceType: MaintenanceType;
    maintenanceDate: Date;
    performedBy: string;
    workDescription: string;
    laborHours: number;
    partsCost?: number;
    laborCost?: number;
    totalCost?: number;
    assetMeterReading?: number;
    followUpRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a maintenance request
 *
 * @param data - Maintenance request data
 * @param transaction - Optional database transaction
 * @returns Created maintenance request
 *
 * @example
 * ```typescript
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Motor overheating',
 *   requestedBy: 'user-456',
 *   symptoms: ['unusual noise', 'excessive heat']
 * });
 * ```
 */
export declare function createMaintenanceRequest(data: MaintenanceRequestData, transaction?: Transaction): Promise<MaintenanceRequest>;
/**
 * Approves maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await approveMaintenanceRequest('req-123', 'manager-456');
 * ```
 */
export declare function approveMaintenanceRequest(requestId: string, approverId: string, transaction?: Transaction): Promise<MaintenanceRequest>;
/**
 * Rejects maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await rejectMaintenanceRequest('req-123', 'manager-456', 'Duplicate request');
 * ```
 */
export declare function rejectMaintenanceRequest(requestId: string, approverId: string, reason: string, transaction?: Transaction): Promise<MaintenanceRequest>;
/**
 * Gets maintenance requests by status
 *
 * @param status - Request status
 * @param options - Query options
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const pending = await getMaintenanceRequestsByStatus(RequestStatus.SUBMITTED);
 * ```
 */
export declare function getMaintenanceRequestsByStatus(status: RequestStatus, options?: FindOptions): Promise<MaintenanceRequest[]>;
/**
 * Gets maintenance requests by asset
 *
 * @param assetId - Asset identifier
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const requests = await getMaintenanceRequestsByAsset('asset-123');
 * ```
 */
export declare function getMaintenanceRequestsByAsset(assetId: string): Promise<MaintenanceRequest[]>;
/**
 * Creates a work order
 *
 * @param data - Work order data
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await createWorkOrder({
 *   assetId: 'asset-123',
 *   maintenanceType: MaintenanceType.PREVENTIVE,
 *   priority: MaintenancePriority.MEDIUM,
 *   description: 'Monthly PM inspection',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */
export declare function createWorkOrder(data: WorkOrderData, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Assigns work order to technician
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * await assignTechnician({
 *   workOrderId: 'wo-123',
 *   technicianId: 'tech-456',
 *   assignedDate: new Date(),
 *   primaryTechnician: true,
 *   estimatedHours: 2.5
 * });
 * ```
 */
export declare function assignTechnician(data: TechnicianAssignmentData, transaction?: Transaction): Promise<TechnicianAssignment>;
/**
 * Starts work order execution
 *
 * @param workOrderId - Work order identifier
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await startWorkOrder('wo-123');
 * ```
 */
export declare function startWorkOrder(workOrderId: string, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Completes work order
 *
 * @param data - Completion data
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await completeWorkOrder({
 *   workOrderId: 'wo-123',
 *   completedBy: 'tech-456',
 *   completionDate: new Date(),
 *   actualDuration: 135,
 *   workPerformed: 'Replaced bearings and lubricated',
 *   partsUsed: [{ partId: 'part-1', quantityUsed: 2 }],
 *   followUpRequired: false
 * });
 * ```
 */
export declare function completeWorkOrder(data: WorkOrderCompletionData, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Puts work order on hold
 *
 * @param workOrderId - Work order identifier
 * @param reason - Hold reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await putWorkOrderOnHold('wo-123', 'Waiting for parts delivery');
 * ```
 */
export declare function putWorkOrderOnHold(workOrderId: string, reason: string, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Cancels work order
 *
 * @param workOrderId - Work order identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await cancelWorkOrder('wo-123', 'Asset no longer in service');
 * ```
 */
export declare function cancelWorkOrder(workOrderId: string, reason: string, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Gets work orders by status
 *
 * @param status - Work order status
 * @param options - Query options
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const inProgress = await getWorkOrdersByStatus(WorkOrderStatus.IN_PROGRESS);
 * ```
 */
export declare function getWorkOrdersByStatus(status: WorkOrderStatus, options?: FindOptions): Promise<WorkOrder[]>;
/**
 * Gets work orders by technician
 *
 * @param technicianId - Technician identifier
 * @param activeOnly - Filter for active work orders only
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const myWorkOrders = await getWorkOrdersByTechnician('tech-123', true);
 * ```
 */
export declare function getWorkOrdersByTechnician(technicianId: string, activeOnly?: boolean): Promise<WorkOrder[]>;
/**
 * Gets work orders by asset
 *
 * @param assetId - Asset identifier
 * @returns Work order history
 *
 * @example
 * ```typescript
 * const history = await getWorkOrdersByAsset('asset-123');
 * ```
 */
export declare function getWorkOrdersByAsset(assetId: string): Promise<WorkOrder[]>;
/**
 * Creates PM schedule
 *
 * @param data - PM schedule data
 * @param transaction - Optional database transaction
 * @returns Created PM schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPMSchedule({
 *   assetId: 'asset-123',
 *   scheduleType: MaintenanceType.PREVENTIVE,
 *   frequency: ScheduleFrequency.MONTHLY,
 *   description: 'Monthly inspection',
 *   tasks: [{
 *     sequence: 1,
 *     description: 'Check oil levels',
 *     estimatedDuration: 15
 *   }],
 *   estimatedDuration: 60,
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function createPMSchedule(data: PMScheduleData, transaction?: Transaction): Promise<PMSchedule>;
/**
 * Generates work order from PM schedule
 *
 * @param scheduleId - PM schedule identifier
 * @param scheduledDate - Scheduled execution date
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await generateWorkOrderFromPM('schedule-123', new Date('2024-06-01'));
 * ```
 */
export declare function generateWorkOrderFromPM(scheduleId: string, scheduledDate: Date, transaction?: Transaction): Promise<WorkOrder>;
/**
 * Gets due PM schedules
 *
 * @param daysAhead - Days to look ahead
 * @returns Due PM schedules
 *
 * @example
 * ```typescript
 * const due = await getDuePMSchedules(7); // Next 7 days
 * ```
 */
export declare function getDuePMSchedules(daysAhead?: number): Promise<PMSchedule[]>;
/**
 * Updates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updatePMSchedule('schedule-123', {
 *   frequency: ScheduleFrequency.QUARTERLY,
 *   estimatedDuration: 90
 * });
 * ```
 */
export declare function updatePMSchedule(scheduleId: string, updates: Partial<PMSchedule>, transaction?: Transaction): Promise<PMSchedule>;
/**
 * Deactivates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deactivatePMSchedule('schedule-123');
 * ```
 */
export declare function deactivatePMSchedule(scheduleId: string, transaction?: Transaction): Promise<PMSchedule>;
/**
 * Gets PM schedules by asset
 *
 * @param assetId - Asset identifier
 * @param activeOnly - Filter for active schedules only
 * @returns PM schedules
 *
 * @example
 * ```typescript
 * const schedules = await getPMSchedulesByAsset('asset-123', true);
 * ```
 */
export declare function getPMSchedulesByAsset(assetId: string, activeOnly?: boolean): Promise<PMSchedule[]>;
/**
 * Reserves parts for work order
 *
 * @param data - Part reservation data
 * @param transaction - Optional database transaction
 * @returns Created reservation
 *
 * @example
 * ```typescript
 * await reservePart({
 *   workOrderId: 'wo-123',
 *   partId: 'part-456',
 *   quantity: 2,
 *   reservedBy: 'planner-789',
 *   requiredBy: new Date('2024-06-01')
 * });
 * ```
 */
export declare function reservePart(data: PartReservationData, transaction?: Transaction): Promise<PartReservation>;
/**
 * Issues reserved parts
 *
 * @param reservationId - Reservation identifier
 * @param issuedBy - User issuing parts
 * @param quantityIssued - Quantity to issue
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await issueReservedParts('res-123', 'storekeeper-456', 2);
 * ```
 */
export declare function issueReservedParts(reservationId: string, issuedBy: string, quantityIssued: number, transaction?: Transaction): Promise<PartReservation>;
/**
 * Cancels part reservation
 *
 * @param reservationId - Reservation identifier
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await cancelPartReservation('res-123');
 * ```
 */
export declare function cancelPartReservation(reservationId: string, transaction?: Transaction): Promise<PartReservation>;
/**
 * Gets parts below reorder point
 *
 * @returns Parts needing reorder
 *
 * @example
 * ```typescript
 * const lowStock = await getPartsNeedingReorder();
 * ```
 */
export declare function getPartsNeedingReorder(): Promise<PartInventory[]>;
/**
 * Creates downtime record
 *
 * @param data - Downtime data
 * @param transaction - Optional database transaction
 * @returns Created downtime record
 *
 * @example
 * ```typescript
 * const downtime = await createDowntimeRecord({
 *   assetId: 'asset-123',
 *   category: DowntimeCategory.UNPLANNED,
 *   startTime: new Date(),
 *   reason: 'Bearing failure',
 *   failureMode: FailureMode.MECHANICAL
 * });
 * ```
 */
export declare function createDowntimeRecord(data: DowntimeRecordData, transaction?: Transaction): Promise<DowntimeRecord>;
/**
 * Ends downtime
 *
 * @param downtimeId - Downtime record identifier
 * @param transaction - Optional database transaction
 * @returns Updated downtime record
 *
 * @example
 * ```typescript
 * await endDowntime('downtime-123');
 * ```
 */
export declare function endDowntime(downtimeId: string, transaction?: Transaction): Promise<DowntimeRecord>;
/**
 * Gets downtime by asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime records
 *
 * @example
 * ```typescript
 * const downtime = await getDowntimeByAsset(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getDowntimeByAsset(assetId: string, startDate?: Date, endDate?: Date): Promise<DowntimeRecord[]>;
/**
 * Calculates downtime metrics
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateDowntimeMetrics(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateDowntimeMetrics(assetId: string, startDate: Date, endDate: Date): Promise<{
    totalDowntime: number;
    plannedDowntime: number;
    unplannedDowntime: number;
    emergencyDowntime: number;
    mtbf: number;
    mttr: number;
}>;
/**
 * Gets maintenance history for asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory('asset-123', 50);
 * ```
 */
export declare function getMaintenanceHistory(assetId: string, limit?: number): Promise<MaintenanceHistory[]>;
/**
 * Calculates maintenance costs
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateMaintenanceCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateMaintenanceCosts(assetId: string, startDate: Date, endDate: Date): Promise<{
    totalCost: number;
    laborCost: number;
    partsCost: number;
    byMaintenanceType: Record<MaintenanceType, number>;
}>;
declare const _default: {
    MaintenanceRequest: typeof MaintenanceRequest;
    WorkOrder: typeof WorkOrder;
    PMSchedule: typeof PMSchedule;
    TechnicianAssignment: typeof TechnicianAssignment;
    PartInventory: typeof PartInventory;
    PartReservation: typeof PartReservation;
    DowntimeRecord: typeof DowntimeRecord;
    MaintenanceHistory: typeof MaintenanceHistory;
    createMaintenanceRequest: typeof createMaintenanceRequest;
    approveMaintenanceRequest: typeof approveMaintenanceRequest;
    rejectMaintenanceRequest: typeof rejectMaintenanceRequest;
    getMaintenanceRequestsByStatus: typeof getMaintenanceRequestsByStatus;
    getMaintenanceRequestsByAsset: typeof getMaintenanceRequestsByAsset;
    createWorkOrder: typeof createWorkOrder;
    assignTechnician: typeof assignTechnician;
    startWorkOrder: typeof startWorkOrder;
    completeWorkOrder: typeof completeWorkOrder;
    putWorkOrderOnHold: typeof putWorkOrderOnHold;
    cancelWorkOrder: typeof cancelWorkOrder;
    getWorkOrdersByStatus: typeof getWorkOrdersByStatus;
    getWorkOrdersByTechnician: typeof getWorkOrdersByTechnician;
    getWorkOrdersByAsset: typeof getWorkOrdersByAsset;
    createPMSchedule: typeof createPMSchedule;
    generateWorkOrderFromPM: typeof generateWorkOrderFromPM;
    getDuePMSchedules: typeof getDuePMSchedules;
    updatePMSchedule: typeof updatePMSchedule;
    deactivatePMSchedule: typeof deactivatePMSchedule;
    getPMSchedulesByAsset: typeof getPMSchedulesByAsset;
    reservePart: typeof reservePart;
    issueReservedParts: typeof issueReservedParts;
    cancelPartReservation: typeof cancelPartReservation;
    getPartsNeedingReorder: typeof getPartsNeedingReorder;
    createDowntimeRecord: typeof createDowntimeRecord;
    endDowntime: typeof endDowntime;
    getDowntimeByAsset: typeof getDowntimeByAsset;
    calculateDowntimeMetrics: typeof calculateDowntimeMetrics;
    getMaintenanceHistory: typeof getMaintenanceHistory;
    calculateMaintenanceCosts: typeof calculateMaintenanceCosts;
};
export default _default;
//# sourceMappingURL=asset-maintenance-commands.d.ts.map