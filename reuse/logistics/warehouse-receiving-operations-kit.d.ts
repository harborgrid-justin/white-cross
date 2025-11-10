/**
 * LOC: WH-RCV-001
 * File: /reuse/logistics/warehouse-receiving-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse controllers
 *   - Receiving services
 *   - Inventory management
 *   - Putaway processors
 */
/**
 * Receiving appointment status enumeration
 */
export declare enum ReceivingAppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
/**
 * Receiving method types
 */
export declare enum ReceivingMethod {
    DOCK_RECEIVING = "DOCK_RECEIVING",
    CROSS_DOCK = "CROSS_DOCK",
    DIRECT_PUTAWAY = "DIRECT_PUTAWAY",
    BULK_RECEIVING = "BULK_RECEIVING",
    DROP_SHIP = "DROP_SHIP"
}
/**
 * ASN (Advanced Ship Notice) status
 */
export declare enum ASNStatus {
    CREATED = "CREATED",
    TRANSMITTED = "TRANSMITTED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    IN_TRANSIT = "IN_TRANSIT",
    ARRIVED = "ARRIVED",
    RECEIVING = "RECEIVING",
    RECEIVED = "RECEIVED",
    CLOSED = "CLOSED",
    DISCREPANCY = "DISCREPANCY"
}
/**
 * Quality inspection status
 */
export declare enum QualityInspectionStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    PASSED = "PASSED",
    FAILED = "FAILED",
    QUARANTINED = "QUARANTINED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
/**
 * Putaway strategy types
 */
export declare enum PutawayStrategy {
    FIXED_LOCATION = "FIXED_LOCATION",
    DIRECTED_PUTAWAY = "DIRECTED_PUTAWAY",
    NEAREST_LOCATION = "NEAREST_LOCATION",
    ZONE_BASED = "ZONE_BASED",
    ABC_CLASSIFICATION = "ABC_CLASSIFICATION",
    FIFO = "FIFO",
    LIFO = "LIFO",
    FEFO = "FEFO"
}
/**
 * Cross-docking status
 */
export declare enum CrossDockingStatus {
    IDENTIFIED = "IDENTIFIED",
    STAGED = "STAGED",
    IN_TRANSFER = "IN_TRANSFER",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
/**
 * Receiving appointment details
 */
export interface ReceivingAppointment {
    appointmentId: string;
    appointmentNumber: string;
    supplierId: string;
    supplierName: string;
    warehouseId: string;
    dockDoor?: string;
    scheduledDate: Date;
    scheduledTimeStart: Date;
    scheduledTimeEnd: Date;
    actualArrivalTime?: Date;
    actualDepartureTime?: Date;
    status: ReceivingAppointmentStatus;
    method: ReceivingMethod;
    expectedPallets?: number;
    expectedWeight?: number;
    carrierName?: string;
    trailerNumber?: string;
    sealNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * ASN line item
 */
export interface ASNLineItem {
    lineItemId: string;
    lineNumber: number;
    productId: string;
    sku: string;
    description: string;
    expectedQuantity: number;
    receivedQuantity: number;
    unitOfMeasure: string;
    lotNumber?: string;
    serialNumbers?: string[];
    expirationDate?: Date;
    countryOfOrigin?: string;
    unitCost?: number;
    metadata?: Record<string, any>;
}
/**
 * Advanced Ship Notice (ASN)
 */
export interface ASN {
    asnId: string;
    asnNumber: string;
    purchaseOrderId?: string;
    purchaseOrderNumber?: string;
    supplierId: string;
    supplierName: string;
    warehouseId: string;
    appointmentId?: string;
    status: ASNStatus;
    shipDate?: Date;
    expectedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    carrierName?: string;
    trackingNumber?: string;
    bolNumber?: string;
    proNumber?: string;
    lineItems: ASNLineItem[];
    totalExpectedQuantity: number;
    totalReceivedQuantity: number;
    createdAt: Date;
    receivedAt?: Date;
    closedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Inspection result for individual item
 */
export interface InspectionResult {
    inspectionResultId: string;
    lineItemId: string;
    productId: string;
    sku: string;
    quantityInspected: number;
    quantityPassed: number;
    quantityFailed: number;
    defectTypes?: string[];
    defectDescription?: string;
    photos?: string[];
    inspectedBy: string;
    inspectedAt: Date;
}
/**
 * Quality inspection record
 */
export interface QualityInspection {
    inspectionId: string;
    inspectionNumber: string;
    asnId: string;
    warehouseId: string;
    inspectionType: 'FULL' | 'SAMPLE' | 'SKIP';
    status: QualityInspectionStatus;
    sampleSize?: number;
    results: InspectionResult[];
    overallQualityScore?: number;
    inspectionCriteria?: Record<string, any>;
    startedAt?: Date;
    completedAt?: Date;
    inspectedBy?: string;
    approvedBy?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Putaway location details
 */
export interface PutawayLocation {
    locationId: string;
    locationCode: string;
    warehouseId: string;
    zone: string;
    aisle?: string;
    bay?: string;
    level?: string;
    position?: string;
    locationType: 'BULK' | 'PALLET' | 'SHELF' | 'FLOOR' | 'STAGING';
    capacity: number;
    currentOccupancy: number;
    availableCapacity: number;
    isActive: boolean;
    restrictedProducts?: string[];
    temperature?: number;
    metadata?: Record<string, any>;
}
/**
 * Putaway task
 */
export interface PutawayTask {
    taskId: string;
    taskNumber: string;
    asnId: string;
    lineItemId: string;
    productId: string;
    sku: string;
    quantity: number;
    unitOfMeasure: string;
    fromLocationId: string;
    toLocationId?: string;
    strategy: PutawayStrategy;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedTo?: string;
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    lotNumber?: string;
    expirationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Cross-dock order
 */
export interface CrossDockOrder {
    crossDockId: string;
    crossDockNumber: string;
    inboundASNId: string;
    outboundOrderId: string;
    warehouseId: string;
    productId: string;
    sku: string;
    quantity: number;
    stagingLocationId?: string;
    outboundDockDoor?: string;
    status: CrossDockingStatus;
    scheduledShipDate?: Date;
    actualShipDate?: Date;
    createdAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Receiving configuration
 */
export interface ReceivingConfig {
    warehouseId: string;
    requireAppointment: boolean;
    requireASN: boolean;
    requireQualityInspection: boolean;
    defaultInspectionType: 'FULL' | 'SAMPLE' | 'SKIP';
    samplePercentage?: number;
    appointmentWindowMinutes: number;
    autoAssignDockDoors: boolean;
    enableCrossDocking: boolean;
    defaultPutawayStrategy: PutawayStrategy;
}
/**
 * Receiving discrepancy
 */
export interface ReceivingDiscrepancy {
    discrepancyId: string;
    asnId: string;
    lineItemId: string;
    type: 'OVERAGE' | 'SHORTAGE' | 'DAMAGE' | 'WRONG_PRODUCT' | 'QUALITY_ISSUE';
    expectedQuantity: number;
    actualQuantity: number;
    variance: number;
    description: string;
    resolutionStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
    resolutionNotes?: string;
    reportedBy: string;
    reportedAt: Date;
}
/**
 * 1. Creates a new receiving appointment.
 *
 * @param {Partial<ReceivingAppointment>} appointment - Appointment details
 * @returns {ReceivingAppointment} New appointment object
 *
 * @example
 * ```typescript
 * const appointment = createReceivingAppointment({
 *   supplierId: 'SUP-001',
 *   supplierName: 'Acme Supplies',
 *   warehouseId: 'WH-MAIN',
 *   scheduledDate: new Date('2025-01-15'),
 *   scheduledTimeStart: new Date('2025-01-15T08:00:00'),
 *   scheduledTimeEnd: new Date('2025-01-15T10:00:00'),
 *   method: ReceivingMethod.DOCK_RECEIVING
 * });
 * ```
 */
export declare function createReceivingAppointment(appointment: Partial<ReceivingAppointment>): ReceivingAppointment;
/**
 * 2. Schedules appointment with automatic dock door assignment.
 *
 * @param {ReceivingAppointment} appointment - Appointment to schedule
 * @param {string[]} availableDockDoors - Available dock doors
 * @returns {ReceivingAppointment} Updated appointment
 *
 * @example
 * ```typescript
 * const scheduled = scheduleAppointment(appointment, ['DOCK-A1', 'DOCK-A2', 'DOCK-A3']);
 * ```
 */
export declare function scheduleAppointment(appointment: ReceivingAppointment, availableDockDoors: string[]): ReceivingAppointment;
/**
 * 3. Updates appointment status.
 *
 * @param {ReceivingAppointment} appointment - Appointment to update
 * @param {ReceivingAppointmentStatus} status - New status
 * @returns {ReceivingAppointment} Updated appointment
 *
 * @example
 * ```typescript
 * const updated = updateAppointmentStatus(appointment, ReceivingAppointmentStatus.CONFIRMED);
 * ```
 */
export declare function updateAppointmentStatus(appointment: ReceivingAppointment, status: ReceivingAppointmentStatus): ReceivingAppointment;
/**
 * 4. Checks in an appointment upon arrival.
 *
 * @param {ReceivingAppointment} appointment - Appointment to check in
 * @param {string} trailerNumber - Trailer number
 * @param {string} sealNumber - Seal number
 * @returns {ReceivingAppointment} Checked-in appointment
 *
 * @example
 * ```typescript
 * const checkedIn = checkInAppointment(appointment, 'TRL-12345', 'SEAL-67890');
 * ```
 */
export declare function checkInAppointment(appointment: ReceivingAppointment, trailerNumber?: string, sealNumber?: string): ReceivingAppointment;
/**
 * 5. Validates appointment time window.
 *
 * @param {ReceivingAppointment} appointment - Appointment to validate
 * @param {Date} arrivalTime - Actual arrival time
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateAppointmentWindow(appointment, new Date());
 * if (!result.valid) {
 *   console.log(result.reason);
 * }
 * ```
 */
export declare function validateAppointmentWindow(appointment: ReceivingAppointment, arrivalTime: Date): {
    valid: boolean;
    reason?: string;
    minutesEarly?: number;
    minutesLate?: number;
};
/**
 * 6. Reschedules an existing appointment.
 *
 * @param {ReceivingAppointment} appointment - Appointment to reschedule
 * @param {Date} newStartTime - New start time
 * @param {Date} newEndTime - New end time
 * @returns {ReceivingAppointment} Rescheduled appointment
 *
 * @example
 * ```typescript
 * const rescheduled = rescheduleAppointment(
 *   appointment,
 *   new Date('2025-01-16T10:00:00'),
 *   new Date('2025-01-16T12:00:00')
 * );
 * ```
 */
export declare function rescheduleAppointment(appointment: ReceivingAppointment, newStartTime: Date, newEndTime: Date): ReceivingAppointment;
/**
 * 7. Cancels an appointment.
 *
 * @param {ReceivingAppointment} appointment - Appointment to cancel
 * @param {string} reason - Cancellation reason
 * @returns {ReceivingAppointment} Cancelled appointment
 *
 * @example
 * ```typescript
 * const cancelled = cancelAppointment(appointment, 'Shipment delayed by supplier');
 * ```
 */
export declare function cancelAppointment(appointment: ReceivingAppointment, reason: string): ReceivingAppointment;
/**
 * 8. Retrieves appointments by date range.
 *
 * @param {ReceivingAppointment[]} appointments - All appointments
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {ReceivingAppointment[]} Filtered appointments
 *
 * @example
 * ```typescript
 * const todayAppointments = getAppointmentsByDate(
 *   allAppointments,
 *   new Date('2025-01-15T00:00:00'),
 *   new Date('2025-01-15T23:59:59')
 * );
 * ```
 */
export declare function getAppointmentsByDate(appointments: ReceivingAppointment[], startDate: Date, endDate: Date): ReceivingAppointment[];
/**
 * 9. Creates a new Advanced Ship Notice (ASN).
 *
 * @param {Partial<ASN>} asn - ASN details
 * @returns {ASN} New ASN object
 *
 * @example
 * ```typescript
 * const asn = createASN({
 *   purchaseOrderNumber: 'PO-12345',
 *   supplierId: 'SUP-001',
 *   supplierName: 'Acme Supplies',
 *   warehouseId: 'WH-MAIN',
 *   expectedDeliveryDate: new Date('2025-01-15')
 * });
 * ```
 */
export declare function createASN(asn: Partial<ASN>): ASN;
/**
 * 10. Validates ASN completeness and data integrity.
 *
 * @param {ASN} asn - ASN to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateASN(asn);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateASN(asn: ASN): {
    valid: boolean;
    errors: string[];
};
/**
 * 11. Adds a line item to the ASN.
 *
 * @param {ASN} asn - ASN to update
 * @param {Partial<ASNLineItem>} item - Line item details
 * @returns {ASN} Updated ASN
 *
 * @example
 * ```typescript
 * const updated = addASNLineItem(asn, {
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   description: 'Premium Widget',
 *   expectedQuantity: 100,
 *   unitOfMeasure: 'EA',
 *   lotNumber: 'LOT-2025-001'
 * });
 * ```
 */
export declare function addASNLineItem(asn: ASN, item: Partial<ASNLineItem>): ASN;
/**
 * 12. Removes a line item from the ASN.
 *
 * @param {ASN} asn - ASN to update
 * @param {string} lineItemId - Line item ID to remove
 * @returns {ASN} Updated ASN
 *
 * @example
 * ```typescript
 * const updated = removeASNLineItem(asn, 'line-item-123');
 * ```
 */
export declare function removeASNLineItem(asn: ASN, lineItemId: string): ASN;
/**
 * 13. Matches ASN to receiving appointment.
 *
 * @param {ASN} asn - ASN to match
 * @param {string} appointmentId - Appointment ID
 * @returns {ASN} Updated ASN
 *
 * @example
 * ```typescript
 * const matched = matchASNToAppointment(asn, 'APT-12345');
 * ```
 */
export declare function matchASNToAppointment(asn: ASN, appointmentId: string): ASN;
/**
 * 14. Updates ASN status.
 *
 * @param {ASN} asn - ASN to update
 * @param {ASNStatus} status - New status
 * @returns {ASN} Updated ASN
 *
 * @example
 * ```typescript
 * const updated = updateASNStatus(asn, ASNStatus.IN_TRANSIT);
 * ```
 */
export declare function updateASNStatus(asn: ASN, status: ASNStatus): ASN;
/**
 * 15. Records receipt of ASN line items.
 *
 * @param {ASN} asn - ASN to receive
 * @param {string} lineItemId - Line item ID
 * @param {number} quantity - Quantity received
 * @returns {ASN} Updated ASN
 *
 * @example
 * ```typescript
 * const updated = receiveASN(asn, 'line-item-123', 95);
 * ```
 */
export declare function receiveASN(asn: ASN, lineItemId: string, quantity: number): ASN;
/**
 * 16. Closes ASN after receiving is complete.
 *
 * @param {ASN} asn - ASN to close
 * @returns {ASN} Closed ASN
 *
 * @example
 * ```typescript
 * const closed = closeASN(asn);
 * ```
 */
export declare function closeASN(asn: ASN): ASN;
/**
 * 17. Generates discrepancy report for ASN variances.
 *
 * @param {ASN} asn - ASN to analyze
 * @returns {ReceivingDiscrepancy[]} Discrepancies found
 *
 * @example
 * ```typescript
 * const discrepancies = generateASNDiscrepancyReport(asn);
 * ```
 */
export declare function generateASNDiscrepancyReport(asn: ASN): ReceivingDiscrepancy[];
/**
 * 18. Creates a quality inspection for received goods.
 *
 * @param {string} asnId - ASN ID
 * @param {string} warehouseId - Warehouse ID
 * @param {string} inspectionType - Inspection type
 * @returns {QualityInspection} New inspection object
 *
 * @example
 * ```typescript
 * const inspection = createQualityInspection('ASN-001', 'WH-MAIN', 'SAMPLE');
 * ```
 */
export declare function createQualityInspection(asnId: string, warehouseId: string, inspectionType?: 'FULL' | 'SAMPLE' | 'SKIP'): QualityInspection;
/**
 * 19. Performs inspection on received items.
 *
 * @param {QualityInspection} inspection - Inspection to update
 * @param {string} inspectedBy - Inspector ID
 * @returns {QualityInspection} Updated inspection
 *
 * @example
 * ```typescript
 * const updated = performInspection(inspection, 'INSPECTOR-001');
 * ```
 */
export declare function performInspection(inspection: QualityInspection, inspectedBy: string): QualityInspection;
/**
 * 20. Records inspection result for line item.
 *
 * @param {QualityInspection} inspection - Inspection to update
 * @param {Partial<InspectionResult>} result - Inspection result
 * @returns {QualityInspection} Updated inspection
 *
 * @example
 * ```typescript
 * const updated = recordInspectionResult(inspection, {
 *   lineItemId: 'line-001',
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   quantityInspected: 50,
 *   quantityPassed: 48,
 *   quantityFailed: 2,
 *   defectTypes: ['DAMAGED_PACKAGING'],
 *   inspectedBy: 'INSPECTOR-001'
 * });
 * ```
 */
export declare function recordInspectionResult(inspection: QualityInspection, result: Partial<InspectionResult>): QualityInspection;
/**
 * 21. Fails inspection and quarantines items.
 *
 * @param {QualityInspection} inspection - Inspection to fail
 * @param {string} reason - Failure reason
 * @returns {QualityInspection} Failed inspection
 *
 * @example
 * ```typescript
 * const failed = failInspection(inspection, 'Excessive damage detected');
 * ```
 */
export declare function failInspection(inspection: QualityInspection, reason: string): QualityInspection;
/**
 * 22. Passes inspection and approves for putaway.
 *
 * @param {QualityInspection} inspection - Inspection to pass
 * @param {string} approvedBy - Approver ID
 * @returns {QualityInspection} Passed inspection
 *
 * @example
 * ```typescript
 * const passed = passInspection(inspection, 'SUPERVISOR-001');
 * ```
 */
export declare function passInspection(inspection: QualityInspection, approvedBy: string): QualityInspection;
/**
 * 23. Quarantines items that fail inspection.
 *
 * @param {QualityInspection} inspection - Inspection with failed items
 * @param {string} quarantineLocationId - Quarantine location
 * @returns {object} Quarantine details
 *
 * @example
 * ```typescript
 * const quarantine = quarantineItem(inspection, 'LOC-QUARANTINE-01');
 * ```
 */
export declare function quarantineItem(inspection: QualityInspection, quarantineLocationId: string): {
    quarantineId: string;
    inspectionId: string;
    locationId: string;
    items: Array<{
        lineItemId: string;
        quantity: number;
    }>;
    quarantinedAt: Date;
};
/**
 * 24. Generates detailed inspection report.
 *
 * @param {QualityInspection} inspection - Inspection to report
 * @returns {object} Inspection report
 *
 * @example
 * ```typescript
 * const report = generateInspectionReport(inspection);
 * ```
 */
export declare function generateInspectionReport(inspection: QualityInspection): {
    inspectionId: string;
    inspectionNumber: string;
    asnId: string;
    status: QualityInspectionStatus;
    totalInspected: number;
    totalPassed: number;
    totalFailed: number;
    passRate: number;
    qualityScore: number;
    defectSummary: Record<string, number>;
    duration?: number;
};
/**
 * 25. Calculates overall quality score for inspection.
 *
 * @param {QualityInspection} inspection - Inspection to score
 * @returns {number} Quality score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateQualityScore(inspection);
 * // Returns: 96.5
 * ```
 */
export declare function calculateQualityScore(inspection: QualityInspection): number;
/**
 * 26. Creates putaway task for received items.
 *
 * @param {string} asnId - ASN ID
 * @param {ASNLineItem} lineItem - Line item to put away
 * @param {string} fromLocationId - Staging location
 * @param {PutawayStrategy} strategy - Putaway strategy
 * @returns {PutawayTask} New putaway task
 *
 * @example
 * ```typescript
 * const task = createPutawayTask('ASN-001', lineItem, 'LOC-STAGING-01', PutawayStrategy.DIRECTED_PUTAWAY);
 * ```
 */
export declare function createPutawayTask(asnId: string, lineItem: ASNLineItem, fromLocationId: string, strategy?: PutawayStrategy): PutawayTask;
/**
 * 27. Assigns optimal putaway location based on strategy.
 *
 * @param {PutawayTask} task - Putaway task
 * @param {PutawayLocation[]} availableLocations - Available locations
 * @returns {PutawayTask} Updated task with location
 *
 * @example
 * ```typescript
 * const assigned = assignPutawayLocation(task, availableLocations);
 * ```
 */
export declare function assignPutawayLocation(task: PutawayTask, availableLocations: PutawayLocation[]): PutawayTask;
/**
 * 28. Executes putaway task.
 *
 * @param {PutawayTask} task - Task to execute
 * @param {string} assignedTo - Worker ID
 * @returns {PutawayTask} Updated task
 *
 * @example
 * ```typescript
 * const executing = executePutaway(task, 'WORKER-001');
 * ```
 */
export declare function executePutaway(task: PutawayTask, assignedTo: string): PutawayTask;
/**
 * 29. Validates putaway location capacity and restrictions.
 *
 * @param {PutawayLocation} location - Location to validate
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to put away
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePutawayLocation(location, 'PROD-001', 50);
 * ```
 */
export declare function validatePutawayLocation(location: PutawayLocation, productId: string, quantity: number): {
    valid: boolean;
    reason?: string;
};
/**
 * 30. Optimizes putaway path for multiple tasks.
 *
 * @param {PutawayTask[]} tasks - Tasks to optimize
 * @returns {PutawayTask[]} Optimized task order
 *
 * @example
 * ```typescript
 * const optimized = optimizePutawayPath(tasks);
 * ```
 */
export declare function optimizePutawayPath(tasks: PutawayTask[]): PutawayTask[];
/**
 * 31. Creates multiple putaway tasks in bulk.
 *
 * @param {ASN} asn - ASN with received items
 * @param {string} stagingLocationId - Staging location
 * @param {PutawayStrategy} strategy - Putaway strategy
 * @returns {PutawayTask[]} Created tasks
 *
 * @example
 * ```typescript
 * const tasks = bulkCreatePutawayTasks(asn, 'LOC-STAGING-01', PutawayStrategy.DIRECTED_PUTAWAY);
 * ```
 */
export declare function bulkCreatePutawayTasks(asn: ASN, stagingLocationId: string, strategy?: PutawayStrategy): PutawayTask[];
/**
 * 32. Completes putaway task and updates inventory.
 *
 * @param {PutawayTask} task - Task to complete
 * @returns {PutawayTask} Completed task
 *
 * @example
 * ```typescript
 * const completed = completePutawayTask(task);
 * ```
 */
export declare function completePutawayTask(task: PutawayTask): PutawayTask;
/**
 * 33. Generates prioritized putaway work list.
 *
 * @param {PutawayTask[]} tasks - All pending tasks
 * @param {string} workerId - Worker ID
 * @returns {PutawayTask[]} Prioritized task list
 *
 * @example
 * ```typescript
 * const workList = generatePutawayWorkList(tasks, 'WORKER-001');
 * ```
 */
export declare function generatePutawayWorkList(tasks: PutawayTask[], workerId?: string): PutawayTask[];
/**
 * 34. Creates cross-dock order for direct transfer.
 *
 * @param {string} inboundASNId - Inbound ASN ID
 * @param {string} outboundOrderId - Outbound order ID
 * @param {string} warehouseId - Warehouse ID
 * @param {Partial<CrossDockOrder>} details - Cross-dock details
 * @returns {CrossDockOrder} New cross-dock order
 *
 * @example
 * ```typescript
 * const crossDock = createCrossDockOrder('ASN-001', 'ORDER-123', 'WH-MAIN', {
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   quantity: 50
 * });
 * ```
 */
export declare function createCrossDockOrder(inboundASNId: string, outboundOrderId: string, warehouseId: string, details: Partial<CrossDockOrder>): CrossDockOrder;
/**
 * 35. Validates cross-dock eligibility.
 *
 * @param {ASNLineItem} inboundItem - Inbound line item
 * @param {object} outboundDemand - Outbound demand
 * @returns {object} Eligibility result
 *
 * @example
 * ```typescript
 * const result = validateCrossDockEligibility(lineItem, { sku: 'SKU-12345', quantity: 50 });
 * ```
 */
export declare function validateCrossDockEligibility(inboundItem: ASNLineItem, outboundDemand: {
    sku: string;
    quantity: number;
    shipDate?: Date;
}): {
    eligible: boolean;
    reason?: string;
    matchedQuantity?: number;
};
/**
 * 36. Assigns cross-dock staging door.
 *
 * @param {CrossDockOrder} crossDock - Cross-dock order
 * @param {string} dockDoor - Dock door assignment
 * @returns {CrossDockOrder} Updated cross-dock order
 *
 * @example
 * ```typescript
 * const assigned = assignCrossDockDoor(crossDock, 'DOCK-B3');
 * ```
 */
export declare function assignCrossDockDoor(crossDock: CrossDockOrder, dockDoor: string): CrossDockOrder;
/**
 * 37. Transfers inventory for cross-docking.
 *
 * @param {CrossDockOrder} crossDock - Cross-dock order
 * @param {string} stagingLocationId - Staging location
 * @returns {CrossDockOrder} Updated cross-dock order
 *
 * @example
 * ```typescript
 * const transferred = transferCrossDockInventory(crossDock, 'LOC-XDOCK-01');
 * ```
 */
export declare function transferCrossDockInventory(crossDock: CrossDockOrder, stagingLocationId: string): CrossDockOrder;
/**
 * 38. Completes cross-dock transfer.
 *
 * @param {CrossDockOrder} crossDock - Cross-dock order
 * @returns {CrossDockOrder} Completed cross-dock order
 *
 * @example
 * ```typescript
 * const completed = completeCrossDockTransfer(crossDock);
 * ```
 */
export declare function completeCrossDockTransfer(crossDock: CrossDockOrder): CrossDockOrder;
/**
 * 39. Tracks cross-dock progress and status.
 *
 * @param {CrossDockOrder[]} crossDocks - Cross-dock orders
 * @returns {object} Progress metrics
 *
 * @example
 * ```typescript
 * const progress = trackCrossDockProgress(crossDocks);
 * ```
 */
export declare function trackCrossDockProgress(crossDocks: CrossDockOrder[]): {
    total: number;
    identified: number;
    staged: number;
    inTransfer: number;
    completed: number;
    failed: number;
    completionRate: number;
};
/**
 * 40. Generates cross-dock label for shipment.
 *
 * @param {CrossDockOrder} crossDock - Cross-dock order
 * @returns {object} Label data
 *
 * @example
 * ```typescript
 * const label = generateCrossDockLabel(crossDock);
 * ```
 */
export declare function generateCrossDockLabel(crossDock: CrossDockOrder): {
    labelId: string;
    crossDockNumber: string;
    sku: string;
    quantity: number;
    outboundOrder: string;
    destinationDoor: string;
    barcode: string;
    printedAt: Date;
};
/**
 * 41. Calculates cross-docking efficiency metrics.
 *
 * @param {CrossDockOrder[]} crossDocks - Completed cross-dock orders
 * @returns {object} Efficiency metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCrossDockMetrics(crossDocks);
 * ```
 */
export declare function calculateCrossDockMetrics(crossDocks: CrossDockOrder[]): {
    totalOrders: number;
    totalUnits: number;
    averageDwellTime: number;
    successRate: number;
    throughput: number;
};
declare const _default: {
    createReceivingAppointment: typeof createReceivingAppointment;
    scheduleAppointment: typeof scheduleAppointment;
    updateAppointmentStatus: typeof updateAppointmentStatus;
    checkInAppointment: typeof checkInAppointment;
    validateAppointmentWindow: typeof validateAppointmentWindow;
    rescheduleAppointment: typeof rescheduleAppointment;
    cancelAppointment: typeof cancelAppointment;
    getAppointmentsByDate: typeof getAppointmentsByDate;
    createASN: typeof createASN;
    validateASN: typeof validateASN;
    addASNLineItem: typeof addASNLineItem;
    removeASNLineItem: typeof removeASNLineItem;
    matchASNToAppointment: typeof matchASNToAppointment;
    updateASNStatus: typeof updateASNStatus;
    receiveASN: typeof receiveASN;
    closeASN: typeof closeASN;
    generateASNDiscrepancyReport: typeof generateASNDiscrepancyReport;
    createQualityInspection: typeof createQualityInspection;
    performInspection: typeof performInspection;
    recordInspectionResult: typeof recordInspectionResult;
    failInspection: typeof failInspection;
    passInspection: typeof passInspection;
    quarantineItem: typeof quarantineItem;
    generateInspectionReport: typeof generateInspectionReport;
    calculateQualityScore: typeof calculateQualityScore;
    createPutawayTask: typeof createPutawayTask;
    assignPutawayLocation: typeof assignPutawayLocation;
    executePutaway: typeof executePutaway;
    validatePutawayLocation: typeof validatePutawayLocation;
    optimizePutawayPath: typeof optimizePutawayPath;
    bulkCreatePutawayTasks: typeof bulkCreatePutawayTasks;
    completePutawayTask: typeof completePutawayTask;
    generatePutawayWorkList: typeof generatePutawayWorkList;
    createCrossDockOrder: typeof createCrossDockOrder;
    validateCrossDockEligibility: typeof validateCrossDockEligibility;
    assignCrossDockDoor: typeof assignCrossDockDoor;
    transferCrossDockInventory: typeof transferCrossDockInventory;
    completeCrossDockTransfer: typeof completeCrossDockTransfer;
    trackCrossDockProgress: typeof trackCrossDockProgress;
    generateCrossDockLabel: typeof generateCrossDockLabel;
    calculateCrossDockMetrics: typeof calculateCrossDockMetrics;
};
export default _default;
//# sourceMappingURL=warehouse-receiving-operations-kit.d.ts.map