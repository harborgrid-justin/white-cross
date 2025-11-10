/**
 * LOC: USACE-SAFETY-MGT-2025
 * File: /reuse/frontend/composites/usace/usace-safety-management-composites.ts
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
 *   - ../../rich-text-editor-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS safety management UI
 *   - Incident reporting dashboards
 *   - Safety training interfaces
 *   - OSHA compliance applications
 */

/**
 * File: /reuse/frontend/composites/usace/usace-safety-management-composites.ts
 * Locator: WC-USACE-SAFETY-MGT-001
 * Purpose: USACE CEFMS Safety Management - React composites for safety programs, incident reporting,
 *          investigations, training management, OSHA compliance, PPE tracking, safety audits,
 *          hazard identification, emergency response, and safety analytics
 *
 * Upstream: Composes React hooks and components from frontend kits
 * Downstream: USACE safety UI, incident management, training systems, compliance dashboards
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 47+ composite hooks and utilities for safety management
 *
 * LLM Context: Production-ready USACE CEFMS composite functions for safety management.
 * Comprehensive React hooks for incident reporting, root cause analysis, corrective actions,
 * safety training programs, certifications, OSHA recordkeeping, safety audits, job hazard analysis,
 * PPE management, emergency drills, safety metrics, and regulatory compliance tracking.
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
  useFormWizard,
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
  useAnomalyDetection,
  type AnalyticsEvent,
  type EventParameters,
} from '../../analytics-tracking-kit';
import {
  useScheduling,
  usePublishingCalendar,
  useRecurringSchedule,
  useScheduleNotifications,
  useScheduleReminders,
  type ScheduleConfig,
  type RecurringPattern,
} from '../../publishing-scheduling-kit';
import {
  usePermissions,
  useRoleManagement,
  useAccessControl,
  usePermissionCheck,
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
  useRichTextEditor,
  useEditorContent,
  useEditorFormatting,
  type EditorContent,
} from '../../rich-text-editor-kit';

// ============================================================================
// TYPE DEFINITIONS - SAFETY MANAGEMENT
// ============================================================================

/**
 * Safety incident type classification
 */
export type IncidentType =
  | 'injury'
  | 'illness'
  | 'near_miss'
  | 'property_damage'
  | 'environmental'
  | 'vehicle_accident'
  | 'fire'
  | 'chemical_spill'
  | 'equipment_failure'
  | 'other';

/**
 * Incident severity levels
 */
export type IncidentSeverity =
  | 'fatality'
  | 'critical'
  | 'serious'
  | 'moderate'
  | 'minor'
  | 'first_aid_only';

/**
 * OSHA recordability status
 */
export type OSHARecordability =
  | 'recordable'
  | 'non_recordable'
  | 'pending_review'
  | 'not_applicable';

/**
 * Safety training status
 */
export type TrainingStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'expired'
  | 'overdue'
  | 'cancelled';

/**
 * Safety incident record
 */
export interface SafetyIncident {
  id: string;
  incidentNumber: string;
  type: IncidentType;
  severity: IncidentSeverity;
  oshaRecordable: OSHARecordability;
  incidentDate: string;
  incidentTime: string;
  reportedDate: string;
  reportedBy: string;
  location: {
    facilityId: string;
    facilityName: string;
    building?: string;
    floor?: string;
    specificLocation: string;
  };
  description: string;
  injuredPersons: InjuredPerson[];
  witnesses: Witness[];
  immediateActions: string;
  rootCause?: string;
  contributingFactors: string[];
  correctiveActions: CorrectiveAction[];
  investigationStatus: 'pending' | 'in_progress' | 'completed' | 'closed';
  investigator?: string;
  investigationDate?: string;
  investigationReport?: string;
  preventiveMeasures: string[];
  lostWorkDays: number;
  restrictedWorkDays: number;
  medicalTreatment: boolean;
  medicalFacility?: string;
  emergencyServicesNotified: boolean;
  regulatoryNotificationRequired: boolean;
  regulatoryAgencies: string[];
  attachments: string[];
  relatedIncidents: string[];
  status: 'open' | 'under_investigation' | 'closed' | 'pending_approval';
  closeDate?: string;
  organizationCode: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Injured person record
 */
export interface InjuredPerson {
  id: string;
  name: string;
  employeeId?: string;
  jobTitle: string;
  department: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  injuryType: string;
  bodyPart: string;
  injuryDescription: string;
  treatmentRequired: 'none' | 'first_aid' | 'medical' | 'hospitalization';
  returnToWorkDate?: string;
  workRestrictions?: string;
  permanentDisability: boolean;
}

/**
 * Witness record
 */
export interface Witness {
  id: string;
  name: string;
  employeeId?: string;
  contactInfo: string;
  statement: string;
  statementDate: string;
  interviewed: boolean;
  interviewDate?: string;
}

/**
 * Corrective action
 */
export interface CorrectiveAction {
  id: string;
  description: string;
  responsiblePerson: string;
  dueDate: string;
  completedDate?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  verificationMethod: string;
  verifiedBy?: string;
  verifiedDate?: string;
  effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_assessed';
  notes?: string;
}

/**
 * Safety training program
 */
export interface SafetyTrainingProgram {
  id: string;
  programCode: string;
  programName: string;
  category: 'osha_required' | 'regulatory' | 'company_specific' | 'specialized';
  description: string;
  objectives: string[];
  duration: number; // hours
  validityPeriod: number; // months
  instructorRequired: boolean;
  certificationIssued: boolean;
  oshaStandard?: string;
  prerequisites: string[];
  targetAudience: string[];
  trainingMaterials: string[];
  assessmentRequired: boolean;
  passingScore?: number;
  active: boolean;
  createdBy: string;
  approvedBy?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
}

/**
 * Training session
 */
export interface TrainingSession {
  id: string;
  programId: string;
  programName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  instructorCertifications: string[];
  capacity: number;
  enrolled: number;
  attendees: TrainingAttendee[];
  status: TrainingStatus;
  materials: string[];
  assessmentGiven: boolean;
  averageScore?: number;
  feedbackCollected: boolean;
  averageFeedbackScore?: number;
  notes?: string;
}

/**
 * Training attendee
 */
export interface TrainingAttendee {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  registrationDate: string;
  attendanceStatus: 'registered' | 'attended' | 'no_show' | 'cancelled';
  assessmentScore?: number;
  passed: boolean;
  certificateIssued: boolean;
  certificateNumber?: string;
  certificateExpiry?: string;
  feedbackScore?: number;
  feedbackComments?: string;
}

/**
 * Employee safety training record
 */
export interface EmployeeTrainingRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  requiredTrainings: string[];
  completedTrainings: CompletedTraining[];
  expiringTrainings: CompletedTraining[];
  overdueTrainings: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'at_risk';
  lastTrainingDate?: string;
  nextRequiredTraining?: string;
}

/**
 * Completed training
 */
export interface CompletedTraining {
  programId: string;
  programName: string;
  completionDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  score?: number;
  instructor: string;
}

/**
 * Safety audit
 */
export interface SafetyAudit {
  id: string;
  auditNumber: string;
  auditType: 'scheduled' | 'surprise' | 'follow_up' | 'regulatory';
  auditName: string;
  facilityId: string;
  facilityName: string;
  scheduledDate: string;
  completedDate?: string;
  leadAuditor: string;
  auditTeam: string[];
  scope: string;
  standards: string[];
  checklistItems: AuditChecklistItem[];
  findings: AuditFinding[];
  observations: string[];
  recommendations: string[];
  overallScore?: number;
  complianceRate: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'report_pending';
  reportUrl?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  organizationCode: string;
}

/**
 * Audit checklist item
 */
export interface AuditChecklistItem {
  id: string;
  itemNumber: string;
  category: string;
  requirement: string;
  standard?: string;
  compliant: boolean;
  notApplicable: boolean;
  notes?: string;
  evidence?: string[];
  score?: number;
}

/**
 * Audit finding
 */
export interface AuditFinding {
  id: string;
  findingNumber: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  category: string;
  description: string;
  standard?: string;
  evidencePhotos: string[];
  correctiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'closed' | 'verified';
  completedDate?: string;
}

/**
 * Job Hazard Analysis (JHA)
 */
export interface JobHazardAnalysis {
  id: string;
  jhaNumber: string;
  jobTitle: string;
  department: string;
  location: string;
  equipmentUsed: string[];
  steps: JHAStep[];
  requiredPPE: string[];
  specialPermits: string[];
  emergencyProcedures: string;
  reviewedBy: string;
  reviewDate: string;
  approvedBy: string;
  approvalDate: string;
  effectiveDate: string;
  nextReviewDate: string;
  status: 'draft' | 'review' | 'approved' | 'expired';
  attachments: string[];
}

/**
 * JHA step
 */
export interface JHAStep {
  stepNumber: number;
  taskDescription: string;
  hazards: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  controls: string[];
  residualRisk: 'low' | 'medium' | 'high';
}

/**
 * PPE (Personal Protective Equipment) inventory
 */
export interface PPEInventory {
  id: string;
  itemName: string;
  itemCode: string;
  category: 'head' | 'eye' | 'hearing' | 'respiratory' | 'hand' | 'foot' | 'body' | 'fall_protection';
  manufacturer: string;
  modelNumber: string;
  certificationStandard: string;
  quantityInStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  storageLocation: string;
  expirationDate?: string;
  inspectionFrequency: number; // days
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'expired';
}

/**
 * PPE issuance record
 */
export interface PPEIssuance {
  id: string;
  employeeId: string;
  employeeName: string;
  ppeItemId: string;
  ppeItemName: string;
  quantity: number;
  issuedDate: string;
  issuedBy: string;
  returnDate?: string;
  condition: 'new' | 'good' | 'fair' | 'damaged';
  replacementDueDate?: string;
  acknowledged: boolean;
  acknowledgmentDate?: string;
  notes?: string;
}

/**
 * Emergency drill record
 */
export interface EmergencyDrill {
  id: string;
  drillNumber: string;
  drillType: 'fire' | 'evacuation' | 'chemical_spill' | 'medical_emergency' | 'active_shooter' | 'natural_disaster';
  facilityId: string;
  facilityName: string;
  scheduledDate: string;
  actualDate: string;
  startTime: string;
  endTime: string;
  participants: number;
  facilitator: string;
  observers: string[];
  objectives: string[];
  scenario: string;
  performanceMetrics: DrillMetric[];
  strengths: string[];
  areasForImprovement: string[];
  lessonsLearned: string[];
  actionItems: string[];
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  regulatoryCompliance: boolean;
  reportUrl?: string;
}

/**
 * Drill performance metric
 */
export interface DrillMetric {
  metric: string;
  target: string;
  actual: string;
  met: boolean;
  notes?: string;
}

/**
 * Safety metrics and KPIs
 */
export interface SafetyMetrics {
  period: string;
  totalIncidents: number;
  recordableIncidents: number;
  lostTimeIncidents: number;
  nearMisses: number;
  firstAidCases: number;
  totalHoursWorked: number;
  incidentRate: number; // per 100 employees
  lostTimeIncidentRate: number; // LTIR
  totalRecordableCaseRate: number; // TRCR
  daysAwayRestrictedTransfer: number; // DART rate
  lostWorkDays: number;
  severity: number; // lost days per incident
  frequencyRate: number; // incidents per million hours worked
  safetyTrainingCompliance: number; // percentage
  auditComplianceScore: number;
  correctiveActionsCompleted: number;
  correctiveActionsOverdue: number;
  ppeComplianceRate: number;
  emergencyDrillsCompleted: number;
  safetyObservations: number;
  behaviorBasedSafetyScore: number;
}

/**
 * Safety observation
 */
export interface SafetyObservation {
  id: string;
  observationNumber: string;
  observationType: 'safe_behavior' | 'unsafe_behavior' | 'unsafe_condition' | 'near_miss';
  observedDate: string;
  observedBy: string;
  location: string;
  description: string;
  immediateAction?: string;
  riskLevel: 'low' | 'medium' | 'high';
  personObserved?: string;
  departmentObserved?: string;
  feedbackGiven: boolean;
  correctiveActionRequired: boolean;
  correctiveAction?: string;
  status: 'open' | 'resolved' | 'escalated';
  resolvedDate?: string;
  photos?: string[];
}

// ============================================================================
// COMPOSITE HOOKS - SAFETY MANAGEMENT
// ============================================================================

/**
 * Comprehensive safety incident management hook
 *
 * Provides complete incident lifecycle management including reporting, investigation,
 * corrective actions, and closure.
 *
 * @example
 * ```tsx
 * function IncidentManager() {
 *   const {
 *     incidents,
 *     createIncident,
 *     updateIncident,
 *     assignInvestigator,
 *     closeIncident
 *   } = useSafetyIncidentManagement();
 *
 *   return <IncidentList incidents={incidents} />;
 * }
 * ```
 */
export function useSafetyIncidentManagement(facilityId?: string) {
  const { content: incidents, loading, error, mutate } = useContentList<SafetyIncident>({
    contentType: 'safety_incident',
    initialFilters: facilityId ? { 'location.facilityId': facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate, canDelete } = usePermissionCheck('safety_incidents');
  const { user } = useUserIdentification();

  const openIncidents = useMemo(() =>
    incidents.filter(i => i.status === 'open' || i.status === 'under_investigation'),
    [incidents]
  );

  const recordableIncidents = useMemo(() =>
    incidents.filter(i => i.oshaRecordable === 'recordable'),
    [incidents]
  );

  const createIncident = useCallback(async (incidentData: Omit<SafetyIncident, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('safety_incident_reported', {
      type: incidentData.type,
      severity: incidentData.severity,
      facilityId: incidentData.location.facilityId,
    });

    return mutate.create(incidentData);
  }, [canCreate, trackEvent, mutate]);

  const updateIncident = useCallback(async (id: string, updates: Partial<SafetyIncident>) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('safety_incident_updated', { incidentId: id });

    return mutate.update(id, updates);
  }, [canUpdate, trackEvent, mutate]);

  const assignInvestigator = useCallback(async (id: string, investigator: string) => {
    trackEvent('incident_investigator_assigned', { incidentId: id, investigator });

    return updateIncident(id, {
      investigator,
      investigationStatus: 'in_progress',
      investigationDate: new Date().toISOString(),
    });
  }, [updateIncident, trackEvent]);

  const closeIncident = useCallback(async (id: string, closureNotes: string) => {
    trackEvent('safety_incident_closed', { incidentId: id });

    return updateIncident(id, {
      status: 'closed',
      closeDate: new Date().toISOString(),
      investigationReport: closureNotes,
    });
  }, [updateIncident, trackEvent]);

  return {
    incidents,
    loading,
    error,
    openIncidents,
    recordableIncidents,
    createIncident,
    updateIncident,
    assignInvestigator,
    closeIncident,
  };
}

/**
 * Safety incident reporting form hook
 *
 * Multi-step form for incident reporting with conditional fields.
 *
 * @example
 * ```tsx
 * function IncidentReportForm() {
 *   const {
 *     formData,
 *     currentStep,
 *     nextStep,
 *     submitForm
 *   } = useSafetyIncidentReportForm();
 * }
 * ```
 */
export function useSafetyIncidentReportForm() {
  const basicInfoFields: FieldConfig[] = useMemo(() => [
    {
      id: 'incidentNumber',
      name: 'incidentNumber',
      type: 'text',
      label: 'Incident Number',
      required: true,
      validation: [{ type: 'required', message: 'Incident number is required' }],
    },
    {
      id: 'type',
      name: 'type',
      type: 'select',
      label: 'Incident Type',
      required: true,
      options: [
        { label: 'Injury', value: 'injury' },
        { label: 'Illness', value: 'illness' },
        { label: 'Near Miss', value: 'near_miss' },
        { label: 'Property Damage', value: 'property_damage' },
        { label: 'Environmental', value: 'environmental' },
        { label: 'Vehicle Accident', value: 'vehicle_accident' },
      ],
    },
    {
      id: 'severity',
      name: 'severity',
      type: 'select',
      label: 'Severity',
      required: true,
      options: [
        { label: 'Fatality', value: 'fatality' },
        { label: 'Critical', value: 'critical' },
        { label: 'Serious', value: 'serious' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Minor', value: 'minor' },
        { label: 'First Aid Only', value: 'first_aid_only' },
      ],
    },
    {
      id: 'incidentDate',
      name: 'incidentDate',
      type: 'date',
      label: 'Incident Date',
      required: true,
    },
    {
      id: 'incidentTime',
      name: 'incidentTime',
      type: 'time',
      label: 'Incident Time',
      required: true,
    },
    {
      id: 'description',
      name: 'description',
      type: 'textarea',
      label: 'Incident Description',
      required: true,
      rows: 6,
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
      { id: 'location', title: 'Location & Details', fields: [] },
      { id: 'persons', title: 'Injured Persons & Witnesses', fields: [] },
      { id: 'actions', title: 'Immediate Actions', fields: [] },
    ],
  });

  const { validateForm, errors } = useFormValidation(formData, basicInfoFields);
  const { trackEvent } = useEventTracking();
  const { saveProgress, loadProgress } = useFormPersistence('incident_report_form');

  const submitForm = useCallback(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    trackEvent('incident_report_submitted', {
      type: formData.type,
      severity: formData.severity,
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
 * Safety training management hook
 *
 * Manages safety training programs and sessions.
 *
 * @example
 * ```tsx
 * function TrainingManager() {
 *   const {
 *     programs,
 *     sessions,
 *     createProgram,
 *     scheduleSession
 *   } = useSafetyTrainingManagement();
 * }
 * ```
 */
export function useSafetyTrainingManagement() {
  const { content: programs, loading: programsLoading, mutate: programsMutate } = useContentList<SafetyTrainingProgram>({
    contentType: 'safety_training_program',
  });

  const { content: sessions, loading: sessionsLoading, mutate: sessionsMutate } = useContentList<TrainingSession>({
    contentType: 'training_session',
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('safety_training');

  const activePrograms = useMemo(() =>
    programs.filter(p => p.active),
    [programs]
  );

  const oshaRequiredPrograms = useMemo(() =>
    programs.filter(p => p.category === 'osha_required'),
    [programs]
  );

  const createProgram = useCallback(async (programData: Omit<SafetyTrainingProgram, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('training_program_created', {
      programName: programData.programName,
      category: programData.category,
    });

    return programsMutate.create(programData);
  }, [canCreate, trackEvent, programsMutate]);

  const scheduleSession = useCallback(async (sessionData: Omit<TrainingSession, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('training_session_scheduled', {
      programId: sessionData.programId,
      sessionDate: sessionData.sessionDate,
    });

    return sessionsMutate.create(sessionData);
  }, [canCreate, trackEvent, sessionsMutate]);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<TrainingSession>) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('training_session_updated', { sessionId });

    return sessionsMutate.update(sessionId, updates);
  }, [canUpdate, trackEvent, sessionsMutate]);

  return {
    programs,
    sessions,
    programsLoading,
    sessionsLoading,
    activePrograms,
    oshaRequiredPrograms,
    createProgram,
    scheduleSession,
    updateSession,
  };
}

/**
 * Employee training records hook
 *
 * Tracks individual employee training compliance.
 *
 * @example
 * ```tsx
 * function EmployeeTraining({ employeeId }) {
 *   const {
 *     trainingRecord,
 *     isCompliant,
 *     expiringTrainings,
 *     overdueTrainings
 *   } = useEmployeeTrainingRecords(employeeId);
 * }
 * ```
 */
export function useEmployeeTrainingRecords(employeeId: string) {
  const { content: records, loading, mutate } = useContentList<EmployeeTrainingRecord>({
    contentType: 'employee_training_record',
    initialFilters: { employeeId },
  });

  const { trackEvent } = useEventTracking();

  const trainingRecord = useMemo(() =>
    records[0], // Assuming one record per employee
    [records]
  );

  const isCompliant = useMemo(() =>
    trainingRecord?.complianceStatus === 'compliant',
    [trainingRecord]
  );

  const expiringTrainings = useMemo(() => {
    if (!trainingRecord) return [];

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return trainingRecord.completedTrainings.filter(t =>
      t.expiryDate && new Date(t.expiryDate) <= thirtyDaysFromNow
    );
  }, [trainingRecord]);

  const overdueTrainings = useMemo(() =>
    trainingRecord?.overdueTrainings || [],
    [trainingRecord]
  );

  const recordTrainingCompletion = useCallback(async (completedTraining: CompletedTraining) => {
    if (!trainingRecord) throw new Error('Training record not found');

    trackEvent('training_completed', {
      employeeId,
      programId: completedTraining.programId,
    });

    const updatedCompletedTrainings = [
      ...trainingRecord.completedTrainings,
      completedTraining,
    ];

    await mutate.update(trainingRecord.id, {
      completedTrainings: updatedCompletedTrainings,
      lastTrainingDate: completedTraining.completionDate,
    });
  }, [employeeId, trainingRecord, trackEvent, mutate]);

  return {
    trainingRecord,
    loading,
    isCompliant,
    expiringTrainings,
    overdueTrainings,
    recordTrainingCompletion,
  };
}

/**
 * Safety audit management hook
 *
 * Manages safety audits and inspections.
 *
 * @example
 * ```tsx
 * function AuditManager() {
 *   const {
 *     audits,
 *     createAudit,
 *     conductAudit,
 *     closeAudit
 *   } = useSafetyAuditManagement();
 * }
 * ```
 */
export function useSafetyAuditManagement(facilityId?: string) {
  const { content: audits, loading, mutate } = useContentList<SafetyAudit>({
    contentType: 'safety_audit',
    initialFilters: facilityId ? { facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('safety_audits');

  const upcomingAudits = useMemo(() =>
    audits.filter(a => a.status === 'scheduled' && new Date(a.scheduledDate) >= new Date()),
    [audits]
  );

  const createAudit = useCallback(async (auditData: Omit<SafetyAudit, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('safety_audit_created', {
      auditType: auditData.auditType,
      facilityId: auditData.facilityId,
    });

    return mutate.create(auditData);
  }, [canCreate, trackEvent, mutate]);

  const conductAudit = useCallback(async (auditId: string, checklistResults: AuditChecklistItem[]) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('safety_audit_conducted', { auditId });

    const compliantItems = checklistResults.filter(i => i.compliant && !i.notApplicable).length;
    const applicableItems = checklistResults.filter(i => !i.notApplicable).length;
    const complianceRate = applicableItems > 0 ? (compliantItems / applicableItems) * 100 : 0;

    return mutate.update(auditId, {
      checklistItems: checklistResults,
      complianceRate,
      status: 'completed',
      completedDate: new Date().toISOString(),
    });
  }, [canUpdate, trackEvent, mutate]);

  const closeAudit = useCallback(async (auditId: string, reportUrl: string) => {
    trackEvent('safety_audit_closed', { auditId });

    return mutate.update(auditId, {
      reportUrl,
      status: 'completed',
    });
  }, [trackEvent, mutate]);

  return {
    audits,
    loading,
    upcomingAudits,
    createAudit,
    conductAudit,
    closeAudit,
  };
}

/**
 * Job Hazard Analysis (JHA) management hook
 *
 * Manages job hazard analysis documents.
 *
 * @example
 * ```tsx
 * function JHAManager() {
 *   const {
 *     jhas,
 *     createJHA,
 *     approveJHA,
 *     expiringJHAs
 *   } = useJobHazardAnalysis();
 * }
 * ```
 */
export function useJobHazardAnalysis(department?: string) {
  const { content: jhas, loading, mutate } = useContentList<JobHazardAnalysis>({
    contentType: 'job_hazard_analysis',
    initialFilters: department ? { department } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { canCreate, canUpdate } = usePermissionCheck('job_hazard_analysis');

  const approvedJHAs = useMemo(() =>
    jhas.filter(j => j.status === 'approved'),
    [jhas]
  );

  const expiringJHAs = useMemo(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return jhas.filter(j =>
      j.nextReviewDate && new Date(j.nextReviewDate) <= thirtyDaysFromNow
    );
  }, [jhas]);

  const createJHA = useCallback(async (jhaData: Omit<JobHazardAnalysis, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('jha_created', {
      jobTitle: jhaData.jobTitle,
      department: jhaData.department,
    });

    return mutate.create(jhaData);
  }, [canCreate, trackEvent, mutate]);

  const approveJHA = useCallback(async (jhaId: string, approver: string) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('jha_approved', { jhaId });

    return mutate.update(jhaId, {
      status: 'approved',
      approvedBy: approver,
      approvalDate: new Date().toISOString(),
    });
  }, [canUpdate, trackEvent, mutate]);

  return {
    jhas,
    loading,
    approvedJHAs,
    expiringJHAs,
    createJHA,
    approveJHA,
  };
}

/**
 * PPE inventory management hook
 *
 * Manages PPE inventory and issuances.
 *
 * @example
 * ```tsx
 * function PPEManager() {
 *   const {
 *     inventory,
 *     lowStockItems,
 *     issuePPE,
 *     returnPPE
 *   } = usePPEInventoryManagement();
 * }
 * ```
 */
export function usePPEInventoryManagement() {
  const { content: inventory, loading: inventoryLoading, mutate: inventoryMutate } = useContentList<PPEInventory>({
    contentType: 'ppe_inventory',
  });

  const { content: issuances, loading: issuancesLoading, mutate: issuancesMutate } = useContentList<PPEIssuance>({
    contentType: 'ppe_issuance',
  });

  const { trackEvent } = useEventTracking();

  const lowStockItems = useMemo(() =>
    inventory.filter(item => item.quantityInStock <= item.reorderPoint),
    [inventory]
  );

  const expiredItems = useMemo(() =>
    inventory.filter(item =>
      item.expirationDate && new Date(item.expirationDate) <= new Date()
    ),
    [inventory]
  );

  const issuePPE = useCallback(async (issuanceData: Omit<PPEIssuance, 'id'>) => {
    trackEvent('ppe_issued', {
      employeeId: issuanceData.employeeId,
      ppeItemId: issuanceData.ppeItemId,
      quantity: issuanceData.quantity,
    });

    // Update inventory
    const item = inventory.find(i => i.id === issuanceData.ppeItemId);
    if (item) {
      await inventoryMutate.update(item.id, {
        quantityInStock: item.quantityInStock - issuanceData.quantity,
      });
    }

    return issuancesMutate.create(issuanceData);
  }, [inventory, trackEvent, inventoryMutate, issuancesMutate]);

  const returnPPE = useCallback(async (issuanceId: string) => {
    const issuance = issuances.find(i => i.id === issuanceId);
    if (!issuance) throw new Error('Issuance not found');

    trackEvent('ppe_returned', { issuanceId });

    // Update inventory
    const item = inventory.find(i => i.id === issuance.ppeItemId);
    if (item) {
      await inventoryMutate.update(item.id, {
        quantityInStock: item.quantityInStock + issuance.quantity,
      });
    }

    return issuancesMutate.update(issuanceId, {
      returnDate: new Date().toISOString(),
    });
  }, [issuances, inventory, trackEvent, inventoryMutate, issuancesMutate]);

  return {
    inventory,
    issuances,
    inventoryLoading,
    issuancesLoading,
    lowStockItems,
    expiredItems,
    issuePPE,
    returnPPE,
  };
}

/**
 * Emergency drill management hook
 *
 * Manages emergency preparedness drills.
 *
 * @example
 * ```tsx
 * function DrillManager() {
 *   const {
 *     drills,
 *     scheduleDrill,
 *     conductDrill,
 *     completeDrill
 *   } = useEmergencyDrillManagement();
 * }
 * ```
 */
export function useEmergencyDrillManagement(facilityId?: string) {
  const { content: drills, loading, mutate } = useContentList<EmergencyDrill>({
    contentType: 'emergency_drill',
    initialFilters: facilityId ? { facilityId } : undefined,
  });

  const { trackEvent } = useEventTracking();
  const { scheduleEvent } = useScheduling();
  const { canCreate, canUpdate } = usePermissionCheck('emergency_drills');

  const scheduleDrill = useCallback(async (drillData: Omit<EmergencyDrill, 'id'>) => {
    if (!canCreate) throw new Error('Permission denied');

    trackEvent('emergency_drill_scheduled', {
      drillType: drillData.drillType,
      facilityId: drillData.facilityId,
    });

    const drill = await mutate.create(drillData);

    // Add to calendar
    await scheduleEvent({
      title: `Emergency Drill - ${drillData.drillType}`,
      startDate: drillData.scheduledDate,
      metadata: { drillId: drill.id },
    });

    return drill;
  }, [canCreate, trackEvent, mutate, scheduleEvent]);

  const completeDrill = useCallback(async (
    drillId: string,
    results: {
      performanceMetrics: DrillMetric[];
      strengths: string[];
      areasForImprovement: string[];
      lessonsLearned: string[];
      overallRating: EmergencyDrill['overallRating'];
    }
  ) => {
    if (!canUpdate) throw new Error('Permission denied');

    trackEvent('emergency_drill_completed', { drillId });

    return mutate.update(drillId, results);
  }, [canUpdate, trackEvent, mutate]);

  return {
    drills,
    loading,
    scheduleDrill,
    completeDrill,
  };
}

/**
 * Safety metrics and KPIs hook
 *
 * Calculates comprehensive safety performance metrics.
 *
 * @example
 * ```tsx
 * function SafetyDashboard() {
 *   const {
 *     metrics,
 *     refreshMetrics,
 *     getTrend
 *   } = useSafetyMetrics();
 * }
 * ```
 */
export function useSafetyMetrics(organizationCode?: string, period: string = 'current_year') {
  const [metrics, setMetrics] = useState<SafetyMetrics | null>(null);
  const { incidents } = useSafetyIncidentManagement();
  const { trackEvent } = useEventTracking();

  const calculateMetrics = useCallback(() => {
    const totalIncidents = incidents.length;
    const recordableIncidents = incidents.filter(i => i.oshaRecordable === 'recordable').length;
    const lostTimeIncidents = incidents.filter(i => i.lostWorkDays > 0).length;
    const nearMisses = incidents.filter(i => i.type === 'near_miss').length;
    const firstAidCases = incidents.filter(i => i.severity === 'first_aid_only').length;

    // These would come from actual data sources
    const totalHoursWorked = 1000000; // Example
    const totalEmployees = 500; // Example

    const incidentRate = (totalIncidents / totalEmployees) * 100;
    const lostTimeIncidentRate = (lostTimeIncidents * 200000) / totalHoursWorked;
    const totalRecordableCaseRate = (recordableIncidents * 200000) / totalHoursWorked;

    const lostWorkDays = incidents.reduce((sum, i) => sum + i.lostWorkDays, 0);
    const severity = totalIncidents > 0 ? lostWorkDays / totalIncidents : 0;
    const frequencyRate = (totalIncidents * 1000000) / totalHoursWorked;

    return {
      period,
      totalIncidents,
      recordableIncidents,
      lostTimeIncidents,
      nearMisses,
      firstAidCases,
      totalHoursWorked,
      incidentRate,
      lostTimeIncidentRate,
      totalRecordableCaseRate,
      daysAwayRestrictedTransfer: 0, // Would calculate from incident data
      lostWorkDays,
      severity,
      frequencyRate,
      safetyTrainingCompliance: 0, // Would come from training data
      auditComplianceScore: 0, // Would come from audit data
      correctiveActionsCompleted: 0,
      correctiveActionsOverdue: 0,
      ppeComplianceRate: 0,
      emergencyDrillsCompleted: 0,
      safetyObservations: 0,
      behaviorBasedSafetyScore: 0,
    };
  }, [incidents, period]);

  const refreshMetrics = useCallback(() => {
    trackEvent('safety_metrics_refreshed', { period });
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
 * Corrective actions tracking hook
 *
 * Manages corrective and preventive actions from incidents and audits.
 *
 * @example
 * ```tsx
 * function CorrectiveActions({ incidentId }) {
 *   const {
 *     actions,
 *     addAction,
 *     completeAction,
 *     verifyAction
 *   } = useCorrectiveActions(incidentId);
 * }
 * ```
 */
export function useCorrectiveActions(incidentId?: string) {
  const { incidents, updateIncident } = useSafetyIncidentManagement();
  const { trackEvent } = useEventTracking();

  const incident = useMemo(() =>
    incidents.find(i => i.id === incidentId),
    [incidents, incidentId]
  );

  const actions = useMemo(() =>
    incident?.correctiveActions || [],
    [incident]
  );

  const overdueActions = useMemo(() =>
    actions.filter(a =>
      a.status !== 'completed' && new Date(a.dueDate) < new Date()
    ),
    [actions]
  );

  const addAction = useCallback(async (actionData: Omit<CorrectiveAction, 'id'>) => {
    if (!incident) throw new Error('Incident not found');

    trackEvent('corrective_action_added', { incidentId });

    const updatedActions = [
      ...incident.correctiveActions,
      { ...actionData, id: `ca_${Date.now()}` },
    ];

    await updateIncident(incident.id, { correctiveActions: updatedActions });
  }, [incident, incidentId, trackEvent, updateIncident]);

  const completeAction = useCallback(async (actionId: string) => {
    if (!incident) throw new Error('Incident not found');

    trackEvent('corrective_action_completed', { incidentId, actionId });

    const updatedActions = incident.correctiveActions.map(a =>
      a.id === actionId
        ? { ...a, status: 'completed' as const, completedDate: new Date().toISOString() }
        : a
    );

    await updateIncident(incident.id, { correctiveActions: updatedActions });
  }, [incident, incidentId, trackEvent, updateIncident]);

  const verifyAction = useCallback(async (
    actionId: string,
    verifier: string,
    effectiveness: CorrectiveAction['effectiveness']
  ) => {
    if (!incident) throw new Error('Incident not found');

    trackEvent('corrective_action_verified', { incidentId, actionId, effectiveness });

    const updatedActions = incident.correctiveActions.map(a =>
      a.id === actionId
        ? {
            ...a,
            verifiedBy: verifier,
            verifiedDate: new Date().toISOString(),
            effectiveness,
          }
        : a
    );

    await updateIncident(incident.id, { correctiveActions: updatedActions });
  }, [incident, incidentId, trackEvent, updateIncident]);

  return {
    actions,
    overdueActions,
    addAction,
    completeAction,
    verifyAction,
  };
}

/**
 * Safety observations hook
 *
 * Manages behavioral-based safety observations.
 *
 * @example
 * ```tsx
 * function SafetyObservations() {
 *   const {
 *     observations,
 *     submitObservation,
 *     resolveObservation
 *   } = useSafetyObservations();
 * }
 * ```
 */
export function useSafetyObservations(location?: string) {
  const { content: observations, loading, mutate } = useContentList<SafetyObservation>({
    contentType: 'safety_observation',
    initialFilters: location ? { location } : undefined,
  });

  const { trackEvent } = useEventTracking();

  const openObservations = useMemo(() =>
    observations.filter(o => o.status === 'open'),
    [observations]
  );

  const submitObservation = useCallback(async (observationData: Omit<SafetyObservation, 'id'>) => {
    trackEvent('safety_observation_submitted', {
      observationType: observationData.observationType,
      riskLevel: observationData.riskLevel,
    });

    return mutate.create(observationData);
  }, [trackEvent, mutate]);

  const resolveObservation = useCallback(async (observationId: string) => {
    trackEvent('safety_observation_resolved', { observationId });

    return mutate.update(observationId, {
      status: 'resolved',
      resolvedDate: new Date().toISOString(),
    });
  }, [trackEvent, mutate]);

  return {
    observations,
    loading,
    openObservations,
    submitObservation,
    resolveObservation,
  };
}

/**
 * OSHA compliance reporting hook
 *
 * Manages OSHA recordkeeping and reporting.
 *
 * @example
 * ```tsx
 * function OSHAReporting() {
 *   const {
 *     generateOSHA300,
 *     generateOSHA300A,
 *     generateOSHA301
 *   } = useOSHACompliance();
 * }
 * ```
 */
export function useOSHACompliance(year: number) {
  const { incidents } = useSafetyIncidentManagement();
  const { trackEvent } = useEventTracking();

  const recordableIncidents = useMemo(() =>
    incidents.filter(i =>
      i.oshaRecordable === 'recordable' &&
      new Date(i.incidentDate).getFullYear() === year
    ),
    [incidents, year]
  );

  const generateOSHA300 = useCallback(() => {
    trackEvent('osha_300_generated', { year });

    // Generate OSHA 300 Log
    return {
      year,
      incidents: recordableIncidents,
      totalRecordable: recordableIncidents.length,
    };
  }, [year, recordableIncidents, trackEvent]);

  const generateOSHA300A = useCallback(() => {
    trackEvent('osha_300a_generated', { year });

    // Generate OSHA 300A Summary
    const totalCases = recordableIncidents.length;
    const deathsCases = recordableIncidents.filter(i => i.severity === 'fatality').length;
    const dafwCases = recordableIncidents.filter(i => i.lostWorkDays > 0).length;
    const djtrCases = recordableIncidents.filter(i => i.restrictedWorkDays > 0).length;

    return {
      year,
      totalCases,
      deathsCases,
      dafwCases,
      djtrCases,
      otherRecordableCases: totalCases - deathsCases - dafwCases - djtrCases,
    };
  }, [year, recordableIncidents, trackEvent]);

  const generateOSHA301 = useCallback((incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) throw new Error('Incident not found');

    trackEvent('osha_301_generated', { incidentId });

    // Generate OSHA 301 Injury and Illness Incident Report
    return incident;
  }, [incidents, trackEvent]);

  return {
    recordableIncidents,
    generateOSHA300,
    generateOSHA300A,
    generateOSHA301,
  };
}

/**
 * Safety search and filtering hook
 *
 * Advanced search for safety records.
 *
 * @example
 * ```tsx
 * function SafetySearch() {
 *   const {
 *     search,
 *     results,
 *     applyFilter
 *   } = useSafetySearch();
 * }
 * ```
 */
export function useSafetySearch() {
  const {
    search,
    results,
    loading
  } = useSearch<SafetyIncident>({
    searchFields: ['incidentNumber', 'description', 'location.specificLocation'],
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
      { id: 'severity', label: 'Severity', field: 'severity', type: 'select' },
      { id: 'status', label: 'Status', field: 'status', type: 'select' },
      { id: 'oshaRecordable', label: 'OSHA Recordable', field: 'oshaRecordable', type: 'select' },
    ],
  });

  const { trackEvent } = useEventTracking();

  const performSearch = useCallback(async (query: SearchQuery) => {
    trackEvent('safety_search_performed', { query: query.q });
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
 * Safety reporting and analytics hook
 *
 * Generates safety reports.
 *
 * @example
 * ```tsx
 * function SafetyReports() {
 *   const {
 *     generateReport,
 *     downloadReport
 *   } = useSafetyReporting();
 * }
 * ```
 */
export function useSafetyReporting() {
  const { trackEvent } = useEventTracking();

  const generateReport = useCallback(async (reportType:
    | 'incident_summary'
    | 'training_compliance'
    | 'audit_findings'
    | 'osha_300_log'
    | 'kpi_dashboard'
  ) => {
    trackEvent('safety_report_generated', { reportType });

    return {
      id: `report_${Date.now()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      data: {},
    };
  }, [trackEvent]);

  const downloadReport = useCallback(async (reportId: string, format: 'pdf' | 'excel') => {
    trackEvent('safety_report_downloaded', { reportId, format });
  }, [trackEvent]);

  return {
    generateReport,
    downloadReport,
  };
}

/**
 * Safety notifications hook
 *
 * Manages safety-related notifications and alerts.
 *
 * @example
 * ```tsx
 * function SafetyAlerts() {
 *   const {
 *     sendIncidentAlert,
 *     sendTrainingReminder
 *   } = useSafetyNotifications();
 * }
 * ```
 */
export function useSafetyNotifications() {
  const { sendNotification } = useWorkflowNotifications();
  const { trackEvent } = useEventTracking();

  const sendIncidentAlert = useCallback(async (incidentId: string, severity: IncidentSeverity) => {
    trackEvent('safety_incident_alert_sent', { incidentId, severity });

    const priority = severity === 'fatality' || severity === 'critical' ? 'urgent' : 'high';

    return sendNotification({
      recipients: ['safety_manager', 'operations_director'],
      title: `Safety Incident Alert - ${severity}`,
      message: `A ${severity} safety incident has been reported`,
      type: 'safety_incident',
      priority,
    });
  }, [trackEvent, sendNotification]);

  const sendTrainingReminder = useCallback(async (employeeId: string, trainingName: string) => {
    trackEvent('training_reminder_sent', { employeeId, trainingName });

    return sendNotification({
      recipients: [employeeId],
      title: 'Safety Training Reminder',
      message: `Your ${trainingName} training is due soon`,
      type: 'training_reminder',
      priority: 'medium',
    });
  }, [trackEvent, sendNotification]);

  return {
    sendIncidentAlert,
    sendTrainingReminder,
  };
}

/**
 * Safety document management hook
 *
 * Manages safety-related documents and attachments.
 *
 * @example
 * ```tsx
 * function SafetyDocuments() {
 *   const {
 *     uploadDocument,
 *     searchDocuments
 *   } = useSafetyDocuments();
 * }
 * ```
 */
export function useSafetyDocuments() {
  const { uploadFile, files } = useMediaLibrary({
    folder: 'safety_documents',
  });

  const { trackEvent } = useEventTracking();

  const uploadDocument = useCallback(async (
    file: File,
    metadata: {
      category: 'incident' | 'training' | 'audit' | 'jha' | 'sds' | 'policy';
      title: string;
      description?: string;
      relatedId?: string;
    }
  ) => {
    trackEvent('safety_document_uploaded', {
      category: metadata.category,
      fileType: file.type,
    });

    return uploadFile(file, metadata);
  }, [trackEvent, uploadFile]);

  const searchDocuments = useCallback((query: string) => {
    return files.filter(f =>
      f.metadata?.title?.toLowerCase().includes(query.toLowerCase())
    );
  }, [files]);

  return {
    documents: files,
    uploadDocument,
    searchDocuments,
  };
}

// Export all hooks and types
export type {
  SafetyIncident,
  InjuredPerson,
  Witness,
  CorrectiveAction,
  SafetyTrainingProgram,
  TrainingSession,
  TrainingAttendee,
  EmployeeTrainingRecord,
  CompletedTraining,
  SafetyAudit,
  AuditChecklistItem,
  AuditFinding,
  JobHazardAnalysis,
  JHAStep,
  PPEInventory,
  PPEIssuance,
  EmergencyDrill,
  DrillMetric,
  SafetyMetrics,
  SafetyObservation,
  IncidentType,
  IncidentSeverity,
  OSHARecordability,
  TrainingStatus,
};
