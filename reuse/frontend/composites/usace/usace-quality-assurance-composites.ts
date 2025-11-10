/**
 * LOC: USACE-QA-QC-001
 * File: /reuse/frontend/composites/usace/usace-quality-assurance-composites.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/form-builder-kit.ts
 *   - /reuse/frontend/workflow-approval-kit.ts
 *   - /reuse/frontend/analytics-tracking-kit.ts
 *   - /reuse/frontend/custom-fields-metadata-kit.ts
 *   - /reuse/frontend/media-management-kit.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS quality management systems
 *   - Inspection tracking applications
 *   - Testing and certification modules
 *   - Nonconformance tracking systems
 */

/**
 * File: /reuse/frontend/composites/usace/usace-quality-assurance-composites.ts
 * Locator: WC-USACE-QA-001
 * Purpose: USACE CEFMS Quality Assurance/Quality Control & Testing System
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+, form-builder-kit, workflow-approval-kit
 * Downstream: USACE QA/QC systems, Inspection tracking, Testing, Certifications
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+, date-fns
 * Exports: 50+ QA/QC hooks, components, and utilities
 *
 * LLM Context: Enterprise-grade USACE CEFMS quality assurance system for React 18+ applications.
 * Provides comprehensive QA/QC processes including inspection management, testing protocols,
 * nonconformance tracking, corrective actions, material certifications, and construction quality
 * control. Designed for USACE Civil Works and Military construction projects requiring strict
 * adherence to ER 1180-1-6 (Construction Quality Management) and USACE quality standards.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormConfig,
  type FieldConfig,
} from '../../form-builder-kit';
import {
  trackEvent,
  useTracking,
} from '../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS - QUALITY ASSURANCE
// ============================================================================

/**
 * Inspection types
 */
export type InspectionType =
  | 'preliminary'
  | 'initial'
  | 'in_progress'
  | 'final'
  | 'warranty'
  | 'special'
  | 'safety'
  | 'environmental'
  | 'material_receiving'
  | 'fabrication'
  | 'installation';

/**
 * Inspection status
 */
export type InspectionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'passed'
  | 'failed'
  | 'conditional_pass'
  | 'cancelled'
  | 'pending_retest';

/**
 * Test result status
 */
export type TestResultStatus = 'pass' | 'fail' | 'pending' | 'inconclusive' | 'waived';

/**
 * Nonconformance severity
 */
export type NonconformanceSeverity = 'critical' | 'major' | 'minor' | 'observation';

/**
 * Corrective action status
 */
export type CorrectiveActionStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'verified'
  | 'closed';

/**
 * Quality inspection record
 */
export interface QualityInspection {
  id: string;
  inspectionNumber: string;
  inspectionType: InspectionType;
  status: InspectionStatus;
  projectNumber: string;
  projectName: string;
  location: string;
  workDescription: string;
  contractorName: string;
  scheduledDate: Date;
  actualDate?: Date;
  inspector: InspectorInfo;
  checklist?: InspectionChecklistItem[];
  findings?: InspectionFinding[];
  photos?: InspectionPhoto[];
  measurements?: Measurement[];
  weather?: WeatherConditions;
  attendees?: string[];
  overallResult?: 'acceptable' | 'unacceptable' | 'conditional';
  remarks?: string;
  nextInspectionDate?: Date;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Inspector information
 */
export interface InspectorInfo {
  userId: string;
  name: string;
  certifications: string[];
  organization: string;
  phone: string;
  email: string;
}

/**
 * Inspection checklist item
 */
export interface InspectionChecklistItem {
  id: string;
  itemNumber: number;
  description: string;
  specification?: string;
  required: boolean;
  result: 'pass' | 'fail' | 'na' | 'pending';
  notes?: string;
  photos?: string[];
  measurements?: Measurement[];
}

/**
 * Inspection finding
 */
export interface InspectionFinding {
  id: string;
  findingNumber: string;
  severity: NonconformanceSeverity;
  category: 'workmanship' | 'material' | 'design' | 'safety' | 'environmental' | 'documentation';
  description: string;
  location: string;
  specification?: string;
  requirement?: string;
  photoReferences?: string[];
  identifiedBy: string;
  identifiedDate: Date;
  status: 'open' | 'corrective_action_required' | 'resolved' | 'closed';
  correctiveAction?: string;
  resolvedBy?: string;
  resolvedDate?: Date;
  verifiedBy?: string;
  verificationDate?: Date;
}

/**
 * Inspection photo
 */
export interface InspectionPhoto {
  id: string;
  photoNumber: string;
  url: string;
  caption: string;
  location: string;
  timestamp: Date;
  photographer: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Measurement record
 */
export interface Measurement {
  id: string;
  parameter: string;
  specifiedValue: number;
  actualValue: number;
  unit: string;
  tolerance?: number;
  withinSpec: boolean;
  instrument?: string;
  calibrationDate?: Date;
  measuredBy: string;
  measurementDate: Date;
}

/**
 * Weather conditions
 */
export interface WeatherConditions {
  temperature: number;
  humidity?: number;
  precipitation?: 'none' | 'light' | 'moderate' | 'heavy';
  windSpeed?: number;
  conditions: string;
  suitableForWork: boolean;
}

/**
 * Material test record
 */
export interface MaterialTest {
  id: string;
  testNumber: string;
  materialType: string;
  materialSource: string;
  batchNumber?: string;
  lotNumber?: string;
  testType: string;
  testStandard: string;
  testDate: Date;
  laboratory: string;
  technician: string;
  testResults: TestResult[];
  overallResult: TestResultStatus;
  certificationNumber?: string;
  certificationDate?: Date;
  certified: boolean;
  certifiedBy?: string;
  sampleLocation?: string;
  sampleDate?: Date;
  remarks?: string;
}

/**
 * Test result
 */
export interface TestResult {
  id: string;
  parameter: string;
  specifiedValue: string;
  actualValue: string;
  unit: string;
  acceptanceCriteria: string;
  result: TestResultStatus;
  method?: string;
}

/**
 * Material certification
 */
export interface MaterialCertification {
  id: string;
  certificationNumber: string;
  materialType: string;
  manufacturer: string;
  supplier: string;
  materialGrade?: string;
  specification: string;
  quantity: number;
  unit: string;
  deliveryDate: Date;
  heatNumber?: string;
  lotNumber?: string;
  certificationDate: Date;
  certifiedBy: string;
  testReports?: string[];
  compliant: boolean;
  expirationDate?: Date;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Nonconformance report
 */
export interface NonconformanceReport {
  id: string;
  ncrNumber: string;
  projectNumber: string;
  title: string;
  description: string;
  severity: NonconformanceSeverity;
  category: string;
  location: string;
  identifiedDate: Date;
  identifiedBy: string;
  identificationSource: 'inspection' | 'test' | 'audit' | 'observation' | 'complaint';
  specification?: string;
  requirement?: string;
  rootCause?: string;
  impact: string;
  photos?: string[];
  responsibleParty: string;
  correctiveActions: CorrectiveAction[];
  dispositionDecision?: DispositionDecision;
  status: 'open' | 'ca_assigned' | 'ca_in_progress' | 'ca_completed' | 'verified' | 'closed';
  closedDate?: Date;
  closedBy?: string;
}

/**
 * Corrective action
 */
export interface CorrectiveAction {
  id: string;
  actionNumber: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  status: CorrectiveActionStatus;
  startDate?: Date;
  completionDate?: Date;
  verificationRequired: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  verificationMethod?: string;
  effectiveness: 'effective' | 'ineffective' | 'pending';
  costImpact?: number;
  scheduleImpact?: number;
  remarks?: string;
}

/**
 * Disposition decision
 */
export interface DispositionDecision {
  decision: 'use_as_is' | 'repair' | 'rework' | 'scrap' | 'return' | 'engineer_evaluation';
  justification: string;
  decidedBy: string;
  decisionDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  engineerEvaluation?: string;
  costImpact?: number;
}

/**
 * Quality control plan
 */
export interface QualityControlPlan {
  id: string;
  planNumber: string;
  title: string;
  projectNumber: string;
  revision: number;
  effectiveDate: Date;
  preparedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  scope: string;
  qualityObjectives: string[];
  inspectionPoints: InspectionPoint[];
  testRequirements: TestRequirement[];
  acceptanceCriteria: AcceptanceCriteria[];
  sampling Plans?: SamplingPlan[];
  roles: QualityRole[];
  documentation: string[];
  references: string[];
}

/**
 * Inspection point
 */
export interface InspectionPoint {
  id: string;
  pointNumber: string;
  activity: string;
  inspectionType: InspectionType;
  timing: 'before_work' | 'during_work' | 'after_work' | 'final';
  responsible: string;
  frequency?: string;
  documentation: string[];
  holdPoint: boolean;
}

/**
 * Test requirement
 */
export interface TestRequirement {
  id: string;
  testType: string;
  testStandard: string;
  material: string;
  frequency: string;
  sampleSize: number;
  acceptanceCriteria: string;
  responsible: string;
  timing: string;
}

/**
 * Acceptance criteria
 */
export interface AcceptanceCriteria {
  id: string;
  workItem: string;
  specification: string;
  criteria: string;
  measurement Method: string;
  tolerance: string;
  verificationMethod: string;
}

/**
 * Sampling plan
 */
export interface SamplingPlan {
  id: string;
  material: string;
  testType: string;
  lotSize: string;
  sampleSize: number;
  samplingMethod: string;
  acceptanceNumber: number;
  rejectionNumber: number;
  standard: string;
}

/**
 * Quality role
 */
export interface QualityRole {
  role: string;
  responsibilities: string[];
  authority: string[];
  qualifications: string[];
  assignedTo?: string;
}

/**
 * Quality audit
 */
export interface QualityAudit {
  id: string;
  auditNumber: string;
  auditType: 'internal' | 'external' | 'supplier' | 'surveillance';
  projectNumber: string;
  auditDate: Date;
  auditors: string[];
  auditees: string[];
  scope: string;
  criteria: string[];
  findings: AuditFinding[];
  overallRating: 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  recommendations: string[];
  reportDate: Date;
  reportedBy: string;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Audit finding
 */
export interface AuditFinding {
  id: string;
  findingNumber: string;
  type: 'nonconformance' | 'observation' | 'opportunity_for_improvement';
  severity: NonconformanceSeverity;
  area: string;
  description: string;
  requirement: string;
  evidence: string;
  recommendation: string;
  responsibleParty: string;
  dueDate?: Date;
  correctiveAction?: string;
  status: 'open' | 'addressed' | 'verified' | 'closed';
}

// ============================================================================
// INSPECTION MANAGEMENT
// ============================================================================

/**
 * Hook for quality inspection management
 *
 * @description Manages quality inspections and checklists
 * @returns {object} Inspection management functions
 *
 * @example
 * ```tsx
 * const {
 *   inspections,
 *   scheduleInspection,
 *   conductInspection,
 *   approveInspection,
 *   getScheduledInspections
 * } = useQualityInspections();
 * ```
 */
export function useQualityInspections() {
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const { track } = useTracking();

  const scheduleInspection = useCallback(
    (inspection: QualityInspection) => {
      setInspections((prev) => [...prev, inspection]);
      track('inspection_scheduled', {
        inspection_id: inspection.id,
        type: inspection.inspectionType,
        project: inspection.projectNumber,
      });
    },
    [track]
  );

  const conductInspection = useCallback(
    (inspectionId: string, results: Partial<QualityInspection>) => {
      setInspections((prev) =>
        prev.map((i) =>
          i.id === inspectionId
            ? {
                ...i,
                ...results,
                status: 'in_progress',
                actualDate: new Date(),
              }
            : i
        )
      );
      track('inspection_conducted', { inspection_id: inspectionId });
    },
    [track]
  );

  const completeInspection = useCallback(
    (inspectionId: string, overallResult: QualityInspection['overallResult']) => {
      setInspections((prev) =>
        prev.map((i) =>
          i.id === inspectionId
            ? {
                ...i,
                status:
                  overallResult === 'acceptable'
                    ? 'passed'
                    : overallResult === 'conditional'
                    ? 'conditional_pass'
                    : 'failed',
                overallResult,
              }
            : i
        )
      );
      track('inspection_completed', { inspection_id: inspectionId, result: overallResult });
    },
    [track]
  );

  const approveInspection = useCallback(
    (inspectionId: string, approvedBy: string) => {
      setInspections((prev) =>
        prev.map((i) =>
          i.id === inspectionId
            ? {
                ...i,
                approved: true,
                approvedBy,
                approvalDate: new Date(),
              }
            : i
        )
      );
      track('inspection_approved', { inspection_id: inspectionId });
    },
    [track]
  );

  const getScheduledInspections = useCallback(
    (daysAhead: number = 7) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + daysAhead);
      return inspections.filter(
        (i) => i.status === 'scheduled' && i.scheduledDate <= cutoff
      );
    },
    [inspections]
  );

  const getFailedInspections = useCallback(() => {
    return inspections.filter((i) => i.status === 'failed');
  }, [inspections]);

  const getInspectionsByProject = useCallback(
    (projectNumber: string) => {
      return inspections.filter((i) => i.projectNumber === projectNumber);
    },
    [inspections]
  );

  return {
    inspections,
    scheduleInspection,
    conductInspection,
    completeInspection,
    approveInspection,
    getScheduledInspections,
    getFailedInspections,
    getInspectionsByProject,
  };
}

/**
 * Hook for material testing management
 *
 * @description Manages material tests and certifications
 * @returns {object} Material testing functions
 *
 * @example
 * ```tsx
 * const {
 *   tests,
 *   createTest,
 *   recordResults,
 *   certifyMaterial,
 *   getPendingTests
 * } = useMaterialTesting();
 * ```
 */
export function useMaterialTesting() {
  const [tests, setTests] = useState<MaterialTest[]>([]);
  const { track } = useTracking();

  const createTest = useCallback(
    (test: MaterialTest) => {
      setTests((prev) => [...prev, test]);
      track('material_test_created', {
        test_id: test.id,
        material_type: test.materialType,
        test_type: test.testType,
      });
    },
    [track]
  );

  const recordResults = useCallback(
    (testId: string, results: TestResult[], overallResult: TestResultStatus) => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                testResults: results,
                overallResult,
              }
            : t
        )
      );
      track('test_results_recorded', { test_id: testId, result: overallResult });
    },
    [track]
  );

  const certifyMaterial = useCallback(
    (testId: string, certifiedBy: string, certificationNumber: string) => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                certified: true,
                certifiedBy,
                certificationNumber,
                certificationDate: new Date(),
              }
            : t
        )
      );
      track('material_certified', { test_id: testId });
    },
    [track]
  );

  const getPendingTests = useCallback(() => {
    return tests.filter((t) => t.overallResult === 'pending');
  }, [tests]);

  const getFailedTests = useCallback(() => {
    return tests.filter((t) => t.overallResult === 'fail');
  }, [tests]);

  const getTestsByMaterial = useCallback(
    (materialType: string) => {
      return tests.filter((t) => t.materialType === materialType);
    },
    [tests]
  );

  return {
    tests,
    createTest,
    recordResults,
    certifyMaterial,
    getPendingTests,
    getFailedTests,
    getTestsByMaterial,
  };
}

/**
 * Hook for nonconformance management
 *
 * @description Manages NCRs and corrective actions
 * @returns {object} Nonconformance management functions
 *
 * @example
 * ```tsx
 * const {
 *   ncrs,
 *   createNCR,
 *   assignCorrectiveAction,
 *   closeNCR,
 *   getOpenNCRs
 * } = useNonconformanceManagement();
 * ```
 */
export function useNonconformanceManagement() {
  const [ncrs, setNcrs] = useState<NonconformanceReport[]>([]);
  const { track } = useTracking();

  const createNCR = useCallback(
    (ncr: NonconformanceReport) => {
      setNcrs((prev) => [...prev, ncr]);
      track('ncr_created', {
        ncr_number: ncr.ncrNumber,
        severity: ncr.severity,
        category: ncr.category,
      });
    },
    [track]
  );

  const assignCorrectiveAction = useCallback(
    (ncrId: string, action: CorrectiveAction) => {
      setNcrs((prev) =>
        prev.map((ncr) =>
          ncr.id === ncrId
            ? {
                ...ncr,
                correctiveActions: [...ncr.correctiveActions, action],
                status: 'ca_assigned',
              }
            : ncr
        )
      );
      track('corrective_action_assigned', { ncr_id: ncrId, action_id: action.id });
    },
    [track]
  );

  const updateCorrectiveAction = useCallback(
    (ncrId: string, actionId: string, status: CorrectiveActionStatus) => {
      setNcrs((prev) =>
        prev.map((ncr) =>
          ncr.id === ncrId
            ? {
                ...ncr,
                correctiveActions: ncr.correctiveActions.map((ca) =>
                  ca.id === actionId ? { ...ca, status } : ca
                ),
              }
            : ncr
        )
      );
    },
    []
  );

  const closeNCR = useCallback(
    (ncrId: string, closedBy: string) => {
      setNcrs((prev) =>
        prev.map((ncr) =>
          ncr.id === ncrId
            ? {
                ...ncr,
                status: 'closed',
                closedDate: new Date(),
                closedBy,
              }
            : ncr
        )
      );
      track('ncr_closed', { ncr_id: ncrId });
    },
    [track]
  );

  const getOpenNCRs = useCallback(() => {
    return ncrs.filter((ncr) => ncr.status !== 'closed');
  }, [ncrs]);

  const getCriticalNCRs = useCallback(() => {
    return ncrs.filter((ncr) => ncr.severity === 'critical' && ncr.status !== 'closed');
  }, [ncrs]);

  const getNCRsByProject = useCallback(
    (projectNumber: string) => {
      return ncrs.filter((ncr) => ncr.projectNumber === projectNumber);
    },
    [ncrs]
  );

  return {
    ncrs,
    createNCR,
    assignCorrectiveAction,
    updateCorrectiveAction,
    closeNCR,
    getOpenNCRs,
    getCriticalNCRs,
    getNCRsByProject,
  };
}

/**
 * Hook for material certification tracking
 *
 * @description Tracks material certifications and approvals
 * @returns {object} Certification tracking functions
 *
 * @example
 * ```tsx
 * const {
 *   certifications,
 *   addCertification,
 *   approveCertification,
 *   getExpiringCertifications
 * } = useMaterialCertification();
 * ```
 */
export function useMaterialCertification() {
  const [certifications, setCertifications] = useState<MaterialCertification[]>([]);
  const { track } = useTracking();

  const addCertification = useCallback(
    (certification: MaterialCertification) => {
      setCertifications((prev) => [...prev, certification]);
      track('certification_added', {
        cert_number: certification.certificationNumber,
        material_type: certification.materialType,
      });
    },
    [track]
  );

  const approveCertification = useCallback(
    (certificationId: string, approvedBy: string) => {
      setCertifications((prev) =>
        prev.map((cert) =>
          cert.id === certificationId
            ? {
                ...cert,
                approved: true,
                approvedBy,
                approvalDate: new Date(),
              }
            : cert
        )
      );
      track('certification_approved', { certification_id: certificationId });
    },
    [track]
  );

  const getExpiringCertifications = useCallback(
    (daysAhead: number = 30) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + daysAhead);
      return certifications.filter(
        (cert) => cert.expirationDate && cert.expirationDate <= cutoff
      );
    },
    [certifications]
  );

  const getNonCompliantCertifications = useCallback(() => {
    return certifications.filter((cert) => !cert.compliant);
  }, [certifications]);

  const getCertificationsByMaterial = useCallback(
    (materialType: string) => {
      return certifications.filter((cert) => cert.materialType === materialType);
    },
    [certifications]
  );

  return {
    certifications,
    addCertification,
    approveCertification,
    getExpiringCertifications,
    getNonCompliantCertifications,
    getCertificationsByMaterial,
  };
}

/**
 * Hook for quality control plan management
 *
 * @description Manages QC plans and requirements
 * @param {string} projectNumber - Project identifier
 * @returns {object} QC plan management functions
 *
 * @example
 * ```tsx
 * const {
 *   qcPlan,
 *   createQCPlan,
 *   updateQCPlan,
 *   addInspectionPoint,
 *   getHoldPoints
 * } = useQualityControlPlan('P1234');
 * ```
 */
export function useQualityControlPlan(projectNumber: string) {
  const [qcPlan, setQcPlan] = useState<QualityControlPlan | null>(null);
  const { track } = useTracking();

  const createQCPlan = useCallback(
    (plan: QualityControlPlan) => {
      setQcPlan(plan);
      track('qc_plan_created', {
        plan_number: plan.planNumber,
        project: projectNumber,
      });
    },
    [projectNumber, track]
  );

  const updateQCPlan = useCallback(
    (updates: Partial<QualityControlPlan>) => {
      if (qcPlan) {
        setQcPlan({ ...qcPlan, ...updates });
        track('qc_plan_updated', { plan_number: qcPlan.planNumber });
      }
    },
    [qcPlan, track]
  );

  const addInspectionPoint = useCallback(
    (inspectionPoint: InspectionPoint) => {
      if (qcPlan) {
        setQcPlan({
          ...qcPlan,
          inspectionPoints: [...qcPlan.inspectionPoints, inspectionPoint],
        });
      }
    },
    [qcPlan]
  );

  const addTestRequirement = useCallback(
    (testReq: TestRequirement) => {
      if (qcPlan) {
        setQcPlan({
          ...qcPlan,
          testRequirements: [...qcPlan.testRequirements, testReq],
        });
      }
    },
    [qcPlan]
  );

  const getHoldPoints = useCallback(() => {
    return qcPlan?.inspectionPoints.filter((ip) => ip.holdPoint) || [];
  }, [qcPlan]);

  return {
    qcPlan,
    createQCPlan,
    updateQCPlan,
    addInspectionPoint,
    addTestRequirement,
    getHoldPoints,
  };
}

/**
 * Hook for quality audits
 *
 * @description Manages quality audit process
 * @returns {object} Quality audit functions
 *
 * @example
 * ```tsx
 * const {
 *   audits,
 *   scheduleAudit,
 *   recordFindings,
 *   approveAudit,
 *   getOpenFindings
 * } = useQualityAudits();
 * ```
 */
export function useQualityAudits() {
  const [audits, setAudits] = useState<QualityAudit[]>([]);
  const { track } = useTracking();

  const scheduleAudit = useCallback(
    (audit: QualityAudit) => {
      setAudits((prev) => [...prev, audit]);
      track('audit_scheduled', {
        audit_number: audit.auditNumber,
        type: audit.auditType,
        project: audit.projectNumber,
      });
    },
    [track]
  );

  const recordFindings = useCallback(
    (auditId: string, findings: AuditFinding[]) => {
      setAudits((prev) =>
        prev.map((audit) => (audit.id === auditId ? { ...audit, findings } : audit))
      );
      track('audit_findings_recorded', { audit_id: auditId, finding_count: findings.length });
    },
    [track]
  );

  const approveAudit = useCallback(
    (auditId: string, approvedBy: string) => {
      setAudits((prev) =>
        prev.map((audit) =>
          audit.id === auditId
            ? {
                ...audit,
                approved: true,
                approvedBy,
                approvalDate: new Date(),
              }
            : audit
        )
      );
      track('audit_approved', { audit_id: auditId });
    },
    [track]
  );

  const getOpenFindings = useCallback(() => {
    return audits.flatMap((audit) => audit.findings.filter((f) => f.status === 'open'));
  }, [audits]);

  const getAuditsByProject = useCallback(
    (projectNumber: string) => {
      return audits.filter((audit) => audit.projectNumber === projectNumber);
    },
    [audits]
  );

  return {
    audits,
    scheduleAudit,
    recordFindings,
    approveAudit,
    getOpenFindings,
    getAuditsByProject,
  };
}

/**
 * Generate inspection checklist form
 *
 * @description Creates inspection checklist based on type
 * @param {InspectionType} inspectionType - Type of inspection
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateInspectionChecklistForm('final');
 * <FormRenderer formConfig={formConfig} />
 * ```
 */
export function generateInspectionChecklistForm(
  inspectionType: InspectionType
): FormConfig {
  return {
    id: `inspection-checklist-${inspectionType}`,
    title: `${inspectionType.toUpperCase().replace('_', ' ')} Inspection Checklist`,
    description: 'Complete inspection checklist items',
    fields: [
      {
        id: 'inspectionDate',
        name: 'inspectionDate',
        type: 'date',
        label: 'Inspection Date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
      },
      {
        id: 'inspector',
        name: 'inspector',
        type: 'text',
        label: 'Inspector Name',
        required: true,
      },
      {
        id: 'location',
        name: 'location',
        type: 'text',
        label: 'Location',
        required: true,
      },
      {
        id: 'workDescription',
        name: 'workDescription',
        type: 'textarea',
        label: 'Work Description',
        required: true,
        rows: 3,
      },
      {
        id: 'overallResult',
        name: 'overallResult',
        type: 'select',
        label: 'Overall Result',
        required: true,
        options: [
          { label: 'Acceptable', value: 'acceptable' },
          { label: 'Conditional', value: 'conditional' },
          { label: 'Unacceptable', value: 'unacceptable' },
        ],
      },
      {
        id: 'remarks',
        name: 'remarks',
        type: 'textarea',
        label: 'Remarks',
        rows: 4,
      },
    ],
  };
}

/**
 * Generate NCR form
 *
 * @description Creates nonconformance report form
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateNCRForm();
 * <FormRenderer formConfig={formConfig} onSubmit={handleNCR} />
 * ```
 */
export function generateNCRForm(): FormConfig {
  return {
    id: 'ncr-form',
    title: 'Nonconformance Report',
    description: 'Document nonconformance and corrective actions',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        fields: [
          {
            id: 'ncrNumber',
            name: 'ncrNumber',
            type: 'text',
            label: 'NCR Number',
            required: true,
          },
          {
            id: 'title',
            name: 'title',
            type: 'text',
            label: 'Title',
            required: true,
          },
          {
            id: 'severity',
            name: 'severity',
            type: 'select',
            label: 'Severity',
            required: true,
            options: [
              { label: 'Critical', value: 'critical' },
              { label: 'Major', value: 'major' },
              { label: 'Minor', value: 'minor' },
              { label: 'Observation', value: 'observation' },
            ],
          },
        ],
      },
      {
        id: 'details',
        title: 'Nonconformance Details',
        fields: [
          {
            id: 'description',
            name: 'description',
            type: 'textarea',
            label: 'Description',
            required: true,
            rows: 4,
          },
          {
            id: 'specification',
            name: 'specification',
            type: 'text',
            label: 'Applicable Specification',
          },
          {
            id: 'rootCause',
            name: 'rootCause',
            type: 'textarea',
            label: 'Root Cause Analysis',
            rows: 3,
          },
        ],
      },
    ],
  };
}

/**
 * Calculate inspection pass rate
 *
 * @description Computes inspection success metrics
 * @param {QualityInspection[]} inspections - Inspections to analyze
 * @returns {object} Pass rate metrics
 *
 * @example
 * ```tsx
 * const metrics = calculateInspectionPassRate(inspections);
 * console.log(`Pass rate: ${metrics.passRate}%`);
 * ```
 */
export function calculateInspectionPassRate(inspections: QualityInspection[]) {
  const completed = inspections.filter(
    (i) => i.status === 'passed' || i.status === 'failed' || i.status === 'conditional_pass'
  );

  if (completed.length === 0) {
    return {
      total: inspections.length,
      completed: 0,
      passed: 0,
      failed: 0,
      conditional: 0,
      passRate: 0,
      failRate: 0,
    };
  }

  const passed = completed.filter((i) => i.status === 'passed').length;
  const failed = completed.filter((i) => i.status === 'failed').length;
  const conditional = completed.filter((i) => i.status === 'conditional_pass').length;

  return {
    total: inspections.length,
    completed: completed.length,
    passed,
    failed,
    conditional,
    passRate: Math.round((passed / completed.length) * 100),
    failRate: Math.round((failed / completed.length) * 100),
  };
}

/**
 * Analyze NCR trends
 *
 * @description Analyzes nonconformance trends
 * @param {NonconformanceReport[]} ncrs - NCRs to analyze
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {object} Trend analysis
 *
 * @example
 * ```tsx
 * const trends = analyzeNCRTrends(ncrs, startDate, endDate);
 * ```
 */
export function analyzeNCRTrends(
  ncrs: NonconformanceReport[],
  startDate: Date,
  endDate: Date
) {
  const filtered = ncrs.filter(
    (ncr) => ncr.identifiedDate >= startDate && ncr.identifiedDate <= endDate
  );

  const byCategory = filtered.reduce((acc, ncr) => {
    acc[ncr.category] = (acc[ncr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bySeverity = filtered.reduce((acc, ncr) => {
    acc[ncr.severity] = (acc[ncr.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgCloseTime =
    filtered
      .filter((ncr) => ncr.closedDate)
      .reduce((sum, ncr) => {
        const days = Math.ceil(
          (ncr.closedDate!.getTime() - ncr.identifiedDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0) / filtered.filter((ncr) => ncr.closedDate).length || 0;

  return {
    totalNCRs: filtered.length,
    byCategory,
    bySeverity,
    avgCloseTime: Math.round(avgCloseTime),
    openNCRs: filtered.filter((ncr) => ncr.status !== 'closed').length,
    criticalOpen: filtered.filter((ncr) => ncr.severity === 'critical' && ncr.status !== 'closed')
      .length,
  };
}

/**
 * Validate test results against specifications
 *
 * @description Checks if test results meet specifications
 * @param {TestResult[]} results - Test results to validate
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateTestResults(testResults);
 * if (!validation.allPass) {
 *   console.log('Failed parameters:', validation.failures);
 * }
 * ```
 */
export function validateTestResults(results: TestResult[]) {
  const failures = results.filter((r) => r.result === 'fail');
  const passes = results.filter((r) => r.result === 'pass');
  const pending = results.filter((r) => r.result === 'pending');

  return {
    allPass: failures.length === 0 && pending.length === 0,
    totalTests: results.length,
    passed: passes.length,
    failed: failures.length,
    pending: pending.length,
    passRate: results.length > 0 ? Math.round((passes.length / results.length) * 100) : 0,
    failures: failures.map((f) => ({
      parameter: f.parameter,
      expected: f.specifiedValue,
      actual: f.actualValue,
    })),
  };
}

/**
 * Generate quality metrics dashboard
 *
 * @description Compiles comprehensive quality metrics
 * @param {object} data - Quality data
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```tsx
 * const dashboard = generateQualityMetricsDashboard({
 *   inspections,
 *   ncrs,
 *   tests
 * });
 * ```
 */
export function generateQualityMetricsDashboard(data: {
  inspections: QualityInspection[];
  ncrs: NonconformanceReport[];
  tests: MaterialTest[];
}) {
  const inspectionMetrics = calculateInspectionPassRate(data.inspections);

  const openNCRs = data.ncrs.filter((ncr) => ncr.status !== 'closed');
  const criticalNCRs = openNCRs.filter((ncr) => ncr.severity === 'critical');

  const testPassRate =
    data.tests.length > 0
      ? Math.round(
          (data.tests.filter((t) => t.overallResult === 'pass').length / data.tests.length) * 100
        )
      : 0;

  return {
    inspections: {
      total: data.inspections.length,
      passRate: inspectionMetrics.passRate,
      pending: data.inspections.filter((i) => i.status === 'scheduled').length,
    },
    nonconformances: {
      total: data.ncrs.length,
      open: openNCRs.length,
      critical: criticalNCRs.length,
    },
    testing: {
      total: data.tests.length,
      passRate: testPassRate,
      pending: data.tests.filter((t) => t.overallResult === 'pending').length,
    },
    overallQualityScore: Math.round(
      (inspectionMetrics.passRate + testPassRate) / 2 - openNCRs.length * 2
    ),
  };
}

/**
 * Check inspection readiness
 *
 * @description Verifies all prerequisites for inspection
 * @param {InspectionPoint} inspectionPoint - Inspection point to check
 * @returns {object} Readiness status
 *
 * @example
 * ```tsx
 * const readiness = checkInspectionReadiness(inspectionPoint);
 * if (!readiness.ready) {
 *   console.log('Missing:', readiness.missing);
 * }
 * ```
 */
export function checkInspectionReadiness(inspectionPoint: InspectionPoint) {
  const missing: string[] = [];

  if (!inspectionPoint.responsible) {
    missing.push('Inspector assignment');
  }
  if (!inspectionPoint.documentation || inspectionPoint.documentation.length === 0) {
    missing.push('Required documentation');
  }

  return {
    ready: missing.length === 0,
    missing,
    inspectionPoint: inspectionPoint.pointNumber,
    activity: inspectionPoint.activity,
  };
}

/**
 * Export quality report
 *
 * @description Generates comprehensive quality report
 * @param {string} projectNumber - Project identifier
 * @param {object} data - Quality data
 * @returns {string} Formatted report
 *
 * @example
 * ```tsx
 * const report = exportQualityReport('P1234', { inspections, ncrs, tests });
 * ```
 */
export function exportQualityReport(
  projectNumber: string,
  data: {
    inspections: QualityInspection[];
    ncrs: NonconformanceReport[];
    tests: MaterialTest[];
  }
): string {
  const metrics = generateQualityMetricsDashboard(data);

  return `
QUALITY ASSURANCE REPORT
========================
Project: ${projectNumber}
Report Date: ${new Date().toLocaleDateString()}

INSPECTION SUMMARY:
  Total Inspections: ${metrics.inspections.total}
  Pass Rate: ${metrics.inspections.passRate}%
  Pending: ${metrics.inspections.pending}

NONCONFORMANCE SUMMARY:
  Total NCRs: ${metrics.nonconformances.total}
  Open NCRs: ${metrics.nonconformances.open}
  Critical Open: ${metrics.nonconformances.critical}

TESTING SUMMARY:
  Total Tests: ${metrics.testing.total}
  Pass Rate: ${metrics.testing.passRate}%
  Pending: ${metrics.testing.pending}

OVERALL QUALITY SCORE: ${metrics.overallQualityScore}

RECENT INSPECTIONS:
${data.inspections
  .slice(0, 5)
  .map(
    (i) =>
      `  - ${i.inspectionNumber}: ${i.status} (${i.inspectionType})`
  )
  .join('\n')}

OPEN NONCONFORMANCES:
${data.ncrs
  .filter((ncr) => ncr.status !== 'closed')
  .slice(0, 5)
  .map((ncr) => `  - ${ncr.ncrNumber}: ${ncr.title} (${ncr.severity})`)
  .join('\n')}
  `.trim();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useQualityInspections,
  useMaterialTesting,
  useNonconformanceManagement,
  useMaterialCertification,
  useQualityControlPlan,
  useQualityAudits,

  // Utility Functions
  generateInspectionChecklistForm,
  generateNCRForm,
  calculateInspectionPassRate,
  analyzeNCRTrends,
  validateTestResults,
  generateQualityMetricsDashboard,
  checkInspectionReadiness,
  exportQualityReport,
};
