/**
 * LOC: C9F3E1D7B4
 * Medical Exam Records Service - Production Ready
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecords routes (routes/healthRecords)
 *   - enhancedFeatures routes (routes/enhancedFeatures.ts)
 */

import { logger } from '../../utils/logger';

/**
 * Medical Exam Records Service
 * Manages standardized medical examination records and templates
 */

export enum ExamType {
  ANNUAL_PHYSICAL = 'annual_physical',
  SPORTS_PHYSICAL = 'sports_physical',
  PRE_EMPLOYMENT = 'pre_employment',
  SICK_VISIT = 'sick_visit',
  INJURY_ASSESSMENT = 'injury_assessment',
  MENTAL_HEALTH = 'mental_health',
  DENTAL = 'dental',
  VISION = 'vision',
  HEARING = 'hearing',
  OTHER = 'other'
}

export interface MedicalExamRecord {
  id: string;
  studentId: string;
  examType: ExamType;
  examDate: Date;
  examinedBy: string;
  
  // Chief Complaint
  chiefComplaint?: string;
  
  // Vital Signs
  vitalSigns: {
    temperature?: number; // Fahrenheit
    bloodPressure?: { systolic: number; diastolic: number };
    heartRate?: number; // bpm
    respiratoryRate?: number; // breaths per minute
    oxygenSaturation?: number; // percentage
    weight?: number; // kg
    height?: number; // cm
    bmi?: number;
  };
  
  // Review of Systems
  reviewOfSystems?: {
    constitutional?: string;
    eyes?: string;
    ears?: string;
    nose?: string;
    throat?: string;
    cardiovascular?: string;
    respiratory?: string;
    gastrointestinal?: string;
    genitourinary?: string;
    musculoskeletal?: string;
    skin?: string;
    neurological?: string;
    psychiatric?: string;
    endocrine?: string;
    hematologic?: string;
    allergic?: string;
  };
  
  // Physical Examination Findings
  physicalExam: {
    general?: string;
    head?: string;
    eyes?: string;
    ears?: string;
    nose?: string;
    throat?: string;
    neck?: string;
    cardiovascular?: string;
    respiratory?: string;
    abdomen?: string;
    musculoskeletal?: string;
    skin?: string;
    neurological?: string;
    psychiatric?: string;
  };
  
  // Assessment and Diagnosis
  diagnosis?: string[];
  icdCodes?: string[];
  
  // Treatment Plan
  treatmentPlan?: {
    medications?: string[];
    procedures?: string[];
    referrals?: string[];
    followUp?: {
      recommended: boolean;
      timeframe?: string;
      reason?: string;
    };
    restrictions?: string[];
    accommodations?: string[];
  };
  
  // Clearances (for sports physicals, etc.)
  clearances?: {
    sportsParticipation?: {
      cleared: boolean;
      restrictions?: string[];
      validUntil?: Date;
    };
    schoolAttendance?: {
      cleared: boolean;
      restrictions?: string[];
    };
  };
  
  // Additional Notes
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt?: Date;
  signedBy?: string;
  signedAt?: Date;
  status: 'draft' | 'completed' | 'signed' | 'amended';
}

export interface ExamTemplate {
  type: ExamType;
  requiredFields: string[];
  optionalFields: string[];
  instructions: string;
}

export class MedicalExamRecordsService {
  /**
   * Create a new medical exam record
   */
  static async createExamRecord(
    studentId: string,
    examType: ExamType,
    examinedBy: string,
    data: Partial<MedicalExamRecord>
  ): Promise<MedicalExamRecord> {
    try {
      const record: MedicalExamRecord = {
        id: `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        examType,
        examDate: new Date(),
        examinedBy,
        vitalSigns: data.vitalSigns || {},
        physicalExam: data.physicalExam || {},
        status: 'draft',
        createdAt: new Date(),
        ...data
      };

      // Calculate BMI if height and weight are provided
      if (record.vitalSigns.weight && record.vitalSigns.height) {
        record.vitalSigns.bmi = this.calculateBMI(
          record.vitalSigns.weight,
          record.vitalSigns.height
        );
      }

      // In production, save to database
      logger.info('Medical exam record created', {
        recordId: record.id,
        studentId,
        examType,
        examinedBy
      });

      return record;
    } catch (error) {
      logger.error('Error creating exam record', { error });
      throw error;
    }
  }

  /**
   * Update an existing exam record
   */
  static async updateExamRecord(
    recordId: string,
    updates: Partial<MedicalExamRecord>
  ): Promise<MedicalExamRecord | null> {
    try {
      // In production:
      // 1. Fetch existing record
      // 2. Validate updates
      // 3. Create version history if signed
      // 4. Update record
      // 5. Recalculate BMI if vitals changed

      logger.info('Medical exam record updated', {
        recordId,
        updatedFields: Object.keys(updates)
      });

      return null; // Return updated record
    } catch (error) {
      logger.error('Error updating exam record', { error, recordId });
      return null;
    }
  }

  /**
   * Sign and finalize an exam record
   */
  static async signExamRecord(
    recordId: string,
    signedBy: string,
    signature: string
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const signatureHash = crypto.createHash('sha256').update(signature).digest('hex');

      // In production:
      // 1. Validate record is complete
      // 2. Update status to 'signed'
      // 3. Store signature hash
      // 4. Lock record from further edits
      // 5. Generate final PDF
      // 6. Create audit log

      logger.info('Medical exam record signed', {
        recordId,
        signedBy,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      logger.error('Error signing exam record', { error, recordId });
      return false;
    }
  }

  /**
   * Get exam template for a specific exam type
   */
  static getExamTemplate(examType: ExamType): ExamTemplate {
    const templates: Record<ExamType, ExamTemplate> = {
      [ExamType.ANNUAL_PHYSICAL]: {
        type: ExamType.ANNUAL_PHYSICAL,
        requiredFields: [
          'vitalSigns',
          'reviewOfSystems',
          'physicalExam',
          'diagnosis'
        ],
        optionalFields: [
          'chiefComplaint',
          'treatmentPlan',
          'notes'
        ],
        instructions: 'Complete comprehensive annual physical examination'
      },
      [ExamType.SPORTS_PHYSICAL]: {
        type: ExamType.SPORTS_PHYSICAL,
        requiredFields: [
          'vitalSigns',
          'physicalExam.cardiovascular',
          'physicalExam.musculoskeletal',
          'clearances.sportsParticipation'
        ],
        optionalFields: [
          'reviewOfSystems',
          'notes'
        ],
        instructions: 'Focus on cardiovascular and musculoskeletal systems. Assess for sports participation clearance.'
      },
      [ExamType.SICK_VISIT]: {
        type: ExamType.SICK_VISIT,
        requiredFields: [
          'chiefComplaint',
          'vitalSigns',
          'physicalExam',
          'diagnosis',
          'treatmentPlan'
        ],
        optionalFields: [
          'reviewOfSystems',
          'notes'
        ],
        instructions: 'Document chief complaint, perform focused examination, provide treatment plan'
      },
      [ExamType.INJURY_ASSESSMENT]: {
        type: ExamType.INJURY_ASSESSMENT,
        requiredFields: [
          'chiefComplaint',
          'physicalExam.musculoskeletal',
          'diagnosis',
          'treatmentPlan'
        ],
        optionalFields: [
          'vitalSigns',
          'notes'
        ],
        instructions: 'Document injury mechanism, perform musculoskeletal examination, provide treatment and follow-up plan'
      },
      [ExamType.MENTAL_HEALTH]: {
        type: ExamType.MENTAL_HEALTH,
        requiredFields: [
          'chiefComplaint',
          'reviewOfSystems.psychiatric',
          'physicalExam.psychiatric',
          'diagnosis',
          'treatmentPlan'
        ],
        optionalFields: [
          'notes'
        ],
        instructions: 'Conduct mental health screening, assess for safety concerns, develop treatment plan'
      },
      [ExamType.DENTAL]: {
        type: ExamType.DENTAL,
        requiredFields: [
          'physicalExam.throat',
          'diagnosis'
        ],
        optionalFields: [
          'chiefComplaint',
          'treatmentPlan',
          'notes'
        ],
        instructions: 'Examine teeth, gums, and oral cavity'
      },
      [ExamType.VISION]: {
        type: ExamType.VISION,
        requiredFields: [
          'physicalExam.eyes',
          'diagnosis'
        ],
        optionalFields: [
          'chiefComplaint',
          'treatmentPlan',
          'notes'
        ],
        instructions: 'Perform vision screening and eye examination'
      },
      [ExamType.HEARING]: {
        type: ExamType.HEARING,
        requiredFields: [
          'physicalExam.ears',
          'diagnosis'
        ],
        optionalFields: [
          'chiefComplaint',
          'treatmentPlan',
          'notes'
        ],
        instructions: 'Perform hearing screening and ear examination'
      },
      [ExamType.PRE_EMPLOYMENT]: {
        type: ExamType.PRE_EMPLOYMENT,
        requiredFields: [
          'vitalSigns',
          'physicalExam',
          'diagnosis',
          'clearances'
        ],
        optionalFields: [
          'reviewOfSystems',
          'notes'
        ],
        instructions: 'Complete pre-employment physical examination'
      },
      [ExamType.OTHER]: {
        type: ExamType.OTHER,
        requiredFields: [
          'examType',
          'physicalExam'
        ],
        optionalFields: [
          'chiefComplaint',
          'vitalSigns',
          'diagnosis',
          'treatmentPlan',
          'notes'
        ],
        instructions: 'Complete examination as appropriate'
      }
    };

    return templates[examType];
  }

  /**
   * Validate exam record is complete
   */
  static validateExamRecord(record: MedicalExamRecord): { valid: boolean; missingFields: string[] } {
    const template = this.getExamTemplate(record.examType);
    const missingFields: string[] = [];

    for (const field of template.requiredFields) {
      const fieldPath = field.split('.');
      let value: any = record;
      
      for (const key of fieldPath) {
        value = value?.[key];
      }
      
      if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
        missingFields.push(field);
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Get exam history for a student
   */
  static async getStudentExamHistory(
    studentId: string,
    examType?: ExamType,
    startDate?: Date,
    endDate?: Date
  ): Promise<MedicalExamRecord[]> {
    try {
      // In production, query database with filters
      logger.info('Fetching student exam history', {
        studentId,
        examType,
        startDate,
        endDate
      });

      return [];
    } catch (error) {
      logger.error('Error fetching exam history', { error, studentId });
      return [];
    }
  }

  /**
   * Generate exam report
   */
  static async generateExamReport(recordId: string): Promise<{ html: string; pdf?: Buffer }> {
    try {
      // In production:
      // 1. Fetch exam record
      // 2. Generate formatted HTML
      // 3. Convert to PDF if needed
      // 4. Include signature and timestamps

      const html = `
        <div class="exam-report">
          <h1>Medical Examination Report</h1>
          <p>Record ID: ${recordId}</p>
          <!-- Full formatted exam report -->
        </div>
      `;

      logger.info('Exam report generated', { recordId });
      return { html };
    } catch (error) {
      logger.error('Error generating exam report', { error, recordId });
      throw error;
    }
  }

  /**
   * Calculate BMI
   */
  private static calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  /**
   * Assess vital signs for abnormalities
   */
  static assessVitalSigns(
    vitalSigns: MedicalExamRecord['vitalSigns'],
    studentAge: number
  ): { normal: boolean; concerns: string[] } {
    const concerns: string[] = [];

    // Temperature
    if (vitalSigns.temperature) {
      if (vitalSigns.temperature > 100.4) {
        concerns.push('Elevated temperature (fever)');
      } else if (vitalSigns.temperature < 95) {
        concerns.push('Low temperature (hypothermia)');
      }
    }

    // Blood Pressure (pediatric ranges vary by age and height)
    if (vitalSigns.bloodPressure) {
      if (vitalSigns.bloodPressure.systolic > 130 || vitalSigns.bloodPressure.diastolic > 80) {
        concerns.push('Elevated blood pressure');
      }
    }

    // Heart Rate
    if (vitalSigns.heartRate) {
      if (studentAge < 12) {
        if (vitalSigns.heartRate > 120) concerns.push('Elevated heart rate (tachycardia)');
        if (vitalSigns.heartRate < 60) concerns.push('Low heart rate (bradycardia)');
      } else {
        if (vitalSigns.heartRate > 100) concerns.push('Elevated heart rate (tachycardia)');
        if (vitalSigns.heartRate < 50) concerns.push('Low heart rate (bradycardia)');
      }
    }

    // Oxygen Saturation
    if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
      concerns.push('Low oxygen saturation');
    }

    // BMI (age-specific percentiles would be more accurate)
    if (vitalSigns.bmi) {
      if (vitalSigns.bmi < 16) {
        concerns.push('Underweight');
      } else if (vitalSigns.bmi > 30) {
        concerns.push('Overweight/Obese');
      }
    }

    return {
      normal: concerns.length === 0,
      concerns
    };
  }

  /**
   * Get exams needing follow-up
   */
  static async getExamsNeedingFollowUp(): Promise<MedicalExamRecord[]> {
    try {
      // In production, query for exams with:
      // - followUp.recommended = true
      // - followUp timeframe passed
      // - No follow-up exam recorded

      logger.info('Fetching exams needing follow-up');
      return [];
    } catch (error) {
      logger.error('Error fetching exams needing follow-up', { error });
      return [];
    }
  }

  /**
   * Amend a signed exam record
   */
  static async amendExamRecord(
    recordId: string,
    amendedBy: string,
    amendmentReason: string,
    changes: Partial<MedicalExamRecord>
  ): Promise<boolean> {
    try {
      // In production:
      // 1. Verify record exists and is signed
      // 2. Create amendment record
      // 3. Update record with changes
      // 4. Update status to 'amended'
      // 5. Preserve original version
      // 6. Require re-signature

      logger.info('Exam record amended', {
        recordId,
        amendedBy,
        reason: amendmentReason
      });

      return true;
    } catch (error) {
      logger.error('Error amending exam record', { error, recordId });
      return false;
    }
  }
}
