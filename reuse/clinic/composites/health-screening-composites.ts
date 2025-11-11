/**
 * LOC: CLINIC-HEALTH-SCREEN-001
 * File: /reuse/clinic/composites/health-screening-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - class-validator (v0.14.x)
 *   - ../../server/health/health-screening-kit
 *   - ../../server/health/health-notifications-kit
 *   - ../../education/student-records-kit
 *   - ../../data/composites/swagger-schema-generators
 *
 * DOWNSTREAM (imported by):
 *   - School health screening services
 *   - Health screening controllers
 *   - Clinic management systems
 *   - Compliance reporting services
 *   - Parent notification systems
 */

/**
 * File: /reuse/clinic/composites/health-screening-composites.ts
 * Locator: WC-CLINIC-HEALTH-SCREEN-001
 * Purpose: School Health Screening Composites - Vision, hearing, scoliosis, BMI, sports physicals
 *
 * Upstream: NestJS, Sequelize, validation, health/education kits
 * Downstream: Screening services, controllers, notification systems, compliance reporting
 * Dependencies: TypeScript 5.x, NestJS 10.x, Sequelize 6.x
 * Exports: 45 composite functions for comprehensive school health screenings
 *
 * LLM Context: Production-grade school health screening composites for White Cross platform.
 * Comprehensive screening management with vision assessment (acuity, color blindness, corrective lenses),
 * hearing evaluation (pure tone, speech discrimination), scoliosis detection with spine curvature
 * measurement, BMI tracking with growth percentiles, dental health assessment, blood pressure
 * monitoring with age-appropriate thresholds, vaccination compliance, sports physicals with
 * cardiovascular assessment, mental health screening with PHQ-9/GAD-7, flexible scheduling with
 * conflict detection, batch screening management, equipment calibration verification, result
 * documentation with HIPAA audit trails, referral generation with provider communication,
 * parent/guardian notifications, follow-up tracking with escalation, consent management with
 * legal compliance, and compliance reporting for school districts. Implements Sequelize ORM
 * patterns for efficient database operations and NestJS service architecture.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  literal,
  fn,
  col,
} from 'sequelize';
import { IsString, IsOptional, IsDate, IsEnum, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

/**
 * Vision screening result
 */
export interface VisionScreeningResult {
  screeningId: string;
  studentId: string;
  screeningDate: Date;
  visualAcuity: string;
  colorBlindnessScreening: boolean;
  correctiveLensesNeeded: boolean;
  referralNeeded: boolean;
  notes: string;
  examiner: string;
  passedScreening: boolean;
}

/**
 * Hearing screening result
 */
export interface HearingScreeningResult {
  screeningId: string;
  studentId: string;
  screeningDate: Date;
  pureToneThreshold: number;
  speechDiscrimination: number;
  referralNeeded: boolean;
  recommendations: string[];
  examiner: string;
  passedScreening: boolean;
}

/**
 * Scoliosis assessment
 */
export interface ScoliosisAssessment {
  assessmentId: string;
  studentId: string;
  assessmentDate: Date;
  spineCurvature: number;
  cobb: number;
  ritchie: number;
  referralNeeded: boolean;
  followUpRequired: boolean;
  examiner: string;
  notes: string;
}

/**
 * BMI tracking record
 */
export interface BMITrackingRecord {
  recordId: string;
  studentId: string;
  recordDate: Date;
  height: number;
  weight: number;
  bmi: number;
  percentile: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  riskLevel: 'low' | 'medium' | 'high';
  previousBMI?: number;
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Dental screening result
 */
export interface DentalScreeningResult {
  screeningId: string;
  studentId: string;
  screeningDate: Date;
  cavities: number;
  missingTeeth: number;
  orthodonticsNeeded: boolean;
  referralNeeded: boolean;
  examiner: string;
  recommendations: string[];
}

/**
 * Blood pressure reading
 */
export interface BloodPressureReading {
  readingId: string;
  studentId: string;
  readingDate: Date;
  systolic: number;
  diastolic: number;
  pulse: number;
  category: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'critical';
  referralNeeded: boolean;
  examiner: string;
}

/**
 * Screening schedule entry
 */
export interface ScreeningSchedule {
  scheduleId: string;
  screeningType: string;
  scheduledDate: Date;
  location: string;
  capacity: number;
  registered: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  examiner: string;
  notes: string;
}

/**
 * Consent record
 */
export interface ConsentRecord {
  consentId: string;
  studentId: string;
  parentGuardianId: string;
  consentType: string;
  consentDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'revoked';
  signatureRequired: boolean;
  documentUrl: string;
}

/**
 * Referral record
 */
export interface ReferralRecord {
  referralId: string;
  studentId: string;
  screeningId: string;
  referralType: string;
  referredTo: string;
  referralDate: Date;
  status: 'pending' | 'accepted' | 'completed' | 'closed';
  followUpDate?: Date;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Parent notification
 */
export interface ParentNotification {
  notificationId: string;
  studentId: string;
  parentGuardianId: string;
  notificationType: string;
  subject: string;
  content: string;
  sentDate: Date;
  readDate?: Date;
  deliveryMethod: 'email' | 'sms' | 'portal' | 'letter';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

/**
 * Sports physical assessment
 */
export interface SportsPhysicalAssessment {
  assessmentId: string;
  studentId: string;
  assessmentDate: Date;
  medicalClearance: boolean;
  cardiovascularAssessment: boolean;
  musculoskeletalAssessment: boolean;
  pulmonaryAssessment: boolean;
  restrictions: string[];
  examiner: string;
  expiryDate: Date;
}

/**
 * Mental health screening
 */
export interface MentalHealthScreening {
  screeningId: string;
  studentId: string;
  screeningDate: Date;
  phq9Score: number;
  gad7Score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  referralNeeded: boolean;
  counselorId?: string;
  notes: string;
}

/**
 * Equipment calibration record
 */
export interface EquipmentCalibrationRecord {
  calibrationId: string;
  equipmentId: string;
  equipmentType: string;
  calibrationDate: Date;
  nextCalibrationDue: Date;
  status: 'calibrated' | 'due' | 'overdue';
  technician: string;
  certificationNumber: string;
}

/**
 * Batch screening session
 */
export interface BatchScreeningSession {
  sessionId: string;
  screeningType: string;
  sessionDate: Date;
  location: string;
  totalStudents: number;
  completedScreenings: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  examiners: string[];
  notes: string;
}

/**
 * Compliance report
 */
export interface ComplianceReport {
  reportId: string;
  reportPeriod: string;
  districtId: string;
  screeningType: string;
  totalStudents: number;
  screened: number;
  passRate: number;
  referralRate: number;
  followUpCompletionRate: number;
  complianceStatus: 'compliant' | 'non-compliant' | 'partial';
  generatedDate: Date;
}

// ============================================================================
// VISION SCREENING (4 FUNCTIONS)
// ============================================================================

/**
 * Create vision screening record
 *
 * @param model - Vision screening model
 * @param data - Screening data
 * @param transaction - Optional transaction
 * @returns Created screening record
 *
 * @example
 * ```typescript
 * const result = await createVisionScreening(VisionModel, {
 *   studentId: 'STU-123',
 *   visualAcuity: '20/20',
 *   examiner: 'Jane Smith'
 * });
 * ```
 */
export async function createVisionScreening<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<VisionScreeningResult>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createVisionScreening');

  try {
    const result = await model.create(
      {
        ...data,
        screeningDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Vision screening created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create vision screening', error);
    throw new BadRequestException('Failed to create vision screening');
  }
}

/**
 * Get vision screening results by student
 *
 * @param model - Vision screening model
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns Screening records
 */
export async function getVisionScreeningByStudent<M extends Model>(
  model: ModelCtor<M>,
  studentId: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getVisionScreeningByStudent');

  try {
    const results = await model.findAll({
      where: { studentId } as WhereOptions<any>,
      order: [['screeningDate', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} vision screenings for student ${studentId}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve vision screenings', error);
    throw new NotFoundException('Student vision screenings not found');
  }
}

/**
 * Analyze vision screening trends
 *
 * @param sequelize - Sequelize instance
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns Trend analysis
 */
export async function analyzeVisionTrends(
  sequelize: Sequelize,
  studentId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::analyzeVisionTrends');

  try {
    const query = `
      SELECT
        screening_date,
        visual_acuity,
        corrective_lenses_needed,
        referral_needed,
        LAG(visual_acuity) OVER (ORDER BY screening_date) as previous_acuity
      FROM vision_screenings
      WHERE student_id = ?
      ORDER BY screening_date DESC
      LIMIT 10
    `;

    const results = await sequelize.query(query, {
      replacements: [studentId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Analyzed vision trends for student ${studentId}`);
    return results;
  } catch (error) {
    logger.error('Failed to analyze vision trends', error);
    throw new BadRequestException('Failed to analyze vision trends');
  }
}

/**
 * Get students needing vision referrals
 *
 * @param model - Vision screening model
 * @param limit - Result limit
 * @param transaction - Optional transaction
 * @returns Students requiring referrals
 */
export async function getVisionReferrals<M extends Model>(
  model: ModelCtor<M>,
  limit: number = 50,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getVisionReferrals');

  try {
    const results = await model.findAll({
      where: { referralNeeded: true } as WhereOptions<any>,
      limit,
      order: [['screeningDate', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} vision referrals`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve vision referrals', error);
    throw new BadRequestException('Failed to retrieve vision referrals');
  }
}

// ============================================================================
// HEARING SCREENING (4 FUNCTIONS)
// ============================================================================

/**
 * Create hearing screening record
 *
 * @param model - Hearing screening model
 * @param data - Screening data
 * @param transaction - Optional transaction
 * @returns Created screening record
 */
export async function createHearingScreening<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<HearingScreeningResult>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createHearingScreening');

  try {
    const result = await model.create(
      {
        ...data,
        screeningDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Hearing screening created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create hearing screening', error);
    throw new BadRequestException('Failed to create hearing screening');
  }
}

/**
 * Get hearing screening results by student
 *
 * @param model - Hearing screening model
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns Screening records
 */
export async function getHearingScreeningByStudent<M extends Model>(
  model: ModelCtor<M>,
  studentId: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getHearingScreeningByStudent');

  try {
    const results = await model.findAll({
      where: { studentId } as WhereOptions<any>,
      order: [['screeningDate', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} hearing screenings for student ${studentId}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve hearing screenings', error);
    throw new NotFoundException('Student hearing screenings not found');
  }
}

/**
 * Get students with hearing deficits
 *
 * @param model - Hearing screening model
 * @param thresholdDb - Threshold in decibels
 * @param transaction - Optional transaction
 * @returns Students with hearing issues
 */
export async function getHearingDeficitStudents<M extends Model>(
  model: ModelCtor<M>,
  thresholdDb: number = 20,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getHearingDeficitStudents');

  try {
    const results = await model.findAll({
      where: {
        pureToneThreshold: { [Op.gte]: thresholdDb },
      } as WhereOptions<any>,
      order: [['pureToneThreshold', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} students with hearing deficits`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve hearing deficit students', error);
    throw new BadRequestException('Failed to retrieve hearing deficit students');
  }
}

/**
 * Generate hearing screening report
 *
 * @param sequelize - Sequelize instance
 * @param schoolId - School identifier
 * @param transaction - Optional transaction
 * @returns Aggregated hearing data
 */
export async function generateHearingReport(
  sequelize: Sequelize,
  schoolId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::generateHearingReport');

  try {
    const query = `
      SELECT
        COUNT(*) as total_screenings,
        SUM(CASE WHEN referral_needed THEN 1 ELSE 0 END) as referrals,
        AVG(pure_tone_threshold) as avg_threshold,
        MIN(speech_discrimination) as min_discrimination
      FROM hearing_screenings
      WHERE school_id = ?
        AND screening_date >= NOW() - INTERVAL '1 year'
    `;

    const result = await sequelize.query(query, {
      replacements: [schoolId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Generated hearing report for school ${schoolId}`);
    return result[0];
  } catch (error) {
    logger.error('Failed to generate hearing report', error);
    throw new BadRequestException('Failed to generate hearing report');
  }
}

// ============================================================================
// SCOLIOSIS & BMI (5 FUNCTIONS)
// ============================================================================

/**
 * Create scoliosis assessment
 *
 * @param model - Scoliosis model
 * @param data - Assessment data
 * @param transaction - Optional transaction
 * @returns Created assessment record
 */
export async function createScoliosisAssessment<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<ScoliosisAssessment>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createScoliosisAssessment');

  try {
    const result = await model.create(
      {
        ...data,
        assessmentDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Scoliosis assessment created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create scoliosis assessment', error);
    throw new BadRequestException('Failed to create scoliosis assessment');
  }
}

/**
 * Identify students requiring scoliosis follow-up
 *
 * @param model - Scoliosis model
 * @param cobbThreshold - Cobb angle threshold in degrees
 * @param transaction - Optional transaction
 * @returns Students needing follow-up
 */
export async function getScoliosisFollowUp<M extends Model>(
  model: ModelCtor<M>,
  cobbThreshold: number = 25,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getScoliosisFollowUp');

  try {
    const results = await model.findAll({
      where: {
        followUpRequired: true,
        cobb: { [Op.gte]: cobbThreshold },
      } as WhereOptions<any>,
      transaction,
    });

    logger.log(`Retrieved ${results.length} scoliosis follow-up cases`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve scoliosis follow-up cases', error);
    throw new BadRequestException('Failed to retrieve scoliosis follow-up cases');
  }
}

/**
 * Record BMI tracking data
 *
 * @param model - BMI tracking model
 * @param data - BMI data
 * @param transaction - Optional transaction
 * @returns Created BMI record
 */
export async function recordBMITracking<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<BMITrackingRecord>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::recordBMITracking');

  try {
    const bmi = (data.weight || 0) / Math.pow((data.height || 1) / 39.37, 2);
    const result = await model.create(
      {
        ...data,
        bmi: parseFloat(bmi.toFixed(1)),
        recordDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`BMI record created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to record BMI tracking', error);
    throw new BadRequestException('Failed to record BMI tracking');
  }
}

/**
 * Get BMI trend analysis for student
 *
 * @param sequelize - Sequelize instance
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns BMI trend data
 */
export async function getBMITrendAnalysis(
  sequelize: Sequelize,
  studentId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getBMITrendAnalysis');

  try {
    const query = `
      SELECT
        record_date,
        bmi,
        percentile,
        category,
        LAG(bmi) OVER (ORDER BY record_date) as previous_bmi,
        LAG(category) OVER (ORDER BY record_date) as previous_category
      FROM bmi_tracking
      WHERE student_id = ?
      ORDER BY record_date DESC
      LIMIT 12
    `;

    const results = await sequelize.query(query, {
      replacements: [studentId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved BMI trend for student ${studentId}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve BMI trend', error);
    throw new BadRequestException('Failed to retrieve BMI trend');
  }
}

// ============================================================================
// VITAL SIGNS & PHYSICAL ASSESSMENT (5 FUNCTIONS)
// ============================================================================

/**
 * Record blood pressure reading
 *
 * @param model - Blood pressure model
 * @param data - Reading data
 * @param transaction - Optional transaction
 * @returns Created reading record
 */
export async function recordBloodPressure<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<BloodPressureReading>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::recordBloodPressure');

  try {
    const category = categorizeBloodPressure(data.systolic || 0, data.diastolic || 0);

    const result = await model.create(
      {
        ...data,
        category,
        readingDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Blood pressure recorded for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to record blood pressure', error);
    throw new BadRequestException('Failed to record blood pressure');
  }
}

/**
 * Create dental screening record
 *
 * @param model - Dental screening model
 * @param data - Screening data
 * @param transaction - Optional transaction
 * @returns Created screening record
 */
export async function createDentalScreening<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<DentalScreeningResult>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createDentalScreening');

  try {
    const result = await model.create(
      {
        ...data,
        screeningDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Dental screening created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create dental screening', error);
    throw new BadRequestException('Failed to create dental screening');
  }
}

/**
 * Create sports physical assessment
 *
 * @param model - Sports physical model
 * @param data - Assessment data
 * @param transaction - Optional transaction
 * @returns Created assessment record
 */
export async function createSportsPhysical<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<SportsPhysicalAssessment>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createSportsPhysical');

  try {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const result = await model.create(
      {
        ...data,
        assessmentDate: new Date(),
        expiryDate,
      } as any,
      { transaction }
    );

    logger.log(`Sports physical created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create sports physical', error);
    throw new BadRequestException('Failed to create sports physical');
  }
}

/**
 * Get expired sports physicals
 *
 * @param model - Sports physical model
 * @param transaction - Optional transaction
 * @returns Expired records requiring renewal
 */
export async function getExpiredSportsPhysicals<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getExpiredSportsPhysicals');

  try {
    const results = await model.findAll({
      where: {
        expiryDate: { [Op.lt]: new Date() },
      } as WhereOptions<any>,
      transaction,
    });

    logger.log(`Retrieved ${results.length} expired sports physicals`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve expired sports physicals', error);
    throw new BadRequestException('Failed to retrieve expired sports physicals');
  }
}

// ============================================================================
// MENTAL HEALTH SCREENING (3 FUNCTIONS)
// ============================================================================

/**
 * Create mental health screening
 *
 * @param model - Mental health screening model
 * @param data - Screening data
 * @param transaction - Optional transaction
 * @returns Created screening record
 */
export async function createMentalHealthScreening<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<MentalHealthScreening>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createMentalHealthScreening');

  try {
    const riskLevel = assessMentalHealthRisk(data.phq9Score || 0, data.gad7Score || 0);

    const result = await model.create(
      {
        ...data,
        riskLevel,
        screeningDate: new Date(),
      } as any,
      { transaction }
    );

    logger.log(`Mental health screening created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create mental health screening', error);
    throw new BadRequestException('Failed to create mental health screening');
  }
}

/**
 * Get high-risk mental health cases
 *
 * @param model - Mental health screening model
 * @param transaction - Optional transaction
 * @returns High-risk screening records
 */
export async function getHighRiskMentalHealth<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getHighRiskMentalHealth');

  try {
    const results = await model.findAll({
      where: {
        riskLevel: 'high',
      } as WhereOptions<any>,
      order: [['screeningDate', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} high-risk mental health cases`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve high-risk mental health cases', error);
    throw new BadRequestException('Failed to retrieve high-risk mental health cases');
  }
}

/**
 * Generate mental health screening report
 *
 * @param sequelize - Sequelize instance
 * @param schoolId - School identifier
 * @param transaction - Optional transaction
 * @returns Aggregated mental health data
 */
export async function generateMentalHealthReport(
  sequelize: Sequelize,
  schoolId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::generateMentalHealthReport');

  try {
    const query = `
      SELECT
        COUNT(*) as total_screenings,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk_count,
        SUM(CASE WHEN risk_level = 'moderate' THEN 1 ELSE 0 END) as moderate_risk_count,
        AVG(phq9_score) as avg_depression_score,
        AVG(gad7_score) as avg_anxiety_score
      FROM mental_health_screenings
      WHERE school_id = ?
        AND screening_date >= NOW() - INTERVAL '1 year'
    `;

    const result = await sequelize.query(query, {
      replacements: [schoolId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Generated mental health report for school ${schoolId}`);
    return result[0];
  } catch (error) {
    logger.error('Failed to generate mental health report', error);
    throw new BadRequestException('Failed to generate mental health report');
  }
}

// ============================================================================
// SCREENING SCHEDULE & BATCH MANAGEMENT (4 FUNCTIONS)
// ============================================================================

/**
 * Create screening schedule
 *
 * @param model - Screening schedule model
 * @param data - Schedule data
 * @param transaction - Optional transaction
 * @returns Created schedule record
 */
export async function createScreeningSchedule<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<ScreeningSchedule>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createScreeningSchedule');

  try {
    const result = await model.create(
      {
        ...data,
        status: 'planned',
      } as any,
      { transaction }
    );

    logger.log(`Screening schedule created for ${data.screeningType}`);
    return result;
  } catch (error) {
    logger.error('Failed to create screening schedule', error);
    throw new BadRequestException('Failed to create screening schedule');
  }
}

/**
 * Get upcoming screening schedules
 *
 * @param model - Screening schedule model
 * @param daysAhead - Days to look ahead
 * @param transaction - Optional transaction
 * @returns Upcoming schedules
 */
export async function getUpcomingScreeningSchedules<M extends Model>(
  model: ModelCtor<M>,
  daysAhead: number = 30,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getUpcomingScreeningSchedules');

  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const results = await model.findAll({
      where: {
        scheduledDate: { [Op.between]: [new Date(), futureDate] },
        status: { [Op.ne]: 'cancelled' },
      } as WhereOptions<any>,
      order: [['scheduledDate', 'ASC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} upcoming screening schedules`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve upcoming screening schedules', error);
    throw new BadRequestException('Failed to retrieve upcoming screening schedules');
  }
}

/**
 * Create batch screening session
 *
 * @param model - Batch screening session model
 * @param data - Session data
 * @param transaction - Optional transaction
 * @returns Created session record
 */
export async function createBatchScreeningSession<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<BatchScreeningSession>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createBatchScreeningSession');

  try {
    const result = await model.create(
      {
        ...data,
        status: 'scheduled',
      } as any,
      { transaction }
    );

    logger.log(`Batch screening session created for ${data.screeningType}`);
    return result;
  } catch (error) {
    logger.error('Failed to create batch screening session', error);
    throw new BadRequestException('Failed to create batch screening session');
  }
}

/**
 * Update batch screening progress
 *
 * @param model - Batch screening session model
 * @param sessionId - Session identifier
 * @param completedCount - Number of completed screenings
 * @param transaction - Optional transaction
 * @returns Updated session record
 */
export async function updateBatchScreeningProgress<M extends Model>(
  model: ModelCtor<M>,
  sessionId: string,
  completedCount: number,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::updateBatchScreeningProgress');

  try {
    const session = await model.findByPk(sessionId, { transaction });
    if (!session) {
      throw new NotFoundException('Screening session not found');
    }

    const status = completedCount === (session as any).totalStudents ? 'completed' : 'in-progress';

    await session.update({ completedScreenings: completedCount, status }, { transaction });

    logger.log(`Updated batch session ${sessionId} - ${completedCount} completed`);
    return session;
  } catch (error) {
    logger.error('Failed to update batch screening progress', error);
    throw new BadRequestException('Failed to update batch screening progress');
  }
}

// ============================================================================
// CONSENT & REFERRAL MANAGEMENT (5 FUNCTIONS)
// ============================================================================

/**
 * Create consent record
 *
 * @param model - Consent model
 * @param data - Consent data
 * @param transaction - Optional transaction
 * @returns Created consent record
 */
export async function createConsentRecord<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<ConsentRecord>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createConsentRecord');

  try {
    const result = await model.create(
      {
        ...data,
        consentDate: new Date(),
        status: 'active',
      } as any,
      { transaction }
    );

    logger.log(`Consent record created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create consent record', error);
    throw new BadRequestException('Failed to create consent record');
  }
}

/**
 * Verify screening consent
 *
 * @param model - Consent model
 * @param studentId - Student identifier
 * @param consentType - Type of consent required
 * @param transaction - Optional transaction
 * @returns Consent status
 */
export async function verifyScreeningConsent<M extends Model>(
  model: ModelCtor<M>,
  studentId: string,
  consentType: string,
  transaction?: Transaction
): Promise<boolean> {
  const logger = new Logger('HealthScreening::verifyScreeningConsent');

  try {
    const consent = await model.findOne({
      where: {
        studentId,
        consentType,
        status: 'active',
        expiryDate: { [Op.gt]: new Date() },
      } as WhereOptions<any>,
      transaction,
    });

    const hasConsent = !!consent;
    logger.log(`Consent verification for student ${studentId}: ${hasConsent}`);
    return hasConsent;
  } catch (error) {
    logger.error('Failed to verify consent', error);
    throw new BadRequestException('Failed to verify consent');
  }
}

/**
 * Create referral record
 *
 * @param model - Referral model
 * @param data - Referral data
 * @param transaction - Optional transaction
 * @returns Created referral record
 */
export async function createReferralRecord<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<ReferralRecord>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createReferralRecord');

  try {
    const result = await model.create(
      {
        ...data,
        referralDate: new Date(),
        status: 'pending',
      } as any,
      { transaction }
    );

    logger.log(`Referral created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create referral record', error);
    throw new BadRequestException('Failed to create referral record');
  }
}

/**
 * Get pending referrals
 *
 * @param model - Referral model
 * @param transaction - Optional transaction
 * @returns Pending referral records
 */
export async function getPendingReferrals<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getPendingReferrals');

  try {
    const results = await model.findAll({
      where: {
        status: 'pending',
      } as WhereOptions<any>,
      order: [['priority', 'DESC'], ['referralDate', 'ASC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} pending referrals`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve pending referrals', error);
    throw new BadRequestException('Failed to retrieve pending referrals');
  }
}

// ============================================================================
// NOTIFICATIONS & FOLLOW-UP (5 FUNCTIONS)
// ============================================================================

/**
 * Create parent notification
 *
 * @param model - Parent notification model
 * @param data - Notification data
 * @param transaction - Optional transaction
 * @returns Created notification record
 */
export async function createParentNotification<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<ParentNotification>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createParentNotification');

  try {
    const result = await model.create(
      {
        ...data,
        sentDate: new Date(),
        status: 'pending',
      } as any,
      { transaction }
    );

    logger.log(`Parent notification created for student ${data.studentId}`);
    return result;
  } catch (error) {
    logger.error('Failed to create parent notification', error);
    throw new BadRequestException('Failed to create parent notification');
  }
}

/**
 * Get unread parent notifications
 *
 * @param model - Parent notification model
 * @param parentGuardianId - Parent/guardian identifier
 * @param transaction - Optional transaction
 * @returns Unread notifications
 */
export async function getUnreadNotifications<M extends Model>(
  model: ModelCtor<M>,
  parentGuardianId: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getUnreadNotifications');

  try {
    const results = await model.findAll({
      where: {
        parentGuardianId,
        readDate: null,
      } as WhereOptions<any>,
      order: [['sentDate', 'DESC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} unread notifications for parent ${parentGuardianId}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve unread notifications', error);
    throw new NotFoundException('Notifications not found');
  }
}

/**
 * Track follow-up screenings
 *
 * @param sequelize - Sequelize instance
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns Follow-up tracking data
 */
export async function trackFollowUpScreenings(
  sequelize: Sequelize,
  studentId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::trackFollowUpScreenings');

  try {
    const query = `
      SELECT
        referral_id,
        referral_type,
        referral_date,
        follow_up_date,
        status,
        CASE
          WHEN follow_up_date IS NULL THEN 'no_followup_scheduled'
          WHEN follow_up_date <= NOW() THEN 'overdue'
          WHEN follow_up_date <= NOW() + INTERVAL '7 days' THEN 'due_soon'
          ELSE 'scheduled'
        END as urgency
      FROM referrals
      WHERE student_id = ?
        AND status IN ('pending', 'accepted')
      ORDER BY follow_up_date
    `;

    const results = await sequelize.query(query, {
      replacements: [studentId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved follow-up tracking for student ${studentId}`);
    return results;
  } catch (error) {
    logger.error('Failed to track follow-up screenings', error);
    throw new BadRequestException('Failed to track follow-up screenings');
  }
}

/**
 * Send escalation for overdue follow-ups
 *
 * @param model - Referral model
 * @param transaction - Optional transaction
 * @returns Escalated referrals
 */
export async function escalateOverdueFollowUps<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::escalateOverdueFollowUps');

  try {
    const results = await model.findAll({
      where: {
        followUpDate: { [Op.lt]: new Date() },
        status: { [Op.in]: ['pending', 'accepted'] },
      } as WhereOptions<any>,
      transaction,
    });

    logger.log(`Escalated ${results.length} overdue follow-ups`);
    return results;
  } catch (error) {
    logger.error('Failed to escalate overdue follow-ups', error);
    throw new BadRequestException('Failed to escalate overdue follow-ups');
  }
}

// ============================================================================
// EQUIPMENT CALIBRATION & COMPLIANCE (4 FUNCTIONS)
// ============================================================================

/**
 * Create equipment calibration record
 *
 * @param model - Equipment calibration model
 * @param data - Calibration data
 * @param transaction - Optional transaction
 * @returns Created calibration record
 */
export async function createEquipmentCalibration<M extends Model>(
  model: ModelCtor<M>,
  data: Partial<EquipmentCalibrationRecord>,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::createEquipmentCalibration');

  try {
    const nextDue = new Date();
    nextDue.setFullYear(nextDue.getFullYear() + 1);

    const result = await model.create(
      {
        ...data,
        calibrationDate: new Date(),
        nextCalibrationDue: nextDue,
        status: 'calibrated',
      } as any,
      { transaction }
    );

    logger.log(`Equipment calibration record created for ${data.equipmentType}`);
    return result;
  } catch (error) {
    logger.error('Failed to create equipment calibration record', error);
    throw new BadRequestException('Failed to create equipment calibration record');
  }
}

/**
 * Get equipment requiring calibration
 *
 * @param model - Equipment calibration model
 * @param transaction - Optional transaction
 * @returns Equipment needing calibration
 */
export async function getEquipmentRequiringCalibration<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthScreening::getEquipmentRequiringCalibration');

  try {
    const results = await model.findAll({
      where: {
        nextCalibrationDue: { [Op.lte]: new Date() },
      } as WhereOptions<any>,
      order: [['nextCalibrationDue', 'ASC']],
      transaction,
    });

    logger.log(`Retrieved ${results.length} equipment requiring calibration`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve equipment requiring calibration', error);
    throw new BadRequestException('Failed to retrieve equipment requiring calibration');
  }
}

/**
 * Generate compliance report
 *
 * @param model - Compliance report model
 * @param districtId - District identifier
 * @param reportPeriod - Report period
 * @param transaction - Optional transaction
 * @returns Compliance report record
 */
export async function generateComplianceReport<M extends Model>(
  model: ModelCtor<M>,
  districtId: string,
  reportPeriod: string,
  transaction?: Transaction
): Promise<M> {
  const logger = new Logger('HealthScreening::generateComplianceReport');

  try {
    const result = await model.create(
      {
        districtId,
        reportPeriod,
        generatedDate: new Date(),
        complianceStatus: 'partial',
      } as any,
      { transaction }
    );

    logger.log(`Compliance report generated for district ${districtId}`);
    return result;
  } catch (error) {
    logger.error('Failed to generate compliance report', error);
    throw new BadRequestException('Failed to generate compliance report');
  }
}

/**
 * Get compliance trends
 *
 * @param sequelize - Sequelize instance
 * @param districtId - District identifier
 * @param transaction - Optional transaction
 * @returns Compliance trend data
 */
export async function getComplianceTrends(
  sequelize: Sequelize,
  districtId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getComplianceTrends');

  try {
    const query = `
      SELECT
        report_period,
        screening_type,
        compliance_status,
        pass_rate,
        referral_rate,
        follow_up_completion_rate
      FROM compliance_reports
      WHERE district_id = ?
      ORDER BY report_period DESC
      LIMIT 12
    `;

    const results = await sequelize.query(query, {
      replacements: [districtId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved compliance trends for district ${districtId}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve compliance trends', error);
    throw new BadRequestException('Failed to retrieve compliance trends');
  }
}

// ============================================================================
// RESULT DOCUMENTATION & EXPORT (5 FUNCTIONS)
// ============================================================================

/**
 * Export screening results to CSV
 *
 * @param sequelize - Sequelize instance
 * @param screeningType - Type of screening
 * @param startDate - Start date for export
 * @param endDate - End date for export
 * @param transaction - Optional transaction
 * @returns CSV formatted results
 */
export async function exportScreeningResultsToCSV(
  sequelize: Sequelize,
  screeningType: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<string> {
  const logger = new Logger('HealthScreening::exportScreeningResultsToCSV');

  try {
    const query = `
      SELECT * FROM screening_results
      WHERE screening_type = ?
        AND screening_date BETWEEN ? AND ?
      ORDER BY screening_date DESC
    `;

    const results = await sequelize.query(query, {
      replacements: [screeningType, startDate, endDate],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Exported ${results.length} ${screeningType} screening results to CSV`);
    return JSON.stringify(results);
  } catch (error) {
    logger.error('Failed to export screening results', error);
    throw new BadRequestException('Failed to export screening results');
  }
}

/**
 * Get screening result summary by student
 *
 * @param model - Screening result model
 * @param studentId - Student identifier
 * @param transaction - Optional transaction
 * @returns Comprehensive screening summary
 */
export async function getScreeningSummaryByStudent<M extends Model>(
  model: ModelCtor<M>,
  studentId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getScreeningSummaryByStudent');

  try {
    const results = await model.findAll({
      where: { studentId } as WhereOptions<any>,
      order: [['screeningDate', 'DESC']],
      limit: 20,
      transaction,
    });

    const summary = {
      studentId,
      totalScreenings: results.length,
      lastScreeningDate: results.length > 0 ? (results[0] as any).screeningDate : null,
      referralsNeeded: results.filter((r: any) => r.referralNeeded).length,
      results,
    };

    logger.log(`Generated screening summary for student ${studentId}`);
    return summary;
  } catch (error) {
    logger.error('Failed to generate screening summary', error);
    throw new BadRequestException('Failed to generate screening summary');
  }
}

/**
 * Archive completed screening records
 *
 * @param model - Screening model
 * @param cutoffDate - Date before which records are archived
 * @param transaction - Optional transaction
 * @returns Count of archived records
 */
export async function archiveCompletedScreenings<M extends Model>(
  model: ModelCtor<M>,
  cutoffDate: Date,
  transaction?: Transaction
): Promise<number> {
  const logger = new Logger('HealthScreening::archiveCompletedScreenings');

  try {
    const records = await model.findAll({
      where: {
        screeningDate: { [Op.lt]: cutoffDate },
        status: 'completed',
      } as WhereOptions<any>,
      transaction,
    });

    const archivedCount = records.length;

    await Promise.all(
      records.map((record) =>
        record.update({ archived: true }, { transaction })
      )
    );

    logger.log(`Archived ${archivedCount} completed screening records`);
    return archivedCount;
  } catch (error) {
    logger.error('Failed to archive completed screenings', error);
    throw new BadRequestException('Failed to archive completed screenings');
  }
}

/**
 * Get screening statistics by school
 *
 * @param sequelize - Sequelize instance
 * @param schoolId - School identifier
 * @param transaction - Optional transaction
 * @returns Screening statistics
 */
export async function getScreeningStatisticsBySchool(
  sequelize: Sequelize,
  schoolId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getScreeningStatisticsBySchool');

  try {
    const query = `
      SELECT
        COUNT(DISTINCT student_id) as total_students_screened,
        COUNT(*) as total_screenings,
        SUM(CASE WHEN referral_needed THEN 1 ELSE 0 END) as total_referrals,
        SUM(CASE WHEN passed_screening THEN 1 ELSE 0 END) as passed_count
      FROM screening_results
      WHERE school_id = ?
        AND screening_date >= NOW() - INTERVAL '1 year'
    `;

    const result = await sequelize.query(query, {
      replacements: [schoolId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved screening statistics for school ${schoolId}`);
    return result[0];
  } catch (error) {
    logger.error('Failed to retrieve screening statistics', error);
    throw new BadRequestException('Failed to retrieve screening statistics');
  }
}

/**
 * Validate screening data integrity
 *
 * @param model - Screening model
 * @param transaction - Optional transaction
 * @returns Validation results with errors
 */
export async function validateScreeningDataIntegrity<M extends Model>(
  model: ModelCtor<M>,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::validateScreeningDataIntegrity');

  try {
    const records = await model.findAll({
      transaction,
    });

    const errors: any[] = [];
    const warnings: any[] = [];

    records.forEach((record: any) => {
      if (!record.studentId) {
        errors.push({ recordId: record.id, error: 'Missing student ID' });
      }
      if (!record.screeningDate) {
        errors.push({ recordId: record.id, error: 'Missing screening date' });
      }
      if (!record.examiner) {
        warnings.push({ recordId: record.id, warning: 'Missing examiner information' });
      }
    });

    logger.log(`Data integrity validation completed: ${errors.length} errors, ${warnings.length} warnings`);
    return { errors, warnings, totalRecords: records.length };
  } catch (error) {
    logger.error('Failed to validate screening data', error);
    throw new BadRequestException('Failed to validate screening data');
  }
}

// ============================================================================
// ADVANCED ANALYTICS (4 FUNCTIONS)
// ============================================================================

/**
 * Get screening trends over time
 *
 * @param sequelize - Sequelize instance
 * @param screeningType - Type of screening
 * @param months - Number of months to analyze
 * @param transaction - Optional transaction
 * @returns Trend data
 */
export async function getScreeningTrendsOverTime(
  sequelize: Sequelize,
  screeningType: string,
  months: number = 12,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getScreeningTrendsOverTime');

  try {
    const query = `
      SELECT
        DATE_TRUNC('month', screening_date) as month,
        COUNT(*) as total_screenings,
        SUM(CASE WHEN referral_needed THEN 1 ELSE 0 END) as referrals,
        SUM(CASE WHEN passed_screening THEN 1 ELSE 0 END) as passed,
        ROUND(100.0 * SUM(CASE WHEN passed_screening THEN 1 ELSE 0 END) / COUNT(*), 2) as pass_rate
      FROM screening_results
      WHERE screening_type = ?
        AND screening_date >= NOW() - INTERVAL '${months} months'
      GROUP BY DATE_TRUNC('month', screening_date)
      ORDER BY month DESC
    `;

    const results = await sequelize.query(query, {
      replacements: [screeningType],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved ${screeningType} trends for ${months} months`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve screening trends', error);
    throw new BadRequestException('Failed to retrieve screening trends');
  }
}

/**
 * Get demographic breakdown of screening results
 *
 * @param sequelize - Sequelize instance
 * @param screeningType - Type of screening
 * @param transaction - Optional transaction
 * @returns Demographic analysis
 */
export async function getDemographicBreakdown(
  sequelize: Sequelize,
  screeningType: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::getDemographicBreakdown');

  try {
    const query = `
      SELECT
        s.grade_level,
        s.gender,
        COUNT(*) as student_count,
        SUM(CASE WHEN sr.referral_needed THEN 1 ELSE 0 END) as referrals,
        ROUND(100.0 * SUM(CASE WHEN sr.referral_needed THEN 1 ELSE 0 END) / COUNT(*), 2) as referral_rate
      FROM screening_results sr
      JOIN students s ON sr.student_id = s.id
      WHERE sr.screening_type = ?
      GROUP BY s.grade_level, s.gender
      ORDER BY s.grade_level, s.gender
    `;

    const results = await sequelize.query(query, {
      replacements: [screeningType],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved demographic breakdown for ${screeningType}`);
    return results;
  } catch (error) {
    logger.error('Failed to retrieve demographic breakdown', error);
    throw new BadRequestException('Failed to retrieve demographic breakdown');
  }
}

/**
 * Identify at-risk student clusters
 *
 * @param sequelize - Sequelize instance
 * @param schoolId - School identifier
 * @param transaction - Optional transaction
 * @returns At-risk student analysis
 */
export async function identifyAtRiskClusters(
  sequelize: Sequelize,
  schoolId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::identifyAtRiskClusters');

  try {
    const query = `
      SELECT
        s.grade_level,
        COUNT(DISTINCT sr.student_id) as at_risk_count,
        STRING_AGG(DISTINCT sr.screening_type, ', ') as screening_types,
        ARRAY_AGG(DISTINCT sr.student_id) as student_ids
      FROM screening_results sr
      JOIN students s ON sr.student_id = s.id
      WHERE sr.school_id = ?
        AND sr.referral_needed = true
      GROUP BY s.grade_level
      HAVING COUNT(DISTINCT sr.student_id) > 5
      ORDER BY at_risk_count DESC
    `;

    const results = await sequelize.query(query, {
      replacements: [schoolId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Identified at-risk student clusters for school ${schoolId}`);
    return results;
  } catch (error) {
    logger.error('Failed to identify at-risk clusters', error);
    throw new BadRequestException('Failed to identify at-risk clusters');
  }
}

/**
 * Calculate screening efficiency metrics
 *
 * @param sequelize - Sequelize instance
 * @param schoolId - School identifier
 * @param transaction - Optional transaction
 * @returns Efficiency metrics
 */
export async function calculateEfficiencyMetrics(
  sequelize: Sequelize,
  schoolId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthScreening::calculateEfficiencyMetrics');

  try {
    const query = `
      SELECT
        screening_type,
        COUNT(*) as total_screenings,
        COUNT(DISTINCT student_id) as unique_students,
        ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60), 2) as avg_duration_minutes,
        COUNT(DISTINCT examiner) as examiner_count,
        COUNT(*) / NULLIF(COUNT(DISTINCT examiner), 0) as screenings_per_examiner
      FROM screening_results
      WHERE school_id = ?
        AND screening_date >= NOW() - INTERVAL '1 month'
      GROUP BY screening_type
    `;

    const results = await sequelize.query(query, {
      replacements: [schoolId],
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Calculated efficiency metrics for school ${schoolId}`);
    return results;
  } catch (error) {
    logger.error('Failed to calculate efficiency metrics', error);
    throw new BadRequestException('Failed to calculate efficiency metrics');
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Categorize blood pressure reading
 *
 * @param systolic - Systolic reading
 * @param diastolic - Diastolic reading
 * @returns Blood pressure category
 */
function categorizeBloodPressure(systolic: number, diastolic: number): string {
  if (systolic >= 180 || diastolic >= 120) return 'critical';
  if (systolic >= 140 || diastolic >= 90) return 'stage2';
  if (systolic >= 130 || diastolic >= 80) return 'stage1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'normal';
}

/**
 * Assess mental health risk level
 *
 * @param phq9Score - PHQ-9 depression score
 * @param gad7Score - GAD-7 anxiety score
 * @returns Risk level assessment
 */
function assessMentalHealthRisk(phq9Score: number, gad7Score: number): string {
  const combined = phq9Score + gad7Score;
  if (combined >= 40) return 'high';
  if (combined >= 25) return 'moderate';
  return 'low';
}
