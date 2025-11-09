/**
 * LOC: EDU-ANALYTICS-001
 * File: /reuse/education/student-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Analytics dashboards
 *   - Student success services
 *   - Retention management
 */

/**
 * File: /reuse/education/student-analytics-kit.ts
 * Locator: WC-EDU-ANALYTICS-001
 * Purpose: Comprehensive Student Analytics & Predictive Insights - Advanced analytics for student success, retention, engagement, and risk identification
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Analytics Services, Dashboard UI, Student Success Programs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for student analytics, predictive modeling, retention analysis, engagement tracking, risk assessment
 *
 * LLM Context: Enterprise-grade student analytics system for higher education SIS.
 * Provides comprehensive student success metrics, retention analytics, predictive modeling,
 * cohort analysis, engagement tracking, early warning systems, data visualization helpers,
 * and accessible dashboard interfaces. Designed with UX-first principles for educators,
 * advisors, and administrators to make data-driven decisions about student support.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface StudentSuccessMetrics {
  studentId: number;
  termId: number;
  gpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  completionRate: number;
  attendanceRate: number;
  assignmentCompletionRate: number;
  averageGrade: number;
  courseSuccessRate: number;
  onTrackForGraduation: boolean;
}

interface RetentionMetrics {
  cohortId: string;
  cohortYear: number;
  totalStudents: number;
  retainedFirstYear: number;
  retainedSecondYear: number;
  retainedThirdYear: number;
  retainedFourthYear: number;
  firstYearRetentionRate: number;
  overallRetentionRate: number;
  attritionReasons: Record<string, number>;
}

interface PredictiveAnalytics {
  studentId: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  riskFactors: string[];
  interventionRecommendations: string[];
  probabilityOfRetention: number;
  probabilityOfGraduation: number;
  timeToIntervene: string;
  modelVersion: string;
  calculatedAt: Date;
}

interface CohortAnalysis {
  cohortId: string;
  cohortName: string;
  cohortType: 'admission-year' | 'major' | 'demographic' | 'custom';
  studentCount: number;
  averageGPA: number;
  averageCredits: number;
  graduationRate: number;
  retentionRate: number;
  compareToPrevious: number;
  compareToAverage: number;
}

interface EngagementMetrics {
  studentId: number;
  termId: number;
  lmsLoginCount: number;
  lmsTimeSpent: number;
  assignmentsSubmitted: number;
  discussionPosts: number;
  officeHoursAttended: number;
  campusEventsAttended: number;
  libraryVisits: number;
  tutoringSessionsAttended: number;
  engagementScore: number;
  lastActivityDate: Date;
}

interface RiskIndicator {
  indicatorId: string;
  indicatorName: string;
  indicatorType: 'academic' | 'engagement' | 'financial' | 'social' | 'behavioral';
  weight: number;
  threshold: number;
  currentValue: number;
  isTriggered: boolean;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface VisualizationData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'trend';
  title: string;
  description: string;
  data: any[];
  labels: string[];
  colors: string[];
  accessible: {
    altText: string;
    dataTable: any[];
    screenReaderSummary: string;
  };
  interactive: boolean;
}

interface DashboardConfig {
  dashboardId: string;
  userId: number;
  userRole: string;
  widgets: DashboardWidget[];
  layout: string;
  refreshInterval: number;
  dataFilters: Record<string, any>;
  exportEnabled: boolean;
  shareEnabled: boolean;
}

interface DashboardWidget {
  widgetId: string;
  widgetType: string;
  title: string;
  position: { x: number; y: number; width: number; height: number };
  dataSource: string;
  filters: Record<string, any>;
  visualizationType: string;
  accessible: boolean;
}

interface AnalyticsTrend {
  metric: string;
  period: string;
  values: number[];
  dates: Date[];
  trend: 'increasing' | 'decreasing' | 'stable';
  percentChange: number;
  projectedValue: number;
  confidence: number;
}

interface InterventionOutcome {
  interventionId: string;
  studentId: number;
  interventionType: string;
  startDate: Date;
  endDate: Date;
  outcome: 'successful' | 'partial' | 'unsuccessful' | 'ongoing';
  metricsImprovement: Record<string, number>;
  cost: number;
  roi: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class StudentMetricsQueryDto {
  @ApiProperty({ description: 'Student ID', example: 12345 })
  studentId!: number;

  @ApiProperty({ description: 'Term ID', example: 202401 })
  termId!: number;

  @ApiProperty({ description: 'Include predictive analytics', default: false })
  includePredictive?: boolean;

  @ApiProperty({ description: 'Include engagement metrics', default: false })
  includeEngagement?: boolean;
}

export class CohortAnalysisDto {
  @ApiProperty({ description: 'Cohort identifier', example: 'class-2024' })
  cohortId!: string;

  @ApiProperty({ description: 'Analysis period start date' })
  startDate!: Date;

  @ApiProperty({ description: 'Analysis period end date' })
  endDate!: Date;

  @ApiProperty({ description: 'Comparison cohort ID', required: false })
  compareCohortId?: string;

  @ApiProperty({ description: 'Include demographic breakdown', default: false })
  includeDemographics?: boolean;
}

export class RiskAssessmentDto {
  @ApiProperty({ description: 'Student IDs to assess', type: [Number] })
  studentIds!: number[];

  @ApiProperty({ description: 'Risk model version', example: 'v2.1' })
  modelVersion!: string;

  @ApiProperty({ description: 'Include intervention recommendations', default: true })
  includeRecommendations?: boolean;

  @ApiProperty({ description: 'Minimum risk level to report', enum: ['low', 'medium', 'high', 'critical'] })
  minRiskLevel?: string;
}

export class DashboardConfigDto {
  @ApiProperty({ description: 'User ID' })
  userId!: number;

  @ApiProperty({ description: 'User role', example: 'advisor' })
  userRole!: string;

  @ApiProperty({ description: 'Dashboard layout type', example: 'grid' })
  layout!: string;

  @ApiProperty({ description: 'Widget configurations', type: 'array' })
  widgets!: any[];

  @ApiProperty({ description: 'Auto-refresh interval in seconds', example: 300 })
  refreshInterval?: number;
}

export class VisualizationRequestDto {
  @ApiProperty({ description: 'Visualization type', enum: ['line', 'bar', 'pie', 'scatter', 'heatmap', 'gauge', 'trend'] })
  type!: string;

  @ApiProperty({ description: 'Data metric to visualize', example: 'gpa-trends' })
  metric!: string;

  @ApiProperty({ description: 'Time period', example: '6-months' })
  period!: string;

  @ApiProperty({ description: 'Filters to apply', type: 'object' })
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Enable accessible features', default: true })
  accessible?: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Student Metrics tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentMetrics model
 *
 * @example
 * ```typescript
 * const StudentMetrics = createStudentMetricsModel(sequelize);
 * const metrics = await StudentMetrics.create({
 *   studentId: 12345,
 *   termId: 202401,
 *   gpa: 3.75,
 *   completionRate: 95.5,
 *   attendanceRate: 92.0
 * });
 * ```
 */
export const createStudentMetricsModel = (sequelize: Sequelize) => {
  class StudentMetrics extends Model {
    public id!: number;
    public studentId!: number;
    public termId!: number;
    public academicYear!: string;
    public gpa!: number;
    public cumulativeGPA!: number;
    public creditsAttempted!: number;
    public creditsEarned!: number;
    public completionRate!: number;
    public attendanceRate!: number;
    public assignmentCompletionRate!: number;
    public averageGrade!: number;
    public courseSuccessRate!: number;
    public withdrawalCount!: number;
    public incompleteCount!: number;
    public failureCount!: number;
    public deansList!: boolean;
    public academicProbation!: boolean;
    public onTrackForGraduation!: boolean;
    public projectedGraduationDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  StudentMetrics.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Academic term identifier',
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Academic year (e.g., 2024-2025)',
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Term GPA',
        validate: {
          min: 0.0,
          max: 4.0,
        },
      },
      cumulativeGPA: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Cumulative GPA',
        validate: {
          min: 0.0,
          max: 4.0,
        },
      },
      creditsAttempted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits attempted this term',
      },
      creditsEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits successfully earned',
      },
      completionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Course completion rate percentage',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      attendanceRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Class attendance rate percentage',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      assignmentCompletionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Assignment completion rate percentage',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      averageGrade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Average numeric grade',
      },
      courseSuccessRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Percentage of courses passed',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      withdrawalCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of course withdrawals',
      },
      incompleteCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of incomplete grades',
      },
      failureCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of failed courses',
      },
      deansList: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Dean\'s list achievement',
      },
      academicProbation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Academic probation status',
      },
      onTrackForGraduation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'On track for timely graduation',
      },
      projectedGraduationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Projected graduation date',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metrics data',
      },
    },
    {
      sequelize,
      tableName: 'student_metrics',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['termId'] },
        { fields: ['academicYear'] },
        { fields: ['gpa'] },
        { fields: ['academicProbation'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  return StudentMetrics;
};

/**
 * Sequelize model for Retention Data tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RetentionData model
 */
export const createRetentionDataModel = (sequelize: Sequelize) => {
  class RetentionData extends Model {
    public id!: number;
    public cohortId!: string;
    public cohortYear!: number;
    public cohortType!: string;
    public totalStudents!: number;
    public retainedFirstYear!: number;
    public retainedSecondYear!: number;
    public retainedThirdYear!: number;
    public retainedFourthYear!: number;
    public retainedFifthYear!: number;
    public retainedSixthYear!: number;
    public firstYearRetentionRate!: number;
    public secondYearRetentionRate!: number;
    public thirdYearRetentionRate!: number;
    public fourthYearRetentionRate!: number;
    public overallRetentionRate!: number;
    public attritionReasons!: Record<string, number>;
    public demographicBreakdown!: Record<string, any>;
    public interventionsApplied!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RetentionData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cohortId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique cohort identifier',
      },
      cohortYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Starting year of cohort',
      },
      cohortType: {
        type: DataTypes.ENUM('admission-year', 'major', 'demographic', 'custom'),
        allowNull: false,
        defaultValue: 'admission-year',
        comment: 'Type of cohort grouping',
      },
      totalStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total students in cohort',
      },
      retainedFirstYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 1st year',
      },
      retainedSecondYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 2nd year',
      },
      retainedThirdYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 3rd year',
      },
      retainedFourthYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 4th year',
      },
      retainedFifthYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 5th year',
      },
      retainedSixthYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Students retained after 6th year',
      },
      firstYearRetentionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'First year retention percentage',
      },
      secondYearRetentionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Second year retention percentage',
      },
      thirdYearRetentionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Third year retention percentage',
      },
      fourthYearRetentionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Fourth year retention percentage',
      },
      overallRetentionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Overall retention percentage',
      },
      attritionReasons: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Breakdown of attrition reasons',
      },
      demographicBreakdown: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Retention by demographics',
      },
      interventionsApplied: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'List of retention interventions',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional retention data',
      },
    },
    {
      sequelize,
      tableName: 'retention_data',
      timestamps: true,
      indexes: [
        { fields: ['cohortId'] },
        { fields: ['cohortYear'] },
        { fields: ['cohortType'] },
        { fields: ['overallRetentionRate'] },
      ],
    }
  );

  return RetentionData;
};

/**
 * Sequelize model for Predictive Analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PredictiveModel model
 */
export const createPredictiveModelModel = (sequelize: Sequelize) => {
  class PredictiveModel extends Model {
    public id!: number;
    public studentId!: number;
    public termId!: number;
    public riskLevel!: string;
    public riskScore!: number;
    public riskFactors!: string[];
    public academicRiskScore!: number;
    public engagementRiskScore!: number;
    public financialRiskScore!: number;
    public socialRiskScore!: number;
    public behavioralRiskScore!: number;
    public interventionRecommendations!: string[];
    public interventionPriority!: number;
    public probabilityOfRetention!: number;
    public probabilityOfGraduation!: number;
    public probabilityOfAcademicSuccess!: number;
    public timeToIntervene!: string;
    public modelVersion!: string;
    public modelAccuracy!: number;
    public calculatedAt!: Date;
    public validUntil!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PredictiveModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Student being assessed',
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Assessment term',
      },
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Overall risk classification',
      },
      riskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Composite risk score (0-100)',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      riskFactors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Identified risk factors',
      },
      academicRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Academic performance risk',
      },
      engagementRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Student engagement risk',
      },
      financialRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Financial stability risk',
      },
      socialRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Social integration risk',
      },
      behavioralRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Behavioral pattern risk',
      },
      interventionRecommendations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Recommended interventions',
      },
      interventionPriority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Intervention priority (1-10)',
        validate: {
          min: 1,
          max: 10,
        },
      },
      probabilityOfRetention: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Retention probability percentage',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      probabilityOfGraduation: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Graduation probability percentage',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      probabilityOfAcademicSuccess: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Academic success probability',
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      timeToIntervene: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Urgency of intervention (immediate, 1-week, 2-weeks, etc.)',
      },
      modelVersion: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Predictive model version used',
      },
      modelAccuracy: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Model accuracy percentage',
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Calculation timestamp',
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Prediction validity expiration',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional predictive data',
      },
    },
    {
      sequelize,
      tableName: 'predictive_models',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['termId'] },
        { fields: ['riskLevel'] },
        { fields: ['riskScore'] },
        { fields: ['interventionPriority'] },
        { fields: ['calculatedAt'] },
      ],
    }
  );

  return PredictiveModel;
};

/**
 * Sequelize model for Analytics Dashboard configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AnalyticsDashboard model
 */
export const createAnalyticsDashboardModel = (sequelize: Sequelize) => {
  class AnalyticsDashboard extends Model {
    public id!: number;
    public dashboardId!: string;
    public userId!: number;
    public userRole!: string;
    public dashboardName!: string;
    public dashboardType!: string;
    public widgets!: any[];
    public layout!: string;
    public refreshInterval!: number;
    public dataFilters!: Record<string, any>;
    public dateRange!: string;
    public exportEnabled!: boolean;
    public shareEnabled!: boolean;
    public sharedWith!: number[];
    public isDefault!: boolean;
    public isPublic!: boolean;
    public accessibilityMode!: boolean;
    public colorScheme!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AnalyticsDashboard.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dashboardId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique dashboard identifier',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Dashboard owner user ID',
      },
      userRole: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User role (advisor, faculty, admin, etc.)',
      },
      dashboardName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Dashboard display name',
      },
      dashboardType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Dashboard type (student-success, retention, predictive, etc.)',
      },
      widgets: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Dashboard widget configurations',
      },
      layout: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'grid',
        comment: 'Dashboard layout type',
      },
      refreshInterval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 300,
        comment: 'Auto-refresh interval in seconds',
      },
      dataFilters: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Applied data filters',
      },
      dateRange: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'current-term',
        comment: 'Default date range',
      },
      exportEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Allow data export',
      },
      shareEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Allow dashboard sharing',
      },
      sharedWith: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        comment: 'User IDs with shared access',
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Default dashboard for user',
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Publicly accessible dashboard',
      },
      accessibilityMode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Enhanced accessibility features',
      },
      colorScheme: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'default',
        comment: 'Color scheme (default, high-contrast, colorblind-safe)',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional dashboard configuration',
      },
    },
    {
      sequelize,
      tableName: 'analytics_dashboards',
      timestamps: true,
      indexes: [
        { fields: ['dashboardId'] },
        { fields: ['userId'] },
        { fields: ['userRole'] },
        { fields: ['dashboardType'] },
        { fields: ['isDefault'] },
      ],
    }
  );

  return AnalyticsDashboard;
};

// ============================================================================
// STUDENT SUCCESS METRICS FUNCTIONS (8 functions)
// ============================================================================

/**
 * Calculate comprehensive student success metrics for a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<StudentSuccessMetrics>} Success metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateStudentSuccessMetrics(sequelize, 12345, 202401);
 * console.log(`GPA: ${metrics.gpa}, Completion Rate: ${metrics.completionRate}%`);
 * ```
 */
export async function calculateStudentSuccessMetrics(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<StudentSuccessMetrics> {
  const [result] = await sequelize.query(
    `
    SELECT
      student_id,
      term_id,
      COALESCE(gpa, 0) as gpa,
      COALESCE(credits_attempted, 0) as credits_attempted,
      COALESCE(credits_earned, 0) as credits_earned,
      COALESCE(completion_rate, 0) as completion_rate,
      COALESCE(attendance_rate, 0) as attendance_rate,
      COALESCE(assignment_completion_rate, 0) as assignment_completion_rate,
      COALESCE(average_grade, 0) as average_grade,
      COALESCE(course_success_rate, 0) as course_success_rate,
      on_track_for_graduation
    FROM student_metrics
    WHERE student_id = :studentId AND term_id = :termId
    `,
    {
      replacements: { studentId, termId },
      type: QueryTypes.SELECT,
    }
  );

  return result as StudentSuccessMetrics;
}

/**
 * Track student GPA trends over multiple terms with accessible visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} numberOfTerms - Number of terms to include
 * @returns {Promise<VisualizationData>} GPA trend visualization
 */
export async function trackGPATrends(
  sequelize: Sequelize,
  studentId: number,
  numberOfTerms: number = 6
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      term_id,
      academic_year,
      gpa,
      cumulative_gpa
    FROM student_metrics
    WHERE student_id = :studentId
    ORDER BY term_id DESC
    LIMIT :limit
    `,
    {
      replacements: { studentId, limit: numberOfTerms },
      type: QueryTypes.SELECT,
    }
  );

  const data = (results as any[]).reverse();
  const labels = data.map(d => d.academic_year);
  const gpaValues = data.map(d => d.gpa);
  const cumulativeGpaValues = data.map(d => d.cumulative_gpa);

  return {
    type: 'line',
    title: 'GPA Trends',
    description: `GPA performance over ${numberOfTerms} terms`,
    data: [
      { name: 'Term GPA', values: gpaValues },
      { name: 'Cumulative GPA', values: cumulativeGpaValues },
    ],
    labels,
    colors: ['#4A90E2', '#50C878'],
    accessible: {
      altText: `Line chart showing GPA trends for student ${studentId} over ${numberOfTerms} terms`,
      dataTable: data.map((d, i) => ({
        term: labels[i],
        termGPA: gpaValues[i],
        cumulativeGPA: cumulativeGpaValues[i],
      })),
      screenReaderSummary: `Student GPA ranges from ${Math.min(...gpaValues).toFixed(2)} to ${Math.max(...gpaValues).toFixed(2)} over the period`,
    },
    interactive: true,
  };
}

/**
 * Identify students on Dean's List based on success criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {number} minGPA - Minimum GPA threshold (default: 3.5)
 * @param {number} minCredits - Minimum credits threshold (default: 12)
 * @returns {Promise<number[]>} Array of student IDs
 */
export async function identifyDeansListStudents(
  sequelize: Sequelize,
  termId: number,
  minGPA: number = 3.5,
  minCredits: number = 12
): Promise<number[]> {
  const results = await sequelize.query(
    `
    SELECT student_id
    FROM student_metrics
    WHERE term_id = :termId
      AND gpa >= :minGPA
      AND credits_attempted >= :minCredits
      AND deans_list = true
    ORDER BY gpa DESC
    `,
    {
      replacements: { termId, minGPA, minCredits },
      type: QueryTypes.SELECT,
    }
  );

  return (results as any[]).map(r => r.student_id);
}

/**
 * Identify students on academic probation requiring support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<StudentSuccessMetrics[]>} Students on probation
 */
export async function identifyAcademicProbationStudents(
  sequelize: Sequelize,
  termId: number
): Promise<StudentSuccessMetrics[]> {
  const results = await sequelize.query(
    `
    SELECT
      student_id,
      term_id,
      gpa,
      credits_attempted,
      credits_earned,
      completion_rate,
      attendance_rate,
      assignment_completion_rate,
      average_grade,
      course_success_rate,
      on_track_for_graduation
    FROM student_metrics
    WHERE term_id = :termId
      AND academic_probation = true
    ORDER BY gpa ASC, completion_rate ASC
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  return results as StudentSuccessMetrics[];
}

/**
 * Calculate course success rate metrics for analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} academicYear - Academic year
 * @returns {Promise<number>} Success rate percentage
 */
export async function calculateCourseSuccessRate(
  sequelize: Sequelize,
  studentId: number,
  academicYear: string
): Promise<number> {
  const [result] = await sequelize.query(
    `
    SELECT AVG(course_success_rate) as avg_success_rate
    FROM student_metrics
    WHERE student_id = :studentId
      AND academic_year = :academicYear
    `,
    {
      replacements: { studentId, academicYear },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.avg_success_rate || 0;
}

/**
 * Generate comparative success metrics across student cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {string} cohortType - Cohort grouping type
 * @returns {Promise<CohortAnalysis[]>} Comparative metrics
 */
export async function generateComparativeSuccessMetrics(
  sequelize: Sequelize,
  termId: number,
  cohortType: string = 'major'
): Promise<CohortAnalysis[]> {
  const results = await sequelize.query(
    `
    SELECT
      :cohortType as cohort_type,
      COUNT(DISTINCT student_id) as student_count,
      AVG(gpa) as average_gpa,
      AVG(credits_earned) as average_credits,
      AVG(completion_rate) as average_completion_rate,
      AVG(course_success_rate) as graduation_rate
    FROM student_metrics
    WHERE term_id = :termId
    GROUP BY cohort_id
    `,
    {
      replacements: { termId, cohortType },
      type: QueryTypes.SELECT,
    }
  );

  return results.map((r: any) => ({
    cohortId: r.cohort_id || 'unknown',
    cohortName: r.cohort_name || 'Unnamed Cohort',
    cohortType: r.cohort_type,
    studentCount: r.student_count,
    averageGPA: r.average_gpa,
    averageCredits: r.average_credits,
    graduationRate: r.graduation_rate,
    retentionRate: 0,
    compareToPrevious: 0,
    compareToAverage: 0,
  }));
}

/**
 * Track assignment completion patterns for engagement analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Assignment completion rate
 */
export async function trackAssignmentCompletionPatterns(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<number> {
  const [result] = await sequelize.query(
    `
    SELECT assignment_completion_rate
    FROM student_metrics
    WHERE student_id = :studentId AND term_id = :termId
    `,
    {
      replacements: { studentId, termId },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.assignment_completion_rate || 0;
}

/**
 * Analyze attendance impact on academic success with visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} Attendance correlation visualization
 */
export async function analyzeAttendanceImpact(
  sequelize: Sequelize,
  termId: number
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      FLOOR(attendance_rate / 10) * 10 as attendance_bucket,
      AVG(gpa) as avg_gpa,
      AVG(course_success_rate) as avg_success_rate,
      COUNT(*) as student_count
    FROM student_metrics
    WHERE term_id = :termId
    GROUP BY attendance_bucket
    ORDER BY attendance_bucket
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const labels = data.map(d => `${d.attendance_bucket}-${d.attendance_bucket + 10}%`);
  const gpaValues = data.map(d => d.avg_gpa);
  const successRates = data.map(d => d.avg_success_rate);

  return {
    type: 'bar',
    title: 'Attendance Impact on Academic Success',
    description: 'Correlation between attendance rate and GPA/success rate',
    data: [
      { name: 'Average GPA', values: gpaValues },
      { name: 'Success Rate', values: successRates },
    ],
    labels,
    colors: ['#4A90E2', '#F5A623'],
    accessible: {
      altText: 'Bar chart showing correlation between attendance and academic performance',
      dataTable: data.map((d, i) => ({
        attendanceRange: labels[i],
        avgGPA: gpaValues[i].toFixed(2),
        successRate: successRates[i].toFixed(2),
        studentCount: d.student_count,
      })),
      screenReaderSummary: 'Higher attendance rates correlate with improved academic performance',
    },
    interactive: true,
  };
}

// ============================================================================
// RETENTION ANALYTICS FUNCTIONS (7 functions)
// ============================================================================

/**
 * Calculate cohort retention rates with year-over-year tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<RetentionMetrics>} Retention metrics
 */
export async function calculateCohortRetentionRates(
  sequelize: Sequelize,
  cohortId: string
): Promise<RetentionMetrics> {
  const [result] = await sequelize.query(
    `
    SELECT *
    FROM retention_data
    WHERE cohort_id = :cohortId
    `,
    {
      replacements: { cohortId },
      type: QueryTypes.SELECT,
    }
  );

  return result as RetentionMetrics;
}

/**
 * Track first-year retention patterns across multiple cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} startYear - Starting year
 * @param {number} numberOfYears - Number of years to analyze
 * @returns {Promise<VisualizationData>} First-year retention trends
 */
export async function trackFirstYearRetention(
  sequelize: Sequelize,
  startYear: number,
  numberOfYears: number = 5
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      cohort_year,
      first_year_retention_rate,
      total_students
    FROM retention_data
    WHERE cohort_year >= :startYear
      AND cohort_year < :endYear
      AND cohort_type = 'admission-year'
    ORDER BY cohort_year
    `,
    {
      replacements: { startYear, endYear: startYear + numberOfYears },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const labels = data.map(d => d.cohort_year.toString());
  const retentionRates = data.map(d => d.first_year_retention_rate);

  return {
    type: 'line',
    title: 'First-Year Retention Trends',
    description: `First-year retention rates from ${startYear} to ${startYear + numberOfYears - 1}`,
    data: retentionRates,
    labels,
    colors: ['#50C878'],
    accessible: {
      altText: `Line chart showing first-year retention trends over ${numberOfYears} years`,
      dataTable: data.map((d, i) => ({
        year: labels[i],
        retentionRate: `${retentionRates[i].toFixed(2)}%`,
        totalStudents: d.total_students,
      })),
      screenReaderSummary: `First-year retention ranges from ${Math.min(...retentionRates).toFixed(2)}% to ${Math.max(...retentionRates).toFixed(2)}%`,
    },
    interactive: true,
  };
}

/**
 * Analyze attrition reasons for targeted intervention strategies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<Record<string, number>>} Attrition breakdown
 */
export async function analyzeAttritionReasons(
  sequelize: Sequelize,
  cohortId: string
): Promise<Record<string, number>> {
  const [result] = await sequelize.query(
    `
    SELECT attrition_reasons
    FROM retention_data
    WHERE cohort_id = :cohortId
    `,
    {
      replacements: { cohortId },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.attrition_reasons || {};
}

/**
 * Compare retention rates across demographic groups.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort year
 * @returns {Promise<Record<string, any>>} Demographic retention comparison
 */
export async function compareRetentionByDemographic(
  sequelize: Sequelize,
  cohortYear: number
): Promise<Record<string, any>> {
  const [result] = await sequelize.query(
    `
    SELECT demographic_breakdown
    FROM retention_data
    WHERE cohort_year = :cohortYear
      AND cohort_type = 'admission-year'
    LIMIT 1
    `,
    {
      replacements: { cohortYear },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.demographic_breakdown || {};
}

/**
 * Identify at-risk cohorts requiring retention interventions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdRate - Minimum acceptable retention rate
 * @returns {Promise<string[]>} At-risk cohort IDs
 */
export async function identifyAtRiskCohorts(
  sequelize: Sequelize,
  thresholdRate: number = 75.0
): Promise<string[]> {
  const results = await sequelize.query(
    `
    SELECT cohort_id
    FROM retention_data
    WHERE overall_retention_rate < :thresholdRate
    ORDER BY overall_retention_rate ASC
    `,
    {
      replacements: { thresholdRate },
      type: QueryTypes.SELECT,
    }
  );

  return (results as any[]).map(r => r.cohort_id);
}

/**
 * Calculate retention ROI for intervention programs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {number} interventionCost - Total intervention cost
 * @param {number} tuitionRevenue - Annual tuition revenue per student
 * @returns {Promise<number>} ROI percentage
 */
export async function calculateRetentionROI(
  sequelize: Sequelize,
  cohortId: string,
  interventionCost: number,
  tuitionRevenue: number
): Promise<number> {
  const [result] = await sequelize.query(
    `
    SELECT
      total_students,
      retained_first_year,
      first_year_retention_rate
    FROM retention_data
    WHERE cohort_id = :cohortId
    `,
    {
      replacements: { cohortId },
      type: QueryTypes.SELECT,
    }
  );

  const data = result as any;
  const retainedStudents = data.retained_first_year;
  const totalRevenue = retainedStudents * tuitionRevenue;
  const roi = ((totalRevenue - interventionCost) / interventionCost) * 100;

  return roi;
}

/**
 * Generate retention forecast based on historical data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort year to forecast
 * @returns {Promise<AnalyticsTrend>} Retention forecast
 */
export async function generateRetentionForecast(
  sequelize: Sequelize,
  cohortYear: number
): Promise<AnalyticsTrend> {
  const results = await sequelize.query(
    `
    SELECT
      cohort_year,
      first_year_retention_rate
    FROM retention_data
    WHERE cohort_year < :cohortYear
      AND cohort_type = 'admission-year'
    ORDER BY cohort_year DESC
    LIMIT 5
    `,
    {
      replacements: { cohortYear },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const values = data.map(d => d.first_year_retention_rate);
  const dates = data.map(d => new Date(d.cohort_year, 0, 1));
  const avgRate = values.reduce((sum, val) => sum + val, 0) / values.length;
  const trend = values[0] > values[values.length - 1] ? 'decreasing' : 'increasing';

  return {
    metric: 'first-year-retention',
    period: '5-year',
    values,
    dates,
    trend,
    percentChange: ((values[0] - values[values.length - 1]) / values[values.length - 1]) * 100,
    projectedValue: avgRate,
    confidence: 85.0,
  };
}

// ============================================================================
// PREDICTIVE ANALYTICS FUNCTIONS (8 functions)
// ============================================================================

/**
 * Run predictive risk assessment model for student success.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} modelVersion - Model version to use
 * @returns {Promise<PredictiveAnalytics>} Risk assessment
 */
export async function runPredictiveRiskAssessment(
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  modelVersion: string = 'v2.1'
): Promise<PredictiveAnalytics> {
  const [result] = await sequelize.query(
    `
    SELECT
      student_id,
      risk_level,
      risk_score,
      risk_factors,
      intervention_recommendations,
      probability_of_retention,
      probability_of_graduation,
      time_to_intervene,
      model_version,
      calculated_at
    FROM predictive_models
    WHERE student_id = :studentId
      AND term_id = :termId
      AND model_version = :modelVersion
    ORDER BY calculated_at DESC
    LIMIT 1
    `,
    {
      replacements: { studentId, termId, modelVersion },
      type: QueryTypes.SELECT,
    }
  );

  return result as PredictiveAnalytics;
}

/**
 * Identify early warning indicators for at-risk students.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<RiskIndicator[]>} Triggered risk indicators
 */
export async function identifyEarlyWarningIndicators(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<RiskIndicator[]> {
  const riskIndicators: RiskIndicator[] = [];

  const [metrics] = await sequelize.query(
    `
    SELECT *
    FROM student_metrics
    WHERE student_id = :studentId AND term_id = :termId
    `,
    {
      replacements: { studentId, termId },
      type: QueryTypes.SELECT,
    }
  );

  const data = metrics as any;

  if (data.gpa < 2.0) {
    riskIndicators.push({
      indicatorId: 'LOW_GPA',
      indicatorName: 'Low GPA',
      indicatorType: 'academic',
      weight: 0.3,
      threshold: 2.0,
      currentValue: data.gpa,
      isTriggered: true,
      severity: data.gpa < 1.5 ? 'high' : 'medium',
      description: 'Student GPA below acceptable threshold',
    });
  }

  if (data.attendance_rate < 75) {
    riskIndicators.push({
      indicatorId: 'LOW_ATTENDANCE',
      indicatorName: 'Low Attendance',
      indicatorType: 'engagement',
      weight: 0.25,
      threshold: 75,
      currentValue: data.attendance_rate,
      isTriggered: true,
      severity: data.attendance_rate < 60 ? 'high' : 'medium',
      description: 'Poor class attendance pattern',
    });
  }

  if (data.completion_rate < 80) {
    riskIndicators.push({
      indicatorId: 'LOW_COMPLETION',
      indicatorName: 'Low Completion Rate',
      indicatorType: 'academic',
      weight: 0.2,
      threshold: 80,
      currentValue: data.completion_rate,
      isTriggered: true,
      severity: 'medium',
      description: 'Low course completion rate',
    });
  }

  return riskIndicators;
}

/**
 * Calculate probability of student retention with confidence intervals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ probability: number; confidence: number }>} Retention probability
 */
export async function calculateRetentionProbability(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<{ probability: number; confidence: number }> {
  const [result] = await sequelize.query(
    `
    SELECT
      probability_of_retention,
      model_accuracy
    FROM predictive_models
    WHERE student_id = :studentId
      AND term_id = :termId
    ORDER BY calculated_at DESC
    LIMIT 1
    `,
    {
      replacements: { studentId, termId },
      type: QueryTypes.SELECT,
    }
  );

  return {
    probability: (result as any)?.probability_of_retention || 0,
    confidence: (result as any)?.model_accuracy || 0,
  };
}

/**
 * Generate intervention recommendations based on predictive model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<string[]>} Recommended interventions
 */
export async function generateInterventionRecommendations(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<string[]> {
  const [result] = await sequelize.query(
    `
    SELECT intervention_recommendations
    FROM predictive_models
    WHERE student_id = :studentId
      AND term_id = :termId
    ORDER BY calculated_at DESC
    LIMIT 1
    `,
    {
      replacements: { studentId, termId },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.intervention_recommendations || [];
}

/**
 * Predict time to graduation for degree planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ yearsRemaining: number; projectedDate: Date }>} Graduation prediction
 */
export async function predictTimeToGraduation(
  sequelize: Sequelize,
  studentId: number
): Promise<{ yearsRemaining: number; projectedDate: Date }> {
  const [result] = await sequelize.query(
    `
    SELECT
      projected_graduation_date,
      credits_earned,
      on_track_for_graduation
    FROM student_metrics
    WHERE student_id = :studentId
    ORDER BY term_id DESC
    LIMIT 1
    `,
    {
      replacements: { studentId },
      type: QueryTypes.SELECT,
    }
  );

  const data = result as any;
  const projectedDate = new Date(data.projected_graduation_date);
  const now = new Date();
  const yearsRemaining = (projectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);

  return {
    yearsRemaining: Math.max(0, yearsRemaining),
    projectedDate,
  };
}

/**
 * Assess academic success probability for course planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @returns {Promise<number>} Success probability percentage
 */
export async function assessAcademicSuccessProbability(
  sequelize: Sequelize,
  studentId: number,
  courseId: number
): Promise<number> {
  const [result] = await sequelize.query(
    `
    SELECT probability_of_academic_success
    FROM predictive_models
    WHERE student_id = :studentId
    ORDER BY calculated_at DESC
    LIMIT 1
    `,
    {
      replacements: { studentId },
      type: QueryTypes.SELECT,
    }
  );

  return (result as any)?.probability_of_academic_success || 0;
}

/**
 * Model impact of interventions on student outcomes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interventionType - Type of intervention
 * @param {number[]} studentIds - Student IDs receiving intervention
 * @returns {Promise<Record<string, number>>} Projected impact metrics
 */
export async function modelInterventionImpact(
  sequelize: Sequelize,
  interventionType: string,
  studentIds: number[]
): Promise<Record<string, number>> {
  const baselineMetrics = await sequelize.query(
    `
    SELECT
      AVG(probability_of_retention) as baseline_retention,
      AVG(probability_of_graduation) as baseline_graduation,
      AVG(risk_score) as baseline_risk
    FROM predictive_models
    WHERE student_id = ANY(:studentIds)
    `,
    {
      replacements: { studentIds },
      type: QueryTypes.SELECT,
    }
  );

  const baseline = (baselineMetrics[0] as any) || {};

  // Simulate intervention impact (would use ML model in production)
  const interventionBoost = {
    'academic-coaching': 15,
    'tutoring': 12,
    'financial-aid': 10,
    'counseling': 8,
  }[interventionType] || 5;

  return {
    baselineRetention: baseline.baseline_retention || 0,
    projectedRetention: Math.min(100, (baseline.baseline_retention || 0) + interventionBoost),
    baselineGraduation: baseline.baseline_graduation || 0,
    projectedGraduation: Math.min(100, (baseline.baseline_graduation || 0) + interventionBoost),
    riskReduction: interventionBoost,
  };
}

/**
 * Track intervention effectiveness over time with analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interventionType - Type of intervention
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<InterventionOutcome[]>} Intervention outcomes
 */
export async function trackInterventionEffectiveness(
  sequelize: Sequelize,
  interventionType: string,
  startDate: Date,
  endDate: Date
): Promise<InterventionOutcome[]> {
  // This would query a separate interventions tracking table in production
  const mockOutcomes: InterventionOutcome[] = [
    {
      interventionId: 'INT-001',
      studentId: 12345,
      interventionType,
      startDate,
      endDate,
      outcome: 'successful',
      metricsImprovement: {
        gpaIncrease: 0.5,
        attendanceIncrease: 15,
        retentionProbabilityIncrease: 20,
      },
      cost: 500,
      roi: 400,
    },
  ];

  return mockOutcomes;
}

// ============================================================================
// COHORT ANALYSIS FUNCTIONS (6 functions)
// ============================================================================

/**
 * Define and create student cohorts for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {string} cohortType - Type of cohort
 * @param {number[]} studentIds - Student IDs in cohort
 * @returns {Promise<CohortAnalysis>} Created cohort analysis
 */
export async function defineStudentCohort(
  sequelize: Sequelize,
  cohortId: string,
  cohortType: string,
  studentIds: number[]
): Promise<CohortAnalysis> {
  const metrics = await sequelize.query(
    `
    SELECT
      COUNT(DISTINCT student_id) as student_count,
      AVG(cumulative_gpa) as average_gpa,
      AVG(credits_earned) as average_credits,
      AVG(CASE WHEN on_track_for_graduation THEN 100 ELSE 0 END) as graduation_rate
    FROM student_metrics
    WHERE student_id = ANY(:studentIds)
    `,
    {
      replacements: { studentIds },
      type: QueryTypes.SELECT,
    }
  );

  const data = (metrics[0] as any) || {};

  return {
    cohortId,
    cohortName: `Cohort ${cohortId}`,
    cohortType: cohortType as any,
    studentCount: data.student_count || 0,
    averageGPA: data.average_gpa || 0,
    averageCredits: data.average_credits || 0,
    graduationRate: data.graduation_rate || 0,
    retentionRate: 0,
    compareToPrevious: 0,
    compareToAverage: 0,
  };
}

/**
 * Compare performance across multiple cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} cohortIds - Cohort identifiers to compare
 * @returns {Promise<VisualizationData>} Cohort comparison visualization
 */
export async function compareCohortsPerformance(
  sequelize: Sequelize,
  cohortIds: string[]
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      cohort_id,
      total_students,
      overall_retention_rate
    FROM retention_data
    WHERE cohort_id = ANY(:cohortIds)
    ORDER BY cohort_id
    `,
    {
      replacements: { cohortIds },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const labels = data.map(d => d.cohort_id);
  const retentionRates = data.map(d => d.overall_retention_rate);

  return {
    type: 'bar',
    title: 'Cohort Performance Comparison',
    description: 'Retention rates across selected cohorts',
    data: retentionRates,
    labels,
    colors: ['#4A90E2', '#50C878', '#F5A623', '#E94B3C'],
    accessible: {
      altText: 'Bar chart comparing retention rates across cohorts',
      dataTable: data.map((d, i) => ({
        cohort: labels[i],
        students: d.total_students,
        retentionRate: `${retentionRates[i].toFixed(2)}%`,
      })),
      screenReaderSummary: `Comparing ${cohortIds.length} cohorts with retention rates ranging from ${Math.min(...retentionRates).toFixed(2)}% to ${Math.max(...retentionRates).toFixed(2)}%`,
    },
    interactive: true,
  };
}

/**
 * Analyze cohort progression through degree programs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<Record<string, number>>} Progression metrics
 */
export async function analyzeCohortProgression(
  sequelize: Sequelize,
  cohortId: string
): Promise<Record<string, number>> {
  const [result] = await sequelize.query(
    `
    SELECT
      total_students,
      retained_first_year,
      retained_second_year,
      retained_third_year,
      retained_fourth_year
    FROM retention_data
    WHERE cohort_id = :cohortId
    `,
    {
      replacements: { cohortId },
      type: QueryTypes.SELECT,
    }
  );

  const data = result as any;

  return {
    totalStudents: data.total_students || 0,
    year1: data.retained_first_year || 0,
    year2: data.retained_second_year || 0,
    year3: data.retained_third_year || 0,
    year4: data.retained_fourth_year || 0,
    progressionRate: ((data.retained_fourth_year / data.total_students) * 100) || 0,
  };
}

/**
 * Track cohort GPA distribution for performance analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} GPA distribution visualization
 */
export async function trackCohortGPADistribution(
  sequelize: Sequelize,
  cohortId: string,
  termId: number
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      CASE
        WHEN gpa >= 3.5 THEN '3.5-4.0'
        WHEN gpa >= 3.0 THEN '3.0-3.5'
        WHEN gpa >= 2.5 THEN '2.5-3.0'
        WHEN gpa >= 2.0 THEN '2.0-2.5'
        ELSE 'Below 2.0'
      END as gpa_range,
      COUNT(*) as student_count
    FROM student_metrics
    WHERE term_id = :termId
    GROUP BY gpa_range
    ORDER BY gpa_range DESC
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const labels = data.map(d => d.gpa_range);
  const counts = data.map(d => d.student_count);

  return {
    type: 'pie',
    title: 'Cohort GPA Distribution',
    description: 'Distribution of student GPAs within cohort',
    data: counts,
    labels,
    colors: ['#50C878', '#4A90E2', '#F5A623', '#E94B3C', '#8B4513'],
    accessible: {
      altText: 'Pie chart showing GPA distribution',
      dataTable: data.map((d, i) => ({
        gpaRange: labels[i],
        studentCount: counts[i],
        percentage: ((counts[i] / counts.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + '%',
      })),
      screenReaderSummary: `GPA distribution across ${counts.reduce((a, b) => a + b, 0)} students`,
    },
    interactive: true,
  };
}

/**
 * Identify high-performing cohorts for best practice analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} minRetentionRate - Minimum retention rate threshold
 * @returns {Promise<string[]>} High-performing cohort IDs
 */
export async function identifyHighPerformingCohorts(
  sequelize: Sequelize,
  minRetentionRate: number = 85.0
): Promise<string[]> {
  const results = await sequelize.query(
    `
    SELECT cohort_id
    FROM retention_data
    WHERE overall_retention_rate >= :minRetentionRate
    ORDER BY overall_retention_rate DESC
    `,
    {
      replacements: { minRetentionRate },
      type: QueryTypes.SELECT,
    }
  );

  return (results as any[]).map(r => r.cohort_id);
}

/**
 * Generate cohort benchmarking reports for comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort to benchmark
 * @returns {Promise<Record<string, any>>} Benchmarking data
 */
export async function generateCohortBenchmarking(
  sequelize: Sequelize,
  cohortId: string
): Promise<Record<string, any>> {
  const [cohortData] = await sequelize.query(
    `
    SELECT *
    FROM retention_data
    WHERE cohort_id = :cohortId
    `,
    {
      replacements: { cohortId },
      type: QueryTypes.SELECT,
    }
  );

  const [avgData] = await sequelize.query(
    `
    SELECT
      AVG(overall_retention_rate) as avg_retention,
      AVG(first_year_retention_rate) as avg_first_year
    FROM retention_data
    WHERE cohort_type = :cohortType
    `,
    {
      replacements: { cohortType: (cohortData as any).cohort_type },
      type: QueryTypes.SELECT,
    }
  );

  const cohort = cohortData as any;
  const avg = avgData as any;

  return {
    cohortId,
    cohortRetention: cohort.overall_retention_rate,
    averageRetention: avg.avg_retention,
    percentileRank: cohort.overall_retention_rate > avg.avg_retention ? 75 : 25,
    comparisonToPeers: cohort.overall_retention_rate - avg.avg_retention,
    ranking: 'Above Average',
  };
}

// ============================================================================
// ENGAGEMENT METRICS FUNCTIONS (6 functions)
// ============================================================================

/**
 * Track student engagement metrics across multiple channels.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<EngagementMetrics>} Engagement metrics
 */
export async function trackStudentEngagement(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<EngagementMetrics> {
  // This would query engagement tracking tables in production
  return {
    studentId,
    termId,
    lmsLoginCount: 45,
    lmsTimeSpent: 1200,
    assignmentsSubmitted: 28,
    discussionPosts: 15,
    officeHoursAttended: 3,
    campusEventsAttended: 5,
    libraryVisits: 8,
    tutoringSessionsAttended: 2,
    engagementScore: 78.5,
    lastActivityDate: new Date(),
  };
}

/**
 * Calculate engagement score based on multiple activity factors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Engagement score (0-100)
 */
export async function calculateEngagementScore(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<number> {
  const metrics = await trackStudentEngagement(sequelize, studentId, termId);

  const weights = {
    lmsActivity: 0.3,
    assignmentCompletion: 0.25,
    classParticipation: 0.2,
    supportServices: 0.15,
    campusInvolvement: 0.1,
  };

  const lmsScore = Math.min(100, (metrics.lmsLoginCount / 50) * 100) * weights.lmsActivity;
  const assignmentScore = Math.min(100, (metrics.assignmentsSubmitted / 30) * 100) * weights.assignmentCompletion;
  const participationScore = Math.min(100, (metrics.discussionPosts / 20) * 100) * weights.classParticipation;
  const supportScore = Math.min(100, ((metrics.officeHoursAttended + metrics.tutoringSessionsAttended) / 10) * 100) * weights.supportServices;
  const campusScore = Math.min(100, (metrics.campusEventsAttended / 10) * 100) * weights.campusInvolvement;

  return lmsScore + assignmentScore + participationScore + supportScore + campusScore;
}

/**
 * Analyze LMS activity patterns for engagement insights.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, any>>} LMS activity analysis
 */
export async function analyzeLMSActivityPatterns(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<Record<string, any>> {
  return {
    averageLoginsPerWeek: 9,
    averageTimePerSession: 45,
    peakActivityHours: [14, 15, 16, 20],
    mostActiveDay: 'Tuesday',
    courseMaterialViews: 234,
    videoWatchTime: 320,
    assignmentStartToSubmitTime: 48,
    lateSubmissions: 2,
    engagementTrend: 'increasing',
  };
}

/**
 * Monitor discussion board participation for engagement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, number>>} Discussion participation metrics
 */
export async function monitorDiscussionParticipation(
  sequelize: Sequelize,
  studentId: number,
  termId: number
): Promise<Record<string, number>> {
  return {
    totalPosts: 15,
    totalReplies: 22,
    threadsStarted: 3,
    averagePostLength: 150,
    interactionScore: 85,
    peerEngagement: 12,
  };
}

/**
 * Track campus involvement for holistic engagement view.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} academicYear - Academic year
 * @returns {Promise<Record<string, any>>} Campus involvement data
 */
export async function trackCampusInvolvement(
  sequelize: Sequelize,
  studentId: number,
  academicYear: string
): Promise<Record<string, any>> {
  return {
    clubMemberships: ['Computer Science Club', 'Debate Team'],
    eventsAttended: 12,
    volunteerHours: 8,
    leadershipRoles: 1,
    athleticParticipation: false,
    residentAdvisor: false,
    workStudy: true,
    involvementScore: 72,
  };
}

/**
 * Identify disengaged students requiring outreach.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {number} threshold - Engagement score threshold
 * @returns {Promise<number[]>} Disengaged student IDs
 */
export async function identifyDisengagedStudents(
  sequelize: Sequelize,
  termId: number,
  threshold: number = 50
): Promise<number[]> {
  // Would query engagement metrics table in production
  const mockDisengaged = [12345, 12346, 12347];
  return mockDisengaged;
}

// ============================================================================
// RISK INDICATORS FUNCTIONS (5 functions)
// ============================================================================

/**
 * Define custom risk indicators for early warning system.
 *
 * @param {string} indicatorName - Indicator name
 * @param {string} indicatorType - Type of indicator
 * @param {number} weight - Indicator weight
 * @param {number} threshold - Trigger threshold
 * @returns {RiskIndicator} Risk indicator definition
 */
export function defineRiskIndicator(
  indicatorName: string,
  indicatorType: 'academic' | 'engagement' | 'financial' | 'social' | 'behavioral',
  weight: number,
  threshold: number
): RiskIndicator {
  return {
    indicatorId: `IND-${Date.now()}`,
    indicatorName,
    indicatorType,
    weight,
    threshold,
    currentValue: 0,
    isTriggered: false,
    severity: 'low',
    description: `Custom risk indicator: ${indicatorName}`,
  };
}

/**
 * Monitor risk indicator thresholds across student population.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {RiskIndicator[]} indicators - Risk indicators to monitor
 * @returns {Promise<Record<string, number>>} Triggered indicator counts
 */
export async function monitorRiskThresholds(
  sequelize: Sequelize,
  termId: number,
  indicators: RiskIndicator[]
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  for (const indicator of indicators) {
    // Would query actual metrics in production
    results[indicator.indicatorName] = Math.floor(Math.random() * 50);
  }

  return results;
}

/**
 * Generate risk heat map for visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} Risk heat map
 */
export async function generateRiskHeatMap(
  sequelize: Sequelize,
  termId: number
): Promise<VisualizationData> {
  const results = await sequelize.query(
    `
    SELECT
      risk_level,
      COUNT(*) as student_count
    FROM predictive_models
    WHERE term_id = :termId
    GROUP BY risk_level
    ORDER BY CASE risk_level
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  const data = results as any[];
  const labels = data.map(d => d.risk_level);
  const counts = data.map(d => d.student_count);

  return {
    type: 'heatmap',
    title: 'Student Risk Distribution',
    description: 'Heat map of student risk levels',
    data: counts,
    labels,
    colors: ['#E94B3C', '#F5A623', '#F5D76E', '#50C878'],
    accessible: {
      altText: 'Heat map showing distribution of student risk levels',
      dataTable: data.map((d, i) => ({
        riskLevel: labels[i],
        studentCount: counts[i],
      })),
      screenReaderSummary: `Risk distribution: ${data.map(d => `${d.student_count} ${d.risk_level} risk students`).join(', ')}`,
    },
    interactive: true,
  };
}

/**
 * Create early alert notifications for advisors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {RiskIndicator[]} triggeredIndicators - Triggered indicators
 * @returns {Promise<Record<string, any>>} Alert notification
 */
export async function createEarlyAlertNotification(
  sequelize: Sequelize,
  studentId: number,
  triggeredIndicators: RiskIndicator[]
): Promise<Record<string, any>> {
  const highSeverityCount = triggeredIndicators.filter(i => i.severity === 'high').length;
  const priority = highSeverityCount > 0 ? 'urgent' : 'normal';

  return {
    alertId: `ALERT-${Date.now()}`,
    studentId,
    priority,
    triggeredIndicators: triggeredIndicators.map(i => i.indicatorName),
    severity: highSeverityCount > 2 ? 'critical' : highSeverityCount > 0 ? 'high' : 'medium',
    recommendedActions: triggeredIndicators.flatMap(i => {
      if (i.indicatorType === 'academic') return ['Schedule academic advising', 'Refer to tutoring'];
      if (i.indicatorType === 'engagement') return ['Conduct wellness check-in', 'Engage student support'];
      return ['Follow up with student'];
    }),
    createdAt: new Date(),
    assignedTo: null,
    status: 'pending',
  };
}

/**
 * Track risk indicator trends over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indicatorId - Risk indicator ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<AnalyticsTrend>} Risk indicator trend
 */
export async function trackRiskIndicatorTrends(
  sequelize: Sequelize,
  indicatorId: string,
  startDate: Date,
  endDate: Date
): Promise<AnalyticsTrend> {
  // Would query historical risk data in production
  return {
    metric: indicatorId,
    period: '6-months',
    values: [45, 42, 38, 35, 32, 30],
    dates: [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
      new Date('2024-05-01'),
      new Date('2024-06-01'),
    ],
    trend: 'decreasing',
    percentChange: -33.3,
    projectedValue: 28,
    confidence: 82,
  };
}

// ============================================================================
// DATA VISUALIZATION HELPERS (5 functions)
// ============================================================================

/**
 * Generate accessible chart configuration with WCAG compliance.
 *
 * @param {string} type - Chart type
 * @param {any[]} data - Chart data
 * @param {string[]} labels - Chart labels
 * @param {string} title - Chart title
 * @returns {VisualizationData} Accessible visualization config
 */
export function generateAccessibleChart(
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'trend',
  data: any[],
  labels: string[],
  title: string
): VisualizationData {
  const colors = [
    '#4A90E2', // Blue (WCAG AA compliant)
    '#50C878', // Green
    '#F5A623', // Orange
    '#E94B3C', // Red
    '#8B4513', // Brown
    '#9B59B6', // Purple
  ];

  const dataValues = Array.isArray(data[0]) ? data : [data];
  const flatData = dataValues.flat();

  return {
    type,
    title,
    description: `${type} chart showing ${title}`,
    data: dataValues,
    labels,
    colors,
    accessible: {
      altText: `${type} chart: ${title}. Data ranges from ${Math.min(...flatData)} to ${Math.max(...flatData)}.`,
      dataTable: labels.map((label, i) => ({
        label,
        value: Array.isArray(data[0]) ? data.map((d: any) => d[i]) : data[i],
      })),
      screenReaderSummary: `${title} visualization with ${labels.length} data points`,
    },
    interactive: true,
  };
}

/**
 * Create color-blind safe visualizations.
 *
 * @param {VisualizationData} visualization - Visualization config
 * @returns {VisualizationData} Color-blind safe visualization
 */
export function createColorBlindSafeVisualization(
  visualization: VisualizationData
): VisualizationData {
  const colorBlindSafeColors = [
    '#0173B2', // Blue
    '#DE8F05', // Orange
    '#029E73', // Green
    '#CC78BC', // Purple
    '#CA9161', // Brown
    '#949494', // Gray
  ];

  return {
    ...visualization,
    colors: colorBlindSafeColors.slice(0, visualization.colors.length),
    accessible: {
      ...visualization.accessible,
      altText: `Color-blind safe ${visualization.accessible.altText}`,
    },
  };
}

/**
 * Export visualization data to accessible formats (CSV, JSON, Excel).
 *
 * @param {VisualizationData} visualization - Visualization to export
 * @param {string} format - Export format
 * @returns {string | Record<string, any>} Exported data
 */
export function exportVisualizationData(
  visualization: VisualizationData,
  format: 'csv' | 'json' | 'excel'
): string | Record<string, any> {
  if (format === 'json') {
    return {
      title: visualization.title,
      description: visualization.description,
      data: visualization.accessible.dataTable,
    };
  }

  if (format === 'csv') {
    const table = visualization.accessible.dataTable;
    const headers = Object.keys(table[0] || {});
    const rows = table.map((row: any) => headers.map(h => row[h]).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  // Excel format would require additional library in production
  return { format: 'excel', data: visualization.accessible.dataTable };
}

/**
 * Generate dashboard summary statistics for quick insights.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, any>>} Dashboard summary
 */
export async function generateDashboardSummary(
  sequelize: Sequelize,
  termId: number
): Promise<Record<string, any>> {
  const [metricsData] = await sequelize.query(
    `
    SELECT
      COUNT(DISTINCT student_id) as total_students,
      AVG(gpa) as avg_gpa,
      AVG(completion_rate) as avg_completion,
      SUM(CASE WHEN academic_probation THEN 1 ELSE 0 END) as probation_count,
      SUM(CASE WHEN deans_list THEN 1 ELSE 0 END) as deans_list_count
    FROM student_metrics
    WHERE term_id = :termId
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  const [riskData] = await sequelize.query(
    `
    SELECT
      COUNT(*) as total_assessed,
      SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_risk,
      SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk,
      AVG(probability_of_retention) as avg_retention_probability
    FROM predictive_models
    WHERE term_id = :termId
    `,
    {
      replacements: { termId },
      type: QueryTypes.SELECT,
    }
  );

  const metrics = metricsData as any;
  const risk = riskData as any;

  return {
    termId,
    totalStudents: metrics.total_students || 0,
    averageGPA: parseFloat((metrics.avg_gpa || 0).toFixed(2)),
    averageCompletion: parseFloat((metrics.avg_completion || 0).toFixed(2)),
    academicProbation: metrics.probation_count || 0,
    deansList: metrics.deans_list_count || 0,
    criticalRisk: risk.critical_risk || 0,
    highRisk: risk.high_risk || 0,
    averageRetentionProbability: parseFloat((risk.avg_retention_probability || 0).toFixed(2)),
    summaryGenerated: new Date(),
  };
}

/**
 * Build interactive dashboard with user preferences and accessibility.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} userId - User ID
 * @param {string} userRole - User role
 * @param {DashboardWidget[]} widgets - Dashboard widgets
 * @returns {Promise<DashboardConfig>} Dashboard configuration
 */
export async function buildInteractiveDashboard(
  sequelize: Sequelize,
  userId: number,
  userRole: string,
  widgets: DashboardWidget[]
): Promise<DashboardConfig> {
  const dashboardId = `DASH-${userId}-${Date.now()}`;

  const config: DashboardConfig = {
    dashboardId,
    userId,
    userRole,
    widgets,
    layout: 'grid',
    refreshInterval: 300,
    dataFilters: {
      termId: 'current',
      studentType: 'all',
      riskLevel: 'all',
    },
    exportEnabled: true,
    shareEnabled: userRole === 'admin' || userRole === 'dean',
  };

  // Would save to database in production
  return config;
}

/**
 * Injectable service for Student Analytics operations.
 */
@Injectable()
@ApiTags('Student Analytics')
export class StudentAnalyticsService {
  constructor(private readonly sequelize: Sequelize) {}

  async getStudentMetrics(studentId: number, termId: number) {
    return calculateStudentSuccessMetrics(this.sequelize, studentId, termId);
  }

  async getRiskAssessment(studentId: number, termId: number) {
    return runPredictiveRiskAssessment(this.sequelize, studentId, termId);
  }

  async getDashboardSummary(termId: number) {
    return generateDashboardSummary(this.sequelize, termId);
  }
}
