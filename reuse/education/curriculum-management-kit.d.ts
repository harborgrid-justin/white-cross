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
import { Model, ModelStatic, Sequelize } from 'sequelize';
/**
 * Program degree levels
 */
export declare enum DegreeLevel {
    CERTIFICATE = "CERTIFICATE",
    ASSOCIATE = "ASSOCIATE",
    BACHELOR = "BACHELOR",
    MASTER = "MASTER",
    DOCTORAL = "DOCTORAL",
    POST_DOCTORAL = "POST_DOCTORAL"
}
/**
 * Program delivery modes
 */
export declare enum DeliveryMode {
    ON_CAMPUS = "ON_CAMPUS",
    ONLINE = "ONLINE",
    HYBRID = "HYBRID",
    DISTANCE = "DISTANCE"
}
/**
 * Program status
 */
export declare enum ProgramStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    DISCONTINUED = "DISCONTINUED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Curriculum revision status
 */
export declare enum RevisionStatus {
    DRAFT = "DRAFT",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IMPLEMENTED = "IMPLEMENTED",
    SUPERSEDED = "SUPERSEDED"
}
/**
 * Requirement types
 */
export declare enum RequirementType {
    CORE = "CORE",
    MAJOR = "MAJOR",
    MINOR = "MINOR",
    ELECTIVE = "ELECTIVE",
    GENERAL_EDUCATION = "GENERAL_EDUCATION",
    CONCENTRATION = "CONCENTRATION",
    CAPSTONE = "CAPSTONE",
    INTERNSHIP = "INTERNSHIP"
}
/**
 * Requirement fulfillment modes
 */
export declare enum FulfillmentMode {
    SPECIFIC_COURSES = "SPECIFIC_COURSES",
    COURSE_GROUP = "COURSE_GROUP",
    CREDIT_HOURS = "CREDIT_HOURS",
    GPA_REQUIREMENT = "GPA_REQUIREMENT",
    COMPETENCY = "COMPETENCY"
}
/**
 * Approval workflow stages
 */
export declare enum ApprovalStage {
    DEPARTMENT = "DEPARTMENT",
    COLLEGE = "COLLEGE",
    CURRICULUM_COMMITTEE = "CURRICULUM_COMMITTEE",
    ACADEMIC_SENATE = "ACADEMIC_SENATE",
    PROVOST = "PROVOST",
    BOARD = "BOARD"
}
/**
 * Approval decision
 */
export declare enum ApprovalDecision {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    RETURNED = "RETURNED"
}
/**
 * Articulation agreement types
 */
export declare enum ArticulationAgreementType {
    COURSE_TO_COURSE = "COURSE_TO_COURSE",
    PROGRAM_TO_PROGRAM = "PROGRAM_TO_PROGRAM",
    GENERAL_TRANSFER = "GENERAL_TRANSFER",
    GUARANTEED_ADMISSION = "GUARANTEED_ADMISSION"
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
export declare function createProgramModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createCurriculumModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createConcentrationModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createCurriculumRevisionModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createRequirementModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createApprovalWorkflowModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createProgramCatalogModel(sequelize: Sequelize): ModelStatic<Model>;
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
export declare function createArticulationAgreementModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 9. Creates a ProgramRepository service for data access layer.
 *
 * @returns {Injectable} ProgramRepository service
 */
export declare class ProgramRepository {
    private readonly programModel;
    private readonly logger;
    constructor(programModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByCode(code: string): Promise<Model | null>;
    search(criteria: ProgramSearchCriteria): Promise<Model[]>;
    create(data: Partial<ProgramAttributes>): Promise<Model>;
    update(id: string, data: Partial<ProgramAttributes>): Promise<Model>;
    delete(id: string): Promise<void>;
}
/**
 * 10. Creates a CurriculumRepository service.
 *
 * @returns {Injectable} CurriculumRepository service
 */
export declare class CurriculumRepository {
    private readonly curriculumModel;
    private readonly logger;
    constructor(curriculumModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByProgram(programId: string): Promise<Model[]>;
    findActiveCurriculum(programId: string): Promise<Model | null>;
    create(data: Partial<CurriculumAttributes>): Promise<Model>;
    update(id: string, data: Partial<CurriculumAttributes>): Promise<Model>;
    setActive(curriculumId: string, programId: string): Promise<Model>;
}
/**
 * 11. Creates a RequirementRepository service.
 *
 * @returns {Injectable} RequirementRepository service
 */
export declare class RequirementRepository {
    private readonly requirementModel;
    private readonly logger;
    constructor(requirementModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByCurriculum(curriculumId: string): Promise<Model[]>;
    findByType(curriculumId: string, type: RequirementType): Promise<Model[]>;
    create(data: Partial<RequirementAttributes>): Promise<Model>;
    update(id: string, data: Partial<RequirementAttributes>): Promise<Model>;
    delete(id: string): Promise<void>;
    reorder(curriculumId: string, requirementIds: string[]): Promise<void>;
}
/**
 * 12. Creates a CurriculumRevisionRepository service.
 *
 * @returns {Injectable} CurriculumRevisionRepository service
 */
export declare class CurriculumRevisionRepository {
    private readonly revisionModel;
    private readonly logger;
    constructor(revisionModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByCurriculum(curriculumId: string): Promise<Model[]>;
    findPendingRevisions(): Promise<Model[]>;
    create(data: Partial<CurriculumRevisionAttributes>): Promise<Model>;
    update(id: string, data: Partial<CurriculumRevisionAttributes>): Promise<Model>;
    approve(id: string, approvedBy: string): Promise<Model>;
    reject(id: string, rejectedBy: string, reason: string): Promise<Model>;
    implement(id: string): Promise<Model>;
}
/**
 * 13. Creates an ApprovalWorkflowRepository service.
 *
 * @returns {Injectable} ApprovalWorkflowRepository service
 */
export declare class ApprovalWorkflowRepository {
    private readonly workflowModel;
    private readonly logger;
    constructor(workflowModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByResource(resourceType: string, resourceId: string): Promise<Model[]>;
    findPendingApprovals(stage: ApprovalStage): Promise<Model[]>;
    create(data: Partial<ApprovalWorkflowAttributes>): Promise<Model>;
    update(id: string, data: Partial<ApprovalWorkflowAttributes>): Promise<Model>;
    approve(id: string, reviewedBy: string, comments?: string): Promise<Model>;
    reject(id: string, reviewedBy: string, comments: string): Promise<Model>;
}
/**
 * 14. Creates a ProgramCatalogRepository service.
 *
 * @returns {Injectable} ProgramCatalogRepository service
 */
export declare class ProgramCatalogRepository {
    private readonly catalogModel;
    private readonly logger;
    constructor(catalogModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByProgram(programId: string, academicYear?: string): Promise<Model | null>;
    findPublished(academicYear: string): Promise<Model[]>;
    create(data: Partial<ProgramCatalogAttributes>): Promise<Model>;
    update(id: string, data: Partial<ProgramCatalogAttributes>): Promise<Model>;
    publish(id: string): Promise<Model>;
    incrementViewCount(id: string): Promise<void>;
}
/**
 * 15. Creates an ArticulationAgreementRepository service.
 *
 * @returns {Injectable} ArticulationAgreementRepository service
 */
export declare class ArticulationAgreementRepository {
    private readonly agreementModel;
    private readonly logger;
    constructor(agreementModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByInstitution(institutionId: string): Promise<Model[]>;
    findByProgram(programId: string): Promise<Model[]>;
    create(data: Partial<ArticulationAgreementAttributes>): Promise<Model>;
    update(id: string, data: Partial<ArticulationAgreementAttributes>): Promise<Model>;
    deactivate(id: string): Promise<Model>;
}
/**
 * 16. Creates a ProgramService with comprehensive business logic.
 *
 * @returns {Injectable} ProgramService
 */
export declare class ProgramService {
    private readonly programRepository;
    private readonly workflowRepository;
    private readonly logger;
    constructor(programRepository: ProgramRepository, workflowRepository: ApprovalWorkflowRepository);
    createProgram(options: CreateProgramOptions): Promise<Model>;
    updateProgram(programId: string, updates: Partial<ProgramAttributes>): Promise<Model>;
    submitForApproval(programId: string): Promise<void>;
    approveProgram(programId: string): Promise<Model>;
    activateProgram(programId: string): Promise<Model>;
    suspendProgram(programId: string, reason: string): Promise<Model>;
    discontinueProgram(programId: string): Promise<Model>;
    searchPrograms(criteria: ProgramSearchCriteria): Promise<Model[]>;
}
/**
 * 17. Creates a CurriculumService for curriculum management.
 *
 * @returns {Injectable} CurriculumService
 */
export declare class CurriculumService {
    private readonly curriculumRepository;
    private readonly programRepository;
    private readonly logger;
    constructor(curriculumRepository: CurriculumRepository, programRepository: ProgramRepository);
    createCurriculum(options: CreateCurriculumOptions): Promise<Model>;
    activateCurriculum(curriculumId: string): Promise<Model>;
    getActiveCurriculum(programId: string): Promise<Model>;
    getCurriculumHistory(programId: string): Promise<Model[]>;
    updateCurriculum(curriculumId: string, updates: Partial<CurriculumAttributes>): Promise<Model>;
    expireCurriculum(curriculumId: string, expirationDate: Date): Promise<Model>;
}
/**
 * 18. Creates a RequirementService for requirement management.
 *
 * @returns {Injectable} RequirementService
 */
export declare class RequirementService {
    private readonly requirementRepository;
    private readonly curriculumRepository;
    private readonly logger;
    constructor(requirementRepository: RequirementRepository, curriculumRepository: CurriculumRepository);
    createRequirement(options: CreateRequirementOptions): Promise<Model>;
    updateRequirement(requirementId: string, updates: Partial<RequirementAttributes>): Promise<Model>;
    deleteRequirement(requirementId: string): Promise<void>;
    getRequirementsByCurriculum(curriculumId: string): Promise<Model[]>;
    getRequirementsByType(curriculumId: string, type: RequirementType): Promise<Model[]>;
    reorderRequirements(curriculumId: string, requirementIds: string[]): Promise<void>;
    addPrerequisite(requirementId: string, prerequisite: {
        courseId: string;
        minGrade?: string;
    }): Promise<Model>;
    addCorequisite(requirementId: string, corequisite: {
        courseId: string;
    }): Promise<Model>;
}
/**
 * 19. Creates a CurriculumRevisionService.
 *
 * @returns {Injectable} CurriculumRevisionService
 */
export declare class CurriculumRevisionService {
    private readonly revisionRepository;
    private readonly curriculumRepository;
    private readonly logger;
    constructor(revisionRepository: CurriculumRevisionRepository, curriculumRepository: CurriculumRepository);
    createRevision(options: CreateRevisionOptions): Promise<Model>;
    submitForReview(revisionId: string): Promise<Model>;
    approveRevision(revisionId: string, approvedBy: string): Promise<Model>;
    rejectRevision(revisionId: string, rejectedBy: string, reason: string): Promise<Model>;
    implementRevision(revisionId: string): Promise<Model>;
    getRevisionHistory(curriculumId: string): Promise<Model[]>;
}
/**
 * 20. Creates an ApprovalWorkflowService.
 *
 * @returns {Injectable} ApprovalWorkflowService
 */
export declare class ApprovalWorkflowService {
    private readonly workflowRepository;
    private readonly logger;
    constructor(workflowRepository: ApprovalWorkflowRepository);
    initiateWorkflow(resourceType: string, resourceId: string, initialStage?: ApprovalStage): Promise<Model>;
    approve(workflowId: string, reviewedBy: string, comments?: string): Promise<Model>;
    reject(workflowId: string, reviewedBy: string, comments: string): Promise<Model>;
    getPendingApprovals(stage: ApprovalStage): Promise<Model[]>;
    getWorkflowHistory(resourceType: string, resourceId: string): Promise<Model[]>;
    private getNextApprovalStage;
}
/**
 * 21. Creates a ProgramCatalogService.
 *
 * @returns {Injectable} ProgramCatalogService
 */
export declare class ProgramCatalogService {
    private readonly catalogRepository;
    private readonly logger;
    constructor(catalogRepository: ProgramCatalogRepository);
    createCatalogEntry(programId: string, academicYear: string, catalogDescription: string): Promise<Model>;
    updateCatalogEntry(catalogId: string, updates: Partial<ProgramCatalogAttributes>): Promise<Model>;
    publishCatalog(catalogId: string): Promise<Model>;
    getPublishedCatalogs(academicYear: string): Promise<Model[]>;
    incrementViews(catalogId: string): Promise<void>;
}
/**
 * 22. Creates an ArticulationAgreementService.
 *
 * @returns {Injectable} ArticulationAgreementService
 */
export declare class ArticulationAgreementService {
    private readonly agreementRepository;
    private readonly logger;
    constructor(agreementRepository: ArticulationAgreementRepository);
    createAgreement(data: Partial<ArticulationAgreementAttributes>): Promise<Model>;
    signAgreement(agreementId: string, signedBy: string): Promise<Model>;
    getAgreementsByInstitution(institutionId: string): Promise<Model[]>;
    getAgreementsByProgram(programId: string): Promise<Model[]>;
    deactivateAgreement(agreementId: string): Promise<Model>;
    addCourseMapping(agreementId: string, mapping: {
        sourceCourseId: string;
        targetCourseId: string;
        credits: number;
    }): Promise<Model>;
}
/**
 * 23. Validates program code format.
 *
 * @param {string} code - Program code
 * @returns {boolean} Whether code is valid
 */
export declare function validateProgramCode(code: string): boolean;
/**
 * 24. Calculates total credits from requirements.
 *
 * @param {Model[]} requirements - Array of requirements
 * @returns {number} Total credits
 */
export declare function calculateTotalCredits(requirements: Model[]): number;
/**
 * 25. Validates curriculum version number format.
 *
 * @param {string} versionNumber - Version number
 * @returns {boolean} Whether version is valid
 */
export declare function validateVersionNumber(versionNumber: string): boolean;
/**
 * 26. Compares version numbers.
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export declare function compareVersions(version1: string, version2: string): number;
/**
 * 27. Generates CIP code validation.
 *
 * @param {string} cipCode - CIP code
 * @returns {boolean} Whether CIP code is valid
 */
export declare function validateCIPCode(cipCode: string): boolean;
/**
 * 28. Formats degree level for display.
 *
 * @param {DegreeLevel} level - Degree level
 * @returns {string} Formatted degree level
 */
export declare function formatDegreeLevel(level: DegreeLevel): string;
/**
 * 29. Checks if curriculum is expired.
 *
 * @param {Model} curriculum - Curriculum model
 * @returns {boolean} Whether curriculum is expired
 */
export declare function isCurriculumExpired(curriculum: Model): boolean;
/**
 * 30. Generates program catalog year from date.
 *
 * @param {Date} date - Reference date
 * @returns {string} Catalog year (e.g., "2025-2026")
 */
export declare function generateCatalogYear(date?: Date): string;
/**
 * 31. Validates prerequisite chain for circular dependencies.
 *
 * @param {object[]} requirements - All requirements
 * @param {string} requirementId - Requirement to check
 * @param {Set<string>} visited - Visited requirements
 * @returns {boolean} Whether chain is valid (no cycles)
 */
export declare function validatePrerequisiteChain(requirements: object[], requirementId: string, visited?: Set<string>): boolean;
/**
 * 32. Validates that total credits match sum of requirements.
 *
 * @param {number} declaredTotal - Declared total credits
 * @param {Model[]} requirements - Requirements
 * @returns {boolean} Whether totals match
 */
export declare function validateCreditTotals(declaredTotal: number, requirements: Model[]): boolean;
/**
 * 33. Validates program admission requirements structure.
 *
 * @param {object} admissionRequirements - Admission requirements object
 * @returns {boolean} Whether structure is valid
 */
export declare function validateAdmissionRequirements(admissionRequirements: any): boolean;
/**
 * 34. Checks if program can be discontinued.
 *
 * @param {Model} program - Program model
 * @param {number} activeStudentCount - Number of active students
 * @returns {object} Validation result
 */
export declare function canDiscontinueProgram(program: Model, activeStudentCount: number): {
    allowed: boolean;
    reason?: string;
};
/**
 * 35. Validates curriculum effective date.
 *
 * @param {Date} effectiveDate - Proposed effective date
 * @param {Date} programEffectiveDate - Program effective date
 * @returns {boolean} Whether effective date is valid
 */
export declare function validateCurriculumEffectiveDate(effectiveDate: Date, programEffectiveDate: Date): boolean;
/**
 * 36. Generates requirement validation report.
 *
 * @param {Model[]} requirements - Requirements to validate
 * @returns {object} Validation report
 */
export declare function generateRequirementValidationReport(requirements: Model[]): object;
/**
 * 37. Validates articulation agreement course mapping.
 *
 * @param {object[]} courseMapping - Course mappings
 * @returns {object} Validation result
 */
export declare function validateArticulationMapping(courseMapping: any[]): {
    isValid: boolean;
    errors: string[];
};
/**
 * 38. Generates program enrollment summary.
 *
 * @param {string} programId - Program ID
 * @param {object} enrollmentData - Enrollment statistics
 * @returns {object} Enrollment summary
 */
export declare function generateProgramEnrollmentSummary(programId: string, enrollmentData: {
    totalEnrolled: number;
    newEnrollments: number;
    graduations: number;
    retentionRate: number;
}): object;
/**
 * 39. Generates curriculum revision history report.
 *
 * @param {Model[]} revisions - Revision history
 * @returns {object} Revision report
 */
export declare function generateRevisionHistoryReport(revisions: Model[]): object;
/**
 * 40. Calculates average revision review time in days.
 *
 * @param {Model[]} revisions - Revisions
 * @returns {number} Average review time in days
 */
export declare function calculateAverageReviewTime(revisions: Model[]): number;
/**
 * 41. Generates approval workflow metrics.
 *
 * @param {Model[]} workflows - Workflow records
 * @returns {object} Workflow metrics
 */
export declare function generateApprovalWorkflowMetrics(workflows: Model[]): object;
/**
 * 42. Generates program catalog analytics.
 *
 * @param {Model[]} catalogs - Catalog entries
 * @returns {object} Catalog analytics
 */
export declare function generateCatalogAnalytics(catalogs: Model[]): object;
/**
 * 43. Creates provider factories for all curriculum models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider[]} Array of model providers
 */
export declare function createCurriculumModelProviders(sequelize: Sequelize): any[];
/**
 * 44. Creates curriculum module configuration with all providers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Module configuration
 */
export declare function createCurriculumModuleConfig(sequelize: Sequelize): {
    providers: any[];
    exports: any[];
};
/**
 * 45. Creates a complete curriculum management dynamic module.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Module options
 * @returns {DynamicModule} NestJS dynamic module
 */
export declare function createCurriculumManagementModule(sequelize: Sequelize, options?: {
    isGlobal?: boolean;
}): any;
export {};
//# sourceMappingURL=curriculum-management-kit.d.ts.map