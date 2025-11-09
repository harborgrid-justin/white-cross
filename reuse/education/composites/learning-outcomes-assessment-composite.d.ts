/**
 * LOC: EDU-COMP-OUTCOMES-001
 * File: /reuse/education/composites/learning-outcomes-assessment-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../learning-outcomes-kit
 *   - ../grading-assessment-kit
 *   - ../curriculum-management-kit
 *   - ../compliance-reporting-kit
 *   - ../student-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Outcomes assessment controllers
 *   - Accreditation reporting services
 *   - Competency tracking modules
 *   - Program review systems
 *   - Assessment planning services
 */
import { Sequelize } from 'sequelize';
/**
 * Outcome level types
 */
export type OutcomeLevel = 'institutional' | 'program' | 'course' | 'module' | 'assignment';
/**
 * Achievement level types
 */
export type AchievementLevel = 'exceeds' | 'meets' | 'approaches' | 'developing' | 'beginning';
/**
 * Assessment cycle status
 */
export type AssessmentCycleStatus = 'planning' | 'data_collection' | 'analysis' | 'reporting' | 'improvement' | 'complete';
/**
 * Bloom's taxonomy levels
 */
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
/**
 * Accreditation status
 */
export type AccreditationStatus = 'fully_accredited' | 'provisional' | 'under_review' | 'not_accredited';
/**
 * Learning outcome data
 */
export interface LearningOutcomeData {
    outcomeCode: string;
    outcomeName: string;
    description: string;
    level: OutcomeLevel;
    bloomLevel: BloomLevel;
    parentId?: string;
    programId?: string;
    courseId?: string;
    measurable: boolean;
    alignedStandards?: string[];
    assessmentMethods?: string[];
    targetAchievement?: number;
}
/**
 * Competency data
 */
export interface CompetencyData {
    competencyCode: string;
    competencyName: string;
    description: string;
    programId: string;
    skillAreas: string[];
    proficiencyLevels: Array<{
        level: number;
        description: string;
        criteria: string[];
    }>;
    relatedOutcomes: string[];
}
/**
 * Outcome assessment data
 */
export interface OutcomeAssessmentData {
    outcomeId: string;
    assessmentName: string;
    assessmentDate: Date;
    assessmentMethod: string;
    sampleSize: number;
    achievementData: Array<{
        level: AchievementLevel;
        count: number;
        percentage: number;
    }>;
    targetMet: boolean;
    analysis: string;
    improvements: string[];
}
/**
 * Assessment plan data
 */
export interface AssessmentPlanData {
    programId: string;
    academicYear: string;
    outcomes: string[];
    assessmentMethods: Array<{
        outcomeId: string;
        method: string;
        timeline: string;
        responsible: string;
    }>;
    dataCollectionPlan: string;
    analysisApproach: string;
    reportingSchedule: string;
}
/**
 * Rubric criterion
 */
export interface RubricCriterion {
    criterionName: string;
    description: string;
    weight: number;
    levels: Array<{
        level: AchievementLevel;
        points: number;
        descriptor: string;
    }>;
}
/**
 * Accreditation report data
 */
export interface AccreditationReportData {
    programId: string;
    accreditingBody: string;
    reportType: 'self_study' | 'annual' | 'interim' | 'response';
    reportingPeriod: string;
    standards: Array<{
        standardId: string;
        standardName: string;
        evidence: string[];
        status: 'met' | 'partially_met' | 'not_met';
    }>;
    strengths: string[];
    areasForImprovement: string[];
    actionPlan: string[];
}
/**
 * Sequelize model for Learning Outcomes with full metadata.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     LearningOutcome:
 *       type: object
 *       required:
 *         - outcomeCode
 *         - outcomeName
 *         - level
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         outcomeCode:
 *           type: string
 *           example: "PLO-CS-01"
 *         outcomeName:
 *           type: string
 *           example: "Design and implement complex software systems"
 *         level:
 *           type: string
 *           enum: [institutional, program, course, module, assignment]
 *         bloomLevel:
 *           type: string
 *           enum: [remember, understand, apply, analyze, evaluate, create]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LearningOutcome model
 *
 * @example
 * ```typescript
 * const LearningOutcome = createLearningOutcomeModel(sequelize);
 * const outcome = await LearningOutcome.create({
 *   outcomeCode: 'PLO-CS-01',
 *   outcomeName: 'Design complex software systems',
 *   description: 'Students will design and implement...',
 *   level: 'program',
 *   bloomLevel: 'create',
 *   programId: 'cs-bs',
 *   measurable: true,
 *   targetAchievement: 80
 * });
 * ```
 */
export declare const createLearningOutcomeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        outcomeCode: string;
        outcomeName: string;
        description: string;
        level: OutcomeLevel;
        bloomLevel: BloomLevel;
        parentId: string | null;
        programId: string | null;
        courseId: string | null;
        measurable: boolean;
        alignedStandards: string[];
        assessmentMethods: string[];
        targetAchievement: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Outcome Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OutcomeAssessment model
 */
export declare const createOutcomeAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        outcomeId: string;
        assessmentName: string;
        assessmentDate: Date;
        assessmentMethod: string;
        sampleSize: number;
        achievementData: any;
        targetMet: boolean;
        analysis: string;
        improvements: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Learning Outcomes Assessment Composite Service
 *
 * Provides comprehensive learning outcomes management, competency tracking,
 * assessment planning, and accreditation reporting for higher education institutions.
 */
export declare class LearningOutcomesAssessmentService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates a new learning outcome.
     *
     * @param {LearningOutcomeData} outcomeData - Outcome data
     * @returns {Promise<any>} Created outcome
     *
     * @example
     * ```typescript
     * const outcome = await service.createLearningOutcome({
     *   outcomeCode: 'PLO-CS-01',
     *   outcomeName: 'Design and implement complex software systems',
     *   description: 'Students will design, implement, and test...',
     *   level: 'program',
     *   bloomLevel: 'create',
     *   programId: 'cs-bs',
     *   measurable: true,
     *   alignedStandards: ['ABET-CS-1', 'ABET-CS-2'],
     *   assessmentMethods: ['capstone', 'portfolio'],
     *   targetAchievement: 80
     * });
     * ```
     */
    createLearningOutcome(outcomeData: LearningOutcomeData): Promise<any>;
    /**
     * 2. Updates learning outcome.
     *
     * @param {string} outcomeId - Outcome ID
     * @param {Partial<LearningOutcomeData>} updates - Updates
     * @returns {Promise<any>} Updated outcome
     *
     * @example
     * ```typescript
     * await service.updateLearningOutcome('outcome-123', {
     *   targetAchievement: 85,
     *   assessmentMethods: ['capstone', 'portfolio', 'exam']
     * });
     * ```
     */
    updateLearningOutcome(outcomeId: string, updates: Partial<LearningOutcomeData>): Promise<any>;
    /**
     * 3. Retrieves all outcomes for program.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} Program outcomes
     *
     * @example
     * ```typescript
     * const outcomes = await service.getProgramOutcomes('cs-bs');
     * ```
     */
    getProgramOutcomes(programId: string): Promise<any[]>;
    /**
     * 4. Retrieves all outcomes for course.
     *
     * @param {string} courseId - Course ID
     * @returns {Promise<any[]>} Course outcomes
     *
     * @example
     * ```typescript
     * const outcomes = await service.getCourseOutcomes('cs-101');
     * ```
     */
    getCourseOutcomes(courseId: string): Promise<any[]>;
    /**
     * 5. Maps course outcomes to program outcomes.
     *
     * @param {string} courseId - Course ID
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Outcome mapping
     *
     * @example
     * ```typescript
     * const mapping = await service.mapCourseOutcomesToProgram('cs-101', 'cs-bs');
     * ```
     */
    mapCourseOutcomesToProgram(courseId: string, programId: string): Promise<any>;
    /**
     * 6. Validates outcome measurability.
     *
     * @param {string} outcomeId - Outcome ID
     * @returns {Promise<{measurable: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateOutcomeMeasurability('outcome-123');
     * ```
     */
    validateOutcomeMeasurability(outcomeId: string): Promise<{
        measurable: boolean;
        issues: string[];
    }>;
    /**
     * 7. Generates outcome hierarchy tree.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Outcome hierarchy
     *
     * @example
     * ```typescript
     * const hierarchy = await service.generateOutcomeHierarchy('cs-bs');
     * ```
     */
    generateOutcomeHierarchy(programId: string): Promise<any>;
    /**
     * 8. Creates a competency framework.
     *
     * @param {CompetencyData} competencyData - Competency data
     * @returns {Promise<any>} Created competency
     *
     * @example
     * ```typescript
     * const competency = await service.createCompetency({
     *   competencyCode: 'COMP-CS-DEV',
     *   competencyName: 'Software Development',
     *   description: 'Ability to develop software applications',
     *   programId: 'cs-bs',
     *   skillAreas: ['coding', 'testing', 'debugging'],
     *   proficiencyLevels: [...],
     *   relatedOutcomes: ['PLO-CS-01', 'PLO-CS-02']
     * });
     * ```
     */
    createCompetency(competencyData: CompetencyData): Promise<any>;
    /**
     * 9. Assesses student competency level.
     *
     * @param {string} studentId - Student ID
     * @param {string} competencyId - Competency ID
     * @param {number} level - Proficiency level
     * @returns {Promise<any>} Assessment record
     *
     * @example
     * ```typescript
     * await service.assessStudentCompetency('student-123', 'comp-dev', 3);
     * ```
     */
    assessStudentCompetency(studentId: string, competencyId: string, level: number): Promise<any>;
    /**
     * 10. Tracks competency progression over time.
     *
     * @param {string} studentId - Student ID
     * @param {string} competencyId - Competency ID
     * @returns {Promise<any[]>} Progression history
     *
     * @example
     * ```typescript
     * const progression = await service.trackCompetencyProgression('student-123', 'comp-dev');
     * ```
     */
    trackCompetencyProgression(studentId: string, competencyId: string): Promise<any[]>;
    /**
     * 11. Generates competency matrix.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Competency matrix
     *
     * @example
     * ```typescript
     * const matrix = await service.generateCompetencyMatrix('cs-bs');
     * ```
     */
    generateCompetencyMatrix(programId: string): Promise<any>;
    /**
     * 12. Validates competency achievement.
     *
     * @param {string} studentId - Student ID
     * @param {string} programId - Program ID
     * @returns {Promise<{achieved: boolean; competencies: any[]}>} Achievement status
     *
     * @example
     * ```typescript
     * const achievement = await service.validateCompetencyAchievement('student-123', 'cs-bs');
     * ```
     */
    validateCompetencyAchievement(studentId: string, programId: string): Promise<{
        achieved: boolean;
        competencies: any[];
    }>;
    /**
     * 13. Exports competency portfolio.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Competency portfolio
     *
     * @example
     * ```typescript
     * const portfolio = await service.exportCompetencyPortfolio('student-123');
     * ```
     */
    exportCompetencyPortfolio(studentId: string): Promise<any>;
    /**
     * 14. Creates assessment plan for program.
     *
     * @param {AssessmentPlanData} planData - Plan data
     * @returns {Promise<any>} Created plan
     *
     * @example
     * ```typescript
     * const plan = await service.createAssessmentPlan({
     *   programId: 'cs-bs',
     *   academicYear: '2025-2026',
     *   outcomes: ['PLO-CS-01', 'PLO-CS-02'],
     *   assessmentMethods: [...],
     *   dataCollectionPlan: 'Collect from capstone projects',
     *   analysisApproach: 'Rubric-based scoring',
     *   reportingSchedule: 'Annual in May'
     * });
     * ```
     */
    createAssessmentPlan(planData: AssessmentPlanData): Promise<any>;
    /**
     * 15. Records outcome assessment results.
     *
     * @param {OutcomeAssessmentData} assessmentData - Assessment data
     * @returns {Promise<any>} Created assessment
     *
     * @example
     * ```typescript
     * const assessment = await service.recordOutcomeAssessment({
     *   outcomeId: 'outcome-123',
     *   assessmentName: 'Fall 2025 Capstone Assessment',
     *   assessmentDate: new Date(),
     *   assessmentMethod: 'rubric',
     *   sampleSize: 45,
     *   achievementData: [...],
     *   targetMet: true,
     *   analysis: 'Students demonstrated strong performance',
     *   improvements: ['Enhance early feedback']
     * });
     * ```
     */
    recordOutcomeAssessment(assessmentData: OutcomeAssessmentData): Promise<any>;
    /**
     * 16. Analyzes assessment results.
     *
     * @param {string} assessmentId - Assessment ID
     * @returns {Promise<any>} Analysis report
     *
     * @example
     * ```typescript
     * const analysis = await service.analyzeAssessmentResults('assess-123');
     * ```
     */
    analyzeAssessmentResults(assessmentId: string): Promise<any>;
    /**
     * 17. Generates assessment timeline.
     *
     * @param {string} programId - Program ID
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Assessment timeline
     *
     * @example
     * ```typescript
     * const timeline = await service.generateAssessmentTimeline('cs-bs', '2025-2026');
     * ```
     */
    generateAssessmentTimeline(programId: string, academicYear: string): Promise<any>;
    /**
     * 18. Creates assessment rubric.
     *
     * @param {string} outcomeName - Outcome name
     * @param {RubricCriterion[]} criteria - Rubric criteria
     * @returns {Promise<any>} Created rubric
     *
     * @example
     * ```typescript
     * const rubric = await service.createAssessmentRubric('Software Design', [
     *   { criterionName: 'Architecture', weight: 30, levels: [...] },
     *   { criterionName: 'Code Quality', weight: 40, levels: [...] }
     * ]);
     * ```
     */
    createAssessmentRubric(outcomeName: string, criteria: RubricCriterion[]): Promise<any>;
    /**
     * 19. Applies rubric to student work.
     *
     * @param {string} rubricId - Rubric ID
     * @param {string} studentId - Student ID
     * @param {any} scores - Criterion scores
     * @returns {Promise<any>} Rubric evaluation
     *
     * @example
     * ```typescript
     * const evaluation = await service.applyRubricToWork('rubric-123', 'student-456', {
     *   architecture: 'meets',
     *   codeQuality: 'exceeds'
     * });
     * ```
     */
    applyRubricToWork(rubricId: string, studentId: string, scores: any): Promise<any>;
    /**
     * 20. Tracks assessment cycle progress.
     *
     * @param {string} planId - Plan ID
     * @returns {Promise<any>} Cycle progress
     *
     * @example
     * ```typescript
     * const progress = await service.trackAssessmentCycleProgress('plan-123');
     * ```
     */
    trackAssessmentCycleProgress(planId: string): Promise<any>;
    /**
     * 21. Generates accreditation self-study report.
     *
     * @param {AccreditationReportData} reportData - Report data
     * @returns {Promise<any>} Self-study report
     *
     * @example
     * ```typescript
     * const report = await service.generateAccreditationReport({
     *   programId: 'cs-bs',
     *   accreditingBody: 'ABET',
     *   reportType: 'self_study',
     *   reportingPeriod: '2019-2025',
     *   standards: [...],
     *   strengths: [...],
     *   areasForImprovement: [...],
     *   actionPlan: [...]
     * });
     * ```
     */
    generateAccreditationReport(reportData: AccreditationReportData): Promise<any>;
    /**
     * 22. Maps outcomes to accreditation standards.
     *
     * @param {string} programId - Program ID
     * @param {string} accreditingBody - Accrediting body
     * @returns {Promise<any>} Outcome-standard mapping
     *
     * @example
     * ```typescript
     * const mapping = await service.mapOutcomesToStandards('cs-bs', 'ABET');
     * ```
     */
    mapOutcomesToStandards(programId: string, accreditingBody: string): Promise<any>;
    /**
     * 23. Collects evidence for accreditation standard.
     *
     * @param {string} programId - Program ID
     * @param {string} standardId - Standard ID
     * @returns {Promise<any[]>} Evidence items
     *
     * @example
     * ```typescript
     * const evidence = await service.collectAccreditationEvidence('cs-bs', 'ABET-CS-1');
     * ```
     */
    collectAccreditationEvidence(programId: string, standardId: string): Promise<any[]>;
    /**
     * 24. Validates accreditation compliance.
     *
     * @param {string} programId - Program ID
     * @param {string} accreditingBody - Accrediting body
     * @returns {Promise<{compliant: boolean; gaps: string[]}>} Compliance status
     *
     * @example
     * ```typescript
     * const compliance = await service.validateAccreditationCompliance('cs-bs', 'ABET');
     * ```
     */
    validateAccreditationCompliance(programId: string, accreditingBody: string): Promise<{
        compliant: boolean;
        gaps: string[];
    }>;
    /**
     * 25. Tracks accreditation status.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Accreditation status
     *
     * @example
     * ```typescript
     * const status = await service.trackAccreditationStatus('cs-bs');
     * ```
     */
    trackAccreditationStatus(programId: string): Promise<any>;
    /**
     * 26. Generates continuous improvement report.
     *
     * @param {string} programId - Program ID
     * @param {string} period - Reporting period
     * @returns {Promise<any>} Improvement report
     *
     * @example
     * ```typescript
     * const report = await service.generateContinuousImprovementReport('cs-bs', '2024-2025');
     * ```
     */
    generateContinuousImprovementReport(programId: string, period: string): Promise<any>;
    /**
     * 27. Exports accreditation documentation.
     *
     * @param {string} programId - Program ID
     * @param {string} format - Export format
     * @returns {Promise<any>} Documentation package
     *
     * @example
     * ```typescript
     * const docs = await service.exportAccreditationDocs('cs-bs', 'pdf');
     * ```
     */
    exportAccreditationDocs(programId: string, format: 'pdf' | 'zip'): Promise<any>;
    /**
     * 28. Schedules accreditation site visit.
     *
     * @param {string} programId - Program ID
     * @param {Date} visitDate - Visit date
     * @returns {Promise<any>} Visit schedule
     *
     * @example
     * ```typescript
     * await service.scheduleAccreditationVisit('cs-bs', new Date('2025-11-15'));
     * ```
     */
    scheduleAccreditationVisit(programId: string, visitDate: Date): Promise<any>;
    /**
     * 29. Calculates outcome achievement rates.
     *
     * @param {string} outcomeId - Outcome ID
     * @param {string} period - Assessment period
     * @returns {Promise<any>} Achievement rates
     *
     * @example
     * ```typescript
     * const rates = await service.calculateOutcomeAchievementRates('outcome-123', '2024-2025');
     * ```
     */
    calculateOutcomeAchievementRates(outcomeId: string, period: string): Promise<any>;
    /**
     * 30. Generates longitudinal trend analysis.
     *
     * @param {string} outcomeId - Outcome ID
     * @param {number} years - Years to analyze
     * @returns {Promise<any>} Trend analysis
     *
     * @example
     * ```typescript
     * const trends = await service.generateLongitudinalTrends('outcome-123', 5);
     * ```
     */
    generateLongitudinalTrends(outcomeId: string, years: number): Promise<any>;
    /**
     * 31. Compares outcomes across cohorts.
     *
     * @param {string} outcomeId - Outcome ID
     * @param {string[]} cohorts - Cohort identifiers
     * @returns {Promise<any>} Cohort comparison
     *
     * @example
     * ```typescript
     * const comparison = await service.compareOutcomesAcrossCohorts('outcome-123', ['2023', '2024', '2025']);
     * ```
     */
    compareOutcomesAcrossCohorts(outcomeId: string, cohorts: string[]): Promise<any>;
    /**
     * 32. Identifies performance gaps.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} Performance gaps
     *
     * @example
     * ```typescript
     * const gaps = await service.identifyPerformanceGaps('cs-bs');
     * ```
     */
    identifyPerformanceGaps(programId: string): Promise<any[]>;
    /**
     * 33. Generates assessment dashboard.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Assessment dashboard
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateAssessmentDashboard('cs-bs');
     * ```
     */
    generateAssessmentDashboard(programId: string): Promise<any>;
    /**
     * 34. Exports assessment data for analytics.
     *
     * @param {string} programId - Program ID
     * @param {string} format - Export format
     * @returns {Promise<any>} Analytics data
     *
     * @example
     * ```typescript
     * const data = await service.exportAssessmentAnalytics('cs-bs', 'csv');
     * ```
     */
    exportAssessmentAnalytics(programId: string, format: 'csv' | 'json' | 'xlsx'): Promise<any>;
    /**
     * 35. Generates executive summary report.
     *
     * @param {string} programId - Program ID
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Executive summary
     *
     * @example
     * ```typescript
     * const summary = await service.generateExecutiveSummary('cs-bs', '2024-2025');
     * ```
     */
    generateExecutiveSummary(programId: string, academicYear: string): Promise<any>;
    /**
     * Retrieves outcome by ID.
     *
     * @private
     */
    private getOutcomeById;
    /**
     * Checks if outcomes are aligned.
     *
     * @private
     */
    private areOutcomesAligned;
}
export default LearningOutcomesAssessmentService;
//# sourceMappingURL=learning-outcomes-assessment-composite.d.ts.map