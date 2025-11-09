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
import { Model, Sequelize, FindOptions, Transaction } from 'sequelize';
import { Observable } from 'rxjs';
/**
 * Outcome level enumeration
 */
export declare enum OutcomeLevel {
    INSTITUTIONAL = "INSTITUTIONAL",
    PROGRAM = "PROGRAM",
    COURSE = "COURSE",
    MODULE = "MODULE",
    ASSIGNMENT = "ASSIGNMENT"
}
/**
 * Outcome status enumeration
 */
export declare enum OutcomeStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    UNDER_REVIEW = "UNDER_REVIEW",
    ARCHIVED = "ARCHIVED",
    DEPRECATED = "DEPRECATED"
}
/**
 * Assessment status enumeration
 */
export declare enum AssessmentStatus {
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ANALYZED = "ANALYZED",
    REPORTED = "REPORTED"
}
/**
 * Assessment method enumeration
 */
export declare enum AssessmentMethod {
    DIRECT_EXAM = "DIRECT_EXAM",
    DIRECT_PROJECT = "DIRECT_PROJECT",
    DIRECT_PORTFOLIO = "DIRECT_PORTFOLIO",
    DIRECT_PERFORMANCE = "DIRECT_PERFORMANCE",
    DIRECT_CAPSTONE = "DIRECT_CAPSTONE",
    INDIRECT_SURVEY = "INDIRECT_SURVEY",
    INDIRECT_INTERVIEW = "INDIRECT_INTERVIEW",
    INDIRECT_FOCUS_GROUP = "INDIRECT_FOCUS_GROUP",
    EMBEDDED = "EMBEDDED",
    OTHER = "OTHER"
}
/**
 * Proficiency level enumeration
 */
export declare enum ProficiencyLevel {
    EXCEEDS = "EXCEEDS",
    MEETS = "MEETS",
    APPROACHES = "APPROACHES",
    DEVELOPING = "DEVELOPING",
    UNSATISFACTORY = "UNSATISFACTORY"
}
/**
 * Bloom's taxonomy level
 */
export declare enum BloomLevel {
    REMEMBER = "REMEMBER",
    UNDERSTAND = "UNDERSTAND",
    APPLY = "APPLY",
    ANALYZE = "ANALYZE",
    EVALUATE = "EVALUATE",
    CREATE = "CREATE"
}
/**
 * Accreditation standard type
 */
export declare enum AccreditationType {
    REGIONAL = "REGIONAL",
    ABET = "ABET",
    AACSB = "AACSB",
    ACEN = "ACEN",
    ABA = "ABA",
    CAEP = "CAEP",
    CCNE = "CCNE",
    OTHER = "OTHER"
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
export declare enum OutcomeEventType {
    OUTCOME_CREATED = "OUTCOME_CREATED",
    OUTCOME_UPDATED = "OUTCOME_UPDATED",
    ASSESSMENT_PLANNED = "ASSESSMENT_PLANNED",
    ASSESSMENT_COMPLETED = "ASSESSMENT_COMPLETED",
    ASSESSMENT_ANALYZED = "ASSESSMENT_ANALYZED",
    MAPPING_CREATED = "MAPPING_CREATED",
    REPORT_GENERATED = "REPORT_GENERATED",
    PLAN_APPROVED = "PLAN_APPROVED"
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
/**
 * LearningOutcome model class
 */
export declare class LearningOutcome extends Model<LearningOutcomeAttributes> implements LearningOutcomeAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
/**
 * OutcomeAssessment model class
 */
export declare class OutcomeAssessment extends Model<OutcomeAssessmentAttributes> implements OutcomeAssessmentAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * ProgramOutcome model class
 */
export declare class ProgramOutcome extends Model<ProgramOutcomeAttributes> implements ProgramOutcomeAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * CourseOutcome model class
 */
export declare class CourseOutcome extends Model<CourseOutcomeAttributes> implements CourseOutcomeAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * AssessmentRubric model class
 */
export declare class AssessmentRubric extends Model<AssessmentRubricAttributes> implements AssessmentRubricAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * AssessmentPlan model class
 */
export declare class AssessmentPlan extends Model<AssessmentPlanAttributes> implements AssessmentPlanAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * AccreditationReport model class
 */
export declare class AccreditationReport extends Model<AccreditationReportAttributes> implements AccreditationReportAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize LearningOutcome model
 */
export declare function initLearningOutcomeModel(sequelize: Sequelize): typeof LearningOutcome;
/**
 * Initialize OutcomeAssessment model
 */
export declare function initOutcomeAssessmentModel(sequelize: Sequelize): typeof OutcomeAssessment;
/**
 * Initialize ProgramOutcome model
 */
export declare function initProgramOutcomeModel(sequelize: Sequelize): typeof ProgramOutcome;
/**
 * Initialize CourseOutcome model
 */
export declare function initCourseOutcomeModel(sequelize: Sequelize): typeof CourseOutcome;
/**
 * Initialize AssessmentRubric model
 */
export declare function initAssessmentRubricModel(sequelize: Sequelize): typeof AssessmentRubric;
/**
 * Initialize AssessmentPlan model
 */
export declare function initAssessmentPlanModel(sequelize: Sequelize): typeof AssessmentPlan;
/**
 * Initialize AccreditationReport model
 */
export declare function initAccreditationReportModel(sequelize: Sequelize): typeof AccreditationReport;
/**
 * Outcome state store with reactive observables
 */
export declare class OutcomeStateStore {
    private state;
    private events;
    constructor();
    /**
     * Get observable of current state
     */
    getState$(): Observable<OutcomeState>;
    /**
     * Get observable of events
     */
    getEvents$(): Observable<OutcomeEvent>;
    /**
     * Update outcome in state
     */
    updateOutcome(outcome: LearningOutcomeAttributes): void;
    /**
     * Update assessment in state
     */
    updateAssessment(assessment: OutcomeAssessmentAttributes): void;
    /**
     * Emit outcome event
     */
    emitEvent(event: OutcomeEvent): void;
    /**
     * Get outcome observable by ID
     */
    getOutcome$(outcomeId: string): Observable<LearningOutcomeAttributes | undefined>;
    /**
     * Get assessments observable by outcome ID
     */
    getAssessmentsByOutcome$(outcomeId: string): Observable<OutcomeAssessmentAttributes[]>;
    /**
     * Get program outcomes observable by program ID
     */
    getProgramOutcomes$(programId: string): Observable<ProgramOutcomeAttributes[]>;
}
/**
 * Create learning outcome
 */
export declare function createLearningOutcome(data: Partial<LearningOutcomeAttributes>, userId: string, transaction?: Transaction): Promise<LearningOutcome>;
/**
 * Generate outcome code
 */
export declare function generateOutcomeCode(level: OutcomeLevel, programId?: string): Promise<string>;
/**
 * Update learning outcome
 */
export declare function updateLearningOutcome(outcomeId: string, data: Partial<LearningOutcomeAttributes>, userId: string, transaction?: Transaction): Promise<LearningOutcome>;
/**
 * Version learning outcome
 */
export declare function versionLearningOutcome(outcomeId: string, userId: string, transaction?: Transaction): Promise<LearningOutcome>;
/**
 * Get outcomes by level
 */
export declare function getOutcomesByLevel(level: OutcomeLevel, options?: FindOptions): Promise<LearningOutcome[]>;
/**
 * Get outcomes by program
 */
export declare function getOutcomesByProgram(programId: string, options?: FindOptions): Promise<LearningOutcome[]>;
/**
 * Create outcome assessment
 */
export declare function createOutcomeAssessment(data: Partial<OutcomeAssessmentAttributes>, userId: string, transaction?: Transaction): Promise<OutcomeAssessment>;
/**
 * Complete assessment with results
 */
export declare function completeAssessment(assessmentId: string, results: {
    exceeds: number;
    meets: number;
    approaches: number;
    developing: number;
    unsatisfactory: number;
    sampleSize: number;
    findings: string;
    actionItems: string[];
}, transaction?: Transaction): Promise<OutcomeAssessment>;
/**
 * Analyze assessment results
 */
export declare function analyzeAssessment(assessmentId: string, transaction?: Transaction): Promise<OutcomeAssessment>;
/**
 * Get assessments by academic year
 */
export declare function getAssessmentsByYear(academicYear: string, programId?: string, options?: FindOptions): Promise<OutcomeAssessment[]>;
/**
 * Map course outcome to program outcome
 */
export declare function mapCourseToProgram(courseId: string, outcomeId: string, programOutcomeIds: string[], alignmentLevel: 'INTRODUCED' | 'REINFORCED' | 'MASTERED', transaction?: Transaction): Promise<CourseOutcome>;
/**
 * Add program outcome
 */
export declare function addProgramOutcome(programId: string, outcomeId: string, accreditationMappings: Record<string, string[]>, transaction?: Transaction): Promise<ProgramOutcome>;
/**
 * Get course outcome mappings
 */
export declare function getCourseOutcomeMappings(courseId: string, options?: FindOptions): Promise<CourseOutcome[]>;
/**
 * Generate curriculum map
 */
export declare function generateCurriculumMap(programId: string): Promise<{
    programOutcomes: ProgramOutcome[];
    courseMappings: Map<string, CourseOutcome[]>;
    alignmentMatrix: Record<string, Record<string, string>>;
}>;
/**
 * Create assessment rubric
 */
export declare function createAssessmentRubric(data: Partial<AssessmentRubricAttributes>, userId: string, transaction?: Transaction): Promise<AssessmentRubric>;
/**
 * Get rubrics by outcome
 */
export declare function getRubricsByOutcome(outcomeId: string, options?: FindOptions): Promise<AssessmentRubric[]>;
/**
 * Create assessment plan
 */
export declare function createAssessmentPlan(data: Partial<AssessmentPlanAttributes>, userId: string, transaction?: Transaction): Promise<AssessmentPlan>;
/**
 * Approve assessment plan
 */
export declare function approveAssessmentPlan(planId: string, approvedBy: string, transaction?: Transaction): Promise<AssessmentPlan>;
/**
 * Get assessment plan for program and year
 */
export declare function getAssessmentPlan(programId: string, academicYear: string, options?: FindOptions): Promise<AssessmentPlan | null>;
/**
 * Generate accreditation report
 */
export declare function generateAccreditationReport(programId: string, accreditationType: AccreditationType, periodStart: Date, periodEnd: Date, userId: string, transaction?: Transaction): Promise<AccreditationReport>;
/**
 * Submit accreditation report
 */
export declare function submitAccreditationReport(reportId: string, transaction?: Transaction): Promise<AccreditationReport>;
/**
 * Get accreditation reports by program
 */
export declare function getAccreditationReports(programId: string, options?: FindOptions): Promise<AccreditationReport[]>;
/**
 * Create observable for outcome events
 */
export declare function createOutcomeEventStream(store: OutcomeStateStore, eventTypes?: OutcomeEventType[]): Observable<OutcomeEvent>;
/**
 * Create observable for assessment completion tracking
 */
export declare function createAssessmentCompletionObservable(store: OutcomeStateStore, programId: string): Observable<{
    total: number;
    completed: number;
    percentage: number;
}>;
/**
 * Create observable for outcome achievement trends
 */
export declare function createAchievementTrendObservable(store: OutcomeStateStore, outcomeId: string): Observable<number[]>;
/**
 * Initialize all outcome models
 */
export declare function initAllOutcomeModels(sequelize: Sequelize): {
    LearningOutcome: typeof LearningOutcome;
    OutcomeAssessment: typeof OutcomeAssessment;
    ProgramOutcome: typeof ProgramOutcome;
    CourseOutcome: typeof CourseOutcome;
    AssessmentRubric: typeof AssessmentRubric;
    AssessmentPlan: typeof AssessmentPlan;
    AccreditationReport: typeof AccreditationReport;
};
//# sourceMappingURL=learning-outcomes-kit.d.ts.map