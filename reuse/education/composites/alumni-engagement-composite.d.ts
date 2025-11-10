/**
 * LOC: EDU-COMP-ALUMNI-004
 * File: /reuse/education/composites/alumni-engagement-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../alumni-management-kit
 *   - ../student-communication-kit
 *   - ../student-portal-kit
 *
 * DOWNSTREAM (imported by):
 *   - Alumni relations controllers
 *   - Development services
 *   - Event management modules
 *   - Engagement tracking systems
 *   - Fundraising platforms
 */
import { Sequelize } from 'sequelize';
export type EngagementLevel = 'highly_engaged' | 'moderately_engaged' | 'minimally_engaged' | 'not_engaged';
export type EventType = 'reunion' | 'networking' | 'professional_development' | 'fundraising' | 'social' | 'virtual';
export type DonationPurpose = 'general' | 'scholarship' | 'athletics' | 'research' | 'capital_campaign' | 'endowment';
export interface AlumniProfile {
    alumniId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    graduationYear: number;
    degreeProgram: string;
    currentEmployer?: string;
    currentPosition?: string;
    industry?: string;
    engagementLevel: EngagementLevel;
    mentorshipAvailable: boolean;
    profileVisibility: 'public' | 'alumni_only' | 'private';
    lastContactDate?: Date;
}
export interface AlumniEvent {
    eventId: string;
    eventName: string;
    eventType: EventType;
    eventDate: Date;
    location?: string;
    virtualUrl?: string;
    maxAttendees?: number;
    registrationDeadline: Date;
    registrationFee: number;
    attendeeCount: number;
    rsvpList: string[];
}
export interface AlumniDonation {
    donationId: string;
    alumniId: string;
    amount: number;
    donationDate: Date;
    purpose: DonationPurpose;
    campaignId?: string;
    isRecurring: boolean;
    taxDeductible: boolean;
    acknowledgementSent: boolean;
}
export interface EngagementMetrics {
    alumniId: string;
    engagementScore: number;
    eventAttendance: number;
    donationHistory: number;
    mentorshipParticipation: boolean;
    networkingActivity: number;
    communicationResponsiveness: number;
    lastEngagement: Date;
}
export interface MentorshipMatch {
    matchId: string;
    mentorId: string;
    menteeId: string;
    matchScore: number;
    matchDate: Date;
    status: 'pending' | 'active' | 'completed' | 'inactive';
    areas: string[];
}
export interface CareerOutcome {
    alumniId: string;
    graduationYear: number;
    employmentStatus: 'employed' | 'self_employed' | 'seeking' | 'further_education';
    employer?: string;
    position?: string;
    salary?: number;
    relevantToDegree: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     AlumniProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         alumniId:
 *           type: string
 *         graduationYear:
 *           type: integer
 *         engagementLevel:
 *           type: string
 *           enum: [highly_engaged, moderately_engaged, minimally_engaged, not_engaged]
 */
export declare const createAlumniProfileModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        alumniId: string;
        studentId: string;
        profileData: Record<string, any>;
        engagementLevel: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createAlumniEventModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        eventName: string;
        eventType: string;
        eventDate: Date;
        eventData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createAlumniDonationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        alumniId: string;
        amount: number;
        donationDate: Date;
        purpose: string;
        donationData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare class AlumniEngagementCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates comprehensive alumni profile.
     * @example
     * ```typescript
     * const profile = await service.createAlumniProfile({
     *   studentId: 'STU123', firstName: 'John', lastName: 'Doe',
     *   email: 'john.doe@example.com', graduationYear: 2020
     * });
     * ```
     */
    createAlumniProfile(profileData: Partial<AlumniProfile>): Promise<AlumniProfile>;
    /**
     * 2. Updates alumni profile information.
     * @example
     * ```typescript
     * await service.updateAlumniProfile('ALU123', { currentEmployer: 'Tech Corp' });
     * ```
     */
    updateAlumniProfile(alumniId: string, updates: Partial<AlumniProfile>): Promise<AlumniProfile>;
    /**
     * 3. Searches alumni directory with filters.
     * @example
     * ```typescript
     * const results = await service.searchAlumniDirectory({ graduationYear: 2020, industry: 'Technology' });
     * ```
     */
    searchAlumniDirectory(filters: any): Promise<AlumniProfile[]>;
    /**
     * 4. Validates alumni directory privacy settings.
     * @example
     * ```typescript
     * const valid = await service.validateDirectoryPrivacy('ALU123');
     * ```
     */
    validateDirectoryPrivacy(alumniId: string): Promise<boolean>;
    /**
     * 5. Manages alumni contact preferences.
     * @example
     * ```typescript
     * await service.manageContactPreferences('ALU123', { emailUpdates: true, phoneUpdates: false });
     * ```
     */
    manageContactPreferences(alumniId: string, preferences: any): Promise<any>;
    /**
     * 6. Tracks alumni career progression.
     * @example
     * ```typescript
     * const career = await service.trackCareerProgression('ALU123');
     * ```
     */
    trackCareerProgression(alumniId: string): Promise<CareerOutcome[]>;
    /**
     * 7. Generates alumni profile completeness score.
     * @example
     * ```typescript
     * const score = await service.calculateProfileCompleteness('ALU123');
     * console.log(`Profile ${score.percentage}% complete`);
     * ```
     */
    calculateProfileCompleteness(alumniId: string): Promise<{
        percentage: number;
        missing: string[];
    }>;
    /**
     * 8. Tracks alumni engagement activities.
     * @example
     * ```typescript
     * await service.trackEngagementActivity('ALU123', 'event_attendance', { eventId: 'EVT123' });
     * ```
     */
    trackEngagementActivity(alumniId: string, activityType: string, details: any): Promise<any>;
    /**
     * 9. Calculates alumni engagement score.
     * @example
     * ```typescript
     * const metrics = await service.calculateEngagementScore('ALU123');
     * console.log(`Engagement score: ${metrics.engagementScore}`);
     * ```
     */
    calculateEngagementScore(alumniId: string): Promise<EngagementMetrics>;
    /**
     * 10. Segments alumni by engagement level.
     * @example
     * ```typescript
     * const segments = await service.segmentAlumniByEngagement();
     * ```
     */
    segmentAlumniByEngagement(): Promise<Record<EngagementLevel, number>>;
    /**
     * 11. Identifies disengaged alumni for re-engagement.
     * @example
     * ```typescript
     * const disengaged = await service.identifyDisengagedAlumni();
     * ```
     */
    identifyDisengagedAlumni(): Promise<string[]>;
    /**
     * 12. Creates re-engagement campaigns.
     * @example
     * ```typescript
     * const campaign = await service.createReengagementCampaign(disengagedAlumniIds);
     * ```
     */
    createReengagementCampaign(alumniIds: string[]): Promise<any>;
    /**
     * 13. Monitors engagement trends over time.
     * @example
     * ```typescript
     * const trends = await service.monitorEngagementTrends('2024');
     * ```
     */
    monitorEngagementTrends(year: string): Promise<any>;
    /**
     * 14. Creates alumni event with registration.
     * @example
     * ```typescript
     * const event = await service.createAlumniEvent({
     *   eventName: 'Class of 2020 Reunion', eventType: 'reunion',
     *   eventDate: new Date('2025-06-15'), maxAttendees: 200
     * });
     * ```
     */
    createAlumniEvent(eventData: Partial<AlumniEvent>): Promise<AlumniEvent>;
    /**
     * 15. Manages event RSVP and attendance tracking.
     * @example
     * ```typescript
     * await service.manageEventRSVP('EVT123', 'ALU456', 'attending');
     * ```
     */
    manageEventRSVP(eventId: string, alumniId: string, response: string): Promise<any>;
    /**
     * 16. Sends event invitations and reminders.
     * @example
     * ```typescript
     * await service.sendEventInvitations('EVT123', alumniIds);
     * ```
     */
    sendEventInvitations(eventId: string, alumniIds: string[]): Promise<any>;
    /**
     * 17. Tracks event attendance and feedback.
     * @example
     * ```typescript
     * const attendance = await service.trackEventAttendance('EVT123');
     * ```
     */
    trackEventAttendance(eventId: string): Promise<any>;
    /**
     * 18. Generates event analytics and reports.
     * @example
     * ```typescript
     * const analytics = await service.generateEventAnalytics('2024');
     * ```
     */
    generateEventAnalytics(year: string): Promise<any>;
    /**
     * 19. Coordinates virtual event platforms.
     * @example
     * ```typescript
     * const virtual = await service.setupVirtualEvent('EVT123', 'Zoom');
     * ```
     */
    setupVirtualEvent(eventId: string, platform: string): Promise<any>;
    /**
     * 20. Processes alumni donation transactions.
     * @example
     * ```typescript
     * const donation = await service.processAlumniDonation({
     *   alumniId: 'ALU123', amount: 500, purpose: 'scholarship'
     * });
     * ```
     */
    processAlumniDonation(donationData: Partial<AlumniDonation>): Promise<AlumniDonation>;
    /**
     * 21. Tracks donor history and patterns.
     * @example
     * ```typescript
     * const history = await service.trackDonorHistory('ALU123');
     * ```
     */
    trackDonorHistory(alumniId: string): Promise<AlumniDonation[]>;
    /**
     * 22. Creates fundraising campaigns.
     * @example
     * ```typescript
     * const campaign = await service.createFundraisingCampaign({
     *   name: 'Scholarship Fund 2025', goal: 100000
     * });
     * ```
     */
    createFundraisingCampaign(campaignData: any): Promise<any>;
    /**
     * 23. Sends donation acknowledgements and receipts.
     * @example
     * ```typescript
     * await service.sendDonationAcknowledgement('DON123');
     * ```
     */
    sendDonationAcknowledgement(donationId: string): Promise<any>;
    /**
     * 24. Manages recurring donation schedules.
     * @example
     * ```typescript
     * await service.setupRecurringDonation('ALU123', { amount: 100, frequency: 'monthly' });
     * ```
     */
    setupRecurringDonation(alumniId: string, schedule: any): Promise<any>;
    /**
     * 25. Generates donor impact reports.
     * @example
     * ```typescript
     * const impact = await service.generateDonorImpactReport('ALU123');
     * ```
     */
    generateDonorImpactReport(alumniId: string): Promise<any>;
    /**
     * 26. Matches alumni mentors with students.
     * @example
     * ```typescript
     * const match = await service.matchAlumniMentors('STU123', ['career', 'industry']);
     * ```
     */
    matchAlumniMentors(studentId: string, interests: string[]): Promise<MentorshipMatch[]>;
    /**
     * 27. Manages mentorship program enrollment.
     * @example
     * ```typescript
     * await service.enrollInMentorshipProgram('ALU123', { availability: 'evenings' });
     * ```
     */
    enrollInMentorshipProgram(alumniId: string, preferences: any): Promise<any>;
    /**
     * 28. Tracks mentorship relationships and outcomes.
     * @example
     * ```typescript
     * const outcomes = await service.trackMentorshipOutcomes('MATCH123');
     * ```
     */
    trackMentorshipOutcomes(matchId: string): Promise<any>;
    /**
     * 29. Facilitates alumni networking connections.
     * @example
     * ```typescript
     * const connections = await service.facilitateNetworkingConnections('ALU123', ['industry', 'location']);
     * ```
     */
    facilitateNetworkingConnections(alumniId: string, criteria: string[]): Promise<string[]>;
    /**
     * 30. Creates networking groups and communities.
     * @example
     * ```typescript
     * const group = await service.createNetworkingGroup({ name: 'Tech Alumni Network', focus: 'Technology' });
     * ```
     */
    createNetworkingGroup(groupData: any): Promise<any>;
    /**
     * 31. Tracks networking activity and connections.
     * @example
     * ```typescript
     * const activity = await service.trackNetworkingActivity('ALU123');
     * ```
     */
    trackNetworkingActivity(alumniId: string): Promise<any>;
    /**
     * 32. Sends targeted alumni communications.
     * @example
     * ```typescript
     * await service.sendAlumniCommunications(alumniIds, { subject: 'Update', content: 'News' });
     * ```
     */
    sendAlumniCommunications(alumniIds: string[], message: any): Promise<any>;
    /**
     * 33. Creates alumni newsletter campaigns.
     * @example
     * ```typescript
     * const newsletter = await service.createAlumniNewsletter({ title: 'Q4 2024 Update' });
     * ```
     */
    createAlumniNewsletter(newsletterData: any): Promise<any>;
    /**
     * 34. Tracks communication engagement metrics.
     * @example
     * ```typescript
     * const metrics = await service.trackCommunicationEngagement('CAMP123');
     * ```
     */
    trackCommunicationEngagement(campaignId: string): Promise<any>;
    /**
     * 35. Generates alumni relations reports.
     * @example
     * ```typescript
     * const report = await service.generateAlumniRelationsReport('2024');
     * ```
     */
    generateAlumniRelationsReport(year: string): Promise<any>;
    /**
     * 36. Analyzes alumni career outcomes by program.
     * @example
     * ```typescript
     * const outcomes = await service.analyzeCareerOutcomesByProgram('CS-BS');
     * ```
     */
    analyzeCareerOutcomesByProgram(programId: string): Promise<any>;
    /**
     * 37. Creates comprehensive alumni engagement report.
     * @example
     * ```typescript
     * const report = await service.generateComprehensiveEngagementReport('2024');
     * console.log('Comprehensive alumni engagement report generated');
     * ```
     */
    generateComprehensiveEngagementReport(year: string): Promise<any>;
}
export default AlumniEngagementCompositeService;
//# sourceMappingURL=alumni-engagement-composite.d.ts.map