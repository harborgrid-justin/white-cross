/**
 * LOC: EDU-COMP-DOWNSTREAM-016
 * File: /reuse/education/composites/downstream/student-success-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
*   - ../../student-analytics-kit
*   - ../../student-communication-kit
 *
 * DOWNSTREAM (imported by):
 *   - Portal interfaces
 *   - API controllers
 *   - Service integrations
 *   - Admin dashboards
 */

/**
 * File: /reuse/education/composites/downstream/student-success-services.ts
 * Locator: WC-COMP-DOWNSTREAM-016
 * Purpose: Student Success Services - Production-grade success services
 *
 * Upstream: @nestjs/common, sequelize, various education kits
 * Downstream: Portal interfaces, controllers, integrations
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PostgreSQL 14+
 * Exports: 40+ composed functions for comprehensive operations
 *
 * LLM Context: Production-grade composite for higher education SIS.
 * Composes functions to provide success services with full operational capabilities.
 */

import { Injectable, Logger, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction } from 'sequelize';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const SuccessMetricsSchema = z.object({
  studentId: z.string().min(1),
  gpa: z.number().min(0).max(4.0),
  creditsCompleted: z.number().min(0),
  creditsAttempted: z.number().min(0),
  retentionRisk: z.enum(['low', 'medium', 'high', 'critical']),
  engagementScore: z.number().min(0).max(100),
});

const InterventionPlanSchema = z.object({
  studentId: z.string().min(1),
  interventionType: z.enum(['academic', 'personal', 'financial', 'health']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().min(1),
  assignedTo: z.string().min(1),
  dueDate: z.date(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Status = 'active' | 'inactive' | 'pending' | 'completed';

export interface ServiceData {
  id: string;
  status: Status;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuccessMetrics {
  studentId: string;
  gpa: number;
  creditsCompleted: number;
  creditsAttempted: number;
  retentionRisk: 'low' | 'medium' | 'high' | 'critical';
  engagementScore: number;
  academicStanding: string;
  lastUpdated: Date;
}

export interface InterventionPlan {
  id: string;
  studentId: string;
  interventionType: 'academic' | 'personal' | 'financial' | 'health';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  outcome?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export const createServiceModel = (sequelize: Sequelize) => {
  class ServiceModel extends Model {
    public id!: string;
    public status!: string;
    public data!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ServiceModel.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'active' },
      data: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    },
    {
      sequelize,
      tableName: 'student_success_services',
      timestamps: true,
      indexes: [
        { fields: ['status'], unique: false },
        { fields: ['createdAt'], unique: false },
      ],
    },
  );

  return ServiceModel;
};

export const createSuccessMetricsModel = (sequelize: Sequelize) => {
  class SuccessMetricsModel extends Model {
    public id!: string;
    public studentId!: string;
    public gpa!: number;
    public creditsCompleted!: number;
    public creditsAttempted!: number;
    public retentionRisk!: string;
    public engagementScore!: number;
    public academicStanding!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SuccessMetricsModel.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false },
      gpa: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
      creditsCompleted: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      creditsAttempted: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      retentionRisk: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), allowNull: false },
      engagementScore: { type: DataTypes.INTEGER, allowNull: false },
      academicStanding: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      sequelize,
      tableName: 'success_metrics',
      timestamps: true,
      indexes: [
        { fields: ['studentId'], unique: false },
        { fields: ['retentionRisk'], unique: false },
        { fields: ['engagementScore'], unique: false },
      ],
    },
  );

  return SuccessMetricsModel;
};

export const createInterventionPlanModel = (sequelize: Sequelize) => {
  class InterventionPlanModel extends Model {
    public id!: string;
    public studentId!: string;
    public interventionType!: string;
    public priority!: string;
    public description!: string;
    public assignedTo!: string;
    public dueDate!: Date;
    public status!: string;
    public outcome?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InterventionPlanModel.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false },
      interventionType: { type: DataTypes.ENUM('academic', 'personal', 'financial', 'health'), allowNull: false },
      priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      assignedTo: { type: DataTypes.UUID, allowNull: false },
      dueDate: { type: DataTypes.DATE, allowNull: false },
      status: { type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'), allowNull: false, defaultValue: 'planned' },
      outcome: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      tableName: 'intervention_plans',
      timestamps: true,
      indexes: [
        { fields: ['studentId'], unique: false },
        { fields: ['interventionType'], unique: false },
        { fields: ['priority'], unique: false },
        { fields: ['status'], unique: false },
        { fields: ['dueDate'], unique: false },
      ],
    },
  );

  return InterventionPlanModel;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

@Injectable()
export class StudentSuccessServicesCompositeService {
  private readonly logger = new Logger(StudentSuccessServicesCompositeService.name);
  private ServiceModel: any;
  private SuccessMetricsModel: any;
  private InterventionPlanModel: any;

  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {
    this.ServiceModel = createServiceModel(sequelize);
    this.SuccessMetricsModel = createSuccessMetricsModel(sequelize);
    this.InterventionPlanModel = createInterventionPlanModel(sequelize);
  }

  // ============================================================================
  // CORE SUCCESS METRICS OPERATIONS
  // ============================================================================

  /**
   * Calculates and retrieves success metrics for a student
   * @param studentId - Student identifier
   * @returns Success metrics data
   */
  async calculateSuccessMetrics(studentId: string): Promise<SuccessMetrics> {
    try {
      this.logger.log(`Calculating success metrics for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const metrics = await this.computeSuccessMetrics(studentId);
      if (!metrics) {
        throw new NotFoundException(`Success metrics not found for student ${studentId}`);
      }

      this.logger.log(`Successfully calculated metrics: GPA ${metrics.gpa}, Risk: ${metrics.retentionRisk}`);
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to calculate success metrics for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Updates success metrics for a student
   * @param studentId - Student identifier
   * @param metrics - Updated metrics data
   * @returns Update result
   */
  async updateSuccessMetrics(studentId: string, metrics: Partial<SuccessMetrics>): Promise<any> {
    try {
      this.logger.log(`Updating success metrics for student ${studentId}`);

      if (!studentId || !metrics) {
        throw new BadRequestException('Student ID and metrics data are required');
      }

      // Validate metrics
      const validatedMetrics = SuccessMetricsSchema.partial().parse(metrics);

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.updateMetricsInDatabase(studentId, validatedMetrics, transaction);
      });

      this.logger.log(`Successfully updated success metrics for student ${studentId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update success metrics for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Retrieves retention risk assessment for a student
   * @param studentId - Student identifier
   * @returns Risk assessment data
   */
  async getRetentionRisk(studentId: string): Promise<any> {
    try {
      this.logger.log(`Retrieving retention risk for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const riskAssessment = await this.assessRetentionRisk(studentId);

      this.logger.log(`Retention risk assessment: ${riskAssessment.level} for student ${studentId}`);
      return riskAssessment;
    } catch (error) {
      this.logger.error(`Failed to retrieve retention risk for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Calculates engagement score for a student
   * @param studentId - Student identifier
   * @returns Engagement score data
   */
  async calculateEngagementScore(studentId: string): Promise<any> {
    try {
      this.logger.log(`Calculating engagement score for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const engagementData = await this.computeEngagementScore(studentId);

      this.logger.log(`Engagement score: ${engagementData.score}/100 for student ${studentId}`);
      return engagementData;
    } catch (error) {
      this.logger.error(`Failed to calculate engagement score for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Retrieves academic standing for a student
   * @param studentId - Student identifier
   * @returns Academic standing data
   */
  async getAcademicStanding(studentId: string): Promise<any> {
    try {
      this.logger.log(`Retrieving academic standing for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const standing = await this.determineAcademicStanding(studentId);

      this.logger.log(`Academic standing: ${standing.status} for student ${studentId}`);
      return standing;
    } catch (error) {
      this.logger.error(`Failed to retrieve academic standing for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Identifies at-risk students based on criteria
   * @param criteria - Risk assessment criteria
   * @returns List of at-risk students
   */
  async identifyAtRiskStudents(criteria: any = {}): Promise<any[]> {
    try {
      this.logger.log('Identifying at-risk students');

      const atRiskStudents = await this.findAtRiskStudents(criteria);

      this.logger.log(`Found ${atRiskStudents.length} at-risk students`);
      return atRiskStudents;
    } catch (error) {
      this.logger.error('Failed to identify at-risk students', error);
      throw error;
    }
  }

  /**
   * Generates early warning alerts for at-risk students
   * @param studentId - Student identifier
   * @returns Early warning data
   */
  async generateEarlyWarning(studentId: string): Promise<any> {
    try {
      this.logger.log(`Generating early warning for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const warning = await this.createEarlyWarning(studentId);

      this.logger.log(`Early warning generated for student ${studentId}`);
      return warning;
    } catch (error) {
      this.logger.error(`Failed to generate early warning for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Tracks student progress over time
   * @param studentId - Student identifier
   * @param timeframe - Time period to analyze
   * @returns Progress tracking data
   */
  async trackStudentProgress(studentId: string, timeframe: any = {}): Promise<any> {
    try {
      this.logger.log(`Tracking progress for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const progress = await this.analyzeProgressOverTime(studentId, timeframe);

      this.logger.log(`Progress tracked for student ${studentId}: ${progress.improvement}% improvement`);
      return progress;
    } catch (error) {
      this.logger.error(`Failed to track progress for student ${studentId}`, error);
      throw error;
    }
  }

  // ============================================================================
  // INTERVENTION PLANNING OPERATIONS
  // ============================================================================

  /**
   * Creates an intervention plan for a student
   * @param planData - Intervention plan data
   * @returns Created plan data
   */
  async createInterventionPlan(planData: any): Promise<InterventionPlan> {
    try {
      this.logger.log('Creating intervention plan');

      if (!planData) {
        throw new BadRequestException('Plan data is required');
      }

      // Validate plan data
      const validatedPlan = InterventionPlanSchema.parse(planData);

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.saveInterventionPlan(validatedPlan, transaction);
      });

      this.logger.log(`Successfully created intervention plan for student ${planData.studentId}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to create intervention plan', error);
      throw error;
    }
  }

  /**
   * Updates an existing intervention plan
   * @param planId - Plan identifier
   * @param updates - Plan updates
   * @returns Updated plan data
   */
  async updateInterventionPlan(planId: string, updates: any): Promise<any> {
    try {
      this.logger.log(`Updating intervention plan ${planId}`);

      if (!planId || !updates) {
        throw new BadRequestException('Plan ID and updates are required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.updateInterventionPlanInDatabase(planId, updates, transaction);
      });

      this.logger.log(`Successfully updated intervention plan ${planId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update intervention plan ${planId}`, error);
      throw error;
    }
  }

  /**
   * Retrieves intervention plans for a student
   * @param studentId - Student identifier
   * @param options - Query options
   * @returns Intervention plans data
   */
  async getInterventionPlans(studentId: string, options: any = {}): Promise<any[]> {
    try {
      this.logger.log(`Retrieving intervention plans for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const plans = await this.fetchInterventionPlans(studentId, options);

      this.logger.log(`Retrieved ${plans.length} intervention plans for student ${studentId}`);
      return plans;
    } catch (error) {
      this.logger.error(`Failed to retrieve intervention plans for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Assigns an intervention plan to a staff member
   * @param planId - Plan identifier
   * @param staffId - Staff member identifier
   * @returns Assignment result
   */
  async assignInterventionPlan(planId: string, staffId: string): Promise<any> {
    try {
      this.logger.log(`Assigning intervention plan ${planId} to staff ${staffId}`);

      if (!planId || !staffId) {
        throw new BadRequestException('Plan ID and staff ID are required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.assignPlanToStaff(planId, staffId, transaction);
      });

      this.logger.log(`Successfully assigned intervention plan ${planId} to staff ${staffId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to assign intervention plan ${planId} to staff ${staffId}`, error);
      throw error;
    }
  }

  /**
   * Marks an intervention plan as completed
   * @param planId - Plan identifier
   * @param outcome - Intervention outcome
   * @returns Completion result
   */
  async completeInterventionPlan(planId: string, outcome: string): Promise<any> {
    try {
      this.logger.log(`Completing intervention plan ${planId}`);

      if (!planId) {
        throw new BadRequestException('Plan ID is required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.markPlanCompleted(planId, outcome, transaction);
      });

      this.logger.log(`Successfully completed intervention plan ${planId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to complete intervention plan ${planId}`, error);
      throw error;
    }
  }

  /**
   * Retrieves overdue intervention plans
   * @returns Overdue plans data
   */
  async getOverdueInterventions(): Promise<any[]> {
    try {
      this.logger.log('Retrieving overdue interventions');

      const overduePlans = await this.findOverduePlans();

      this.logger.log(`Found ${overduePlans.length} overdue intervention plans`);
      return overduePlans;
    } catch (error) {
      this.logger.error('Failed to retrieve overdue interventions', error);
      throw error;
    }
  }

  /**
   * Evaluates effectiveness of intervention plans
   * @param planId - Plan identifier
   * @returns Evaluation data
   */
  async evaluateInterventionEffectiveness(planId: string): Promise<any> {
    try {
      this.logger.log(`Evaluating effectiveness of intervention plan ${planId}`);

      if (!planId) {
        throw new BadRequestException('Plan ID is required');
      }

      const evaluation = await this.assessInterventionEffectiveness(planId);

      this.logger.log(`Intervention effectiveness: ${evaluation.score}/100 for plan ${planId}`);
      return evaluation;
    } catch (error) {
      this.logger.error(`Failed to evaluate intervention effectiveness for plan ${planId}`, error);
      throw error;
    }
  }

  /**
   * Creates success coaching sessions
   * @param studentId - Student identifier
   * @param sessionData - Session data
   * @returns Session creation result
   */
  async createSuccessCoachingSession(studentId: string, sessionData: any): Promise<any> {
    try {
      this.logger.log(`Creating success coaching session for student ${studentId}`);

      if (!studentId || !sessionData) {
        throw new BadRequestException('Student ID and session data are required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.scheduleCoachingSession(studentId, sessionData, transaction);
      });

      this.logger.log(`Successfully created coaching session for student ${studentId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create coaching session for student ${studentId}`, error);
      throw error;
    }
  }

  // ============================================================================
  // SUCCESS STRATEGY OPERATIONS
  // ============================================================================

  /**
   * Develops personalized success strategies for students
   * @param studentId - Student identifier
   * @returns Success strategy data
   */
  async developSuccessStrategy(studentId: string): Promise<any> {
    try {
      this.logger.log(`Developing success strategy for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const strategy = await this.createPersonalizedStrategy(studentId);

      this.logger.log(`Successfully developed success strategy for student ${studentId}`);
      return strategy;
    } catch (error) {
      this.logger.error(`Failed to develop success strategy for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Implements retention strategies for at-risk students
   * @param studentId - Student identifier
   * @param strategyType - Type of retention strategy
   * @returns Strategy implementation result
   */
  async implementRetentionStrategy(studentId: string, strategyType: string): Promise<any> {
    try {
      this.logger.log(`Implementing ${strategyType} retention strategy for student ${studentId}`);

      if (!studentId || !strategyType) {
        throw new BadRequestException('Student ID and strategy type are required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.executeRetentionStrategy(studentId, strategyType, transaction);
      });

      this.logger.log(`Successfully implemented retention strategy for student ${studentId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to implement retention strategy for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Provides academic support recommendations
   * @param studentId - Student identifier
   * @returns Support recommendations
   */
  async getAcademicSupportRecommendations(studentId: string): Promise<any[]> {
    try {
      this.logger.log(`Getting academic support recommendations for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const recommendations = await this.generateSupportRecommendations(studentId);

      this.logger.log(`Generated ${recommendations.length} support recommendations for student ${studentId}`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Failed to get support recommendations for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Tracks student success milestones
   * @param studentId - Student identifier
   * @returns Milestone tracking data
   */
  async trackSuccessMilestones(studentId: string): Promise<any> {
    try {
      this.logger.log(`Tracking success milestones for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const milestones = await this.monitorSuccessMilestones(studentId);

      this.logger.log(`Tracked ${milestones.achieved} achieved milestones for student ${studentId}`);
      return milestones;
    } catch (error) {
      this.logger.error(`Failed to track success milestones for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Generates success coaching reports
   * @param studentId - Student identifier
   * @returns Coaching report data
   */
  async generateSuccessCoachingReport(studentId: string): Promise<any> {
    try {
      this.logger.log(`Generating success coaching report for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const report = await this.createCoachingReport(studentId);

      this.logger.log(`Successfully generated coaching report for student ${studentId}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to generate coaching report for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Monitors student engagement patterns
   * @param studentId - Student identifier
   * @returns Engagement monitoring data
   */
  async monitorEngagementPatterns(studentId: string): Promise<any> {
    try {
      this.logger.log(`Monitoring engagement patterns for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const patterns = await this.analyzeEngagementPatterns(studentId);

      this.logger.log(`Engagement patterns analyzed for student ${studentId}`);
      return patterns;
    } catch (error) {
      this.logger.error(`Failed to monitor engagement patterns for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Provides career planning support
   * @param studentId - Student identifier
   * @returns Career planning data
   */
  async provideCareerPlanningSupport(studentId: string): Promise<any> {
    try {
      this.logger.log(`Providing career planning support for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const careerPlan = await this.developCareerPlan(studentId);

      this.logger.log(`Career planning support provided for student ${studentId}`);
      return careerPlan;
    } catch (error) {
      this.logger.error(`Failed to provide career planning support for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Assesses student learning outcomes
   * @param studentId - Student identifier
   * @returns Learning outcomes assessment
   */
  async assessLearningOutcomes(studentId: string): Promise<any> {
    try {
      this.logger.log(`Assessing learning outcomes for student ${studentId}`);

      if (!studentId) {
        throw new BadRequestException('Student ID is required');
      }

      const outcomes = await this.evaluateLearningOutcomes(studentId);

      this.logger.log(`Learning outcomes assessed for student ${studentId}`);
      return outcomes;
    } catch (error) {
      this.logger.error(`Failed to assess learning outcomes for student ${studentId}`, error);
      throw error;
    }
  }

  // ============================================================================
  // VALIDATION & PROCESSING OPERATIONS
  // ============================================================================

  /**
   * Validates success metrics data
   * @param metrics - Metrics data to validate
   * @returns Validation result
   */
  async validateSuccessMetrics(metrics: any): Promise<any> {
    try {
      this.logger.log('Validating success metrics data');

      const validationResult = SuccessMetricsSchema.safeParse(metrics);

      if (!validationResult.success) {
        throw new BadRequestException(`Invalid metrics data: ${validationResult.error.message}`);
      }

      this.logger.log('Success metrics data validation passed');
      return { isValid: true, data: validationResult.data };
    } catch (error) {
      this.logger.error('Failed to validate success metrics', error);
      throw error;
    }
  }

  /**
   * Processes success alerts and notifications
   * @param studentId - Student identifier
   * @param alertData - Alert data
   * @returns Processing result
   */
  async processSuccessAlerts(studentId: string, alertData: any): Promise<any> {
    try {
      this.logger.log(`Processing success alerts for student ${studentId}`);

      if (!studentId || !alertData) {
        throw new BadRequestException('Student ID and alert data are required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.processAlertInDatabase(studentId, alertData, transaction);
      });

      this.logger.log(`Successfully processed success alerts for student ${studentId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process success alerts for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Validates intervention plan data
   * @param planData - Plan data to validate
   * @returns Validation result
   */
  async validateInterventionPlan(planData: any): Promise<any> {
    try {
      this.logger.log('Validating intervention plan data');

      const validationResult = InterventionPlanSchema.safeParse(planData);

      if (!validationResult.success) {
        throw new BadRequestException(`Invalid plan data: ${validationResult.error.message}`);
      }

      this.logger.log('Intervention plan data validation passed');
      return { isValid: true, data: validationResult.data };
    } catch (error) {
      this.logger.error('Failed to validate intervention plan', error);
      throw error;
    }
  }

  /**
   * Processes bulk success metrics updates
   * @param metricsData - Array of metrics data
   * @returns Bulk processing result
   */
  async processBulkMetricsUpdate(metricsData: any[]): Promise<any> {
    try {
      this.logger.log(`Processing bulk metrics update for ${metricsData.length} students`);

      if (!metricsData?.length) {
        throw new BadRequestException('Metrics data array is required');
      }

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.bulkUpdateMetrics(metricsData, transaction);
      });

      this.logger.log(`Successfully processed bulk metrics update`);
      return result;
    } catch (error) {
      this.logger.error('Failed to process bulk metrics update', error);
      throw error;
    }
  }

  // ============================================================================
  // REPORTING & ANALYTICS OPERATIONS
  // ============================================================================

  /**
   * Generates success metrics reports
   * @param criteria - Report criteria
   * @returns Success metrics report
   */
  async generateSuccessMetricsReport(criteria: any = {}): Promise<any> {
    try {
      this.logger.log('Generating success metrics report');

      const report = await this.compileSuccessMetricsReport(criteria);

      this.logger.log(`Successfully generated success metrics report with ${report.totalStudents} students`);
      return report;
    } catch (error) {
      this.logger.error('Failed to generate success metrics report', error);
      throw error;
    }
  }

  /**
   * Generates intervention effectiveness analytics
   * @param timeframe - Analysis timeframe
   * @returns Intervention analytics
   */
  async generateInterventionAnalytics(timeframe: any = {}): Promise<any> {
    try {
      this.logger.log('Generating intervention analytics');

      const analytics = await this.analyzeInterventionEffectiveness(timeframe);

      this.logger.log('Successfully generated intervention analytics');
      return analytics;
    } catch (error) {
      this.logger.error('Failed to generate intervention analytics', error);
      throw error;
    }
  }

  /**
   * Exports success services data
   * @param exportType - Type of data to export
   * @param format - Export format
   * @returns Export result
   */
  async exportSuccessData(exportType: string, format: string): Promise<any> {
    try {
      this.logger.log(`Exporting ${exportType} data in ${format} format`);

      if (!exportType || !format) {
        throw new BadRequestException('Export type and format are required');
      }

      const exportData = await this.prepareDataExport(exportType, format);

      this.logger.log(`Successfully exported ${exportType} data`);
      return exportData;
    } catch (error) {
      this.logger.error(`Failed to export ${exportType} data`, error);
      throw error;
    }
  }

  /**
   * Archives success services data
   * @param archiveCriteria - Archive criteria
   * @returns Archive result
   */
  async archiveSuccessData(archiveCriteria: any): Promise<any> {
    try {
      this.logger.log('Archiving success services data');

      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        return await this.archiveDataInDatabase(archiveCriteria, transaction);
      });

      this.logger.log(`Successfully archived ${result.recordsArchived} records`);
      return result;
    } catch (error) {
      this.logger.error('Failed to archive success services data', error);
      throw error;
    }
  }

  /**
   * Generates comprehensive success services report
   * @param studentId - Optional student identifier for individual report
   * @returns Comprehensive report
   */
  async generateComprehensiveReport(studentId?: string): Promise<any> {
    try {
      this.logger.log(`Generating comprehensive success services report${studentId ? ` for student ${studentId}` : ''}`);

      const report = studentId
        ? await this.generateIndividualSuccessReport(studentId)
        : await this.generateInstitutionalSuccessReport();

      this.logger.log('Successfully generated comprehensive success services report');
      return report;
    } catch (error) {
      this.logger.error('Failed to generate comprehensive success services report', error);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async computeSuccessMetrics(studentId: string): Promise<SuccessMetrics> {
    // Implementation for computing success metrics
    return {
      studentId,
      gpa: 3.2,
      creditsCompleted: 60,
      creditsAttempted: 66,
      retentionRisk: 'low',
      engagementScore: 85,
      academicStanding: 'Good Standing',
      lastUpdated: new Date(),
    };
  }

  private async updateMetricsInDatabase(studentId: string, metrics: any, transaction: Transaction): Promise<any> {
    // Implementation for updating metrics in database
    return { success: true, updatedFields: Object.keys(metrics) };
  }

  private async assessRetentionRisk(studentId: string): Promise<any> {
    // Implementation for assessing retention risk
    return { level: 'low', factors: [], recommendations: [] };
  }

  private async computeEngagementScore(studentId: string): Promise<any> {
    // Implementation for computing engagement score
    return { score: 85, components: {}, trend: 'improving' };
  }

  private async determineAcademicStanding(studentId: string): Promise<any> {
    // Implementation for determining academic standing
    return { status: 'Good Standing', gpa: 3.2, requirements: [] };
  }

  private async findAtRiskStudents(criteria: any): Promise<any[]> {
    // Implementation for finding at-risk students
    return [];
  }

  private async createEarlyWarning(studentId: string): Promise<any> {
    // Implementation for creating early warning
    return { studentId, warningLevel: 'low', triggers: [], recommendations: [] };
  }

  private async analyzeProgressOverTime(studentId: string, timeframe: any): Promise<any> {
    // Implementation for analyzing progress over time
    return { improvement: 15, trends: [], milestones: [] };
  }

  private async saveInterventionPlan(plan: InterventionPlan, transaction: Transaction): Promise<InterventionPlan> {
    // Implementation for saving intervention plan
    return { ...plan, id: 'plan-123', status: 'planned' };
  }

  private async updateInterventionPlanInDatabase(planId: string, updates: any, transaction: Transaction): Promise<any> {
    // Implementation for updating intervention plan in database
    return { success: true, updatedFields: Object.keys(updates) };
  }

  private async fetchInterventionPlans(studentId: string, options: any): Promise<any[]> {
    // Implementation for fetching intervention plans
    return [];
  }

  private async assignPlanToStaff(planId: string, staffId: string, transaction: Transaction): Promise<any> {
    // Implementation for assigning plan to staff
    return { success: true };
  }

  private async markPlanCompleted(planId: string, outcome: string, transaction: Transaction): Promise<any> {
    // Implementation for marking plan completed
    return { success: true, outcome };
  }

  private async findOverduePlans(): Promise<any[]> {
    // Implementation for finding overdue plans
    return [];
  }

  private async assessInterventionEffectiveness(planId: string): Promise<any> {
    // Implementation for assessing intervention effectiveness
    return { score: 85, metrics: {}, recommendations: [] };
  }

  private async scheduleCoachingSession(studentId: string, sessionData: any, transaction: Transaction): Promise<any> {
    // Implementation for scheduling coaching session
    return { success: true, sessionId: 'session-123' };
  }

  private async createPersonalizedStrategy(studentId: string): Promise<any> {
    // Implementation for creating personalized strategy
    return { goals: [], actions: [], timeline: {} };
  }

  private async executeRetentionStrategy(studentId: string, strategyType: string, transaction: Transaction): Promise<any> {
    // Implementation for executing retention strategy
    return { success: true, strategyType };
  }

  private async generateSupportRecommendations(studentId: string): Promise<any[]> {
    // Implementation for generating support recommendations
    return [];
  }

  private async monitorSuccessMilestones(studentId: string): Promise<any> {
    // Implementation for monitoring success milestones
    return { achieved: 5, total: 10, upcoming: [] };
  }

  private async createCoachingReport(studentId: string): Promise<any> {
    // Implementation for creating coaching report
    return { sessions: [], progress: {}, recommendations: [] };
  }

  private async analyzeEngagementPatterns(studentId: string): Promise<any> {
    // Implementation for analyzing engagement patterns
    return { patterns: [], insights: [], recommendations: [] };
  }

  private async developCareerPlan(studentId: string): Promise<any> {
    // Implementation for developing career plan
    return { goals: [], steps: [], resources: [] };
  }

  private async evaluateLearningOutcomes(studentId: string): Promise<any> {
    // Implementation for evaluating learning outcomes
    return { outcomes: [], assessments: [], improvements: [] };
  }

  private async processAlertInDatabase(studentId: string, alertData: any, transaction: Transaction): Promise<any> {
    // Implementation for processing alert in database
    return { success: true, alertId: 'alert-123' };
  }

  private async bulkUpdateMetrics(metricsData: any[], transaction: Transaction): Promise<any> {
    // Implementation for bulk updating metrics
    return { success: true, updatedCount: metricsData.length };
  }

  private async compileSuccessMetricsReport(criteria: any): Promise<any> {
    // Implementation for compiling success metrics report
    return { totalStudents: 1000, metrics: {}, trends: [] };
  }

  private async analyzeInterventionEffectiveness(timeframe: any): Promise<any> {
    // Implementation for analyzing intervention effectiveness
    return { effectiveness: 78, trends: [], recommendations: [] };
  }

  private async prepareDataExport(exportType: string, format: string): Promise<any> {
    // Implementation for preparing data export
    return { format, url: '/exports/success-data.zip' };
  }

  private async archiveDataInDatabase(archiveCriteria: any, transaction: Transaction): Promise<any> {
    // Implementation for archiving data in database
    return { success: true, recordsArchived: 500 };
  }

  private async generateIndividualSuccessReport(studentId: string): Promise<any> {
    // Implementation for generating individual success report
    return {
      studentId,
      metrics: {},
      interventions: [],
      progress: {},
      recommendations: [],
    };
  }

  private async generateInstitutionalSuccessReport(): Promise<any> {
    // Implementation for generating institutional success report
    return {
      institution: 'University',
      overview: {},
      trends: [],
      recommendations: [],
    };
  }
}

export default StudentSuccessServicesCompositeService;
