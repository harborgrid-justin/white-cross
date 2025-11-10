/**
 * LOC: CONSCX12345
 * File: /reuse/consulting/customer-experience-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - CX analytics controllers
 *   - Journey mapping engines
 *   - Service design services
 */
/**
 * File: /reuse/consulting/customer-experience-kit.ts
 * Locator: WC-CONS-CX-001
 * Purpose: Comprehensive Customer Experience Management Utilities - Enterprise-grade CX framework
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, CX controllers, journey analytics, NPS tracking, touchpoint optimization
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for journey mapping, NPS analysis, touchpoint optimization, service design
 *
 * LLM Context: Enterprise-grade customer experience management system for consulting organizations.
 * Provides complete CX lifecycle management, journey mapping, persona management, NPS tracking,
 * sentiment analysis, touchpoint optimization, service design, moment-of-truth analysis, pain point identification,
 * satisfaction measurement, loyalty programs, voice-of-customer, customer effort score, experience metrics,
 * journey analytics, omnichannel experience, personalization, experience design patterns.
 */
import { Sequelize } from 'sequelize';
/**
 * Customer journey stage
 */
export declare enum JourneyStage {
    AWARENESS = "awareness",
    CONSIDERATION = "consideration",
    PURCHASE = "purchase",
    ONBOARDING = "onboarding",
    USAGE = "usage",
    SUPPORT = "support",
    RENEWAL = "renewal",
    ADVOCACY = "advocacy"
}
/**
 * Touchpoint channel
 */
export declare enum TouchpointChannel {
    WEBSITE = "website",
    MOBILE_APP = "mobile_app",
    EMAIL = "email",
    PHONE = "phone",
    CHAT = "chat",
    SOCIAL_MEDIA = "social_media",
    IN_PERSON = "in_person",
    SMS = "sms",
    PUSH_NOTIFICATION = "push_notification",
    PHYSICAL_LOCATION = "physical_location"
}
/**
 * Sentiment classification
 */
export declare enum Sentiment {
    VERY_POSITIVE = "very_positive",
    POSITIVE = "positive",
    NEUTRAL = "neutral",
    NEGATIVE = "negative",
    VERY_NEGATIVE = "very_negative"
}
/**
 * NPS category
 */
export declare enum NPSCategory {
    PROMOTER = "promoter",
    PASSIVE = "passive",
    DETRACTOR = "detractor"
}
/**
 * Experience quality
 */
export declare enum ExperienceQuality {
    EXCELLENT = "excellent",
    GOOD = "good",
    AVERAGE = "average",
    POOR = "poor",
    CRITICAL = "critical"
}
/**
 * Pain point severity
 */
export declare enum PainPointSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Customer persona interface
 */
export interface CustomerPersona {
    id: string;
    personaName: string;
    personaCode: string;
    description: string;
    demographics: Demographics;
    psychographics: Psychographics;
    goals: string[];
    painPoints: string[];
    behaviors: string[];
    preferredChannels: TouchpointChannel[];
    motivations: string[];
    frustrations: string[];
    technicalProficiency: 'low' | 'medium' | 'high';
    segmentSize: number;
    lifetimeValue: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Demographics interface
 */
export interface Demographics {
    ageRange: string;
    location: string;
    income: string;
    education: string;
    occupation: string;
}
/**
 * Psychographics interface
 */
export interface Psychographics {
    values: string[];
    interests: string[];
    lifestyle: string[];
    attitudes: string[];
}
/**
 * Customer journey interface
 */
export interface CustomerJourney {
    id: string;
    journeyName: string;
    journeyCode: string;
    personaId: string;
    description: string;
    stages: JourneyStageDetail[];
    overallSentiment: Sentiment;
    satisfactionScore: number;
    effortScore: number;
    completionRate: number;
    averageDuration: number;
    painPoints: PainPoint[];
    opportunities: Opportunity[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Journey stage detail interface
 */
export interface JourneyStageDetail {
    id: string;
    stage: JourneyStage;
    stageName: string;
    description: string;
    touchpoints: Touchpoint[];
    emotions: string[];
    customerActions: string[];
    systemActions: string[];
    duration: number;
    satisfactionScore: number;
    effortScore: number;
    painPoints: string[];
    opportunities: string[];
}
/**
 * Touchpoint interface
 */
export interface Touchpoint {
    id: string;
    journeyId: string;
    stage: JourneyStage;
    touchpointName: string;
    channel: TouchpointChannel;
    description: string;
    customerActions: string[];
    systemResponses: string[];
    satisfactionScore: number;
    effortScore: number;
    completionRate: number;
    averageDuration: number;
    interactionCount: number;
    sentiment: Sentiment;
    painPoints: string[];
    improvementOpportunities: string[];
    isKeyMoment: boolean;
    importance: number;
    performance: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Pain point interface
 */
export interface PainPoint {
    id: string;
    journeyId?: string;
    touchpointId?: string;
    stage: JourneyStage;
    painPointName: string;
    description: string;
    severity: PainPointSeverity;
    frequency: number;
    impactScore: number;
    affectedCustomers: number;
    rootCause: string;
    currentSolution?: string;
    proposedSolution: string;
    estimatedEffort: number;
    estimatedImpact: number;
    priority: number;
    status: 'identified' | 'analyzing' | 'in_progress' | 'resolved';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Opportunity interface
 */
export interface Opportunity {
    id: string;
    opportunityName: string;
    description: string;
    category: 'efficiency' | 'delight' | 'personalization' | 'innovation';
    potentialValue: number;
    implementationCost: number;
    roi: number;
    priority: number;
    status: 'identified' | 'evaluating' | 'approved' | 'implementing' | 'completed';
    metadata: Record<string, any>;
}
/**
 * NPS survey interface
 */
export interface NPSSurvey {
    id: string;
    surveyName: string;
    surveyDate: Date;
    respondentCount: number;
    promoters: number;
    passives: number;
    detractors: number;
    npsScore: number;
    responseRate: number;
    segmentBreakdown: NPSSegment[];
    trendData: NPSTrend[];
    topReasons: ReasonBreakdown[];
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * NPS segment interface
 */
export interface NPSSegment {
    segmentName: string;
    respondents: number;
    npsScore: number;
    promoters: number;
    passives: number;
    detractors: number;
}
/**
 * NPS trend interface
 */
export interface NPSTrend {
    period: string;
    npsScore: number;
    respondents: number;
    promoterRate: number;
    detractorRate: number;
}
/**
 * Reason breakdown interface
 */
export interface ReasonBreakdown {
    category: NPSCategory;
    reason: string;
    count: number;
    percentage: number;
}
/**
 * Customer feedback interface
 */
export interface CustomerFeedback {
    id: string;
    customerId: string;
    feedbackType: 'nps' | 'csat' | 'ces' | 'general' | 'complaint';
    channel: TouchpointChannel;
    score?: number;
    sentiment: Sentiment;
    feedbackText: string;
    category: string[];
    topics: string[];
    stage: JourneyStage;
    touchpointId?: string;
    actionTaken: string;
    status: 'new' | 'reviewed' | 'action_required' | 'resolved' | 'closed';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Satisfaction metric interface
 */
export interface SatisfactionMetric {
    id: string;
    metricType: 'nps' | 'csat' | 'ces';
    period: string;
    score: number;
    respondents: number;
    target: number;
    variance: number;
    trend: 'improving' | 'stable' | 'declining';
    segmentBreakdown: any[];
    metadata: Record<string, any>;
    calculatedAt: Date;
}
/**
 * Service design pattern interface
 */
export interface ServiceDesignPattern {
    id: string;
    patternName: string;
    patternType: string;
    description: string;
    applicableStages: JourneyStage[];
    useCases: string[];
    benefits: string[];
    implementation: string;
    examples: string[];
    relatedPatterns: string[];
    metadata: Record<string, any>;
}
/**
 * Experience analytics interface
 */
export interface ExperienceAnalytics {
    journeyId: string;
    analyticsPeriod: string;
    totalInteractions: number;
    uniqueCustomers: number;
    completionRate: number;
    averageDuration: number;
    satisfactionScore: number;
    effortScore: number;
    npsScore: number;
    conversionRate: number;
    dropoffPoints: DropoffPoint[];
    topPainPoints: PainPoint[];
    sentimentDistribution: Record<Sentiment, number>;
    channelPerformance: ChannelPerformance[];
    recommendations: string[];
}
/**
 * Dropoff point interface
 */
export interface DropoffPoint {
    stage: JourneyStage;
    touchpointId: string;
    dropoffRate: number;
    impactedCustomers: number;
    reasons: string[];
}
/**
 * Channel performance interface
 */
export interface ChannelPerformance {
    channel: TouchpointChannel;
    usage: number;
    satisfaction: number;
    effort: number;
    conversionRate: number;
    trend: string;
}
/**
 * Create customer persona DTO
 */
export declare class CreateCustomerPersonaDto {
    personaName: string;
    description: string;
    segmentSize: number;
    lifetimeValue: number;
    goals: string[];
    painPoints: string[];
    preferredChannels: TouchpointChannel[];
}
/**
 * Create customer journey DTO
 */
export declare class CreateCustomerJourneyDto {
    journeyName: string;
    personaId: string;
    description: string;
    satisfactionScore?: number;
}
/**
 * Create touchpoint DTO
 */
export declare class CreateTouchpointDto {
    journeyId: string;
    stage: JourneyStage;
    touchpointName: string;
    channel: TouchpointChannel;
    description: string;
    isKeyMoment?: boolean;
    importance?: number;
}
/**
 * Record pain point DTO
 */
export declare class RecordPainPointDto {
    journeyId?: string;
    touchpointId?: string;
    stage: JourneyStage;
    painPointName: string;
    description: string;
    severity: PainPointSeverity;
    frequency: number;
    rootCause: string;
}
/**
 * Submit NPS response DTO
 */
export declare class SubmitNPSResponseDto {
    surveyId: string;
    customerId: string;
    score: number;
    reason: string;
    segment?: string;
}
/**
 * Submit customer feedback DTO
 */
export declare class SubmitCustomerFeedbackDto {
    customerId: string;
    feedbackType: 'nps' | 'csat' | 'ces' | 'general' | 'complaint';
    channel: TouchpointChannel;
    score?: number;
    feedbackText: string;
    stage: JourneyStage;
}
/**
 * Analyze sentiment DTO
 */
export declare class AnalyzeSentimentDto {
    text: string;
    context?: string;
}
/**
 * Sequelize model for Customer Persona.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerPersona model
 *
 * @example
 * ```typescript
 * const CustomerPersona = createCustomerPersonaModel(sequelize);
 * const persona = await CustomerPersona.create({
 *   personaName: 'Tech-Savvy Professional',
 *   segmentSize: 50000,
 *   lifetimeValue: 25000
 * });
 * ```
 */
export declare const createCustomerPersonaModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        personaName: string;
        personaCode: string;
        description: string;
        demographics: any;
        psychographics: any;
        goals: string[];
        painPoints: string[];
        behaviors: string[];
        preferredChannels: string[];
        motivations: string[];
        frustrations: string[];
        technicalProficiency: string;
        segmentSize: number;
        lifetimeValue: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Customer Journey.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerJourney model
 *
 * @example
 * ```typescript
 * const CustomerJourney = createCustomerJourneyModel(sequelize);
 * const journey = await CustomerJourney.create({
 *   journeyName: 'B2B Onboarding Journey',
 *   personaId: 'persona-uuid',
 *   satisfactionScore: 75
 * });
 * ```
 */
export declare const createCustomerJourneyModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        journeyName: string;
        journeyCode: string;
        personaId: string;
        description: string;
        stages: any[];
        overallSentiment: string;
        satisfactionScore: number;
        effortScore: number;
        completionRate: number;
        averageDuration: number;
        painPoints: any[];
        opportunities: any[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Touchpoint.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Touchpoint model
 *
 * @example
 * ```typescript
 * const Touchpoint = createTouchpointModel(sequelize);
 * const touchpoint = await Touchpoint.create({
 *   journeyId: 'journey-uuid',
 *   touchpointName: 'Product Demo',
 *   channel: 'website',
 *   stage: 'consideration'
 * });
 * ```
 */
export declare const createTouchpointModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        journeyId: string;
        stage: string;
        touchpointName: string;
        channel: string;
        description: string;
        customerActions: string[];
        systemResponses: string[];
        satisfactionScore: number;
        effortScore: number;
        completionRate: number;
        averageDuration: number;
        interactionCount: number;
        sentiment: string;
        painPoints: string[];
        improvementOpportunities: string[];
        isKeyMoment: boolean;
        importance: number;
        performance: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Pain Point.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PainPoint model
 *
 * @example
 * ```typescript
 * const PainPoint = createPainPointModel(sequelize);
 * const painPoint = await PainPoint.create({
 *   painPointName: 'Slow checkout process',
 *   severity: 'high',
 *   frequency: 75
 * });
 * ```
 */
export declare const createPainPointModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        journeyId: string | null;
        touchpointId: string | null;
        stage: string;
        painPointName: string;
        description: string;
        severity: string;
        frequency: number;
        impactScore: number;
        affectedCustomers: number;
        rootCause: string;
        currentSolution: string | null;
        proposedSolution: string;
        estimatedEffort: number;
        estimatedImpact: number;
        priority: number;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Customer Feedback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerFeedback model
 *
 * @example
 * ```typescript
 * const CustomerFeedback = createCustomerFeedbackModel(sequelize);
 * const feedback = await CustomerFeedback.create({
 *   customerId: 'cust-uuid',
 *   feedbackType: 'nps',
 *   score: 9,
 *   feedbackText: 'Great experience!'
 * });
 * ```
 */
export declare const createCustomerFeedbackModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        feedbackType: string;
        channel: string;
        score: number | null;
        sentiment: string;
        feedbackText: string;
        category: string[];
        topics: string[];
        stage: string;
        touchpointId: string | null;
        actionTaken: string;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a customer persona with demographics and psychographics.
 *
 * @param {any} personaData - Persona data
 * @param {string} userId - User creating persona
 * @returns {Promise<CustomerPersona>} Created persona
 *
 * @example
 * ```typescript
 * const persona = await createCustomerPersona({
 *   personaName: 'Tech-Savvy Professional',
 *   description: 'Early adopter of technology',
 *   segmentSize: 50000,
 *   lifetimeValue: 25000,
 *   goals: ['Efficiency', 'Innovation'],
 *   painPoints: ['Complex interfaces', 'Slow response']
 * }, 'user-123');
 * ```
 */
export declare const createCustomerPersona: (personaData: any, userId: string) => Promise<CustomerPersona>;
/**
 * Analyzes persona value and prioritization.
 *
 * @param {string} personaId - Persona identifier
 * @returns {Promise<any>} Persona analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePersonaValue('persona-123');
 * ```
 */
export declare const analyzePersonaValue: (personaId: string) => Promise<any>;
/**
 * Updates persona based on behavioral data.
 *
 * @param {string} personaId - Persona identifier
 * @param {any} behaviorData - Behavioral insights
 * @returns {Promise<CustomerPersona>} Updated persona
 *
 * @example
 * ```typescript
 * const updated = await updatePersonaBehaviors('persona-123', {
 *   newBehaviors: ['Mobile-first usage', 'Self-service preference'],
 *   channelUsage: { mobile_app: 65, website: 35 }
 * });
 * ```
 */
export declare const updatePersonaBehaviors: (personaId: string, behaviorData: any) => Promise<CustomerPersona>;
/**
 * Segments customers into personas.
 *
 * @param {any[]} customerData - Customer data for segmentation
 * @returns {Promise<any>} Segmentation results
 *
 * @example
 * ```typescript
 * const segments = await segmentCustomersIntoPersonas(customerDataSet);
 * ```
 */
export declare const segmentCustomersIntoPersonas: (customerData: any[]) => Promise<any>;
/**
 * Creates a customer journey map.
 *
 * @param {any} journeyData - Journey data
 * @param {string} userId - User creating journey
 * @returns {Promise<CustomerJourney>} Created journey
 *
 * @example
 * ```typescript
 * const journey = await createCustomerJourney({
 *   journeyName: 'B2B Onboarding',
 *   personaId: 'persona-123',
 *   description: 'Enterprise customer onboarding journey',
 *   satisfactionScore: 75
 * }, 'user-456');
 * ```
 */
export declare const createCustomerJourney: (journeyData: any, userId: string) => Promise<CustomerJourney>;
/**
 * Adds a stage to customer journey.
 *
 * @param {string} journeyId - Journey identifier
 * @param {any} stageData - Stage data
 * @returns {Promise<JourneyStageDetail>} Created stage
 *
 * @example
 * ```typescript
 * const stage = await addJourneyStage('journey-123', {
 *   stage: 'awareness',
 *   stageName: 'Initial Discovery',
 *   description: 'Customer discovers our solution'
 * });
 * ```
 */
export declare const addJourneyStage: (journeyId: string, stageData: any) => Promise<JourneyStageDetail>;
/**
 * Creates a touchpoint in customer journey.
 *
 * @param {any} touchpointData - Touchpoint data
 * @param {string} userId - User creating touchpoint
 * @returns {Promise<Touchpoint>} Created touchpoint
 *
 * @example
 * ```typescript
 * const touchpoint = await createTouchpoint({
 *   journeyId: 'journey-123',
 *   stage: 'consideration',
 *   touchpointName: 'Product Demo',
 *   channel: 'website',
 *   isKeyMoment: true
 * }, 'user-456');
 * ```
 */
export declare const createTouchpoint: (touchpointData: any, userId: string) => Promise<Touchpoint>;
/**
 * Analyzes journey completion rates and drop-offs.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Completion analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeJourneyCompletion('journey-123');
 * ```
 */
export declare const analyzeJourneyCompletion: (journeyId: string) => Promise<any>;
/**
 * Maps emotion journey across touchpoints.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Emotion map
 *
 * @example
 * ```typescript
 * const emotions = await mapEmotionJourney('journey-123');
 * ```
 */
export declare const mapEmotionJourney: (journeyId: string) => Promise<any>;
/**
 * Identifies moments of truth in journey.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Moments of truth
 *
 * @example
 * ```typescript
 * const moments = await identifyMomentsOfTruth('journey-123');
 * ```
 */
export declare const identifyMomentsOfTruth: (journeyId: string) => Promise<any>;
/**
 * Calculates NPS score from survey responses.
 *
 * @param {any[]} responses - Survey responses
 * @returns {Promise<NPSSurvey>} NPS survey results
 *
 * @example
 * ```typescript
 * const nps = await calculateNPSScore([
 *   { score: 9 }, { score: 8 }, { score: 6 }, { score: 10 }
 * ]);
 * ```
 */
export declare const calculateNPSScore: (responses: any[]) => Promise<NPSSurvey>;
/**
 * Analyzes NPS trends over time.
 *
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any>} NPS trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeNPSTrends('org-123', 12);
 * ```
 */
export declare const analyzeNPSTrends: (organizationId: string, months: number) => Promise<any>;
/**
 * Segments NPS by customer attributes.
 *
 * @param {string} surveyId - Survey identifier
 * @returns {Promise<NPSSegment[]>} NPS segment breakdown
 *
 * @example
 * ```typescript
 * const segments = await segmentNPSResults('survey-123');
 * ```
 */
export declare const segmentNPSResults: (surveyId: string) => Promise<NPSSegment[]>;
/**
 * Analyzes detractor feedback for insights.
 *
 * @param {string} surveyId - Survey identifier
 * @returns {Promise<any>} Detractor analysis
 *
 * @example
 * ```typescript
 * const detractorInsights = await analyzeDetractorFeedback('survey-123');
 * ```
 */
export declare const analyzeDetractorFeedback: (surveyId: string) => Promise<any>;
/**
 * Measures customer satisfaction (CSAT) scores.
 *
 * @param {any[]} responses - CSAT responses
 * @returns {Promise<SatisfactionMetric>} CSAT metric
 *
 * @example
 * ```typescript
 * const csat = await measureCSAT([
 *   { score: 5 }, { score: 4 }, { score: 3 }
 * ]);
 * ```
 */
export declare const measureCSAT: (responses: any[]) => Promise<SatisfactionMetric>;
/**
 * Calculates Customer Effort Score (CES).
 *
 * @param {any[]} responses - CES responses
 * @returns {Promise<SatisfactionMetric>} CES metric
 *
 * @example
 * ```typescript
 * const ces = await calculateCustomerEffortScore([
 *   { effort: 2 }, { effort: 3 }, { effort: 1 }
 * ]);
 * ```
 */
export declare const calculateCustomerEffortScore: (responses: any[]) => Promise<SatisfactionMetric>;
/**
 * Records a customer pain point.
 *
 * @param {any} painPointData - Pain point data
 * @param {string} userId - User recording pain point
 * @returns {Promise<PainPoint>} Created pain point
 *
 * @example
 * ```typescript
 * const painPoint = await recordPainPoint({
 *   painPointName: 'Slow checkout process',
 *   stage: 'purchase',
 *   severity: 'high',
 *   frequency: 75,
 *   rootCause: 'Complex payment form'
 * }, 'user-123');
 * ```
 */
export declare const recordPainPoint: (painPointData: any, userId: string) => Promise<PainPoint>;
/**
 * Prioritizes pain points for resolution.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<PainPoint[]>} Prioritized pain points
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizePainPoints('journey-123');
 * ```
 */
export declare const prioritizePainPoints: (journeyId: string) => Promise<PainPoint[]>;
/**
 * Analyzes root causes of pain points.
 *
 * @param {string[]} painPointIds - Pain point identifiers
 * @returns {Promise<any>} Root cause analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeRootCauses(['pp-1', 'pp-2', 'pp-3']);
 * ```
 */
export declare const analyzeRootCauses: (painPointIds: string[]) => Promise<any>;
/**
 * Tracks pain point resolution progress.
 *
 * @param {string} painPointId - Pain point identifier
 * @param {any} resolutionData - Resolution data
 * @returns {Promise<PainPoint>} Updated pain point
 *
 * @example
 * ```typescript
 * const updated = await trackPainPointResolution('pp-123', {
 *   status: 'in_progress',
 *   currentSolution: 'Implementing new checkout flow',
 *   estimatedCompletion: new Date('2025-03-31')
 * });
 * ```
 */
export declare const trackPainPointResolution: (painPointId: string, resolutionData: any) => Promise<PainPoint>;
/**
 * Measures impact of pain point resolution.
 *
 * @param {string} painPointId - Pain point identifier
 * @returns {Promise<any>} Impact measurement
 *
 * @example
 * ```typescript
 * const impact = await measureResolutionImpact('pp-123');
 * ```
 */
export declare const measureResolutionImpact: (painPointId: string) => Promise<any>;
/**
 * Analyzes sentiment from customer feedback.
 *
 * @param {string} feedbackText - Feedback text
 * @returns {Promise<any>} Sentiment analysis
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeSentiment('The product is amazing but support is slow');
 * ```
 */
export declare const analyzeSentiment: (feedbackText: string) => Promise<any>;
/**
 * Submits customer feedback.
 *
 * @param {any} feedbackData - Feedback data
 * @param {string} userId - User submitting feedback
 * @returns {Promise<CustomerFeedback>} Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await submitCustomerFeedback({
 *   customerId: 'cust-123',
 *   feedbackType: 'csat',
 *   channel: 'email',
 *   score: 4,
 *   feedbackText: 'Good experience overall',
 *   stage: 'usage'
 * }, 'user-456');
 * ```
 */
export declare const submitCustomerFeedback: (feedbackData: any, userId: string) => Promise<CustomerFeedback>;
/**
 * Analyzes feedback themes and patterns.
 *
 * @param {string} journeyId - Journey identifier
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any>} Theme analysis
 *
 * @example
 * ```typescript
 * const themes = await analyzeFeedbackThemes(
 *   'journey-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
export declare const analyzeFeedbackThemes: (journeyId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Categorizes feedback automatically.
 *
 * @param {string} feedbackText - Feedback text
 * @returns {Promise<string[]>} Categories
 *
 * @example
 * ```typescript
 * const categories = await categorizeFeedback('The checkout was confusing');
 * // Returns: ['usability', 'purchase', 'ux']
 * ```
 */
export declare const categorizeFeedback: (feedbackText: string) => Promise<string[]>;
/**
 * Tracks feedback resolution and closure.
 *
 * @param {string} feedbackId - Feedback identifier
 * @param {any} resolutionData - Resolution data
 * @returns {Promise<CustomerFeedback>} Updated feedback
 *
 * @example
 * ```typescript
 * const resolved = await trackFeedbackResolution('fb-123', {
 *   actionTaken: 'Issue resolved, customer contacted',
 *   status: 'resolved'
 * });
 * ```
 */
export declare const trackFeedbackResolution: (feedbackId: string, resolutionData: any) => Promise<CustomerFeedback>;
/**
 * Analyzes touchpoint performance.
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @returns {Promise<any>} Performance analysis
 *
 * @example
 * ```typescript
 * const performance = await analyzeTouchpointPerformance('tp-123');
 * ```
 */
export declare const analyzeTouchpointPerformance: (touchpointId: string) => Promise<any>;
/**
 * Optimizes touchpoint sequence and flow.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimized = await optimizeTouchpointSequence('journey-123');
 * ```
 */
export declare const optimizeTouchpointSequence: (journeyId: string) => Promise<any>;
/**
 * Performs importance-performance analysis.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} IPA results
 *
 * @example
 * ```typescript
 * const ipa = await performImportancePerformanceAnalysis('journey-123');
 * ```
 */
export declare const performImportancePerformanceAnalysis: (journeyId: string) => Promise<any>;
/**
 * Benchmarks touchpoints against industry standards.
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @param {string} industry - Industry vertical
 * @returns {Promise<any>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkTouchpoint('tp-123', 'SaaS');
 * ```
 */
export declare const benchmarkTouchpoint: (touchpointId: string, industry: string) => Promise<any>;
/**
 * Tests touchpoint variations (A/B testing).
 *
 * @param {string} touchpointId - Touchpoint identifier
 * @param {any} variations - Variation definitions
 * @returns {Promise<any>} Test results
 *
 * @example
 * ```typescript
 * const test = await testTouchpointVariations('tp-123', {
 *   control: 'Current checkout flow',
 *   variant: 'Simplified 2-step checkout'
 * });
 * ```
 */
export declare const testTouchpointVariations: (touchpointId: string, variations: any) => Promise<any>;
/**
 * Generates comprehensive experience analytics.
 *
 * @param {string} journeyId - Journey identifier
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<ExperienceAnalytics>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateExperienceAnalytics(
 *   'journey-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
export declare const generateExperienceAnalytics: (journeyId: string, startDate: Date, endDate: Date) => Promise<ExperienceAnalytics>;
/**
 * Creates CX dashboard visualization data.
 *
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await createCXDashboard('org-123');
 * ```
 */
export declare const createCXDashboard: (organizationId: string) => Promise<any>;
/**
 * Generates executive CX summary report.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} period - Report period
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveCXSummary('org-123', 'Q1 2025');
 * ```
 */
export declare const generateExecutiveCXSummary: (organizationId: string, period: string) => Promise<any>;
/**
 * Analyzes omnichannel experience consistency.
 *
 * @param {string} journeyId - Journey identifier
 * @returns {Promise<any>} Omnichannel analysis
 *
 * @example
 * ```typescript
 * const omnichannel = await analyzeOmnichannelExperience('journey-123');
 * ```
 */
export declare const analyzeOmnichannelExperience: (journeyId: string) => Promise<any>;
/**
 * Exports CX data for external analysis.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} format - Export format
 * @returns {Promise<any>} Export result
 *
 * @example
 * ```typescript
 * const exported = await exportCXData('org-123', 'csv');
 * ```
 */
export declare const exportCXData: (organizationId: string, format: string) => Promise<any>;
//# sourceMappingURL=customer-experience-kit.d.ts.map