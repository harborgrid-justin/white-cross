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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  estimatedDuration?: number; // minutes
  actualDuration?: number;
  completedAt?: Date;
  estimatedCost?: number;
  actualCost?: number;
  partsUsed?: MaintenancePart[];
  notes?: string;
  attachments?: string[];
}

type MaintenanceType = 'preventive' | 'reactive' | 'corrective' | 'emergency' | 'predictive';

type MaintenancePriority =
  | 'critical'  // Immediate - affects operations
  | 'high'      // Within 24 hours
  | 'medium'    // Within 3-7 days
  | 'low';      // Within 2-4 weeks

type MaintenanceStatus =
  | 'draft'
  | 'pending_assignment'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

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
  estimatedDuration: number; // minutes
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
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
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
  duration: number; // minutes
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
  averageCompletionTime: number; // hours
  totalCost: number;
  averageCostPerWorkOrder: number;
  equipmentDowntimeHours: number;
  preventiveMaintenance: number; // count
  reactiveMaintenance: number;
  costPerSquareFoot?: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

// ============================================================================
// WORK ORDER CREATION AND TRACKING
// ============================================================================

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
export const createMaintenanceWorkOrder = (orderData: Partial<MaintenanceWorkOrder>): MaintenanceWorkOrder => {
  return {
    id: orderData.id || `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: orderData.propertyId!,
    equipmentId: orderData.equipmentId!,
    equipmentName: orderData.equipmentName!,
    type: orderData.type || 'reactive',
    priority: orderData.priority || 'medium',
    status: orderData.status || 'draft',
    title: orderData.title!,
    description: orderData.description!,
    requestedBy: orderData.requestedBy!,
    requestedAt: orderData.requestedAt || new Date(),
    assignedTechnicianId: orderData.assignedTechnicianId,
    assignedAt: orderData.assignedAt,
    scheduledDate: orderData.scheduledDate,
    estimatedDuration: orderData.estimatedDuration,
    actualDuration: orderData.actualDuration,
    completedAt: orderData.completedAt,
    estimatedCost: orderData.estimatedCost,
    actualCost: orderData.actualCost,
    partsUsed: orderData.partsUsed || [],
    notes: orderData.notes,
    attachments: orderData.attachments || [],
  };
};

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
export const updateWorkOrderStatus = (
  workOrder: MaintenanceWorkOrder,
  newStatus: MaintenanceStatus,
  updatedBy: string,
): MaintenanceWorkOrder => {
  return {
    ...workOrder,
    status: newStatus,
    completedAt: newStatus === 'completed' ? new Date() : workOrder.completedAt,
  };
};

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
export const assignWorkOrder = (
  workOrder: MaintenanceWorkOrder,
  technicianId: string,
): MaintenanceWorkOrder => {
  return {
    ...workOrder,
    assignedTechnicianId: technicianId,
    assignedAt: new Date(),
    status: 'assigned',
  };
};

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
export const calculateWorkOrderPriority = (workOrder: MaintenanceWorkOrder): number => {
  const priorityScores: Record<MaintenancePriority, number> = {
    critical: 1000,
    high: 500,
    medium: 250,
    low: 100,
  };

  const baseScore = priorityScores[workOrder.priority];
  const ageHours = (Date.now() - workOrder.requestedAt.getTime()) / (1000 * 60 * 60);
  const ageBonus = Math.min(ageHours * 10, 200); // Max 200 points for age

  return baseScore + ageBonus;
};

// ============================================================================
// PREVENTIVE MAINTENANCE SCHEDULING
// ============================================================================

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
export const createPreventiveMaintenancePlan = (
  planData: Partial<PreventiveMaintenancePlan>,
): PreventiveMaintenancePlan => {
  return {
    id: planData.id || `PMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: planData.propertyId!,
    equipmentId: planData.equipmentId!,
    equipmentType: planData.equipmentType!,
    planName: planData.planName!,
    status: planData.status || 'active',
    tasks: planData.tasks || [],
    startDate: planData.startDate || new Date(),
    endDate: planData.endDate,
    cost: planData.cost,
    createdAt: planData.createdAt || new Date(),
    updatedAt: planData.updatedAt || new Date(),
  };
};

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
export const generateMaintenanceDueDates = (task: PreventiveMaintenanceTask, baseDate: Date): Date[] => {
  const dueDates: Date[] = [];
  const frequencyDays: Record<string, number> = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    semi_annual: 180,
    annual: 365,
  };

  const days = frequencyDays[task.frequency] || 30;

  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + days * i);
    dueDates.push(dueDate);
  }

  return dueDates;
};

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
export const getPendingMaintenanceTasks = (
  tasks: PreventiveMaintenanceTask[],
  daysAhead: number = 7,
): PreventiveMaintenanceTask[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return tasks.filter(task => {
    if (!task.nextDueAt) return false;
    return task.nextDueAt <= futureDate;
  });
};

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
export const markMaintenanceTaskComplete = (task: PreventiveMaintenanceTask): PreventiveMaintenanceTask => {
  const nextDueAt = new Date();
  const frequencyDays: Record<string, number> = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    semi_annual: 180,
    annual: 365,
  };
  nextDueAt.setDate(nextDueAt.getDate() + (frequencyDays[task.frequency] || 30));

  return {
    ...task,
    lastCompletedAt: new Date(),
    nextDueAt,
  };
};

// ============================================================================
// REACTIVE MAINTENANCE HANDLING
// ============================================================================

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
export const createEmergencyWorkOrder = (orderData: Partial<MaintenanceWorkOrder>): MaintenanceWorkOrder => {
  return {
    ...createMaintenanceWorkOrder(orderData),
    type: 'emergency',
    priority: 'critical',
    status: 'pending_assignment',
  };
};

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
export const estimateReactiveMaintenanceCost = (
  workOrder: MaintenanceWorkOrder,
  history: MaintenanceHistory[],
): number => {
  const similarWork = history.filter(
    h => h.equipmentId === workOrder.equipmentId && h.maintenanceType === 'reactive',
  );

  if (similarWork.length === 0) {
    return workOrder.estimatedCost || 250; // Default estimate
  }

  const avgCost = similarWork.reduce((sum, w) => sum + w.cost, 0) / similarWork.length;
  return Math.round(avgCost);
};

// ============================================================================
// MAINTENANCE TASK PRIORITIZATION
// ============================================================================

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
export const prioritizeWorkOrders = (workOrders: MaintenanceWorkOrder[]): MaintenanceWorkOrder[] => {
  return [...workOrders].sort((a, b) => {
    const scoreA = calculateWorkOrderPriority(a);
    const scoreB = calculateWorkOrderPriority(b);
    return scoreB - scoreA;
  });
};

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
export const calculateEquipmentCriticality = (equipmentType: string, impact: string): number => {
  const baseScores: Record<string, number> = {
    HVAC: 80,
    electrical: 85,
    plumbing: 70,
    fire_safety: 95,
    security: 80,
    lighting: 40,
    general: 30,
  };

  const impactMultipliers: Record<string, number> = {
    critical: 1.0,
    high: 0.85,
    medium: 0.7,
    low: 0.5,
  };

  const baseScore = baseScores[equipmentType] || 50;
  const multiplier = impactMultipliers[impact] || 0.7;

  return Math.round(baseScore * multiplier);
};

// ============================================================================
// TECHNICIAN ASSIGNMENT AND DISPATCH
// ============================================================================

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
export const registerTechnician = (techData: Partial<Technician>): Technician => {
  return {
    id: techData.id || `TECH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: techData.propertyId!,
    firstName: techData.firstName!,
    lastName: techData.lastName!,
    email: techData.email!,
    phone: techData.phone!,
    status: techData.status || 'active',
    certifications: techData.certifications || [],
    specialties: techData.specialties || [],
    assignedWorkOrders: techData.assignedWorkOrders || 0,
    maxConcurrentWorkOrders: techData.maxConcurrentWorkOrders || 3,
    hourlyRate: techData.hourlyRate || 50,
    location: techData.location,
    availability: techData.availability || [],
    lastAssigned: techData.lastAssigned,
  };
};

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
export const findAvailableTechnicians = (
  workOrder: MaintenanceWorkOrder,
  technicians: Technician[],
): Technician[] => {
  return technicians.filter(tech => {
    // Check status
    if (tech.status !== 'active') return false;

    // Check workload
    if (tech.assignedWorkOrders >= tech.maxConcurrentWorkOrders) return false;

    // For now, all active technicians are candidates
    // This can be extended to check specialties, certifications, location
    return true;
  });
};

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
export const calculateTechnicianSuitability = (
  technician: Technician,
  workOrder: MaintenanceWorkOrder,
): number => {
  let score = 50;

  // Availability bonus
  if (technician.assignedWorkOrders < technician.maxConcurrentWorkOrders / 2) {
    score += 25;
  }

  // Workload consideration
  if (technician.assignedWorkOrders === 0) {
    score += 15;
  }

  // Cost consideration (prefer lower-cost technicians for routine work)
  if (workOrder.priority === 'low' && technician.hourlyRate < 75) {
    score += 10;
  }

  return Math.min(score, 100);
};

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
export const optimizeTechnicianDispatch = (
  workOrders: MaintenanceWorkOrder[],
  technicians: Technician[],
): Map<string, MaintenanceWorkOrder[]> => {
  const assignments = new Map<string, MaintenanceWorkOrder[]>();

  // Sort work orders by priority
  const sorted = prioritizeWorkOrders(workOrders);

  for (const workOrder of sorted) {
    const available = findAvailableTechnicians(workOrder, technicians).sort((a, b) => {
      const scoreA = calculateTechnicianSuitability(a, workOrder);
      const scoreB = calculateTechnicianSuitability(b, workOrder);
      return scoreB - scoreA;
    });

    if (available.length > 0) {
      const selectedTech = available[0];
      const existing = assignments.get(selectedTech.id) || [];
      existing.push(workOrder);
      assignments.set(selectedTech.id, existing);
    }
  }

  return assignments;
};

// ============================================================================
// PARTS AND INVENTORY MANAGEMENT
// ============================================================================

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
export const addInventoryItem = (inventoryData: Partial<MaintenanceInventory>): MaintenanceInventory => {
  return {
    id: inventoryData.id || `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: inventoryData.propertyId!,
    partNumber: inventoryData.partNumber!,
    name: inventoryData.name!,
    category: inventoryData.category!,
    quantity: inventoryData.quantity || 0,
    minimumQuantity: inventoryData.minimumQuantity || 5,
    maximumQuantity: inventoryData.maximumQuantity || 50,
    unitCost: inventoryData.unitCost!,
    location: inventoryData.location || 'Storage',
    lastRestocked: inventoryData.lastRestocked,
    reorderPoint: inventoryData.reorderPoint,
    leadTimeDays: inventoryData.leadTimeDays || 7,
  };
};

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
export const consumeInventory = (item: MaintenanceInventory, quantity: number): MaintenanceInventory => {
  return {
    ...item,
    quantity: Math.max(0, item.quantity - quantity),
  };
};

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
export const getRestockAlerts = (inventory: MaintenanceInventory[]): MaintenanceInventory[] => {
  return inventory.filter(item => item.quantity <= (item.reorderPoint || item.minimumQuantity));
};

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
export const calculateInventoryValue = (inventory: MaintenanceInventory[]): number => {
  return inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
};

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
export const trackPartsUsage = (
  workOrder: MaintenanceWorkOrder,
  inventory: MaintenanceInventory[],
): {
  partsUsed: MaintenancePart[];
  updatedInventory: MaintenanceInventory[];
  totalPartsCost: number;
} => {
  let totalPartsCost = 0;
  const updatedInventory = [...inventory];

  const partsUsed: MaintenancePart[] = workOrder.partsUsed?.map(part => {
    const invItem = updatedInventory.find(i => i.partNumber === part.partNumber);
    if (invItem) {
      const index = updatedInventory.indexOf(invItem);
      updatedInventory[index] = consumeInventory(invItem, part.quantity);
    }
    totalPartsCost += part.totalCost;
    return part;
  }) || [];

  return {
    partsUsed,
    updatedInventory,
    totalPartsCost,
  };
};

// ============================================================================
// MAINTENANCE COST TRACKING
// ============================================================================

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
export const recordMaintenanceCost = (
  workOrder: MaintenanceWorkOrder,
  laborCost: number,
  partsCost: number,
  equipmentCost: number = 0,
  otherCosts: number = 0,
): MaintenanceCost => {
  const totalCost = laborCost + partsCost + equipmentCost + otherCosts;
  return {
    id: `COST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workOrderId: workOrder.id,
    propertyId: workOrder.propertyId,
    laborCost,
    partsCost,
    equipmentCost,
    otherCosts,
    totalCost,
    date: new Date(),
  };
};

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
export const calculateEquipmentMaintenanceCost = (
  costs: MaintenanceCost[],
  equipmentId: string,
  period: DateRange,
): number => {
  return costs
    .filter(
      c =>
        c.date >= period.start &&
        c.date <= period.end,
    )
    .reduce((sum, c) => sum + c.totalCost, 0);
};

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
export const calculatePreventiveMaintenanceROI = (
  preventiveCosts: MaintenanceCost[],
  reactiveCosts: MaintenanceCost[],
  period: DateRange,
): number => {
  const preventiveTotal = preventiveCosts
    .filter(c => c.date >= period.start && c.date <= period.end)
    .reduce((sum, c) => sum + c.totalCost, 0);

  const reactiveTotal = reactiveCosts
    .filter(c => c.date >= period.start && c.date <= period.end)
    .reduce((sum, c) => sum + c.totalCost, 0);

  if (preventiveTotal === 0) return 0;

  // ROI = (Savings - Cost) / Cost * 100
  const savings = reactiveTotal * 0.4; // Assume 40% reduction in reactive costs
  return ((savings - preventiveTotal) / preventiveTotal) * 100;
};

// ============================================================================
// EQUIPMENT DOWNTIME ANALYSIS
// ============================================================================

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
export const recordEquipmentDowntime = (downtimeData: Partial<EquipmentDowntime>): EquipmentDowntime => {
  const startTime = downtimeData.startTime || new Date();
  const endTime = downtimeData.endTime;
  const durationMinutes = endTime ? (endTime.getTime() - startTime.getTime()) / (1000 * 60) : undefined;

  return {
    id: downtimeData.id || `DT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    equipmentId: downtimeData.equipmentId!,
    equipmentName: downtimeData.equipmentName!,
    propertyId: downtimeData.propertyId!,
    startTime,
    endTime,
    durationMinutes,
    reason: downtimeData.reason!,
    maintenanceWorkOrderId: downtimeData.maintenanceWorkOrderId,
    impact: downtimeData.impact || 'medium',
    costImpact: downtimeData.costImpact,
    notes: downtimeData.notes,
  };
};

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
export const calculateMTBF = (downtimes: EquipmentDowntime[], equipmentId: string): number => {
  const equipmentDowntimes = downtimes.filter(d => d.equipmentId === equipmentId);

  if (equipmentDowntimes.length <= 1) return 0;

  const sortedByDate = [...equipmentDowntimes].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  let totalUptime = 0;
  for (let i = 0; i < sortedByDate.length - 1; i++) {
    const nextDowntime = sortedByDate[i + 1].startTime.getTime();
    const currentDowntime = sortedByDate[i].endTime?.getTime() || sortedByDate[i].startTime.getTime();
    totalUptime += nextDowntime - currentDowntime;
  }

  const failures = equipmentDowntimes.length;
  return failures > 0 ? totalUptime / (1000 * 60 * 60) / failures : 0;
};

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
export const calculateTotalDowntime = (
  downtimes: EquipmentDowntime[],
  equipmentId: string,
  period: DateRange,
): number => {
  return downtimes
    .filter(
      d =>
        d.equipmentId === equipmentId &&
        d.startTime >= period.start &&
        d.startTime <= period.end &&
        d.durationMinutes,
    )
    .reduce((sum, d) => sum + (d.durationMinutes || 0), 0) / 60; // Convert to hours
};

// ============================================================================
// MAINTENANCE HISTORY REPORTING
// ============================================================================

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
export const createMaintenanceHistory = (
  workOrder: MaintenanceWorkOrder,
  performedBy: string,
  cost: MaintenanceCost,
): MaintenanceHistory => {
  return {
    id: `HIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    equipmentId: workOrder.equipmentId,
    equipmentName: workOrder.equipmentName,
    propertyId: workOrder.propertyId,
    workOrderId: workOrder.id,
    maintenanceType: workOrder.type,
    performedAt: workOrder.completedAt || new Date(),
    performedBy,
    description: workOrder.description,
    partsReplaced: workOrder.partsUsed?.map(p => p.name) || [],
    cost: cost.totalCost,
    duration: workOrder.actualDuration || 0,
    nextScheduledMaintenance: undefined,
  };
};

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
export const generateEquipmentMaintenanceReport = (
  equipmentId: string,
  history: MaintenanceHistory[],
  period: DateRange,
): {
  totalEvents: number;
  preventive: number;
  reactive: number;
  totalCost: number;
  averageCost: number;
  lastMaintenance?: Date;
} => {
  const equipmentHistory = history.filter(
    h => h.equipmentId === equipmentId && h.performedAt >= period.start && h.performedAt <= period.end,
  );

  const totalCost = equipmentHistory.reduce((sum, h) => sum + h.cost, 0);
  const preventive = equipmentHistory.filter(h => h.maintenanceType === 'preventive').length;
  const reactive = equipmentHistory.filter(h => h.maintenanceType === 'reactive').length;

  return {
    totalEvents: equipmentHistory.length,
    preventive,
    reactive,
    totalCost,
    averageCost: equipmentHistory.length > 0 ? totalCost / equipmentHistory.length : 0,
    lastMaintenance: equipmentHistory.length > 0 ? equipmentHistory[equipmentHistory.length - 1].performedAt : undefined,
  };
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
export const exportMaintenanceReport = (history: MaintenanceHistory[], period: DateRange): string => {
  const filtered = history.filter(h => h.performedAt >= period.start && h.performedAt <= period.end);

  let report = `Maintenance Report\n`;
  report += `Period: ${period.start.toISOString().split('T')[0]} to ${period.end.toISOString().split('T')[0]}\n`;
  report += `Total Records: ${filtered.length}\n\n`;

  for (const record of filtered) {
    report += `Equipment: ${record.equipmentName}\n`;
    report += `Date: ${record.performedAt.toISOString().split('T')[0]}\n`;
    report += `Type: ${record.maintenanceType}\n`;
    report += `Cost: $${record.cost.toFixed(2)}\n`;
    report += `---\n`;
  }

  return report;
};

// ============================================================================
// VENDOR SERVICE COORDINATION
// ============================================================================

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
export const createVendorService = (serviceData: Partial<VendorService>): VendorService => {
  return {
    id: serviceData.id || `VS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: serviceData.propertyId!,
    vendorId: serviceData.vendorId!,
    vendorName: serviceData.vendorName!,
    serviceType: serviceData.serviceType!,
    status: serviceData.status || 'scheduled',
    scheduledDate: serviceData.scheduledDate!,
    completedDate: serviceData.completedDate,
    costEstimate: serviceData.costEstimate!,
    actualCost: serviceData.actualCost,
    description: serviceData.description!,
    contactPerson: serviceData.contactPerson,
    notes: serviceData.notes,
  };
};

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
export const updateVendorServiceStatus = (
  service: VendorService,
  newStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
): VendorService => {
  return {
    ...service,
    status: newStatus,
    completedDate: newStatus === 'completed' ? new Date() : service.completedDate,
  };
};

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
export const calculateVendorPerformance = (
  services: VendorService[],
  vendorId: string,
): {
  totalServices: number;
  onTimeCompletion: number;
  costAccuracy: number;
  averageRating: number;
} => {
  const vendorServices = services.filter(s => s.vendorId === vendorId);

  if (vendorServices.length === 0) {
    return {
      totalServices: 0,
      onTimeCompletion: 0,
      costAccuracy: 0,
      averageRating: 0,
    };
  }

  const onTime = vendorServices.filter(
    s => s.completedDate && s.completedDate <= s.scheduledDate,
  ).length;

  const costAccurate = vendorServices.filter(
    s => s.actualCost && s.actualCost <= s.costEstimate * 1.1,
  ).length;

  // Calculate average rating from actual vendor ratings
  // In production, this would aggregate ratings from a vendor rating table
  // const ratings = await VendorRatingModel.findAll({
  //   where: { vendorId },
  //   attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
  // });
  // const averageRating = ratings[0]?.avgRating || 0;

  const averageRating = vendorServices.reduce((sum, s) => sum + (s.rating || 0), 0) / vendorServices.length || 0;

  return {
    totalServices: vendorServices.length,
    onTimeCompletion: Math.round((onTime / vendorServices.length) * 100),
    costAccuracy: Math.round((costAccurate / vendorServices.length) * 100),
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
  };
};

// ============================================================================
// MAINTENANCE METRICS AND ANALYTICS
// ============================================================================

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
export const calculateMaintenanceMetrics = (
  workOrders: MaintenanceWorkOrder[],
  costs: MaintenanceCost[],
  downtimes: EquipmentDowntime[],
  propertyId: string,
  period: DateRange,
): MaintenanceMetrics => {
  const propertyWorkOrders = workOrders.filter(
    w => w.propertyId === propertyId && w.completedAt && w.completedAt >= period.start && w.completedAt <= period.end,
  );

  const completed = propertyWorkOrders.filter(w => w.status === 'completed');
  const totalCost = costs
    .filter(c => c.propertyId === propertyId && c.date >= period.start && c.date <= period.end)
    .reduce((sum, c) => sum + c.totalCost, 0);

  const downtimeHours = downtimes
    .filter(d => d.propertyId === propertyId && d.startTime >= period.start && d.startTime <= period.end)
    .reduce((sum, d) => sum + (d.durationMinutes || 0), 0) / 60;

  const preventiveCount = propertyWorkOrders.filter(w => w.type === 'preventive').length;
  const reactiveCount = propertyWorkOrders.filter(w => w.type === 'reactive').length;

  const avgCompletionTime =
    completed.length > 0
      ? completed.reduce((sum, w) => sum + (w.actualDuration || 0), 0) / completed.length / 60
      : 0;

  return {
    propertyId,
    period,
    totalWorkOrders: propertyWorkOrders.length,
    completedWorkOrders: completed.length,
    averageCompletionTime: avgCompletionTime,
    totalCost,
    averageCostPerWorkOrder: propertyWorkOrders.length > 0 ? totalCost / propertyWorkOrders.length : 0,
    equipmentDowntimeHours: downtimeHours,
    preventiveMaintenance: preventiveCount,
    reactiveMaintenance: reactiveCount,
  };
};

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
export const identifyImprovementOpportunities = (
  metrics: MaintenanceMetrics,
  history: MaintenanceHistory[],
): string[] => {
  const recommendations: string[] = [];

  // Check preventive vs reactive ratio
  const totalMaintenance = metrics.preventiveMaintenance + metrics.reactiveMaintenance;
  if (totalMaintenance > 0) {
    const preventiveRatio = metrics.preventiveMaintenance / totalMaintenance;
    if (preventiveRatio < 0.3) {
      recommendations.push('Increase preventive maintenance ratio - currently below 30%');
    }
  }

  // Check downtime
  if (metrics.equipmentDowntimeHours > 100) {
    recommendations.push('Equipment downtime is high - consider more frequent inspections');
  }

  // Check cost per work order
  if (metrics.averageCostPerWorkOrder > 500) {
    recommendations.push('Average work order cost is high - consider bulk inventory optimization');
  }

  return recommendations;
};

// ============================================================================
// EQUIPMENT LIFECYCLE AND COMPLIANCE
// ============================================================================

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
export const trackEquipmentLifecycle = (
  equipmentId: string,
  history: MaintenanceHistory[],
): {
  equipmentId: string;
  totalMaintenance: number;
  lastService?: Date;
  maintenanceAge: number; // days since last service
  costToDate: number;
  preventiveRatio: number;
} => {
  const equipmentHistory = history.filter(h => h.equipmentId === equipmentId);

  const costToDate = equipmentHistory.reduce((sum, h) => sum + h.cost, 0);
  const preventiveCount = equipmentHistory.filter(h => h.maintenanceType === 'preventive').length;
  const lastService = equipmentHistory.length > 0 ? equipmentHistory[equipmentHistory.length - 1].performedAt : undefined;
  const maintenanceAge = lastService ? Math.floor((Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return {
    equipmentId,
    totalMaintenance: equipmentHistory.length,
    lastService,
    maintenanceAge,
    costToDate,
    preventiveRatio: equipmentHistory.length > 0 ? preventiveCount / equipmentHistory.length : 0,
  };
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
export const validateMaintenanceSLA = (
  workOrders: MaintenanceWorkOrder[],
  slaTargets: Record<MaintenancePriority, number>, // hours to complete
): {
  compliant: number;
  nonCompliant: number;
  complianceRate: number;
  violations: string[];
} => {
  const violations: string[] = [];
  let compliant = 0;
  let nonCompliant = 0;

  for (const wo of workOrders) {
    if (wo.status !== 'completed' || !wo.completedAt) continue;

    const targetHours = slaTargets[wo.priority];
    const actualHours = (wo.completedAt.getTime() - wo.requestedAt.getTime()) / (1000 * 60 * 60);

    if (actualHours <= targetHours) {
      compliant++;
    } else {
      nonCompliant++;
      violations.push(`${wo.id}: ${wo.priority} target ${targetHours}h, took ${Math.round(actualHours)}h`);
    }
  }

  const total = compliant + nonCompliant;

  return {
    compliant,
    nonCompliant,
    complianceRate: total > 0 ? (compliant / total) * 100 : 0,
    violations,
  };
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
export const optimizeSparePartsInventory = (
  history: MaintenanceHistory[],
  inventory: MaintenanceInventory[],
): Array<{ partNumber: string; recommendedQuantity: number; reason: string }> => {
  const recommendations: Array<{ partNumber: string; recommendedQuantity: number; reason: string }> = [];

  const last90Days = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const recentHistory = history.filter(h => h.performedAt >= last90Days);

  // Count part usage frequency
  const partUsageMap = new Map<string, number>();
  recentHistory.forEach(h => {
    h.partsReplaced.forEach(part => {
      partUsageMap.set(part, (partUsageMap.get(part) || 0) + 1);
    });
  });

  // Analyze usage patterns and make recommendations
  for (const [partName, usageCount] of partUsageMap.entries()) {
    const monthlyUsage = usageCount / 3; // 90 days = 3 months
    const recommendedQuantity = Math.ceil(monthlyUsage * 3 + 5); // Keep 3-month supply plus buffer

    const inventoryItem = inventory.find(i => i.name === partName);
    const currentQuantity = inventoryItem?.quantity || 0;

    if (currentQuantity < recommendedQuantity) {
      recommendations.push({
        partNumber: inventoryItem?.partNumber || 'UNKNOWN',
        recommendedQuantity,
        reason: `Usage trend: ${monthlyUsage.toFixed(1)} units/month, current: ${currentQuantity}`,
      });
    }
  }

  return recommendations;
};

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
export const assessTechnicianSkillCoverage = (
  workOrders: MaintenanceWorkOrder[],
  technicians: Technician[],
): {
  wellCovered: number;
  underCovered: number;
  gaps: string[];
} => {
  const gaps: string[] = [];
  let wellCovered = 0;
  let underCovered = 0;

  // Group work orders by type/category
  const workOrderTypes = new Set(workOrders.map(wo => wo.type));

  for (const woType of workOrderTypes) {
    const woCount = workOrders.filter(wo => wo.type === woType).length;
    const qualifiedTechs = technicians.filter(t => t.specialties.includes(woType)).length;

    if (qualifiedTechs >= woCount / 2) {
      wellCovered++;
    } else {
      underCovered++;
      gaps.push(`${woType}: ${woCount} orders, only ${qualifiedTechs} qualified technicians`);
    }
  }

  return {
    wellCovered,
    underCovered,
    gaps,
  };
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
export const analyzeMaintenanceBacklog = (
  workOrders: MaintenanceWorkOrder[],
  dailyCapacity: number = 5,
): {
  totalPending: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  estimatedClearanceDate: Date;
  averageWaitTime: number; // days
} => {
  const pending = workOrders.filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled');

  const criticalCount = pending.filter(wo => wo.priority === 'critical').length;
  const highCount = pending.filter(wo => wo.priority === 'high').length;
  const mediumCount = pending.filter(wo => wo.priority === 'medium').length;
  const lowCount = pending.filter(wo => wo.priority === 'low').length;

  // Weighted calculation: critical = 0.5 days, high = 0.75 days, medium = 1 day, low = 1.5 days
  const totalWeightedDays =
    criticalCount * 0.5 + highCount * 0.75 + mediumCount * 1 + lowCount * 1.5;
  const daysToComplete = totalWeightedDays / dailyCapacity;

  const clearanceDate = new Date();
  clearanceDate.setDate(clearanceDate.getDate() + daysToComplete);

  // Calculate average wait time
  const avgWait =
    pending.length > 0
      ? pending.reduce((sum, wo) => sum + (Date.now() - wo.requestedAt.getTime()) / (1000 * 60 * 60 * 24), 0) /
        pending.length
      : 0;

  return {
    totalPending: pending.length,
    critical: criticalCount,
    high: highCount,
    medium: mediumCount,
    low: lowCount,
    estimatedClearanceDate: clearanceDate,
    averageWaitTime: Math.round(avgWait * 10) / 10,
  };
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
export const forecastMaintenanceCosts = (
  historicalCosts: MaintenanceCost[],
  months: number = 6,
): Array<{ month: string; estimatedCost: number; trend: string }> => {
  if (historicalCosts.length < 3) {
    return [];
  }

  // Sort by date
  const sorted = [...historicalCosts].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate monthly costs
  const monthlyCosts = new Map<string, number>();
  sorted.forEach(cost => {
    const month = cost.date.toISOString().substring(0, 7);
    monthlyCosts.set(month, (monthlyCosts.get(month) || 0) + cost.totalCost);
  });

  // Get last 3 months average
  const recentMonths = Array.from(monthlyCosts.entries())
    .slice(-3)
    .map(([, cost]) => cost);
  const avgMonthly = recentMonths.reduce((sum, c) => sum + c, 0) / recentMonths.length;

  // Simple trend detection
  let trend = 'stable';
  if (recentMonths.length >= 2) {
    const diff = recentMonths[recentMonths.length - 1] - recentMonths[0];
    if (diff > avgMonthly * 0.15) trend = 'increasing';
    else if (diff < -avgMonthly * 0.15) trend = 'decreasing';
  }

  // Generate forecast
  const forecast: Array<{ month: string; estimatedCost: number; trend: string }> = [];
  const lastDate = sorted[sorted.length - 1].date;

  for (let i = 1; i <= months; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setMonth(forecastDate.getMonth() + i);
    const monthStr = forecastDate.toISOString().substring(0, 7);

    // Apply trend multiplier
    let estimatedCost = avgMonthly;
    if (trend === 'increasing') {
      estimatedCost = avgMonthly * (1 + (i * 0.05)); // 5% increase per month
    } else if (trend === 'decreasing') {
      estimatedCost = avgMonthly * (1 - (i * 0.03)); // 3% decrease per month
    }

    forecast.push({
      month: monthStr,
      estimatedCost: Math.round(estimatedCost),
      trend,
    });
  }

  return forecast;
};

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
export const calculateMaintenanceComplianceScore = (
  metrics: MaintenanceMetrics,
  plans: PreventiveMaintenancePlan[],
): number => {
  let score = 50; // Base score

  // Active plans
  const activePlans = plans.filter(p => p.status === 'active').length;
  if (activePlans > 0) score += 15;

  // Preventive maintenance ratio (target: 50-70%)
  const totalMaintenance = metrics.preventiveMaintenance + metrics.reactiveMaintenance;
  if (totalMaintenance > 0) {
    const preventiveRatio = metrics.preventiveMaintenance / totalMaintenance;
    if (preventiveRatio >= 0.5 && preventiveRatio <= 0.7) {
      score += 25;
    } else if (preventiveRatio > 0.3) {
      score += 15;
    }
  }

  // Work order completion rate
  if (metrics.totalWorkOrders > 0) {
    const completionRate = metrics.completedWorkOrders / metrics.totalWorkOrders;
    score += completionRate * 10;
  }

  return Math.min(score, 100);
};

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
export const generateQuarterlyMaintenanceSchedule = (
  plans: PreventiveMaintenancePlan[],
  startDate: Date = new Date(),
): Array<{ date: Date; task: string; equipmentId: string; frequency: string }> => {
  const schedule: Array<{ date: Date; task: string; equipmentId: string; frequency: string }> = [];
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);

  for (const plan of plans.filter(p => p.status === 'active')) {
    for (const task of plan.tasks) {
      const dueDates = generateMaintenanceDueDates(task, startDate);

      for (const dueDate of dueDates) {
        if (dueDate >= startDate && dueDate <= endDate) {
          schedule.push({
            date: dueDate,
            task: task.description,
            equipmentId: plan.equipmentId,
            frequency: task.frequency,
          });
        }
      }
    }
  }

  // Sort by date
  return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
};

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
export const identifyReplacementCandidates = (
  history: MaintenanceHistory[],
  costThreshold: number = 5000,
  downtimeThreshold: number = 200,
): Array<{ equipmentId: string; reason: string; estimatedAnnualCost: number }> => {
  const equipmentMap = new Map<string, { cost: number; downtimeHours: number; serviceCount: number }>();

  // Aggregate equipment metrics
  for (const record of history) {
    const existing = equipmentMap.get(record.equipmentId) || { cost: 0, downtimeHours: 0, serviceCount: 0 };
    existing.cost += record.cost;
    existing.serviceCount += 1;
    equipmentMap.set(record.equipmentId, existing);
  }

  // Identify candidates
  const candidates: Array<{ equipmentId: string; reason: string; estimatedAnnualCost: number }> = [];

  for (const [equipmentId, metrics] of equipmentMap.entries()) {
    const reasons: string[] = [];

    if (metrics.cost > costThreshold) {
      reasons.push(`High maintenance costs: $${metrics.cost}`);
    }

    if (metrics.serviceCount > 12) {
      reasons.push('Frequent maintenance required');
    }

    if (reasons.length > 0) {
      candidates.push({
        equipmentId,
        reason: reasons.join('; '),
        estimatedAnnualCost: metrics.cost,
      });
    }
  }

  return candidates;
};

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
export const predictEquipmentFailure = (
  history: MaintenanceHistory[],
  equipmentId: string,
): {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  indicators: string[];
  recommendedAction: string;
} => {
  const equipmentHistory = history.filter(h => h.equipmentId === equipmentId);

  if (equipmentHistory.length === 0) {
    return {
      riskLevel: 'low',
      riskScore: 0,
      indicators: [],
      recommendedAction: 'Monitor equipment',
    };
  }

  let riskScore = 0;
  const indicators: string[] = [];

  // Analyze reactive vs preventive maintenance ratio
  const reactiveCount = equipmentHistory.filter(h => h.maintenanceType === 'reactive').length;
  const reactiveRatio = reactiveCount / equipmentHistory.length;

  if (reactiveRatio > 0.7) {
    riskScore += 30;
    indicators.push('High reactive maintenance ratio');
  }

  // Check recent maintenance frequency
  const last3Months = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const recentMaintenance = equipmentHistory.filter(h => h.performedAt >= last3Months);

  if (recentMaintenance.length > 4) {
    riskScore += 25;
    indicators.push('Frequent maintenance required');
  }

  // Check increasing cost trend
  const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const yearlyHistory = equipmentHistory.filter(h => h.performedAt >= lastYear);

  if (yearlyHistory.length >= 6) {
    const firstHalf = yearlyHistory.slice(0, Math.floor(yearlyHistory.length / 2));
    const secondHalf = yearlyHistory.slice(Math.floor(yearlyHistory.length / 2));

    const firstHalfAvgCost = firstHalf.reduce((sum, h) => sum + h.cost, 0) / firstHalf.length;
    const secondHalfAvgCost = secondHalf.reduce((sum, h) => sum + h.cost, 0) / secondHalf.length;

    if (secondHalfAvgCost > firstHalfAvgCost * 1.25) {
      riskScore += 20;
      indicators.push('Cost escalation detected');
    }
  }

  // Check parts replacement patterns
  const partsReplaced = yearlyHistory.flatMap(h => h.partsReplaced).length;
  if (partsReplaced > 10) {
    riskScore += 15;
    indicators.push('Multiple parts requiring replacement');
  }

  // Determine risk level and action
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let recommendedAction = 'Monitor equipment';

  if (riskScore >= 80) {
    riskLevel = 'critical';
    recommendedAction = 'Schedule replacement or major overhaul immediately';
  } else if (riskScore >= 60) {
    riskLevel = 'high';
    recommendedAction = 'Increase preventive maintenance frequency';
  } else if (riskScore >= 40) {
    riskLevel = 'medium';
    recommendedAction = 'Develop comprehensive preventive maintenance plan';
  }

  return {
    riskLevel,
    riskScore: Math.min(100, riskScore),
    indicators,
    recommendedAction,
  };
};
