/**
 * LOC: PROP-MM-001
 * File: /reuse/property/property-maintenance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Maintenance coordination systems
 *   - Facilities management modules
 */
/**
 * File: /reuse/property/property-maintenance-management-kit.ts
 * Locator: WC-PROP-MM-001
 * Purpose: Maintenance Management Kit - Comprehensive facilities maintenance operations and lifecycle
 *
 * Upstream: Independent utility module for property maintenance operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for maintenance management, scheduling, inventory, and analytics
 *
 * LLM Context: Enterprise-grade facilities maintenance utilities for property management systems.
 * Provides preventive maintenance scheduling, reactive maintenance handling, work order management,
 * technician dispatch, parts and inventory tracking, cost analysis, equipment downtime monitoring,
 * maintenance history reporting, and vendor coordination. Essential for reducing operational costs,
 * extending equipment lifespan, minimizing downtime, and ensuring compliance with maintenance standards.
 */
interface MaintenanceWorkOrder {
    id: string;
    propertyId: string;
    equipmentId: string;
    equipmentName: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    title: string;
    description: string;
    requestedBy: string;
    requestedAt: Date;
    assignedTechnicianId?: string;
    assignedAt?: Date;
    scheduledDate?: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    completedAt?: Date;
    estimatedCost?: number;
    actualCost?: number;
    partsUsed?: MaintenancePart[];
    notes?: string;
    attachments?: string[];
}
type MaintenanceType = 'preventive' | 'reactive' | 'corrective' | 'emergency' | 'predictive';
type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low';
type MaintenanceStatus = 'draft' | 'pending_assignment' | 'assigned' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
interface PreventiveMaintenancePlan {
    id: string;
    propertyId: string;
    equipmentId: string;
    equipmentType: string;
    planName: string;
    status: 'active' | 'inactive' | 'archived';
    tasks: PreventiveMaintenanceTask[];
    startDate: Date;
    endDate?: Date;
    cost?: number;
    createdAt: Date;
    updatedAt: Date;
}
interface PreventiveMaintenanceTask {
    id: string;
    planId: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
    dayOfWeek?: number;
    dayOfMonth?: number;
    estimatedDuration: number;
    estimatedCost: number;
    lastCompletedAt?: Date;
    nextDueAt?: Date;
    priority: 'high' | 'medium' | 'low';
    requirements?: string[];
}
interface Technician {
    id: string;
    propertyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'on_leave';
    certifications: string[];
    specialties: string[];
    assignedWorkOrders: number;
    maxConcurrentWorkOrders: number;
    hourlyRate: number;
    location?: string;
    availability: TimeSlot[];
    lastAssigned?: Date;
}
interface TimeSlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}
interface MaintenancePart {
    id: string;
    partNumber: string;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    supplier?: string;
    usedAt?: Date;
}
interface MaintenanceInventory {
    id: string;
    propertyId: string;
    partNumber: string;
    name: string;
    category: string;
    quantity: number;
    minimumQuantity: number;
    maximumQuantity: number;
    unitCost: number;
    location: string;
    lastRestocked?: Date;
    reorderPoint?: number;
    leadTimeDays?: number;
}
interface MaintenanceCost {
    id: string;
    workOrderId: string;
    propertyId: string;
    laborCost: number;
    partsCost: number;
    equipmentCost: number;
    otherCosts: number;
    totalCost: number;
    date: Date;
    notes?: string;
}
interface EquipmentDowntime {
    id: string;
    equipmentId: string;
    equipmentName: string;
    propertyId: string;
    startTime: Date;
    endTime?: Date;
    durationMinutes?: number;
    reason: string;
    maintenanceWorkOrderId?: string;
    impact: 'critical' | 'high' | 'medium' | 'low';
    costImpact?: number;
    notes?: string;
}
interface MaintenanceHistory {
    id: string;
    equipmentId: string;
    equipmentName: string;
    propertyId: string;
    workOrderId: string;
    maintenanceType: MaintenanceType;
    performedAt: Date;
    performedBy: string;
    description: string;
    partsReplaced: string[];
    cost: number;
    duration: number;
    nextScheduledMaintenance?: Date;
}
interface VendorService {
    id: string;
    propertyId: string;
    vendorId: string;
    vendorName: string;
    serviceType: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    scheduledDate: Date;
    completedDate?: Date;
    costEstimate: number;
    actualCost?: number;
    description: string;
    contactPerson?: string;
    notes?: string;
}
interface MaintenanceMetrics {
    propertyId: string;
    period: DateRange;
    totalWorkOrders: number;
    completedWorkOrders: number;
    averageCompletionTime: number;
    totalCost: number;
    averageCostPerWorkOrder: number;
    equipmentDowntimeHours: number;
    preventiveMaintenance: number;
    reactiveMaintenance: number;
    costPerSquareFoot?: number;
}
interface DateRange {
    start: Date;
    end: Date;
}
/**
 * Creates a new maintenance work order.
 *
 * @param {Partial<MaintenanceWorkOrder>} orderData - Work order data
 * @returns {MaintenanceWorkOrder} Created work order
 *
 * @example
 * ```typescript
 * const workOrder = createMaintenanceWorkOrder({
 *   propertyId: 'PROP-001',
 *   equipmentId: 'EQ-HVAC-001',
 *   equipmentName: 'HVAC Unit A',
 *   type: 'reactive',
 *   priority: 'high',
 *   title: 'HVAC cooling system malfunction',
 *   description: 'Unit not cooling properly',
 *   requestedBy: 'mgr@example.com'
 * });
 * ```
 */
export declare const createMaintenanceWorkOrder: (orderData: Partial<MaintenanceWorkOrder>) => MaintenanceWorkOrder;
/**
 * Updates work order status and tracks state transitions.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order to update
 * @param {MaintenanceStatus} newStatus - New status
 * @param {string} updatedBy - User performing update
 * @returns {MaintenanceWorkOrder} Updated work order
 *
 * @example
 * ```typescript
 * const updated = updateWorkOrderStatus(workOrder, 'in_progress', 'tech@example.com');
 * ```
 */
export declare const updateWorkOrderStatus: (workOrder: MaintenanceWorkOrder, newStatus: MaintenanceStatus, updatedBy: string) => MaintenanceWorkOrder;
/**
 * Assigns a work order to a technician.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order to assign
 * @param {string} technicianId - Technician ID
 * @returns {MaintenanceWorkOrder} Updated work order
 *
 * @example
 * ```typescript
 * const assigned = assignWorkOrder(workOrder, 'TECH-001');
 * ```
 */
export declare const assignWorkOrder: (workOrder: MaintenanceWorkOrder, technicianId: string) => MaintenanceWorkOrder;
/**
 * Calculates priority score for work order sorting.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @returns {number} Priority score (higher = more urgent)
 *
 * @example
 * ```typescript
 * const score = calculateWorkOrderPriority(workOrder);
 * ```
 */
export declare const calculateWorkOrderPriority: (workOrder: MaintenanceWorkOrder) => number;
/**
 * Creates a preventive maintenance plan for equipment.
 *
 * @param {Partial<PreventiveMaintenancePlan>} planData - Plan data
 * @returns {PreventiveMaintenancePlan} Created plan
 *
 * @example
 * ```typescript
 * const plan = createPreventiveMaintenancePlan({
 *   propertyId: 'PROP-001',
 *   equipmentId: 'EQ-HVAC-001',
 *   equipmentType: 'HVAC Unit',
 *   planName: 'HVAC Annual PM',
 *   tasks: [...]
 * });
 * ```
 */
export declare const createPreventiveMaintenancePlan: (planData: Partial<PreventiveMaintenancePlan>) => PreventiveMaintenancePlan;
/**
 * Generates maintenance due dates based on schedule frequency.
 *
 * @param {PreventiveMaintenanceTask} task - Maintenance task
 * @param {Date} baseDate - Reference date
 * @returns {Array<Date>} Array of due dates for next 12 months
 *
 * @example
 * ```typescript
 * const dueDates = generateMaintenanceDueDates(monthlyTask, new Date());
 * ```
 */
export declare const generateMaintenanceDueDates: (task: PreventiveMaintenanceTask, baseDate: Date) => Date[];
/**
 * Gets pending maintenance tasks due soon.
 *
 * @param {PreventiveMaintenanceTask[]} tasks - All tasks
 * @param {number} daysAhead - Look ahead days
 * @returns {PreventiveMaintenanceTask[]} Due or overdue tasks
 *
 * @example
 * ```typescript
 * const due = getPendingMaintenanceTasks(tasks, 7);
 * ```
 */
export declare const getPendingMaintenanceTasks: (tasks: PreventiveMaintenanceTask[], daysAhead?: number) => PreventiveMaintenanceTask[];
/**
 * Marks a maintenance task as completed.
 *
 * @param {PreventiveMaintenanceTask} task - Task to complete
 * @returns {PreventiveMaintenanceTask} Updated task
 *
 * @example
 * ```typescript
 * const completed = markMaintenanceTaskComplete(task);
 * ```
 */
export declare const markMaintenanceTaskComplete: (task: PreventiveMaintenanceTask) => PreventiveMaintenanceTask;
/**
 * Creates an emergency work order with immediate dispatch.
 *
 * @param {Partial<MaintenanceWorkOrder>} orderData - Work order data
 * @returns {MaintenanceWorkOrder} Emergency work order
 *
 * @example
 * ```typescript
 * const emergency = createEmergencyWorkOrder({
 *   equipmentId: 'EQ-001',
 *   title: 'Roof leak',
 *   description: 'Active water leak in Conference Room B'
 * });
 * ```
 */
export declare const createEmergencyWorkOrder: (orderData: Partial<MaintenanceWorkOrder>) => MaintenanceWorkOrder;
/**
 * Estimates cost for reactive maintenance based on historical data.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @param {MaintenanceHistory[]} history - Historical maintenance records
 * @returns {number} Estimated cost
 *
 * @example
 * ```typescript
 * const estimate = estimateReactiveMaintenanceCost(workOrder, history);
 * ```
 */
export declare const estimateReactiveMaintenanceCost: (workOrder: MaintenanceWorkOrder, history: MaintenanceHistory[]) => number;
/**
 * Prioritizes work orders for dispatch queue.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - Work orders to prioritize
 * @returns {MaintenanceWorkOrder[]} Sorted by priority
 *
 * @example
 * ```typescript
 * const sorted = prioritizeWorkOrders(workOrders);
 * ```
 */
export declare const prioritizeWorkOrders: (workOrders: MaintenanceWorkOrder[]) => MaintenanceWorkOrder[];
/**
 * Calculates equipment criticality score for maintenance.
 *
 * @param {string} equipmentType - Type of equipment
 * @param {string} impact - Business impact if down
 * @returns {number} Criticality score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateEquipmentCriticality('HVAC', 'high');
 * ```
 */
export declare const calculateEquipmentCriticality: (equipmentType: string, impact: string) => number;
/**
 * Registers a maintenance technician.
 *
 * @param {Partial<Technician>} techData - Technician data
 * @returns {Technician} Registered technician
 *
 * @example
 * ```typescript
 * const tech = registerTechnician({
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john@example.com',
 *   certifications: ['HVAC', 'Electrical'],
 *   hourlyRate: 75
 * });
 * ```
 */
export declare const registerTechnician: (techData: Partial<Technician>) => Technician;
/**
 * Finds available technicians for a work order.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @param {Technician[]} technicians - Available technicians
 * @returns {Technician[]} Qualified available technicians
 *
 * @example
 * ```typescript
 * const available = findAvailableTechnicians(workOrder, technicians);
 * ```
 */
export declare const findAvailableTechnicians: (workOrder: MaintenanceWorkOrder, technicians: Technician[]) => Technician[];
/**
 * Calculates technician suitability score for work order.
 *
 * @param {Technician} technician - Technician
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @returns {number} Suitability score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateTechnicianSuitability(tech, workOrder);
 * ```
 */
export declare const calculateTechnicianSuitability: (technician: Technician, workOrder: MaintenanceWorkOrder) => number;
/**
 * Optimizes technician dispatch routes.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - Work orders to assign
 * @param {Technician[]} technicians - Technicians
 * @returns {Map<string, MaintenanceWorkOrder[]>} Technician assignments
 *
 * @example
 * ```typescript
 * const assignments = optimizeTechnicianDispatch(workOrders, technicians);
 * ```
 */
export declare const optimizeTechnicianDispatch: (workOrders: MaintenanceWorkOrder[], technicians: Technician[]) => Map<string, MaintenanceWorkOrder[]>;
/**
 * Adds parts to inventory.
 *
 * @param {Partial<MaintenanceInventory>} inventoryData - Inventory data
 * @returns {MaintenanceInventory} Inventory item
 *
 * @example
 * ```typescript
 * const item = addInventoryItem({
 *   partNumber: 'HVAC-FILTER-001',
 *   name: 'HVAC Filter 16x25x1',
 *   quantity: 10,
 *   unitCost: 25
 * });
 * ```
 */
export declare const addInventoryItem: (inventoryData: Partial<MaintenanceInventory>) => MaintenanceInventory;
/**
 * Consumes inventory when work order completes.
 *
 * @param {MaintenanceInventory} item - Inventory item
 * @param {number} quantity - Quantity used
 * @returns {MaintenanceInventory} Updated item
 *
 * @example
 * ```typescript
 * const updated = consumeInventory(item, 2);
 * ```
 */
export declare const consumeInventory: (item: MaintenanceInventory, quantity: number) => MaintenanceInventory;
/**
 * Identifies low-stock items requiring reorder.
 *
 * @param {MaintenanceInventory[]} inventory - All inventory items
 * @returns {MaintenanceInventory[]} Items below minimum quantity
 *
 * @example
 * ```typescript
 * const lowStock = getRestockAlerts(inventory);
 * ```
 */
export declare const getRestockAlerts: (inventory: MaintenanceInventory[]) => MaintenanceInventory[];
/**
 * Calculates total inventory value.
 *
 * @param {MaintenanceInventory[]} inventory - Inventory items
 * @returns {number} Total value
 *
 * @example
 * ```typescript
 * const value = calculateInventoryValue(inventory);
 * ```
 */
export declare const calculateInventoryValue: (inventory: MaintenanceInventory[]) => number;
/**
 * Tracks parts used in a work order.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @param {MaintenanceInventory[]} inventory - Inventory
 * @returns {object} Parts used and updated inventory
 *
 * @example
 * ```typescript
 * const result = trackPartsUsage(workOrder, inventory);
 * ```
 */
export declare const trackPartsUsage: (workOrder: MaintenanceWorkOrder, inventory: MaintenanceInventory[]) => {
    partsUsed: MaintenancePart[];
    updatedInventory: MaintenanceInventory[];
    totalPartsCost: number;
};
/**
 * Records maintenance cost for a work order.
 *
 * @param {MaintenanceWorkOrder} workOrder - Work order
 * @param {number} laborCost - Labor cost
 * @param {number} partsCost - Parts cost
 * @param {number} equipmentCost - Equipment cost
 * @returns {MaintenanceCost} Cost record
 *
 * @example
 * ```typescript
 * const cost = recordMaintenanceCost(workOrder, 150, 75, 0);
 * ```
 */
export declare const recordMaintenanceCost: (workOrder: MaintenanceWorkOrder, laborCost: number, partsCost: number, equipmentCost?: number, otherCosts?: number) => MaintenanceCost;
/**
 * Calculates total maintenance cost for equipment.
 *
 * @param {MaintenanceCost[]} costs - Cost records
 * @param {string} equipmentId - Equipment ID
 * @param {DateRange} period - Time period
 * @returns {number} Total cost
 *
 * @example
 * ```typescript
 * const total = calculateEquipmentMaintenance Cost(costs, 'EQ-001', dateRange);
 * ```
 */
export declare const calculateEquipmentMaintenanceCost: (costs: MaintenanceCost[], equipmentId: string, period: DateRange) => number;
/**
 * Calculates ROI for preventive maintenance.
 *
 * @param {MaintenanceCost[]} preventiveCosts - Preventive maintenance costs
 * @param {MaintenanceCost[]} reactiveCosts - Reactive maintenance costs
 * @param {DateRange} period - Analysis period
 * @returns {number} ROI percentage
 *
 * @example
 * ```typescript
 * const roi = calculatePreventiveMaintenanceROI(preventive, reactive, period);
 * ```
 */
export declare const calculatePreventiveMaintenanceROI: (preventiveCosts: MaintenanceCost[], reactiveCosts: MaintenanceCost[], period: DateRange) => number;
/**
 * Records equipment downtime event.
 *
 * @param {Partial<EquipmentDowntime>} downtimeData - Downtime data
 * @returns {EquipmentDowntime} Downtime record
 *
 * @example
 * ```typescript
 * const downtime = recordEquipmentDowntime({
 *   equipmentId: 'EQ-001',
 *   reason: 'Motor failure',
 *   impact: 'high'
 * });
 * ```
 */
export declare const recordEquipmentDowntime: (downtimeData: Partial<EquipmentDowntime>) => EquipmentDowntime;
/**
 * Calculates Mean Time Between Failures (MTBF).
 *
 * @param {EquipmentDowntime[]} downtimes - Downtime records
 * @param {string} equipmentId - Equipment ID
 * @returns {number} MTBF in hours
 *
 * @example
 * ```typescript
 * const mtbf = calculateMTBF(downtimes, 'EQ-001');
 * ```
 */
export declare const calculateMTBF: (downtimes: EquipmentDowntime[], equipmentId: string) => number;
/**
 * Calculates total downtime in period.
 *
 * @param {EquipmentDowntime[]} downtimes - Downtime records
 * @param {string} equipmentId - Equipment ID
 * @param {DateRange} period - Time period
 * @returns {number} Total downtime hours
 *
 * @example
 * ```typescript
 * const hours = calculateTotalDowntime(downtimes, 'EQ-001', period);
 * ```
 */
export declare const calculateTotalDowntime: (downtimes: EquipmentDowntime[], equipmentId: string, period: DateRange) => number;
/**
 * Creates maintenance history record.
 *
 * @param {MaintenanceWorkOrder} workOrder - Completed work order
 * @param {string} performedBy - Technician name
 * @param {MaintenanceCost} cost - Cost record
 * @returns {MaintenanceHistory} History record
 *
 * @example
 * ```typescript
 * const record = createMaintenanceHistory(workOrder, 'John Smith', costRecord);
 * ```
 */
export declare const createMaintenanceHistory: (workOrder: MaintenanceWorkOrder, performedBy: string, cost: MaintenanceCost) => MaintenanceHistory;
/**
 * Generates maintenance report for equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {MaintenanceHistory[]} history - History records
 * @param {DateRange} period - Report period
 * @returns {object} Maintenance report
 *
 * @example
 * ```typescript
 * const report = generateEquipmentMaintenanceReport('EQ-001', history, period);
 * ```
 */
export declare const generateEquipmentMaintenanceReport: (equipmentId: string, history: MaintenanceHistory[], period: DateRange) => {
    totalEvents: number;
    preventive: number;
    reactive: number;
    totalCost: number;
    averageCost: number;
    lastMaintenance?: Date;
};
/**
 * Exports maintenance history as formatted report.
 *
 * @param {MaintenanceHistory[]} history - History records
 * @param {DateRange} period - Report period
 * @returns {string} Formatted report
 *
 * @example
 * ```typescript
 * const report = exportMaintenanceReport(history, period);
 * ```
 */
export declare const exportMaintenanceReport: (history: MaintenanceHistory[], period: DateRange) => string;
/**
 * Creates vendor service request.
 *
 * @param {Partial<VendorService>} serviceData - Service data
 * @returns {VendorService} Vendor service record
 *
 * @example
 * ```typescript
 * const service = createVendorService({
 *   propertyId: 'PROP-001',
 *   vendorId: 'VEND-001',
 *   serviceType: 'Elevator Annual Inspection',
 *   scheduledDate: new Date()
 * });
 * ```
 */
export declare const createVendorService: (serviceData: Partial<VendorService>) => VendorService;
/**
 * Updates vendor service status.
 *
 * @param {VendorService} service - Service to update
 * @param {string} newStatus - New status
 * @returns {VendorService} Updated service
 *
 * @example
 * ```typescript
 * const updated = updateVendorServiceStatus(service, 'completed');
 * ```
 */
export declare const updateVendorServiceStatus: (service: VendorService, newStatus: "scheduled" | "in_progress" | "completed" | "cancelled") => VendorService;
/**
 * Calculates vendor performance metrics.
 *
 * @param {VendorService[]} services - Vendor services
 * @param {string} vendorId - Vendor ID
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateVendorPerformance(services, 'VEND-001');
 * ```
 */
export declare const calculateVendorPerformance: (services: VendorService[], vendorId: string) => {
    totalServices: number;
    onTimeCompletion: number;
    costAccuracy: number;
    averageRating: number;
};
/**
 * Calculates comprehensive maintenance metrics.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - All work orders
 * @param {MaintenanceCost[]} costs - All costs
 * @param {EquipmentDowntime[]} downtimes - All downtime records
 * @param {string} propertyId - Property ID
 * @param {DateRange} period - Analysis period
 * @returns {MaintenanceMetrics} Comprehensive metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateMaintenanceMetrics(
 *   workOrders, costs, downtimes, 'PROP-001', period
 * );
 * ```
 */
export declare const calculateMaintenanceMetrics: (workOrders: MaintenanceWorkOrder[], costs: MaintenanceCost[], downtimes: EquipmentDowntime[], propertyId: string, period: DateRange) => MaintenanceMetrics;
/**
 * Identifies maintenance improvement opportunities.
 *
 * @param {MaintenanceMetrics} metrics - Maintenance metrics
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @returns {Array<string>} Improvement recommendations
 *
 * @example
 * ```typescript
 * const recommendations = identifyImprovementOpportunities(metrics, history);
 * ```
 */
export declare const identifyImprovementOpportunities: (metrics: MaintenanceMetrics, history: MaintenanceHistory[]) => string[];
/**
 * Tracks equipment lifecycle status and maintenance milestones.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {MaintenanceHistory[]} history - Equipment history
 * @returns {object} Lifecycle status
 *
 * @example
 * ```typescript
 * const status = trackEquipmentLifecycle('EQ-001', history);
 * ```
 */
export declare const trackEquipmentLifecycle: (equipmentId: string, history: MaintenanceHistory[]) => {
    equipmentId: string;
    totalMaintenance: number;
    lastService?: Date;
    maintenanceAge: number;
    costToDate: number;
    preventiveRatio: number;
};
/**
 * Validates maintenance SLA compliance.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - Work orders
 * @param {object} slaTargets - SLA targets
 * @returns {object} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = validateMaintenanceSLA(workOrders, {
 *   critical: 4, high: 24, medium: 72
 * });
 * ```
 */
export declare const validateMaintenanceSLA: (workOrders: MaintenanceWorkOrder[], slaTargets: Record<MaintenancePriority, number>) => {
    compliant: number;
    nonCompliant: number;
    complianceRate: number;
    violations: string[];
};
/**
 * Optimizes spare parts inventory levels.
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {MaintenanceInventory[]} inventory - Current inventory
 * @returns {Array<{partNumber: string, recommendedQuantity: number, reason: string}>} Recommendations
 *
 * @example
 * ```typescript
 * const recommendations = optimizeSparePartsInventory(history, inventory);
 * ```
 */
export declare const optimizeSparePartsInventory: (history: MaintenanceHistory[], inventory: MaintenanceInventory[]) => Array<{
    partNumber: string;
    recommendedQuantity: number;
    reason: string;
}>;
/**
 * Assesses technician skill coverage.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - Pending work orders
 * @param {Technician[]} technicians - Available technicians
 * @returns {object} Skill coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = assessTechnicianSkillCoverage(workOrders, technicians);
 * ```
 */
export declare const assessTechnicianSkillCoverage: (workOrders: MaintenanceWorkOrder[], technicians: Technician[]) => {
    wellCovered: number;
    underCovered: number;
    gaps: string[];
};
/**
 * Analyzes maintenance backlog and estimates clearance time.
 *
 * @param {MaintenanceWorkOrder[]} workOrders - All work orders
 * @param {number} dailyCapacity - Work orders per day
 * @returns {object} Backlog analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeMaintenanceBacklog(workOrders, 5);
 * ```
 */
export declare const analyzeMaintenanceBacklog: (workOrders: MaintenanceWorkOrder[], dailyCapacity?: number) => {
    totalPending: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    estimatedClearanceDate: Date;
    averageWaitTime: number;
};
/**
 * Forecasts maintenance costs for budget planning.
 *
 * @param {MaintenanceCost[]} historicalCosts - Historical costs
 * @param {number} months - Forecast period
 * @returns {Array<{month: string, estimatedCost: number, trend: string}>} Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastMaintenanceCosts(costs, 6);
 * ```
 */
export declare const forecastMaintenanceCosts: (historicalCosts: MaintenanceCost[], months?: number) => Array<{
    month: string;
    estimatedCost: number;
    trend: string;
}>;
/**
 * Calculates maintenance compliance score.
 *
 * @param {MaintenanceMetrics} metrics - Maintenance metrics
 * @param {PreventiveMaintenancePlan[]} plans - PM plans
 * @returns {number} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateMaintenanceComplianceScore(metrics, plans);
 * ```
 */
export declare const calculateMaintenanceComplianceScore: (metrics: MaintenanceMetrics, plans: PreventiveMaintenancePlan[]) => number;
/**
 * Generates preventive maintenance schedule for next quarter.
 *
 * @param {PreventiveMaintenancePlan[]} plans - PM plans
 * @param {Date} startDate - Quarter start date
 * @returns {Array<{date: Date, task: string, equipmentId: string}>} Scheduled tasks
 *
 * @example
 * ```typescript
 * const schedule = generateQuarterlyMaintenanceSchedule(plans, new Date());
 * ```
 */
export declare const generateQuarterlyMaintenanceSchedule: (plans: PreventiveMaintenancePlan[], startDate?: Date) => Array<{
    date: Date;
    task: string;
    equipmentId: string;
    frequency: string;
}>;
/**
 * Identifies equipment requiring replacement or major overhaul.
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {number} costThreshold - Cost threshold for consideration
 * @param {number} downtimeThreshold - Downtime hours threshold
 * @returns {Array<{equipmentId: string, reason: string, estimatedCost: number}>} Replacement candidates
 *
 * @example
 * ```typescript
 * const candidates = identifyReplacementCandidates(history, 5000, 200);
 * ```
 */
export declare const identifyReplacementCandidates: (history: MaintenanceHistory[], costThreshold?: number, downtimeThreshold?: number) => Array<{
    equipmentId: string;
    reason: string;
    estimatedAnnualCost: number;
}>;
/**
 * Predicts potential equipment failures based on maintenance patterns.
 *
 * @param {MaintenanceHistory[]} history - Equipment maintenance history
 * @param {string} equipmentId - Equipment ID
 * @returns {object} Failure risk assessment
 *
 * @example
 * ```typescript
 * const risk = predictEquipmentFailure(history, 'EQ-001');
 * ```
 */
export declare const predictEquipmentFailure: (history: MaintenanceHistory[], equipmentId: string) => {
    riskLevel: "low" | "medium" | "high" | "critical";
    riskScore: number;
    indicators: string[];
    recommendedAction: string;
};
export {};
//# sourceMappingURL=property-maintenance-management-kit.d.ts.map