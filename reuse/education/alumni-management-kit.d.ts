/**
 * LOC: EDU-ALUMNI-001
 * File: /reuse/education/alumni-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend alumni services
 *   - Alumni portal modules
 *   - Engagement tracking systems
 *   - Development/fundraising services
 */
/**
 * File: /reuse/education/alumni-management-kit.ts
 * Locator: WC-EDU-ALUMNI-001
 * Purpose: Enterprise-grade Alumni Management - profiles, engagement, events, giving, career tracking, networking, accessibility
 *
 * Upstream: Independent utility module for alumni operations
 * Downstream: ../backend/education/*, alumni controllers, engagement services, donation managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for alumni operations for modern SIS platforms
 *
 * LLM Context: Comprehensive alumni management utilities for production-ready education applications.
 * Provides alumni profile management, engagement tracking, event coordination, donation processing,
 * career outcomes tracking, networking features, communications, directory services, and full
 * WCAG 2.1 AA accessibility compliance with screen reader optimization.
 */
import { Sequelize, Transaction } from 'sequelize';
interface AlumniData {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    graduationYear: number;
    degreeProgram: string;
    degreeName: string;
    currentEmployer?: string;
    currentPosition?: string;
    industry?: string;
    linkedInProfile?: string;
    mailingAddress?: Record<string, any>;
    phoneNumber?: string;
    preferredContact?: 'email' | 'phone' | 'mail';
    isActive?: boolean;
    privacySettings?: Record<string, any>;
}
interface AlumniProfileData {
    alumniId: string;
    bio?: string;
    professionalSummary?: string;
    achievements?: string[];
    skills?: string[];
    interests?: string[];
    volunteerOpportunities?: string[];
    mentorshipAvailable?: boolean;
    careerStage?: 'early' | 'mid' | 'senior' | 'executive' | 'retired';
    willingToHire?: boolean;
    profileVisibility?: 'public' | 'alumni_only' | 'private';
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
}
interface AlumniEngagementData {
    alumniId: string;
    engagementType: 'event_attendance' | 'donation' | 'mentorship' | 'volunteering' | 'networking' | 'survey_response' | 'website_visit';
    engagementDate: Date;
    engagementDetails?: Record<string, any>;
    engagementScore?: number;
    eventId?: string;
    donationId?: string;
    description?: string;
    duration?: number;
}
interface AlumniDonationData {
    alumniId: string;
    donationAmount: number;
    donationDate: Date;
    donationPurpose: 'general' | 'scholarship' | 'athletics' | 'research' | 'capital_campaign' | 'endowment' | 'specific_program';
    fundName?: string;
    campaignId?: string;
    paymentMethod: 'credit_card' | 'check' | 'wire_transfer' | 'stock' | 'cryptocurrency';
    isRecurring?: boolean;
    recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
    taxDeductible?: boolean;
    acknowledgementSent?: boolean;
    anonymousDonor?: boolean;
    matchingGiftEligible?: boolean;
}
interface AlumniEventData {
    eventName: string;
    eventType: 'reunion' | 'networking' | 'professional_development' | 'social' | 'fundraising' | 'homecoming' | 'virtual' | 'regional';
    eventDate: Date;
    eventEndDate?: Date;
    location?: string;
    virtualEventUrl?: string;
    description?: string;
    maxAttendees?: number;
    registrationDeadline?: Date;
    registrationFee?: number;
    targetAudience?: string[];
    organizerId: string;
    isPublished?: boolean;
    requiresRSVP?: boolean;
    accessibilityFeatures?: string[];
}
interface AlumniCommunicationData {
    alumniId: string;
    communicationType: 'email' | 'newsletter' | 'sms' | 'mail' | 'phone_call' | 'survey';
    subject: string;
    content: string;
    sentDate: Date;
    sentBy: string;
    deliveryStatus?: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
    campaignId?: string;
    trackingEnabled?: boolean;
}
interface CareerOutcomeData {
    alumniId: string;
    employmentStatus: 'employed' | 'self_employed' | 'seeking' | 'further_education' | 'not_seeking';
    employer?: string;
    position?: string;
    industry?: string;
    salary?: number;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
    employmentType?: 'full_time' | 'part_time' | 'contract' | 'internship';
    relevantToDegree?: boolean;
}
interface AlumniDirectoryFilterData {
    graduationYear?: number;
    degreeProgram?: string;
    industry?: string;
    location?: string;
    employer?: string;
    searchTerm?: string;
    availableForMentorship?: boolean;
    willingToHire?: boolean;
}
interface AlumniNetworkConnectionData {
    alumniId: string;
    connectedAlumniId: string;
    connectionType: 'classmate' | 'colleague' | 'mentor_mentee' | 'professional' | 'friend';
    connectedDate: Date;
    connectionStrength?: 'weak' | 'moderate' | 'strong';
    sharedInterests?: string[];
}
/**
 * Sequelize model for Alumni with graduation and contact information.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Alumni:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         graduationYear:
 *           type: number
 *         degreeProgram:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Alumni model
 *
 * @example
 * ```typescript
 * const Alumni = createAlumniModel(sequelize);
 * const alumnus = await Alumni.create({
 *   studentId: 'STU12345',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@alumni.edu',
 *   graduationYear: 2020,
 *   degreeProgram: 'Computer Science',
 *   degreeName: 'Bachelor of Science'
 * });
 * ```
 */
export declare const createAlumniModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        firstName: string;
        lastName: string;
        email: string;
        graduationYear: number;
        degreeProgram: string;
        degreeName: string;
        currentEmployer: string;
        currentPosition: string;
        industry: string;
        linkedInProfile: string;
        mailingAddress: Record<string, any>;
        phoneNumber: string;
        preferredContact: string;
        isActive: boolean;
        privacySettings: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Alumni Profiles with professional information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AlumniProfile model
 */
export declare const createAlumniProfileModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        alumniId: string;
        bio: string;
        professionalSummary: string;
        achievements: string[];
        skills: string[];
        interests: string[];
        volunteerOpportunities: string[];
        mentorshipAvailable: boolean;
        careerStage: string;
        willingToHire: boolean;
        profileVisibility: string;
        profilePhotoUrl: string;
        coverPhotoUrl: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Alumni Engagement tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AlumniEngagement model
 */
export declare const createAlumniEngagementModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        alumniId: string;
        engagementType: string;
        engagementDate: Date;
        engagementDetails: Record<string, any>;
        engagementScore: number;
        eventId: string;
        donationId: string;
        description: string;
        duration: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Alumni Donations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AlumniDonation model
 */
export declare const createAlumniDonationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        alumniId: string;
        donationAmount: number;
        donationDate: Date;
        donationPurpose: string;
        fundName: string;
        campaignId: string;
        paymentMethod: string;
        isRecurring: boolean;
        recurringFrequency: string;
        taxDeductible: boolean;
        acknowledgementSent: boolean;
        anonymousDonor: boolean;
        matchingGiftEligible: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Alumni Events.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AlumniEvent model
 */
export declare const createAlumniEventModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        eventName: string;
        eventType: string;
        eventDate: Date;
        eventEndDate: Date | null;
        location: string;
        virtualEventUrl: string;
        description: string;
        maxAttendees: number;
        currentAttendees: number;
        registrationDeadline: Date;
        registrationFee: number;
        targetAudience: string[];
        organizerId: string;
        isPublished: boolean;
        requiresRSVP: boolean;
        accessibilityFeatures: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new alumni record from graduated student.
 *
 * @param {AlumniData} alumniData - Alumni data
 * @param {Model} Alumni - Alumni model
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created alumni record
 *
 * @example
 * ```typescript
 * const alumnus = await createAlumniRecord({
 *   studentId: 'STU12345',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@alumni.edu',
 *   graduationYear: 2020,
 *   degreeProgram: 'Computer Science',
 *   degreeName: 'Bachelor of Science'
 * }, Alumni);
 * ```
 */
export declare const createAlumniRecord: (alumniData: AlumniData, Alumni: any, transaction?: Transaction) => Promise<any>;
/**
 * Updates alumni contact and employment information.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Partial<AlumniData>} updates - Update data
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Updated alumni record
 *
 * @example
 * ```typescript
 * await updateAlumniInformation('alum123', {
 *   currentEmployer: 'TechCorp',
 *   currentPosition: 'Senior Developer',
 *   industry: 'Technology'
 * }, Alumni);
 * ```
 */
export declare const updateAlumniInformation: (alumniId: string, updates: Partial<AlumniData>, Alumni: any) => Promise<any>;
/**
 * Retrieves alumni record with full details.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Alumni record
 *
 * @example
 * ```typescript
 * const alumnus = await getAlumniRecord('alum123', Alumni);
 * ```
 */
export declare const getAlumniRecord: (alumniId: string, Alumni: any) => Promise<any>;
/**
 * Searches alumni by student ID or email.
 *
 * @param {string} identifier - Student ID or email
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Alumni record
 *
 * @example
 * ```typescript
 * const alumnus = await findAlumniByIdentifier('jane.smith@alumni.edu', Alumni);
 * ```
 */
export declare const findAlumniByIdentifier: (identifier: string, Alumni: any) => Promise<any>;
/**
 * Creates or updates alumni profile with professional information.
 *
 * @param {AlumniProfileData} profileData - Profile data
 * @param {Model} AlumniProfile - AlumniProfile model
 * @returns {Promise<any>} Alumni profile
 *
 * @example
 * ```typescript
 * const profile = await createAlumniProfile({
 *   alumniId: 'alum123',
 *   bio: 'Software engineer with 10 years experience...',
 *   mentorshipAvailable: true,
 *   willingToHire: true
 * }, AlumniProfile);
 * ```
 */
export declare const createAlumniProfile: (profileData: AlumniProfileData, AlumniProfile: any) => Promise<any>;
/**
 * Updates alumni profile visibility and privacy settings.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {string} visibility - Visibility setting
 * @param {Model} AlumniProfile - AlumniProfile model
 * @returns {Promise<any>} Updated profile
 *
 * @example
 * ```typescript
 * await updateProfileVisibility('alum123', 'public', AlumniProfile);
 * ```
 */
export declare const updateProfileVisibility: (alumniId: string, visibility: "public" | "alumni_only" | "private", AlumniProfile: any) => Promise<any>;
/**
 * Retrieves alumni profile with professional details.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} AlumniProfile - AlumniProfile model
 * @returns {Promise<any>} Alumni profile
 *
 * @example
 * ```typescript
 * const profile = await getAlumniProfile('alum123', AlumniProfile);
 * ```
 */
export declare const getAlumniProfile: (alumniId: string, AlumniProfile: any) => Promise<any>;
/**
 * Updates alumni privacy settings and preferences.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Record<string, any>} privacySettings - Privacy settings
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Updated alumni record
 *
 * @example
 * ```typescript
 * await updateAlumniPrivacySettings('alum123', {
 *   showInDirectory: true,
 *   showEmail: false,
 *   showPhone: false
 * }, Alumni);
 * ```
 */
export declare const updateAlumniPrivacySettings: (alumniId: string, privacySettings: Record<string, any>, Alumni: any) => Promise<any>;
/**
 * Validates alumni access permissions for resources.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {string} resourceType - Resource type
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<boolean>} Access granted
 *
 * @example
 * ```typescript
 * const canAccess = await validateAlumniAccess('alum123', 'career_services', Alumni);
 * ```
 */
export declare const validateAlumniAccess: (alumniId: string, resourceType: string, Alumni: any) => Promise<boolean>;
/**
 * Searches alumni directory with filters and pagination.
 *
 * @param {AlumniDirectoryFilterData} filters - Search filters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Model} Alumni - Alumni model
 * @param {Model} AlumniProfile - AlumniProfile model
 * @returns {Promise<{ alumni: any[]; total: number; page: number; totalPages: number }>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchAlumniDirectory({
 *   graduationYear: 2020,
 *   industry: 'Technology',
 *   availableForMentorship: true
 * }, 1, 25, Alumni, AlumniProfile);
 * ```
 */
export declare const searchAlumniDirectory: (filters: AlumniDirectoryFilterData, page: number | undefined, limit: number | undefined, Alumni: any, AlumniProfile: any) => Promise<{
    alumni: any[];
    total: number;
    page: number;
    totalPages: number;
}>;
/**
 * Retrieves alumni by graduation year cohort.
 *
 * @param {number} graduationYear - Graduation year
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Alumni cohort
 *
 * @example
 * ```typescript
 * const classOf2020 = await getAlumniByGraduationYear(2020, Alumni);
 * ```
 */
export declare const getAlumniByGraduationYear: (graduationYear: number, Alumni: any) => Promise<any[]>;
/**
 * Filters alumni by industry sector.
 *
 * @param {string} industry - Industry name
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Alumni in industry
 *
 * @example
 * ```typescript
 * const techAlumni = await filterAlumniByIndustry('Technology', Alumni);
 * ```
 */
export declare const filterAlumniByIndustry: (industry: string, Alumni: any) => Promise<any[]>;
/**
 * Retrieves alumni available for mentorship.
 *
 * @param {string[]} focusAreas - Desired focus areas
 * @param {Model} AlumniProfile - AlumniProfile model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Available mentors
 *
 * @example
 * ```typescript
 * const mentors = await getAlumniMentors(['career_development', 'technical_skills'], AlumniProfile, Alumni);
 * ```
 */
export declare const getAlumniMentors: (focusAreas: string[], AlumniProfile: any, Alumni: any) => Promise<any[]>;
/**
 * Retrieves alumni willing to hire graduates.
 *
 * @param {string} industry - Industry filter (optional)
 * @param {Model} AlumniProfile - AlumniProfile model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Alumni willing to hire
 *
 * @example
 * ```typescript
 * const recruiters = await getAlumniRecruiters('Technology', AlumniProfile, Alumni);
 * ```
 */
export declare const getAlumniRecruiters: (industry: string | null, AlumniProfile: any, Alumni: any) => Promise<any[]>;
/**
 * Records alumni engagement activity.
 *
 * @param {AlumniEngagementData} engagementData - Engagement data
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Created engagement record
 *
 * @example
 * ```typescript
 * const engagement = await recordAlumniEngagement({
 *   alumniId: 'alum123',
 *   engagementType: 'event_attendance',
 *   engagementDate: new Date(),
 *   engagementScore: 75,
 *   eventId: 'event456'
 * }, AlumniEngagement);
 * ```
 */
export declare const recordAlumniEngagement: (engagementData: AlumniEngagementData, AlumniEngagement: any) => Promise<any>;
/**
 * Calculates alumni engagement score based on activities.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Date} startDate - Start date for calculation
 * @param {Date} endDate - End date for calculation
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<number>} Engagement score
 *
 * @example
 * ```typescript
 * const score = await calculateEngagementScore('alum123', new Date('2024-01-01'), new Date('2024-12-31'), AlumniEngagement);
 * ```
 */
export declare const calculateEngagementScore: (alumniId: string, startDate: Date, endDate: Date, AlumniEngagement: any) => Promise<number>;
/**
 * Retrieves alumni engagement history.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {number} limit - Maximum records to return
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any[]>} Engagement history
 *
 * @example
 * ```typescript
 * const history = await getAlumniEngagementHistory('alum123', 50, AlumniEngagement);
 * ```
 */
export declare const getAlumniEngagementHistory: (alumniId: string, limit: number | undefined, AlumniEngagement: any) => Promise<any[]>;
/**
 * Identifies highly engaged alumni for recognition.
 *
 * @param {number} minScore - Minimum engagement score
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Highly engaged alumni
 *
 * @example
 * ```typescript
 * const topAlumni = await identifyHighlyEngagedAlumni(80, new Date('2024-01-01'), new Date('2024-12-31'), AlumniEngagement, Alumni);
 * ```
 */
export declare const identifyHighlyEngagedAlumni: (minScore: number, startDate: Date, endDate: Date, AlumniEngagement: any, Alumni: any) => Promise<any[]>;
/**
 * Tracks website visit engagement for analytics.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {string} pageUrl - Visited page URL
 * @param {number} duration - Visit duration in seconds
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Engagement record
 *
 * @example
 * ```typescript
 * await trackAlumniWebsiteVisit('alum123', '/alumni/events', 120, AlumniEngagement);
 * ```
 */
export declare const trackAlumniWebsiteVisit: (alumniId: string, pageUrl: string, duration: number, AlumniEngagement: any) => Promise<any>;
/**
 * Generates engagement report for alumni cohort.
 *
 * @param {number} graduationYear - Graduation year
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Engagement report
 *
 * @example
 * ```typescript
 * const report = await generateEngagementReport(2020, new Date('2024-01-01'), new Date('2024-12-31'), AlumniEngagement, Alumni);
 * ```
 */
export declare const generateEngagementReport: (graduationYear: number, startDate: Date, endDate: Date, AlumniEngagement: any, Alumni: any) => Promise<any>;
/**
 * Updates engagement metrics for dashboard display.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Engagement metrics
 *
 * @example
 * ```typescript
 * const metrics = await updateEngagementMetrics('alum123', AlumniEngagement);
 * ```
 */
export declare const updateEngagementMetrics: (alumniId: string, AlumniEngagement: any) => Promise<any>;
/**
 * Creates a new alumni event with accessibility features.
 *
 * @param {AlumniEventData} eventData - Event data
 * @param {Model} AlumniEvent - AlumniEvent model
 * @returns {Promise<any>} Created event
 *
 * @example
 * ```typescript
 * const event = await createAlumniEvent({
 *   eventName: '50th Reunion - Class of 1974',
 *   eventType: 'reunion',
 *   eventDate: new Date('2024-06-15'),
 *   location: 'University Campus',
 *   organizerId: 'ORG123',
 *   accessibilityFeatures: ['wheelchair_accessible', 'asl_interpreter', 'closed_captions']
 * }, AlumniEvent);
 * ```
 */
export declare const createAlumniEvent: (eventData: AlumniEventData, AlumniEvent: any) => Promise<any>;
/**
 * Registers alumni for event with accessibility needs.
 *
 * @param {string} eventId - Event identifier
 * @param {string} alumniId - Alumni identifier
 * @param {string[]} accessibilityNeeds - Accessibility requirements
 * @param {Model} AlumniEvent - AlumniEvent model
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Registration confirmation
 *
 * @example
 * ```typescript
 * const registration = await registerForAlumniEvent('event123', 'alum456', ['wheelchair_access', 'dietary_vegan'], AlumniEvent, AlumniEngagement);
 * ```
 */
export declare const registerForAlumniEvent: (eventId: string, alumniId: string, accessibilityNeeds: string[], AlumniEvent: any, AlumniEngagement: any) => Promise<any>;
/**
 * Retrieves upcoming alumni events with filters.
 *
 * @param {string} eventType - Event type filter (optional)
 * @param {number} limit - Maximum events to return
 * @param {Model} AlumniEvent - AlumniEvent model
 * @returns {Promise<any[]>} Upcoming events
 *
 * @example
 * ```typescript
 * const events = await getUpcomingAlumniEvents('networking', 10, AlumniEvent);
 * ```
 */
export declare const getUpcomingAlumniEvents: (eventType: string | null, limit: number | undefined, AlumniEvent: any) => Promise<any[]>;
/**
 * Retrieves event attendance list and statistics.
 *
 * @param {string} eventId - Event identifier
 * @param {Model} AlumniEvent - AlumniEvent model
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Event attendance details
 *
 * @example
 * ```typescript
 * const attendance = await getEventAttendance('event123', AlumniEvent, AlumniEngagement);
 * ```
 */
export declare const getEventAttendance: (eventId: string, AlumniEvent: any, AlumniEngagement: any) => Promise<any>;
/**
 * Updates event details and accessibility information.
 *
 * @param {string} eventId - Event identifier
 * @param {Partial<AlumniEventData>} updates - Event updates
 * @param {Model} AlumniEvent - AlumniEvent model
 * @returns {Promise<any>} Updated event
 *
 * @example
 * ```typescript
 * await updateAlumniEvent('event123', {
 *   description: 'Updated description',
 *   accessibilityFeatures: ['wheelchair_accessible', 'asl_interpreter', 'closed_captions', 'large_print']
 * }, AlumniEvent);
 * ```
 */
export declare const updateAlumniEvent: (eventId: string, updates: Partial<AlumniEventData>, AlumniEvent: any) => Promise<any>;
/**
 * Cancels event registration for alumni.
 *
 * @param {string} eventId - Event identifier
 * @param {string} alumniId - Alumni identifier
 * @param {Model} AlumniEvent - AlumniEvent model
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelEventRegistration('event123', 'alum456', AlumniEvent, AlumniEngagement);
 * ```
 */
export declare const cancelEventRegistration: (eventId: string, alumniId: string, AlumniEvent: any, AlumniEngagement: any) => Promise<void>;
/**
 * Generates accessible event invitation with ARIA labels.
 *
 * @param {string} eventId - Event identifier
 * @param {Model} AlumniEvent - AlumniEvent model
 * @returns {Promise<string>} Accessible HTML invitation
 *
 * @example
 * ```typescript
 * const invitation = await generateAccessibleEventInvitation('event123', AlumniEvent);
 * ```
 */
export declare const generateAccessibleEventInvitation: (eventId: string, AlumniEvent: any) => Promise<string>;
/**
 * Sends communication to alumni with tracking.
 *
 * @param {AlumniCommunicationData} commData - Communication data
 * @returns {Promise<any>} Communication record
 *
 * @example
 * ```typescript
 * await sendAlumniCommunication({
 *   alumniId: 'alum123',
 *   communicationType: 'email',
 *   subject: 'Alumni Newsletter - November 2024',
 *   content: 'Dear Alumni...',
 *   sentDate: new Date(),
 *   sentBy: 'admin@university.edu'
 * });
 * ```
 */
export declare const sendAlumniCommunication: (commData: AlumniCommunicationData) => Promise<any>;
/**
 * Retrieves communication history for alumni.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {number} limit - Maximum records
 * @returns {Promise<any[]>} Communication history
 *
 * @example
 * ```typescript
 * const history = await getAlumniCommunicationHistory('alum123', 50);
 * ```
 */
export declare const getAlumniCommunicationHistory: (alumniId: string, limit?: number) => Promise<any[]>;
/**
 * Tracks email open and click engagement.
 *
 * @param {string} communicationId - Communication identifier
 * @param {string} eventType - Event type ('opened' or 'clicked')
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackCommunicationEngagement('comm123', 'opened');
 * ```
 */
export declare const trackCommunicationEngagement: (communicationId: string, eventType: "opened" | "clicked") => Promise<void>;
/**
 * Generates personalized newsletter content for alumni.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<string>} Newsletter HTML
 *
 * @example
 * ```typescript
 * const newsletter = await generatePersonalizedNewsletter('alum123', Alumni);
 * ```
 */
export declare const generatePersonalizedNewsletter: (alumniId: string, Alumni: any) => Promise<string>;
/**
 * Manages alumni communication preferences and opt-outs.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Record<string, boolean>} preferences - Communication preferences
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Updated preferences
 *
 * @example
 * ```typescript
 * await updateCommunicationPreferences('alum123', {
 *   newsletter: true,
 *   eventInvitations: true,
 *   donationRequests: false
 * }, Alumni);
 * ```
 */
export declare const updateCommunicationPreferences: (alumniId: string, preferences: Record<string, boolean>, Alumni: any) => Promise<any>;
/**
 * Processes alumni donation with tax receipt.
 *
 * @param {AlumniDonationData} donationData - Donation data
 * @param {Model} AlumniDonation - AlumniDonation model
 * @param {Model} AlumniEngagement - AlumniEngagement model
 * @returns {Promise<any>} Donation record
 *
 * @example
 * ```typescript
 * const donation = await processAlumniDonation({
 *   alumniId: 'alum123',
 *   donationAmount: 1000,
 *   donationDate: new Date(),
 *   donationPurpose: 'scholarship',
 *   paymentMethod: 'credit_card',
 *   taxDeductible: true
 * }, AlumniDonation, AlumniEngagement);
 * ```
 */
export declare const processAlumniDonation: (donationData: AlumniDonationData, AlumniDonation: any, AlumniEngagement: any) => Promise<any>;
/**
 * Retrieves donation history for alumni.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} AlumniDonation - AlumniDonation model
 * @returns {Promise<any>} Donation summary
 *
 * @example
 * ```typescript
 * const history = await getAlumniDonationHistory('alum123', AlumniDonation);
 * ```
 */
export declare const getAlumniDonationHistory: (alumniId: string, AlumniDonation: any) => Promise<any>;
/**
 * Generates tax receipt for donation.
 *
 * @param {string} donationId - Donation identifier
 * @param {Model} AlumniDonation - AlumniDonation model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<string>} Tax receipt HTML
 *
 * @example
 * ```typescript
 * const receipt = await generateDonationReceipt('donation123', AlumniDonation, Alumni);
 * ```
 */
export declare const generateDonationReceipt: (donationId: string, AlumniDonation: any, Alumni: any) => Promise<string>;
/**
 * Tracks recurring donation schedule and processing.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} AlumniDonation - AlumniDonation model
 * @returns {Promise<any[]>} Active recurring donations
 *
 * @example
 * ```typescript
 * const recurring = await getRecurringDonations('alum123', AlumniDonation);
 * ```
 */
export declare const getRecurringDonations: (alumniId: string, AlumniDonation: any) => Promise<any[]>;
/**
 * Generates giving campaign report with donor recognition.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {Model} AlumniDonation - AlumniDonation model
 * @returns {Promise<any>} Campaign report
 *
 * @example
 * ```typescript
 * const report = await generateCampaignReport('campaign2024', AlumniDonation);
 * ```
 */
export declare const generateCampaignReport: (campaignId: string, AlumniDonation: any) => Promise<any>;
/**
 * Records career outcome data for alumni.
 *
 * @param {CareerOutcomeData} outcomeData - Career outcome data
 * @returns {Promise<any>} Career outcome record
 *
 * @example
 * ```typescript
 * const outcome = await recordCareerOutcome({
 *   alumniId: 'alum123',
 *   employmentStatus: 'employed',
 *   employer: 'TechCorp',
 *   position: 'Senior Software Engineer',
 *   industry: 'Technology',
 *   salary: 120000,
 *   isCurrent: true,
 *   relevantToDegree: true
 * });
 * ```
 */
export declare const recordCareerOutcome: (outcomeData: CareerOutcomeData) => Promise<any>;
/**
 * Retrieves employment statistics for graduation cohort.
 *
 * @param {number} graduationYear - Graduation year
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Employment statistics
 *
 * @example
 * ```typescript
 * const stats = await getEmploymentStatistics(2020, Alumni);
 * ```
 */
export declare const getEmploymentStatistics: (graduationYear: number, Alumni: any) => Promise<any>;
/**
 * Generates career outcomes report for program assessment.
 *
 * @param {string} degreeProgram - Degree program
 * @param {number} startYear - Start graduation year
 * @param {number} endYear - End graduation year
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any>} Career outcomes report
 *
 * @example
 * ```typescript
 * const report = await generateCareerOutcomesReport('Computer Science', 2020, 2024, Alumni);
 * ```
 */
export declare const generateCareerOutcomesReport: (degreeProgram: string, startYear: number, endYear: number, Alumni: any) => Promise<any>;
/**
 * Creates connection between alumni for networking.
 *
 * @param {AlumniNetworkConnectionData} connectionData - Connection data
 * @returns {Promise<any>} Network connection
 *
 * @example
 * ```typescript
 * const connection = await createAlumniConnection({
 *   alumniId: 'alum123',
 *   connectedAlumniId: 'alum456',
 *   connectionType: 'professional',
 *   connectedDate: new Date(),
 *   sharedInterests: ['technology', 'entrepreneurship']
 * });
 * ```
 */
export declare const createAlumniConnection: (connectionData: AlumniNetworkConnectionData) => Promise<any>;
/**
 * Retrieves alumni network connections.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Network connections
 *
 * @example
 * ```typescript
 * const network = await getAlumniNetwork('alum123', Alumni);
 * ```
 */
export declare const getAlumniNetwork: (alumniId: string, Alumni: any) => Promise<any[]>;
/**
 * Suggests potential networking connections based on shared attributes.
 *
 * @param {string} alumniId - Alumni identifier
 * @param {Model} Alumni - Alumni model
 * @param {Model} AlumniProfile - AlumniProfile model
 * @returns {Promise<any[]>} Suggested connections
 *
 * @example
 * ```typescript
 * const suggestions = await suggestNetworkingConnections('alum123', Alumni, AlumniProfile);
 * ```
 */
export declare const suggestNetworkingConnections: (alumniId: string, Alumni: any, AlumniProfile: any) => Promise<any[]>;
/**
 * Facilitates mentorship matching between alumni and students/recent grads.
 *
 * @param {string} menteeId - Mentee identifier
 * @param {string[]} interests - Areas of interest
 * @param {Model} AlumniProfile - AlumniProfile model
 * @param {Model} Alumni - Alumni model
 * @returns {Promise<any[]>} Potential mentors
 *
 * @example
 * ```typescript
 * const mentors = await matchAlumniMentors('student789', ['career_development', 'entrepreneurship'], AlumniProfile, Alumni);
 * ```
 */
export declare const matchAlumniMentors: (menteeId: string, interests: string[], AlumniProfile: any, Alumni: any) => Promise<any[]>;
/**
 * NestJS Injectable service for Alumni Management.
 *
 * @example
 * ```typescript
 * @Controller('alumni')
 * export class AlumniController {
 *   constructor(private readonly alumniService: AlumniManagementService) {}
 *
 *   @Get(':id')
 *   async getAlumnus(@Param('id') id: string) {
 *     return this.alumniService.getAlumniRecord(id);
 *   }
 * }
 * ```
 */
export declare class AlumniManagementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createAlumnus(alumniData: AlumniData): Promise<any>;
    getAlumnus(alumniId: string): Promise<any>;
    searchDirectory(filters: AlumniDirectoryFilterData, page?: number, limit?: number): Promise<{
        alumni: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    processDonation(donationData: AlumniDonationData): Promise<any>;
    getUpcomingEvents(eventType?: string | null, limit?: number): Promise<any[]>;
}
/**
 * Default export with all alumni management utilities.
 */
declare const _default: {
    createAlumniModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            studentId: string;
            firstName: string;
            lastName: string;
            email: string;
            graduationYear: number;
            degreeProgram: string;
            degreeName: string;
            currentEmployer: string;
            currentPosition: string;
            industry: string;
            linkedInProfile: string;
            mailingAddress: Record<string, any>;
            phoneNumber: string;
            preferredContact: string;
            isActive: boolean;
            privacySettings: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlumniProfileModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            alumniId: string;
            bio: string;
            professionalSummary: string;
            achievements: string[];
            skills: string[];
            interests: string[];
            volunteerOpportunities: string[];
            mentorshipAvailable: boolean;
            careerStage: string;
            willingToHire: boolean;
            profileVisibility: string;
            profilePhotoUrl: string;
            coverPhotoUrl: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlumniEngagementModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            alumniId: string;
            engagementType: string;
            engagementDate: Date;
            engagementDetails: Record<string, any>;
            engagementScore: number;
            eventId: string;
            donationId: string;
            description: string;
            duration: number;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlumniDonationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            alumniId: string;
            donationAmount: number;
            donationDate: Date;
            donationPurpose: string;
            fundName: string;
            campaignId: string;
            paymentMethod: string;
            isRecurring: boolean;
            recurringFrequency: string;
            taxDeductible: boolean;
            acknowledgementSent: boolean;
            anonymousDonor: boolean;
            matchingGiftEligible: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlumniEventModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            eventName: string;
            eventType: string;
            eventDate: Date;
            eventEndDate: Date | null;
            location: string;
            virtualEventUrl: string;
            description: string;
            maxAttendees: number;
            currentAttendees: number;
            registrationDeadline: Date;
            registrationFee: number;
            targetAudience: string[];
            organizerId: string;
            isPublished: boolean;
            requiresRSVP: boolean;
            accessibilityFeatures: string[];
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlumniRecord: (alumniData: AlumniData, Alumni: any, transaction?: Transaction) => Promise<any>;
    updateAlumniInformation: (alumniId: string, updates: Partial<AlumniData>, Alumni: any) => Promise<any>;
    getAlumniRecord: (alumniId: string, Alumni: any) => Promise<any>;
    findAlumniByIdentifier: (identifier: string, Alumni: any) => Promise<any>;
    createAlumniProfile: (profileData: AlumniProfileData, AlumniProfile: any) => Promise<any>;
    updateProfileVisibility: (alumniId: string, visibility: "public" | "alumni_only" | "private", AlumniProfile: any) => Promise<any>;
    getAlumniProfile: (alumniId: string, AlumniProfile: any) => Promise<any>;
    updateAlumniPrivacySettings: (alumniId: string, privacySettings: Record<string, any>, Alumni: any) => Promise<any>;
    validateAlumniAccess: (alumniId: string, resourceType: string, Alumni: any) => Promise<boolean>;
    searchAlumniDirectory: (filters: AlumniDirectoryFilterData, page: number | undefined, limit: number | undefined, Alumni: any, AlumniProfile: any) => Promise<{
        alumni: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAlumniByGraduationYear: (graduationYear: number, Alumni: any) => Promise<any[]>;
    filterAlumniByIndustry: (industry: string, Alumni: any) => Promise<any[]>;
    getAlumniMentors: (focusAreas: string[], AlumniProfile: any, Alumni: any) => Promise<any[]>;
    getAlumniRecruiters: (industry: string | null, AlumniProfile: any, Alumni: any) => Promise<any[]>;
    recordAlumniEngagement: (engagementData: AlumniEngagementData, AlumniEngagement: any) => Promise<any>;
    calculateEngagementScore: (alumniId: string, startDate: Date, endDate: Date, AlumniEngagement: any) => Promise<number>;
    getAlumniEngagementHistory: (alumniId: string, limit: number | undefined, AlumniEngagement: any) => Promise<any[]>;
    identifyHighlyEngagedAlumni: (minScore: number, startDate: Date, endDate: Date, AlumniEngagement: any, Alumni: any) => Promise<any[]>;
    trackAlumniWebsiteVisit: (alumniId: string, pageUrl: string, duration: number, AlumniEngagement: any) => Promise<any>;
    generateEngagementReport: (graduationYear: number, startDate: Date, endDate: Date, AlumniEngagement: any, Alumni: any) => Promise<any>;
    updateEngagementMetrics: (alumniId: string, AlumniEngagement: any) => Promise<any>;
    createAlumniEvent: (eventData: AlumniEventData, AlumniEvent: any) => Promise<any>;
    registerForAlumniEvent: (eventId: string, alumniId: string, accessibilityNeeds: string[], AlumniEvent: any, AlumniEngagement: any) => Promise<any>;
    getUpcomingAlumniEvents: (eventType: string | null, limit: number | undefined, AlumniEvent: any) => Promise<any[]>;
    getEventAttendance: (eventId: string, AlumniEvent: any, AlumniEngagement: any) => Promise<any>;
    updateAlumniEvent: (eventId: string, updates: Partial<AlumniEventData>, AlumniEvent: any) => Promise<any>;
    cancelEventRegistration: (eventId: string, alumniId: string, AlumniEvent: any, AlumniEngagement: any) => Promise<void>;
    generateAccessibleEventInvitation: (eventId: string, AlumniEvent: any) => Promise<string>;
    sendAlumniCommunication: (commData: AlumniCommunicationData) => Promise<any>;
    getAlumniCommunicationHistory: (alumniId: string, limit?: number) => Promise<any[]>;
    trackCommunicationEngagement: (communicationId: string, eventType: "opened" | "clicked") => Promise<void>;
    generatePersonalizedNewsletter: (alumniId: string, Alumni: any) => Promise<string>;
    updateCommunicationPreferences: (alumniId: string, preferences: Record<string, boolean>, Alumni: any) => Promise<any>;
    processAlumniDonation: (donationData: AlumniDonationData, AlumniDonation: any, AlumniEngagement: any) => Promise<any>;
    getAlumniDonationHistory: (alumniId: string, AlumniDonation: any) => Promise<any>;
    generateDonationReceipt: (donationId: string, AlumniDonation: any, Alumni: any) => Promise<string>;
    getRecurringDonations: (alumniId: string, AlumniDonation: any) => Promise<any[]>;
    generateCampaignReport: (campaignId: string, AlumniDonation: any) => Promise<any>;
    recordCareerOutcome: (outcomeData: CareerOutcomeData) => Promise<any>;
    getEmploymentStatistics: (graduationYear: number, Alumni: any) => Promise<any>;
    generateCareerOutcomesReport: (degreeProgram: string, startYear: number, endYear: number, Alumni: any) => Promise<any>;
    createAlumniConnection: (connectionData: AlumniNetworkConnectionData) => Promise<any>;
    getAlumniNetwork: (alumniId: string, Alumni: any) => Promise<any[]>;
    suggestNetworkingConnections: (alumniId: string, Alumni: any, AlumniProfile: any) => Promise<any[]>;
    matchAlumniMentors: (menteeId: string, interests: string[], AlumniProfile: any, Alumni: any) => Promise<any[]>;
    AlumniManagementService: typeof AlumniManagementService;
};
export default _default;
//# sourceMappingURL=alumni-management-kit.d.ts.map