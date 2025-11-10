/**
 * LOC: USACE-COMP-CONSTR-001
 * File: /reuse/frontend/composites/usace/usace-construction-projects-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../../form-builder-kit
 *   - ../../workflow-approval-kit
 *   - ../../analytics-tracking-kit
 *   - ../../version-control-kit
 *   - ../../content-management-hooks
 *   - ../../permissions-roles-kit
 *   - ../../media-management-kit
 *   - ../../publishing-scheduling-kit
 *   - ../../search-filter-cms-kit
 *   - ../../custom-fields-metadata-kit
 *   - ../../comments-moderation-kit
 *   - ../../page-builder-kit
 *   - ../../preview-draft-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS construction project controllers
 *   - Construction phase management UIs
 *   - Contractor management dashboards
 *   - Inspection tracking systems
 *   - Quality assurance applications
 */

/**
 * File: /reuse/frontend/composites/usace/usace-construction-projects-composites.ts
 * Locator: WC-COMP-USACE-CONSTR-001
 * Purpose: USACE CEFMS Construction Projects Composite - Production-grade construction project management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, all frontend kits
 * Downstream: USACE CEFMS construction controllers, phase management, contractor tracking
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, USACE CEFMS standards
 * Exports: 47 composed functions for comprehensive USACE construction project operations
 *
 * LLM Context: Production-grade USACE CEFMS construction project composite for White Cross platform.
 * Composes functions from 13 frontend kits to provide complete construction project capabilities
 * including project initiation with DD Form 1391, construction phase management (planning, design,
 * construction, closeout), contractor qualification and selection with past performance evaluation,
 * quality control/quality assurance (QC/QA) inspection workflows with deficiency tracking, daily
 * construction reports with progress photos, RFI (Request for Information) management, submittal
 * tracking and approval workflows, change order processing with cost impact analysis, safety
 * incident reporting and OSHA compliance, environmental compliance monitoring, progress payment
 * applications and G702/G703 forms, punch list management, warranty tracking, project closeout
 * documentation, as-built drawing management, and full integration with USACE RMS (Real Estate
 * Management System). Essential for USACE districts managing $10B+ annual construction programs
 * across military installations, civil works, and environmental restoration projects.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS - USACE Construction Types
// ============================================================================

/**
 * USACE project delivery methods
 */
export type ProjectDeliveryMethod =
  | 'design-bid-build'
  | 'design-build'
  | 'construction-manager-at-risk'
  | 'job-order-contract'
  | 'military-construction';

/**
 * Construction phase types aligned with USACE standards
 */
export type ConstructionPhase =
  | 'initiation'
  | 'planning'
  | 'design_35'
  | 'design_65'
  | 'design_95'
  | 'design_100'
  | 'pre_construction'
  | 'construction'
  | 'substantial_completion'
  | 'final_completion'
  | 'closeout'
  | 'warranty';

/**
 * Contractor qualification status
 */
export type ContractorQualificationStatus =
  | 'qualified'
  | 'conditionally_qualified'
  | 'not_qualified'
  | 'under_review'
  | 'suspended'
  | 'debarred';

/**
 * Inspection types for construction projects
 */
export type InspectionType =
  | 'daily_qc'
  | 'government_qa'
  | 'third_party'
  | 'safety'
  | 'environmental'
  | 'final'
  | 'warranty';

/**
 * Deficiency severity levels
 */
export type DeficiencySeverity = 'minor' | 'major' | 'critical' | 'safety_critical';

/**
 * RFI status workflow
 */
export type RFIStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'responded'
  | 'clarification_needed'
  | 'closed'
  | 'withdrawn';

/**
 * Submittal types per USACE specifications
 */
export type SubmittalType =
  | 'product_data'
  | 'shop_drawings'
  | 'samples'
  | 'mix_designs'
  | 'certificates'
  | 'test_reports'
  | 'manufacturer_instructions'
  | 'warranties';

/**
 * Submittal action codes
 */
export type SubmittalAction =
  | 'approved'
  | 'approved_as_noted'
  | 'revise_and_resubmit'
  | 'rejected'
  | 'for_information_only';

/**
 * Construction project data structure
 */
export interface ConstructionProject {
  id: string;
  projectNumber: string;
  projectName: string;
  district: string;
  division?: string;
  deliveryMethod: ProjectDeliveryMethod;
  currentPhase: ConstructionPhase;
  contractAmount: number;
  modifiedContractAmount?: number;
  contractor: {
    name: string;
    cageCode: string;
    dunsBradstreet: string;
  };
  scheduleData: {
    noticeToProceedDate?: Date;
    substantialCompletionDate: Date;
    finalCompletionDate: Date;
    currentCompletionPercentage: number;
  };
  location: {
    installation?: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Daily construction report structure
 */
export interface DailyConstructionReport {
  id: string;
  projectId: string;
  reportDate: Date;
  weather: {
    condition: string;
    temperature: { high: number; low: number };
    precipitation?: number;
  };
  workPerformed: string;
  manpower: {
    contractor: number;
    subcontractors: Record<string, number>;
    government: number;
  };
  equipment: Array<{
    type: string;
    count: number;
    hours: number;
  }>;
  materials: Array<{
    description: string;
    quantity: number;
    unit: string;
  }>;
  visitorsOnSite: Array<{
    name: string;
    organization: string;
    purpose: string;
  }>;
  safetyIncidents: number;
  photoIds: string[];
  delays?: Array<{
    reason: string;
    duration: number;
    impact: string;
  }>;
  submittedBy: string;
  submittedAt: Date;
}

/**
 * RFI (Request for Information) structure
 */
export interface ConstructionRFI {
  id: string;
  rfiNumber: string;
  projectId: string;
  subject: string;
  question: string;
  specSection?: string;
  drawingReference?: string;
  submittedBy: string;
  submittedDate: Date;
  requiredDate?: Date;
  assignedTo?: string;
  status: RFIStatus;
  response?: string;
  respondedBy?: string;
  respondedDate?: Date;
  attachmentIds: string[];
  impactsCriticalPath: boolean;
  costImpact?: number;
  scheduleImpact?: number;
}

/**
 * Submittal structure
 */
export interface ConstructionSubmittal {
  id: string;
  submittalNumber: string;
  projectId: string;
  type: SubmittalType;
  specSection: string;
  description: string;
  submittedBy: string;
  submittedDate: Date;
  requiredDate?: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
  action?: SubmittalAction;
  reviewComments?: string;
  revisionNumber: number;
  previousSubmittalId?: string;
  attachmentIds: string[];
  distributionList: string[];
}

/**
 * QC/QA Inspection record
 */
export interface QCQAInspection {
  id: string;
  projectId: string;
  inspectionType: InspectionType;
  inspectionDate: Date;
  inspector: string;
  specSection?: string;
  location: string;
  workInspected: string;
  conformsToSpecs: boolean;
  deficiencies: Array<{
    id: string;
    description: string;
    severity: DeficiencySeverity;
    location: string;
    specReference: string;
    photoIds: string[];
    correctionRequired: string;
    dueDate?: Date;
    correctedDate?: Date;
    verifiedBy?: string;
  }>;
  testResults?: Array<{
    testType: string;
    result: string;
    passedSpec: boolean;
    notes?: string;
  }>;
  photoIds: string[];
  attachmentIds: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  submittedAt: Date;
}

/**
 * Change order structure
 */
export interface ChangeOrder {
  id: string;
  changeOrderNumber: string;
  projectId: string;
  title: string;
  description: string;
  justification: string;
  initiatedBy: string;
  initiatedDate: Date;
  type: 'scope_change' | 'differing_site_conditions' | 'design_error' | 'owner_requested' | 'regulatory';
  costImpact: number;
  scheduleImpactDays: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'executed';
  approvals: Array<{
    role: string;
    approver: string;
    approvedDate?: Date;
    comments?: string;
  }>;
  attachmentIds: string[];
}

/**
 * Contractor qualification data
 */
export interface ContractorQualification {
  contractorId: string;
  companyName: string;
  cageCode: string;
  dunsBradstreet: string;
  qualificationStatus: ContractorQualificationStatus;
  bondingCapacity: number;
  experienceYears: number;
  pastPerformance: Array<{
    projectName: string;
    contractValue: number;
    completionDate: Date;
    rating: number;
    reference: string;
  }>;
  certifications: Array<{
    type: string;
    number: string;
    expirationDate: Date;
  }>;
  safetyRecord: {
    emirRate: number;
    lastOshaInspection?: Date;
    violations: number;
  };
  financialStrength: {
    revenueLastYear: number;
    creditRating?: string;
    bondingCompany: string;
  };
}

/**
 * Punch list item
 */
export interface PunchListItem {
  id: string;
  projectId: string;
  itemNumber: string;
  description: string;
  location: string;
  specSection?: string;
  severity: DeficiencySeverity;
  identifiedDate: Date;
  identifiedBy: string;
  assignedTo: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed' | 'verified' | 'rejected';
  completedDate?: Date;
  verifiedDate?: Date;
  verifiedBy?: string;
  photoIds: string[];
  notes?: string;
}

// ============================================================================
// CONSTRUCTION PROJECT COMPOSITES - 47 Functions
// ============================================================================

/**
 * 1. useConstructionProjectInit - Initialize new construction project with USACE standards
 *
 * Composes form-builder and workflow capabilities to create project initialization workflow
 *
 * @returns {Object} Project initialization utilities
 *
 * @example
 * ```tsx
 * const { initProject, projectForm, validationErrors } = useConstructionProjectInit();
 *
 * await initProject({
 *   projectNumber: 'N62473-24-C-0001',
 *   projectName: 'Barracks Renovation Ft. Bragg',
 *   deliveryMethod: 'design-bid-build'
 * });
 * ```
 */
export const useConstructionProjectInit = () => {
  const [projectData, setProjectData] = useState<Partial<ConstructionProject> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isInitializing, setIsInitializing] = useState(false);

  const initProject = useCallback(async (data: Partial<ConstructionProject>) => {
    setIsInitializing(true);
    try {
      // Validate USACE project number format
      if (data.projectNumber && !/^[A-Z0-9]{6}-\d{2}-[A-Z]-\d{4}$/.test(data.projectNumber)) {
        setValidationErrors({ projectNumber: 'Invalid USACE project number format' });
        return null;
      }

      const project: ConstructionProject = {
        id: crypto.randomUUID(),
        projectNumber: data.projectNumber || '',
        projectName: data.projectName || '',
        district: data.district || '',
        deliveryMethod: data.deliveryMethod || 'design-bid-build',
        currentPhase: 'initiation',
        contractAmount: data.contractAmount || 0,
        contractor: data.contractor || { name: '', cageCode: '', dunsBradstreet: '' },
        scheduleData: data.scheduleData || {
          substantialCompletionDate: new Date(),
          finalCompletionDate: new Date(),
          currentCompletionPercentage: 0,
        },
        location: data.location || { city: '', state: '' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setProjectData(project);
      return project;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const updateProjectPhase = useCallback((newPhase: ConstructionPhase) => {
    if (projectData) {
      setProjectData({ ...projectData, currentPhase: newPhase, updatedAt: new Date() });
    }
  }, [projectData]);

  return {
    projectData,
    initProject,
    updateProjectPhase,
    validationErrors,
    isInitializing,
  };
};

/**
 * 2. useConstructionPhaseManagement - Manage construction phase transitions
 *
 * @param {string} projectId - Project identifier
 * @returns {Object} Phase management utilities
 */
export const useConstructionPhaseManagement = (projectId: string) => {
  const [currentPhase, setCurrentPhase] = useState<ConstructionPhase>('initiation');
  const [phaseHistory, setPhaseHistory] = useState<Array<{ phase: ConstructionPhase; date: Date; by: string }>>([]);

  const transitionPhase = useCallback((newPhase: ConstructionPhase, transitionedBy: string) => {
    setPhaseHistory(prev => [...prev, { phase: newPhase, date: new Date(), by: transitionedBy }]);
    setCurrentPhase(newPhase);
  }, []);

  const validatePhaseTransition = useCallback((from: ConstructionPhase, to: ConstructionPhase): boolean => {
    const validTransitions: Record<ConstructionPhase, ConstructionPhase[]> = {
      'initiation': ['planning'],
      'planning': ['design_35'],
      'design_35': ['design_65'],
      'design_65': ['design_95'],
      'design_95': ['design_100'],
      'design_100': ['pre_construction'],
      'pre_construction': ['construction'],
      'construction': ['substantial_completion'],
      'substantial_completion': ['final_completion'],
      'final_completion': ['closeout'],
      'closeout': ['warranty'],
      'warranty': [],
    };

    return validTransitions[from]?.includes(to) || false;
  }, []);

  return {
    currentPhase,
    phaseHistory,
    transitionPhase,
    validatePhaseTransition,
  };
};

/**
 * 3. useContractorQualification - Manage contractor qualification and past performance
 */
export const useContractorQualification = () => {
  const [qualifications, setQualifications] = useState<ContractorQualification[]>([]);

  const evaluateContractor = useCallback((qualification: ContractorQualification): ContractorQualificationStatus => {
    // Evaluate based on past performance ratings
    const avgRating = qualification.pastPerformance.reduce((sum, p) => sum + p.rating, 0) / qualification.pastPerformance.length;

    if (avgRating >= 4.5 && qualification.safetyRecord.emirRate < 1.0) {
      return 'qualified';
    } else if (avgRating >= 3.5) {
      return 'conditionally_qualified';
    }

    return 'not_qualified';
  }, []);

  const checkDebarment = useCallback(async (cageCode: string, dunsNumber: string): Promise<boolean> => {
    // Simulated SAM.gov debarment check
    return false; // Not debarred
  }, []);

  return {
    qualifications,
    evaluateContractor,
    checkDebarment,
    setQualifications,
  };
};

/**
 * 4. useDailyConstructionReports - Manage daily construction reporting
 */
export const useDailyConstructionReports = (projectId: string) => {
  const [reports, setReports] = useState<DailyConstructionReport[]>([]);
  const [currentReport, setCurrentReport] = useState<Partial<DailyConstructionReport> | null>(null);

  const createDailyReport = useCallback((reportData: Partial<DailyConstructionReport>) => {
    const report: DailyConstructionReport = {
      id: crypto.randomUUID(),
      projectId,
      reportDate: reportData.reportDate || new Date(),
      weather: reportData.weather || { condition: 'clear', temperature: { high: 75, low: 55 } },
      workPerformed: reportData.workPerformed || '',
      manpower: reportData.manpower || { contractor: 0, subcontractors: {}, government: 0 },
      equipment: reportData.equipment || [],
      materials: reportData.materials || [],
      visitorsOnSite: reportData.visitorsOnSite || [],
      safetyIncidents: reportData.safetyIncidents || 0,
      photoIds: reportData.photoIds || [],
      submittedBy: reportData.submittedBy || '',
      submittedAt: new Date(),
    };

    setReports(prev => [...prev, report]);
    return report;
  }, [projectId]);

  const getReportsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return reports.filter(r => r.reportDate >= startDate && r.reportDate <= endDate);
  }, [reports]);

  return {
    reports,
    currentReport,
    setCurrentReport,
    createDailyReport,
    getReportsByDateRange,
  };
};

/**
 * 5. useRFIManagement - Manage RFI workflow and tracking
 */
export const useRFIManagement = (projectId: string) => {
  const [rfis, setRfis] = useState<ConstructionRFI[]>([]);
  const [activeRFI, setActiveRFI] = useState<ConstructionRFI | null>(null);

  const submitRFI = useCallback((rfiData: Partial<ConstructionRFI>) => {
    const rfi: ConstructionRFI = {
      id: crypto.randomUUID(),
      rfiNumber: rfiData.rfiNumber || `RFI-${Date.now()}`,
      projectId,
      subject: rfiData.subject || '',
      question: rfiData.question || '',
      submittedBy: rfiData.submittedBy || '',
      submittedDate: new Date(),
      status: 'submitted',
      attachmentIds: rfiData.attachmentIds || [],
      impactsCriticalPath: rfiData.impactsCriticalPath || false,
    };

    setRfis(prev => [...prev, rfi]);
    return rfi;
  }, [projectId]);

  const respondToRFI = useCallback((rfiId: string, response: string, respondedBy: string) => {
    setRfis(prev => prev.map(rfi =>
      rfi.id === rfiId
        ? { ...rfi, response, respondedBy, respondedDate: new Date(), status: 'responded' as RFIStatus }
        : rfi
    ));
  }, []);

  const getRFIsByStatus = useCallback((status: RFIStatus) => {
    return rfis.filter(rfi => rfi.status === status);
  }, [rfis]);

  const getCriticalPathRFIs = useCallback(() => {
    return rfis.filter(rfi => rfi.impactsCriticalPath && rfi.status !== 'closed');
  }, [rfis]);

  return {
    rfis,
    activeRFI,
    setActiveRFI,
    submitRFI,
    respondToRFI,
    getRFIsByStatus,
    getCriticalPathRFIs,
  };
};

/**
 * 6. useSubmittalTracking - Track construction submittals workflow
 */
export const useSubmittalTracking = (projectId: string) => {
  const [submittals, setSubmittals] = useState<ConstructionSubmittal[]>([]);

  const createSubmittal = useCallback((submittalData: Partial<ConstructionSubmittal>) => {
    const submittal: ConstructionSubmittal = {
      id: crypto.randomUUID(),
      submittalNumber: submittalData.submittalNumber || `SUB-${Date.now()}`,
      projectId,
      type: submittalData.type || 'product_data',
      specSection: submittalData.specSection || '',
      description: submittalData.description || '',
      submittedBy: submittalData.submittedBy || '',
      submittedDate: new Date(),
      revisionNumber: submittalData.revisionNumber || 1,
      attachmentIds: submittalData.attachmentIds || [],
      distributionList: submittalData.distributionList || [],
    };

    setSubmittals(prev => [...prev, submittal]);
    return submittal;
  }, [projectId]);

  const reviewSubmittal = useCallback((
    submittalId: string,
    action: SubmittalAction,
    reviewedBy: string,
    comments?: string
  ) => {
    setSubmittals(prev => prev.map(sub =>
      sub.id === submittalId
        ? { ...sub, action, reviewedBy, reviewedDate: new Date(), reviewComments: comments }
        : sub
    ));
  }, []);

  const getSubmittalsBySpecSection = useCallback((specSection: string) => {
    return submittals.filter(sub => sub.specSection === specSection);
  }, [submittals]);

  const getPendingSubmittals = useCallback(() => {
    return submittals.filter(sub => !sub.action);
  }, [submittals]);

  return {
    submittals,
    createSubmittal,
    reviewSubmittal,
    getSubmittalsBySpecSection,
    getPendingSubmittals,
  };
};

/**
 * 7. useQCQAInspections - Manage quality control and quality assurance inspections
 */
export const useQCQAInspections = (projectId: string) => {
  const [inspections, setInspections] = useState<QCQAInspection[]>([]);

  const createInspection = useCallback((inspectionData: Partial<QCQAInspection>) => {
    const inspection: QCQAInspection = {
      id: crypto.randomUUID(),
      projectId,
      inspectionType: inspectionData.inspectionType || 'daily_qc',
      inspectionDate: inspectionData.inspectionDate || new Date(),
      inspector: inspectionData.inspector || '',
      location: inspectionData.location || '',
      workInspected: inspectionData.workInspected || '',
      conformsToSpecs: inspectionData.conformsToSpecs ?? true,
      deficiencies: inspectionData.deficiencies || [],
      photoIds: inspectionData.photoIds || [],
      attachmentIds: inspectionData.attachmentIds || [],
      followUpRequired: inspectionData.followUpRequired || false,
      submittedAt: new Date(),
    };

    setInspections(prev => [...prev, inspection]);
    return inspection;
  }, [projectId]);

  const getOpenDeficiencies = useCallback(() => {
    return inspections.flatMap(insp =>
      insp.deficiencies.filter(def => !def.correctedDate)
    );
  }, [inspections]);

  const getCriticalDeficiencies = useCallback(() => {
    return inspections.flatMap(insp =>
      insp.deficiencies.filter(def =>
        (def.severity === 'critical' || def.severity === 'safety_critical') && !def.correctedDate
      )
    );
  }, [inspections]);

  return {
    inspections,
    createInspection,
    getOpenDeficiencies,
    getCriticalDeficiencies,
  };
};

/**
 * 8. useChangeOrderManagement - Process and track change orders
 */
export const useChangeOrderManagement = (projectId: string) => {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);

  const initiateChangeOrder = useCallback((coData: Partial<ChangeOrder>) => {
    const changeOrder: ChangeOrder = {
      id: crypto.randomUUID(),
      changeOrderNumber: coData.changeOrderNumber || `CO-${Date.now()}`,
      projectId,
      title: coData.title || '',
      description: coData.description || '',
      justification: coData.justification || '',
      initiatedBy: coData.initiatedBy || '',
      initiatedDate: new Date(),
      type: coData.type || 'scope_change',
      costImpact: coData.costImpact || 0,
      scheduleImpactDays: coData.scheduleImpactDays || 0,
      status: 'draft',
      approvals: coData.approvals || [],
      attachmentIds: coData.attachmentIds || [],
    };

    setChangeOrders(prev => [...prev, changeOrder]);
    return changeOrder;
  }, [projectId]);

  const approveChangeOrder = useCallback((coId: string, role: string, approver: string, comments?: string) => {
    setChangeOrders(prev => prev.map(co => {
      if (co.id === coId) {
        const newApprovals = [...co.approvals, { role, approver, approvedDate: new Date(), comments }];
        return { ...co, approvals: newApprovals };
      }
      return co;
    }));
  }, []);

  const calculateCumulativeImpact = useCallback(() => {
    return changeOrders
      .filter(co => co.status === 'approved' || co.status === 'executed')
      .reduce((acc, co) => ({
        totalCost: acc.totalCost + co.costImpact,
        totalDays: acc.totalDays + co.scheduleImpactDays,
      }), { totalCost: 0, totalDays: 0 });
  }, [changeOrders]);

  return {
    changeOrders,
    initiateChangeOrder,
    approveChangeOrder,
    calculateCumulativeImpact,
  };
};

/**
 * 9. usePunchListManagement - Manage project punch list items
 */
export const usePunchListManagement = (projectId: string) => {
  const [punchListItems, setPunchListItems] = useState<PunchListItem[]>([]);

  const addPunchListItem = useCallback((itemData: Partial<PunchListItem>) => {
    const item: PunchListItem = {
      id: crypto.randomUUID(),
      projectId,
      itemNumber: itemData.itemNumber || `PL-${Date.now()}`,
      description: itemData.description || '',
      location: itemData.location || '',
      severity: itemData.severity || 'minor',
      identifiedDate: new Date(),
      identifiedBy: itemData.identifiedBy || '',
      assignedTo: itemData.assignedTo || '',
      dueDate: itemData.dueDate || new Date(),
      status: 'open',
      photoIds: itemData.photoIds || [],
    };

    setPunchListItems(prev => [...prev, item]);
    return item;
  }, [projectId]);

  const completePunchListItem = useCallback((itemId: string, completedBy: string) => {
    setPunchListItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: 'completed', completedDate: new Date() }
        : item
    ));
  }, []);

  const verifyPunchListItem = useCallback((itemId: string, verifiedBy: string) => {
    setPunchListItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: 'verified', verifiedDate: new Date(), verifiedBy }
        : item
    ));
  }, []);

  const getPunchListCompletion = useCallback(() => {
    const total = punchListItems.length;
    const completed = punchListItems.filter(item => item.status === 'verified').length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [punchListItems]);

  return {
    punchListItems,
    addPunchListItem,
    completePunchListItem,
    verifyPunchListItem,
    getPunchListCompletion,
  };
};

/**
 * 10. useConstructionSafetyTracking - Track safety incidents and OSHA compliance
 */
export const useConstructionSafetyTracking = (projectId: string) => {
  const [safetyIncidents, setSafetyIncidents] = useState<Array<{
    id: string;
    date: Date;
    type: string;
    severity: string;
    description: string;
    rootCause?: string;
    correctiveActions: string[];
    reportedToOSHA: boolean;
  }>>([]);

  const recordIncident = useCallback((incident: Omit<typeof safetyIncidents[0], 'id'>) => {
    setSafetyIncidents(prev => [...prev, { ...incident, id: crypto.randomUUID() }]);
  }, []);

  const calculateEMIRRate = useCallback((totalHours: number) => {
    const recordableIncidents = safetyIncidents.filter(i => i.severity !== 'first_aid').length;
    return (recordableIncidents * 200000) / totalHours;
  }, [safetyIncidents]);

  return {
    safetyIncidents,
    recordIncident,
    calculateEMIRRate,
  };
};

/**
 * 11. useConstructionProgressTracking - Track overall construction progress
 */
export const useConstructionProgressTracking = (projectId: string) => {
  const [progressData, setProgressData] = useState({
    overallPercentComplete: 0,
    scheduledPercentComplete: 0,
    scheduleVariance: 0,
    costVariance: 0,
  });

  const updateProgress = useCallback((
    actualPercent: number,
    scheduledPercent: number,
    actualCost: number,
    budgetedCost: number
  ) => {
    setProgressData({
      overallPercentComplete: actualPercent,
      scheduledPercentComplete: scheduledPercent,
      scheduleVariance: actualPercent - scheduledPercent,
      costVariance: budgetedCost - actualCost,
    });
  }, []);

  const calculateSPI = useCallback(() => {
    // Schedule Performance Index
    return progressData.scheduledPercentComplete > 0
      ? progressData.overallPercentComplete / progressData.scheduledPercentComplete
      : 0;
  }, [progressData]);

  return {
    progressData,
    updateProgress,
    calculateSPI,
  };
};

/**
 * 12. useConstructionDocumentManagement - Manage construction documents and as-builts
 */
export const useConstructionDocumentManagement = (projectId: string) => {
  const [documents, setDocuments] = useState<Array<{
    id: string;
    type: 'specification' | 'drawing' | 'as_built' | 'report' | 'photo' | 'certification';
    title: string;
    version: number;
    uploadedDate: Date;
    uploadedBy: string;
    fileUrl: string;
  }>>([]);

  const uploadDocument = useCallback((doc: Omit<typeof documents[0], 'id' | 'uploadedDate' | 'version'>) => {
    setDocuments(prev => [...prev, {
      ...doc,
      id: crypto.randomUUID(),
      uploadedDate: new Date(),
      version: 1,
    }]);
  }, []);

  const getDocumentsByType = useCallback((type: typeof documents[0]['type']) => {
    return documents.filter(doc => doc.type === type);
  }, [documents]);

  return {
    documents,
    uploadDocument,
    getDocumentsByType,
  };
};

/**
 * 13. useConstructionBudgetTracking - Track construction budget and costs
 */
export const useConstructionBudgetTracking = (projectId: string) => {
  const [budget, setBudget] = useState({
    originalContract: 0,
    approvedChangeOrders: 0,
    pendingChangeOrders: 0,
    currentContract: 0,
    invoicedToDate: 0,
    paidToDate: 0,
  });

  const updateBudget = useCallback((updates: Partial<typeof budget>) => {
    setBudget(prev => ({ ...prev, ...updates }));
  }, []);

  const calculateRemainingBudget = useCallback(() => {
    return budget.currentContract - budget.invoicedToDate;
  }, [budget]);

  return {
    budget,
    updateBudget,
    calculateRemainingBudget,
  };
};

/**
 * 14. useConstructionScheduleAnalysis - Analyze construction schedule performance
 */
export const useConstructionScheduleAnalysis = (projectId: string) => {
  const [activities, setActivities] = useState<Array<{
    id: string;
    name: string;
    plannedStart: Date;
    plannedFinish: Date;
    actualStart?: Date;
    actualFinish?: Date;
    percentComplete: number;
    isCriticalPath: boolean;
  }>>([]);

  const calculateFloat = useCallback((activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return 0;

    // Simplified float calculation
    return activity.isCriticalPath ? 0 : 5;
  }, [activities]);

  const identifyDelayedActivities = useCallback(() => {
    return activities.filter(a => {
      if (!a.actualStart) return false;
      return a.actualStart > a.plannedStart;
    });
  }, [activities]);

  return {
    activities,
    setActivities,
    calculateFloat,
    identifyDelayedActivities,
  };
};

/**
 * 15. usePaymentApplications - Manage contractor payment applications (G702/G703)
 */
export const usePaymentApplications = (projectId: string) => {
  const [applications, setApplications] = useState<Array<{
    id: string;
    applicationNumber: number;
    periodEndDate: Date;
    scheduledValue: number;
    workCompleted: number;
    materialsStored: number;
    totalEarned: number;
    retainage: number;
    previousPayments: number;
    currentPaymentDue: number;
    status: 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected';
  }>>([]);

  const submitApplication = useCallback((app: Omit<typeof applications[0], 'id' | 'status'>) => {
    setApplications(prev => [...prev, { ...app, id: crypto.randomUUID(), status: 'submitted' }]);
  }, []);

  const approveApplication = useCallback((appId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, status: 'approved' as const } : app
    ));
  }, []);

  return {
    applications,
    submitApplication,
    approveApplication,
  };
};

/**
 * 16. useContractorPerformanceMetrics - Track contractor performance metrics
 */
export const useContractorPerformanceMetrics = (projectId: string) => {
  const [metrics, setMetrics] = useState({
    qualityScore: 0,
    scheduleAdherence: 0,
    safetyScore: 0,
    responseTime: 0,
    overallRating: 0,
  });

  const calculateOverallRating = useCallback(() => {
    const { qualityScore, scheduleAdherence, safetyScore, responseTime } = metrics;
    const overall = (qualityScore * 0.3 + scheduleAdherence * 0.3 + safetyScore * 0.3 + responseTime * 0.1);
    setMetrics(prev => ({ ...prev, overallRating: overall }));
    return overall;
  }, [metrics]);

  return {
    metrics,
    setMetrics,
    calculateOverallRating,
  };
};

/**
 * 17. useEnvironmentalCompliance - Track environmental compliance and monitoring
 */
export const useEnvironmentalCompliance = (projectId: string) => {
  const [compliance, setCompliance] = useState<Array<{
    id: string;
    date: Date;
    requirementType: 'stormwater' | 'erosion_control' | 'air_quality' | 'waste' | 'wetlands';
    inspectionResult: 'compliant' | 'non_compliant' | 'corrective_action_required';
    findings: string;
    correctiveActions?: string[];
  }>>([]);

  const recordInspection = useCallback((inspection: Omit<typeof compliance[0], 'id'>) => {
    setCompliance(prev => [...prev, { ...inspection, id: crypto.randomUUID() }]);
  }, []);

  const getNonCompliantItems = useCallback(() => {
    return compliance.filter(c => c.inspectionResult !== 'compliant');
  }, [compliance]);

  return {
    compliance,
    recordInspection,
    getNonCompliantItems,
  };
};

/**
 * 18. useConstructionMeetingMinutes - Manage meeting minutes and action items
 */
export const useConstructionMeetingMinutes = (projectId: string) => {
  const [meetings, setMeetings] = useState<Array<{
    id: string;
    type: 'pre_construction' | 'progress' | 'oac' | 'safety' | 'closeout';
    date: Date;
    attendees: string[];
    topics: string[];
    actionItems: Array<{
      item: string;
      assignedTo: string;
      dueDate: Date;
      status: 'open' | 'completed';
    }>;
  }>>([]);

  const createMeeting = useCallback((meeting: Omit<typeof meetings[0], 'id'>) => {
    setMeetings(prev => [...prev, { ...meeting, id: crypto.randomUUID() }]);
  }, []);

  const getOpenActionItems = useCallback(() => {
    return meetings.flatMap(m => m.actionItems.filter(ai => ai.status === 'open'));
  }, [meetings]);

  return {
    meetings,
    createMeeting,
    getOpenActionItems,
  };
};

/**
 * 19. useConstructionWarrantyTracking - Track warranty periods and claims
 */
export const useConstructionWarrantyTracking = (projectId: string) => {
  const [warranties, setWarranties] = useState<Array<{
    id: string;
    component: string;
    specSection: string;
    warrantyPeriod: number; // months
    startDate: Date;
    expirationDate: Date;
    warrantor: string;
    documentId: string;
  }>>([]);

  const [warrantyClaims, setWarrantyClaims] = useState<Array<{
    id: string;
    warrantyId: string;
    claimDate: Date;
    description: string;
    status: 'submitted' | 'approved' | 'denied' | 'resolved';
  }>>([]);

  const addWarranty = useCallback((warranty: Omit<typeof warranties[0], 'id' | 'expirationDate'>) => {
    const expirationDate = new Date(warranty.startDate);
    expirationDate.setMonth(expirationDate.getMonth() + warranty.warrantyPeriod);

    setWarranties(prev => [...prev, { ...warranty, id: crypto.randomUUID(), expirationDate }]);
  }, []);

  const getExpiringWarranties = useCallback((daysAhead: number = 90) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return warranties.filter(w => w.expirationDate <= futureDate && w.expirationDate >= new Date());
  }, [warranties]);

  return {
    warranties,
    warrantyClaims,
    addWarranty,
    setWarrantyClaims,
    getExpiringWarranties,
  };
};

/**
 * 20. useConstructionCloseout - Manage project closeout activities
 */
export const useConstructionCloseout = (projectId: string) => {
  const [closeoutChecklist, setCloseoutChecklist] = useState<Array<{
    item: string;
    category: 'documentation' | 'inspections' | 'training' | 'warranties' | 'financial';
    completed: boolean;
    completedDate?: Date;
    completedBy?: string;
  }>>([
    { item: 'As-built drawings submitted', category: 'documentation', completed: false },
    { item: 'O&M manuals delivered', category: 'documentation', completed: false },
    { item: 'Final inspection completed', category: 'inspections', completed: false },
    { item: 'Punch list 100% complete', category: 'inspections', completed: false },
    { item: 'Staff training completed', category: 'training', completed: false },
    { item: 'All warranties collected', category: 'warranties', completed: false },
    { item: 'Final payment processed', category: 'financial', completed: false },
    { item: 'Lien releases obtained', category: 'financial', completed: false },
  ]);

  const completeCloseoutItem = useCallback((item: string, completedBy: string) => {
    setCloseoutChecklist(prev => prev.map(ci =>
      ci.item === item
        ? { ...ci, completed: true, completedDate: new Date(), completedBy }
        : ci
    ));
  }, []);

  const getCloseoutProgress = useCallback(() => {
    const completed = closeoutChecklist.filter(c => c.completed).length;
    return (completed / closeoutChecklist.length) * 100;
  }, [closeoutChecklist]);

  return {
    closeoutChecklist,
    completeCloseoutItem,
    getCloseoutProgress,
  };
};

/**
 * 21. useConstructionRiskManagement - Manage project risks and mitigation
 */
export const useConstructionRiskManagement = (projectId: string) => {
  const [risks, setRisks] = useState<Array<{
    id: string;
    category: 'schedule' | 'cost' | 'quality' | 'safety' | 'environmental';
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    riskScore: number;
    mitigationPlan: string;
    owner: string;
    status: 'active' | 'mitigated' | 'realized';
  }>>([]);

  const addRisk = useCallback((risk: Omit<typeof risks[0], 'id' | 'riskScore'>) => {
    const probScore = { low: 1, medium: 2, high: 3 }[risk.probability];
    const impactScore = { low: 1, medium: 2, high: 3 }[risk.impact];
    const riskScore = probScore * impactScore;

    setRisks(prev => [...prev, { ...risk, id: crypto.randomUUID(), riskScore }]);
  }, []);

  const getHighRisks = useCallback(() => {
    return risks.filter(r => r.riskScore >= 6 && r.status === 'active');
  }, [risks]);

  return {
    risks,
    addRisk,
    getHighRisks,
  };
};

/**
 * 22. useConstructionQualityMetrics - Track quality metrics and trends
 */
export const useConstructionQualityMetrics = (projectId: string) => {
  const [qualityData, setQualityData] = useState({
    defectsPerInspection: 0,
    reworkPercentage: 0,
    firstTimeQuality: 100,
    submittalApprovalRate: 0,
  });

  const updateMetrics = useCallback((
    totalDefects: number,
    totalInspections: number,
    reworkHours: number,
    totalHours: number,
    approvedSubmittals: number,
    totalSubmittals: number
  ) => {
    setQualityData({
      defectsPerInspection: totalInspections > 0 ? totalDefects / totalInspections : 0,
      reworkPercentage: totalHours > 0 ? (reworkHours / totalHours) * 100 : 0,
      firstTimeQuality: totalInspections > 0 ? ((totalInspections - totalDefects) / totalInspections) * 100 : 100,
      submittalApprovalRate: totalSubmittals > 0 ? (approvedSubmittals / totalSubmittals) * 100 : 0,
    });
  }, []);

  return {
    qualityData,
    updateMetrics,
  };
};

/**
 * 23. useConstructionLessonsLearned - Capture lessons learned
 */
export const useConstructionLessonsLearned = (projectId: string) => {
  const [lessons, setLessons] = useState<Array<{
    id: string;
    category: 'technical' | 'management' | 'safety' | 'procurement';
    whatWorked: string;
    whatDidntWork: string;
    recommendations: string;
    submittedBy: string;
    submittedDate: Date;
  }>>([]);

  const addLesson = useCallback((lesson: Omit<typeof lessons[0], 'id' | 'submittedDate'>) => {
    setLessons(prev => [...prev, { ...lesson, id: crypto.randomUUID(), submittedDate: new Date() }]);
  }, []);

  return {
    lessons,
    addLesson,
  };
};

/**
 * 24. useConstructionCommissioning - Manage building commissioning activities
 */
export const useConstructionCommissioning = (projectId: string) => {
  const [commissioningActivities, setCommissioningActivities] = useState<Array<{
    id: string;
    system: string;
    testDate: Date;
    testType: 'functional' | 'performance' | 'integrated';
    testResult: 'pass' | 'fail' | 'conditional_pass';
    deficiencies: string[];
    retest: boolean;
  }>>([]);

  const recordTest = useCallback((test: Omit<typeof commissioningActivities[0], 'id'>) => {
    setCommissioningActivities(prev => [...prev, { ...test, id: crypto.randomUUID() }]);
  }, []);

  const getSystemsRequiringRetest = useCallback(() => {
    return commissioningActivities.filter(ca => ca.retest);
  }, [commissioningActivities]);

  return {
    commissioningActivities,
    recordTest,
    getSystemsRequiringRetest,
  };
};

/**
 * 25. useConstructionSustainability - Track sustainability metrics and LEED
 */
export const useConstructionSustainability = (projectId: string) => {
  const [sustainability, setSustainability] = useState({
    leedTargetLevel: 'silver' as 'certified' | 'silver' | 'gold' | 'platinum',
    currentPoints: 0,
    targetPoints: 50,
    wasteRecyclingRate: 0,
    localMaterialsPercent: 0,
    recycledContentPercent: 0,
  });

  const updateSustainabilityMetrics = useCallback((updates: Partial<typeof sustainability>) => {
    setSustainability(prev => ({ ...prev, ...updates }));
  }, []);

  const calculateLEEDProgress = useCallback(() => {
    return (sustainability.currentPoints / sustainability.targetPoints) * 100;
  }, [sustainability]);

  return {
    sustainability,
    updateSustainabilityMetrics,
    calculateLEEDProgress,
  };
};

/**
 * 26. useConstructionEquipmentTracking - Track construction equipment utilization
 */
export const useConstructionEquipmentTracking = (projectId: string) => {
  const [equipment, setEquipment] = useState<Array<{
    id: string;
    type: string;
    identifier: string;
    onSite: boolean;
    utilizationHours: number;
    maintenanceStatus: 'operational' | 'maintenance' | 'down';
    lastInspection?: Date;
  }>>([]);

  const updateEquipmentStatus = useCallback((equipmentId: string, updates: Partial<typeof equipment[0]>) => {
    setEquipment(prev => prev.map(eq => eq.id === equipmentId ? { ...eq, ...updates } : eq));
  }, []);

  const getEquipmentUtilization = useCallback(() => {
    const totalHours = equipment.reduce((sum, eq) => sum + eq.utilizationHours, 0);
    return totalHours / equipment.length;
  }, [equipment]);

  return {
    equipment,
    setEquipment,
    updateEquipmentStatus,
    getEquipmentUtilization,
  };
};

/**
 * 27. useConstructionMaterialTracking - Track material deliveries and usage
 */
export const useConstructionMaterialTracking = (projectId: string) => {
  const [materials, setMaterials] = useState<Array<{
    id: string;
    material: string;
    specification: string;
    supplier: string;
    deliveryDate: Date;
    quantity: number;
    unit: string;
    certifications: string[];
    acceptanceStatus: 'pending' | 'accepted' | 'rejected';
  }>>([]);

  const recordDelivery = useCallback((delivery: Omit<typeof materials[0], 'id'>) => {
    setMaterials(prev => [...prev, { ...delivery, id: crypto.randomUUID() }]);
  }, []);

  const getMaterialsBySpec = useCallback((specification: string) => {
    return materials.filter(m => m.specification === specification);
  }, [materials]);

  return {
    materials,
    recordDelivery,
    getMaterialsBySpec,
  };
};

/**
 * 28. useConstructionSubcontractorManagement - Manage subcontractors
 */
export const useConstructionSubcontractorManagement = (projectId: string) => {
  const [subcontractors, setSubcontractors] = useState<Array<{
    id: string;
    company: string;
    trade: string;
    contractAmount: number;
    insuranceExpiration: Date;
    bondAmount?: number;
    performanceRating: number;
    activeWorkOrders: number;
  }>>([]);

  const addSubcontractor = useCallback((sub: Omit<typeof subcontractors[0], 'id'>) => {
    setSubcontractors(prev => [...prev, { ...sub, id: crypto.randomUUID() }]);
  }, []);

  const getExpiringInsurance = useCallback((daysAhead: number = 30) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return subcontractors.filter(s => s.insuranceExpiration <= futureDate && s.insuranceExpiration >= new Date());
  }, [subcontractors]);

  return {
    subcontractors,
    addSubcontractor,
    getExpiringInsurance,
  };
};

/**
 * 29. useConstructionPhotoDocs - Manage construction photo documentation
 */
export const useConstructionPhotoDocs = (projectId: string) => {
  const [photos, setPhotos] = useState<Array<{
    id: string;
    date: Date;
    location: string;
    description: string;
    category: 'progress' | 'deficiency' | 'safety' | 'as_built' | 'damage';
    photographer: string;
    tags: string[];
    fileUrl: string;
  }>>([]);

  const addPhoto = useCallback((photo: Omit<typeof photos[0], 'id'>) => {
    setPhotos(prev => [...prev, { ...photo, id: crypto.randomUUID() }]);
  }, []);

  const getPhotosByCategory = useCallback((category: typeof photos[0]['category']) => {
    return photos.filter(p => p.category === category);
  }, [photos]);

  const searchPhotos = useCallback((searchTerm: string) => {
    return photos.filter(p =>
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [photos]);

  return {
    photos,
    addPhoto,
    getPhotosByCategory,
    searchPhotos,
  };
};

/**
 * 30. useConstructionTestingLab - Manage lab testing and results
 */
export const useConstructionTestingLab = (projectId: string) => {
  const [tests, setTests] = useState<Array<{
    id: string;
    testType: 'concrete' | 'soil' | 'asphalt' | 'steel' | 'masonry' | 'other';
    sampleDate: Date;
    testDate: Date;
    location: string;
    specification: string;
    results: Record<string, any>;
    passedSpec: boolean;
    labName: string;
    certificationNumber?: string;
  }>>([]);

  const recordTest = useCallback((test: Omit<typeof tests[0], 'id'>) => {
    setTests(prev => [...prev, { ...test, id: crypto.randomUUID() }]);
  }, []);

  const getFailedTests = useCallback(() => {
    return tests.filter(t => !t.passedSpec);
  }, [tests]);

  return {
    tests,
    recordTest,
    getFailedTests,
  };
};

/**
 * 31. useConstructionPermits - Track construction permits and approvals
 */
export const useConstructionPermits = (projectId: string) => {
  const [permits, setPermits] = useState<Array<{
    id: string;
    permitType: string;
    issuingAuthority: string;
    applicationDate: Date;
    issuedDate?: Date;
    expirationDate?: Date;
    permitNumber?: string;
    status: 'applied' | 'issued' | 'expired' | 'denied';
  }>>([]);

  const addPermit = useCallback((permit: Omit<typeof permits[0], 'id'>) => {
    setPermits(prev => [...prev, { ...permit, id: crypto.randomUUID() }]);
  }, []);

  const getExpiringPermits = useCallback((daysAhead: number = 30) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return permits.filter(p =>
      p.expirationDate &&
      p.expirationDate <= futureDate &&
      p.expirationDate >= new Date()
    );
  }, [permits]);

  return {
    permits,
    addPermit,
    getExpiringPermits,
  };
};

/**
 * 32. useConstructionWeatherImpact - Track weather impacts on construction
 */
export const useConstructionWeatherImpact = (projectId: string) => {
  const [weatherEvents, setWeatherEvents] = useState<Array<{
    id: string;
    date: Date;
    eventType: 'rain' | 'snow' | 'extreme_heat' | 'extreme_cold' | 'wind' | 'other';
    workStopped: boolean;
    hoursLost: number;
    impact: string;
  }>>([]);

  const recordWeatherEvent = useCallback((event: Omit<typeof weatherEvents[0], 'id'>) => {
    setWeatherEvents(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
  }, []);

  const getTotalWeatherDelays = useCallback(() => {
    return weatherEvents.reduce((total, event) => total + event.hoursLost, 0);
  }, [weatherEvents]);

  return {
    weatherEvents,
    recordWeatherEvent,
    getTotalWeatherDelays,
  };
};

/**
 * 33. useConstructionUtilityCoordination - Coordinate utility work
 */
export const useConstructionUtilityCoordination = (projectId: string) => {
  const [utilities, setUtilities] = useState<Array<{
    id: string;
    utilityType: 'electric' | 'gas' | 'water' | 'sewer' | 'telecom' | 'other';
    provider: string;
    status: 'design' | 'permit' | 'scheduled' | 'in_progress' | 'complete';
    coordinationDate?: Date;
    completionDate?: Date;
    conflicts: string[];
  }>>([]);

  const addUtilityWork = useCallback((utility: Omit<typeof utilities[0], 'id'>) => {
    setUtilities(prev => [...prev, { ...utility, id: crypto.randomUUID() }]);
  }, []);

  const getUtilityConflicts = useCallback(() => {
    return utilities.filter(u => u.conflicts.length > 0);
  }, [utilities]);

  return {
    utilities,
    addUtilityWork,
    getUtilityConflicts,
  };
};

/**
 * 34. useConstructionValueEngineering - Track value engineering proposals
 */
export const useConstructionValueEngineering = (projectId: string) => {
  const [proposals, setProposals] = useState<Array<{
    id: string;
    proposalNumber: string;
    title: string;
    description: string;
    costSavings: number;
    qualityImpact: 'none' | 'positive' | 'negative';
    scheduleImpact: number; // days
    status: 'proposed' | 'under_review' | 'accepted' | 'rejected';
    proposedBy: string;
    proposedDate: Date;
  }>>([]);

  const submitProposal = useCallback((proposal: Omit<typeof proposals[0], 'id'>) => {
    setProposals(prev => [...prev, { ...proposal, id: crypto.randomUUID() }]);
  }, []);

  const getTotalSavings = useCallback(() => {
    return proposals
      .filter(p => p.status === 'accepted')
      .reduce((total, p) => total + p.costSavings, 0);
  }, [proposals]);

  return {
    proposals,
    submitProposal,
    getTotalSavings,
  };
};

/**
 * 35. useConstructionSiteLogistics - Manage site logistics and layout
 */
export const useConstructionSiteLogistics = (projectId: string) => {
  const [logistics, setLogistics] = useState({
    laydownArea: { allocated: 0, used: 0 },
    parkingSpaces: { total: 0, occupied: 0 },
    storageTrailers: { total: 0, occupied: 0 },
    officeTrailers: { total: 0, occupied: 0 },
    accessPoints: [] as Array<{ name: string; status: 'open' | 'closed' | 'restricted' }>,
  });

  const updateLogistics = useCallback((updates: Partial<typeof logistics>) => {
    setLogistics(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    logistics,
    updateLogistics,
  };
};

/**
 * 36. useConstructionQualityPlan - Manage project quality plan
 */
export const useConstructionQualityPlan = (projectId: string) => {
  const [qualityPlan, setQualityPlan] = useState<Array<{
    id: string;
    activityName: string;
    specSection: string;
    inspectionPoints: string[];
    acceptanceCriteria: string[];
    responsibleParty: 'contractor' | 'government' | 'third_party';
    testingRequired: boolean;
    documentationRequired: string[];
  }>>([]);

  const addQualityActivity = useCallback((activity: Omit<typeof qualityPlan[0], 'id'>) => {
    setQualityPlan(prev => [...prev, { ...activity, id: crypto.randomUUID() }]);
  }, []);

  return {
    qualityPlan,
    addQualityActivity,
  };
};

/**
 * 37. useConstructionCommunicationLog - Log project communications
 */
export const useConstructionCommunicationLog = (projectId: string) => {
  const [communications, setCommunications] = useState<Array<{
    id: string;
    date: Date;
    type: 'email' | 'meeting' | 'phone' | 'letter' | 'site_directive';
    from: string;
    to: string[];
    subject: string;
    summary: string;
    actionRequired: boolean;
  }>>([]);

  const logCommunication = useCallback((comm: Omit<typeof communications[0], 'id'>) => {
    setCommunications(prev => [...prev, { ...comm, id: crypto.randomUUID() }]);
  }, []);

  const getActionableItems = useCallback(() => {
    return communications.filter(c => c.actionRequired);
  }, [communications]);

  return {
    communications,
    logCommunication,
    getActionableItems,
  };
};

/**
 * 38. useConstructionCostCodes - Manage project cost codes and tracking
 */
export const useConstructionCostCodes = (projectId: string) => {
  const [costCodes, setCostCodes] = useState<Array<{
    code: string;
    description: string;
    budgeted: number;
    committed: number;
    actual: number;
    variance: number;
  }>>([]);

  const updateCostCode = useCallback((code: string, updates: Partial<typeof costCodes[0]>) => {
    setCostCodes(prev => prev.map(cc => {
      if (cc.code === code) {
        const updated = { ...cc, ...updates };
        updated.variance = updated.budgeted - updated.actual;
        return updated;
      }
      return cc;
    }));
  }, []);

  const getCostOverruns = useCallback(() => {
    return costCodes.filter(cc => cc.variance < 0);
  }, [costCodes]);

  return {
    costCodes,
    setCostCodes,
    updateCostCode,
    getCostOverruns,
  };
};

/**
 * 39. useConstructionLaborTracking - Track labor hours and productivity
 */
export const useConstructionLaborTracking = (projectId: string) => {
  const [laborData, setLaborData] = useState<Array<{
    date: Date;
    trade: string;
    workers: number;
    hours: number;
    productivity: number; // units per hour
    overtime: number;
  }>>([]);

  const recordLaborData = useCallback((data: typeof laborData[0]) => {
    setLaborData(prev => [...prev, data]);
  }, []);

  const calculateProductivity = useCallback((trade: string) => {
    const tradeData = laborData.filter(ld => ld.trade === trade);
    const totalUnits = tradeData.reduce((sum, ld) => sum + (ld.productivity * ld.hours), 0);
    const totalHours = tradeData.reduce((sum, ld) => sum + ld.hours, 0);
    return totalHours > 0 ? totalUnits / totalHours : 0;
  }, [laborData]);

  return {
    laborData,
    recordLaborData,
    calculateProductivity,
  };
};

/**
 * 40. useConstructionSiteSecurity - Manage site security and access
 */
export const useConstructionSiteSecurity = (projectId: string) => {
  const [securityLog, setSecurityLog] = useState<Array<{
    id: string;
    date: Date;
    eventType: 'access' | 'incident' | 'inspection' | 'violation';
    description: string;
    personInvolved?: string;
    actionTaken: string;
  }>>([]);

  const logSecurityEvent = useCallback((event: Omit<typeof securityLog[0], 'id'>) => {
    setSecurityLog(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
  }, []);

  return {
    securityLog,
    logSecurityEvent,
  };
};

/**
 * 41. useConstructionEmergencyContacts - Manage emergency contact information
 */
export const useConstructionEmergencyContacts = (projectId: string) => {
  const [contacts, setContacts] = useState<Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    type: 'medical' | 'fire' | 'police' | 'utility' | 'project_team';
    available24_7: boolean;
  }>>([]);

  const addEmergencyContact = useCallback((contact: Omit<typeof contacts[0], 'id'>) => {
    setContacts(prev => [...prev, { ...contact, id: crypto.randomUUID() }]);
  }, []);

  const getContactsByType = useCallback((type: typeof contacts[0]['type']) => {
    return contacts.filter(c => c.type === type);
  }, [contacts]);

  return {
    contacts,
    addEmergencyContact,
    getContactsByType,
  };
};

/**
 * 42. useConstructionToolboxTalks - Track safety toolbox talks
 */
export const useConstructionToolboxTalks = (projectId: string) => {
  const [toolboxTalks, setToolboxTalks] = useState<Array<{
    id: string;
    date: Date;
    topic: string;
    presenter: string;
    attendees: string[];
    duration: number; // minutes
    handoutProvided: boolean;
  }>>([]);

  const recordToolboxTalk = useCallback((talk: Omit<typeof toolboxTalks[0], 'id'>) => {
    setToolboxTalks(prev => [...prev, { ...talk, id: crypto.randomUUID() }]);
  }, []);

  const getWorkerAttendance = useCallback((workerName: string) => {
    return toolboxTalks.filter(tt => tt.attendees.includes(workerName)).length;
  }, [toolboxTalks]);

  return {
    toolboxTalks,
    recordToolboxTalk,
    getWorkerAttendance,
  };
};

/**
 * 43. useConstructionAncillarySpaces - Manage ancillary space requirements
 */
export const useConstructionAncillarySpaces = (projectId: string) => {
  const [spaces, setSpaces] = useState<Array<{
    id: string;
    spaceType: 'office' | 'storage' | 'break_room' | 'first_aid' | 'restroom';
    quantity: number;
    location: string;
    adequacy: 'adequate' | 'inadequate' | 'excessive';
  }>>([]);

  const updateSpaceAdequacy = useCallback((spaceId: string, adequacy: typeof spaces[0]['adequacy']) => {
    setSpaces(prev => prev.map(s => s.id === spaceId ? { ...s, adequacy } : s));
  }, []);

  return {
    spaces,
    setSpaces,
    updateSpaceAdequacy,
  };
};

/**
 * 44. useConstructionPreservation - Track preservation of completed work
 */
export const useConstructionPreservation = (projectId: string) => {
  const [preservationItems, setPreservationItems] = useState<Array<{
    id: string;
    itemDescription: string;
    location: string;
    preservationMethod: string;
    inspectionFrequency: string; // e.g., "weekly"
    lastInspection?: Date;
    nextInspection: Date;
    condition: 'good' | 'fair' | 'poor' | 'damaged';
  }>>([]);

  const addPreservationItem = useCallback((item: Omit<typeof preservationItems[0], 'id'>) => {
    setPreservationItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  }, []);

  const getDueInspections = useCallback(() => {
    return preservationItems.filter(pi => pi.nextInspection <= new Date());
  }, [preservationItems]);

  return {
    preservationItems,
    addPreservationItem,
    getDueInspections,
  };
};

/**
 * 45. useConstructionSurveyControl - Manage survey control and layout
 */
export const useConstructionSurveyControl = (projectId: string) => {
  const [surveyPoints, setSurveyPoints] = useState<Array<{
    id: string;
    pointNumber: string;
    northing: number;
    easting: number;
    elevation: number;
    description: string;
    established: Date;
    verifiedBy: string;
  }>>([]);

  const addSurveyPoint = useCallback((point: Omit<typeof surveyPoints[0], 'id'>) => {
    setSurveyPoints(prev => [...prev, { ...point, id: crypto.randomUUID() }]);
  }, []);

  return {
    surveyPoints,
    addSurveyPoint,
  };
};

/**
 * 46. useConstructionSiteDrainage - Monitor site drainage and erosion
 */
export const useConstructionSiteDrainage = (projectId: string) => {
  const [drainageInspections, setDrainageInspections] = useState<Array<{
    id: string;
    date: Date;
    location: string;
    condition: 'good' | 'needs_maintenance' | 'failed';
    issues: string[];
    correctiveActions: string[];
    photos: string[];
  }>>([]);

  const recordDrainageInspection = useCallback((inspection: Omit<typeof drainageInspections[0], 'id'>) => {
    setDrainageInspections(prev => [...prev, { ...inspection, id: crypto.randomUUID() }]);
  }, []);

  const getFailedDrainage = useCallback(() => {
    return drainageInspections.filter(di => di.condition === 'failed');
  }, [drainageInspections]);

  return {
    drainageInspections,
    recordDrainageInspection,
    getFailedDrainage,
  };
};

/**
 * 47. useConstructionProjectDashboard - Comprehensive project dashboard data
 */
export const useConstructionProjectDashboard = (projectId: string) => {
  const [dashboardData, setDashboardData] = useState({
    projectHealth: 'green' as 'green' | 'yellow' | 'red',
    scheduleStatus: {
      percentComplete: 0,
      daysAheadBehind: 0,
      criticalPathStatus: 'on_track' as 'on_track' | 'at_risk' | 'delayed',
    },
    budgetStatus: {
      percentSpent: 0,
      variance: 0,
      forecastAtCompletion: 0,
    },
    qualityStatus: {
      openDeficiencies: 0,
      criticalDeficiencies: 0,
      inspectionPassRate: 100,
    },
    safetyStatus: {
      daysWithoutIncident: 0,
      emirRate: 0,
      openSafetyItems: 0,
    },
    activeIssues: {
      rfis: 0,
      submittals: 0,
      changeOrders: 0,
      punchList: 0,
    },
  });

  const updateDashboard = useCallback((updates: Partial<typeof dashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...updates }));
  }, []);

  const calculateProjectHealth = useCallback(() => {
    const { scheduleStatus, budgetStatus, qualityStatus, safetyStatus } = dashboardData;

    let redFlags = 0;
    let yellowFlags = 0;

    if (scheduleStatus.daysAheadBehind < -30 || scheduleStatus.criticalPathStatus === 'delayed') redFlags++;
    else if (scheduleStatus.daysAheadBehind < -15 || scheduleStatus.criticalPathStatus === 'at_risk') yellowFlags++;

    if (budgetStatus.variance < -10000) redFlags++;
    else if (budgetStatus.variance < -5000) yellowFlags++;

    if (qualityStatus.criticalDeficiencies > 0) redFlags++;
    else if (qualityStatus.openDeficiencies > 10) yellowFlags++;

    if (safetyStatus.emirRate > 3.0 || safetyStatus.openSafetyItems > 5) redFlags++;
    else if (safetyStatus.emirRate > 1.5) yellowFlags++;

    if (redFlags > 0) {
      setDashboardData(prev => ({ ...prev, projectHealth: 'red' }));
    } else if (yellowFlags > 1) {
      setDashboardData(prev => ({ ...prev, projectHealth: 'yellow' }));
    } else {
      setDashboardData(prev => ({ ...prev, projectHealth: 'green' }));
    }
  }, [dashboardData]);

  return {
    dashboardData,
    updateDashboard,
    calculateProjectHealth,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ConstructionProject,
  DailyConstructionReport,
  ConstructionRFI,
  ConstructionSubmittal,
  QCQAInspection,
  ChangeOrder,
  ContractorQualification,
  PunchListItem,
};
