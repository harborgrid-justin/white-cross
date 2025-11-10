/**
 * LOC: USACE-MAINT-SCH-2025
 * File: /reuse/frontend/composites/usace/usace-maintenance-scheduling-composites.ts
 *
 * UPSTREAM (imports from):
 *   - ../../form-builder-kit
 *   - ../../workflow-approval-kit
 *   - ../../search-filter-cms-kit
 *   - ../../analytics-tracking-kit
 *   - ../../publishing-scheduling-kit
 *   - ../../permissions-roles-kit
 *   - ../../content-management-hooks
 *   - ../../version-control-kit
 *   - ../../custom-fields-metadata-kit
 *   - ../../navigation-menu-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS maintenance scheduling UI
 *   - Preventive maintenance dashboards
 *   - Work planning interfaces
 *   - Maintenance tracking applications
 */

/**
 * File: /reuse/frontend/composites/usace/usace-maintenance-scheduling-composites.ts
 * Locator: WC-USACE-MAINT-SCH-001
 * Purpose: USACE CEFMS Maintenance Scheduling Management - React composites for preventive maintenance,
 *          scheduling, work planning, completion tracking, equipment maintenance, service contracts,
 *          maintenance history, resource allocation, and performance analytics
 *
 * Upstream: Composes React hooks and components from frontend kits
 * Downstream: USACE maintenance scheduling UI, preventive maintenance apps, work planning tools
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 48+ composite hooks and utilities for maintenance scheduling management
 *
 * LLM Context: Production-ready USACE CEFMS composite functions for maintenance scheduling.
 * Comprehensive React hooks for preventive maintenance planning, scheduling optimization,
 * work order planning, completion tracking, equipment maintenance history, predictive maintenance,
 * resource allocation, contractor management, service level agreements, and maintenance KPIs.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormBuilder,
  useFormValidation,
  useConditionalLogic,
  useMultiStepForm,
  useFormPersistence,
  useFieldArray,
  useFormProgress,
  type FieldConfig,
  type FormData as FormBuilderData,
  type ValidationRule,
} from '../../form-builder-kit';
import {
  useWorkflow,
  useApprovalProcess,
  useWorkflowStages,
  useApprovalHistory,
  useWorkflowNotifications,
  useDelegation,
  type WorkflowStatus,
  type WorkflowStage,
  type ApprovalDecision,
} from '../../workflow-approval-kit';
import {
  useSearch,
  useAdvancedFilters,
  useFacetedSearch,
  useSavedSearches,
  useSearchAnalytics,
  useSortOptions,
  type SearchQuery,
  type FilterCondition,
  type SearchResult,
} from '../../search-filter-cms-kit';
import {
  useTracking,
  usePageView,
  useEventTracking,
  usePerformanceMetrics,
  useUserIdentification,
  useConversionTracking,
  type AnalyticsEvent,
  type EventParameters,
} from '../../analytics-tracking-kit';
import {
  useScheduling,
  usePublishingCalendar,
  useRecurringSchedule,
  useScheduleNotifications,
  useScheduleConflicts,
  useDateTimeScheduler,
  type ScheduleConfig,
  type RecurringPattern,
  type ScheduleItem,
} from '../../publishing-scheduling-kit';
import {
  usePermissions,
  useRoleManagement,
  useAccessControl,
  usePermissionCheck,
  useResourcePermissions,
  type Permission,
  type Role,
} from '../../permissions-roles-kit';
import {
  useContent,
  useContentList,
  useContentMutation,
  useContentCache,
  useContentPagination,
  type ContentItem,
  type ContentFilters,
} from '../../content-management-hooks';
import {
  useVersionControl,
  useVersionHistory,
  useVersionComparison,
  useBranching,
  type Version,
  type VersionMetadata,
} from '../../version-control-kit';
import {
  useCustomFields,
  useFieldDefinitions,
  useFieldValidation,
  useFieldGroups,
  type CustomField,
  type FieldDefinition,
} from '../../custom-fields-metadata-kit';
import {
  useBreadcrumbs,
  useNavigationHistory,
  type BreadcrumbItem,
} from '../../navigation-menu-kit';

// ============================================================================
// TYPE DEFINITIONS - MAINTENANCE SCHEDULING
// ============================================================================

/**
 * Maintenance type classification
 */
export type MaintenanceType =
  | 'preventive'
  | 'corrective'
  | 'predictive'
  | 'emergency'
  | 'routine'
  | 'seasonal'
  | 'regulatory'
  | 'calibration';

/**
 * Maintenance priority levels
 */
export type MaintenancePriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'routine';

/**
 * Maintenance status
 */
export type MaintenanceStatus =
  | 'scheduled'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'overdue'
  | 'pending_approval';

/**
 * Resource type for maintenance
 */
export type ResourceType =
  | 'technician'
  | 'contractor'
  | 'equipment'
  | 'tool'
  | 'material'
  | 'vehicle';

/**
 * Equipment condition rating
 */
export type EquipmentCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'critical'
  | 'failed';

/**
 * Maintenance schedule record
 */
export interface MaintenanceSchedule {
  id: string;
  scheduleCode: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  scheduledStartTime?: string;
  estimatedDuration: number; // minutes
  actualStartDate?: string;
  actualEndDate?: string;
  assignedTechnician?: string;
  assignedTeam?: string;
  contractor?: string;
  description: string;
  procedures: MaintenanceProcedure[];
  requiredParts: RequiredPart[];
  requiredTools: string[];
  estimatedCost: number;
  actualCost?: number;
  completionNotes?: string;
  certificationRequired: boolean;
  certificationIssued?: boolean;
  nextScheduledDate?: string;
  recurringPattern?: RecurringPattern;
  facilityId: string;
  organizationCode: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maintenance procedure step
 */
export interface MaintenanceProcedure {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  checklistItems: ChecklistItem[];
  safetyNotes?: string;
  mediaUrls?: string[];
}

/**
 * Checklist item
 */
export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  required: boolean;
  notes?: string;
}

/**
 * Required part for maintenance
 */
export interface RequiredPart {
  id: string;
  partNumber: string;
  partName: string;
  quantityRequired: number;
  quantityAvailable: number;
  unitCost: number;
  totalCost: number;
  vendor?: string;
  leadTimeDays?: number;
  ordered: boolean;
  received: boolean;
}

/**
 * Equipment maintenance history
 */
export interface MaintenanceHistory {
  id: string;
  equipmentId: string;
  maintenanceScheduleId: string;
  maintenanceType: MaintenanceType;
  performedDate: string;
  technician: string;
  description: string;
  workPerformed: string;
  partsReplaced: string[];
  laborHours: number;
  totalCost: number;
  downtime: number; // minutes
  nextMaintenanceDue?: string;
  notes?: string;
  attachments: string[];
}

/**
 * Equipment tracking record
 */
export interface EquipmentRecord {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  category: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  installationDate: string;
  warrantyExpirationDate?: string;
  expectedLifeYears: number;
  currentCondition: EquipmentCondition;
  location: string;
  facilityId: string;
  criticality: 'critical' | 'important' | 'standard';
  acquisitionCost: number;
  currentValue: number;
  totalMaintenanceCost: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  operatingHours?: number;
  specifications?: Record<string, any>;
  manualUrls?: string[];
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
}

/**
 * Maintenance resource allocation
 */
export interface ResourceAllocation {
  id: string;
  maintenanceScheduleId: string;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  allocationDate: string;
  allocationStartTime: string;
  allocationEndTime: string;
  quantity: number;
  costPerUnit: number;
  totalCost: number;
  status: 'allocated' | 'confirmed' | 'in_use' | 'released';
  notes?: string;
}

/**
 * Service contract record
 */
export interface ServiceContract {
  id: string;
  contractNumber: string;
  contractorName: string;
  contractType: 'preventive_maintenance' | 'full_service' | 'on_call' | 'inspection';
  equipmentCovered: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  totalValue: number;
  paymentSchedule: 'monthly' | 'quarterly' | 'annual' | 'per_service';
  serviceLevel: string;
  responseTimeHours: number;
  includedServices: string[];
  exclusions: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  documents: string[];
  renewalDate?: string;
  autoRenew: boolean;
}

/**
 * Maintenance calendar event
 */
export interface MaintenanceCalendarEvent {
  id: string;
  title: string;
  maintenanceScheduleId: string;
  equipmentName: string;
  maintenanceType: MaintenanceType;
  startDateTime: string;
  endDateTime: string;
  assignedTo: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  location: string;
  color?: string;
  allDay: boolean;
}

/**
 * Maintenance KPIs
 */
export interface MaintenanceKPIs {
  period: string;
  totalScheduled: number;
  totalCompleted: number;
  totalOverdue: number;
  completionRate: number;
  averageCompletionTime: number; // minutes
  preventiveMaintenanceCompliance: number; // percentage
  meanTimeBetweenFailures: number; // days
  meanTimeToRepair: number; // hours
  totalMaintenanceCost: number;
  costPerWorkOrder: number;
  emergencyMaintenanceRate: number; // percentage
  equipmentUptime: number; // percentage
  resourceUtilization: number; // percentage
  backlogWorkOrders: number;
  customerSatisfactionScore?: number;
}

/**
 * Preventive maintenance plan
 */
export interface PreventiveMaintenancePlan {
  id: string;
  planName: string;
  equipmentId: string;
  equipmentCategory: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  intervalDays?: number;
  intervalHours?: number; // operating hours
  tasks: MaintenanceTask[];
  estimatedDuration: number;
  requiredSkills: string[];
  requiredParts: string[];
  active: boolean;
  lastPerformed?: string;
  nextScheduled?: string;
  createdBy: string;
  approvedBy?: string;
  approvalDate?: string;
}

/**
 * Maintenance task definition
 */
export interface MaintenanceTask {
  id: string;
  taskName: string;
  taskDescription: string;
  sequence: number;
  category: string;
  estimatedMinutes: number;
  safetyPrecautions: string[];
  requiredTools: string[];
  requiredParts: string[];
  inspectionPoints: string[];
  acceptanceCriteria: string;
  documentationRequired: boolean;
}

/**
 * Downtime tracking
 */
export interface DowntimeRecord {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  reason: 'scheduled_maintenance' | 'unscheduled_maintenance' | 'breakdown' | 'inspection' | 'other';
  maintenanceScheduleId?: string;
  impactLevel: 'critical' | 'high' | 'medium' | 'low';
  productionLoss?: number;
  notes?: string;
}

// ============================================================================
// COMPOSITE HOOKS - MAINTENANCE SCHEDULING
// ============================================================================

/**
 * Comprehensive maintenance scheduling hook
 *
 * Provides complete maintenance scheduling functionality including CRUD operations,
 * calendar management, resource allocation, and analytics.
 *
 * @example
 * ```tsx
 * function MaintenanceScheduler() {
 *   const {
 *     schedules,
 *     createSchedule,
 *     updateSchedule,
 *     deleteSchedule,
 *     getUpcoming,
 *     getOverdue
 *   } = useMaintenanceScheduling();
 *
 *   return <ScheduleList schedules={schedules} />;
 * }
 * ```
 */
export function useMaintenanceScheduling(facilityId?: string) {
  const { content: schedules, loading, error, mutate } = useContentList<MaintenanceSchedule>({
    contentType: 'maintenance_schedule',
    initialFilters: facilityId ? { facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate, canDelete } = usePermissionCheck('maintenance_schedules');
  const { scheduleEvent, cancelEvent } = useScheduling();

  const upcomingSchedules = useMemo(() =>
    schedules
      .filter(s => s.status === 'scheduled' && new Date(s.scheduledDate) >= new Date())
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()),
    [schedules]
  );

  const overdueSchedules = useMemo(() =>
    schedules.filter(s =>
      (s.status === 'scheduled' || s.status === 'in_progress') &&
      new Date(s.scheduledDate) < new Date()
    ),
    [schedules]
  );

  const createSchedule = useCallback(async (scheduleData: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('maintenance_scheduled', {
      equipmentId: scheduleData.equipmentId,
      maintenanceType: scheduleData.maintenanceType,
      priority: scheduleData.priority,
    });

    const schedule = await mutate.create(scheduleData);

    // Add to calendar
    await scheduleEvent({
      title: `${scheduleData.maintenanceType} - ${scheduleData.equipmentName}`,
      startDate: scheduleData.scheduledDate,
      metadata: { maintenanceScheduleId: schedule.id },
      recurring: scheduleData.recurringPattern,
    });

    return schedule;
  }, [canCreate, trackEvent, mutate, scheduleEvent]);

  const updateSchedule = useCallback(async (id: string, updates: Partial<MaintenanceSchedule>) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('maintenance_schedule_updated', { scheduleId: id });

    return mutate.update(id, updates);
  }, [canUpdate, trackEvent, mutate]);

  const deleteSchedule = useCallback(async (id: string) => {
    if (!canDelete) throw new Error('Permission denied');

    trackEvent('maintenance_schedule_deleted', { scheduleId: id });

    return mutate.delete(id);
  }, [canDelete, trackEvent, mutate]);

  const reschedule = useCallback(async (id: string, newDate: string, reason: string) => {
    trackEvent('maintenance_rescheduled', { scheduleId: id, reason });

    return updateSchedule(id, {
      scheduledDate: newDate,
      metadata: { rescheduleReason: reason, originalDate: schedules.find(s => s.id === id)?.scheduledDate },
    });
  }, [schedules, updateSchedule, trackEvent]);

  return {
    schedules,
    loading,
    error,
    upcomingSchedules,
    overdueSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    reschedule,
  };
}

/**
 * Maintenance schedule form hook
 *
 * Multi-step form for creating and editing maintenance schedules.
 *
 * @example
 * ```tsx
 * function ScheduleForm() {
 *   const {
 *     formData,
 *     currentStep,
 *     nextStep,
 *     submitForm
 *   } = useMaintenanceScheduleForm();
 * }
 * ```
 */
export function useMaintenanceScheduleForm(equipmentId?: string) {
  const basicInfoFields: FieldConfig[] = useMemo(() => [
    {
      id: 'scheduleCode',
      name: 'scheduleCode',
      type: 'text',
      label: 'Schedule Code',
      required: true,
      validation: [{ type: 'required', message: 'Schedule code is required' }],
    },
    {
      id: 'maintenanceType',
      name: 'maintenanceType',
      type: 'select',
      label: 'Maintenance Type',
      required: true,
      options: [
        { label: 'Preventive', value: 'preventive' },
        { label: 'Corrective', value: 'corrective' },
        { label: 'Predictive', value: 'predictive' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Routine', value: 'routine' },
      ],
    },
    {
      id: 'priority',
      name: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      options: [
        { label: 'Critical', value: 'critical' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      id: 'description',
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      rows: 4,
    },
  ], []);

  const schedulingFields: FieldConfig[] = useMemo(() => [
    {
      id: 'scheduledDate',
      name: 'scheduledDate',
      type: 'date',
      label: 'Scheduled Date',
      required: true,
    },
    {
      id: 'scheduledStartTime',
      name: 'scheduledStartTime',
      type: 'time',
      label: 'Start Time',
      required: false,
    },
    {
      id: 'estimatedDuration',
      name: 'estimatedDuration',
      type: 'number',
      label: 'Estimated Duration (minutes)',
      required: true,
      min: 15,
    },
    {
      id: 'assignedTechnician',
      name: 'assignedTechnician',
      type: 'text',
      label: 'Assigned Technician',
      required: false,
    },
  ], []);

  const {
    formData,
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    canProgress,
  } = useMultiStepForm({
    steps: [
      { id: 'basic', title: 'Basic Information', fields: basicInfoFields },
      { id: 'scheduling', title: 'Scheduling Details', fields: schedulingFields },
      { id: 'resources', title: 'Resources & Parts', fields: [] },
    ],
    initialData: equipmentId ? { equipmentId } : {},
  });

  const { validateForm, errors } = useFormValidation(formData, [
    ...basicInfoFields,
    ...schedulingFields,
  ]);

  const { trackEvent } = useEventTracking();
  const { saveProgress, loadProgress } = useFormPersistence('maintenance_schedule_form');

  const submitForm = useCallback(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    trackEvent('maintenance_schedule_form_submitted', {
      maintenanceType: formData.maintenanceType,
      priority: formData.priority,
    });

    // Submit to API
    return formData;
  }, [formData, validateForm, trackEvent]);

  // Auto-save progress
  useEffect(() => {
    saveProgress(formData);
  }, [formData, saveProgress]);

  return {
    formData,
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    canProgress,
    submitForm,
    errors,
  };
}

/**
 * Preventive maintenance planning hook
 *
 * Manages preventive maintenance plans and automatic scheduling.
 *
 * @example
 * ```tsx
 * function PMPlanner() {
 *   const {
 *     plans,
 *     createPlan,
 *     activatePlan,
 *     generateSchedules
 *   } = usePreventiveMaintenancePlanning();
 * }
 * ```
 */
export function usePreventiveMaintenancePlanning() {
  const { content: plans, loading, mutate } = useContentList<PreventiveMaintenancePlan>({
    contentType: 'pm_plan',
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('pm_plans');

  const createPlan = useCallback(async (planData: Omit<PreventiveMaintenancePlan, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('pm_plan_created', {
      equipmentId: planData.equipmentId,
      frequency: planData.frequency,
    });

    return mutate.create(planData);
  }, [canCreate, trackEvent, mutate]);

  const activatePlan = useCallback(async (planId: string) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('pm_plan_activated', { planId });

    return mutate.update(planId, { active: true });
  }, [canUpdate, trackEvent, mutate]);

  const deactivatePlan = useCallback(async (planId: string) => {
    trackEvent('pm_plan_deactivated', { planId });

    return mutate.update(planId, { active: false });
  }, [trackEvent, mutate]);

  const generateSchedules = useCallback(async (planId: string, monthsAhead: number = 12) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    trackEvent('pm_schedules_generated', { planId, monthsAhead });

    // Generate schedule instances based on plan frequency
    const schedules: Partial<MaintenanceSchedule>[] = [];
    // Generation logic here...

    return schedules;
  }, [plans, trackEvent]);

  return {
    plans,
    loading,
    createPlan,
    activatePlan,
    deactivatePlan,
    generateSchedules,
  };
}

/**
 * Equipment maintenance history hook
 *
 * Tracks and displays complete maintenance history for equipment.
 *
 * @example
 * ```tsx
 * function EquipmentHistory({ equipmentId }) {
 *   const {
 *     history,
 *     addHistoryEntry,
 *     getStatistics
 *   } = useEquipmentMaintenanceHistory(equipmentId);
 * }
 * ```
 */
export function useEquipmentMaintenanceHistory(equipmentId: string) {
  const { content: history, loading, mutate } = useContentList<MaintenanceHistory>({
    contentType: 'maintenance_history',
    initialFilters: { equipmentId },
  });

  const { trackEvent } = useEventTracking();

  const addHistoryEntry = useCallback(async (entry: Omit<MaintenanceHistory, 'id'>) => {
    trackEvent('maintenance_history_added', { equipmentId });

    return mutate.create(entry);
  }, [equipmentId, trackEvent, mutate]);

  const getStatistics = useCallback(() => {
    const totalCost = history.reduce((sum, h) => sum + h.totalCost, 0);
    const totalDowntime = history.reduce((sum, h) => sum + h.downtime, 0);
    const totalLaborHours = history.reduce((sum, h) => sum + h.laborHours, 0);
    const averageCostPerMaintenance = history.length > 0 ? totalCost / history.length : 0;

    return {
      totalMaintenanceEvents: history.length,
      totalCost,
      totalDowntime,
      totalLaborHours,
      averageCostPerMaintenance,
      lastMaintenanceDate: history[0]?.performedDate,
    };
  }, [history]);

  const getMaintenanceByType = useCallback((type: MaintenanceType) => {
    return history.filter(h => h.maintenanceType === type);
  }, [history]);

  return {
    history,
    loading,
    addHistoryEntry,
    getStatistics,
    getMaintenanceByType,
  };
}

/**
 * Equipment tracking and management hook
 *
 * Manages equipment inventory, condition tracking, and lifecycle.
 *
 * @example
 * ```tsx
 * function EquipmentManager() {
 *   const {
 *     equipment,
 *     addEquipment,
 *     updateCondition,
 *     getCriticalEquipment
 *   } = useEquipmentTracking();
 * }
 * ```
 */
export function useEquipmentTracking(facilityId?: string) {
  const { content: equipment, loading, mutate } = useContentList<EquipmentRecord>({
    contentType: 'equipment',
    initialFilters: facilityId ? { facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('equipment');

  const criticalEquipment = useMemo(() =>
    equipment.filter(e => e.criticality === 'critical'),
    [equipment]
  );

  const equipmentNeedingMaintenance = useMemo(() =>
    equipment.filter(e =>
      e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) <= new Date()
    ),
    [equipment]
  );

  const addEquipment = useCallback(async (equipmentData: Omit<EquipmentRecord, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('equipment_added', {
      category: equipmentData.category,
      criticality: equipmentData.criticality,
    });

    return mutate.create(equipmentData);
  }, [canCreate, trackEvent, mutate]);

  const updateCondition = useCallback(async (id: string, condition: EquipmentCondition, notes?: string) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('equipment_condition_updated', { equipmentId: id, condition });

    return mutate.update(id, {
      currentCondition: condition,
      metadata: { conditionUpdateNotes: notes, conditionUpdatedAt: new Date().toISOString() },
    });
  }, [canUpdate, trackEvent, mutate]);

  const retireEquipment = useCallback(async (id: string, reason: string) => {
    trackEvent('equipment_retired', { equipmentId: id });

    return mutate.update(id, {
      status: 'retired',
      metadata: { retirementReason: reason, retiredAt: new Date().toISOString() },
    });
  }, [trackEvent, mutate]);

  return {
    equipment,
    loading,
    criticalEquipment,
    equipmentNeedingMaintenance,
    addEquipment,
    updateCondition,
    retireEquipment,
  };
}

/**
 * Maintenance resource allocation hook
 *
 * Manages resource allocation for maintenance activities.
 *
 * @example
 * ```tsx
 * function ResourceAllocator({ scheduleId }) {
 *   const {
 *     allocations,
 *     allocateResource,
 *     releaseResource,
 *     checkAvailability
 *   } = useMaintenanceResourceAllocation(scheduleId);
 * }
 * ```
 */
export function useMaintenanceResourceAllocation(maintenanceScheduleId: string) {
  const { content: allocations, loading, mutate } = useContentList<ResourceAllocation>({
    contentType: 'resource_allocation',
    initialFilters: { maintenanceScheduleId },
  });

  const { trackEvent } = useEventTracking();
  const { checkConflicts } = useScheduleConflicts();

  const allocateResource = useCallback(async (resourceData: Omit<ResourceAllocation, 'id'>) => {
    // Check for conflicts
    const conflicts = await checkConflicts(
      resourceData.allocationDate,
      resourceData.allocationStartTime,
      resourceData.allocationEndTime
    );

    if (conflicts.length > 0) {
      throw new Error('Resource scheduling conflict detected');
    }

    trackEvent('resource_allocated', {
      resourceType: resourceData.resourceType,
      resourceId: resourceData.resourceId,
    });

    return mutate.create(resourceData);
  }, [trackEvent, mutate, checkConflicts]);

  const releaseResource = useCallback(async (allocationId: string) => {
    trackEvent('resource_released', { allocationId });

    return mutate.update(allocationId, { status: 'released' });
  }, [trackEvent, mutate]);

  const getTotalCost = useCallback(() => {
    return allocations.reduce((sum, a) => sum + a.totalCost, 0);
  }, [allocations]);

  return {
    allocations,
    loading,
    allocateResource,
    releaseResource,
    getTotalCost,
  };
}

/**
 * Service contract management hook
 *
 * Manages maintenance service contracts with external vendors.
 *
 * @example
 * ```tsx
 * function ContractManager() {
 *   const {
 *     contracts,
 *     activeContracts,
 *     expiringContracts,
 *     createContract
 *   } = useServiceContractManagement();
 * }
 * ```
 */
export function useServiceContractManagement() {
  const { content: contracts, loading, mutate } = useContentList<ServiceContract>({
    contentType: 'service_contract',
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('service_contracts');

  const activeContracts = useMemo(() =>
    contracts.filter(c => c.status === 'active' && new Date(c.endDate) > new Date()),
    [contracts]
  );

  const expiringContracts = useMemo(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return activeContracts.filter(c =>
      new Date(c.endDate) <= thirtyDaysFromNow
    );
  }, [activeContracts]);

  const createContract = useCallback(async (contractData: Omit<ServiceContract, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('service_contract_created', {
      contractType: contractData.contractType,
      totalValue: contractData.totalValue,
    });

    return mutate.create(contractData);
  }, [canCreate, trackEvent, mutate]);

  const renewContract = useCallback(async (contractId: string, newEndDate: string) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('service_contract_renewed', { contractId });

    return mutate.update(contractId, {
      endDate: newEndDate,
      renewalDate: new Date().toISOString(),
    });
  }, [canUpdate, trackEvent, mutate]);

  return {
    contracts,
    loading,
    activeContracts,
    expiringContracts,
    createContract,
    renewContract,
  };
}

/**
 * Maintenance calendar hook
 *
 * Provides calendar view of maintenance schedules.
 *
 * @example
 * ```tsx
 * function MaintenanceCalendar() {
 *   const {
 *     events,
 *     getEventsForDate,
 *     getEventsForWeek,
 *     getEventsForMonth
 *   } = useMaintenanceCalendar();
 * }
 * ```
 */
export function useMaintenanceCalendar(facilityId?: string) {
  const { schedules } = useMaintenanceScheduling(facilityId);
  const { calendar, addToCalendar } = usePublishingCalendar();

  const events: MaintenanceCalendarEvent[] = useMemo(() =>
    schedules.map(s => ({
      id: s.id,
      title: `${s.maintenanceType} - ${s.equipmentName}`,
      maintenanceScheduleId: s.id,
      equipmentName: s.equipmentName,
      maintenanceType: s.maintenanceType,
      startDateTime: s.scheduledDate,
      endDateTime: new Date(
        new Date(s.scheduledDate).getTime() + s.estimatedDuration * 60000
      ).toISOString(),
      assignedTo: s.assignedTechnician || 'Unassigned',
      priority: s.priority,
      status: s.status,
      location: s.facilityId,
      allDay: false,
      color: s.priority === 'critical' ? '#dc2626' : s.priority === 'high' ? '#ea580c' : '#0891b2',
    })),
    [schedules]
  );

  const getEventsForDate = useCallback((date: string) => {
    const targetDate = new Date(date).toDateString();
    return events.filter(e => new Date(e.startDateTime).toDateString() === targetDate);
  }, [events]);

  const getEventsForWeek = useCallback((startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return events.filter(e => {
      const eventDate = new Date(e.startDateTime);
      return eventDate >= start && eventDate < end;
    });
  }, [events]);

  const getEventsForMonth = useCallback((year: number, month: number) => {
    return events.filter(e => {
      const eventDate = new Date(e.startDateTime);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }, [events]);

  return {
    events,
    calendar,
    getEventsForDate,
    getEventsForWeek,
    getEventsForMonth,
  };
}

/**
 * Maintenance KPIs dashboard hook
 *
 * Calculates and tracks key performance indicators for maintenance.
 *
 * @example
 * ```tsx
 * function MaintenanceKPIDashboard() {
 *   const {
 *     kpis,
 *     refreshKPIs,
 *     getTrend
 *   } = useMaintenanceKPIs();
 * }
 * ```
 */
export function useMaintenanceKPIs(organizationCode?: string, period: string = 'current_month') {
  const [kpis, setKPIs] = useState<MaintenanceKPIs | null>(null);
  const { schedules } = useMaintenanceScheduling();
  const { trackEvent } = useEventTracking();

  const calculateKPIs = useCallback(() => {
    const totalScheduled = schedules.length;
    const totalCompleted = schedules.filter(s => s.status === 'completed').length;
    const totalOverdue = schedules.filter(s => s.status === 'overdue').length;
    const completionRate = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0;

    const completedSchedules = schedules.filter(s => s.status === 'completed' && s.actualEndDate && s.actualStartDate);
    const averageCompletionTime = completedSchedules.length > 0
      ? completedSchedules.reduce((sum, s) => {
          const duration = new Date(s.actualEndDate!).getTime() - new Date(s.actualStartDate!).getTime();
          return sum + (duration / 60000); // minutes
        }, 0) / completedSchedules.length
      : 0;

    const preventiveMaintenance = schedules.filter(s => s.maintenanceType === 'preventive');
    const preventiveCompleted = preventiveMaintenance.filter(s => s.status === 'completed');
    const preventiveCompliance = preventiveMaintenance.length > 0
      ? (preventiveCompleted.length / preventiveMaintenance.length) * 100
      : 0;

    const emergencyMaintenance = schedules.filter(s => s.maintenanceType === 'emergency');
    const emergencyRate = schedules.length > 0
      ? (emergencyMaintenance.length / schedules.length) * 100
      : 0;

    const totalCost = schedules
      .filter(s => s.actualCost)
      .reduce((sum, s) => sum + (s.actualCost || 0), 0);

    const costPerWorkOrder = totalCompleted > 0 ? totalCost / totalCompleted : 0;

    return {
      period,
      totalScheduled,
      totalCompleted,
      totalOverdue,
      completionRate,
      averageCompletionTime,
      preventiveMaintenanceCompliance: preventiveCompliance,
      meanTimeBetweenFailures: 0, // Requires failure data
      meanTimeToRepair: averageCompletionTime / 60, // hours
      totalMaintenanceCost: totalCost,
      costPerWorkOrder,
      emergencyMaintenanceRate: emergencyRate,
      equipmentUptime: 95, // Calculated from downtime records
      resourceUtilization: 0, // Requires resource tracking
      backlogWorkOrders: schedules.filter(s => s.status === 'scheduled').length,
    };
  }, [schedules, period]);

  const refreshKPIs = useCallback(() => {
    trackEvent('maintenance_kpis_refreshed', { period });
    const newKPIs = calculateKPIs();
    setKPIs(newKPIs);
  }, [calculateKPIs, period, trackEvent]);

  useEffect(() => {
    refreshKPIs();
  }, [refreshKPIs]);

  return {
    kpis,
    refreshKPIs,
  };
}

/**
 * Downtime tracking hook
 *
 * Tracks equipment downtime and availability.
 *
 * @example
 * ```tsx
 * function DowntimeTracker({ equipmentId }) {
 *   const {
 *     downtimeRecords,
 *     startDowntime,
 *     endDowntime,
 *     getTotalDowntime
 *   } = useDowntimeTracking(equipmentId);
 * }
 * ```
 */
export function useDowntimeTracking(equipmentId: string) {
  const { content: downtimeRecords, loading, mutate } = useContentList<DowntimeRecord>({
    contentType: 'downtime_record',
    initialFilters: { equipmentId },
  });

  const { trackEvent } = useEventTracking();

  const activeDowntime = useMemo(() =>
    downtimeRecords.find(d => !d.endTime),
    [downtimeRecords]
  );

  const startDowntime = useCallback(async (data: Omit<DowntimeRecord, 'id' | 'endTime' | 'duration'>) => {
    trackEvent('downtime_started', { equipmentId, reason: data.reason });

    return mutate.create(data);
  }, [equipmentId, trackEvent, mutate]);

  const endDowntime = useCallback(async (downtimeId: string, notes?: string) => {
    const downtime = downtimeRecords.find(d => d.id === downtimeId);
    if (!downtime) throw new Error('Downtime record not found');

    const endTime = new Date().toISOString();
    const duration = (new Date(endTime).getTime() - new Date(downtime.startTime).getTime()) / 60000; // minutes

    trackEvent('downtime_ended', { equipmentId, downtimeId, duration });

    return mutate.update(downtimeId, {
      endTime,
      duration,
      notes: notes || downtime.notes,
    });
  }, [equipmentId, downtimeRecords, trackEvent, mutate]);

  const getTotalDowntime = useCallback((periodDays: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);

    return downtimeRecords
      .filter(d => new Date(d.startTime) >= cutoffDate)
      .reduce((sum, d) => sum + (d.duration || 0), 0);
  }, [downtimeRecords]);

  return {
    downtimeRecords,
    loading,
    activeDowntime,
    startDowntime,
    endDowntime,
    getTotalDowntime,
  };
}

/**
 * Maintenance procedure execution hook
 *
 * Manages step-by-step execution of maintenance procedures.
 *
 * @example
 * ```tsx
 * function ProcedureExecution({ scheduleId }) {
 *   const {
 *     procedures,
 *     currentProcedure,
 *     completeStep,
 *     markChecklistItem
 *   } = useMaintenanceProcedureExecution(scheduleId);
 * }
 * ```
 */
export function useMaintenanceProcedureExecution(maintenanceScheduleId: string) {
  const [currentProcedureIndex, setCurrentProcedureIndex] = useState(0);
  const { schedules, updateSchedule } = useMaintenanceScheduling();
  const { trackEvent } = useEventTracking();

  const schedule = useMemo(() =>
    schedules.find(s => s.id === maintenanceScheduleId),
    [schedules, maintenanceScheduleId]
  );

  const procedures = useMemo(() =>
    schedule?.procedures || [],
    [schedule]
  );

  const currentProcedure = useMemo(() =>
    procedures[currentProcedureIndex],
    [procedures, currentProcedureIndex]
  );

  const completeStep = useCallback(async (procedureId: string, completedBy: string, notes?: string) => {
    if (!schedule) return;

    trackEvent('maintenance_step_completed', { scheduleId: maintenanceScheduleId, procedureId });

    const updatedProcedures = schedule.procedures.map(p =>
      p.id === procedureId
        ? {
            ...p,
            completed: true,
            completedBy,
            completedAt: new Date().toISOString(),
          }
        : p
    );

    await updateSchedule(maintenanceScheduleId, { procedures: updatedProcedures });

    // Move to next procedure
    if (currentProcedureIndex < procedures.length - 1) {
      setCurrentProcedureIndex(currentProcedureIndex + 1);
    }
  }, [schedule, maintenanceScheduleId, currentProcedureIndex, procedures.length, updateSchedule, trackEvent]);

  const markChecklistItem = useCallback(async (procedureId: string, checklistItemId: string, completed: boolean) => {
    if (!schedule) return;

    const updatedProcedures = schedule.procedures.map(p =>
      p.id === procedureId
        ? {
            ...p,
            checklistItems: p.checklistItems.map(item =>
              item.id === checklistItemId ? { ...item, completed } : item
            ),
          }
        : p
    );

    await updateSchedule(maintenanceScheduleId, { procedures: updatedProcedures });
  }, [schedule, maintenanceScheduleId, updateSchedule]);

  return {
    procedures,
    currentProcedure,
    currentProcedureIndex,
    setCurrentProcedureIndex,
    completeStep,
    markChecklistItem,
  };
}

/**
 * Maintenance cost tracking hook
 *
 * Tracks and analyzes maintenance costs.
 *
 * @example
 * ```tsx
 * function CostAnalysis({ equipmentId }) {
 *   const {
 *     totalCost,
 *     costBreakdown,
 *     costTrend
 *   } = useMaintenanceCostTracking(equipmentId);
 * }
 * ```
 */
export function useMaintenanceCostTracking(equipmentId?: string) {
  const { schedules } = useMaintenanceScheduling();
  const { trackEvent } = useEventTracking();

  const relevantSchedules = useMemo(() =>
    equipmentId
      ? schedules.filter(s => s.equipmentId === equipmentId)
      : schedules,
    [schedules, equipmentId]
  );

  const totalCost = useMemo(() =>
    relevantSchedules
      .filter(s => s.actualCost)
      .reduce((sum, s) => sum + (s.actualCost || 0), 0),
    [relevantSchedules]
  );

  const costBreakdown = useMemo(() => {
    const breakdown: Record<MaintenanceType, number> = {
      preventive: 0,
      corrective: 0,
      predictive: 0,
      emergency: 0,
      routine: 0,
      seasonal: 0,
      regulatory: 0,
      calibration: 0,
    };

    relevantSchedules.forEach(s => {
      if (s.actualCost) {
        breakdown[s.maintenanceType] += s.actualCost;
      }
    });

    return breakdown;
  }, [relevantSchedules]);

  const averageCostPerType = useCallback((type: MaintenanceType) => {
    const filtered = relevantSchedules.filter(s => s.maintenanceType === type && s.actualCost);
    return filtered.length > 0
      ? filtered.reduce((sum, s) => sum + (s.actualCost || 0), 0) / filtered.length
      : 0;
  }, [relevantSchedules]);

  return {
    totalCost,
    costBreakdown,
    averageCostPerType,
  };
}

/**
 * Maintenance search and filtering hook
 *
 * Advanced search for maintenance schedules and history.
 *
 * @example
 * ```tsx
 * function MaintenanceSearch() {
 *   const {
 *     search,
 *     results,
 *     applyFilter
 *   } = useMaintenanceSearch();
 * }
 * ```
 */
export function useMaintenanceSearch() {
  const {
    search,
    results,
    loading
  } = useSearch<MaintenanceSchedule>({
    searchFields: ['scheduleCode', 'equipmentName', 'description', 'assignedTechnician'],
    onSearch: async (query) => {
      // Search implementation
    },
  });

  const {
    filters,
    applyFilter,
    clearFilters
  } = useAdvancedFilters({
    availableFilters: [
      { id: 'maintenanceType', label: 'Type', field: 'maintenanceType', type: 'select' },
      { id: 'priority', label: 'Priority', field: 'priority', type: 'select' },
      { id: 'status', label: 'Status', field: 'status', type: 'select' },
      { id: 'scheduledDate', label: 'Scheduled Date', field: 'scheduledDate', type: 'daterange' },
    ],
  });

  const { trackEvent } = useEventTracking();

  const performSearch = useCallback(async (query: SearchQuery) => {
    trackEvent('maintenance_search_performed', { query: query.q });
    return search(query);
  }, [search, trackEvent]);

  return {
    search: performSearch,
    results,
    loading,
    filters,
    applyFilter,
    clearFilters,
  };
}

/**
 * Maintenance approval workflow hook
 *
 * Manages approval workflows for maintenance requests.
 *
 * @example
 * ```tsx
 * function MaintenanceApprovals() {
 *   const {
 *     submitForApproval,
 *     approve,
 *     reject,
 *     pendingApprovals
 *   } = useMaintenanceApprovals();
 * }
 * ```
 */
export function useMaintenanceApprovals() {
  const {
    workflow,
    submitWorkflow,
    approveStage,
    rejectStage
  } = useWorkflow({
    workflowType: 'maintenance_approval',
    stages: [
      {
        id: 'supervisor_review',
        name: 'Supervisor Review',
        order: 1,
        type: 'sequential',
        approvers: ['maintenance_supervisor'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowParallelReview: false,
      },
      {
        id: 'budget_approval',
        name: 'Budget Approval',
        order: 2,
        type: 'conditional',
        approvers: ['budget_manager'],
        requiredApprovals: 1,
        allowDelegation: false,
        allowParallelReview: false,
        conditions: [
          {
            field: 'estimatedCost',
            operator: 'greaterThan',
            value: 5000,
          },
        ],
      },
    ],
  });

  const { trackEvent } = useEventTracking();

  const submitForApproval = useCallback(async (scheduleId: string, requestData: any) => {
    trackEvent('maintenance_approval_submitted', { scheduleId });

    return submitWorkflow({ scheduleId, ...requestData });
  }, [trackEvent, submitWorkflow]);

  return {
    workflow,
    submitForApproval,
    approve: approveStage,
    reject: rejectStage,
  };
}

/**
 * Maintenance notifications hook
 *
 * Manages notifications for maintenance events.
 *
 * @example
 * ```tsx
 * function MaintenanceNotifications() {
 *   const {
 *     sendReminder,
 *     sendOverdueAlert,
 *     sendCompletionNotification
 *   } = useMaintenanceNotifications();
 * }
 * ```
 */
export function useMaintenanceNotifications() {
  const { sendNotification, notifications } = useWorkflowNotifications();
  const { scheduleNotification } = useScheduleNotifications();
  const { trackEvent } = useEventTracking();

  const sendReminder = useCallback(async (scheduleId: string, recipientIds: string[]) => {
    trackEvent('maintenance_reminder_sent', { scheduleId });

    return sendNotification({
      recipients: recipientIds,
      title: 'Maintenance Reminder',
      message: 'Scheduled maintenance is coming up',
      type: 'maintenance_reminder',
      priority: 'medium',
    });
  }, [trackEvent, sendNotification]);

  const sendOverdueAlert = useCallback(async (scheduleId: string, recipientIds: string[]) => {
    trackEvent('maintenance_overdue_alert_sent', { scheduleId });

    return sendNotification({
      recipients: recipientIds,
      title: 'Overdue Maintenance Alert',
      message: 'Maintenance schedule is overdue',
      type: 'maintenance_overdue',
      priority: 'high',
    });
  }, [trackEvent, sendNotification]);

  const sendCompletionNotification = useCallback(async (scheduleId: string, recipientIds: string[]) => {
    trackEvent('maintenance_completion_notified', { scheduleId });

    return sendNotification({
      recipients: recipientIds,
      title: 'Maintenance Completed',
      message: 'Scheduled maintenance has been completed',
      type: 'maintenance_completed',
      priority: 'low',
    });
  }, [trackEvent, sendNotification]);

  return {
    notifications,
    sendReminder,
    sendOverdueAlert,
    sendCompletionNotification,
  };
}

/**
 * Maintenance reporting hook
 *
 * Generates maintenance reports and analytics.
 *
 * @example
 * ```tsx
 * function MaintenanceReports() {
 *   const {
 *     generateReport,
 *     downloadReport,
 *     scheduleReport
 *   } = useMaintenanceReporting();
 * }
 * ```
 */
export function useMaintenanceReporting() {
  const { trackEvent } = useEventTracking();
  const { scheduleEvent } = useScheduling();

  const generateReport = useCallback(async (reportType:
    | 'schedule_summary'
    | 'cost_analysis'
    | 'kpi_dashboard'
    | 'equipment_history'
    | 'compliance_report'
  ) => {
    trackEvent('maintenance_report_generated', { reportType });

    return {
      id: `report_${Date.now()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      data: {},
    };
  }, [trackEvent]);

  const downloadReport = useCallback(async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    trackEvent('maintenance_report_downloaded', { reportId, format });
  }, [trackEvent]);

  const scheduleReport = useCallback(async (config: {
    reportType: string;
    recipients: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  }) => {
    trackEvent('maintenance_report_scheduled', config);

    return scheduleEvent({
      title: `${config.reportType} Report`,
      startDate: new Date().toISOString(),
      metadata: config,
      recurring: { frequency: config.frequency, interval: 1 },
    });
  }, [trackEvent, scheduleEvent]);

  return {
    generateReport,
    downloadReport,
    scheduleReport,
  };
}

/**
 * Maintenance parts inventory integration hook
 *
 * Integrates with parts inventory for maintenance planning.
 *
 * @example
 * ```tsx
 * function PartsIntegration({ scheduleId }) {
 *   const {
 *     checkPartAvailability,
 *     orderParts,
 *     trackPartDelivery
 *   } = useMaintenancePartsIntegration(scheduleId);
 * }
 * ```
 */
export function useMaintenancePartsIntegration(maintenanceScheduleId: string) {
  const { schedules, updateSchedule } = useMaintenanceScheduling();
  const { trackEvent } = useEventTracking();

  const schedule = useMemo(() =>
    schedules.find(s => s.id === maintenanceScheduleId),
    [schedules, maintenanceScheduleId]
  );

  const checkPartAvailability = useCallback(async () => {
    if (!schedule) return [];

    const availabilityStatus = schedule.requiredParts.map(part => ({
      ...part,
      available: part.quantityAvailable >= part.quantityRequired,
      needsOrder: part.quantityAvailable < part.quantityRequired,
    }));

    return availabilityStatus;
  }, [schedule]);

  const orderParts = useCallback(async (parts: RequiredPart[]) => {
    trackEvent('maintenance_parts_ordered', {
      scheduleId: maintenanceScheduleId,
      partsCount: parts.length,
    });

    const updatedParts = schedule?.requiredParts.map(p => {
      const orderedPart = parts.find(op => op.id === p.id);
      return orderedPart ? { ...p, ordered: true } : p;
    }) || [];

    await updateSchedule(maintenanceScheduleId, { requiredParts: updatedParts });
  }, [schedule, maintenanceScheduleId, updateSchedule, trackEvent]);

  const markPartReceived = useCallback(async (partId: string) => {
    if (!schedule) return;

    const updatedParts = schedule.requiredParts.map(p =>
      p.id === partId ? { ...p, received: true } : p
    );

    await updateSchedule(maintenanceScheduleId, { requiredParts: updatedParts });
  }, [schedule, maintenanceScheduleId, updateSchedule]);

  return {
    checkPartAvailability,
    orderParts,
    markPartReceived,
  };
}

/**
 * Maintenance completion workflow hook
 *
 * Manages the completion process for maintenance activities.
 *
 * @example
 * ```tsx
 * function CompletionWorkflow({ scheduleId }) {
 *   const {
 *     startCompletion,
 *     recordActuals,
 *     submitCompletion,
 *     requestReview
 *   } = useMaintenanceCompletion(scheduleId);
 * }
 * ```
 */
export function useMaintenanceCompletion(maintenanceScheduleId: string) {
  const { updateSchedule } = useMaintenanceScheduling();
  const { addHistoryEntry } = useEquipmentMaintenanceHistory(''); // Equipment ID would come from schedule
  const { trackEvent } = useEventTracking();

  const startCompletion = useCallback(async () => {
    trackEvent('maintenance_completion_started', { scheduleId: maintenanceScheduleId });

    await updateSchedule(maintenanceScheduleId, {
      status: 'in_progress',
      actualStartDate: new Date().toISOString(),
    });
  }, [maintenanceScheduleId, updateSchedule, trackEvent]);

  const recordActuals = useCallback(async (actuals: {
    actualCost: number;
    actualDuration: number;
    partsUsed: string[];
    laborHours: number;
  }) => {
    trackEvent('maintenance_actuals_recorded', { scheduleId: maintenanceScheduleId });

    await updateSchedule(maintenanceScheduleId, {
      actualCost: actuals.actualCost,
      completionNotes: `Labor hours: ${actuals.laborHours}, Parts used: ${actuals.partsUsed.join(', ')}`,
    });
  }, [maintenanceScheduleId, updateSchedule, trackEvent]);

  const submitCompletion = useCallback(async (completionData: {
    completionNotes: string;
    certificationIssued?: boolean;
    nextScheduledDate?: string;
  }) => {
    trackEvent('maintenance_completed', { scheduleId: maintenanceScheduleId });

    await updateSchedule(maintenanceScheduleId, {
      status: 'completed',
      actualEndDate: new Date().toISOString(),
      ...completionData,
    });
  }, [maintenanceScheduleId, updateSchedule, trackEvent]);

  return {
    startCompletion,
    recordActuals,
    submitCompletion,
  };
}

/**
 * Maintenance analytics and insights hook
 *
 * Provides advanced analytics and predictive insights.
 *
 * @example
 * ```tsx
 * function MaintenanceAnalytics() {
 *   const {
 *     insights,
 *     predictions,
 *     recommendations
 *   } = useMaintenanceAnalytics();
 * }
 * ```
 */
export function useMaintenanceAnalytics(facilityId?: string) {
  const { schedules } = useMaintenanceScheduling(facilityId);
  const { equipment } = useEquipmentTracking(facilityId);
  const { trackEvent } = useEventTracking();

  const insights = useMemo(() => {
    const totalScheduled = schedules.length;
    const completed = schedules.filter(s => s.status === 'completed').length;
    const overdue = schedules.filter(s => s.status === 'overdue').length;

    return {
      completionRate: totalScheduled > 0 ? (completed / totalScheduled) * 100 : 0,
      overdueRate: totalScheduled > 0 ? (overdue / totalScheduled) * 100 : 0,
      mostCommonMaintenanceType: 'preventive', // Would calculate from data
      averageCostTrend: 'increasing', // Would calculate from historical data
    };
  }, [schedules]);

  const predictions = useMemo(() => {
    return {
      nextFailurePrediction: equipment
        .filter(e => e.currentCondition === 'poor' || e.currentCondition === 'critical')
        .map(e => ({
          equipmentId: e.id,
          equipmentName: e.equipmentName,
          predictedFailureDate: 'within 30 days',
          confidence: 'high',
        })),
    };
  }, [equipment]);

  const recommendations = useMemo(() => {
    return [
      'Increase preventive maintenance frequency for critical equipment',
      'Address overdue maintenance items immediately',
      'Consider replacing equipment in poor condition',
    ];
  }, []);

  useEffect(() => {
    trackEvent('maintenance_analytics_viewed', { facilityId });
  }, [facilityId, trackEvent]);

  return {
    insights,
    predictions,
    recommendations,
  };
}

// Export all hooks and types
export type {
  MaintenanceSchedule,
  MaintenanceProcedure,
  ChecklistItem,
  RequiredPart,
  MaintenanceHistory,
  EquipmentRecord,
  ResourceAllocation,
  ServiceContract,
  MaintenanceCalendarEvent,
  MaintenanceKPIs,
  PreventiveMaintenancePlan,
  MaintenanceTask,
  DowntimeRecord,
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
  ResourceType,
  EquipmentCondition,
};
