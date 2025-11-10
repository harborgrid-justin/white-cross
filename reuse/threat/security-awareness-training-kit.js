"use strict";
/**
 * LOC: SATK1234567
 * File: /reuse/threat/security-awareness-training-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x ORM
 *   - NestJS 10.x framework
 *   - TypeScript 5.x type definitions
 *
 * DOWNSTREAM (imported by):
 *   - Security awareness service modules
 *   - Training management controllers
 *   - Phishing simulation services
 *   - Security metrics dashboards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrainingReminders = exports.analyzeGamificationImpact = exports.trackMicroLearningEngagement = exports.generateComplianceCertification = exports.predictSecurityIncidentRisk = exports.calculateTrainingROI = exports.generatePersonalizedTraining = exports.identifyOptimalTrainingTiming = exports.analyzeTopicEffectiveness = exports.generateTrainingEffectivenessReport = exports.benchmarkSecurityCulture = exports.generateCultureDashboard = exports.trackCultureImprovement = exports.measureSecurityMaturity = exports.calculateSecurityCultureScore = exports.getBehaviorTrends = exports.detectBehaviorAnomalies = exports.identifySecurityChampions = exports.calculateUserRiskScore = exports.trackSecurityBehavior = exports.getDepartmentCompletionStats = exports.generateComplianceReport = exports.getUpcomingDueDates = exports.getTrainingCompletionMetrics = exports.completeEnrollment = exports.getAssessmentAttemptHistory = exports.identifyKnowledgeGaps = exports.getAssessmentStatistics = exports.submitAssessment = exports.createKnowledgeAssessment = exports.getPhishingTrends = exports.identifyPhishingPronUsers = exports.calculatePhishingMetrics = exports.trackPhishingInteraction = exports.createPhishingSimulation = exports.updateCampaignStatus = exports.getOverdueEnrollments = exports.enrollUsersInCampaign = exports.getActiveCampaigns = exports.createTrainingCampaign = void 0;
/**
 * File: /reuse/threat/security-awareness-training-kit.ts
 * Locator: WC-SEC-SATK-001
 * Purpose: Comprehensive Security Awareness Training Management - Campaign orchestration, phishing simulation, metrics tracking, assessment
 *
 * Upstream: Sequelize models for training campaigns, user assessments, phishing simulations, security culture metrics
 * Downstream: ../backend/security/*, awareness training modules, compliance reporting, security dashboards
 * Dependencies: TypeScript 5.x, Sequelize 6.x, NestJS 10.x, Swagger/OpenAPI
 * Exports: 40 utility functions for security awareness training, phishing simulations, knowledge assessments, behavior analytics
 *
 * LLM Context: Production-ready security awareness training management utilities for White Cross healthcare platform.
 * Provides comprehensive training campaign orchestration, phishing simulation workflows, completion tracking, knowledge
 * assessments, behavioral analytics, security culture measurement, and compliance reporting for HIPAA/healthcare security.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TRAINING CAMPAIGN MANAGEMENT
// ============================================================================
/**
 * 1. Creates a new security awareness training campaign.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {Partial<TrainingCampaign>} campaignData - Campaign configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TrainingCampaign>} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = await createTrainingCampaign(sequelize, {
 *   name: 'Q1 2024 Security Awareness',
 *   type: 'recurring',
 *   targetAudience: ['all_employees'],
 *   mandatoryCompletion: true,
 *   passingScore: 80,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31')
 * });
 * ```
 */
const createTrainingCampaign = async (TrainingCampaignModel, campaignData, transaction) => {
    return await TrainingCampaignModel.create({
        ...campaignData,
        status: campaignData.status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
    }, { transaction });
};
exports.createTrainingCampaign = createTrainingCampaign;
/**
 * 2. Retrieves active training campaigns with enrollment statistics.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active campaigns with stats
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveCampaigns(
 *   TrainingCampaign,
 *   Enrollment,
 *   { type: 'compliance' }
 * );
 * ```
 */
const getActiveCampaigns = async (CampaignModel, EnrollmentModel, filters) => {
    return await CampaignModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['scheduled', 'active'] },
            ...filters,
        },
        include: [
            {
                model: EnrollmentModel,
                as: 'enrollments',
                attributes: [],
                required: false,
            },
        ],
        attributes: {
            include: [
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('enrollments.id')), 'enrollmentCount'],
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN enrollments.status = 'completed' THEN 1 END")),
                    'completedCount',
                ],
                [
                    (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN enrollments.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(enrollments.id), 0), 2)"),
                    'completionRate',
                ],
            ],
        },
        group: ['TrainingCampaign.id'],
        order: [['startDate', 'ASC']],
    });
};
exports.getActiveCampaigns = getActiveCampaigns;
/**
 * 3. Enrolls users in a training campaign with automatic due date calculation.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} userIds - Array of user IDs
 * @param {number} dueDays - Days until due date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await enrollUsersInCampaign(
 *   Enrollment,
 *   'campaign-123',
 *   ['user-1', 'user-2', 'user-3'],
 *   30
 * );
 * ```
 */
const enrollUsersInCampaign = async (EnrollmentModel, campaignId, userIds, dueDays, transaction) => {
    const enrollmentData = userIds.map((userId) => ({
        campaignId,
        userId,
        enrolledAt: new Date(),
        dueDate: new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000),
        status: 'pending',
        attempts: 0,
    }));
    return await EnrollmentModel.bulkCreate(enrollmentData, {
        transaction,
        ignoreDuplicates: true,
        returning: true,
    });
};
exports.enrollUsersInCampaign = enrollUsersInCampaign;
/**
 * 4. Retrieves overdue training enrollments for reminder notifications.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {number} [gracePeriodDays=0] - Grace period before marking overdue
 * @returns {Promise<any[]>} Overdue enrollments
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueEnrollments(Enrollment, 7);
 * // Returns enrollments overdue by more than 7 days
 * ```
 */
const getOverdueEnrollments = async (EnrollmentModel, UserModel, CampaignModel, gracePeriodDays = 0) => {
    const overdueDate = new Date(Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000);
    return await EnrollmentModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
            dueDate: { [sequelize_1.Op.lt]: overdueDate },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: true,
            },
            {
                model: CampaignModel,
                as: 'campaign',
                attributes: ['id', 'name', 'type'],
                required: true,
            },
        ],
        order: [['dueDate', 'ASC']],
    });
};
exports.getOverdueEnrollments = getOverdueEnrollments;
/**
 * 5. Updates training campaign status with validation.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string} newStatus - New status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Update success
 *
 * @example
 * ```typescript
 * await updateCampaignStatus(Campaign, 'campaign-123', 'active');
 * ```
 */
const updateCampaignStatus = async (CampaignModel, campaignId, newStatus, transaction) => {
    const [affectedRows] = await CampaignModel.update({
        status: newStatus,
        updatedAt: new Date(),
    }, {
        where: { id: campaignId },
        transaction,
    });
    return affectedRows > 0;
};
exports.updateCampaignStatus = updateCampaignStatus;
// ============================================================================
// PHISHING SIMULATION
// ============================================================================
/**
 * 6. Creates and schedules a phishing simulation campaign.
 *
 * @param {ModelCtor<Model>} SimulationModel - Phishing simulation model
 * @param {Partial<PhishingSimulation>} simulationData - Simulation configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created simulation
 *
 * @example
 * ```typescript
 * const simulation = await createPhishingSimulation(PhishingSimulation, {
 *   campaignId: 'campaign-123',
 *   templateId: 'template-payroll',
 *   scheduledAt: new Date('2024-06-15T09:00:00Z'),
 *   targetedUsers: 500,
 *   difficulty: 'medium'
 * });
 * ```
 */
const createPhishingSimulation = async (SimulationModel, simulationData, transaction) => {
    return await SimulationModel.create({
        ...simulationData,
        status: 'scheduled',
        emailsSent: 0,
        clickedLinks: 0,
        reportedPhishing: 0,
        compromisedCredentials: 0,
    }, { transaction });
};
exports.createPhishingSimulation = createPhishingSimulation;
/**
 * 7. Tracks phishing simulation interactions (clicks, reports, credential entry).
 *
 * @param {ModelCtor<Model>} InteractionModel - Interaction tracking model
 * @param {string} simulationId - Simulation identifier
 * @param {string} userId - User identifier
 * @param {string} interactionType - Type of interaction
 * @param {Record<string, any>} [metadata] - Additional context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tracked interaction
 *
 * @example
 * ```typescript
 * await trackPhishingInteraction(
 *   PhishingInteraction,
 *   'sim-123',
 *   'user-456',
 *   'clicked_link',
 *   { ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...' }
 * );
 * ```
 */
const trackPhishingInteraction = async (InteractionModel, simulationId, userId, interactionType, metadata, transaction) => {
    return await InteractionModel.create({
        simulationId,
        userId,
        interactionType,
        timestamp: new Date(),
        metadata: metadata || {},
    }, { transaction });
};
exports.trackPhishingInteraction = trackPhishingInteraction;
/**
 * 8. Calculates phishing simulation metrics and user resilience scores.
 *
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {ModelCtor<Model>} InteractionModel - Interaction model
 * @param {string} simulationId - Simulation identifier
 * @returns {Promise<PhishingMetrics>} Simulation metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePhishingMetrics(
 *   PhishingSimulation,
 *   PhishingInteraction,
 *   'sim-123'
 * );
 * // { clickRate: 12.5, reportRate: 45.2, resilienceScore: 87.5 }
 * ```
 */
const calculatePhishingMetrics = async (SimulationModel, InteractionModel, simulationId) => {
    const simulation = await SimulationModel.findOne({
        where: { id: simulationId },
        include: [
            {
                model: InteractionModel,
                as: 'interactions',
                attributes: ['interactionType'],
                required: false,
            },
        ],
        attributes: {
            include: [
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'email_opened' THEN 1 END")),
                    'openedCount',
                ],
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'clicked_link' THEN 1 END")),
                    'clickedCount',
                ],
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'submitted_credentials' THEN 1 END")),
                    'submittedCount',
                ],
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'reported_phishing' THEN 1 END")),
                    'reportedCount',
                ],
            ],
        },
        group: ['PhishingSimulation.id'],
    });
    const data = simulation.get({ plain: true });
    const clickRate = (data.clickedCount / data.emailsSent) * 100;
    const reportRate = (data.reportedCount / data.emailsSent) * 100;
    const resilienceScore = Math.max(0, 100 - clickRate + reportRate / 2);
    return {
        simulationId,
        targetedUsers: data.targetedUsers,
        emailsSent: data.emailsSent,
        opened: data.openedCount,
        clickedLink: data.clickedCount,
        submittedData: data.submittedCount,
        reported: data.reportedCount,
        clickRate: parseFloat(clickRate.toFixed(2)),
        reportRate: parseFloat(reportRate.toFixed(2)),
        resilienceScore: parseFloat(resilienceScore.toFixed(2)),
    };
};
exports.calculatePhishingMetrics = calculatePhishingMetrics;
/**
 * 9. Identifies users who repeatedly fail phishing simulations (high-risk users).
 *
 * @param {ModelCtor<Model>} InteractionModel - Interaction model
 * @param {number} failureThreshold - Number of failures to flag
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any[]>} High-risk users
 *
 * @example
 * ```typescript
 * const highRiskUsers = await identifyPhishingPronUsers(
 *   PhishingInteraction,
 *   3, // Failed 3+ simulations
 *   90 // In last 90 days
 * );
 * ```
 */
const identifyPhishingPronUsers = async (InteractionModel, UserModel, failureThreshold, daysLookback) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    return await InteractionModel.findAll({
        where: {
            interactionType: { [sequelize_1.Op.in]: ['clicked_link', 'submitted_credentials'] },
            timestamp: { [sequelize_1.Op.gte]: lookbackDate },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'department'],
                required: true,
            },
        ],
        attributes: [
            'userId',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'failureCount'],
            [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('timestamp')), 'lastFailure'],
        ],
        group: ['userId', 'user.id'],
        having: (0, sequelize_1.literal)(`COUNT(id) >= ${failureThreshold}`),
        order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'DESC']],
    });
};
exports.identifyPhishingPronUsers = identifyPhishingPronUsers;
/**
 * 10. Retrieves phishing simulation performance trends over time.
 *
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any[]>} Monthly trend data
 *
 * @example
 * ```typescript
 * const trends = await getPhishingTrends(PhishingSimulation, 'org-123', 12);
 * // Returns monthly click rates, report rates for last 12 months
 * ```
 */
const getPhishingTrends = async (SimulationModel, InteractionModel, organizationId, months) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    return await SimulationModel.findAll({
        where: {
            organizationId,
            completedAt: { [sequelize_1.Op.gte]: startDate },
            status: 'completed',
        },
        include: [
            {
                model: InteractionModel,
                as: 'interactions',
                attributes: [],
                required: false,
            },
        ],
        attributes: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('completedAt')), 'month'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)('DISTINCT PhishingSimulation.id')), 'simulationCount'],
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('emailsSent')), 'totalEmails'],
            [
                (0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'clicked_link' THEN 1 ELSE 0 END")),
                'totalClicks',
            ],
            [
                (0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)("CASE WHEN interactions.interaction_type = 'reported_phishing' THEN 1 ELSE 0 END")),
                'totalReports',
            ],
            [
                (0, sequelize_1.literal)("ROUND(SUM(CASE WHEN interactions.interaction_type = 'clicked_link' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(emailsSent), 0), 2)"),
                'avgClickRate',
            ],
            [
                (0, sequelize_1.literal)("ROUND(SUM(CASE WHEN interactions.interaction_type = 'reported_phishing' THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(emailsSent), 0), 2)"),
                'avgReportRate',
            ],
        ],
        group: [(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('completedAt'))],
        order: [[(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('completedAt')), 'ASC']],
    });
};
exports.getPhishingTrends = getPhishingTrends;
// ============================================================================
// KNOWLEDGE ASSESSMENT
// ============================================================================
/**
 * 11. Creates a knowledge assessment for a training enrollment.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} enrollmentId - Enrollment identifier
 * @param {string} userId - User identifier
 * @param {string} assessmentType - Type of assessment
 * @param {number} totalQuestions - Number of questions
 * @param {number} passingScore - Passing score threshold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createKnowledgeAssessment(
 *   Assessment,
 *   'enroll-123',
 *   'user-456',
 *   'final_exam',
 *   25,
 *   80
 * );
 * ```
 */
const createKnowledgeAssessment = async (AssessmentModel, enrollmentId, userId, assessmentType, totalQuestions, passingScore, transaction) => {
    return await AssessmentModel.create({
        enrollmentId,
        userId,
        assessmentType,
        questionsTotal: totalQuestions,
        questionsAnswered: 0,
        correctAnswers: 0,
        score: 0,
        passingScore,
        passed: false,
        timeSpent: 0,
        attemptNumber: 1,
        startedAt: new Date(),
    }, { transaction });
};
exports.createKnowledgeAssessment = createKnowledgeAssessment;
/**
 * 12. Submits and grades a knowledge assessment.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} assessmentId - Assessment identifier
 * @param {any[]} answers - User answers
 * @param {number} timeSpent - Time spent in seconds
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Graded assessment
 *
 * @example
 * ```typescript
 * const result = await submitAssessment(
 *   Assessment,
 *   'assess-123',
 *   [{ questionId: 'q1', answer: 'B', correct: true }, ...],
 *   1800 // 30 minutes
 * );
 * ```
 */
const submitAssessment = async (AssessmentModel, assessmentId, answers, timeSpent, transaction) => {
    const correctCount = answers.filter((a) => a.correct).length;
    const score = (correctCount / answers.length) * 100;
    const assessment = await AssessmentModel.findByPk(assessmentId);
    const passed = score >= assessment.passingScore;
    await AssessmentModel.update({
        questionsAnswered: answers.length,
        correctAnswers: correctCount,
        score: parseFloat(score.toFixed(2)),
        passed,
        timeSpent,
        completedAt: new Date(),
    }, {
        where: { id: assessmentId },
        transaction,
    });
    return await AssessmentModel.findByPk(assessmentId);
};
exports.submitAssessment = submitAssessment;
/**
 * 13. Retrieves assessment statistics for a training campaign.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Assessment statistics
 *
 * @example
 * ```typescript
 * const stats = await getAssessmentStatistics(Assessment, 'campaign-123');
 * // { averageScore: 85.2, passRate: 92.5, averageTime: 1200 }
 * ```
 */
const getAssessmentStatistics = async (AssessmentModel, EnrollmentModel, campaignId) => {
    return await AssessmentModel.findOne({
        include: [
            {
                model: EnrollmentModel,
                as: 'enrollment',
                where: { campaignId },
                attributes: [],
                required: true,
            },
        ],
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('KnowledgeAssessment.id')), 'totalAssessments'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'averageScore'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('timeSpent')), 'averageTimeSpent'],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN passed = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)"),
                'passRate',
            ],
            [(0, sequelize_1.fn)('MIN', (0, sequelize_1.col)('score')), 'minScore'],
            [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('score')), 'maxScore'],
        ],
        where: {
            completedAt: { [sequelize_1.Op.not]: null },
        },
        raw: true,
    });
};
exports.getAssessmentStatistics = getAssessmentStatistics;
/**
 * 14. Identifies knowledge gaps based on assessment question performance.
 *
 * @param {ModelCtor<Model>} QuestionResponseModel - Question response model
 * @param {string} campaignId - Campaign identifier
 * @param {number} threshold - Failure threshold percentage
 * @returns {Promise<any[]>} Topics with low performance
 *
 * @example
 * ```typescript
 * const gaps = await identifyKnowledgeGaps(QuestionResponse, 'campaign-123', 50);
 * // Returns topics where <50% of users answered correctly
 * ```
 */
const identifyKnowledgeGaps = async (QuestionResponseModel, QuestionModel, campaignId, threshold) => {
    return await QuestionResponseModel.findAll({
        include: [
            {
                model: QuestionModel,
                as: 'question',
                attributes: ['id', 'topic', 'difficulty', 'content'],
                required: true,
            },
        ],
        attributes: [
            [(0, sequelize_1.col)('question.topic'), 'topic'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('QuestionResponse.id')), 'totalResponses'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN QuestionResponse.is_correct = true THEN 1 END")),
                'correctResponses',
            ],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN QuestionResponse.is_correct = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)"),
                'correctPercentage',
            ],
        ],
        where: {
            campaignId,
        },
        group: ['question.topic'],
        having: (0, sequelize_1.literal)(`
      ROUND(COUNT(CASE WHEN QuestionResponse.is_correct = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) < ${threshold}
    `),
        order: [[(0, sequelize_1.literal)('correctPercentage'), 'ASC']],
    });
};
exports.identifyKnowledgeGaps = identifyKnowledgeGaps;
/**
 * 15. Tracks assessment retry attempts and improvement over time.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} enrollmentId - Enrollment identifier
 * @returns {Promise<any[]>} Assessment attempt history
 *
 * @example
 * ```typescript
 * const attempts = await getAssessmentAttemptHistory(Assessment, 'enroll-123');
 * // Shows score progression across attempts
 * ```
 */
const getAssessmentAttemptHistory = async (AssessmentModel, enrollmentId) => {
    return await AssessmentModel.findAll({
        where: { enrollmentId },
        attributes: [
            'id',
            'attemptNumber',
            'score',
            'passed',
            'timeSpent',
            'startedAt',
            'completedAt',
        ],
        order: [['attemptNumber', 'ASC']],
    });
};
exports.getAssessmentAttemptHistory = getAssessmentAttemptHistory;
// ============================================================================
// TRAINING COMPLETION TRACKING
// ============================================================================
/**
 * 16. Updates enrollment progress and completion status.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} enrollmentId - Enrollment identifier
 * @param {number} score - Final assessment score
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated enrollment
 *
 * @example
 * ```typescript
 * await completeEnrollment(Enrollment, 'enroll-123', 92.5);
 * ```
 */
const completeEnrollment = async (EnrollmentModel, enrollmentId, score, transaction) => {
    const [affectedRows] = await EnrollmentModel.update({
        status: 'completed',
        completedAt: new Date(),
        score,
    }, {
        where: { id: enrollmentId },
        transaction,
    });
    return affectedRows > 0;
};
exports.completeEnrollment = completeEnrollment;
/**
 * 17. Calculates training completion metrics for a campaign.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<TrainingMetrics>} Completion metrics
 *
 * @example
 * ```typescript
 * const metrics = await getTrainingCompletionMetrics(Enrollment, 'campaign-123');
 * // { completionRate: 87.5, averageScore: 85.3, passRate: 92.1 }
 * ```
 */
const getTrainingCompletionMetrics = async (EnrollmentModel, campaignId) => {
    const result = await EnrollmentModel.findOne({
        where: { campaignId },
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalEnrolled'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN status = 'completed' THEN 1 END")),
                'completedCount',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN status = 'in_progress' THEN 1 END")),
                'inProgressCount',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN status = 'overdue' THEN 1 END")),
                'overdueCount',
            ],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)"),
                'completionRate',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'averageScore'],
            [
                (0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)("EXTRACT(EPOCH FROM (completed_at - enrolled_at))")),
                'averageTimeToComplete',
            ],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN score >= 80 THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN status = 'completed' THEN 1 END), 0), 2)"),
                'passRate',
            ],
        ],
        raw: true,
    });
    return {
        campaignId,
        totalEnrolled: parseInt(result?.totalEnrolled || '0', 10),
        completedCount: parseInt(result?.completedCount || '0', 10),
        inProgressCount: parseInt(result?.inProgressCount || '0', 10),
        overdueCount: parseInt(result?.overdueCount || '0', 10),
        completionRate: parseFloat(result?.completionRate || '0'),
        averageScore: parseFloat(result?.averageScore || '0'),
        averageTimeToComplete: parseFloat(result?.averageTimeToComplete || '0'),
        passRate: parseFloat(result?.passRate || '0'),
    };
};
exports.getTrainingCompletionMetrics = getTrainingCompletionMetrics;
/**
 * 18. Retrieves users approaching training due dates for reminders.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {number} daysBeforeDue - Days before due date to trigger reminder
 * @returns {Promise<any[]>} Enrollments needing reminders
 *
 * @example
 * ```typescript
 * const reminders = await getUpcomingDueDates(Enrollment, 7);
 * // Users with training due in next 7 days
 * ```
 */
const getUpcomingDueDates = async (EnrollmentModel, UserModel, CampaignModel, daysBeforeDue) => {
    const reminderDate = new Date(Date.now() + daysBeforeDue * 24 * 60 * 60 * 1000);
    return await EnrollmentModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
            dueDate: {
                [sequelize_1.Op.between]: [new Date(), reminderDate],
            },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: true,
            },
            {
                model: CampaignModel,
                as: 'campaign',
                attributes: ['id', 'name', 'description'],
                required: true,
            },
        ],
        order: [['dueDate', 'ASC']],
    });
};
exports.getUpcomingDueDates = getUpcomingDueDates;
/**
 * 19. Generates compliance report for completed training.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any[]>} Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(
 *   Enrollment,
 *   'campaign-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const generateComplianceReport = async (EnrollmentModel, UserModel, campaignId, startDate, endDate) => {
    return await EnrollmentModel.findAll({
        where: {
            campaignId,
            completedAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'department', 'role'],
                required: true,
            },
        ],
        attributes: [
            'id',
            'enrolledAt',
            'completedAt',
            'score',
            'attempts',
            [(0, sequelize_1.literal)("completed_at - enrolled_at"), 'completionTime'],
        ],
        order: [['completedAt', 'DESC']],
    });
};
exports.generateComplianceReport = generateComplianceReport;
/**
 * 20. Retrieves department-level training completion statistics.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Department statistics
 *
 * @example
 * ```typescript
 * const deptStats = await getDepartmentCompletionStats(Enrollment, 'campaign-123');
 * // Completion rates grouped by department
 * ```
 */
const getDepartmentCompletionStats = async (EnrollmentModel, UserModel, campaignId) => {
    return await EnrollmentModel.findAll({
        where: { campaignId },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: [],
                required: true,
            },
        ],
        attributes: [
            [(0, sequelize_1.col)('user.department'), 'department'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('Enrollment.id')), 'totalEnrolled'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN Enrollment.status = 'completed' THEN 1 END")),
                'completedCount',
            ],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN Enrollment.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)"),
                'completionRate',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('Enrollment.score')), 'averageScore'],
        ],
        group: ['user.department'],
        order: [[(0, sequelize_1.literal)('completionRate'), 'DESC']],
    });
};
exports.getDepartmentCompletionStats = getDepartmentCompletionStats;
// ============================================================================
// BEHAVIOR ANALYTICS
// ============================================================================
/**
 * 21. Tracks security behavior events for users.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {string} behaviorType - Type of behavior
 * @param {string} severity - Severity level
 * @param {string} description - Event description
 * @param {Record<string, any>} [context] - Additional context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tracked behavior event
 *
 * @example
 * ```typescript
 * await trackSecurityBehavior(
 *   SecurityBehavior,
 *   'user-123',
 *   'phishing_click',
 *   'high',
 *   'Clicked link in simulated phishing email',
 *   { simulationId: 'sim-456', templateType: 'credential_harvest' }
 * );
 * ```
 */
const trackSecurityBehavior = async (BehaviorModel, userId, behaviorType, severity, description, context, transaction) => {
    return await BehaviorModel.create({
        userId,
        behaviorType,
        severity,
        description,
        timestamp: new Date(),
        contextData: context || {},
        remediated: false,
    }, { transaction });
};
exports.trackSecurityBehavior = trackSecurityBehavior;
/**
 * 22. Calculates user risk score based on security behaviors.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<number>} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const riskScore = await calculateUserRiskScore(SecurityBehavior, 'user-123', 90);
 * // Returns weighted risk score based on 90 days of behavior
 * ```
 */
const calculateUserRiskScore = async (BehaviorModel, userId, daysLookback) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    const behaviors = await BehaviorModel.findAll({
        where: {
            userId,
            timestamp: { [sequelize_1.Op.gte]: lookbackDate },
        },
        attributes: ['behaviorType', 'severity'],
    });
    const severityWeights = { low: 1, medium: 5, high: 15, critical: 30 };
    const behaviorWeights = {
        phishing_click: 2.0,
        policy_violation: 1.5,
        security_alert: 1.0,
        phishing_report: -0.5,
        safe_practice: -0.3,
    };
    let riskScore = 0;
    behaviors.forEach((behavior) => {
        const severityWeight = severityWeights[behavior.severity] || 1;
        const behaviorWeight = behaviorWeights[behavior.behaviorType] || 1;
        riskScore += severityWeight * behaviorWeight;
    });
    return Math.min(100, Math.max(0, riskScore));
};
exports.calculateUserRiskScore = calculateUserRiskScore;
/**
 * 23. Identifies security champions (users with exemplary security practices).
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {number} daysLookback - Period to analyze
 * @param {number} threshold - Minimum positive behaviors
 * @returns {Promise<any[]>} Security champions
 *
 * @example
 * ```typescript
 * const champions = await identifySecurityChampions(SecurityBehavior, 90, 10);
 * // Users with 10+ positive behaviors in 90 days
 * ```
 */
const identifySecurityChampions = async (BehaviorModel, UserModel, daysLookback, threshold) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    return await BehaviorModel.findAll({
        where: {
            behaviorType: { [sequelize_1.Op.in]: ['phishing_report', 'safe_practice'] },
            timestamp: { [sequelize_1.Op.gte]: lookbackDate },
        },
        include: [
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'department'],
                required: true,
            },
        ],
        attributes: [
            'userId',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'positiveBehaviorCount'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN behavior_type = 'phishing_report' THEN 1 END")),
                'phishingReports',
            ],
        ],
        group: ['userId', 'user.id'],
        having: (0, sequelize_1.literal)(`COUNT(id) >= ${threshold}`),
        order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'DESC']],
    });
};
exports.identifySecurityChampions = identifySecurityChampions;
/**
 * 24. Analyzes security behavior patterns to detect anomalies.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any>} Anomaly detection results
 *
 * @example
 * ```typescript
 * const anomalies = await detectBehaviorAnomalies(SecurityBehavior, 'user-123', 30);
 * // Detects unusual security behavior patterns
 * ```
 */
const detectBehaviorAnomalies = async (BehaviorModel, userId, daysLookback) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    const userBehaviors = await BehaviorModel.findAll({
        where: {
            userId,
            timestamp: { [sequelize_1.Op.gte]: lookbackDate },
        },
        attributes: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp')), 'date'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'eventCount'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityCount',
            ],
        ],
        group: [(0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp'))],
        order: [[(0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp')), 'ASC']],
    });
    const avgData = await BehaviorModel.findOne({
        where: {
            timestamp: { [sequelize_1.Op.gte]: lookbackDate },
        },
        attributes: [
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)('daily_event_count')), 'avgDailyEvents'],
            [(0, sequelize_1.fn)('STDDEV', (0, sequelize_1.literal)('daily_event_count')), 'stdDevEvents'],
        ],
        raw: true,
    });
    return {
        userBehaviors,
        baseline: avgData,
        anomalyThreshold: avgData.avgDailyEvents + 2 * avgData.stdDevEvents,
    };
};
exports.detectBehaviorAnomalies = detectBehaviorAnomalies;
/**
 * 25. Generates behavioral trend report for risk management.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any[]>} Behavioral trends
 *
 * @example
 * ```typescript
 * const trends = await getBehaviorTrends(
 *   SecurityBehavior,
 *   'org-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const getBehaviorTrends = async (BehaviorModel, organizationId, startDate, endDate) => {
    return await BehaviorModel.findAll({
        where: {
            organizationId,
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('timestamp')), 'week'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalEvents'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN behavior_type = 'phishing_click' THEN 1 END")),
                'phishingClicks',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN behavior_type = 'phishing_report' THEN 1 END")),
                'phishingReports',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN behavior_type = 'policy_violation' THEN 1 END")),
                'policyViolations',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityEvents',
            ],
        ],
        group: [(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('timestamp'))],
        order: [[(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('timestamp')), 'ASC']],
    });
};
exports.getBehaviorTrends = getBehaviorTrends;
// ============================================================================
// SECURITY CULTURE MEASUREMENT
// ============================================================================
/**
 * 26. Calculates organizational security culture score.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Measurement period start
 * @param {Date} endDate - Measurement period end
 * @returns {Promise<SecurityCultureMetrics>} Culture metrics
 *
 * @example
 * ```typescript
 * const culture = await calculateSecurityCultureScore(
 *   sequelize,
 *   'org-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const calculateSecurityCultureScore = async (sequelize, organizationId, startDate, endDate) => {
    const [results] = await sequelize.query(`
    WITH training_metrics AS (
      SELECT
        COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as completion_rate,
        AVG(score) as avg_score
      FROM training_enrollments
      WHERE organization_id = :organizationId
        AND enrolled_at BETWEEN :startDate AND :endDate
    ),
    phishing_metrics AS (
      SELECT
        COUNT(CASE WHEN interaction_type = 'clicked_link' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as click_rate,
        COUNT(CASE WHEN interaction_type = 'reported_phishing' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as report_rate
      FROM phishing_interactions
      WHERE organization_id = :organizationId
        AND timestamp BETWEEN :startDate AND :endDate
    ),
    behavior_metrics AS (
      SELECT
        COUNT(DISTINCT CASE WHEN severity IN ('high', 'critical') AND behavior_type IN ('phishing_click', 'policy_violation') THEN user_id END) as repeat_offenders,
        COUNT(DISTINCT CASE WHEN behavior_type IN ('phishing_report', 'safe_practice') THEN user_id END) as champions
      FROM security_behaviors
      WHERE organization_id = :organizationId
        AND timestamp BETWEEN :startDate AND :endDate
    )
    SELECT
      t.completion_rate,
      p.click_rate,
      p.report_rate,
      t.avg_score,
      b.repeat_offenders,
      b.champions,
      (
        (t.completion_rate * 0.3) +
        ((100 - p.click_rate) * 0.25) +
        (p.report_rate * 0.25) +
        (t.avg_score * 0.2)
      ) as risk_score
    FROM training_metrics t
    CROSS JOIN phishing_metrics p
    CROSS JOIN behavior_metrics b
  `, {
        replacements: { organizationId, startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return {
        period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
        organizationId,
        trainingCompletionRate: parseFloat(results?.completion_rate || '0'),
        phishingClickRate: parseFloat(results?.click_rate || '0'),
        phishingReportRate: parseFloat(results?.report_rate || '0'),
        averageAssessmentScore: parseFloat(results?.avg_score || '0'),
        repeatOffenders: parseInt(results?.repeat_offenders || '0', 10),
        securityChampions: parseInt(results?.champions || '0', 10),
        riskScore: parseFloat(results?.risk_score || '0'),
        trendDirection: 'stable', // Would be calculated based on historical comparison
    };
};
exports.calculateSecurityCultureScore = calculateSecurityCultureScore;
/**
 * 27. Measures security awareness maturity level.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Maturity assessment
 *
 * @example
 * ```typescript
 * const maturity = await measureSecurityMaturity(
 *   Enrollment,
 *   PhishingSimulation,
 *   'org-123'
 * );
 * // Returns maturity level: 1-5 (Initial to Optimized)
 * ```
 */
const measureSecurityMaturity = async (EnrollmentModel, SimulationModel, BehaviorModel, organizationId) => {
    const trainingData = await EnrollmentModel.findOne({
        where: { organizationId },
        attributes: [
            [
                (0, sequelize_1.literal)("COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)"),
                'completionRate',
            ],
        ],
        raw: true,
    });
    const phishingData = await SimulationModel.findOne({
        where: { organizationId, status: 'completed' },
        attributes: [
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)('(clicked_links * 100.0 / NULLIF(emails_sent, 0))')), 'avgClickRate'],
        ],
        raw: true,
    });
    const behaviorData = await BehaviorModel.findOne({
        where: {
            organizationId,
            timestamp: { [sequelize_1.Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
        attributes: [
            [
                (0, sequelize_1.literal)("COUNT(CASE WHEN behavior_type = 'phishing_report' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)"),
                'reportRate',
            ],
        ],
        raw: true,
    });
    const completionRate = parseFloat(trainingData?.completionRate || '0');
    const clickRate = parseFloat(phishingData?.avgClickRate || '0');
    const reportRate = parseFloat(behaviorData?.reportRate || '0');
    let maturityLevel = 1;
    let maturityLabel = 'Initial';
    if (completionRate >= 90 && clickRate <= 5 && reportRate >= 60) {
        maturityLevel = 5;
        maturityLabel = 'Optimized';
    }
    else if (completionRate >= 80 && clickRate <= 10 && reportRate >= 50) {
        maturityLevel = 4;
        maturityLabel = 'Managed';
    }
    else if (completionRate >= 70 && clickRate <= 15 && reportRate >= 40) {
        maturityLevel = 3;
        maturityLabel = 'Defined';
    }
    else if (completionRate >= 50 && clickRate <= 25 && reportRate >= 20) {
        maturityLevel = 2;
        maturityLabel = 'Repeatable';
    }
    return {
        maturityLevel,
        maturityLabel,
        metrics: {
            completionRate,
            clickRate,
            reportRate,
        },
    };
};
exports.measureSecurityMaturity = measureSecurityMaturity;
/**
 * 28. Tracks security culture improvement over time.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to track
 * @returns {Promise<any[]>} Monthly culture trends
 *
 * @example
 * ```typescript
 * const trends = await trackCultureImprovement(sequelize, 'org-123', 12);
 * // Shows 12-month trend of security culture metrics
 * ```
 */
const trackCultureImprovement = async (sequelize, organizationId, months) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const [results] = await sequelize.query(`
    SELECT
      DATE_TRUNC('month', e.enrolled_at) as month,
      COUNT(CASE WHEN e.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(e.id), 0) as completion_rate,
      AVG(e.score) as avg_score,
      (
        SELECT COUNT(CASE WHEN pi.interaction_type = 'clicked_link' THEN 1 END) * 100.0 / NULLIF(COUNT(pi.id), 0)
        FROM phishing_interactions pi
        WHERE pi.organization_id = :organizationId
          AND DATE_TRUNC('month', pi.timestamp) = DATE_TRUNC('month', e.enrolled_at)
      ) as phishing_click_rate,
      (
        SELECT COUNT(CASE WHEN sb.behavior_type = 'phishing_report' THEN 1 END)
        FROM security_behaviors sb
        WHERE sb.organization_id = :organizationId
          AND DATE_TRUNC('month', sb.timestamp) = DATE_TRUNC('month', e.enrolled_at)
      ) as phishing_reports
    FROM training_enrollments e
    WHERE e.organization_id = :organizationId
      AND e.enrolled_at >= :startDate
    GROUP BY DATE_TRUNC('month', e.enrolled_at)
    ORDER BY month ASC
  `, {
        replacements: { organizationId, startDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.trackCultureImprovement = trackCultureImprovement;
/**
 * 29. Generates executive security culture dashboard metrics.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Executive dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateCultureDashboard(sequelize, 'org-123');
 * // Comprehensive security culture overview for executives
 * ```
 */
const generateCultureDashboard = async (sequelize, organizationId) => {
    const [results] = await sequelize.query(`
    WITH current_quarter AS (
      SELECT
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(e.id), 0) as training_completion,
        AVG(e.score) as avg_training_score,
        COUNT(DISTINCT e.user_id) as trained_users,
        (
          SELECT COUNT(CASE WHEN pi.interaction_type = 'clicked_link' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)
          FROM phishing_interactions pi
          WHERE pi.organization_id = :organizationId
            AND pi.timestamp >= DATE_TRUNC('quarter', CURRENT_DATE)
        ) as phishing_click_rate,
        (
          SELECT COUNT(DISTINCT user_id)
          FROM security_behaviors
          WHERE organization_id = :organizationId
            AND behavior_type IN ('phishing_click', 'policy_violation')
            AND severity IN ('high', 'critical')
            AND timestamp >= DATE_TRUNC('quarter', CURRENT_DATE)
          GROUP BY user_id
          HAVING COUNT(*) >= 3
        ) as high_risk_users,
        (
          SELECT COUNT(*)
          FROM security_incidents
          WHERE organization_id = :organizationId
            AND incident_type = 'user_error'
            AND created_at >= DATE_TRUNC('quarter', CURRENT_DATE)
        ) as user_caused_incidents
      FROM training_enrollments e
      WHERE e.organization_id = :organizationId
        AND e.enrolled_at >= DATE_TRUNC('quarter', CURRENT_DATE)
    )
    SELECT * FROM current_quarter
  `, {
        replacements: { organizationId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.generateCultureDashboard = generateCultureDashboard;
/**
 * 30. Benchmarks organization against industry security culture standards.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {string} industry - Industry vertical
 * @returns {Promise<any>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkSecurityCulture(
 *   sequelize,
 *   'org-123',
 *   'healthcare'
 * );
 * // Compares org metrics to healthcare industry averages
 * ```
 */
const benchmarkSecurityCulture = async (sequelize, organizationId, industry) => {
    const orgMetrics = await (0, exports.calculateSecurityCultureScore)(sequelize, organizationId, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date());
    // Industry benchmarks (would typically come from database)
    const industryBenchmarks = {
        healthcare: {
            trainingCompletionRate: 88.5,
            phishingClickRate: 8.2,
            phishingReportRate: 52.3,
            averageAssessmentScore: 83.7,
        },
        finance: {
            trainingCompletionRate: 92.1,
            phishingClickRate: 6.5,
            phishingReportRate: 58.9,
            averageAssessmentScore: 86.2,
        },
        technology: {
            trainingCompletionRate: 85.3,
            phishingClickRate: 9.8,
            phishingReportRate: 48.7,
            averageAssessmentScore: 81.4,
        },
    };
    const benchmark = industryBenchmarks[industry] || industryBenchmarks['technology'];
    return {
        organization: orgMetrics,
        industryAverage: benchmark,
        comparison: {
            trainingCompletionDelta: orgMetrics.trainingCompletionRate - benchmark.trainingCompletionRate,
            phishingClickDelta: orgMetrics.phishingClickRate - benchmark.phishingClickRate,
            phishingReportDelta: orgMetrics.phishingReportRate - benchmark.phishingReportRate,
            assessmentScoreDelta: orgMetrics.averageAssessmentScore - benchmark.averageAssessmentScore,
        },
    };
};
exports.benchmarkSecurityCulture = benchmarkSecurityCulture;
// ============================================================================
// ADVANCED ANALYTICS & REPORTING
// ============================================================================
/**
 * 31. Generates comprehensive training effectiveness report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Effectiveness analysis
 *
 * @example
 * ```typescript
 * const report = await generateTrainingEffectivenessReport(sequelize, 'campaign-123');
 * ```
 */
const generateTrainingEffectivenessReport = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH training_data AS (
      SELECT
        e.user_id,
        e.score as training_score,
        e.completed_at as training_completed
      FROM training_enrollments e
      WHERE e.campaign_id = :campaignId
        AND e.status = 'completed'
    ),
    post_training_behavior AS (
      SELECT
        t.user_id,
        COUNT(CASE WHEN sb.behavior_type = 'phishing_click' THEN 1 END) as phishing_failures,
        COUNT(CASE WHEN sb.behavior_type = 'phishing_report' THEN 1 END) as phishing_reports,
        COUNT(CASE WHEN sb.behavior_type = 'safe_practice' THEN 1 END) as safe_practices
      FROM training_data t
      LEFT JOIN security_behaviors sb ON t.user_id = sb.user_id
        AND sb.timestamp >= t.training_completed
        AND sb.timestamp <= t.training_completed + INTERVAL '90 days'
      GROUP BY t.user_id
    )
    SELECT
      AVG(t.training_score) as avg_training_score,
      AVG(ptb.phishing_failures) as avg_post_training_failures,
      AVG(ptb.phishing_reports) as avg_post_training_reports,
      AVG(ptb.safe_practices) as avg_safe_practices,
      CORR(t.training_score, ptb.phishing_failures) as score_failure_correlation,
      CORR(t.training_score, ptb.phishing_reports) as score_report_correlation
    FROM training_data t
    LEFT JOIN post_training_behavior ptb ON t.user_id = ptb.user_id
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.generateTrainingEffectivenessReport = generateTrainingEffectivenessReport;
/**
 * 32. Analyzes training content effectiveness by topic.
 *
 * @param {ModelCtor<Model>} QuestionResponseModel - Question response model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Topic performance analysis
 *
 * @example
 * ```typescript
 * const topicAnalysis = await analyzeTopicEffectiveness(QuestionResponse, 'campaign-123');
 * ```
 */
const analyzeTopicEffectiveness = async (QuestionResponseModel, QuestionModel, campaignId) => {
    return await QuestionResponseModel.findAll({
        include: [
            {
                model: QuestionModel,
                as: 'question',
                attributes: ['topic', 'difficulty'],
                required: true,
            },
        ],
        where: { campaignId },
        attributes: [
            [(0, sequelize_1.col)('question.topic'), 'topic'],
            [(0, sequelize_1.col)('question.difficulty'), 'difficulty'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('QuestionResponse.id')), 'totalResponses'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN QuestionResponse.is_correct = true THEN 1 END")),
                'correctResponses',
            ],
            [
                (0, sequelize_1.literal)("ROUND(COUNT(CASE WHEN QuestionResponse.is_correct = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)"),
                'correctPercentage',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('QuestionResponse.time_spent')), 'avgTimeSpent'],
        ],
        group: ['question.topic', 'question.difficulty'],
        order: [[(0, sequelize_1.literal)('correctPercentage'), 'ASC']],
    });
};
exports.analyzeTopicEffectiveness = analyzeTopicEffectiveness;
/**
 * 33. Identifies optimal training timing based on user performance patterns.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Optimal training schedule recommendations
 *
 * @example
 * ```typescript
 * const timing = await identifyOptimalTrainingTiming(Enrollment, 'org-123');
 * ```
 */
const identifyOptimalTrainingTiming = async (EnrollmentModel, organizationId) => {
    return await EnrollmentModel.findAll({
        where: {
            organizationId,
            status: 'completed',
        },
        attributes: [
            [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("DOW FROM started_at")), 'dayOfWeek'],
            [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("HOUR FROM started_at")), 'hourOfDay'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'completionCount'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'avgScore'],
            [
                (0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)("EXTRACT(EPOCH FROM (completed_at - started_at))")),
                'avgCompletionTime',
            ],
        ],
        group: [
            (0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("DOW FROM started_at")),
            (0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("HOUR FROM started_at")),
        ],
        having: (0, sequelize_1.literal)('COUNT(id) >= 10'),
        order: [[(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'DESC']],
    });
};
exports.identifyOptimalTrainingTiming = identifyOptimalTrainingTiming;
/**
 * 34. Generates personalized training recommendations based on user profile.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} userId - User identifier
 * @returns {Promise<any[]>} Personalized training recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generatePersonalizedTraining(sequelize, 'user-123');
 * ```
 */
const generatePersonalizedTraining = async (sequelize, userId) => {
    const [results] = await sequelize.query(`
    WITH user_weaknesses AS (
      SELECT
        q.topic,
        COUNT(CASE WHEN qr.is_correct = false THEN 1 END) as incorrect_count,
        COUNT(*) as total_attempts,
        (COUNT(CASE WHEN qr.is_correct = false THEN 1 END) * 100.0 / COUNT(*)) as error_rate
      FROM question_responses qr
      JOIN questions q ON qr.question_id = q.id
      WHERE qr.user_id = :userId
      GROUP BY q.topic
      HAVING COUNT(CASE WHEN qr.is_correct = false THEN 1 END) * 100.0 / COUNT(*) > 30
    ),
    recent_behaviors AS (
      SELECT
        behavior_type,
        COUNT(*) as occurrence_count
      FROM security_behaviors
      WHERE user_id = :userId
        AND timestamp >= CURRENT_DATE - INTERVAL '90 days'
        AND behavior_type IN ('phishing_click', 'policy_violation')
      GROUP BY behavior_type
    )
    SELECT
      tc.id as campaign_id,
      tc.name,
      tc.description,
      uw.topic as addresses_weakness,
      uw.error_rate,
      rb.behavior_type as addresses_behavior,
      (uw.error_rate * 0.6 + rb.occurrence_count * 10) as priority_score
    FROM training_campaigns tc
    JOIN training_modules tm ON tc.id = tm.campaign_id
    LEFT JOIN user_weaknesses uw ON tm.topic = uw.topic
    LEFT JOIN recent_behaviors rb ON tm.addresses_behavior = rb.behavior_type
    WHERE tc.status = 'active'
      AND NOT EXISTS (
        SELECT 1 FROM training_enrollments e
        WHERE e.user_id = :userId
          AND e.campaign_id = tc.id
          AND e.status IN ('completed', 'in_progress')
      )
    ORDER BY priority_score DESC NULLS LAST
    LIMIT 5
  `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.generatePersonalizedTraining = generatePersonalizedTraining;
/**
 * 35. Calculates return on investment (ROI) for security training programs.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {number} programCost - Total program cost
 * @returns {Promise<any>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateTrainingROI(sequelize, 'campaign-123', 50000);
 * ```
 */
const calculateTrainingROI = async (sequelize, campaignId, programCost) => {
    const [results] = await sequelize.query(`
    WITH pre_training AS (
      SELECT
        COUNT(CASE WHEN si.severity IN ('high', 'critical') THEN 1 END) as serious_incidents,
        AVG(si.remediation_cost) as avg_incident_cost
      FROM security_incidents si
      WHERE si.incident_type = 'user_error'
        AND si.created_at < (SELECT MIN(start_date) FROM training_campaigns WHERE id = :campaignId)
        AND si.created_at >= (SELECT MIN(start_date) FROM training_campaigns WHERE id = :campaignId) - INTERVAL '90 days'
    ),
    post_training AS (
      SELECT
        COUNT(CASE WHEN si.severity IN ('high', 'critical') THEN 1 END) as serious_incidents,
        AVG(si.remediation_cost) as avg_incident_cost
      FROM security_incidents si
      WHERE si.incident_type = 'user_error'
        AND si.created_at >= (SELECT MAX(end_date) FROM training_campaigns WHERE id = :campaignId)
        AND si.created_at <= (SELECT MAX(end_date) FROM training_campaigns WHERE id = :campaignId) + INTERVAL '90 days'
    )
    SELECT
      pre.serious_incidents as pre_training_incidents,
      post.serious_incidents as post_training_incidents,
      (pre.serious_incidents - post.serious_incidents) as incidents_prevented,
      pre.avg_incident_cost,
      ((pre.serious_incidents - post.serious_incidents) * pre.avg_incident_cost) as cost_savings,
      :programCost as program_cost,
      (((pre.serious_incidents - post.serious_incidents) * pre.avg_incident_cost - :programCost) / :programCost * 100) as roi_percentage
    FROM pre_training pre
    CROSS JOIN post_training post
  `, {
        replacements: { campaignId, programCost },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.calculateTrainingROI = calculateTrainingROI;
/**
 * 36. Predicts future security incidents based on training and behavior data.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} userId - User identifier
 * @returns {Promise<any>} Risk prediction
 *
 * @example
 * ```typescript
 * const prediction = await predictSecurityIncidentRisk(sequelize, 'user-123');
 * ```
 */
const predictSecurityIncidentRisk = async (sequelize, userId) => {
    const [results] = await sequelize.query(`
    WITH user_profile AS (
      SELECT
        AVG(e.score) as avg_training_score,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_trainings,
        MAX(e.completed_at) as last_training_date
      FROM training_enrollments e
      WHERE e.user_id = :userId
    ),
    behavior_profile AS (
      SELECT
        COUNT(CASE WHEN behavior_type = 'phishing_click' THEN 1 END) as phishing_clicks,
        COUNT(CASE WHEN behavior_type = 'policy_violation' THEN 1 END) as policy_violations,
        COUNT(CASE WHEN severity IN ('high', 'critical') THEN 1 END) as high_severity_events,
        EXTRACT(DAYS FROM (CURRENT_DATE - MAX(timestamp))) as days_since_last_event
      FROM security_behaviors
      WHERE user_id = :userId
        AND timestamp >= CURRENT_DATE - INTERVAL '180 days'
    )
    SELECT
      up.avg_training_score,
      up.completed_trainings,
      EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) as days_since_training,
      bp.phishing_clicks,
      bp.policy_violations,
      bp.high_severity_events,
      bp.days_since_last_event,
      (
        CASE
          WHEN up.avg_training_score < 70 THEN 30
          WHEN up.avg_training_score < 80 THEN 15
          ELSE 0
        END +
        CASE
          WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 365 THEN 25
          WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 180 THEN 15
          ELSE 0
        END +
        (bp.phishing_clicks * 10) +
        (bp.policy_violations * 8) +
        (bp.high_severity_events * 12)
      ) as risk_score,
      CASE
        WHEN (
          CASE
            WHEN up.avg_training_score < 70 THEN 30
            WHEN up.avg_training_score < 80 THEN 15
            ELSE 0
          END +
          CASE
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 365 THEN 25
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 180 THEN 15
            ELSE 0
          END +
          (bp.phishing_clicks * 10) +
          (bp.policy_violations * 8) +
          (bp.high_severity_events * 12)
        ) >= 60 THEN 'critical'
        WHEN (
          CASE
            WHEN up.avg_training_score < 70 THEN 30
            WHEN up.avg_training_score < 80 THEN 15
            ELSE 0
          END +
          CASE
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 365 THEN 25
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 180 THEN 15
            ELSE 0
          END +
          (bp.phishing_clicks * 10) +
          (bp.policy_violations * 8) +
          (bp.high_severity_events * 12)
        ) >= 40 THEN 'high'
        WHEN (
          CASE
            WHEN up.avg_training_score < 70 THEN 30
            WHEN up.avg_training_score < 80 THEN 15
            ELSE 0
          END +
          CASE
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 365 THEN 25
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - up.last_training_date)) > 180 THEN 15
            ELSE 0
          END +
          (bp.phishing_clicks * 10) +
          (bp.policy_violations * 8) +
          (bp.high_severity_events * 12)
        ) >= 20 THEN 'medium'
        ELSE 'low'
      END as risk_level
    FROM user_profile up
    CROSS JOIN behavior_profile bp
  `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.predictSecurityIncidentRisk = predictSecurityIncidentRisk;
/**
 * 37. Generates compliance certification report for audit purposes.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {Date} certificationDate - Certification cutoff date
 * @returns {Promise<any[]>} Certification report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceCertification(
 *   sequelize,
 *   'org-123',
 *   new Date('2024-12-31')
 * );
 * ```
 */
const generateComplianceCertification = async (sequelize, organizationId, certificationDate) => {
    const [results] = await sequelize.query(`
    SELECT
      u.id as user_id,
      u.email,
      u.first_name,
      u.last_name,
      u.department,
      u.role,
      e.campaign_id,
      tc.name as training_name,
      tc.type as training_type,
      e.enrolled_at,
      e.completed_at,
      e.score,
      e.status,
      CASE
        WHEN e.status = 'completed' AND e.score >= tc.passing_score THEN 'Certified'
        WHEN e.status = 'completed' AND e.score < tc.passing_score THEN 'Failed'
        WHEN e.status IN ('in_progress', 'pending') AND e.due_date < :certificationDate THEN 'Overdue'
        WHEN e.status IN ('in_progress', 'pending') THEN 'In Progress'
        ELSE 'Not Started'
      END as certification_status,
      e.due_date,
      CASE
        WHEN e.completed_at IS NOT NULL THEN e.completed_at + INTERVAL '1 year'
        ELSE NULL
      END as certification_expiry
    FROM users u
    LEFT JOIN training_enrollments e ON u.id = e.user_id
    LEFT JOIN training_campaigns tc ON e.campaign_id = tc.id
    WHERE u.organization_id = :organizationId
      AND u.is_active = true
      AND tc.type IN ('compliance', 'mandatory')
    ORDER BY u.department, u.last_name, u.first_name
  `, {
        replacements: { organizationId, certificationDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.generateComplianceCertification = generateComplianceCertification;
/**
 * 38. Tracks micro-learning engagement and effectiveness.
 *
 * @param {ModelCtor<Model>} MicroLearningModel - Micro-learning session model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any>} Engagement metrics
 *
 * @example
 * ```typescript
 * const engagement = await trackMicroLearningEngagement(
 *   MicroLearning,
 *   'user-123',
 *   30
 * );
 * ```
 */
const trackMicroLearningEngagement = async (MicroLearningModel, userId, daysLookback) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    return await MicroLearningModel.findOne({
        where: {
            userId,
            completedAt: { [sequelize_1.Op.gte]: lookbackDate },
        },
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'sessionsCompleted'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'averageScore'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('duration')), 'averageDuration'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT DATE(completed_at)")), 'activeDays'],
            [
                (0, sequelize_1.literal)(`
          ROUND(
            COUNT(DISTINCT DATE(completed_at)) * 100.0 / ${daysLookback},
            2
          )
        `),
                'engagementRate',
            ],
        ],
        raw: true,
    });
};
exports.trackMicroLearningEngagement = trackMicroLearningEngagement;
/**
 * 39. Analyzes gamification impact on training participation.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Gamification effectiveness analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeGamificationImpact(sequelize, 'org-123');
 * ```
 */
const analyzeGamificationImpact = async (sequelize, organizationId) => {
    const [results] = await sequelize.query(`
    WITH gamified_users AS (
      SELECT
        e.user_id,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_count,
        AVG(e.score) as avg_score,
        SUM(ga.points_earned) as total_points,
        COUNT(DISTINCT ga.badge_earned) as badges_earned
      FROM training_enrollments e
      LEFT JOIN gamification_achievements ga ON e.user_id = ga.user_id
      WHERE e.organization_id = :organizationId
        AND ga.created_at >= e.enrolled_at
      GROUP BY e.user_id
      HAVING SUM(ga.points_earned) > 0
    ),
    non_gamified_users AS (
      SELECT
        e.user_id,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_count,
        AVG(e.score) as avg_score
      FROM training_enrollments e
      WHERE e.organization_id = :organizationId
        AND NOT EXISTS (
          SELECT 1 FROM gamification_achievements ga
          WHERE ga.user_id = e.user_id
        )
      GROUP BY e.user_id
    )
    SELECT
      (SELECT AVG(completed_count) FROM gamified_users) as gamified_avg_completions,
      (SELECT AVG(avg_score) FROM gamified_users) as gamified_avg_score,
      (SELECT AVG(completed_count) FROM non_gamified_users) as non_gamified_avg_completions,
      (SELECT AVG(avg_score) FROM non_gamified_users) as non_gamified_avg_score,
      (
        (SELECT AVG(completed_count) FROM gamified_users) -
        (SELECT AVG(completed_count) FROM non_gamified_users)
      ) as completion_improvement,
      (
        (SELECT AVG(avg_score) FROM gamified_users) -
        (SELECT AVG(avg_score) FROM non_gamified_users)
      ) as score_improvement
  `, {
        replacements: { organizationId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.analyzeGamificationImpact = analyzeGamificationImpact;
/**
 * 40. Generates automated training reminders and escalations.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any[]>} Reminder and escalation queue
 *
 * @example
 * ```typescript
 * const reminders = await generateTrainingReminders(sequelize, 'org-123');
 * ```
 */
const generateTrainingReminders = async (sequelize, organizationId) => {
    const [results] = await sequelize.query(`
    SELECT
      e.id as enrollment_id,
      e.user_id,
      u.email,
      u.first_name,
      u.last_name,
      u.manager_id,
      tc.id as campaign_id,
      tc.name as training_name,
      e.enrolled_at,
      e.due_date,
      e.status,
      EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) as days_until_due,
      CASE
        WHEN e.due_date < CURRENT_DATE THEN 'overdue_escalation'
        WHEN EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 3 THEN 'urgent_reminder'
        WHEN EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 7 THEN 'standard_reminder'
        WHEN EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 14 THEN 'early_reminder'
        ELSE NULL
      END as reminder_type,
      COALESCE(nr.reminder_count, 0) as previous_reminders
    FROM training_enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN training_campaigns tc ON e.campaign_id = tc.id
    LEFT JOIN (
      SELECT enrollment_id, COUNT(*) as reminder_count
      FROM notification_logs
      WHERE notification_type LIKE '%reminder%'
      GROUP BY enrollment_id
    ) nr ON e.id = nr.enrollment_id
    WHERE e.organization_id = :organizationId
      AND e.status IN ('pending', 'in_progress')
      AND EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 14
      AND (
        nr.reminder_count IS NULL OR
        (nr.reminder_count = 0 AND EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 14) OR
        (nr.reminder_count = 1 AND EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 7) OR
        (nr.reminder_count = 2 AND EXTRACT(DAYS FROM (e.due_date - CURRENT_DATE)) <= 3) OR
        (e.due_date < CURRENT_DATE)
      )
    ORDER BY days_until_due ASC, previous_reminders ASC
  `, {
        replacements: { organizationId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.generateTrainingReminders = generateTrainingReminders;
//# sourceMappingURL=security-awareness-training-kit.js.map