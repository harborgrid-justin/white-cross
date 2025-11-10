"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeupClass = exports.AttendanceAlert = exports.AttendancePolicy = exports.AttendanceRecord = exports.Attendance = exports.AlertType = exports.PeriodType = exports.AbsenceType = exports.AttendanceStatus = void 0;
exports.initAttendanceModel = initAttendanceModel;
exports.initAttendanceRecordModel = initAttendanceRecordModel;
exports.initAttendancePolicyModel = initAttendancePolicyModel;
exports.initAttendanceAlertModel = initAttendanceAlertModel;
exports.initMakeupClassModel = initMakeupClassModel;
exports.recordAttendance = recordAttendance;
exports.recordBulkAttendance = recordBulkAttendance;
exports.updateAttendanceRecord = updateAttendanceRecord;
exports.markStudentTardy = markStudentTardy;
exports.recordEarlyDismissal = recordEarlyDismissal;
exports.recordExcusedAbsence = recordExcusedAbsence;
exports.recordUnexcusedAbsence = recordUnexcusedAbsence;
exports.convertToExcusedAbsence = convertToExcusedAbsence;
exports.getStudentAbsences = getStudentAbsences;
exports.getConsecutiveAbsences = getConsecutiveAbsences;
exports.generateAttendanceReport = generateAttendanceReport;
exports.getDailyAttendanceSummary = getDailyAttendanceSummary;
exports.getClassAttendanceSummary = getClassAttendanceSummary;
exports.getAttendanceTrends = getAttendanceTrends;
exports.getStudentAttendanceStatistics = getStudentAttendanceStatistics;
exports.createAttendanceAlert = createAttendanceAlert;
exports.checkChronicAbsenteeism = checkChronicAbsenteeism;
exports.checkConsecutiveAbsences = checkConsecutiveAbsences;
exports.getUnresolvedAlertsForStudent = getUnresolvedAlertsForStudent;
exports.acknowledgeAlert = acknowledgeAlert;
exports.resolveAlert = resolveAlert;
exports.analyzeAttendancePatterns = analyzeAttendancePatterns;
exports.getStudentsAtRiskOfTruancy = getStudentsAtRiskOfTruancy;
exports.calculateBatchAttendanceRates = calculateBatchAttendanceRates;
exports.getAttendanceByGradeLevel = getAttendanceByGradeLevel;
exports.scheduleMakeupClass = scheduleMakeupClass;
exports.getStudentMakeupClasses = getStudentMakeupClasses;
exports.completeMakeupClass = completeMakeupClass;
exports.cancelMakeupClass = cancelMakeupClass;
exports.getMakeupClassStatistics = getMakeupClassStatistics;
exports.createAttendancePolicy = createAttendancePolicy;
exports.getActiveAttendancePolicy = getActiveAttendancePolicy;
exports.validateAttendanceAgainstPolicy = validateAttendanceAgainstPolicy;
exports.generateStateComplianceReport = generateStateComplianceReport;
exports.updateAttendanceRecordSummaries = updateAttendanceRecordSummaries;
exports.getAttendanceWithRelations = getAttendanceWithRelations;
exports.bulkFetchStudentAttendance = bulkFetchStudentAttendance;
exports.getAttendanceWithAdvancedFilters = getAttendanceWithAdvancedFilters;
exports.getAttendanceLeaderboard = getAttendanceLeaderboard;
exports.getAttendanceOutliers = getAttendanceOutliers;
exports.searchAttendanceRecords = searchAttendanceRecords;
exports.getAttendanceHeatmap = getAttendanceHeatmap;
exports.exportAttendanceData = exportAttendanceData;
exports.getPeriodBasedAttendanceSummary = getPeriodBasedAttendanceSummary;
exports.archiveOldAttendanceRecords = archiveOldAttendanceRecords;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Attendance status enumeration
 */
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["TARDY"] = "tardy";
    AttendanceStatus["EARLY_DISMISSAL"] = "early_dismissal";
    AttendanceStatus["EXCUSED"] = "excused";
    AttendanceStatus["UNEXCUSED"] = "unexcused";
    AttendanceStatus["VIRTUAL"] = "virtual";
    AttendanceStatus["HYBRID"] = "hybrid";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
/**
 * Absence type enumeration
 */
var AbsenceType;
(function (AbsenceType) {
    AbsenceType["ILLNESS"] = "illness";
    AbsenceType["MEDICAL_APPOINTMENT"] = "medical_appointment";
    AbsenceType["FAMILY_EMERGENCY"] = "family_emergency";
    AbsenceType["RELIGIOUS_OBSERVANCE"] = "religious_observance";
    AbsenceType["SCHOOL_ACTIVITY"] = "school_activity";
    AbsenceType["SUSPENSION"] = "suspension";
    AbsenceType["EXCUSED_OTHER"] = "excused_other";
    AbsenceType["UNEXCUSED"] = "unexcused";
    AbsenceType["TRUANCY"] = "truancy";
})(AbsenceType || (exports.AbsenceType = AbsenceType = {}));
/**
 * Attendance period type
 */
var PeriodType;
(function (PeriodType) {
    PeriodType["FULL_DAY"] = "full_day";
    PeriodType["MORNING"] = "morning";
    PeriodType["AFTERNOON"] = "afternoon";
    PeriodType["PERIOD_1"] = "period_1";
    PeriodType["PERIOD_2"] = "period_2";
    PeriodType["PERIOD_3"] = "period_3";
    PeriodType["PERIOD_4"] = "period_4";
    PeriodType["PERIOD_5"] = "period_5";
    PeriodType["PERIOD_6"] = "period_6";
    PeriodType["PERIOD_7"] = "period_7";
    PeriodType["PERIOD_8"] = "period_8";
})(PeriodType || (exports.PeriodType = PeriodType = {}));
/**
 * Attendance alert type
 */
var AlertType;
(function (AlertType) {
    AlertType["CHRONIC_ABSENCE"] = "chronic_absence";
    AlertType["CONSECUTIVE_ABSENCE"] = "consecutive_absence";
    AlertType["PATTERN_DETECTED"] = "pattern_detected";
    AlertType["TRUANCY_RISK"] = "truancy_risk";
    AlertType["IMPROVED_ATTENDANCE"] = "improved_attendance";
})(AlertType || (exports.AlertType = AlertType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Attendance model - stores individual attendance records
 */
class Attendance extends sequelize_1.Model {
}
exports.Attendance = Attendance;
/**
 * Initialize Attendance model
 */
function initAttendanceModel(sequelize) {
    Attendance.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'classes',
                key: 'id',
            },
        },
        schoolId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'schools',
                key: 'id',
            },
        },
        date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AttendanceStatus)),
            allowNull: false,
        },
        periodType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PeriodType)),
            allowNull: false,
            defaultValue: PeriodType.FULL_DAY,
        },
        absenceType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AbsenceType)),
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        recordedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        recordedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        verifiedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        verifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        minutesLate: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 1440, // max minutes in a day
            },
        },
        minutesAbsent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 1440,
            },
        },
        excuseDocumentUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'attendance',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                fields: ['student_id', 'date', 'period_type'],
                unique: true,
                name: 'attendance_student_date_period_unique',
            },
            {
                fields: ['student_id', 'date'],
                name: 'attendance_student_date_idx',
            },
            {
                fields: ['school_id', 'date'],
                name: 'attendance_school_date_idx',
            },
            {
                fields: ['class_id', 'date'],
                name: 'attendance_class_date_idx',
            },
            {
                fields: ['status'],
                name: 'attendance_status_idx',
            },
            {
                fields: ['recorded_at'],
                name: 'attendance_recorded_at_idx',
            },
            {
                fields: ['student_id'],
                where: {
                    status: {
                        [sequelize_1.Op.in]: [AttendanceStatus.ABSENT, AttendanceStatus.UNEXCUSED],
                    },
                },
                name: 'attendance_student_absences_idx',
            },
        ],
    });
    return Attendance;
}
/**
 * AttendanceRecord model - aggregated daily attendance summary
 */
class AttendanceRecord extends sequelize_1.Model {
}
exports.AttendanceRecord = AttendanceRecord;
/**
 * Initialize AttendanceRecord model
 */
function initAttendanceRecordModel(sequelize) {
    AttendanceRecord.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
        },
        schoolId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'schools',
                key: 'id',
            },
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(9), // e.g., "2023-2024"
            allowNull: false,
        },
        totalDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        presentDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        absentDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        excusedAbsences: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        unexcusedAbsences: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        tardies: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        earlyDismissals: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        attendanceRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            get() {
                const value = this.getDataValue('attendanceRate');
                return value ? parseFloat(value) : 0;
            },
        },
        lastUpdated: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'attendance_records',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['student_id', 'academic_year'],
                unique: true,
                name: 'attendance_record_student_year_unique',
            },
            {
                fields: ['school_id', 'academic_year'],
                name: 'attendance_record_school_year_idx',
            },
            {
                fields: ['attendance_rate'],
                name: 'attendance_record_rate_idx',
            },
        ],
    });
    return AttendanceRecord;
}
/**
 * AttendancePolicy model - school attendance policies
 */
class AttendancePolicy extends sequelize_1.Model {
}
exports.AttendancePolicy = AttendancePolicy;
/**
 * Initialize AttendancePolicy model
 */
function initAttendancePolicyModel(sequelize) {
    AttendancePolicy.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        schoolId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'schools',
                key: 'id',
            },
        },
        policyName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        maxExcusedAbsences: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        maxUnexcusedAbsences: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        chronicAbsenceThreshold: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 10.0, // 10% absence rate
        },
        tardyThreshold: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        excusedAbsenceTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [
                AbsenceType.ILLNESS,
                AbsenceType.MEDICAL_APPOINTMENT,
                AbsenceType.FAMILY_EMERGENCY,
                AbsenceType.RELIGIOUS_OBSERVANCE,
            ],
        },
        requiresDocumentation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        documentationDeadlineDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        truancyReferralThreshold: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        parentNotificationRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'attendance_policies',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['school_id', 'academic_year'],
                name: 'attendance_policy_school_year_idx',
            },
            {
                fields: ['effective_date', 'expiration_date'],
                name: 'attendance_policy_dates_idx',
            },
        ],
    });
    return AttendancePolicy;
}
/**
 * AttendanceAlert model - stores alerts for attendance issues
 */
class AttendanceAlert extends sequelize_1.Model {
}
exports.AttendanceAlert = AttendanceAlert;
/**
 * Initialize AttendanceAlert model
 */
function initAttendanceAlertModel(sequelize) {
    AttendanceAlert.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
        },
        alertType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AlertType)),
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        triggeredDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        acknowledgedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        acknowledgedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        actionTaken: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        resolved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'attendance_alerts',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['student_id', 'resolved'],
                name: 'attendance_alert_student_resolved_idx',
            },
            {
                fields: ['alert_type', 'severity'],
                name: 'attendance_alert_type_severity_idx',
            },
            {
                fields: ['triggered_date'],
                name: 'attendance_alert_triggered_idx',
            },
        ],
    });
    return AttendanceAlert;
}
/**
 * MakeupClass model - tracks makeup classes for absences
 */
class MakeupClass extends sequelize_1.Model {
}
exports.MakeupClass = MakeupClass;
/**
 * Initialize MakeupClass model
 */
function initMakeupClassModel(sequelize) {
    MakeupClass.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
        },
        originalAbsenceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'attendance',
                key: 'id',
            },
        },
        scheduledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'id',
            },
        },
        teacherId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'id',
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
            allowNull: false,
            defaultValue: 'scheduled',
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    }, {
        sequelize,
        tableName: 'makeup_classes',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['student_id', 'status'],
                name: 'makeup_class_student_status_idx',
            },
            {
                fields: ['scheduled_date'],
                name: 'makeup_class_scheduled_idx',
            },
            {
                fields: ['original_absence_id'],
                name: 'makeup_class_absence_idx',
            },
        ],
    });
    return MakeupClass;
}
// ============================================================================
// ATTENDANCE RECORDING FUNCTIONS
// ============================================================================
/**
 * 1. Records a single attendance entry
 * Optimized with validation and conflict checking
 */
async function recordAttendance(sequelize, data, transaction) {
    const t = transaction || await sequelize.transaction();
    try {
        // Check for existing record
        const existing = await Attendance.findOne({
            where: {
                studentId: data.studentId,
                date: data.date,
                periodType: data.periodType,
            },
            transaction: t,
        });
        if (existing) {
            // Update existing record
            await existing.update(data, { transaction: t });
            if (!transaction)
                await t.commit();
            return existing;
        }
        // Create new record
        const attendance = await Attendance.create(data, { transaction: t });
        if (!transaction)
            await t.commit();
        return attendance;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * 2. Records bulk attendance for an entire class
 * Optimized batch insert with conflict resolution
 */
async function recordBulkAttendance(sequelize, bulkData, transaction) {
    const t = transaction || await sequelize.transaction();
    try {
        const results = { created: 0, updated: 0, errors: [] };
        // Fetch existing records
        const studentIds = bulkData.records.map(r => r.studentId);
        const existing = await Attendance.findAll({
            where: {
                studentId: { [sequelize_1.Op.in]: studentIds },
                date: bulkData.date,
                periodType: bulkData.periodType,
            },
            transaction: t,
        });
        const existingMap = new Map(existing.map(a => [a.studentId, a]));
        // Process each record
        for (const record of bulkData.records) {
            try {
                const attendanceData = {
                    ...record,
                    classId: bulkData.classId,
                    schoolId: (await getSchoolIdFromClass(sequelize, bulkData.classId, t)),
                    date: bulkData.date,
                    periodType: bulkData.periodType,
                    recordedBy: bulkData.recordedBy,
                    recordedAt: new Date(),
                };
                const existingRecord = existingMap.get(record.studentId);
                if (existingRecord) {
                    await existingRecord.update(attendanceData, { transaction: t });
                    results.updated++;
                }
                else {
                    await Attendance.create(attendanceData, { transaction: t });
                    results.created++;
                }
            }
            catch (error) {
                results.errors.push({ studentId: record.studentId, error: error.message });
            }
        }
        if (!transaction)
            await t.commit();
        return results;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * 3. Updates an existing attendance record
 * Includes audit trail and verification
 */
async function updateAttendanceRecord(sequelize, attendanceId, updates, verifiedBy, transaction) {
    const t = transaction || await sequelize.transaction();
    try {
        const attendance = await Attendance.findByPk(attendanceId, { transaction: t });
        if (!attendance) {
            throw new Error(`Attendance record not found: ${attendanceId}`);
        }
        const updateData = { ...updates };
        if (verifiedBy) {
            updateData.verifiedBy = verifiedBy;
            updateData.verifiedAt = new Date();
        }
        await attendance.update(updateData, { transaction: t });
        if (!transaction)
            await t.commit();
        return attendance;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * 4. Marks a student as tardy with minutes late
 */
async function markStudentTardy(sequelize, studentId, classId, date, minutesLate, recordedBy, notes, transaction) {
    const schoolId = await getSchoolIdFromClass(sequelize, classId, transaction);
    return recordAttendance(sequelize, {
        studentId,
        classId,
        schoolId: schoolId,
        date,
        status: AttendanceStatus.TARDY,
        periodType: PeriodType.FULL_DAY,
        minutesLate,
        notes,
        recordedBy,
        recordedAt: new Date(),
    }, transaction);
}
/**
 * 5. Records early dismissal
 */
async function recordEarlyDismissal(sequelize, studentId, schoolId, date, dismissalTime, reason, recordedBy, transaction) {
    const minutesEarly = calculateMinutesEarly(dismissalTime);
    return recordAttendance(sequelize, {
        studentId,
        schoolId,
        date,
        status: AttendanceStatus.EARLY_DISMISSAL,
        periodType: PeriodType.FULL_DAY,
        minutesAbsent: minutesEarly,
        notes: reason,
        recordedBy,
        recordedAt: new Date(),
    }, transaction);
}
// ============================================================================
// ABSENCE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * 6. Records an excused absence with documentation
 */
async function recordExcusedAbsence(sequelize, studentId, schoolId, date, absenceType, excuseDocumentUrl, notes, recordedBy, transaction) {
    return recordAttendance(sequelize, {
        studentId,
        schoolId,
        date,
        status: AttendanceStatus.EXCUSED,
        periodType: PeriodType.FULL_DAY,
        absenceType,
        excuseDocumentUrl,
        notes,
        recordedBy: recordedBy || studentId,
        recordedAt: new Date(),
    }, transaction);
}
/**
 * 7. Records an unexcused absence
 */
async function recordUnexcusedAbsence(sequelize, studentId, schoolId, date, recordedBy, notes, transaction) {
    return recordAttendance(sequelize, {
        studentId,
        schoolId,
        date,
        status: AttendanceStatus.UNEXCUSED,
        periodType: PeriodType.FULL_DAY,
        absenceType: AbsenceType.UNEXCUSED,
        notes,
        recordedBy,
        recordedAt: new Date(),
    }, transaction);
}
/**
 * 8. Converts unexcused absence to excused with documentation
 */
async function convertToExcusedAbsence(sequelize, attendanceId, absenceType, excuseDocumentUrl, verifiedBy, transaction) {
    return updateAttendanceRecord(sequelize, attendanceId, {
        status: AttendanceStatus.EXCUSED,
        absenceType,
        excuseDocumentUrl,
    }, verifiedBy, transaction);
}
/**
 * 9. Gets all absences for a student in a date range
 * Optimized with eager loading
 */
async function getStudentAbsences(sequelize, studentId, startDate, endDate, includeExcused = true) {
    const whereClause = {
        studentId,
        date: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
        status: includeExcused
            ? { [sequelize_1.Op.in]: [AttendanceStatus.ABSENT, AttendanceStatus.EXCUSED, AttendanceStatus.UNEXCUSED] }
            : { [sequelize_1.Op.in]: [AttendanceStatus.ABSENT, AttendanceStatus.UNEXCUSED] },
    };
    return Attendance.findAll({
        where: whereClause,
        include: [
            {
                association: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber'],
            },
            {
                association: 'class',
                attributes: ['id', 'name', 'code'],
                required: false,
            },
        ],
        order: [['date', 'DESC']],
    });
}
/**
 * 10. Gets consecutive absences for a student
 */
async function getConsecutiveAbsences(sequelize, studentId, asOfDate = new Date()) {
    const absences = await Attendance.findAll({
        where: {
            studentId,
            date: { [sequelize_1.Op.lte]: asOfDate },
            status: { [sequelize_1.Op.in]: [AttendanceStatus.ABSENT, AttendanceStatus.UNEXCUSED] },
        },
        order: [['date', 'DESC']],
        limit: 30, // Look back 30 days max
    });
    if (absences.length === 0) {
        return { count: 0, startDate: asOfDate, absences: [] };
    }
    const consecutiveAbsences = [];
    let previousDate = asOfDate;
    for (const absence of absences) {
        const dayDiff = Math.floor((previousDate.getTime() - absence.date.getTime()) / (1000 * 60 * 60 * 24));
        // Allow for weekends (up to 3 days difference)
        if (dayDiff <= 3) {
            consecutiveAbsences.push(absence);
            previousDate = absence.date;
        }
        else {
            break;
        }
    }
    return {
        count: consecutiveAbsences.length,
        startDate: consecutiveAbsences.length > 0
            ? consecutiveAbsences[consecutiveAbsences.length - 1].date
            : asOfDate,
        absences: consecutiveAbsences,
    };
}
// ============================================================================
// ATTENDANCE REPORTING FUNCTIONS
// ============================================================================
/**
 * 11. Generates comprehensive attendance report
 * Optimized with complex joins and aggregations
 */
async function generateAttendanceReport(sequelize, options) {
    const whereClause = {
        date: {
            [sequelize_1.Op.between]: [options.startDate, options.endDate],
        },
    };
    if (options.schoolId)
        whereClause.schoolId = options.schoolId;
    if (options.classId)
        whereClause.classId = options.classId;
    if (options.studentIds)
        whereClause.studentId = { [sequelize_1.Op.in]: options.studentIds };
    const includeOptions = [
        {
            association: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'gradeLevel'],
            where: options.gradeLevel ? { gradeLevel: options.gradeLevel } : undefined,
        },
        {
            association: 'class',
            attributes: ['id', 'name', 'code'],
            required: false,
        },
        {
            association: 'school',
            attributes: ['id', 'name'],
        },
    ];
    if (options.format === 'summary') {
        // Use raw query for better performance
        const query = `
      SELECT
        s.id as student_id,
        s.first_name,
        s.last_name,
        s.student_number,
        s.grade_level,
        COUNT(*) as total_records,
        COUNT(*) FILTER (WHERE a.status = 'present') as present_count,
        COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')) as absent_count,
        COUNT(*) FILTER (WHERE a.status = 'excused') as excused_count,
        COUNT(*) FILTER (WHERE a.status = 'tardy') as tardy_count,
        ROUND(
          (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) as attendance_rate
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
      WHERE a.date BETWEEN :startDate AND :endDate
        ${options.schoolId ? 'AND a.school_id = :schoolId' : ''}
        ${options.classId ? 'AND a.class_id = :classId' : ''}
        ${options.gradeLevel ? 'AND s.grade_level = :gradeLevel' : ''}
      GROUP BY s.id, s.first_name, s.last_name, s.student_number, s.grade_level
      ORDER BY s.last_name, s.first_name
    `;
        return sequelize.query(query, {
            replacements: {
                startDate: options.startDate,
                endDate: options.endDate,
                schoolId: options.schoolId,
                classId: options.classId,
                gradeLevel: options.gradeLevel,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
    return Attendance.findAll({
        where: whereClause,
        include: includeOptions,
        order: [['date', 'DESC'], ['student.lastName', 'ASC']],
    });
}
/**
 * 12. Gets daily attendance summary for a school
 */
async function getDailyAttendanceSummary(sequelize, schoolId, date) {
    const result = await sequelize.query(`
    SELECT
      COUNT(DISTINCT s.id) as total_students,
      COUNT(*) FILTER (WHERE a.status = 'present') as present,
      COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')) as absent,
      COUNT(*) FILTER (WHERE a.status = 'tardy') as tardy,
      COUNT(*) FILTER (WHERE a.status = 'excused') as excused,
      COUNT(*) FILTER (WHERE a.status = 'unexcused') as unexcused,
      ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(DISTINCT s.id), 0)) * 100,
        2
      ) as attendance_rate
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id AND a.date = :date
    WHERE s.school_id = :schoolId AND s.active = true
    `, {
        replacements: { schoolId, date },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result[0];
}
/**
 * 13. Gets class attendance summary
 */
async function getClassAttendanceSummary(sequelize, classId, startDate, endDate) {
    return sequelize.query(`
    SELECT
      s.id as student_id,
      s.first_name,
      s.last_name,
      s.student_number,
      COUNT(*) as total_days,
      COUNT(*) FILTER (WHERE a.status = 'present') as present_days,
      COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')) as absent_days,
      COUNT(*) FILTER (WHERE a.status = 'tardy') as tardy_count,
      ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate
    FROM attendance a
    INNER JOIN students s ON a.student_id = s.id
    WHERE a.class_id = :classId
      AND a.date BETWEEN :startDate AND :endDate
    GROUP BY s.id, s.first_name, s.last_name, s.student_number
    ORDER BY attendance_rate DESC
    `, {
        replacements: { classId, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 14. Gets attendance trends over time
 */
async function getAttendanceTrends(sequelize, schoolId, startDate, endDate, groupBy = 'week') {
    const dateFormat = {
        day: 'YYYY-MM-DD',
        week: 'YYYY-"W"IW',
        month: 'YYYY-MM',
    }[groupBy];
    return sequelize.query(`
    SELECT
      TO_CHAR(a.date, :dateFormat) as period,
      COUNT(DISTINCT a.student_id) as total_students,
      COUNT(*) FILTER (WHERE a.status = 'present') as present_count,
      COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')) as absent_count,
      COUNT(*) FILTER (WHERE a.status = 'tardy') as tardy_count,
      ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate
    FROM attendance a
    WHERE a.school_id = :schoolId
      AND a.date BETWEEN :startDate AND :endDate
    GROUP BY period
    ORDER BY period
    `, {
        replacements: { schoolId, startDate, endDate, dateFormat },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 15. Gets attendance statistics for a student
 */
async function getStudentAttendanceStatistics(sequelize, studentId, academicYear) {
    const [result] = await sequelize.query(`
    SELECT
      :studentId as student_id,
      :academicYear as academic_year,
      COUNT(*) as total_school_days,
      COUNT(*) FILTER (WHERE a.status = 'present') as days_present,
      COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')) as days_absent,
      COUNT(*) FILTER (WHERE a.status = 'excused') as excused_absences,
      COUNT(*) FILTER (WHERE a.status = 'unexcused') as unexcused_absences,
      COUNT(*) FILTER (WHERE a.status = 'tardy') as tardies,
      COUNT(*) FILTER (WHERE a.status = 'early_dismissal') as early_dismissals,
      ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate,
      MAX(a.date) FILTER (WHERE a.status IN ('absent', 'unexcused')) as last_absence_date
    FROM attendance a
    WHERE a.student_id = :studentId
      AND EXTRACT(YEAR FROM a.date)::text || '-' || (EXTRACT(YEAR FROM a.date) + 1)::text = :academicYear
    `, {
        replacements: { studentId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const stats = result;
    const consecutiveAbsences = await getConsecutiveAbsences(sequelize, studentId);
    return {
        studentId,
        academicYear,
        totalSchoolDays: parseInt(stats.total_school_days) || 0,
        daysPresent: parseInt(stats.days_present) || 0,
        daysAbsent: parseInt(stats.days_absent) || 0,
        excusedAbsences: parseInt(stats.excused_absences) || 0,
        unexcusedAbsences: parseInt(stats.unexcused_absences) || 0,
        tardies: parseInt(stats.tardies) || 0,
        earlyDismissals: parseInt(stats.early_dismissals) || 0,
        attendanceRate: parseFloat(stats.attendance_rate) || 0,
        chronicAbsence: parseFloat(stats.attendance_rate) < 90,
        consecutiveAbsences: consecutiveAbsences.count,
        lastAbsenceDate: stats.last_absence_date,
    };
}
// ============================================================================
// ATTENDANCE ALERTS FUNCTIONS
// ============================================================================
/**
 * 16. Creates an attendance alert
 */
async function createAttendanceAlert(sequelize, alertData, transaction) {
    return AttendanceAlert.create(alertData, { transaction });
}
/**
 * 17. Checks for chronic absenteeism and creates alerts
 */
async function checkChronicAbsenteeism(sequelize, schoolId, academicYear, transaction) {
    // Get policy threshold
    const policy = await AttendancePolicy.findOne({
        where: { schoolId, academicYear },
        transaction,
    });
    const threshold = policy?.chronicAbsenceThreshold || 10.0;
    // Find students below threshold
    const chronicStudents = await sequelize.query(`
    SELECT
      ar.student_id,
      ar.attendance_rate,
      s.first_name,
      s.last_name
    FROM attendance_records ar
    INNER JOIN students s ON ar.student_id = s.id
    WHERE ar.school_id = :schoolId
      AND ar.academic_year = :academicYear
      AND ar.attendance_rate < :threshold
      AND NOT EXISTS (
        SELECT 1 FROM attendance_alerts aa
        WHERE aa.student_id = ar.student_id
          AND aa.alert_type = 'chronic_absence'
          AND aa.triggered_date > NOW() - INTERVAL '30 days'
      )
    `, {
        replacements: { schoolId, academicYear, threshold },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const alerts = [];
    for (const student of chronicStudents) {
        const alert = await createAttendanceAlert(sequelize, {
            studentId: student.student_id,
            alertType: AlertType.CHRONIC_ABSENCE,
            severity: student.attendance_rate < 80 ? 'critical' : 'high',
            message: `Student ${student.first_name} ${student.last_name} has chronic absenteeism with ${student.attendance_rate}% attendance rate`,
            triggeredDate: new Date(),
            resolved: false,
            metadata: {
                attendanceRate: student.attendance_rate,
                threshold,
            },
        }, transaction);
        alerts.push(alert);
    }
    return alerts;
}
/**
 * 18. Checks for consecutive absences and creates alerts
 */
async function checkConsecutiveAbsences(sequelize, studentId, threshold = 3, transaction) {
    const { count, absences } = await getConsecutiveAbsences(sequelize, studentId);
    if (count >= threshold) {
        // Check if alert already exists
        const existingAlert = await AttendanceAlert.findOne({
            where: {
                studentId,
                alertType: AlertType.CONSECUTIVE_ABSENCE,
                resolved: false,
                triggeredDate: {
                    [sequelize_1.Op.gte]: sequelize.literal("NOW() - INTERVAL '7 days'"),
                },
            },
            transaction,
        });
        if (existingAlert) {
            return null; // Alert already exists
        }
        return createAttendanceAlert(sequelize, {
            studentId,
            alertType: AlertType.CONSECUTIVE_ABSENCE,
            severity: count >= 5 ? 'critical' : count >= 4 ? 'high' : 'medium',
            message: `Student has ${count} consecutive absences`,
            triggeredDate: new Date(),
            resolved: false,
            metadata: {
                consecutiveAbsences: count,
                absenceIds: absences.map(a => a.id),
            },
        }, transaction);
    }
    return null;
}
/**
 * 19. Gets unresolved alerts for a student
 */
async function getUnresolvedAlertsForStudent(sequelize, studentId) {
    return AttendanceAlert.findAll({
        where: {
            studentId,
            resolved: false,
        },
        include: [
            {
                association: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber'],
            },
        ],
        order: [
            ['severity', 'DESC'],
            ['triggeredDate', 'DESC'],
        ],
    });
}
/**
 * 20. Acknowledges an attendance alert
 */
async function acknowledgeAlert(sequelize, alertId, acknowledgedBy, actionTaken, transaction) {
    const alert = await AttendanceAlert.findByPk(alertId, { transaction });
    if (!alert) {
        throw new Error(`Alert not found: ${alertId}`);
    }
    await alert.update({
        acknowledgedBy,
        acknowledgedAt: new Date(),
        actionTaken: actionTaken || 'Alert acknowledged',
    }, { transaction });
    return alert;
}
/**
 * 21. Resolves an attendance alert
 */
async function resolveAlert(sequelize, alertId, resolvedBy, resolutionNotes, transaction) {
    const alert = await AttendanceAlert.findByPk(alertId, { transaction });
    if (!alert) {
        throw new Error(`Alert not found: ${alertId}`);
    }
    await alert.update({
        resolved: true,
        resolvedAt: new Date(),
        actionTaken: resolutionNotes,
        acknowledgedBy: alert.acknowledgedBy || resolvedBy,
        acknowledgedAt: alert.acknowledgedAt || new Date(),
    }, { transaction });
    return alert;
}
// ============================================================================
// ATTENDANCE ANALYTICS FUNCTIONS
// ============================================================================
/**
 * 22. Analyzes attendance patterns for a student
 */
async function analyzeAttendancePatterns(sequelize, studentId, academicYear) {
    const absences = await Attendance.findAll({
        where: {
            studentId,
            status: { [sequelize_1.Op.in]: [AttendanceStatus.ABSENT, AttendanceStatus.UNEXCUSED] },
        },
        order: [['date', 'ASC']],
    });
    // Analyze day-of-week patterns
    const dayOfWeekCounts = new Map();
    absences.forEach(a => {
        const day = a.date.getDay();
        dayOfWeekCounts.set(day, (dayOfWeekCounts.get(day) || 0) + 1);
    });
    const mostFrequentDay = Array.from(dayOfWeekCounts.entries())
        .sort((a, b) => b[1] - a[1])[0];
    const detectedPatterns = [];
    if (mostFrequentDay && mostFrequentDay[1] >= 3) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        detectedPatterns.push(`Frequent absences on ${dayNames[mostFrequentDay[0]]}s (${mostFrequentDay[1]} times)`);
    }
    // Check for biweekly patterns
    const biweeklyPattern = detectBiweeklyPattern(absences);
    if (biweeklyPattern) {
        detectedPatterns.push('Possible biweekly absence pattern detected');
    }
    const patternType = detectPatternType(absences);
    const confidence = calculatePatternConfidence(absences, detectedPatterns);
    return {
        studentId,
        patternType,
        description: detectedPatterns.join('; '),
        confidence,
        detectedPatterns,
        suggestions: generatePatternSuggestions(detectedPatterns),
    };
}
/**
 * 23. Gets students at risk of truancy
 */
async function getStudentsAtRiskOfTruancy(sequelize, schoolId, academicYear, threshold = 5) {
    return sequelize.query(`
    SELECT
      s.id,
      s.first_name,
      s.last_name,
      s.student_number,
      s.grade_level,
      ar.unexcused_absences,
      ar.attendance_rate,
      (
        SELECT COUNT(*)
        FROM attendance a
        WHERE a.student_id = s.id
          AND a.status = 'unexcused'
          AND a.date > NOW() - INTERVAL '30 days'
      ) as recent_unexcused_absences
    FROM students s
    INNER JOIN attendance_records ar ON s.id = ar.student_id
    WHERE s.school_id = :schoolId
      AND ar.academic_year = :academicYear
      AND ar.unexcused_absences >= :threshold
    ORDER BY ar.unexcused_absences DESC, ar.attendance_rate ASC
    `, {
        replacements: { schoolId, academicYear, threshold },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 24. Calculates attendance rate for multiple students
 * Optimized batch calculation
 */
async function calculateBatchAttendanceRates(sequelize, studentIds, startDate, endDate) {
    const results = await sequelize.query(`
    SELECT
      student_id,
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate
    FROM attendance
    WHERE student_id = ANY(:studentIds)
      AND date BETWEEN :startDate AND :endDate
    GROUP BY student_id
    `, {
        replacements: { studentIds, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return new Map(results.map(r => [r.student_id, parseFloat(r.attendance_rate)]));
}
/**
 * 25. Gets attendance comparison by grade level
 */
async function getAttendanceByGradeLevel(sequelize, schoolId, academicYear) {
    return sequelize.query(`
    SELECT
      s.grade_level,
      COUNT(DISTINCT s.id) as total_students,
      ROUND(AVG(ar.attendance_rate), 2) as avg_attendance_rate,
      SUM(ar.absent_days) as total_absences,
      SUM(ar.unexcused_absences) as total_unexcused
    FROM students s
    INNER JOIN attendance_records ar ON s.id = ar.student_id
    WHERE s.school_id = :schoolId
      AND ar.academic_year = :academicYear
    GROUP BY s.grade_level
    ORDER BY s.grade_level
    `, {
        replacements: { schoolId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
// ============================================================================
// MAKEUP CLASS TRACKING FUNCTIONS
// ============================================================================
/**
 * 26. Schedules a makeup class
 */
async function scheduleMakeupClass(sequelize, makeupData, transaction) {
    return MakeupClass.create(makeupData, { transaction });
}
/**
 * 27. Gets scheduled makeup classes for a student
 */
async function getStudentMakeupClasses(sequelize, studentId, status) {
    const whereClause = { studentId };
    if (status)
        whereClause.status = status;
    return MakeupClass.findAll({
        where: whereClause,
        include: [
            {
                association: 'originalAbsence',
                attributes: ['id', 'date', 'status', 'absenceType'],
            },
            {
                association: 'class',
                attributes: ['id', 'name', 'code'],
            },
            {
                association: 'teacher',
                attributes: ['id', 'firstName', 'lastName'],
            },
        ],
        order: [['scheduledDate', 'ASC']],
    });
}
/**
 * 28. Completes a makeup class
 */
async function completeMakeupClass(sequelize, makeupClassId, completedDate, notes, transaction) {
    const makeupClass = await MakeupClass.findByPk(makeupClassId, { transaction });
    if (!makeupClass) {
        throw new Error(`Makeup class not found: ${makeupClassId}`);
    }
    await makeupClass.update({
        status: 'completed',
        completedDate,
        notes,
    }, { transaction });
    return makeupClass;
}
/**
 * 29. Cancels a makeup class
 */
async function cancelMakeupClass(sequelize, makeupClassId, reason, transaction) {
    const makeupClass = await MakeupClass.findByPk(makeupClassId, { transaction });
    if (!makeupClass) {
        throw new Error(`Makeup class not found: ${makeupClassId}`);
    }
    await makeupClass.update({
        status: 'cancelled',
        notes: reason,
    }, { transaction });
    return makeupClass;
}
/**
 * 30. Gets makeup class statistics for a student
 */
async function getMakeupClassStatistics(sequelize, studentId, academicYear) {
    const [result] = await sequelize.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
      COUNT(*) FILTER (WHERE status = 'no_show') as no_show,
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'completed')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE status IN ('scheduled', 'completed', 'no_show')), 0)) * 100,
        2
      ) as completion_rate
    FROM makeup_classes mc
    INNER JOIN attendance a ON mc.original_absence_id = a.id
    WHERE mc.student_id = :studentId
      AND EXTRACT(YEAR FROM a.date)::text || '-' || (EXTRACT(YEAR FROM a.date) + 1)::text = :academicYear
    `, {
        replacements: { studentId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const stats = result;
    return {
        scheduled: parseInt(stats.scheduled) || 0,
        completed: parseInt(stats.completed) || 0,
        cancelled: parseInt(stats.cancelled) || 0,
        noShow: parseInt(stats.no_show) || 0,
        completionRate: parseFloat(stats.completion_rate) || 0,
    };
}
// ============================================================================
// ATTENDANCE COMPLIANCE FUNCTIONS
// ============================================================================
/**
 * 31. Creates or updates attendance policy
 */
async function createAttendancePolicy(sequelize, policyData, transaction) {
    return AttendancePolicy.create(policyData, { transaction });
}
/**
 * 32. Gets active attendance policy for a school
 */
async function getActiveAttendancePolicy(sequelize, schoolId, academicYear, asOfDate = new Date()) {
    return AttendancePolicy.findOne({
        where: {
            schoolId,
            academicYear,
            effectiveDate: { [sequelize_1.Op.lte]: asOfDate },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: asOfDate } },
            ],
        },
        order: [['effectiveDate', 'DESC']],
    });
}
/**
 * 33. Validates attendance against policy
 */
async function validateAttendanceAgainstPolicy(sequelize, studentId, schoolId, academicYear) {
    const policy = await getActiveAttendancePolicy(sequelize, schoolId, academicYear);
    if (!policy) {
        return {
            compliant: true,
            violations: [],
            warnings: ['No active attendance policy found'],
        };
    }
    const stats = await getStudentAttendanceStatistics(sequelize, studentId, academicYear);
    const violations = [];
    const warnings = [];
    if (stats.unexcusedAbsences > policy.maxUnexcusedAbsences) {
        violations.push(`Exceeded maximum unexcused absences: ${stats.unexcusedAbsences} > ${policy.maxUnexcusedAbsences}`);
    }
    if (stats.excusedAbsences > policy.maxExcusedAbsences) {
        warnings.push(`Exceeded maximum excused absences: ${stats.excusedAbsences} > ${policy.maxExcusedAbsences}`);
    }
    if (stats.attendanceRate < (100 - policy.chronicAbsenceThreshold)) {
        violations.push(`Chronic absenteeism: ${stats.attendanceRate}% < ${100 - policy.chronicAbsenceThreshold}%`);
    }
    if (stats.tardies >= policy.tardyThreshold) {
        warnings.push(`Exceeded tardy threshold: ${stats.tardies} >= ${policy.tardyThreshold}`);
    }
    if (stats.unexcusedAbsences >= policy.truancyReferralThreshold) {
        violations.push(`Truancy referral required: ${stats.unexcusedAbsences} >= ${policy.truancyReferralThreshold}`);
    }
    return {
        compliant: violations.length === 0,
        violations,
        warnings,
    };
}
/**
 * 34. Generates state compliance report
 */
async function generateStateComplianceReport(sequelize, schoolId, academicYear) {
    const totalStudents = await sequelize.query(`SELECT COUNT(*) as count FROM students WHERE school_id = :schoolId AND active = true`, {
        replacements: { schoolId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const chronicAbsenteeism = await sequelize.query(`
    SELECT COUNT(*) as count
    FROM attendance_records
    WHERE school_id = :schoolId
      AND academic_year = :academicYear
      AND attendance_rate < 90
    `, {
        replacements: { schoolId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const truancyReferrals = await sequelize.query(`
    SELECT COUNT(*) as count
    FROM attendance_records
    WHERE school_id = :schoolId
      AND academic_year = :academicYear
      AND unexcused_absences >= 5
    `, {
        replacements: { schoolId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const avgAttendanceRate = await sequelize.query(`
    SELECT ROUND(AVG(attendance_rate), 2) as avg_rate
    FROM attendance_records
    WHERE school_id = :schoolId
      AND academic_year = :academicYear
    `, {
        replacements: { schoolId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        schoolId,
        academicYear,
        totalStudents: totalStudents[0].count,
        chronicAbsenteeismCount: chronicAbsenteeism[0].count,
        truancyReferralsCount: truancyReferrals[0].count,
        averageAttendanceRate: avgAttendanceRate[0].avg_rate,
        generatedAt: new Date(),
    };
}
/**
 * 35. Updates attendance record summary (batch job)
 */
async function updateAttendanceRecordSummaries(sequelize, schoolId, academicYear, transaction) {
    const t = transaction || await sequelize.transaction();
    try {
        const result = await sequelize.query(`
      INSERT INTO attendance_records (
        id, student_id, school_id, academic_year,
        total_days, present_days, absent_days,
        excused_absences, unexcused_absences,
        tardies, early_dismissals, attendance_rate,
        last_updated, created_at, updated_at
      )
      SELECT
        gen_random_uuid(),
        a.student_id,
        a.school_id,
        :academicYear,
        COUNT(*),
        COUNT(*) FILTER (WHERE a.status = 'present'),
        COUNT(*) FILTER (WHERE a.status IN ('absent', 'unexcused')),
        COUNT(*) FILTER (WHERE a.status = 'excused'),
        COUNT(*) FILTER (WHERE a.status = 'unexcused'),
        COUNT(*) FILTER (WHERE a.status = 'tardy'),
        COUNT(*) FILTER (WHERE a.status = 'early_dismissal'),
        ROUND(
          (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ),
        NOW(),
        NOW(),
        NOW()
      FROM attendance a
      WHERE a.school_id = :schoolId
        AND EXTRACT(YEAR FROM a.date)::text || '-' || (EXTRACT(YEAR FROM a.date) + 1)::text = :academicYear
      GROUP BY a.student_id, a.school_id
      ON CONFLICT (student_id, academic_year)
      DO UPDATE SET
        total_days = EXCLUDED.total_days,
        present_days = EXCLUDED.present_days,
        absent_days = EXCLUDED.absent_days,
        excused_absences = EXCLUDED.excused_absences,
        unexcused_absences = EXCLUDED.unexcused_absences,
        tardies = EXCLUDED.tardies,
        early_dismissals = EXCLUDED.early_dismissals,
        attendance_rate = EXCLUDED.attendance_rate,
        last_updated = NOW(),
        updated_at = NOW()
      `, {
            replacements: { schoolId, academicYear },
            type: sequelize_1.QueryTypes.INSERT,
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return result[1] || 0;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
// ============================================================================
// ADVANCED QUERY OPTIMIZATION FUNCTIONS
// ============================================================================
/**
 * 36. Gets attendance with optimized eager loading
 * Prevents N+1 queries
 */
async function getAttendanceWithRelations(sequelize, whereClause, limit = 100, offset = 0) {
    return Attendance.findAndCountAll({
        where: whereClause,
        include: [
            {
                association: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'gradeLevel'],
                include: [
                    {
                        association: 'contacts',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                        where: { isPrimary: true },
                        required: false,
                    },
                ],
            },
            {
                association: 'class',
                attributes: ['id', 'name', 'code'],
                include: [
                    {
                        association: 'teacher',
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
                required: false,
            },
            {
                association: 'school',
                attributes: ['id', 'name'],
            },
            {
                association: 'recordedByUser',
                attributes: ['id', 'firstName', 'lastName', 'role'],
            },
        ],
        limit,
        offset,
        order: [['date', 'DESC'], ['recordedAt', 'DESC']],
        subQuery: false, // Prevent subquery for better performance
    });
}
/**
 * 37. Bulk fetches attendance for multiple students
 * Optimized with single query
 */
async function bulkFetchStudentAttendance(sequelize, studentIds, startDate, endDate) {
    const attendance = await Attendance.findAll({
        where: {
            studentId: { [sequelize_1.Op.in]: studentIds },
            date: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        include: [
            {
                association: 'class',
                attributes: ['id', 'name', 'code'],
                required: false,
            },
        ],
        order: [['date', 'DESC']],
    });
    // Group by student ID
    const attendanceMap = new Map();
    for (const record of attendance) {
        const existing = attendanceMap.get(record.studentId) || [];
        existing.push(record);
        attendanceMap.set(record.studentId, existing);
    }
    return attendanceMap;
}
/**
 * 38. Gets attendance with complex filtering and aggregation
 */
async function getAttendanceWithAdvancedFilters(sequelize, filters) {
    let query = `
    SELECT
      a.id,
      a.student_id,
      s.first_name,
      s.last_name,
      s.student_number,
      s.grade_level,
      a.date,
      a.status,
      a.period_type,
      c.name as class_name,
      sc.name as school_name,
      ar.attendance_rate,
      ar.absent_days
    FROM attendance a
    INNER JOIN students s ON a.student_id = s.id
    LEFT JOIN classes c ON a.class_id = c.id
    INNER JOIN schools sc ON a.school_id = sc.id
    LEFT JOIN attendance_records ar ON s.id = ar.student_id
    WHERE a.date BETWEEN :startDate AND :endDate
  `;
    const replacements = {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
    };
    if (filters.schoolIds && filters.schoolIds.length > 0) {
        query += ' AND a.school_id = ANY(:schoolIds)';
        replacements.schoolIds = filters.schoolIds;
    }
    if (filters.gradeLevel) {
        query += ' AND s.grade_level = :gradeLevel';
        replacements.gradeLevel = filters.gradeLevel;
    }
    if (filters.status && filters.status.length > 0) {
        query += ' AND a.status = ANY(:statuses)';
        replacements.statuses = filters.status;
    }
    if (filters.minAttendanceRate !== undefined) {
        query += ' AND ar.attendance_rate >= :minAttendanceRate';
        replacements.minAttendanceRate = filters.minAttendanceRate;
    }
    if (filters.maxAbsences !== undefined) {
        query += ' AND ar.absent_days <= :maxAbsences';
        replacements.maxAbsences = filters.maxAbsences;
    }
    query += ' ORDER BY a.date DESC, s.last_name, s.first_name';
    return sequelize.query(query, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 39. Gets attendance leaderboard (highest attendance rates)
 */
async function getAttendanceLeaderboard(sequelize, schoolId, academicYear, limit = 20) {
    return sequelize.query(`
    SELECT
      s.id,
      s.first_name,
      s.last_name,
      s.student_number,
      s.grade_level,
      ar.attendance_rate,
      ar.present_days,
      ar.total_days,
      ar.tardies,
      RANK() OVER (ORDER BY ar.attendance_rate DESC, ar.tardies ASC) as rank
    FROM attendance_records ar
    INNER JOIN students s ON ar.student_id = s.id
    WHERE ar.school_id = :schoolId
      AND ar.academic_year = :academicYear
      AND ar.total_days >= 10
    ORDER BY rank
    LIMIT :limit
    `, {
        replacements: { schoolId, academicYear, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 40. Gets attendance outliers (students with unusual patterns)
 */
async function getAttendanceOutliers(sequelize, schoolId, academicYear) {
    return sequelize.query(`
    WITH stats AS (
      SELECT
        AVG(attendance_rate) as avg_rate,
        STDDEV(attendance_rate) as stddev_rate
      FROM attendance_records
      WHERE school_id = :schoolId
        AND academic_year = :academicYear
    )
    SELECT
      s.id,
      s.first_name,
      s.last_name,
      s.student_number,
      s.grade_level,
      ar.attendance_rate,
      ar.absent_days,
      ar.unexcused_absences,
      stats.avg_rate,
      ABS(ar.attendance_rate - stats.avg_rate) / NULLIF(stats.stddev_rate, 0) as z_score
    FROM attendance_records ar
    INNER JOIN students s ON ar.student_id = s.id
    CROSS JOIN stats
    WHERE ar.school_id = :schoolId
      AND ar.academic_year = :academicYear
      AND ABS(ar.attendance_rate - stats.avg_rate) / NULLIF(stats.stddev_rate, 0) > 2
    ORDER BY z_score DESC
    `, {
        replacements: { schoolId, academicYear },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 41. Searches attendance records with full-text search
 */
async function searchAttendanceRecords(sequelize, searchTerm, schoolId, limit = 50) {
    return Attendance.findAll({
        where: {
            schoolId,
            [sequelize_1.Op.or]: [
                { notes: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
                (0, sequelize_1.literal)(`
          EXISTS (
            SELECT 1 FROM students s
            WHERE s.id = "Attendance"."student_id"
              AND (
                s.first_name ILIKE :searchTerm
                OR s.last_name ILIKE :searchTerm
                OR s.student_number ILIKE :searchTerm
              )
          )
        `),
            ],
        },
        replacements: { searchTerm: `%${searchTerm}%` },
        include: [
            {
                association: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber'],
            },
        ],
        limit,
        order: [['date', 'DESC']],
    });
}
/**
 * 42. Gets attendance heatmap data (by day and period)
 */
async function getAttendanceHeatmap(sequelize, schoolId, startDate, endDate) {
    return sequelize.query(`
    SELECT
      date,
      period_type,
      COUNT(*) as total_records,
      COUNT(*) FILTER (WHERE status = 'present') as present_count,
      COUNT(*) FILTER (WHERE status = 'absent') as absent_count,
      COUNT(*) FILTER (WHERE status = 'tardy') as tardy_count,
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate
    FROM attendance
    WHERE school_id = :schoolId
      AND date BETWEEN :startDate AND :endDate
    GROUP BY date, period_type
    ORDER BY date, period_type
    `, {
        replacements: { schoolId, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 43. Exports attendance data for external reporting
 */
async function exportAttendanceData(sequelize, options) {
    return sequelize.query(`
    SELECT
      a.date,
      s.student_number,
      s.first_name,
      s.last_name,
      s.grade_level,
      a.status,
      a.period_type,
      a.absence_type,
      a.minutes_late,
      a.minutes_absent,
      a.notes,
      c.name as class_name,
      c.code as class_code,
      sc.name as school_name,
      u.first_name || ' ' || u.last_name as recorded_by,
      a.recorded_at,
      v.first_name || ' ' || v.last_name as verified_by,
      a.verified_at
    FROM attendance a
    INNER JOIN students s ON a.student_id = s.id
    LEFT JOIN classes c ON a.class_id = c.id
    INNER JOIN schools sc ON a.school_id = sc.id
    INNER JOIN users u ON a.recorded_by = u.id
    LEFT JOIN users v ON a.verified_by = v.id
    WHERE a.date BETWEEN :startDate AND :endDate
      ${options.schoolId ? 'AND a.school_id = :schoolId' : ''}
      ${options.classId ? 'AND a.class_id = :classId' : ''}
      ${options.gradeLevel ? 'AND s.grade_level = :gradeLevel' : ''}
    ORDER BY a.date DESC, s.last_name, s.first_name
    `, {
        replacements: {
            startDate: options.startDate,
            endDate: options.endDate,
            schoolId: options.schoolId,
            classId: options.classId,
            gradeLevel: options.gradeLevel,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 44. Gets period-based attendance summary
 */
async function getPeriodBasedAttendanceSummary(sequelize, classId, date) {
    return sequelize.query(`
    SELECT
      a.period_type,
      COUNT(DISTINCT a.student_id) as total_students,
      COUNT(*) FILTER (WHERE a.status = 'present') as present,
      COUNT(*) FILTER (WHERE a.status = 'absent') as absent,
      COUNT(*) FILTER (WHERE a.status = 'tardy') as tardy,
      COUNT(*) FILTER (WHERE a.status = 'excused') as excused,
      ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as attendance_rate
    FROM attendance a
    WHERE a.class_id = :classId
      AND a.date = :date
    GROUP BY a.period_type
    ORDER BY a.period_type
    `, {
        replacements: { classId, date },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
/**
 * 45. Archives old attendance records (data retention)
 */
async function archiveOldAttendanceRecords(sequelize, olderThanYears = 7, transaction) {
    const t = transaction || await sequelize.transaction();
    try {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - olderThanYears);
        // Archive to separate table (if exists)
        const archived = await sequelize.query(`
      INSERT INTO attendance_archive
      SELECT * FROM attendance
      WHERE date < :cutoffDate
        AND deleted_at IS NULL
      ON CONFLICT DO NOTHING
      `, {
            replacements: { cutoffDate },
            type: sequelize_1.QueryTypes.INSERT,
            transaction: t,
        });
        // Soft delete archived records
        const deleted = await Attendance.destroy({
            where: {
                date: { [sequelize_1.Op.lt]: cutoffDate },
            },
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return {
            archived: archived[1] || 0,
            deleted,
        };
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Gets school ID from class ID
 */
async function getSchoolIdFromClass(sequelize, classId, transaction) {
    const result = await sequelize.query('SELECT school_id FROM classes WHERE id = :classId', {
        replacements: { classId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return result.length > 0 ? result[0].school_id : null;
}
/**
 * Helper: Calculates minutes early for dismissal
 */
function calculateMinutesEarly(dismissalTime) {
    const standardDismissal = new Date(dismissalTime);
    standardDismissal.setHours(15, 30, 0, 0); // 3:30 PM
    const diff = standardDismissal.getTime() - dismissalTime.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60)));
}
/**
 * Helper: Detects biweekly absence pattern
 */
function detectBiweeklyPattern(absences) {
    if (absences.length < 4)
        return false;
    const dates = absences.map(a => a.date.getTime());
    let biweeklyCount = 0;
    for (let i = 1; i < dates.length; i++) {
        const daysDiff = Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 12 && daysDiff <= 16) {
            biweeklyCount++;
        }
    }
    return biweeklyCount >= 3;
}
/**
 * Helper: Detects overall pattern type
 */
function detectPatternType(absences) {
    if (absences.length < 3)
        return 'random';
    const dates = absences.map(a => a.date.getTime());
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
        intervals.push(Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24)));
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avgInterval >= 5 && avgInterval <= 9)
        return 'weekly';
    if (avgInterval >= 12 && avgInterval <= 16)
        return 'biweekly';
    if (avgInterval >= 25 && avgInterval <= 35)
        return 'monthly';
    return 'random';
}
/**
 * Helper: Calculates pattern confidence
 */
function calculatePatternConfidence(absences, patterns) {
    if (absences.length < 3)
        return 0;
    if (patterns.length === 0)
        return 0.2;
    const baseConfidence = Math.min(absences.length / 10, 0.5);
    const patternBonus = patterns.length * 0.2;
    return Math.min(baseConfidence + patternBonus, 1.0);
}
/**
 * Helper: Generates pattern-based suggestions
 */
function generatePatternSuggestions(patterns) {
    const suggestions = [];
    if (patterns.some(p => p.includes('Monday'))) {
        suggestions.push('Consider checking for weekend-related issues or anxieties');
    }
    if (patterns.some(p => p.includes('Friday'))) {
        suggestions.push('Monitor for early weekend departures or family travel patterns');
    }
    if (patterns.some(p => p.includes('biweekly'))) {
        suggestions.push('May correlate with custody arrangements or recurring appointments');
    }
    if (suggestions.length === 0) {
        suggestions.push('Continue monitoring for emerging patterns');
    }
    return suggestions;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Attendance,
    AttendanceRecord,
    AttendancePolicy,
    AttendanceAlert,
    MakeupClass,
    // Model initializers
    initAttendanceModel,
    initAttendanceRecordModel,
    initAttendancePolicyModel,
    initAttendanceAlertModel,
    initMakeupClassModel,
    // Recording functions (1-5)
    recordAttendance,
    recordBulkAttendance,
    updateAttendanceRecord,
    markStudentTardy,
    recordEarlyDismissal,
    // Absence management (6-10)
    recordExcusedAbsence,
    recordUnexcusedAbsence,
    convertToExcusedAbsence,
    getStudentAbsences,
    getConsecutiveAbsences,
    // Reporting (11-15)
    generateAttendanceReport,
    getDailyAttendanceSummary,
    getClassAttendanceSummary,
    getAttendanceTrends,
    getStudentAttendanceStatistics,
    // Alerts (16-21)
    createAttendanceAlert,
    checkChronicAbsenteeism,
    checkConsecutiveAbsences,
    getUnresolvedAlertsForStudent,
    acknowledgeAlert,
    resolveAlert,
    // Analytics (22-25)
    analyzeAttendancePatterns,
    getStudentsAtRiskOfTruancy,
    calculateBatchAttendanceRates,
    getAttendanceByGradeLevel,
    // Makeup classes (26-30)
    scheduleMakeupClass,
    getStudentMakeupClasses,
    completeMakeupClass,
    cancelMakeupClass,
    getMakeupClassStatistics,
    // Compliance (31-35)
    createAttendancePolicy,
    getActiveAttendancePolicy,
    validateAttendanceAgainstPolicy,
    generateStateComplianceReport,
    updateAttendanceRecordSummaries,
    // Advanced queries (36-45)
    getAttendanceWithRelations,
    bulkFetchStudentAttendance,
    getAttendanceWithAdvancedFilters,
    getAttendanceLeaderboard,
    getAttendanceOutliers,
    searchAttendanceRecords,
    getAttendanceHeatmap,
    exportAttendanceData,
    getPeriodBasedAttendanceSummary,
    archiveOldAttendanceRecords,
};
//# sourceMappingURL=attendance-tracking-kit.js.map