/**
 * LOC: EDU-ATT-001
 * File: /reuse/education/attendance-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - ../error-handling-kit.ts (exception classes)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/education/attendance/*
 *   - backend/controllers/attendance.controller.ts
 *   - backend/services/attendance.service.ts
 *   - backend/reports/attendance-reports.service.ts
 */
/**
 * File: /reuse/education/attendance-tracking-kit.ts
 * Locator: WC-EDU-ATT-KIT-001
 * Purpose: Education SIS Attendance Tracking System - comprehensive attendance management, recording, reporting, analytics
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, error-handling-kit, validation-kit
 * Downstream: Attendance controllers, student services, reporting modules, compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for attendance recording, absence management, reporting, analytics, compliance
 *
 * LLM Context: Production-grade attendance tracking system for education SIS platforms.
 * Provides comprehensive attendance lifecycle management including daily attendance recording,
 * tardiness tracking, early dismissals, excused/unexcused absences, makeup class scheduling,
 * attendance alerts and notifications, parent communication, chronic absenteeism detection,
 * compliance reporting (state/federal requirements), attendance analytics, period-based tracking,
 * and integration with grading systems. Optimized Sequelize queries with eager loading and N+1 prevention.
 */
import { Model, Sequelize, Transaction, WhereOptions } from 'sequelize';
/**
 * Attendance status enumeration
 */
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    TARDY = "tardy",
    EARLY_DISMISSAL = "early_dismissal",
    EXCUSED = "excused",
    UNEXCUSED = "unexcused",
    VIRTUAL = "virtual",
    HYBRID = "hybrid"
}
/**
 * Absence type enumeration
 */
export declare enum AbsenceType {
    ILLNESS = "illness",
    MEDICAL_APPOINTMENT = "medical_appointment",
    FAMILY_EMERGENCY = "family_emergency",
    RELIGIOUS_OBSERVANCE = "religious_observance",
    SCHOOL_ACTIVITY = "school_activity",
    SUSPENSION = "suspension",
    EXCUSED_OTHER = "excused_other",
    UNEXCUSED = "unexcused",
    TRUANCY = "truancy"
}
/**
 * Attendance period type
 */
export declare enum PeriodType {
    FULL_DAY = "full_day",
    MORNING = "morning",
    AFTERNOON = "afternoon",
    PERIOD_1 = "period_1",
    PERIOD_2 = "period_2",
    PERIOD_3 = "period_3",
    PERIOD_4 = "period_4",
    PERIOD_5 = "period_5",
    PERIOD_6 = "period_6",
    PERIOD_7 = "period_7",
    PERIOD_8 = "period_8"
}
/**
 * Attendance alert type
 */
export declare enum AlertType {
    CHRONIC_ABSENCE = "chronic_absence",
    CONSECUTIVE_ABSENCE = "consecutive_absence",
    PATTERN_DETECTED = "pattern_detected",
    TRUANCY_RISK = "truancy_risk",
    IMPROVED_ATTENDANCE = "improved_attendance"
}
interface AttendanceRecordData {
    studentId: string;
    classId?: string;
    schoolId: string;
    date: Date;
    status: AttendanceStatus;
    periodType: PeriodType;
    absenceType?: AbsenceType;
    notes?: string;
    recordedBy: string;
    recordedAt: Date;
    verifiedBy?: string;
    verifiedAt?: Date;
    minutesLate?: number;
    minutesAbsent?: number;
    excuseDocumentUrl?: string;
    metadata?: Record<string, any>;
}
interface AttendancePolicyData {
    schoolId: string;
    policyName: string;
    academicYear: string;
    maxExcusedAbsences: number;
    maxUnexcusedAbsences: number;
    chronicAbsenceThreshold: number;
    tardyThreshold: number;
    excusedAbsenceTypes: AbsenceType[];
    requiresDocumentation: boolean;
    documentationDeadlineDays: number;
    truancyReferralThreshold: number;
    parentNotificationRequired: boolean;
    effectiveDate: Date;
    expirationDate?: Date;
}
interface AttendanceStatistics {
    studentId: string;
    academicYear: string;
    totalSchoolDays: number;
    daysPresent: number;
    daysAbsent: number;
    excusedAbsences: number;
    unexcusedAbsences: number;
    tardies: number;
    earlyDismissals: number;
    attendanceRate: number;
    chronicAbsence: boolean;
    consecutiveAbsences: number;
    lastAbsenceDate?: Date;
}
interface AttendanceAlertData {
    studentId: string;
    alertType: AlertType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    triggeredDate: Date;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    actionTaken?: string;
    resolved: boolean;
    resolvedAt?: Date;
    metadata: Record<string, any>;
}
interface MakeupClassData {
    studentId: string;
    originalAbsenceId: string;
    scheduledDate: Date;
    classId: string;
    teacherId: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    completedDate?: Date;
    notes?: string;
    approvedBy: string;
}
interface AttendanceReportOptions {
    startDate: Date;
    endDate: Date;
    schoolId?: string;
    gradeLevel?: string;
    classId?: string;
    studentIds?: string[];
    groupBy?: 'student' | 'class' | 'grade' | 'date';
    includeStatistics?: boolean;
    format?: 'detailed' | 'summary';
}
interface BulkAttendanceData {
    classId: string;
    date: Date;
    periodType: PeriodType;
    recordedBy: string;
    records: Array<{
        studentId: string;
        status: AttendanceStatus;
        absenceType?: AbsenceType;
        notes?: string;
        minutesLate?: number;
    }>;
}
interface AttendancePattern {
    studentId: string;
    patternType: 'weekly' | 'biweekly' | 'monthly' | 'random';
    description: string;
    confidence: number;
    detectedPatterns: string[];
    suggestions: string[];
}
/**
 * Attendance model - stores individual attendance records
 */
export declare class Attendance extends Model {
    id: string;
    studentId: string;
    classId: string | null;
    schoolId: string;
    date: Date;
    status: AttendanceStatus;
    periodType: PeriodType;
    absenceType: AbsenceType | null;
    notes: string | null;
    recordedBy: string;
    recordedAt: Date;
    verifiedBy: string | null;
    verifiedAt: Date | null;
    minutesLate: number | null;
    minutesAbsent: number | null;
    excuseDocumentUrl: string | null;
    metadata: Record<string, any> | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
/**
 * Initialize Attendance model
 */
export declare function initAttendanceModel(sequelize: Sequelize): typeof Attendance;
/**
 * AttendanceRecord model - aggregated daily attendance summary
 */
export declare class AttendanceRecord extends Model {
    id: string;
    studentId: string;
    schoolId: string;
    academicYear: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    excusedAbsences: number;
    unexcusedAbsences: number;
    tardies: number;
    earlyDismissals: number;
    attendanceRate: number;
    lastUpdated: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize AttendanceRecord model
 */
export declare function initAttendanceRecordModel(sequelize: Sequelize): typeof AttendanceRecord;
/**
 * AttendancePolicy model - school attendance policies
 */
export declare class AttendancePolicy extends Model {
    id: string;
    schoolId: string;
    policyName: string;
    academicYear: string;
    maxExcusedAbsences: number;
    maxUnexcusedAbsences: number;
    chronicAbsenceThreshold: number;
    tardyThreshold: number;
    excusedAbsenceTypes: AbsenceType[];
    requiresDocumentation: boolean;
    documentationDeadlineDays: number;
    truancyReferralThreshold: number;
    parentNotificationRequired: boolean;
    effectiveDate: Date;
    expirationDate: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize AttendancePolicy model
 */
export declare function initAttendancePolicyModel(sequelize: Sequelize): typeof AttendancePolicy;
/**
 * AttendanceAlert model - stores alerts for attendance issues
 */
export declare class AttendanceAlert extends Model {
    id: string;
    studentId: string;
    alertType: AlertType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    triggeredDate: Date;
    acknowledgedBy: string | null;
    acknowledgedAt: Date | null;
    actionTaken: string | null;
    resolved: boolean;
    resolvedAt: Date | null;
    metadata: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize AttendanceAlert model
 */
export declare function initAttendanceAlertModel(sequelize: Sequelize): typeof AttendanceAlert;
/**
 * MakeupClass model - tracks makeup classes for absences
 */
export declare class MakeupClass extends Model {
    id: string;
    studentId: string;
    originalAbsenceId: string;
    scheduledDate: Date;
    classId: string;
    teacherId: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    completedDate: Date | null;
    notes: string | null;
    approvedBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize MakeupClass model
 */
export declare function initMakeupClassModel(sequelize: Sequelize): typeof MakeupClass;
/**
 * 1. Records a single attendance entry
 * Optimized with validation and conflict checking
 */
export declare function recordAttendance(sequelize: Sequelize, data: AttendanceRecordData, transaction?: Transaction): Promise<Attendance>;
/**
 * 2. Records bulk attendance for an entire class
 * Optimized batch insert with conflict resolution
 */
export declare function recordBulkAttendance(sequelize: Sequelize, bulkData: BulkAttendanceData, transaction?: Transaction): Promise<{
    created: number;
    updated: number;
    errors: any[];
}>;
/**
 * 3. Updates an existing attendance record
 * Includes audit trail and verification
 */
export declare function updateAttendanceRecord(sequelize: Sequelize, attendanceId: string, updates: Partial<AttendanceRecordData>, verifiedBy?: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 4. Marks a student as tardy with minutes late
 */
export declare function markStudentTardy(sequelize: Sequelize, studentId: string, classId: string, date: Date, minutesLate: number, recordedBy: string, notes?: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 5. Records early dismissal
 */
export declare function recordEarlyDismissal(sequelize: Sequelize, studentId: string, schoolId: string, date: Date, dismissalTime: Date, reason: string, recordedBy: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 6. Records an excused absence with documentation
 */
export declare function recordExcusedAbsence(sequelize: Sequelize, studentId: string, schoolId: string, date: Date, absenceType: AbsenceType, excuseDocumentUrl?: string, notes?: string, recordedBy?: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 7. Records an unexcused absence
 */
export declare function recordUnexcusedAbsence(sequelize: Sequelize, studentId: string, schoolId: string, date: Date, recordedBy: string, notes?: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 8. Converts unexcused absence to excused with documentation
 */
export declare function convertToExcusedAbsence(sequelize: Sequelize, attendanceId: string, absenceType: AbsenceType, excuseDocumentUrl: string, verifiedBy: string, transaction?: Transaction): Promise<Attendance>;
/**
 * 9. Gets all absences for a student in a date range
 * Optimized with eager loading
 */
export declare function getStudentAbsences(sequelize: Sequelize, studentId: string, startDate: Date, endDate: Date, includeExcused?: boolean): Promise<Attendance[]>;
/**
 * 10. Gets consecutive absences for a student
 */
export declare function getConsecutiveAbsences(sequelize: Sequelize, studentId: string, asOfDate?: Date): Promise<{
    count: number;
    startDate: Date;
    absences: Attendance[];
}>;
/**
 * 11. Generates comprehensive attendance report
 * Optimized with complex joins and aggregations
 */
export declare function generateAttendanceReport(sequelize: Sequelize, options: AttendanceReportOptions): Promise<any[]>;
/**
 * 12. Gets daily attendance summary for a school
 */
export declare function getDailyAttendanceSummary(sequelize: Sequelize, schoolId: string, date: Date): Promise<{
    totalStudents: number;
    present: number;
    absent: number;
    tardy: number;
    excused: number;
    unexcused: number;
    attendanceRate: number;
}>;
/**
 * 13. Gets class attendance summary
 */
export declare function getClassAttendanceSummary(sequelize: Sequelize, classId: string, startDate: Date, endDate: Date): Promise<any[]>;
/**
 * 14. Gets attendance trends over time
 */
export declare function getAttendanceTrends(sequelize: Sequelize, schoolId: string, startDate: Date, endDate: Date, groupBy?: 'day' | 'week' | 'month'): Promise<any[]>;
/**
 * 15. Gets attendance statistics for a student
 */
export declare function getStudentAttendanceStatistics(sequelize: Sequelize, studentId: string, academicYear: string): Promise<AttendanceStatistics>;
/**
 * 16. Creates an attendance alert
 */
export declare function createAttendanceAlert(sequelize: Sequelize, alertData: AttendanceAlertData, transaction?: Transaction): Promise<AttendanceAlert>;
/**
 * 17. Checks for chronic absenteeism and creates alerts
 */
export declare function checkChronicAbsenteeism(sequelize: Sequelize, schoolId: string, academicYear: string, transaction?: Transaction): Promise<AttendanceAlert[]>;
/**
 * 18. Checks for consecutive absences and creates alerts
 */
export declare function checkConsecutiveAbsences(sequelize: Sequelize, studentId: string, threshold?: number, transaction?: Transaction): Promise<AttendanceAlert | null>;
/**
 * 19. Gets unresolved alerts for a student
 */
export declare function getUnresolvedAlertsForStudent(sequelize: Sequelize, studentId: string): Promise<AttendanceAlert[]>;
/**
 * 20. Acknowledges an attendance alert
 */
export declare function acknowledgeAlert(sequelize: Sequelize, alertId: string, acknowledgedBy: string, actionTaken?: string, transaction?: Transaction): Promise<AttendanceAlert>;
/**
 * 21. Resolves an attendance alert
 */
export declare function resolveAlert(sequelize: Sequelize, alertId: string, resolvedBy: string, resolutionNotes: string, transaction?: Transaction): Promise<AttendanceAlert>;
/**
 * 22. Analyzes attendance patterns for a student
 */
export declare function analyzeAttendancePatterns(sequelize: Sequelize, studentId: string, academicYear: string): Promise<AttendancePattern>;
/**
 * 23. Gets students at risk of truancy
 */
export declare function getStudentsAtRiskOfTruancy(sequelize: Sequelize, schoolId: string, academicYear: string, threshold?: number): Promise<any[]>;
/**
 * 24. Calculates attendance rate for multiple students
 * Optimized batch calculation
 */
export declare function calculateBatchAttendanceRates(sequelize: Sequelize, studentIds: string[], startDate: Date, endDate: Date): Promise<Map<string, number>>;
/**
 * 25. Gets attendance comparison by grade level
 */
export declare function getAttendanceByGradeLevel(sequelize: Sequelize, schoolId: string, academicYear: string): Promise<any[]>;
/**
 * 26. Schedules a makeup class
 */
export declare function scheduleMakeupClass(sequelize: Sequelize, makeupData: MakeupClassData, transaction?: Transaction): Promise<MakeupClass>;
/**
 * 27. Gets scheduled makeup classes for a student
 */
export declare function getStudentMakeupClasses(sequelize: Sequelize, studentId: string, status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'): Promise<MakeupClass[]>;
/**
 * 28. Completes a makeup class
 */
export declare function completeMakeupClass(sequelize: Sequelize, makeupClassId: string, completedDate: Date, notes?: string, transaction?: Transaction): Promise<MakeupClass>;
/**
 * 29. Cancels a makeup class
 */
export declare function cancelMakeupClass(sequelize: Sequelize, makeupClassId: string, reason: string, transaction?: Transaction): Promise<MakeupClass>;
/**
 * 30. Gets makeup class statistics for a student
 */
export declare function getMakeupClassStatistics(sequelize: Sequelize, studentId: string, academicYear: string): Promise<{
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: number;
}>;
/**
 * 31. Creates or updates attendance policy
 */
export declare function createAttendancePolicy(sequelize: Sequelize, policyData: AttendancePolicyData, transaction?: Transaction): Promise<AttendancePolicy>;
/**
 * 32. Gets active attendance policy for a school
 */
export declare function getActiveAttendancePolicy(sequelize: Sequelize, schoolId: string, academicYear: string, asOfDate?: Date): Promise<AttendancePolicy | null>;
/**
 * 33. Validates attendance against policy
 */
export declare function validateAttendanceAgainstPolicy(sequelize: Sequelize, studentId: string, schoolId: string, academicYear: string): Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * 34. Generates state compliance report
 */
export declare function generateStateComplianceReport(sequelize: Sequelize, schoolId: string, academicYear: string): Promise<any>;
/**
 * 35. Updates attendance record summary (batch job)
 */
export declare function updateAttendanceRecordSummaries(sequelize: Sequelize, schoolId: string, academicYear: string, transaction?: Transaction): Promise<number>;
/**
 * 36. Gets attendance with optimized eager loading
 * Prevents N+1 queries
 */
export declare function getAttendanceWithRelations(sequelize: Sequelize, whereClause: WhereOptions, limit?: number, offset?: number): Promise<{
    rows: Attendance[];
    count: number;
}>;
/**
 * 37. Bulk fetches attendance for multiple students
 * Optimized with single query
 */
export declare function bulkFetchStudentAttendance(sequelize: Sequelize, studentIds: string[], startDate: Date, endDate: Date): Promise<Map<string, Attendance[]>>;
/**
 * 38. Gets attendance with complex filtering and aggregation
 */
export declare function getAttendanceWithAdvancedFilters(sequelize: Sequelize, filters: {
    schoolIds?: string[];
    gradeLevel?: string;
    status?: AttendanceStatus[];
    dateRange: {
        start: Date;
        end: Date;
    };
    minAttendanceRate?: number;
    maxAbsences?: number;
}): Promise<any[]>;
/**
 * 39. Gets attendance leaderboard (highest attendance rates)
 */
export declare function getAttendanceLeaderboard(sequelize: Sequelize, schoolId: string, academicYear: string, limit?: number): Promise<any[]>;
/**
 * 40. Gets attendance outliers (students with unusual patterns)
 */
export declare function getAttendanceOutliers(sequelize: Sequelize, schoolId: string, academicYear: string): Promise<any[]>;
/**
 * 41. Searches attendance records with full-text search
 */
export declare function searchAttendanceRecords(sequelize: Sequelize, searchTerm: string, schoolId: string, limit?: number): Promise<Attendance[]>;
/**
 * 42. Gets attendance heatmap data (by day and period)
 */
export declare function getAttendanceHeatmap(sequelize: Sequelize, schoolId: string, startDate: Date, endDate: Date): Promise<any[]>;
/**
 * 43. Exports attendance data for external reporting
 */
export declare function exportAttendanceData(sequelize: Sequelize, options: AttendanceReportOptions): Promise<any[]>;
/**
 * 44. Gets period-based attendance summary
 */
export declare function getPeriodBasedAttendanceSummary(sequelize: Sequelize, classId: string, date: Date): Promise<any[]>;
/**
 * 45. Archives old attendance records (data retention)
 */
export declare function archiveOldAttendanceRecords(sequelize: Sequelize, olderThanYears?: number, transaction?: Transaction): Promise<{
    archived: number;
    deleted: number;
}>;
declare const _default: {
    Attendance: typeof Attendance;
    AttendanceRecord: typeof AttendanceRecord;
    AttendancePolicy: typeof AttendancePolicy;
    AttendanceAlert: typeof AttendanceAlert;
    MakeupClass: typeof MakeupClass;
    initAttendanceModel: typeof initAttendanceModel;
    initAttendanceRecordModel: typeof initAttendanceRecordModel;
    initAttendancePolicyModel: typeof initAttendancePolicyModel;
    initAttendanceAlertModel: typeof initAttendanceAlertModel;
    initMakeupClassModel: typeof initMakeupClassModel;
    recordAttendance: typeof recordAttendance;
    recordBulkAttendance: typeof recordBulkAttendance;
    updateAttendanceRecord: typeof updateAttendanceRecord;
    markStudentTardy: typeof markStudentTardy;
    recordEarlyDismissal: typeof recordEarlyDismissal;
    recordExcusedAbsence: typeof recordExcusedAbsence;
    recordUnexcusedAbsence: typeof recordUnexcusedAbsence;
    convertToExcusedAbsence: typeof convertToExcusedAbsence;
    getStudentAbsences: typeof getStudentAbsences;
    getConsecutiveAbsences: typeof getConsecutiveAbsences;
    generateAttendanceReport: typeof generateAttendanceReport;
    getDailyAttendanceSummary: typeof getDailyAttendanceSummary;
    getClassAttendanceSummary: typeof getClassAttendanceSummary;
    getAttendanceTrends: typeof getAttendanceTrends;
    getStudentAttendanceStatistics: typeof getStudentAttendanceStatistics;
    createAttendanceAlert: typeof createAttendanceAlert;
    checkChronicAbsenteeism: typeof checkChronicAbsenteeism;
    checkConsecutiveAbsences: typeof checkConsecutiveAbsences;
    getUnresolvedAlertsForStudent: typeof getUnresolvedAlertsForStudent;
    acknowledgeAlert: typeof acknowledgeAlert;
    resolveAlert: typeof resolveAlert;
    analyzeAttendancePatterns: typeof analyzeAttendancePatterns;
    getStudentsAtRiskOfTruancy: typeof getStudentsAtRiskOfTruancy;
    calculateBatchAttendanceRates: typeof calculateBatchAttendanceRates;
    getAttendanceByGradeLevel: typeof getAttendanceByGradeLevel;
    scheduleMakeupClass: typeof scheduleMakeupClass;
    getStudentMakeupClasses: typeof getStudentMakeupClasses;
    completeMakeupClass: typeof completeMakeupClass;
    cancelMakeupClass: typeof cancelMakeupClass;
    getMakeupClassStatistics: typeof getMakeupClassStatistics;
    createAttendancePolicy: typeof createAttendancePolicy;
    getActiveAttendancePolicy: typeof getActiveAttendancePolicy;
    validateAttendanceAgainstPolicy: typeof validateAttendanceAgainstPolicy;
    generateStateComplianceReport: typeof generateStateComplianceReport;
    updateAttendanceRecordSummaries: typeof updateAttendanceRecordSummaries;
    getAttendanceWithRelations: typeof getAttendanceWithRelations;
    bulkFetchStudentAttendance: typeof bulkFetchStudentAttendance;
    getAttendanceWithAdvancedFilters: typeof getAttendanceWithAdvancedFilters;
    getAttendanceLeaderboard: typeof getAttendanceLeaderboard;
    getAttendanceOutliers: typeof getAttendanceOutliers;
    searchAttendanceRecords: typeof searchAttendanceRecords;
    getAttendanceHeatmap: typeof getAttendanceHeatmap;
    exportAttendanceData: typeof exportAttendanceData;
    getPeriodBasedAttendanceSummary: typeof getPeriodBasedAttendanceSummary;
    archiveOldAttendanceRecords: typeof archiveOldAttendanceRecords;
};
export default _default;
//# sourceMappingURL=attendance-tracking-kit.d.ts.map