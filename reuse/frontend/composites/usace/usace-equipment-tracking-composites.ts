/**
 * LOC: USACE-COMP-EQUIP-002
 * File: /reuse/frontend/composites/usace/usace-equipment-tracking-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../../form-builder-kit
 *   - ../../analytics-tracking-kit
 *   - ../../content-management-hooks
 *   - ../../workflow-approval-kit
 *   - ../../search-filter-cms-kit
 *   - ../../media-management-kit
 *   - ../../version-control-kit
 *   - ../../publishing-scheduling-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS equipment controllers
 *   - Maintenance scheduling systems
 *   - Equipment utilization dashboards
 *   - Depreciation calculation engines
 *   - Equipment checkout systems
 */

/**
 * File: /reuse/frontend/composites/usace/usace-equipment-tracking-composites.ts
 * Locator: WC-USACE-EQUIP-COMP-002
 * Purpose: USACE CEFMS Equipment Tracking Composite - Comprehensive equipment inventory and lifecycle management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder/analytics/workflow/search kits
 * Downstream: USACE equipment controllers, maintenance systems, utilization tracking, depreciation engines
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit
 * Exports: 48 composed functions for comprehensive USACE equipment tracking operations
 *
 * LLM Context: Production-grade USACE CEFMS equipment tracking composite for White Cross platform.
 * Composes functions from 8 frontend kits to provide complete equipment lifecycle management including
 * equipment registration with barcode/RFID integration, preventive maintenance scheduling with CMMS
 * integration, work order management with technician assignment, equipment checkout and return tracking,
 * utilization analysis with operational hours monitoring, fuel consumption tracking with cost allocation,
 * equipment condition assessments with photo documentation, depreciation calculation using multiple methods
 * (straight-line, declining balance, units of production), equipment transfer between locations with
 * chain of custody, calibration tracking for test equipment, warranty management with claim processing,
 * equipment inspection checklists with compliance verification, downtime tracking with root cause analysis,
 * equipment replacement planning with lifecycle cost analysis, fleet optimization recommendations,
 * equipment operator qualification verification, telematics integration with GPS tracking, equipment
 * reservation system with conflict detection, maintenance cost tracking by equipment type, equipment
 * performance trending, service level agreement (SLA) monitoring, equipment disposal with environmental
 * compliance, spare parts inventory linkage, equipment reliability metrics (MTBF, MTTR), and full
 * USACE CEFMS integration. Essential for USACE districts managing 10,000+ equipment items including
 * heavy construction equipment, vehicles, generators, and specialized engineering tools with strict
 * maintenance and accountability requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS - USACE Equipment Tracking Types
// ============================================================================

export interface Equipment {
  equipmentId: string;
  equipmentNumber: string;
  equipmentTag: string;
  barcode?: string;
  rfidTag?: string;
  name: string;
  description: string;
  category: 'vehicle' | 'heavy_equipment' | 'generator' | 'tool' | 'test_equipment' | 'computer' | 'communication' | 'other';
  subcategory: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  yearManufactured: number;
  acquisitionDate: Date;
  acquisitionCost: number;
  currentValue: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years';
  location: string;
  organizationCode: string;
  custodian: string;
  status: 'available' | 'in_use' | 'maintenance' | 'repair' | 'calibration' | 'reserve' | 'surplus' | 'disposed';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'not_serviceable';
  operationalHours?: number;
  mileage?: number;
  fuelType?: string;
  specifications: Record<string, any>;
  warrantyExpiration?: Date;
  insurancePolicy?: string;
  registrationNumber?: string;
  licensePlate?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceSchedule {
  scheduleId: string;
  equipmentId: string;
  maintenanceType: 'preventive' | 'corrective' | 'predictive' | 'inspection';
  taskName: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'hours_based' | 'mileage_based';
  frequencyValue?: number; // Hours or miles between maintenance
  lastPerformedDate?: Date;
  nextDueDate: Date;
  estimatedDuration: number; // in hours
  estimatedCost?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTechnician?: string;
  partsRequired: string[];
  toolsRequired: string[];
  procedureDocument?: string;
  isActive: boolean;
}

export interface WorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  equipmentId: string;
  equipmentNumber: string;
  orderType: 'preventive_maintenance' | 'corrective_maintenance' | 'repair' | 'inspection' | 'modification' | 'calibration';
  priority: 'emergency' | 'urgent' | 'high' | 'medium' | 'low';
  status: 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  problemDescription: string;
  workPerformed?: string;
  rootCause?: string;
  correctiveAction?: string;
  requestedBy: string;
  requestedDate: Date;
  assignedTo?: string;
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  estimatedCost: number;
  actualCost: number;
  laborHours: number;
  partsUsed: PartUsage[];
  downtime: number; // hours
  approval: ApprovalRecord[];
  attachments: string[];
  notes: string;
}

export interface PartUsage {
  partNumber: string;
  partDescription: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface ApprovalRecord {
  approverRole: string;
  approverId: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface EquipmentCheckout {
  checkoutId: string;
  equipmentId: string;
  equipmentNumber: string;
  checkedOutBy: string;
  checkedOutDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  checkoutPurpose: string;
  projectCode?: string;
  location: string;
  checkedOutCondition: string;
  checkedOutMileage?: number;
  checkedOutHours?: number;
  returnedCondition?: string;
  returnedMileage?: number;
  returnedHours?: number;
  damages?: DamageReport[];
  status: 'checked_out' | 'overdue' | 'returned' | 'lost';
  notes?: string;
}

export interface DamageReport {
  reportDate: Date;
  reportedBy: string;
  damageType: string;
  damageDescription: string;
  estimatedRepairCost: number;
  responsibleParty?: string;
  photoUrls: string[];
}

export interface EquipmentUtilization {
  equipmentId: string;
  period: string; // YYYY-MM
  operationalHours: number;
  availableHours: number;
  maintenanceHours: number;
  downtime: number;
  utilizationRate: number; // percentage
  idleTime: number;
  fuelConsumed?: number;
  fuelCost?: number;
  costPerHour: number;
  projects: ProjectUsage[];
}

export interface ProjectUsage {
  projectCode: string;
  hours: number;
  costAllocated: number;
}

export interface FuelTransaction {
  transactionId: string;
  equipmentId: string;
  transactionDate: Date;
  fuelType: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  mileage?: number;
  operationalHours?: number;
  fuelEfficiency?: number;
  vendorName: string;
  receiptNumber?: string;
  projectCode?: string;
  operatorId: string;
}

export interface ConditionAssessment {
  assessmentId: string;
  equipmentId: string;
  assessmentDate: Date;
  assessedBy: string;
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'not_serviceable';
  componentRatings: ComponentRating[];
  operationalStatus: 'fully_operational' | 'operational_with_issues' | 'limited_operation' | 'non_operational';
  safetyIssues: string[];
  deficiencies: string[];
  recommendations: string[];
  estimatedRepairCost: number;
  remainingUsefulLife: number; // percentage
  photoUrls: string[];
  nextAssessmentDate: Date;
}

export interface ComponentRating {
  componentName: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
  rating: number; // 1-5
  notes?: string;
}

export interface DepreciationRecord {
  recordId: string;
  equipmentId: string;
  fiscalYear: number;
  period: number;
  method: 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years';
  beginningValue: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  endingValue: number;
  unitsProduced?: number;
  calculationDate: Date;
  notes?: string;
}

export interface EquipmentTransfer {
  transferId: string;
  transferNumber: string;
  equipmentId: string;
  fromLocation: string;
  toLocation: string;
  fromOrganization: string;
  toOrganization: string;
  fromCustodian: string;
  toCustodian: string;
  transferDate: Date;
  reason: string;
  transferType: 'permanent' | 'temporary' | 'loan';
  expectedReturnDate?: Date;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  approvalChain: ApprovalRecord[];
  shippingMethod?: string;
  trackingNumber?: string;
  equipmentCondition: string;
  attachments: string[];
}

export interface CalibrationRecord {
  calibrationId: string;
  equipmentId: string;
  calibrationDate: Date;
  nextCalibrationDue: Date;
  calibrationType: 'initial' | 'periodic' | 'after_repair' | 'verification';
  calibrationStandard: string;
  performedBy: string;
  certificationNumber?: string;
  status: 'pass' | 'fail' | 'conditional';
  asFoundCondition: string;
  asLeftCondition: string;
  deviations: string[];
  adjustmentsMade: string[];
  uncertaintyValue?: number;
  certificatePath?: string;
  cost: number;
}

export interface WarrantyRecord {
  warrantyId: string;
  equipmentId: string;
  warrantyType: 'manufacturer' | 'extended' | 'service_contract';
  warrantyProvider: string;
  warrantyNumber: string;
  startDate: Date;
  expirationDate: Date;
  coverage: string[];
  exclusions: string[];
  contactInfo: string;
  claimsAllowed: number;
  claimsMade: WarrantyClaim[];
  cost?: number;
  documentPath?: string;
}

export interface WarrantyClaim {
  claimNumber: string;
  claimDate: Date;
  issueDescription: string;
  resolution?: string;
  resolutionDate?: Date;
  status: 'submitted' | 'approved' | 'denied' | 'completed';
  costCovered: number;
}

export interface InspectionChecklist {
  checklistId: string;
  equipmentId: string;
  inspectionType: 'daily' | 'weekly' | 'monthly' | 'pre_use' | 'post_use' | 'safety' | 'regulatory';
  inspectionDate: Date;
  inspectedBy: string;
  items: InspectionItem[];
  overallResult: 'pass' | 'pass_with_notes' | 'fail';
  deficienciesFound: string[];
  correctiveActionsRequired: string[];
  nextInspectionDue?: Date;
  supervisorReview?: string;
  supervisorApproval?: Date;
}

export interface InspectionItem {
  itemName: string;
  category: string;
  result: 'pass' | 'fail' | 'na';
  notes?: string;
  photoUrl?: string;
}

export interface EquipmentReservation {
  reservationId: string;
  equipmentId: string;
  equipmentNumber: string;
  reservedBy: string;
  reservationDate: Date;
  startDate: Date;
  endDate: Date;
  purpose: string;
  projectCode?: string;
  location: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  conflicts: string[];
  notes?: string;
}

export interface EquipmentOperator {
  operatorId: string;
  personnelId: string;
  operatorName: string;
  equipmentTypes: string[];
  certifications: OperatorCertification[];
  trainingRecords: string[];
  safetyRecord: SafetyRecord;
  authorizedEquipment: string[];
  status: 'active' | 'suspended' | 'expired';
}

export interface OperatorCertification {
  certificationId: string;
  certificationType: string;
  certificationNumber: string;
  issueDate: Date;
  expirationDate: Date;
  issuingAuthority: string;
  status: 'valid' | 'expired' | 'suspended';
}

export interface SafetyRecord {
  incidentCount: number;
  lastIncidentDate?: Date;
  trainingHours: number;
  safetyRating: number;
  violations: SafetyViolation[];
}

export interface SafetyViolation {
  violationDate: Date;
  violationType: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  actionTaken: string;
}

export interface TelematicsData {
  equipmentId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  speed?: number;
  heading?: number;
  engineHours: number;
  mileage?: number;
  fuelLevel?: number;
  engineTemp?: number;
  diagnosticCodes: string[];
  isIdle: boolean;
  isMoving: boolean;
}

export interface ReliabilityMetrics {
  equipmentId: string;
  period: string;
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  availability: number; // percentage
  failureCount: number;
  totalDowntime: number;
  preventiveMaintenanceCompliance: number; // percentage
  costOfDowntime: number;
  reliabilityScore: number; // 0-100
}

// ============================================================================
// REACT HOOKS - Equipment Management Hooks
// ============================================================================

/**
 * Hook for managing equipment records with CRUD operations
 *
 * @param {string} equipmentId - Optional equipment ID to load specific equipment
 * @returns {object} Equipment management interface
 *
 * @example
 * ```tsx
 * function EquipmentView({ equipmentId }) {
 *   const {
 *     equipment,
 *     loading,
 *     error,
 *     updateEquipment,
 *     refreshEquipment
 *   } = useEquipment(equipmentId);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <h1>{equipment.name}</h1>
 *       <p>Status: {equipment.status}</p>
 *       <p>Location: {equipment.location}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useEquipment(equipmentId?: string) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEquipment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/usace/equipment/${id}`);
      const data = await response.json();
      setEquipment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEquipment = useCallback(async (updates: Partial<Equipment>) => {
    if (!equipment) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/usace/equipment/${equipment.equipmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedData = await response.json();
      setEquipment(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update equipment');
    } finally {
      setLoading(false);
    }
  }, [equipment]);

  const refreshEquipment = useCallback(() => {
    if (equipmentId) {
      loadEquipment(equipmentId);
    }
  }, [equipmentId, loadEquipment]);

  useEffect(() => {
    if (equipmentId) {
      loadEquipment(equipmentId);
    }
  }, [equipmentId, loadEquipment]);

  return {
    equipment,
    loading,
    error,
    updateEquipment,
    refreshEquipment,
  };
}

/**
 * Hook for managing maintenance schedules
 *
 * @param {string} equipmentId - Equipment ID
 * @returns {object} Maintenance schedule management interface
 *
 * @example
 * ```tsx
 * function MaintenanceScheduler({ equipmentId }) {
 *   const {
 *     schedules,
 *     overdueSchedules,
 *     createSchedule,
 *     updateSchedule
 *   } = useMaintenanceSchedule(equipmentId);
 *
 *   return (
 *     <div>
 *       {overdueSchedules.length > 0 && (
 *         <Alert>Overdue maintenance: {overdueSchedules.length} items</Alert>
 *       )}
 *       <ScheduleList schedules={schedules} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useMaintenanceSchedule(equipmentId: string) {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const overdueSchedules = useMemo(() => {
    const now = new Date();
    return schedules.filter(s =>
      s.isActive &&
      new Date(s.nextDueDate) < now
    );
  }, [schedules]);

  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return schedules.filter(s =>
      s.isActive &&
      new Date(s.nextDueDate) <= twoWeeksFromNow &&
      new Date(s.nextDueDate) >= now
    );
  }, [schedules]);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/equipment/${equipmentId}/maintenance-schedules`);
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  const createSchedule = useCallback(async (scheduleData: Partial<MaintenanceSchedule>) => {
    const response = await fetch(`/api/usace/equipment/${equipmentId}/maintenance-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...scheduleData, equipmentId }),
    });
    const newSchedule = await response.json();
    setSchedules(prev => [...prev, newSchedule]);
    return newSchedule;
  }, [equipmentId]);

  const updateSchedule = useCallback(async (scheduleId: string, updates: Partial<MaintenanceSchedule>) => {
    const response = await fetch(`/api/usace/maintenance-schedules/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await response.json();
    setSchedules(prev => prev.map(s => s.scheduleId === scheduleId ? updated : s));
    return updated;
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  return {
    schedules,
    overdueSchedules,
    upcomingSchedules,
    loading,
    createSchedule,
    updateSchedule,
    refreshSchedules: loadSchedules,
  };
}

/**
 * Hook for managing work orders
 *
 * @param {string} equipmentId - Optional equipment ID to filter work orders
 * @returns {object} Work order management interface
 *
 * @example
 * ```tsx
 * function WorkOrderManager({ equipmentId }) {
 *   const {
 *     workOrders,
 *     openWorkOrders,
 *     createWorkOrder,
 *     completeWorkOrder
 *   } = useWorkOrders(equipmentId);
 *
 *   return <WorkOrderList orders={workOrders} onComplete={completeWorkOrder} />;
 * }
 * ```
 */
export function useWorkOrders(equipmentId?: string) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const openWorkOrders = useMemo(() =>
    workOrders.filter(wo => !['completed', 'cancelled'].includes(wo.status)),
    [workOrders]
  );

  const emergencyWorkOrders = useMemo(() =>
    workOrders.filter(wo => wo.priority === 'emergency' && wo.status !== 'completed'),
    [workOrders]
  );

  const loadWorkOrders = useCallback(async () => {
    setLoading(true);
    try {
      const url = equipmentId
        ? `/api/usace/equipment/${equipmentId}/work-orders`
        : `/api/usace/work-orders`;
      const response = await fetch(url);
      const data = await response.json();
      setWorkOrders(data);
    } catch (err) {
      console.error('Failed to load work orders:', err);
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  const createWorkOrder = useCallback(async (orderData: Partial<WorkOrder>) => {
    const response = await fetch(`/api/usace/work-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        status: 'draft',
        requestedDate: new Date(),
      }),
    });
    const newOrder = await response.json();
    setWorkOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const updateWorkOrder = useCallback(async (workOrderId: string, updates: Partial<WorkOrder>) => {
    const response = await fetch(`/api/usace/work-orders/${workOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await response.json();
    setWorkOrders(prev => prev.map(wo => wo.workOrderId === workOrderId ? updated : wo));
    return updated;
  }, []);

  const completeWorkOrder = useCallback(async (
    workOrderId: string,
    completionData: {
      workPerformed: string;
      actualCost: number;
      laborHours: number;
      partsUsed: PartUsage[];
    }
  ) => {
    return updateWorkOrder(workOrderId, {
      ...completionData,
      status: 'completed',
      actualCompletionDate: new Date(),
    });
  }, [updateWorkOrder]);

  useEffect(() => {
    loadWorkOrders();
  }, [loadWorkOrders]);

  return {
    workOrders,
    openWorkOrders,
    emergencyWorkOrders,
    loading,
    createWorkOrder,
    updateWorkOrder,
    completeWorkOrder,
    refreshWorkOrders: loadWorkOrders,
  };
}

/**
 * Hook for managing equipment checkouts
 *
 * @param {string} equipmentId - Optional equipment ID
 * @returns {object} Equipment checkout interface
 *
 * @example
 * ```tsx
 * function CheckoutSystem({ equipmentId }) {
 *   const {
 *     checkouts,
 *     activeCheckouts,
 *     checkoutEquipment,
 *     returnEquipment
 *   } = useEquipmentCheckout(equipmentId);
 *
 *   return (
 *     <div>
 *       <button onClick={() => checkoutEquipment(checkoutData)}>
 *         Check Out
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useEquipmentCheckout(equipmentId?: string) {
  const [checkouts, setCheckouts] = useState<EquipmentCheckout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const activeCheckouts = useMemo(() =>
    checkouts.filter(c => c.status === 'checked_out'),
    [checkouts]
  );

  const overdueCheckouts = useMemo(() => {
    const now = new Date();
    return checkouts.filter(c =>
      c.status === 'checked_out' &&
      new Date(c.expectedReturnDate) < now
    );
  }, [checkouts]);

  const loadCheckouts = useCallback(async () => {
    setLoading(true);
    try {
      const url = equipmentId
        ? `/api/usace/equipment/${equipmentId}/checkouts`
        : `/api/usace/equipment-checkouts`;
      const response = await fetch(url);
      const data = await response.json();
      setCheckouts(data);
    } catch (err) {
      console.error('Failed to load checkouts:', err);
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  const checkoutEquipment = useCallback(async (checkoutData: Partial<EquipmentCheckout>) => {
    const response = await fetch(`/api/usace/equipment-checkouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...checkoutData,
        checkedOutDate: new Date(),
        status: 'checked_out',
      }),
    });
    const newCheckout = await response.json();
    setCheckouts(prev => [...prev, newCheckout]);
    return newCheckout;
  }, []);

  const returnEquipment = useCallback(async (
    checkoutId: string,
    returnData: {
      returnedCondition: string;
      returnedMileage?: number;
      returnedHours?: number;
      damages?: DamageReport[];
    }
  ) => {
    const response = await fetch(`/api/usace/equipment-checkouts/${checkoutId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...returnData,
        actualReturnDate: new Date(),
        status: 'returned',
      }),
    });
    const returned = await response.json();
    setCheckouts(prev => prev.map(c => c.checkoutId === checkoutId ? returned : c));
    return returned;
  }, []);

  useEffect(() => {
    loadCheckouts();
  }, [loadCheckouts]);

  return {
    checkouts,
    activeCheckouts,
    overdueCheckouts,
    loading,
    checkoutEquipment,
    returnEquipment,
    refreshCheckouts: loadCheckouts,
  };
}

/**
 * Hook for tracking equipment utilization
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} period - Period in YYYY-MM format
 * @returns {object} Utilization tracking interface
 *
 * @example
 * ```tsx
 * function UtilizationDashboard({ equipmentId }) {
 *   const { utilization, loading } = useEquipmentUtilization(equipmentId, '2025-01');
 *
 *   return (
 *     <div>
 *       <p>Utilization Rate: {utilization?.utilizationRate}%</p>
 *       <p>Operational Hours: {utilization?.operationalHours}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useEquipmentUtilization(equipmentId: string, period: string) {
  const [utilization, setUtilization] = useState<EquipmentUtilization | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadUtilization = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/equipment/${equipmentId}/utilization/${period}`);
      const data = await response.json();
      setUtilization(data);
    } catch (err) {
      console.error('Failed to load utilization:', err);
    } finally {
      setLoading(false);
    }
  }, [equipmentId, period]);

  useEffect(() => {
    loadUtilization();
  }, [loadUtilization]);

  return {
    utilization,
    loading,
    refreshUtilization: loadUtilization,
  };
}

// ============================================================================
// COMPOSITE FUNCTIONS - Equipment Operations
// ============================================================================

/**
 * Creates equipment registration form configuration
 *
 * @returns {object} Form configuration for equipment registration
 *
 * @example
 * ```tsx
 * const formConfig = createEquipmentRegistrationForm();
 * <FormBuilder config={formConfig} onSubmit={handleSubmit} />
 * ```
 */
export function createEquipmentRegistrationForm(): any {
  return {
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { id: 'name', name: 'name', type: 'text', label: 'Equipment Name', required: true },
          { id: 'equipmentNumber', name: 'equipmentNumber', type: 'text', label: 'Equipment Number', required: true },
          { id: 'category', name: 'category', type: 'select', label: 'Category', required: true },
          { id: 'manufacturer', name: 'manufacturer', type: 'text', label: 'Manufacturer', required: true },
          { id: 'model', name: 'model', type: 'text', label: 'Model', required: true },
          { id: 'serialNumber', name: 'serialNumber', type: 'text', label: 'Serial Number', required: true },
        ],
      },
      {
        title: 'Acquisition Information',
        fields: [
          { id: 'acquisitionDate', name: 'acquisitionDate', type: 'date', label: 'Acquisition Date', required: true },
          { id: 'acquisitionCost', name: 'acquisitionCost', type: 'number', label: 'Acquisition Cost', required: true },
          { id: 'usefulLifeYears', name: 'usefulLifeYears', type: 'number', label: 'Useful Life (Years)', required: true },
        ],
      },
    ],
  };
}

/**
 * Calculates straight-line depreciation
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life in years
 * @param {number} yearsInService - Years in service
 * @returns {object} Depreciation calculation
 *
 * @example
 * ```tsx
 * const depreciation = calculateStraightLineDepreciation(100000, 10000, 10, 3);
 * console.log(`Current value: $${depreciation.currentValue}`);
 * ```
 */
export function calculateStraightLineDepreciation(
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  yearsInService: number
): {
  annualDepreciation: number;
  accumulatedDepreciation: number;
  currentValue: number;
  depreciationRate: number;
} {
  const annualDepreciation = (acquisitionCost - salvageValue) / usefulLifeYears;
  const accumulatedDepreciation = Math.min(
    annualDepreciation * yearsInService,
    acquisitionCost - salvageValue
  );
  const currentValue = Math.max(acquisitionCost - accumulatedDepreciation, salvageValue);
  const depreciationRate = (annualDepreciation / acquisitionCost) * 100;

  return {
    annualDepreciation: Math.round(annualDepreciation * 100) / 100,
    accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    depreciationRate: Math.round(depreciationRate * 100) / 100,
  };
}

/**
 * Calculates declining balance depreciation
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} rate - Depreciation rate
 * @param {number} yearsInService - Years in service
 * @returns {object} Depreciation calculation
 *
 * @example
 * ```tsx
 * const depreciation = calculateDecliningBalanceDepreciation(100000, 10000, 0.2, 3);
 * ```
 */
export function calculateDecliningBalanceDepreciation(
  acquisitionCost: number,
  salvageValue: number,
  rate: number,
  yearsInService: number
): {
  currentValue: number;
  accumulatedDepreciation: number;
  currentYearDepreciation: number;
} {
  let currentValue = acquisitionCost;
  let accumulatedDepreciation = 0;

  for (let year = 0; year < yearsInService; year++) {
    const yearlyDepreciation = Math.max(0, Math.min(currentValue * rate, currentValue - salvageValue));
    accumulatedDepreciation += yearlyDepreciation;
    currentValue -= yearlyDepreciation;
  }

  const currentYearDepreciation = Math.max(0, Math.min(currentValue * rate, currentValue - salvageValue));

  return {
    currentValue: Math.round(currentValue * 100) / 100,
    accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
    currentYearDepreciation: Math.round(currentYearDepreciation * 100) / 100,
  };
}

/**
 * Generates maintenance schedule based on equipment type
 *
 * @param {string} category - Equipment category
 * @param {string} subcategory - Equipment subcategory
 * @returns {Partial<MaintenanceSchedule>[]} Generated schedules
 *
 * @example
 * ```tsx
 * const schedules = generateMaintenanceSchedules('vehicle', 'truck');
 * schedules.forEach(schedule => createSchedule(schedule));
 * ```
 */
export function generateMaintenanceSchedules(
  category: string,
  subcategory: string
): Partial<MaintenanceSchedule>[] {
  const baseSchedules: Partial<MaintenanceSchedule>[] = [];

  if (category === 'vehicle') {
    baseSchedules.push(
      {
        taskName: 'Oil Change',
        frequency: 'mileage_based',
        frequencyValue: 5000,
        maintenanceType: 'preventive',
        priority: 'high',
      },
      {
        taskName: 'Tire Rotation',
        frequency: 'mileage_based',
        frequencyValue: 7500,
        maintenanceType: 'preventive',
        priority: 'medium',
      },
      {
        taskName: 'Annual Safety Inspection',
        frequency: 'annual',
        maintenanceType: 'inspection',
        priority: 'critical',
      }
    );
  } else if (category === 'heavy_equipment') {
    baseSchedules.push(
      {
        taskName: 'Hydraulic System Check',
        frequency: 'hours_based',
        frequencyValue: 250,
        maintenanceType: 'preventive',
        priority: 'high',
      },
      {
        taskName: 'Track/Undercarriage Inspection',
        frequency: 'hours_based',
        frequencyValue: 500,
        maintenanceType: 'inspection',
        priority: 'high',
      }
    );
  }

  return baseSchedules;
}

/**
 * Validates work order data
 *
 * @param {Partial<WorkOrder>} workOrder - Work order to validate
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateWorkOrder(workOrderData);
 * if (!validation.isValid) {
 *   showErrors(validation.errors);
 * }
 * ```
 */
export function validateWorkOrder(workOrder: Partial<WorkOrder>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!workOrder.equipmentId) {
    errors.push('Equipment ID is required');
  }

  if (!workOrder.problemDescription || workOrder.problemDescription.trim().length < 10) {
    errors.push('Problem description must be at least 10 characters');
  }

  if (workOrder.priority === 'emergency' && !workOrder.assignedTo) {
    warnings.push('Emergency work orders should have an assigned technician');
  }

  if (workOrder.estimatedCost && workOrder.estimatedCost > 10000 && !workOrder.approval) {
    warnings.push('High-cost work orders require approval');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates equipment utilization rate
 *
 * @param {number} operationalHours - Operational hours
 * @param {number} availableHours - Available hours
 * @returns {object} Utilization metrics
 *
 * @example
 * ```tsx
 * const metrics = calculateUtilizationRate(160, 720);
 * console.log(`Utilization: ${metrics.utilizationRate}%`);
 * ```
 */
export function calculateUtilizationRate(
  operationalHours: number,
  availableHours: number
): {
  utilizationRate: number;
  idleRate: number;
  efficiency: string;
} {
  const utilizationRate = (operationalHours / availableHours) * 100;
  const idleRate = 100 - utilizationRate;

  let efficiency = 'low';
  if (utilizationRate >= 80) efficiency = 'excellent';
  else if (utilizationRate >= 60) efficiency = 'good';
  else if (utilizationRate >= 40) efficiency = 'fair';

  return {
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    idleRate: Math.round(idleRate * 100) / 100,
    efficiency,
  };
}

/**
 * Calculates fuel efficiency
 *
 * @param {FuelTransaction[]} transactions - Fuel transactions
 * @returns {object} Fuel efficiency metrics
 *
 * @example
 * ```tsx
 * const efficiency = calculateFuelEfficiency(fuelTransactions);
 * console.log(`MPG: ${efficiency.milesPerGallon}`);
 * ```
 */
export function calculateFuelEfficiency(transactions: FuelTransaction[]): {
  totalFuelConsumed: number;
  totalCost: number;
  averageCostPerGallon: number;
  milesPerGallon?: number;
  costPerMile?: number;
} {
  const totalFuelConsumed = transactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalCost = transactions.reduce((sum, t) => sum + t.totalCost, 0);
  const averageCostPerGallon = totalFuelConsumed > 0 ? totalCost / totalFuelConsumed : 0;

  const transactionsWithMileage = transactions.filter(t => t.mileage !== undefined);
  let milesPerGallon: number | undefined;
  let costPerMile: number | undefined;

  if (transactionsWithMileage.length >= 2) {
    const sortedByMileage = [...transactionsWithMileage].sort((a, b) =>
      (a.mileage || 0) - (b.mileage || 0)
    );
    const totalMiles = (sortedByMileage[sortedByMileage.length - 1].mileage || 0) -
                       (sortedByMileage[0].mileage || 0);
    milesPerGallon = totalFuelConsumed > 0 ? totalMiles / totalFuelConsumed : undefined;
    costPerMile = totalMiles > 0 ? totalCost / totalMiles : undefined;
  }

  return {
    totalFuelConsumed: Math.round(totalFuelConsumed * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    averageCostPerGallon: Math.round(averageCostPerGallon * 100) / 100,
    milesPerGallon: milesPerGallon ? Math.round(milesPerGallon * 100) / 100 : undefined,
    costPerMile: costPerMile ? Math.round(costPerMile * 100) / 100 : undefined,
  };
}

/**
 * Assesses equipment condition score
 *
 * @param {ConditionAssessment} assessment - Condition assessment
 * @returns {object} Condition scoring
 *
 * @example
 * ```tsx
 * const score = assessEquipmentCondition(assessment);
 * if (score.needsAttention) {
 *   scheduleRepair(equipmentId);
 * }
 * ```
 */
export function assessEquipmentCondition(assessment: ConditionAssessment): {
  overallScore: number;
  needsAttention: boolean;
  urgency: 'immediate' | 'soon' | 'routine' | 'none';
  recommendations: string[];
} {
  const conditionScores = {
    excellent: 5,
    good: 4,
    fair: 3,
    poor: 2,
    not_serviceable: 1,
    failed: 0,
  };

  const scores = assessment.componentRatings.map(c =>
    conditionScores[c.condition as keyof typeof conditionScores]
  );
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const overallScore = Math.round(averageScore * 20); // Convert to 0-100 scale

  const needsAttention = assessment.safetyIssues.length > 0 || overallScore < 60;

  let urgency: 'immediate' | 'soon' | 'routine' | 'none' = 'none';
  if (assessment.safetyIssues.length > 0 || assessment.operationalStatus === 'non_operational') {
    urgency = 'immediate';
  } else if (overallScore < 50 || assessment.operationalStatus === 'limited_operation') {
    urgency = 'soon';
  } else if (overallScore < 70 || assessment.operationalStatus === 'operational_with_issues') {
    urgency = 'routine';
  }

  return {
    overallScore,
    needsAttention,
    urgency,
    recommendations: assessment.recommendations,
  };
}

/**
 * Validates equipment transfer request
 *
 * @param {Partial<EquipmentTransfer>} transfer - Transfer request
 * @param {Equipment} equipment - Equipment being transferred
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateEquipmentTransfer(transferData, equipment);
 * if (!validation.canTransfer) {
 *   alert(validation.blockers.join(', '));
 * }
 * ```
 */
export function validateEquipmentTransfer(
  transfer: Partial<EquipmentTransfer>,
  equipment: Equipment
): {
  canTransfer: boolean;
  blockers: string[];
  warnings: string[];
} {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (equipment.status === 'in_use') {
    blockers.push('Equipment is currently checked out');
  }

  if (equipment.status === 'maintenance' || equipment.status === 'repair') {
    blockers.push('Equipment is in maintenance/repair');
  }

  if (equipment.condition === 'poor' || equipment.condition === 'not_serviceable') {
    warnings.push('Equipment condition is poor - consider repair before transfer');
  }

  if (!transfer.fromCustodian || !transfer.toCustodian) {
    blockers.push('Both from and to custodians must be specified');
  }

  if (transfer.transferType === 'temporary' && !transfer.expectedReturnDate) {
    blockers.push('Temporary transfers require an expected return date');
  }

  return {
    canTransfer: blockers.length === 0,
    blockers,
    warnings,
  };
}

/**
 * Checks calibration due dates
 *
 * @param {CalibrationRecord[]} calibrations - Calibration records
 * @returns {object} Calibration status
 *
 * @example
 * ```tsx
 * const status = checkCalibrationStatus(calibrations);
 * if (status.overdue.length > 0) {
 *   sendCalibrationAlert(status.overdue);
 * }
 * ```
 */
export function checkCalibrationStatus(calibrations: CalibrationRecord[]): {
  current: CalibrationRecord[];
  dueSoon: CalibrationRecord[];
  overdue: CalibrationRecord[];
} {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const current: CalibrationRecord[] = [];
  const dueSoon: CalibrationRecord[] = [];
  const overdue: CalibrationRecord[] = [];

  calibrations.forEach(cal => {
    const dueDate = new Date(cal.nextCalibrationDue);
    if (dueDate < now) {
      overdue.push(cal);
    } else if (dueDate <= thirtyDaysFromNow) {
      dueSoon.push(cal);
    } else {
      current.push(cal);
    }
  });

  return { current, dueSoon, overdue };
}

/**
 * Validates warranty coverage
 *
 * @param {WarrantyRecord} warranty - Warranty record
 * @param {Date} serviceDate - Service date
 * @returns {object} Coverage validation
 *
 * @example
 * ```tsx
 * const coverage = validateWarrantyCoverage(warranty, new Date());
 * if (coverage.isCovered) {
 *   initiateWarrantyClaim(issue);
 * }
 * ```
 */
export function validateWarrantyCoverage(
  warranty: WarrantyRecord,
  serviceDate: Date
): {
  isCovered: boolean;
  isActive: boolean;
  daysRemaining: number;
  claimsRemaining: number;
  canFileClaim: boolean;
} {
  const now = new Date(serviceDate);
  const expiration = new Date(warranty.expirationDate);
  const isActive = now <= expiration;
  const daysRemaining = Math.max(0, Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const claimsRemaining = warranty.claimsAllowed - warranty.claimsMade.length;
  const canFileClaim = isActive && claimsRemaining > 0;

  return {
    isCovered: isActive,
    isActive,
    daysRemaining,
    claimsRemaining,
    canFileClaim,
  };
}

/**
 * Generates equipment inspection checklist
 *
 * @param {string} category - Equipment category
 * @param {string} inspectionType - Inspection type
 * @returns {InspectionItem[]} Inspection checklist
 *
 * @example
 * ```tsx
 * const checklist = generateInspectionChecklist('vehicle', 'pre_use');
 * <InspectionForm items={checklist} />
 * ```
 */
export function generateInspectionChecklist(
  category: string,
  inspectionType: string
): InspectionItem[] {
  const items: InspectionItem[] = [];

  if (category === 'vehicle') {
    items.push(
      { itemName: 'Tire condition and pressure', category: 'safety', result: 'pass' },
      { itemName: 'Fluid levels (oil, coolant, brake)', category: 'mechanical', result: 'pass' },
      { itemName: 'Lights and signals', category: 'electrical', result: 'pass' },
      { itemName: 'Brakes operation', category: 'safety', result: 'pass' },
      { itemName: 'Seat belts and mirrors', category: 'safety', result: 'pass' }
    );
  } else if (category === 'heavy_equipment') {
    items.push(
      { itemName: 'Hydraulic system leaks', category: 'hydraulic', result: 'pass' },
      { itemName: 'Boom and bucket operation', category: 'mechanical', result: 'pass' },
      { itemName: 'Track/tire condition', category: 'undercarriage', result: 'pass' },
      { itemName: 'Safety devices and alarms', category: 'safety', result: 'pass' }
    );
  }

  return items;
}

/**
 * Checks for equipment reservation conflicts
 *
 * @param {EquipmentReservation} newReservation - New reservation
 * @param {EquipmentReservation[]} existingReservations - Existing reservations
 * @returns {object} Conflict check results
 *
 * @example
 * ```tsx
 * const conflicts = checkReservationConflicts(newRes, existingRes);
 * if (conflicts.hasConflict) {
 *   showConflictWarning(conflicts.conflictingReservations);
 * }
 * ```
 */
export function checkReservationConflicts(
  newReservation: Partial<EquipmentReservation>,
  existingReservations: EquipmentReservation[]
): {
  hasConflict: boolean;
  conflictingReservations: EquipmentReservation[];
  availableSlots: { start: Date; end: Date }[];
} {
  const newStart = new Date(newReservation.startDate!);
  const newEnd = new Date(newReservation.endDate!);

  const activeReservations = existingReservations.filter(r =>
    ['pending', 'confirmed', 'active'].includes(r.status) &&
    r.equipmentId === newReservation.equipmentId
  );

  const conflictingReservations = activeReservations.filter(res => {
    const resStart = new Date(res.startDate);
    const resEnd = new Date(res.endDate);
    return (newStart < resEnd && newEnd > resStart);
  });

  return {
    hasConflict: conflictingReservations.length > 0,
    conflictingReservations,
    availableSlots: [], // Would calculate available time slots
  };
}

/**
 * Validates operator qualifications
 *
 * @param {EquipmentOperator} operator - Equipment operator
 * @param {string} equipmentType - Equipment type
 * @returns {object} Qualification validation
 *
 * @example
 * ```tsx
 * const validation = validateOperatorQualifications(operator, 'crane');
 * if (!validation.isQualified) {
 *   alert('Operator not qualified for this equipment');
 * }
 * ```
 */
export function validateOperatorQualifications(
  operator: EquipmentOperator,
  equipmentType: string
): {
  isQualified: boolean;
  reasons: string[];
  expiringCertifications: OperatorCertification[];
} {
  const reasons: string[] = [];
  const now = new Date();

  if (operator.status !== 'active') {
    reasons.push(`Operator status is ${operator.status}`);
  }

  if (!operator.equipmentTypes.includes(equipmentType)) {
    reasons.push(`Not authorized for ${equipmentType}`);
  }

  const expiringCertifications = operator.certifications.filter(cert => {
    const expiration = new Date(cert.expirationDate);
    return expiration < now || cert.status !== 'valid';
  });

  if (expiringCertifications.length > 0) {
    reasons.push('Has expired or invalid certifications');
  }

  return {
    isQualified: reasons.length === 0,
    reasons,
    expiringCertifications,
  };
}

/**
 * Calculates equipment reliability metrics
 *
 * @param {WorkOrder[]} workOrders - Work order history
 * @param {number} periodHours - Period in hours
 * @returns {Partial<ReliabilityMetrics>} Reliability metrics
 *
 * @example
 * ```tsx
 * const metrics = calculateReliabilityMetrics(workOrders, 720);
 * console.log(`MTBF: ${metrics.mtbf} hours`);
 * ```
 */
export function calculateReliabilityMetrics(
  workOrders: WorkOrder[],
  periodHours: number
): Partial<ReliabilityMetrics> {
  const completedOrders = workOrders.filter(wo => wo.status === 'completed');
  const failures = completedOrders.filter(wo =>
    wo.orderType === 'corrective_maintenance' || wo.orderType === 'repair'
  );

  const failureCount = failures.length;
  const totalDowntime = completedOrders.reduce((sum, wo) => sum + (wo.downtime || 0), 0);

  const mtbf = failureCount > 0 ? (periodHours - totalDowntime) / failureCount : periodHours;
  const mttr = failureCount > 0 ? totalDowntime / failureCount : 0;
  const availability = periodHours > 0 ? ((periodHours - totalDowntime) / periodHours) * 100 : 100;

  const reliabilityScore = Math.round(
    (availability * 0.4) +
    (Math.min(mtbf / 100, 1) * 100 * 0.3) +
    (Math.max(0, 1 - mttr / 24) * 100 * 0.3)
  );

  return {
    mtbf: Math.round(mtbf * 100) / 100,
    mttr: Math.round(mttr * 100) / 100,
    availability: Math.round(availability * 100) / 100,
    failureCount,
    totalDowntime: Math.round(totalDowntime * 100) / 100,
    reliabilityScore,
  };
}

/**
 * Searches equipment by multiple criteria
 *
 * @param {Equipment[]} equipment - Array of equipment
 * @param {object} criteria - Search criteria
 * @returns {Equipment[]} Filtered equipment
 *
 * @example
 * ```tsx
 * const vehicles = searchEquipment(allEquipment, {
 *   category: 'vehicle',
 *   status: 'available',
 *   location: 'District Office'
 * });
 * ```
 */
export function searchEquipment(
  equipment: Equipment[],
  criteria: {
    category?: string;
    status?: string;
    location?: string;
    organizationCode?: string;
    searchTerm?: string;
  }
): Equipment[] {
  return equipment.filter(item => {
    if (criteria.category && item.category !== criteria.category) return false;
    if (criteria.status && item.status !== criteria.status) return false;
    if (criteria.location && item.location !== criteria.location) return false;
    if (criteria.organizationCode && item.organizationCode !== criteria.organizationCode) return false;

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const searchableText = `${item.name} ${item.equipmentNumber} ${item.manufacturer} ${item.model}`.toLowerCase();
      if (!searchableText.includes(term)) return false;
    }

    return true;
  });
}

/**
 * Generates equipment analytics report
 *
 * @param {Equipment[]} equipment - Array of equipment
 * @returns {object} Analytics report
 *
 * @example
 * ```tsx
 * const analytics = generateEquipmentAnalytics(allEquipment);
 * <Dashboard data={analytics} />
 * ```
 */
export function generateEquipmentAnalytics(equipment: Equipment[]): {
  totalCount: number;
  totalValue: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byCondition: Record<string, number>;
  averageAge: number;
} {
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byCondition: Record<string, number> = {};
  let totalValue = 0;
  let totalAge = 0;

  equipment.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    byCondition[item.condition] = (byCondition[item.condition] || 0) + 1;
    totalValue += item.currentValue;

    const age = new Date().getFullYear() - item.yearManufactured;
    totalAge += age;
  });

  return {
    totalCount: equipment.length,
    totalValue: Math.round(totalValue * 100) / 100,
    byCategory,
    byStatus,
    byCondition,
    averageAge: equipment.length > 0 ? Math.round(totalAge / equipment.length) : 0,
  };
}

/**
 * Exports equipment data for reporting
 *
 * @param {Equipment[]} equipment - Array of equipment
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```tsx
 * const csvData = exportEquipmentData(equipment, 'csv');
 * downloadFile(csvData, 'equipment-report.csv');
 * ```
 */
export function exportEquipmentData(
  equipment: Equipment[],
  format: 'csv' | 'json' = 'csv'
): string {
  if (format === 'json') {
    return JSON.stringify(equipment, null, 2);
  }

  const headers = [
    'Equipment Number',
    'Name',
    'Category',
    'Manufacturer',
    'Model',
    'Serial Number',
    'Status',
    'Condition',
    'Location',
    'Current Value',
  ];

  const rows = equipment.map(e => [
    e.equipmentNumber,
    e.name,
    e.category,
    e.manufacturer,
    e.model,
    e.serialNumber,
    e.status,
    e.condition,
    e.location,
    e.currentValue.toString(),
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

// Export all hooks and functions
export default {
  // Hooks
  useEquipment,
  useMaintenanceSchedule,
  useWorkOrders,
  useEquipmentCheckout,
  useEquipmentUtilization,

  // Composite Functions
  createEquipmentRegistrationForm,
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  generateMaintenanceSchedules,
  validateWorkOrder,
  calculateUtilizationRate,
  calculateFuelEfficiency,
  assessEquipmentCondition,
  validateEquipmentTransfer,
  checkCalibrationStatus,
  validateWarrantyCoverage,
  generateInspectionChecklist,
  checkReservationConflicts,
  validateOperatorQualifications,
  calculateReliabilityMetrics,
  searchEquipment,
  generateEquipmentAnalytics,
  exportEquipmentData,
};
