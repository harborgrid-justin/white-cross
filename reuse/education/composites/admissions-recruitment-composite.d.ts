/**
 * LOC: EDU-COMP-ADMIT-001
 * File: /reuse/education/composites/admissions-recruitment-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../admissions-management-kit
 *   - ../student-communication-kit
 *   - ../student-analytics-kit
 *   - ../compliance-reporting-kit
 *   - ../student-portal-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend admissions services
 *   - Recruitment management modules
 *   - Application processing controllers
 *   - CRM integration services
 */
import { Sequelize } from 'sequelize';
/**
 * Prospect stages in recruitment funnel
 */
export type ProspectStage = 'inquiry' | 'prospect' | 'applicant' | 'admit' | 'deposit' | 'enrolled' | 'denied' | 'withdrawn';
/**
 * Recruitment source channels
 */
export type RecruitmentSource = 'website' | 'fair' | 'referral' | 'email_campaign' | 'social_media' | 'agent' | 'high_school' | 'transfer_institution' | 'other';
/**
 * Communication campaign type
 */
export type CampaignType = 'nurture' | 'application_reminder' | 'decision_notification' | 'yield' | 'event_invitation' | 're_engagement';
/**
 * Prospect record
 */
export interface ProspectRecord {
    prospectId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    highSchool?: string;
    graduationYear?: number;
    intendedMajor?: string;
    currentStage: ProspectStage;
    source: RecruitmentSource;
    sourceDetail?: string;
    assignedCounselor?: string;
    territory?: string;
    interestLevel: 'low' | 'medium' | 'high' | 'very_high';
    engagementScore: number;
    createdDate: Date;
    lastContactDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Recruitment event
 */
export interface RecruitmentEvent {
    eventId: string;
    eventName: string;
    eventType: 'open_house' | 'campus_tour' | 'college_fair' | 'info_session' | 'virtual_event' | 'interview_day';
    eventDate: Date;
    eventTime: string;
    location: string;
    isVirtual: boolean;
    capacity: number;
    registered: number;
    attended: number;
    targetAudience: string[];
    staffAssigned: string[];
    registrationDeadline?: Date;
}
/**
 * Recruitment territory
 */
export interface RecruitmentTerritory {
    territoryId: string;
    territoryName: string;
    geographicRegions: string[];
    highSchools: string[];
    counselorId: string;
    prospectCount: number;
    applicantCount: number;
    admitCount: number;
    enrollmentGoal: number;
    currentEnrolled: number;
}
/**
 * Communication campaign
 */
export interface CommunicationCampaign {
    campaignId: string;
    campaignName: string;
    campaignType: CampaignType;
    targetAudience: {
        stages: ProspectStage[];
        filters?: Record<string, any>;
    };
    channels: ('email' | 'sms' | 'mail' | 'portal')[];
    schedule: {
        startDate: Date;
        endDate?: Date;
        frequency?: string;
    };
    templates: string[];
    metrics: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        converted: number;
    };
    isActive: boolean;
}
/**
 * Application reader assignment
 */
export interface ApplicationReaderAssignment {
    assignmentId: string;
    applicationId: string;
    readerId: string;
    readerRole: 'primary' | 'secondary' | 'committee';
    assignedDate: Date;
    reviewStatus: 'pending' | 'in_progress' | 'completed';
    reviewScore?: number;
    reviewNotes?: string;
    recommendation?: 'strong_accept' | 'accept' | 'waitlist' | 'deny';
    completedDate?: Date;
}
/**
 * Recruitment analytics
 */
export interface RecruitmentAnalytics {
    termId: string;
    funnelMetrics: {
        inquiries: number;
        prospects: number;
        applicants: number;
        admits: number;
        deposits: number;
        enrolled: number;
    };
    conversionRates: {
        inquiryToProspect: number;
        prospectToApplicant: number;
        applicantToAdmit: number;
        admitToDeposit: number;
        depositToEnrolled: number;
    };
    sourceEffectiveness: Record<RecruitmentSource, number>;
    territoryCoverage: Record<string, number>;
    pipelineHealth: 'strong' | 'moderate' | 'weak';
}
/**
 * Yield strategy action
 */
export interface YieldStrategyAction {
    actionId: string;
    actionType: 'personalized_outreach' | 'financial_review' | 'campus_visit' | 'admitted_student_event' | 'parent_engagement';
    targetSegment: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: Date;
    assignedTo?: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    expectedImpact: number;
}
/**
 * Sequelize model for Prospect tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Prospect:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         currentStage:
 *           type: string
 *           enum: [inquiry, prospect, applicant, admit, deposit, enrolled, denied, withdrawn]
 *         source:
 *           type: string
 *         engagementScore:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Prospect model
 */
export declare const createProspectModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        dateOfBirth: Date | null;
        highSchool: string | null;
        graduationYear: number | null;
        intendedMajor: string | null;
        currentStage: ProspectStage;
        source: RecruitmentSource;
        sourceDetail: string | null;
        assignedCounselor: string | null;
        territory: string | null;
        interestLevel: string;
        engagementScore: number;
        createdDate: Date;
        lastContactDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Recruitment Events.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RecruitmentEvent model
 */
export declare const createRecruitmentEventModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        eventName: string;
        eventType: string;
        eventDate: Date;
        eventTime: string;
        location: string;
        isVirtual: boolean;
        capacity: number;
        registered: number;
        attended: number;
        targetAudience: string[];
        staffAssigned: string[];
        registrationDeadline: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Admissions & Recruitment Composite Service
 *
 * Provides comprehensive recruitment funnel management and admissions processing.
 */
export declare class AdmissionsRecruitmentCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates new prospect record.
     *
     * @param {Partial<ProspectRecord>} prospectData - Prospect data
     * @returns {Promise<any>} Created prospect
     *
     * @example
     * ```typescript
     * const prospect = await service.createProspect({
     *   firstName: 'Jane',
     *   lastName: 'Doe',
     *   email: 'jane.doe@email.com',
     *   phone: '555-0123',
     *   highSchool: 'Lincoln High School',
     *   graduationYear: 2025,
     *   source: 'website',
     *   intendedMajor: 'Computer Science'
     * });
     * console.log(`Prospect created with ID: ${prospect.id}`);
     * ```
     */
    createProspect(prospectData: Partial<ProspectRecord>): Promise<any>;
    /**
     * 2. Updates prospect stage in recruitment funnel.
     *
     * @param {string} prospectId - Prospect ID
     * @param {ProspectStage} newStage - New stage
     * @returns {Promise<any>} Updated prospect
     *
     * @example
     * ```typescript
     * await service.updateProspectStage('PROS-2024-001', 'applicant');
     * ```
     */
    updateProspectStage(prospectId: string, newStage: ProspectStage): Promise<any>;
    /**
     * 3. Calculates prospect engagement score.
     *
     * @param {string} prospectId - Prospect ID
     * @returns {Promise<number>} Engagement score
     *
     * @example
     * ```typescript
     * const score = await service.calculateEngagementScore('PROS-2024-001');
     * console.log(`Engagement score: ${score}/100`);
     * ```
     */
    calculateEngagementScore(prospectId: string): Promise<number>;
    /**
     * 4. Assigns prospect to recruitment counselor.
     *
     * @param {string} prospectId - Prospect ID
     * @param {string} counselorId - Counselor ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.assignProspectToCounselor('PROS-2024-001', 'COUNS-123');
     * ```
     */
    assignProspectToCounselor(prospectId: string, counselorId: string): Promise<void>;
    /**
     * 5. Retrieves prospects by stage and filters.
     *
     * @param {ProspectStage} stage - Prospect stage
     * @param {any} filters - Additional filters
     * @returns {Promise<any[]>} Matching prospects
     *
     * @example
     * ```typescript
     * const prospects = await service.getProspectsByStage('inquiry', {
     *   territory: 'NORTHEAST',
     *   graduationYear: 2025
     * });
     * console.log(`Found ${prospects.length} prospects`);
     * ```
     */
    getProspectsByStage(stage: ProspectStage, filters?: any): Promise<any[]>;
    /**
     * 6. Tracks prospect interaction activity.
     *
     * @param {string} prospectId - Prospect ID
     * @param {string} activityType - Activity type
     * @param {any} activityData - Activity data
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackProspectActivity('PROS-2024-001', 'email_opened', {
     *   campaignId: 'CAMP-123',
     *   timestamp: new Date()
     * });
     * ```
     */
    trackProspectActivity(prospectId: string, activityType: string, activityData: any): Promise<void>;
    /**
     * 7. Identifies high-value prospects for priority outreach.
     *
     * @param {string} termId - Term ID
     * @param {number} threshold - Engagement score threshold
     * @returns {Promise<any[]>} High-value prospects
     *
     * @example
     * ```typescript
     * const highValue = await service.identifyHighValueProspects('FALL-2024', 75);
     * console.log(`${highValue.length} high-value prospects identified`);
     * ```
     */
    identifyHighValueProspects(termId: string, threshold?: number): Promise<any[]>;
    /**
     * 8. Generates prospect funnel conversion report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Funnel conversion metrics
     *
     * @example
     * ```typescript
     * const report = await service.generateProspectFunnelReport('FALL-2024');
     * console.log(`Inquiry to applicant conversion: ${report.conversionRates.inquiryToApplicant}%`);
     * ```
     */
    generateProspectFunnelReport(termId: string): Promise<any>;
    /**
     * 9. Schedules recruitment event.
     *
     * @param {RecruitmentEvent} eventData - Event data
     * @returns {Promise<any>} Created event
     *
     * @example
     * ```typescript
     * const event = await service.scheduleRecruitmentEvent({
     *   eventId: 'EVENT-2024-001',
     *   eventName: 'Fall Open House',
     *   eventType: 'open_house',
     *   eventDate: new Date('2024-10-15'),
     *   eventTime: '10:00 AM - 2:00 PM',
     *   location: 'Main Campus',
     *   isVirtual: false,
     *   capacity: 200,
     *   registered: 0,
     *   attended: 0,
     *   targetAudience: ['high_school_seniors'],
     *   staffAssigned: ['COUNS-123', 'COUNS-456']
     * });
     * ```
     */
    scheduleRecruitmentEvent(eventData: RecruitmentEvent): Promise<any>;
    /**
     * 10. Registers prospect for recruitment event.
     *
     * @param {string} prospectId - Prospect ID
     * @param {string} eventId - Event ID
     * @returns {Promise<any>} Registration confirmation
     *
     * @example
     * ```typescript
     * const registration = await service.registerProspectForEvent(
     *   'PROS-2024-001',
     *   'EVENT-2024-001'
     * );
     * ```
     */
    registerProspectForEvent(prospectId: string, eventId: string): Promise<any>;
    /**
     * 11. Tracks event attendance.
     *
     * @param {string} eventId - Event ID
     * @param {string[]} attendeeIds - Attendee prospect IDs
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackEventAttendance('EVENT-2024-001', [
     *   'PROS-2024-001',
     *   'PROS-2024-002',
     *   'PROS-2024-003'
     * ]);
     * ```
     */
    trackEventAttendance(eventId: string, attendeeIds: string[]): Promise<void>;
    /**
     * 12. Retrieves upcoming recruitment events.
     *
     * @param {number} daysAhead - Days to look ahead
     * @returns {Promise<any[]>} Upcoming events
     *
     * @example
     * ```typescript
     * const upcomingEvents = await service.getUpcomingEvents(30);
     * console.log(`${upcomingEvents.length} events in next 30 days`);
     * ```
     */
    getUpcomingEvents(daysAhead?: number): Promise<any[]>;
    /**
     * 13. Generates event ROI analysis.
     *
     * @param {string} eventId - Event ID
     * @returns {Promise<any>} ROI metrics
     *
     * @example
     * ```typescript
     * const roi = await service.calculateEventROI('EVENT-2024-001');
     * console.log(`Conversion rate: ${roi.conversionRate}%, Cost per enrollment: $${roi.costPerEnrollment}`);
     * ```
     */
    calculateEventROI(eventId: string): Promise<any>;
    /**
     * 14. Sends event reminders to registrants.
     *
     * @param {string} eventId - Event ID
     * @param {number} daysBefore - Days before event
     * @returns {Promise<number>} Number of reminders sent
     *
     * @example
     * ```typescript
     * const remindersSent = await service.sendEventReminders('EVENT-2024-001', 3);
     * console.log(`Sent ${remindersSent} event reminders`);
     * ```
     */
    sendEventReminders(eventId: string, daysBefore?: number): Promise<number>;
    /**
     * 15. Generates event effectiveness report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Event effectiveness metrics
     *
     * @example
     * ```typescript
     * const report = await service.generateEventEffectivenessReport('FALL-2024');
     * ```
     */
    generateEventEffectivenessReport(termId: string): Promise<any>;
    /**
     * 16. Creates communication campaign.
     *
     * @param {CommunicationCampaign} campaignData - Campaign data
     * @returns {Promise<any>} Created campaign
     *
     * @example
     * ```typescript
     * const campaign = await service.createCommunicationCampaign({
     *   campaignId: 'CAMP-2024-001',
     *   campaignName: 'Fall Application Nurture',
     *   campaignType: 'nurture',
     *   targetAudience: { stages: ['inquiry', 'prospect'] },
     *   channels: ['email', 'sms'],
     *   schedule: { startDate: new Date(), frequency: 'weekly' },
     *   templates: ['welcome_email', 'major_highlights', 'campus_life'],
     *   metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 },
     *   isActive: true
     * });
     * ```
     */
    createCommunicationCampaign(campaignData: CommunicationCampaign): Promise<any>;
    /**
     * 17. Executes campaign for target audience.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<{sent: number; queued: number}>} Execution results
     *
     * @example
     * ```typescript
     * const results = await service.executeCampaign('CAMP-2024-001');
     * console.log(`Sent: ${results.sent}, Queued: ${results.queued}`);
     * ```
     */
    executeCampaign(campaignId: string): Promise<{
        sent: number;
        queued: number;
    }>;
    /**
     * 18. Tracks campaign performance metrics.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} Performance metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackCampaignPerformance('CAMP-2024-001');
     * console.log(`Open rate: ${metrics.openRate}%, Click rate: ${metrics.clickRate}%`);
     * ```
     */
    trackCampaignPerformance(campaignId: string): Promise<any>;
    /**
     * 19. Segments prospects for targeted campaigns.
     *
     * @param {any} segmentCriteria - Segmentation criteria
     * @returns {Promise<any[]>} Segmented prospect lists
     *
     * @example
     * ```typescript
     * const segments = await service.segmentProspectsForCampaign({
     *   intendedMajor: 'Engineering',
     *   graduationYear: 2025,
     *   engagementScore: { min: 50 }
     * });
     * console.log(`${segments.length} prospects in segment`);
     * ```
     */
    segmentProspectsForCampaign(segmentCriteria: any): Promise<any[]>;
    /**
     * 20. Personalizes campaign message content.
     *
     * @param {string} templateId - Template ID
     * @param {string} prospectId - Prospect ID
     * @returns {Promise<string>} Personalized message
     *
     * @example
     * ```typescript
     * const message = await service.personalizeMessage('welcome_template', 'PROS-2024-001');
     * ```
     */
    personalizeMessage(templateId: string, prospectId: string): Promise<string>;
    /**
     * 21. Schedules drip campaign sequence.
     *
     * @param {string} campaignId - Campaign ID
     * @param {any[]} sequence - Drip sequence
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.scheduleDripCampaign('CAMP-2024-001', [
     *   { day: 0, template: 'welcome' },
     *   { day: 3, template: 'academics' },
     *   { day: 7, template: 'student_life' },
     *   { day: 14, template: 'application_reminder' }
     * ]);
     * ```
     */
    scheduleDripCampaign(campaignId: string, sequence: any[]): Promise<void>;
    /**
     * 22. Tests campaign A/B variants.
     *
     * @param {string} campaignId - Campaign ID
     * @param {any[]} variants - Campaign variants
     * @returns {Promise<any>} Test results
     *
     * @example
     * ```typescript
     * const results = await service.runCampaignABTest('CAMP-2024-001', [
     *   { name: 'Subject A', subject: 'Discover Your Future' },
     *   { name: 'Subject B', subject: 'Join Our Community' }
     * ]);
     * console.log(`Winner: ${results.winner}, Lift: ${results.lift}%`);
     * ```
     */
    runCampaignABTest(campaignId: string, variants: any[]): Promise<any>;
    /**
     * 23. Generates campaign ROI report.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} ROI analysis
     *
     * @example
     * ```typescript
     * const roi = await service.calculateCampaignROI('CAMP-2024-001');
     * console.log(`ROI: ${roi.returnOnInvestment}%, Cost per application: $${roi.costPerApplication}`);
     * ```
     */
    calculateCampaignROI(campaignId: string): Promise<any>;
    /**
     * 24. Creates recruitment territory.
     *
     * @param {RecruitmentTerritory} territoryData - Territory data
     * @returns {Promise<any>} Created territory
     *
     * @example
     * ```typescript
     * const territory = await service.createRecruitmentTerritory({
     *   territoryId: 'TERR-NORTHEAST',
     *   territoryName: 'Northeast Region',
     *   geographicRegions: ['MA', 'CT', 'RI', 'NH', 'VT', 'ME'],
     *   highSchools: ['Boston Latin', 'Phillips Exeter', 'Deerfield Academy'],
     *   counselorId: 'COUNS-123',
     *   prospectCount: 0,
     *   applicantCount: 0,
     *   admitCount: 0,
     *   enrollmentGoal: 150,
     *   currentEnrolled: 0
     * });
     * ```
     */
    createRecruitmentTerritory(territoryData: RecruitmentTerritory): Promise<any>;
    /**
     * 25. Assigns prospects to territory.
     *
     * @param {string} prospectId - Prospect ID
     * @param {string} territoryId - Territory ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.assignProspectToTerritory('PROS-2024-001', 'TERR-NORTHEAST');
     * ```
     */
    assignProspectToTerritory(prospectId: string, territoryId: string): Promise<void>;
    /**
     * 26. Auto-assigns territory based on geographic data.
     *
     * @param {string} prospectId - Prospect ID
     * @returns {Promise<string>} Assigned territory ID
     *
     * @example
     * ```typescript
     * const territoryId = await service.autoAssignTerritory('PROS-2024-001');
     * console.log(`Auto-assigned to territory: ${territoryId}`);
     * ```
     */
    autoAssignTerritory(prospectId: string): Promise<string>;
    /**
     * 27. Generates territory performance dashboard.
     *
     * @param {string} territoryId - Territory ID
     * @returns {Promise<any>} Territory metrics
     *
     * @example
     * ```typescript
     * const dashboard = await service.getTerritoryPerformance('TERR-NORTHEAST');
     * console.log(`Goal progress: ${dashboard.enrollmentProgress}%`);
     * ```
     */
    getTerritoryPerformance(territoryId: string): Promise<any>;
    /**
     * 28. Balances workload across territories.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Rebalancing recommendations
     *
     * @example
     * ```typescript
     * const recommendations = await service.balanceTerritoryWorkload('FALL-2024');
     * ```
     */
    balanceTerritoryWorkload(termId: string): Promise<any>;
    /**
     * 29. Generates territory coverage map.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Coverage analysis
     *
     * @example
     * ```typescript
     * const coverage = await service.generateTerritoryCoverageMap('FALL-2024');
     * ```
     */
    generateTerritoryCoverageMap(termId: string): Promise<any>;
    /**
     * 30. Assigns application to reader.
     *
     * @param {string} applicationId - Application ID
     * @param {string} readerId - Reader ID
     * @param {'primary' | 'secondary' | 'committee'} role - Reader role
     * @returns {Promise<any>} Assignment record
     *
     * @example
     * ```typescript
     * const assignment = await service.assignApplicationReader(
     *   'APP-2024-001',
     *   'READER-123',
     *   'primary'
     * );
     * ```
     */
    assignApplicationReader(applicationId: string, readerId: string, role: 'primary' | 'secondary' | 'committee'): Promise<any>;
    /**
     * 31. Tracks application review progress.
     *
     * @param {string} applicationId - Application ID
     * @returns {Promise<any>} Review progress
     *
     * @example
     * ```typescript
     * const progress = await service.trackApplicationReviewProgress('APP-2024-001');
     * console.log(`${progress.reviewsCompleted}/${progress.reviewsRequired} reviews completed`);
     * ```
     */
    trackApplicationReviewProgress(applicationId: string): Promise<any>;
    /**
     * 32. Submits application review and recommendation.
     *
     * @param {string} assignmentId - Assignment ID
     * @param {number} score - Review score
     * @param {string} recommendation - Recommendation
     * @param {string} notes - Review notes
     * @returns {Promise<any>} Submitted review
     *
     * @example
     * ```typescript
     * await service.submitApplicationReview('ASSIGN-123', 8, 'accept', 'Strong candidate');
     * ```
     */
    submitApplicationReview(assignmentId: string, score: number, recommendation: 'strong_accept' | 'accept' | 'waitlist' | 'deny', notes: string): Promise<any>;
    /**
     * 33. Routes application to committee review.
     *
     * @param {string} applicationId - Application ID
     * @param {string} reason - Routing reason
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.routeToCommitteeReview('APP-2024-001', 'Exceptional academic achievement');
     * ```
     */
    routeToCommitteeReview(applicationId: string, reason: string): Promise<void>;
    /**
     * 34. Generates application reader workload report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Workload distribution
     *
     * @example
     * ```typescript
     * const workload = await service.getReaderWorkloadReport('FALL-2024');
     * ```
     */
    getReaderWorkloadReport(termId: string): Promise<any>;
    /**
     * 35. Identifies applications ready for decision.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} Applications ready for decision
     *
     * @example
     * ```typescript
     * const ready = await service.getApplicationsReadyForDecision('FALL-2024');
     * console.log(`${ready.length} applications ready for decision`);
     * ```
     */
    getApplicationsReadyForDecision(termId: string): Promise<any[]>;
    /**
     * 36. Generates holistic review scorecard.
     *
     * @param {string} applicationId - Application ID
     * @returns {Promise<any>} Holistic scorecard
     *
     * @example
     * ```typescript
     * const scorecard = await service.generateHolisticReviewScorecard('APP-2024-001');
     * console.log(`Overall rating: ${scorecard.overallRating}/10`);
     * ```
     */
    generateHolisticReviewScorecard(applicationId: string): Promise<any>;
    /**
     * 37. Exports application review data for audit.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Audit export data
     *
     * @example
     * ```typescript
     * const auditData = await service.exportReviewAuditData('FALL-2024');
     * ```
     */
    exportReviewAuditData(termId: string): Promise<any>;
    /**
     * 38. Identifies at-risk admitted students.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} At-risk students
     *
     * @example
     * ```typescript
     * const atRisk = await service.identifyAtRiskAdmits('FALL-2024');
     * console.log(`${atRisk.length} admitted students at risk of not enrolling`);
     * ```
     */
    identifyAtRiskAdmits(termId: string): Promise<any[]>;
    /**
     * 39. Creates personalized yield intervention.
     *
     * @param {string} studentId - Student ID
     * @param {YieldStrategyAction} action - Intervention action
     * @returns {Promise<any>} Created intervention
     *
     * @example
     * ```typescript
     * const intervention = await service.createYieldIntervention('STU-2024-001', {
     *   actionId: 'YIELD-001',
     *   actionType: 'personalized_outreach',
     *   targetSegment: 'high_academic_achievers',
     *   priority: 'high',
     *   dueDate: new Date('2024-04-15'),
     *   assignedTo: 'COUNS-123',
     *   status: 'planned',
     *   expectedImpact: 15
     * });
     * ```
     */
    createYieldIntervention(studentId: string, action: YieldStrategyAction): Promise<any>;
    /**
     * 40. Tracks deposit deadline compliance.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Deposit tracking metrics
     *
     * @example
     * ```typescript
     * const deposits = await service.trackDepositDeadlines('FALL-2024');
     * console.log(`${deposits.depositRate}% of admits have deposited`);
     * ```
     */
    trackDepositDeadlines(termId: string): Promise<any>;
    /**
     * 41. Generates yield prediction model.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Yield predictions
     *
     * @example
     * ```typescript
     * const prediction = await service.predictEnrollmentYield('FALL-2024');
     * console.log(`Predicted yield: ${prediction.predictedYield}%`);
     * ```
     */
    predictEnrollmentYield(termId: string): Promise<any>;
    /**
     * 42. Orchestrates admitted student day.
     *
     * @param {string} eventId - Event ID
     * @returns {Promise<any>} Event coordination
     *
     * @example
     * ```typescript
     * const event = await service.orchestrateAdmittedStudentDay('ASD-2024-001');
     * ```
     */
    orchestrateAdmittedStudentDay(eventId: string): Promise<any>;
    /**
     * 43. Generates yield strategy dashboard.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Yield strategy metrics
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateYieldStrategyDashboard('FALL-2024');
     * ```
     */
    generateYieldStrategyDashboard(termId: string): Promise<any>;
    /**
     * 44. Generates comprehensive recruitment analytics.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<RecruitmentAnalytics>} Complete analytics
     *
     * @example
     * ```typescript
     * const analytics = await service.generateRecruitmentAnalytics('FALL-2024');
     * console.log(`Pipeline health: ${analytics.pipelineHealth}`);
     * ```
     */
    generateRecruitmentAnalytics(termId: string): Promise<RecruitmentAnalytics>;
    /**
     * 45. Tracks source attribution and ROI.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Source attribution report
     *
     * @example
     * ```typescript
     * const attribution = await service.trackSourceAttribution('FALL-2024');
     * console.log(`Best performing source: ${attribution.topSource}`);
     * ```
     */
    trackSourceAttribution(termId: string): Promise<any>;
    /**
     * 46. Exports enrollment funnel for CRM integration.
     *
     * @param {string} termId - Term ID
     * @param {string} format - Export format
     * @returns {Promise<any>} CRM export data
     *
     * @example
     * ```typescript
     * const crmData = await service.exportFunnelForCRM('FALL-2024', 'salesforce');
     * ```
     */
    exportFunnelForCRM(termId: string, format: string): Promise<any>;
    /**
     * 47. Generates executive recruitment dashboard.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Executive summary
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateExecutiveDashboard('FALL-2024');
     * ```
     */
    generateExecutiveDashboard(termId: string): Promise<any>;
    /**
     * Logs prospect activity.
     * @private
     */
    private logProspectActivity;
    /**
     * Gets prospect activities for engagement scoring.
     * @private
     */
    private getProspectActivities;
    /**
     * Calculates conversion rate percentage.
     * @private
     */
    private calculateConversion;
}
export default AdmissionsRecruitmentCompositeService;
//# sourceMappingURL=admissions-recruitment-composite.d.ts.map