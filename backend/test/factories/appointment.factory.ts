/**
 * Appointment Factory
 *
 * Factory for creating test appointment data with realistic scheduling scenarios.
 * Supports various appointment types, statuses, and recurring appointments.
 */

export enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  ILLNESS_EVALUATION = 'ILLNESS_EVALUATION',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface CreateAppointmentOptions {
  id?: string;
  studentId?: string;
  nurseId?: string;
  type?: AppointmentType;
  scheduledAt?: Date;
  duration?: number;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  recurringGroupId?: string;
  recurringFrequency?: string;
  recurringEndDate?: Date;
}

export class AppointmentFactory {
  private static idCounter = 1;

  /**
   * Create a single test appointment with optional overrides
   */
  static create(overrides: CreateAppointmentOptions = {}): any {
    const id = overrides.id || `appointment-${this.idCounter++}-${Date.now()}`;

    return {
      id,
      studentId: overrides.studentId || 'student-test-1',
      nurseId: overrides.nurseId || 'nurse-test-1',
      type: overrides.type || AppointmentType.ROUTINE_CHECKUP,
      appointmentType: overrides.type || AppointmentType.ROUTINE_CHECKUP, // Alias
      scheduledAt: overrides.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      appointmentDate: overrides.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // Alias
      duration: overrides.duration ?? 30,
      status: overrides.status || AppointmentStatus.SCHEDULED,
      reason: overrides.reason || 'Routine health checkup',
      notes: overrides.notes || null,
      recurringGroupId: overrides.recurringGroupId || null,
      recurringFrequency: overrides.recurringFrequency || null,
      recurringEndDate: overrides.recurringEndDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Virtual getters
      get isUpcoming() {
        return (
          this.scheduledAt > new Date() &&
          [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(this.status)
        );
      },
      get isToday() {
        const today = new Date();
        const apptDate = new Date(this.scheduledAt);
        return apptDate.toDateString() === today.toDateString();
      },
      get minutesUntil() {
        return Math.floor((this.scheduledAt.getTime() - Date.now()) / (1000 * 60));
      },

      // Mock methods
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnThis(),
    };
  }

  /**
   * Create multiple test appointments
   */
  static createMany(count: number, overrides: CreateAppointmentOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a routine checkup appointment
   */
  static createRoutineCheckup(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.ROUTINE_CHECKUP,
      reason: 'Annual health screening',
      duration: 30,
    });
  }

  /**
   * Create a medication administration appointment
   */
  static createMedicationAdministration(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.MEDICATION_ADMINISTRATION,
      reason: 'Daily medication administration',
      duration: 15,
    });
  }

  /**
   * Create an injury assessment appointment
   */
  static createInjuryAssessment(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.INJURY_ASSESSMENT,
      reason: 'Assess playground injury',
      duration: 30,
      status: AppointmentStatus.IN_PROGRESS,
    });
  }

  /**
   * Create an illness evaluation appointment
   */
  static createIllnessEvaluation(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.ILLNESS_EVALUATION,
      reason: 'Student feeling unwell - fever and headache',
      duration: 20,
    });
  }

  /**
   * Create a follow-up appointment
   */
  static createFollowUp(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.FOLLOW_UP,
      reason: 'Follow-up for previous injury',
      duration: 15,
    });
  }

  /**
   * Create a screening appointment
   */
  static createScreening(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.SCREENING,
      reason: 'Vision and hearing screening',
      duration: 20,
    });
  }

  /**
   * Create an emergency appointment
   */
  static createEmergency(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      type: AppointmentType.EMERGENCY,
      reason: 'Emergency - severe allergic reaction',
      duration: 30,
      status: AppointmentStatus.IN_PROGRESS,
      scheduledAt: new Date(), // Now
    });
  }

  /**
   * Create an upcoming appointment (scheduled for future)
   */
  static createUpcoming(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: AppointmentStatus.SCHEDULED,
    });
  }

  /**
   * Create a past appointment
   */
  static createPast(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: AppointmentStatus.COMPLETED,
    });
  }

  /**
   * Create a today appointment
   */
  static createToday(overrides: CreateAppointmentOptions = {}): any {
    const today = new Date();
    today.setHours(10, 0, 0, 0); // 10:00 AM today

    return this.create({
      ...overrides,
      scheduledAt: today,
      status: AppointmentStatus.SCHEDULED,
    });
  }

  /**
   * Create a completed appointment
   */
  static createCompleted(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      status: AppointmentStatus.COMPLETED,
      scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      notes: 'Appointment completed successfully',
    });
  }

  /**
   * Create a cancelled appointment
   */
  static createCancelled(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      status: AppointmentStatus.CANCELLED,
      notes: 'Cancelled by parent request',
    });
  }

  /**
   * Create a no-show appointment
   */
  static createNoShow(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      status: AppointmentStatus.NO_SHOW,
      scheduledAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      notes: 'Student did not show up for appointment',
    });
  }

  /**
   * Create a recurring appointment
   */
  static createRecurring(overrides: CreateAppointmentOptions = {}): any {
    const groupId = `recurring-group-${Date.now()}`;

    return this.create({
      ...overrides,
      recurringGroupId: groupId,
      recurringFrequency: 'WEEKLY',
      recurringEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      reason: 'Weekly medication administration',
      type: AppointmentType.MEDICATION_ADMINISTRATION,
    });
  }

  /**
   * Create a daily recurring appointment
   */
  static createDailyRecurring(overrides: CreateAppointmentOptions = {}): any {
    const groupId = `recurring-group-daily-${Date.now()}`;

    return this.create({
      ...overrides,
      recurringGroupId: groupId,
      recurringFrequency: 'DAILY',
      recurringEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      reason: 'Daily insulin administration',
      type: AppointmentType.MEDICATION_ADMINISTRATION,
    });
  }

  /**
   * Create a weekly recurring appointment
   */
  static createWeeklyRecurring(overrides: CreateAppointmentOptions = {}): any {
    const groupId = `recurring-group-weekly-${Date.now()}`;

    return this.create({
      ...overrides,
      recurringGroupId: groupId,
      recurringFrequency: 'WEEKLY',
      recurringEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      reason: 'Weekly counseling session',
      type: AppointmentType.ROUTINE_CHECKUP,
    });
  }

  /**
   * Create a monthly recurring appointment
   */
  static createMonthlyRecurring(overrides: CreateAppointmentOptions = {}): any {
    const groupId = `recurring-group-monthly-${Date.now()}`;

    return this.create({
      ...overrides,
      recurringGroupId: groupId,
      recurringFrequency: 'MONTHLY',
      recurringEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      reason: 'Monthly health monitoring',
      type: AppointmentType.ROUTINE_CHECKUP,
    });
  }

  /**
   * Create an appointment in progress
   */
  static createInProgress(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      status: AppointmentStatus.IN_PROGRESS,
      scheduledAt: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
    });
  }

  /**
   * Create a long appointment (90 minutes)
   */
  static createLongAppointment(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      duration: 90,
      reason: 'Comprehensive health assessment',
    });
  }

  /**
   * Create a short appointment (15 minutes)
   */
  static createShortAppointment(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      duration: 15,
      type: AppointmentType.MEDICATION_ADMINISTRATION,
      reason: 'Quick medication administration',
    });
  }

  /**
   * Create an appointment with detailed notes
   */
  static createWithNotes(overrides: CreateAppointmentOptions = {}): any {
    return this.create({
      ...overrides,
      notes: 'Patient presented with symptoms. Vitals checked. No concerns noted. Parent contacted.',
    });
  }

  /**
   * Reset the ID counter (useful between test suites)
   */
  static reset(): void {
    this.idCounter = 1;
  }
}
