/**
 * LOC: EDU-COMP-COMPLY-001
 * File: /reuse/education/composites/compliance-reporting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../compliance-reporting-kit
 *   - ../student-enrollment-kit
 *   - ../financial-aid-kit
 *   - ../grading-assessment-kit
 *
 * DOWNSTREAM (imported by):
 *   - Institutional research controllers
 *   - Compliance officers
 *   - IPEDS reporting modules
 *   - State/federal reporting systems
 *   - Audit management services
 */
import { Sequelize } from 'sequelize';
/**
 * IPEDS survey components
 */
export type IPEDSSurveyComponent = 'IC' | 'HD' | 'EF' | 'C' | 'F' | 'FA' | 'GR' | 'ADM' | 'HR' | 'OM';
/**
 * Report submission status
 */
export type ReportStatus = 'draft' | 'pending_review' | 'approved' | 'submitted' | 'accepted' | 'rejected';
/**
 * IPEDS report data
 */
export interface IPEDSReport {
    reportId: string;
    surveyYear: number;
    component: IPEDSSurveyComponent;
    surveyId: string;
    unitId: string;
    submissionStatus: ReportStatus;
    lockStatus: boolean;
    submissionDeadline: Date;
    dataElements: Record<string, any>;
    validationErrors: string[];
    warnings: string[];
    certifiedBy?: string;
    certifiedDate?: Date;
    submittedDate?: Date;
}
/**
 * State compliance report
 */
export interface StateReport {
    reportId: string;
    stateCode: string;
    reportName: string;
    reportingPeriod: string;
    fiscalYear: number;
    dueDate: Date;
    submissionStatus: ReportStatus;
    dataFormat: 'csv' | 'xml' | 'json' | 'pdf';
    dataFile?: string;
    submittedDate?: Date;
    validationErrors: string[];
}
/**
 * Enrollment report data
 */
export interface EnrollmentReport {
    reportId: string;
    reportDate: Date;
    term: string;
    academicYear: string;
    totalHeadcount: number;
    totalFTE: number;
    byLevel: Record<string, number>;
    byGender: Record<string, number>;
    byRace: Record<string, number>;
    byResidency: Record<string, number>;
    byEnrollmentStatus: Record<string, number>;
}
/**
 * Graduation rate cohort
 */
export interface GraduationRateCohort {
    cohortId: string;
    cohortYear: number;
    cohortSize: number;
    graduatedWithin4Years: number;
    graduatedWithin5Years: number;
    graduatedWithin6Years: number;
    stillEnrolled: number;
    transferred: number;
    rate4Year: number;
    rate5Year: number;
    rate6Year: number;
}
/**
 * Clery Act statistics
 */
export interface CleryStatistics {
    year: number;
    campusLocation: string;
    criminalOffenses: {
        murder: number;
        rape: number;
        robbery: number;
        aggravatedAssault: number;
        burglary: number;
        motorVehicleTheft: number;
        arson: number;
    };
    hatecrimes: number;
    vawaCrimes: {
        domesticViolence: number;
        datingViolence: number;
        stalking: number;
    };
    arrests: {
        liquorLawViolations: number;
        drugAbuse: number;
        illegalWeapons: number;
    };
    disciplinaryReferrals: {
        liquorLawViolations: number;
        drugAbuse: number;
        illegalWeapons: number;
    };
}
/**
 * Title IV compliance data
 */
export interface TitleIVCompliance {
    fiscalYear: number;
    institutionType: string;
    cohortDefaultRate: number;
    participationRate: number;
    disbursementAccuracy: number;
    r2t4Accuracy: number;
    nsldReportingAccuracy: number;
    complianceStatus: 'compliant' | 'provisional' | 'non-compliant';
    auditDate?: Date;
    findingsCount: number;
    correctiveActions: string[];
}
/**
 * FERPA compliance log
 */
export interface FERPALog {
    logId: string;
    accessType: 'view' | 'modify' | 'export' | 'share';
    studentId: string;
    recordType: string;
    accessedBy: string;
    accessDate: Date;
    purpose: string;
    consentProvided: boolean;
    legitEducationalInterest: boolean;
    ipAddress: string;
}
/**
 * Cohort default rate
 */
export interface CohortDefaultRate {
    fiscalYear: number;
    cohortYear: number;
    borrowersInCohort: number;
    defaultersInCohort: number;
    defaultRate: number;
    challengedBorrowers?: number;
    adjustedRate?: number;
    status: 'draft' | 'official' | 'challenged';
}
/**
 * Equity report
 */
export interface EquityReport {
    reportId: string;
    reportType: 'gender_equity' | 'racial_equity' | 'disability_equity';
    academicYear: string;
    metrics: {
        enrollment: Record<string, number>;
        retention: Record<string, number>;
        graduation: Record<string, number>;
        facultyDiversity: Record<string, number>;
    };
    gaps: Array<{
        category: string;
        gap: number;
        description: string;
    }>;
    initiatives: string[];
}
/**
 * Compliance & Regulatory Reporting Composite Service
 *
 * Provides comprehensive compliance reporting for IPEDS, state, federal requirements,
 * and institutional research operations.
 */
export declare class ComplianceReportingCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Generates IPEDS Enrollment (EF) report.
     *
     * @param {number} surveyYear - Survey year
     * @param {string} term - Fall term
     * @returns {Promise<IPEDSReport>} IPEDS EF report
     *
     * @example
     * ```typescript
     * const efReport = await service.generateIPEDSEnrollmentReport(2024, 'Fall 2024');
     * console.log(`Total enrollment: ${efReport.dataElements.totalEnrollment}`);
     * ```
     */
    generateIPEDSEnrollmentReport(surveyYear: number, term: string): Promise<IPEDSReport>;
    /**
     * 2. Generates IPEDS Completions (C) report.
     *
     * @param {number} surveyYear - Survey year
     * @returns {Promise<IPEDSReport>} IPEDS C report
     *
     * @example
     * ```typescript
     * const cReport = await service.generateIPEDSCompletionsReport(2024);
     * ```
     */
    generateIPEDSCompletionsReport(surveyYear: number): Promise<IPEDSReport>;
    /**
     * 3. Generates IPEDS Graduation Rates (GR) report.
     *
     * @param {number} surveyYear - Survey year
     * @returns {Promise<IPEDSReport>} IPEDS GR report
     *
     * @example
     * ```typescript
     * const grReport = await service.generateIPEDSGraduationRatesReport(2024);
     * ```
     */
    generateIPEDSGraduationRatesReport(surveyYear: number): Promise<IPEDSReport>;
    /**
     * 4. Generates IPEDS Financial Aid (FA) report.
     *
     * @param {number} surveyYear - Survey year
     * @returns {Promise<IPEDSReport>} IPEDS FA report
     *
     * @example
     * ```typescript
     * const faReport = await service.generateIPEDSFinancialAidReport(2024);
     * ```
     */
    generateIPEDSFinancialAidReport(surveyYear: number): Promise<IPEDSReport>;
    /**
     * 5. Generates IPEDS Finance (F) report.
     *
     * @param {number} fiscalYear - Fiscal year
     * @returns {Promise<IPEDSReport>} IPEDS F report
     *
     * @example
     * ```typescript
     * const fReport = await service.generateIPEDSFinanceReport(2024);
     * ```
     */
    generateIPEDSFinanceReport(fiscalYear: number): Promise<IPEDSReport>;
    /**
     * 6. Validates IPEDS report data.
     *
     * @param {IPEDSReport} report - IPEDS report
     * @returns {Promise<{valid: boolean; errors: string[]; warnings: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateIPEDSReport(efReport);
     * if (!validation.valid) {
     *   console.log('Errors:', validation.errors);
     * }
     * ```
     */
    validateIPEDSReport(report: IPEDSReport): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    /**
     * 7. Submits IPEDS report.
     *
     * @param {string} reportId - Report identifier
     * @param {string} certifiedBy - Certifier name
     * @returns {Promise<IPEDSReport>} Submitted report
     *
     * @example
     * ```typescript
     * await service.submitIPEDSReport('IPEDS-EF-2024', 'Dr. Jane Smith');
     * ```
     */
    submitIPEDSReport(reportId: string, certifiedBy: string): Promise<IPEDSReport>;
    /**
     * 8. Exports IPEDS report to required format.
     *
     * @param {string} reportId - Report identifier
     * @param {string} format - Export format
     * @returns {Promise<Buffer>} Exported report
     *
     * @example
     * ```typescript
     * const csv = await service.exportIPEDSReport('IPEDS-EF-2024', 'csv');
     * ```
     */
    exportIPEDSReport(reportId: string, format: 'csv' | 'xml'): Promise<Buffer>;
    /**
     * 9. Generates state enrollment report.
     *
     * @param {string} stateCode - State code
     * @param {string} term - Academic term
     * @returns {Promise<StateReport>} State report
     *
     * @example
     * ```typescript
     * const caReport = await service.generateStateEnrollmentReport('CA', 'Fall 2024');
     * ```
     */
    generateStateEnrollmentReport(stateCode: string, term: string): Promise<StateReport>;
    /**
     * 10. Generates state financial aid report.
     *
     * @param {string} stateCode - State code
     * @param {number} fiscalYear - Fiscal year
     * @returns {Promise<StateReport>} State report
     *
     * @example
     * ```typescript
     * const report = await service.generateStateFinancialAidReport('CA', 2024);
     * ```
     */
    generateStateFinancialAidReport(stateCode: string, fiscalYear: number): Promise<StateReport>;
    /**
     * 11. Generates state graduation outcomes report.
     *
     * @param {string} stateCode - State code
     * @param {number} cohortYear - Cohort year
     * @returns {Promise<StateReport>} State report
     *
     * @example
     * ```typescript
     * const report = await service.generateStateGraduationReport('CA', 2018);
     * ```
     */
    generateStateGraduationReport(stateCode: string, cohortYear: number): Promise<StateReport>;
    /**
     * 12. Submits state report to portal.
     *
     * @param {string} reportId - Report identifier
     * @returns {Promise<{submitted: boolean; confirmationNumber: string}>} Submission result
     *
     * @example
     * ```typescript
     * const result = await service.submitStateReport('STATE-CA-ENR-001');
     * ```
     */
    submitStateReport(reportId: string): Promise<{
        submitted: boolean;
        confirmationNumber: string;
    }>;
    /**
     * 13. Retrieves state reporting requirements.
     *
     * @param {string} stateCode - State code
     * @returns {Promise<Array<{reportName: string; frequency: string; dueDate: Date}>>} Requirements
     *
     * @example
     * ```typescript
     * const requirements = await service.getStateReportingRequirements('CA');
     * ```
     */
    getStateReportingRequirements(stateCode: string): Promise<Array<{
        reportName: string;
        frequency: string;
        dueDate: Date;
    }>>;
    /**
     * 14. Validates state report format.
     *
     * @param {StateReport} report - State report
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateStateReport(report);
     * ```
     */
    validateStateReport(report: StateReport): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 15. Generates Clery Act annual security report.
     *
     * @param {number} year - Calendar year
     * @returns {Promise<CleryStatistics>} Clery statistics
     *
     * @example
     * ```typescript
     * const clery = await service.generateCleryActReport(2024);
     * console.log(`Total crimes: ${Object.values(clery.criminalOffenses).reduce((a, b) => a + b)}`);
     * ```
     */
    generateCleryActReport(year: number): Promise<CleryStatistics>;
    /**
     * 16. Calculates cohort default rate.
     *
     * @param {number} cohortYear - Cohort year
     * @returns {Promise<CohortDefaultRate>} CDR data
     *
     * @example
     * ```typescript
     * const cdr = await service.calculateCohortDefaultRate(2021);
     * console.log(`Default rate: ${cdr.defaultRate}%`);
     * ```
     */
    calculateCohortDefaultRate(cohortYear: number): Promise<CohortDefaultRate>;
    /**
     * 17. Generates Title IV compliance report.
     *
     * @param {number} fiscalYear - Fiscal year
     * @returns {Promise<TitleIVCompliance>} Compliance report
     *
     * @example
     * ```typescript
     * const compliance = await service.generateTitleIVComplianceReport(2024);
     * ```
     */
    generateTitleIVComplianceReport(fiscalYear: number): Promise<TitleIVCompliance>;
    /**
     * 18. Logs FERPA access for audit trail.
     *
     * @param {FERPALog} logEntry - Log entry
     * @returns {Promise<FERPALog>} Created log
     *
     * @example
     * ```typescript
     * await service.logFERPAAccess({
     *   logId: 'LOG-001',
     *   accessType: 'view',
     *   studentId: 'STU123456',
     *   recordType: 'transcript',
     *   accessedBy: 'ADVISOR123',
     *   accessDate: new Date(),
     *   purpose: 'Academic advising',
     *   consentProvided: false,
     *   legitEducationalInterest: true,
     *   ipAddress: '192.168.1.100'
     * });
     * ```
     */
    logFERPAAccess(logEntry: FERPALog): Promise<FERPALog>;
    /**
     * 19. Generates FERPA compliance audit report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<{totalAccesses: number; unauthorized: number; violations: string[]}>} Audit report
     *
     * @example
     * ```typescript
     * const audit = await service.generateFERPAAuditReport(
     *   new Date('2024-01-01'),
     *   new Date('2024-12-31')
     * );
     * ```
     */
    generateFERPAAuditReport(startDate: Date, endDate: Date): Promise<{
        totalAccesses: number;
        unauthorized: number;
        violations: string[];
    }>;
    /**
     * 20. Validates directory information disclosure.
     *
     * @param {string} studentId - Student identifier
     * @param {string} requestedBy - Requester identifier
     * @returns {Promise<{allowed: boolean; reason: string}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateDirectoryInfoDisclosure('STU123456', 'PUBLIC');
     * ```
     */
    validateDirectoryInfoDisclosure(studentId: string, requestedBy: string): Promise<{
        allowed: boolean;
        reason: string;
    }>;
    /**
     * 21. Generates equity in athletics report.
     *
     * @param {number} year - Academic year
     * @returns {Promise<any>} Athletics equity report
     *
     * @example
     * ```typescript
     * const report = await service.generateAthleticsEquityReport(2024);
     * ```
     */
    generateAthleticsEquityReport(year: number): Promise<any>;
    /**
     * 22. Submits federal compliance report.
     *
     * @param {string} reportType - Report type
     * @param {any} reportData - Report data
     * @returns {Promise<{submitted: boolean; confirmationId: string}>} Submission result
     *
     * @example
     * ```typescript
     * await service.submitFederalComplianceReport('clery', cleryData);
     * ```
     */
    submitFederalComplianceReport(reportType: string, reportData: any): Promise<{
        submitted: boolean;
        confirmationId: string;
    }>;
    /**
     * 23. Generates enrollment snapshot report.
     *
     * @param {string} term - Academic term
     * @param {Date} snapshotDate - Snapshot date
     * @returns {Promise<EnrollmentReport>} Enrollment report
     *
     * @example
     * ```typescript
     * const enrollment = await service.generateEnrollmentSnapshot(
     *   'Fall 2024',
     *   new Date('2024-09-15')
     * );
     * ```
     */
    generateEnrollmentSnapshot(term: string, snapshotDate: Date): Promise<EnrollmentReport>;
    /**
     * 24. Calculates graduation rates by cohort.
     *
     * @param {number} cohortYear - Starting cohort year
     * @returns {Promise<GraduationRateCohort>} Graduation rates
     *
     * @example
     * ```typescript
     * const cohort = await service.calculateGraduationRates(2018);
     * console.log(`6-year rate: ${cohort.rate6Year}%`);
     * ```
     */
    calculateGraduationRates(cohortYear: number): Promise<GraduationRateCohort>;
    /**
     * 25. Generates retention rate report.
     *
     * @param {number} cohortYear - Cohort year
     * @returns {Promise<{year1: number; year2: number; year3: number}>} Retention rates
     *
     * @example
     * ```typescript
     * const retention = await service.generateRetentionReport(2023);
     * ```
     */
    generateRetentionReport(cohortYear: number): Promise<{
        year1: number;
        year2: number;
        year3: number;
    }>;
    /**
     * 26. Calculates outcome measures.
     *
     * @param {number} cohortYear - Cohort year
     * @returns {Promise<any>} Outcome measures
     *
     * @example
     * ```typescript
     * const outcomes = await service.calculateOutcomeMeasures(2016);
     * ```
     */
    calculateOutcomeMeasures(cohortYear: number): Promise<any>;
    /**
     * 27. Generates time-to-degree report.
     *
     * @param {number} completionYear - Completion year
     * @returns {Promise<any>} Time-to-degree data
     *
     * @example
     * ```typescript
     * const ttd = await service.generateTimeToDegreeReport(2024);
     * ```
     */
    generateTimeToDegreeReport(completionYear: number): Promise<any>;
    /**
     * 28. Tracks enrollment trends over time.
     *
     * @param {number} startYear - Start year
     * @param {number} endYear - End year
     * @returns {Promise<Array<{year: number; enrollment: number}>>} Trend data
     *
     * @example
     * ```typescript
     * const trends = await service.trackEnrollmentTrends(2020, 2024);
     * ```
     */
    trackEnrollmentTrends(startYear: number, endYear: number): Promise<Array<{
        year: number;
        enrollment: number;
    }>>;
    /**
     * 29. Generates completion efficiency report.
     *
     * @param {string} program - Program code
     * @param {number} cohortYear - Cohort year
     * @returns {Promise<any>} Efficiency metrics
     *
     * @example
     * ```typescript
     * const efficiency = await service.generateCompletionEfficiency('COMP_SCI', 2020);
     * ```
     */
    generateCompletionEfficiency(program: string, cohortYear: number): Promise<any>;
    /**
     * 30. Calculates persistence rates.
     *
     * @param {string} term - Starting term
     * @returns {Promise<{fallToSpring: number; fallToFall: number}>} Persistence rates
     *
     * @example
     * ```typescript
     * const persistence = await service.calculatePersistenceRates('Fall 2023');
     * ```
     */
    calculatePersistenceRates(term: string): Promise<{
        fallToSpring: number;
        fallToFall: number;
    }>;
    /**
     * 31. Generates equity gap analysis.
     *
     * @param {string} reportType - Report type
     * @param {string} academicYear - Academic year
     * @returns {Promise<EquityReport>} Equity report
     *
     * @example
     * ```typescript
     * const equity = await service.generateEquityGapAnalysis('racial_equity', '2023-2024');
     * ```
     */
    generateEquityGapAnalysis(reportType: string, academicYear: string): Promise<EquityReport>;
    /**
     * 32. Tracks achievement gaps by demographics.
     *
     * @param {string} metric - Metric type
     * @returns {Promise<Array<{group: string; value: number}>>} Gap data
     *
     * @example
     * ```typescript
     * const gaps = await service.trackAchievementGaps('graduation_rate');
     * ```
     */
    trackAchievementGaps(metric: string): Promise<Array<{
        group: string;
        value: number;
    }>>;
    /**
     * 33. Generates diversity report.
     *
     * @param {string} type - Diversity type
     * @returns {Promise<any>} Diversity report
     *
     * @example
     * ```typescript
     * const diversity = await service.generateDiversityReport('student');
     * ```
     */
    generateDiversityReport(type: 'student' | 'faculty' | 'staff'): Promise<any>;
    /**
     * 34. Generates audit compliance checklist.
     *
     * @param {string} auditType - Audit type
     * @returns {Promise<Array<{item: string; compliant: boolean; notes: string}>>} Checklist
     *
     * @example
     * ```typescript
     * const checklist = await service.generateAuditChecklist('title_iv');
     * ```
     */
    generateAuditChecklist(auditType: string): Promise<Array<{
        item: string;
        compliant: boolean;
        notes: string;
    }>>;
    /**
     * 35. Tracks compliance deadlines.
     *
     * @returns {Promise<Array<{report: string; deadline: Date; status: string}>>} Deadlines
     *
     * @example
     * ```typescript
     * const deadlines = await service.trackComplianceDeadlines();
     * ```
     */
    trackComplianceDeadlines(): Promise<Array<{
        report: string;
        deadline: Date;
        status: string;
    }>>;
    /**
     * 36. Generates regulatory compliance scorecard.
     *
     * @returns {Promise<any>} Compliance scorecard
     *
     * @example
     * ```typescript
     * const scorecard = await service.generateComplianceScorecard();
     * ```
     */
    generateComplianceScorecard(): Promise<any>;
    /**
     * 37. Archives completed compliance reports.
     *
     * @param {string} reportId - Report identifier
     * @returns {Promise<boolean>} Archive success
     *
     * @example
     * ```typescript
     * await service.archiveComplianceReport('IPEDS-EF-2023');
     * ```
     */
    archiveComplianceReport(reportId: string): Promise<boolean>;
    /**
     * 38. Generates data quality report.
     *
     * @param {string} dataSet - Data set name
     * @returns {Promise<{accuracy: number; completeness: number; issues: string[]}>} Quality report
     *
     * @example
     * ```typescript
     * const quality = await service.generateDataQualityReport('student_records');
     * ```
     */
    generateDataQualityReport(dataSet: string): Promise<{
        accuracy: number;
        completeness: number;
        issues: string[];
    }>;
    /**
     * 39. Schedules automated report generation.
     *
     * @param {string} reportType - Report type
     * @param {string} frequency - Generation frequency
     * @returns {Promise<{scheduleId: string; nextRun: Date}>} Schedule info
     *
     * @example
     * ```typescript
     * const schedule = await service.scheduleAutomatedReport('enrollment', 'weekly');
     * ```
     */
    scheduleAutomatedReport(reportType: string, frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'): Promise<{
        scheduleId: string;
        nextRun: Date;
    }>;
    /**
     * 40. Generates comprehensive compliance dashboard.
     *
     * @returns {Promise<any>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateComplianceDashboard();
     * ```
     */
    generateComplianceDashboard(): Promise<any>;
}
export default ComplianceReportingCompositeService;
//# sourceMappingURL=compliance-reporting-composite.d.ts.map