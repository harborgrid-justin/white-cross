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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  attachments?: WorkOrderAttachment[];
  notes?: WorkOrderNote[];
  recurrence?: RecurrenceConfig;
  isEmergency: boolean;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  tags?: string[];
}

type WorkOrderCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'carpentry'
  | 'painting'
  | 'flooring'
  | 'roofing'
  | 'landscaping'
  | 'cleaning'
  | 'pest_control'
  | 'security'
  | 'general_maintenance'
  | 'other';

type WorkOrderPriority =
  | 'critical'    // Immediate attention required
  | 'high'        // Within 24 hours
  | 'medium'      // Within 3 days
  | 'low';        // Within 7 days

type WorkOrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'scheduled'
  | 'assigned'
  | 'in_progress'
  | 'on_hold'
  | 'pending_review'
  | 'completed'
  | 'cancelled'
  | 'rejected';

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
  duration?: number; // in minutes
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
  interval: number; // e.g., every 2 weeks
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
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
  averageCompletionTime: number; // in hours
  averageCost: number;
  byCategory: Record<WorkOrderCategory, number>;
  byPriority: Record<WorkOrderPriority, number>;
  byStatus: Record<WorkOrderStatus, number>;
  completionRate: number; // percentage
  onTimeCompletionRate: number; // percentage
}

interface WorkOrderTemplate {
  id: string;
  name: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  description: string;
  estimatedCost?: number;
  estimatedDuration?: number;
  checklist?: string[];
  requiredSkills?: string[];
  defaultAssignee?: string;
}

interface WorkOrderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

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
export const createWorkOrder = (workOrderData: Partial<WorkOrder>): WorkOrder => {
  const now = new Date();

  const workOrder: WorkOrder = {
    id: workOrderData.id || `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: workOrderData.propertyId!,
    unitId: workOrderData.unitId,
    category: workOrderData.category || 'general_maintenance',
    priority: workOrderData.priority || 'medium',
    status: workOrderData.status || 'draft',
    title: workOrderData.title || '',
    description: workOrderData.description || '',
    requestedBy: workOrderData.requestedBy!,
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
export const updateWorkOrderStatus = (
  workOrder: WorkOrder,
  newStatus: WorkOrderStatus,
  updatedBy: string,
): WorkOrder => {
  const now = new Date();

  const updated: WorkOrder = {
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
export const assignWorkOrder = (
  workOrder: WorkOrder,
  assigneeId: string,
  assigneeType: 'staff' | 'vendor',
): WorkOrder => {
  return {
    ...workOrder,
    assignedTo: assigneeId,
    assignedToType: assigneeType,
    status: workOrder.status === 'approved' ? 'assigned' : workOrder.status,
    updatedAt: new Date(),
  };
};

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
export const completeWorkOrder = (
  workOrder: WorkOrder,
  actualCost: number,
  actualDuration: number,
  completionNotes: string,
): WorkOrder => {
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
export const cancelWorkOrder = (
  workOrder: WorkOrder,
  cancelledBy: string,
  reason: string,
): WorkOrder => {
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
export const calculatePriorityScore = (workOrder: WorkOrder): number => {
  let score = 0;

  // Priority base score
  const priorityScores: Record<WorkOrderPriority, number> = {
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
  const ageInDays = Math.floor(
    (Date.now() - workOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  score += Math.min(ageInDays * 2, 20); // Cap at +20

  // Overdue penalty
  if (workOrder.dueDate && new Date() > workOrder.dueDate) {
    score += 30;
  }

  return score;
};

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
export const sortWorkOrdersByPriority = (workOrders: WorkOrder[]): WorkOrder[] => {
  return [...workOrders].sort((a, b) => {
    return calculatePriorityScore(b) - calculatePriorityScore(a);
  });
};

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
export const calculateDueDate = (workOrder: WorkOrder): Date => {
  const now = new Date();

  const hoursToAdd: Record<WorkOrderPriority, number> = {
    critical: 4,   // 4 hours
    high: 24,      // 1 day
    medium: 72,    // 3 days
    low: 168,      // 7 days
  };

  const hours = workOrder.isEmergency ? 2 : hoursToAdd[workOrder.priority];

  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

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
export const scheduleWorkOrder = (
  workOrder: WorkOrder,
  scheduledDate: Date,
  assignedTo: string,
): WorkOrderSchedule => {
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
export const checkSchedulingConflict = (
  technicianId: string,
  proposedDate: Date,
  duration: number,
  existingSchedules: WorkOrderSchedule[],
): boolean => {
  const proposedEnd = new Date(proposedDate.getTime() + duration * 60 * 1000);

  return existingSchedules
    .filter(schedule => schedule.assignedTo === technicianId)
    .some(schedule => {
      const existingStart = schedule.scheduledDate;
      const existingEnd = new Date(
        existingStart.getTime() + schedule.estimatedDuration * 60 * 1000
      );

      // Check for overlap
      return (
        (proposedDate >= existingStart && proposedDate < existingEnd) ||
        (proposedEnd > existingStart && proposedEnd <= existingEnd) ||
        (proposedDate <= existingStart && proposedEnd >= existingEnd)
      );
    });
};

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
export const getWorkOrderStatusHistory = (
  workOrder: WorkOrder,
): Array<{ status: WorkOrderStatus; timestamp: Date }> => {
  // In a real implementation, this would retrieve from a database
  // For now, we construct from available data
  const history: Array<{ status: WorkOrderStatus; timestamp: Date }> = [];

  history.push({ status: 'draft', timestamp: workOrder.createdAt });

  if (workOrder.status !== 'draft') {
    history.push({ status: workOrder.status, timestamp: workOrder.updatedAt });
  }

  if (workOrder.completedAt) {
    history.push({ status: 'completed', timestamp: workOrder.completedAt });
  }

  return history;
};

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
export const isWorkOrderOverdue = (workOrder: WorkOrder): boolean => {
  if (!workOrder.dueDate || workOrder.status === 'completed' || workOrder.status === 'cancelled') {
    return false;
  }

  return new Date() > workOrder.dueDate;
};

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
export const getTimeUntilDue = (workOrder: WorkOrder): number => {
  if (!workOrder.dueDate) {
    return Infinity;
  }

  const now = new Date();
  const diffMs = workOrder.dueDate.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

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
export const getWorkOrdersByStatus = (
  workOrders: WorkOrder[],
  status: WorkOrderStatus,
): WorkOrder[] => {
  return workOrders.filter(wo => wo.status === status);
};

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
export const calculateWorkOrderProgress = (workOrder: WorkOrder): number => {
  const statusProgress: Record<WorkOrderStatus, number> = {
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
export const formatWorkOrderForMobile = (workOrder: WorkOrder): object => {
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
export const generateWorkOrderQRCode = (
  workOrder: WorkOrder,
  baseUrl: string,
): string => {
  return `${baseUrl}/workorders/${workOrder.id}`;
};

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
export const createMobileCheckIn = (
  workOrderId: string,
  technicianId: string,
  location: { latitude: number; longitude: number },
): object => {
  return {
    workOrderId,
    technicianId,
    checkInTime: new Date(),
    location,
    status: 'checked_in',
  };
};

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
export const uploadMobileAttachment = async (
  workOrderId: string,
  file: File | Blob,
  uploadedBy: string,
  stage: 'before' | 'during' | 'after',
): Promise<WorkOrderAttachment> => {
  // In production, this would upload to cloud storage
  const attachment: WorkOrderAttachment = {
    id: `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workOrderId,
    type: file.type.startsWith('image/') ? 'image' : 'document',
    url: `https://storage.example.com/${workOrderId}/${Date.now()}`,
    filename: (file as File).name || 'attachment',
    uploadedBy,
    uploadedAt: new Date(),
    description: `${stage} photo`,
  };

  return attachment;
};

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
export const syncMobileWorkOrders = async (
  updates: Partial<WorkOrder>[],
): Promise<{ synced: number; failed: number }> => {
  // In production, this would sync with backend
  let synced = 0;
  let failed = 0;

  for (const update of updates) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      synced++;
    } catch (error) {
      failed++;
    }
  }

  return { synced, failed };
};

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
export const validateWorkOrderCompletion = (
  workOrder: WorkOrder,
): WorkOrderValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

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
export const requestTenantVerification = (
  workOrder: WorkOrder,
  tenantEmail: string,
): object => {
  return {
    workOrderId: workOrder.id,
    tenantEmail,
    requestedAt: new Date(),
    verificationUrl: `https://portal.example.com/verify/${workOrder.id}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
};

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
export const recordTenantFeedback = (
  workOrderId: string,
  rating: number,
  feedback: string,
  satisfactory: boolean,
): object => {
  return {
    workOrderId,
    rating: Math.max(1, Math.min(5, rating)), // Clamp to 1-5
    feedback,
    satisfactory,
    submittedAt: new Date(),
  };
};

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
export const createQualityChecklist = (category: WorkOrderCategory): string[] => {
  const checklists: Record<WorkOrderCategory, string[]> = {
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
export const startLaborTracking = (
  workOrderId: string,
  technicianId: string,
  technicianName: string,
): LaborEntry => {
  return {
    id: `LABOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workOrderId,
    technicianId,
    technicianName,
    startTime: new Date(),
  };
};

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
export const stopLaborTracking = (
  laborEntry: LaborEntry,
  hourlyRate: number,
): LaborEntry => {
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
export const calculateTotalLaborCost = (laborEntries: LaborEntry[]): number => {
  return laborEntries.reduce((total, entry) => {
    return total + (entry.laborCost || 0);
  }, 0);
};

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
export const getLaborEntriesByWorkOrder = (
  allEntries: LaborEntry[],
  workOrderId: string,
): LaborEntry[] => {
  return allEntries.filter(entry => entry.workOrderId === workOrderId);
};

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
export const generateLaborSummary = (
  laborEntries: LaborEntry[],
  technicianId: string,
  startDate: Date,
  endDate: Date,
): object => {
  const filtered = laborEntries.filter(entry => {
    return (
      entry.technicianId === technicianId &&
      entry.startTime >= startDate &&
      entry.startTime <= endDate
    );
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
export const calculateWorkOrderCost = (
  laborCost: number,
  materialCost: number,
  equipmentCost: number,
  otherCosts: number,
): Omit<WorkOrderCost, 'workOrderId'> => {
  const totalCost = laborCost + materialCost + equipmentCost + otherCosts;

  return {
    laborCost,
    materialCost,
    equipmentCost,
    otherCosts,
    totalCost: Math.round(totalCost * 100) / 100,
  };
};

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
export const estimateWorkOrderCost = (
  category: WorkOrderCategory,
  priority: WorkOrderPriority,
  estimatedHours: number,
): number => {
  // Base hourly rates by category
  const categoryRates: Record<WorkOrderCategory, number> = {
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
  const priorityMultipliers: Record<WorkOrderPriority, number> = {
    critical: 1.5,
    high: 1.25,
    medium: 1.0,
    low: 0.9,
  };

  const baseRate = categoryRates[category];
  const multiplier = priorityMultipliers[priority];

  return Math.round(baseRate * multiplier * estimatedHours * 100) / 100;
};

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
export const analyzeCostVariance = (
  estimatedCost: number,
  actualCost: number,
): {
  variance: number;
  percentVariance: number;
  isOverBudget: boolean;
  description: string;
} => {
  const variance = actualCost - estimatedCost;
  const percentVariance = estimatedCost > 0
    ? (variance / estimatedCost) * 100
    : 0;

  let description = '';
  if (Math.abs(percentVariance) < 5) {
    description = 'On budget';
  } else if (percentVariance > 0) {
    description = `Over budget by ${percentVariance.toFixed(1)}%`;
  } else {
    description = `Under budget by ${Math.abs(percentVariance).toFixed(1)}%`;
  }

  return {
    variance: Math.round(variance * 100) / 100,
    percentVariance: Math.round(percentVariance * 100) / 100,
    isOverBudget: variance > 0,
    description,
  };
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
export const generateCostBreakdown = (
  workOrder: WorkOrder,
  laborEntries: LaborEntry[],
): object => {
  const laborCost = calculateTotalLaborCost(laborEntries);

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
      ? analyzeCostVariance(workOrder.estimatedCost, workOrder.actualCost)
      : null,
    laborHours: laborEntries.reduce((sum, e) => sum + ((e.duration || 0) / 60), 0),
  };
};

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
export const createRecurringWorkOrder = (
  baseWorkOrder: Partial<WorkOrder>,
  recurrence: RecurrenceConfig,
): WorkOrder => {
  const workOrder = createWorkOrder(baseWorkOrder);

  return {
    ...workOrder,
    recurrence: {
      ...recurrence,
      nextOccurrence: calculateNextOccurrence(recurrence),
    },
  };
};

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
export const calculateNextOccurrence = (recurrence: RecurrenceConfig): Date => {
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
export const generateRecurringInstance = (recurringWorkOrder: WorkOrder): WorkOrder => {
  if (!recurringWorkOrder.recurrence) {
    throw new Error('Work order is not recurring');
  }

  const nextDate = calculateNextOccurrence(recurringWorkOrder.recurrence);

  // Check if we've reached the end date
  if (
    recurringWorkOrder.recurrence.endDate &&
    nextDate > recurringWorkOrder.recurrence.endDate
  ) {
    throw new Error('Recurrence has ended');
  }

  const newWorkOrder = createWorkOrder({
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
export const checkRecurringWorkOrders = (recurringWorkOrders: WorkOrder[]): WorkOrder[] => {
  const now = new Date();
  const newOrders: WorkOrder[] = [];

  for (const template of recurringWorkOrders) {
    if (!template.recurrence || !template.recurrence.nextOccurrence) {
      continue;
    }

    if (template.recurrence.nextOccurrence <= now) {
      try {
        const newOrder = generateRecurringInstance(template);
        newOrders.push(newOrder);
      } catch (error) {
        // Recurrence has ended or other error
        continue;
      }
    }
  }

  return newOrders;
};

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
export const escalateToEmergency = (
  workOrder: WorkOrder,
  escalatedBy: string,
  reason: string,
): WorkOrder => {
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
export const sendEmergencyNotifications = (
  workOrder: WorkOrder,
  recipients: string[],
): object => {
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
export const findEmergencyTechnicians = (
  category: WorkOrderCategory,
  technicians: Array<{
    id: string;
    name: string;
    skills: WorkOrderCategory[];
    isOnCall: boolean;
    isAvailable: boolean;
  }>,
): Array<{
  id: string;
  name: string;
  skills: WorkOrderCategory[];
  isOnCall: boolean;
}> => {
  return technicians
    .filter(tech =>
      tech.skills.includes(category) &&
      tech.isOnCall &&
      tech.isAvailable
    )
    .map(({ id, name, skills, isOnCall }) => ({
      id,
      name,
      skills,
      isOnCall,
    }));
};

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
export const generateWorkOrderAnalytics = (
  workOrders: WorkOrder[],
  startDate: Date,
  endDate: Date,
): WorkOrderAnalytics => {
  const filtered = workOrders.filter(wo =>
    wo.createdAt >= startDate && wo.createdAt <= endDate
  );

  const completed = filtered.filter(wo => wo.status === 'completed');
  const pending = filtered.filter(wo =>
    !['completed', 'cancelled', 'rejected'].includes(wo.status)
  );

  // Calculate average completion time
  const completionTimes = completed
    .filter(wo => wo.completedAt && wo.createdAt)
    .map(wo => {
      const duration = wo.completedAt!.getTime() - wo.createdAt.getTime();
      return duration / (1000 * 60 * 60); // Convert to hours
    });

  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : 0;

  // Calculate average cost
  const costs = completed
    .filter(wo => wo.actualCost)
    .map(wo => wo.actualCost!);

  const averageCost = costs.length > 0
    ? costs.reduce((a, b) => a + b, 0) / costs.length
    : 0;

  // Group by category
  const byCategory = {} as Record<WorkOrderCategory, number>;
  filtered.forEach(wo => {
    byCategory[wo.category] = (byCategory[wo.category] || 0) + 1;
  });

  // Group by priority
  const byPriority = {} as Record<WorkOrderPriority, number>;
  filtered.forEach(wo => {
    byPriority[wo.priority] = (byPriority[wo.priority] || 0) + 1;
  });

  // Group by status
  const byStatus = {} as Record<WorkOrderStatus, number>;
  filtered.forEach(wo => {
    byStatus[wo.status] = (byStatus[wo.status] || 0) + 1;
  });

  // Calculate completion rate
  const completionRate = filtered.length > 0
    ? (completed.length / filtered.length) * 100
    : 0;

  // Calculate on-time completion rate
  const onTimeCompleted = completed.filter(wo => {
    if (!wo.dueDate || !wo.completedAt) return false;
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
export const calculateTechnicianPerformance = (
  workOrders: WorkOrder[],
  technicianId: string,
): object => {
  const techOrders = workOrders.filter(wo => wo.assignedTo === technicianId);
  const completed = techOrders.filter(wo => wo.status === 'completed');

  const avgCompletionTime = completed.length > 0
    ? completed.reduce((sum, wo) => {
        if (!wo.completedAt) return sum;
        const duration = (wo.completedAt.getTime() - wo.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + duration;
      }, 0) / completed.length
    : 0;

  const onTimeCount = completed.filter(wo => {
    if (!wo.dueDate || !wo.completedAt) return false;
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
export const identifyWorkOrderTrends = (workOrders: WorkOrder[]): object => {
  // Group by month
  const monthlyVolume: Record<string, number> = {};

  workOrders.forEach(wo => {
    const monthKey = wo.createdAt.toISOString().substring(0, 7); // YYYY-MM
    monthlyVolume[monthKey] = (monthlyVolume[monthKey] || 0) + 1;
  });

  // Find most common categories
  const categoryCount: Record<string, number> = {};
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
