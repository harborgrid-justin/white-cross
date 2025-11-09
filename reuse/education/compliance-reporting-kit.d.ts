/**
 * LOC: EDU-COMPLIANCE-001
 * File: /reuse/education/compliance-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Compliance reporting services
 *   - Institutional research
 *   - Government reporting systems
 */
/**
 * File: /reuse/education/compliance-reporting-kit.ts
 * Locator: WC-EDU-COMPLIANCE-001
 * Purpose: Comprehensive Compliance & Regulatory Reporting - IPEDS, state, federal reporting for higher education institutions
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Compliance Services, Institutional Research, Government Portals
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for IPEDS reporting, state/federal compliance, enrollment/financial aid/graduation reporting
 *
 * LLM Context: Enterprise-grade compliance reporting system for higher education institutions.
 * Provides comprehensive IPEDS (Integrated Postsecondary Education Data System) reporting,
 * state-specific reporting, federal compliance reporting, enrollment reporting, financial aid
 * reporting, graduation rates, report scheduling, automated submission, audit trails, and
 * accessible report generation. Designed with user-centered interfaces for institutional
 * research staff, compliance officers, and administrators.
 */
import { Sequelize } from 'sequelize';
interface IPEDSReportData {
    reportId: string;
    surveyYear: number;
    surveyComponent: string;
    surveyId: string;
    institutionUnitId: string;
    completionStatus: number;
    lockStatus: boolean;
    submissionDeadline: Date;
    dataElements: Record<string, any>;
    validationStatus: 'valid' | 'warnings' | 'errors';
    certifiedBy: string | null;
    certifiedDate: Date | null;
}
interface StateReportRequirements {
    stateCode: string;
    reportName: string;
    reportingFrequency: 'quarterly' | 'semester' | 'annual' | 'biennial';
    dueDate: Date;
    requiredFields: string[];
    dataFormat: 'csv' | 'xml' | 'json' | 'pdf' | 'web-portal';
    submissionMethod: 'upload' | 'api' | 'email' | 'portal';
    contactPerson: string;
    contactEmail: string;
}
interface FederalReportData {
    reportId: string;
    reportType: 'title-iv' | 'clery' | 'equity' | 'graduation-rates' | 'cohort-default';
    reportingAgency: 'ED' | 'DOJ' | 'DOL' | 'HHS';
    fiscalYear: number;
    reportingPeriod: string;
    requiredData: Record<string, any>;
    complianceStatus: 'compliant' | 'non-compliant' | 'pending';
    auditRequired: boolean;
    nextAuditDate: Date | null;
}
interface EnrollmentReportData {
    reportId: string;
    reportDate: Date;
    academicTerm: string;
    totalHeadcount: number;
    fullTimeCount: number;
    partTimeCount: number;
    undergraduateCount: number;
    graduateCount: number;
    firstTimeCount: number;
    transferCount: number;
    internationalCount: number;
    demographicBreakdown: Record<string, any>;
    programBreakdown: Record<string, any>;
}
interface FinancialAidReportData {
    reportId: string;
    awardYear: string;
    totalRecipients: number;
    totalAwardAmount: number;
    pellGrantRecipients: number;
    pellGrantAmount: number;
    loanRecipients: number;
    loanAmount: number;
    workStudyRecipients: number;
    workStudyAmount: number;
    institutionalAidRecipients: number;
    institutionalAidAmount: number;
    defaultRate: number;
}
interface GraduationRateData {
    cohortYear: number;
    cohortSize: number;
    graduatedIn4Years: number;
    graduatedIn5Years: number;
    graduatedIn6Years: number;
    graduatedIn8Years: number;
    rate4Year: number;
    rate5Year: number;
    rate6Year: number;
    rate8Year: number;
    stillEnrolled: number;
    transferredOut: number;
    demographicRates: Record<string, any>;
}
interface ReportSchedule {
    scheduleId: string;
    reportType: string;
    frequency: string;
    nextRunDate: Date;
    autoSubmit: boolean;
    recipients: string[];
    enabled: boolean;
    lastRunDate: Date | null;
    lastRunStatus: 'success' | 'failed' | 'pending';
}
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    summary: string;
}
interface ValidationError {
    field: string;
    message: string;
    severity: 'critical' | 'error';
    code: string;
}
interface ValidationWarning {
    field: string;
    message: string;
    severity: 'warning' | 'info';
    code: string;
}
export declare class CreateComplianceReportDto {
    reportType: string;
    reportingPeriod: string;
    fiscalYear: number;
    dataSource: string;
}
export declare class IPEDSReportDto {
    surveyYear: number;
    surveyComponent: string;
    institutionUnitId: string;
    dataElements: Record<string, any>;
}
export declare class StateReportDto {
    stateCode: string;
    reportName: string;
    reportingPeriod: string;
    reportData: Record<string, any>;
}
export declare class FederalReportDto {
    reportType: string;
    reportingAgency: string;
    fiscalYear: number;
    requiredData: Record<string, any>;
}
export declare class EnrollmentReportDto {
    academicTerm: string;
    reportDate: Date;
    includeDemographics?: boolean;
    includePrograms?: boolean;
}
export declare class ReportScheduleDto {
    reportType: string;
    frequency: string;
    autoSubmit?: boolean;
    recipients: string[];
}
/**
 * Sequelize model for Compliance Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceReport model
 *
 * @example
 * ```typescript
 * const ComplianceReport = createComplianceReportModel(sequelize);
 * const report = await ComplianceReport.create({
 *   reportType: 'ipeds-fall-enrollment',
 *   reportingPeriod: '2024-2025',
 *   fiscalYear: 2024,
 *   submissionStatus: 'draft'
 * });
 * ```
 */
export declare const createComplianceReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        reportType: string;
        reportCategory: string;
        reportingPeriod: string;
        fiscalYear: number;
        academicYear: string;
        submissionStatus: string;
        submittedBy: string | null;
        submittedDate: Date | null;
        reviewedBy: string | null;
        reviewedDate: Date | null;
        approvedBy: string | null;
        approvedDate: Date | null;
        validationErrors: string[];
        validationWarnings: string[];
        dataSource: string;
        reportData: Record<string, any>;
        attachments: string[];
        dueDate: Date;
        submissionDeadline: Date;
        isLocked: boolean;
        lockReason: string | null;
        version: number;
        previousVersionId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for IPEDS Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IPEDSReport model
 */
export declare const createIPEDSReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        surveyYear: number;
        surveyComponent: string;
        surveyId: string;
        institutionUnitId: string;
        institutionName: string;
        completionStatus: number;
        lockStatus: boolean;
        submissionDeadline: Date;
        dataElements: Record<string, any>;
        validationStatus: string;
        validationMessages: string[];
        certifiedBy: string | null;
        certifiedDate: Date | null;
        certificationStatement: string | null;
        submittedToIPEDS: boolean;
        ipedsSubmissionDate: Date | null;
        ipedsConfirmationNumber: string | null;
        priorYearData: Record<string, any>;
        yearOverYearChanges: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for State Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StateReport model
 */
export declare const createStateReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        stateCode: string;
        reportName: string;
        reportingAgency: string;
        reportingPeriod: string;
        reportingFrequency: string;
        fiscalYear: number;
        dueDate: Date;
        submissionDate: Date | null;
        requiredFields: string[];
        reportData: Record<string, any>;
        dataFormat: string;
        submissionMethod: string;
        submissionStatus: string;
        confirmationNumber: string | null;
        contactPerson: string;
        contactEmail: string;
        contactPhone: string | null;
        validationResults: Record<string, any>;
        stateSpecificRequirements: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Federal Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FederalReport model
 */
export declare const createFederalReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        reportType: string;
        reportingAgency: string;
        fiscalYear: number;
        reportingPeriod: string;
        requiredData: Record<string, any>;
        complianceStatus: string;
        complianceDate: Date | null;
        auditRequired: boolean;
        lastAuditDate: Date | null;
        nextAuditDate: Date | null;
        auditFindings: string[];
        correctiveActions: string[];
        submissionDeadline: Date;
        submittedDate: Date | null;
        confirmationNumber: string | null;
        regulatoryReference: string;
        penaltiesForNonCompliance: string;
        contactOfficer: string;
        contactEmail: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Generate IPEDS Fall Enrollment report with comprehensive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} surveyYear - IPEDS survey year
 * @param {string} institutionUnitId - Institution UNITID
 * @returns {Promise<IPEDSReportData>} IPEDS enrollment report
 *
 * @example
 * ```typescript
 * const report = await generateIPEDSFallEnrollment(sequelize, 2024, '123456');
 * console.log(`Enrollment report for ${report.institutionUnitId}: ${report.completionStatus}%`);
 * ```
 */
export declare function generateIPEDSFallEnrollment(sequelize: Sequelize, surveyYear: number, institutionUnitId: string): Promise<IPEDSReportData>;
/**
 * Generate IPEDS Completions report for degrees awarded.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} surveyYear - IPEDS survey year
 * @param {string} institutionUnitId - Institution UNITID
 * @returns {Promise<IPEDSReportData>} IPEDS completions report
 */
export declare function generateIPEDSCompletions(sequelize: Sequelize, surveyYear: number, institutionUnitId: string): Promise<IPEDSReportData>;
/**
 * Generate IPEDS Graduation Rates report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} surveyYear - IPEDS survey year
 * @param {string} institutionUnitId - Institution UNITID
 * @returns {Promise<IPEDSReportData>} IPEDS graduation rates report
 */
export declare function generateIPEDSGraduationRates(sequelize: Sequelize, surveyYear: number, institutionUnitId: string): Promise<IPEDSReportData>;
/**
 * Generate IPEDS Finance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} surveyYear - IPEDS survey year
 * @param {string} institutionUnitId - Institution UNITID
 * @returns {Promise<IPEDSReportData>} IPEDS finance report
 */
export declare function generateIPEDSFinance(sequelize: Sequelize, surveyYear: number, institutionUnitId: string): Promise<IPEDSReportData>;
/**
 * Validate IPEDS report data against submission requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - IPEDS report ID
 * @returns {Promise<ValidationResult>} Validation results
 */
export declare function validateIPEDSReport(sequelize: Sequelize, reportId: string): Promise<ValidationResult>;
/**
 * Certify IPEDS report for submission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - IPEDS report ID
 * @param {string} certifiedBy - Certifying official
 * @param {string} certificationStatement - Certification statement
 * @returns {Promise<boolean>} Certification success
 */
export declare function certifyIPEDSReport(sequelize: Sequelize, reportId: string, certifiedBy: string, certificationStatement: string): Promise<boolean>;
/**
 * Submit IPEDS report to IPEDS portal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - IPEDS report ID
 * @returns {Promise<{ success: boolean; confirmationNumber: string }>} Submission result
 */
export declare function submitIPEDSReport(sequelize: Sequelize, reportId: string): Promise<{
    success: boolean;
    confirmationNumber: string;
}>;
/**
 * Compare IPEDS data year-over-year for trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} institutionUnitId - Institution UNITID
 * @param {number} currentYear - Current year
 * @param {number} priorYear - Prior year
 * @returns {Promise<Record<string, any>>} Year-over-year comparison
 */
export declare function compareIPEDSYearOverYear(sequelize: Sequelize, institutionUnitId: string, currentYear: number, priorYear: number): Promise<Record<string, any>>;
/**
 * Generate state enrollment report with state-specific requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} stateCode - Two-letter state code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<StateReportRequirements>} State enrollment report
 */
export declare function generateStateEnrollmentReport(sequelize: Sequelize, stateCode: string, reportingPeriod: string): Promise<StateReportRequirements>;
/**
 * Generate state financial aid report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} stateCode - Two-letter state code
 * @param {string} awardYear - Financial aid award year
 * @returns {Promise<Record<string, any>>} State financial aid report
 */
export declare function generateStateFinancialAidReport(sequelize: Sequelize, stateCode: string, awardYear: string): Promise<Record<string, any>>;
/**
 * Submit state report through appropriate channel.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - State report ID
 * @param {string} submissionMethod - Submission method
 * @returns {Promise<{ success: boolean; confirmationNumber: string }>} Submission result
 */
export declare function submitStateReport(sequelize: Sequelize, reportId: string, submissionMethod: string): Promise<{
    success: boolean;
    confirmationNumber: string;
}>;
/**
 * Validate state report against state-specific requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - State report ID
 * @param {string} stateCode - State code
 * @returns {Promise<ValidationResult>} Validation results
 */
export declare function validateStateReport(sequelize: Sequelize, reportId: string, stateCode: string): Promise<ValidationResult>;
/**
 * Track state reporting deadlines and send reminders.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} stateCode - State code
 * @returns {Promise<Record<string, Date>[]>} Upcoming deadlines
 */
export declare function trackStateReportingDeadlines(sequelize: Sequelize, stateCode: string): Promise<Record<string, Date>[]>;
/**
 * Generate state-specific data extracts in required format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} stateCode - State code
 * @param {string} dataFormat - Required format (csv, xml, json)
 * @returns {Promise<string>} Formatted data extract
 */
export declare function generateStateDataExtract(sequelize: Sequelize, stateCode: string, dataFormat: 'csv' | 'xml' | 'json'): Promise<string>;
/**
 * Archive state reports for compliance retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} stateCode - State code
 * @param {number} fiscalYear - Fiscal year to archive
 * @returns {Promise<{ archived: number; path: string }>} Archive results
 */
export declare function archiveStateReports(sequelize: Sequelize, stateCode: string, fiscalYear: number): Promise<{
    archived: number;
    path: string;
}>;
/**
 * Generate Title IV compliance report for federal student aid.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<FederalReportData>} Title IV compliance report
 */
export declare function generateTitleIVReport(sequelize: Sequelize, fiscalYear: number): Promise<FederalReportData>;
/**
 * Generate Clery Act crime statistics report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} calendarYear - Calendar year
 * @returns {Promise<FederalReportData>} Clery report
 */
export declare function generateCleryReport(sequelize: Sequelize, calendarYear: number): Promise<FederalReportData>;
/**
 * Generate cohort default rate report for student loans.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<FederalReportData>} Cohort default rate report
 */
export declare function generateCohortDefaultRateReport(sequelize: Sequelize, fiscalYear: number): Promise<FederalReportData>;
/**
 * Validate federal report for submission compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - Federal report ID
 * @returns {Promise<ValidationResult>} Validation results
 */
export declare function validateFederalReport(sequelize: Sequelize, reportId: string): Promise<ValidationResult>;
/**
 * Submit federal report to appropriate agency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - Federal report ID
 * @returns {Promise<{ success: boolean; confirmationNumber: string }>} Submission result
 */
export declare function submitFederalReport(sequelize: Sequelize, reportId: string): Promise<{
    success: boolean;
    confirmationNumber: string;
}>;
/**
 * Track federal audit requirements and schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>[]>} Upcoming audits
 */
export declare function trackFederalAuditRequirements(sequelize: Sequelize): Promise<Record<string, any>[]>;
/**
 * Generate federal compliance status dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<Record<string, any>>} Compliance dashboard data
 */
export declare function generateFederalComplianceDashboard(sequelize: Sequelize, fiscalYear: number): Promise<Record<string, any>>;
/**
 * Generate enrollment snapshot report for specific date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} snapshotDate - Snapshot date
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentReportData>} Enrollment snapshot
 */
export declare function generateEnrollmentSnapshot(sequelize: Sequelize, snapshotDate: Date, termId: number): Promise<EnrollmentReportData>;
/**
 * Track enrollment trends over multiple terms.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} numberOfTerms - Number of terms to analyze
 * @returns {Promise<Record<string, any>[]>} Enrollment trends
 */
export declare function trackEnrollmentTrends(sequelize: Sequelize, numberOfTerms?: number): Promise<Record<string, any>[]>;
/**
 * Generate enrollment by program report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, number>>} Enrollment by program
 */
export declare function generateEnrollmentByProgram(sequelize: Sequelize, termId: number): Promise<Record<string, number>>;
/**
 * Calculate FTE (Full-Time Equivalent) enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<number>} FTE enrollment
 */
export declare function calculateFTEEnrollment(sequelize: Sequelize, termId: number): Promise<number>;
/**
 * Generate enrollment demographic analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, any>>} Demographic breakdown
 */
export declare function generateEnrollmentDemographics(sequelize: Sequelize, termId: number): Promise<Record<string, any>>;
/**
 * Compare enrollment year-over-year for trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} currentTerm - Current term ID
 * @param {number} priorTerm - Prior year term ID
 * @returns {Promise<Record<string, any>>} Year-over-year comparison
 */
export declare function compareEnrollmentYearOverYear(sequelize: Sequelize, currentTerm: number, priorTerm: number): Promise<Record<string, any>>;
/**
 * Generate financial aid disbursement report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<FinancialAidReportData>} Financial aid report
 */
export declare function generateFinancialAidDisbursementReport(sequelize: Sequelize, awardYear: string): Promise<FinancialAidReportData>;
/**
 * Track Pell Grant recipient demographics and amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<Record<string, any>>} Pell Grant data
 */
export declare function trackPellGrantRecipients(sequelize: Sequelize, awardYear: string): Promise<Record<string, any>>;
/**
 * Generate student loan volume report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<Record<string, any>>} Loan volume data
 */
export declare function generateStudentLoanVolumeReport(sequelize: Sequelize, awardYear: string): Promise<Record<string, any>>;
/**
 * Calculate financial aid packaging efficiency metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<Record<string, number>>} Packaging metrics
 */
export declare function calculateFinancialAidPackagingMetrics(sequelize: Sequelize, awardYear: string): Promise<Record<string, number>>;
/**
 * Generate FAFSA completion report for outreach.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<Record<string, any>>} FAFSA completion data
 */
export declare function generateFAFSACompletionReport(sequelize: Sequelize, awardYear: string): Promise<Record<string, any>>;
/**
 * Track work-study program participation and funding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} awardYear - Award year
 * @returns {Promise<Record<string, any>>} Work-study data
 */
export declare function trackWorkStudyParticipation(sequelize: Sequelize, awardYear: string): Promise<Record<string, any>>;
/**
 * Calculate 4-year graduation rate for cohort.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort starting year
 * @returns {Promise<GraduationRateData>} Graduation rate data
 */
export declare function calculate4YearGraduationRate(sequelize: Sequelize, cohortYear: number): Promise<GraduationRateData>;
/**
 * Calculate 6-year graduation rate (150% rate for IPEDS).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort starting year
 * @returns {Promise<number>} 6-year graduation rate percentage
 */
export declare function calculate6YearGraduationRate(sequelize: Sequelize, cohortYear: number): Promise<number>;
/**
 * Analyze graduation rates by demographic groups.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort starting year
 * @returns {Promise<Record<string, number>>} Demographic graduation rates
 */
export declare function analyzeGraduationRatesByDemographic(sequelize: Sequelize, cohortYear: number): Promise<Record<string, number>>;
/**
 * Track time-to-degree metrics for program improvement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort starting year
 * @returns {Promise<Record<string, number>>} Time-to-degree metrics
 */
export declare function trackTimeToDegreeMetrics(sequelize: Sequelize, cohortYear: number): Promise<Record<string, number>>;
/**
 * Compare graduation rates across programs/majors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort starting year
 * @returns {Promise<Record<string, number>>} Program graduation rates
 */
export declare function compareGraduationRatesByProgram(sequelize: Sequelize, cohortYear: number): Promise<Record<string, number>>;
/**
 * Generate graduation rate trend analysis over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} startYear - Start year
 * @param {number} numberOfYears - Number of years to analyze
 * @returns {Promise<Record<string, any>[]>} Graduation rate trends
 */
export declare function generateGraduationRateTrends(sequelize: Sequelize, startYear: number, numberOfYears?: number): Promise<Record<string, any>[]>;
/**
 * Create automated report schedule with user-friendly interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportType - Type of report to schedule
 * @param {string} frequency - Schedule frequency
 * @param {string[]} recipients - Email recipients
 * @returns {Promise<ReportSchedule>} Created schedule
 */
export declare function createReportSchedule(sequelize: Sequelize, reportType: string, frequency: string, recipients: string[]): Promise<ReportSchedule>;
/**
 * Execute scheduled report generation and distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<{ success: boolean; reportId: string }>} Execution result
 */
export declare function executeScheduledReport(sequelize: Sequelize, scheduleId: string): Promise<{
    success: boolean;
    reportId: string;
}>;
/**
 * Send report notifications to stakeholders with accessible formats.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - Report ID
 * @param {string[]} recipients - Email recipients
 * @returns {Promise<boolean>} Notification success
 */
export declare function sendReportNotifications(sequelize: Sequelize, reportId: string, recipients: string[]): Promise<boolean>;
/**
 * Manage report schedule lifecycle (enable, disable, update).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule ID
 * @param {Partial<ReportSchedule>} updates - Schedule updates
 * @returns {Promise<ReportSchedule>} Updated schedule
 */
export declare function manageReportSchedule(sequelize: Sequelize, scheduleId: string, updates: Partial<ReportSchedule>): Promise<ReportSchedule>;
/**
 * Generate report calendar with upcoming deadlines and schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Calendar start date
 * @param {Date} endDate - Calendar end date
 * @returns {Promise<Record<string, any>[]>} Report calendar
 */
export declare function generateReportCalendar(sequelize: Sequelize, startDate: Date, endDate: Date): Promise<Record<string, any>[]>;
/**
 * Injectable service for Compliance Reporting operations.
 */
export declare class ComplianceReportingService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    getIPEDSReport(surveyYear: number, institutionUnitId: string): Promise<IPEDSReportData>;
    submitReport(reportId: string): Promise<{
        success: boolean;
        confirmationNumber: string;
    }>;
    getReportCalendar(startDate: Date, endDate: Date): Promise<Record<string, any>[]>;
}
export {};
//# sourceMappingURL=compliance-reporting-kit.d.ts.map