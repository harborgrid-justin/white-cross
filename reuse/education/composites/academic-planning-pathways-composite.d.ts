/**
 * LOC: EDU-COMP-PLANNING-002
 * File: /reuse/education/composites/academic-planning-pathways-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../academic-planning-kit
 *   - ../degree-audit-kit
 *   - ../course-catalog-kit
 *   - ../curriculum-management-kit
 *   - ../course-registration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Academic advising controllers
 *   - Degree planning services
 *   - Student portal modules
 *   - Registration systems
 *   - Pathway visualization tools
 */
import { Sequelize } from 'sequelize';
/**
 * Plan status
 */
export type PlanStatus = 'draft' | 'active' | 'under_review' | 'approved' | 'completed' | 'archived';
/**
 * Requirement status
 */
export type RequirementStatus = 'not_started' | 'in_progress' | 'completed' | 'waived' | 'substituted';
/**
 * Course sequence difficulty
 */
export type SequenceDifficulty = 'easy' | 'moderate' | 'challenging' | 'advanced';
/**
 * Pathway type
 */
export type PathwayType = 'standard' | 'accelerated' | 'honors' | 'combined_degree' | 'custom';
/**
 * Academic plan data
 */
export interface AcademicPlanData {
    studentId: string;
    programId: string;
    catalogYear: string;
    expectedGraduationDate: Date;
    planStatus: PlanStatus;
    totalCreditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    creditsPlanned: number;
    gpaRequirement: number;
    currentGPA: number;
    advisorId?: string;
    majorIds: string[];
    minorIds?: string[];
    concentrationIds?: string[];
}
/**
 * Degree pathway
 */
export interface DegreePathway {
    pathwayId: string;
    pathwayName: string;
    pathwayType: PathwayType;
    programId: string;
    totalCredits: number;
    estimatedDuration: number;
    terms: Array<{
        termNumber: number;
        termName: string;
        courses: Array<{
            courseId: string;
            courseCode: string;
            courseTitle: string;
            credits: number;
            isRequired: boolean;
            prerequisites: string[];
        }>;
        totalCredits: number;
    }>;
    milestones: Array<{
        name: string;
        termNumber: number;
        requirements: string[];
    }>;
}
/**
 * Requirement group
 */
export interface RequirementGroup {
    groupId: string;
    groupName: string;
    groupType: 'core' | 'major' | 'minor' | 'elective' | 'general_education';
    creditsRequired: number;
    creditsCompleted: number;
    status: RequirementStatus;
    requirements: Array<{
        requirementId: string;
        description: string;
        credits: number;
        completed: boolean;
        courses: string[];
    }>;
}
/**
 * Course sequence
 */
export interface CourseSequence {
    sequenceId: string;
    sequenceName: string;
    courses: Array<{
        level: number;
        courseId: string;
        courseCode: string;
        prerequisites: string[];
        corequisites?: string[];
        difficulty: SequenceDifficulty;
    }>;
    totalCredits: number;
    estimatedTerms: number;
}
/**
 * What-if scenario
 */
export interface WhatIfScenario {
    scenarioId: string;
    scenarioName: string;
    studentId: string;
    changes: Array<{
        changeType: 'add_major' | 'add_minor' | 'remove_major' | 'change_concentration' | 'add_courses';
        details: any;
    }>;
    projectedOutcome: {
        newGraduationDate: Date;
        additionalCredits: number;
        additionalCost: number;
        feasibility: 'feasible' | 'challenging' | 'not_recommended';
        risks: string[];
    };
    createdAt: Date;
}
/**
 * Elective recommendation
 */
export interface ElectiveRecommendation {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    matchScore: number;
    reasons: string[];
    prerequisites: string[];
    nextOffering: Date;
}
/**
 * Transfer credit evaluation
 */
export interface TransferCreditEvaluation {
    transferCourseId: string;
    institutionName: string;
    courseTitle: string;
    creditsTransferred: number;
    equivalentCourseId?: string;
    equivalentCourseCode?: string;
    requirementsSatisfied: string[];
    evaluationStatus: 'pending' | 'approved' | 'denied' | 'partial';
    evaluatedBy?: string;
    evaluatedAt?: Date;
}
/**
 * Graduation requirement checklist
 */
export interface GraduationChecklist {
    studentId: string;
    programId: string;
    overallProgress: number;
    requirements: Array<{
        categoryName: string;
        required: number;
        completed: number;
        inProgress: number;
        remaining: number;
        status: RequirementStatus;
        items: Array<{
            name: string;
            completed: boolean;
            credits?: number;
        }>;
    }>;
    onTrack: boolean;
    estimatedCompletion: Date;
}
/**
 * Sequelize model for Academic Plans.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     AcademicPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         studentId:
 *           type: string
 *         programId:
 *           type: string
 *         catalogYear:
 *           type: string
 *         planStatus:
 *           type: string
 *           enum: [draft, active, under_review, approved, completed, archived]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AcademicPlan model
 *
 * @example
 * ```typescript
 * const Plan = createAcademicPlanModel(sequelize);
 * const plan = await Plan.create({
 *   studentId: 'STU123',
 *   programId: 'CS-BS',
 *   catalogYear: '2024-2025',
 *   planStatus: 'active'
 * });
 * ```
 */
export declare const createAcademicPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        programId: string;
        catalogYear: string;
        expectedGraduationDate: Date;
        planStatus: string;
        planData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Degree Pathways.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DegreePathway model
 */
export declare const createDegreePathwayModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        pathwayName: string;
        pathwayType: string;
        programId: string;
        pathwayData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for What-If Scenarios.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WhatIfScenario model
 */
export declare const createWhatIfScenarioModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        scenarioName: string;
        scenarioData: Record<string, any>;
        projectedOutcome: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Academic Planning Pathways Composite Service
 *
 * Provides comprehensive academic planning, degree pathways, program mapping,
 * and advising support for higher education SIS.
 */
export declare class AcademicPlanningPathwaysCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates comprehensive academic plan for student.
     *
     * @param {AcademicPlanData} planData - Plan data
     * @returns {Promise<any>} Created academic plan
     *
     * @example
     * ```typescript
     * const plan = await service.createComprehensiveAcademicPlan({
     *   studentId: 'STU123',
     *   programId: 'CS-BS',
     *   catalogYear: '2024-2025',
     *   expectedGraduationDate: new Date('2028-05-15'),
     *   planStatus: 'draft',
     *   totalCreditsRequired: 120,
     *   creditsCompleted: 30,
     *   creditsInProgress: 15,
     *   creditsPlanned: 0,
     *   gpaRequirement: 2.0,
     *   currentGPA: 3.5,
     *   majorIds: ['CS']
     * });
     * ```
     */
    createComprehensiveAcademicPlan(planData: AcademicPlanData): Promise<any>;
    /**
     * 2. Updates existing academic plan with validation.
     *
     * @param {string} planId - Plan identifier
     * @param {Partial<AcademicPlanData>} updates - Plan updates
     * @returns {Promise<any>} Updated plan
     *
     * @example
     * ```typescript
     * const updated = await service.updateAcademicPlan('PLAN123', {
     *   creditsCompleted: 45,
     *   currentGPA: 3.6
     * });
     * ```
     */
    updateAcademicPlan(planId: string, updates: Partial<AcademicPlanData>): Promise<any>;
    /**
     * 3. Validates academic plan against program requirements.
     *
     * @param {string} planId - Plan identifier
     * @returns {Promise<{valid: boolean; issues: string[]; warnings: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateAcademicPlan('PLAN123');
     * if (!validation.valid) {
     *   console.log('Issues:', validation.issues);
     * }
     * ```
     */
    validateAcademicPlan(planId: string): Promise<{
        valid: boolean;
        issues: string[];
        warnings: string[];
    }>;
    /**
     * 4. Generates degree plan with recommended course sequence.
     *
     * @param {string} studentId - Student identifier
     * @param {string} programId - Program identifier
     * @returns {Promise<DegreePathway>} Generated degree plan
     *
     * @example
     * ```typescript
     * const degreePlan = await service.generateDegreePlan('STU123', 'CS-BS');
     * console.log(`Total credits: ${degreePlan.totalCredits}`);
     * ```
     */
    generateDegreePlan(studentId: string, programId: string): Promise<DegreePathway>;
    /**
     * 5. Calculates academic plan progress and completion metrics.
     *
     * @param {string} planId - Plan identifier
     * @returns {Promise<{percentComplete: number; creditsRemaining: number; onTrack: boolean}>} Progress metrics
     *
     * @example
     * ```typescript
     * const progress = await service.calculatePlanProgress('PLAN123');
     * console.log(`${progress.percentComplete}% complete`);
     * ```
     */
    calculatePlanProgress(planId: string): Promise<{
        percentComplete: number;
        creditsRemaining: number;
        onTrack: boolean;
    }>;
    /**
     * 6. Identifies next academic steps and recommendations.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<Array<{step: string; priority: string; deadline?: Date}>>} Next steps
     *
     * @example
     * ```typescript
     * const nextSteps = await service.identifyNextAcademicSteps('STU123');
     * nextSteps.forEach(step => console.log(`${step.priority}: ${step.step}`));
     * ```
     */
    identifyNextAcademicSteps(studentId: string): Promise<Array<{
        step: string;
        priority: string;
        deadline?: Date;
    }>>;
    /**
     * 7. Compares multiple plan scenarios side-by-side.
     *
     * @param {string[]} planIds - Array of plan identifiers
     * @returns {Promise<Array<{planId: string; metrics: any; comparison: any}>>} Plan comparison
     *
     * @example
     * ```typescript
     * const comparison = await service.comparePlans(['PLAN123', 'PLAN456']);
     * ```
     */
    comparePlans(planIds: string[]): Promise<Array<{
        planId: string;
        metrics: any;
        comparison: any;
    }>>;
    /**
     * 8. Archives completed or outdated academic plans.
     *
     * @param {string} planId - Plan identifier
     * @returns {Promise<{archived: boolean; archivedAt: Date}>} Archive result
     *
     * @example
     * ```typescript
     * await service.archiveAcademicPlan('PLAN123');
     * ```
     */
    archiveAcademicPlan(planId: string): Promise<{
        archived: boolean;
        archivedAt: Date;
    }>;
    /**
     * 9. Generates optimal degree pathway based on student profile.
     *
     * @param {string} studentId - Student identifier
     * @param {string} programId - Program identifier
     * @returns {Promise<DegreePathway>} Optimal pathway
     *
     * @example
     * ```typescript
     * const pathway = await service.generateOptimalPathway('STU123', 'CS-BS');
     * ```
     */
    generateOptimalPathway(studentId: string, programId: string): Promise<DegreePathway>;
    /**
     * 10. Maps degree pathways with course prerequisites and sequencing.
     *
     * @param {string} programId - Program identifier
     * @returns {Promise<Array<CourseSequence>>} Course sequences
     *
     * @example
     * ```typescript
     * const sequences = await service.mapDegreePathwaySequences('CS-BS');
     * ```
     */
    mapDegreePathwaySequences(programId: string): Promise<Array<CourseSequence>>;
    /**
     * 11. Creates accelerated pathway options for qualified students.
     *
     * @param {string} studentId - Student identifier
     * @param {string} programId - Program identifier
     * @returns {Promise<DegreePathway>} Accelerated pathway
     *
     * @example
     * ```typescript
     * const accelerated = await service.createAcceleratedPathway('STU123', 'CS-BS');
     * console.log(`Complete in ${accelerated.estimatedDuration} terms`);
     * ```
     */
    createAcceleratedPathway(studentId: string, programId: string): Promise<DegreePathway>;
    /**
     * 12. Visualizes degree pathway as interactive roadmap.
     *
     * @param {string} pathwayId - Pathway identifier
     * @returns {Promise<{nodes: any[]; edges: any[]; visualization: string}>} Pathway visualization
     *
     * @example
     * ```typescript
     * const roadmap = await service.visualizePathwayRoadmap('PATH123');
     * ```
     */
    visualizePathwayRoadmap(pathwayId: string): Promise<{
        nodes: any[];
        edges: any[];
        visualization: string;
    }>;
    /**
     * 13. Identifies alternative pathways for same degree.
     *
     * @param {string} programId - Program identifier
     * @returns {Promise<Array<{pathwayId: string; name: string; pros: string[]; cons: string[]}>>} Alternative pathways
     *
     * @example
     * ```typescript
     * const alternatives = await service.identifyAlternativePathways('CS-BS');
     * ```
     */
    identifyAlternativePathways(programId: string): Promise<Array<{
        pathwayId: string;
        name: string;
        pros: string[];
        cons: string[];
    }>>;
    /**
     * 14. Validates pathway feasibility for student.
     *
     * @param {string} studentId - Student identifier
     * @param {string} pathwayId - Pathway identifier
     * @returns {Promise<{feasible: boolean; challenges: string[]; recommendations: string[]}>} Feasibility assessment
     *
     * @example
     * ```typescript
     * const feasibility = await service.validatePathwayFeasibility('STU123', 'PATH-ACCEL');
     * ```
     */
    validatePathwayFeasibility(studentId: string, pathwayId: string): Promise<{
        feasible: boolean;
        challenges: string[];
        recommendations: string[];
    }>;
    /**
     * 15. Optimizes pathway based on course availability and scheduling.
     *
     * @param {string} pathwayId - Pathway identifier
     * @returns {Promise<DegreePathway>} Optimized pathway
     *
     * @example
     * ```typescript
     * const optimized = await service.optimizePathwayScheduling('PATH123');
     * ```
     */
    optimizePathwayScheduling(pathwayId: string): Promise<DegreePathway>;
    /**
     * 16. Tracks major requirements completion status.
     *
     * @param {string} studentId - Student identifier
     * @param {string} majorId - Major identifier
     * @returns {Promise<RequirementGroup>} Major requirements
     *
     * @example
     * ```typescript
     * const requirements = await service.trackMajorRequirements('STU123', 'CS');
     * console.log(`${requirements.creditsCompleted}/${requirements.creditsRequired} credits`);
     * ```
     */
    trackMajorRequirements(studentId: string, majorId: string): Promise<RequirementGroup>;
    /**
     * 17. Monitors minor requirements progress.
     *
     * @param {string} studentId - Student identifier
     * @param {string} minorId - Minor identifier
     * @returns {Promise<RequirementGroup>} Minor requirements
     *
     * @example
     * ```typescript
     * const minorReqs = await service.monitorMinorRequirements('STU123', 'MATH');
     * ```
     */
    monitorMinorRequirements(studentId: string, minorId: string): Promise<RequirementGroup>;
    /**
     * 18. Validates general education requirements.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<Array<RequirementGroup>>} General education requirements
     *
     * @example
     * ```typescript
     * const genEd = await service.validateGeneralEducationRequirements('STU123');
     * ```
     */
    validateGeneralEducationRequirements(studentId: string): Promise<Array<RequirementGroup>>;
    /**
     * 19. Identifies missing requirements and gaps.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<Array<{category: string; missing: string[]; credits: number}>>} Missing requirements
     *
     * @example
     * ```typescript
     * const missing = await service.identifyMissingRequirements('STU123');
     * ```
     */
    identifyMissingRequirements(studentId: string): Promise<Array<{
        category: string;
        missing: string[];
        credits: number;
    }>>;
    /**
     * 20. Checks elective requirements and options.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{required: number; completed: number; options: ElectiveRecommendation[]}>} Elective status
     *
     * @example
     * ```typescript
     * const electives = await service.checkElectiveRequirements('STU123');
     * ```
     */
    checkElectiveRequirements(studentId: string): Promise<{
        required: number;
        completed: number;
        options: ElectiveRecommendation[];
    }>;
    /**
     * 21. Validates prerequisite chains for planned courses.
     *
     * @param {string} studentId - Student identifier
     * @param {string[]} courseIds - Course identifiers
     * @returns {Promise<{valid: boolean; violations: any[]}>} Prerequisite validation
     *
     * @example
     * ```typescript
     * const validation = await service.validatePrerequisiteChains('STU123', ['CS301', 'CS401']);
     * ```
     */
    validatePrerequisiteChains(studentId: string, courseIds: string[]): Promise<{
        valid: boolean;
        violations: any[];
    }>;
    /**
     * 22. Generates graduation requirement checklist.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<GraduationChecklist>} Graduation checklist
     *
     * @example
     * ```typescript
     * const checklist = await service.generateGraduationChecklist('STU123');
     * console.log(`Overall progress: ${checklist.overallProgress}%`);
     * ```
     */
    generateGraduationChecklist(studentId: string): Promise<GraduationChecklist>;
    /**
     * 23. Creates what-if scenario for major change.
     *
     * @param {string} studentId - Student identifier
     * @param {string} newMajorId - New major identifier
     * @returns {Promise<WhatIfScenario>} Scenario analysis
     *
     * @example
     * ```typescript
     * const scenario = await service.createWhatIfScenario('STU123', 'MATH');
     * console.log(`New graduation date: ${scenario.projectedOutcome.newGraduationDate}`);
     * ```
     */
    createWhatIfScenario(studentId: string, newMajorId: string): Promise<WhatIfScenario>;
    /**
     * 24. Analyzes impact of adding/removing courses.
     *
     * @param {string} studentId - Student identifier
     * @param {string[]} addCourses - Courses to add
     * @param {string[]} removeCourses - Courses to remove
     * @returns {Promise<{impact: any; recommendations: string[]}>} Impact analysis
     *
     * @example
     * ```typescript
     * const impact = await service.analyzeCourseChangeImpact('STU123', ['CS301'], ['MATH201']);
     * ```
     */
    analyzeCourseChangeImpact(studentId: string, addCourses: string[], removeCourses: string[]): Promise<{
        impact: any;
        recommendations: string[];
    }>;
    /**
     * 25. Models double major scenarios.
     *
     * @param {string} studentId - Student identifier
     * @param {string} secondMajorId - Second major identifier
     * @returns {Promise<WhatIfScenario>} Double major scenario
     *
     * @example
     * ```typescript
     * const doubleMajor = await service.modelDoubleMajorScenario('STU123', 'MATH');
     * ```
     */
    modelDoubleMajorScenario(studentId: string, secondMajorId: string): Promise<WhatIfScenario>;
    /**
     * 26. Evaluates minor addition scenarios.
     *
     * @param {string} studentId - Student identifier
     * @param {string} minorId - Minor identifier
     * @returns {Promise<WhatIfScenario>} Minor scenario
     *
     * @example
     * ```typescript
     * const minorScenario = await service.evaluateMinorAddition('STU123', 'PHIL');
     * ```
     */
    evaluateMinorAddition(studentId: string, minorId: string): Promise<WhatIfScenario>;
    /**
     * 27. Compares what-if scenarios side-by-side.
     *
     * @param {string[]} scenarioIds - Scenario identifiers
     * @returns {Promise<Array<{scenarioId: string; summary: any; ranking: number}>>} Scenario comparison
     *
     * @example
     * ```typescript
     * const comparison = await service.compareWhatIfScenarios(['SC1', 'SC2', 'SC3']);
     * ```
     */
    compareWhatIfScenarios(scenarioIds: string[]): Promise<Array<{
        scenarioId: string;
        summary: any;
        ranking: number;
    }>>;
    /**
     * 28. Saves what-if scenarios for future reference.
     *
     * @param {WhatIfScenario} scenario - Scenario to save
     * @returns {Promise<{saved: boolean; scenarioId: string}>} Save result
     *
     * @example
     * ```typescript
     * await service.saveWhatIfScenario(scenario);
     * ```
     */
    saveWhatIfScenario(scenario: WhatIfScenario): Promise<{
        saved: boolean;
        scenarioId: string;
    }>;
    /**
     * 29. Recommends elective courses based on interests and requirements.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<ElectiveRecommendation[]>} Elective recommendations
     *
     * @example
     * ```typescript
     * const recommendations = await service.recommendElectiveCourses('STU123');
     * recommendations.forEach(rec => console.log(`${rec.courseCode}: ${rec.matchScore}% match`));
     * ```
     */
    recommendElectiveCourses(studentId: string): Promise<ElectiveRecommendation[]>;
    /**
     * 30. Plans optimal course load for upcoming term.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<{recommended: string[]; credits: number; workloadRating: string}>} Course load plan
     *
     * @example
     * ```typescript
     * const courseLoad = await service.planOptimalCourseLoad('STU123', 'FALL2024');
     * ```
     */
    planOptimalCourseLoad(studentId: string, termId: string): Promise<{
        recommended: string[];
        credits: number;
        workloadRating: string;
    }>;
    /**
     * 31. Validates course scheduling conflicts.
     *
     * @param {string[]} courseIds - Course identifiers
     * @returns {Promise<{conflicts: any[]; suggestions: string[]}>} Conflict analysis
     *
     * @example
     * ```typescript
     * const conflicts = await service.validateCourseScheduling(['CS301', 'CS302', 'MATH301']);
     * ```
     */
    validateCourseScheduling(courseIds: string[]): Promise<{
        conflicts: any[];
        suggestions: string[];
    }>;
    /**
     * 32. Prioritizes course registration based on requirements.
     *
     * @param {string} studentId - Student identifier
     * @param {string[]} courseIds - Course identifiers
     * @returns {Promise<Array<{courseId: string; priority: number; reason: string}>>} Course priorities
     *
     * @example
     * ```typescript
     * const priorities = await service.prioritizeCourseRegistration('STU123', courseIds);
     * ```
     */
    prioritizeCourseRegistration(studentId: string, courseIds: string[]): Promise<Array<{
        courseId: string;
        priority: number;
        reason: string;
    }>>;
    /**
     * 33. Checks course availability and seat capacity.
     *
     * @param {string} courseId - Course identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<{available: boolean; seatsRemaining: number; waitlistLength: number}>} Availability status
     *
     * @example
     * ```typescript
     * const availability = await service.checkCourseAvailability('CS301', 'FALL2024');
     * ```
     */
    checkCourseAvailability(courseId: string, termId: string): Promise<{
        available: boolean;
        seatsRemaining: number;
        waitlistLength: number;
    }>;
    /**
     * 34. Generates multi-term course planning calendar.
     *
     * @param {string} studentId - Student identifier
     * @param {number} numberOfTerms - Number of terms to plan
     * @returns {Promise<Array<{term: string; courses: any[]; credits: number}>>} Course calendar
     *
     * @example
     * ```typescript
     * const calendar = await service.generateCourseCalendar('STU123', 4);
     * ```
     */
    generateCourseCalendar(studentId: string, numberOfTerms: number): Promise<Array<{
        term: string;
        courses: any[];
        credits: number;
    }>>;
    /**
     * 35. Evaluates transfer credits from previous institutions.
     *
     * @param {string} studentId - Student identifier
     * @param {any[]} transferCourses - Transfer course data
     * @returns {Promise<TransferCreditEvaluation[]>} Transfer evaluations
     *
     * @example
     * ```typescript
     * const evaluations = await service.evaluateTransferCredits('STU123', transferCourses);
     * ```
     */
    evaluateTransferCredits(studentId: string, transferCourses: any[]): Promise<TransferCreditEvaluation[]>;
    /**
     * 36. Applies transfer credits to degree requirements.
     *
     * @param {string} studentId - Student identifier
     * @param {string[]} transferCreditIds - Transfer credit identifiers
     * @returns {Promise<{applied: number; requirements: string[]}>} Application result
     *
     * @example
     * ```typescript
     * const result = await service.applyTransferCredits('STU123', ['TC123', 'TC456']);
     * console.log(`Applied ${result.applied} transfer credits`);
     * ```
     */
    applyTransferCredits(studentId: string, transferCreditIds: string[]): Promise<{
        applied: number;
        requirements: string[];
    }>;
    /**
     * 37. Coordinates with academic advisors on plan changes.
     *
     * @param {string} studentId - Student identifier
     * @param {string} advisorId - Advisor identifier
     * @param {any} changes - Proposed changes
     * @returns {Promise<{status: string; advisorNotes: string}>} Coordination result
     *
     * @example
     * ```typescript
     * const coordination = await service.coordinateWithAdvisor('STU123', 'ADV456', changes);
     * ```
     */
    coordinateWithAdvisor(studentId: string, advisorId: string, changes: any): Promise<{
        status: string;
        advisorNotes: string;
    }>;
    /**
     * 38. Generates advising appointment preparation materials.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{materials: string[]; questions: string[]; documents: string[]}>} Preparation materials
     *
     * @example
     * ```typescript
     * const prep = await service.generateAdvisingPreparation('STU123');
     * ```
     */
    generateAdvisingPreparation(studentId: string): Promise<{
        materials: string[];
        questions: string[];
        documents: string[];
    }>;
    /**
     * 39. Tracks academic advising notes and recommendations.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<Array<{date: Date; advisor: string; notes: string; followUp: string[]}>>} Advising history
     *
     * @example
     * ```typescript
     * const history = await service.trackAdvisingNotes('STU123');
     * ```
     */
    trackAdvisingNotes(studentId: string): Promise<Array<{
        date: Date;
        advisor: string;
        notes: string;
        followUp: string[];
    }>>;
    /**
     * 40. Generates comprehensive academic planning report.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{plan: any; progress: any; recommendations: string[]; nextSteps: any[]}>} Planning report
     *
     * @example
     * ```typescript
     * const report = await service.generatePlanningReport('STU123');
     * console.log('Comprehensive planning report generated');
     * ```
     */
    generatePlanningReport(studentId: string): Promise<{
        plan: any;
        progress: any;
        recommendations: string[];
        nextSteps: any[];
    }>;
    private generateTermSchedule;
    private generateAcademicSuccessRecommendations;
}
export default AcademicPlanningPathwaysCompositeService;
//# sourceMappingURL=academic-planning-pathways-composite.d.ts.map