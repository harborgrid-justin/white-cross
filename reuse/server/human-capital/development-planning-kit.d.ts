/**
 * LOC: HCMDEV12345
 * File: /reuse/server/human-capital/development-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Development planning controllers
 *   - Career development services
 *   - Competency management services
 */
/**
 * File: /reuse/server/human-capital/development-planning-kit.ts
 * Locator: WC-HCM-DEV-001
 * Purpose: Comprehensive Development Planning System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, development planning services, career development, talent management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45+ utility functions for individual development plans (IDP), competency frameworks, skills gap analysis,
 * learning recommendations, mentoring programs, job rotation, knowledge sharing, external training, professional
 * development budgets, development milestones, career planning integration
 *
 * LLM Context: Enterprise-grade Development Planning System competing with SAP SuccessFactors Career Development.
 * Provides comprehensive individual development planning, competency framework management, skills assessment and
 * gap analysis, personalized learning recommendations, mentoring and coaching program management, job rotation and
 * cross-training coordination, knowledge sharing and collaboration tools, learning resource library management,
 * external training and tuition reimbursement, professional development budget tracking, development milestone
 * tracking, succession planning integration, career path planning, talent pool management, performance review
 * integration, 360-degree feedback integration, development goal tracking, skill certification tracking.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * IDP status values
 */
export declare enum IDPStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
/**
 * Development goal status
 */
export declare enum DevelopmentGoalStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    DELAYED = "delayed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Competency proficiency levels
 */
export declare enum ProficiencyLevel {
    NONE = "none",
    BASIC = "basic",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert",
    MASTER = "master"
}
/**
 * Competency types
 */
export declare enum CompetencyType {
    TECHNICAL = "technical",
    BEHAVIORAL = "behavioral",
    LEADERSHIP = "leadership",
    FUNCTIONAL = "functional",
    CORE = "core",
    ROLE_SPECIFIC = "role_specific"
}
/**
 * Skills gap priority
 */
export declare enum SkillsGapPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Mentoring relationship status
 */
export declare enum MentoringStatus {
    PENDING = "pending",
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Mentoring relationship type
 */
export declare enum MentoringType {
    FORMAL = "formal",
    INFORMAL = "informal",
    PEER = "peer",
    REVERSE = "reverse",
    GROUP = "group"
}
/**
 * Job rotation status
 */
export declare enum JobRotationStatus {
    PLANNED = "planned",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Resource types
 */
export declare enum ResourceType {
    ARTICLE = "article",
    VIDEO = "video",
    BOOK = "book",
    PODCAST = "podcast",
    COURSE = "course",
    WEBINAR = "webinar",
    TOOL = "tool",
    TEMPLATE = "template"
}
/**
 * Tuition reimbursement status
 */
export declare enum ReimbursementStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid",
    CANCELLED = "cancelled"
}
/**
 * Individual Development Plan (IDP) interface
 */
export interface IndividualDevelopmentPlan {
    id: string;
    userId: string;
    planName: string;
    description: string;
    status: IDPStatus;
    planYear: number;
    startDate: Date;
    endDate: Date;
    currentRole: string;
    desiredRole?: string;
    careerGoals: string[];
    strengths: string[];
    areasForDevelopment: string[];
    goals: string[];
    managerIds: string[];
    reviewDate?: Date;
    lastReviewDate?: Date;
    completionPercentage: number;
    approvedBy?: string;
    approvedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Development goal interface
 */
export interface DevelopmentGoal {
    id: string;
    idpId: string;
    userId: string;
    goalName: string;
    description: string;
    status: DevelopmentGoalStatus;
    priority: SkillsGapPriority;
    category: 'SKILL' | 'COMPETENCY' | 'BEHAVIOR' | 'KNOWLEDGE' | 'CAREER';
    targetCompetencyId?: string;
    currentLevel?: ProficiencyLevel;
    targetLevel: ProficiencyLevel;
    startDate: Date;
    targetDate: Date;
    completionDate?: Date;
    progress: number;
    successCriteria: string[];
    developmentActivities: string[];
    requiredResources: string[];
    supportNeeded?: string;
    measurementMethod: string;
    milestones: Array<{
        name: string;
        dueDate: Date;
        completed: boolean;
    }>;
    relatedCourseIds: string[];
    mentorId?: string;
    managerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Competency framework interface
 */
export interface CompetencyFramework {
    id: string;
    frameworkName: string;
    description: string;
    version: string;
    type: CompetencyType;
    applicableRoles: string[];
    applicableJobLevels: string[];
    competencies: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    effectiveDate: Date;
    expiryDate?: Date;
    ownerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Competency interface
 */
export interface Competency {
    id: string;
    competencyCode: string;
    competencyName: string;
    description: string;
    type: CompetencyType;
    category?: string;
    proficiencyLevels: Array<{
        level: ProficiencyLevel;
        description: string;
        behavioralIndicators: string[];
    }>;
    relatedSkills: string[];
    requiredForRoles: string[];
    assessmentCriteria: string[];
    developmentResources: string[];
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Skills assessment interface
 */
export interface SkillsAssessment {
    id: string;
    userId: string;
    assessmentName: string;
    assessmentDate: Date;
    assessmentType: 'SELF' | 'MANAGER' | 'PEER' | '360' | 'EXPERT';
    assessorId: string;
    competencies: Array<{
        competencyId: string;
        currentLevel: ProficiencyLevel;
        targetLevel?: ProficiencyLevel;
        evidence?: string;
        notes?: string;
    }>;
    overallScore?: number;
    strengths: string[];
    developmentAreas: string[];
    recommendations: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Skills gap analysis interface
 */
export interface SkillsGapAnalysis {
    id: string;
    userId: string;
    targetRole?: string;
    analysisDate: Date;
    gaps: Array<{
        competencyId: string;
        competencyName: string;
        currentLevel: ProficiencyLevel;
        requiredLevel: ProficiencyLevel;
        gap: number;
        priority: SkillsGapPriority;
        developmentActions: string[];
        estimatedTimeframe: string;
    }>;
    overallGapScore: number;
    criticalGaps: number;
    recommendedCourses: string[];
    recommendedMentors: string[];
    nextReviewDate: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Learning recommendation interface
 */
export interface LearningRecommendation {
    id: string;
    userId: string;
    recommendationType: 'SKILL_GAP' | 'CAREER_PATH' | 'PERFORMANCE' | 'PEER_BASED' | 'AI_GENERATED';
    recommendedItemId: string;
    recommendedItemType: 'COURSE' | 'LEARNING_PATH' | 'MENTOR' | 'JOB_ROTATION' | 'RESOURCE';
    title: string;
    description: string;
    relevanceScore: number;
    priority: SkillsGapPriority;
    competenciesAddressed: string[];
    estimatedDuration?: number;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
    recommendedBy: string;
    recommendedAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    feedback?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mentoring relationship interface
 */
export interface MentoringRelationship {
    id: string;
    programId?: string;
    mentorId: string;
    menteeId: string;
    type: MentoringType;
    status: MentoringStatus;
    startDate: Date;
    endDate?: Date;
    focusAreas: string[];
    goals: string[];
    meetingFrequency: string;
    preferredMeetingMode: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
    sessionCount: number;
    lastSessionDate?: Date;
    nextSessionDate?: Date;
    progressNotes: string[];
    feedback?: {
        mentorFeedback?: string;
        menteeFeedback?: string;
        rating?: number;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mentoring session interface
 */
export interface MentoringSession {
    id: string;
    relationshipId: string;
    sessionNumber: number;
    sessionDate: Date;
    duration: number;
    topics: string[];
    objectives: string[];
    outcomes: string[];
    actionItems: Array<{
        description: string;
        assignedTo: 'MENTOR' | 'MENTEE';
        dueDate?: Date;
        completed: boolean;
    }>;
    mentorNotes?: string;
    menteeNotes?: string;
    rating?: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Job rotation interface
 */
export interface JobRotation {
    id: string;
    userId: string;
    programId?: string;
    rotationName: string;
    currentRole: string;
    targetDepartment: string;
    targetRole: string;
    status: JobRotationStatus;
    startDate: Date;
    endDate: Date;
    duration: number;
    objectives: string[];
    competenciesToDevelop: string[];
    supervisorId: string;
    mentorId?: string;
    progress: number;
    learningOutcomes: string[];
    feedback?: string;
    rating?: number;
    completionCertificate?: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Learning resource interface
 */
export interface LearningResource {
    id: string;
    resourceCode: string;
    title: string;
    description: string;
    type: ResourceType;
    url?: string;
    author?: string;
    publisher?: string;
    publicationDate?: Date;
    duration?: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    competencies: string[];
    topics: string[];
    tags: string[];
    rating?: number;
    reviewCount: number;
    cost?: number;
    language: string;
    isFree: boolean;
    requiresApproval: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * External training request interface
 */
export interface ExternalTrainingRequest {
    id: string;
    userId: string;
    requestType: 'CONFERENCE' | 'WORKSHOP' | 'CERTIFICATION' | 'DEGREE' | 'COURSE' | 'SEMINAR';
    trainingName: string;
    provider: string;
    description: string;
    startDate: Date;
    endDate: Date;
    cost: number;
    currency: string;
    justification: string;
    expectedOutcomes: string[];
    relatedCompetencies: string[];
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    approvalWorkflow: Array<{
        approverId: string;
        level: number;
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        comments?: string;
        approvedAt?: Date;
    }>;
    reimbursementEligible: boolean;
    reimbursementPercentage?: number;
    managerId: string;
    departmentId?: string;
    budgetCode?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Tuition reimbursement interface
 */
export interface TuitionReimbursement {
    id: string;
    userId: string;
    externalTrainingId?: string;
    programName: string;
    institution: string;
    degreeType?: 'CERTIFICATE' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE';
    startDate: Date;
    endDate: Date;
    totalCost: number;
    requestedAmount: number;
    approvedAmount?: number;
    currency: string;
    status: ReimbursementStatus;
    proofOfEnrollment?: string;
    proofOfPayment?: string;
    grade?: string;
    passingGradeRequired: boolean;
    serviceCommitmentMonths?: number;
    approvalWorkflow: Array<{
        approverId: string;
        level: number;
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        comments?: string;
        approvedAt?: Date;
    }>;
    paymentDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Professional development budget interface
 */
export interface ProfessionalDevelopmentBudget {
    id: string;
    userId: string;
    departmentId?: string;
    fiscalYear: number;
    allocatedBudget: number;
    spentBudget: number;
    committedBudget: number;
    availableBudget: number;
    currency: string;
    budgetItems: Array<{
        itemId: string;
        itemType: string;
        description: string;
        amount: number;
        date: Date;
        status: 'PLANNED' | 'COMMITTED' | 'SPENT';
    }>;
    approvalRequired: boolean;
    approverId?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Development milestone interface
 */
export interface DevelopmentMilestone {
    id: string;
    userId: string;
    idpId?: string;
    goalId?: string;
    milestoneName: string;
    description: string;
    category: string;
    targetDate: Date;
    completionDate?: Date;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
    evidence?: string;
    validatedBy?: string;
    validatedAt?: Date;
    reward?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create IDP DTO
 */
export declare class CreateIDPDto {
    userId: string;
    planName: string;
    description: string;
    planYear: number;
    startDate: Date;
    endDate: Date;
    currentRole: string;
    desiredRole?: string;
    careerGoals: string[];
    managerIds: string[];
}
/**
 * Create development goal DTO
 */
export declare class CreateDevelopmentGoalDto {
    idpId: string;
    userId: string;
    goalName: string;
    description: string;
    priority: SkillsGapPriority;
    category: 'SKILL' | 'COMPETENCY' | 'BEHAVIOR' | 'KNOWLEDGE' | 'CAREER';
    targetLevel: ProficiencyLevel;
    targetDate: Date;
    successCriteria: string[];
    managerId: string;
}
/**
 * Create competency DTO
 */
export declare class CreateCompetencyDto {
    competencyName: string;
    description: string;
    type: CompetencyType;
    category?: string;
    requiredForRoles: string[];
}
/**
 * Create skills assessment DTO
 */
export declare class CreateSkillsAssessmentDto {
    userId: string;
    assessmentName: string;
    assessmentType: 'SELF' | 'MANAGER' | 'PEER' | '360' | 'EXPERT';
    assessorId: string;
}
/**
 * Create mentoring relationship DTO
 */
export declare class CreateMentoringRelationshipDto {
    mentorId: string;
    menteeId: string;
    type: MentoringType;
    startDate: Date;
    endDate?: Date;
    focusAreas: string[];
    goals: string[];
    meetingFrequency: string;
}
/**
 * Create job rotation DTO
 */
export declare class CreateJobRotationDto {
    userId: string;
    rotationName: string;
    currentRole: string;
    targetDepartment: string;
    targetRole: string;
    startDate: Date;
    endDate: Date;
    supervisorId: string;
    objectives: string[];
}
/**
 * Create learning resource DTO
 */
export declare class CreateLearningResourceDto {
    title: string;
    description: string;
    type: ResourceType;
    url?: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    topics: string[];
    tags: string[];
    isFree: boolean;
}
/**
 * Create external training request DTO
 */
export declare class CreateExternalTrainingRequestDto {
    userId: string;
    requestType: 'CONFERENCE' | 'WORKSHOP' | 'CERTIFICATION' | 'DEGREE' | 'COURSE' | 'SEMINAR';
    trainingName: string;
    provider: string;
    description: string;
    startDate: Date;
    endDate: Date;
    cost: number;
    justification: string;
    managerId: string;
}
/**
 * Create tuition reimbursement DTO
 */
export declare class CreateTuitionReimbursementDto {
    userId: string;
    programName: string;
    institution: string;
    degreeType?: 'CERTIFICATE' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE';
    startDate: Date;
    endDate: Date;
    totalCost: number;
    requestedAmount: number;
}
export declare const IDPCreateSchema: any;
export declare const DevelopmentGoalCreateSchema: any;
export declare const CompetencyCreateSchema: any;
export declare const SkillsAssessmentCreateSchema: any;
export declare const MentoringRelationshipCreateSchema: any;
export declare const JobRotationCreateSchema: any;
export declare const LearningResourceCreateSchema: any;
export declare const ExternalTrainingRequestCreateSchema: any;
export declare const TuitionReimbursementCreateSchema: any;
/**
 * Sequelize model for Individual Development Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IDP model
 */
export declare const createIDPModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        userId: string;
        planName: string;
        description: string;
        status: string;
        planYear: number;
        startDate: Date;
        endDate: Date;
        currentRole: string;
        desiredRole: string | null;
        careerGoals: string[];
        strengths: string[];
        areasForDevelopment: string[];
        goals: string[];
        managerIds: string[];
        reviewDate: Date | null;
        lastReviewDate: Date | null;
        completionPercentage: number;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string | null;
    };
};
/**
 * Sequelize model for Development Goal.
 */
export declare const createDevelopmentGoalModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        idpId: string;
        userId: string;
        goalName: string;
        description: string;
        status: string;
        priority: string;
        category: string;
        targetCompetencyId: string | null;
        currentLevel: string | null;
        targetLevel: string;
        startDate: Date;
        targetDate: Date;
        completionDate: Date | null;
        progress: number;
        successCriteria: string[];
        developmentActivities: string[];
        requiredResources: string[];
        supportNeeded: string | null;
        measurementMethod: string;
        milestones: any[];
        relatedCourseIds: string[];
        mentorId: string | null;
        managerId: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Competency.
 */
export declare const createCompetencyModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        competencyCode: string;
        competencyName: string;
        description: string;
        type: string;
        category: string | null;
        proficiencyLevels: any[];
        relatedSkills: string[];
        requiredForRoles: string[];
        assessmentCriteria: string[];
        developmentResources: string[];
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Mentoring Relationship.
 */
export declare const createMentoringRelationshipModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        programId: string | null;
        mentorId: string;
        menteeId: string;
        type: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        focusAreas: string[];
        goals: string[];
        meetingFrequency: string;
        preferredMeetingMode: string;
        sessionCount: number;
        lastSessionDate: Date | null;
        nextSessionDate: Date | null;
        progressNotes: string[];
        feedback: any;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new Individual Development Plan.
 *
 * @param {object} idpData - IDP creation data
 * @param {string} userId - User creating the IDP
 * @returns {Promise<IndividualDevelopmentPlan>} Created IDP
 */
export declare const createIDP: (idpData: Partial<IndividualDevelopmentPlan>, userId: string, transaction?: Transaction) => Promise<IndividualDevelopmentPlan>;
/**
 * Submits IDP for manager review.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User submitting
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export declare const submitIDPForReview: (idpId: string, userId: string, transaction?: Transaction) => Promise<Partial<IndividualDevelopmentPlan>>;
/**
 * Approves an IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User approving
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export declare const approveIDP: (idpId: string, userId: string, transaction?: Transaction) => Promise<Partial<IndividualDevelopmentPlan>>;
/**
 * Activates an approved IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User activating
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export declare const activateIDP: (idpId: string, userId: string, transaction?: Transaction) => Promise<Partial<IndividualDevelopmentPlan>>;
/**
 * Updates IDP progress and completion percentage.
 *
 * @param {string} idpId - IDP ID
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export declare const updateIDPProgress: (idpId: string, transaction?: Transaction) => Promise<Partial<IndividualDevelopmentPlan>>;
/**
 * Gets user's IDPs with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<IndividualDevelopmentPlan[]>} User IDPs
 */
export declare const getUserIDPs: (userId: string, filters?: {
    status?: IDPStatus;
    planYear?: number;
}) => Promise<IndividualDevelopmentPlan[]>;
/**
 * Creates a development goal.
 *
 * @param {object} goalData - Goal creation data
 * @param {string} userId - User creating the goal
 * @returns {Promise<DevelopmentGoal>} Created goal
 */
export declare const createDevelopmentGoal: (goalData: Partial<DevelopmentGoal>, userId: string, transaction?: Transaction) => Promise<DevelopmentGoal>;
/**
 * Updates development goal progress.
 *
 * @param {string} goalId - Goal ID
 * @param {number} progress - Progress percentage
 * @param {string} notes - Progress notes
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export declare const updateGoalProgress: (goalId: string, progress: number, notes?: string, transaction?: Transaction) => Promise<Partial<DevelopmentGoal>>;
/**
 * Marks development goal as completed.
 *
 * @param {string} goalId - Goal ID
 * @param {string} userId - User marking completion
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export declare const completeGoal: (goalId: string, userId: string, transaction?: Transaction) => Promise<Partial<DevelopmentGoal>>;
/**
 * Associates courses with a development goal.
 *
 * @param {string} goalId - Goal ID
 * @param {string[]} courseIds - Course IDs to associate
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export declare const associateCoursesWithGoal: (goalId: string, courseIds: string[], transaction?: Transaction) => Promise<Partial<DevelopmentGoal>>;
/**
 * Gets development goals for a user.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<DevelopmentGoal[]>} User goals
 */
export declare const getUserDevelopmentGoals: (userId: string, filters?: {
    status?: DevelopmentGoalStatus;
    idpId?: string;
    priority?: SkillsGapPriority;
}) => Promise<DevelopmentGoal[]>;
/**
 * Creates a new competency.
 *
 * @param {object} competencyData - Competency creation data
 * @param {string} userId - User creating the competency
 * @returns {Promise<Competency>} Created competency
 */
export declare const createCompetency: (competencyData: Partial<Competency>, userId: string, transaction?: Transaction) => Promise<Competency>;
/**
 * Updates competency proficiency levels.
 *
 * @param {string} competencyId - Competency ID
 * @param {array} proficiencyLevels - Proficiency level definitions
 * @returns {Promise<Competency>} Updated competency
 */
export declare const updateCompetencyProficiencyLevels: (competencyId: string, proficiencyLevels: Array<{
    level: ProficiencyLevel;
    description: string;
    behavioralIndicators: string[];
}>, transaction?: Transaction) => Promise<Partial<Competency>>;
/**
 * Gets competencies by role.
 *
 * @param {string} role - Role name
 * @returns {Promise<Competency[]>} Competencies for role
 */
export declare const getCompetenciesByRole: (role: string) => Promise<Competency[]>;
/**
 * Searches competencies by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<Competency[]>} Matching competencies
 */
export declare const searchCompetencies: (filters: {
    query?: string;
    type?: CompetencyType;
    category?: string;
    status?: string;
}) => Promise<Competency[]>;
/**
 * Creates a competency framework.
 *
 * @param {object} frameworkData - Framework creation data
 * @param {string} userId - User creating the framework
 * @returns {Promise<CompetencyFramework>} Created framework
 */
export declare const createCompetencyFramework: (frameworkData: Partial<CompetencyFramework>, userId: string, transaction?: Transaction) => Promise<CompetencyFramework>;
/**
 * Creates a skills assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating assessment
 * @returns {Promise<SkillsAssessment>} Created assessment
 */
export declare const createSkillsAssessment: (assessmentData: Partial<SkillsAssessment>, userId: string, transaction?: Transaction) => Promise<SkillsAssessment>;
/**
 * Performs skills gap analysis for a user.
 *
 * @param {string} userId - User ID
 * @param {string} targetRole - Target role
 * @returns {Promise<SkillsGapAnalysis>} Gap analysis results
 */
export declare const performSkillsGapAnalysis: (userId: string, targetRole?: string, transaction?: Transaction) => Promise<SkillsGapAnalysis>;
/**
 * Identifies critical skills gaps.
 *
 * @param {string} userId - User ID
 * @returns {Promise<object[]>} Critical gaps
 */
export declare const identifyCriticalSkillsGaps: (userId: string) => Promise<Array<{
    competencyId: string;
    competencyName: string;
    currentLevel: ProficiencyLevel;
    requiredLevel: ProficiencyLevel;
    gap: number;
    priority: SkillsGapPriority;
}>>;
/**
 * Compares user competencies with role requirements.
 *
 * @param {string} userId - User ID
 * @param {string} role - Role to compare against
 * @returns {Promise<object>} Comparison results
 */
export declare const compareUserCompetenciesWithRole: (userId: string, role: string) => Promise<{
    matchPercentage: number;
    matchingCompetencies: string[];
    missingCompetencies: string[];
    gaps: any[];
}>;
/**
 * Updates user competency proficiency.
 *
 * @param {string} userId - User ID
 * @param {string} competencyId - Competency ID
 * @param {ProficiencyLevel} level - New proficiency level
 * @param {string} evidence - Evidence of proficiency
 * @returns {Promise<object>} Updated proficiency
 */
export declare const updateUserCompetencyProficiency: (userId: string, competencyId: string, level: ProficiencyLevel, evidence?: string, transaction?: Transaction) => Promise<{
    userId: string;
    competencyId: string;
    level: ProficiencyLevel;
    evidence?: string;
    updatedAt: Date;
}>;
/**
 * Generates personalized learning recommendations.
 *
 * @param {string} userId - User ID
 * @param {object} options - Recommendation options
 * @returns {Promise<LearningRecommendation[]>} Recommendations
 */
export declare const generateLearningRecommendations: (userId: string, options?: {
    basedOn?: "SKILL_GAP" | "CAREER_PATH" | "PERFORMANCE" | "PEER_BASED";
    maxRecommendations?: number;
}) => Promise<LearningRecommendation[]>;
/**
 * Accepts a learning recommendation.
 *
 * @param {string} recommendationId - Recommendation ID
 * @param {string} userId - User accepting
 * @returns {Promise<LearningRecommendation>} Updated recommendation
 */
export declare const acceptLearningRecommendation: (recommendationId: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningRecommendation>>;
/**
 * Gets AI-powered skill recommendations based on career goals.
 *
 * @param {string} userId - User ID
 * @param {string[]} careerGoals - User's career goals
 * @returns {Promise<object[]>} AI recommendations
 */
export declare const getAISkillRecommendations: (userId: string, careerGoals: string[]) => Promise<Array<{
    skillName: string;
    relevanceScore: number;
    recommendedCourses: string[];
    estimatedTimeToAcquire: string;
    marketDemand: string;
}>>;
/**
 * Creates a mentoring relationship.
 *
 * @param {object} relationshipData - Relationship data
 * @param {string} userId - User creating relationship
 * @returns {Promise<MentoringRelationship>} Created relationship
 */
export declare const createMentoringRelationship: (relationshipData: Partial<MentoringRelationship>, userId: string, transaction?: Transaction) => Promise<MentoringRelationship>;
/**
 * Activates a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User activating
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
export declare const activateMentoringRelationship: (relationshipId: string, userId: string, transaction?: Transaction) => Promise<Partial<MentoringRelationship>>;
/**
 * Records a mentoring session.
 *
 * @param {object} sessionData - Session data
 * @param {string} userId - User recording session
 * @returns {Promise<MentoringSession>} Created session
 */
export declare const recordMentoringSession: (sessionData: Partial<MentoringSession>, userId: string, transaction?: Transaction) => Promise<MentoringSession>;
/**
 * Completes a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User completing
 * @param {object} feedback - Final feedback
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
export declare const completeMentoringRelationship: (relationshipId: string, userId: string, feedback?: {
    mentorFeedback?: string;
    menteeFeedback?: string;
    rating?: number;
}, transaction?: Transaction) => Promise<Partial<MentoringRelationship>>;
/**
 * Matches mentees with potential mentors.
 *
 * @param {string} menteeId - Mentee user ID
 * @param {object} criteria - Matching criteria
 * @returns {Promise<object[]>} Potential mentors
 */
export declare const matchMenteeWithMentors: (menteeId: string, criteria: {
    focusAreas?: string[];
    competencies?: string[];
    department?: string;
    seniority?: string;
}) => Promise<Array<{
    mentorId: string;
    mentorName: string;
    matchScore: number;
    sharedCompetencies: string[];
    availableSlots: number;
}>>;
/**
 * Creates a job rotation.
 *
 * @param {object} rotationData - Rotation data
 * @param {string} userId - User creating rotation
 * @returns {Promise<JobRotation>} Created rotation
 */
export declare const createJobRotation: (rotationData: Partial<JobRotation>, userId: string, transaction?: Transaction) => Promise<JobRotation>;
/**
 * Activates a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User activating
 * @returns {Promise<JobRotation>} Updated rotation
 */
export declare const activateJobRotation: (rotationId: string, userId: string, transaction?: Transaction) => Promise<Partial<JobRotation>>;
/**
 * Updates job rotation progress.
 *
 * @param {string} rotationId - Rotation ID
 * @param {number} progress - Progress percentage
 * @param {string[]} learningOutcomes - Learning outcomes achieved
 * @returns {Promise<JobRotation>} Updated rotation
 */
export declare const updateJobRotationProgress: (rotationId: string, progress: number, learningOutcomes?: string[], transaction?: Transaction) => Promise<Partial<JobRotation>>;
/**
 * Completes a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User completing
 * @param {object} completionData - Completion data
 * @returns {Promise<JobRotation>} Updated rotation
 */
export declare const completeJobRotation: (rotationId: string, userId: string, completionData: {
    feedback?: string;
    rating?: number;
    issueCertificate?: boolean;
}, transaction?: Transaction) => Promise<Partial<JobRotation>>;
/**
 * Creates a learning resource.
 *
 * @param {object} resourceData - Resource data
 * @param {string} userId - User creating resource
 * @returns {Promise<LearningResource>} Created resource
 */
export declare const createLearningResource: (resourceData: Partial<LearningResource>, userId: string, transaction?: Transaction) => Promise<LearningResource>;
/**
 * Searches learning resources.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningResource[]>} Matching resources
 */
export declare const searchLearningResources: (filters: {
    query?: string;
    type?: ResourceType;
    difficulty?: string;
    topics?: string[];
    isFree?: boolean;
    competencies?: string[];
}) => Promise<LearningResource[]>;
/**
 * Rates a learning resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} userId - User rating
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Review text
 * @returns {Promise<object>} Rating record
 */
export declare const rateLearningResource: (resourceId: string, userId: string, rating: number, review?: string, transaction?: Transaction) => Promise<{
    resourceId: string;
    userId: string;
    rating: number;
    review?: string;
    createdAt: Date;
}>;
/**
 * Creates external training request.
 *
 * @param {object} requestData - Request data
 * @param {string} userId - User creating request
 * @returns {Promise<ExternalTrainingRequest>} Created request
 */
export declare const createExternalTrainingRequest: (requestData: Partial<ExternalTrainingRequest>, userId: string, transaction?: Transaction) => Promise<ExternalTrainingRequest>;
/**
 * Submits external training request for approval.
 *
 * @param {string} requestId - Request ID
 * @param {string} userId - User submitting
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
export declare const submitExternalTrainingRequest: (requestId: string, userId: string, transaction?: Transaction) => Promise<Partial<ExternalTrainingRequest>>;
/**
 * Approves external training request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {string} comments - Approval comments
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
export declare const approveExternalTrainingRequest: (requestId: string, approverId: string, comments?: string, transaction?: Transaction) => Promise<Partial<ExternalTrainingRequest>>;
/**
 * Creates tuition reimbursement request.
 *
 * @param {object} reimbursementData - Reimbursement data
 * @param {string} userId - User creating request
 * @returns {Promise<TuitionReimbursement>} Created request
 */
export declare const createTuitionReimbursementRequest: (reimbursementData: Partial<TuitionReimbursement>, userId: string, transaction?: Transaction) => Promise<TuitionReimbursement>;
/**
 * Processes tuition reimbursement payment.
 *
 * @param {string} reimbursementId - Reimbursement ID
 * @param {number} amount - Payment amount
 * @param {string} userId - User processing payment
 * @returns {Promise<TuitionReimbursement>} Updated reimbursement
 */
export declare const processTuitionReimbursementPayment: (reimbursementId: string, amount: number, userId: string, transaction?: Transaction) => Promise<Partial<TuitionReimbursement>>;
/**
 * Initializes professional development budget for user.
 *
 * @param {string} userId - User ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} allocatedBudget - Allocated budget amount
 * @returns {Promise<ProfessionalDevelopmentBudget>} Created budget
 */
export declare const initializeDevelopmentBudget: (userId: string, fiscalYear: number, allocatedBudget: number, transaction?: Transaction) => Promise<ProfessionalDevelopmentBudget>;
/**
 * Tracks budget expenditure.
 *
 * @param {string} budgetId - Budget ID
 * @param {object} expenditure - Expenditure details
 * @returns {Promise<ProfessionalDevelopmentBudget>} Updated budget
 */
export declare const trackBudgetExpenditure: (budgetId: string, expenditure: {
    itemId: string;
    itemType: string;
    description: string;
    amount: number;
    status: "PLANNED" | "COMMITTED" | "SPENT";
}, transaction?: Transaction) => Promise<Partial<ProfessionalDevelopmentBudget>>;
/**
 * Creates a development milestone.
 *
 * @param {object} milestoneData - Milestone data
 * @param {string} userId - User creating milestone
 * @returns {Promise<DevelopmentMilestone>} Created milestone
 */
export declare const createDevelopmentMilestone: (milestoneData: Partial<DevelopmentMilestone>, userId: string, transaction?: Transaction) => Promise<DevelopmentMilestone>;
/**
 * Completes and validates a development milestone.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User completing
 * @param {string} validatorId - Validator user ID
 * @param {string} evidence - Evidence of completion
 * @returns {Promise<DevelopmentMilestone>} Updated milestone
 */
export declare const completeDevelopmentMilestone: (milestoneId: string, userId: string, validatorId: string, evidence?: string, transaction?: Transaction) => Promise<Partial<DevelopmentMilestone>>;
/**
 * Example NestJS Controller for Development Planning
 */
export declare class DevelopmentPlanningController {
    createIDPEndpoint(dto: CreateIDPDto): Promise<IndividualDevelopmentPlan>;
    createGoal(dto: CreateDevelopmentGoalDto): Promise<DevelopmentGoal>;
    createCompetencyEndpoint(dto: CreateCompetencyDto): Promise<Competency>;
    createAssessment(dto: CreateSkillsAssessmentDto): Promise<SkillsAssessment>;
    performGapAnalysis(userId: string, targetRole?: string): Promise<SkillsGapAnalysis>;
    getRecommendations(userId: string): Promise<LearningRecommendation[]>;
    createMentoring(dto: CreateMentoringRelationshipDto): Promise<MentoringRelationship>;
    createRotation(dto: CreateJobRotationDto): Promise<JobRotation>;
}
//# sourceMappingURL=development-planning-kit.d.ts.map