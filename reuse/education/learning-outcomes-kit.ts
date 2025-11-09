/**
 * LOC: EDU-LO-KIT-001
 * File: /reuse/education/learning-outcomes-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - rxjs (v7.x) for reactive state management
 *
 * DOWNSTREAM (imported by):
 *   - Assessment modules
 *   - Accreditation reporting
 *   - Program evaluation systems
 */

/**
 * File: /reuse/education/learning-outcomes-kit.ts
 * Locator: WC-EDU-LO-KIT-001
 * Purpose: Learning Outcomes Kit - Comprehensive outcome definition, assessment, mapping, and accreditation reporting
 *
 * Upstream: sequelize v6.x, rxjs v7.x, validator v13.x
 * Downstream: ../backend/education/*, assessment modules, accreditation systems, program evaluation
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, RxJS 7.x
 * Exports: 45 functions for learning outcomes, assessments, mapping, reporting, accreditation, state management
 *
 * LLM Context: Production-grade learning outcomes toolkit for education SIS. Provides comprehensive tools for
 * learning outcome definition, outcome assessment with rubrics, course-to-program outcome mapping, outcome
 * reporting and analytics, accreditation compliance reporting, assessment planning and cycles, and reactive
 * state management with observable patterns. Supports regional accreditation standards and program-specific
 * accreditation requirements (ABET, AACSB, ACEN, etc.).
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';
import { BehaviorSubject, Observable, Subject, merge, combineLatest } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, shareReplay, scan } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Outcome level enumeration
 */
export enum OutcomeLevel {
  INSTITUTIONAL = 'INSTITUTIONAL',
  PROGRAM = 'PROGRAM',
  COURSE = 'COURSE',
  MODULE = 'MODULE',
  ASSIGNMENT = 'ASSIGNMENT',
}

/**
 * Outcome status enumeration
 */
export enum OutcomeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ARCHIVED = 'ARCHIVED',
  DEPRECATED = 'DEPRECATED',
}

/**
 * Assessment status enumeration
 */
export enum AssessmentStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ANALYZED = 'ANALYZED',
  REPORTED = 'REPORTED',
}

/**
 * Assessment method enumeration
 */
export enum AssessmentMethod {
  DIRECT_EXAM = 'DIRECT_EXAM',
  DIRECT_PROJECT = 'DIRECT_PROJECT',
  DIRECT_PORTFOLIO = 'DIRECT_PORTFOLIO',
  DIRECT_PERFORMANCE = 'DIRECT_PERFORMANCE',
  DIRECT_CAPSTONE = 'DIRECT_CAPSTONE',
  INDIRECT_SURVEY = 'INDIRECT_SURVEY',
  INDIRECT_INTERVIEW = 'INDIRECT_INTERVIEW',
  INDIRECT_FOCUS_GROUP = 'INDIRECT_FOCUS_GROUP',
  EMBEDDED = 'EMBEDDED',
  OTHER = 'OTHER',
}

/**
 * Proficiency level enumeration
 */
export enum ProficiencyLevel {
  EXCEEDS = 'EXCEEDS',
  MEETS = 'MEETS',
  APPROACHES = 'APPROACHES',
  DEVELOPING = 'DEVELOPING',
  UNSATISFACTORY = 'UNSATISFACTORY',
}

/**
 * Bloom's taxonomy level
 */
export enum BloomLevel {
  REMEMBER = 'REMEMBER',
  UNDERSTAND = 'UNDERSTAND',
  APPLY = 'APPLY',
  ANALYZE = 'ANALYZE',
  EVALUATE = 'EVALUATE',
  CREATE = 'CREATE',
}

/**
 * Accreditation standard type
 */
export enum AccreditationType {
  REGIONAL = 'REGIONAL',
  ABET = 'ABET',
  AACSB = 'AACSB',
  ACEN = 'ACEN',
  ABA = 'ABA',
  CAEP = 'CAEP',
  CCNE = 'CCNE',
  OTHER = 'OTHER',
}

/**
 * Learning outcome attributes
 */
export interface LearningOutcomeAttributes {
  id: string;
  code: string;
  title: string;
  description: string;
  level: OutcomeLevel;
  bloomLevel?: BloomLevel;
  status: OutcomeStatus;
  version: number;
  effectiveDate: Date;
  expirationDate?: Date;
  parentOutcomeId?: string;
  programId?: string;
  departmentId?: string;
  tags: string[];
  accreditationStandards: string[];
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Outcome assessment attributes
 */
export interface OutcomeAssessmentAttributes {
  id: string;
  outcomeId: string;
  assessmentName: string;
  assessmentMethod: AssessmentMethod;
  status: AssessmentStatus;
  academicYear: string;
  semester?: string;
  courseId?: string;
  assignmentId?: string;
  plannedDate?: Date;
  completedDate?: Date;
  sampleSize?: number;
  targetProficiency: ProficiencyLevel;
  targetPercentage: number;
  actualPercentage?: number;
  exceeds?: number;
  meets?: number;
  approaches?: number;
  developing?: number;
  unsatisfactory?: number;
  meanScore?: number;
  medianScore?: number;
  rubricId?: string;
  findings: string;
  actionItems: string[];
  closingTheLoop?: string;
  metadata: Record<string, any>;
  assessedBy: string;
  reviewedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Program outcome attributes
 */
export interface ProgramOutcomeAttributes {
  id: string;
  programId: string;
  outcomeId: string;
  sequenceNumber: number;
  isRequired: boolean;
  weight?: number;
  accreditationMappings: Record<string, string[]>;
  assessmentCycle: 'ANNUAL' | 'BIENNIAL' | 'CUSTOM';
  lastAssessedDate?: Date;
  nextAssessmentDate?: Date;
  status: OutcomeStatus;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Course outcome attributes
 */
export interface CourseOutcomeAttributes {
  id: string;
  courseId: string;
  outcomeId: string;
  programOutcomeIds: string[];
  sequenceNumber: number;
  alignmentLevel: 'INTRODUCED' | 'REINFORCED' | 'MASTERED';
  assessmentMethods: AssessmentMethod[];
  weight?: number;
  isRequired: boolean;
  syllabusMapped: boolean;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Assessment rubric attributes
 */
export interface AssessmentRubricAttributes {
  id: string;
  name: string;
  description: string;
  outcomeIds: string[];
  criteria: RubricCriterion[];
  scoringGuide: Record<string, any>;
  maxPoints: number;
  passingThreshold: number;
  isActive: boolean;
  version: number;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Rubric criterion
 */
export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
  outcomeId?: string;
}

/**
 * Rubric level
 */
export interface RubricLevel {
  proficiency: ProficiencyLevel;
  points: number;
  description: string;
}

/**
 * Assessment plan attributes
 */
export interface AssessmentPlanAttributes {
  id: string;
  programId: string;
  academicYear: string;
  planName: string;
  outcomeIds: string[];
  plannedAssessments: PlannedAssessment[];
  status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  approvedBy?: string;
  approvedDate?: Date;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Planned assessment
 */
export interface PlannedAssessment {
  outcomeId: string;
  assessmentMethod: AssessmentMethod;
  courseIds: string[];
  timeline: string;
  responsible: string[];
  notes?: string;
}

/**
 * Accreditation report attributes
 */
export interface AccreditationReportAttributes {
  id: string;
  programId: string;
  accreditationType: AccreditationType;
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  reportTitle: string;
  outcomeIds: string[];
  assessmentIds: string[];
  findings: Record<string, any>;
  improvements: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  generatedDate: Date;
  submittedDate?: Date;
  metadata: Record<string, any>;
  preparedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * State container for outcome data
 */
export interface OutcomeState {
  outcomes: Map<string, LearningOutcomeAttributes>;
  assessments: Map<string, OutcomeAssessmentAttributes>;
  programOutcomes: Map<string, ProgramOutcomeAttributes>;
  courseOutcomes: Map<string, CourseOutcomeAttributes>;
  rubrics: Map<string, AssessmentRubricAttributes>;
  plans: Map<string, AssessmentPlanAttributes>;
  reports: Map<string, AccreditationReportAttributes>;
}

/**
 * Outcome event types
 */
export enum OutcomeEventType {
  OUTCOME_CREATED = 'OUTCOME_CREATED',
  OUTCOME_UPDATED = 'OUTCOME_UPDATED',
  ASSESSMENT_PLANNED = 'ASSESSMENT_PLANNED',
  ASSESSMENT_COMPLETED = 'ASSESSMENT_COMPLETED',
  ASSESSMENT_ANALYZED = 'ASSESSMENT_ANALYZED',
  MAPPING_CREATED = 'MAPPING_CREATED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  PLAN_APPROVED = 'PLAN_APPROVED',
}

/**
 * Outcome event
 */
export interface OutcomeEvent {
  type: OutcomeEventType;
  outcomeId?: string;
  assessmentId?: string;
  programId?: string;
  timestamp: Date;
  data: any;
  userId?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * LearningOutcome model class
 */
export class LearningOutcome extends Model<LearningOutcomeAttributes> implements LearningOutcomeAttributes {
  public id!: string;
  public code!: string;
  public title!: string;
  public description!: string;
  public level!: OutcomeLevel;
  public bloomLevel?: BloomLevel;
  public status!: OutcomeStatus;
  public version!: number;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public parentOutcomeId?: string;
  public programId?: string;
  public departmentId?: string;
  public tags!: string[];
  public accreditationStandards!: string[];
  public metadata!: Record<string, any>;
  public createdBy!: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

/**
 * OutcomeAssessment model class
 */
export class OutcomeAssessment extends Model<OutcomeAssessmentAttributes> implements OutcomeAssessmentAttributes {
  public id!: string;
  public outcomeId!: string;
  public assessmentName!: string;
  public assessmentMethod!: AssessmentMethod;
  public status!: AssessmentStatus;
  public academicYear!: string;
  public semester?: string;
  public courseId?: string;
  public assignmentId?: string;
  public plannedDate?: Date;
  public completedDate?: Date;
  public sampleSize?: number;
  public targetProficiency!: ProficiencyLevel;
  public targetPercentage!: number;
  public actualPercentage?: number;
  public exceeds?: number;
  public meets?: number;
  public approaches?: number;
  public developing?: number;
  public unsatisfactory?: number;
  public meanScore?: number;
  public medianScore?: number;
  public rubricId?: string;
  public findings!: string;
  public actionItems!: string[];
  public closingTheLoop?: string;
  public metadata!: Record<string, any>;
  public assessedBy!: string;
  public reviewedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * ProgramOutcome model class
 */
export class ProgramOutcome extends Model<ProgramOutcomeAttributes> implements ProgramOutcomeAttributes {
  public id!: string;
  public programId!: string;
  public outcomeId!: string;
  public sequenceNumber!: number;
  public isRequired!: boolean;
  public weight?: number;
  public accreditationMappings!: Record<string, string[]>;
  public assessmentCycle!: 'ANNUAL' | 'BIENNIAL' | 'CUSTOM';
  public lastAssessedDate?: Date;
  public nextAssessmentDate?: Date;
  public status!: OutcomeStatus;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * CourseOutcome model class
 */
export class CourseOutcome extends Model<CourseOutcomeAttributes> implements CourseOutcomeAttributes {
  public id!: string;
  public courseId!: string;
  public outcomeId!: string;
  public programOutcomeIds!: string[];
  public sequenceNumber!: number;
  public alignmentLevel!: 'INTRODUCED' | 'REINFORCED' | 'MASTERED';
  public assessmentMethods!: AssessmentMethod[];
  public weight?: number;
  public isRequired!: boolean;
  public syllabusMapped!: boolean;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * AssessmentRubric model class
 */
export class AssessmentRubric extends Model<AssessmentRubricAttributes> implements AssessmentRubricAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public outcomeIds!: string[];
  public criteria!: RubricCriterion[];
  public scoringGuide!: Record<string, any>;
  public maxPoints!: number;
  public passingThreshold!: number;
  public isActive!: boolean;
  public version!: number;
  public metadata!: Record<string, any>;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * AssessmentPlan model class
 */
export class AssessmentPlan extends Model<AssessmentPlanAttributes> implements AssessmentPlanAttributes {
  public id!: string;
  public programId!: string;
  public academicYear!: string;
  public planName!: string;
  public outcomeIds!: string[];
  public plannedAssessments!: PlannedAssessment[];
  public status!: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  public approvedBy?: string;
  public approvedDate?: Date;
  public metadata!: Record<string, any>;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * AccreditationReport model class
 */
export class AccreditationReport extends Model<AccreditationReportAttributes> implements AccreditationReportAttributes {
  public id!: string;
  public programId!: string;
  public accreditationType!: AccreditationType;
  public reportingPeriodStart!: Date;
  public reportingPeriodEnd!: Date;
  public reportTitle!: string;
  public outcomeIds!: string[];
  public assessmentIds!: string[];
  public findings!: Record<string, any>;
  public improvements!: string[];
  public status!: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  public generatedDate!: Date;
  public submittedDate?: Date;
  public metadata!: Record<string, any>;
  public preparedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ============================================================================
// MODEL INITIALIZATION
// ============================================================================

/**
 * Initialize LearningOutcome model
 */
export function initLearningOutcomeModel(sequelize: Sequelize): typeof LearningOutcome {
  LearningOutcome.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM(...Object.values(OutcomeLevel)),
        allowNull: false,
      },
      bloomLevel: {
        type: DataTypes.ENUM(...Object.values(BloomLevel)),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OutcomeStatus)),
        allowNull: false,
        defaultValue: OutcomeStatus.DRAFT,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      parentOutcomeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'learning_outcomes',
          key: 'id',
        },
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      accreditationStandards: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'learning_outcomes',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['code'] },
        { fields: ['level'] },
        { fields: ['status'] },
        { fields: ['programId'] },
        { fields: ['departmentId'] },
      ],
    }
  );

  return LearningOutcome;
}

/**
 * Initialize OutcomeAssessment model
 */
export function initOutcomeAssessmentModel(sequelize: Sequelize): typeof OutcomeAssessment {
  OutcomeAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      outcomeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'learning_outcomes',
          key: 'id',
        },
      },
      assessmentName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      assessmentMethod: {
        type: DataTypes.ENUM(...Object.values(AssessmentMethod)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AssessmentStatus)),
        allowNull: false,
        defaultValue: AssessmentStatus.PLANNED,
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      assignmentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      plannedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sampleSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      targetProficiency: {
        type: DataTypes.ENUM(...Object.values(ProficiencyLevel)),
        allowNull: false,
      },
      targetPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      actualPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      exceeds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      meets: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approaches: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      developing: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      unsatisfactory: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      meanScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      medianScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      rubricId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      actionItems: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      closingTheLoop: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      assessedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'outcome_assessments',
      timestamps: true,
      indexes: [
        { fields: ['outcomeId'] },
        { fields: ['status'] },
        { fields: ['academicYear'] },
        { fields: ['courseId'] },
        { fields: ['assessmentMethod'] },
      ],
    }
  );

  return OutcomeAssessment;
}

/**
 * Initialize ProgramOutcome model
 */
export function initProgramOutcomeModel(sequelize: Sequelize): typeof ProgramOutcome {
  ProgramOutcome.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      outcomeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'learning_outcomes',
          key: 'id',
        },
      },
      sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      accreditationMappings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      assessmentCycle: {
        type: DataTypes.ENUM('ANNUAL', 'BIENNIAL', 'CUSTOM'),
        allowNull: false,
        defaultValue: 'ANNUAL',
      },
      lastAssessedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextAssessmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OutcomeStatus)),
        allowNull: false,
        defaultValue: OutcomeStatus.ACTIVE,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'program_outcomes',
      timestamps: true,
      indexes: [
        { fields: ['programId'] },
        { fields: ['outcomeId'] },
        { fields: ['programId', 'sequenceNumber'] },
        { unique: true, fields: ['programId', 'outcomeId'] },
      ],
    }
  );

  return ProgramOutcome;
}

/**
 * Initialize CourseOutcome model
 */
export function initCourseOutcomeModel(sequelize: Sequelize): typeof CourseOutcome {
  CourseOutcome.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      outcomeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'learning_outcomes',
          key: 'id',
        },
      },
      programOutcomeIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      alignmentLevel: {
        type: DataTypes.ENUM('INTRODUCED', 'REINFORCED', 'MASTERED'),
        allowNull: false,
        defaultValue: 'INTRODUCED',
      },
      assessmentMethods: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      syllabusMapped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'course_outcomes',
      timestamps: true,
      indexes: [
        { fields: ['courseId'] },
        { fields: ['outcomeId'] },
        { fields: ['courseId', 'sequenceNumber'] },
        { unique: true, fields: ['courseId', 'outcomeId'] },
      ],
    }
  );

  return CourseOutcome;
}

/**
 * Initialize AssessmentRubric model
 */
export function initAssessmentRubricModel(sequelize: Sequelize): typeof AssessmentRubric {
  AssessmentRubric.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      outcomeIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      criteria: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      scoringGuide: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      maxPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      passingThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'assessment_rubrics',
      timestamps: true,
      indexes: [
        { fields: ['isActive'] },
        { fields: ['createdBy'] },
      ],
    }
  );

  return AssessmentRubric;
}

/**
 * Initialize AssessmentPlan model
 */
export function initAssessmentPlanModel(sequelize: Sequelize): typeof AssessmentPlan {
  AssessmentPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      planName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      outcomeIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      plannedAssessments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'assessment_plans',
      timestamps: true,
      indexes: [
        { fields: ['programId'] },
        { fields: ['academicYear'] },
        { fields: ['status'] },
        { unique: true, fields: ['programId', 'academicYear'] },
      ],
    }
  );

  return AssessmentPlan;
}

/**
 * Initialize AccreditationReport model
 */
export function initAccreditationReportModel(sequelize: Sequelize): typeof AccreditationReport {
  AccreditationReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      accreditationType: {
        type: DataTypes.ENUM(...Object.values(AccreditationType)),
        allowNull: false,
      },
      reportingPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reportingPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reportTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      outcomeIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      assessmentIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      findings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      improvements: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      generatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      preparedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'accreditation_reports',
      timestamps: true,
      indexes: [
        { fields: ['programId'] },
        { fields: ['accreditationType'] },
        { fields: ['status'] },
        { fields: ['reportingPeriodStart', 'reportingPeriodEnd'] },
      ],
    }
  );

  return AccreditationReport;
}

// ============================================================================
// STATE MANAGEMENT - REACTIVE STORE
// ============================================================================

/**
 * Outcome state store with reactive observables
 */
export class OutcomeStateStore {
  private state: BehaviorSubject<OutcomeState>;
  private events: Subject<OutcomeEvent>;

  constructor() {
    this.state = new BehaviorSubject<OutcomeState>({
      outcomes: new Map(),
      assessments: new Map(),
      programOutcomes: new Map(),
      courseOutcomes: new Map(),
      rubrics: new Map(),
      plans: new Map(),
      reports: new Map(),
    });
    this.events = new Subject<OutcomeEvent>();
  }

  /**
   * Get observable of current state
   */
  public getState$(): Observable<OutcomeState> {
    return this.state.asObservable();
  }

  /**
   * Get observable of events
   */
  public getEvents$(): Observable<OutcomeEvent> {
    return this.events.asObservable();
  }

  /**
   * Update outcome in state
   */
  public updateOutcome(outcome: LearningOutcomeAttributes): void {
    const currentState = this.state.value;
    currentState.outcomes.set(outcome.id, outcome);
    this.state.next({ ...currentState });
  }

  /**
   * Update assessment in state
   */
  public updateAssessment(assessment: OutcomeAssessmentAttributes): void {
    const currentState = this.state.value;
    currentState.assessments.set(assessment.id, assessment);
    this.state.next({ ...currentState });
  }

  /**
   * Emit outcome event
   */
  public emitEvent(event: OutcomeEvent): void {
    this.events.next(event);
  }

  /**
   * Get outcome observable by ID
   */
  public getOutcome$(outcomeId: string): Observable<LearningOutcomeAttributes | undefined> {
    return this.state.pipe(
      map(state => state.outcomes.get(outcomeId)),
      distinctUntilChanged()
    );
  }

  /**
   * Get assessments observable by outcome ID
   */
  public getAssessmentsByOutcome$(outcomeId: string): Observable<OutcomeAssessmentAttributes[]> {
    return this.state.pipe(
      map(state =>
        Array.from(state.assessments.values()).filter(a => a.outcomeId === outcomeId)
      ),
      shareReplay(1)
    );
  }

  /**
   * Get program outcomes observable by program ID
   */
  public getProgramOutcomes$(programId: string): Observable<ProgramOutcomeAttributes[]> {
    return this.state.pipe(
      map(state =>
        Array.from(state.programOutcomes.values()).filter(po => po.programId === programId)
      ),
      shareReplay(1)
    );
  }
}

// ============================================================================
// LEARNING OUTCOME FUNCTIONS
// ============================================================================

/**
 * Create learning outcome
 */
export async function createLearningOutcome(
  data: Partial<LearningOutcomeAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<LearningOutcome> {
  const code = data.code || await generateOutcomeCode(data.level!, data.programId);

  const outcome = await LearningOutcome.create(
    {
      ...data,
      code,
      status: data.status || OutcomeStatus.DRAFT,
      version: 1,
      tags: data.tags || [],
      accreditationStandards: data.accreditationStandards || [],
      metadata: data.metadata || {},
      createdBy: userId,
    } as LearningOutcomeAttributes,
    { transaction }
  );

  return outcome;
}

/**
 * Generate outcome code
 */
export async function generateOutcomeCode(
  level: OutcomeLevel,
  programId?: string
): Promise<string> {
  const levelPrefix = level.substring(0, 3);
  const programPrefix = programId ? programId.substring(0, 4).toUpperCase() : 'GEN';
  const timestamp = Date.now().toString(36);
  return `${levelPrefix}-${programPrefix}-${timestamp}`.toUpperCase();
}

/**
 * Update learning outcome
 */
export async function updateLearningOutcome(
  outcomeId: string,
  data: Partial<LearningOutcomeAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<LearningOutcome> {
  const outcome = await LearningOutcome.findByPk(outcomeId, { transaction });
  if (!outcome) {
    throw new Error(`Learning outcome not found: ${outcomeId}`);
  }

  await outcome.update(
    {
      ...data,
      updatedBy: userId,
    },
    { transaction }
  );

  return outcome;
}

/**
 * Version learning outcome
 */
export async function versionLearningOutcome(
  outcomeId: string,
  userId: string,
  transaction?: Transaction
): Promise<LearningOutcome> {
  const originalOutcome = await LearningOutcome.findByPk(outcomeId, { transaction });
  if (!originalOutcome) {
    throw new Error(`Learning outcome not found: ${outcomeId}`);
  }

  // Archive the original
  originalOutcome.status = OutcomeStatus.ARCHIVED;
  originalOutcome.expirationDate = new Date();
  await originalOutcome.save({ transaction });

  // Create new version
  const newOutcome = await LearningOutcome.create(
    {
      code: originalOutcome.code,
      title: originalOutcome.title,
      description: originalOutcome.description,
      level: originalOutcome.level,
      bloomLevel: originalOutcome.bloomLevel,
      status: OutcomeStatus.DRAFT,
      version: originalOutcome.version + 1,
      effectiveDate: new Date(),
      parentOutcomeId: originalOutcome.parentOutcomeId,
      programId: originalOutcome.programId,
      departmentId: originalOutcome.departmentId,
      tags: originalOutcome.tags,
      accreditationStandards: originalOutcome.accreditationStandards,
      metadata: { ...originalOutcome.metadata, previousVersionId: outcomeId },
      createdBy: userId,
    } as LearningOutcomeAttributes,
    { transaction }
  );

  return newOutcome;
}

/**
 * Get outcomes by level
 */
export async function getOutcomesByLevel(
  level: OutcomeLevel,
  options?: FindOptions
): Promise<LearningOutcome[]> {
  return LearningOutcome.findAll({
    where: { level, status: OutcomeStatus.ACTIVE },
    order: [['code', 'ASC']],
    ...options,
  });
}

/**
 * Get outcomes by program
 */
export async function getOutcomesByProgram(
  programId: string,
  options?: FindOptions
): Promise<LearningOutcome[]> {
  return LearningOutcome.findAll({
    where: { programId, status: { [Op.ne]: OutcomeStatus.DEPRECATED } },
    order: [['code', 'ASC']],
    ...options,
  });
}

// ============================================================================
// ASSESSMENT FUNCTIONS
// ============================================================================

/**
 * Create outcome assessment
 */
export async function createOutcomeAssessment(
  data: Partial<OutcomeAssessmentAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<OutcomeAssessment> {
  const assessment = await OutcomeAssessment.create(
    {
      ...data,
      status: data.status || AssessmentStatus.PLANNED,
      findings: data.findings || '',
      actionItems: data.actionItems || [],
      metadata: data.metadata || {},
      assessedBy: userId,
    } as OutcomeAssessmentAttributes,
    { transaction }
  );

  return assessment;
}

/**
 * Complete assessment with results
 */
export async function completeAssessment(
  assessmentId: string,
  results: {
    exceeds: number;
    meets: number;
    approaches: number;
    developing: number;
    unsatisfactory: number;
    sampleSize: number;
    findings: string;
    actionItems: string[];
  },
  transaction?: Transaction
): Promise<OutcomeAssessment> {
  const assessment = await OutcomeAssessment.findByPk(assessmentId, { transaction });
  if (!assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  const total = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;
  const meetsOrExceeds = results.exceeds + results.meets;
  const actualPercentage = total > 0 ? (meetsOrExceeds / total) * 100 : 0;

  const meanScore = calculateMeanScore(results);
  const medianScore = calculateMedianScore(results);

  await assessment.update(
    {
      ...results,
      actualPercentage,
      meanScore,
      medianScore,
      completedDate: new Date(),
      status: AssessmentStatus.COMPLETED,
    },
    { transaction }
  );

  return assessment;
}

/**
 * Calculate mean score from proficiency distribution
 */
function calculateMeanScore(results: {
  exceeds: number;
  meets: number;
  approaches: number;
  developing: number;
  unsatisfactory: number;
}): number {
  const proficiencyPoints = {
    exceeds: 5,
    meets: 4,
    approaches: 3,
    developing: 2,
    unsatisfactory: 1,
  };

  const totalPoints =
    results.exceeds * proficiencyPoints.exceeds +
    results.meets * proficiencyPoints.meets +
    results.approaches * proficiencyPoints.approaches +
    results.developing * proficiencyPoints.developing +
    results.unsatisfactory * proficiencyPoints.unsatisfactory;

  const totalStudents = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;

  return totalStudents > 0 ? totalPoints / totalStudents : 0;
}

/**
 * Calculate median score (approximation)
 */
function calculateMedianScore(results: {
  exceeds: number;
  meets: number;
  approaches: number;
  developing: number;
  unsatisfactory: number;
}): number {
  const total = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;
  const midpoint = total / 2;

  let cumulative = 0;
  cumulative += results.unsatisfactory;
  if (cumulative >= midpoint) return 1;

  cumulative += results.developing;
  if (cumulative >= midpoint) return 2;

  cumulative += results.approaches;
  if (cumulative >= midpoint) return 3;

  cumulative += results.meets;
  if (cumulative >= midpoint) return 4;

  return 5;
}

/**
 * Analyze assessment results
 */
export async function analyzeAssessment(
  assessmentId: string,
  transaction?: Transaction
): Promise<OutcomeAssessment> {
  const assessment = await OutcomeAssessment.findByPk(assessmentId, { transaction });
  if (!assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  if (assessment.status !== AssessmentStatus.COMPLETED) {
    throw new Error('Assessment must be completed before analysis');
  }

  assessment.status = AssessmentStatus.ANALYZED;
  await assessment.save({ transaction });

  return assessment;
}

/**
 * Get assessments by academic year
 */
export async function getAssessmentsByYear(
  academicYear: string,
  programId?: string,
  options?: FindOptions
): Promise<OutcomeAssessment[]> {
  const whereClause: WhereOptions = { academicYear };

  if (programId) {
    // Need to join with outcomes to filter by program
    const outcomes = await LearningOutcome.findAll({
      where: { programId },
      attributes: ['id'],
    });
    const outcomeIds = outcomes.map(o => o.id);
    whereClause.outcomeId = { [Op.in]: outcomeIds };
  }

  return OutcomeAssessment.findAll({
    where: whereClause,
    order: [['completedDate', 'DESC']],
    ...options,
  });
}

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

/**
 * Map course outcome to program outcome
 */
export async function mapCourseToProgram(
  courseId: string,
  outcomeId: string,
  programOutcomeIds: string[],
  alignmentLevel: 'INTRODUCED' | 'REINFORCED' | 'MASTERED',
  transaction?: Transaction
): Promise<CourseOutcome> {
  // Check if mapping already exists
  const existing = await CourseOutcome.findOne({
    where: { courseId, outcomeId },
    transaction,
  });

  if (existing) {
    // Update existing mapping
    await existing.update({ programOutcomeIds, alignmentLevel }, { transaction });
    return existing;
  }

  // Get next sequence number
  const maxSeq = await CourseOutcome.max('sequenceNumber', {
    where: { courseId },
    transaction,
  });

  const courseOutcome = await CourseOutcome.create(
    {
      courseId,
      outcomeId,
      programOutcomeIds,
      sequenceNumber: (maxSeq || 0) + 1,
      alignmentLevel,
      assessmentMethods: [],
      isRequired: true,
      syllabusMapped: false,
      metadata: {},
    } as CourseOutcomeAttributes,
    { transaction }
  );

  return courseOutcome;
}

/**
 * Add program outcome
 */
export async function addProgramOutcome(
  programId: string,
  outcomeId: string,
  accreditationMappings: Record<string, string[]>,
  transaction?: Transaction
): Promise<ProgramOutcome> {
  // Get next sequence number
  const maxSeq = await ProgramOutcome.max('sequenceNumber', {
    where: { programId },
    transaction,
  });

  const programOutcome = await ProgramOutcome.create(
    {
      programId,
      outcomeId,
      sequenceNumber: (maxSeq || 0) + 1,
      isRequired: true,
      accreditationMappings,
      assessmentCycle: 'ANNUAL',
      status: OutcomeStatus.ACTIVE,
      metadata: {},
    } as ProgramOutcomeAttributes,
    { transaction }
  );

  return programOutcome;
}

/**
 * Get course outcome mappings
 */
export async function getCourseOutcomeMappings(
  courseId: string,
  options?: FindOptions
): Promise<CourseOutcome[]> {
  return CourseOutcome.findAll({
    where: { courseId },
    order: [['sequenceNumber', 'ASC']],
    ...options,
  });
}

/**
 * Generate curriculum map
 */
export async function generateCurriculumMap(
  programId: string
): Promise<{
  programOutcomes: ProgramOutcome[];
  courseMappings: Map<string, CourseOutcome[]>;
  alignmentMatrix: Record<string, Record<string, string>>;
}> {
  const programOutcomes = await ProgramOutcome.findAll({
    where: { programId, status: OutcomeStatus.ACTIVE },
    order: [['sequenceNumber', 'ASC']],
  });

  const courseMappings = new Map<string, CourseOutcome[]>();
  const alignmentMatrix: Record<string, Record<string, string>> = {};

  for (const po of programOutcomes) {
    const courseOutcomes = await CourseOutcome.findAll({
      where: {
        programOutcomeIds: { [Op.contains]: [po.outcomeId] },
      },
    });

    for (const co of courseOutcomes) {
      if (!courseMappings.has(co.courseId)) {
        courseMappings.set(co.courseId, []);
      }
      courseMappings.get(co.courseId)!.push(co);

      if (!alignmentMatrix[co.courseId]) {
        alignmentMatrix[co.courseId] = {};
      }
      alignmentMatrix[co.courseId][po.outcomeId] = co.alignmentLevel;
    }
  }

  return { programOutcomes, courseMappings, alignmentMatrix };
}

// ============================================================================
// RUBRIC FUNCTIONS
// ============================================================================

/**
 * Create assessment rubric
 */
export async function createAssessmentRubric(
  data: Partial<AssessmentRubricAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<AssessmentRubric> {
  const rubric = await AssessmentRubric.create(
    {
      ...data,
      outcomeIds: data.outcomeIds || [],
      criteria: data.criteria || [],
      scoringGuide: data.scoringGuide || {},
      isActive: true,
      version: 1,
      metadata: data.metadata || {},
      createdBy: userId,
    } as AssessmentRubricAttributes,
    { transaction }
  );

  return rubric;
}

/**
 * Get rubrics by outcome
 */
export async function getRubricsByOutcome(
  outcomeId: string,
  options?: FindOptions
): Promise<AssessmentRubric[]> {
  return AssessmentRubric.findAll({
    where: {
      outcomeIds: { [Op.contains]: [outcomeId] },
      isActive: true,
    },
    ...options,
  });
}

// ============================================================================
// ASSESSMENT PLANNING FUNCTIONS
// ============================================================================

/**
 * Create assessment plan
 */
export async function createAssessmentPlan(
  data: Partial<AssessmentPlanAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<AssessmentPlan> {
  const plan = await AssessmentPlan.create(
    {
      ...data,
      outcomeIds: data.outcomeIds || [],
      plannedAssessments: data.plannedAssessments || [],
      status: 'DRAFT',
      metadata: data.metadata || {},
      createdBy: userId,
    } as AssessmentPlanAttributes,
    { transaction }
  );

  return plan;
}

/**
 * Approve assessment plan
 */
export async function approveAssessmentPlan(
  planId: string,
  approvedBy: string,
  transaction?: Transaction
): Promise<AssessmentPlan> {
  const plan = await AssessmentPlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new Error(`Assessment plan not found: ${planId}`);
  }

  plan.status = 'APPROVED';
  plan.approvedBy = approvedBy;
  plan.approvedDate = new Date();
  await plan.save({ transaction });

  return plan;
}

/**
 * Get assessment plan for program and year
 */
export async function getAssessmentPlan(
  programId: string,
  academicYear: string,
  options?: FindOptions
): Promise<AssessmentPlan | null> {
  return AssessmentPlan.findOne({
    where: { programId, academicYear },
    ...options,
  });
}

// ============================================================================
// ACCREDITATION REPORTING FUNCTIONS
// ============================================================================

/**
 * Generate accreditation report
 */
export async function generateAccreditationReport(
  programId: string,
  accreditationType: AccreditationType,
  periodStart: Date,
  periodEnd: Date,
  userId: string,
  transaction?: Transaction
): Promise<AccreditationReport> {
  // Get all program outcomes
  const programOutcomes = await ProgramOutcome.findAll({
    where: { programId },
    transaction,
  });

  const outcomeIds = programOutcomes.map(po => po.outcomeId);

  // Get all assessments in the period
  const assessments = await OutcomeAssessment.findAll({
    where: {
      outcomeId: { [Op.in]: outcomeIds },
      completedDate: {
        [Op.between]: [periodStart, periodEnd],
      },
      status: { [Op.in]: [AssessmentStatus.COMPLETED, AssessmentStatus.ANALYZED, AssessmentStatus.REPORTED] },
    },
    transaction,
  });

  const assessmentIds = assessments.map(a => a.id);

  // Aggregate findings
  const findings = aggregateAssessmentFindings(programOutcomes, assessments);

  const report = await AccreditationReport.create(
    {
      programId,
      accreditationType,
      reportingPeriodStart: periodStart,
      reportingPeriodEnd: periodEnd,
      reportTitle: `${accreditationType} Accreditation Report ${periodStart.getFullYear()}-${periodEnd.getFullYear()}`,
      outcomeIds,
      assessmentIds,
      findings,
      improvements: [],
      status: 'DRAFT',
      generatedDate: new Date(),
      metadata: {},
      preparedBy: userId,
    } as AccreditationReportAttributes,
    { transaction }
  );

  return report;
}

/**
 * Aggregate assessment findings
 */
function aggregateAssessmentFindings(
  programOutcomes: ProgramOutcome[],
  assessments: OutcomeAssessment[]
): Record<string, any> {
  const findings: Record<string, any> = {
    totalOutcomes: programOutcomes.length,
    totalAssessments: assessments.length,
    outcomeResults: {},
    overallPerformance: {
      averageAchievement: 0,
      targetsMet: 0,
      targetsNotMet: 0,
    },
  };

  let totalAchievement = 0;
  let targetsMet = 0;

  for (const assessment of assessments) {
    if (assessment.actualPercentage !== null && assessment.actualPercentage !== undefined) {
      totalAchievement += assessment.actualPercentage;

      if (assessment.actualPercentage >= assessment.targetPercentage) {
        targetsMet++;
      }

      findings.outcomeResults[assessment.outcomeId] = {
        targetPercentage: assessment.targetPercentage,
        actualPercentage: assessment.actualPercentage,
        targetMet: assessment.actualPercentage >= assessment.targetPercentage,
        sampleSize: assessment.sampleSize,
      };
    }
  }

  findings.overallPerformance.averageAchievement = assessments.length > 0 ? totalAchievement / assessments.length : 0;
  findings.overallPerformance.targetsMet = targetsMet;
  findings.overallPerformance.targetsNotMet = assessments.length - targetsMet;

  return findings;
}

/**
 * Submit accreditation report
 */
export async function submitAccreditationReport(
  reportId: string,
  transaction?: Transaction
): Promise<AccreditationReport> {
  const report = await AccreditationReport.findByPk(reportId, { transaction });
  if (!report) {
    throw new Error(`Accreditation report not found: ${reportId}`);
  }

  report.status = 'SUBMITTED';
  report.submittedDate = new Date();
  await report.save({ transaction });

  return report;
}

/**
 * Get accreditation reports by program
 */
export async function getAccreditationReports(
  programId: string,
  options?: FindOptions
): Promise<AccreditationReport[]> {
  return AccreditationReport.findAll({
    where: { programId },
    order: [['generatedDate', 'DESC']],
    ...options,
  });
}

// ============================================================================
// OBSERVABLE PATTERNS - REACTIVE STATE
// ============================================================================

/**
 * Create observable for outcome events
 */
export function createOutcomeEventStream(
  store: OutcomeStateStore,
  eventTypes?: OutcomeEventType[]
): Observable<OutcomeEvent> {
  const events$ = store.getEvents$();

  if (eventTypes && eventTypes.length > 0) {
    return events$.pipe(
      filter(event => eventTypes.includes(event.type))
    );
  }

  return events$;
}

/**
 * Create observable for assessment completion tracking
 */
export function createAssessmentCompletionObservable(
  store: OutcomeStateStore,
  programId: string
): Observable<{ total: number; completed: number; percentage: number }> {
  return store.getProgramOutcomes$(programId).pipe(
    map(programOutcomes => {
      const total = programOutcomes.length;
      const completed = programOutcomes.filter(po => po.lastAssessedDate !== null).length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      return { total, completed, percentage };
    })
  );
}

/**
 * Create observable for outcome achievement trends
 */
export function createAchievementTrendObservable(
  store: OutcomeStateStore,
  outcomeId: string
): Observable<number[]> {
  return store.getAssessmentsByOutcome$(outcomeId).pipe(
    map(assessments =>
      assessments
        .filter(a => a.actualPercentage !== null && a.actualPercentage !== undefined)
        .sort((a, b) => new Date(a.completedDate || 0).getTime() - new Date(b.completedDate || 0).getTime())
        .map(a => a.actualPercentage!)
    )
  );
}

/**
 * Initialize all outcome models
 */
export function initAllOutcomeModels(sequelize: Sequelize): {
  LearningOutcome: typeof LearningOutcome;
  OutcomeAssessment: typeof OutcomeAssessment;
  ProgramOutcome: typeof ProgramOutcome;
  CourseOutcome: typeof CourseOutcome;
  AssessmentRubric: typeof AssessmentRubric;
  AssessmentPlan: typeof AssessmentPlan;
  AccreditationReport: typeof AccreditationReport;
} {
  return {
    LearningOutcome: initLearningOutcomeModel(sequelize),
    OutcomeAssessment: initOutcomeAssessmentModel(sequelize),
    ProgramOutcome: initProgramOutcomeModel(sequelize),
    CourseOutcome: initCourseOutcomeModel(sequelize),
    AssessmentRubric: initAssessmentRubricModel(sequelize),
    AssessmentPlan: initAssessmentPlanModel(sequelize),
    AccreditationReport: initAccreditationReportModel(sequelize),
  };
}
