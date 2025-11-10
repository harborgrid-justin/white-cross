/**
 * Health Record Factory
 *
 * Factory for creating test health record data with realistic healthcare scenarios.
 * Supports HIPAA-compliant testing with confidential data handling.
 */

export interface CreateHealthRecordOptions {
  id?: string;
  studentId?: string;
  recordType?: string;
  title?: string;
  description?: string;
  recordDate?: Date;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
  isConfidential?: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
}

export class HealthRecordFactory {
  private static idCounter = 1;

  /**
   * Create a single test health record with optional overrides
   */
  static create(overrides: CreateHealthRecordOptions = {}): any {
    const id = overrides.id || `health-record-${this.idCounter++}-${Date.now()}`;

    return {
      id,
      studentId: overrides.studentId || 'student-test-1',
      recordType: overrides.recordType || 'CHECKUP',
      title: overrides.title || 'Annual Physical Examination',
      description: overrides.description || 'Routine annual physical examination',
      recordDate: overrides.recordDate || new Date(),
      provider: overrides.provider || 'Dr. Sarah Johnson',
      providerNpi: overrides.providerNpi || '1234567890',
      facility: overrides.facility || 'White Cross Health Center',
      facilityNpi: overrides.facilityNpi || '9876543210',
      diagnosis: overrides.diagnosis || null,
      diagnosisCode: overrides.diagnosisCode || null,
      treatment: overrides.treatment || null,
      followUpRequired: overrides.followUpRequired ?? false,
      followUpDate: overrides.followUpDate || null,
      followUpCompleted: overrides.followUpCompleted ?? false,
      attachments: overrides.attachments || [],
      metadata: overrides.metadata || {},
      isConfidential: overrides.isConfidential ?? false,
      notes: overrides.notes || null,
      createdBy: overrides.createdBy || 'user-test-1',
      updatedBy: overrides.updatedBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Mock methods
      isFollowUpOverdue: jest.fn().mockReturnValue(false),
      getDaysUntilFollowUp: jest.fn().mockReturnValue(null),
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnThis(),
    };
  }

  /**
   * Create multiple test health records
   */
  static createMany(count: number, overrides: CreateHealthRecordOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a checkup health record
   */
  static createCheckup(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'CHECKUP',
      title: 'Annual Physical Examination',
      description: 'Routine annual physical examination',
    });
  }

  /**
   * Create a vaccination record
   */
  static createVaccination(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'VACCINATION',
      title: 'COVID-19 Vaccination',
      description: 'COVID-19 vaccine dose administered',
      treatment: 'Pfizer-BioNTech COVID-19 Vaccine',
    });
  }

  /**
   * Create an illness record
   */
  static createIllness(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'ILLNESS',
      title: 'Upper Respiratory Infection',
      description: 'Patient presenting with cold symptoms',
      diagnosis: 'Upper Respiratory Infection',
      diagnosisCode: 'J06.9',
      treatment: 'Rest, fluids, and over-the-counter medication',
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
  }

  /**
   * Create an injury record
   */
  static createInjury(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'INJURY',
      title: 'Minor Sprained Ankle',
      description: 'Student injured ankle during PE class',
      diagnosis: 'Sprained Ankle',
      diagnosisCode: 'S93.40',
      treatment: 'RICE protocol (Rest, Ice, Compression, Elevation)',
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    });
  }

  /**
   * Create a mental health record (confidential)
   */
  static createMentalHealth(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'MENTAL_HEALTH',
      title: 'Mental Health Counseling Session',
      description: 'Individual counseling session',
      isConfidential: true,
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  /**
   * Create an emergency visit record
   */
  static createEmergency(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'EMERGENCY_VISIT',
      title: 'Emergency Room Visit',
      description: 'Emergency department visit',
      diagnosis: 'Severe Asthma Attack',
      diagnosisCode: 'J45.901',
      treatment: 'Albuterol nebulizer treatment',
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });
  }

  /**
   * Create a record with overdue follow-up
   */
  static createOverdueFollowUp(overrides: CreateHealthRecordOptions = {}): any {
    const record = this.create({
      ...overrides,
      followUpRequired: true,
      followUpDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      followUpCompleted: false,
    });

    record.isFollowUpOverdue = jest.fn().mockReturnValue(true);
    record.getDaysUntilFollowUp = jest.fn().mockReturnValue(-7);

    return record;
  }

  /**
   * Create a confidential record
   */
  static createConfidential(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      isConfidential: true,
      notes: 'CONFIDENTIAL: Sensitive health information',
    });
  }

  /**
   * Create a record with attachments
   */
  static createWithAttachments(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      attachments: [
        'uploads/health-records/lab-results-123.pdf',
        'uploads/health-records/prescription-456.pdf',
      ],
    });
  }

  /**
   * Create a screening record
   */
  static createScreening(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'SCREENING',
      title: 'Vision Screening',
      description: 'Annual vision screening',
      metadata: {
        rightEye: '20/20',
        leftEye: '20/25',
        passedScreening: true,
      },
    });
  }

  /**
   * Create a lab result record
   */
  static createLabResult(overrides: CreateHealthRecordOptions = {}): any {
    return this.create({
      ...overrides,
      recordType: 'LAB_RESULT',
      title: 'Blood Test Results',
      description: 'Complete Blood Count (CBC)',
      metadata: {
        testType: 'CBC',
        results: {
          WBC: '7.5',
          RBC: '4.8',
          Hemoglobin: '14.2',
          Platelets: '250',
        },
        normalRange: true,
      },
      attachments: ['uploads/lab-results/cbc-report.pdf'],
    });
  }

  /**
   * Reset the ID counter (useful between test suites)
   */
  static reset(): void {
    this.idCounter = 1;
  }
}
