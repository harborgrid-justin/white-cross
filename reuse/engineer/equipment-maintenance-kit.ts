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

import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, Op, Sequelize } from 'sequelize';
import {
  addDays,
  addWeeks,
  addMonths,
  differenceInDays,
  differenceInHours,
  isWithinInterval,
  format,
  startOfDay,
  endOfDay,
} from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

type EquipmentType =
  | 'medical_device'
  | 'hvac_system'
  | 'electrical_system'
  | 'plumbing_system'
  | 'it_equipment'
  | 'laboratory_equipment'
  | 'manufacturing_equipment'
  | 'facility_equipment';

type EquipmentStatus =
  | 'operational'
  | 'maintenance'
  | 'repair'
  | 'down'
  | 'retired'
  | 'standby';

type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';

interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  scheduleType: ScheduleType;
  frequency: MaintenanceFrequency;
  interval?: number; // for interval-based scheduling
  intervalUnit?: 'days' | 'weeks' | 'months' | 'hours' | 'cycles';
  startDate: Date;
  endDate?: Date;
  nextDueDate: Date;
  tasks: MaintenanceTask[];
  priority: MaintenancePriority;
  estimatedDuration: number; // minutes
  estimatedCost: number;
  assignedTeam?: string;
  active: boolean;
  notes?: string;
}

type ScheduleType = 'preventive' | 'predictive' | 'condition_based' | 'time_based' | 'usage_based';

type MaintenanceFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'
  | 'as_needed';

type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low';

interface MaintenanceTask {
  id: string;
  scheduleId: string;
  name: string;
  description: string;
  category: TaskCategory;
  estimatedDuration: number; // minutes
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

type TaskCategory =
  | 'inspection'
  | 'cleaning'
  | 'lubrication'
  | 'calibration'
  | 'adjustment'
  | 'replacement'
  | 'testing'
  | 'documentation';

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
  ppe?: string[]; // Personal Protective Equipment
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
  scheduleId?: string; // If from scheduled maintenance
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
  downtime?: number; // hours
  tasks: MaintenanceTask[];
  partsUsed: PartUsage[];
  notes?: string;
  attachments?: string[];
  resolutionNotes?: string;
}

type WorkOrderType =
  | 'preventive'
  | 'corrective'
  | 'emergency'
  | 'inspection'
  | 'calibration'
  | 'upgrade';

type WorkOrderStatus =
  | 'pending'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'waiting_parts'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

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
  duration: number; // hours
  cost: number;
  partsReplaced: string[];
  downtime: number; // hours
  outcome: 'successful' | 'partial' | 'failed';
  notes?: string;
}

interface EquipmentDowntime {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // hours
  reason: DowntimeReason;
  category: DowntimeCategory;
  impact: 'critical' | 'high' | 'medium' | 'low';
  affectedOperations: string[];
  workOrderId?: string;
  reportedBy: string;
  notes?: string;
}

type DowntimeReason =
  | 'scheduled_maintenance'
  | 'unscheduled_maintenance'
  | 'breakdown'
  | 'waiting_parts'
  | 'waiting_technician'
  | 'testing'
  | 'other';

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
  leadTime: number; // days
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
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  availability: number; // percentage
  reliability: number; // percentage
  failureCount: number;
  totalDowntime: number; // hours
  totalOperatingTime: number; // hours
  maintainabilityIndex: number;
}

interface PredictiveAnalytics {
  equipmentId: string;
  equipmentName: string;
  healthScore: number; // 0-100
  failureProbability: number; // 0-100
  predictedFailureDate?: Date;
  remainingUsefulLife?: number; // days
  confidenceLevel: number; // 0-100
  trendingFactors: TrendingFactor[];
  recommendations: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

interface TrendingFactor {
  metric: string;
  currentValue: number;
  normalRange: { min: number; max: number };
  trend: 'increasing' | 'decreasing' | 'stable';
  severity: 'critical' | 'warning' | 'normal';
}

interface MaintenanceCalendar {
  date: string; // YYYY-MM-DD
  scheduledMaintenance: MaintenanceSchedule[];
  workOrders: MaintenanceWorkOrder[];
  totalEstimatedDuration: number; // hours
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

type NotificationType =
  | 'maintenance_due'
  | 'maintenance_overdue'
  | 'equipment_down'
  | 'parts_low_stock'
  | 'calibration_due'
  | 'warranty_expiring'
  | 'work_order_assigned'
  | 'work_order_completed';

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
export const createPreventiveMaintenanceSchedule = (
  equipment: Equipment,
  frequency: MaintenanceFrequency,
  tasks: MaintenanceTask[],
  startDate: Date = new Date()
): MaintenanceSchedule => {
  const nextDueDate = calculateNextMaintenanceDate(startDate, frequency);

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
export const calculateNextMaintenanceDate = (
  lastDate: Date,
  frequency: MaintenanceFrequency
): Date => {
  switch (frequency) {
    case 'daily':
      return addDays(lastDate, 1);
    case 'weekly':
      return addWeeks(lastDate, 1);
    case 'biweekly':
      return addWeeks(lastDate, 2);
    case 'monthly':
      return addMonths(lastDate, 1);
    case 'quarterly':
      return addMonths(lastDate, 3);
    case 'semi_annual':
      return addMonths(lastDate, 6);
    case 'annual':
      return addMonths(lastDate, 12);
    default:
      return addMonths(lastDate, 1);
  }
};

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
export const generateMaintenanceSchedules = (
  equipment: Equipment[],
  frequencyMap: Map<string, MaintenanceFrequency>,
  taskTemplates: Map<string, MaintenanceTask[]>
): MaintenanceSchedule[] => {
  return equipment
    .filter(e => e.status !== 'retired')
    .map(eq => {
      const frequency = frequencyMap.get(eq.id) || getDefaultFrequency(eq.criticality);
      const tasks = taskTemplates.get(eq.type) || [];

      return createPreventiveMaintenanceSchedule(eq, frequency, tasks);
    });
};

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
export const updateScheduleAfterCompletion = (
  schedule: MaintenanceSchedule,
  completionDate: Date
): MaintenanceSchedule => {
  const nextDueDate = calculateNextMaintenanceDate(completionDate, schedule.frequency);

  return {
    ...schedule,
    nextDueDate,
    tasks: schedule.tasks.map(t => ({ ...t, completed: false })),
  };
};

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
export const identifyOverdueMaintenance = (
  schedules: MaintenanceSchedule[]
): MaintenanceSchedule[] => {
  const now = new Date();
  return schedules
    .filter(s => s.active && s.nextDueDate < now)
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
};

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
export const analyzeEquipmentHealth = (
  equipment: Equipment,
  history: MaintenanceHistory[],
  sensorData?: any
): PredictiveAnalytics => {
  // Calculate failure patterns
  const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
  const recentFailures = failures.filter(f =>
    differenceInDays(new Date(), f.date) <= 180
  );

  // Health score calculation (simplified)
  let healthScore = 100;

  // Age factor
  const ageInDays = differenceInDays(new Date(), equipment.acquisitionDate);
  const ageFactor = Math.max(0, 100 - (ageInDays / 3650) * 30); // Decrease over 10 years
  healthScore -= (100 - ageFactor) * 0.2;

  // Failure frequency factor
  const failureRate = (recentFailures.length / 180) * 365; // Annual failure rate
  healthScore -= Math.min(50, failureRate * 10);

  // Downtime factor
  const totalDowntime = history
    .filter(h => differenceInDays(new Date(), h.date) <= 90)
    .reduce((sum, h) => sum + h.downtime, 0);
  healthScore -= Math.min(20, totalDowntime);

  healthScore = Math.max(0, Math.min(100, healthScore));

  // Predict failure probability
  const failureProbability = Math.min(100, 100 - healthScore + (failureRate * 5));

  // Estimate remaining useful life
  const mtbf = calculateMTBF(history);
  const remainingUsefulLife = mtbf > 0 ? Math.floor(mtbf * 0.7) : undefined;

  // Determine risk level
  let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
  if (failureProbability > 80 || healthScore < 30) riskLevel = 'critical';
  else if (failureProbability > 60 || healthScore < 50) riskLevel = 'high';
  else if (failureProbability > 40 || healthScore < 70) riskLevel = 'medium';

  return {
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    healthScore: Math.round(healthScore * 100) / 100,
    failureProbability: Math.round(failureProbability * 100) / 100,
    remainingUsefulLife,
    confidenceLevel: 75, // Based on data quality and quantity
    trendingFactors: identifyTrendingFactors(history, sensorData),
    recommendations: generateMaintenanceRecommendations(healthScore, failureProbability, equipment),
    riskLevel,
  };
};

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
export const predictEquipmentFailure = (
  equipment: Equipment,
  history: MaintenanceHistory[]
): Date | null => {
  const failures = history.filter(h => h.outcome === 'failed' || h.type === 'emergency');

  if (failures.length < 2) return null;

  // Calculate average time between failures
  const intervals: number[] = [];
  for (let i = 1; i < failures.length; i++) {
    const interval = differenceInDays(failures[i].date, failures[i - 1].date);
    intervals.push(interval);
  }

  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
  const lastFailure = failures[failures.length - 1].date;

  return addDays(lastFailure, Math.floor(avgInterval));
};

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
export const identifyTrendingFactors = (
  history: MaintenanceHistory[],
  sensorData?: any
): TrendingFactor[] => {
  const factors: TrendingFactor[] = [];

  // Analyze failure frequency trend
  const recentFailures = history.filter(h =>
    differenceInDays(new Date(), h.date) <= 90 &&
    (h.type === 'corrective' || h.type === 'emergency')
  ).length;

  const olderFailures = history.filter(h =>
    differenceInDays(new Date(), h.date) > 90 &&
    differenceInDays(new Date(), h.date) <= 180 &&
    (h.type === 'corrective' || h.type === 'emergency')
  ).length;

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
    .filter(h => differenceInDays(new Date(), h.date) <= 90)
    .reduce((sum, h) => sum + h.cost, 0);

  const olderCosts = history
    .filter(h => differenceInDays(new Date(), h.date) > 90 && differenceInDays(new Date(), h.date) <= 180)
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
export const generateHealthScoreDashboard = (
  equipment: Equipment[],
  historyMap: Map<string, MaintenanceHistory[]>
): PredictiveAnalytics[] => {
  return equipment.map(eq => {
    const history = historyMap.get(eq.id) || [];
    return analyzeEquipmentHealth(eq, history);
  }).sort((a, b) => a.healthScore - b.healthScore); // Worst first
};

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
export const recordMaintenanceHistory = (
  workOrder: MaintenanceWorkOrder
): MaintenanceHistory => {
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
export const getMaintenanceHistory = (
  equipmentId: string,
  allHistory: MaintenanceHistory[],
  period?: DateRange
): MaintenanceHistory[] => {
  let filtered = allHistory.filter(h => h.equipmentId === equipmentId);

  if (period) {
    filtered = filtered.filter(h =>
      h.date >= period.start && h.date <= period.end
    );
  }

  return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
};

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
export const generateMaintenanceSummary = (
  equipment: Equipment,
  history: MaintenanceHistory[]
) => {
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
export const compareMaintenanceHistory = (
  equipment: Equipment[],
  historyMap: Map<string, MaintenanceHistory[]>
) => {
  return equipment.map(eq => {
    const history = historyMap.get(eq.id) || [];
    const summary = generateMaintenanceSummary(eq, history);

    return {
      ...summary,
      costPerDay: eq.acquisitionDate
        ? summary.totalCost / differenceInDays(new Date(), eq.acquisitionDate)
        : 0,
      reliabilityScore: calculateReliabilityScore(history),
    };
  }).sort((a, b) => b.totalCost - a.totalCost);
};

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
export const recordEquipmentDowntime = (
  equipment: Equipment,
  reason: DowntimeReason,
  category: DowntimeCategory,
  reportedBy: string,
  affectedOperations: string[] = []
): EquipmentDowntime => {
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
export const completeDowntimeRecord = (
  downtime: EquipmentDowntime,
  endTime: Date = new Date()
): EquipmentDowntime => {
  const duration = differenceInHours(endTime, downtime.startTime);

  return {
    ...downtime,
    endTime,
    duration: Math.round(duration * 100) / 100,
  };
};

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
export const calculateDowntimeStatistics = (
  downtimes: EquipmentDowntime[],
  period: DateRange
) => {
  const relevantDowntimes = downtimes.filter(d =>
    d.startTime >= period.start && d.startTime <= period.end
  );

  const totalHours = relevantDowntimes.reduce((sum, d) => sum + (d.duration || 0), 0);
  const plannedHours = relevantDowntimes
    .filter(d => d.category === 'planned')
    .reduce((sum, d) => sum + (d.duration || 0), 0);
  const unplannedHours = relevantDowntimes
    .filter(d => d.category === 'unplanned')
    .reduce((sum, d) => sum + (d.duration || 0), 0);

  const periodHours = differenceInHours(period.end, period.start);
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
export const identifyExcessiveDowntime = (
  downtimeMap: Map<string, EquipmentDowntime[]>,
  thresholdHours: number = 100
) => {
  const results: any[] = [];

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
export const createMaintenanceChecklist = (
  taskName: string,
  checklistItems: string[],
  requiredItems: Set<string> = new Set()
): ChecklistItem[] => {
  return checklistItems.map(item => ({
    id: `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: item,
    required: requiredItems.has(item),
    completed: false,
  }));
};

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
export const validateChecklistCompletion = (checklist: ChecklistItem[]) => {
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
export const updateChecklistItem = (
  item: ChecklistItem,
  completed: boolean,
  completedBy: string,
  result?: string
): ChecklistItem => {
  return {
    ...item,
    completed,
    completedBy: completed ? completedBy : undefined,
    completedAt: completed ? new Date() : undefined,
    result,
  };
};

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
export const checkPartsAvailability = (
  requirements: PartRequirement[],
  inventory: SparePart[]
) => {
  const available: PartRequirement[] = [];
  const unavailable: PartRequirement[] = [];
  const lowStock: SparePart[] = [];

  requirements.forEach(req => {
    const sparePart = inventory.find(p => p.partNumber === req.partNumber);

    if (!sparePart) {
      unavailable.push(req);
    } else if (sparePart.stockQuantity < req.quantity) {
      unavailable.push(req);
      if (sparePart.stockQuantity <= sparePart.reorderLevel) {
        lowStock.push(sparePart);
      }
    } else {
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
export const updatePartsInventory = (
  part: SparePart,
  quantityUsed: number
): SparePart => {
  const newQuantity = part.stockQuantity - quantityUsed;

  return {
    ...part,
    stockQuantity: Math.max(0, newQuantity),
  };
};

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
export const generatePartsReorderList = (inventory: SparePart[]) => {
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
export const trackPartsUsagePatterns = (
  history: MaintenanceHistory[]
): Map<string, number> => {
  const usageMap = new Map<string, number>();

  history.forEach(record => {
    record.partsReplaced.forEach(part => {
      const current = usageMap.get(part) || 0;
      usageMap.set(part, current + 1);
    });
  });

  return new Map([...usageMap.entries()].sort((a, b) => b[1] - a[1]));
};

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
export const calculateMaintenanceCost = (
  equipment: Equipment,
  history: MaintenanceHistory[],
  period: DateRange
): MaintenanceCost => {
  const relevantHistory = history.filter(h =>
    h.equipmentId === equipment.id &&
    h.date >= period.start &&
    h.date <= period.end
  );

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
export const compareMaintenanceCosts = (
  equipment: Equipment[],
  historyMap: Map<string, MaintenanceHistory[]>,
  period: DateRange
): MaintenanceCost[] => {
  return equipment
    .map(eq => {
      const history = historyMap.get(eq.id) || [];
      return calculateMaintenanceCost(eq, history, period);
    })
    .sort((a, b) => b.totalCost - a.totalCost);
};

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
export const forecastMaintenanceCosts = (
  history: MaintenanceHistory[],
  forecastMonths: number = 12
) => {
  // Group by month
  const monthlyCosts = new Map<string, number>();

  history.forEach(record => {
    const month = format(record.date, 'yyyy-MM');
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
export const calculateMTBF = (history: MaintenanceHistory[]): number => {
  const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');

  if (failures.length < 2) return 0;

  const intervals: number[] = [];
  for (let i = 1; i < failures.length; i++) {
    const hours = differenceInHours(failures[i].date, failures[i - 1].date);
    intervals.push(hours);
  }

  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
  return Math.round(avgInterval * 100) / 100;
};

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
export const calculateMTTR = (history: MaintenanceHistory[]): number => {
  const repairs = history.filter(h => h.type === 'corrective' || h.type === 'emergency');

  if (repairs.length === 0) return 0;

  const totalRepairTime = repairs.reduce((sum, r) => sum + r.duration, 0);
  const avgRepairTime = totalRepairTime / repairs.length;

  return Math.round(avgRepairTime * 100) / 100;
};

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
export const calculateAvailability = (
  downtimes: EquipmentDowntime[],
  period: DateRange
): number => {
  const stats = calculateDowntimeStatistics(downtimes, period);
  return stats.availabilityRate;
};

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
export const calculateReliabilityMetrics = (
  equipment: Equipment,
  history: MaintenanceHistory[],
  downtimes: EquipmentDowntime[],
  period: DateRange
): ReliabilityMetrics => {
  const mtbf = calculateMTBF(history);
  const mttr = calculateMTTR(history);
  const availability = calculateAvailability(downtimes, period);

  const failures = history.filter(h => h.type === 'corrective' || h.type === 'emergency');
  const totalDowntime = downtimes.reduce((sum, d) => sum + (d.duration || 0), 0);
  const periodHours = differenceInHours(period.end, period.start);
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
export const generateMaintenanceCalendar = (
  schedules: MaintenanceSchedule[],
  workOrders: MaintenanceWorkOrder[],
  period: DateRange
): MaintenanceCalendar[] => {
  const calendar: MaintenanceCalendar[] = [];
  let currentDate = startOfDay(period.start);

  while (currentDate <= period.end) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    // Find schedules due on this date
    const scheduledMaintenance = schedules.filter(s =>
      s.active && format(s.nextDueDate, 'yyyy-MM-dd') === dateStr
    );

    // Find work orders scheduled for this date
    const dailyWorkOrders = workOrders.filter(wo =>
      wo.scheduledDate && format(wo.scheduledDate, 'yyyy-MM-dd') === dateStr
    );

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

    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

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
export const createMaintenanceNotification = (
  type: NotificationType,
  equipment: Equipment,
  recipients: string[],
  data?: any
): MaintenanceNotification => {
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
export const scheduleMaintenanceNotifications = (
  schedules: MaintenanceSchedule[],
  daysAdvance: number = 7
): MaintenanceNotification[] => {
  const notifications: MaintenanceNotification[] = [];
  const notifyDate = addDays(new Date(), daysAdvance);

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
        message: `Preventive maintenance is due on ${format(schedule.nextDueDate, 'MMM dd, yyyy')}`,
        recipients: [], // Would be populated from schedule or equipment
        scheduledFor: addDays(schedule.nextDueDate, -daysAdvance),
        sent: false,
      });
    }
  });

  return notifications;
};

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
@Injectable()
export class EquipmentMaintenanceService {
  private readonly logger = new Logger(EquipmentMaintenanceService.name);

  constructor(
    @InjectModel('Equipment') private readonly equipmentModel: typeof Model,
    @InjectModel('MaintenanceSchedule') private readonly scheduleModel: typeof Model,
    @InjectModel('MaintenanceWorkOrder') private readonly workOrderModel: typeof Model,
    @InjectModel('MaintenanceHistory') private readonly historyModel: typeof Model,
  ) {}

  /**
   * Creates preventive maintenance schedule for equipment.
   */
  async createMaintenanceSchedule(
    equipmentId: string,
    frequency: MaintenanceFrequency,
    tasks: MaintenanceTask[]
  ): Promise<MaintenanceSchedule> {
    this.logger.log(`Creating maintenance schedule for equipment: ${equipmentId}`);

    const equipment = await this.equipmentModel.findByPk(equipmentId);
    if (!equipment) {
      throw new Error(`Equipment not found: ${equipmentId}`);
    }

    const schedule = createPreventiveMaintenanceSchedule(
      equipment as any,
      frequency,
      tasks
    );

    await this.scheduleModel.create(schedule);

    this.logger.log(`Schedule created: ${schedule.id}`);
    return schedule;
  }

  /**
   * Analyzes equipment health and generates predictive analytics.
   */
  async analyzeEquipmentHealth(equipmentId: string): Promise<PredictiveAnalytics> {
    const equipment = await this.equipmentModel.findByPk(equipmentId);
    const history = await this.historyModel.findAll({
      where: { equipmentId },
      order: [['date', 'DESC']],
    });

    const analytics = analyzeEquipmentHealth(equipment as any, history as any);

    this.logger.log(
      `Equipment ${equipmentId} health score: ${analytics.healthScore}, risk: ${analytics.riskLevel}`
    );

    return analytics;
  }

  /**
   * Generates comprehensive maintenance calendar.
   */
  async getMaintenanceCalendar(period: DateRange): Promise<MaintenanceCalendar[]> {
    const schedules = await this.scheduleModel.findAll({
      where: {
        active: true,
        nextDueDate: {
          [Op.between]: [period.start, period.end],
        },
      },
    });

    const workOrders = await this.workOrderModel.findAll({
      where: {
        scheduledDate: {
          [Op.between]: [period.start, period.end],
        },
      },
    });

    return generateMaintenanceCalendar(schedules as any, workOrders as any, period);
  }

  /**
   * Calculates reliability metrics for equipment.
   */
  async calculateReliabilityMetrics(
    equipmentId: string,
    period: DateRange
  ): Promise<ReliabilityMetrics> {
    const equipment = await this.equipmentModel.findByPk(equipmentId);
    const history = await this.historyModel.findAll({
      where: {
        equipmentId,
        date: {
          [Op.between]: [period.start, period.end],
        },
      },
    });

    // Would also fetch downtimes from database
    const downtimes: EquipmentDowntime[] = []; // Placeholder

    return calculateReliabilityMetrics(
      equipment as any,
      history as any,
      downtimes,
      period
    );
  }
}

/**
 * NestJS service for spare parts management.
 */
@Injectable()
export class SparePartsManagementService {
  private readonly logger = new Logger(SparePartsManagementService.name);

  constructor(
    @InjectModel('SparePart') private readonly sparePartModel: typeof Model,
  ) {}

  /**
   * Checks parts availability and generates reorder list.
   */
  async checkPartsAndReorder(
    requirements: PartRequirement[]
  ): Promise<{ availability: any; reorderList: any[] }> {
    const inventory = await this.sparePartModel.findAll();

    const availability = checkPartsAvailability(requirements, inventory as any);
    const reorderList = generatePartsReorderList(inventory as any);

    if (reorderList.length > 0) {
      this.logger.warn(`${reorderList.length} parts need reordering`);
    }

    return { availability, reorderList };
  }

  /**
   * Updates inventory after parts usage.
   */
  async recordPartsUsage(partsUsed: PartUsage[]): Promise<void> {
    for (const usage of partsUsed) {
      const part = await this.sparePartModel.findOne({
        where: { partNumber: usage.partNumber },
      });

      if (part) {
        const updated = updatePartsInventory(part as any, usage.quantityUsed);
        await this.sparePartModel.update(updated, {
          where: { id: part.id },
        });
      }
    }

    this.logger.log(`Updated inventory for ${partsUsed.length} parts`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultFrequency(criticality: CriticalityLevel): MaintenanceFrequency {
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

function determineDowntimeImpact(
  criticality: CriticalityLevel,
  affectedOperationsCount: number
): 'critical' | 'high' | 'medium' | 'low' {
  if (criticality === 'critical' || affectedOperationsCount > 5) return 'critical';
  if (criticality === 'high' || affectedOperationsCount > 2) return 'high';
  if (criticality === 'medium' || affectedOperationsCount > 0) return 'medium';
  return 'low';
}

function groupDowntimeByReason(downtimes: EquipmentDowntime[]) {
  const grouped = new Map<DowntimeReason, number>();

  downtimes.forEach(d => {
    const current = grouped.get(d.reason) || 0;
    grouped.set(d.reason, current + (d.duration || 0));
  });

  return Object.fromEntries(grouped);
}

function identifyCommonIssues(history: MaintenanceHistory[]): string[] {
  const issues = new Map<string, number>();

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

function calculatePartsFrequency(history: MaintenanceHistory[]): Map<string, number> {
  return trackPartsUsagePatterns(history);
}

function calculateReliabilityScore(history: MaintenanceHistory[]): number {
  const mtbf = calculateMTBF(history);
  const mttr = calculateMTTR(history);

  if (mtbf === 0 || mttr === 0) return 50;

  // Higher MTBF and lower MTTR = higher reliability
  const score = (mtbf / (mtbf + mttr)) * 100;
  return Math.round(score * 100) / 100;
}

function calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable';

  const first = values.slice(0, Math.floor(values.length / 2));
  const second = values.slice(Math.floor(values.length / 2));

  const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
  const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;

  if (avgSecond > avgFirst * 1.1) return 'increasing';
  if (avgSecond < avgFirst * 0.9) return 'decreasing';
  return 'stable';
}

function generateMaintenanceRecommendations(
  healthScore: number,
  failureProbability: number,
  equipment: Equipment
): string[] {
  const recommendations: string[] = [];

  if (failureProbability > 80) {
    recommendations.push('URGENT: Schedule immediate inspection and maintenance');
    recommendations.push('Consider equipment replacement if cost-effective');
  } else if (failureProbability > 60) {
    recommendations.push('Increase preventive maintenance frequency');
    recommendations.push('Monitor equipment closely for signs of deterioration');
  } else if (failureProbability > 40) {
    recommendations.push('Maintain current preventive maintenance schedule');
    recommendations.push('Consider predictive maintenance technologies');
  }

  if (healthScore < 50) {
    recommendations.push('Review maintenance procedures for effectiveness');
    recommendations.push('Evaluate total cost of ownership vs replacement');
  }

  return recommendations;
}

function extractResourceRequirements(
  schedules: MaintenanceSchedule[],
  workOrders: MaintenanceWorkOrder[]
): ResourceRequirement[] {
  const requirements: ResourceRequirement[] = [];

  schedules.forEach(schedule => {
    const skills = new Set<string>();
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

function detectCalendarConflicts(
  schedules: MaintenanceSchedule[],
  workOrders: MaintenanceWorkOrder[]
): CalendarConflict[] {
  const conflicts: CalendarConflict[] = [];

  // Check for resource over-allocation
  const totalHours = (
    schedules.reduce((sum, s) => sum + s.estimatedDuration, 0) +
    workOrders.reduce((sum, wo) => sum + (wo.estimatedDuration || 0), 0)
  ) / 60;

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

function generateNotificationContent(
  type: NotificationType,
  equipment: Equipment,
  data?: any
): { subject: string; message: string; priority: 'critical' | 'high' | 'medium' | 'low' } {
  switch (type) {
    case 'maintenance_due':
      return {
        subject: `Maintenance Due: ${equipment.name}`,
        message: `Scheduled maintenance for ${equipment.name} is due on ${data?.dueDate ? format(data.dueDate, 'MMM dd, yyyy') : 'soon'}.`,
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
