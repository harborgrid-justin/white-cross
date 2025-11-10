/**
 * LOC: ENG-EM-001
 * File: /reuse/engineer/equipment-maintenance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Facilities management services
 *   - Equipment tracking systems
 *   - Maintenance scheduling modules
 */
import { Model } from 'sequelize';
interface Equipment {
    id: string;
    assetTag: string;
    name: string;
    type: EquipmentType;
    category: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    location: string;
    department: string;
    status: EquipmentStatus;
    acquisitionDate: Date;
    warrantyExpiration?: Date;
    purchasePrice: number;
    currentValue: number;
    criticality: CriticalityLevel;
    specifications?: Record<string, any>;
    operatingHours?: number;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
}
type EquipmentType = 'medical_device' | 'hvac_system' | 'electrical_system' | 'plumbing_system' | 'it_equipment' | 'laboratory_equipment' | 'manufacturing_equipment' | 'facility_equipment';
type EquipmentStatus = 'operational' | 'maintenance' | 'repair' | 'down' | 'retired' | 'standby';
type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';
interface MaintenanceSchedule {
    id: string;
    equipmentId: string;
    equipmentName: string;
    scheduleType: ScheduleType;
    frequency: MaintenanceFrequency;
    interval?: number;
    intervalUnit?: 'days' | 'weeks' | 'months' | 'hours' | 'cycles';
    startDate: Date;
    endDate?: Date;
    nextDueDate: Date;
    tasks: MaintenanceTask[];
    priority: MaintenancePriority;
    estimatedDuration: number;
    estimatedCost: number;
    assignedTeam?: string;
    active: boolean;
    notes?: string;
}
type ScheduleType = 'preventive' | 'predictive' | 'condition_based' | 'time_based' | 'usage_based';
type MaintenanceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'as_needed';
type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low';
interface MaintenanceTask {
    id: string;
    scheduleId: string;
    name: string;
    description: string;
    category: TaskCategory;
    estimatedDuration: number;
    requiredSkills: string[];
    tools: string[];
    parts?: PartRequirement[];
    safety: SafetyRequirement[];
    procedure?: string;
    checklistItems: ChecklistItem[];
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
}
type TaskCategory = 'inspection' | 'cleaning' | 'lubrication' | 'calibration' | 'adjustment' | 'replacement' | 'testing' | 'documentation';
interface ChecklistItem {
    id: string;
    description: string;
    required: boolean;
    completed: boolean;
    result?: string;
    notes?: string;
    completedBy?: string;
    completedAt?: Date;
}
interface SafetyRequirement {
    type: string;
    description: string;
    ppe?: string[];
    lockoutTagout?: boolean;
    permits?: string[];
}
interface PartRequirement {
    partId: string;
    partNumber: string;
    description: string;
    quantity: number;
    unitCost: number;
    critical: boolean;
}
interface MaintenanceWorkOrder {
    id: string;
    equipmentId: string;
    equipmentName: string;
    scheduleId?: string;
    type: WorkOrderType;
    priority: MaintenancePriority;
    status: WorkOrderStatus;
    title: string;
    description: string;
    reportedBy: string;
    reportedAt: Date;
    assignedTo?: string;
    assignedAt?: Date;
    scheduledDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    estimatedCost?: number;
    actualCost?: number;
    downtime?: number;
    tasks: MaintenanceTask[];
    partsUsed: PartUsage[];
    notes?: string;
    attachments?: string[];
    resolutionNotes?: string;
}
type WorkOrderType = 'preventive' | 'corrective' | 'emergency' | 'inspection' | 'calibration' | 'upgrade';
type WorkOrderStatus = 'pending' | 'assigned' | 'scheduled' | 'in_progress' | 'waiting_parts' | 'on_hold' | 'completed' | 'cancelled';
interface PartUsage {
    partId: string;
    partNumber: string;
    description: string;
    quantityUsed: number;
    unitCost: number;
    totalCost: number;
    usedAt: Date;
    usedBy: string;
}
interface MaintenanceHistory {
    id: string;
    equipmentId: string;
    workOrderId: string;
    date: Date;
    type: WorkOrderType;
    description: string;
    performedBy: string;
    duration: number;
    cost: number;
    partsReplaced: string[];
    downtime: number;
    outcome: 'successful' | 'partial' | 'failed';
    notes?: string;
}
interface EquipmentDowntime {
    id: string;
    equipmentId: string;
    equipmentName: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    reason: DowntimeReason;
    category: DowntimeCategory;
    impact: 'critical' | 'high' | 'medium' | 'low';
    affectedOperations: string[];
    workOrderId?: string;
    reportedBy: string;
    notes?: string;
}
type DowntimeReason = 'scheduled_maintenance' | 'unscheduled_maintenance' | 'breakdown' | 'waiting_parts' | 'waiting_technician' | 'testing' | 'other';
type DowntimeCategory = 'planned' | 'unplanned';
interface SparePart {
    id: string;
    partNumber: string;
    name: string;
    description: string;
    category: string;
    manufacturer: string;
    supplier: string;
    compatibleEquipment: string[];
    stockQuantity: number;
    reorderLevel: number;
    reorderQuantity: number;
    unitCost: number;
    location: string;
    leadTime: number;
    critical: boolean;
    lastRestocked?: Date;
}
interface MaintenanceCost {
    equipmentId: string;
    equipmentName: string;
    period: DateRange;
    laborCost: number;
    partsCost: number;
    contractorCost: number;
    totalCost: number;
    workOrderCount: number;
    averageCostPerWorkOrder: number;
    preventiveCost: number;
    correctiveCost: number;
    emergencyCost: number;
}
interface DateRange {
    start: Date;
    end: Date;
}
interface ReliabilityMetrics {
    equipmentId: string;
    equipmentName: string;
    period: DateRange;
    mtbf: number;
    mttr: number;
    availability: number;
    reliability: number;
    failureCount: number;
    totalDowntime: number;
    totalOperatingTime: number;
    maintainabilityIndex: number;
}
interface PredictiveAnalytics {
    equipmentId: string;
    equipmentName: string;
    healthScore: number;
    failureProbability: number;
    predictedFailureDate?: Date;
    remainingUsefulLife?: number;
    confidenceLevel: number;
    trendingFactors: TrendingFactor[];
    recommendations: string[];
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
}
interface TrendingFactor {
    metric: string;
    currentValue: number;
    normalRange: {
        min: number;
        max: number;
    };
    trend: 'increasing' | 'decreasing' | 'stable';
    severity: 'critical' | 'warning' | 'normal';
}
interface MaintenanceCalendar {
    date: string;
    scheduledMaintenance: MaintenanceSchedule[];
    workOrders: MaintenanceWorkOrder[];
    totalEstimatedDuration: number;
    totalEstimatedCost: number;
    resourceRequirements: ResourceRequirement[];
    conflicts: CalendarConflict[];
}
interface ResourceRequirement {
    type: 'technician' | 'equipment' | 'facility';
    name: string;
    skills?: string[];
    hours: number;
    available: boolean;
}
interface CalendarConflict {
    type: 'resource' | 'timing' | 'dependency';
    severity: 'critical' | 'high' | 'medium';
    description: string;
    affectedItems: string[];
    resolution?: string;
}
interface MaintenanceNotification {
    id: string;
    type: NotificationType;
    priority: 'critical' | 'high' | 'medium' | 'low';
    equipmentId: string;
    equipmentName: string;
    subject: string;
    message: string;
    recipients: string[];
    scheduledFor: Date;
    sent: boolean;
    sentAt?: Date;
    relatedWorkOrderId?: string;
}
type NotificationType = 'maintenance_due' | 'maintenance_overdue' | 'equipment_down' | 'parts_low_stock' | 'calibration_due' | 'warranty_expiring' | 'work_order_assigned' | 'work_order_completed';
/**
 * Creates a preventive maintenance schedule for equipment.
 *
 * @param {Equipment} equipment - Equipment to schedule
 * @param {MaintenanceFrequency} frequency - Maintenance frequency
 * @param {MaintenanceTask[]} tasks - Maintenance tasks
 * @returns {MaintenanceSchedule} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = createPreventiveMaintenanceSchedule(
 *   equipment,
 *   'monthly',
 *   [inspectionTask, lubricationTask]
 * );
 * console.log(`Next maintenance: ${schedule.nextDueDate}`);
 * ```
 */
export declare const createPreventiveMaintenanceSchedule: (equipment: Equipment, frequency: MaintenanceFrequency, tasks: MaintenanceTask[], startDate?: Date) => MaintenanceSchedule;
/**
 * Calculates next maintenance date based on frequency.
 *
 * @param {Date} lastDate - Last maintenance date
 * @param {MaintenanceFrequency} frequency - Maintenance frequency
 * @returns {Date} Next maintenance date
 *
 * @example
 * ```typescript
 * const nextDate = calculateNextMaintenanceDate(lastMaintenance, 'quarterly');
 * ```
 */
export declare const calculateNextMaintenanceDate: (lastDate: Date, frequency: MaintenanceFrequency) => Date;
/**
 * Generates maintenance schedules for all equipment.
 *
 * @param {Equipment[]} equipment - Equipment list
 * @param {Map<string, MaintenanceFrequency>} frequencyMap - Equipment-specific frequencies
 * @returns {MaintenanceSchedule[]} Generated schedules
 *
 * @example
 * ```typescript
 * const schedules = generateMaintenanceSchedules(equipment, frequencyMap);
 * console.log(`Created ${schedules.length} schedules`);
 * ```
 */
export declare const generateMaintenanceSchedules: (equipment: Equipment[], frequencyMap: Map<string, MaintenanceFrequency>, taskTemplates: Map<string, MaintenanceTask[]>) => MaintenanceSchedule[];
/**
 * Updates schedule based on completion.
 *
 * @param {MaintenanceSchedule} schedule - Schedule to update
 * @param {Date} completionDate - Completion date
 * @returns {MaintenanceSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = updateScheduleAfterCompletion(schedule, new Date());
 * ```
 */
export declare const updateScheduleAfterCompletion: (schedule: MaintenanceSchedule, completionDate: Date) => MaintenanceSchedule;
/**
 * Identifies overdue maintenance schedules.
 *
 * @param {MaintenanceSchedule[]} schedules - All schedules
 * @returns {MaintenanceSchedule[]} Overdue schedules
 *
 * @example
 * ```typescript
 * const overdue = identifyOverdueMaintenance(schedules);
 * overdue.forEach(s => console.log(`${s.equipmentName} is overdue`));
 * ```
 */
export declare const identifyOverdueMaintenance: (schedules: MaintenanceSchedule[]) => MaintenanceSchedule[];
/**
 * Analyzes equipment health and predicts failures.
 *
 * @param {Equipment} equipment - Equipment to analyze
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {any} sensorData - Real-time sensor data
 * @returns {PredictiveAnalytics} Predictive analysis
 *
 * @example
 * ```typescript
 * const analytics = analyzeEquipmentHealth(equipment, history, sensorData);
 * if (analytics.failureProbability > 70) {
 *   console.log('High risk of failure - schedule immediate maintenance');
 * }
 * ```
 */
export declare const analyzeEquipmentHealth: (equipment: Equipment, history: MaintenanceHistory[], sensorData?: any) => PredictiveAnalytics;
/**
 * Predicts equipment failure dates using historical patterns.
 *
 * @param {Equipment} equipment - Equipment to analyze
 * @param {MaintenanceHistory[]} history - Historical data
 * @returns {Date | null} Predicted failure date
 *
 * @example
 * ```typescript
 * const failureDate = predictEquipmentFailure(equipment, history);
 * if (failureDate) {
 *   console.log(`Predicted failure: ${failureDate.toLocaleDateString()}`);
 * }
 * ```
 */
export declare const predictEquipmentFailure: (equipment: Equipment, history: MaintenanceHistory[]) => Date | null;
/**
 * Identifies equipment condition trends.
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {any} sensorData - Current sensor readings
 * @returns {TrendingFactor[]} Identified trends
 *
 * @example
 * ```typescript
 * const trends = identifyTrendingFactors(history, sensorData);
 * trends.forEach(t => console.log(`${t.metric}: ${t.trend}`));
 * ```
 */
export declare const identifyTrendingFactors: (history: MaintenanceHistory[], sensorData?: any) => TrendingFactor[];
/**
 * Generates health score dashboard for multiple equipment.
 *
 * @param {Equipment[]} equipment - Equipment list
 * @param {Map<string, MaintenanceHistory[]>} historyMap - History by equipment ID
 * @returns {PredictiveAnalytics[]} Health scores for all equipment
 *
 * @example
 * ```typescript
 * const dashboard = generateHealthScoreDashboard(equipment, historyMap);
 * const critical = dashboard.filter(d => d.riskLevel === 'critical');
 * ```
 */
export declare const generateHealthScoreDashboard: (equipment: Equipment[], historyMap: Map<string, MaintenanceHistory[]>) => PredictiveAnalytics[];
/**
 * Records maintenance history entry.
 *
 * @param {MaintenanceWorkOrder} workOrder - Completed work order
 * @returns {MaintenanceHistory} History record
 *
 * @example
 * ```typescript
 * const history = recordMaintenanceHistory(completedWorkOrder);
 * ```
 */
export declare const recordMaintenanceHistory: (workOrder: MaintenanceWorkOrder) => MaintenanceHistory;
/**
 * Retrieves maintenance history for equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {MaintenanceHistory[]} allHistory - All history records
 * @param {DateRange} [period] - Optional date range
 * @returns {MaintenanceHistory[]} Filtered history
 *
 * @example
 * ```typescript
 * const history = getMaintenanceHistory(equipmentId, allHistory, period);
 * console.log(`Found ${history.length} maintenance records`);
 * ```
 */
export declare const getMaintenanceHistory: (equipmentId: string, allHistory: MaintenanceHistory[], period?: DateRange) => MaintenanceHistory[];
/**
 * Generates maintenance summary report.
 *
 * @param {Equipment} equipment - Equipment to analyze
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @returns {Object} Summary statistics
 *
 * @example
 * ```typescript
 * const summary = generateMaintenanceSummary(equipment, history);
 * console.log(`Total cost: $${summary.totalCost}`);
 * ```
 */
export declare const generateMaintenanceSummary: (equipment: Equipment, history: MaintenanceHistory[]) => {
    equipmentId: string;
    equipmentName: string;
    totalMaintenanceEvents: number;
    totalCost: number;
    totalDowntime: number;
    preventiveCount: number;
    correctiveCount: number;
    emergencyCount: number;
    preventiveRatio: number;
    avgCostPerMaintenance: number;
    avgDowntime: number;
    mostCommonIssues: string[];
    partsFrequency: Map<string, number>;
};
/**
 * Compares maintenance history across equipment.
 *
 * @param {Equipment[]} equipment - Equipment to compare
 * @param {Map<string, MaintenanceHistory[]>} historyMap - History by equipment
 * @returns {Object[]} Comparative analysis
 *
 * @example
 * ```typescript
 * const comparison = compareMaintenanceHistory(equipment, historyMap);
 * ```
 */
export declare const compareMaintenanceHistory: (equipment: Equipment[], historyMap: Map<string, MaintenanceHistory[]>) => {
    costPerDay: number;
    reliabilityScore: number;
    equipmentId: string;
    equipmentName: string;
    totalMaintenanceEvents: number;
    totalCost: number;
    totalDowntime: number;
    preventiveCount: number;
    correctiveCount: number;
    emergencyCount: number;
    preventiveRatio: number;
    avgCostPerMaintenance: number;
    avgDowntime: number;
    mostCommonIssues: string[];
    partsFrequency: Map<string, number>;
}[];
/**
 * Records equipment downtime event.
 *
 * @param {Equipment} equipment - Affected equipment
 * @param {DowntimeReason} reason - Downtime reason
 * @param {DowntimeCategory} category - Planned or unplanned
 * @returns {EquipmentDowntime} Downtime record
 *
 * @example
 * ```typescript
 * const downtime = recordEquipmentDowntime(equipment, 'breakdown', 'unplanned');
 * ```
 */
export declare const recordEquipmentDowntime: (equipment: Equipment, reason: DowntimeReason, category: DowntimeCategory, reportedBy: string, affectedOperations?: string[]) => EquipmentDowntime;
/**
 * Completes downtime record when equipment is restored.
 *
 * @param {EquipmentDowntime} downtime - Downtime record
 * @param {Date} endTime - Restoration time
 * @returns {EquipmentDowntime} Updated record
 *
 * @example
 * ```typescript
 * const completed = completeDowntimeRecord(downtime, new Date());
 * console.log(`Downtime duration: ${completed.duration} hours`);
 * ```
 */
export declare const completeDowntimeRecord: (downtime: EquipmentDowntime, endTime?: Date) => EquipmentDowntime;
/**
 * Calculates total downtime for period.
 *
 * @param {EquipmentDowntime[]} downtimes - Downtime records
 * @param {DateRange} period - Analysis period
 * @returns {Object} Downtime statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDowntimeStatistics(downtimes, period);
 * console.log(`Total downtime: ${stats.totalHours} hours`);
 * ```
 */
export declare const calculateDowntimeStatistics: (downtimes: EquipmentDowntime[], period: DateRange) => {
    totalDowntimeEvents: number;
    totalHours: number;
    plannedHours: number;
    unplannedHours: number;
    availabilityRate: number;
    averageDowntimePerEvent: number;
    downtimeByReason: {
        [k: string]: number;
    };
};
/**
 * Identifies equipment with excessive downtime.
 *
 * @param {Map<string, EquipmentDowntime[]>} downtimeMap - Downtime by equipment
 * @param {number} thresholdHours - Threshold for excessive downtime
 * @returns {Object[]} Equipment exceeding threshold
 *
 * @example
 * ```typescript
 * const problematic = identifyExcessiveDowntime(downtimeMap, 100);
 * ```
 */
export declare const identifyExcessiveDowntime: (downtimeMap: Map<string, EquipmentDowntime[]>, thresholdHours?: number) => any[];
/**
 * Creates maintenance checklist from template.
 *
 * @param {string} taskName - Task name
 * @param {string[]} checklistItems - Checklist items
 * @returns {ChecklistItem[]} Created checklist
 *
 * @example
 * ```typescript
 * const checklist = createMaintenanceChecklist('HVAC Inspection', items);
 * ```
 */
export declare const createMaintenanceChecklist: (taskName: string, checklistItems: string[], requiredItems?: Set<string>) => ChecklistItem[];
/**
 * Validates checklist completion.
 *
 * @param {ChecklistItem[]} checklist - Checklist to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateChecklistCompletion(checklist);
 * if (!validation.isComplete) {
 *   console.log('Missing items:', validation.missingRequired);
 * }
 * ```
 */
export declare const validateChecklistCompletion: (checklist: ChecklistItem[]) => {
    isComplete: boolean;
    requiredComplete: boolean;
    totalItems: number;
    completedItems: number;
    completionPercentage: number;
    missingRequired: string[];
};
/**
 * Updates checklist item status.
 *
 * @param {ChecklistItem} item - Checklist item
 * @param {boolean} completed - Completion status
 * @param {string} completedBy - User completing item
 * @param {string} [result] - Result or notes
 * @returns {ChecklistItem} Updated item
 *
 * @example
 * ```typescript
 * const updated = updateChecklistItem(item, true, 'tech@example.com', 'Passed');
 * ```
 */
export declare const updateChecklistItem: (item: ChecklistItem, completed: boolean, completedBy: string, result?: string) => ChecklistItem;
/**
 * Checks spare parts availability for maintenance.
 *
 * @param {PartRequirement[]} requirements - Required parts
 * @param {SparePart[]} inventory - Current inventory
 * @returns {Object} Availability status
 *
 * @example
 * ```typescript
 * const status = checkPartsAvailability(requirements, inventory);
 * if (!status.allAvailable) {
 *   console.log('Missing parts:', status.unavailable);
 * }
 * ```
 */
export declare const checkPartsAvailability: (requirements: PartRequirement[], inventory: SparePart[]) => {
    allAvailable: boolean;
    available: PartRequirement[];
    unavailable: PartRequirement[];
    lowStock: SparePart[];
    needsReorder: {
        partNumber: string;
        name: string;
        currentStock: number;
        reorderLevel: number;
        reorderQuantity: number;
        estimatedCost: number;
    }[];
};
/**
 * Updates parts inventory after usage.
 *
 * @param {SparePart} part - Spare part
 * @param {number} quantityUsed - Quantity consumed
 * @returns {SparePart} Updated inventory record
 *
 * @example
 * ```typescript
 * const updated = updatePartsInventory(part, 2);
 * ```
 */
export declare const updatePartsInventory: (part: SparePart, quantityUsed: number) => SparePart;
/**
 * Generates parts reorder recommendations.
 *
 * @param {SparePart[]} inventory - Current inventory
 * @returns {Object[]} Reorder recommendations
 *
 * @example
 * ```typescript
 * const reorders = generatePartsReorderList(inventory);
 * reorders.forEach(r => console.log(`Order ${r.quantity}x ${r.partName}`));
 * ```
 */
export declare const generatePartsReorderList: (inventory: SparePart[]) => {
    partNumber: string;
    partName: string;
    currentStock: number;
    reorderLevel: number;
    recommendedQuantity: number;
    estimatedCost: number;
    supplier: string;
    leadTime: number;
    priority: string;
}[];
/**
 * Tracks parts usage patterns.
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @returns {Map<string, number>} Usage frequency by part
 *
 * @example
 * ```typescript
 * const patterns = trackPartsUsagePatterns(history);
 * patterns.forEach((count, part) => console.log(`${part}: ${count} uses`));
 * ```
 */
export declare const trackPartsUsagePatterns: (history: MaintenanceHistory[]) => Map<string, number>;
/**
 * Calculates total maintenance cost for period.
 *
 * @param {Equipment} equipment - Equipment to analyze
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {DateRange} period - Analysis period
 * @returns {MaintenanceCost} Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = calculateMaintenanceCost(equipment, history, period);
 * console.log(`Total: $${costs.totalCost}`);
 * ```
 */
export declare const calculateMaintenanceCost: (equipment: Equipment, history: MaintenanceHistory[], period: DateRange) => MaintenanceCost;
/**
 * Compares maintenance costs across equipment.
 *
 * @param {Equipment[]} equipment - Equipment list
 * @param {Map<string, MaintenanceHistory[]>} historyMap - History by equipment
 * @param {DateRange} period - Comparison period
 * @returns {MaintenanceCost[]} Cost comparison
 *
 * @example
 * ```typescript
 * const comparison = compareMaintenanceCosts(equipment, historyMap, period);
 * ```
 */
export declare const compareMaintenanceCosts: (equipment: Equipment[], historyMap: Map<string, MaintenanceHistory[]>, period: DateRange) => MaintenanceCost[];
/**
 * Forecasts future maintenance costs.
 *
 * @param {MaintenanceHistory[]} history - Historical cost data
 * @param {number} forecastMonths - Months to forecast
 * @returns {Object} Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastMaintenanceCosts(history, 12);
 * console.log(`Expected annual cost: $${forecast.totalForecast}`);
 * ```
 */
export declare const forecastMaintenanceCosts: (history: MaintenanceHistory[], forecastMonths?: number) => {
    averageMonthlyCost: number;
    totalForecast: number;
    confidenceLevel: number;
    trend: "stable" | "increasing" | "decreasing";
};
/**
 * Calculates Mean Time Between Failures (MTBF).
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @returns {number} MTBF in hours
 *
 * @example
 * ```typescript
 * const mtbf = calculateMTBF(history);
 * console.log(`MTBF: ${mtbf} hours`);
 * ```
 */
export declare const calculateMTBF: (history: MaintenanceHistory[]) => number;
/**
 * Calculates Mean Time To Repair (MTTR).
 *
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @returns {number} MTTR in hours
 *
 * @example
 * ```typescript
 * const mttr = calculateMTTR(history);
 * console.log(`MTTR: ${mttr} hours`);
 * ```
 */
export declare const calculateMTTR: (history: MaintenanceHistory[]) => number;
/**
 * Calculates equipment availability percentage.
 *
 * @param {EquipmentDowntime[]} downtimes - Downtime records
 * @param {DateRange} period - Analysis period
 * @returns {number} Availability percentage
 *
 * @example
 * ```typescript
 * const availability = calculateAvailability(downtimes, period);
 * console.log(`Availability: ${availability}%`);
 * ```
 */
export declare const calculateAvailability: (downtimes: EquipmentDowntime[], period: DateRange) => number;
/**
 * Calculates comprehensive reliability metrics.
 *
 * @param {Equipment} equipment - Equipment to analyze
 * @param {MaintenanceHistory[]} history - Maintenance history
 * @param {EquipmentDowntime[]} downtimes - Downtime records
 * @param {DateRange} period - Analysis period
 * @returns {ReliabilityMetrics} Comprehensive metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateReliabilityMetrics(equipment, history, downtimes, period);
 * console.log(`MTBF: ${metrics.mtbf}, MTTR: ${metrics.mttr}`);
 * ```
 */
export declare const calculateReliabilityMetrics: (equipment: Equipment, history: MaintenanceHistory[], downtimes: EquipmentDowntime[], period: DateRange) => ReliabilityMetrics;
/**
 * Generates maintenance calendar for date range.
 *
 * @param {MaintenanceSchedule[]} schedules - Maintenance schedules
 * @param {MaintenanceWorkOrder[]} workOrders - Work orders
 * @param {DateRange} period - Calendar period
 * @returns {MaintenanceCalendar[]} Daily calendar entries
 *
 * @example
 * ```typescript
 * const calendar = generateMaintenanceCalendar(schedules, workOrders, period);
 * ```
 */
export declare const generateMaintenanceCalendar: (schedules: MaintenanceSchedule[], workOrders: MaintenanceWorkOrder[], period: DateRange) => MaintenanceCalendar[];
/**
 * Creates maintenance notification.
 *
 * @param {NotificationType} type - Notification type
 * @param {Equipment} equipment - Related equipment
 * @param {string[]} recipients - Notification recipients
 * @param {any} data - Additional notification data
 * @returns {MaintenanceNotification} Created notification
 *
 * @example
 * ```typescript
 * const notification = createMaintenanceNotification(
 *   'maintenance_due',
 *   equipment,
 *   ['manager@example.com'],
 *   { dueDate: nextMaintenance }
 * );
 * ```
 */
export declare const createMaintenanceNotification: (type: NotificationType, equipment: Equipment, recipients: string[], data?: any) => MaintenanceNotification;
/**
 * Schedules automated maintenance notifications.
 *
 * @param {MaintenanceSchedule[]} schedules - Maintenance schedules
 * @param {number} daysAdvance - Days in advance to notify
 * @returns {MaintenanceNotification[]} Scheduled notifications
 *
 * @example
 * ```typescript
 * const notifications = scheduleMaintenanceNotifications(schedules, 7);
 * ```
 */
export declare const scheduleMaintenanceNotifications: (schedules: MaintenanceSchedule[], daysAdvance?: number) => MaintenanceNotification[];
/**
 * NestJS service for equipment maintenance management.
 * Provides comprehensive maintenance operations with dependency injection.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [EquipmentMaintenanceService],
 *   exports: [EquipmentMaintenanceService],
 * })
 * export class MaintenanceModule {}
 * ```
 */
export declare class EquipmentMaintenanceService {
    private readonly equipmentModel;
    private readonly scheduleModel;
    private readonly workOrderModel;
    private readonly historyModel;
    private readonly logger;
    constructor(equipmentModel: typeof Model, scheduleModel: typeof Model, workOrderModel: typeof Model, historyModel: typeof Model);
    /**
     * Creates preventive maintenance schedule for equipment.
     */
    createMaintenanceSchedule(equipmentId: string, frequency: MaintenanceFrequency, tasks: MaintenanceTask[]): Promise<MaintenanceSchedule>;
    /**
     * Analyzes equipment health and generates predictive analytics.
     */
    analyzeEquipmentHealth(equipmentId: string): Promise<PredictiveAnalytics>;
    /**
     * Generates comprehensive maintenance calendar.
     */
    getMaintenanceCalendar(period: DateRange): Promise<MaintenanceCalendar[]>;
    /**
     * Calculates reliability metrics for equipment.
     */
    calculateReliabilityMetrics(equipmentId: string, period: DateRange): Promise<ReliabilityMetrics>;
}
/**
 * NestJS service for spare parts management.
 */
export declare class SparePartsManagementService {
    private readonly sparePartModel;
    private readonly logger;
    constructor(sparePartModel: typeof Model);
    /**
     * Checks parts availability and generates reorder list.
     */
    checkPartsAndReorder(requirements: PartRequirement[]): Promise<{
        availability: any;
        reorderList: any[];
    }>;
    /**
     * Updates inventory after parts usage.
     */
    recordPartsUsage(partsUsed: PartUsage[]): Promise<void>;
}
export {};
//# sourceMappingURL=equipment-maintenance-kit.d.ts.map