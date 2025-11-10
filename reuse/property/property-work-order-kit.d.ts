/**
 * LOC: PROP-WO-001
 * File: /reuse/property/property-work-order-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Maintenance tracking modules
 *   - Work order management systems
 */
/**
 * File: /reuse/property/property-work-order-kit.ts
 * Locator: WC-PROP-WO-001
 * Purpose: Work Order Management Kit - Comprehensive work order lifecycle and maintenance tracking
 *
 * Upstream: Independent utility module for property work order operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for work order management, scheduling, tracking, and analytics
 *
 * LLM Context: Enterprise-grade work order management utilities for property management systems.
 * Provides lifecycle management, priority scheduling, mobile access, labor tracking, costing,
 * recurring work orders, emergency handling, and comprehensive analytics. Essential for
 * maintaining property operations, tracking maintenance activities, and ensuring timely
 * completion of work orders.
 */
interface WorkOrder {
    id: string;
    propertyId: string;
    unitId?: string;
    category: WorkOrderCategory;
    priority: WorkOrderPriority;
    status: WorkOrderStatus;
    title: string;
    description: string;
    requestedBy: string;
    requestedByType: 'tenant' | 'staff' | 'vendor' | 'system';
    assignedTo?: string;
    assignedToType?: 'staff' | 'vendor';
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    scheduledDate?: Date;
    completedAt?: Date;
    estimatedCost?: number;
    actualCost?: number;
    estimatedDuration?: number;
    actualDuration?: number;
    attachments?: WorkOrderAttachment[];
    notes?: WorkOrderNote[];
    recurrence?: RecurrenceConfig;
    isEmergency: boolean;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    tags?: string[];
}
type WorkOrderCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'carpentry' | 'painting' | 'flooring' | 'roofing' | 'landscaping' | 'cleaning' | 'pest_control' | 'security' | 'general_maintenance' | 'other';
type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';
type WorkOrderStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'assigned' | 'in_progress' | 'on_hold' | 'pending_review' | 'completed' | 'cancelled' | 'rejected';
interface WorkOrderAttachment {
    id: string;
    workOrderId: string;
    type: 'image' | 'video' | 'document' | 'audio';
    url: string;
    filename: string;
    uploadedBy: string;
    uploadedAt: Date;
    description?: string;
}
interface WorkOrderNote {
    id: string;
    workOrderId: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    isInternal: boolean;
}
interface LaborEntry {
    id: string;
    workOrderId: string;
    technicianId: string;
    technicianName: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    laborCost?: number;
    hourlyRate?: number;
    notes?: string;
}
interface WorkOrderCost {
    workOrderId: string;
    laborCost: number;
    materialCost: number;
    equipmentCost: number;
    otherCosts: number;
    totalCost: number;
    invoiceId?: string;
    paidAt?: Date;
}
interface RecurrenceConfig {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    startDate: Date;
    endDate?: Date;
    nextOccurrence?: Date;
}
interface WorkOrderSchedule {
    workOrderId: string;
    scheduledDate: Date;
    scheduledTime?: string;
    estimatedDuration: number;
    assignedTo: string;
    location: string;
    equipmentNeeded?: string[];
    specialInstructions?: string;
}
interface WorkOrderAnalytics {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    averageCompletionTime: number;
    averageCost: number;
    byCategory: Record<WorkOrderCategory, number>;
    byPriority: Record<WorkOrderPriority, number>;
    byStatus: Record<WorkOrderStatus, number>;
    completionRate: number;
    onTimeCompletionRate: number;
}
interface WorkOrderValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Creates a new work order with validation.
 *
 * @param {Partial<WorkOrder>} workOrderData - Work order data
 * @returns {WorkOrder} Created work order
 *
 * @example
 * ```typescript
 * const workOrder = createWorkOrder({
 *   propertyId: 'PROP-001',
 *   unitId: 'UNIT-101',
 *   category: 'plumbing',
 *   priority: 'high',
 *   title: 'Leaking faucet in kitchen',
 *   description: 'Kitchen sink faucet has been dripping continuously',
 *   requestedBy: 'tenant-123',
 *   requestedByType: 'tenant',
 *   isEmergency: false,
 *   approvalRequired: false
 * });
 * ```
 */
export declare const createWorkOrder: (workOrderData: Partial<WorkOrder>) => WorkOrder;
/**
 * Updates a work order status with validation.
 *
 * @param {WorkOrder} workOrder - Existing work order
 * @param {WorkOrderStatus} newStatus - New status
 * @param {string} updatedBy - User making the update
 * @returns {WorkOrder} Updated work order
 *
 * @example
 * ```typescript
 * const updatedOrder = updateWorkOrderStatus(
 *   workOrder,
 *   'in_progress',
 *   'tech-456'
 * );
 * ```
 */
export declare const updateWorkOrderStatus: (workOrder: WorkOrder, newStatus: WorkOrderStatus, updatedBy: string) => WorkOrder;
/**
 * Assigns a work order to a technician or vendor.
 *
 * @param {WorkOrder} workOrder - Work order to assign
 * @param {string} assigneeId - ID of assignee (technician or vendor)
 * @param {'staff' | 'vendor'} assigneeType - Type of assignee
 * @returns {WorkOrder} Updated work order
 *
 * @example
 * ```typescript
 * const assigned = assignWorkOrder(workOrder, 'tech-789', 'staff');
 * ```
 */
export declare const assignWorkOrder: (workOrder: WorkOrder, assigneeId: string, assigneeType: "staff" | "vendor") => WorkOrder;
/**
 * Completes a work order with final details.
 *
 * @param {WorkOrder} workOrder - Work order to complete
 * @param {number} actualCost - Actual cost incurred
 * @param {number} actualDuration - Actual duration in minutes
 * @param {string} completionNotes - Completion notes
 * @returns {WorkOrder} Completed work order
 *
 * @example
 * ```typescript
 * const completed = completeWorkOrder(
 *   workOrder,
 *   150.00,
 *   120,
 *   'Fixed leaking faucet, replaced washer and O-ring'
 * );
 * ```
 */
export declare const completeWorkOrder: (workOrder: WorkOrder, actualCost: number, actualDuration: number, completionNotes: string) => WorkOrder;
/**
 * Cancels a work order with reason.
 *
 * @param {WorkOrder} workOrder - Work order to cancel
 * @param {string} cancelledBy - User cancelling the order
 * @param {string} reason - Cancellation reason
 * @returns {WorkOrder} Cancelled work order
 *
 * @example
 * ```typescript
 * const cancelled = cancelWorkOrder(
 *   workOrder,
 *   'manager-123',
 *   'Duplicate request'
 * );
 * ```
 */
export declare const cancelWorkOrder: (workOrder: WorkOrder, cancelledBy: string, reason: string) => WorkOrder;
/**
 * Calculates work order priority score for scheduling.
 *
 * @param {WorkOrder} workOrder - Work order to score
 * @returns {number} Priority score (higher = more urgent)
 *
 * @example
 * ```typescript
 * const score = calculatePriorityScore(workOrder);
 * // Returns: 90 (for emergency critical order)
 * ```
 */
export declare const calculatePriorityScore: (workOrder: WorkOrder) => number;
/**
 * Sorts work orders by priority for scheduling.
 *
 * @param {WorkOrder[]} workOrders - Array of work orders
 * @returns {WorkOrder[]} Sorted work orders (highest priority first)
 *
 * @example
 * ```typescript
 * const sorted = sortWorkOrdersByPriority(workOrders);
 * // Returns orders sorted by urgency
 * ```
 */
export declare const sortWorkOrdersByPriority: (workOrders: WorkOrder[]) => WorkOrder[];
/**
 * Calculates recommended due date based on priority.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {Date} Recommended due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(workOrder);
 * // Returns: Date 24 hours from now for high priority
 * ```
 */
export declare const calculateDueDate: (workOrder: WorkOrder) => Date;
/**
 * Schedules a work order for a specific date and time.
 *
 * @param {WorkOrder} workOrder - Work order to schedule
 * @param {Date} scheduledDate - Scheduled date
 * @param {string} assignedTo - Assigned technician
 * @returns {WorkOrderSchedule} Schedule details
 *
 * @example
 * ```typescript
 * const schedule = scheduleWorkOrder(
 *   workOrder,
 *   new Date('2025-11-09T10:00:00'),
 *   'tech-123'
 * );
 * ```
 */
export declare const scheduleWorkOrder: (workOrder: WorkOrder, scheduledDate: Date, assignedTo: string) => WorkOrderSchedule;
/**
 * Checks for scheduling conflicts for a technician.
 *
 * @param {string} technicianId - Technician ID
 * @param {Date} proposedDate - Proposed schedule date
 * @param {number} duration - Duration in minutes
 * @param {WorkOrderSchedule[]} existingSchedules - Existing schedules
 * @returns {boolean} True if conflict exists
 *
 * @example
 * ```typescript
 * const hasConflict = checkSchedulingConflict(
 *   'tech-123',
 *   new Date('2025-11-09T10:00:00'),
 *   120,
 *   existingSchedules
 * );
 * ```
 */
export declare const checkSchedulingConflict: (technicianId: string, proposedDate: Date, duration: number, existingSchedules: WorkOrderSchedule[]) => boolean;
/**
 * Gets work order status history.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {Array<{status: WorkOrderStatus, timestamp: Date}>} Status history
 *
 * @example
 * ```typescript
 * const history = getWorkOrderStatusHistory(workOrder);
 * // Returns: [{ status: 'draft', timestamp: ... }, ...]
 * ```
 */
export declare const getWorkOrderStatusHistory: (workOrder: WorkOrder) => Array<{
    status: WorkOrderStatus;
    timestamp: Date;
}>;
/**
 * Checks if a work order is overdue.
 *
 * @param {WorkOrder} workOrder - Work order to check
 * @returns {boolean} True if overdue
 *
 * @example
 * ```typescript
 * const overdue = isWorkOrderOverdue(workOrder);
 * // Returns: true if past due date and not completed
 * ```
 */
export declare const isWorkOrderOverdue: (workOrder: WorkOrder) => boolean;
/**
 * Calculates time remaining until due date.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {number} Hours remaining (negative if overdue)
 *
 * @example
 * ```typescript
 * const hoursRemaining = getTimeUntilDue(workOrder);
 * // Returns: 24 (hours remaining until due)
 * ```
 */
export declare const getTimeUntilDue: (workOrder: WorkOrder) => number;
/**
 * Gets work orders by status.
 *
 * @param {WorkOrder[]} workOrders - Array of work orders
 * @param {WorkOrderStatus} status - Status to filter by
 * @returns {WorkOrder[]} Filtered work orders
 *
 * @example
 * ```typescript
 * const inProgress = getWorkOrdersByStatus(workOrders, 'in_progress');
 * ```
 */
export declare const getWorkOrdersByStatus: (workOrders: WorkOrder[], status: WorkOrderStatus) => WorkOrder[];
/**
 * Calculates work order completion percentage.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = calculateWorkOrderProgress(workOrder);
 * // Returns: 75 (75% complete)
 * ```
 */
export declare const calculateWorkOrderProgress: (workOrder: WorkOrder) => number;
/**
 * Formats work order for mobile display.
 *
 * @param {WorkOrder} workOrder - Work order to format
 * @returns {object} Mobile-friendly work order data
 *
 * @example
 * ```typescript
 * const mobileData = formatWorkOrderForMobile(workOrder);
 * // Returns simplified object optimized for mobile display
 * ```
 */
export declare const formatWorkOrderForMobile: (workOrder: WorkOrder) => object;
/**
 * Generates QR code data for work order mobile access.
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {string} baseUrl - Base URL for mobile app
 * @returns {string} QR code data (URL)
 *
 * @example
 * ```typescript
 * const qrData = generateWorkOrderQRCode(
 *   workOrder,
 *   'https://app.property.com'
 * );
 * // Returns: 'https://app.property.com/workorders/WO-123'
 * ```
 */
export declare const generateWorkOrderQRCode: (workOrder: WorkOrder, baseUrl: string) => string;
/**
 * Creates mobile check-in for work order.
 *
 * @param {string} workOrderId - Work order ID
 * @param {string} technicianId - Technician ID
 * @param {object} location - GPS coordinates
 * @returns {object} Check-in data
 *
 * @example
 * ```typescript
 * const checkIn = createMobileCheckIn(
 *   'WO-123',
 *   'tech-456',
 *   { latitude: 40.7128, longitude: -74.0060 }
 * );
 * ```
 */
export declare const createMobileCheckIn: (workOrderId: string, technicianId: string, location: {
    latitude: number;
    longitude: number;
}) => object;
/**
 * Uploads work order attachment from mobile.
 *
 * @param {string} workOrderId - Work order ID
 * @param {File | Blob} file - File to upload
 * @param {string} uploadedBy - User uploading
 * @param {'before' | 'during' | 'after'} stage - Upload stage
 * @returns {Promise<WorkOrderAttachment>} Attachment record
 *
 * @example
 * ```typescript
 * const attachment = await uploadMobileAttachment(
 *   'WO-123',
 *   imageFile,
 *   'tech-456',
 *   'before'
 * );
 * ```
 */
export declare const uploadMobileAttachment: (workOrderId: string, file: File | Blob, uploadedBy: string, stage: "before" | "during" | "after") => Promise<WorkOrderAttachment>;
/**
 * Syncs mobile work order updates to server.
 *
 * @param {Partial<WorkOrder>[]} updates - Array of work order updates
 * @returns {Promise<{synced: number, failed: number}>} Sync results
 *
 * @example
 * ```typescript
 * const result = await syncMobileWorkOrders(offlineUpdates);
 * // Returns: { synced: 5, failed: 0 }
 * ```
 */
export declare const syncMobileWorkOrders: (updates: Partial<WorkOrder>[]) => Promise<{
    synced: number;
    failed: number;
}>;
/**
 * Validates work order completion requirements.
 *
 * @param {WorkOrder} workOrder - Work order to validate
 * @returns {WorkOrderValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWorkOrderCompletion(workOrder);
 * if (validation.isValid) {
 *   // Proceed with completion
 * }
 * ```
 */
export declare const validateWorkOrderCompletion: (workOrder: WorkOrder) => WorkOrderValidationResult;
/**
 * Requests tenant verification of completed work.
 *
 * @param {WorkOrder} workOrder - Completed work order
 * @param {string} tenantEmail - Tenant email
 * @returns {object} Verification request
 *
 * @example
 * ```typescript
 * const request = requestTenantVerification(workOrder, 'tenant@example.com');
 * ```
 */
export declare const requestTenantVerification: (workOrder: WorkOrder, tenantEmail: string) => object;
/**
 * Records tenant feedback on completed work.
 *
 * @param {string} workOrderId - Work order ID
 * @param {number} rating - Rating (1-5)
 * @param {string} feedback - Tenant feedback
 * @param {boolean} satisfactory - Work satisfactory?
 * @returns {object} Feedback record
 *
 * @example
 * ```typescript
 * const feedback = recordTenantFeedback(
 *   'WO-123',
 *   5,
 *   'Excellent work, fixed quickly',
 *   true
 * );
 * ```
 */
export declare const recordTenantFeedback: (workOrderId: string, rating: number, feedback: string, satisfactory: boolean) => object;
/**
 * Creates quality control checklist for work order.
 *
 * @param {WorkOrderCategory} category - Work order category
 * @returns {string[]} QC checklist items
 *
 * @example
 * ```typescript
 * const checklist = createQualityChecklist('plumbing');
 * // Returns: ['Check for leaks', 'Test water pressure', ...]
 * ```
 */
export declare const createQualityChecklist: (category: WorkOrderCategory) => string[];
/**
 * Starts labor time tracking for a work order.
 *
 * @param {string} workOrderId - Work order ID
 * @param {string} technicianId - Technician ID
 * @param {string} technicianName - Technician name
 * @returns {LaborEntry} Labor entry
 *
 * @example
 * ```typescript
 * const labor = startLaborTracking('WO-123', 'tech-456', 'John Smith');
 * ```
 */
export declare const startLaborTracking: (workOrderId: string, technicianId: string, technicianName: string) => LaborEntry;
/**
 * Stops labor time tracking and calculates duration.
 *
 * @param {LaborEntry} laborEntry - Labor entry to stop
 * @param {number} hourlyRate - Hourly rate for cost calculation
 * @returns {LaborEntry} Updated labor entry with duration and cost
 *
 * @example
 * ```typescript
 * const completed = stopLaborTracking(laborEntry, 45.00);
 * // Returns entry with calculated duration and cost
 * ```
 */
export declare const stopLaborTracking: (laborEntry: LaborEntry, hourlyRate: number) => LaborEntry;
/**
 * Calculates total labor cost for a work order.
 *
 * @param {LaborEntry[]} laborEntries - Array of labor entries
 * @returns {number} Total labor cost
 *
 * @example
 * ```typescript
 * const total = calculateTotalLaborCost(laborEntries);
 * // Returns: 225.50
 * ```
 */
export declare const calculateTotalLaborCost: (laborEntries: LaborEntry[]) => number;
/**
 * Gets labor entries for a specific work order.
 *
 * @param {LaborEntry[]} allEntries - All labor entries
 * @param {string} workOrderId - Work order ID
 * @returns {LaborEntry[]} Filtered labor entries
 *
 * @example
 * ```typescript
 * const workOrderLabor = getLaborEntriesByWorkOrder(allEntries, 'WO-123');
 * ```
 */
export declare const getLaborEntriesByWorkOrder: (allEntries: LaborEntry[], workOrderId: string) => LaborEntry[];
/**
 * Generates labor summary report for a technician.
 *
 * @param {LaborEntry[]} laborEntries - Labor entries
 * @param {string} technicianId - Technician ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Labor summary
 *
 * @example
 * ```typescript
 * const summary = generateLaborSummary(
 *   entries,
 *   'tech-123',
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateLaborSummary: (laborEntries: LaborEntry[], technicianId: string, startDate: Date, endDate: Date) => object;
/**
 * Calculates comprehensive work order cost.
 *
 * @param {number} laborCost - Labor cost
 * @param {number} materialCost - Material cost
 * @param {number} equipmentCost - Equipment cost
 * @param {number} otherCosts - Other costs
 * @returns {WorkOrderCost} Complete cost breakdown
 *
 * @example
 * ```typescript
 * const cost = calculateWorkOrderCost(150, 75, 25, 10);
 * // Returns: { laborCost: 150, materialCost: 75, ..., totalCost: 260 }
 * ```
 */
export declare const calculateWorkOrderCost: (laborCost: number, materialCost: number, equipmentCost: number, otherCosts: number) => Omit<WorkOrderCost, "workOrderId">;
/**
 * Estimates work order cost based on category and priority.
 *
 * @param {WorkOrderCategory} category - Work order category
 * @param {WorkOrderPriority} priority - Work order priority
 * @param {number} estimatedHours - Estimated hours
 * @returns {number} Estimated cost
 *
 * @example
 * ```typescript
 * const estimate = estimateWorkOrderCost('plumbing', 'high', 2);
 * // Returns: 225.00
 * ```
 */
export declare const estimateWorkOrderCost: (category: WorkOrderCategory, priority: WorkOrderPriority, estimatedHours: number) => number;
/**
 * Compares estimated vs actual cost variance.
 *
 * @param {number} estimatedCost - Estimated cost
 * @param {number} actualCost - Actual cost
 * @returns {object} Cost variance analysis
 *
 * @example
 * ```typescript
 * const variance = analyzeCostVariance(200, 250);
 * // Returns: { variance: 50, percentVariance: 25, isOverBudget: true }
 * ```
 */
export declare const analyzeCostVariance: (estimatedCost: number, actualCost: number) => {
    variance: number;
    percentVariance: number;
    isOverBudget: boolean;
    description: string;
};
/**
 * Generates cost breakdown report for work order.
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {LaborEntry[]} laborEntries - Labor entries
 * @returns {object} Detailed cost breakdown
 *
 * @example
 * ```typescript
 * const breakdown = generateCostBreakdown(workOrder, laborEntries);
 * ```
 */
export declare const generateCostBreakdown: (workOrder: WorkOrder, laborEntries: LaborEntry[]) => object;
/**
 * Creates a recurring work order configuration.
 *
 * @param {Partial<WorkOrder>} baseWorkOrder - Base work order data
 * @param {RecurrenceConfig} recurrence - Recurrence configuration
 * @returns {WorkOrder} Work order with recurrence
 *
 * @example
 * ```typescript
 * const recurring = createRecurringWorkOrder(
 *   { title: 'HVAC Filter Change', category: 'hvac' },
 *   { frequency: 'monthly', interval: 1, startDate: new Date() }
 * );
 * ```
 */
export declare const createRecurringWorkOrder: (baseWorkOrder: Partial<WorkOrder>, recurrence: RecurrenceConfig) => WorkOrder;
/**
 * Calculates next occurrence date for recurring work order.
 *
 * @param {RecurrenceConfig} recurrence - Recurrence configuration
 * @returns {Date} Next occurrence date
 *
 * @example
 * ```typescript
 * const nextDate = calculateNextOccurrence(recurrenceConfig);
 * // Returns: Date for next scheduled occurrence
 * ```
 */
export declare const calculateNextOccurrence: (recurrence: RecurrenceConfig) => Date;
/**
 * Generates next instance of recurring work order.
 *
 * @param {WorkOrder} recurringWorkOrder - Recurring work order template
 * @returns {WorkOrder} New work order instance
 *
 * @example
 * ```typescript
 * const nextInstance = generateRecurringInstance(recurringWorkOrder);
 * ```
 */
export declare const generateRecurringInstance: (recurringWorkOrder: WorkOrder) => WorkOrder;
/**
 * Checks if recurring work orders need to be generated.
 *
 * @param {WorkOrder[]} recurringWorkOrders - Array of recurring work orders
 * @returns {WorkOrder[]} New work orders to be created
 *
 * @example
 * ```typescript
 * const newOrders = checkRecurringWorkOrders(recurringTemplates);
 * ```
 */
export declare const checkRecurringWorkOrders: (recurringWorkOrders: WorkOrder[]) => WorkOrder[];
/**
 * Escalates work order to emergency status.
 *
 * @param {WorkOrder} workOrder - Work order to escalate
 * @param {string} escalatedBy - User escalating
 * @param {string} reason - Escalation reason
 * @returns {WorkOrder} Escalated work order
 *
 * @example
 * ```typescript
 * const emergency = escalateToEmergency(
 *   workOrder,
 *   'manager-123',
 *   'Flooding in multiple units'
 * );
 * ```
 */
export declare const escalateToEmergency: (workOrder: WorkOrder, escalatedBy: string, reason: string) => WorkOrder;
/**
 * Sends emergency notifications for work order.
 *
 * @param {WorkOrder} workOrder - Emergency work order
 * @param {string[]} recipients - Notification recipients
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendEmergencyNotifications(
 *   emergencyOrder,
 *   ['manager@example.com', 'oncall@example.com']
 * );
 * ```
 */
export declare const sendEmergencyNotifications: (workOrder: WorkOrder, recipients: string[]) => object;
/**
 * Finds available emergency technicians.
 *
 * @param {string} category - Work order category
 * @param {object[]} technicians - Available technicians
 * @returns {object[]} Available emergency technicians
 *
 * @example
 * ```typescript
 * const available = findEmergencyTechnicians('plumbing', allTechnicians);
 * ```
 */
export declare const findEmergencyTechnicians: (category: WorkOrderCategory, technicians: Array<{
    id: string;
    name: string;
    skills: WorkOrderCategory[];
    isOnCall: boolean;
    isAvailable: boolean;
}>) => Array<{
    id: string;
    name: string;
    skills: WorkOrderCategory[];
    isOnCall: boolean;
}>;
/**
 * Generates comprehensive work order analytics.
 *
 * @param {WorkOrder[]} workOrders - Array of work orders
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {WorkOrderAnalytics} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = generateWorkOrderAnalytics(
 *   workOrders,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare const generateWorkOrderAnalytics: (workOrders: WorkOrder[], startDate: Date, endDate: Date) => WorkOrderAnalytics;
/**
 * Calculates technician performance metrics.
 *
 * @param {WorkOrder[]} workOrders - Work orders
 * @param {string} technicianId - Technician ID
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateTechnicianPerformance(workOrders, 'tech-123');
 * ```
 */
export declare const calculateTechnicianPerformance: (workOrders: WorkOrder[], technicianId: string) => object;
/**
 * Identifies work order trends and patterns.
 *
 * @param {WorkOrder[]} workOrders - Historical work orders
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = identifyWorkOrderTrends(historicalOrders);
 * ```
 */
export declare const identifyWorkOrderTrends: (workOrders: WorkOrder[]) => object;
export {};
//# sourceMappingURL=property-work-order-kit.d.ts.map