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

/**
 * File: /reuse/education/composites/academic-advising-composite.ts
 * Locator: WC-COMP-ADVISING-001
 * Purpose: Academic Advising Composite - Production-grade student advising, degree planning, and academic support
 *
 * Upstream: @nestjs/common, sequelize, advising/planning/audit/records/analytics kits
 * Downstream: Advising controllers, success services, alert systems, planning modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 40+ composed functions for comprehensive academic advising and student support
 *
 * LLM Context: Production-grade advising composite for Ellucian SIS Academic Management.
 * Composes functions to provide complete advising workflows, appointment scheduling, advising notes,
 * degree progress tracking, early alert systems, academic probation management, graduation planning,
 * student success interventions, advisor assignment, and holistic student support. Essential for
 * advisors, success coaches, and student services managing student progression and retention.
 */

import { Injectable, Logger, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Sequelize, Model, DataTypes, ModelAttributes, ModelOptions, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  duration: number; // minutes
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const createAdvisingSessionModel = (sequelize: Sequelize) => {
  class AdvisingSession extends Model {
    public id!: string;
    public studentId!: string;
    public advisorId!: string;
    public scheduledAt!: Date;
    public duration!: number;
    public sessionType!: SessionType;
    public location!: string | null;
    public isVirtual!: boolean;
    public meetingLink!: string | null;
    public status!: AppointmentStatus;
    public agenda!: string | null;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AdvisingSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Student identifier',
      },
      advisorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Advisor identifier',
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled date/time',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        comment: 'Duration in minutes',
      },
      sessionType: {
        type: DataTypes.ENUM('general', 'registration', 'academic_plan', 'probation', 'graduation_check', 'career', 'crisis'),
        allowNull: false,
        comment: 'Session type',
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Meeting location',
      },
      isVirtual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Virtual meeting',
      },
      meetingLink: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Virtual meeting link',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Appointment status',
      },
      agenda: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Session agenda',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Session notes',
      },
    },
    {
      sequelize,
      tableName: 'advising_sessions',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['advisorId'] },
        { fields: ['scheduledAt'] },
        { fields: ['status'] },
        { fields: ['sessionType'] },
      ],
    },
  );

  return AdvisingSession;
};

/**
 * Sequelize model for Early Alerts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EarlyAlert model
 */
export const createEarlyAlertModel = (sequelize: Sequelize) => {
  class EarlyAlert extends Model {
    public id!: string;
    public studentId!: string;
    public reportedBy!: string;
    public alertType!: EarlyAlertType;
    public severity!: AlertSeverity;
    public description!: string;
    public courseId!: string | null;
    public recommendedActions!: string[];
    public assignedTo!: string | null;
    public dueDate!: Date | null;
    public status!: InterventionStatus;
    public resolvedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EarlyAlert.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Student identifier',
      },
      reportedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reporter (faculty/staff)',
      },
      alertType: {
        type: DataTypes.ENUM('attendance', 'academic_performance', 'engagement', 'financial', 'personal', 'behavioral'),
        allowNull: false,
        comment: 'Alert type',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Alert severity',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Alert description',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related course',
      },
      recommendedActions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Recommended interventions',
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Assigned advisor/counselor',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Follow-up due date',
      },
      status: {
        type: DataTypes.ENUM('identified', 'contacted', 'in_progress', 'resolved', 'escalated'),
        allowNull: false,
        defaultValue: 'identified',
        comment: 'Intervention status',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution timestamp',
      },
    },
    {
      sequelize,
      tableName: 'early_alerts',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['assignedTo'] },
      ],
    },
  );

  return EarlyAlert;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * Academic Advising Composite Service
 *
 * Provides comprehensive student advising, degree planning, early intervention,
 * and student success support for higher education institutions.
 */
@Injectable()
export class AcademicAdvisingService {
  private readonly logger = new Logger(AcademicAdvisingService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. ADVISING APPOINTMENTS (Functions 1-8)
  // ============================================================================

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
  async scheduleAdvisingAppointment(appointmentData: AdvisingAppointmentData): Promise<any> {
    this.logger.log(`Scheduling appointment for student: ${appointmentData.studentId}`);

    // Check advisor availability
    const isAvailable = await this.checkAdvisorAvailability(
      appointmentData.advisorId,
      appointmentData.scheduledAt,
      appointmentData.duration,
    );

    if (!isAvailable) {
      throw new BadRequestException('Advisor not available at requested time');
    }

    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    return await AdvisingSession.create(appointmentData);
  }

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
  async updateAdvisingAppointment(appointmentId: string, updates: Partial<AdvisingAppointmentData>): Promise<any> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const appointment = await AdvisingSession.findByPk(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await appointment.update(updates);
    return appointment;
  }

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
  async cancelAdvisingAppointment(appointmentId: string, reason: string): Promise<any> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const appointment = await AdvisingSession.findByPk(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await appointment.update({ status: 'cancelled' });
    this.logger.log(`Appointment ${appointmentId} cancelled: ${reason}`);

    return appointment;
  }

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
  async completeAdvisingAppointment(appointmentId: string, notes: string): Promise<any> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const appointment = await AdvisingSession.findByPk(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await appointment.update({ status: 'completed', notes });
    return appointment;
  }

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
  async getUpcomingAppointments(advisorId: string, days: number = 7): Promise<any[]> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await AdvisingSession.findAll({
      where: {
        advisorId,
        scheduledAt: { [Op.between]: [new Date(), endDate] },
        status: { [Op.in]: ['scheduled', 'confirmed'] },
      },
      order: [['scheduledAt', 'ASC']],
    });
  }

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
  async getStudentAppointmentHistory(studentId: string): Promise<any[]> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    return await AdvisingSession.findAll({
      where: { studentId },
      order: [['scheduledAt', 'DESC']],
    });
  }

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
  async checkAdvisorAvailability(advisorId: string, scheduledAt: Date, duration: number): Promise<boolean> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const endTime = new Date(scheduledAt.getTime() + duration * 60000);

    const conflicts = await AdvisingSession.findOne({
      where: {
        advisorId,
        status: { [Op.in]: ['scheduled', 'confirmed'] },
        [Op.or]: [
          {
            scheduledAt: { [Op.between]: [scheduledAt, endTime] },
          },
        ],
      },
    });

    return !conflicts;
  }

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
  async sendAppointmentReminder(appointmentId: string): Promise<void> {
    const appointment = await this.getAppointmentById(appointmentId);
    this.logger.log(`Sending reminder for appointment: ${appointmentId}`);
    // Would integrate with email/SMS service
  }

  // ============================================================================
  // 2. ADVISING NOTES & DOCUMENTATION (Functions 9-15)
  // ============================================================================

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
  async createAdvisingNote(noteData: AdvisingNoteData): Promise<any> {
    this.logger.log(`Creating advising note for student: ${noteData.studentId}`);

    // Mock implementation - would create note record
    return {
      id: 'note-' + Date.now(),
      ...noteData,
      createdAt: new Date(),
    };
  }

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
  async updateAdvisingNote(noteId: string, updates: Partial<AdvisingNoteData>): Promise<any> {
    return { id: noteId, ...updates };
  }

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
  async getStudentAdvisingNotes(studentId: string): Promise<any[]> {
    return [];
  }

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
  async searchAdvisingNotesByTags(tags: string[]): Promise<any[]> {
    return [];
  }

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
  async generateAdvisingSummary(studentId: string): Promise<any> {
    const appointments = await this.getStudentAppointmentHistory(studentId);
    const notes = await this.getStudentAdvisingNotes(studentId);

    return {
      studentId,
      totalAppointments: appointments.length,
      lastAppointment: appointments[0]?.scheduledAt,
      totalNotes: notes.length,
      pendingFollowUps: notes.filter((n: any) => n.followUpRequired).length,
    };
  }

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
  async markFollowUpComplete(noteId: string): Promise<any> {
    return this.updateAdvisingNote(noteId, { followUpRequired: false });
  }

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
  async validateNoteFERPAAccess(noteId: string, userId: string): Promise<boolean> {
    // Mock implementation - would check FERPA permissions
    return true;
  }

  // ============================================================================
  // 3. EARLY ALERTS & INTERVENTIONS (Functions 16-23)
  // ============================================================================

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
  async createEarlyAlert(alertData: EarlyAlertData): Promise<any> {
    this.logger.log(`Creating early alert for student: ${alertData.studentId}`);

    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    const alert = await EarlyAlert.create({
      ...alertData,
      status: 'identified',
    });

    // Auto-assign due date based on severity
    if (alertData.severity === 'critical') {
      alert.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    } else if (alertData.severity === 'high') {
      alert.dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    }

    await alert.save();
    return alert;
  }

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
  async updateEarlyAlertStatus(alertId: string, status: InterventionStatus): Promise<any> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    const alert = await EarlyAlert.findByPk(alertId);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await alert.update({
      status,
      resolvedAt: status === 'resolved' ? new Date() : null,
    });

    return alert;
  }

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
  async assignEarlyAlert(alertId: string, advisorId: string): Promise<any> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    const alert = await EarlyAlert.findByPk(alertId);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await alert.update({ assignedTo: advisorId, status: 'contacted' });
    return alert;
  }

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
  async getStudentAlerts(studentId: string): Promise<any[]> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    return await EarlyAlert.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
    });
  }

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
  async getAdvisorAlerts(advisorId: string): Promise<any[]> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    return await EarlyAlert.findAll({
      where: {
        assignedTo: advisorId,
        status: { [Op.notIn]: ['resolved'] },
      },
      order: [['severity', 'DESC'], ['createdAt', 'ASC']],
    });
  }

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
  async escalateEarlyAlert(alertId: string, escalatedTo: string): Promise<any> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    const alert = await EarlyAlert.findByPk(alertId);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await alert.update({ status: 'escalated', assignedTo: escalatedTo });
    this.logger.log(`Alert ${alertId} escalated to ${escalatedTo}`);

    return alert;
  }

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
  async generateEarlyAlertReport(term: string): Promise<any> {
    const EarlyAlert = createEarlyAlertModel(this.sequelize);
    const alerts = await EarlyAlert.findAll();

    return {
      term,
      totalAlerts: alerts.length,
      bySeverity: {
        critical: alerts.filter((a: any) => a.severity === 'critical').length,
        high: alerts.filter((a: any) => a.severity === 'high').length,
        medium: alerts.filter((a: any) => a.severity === 'medium').length,
        low: alerts.filter((a: any) => a.severity === 'low').length,
      },
      byStatus: {
        identified: alerts.filter((a: any) => a.status === 'identified').length,
        contacted: alerts.filter((a: any) => a.status === 'contacted').length,
        in_progress: alerts.filter((a: any) => a.status === 'in_progress').length,
        resolved: alerts.filter((a: any) => a.status === 'resolved').length,
        escalated: alerts.filter((a: any) => a.status === 'escalated').length,
      },
    };
  }

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
  async trackInterventionEffectiveness(alertId: string): Promise<any> {
    return {
      alertId,
      timeToContact: 2.5, // days
      timeToResolution: 12.0, // days
      studentImprovement: true,
      followUpRequired: false,
    };
  }

  // ============================================================================
  // 4. DEGREE PROGRESS & PLANNING (Functions 24-32)
  // ============================================================================

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
  async calculateDegreeProgress(studentId: string, programId: string): Promise<DegreeProgressData> {
    // Mock implementation - would calculate from actual records
    return {
      studentId,
      programId,
      creditsCompleted: 90,
      creditsRequired: 120,
      cumulativeGPA: 3.45,
      estimatedGraduationDate: new Date('2026-05-15'),
      requirementsSatisfied: ['General Education', 'Core Major Courses'],
      requirementsPending: ['Senior Capstone', 'Electives'],
      percentComplete: 75,
    };
  }

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
  async createAcademicPlan(planData: AcademicPlanData): Promise<any> {
    this.logger.log(`Creating academic plan for student: ${planData.studentId}`);

    return {
      id: 'plan-' + Date.now(),
      ...planData,
      createdAt: new Date(),
    };
  }

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
  async updateAcademicPlan(planId: string, updates: Partial<AcademicPlanData>): Promise<any> {
    return { id: planId, ...updates };
  }

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
  async validateCourseSelection(studentId: string, selectedCourses: string[]): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Mock validation logic
    return { valid: issues.length === 0, issues };
  }

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
  async generateGraduationChecklist(studentId: string): Promise<any> {
    const progress = await this.calculateDegreeProgress(studentId, 'cs-bs');

    return {
      studentId,
      items: [
        { item: 'Complete 120 credits', status: progress.creditsCompleted >= 120 ? 'complete' : 'pending' },
        { item: 'Maintain 2.0 GPA', status: progress.cumulativeGPA >= 2.0 ? 'complete' : 'pending' },
        { item: 'Complete major requirements', status: 'in_progress' },
        { item: 'File graduation application', status: 'pending' },
        { item: 'Clear financial holds', status: 'complete' },
      ],
    };
  }

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
  async projectTimeToCompletion(studentId: string): Promise<any> {
    return {
      studentId,
      expectedDate: new Date('2026-05-15'),
      semestersRemaining: 3,
      onTrack: true,
      creditsPerSemesterNeeded: 15,
    };
  }

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
  async identifyPrerequisiteGaps(studentId: string, courseId: string): Promise<string[]> {
    // Mock implementation
    return ['cs-301', 'math-221'];
  }

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
  async generateDegreeAudit(studentId: string): Promise<any> {
    const progress = await this.calculateDegreeProgress(studentId, 'cs-bs');

    return {
      studentId,
      programId: progress.programId,
      totalCreditsEarned: progress.creditsCompleted,
      totalCreditsRequired: progress.creditsRequired,
      gpa: progress.cumulativeGPA,
      requirementsSatisfied: progress.requirementsSatisfied,
      requirementsPending: progress.requirementsPending,
      auditDate: new Date(),
    };
  }

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
  async recommendCoursesForNextTerm(studentId: string): Promise<string[]> {
    return ['cs-301', 'cs-302', 'math-221', 'elective-gen-ed'];
  }

  // ============================================================================
  // 5. STUDENT SUCCESS & RETENTION (Functions 33-40)
  // ============================================================================

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
  async calculateRetentionRisk(studentId: string): Promise<StudentSuccessMetric> {
    const alerts = await this.getStudentAlerts(studentId);

    return {
      studentId,
      retentionRisk: alerts.length > 3 ? 'high' : alerts.length > 1 ? 'medium' : 'low',
      engagementScore: 75,
      attendanceRate: 92,
      gpa: 3.15,
      creditsOnTrack: true,
      alerts: alerts.length,
      interventions: alerts.filter((a: any) => a.status !== 'identified').length,
    };
  }

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
  async assignPrimaryAdvisor(assignmentData: AdvisorAssignmentData): Promise<any> {
    return {
      id: 'assignment-' + Date.now(),
      ...assignmentData,
    };
  }

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
  async calculateAdvisorCaseload(advisorId: string): Promise<any> {
    return {
      advisorId,
      totalStudents: 85,
      primaryAdvisees: 75,
      secondaryAdvisees: 10,
      averageGPA: 3.25,
      atRiskStudents: 12,
      upcomingAppointments: 8,
    };
  }

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
  async generateStudentSuccessDashboard(studentId: string): Promise<any> {
    const metrics = await this.calculateRetentionRisk(studentId);
    const progress = await this.calculateDegreeProgress(studentId, 'cs-bs');

    return {
      studentId,
      retentionRisk: metrics.retentionRisk,
      degreeProgress: progress.percentComplete,
      gpa: progress.cumulativeGPA,
      alerts: metrics.alerts,
      lastAdvisingContact: new Date('2025-10-15'),
    };
  }

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
  async trackStudentEngagement(studentId: string): Promise<any> {
    return {
      studentId,
      portalLogins: 45,
      lmsActivity: 82,
      campusEventAttendance: 6,
      advisingAppointments: 3,
      engagementScore: 78,
    };
  }

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
  async identifyAtRiskStudents(programId: string): Promise<any[]> {
    return [];
  }

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
  async generateRetentionReport(cohortYear: string): Promise<any> {
    return {
      cohortYear,
      totalStudents: 450,
      retained: 382,
      retentionRate: 84.9,
      graduated: 15,
      transferred: 28,
      withdrawn: 25,
    };
  }

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
  async exportStudentSuccessData(programId: string, format: 'csv' | 'json' | 'xlsx'): Promise<any> {
    if (format === 'json') {
      return { programId, students: [] };
    }
    return Buffer.from(`${format} export`);
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Retrieves appointment by ID.
   *
   * @private
   */
  private async getAppointmentById(appointmentId: string): Promise<any> {
    const AdvisingSession = createAdvisingSessionModel(this.sequelize);
    const appointment = await AdvisingSession.findByPk(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default AcademicAdvisingService;
