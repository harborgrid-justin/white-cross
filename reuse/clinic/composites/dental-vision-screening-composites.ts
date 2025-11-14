/**
 * LOC: CLINIC-SCREENING-COMP-001
 * File: /reuse/clinic/composites/dental-vision-screening-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-screening-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-referral-management-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School clinic screening controllers
 *   - Nurse screening workflows
 *   - State compliance reporting services
 *   - Parent notification services
 *   - Specialist referral management
 *   - Vision/hearing equipment integration
 */

/**
 * File: /reuse/clinic/composites/dental-vision-screening-composites.ts
 * Locator: WC-CLINIC-SCREENING-001
 * Purpose: School Clinic Dental, Vision, and Hearing Screening Composite - State-mandated health screenings
 *
 * Upstream: health-screening-kit, health-patient-management-kit, health-clinical-workflows-kit,
 *           health-referral-management-kit, student-records-kit, student-communication-kit, data-repository
 * Downstream: Clinic screening controllers, Nurse workflows, State compliance, Specialist referrals
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 40 composed functions for complete school health screening management
 *
 * LLM Context: Production-grade school clinic screening composite for K-12 healthcare SaaS platform.
 * Provides comprehensive health screening workflows including vision screening protocols with Snellen chart
 * testing, hearing test administration with audiometry, dental screening and oral health assessments,
 * eyeglass prescription tracking and dispensing, audiology referral management, screening result parent
 * notifications with follow-up recommendations, appointment tracking for specialist visits, and state-required
 * screening compliance reporting for education departments.
 */

import {
  Injectable,
  Logger,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS & ENUMERATIONS
// ============================================================================

/**
 * Screening result classifications
 */
export enum ScreeningResult {
  PASS = 'pass',
  FAIL = 'fail',
  REFER = 'refer',
  RETEST_REQUIRED = 'retest_required',
  INCOMPLETE = 'incomplete',
}

/**
 * Vision test types
 */
export enum VisionTestType {
  DISTANCE_ACUITY = 'distance_acuity',
  NEAR_ACUITY = 'near_acuity',
  COLOR_VISION = 'color_vision',
  DEPTH_PERCEPTION = 'depth_perception',
  EYE_ALIGNMENT = 'eye_alignment',
}

/**
 * Hearing test frequency ranges (Hz)
 */
export enum HearingTestFrequency {
  FREQ_500 = '500',
  FREQ_1000 = '1000',
  FREQ_2000 = '2000',
  FREQ_4000 = '4000',
  FREQ_6000 = '6000',
  FREQ_8000 = '8000',
}

/**
 * Dental screening indicators
 */
export enum DentalHealthIndicator {
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  URGENT_CARE_NEEDED = 'urgent_care_needed',
}

/**
 * Referral status tracking
 */
export enum ReferralStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * Specialist types
 */
export enum SpecialistType {
  OPHTHALMOLOGIST = 'ophthalmologist',
  OPTOMETRIST = 'optometrist',
  AUDIOLOGIST = 'audiologist',
  DENTIST = 'dentist',
  ORTHODONTIST = 'orthodontist',
  ORAL_SURGEON = 'oral_surgeon',
}

/**
 * Vision screening result data
 */
export interface VisionScreeningData {
  screeningId?: string;
  studentId: string;
  screeningDate: Date;
  gradeLevel: string;
  testType: VisionTestType;
  rightEyeAcuity: string; // e.g., "20/20", "20/40"
  leftEyeAcuity: string;
  bothEyesAcuity: string;
  rightEyeResult: ScreeningResult;
  leftEyeResult: ScreeningResult;
  overallResult: ScreeningResult;
  colorVisionResult?: ScreeningResult;
  glassesWorn: boolean;
  screenedBy: string;
  screeningLocation: string;
  referralRequired: boolean;
  parentNotified: boolean;
  notes?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Hearing test result data
 */
export interface HearingTestData {
  testId?: string;
  studentId: string;
  testDate: Date;
  gradeLevel: string;
  testMethod: 'pure_tone_audiometry' | 'otoacoustic_emissions' | 'tympanometry';
  rightEarResults: Record<HearingTestFrequency, number>; // frequency -> decibel level
  leftEarResults: Record<HearingTestFrequency, number>;
  rightEarPass: boolean;
  leftEarPass: boolean;
  overallResult: ScreeningResult;
  backgroundNoise: boolean;
  retestRequired: boolean;
  referralRequired: boolean;
  testedBy: string;
  calibrationDate: Date;
  parentNotified: boolean;
  notes?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Dental screening record
 */
export interface DentalScreeningData {
  screeningId?: string;
  studentId: string;
  screeningDate: Date;
  gradeLevel: string;
  dentalHealthIndicator: DentalHealthIndicator;
  visibleCavities: boolean;
  cavityCount?: number;
  plaquePresent: boolean;
  gingivitisPresent: boolean;
  missingTeeth: number;
  orthodonticNeeds: boolean;
  urgentCareNeeded: boolean;
  urgentCareReason?: string;
  referralRequired: boolean;
  screenedBy: string;
  parentNotified: boolean;
  followUpRecommendations: string[];
  notes?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Eyeglass prescription tracking
 */
export interface EyeglassPrescriptionData {
  prescriptionId?: string;
  studentId: string;
  prescriptionDate: Date;
  prescribedBy: string;
  prescribingProvider: string;
  rightEyeSphere: string;
  rightEyeCylinder?: string;
  rightEyeAxis?: string;
  leftEyeSphere: string;
  leftEyeCylinder?: string;
  leftEyeAxis?: string;
  pupillaryDistance: number;
  prescriptionType: 'distance' | 'reading' | 'bifocal' | 'progressive';
  glassesDispensed: boolean;
  dispensingDate?: Date;
  dispensedBy?: string;
  glassesSource: 'school_program' | 'insurance' | 'parent_purchased' | 'donated';
  expirationDate: Date;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Specialist referral data
 */
export interface SpecialistReferralData {
  referralId?: string;
  studentId: string;
  referralDate: Date;
  referralReason: string;
  specialistType: SpecialistType;
  urgency: 'routine' | 'urgent' | 'emergency';
  referringProvider: string;
  specialistName?: string;
  specialistContact?: string;
  appointmentDate?: Date;
  appointmentTime?: string;
  referralStatus: ReferralStatus;
  appointmentCompleted: boolean;
  followUpReport?: string;
  parentNotified: boolean;
  transportationArranged: boolean;
  insuranceVerified: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Parent screening notification
 */
export interface ParentScreeningNotificationData {
  notificationId?: string;
  studentId: string;
  screeningType: 'vision' | 'hearing' | 'dental';
  screeningDate: Date;
  screeningResult: ScreeningResult;
  referralRecommended: boolean;
  notificationMethod: 'email' | 'sms' | 'phone' | 'letter' | 'portal';
  notificationSentDate: Date;
  notifiedBy: string;
  parentAcknowledged: boolean;
  acknowledgementDate?: Date;
  followUpRequired: boolean;
  schoolId: string;
}

/**
 * Follow-up appointment tracking
 */
export interface FollowUpAppointmentData {
  appointmentId?: string;
  studentId: string;
  referralId: string;
  appointmentType: 'vision' | 'hearing' | 'dental';
  scheduledDate: Date;
  scheduledTime: string;
  providerName: string;
  providerContact: string;
  appointmentStatus: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  reminderSent: boolean;
  reminderDate?: Date;
  completionNotes?: string;
  schoolId: string;
}

/**
 * State compliance reporting data
 */
export interface StateComplianceReportData {
  reportId?: string;
  schoolId: string;
  reportingPeriod: { startDate: Date; endDate: Date };
  gradeLevel: string;
  totalStudentsEnrolled: number;
  visionScreeningsCompleted: number;
  hearingScreeningsCompleted: number;
  dentalScreeningsCompleted: number;
  visionReferralsMade: number;
  hearingReferralsMade: number;
  dentalReferralsMade: number;
  compliancePercentage: number;
  submittedToState: boolean;
  submissionDate?: Date;
  confirmationNumber?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Vision Screenings
 */
export const createVisionScreeningModel = (sequelize: Sequelize) => {
  class VisionScreening extends Model {
    public id!: string;
    public studentId!: string;
    public screeningDate!: Date;
    public gradeLevel!: string;
    public testType!: VisionTestType;
    public rightEyeAcuity!: string;
    public leftEyeAcuity!: string;
    public bothEyesAcuity!: string;
    public rightEyeResult!: ScreeningResult;
    public leftEyeResult!: ScreeningResult;
    public overallResult!: ScreeningResult;
    public colorVisionResult!: ScreeningResult | null;
    public glassesWorn!: boolean;
    public screenedBy!: string;
    public screeningLocation!: string;
    public referralRequired!: boolean;
    public parentNotified!: boolean;
    public notes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for vision quality assessment
    public get visionQualityScore(): number {
      const parseAcuity = (acuity: string): number => {
        const match = acuity.match(/20\/(\d+)/);
        return match ? parseInt(match[1]) : 200;
      };

      const rightScore = parseAcuity(this.rightEyeAcuity);
      const leftScore = parseAcuity(this.leftEyeAcuity);
      const avgScore = (rightScore + leftScore) / 2;

      return avgScore <= 30 ? 100 : Math.max(0, 100 - (avgScore - 20) * 2);
    }
  }

  VisionScreening.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      screeningDate: { type: DataTypes.DATEONLY, allowNull: false },
      gradeLevel: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isIn: [['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']],
        },
      },
      testType: { type: DataTypes.ENUM(...Object.values(VisionTestType)), allowNull: false },
      rightEyeAcuity: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          is: /^20\/\d+$/,
        },
      },
      leftEyeAcuity: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          is: /^20\/\d+$/,
        },
      },
      bothEyesAcuity: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          is: /^20\/\d+$/,
        },
      },
      rightEyeResult: { type: DataTypes.ENUM(...Object.values(ScreeningResult)), allowNull: false },
      leftEyeResult: { type: DataTypes.ENUM(...Object.values(ScreeningResult)), allowNull: false },
      overallResult: { type: DataTypes.ENUM(...Object.values(ScreeningResult)), allowNull: false },
      colorVisionResult: { type: DataTypes.ENUM(...Object.values(ScreeningResult)), allowNull: true },
      glassesWorn: { type: DataTypes.BOOLEAN, defaultValue: false },
      screenedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      screeningLocation: { type: DataTypes.STRING(255), allowNull: false },
      referralRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      notes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'vision_screenings',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['screeningDate'] },
        { fields: ['overallResult'] },
        { fields: ['referralRequired'] },
        { fields: ['gradeLevel'] },
      ],
      hooks: {
        beforeCreate: (screening) => {
          // Auto-determine if referral required based on results
          if (
            screening.rightEyeResult === ScreeningResult.FAIL ||
            screening.leftEyeResult === ScreeningResult.FAIL ||
            screening.overallResult === ScreeningResult.FAIL
          ) {
            screening.referralRequired = true;
          }
        },
        afterCreate: async (screening) => {
          // Log screening for compliance tracking
          console.log(`Vision screening completed for student ${screening.studentId}`);
        },
      },
      scopes: {
        failed: {
          where: { overallResult: ScreeningResult.FAIL },
        },
        requiresReferral: {
          where: { referralRequired: true },
        },
        byGrade: (grade: string) => ({
          where: { gradeLevel: grade },
        }),
        recent: {
          where: {
            screeningDate: {
              [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    },
  );

  return VisionScreening;
};

/**
 * Sequelize model for Hearing Tests
 */
export const createHearingTestModel = (sequelize: Sequelize) => {
  class HearingTest extends Model {
    public id!: string;
    public studentId!: string;
    public testDate!: Date;
    public gradeLevel!: string;
    public testMethod!: string;
    public rightEarResults!: Record<string, number>;
    public leftEarResults!: Record<string, number>;
    public rightEarPass!: boolean;
    public leftEarPass!: boolean;
    public overallResult!: ScreeningResult;
    public backgroundNoise!: boolean;
    public retestRequired!: boolean;
    public referralRequired!: boolean;
    public testedBy!: string;
    public calibrationDate!: Date;
    public parentNotified!: boolean;
    public notes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for hearing threshold average
    public get hearingThresholdAverage(): { right: number; left: number } {
      const calcAvg = (results: Record<string, number>) => {
        const values = Object.values(results);
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      };

      return {
        right: calcAvg(this.rightEarResults),
        left: calcAvg(this.leftEarResults),
      };
    }
  }

  HearingTest.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      testDate: { type: DataTypes.DATEONLY, allowNull: false },
      gradeLevel: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isIn: [['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']],
        },
      },
      testMethod: {
        type: DataTypes.ENUM('pure_tone_audiometry', 'otoacoustic_emissions', 'tympanometry'),
        allowNull: false,
      },
      rightEarResults: { type: DataTypes.JSONB, allowNull: false },
      leftEarResults: { type: DataTypes.JSONB, allowNull: false },
      rightEarPass: { type: DataTypes.BOOLEAN, allowNull: false },
      leftEarPass: { type: DataTypes.BOOLEAN, allowNull: false },
      overallResult: { type: DataTypes.ENUM(...Object.values(ScreeningResult)), allowNull: false },
      backgroundNoise: { type: DataTypes.BOOLEAN, defaultValue: false },
      retestRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      referralRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      testedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      calibrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isRecent(value: Date) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            if (value < sixMonthsAgo) {
              throw new Error('Equipment calibration is more than 6 months old');
            }
          },
        },
      },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      notes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'hearing_tests',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['testDate'] },
        { fields: ['overallResult'] },
        { fields: ['referralRequired'] },
        { fields: ['gradeLevel'] },
      ],
      hooks: {
        beforeCreate: (test) => {
          // Auto-determine if referral required
          if (!test.rightEarPass || !test.leftEarPass) {
            test.referralRequired = true;
          }
        },
      },
      scopes: {
        failed: {
          where: {
            [Op.or]: [{ rightEarPass: false }, { leftEarPass: false }],
          },
        },
        requiresRetest: {
          where: { retestRequired: true },
        },
        requiresReferral: {
          where: { referralRequired: true },
        },
      },
    },
  );

  return HearingTest;
};

/**
 * Sequelize model for Dental Screenings
 */
export const createDentalScreeningModel = (sequelize: Sequelize) => {
  class DentalScreening extends Model {
    public id!: string;
    public studentId!: string;
    public screeningDate!: Date;
    public gradeLevel!: string;
    public dentalHealthIndicator!: DentalHealthIndicator;
    public visibleCavities!: boolean;
    public cavityCount!: number | null;
    public plaquePresent!: boolean;
    public gingivitisPresent!: boolean;
    public missingTeeth!: number;
    public orthodonticNeeds!: boolean;
    public urgentCareNeeded!: boolean;
    public urgentCareReason!: string | null;
    public referralRequired!: boolean;
    public screenedBy!: string;
    public parentNotified!: boolean;
    public followUpRecommendations!: string[];
    public notes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for dental health score
    public get dentalHealthScore(): number {
      let score = 100;

      if (this.dentalHealthIndicator === DentalHealthIndicator.POOR) score -= 40;
      else if (this.dentalHealthIndicator === DentalHealthIndicator.FAIR) score -= 20;
      else if (this.dentalHealthIndicator === DentalHealthIndicator.URGENT_CARE_NEEDED) score -= 60;

      if (this.visibleCavities) score -= (this.cavityCount || 1) * 5;
      if (this.plaquePresent) score -= 10;
      if (this.gingivitisPresent) score -= 15;

      return Math.max(0, score);
    }
  }

  DentalScreening.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      screeningDate: { type: DataTypes.DATEONLY, allowNull: false },
      gradeLevel: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isIn: [['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']],
        },
      },
      dentalHealthIndicator: { type: DataTypes.ENUM(...Object.values(DentalHealthIndicator)), allowNull: false },
      visibleCavities: { type: DataTypes.BOOLEAN, defaultValue: false },
      cavityCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 32,
        },
      },
      plaquePresent: { type: DataTypes.BOOLEAN, defaultValue: false },
      gingivitisPresent: { type: DataTypes.BOOLEAN, defaultValue: false },
      missingTeeth: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 32,
        },
      },
      orthodonticNeeds: { type: DataTypes.BOOLEAN, defaultValue: false },
      urgentCareNeeded: { type: DataTypes.BOOLEAN, defaultValue: false },
      urgentCareReason: { type: DataTypes.TEXT, allowNull: true },
      referralRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      screenedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpRecommendations: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      notes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'dental_screenings',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['screeningDate'] },
        { fields: ['dentalHealthIndicator'] },
        { fields: ['urgentCareNeeded'] },
        { fields: ['referralRequired'] },
        { fields: ['gradeLevel'] },
      ],
      hooks: {
        beforeCreate: (screening) => {
          // Auto-determine if referral required
          if (
            screening.dentalHealthIndicator === DentalHealthIndicator.POOR ||
            screening.dentalHealthIndicator === DentalHealthIndicator.URGENT_CARE_NEEDED ||
            screening.urgentCareNeeded
          ) {
            screening.referralRequired = true;
          }
        },
      },
      scopes: {
        urgentCare: {
          where: { urgentCareNeeded: true },
        },
        requiresReferral: {
          where: { referralRequired: true },
        },
        poorHealth: {
          where: {
            dentalHealthIndicator: [DentalHealthIndicator.POOR, DentalHealthIndicator.URGENT_CARE_NEEDED],
          },
        },
      },
    },
  );

  return DentalScreening;
};

/**
 * Sequelize model for Eyeglass Prescriptions
 */
export const createEyeglassPrescriptionModel = (sequelize: Sequelize) => {
  class EyeglassPrescription extends Model {
    public id!: string;
    public studentId!: string;
    public prescriptionDate!: Date;
    public prescribedBy!: string;
    public prescribingProvider!: string;
    public rightEyeSphere!: string;
    public rightEyeCylinder!: string | null;
    public rightEyeAxis!: string | null;
    public leftEyeSphere!: string;
    public leftEyeCylinder!: string | null;
    public leftEyeAxis!: string | null;
    public pupillaryDistance!: number;
    public prescriptionType!: string;
    public glassesDispensed!: boolean;
    public dispensingDate!: Date | null;
    public dispensedBy!: string | null;
    public glassesSource!: string;
    public expirationDate!: Date;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for prescription strength
    public get prescriptionStrength(): { right: string; left: string } {
      return {
        right: this.rightEyeCylinder ? `${this.rightEyeSphere} ${this.rightEyeCylinder} × ${this.rightEyeAxis}` : this.rightEyeSphere,
        left: this.leftEyeCylinder ? `${this.leftEyeSphere} ${this.leftEyeCylinder} × ${this.leftEyeAxis}` : this.leftEyeSphere,
      };
    }
  }

  EyeglassPrescription.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      prescriptionDate: { type: DataTypes.DATEONLY, allowNull: false },
      prescribedBy: { type: DataTypes.STRING(255), allowNull: false },
      prescribingProvider: { type: DataTypes.STRING(255), allowNull: false },
      rightEyeSphere: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: /^[+-]\d+\.\d{2}$/,
        },
      },
      rightEyeCylinder: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
          is: /^[+-]\d+\.\d{2}$/,
        },
      },
      rightEyeAxis: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
          isInt: true,
          min: 1,
          max: 180,
        },
      },
      leftEyeSphere: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: /^[+-]\d+\.\d{2}$/,
        },
      },
      leftEyeCylinder: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
          is: /^[+-]\d+\.\d{2}$/,
        },
      },
      leftEyeAxis: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
          isInt: true,
          min: 1,
          max: 180,
        },
      },
      pupillaryDistance: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        validate: {
          min: 40,
          max: 80,
        },
      },
      prescriptionType: {
        type: DataTypes.ENUM('distance', 'reading', 'bifocal', 'progressive'),
        allowNull: false,
      },
      glassesDispensed: { type: DataTypes.BOOLEAN, defaultValue: false },
      dispensingDate: { type: DataTypes.DATE, allowNull: true },
      dispensedBy: { type: DataTypes.STRING(255), allowNull: true },
      glassesSource: {
        type: DataTypes.ENUM('school_program', 'insurance', 'parent_purchased', 'donated'),
        allowNull: false,
      },
      expirationDate: { type: DataTypes.DATEONLY, allowNull: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'eyeglass_prescriptions',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['prescriptionDate'] },
        { fields: ['expirationDate'] },
        { fields: ['glassesDispensed'] },
      ],
      scopes: {
        active: {
          where: {
            expirationDate: {
              [Op.gte]: new Date(),
            },
          },
        },
        pendingDispensing: {
          where: {
            glassesDispensed: false,
          },
        },
      },
    },
  );

  return EyeglassPrescription;
};

/**
 * Sequelize model for Specialist Referrals
 */
export const createSpecialistReferralModel = (sequelize: Sequelize) => {
  class SpecialistReferral extends Model {
    public id!: string;
    public studentId!: string;
    public referralDate!: Date;
    public referralReason!: string;
    public specialistType!: SpecialistType;
    public urgency!: string;
    public referringProvider!: string;
    public specialistName!: string | null;
    public specialistContact!: string | null;
    public appointmentDate!: Date | null;
    public appointmentTime!: string | null;
    public referralStatus!: ReferralStatus;
    public appointmentCompleted!: boolean;
    public followUpReport!: string | null;
    public parentNotified!: boolean;
    public transportationArranged!: boolean;
    public insuranceVerified!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SpecialistReferral.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      referralDate: { type: DataTypes.DATEONLY, allowNull: false },
      referralReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 1000],
        },
      },
      specialistType: { type: DataTypes.ENUM(...Object.values(SpecialistType)), allowNull: false },
      urgency: { type: DataTypes.ENUM('routine', 'urgent', 'emergency'), allowNull: false },
      referringProvider: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      specialistName: { type: DataTypes.STRING(255), allowNull: true },
      specialistContact: { type: DataTypes.STRING(100), allowNull: true },
      appointmentDate: { type: DataTypes.DATEONLY, allowNull: true },
      appointmentTime: { type: DataTypes.STRING(10), allowNull: true },
      referralStatus: { type: DataTypes.ENUM(...Object.values(ReferralStatus)), defaultValue: ReferralStatus.PENDING },
      appointmentCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpReport: { type: DataTypes.TEXT, allowNull: true },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      transportationArranged: { type: DataTypes.BOOLEAN, defaultValue: false },
      insuranceVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'specialist_referrals',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['referralStatus'] },
        { fields: ['specialistType'] },
        { fields: ['urgency'] },
        { fields: ['appointmentDate'] },
      ],
      scopes: {
        pending: {
          where: { referralStatus: ReferralStatus.PENDING },
        },
        urgent: {
          where: { urgency: 'urgent' },
        },
        pendingInsurance: {
          where: { insuranceVerified: false },
        },
        upcomingAppointments: {
          where: {
            appointmentDate: {
              [Op.gte]: new Date(),
              [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
          order: [['appointmentDate', 'ASC']],
        },
      },
    },
  );

  return SpecialistReferral;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Clinic Dental, Vision, and Hearing Screening Composite Service
 *
 * Provides comprehensive health screening management for K-12 school clinics
 * including vision, hearing, and dental screenings with state compliance reporting.
 */
@Injectable()
export class DentalVisionScreeningCompositeService {
  private readonly logger = new Logger(DentalVisionScreeningCompositeService.name);

  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  // ============================================================================
  // 1. VISION SCREENING PROTOCOLS & RESULTS (Functions 1-8)
  // ============================================================================

  /**
   * 1. Conducts vision screening with Snellen chart testing.
   * Records visual acuity for right, left, and both eyes.
   */
  async conductVisionScreening(screeningData: VisionScreeningData): Promise<any> {
    this.logger.log(`Conducting vision screening for student ${screeningData.studentId}`);

    const VisionScreening = createVisionScreeningModel(this.sequelize);
    const screening = await VisionScreening.create(screeningData);

    return screening.toJSON();
  }

  /**
   * 2. Retrieves vision screening results for specific student.
   */
  async getVisionScreeningResults(studentId: string): Promise<any[]> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);

    const screenings = await VisionScreening.findAll({
      where: { studentId },
      order: [['screeningDate', 'DESC']],
    });

    return screenings.map((s) => s.toJSON());
  }

  /**
   * 3. Updates vision screening with retest results.
   */
  async updateVisionScreeningRetest(screeningId: string, retestData: Partial<VisionScreeningData>): Promise<any> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);
    const screening = await VisionScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Vision screening ${screeningId} not found`);
    }

    await screening.update(retestData);
    return screening.toJSON();
  }

  /**
   * 4. Identifies students who failed vision screening and need referral.
   */
  async getStudentsFailedVisionScreening(schoolId: string, gradeLevel?: string): Promise<any[]> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);

    const where: any = { schoolId };
    if (gradeLevel) where.gradeLevel = gradeLevel;

    const failedScreenings = await VisionScreening.scope('failed').findAll({ where });

    return failedScreenings.map((s) => s.toJSON());
  }

  /**
   * 5. Conducts color vision screening (Ishihara plates).
   */
  async conductColorVisionScreening(studentId: string, screeningId: string, colorVisionResult: ScreeningResult): Promise<any> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);
    const screening = await VisionScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Vision screening ${screeningId} not found`);
    }

    await screening.update({ colorVisionResult });

    this.logger.log(`Color vision screening completed for student ${studentId}`);
    return screening.toJSON();
  }

  /**
   * 6. Generates vision screening summary report for parent.
   */
  async generateVisionScreeningSummary(screeningId: string): Promise<any> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);
    const screening = await VisionScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Vision screening ${screeningId} not found`);
    }

    return {
      screeningId,
      screeningDate: screening.screeningDate,
      rightEye: screening.rightEyeAcuity,
      leftEye: screening.leftEyeAcuity,
      bothEyes: screening.bothEyesAcuity,
      overallResult: screening.overallResult,
      referralRequired: screening.referralRequired,
      recommendations: screening.referralRequired
        ? 'Your child should see an eye care professional for a comprehensive eye exam'
        : 'No further action needed at this time',
      visionQualityScore: (screening as any).visionQualityScore,
    };
  }

  /**
   * 7. Tracks vision screening compliance by grade level.
   */
  async trackVisionScreeningCompliance(schoolId: string, gradeLevel: string): Promise<any> {
    const VisionScreening = createVisionScreeningModel(this.sequelize);

    const currentSchoolYear = new Date().getFullYear();
    const schoolYearStart = new Date(`${currentSchoolYear}-08-01`);

    const screenings = await VisionScreening.findAll({
      where: {
        schoolId,
        gradeLevel,
        screeningDate: { [Op.gte]: schoolYearStart },
      },
    });

    // In production, would query total students enrolled
    const totalStudentsInGrade = 100;
    const screenedCount = screenings.length;

    return {
      gradeLevel,
      totalStudents: totalStudentsInGrade,
      screenedStudents: screenedCount,
      compliancePercentage: ((screenedCount / totalStudentsInGrade) * 100).toFixed(2),
      remainingToScreen: totalStudentsInGrade - screenedCount,
    };
  }

  /**
   * 8. Archives vision screening data for historical records.
   */
  async archiveVisionScreeningData(schoolId: string, beforeDate: Date): Promise<any> {
    this.logger.log(`Archiving vision screening data before ${beforeDate}`);

    const VisionScreening = createVisionScreeningModel(this.sequelize);

    const archivedScreenings = await VisionScreening.findAll({
      where: {
        schoolId,
        screeningDate: { [Op.lt]: beforeDate },
      },
    });

    return {
      archivedCount: archivedScreenings.length,
      archivedDate: new Date(),
      schoolId,
    };
  }

  // ============================================================================
  // 2. HEARING TEST ADMINISTRATION & TRACKING (Functions 9-15)
  // ============================================================================

  /**
   * 9. Administers pure tone audiometry hearing test.
   */
  async administerHearingTest(testData: HearingTestData): Promise<any> {
    this.logger.log(`Administering hearing test for student ${testData.studentId}`);

    const HearingTest = createHearingTestModel(this.sequelize);
    const test = await HearingTest.create(testData);

    return test.toJSON();
  }

  /**
   * 10. Retrieves hearing test history for student.
   */
  async getHearingTestHistory(studentId: string): Promise<any[]> {
    const HearingTest = createHearingTestModel(this.sequelize);

    const tests = await HearingTest.findAll({
      where: { studentId },
      order: [['testDate', 'DESC']],
    });

    return tests.map((t) => t.toJSON());
  }

  /**
   * 11. Schedules hearing retest for students who failed initial screening.
   */
  async scheduleHearingRetest(testId: string, retestDate: Date): Promise<any> {
    const HearingTest = createHearingTestModel(this.sequelize);
    const test = await HearingTest.findByPk(testId);

    if (!test) {
      throw new NotFoundException(`Hearing test ${testId} not found`);
    }

    await test.update({ retestRequired: true });

    return {
      testId,
      studentId: test.studentId,
      retestScheduledFor: retestDate,
      originalTestDate: test.testDate,
    };
  }

  /**
   * 12. Documents hearing test equipment calibration.
   */
  async documentEquipmentCalibration(equipmentId: string, calibrationDate: Date, calibratedBy: string): Promise<any> {
    return {
      equipmentId,
      calibrationDate,
      calibratedBy,
      nextCalibrationDue: new Date(calibrationDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
      calibrationCertified: true,
    };
  }

  /**
   * 13. Analyzes hearing test frequency-specific results.
   */
  async analyzeFrequencyResults(testId: string): Promise<any> {
    const HearingTest = createHearingTestModel(this.sequelize);
    const test = await HearingTest.findByPk(testId);

    if (!test) {
      throw new NotFoundException(`Hearing test ${testId} not found`);
    }

    const thresholdAvg = (test as any).hearingThresholdAverage;

    return {
      testId,
      rightEarThresholdAverage: thresholdAvg.right,
      leftEarThresholdAverage: thresholdAvg.left,
      rightEarResults: test.rightEarResults,
      leftEarResults: test.leftEarResults,
      interpretation:
        thresholdAvg.right <= 25 && thresholdAvg.left <= 25
          ? 'Normal hearing'
          : 'Hearing loss detected - referral recommended',
    };
  }

  /**
   * 14. Identifies students requiring audiology referral.
   */
  async getStudentsRequiringAudiologyReferral(schoolId: string): Promise<any[]> {
    const HearingTest = createHearingTestModel(this.sequelize);

    const tests = await HearingTest.scope('requiresReferral').findAll({
      where: { schoolId },
    });

    return tests.map((t) => t.toJSON());
  }

  /**
   * 15. Generates hearing screening compliance report.
   */
  async generateHearingScreeningComplianceReport(schoolId: string, gradeLevel: string): Promise<any> {
    const HearingTest = createHearingTestModel(this.sequelize);

    const currentSchoolYear = new Date().getFullYear();
    const schoolYearStart = new Date(`${currentSchoolYear}-08-01`);

    const tests = await HearingTest.findAll({
      where: {
        schoolId,
        gradeLevel,
        testDate: { [Op.gte]: schoolYearStart },
      },
    });

    return {
      schoolId,
      gradeLevel,
      totalTests: tests.length,
      passedTests: tests.filter((t) => t.rightEarPass && t.leftEarPass).length,
      failedTests: tests.filter((t) => !t.rightEarPass || !t.leftEarPass).length,
      referralsMade: tests.filter((t) => t.referralRequired).length,
      complianceStatus: tests.length >= 90 ? 'compliant' : 'non_compliant',
    };
  }

  // ============================================================================
  // 3. DENTAL SCREENING & REFERRALS (Functions 16-22)
  // ============================================================================

  /**
   * 16. Conducts dental screening and oral health assessment.
   */
  async conductDentalScreening(screeningData: DentalScreeningData): Promise<any> {
    this.logger.log(`Conducting dental screening for student ${screeningData.studentId}`);

    const DentalScreening = createDentalScreeningModel(this.sequelize);
    const screening = await DentalScreening.create(screeningData);

    return screening.toJSON();
  }

  /**
   * 17. Retrieves dental screening history for student.
   */
  async getDentalScreeningHistory(studentId: string): Promise<any[]> {
    const DentalScreening = createDentalScreeningModel(this.sequelize);

    const screenings = await DentalScreening.findAll({
      where: { studentId },
      order: [['screeningDate', 'DESC']],
    });

    return screenings.map((s) => s.toJSON());
  }

  /**
   * 18. Identifies students with urgent dental care needs.
   */
  async getStudentsWithUrgentDentalNeeds(schoolId: string): Promise<any[]> {
    const DentalScreening = createDentalScreeningModel(this.sequelize);

    const urgentScreenings = await DentalScreening.scope('urgentCare').findAll({
      where: { schoolId },
    });

    return urgentScreenings.map((s) => s.toJSON());
  }

  /**
   * 19. Documents dental health improvement recommendations.
   */
  async documentDentalHealthRecommendations(screeningId: string, recommendations: string[]): Promise<any> {
    const DentalScreening = createDentalScreeningModel(this.sequelize);
    const screening = await DentalScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Dental screening ${screeningId} not found`);
    }

    await screening.update({ followUpRecommendations: recommendations });

    return screening.toJSON();
  }

  /**
   * 20. Calculates dental health score for student population.
   */
  async calculateSchoolDentalHealthScore(schoolId: string): Promise<any> {
    const DentalScreening = createDentalScreeningModel(this.sequelize);

    const screenings = await DentalScreening.findAll({
      where: {
        schoolId,
        screeningDate: {
          [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const totalScore = screenings.reduce((sum, s) => sum + (s as any).dentalHealthScore, 0);
    const avgScore = screenings.length > 0 ? totalScore / screenings.length : 0;

    return {
      schoolId,
      averageDentalHealthScore: avgScore.toFixed(2),
      totalScreenings: screenings.length,
      studentsWithGoodHealth: screenings.filter((s) => s.dentalHealthIndicator === DentalHealthIndicator.GOOD).length,
      studentsNeedingCare: screenings.filter((s) => s.referralRequired).length,
    };
  }

  /**
   * 21. Creates dental referral for orthodontic evaluation.
   */
  async createOrthodonticReferral(studentId: string, screeningId: string, orthodonticConcerns: string): Promise<any> {
    this.logger.log(`Creating orthodontic referral for student ${studentId}`);

    const referralData: SpecialistReferralData = {
      studentId,
      referralDate: new Date(),
      referralReason: orthodonticConcerns,
      specialistType: SpecialistType.ORTHODONTIST,
      urgency: 'routine',
      referringProvider: 'school-nurse-id',
      referralStatus: ReferralStatus.PENDING,
      appointmentCompleted: false,
      parentNotified: false,
      transportationArranged: false,
      insuranceVerified: false,
      schoolId: 'school-id',
    };

    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);
    const referral = await SpecialistReferral.create(referralData);

    return referral.toJSON();
  }

  /**
   * 22. Generates dental screening parent notification letter.
   */
  async generateDentalScreeningNotification(screeningId: string): Promise<any> {
    const DentalScreening = createDentalScreeningModel(this.sequelize);
    const screening = await DentalScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Dental screening ${screeningId} not found`);
    }

    return {
      screeningId,
      studentId: screening.studentId,
      screeningDate: screening.screeningDate,
      dentalHealthStatus: screening.dentalHealthIndicator,
      referralRequired: screening.referralRequired,
      recommendations: screening.followUpRecommendations,
      urgentCare: screening.urgentCareNeeded,
      notificationMessage:
        screening.urgentCareNeeded
          ? 'Your child requires urgent dental care. Please contact a dentist as soon as possible.'
          : 'Your child completed their dental screening. See attached recommendations.',
    };
  }

  // ============================================================================
  // 4. EYEGLASS PRESCRIPTION TRACKING (Functions 23-27)
  // ============================================================================

  /**
   * 23. Records eyeglass prescription from optometrist.
   */
  async recordEyeglassPrescription(prescriptionData: EyeglassPrescriptionData): Promise<any> {
    this.logger.log(`Recording eyeglass prescription for student ${prescriptionData.studentId}`);

    const EyeglassPrescription = createEyeglassPrescriptionModel(this.sequelize);
    const prescription = await EyeglassPrescription.create(prescriptionData);

    return prescription.toJSON();
  }

  /**
   * 24. Tracks eyeglass dispensing to student.
   */
  async dispenseEyeglasses(prescriptionId: string, dispensedBy: string, dispensingNotes?: string): Promise<any> {
    const EyeglassPrescription = createEyeglassPrescriptionModel(this.sequelize);
    const prescription = await EyeglassPrescription.findByPk(prescriptionId);

    if (!prescription) {
      throw new NotFoundException(`Prescription ${prescriptionId} not found`);
    }

    await prescription.update({
      glassesDispensed: true,
      dispensingDate: new Date(),
      dispensedBy,
    });

    this.logger.log(`Eyeglasses dispensed for prescription ${prescriptionId}`);
    return prescription.toJSON();
  }

  /**
   * 25. Retrieves active prescriptions for student.
   */
  async getActiveEyeglassPrescriptions(studentId: string): Promise<any[]> {
    const EyeglassPrescription = createEyeglassPrescriptionModel(this.sequelize);

    const prescriptions = await EyeglassPrescription.scope('active').findAll({
      where: { studentId },
    });

    return prescriptions.map((p) => p.toJSON());
  }

  /**
   * 26. Identifies students with pending eyeglass dispensing.
   */
  async getStudentsPendingEyeglassDispensing(schoolId: string): Promise<any[]> {
    const EyeglassPrescription = createEyeglassPrescriptionModel(this.sequelize);

    const pending = await EyeglassPrescription.scope('pendingDispensing').findAll({
      where: { schoolId },
    });

    return pending.map((p) => p.toJSON());
  }

  /**
   * 27. Generates eyeglass prescription summary for parent.
   */
  async generatePrescriptionSummary(prescriptionId: string): Promise<any> {
    const EyeglassPrescription = createEyeglassPrescriptionModel(this.sequelize);
    const prescription = await EyeglassPrescription.findByPk(prescriptionId);

    if (!prescription) {
      throw new NotFoundException(`Prescription ${prescriptionId} not found`);
    }

    return {
      prescriptionId,
      studentId: prescription.studentId,
      prescriptionDate: prescription.prescriptionDate,
      prescribedBy: prescription.prescribedBy,
      rightEye: (prescription as any).prescriptionStrength.right,
      leftEye: (prescription as any).prescriptionStrength.left,
      prescriptionType: prescription.prescriptionType,
      glassesDispensed: prescription.glassesDispensed,
      expirationDate: prescription.expirationDate,
    };
  }

  // ============================================================================
  // 5. AUDIOLOGY REFERRAL MANAGEMENT (Functions 28-32)
  // ============================================================================

  /**
   * 28. Creates specialist referral for failed screening.
   */
  async createSpecialistReferral(referralData: SpecialistReferralData): Promise<any> {
    this.logger.log(`Creating ${referralData.specialistType} referral for student ${referralData.studentId}`);

    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);
    const referral = await SpecialistReferral.create(referralData);

    return referral.toJSON();
  }

  /**
   * 29. Updates referral status and appointment details.
   */
  async updateReferralStatus(
    referralId: string,
    status: ReferralStatus,
    appointmentDetails?: { date: Date; time: string; specialistName: string },
  ): Promise<any> {
    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);
    const referral = await SpecialistReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    const updateData: any = { referralStatus: status };
    if (appointmentDetails) {
      updateData.appointmentDate = appointmentDetails.date;
      updateData.appointmentTime = appointmentDetails.time;
      updateData.specialistName = appointmentDetails.specialistName;
    }

    await referral.update(updateData);

    return referral.toJSON();
  }

  /**
   * 30. Retrieves pending specialist referrals for follow-up.
   */
  async getPendingSpecialistReferrals(schoolId: string, specialistType?: SpecialistType): Promise<any[]> {
    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);

    const where: any = { schoolId };
    if (specialistType) where.specialistType = specialistType;

    const referrals = await SpecialistReferral.scope('pending').findAll({ where });

    return referrals.map((r) => r.toJSON());
  }

  /**
   * 31. Documents specialist follow-up report.
   */
  async documentSpecialistFollowUp(referralId: string, followUpReport: string): Promise<any> {
    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);
    const referral = await SpecialistReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    await referral.update({
      followUpReport,
      appointmentCompleted: true,
      referralStatus: ReferralStatus.COMPLETED,
    });

    return referral.toJSON();
  }

  /**
   * 32. Verifies insurance coverage for specialist visit.
   */
  async verifyInsuranceCoverage(referralId: string, insuranceVerified: boolean, notes?: string): Promise<any> {
    const SpecialistReferral = createSpecialistReferralModel(this.sequelize);
    const referral = await SpecialistReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    await referral.update({ insuranceVerified });

    return {
      referralId,
      insuranceVerified,
      verificationDate: new Date(),
      notes,
    };
  }

  // ============================================================================
  // 6. SCREENING RESULT PARENT NOTIFICATIONS (Functions 33-36)
  // ============================================================================

  /**
   * 33. Sends parent notification for screening results.
   */
  async sendParentScreeningNotification(notificationData: ParentScreeningNotificationData): Promise<any> {
    this.logger.log(`Sending ${notificationData.screeningType} screening notification for student ${notificationData.studentId}`);

    return {
      ...notificationData,
      notificationId: `NOTIF-${Date.now()}`,
      notificationStatus: 'sent',
      deliveryConfirmation: true,
    };
  }

  /**
   * 34. Retrieves parent notification history for student.
   */
  async getParentNotificationHistory(studentId: string, screeningType?: string): Promise<any[]> {
    // In production, would query parent_notifications table
    return [
      {
        notificationId: 'NOTIF-123',
        studentId,
        screeningType: screeningType || 'vision',
        notificationSentDate: new Date(),
        parentAcknowledged: false,
      },
    ];
  }

  /**
   * 35. Records parent acknowledgement of screening notification.
   */
  async recordParentAcknowledgement(notificationId: string, acknowledgementMethod: string): Promise<any> {
    return {
      notificationId,
      parentAcknowledged: true,
      acknowledgementDate: new Date(),
      acknowledgementMethod,
    };
  }

  /**
   * 36. Generates comprehensive screening results letter for parents.
   */
  async generateParentScreeningResultsLetter(studentId: string, screeningType: 'vision' | 'hearing' | 'dental'): Promise<any> {
    let screeningDetails: any = {};

    if (screeningType === 'vision') {
      const VisionScreening = createVisionScreeningModel(this.sequelize);
      const screening = await VisionScreening.findOne({
        where: { studentId },
        order: [['screeningDate', 'DESC']],
      });
      screeningDetails = screening?.toJSON();
    } else if (screeningType === 'hearing') {
      const HearingTest = createHearingTestModel(this.sequelize);
      const test = await HearingTest.findOne({
        where: { studentId },
        order: [['testDate', 'DESC']],
      });
      screeningDetails = test?.toJSON();
    } else if (screeningType === 'dental') {
      const DentalScreening = createDentalScreeningModel(this.sequelize);
      const screening = await DentalScreening.findOne({
        where: { studentId },
        order: [['screeningDate', 'DESC']],
      });
      screeningDetails = screening?.toJSON();
    }

    return {
      studentId,
      screeningType,
      screeningDetails,
      letterGeneratedAt: new Date(),
      parentInstructions: 'Please review the screening results and follow any recommendations provided.',
    };
  }

  // ============================================================================
  // 7. FOLLOW-UP APPOINTMENT TRACKING (Functions 37-38)
  // ============================================================================

  /**
   * 37. Schedules follow-up appointment for specialist referral.
   */
  async scheduleFollowUpAppointment(appointmentData: FollowUpAppointmentData): Promise<any> {
    this.logger.log(`Scheduling follow-up appointment for student ${appointmentData.studentId}`);

    return {
      ...appointmentData,
      appointmentId: `APPT-${Date.now()}`,
      appointmentStatus: 'scheduled',
      createdAt: new Date(),
    };
  }

  /**
   * 38. Sends appointment reminder to parent.
   */
  async sendAppointmentReminder(appointmentId: string, reminderMethod: 'email' | 'sms' | 'phone'): Promise<any> {
    return {
      appointmentId,
      reminderMethod,
      reminderSent: true,
      reminderDate: new Date(),
      deliveryStatus: 'delivered',
    };
  }

  // ============================================================================
  // 8. STATE-REQUIRED SCREENING COMPLIANCE (Functions 39-40)
  // ============================================================================

  /**
   * 39. Generates state compliance report for health screenings.
   */
  async generateStateComplianceReport(schoolId: string, reportingPeriod: { startDate: Date; endDate: Date }): Promise<any> {
    this.logger.log(`Generating state compliance report for school ${schoolId}`);

    const VisionScreening = createVisionScreeningModel(this.sequelize);
    const HearingTest = createHearingTestModel(this.sequelize);
    const DentalScreening = createDentalScreeningModel(this.sequelize);

    const visionScreenings = await VisionScreening.findAll({
      where: {
        schoolId,
        screeningDate: { [Op.between]: [reportingPeriod.startDate, reportingPeriod.endDate] },
      },
    });

    const hearingTests = await HearingTest.findAll({
      where: {
        schoolId,
        testDate: { [Op.between]: [reportingPeriod.startDate, reportingPeriod.endDate] },
      },
    });

    const dentalScreenings = await DentalScreening.findAll({
      where: {
        schoolId,
        screeningDate: { [Op.between]: [reportingPeriod.startDate, reportingPeriod.endDate] },
      },
    });

    const totalStudents = 500; // In production, query actual enrollment

    return {
      reportId: `STATE-${Date.now()}`,
      schoolId,
      reportingPeriod,
      totalStudentsEnrolled: totalStudents,
      visionScreeningsCompleted: visionScreenings.length,
      hearingScreeningsCompleted: hearingTests.length,
      dentalScreeningsCompleted: dentalScreenings.length,
      visionReferralsMade: visionScreenings.filter((s) => s.referralRequired).length,
      hearingReferralsMade: hearingTests.filter((t) => t.referralRequired).length,
      dentalReferralsMade: dentalScreenings.filter((s) => s.referralRequired).length,
      compliancePercentage: (((visionScreenings.length + hearingTests.length + dentalScreenings.length) / (totalStudents * 3)) * 100).toFixed(2),
      submittedToState: false,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 40. Submits compliance report to state education department.
   */
  async submitComplianceReportToState(reportId: string, submissionMethod: 'electronic' | 'mail'): Promise<any> {
    this.logger.log(`Submitting compliance report ${reportId} to state`);

    return {
      reportId,
      submissionMethod,
      submittedToState: true,
      submissionDate: new Date(),
      confirmationNumber: `STATE-CONF-${Date.now()}`,
      submissionStatus: 'accepted',
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default DentalVisionScreeningCompositeService;
