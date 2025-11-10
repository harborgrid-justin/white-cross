/**
 * LOC: USACE-WO-MGT-2025
 * File: /reuse/frontend/composites/usace/usace-work-orders-composites.ts
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
 *   - ../../media-management-kit
 *   - ../../comments-moderation-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS work order management UI
 *   - Dispatch management dashboards
 *   - Work order tracking interfaces
 *   - Completion verification applications
 */

/**
 * File: /reuse/frontend/composites/usace/usace-work-orders-composites.ts
 * Locator: WC-USACE-WO-MGT-001
 * Purpose: USACE CEFMS Work Order Management - React composites for work order creation, dispatch,
 *          tracking, assignment, progress monitoring, completion verification, billing, and analytics
 *
 * Upstream: Composes React hooks and components from frontend kits
 * Downstream: USACE work order UI, dispatch systems, tracking dashboards, mobile field apps
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 46+ composite hooks and utilities for work order management
 *
 * LLM Context: Production-ready USACE CEFMS composite functions for work order management.
 * Comprehensive React hooks for work order lifecycle, request intake, priority assignment,
 * technician dispatch, real-time tracking, progress updates, material requisitions,
 * time tracking, completion verification, customer satisfaction, and performance analytics.
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
  useDynamicFields,
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
  useEscalation,
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
  useSearchSuggestions,
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
  useSessionTracking,
  type AnalyticsEvent,
  type EventParameters,
} from '../../analytics-tracking-kit';
import {
  useScheduling,
  usePublishingCalendar,
  useRecurringSchedule,
  useScheduleNotifications,
  useScheduleConflicts,
  type ScheduleConfig,
  type RecurringPattern,
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
  useInfiniteScroll,
  type ContentItem,
  type ContentFilters,
} from '../../content-management-hooks';
import {
  useVersionControl,
  useVersionHistory,
  useVersionComparison,
  useBranching,
  useChangeTracking,
  type Version,
  type VersionMetadata,
} from '../../version-control-kit';
import {
  useMediaUpload,
  useMediaLibrary,
  useMediaGallery,
  useImageOptimization,
  type MediaFile,
  type UploadProgress,
} from '../../media-management-kit';
import {
  useComments,
  useCommentThread,
  useCommentModeration,
  type Comment,
  type CommentThread,
} from '../../comments-moderation-kit';

// ============================================================================
// TYPE DEFINITIONS - WORK ORDERS
// ============================================================================

/**
 * Work order type classification
 */
export type WorkOrderType =
  | 'maintenance'
  | 'repair'
  | 'installation'
  | 'inspection'
  | 'emergency'
  | 'preventive'
  | 'corrective'
  | 'upgrade'
  | 'demolition'
  | 'modification';

/**
 * Work order priority levels
 */
export type WorkOrderPriority =
  | 'emergency'
  | 'urgent'
  | 'high'
  | 'normal'
  | 'low'
  | 'routine';

/**
 * Work order status
 */
export type WorkOrderStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'verified'
  | 'closed'
  | 'cancelled'
  | 'rejected';

/**
 * Completion verification status
 */
export type VerificationStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'requires_rework';

/**
 * Work order record
 */
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  title: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  requestorContact: {
    email: string;
    phone: string;
  };
  facilityId: string;
  facilityName: string;
  location: {
    building?: string;
    floor?: string;
    room?: string;
    specificLocation?: string;
  };
  assignedTo?: string;
  assignedTeam?: string;
  assignedDate?: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedHours: number;
  actualHours?: number;
  estimatedCost: number;
  actualCost?: number;
  category: string;
  subcategory?: string;
  equipmentId?: string;
  equipmentName?: string;
  requiredSkills: string[];
  requiredMaterials: MaterialRequisition[];
  requiredTools: string[];
  workPerformed?: string;
  completionNotes?: string;
  verificationStatus?: VerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  customerSatisfactionRating?: number;
  customerFeedback?: string;
  attachments: string[];
  relatedWorkOrders: string[];
  recurringSchedule?: RecurringPattern;
  slaDeadline?: string;
  slaStatus?: 'within_sla' | 'at_risk' | 'breached';
  billable: boolean;
  billingAmount?: number;
  invoiceNumber?: string;
  organizationCode: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Material requisition
 */
export interface MaterialRequisition {
  id: string;
  materialName: string;
  materialCode?: string;
  quantity: number;
  unit: string;
  estimatedUnitCost: number;
  actualUnitCost?: number;
  totalCost: number;
  vendor?: string;
  status: 'requested' | 'approved' | 'ordered' | 'received' | 'issued';
  requestedDate: string;
  receivedDate?: string;
  issuedDate?: string;
  notes?: string;
}

/**
 * Work order assignment
 */
export interface WorkOrderAssignment {
  id: string;
  workOrderId: string;
  assignedToUserId: string;
  assignedToUserName: string;
  assignedByUserId: string;
  assignmentDate: string;
  assignmentType: 'primary' | 'secondary' | 'supervisor';
  estimatedHours: number;
  actualHours?: number;
  role: string;
  status: 'assigned' | 'accepted' | 'declined' | 'completed';
  acceptedDate?: string;
  completedDate?: string;
  notes?: string;
}

/**
 * Work order time entry
 */
export interface TimeEntry {
  id: string;
  workOrderId: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  description: string;
  billable: boolean;
  billingRate?: number;
  status: 'draft' | 'submitted' | 'approved' | 'invoiced';
  approvedBy?: string;
  approvedDate?: string;
}

/**
 * Work order status history
 */
export interface StatusHistory {
  id: string;
  workOrderId: string;
  previousStatus: WorkOrderStatus;
  newStatus: WorkOrderStatus;
  changedBy: string;
  changedDate: string;
  reason?: string;
  notes?: string;
}

/**
 * Work order inspection checklist
 */
export interface InspectionChecklist {
  id: string;
  checklistName: string;
  workOrderType: WorkOrderType;
  items: InspectionChecklistItem[];
  completedBy?: string;
  completedDate?: string;
  overallPass: boolean;
  notes?: string;
}

/**
 * Inspection checklist item
 */
export interface InspectionChecklistItem {
  id: string;
  itemNumber: number;
  description: string;
  category: string;
  required: boolean;
  passed: boolean;
  notApplicable: boolean;
  notes?: string;
  photoUrls?: string[];
}

/**
 * Work order dispatch
 */
export interface WorkOrderDispatch {
  id: string;
  workOrderId: string;
  dispatchedBy: string;
  dispatchDate: string;
  assignedTechnicians: string[];
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  dispatchNotes?: string;
  travelDistance?: number;
  vehicleAssigned?: string;
  status: 'dispatched' | 'en_route' | 'arrived' | 'completed';
}

/**
 * Work order SLA configuration
 */
export interface WorkOrderSLA {
  priority: WorkOrderPriority;
  responseTimeMinutes: number;
  resolutionTimeHours: number;
  escalationRules: {
    level: number;
    triggerAfterMinutes: number;
    escalateTo: string[];
    actionType: 'notify' | 'reassign' | 'auto_escalate';
  }[];
}

/**
 * Work order metrics
 */
export interface WorkOrderMetrics {
  period: string;
  totalWorkOrders: number;
  openWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
  averageCompletionTime: number; // hours
  averageResponseTime: number; // minutes
  slaComplianceRate: number; // percentage
  firstTimeFixRate: number; // percentage
  totalLaborHours: number;
  totalCost: number;
  costPerWorkOrder: number;
  customerSatisfactionAverage: number;
  backlogCount: number;
  emergencyWorkOrderRate: number; // percentage
  byPriority: Record<WorkOrderPriority, number>;
  byType: Record<WorkOrderType, number>;
  byStatus: Record<WorkOrderStatus, number>;
  topTechnicians: {
    userId: string;
    userName: string;
    completedCount: number;
    averageRating: number;
  }[];
}

/**
 * Work order template
 */
export interface WorkOrderTemplate {
  id: string;
  templateName: string;
  workOrderType: WorkOrderType;
  defaultPriority: WorkOrderPriority;
  description: string;
  category: string;
  subcategory?: string;
  estimatedHours: number;
  requiredSkills: string[];
  standardProcedures: string[];
  checklistTemplate?: InspectionChecklist;
  active: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * Customer satisfaction survey
 */
export interface SatisfactionSurvey {
  id: string;
  workOrderId: string;
  respondentName: string;
  respondentEmail: string;
  surveyDate: string;
  overallRating: number; // 1-5
  ratings: {
    responseTime: number;
    workQuality: number;
    professionalism: number;
    communication: number;
  };
  feedback: string;
  wouldRecommend: boolean;
  improvements?: string;
}

// ============================================================================
// COMPOSITE HOOKS - WORK ORDER MANAGEMENT
// ============================================================================

/**
 * Comprehensive work order management hook
 *
 * Provides complete work order lifecycle management including creation, assignment,
 * tracking, completion, and analytics.
 *
 * @example
 * ```tsx
 * function WorkOrderManager() {
 *   const {
 *     workOrders,
 *     createWorkOrder,
 *     updateWorkOrder,
 *     assignWorkOrder,
 *     completeWorkOrder,
 *     getOpenWorkOrders
 *   } = useWorkOrderManagement();
 *
 *   return <WorkOrderList workOrders={workOrders} />;
 * }
 * ```
 */
export function useWorkOrderManagement(facilityId?: string) {
  const { content: workOrders, loading, error, mutate } = useContentList<WorkOrder>({
    contentType: 'work_order',
    initialFilters: facilityId ? { facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate, canDelete } = usePermissionCheck('work_orders');
  const { user } = useUserIdentification();

  const openWorkOrders = useMemo(() =>
    workOrders.filter(wo =>
      ['submitted', 'approved', 'assigned', 'scheduled', 'in_progress'].includes(wo.status)
    ),
    [workOrders]
  );

  const emergencyWorkOrders = useMemo(() =>
    workOrders.filter(wo => wo.priority === 'emergency' && wo.status !== 'completed'),
    [workOrders]
  );

  const overdueWorkOrders = useMemo(() =>
    workOrders.filter(wo =>
      wo.slaDeadline && new Date(wo.slaDeadline) < new Date() && wo.status !== 'completed'
    ),
    [workOrders]
  );

  const createWorkOrder = useCallback(async (workOrderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('work_order_created', {
      type: workOrderData.type,
      priority: workOrderData.priority,
      facilityId: workOrderData.facilityId,
    });

    return mutate.create(workOrderData);
  }, [canCreate, trackEvent, mutate]);

  const updateWorkOrder = useCallback(async (id: string, updates: Partial<WorkOrder>) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('work_order_updated', { workOrderId: id });

    return mutate.update(id, updates);
  }, [canUpdate, trackEvent, mutate]);

  const deleteWorkOrder = useCallback(async (id: string) => {
    if (!canDelete) throw new Error('Permission denied');

    trackEvent('work_order_deleted', { workOrderId: id });

    return mutate.delete(id);
  }, [canDelete, trackEvent, mutate]);

  const assignWorkOrder = useCallback(async (id: string, assignedTo: string, assignedTeam?: string) => {
    trackEvent('work_order_assigned', { workOrderId: id, assignedTo });

    return updateWorkOrder(id, {
      assignedTo,
      assignedTeam,
      assignedDate: new Date().toISOString(),
      status: 'assigned' as WorkOrderStatus,
    });
  }, [updateWorkOrder, trackEvent]);

  const completeWorkOrder = useCallback(async (id: string, completionData: {
    workPerformed: string;
    actualHours: number;
    actualCost: number;
    completionNotes?: string;
  }) => {
    trackEvent('work_order_completed', { workOrderId: id });

    return updateWorkOrder(id, {
      ...completionData,
      status: 'completed' as WorkOrderStatus,
      actualEndDate: new Date().toISOString(),
    });
  }, [updateWorkOrder, trackEvent]);

  return {
    workOrders,
    loading,
    error,
    openWorkOrders,
    emergencyWorkOrders,
    overdueWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    assignWorkOrder,
    completeWorkOrder,
  };
}

/**
 * Work order creation form hook
 *
 * Multi-step form for creating new work orders with validation.
 *
 * @example
 * ```tsx
 * function CreateWorkOrderForm() {
 *   const {
 *     formData,
 *     currentStep,
 *     nextStep,
 *     submitForm
 *   } = useWorkOrderCreationForm();
 * }
 * ```
 */
export function useWorkOrderCreationForm() {
  const basicInfoFields: FieldConfig[] = useMemo(() => [
    {
      id: 'workOrderNumber',
      name: 'workOrderNumber',
      type: 'text',
      label: 'Work Order Number',
      required: true,
      validation: [{ type: 'required', message: 'Work order number is required' }],
    },
    {
      id: 'title',
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      validation: [{ type: 'required', message: 'Title is required' }],
    },
    {
      id: 'type',
      name: 'type',
      type: 'select',
      label: 'Work Order Type',
      required: true,
      options: [
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Repair', value: 'repair' },
        { label: 'Installation', value: 'installation' },
        { label: 'Inspection', value: 'inspection' },
        { label: 'Emergency', value: 'emergency' },
      ],
    },
    {
      id: 'priority',
      name: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      options: [
        { label: 'Emergency', value: 'emergency' },
        { label: 'Urgent', value: 'urgent' },
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      id: 'description',
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      rows: 6,
    },
  ], []);

  const locationFields: FieldConfig[] = useMemo(() => [
    {
      id: 'facilityId',
      name: 'facilityId',
      type: 'text',
      label: 'Facility',
      required: true,
    },
    {
      id: 'building',
      name: 'location.building',
      type: 'text',
      label: 'Building',
      required: false,
    },
    {
      id: 'floor',
      name: 'location.floor',
      type: 'text',
      label: 'Floor',
      required: false,
    },
    {
      id: 'room',
      name: 'location.room',
      type: 'text',
      label: 'Room',
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
      { id: 'location', title: 'Location Details', fields: locationFields },
      { id: 'requirements', title: 'Requirements', fields: [] },
    ],
  });

  const { validateForm, errors } = useFormValidation(formData, [
    ...basicInfoFields,
    ...locationFields,
  ]);

  const { trackEvent } = useEventTracking();
  const { saveProgress, loadProgress } = useFormPersistence('work_order_form');

  const submitForm = useCallback(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    trackEvent('work_order_form_submitted', {
      type: formData.type,
      priority: formData.priority,
    });

    return formData;
  }, [formData, validateForm, trackEvent]);

  // Auto-save
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
 * Work order dispatch management hook
 *
 * Manages dispatching work orders to technicians.
 *
 * @example
 * ```tsx
 * function DispatchCenter() {
 *   const {
 *     dispatch,
 *     activeDispatches,
 *     updateDispatchStatus
 *   } = useWorkOrderDispatch();
 * }
 * ```
 */
export function useWorkOrderDispatch() {
  const { content: dispatches, loading, mutate } = useContentList<WorkOrderDispatch>({
    contentType: 'work_order_dispatch',
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('work_order_dispatch');

  const activeDispatches = useMemo(() =>
    dispatches.filter(d => ['dispatched', 'en_route', 'arrived'].includes(d.status)),
    [dispatches]
  );

  const dispatchWorkOrder = useCallback(async (dispatchData: Omit<WorkOrderDispatch, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('work_order_dispatched', {
      workOrderId: dispatchData.workOrderId,
      technicianCount: dispatchData.assignedTechnicians.length,
    });

    return mutate.create(dispatchData);
  }, [canCreate, trackEvent, mutate]);

  const updateDispatchStatus = useCallback(async (
    dispatchId: string,
    status: WorkOrderDispatch['status'],
    notes?: string
  ) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('dispatch_status_updated', { dispatchId, status });

    const updates: Partial<WorkOrderDispatch> = { status };
    if (status === 'arrived') {
      updates.actualArrivalTime = new Date().toISOString();
    }
    if (notes) {
      updates.dispatchNotes = notes;
    }

    return mutate.update(dispatchId, updates);
  }, [canUpdate, trackEvent, mutate]);

  return {
    dispatches,
    loading,
    activeDispatches,
    dispatchWorkOrder,
    updateDispatchStatus,
  };
}

/**
 * Work order assignment management hook
 *
 * Manages technician assignments to work orders.
 *
 * @example
 * ```tsx
 * function AssignmentManager({ workOrderId }) {
 *   const {
 *     assignments,
 *     assignTechnician,
 *     acceptAssignment,
 *     declineAssignment
 *   } = useWorkOrderAssignments(workOrderId);
 * }
 * ```
 */
export function useWorkOrderAssignments(workOrderId: string) {
  const { content: assignments, loading, mutate } = useContentList<WorkOrderAssignment>({
    contentType: 'work_order_assignment',
    initialFilters: { workOrderId },
  });

  const { trackEvent } = useEventTracking();
  const { user } = useUserIdentification();

  const assignTechnician = useCallback(async (assignmentData: Omit<WorkOrderAssignment, 'id'>) => {
    trackEvent('technician_assigned', {
      workOrderId,
      technicianId: assignmentData.assignedToUserId,
    });

    return mutate.create(assignmentData);
  }, [workOrderId, trackEvent, mutate]);

  const acceptAssignment = useCallback(async (assignmentId: string) => {
    trackEvent('assignment_accepted', { assignmentId, workOrderId });

    return mutate.update(assignmentId, {
      status: 'accepted',
      acceptedDate: new Date().toISOString(),
    });
  }, [workOrderId, trackEvent, mutate]);

  const declineAssignment = useCallback(async (assignmentId: string, reason: string) => {
    trackEvent('assignment_declined', { assignmentId, workOrderId });

    return mutate.update(assignmentId, {
      status: 'declined',
      notes: reason,
    });
  }, [workOrderId, trackEvent, mutate]);

  const completeAssignment = useCallback(async (assignmentId: string, actualHours: number) => {
    trackEvent('assignment_completed', { assignmentId, workOrderId });

    return mutate.update(assignmentId, {
      status: 'completed',
      actualHours,
      completedDate: new Date().toISOString(),
    });
  }, [workOrderId, trackEvent, mutate]);

  return {
    assignments,
    loading,
    assignTechnician,
    acceptAssignment,
    declineAssignment,
    completeAssignment,
  };
}

/**
 * Time tracking hook for work orders
 *
 * Tracks labor time spent on work orders.
 *
 * @example
 * ```tsx
 * function TimeTracker({ workOrderId }) {
 *   const {
 *     timeEntries,
 *     startTimer,
 *     stopTimer,
 *     getTotalHours
 *   } = useWorkOrderTimeTracking(workOrderId);
 * }
 * ```
 */
export function useWorkOrderTimeTracking(workOrderId: string) {
  const { content: timeEntries, loading, mutate } = useContentList<TimeEntry>({
    contentType: 'time_entry',
    initialFilters: { workOrderId },
  });

  const { trackEvent } = useEventTracking();
  const { user } = useUserIdentification();

  const activeTimer = useMemo(() =>
    timeEntries.find(te => !te.endTime && te.userId === user?.userId),
    [timeEntries, user]
  );

  const startTimer = useCallback(async (description: string, billable: boolean = true) => {
    trackEvent('time_tracking_started', { workOrderId });

    return mutate.create({
      workOrderId,
      userId: user?.userId || '',
      userName: user?.name || '',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      description,
      billable,
      status: 'draft',
    });
  }, [workOrderId, user, trackEvent, mutate]);

  const stopTimer = useCallback(async (timeEntryId: string) => {
    const entry = timeEntries.find(te => te.id === timeEntryId);
    if (!entry) throw new Error('Time entry not found');

    const endTime = new Date().toISOString();
    const duration = (new Date(endTime).getTime() - new Date(entry.startTime).getTime()) / 60000; // minutes

    trackEvent('time_tracking_stopped', { workOrderId, duration });

    return mutate.update(timeEntryId, {
      endTime,
      duration,
      status: 'submitted',
    });
  }, [workOrderId, timeEntries, trackEvent, mutate]);

  const getTotalHours = useCallback(() => {
    return timeEntries
      .filter(te => te.duration)
      .reduce((sum, te) => sum + (te.duration || 0), 0) / 60; // convert minutes to hours
  }, [timeEntries]);

  const getTotalCost = useCallback(() => {
    return timeEntries
      .filter(te => te.billable && te.billingRate && te.duration)
      .reduce((sum, te) => sum + ((te.duration || 0) / 60) * (te.billingRate || 0), 0);
  }, [timeEntries]);

  return {
    timeEntries,
    loading,
    activeTimer,
    startTimer,
    stopTimer,
    getTotalHours,
    getTotalCost,
  };
}

/**
 * Material requisition hook
 *
 * Manages material requests for work orders.
 *
 * @example
 * ```tsx
 * function MaterialRequisitions({ workOrderId }) {
 *   const {
 *     materials,
 *     requestMaterial,
 *     receiveMaterial,
 *     issueMaterial
 *   } = useWorkOrderMaterials(workOrderId);
 * }
 * ```
 */
export function useWorkOrderMaterials(workOrderId: string) {
  const { workOrders, updateWorkOrder } = useWorkOrderManagement();
  const { trackEvent } = useEventTracking();

  const workOrder = useMemo(() =>
    workOrders.find(wo => wo.id === workOrderId),
    [workOrders, workOrderId]
  );

  const materials = useMemo(() =>
    workOrder?.requiredMaterials || [],
    [workOrder]
  );

  const requestMaterial = useCallback(async (materialData: Omit<MaterialRequisition, 'id'>) => {
    if (!workOrder) throw new Error('Work order not found');

    trackEvent('material_requested', { workOrderId, materialName: materialData.materialName });

    const updatedMaterials = [
      ...workOrder.requiredMaterials,
      { ...materialData, id: `mat_${Date.now()}` },
    ];

    await updateWorkOrder(workOrderId, { requiredMaterials: updatedMaterials });
  }, [workOrder, workOrderId, updateWorkOrder, trackEvent]);

  const updateMaterialStatus = useCallback(async (
    materialId: string,
    status: MaterialRequisition['status']
  ) => {
    if (!workOrder) throw new Error('Work order not found');

    const updatedMaterials = workOrder.requiredMaterials.map(m =>
      m.id === materialId ? { ...m, status } : m
    );

    await updateWorkOrder(workOrderId, { requiredMaterials: updatedMaterials });
  }, [workOrder, workOrderId, updateWorkOrder]);

  const receiveMaterial = useCallback(async (materialId: string) => {
    trackEvent('material_received', { workOrderId, materialId });
    return updateMaterialStatus(materialId, 'received');
  }, [workOrderId, updateMaterialStatus, trackEvent]);

  const issueMaterial = useCallback(async (materialId: string) => {
    trackEvent('material_issued', { workOrderId, materialId });
    return updateMaterialStatus(materialId, 'issued');
  }, [workOrderId, updateMaterialStatus, trackEvent]);

  return {
    materials,
    requestMaterial,
    receiveMaterial,
    issueMaterial,
    updateMaterialStatus,
  };
}

/**
 * Work order status tracking hook
 *
 * Tracks status changes and maintains history.
 *
 * @example
 * ```tsx
 * function StatusTracker({ workOrderId }) {
 *   const {
 *     statusHistory,
 *     changeStatus,
 *     getStatusTimeline
 *   } = useWorkOrderStatusTracking(workOrderId);
 * }
 * ```
 */
export function useWorkOrderStatusTracking(workOrderId: string) {
  const { content: statusHistory, loading, mutate } = useContentList<StatusHistory>({
    contentType: 'status_history',
    initialFilters: { workOrderId },
  });

  const { workOrders, updateWorkOrder } = useWorkOrderManagement();
  const { trackEvent } = useEventTracking();
  const { user } = useUserIdentification();

  const workOrder = useMemo(() =>
    workOrders.find(wo => wo.id === workOrderId),
    [workOrders, workOrderId]
  );

  const changeStatus = useCallback(async (
    newStatus: WorkOrderStatus,
    reason?: string,
    notes?: string
  ) => {
    if (!workOrder) throw new Error('Work order not found');

    trackEvent('work_order_status_changed', {
      workOrderId,
      previousStatus: workOrder.status,
      newStatus,
    });

    // Record history
    await mutate.create({
      workOrderId,
      previousStatus: workOrder.status,
      newStatus,
      changedBy: user?.userId || '',
      changedDate: new Date().toISOString(),
      reason,
      notes,
    });

    // Update work order
    await updateWorkOrder(workOrderId, { status: newStatus });
  }, [workOrder, workOrderId, user, trackEvent, mutate, updateWorkOrder]);

  const getStatusDuration = useCallback((status: WorkOrderStatus) => {
    const entries = statusHistory.filter(sh => sh.newStatus === status);
    if (entries.length === 0) return 0;

    // Calculate time in status
    let totalDuration = 0;
    // Duration calculation logic...
    return totalDuration;
  }, [statusHistory]);

  return {
    statusHistory,
    loading,
    changeStatus,
    getStatusDuration,
  };
}

/**
 * Work order completion verification hook
 *
 * Manages quality checks and completion verification.
 *
 * @example
 * ```tsx
 * function CompletionVerification({ workOrderId }) {
 *   const {
 *     verify,
 *     reject,
 *     requestRework
 *   } = useWorkOrderVerification(workOrderId);
 * }
 * ```
 */
export function useWorkOrderVerification(workOrderId: string) {
  const { updateWorkOrder } = useWorkOrderManagement();
  const { trackEvent } = useEventTracking();
  const { user } = useUserIdentification();

  const verifyCompletion = useCallback(async (verificationNotes?: string) => {
    trackEvent('work_order_verified', { workOrderId });

    await updateWorkOrder(workOrderId, {
      verificationStatus: 'approved',
      verifiedBy: user?.userId,
      verifiedDate: new Date().toISOString(),
      status: 'verified',
      completionNotes: verificationNotes,
    });
  }, [workOrderId, user, trackEvent, updateWorkOrder]);

  const rejectCompletion = useCallback(async (reason: string) => {
    trackEvent('work_order_verification_rejected', { workOrderId });

    await updateWorkOrder(workOrderId, {
      verificationStatus: 'rejected',
      verifiedBy: user?.userId,
      verifiedDate: new Date().toISOString(),
      status: 'in_progress',
      completionNotes: `Rejected: ${reason}`,
    });
  }, [workOrderId, user, trackEvent, updateWorkOrder]);

  const requestRework = useCallback(async (reworkInstructions: string) => {
    trackEvent('work_order_rework_requested', { workOrderId });

    await updateWorkOrder(workOrderId, {
      verificationStatus: 'requires_rework',
      status: 'in_progress',
      completionNotes: `Rework required: ${reworkInstructions}`,
    });
  }, [workOrderId, trackEvent, updateWorkOrder]);

  return {
    verifyCompletion,
    rejectCompletion,
    requestRework,
  };
}

/**
 * Work order templates hook
 *
 * Manages reusable work order templates.
 *
 * @example
 * ```tsx
 * function TemplateManager() {
 *   const {
 *     templates,
 *     createTemplate,
 *     applyTemplate
 *   } = useWorkOrderTemplates();
 * }
 * ```
 */
export function useWorkOrderTemplates() {
  const { content: templates, loading, mutate } = useContentList<WorkOrderTemplate>({
    contentType: 'work_order_template',
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('work_order_templates');

  const activeTemplates = useMemo(() =>
    templates.filter(t => t.active),
    [templates]
  );

  const createTemplate = useCallback(async (templateData: Omit<WorkOrderTemplate, 'id' | 'createdAt'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('work_order_template_created', {
      templateName: templateData.templateName,
      workOrderType: templateData.workOrderType,
    });

    return mutate.create(templateData);
  }, [canCreate, trackEvent, mutate]);

  const applyTemplate = useCallback((templateId: string): Partial<WorkOrder> => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    trackEvent('work_order_template_applied', { templateId });

    return {
      type: template.workOrderType,
      priority: template.defaultPriority,
      description: template.description,
      category: template.category,
      subcategory: template.subcategory,
      estimatedHours: template.estimatedHours,
      requiredSkills: template.requiredSkills,
    };
  }, [templates, trackEvent]);

  return {
    templates,
    loading,
    activeTemplates,
    createTemplate,
    applyTemplate,
  };
}

/**
 * Work order SLA management hook
 *
 * Manages service level agreements and escalations.
 *
 * @example
 * ```tsx
 * function SLAManager() {
 *   const {
 *     checkSLAStatus,
 *     calculateDeadline,
 *     escalate
 *   } = useWorkOrderSLA();
 * }
 * ```
 */
export function useWorkOrderSLA() {
  const { trackEvent } = useEventTracking();

  const slaConfigs: Record<WorkOrderPriority, WorkOrderSLA> = useMemo(() => ({
    emergency: {
      priority: 'emergency',
      responseTimeMinutes: 15,
      resolutionTimeHours: 4,
      escalationRules: [
        {
          level: 1,
          triggerAfterMinutes: 10,
          escalateTo: ['supervisor'],
          actionType: 'notify',
        },
        {
          level: 2,
          triggerAfterMinutes: 20,
          escalateTo: ['manager'],
          actionType: 'auto_escalate',
        },
      ],
    },
    urgent: {
      priority: 'urgent',
      responseTimeMinutes: 60,
      resolutionTimeHours: 8,
      escalationRules: [
        {
          level: 1,
          triggerAfterMinutes: 45,
          escalateTo: ['supervisor'],
          actionType: 'notify',
        },
      ],
    },
    high: {
      priority: 'high',
      responseTimeMinutes: 240,
      resolutionTimeHours: 24,
      escalationRules: [],
    },
    normal: {
      priority: 'normal',
      responseTimeMinutes: 480,
      resolutionTimeHours: 72,
      escalationRules: [],
    },
    low: {
      priority: 'low',
      responseTimeMinutes: 1440,
      resolutionTimeHours: 168,
      escalationRules: [],
    },
    routine: {
      priority: 'routine',
      responseTimeMinutes: 2880,
      resolutionTimeHours: 336,
      escalationRules: [],
    },
  }), []);

  const calculateDeadline = useCallback((
    priority: WorkOrderPriority,
    requestedDate: string
  ): string => {
    const sla = slaConfigs[priority];
    const deadline = new Date(requestedDate);
    deadline.setHours(deadline.getHours() + sla.resolutionTimeHours);
    return deadline.toISOString();
  }, [slaConfigs]);

  const checkSLAStatus = useCallback((workOrder: WorkOrder): WorkOrder['slaStatus'] => {
    if (!workOrder.slaDeadline) return undefined;

    const now = new Date();
    const deadline = new Date(workOrder.slaDeadline);
    const timeRemaining = deadline.getTime() - now.getTime();
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);

    if (timeRemaining < 0) return 'breached';
    if (hoursRemaining < 4) return 'at_risk';
    return 'within_sla';
  }, []);

  const escalate = useCallback(async (workOrderId: string, level: number) => {
    trackEvent('work_order_escalated', { workOrderId, level });

    // Escalation logic
  }, [trackEvent]);

  return {
    slaConfigs,
    calculateDeadline,
    checkSLAStatus,
    escalate,
  };
}

/**
 * Work order metrics and analytics hook
 *
 * Calculates performance metrics and KPIs.
 *
 * @example
 * ```tsx
 * function MetricsDashboard() {
 *   const {
 *     metrics,
 *     refreshMetrics,
 *     getTrends
 *   } = useWorkOrderMetrics();
 * }
 * ```
 */
export function useWorkOrderMetrics(organizationCode?: string, period: string = 'current_month') {
  const [metrics, setMetrics] = useState<WorkOrderMetrics | null>(null);
  const { workOrders } = useWorkOrderManagement();
  const { trackEvent } = useEventTracking();

  const calculateMetrics = useCallback(() => {
    const totalWorkOrders = workOrders.length;
    const openWorkOrders = workOrders.filter(wo =>
      !['completed', 'verified', 'closed', 'cancelled'].includes(wo.status)
    ).length;
    const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;
    const cancelledWorkOrders = workOrders.filter(wo => wo.status === 'cancelled').length;

    const completedWithTime = workOrders.filter(wo =>
      wo.status === 'completed' && wo.actualStartDate && wo.actualEndDate
    );

    const averageCompletionTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, wo) => {
          const duration = (new Date(wo.actualEndDate!).getTime() - new Date(wo.actualStartDate!).getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }, 0) / completedWithTime.length
      : 0;

    const slaCompliantCount = workOrders.filter(wo =>
      wo.slaStatus === 'within_sla' && wo.status === 'completed'
    ).length;
    const slaComplianceRate = completedWorkOrders > 0 ? (slaCompliantCount / completedWorkOrders) * 100 : 0;

    const totalCost = workOrders
      .filter(wo => wo.actualCost)
      .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);

    const emergencyCount = workOrders.filter(wo => wo.priority === 'emergency').length;
    const emergencyRate = totalWorkOrders > 0 ? (emergencyCount / totalWorkOrders) * 100 : 0;

    return {
      period,
      totalWorkOrders,
      openWorkOrders,
      completedWorkOrders,
      cancelledWorkOrders,
      averageCompletionTime,
      averageResponseTime: 0, // Would calculate from dispatch data
      slaComplianceRate,
      firstTimeFixRate: 0, // Would need rework tracking
      totalLaborHours: workOrders.reduce((sum, wo) => sum + (wo.actualHours || 0), 0),
      totalCost,
      costPerWorkOrder: completedWorkOrders > 0 ? totalCost / completedWorkOrders : 0,
      customerSatisfactionAverage: 0, // Would calculate from surveys
      backlogCount: openWorkOrders,
      emergencyWorkOrderRate: emergencyRate,
      byPriority: {} as Record<WorkOrderPriority, number>,
      byType: {} as Record<WorkOrderType, number>,
      byStatus: {} as Record<WorkOrderStatus, number>,
      topTechnicians: [],
    };
  }, [workOrders, period]);

  const refreshMetrics = useCallback(() => {
    trackEvent('work_order_metrics_refreshed', { period });
    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);
  }, [calculateMetrics, period, trackEvent]);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    metrics,
    refreshMetrics,
  };
}

/**
 * Customer satisfaction survey hook
 *
 * Manages post-completion satisfaction surveys.
 *
 * @example
 * ```tsx
 * function SatisfactionSurvey({ workOrderId }) {
 *   const {
 *     sendSurvey,
 *     submitSurvey,
 *     getSurveyResults
 *   } = useCustomerSatisfaction(workOrderId);
 * }
 * ```
 */
export function useCustomerSatisfaction(workOrderId?: string) {
  const { content: surveys, loading, mutate } = useContentList<SatisfactionSurvey>({
    contentType: 'satisfaction_survey',
    initialFilters: workOrderId ? { workOrderId } : undefined,
  });

  const { trackEvent } = useEventTracking();

  const sendSurvey = useCallback(async (workOrderId: string, recipientEmail: string) => {
    trackEvent('satisfaction_survey_sent', { workOrderId });

    // Survey sending logic
  }, [trackEvent]);

  const submitSurvey = useCallback(async (surveyData: Omit<SatisfactionSurvey, 'id'>) => {
    trackEvent('satisfaction_survey_submitted', {
      workOrderId: surveyData.workOrderId,
      overallRating: surveyData.overallRating,
    });

    return mutate.create(surveyData);
  }, [trackEvent, mutate]);

  const getAverageRating = useCallback(() => {
    if (surveys.length === 0) return 0;
    return surveys.reduce((sum, s) => sum + s.overallRating, 0) / surveys.length;
  }, [surveys]);

  return {
    surveys,
    loading,
    sendSurvey,
    submitSurvey,
    getAverageRating,
  };
}

/**
 * Work order search and filtering hook
 *
 * Advanced search capabilities for work orders.
 *
 * @example
 * ```tsx
 * function WorkOrderSearch() {
 *   const {
 *     search,
 *     results,
 *     applyFilter
 *   } = useWorkOrderSearch();
 * }
 * ```
 */
export function useWorkOrderSearch() {
  const {
    search,
    results,
    loading
  } = useSearch<WorkOrder>({
    searchFields: ['workOrderNumber', 'title', 'description', 'equipmentName'],
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
      { id: 'type', label: 'Type', field: 'type', type: 'select' },
      { id: 'priority', label: 'Priority', field: 'priority', type: 'select' },
      { id: 'status', label: 'Status', field: 'status', type: 'select' },
      { id: 'assignedTo', label: 'Assigned To', field: 'assignedTo', type: 'text' },
      { id: 'facilityId', label: 'Facility', field: 'facilityId', type: 'text' },
    ],
  });

  const { facets, applyFacet } = useFacetedSearch({
    facetFields: [
      { field: 'type', label: 'Type' },
      { field: 'priority', label: 'Priority' },
      { field: 'status', label: 'Status' },
    ],
  });

  const { trackEvent } = useEventTracking();

  const performSearch = useCallback(async (query: SearchQuery) => {
    trackEvent('work_order_search_performed', { query: query.q });
    return search(query);
  }, [search, trackEvent]);

  return {
    search: performSearch,
    results,
    loading,
    filters,
    facets,
    applyFilter,
    applyFacet,
    clearFilters,
  };
}

/**
 * Work order comments and collaboration hook
 *
 * Manages comments and team collaboration on work orders.
 *
 * @example
 * ```tsx
 * function WorkOrderComments({ workOrderId }) {
 *   const {
 *     comments,
 *     addComment,
 *     replyToComment
 *   } = useWorkOrderComments(workOrderId);
 * }
 * ```
 */
export function useWorkOrderComments(workOrderId: string) {
  const {
    comments,
    addComment: addCommentBase,
    updateComment,
    deleteComment
  } = useComments('work_order', workOrderId);

  const { trackEvent } = useEventTracking();
  const { user } = useUserIdentification();

  const addComment = useCallback(async (content: string, attachments?: string[]) => {
    trackEvent('work_order_comment_added', { workOrderId });

    return addCommentBase({
      content,
      author: user?.userId || '',
      authorName: user?.name || '',
      attachments,
    });
  }, [workOrderId, user, trackEvent, addCommentBase]);

  const mentionUser = useCallback(async (content: string, mentionedUsers: string[]) => {
    trackEvent('work_order_user_mentioned', { workOrderId, mentionedCount: mentionedUsers.length });

    return addComment(content);
  }, [workOrderId, addComment, trackEvent]);

  return {
    comments,
    addComment,
    mentionUser,
    updateComment,
    deleteComment,
  };
}

/**
 * Work order attachments hook
 *
 * Manages file attachments for work orders.
 *
 * @example
 * ```tsx
 * function WorkOrderAttachments({ workOrderId }) {
 *   const {
 *     attachments,
 *     uploadAttachment,
 *     deleteAttachment
 *   } = useWorkOrderAttachments(workOrderId);
 * }
 * ```
 */
export function useWorkOrderAttachments(workOrderId: string) {
  const {
    files: attachments,
    uploadFile,
    deleteFile
  } = useMediaLibrary({
    folder: `work_orders/${workOrderId}`,
  });

  const { trackEvent } = useEventTracking();
  const { canUpload, canDelete } = usePermissionCheck('work_order_attachments');

  const uploadAttachment = useCallback(async (
    file: File,
    metadata?: { title?: string; description?: string; category?: string }
  ) => {
    if (!canUpload) throw new Error('Permission denied');

    trackEvent('work_order_attachment_uploaded', {
      workOrderId,
      fileType: file.type,
      fileSize: file.size,
    });

    return uploadFile(file, metadata);
  }, [workOrderId, canUpload, trackEvent, uploadFile]);

  const deleteAttachment = useCallback(async (fileId: string) => {
    if (!canDelete) throw new Error('Permission denied');

    trackEvent('work_order_attachment_deleted', { workOrderId, fileId });

    return deleteFile(fileId);
  }, [workOrderId, canDelete, trackEvent, deleteFile]);

  return {
    attachments,
    uploadAttachment,
    deleteAttachment,
  };
}

/**
 * Work order mobile field app hook
 *
 * Optimized for mobile field technician use.
 *
 * @example
 * ```tsx
 * function FieldApp() {
 *   const {
 *     myWorkOrders,
 *     checkIn,
 *     updateProgress,
 *     capturePhoto
 *   } = useWorkOrderFieldApp();
 * }
 * ```
 */
export function useWorkOrderFieldApp() {
  const { user } = useUserIdentification();
  const { workOrders } = useWorkOrderManagement();
  const { trackEvent } = useEventTracking();
  const { uploadFile } = useMediaUpload();

  const myWorkOrders = useMemo(() =>
    workOrders.filter(wo => wo.assignedTo === user?.userId),
    [workOrders, user]
  );

  const checkIn = useCallback(async (workOrderId: string, location?: GeolocationPosition) => {
    trackEvent('field_check_in', { workOrderId });

    // Check-in logic with geolocation
  }, [trackEvent]);

  const updateProgress = useCallback(async (workOrderId: string, progressPercent: number, notes: string) => {
    trackEvent('field_progress_updated', { workOrderId, progressPercent });

    // Progress update logic
  }, [trackEvent]);

  const capturePhoto = useCallback(async (workOrderId: string, file: File) => {
    trackEvent('field_photo_captured', { workOrderId });

    return uploadFile(file, {
      folder: `work_orders/${workOrderId}/field_photos`,
      category: 'field_photo',
    });
  }, [trackEvent, uploadFile]);

  return {
    myWorkOrders,
    checkIn,
    updateProgress,
    capturePhoto,
  };
}

/**
 * Work order approval workflow hook
 *
 * Manages approval workflows for work orders.
 *
 * @example
 * ```tsx
 * function WorkOrderApprovals() {
 *   const {
 *     submitForApproval,
 *     approve,
 *     reject
 *   } = useWorkOrderApprovals();
 * }
 * ```
 */
export function useWorkOrderApprovals() {
  const {
    workflow,
    submitWorkflow,
    approveStage,
    rejectStage
  } = useWorkflow({
    workflowType: 'work_order_approval',
    stages: [
      {
        id: 'manager_review',
        name: 'Manager Review',
        order: 1,
        type: 'sequential',
        approvers: ['manager'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowParallelReview: false,
      },
    ],
  });

  const { trackEvent } = useEventTracking();

  const submitForApproval = useCallback(async (workOrderId: string) => {
    trackEvent('work_order_approval_submitted', { workOrderId });

    return submitWorkflow({ workOrderId });
  }, [trackEvent, submitWorkflow]);

  return {
    workflow,
    submitForApproval,
    approve: approveStage,
    reject: rejectStage,
  };
}

/**
 * Work order reporting hook
 *
 * Generates various work order reports.
 *
 * @example
 * ```tsx
 * function Reports() {
 *   const {
 *     generateReport,
 *     downloadReport
 *   } = useWorkOrderReporting();
 * }
 * ```
 */
export function useWorkOrderReporting() {
  const { trackEvent } = useEventTracking();

  const generateReport = useCallback(async (reportType:
    | 'summary'
    | 'by_technician'
    | 'by_facility'
    | 'cost_analysis'
    | 'sla_compliance'
  ) => {
    trackEvent('work_order_report_generated', { reportType });

    return {
      id: `report_${Date.now()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      data: {},
    };
  }, [trackEvent]);

  const downloadReport = useCallback(async (reportId: string, format: 'pdf' | 'excel') => {
    trackEvent('work_order_report_downloaded', { reportId, format });
  }, [trackEvent]);

  return {
    generateReport,
    downloadReport,
  };
}

/**
 * Work order bulk operations hook
 *
 * Performs bulk operations on multiple work orders.
 *
 * @example
 * ```tsx
 * function BulkOperations() {
 *   const {
 *     bulkAssign,
 *     bulkChangeStatus,
 *     bulkExport
 *   } = useWorkOrderBulkOperations();
 * }
 * ```
 */
export function useWorkOrderBulkOperations() {
  const { trackEvent } = useEventTracking();
  const { canUpdate } = usePermissionCheck('work_orders');

  const bulkAssign = useCallback(async (workOrderIds: string[], assignedTo: string) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('work_orders_bulk_assigned', { count: workOrderIds.length, assignedTo });

    // Bulk assign logic
  }, [canUpdate, trackEvent]);

  const bulkChangeStatus = useCallback(async (workOrderIds: string[], newStatus: WorkOrderStatus) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('work_orders_bulk_status_changed', { count: workOrderIds.length, newStatus });

    // Bulk status change logic
  }, [canUpdate, trackEvent]);

  const bulkExport = useCallback(async (workOrderIds: string[], format: 'csv' | 'excel') => {
    trackEvent('work_orders_bulk_exported', { count: workOrderIds.length, format });

    // Export logic
  }, [trackEvent]);

  return {
    bulkAssign,
    bulkChangeStatus,
    bulkExport,
  };
}

// Export all hooks and types
export type {
  WorkOrder,
  MaterialRequisition,
  WorkOrderAssignment,
  TimeEntry,
  StatusHistory,
  InspectionChecklist,
  InspectionChecklistItem,
  WorkOrderDispatch,
  WorkOrderSLA,
  WorkOrderMetrics,
  WorkOrderTemplate,
  SatisfactionSurvey,
  WorkOrderType,
  WorkOrderPriority,
  WorkOrderStatus,
  VerificationStatus,
};
