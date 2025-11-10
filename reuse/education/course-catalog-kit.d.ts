/**
 * LOC: EDUCUCRSCATL001
 * File: /reuse/education/course-catalog-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Course management controllers
 *   - Academic scheduling systems
 */
/**
 * File: /reuse/education/course-catalog-kit.ts
 * Locator: WC-EDU-CRSE-001
 * Purpose: Comprehensive Course Catalog Management - Ellucian Banner/Colleague-level SIS functionality
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Education controllers, course services, scheduling engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 45+ utility functions for course catalog, course creation, prerequisites, capacity, scheduling
 *
 * LLM Context: Enterprise-grade course catalog management system competing with Ellucian Banner/Colleague.
 * Provides complete course lifecycle management, course prerequisites/corequisites, course equivalencies,
 * capacity management, scheduling rules, course descriptions, approval workflows, section management,
 * cross-listing, attribute management, fee structures, grading policies, transfer credit evaluation.
 */
import { Model, Sequelize, Transaction, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToManyGetAssociationsMixin } from 'sequelize';
export declare enum CourseStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    DISCONTINUED = "DISCONTINUED"
}
export declare enum CourseLevel {
    UNDERGRADUATE = "UNDERGRADUATE",
    GRADUATE = "GRADUATE",
    DOCTORAL = "DOCTORAL",
    PROFESSIONAL = "PROFESSIONAL",
    CONTINUING_EDUCATION = "CONTINUING_EDUCATION",
    NON_CREDIT = "NON_CREDIT"
}
export declare enum InstructionMethod {
    IN_PERSON = "IN_PERSON",
    ONLINE = "ONLINE",
    HYBRID = "HYBRID",
    HYFLEX = "HYFLEX",
    ASYNCHRONOUS = "ASYNCHRONOUS",
    SYNCHRONOUS = "SYNCHRONOUS"
}
export declare enum GradingBasis {
    LETTER_GRADE = "LETTER_GRADE",
    PASS_FAIL = "PASS_FAIL",
    SATISFACTORY_UNSATISFACTORY = "SATISFACTORY_UNSATISFACTORY",
    AUDIT = "AUDIT",
    HONORS = "HONORS",
    CREDIT_NO_CREDIT = "CREDIT_NO_CREDIT"
}
export declare enum SectionStatus {
    PLANNING = "PLANNING",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED",
    FULL = "FULL",
    WAITLIST = "WAITLIST"
}
export declare enum PrerequisiteType {
    PREREQUISITE = "PREREQUISITE",
    COREQUISITE = "COREQUISITE",
    CONCURRENT = "CONCURRENT",
    RECOMMENDED = "RECOMMENDED",
    RESTRICTED = "RESTRICTED"
}
export declare enum ApprovalStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REVISION_REQUESTED = "REVISION_REQUESTED"
}
export interface CourseAttribute {
    attributeCode: string;
    attributeName: string;
    attributeValue: string;
    effectiveDate: Date;
    expirationDate?: Date;
}
export interface CourseFee {
    feeType: string;
    feeAmount: number;
    feeDescription: string;
    mandatory: boolean;
    refundable: boolean;
}
export interface CourseOutcome {
    outcomeId: string;
    description: string;
    assessmentMethods: string[];
    bloomLevel: number;
}
export interface SchedulingRule {
    ruleId: string;
    ruleType: 'TIME_BLOCK' | 'ROOM_TYPE' | 'INSTRUCTOR_PREFERENCE' | 'ENROLLMENT_CAP';
    parameters: Record<string, any>;
    priority: number;
}
export interface TransferEquivalency {
    institutionId: string;
    institutionName: string;
    externalCourseCode: string;
    externalCourseName: string;
    creditHours: number;
    effectiveDate: Date;
    expirationDate?: Date;
    notes?: string;
}
export declare class CourseCatalog extends Model {
    id: number;
    catalogYear: number;
    catalogTerm: string;
    catalogName: string;
    effectiveDate: Date;
    expirationDate?: Date;
    status: CourseStatus;
    description?: string;
    publishedDate?: Date;
    publishedBy?: string;
    version: number;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getCourses: HasManyGetAssociationsMixin<Course>;
    addCourse: HasManyAddAssociationMixin<Course, number>;
    createCourse: HasManyCreateAssociationMixin<Course>;
    static associations: {
        courses: Association<CourseCatalog, Course>;
    };
    static initModel(sequelize: Sequelize): typeof CourseCatalog;
}
export declare class Course extends Model {
    id: number;
    courseCode: string;
    subjectCode: string;
    courseNumber: string;
    courseTitle: string;
    longTitle?: string;
    description: string;
    creditHours: number;
    minCreditHours?: number;
    maxCreditHours?: number;
    contactHours: number;
    lectureHours?: number;
    labHours?: number;
    clinicalHours?: number;
    courseLevel: CourseLevel;
    status: CourseStatus;
    effectiveDate: Date;
    expirationDate?: Date;
    catalogId?: number;
    departmentId?: number;
    collegeId?: number;
    instructionMethod: InstructionMethod;
    gradingBasis: GradingBasis;
    repeatableForCredit: boolean;
    maxRepetitions?: number;
    crossListedWith?: string[];
    attributes?: CourseAttribute[];
    fees?: CourseFee[];
    learningOutcomes?: CourseOutcome[];
    syllabus?: string;
    prerequisites?: string;
    corequisites?: string;
    restrictedTo?: string[];
    approvalWorkflowId?: number;
    approvedBy?: string;
    approvedDate?: Date;
    version: number;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getCatalog: BelongsToGetAssociationMixin<CourseCatalog>;
    getSections: HasManyGetAssociationsMixin<CourseSection>;
    getPrerequisites: BelongsToManyGetAssociationsMixin<Course>;
    getCorequisites: BelongsToManyGetAssociationsMixin<Course>;
    static associations: {
        catalog: Association<Course, CourseCatalog>;
        sections: Association<Course, CourseSection>;
        prerequisites: Association<Course, Course>;
        corequisites: Association<Course, Course>;
    };
    static initModel(sequelize: Sequelize): typeof Course;
}
export declare class CourseSection extends Model {
    id: number;
    courseId: number;
    sectionNumber: string;
    sectionCode: string;
    termId: number;
    termCode: string;
    academicYear: number;
    status: SectionStatus;
    enrollmentCapacity: number;
    enrollmentCurrent: number;
    waitlistCapacity: number;
    waitlistCurrent: number;
    instructionMethod: InstructionMethod;
    meetingPatterns?: Record<string, any>[];
    instructorIds?: number[];
    roomIds?: number[];
    startDate: Date;
    endDate: Date;
    censusDate?: Date;
    withdrawalDeadline?: Date;
    gradingBasis: GradingBasis;
    crossListedWith?: number[];
    combinedWith?: number[];
    fees?: CourseFee[];
    notes?: string;
    schedulingRules?: SchedulingRule[];
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getCourse: BelongsToGetAssociationMixin<Course>;
    static associations: {
        course: Association<CourseSection, Course>;
    };
    static initModel(sequelize: Sequelize): typeof CourseSection;
}
export declare class CoursePrerequisite extends Model {
    id: number;
    courseId: number;
    prerequisiteType: PrerequisiteType;
    prerequisiteCourseId?: number;
    prerequisiteExpression?: string;
    minimumGrade?: string;
    testScore?: Record<string, any>;
    enforced: boolean;
    effectiveDate: Date;
    expirationDate?: Date;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof CoursePrerequisite;
}
export declare class CourseEquivalency extends Model {
    id: number;
    courseId: number;
    equivalentCourseId?: number;
    transferEquivalency?: TransferEquivalency;
    equivalencyType: 'INTERNAL' | 'TRANSFER' | 'EXAM' | 'PORTFOLIO';
    creditHours: number;
    effectiveDate: Date;
    expirationDate?: Date;
    approvedBy?: string;
    approvedDate?: Date;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof CourseEquivalency;
}
export declare class CourseApprovalWorkflow extends Model {
    id: number;
    courseId: number;
    workflowType: 'NEW_COURSE' | 'MODIFICATION' | 'DISCONTINUATION';
    status: ApprovalStatus;
    currentStepId?: number;
    submittedBy: string;
    submittedDate: Date;
    approvalSteps?: Array<{
        stepId: number;
        stepName: string;
        approverRole: string;
        approverId?: string;
        status: ApprovalStatus;
        comments?: string;
        actionDate?: Date;
    }>;
    completedDate?: Date;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof CourseApprovalWorkflow;
}
export declare class CreateCourseCatalogDto {
    catalogYear: number;
    catalogTerm: string;
    catalogName: string;
    effectiveDate: Date;
    expirationDate?: Date;
    description?: string;
}
export declare class UpdateCourseCatalogDto {
    catalogName?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    status?: CourseStatus;
    description?: string;
}
export declare class CreateCourseDto {
    courseCode: string;
    subjectCode: string;
    courseNumber: string;
    courseTitle: string;
    longTitle?: string;
    description: string;
    creditHours: number;
    minCreditHours?: number;
    maxCreditHours?: number;
    contactHours: number;
    lectureHours?: number;
    labHours?: number;
    clinicalHours?: number;
    courseLevel: CourseLevel;
    effectiveDate: Date;
    expirationDate?: Date;
    catalogId?: number;
    departmentId?: number;
    collegeId?: number;
    instructionMethod: InstructionMethod;
    gradingBasis: GradingBasis;
    repeatableForCredit: boolean;
    maxRepetitions?: number;
    crossListedWith?: string[];
    attributes?: CourseAttribute[];
    fees?: CourseFee[];
    learningOutcomes?: CourseOutcome[];
    syllabus?: string;
    prerequisites?: string;
    corequisites?: string;
    restrictedTo?: string[];
}
export declare class UpdateCourseDto {
    courseTitle?: string;
    description?: string;
    creditHours?: number;
    status?: CourseStatus;
    instructionMethod?: InstructionMethod;
    fees?: CourseFee[];
    syllabus?: string;
}
export declare class CreateCourseSectionDto {
    courseId: number;
    sectionNumber: string;
    termId: number;
    termCode: string;
    academicYear: number;
    enrollmentCapacity: number;
    waitlistCapacity: number;
    instructionMethod: InstructionMethod;
    startDate: Date;
    endDate: Date;
    gradingBasis: GradingBasis;
    instructorIds?: number[];
    roomIds?: number[];
}
export declare class UpdateCourseSectionDto {
    status?: SectionStatus;
    enrollmentCapacity?: number;
    waitlistCapacity?: number;
    instructorIds?: number[];
    roomIds?: number[];
    notes?: string;
}
export declare class CreateCoursePrerequisiteDto {
    courseId: number;
    prerequisiteType: PrerequisiteType;
    prerequisiteCourseId?: number;
    prerequisiteExpression?: string;
    minimumGrade?: string;
    enforced: boolean;
    effectiveDate: Date;
}
export declare class CreateCourseEquivalencyDto {
    courseId: number;
    equivalentCourseId?: number;
    transferEquivalency?: TransferEquivalency;
    equivalencyType: 'INTERNAL' | 'TRANSFER' | 'EXAM' | 'PORTFOLIO';
    creditHours: number;
    effectiveDate: Date;
}
export declare class CourseSearchQueryDto {
    subjectCode?: string;
    courseNumber?: string;
    keyword?: string;
    courseLevel?: CourseLevel;
    status?: CourseStatus;
    catalogId?: number;
    minCreditHours?: number;
    maxCreditHours?: number;
    page?: number;
    limit?: number;
}
/**
 * Creates a new course catalog
 */
export declare function createCourseCatalog(data: CreateCourseCatalogDto, sequelize: Sequelize, transaction?: Transaction): Promise<CourseCatalog>;
/**
 * Updates an existing course catalog
 */
export declare function updateCourseCatalog(catalogId: number, data: UpdateCourseCatalogDto, sequelize: Sequelize, transaction?: Transaction): Promise<CourseCatalog>;
/**
 * Publishes a course catalog
 */
export declare function publishCourseCatalog(catalogId: number, publishedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<CourseCatalog>;
/**
 * Creates a new course
 */
export declare function createCourse(data: CreateCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Updates an existing course
 */
export declare function updateCourse(courseId: number, data: UpdateCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Retrieves a course by code
 */
export declare function getCourseByCode(courseCode: string, sequelize: Sequelize): Promise<Course | null>;
/**
 * Searches courses with filters
 */
export declare function searchCourses(query: CourseSearchQueryDto, sequelize: Sequelize): Promise<{
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
}>;
/**
 * Creates a course section
 */
export declare function createCourseSection(data: CreateCourseSectionDto, sequelize: Sequelize, transaction?: Transaction): Promise<CourseSection>;
/**
 * Updates a course section
 */
export declare function updateCourseSection(sectionId: number, data: UpdateCourseSectionDto, sequelize: Sequelize, transaction?: Transaction): Promise<CourseSection>;
/**
 * Gets available sections for a course in a term
 */
export declare function getAvailableSections(courseId: number, termId: number, sequelize: Sequelize): Promise<CourseSection[]>;
/**
 * Checks section capacity availability
 */
export declare function checkSectionCapacity(sectionId: number, sequelize: Sequelize): Promise<{
    hasCapacity: boolean;
    availableSeats: number;
    waitlistAvailable: boolean;
    waitlistSeats: number;
}>;
/**
 * Increments section enrollment
 */
export declare function incrementSectionEnrollment(sectionId: number, sequelize: Sequelize, transaction?: Transaction): Promise<CourseSection>;
/**
 * Decrements section enrollment
 */
export declare function decrementSectionEnrollment(sectionId: number, sequelize: Sequelize, transaction?: Transaction): Promise<CourseSection>;
/**
 * Adds a course prerequisite
 */
export declare function addCoursePrerequisite(data: CreateCoursePrerequisiteDto, sequelize: Sequelize, transaction?: Transaction): Promise<CoursePrerequisite>;
/**
 * Validates course prerequisites for a student
 */
export declare function validatePrerequisites(courseId: number, studentId: number, studentTranscript: any[], sequelize: Sequelize): Promise<{
    valid: boolean;
    missingPrerequisites: CoursePrerequisite[];
}>;
/**
 * Gets all prerequisites for a course
 */
export declare function getCoursePrerequisites(courseId: number, sequelize: Sequelize): Promise<CoursePrerequisite[]>;
/**
 * Adds a course equivalency
 */
export declare function addCourseEquivalency(data: CreateCourseEquivalencyDto, sequelize: Sequelize, transaction?: Transaction): Promise<CourseEquivalency>;
/**
 * Gets course equivalencies
 */
export declare function getCourseEquivalencies(courseId: number, sequelize: Sequelize): Promise<CourseEquivalency[]>;
/**
 * Finds transfer equivalency for a course
 */
export declare function findTransferEquivalency(institutionId: string, externalCourseCode: string, sequelize: Sequelize): Promise<CourseEquivalency | null>;
/**
 * Adds course attributes
 */
export declare function addCourseAttributes(courseId: number, attributes: CourseAttribute[], sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Updates course fees
 */
export declare function updateCourseFees(courseId: number, fees: CourseFee[], sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Adds learning outcomes to a course
 */
export declare function addLearningOutcomes(courseId: number, outcomes: CourseOutcome[], sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Updates course description
 */
export declare function updateCourseDescription(courseId: number, description: string, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Updates course syllabus
 */
export declare function updateCourseSyllabus(courseId: number, syllabus: string, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Cross-lists courses
 */
export declare function crossListCourses(courseIds: number[], sequelize: Sequelize, transaction?: Transaction): Promise<Course[]>;
/**
 * Approves a course
 */
export declare function approveCourse(courseId: number, approvedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Activates a course
 */
export declare function activateCourse(courseId: number, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Discontinues a course
 */
export declare function discontinueCourse(courseId: number, expirationDate: Date, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Creates a course approval workflow
 */
export declare function createCourseApprovalWorkflow(courseId: number, workflowType: 'NEW_COURSE' | 'MODIFICATION' | 'DISCONTINUATION', submittedBy: string, approvalSteps: any[], sequelize: Sequelize, transaction?: Transaction): Promise<CourseApprovalWorkflow>;
/**
 * Advances approval workflow to next step
 */
export declare function advanceApprovalWorkflow(workflowId: number, approverId: string, approved: boolean, comments: string, sequelize: Sequelize, transaction?: Transaction): Promise<CourseApprovalWorkflow>;
/**
 * Gets pending approvals for a user
 */
export declare function getPendingApprovalsForUser(userRole: string, sequelize: Sequelize): Promise<CourseApprovalWorkflow[]>;
/**
 * Gets courses by department
 */
export declare function getCoursesByDepartment(departmentId: number, sequelize: Sequelize): Promise<Course[]>;
/**
 * Gets courses by college
 */
export declare function getCoursesByCollege(collegeId: number, sequelize: Sequelize): Promise<Course[]>;
/**
 * Gets sections by instructor
 */
export declare function getSectionsByInstructor(instructorId: number, termId: number, sequelize: Sequelize): Promise<CourseSection[]>;
/**
 * Gets section enrollment statistics
 */
export declare function getSectionEnrollmentStats(sectionId: number, sequelize: Sequelize): Promise<{
    enrollmentCapacity: number;
    enrollmentCurrent: number;
    enrollmentPercent: number;
    availableSeats: number;
    waitlistCurrent: number;
}>;
/**
 * Validates course scheduling rules
 */
export declare function validateSchedulingRules(sectionId: number, proposedSchedule: Record<string, any>, sequelize: Sequelize): Promise<{
    valid: boolean;
    violations: string[];
}>;
/**
 * Clones a course for a new catalog year
 */
export declare function cloneCourseForNewCatalog(courseId: number, newCatalogId: number, sequelize: Sequelize, transaction?: Transaction): Promise<Course>;
/**
 * Gets course history/versions
 */
export declare function getCourseHistory(courseCode: string, sequelize: Sequelize): Promise<Course[]>;
/**
 * Validates course capacity settings
 */
export declare function validateCourseCapacity(capacity: number, waitlistCapacity: number, roomCapacity: number): Promise<{
    valid: boolean;
    errors: string[];
}>;
export declare class CourseCatalogsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateCourseCatalogDto): Promise<CourseCatalog>;
    findAll(): Promise<CourseCatalog[]>;
    findOne(id: number): Promise<CourseCatalog>;
    update(id: number, updateDto: UpdateCourseCatalogDto): Promise<CourseCatalog>;
    publish(id: number, publishedBy: string): Promise<CourseCatalog>;
}
export declare class CoursesController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateCourseDto): Promise<Course>;
    search(query: CourseSearchQueryDto): Promise<{
        courses: Course[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Course>;
    findByCode(courseCode: string): Promise<Course | null>;
    update(id: number, updateDto: UpdateCourseDto): Promise<Course>;
    approve(id: number, approvedBy: string): Promise<Course>;
    activate(id: number): Promise<Course>;
    discontinue(id: number, expirationDate: Date): Promise<Course>;
    addAttributes(id: number, attributes: CourseAttribute[]): Promise<Course>;
    updateFees(id: number, fees: CourseFee[]): Promise<Course>;
    addOutcomes(id: number, outcomes: CourseOutcome[]): Promise<Course>;
    updateDescription(id: number, description: string): Promise<Course>;
    updateSyllabus(id: number, syllabus: string): Promise<Course>;
    crossList(courseIds: number[]): Promise<Course[]>;
    getHistory(id: number): Promise<Course[]>;
}
export declare class CourseSectionsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateCourseSectionDto): Promise<CourseSection>;
    findAll(termId?: number, courseId?: number): Promise<CourseSection[]>;
    findOne(id: number): Promise<CourseSection>;
    update(id: number, updateDto: UpdateCourseSectionDto): Promise<CourseSection>;
    checkCapacity(id: number): Promise<{
        hasCapacity: boolean;
        availableSeats: number;
        waitlistAvailable: boolean;
        waitlistSeats: number;
    }>;
    getEnrollmentStats(id: number): Promise<{
        enrollmentCapacity: number;
        enrollmentCurrent: number;
        enrollmentPercent: number;
        availableSeats: number;
        waitlistCurrent: number;
    }>;
}
export declare class CoursePrerequisitesController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateCoursePrerequisiteDto): Promise<CoursePrerequisite>;
    findByCourse(courseId: number): Promise<CoursePrerequisite[]>;
    validate(courseId: number, studentId: number, studentTranscript: any[]): Promise<{
        valid: boolean;
        missingPrerequisites: CoursePrerequisite[];
    }>;
}
export declare class CourseEquivalenciesController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateCourseEquivalencyDto): Promise<CourseEquivalency>;
    findByCourse(courseId: number): Promise<CourseEquivalency[]>;
    findTransfer(institutionId: string, externalCourseCode: string): Promise<CourseEquivalency | null>;
}
//# sourceMappingURL=course-catalog-kit.d.ts.map