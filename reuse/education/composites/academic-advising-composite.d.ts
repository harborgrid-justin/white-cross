/**
 * LOC: EDU-COMP-ADVISING-001
 * File: /reuse/education/composites/academic-advising-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../advising-management-kit
 *   - ../academic-planning-kit
 *   - ../degree-audit-kit
 *   - ../student-records-kit
 *   - ../student-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Advising controllers
 *   - Student success services
 *   - Early alert systems
 *   - Degree planning modules
 *   - Retention tracking systems
 */
import { Sequelize } from 'sequelize';
/**
 * Advising appointment status
 */
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
/**
 * Early alert severity
 */
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
/**
 * Early alert type
 */
export type EarlyAlertType = 'attendance' | 'academic_performance' | 'engagement' | 'financial' | 'personal' | 'behavioral';
/**
 * Intervention status
 */
export type InterventionStatus = 'identified' | 'contacted' | 'in_progress' | 'resolved' | 'escalated';
/**
 * Advising session type
 */
export type SessionType = 'general' | 'registration' | 'academic_plan' | 'probation' | 'graduation_check' | 'career' | 'crisis';
/**
 * Advising note data
 */
export interface AdvisingNoteData {
    studentId: string;
    advisorId: string;
    sessionId?: string;
    noteType: SessionType;
    content: string;
    isConfidential: boolean;
    followUpRequired: boolean;
    followUpDate?: Date;
    tags?: string[];
}
/**
 * Advising appointment data
 */
export interface AdvisingAppointmentData {
    studentId: string;
    advisorId: string;
    scheduledAt: Date;
    duration: number;
    sessionType: SessionType;
    location?: string;
    isVirtual: boolean;
    meetingLink?: string;
    status: AppointmentStatus;
    agenda?: string;
    notes?: string;
}
/**
 * Early alert data
 */
export interface EarlyAlertData {
    studentId: string;
    reportedBy: string;
    alertType: EarlyAlertType;
    severity: AlertSeverity;
    description: string;
    courseId?: string;
    recommendedActions: string[];
    assignedTo?: string;
    dueDate?: Date;
}
/**
 * Degree progress data
 */
export interface DegreeProgressData {
    studentId: string;
    programId: string;
    creditsCompleted: number;
    creditsRequired: number;
    cumulativeGPA: number;
    estimatedGraduationDate: Date;
    requirementsSatisfied: string[];
    requirementsPending: string[];
    percentComplete: number;
}
/**
 * Academic plan data
 */
export interface AcademicPlanData {
    studentId: string;
    programId: string;
    advisorId: string;
    planName: string;
    startDate: Date;
    targetGraduationDate: Date;
    semesterPlans: Array<{
        term: string;
        year: number;
        courses: string[];
        totalCredits: number;
    }>;
    milestones: Array<{
        milestone: string;
        targetDate: Date;
        completed: boolean;
    }>;
}
/**
 * Advisor assignment data
 */
export interface AdvisorAssignmentData {
    advisorId: string;
    studentId: string;
    assignmentType: 'primary' | 'secondary' | 'peer';
    effectiveDate: Date;
    endDate?: Date;
    isActive: boolean;
}
/**
 * Student success metric
 */
export interface StudentSuccessMetric {
    studentId: string;
    retentionRisk: 'low' | 'medium' | 'high';
    engagementScore: number;
    attendanceRate: number;
    gpa: number;
    creditsOnTrack: boolean;
    alerts: number;
    interventions: number;
}
/**
 * Sequelize model for Advising Sessions with comprehensive tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     AdvisingSession:
 *       type: object
 *       required:
 *         - studentId
 *         - advisorId
 *         - sessionType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         studentId:
 *           type: string
 *         advisorId:
 *           type: string
 *         sessionType:
 *           type: string
 *           enum: [general, registration, academic_plan, probation, graduation_check, career, crisis]
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AdvisingSession model
 *
 * @example
 * ```typescript
 * const AdvisingSession = createAdvisingSessionModel(sequelize);
 * const session = await AdvisingSession.create({
 *   studentId: 'student-123',
 *   advisorId: 'advisor-456',
 *   scheduledAt: new Date('2025-11-15T10:00:00'),
 *   duration: 30,
 *   sessionType: 'registration',
 *   isVirtual: true,
 *   status: 'scheduled'
 * });
 * ```
 */
export declare const createAdvisingSessionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        advisorId: string;
        scheduledAt: Date;
        duration: number;
        sessionType: SessionType;
        location: string | null;
        isVirtual: boolean;
        meetingLink: string | null;
        status: AppointmentStatus;
        agenda: string | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Early Alerts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EarlyAlert model
 */
export declare const createEarlyAlertModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        reportedBy: string;
        alertType: EarlyAlertType;
        severity: AlertSeverity;
        description: string;
        courseId: string | null;
        recommendedActions: string[];
        assignedTo: string | null;
        dueDate: Date | null;
        status: InterventionStatus;
        resolvedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Academic Advising Composite Service
 *
 * Provides comprehensive student advising, degree planning, early intervention,
 * and student success support for higher education institutions.
 */
export declare class AcademicAdvisingService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Schedules an advising appointment.
     *
     * @param {AdvisingAppointmentData} appointmentData - Appointment data
     * @returns {Promise<any>} Created appointment
     *
     * @example
     * ```typescript
     * const appointment = await service.scheduleAdvisingAppointment({
     *   studentId: 'student-123',
     *   advisorId: 'advisor-456',
     *   scheduledAt: new Date('2025-11-15T10:00:00'),
     *   duration: 30,
     *   sessionType: 'registration',
     *   isVirtual: true,
     *   meetingLink: 'https://zoom.us/j/123456',
     *   status: 'scheduled',
     *   agenda: 'Spring 2026 course selection'
     * });
     * ```
     */
    scheduleAdvisingAppointment(appointmentData: AdvisingAppointmentData): Promise<any>;
    /**
     * 2. Updates advising appointment.
     *
     * @param {string} appointmentId - Appointment ID
     * @param {Partial<AdvisingAppointmentData>} updates - Updates
     * @returns {Promise<any>} Updated appointment
     *
     * @example
     * ```typescript
     * await service.updateAdvisingAppointment('appt-123', {
     *   scheduledAt: new Date('2025-11-16T14:00:00')
     * });
     * ```
     */
    updateAdvisingAppointment(appointmentId: string, updates: Partial<AdvisingAppointmentData>): Promise<any>;
    /**
     * 3. Cancels advising appointment.
     *
     * @param {string} appointmentId - Appointment ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<any>} Cancelled appointment
     *
     * @example
     * ```typescript
     * await service.cancelAdvisingAppointment('appt-123', 'Student illness');
     * ```
     */
    cancelAdvisingAppointment(appointmentId: string, reason: string): Promise<any>;
    /**
     * 4. Completes advising appointment with notes.
     *
     * @param {string} appointmentId - Appointment ID
     * @param {string} notes - Session notes
     * @returns {Promise<any>} Completed appointment
     *
     * @example
     * ```typescript
     * await service.completeAdvisingAppointment('appt-123', 'Discussed spring courses. Student on track.');
     * ```
     */
    completeAdvisingAppointment(appointmentId: string, notes: string): Promise<any>;
    /**
     * 5. Retrieves upcoming appointments for advisor.
     *
     * @param {string} advisorId - Advisor ID
     * @param {number} days - Days ahead to look
     * @returns {Promise<any[]>} Upcoming appointments
     *
     * @example
     * ```typescript
     * const upcoming = await service.getUpcomingAppointments('advisor-456', 7);
     * ```
     */
    getUpcomingAppointments(advisorId: string, days?: number): Promise<any[]>;
    /**
     * 6. Retrieves student appointment history.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Appointment history
     *
     * @example
     * ```typescript
     * const history = await service.getStudentAppointmentHistory('student-123');
     * ```
     */
    getStudentAppointmentHistory(studentId: string): Promise<any[]>;
    /**
     * 7. Checks advisor availability.
     *
     * @param {string} advisorId - Advisor ID
     * @param {Date} scheduledAt - Requested time
     * @param {number} duration - Duration in minutes
     * @returns {Promise<boolean>} True if available
     *
     * @example
     * ```typescript
     * const available = await service.checkAdvisorAvailability('advisor-456', new Date(), 30);
     * ```
     */
    checkAdvisorAvailability(advisorId: string, scheduledAt: Date, duration: number): Promise<boolean>;
    /**
     * 8. Sends appointment reminders.
     *
     * @param {string} appointmentId - Appointment ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.sendAppointmentReminder('appt-123');
     * ```
     */
    sendAppointmentReminder(appointmentId: string): Promise<void>;
    /**
     * 9. Creates an advising note.
     *
     * @param {AdvisingNoteData} noteData - Note data
     * @returns {Promise<any>} Created note
     *
     * @example
     * ```typescript
     * const note = await service.createAdvisingNote({
     *   studentId: 'student-123',
     *   advisorId: 'advisor-456',
     *   noteType: 'general',
     *   content: 'Student expressed interest in changing major',
     *   isConfidential: false,
     *   followUpRequired: true,
     *   followUpDate: new Date('2025-12-01'),
     *   tags: ['major-change', 'exploration']
     * });
     * ```
     */
    createAdvisingNote(noteData: AdvisingNoteData): Promise<any>;
    /**
     * 10. Updates advising note.
     *
     * @param {string} noteId - Note ID
     * @param {Partial<AdvisingNoteData>} updates - Updates
     * @returns {Promise<any>} Updated note
     *
     * @example
     * ```typescript
     * await service.updateAdvisingNote('note-123', { followUpRequired: false });
     * ```
     */
    updateAdvisingNote(noteId: string, updates: Partial<AdvisingNoteData>): Promise<any>;
    /**
     * 11. Retrieves all notes for student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Advising notes
     *
     * @example
     * ```typescript
     * const notes = await service.getStudentAdvisingNotes('student-123');
     * ```
     */
    getStudentAdvisingNotes(studentId: string): Promise<any[]>;
    /**
     * 12. Searches advising notes by tags.
     *
     * @param {string[]} tags - Search tags
     * @returns {Promise<any[]>} Matching notes
     *
     * @example
     * ```typescript
     * const notes = await service.searchAdvisingNotesByTags(['major-change', 'probation']);
     * ```
     */
    searchAdvisingNotesByTags(tags: string[]): Promise<any[]>;
    /**
     * 13. Generates advising summary for student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Advising summary
     *
     * @example
     * ```typescript
     * const summary = await service.generateAdvisingSummary('student-123');
     * ```
     */
    generateAdvisingSummary(studentId: string): Promise<any>;
    /**
     * 14. Marks follow-up complete.
     *
     * @param {string} noteId - Note ID
     * @returns {Promise<any>} Updated note
     *
     * @example
     * ```typescript
     * await service.markFollowUpComplete('note-123');
     * ```
     */
    markFollowUpComplete(noteId: string): Promise<any>;
    /**
     * 15. Validates FERPA compliance for notes.
     *
     * @param {string} noteId - Note ID
     * @param {string} userId - Requesting user ID
     * @returns {Promise<boolean>} True if authorized
     *
     * @example
     * ```typescript
     * const authorized = await service.validateNoteFERPAAccess('note-123', 'user-456');
     * ```
     */
    validateNoteFERPAAccess(noteId: string, userId: string): Promise<boolean>;
    /**
     * 16. Creates early alert for student.
     *
     * @param {EarlyAlertData} alertData - Alert data
     * @returns {Promise<any>} Created alert
     *
     * @example
     * ```typescript
     * const alert = await service.createEarlyAlert({
     *   studentId: 'student-123',
     *   reportedBy: 'faculty-789',
     *   alertType: 'attendance',
     *   severity: 'high',
     *   description: 'Student has missed 4 consecutive classes',
     *   courseId: 'cs-101',
     *   recommendedActions: ['Contact student', 'Schedule meeting', 'Check wellness'],
     *   assignedTo: 'advisor-456'
     * });
     * ```
     */
    createEarlyAlert(alertData: EarlyAlertData): Promise<any>;
    /**
     * 17. Updates early alert status.
     *
     * @param {string} alertId - Alert ID
     * @param {InterventionStatus} status - New status
     * @returns {Promise<any>} Updated alert
     *
     * @example
     * ```typescript
     * await service.updateEarlyAlertStatus('alert-123', 'in_progress');
     * ```
     */
    updateEarlyAlertStatus(alertId: string, status: InterventionStatus): Promise<any>;
    /**
     * 18. Assigns early alert to advisor.
     *
     * @param {string} alertId - Alert ID
     * @param {string} advisorId - Advisor ID
     * @returns {Promise<any>} Updated alert
     *
     * @example
     * ```typescript
     * await service.assignEarlyAlert('alert-123', 'advisor-456');
     * ```
     */
    assignEarlyAlert(alertId: string, advisorId: string): Promise<any>;
    /**
     * 19. Retrieves all alerts for student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Student alerts
     *
     * @example
     * ```typescript
     * const alerts = await service.getStudentAlerts('student-123');
     * ```
     */
    getStudentAlerts(studentId: string): Promise<any[]>;
    /**
     * 20. Retrieves alerts assigned to advisor.
     *
     * @param {string} advisorId - Advisor ID
     * @returns {Promise<any[]>} Assigned alerts
     *
     * @example
     * ```typescript
     * const alerts = await service.getAdvisorAlerts('advisor-456');
     * ```
     */
    getAdvisorAlerts(advisorId: string): Promise<any[]>;
    /**
     * 21. Escalates critical alert.
     *
     * @param {string} alertId - Alert ID
     * @param {string} escalatedTo - Escalation target
     * @returns {Promise<any>} Updated alert
     *
     * @example
     * ```typescript
     * await service.escalateEarlyAlert('alert-123', 'dean-789');
     * ```
     */
    escalateEarlyAlert(alertId: string, escalatedTo: string): Promise<any>;
    /**
     * 22. Generates early alert report.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Alert report
     *
     * @example
     * ```typescript
     * const report = await service.generateEarlyAlertReport('fall');
     * ```
     */
    generateEarlyAlertReport(term: string): Promise<any>;
    /**
     * 23. Tracks intervention effectiveness.
     *
     * @param {string} alertId - Alert ID
     * @returns {Promise<any>} Effectiveness metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackInterventionEffectiveness('alert-123');
     * ```
     */
    trackInterventionEffectiveness(alertId: string): Promise<any>;
    /**
     * 24. Calculates degree progress for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} programId - Program ID
     * @returns {Promise<DegreeProgressData>} Progress data
     *
     * @example
     * ```typescript
     * const progress = await service.calculateDegreeProgress('student-123', 'cs-bs');
     * console.log(`${progress.percentComplete}% complete`);
     * ```
     */
    calculateDegreeProgress(studentId: string, programId: string): Promise<DegreeProgressData>;
    /**
     * 25. Creates academic plan for student.
     *
     * @param {AcademicPlanData} planData - Plan data
     * @returns {Promise<any>} Created plan
     *
     * @example
     * ```typescript
     * const plan = await service.createAcademicPlan({
     *   studentId: 'student-123',
     *   programId: 'cs-bs',
     *   advisorId: 'advisor-456',
     *   planName: 'CS Degree Plan 2025-2026',
     *   startDate: new Date('2025-09-01'),
     *   targetGraduationDate: new Date('2029-05-15'),
     *   semesterPlans: [...],
     *   milestones: [...]
     * });
     * ```
     */
    createAcademicPlan(planData: AcademicPlanData): Promise<any>;
    /**
     * 26. Updates academic plan.
     *
     * @param {string} planId - Plan ID
     * @param {Partial<AcademicPlanData>} updates - Updates
     * @returns {Promise<any>} Updated plan
     *
     * @example
     * ```typescript
     * await service.updateAcademicPlan('plan-123', {
     *   targetGraduationDate: new Date('2029-12-15')
     * });
     * ```
     */
    updateAcademicPlan(planId: string, updates: Partial<AcademicPlanData>): Promise<any>;
    /**
     * 27. Validates course selection against plan.
     *
     * @param {string} studentId - Student ID
     * @param {string[]} selectedCourses - Selected course IDs
     * @returns {Promise<{valid: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateCourseSelection('student-123', ['cs-301', 'math-221']);
     * ```
     */
    validateCourseSelection(studentId: string, selectedCourses: string[]): Promise<{
        valid: boolean;
        issues: string[];
    }>;
    /**
     * 28. Generates graduation checklist.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Graduation checklist
     *
     * @example
     * ```typescript
     * const checklist = await service.generateGraduationChecklist('student-123');
     * ```
     */
    generateGraduationChecklist(studentId: string): Promise<any>;
    /**
     * 29. Projects time to degree completion.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Completion projection
     *
     * @example
     * ```typescript
     * const projection = await service.projectTimeToCompletion('student-123');
     * console.log(`Expected graduation: ${projection.expectedDate}`);
     * ```
     */
    projectTimeToCompletion(studentId: string): Promise<any>;
    /**
     * 30. Identifies prerequisite gaps.
     *
     * @param {string} studentId - Student ID
     * @param {string} courseId - Desired course ID
     * @returns {Promise<string[]>} Missing prerequisites
     *
     * @example
     * ```typescript
     * const gaps = await service.identifyPrerequisiteGaps('student-123', 'cs-401');
     * ```
     */
    identifyPrerequisiteGaps(studentId: string, courseId: string): Promise<string[]>;
    /**
     * 31. Generates degree audit report.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Audit report
     *
     * @example
     * ```typescript
     * const audit = await service.generateDegreeAudit('student-123');
     * ```
     */
    generateDegreeAudit(studentId: string): Promise<any>;
    /**
     * 32. Recommends courses for next term.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<string[]>} Recommended courses
     *
     * @example
     * ```typescript
     * const recommendations = await service.recommendCoursesForNextTerm('student-123');
     * ```
     */
    recommendCoursesForNextTerm(studentId: string): Promise<string[]>;
    /**
     * 33. Calculates student retention risk score.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<StudentSuccessMetric>} Success metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.calculateRetentionRisk('student-123');
     * console.log(`Retention risk: ${metrics.retentionRisk}`);
     * ```
     */
    calculateRetentionRisk(studentId: string): Promise<StudentSuccessMetric>;
    /**
     * 34. Assigns primary advisor to student.
     *
     * @param {AdvisorAssignmentData} assignmentData - Assignment data
     * @returns {Promise<any>} Created assignment
     *
     * @example
     * ```typescript
     * await service.assignPrimaryAdvisor({
     *   advisorId: 'advisor-456',
     *   studentId: 'student-123',
     *   assignmentType: 'primary',
     *   effectiveDate: new Date(),
     *   isActive: true
     * });
     * ```
     */
    assignPrimaryAdvisor(assignmentData: AdvisorAssignmentData): Promise<any>;
    /**
     * 35. Calculates advisor caseload.
     *
     * @param {string} advisorId - Advisor ID
     * @returns {Promise<any>} Caseload statistics
     *
     * @example
     * ```typescript
     * const caseload = await service.calculateAdvisorCaseload('advisor-456');
     * console.log(`Advising ${caseload.totalStudents} students`);
     * ```
     */
    calculateAdvisorCaseload(advisorId: string): Promise<any>;
    /**
     * 36. Generates student success dashboard.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Success dashboard
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateStudentSuccessDashboard('student-123');
     * ```
     */
    generateStudentSuccessDashboard(studentId: string): Promise<any>;
    /**
     * 37. Tracks student engagement metrics.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Engagement metrics
     *
     * @example
     * ```typescript
     * const engagement = await service.trackStudentEngagement('student-123');
     * ```
     */
    trackStudentEngagement(studentId: string): Promise<any>;
    /**
     * 38. Identifies at-risk students.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} At-risk students
     *
     * @example
     * ```typescript
     * const atRisk = await service.identifyAtRiskStudents('cs-bs');
     * ```
     */
    identifyAtRiskStudents(programId: string): Promise<any[]>;
    /**
     * 39. Generates retention report.
     *
     * @param {string} cohortYear - Cohort year
     * @returns {Promise<any>} Retention report
     *
     * @example
     * ```typescript
     * const report = await service.generateRetentionReport('2024');
     * ```
     */
    generateRetentionReport(cohortYear: string): Promise<any>;
    /**
     * 40. Exports student success data.
     *
     * @param {string} programId - Program ID
     * @param {string} format - Export format
     * @returns {Promise<any>} Exported data
     *
     * @example
     * ```typescript
     * const data = await service.exportStudentSuccessData('cs-bs', 'csv');
     * ```
     */
    exportStudentSuccessData(programId: string, format: 'csv' | 'json' | 'xlsx'): Promise<any>;
    /**
     * Retrieves appointment by ID.
     *
     * @private
     */
    private getAppointmentById;
}
export default AcademicAdvisingService;
//# sourceMappingURL=academic-advising-composite.d.ts.map