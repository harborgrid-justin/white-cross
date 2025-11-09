/**
 * LOC: HCCDEV9001234
 * File: /reuse/server/human-capital/career-development-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable, decorators)
 *   - zod (validation schemas)
 *
 * DOWNSTREAM (imported by):
 *   - backend/human-capital/*
 *   - backend/controllers/career-development.controller.ts
 *   - backend/services/career-development.service.ts
 *   - backend/modules/talent-management.module.ts
 */
/**
 * File: /reuse/server/human-capital/career-development-kit.ts
 * Locator: WC-HC-CDEV-001
 * Purpose: SAP SuccessFactors-level Career Development Management - career paths, progression planning, internal mobility, counseling, skills assessment
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, Zod validation
 * Downstream: Career development controllers, talent services, learning systems, performance management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Zod 3.x
 * Exports: 47 production-ready functions for career development, paths, mobility, skills assessment, career counseling
 *
 * LLM Context: Enterprise-grade career development utilities competing with SAP SuccessFactors Career Development Planning.
 * Provides comprehensive career path definition and visualization, career progression planning with milestones,
 * internal mobility and job posting management, career counseling and guidance workflows, skills inventory
 * and assessment tools, career interests and preferences tracking, career ladders and competency frameworks,
 * career milestones and achievements, lateral moves and rotational programs, career transition support,
 * career analytics and insights, and seamless integration with learning management and performance systems.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CareerPathData {
    pathId: string;
    pathName: string;
    pathDescription: string;
    category: 'technical' | 'leadership' | 'specialist' | 'management' | 'hybrid';
    jobFamily: string;
    startingRole: string;
    targetRole: string;
    estimatedDuration: number;
    requiredCompetencies: string[];
    milestones: CareerMilestone[];
    isActive: boolean;
    createdBy: string;
    metadata?: Record<string, any>;
}
interface CareerMilestone {
    milestoneId: string;
    milestoneName: string;
    description: string;
    sequenceNumber: number;
    roleLevel: string;
    requiredSkills: string[];
    requiredExperience: number;
    successCriteria: string[];
    estimatedTimeframe: number;
}
interface CareerProgressionPlan {
    planId: string;
    employeeId: string;
    careerPathId: string;
    currentRole: string;
    targetRole: string;
    startDate: Date;
    targetCompletionDate: Date;
    currentMilestone: number;
    completedMilestones: string[];
    status: 'active' | 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'abandoned';
    progressPercentage: number;
    nextSteps: string[];
    developmentActivities: DevelopmentActivity[];
    mentorId?: string;
    managerId: string;
    lastReviewDate: Date;
    nextReviewDate: Date;
}
interface DevelopmentActivity {
    activityId: string;
    activityType: 'training' | 'certification' | 'project' | 'mentoring' | 'job_shadowing' | 'stretch_assignment';
    title: string;
    description: string;
    targetCompetency: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    completionPercentage: number;
    outcomeNotes?: string;
}
interface InternalJobPosting {
    postingId: string;
    jobTitle: string;
    jobFamily: string;
    department: string;
    location: string;
    employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary';
    jobLevel: string;
    salaryRange: {
        min: number;
        max: number;
    };
    requiredSkills: string[];
    preferredSkills: string[];
    requiredExperience: number;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    postedDate: Date;
    closingDate: Date;
    status: 'draft' | 'active' | 'closed' | 'filled' | 'cancelled';
    hiringManagerId: string;
    internalOnly: boolean;
    visibilityRules: string[];
    applicantCount: number;
}
interface JobApplication {
    applicationId: string;
    postingId: string;
    employeeId: string;
    applicationDate: Date;
    coverLetter?: string;
    status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'offered' | 'accepted' | 'declined' | 'rejected';
    matchScore: number;
    skillsGaps: string[];
    reviewNotes?: string;
    interviewDate?: Date;
    interviewFeedback?: string;
    decisionDate?: Date;
    decisionReason?: string;
}
interface CareerCounselingSession {
    sessionId: string;
    employeeId: string;
    counselorId: string;
    sessionType: 'initial' | 'progress_review' | 'transition' | 'development' | 'crisis' | 'retirement';
    sessionDate: Date;
    duration: number;
    topics: string[];
    discussionNotes: string;
    actionItems: ActionItem[];
    followUpDate?: Date;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    satisfactionRating?: number;
}
interface ActionItem {
    itemId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    completionDate?: Date;
    notes?: string;
}
interface SkillsInventory {
    employeeId: string;
    skills: SkillEntry[];
    lastUpdated: Date;
    assessmentDate: Date;
    assessedBy: string;
    certifications: Certification[];
    languageProficiency: LanguageProficiency[];
}
interface SkillEntry {
    skillId: string;
    skillName: string;
    skillCategory: string;
    proficiencyLevel: 'novice' | 'intermediate' | 'advanced' | 'expert' | 'master';
    yearsOfExperience: number;
    lastUsed: Date;
    isCertified: boolean;
    assessmentScore?: number;
    endorsements: number;
    targetProficiency?: string;
}
interface Certification {
    certificationId: string;
    certificationName: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    verificationUrl?: string;
    status: 'active' | 'expired' | 'pending_renewal';
}
interface LanguageProficiency {
    language: string;
    reading: 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
    writing: 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
    speaking: 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
    listening: 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
}
interface CareerInterests {
    employeeId: string;
    preferredRoles: string[];
    preferredDepartments: string[];
    preferredLocations: string[];
    careerAspirations: string;
    workstylePreferences: string[];
    willingToRelocate: boolean;
    willingToTravel: boolean;
    travelPercentage?: number;
    targetTimeframe: string;
    lastUpdated: Date;
}
interface CareerLadder {
    ladderId: string;
    ladderName: string;
    jobFamily: string;
    track: 'individual_contributor' | 'management' | 'technical_leadership' | 'executive';
    levels: CareerLevel[];
    competencyFramework: string;
    isActive: boolean;
}
interface CareerLevel {
    level: number;
    levelName: string;
    jobTitle: string;
    salaryRange: {
        min: number;
        max: number;
    };
    requiredCompetencies: CompetencyRequirement[];
    typicalExperience: number;
    responsibilities: string[];
    decisionAuthority: string[];
    leadershipScope?: string;
}
interface CompetencyRequirement {
    competencyId: string;
    competencyName: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'business';
    requiredLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
    isMandatory: boolean;
    assessmentMethod: string;
}
interface CareerAchievement {
    achievementId: string;
    employeeId: string;
    achievementType: 'promotion' | 'certification' | 'award' | 'project_completion' | 'milestone' | 'skill_mastery';
    title: string;
    description: string;
    achievementDate: Date;
    recognizedBy: string;
    impactDescription?: string;
    visibilityLevel: 'private' | 'team' | 'organization' | 'public';
    endorsements: number;
    metadata?: Record<string, any>;
}
interface RotationalProgram {
    programId: string;
    programName: string;
    programType: 'leadership_development' | 'technical' | 'graduate' | 'cross_functional';
    duration: number;
    rotations: ProgramRotation[];
    eligibilityCriteria: string[];
    participants: string[];
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'active' | 'completed' | 'cancelled';
}
interface ProgramRotation {
    rotationId: string;
    department: string;
    role: string;
    duration: number;
    learningObjectives: string[];
    mentor: string;
    sequenceNumber: number;
    location?: string;
}
interface CareerAnalytics {
    reportDate: Date;
    metrics: {
        totalCareerPlans: number;
        activeCareerPlans: number;
        completedMilestones: number;
        averageProgressRate: number;
        internalMobilityRate: number;
        averageTimeToPromotion: number;
        skillsGapAnalysis: Record<string, number>;
        topCareerPaths: string[];
        retentionImpact: number;
    };
    trends: {
        careerPlanGrowth: number;
        mobilityTrend: number;
        developmentActivityCompletion: number;
    };
}
export declare const CareerPathSchema: any;
export declare const CareerProgressionPlanSchema: any;
export declare const InternalJobPostingSchema: any;
export declare const SkillsInventorySchema: any;
/**
 * Career Path model for defining career progression paths.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CareerPath model
 *
 * @example
 * ```typescript
 * const CareerPath = createCareerPathModel(sequelize);
 * const path = await CareerPath.create({
 *   pathName: 'Software Engineer to Principal Engineer',
 *   category: 'technical',
 *   jobFamily: 'Engineering',
 *   startingRole: 'Software Engineer II',
 *   targetRole: 'Principal Engineer',
 *   estimatedDuration: 60,
 *   requiredCompetencies: ['System Design', 'Technical Leadership', 'Mentoring']
 * });
 * ```
 */
export declare const createCareerPathModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        pathId: string;
        pathName: string;
        pathDescription: string;
        category: string;
        jobFamily: string;
        startingRole: string;
        targetRole: string;
        estimatedDuration: number;
        requiredCompetencies: string[];
        milestones: any[];
        isActive: boolean;
        createdBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Career Progression Plan model for tracking employee career development.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CareerProgressionPlan model
 *
 * @example
 * ```typescript
 * const Plan = createCareerProgressionPlanModel(sequelize);
 * const plan = await Plan.create({
 *   employeeId: 'emp-uuid',
 *   careerPathId: 'path-uuid',
 *   currentRole: 'Senior Engineer',
 *   targetRole: 'Staff Engineer',
 *   startDate: new Date(),
 *   targetCompletionDate: new Date('2026-01-01'),
 *   managerId: 'mgr-uuid',
 *   status: 'active'
 * });
 * ```
 */
export declare const createCareerProgressionPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        planId: string;
        employeeId: string;
        careerPathId: string;
        currentRole: string;
        targetRole: string;
        startDate: Date;
        targetCompletionDate: Date;
        currentMilestone: number;
        completedMilestones: string[];
        status: string;
        progressPercentage: number;
        nextSteps: string[];
        developmentActivities: any[];
        mentorId: string | null;
        managerId: string;
        lastReviewDate: Date;
        nextReviewDate: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Internal Job Posting model for managing internal job opportunities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InternalJobPosting model
 *
 * @example
 * ```typescript
 * const JobPosting = createInternalJobPostingModel(sequelize);
 * const posting = await JobPosting.create({
 *   jobTitle: 'Senior Product Manager',
 *   jobFamily: 'Product',
 *   department: 'Engineering',
 *   location: 'San Francisco, CA',
 *   employmentType: 'full_time',
 *   jobLevel: 'Senior',
 *   salaryRange: { min: 150000, max: 200000 },
 *   status: 'active'
 * });
 * ```
 */
export declare const createInternalJobPostingModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        postingId: string;
        jobTitle: string;
        jobFamily: string;
        department: string;
        location: string;
        employmentType: string;
        jobLevel: string;
        salaryRange: {
            min: number;
            max: number;
        };
        requiredSkills: string[];
        preferredSkills: string[];
        requiredExperience: number;
        description: string;
        responsibilities: string[];
        qualifications: string[];
        postedDate: Date;
        closingDate: Date;
        status: string;
        hiringManagerId: string;
        internalOnly: boolean;
        visibilityRules: string[];
        applicantCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 1. Creates a new career path with milestones and competency requirements.
 *
 * @param {CareerPathData} pathData - Career path configuration
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerPathData>} Created career path
 *
 * @example
 * ```typescript
 * const path = await createCareerPath({
 *   pathName: 'Software Engineer to Architect',
 *   category: 'technical',
 *   jobFamily: 'Engineering',
 *   startingRole: 'Senior Software Engineer',
 *   targetRole: 'Solutions Architect',
 *   estimatedDuration: 36,
 *   requiredCompetencies: ['System Design', 'Cloud Architecture'],
 *   milestones: [...],
 *   isActive: true,
 *   createdBy: 'talent-team'
 * });
 * ```
 */
export declare function createCareerPath(pathData: Omit<CareerPathData, 'pathId'>, transaction?: Transaction): Promise<CareerPathData>;
/**
 * 2. Retrieves career path with visualization data including milestones and progression.
 *
 * @param {string} pathId - Career path ID
 * @returns {Promise<CareerPathData & { visualization: any }>} Path with visualization
 *
 * @example
 * ```typescript
 * const pathWithViz = await getCareerPathVisualization('cp-123');
 * console.log(pathWithViz.visualization.milestoneGraph);
 * ```
 */
export declare function getCareerPathVisualization(pathId: string): Promise<CareerPathData & {
    visualization: any;
}>;
/**
 * 3. Lists all available career paths filtered by criteria.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<CareerPathData[]>} List of career paths
 *
 * @example
 * ```typescript
 * const techPaths = await listCareerPaths({
 *   category: 'technical',
 *   jobFamily: 'Engineering',
 *   isActive: true
 * });
 * ```
 */
export declare function listCareerPaths(filters: {
    category?: string;
    jobFamily?: string;
    isActive?: boolean;
    startingRole?: string;
}): Promise<CareerPathData[]>;
/**
 * 4. Updates career path configuration including milestones and requirements.
 *
 * @param {string} pathId - Career path ID
 * @param {Partial<CareerPathData>} updates - Updates to apply
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerPathData>} Updated career path
 *
 * @example
 * ```typescript
 * const updated = await updateCareerPath('cp-123', {
 *   estimatedDuration: 30,
 *   requiredCompetencies: ['System Design', 'Cloud', 'Security']
 * });
 * ```
 */
export declare function updateCareerPath(pathId: string, updates: Partial<CareerPathData>, transaction?: Transaction): Promise<CareerPathData>;
/**
 * 5. Deactivates a career path (soft delete).
 *
 * @param {string} pathId - Career path ID
 * @param {string} deactivatedBy - User performing deactivation
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await deactivateCareerPath('cp-123', 'talent-admin');
 * ```
 */
export declare function deactivateCareerPath(pathId: string, deactivatedBy: string, transaction?: Transaction): Promise<boolean>;
/**
 * 6. Adds milestone to an existing career path.
 *
 * @param {string} pathId - Career path ID
 * @param {CareerMilestone} milestone - Milestone to add
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerPathData>} Updated career path
 *
 * @example
 * ```typescript
 * await addMilestoneToPath('cp-123', {
 *   milestoneId: 'ms-1',
 *   milestoneName: 'Lead Technical Design',
 *   description: 'Successfully lead 3+ technical designs',
 *   sequenceNumber: 2,
 *   roleLevel: 'Staff Engineer',
 *   requiredSkills: ['System Design'],
 *   requiredExperience: 36,
 *   successCriteria: ['Peer review approval'],
 *   estimatedTimeframe: 6
 * });
 * ```
 */
export declare function addMilestoneToPath(pathId: string, milestone: CareerMilestone, transaction?: Transaction): Promise<CareerPathData>;
/**
 * 7. Clones an existing career path with modifications.
 *
 * @param {string} sourcePathId - Source path to clone
 * @param {Partial<CareerPathData>} overrides - Property overrides
 * @param {string} clonedBy - User performing clone
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerPathData>} New cloned path
 *
 * @example
 * ```typescript
 * const newPath = await cloneCareerPath('cp-123', {
 *   pathName: 'Modified Engineering Path',
 *   targetRole: 'Principal Engineer'
 * }, 'talent-admin');
 * ```
 */
export declare function cloneCareerPath(sourcePathId: string, overrides: Partial<CareerPathData>, clonedBy: string, transaction?: Transaction): Promise<CareerPathData>;
/**
 * 8. Generates career path recommendations for an employee based on skills and interests.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} preferences - Employee preferences
 * @returns {Promise<Array<{ path: CareerPathData; matchScore: number; reasoning: string[] }>>} Recommended paths
 *
 * @example
 * ```typescript
 * const recommendations = await recommendCareerPaths('emp-123', {
 *   preferredCategory: 'technical',
 *   targetTimeframe: 36,
 *   willingToRelocate: false
 * });
 * ```
 */
export declare function recommendCareerPaths(employeeId: string, preferences: {
    preferredCategory?: string;
    targetTimeframe?: number;
    willingToRelocate?: boolean;
}): Promise<Array<{
    path: CareerPathData;
    matchScore: number;
    reasoning: string[];
}>>;
/**
 * 9. Creates a career progression plan for an employee.
 *
 * @param {Omit<CareerProgressionPlan, 'planId'>} planData - Plan configuration
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerProgressionPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createProgressionPlan({
 *   employeeId: 'emp-123',
 *   careerPathId: 'cp-456',
 *   currentRole: 'Senior Engineer',
 *   targetRole: 'Staff Engineer',
 *   startDate: new Date(),
 *   targetCompletionDate: new Date('2026-12-31'),
 *   managerId: 'mgr-789',
 *   developmentActivities: [],
 *   status: 'active'
 * });
 * ```
 */
export declare function createProgressionPlan(planData: Omit<CareerProgressionPlan, 'planId'>, transaction?: Transaction): Promise<CareerProgressionPlan>;
/**
 * 10. Updates progress on a career progression plan including milestone completion.
 *
 * @param {string} planId - Plan ID
 * @param {object} progressUpdate - Progress update data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerProgressionPlan>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await updateProgressionPlanProgress('plan-123', {
 *   completedMilestones: ['ms-1', 'ms-2'],
 *   currentMilestone: 3,
 *   progressPercentage: 60,
 *   status: 'on_track'
 * });
 * ```
 */
export declare function updateProgressionPlanProgress(planId: string, progressUpdate: {
    completedMilestones?: string[];
    currentMilestone?: number;
    progressPercentage?: number;
    status?: string;
    nextSteps?: string[];
}, transaction?: Transaction): Promise<CareerProgressionPlan>;
/**
 * 11. Adds development activity to a progression plan.
 *
 * @param {string} planId - Plan ID
 * @param {DevelopmentActivity} activity - Activity to add
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerProgressionPlan>} Updated plan
 *
 * @example
 * ```typescript
 * await addDevelopmentActivity('plan-123', {
 *   activityId: 'act-1',
 *   activityType: 'certification',
 *   title: 'AWS Solutions Architect',
 *   description: 'Complete AWS SA certification',
 *   targetCompetency: 'Cloud Architecture',
 *   startDate: new Date(),
 *   endDate: new Date('2025-06-30'),
 *   status: 'in_progress',
 *   completionPercentage: 30
 * });
 * ```
 */
export declare function addDevelopmentActivity(planId: string, activity: DevelopmentActivity, transaction?: Transaction): Promise<CareerProgressionPlan>;
/**
 * 12. Reviews and updates career progression plan status.
 *
 * @param {string} planId - Plan ID
 * @param {object} reviewData - Review data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerProgressionPlan>} Updated plan
 *
 * @example
 * ```typescript
 * await reviewProgressionPlan('plan-123', {
 *   reviewerId: 'mgr-456',
 *   reviewDate: new Date(),
 *   status: 'at_risk',
 *   feedback: 'Need to accelerate training completion',
 *   nextReviewDate: new Date('2025-03-01')
 * });
 * ```
 */
export declare function reviewProgressionPlan(planId: string, reviewData: {
    reviewerId: string;
    reviewDate: Date;
    status: string;
    feedback: string;
    nextReviewDate: Date;
}, transaction?: Transaction): Promise<CareerProgressionPlan>;
/**
 * 13. Calculates time to completion for a progression plan.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<{ estimatedMonths: number; confidence: string; factors: string[] }>} Time estimate
 *
 * @example
 * ```typescript
 * const estimate = await calculateTimeToCompletion('plan-123');
 * console.log(`Estimated ${estimate.estimatedMonths} months (${estimate.confidence})`);
 * ```
 */
export declare function calculateTimeToCompletion(planId: string): Promise<{
    estimatedMonths: number;
    confidence: string;
    factors: string[];
}>;
/**
 * 14. Retrieves all progression plans for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} filters - Optional filters
 * @returns {Promise<CareerProgressionPlan[]>} Employee's plans
 *
 * @example
 * ```typescript
 * const plans = await getEmployeeProgressionPlans('emp-123', {
 *   status: 'active'
 * });
 * ```
 */
export declare function getEmployeeProgressionPlans(employeeId: string, filters?: {
    status?: string;
}): Promise<CareerProgressionPlan[]>;
/**
 * 15. Creates an internal job posting.
 *
 * @param {Omit<InternalJobPosting, 'postingId' | 'applicantCount'>} postingData - Posting data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<InternalJobPosting>} Created posting
 *
 * @example
 * ```typescript
 * const posting = await createInternalJobPosting({
 *   jobTitle: 'Senior Product Manager',
 *   jobFamily: 'Product',
 *   department: 'Product Management',
 *   location: 'Remote',
 *   employmentType: 'full_time',
 *   jobLevel: 'Senior',
 *   salaryRange: { min: 140000, max: 180000 },
 *   requiredSkills: ['Product Strategy', 'Roadmapping'],
 *   requiredExperience: 5,
 *   description: 'Lead product initiatives...',
 *   responsibilities: [...],
 *   qualifications: [...],
 *   closingDate: new Date('2025-02-28'),
 *   hiringManagerId: 'mgr-123',
 *   internalOnly: true,
 *   status: 'active'
 * });
 * ```
 */
export declare function createInternalJobPosting(postingData: Omit<InternalJobPosting, 'postingId' | 'applicantCount' | 'postedDate'>, transaction?: Transaction): Promise<InternalJobPosting>;
/**
 * 16. Submits an application for an internal job posting.
 *
 * @param {Omit<JobApplication, 'applicationId' | 'applicationDate'>} applicationData - Application data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<JobApplication>} Created application
 *
 * @example
 * ```typescript
 * const application = await submitJobApplication({
 *   postingId: 'job-123',
 *   employeeId: 'emp-456',
 *   coverLetter: 'I am excited to apply...',
 *   status: 'submitted',
 *   matchScore: 0
 * });
 * ```
 */
export declare function submitJobApplication(applicationData: Omit<JobApplication, 'applicationId' | 'applicationDate'>, transaction?: Transaction): Promise<JobApplication>;
/**
 * 17. Calculates match score between employee and job posting.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} postingId - Job posting ID
 * @returns {Promise<{ matchScore: number; matchedSkills: string[]; missingSkills: string[]; recommendations: string[] }>} Match analysis
 *
 * @example
 * ```typescript
 * const match = await calculateJobMatchScore('emp-123', 'job-456');
 * console.log(`Match score: ${match.matchScore}%`);
 * console.log(`Missing skills: ${match.missingSkills.join(', ')}`);
 * ```
 */
export declare function calculateJobMatchScore(employeeId: string, postingId: string): Promise<{
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
}>;
/**
 * 18. Retrieves recommended job postings for an employee based on skills and career interests.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} options - Search options
 * @returns {Promise<Array<{ posting: InternalJobPosting; matchScore: number; reasoning: string[] }>>} Recommended jobs
 *
 * @example
 * ```typescript
 * const recommendations = await getRecommendedJobPostings('emp-123', {
 *   limit: 10,
 *   minMatchScore: 60
 * });
 * ```
 */
export declare function getRecommendedJobPostings(employeeId: string, options?: {
    limit?: number;
    minMatchScore?: number;
}): Promise<Array<{
    posting: InternalJobPosting;
    matchScore: number;
    reasoning: string[];
}>>;
/**
 * 19. Updates job application status with feedback.
 *
 * @param {string} applicationId - Application ID
 * @param {object} statusUpdate - Status update data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<JobApplication>} Updated application
 *
 * @example
 * ```typescript
 * await updateApplicationStatus('app-123', {
 *   status: 'interviewed',
 *   reviewNotes: 'Strong technical skills',
 *   interviewDate: new Date(),
 *   interviewFeedback: 'Excellent system design discussion'
 * });
 * ```
 */
export declare function updateApplicationStatus(applicationId: string, statusUpdate: {
    status: string;
    reviewNotes?: string;
    interviewDate?: Date;
    interviewFeedback?: string;
    decisionDate?: Date;
    decisionReason?: string;
}, transaction?: Transaction): Promise<JobApplication>;
/**
 * 20. Lists all job postings with filtering and search.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<InternalJobPosting[]>} Filtered job postings
 *
 * @example
 * ```typescript
 * const postings = await listJobPostings({
 *   department: 'Engineering',
 *   status: 'active',
 *   location: 'Remote'
 * });
 * ```
 */
export declare function listJobPostings(filters: {
    department?: string;
    jobFamily?: string;
    location?: string;
    status?: string;
    employmentType?: string;
}): Promise<InternalJobPosting[]>;
/**
 * 21. Closes a job posting and notifies applicants.
 *
 * @param {string} postingId - Posting ID
 * @param {string} closureReason - Reason for closure
 * @param {string} closedBy - User closing the posting
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await closeJobPosting('job-123', 'Position filled', 'hr-admin');
 * ```
 */
export declare function closeJobPosting(postingId: string, closureReason: string, closedBy: string, transaction?: Transaction): Promise<boolean>;
/**
 * 22. Schedules a career counseling session.
 *
 * @param {Omit<CareerCounselingSession, 'sessionId'>} sessionData - Session data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerCounselingSession>} Scheduled session
 *
 * @example
 * ```typescript
 * const session = await scheduleCareerCounselingSession({
 *   employeeId: 'emp-123',
 *   counselorId: 'counselor-456',
 *   sessionType: 'development',
 *   sessionDate: new Date('2025-02-15T14:00:00'),
 *   duration: 60,
 *   topics: ['Career path planning', 'Skill development'],
 *   status: 'scheduled'
 * });
 * ```
 */
export declare function scheduleCareerCounselingSession(sessionData: Omit<CareerCounselingSession, 'sessionId'>, transaction?: Transaction): Promise<CareerCounselingSession>;
/**
 * 23. Records notes and action items from a completed counseling session.
 *
 * @param {string} sessionId - Session ID
 * @param {object} sessionOutcome - Session outcome data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerCounselingSession>} Updated session
 *
 * @example
 * ```typescript
 * await recordCounselingSessionNotes('cs-123', {
 *   discussionNotes: 'Discussed transition to management role...',
 *   actionItems: [
 *     {
 *       itemId: 'ai-1',
 *       description: 'Complete leadership training',
 *       assignedTo: 'emp-123',
 *       dueDate: new Date('2025-03-30'),
 *       priority: 'high',
 *       status: 'pending'
 *     }
 *   ],
 *   followUpDate: new Date('2025-04-15'),
 *   status: 'completed',
 *   satisfactionRating: 5
 * });
 * ```
 */
export declare function recordCounselingSessionNotes(sessionId: string, sessionOutcome: {
    discussionNotes: string;
    actionItems: ActionItem[];
    followUpDate?: Date;
    status: string;
    satisfactionRating?: number;
}, transaction?: Transaction): Promise<CareerCounselingSession>;
/**
 * 24. Retrieves counseling session history for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} filters - Optional filters
 * @returns {Promise<CareerCounselingSession[]>} Session history
 *
 * @example
 * ```typescript
 * const sessions = await getCounselingSessionHistory('emp-123', {
 *   sessionType: 'development',
 *   fromDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function getCounselingSessionHistory(employeeId: string, filters?: {
    sessionType?: string;
    fromDate?: Date;
    toDate?: Date;
}): Promise<CareerCounselingSession[]>;
/**
 * 25. Updates action item status from counseling session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} actionItemId - Action item ID
 * @param {object} update - Update data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ActionItem>} Updated action item
 *
 * @example
 * ```typescript
 * await updateCounselingActionItem('cs-123', 'ai-1', {
 *   status: 'completed',
 *   completionDate: new Date(),
 *   notes: 'Training completed successfully'
 * });
 * ```
 */
export declare function updateCounselingActionItem(sessionId: string, actionItemId: string, update: {
    status?: string;
    completionDate?: Date;
    notes?: string;
}, transaction?: Transaction): Promise<ActionItem>;
/**
 * 26. Generates career guidance report for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<{ strengths: string[]; developmentAreas: string[]; recommendations: string[]; suggestedPaths: string[] }>} Guidance report
 *
 * @example
 * ```typescript
 * const report = await generateCareerGuidanceReport('emp-123');
 * console.log('Strengths:', report.strengths);
 * console.log('Development areas:', report.developmentAreas);
 * ```
 */
export declare function generateCareerGuidanceReport(employeeId: string): Promise<{
    strengths: string[];
    developmentAreas: string[];
    recommendations: string[];
    suggestedPaths: string[];
}>;
/**
 * 27. Assigns career counselor to employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} counselorId - Counselor ID
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await assignCareerCounselor('emp-123', 'counselor-456');
 * ```
 */
export declare function assignCareerCounselor(employeeId: string, counselorId: string, transaction?: Transaction): Promise<boolean>;
/**
 * 28. Creates or updates skills inventory for an employee.
 *
 * @param {SkillsInventory} inventoryData - Skills inventory data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SkillsInventory>} Updated inventory
 *
 * @example
 * ```typescript
 * const inventory = await updateSkillsInventory({
 *   employeeId: 'emp-123',
 *   skills: [
 *     {
 *       skillId: 'sk-1',
 *       skillName: 'TypeScript',
 *       skillCategory: 'Programming',
 *       proficiencyLevel: 'expert',
 *       yearsOfExperience: 5,
 *       lastUsed: new Date(),
 *       isCertified: false,
 *       endorsements: 10
 *     }
 *   ],
 *   lastUpdated: new Date(),
 *   assessmentDate: new Date(),
 *   assessedBy: 'mgr-456',
 *   certifications: [],
 *   languageProficiency: []
 * });
 * ```
 */
export declare function updateSkillsInventory(inventoryData: SkillsInventory, transaction?: Transaction): Promise<SkillsInventory>;
/**
 * 29. Assesses employee skills with proficiency ratings.
 *
 * @param {string} employeeId - Employee ID
 * @param {Array<{ skillId: string; assessmentScore: number; assessorId: string }>} assessments - Skill assessments
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SkillsInventory>} Updated inventory
 *
 * @example
 * ```typescript
 * await assessEmployeeSkills('emp-123', [
 *   { skillId: 'sk-1', assessmentScore: 85, assessorId: 'mgr-456' },
 *   { skillId: 'sk-2', assessmentScore: 92, assessorId: 'mgr-456' }
 * ]);
 * ```
 */
export declare function assessEmployeeSkills(employeeId: string, assessments: Array<{
    skillId: string;
    assessmentScore: number;
    assessorId: string;
}>, transaction?: Transaction): Promise<SkillsInventory>;
/**
 * 30. Identifies skills gaps between employee's current skills and target role requirements.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} targetRole - Target role ID or name
 * @returns {Promise<{ gaps: string[]; strengths: string[]; developmentPlan: string[] }>} Gap analysis
 *
 * @example
 * ```typescript
 * const gapAnalysis = await identifySkillsGaps('emp-123', 'Senior Architect');
 * console.log('Skills to develop:', gapAnalysis.gaps);
 * console.log('Development plan:', gapAnalysis.developmentPlan);
 * ```
 */
export declare function identifySkillsGaps(employeeId: string, targetRole: string): Promise<{
    gaps: string[];
    strengths: string[];
    developmentPlan: string[];
}>;
/**
 * 31. Adds certification to employee's skills inventory.
 *
 * @param {string} employeeId - Employee ID
 * @param {Certification} certification - Certification data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<SkillsInventory>} Updated inventory
 *
 * @example
 * ```typescript
 * await addCertification('emp-123', {
 *   certificationId: 'cert-1',
 *   certificationName: 'AWS Solutions Architect',
 *   issuingOrganization: 'Amazon Web Services',
 *   issueDate: new Date('2024-06-15'),
 *   expiryDate: new Date('2027-06-15'),
 *   credentialId: 'AWS-SA-12345',
 *   status: 'active'
 * });
 * ```
 */
export declare function addCertification(employeeId: string, certification: Certification, transaction?: Transaction): Promise<SkillsInventory>;
/**
 * 32. Retrieves skills inventory for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<SkillsInventory>} Skills inventory
 *
 * @example
 * ```typescript
 * const inventory = await getSkillsInventory('emp-123');
 * console.log(`Total skills: ${inventory.skills.length}`);
 * ```
 */
export declare function getSkillsInventory(employeeId: string): Promise<SkillsInventory>;
/**
 * 33. Searches for employees by skill criteria.
 *
 * @param {object} skillCriteria - Search criteria
 * @returns {Promise<Array<{ employeeId: string; matchScore: number; matchedSkills: SkillEntry[] }>>} Matching employees
 *
 * @example
 * ```typescript
 * const experts = await searchEmployeesBySkills({
 *   requiredSkills: ['TypeScript', 'React'],
 *   minProficiency: 'advanced',
 *   certificationRequired: false
 * });
 * ```
 */
export declare function searchEmployeesBySkills(skillCriteria: {
    requiredSkills: string[];
    minProficiency?: string;
    certificationRequired?: boolean;
}): Promise<Array<{
    employeeId: string;
    matchScore: number;
    matchedSkills: SkillEntry[];
}>>;
/**
 * 34. Updates employee career interests and preferences.
 *
 * @param {CareerInterests} interests - Career interests data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerInterests>} Updated interests
 *
 * @example
 * ```typescript
 * await updateCareerInterests({
 *   employeeId: 'emp-123',
 *   preferredRoles: ['Engineering Manager', 'Technical Lead'],
 *   preferredDepartments: ['Engineering', 'Product'],
 *   preferredLocations: ['Remote', 'San Francisco'],
 *   careerAspirations: 'Lead engineering teams in innovative products',
 *   workstylePreferences: ['Remote work', 'Flexible hours'],
 *   willingToRelocate: false,
 *   willingToTravel: true,
 *   travelPercentage: 20,
 *   targetTimeframe: '2-3 years',
 *   lastUpdated: new Date()
 * });
 * ```
 */
export declare function updateCareerInterests(interests: CareerInterests, transaction?: Transaction): Promise<CareerInterests>;
/**
 * 35. Retrieves employee career interests.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<CareerInterests>} Career interests
 *
 * @example
 * ```typescript
 * const interests = await getCareerInterests('emp-123');
 * console.log('Preferred roles:', interests.preferredRoles);
 * ```
 */
export declare function getCareerInterests(employeeId: string): Promise<CareerInterests>;
/**
 * 36. Matches opportunities to employee career interests.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<Array<{ opportunity: any; matchScore: number; matchReasons: string[] }>>} Matched opportunities
 *
 * @example
 * ```typescript
 * const matches = await matchOpportunitiesToInterests('emp-123');
 * matches.forEach(m => console.log(`${m.opportunity.title}: ${m.matchScore}%`));
 * ```
 */
export declare function matchOpportunitiesToInterests(employeeId: string): Promise<Array<{
    opportunity: any;
    matchScore: number;
    matchReasons: string[];
}>>;
/**
 * 37. Analyzes career preference trends across organization.
 *
 * @param {object} filters - Analysis filters
 * @returns {Promise<{ topRoles: string[]; topDepartments: string[]; remotePreference: number; relocationRate: number }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeCareerPreferenceTrends({
 *   department: 'Engineering',
 *   timeframe: '2024'
 * });
 * ```
 */
export declare function analyzeCareerPreferenceTrends(filters?: {
    department?: string;
    timeframe?: string;
}): Promise<{
    topRoles: string[];
    topDepartments: string[];
    remotePreference: number;
    relocationRate: number;
}>;
/**
 * 38. Creates a career ladder framework for a job family.
 *
 * @param {CareerLadder} ladderData - Career ladder configuration
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerLadder>} Created ladder
 *
 * @example
 * ```typescript
 * const ladder = await createCareerLadder({
 *   ladderId: 'ladder-eng',
 *   ladderName: 'Engineering Career Ladder',
 *   jobFamily: 'Engineering',
 *   track: 'technical_leadership',
 *   levels: [...],
 *   competencyFramework: 'Engineering Competencies v2',
 *   isActive: true
 * });
 * ```
 */
export declare function createCareerLadder(ladderData: CareerLadder, transaction?: Transaction): Promise<CareerLadder>;
/**
 * 39. Retrieves career ladder for a job family and track.
 *
 * @param {string} jobFamily - Job family
 * @param {string} track - Career track
 * @returns {Promise<CareerLadder>} Career ladder
 *
 * @example
 * ```typescript
 * const ladder = await getCareerLadder('Engineering', 'technical_leadership');
 * ```
 */
export declare function getCareerLadder(jobFamily: string, track: string): Promise<CareerLadder>;
/**
 * 40. Evaluates employee against career ladder level requirements.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} ladderId - Career ladder ID
 * @param {number} targetLevel - Target level
 * @returns {Promise<{ meetsRequirements: boolean; gaps: string[]; readinessScore: number }>} Evaluation result
 *
 * @example
 * ```typescript
 * const eval = await evaluateAgainstCareerLevel('emp-123', 'ladder-eng', 5);
 * console.log(`Readiness: ${eval.readinessScore}%`);
 * console.log('Gaps:', eval.gaps);
 * ```
 */
export declare function evaluateAgainstCareerLevel(employeeId: string, ladderId: string, targetLevel: number): Promise<{
    meetsRequirements: boolean;
    gaps: string[];
    readinessScore: number;
}>;
/**
 * 41. Lists all available career ladders.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<CareerLadder[]>} Career ladders
 *
 * @example
 * ```typescript
 * const ladders = await listCareerLadders({ isActive: true });
 * ```
 */
export declare function listCareerLadders(filters?: {
    jobFamily?: string;
    track?: string;
    isActive?: boolean;
}): Promise<CareerLadder[]>;
/**
 * 42. Records a career achievement for an employee.
 *
 * @param {Omit<CareerAchievement, 'achievementId'>} achievementData - Achievement data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerAchievement>} Created achievement
 *
 * @example
 * ```typescript
 * await recordCareerAchievement({
 *   employeeId: 'emp-123',
 *   achievementType: 'promotion',
 *   title: 'Promoted to Senior Engineer',
 *   description: 'Advanced to Senior Engineer role',
 *   achievementDate: new Date(),
 *   recognizedBy: 'mgr-456',
 *   impactDescription: 'Led 3 major projects',
 *   visibilityLevel: 'organization',
 *   endorsements: 0
 * });
 * ```
 */
export declare function recordCareerAchievement(achievementData: Omit<CareerAchievement, 'achievementId'>, transaction?: Transaction): Promise<CareerAchievement>;
/**
 * 43. Retrieves achievement history for an employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} filters - Optional filters
 * @returns {Promise<CareerAchievement[]>} Achievements
 *
 * @example
 * ```typescript
 * const achievements = await getCareerAchievements('emp-123', {
 *   achievementType: 'promotion'
 * });
 * ```
 */
export declare function getCareerAchievements(employeeId: string, filters?: {
    achievementType?: string;
    fromDate?: Date;
}): Promise<CareerAchievement[]>;
/**
 * 44. Endorses an employee's career achievement.
 *
 * @param {string} achievementId - Achievement ID
 * @param {string} endorsedBy - User endorsing
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CareerAchievement>} Updated achievement
 *
 * @example
 * ```typescript
 * await endorseAchievement('ach-123', 'emp-456');
 * ```
 */
export declare function endorseAchievement(achievementId: string, endorsedBy: string, transaction?: Transaction): Promise<CareerAchievement>;
/**
 * 45. Creates a rotational program.
 *
 * @param {Omit<RotationalProgram, 'programId'>} programData - Program data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<RotationalProgram>} Created program
 *
 * @example
 * ```typescript
 * const program = await createRotationalProgram({
 *   programName: 'Engineering Leadership Development',
 *   programType: 'leadership_development',
 *   duration: 12,
 *   rotations: [
 *     {
 *       rotationId: 'rot-1',
 *       department: 'Backend Engineering',
 *       role: 'Team Lead',
 *       duration: 12,
 *       learningObjectives: ['Team management', 'Architecture decisions'],
 *       mentor: 'mgr-123',
 *       sequenceNumber: 1
 *     }
 *   ],
 *   eligibilityCriteria: ['3+ years experience', 'High performer'],
 *   participants: [],
 *   startDate: new Date(),
 *   endDate: new Date('2026-01-01'),
 *   status: 'planned'
 * });
 * ```
 */
export declare function createRotationalProgram(programData: Omit<RotationalProgram, 'programId'>, transaction?: Transaction): Promise<RotationalProgram>;
/**
 * 46. Enrolls employee in rotational program.
 *
 * @param {string} programId - Program ID
 * @param {string} employeeId - Employee ID
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await enrollInRotationalProgram('rp-123', 'emp-456');
 * ```
 */
export declare function enrollInRotationalProgram(programId: string, employeeId: string, transaction?: Transaction): Promise<boolean>;
/**
 * 47. Generates comprehensive career development analytics and insights.
 *
 * @param {object} filters - Analysis filters
 * @returns {Promise<CareerAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateCareerDevelopmentAnalytics({
 *   department: 'Engineering',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date() }
 * });
 * console.log('Internal mobility rate:', analytics.metrics.internalMobilityRate);
 * console.log('Top career paths:', analytics.metrics.topCareerPaths);
 * ```
 */
export declare function generateCareerDevelopmentAnalytics(filters?: {
    department?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}): Promise<CareerAnalytics>;
/**
 * NestJS Service wrapper for Career Development operations.
 * Provides injectable service for use in NestJS applications.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [CareerDevelopmentService],
 *   exports: [CareerDevelopmentService],
 * })
 * export class CareerDevelopmentModule {}
 * ```
 */
export declare class CareerDevelopmentService {
    createCareerPath: typeof createCareerPath;
    getCareerPathVisualization: typeof getCareerPathVisualization;
    listCareerPaths: typeof listCareerPaths;
    updateCareerPath: typeof updateCareerPath;
    deactivateCareerPath: typeof deactivateCareerPath;
    addMilestoneToPath: typeof addMilestoneToPath;
    cloneCareerPath: typeof cloneCareerPath;
    recommendCareerPaths: typeof recommendCareerPaths;
    createProgressionPlan: typeof createProgressionPlan;
    updateProgressionPlanProgress: typeof updateProgressionPlanProgress;
    addDevelopmentActivity: typeof addDevelopmentActivity;
    reviewProgressionPlan: typeof reviewProgressionPlan;
    calculateTimeToCompletion: typeof calculateTimeToCompletion;
    getEmployeeProgressionPlans: typeof getEmployeeProgressionPlans;
    createInternalJobPosting: typeof createInternalJobPosting;
    submitJobApplication: typeof submitJobApplication;
    calculateJobMatchScore: typeof calculateJobMatchScore;
    getRecommendedJobPostings: typeof getRecommendedJobPostings;
    updateApplicationStatus: typeof updateApplicationStatus;
    listJobPostings: typeof listJobPostings;
    closeJobPosting: typeof closeJobPosting;
    scheduleCareerCounselingSession: typeof scheduleCareerCounselingSession;
    recordCounselingSessionNotes: typeof recordCounselingSessionNotes;
    getCounselingSessionHistory: typeof getCounselingSessionHistory;
    updateCounselingActionItem: typeof updateCounselingActionItem;
    generateCareerGuidanceReport: typeof generateCareerGuidanceReport;
    assignCareerCounselor: typeof assignCareerCounselor;
    updateSkillsInventory: typeof updateSkillsInventory;
    assessEmployeeSkills: typeof assessEmployeeSkills;
    identifySkillsGaps: typeof identifySkillsGaps;
    addCertification: typeof addCertification;
    getSkillsInventory: typeof getSkillsInventory;
    searchEmployeesBySkills: typeof searchEmployeesBySkills;
    updateCareerInterests: typeof updateCareerInterests;
    getCareerInterests: typeof getCareerInterests;
    matchOpportunitiesToInterests: typeof matchOpportunitiesToInterests;
    analyzeCareerPreferenceTrends: typeof analyzeCareerPreferenceTrends;
    createCareerLadder: typeof createCareerLadder;
    getCareerLadder: typeof getCareerLadder;
    evaluateAgainstCareerLevel: typeof evaluateAgainstCareerLevel;
    listCareerLadders: typeof listCareerLadders;
    recordCareerAchievement: typeof recordCareerAchievement;
    getCareerAchievements: typeof getCareerAchievements;
    endorseAchievement: typeof endorseAchievement;
    createRotationalProgram: typeof createRotationalProgram;
    enrollInRotationalProgram: typeof enrollInRotationalProgram;
    generateCareerDevelopmentAnalytics: typeof generateCareerDevelopmentAnalytics;
}
export {};
//# sourceMappingURL=career-development-kit.d.ts.map