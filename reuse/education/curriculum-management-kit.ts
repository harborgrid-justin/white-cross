/**
 * @fileoverview Curriculum Management Kit - Comprehensive curriculum and program management
 * @module reuse/education/curriculum-management-kit
 * @description Complete curriculum management system with NestJS services, Sequelize models,
 * program creation, curriculum versioning, requirement management, approval workflows,
 * program catalog, and articulation agreements. Implements proper IoC patterns, service
 * layer architecture, and business logic separation.
 *
 * Key Features:
 * - Comprehensive Sequelize models for curriculum domain
 * - Program creation and modification workflows
 * - Curriculum versioning and revision tracking
 * - Degree requirement management
 * - Course prerequisite and corequisite handling
 * - Program approval workflow with multi-level authorization
 * - Program catalog with search and filtering
 * - Articulation agreement management
 * - Transfer credit evaluation
 * - NestJS providers with proper IoC patterns
 * - Factory providers and async providers
 * - Service composition and orchestration
 * - Repository pattern implementation
 * - Business logic layering
 *
 * @target NestJS 10.x, Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Role-based access control for curriculum modifications
 * - Approval workflow enforcement
 * - Audit logging for all curriculum changes
 * - Version control and change tracking
 * - Input sanitization and validation
 * - SQL injection prevention
 * - Data integrity validation
 *
 * @example Basic service usage
 * ```typescript
 * import { CurriculumService } from './curriculum-management-kit';
 *
 * @Controller('curriculum')
 * export class CurriculumController {
 *   constructor(private readonly curriculumService: CurriculumService) {}
 *
 *   @Post('programs')
 *   async createProgram(@Body() dto: CreateProgramDto) {
 *     return this.curriculumService.createProgram(dto);
 *   }
 * }
 * ```
 *
 * @example Curriculum versioning
 * ```typescript
 * const revision = await curriculumService.createRevision(
 *   curriculumId,
 *   {
 *     versionNumber: '2.0',
 *     changes: ['Updated core requirements', 'Added new electives'],
 *     effectiveDate: new Date('2026-09-01')
 *   }
 * );
 * ```
 *
 * LOC: EDU-CUR-001
 * UPSTREAM: sequelize, @nestjs/common, @nestjs/sequelize
 * DOWNSTREAM: academic-planning, course-management, degree-audit
 *
 * @version 1.0.0
 * @since 2025-11-09
 */

import {
  Injectable,
  Inject,
  Logger,
  Scope,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  Association,
  FindOptions,
  WhereOptions,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Program degree levels
 */
export enum DegreeLevel {
  CERTIFICATE = 'CERTIFICATE',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORAL = 'DOCTORAL',
  POST_DOCTORAL = 'POST_DOCTORAL',
}

/**
 * Program delivery modes
 */
export enum DeliveryMode {
  ON_CAMPUS = 'ON_CAMPUS',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
  DISTANCE = 'DISTANCE',
}

/**
 * Program status
 */
export enum ProgramStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DISCONTINUED = 'DISCONTINUED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Curriculum revision status
 */
export enum RevisionStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTED = 'IMPLEMENTED',
  SUPERSEDED = 'SUPERSEDED',
}

/**
 * Requirement types
 */
export enum RequirementType {
  CORE = 'CORE',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  ELECTIVE = 'ELECTIVE',
  GENERAL_EDUCATION = 'GENERAL_EDUCATION',
  CONCENTRATION = 'CONCENTRATION',
  CAPSTONE = 'CAPSTONE',
  INTERNSHIP = 'INTERNSHIP',
}

/**
 * Requirement fulfillment modes
 */
export enum FulfillmentMode {
  SPECIFIC_COURSES = 'SPECIFIC_COURSES',
  COURSE_GROUP = 'COURSE_GROUP',
  CREDIT_HOURS = 'CREDIT_HOURS',
  GPA_REQUIREMENT = 'GPA_REQUIREMENT',
  COMPETENCY = 'COMPETENCY',
}

/**
 * Approval workflow stages
 */
export enum ApprovalStage {
  DEPARTMENT = 'DEPARTMENT',
  COLLEGE = 'COLLEGE',
  CURRICULUM_COMMITTEE = 'CURRICULUM_COMMITTEE',
  ACADEMIC_SENATE = 'ACADEMIC_SENATE',
  PROVOST = 'PROVOST',
  BOARD = 'BOARD',
}

/**
 * Approval decision
 */
export enum ApprovalDecision {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
}

/**
 * Articulation agreement types
 */
export enum ArticulationAgreementType {
  COURSE_TO_COURSE = 'COURSE_TO_COURSE',
  PROGRAM_TO_PROGRAM = 'PROGRAM_TO_PROGRAM',
  GENERAL_TRANSFER = 'GENERAL_TRANSFER',
  GUARANTEED_ADMISSION = 'GUARANTEED_ADMISSION',
}

interface ProgramAttributes {
  id: string;
  code: string;
  title: string;
  degreeLevel: DegreeLevel;
  departmentId: string;
  collegeId?: string;
  description: string;
  deliveryMode: DeliveryMode;
  totalCreditsRequired: number;
  status: ProgramStatus;
  cipCode?: string;
  accreditation?: object[];
  admissionRequirements?: object;
  learningOutcomes?: string[];
  careerPathways?: string[];
  tuitionInfo?: object;
  catalogYear: string;
  effectiveDate: Date;
  discontinuedDate?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface CurriculumAttributes {
  id: string;
  programId: string;
  versionNumber: string;
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  totalCreditsRequired: number;
  minGPA: number;
  maxTimeToComplete?: number;
  residencyRequirement?: number;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ConcentrationAttributes {
  id: string;
  programId: string;
  code: string;
  title: string;
  description: string;
  creditsRequired: number;
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface CurriculumRevisionAttributes {
  id: string;
  curriculumId: string;
  versionNumber: string;
  status: RevisionStatus;
  changes: string[];
  rationale: string;
  proposedBy: string;
  effectiveDate: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  implementedAt?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface RequirementAttributes {
  id: string;
  curriculumId: string;
  requirementType: RequirementType;
  fulfillmentMode: FulfillmentMode;
  title: string;
  description?: string;
  creditsRequired?: number;
  minGPA?: number;
  courseIds?: string[];
  courseGroups?: object[];
  prerequisites?: object[];
  corequisites?: object[];
  isRequired: boolean;
  displayOrder: number;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ApprovalWorkflowAttributes {
  id: string;
  resourceType: string;
  resourceId: string;
  stage: ApprovalStage;
  decision: ApprovalDecision;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
  attachments?: object[];
  nextStage?: ApprovalStage;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ProgramCatalogAttributes {
  id: string;
  programId: string;
  academicYear: string;
  catalogDescription: string;
  featuredImage?: string;
  brochureUrl?: string;
  applicationDeadline?: Date;
  startDate?: Date;
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ArticulationAgreementAttributes {
  id: string;
  agreementType: ArticulationAgreementType;
  sourceInstitutionId: string;
  targetProgramId?: string;
  sourceProgramId?: string;
  title: string;
  description: string;
  effectiveDate: Date;
  expirationDate?: Date;
  courseMapping?: object[];
  creditTransferRules?: object;
  isActive: boolean;
  signedBy?: string;
  signedAt?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface CreateProgramOptions {
  code: string;
  title: string;
  degreeLevel: DegreeLevel;
  departmentId: string;
  description: string;
  deliveryMode: DeliveryMode;
  totalCreditsRequired: number;
  catalogYear: string;
  effectiveDate: Date;
}

interface CreateCurriculumOptions {
  programId: string;
  versionNumber: string;
  effectiveDate: Date;
  totalCreditsRequired: number;
  minGPA: number;
}

interface CreateRevisionOptions {
  curriculumId: string;
  versionNumber: string;
  changes: string[];
  rationale: string;
  proposedBy: string;
  effectiveDate: Date;
}

interface CreateRequirementOptions {
  curriculumId: string;
  requirementType: RequirementType;
  fulfillmentMode: FulfillmentMode;
  title: string;
  creditsRequired?: number;
  isRequired: boolean;
}

interface ProgramSearchCriteria {
  degreeLevel?: DegreeLevel;
  departmentId?: string;
  status?: ProgramStatus;
  deliveryMode?: DeliveryMode;
  searchText?: string;
}

interface CurriculumSearchCriteria {
  programId?: string;
  isActive?: boolean;
  effectiveDate?: Date;
}

// ============================================================================
// SECTION 1: SEQUELIZE MODELS (Functions 1-8)
// ============================================================================

/**
 * 1. Creates the Program Sequelize model with comprehensive attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Program model
 *
 * @example
 * const Program = createProgramModel(sequelize);
 * const program = await Program.create({
 *   code: 'CS-BS',
 *   title: 'Bachelor of Science in Computer Science',
 *   degreeLevel: DegreeLevel.BACHELOR,
 *   departmentId: 'dept-123',
 *   totalCreditsRequired: 120,
 *   status: ProgramStatus.ACTIVE
 * });
 */
export function createProgramModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique program code',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Official program title',
    },
    degreeLevel: {
      type: DataTypes.ENUM(...Object.values(DegreeLevel)),
      allowNull: false,
      comment: 'Degree level offered',
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Owning department',
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Owning college/school',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Program description',
    },
    deliveryMode: {
      type: DataTypes.ENUM(...Object.values(DeliveryMode)),
      allowNull: false,
      defaultValue: DeliveryMode.ON_CAMPUS,
      comment: 'Program delivery mode',
    },
    totalCreditsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 300,
      },
      comment: 'Total credits required for degree',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProgramStatus)),
      allowNull: false,
      defaultValue: ProgramStatus.DRAFT,
      comment: 'Current program status',
    },
    cipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CIP (Classification of Instructional Programs) code',
    },
    accreditation: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Accreditation information',
    },
    admissionRequirements: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Program admission requirements',
    },
    learningOutcomes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Program learning outcomes',
    },
    careerPathways: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Career pathways for graduates',
    },
    tuitionInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Tuition and fee information',
    },
    catalogYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Catalog year (e.g., 2025-2026)',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When program becomes effective',
    },
    discontinuedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When program was discontinued',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional program metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Program',
    tableName: 'programs',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['code'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['degreeLevel'],
      },
      {
        fields: ['departmentId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['catalogYear'],
      },
      {
        fields: ['effectiveDate'],
      },
      {
        name: 'programs_title_search',
        using: 'GIN',
        fields: [sequelize.fn('to_tsvector', 'english', sequelize.col('title'))],
      },
    ],
  };

  return sequelize.define('Program', attributes, options);
}

/**
 * 2. Creates the Curriculum Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Curriculum model
 *
 * @example
 * const Curriculum = createCurriculumModel(sequelize);
 * const curriculum = await Curriculum.create({
 *   programId: 'program-123',
 *   versionNumber: '1.0',
 *   isActive: true,
 *   effectiveDate: new Date('2025-09-01'),
 *   totalCreditsRequired: 120,
 *   minGPA: 2.0
 * });
 */
export function createCurriculumModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to program',
    },
    versionNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Curriculum version number',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the active curriculum',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When curriculum becomes effective',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When curriculum expires',
    },
    totalCreditsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: 'Total credits required',
    },
    minGPA: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 2.0,
      validate: {
        min: 0.0,
        max: 4.0,
      },
      comment: 'Minimum GPA requirement',
    },
    maxTimeToComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum years to complete (if applicable)',
    },
    residencyRequirement: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Minimum credits required in residency',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional curriculum metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Curriculum',
    tableName: 'curricula',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['programId'],
      },
      {
        fields: ['programId', 'versionNumber'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['effectiveDate'],
      },
      {
        fields: ['programId', 'isActive'],
        unique: true,
        where: { deletedAt: null, isActive: true },
      },
    ],
  };

  return sequelize.define('Curriculum', attributes, options);
}

/**
 * 3. Creates the Concentration Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Concentration model
 *
 * @example
 * const Concentration = createConcentrationModel(sequelize);
 * const concentration = await Concentration.create({
 *   programId: 'program-123',
 *   code: 'AI',
 *   title: 'Artificial Intelligence',
 *   creditsRequired: 18,
 *   isActive: true
 * });
 */
export function createConcentrationModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to parent program',
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Concentration code',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Concentration title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Concentration description',
    },
    creditsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: 'Credits required for concentration',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether concentration is active',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When concentration becomes effective',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When concentration expires',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional concentration metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Concentration',
    tableName: 'concentrations',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['programId'],
      },
      {
        fields: ['programId', 'code'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['effectiveDate'],
      },
    ],
  };

  return sequelize.define('Concentration', attributes, options);
}

/**
 * 4. Creates the CurriculumRevision Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} CurriculumRevision model
 *
 * @example
 * const CurriculumRevision = createCurriculumRevisionModel(sequelize);
 * const revision = await CurriculumRevision.create({
 *   curriculumId: 'curriculum-123',
 *   versionNumber: '2.0',
 *   status: RevisionStatus.DRAFT,
 *   changes: ['Updated core requirements'],
 *   rationale: 'Industry demands have changed',
 *   proposedBy: 'user-456'
 * });
 */
export function createCurriculumRevisionModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    curriculumId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to curriculum',
    },
    versionNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'New version number',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RevisionStatus)),
      allowNull: false,
      defaultValue: RevisionStatus.DRAFT,
      comment: 'Revision status',
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'List of changes in this revision',
    },
    rationale: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Rationale for revision',
    },
    proposedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who proposed the revision',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When revision becomes effective if approved',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When revision was approved',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who approved the revision',
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When revision was rejected',
    },
    rejectedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who rejected the revision',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for rejection',
    },
    implementedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When revision was implemented',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional revision metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'CurriculumRevision',
    tableName: 'curriculum_revisions',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['curriculumId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['proposedBy'],
      },
      {
        fields: ['effectiveDate'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  };

  return sequelize.define('CurriculumRevision', attributes, options);
}

/**
 * 5. Creates the Requirement Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Requirement model
 *
 * @example
 * const Requirement = createRequirementModel(sequelize);
 * const requirement = await Requirement.create({
 *   curriculumId: 'curriculum-123',
 *   requirementType: RequirementType.CORE,
 *   fulfillmentMode: FulfillmentMode.SPECIFIC_COURSES,
 *   title: 'Core Computer Science Courses',
 *   creditsRequired: 24,
 *   isRequired: true
 * });
 */
export function createRequirementModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    curriculumId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to curriculum',
    },
    requirementType: {
      type: DataTypes.ENUM(...Object.values(RequirementType)),
      allowNull: false,
      comment: 'Type of requirement',
    },
    fulfillmentMode: {
      type: DataTypes.ENUM(...Object.values(FulfillmentMode)),
      allowNull: false,
      comment: 'How requirement is fulfilled',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Requirement title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed requirement description',
    },
    creditsRequired: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: 'Credits required (if applicable)',
    },
    minGPA: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0.0,
        max: 4.0,
      },
      comment: 'Minimum GPA for this requirement',
    },
    courseIds: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Specific course IDs (if applicable)',
    },
    courseGroups: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Course groups for selection',
    },
    prerequisites: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Prerequisite requirements',
    },
    corequisites: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Corequisite requirements',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this requirement is mandatory',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Display order in curriculum',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional requirement metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Requirement',
    tableName: 'requirements',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['curriculumId'],
      },
      {
        fields: ['requirementType'],
      },
      {
        fields: ['isRequired'],
      },
      {
        fields: ['displayOrder'],
      },
      {
        name: 'requirements_course_ids_gin',
        using: 'GIN',
        fields: ['courseIds'],
      },
    ],
  };

  return sequelize.define('Requirement', attributes, options);
}

/**
 * 6. Creates the ApprovalWorkflow Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ApprovalWorkflow model
 *
 * @example
 * const ApprovalWorkflow = createApprovalWorkflowModel(sequelize);
 * const approval = await ApprovalWorkflow.create({
 *   resourceType: 'program',
 *   resourceId: 'program-123',
 *   stage: ApprovalStage.DEPARTMENT,
 *   decision: ApprovalDecision.PENDING
 * });
 */
export function createApprovalWorkflowModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    resourceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Type of resource being approved (program, curriculum, etc.)',
    },
    resourceId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of resource being approved',
    },
    stage: {
      type: DataTypes.ENUM(...Object.values(ApprovalStage)),
      allowNull: false,
      comment: 'Current approval stage',
    },
    decision: {
      type: DataTypes.ENUM(...Object.values(ApprovalDecision)),
      allowNull: false,
      defaultValue: ApprovalDecision.PENDING,
      comment: 'Approval decision',
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who reviewed at this stage',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When review was completed',
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reviewer comments',
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Supporting documents',
    },
    nextStage: {
      type: DataTypes.ENUM(...Object.values(ApprovalStage)),
      allowNull: true,
      comment: 'Next stage in workflow',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional workflow metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'ApprovalWorkflow',
    tableName: 'approval_workflows',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['resourceType', 'resourceId'],
      },
      {
        fields: ['stage'],
      },
      {
        fields: ['decision'],
      },
      {
        fields: ['reviewedBy'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  };

  return sequelize.define('ApprovalWorkflow', attributes, options);
}

/**
 * 7. Creates the ProgramCatalog Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ProgramCatalog model
 *
 * @example
 * const ProgramCatalog = createProgramCatalogModel(sequelize);
 * const catalog = await ProgramCatalog.create({
 *   programId: 'program-123',
 *   academicYear: '2025-2026',
 *   catalogDescription: 'Comprehensive CS program...',
 *   isPublished: true
 * });
 */
export function createProgramCatalogModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to program',
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Academic year for catalog',
    },
    catalogDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Public-facing program description',
    },
    featuredImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to featured image',
    },
    brochureUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to program brochure',
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Application deadline',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Program start date',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether catalog entry is published',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When catalog was published',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times viewed',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional catalog metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'ProgramCatalog',
    tableName: 'program_catalogs',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['programId'],
      },
      {
        fields: ['academicYear'],
      },
      {
        fields: ['isPublished'],
      },
      {
        fields: ['programId', 'academicYear'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['viewCount'],
      },
    ],
  };

  return sequelize.define('ProgramCatalog', attributes, options);
}

/**
 * 8. Creates the ArticulationAgreement Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ArticulationAgreement model
 *
 * @example
 * const ArticulationAgreement = createArticulationAgreementModel(sequelize);
 * const agreement = await ArticulationAgreement.create({
 *   agreementType: ArticulationAgreementType.PROGRAM_TO_PROGRAM,
 *   sourceInstitutionId: 'inst-123',
 *   targetProgramId: 'program-456',
 *   title: '2+2 Transfer Agreement',
 *   effectiveDate: new Date(),
 *   isActive: true
 * });
 */
export function createArticulationAgreementModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agreementType: {
      type: DataTypes.ENUM(...Object.values(ArticulationAgreementType)),
      allowNull: false,
      comment: 'Type of articulation agreement',
    },
    sourceInstitutionId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Source (sending) institution',
    },
    targetProgramId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Target program at receiving institution',
    },
    sourceProgramId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Source program at sending institution',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Agreement title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Agreement description',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When agreement becomes effective',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When agreement expires',
    },
    courseMapping: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Course-to-course mapping',
    },
    creditTransferRules: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Credit transfer rules and policies',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether agreement is active',
    },
    signedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who signed the agreement',
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When agreement was signed',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional agreement metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'ArticulationAgreement',
    tableName: 'articulation_agreements',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['agreementType'],
      },
      {
        fields: ['sourceInstitutionId'],
      },
      {
        fields: ['targetProgramId'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['effectiveDate'],
      },
      {
        fields: ['expirationDate'],
      },
    ],
  };

  return sequelize.define('ArticulationAgreement', attributes, options);
}

// ============================================================================
// SECTION 2: REPOSITORY PATTERN (Functions 9-15)
// ============================================================================

/**
 * 9. Creates a ProgramRepository service for data access layer.
 *
 * @returns {Injectable} ProgramRepository service
 */
@Injectable()
export class ProgramRepository {
  private readonly logger = new Logger(ProgramRepository.name);

  constructor(
    @Inject('PROGRAM_MODEL') private readonly programModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.programModel.findByPk(id);
  }

  async findByCode(code: string): Promise<Model | null> {
    return this.programModel.findOne({
      where: { code, deletedAt: null },
    });
  }

  async search(criteria: ProgramSearchCriteria): Promise<Model[]> {
    const where: WhereOptions = { deletedAt: null };

    if (criteria.degreeLevel) {
      where.degreeLevel = criteria.degreeLevel;
    }

    if (criteria.departmentId) {
      where.departmentId = criteria.departmentId;
    }

    if (criteria.status) {
      where.status = criteria.status;
    }

    if (criteria.deliveryMode) {
      where.deliveryMode = criteria.deliveryMode;
    }

    if (criteria.searchText) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${criteria.searchText}%` } },
        { description: { [Op.iLike]: `%${criteria.searchText}%` } },
        { code: { [Op.iLike]: `%${criteria.searchText}%` } },
      ];
    }

    return this.programModel.findAll({
      where,
      order: [['title', 'ASC']],
    });
  }

  async create(data: Partial<ProgramAttributes>): Promise<Model> {
    return this.programModel.create(data);
  }

  async update(id: string, data: Partial<ProgramAttributes>): Promise<Model> {
    const program = await this.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program.update(data);
  }

  async delete(id: string): Promise<void> {
    const program = await this.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    await program.destroy();
  }
}

/**
 * 10. Creates a CurriculumRepository service.
 *
 * @returns {Injectable} CurriculumRepository service
 */
@Injectable()
export class CurriculumRepository {
  private readonly logger = new Logger(CurriculumRepository.name);

  constructor(
    @Inject('CURRICULUM_MODEL') private readonly curriculumModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.curriculumModel.findByPk(id);
  }

  async findByProgram(programId: string): Promise<Model[]> {
    return this.curriculumModel.findAll({
      where: { programId, deletedAt: null },
      order: [['effectiveDate', 'DESC']],
    });
  }

  async findActiveCurriculum(programId: string): Promise<Model | null> {
    return this.curriculumModel.findOne({
      where: {
        programId,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async create(data: Partial<CurriculumAttributes>): Promise<Model> {
    return this.curriculumModel.create(data);
  }

  async update(id: string, data: Partial<CurriculumAttributes>): Promise<Model> {
    const curriculum = await this.findById(id);
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }
    return curriculum.update(data);
  }

  async setActive(curriculumId: string, programId: string): Promise<Model> {
    // Deactivate all other curricula for this program
    await this.curriculumModel.update(
      { isActive: false },
      {
        where: {
          programId,
          id: { [Op.ne]: curriculumId },
        },
      }
    );

    // Activate the specified curriculum
    const curriculum = await this.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${curriculumId} not found`);
    }

    return curriculum.update({ isActive: true });
  }
}

/**
 * 11. Creates a RequirementRepository service.
 *
 * @returns {Injectable} RequirementRepository service
 */
@Injectable()
export class RequirementRepository {
  private readonly logger = new Logger(RequirementRepository.name);

  constructor(
    @Inject('REQUIREMENT_MODEL') private readonly requirementModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.requirementModel.findByPk(id);
  }

  async findByCurriculum(curriculumId: string): Promise<Model[]> {
    return this.requirementModel.findAll({
      where: { curriculumId, deletedAt: null },
      order: [['displayOrder', 'ASC']],
    });
  }

  async findByType(curriculumId: string, type: RequirementType): Promise<Model[]> {
    return this.requirementModel.findAll({
      where: {
        curriculumId,
        requirementType: type,
        deletedAt: null,
      },
      order: [['displayOrder', 'ASC']],
    });
  }

  async create(data: Partial<RequirementAttributes>): Promise<Model> {
    return this.requirementModel.create(data);
  }

  async update(id: string, data: Partial<RequirementAttributes>): Promise<Model> {
    const requirement = await this.findById(id);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    return requirement.update(data);
  }

  async delete(id: string): Promise<void> {
    const requirement = await this.findById(id);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    await requirement.destroy();
  }

  async reorder(curriculumId: string, requirementIds: string[]): Promise<void> {
    // Update display order for each requirement
    for (let i = 0; i < requirementIds.length; i++) {
      await this.requirementModel.update(
        { displayOrder: i },
        {
          where: {
            id: requirementIds[i],
            curriculumId,
          },
        }
      );
    }
  }
}

/**
 * 12. Creates a CurriculumRevisionRepository service.
 *
 * @returns {Injectable} CurriculumRevisionRepository service
 */
@Injectable()
export class CurriculumRevisionRepository {
  private readonly logger = new Logger(CurriculumRevisionRepository.name);

  constructor(
    @Inject('CURRICULUM_REVISION_MODEL')
    private readonly revisionModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.revisionModel.findByPk(id);
  }

  async findByCurriculum(curriculumId: string): Promise<Model[]> {
    return this.revisionModel.findAll({
      where: { curriculumId, deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }

  async findPendingRevisions(): Promise<Model[]> {
    return this.revisionModel.findAll({
      where: {
        status: {
          [Op.in]: [RevisionStatus.DRAFT, RevisionStatus.UNDER_REVIEW],
        },
        deletedAt: null,
      },
      order: [['createdAt', 'ASC']],
    });
  }

  async create(data: Partial<CurriculumRevisionAttributes>): Promise<Model> {
    return this.revisionModel.create(data);
  }

  async update(id: string, data: Partial<CurriculumRevisionAttributes>): Promise<Model> {
    const revision = await this.findById(id);
    if (!revision) {
      throw new NotFoundException(`Curriculum revision with ID ${id} not found`);
    }
    return revision.update(data);
  }

  async approve(id: string, approvedBy: string): Promise<Model> {
    return this.update(id, {
      status: RevisionStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy,
    });
  }

  async reject(id: string, rejectedBy: string, reason: string): Promise<Model> {
    return this.update(id, {
      status: RevisionStatus.REJECTED,
      rejectedAt: new Date(),
      rejectedBy,
      rejectionReason: reason,
    });
  }

  async implement(id: string): Promise<Model> {
    return this.update(id, {
      status: RevisionStatus.IMPLEMENTED,
      implementedAt: new Date(),
    });
  }
}

/**
 * 13. Creates an ApprovalWorkflowRepository service.
 *
 * @returns {Injectable} ApprovalWorkflowRepository service
 */
@Injectable()
export class ApprovalWorkflowRepository {
  private readonly logger = new Logger(ApprovalWorkflowRepository.name);

  constructor(
    @Inject('APPROVAL_WORKFLOW_MODEL')
    private readonly workflowModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.workflowModel.findByPk(id);
  }

  async findByResource(resourceType: string, resourceId: string): Promise<Model[]> {
    return this.workflowModel.findAll({
      where: {
        resourceType,
        resourceId,
        deletedAt: null,
      },
      order: [['createdAt', 'ASC']],
    });
  }

  async findPendingApprovals(stage: ApprovalStage): Promise<Model[]> {
    return this.workflowModel.findAll({
      where: {
        stage,
        decision: ApprovalDecision.PENDING,
        deletedAt: null,
      },
      order: [['createdAt', 'ASC']],
    });
  }

  async create(data: Partial<ApprovalWorkflowAttributes>): Promise<Model> {
    return this.workflowModel.create(data);
  }

  async update(id: string, data: Partial<ApprovalWorkflowAttributes>): Promise<Model> {
    const workflow = await this.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Approval workflow with ID ${id} not found`);
    }
    return workflow.update(data);
  }

  async approve(id: string, reviewedBy: string, comments?: string): Promise<Model> {
    return this.update(id, {
      decision: ApprovalDecision.APPROVED,
      reviewedBy,
      reviewedAt: new Date(),
      comments,
    });
  }

  async reject(id: string, reviewedBy: string, comments: string): Promise<Model> {
    return this.update(id, {
      decision: ApprovalDecision.REJECTED,
      reviewedBy,
      reviewedAt: new Date(),
      comments,
    });
  }
}

/**
 * 14. Creates a ProgramCatalogRepository service.
 *
 * @returns {Injectable} ProgramCatalogRepository service
 */
@Injectable()
export class ProgramCatalogRepository {
  private readonly logger = new Logger(ProgramCatalogRepository.name);

  constructor(
    @Inject('PROGRAM_CATALOG_MODEL')
    private readonly catalogModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.catalogModel.findByPk(id);
  }

  async findByProgram(programId: string, academicYear?: string): Promise<Model | null> {
    const where: WhereOptions = { programId, deletedAt: null };
    if (academicYear) {
      where.academicYear = academicYear;
    }

    return this.catalogModel.findOne({ where });
  }

  async findPublished(academicYear: string): Promise<Model[]> {
    return this.catalogModel.findAll({
      where: {
        academicYear,
        isPublished: true,
        deletedAt: null,
      },
      order: [['viewCount', 'DESC']],
    });
  }

  async create(data: Partial<ProgramCatalogAttributes>): Promise<Model> {
    return this.catalogModel.create(data);
  }

  async update(id: string, data: Partial<ProgramCatalogAttributes>): Promise<Model> {
    const catalog = await this.findById(id);
    if (!catalog) {
      throw new NotFoundException(`Program catalog with ID ${id} not found`);
    }
    return catalog.update(data);
  }

  async publish(id: string): Promise<Model> {
    return this.update(id, {
      isPublished: true,
      publishedAt: new Date(),
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    const catalog = await this.findById(id);
    if (catalog) {
      await catalog.increment('viewCount');
    }
  }
}

/**
 * 15. Creates an ArticulationAgreementRepository service.
 *
 * @returns {Injectable} ArticulationAgreementRepository service
 */
@Injectable()
export class ArticulationAgreementRepository {
  private readonly logger = new Logger(ArticulationAgreementRepository.name);

  constructor(
    @Inject('ARTICULATION_AGREEMENT_MODEL')
    private readonly agreementModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.agreementModel.findByPk(id);
  }

  async findByInstitution(institutionId: string): Promise<Model[]> {
    return this.agreementModel.findAll({
      where: {
        sourceInstitutionId: institutionId,
        isActive: true,
        deletedAt: null,
      },
      order: [['effectiveDate', 'DESC']],
    });
  }

  async findByProgram(programId: string): Promise<Model[]> {
    return this.agreementModel.findAll({
      where: {
        targetProgramId: programId,
        isActive: true,
        deletedAt: null,
      },
      order: [['effectiveDate', 'DESC']],
    });
  }

  async create(data: Partial<ArticulationAgreementAttributes>): Promise<Model> {
    return this.agreementModel.create(data);
  }

  async update(id: string, data: Partial<ArticulationAgreementAttributes>): Promise<Model> {
    const agreement = await this.findById(id);
    if (!agreement) {
      throw new NotFoundException(`Articulation agreement with ID ${id} not found`);
    }
    return agreement.update(data);
  }

  async deactivate(id: string): Promise<Model> {
    return this.update(id, { isActive: false });
  }
}

// ============================================================================
// SECTION 3: CORE CURRICULUM SERVICES (Functions 16-22)
// ============================================================================

/**
 * 16. Creates a ProgramService with comprehensive business logic.
 *
 * @returns {Injectable} ProgramService
 */
@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    private readonly programRepository: ProgramRepository,
    private readonly workflowRepository: ApprovalWorkflowRepository,
  ) {}

  async createProgram(options: CreateProgramOptions): Promise<Model> {
    this.logger.log(`Creating program: ${options.code}`);

    // Check for duplicate code
    const existing = await this.programRepository.findByCode(options.code);
    if (existing) {
      throw new ConflictException(`Program with code ${options.code} already exists`);
    }

    // Create program in draft status
    const program = await this.programRepository.create({
      ...options,
      status: ProgramStatus.DRAFT,
    });

    this.logger.log(`Program ${program.get('id')} created successfully`);
    return program;
  }

  async updateProgram(programId: string, updates: Partial<ProgramAttributes>): Promise<Model> {
    const program = await this.programRepository.findById(programId);
    if (!program) {
      throw new NotFoundException(`Program with ID ${programId} not found`);
    }

    // Prevent status changes through this method
    if (updates.status) {
      throw new BadRequestException('Use dedicated status change methods');
    }

    return this.programRepository.update(programId, updates);
  }

  async submitForApproval(programId: string): Promise<void> {
    await this.programRepository.update(programId, {
      status: ProgramStatus.PENDING_APPROVAL,
    });

    // Initiate approval workflow
    await this.workflowRepository.create({
      resourceType: 'program',
      resourceId: programId,
      stage: ApprovalStage.DEPARTMENT,
      decision: ApprovalDecision.PENDING,
    });

    this.logger.log(`Program ${programId} submitted for approval`);
  }

  async approveProgram(programId: string): Promise<Model> {
    return this.programRepository.update(programId, {
      status: ProgramStatus.APPROVED,
    });
  }

  async activateProgram(programId: string): Promise<Model> {
    return this.programRepository.update(programId, {
      status: ProgramStatus.ACTIVE,
    });
  }

  async suspendProgram(programId: string, reason: string): Promise<Model> {
    const program = await this.programRepository.update(programId, {
      status: ProgramStatus.SUSPENDED,
    });

    this.logger.warn(`Program ${programId} suspended: ${reason}`);
    return program;
  }

  async discontinueProgram(programId: string): Promise<Model> {
    return this.programRepository.update(programId, {
      status: ProgramStatus.DISCONTINUED,
      discontinuedDate: new Date(),
    });
  }

  async searchPrograms(criteria: ProgramSearchCriteria): Promise<Model[]> {
    return this.programRepository.search(criteria);
  }
}

/**
 * 17. Creates a CurriculumService for curriculum management.
 *
 * @returns {Injectable} CurriculumService
 */
@Injectable()
export class CurriculumService {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(
    private readonly curriculumRepository: CurriculumRepository,
    private readonly programRepository: ProgramRepository,
  ) {}

  async createCurriculum(options: CreateCurriculumOptions): Promise<Model> {
    // Verify program exists
    const program = await this.programRepository.findById(options.programId);
    if (!program) {
      throw new NotFoundException(`Program with ID ${options.programId} not found`);
    }

    // Create curriculum
    const curriculum = await this.curriculumRepository.create({
      ...options,
      isActive: false, // Start as inactive
    });

    this.logger.log(`Curriculum ${curriculum.get('id')} created for program ${options.programId}`);
    return curriculum;
  }

  async activateCurriculum(curriculumId: string): Promise<Model> {
    const curriculum = await this.curriculumRepository.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${curriculumId} not found`);
    }

    const programId = curriculum.get('programId') as string;
    return this.curriculumRepository.setActive(curriculumId, programId);
  }

  async getActiveCurriculum(programId: string): Promise<Model> {
    const curriculum = await this.curriculumRepository.findActiveCurriculum(programId);
    if (!curriculum) {
      throw new NotFoundException(`No active curriculum found for program ${programId}`);
    }
    return curriculum;
  }

  async getCurriculumHistory(programId: string): Promise<Model[]> {
    return this.curriculumRepository.findByProgram(programId);
  }

  async updateCurriculum(curriculumId: string, updates: Partial<CurriculumAttributes>): Promise<Model> {
    return this.curriculumRepository.update(curriculumId, updates);
  }

  async expireCurriculum(curriculumId: string, expirationDate: Date): Promise<Model> {
    return this.curriculumRepository.update(curriculumId, {
      expirationDate,
      isActive: false,
    });
  }
}

/**
 * 18. Creates a RequirementService for requirement management.
 *
 * @returns {Injectable} RequirementService
 */
@Injectable()
export class RequirementService {
  private readonly logger = new Logger(RequirementService.name);

  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly curriculumRepository: CurriculumRepository,
  ) {}

  async createRequirement(options: CreateRequirementOptions): Promise<Model> {
    // Verify curriculum exists
    const curriculum = await this.curriculumRepository.findById(options.curriculumId);
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${options.curriculumId} not found`);
    }

    // Get next display order
    const existingRequirements = await this.requirementRepository.findByCurriculum(
      options.curriculumId
    );
    const displayOrder = existingRequirements.length;

    const requirement = await this.requirementRepository.create({
      ...options,
      displayOrder,
    });

    this.logger.log(`Requirement ${requirement.get('id')} created`);
    return requirement;
  }

  async updateRequirement(
    requirementId: string,
    updates: Partial<RequirementAttributes>
  ): Promise<Model> {
    return this.requirementRepository.update(requirementId, updates);
  }

  async deleteRequirement(requirementId: string): Promise<void> {
    await this.requirementRepository.delete(requirementId);
    this.logger.log(`Requirement ${requirementId} deleted`);
  }

  async getRequirementsByCurriculum(curriculumId: string): Promise<Model[]> {
    return this.requirementRepository.findByCurriculum(curriculumId);
  }

  async getRequirementsByType(
    curriculumId: string,
    type: RequirementType
  ): Promise<Model[]> {
    return this.requirementRepository.findByType(curriculumId, type);
  }

  async reorderRequirements(curriculumId: string, requirementIds: string[]): Promise<void> {
    await this.requirementRepository.reorder(curriculumId, requirementIds);
    this.logger.log(`Requirements reordered for curriculum ${curriculumId}`);
  }

  async addPrerequisite(
    requirementId: string,
    prerequisite: { courseId: string; minGrade?: string }
  ): Promise<Model> {
    const requirement = await this.requirementRepository.findById(requirementId);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${requirementId} not found`);
    }

    const prerequisites = (requirement.get('prerequisites') as object[]) || [];
    prerequisites.push(prerequisite);

    return requirement.update({ prerequisites });
  }

  async addCorequisite(
    requirementId: string,
    corequisite: { courseId: string }
  ): Promise<Model> {
    const requirement = await this.requirementRepository.findById(requirementId);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${requirementId} not found`);
    }

    const corequisites = (requirement.get('corequisites') as object[]) || [];
    corequisites.push(corequisite);

    return requirement.update({ corequisites });
  }
}

/**
 * 19. Creates a CurriculumRevisionService.
 *
 * @returns {Injectable} CurriculumRevisionService
 */
@Injectable()
export class CurriculumRevisionService {
  private readonly logger = new Logger(CurriculumRevisionService.name);

  constructor(
    private readonly revisionRepository: CurriculumRevisionRepository,
    private readonly curriculumRepository: CurriculumRepository,
  ) {}

  async createRevision(options: CreateRevisionOptions): Promise<Model> {
    // Verify curriculum exists
    const curriculum = await this.curriculumRepository.findById(options.curriculumId);
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${options.curriculumId} not found`);
    }

    const revision = await this.revisionRepository.create({
      ...options,
      status: RevisionStatus.DRAFT,
    });

    this.logger.log(`Curriculum revision ${revision.get('id')} created`);
    return revision;
  }

  async submitForReview(revisionId: string): Promise<Model> {
    return this.revisionRepository.update(revisionId, {
      status: RevisionStatus.UNDER_REVIEW,
    });
  }

  async approveRevision(revisionId: string, approvedBy: string): Promise<Model> {
    return this.revisionRepository.approve(revisionId, approvedBy);
  }

  async rejectRevision(revisionId: string, rejectedBy: string, reason: string): Promise<Model> {
    return this.revisionRepository.reject(revisionId, rejectedBy, reason);
  }

  async implementRevision(revisionId: string): Promise<Model> {
    const revision = await this.revisionRepository.findById(revisionId);
    if (!revision) {
      throw new NotFoundException(`Revision with ID ${revisionId} not found`);
    }

    if (revision.get('status') !== RevisionStatus.APPROVED) {
      throw new BadRequestException('Only approved revisions can be implemented');
    }

    // Mark old revisions as superseded
    const curriculumId = revision.get('curriculumId') as string;
    const existingRevisions = await this.revisionRepository.findByCurriculum(curriculumId);

    for (const existing of existingRevisions) {
      if (
        existing.get('status') === RevisionStatus.IMPLEMENTED &&
        existing.get('id') !== revisionId
      ) {
        await existing.update({ status: RevisionStatus.SUPERSEDED });
      }
    }

    return this.revisionRepository.implement(revisionId);
  }

  async getRevisionHistory(curriculumId: string): Promise<Model[]> {
    return this.revisionRepository.findByCurriculum(curriculumId);
  }
}

/**
 * 20. Creates an ApprovalWorkflowService.
 *
 * @returns {Injectable} ApprovalWorkflowService
 */
@Injectable()
export class ApprovalWorkflowService {
  private readonly logger = new Logger(ApprovalWorkflowService.name);

  constructor(
    private readonly workflowRepository: ApprovalWorkflowRepository,
  ) {}

  async initiateWorkflow(
    resourceType: string,
    resourceId: string,
    initialStage: ApprovalStage = ApprovalStage.DEPARTMENT
  ): Promise<Model> {
    const workflow = await this.workflowRepository.create({
      resourceType,
      resourceId,
      stage: initialStage,
      decision: ApprovalDecision.PENDING,
    });

    this.logger.log(`Approval workflow initiated for ${resourceType} ${resourceId}`);
    return workflow;
  }

  async approve(
    workflowId: string,
    reviewedBy: string,
    comments?: string
  ): Promise<Model> {
    const workflow = await this.workflowRepository.approve(workflowId, reviewedBy, comments);

    // Determine next stage
    const nextStage = this.getNextApprovalStage(workflow.get('stage') as ApprovalStage);

    if (nextStage) {
      // Create next stage workflow entry
      await this.workflowRepository.create({
        resourceType: workflow.get('resourceType') as string,
        resourceId: workflow.get('resourceId') as string,
        stage: nextStage,
        decision: ApprovalDecision.PENDING,
      });

      await workflow.update({ nextStage });
    }

    return workflow;
  }

  async reject(workflowId: string, reviewedBy: string, comments: string): Promise<Model> {
    return this.workflowRepository.reject(workflowId, reviewedBy, comments);
  }

  async getPendingApprovals(stage: ApprovalStage): Promise<Model[]> {
    return this.workflowRepository.findPendingApprovals(stage);
  }

  async getWorkflowHistory(resourceType: string, resourceId: string): Promise<Model[]> {
    return this.workflowRepository.findByResource(resourceType, resourceId);
  }

  private getNextApprovalStage(currentStage: ApprovalStage): ApprovalStage | null {
    const stageOrder: ApprovalStage[] = [
      ApprovalStage.DEPARTMENT,
      ApprovalStage.COLLEGE,
      ApprovalStage.CURRICULUM_COMMITTEE,
      ApprovalStage.ACADEMIC_SENATE,
      ApprovalStage.PROVOST,
      ApprovalStage.BOARD,
    ];

    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return null;
    }

    return stageOrder[currentIndex + 1];
  }
}

/**
 * 21. Creates a ProgramCatalogService.
 *
 * @returns {Injectable} ProgramCatalogService
 */
@Injectable()
export class ProgramCatalogService {
  private readonly logger = new Logger(ProgramCatalogService.name);

  constructor(
    private readonly catalogRepository: ProgramCatalogRepository,
  ) {}

  async createCatalogEntry(
    programId: string,
    academicYear: string,
    catalogDescription: string
  ): Promise<Model> {
    const catalog = await this.catalogRepository.create({
      programId,
      academicYear,
      catalogDescription,
      isPublished: false,
      viewCount: 0,
    });

    this.logger.log(`Catalog entry created for program ${programId}`);
    return catalog;
  }

  async updateCatalogEntry(
    catalogId: string,
    updates: Partial<ProgramCatalogAttributes>
  ): Promise<Model> {
    return this.catalogRepository.update(catalogId, updates);
  }

  async publishCatalog(catalogId: string): Promise<Model> {
    return this.catalogRepository.publish(catalogId);
  }

  async getPublishedCatalogs(academicYear: string): Promise<Model[]> {
    return this.catalogRepository.findPublished(academicYear);
  }

  async incrementViews(catalogId: string): Promise<void> {
    await this.catalogRepository.incrementViewCount(catalogId);
  }
}

/**
 * 22. Creates an ArticulationAgreementService.
 *
 * @returns {Injectable} ArticulationAgreementService
 */
@Injectable()
export class ArticulationAgreementService {
  private readonly logger = new Logger(ArticulationAgreementService.name);

  constructor(
    private readonly agreementRepository: ArticulationAgreementRepository,
  ) {}

  async createAgreement(
    data: Partial<ArticulationAgreementAttributes>
  ): Promise<Model> {
    const agreement = await this.agreementRepository.create({
      ...data,
      isActive: false, // Start inactive until signed
    });

    this.logger.log(`Articulation agreement ${agreement.get('id')} created`);
    return agreement;
  }

  async signAgreement(agreementId: string, signedBy: string): Promise<Model> {
    const agreement = await this.agreementRepository.update(agreementId, {
      isActive: true,
      signedBy,
      signedAt: new Date(),
    });

    this.logger.log(`Articulation agreement ${agreementId} signed and activated`);
    return agreement;
  }

  async getAgreementsByInstitution(institutionId: string): Promise<Model[]> {
    return this.agreementRepository.findByInstitution(institutionId);
  }

  async getAgreementsByProgram(programId: string): Promise<Model[]> {
    return this.agreementRepository.findByProgram(programId);
  }

  async deactivateAgreement(agreementId: string): Promise<Model> {
    return this.agreementRepository.deactivate(agreementId);
  }

  async addCourseMapping(
    agreementId: string,
    mapping: { sourceCourseId: string; targetCourseId: string; credits: number }
  ): Promise<Model> {
    const agreement = await this.agreementRepository.findById(agreementId);
    if (!agreement) {
      throw new NotFoundException(`Agreement with ID ${agreementId} not found`);
    }

    const courseMappings = (agreement.get('courseMapping') as object[]) || [];
    courseMappings.push(mapping);

    return agreement.update({ courseMapping: courseMappings });
  }
}

// ============================================================================
// SECTION 4: UTILITY FUNCTIONS (Functions 23-30)
// ============================================================================

/**
 * 23. Validates program code format.
 *
 * @param {string} code - Program code
 * @returns {boolean} Whether code is valid
 */
export function validateProgramCode(code: string): boolean {
  // Format: DEPT-LEVEL (e.g., CS-BS, MATH-MS)
  const codePattern = /^[A-Z]{2,10}-[A-Z]{2,10}$/;
  return codePattern.test(code);
}

/**
 * 24. Calculates total credits from requirements.
 *
 * @param {Model[]} requirements - Array of requirements
 * @returns {number} Total credits
 */
export function calculateTotalCredits(requirements: Model[]): number {
  return requirements.reduce((total, req) => {
    const credits = req.get('creditsRequired') as number || 0;
    return total + credits;
  }, 0);
}

/**
 * 25. Validates curriculum version number format.
 *
 * @param {string} versionNumber - Version number
 * @returns {boolean} Whether version is valid
 */
export function validateVersionNumber(versionNumber: string): boolean {
  // Format: X.Y or X.Y.Z
  const versionPattern = /^\d+\.\d+(\.\d+)?$/;
  return versionPattern.test(versionNumber);
}

/**
 * 26. Compares version numbers.
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
}

/**
 * 27. Generates CIP code validation.
 *
 * @param {string} cipCode - CIP code
 * @returns {boolean} Whether CIP code is valid
 */
export function validateCIPCode(cipCode: string): boolean {
  // Format: XX.XXXX or XX.XXXX.XX
  const cipPattern = /^\d{2}\.\d{4}(\.\d{2})?$/;
  return cipPattern.test(cipCode);
}

/**
 * 28. Formats degree level for display.
 *
 * @param {DegreeLevel} level - Degree level
 * @returns {string} Formatted degree level
 */
export function formatDegreeLevel(level: DegreeLevel): string {
  const formatMap: Record<DegreeLevel, string> = {
    [DegreeLevel.CERTIFICATE]: 'Certificate',
    [DegreeLevel.ASSOCIATE]: "Associate's Degree",
    [DegreeLevel.BACHELOR]: "Bachelor's Degree",
    [DegreeLevel.MASTER]: "Master's Degree",
    [DegreeLevel.DOCTORAL]: 'Doctoral Degree',
    [DegreeLevel.POST_DOCTORAL]: 'Post-Doctoral',
  };

  return formatMap[level];
}

/**
 * 29. Checks if curriculum is expired.
 *
 * @param {Model} curriculum - Curriculum model
 * @returns {boolean} Whether curriculum is expired
 */
export function isCurriculumExpired(curriculum: Model): boolean {
  const expirationDate = curriculum.get('expirationDate') as Date | null;
  if (!expirationDate) return false;

  return new Date() > new Date(expirationDate);
}

/**
 * 30. Generates program catalog year from date.
 *
 * @param {Date} date - Reference date
 * @returns {string} Catalog year (e.g., "2025-2026")
 */
export function generateCatalogYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Academic year typically starts in August/September
  const startYear = month >= 7 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
}

// ============================================================================
// SECTION 5: VALIDATION AND BUSINESS RULES (Functions 31-37)
// ============================================================================

/**
 * 31. Validates prerequisite chain for circular dependencies.
 *
 * @param {object[]} requirements - All requirements
 * @param {string} requirementId - Requirement to check
 * @param {Set<string>} visited - Visited requirements
 * @returns {boolean} Whether chain is valid (no cycles)
 */
export function validatePrerequisiteChain(
  requirements: object[],
  requirementId: string,
  visited: Set<string> = new Set()
): boolean {
  if (visited.has(requirementId)) {
    return false; // Circular dependency detected
  }

  visited.add(requirementId);

  const requirement = requirements.find((r: any) => r.id === requirementId);
  if (!requirement) return true;

  const prerequisites = (requirement as any).prerequisites || [];

  for (const prereq of prerequisites) {
    if (!validatePrerequisiteChain(requirements, prereq.courseId, new Set(visited))) {
      return false;
    }
  }

  return true;
}

/**
 * 32. Validates that total credits match sum of requirements.
 *
 * @param {number} declaredTotal - Declared total credits
 * @param {Model[]} requirements - Requirements
 * @returns {boolean} Whether totals match
 */
export function validateCreditTotals(declaredTotal: number, requirements: Model[]): boolean {
  const calculatedTotal = calculateTotalCredits(requirements);
  return Math.abs(declaredTotal - calculatedTotal) < 0.01; // Allow for floating point errors
}

/**
 * 33. Validates program admission requirements structure.
 *
 * @param {object} admissionRequirements - Admission requirements object
 * @returns {boolean} Whether structure is valid
 */
export function validateAdmissionRequirements(admissionRequirements: any): boolean {
  if (!admissionRequirements || typeof admissionRequirements !== 'object') {
    return false;
  }

  const requiredFields = ['minGPA', 'requiredTests', 'applicationDocuments'];
  return requiredFields.every(field => field in admissionRequirements);
}

/**
 * 34. Checks if program can be discontinued.
 *
 * @param {Model} program - Program model
 * @param {number} activeStudentCount - Number of active students
 * @returns {object} Validation result
 */
export function canDiscontinueProgram(
  program: Model,
  activeStudentCount: number
): { allowed: boolean; reason?: string } {
  const status = program.get('status') as ProgramStatus;

  if (status === ProgramStatus.DISCONTINUED) {
    return {
      allowed: false,
      reason: 'Program is already discontinued',
    };
  }

  if (activeStudentCount > 0) {
    return {
      allowed: false,
      reason: `Program has ${activeStudentCount} active students. Suspend instead.`,
    };
  }

  return { allowed: true };
}

/**
 * 35. Validates curriculum effective date.
 *
 * @param {Date} effectiveDate - Proposed effective date
 * @param {Date} programEffectiveDate - Program effective date
 * @returns {boolean} Whether effective date is valid
 */
export function validateCurriculumEffectiveDate(
  effectiveDate: Date,
  programEffectiveDate: Date
): boolean {
  // Curriculum effective date cannot be before program effective date
  return new Date(effectiveDate) >= new Date(programEffectiveDate);
}

/**
 * 36. Generates requirement validation report.
 *
 * @param {Model[]} requirements - Requirements to validate
 * @returns {object} Validation report
 */
export function generateRequirementValidationReport(requirements: Model[]): object {
  const issues: string[] = [];
  const warnings: string[] = [];

  let totalCredits = 0;
  const requirementTypes = new Set<string>();

  for (const req of requirements) {
    const credits = req.get('creditsRequired') as number || 0;
    totalCredits += credits;

    const type = req.get('requirementType') as string;
    requirementTypes.add(type);

    // Check for missing title
    if (!req.get('title')) {
      issues.push(`Requirement ${req.get('id')} missing title`);
    }

    // Check for zero credits on required requirements
    if (req.get('isRequired') && credits === 0) {
      warnings.push(`Required requirement ${req.get('title')} has zero credits`);
    }
  }

  // Check for missing core requirements
  if (!requirementTypes.has(RequirementType.CORE)) {
    warnings.push('No core requirements defined');
  }

  return {
    isValid: issues.length === 0,
    totalCredits,
    requirementCount: requirements.length,
    requirementTypes: Array.from(requirementTypes),
    issues,
    warnings,
  };
}

/**
 * 37. Validates articulation agreement course mapping.
 *
 * @param {object[]} courseMapping - Course mappings
 * @returns {object} Validation result
 */
export function validateArticulationMapping(courseMapping: any[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(courseMapping)) {
    errors.push('Course mapping must be an array');
    return { isValid: false, errors };
  }

  for (let i = 0; i < courseMapping.length; i++) {
    const mapping = courseMapping[i];

    if (!mapping.sourceCourseId) {
      errors.push(`Mapping ${i}: missing sourceCourseId`);
    }

    if (!mapping.targetCourseId) {
      errors.push(`Mapping ${i}: missing targetCourseId`);
    }

    if (typeof mapping.credits !== 'number' || mapping.credits <= 0) {
      errors.push(`Mapping ${i}: invalid credits value`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SECTION 6: REPORTING AND ANALYTICS (Functions 38-42)
// ============================================================================

/**
 * 38. Generates program enrollment summary.
 *
 * @param {string} programId - Program ID
 * @param {object} enrollmentData - Enrollment statistics
 * @returns {object} Enrollment summary
 */
export function generateProgramEnrollmentSummary(
  programId: string,
  enrollmentData: {
    totalEnrolled: number;
    newEnrollments: number;
    graduations: number;
    retentionRate: number;
  }
): object {
  return {
    programId,
    ...enrollmentData,
    growthRate:
      enrollmentData.totalEnrolled > 0
        ? Math.round((enrollmentData.newEnrollments / enrollmentData.totalEnrolled) * 100)
        : 0,
    completionTrend:
      enrollmentData.graduations > 0 && enrollmentData.totalEnrolled > 0
        ? Math.round((enrollmentData.graduations / enrollmentData.totalEnrolled) * 100)
        : 0,
  };
}

/**
 * 39. Generates curriculum revision history report.
 *
 * @param {Model[]} revisions - Revision history
 * @returns {object} Revision report
 */
export function generateRevisionHistoryReport(revisions: Model[]): object {
  const byStatus = revisions.reduce((acc, rev) => {
    const status = rev.get('status') as string;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgReviewTime = calculateAverageReviewTime(revisions);

  return {
    totalRevisions: revisions.length,
    revisionsByStatus: byStatus,
    averageReviewTimeDays: avgReviewTime,
    latestRevision: revisions[0]
      ? {
          id: revisions[0].get('id'),
          version: revisions[0].get('versionNumber'),
          status: revisions[0].get('status'),
        }
      : null,
  };
}

/**
 * 40. Calculates average revision review time in days.
 *
 * @param {Model[]} revisions - Revisions
 * @returns {number} Average review time in days
 */
export function calculateAverageReviewTime(revisions: Model[]): number {
  const reviewedRevisions = revisions.filter(
    (r) =>
      r.get('approvedAt') || r.get('rejectedAt')
  );

  if (reviewedRevisions.length === 0) return 0;

  const totalDays = reviewedRevisions.reduce((sum, rev) => {
    const created = new Date(rev.get('createdAt') as Date);
    const reviewed = new Date(
      (rev.get('approvedAt') || rev.get('rejectedAt')) as Date
    );
    const days = (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  return Math.round(totalDays / reviewedRevisions.length);
}

/**
 * 41. Generates approval workflow metrics.
 *
 * @param {Model[]} workflows - Workflow records
 * @returns {object} Workflow metrics
 */
export function generateApprovalWorkflowMetrics(workflows: Model[]): object {
  const byStage = workflows.reduce((acc, wf) => {
    const stage = wf.get('stage') as string;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byDecision = workflows.reduce((acc, wf) => {
    const decision = wf.get('decision') as string;
    acc[decision] = (acc[decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pending = workflows.filter(
    (wf) => wf.get('decision') === ApprovalDecision.PENDING
  ).length;

  const approved = workflows.filter(
    (wf) => wf.get('decision') === ApprovalDecision.APPROVED
  ).length;

  const approvalRate =
    workflows.length > 0 ? Math.round((approved / workflows.length) * 100) : 0;

  return {
    totalWorkflows: workflows.length,
    workflowsByStage: byStage,
    workflowsByDecision: byDecision,
    pendingCount: pending,
    approvalRate,
  };
}

/**
 * 42. Generates program catalog analytics.
 *
 * @param {Model[]} catalogs - Catalog entries
 * @returns {object} Catalog analytics
 */
export function generateCatalogAnalytics(catalogs: Model[]): object {
  const published = catalogs.filter((c) => c.get('isPublished')).length;

  const totalViews = catalogs.reduce((sum, c) => {
    return sum + (c.get('viewCount') as number || 0);
  }, 0);

  const avgViewsPerCatalog = catalogs.length > 0 ? Math.round(totalViews / catalogs.length) : 0;

  const topViewed = catalogs
    .sort((a, b) => (b.get('viewCount') as number) - (a.get('viewCount') as number))
    .slice(0, 5)
    .map((c) => ({
      programId: c.get('programId'),
      views: c.get('viewCount'),
    }));

  return {
    totalCatalogs: catalogs.length,
    publishedCount: published,
    publishRate: catalogs.length > 0 ? Math.round((published / catalogs.length) * 100) : 0,
    totalViews,
    avgViewsPerCatalog,
    topViewed,
  };
}

// ============================================================================
// SECTION 7: PROVIDER FACTORIES AND MODULE CONFIGURATION (Functions 43-45)
// ============================================================================

/**
 * 43. Creates provider factories for all curriculum models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider[]} Array of model providers
 */
export function createCurriculumModelProviders(sequelize: Sequelize): any[] {
  return [
    {
      provide: 'PROGRAM_MODEL',
      useFactory: () => createProgramModel(sequelize),
    },
    {
      provide: 'CURRICULUM_MODEL',
      useFactory: () => createCurriculumModel(sequelize),
    },
    {
      provide: 'CONCENTRATION_MODEL',
      useFactory: () => createConcentrationModel(sequelize),
    },
    {
      provide: 'CURRICULUM_REVISION_MODEL',
      useFactory: () => createCurriculumRevisionModel(sequelize),
    },
    {
      provide: 'REQUIREMENT_MODEL',
      useFactory: () => createRequirementModel(sequelize),
    },
    {
      provide: 'APPROVAL_WORKFLOW_MODEL',
      useFactory: () => createApprovalWorkflowModel(sequelize),
    },
    {
      provide: 'PROGRAM_CATALOG_MODEL',
      useFactory: () => createProgramCatalogModel(sequelize),
    },
    {
      provide: 'ARTICULATION_AGREEMENT_MODEL',
      useFactory: () => createArticulationAgreementModel(sequelize),
    },
  ];
}

/**
 * 44. Creates curriculum module configuration with all providers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Module configuration
 */
export function createCurriculumModuleConfig(sequelize: Sequelize): {
  providers: any[];
  exports: any[];
} {
  const modelProviders = createCurriculumModelProviders(sequelize);

  const serviceProviders: any[] = [
    ProgramRepository,
    CurriculumRepository,
    RequirementRepository,
    CurriculumRevisionRepository,
    ApprovalWorkflowRepository,
    ProgramCatalogRepository,
    ArticulationAgreementRepository,
    ProgramService,
    CurriculumService,
    RequirementService,
    CurriculumRevisionService,
    ApprovalWorkflowService,
    ProgramCatalogService,
    ArticulationAgreementService,
  ];

  return {
    providers: [...modelProviders, ...serviceProviders],
    exports: serviceProviders,
  };
}

/**
 * 45. Creates a complete curriculum management dynamic module.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Module options
 * @returns {DynamicModule} NestJS dynamic module
 */
export function createCurriculumManagementModule(
  sequelize: Sequelize,
  options: { isGlobal?: boolean } = {}
): any {
  const config = createCurriculumModuleConfig(sequelize);

  return {
    module: class CurriculumManagementModule {},
    global: options.isGlobal ?? false,
    providers: config.providers,
    exports: config.exports,
  };
}
