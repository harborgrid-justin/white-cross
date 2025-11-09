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
interface ComplianceRequirement {
    id: string;
    propertyId: string;
    category: ComplianceCategory;
    type: ComplianceType;
    title: string;
    description: string;
    jurisdiction: string;
    authority: string;
    code: string;
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
type ComplianceCategory = 'building_code' | 'fire_safety' | 'electrical' | 'plumbing' | 'hvac' | 'environmental' | 'accessibility' | 'health_safety' | 'zoning' | 'occupancy' | 'energy' | 'water_quality' | 'structural' | 'security';
type ComplianceType = 'permit' | 'license' | 'certification' | 'inspection' | 'registration' | 'approval' | 'testing' | 'reporting';
type CompliancePriority = 'critical' | 'high' | 'medium' | 'low';
type ComplianceStatus = 'pending' | 'in_progress' | 'compliant' | 'non_compliant' | 'under_review' | 'expired' | 'waived' | 'appealed';
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
type InspectionType = 'routine' | 'follow_up' | 'complaint_driven' | 'pre_occupancy' | 'annual' | 'random' | 'emergency';
type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'passed' | 'failed' | 'cancelled' | 'rescheduled';
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
type ViolationStatus = 'open' | 'acknowledged' | 'correction_in_progress' | 'corrected' | 'verified' | 'closed' | 'appealed' | 'waived';
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
type PermitType = 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'fire' | 'demolition' | 'sign' | 'occupancy' | 'special_event' | 'environmental';
type PermitStatus = 'application_submitted' | 'under_review' | 'approved' | 'issued' | 'active' | 'completed' | 'expired' | 'denied' | 'cancelled' | 'suspended';
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
type EnvironmentalType = 'air_quality' | 'water_quality' | 'hazardous_materials' | 'asbestos' | 'lead_paint' | 'radon' | 'mold' | 'waste_management' | 'underground_storage' | 'stormwater';
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
type ReportType = 'monthly_compliance' | 'annual_compliance' | 'safety_audit' | 'accessibility_audit' | 'environmental_report' | 'building_inspection' | 'fire_safety' | 'elevator_inspection' | 'custom';
interface AuditTrail {
    id: string;
    entityType: 'requirement' | 'inspection' | 'violation' | 'permit' | 'report';
    entityId: string;
    action: AuditAction;
    performedBy: string;
    performedAt: Date;
    changes?: Record<string, {
        old: any;
        new: any;
    }>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
}
type AuditAction = 'created' | 'updated' | 'deleted' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'expired' | 'renewed';
interface ComplianceValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations?: string[];
}
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
export declare const createComplianceRequirement: (data: Partial<ComplianceRequirement>) => ComplianceRequirement;
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
export declare const updateComplianceStatus: (requirement: ComplianceRequirement, newStatus: ComplianceStatus, updatedBy: string, reason: string) => ComplianceRequirement;
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
export declare const calculateNextRenewalDate: (requirement: ComplianceRequirement) => Date | null;
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
export declare const isComplianceOverdue: (requirement: ComplianceRequirement) => boolean;
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
export declare const getRequirementsByCategory: (requirements: ComplianceRequirement[], category: ComplianceCategory) => ComplianceRequirement[];
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
export declare const validateBuildingCodeCompliance: (propertyId: string, requirements: ComplianceRequirement[]) => ComplianceValidation;
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
export declare const generateBuildingCodeChecklist: (buildingType: string, jurisdiction: string) => string[];
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
export declare const calculateBuildingCodeScore: (requirements: ComplianceRequirement[]) => number;
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
export declare const identifyCriticalViolations: (requirements: ComplianceRequirement[]) => ComplianceRequirement[];
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
export declare const createSafetyComplianceChecklist: (propertyId: string, category: ComplianceCategory) => object;
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
export declare const trackSafetyRegulationUpdates: (jurisdiction: string, lastCheckDate: Date) => object[];
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
export declare const createEnvironmentalCompliance: (data: Partial<EnvironmentalCompliance>) => EnvironmentalCompliance;
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
export declare const recordEnvironmentalTestResult: (compliance: EnvironmentalCompliance, testData: Omit<TestResult, "id">) => EnvironmentalCompliance;
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
export declare const checkEnvironmentalThresholds: (testResults: TestResult[], thresholds: Record<string, number>) => {
    compliant: boolean;
    violations: string[];
    warnings: string[];
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
export declare const generateEnvironmentalReport: (compliance: EnvironmentalCompliance[], startDate: Date, endDate: Date) => object;
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
export declare const createAccessibilityCompliance: (data: Partial<AccessibilityCompliance>) => AccessibilityCompliance;
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
export declare const generateADAChecklist: (areaType: string) => string[];
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
export declare const calculateADAComplianceScore: (assessments: AccessibilityCompliance[]) => {
    overallScore: number;
    byArea: Record<string, number>;
    byStandard: Record<string, number>;
    recommendations: string[];
};
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
export declare const createPermit: (data: Partial<Permit>) => Permit;
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
export declare const updatePermitStatus: (permit: Permit, newStatus: PermitStatus, statusDate: Date) => Permit;
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
export declare const checkExpiringPermits: (permits: Permit[], daysThreshold: number) => Permit[];
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
export declare const generatePermitReport: (permits: Permit[], propertyId: string) => object;
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
export declare const scheduleInspection: (data: Partial<Inspection>) => Inspection;
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
export declare const completeInspection: (inspection: Inspection, result: InspectionResult, findings: InspectionFinding[]) => Inspection;
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
export declare const getUpcomingInspections: (inspections: Inspection[], daysAhead: number) => Inspection[];
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
export declare const rescheduleInspection: (inspection: Inspection, newDate: Date, reason: string) => Inspection;
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
export declare const createViolation: (data: Partial<Violation>) => Violation;
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
export declare const updateViolationStatus: (violation: Violation, newStatus: ViolationStatus, updatedBy: string, notes: string) => Violation;
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
export declare const calculateViolationFine: (violation: Violation, baseFines: Record<ViolationSeverity, number>) => number;
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
export declare const getCriticalViolations: (violations: Violation[]) => Violation[];
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
export declare const generateComplianceReport: (propertyId: string, data: {
    requirements: ComplianceRequirement[];
    inspections: Inspection[];
    violations: Violation[];
    permits: Permit[];
}, reportType: ReportType) => ComplianceReport;
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
export declare const exportComplianceReport: (report: ComplianceReport, format: "pdf" | "csv" | "json") => object;
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
export declare const createAuditTrail: (data: Partial<AuditTrail>) => AuditTrail;
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
export declare const getAuditTrail: (auditTrails: AuditTrail[], entityType: string, entityId: string) => AuditTrail[];
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
export declare const generateAuditSummary: (auditTrails: AuditTrail[], startDate: Date, endDate: Date) => object;
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
export declare const validateAuditTrail: (auditTrails: AuditTrail[], entityId: string) => {
    isComplete: boolean;
    missingActions: string[];
    recommendations: string[];
};
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
export declare const generateComplianceDashboard: (data: {
    requirements: ComplianceRequirement[];
    inspections: Inspection[];
    violations: Violation[];
    permits: Permit[];
}) => {
    overallScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    metrics: Record<string, any>;
    alerts: string[];
    upcomingDeadlines: object[];
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
export declare const prioritizeComplianceActions: (data: {
    requirements: ComplianceRequirement[];
    violations: Violation[];
    permits: Permit[];
    inspections: Inspection[];
}) => Array<{
    priority: number;
    type: string;
    action: string;
    dueDate?: Date;
    estimatedCost?: number;
    riskLevel: "critical" | "high" | "medium" | "low";
}>;
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
export declare const estimateComplianceBudget: (data: {
    requirements: ComplianceRequirement[];
    violations: Violation[];
    permits: Permit[];
}, months: number) => {
    totalEstimated: number;
    breakdown: Record<string, number>;
    byCategory: Record<string, number>;
    projectedMonthly: number;
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
export declare const trackComplianceTrends: (requirements: ComplianceRequirement[], months: number) => {
    trend: "improving" | "declining" | "stable";
    monthlyRates: Array<{
        month: string;
        rate: number;
    }>;
    insights: string[];
};
export {};
//# sourceMappingURL=property-compliance-kit.d.ts.map