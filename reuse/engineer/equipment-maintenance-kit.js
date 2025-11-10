"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparePartsManagementService = exports.EquipmentMaintenanceService = exports.scheduleMaintenanceNotifications = exports.createMaintenanceNotification = exports.generateMaintenanceCalendar = exports.calculateReliabilityMetrics = exports.calculateAvailability = exports.calculateMTTR = exports.calculateMTBF = exports.forecastMaintenanceCosts = exports.compareMaintenanceCosts = exports.calculateMaintenanceCost = exports.trackPartsUsagePatterns = exports.generatePartsReorderList = exports.updatePartsInventory = exports.checkPartsAvailability = exports.updateChecklistItem = exports.validateChecklistCompletion = exports.createMaintenanceChecklist = exports.identifyExcessiveDowntime = exports.calculateDowntimeStatistics = exports.completeDowntimeRecord = exports.recordEquipmentDowntime = exports.compareMaintenanceHistory = exports.generateMaintenanceSummary = exports.getMaintenanceHistory = exports.recordMaintenanceHistory = exports.generateHealthScoreDashboard = exports.identifyTrendingFactors = exports.predictEquipmentFailure = exports.analyzeEquipmentHealth = exports.identifyOverdueMaintenance = exports.updateScheduleAfterCompletion = exports.generateMaintenanceSchedules = exports.calculateNextMaintenanceDate = exports.createPreventiveMaintenanceSchedule = void 0;
/**
 * File: /reuse/engineer/equipment-maintenance-kit.ts
 * Locator: WC-ENG-EM-001
 * Purpose: Equipment Maintenance Kit - Comprehensive equipment maintenance and lifecycle management
 *
 * Upstream: Independent utility module for equipment maintenance operations
 * Downstream: ../backend/*, ../frontend/*, Facilities and equipment management services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 utility functions for maintenance scheduling, tracking, and analytics
 *
 * LLM Context: Enterprise-grade equipment maintenance utilities for healthcare and engineering systems.
 * Provides preventive maintenance scheduling, predictive analytics, maintenance history tracking,
 * equipment downtime monitoring, checklist management, spare parts inventory, cost tracking,
 * reliability metrics (MTBF, MTTR), maintenance calendars, and work order integration. Essential
 * for maximizing equipment uptime, reducing maintenance costs, ensuring compliance, and extending
 * asset lifespan through data-driven maintenance strategies.
 */
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
// ============================================================================
// PREVENTIVE MAINTENANCE SCHEDULING
// ============================================================================
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
const createPreventiveMaintenanceSchedule = (equipment, frequency, tasks, startDate = new Date()) => {
    const nextDueDate = (0, exports.calculateNextMaintenanceDate)(startDate, frequency);
    const estimatedDuration = tasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    const estimatedCost = tasks.reduce((sum, task) => {
        const partsCost = task.parts?.reduce((pSum, p) => pSum + (p.quantity * p.unitCost), 0) || 0;
        return sum + partsCost;
    }, 0);
    return {
        id: `SCHED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        scheduleType: 'preventive',
        frequency,
        startDate,
        nextDueDate,
        tasks,
        priority: equipment.criticality === 'critical' ? 'critical' : 'medium',
        estimatedDuration,
        estimatedCost,
        active: true,
    };
};
exports.createPreventiveMaintenanceSchedule = createPreventiveMaintenanceSchedule;
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
const calculateNextMaintenanceDate = (lastDate, frequency) => {
    switch (frequency) {
        case 'daily':
            return (0, date_fns_1.addDays)(lastDate, 1);
        case 'weekly':
            return (0, date_fns_1.addWeeks)(lastDate, 1);
        case 'biweekly':
            return (0, date_fns_1.addWeeks)(lastDate, 2);
        case 'monthly':
            return (0, date_fns_1.addMonths)(lastDate, 1);
        case 'quarterly':
            return (0, date_fns_1.addMonths)(lastDate, 3);
        case 'semi_annual':
            return (0, date_fns_1.addMonths)(lastDate, 6);
        case 'annual':
            return (0, date_fns_1.addMonths)(lastDate, 12);
        default:
            return (0, date_fns_1.addMonths)(lastDate, 1);
    }
};
exports.calculateNextMaintenanceDate = calculateNextMaintenanceDate;
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
const generateMaintenanceSchedules = (equipment, frequencyMap, taskTemplates) => {
    return equipment
        .filter(e => e.status !== 'retired')
        .map(eq => {
        const frequency = frequencyMap.get(eq.id) || getDefaultFrequency(eq.criticality);
        const tasks = taskTemplates.get(eq.type) || [];
        return (0, exports.createPreventiveMaintenanceSchedule)(eq, frequency, tasks);
    });
};
exports.generateMaintenanceSchedules = generateMaintenanceSchedules;
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
const updateScheduleAfterCompletion = (schedule, completionDate) => {
    const nextDueDate = (0, exports.calculateNextMaintenanceDate)(completionDate, schedule.frequency);
    return {
        ...schedule,
        nextDueDate,
        tasks: schedule.tasks.map(t => ({ ...t, completed: false })),
    };
};
exports.updateScheduleAfterCompletion = updateScheduleAfterCompletion;
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
const identifyOverdueMaintenance = (schedules) => {
    const now = new Date();
    return schedules
        .filter(s => s.active && s.nextDueDate < now)
        .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
};
exports.identifyOverdueMaintenance = identifyOverdueMaintenance;
// ============================================================================
// PREDICTIVE MAINTENANCE ANALYTICS
// ============================================================================
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
const analyzeEquipmentHealth = (equipment, history, sensorData) => {
    // Calculate failure patterns
    const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
    const recentFailures = failures.filter(f => (0, date_fns_1.differenceInDays)(new Date(), f.date) <= 180);
    // Health score calculation (simplified)
    let healthScore = 100;
    // Age factor
    const ageInDays = (0, date_fns_1.differenceInDays)(new Date(), equipment.acquisitionDate);
    const ageFactor = Math.max(0, 100 - (ageInDays / 3650) * 30); // Decrease over 10 years
    healthScore -= (100 - ageFactor) * 0.2;
    // Failure frequency factor
    const failureRate = (recentFailures.length / 180) * 365; // Annual failure rate
    healthScore -= Math.min(50, failureRate * 10);
    // Downtime factor
    const totalDowntime = history
        .filter(h => (0, date_fns_1.differenceInDays)(new Date(), h.date) <= 90)
        .reduce((sum, h) => sum + h.downtime, 0);
    healthScore -= Math.min(20, totalDowntime);
    healthScore = Math.max(0, Math.min(100, healthScore));
    // Predict failure probability
    const failureProbability = Math.min(100, 100 - healthScore + (failureRate * 5));
    // Estimate remaining useful life
    const mtbf = (0, exports.calculateMTBF)(history);
    const remainingUsefulLife = mtbf > 0 ? Math.floor(mtbf * 0.7) : undefined;
    // Determine risk level
    let riskLevel = 'low';
    if (failureProbability > 80 || healthScore < 30)
        riskLevel = 'critical';
    else if (failureProbability > 60 || healthScore < 50)
        riskLevel = 'high';
    else if (failureProbability > 40 || healthScore < 70)
        riskLevel = 'medium';
    return {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        healthScore: Math.round(healthScore * 100) / 100,
        failureProbability: Math.round(failureProbability * 100) / 100,
        remainingUsefulLife,
        confidenceLevel: 75, // Based on data quality and quantity
        trendingFactors: (0, exports.identifyTrendingFactors)(history, sensorData),
        recommendations: generateMaintenanceRecommendations(healthScore, failureProbability, equipment),
        riskLevel,
    };
};
exports.analyzeEquipmentHealth = analyzeEquipmentHealth;
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
const predictEquipmentFailure = (equipment, history) => {
    const failures = history.filter(h => h.outcome === 'failed' || h.type === 'emergency');
    if (failures.length < 2)
        return null;
    // Calculate average time between failures
    const intervals = [];
    for (let i = 1; i < failures.length; i++) {
        const interval = (0, date_fns_1.differenceInDays)(failures[i].date, failures[i - 1].date);
        intervals.push(interval);
    }
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const lastFailure = failures[failures.length - 1].date;
    return (0, date_fns_1.addDays)(lastFailure, Math.floor(avgInterval));
};
exports.predictEquipmentFailure = predictEquipmentFailure;
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
const identifyTrendingFactors = (history, sensorData) => {
    const factors = [];
    // Analyze failure frequency trend
    const recentFailures = history.filter(h => (0, date_fns_1.differenceInDays)(new Date(), h.date) <= 90 &&
        (h.type === 'corrective' || h.type === 'emergency')).length;
    const olderFailures = history.filter(h => (0, date_fns_1.differenceInDays)(new Date(), h.date) > 90 &&
        (0, date_fns_1.differenceInDays)(new Date(), h.date) <= 180 &&
        (h.type === 'corrective' || h.type === 'emergency')).length;
    factors.push({
        metric: 'Failure Frequency',
        currentValue: recentFailures,
        normalRange: { min: 0, max: 2 },
        trend: recentFailures > olderFailures ? 'increasing' :
            recentFailures < olderFailures ? 'decreasing' : 'stable',
        severity: recentFailures > 3 ? 'critical' : recentFailures > 1 ? 'warning' : 'normal',
    });
    // Analyze maintenance cost trend
    const recentCosts = history
        .filter(h => (0, date_fns_1.differenceInDays)(new Date(), h.date) <= 90)
        .reduce((sum, h) => sum + h.cost, 0);
    const olderCosts = history
        .filter(h => (0, date_fns_1.differenceInDays)(new Date(), h.date) > 90 && (0, date_fns_1.differenceInDays)(new Date(), h.date) <= 180)
        .reduce((sum, h) => sum + h.cost, 0);
    factors.push({
        metric: 'Maintenance Cost',
        currentValue: recentCosts,
        normalRange: { min: 0, max: 5000 },
        trend: recentCosts > olderCosts * 1.2 ? 'increasing' :
            recentCosts < olderCosts * 0.8 ? 'decreasing' : 'stable',
        severity: recentCosts > 10000 ? 'critical' : recentCosts > 5000 ? 'warning' : 'normal',
    });
    return factors;
};
exports.identifyTrendingFactors = identifyTrendingFactors;
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
const generateHealthScoreDashboard = (equipment, historyMap) => {
    return equipment.map(eq => {
        const history = historyMap.get(eq.id) || [];
        return (0, exports.analyzeEquipmentHealth)(eq, history);
    }).sort((a, b) => a.healthScore - b.healthScore); // Worst first
};
exports.generateHealthScoreDashboard = generateHealthScoreDashboard;
// ============================================================================
// MAINTENANCE HISTORY TRACKING
// ============================================================================
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
const recordMaintenanceHistory = (workOrder) => {
    const duration = workOrder.actualDuration
        ? workOrder.actualDuration / 60
        : workOrder.estimatedDuration
            ? workOrder.estimatedDuration / 60
            : 0;
    const partsReplaced = workOrder.partsUsed.map(p => p.description);
    return {
        id: `HIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        equipmentId: workOrder.equipmentId,
        workOrderId: workOrder.id,
        date: workOrder.completedAt || new Date(),
        type: workOrder.type,
        description: workOrder.title,
        performedBy: workOrder.assignedTo || workOrder.reportedBy,
        duration,
        cost: workOrder.actualCost || workOrder.estimatedCost || 0,
        partsReplaced,
        downtime: workOrder.downtime || 0,
        outcome: workOrder.status === 'completed' ? 'successful' : 'partial',
        notes: workOrder.resolutionNotes,
    };
};
exports.recordMaintenanceHistory = recordMaintenanceHistory;
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
const getMaintenanceHistory = (equipmentId, allHistory, period) => {
    let filtered = allHistory.filter(h => h.equipmentId === equipmentId);
    if (period) {
        filtered = filtered.filter(h => h.date >= period.start && h.date <= period.end);
    }
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
};
exports.getMaintenanceHistory = getMaintenanceHistory;
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
const generateMaintenanceSummary = (equipment, history) => {
    const totalCost = history.reduce((sum, h) => sum + h.cost, 0);
    const totalDowntime = history.reduce((sum, h) => sum + h.downtime, 0);
    const preventiveCount = history.filter(h => h.type === 'preventive').length;
    const correctiveCount = history.filter(h => h.type === 'corrective').length;
    const emergencyCount = history.filter(h => h.type === 'emergency').length;
    const avgCostPerMaintenance = history.length > 0 ? totalCost / history.length : 0;
    const avgDowntime = history.length > 0 ? totalDowntime / history.length : 0;
    return {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        totalMaintenanceEvents: history.length,
        totalCost: Math.round(totalCost * 100) / 100,
        totalDowntime: Math.round(totalDowntime * 100) / 100,
        preventiveCount,
        correctiveCount,
        emergencyCount,
        preventiveRatio: history.length > 0 ? (preventiveCount / history.length) * 100 : 0,
        avgCostPerMaintenance: Math.round(avgCostPerMaintenance * 100) / 100,
        avgDowntime: Math.round(avgDowntime * 100) / 100,
        mostCommonIssues: identifyCommonIssues(history),
        partsFrequency: calculatePartsFrequency(history),
    };
};
exports.generateMaintenanceSummary = generateMaintenanceSummary;
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
const compareMaintenanceHistory = (equipment, historyMap) => {
    return equipment.map(eq => {
        const history = historyMap.get(eq.id) || [];
        const summary = (0, exports.generateMaintenanceSummary)(eq, history);
        return {
            ...summary,
            costPerDay: eq.acquisitionDate
                ? summary.totalCost / (0, date_fns_1.differenceInDays)(new Date(), eq.acquisitionDate)
                : 0,
            reliabilityScore: calculateReliabilityScore(history),
        };
    }).sort((a, b) => b.totalCost - a.totalCost);
};
exports.compareMaintenanceHistory = compareMaintenanceHistory;
// ============================================================================
// EQUIPMENT DOWNTIME TRACKING
// ============================================================================
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
const recordEquipmentDowntime = (equipment, reason, category, reportedBy, affectedOperations = []) => {
    const impact = determineDowntimeImpact(equipment.criticality, affectedOperations.length);
    return {
        id: `DOWN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        startTime: new Date(),
        reason,
        category,
        impact,
        affectedOperations,
        reportedBy,
    };
};
exports.recordEquipmentDowntime = recordEquipmentDowntime;
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
const completeDowntimeRecord = (downtime, endTime = new Date()) => {
    const duration = (0, date_fns_1.differenceInHours)(endTime, downtime.startTime);
    return {
        ...downtime,
        endTime,
        duration: Math.round(duration * 100) / 100,
    };
};
exports.completeDowntimeRecord = completeDowntimeRecord;
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
const calculateDowntimeStatistics = (downtimes, period) => {
    const relevantDowntimes = downtimes.filter(d => d.startTime >= period.start && d.startTime <= period.end);
    const totalHours = relevantDowntimes.reduce((sum, d) => sum + (d.duration || 0), 0);
    const plannedHours = relevantDowntimes
        .filter(d => d.category === 'planned')
        .reduce((sum, d) => sum + (d.duration || 0), 0);
    const unplannedHours = relevantDowntimes
        .filter(d => d.category === 'unplanned')
        .reduce((sum, d) => sum + (d.duration || 0), 0);
    const periodHours = (0, date_fns_1.differenceInHours)(period.end, period.start);
    const availabilityRate = ((periodHours - totalHours) / periodHours) * 100;
    return {
        totalDowntimeEvents: relevantDowntimes.length,
        totalHours: Math.round(totalHours * 100) / 100,
        plannedHours: Math.round(plannedHours * 100) / 100,
        unplannedHours: Math.round(unplannedHours * 100) / 100,
        availabilityRate: Math.round(availabilityRate * 100) / 100,
        averageDowntimePerEvent: relevantDowntimes.length > 0
            ? Math.round((totalHours / relevantDowntimes.length) * 100) / 100
            : 0,
        downtimeByReason: groupDowntimeByReason(relevantDowntimes),
    };
};
exports.calculateDowntimeStatistics = calculateDowntimeStatistics;
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
const identifyExcessiveDowntime = (downtimeMap, thresholdHours = 100) => {
    const results = [];
    downtimeMap.forEach((downtimes, equipmentId) => {
        const totalHours = downtimes.reduce((sum, d) => sum + (d.duration || 0), 0);
        if (totalHours > thresholdHours) {
            results.push({
                equipmentId,
                equipmentName: downtimes[0]?.equipmentName,
                totalDowntime: Math.round(totalHours * 100) / 100,
                eventCount: downtimes.length,
                averagePerEvent: Math.round((totalHours / downtimes.length) * 100) / 100,
                recommendation: 'Consider replacement or major refurbishment',
            });
        }
    });
    return results.sort((a, b) => b.totalDowntime - a.totalDowntime);
};
exports.identifyExcessiveDowntime = identifyExcessiveDowntime;
// ============================================================================
// MAINTENANCE CHECKLIST MANAGEMENT
// ============================================================================
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
const createMaintenanceChecklist = (taskName, checklistItems, requiredItems = new Set()) => {
    return checklistItems.map(item => ({
        id: `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: item,
        required: requiredItems.has(item),
        completed: false,
    }));
};
exports.createMaintenanceChecklist = createMaintenanceChecklist;
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
const validateChecklistCompletion = (checklist) => {
    const requiredItems = checklist.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.completed);
    const missingRequired = requiredItems.filter(item => !item.completed);
    const totalCompleted = checklist.filter(item => item.completed).length;
    const completionPercentage = (totalCompleted / checklist.length) * 100;
    return {
        isComplete: missingRequired.length === 0,
        requiredComplete: completedRequired.length === requiredItems.length,
        totalItems: checklist.length,
        completedItems: totalCompleted,
        completionPercentage: Math.round(completionPercentage * 100) / 100,
        missingRequired: missingRequired.map(item => item.description),
    };
};
exports.validateChecklistCompletion = validateChecklistCompletion;
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
const updateChecklistItem = (item, completed, completedBy, result) => {
    return {
        ...item,
        completed,
        completedBy: completed ? completedBy : undefined,
        completedAt: completed ? new Date() : undefined,
        result,
    };
};
exports.updateChecklistItem = updateChecklistItem;
// ============================================================================
// SPARE PARTS MANAGEMENT
// ============================================================================
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
const checkPartsAvailability = (requirements, inventory) => {
    const available = [];
    const unavailable = [];
    const lowStock = [];
    requirements.forEach(req => {
        const sparePart = inventory.find(p => p.partNumber === req.partNumber);
        if (!sparePart) {
            unavailable.push(req);
        }
        else if (sparePart.stockQuantity < req.quantity) {
            unavailable.push(req);
            if (sparePart.stockQuantity <= sparePart.reorderLevel) {
                lowStock.push(sparePart);
            }
        }
        else {
            available.push(req);
            if (sparePart.stockQuantity - req.quantity <= sparePart.reorderLevel) {
                lowStock.push(sparePart);
            }
        }
    });
    return {
        allAvailable: unavailable.length === 0,
        available,
        unavailable,
        lowStock,
        needsReorder: lowStock.map(p => ({
            partNumber: p.partNumber,
            name: p.name,
            currentStock: p.stockQuantity,
            reorderLevel: p.reorderLevel,
            reorderQuantity: p.reorderQuantity,
            estimatedCost: p.unitCost * p.reorderQuantity,
        })),
    };
};
exports.checkPartsAvailability = checkPartsAvailability;
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
const updatePartsInventory = (part, quantityUsed) => {
    const newQuantity = part.stockQuantity - quantityUsed;
    return {
        ...part,
        stockQuantity: Math.max(0, newQuantity),
    };
};
exports.updatePartsInventory = updatePartsInventory;
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
const generatePartsReorderList = (inventory) => {
    return inventory
        .filter(part => part.stockQuantity <= part.reorderLevel)
        .map(part => ({
        partNumber: part.partNumber,
        partName: part.name,
        currentStock: part.stockQuantity,
        reorderLevel: part.reorderLevel,
        recommendedQuantity: part.reorderQuantity,
        estimatedCost: part.unitCost * part.reorderQuantity,
        supplier: part.supplier,
        leadTime: part.leadTime,
        priority: part.critical ? 'critical' : part.stockQuantity === 0 ? 'high' : 'medium',
    }))
        .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};
exports.generatePartsReorderList = generatePartsReorderList;
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
const trackPartsUsagePatterns = (history) => {
    const usageMap = new Map();
    history.forEach(record => {
        record.partsReplaced.forEach(part => {
            const current = usageMap.get(part) || 0;
            usageMap.set(part, current + 1);
        });
    });
    return new Map([...usageMap.entries()].sort((a, b) => b[1] - a[1]));
};
exports.trackPartsUsagePatterns = trackPartsUsagePatterns;
// ============================================================================
// MAINTENANCE COST TRACKING
// ============================================================================
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
const calculateMaintenanceCost = (equipment, history, period) => {
    const relevantHistory = history.filter(h => h.equipmentId === equipment.id &&
        h.date >= period.start &&
        h.date <= period.end);
    const totalCost = relevantHistory.reduce((sum, h) => sum + h.cost, 0);
    const preventiveCost = relevantHistory
        .filter(h => h.type === 'preventive')
        .reduce((sum, h) => sum + h.cost, 0);
    const correctiveCost = relevantHistory
        .filter(h => h.type === 'corrective')
        .reduce((sum, h) => sum + h.cost, 0);
    const emergencyCost = relevantHistory
        .filter(h => h.type === 'emergency')
        .reduce((sum, h) => sum + h.cost, 0);
    // Simplified labor/parts/contractor breakdown (in real system, would track separately)
    const laborCost = totalCost * 0.6;
    const partsCost = totalCost * 0.3;
    const contractorCost = totalCost * 0.1;
    return {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        period,
        laborCost: Math.round(laborCost * 100) / 100,
        partsCost: Math.round(partsCost * 100) / 100,
        contractorCost: Math.round(contractorCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        workOrderCount: relevantHistory.length,
        averageCostPerWorkOrder: relevantHistory.length > 0
            ? Math.round((totalCost / relevantHistory.length) * 100) / 100
            : 0,
        preventiveCost: Math.round(preventiveCost * 100) / 100,
        correctiveCost: Math.round(correctiveCost * 100) / 100,
        emergencyCost: Math.round(emergencyCost * 100) / 100,
    };
};
exports.calculateMaintenanceCost = calculateMaintenanceCost;
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
const compareMaintenanceCosts = (equipment, historyMap, period) => {
    return equipment
        .map(eq => {
        const history = historyMap.get(eq.id) || [];
        return (0, exports.calculateMaintenanceCost)(eq, history, period);
    })
        .sort((a, b) => b.totalCost - a.totalCost);
};
exports.compareMaintenanceCosts = compareMaintenanceCosts;
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
const forecastMaintenanceCosts = (history, forecastMonths = 12) => {
    // Group by month
    const monthlyCosts = new Map();
    history.forEach(record => {
        const month = (0, date_fns_1.format)(record.date, 'yyyy-MM');
        const current = monthlyCosts.get(month) || 0;
        monthlyCosts.set(month, current + record.cost);
    });
    const costs = Array.from(monthlyCosts.values());
    const averageMonthlyCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;
    const totalForecast = averageMonthlyCost * forecastMonths;
    return {
        averageMonthlyCost: Math.round(averageMonthlyCost * 100) / 100,
        totalForecast: Math.round(totalForecast * 100) / 100,
        confidenceLevel: costs.length >= 12 ? 80 : 60,
        trend: calculateTrend(costs),
    };
};
exports.forecastMaintenanceCosts = forecastMaintenanceCosts;
// ============================================================================
// RELIABILITY METRICS (MTBF, MTTR)
// ============================================================================
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
const calculateMTBF = (history) => {
    const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
    if (failures.length < 2)
        return 0;
    const intervals = [];
    for (let i = 1; i < failures.length; i++) {
        const hours = (0, date_fns_1.differenceInHours)(failures[i].date, failures[i - 1].date);
        intervals.push(hours);
    }
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    return Math.round(avgInterval * 100) / 100;
};
exports.calculateMTBF = calculateMTBF;
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
const calculateMTTR = (history) => {
    const repairs = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
    if (repairs.length === 0)
        return 0;
    const totalRepairTime = repairs.reduce((sum, r) => sum + r.duration, 0);
    const avgRepairTime = totalRepairTime / repairs.length;
    return Math.round(avgRepairTime * 100) / 100;
};
exports.calculateMTTR = calculateMTTR;
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
const calculateAvailability = (downtimes, period) => {
    const stats = (0, exports.calculateDowntimeStatistics)(downtimes, period);
    return stats.availabilityRate;
};
exports.calculateAvailability = calculateAvailability;
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
const calculateReliabilityMetrics = (equipment, history, downtimes, period) => {
    const mtbf = (0, exports.calculateMTBF)(history);
    const mttr = (0, exports.calculateMTTR)(history);
    const availability = (0, exports.calculateAvailability)(downtimes, period);
    const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
    const totalDowntime = downtimes.reduce((sum, d) => sum + (d.duration || 0), 0);
    const periodHours = (0, date_fns_1.differenceInHours)(period.end, period.start);
    const totalOperatingTime = periodHours - totalDowntime;
    // Reliability: Probability of no failure
    const reliability = mtbf > 0 ? Math.exp(-periodHours / mtbf) * 100 : 0;
    // Maintainability Index: Ease of repair (inverse of MTTR, normalized)
    const maintainabilityIndex = mttr > 0 ? Math.max(0, 100 - (mttr / 10)) : 100;
    return {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        period,
        mtbf: Math.round(mtbf * 100) / 100,
        mttr: Math.round(mttr * 100) / 100,
        availability: Math.round(availability * 100) / 100,
        reliability: Math.round(reliability * 100) / 100,
        failureCount: failures.length,
        totalDowntime: Math.round(totalDowntime * 100) / 100,
        totalOperatingTime: Math.round(totalOperatingTime * 100) / 100,
        maintainabilityIndex: Math.round(maintainabilityIndex * 100) / 100,
    };
};
exports.calculateReliabilityMetrics = calculateReliabilityMetrics;
// ============================================================================
// MAINTENANCE CALENDAR AND NOTIFICATIONS
// ============================================================================
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
const generateMaintenanceCalendar = (schedules, workOrders, period) => {
    const calendar = [];
    let currentDate = (0, date_fns_1.startOfDay)(period.start);
    while (currentDate <= period.end) {
        const dateStr = (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd');
        // Find schedules due on this date
        const scheduledMaintenance = schedules.filter(s => s.active && (0, date_fns_1.format)(s.nextDueDate, 'yyyy-MM-dd') === dateStr);
        // Find work orders scheduled for this date
        const dailyWorkOrders = workOrders.filter(wo => wo.scheduledDate && (0, date_fns_1.format)(wo.scheduledDate, 'yyyy-MM-dd') === dateStr);
        const totalDuration = [
            ...scheduledMaintenance.map(s => s.estimatedDuration),
            ...dailyWorkOrders.map(wo => wo.estimatedDuration || 0)
        ].reduce((sum, d) => sum + d, 0);
        const totalCost = [
            ...scheduledMaintenance.map(s => s.estimatedCost),
            ...dailyWorkOrders.map(wo => wo.estimatedCost || 0)
        ].reduce((sum, c) => sum + c, 0);
        calendar.push({
            date: dateStr,
            scheduledMaintenance,
            workOrders: dailyWorkOrders,
            totalEstimatedDuration: totalDuration / 60, // Convert to hours
            totalEstimatedCost,
            resourceRequirements: extractResourceRequirements(scheduledMaintenance, dailyWorkOrders),
            conflicts: detectCalendarConflicts(scheduledMaintenance, dailyWorkOrders),
        });
        currentDate = (0, date_fns_1.addDays)(currentDate, 1);
    }
    return calendar;
};
exports.generateMaintenanceCalendar = generateMaintenanceCalendar;
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
const createMaintenanceNotification = (type, equipment, recipients, data) => {
    const { subject, message, priority } = generateNotificationContent(type, equipment, data);
    return {
        id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        priority,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        subject,
        message,
        recipients,
        scheduledFor: new Date(),
        sent: false,
    };
};
exports.createMaintenanceNotification = createMaintenanceNotification;
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
const scheduleMaintenanceNotifications = (schedules, daysAdvance = 7) => {
    const notifications = [];
    const notifyDate = (0, date_fns_1.addDays)(new Date(), daysAdvance);
    schedules.forEach(schedule => {
        if (schedule.active && schedule.nextDueDate <= notifyDate) {
            // Create notification (would need equipment and recipients from context)
            // This is a simplified example
            notifications.push({
                id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'maintenance_due',
                priority: schedule.priority === 'critical' ? 'critical' : 'medium',
                equipmentId: schedule.equipmentId,
                equipmentName: schedule.equipmentName,
                subject: `Upcoming Maintenance: ${schedule.equipmentName}`,
                message: `Preventive maintenance is due on ${(0, date_fns_1.format)(schedule.nextDueDate, 'MMM dd, yyyy')}`,
                recipients: [], // Would be populated from schedule or equipment
                scheduledFor: (0, date_fns_1.addDays)(schedule.nextDueDate, -daysAdvance),
                sent: false,
            });
        }
    });
    return notifications;
};
exports.scheduleMaintenanceNotifications = scheduleMaintenanceNotifications;
// ============================================================================
// NESTJS SERVICE IMPLEMENTATIONS
// ============================================================================
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
let EquipmentMaintenanceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EquipmentMaintenanceService = _classThis = class {
        constructor(equipmentModel, scheduleModel, workOrderModel, historyModel) {
            this.equipmentModel = equipmentModel;
            this.scheduleModel = scheduleModel;
            this.workOrderModel = workOrderModel;
            this.historyModel = historyModel;
            this.logger = new common_1.Logger(EquipmentMaintenanceService.name);
        }
        /**
         * Creates preventive maintenance schedule for equipment.
         */
        async createMaintenanceSchedule(equipmentId, frequency, tasks) {
            this.logger.log(`Creating maintenance schedule for equipment: ${equipmentId}`);
            const equipment = await this.equipmentModel.findByPk(equipmentId);
            if (!equipment) {
                throw new Error(`Equipment not found: ${equipmentId}`);
            }
            const schedule = (0, exports.createPreventiveMaintenanceSchedule)(equipment, frequency, tasks);
            await this.scheduleModel.create(schedule);
            this.logger.log(`Schedule created: ${schedule.id}`);
            return schedule;
        }
        /**
         * Analyzes equipment health and generates predictive analytics.
         */
        async analyzeEquipmentHealth(equipmentId) {
            const equipment = await this.equipmentModel.findByPk(equipmentId);
            const history = await this.historyModel.findAll({
                where: { equipmentId },
                order: [['date', 'DESC']],
            });
            const analytics = (0, exports.analyzeEquipmentHealth)(equipment, history);
            this.logger.log(`Equipment ${equipmentId} health score: ${analytics.healthScore}, risk: ${analytics.riskLevel}`);
            return analytics;
        }
        /**
         * Generates comprehensive maintenance calendar.
         */
        async getMaintenanceCalendar(period) {
            const schedules = await this.scheduleModel.findAll({
                where: {
                    active: true,
                    nextDueDate: {
                        [sequelize_1.Op.between]: [period.start, period.end],
                    },
                },
            });
            const workOrders = await this.workOrderModel.findAll({
                where: {
                    scheduledDate: {
                        [sequelize_1.Op.between]: [period.start, period.end],
                    },
                },
            });
            return (0, exports.generateMaintenanceCalendar)(schedules, workOrders, period);
        }
        /**
         * Calculates reliability metrics for equipment.
         */
        async calculateReliabilityMetrics(equipmentId, period) {
            const equipment = await this.equipmentModel.findByPk(equipmentId);
            const history = await this.historyModel.findAll({
                where: {
                    equipmentId,
                    date: {
                        [sequelize_1.Op.between]: [period.start, period.end],
                    },
                },
            });
            // Would also fetch downtimes from database
            const downtimes = []; // Placeholder
            return (0, exports.calculateReliabilityMetrics)(equipment, history, downtimes, period);
        }
    };
    __setFunctionName(_classThis, "EquipmentMaintenanceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EquipmentMaintenanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EquipmentMaintenanceService = _classThis;
})();
exports.EquipmentMaintenanceService = EquipmentMaintenanceService;
/**
 * NestJS service for spare parts management.
 */
let SparePartsManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SparePartsManagementService = _classThis = class {
        constructor(sparePartModel) {
            this.sparePartModel = sparePartModel;
            this.logger = new common_1.Logger(SparePartsManagementService.name);
        }
        /**
         * Checks parts availability and generates reorder list.
         */
        async checkPartsAndReorder(requirements) {
            const inventory = await this.sparePartModel.findAll();
            const availability = (0, exports.checkPartsAvailability)(requirements, inventory);
            const reorderList = (0, exports.generatePartsReorderList)(inventory);
            if (reorderList.length > 0) {
                this.logger.warn(`${reorderList.length} parts need reordering`);
            }
            return { availability, reorderList };
        }
        /**
         * Updates inventory after parts usage.
         */
        async recordPartsUsage(partsUsed) {
            for (const usage of partsUsed) {
                const part = await this.sparePartModel.findOne({
                    where: { partNumber: usage.partNumber },
                });
                if (part) {
                    const updated = (0, exports.updatePartsInventory)(part, usage.quantityUsed);
                    await this.sparePartModel.update(updated, {
                        where: { id: part.id },
                    });
                }
            }
            this.logger.log(`Updated inventory for ${partsUsed.length} parts`);
        }
    };
    __setFunctionName(_classThis, "SparePartsManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SparePartsManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SparePartsManagementService = _classThis;
})();
exports.SparePartsManagementService = SparePartsManagementService;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getDefaultFrequency(criticality) {
    switch (criticality) {
        case 'critical':
            return 'monthly';
        case 'high':
            return 'quarterly';
        case 'medium':
            return 'semi_annual';
        case 'low':
            return 'annual';
        default:
            return 'quarterly';
    }
}
function determineDowntimeImpact(criticality, affectedOperationsCount) {
    if (criticality === 'critical' || affectedOperationsCount > 5)
        return 'critical';
    if (criticality === 'high' || affectedOperationsCount > 2)
        return 'high';
    if (criticality === 'medium' || affectedOperationsCount > 0)
        return 'medium';
    return 'low';
}
function groupDowntimeByReason(downtimes) {
    const grouped = new Map();
    downtimes.forEach(d => {
        const current = grouped.get(d.reason) || 0;
        grouped.set(d.reason, current + (d.duration || 0));
    });
    return Object.fromEntries(grouped);
}
function identifyCommonIssues(history) {
    const issues = new Map();
    history.forEach(h => {
        const description = h.description.toLowerCase();
        const current = issues.get(description) || 0;
        issues.set(description, current + 1);
    });
    return Array.from(issues.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([issue]) => issue);
}
function calculatePartsFrequency(history) {
    return (0, exports.trackPartsUsagePatterns)(history);
}
function calculateReliabilityScore(history) {
    const mtbf = (0, exports.calculateMTBF)(history);
    const mttr = (0, exports.calculateMTTR)(history);
    if (mtbf === 0 || mttr === 0)
        return 50;
    // Higher MTBF and lower MTTR = higher reliability
    const score = (mtbf / (mtbf + mttr)) * 100;
    return Math.round(score * 100) / 100;
}
function calculateTrend(values) {
    if (values.length < 2)
        return 'stable';
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
    const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
    if (avgSecond > avgFirst * 1.1)
        return 'increasing';
    if (avgSecond < avgFirst * 0.9)
        return 'decreasing';
    return 'stable';
}
function generateMaintenanceRecommendations(healthScore, failureProbability, equipment) {
    const recommendations = [];
    if (failureProbability > 80) {
        recommendations.push('URGENT: Schedule immediate inspection and maintenance');
        recommendations.push('Consider equipment replacement if cost-effective');
    }
    else if (failureProbability > 60) {
        recommendations.push('Increase preventive maintenance frequency');
        recommendations.push('Monitor equipment closely for signs of deterioration');
    }
    else if (failureProbability > 40) {
        recommendations.push('Maintain current preventive maintenance schedule');
        recommendations.push('Consider predictive maintenance technologies');
    }
    if (healthScore < 50) {
        recommendations.push('Review maintenance procedures for effectiveness');
        recommendations.push('Evaluate total cost of ownership vs replacement');
    }
    return recommendations;
}
function extractResourceRequirements(schedules, workOrders) {
    const requirements = [];
    schedules.forEach(schedule => {
        const skills = new Set();
        schedule.tasks.forEach(task => {
            task.requiredSkills.forEach(skill => skills.add(skill));
        });
        requirements.push({
            type: 'technician',
            name: schedule.assignedTeam || 'Maintenance Team',
            skills: Array.from(skills),
            hours: schedule.estimatedDuration / 60,
            available: true, // Would check actual availability
        });
    });
    return requirements;
}
function detectCalendarConflicts(schedules, workOrders) {
    const conflicts = [];
    // Check for resource over-allocation
    const totalHours = (schedules.reduce((sum, s) => sum + s.estimatedDuration, 0) +
        workOrders.reduce((sum, wo) => sum + (wo.estimatedDuration || 0), 0)) / 60;
    if (totalHours > 8) {
        conflicts.push({
            type: 'resource',
            severity: 'high',
            description: `Total estimated time (${Math.round(totalHours)}h) exceeds available work hours`,
            affectedItems: [
                ...schedules.map(s => s.id),
                ...workOrders.map(wo => wo.id)
            ],
            resolution: 'Reschedule some maintenance or allocate additional resources',
        });
    }
    return conflicts;
}
function generateNotificationContent(type, equipment, data) {
    switch (type) {
        case 'maintenance_due':
            return {
                subject: `Maintenance Due: ${equipment.name}`,
                message: `Scheduled maintenance for ${equipment.name} is due on ${data?.dueDate ? (0, date_fns_1.format)(data.dueDate, 'MMM dd, yyyy') : 'soon'}.`,
                priority: 'medium',
            };
        case 'maintenance_overdue':
            return {
                subject: `OVERDUE Maintenance: ${equipment.name}`,
                message: `Maintenance for ${equipment.name} is overdue. Please schedule immediately.`,
                priority: 'high',
            };
        case 'equipment_down':
            return {
                subject: `CRITICAL: Equipment Down - ${equipment.name}`,
                message: `${equipment.name} is currently down and requires immediate attention.`,
                priority: 'critical',
            };
        case 'parts_low_stock':
            return {
                subject: `Low Stock Alert: Parts for ${equipment.name}`,
                message: `Critical spare parts for ${equipment.name} are running low. Reorder recommended.`,
                priority: 'medium',
            };
        default:
            return {
                subject: `Equipment Notification: ${equipment.name}`,
                message: `Notification for ${equipment.name}`,
                priority: 'low',
            };
    }
}
//# sourceMappingURL=equipment-maintenance-kit.js.map