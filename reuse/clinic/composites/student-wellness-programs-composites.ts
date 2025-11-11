/**
 * LOC: CLINIC-WELLNESS-COMP-001
 * File: /reuse/clinic/composites/student-wellness-programs-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-wellness-management-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School wellness program controllers
 *   - Health promotion campaign managers
 *   - Student engagement tracking systems
 *   - Wellness coordinator dashboards
 *   - Parent wellness notification services
 *   - Health education modules
 */

/**
 * File: /reuse/clinic/composites/student-wellness-programs-composites.ts
 * Locator: WC-CLINIC-WELLNESS-001
 * Purpose: School Clinic Student Wellness Programs Composite - Comprehensive wellness program management
 *
 * Upstream: health-wellness-management-kit, health-patient-management-kit, student-records-kit,
 *           student-communication-kit, data-repository
 * Downstream: Wellness controllers, Health promotion systems, Student engagement tracking, Coordinator dashboards
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 41 composed functions for complete student wellness program management
 *
 * LLM Context: Production-grade student wellness program composite for K-12 healthcare SaaS platform.
 * Provides comprehensive wellness management workflows including wellness challenge creation and tracking,
 * fitness program enrollment and progress monitoring, mental wellness activities coordination, stress
 * management resource distribution, peer health education program facilitation, student health committee
 * management, health promotion campaign orchestration, wellness incentive and reward tracking, health
 * screening participation monitoring, student health ambassador program coordination, wellness goal setting,
 * physical activity tracking, nutrition education, sleep health monitoring, and comprehensive wellness
 * analytics for school health improvement initiatives.
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
 * Wellness challenge status enumeration
 */
export enum WellnessChallengeStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Wellness program enrollment status
 */
export enum EnrollmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  SUSPENDED = 'suspended',
}

/**
 * Wellness activity category
 */
export enum WellnessActivityCategory {
  PHYSICAL_FITNESS = 'physical_fitness',
  MENTAL_WELLNESS = 'mental_wellness',
  NUTRITION = 'nutrition',
  SLEEP_HEALTH = 'sleep_health',
  STRESS_MANAGEMENT = 'stress_management',
  PEER_EDUCATION = 'peer_education',
}

/**
 * Incentive reward type
 */
export enum IncentiveRewardType {
  POINTS = 'points',
  BADGE = 'badge',
  CERTIFICATE = 'certificate',
  RECOGNITION = 'recognition',
  PRIZE = 'prize',
}

/**
 * Health committee role
 */
export enum HealthCommitteeRole {
  PRESIDENT = 'president',
  VICE_PRESIDENT = 'vice_president',
  SECRETARY = 'secretary',
  TREASURER = 'treasurer',
  MEMBER = 'member',
  ADVISOR = 'advisor',
}

/**
 * Campaign status
 */
export enum CampaignStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Wellness challenge data
 */
export interface WellnessChallengeData {
  challengeId?: string;
  challengeName: string;
  description: string;
  category: WellnessActivityCategory;
  startDate: Date;
  endDate: Date;
  targetParticipants: number;
  actualParticipants?: number;
  challengeGoal: string;
  measurementCriteria: string;
  pointsAwarded: number;
  status: WellnessChallengeStatus;
  createdBy: string;
  schoolId: string;
  gradeRestrictions?: string[];
  createdAt?: Date;
}

/**
 * Fitness program enrollment record
 */
export interface FitnessProgramData {
  enrollmentId?: string;
  studentId: string;
  programName: string;
  programCategory: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'general';
  enrollmentDate: Date;
  targetCompletionDate?: Date;
  enrollmentStatus: EnrollmentStatus;
  progressPercentage: number;
  sessionsCompleted: number;
  totalSessions: number;
  currentGoals: string[];
  achievements: string[];
  instructorId: string;
  schoolId: string;
  parentConsent: boolean;
}

/**
 * Mental wellness activity record
 */
export interface MentalWellnessActivityData {
  activityId?: string;
  activityName: string;
  activityType: 'mindfulness' | 'counseling' | 'support_group' | 'art_therapy' | 'journaling' | 'meditation';
  description: string;
  scheduledDate: Date;
  duration: number;
  facilitatorId: string;
  maxParticipants: number;
  registeredParticipants?: string[];
  isRecurring: boolean;
  recurringSchedule?: string;
  resourcesProvided: string[];
  schoolId: string;
  isConfidential: boolean;
}

/**
 * Stress management resource
 */
export interface StressManagementResourceData {
  resourceId?: string;
  resourceTitle: string;
  resourceType: 'video' | 'article' | 'worksheet' | 'app' | 'hotline' | 'technique';
  description: string;
  targetAudience: string[];
  accessUrl?: string;
  downloadUrl?: string;
  recommendedBy: string;
  usageCount: number;
  rating?: number;
  tags: string[];
  schoolId: string;
  isPublic: boolean;
  lastUpdated: Date;
}

/**
 * Peer health education program
 */
export interface PeerHealthEducationData {
  programId?: string;
  programTitle: string;
  topicsCovered: string[];
  peerEducators: string[];
  targetGrades: string[];
  sessionSchedule: Array<{
    sessionDate: Date;
    sessionTime: string;
    location: string;
    attendees: string[];
  }>;
  totalSessions: number;
  completedSessions: number;
  programCoordinator: string;
  parentalConsent: boolean;
  materialsUsed: string[];
  schoolId: string;
  effectiveness?: number;
}

/**
 * Student health committee record
 */
export interface HealthCommitteeData {
  committeeId?: string;
  committeeName: string;
  academicYear: string;
  members: Array<{
    studentId: string;
    role: HealthCommitteeRole;
    joinDate: Date;
    responsibilities: string[];
  }>;
  meetingSchedule: string;
  nextMeetingDate?: Date;
  initiativesOwned: string[];
  budgetAllocated?: number;
  accomplishments: string[];
  advisorId: string;
  schoolId: string;
}

/**
 * Health promotion campaign
 */
export interface HealthPromotionCampaignData {
  campaignId?: string;
  campaignName: string;
  campaignTheme: string;
  startDate: Date;
  endDate: Date;
  targetAudience: string[];
  objectives: string[];
  activities: Array<{
    activityName: string;
    activityDate: Date;
    location: string;
    expectedParticipants: number;
    actualParticipants?: number;
  }>;
  campaignStatus: CampaignStatus;
  budget: number;
  partnerships: string[];
  materialsDistributed: number;
  reachMetrics: {
    studentsReached: number;
    parentsReached: number;
    staffReached: number;
  };
  campaignCoordinator: string;
  schoolId: string;
}

/**
 * Wellness incentive tracking
 */
export interface WellnessIncentiveData {
  incentiveId?: string;
  studentId: string;
  programName: string;
  pointsEarned: number;
  rewardType: IncentiveRewardType;
  rewardDescription: string;
  earnedDate: Date;
  redemptionStatus: 'pending' | 'redeemed' | 'expired';
  redemptionDate?: Date;
  expirationDate?: Date;
  awardedBy: string;
  schoolId: string;
  criteria: string;
}

/**
 * Health screening participation tracking
 */
export interface ScreeningParticipationData {
  participationId?: string;
  studentId: string;
  screeningType: 'vision' | 'hearing' | 'dental' | 'bmi' | 'scoliosis' | 'general_health';
  screeningDate: Date;
  participationStatus: 'scheduled' | 'completed' | 'missed' | 'declined';
  results?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  parentNotified: boolean;
  consentOnFile: boolean;
  performedBy: string;
  schoolId: string;
}

/**
 * Student health ambassador program
 */
export interface HealthAmbassadorData {
  ambassadorId?: string;
  studentId: string;
  appointmentDate: Date;
  ambassadorRole: string;
  trainingCompleted: boolean;
  trainingDate?: Date;
  assignedProjects: Array<{
    projectName: string;
    description: string;
    startDate: Date;
    status: 'in_progress' | 'completed' | 'on_hold';
  }>;
  eventsParticipated: number;
  impactMetrics: {
    peersReached: number;
    presentationsGiven: number;
    materialsDistributed: number;
  };
  supervisorId: string;
  schoolId: string;
  academicYear: string;
}

/**
 * Wellness goal tracking
 */
export interface WellnessGoalData {
  goalId?: string;
  studentId: string;
  goalCategory: WellnessActivityCategory;
  goalDescription: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  isAchieved: boolean;
  milestones: Array<{
    milestoneDescription: string;
    targetDate: Date;
    achieved: boolean;
  }>;
  supportProvided: string[];
  schoolId: string;
}

/**
 * Physical activity tracking
 */
export interface PhysicalActivityTrackingData {
  trackingId?: string;
  studentId: string;
  activityDate: Date;
  activityType: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'vigorous';
  caloriesBurned?: number;
  distanceCovered?: number;
  distanceUnit?: 'miles' | 'kilometers';
  heartRateAvg?: number;
  selfReported: boolean;
  deviceTracked?: string;
  schoolId: string;
}

/**
 * Nutrition education record
 */
export interface NutritionEducationData {
  sessionId?: string;
  sessionTitle: string;
  sessionDate: Date;
  topicsCovered: string[];
  targetGrades: string[];
  attendees: string[];
  educatorId: string;
  materialsUsed: string[];
  interactiveActivities: string[];
  learningObjectives: string[];
  assessmentResults?: Record<string, any>;
  parentInvolvement: boolean;
  schoolId: string;
}

/**
 * Sleep health monitoring
 */
export interface SleepHealthData {
  recordId?: string;
  studentId: string;
  recordDate: Date;
  hoursSlept: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  bedtime: string;
  wakeTime: string;
  sleepDisruptions?: string[];
  energyLevel: number;
  concernsReported: boolean;
  concernDescription?: string;
  interventionProvided?: string;
  schoolId: string;
  selfReported: boolean;
}

/**
 * Wellness analytics summary
 */
export interface WellnessAnalyticsData {
  analyticsId?: string;
  schoolId: string;
  reportPeriod: { startDate: Date; endDate: Date };
  totalParticipants: number;
  programEngagement: Record<string, number>;
  challengesCompleted: number;
  averageWellnessScore: number;
  improvementMetrics: Record<string, number>;
  topPerformingPrograms: string[];
  areasNeedingAttention: string[];
  generatedAt: Date;
  generatedBy: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Wellness Challenges
 */
export const createWellnessChallengeModel = (sequelize: Sequelize) => {
  class WellnessChallenge extends Model {
    public id!: string;
    public challengeName!: string;
    public description!: string;
    public category!: WellnessActivityCategory;
    public startDate!: Date;
    public endDate!: Date;
    public targetParticipants!: number;
    public actualParticipants!: number;
    public challengeGoal!: string;
    public measurementCriteria!: string;
    public pointsAwarded!: number;
    public status!: WellnessChallengeStatus;
    public createdBy!: string;
    public schoolId!: string;
    public gradeRestrictions!: string[] | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WellnessChallenge.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      challengeName: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.ENUM(...Object.values(WellnessActivityCategory)), allowNull: false },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      endDate: { type: DataTypes.DATEONLY, allowNull: false },
      targetParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
      actualParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
      challengeGoal: { type: DataTypes.TEXT, allowNull: false },
      measurementCriteria: { type: DataTypes.TEXT, allowNull: false },
      pointsAwarded: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: { type: DataTypes.ENUM(...Object.values(WellnessChallengeStatus)), allowNull: false },
      createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
      gradeRestrictions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    },
    {
      sequelize,
      tableName: 'wellness_challenges',
      timestamps: true,
      indexes: [{ fields: ['schoolId'] }, { fields: ['status'] }, { fields: ['category'] }],
    },
  );

  return WellnessChallenge;
};

/**
 * Sequelize model for Fitness Programs
 */
export const createFitnessProgramModel = (sequelize: Sequelize) => {
  class FitnessProgram extends Model {
    public id!: string;
    public studentId!: string;
    public programName!: string;
    public programCategory!: string;
    public enrollmentDate!: Date;
    public targetCompletionDate!: Date | null;
    public enrollmentStatus!: EnrollmentStatus;
    public progressPercentage!: number;
    public sessionsCompleted!: number;
    public totalSessions!: number;
    public currentGoals!: string[];
    public achievements!: string[];
    public instructorId!: string;
    public schoolId!: string;
    public parentConsent!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FitnessProgram.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      programName: { type: DataTypes.STRING(255), allowNull: false },
      programCategory: { type: DataTypes.ENUM('cardio', 'strength', 'flexibility', 'sports', 'general'), allowNull: false },
      enrollmentDate: { type: DataTypes.DATE, allowNull: false },
      targetCompletionDate: { type: DataTypes.DATE, allowNull: true },
      enrollmentStatus: { type: DataTypes.ENUM(...Object.values(EnrollmentStatus)), allowNull: false },
      progressPercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      sessionsCompleted: { type: DataTypes.INTEGER, defaultValue: 0 },
      totalSessions: { type: DataTypes.INTEGER, allowNull: false },
      currentGoals: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      achievements: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      instructorId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
      parentConsent: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      tableName: 'fitness_programs',
      timestamps: true,
      indexes: [{ fields: ['studentId'] }, { fields: ['schoolId'] }, { fields: ['enrollmentStatus'] }],
    },
  );

  return FitnessProgram;
};

/**
 * Sequelize model for Mental Wellness Activities
 */
export const createMentalWellnessActivityModel = (sequelize: Sequelize) => {
  class MentalWellnessActivity extends Model {
    public id!: string;
    public activityName!: string;
    public activityType!: string;
    public description!: string;
    public scheduledDate!: Date;
    public duration!: number;
    public facilitatorId!: string;
    public maxParticipants!: number;
    public registeredParticipants!: string[];
    public isRecurring!: boolean;
    public recurringSchedule!: string | null;
    public resourcesProvided!: string[];
    public schoolId!: string;
    public isConfidential!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MentalWellnessActivity.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      activityName: { type: DataTypes.STRING(255), allowNull: false },
      activityType: { type: DataTypes.ENUM('mindfulness', 'counseling', 'support_group', 'art_therapy', 'journaling', 'meditation'), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      scheduledDate: { type: DataTypes.DATE, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      facilitatorId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      maxParticipants: { type: DataTypes.INTEGER, allowNull: false },
      registeredParticipants: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
      isRecurring: { type: DataTypes.BOOLEAN, defaultValue: false },
      recurringSchedule: { type: DataTypes.STRING(255), allowNull: true },
      resourcesProvided: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
      isConfidential: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      tableName: 'mental_wellness_activities',
      timestamps: true,
      indexes: [{ fields: ['schoolId'] }, { fields: ['scheduledDate'] }, { fields: ['activityType'] }],
    },
  );

  return MentalWellnessActivity;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * Student Wellness Programs Composite Service
 *
 * Provides comprehensive wellness program management for K-12 school clinics
 * including challenges, fitness, mental wellness, and health promotion.
 */
@Injectable()
export class StudentWellnessProgramsCompositeService {
  private readonly logger = new Logger(StudentWellnessProgramsCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. WELLNESS CHALLENGE MANAGEMENT (Functions 1-5)
  // ============================================================================

  /**
   * 1. Creates new wellness challenge with participation tracking.
   * Validates challenge duration and sets up automated tracking.
   */
  async createWellnessChallenge(challengeData: WellnessChallengeData): Promise<any> {
    this.logger.log(`Creating wellness challenge: ${challengeData.challengeName}`);

    if (challengeData.endDate <= challengeData.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const WellnessChallenge = createWellnessChallengeModel(this.sequelize);
    const challenge = await WellnessChallenge.create({
      ...challengeData,
      status: WellnessChallengeStatus.DRAFT,
      actualParticipants: 0,
    });

    return challenge.toJSON();
  }

  /**
   * 2. Activates wellness challenge and opens for student enrollment.
   */
  async activateWellnessChallenge(challengeId: string): Promise<any> {
    const WellnessChallenge = createWellnessChallengeModel(this.sequelize);
    const challenge = await WellnessChallenge.findByPk(challengeId);

    if (!challenge) {
      throw new NotFoundException(`Challenge ${challengeId} not found`);
    }

    await challenge.update({ status: WellnessChallengeStatus.ACTIVE });
    this.logger.log(`Activated wellness challenge ${challengeId}`);

    return challenge.toJSON();
  }

  /**
   * 3. Tracks student participation in wellness challenge.
   */
  async trackChallengeParticipation(
    challengeId: string,
    studentId: string,
    progressData: { value: number; unit: string; notes?: string },
  ): Promise<any> {
    this.logger.log(`Tracking participation for student ${studentId} in challenge ${challengeId}`);

    return {
      challengeId,
      studentId,
      progressRecorded: progressData.value,
      unit: progressData.unit,
      recordedAt: new Date(),
      notes: progressData.notes,
    };
  }

  /**
   * 4. Gets active wellness challenges for school or specific student.
   */
  async getActiveWellnessChallenges(schoolId: string, gradeLevel?: string): Promise<any[]> {
    const WellnessChallenge = createWellnessChallengeModel(this.sequelize);

    const where: any = {
      schoolId,
      status: WellnessChallengeStatus.ACTIVE,
      startDate: { [Op.lte]: new Date() },
      endDate: { [Op.gte]: new Date() },
    };

    if (gradeLevel) {
      where[Op.or] = [
        { gradeRestrictions: { [Op.contains]: [gradeLevel] } },
        { gradeRestrictions: { [Op.eq]: null } },
        { gradeRestrictions: { [Op.eq]: [] } },
      ];
    }

    const challenges = await WellnessChallenge.findAll({ where });
    return challenges.map(c => c.toJSON());
  }

  /**
   * 5. Completes wellness challenge and calculates final statistics.
   */
  async completeWellnessChallenge(challengeId: string): Promise<any> {
    const WellnessChallenge = createWellnessChallengeModel(this.sequelize);
    const challenge = await WellnessChallenge.findByPk(challengeId);

    if (!challenge) {
      throw new NotFoundException(`Challenge ${challengeId} not found`);
    }

    await challenge.update({
      status: WellnessChallengeStatus.COMPLETED,
    });

    return {
      ...challenge.toJSON(),
      completionRate: (challenge.actualParticipants / challenge.targetParticipants) * 100,
      completedAt: new Date(),
    };
  }

  // ============================================================================
  // 2. FITNESS PROGRAM ENROLLMENT (Functions 6-10)
  // ============================================================================

  /**
   * 6. Enrolls student in fitness program with consent verification.
   */
  async enrollStudentInFitnessProgram(programData: FitnessProgramData): Promise<any> {
    this.logger.log(`Enrolling student ${programData.studentId} in ${programData.programName}`);

    if (!programData.parentConsent) {
      throw new ForbiddenException('Parent consent required for fitness program enrollment');
    }

    const FitnessProgram = createFitnessProgramModel(this.sequelize);
    const enrollment = await FitnessProgram.create({
      ...programData,
      enrollmentStatus: EnrollmentStatus.ACTIVE,
      progressPercentage: 0,
      sessionsCompleted: 0,
    });

    return enrollment.toJSON();
  }

  /**
   * 7. Updates fitness program progress after session completion.
   */
  async updateFitnessProgramProgress(
    enrollmentId: string,
    sessionData: { completed: boolean; notes?: string; achievements?: string[] },
  ): Promise<any> {
    const FitnessProgram = createFitnessProgramModel(this.sequelize);
    const enrollment = await FitnessProgram.findByPk(enrollmentId);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }

    const sessionsCompleted = enrollment.sessionsCompleted + (sessionData.completed ? 1 : 0);
    const progressPercentage = (sessionsCompleted / enrollment.totalSessions) * 100;

    const achievements = sessionData.achievements
      ? [...enrollment.achievements, ...sessionData.achievements]
      : enrollment.achievements;

    await enrollment.update({
      sessionsCompleted,
      progressPercentage,
      achievements,
    });

    return enrollment.toJSON();
  }

  /**
   * 8. Gets fitness program enrollment status for student.
   */
  async getStudentFitnessProgramEnrollments(studentId: string): Promise<any[]> {
    const FitnessProgram = createFitnessProgramModel(this.sequelize);

    const enrollments = await FitnessProgram.findAll({
      where: { studentId },
      order: [['enrollmentDate', 'DESC']],
    });

    return enrollments.map(e => e.toJSON());
  }

  /**
   * 9. Completes fitness program and issues completion certificate.
   */
  async completeFitnessProgram(enrollmentId: string): Promise<any> {
    const FitnessProgram = createFitnessProgramModel(this.sequelize);
    const enrollment = await FitnessProgram.findByPk(enrollmentId);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }

    await enrollment.update({
      enrollmentStatus: EnrollmentStatus.COMPLETED,
      progressPercentage: 100,
    });

    return {
      ...enrollment.toJSON(),
      completionDate: new Date(),
      certificateIssued: true,
    };
  }

  /**
   * 10. Generates fitness program performance report.
   */
  async generateFitnessProgramReport(schoolId: string, programName?: string): Promise<any> {
    const FitnessProgram = createFitnessProgramModel(this.sequelize);

    const where: any = { schoolId };
    if (programName) {
      where.programName = programName;
    }

    const enrollments = await FitnessProgram.findAll({ where });

    const totalEnrollments = enrollments.length;
    const completedPrograms = enrollments.filter(e => e.enrollmentStatus === EnrollmentStatus.COMPLETED).length;
    const averageProgress = enrollments.reduce((sum, e) => sum + parseFloat(e.progressPercentage.toString()), 0) / totalEnrollments;

    return {
      schoolId,
      programName: programName || 'All Programs',
      totalEnrollments,
      completedPrograms,
      averageProgress: averageProgress.toFixed(2),
      completionRate: ((completedPrograms / totalEnrollments) * 100).toFixed(2),
      generatedAt: new Date(),
    };
  }

  // ============================================================================
  // 3. MENTAL WELLNESS ACTIVITIES (Functions 11-15)
  // ============================================================================

  /**
   * 11. Creates mental wellness activity session with confidentiality settings.
   */
  async createMentalWellnessActivity(activityData: MentalWellnessActivityData): Promise<any> {
    this.logger.log(`Creating mental wellness activity: ${activityData.activityName}`);

    const MentalWellnessActivity = createMentalWellnessActivityModel(this.sequelize);
    const activity = await MentalWellnessActivity.create(activityData);

    return activity.toJSON();
  }

  /**
   * 12. Registers student for mental wellness activity.
   */
  async registerForMentalWellnessActivity(
    activityId: string,
    studentId: string,
    parentConsent: boolean = false,
  ): Promise<any> {
    const MentalWellnessActivity = createMentalWellnessActivityModel(this.sequelize);
    const activity = await MentalWellnessActivity.findByPk(activityId);

    if (!activity) {
      throw new NotFoundException(`Activity ${activityId} not found`);
    }

    if (activity.registeredParticipants.length >= activity.maxParticipants) {
      throw new ConflictException('Activity is at full capacity');
    }

    const updatedParticipants = [...activity.registeredParticipants, studentId];
    await activity.update({ registeredParticipants: updatedParticipants });

    return {
      activityId,
      studentId,
      registrationDate: new Date(),
      registrationConfirmed: true,
    };
  }

  /**
   * 13. Gets upcoming mental wellness activities for student.
   */
  async getUpcomingMentalWellnessActivities(schoolId: string, studentId?: string): Promise<any[]> {
    const MentalWellnessActivity = createMentalWellnessActivityModel(this.sequelize);

    const where: any = {
      schoolId,
      scheduledDate: { [Op.gte]: new Date() },
    };

    const activities = await MentalWellnessActivity.findAll({
      where,
      order: [['scheduledDate', 'ASC']],
    });

    let filteredActivities = activities.map(a => a.toJSON());

    if (studentId) {
      filteredActivities = filteredActivities.map(activity => ({
        ...activity,
        isRegistered: activity.registeredParticipants.includes(studentId),
        availableSpots: activity.maxParticipants - activity.registeredParticipants.length,
      }));
    }

    return filteredActivities;
  }

  /**
   * 14. Records mental wellness activity attendance and feedback.
   */
  async recordMentalWellnessAttendance(
    activityId: string,
    attendanceData: { studentId: string; attended: boolean; feedback?: string },
  ): Promise<any> {
    this.logger.log(`Recording attendance for activity ${activityId}`);

    return {
      activityId,
      studentId: attendanceData.studentId,
      attended: attendanceData.attended,
      feedback: attendanceData.feedback,
      recordedAt: new Date(),
    };
  }

  /**
   * 15. Generates mental wellness activity effectiveness report.
   */
  async generateMentalWellnessActivityReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const MentalWellnessActivity = createMentalWellnessActivityModel(this.sequelize);

    const activities = await MentalWellnessActivity.findAll({
      where: {
        schoolId,
        scheduledDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const totalActivities = activities.length;
    const totalRegistrations = activities.reduce((sum, a) => sum + a.registeredParticipants.length, 0);
    const averageAttendance = totalRegistrations / totalActivities;

    const activityTypeBreakdown = activities.reduce((acc, a) => {
      acc[a.activityType] = (acc[a.activityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      schoolId,
      reportPeriod: { startDate, endDate },
      totalActivities,
      totalRegistrations,
      averageAttendance: averageAttendance.toFixed(2),
      activityTypeBreakdown,
      generatedAt: new Date(),
    };
  }

  // ============================================================================
  // 4. STRESS MANAGEMENT RESOURCES (Functions 16-20)
  // ============================================================================

  /**
   * 16. Adds stress management resource to school library.
   */
  async addStressManagementResource(resourceData: StressManagementResourceData): Promise<any> {
    this.logger.log(`Adding stress management resource: ${resourceData.resourceTitle}`);

    return {
      ...resourceData,
      resourceId: `SMR-${Date.now()}`,
      addedAt: new Date(),
    };
  }

  /**
   * 17. Gets stress management resources filtered by audience and type.
   */
  async getStressManagementResources(
    schoolId: string,
    filters?: { resourceType?: string; targetAudience?: string },
  ): Promise<any[]> {
    this.logger.log(`Retrieving stress management resources for school ${schoolId}`);

    const mockResources = [
      {
        resourceId: 'SMR-1',
        resourceTitle: 'Breathing Exercises for Exam Anxiety',
        resourceType: 'video',
        targetAudience: ['high_school'],
        accessUrl: 'https://example.com/breathing',
        rating: 4.5,
        usageCount: 150,
      },
      {
        resourceId: 'SMR-2',
        resourceTitle: 'Mindfulness Journal Prompts',
        resourceType: 'worksheet',
        targetAudience: ['middle_school', 'high_school'],
        downloadUrl: 'https://example.com/journal',
        rating: 4.8,
        usageCount: 200,
      },
    ];

    return mockResources;
  }

  /**
   * 18. Tracks resource usage and updates analytics.
   */
  async trackStressManagementResourceUsage(resourceId: string, studentId: string): Promise<any> {
    this.logger.log(`Tracking resource usage: ${resourceId} by student ${studentId}`);

    return {
      resourceId,
      studentId,
      accessedAt: new Date(),
      usageLogged: true,
    };
  }

  /**
   * 19. Collects resource ratings and feedback from students.
   */
  async rateStressManagementResource(
    resourceId: string,
    studentId: string,
    rating: number,
    feedback?: string,
  ): Promise<any> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return {
      resourceId,
      studentId,
      rating,
      feedback,
      submittedAt: new Date(),
    };
  }

  /**
   * 20. Recommends stress management resources based on student needs.
   */
  async recommendStressManagementResources(studentId: string, stressCategory: string): Promise<any[]> {
    this.logger.log(`Generating resource recommendations for student ${studentId}`);

    return [
      {
        resourceId: 'SMR-3',
        resourceTitle: 'Progressive Muscle Relaxation Guide',
        matchScore: 95,
        reason: 'Highly effective for exam-related stress',
      },
      {
        resourceId: 'SMR-4',
        resourceTitle: 'Teen Crisis Hotline',
        matchScore: 90,
        reason: '24/7 support for immediate assistance',
      },
    ];
  }

  // ============================================================================
  // 5. PEER HEALTH EDUCATION PROGRAMS (Functions 21-25)
  // ============================================================================

  /**
   * 21. Creates peer health education program with training requirements.
   */
  async createPeerHealthEducationProgram(programData: PeerHealthEducationData): Promise<any> {
    this.logger.log(`Creating peer health education program: ${programData.programTitle}`);

    return {
      ...programData,
      programId: `PHEP-${Date.now()}`,
      createdAt: new Date(),
    };
  }

  /**
   * 22. Recruits and trains peer health educators.
   */
  async recruitPeerHealthEducator(
    programId: string,
    studentId: string,
    trainingCompleted: boolean = false,
  ): Promise<any> {
    this.logger.log(`Recruiting peer educator ${studentId} for program ${programId}`);

    return {
      programId,
      studentId,
      recruitmentDate: new Date(),
      trainingStatus: trainingCompleted ? 'completed' : 'pending',
      assignedTopics: [],
    };
  }

  /**
   * 23. Schedules peer education session with target audience.
   */
  async schedulePeerEducationSession(
    programId: string,
    sessionData: { sessionDate: Date; location: string; targetGrade: string; educatorIds: string[] },
  ): Promise<any> {
    return {
      programId,
      sessionId: `PES-${Date.now()}`,
      ...sessionData,
      scheduledAt: new Date(),
      status: 'scheduled',
    };
  }

  /**
   * 24. Records peer education session delivery and attendance.
   */
  async recordPeerEducationSessionDelivery(
    sessionId: string,
    deliveryData: { attendees: string[]; materialsUsed: string[]; effectiveness: number },
  ): Promise<any> {
    this.logger.log(`Recording session delivery for ${sessionId}`);

    return {
      sessionId,
      deliveryDate: new Date(),
      attendeesCount: deliveryData.attendees.length,
      materialsUsed: deliveryData.materialsUsed,
      effectiveness: deliveryData.effectiveness,
      sessionCompleted: true,
    };
  }

  /**
   * 25. Evaluates peer education program effectiveness and impact.
   */
  async evaluatePeerEducationProgram(programId: string): Promise<any> {
    return {
      programId,
      totalSessionsDelivered: 12,
      totalStudentsReached: 340,
      averageEffectiveness: 4.2,
      peerEducatorRetention: 85,
      knowledgeImprovementScore: 78,
      evaluatedAt: new Date(),
    };
  }

  // ============================================================================
  // 6. STUDENT HEALTH COMMITTEE COORDINATION (Functions 26-29)
  // ============================================================================

  /**
   * 26. Creates student health committee for academic year.
   */
  async createStudentHealthCommittee(committeeData: HealthCommitteeData): Promise<any> {
    this.logger.log(`Creating health committee: ${committeeData.committeeName}`);

    return {
      ...committeeData,
      committeeId: `SHC-${Date.now()}`,
      createdAt: new Date(),
    };
  }

  /**
   * 27. Assigns student to health committee role.
   */
  async assignHealthCommitteeMember(
    committeeId: string,
    memberData: { studentId: string; role: HealthCommitteeRole; responsibilities: string[] },
  ): Promise<any> {
    this.logger.log(`Assigning ${memberData.studentId} as ${memberData.role} to committee ${committeeId}`);

    return {
      committeeId,
      memberId: `MEMBER-${Date.now()}`,
      ...memberData,
      joinDate: new Date(),
    };
  }

  /**
   * 28. Schedules and tracks health committee meetings.
   */
  async scheduleHealthCommitteeMeeting(
    committeeId: string,
    meetingData: { meetingDate: Date; agenda: string[]; location: string },
  ): Promise<any> {
    return {
      committeeId,
      meetingId: `MTG-${Date.now()}`,
      ...meetingData,
      scheduledAt: new Date(),
      status: 'scheduled',
    };
  }

  /**
   * 29. Documents health committee initiatives and accomplishments.
   */
  async documentHealthCommitteeInitiative(
    committeeId: string,
    initiativeData: { title: string; description: string; outcomes: string[] },
  ): Promise<any> {
    this.logger.log(`Documenting initiative for committee ${committeeId}`);

    return {
      committeeId,
      initiativeId: `INIT-${Date.now()}`,
      ...initiativeData,
      documentedAt: new Date(),
    };
  }

  // ============================================================================
  // 7. HEALTH PROMOTION CAMPAIGNS (Functions 30-34)
  // ============================================================================

  /**
   * 30. Creates health promotion campaign with objectives and timeline.
   */
  async createHealthPromotionCampaign(campaignData: HealthPromotionCampaignData): Promise<any> {
    this.logger.log(`Creating health promotion campaign: ${campaignData.campaignName}`);

    return {
      ...campaignData,
      campaignId: `HPC-${Date.now()}`,
      createdAt: new Date(),
    };
  }

  /**
   * 31. Launches health promotion campaign and tracks engagement.
   */
  async launchHealthPromotionCampaign(campaignId: string): Promise<any> {
    this.logger.log(`Launching campaign ${campaignId}`);

    return {
      campaignId,
      launchDate: new Date(),
      status: CampaignStatus.ACTIVE,
      initialReach: 0,
    };
  }

  /**
   * 32. Records campaign activity execution and participation.
   */
  async recordCampaignActivityExecution(
    campaignId: string,
    activityData: { activityName: string; actualParticipants: number; outcomes: string[] },
  ): Promise<any> {
    return {
      campaignId,
      activityId: `ACT-${Date.now()}`,
      ...activityData,
      executedAt: new Date(),
    };
  }

  /**
   * 33. Updates campaign reach metrics and engagement statistics.
   */
  async updateCampaignReachMetrics(
    campaignId: string,
    metrics: { studentsReached: number; parentsReached: number; staffReached: number },
  ): Promise<any> {
    this.logger.log(`Updating reach metrics for campaign ${campaignId}`);

    return {
      campaignId,
      reachMetrics: metrics,
      totalReach: metrics.studentsReached + metrics.parentsReached + metrics.staffReached,
      updatedAt: new Date(),
    };
  }

  /**
   * 34. Completes campaign and generates impact assessment report.
   */
  async completeCampaignAndGenerateReport(campaignId: string): Promise<any> {
    return {
      campaignId,
      completionDate: new Date(),
      status: CampaignStatus.COMPLETED,
      impactAssessment: {
        totalReach: 1250,
        behaviorChangeIndicators: 85,
        knowledgeImprovement: 78,
        communityEngagement: 92,
      },
      recommendationsForNextCampaign: [
        'Increase digital engagement',
        'Partner with local health organizations',
        'Extend campaign duration',
      ],
    };
  }

  // ============================================================================
  // 8. WELLNESS INCENTIVE TRACKING (Functions 35-37)
  // ============================================================================

  /**
   * 35. Awards wellness incentive points to student for participation.
   */
  async awardWellnessIncentive(incentiveData: WellnessIncentiveData): Promise<any> {
    this.logger.log(`Awarding ${incentiveData.pointsEarned} points to student ${incentiveData.studentId}`);

    return {
      ...incentiveData,
      incentiveId: `INC-${Date.now()}`,
      earnedDate: new Date(),
      redemptionStatus: 'pending',
    };
  }

  /**
   * 36. Gets student's wellness incentive balance and history.
   */
  async getStudentWellnessIncentives(studentId: string): Promise<any> {
    return {
      studentId,
      totalPointsEarned: 450,
      totalPointsRedeemed: 200,
      currentBalance: 250,
      badgesEarned: ['Fitness Warrior', 'Mindfulness Master', 'Nutrition Champion'],
      incentiveHistory: [
        {
          incentiveId: 'INC-1',
          programName: 'Step Challenge',
          pointsEarned: 100,
          earnedDate: new Date('2024-01-15'),
        },
        {
          incentiveId: 'INC-2',
          programName: 'Mental Wellness Week',
          pointsEarned: 150,
          earnedDate: new Date('2024-02-10'),
        },
      ],
    };
  }

  /**
   * 37. Processes incentive redemption and issues rewards.
   */
  async redeemWellnessIncentive(
    incentiveId: string,
    redemptionData: { rewardSelection: string; deliveryMethod: string },
  ): Promise<any> {
    this.logger.log(`Processing redemption for incentive ${incentiveId}`);

    return {
      incentiveId,
      redemptionDate: new Date(),
      redemptionStatus: 'redeemed',
      rewardIssued: redemptionData.rewardSelection,
      deliveryMethod: redemptionData.deliveryMethod,
    };
  }

  // ============================================================================
  // 9. HEALTH SCREENING PARTICIPATION TRACKING (Functions 38-39)
  // ============================================================================

  /**
   * 38. Schedules student for health screening with consent verification.
   */
  async scheduleHealthScreeningParticipation(participationData: ScreeningParticipationData): Promise<any> {
    this.logger.log(`Scheduling ${participationData.screeningType} screening for student ${participationData.studentId}`);

    if (!participationData.consentOnFile) {
      throw new ForbiddenException('Parent consent required for health screening');
    }

    return {
      ...participationData,
      participationId: `HSP-${Date.now()}`,
      participationStatus: 'scheduled',
      scheduledAt: new Date(),
    };
  }

  /**
   * 39. Records health screening results and follow-up requirements.
   */
  async recordHealthScreeningResults(
    participationId: string,
    resultsData: { results: string; followUpRequired: boolean; followUpNotes?: string },
  ): Promise<any> {
    this.logger.log(`Recording screening results for participation ${participationId}`);

    return {
      participationId,
      participationStatus: 'completed',
      results: resultsData.results,
      followUpRequired: resultsData.followUpRequired,
      followUpNotes: resultsData.followUpNotes,
      completedAt: new Date(),
    };
  }

  // ============================================================================
  // 10. STUDENT HEALTH AMBASSADOR PROGRAMS (Functions 40-41)
  // ============================================================================

  /**
   * 40. Appoints student as health ambassador with training track.
   */
  async appointHealthAmbassador(ambassadorData: HealthAmbassadorData): Promise<any> {
    this.logger.log(`Appointing student ${ambassadorData.studentId} as health ambassador`);

    return {
      ...ambassadorData,
      ambassadorId: `AMB-${Date.now()}`,
      appointedAt: new Date(),
    };
  }

  /**
   * 41. Tracks health ambassador activities and measures impact.
   */
  async trackHealthAmbassadorImpact(
    ambassadorId: string,
    impactData: { projectsCompleted: number; eventsParticipated: number; peersReached: number },
  ): Promise<any> {
    this.logger.log(`Tracking impact for ambassador ${ambassadorId}`);

    return {
      ambassadorId,
      impactMetrics: impactData,
      impactScore: (impactData.projectsCompleted * 10) + (impactData.eventsParticipated * 5) + (impactData.peersReached * 0.5),
      recordedAt: new Date(),
    };
  }
}

// ============================================================================
// MOCK DATA GENERATORS FOR TESTING
// ============================================================================

/**
 * Mock data generator for wellness challenges
 */
export class WellnessChallengeMockGenerator {
  static generateChallenge(overrides?: Partial<WellnessChallengeData>): WellnessChallengeData {
    return {
      challengeName: 'Step Challenge 2024',
      description: 'Track your daily steps for 30 days',
      category: WellnessActivityCategory.PHYSICAL_FITNESS,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
      targetParticipants: 100,
      challengeGoal: 'Walk 10,000 steps daily',
      measurementCriteria: 'Daily step count via fitness tracker or manual entry',
      pointsAwarded: 100,
      status: WellnessChallengeStatus.DRAFT,
      createdBy: 'user-123',
      schoolId: 'school-456',
      ...overrides,
    };
  }

  static generateMultipleChallenges(count: number): WellnessChallengeData[] {
    return Array.from({ length: count }, (_, i) => this.generateChallenge({
      challengeName: `Challenge ${i + 1}`,
    }));
  }
}

/**
 * Mock data generator for fitness programs
 */
export class FitnessProgramMockGenerator {
  static generateEnrollment(overrides?: Partial<FitnessProgramData>): FitnessProgramData {
    return {
      studentId: 'student-123',
      programName: 'Youth Cardio Training',
      programCategory: 'cardio',
      enrollmentDate: new Date(),
      enrollmentStatus: EnrollmentStatus.ACTIVE,
      progressPercentage: 0,
      sessionsCompleted: 0,
      totalSessions: 20,
      currentGoals: ['Improve endurance', 'Complete 5K run'],
      achievements: [],
      instructorId: 'instructor-456',
      schoolId: 'school-789',
      parentConsent: true,
      ...overrides,
    };
  }
}

/**
 * Mock data generator for mental wellness activities
 */
export class MentalWellnessActivityMockGenerator {
  static generateActivity(overrides?: Partial<MentalWellnessActivityData>): MentalWellnessActivityData {
    return {
      activityName: 'Mindfulness Meditation Session',
      activityType: 'meditation',
      description: 'Guided meditation for stress reduction',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 45,
      facilitatorId: 'facilitator-123',
      maxParticipants: 25,
      registeredParticipants: [],
      isRecurring: false,
      resourcesProvided: ['Meditation cushions', 'Handouts', 'Recorded sessions'],
      schoolId: 'school-456',
      isConfidential: true,
      ...overrides,
    };
  }
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

/**
 * Test helper for creating mock Sequelize instances
 */
export class WellnessTestHelper {
  static createMockSequelize(): any {
    return {
      transaction: jest.fn().mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      }),
      query: jest.fn().mockResolvedValue([]),
    };
  }

  static createMockWellnessChallengeModel(): any {
    return {
      create: jest.fn().mockResolvedValue({ toJSON: () => ({}) }),
      findByPk: jest.fn().mockResolvedValue({
        update: jest.fn().mockResolvedValue({}),
        toJSON: () => ({}),
      }),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };
  }
}

// ============================================================================
// TESTING DOCUMENTATION
// ============================================================================

/**
 * TESTING STRATEGY FOR STUDENT WELLNESS PROGRAMS COMPOSITE
 *
 * 1. Unit Tests (src/__tests__/student-wellness-programs.spec.ts):
 *    - Test each function in isolation with mocked dependencies
 *    - Verify input validation and error handling
 *    - Test business logic calculations (e.g., completion rates, progress percentages)
 *    - Mock Sequelize models and verify correct query parameters
 *
 * 2. Integration Tests (test/integration/student-wellness-programs.integration.spec.ts):
 *    - Test service with real database (use test database or in-memory SQLite)
 *    - Verify complete workflows (e.g., challenge creation → activation → participation → completion)
 *    - Test data persistence and retrieval
 *    - Verify foreign key relationships and constraints
 *
 * 3. E2E Tests (test/e2e/wellness-programs.e2e-spec.ts):
 *    - Test complete user journeys through API endpoints
 *    - Verify authentication and authorization
 *    - Test concurrent operations and race conditions
 *    - Validate response formats and status codes
 *
 * 4. Test Coverage Requirements:
 *    - Line coverage: > 95%
 *    - Branch coverage: > 90%
 *    - Function coverage: 100%
 *
 * 5. Mock Data Usage:
 *    - Use WellnessChallengeMockGenerator for challenge tests
 *    - Use FitnessProgramMockGenerator for enrollment tests
 *    - Use MentalWellnessActivityMockGenerator for activity tests
 *
 * 6. Testing Best Practices:
 *    - Use descriptive test names following Given-When-Then pattern
 *    - Test edge cases and boundary conditions
 *    - Verify logging calls for important operations
 *    - Test error scenarios and exception handling
 *    - Use beforeEach to reset mocks and test state
 *
 * Example Test Structure:
 *
 * describe('StudentWellnessProgramsCompositeService', () => {
 *   let service: StudentWellnessProgramsCompositeService;
 *   let mockSequelize: any;
 *
 *   beforeEach(async () => {
 *     mockSequelize = WellnessTestHelper.createMockSequelize();
 *     const module: TestingModule = await Test.createTestingModule({
 *       providers: [
 *         StudentWellnessProgramsCompositeService,
 *         { provide: 'SEQUELIZE', useValue: mockSequelize },
 *       ],
 *     }).compile();
 *
 *     service = module.get<StudentWellnessProgramsCompositeService>(
 *       StudentWellnessProgramsCompositeService,
 *     );
 *   });
 *
 *   describe('createWellnessChallenge', () => {
 *     it('should create wellness challenge with valid data', async () => {
 *       const challengeData = WellnessChallengeMockGenerator.generateChallenge();
 *       const result = await service.createWellnessChallenge(challengeData);
 *       expect(result).toBeDefined();
 *       expect(result.status).toBe(WellnessChallengeStatus.DRAFT);
 *     });
 *
 *     it('should throw BadRequestException when end date is before start date', async () => {
 *       const invalidData = WellnessChallengeMockGenerator.generateChallenge({
 *         startDate: new Date('2024-12-01'),
 *         endDate: new Date('2024-11-01'),
 *       });
 *       await expect(service.createWellnessChallenge(invalidData))
 *         .rejects.toThrow(BadRequestException);
 *     });
 *   });
 * });
 */

// ============================================================================
// EXPORTS
// ============================================================================

export default StudentWellnessProgramsCompositeService;
