/**
 * LOC: PROP-COMP-001
 * File: /reuse/property/property-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Compliance tracking modules
 *   - Regulatory reporting systems
 */

/**
 * File: /reuse/property/property-compliance-kit.ts
 * Locator: WC-PROP-COMP-001
 * Purpose: Regulatory Compliance Management Kit - Comprehensive compliance tracking and management
 *
 * Upstream: Independent utility module for property compliance operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for compliance management, tracking, reporting, and auditing
 *
 * LLM Context: Enterprise-grade regulatory compliance management utilities for property management systems.
 * Provides building code compliance, safety regulations, environmental compliance, ADA accessibility,
 * permit management, inspection scheduling, violation tracking, compliance reporting, and comprehensive
 * audit trails. Essential for maintaining regulatory compliance, managing inspections, and ensuring
 * properties meet all local, state, and federal requirements.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ComplianceRequirement {
  id: string;
  propertyId: string;
  category: ComplianceCategory;
  type: ComplianceType;
  title: string;
  description: string;
  jurisdiction: string; // City, State, Federal
  authority: string; // Governing body/agency
  code: string; // Specific code reference
  effectiveDate: Date;
  dueDate?: Date;
  renewalFrequency?: 'monthly' | 'quarterly' | 'annually' | 'biennial' | 'one-time';
  nextRenewalDate?: Date;
  priority: CompliancePriority;
  status: ComplianceStatus;
  assignedTo?: string;
  documentationRequired: string[];
  estimatedCost?: number;
  actualCost?: number;
  notes?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ComplianceCategory =
  | 'building_code'
  | 'fire_safety'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'environmental'
  | 'accessibility'
  | 'health_safety'
  | 'zoning'
  | 'occupancy'
  | 'energy'
  | 'water_quality'
  | 'structural'
  | 'security';

type ComplianceType =
  | 'permit'
  | 'license'
  | 'certification'
  | 'inspection'
  | 'registration'
  | 'approval'
  | 'testing'
  | 'reporting';

type CompliancePriority = 'critical' | 'high' | 'medium' | 'low';

type ComplianceStatus =
  | 'pending'
  | 'in_progress'
  | 'compliant'
  | 'non_compliant'
  | 'under_review'
  | 'expired'
  | 'waived'
  | 'appealed';

interface Inspection {
  id: string;
  propertyId: string;
  complianceRequirementId?: string;
  type: InspectionType;
  category: ComplianceCategory;
  scheduledDate: Date;
  completedDate?: Date;
  inspector: string;
  inspectorAgency: string;
  inspectorContact: string;
  status: InspectionStatus;
  result?: InspectionResult;
  findings: InspectionFinding[];
  violations: Violation[];
  followUpRequired: boolean;
  followUpDate?: Date;
  reportUrl?: string;
  cost?: number;
  notes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

type InspectionType =
  | 'routine'
  | 'follow_up'
  | 'complaint_driven'
  | 'pre_occupancy'
  | 'annual'
  | 'random'
  | 'emergency';

type InspectionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'passed'
  | 'failed'
  | 'cancelled'
  | 'rescheduled';

type InspectionResult = 'passed' | 'passed_with_conditions' | 'failed' | 'pending';

interface InspectionFinding {
  id: string;
  inspectionId: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  area: string;
  description: string;
  codeReference: string;
  requiresCorrection: boolean;
  correctionDeadline?: Date;
  correctedDate?: Date;
  photos?: string[];
}

interface Violation {
  id: string;
  propertyId: string;
  inspectionId?: string;
  category: ComplianceCategory;
  severity: ViolationSeverity;
  code: string;
  description: string;
  location: string;
  discoveredDate: Date;
  correctionDeadline: Date;
  status: ViolationStatus;
  assignedTo?: string;
  correctionPlan?: string;
  correctionCost?: number;
  correctedDate?: Date;
  verifiedDate?: Date;
  verifiedBy?: string;
  fineAmount?: number;
  finePaid?: boolean;
  appealStatus?: 'none' | 'filed' | 'approved' | 'denied';
  notes?: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ViolationSeverity = 'critical' | 'serious' | 'moderate' | 'minor';

type ViolationStatus =
  | 'open'
  | 'acknowledged'
  | 'correction_in_progress'
  | 'corrected'
  | 'verified'
  | 'closed'
  | 'appealed'
  | 'waived';

interface Permit {
  id: string;
  propertyId: string;
  permitNumber: string;
  type: PermitType;
  category: ComplianceCategory;
  description: string;
  issuingAuthority: string;
  applicationDate: Date;
  issuedDate?: Date;
  expirationDate?: Date;
  status: PermitStatus;
  fee: number;
  feePaid: boolean;
  contractor?: string;
  contractor_license?: string;
  estimatedValue?: number;
  workDescription: string;
  inspectionRequired: boolean;
  inspectionIds?: string[];
  conditions?: string[];
  documents?: string[];
  renewalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type PermitType =
  | 'building'
  | 'electrical'
  | 'plumbing'
  | 'mechanical'
  | 'fire'
  | 'demolition'
  | 'sign'
  | 'occupancy'
  | 'special_event'
  | 'environmental';

type PermitStatus =
  | 'application_submitted'
  | 'under_review'
  | 'approved'
  | 'issued'
  | 'active'
  | 'completed'
  | 'expired'
  | 'denied'
  | 'cancelled'
  | 'suspended';

interface AccessibilityCompliance {
  id: string;
  propertyId: string;
  standard: 'ADA' | 'FHA' | 'Section_504' | 'Local';
  area: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  description: string;
  correctionRequired: boolean;
  correctionCost?: number;
  correctionDeadline?: Date;
  lastAssessedDate: Date;
  nextAssessmentDate?: Date;
  assessor?: string;
  documentation?: string[];
  notes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface EnvironmentalCompliance {
  id: string;
  propertyId: string;
  type: EnvironmentalType;
  regulation: string;
  description: string;
  status: ComplianceStatus;
  testingRequired: boolean;
  testingFrequency?: 'monthly' | 'quarterly' | 'annually' | 'as_needed';
  lastTestDate?: Date;
  nextTestDate?: Date;
  testResults?: TestResult[];
  thresholds: Record<string, number>;
  reportingRequired: boolean;
  reportingFrequency?: 'monthly' | 'quarterly' | 'annually';
  lastReportDate?: Date;
  nextReportDate?: Date;
  violations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EnvironmentalType =
  | 'air_quality'
  | 'water_quality'
  | 'hazardous_materials'
  | 'asbestos'
  | 'lead_paint'
  | 'radon'
  | 'mold'
  | 'waste_management'
  | 'underground_storage'
  | 'stormwater';

interface TestResult {
  id: string;
  testDate: Date;
  parameter: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'pass' | 'fail' | 'warning';
  lab?: string;
  certificationNumber?: string;
  reportUrl?: string;
}

interface ComplianceReport {
  id: string;
  propertyId: string;
  reportType: ReportType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  generatedDate: Date;
  generatedBy: string;
  summary: {
    totalRequirements: number;
    compliant: number;
    nonCompliant: number;
    pending: number;
    complianceRate: number;
  };
  details: Record<string, any>;
  recommendations?: string[];
  actionItems?: string[];
  dueDate?: Date;
  submittedDate?: Date;
  recipientAgency?: string;
  confirmationNumber?: string;
  status: 'draft' | 'final' | 'submitted' | 'accepted' | 'rejected';
}

type ReportType =
  | 'monthly_compliance'
  | 'annual_compliance'
  | 'safety_audit'
  | 'accessibility_audit'
  | 'environmental_report'
  | 'building_inspection'
  | 'fire_safety'
  | 'elevator_inspection'
  | 'custom';

interface AuditTrail {
  id: string;
  entityType: 'requirement' | 'inspection' | 'violation' | 'permit' | 'report';
  entityId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: Date;
  changes?: Record<string, { old: any; new: any }>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'expired'
  | 'renewed';

interface ComplianceValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations?: string[];
}

// ============================================================================
// COMPLIANCE REQUIREMENT TRACKING
// ============================================================================

/**
 * Creates a new compliance requirement.
 *
 * @param {Partial<ComplianceRequirement>} data - Compliance requirement data
 * @returns {ComplianceRequirement} Created compliance requirement
 *
 * @example
 * ```typescript
 * const requirement = createComplianceRequirement({
 *   propertyId: 'PROP-001',
 *   category: 'fire_safety',
 *   type: 'inspection',
 *   title: 'Annual Fire Safety Inspection',
 *   description: 'Required annual fire suppression system inspection',
 *   jurisdiction: 'City of Los Angeles',
 *   authority: 'LA Fire Department',
 *   code: 'LAFD-FSI-2024',
 *   effectiveDate: new Date(),
 *   priority: 'high',
 *   renewalFrequency: 'annually'
 * });
 * ```
 */
export const createComplianceRequirement = (
  data: Partial<ComplianceRequirement>,
): ComplianceRequirement => {
  const now = new Date();

  return {
    id: data.id || `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    category: data.category!,
    type: data.type!,
    title: data.title || '',
    description: data.description || '',
    jurisdiction: data.jurisdiction || '',
    authority: data.authority || '',
    code: data.code || '',
    effectiveDate: data.effectiveDate || now,
    dueDate: data.dueDate,
    renewalFrequency: data.renewalFrequency,
    nextRenewalDate: data.nextRenewalDate,
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    assignedTo: data.assignedTo,
    documentationRequired: data.documentationRequired || [],
    estimatedCost: data.estimatedCost,
    actualCost: data.actualCost,
    notes: data.notes || [],
    tags: data.tags || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Updates compliance requirement status.
 *
 * @param {ComplianceRequirement} requirement - Compliance requirement
 * @param {ComplianceStatus} newStatus - New status
 * @param {string} updatedBy - User making the update
 * @param {string} reason - Reason for status change
 * @returns {ComplianceRequirement} Updated requirement
 *
 * @example
 * ```typescript
 * const updated = updateComplianceStatus(
 *   requirement,
 *   'compliant',
 *   'inspector-123',
 *   'All documentation verified and approved'
 * );
 * ```
 */
export const updateComplianceStatus = (
  requirement: ComplianceRequirement,
  newStatus: ComplianceStatus,
  updatedBy: string,
  reason: string,
): ComplianceRequirement => {
  return {
    ...requirement,
    status: newStatus,
    updatedAt: new Date(),
    notes: [
      ...(requirement.notes || []),
      `Status changed to ${newStatus} by ${updatedBy}: ${reason}`,
    ],
  };
};

/**
 * Calculates next renewal date for compliance requirement.
 *
 * @param {ComplianceRequirement} requirement - Compliance requirement
 * @returns {Date | null} Next renewal date
 *
 * @example
 * ```typescript
 * const nextRenewal = calculateNextRenewalDate(requirement);
 * // Returns: Date one year from last renewal for annual requirements
 * ```
 */
export const calculateNextRenewalDate = (
  requirement: ComplianceRequirement,
): Date | null => {
  if (!requirement.renewalFrequency || requirement.renewalFrequency === 'one-time') {
    return null;
  }

  const baseDate = requirement.nextRenewalDate || requirement.effectiveDate;
  const next = new Date(baseDate);

  switch (requirement.renewalFrequency) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      break;
    case 'biennial':
      next.setFullYear(next.getFullYear() + 2);
      break;
  }

  return next;
};

/**
 * Checks if compliance requirement is overdue.
 *
 * @param {ComplianceRequirement} requirement - Compliance requirement
 * @returns {boolean} True if overdue
 *
 * @example
 * ```typescript
 * const overdue = isComplianceOverdue(requirement);
 * // Returns: true if past due date and not compliant
 * ```
 */
export const isComplianceOverdue = (requirement: ComplianceRequirement): boolean => {
  if (requirement.status === 'compliant' || requirement.status === 'waived') {
    return false;
  }

  const dueDate = requirement.dueDate || requirement.nextRenewalDate;
  if (!dueDate) {
    return false;
  }

  return new Date() > dueDate;
};

/**
 * Gets compliance requirements by category.
 *
 * @param {ComplianceRequirement[]} requirements - All requirements
 * @param {ComplianceCategory} category - Category to filter by
 * @returns {ComplianceRequirement[]} Filtered requirements
 *
 * @example
 * ```typescript
 * const fireSafety = getRequirementsByCategory(requirements, 'fire_safety');
 * ```
 */
export const getRequirementsByCategory = (
  requirements: ComplianceRequirement[],
  category: ComplianceCategory,
): ComplianceRequirement[] => {
  return requirements.filter(req => req.category === category);
};

// ============================================================================
// BUILDING CODE COMPLIANCE
// ============================================================================

/**
 * Validates building code compliance.
 *
 * @param {string} propertyId - Property ID
 * @param {ComplianceRequirement[]} requirements - Compliance requirements
 * @returns {ComplianceValidation} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateBuildingCodeCompliance('PROP-001', requirements);
 * if (!validation.isValid) {
 *   console.log('Compliance issues:', validation.errors);
 * }
 * ```
 */
export const validateBuildingCodeCompliance = (
  propertyId: string,
  requirements: ComplianceRequirement[],
): ComplianceValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const buildingReqs = requirements.filter(
    req => req.propertyId === propertyId && req.category === 'building_code',
  );

  // Check for overdue requirements
  buildingReqs.forEach(req => {
    if (isComplianceOverdue(req)) {
      errors.push(`${req.title} is overdue (Due: ${req.dueDate?.toLocaleDateString()})`);
    }

    if (req.status === 'non_compliant') {
      errors.push(`${req.title} is non-compliant: ${req.description}`);
    }

    if (req.status === 'pending' && req.priority === 'critical') {
      warnings.push(`Critical requirement pending: ${req.title}`);
    }
  });

  // Check for upcoming renewals (within 30 days)
  const thirtyDaysOut = new Date();
  thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);

  buildingReqs.forEach(req => {
    if (req.nextRenewalDate && req.nextRenewalDate <= thirtyDaysOut) {
      warnings.push(`${req.title} renewal due soon: ${req.nextRenewalDate.toLocaleDateString()}`);
    }
  });

  if (errors.length === 0 && warnings.length === 0) {
    recommendations.push('All building code requirements are current');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
  };
};

/**
 * Generates building code compliance checklist.
 *
 * @param {string} buildingType - Type of building
 * @param {string} jurisdiction - Jurisdiction code
 * @returns {string[]} Compliance checklist items
 *
 * @example
 * ```typescript
 * const checklist = generateBuildingCodeChecklist('multi_family', 'CA-LA');
 * // Returns: ['Fire sprinkler system inspection', 'Emergency exit signs', ...]
 * ```
 */
export const generateBuildingCodeChecklist = (
  buildingType: string,
  jurisdiction: string,
): string[] => {
  const baseChecklist = [
    'Current occupancy permit',
    'Fire alarm system functional and inspected',
    'Emergency exit routes clearly marked',
    'Fire extinguishers current and accessible',
    'Electrical systems up to code',
    'Plumbing systems compliant',
    'HVAC systems inspected and maintained',
    'Structural integrity verified',
    'Elevator safety inspection (if applicable)',
    'Stairway and railing compliance',
  ];

  const additionalChecks: Record<string, string[]> = {
    multi_family: [
      'Balcony load capacity certification',
      'Common area lighting adequate',
      'Trash disposal area compliance',
      'Parking area safety standards',
    ],
    commercial: [
      'ADA accessibility compliance',
      'Commercial kitchen compliance (if applicable)',
      'Loading dock safety standards',
      'Hazardous material storage (if applicable)',
    ],
    industrial: [
      'Industrial ventilation systems',
      'Hazardous waste handling compliance',
      'Machine guarding standards',
      'Warehouse racking inspection',
    ],
  };

  return [...baseChecklist, ...(additionalChecks[buildingType] || [])];
};

/**
 * Calculates building code compliance score.
 *
 * @param {ComplianceRequirement[]} requirements - Building code requirements
 * @returns {number} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateBuildingCodeScore(requirements);
 * // Returns: 92 (92% compliant)
 * ```
 */
export const calculateBuildingCodeScore = (
  requirements: ComplianceRequirement[],
): number => {
  if (requirements.length === 0) return 100;

  const weights: Record<CompliancePriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  let totalWeight = 0;
  let compliantWeight = 0;

  requirements.forEach(req => {
    const weight = weights[req.priority];
    totalWeight += weight;

    if (req.status === 'compliant') {
      compliantWeight += weight;
    } else if (req.status === 'in_progress') {
      compliantWeight += weight * 0.5; // 50% credit for in-progress
    }
  });

  return totalWeight > 0 ? Math.round((compliantWeight / totalWeight) * 100) : 100;
};

/**
 * Identifies critical building code violations.
 *
 * @param {ComplianceRequirement[]} requirements - Compliance requirements
 * @returns {ComplianceRequirement[]} Critical violations
 *
 * @example
 * ```typescript
 * const critical = identifyCriticalViolations(requirements);
 * ```
 */
export const identifyCriticalViolations = (
  requirements: ComplianceRequirement[],
): ComplianceRequirement[] => {
  return requirements.filter(
    req =>
      req.priority === 'critical' &&
      (req.status === 'non_compliant' || isComplianceOverdue(req)),
  );
};

// ============================================================================
// SAFETY REGULATION COMPLIANCE
// ============================================================================

/**
 * Creates safety compliance checklist.
 *
 * @param {string} propertyId - Property ID
 * @param {ComplianceCategory} category - Safety category
 * @returns {object} Safety checklist
 *
 * @example
 * ```typescript
 * const checklist = createSafetyComplianceChecklist('PROP-001', 'fire_safety');
 * ```
 */
export const createSafetyComplianceChecklist = (
  propertyId: string,
  category: ComplianceCategory,
): object => {
  const checklists: Record<ComplianceCategory, string[]> = {
    fire_safety: [
      'Fire alarm system tested and operational',
      'Fire sprinkler system inspected',
      'Fire extinguishers current and accessible',
      'Emergency exit lights functional',
      'Exit routes clear and marked',
      'Fire doors operational',
      'Smoke detectors tested',
      'Fire suppression system certified',
      'Emergency evacuation plan posted',
      'Fire drill conducted (if required)',
    ],
    electrical: [
      'Electrical panels labeled and accessible',
      'GFCI outlets in wet areas',
      'No exposed wiring',
      'Proper grounding verified',
      'Circuit load within limits',
      'Emergency generator tested (if applicable)',
      'Electrical inspection current',
    ],
    health_safety: [
      'Potable water quality tested',
      'Pest control current',
      'Ventilation adequate',
      'Temperature controls functional',
      'Sanitation facilities compliant',
      'First aid supplies available',
      'Safety data sheets current (if required)',
    ],
    structural: [
      'Foundation inspected',
      'Load-bearing walls assessed',
      'Roof integrity verified',
      'Balconies and decks load-tested',
      'Retaining walls stable',
      'Seismic upgrades (if required)',
    ],
    building_code: [],
    plumbing: [],
    hvac: [],
    environmental: [],
    accessibility: [],
    zoning: [],
    occupancy: [],
    energy: [],
    water_quality: [],
    security: [],
  };

  return {
    propertyId,
    category,
    items: checklists[category] || [],
    createdDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };
};

/**
 * Tracks safety regulation updates.
 *
 * @param {string} jurisdiction - Jurisdiction
 * @param {Date} lastCheckDate - Last check date
 * @returns {object[]} Regulatory updates
 *
 * @example
 * ```typescript
 * const updates = trackSafetyRegulationUpdates('CA-LA', new Date('2025-01-01'));
 * ```
 */
export const trackSafetyRegulationUpdates = (
  jurisdiction: string,
  lastCheckDate: Date,
): object[] => {
  // In production, this would fetch from regulatory database
  return [
    {
      jurisdiction,
      effectiveDate: new Date(),
      category: 'fire_safety',
      title: 'Updated Fire Sprinkler Requirements',
      description: 'New requirements for high-rise buildings',
      impactLevel: 'high',
      complianceDeadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      source: 'State Fire Marshal',
      url: 'https://example.gov/regulations/fire-2025',
    },
  ];
};

// ============================================================================
// ENVIRONMENTAL COMPLIANCE
// ============================================================================

/**
 * Creates environmental compliance tracking record.
 *
 * @param {Partial<EnvironmentalCompliance>} data - Environmental compliance data
 * @returns {EnvironmentalCompliance} Environmental compliance record
 *
 * @example
 * ```typescript
 * const envCompliance = createEnvironmentalCompliance({
 *   propertyId: 'PROP-001',
 *   type: 'water_quality',
 *   regulation: 'EPA Safe Drinking Water Act',
 *   description: 'Monthly water quality testing',
 *   testingRequired: true,
 *   testingFrequency: 'monthly',
 *   thresholds: { lead: 15, copper: 1300 }
 * });
 * ```
 */
export const createEnvironmentalCompliance = (
  data: Partial<EnvironmentalCompliance>,
): EnvironmentalCompliance => {
  const now = new Date();

  return {
    id: data.id || `ENV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    type: data.type!,
    regulation: data.regulation || '',
    description: data.description || '',
    status: data.status || 'pending',
    testingRequired: data.testingRequired || false,
    testingFrequency: data.testingFrequency,
    lastTestDate: data.lastTestDate,
    nextTestDate: data.nextTestDate,
    testResults: data.testResults || [],
    thresholds: data.thresholds || {},
    reportingRequired: data.reportingRequired || false,
    reportingFrequency: data.reportingFrequency,
    lastReportDate: data.lastReportDate,
    nextReportDate: data.nextReportDate,
    violations: data.violations || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Records environmental test result.
 *
 * @param {EnvironmentalCompliance} compliance - Environmental compliance record
 * @param {Omit<TestResult, 'id'>} testData - Test result data
 * @returns {EnvironmentalCompliance} Updated compliance record
 *
 * @example
 * ```typescript
 * const updated = recordEnvironmentalTestResult(compliance, {
 *   testDate: new Date(),
 *   parameter: 'lead',
 *   value: 12,
 *   unit: 'ppb',
 *   threshold: 15,
 *   status: 'pass',
 *   lab: 'ABC Testing Lab',
 *   certificationNumber: 'CERT-2025-001'
 * });
 * ```
 */
export const recordEnvironmentalTestResult = (
  compliance: EnvironmentalCompliance,
  testData: Omit<TestResult, 'id'>,
): EnvironmentalCompliance => {
  const result: TestResult = {
    id: `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...testData,
  };

  const testResults = [...(compliance.testResults || []), result];

  // Update status based on test results
  const hasFailed = testResults.some(r => r.status === 'fail');
  const newStatus: ComplianceStatus = hasFailed ? 'non_compliant' : 'compliant';

  return {
    ...compliance,
    testResults,
    lastTestDate: testData.testDate,
    status: newStatus,
    updatedAt: new Date(),
  };
};

/**
 * Checks environmental compliance thresholds.
 *
 * @param {TestResult[]} testResults - Test results
 * @param {Record<string, number>} thresholds - Threshold limits
 * @returns {object} Threshold analysis
 *
 * @example
 * ```typescript
 * const analysis = checkEnvironmentalThresholds(
 *   testResults,
 *   { lead: 15, copper: 1300, nitrate: 10 }
 * );
 * ```
 */
export const checkEnvironmentalThresholds = (
  testResults: TestResult[],
  thresholds: Record<string, number>,
): {
  compliant: boolean;
  violations: string[];
  warnings: string[];
} => {
  const violations: string[] = [];
  const warnings: string[] = [];

  testResults.forEach(result => {
    const threshold = thresholds[result.parameter];
    if (!threshold) return;

    if (result.value > threshold) {
      violations.push(
        `${result.parameter}: ${result.value} ${result.unit} exceeds threshold of ${threshold} ${result.unit}`,
      );
    } else if (result.value > threshold * 0.8) {
      warnings.push(
        `${result.parameter}: ${result.value} ${result.unit} approaching threshold of ${threshold} ${result.unit}`,
      );
    }
  });

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
};

/**
 * Generates environmental compliance report.
 *
 * @param {EnvironmentalCompliance[]} compliance - Environmental compliance records
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Environmental compliance report
 *
 * @example
 * ```typescript
 * const report = generateEnvironmentalReport(
 *   envRecords,
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
export const generateEnvironmentalReport = (
  compliance: EnvironmentalCompliance[],
  startDate: Date,
  endDate: Date,
): object => {
  const filtered = compliance.filter(
    c => c.lastTestDate && c.lastTestDate >= startDate && c.lastTestDate <= endDate,
  );

  const byType: Record<string, number> = {};
  filtered.forEach(c => {
    byType[c.type] = (byType[c.type] || 0) + 1;
  });

  const allTests = filtered.flatMap(c => c.testResults || []);
  const failedTests = allTests.filter(t => t.status === 'fail');

  return {
    period: { startDate, endDate },
    totalCompliance: filtered.length,
    byType,
    testingSummary: {
      totalTests: allTests.length,
      passed: allTests.filter(t => t.status === 'pass').length,
      failed: failedTests.length,
      warnings: allTests.filter(t => t.status === 'warning').length,
    },
    violations: filtered.filter(c => c.status === 'non_compliant'),
    complianceRate: filtered.length > 0
      ? ((filtered.filter(c => c.status === 'compliant').length / filtered.length) * 100).toFixed(2)
      : 100,
    generatedDate: new Date(),
  };
};

// ============================================================================
// ACCESSIBILITY COMPLIANCE (ADA)
// ============================================================================

/**
 * Creates accessibility compliance assessment.
 *
 * @param {Partial<AccessibilityCompliance>} data - Accessibility compliance data
 * @returns {AccessibilityCompliance} Accessibility compliance record
 *
 * @example
 * ```typescript
 * const assessment = createAccessibilityCompliance({
 *   propertyId: 'PROP-001',
 *   standard: 'ADA',
 *   area: 'Main Entrance',
 *   requirement: 'Wheelchair accessible ramp',
 *   status: 'compliant',
 *   description: 'Ramp meets ADA slope and width requirements'
 * });
 * ```
 */
export const createAccessibilityCompliance = (
  data: Partial<AccessibilityCompliance>,
): AccessibilityCompliance => {
  const now = new Date();

  return {
    id: data.id || `ADA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    standard: data.standard || 'ADA',
    area: data.area || '',
    requirement: data.requirement || '',
    status: data.status || 'non_compliant',
    description: data.description || '',
    correctionRequired: data.correctionRequired || false,
    correctionCost: data.correctionCost,
    correctionDeadline: data.correctionDeadline,
    lastAssessedDate: data.lastAssessedDate || now,
    nextAssessmentDate: data.nextAssessmentDate,
    assessor: data.assessor,
    documentation: data.documentation || [],
    notes: data.notes || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Generates ADA compliance checklist.
 *
 * @param {string} areaType - Type of area to assess
 * @returns {string[]} ADA compliance checklist
 *
 * @example
 * ```typescript
 * const checklist = generateADAChecklist('entrance');
 * // Returns: ['Accessible parking spaces', 'Ramp with proper slope', ...]
 * ```
 */
export const generateADAChecklist = (areaType: string): string[] => {
  const checklists: Record<string, string[]> = {
    entrance: [
      'Accessible parking spaces with proper signage',
      'Curb ramps at proper slope (1:12 or less)',
      'Level landing at entrance (60" x 60" minimum)',
      'Door width minimum 32" clear opening',
      'Door hardware operable with one hand',
      'Kick plates on doors',
      'Accessible doorbell or intercom',
      'Proper lighting',
    ],
    restroom: [
      'Accessible stall minimum 60" wide',
      'Grab bars properly installed',
      'Toilet seat height 17-19 inches',
      'Sink height 34" maximum',
      'Faucet controls operable with one hand',
      'Accessible mirror (40" maximum height)',
      'Clear floor space for wheelchair turning',
      'Accessible paper towel dispenser',
    ],
    common_area: [
      'Accessible route width minimum 36"',
      'Level changes not exceeding 1/2"',
      'Ramps at proper slope where needed',
      'Handrails on both sides of ramps/stairs',
      'Elevator (if multi-story)',
      'Elevator controls at accessible height',
      'Braille signage where required',
      'Accessible seating available',
    ],
    parking: [
      'Required number of accessible spaces',
      'Proper size (96" wide + 60" access aisle)',
      'Van accessible space (132" wide)',
      'ISA (wheelchair) symbol signage',
      'Level surface (2% maximum slope)',
      'Accessible route to entrance',
      'Wheel stops not blocking access aisle',
    ],
  };

  return checklists[areaType] || checklists.common_area;
};

/**
 * Calculates ADA compliance score.
 *
 * @param {AccessibilityCompliance[]} assessments - Accessibility assessments
 * @returns {object} Compliance score breakdown
 *
 * @example
 * ```typescript
 * const score = calculateADAComplianceScore(assessments);
 * // Returns: { overallScore: 85, byArea: {...}, recommendations: [...] }
 * ```
 */
export const calculateADAComplianceScore = (
  assessments: AccessibilityCompliance[],
): {
  overallScore: number;
  byArea: Record<string, number>;
  byStandard: Record<string, number>;
  recommendations: string[];
} => {
  if (assessments.length === 0) {
    return { overallScore: 0, byArea: {}, byStandard: {}, recommendations: [] };
  }

  const compliant = assessments.filter(a => a.status === 'compliant').length;
  const partial = assessments.filter(a => a.status === 'partial').length;

  const overallScore = Math.round(
    ((compliant + partial * 0.5) / assessments.length) * 100,
  );

  // By area
  const byArea: Record<string, number> = {};
  const areaGroups: Record<string, AccessibilityCompliance[]> = {};

  assessments.forEach(a => {
    if (!areaGroups[a.area]) areaGroups[a.area] = [];
    areaGroups[a.area].push(a);
  });

  Object.entries(areaGroups).forEach(([area, items]) => {
    const areaCompliant = items.filter(i => i.status === 'compliant').length;
    byArea[area] = Math.round((areaCompliant / items.length) * 100);
  });

  // By standard
  const byStandard: Record<string, number> = {};
  const standardGroups: Record<string, AccessibilityCompliance[]> = {};

  assessments.forEach(a => {
    if (!standardGroups[a.standard]) standardGroups[a.standard] = [];
    standardGroups[a.standard].push(a);
  });

  Object.entries(standardGroups).forEach(([standard, items]) => {
    const stdCompliant = items.filter(i => i.status === 'compliant').length;
    byStandard[standard] = Math.round((stdCompliant / items.length) * 100);
  });

  // Recommendations
  const recommendations: string[] = [];
  const nonCompliant = assessments.filter(
    a => a.status === 'non_compliant' && a.correctionRequired,
  );

  if (nonCompliant.length > 0) {
    recommendations.push(`Address ${nonCompliant.length} critical accessibility issues`);
  }

  return { overallScore, byArea, byStandard, recommendations };
};

// ============================================================================
// PERMIT AND LICENSE MANAGEMENT
// ============================================================================

/**
 * Creates a new permit application.
 *
 * @param {Partial<Permit>} data - Permit data
 * @returns {Permit} Created permit
 *
 * @example
 * ```typescript
 * const permit = createPermit({
 *   propertyId: 'PROP-001',
 *   permitNumber: 'BLD-2025-0123',
 *   type: 'building',
 *   category: 'building_code',
 *   description: 'Bathroom renovation',
 *   issuingAuthority: 'City Building Department',
 *   applicationDate: new Date(),
 *   fee: 250,
 *   feePaid: true,
 *   workDescription: 'Replace tub, tile, fixtures',
 *   inspectionRequired: true
 * });
 * ```
 */
export const createPermit = (data: Partial<Permit>): Permit => {
  const now = new Date();

  return {
    id: data.id || `PERMIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    permitNumber: data.permitNumber || `TEMP-${Date.now()}`,
    type: data.type!,
    category: data.category!,
    description: data.description || '',
    issuingAuthority: data.issuingAuthority || '',
    applicationDate: data.applicationDate || now,
    issuedDate: data.issuedDate,
    expirationDate: data.expirationDate,
    status: data.status || 'application_submitted',
    fee: data.fee || 0,
    feePaid: data.feePaid || false,
    contractor: data.contractor,
    contractor_license: data.contractor_license,
    estimatedValue: data.estimatedValue,
    workDescription: data.workDescription || '',
    inspectionRequired: data.inspectionRequired || false,
    inspectionIds: data.inspectionIds || [],
    conditions: data.conditions || [],
    documents: data.documents || [],
    renewalDate: data.renewalDate,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Updates permit status.
 *
 * @param {Permit} permit - Permit to update
 * @param {PermitStatus} newStatus - New status
 * @param {Date} statusDate - Status change date
 * @returns {Permit} Updated permit
 *
 * @example
 * ```typescript
 * const updated = updatePermitStatus(permit, 'issued', new Date());
 * ```
 */
export const updatePermitStatus = (
  permit: Permit,
  newStatus: PermitStatus,
  statusDate: Date,
): Permit => {
  const updates: Partial<Permit> = {
    status: newStatus,
    updatedAt: new Date(),
  };

  if (newStatus === 'issued' && !permit.issuedDate) {
    updates.issuedDate = statusDate;
    // Set expiration date to 1 year from issue
    updates.expirationDate = new Date(statusDate);
    updates.expirationDate.setFullYear(statusDate.getFullYear() + 1);
  }

  if (newStatus === 'active') {
    updates.issuedDate = updates.issuedDate || statusDate;
  }

  return { ...permit, ...updates };
};

/**
 * Checks for expiring permits.
 *
 * @param {Permit[]} permits - All permits
 * @param {number} daysThreshold - Days before expiration to flag
 * @returns {Permit[]} Expiring permits
 *
 * @example
 * ```typescript
 * const expiring = checkExpiringPermits(permits, 30);
 * // Returns permits expiring within 30 days
 * ```
 */
export const checkExpiringPermits = (
  permits: Permit[],
  daysThreshold: number,
): Permit[] => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return permits.filter(permit => {
    if (!permit.expirationDate) return false;
    if (permit.status === 'expired' || permit.status === 'completed') return false;
    return permit.expirationDate <= thresholdDate;
  });
};

/**
 * Generates permit compliance report.
 *
 * @param {Permit[]} permits - All permits
 * @param {string} propertyId - Property ID
 * @returns {object} Permit compliance report
 *
 * @example
 * ```typescript
 * const report = generatePermitReport(permits, 'PROP-001');
 * ```
 */
export const generatePermitReport = (
  permits: Permit[],
  propertyId: string,
): object => {
  const propertyPermits = permits.filter(p => p.propertyId === propertyId);

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};

  propertyPermits.forEach(permit => {
    byStatus[permit.status] = (byStatus[permit.status] || 0) + 1;
    byType[permit.type] = (byType[permit.type] || 0) + 1;
  });

  const active = propertyPermits.filter(p => p.status === 'active' || p.status === 'issued');
  const expired = propertyPermits.filter(p => p.status === 'expired');
  const pending = propertyPermits.filter(
    p => p.status === 'application_submitted' || p.status === 'under_review',
  );

  const totalFees = propertyPermits.reduce((sum, p) => sum + p.fee, 0);
  const unpaidFees = propertyPermits
    .filter(p => !p.feePaid)
    .reduce((sum, p) => sum + p.fee, 0);

  return {
    propertyId,
    summary: {
      total: propertyPermits.length,
      active: active.length,
      expired: expired.length,
      pending: pending.length,
    },
    byStatus,
    byType,
    financial: {
      totalFees,
      unpaidFees,
      paidFees: totalFees - unpaidFees,
    },
    expiringWithin30Days: checkExpiringPermits(propertyPermits, 30).length,
    generatedDate: new Date(),
  };
};

// ============================================================================
// INSPECTION SCHEDULING AND TRACKING
// ============================================================================

/**
 * Schedules a compliance inspection.
 *
 * @param {Partial<Inspection>} data - Inspection data
 * @returns {Inspection} Created inspection
 *
 * @example
 * ```typescript
 * const inspection = scheduleInspection({
 *   propertyId: 'PROP-001',
 *   type: 'annual',
 *   category: 'fire_safety',
 *   scheduledDate: new Date('2025-11-15T10:00:00'),
 *   inspector: 'John Smith',
 *   inspectorAgency: 'City Fire Department',
 *   inspectorContact: 'jsmith@cityfire.gov'
 * });
 * ```
 */
export const scheduleInspection = (data: Partial<Inspection>): Inspection => {
  const now = new Date();

  return {
    id: data.id || `INSP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    complianceRequirementId: data.complianceRequirementId,
    type: data.type || 'routine',
    category: data.category!,
    scheduledDate: data.scheduledDate || now,
    completedDate: data.completedDate,
    inspector: data.inspector || '',
    inspectorAgency: data.inspectorAgency || '',
    inspectorContact: data.inspectorContact || '',
    status: data.status || 'scheduled',
    result: data.result,
    findings: data.findings || [],
    violations: data.violations || [],
    followUpRequired: data.followUpRequired || false,
    followUpDate: data.followUpDate,
    reportUrl: data.reportUrl,
    cost: data.cost,
    notes: data.notes || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Records inspection completion.
 *
 * @param {Inspection} inspection - Inspection to complete
 * @param {InspectionResult} result - Inspection result
 * @param {InspectionFinding[]} findings - Inspection findings
 * @returns {Inspection} Completed inspection
 *
 * @example
 * ```typescript
 * const completed = completeInspection(
 *   inspection,
 *   'passed_with_conditions',
 *   [{ severity: 'minor', area: 'Kitchen', description: '...' }]
 * );
 * ```
 */
export const completeInspection = (
  inspection: Inspection,
  result: InspectionResult,
  findings: InspectionFinding[],
): Inspection => {
  const now = new Date();

  const status: InspectionStatus =
    result === 'passed' ? 'passed' :
    result === 'failed' ? 'failed' :
    'completed';

  const followUpRequired =
    result === 'failed' ||
    result === 'passed_with_conditions' ||
    findings.some(f => f.requiresCorrection);

  return {
    ...inspection,
    completedDate: now,
    result,
    findings,
    status,
    followUpRequired,
    updatedAt: now,
  };
};

/**
 * Gets upcoming inspections.
 *
 * @param {Inspection[]} inspections - All inspections
 * @param {number} daysAhead - Number of days to look ahead
 * @returns {Inspection[]} Upcoming inspections
 *
 * @example
 * ```typescript
 * const upcoming = getUpcomingInspections(inspections, 7);
 * // Returns inspections scheduled within next 7 days
 * ```
 */
export const getUpcomingInspections = (
  inspections: Inspection[],
  daysAhead: number,
): Inspection[] => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);

  return inspections
    .filter(
      insp =>
        insp.status === 'scheduled' &&
        insp.scheduledDate >= now &&
        insp.scheduledDate <= futureDate,
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

/**
 * Reschedules an inspection.
 *
 * @param {Inspection} inspection - Inspection to reschedule
 * @param {Date} newDate - New inspection date
 * @param {string} reason - Reason for rescheduling
 * @returns {Inspection} Rescheduled inspection
 *
 * @example
 * ```typescript
 * const rescheduled = rescheduleInspection(
 *   inspection,
 *   new Date('2025-11-20T14:00:00'),
 *   'Inspector unavailable on original date'
 * );
 * ```
 */
export const rescheduleInspection = (
  inspection: Inspection,
  newDate: Date,
  reason: string,
): Inspection => {
  return {
    ...inspection,
    scheduledDate: newDate,
    status: 'rescheduled',
    notes: [
      ...(inspection.notes || []),
      `Rescheduled to ${newDate.toISOString()}: ${reason}`,
    ],
    updatedAt: new Date(),
  };
};

// ============================================================================
// COMPLIANCE VIOLATION MANAGEMENT
// ============================================================================

/**
 * Creates a compliance violation record.
 *
 * @param {Partial<Violation>} data - Violation data
 * @returns {Violation} Created violation
 *
 * @example
 * ```typescript
 * const violation = createViolation({
 *   propertyId: 'PROP-001',
 *   category: 'fire_safety',
 *   severity: 'serious',
 *   code: 'FIRE-2024-101',
 *   description: 'Blocked fire exit',
 *   location: 'East wing, 2nd floor',
 *   discoveredDate: new Date(),
 *   correctionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export const createViolation = (data: Partial<Violation>): Violation => {
  const now = new Date();

  return {
    id: data.id || `VIOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: data.propertyId!,
    inspectionId: data.inspectionId,
    category: data.category!,
    severity: data.severity || 'moderate',
    code: data.code || '',
    description: data.description || '',
    location: data.location || '',
    discoveredDate: data.discoveredDate || now,
    correctionDeadline: data.correctionDeadline!,
    status: data.status || 'open',
    assignedTo: data.assignedTo,
    correctionPlan: data.correctionPlan,
    correctionCost: data.correctionCost,
    correctedDate: data.correctedDate,
    verifiedDate: data.verifiedDate,
    verifiedBy: data.verifiedBy,
    fineAmount: data.fineAmount,
    finePaid: data.finePaid || false,
    appealStatus: data.appealStatus || 'none',
    notes: data.notes || [],
    attachments: data.attachments || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Updates violation status.
 *
 * @param {Violation} violation - Violation to update
 * @param {ViolationStatus} newStatus - New status
 * @param {string} updatedBy - User updating
 * @param {string} notes - Update notes
 * @returns {Violation} Updated violation
 *
 * @example
 * ```typescript
 * const updated = updateViolationStatus(
 *   violation,
 *   'corrected',
 *   'manager-123',
 *   'Fire exit cleared and verified'
 * );
 * ```
 */
export const updateViolationStatus = (
  violation: Violation,
  newStatus: ViolationStatus,
  updatedBy: string,
  notes: string,
): Violation => {
  const now = new Date();
  const updates: Partial<Violation> = {
    status: newStatus,
    updatedAt: now,
    notes: [...(violation.notes || []), `${now.toISOString()}: ${notes}`],
  };

  if (newStatus === 'corrected' && !violation.correctedDate) {
    updates.correctedDate = now;
  }

  if (newStatus === 'verified' && !violation.verifiedDate) {
    updates.verifiedDate = now;
    updates.verifiedBy = updatedBy;
  }

  return { ...violation, ...updates };
};

/**
 * Calculates violation fine based on severity and delay.
 *
 * @param {Violation} violation - Violation
 * @param {Record<ViolationSeverity, number>} baseFines - Base fine amounts
 * @returns {number} Calculated fine amount
 *
 * @example
 * ```typescript
 * const fine = calculateViolationFine(violation, {
 *   critical: 1000,
 *   serious: 500,
 *   moderate: 250,
 *   minor: 100
 * });
 * ```
 */
export const calculateViolationFine = (
  violation: Violation,
  baseFines: Record<ViolationSeverity, number>,
): number => {
  let fine = baseFines[violation.severity] || 0;

  // Add penalty for overdue violations
  if (new Date() > violation.correctionDeadline && violation.status !== 'closed') {
    const daysOverdue = Math.floor(
      (Date.now() - violation.correctionDeadline.getTime()) / (1000 * 60 * 60 * 24),
    );
    fine += daysOverdue * 50; // $50 per day penalty
  }

  return fine;
};

/**
 * Gets critical violations requiring immediate action.
 *
 * @param {Violation[]} violations - All violations
 * @returns {Violation[]} Critical violations
 *
 * @example
 * ```typescript
 * const critical = getCriticalViolations(violations);
 * ```
 */
export const getCriticalViolations = (violations: Violation[]): Violation[] => {
  return violations.filter(
    v =>
      v.severity === 'critical' &&
      (v.status === 'open' || v.status === 'acknowledged' || v.status === 'correction_in_progress'),
  );
};

// ============================================================================
// COMPLIANCE REPORTING
// ============================================================================

/**
 * Generates comprehensive compliance report.
 *
 * @param {string} propertyId - Property ID
 * @param {object} data - Report data (requirements, inspections, violations, permits)
 * @param {ReportType} reportType - Type of report
 * @returns {ComplianceReport} Compliance report
 *
 * @example
 * ```typescript
 * const report = generateComplianceReport(
 *   'PROP-001',
 *   { requirements, inspections, violations, permits },
 *   'monthly_compliance'
 * );
 * ```
 */
export const generateComplianceReport = (
  propertyId: string,
  data: {
    requirements: ComplianceRequirement[];
    inspections: Inspection[];
    violations: Violation[];
    permits: Permit[];
  },
  reportType: ReportType,
): ComplianceReport => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(now.getMonth() - 1);

  const compliant = data.requirements.filter(r => r.status === 'compliant').length;
  const nonCompliant = data.requirements.filter(r => r.status === 'non_compliant').length;
  const pending = data.requirements.filter(r => r.status === 'pending').length;

  const complianceRate =
    data.requirements.length > 0
      ? (compliant / data.requirements.length) * 100
      : 100;

  const details = {
    requirements: {
      total: data.requirements.length,
      byCategory: data.requirements.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    inspections: {
      total: data.inspections.length,
      passed: data.inspections.filter(i => i.result === 'passed').length,
      failed: data.inspections.filter(i => i.result === 'failed').length,
      pending: data.inspections.filter(i => i.status === 'scheduled').length,
    },
    violations: {
      total: data.violations.length,
      open: data.violations.filter(v => v.status === 'open').length,
      corrected: data.violations.filter(v => v.status === 'corrected').length,
      critical: getCriticalViolations(data.violations).length,
    },
    permits: {
      total: data.permits.length,
      active: data.permits.filter(p => p.status === 'active').length,
      expired: data.permits.filter(p => p.status === 'expired').length,
      pending: data.permits.filter(p => p.status === 'under_review').length,
    },
  };

  const recommendations: string[] = [];
  const actionItems: string[] = [];

  // Generate recommendations
  if (complianceRate < 90) {
    recommendations.push('Compliance rate below 90% - prioritize outstanding requirements');
  }

  if (getCriticalViolations(data.violations).length > 0) {
    actionItems.push('Address critical violations immediately');
  }

  const expiringPermits = checkExpiringPermits(data.permits, 30);
  if (expiringPermits.length > 0) {
    actionItems.push(`Renew ${expiringPermits.length} permits expiring within 30 days`);
  }

  return {
    id: `REPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    reportType,
    period: { startDate, endDate: now },
    generatedDate: now,
    generatedBy: 'system',
    summary: {
      totalRequirements: data.requirements.length,
      compliant,
      nonCompliant,
      pending,
      complianceRate: Math.round(complianceRate * 100) / 100,
    },
    details,
    recommendations,
    actionItems,
    status: 'draft',
  };
};

/**
 * Exports compliance report to specified format.
 *
 * @param {ComplianceReport} report - Compliance report
 * @param {'pdf' | 'csv' | 'json'} format - Export format
 * @returns {object} Export details
 *
 * @example
 * ```typescript
 * const exported = exportComplianceReport(report, 'pdf');
 * ```
 */
export const exportComplianceReport = (
  report: ComplianceReport,
  format: 'pdf' | 'csv' | 'json',
): object => {
  // In production, this would generate actual file
  return {
    reportId: report.id,
    format,
    filename: `compliance-report-${report.propertyId}-${Date.now()}.${format}`,
    url: `https://storage.example.com/reports/${report.id}.${format}`,
    generatedAt: new Date(),
    size: '2.5MB',
  };
};

// ============================================================================
// AUDIT TRAIL MANAGEMENT
// ============================================================================

/**
 * Creates audit trail entry.
 *
 * @param {Partial<AuditTrail>} data - Audit trail data
 * @returns {AuditTrail} Audit trail entry
 *
 * @example
 * ```typescript
 * const audit = createAuditTrail({
 *   entityType: 'violation',
 *   entityId: 'VIOL-123',
 *   action: 'updated',
 *   performedBy: 'user-456',
 *   changes: { status: { old: 'open', new: 'corrected' } }
 * });
 * ```
 */
export const createAuditTrail = (data: Partial<AuditTrail>): AuditTrail => {
  return {
    id: data.id || `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entityType: data.entityType!,
    entityId: data.entityId!,
    action: data.action!,
    performedBy: data.performedBy!,
    performedAt: data.performedAt || new Date(),
    changes: data.changes,
    reason: data.reason,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  };
};

/**
 * Gets audit trail for an entity.
 *
 * @param {AuditTrail[]} auditTrails - All audit trails
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @returns {AuditTrail[]} Entity audit trail
 *
 * @example
 * ```typescript
 * const history = getAuditTrail(auditTrails, 'violation', 'VIOL-123');
 * ```
 */
export const getAuditTrail = (
  auditTrails: AuditTrail[],
  entityType: string,
  entityId: string,
): AuditTrail[] => {
  return auditTrails
    .filter(audit => audit.entityType === entityType && audit.entityId === entityId)
    .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
};

/**
 * Generates audit summary report.
 *
 * @param {AuditTrail[]} auditTrails - Audit trails
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {object} Audit summary
 *
 * @example
 * ```typescript
 * const summary = generateAuditSummary(
 *   auditTrails,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export const generateAuditSummary = (
  auditTrails: AuditTrail[],
  startDate: Date,
  endDate: Date,
): object => {
  const filtered = auditTrails.filter(
    a => a.performedAt >= startDate && a.performedAt <= endDate,
  );

  const byAction: Record<string, number> = {};
  const byEntity: Record<string, number> = {};
  const byUser: Record<string, number> = {};

  filtered.forEach(audit => {
    byAction[audit.action] = (byAction[audit.action] || 0) + 1;
    byEntity[audit.entityType] = (byEntity[audit.entityType] || 0) + 1;
    byUser[audit.performedBy] = (byUser[audit.performedBy] || 0) + 1;
  });

  return {
    period: { startDate, endDate },
    totalEvents: filtered.length,
    byAction,
    byEntity,
    byUser,
    generatedDate: new Date(),
  };
};

/**
 * Validates audit trail completeness.
 *
 * @param {AuditTrail[]} auditTrails - Audit trails
 * @param {string} entityId - Entity ID to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAuditTrail(auditTrails, 'VIOL-123');
 * ```
 */
export const validateAuditTrail = (
  auditTrails: AuditTrail[],
  entityId: string,
): {
  isComplete: boolean;
  missingActions: string[];
  recommendations: string[];
} => {
  const entityAudits = auditTrails.filter(a => a.entityId === entityId);

  const hasCreated = entityAudits.some(a => a.action === 'created');
  const missingActions: string[] = [];

  if (!hasCreated) {
    missingActions.push('created');
  }

  const recommendations: string[] = [];
  if (entityAudits.length === 0) {
    recommendations.push('No audit trail found for this entity');
  }

  return {
    isComplete: missingActions.length === 0,
    missingActions,
    recommendations,
  };
};

// ============================================================================
// COMPREHENSIVE COMPLIANCE ANALYTICS
// ============================================================================

/**
 * Generates compliance dashboard metrics.
 *
 * @param {object} data - All compliance data
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = generateComplianceDashboard({
 *   requirements,
 *   inspections,
 *   violations,
 *   permits
 * });
 * ```
 */
export const generateComplianceDashboard = (data: {
  requirements: ComplianceRequirement[];
  inspections: Inspection[];
  violations: Violation[];
  permits: Permit[];
}): {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metrics: Record<string, any>;
  alerts: string[];
  upcomingDeadlines: object[];
} => {
  const compliantReqs = data.requirements.filter(r => r.status === 'compliant').length;
  const totalReqs = data.requirements.length;
  const complianceRate = totalReqs > 0 ? (compliantReqs / totalReqs) * 100 : 100;

  const criticalViolations = getCriticalViolations(data.violations);
  const overdueRequirements = data.requirements.filter(isComplianceOverdue);
  const expiringPermits = checkExpiringPermits(data.permits, 30);

  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (criticalViolations.length > 0 || overdueRequirements.length > 5) {
    riskLevel = 'critical';
  } else if (complianceRate < 80 || overdueRequirements.length > 2) {
    riskLevel = 'high';
  } else if (complianceRate < 90 || overdueRequirements.length > 0) {
    riskLevel = 'medium';
  }

  const alerts: string[] = [];
  if (criticalViolations.length > 0) {
    alerts.push(`${criticalViolations.length} critical violations require immediate attention`);
  }
  if (overdueRequirements.length > 0) {
    alerts.push(`${overdueRequirements.length} compliance requirements are overdue`);
  }
  if (expiringPermits.length > 0) {
    alerts.push(`${expiringPermits.length} permits expiring within 30 days`);
  }

  const upcomingInspections = getUpcomingInspections(data.inspections, 14);
  const upcomingDeadlines = [
    ...overdueRequirements.map(r => ({
      type: 'requirement',
      title: r.title,
      dueDate: r.dueDate || r.nextRenewalDate,
      priority: r.priority,
    })),
    ...expiringPermits.map(p => ({
      type: 'permit',
      title: p.description,
      dueDate: p.expirationDate,
      priority: 'high' as CompliancePriority,
    })),
    ...upcomingInspections.map(i => ({
      type: 'inspection',
      title: `${i.category} inspection`,
      dueDate: i.scheduledDate,
      priority: 'medium' as CompliancePriority,
    })),
  ].sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

  return {
    overallScore: Math.round(complianceRate),
    riskLevel,
    metrics: {
      complianceRate,
      totalRequirements: totalReqs,
      compliantRequirements: compliantReqs,
      activeViolations: data.violations.filter(v => v.status !== 'closed').length,
      criticalViolations: criticalViolations.length,
      activePermits: data.permits.filter(p => p.status === 'active').length,
      upcomingInspections: upcomingInspections.length,
    },
    alerts,
    upcomingDeadlines: upcomingDeadlines.slice(0, 10), // Top 10
  };
};

/**
 * Prioritizes compliance actions based on urgency and risk.
 *
 * @param {object} data - All compliance data
 * @returns {object[]} Prioritized action items
 *
 * @example
 * ```typescript
 * const actions = prioritizeComplianceActions({
 *   requirements,
 *   violations,
 *   permits,
 *   inspections
 * });
 * ```
 */
export const prioritizeComplianceActions = (data: {
  requirements: ComplianceRequirement[];
  violations: Violation[];
  permits: Permit[];
  inspections: Inspection[];
}): Array<{
  priority: number;
  type: string;
  action: string;
  dueDate?: Date;
  estimatedCost?: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}> => {
  const actions: Array<{
    priority: number;
    type: string;
    action: string;
    dueDate?: Date;
    estimatedCost?: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }> = [];

  // Critical violations - highest priority
  const criticalViols = getCriticalViolations(data.violations);
  criticalViols.forEach(v => {
    actions.push({
      priority: 100,
      type: 'violation',
      action: `Correct critical violation: ${v.description}`,
      dueDate: v.correctionDeadline,
      estimatedCost: v.correctionCost,
      riskLevel: 'critical',
    });
  });

  // Overdue compliance requirements
  const overdue = data.requirements.filter(isComplianceOverdue);
  overdue.forEach(r => {
    const priorityScore = r.priority === 'critical' ? 95 : r.priority === 'high' ? 90 : 85;
    actions.push({
      priority: priorityScore,
      type: 'requirement',
      action: `Complete overdue requirement: ${r.title}`,
      dueDate: r.dueDate || r.nextRenewalDate,
      estimatedCost: r.estimatedCost,
      riskLevel: r.priority === 'critical' ? 'critical' : 'high',
    });
  });

  // Expiring permits
  const expiring = checkExpiringPermits(data.permits, 30);
  expiring.forEach(p => {
    actions.push({
      priority: 80,
      type: 'permit',
      action: `Renew expiring permit: ${p.description}`,
      dueDate: p.expirationDate,
      estimatedCost: p.fee,
      riskLevel: 'high',
    });
  });

  // Failed inspections requiring follow-up
  const failedInspections = data.inspections.filter(
    i => i.result === 'failed' && i.followUpRequired,
  );
  failedInspections.forEach(i => {
    actions.push({
      priority: 75,
      type: 'inspection',
      action: `Address failed inspection findings: ${i.category}`,
      dueDate: i.followUpDate,
      riskLevel: 'high',
    });
  });

  // Other serious violations
  const seriousViols = data.violations.filter(
    v => v.severity === 'serious' && v.status !== 'closed',
  );
  seriousViols.forEach(v => {
    actions.push({
      priority: 70,
      type: 'violation',
      action: `Correct serious violation: ${v.description}`,
      dueDate: v.correctionDeadline,
      estimatedCost: v.correctionCost,
      riskLevel: 'medium',
    });
  });

  return actions.sort((a, b) => b.priority - a.priority);
};

/**
 * Estimates compliance budget requirements.
 *
 * @param {object} data - Compliance data
 * @param {number} months - Number of months to project
 * @returns {object} Budget projection
 *
 * @example
 * ```typescript
 * const budget = estimateComplianceBudget({ requirements, violations, permits }, 12);
 * ```
 */
export const estimateComplianceBudget = (
  data: {
    requirements: ComplianceRequirement[];
    violations: Violation[];
    permits: Permit[];
  },
  months: number,
): {
  totalEstimated: number;
  breakdown: Record<string, number>;
  byCategory: Record<string, number>;
  projectedMonthly: number;
} => {
  let totalEstimated = 0;
  const breakdown: Record<string, number> = {
    requirements: 0,
    violations: 0,
    permits: 0,
    fines: 0,
  };
  const byCategory: Record<string, number> = {};

  // Requirements costs
  data.requirements.forEach(r => {
    const cost = r.estimatedCost || r.actualCost || 0;
    totalEstimated += cost;
    breakdown.requirements += cost;
    byCategory[r.category] = (byCategory[r.category] || 0) + cost;
  });

  // Violation correction costs
  data.violations
    .filter(v => v.status !== 'closed')
    .forEach(v => {
      const cost = v.correctionCost || 0;
      totalEstimated += cost;
      breakdown.violations += cost;
      byCategory[v.category] = (byCategory[v.category] || 0) + cost;

      // Add fines
      if (v.fineAmount && !v.finePaid) {
        totalEstimated += v.fineAmount;
        breakdown.fines += v.fineAmount;
      }
    });

  // Permit costs
  data.permits
    .filter(p => !p.feePaid || p.status === 'expired')
    .forEach(p => {
      totalEstimated += p.fee;
      breakdown.permits += p.fee;
      byCategory[p.category] = (byCategory[p.category] || 0) + p.fee;
    });

  const projectedMonthly = totalEstimated / months;

  return {
    totalEstimated: Math.round(totalEstimated * 100) / 100,
    breakdown,
    byCategory,
    projectedMonthly: Math.round(projectedMonthly * 100) / 100,
  };
};

/**
 * Tracks compliance trends over time.
 *
 * @param {ComplianceRequirement[]} requirements - Historical requirements
 * @param {number} months - Number of months to analyze
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = trackComplianceTrends(requirements, 6);
 * ```
 */
export const trackComplianceTrends = (
  requirements: ComplianceRequirement[],
  months: number,
): {
  trend: 'improving' | 'declining' | 'stable';
  monthlyRates: Array<{ month: string; rate: number }>;
  insights: string[];
} => {
  const now = new Date();
  const monthlyRates: Array<{ month: string; rate: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now);
    monthDate.setMonth(now.getMonth() - i);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const monthReqs = requirements.filter(
      r => r.createdAt <= monthEnd,
    );

    const compliant = monthReqs.filter(r => r.status === 'compliant').length;
    const rate = monthReqs.length > 0 ? (compliant / monthReqs.length) * 100 : 100;

    monthlyRates.push({
      month: monthDate.toISOString().substring(0, 7),
      rate: Math.round(rate * 100) / 100,
    });
  }

  // Determine trend
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (monthlyRates.length >= 2) {
    const recent = monthlyRates.slice(-3).map(m => m.rate);
    const earlier = monthlyRates.slice(0, 3).map(m => m.rate);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    if (recentAvg > earlierAvg + 5) {
      trend = 'improving';
    } else if (recentAvg < earlierAvg - 5) {
      trend = 'declining';
    }
  }

  const insights: string[] = [];
  if (trend === 'improving') {
    insights.push('Compliance rates showing positive improvement');
  } else if (trend === 'declining') {
    insights.push('Compliance rates declining - immediate action recommended');
  }

  const latestRate = monthlyRates[monthlyRates.length - 1]?.rate || 0;
  if (latestRate < 80) {
    insights.push('Current compliance rate below acceptable threshold (80%)');
  }

  return { trend, monthlyRates, insights };
};
