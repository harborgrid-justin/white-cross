/**
 * LOC: EDU-COMP-ATTENDANCE-001
 * File: /reuse/education/composites/attendance-engagement-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../attendance-tracking-kit
 *   - ../student-communication-kit
 *   - ../student-analytics-kit
 *   - ../compliance-reporting-kit
 *   - ../grading-assessment-kit
 *
 * DOWNSTREAM (imported by):
 *   - Attendance management controllers
 *   - Student engagement services
 *   - Early intervention systems
 *   - Academic success modules
 *   - Compliance reporting services
 */
import { Sequelize } from 'sequelize';
import { AttendanceStatus, AbsenceType, AttendanceRecordData, AttendanceStatistics, AttendanceReportOptions, BulkAttendanceData, AttendancePattern } from '../attendance-tracking-kit';
/**
 * Engagement level classification
 */
export type EngagementLevel = 'highly_engaged' | 'engaged' | 'at_risk' | 'disengaged';
/**
 * Intervention type
 */
export type InterventionType = 'counseling' | 'tutoring' | 'mentoring' | 'academic_support' | 'parent_meeting';
/**
 * Intervention status
 */
export type InterventionStatus = 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
/**
 * Alert priority
 */
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
/**
 * Student engagement metrics
 */
export interface EngagementMetricsData {
    studentId: string;
    academicYear: string;
    term: string;
    attendanceRate: number;
    participationScore: number;
    assignmentCompletionRate: number;
    classParticipation: number;
    lmsEngagement: number;
    overallEngagementScore: number;
    engagementLevel: EngagementLevel;
    calculatedAt: Date;
}
/**
 * Early warning indicator
 */
export interface EarlyWarningData {
    studentId: string;
    warningType: 'attendance' | 'grades' | 'behavior' | 'engagement' | 'multiple';
    severity: AlertPriority;
    indicators: Array<{
        indicator: string;
        value: any;
        threshold: any;
        status: 'warning' | 'critical';
    }>;
    recommendedActions: string[];
    assignedTo?: string;
    acknowledgedAt?: Date;
    status: 'active' | 'acknowledged' | 'resolved';
}
/**
 * Intervention plan
 */
export interface InterventionPlanData {
    studentId: string;
    planType: InterventionType;
    createdBy: string;
    createdDate: Date;
    targetOutcomes: string[];
    strategies: string[];
    timeline: {
        startDate: Date;
        endDate: Date;
        milestones?: Array<{
            date: Date;
            description: string;
            completed: boolean;
        }>;
    };
    participants: Array<{
        role: 'student' | 'teacher' | 'counselor' | 'parent' | 'administrator';
        userId: string;
        name: string;
    }>;
    status: InterventionStatus;
    progressNotes?: string[];
    outcomeAssessment?: string;
}
/**
 * Attendance notification
 */
export interface AttendanceNotificationData {
    studentId: string;
    notificationType: 'absence' | 'tardy' | 'pattern' | 'chronic' | 'improved';
    recipients: Array<{
        recipientType: 'parent' | 'guardian' | 'counselor' | 'teacher';
        recipientId: string;
        preferredChannel: 'email' | 'sms' | 'phone' | 'app';
    }>;
    message: string;
    sentDate: Date;
    deliveryStatus: 'sent' | 'delivered' | 'read' | 'failed';
}
/**
 * Absence excuse documentation
 */
export interface AbsenceExcuseData {
    attendanceRecordId: string;
    studentId: string;
    excuseType: AbsenceType;
    submittedBy: string;
    submittedDate: Date;
    documentationUrl?: string;
    verifiedBy?: string;
    verifiedDate?: Date;
    status: 'pending' | 'approved' | 'denied';
    notes?: string;
}
/**
 * Engagement activity tracking
 */
export interface EngagementActivityData {
    studentId: string;
    activityType: 'class_participation' | 'discussion_post' | 'office_hours' | 'study_group' | 'event_attendance';
    courseId?: string;
    activityDate: Date;
    duration?: number;
    qualityScore?: number;
    notes?: string;
    recordedBy: string;
}
/**
 * Attendance appeal
 */
export interface AttendanceAppealData {
    attendanceRecordId: string;
    studentId: string;
    appealReason: string;
    supportingDocuments?: string[];
    submittedDate: Date;
    reviewedBy?: string;
    reviewDate?: Date;
    decision?: 'approved' | 'denied' | 'pending_info';
    decisionNotes?: string;
    status: 'submitted' | 'under_review' | 'resolved';
}
/**
 * Success coach assignment
 */
export interface SuccessCoachData {
    studentId: string;
    coachId: string;
    assignmentDate: Date;
    meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
    focusAreas: string[];
    goals: Array<{
        goal: string;
        targetDate: Date;
        achieved: boolean;
    }>;
    status: 'active' | 'completed' | 'transferred';
}
/**
 * Predictive engagement model
 */
export interface PredictiveEngagementData {
    studentId: string;
    predictionDate: Date;
    riskScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    contributingFactors: Array<{
        factor: string;
        weight: number;
        value: any;
    }>;
    recommendedInterventions: string[];
    confidence: number;
}
/**
 * Sequelize model for Engagement Metrics with scoring algorithms.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     EngagementMetrics:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         overallEngagementScore:
 *           type: number
 *         engagementLevel:
 *           type: string
 *           enum: [highly_engaged, engaged, at_risk, disengaged]
 */
export declare const createEngagementMetricsModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        academicYear: string;
        term: string;
        attendanceRate: number;
        participationScore: number;
        assignmentCompletionRate: number;
        classParticipation: number;
        lmsEngagement: number;
        overallEngagementScore: number;
        engagementLevel: EngagementLevel;
        calculatedAt: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Intervention Plans with tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     InterventionPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         planType:
 *           type: string
 *         status:
 *           type: string
 */
export declare const createInterventionPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        planType: InterventionType;
        createdBy: string;
        createdDate: Date;
        targetOutcomes: string[];
        strategies: string[];
        timeline: any;
        participants: any[];
        status: InterventionStatus;
        progressNotes: string[];
        outcomeAssessment: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Attendance & Engagement Composite Service
 *
 * Provides comprehensive attendance tracking, engagement monitoring, early warning systems,
 * and intervention management for educational institutions.
 */
export declare class AttendanceEngagementCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Records daily attendance for student.
     *
     * @param {AttendanceRecordData} recordData - Attendance record data
     * @returns {Promise<any>} Created attendance record
     *
     * @example
     * ```typescript
     * const record = await service.recordDailyAttendance({
     *   studentId: 'stu-123',
     *   classId: 'class-cs101',
     *   schoolId: 'school-001',
     *   date: new Date(),
     *   status: AttendanceStatus.PRESENT,
     *   periodType: PeriodType.FULL_DAY,
     *   recordedBy: 'teacher-456',
     *   recordedAt: new Date()
     * });
     * ```
     */
    recordDailyAttendance(recordData: AttendanceRecordData): Promise<any>;
    /**
     * 2. Records bulk attendance for entire class.
     *
     * @param {BulkAttendanceData} bulkData - Bulk attendance data
     * @returns {Promise<any>} Bulk record result
     *
     * @example
     * ```typescript
     * const result = await service.recordBulkAttendance({
     *   classId: 'class-cs101',
     *   date: new Date(),
     *   periodType: PeriodType.PERIOD_1,
     *   recordedBy: 'teacher-456',
     *   records: [
     *     { studentId: 'stu-123', status: AttendanceStatus.PRESENT },
     *     { studentId: 'stu-456', status: AttendanceStatus.ABSENT, absenceType: AbsenceType.ILLNESS }
     *   ]
     * });
     * console.log(`Recorded ${result.count} attendance records`);
     * ```
     */
    recordBulkAttendance(bulkData: BulkAttendanceData): Promise<any>;
    /**
     * 3. Records student tardiness with minutes late.
     *
     * @param {string} studentId - Student ID
     * @param {string} classId - Class ID
     * @param {Date} date - Date
     * @param {number} minutesLate - Minutes late
     * @returns {Promise<any>} Tardiness record
     *
     * @example
     * ```typescript
     * await service.recordTardiness('stu-123', 'class-cs101', new Date(), 15);
     * ```
     */
    recordTardiness(studentId: string, classId: string, date: Date, minutesLate: number): Promise<any>;
    /**
     * 4. Records early dismissal with reason.
     *
     * @param {string} studentId - Student ID
     * @param {Date} date - Date
     * @param {string} reason - Dismissal reason
     * @param {number} minutesAbsent - Minutes of class missed
     * @returns {Promise<any>} Early dismissal record
     *
     * @example
     * ```typescript
     * await service.recordEarlyDismissal(
     *   'stu-123',
     *   new Date(),
     *   'Medical appointment',
     *   90
     * );
     * ```
     */
    recordEarlyDismissal(studentId: string, date: Date, reason: string, minutesAbsent: number): Promise<any>;
    /**
     * 5. Submits absence excuse with documentation.
     *
     * @param {AbsenceExcuseData} excuseData - Excuse data
     * @returns {Promise<any>} Excuse submission
     *
     * @example
     * ```typescript
     * const excuse = await service.submitAbsenceExcuse({
     *   attendanceRecordId: 'att-123',
     *   studentId: 'stu-123',
     *   excuseType: AbsenceType.MEDICAL_APPOINTMENT,
     *   submittedBy: 'parent-789',
     *   submittedDate: new Date(),
     *   documentationUrl: 'https://cdn.example.com/docs/medical-note.pdf',
     *   status: 'pending'
     * });
     * ```
     */
    submitAbsenceExcuse(excuseData: AbsenceExcuseData): Promise<any>;
    /**
     * 6. Approves or denies absence excuse.
     *
     * @param {string} excuseId - Excuse ID
     * @param {string} verifiedBy - Verifier ID
     * @param {'approved' | 'denied'} decision - Approval decision
     * @param {string} notes - Decision notes
     * @returns {Promise<any>} Updated excuse
     *
     * @example
     * ```typescript
     * await service.verifyAbsenceExcuse(
     *   'excuse-123',
     *   'admin-456',
     *   'approved',
     *   'Valid medical documentation provided'
     * );
     * ```
     */
    verifyAbsenceExcuse(excuseId: string, verifiedBy: string, decision: 'approved' | 'denied', notes?: string): Promise<any>;
    /**
     * 7. Updates attendance record status.
     *
     * @param {string} recordId - Attendance record ID
     * @param {AttendanceStatus} newStatus - New status
     * @returns {Promise<any>} Updated record
     *
     * @example
     * ```typescript
     * await service.updateAttendanceStatus('att-123', AttendanceStatus.EXCUSED);
     * ```
     */
    updateAttendanceStatus(recordId: string, newStatus: AttendanceStatus): Promise<any>;
    /**
     * 8. Retrieves student attendance history.
     *
     * @param {string} studentId - Student ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any[]>} Attendance history
     *
     * @example
     * ```typescript
     * const history = await service.getAttendanceHistory(
     *   'stu-123',
     *   new Date('2024-09-01'),
     *   new Date('2024-12-31')
     * );
     * console.log(`${history.length} attendance records found`);
     * ```
     */
    getAttendanceHistory(studentId: string, startDate: Date, endDate: Date): Promise<any[]>;
    /**
     * 9. Calculates comprehensive attendance statistics.
     *
     * @param {string} studentId - Student ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<AttendanceStatistics>} Attendance statistics
     *
     * @example
     * ```typescript
     * const stats = await service.calculateAttendanceStatistics('stu-123', '2024-2025', 'Fall');
     * console.log(`Attendance rate: ${stats.attendanceRate}%`);
     * console.log(`Chronic absence: ${stats.chronicAbsence}`);
     * ```
     */
    calculateAttendanceStatistics(studentId: string, academicYear: string, term: string): Promise<AttendanceStatistics>;
    /**
     * 10. Detects chronic absenteeism patterns.
     *
     * @param {string} studentId - Student ID
     * @param {number} threshold - Absence threshold percentage
     * @returns {Promise<any>} Chronic absence analysis
     *
     * @example
     * ```typescript
     * const analysis = await service.detectChronicAbsenteeism('stu-123', 10);
     * if (analysis.isChronicAbsent) {
     *   console.log('Intervention required:', analysis.recommendedActions);
     * }
     * ```
     */
    detectChronicAbsenteeism(studentId: string, threshold?: number): Promise<any>;
    /**
     * 11. Identifies attendance patterns.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<AttendancePattern>} Detected patterns
     *
     * @example
     * ```typescript
     * const patterns = await service.identifyAttendancePatterns('stu-123');
     * console.log(`Pattern type: ${patterns.patternType}`);
     * console.log(`Confidence: ${patterns.confidence * 100}%`);
     * ```
     */
    identifyAttendancePatterns(studentId: string): Promise<AttendancePattern>;
    /**
     * 12. Generates class attendance summary.
     *
     * @param {string} classId - Class ID
     * @param {Date} date - Date
     * @returns {Promise<any>} Class attendance summary
     *
     * @example
     * ```typescript
     * const summary = await service.getClassAttendanceSummary('class-cs101', new Date());
     * console.log(`Present: ${summary.present}, Absent: ${summary.absent}`);
     * ```
     */
    getClassAttendanceSummary(classId: string, date: Date): Promise<any>;
    /**
     * 13. Generates attendance trend analysis.
     *
     * @param {string} studentId - Student ID
     * @param {number} weeks - Number of weeks to analyze
     * @returns {Promise<any>} Trend analysis
     *
     * @example
     * ```typescript
     * const trends = await service.analyzeAttendanceTrends('stu-123', 8);
     * console.log(`Trend: ${trends.trend}`); // improving, declining, stable
     * ```
     */
    analyzeAttendanceTrends(studentId: string, weeks: number): Promise<any>;
    /**
     * 14. Compares attendance across student cohorts.
     *
     * @param {string[]} studentIds - Student IDs to compare
     * @param {string} term - Term
     * @returns {Promise<any>} Comparison data
     *
     * @example
     * ```typescript
     * const comparison = await service.compareAttendanceRates(
     *   ['stu-123', 'stu-456', 'stu-789'],
     *   'Fall'
     * );
     * ```
     */
    compareAttendanceRates(studentIds: string[], term: string): Promise<any>;
    /**
     * 15. Calculates comprehensive engagement score.
     *
     * @param {string} studentId - Student ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<EngagementMetricsData>} Engagement metrics
     *
     * @example
     * ```typescript
     * const engagement = await service.calculateEngagementScore('stu-123', '2024-2025', 'Fall');
     * console.log(`Engagement level: ${engagement.engagementLevel}`);
     * console.log(`Overall score: ${engagement.overallEngagementScore}`);
     * ```
     */
    calculateEngagementScore(studentId: string, academicYear: string, term: string): Promise<EngagementMetricsData>;
    /**
     * 16. Tracks student participation in class activities.
     *
     * @param {EngagementActivityData} activityData - Activity data
     * @returns {Promise<any>} Activity record
     *
     * @example
     * ```typescript
     * await service.trackParticipationActivity({
     *   studentId: 'stu-123',
     *   activityType: 'class_participation',
     *   courseId: 'course-cs101',
     *   activityDate: new Date(),
     *   qualityScore: 4,
     *   notes: 'Excellent question about algorithms',
     *   recordedBy: 'teacher-456'
     * });
     * ```
     */
    trackParticipationActivity(activityData: EngagementActivityData): Promise<any>;
    /**
     * 17. Monitors LMS engagement metrics.
     *
     * @param {string} studentId - Student ID
     * @param {string} courseId - Course ID
     * @returns {Promise<any>} LMS engagement data
     *
     * @example
     * ```typescript
     * const lmsData = await service.trackLmsEngagement('stu-123', 'course-cs101');
     * console.log(`Logins: ${lmsData.loginCount}, Time: ${lmsData.totalMinutes} minutes`);
     * ```
     */
    trackLmsEngagement(studentId: string, courseId: string): Promise<any>;
    /**
     * 18. Identifies at-risk students based on engagement.
     *
     * @param {string} term - Term
     * @param {number} threshold - Engagement threshold
     * @returns {Promise<any[]>} At-risk students
     *
     * @example
     * ```typescript
     * const atRisk = await service.identifyAtRiskStudents('Fall', 60);
     * console.log(`${atRisk.length} students require intervention`);
     * ```
     */
    identifyAtRiskStudents(term: string, threshold?: number): Promise<any[]>;
    /**
     * 19. Generates engagement dashboard metrics.
     *
     * @param {string} classId - Class ID
     * @returns {Promise<any>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateEngagementDashboard('class-cs101');
     * ```
     */
    generateEngagementDashboard(classId: string): Promise<any>;
    /**
     * 20. Tracks office hours attendance.
     *
     * @param {string} studentId - Student ID
     * @param {string} facultyId - Faculty ID
     * @param {Date} visitDate - Visit date
     * @param {number} duration - Duration in minutes
     * @returns {Promise<any>} Office hours visit record
     *
     * @example
     * ```typescript
     * await service.recordOfficeHoursVisit('stu-123', 'fac-456', new Date(), 30);
     * ```
     */
    recordOfficeHoursVisit(studentId: string, facultyId: string, visitDate: Date, duration: number): Promise<any>;
    /**
     * 21. Generates predictive engagement risk score.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<PredictiveEngagementData>} Predictive risk analysis
     *
     * @example
     * ```typescript
     * const prediction = await service.predictEngagementRisk('stu-123');
     * if (prediction.riskLevel === 'high') {
     *   console.log('Recommended interventions:', prediction.recommendedInterventions);
     * }
     * ```
     */
    predictEngagementRisk(studentId: string): Promise<PredictiveEngagementData>;
    /**
     * 22. Generates early warning alert.
     *
     * @param {EarlyWarningData} warningData - Warning data
     * @returns {Promise<any>} Created warning alert
     *
     * @example
     * ```typescript
     * const warning = await service.createEarlyWarningAlert({
     *   studentId: 'stu-123',
     *   warningType: 'attendance',
     *   severity: 'high',
     *   indicators: [
     *     {
     *       indicator: 'absence_rate',
     *       value: 15,
     *       threshold: 10,
     *       status: 'critical'
     *     }
     *   ],
     *   recommendedActions: ['Schedule parent meeting', 'Create intervention plan'],
     *   status: 'active'
     * });
     * ```
     */
    createEarlyWarningAlert(warningData: EarlyWarningData): Promise<any>;
    /**
     * 23. Creates intervention plan for at-risk student.
     *
     * @param {InterventionPlanData} planData - Intervention plan data
     * @returns {Promise<any>} Created intervention plan
     *
     * @example
     * ```typescript
     * const plan = await service.createInterventionPlan({
     *   studentId: 'stu-123',
     *   planType: 'academic_support',
     *   createdBy: 'counselor-789',
     *   createdDate: new Date(),
     *   targetOutcomes: ['Improve attendance to 90%', 'Complete missing assignments'],
     *   strategies: ['Weekly check-ins', 'Tutoring sessions', 'Modified schedule'],
     *   timeline: {
     *     startDate: new Date(),
     *     endDate: new Date('2025-01-15')
     *   },
     *   participants: [
     *     { role: 'student', userId: 'stu-123', name: 'John Smith' },
     *     { role: 'counselor', userId: 'counselor-789', name: 'Jane Doe' },
     *     { role: 'parent', userId: 'parent-456', name: 'Mary Smith' }
     *   ],
     *   status: 'planned'
     * });
     * ```
     */
    createInterventionPlan(planData: InterventionPlanData): Promise<any>;
    /**
     * 24. Tracks intervention plan progress.
     *
     * @param {string} planId - Plan ID
     * @param {string} note - Progress note
     * @returns {Promise<any>} Updated plan
     *
     * @example
     * ```typescript
     * await service.updateInterventionProgress(
     *   'plan-123',
     *   'Student attended all classes this week. Improvement noted.'
     * );
     * ```
     */
    updateInterventionProgress(planId: string, note: string): Promise<any>;
    /**
     * 25. Assigns success coach to student.
     *
     * @param {SuccessCoachData} coachData - Coach assignment data
     * @returns {Promise<any>} Coach assignment
     *
     * @example
     * ```typescript
     * const assignment = await service.assignSuccessCoach({
     *   studentId: 'stu-123',
     *   coachId: 'coach-456',
     *   assignmentDate: new Date(),
     *   meetingFrequency: 'weekly',
     *   focusAreas: ['Attendance', 'Time management', 'Study skills'],
     *   goals: [
     *     { goal: 'Achieve 95% attendance', targetDate: new Date('2025-01-15'), achieved: false }
     *   ],
     *   status: 'active'
     * });
     * ```
     */
    assignSuccessCoach(coachData: SuccessCoachData): Promise<any>;
    /**
     * 26. Schedules parent-teacher conference.
     *
     * @param {string} studentId - Student ID
     * @param {Date} meetingDate - Meeting date
     * @param {string[]} participants - Participant IDs
     * @param {string} agenda - Meeting agenda
     * @returns {Promise<any>} Conference scheduling
     *
     * @example
     * ```typescript
     * await service.scheduleParentConference(
     *   'stu-123',
     *   new Date('2024-10-20T14:00:00'),
     *   ['parent-456', 'teacher-789', 'counselor-012'],
     *   'Discuss attendance concerns and create action plan'
     * );
     * ```
     */
    scheduleParentConference(studentId: string, meetingDate: Date, participants: string[], agenda: string): Promise<any>;
    /**
     * 27. Sends intervention notifications to stakeholders.
     *
     * @param {string} planId - Intervention plan ID
     * @param {string} message - Notification message
     * @returns {Promise<any>} Notification result
     *
     * @example
     * ```typescript
     * await service.notifyInterventionStakeholders(
     *   'plan-123',
     *   'Intervention plan created. Please review and confirm participation.'
     * );
     * ```
     */
    notifyInterventionStakeholders(planId: string, message: string): Promise<any>;
    /**
     * 28. Evaluates intervention plan outcomes.
     *
     * @param {string} planId - Plan ID
     * @param {string} assessment - Outcome assessment
     * @returns {Promise<any>} Completed plan
     *
     * @example
     * ```typescript
     * await service.evaluateInterventionOutcome(
     *   'plan-123',
     *   'Student attendance improved from 75% to 92%. Goals achieved.'
     * );
     * ```
     */
    evaluateInterventionOutcome(planId: string, assessment: string): Promise<any>;
    /**
     * 29. Sends absence notification to parents/guardians.
     *
     * @param {AttendanceNotificationData} notificationData - Notification data
     * @returns {Promise<any>} Notification record
     *
     * @example
     * ```typescript
     * await service.sendAbsenceNotification({
     *   studentId: 'stu-123',
     *   notificationType: 'absence',
     *   recipients: [
     *     { recipientType: 'parent', recipientId: 'parent-456', preferredChannel: 'sms' }
     *   ],
     *   message: 'Your student was absent from school today.',
     *   sentDate: new Date(),
     *   deliveryStatus: 'sent'
     * });
     * ```
     */
    sendAbsenceNotification(notificationData: AttendanceNotificationData): Promise<any>;
    /**
     * 30. Generates daily attendance report.
     *
     * @param {Date} date - Report date
     * @param {string} schoolId - School ID
     * @returns {Promise<any>} Daily attendance report
     *
     * @example
     * ```typescript
     * const report = await service.generateDailyAttendanceReport(new Date(), 'school-001');
     * console.log(`Total absences: ${report.totalAbsences}`);
     * ```
     */
    generateDailyAttendanceReport(date: Date, schoolId: string): Promise<any>;
    /**
     * 31. Generates comprehensive attendance report.
     *
     * @param {AttendanceReportOptions} options - Report options
     * @returns {Promise<any>} Attendance report
     *
     * @example
     * ```typescript
     * const report = await service.generateAttendanceReport({
     *   startDate: new Date('2024-09-01'),
     *   endDate: new Date('2024-12-31'),
     *   schoolId: 'school-001',
     *   gradeLevel: '9',
     *   groupBy: 'student',
     *   includeStatistics: true,
     *   format: 'detailed'
     * });
     * ```
     */
    generateAttendanceReport(options: AttendanceReportOptions): Promise<any>;
    /**
     * 32. Generates engagement metrics report.
     *
     * @param {string} term - Term
     * @param {string} schoolId - School ID
     * @returns {Promise<any>} Engagement report
     *
     * @example
     * ```typescript
     * const report = await service.generateEngagementReport('Fall', 'school-001');
     * ```
     */
    generateEngagementReport(term: string, schoolId: string): Promise<any>;
    /**
     * 33. Generates intervention effectiveness report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Effectiveness report
     *
     * @example
     * ```typescript
     * const report = await service.generateInterventionReport(
     *   new Date('2024-09-01'),
     *   new Date('2024-12-31')
     * );
     * console.log(`Success rate: ${report.successRate}%`);
     * ```
     */
    generateInterventionReport(startDate: Date, endDate: Date): Promise<any>;
    /**
     * 34. Exports compliance attendance data.
     *
     * @param {string} academicYear - Academic year
     * @param {string} format - Export format
     * @returns {Promise<any>} Compliance export
     *
     * @example
     * ```typescript
     * const export = await service.exportComplianceData('2024-2025', 'csv');
     * console.log(`Export URL: ${export.downloadUrl}`);
     * ```
     */
    exportComplianceData(academicYear: string, format: 'csv' | 'xlsx' | 'pdf'): Promise<any>;
    /**
     * 35. Processes attendance appeals.
     *
     * @param {AttendanceAppealData} appealData - Appeal data
     * @returns {Promise<any>} Appeal record
     *
     * @example
     * ```typescript
     * const appeal = await service.submitAttendanceAppeal({
     *   attendanceRecordId: 'att-123',
     *   studentId: 'stu-123',
     *   appealReason: 'Medical emergency not properly documented initially',
     *   supportingDocuments: ['https://cdn.example.com/docs/medical-note.pdf'],
     *   submittedDate: new Date(),
     *   status: 'submitted'
     * });
     * ```
     */
    submitAttendanceAppeal(appealData: AttendanceAppealData): Promise<any>;
    /**
     * 36. Tracks chronic absence notifications.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Notification history
     *
     * @example
     * ```typescript
     * const notifications = await service.trackChronicAbsenceNotifications('stu-123');
     * console.log(`${notifications.length} notifications sent`);
     * ```
     */
    trackChronicAbsenceNotifications(studentId: string): Promise<any[]>;
    /**
     * 37. Generates parent communication log.
     *
     * @param {string} studentId - Student ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Communication log
     *
     * @example
     * ```typescript
     * const log = await service.generateParentCommunicationLog(
     *   'stu-123',
     *   new Date('2024-09-01'),
     *   new Date('2024-12-31')
     * );
     * ```
     */
    generateParentCommunicationLog(studentId: string, startDate: Date, endDate: Date): Promise<any>;
    /**
     * 38. Generates comprehensive student success dashboard.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Success dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateStudentSuccessDashboard('stu-123');
     * console.log(`Risk level: ${dashboard.riskLevel}`);
     * console.log(`Active interventions: ${dashboard.activeInterventions}`);
     * ```
     */
    generateStudentSuccessDashboard(studentId: string): Promise<any>;
}
export default AttendanceEngagementCompositeService;
//# sourceMappingURL=attendance-engagement-composite.d.ts.map