"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyWorkOrderTrends = exports.calculateTechnicianPerformance = exports.generateWorkOrderAnalytics = exports.findEmergencyTechnicians = exports.sendEmergencyNotifications = exports.escalateToEmergency = exports.checkRecurringWorkOrders = exports.generateRecurringInstance = exports.calculateNextOccurrence = exports.createRecurringWorkOrder = exports.generateCostBreakdown = exports.analyzeCostVariance = exports.estimateWorkOrderCost = exports.calculateWorkOrderCost = exports.generateLaborSummary = exports.getLaborEntriesByWorkOrder = exports.calculateTotalLaborCost = exports.stopLaborTracking = exports.startLaborTracking = exports.createQualityChecklist = exports.recordTenantFeedback = exports.requestTenantVerification = exports.validateWorkOrderCompletion = exports.syncMobileWorkOrders = exports.uploadMobileAttachment = exports.createMobileCheckIn = exports.generateWorkOrderQRCode = exports.formatWorkOrderForMobile = exports.calculateWorkOrderProgress = exports.getWorkOrdersByStatus = exports.getTimeUntilDue = exports.isWorkOrderOverdue = exports.getWorkOrderStatusHistory = exports.checkSchedulingConflict = exports.scheduleWorkOrder = exports.calculateDueDate = exports.sortWorkOrdersByPriority = exports.calculatePriorityScore = exports.cancelWorkOrder = exports.completeWorkOrder = exports.assignWorkOrder = exports.updateWorkOrderStatus = exports.createWorkOrder = void 0;
// ============================================================================
// WORK ORDER LIFECYCLE MANAGEMENT
// ============================================================================
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
const createWorkOrder = (workOrderData) => {
    const now = new Date();
    const workOrder = {
        id: workOrderData.id || `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: workOrderData.propertyId,
        unitId: workOrderData.unitId,
        category: workOrderData.category || 'general_maintenance',
        priority: workOrderData.priority || 'medium',
        status: workOrderData.status || 'draft',
        title: workOrderData.title || '',
        description: workOrderData.description || '',
        requestedBy: workOrderData.requestedBy,
        requestedByType: workOrderData.requestedByType || 'tenant',
        assignedTo: workOrderData.assignedTo,
        assignedToType: workOrderData.assignedToType,
        createdAt: workOrderData.createdAt || now,
        updatedAt: now,
        dueDate: workOrderData.dueDate,
        scheduledDate: workOrderData.scheduledDate,
        completedAt: workOrderData.completedAt,
        estimatedCost: workOrderData.estimatedCost,
        actualCost: workOrderData.actualCost,
        estimatedDuration: workOrderData.estimatedDuration,
        actualDuration: workOrderData.actualDuration,
        attachments: workOrderData.attachments || [],
        notes: workOrderData.notes || [],
        recurrence: workOrderData.recurrence,
        isEmergency: workOrderData.isEmergency || false,
        approvalRequired: workOrderData.approvalRequired || false,
        approvedBy: workOrderData.approvedBy,
        approvedAt: workOrderData.approvedAt,
        tags: workOrderData.tags || [],
    };
    return workOrder;
};
exports.createWorkOrder = createWorkOrder;
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
const updateWorkOrderStatus = (workOrder, newStatus, updatedBy) => {
    const now = new Date();
    const updated = {
        ...workOrder,
        status: newStatus,
        updatedAt: now,
    };
    // Auto-set completion date when marked as completed
    if (newStatus === 'completed' && !updated.completedAt) {
        updated.completedAt = now;
    }
    return updated;
};
exports.updateWorkOrderStatus = updateWorkOrderStatus;
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
const assignWorkOrder = (workOrder, assigneeId, assigneeType) => {
    return {
        ...workOrder,
        assignedTo: assigneeId,
        assignedToType: assigneeType,
        status: workOrder.status === 'approved' ? 'assigned' : workOrder.status,
        updatedAt: new Date(),
    };
};
exports.assignWorkOrder = assignWorkOrder;
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
const completeWorkOrder = (workOrder, actualCost, actualDuration, completionNotes) => {
    const now = new Date();
    return {
        ...workOrder,
        status: 'completed',
        actualCost,
        actualDuration,
        completedAt: now,
        updatedAt: now,
        notes: [
            ...(workOrder.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                workOrderId: workOrder.id,
                content: completionNotes,
                createdBy: workOrder.assignedTo || 'system',
                createdAt: now,
                isInternal: false,
            },
        ],
    };
};
exports.completeWorkOrder = completeWorkOrder;
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
const cancelWorkOrder = (workOrder, cancelledBy, reason) => {
    const now = new Date();
    return {
        ...workOrder,
        status: 'cancelled',
        updatedAt: now,
        notes: [
            ...(workOrder.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                workOrderId: workOrder.id,
                content: `Cancelled by ${cancelledBy}: ${reason}`,
                createdBy: cancelledBy,
                createdAt: now,
                isInternal: true,
            },
        ],
    };
};
exports.cancelWorkOrder = cancelWorkOrder;
// ============================================================================
// PRIORITY-BASED WORK SCHEDULING
// ============================================================================
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
const calculatePriorityScore = (workOrder) => {
    let score = 0;
    // Priority base score
    const priorityScores = {
        critical: 50,
        high: 30,
        medium: 20,
        low: 10,
    };
    score += priorityScores[workOrder.priority];
    // Emergency multiplier
    if (workOrder.isEmergency) {
        score += 40;
    }
    // Age factor (older orders get higher priority)
    const ageInDays = Math.floor((Date.now() - workOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    score += Math.min(ageInDays * 2, 20); // Cap at +20
    // Overdue penalty
    if (workOrder.dueDate && new Date() > workOrder.dueDate) {
        score += 30;
    }
    return score;
};
exports.calculatePriorityScore = calculatePriorityScore;
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
const sortWorkOrdersByPriority = (workOrders) => {
    return [...workOrders].sort((a, b) => {
        return (0, exports.calculatePriorityScore)(b) - (0, exports.calculatePriorityScore)(a);
    });
};
exports.sortWorkOrdersByPriority = sortWorkOrdersByPriority;
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
const calculateDueDate = (workOrder) => {
    const now = new Date();
    const hoursToAdd = {
        critical: 4, // 4 hours
        high: 24, // 1 day
        medium: 72, // 3 days
        low: 168, // 7 days
    };
    const hours = workOrder.isEmergency ? 2 : hoursToAdd[workOrder.priority];
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
};
exports.calculateDueDate = calculateDueDate;
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
const scheduleWorkOrder = (workOrder, scheduledDate, assignedTo) => {
    return {
        workOrderId: workOrder.id,
        scheduledDate,
        scheduledTime: scheduledDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        estimatedDuration: workOrder.estimatedDuration || 60,
        assignedTo,
        location: `${workOrder.propertyId}${workOrder.unitId ? ' - ' + workOrder.unitId : ''}`,
        equipmentNeeded: [],
        specialInstructions: workOrder.description,
    };
};
exports.scheduleWorkOrder = scheduleWorkOrder;
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
const checkSchedulingConflict = (technicianId, proposedDate, duration, existingSchedules) => {
    const proposedEnd = new Date(proposedDate.getTime() + duration * 60 * 1000);
    return existingSchedules
        .filter(schedule => schedule.assignedTo === technicianId)
        .some(schedule => {
        const existingStart = schedule.scheduledDate;
        const existingEnd = new Date(existingStart.getTime() + schedule.estimatedDuration * 60 * 1000);
        // Check for overlap
        return ((proposedDate >= existingStart && proposedDate < existingEnd) ||
            (proposedEnd > existingStart && proposedEnd <= existingEnd) ||
            (proposedDate <= existingStart && proposedEnd >= existingEnd));
    });
};
exports.checkSchedulingConflict = checkSchedulingConflict;
// ============================================================================
// WORK ORDER STATUS TRACKING
// ============================================================================
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
const getWorkOrderStatusHistory = (workOrder) => {
    // In a real implementation, this would retrieve from a database
    // For now, we construct from available data
    const history = [];
    history.push({ status: 'draft', timestamp: workOrder.createdAt });
    if (workOrder.status !== 'draft') {
        history.push({ status: workOrder.status, timestamp: workOrder.updatedAt });
    }
    if (workOrder.completedAt) {
        history.push({ status: 'completed', timestamp: workOrder.completedAt });
    }
    return history;
};
exports.getWorkOrderStatusHistory = getWorkOrderStatusHistory;
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
const isWorkOrderOverdue = (workOrder) => {
    if (!workOrder.dueDate || workOrder.status === 'completed' || workOrder.status === 'cancelled') {
        return false;
    }
    return new Date() > workOrder.dueDate;
};
exports.isWorkOrderOverdue = isWorkOrderOverdue;
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
const getTimeUntilDue = (workOrder) => {
    if (!workOrder.dueDate) {
        return Infinity;
    }
    const now = new Date();
    const diffMs = workOrder.dueDate.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
};
exports.getTimeUntilDue = getTimeUntilDue;
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
const getWorkOrdersByStatus = (workOrders, status) => {
    return workOrders.filter(wo => wo.status === status);
};
exports.getWorkOrdersByStatus = getWorkOrdersByStatus;
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
const calculateWorkOrderProgress = (workOrder) => {
    const statusProgress = {
        draft: 0,
        pending_approval: 10,
        approved: 20,
        scheduled: 30,
        assigned: 40,
        in_progress: 60,
        on_hold: 50,
        pending_review: 80,
        completed: 100,
        cancelled: 0,
        rejected: 0,
    };
    return statusProgress[workOrder.status];
};
exports.calculateWorkOrderProgress = calculateWorkOrderProgress;
// ============================================================================
// MOBILE WORK ORDER ACCESS
// ============================================================================
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
const formatWorkOrderForMobile = (workOrder) => {
    return {
        id: workOrder.id,
        title: workOrder.title,
        description: workOrder.description,
        priority: workOrder.priority,
        status: workOrder.status,
        category: workOrder.category,
        location: `${workOrder.propertyId}${workOrder.unitId ? ' - ' + workOrder.unitId : ''}`,
        dueDate: workOrder.dueDate?.toISOString(),
        isEmergency: workOrder.isEmergency,
        assignedTo: workOrder.assignedTo,
        estimatedDuration: workOrder.estimatedDuration,
        attachmentCount: workOrder.attachments?.length || 0,
        noteCount: workOrder.notes?.length || 0,
    };
};
exports.formatWorkOrderForMobile = formatWorkOrderForMobile;
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
const generateWorkOrderQRCode = (workOrder, baseUrl) => {
    return `${baseUrl}/workorders/${workOrder.id}`;
};
exports.generateWorkOrderQRCode = generateWorkOrderQRCode;
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
const createMobileCheckIn = (workOrderId, technicianId, location) => {
    return {
        workOrderId,
        technicianId,
        checkInTime: new Date(),
        location,
        status: 'checked_in',
    };
};
exports.createMobileCheckIn = createMobileCheckIn;
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
const uploadMobileAttachment = async (workOrderId, file, uploadedBy, stage) => {
    // In production, this would upload to cloud storage
    const attachment = {
        id: `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        workOrderId,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: `https://storage.example.com/${workOrderId}/${Date.now()}`,
        filename: file.name || 'attachment',
        uploadedBy,
        uploadedAt: new Date(),
        description: `${stage} photo`,
    };
    return attachment;
};
exports.uploadMobileAttachment = uploadMobileAttachment;
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
const syncMobileWorkOrders = async (updates) => {
    // In production, this would sync with backend
    let synced = 0;
    let failed = 0;
    for (const update of updates) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            synced++;
        }
        catch (error) {
            failed++;
        }
    }
    return { synced, failed };
};
exports.syncMobileWorkOrders = syncMobileWorkOrders;
// ============================================================================
// WORK COMPLETION VERIFICATION
// ============================================================================
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
const validateWorkOrderCompletion = (workOrder) => {
    const errors = [];
    const warnings = [];
    // Required fields
    if (!workOrder.actualCost) {
        errors.push('Actual cost is required for completion');
    }
    if (!workOrder.actualDuration) {
        errors.push('Actual duration is required for completion');
    }
    if (!workOrder.notes || workOrder.notes.length === 0) {
        warnings.push('No completion notes provided');
    }
    // Attachments for high-priority work
    if (workOrder.priority === 'critical' || workOrder.priority === 'high') {
        if (!workOrder.attachments || workOrder.attachments.length === 0) {
            warnings.push('High-priority work should include photos');
        }
    }
    // Cost variance check
    if (workOrder.estimatedCost && workOrder.actualCost) {
        const variance = Math.abs(workOrder.actualCost - workOrder.estimatedCost);
        const variancePercent = (variance / workOrder.estimatedCost) * 100;
        if (variancePercent > 25) {
            warnings.push(`Actual cost varies ${variancePercent.toFixed(0)}% from estimate`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateWorkOrderCompletion = validateWorkOrderCompletion;
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
const requestTenantVerification = (workOrder, tenantEmail) => {
    return {
        workOrderId: workOrder.id,
        tenantEmail,
        requestedAt: new Date(),
        verificationUrl: `https://portal.example.com/verify/${workOrder.id}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
};
exports.requestTenantVerification = requestTenantVerification;
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
const recordTenantFeedback = (workOrderId, rating, feedback, satisfactory) => {
    return {
        workOrderId,
        rating: Math.max(1, Math.min(5, rating)), // Clamp to 1-5
        feedback,
        satisfactory,
        submittedAt: new Date(),
    };
};
exports.recordTenantFeedback = recordTenantFeedback;
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
const createQualityChecklist = (category) => {
    const checklists = {
        plumbing: [
            'Check for leaks',
            'Test water pressure',
            'Verify proper drainage',
            'Inspect connections',
            'Test hot/cold water function',
        ],
        electrical: [
            'Test circuit functionality',
            'Verify proper voltage',
            'Check wire connections',
            'Test GFCI outlets',
            'Verify grounding',
        ],
        hvac: [
            'Check temperature output',
            'Verify airflow',
            'Inspect filters',
            'Test thermostat',
            'Check for unusual noises',
        ],
        appliance: [
            'Test all functions',
            'Check for proper operation',
            'Verify safety features',
            'Inspect connections',
            'Clean and test',
        ],
        carpentry: [
            'Check structural integrity',
            'Verify measurements',
            'Inspect finish quality',
            'Test moving parts',
            'Check alignment',
        ],
        painting: [
            'Inspect coverage',
            'Check for drips/runs',
            'Verify color match',
            'Clean edges',
            'Protect surfaces',
        ],
        flooring: [
            'Check for gaps',
            'Verify level surface',
            'Inspect seams',
            'Test stability',
            'Clean installation',
        ],
        roofing: [
            'Inspect for leaks',
            'Check flashing',
            'Verify ventilation',
            'Inspect drainage',
            'Check shingle alignment',
        ],
        landscaping: [
            'Verify work completed',
            'Check cleanup',
            'Inspect irrigation',
            'Verify plant health',
            'Check edging',
        ],
        cleaning: [
            'Verify all areas cleaned',
            'Check for damage',
            'Inspect surfaces',
            'Verify supplies restocked',
            'Final walkthrough',
        ],
        pest_control: [
            'Verify treatment applied',
            'Check access points',
            'Inspect treated areas',
            'Review prevention plan',
            'Schedule follow-up',
        ],
        security: [
            'Test system functionality',
            'Verify all sensors',
            'Check monitoring',
            'Test alarm',
            'Review access codes',
        ],
        general_maintenance: [
            'Verify work completed',
            'Check quality',
            'Inspect surrounding area',
            'Test functionality',
            'Clean up workspace',
        ],
        other: [
            'Verify work completed',
            'Check quality',
            'Inspect results',
            'Test as needed',
            'Clean up',
        ],
    };
    return checklists[category] || checklists.other;
};
exports.createQualityChecklist = createQualityChecklist;
// ============================================================================
// LABOR TIME TRACKING
// ============================================================================
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
const startLaborTracking = (workOrderId, technicianId, technicianName) => {
    return {
        id: `LABOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        workOrderId,
        technicianId,
        technicianName,
        startTime: new Date(),
    };
};
exports.startLaborTracking = startLaborTracking;
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
const stopLaborTracking = (laborEntry, hourlyRate) => {
    const endTime = new Date();
    const durationMs = endTime.getTime() - laborEntry.startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    const durationHours = durationMinutes / 60;
    const laborCost = durationHours * hourlyRate;
    return {
        ...laborEntry,
        endTime,
        duration: durationMinutes,
        hourlyRate,
        laborCost: Math.round(laborCost * 100) / 100, // Round to 2 decimals
    };
};
exports.stopLaborTracking = stopLaborTracking;
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
const calculateTotalLaborCost = (laborEntries) => {
    return laborEntries.reduce((total, entry) => {
        return total + (entry.laborCost || 0);
    }, 0);
};
exports.calculateTotalLaborCost = calculateTotalLaborCost;
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
const getLaborEntriesByWorkOrder = (allEntries, workOrderId) => {
    return allEntries.filter(entry => entry.workOrderId === workOrderId);
};
exports.getLaborEntriesByWorkOrder = getLaborEntriesByWorkOrder;
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
const generateLaborSummary = (laborEntries, technicianId, startDate, endDate) => {
    const filtered = laborEntries.filter(entry => {
        return (entry.technicianId === technicianId &&
            entry.startTime >= startDate &&
            entry.startTime <= endDate);
    });
    const totalHours = filtered.reduce((sum, entry) => {
        return sum + ((entry.duration || 0) / 60);
    }, 0);
    const totalCost = filtered.reduce((sum, entry) => {
        return sum + (entry.laborCost || 0);
    }, 0);
    return {
        technicianId,
        technicianName: filtered[0]?.technicianName,
        period: { startDate, endDate },
        totalEntries: filtered.length,
        totalHours: Math.round(totalHours * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        averageHoursPerJob: filtered.length > 0 ? totalHours / filtered.length : 0,
    };
};
exports.generateLaborSummary = generateLaborSummary;
// ============================================================================
// WORK ORDER COSTING
// ============================================================================
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
const calculateWorkOrderCost = (laborCost, materialCost, equipmentCost, otherCosts) => {
    const totalCost = laborCost + materialCost + equipmentCost + otherCosts;
    return {
        laborCost,
        materialCost,
        equipmentCost,
        otherCosts,
        totalCost: Math.round(totalCost * 100) / 100,
    };
};
exports.calculateWorkOrderCost = calculateWorkOrderCost;
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
const estimateWorkOrderCost = (category, priority, estimatedHours) => {
    // Base hourly rates by category
    const categoryRates = {
        plumbing: 75,
        electrical: 85,
        hvac: 90,
        appliance: 70,
        carpentry: 65,
        painting: 50,
        flooring: 60,
        roofing: 80,
        landscaping: 45,
        cleaning: 35,
        pest_control: 55,
        security: 75,
        general_maintenance: 50,
        other: 50,
    };
    // Priority multipliers
    const priorityMultipliers = {
        critical: 1.5,
        high: 1.25,
        medium: 1.0,
        low: 0.9,
    };
    const baseRate = categoryRates[category];
    const multiplier = priorityMultipliers[priority];
    return Math.round(baseRate * multiplier * estimatedHours * 100) / 100;
};
exports.estimateWorkOrderCost = estimateWorkOrderCost;
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
const analyzeCostVariance = (estimatedCost, actualCost) => {
    const variance = actualCost - estimatedCost;
    const percentVariance = estimatedCost > 0
        ? (variance / estimatedCost) * 100
        : 0;
    let description = '';
    if (Math.abs(percentVariance) < 5) {
        description = 'On budget';
    }
    else if (percentVariance > 0) {
        description = `Over budget by ${percentVariance.toFixed(1)}%`;
    }
    else {
        description = `Under budget by ${Math.abs(percentVariance).toFixed(1)}%`;
    }
    return {
        variance: Math.round(variance * 100) / 100,
        percentVariance: Math.round(percentVariance * 100) / 100,
        isOverBudget: variance > 0,
        description,
    };
};
exports.analyzeCostVariance = analyzeCostVariance;
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
const generateCostBreakdown = (workOrder, laborEntries) => {
    const laborCost = (0, exports.calculateTotalLaborCost)(laborEntries);
    return {
        workOrderId: workOrder.id,
        estimatedCost: workOrder.estimatedCost || 0,
        actualCost: workOrder.actualCost || 0,
        breakdown: {
            labor: laborCost,
            materials: 0, // Would be calculated from material entries
            equipment: 0, // Would be calculated from equipment entries
            other: 0,
        },
        variance: workOrder.estimatedCost && workOrder.actualCost
            ? (0, exports.analyzeCostVariance)(workOrder.estimatedCost, workOrder.actualCost)
            : null,
        laborHours: laborEntries.reduce((sum, e) => sum + ((e.duration || 0) / 60), 0),
    };
};
exports.generateCostBreakdown = generateCostBreakdown;
// ============================================================================
// RECURRING WORK ORDERS
// ============================================================================
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
const createRecurringWorkOrder = (baseWorkOrder, recurrence) => {
    const workOrder = (0, exports.createWorkOrder)(baseWorkOrder);
    return {
        ...workOrder,
        recurrence: {
            ...recurrence,
            nextOccurrence: (0, exports.calculateNextOccurrence)(recurrence),
        },
    };
};
exports.createRecurringWorkOrder = createRecurringWorkOrder;
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
const calculateNextOccurrence = (recurrence) => {
    const baseDate = recurrence.nextOccurrence || recurrence.startDate;
    const next = new Date(baseDate);
    switch (recurrence.frequency) {
        case 'daily':
            next.setDate(next.getDate() + recurrence.interval);
            break;
        case 'weekly':
            next.setDate(next.getDate() + (recurrence.interval * 7));
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + recurrence.interval);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + (recurrence.interval * 3));
            break;
        case 'yearly':
            next.setFullYear(next.getFullYear() + recurrence.interval);
            break;
    }
    return next;
};
exports.calculateNextOccurrence = calculateNextOccurrence;
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
const generateRecurringInstance = (recurringWorkOrder) => {
    if (!recurringWorkOrder.recurrence) {
        throw new Error('Work order is not recurring');
    }
    const nextDate = (0, exports.calculateNextOccurrence)(recurringWorkOrder.recurrence);
    // Check if we've reached the end date
    if (recurringWorkOrder.recurrence.endDate &&
        nextDate > recurringWorkOrder.recurrence.endDate) {
        throw new Error('Recurrence has ended');
    }
    const newWorkOrder = (0, exports.createWorkOrder)({
        ...recurringWorkOrder,
        id: undefined, // Generate new ID
        status: 'draft',
        scheduledDate: nextDate,
        dueDate: new Date(nextDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days after schedule
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: undefined,
        actualCost: undefined,
        actualDuration: undefined,
        notes: [],
        attachments: [],
    });
    return newWorkOrder;
};
exports.generateRecurringInstance = generateRecurringInstance;
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
const checkRecurringWorkOrders = (recurringWorkOrders) => {
    const now = new Date();
    const newOrders = [];
    for (const template of recurringWorkOrders) {
        if (!template.recurrence || !template.recurrence.nextOccurrence) {
            continue;
        }
        if (template.recurrence.nextOccurrence <= now) {
            try {
                const newOrder = (0, exports.generateRecurringInstance)(template);
                newOrders.push(newOrder);
            }
            catch (error) {
                // Recurrence has ended or other error
                continue;
            }
        }
    }
    return newOrders;
};
exports.checkRecurringWorkOrders = checkRecurringWorkOrders;
// ============================================================================
// EMERGENCY WORK HANDLING
// ============================================================================
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
const escalateToEmergency = (workOrder, escalatedBy, reason) => {
    return {
        ...workOrder,
        isEmergency: true,
        priority: 'critical',
        status: workOrder.status === 'draft' ? 'approved' : workOrder.status,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        updatedAt: new Date(),
        notes: [
            ...(workOrder.notes || []),
            {
                id: `NOTE-${Date.now()}`,
                workOrderId: workOrder.id,
                content: `ESCALATED TO EMERGENCY by ${escalatedBy}: ${reason}`,
                createdBy: escalatedBy,
                createdAt: new Date(),
                isInternal: true,
            },
        ],
    };
};
exports.escalateToEmergency = escalateToEmergency;
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
const sendEmergencyNotifications = (workOrder, recipients) => {
    return {
        workOrderId: workOrder.id,
        type: 'emergency',
        recipients,
        subject: `EMERGENCY WORK ORDER: ${workOrder.title}`,
        message: `Emergency work order created: ${workOrder.description}`,
        sentAt: new Date(),
        channels: ['email', 'sms', 'push'],
    };
};
exports.sendEmergencyNotifications = sendEmergencyNotifications;
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
const findEmergencyTechnicians = (category, technicians) => {
    return technicians
        .filter(tech => tech.skills.includes(category) &&
        tech.isOnCall &&
        tech.isAvailable)
        .map(({ id, name, skills, isOnCall }) => ({
        id,
        name,
        skills,
        isOnCall,
    }));
};
exports.findEmergencyTechnicians = findEmergencyTechnicians;
// ============================================================================
// WORK ORDER ANALYTICS
// ============================================================================
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
const generateWorkOrderAnalytics = (workOrders, startDate, endDate) => {
    const filtered = workOrders.filter(wo => wo.createdAt >= startDate && wo.createdAt <= endDate);
    const completed = filtered.filter(wo => wo.status === 'completed');
    const pending = filtered.filter(wo => !['completed', 'cancelled', 'rejected'].includes(wo.status));
    // Calculate average completion time
    const completionTimes = completed
        .filter(wo => wo.completedAt && wo.createdAt)
        .map(wo => {
        const duration = wo.completedAt.getTime() - wo.createdAt.getTime();
        return duration / (1000 * 60 * 60); // Convert to hours
    });
    const averageCompletionTime = completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;
    // Calculate average cost
    const costs = completed
        .filter(wo => wo.actualCost)
        .map(wo => wo.actualCost);
    const averageCost = costs.length > 0
        ? costs.reduce((a, b) => a + b, 0) / costs.length
        : 0;
    // Group by category
    const byCategory = {};
    filtered.forEach(wo => {
        byCategory[wo.category] = (byCategory[wo.category] || 0) + 1;
    });
    // Group by priority
    const byPriority = {};
    filtered.forEach(wo => {
        byPriority[wo.priority] = (byPriority[wo.priority] || 0) + 1;
    });
    // Group by status
    const byStatus = {};
    filtered.forEach(wo => {
        byStatus[wo.status] = (byStatus[wo.status] || 0) + 1;
    });
    // Calculate completion rate
    const completionRate = filtered.length > 0
        ? (completed.length / filtered.length) * 100
        : 0;
    // Calculate on-time completion rate
    const onTimeCompleted = completed.filter(wo => {
        if (!wo.dueDate || !wo.completedAt)
            return false;
        return wo.completedAt <= wo.dueDate;
    });
    const onTimeCompletionRate = completed.length > 0
        ? (onTimeCompleted.length / completed.length) * 100
        : 0;
    return {
        totalOrders: filtered.length,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
        averageCost: Math.round(averageCost * 100) / 100,
        byCategory,
        byPriority,
        byStatus,
        completionRate: Math.round(completionRate * 100) / 100,
        onTimeCompletionRate: Math.round(onTimeCompletionRate * 100) / 100,
    };
};
exports.generateWorkOrderAnalytics = generateWorkOrderAnalytics;
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
const calculateTechnicianPerformance = (workOrders, technicianId) => {
    const techOrders = workOrders.filter(wo => wo.assignedTo === technicianId);
    const completed = techOrders.filter(wo => wo.status === 'completed');
    const avgCompletionTime = completed.length > 0
        ? completed.reduce((sum, wo) => {
            if (!wo.completedAt)
                return sum;
            const duration = (wo.completedAt.getTime() - wo.createdAt.getTime()) / (1000 * 60 * 60);
            return sum + duration;
        }, 0) / completed.length
        : 0;
    const onTimeCount = completed.filter(wo => {
        if (!wo.dueDate || !wo.completedAt)
            return false;
        return wo.completedAt <= wo.dueDate;
    }).length;
    return {
        technicianId,
        totalAssigned: techOrders.length,
        totalCompleted: completed.length,
        completionRate: techOrders.length > 0
            ? (completed.length / techOrders.length) * 100
            : 0,
        averageCompletionTime: Math.round(avgCompletionTime * 100) / 100,
        onTimeRate: completed.length > 0
            ? (onTimeCount / completed.length) * 100
            : 0,
    };
};
exports.calculateTechnicianPerformance = calculateTechnicianPerformance;
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
const identifyWorkOrderTrends = (workOrders) => {
    // Group by month
    const monthlyVolume = {};
    workOrders.forEach(wo => {
        const monthKey = wo.createdAt.toISOString().substring(0, 7); // YYYY-MM
        monthlyVolume[monthKey] = (monthlyVolume[monthKey] || 0) + 1;
    });
    // Find most common categories
    const categoryCount = {};
    workOrders.forEach(wo => {
        categoryCount[wo.category] = (categoryCount[wo.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));
    // Calculate trend direction
    const months = Object.keys(monthlyVolume).sort();
    const trend = months.length >= 2
        ? monthlyVolume[months[months.length - 1]] > monthlyVolume[months[0]]
            ? 'increasing'
            : 'decreasing'
        : 'stable';
    return {
        monthlyVolume,
        topCategories,
        trend,
        totalWorkOrders: workOrders.length,
    };
};
exports.identifyWorkOrderTrends = identifyWorkOrderTrends;
//# sourceMappingURL=property-work-order-kit.js.map