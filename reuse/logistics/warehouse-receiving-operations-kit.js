"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossDockingStatus = exports.PutawayStrategy = exports.QualityInspectionStatus = exports.ASNStatus = exports.ReceivingMethod = exports.ReceivingAppointmentStatus = void 0;
exports.createReceivingAppointment = createReceivingAppointment;
exports.scheduleAppointment = scheduleAppointment;
exports.updateAppointmentStatus = updateAppointmentStatus;
exports.checkInAppointment = checkInAppointment;
exports.validateAppointmentWindow = validateAppointmentWindow;
exports.rescheduleAppointment = rescheduleAppointment;
exports.cancelAppointment = cancelAppointment;
exports.getAppointmentsByDate = getAppointmentsByDate;
exports.createASN = createASN;
exports.validateASN = validateASN;
exports.addASNLineItem = addASNLineItem;
exports.removeASNLineItem = removeASNLineItem;
exports.matchASNToAppointment = matchASNToAppointment;
exports.updateASNStatus = updateASNStatus;
exports.receiveASN = receiveASN;
exports.closeASN = closeASN;
exports.generateASNDiscrepancyReport = generateASNDiscrepancyReport;
exports.createQualityInspection = createQualityInspection;
exports.performInspection = performInspection;
exports.recordInspectionResult = recordInspectionResult;
exports.failInspection = failInspection;
exports.passInspection = passInspection;
exports.quarantineItem = quarantineItem;
exports.generateInspectionReport = generateInspectionReport;
exports.calculateQualityScore = calculateQualityScore;
exports.createPutawayTask = createPutawayTask;
exports.assignPutawayLocation = assignPutawayLocation;
exports.executePutaway = executePutaway;
exports.validatePutawayLocation = validatePutawayLocation;
exports.optimizePutawayPath = optimizePutawayPath;
exports.bulkCreatePutawayTasks = bulkCreatePutawayTasks;
exports.completePutawayTask = completePutawayTask;
exports.generatePutawayWorkList = generatePutawayWorkList;
exports.createCrossDockOrder = createCrossDockOrder;
exports.validateCrossDockEligibility = validateCrossDockEligibility;
exports.assignCrossDockDoor = assignCrossDockDoor;
exports.transferCrossDockInventory = transferCrossDockInventory;
exports.completeCrossDockTransfer = completeCrossDockTransfer;
exports.trackCrossDockProgress = trackCrossDockProgress;
exports.generateCrossDockLabel = generateCrossDockLabel;
exports.calculateCrossDockMetrics = calculateCrossDockMetrics;
/**
 * File: /reuse/logistics/warehouse-receiving-operations-kit.ts
 * Locator: WC-LOGISTICS-WH-RCV-001
 * Purpose: Comprehensive Warehouse Receiving and Putaway Operations - Complete receiving lifecycle management
 *
 * Upstream: Independent utility module for warehouse receiving operations
 * Downstream: ../backend/logistics/*, Warehouse modules, Receiving services, Inventory management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 41 utility functions for receiving appointments, ASN processing, quality inspection, putaway, cross-docking
 *
 * LLM Context: Enterprise-grade warehouse receiving utilities to compete with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive receiving lifecycle management including appointment scheduling, ASN processing,
 * quality inspection workflows, intelligent putaway strategies, cross-docking operations, discrepancy resolution,
 * and real-time inventory integration.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Receiving appointment status enumeration
 */
var ReceivingAppointmentStatus;
(function (ReceivingAppointmentStatus) {
    ReceivingAppointmentStatus["SCHEDULED"] = "SCHEDULED";
    ReceivingAppointmentStatus["CONFIRMED"] = "CONFIRMED";
    ReceivingAppointmentStatus["CHECKED_IN"] = "CHECKED_IN";
    ReceivingAppointmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ReceivingAppointmentStatus["COMPLETED"] = "COMPLETED";
    ReceivingAppointmentStatus["CANCELLED"] = "CANCELLED";
    ReceivingAppointmentStatus["NO_SHOW"] = "NO_SHOW";
})(ReceivingAppointmentStatus || (exports.ReceivingAppointmentStatus = ReceivingAppointmentStatus = {}));
/**
 * Receiving method types
 */
var ReceivingMethod;
(function (ReceivingMethod) {
    ReceivingMethod["DOCK_RECEIVING"] = "DOCK_RECEIVING";
    ReceivingMethod["CROSS_DOCK"] = "CROSS_DOCK";
    ReceivingMethod["DIRECT_PUTAWAY"] = "DIRECT_PUTAWAY";
    ReceivingMethod["BULK_RECEIVING"] = "BULK_RECEIVING";
    ReceivingMethod["DROP_SHIP"] = "DROP_SHIP";
})(ReceivingMethod || (exports.ReceivingMethod = ReceivingMethod = {}));
/**
 * ASN (Advanced Ship Notice) status
 */
var ASNStatus;
(function (ASNStatus) {
    ASNStatus["CREATED"] = "CREATED";
    ASNStatus["TRANSMITTED"] = "TRANSMITTED";
    ASNStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    ASNStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ASNStatus["ARRIVED"] = "ARRIVED";
    ASNStatus["RECEIVING"] = "RECEIVING";
    ASNStatus["RECEIVED"] = "RECEIVED";
    ASNStatus["CLOSED"] = "CLOSED";
    ASNStatus["DISCREPANCY"] = "DISCREPANCY";
})(ASNStatus || (exports.ASNStatus = ASNStatus = {}));
/**
 * Quality inspection status
 */
var QualityInspectionStatus;
(function (QualityInspectionStatus) {
    QualityInspectionStatus["PENDING"] = "PENDING";
    QualityInspectionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    QualityInspectionStatus["PASSED"] = "PASSED";
    QualityInspectionStatus["FAILED"] = "FAILED";
    QualityInspectionStatus["QUARANTINED"] = "QUARANTINED";
    QualityInspectionStatus["APPROVED"] = "APPROVED";
    QualityInspectionStatus["REJECTED"] = "REJECTED";
})(QualityInspectionStatus || (exports.QualityInspectionStatus = QualityInspectionStatus = {}));
/**
 * Putaway strategy types
 */
var PutawayStrategy;
(function (PutawayStrategy) {
    PutawayStrategy["FIXED_LOCATION"] = "FIXED_LOCATION";
    PutawayStrategy["DIRECTED_PUTAWAY"] = "DIRECTED_PUTAWAY";
    PutawayStrategy["NEAREST_LOCATION"] = "NEAREST_LOCATION";
    PutawayStrategy["ZONE_BASED"] = "ZONE_BASED";
    PutawayStrategy["ABC_CLASSIFICATION"] = "ABC_CLASSIFICATION";
    PutawayStrategy["FIFO"] = "FIFO";
    PutawayStrategy["LIFO"] = "LIFO";
    PutawayStrategy["FEFO"] = "FEFO";
})(PutawayStrategy || (exports.PutawayStrategy = PutawayStrategy = {}));
/**
 * Cross-docking status
 */
var CrossDockingStatus;
(function (CrossDockingStatus) {
    CrossDockingStatus["IDENTIFIED"] = "IDENTIFIED";
    CrossDockingStatus["STAGED"] = "STAGED";
    CrossDockingStatus["IN_TRANSFER"] = "IN_TRANSFER";
    CrossDockingStatus["COMPLETED"] = "COMPLETED";
    CrossDockingStatus["FAILED"] = "FAILED";
})(CrossDockingStatus || (exports.CrossDockingStatus = CrossDockingStatus = {}));
// ============================================================================
// SECTION 1: APPOINTMENT MANAGEMENT (Functions 1-8)
// ============================================================================
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
function createReceivingAppointment(appointment) {
    const appointmentId = generateAppointmentId();
    const appointmentNumber = generateAppointmentNumber(appointment.warehouseId || '', appointment.scheduledDate || new Date());
    return {
        appointmentId,
        appointmentNumber,
        supplierId: appointment.supplierId || '',
        supplierName: appointment.supplierName || '',
        warehouseId: appointment.warehouseId || '',
        dockDoor: appointment.dockDoor,
        scheduledDate: appointment.scheduledDate || new Date(),
        scheduledTimeStart: appointment.scheduledTimeStart || new Date(),
        scheduledTimeEnd: appointment.scheduledTimeEnd || new Date(),
        status: ReceivingAppointmentStatus.SCHEDULED,
        method: appointment.method || ReceivingMethod.DOCK_RECEIVING,
        expectedPallets: appointment.expectedPallets,
        expectedWeight: appointment.expectedWeight,
        carrierName: appointment.carrierName,
        trailerNumber: appointment.trailerNumber,
        sealNumber: appointment.sealNumber,
        notes: appointment.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: appointment.metadata,
    };
}
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
function scheduleAppointment(appointment, availableDockDoors) {
    if (availableDockDoors.length === 0) {
        throw new Error('No available dock doors for appointment');
    }
    // Auto-assign first available dock door
    const dockDoor = appointment.dockDoor || availableDockDoors[0];
    return {
        ...appointment,
        dockDoor,
        status: ReceivingAppointmentStatus.SCHEDULED,
        updatedAt: new Date(),
    };
}
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
function updateAppointmentStatus(appointment, status) {
    return {
        ...appointment,
        status,
        updatedAt: new Date(),
    };
}
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
function checkInAppointment(appointment, trailerNumber, sealNumber) {
    return {
        ...appointment,
        status: ReceivingAppointmentStatus.CHECKED_IN,
        actualArrivalTime: new Date(),
        trailerNumber: trailerNumber || appointment.trailerNumber,
        sealNumber: sealNumber || appointment.sealNumber,
        updatedAt: new Date(),
    };
}
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
function validateAppointmentWindow(appointment, arrivalTime) {
    const arrivalMs = arrivalTime.getTime();
    const startMs = appointment.scheduledTimeStart.getTime();
    const endMs = appointment.scheduledTimeEnd.getTime();
    if (arrivalMs < startMs) {
        const minutesEarly = Math.floor((startMs - arrivalMs) / (1000 * 60));
        return {
            valid: false,
            reason: 'Arrival too early',
            minutesEarly,
        };
    }
    if (arrivalMs > endMs) {
        const minutesLate = Math.floor((arrivalMs - endMs) / (1000 * 60));
        return {
            valid: false,
            reason: 'Arrival too late',
            minutesLate,
        };
    }
    return { valid: true };
}
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
function rescheduleAppointment(appointment, newStartTime, newEndTime) {
    if (newStartTime >= newEndTime) {
        throw new Error('Start time must be before end time');
    }
    return {
        ...appointment,
        scheduledDate: newStartTime,
        scheduledTimeStart: newStartTime,
        scheduledTimeEnd: newEndTime,
        status: ReceivingAppointmentStatus.SCHEDULED,
        updatedAt: new Date(),
        metadata: {
            ...appointment.metadata,
            rescheduledFrom: {
                start: appointment.scheduledTimeStart,
                end: appointment.scheduledTimeEnd,
            },
        },
    };
}
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
function cancelAppointment(appointment, reason) {
    return {
        ...appointment,
        status: ReceivingAppointmentStatus.CANCELLED,
        updatedAt: new Date(),
        metadata: {
            ...appointment.metadata,
            cancellationReason: reason,
            cancelledAt: new Date(),
        },
    };
}
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
function getAppointmentsByDate(appointments, startDate, endDate) {
    return appointments.filter(apt => {
        const scheduleTime = apt.scheduledDate.getTime();
        return scheduleTime >= startDate.getTime() && scheduleTime <= endDate.getTime();
    });
}
// ============================================================================
// SECTION 2: ASN PROCESSING (Functions 9-17)
// ============================================================================
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
function createASN(asn) {
    const asnId = generateASNId();
    const asnNumber = generateASNNumber(asn.supplierId || '', asn.warehouseId || '');
    return {
        asnId,
        asnNumber,
        purchaseOrderId: asn.purchaseOrderId,
        purchaseOrderNumber: asn.purchaseOrderNumber,
        supplierId: asn.supplierId || '',
        supplierName: asn.supplierName || '',
        warehouseId: asn.warehouseId || '',
        appointmentId: asn.appointmentId,
        status: ASNStatus.CREATED,
        shipDate: asn.shipDate,
        expectedDeliveryDate: asn.expectedDeliveryDate,
        carrierName: asn.carrierName,
        trackingNumber: asn.trackingNumber,
        bolNumber: asn.bolNumber,
        proNumber: asn.proNumber,
        lineItems: asn.lineItems || [],
        totalExpectedQuantity: 0,
        totalReceivedQuantity: 0,
        createdAt: new Date(),
        metadata: asn.metadata,
    };
}
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
function validateASN(asn) {
    const errors = [];
    if (!asn.supplierId) {
        errors.push('Supplier ID is required');
    }
    if (!asn.warehouseId) {
        errors.push('Warehouse ID is required');
    }
    if (!asn.lineItems || asn.lineItems.length === 0) {
        errors.push('ASN must have at least one line item');
    }
    if (asn.expectedDeliveryDate && asn.shipDate) {
        if (asn.expectedDeliveryDate < asn.shipDate) {
            errors.push('Expected delivery date cannot be before ship date');
        }
    }
    // Validate line items
    for (const item of asn.lineItems) {
        if (item.expectedQuantity <= 0) {
            errors.push(`Line ${item.lineNumber}: Expected quantity must be positive`);
        }
        if (!item.sku) {
            errors.push(`Line ${item.lineNumber}: SKU is required`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
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
function addASNLineItem(asn, item) {
    const lineItemId = crypto.randomUUID();
    const lineNumber = asn.lineItems.length + 1;
    const newItem = {
        lineItemId,
        lineNumber,
        productId: item.productId || '',
        sku: item.sku || '',
        description: item.description || '',
        expectedQuantity: item.expectedQuantity || 0,
        receivedQuantity: 0,
        unitOfMeasure: item.unitOfMeasure || 'EA',
        lotNumber: item.lotNumber,
        serialNumbers: item.serialNumbers,
        expirationDate: item.expirationDate,
        countryOfOrigin: item.countryOfOrigin,
        unitCost: item.unitCost,
        metadata: item.metadata,
    };
    const updatedLineItems = [...asn.lineItems, newItem];
    const totalExpectedQuantity = updatedLineItems.reduce((sum, li) => sum + li.expectedQuantity, 0);
    return {
        ...asn,
        lineItems: updatedLineItems,
        totalExpectedQuantity,
    };
}
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
function removeASNLineItem(asn, lineItemId) {
    const updatedLineItems = asn.lineItems
        .filter(item => item.lineItemId !== lineItemId)
        .map((item, index) => ({
        ...item,
        lineNumber: index + 1,
    }));
    const totalExpectedQuantity = updatedLineItems.reduce((sum, item) => sum + item.expectedQuantity, 0);
    return {
        ...asn,
        lineItems: updatedLineItems,
        totalExpectedQuantity,
    };
}
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
function matchASNToAppointment(asn, appointmentId) {
    return {
        ...asn,
        appointmentId,
        status: ASNStatus.ACKNOWLEDGED,
    };
}
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
function updateASNStatus(asn, status) {
    return {
        ...asn,
        status,
    };
}
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
function receiveASN(asn, lineItemId, quantity) {
    const updatedLineItems = asn.lineItems.map(item => {
        if (item.lineItemId === lineItemId) {
            return {
                ...item,
                receivedQuantity: quantity,
            };
        }
        return item;
    });
    const totalReceivedQuantity = updatedLineItems.reduce((sum, item) => sum + item.receivedQuantity, 0);
    const status = totalReceivedQuantity >= asn.totalExpectedQuantity
        ? ASNStatus.RECEIVED
        : ASNStatus.RECEIVING;
    return {
        ...asn,
        lineItems: updatedLineItems,
        totalReceivedQuantity,
        status,
        actualDeliveryDate: status === ASNStatus.RECEIVED ? new Date() : asn.actualDeliveryDate,
        receivedAt: status === ASNStatus.RECEIVED ? new Date() : asn.receivedAt,
    };
}
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
function closeASN(asn) {
    return {
        ...asn,
        status: ASNStatus.CLOSED,
        closedAt: new Date(),
    };
}
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
function generateASNDiscrepancyReport(asn) {
    const discrepancies = [];
    for (const item of asn.lineItems) {
        const variance = item.receivedQuantity - item.expectedQuantity;
        if (variance !== 0) {
            const type = variance > 0 ? 'OVERAGE' : 'SHORTAGE';
            const discrepancyId = `DISC-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
            discrepancies.push({
                discrepancyId,
                asnId: asn.asnId,
                lineItemId: item.lineItemId,
                type,
                expectedQuantity: item.expectedQuantity,
                actualQuantity: item.receivedQuantity,
                variance: Math.abs(variance),
                description: `${type}: ${item.description} (SKU: ${item.sku})`,
                resolutionStatus: 'OPEN',
                reportedBy: 'SYSTEM',
                reportedAt: new Date(),
            });
        }
    }
    return discrepancies;
}
// ============================================================================
// SECTION 3: QUALITY INSPECTION (Functions 18-25)
// ============================================================================
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
function createQualityInspection(asnId, warehouseId, inspectionType = 'SAMPLE') {
    const inspectionId = generateInspectionId();
    const inspectionNumber = generateInspectionNumber(warehouseId);
    return {
        inspectionId,
        inspectionNumber,
        asnId,
        warehouseId,
        inspectionType,
        status: QualityInspectionStatus.PENDING,
        results: [],
        metadata: {},
    };
}
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
function performInspection(inspection, inspectedBy) {
    return {
        ...inspection,
        status: QualityInspectionStatus.IN_PROGRESS,
        inspectedBy,
        startedAt: new Date(),
    };
}
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
function recordInspectionResult(inspection, result) {
    const inspectionResultId = crypto.randomUUID();
    const newResult = {
        inspectionResultId,
        lineItemId: result.lineItemId || '',
        productId: result.productId || '',
        sku: result.sku || '',
        quantityInspected: result.quantityInspected || 0,
        quantityPassed: result.quantityPassed || 0,
        quantityFailed: result.quantityFailed || 0,
        defectTypes: result.defectTypes,
        defectDescription: result.defectDescription,
        photos: result.photos,
        inspectedBy: result.inspectedBy || inspection.inspectedBy || '',
        inspectedAt: new Date(),
    };
    return {
        ...inspection,
        results: [...inspection.results, newResult],
    };
}
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
function failInspection(inspection, reason) {
    return {
        ...inspection,
        status: QualityInspectionStatus.FAILED,
        completedAt: new Date(),
        notes: reason,
    };
}
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
function passInspection(inspection, approvedBy) {
    const overallQualityScore = calculateQualityScore(inspection);
    return {
        ...inspection,
        status: QualityInspectionStatus.PASSED,
        overallQualityScore,
        approvedBy,
        completedAt: new Date(),
    };
}
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
function quarantineItem(inspection, quarantineLocationId) {
    const quarantineId = `QUAR-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const items = inspection.results
        .filter(result => result.quantityFailed > 0)
        .map(result => ({
        lineItemId: result.lineItemId,
        quantity: result.quantityFailed,
    }));
    return {
        quarantineId,
        inspectionId: inspection.inspectionId,
        locationId: quarantineLocationId,
        items,
        quarantinedAt: new Date(),
    };
}
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
function generateInspectionReport(inspection) {
    const totalInspected = inspection.results.reduce((sum, r) => sum + r.quantityInspected, 0);
    const totalPassed = inspection.results.reduce((sum, r) => sum + r.quantityPassed, 0);
    const totalFailed = inspection.results.reduce((sum, r) => sum + r.quantityFailed, 0);
    const passRate = totalInspected > 0 ? (totalPassed / totalInspected) * 100 : 0;
    // Summarize defect types
    const defectSummary = {};
    for (const result of inspection.results) {
        if (result.defectTypes) {
            for (const defect of result.defectTypes) {
                defectSummary[defect] = (defectSummary[defect] || 0) + result.quantityFailed;
            }
        }
    }
    const duration = inspection.startedAt && inspection.completedAt
        ? inspection.completedAt.getTime() - inspection.startedAt.getTime()
        : undefined;
    return {
        inspectionId: inspection.inspectionId,
        inspectionNumber: inspection.inspectionNumber,
        asnId: inspection.asnId,
        status: inspection.status,
        totalInspected,
        totalPassed,
        totalFailed,
        passRate: Number(passRate.toFixed(2)),
        qualityScore: inspection.overallQualityScore || 0,
        defectSummary,
        duration,
    };
}
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
function calculateQualityScore(inspection) {
    if (inspection.results.length === 0) {
        return 0;
    }
    const totalInspected = inspection.results.reduce((sum, r) => sum + r.quantityInspected, 0);
    const totalPassed = inspection.results.reduce((sum, r) => sum + r.quantityPassed, 0);
    if (totalInspected === 0) {
        return 0;
    }
    const score = (totalPassed / totalInspected) * 100;
    return Number(score.toFixed(2));
}
// ============================================================================
// SECTION 4: PUTAWAY EXECUTION (Functions 26-33)
// ============================================================================
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
function createPutawayTask(asnId, lineItem, fromLocationId, strategy = PutawayStrategy.DIRECTED_PUTAWAY) {
    const taskId = generatePutawayTaskId();
    const taskNumber = generatePutawayTaskNumber();
    return {
        taskId,
        taskNumber,
        asnId,
        lineItemId: lineItem.lineItemId,
        productId: lineItem.productId,
        sku: lineItem.sku,
        quantity: lineItem.receivedQuantity,
        unitOfMeasure: lineItem.unitOfMeasure,
        fromLocationId,
        strategy,
        priority: 'MEDIUM',
        status: 'PENDING',
        lotNumber: lineItem.lotNumber,
        expirationDate: lineItem.expirationDate,
        metadata: {},
    };
}
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
function assignPutawayLocation(task, availableLocations) {
    // Filter locations that can accommodate the quantity
    const suitableLocations = availableLocations.filter(loc => loc.isActive && loc.availableCapacity >= task.quantity);
    if (suitableLocations.length === 0) {
        throw new Error('No suitable location available for putaway');
    }
    // Select location based on strategy
    let selectedLocation;
    switch (task.strategy) {
        case PutawayStrategy.NEAREST_LOCATION:
            selectedLocation = suitableLocations[0]; // Simplified - would use distance calculation
            break;
        case PutawayStrategy.ZONE_BASED:
            selectedLocation = suitableLocations.find(loc => loc.zone === 'A') || suitableLocations[0];
            break;
        case PutawayStrategy.FIFO:
        case PutawayStrategy.FEFO:
            // Would consider expiration dates for FEFO
            selectedLocation = suitableLocations.sort((a, b) => b.currentOccupancy - a.currentOccupancy)[0];
            break;
        default:
            selectedLocation = suitableLocations[0];
    }
    return {
        ...task,
        toLocationId: selectedLocation.locationId,
        status: 'ASSIGNED',
    };
}
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
function executePutaway(task, assignedTo) {
    return {
        ...task,
        status: 'IN_PROGRESS',
        assignedTo,
        assignedAt: new Date(),
        startedAt: new Date(),
    };
}
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
function validatePutawayLocation(location, productId, quantity) {
    if (!location.isActive) {
        return { valid: false, reason: 'Location is not active' };
    }
    if (location.availableCapacity < quantity) {
        return {
            valid: false,
            reason: `Insufficient capacity (available: ${location.availableCapacity}, required: ${quantity})`,
        };
    }
    if (location.restrictedProducts && location.restrictedProducts.includes(productId)) {
        return { valid: false, reason: 'Product is restricted in this location' };
    }
    return { valid: true };
}
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
function optimizePutawayPath(tasks) {
    // Simplified zone-based optimization
    // In production, would use traveling salesman algorithm
    return tasks.sort((a, b) => {
        // Prioritize by priority level
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by location (simplified)
        if (a.toLocationId && b.toLocationId) {
            return a.toLocationId.localeCompare(b.toLocationId);
        }
        return 0;
    });
}
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
function bulkCreatePutawayTasks(asn, stagingLocationId, strategy = PutawayStrategy.DIRECTED_PUTAWAY) {
    return asn.lineItems
        .filter(item => item.receivedQuantity > 0)
        .map(item => createPutawayTask(asn.asnId, item, stagingLocationId, strategy));
}
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
function completePutawayTask(task) {
    if (!task.toLocationId) {
        throw new Error('Cannot complete task without assigned location');
    }
    return {
        ...task,
        status: 'COMPLETED',
        completedAt: new Date(),
    };
}
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
function generatePutawayWorkList(tasks, workerId) {
    const eligibleTasks = tasks.filter(task => task.status === 'PENDING' ||
        task.status === 'ASSIGNED' ||
        (task.status === 'IN_PROGRESS' && task.assignedTo === workerId));
    return optimizePutawayPath(eligibleTasks);
}
// ============================================================================
// SECTION 5: CROSS-DOCKING (Functions 34-41)
// ============================================================================
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
function createCrossDockOrder(inboundASNId, outboundOrderId, warehouseId, details) {
    const crossDockId = generateCrossDockId();
    const crossDockNumber = generateCrossDockNumber(warehouseId);
    return {
        crossDockId,
        crossDockNumber,
        inboundASNId,
        outboundOrderId,
        warehouseId,
        productId: details.productId || '',
        sku: details.sku || '',
        quantity: details.quantity || 0,
        stagingLocationId: details.stagingLocationId,
        outboundDockDoor: details.outboundDockDoor,
        status: CrossDockingStatus.IDENTIFIED,
        scheduledShipDate: details.scheduledShipDate,
        createdAt: new Date(),
        metadata: details.metadata,
    };
}
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
function validateCrossDockEligibility(inboundItem, outboundDemand) {
    if (inboundItem.sku !== outboundDemand.sku) {
        return { eligible: false, reason: 'SKU mismatch' };
    }
    if (inboundItem.receivedQuantity === 0) {
        return { eligible: false, reason: 'No received quantity' };
    }
    const matchedQuantity = Math.min(inboundItem.receivedQuantity, outboundDemand.quantity);
    if (matchedQuantity === 0) {
        return { eligible: false, reason: 'No quantity available for cross-dock' };
    }
    return {
        eligible: true,
        matchedQuantity,
    };
}
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
function assignCrossDockDoor(crossDock, dockDoor) {
    return {
        ...crossDock,
        outboundDockDoor: dockDoor,
        status: CrossDockingStatus.STAGED,
    };
}
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
function transferCrossDockInventory(crossDock, stagingLocationId) {
    return {
        ...crossDock,
        stagingLocationId,
        status: CrossDockingStatus.IN_TRANSFER,
    };
}
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
function completeCrossDockTransfer(crossDock) {
    return {
        ...crossDock,
        status: CrossDockingStatus.COMPLETED,
        actualShipDate: new Date(),
        completedAt: new Date(),
    };
}
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
function trackCrossDockProgress(crossDocks) {
    const total = crossDocks.length;
    const identified = crossDocks.filter(cd => cd.status === CrossDockingStatus.IDENTIFIED).length;
    const staged = crossDocks.filter(cd => cd.status === CrossDockingStatus.STAGED).length;
    const inTransfer = crossDocks.filter(cd => cd.status === CrossDockingStatus.IN_TRANSFER).length;
    const completed = crossDocks.filter(cd => cd.status === CrossDockingStatus.COMPLETED).length;
    const failed = crossDocks.filter(cd => cd.status === CrossDockingStatus.FAILED).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    return {
        total,
        identified,
        staged,
        inTransfer,
        completed,
        failed,
        completionRate: Number(completionRate.toFixed(2)),
    };
}
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
function generateCrossDockLabel(crossDock) {
    const labelId = `LABEL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const barcode = `*${crossDock.crossDockNumber}*`;
    return {
        labelId,
        crossDockNumber: crossDock.crossDockNumber,
        sku: crossDock.sku,
        quantity: crossDock.quantity,
        outboundOrder: crossDock.outboundOrderId,
        destinationDoor: crossDock.outboundDockDoor || 'TBD',
        barcode,
        printedAt: new Date(),
    };
}
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
function calculateCrossDockMetrics(crossDocks) {
    const completed = crossDocks.filter(cd => cd.status === CrossDockingStatus.COMPLETED);
    const totalOrders = crossDocks.length;
    const totalUnits = crossDocks.reduce((sum, cd) => sum + cd.quantity, 0);
    const successRate = totalOrders > 0 ? (completed.length / totalOrders) * 100 : 0;
    // Calculate average dwell time
    let totalDwellTime = 0;
    let dwellTimeCount = 0;
    for (const cd of completed) {
        if (cd.createdAt && cd.completedAt) {
            const dwellTime = cd.completedAt.getTime() - cd.createdAt.getTime();
            totalDwellTime += dwellTime;
            dwellTimeCount++;
        }
    }
    const averageDwellTime = dwellTimeCount > 0 ? totalDwellTime / dwellTimeCount / (1000 * 60) : 0;
    // Calculate throughput (units per hour)
    const throughput = averageDwellTime > 0 ? (totalUnits / (averageDwellTime / 60)) : 0;
    return {
        totalOrders,
        totalUnits,
        averageDwellTime: Number(averageDwellTime.toFixed(2)),
        successRate: Number(successRate.toFixed(2)),
        throughput: Number(throughput.toFixed(2)),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique appointment ID.
 */
function generateAppointmentId() {
    return `APT-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates appointment number.
 */
function generateAppointmentNumber(warehouseId, date) {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const whCode = warehouseId.replace(/[^A-Z0-9]/g, '');
    const sequence = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${whCode}-APT-${dateStr}-${sequence}`;
}
/**
 * Helper: Generates unique ASN ID.
 */
function generateASNId() {
    return `ASN-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates ASN number.
 */
function generateASNNumber(supplierId, warehouseId) {
    const supCode = supplierId.replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const whCode = warehouseId.replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const timestamp = Date.now().toString().slice(-8);
    return `${supCode}-${whCode}-${timestamp}`;
}
/**
 * Helper: Generates unique inspection ID.
 */
function generateInspectionId() {
    return `INSP-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates inspection number.
 */
function generateInspectionNumber(warehouseId) {
    const whCode = warehouseId.replace(/[^A-Z0-9]/g, '');
    const sequence = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${whCode}-QI-${sequence}`;
}
/**
 * Helper: Generates unique putaway task ID.
 */
function generatePutawayTaskId() {
    return `PUT-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates putaway task number.
 */
function generatePutawayTaskNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `PUT-${timestamp}-${random}`;
}
/**
 * Helper: Generates unique cross-dock ID.
 */
function generateCrossDockId() {
    return `XDOCK-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates cross-dock number.
 */
function generateCrossDockNumber(warehouseId) {
    const whCode = warehouseId.replace(/[^A-Z0-9]/g, '');
    const sequence = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${whCode}-XD-${sequence}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Appointment Management
    createReceivingAppointment,
    scheduleAppointment,
    updateAppointmentStatus,
    checkInAppointment,
    validateAppointmentWindow,
    rescheduleAppointment,
    cancelAppointment,
    getAppointmentsByDate,
    // ASN Processing
    createASN,
    validateASN,
    addASNLineItem,
    removeASNLineItem,
    matchASNToAppointment,
    updateASNStatus,
    receiveASN,
    closeASN,
    generateASNDiscrepancyReport,
    // Quality Inspection
    createQualityInspection,
    performInspection,
    recordInspectionResult,
    failInspection,
    passInspection,
    quarantineItem,
    generateInspectionReport,
    calculateQualityScore,
    // Putaway Execution
    createPutawayTask,
    assignPutawayLocation,
    executePutaway,
    validatePutawayLocation,
    optimizePutawayPath,
    bulkCreatePutawayTasks,
    completePutawayTask,
    generatePutawayWorkList,
    // Cross-Docking
    createCrossDockOrder,
    validateCrossDockEligibility,
    assignCrossDockDoor,
    transferCrossDockInventory,
    completeCrossDockTransfer,
    trackCrossDockProgress,
    generateCrossDockLabel,
    calculateCrossDockMetrics,
};
//# sourceMappingURL=warehouse-receiving-operations-kit.js.map