/**
 * LOC: EDU-ADMISSIONS-001
 * File: /reuse/education/admissions-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend admissions services
 *   - Application review modules
 *   - Decision notification systems
 *   - Common App integration services
 */
/**
 * File: /reuse/education/admissions-management-kit.ts
 * Locator: WC-EDU-ADMISSIONS-001
 * Purpose: Enterprise-grade Admissions Management - applications, reviews, decisions, requirements, Common App, international admissions
 *
 * Upstream: Independent utility module for admissions operations
 * Downstream: ../backend/education/*, admissions controllers, review services, decision processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ functions for admissions management competing with Slate, Technolutions, Ellucian
 *
 * LLM Context: Comprehensive admissions management utilities for production-ready education applications.
 * Provides application submission, document management, review workflows, admission decisions,
 * requirement tracking, Common App integration, international student processing, enrollment deposits,
 * waitlist management, and compliance reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface ApplicantData {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    citizenship: string;
    residencyStatus?: 'domestic' | 'international' | 'permanent_resident';
    address?: Record<string, any>;
    demographics?: Record<string, any>;
    parentInfo?: Record<string, any>;
}
interface ApplicationData {
    applicantId: string;
    applicationType: 'freshman' | 'transfer' | 'graduate' | 'international';
    entryTerm: string;
    entryYear: number;
    intendedMajor?: string;
    secondaryMajor?: string;
    academicInterests?: string[];
    submittedAt?: Date;
    status?: 'draft' | 'submitted' | 'under_review' | 'complete' | 'decided';
    applicationFee?: number;
    feePaid?: boolean;
    feeWaiverApproved?: boolean;
}
interface ApplicationRequirementData {
    applicationId: string;
    requirementType: 'transcript' | 'test_scores' | 'essay' | 'recommendation' | 'portfolio' | 'other';
    requirementName: string;
    isRequired: boolean;
    dueDate?: Date;
    status: 'not_started' | 'in_progress' | 'submitted' | 'verified' | 'waived';
    documentUrl?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
}
interface AdmissionDecisionData {
    applicationId: string;
    decisionType: 'accepted' | 'denied' | 'waitlisted' | 'deferred';
    decisionDate: Date;
    notifiedDate?: Date;
    decisionBy: string;
    scholarshipOffered?: number;
    financialAidPackage?: Record<string, any>;
    conditions?: string[];
    responseDeadline?: Date;
    enrollmentDeposit?: number;
    enrollmentStatus?: 'pending' | 'confirmed' | 'declined';
}
interface ReviewerAssignmentData {
    applicationId: string;
    reviewerId: string;
    reviewerRole: 'primary' | 'secondary' | 'committee';
    assignedAt: Date;
    reviewStatus: 'pending' | 'in_progress' | 'completed';
    reviewScore?: number;
    reviewNotes?: string;
    recommendation?: 'strong_accept' | 'accept' | 'waitlist' | 'deny';
}
interface TestScoreData {
    applicantId: string;
    testType: 'SAT' | 'ACT' | 'GRE' | 'GMAT' | 'TOEFL' | 'IELTS';
    testDate: Date;
    scores: Record<string, number>;
    totalScore?: number;
    isOfficial: boolean;
    reportedDate?: Date;
}
interface CommonAppData {
    applicantId: string;
    commonAppId: string;
    applicationVersion: string;
    personalEssay: string;
    activities: any[];
    honors: any[];
    syncedAt: Date;
    syncStatus: 'pending' | 'synced' | 'error';
}
interface InternationalDocumentData {
    applicantId: string;
    documentType: 'visa' | 'passport' | 'financial_statement' | 'credential_evaluation';
    documentNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    issuingCountry: string;
    documentUrl: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
}
/**
 * Sequelize model for Applicants with demographics and contact info.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Applicant:
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
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Applicant model
 *
 * @example
 * ```typescript
 * const Applicant = createApplicantModel(sequelize);
 * const applicant = await Applicant.create({
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john.smith@example.com',
 *   phone: '555-0100',
 *   dateOfBirth: new Date('2005-06-15'),
 *   citizenship: 'US'
 * });
 * ```
 */
export declare const createApplicantModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        email: string;
        phone: string;
        dateOfBirth: Date;
        citizenship: string;
        residencyStatus: string;
        address: Record<string, any>;
        demographics: Record<string, any>;
        parentInfo: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Applications with status tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Application model
 */
export declare const createApplicationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        applicantId: string;
        applicationType: string;
        entryTerm: string;
        entryYear: number;
        intendedMajor: string | null;
        secondaryMajor: string | null;
        academicInterests: string[];
        submittedAt: Date | null;
        status: string;
        applicationFee: number;
        feePaid: boolean;
        feeWaiverApproved: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Application Requirements with verification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ApplicationRequirement model
 */
export declare const createApplicationRequirementModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        applicationId: string;
        requirementType: string;
        requirementName: string;
        isRequired: boolean;
        dueDate: Date | null;
        status: string;
        documentUrl: string | null;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Admission Decisions with scholarship info.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AdmissionDecision model
 */
export declare const createAdmissionDecisionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        applicationId: string;
        decisionType: string;
        decisionDate: Date;
        notifiedDate: Date | null;
        decisionBy: string;
        scholarshipOffered: number;
        financialAidPackage: Record<string, any>;
        conditions: string[];
        responseDeadline: Date | null;
        enrollmentDeposit: number;
        enrollmentStatus: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new applicant record.
 *
 * @param {ApplicantData} applicantData - Applicant data
 * @param {Model} Applicant - Applicant model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created applicant
 *
 * @example
 * ```typescript
 * const applicant = await createApplicant({
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john.smith@example.com',
 *   phone: '555-0100',
 *   dateOfBirth: new Date('2005-06-15'),
 *   citizenship: 'USA'
 * }, Applicant);
 * ```
 */
export declare const createApplicant: (applicantData: ApplicantData, Applicant: any, transaction?: Transaction) => Promise<any>;
/**
 * Updates applicant information.
 *
 * @param {string} applicantId - Applicant ID
 * @param {Partial<ApplicantData>} updates - Updates
 * @param {Model} Applicant - Applicant model
 * @returns {Promise<any>} Updated applicant
 *
 * @example
 * ```typescript
 * await updateApplicant('app123', { phone: '555-0200' }, Applicant);
 * ```
 */
export declare const updateApplicant: (applicantId: string, updates: Partial<ApplicantData>, Applicant: any) => Promise<any>;
/**
 * Validates applicant data completeness.
 *
 * @param {string} applicantId - Applicant ID
 * @param {Model} Applicant - Applicant model
 * @returns {Promise<{ complete: boolean; missing: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateApplicantData('app123', Applicant);
 * if (!result.complete) {
 *   console.log('Missing:', result.missing);
 * }
 * ```
 */
export declare const validateApplicantData: (applicantId: string, Applicant: any) => Promise<{
    complete: boolean;
    missing: string[];
}>;
/**
 * Searches applicants by criteria.
 *
 * @param {any} searchCriteria - Search criteria
 * @param {Model} Applicant - Applicant model
 * @returns {Promise<any[]>} Matching applicants
 *
 * @example
 * ```typescript
 * const applicants = await searchApplicants({ lastName: 'Smith' }, Applicant);
 * ```
 */
export declare const searchApplicants: (searchCriteria: any, Applicant: any) => Promise<any[]>;
/**
 * Merges duplicate applicant records.
 *
 * @param {string} primaryId - Primary applicant ID to keep
 * @param {string} duplicateId - Duplicate applicant ID to merge
 * @param {Model} Applicant - Applicant model
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Merged applicant
 *
 * @example
 * ```typescript
 * await mergeDuplicateApplicants('app123', 'app456', Applicant, Application);
 * ```
 */
export declare const mergeDuplicateApplicants: (primaryId: string, duplicateId: string, Applicant: any, Application: any) => Promise<any>;
/**
 * Creates a new application.
 *
 * @param {ApplicationData} applicationData - Application data
 * @param {Model} Application - Application model
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Created application
 *
 * @example
 * ```typescript
 * const app = await createApplication({
 *   applicantId: 'app123',
 *   applicationType: 'freshman',
 *   entryTerm: 'fall',
 *   entryYear: 2025
 * }, Application, ApplicationRequirement);
 * ```
 */
export declare const createApplication: (applicationData: ApplicationData, Application: any, ApplicationRequirement: any) => Promise<any>;
/**
 * Submits an application for review.
 *
 * @param {string} applicationId - Application ID
 * @param {Model} Application - Application model
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Submitted application
 *
 * @example
 * ```typescript
 * await submitApplication('app123', Application, ApplicationRequirement);
 * ```
 */
export declare const submitApplication: (applicationId: string, Application: any, ApplicationRequirement: any) => Promise<any>;
/**
 * Updates application status.
 *
 * @param {string} applicationId - Application ID
 * @param {string} newStatus - New status
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Updated application
 *
 * @example
 * ```typescript
 * await updateApplicationStatus('app123', 'under_review', Application);
 * ```
 */
export declare const updateApplicationStatus: (applicationId: string, newStatus: "draft" | "submitted" | "under_review" | "complete" | "decided", Application: any) => Promise<any>;
/**
 * Processes application fee payment.
 *
 * @param {string} applicationId - Application ID
 * @param {string} paymentId - Payment transaction ID
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Updated application
 *
 * @example
 * ```typescript
 * await processApplicationFee('app123', 'pay_xyz', Application);
 * ```
 */
export declare const processApplicationFee: (applicationId: string, paymentId: string, Application: any) => Promise<any>;
/**
 * Approves fee waiver for application.
 *
 * @param {string} applicationId - Application ID
 * @param {string} approvedBy - Approver user ID
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Updated application
 *
 * @example
 * ```typescript
 * await approveFeeWaiver('app123', 'admin456', Application);
 * ```
 */
export declare const approveFeeWaiver: (applicationId: string, approvedBy: string, Application: any) => Promise<any>;
/**
 * Retrieves applications by term.
 *
 * @param {string} entryTerm - Entry term
 * @param {number} entryYear - Entry year
 * @param {Model} Application - Application model
 * @returns {Promise<any[]>} Applications
 *
 * @example
 * ```typescript
 * const apps = await getApplicationsByTerm('fall', 2025, Application);
 * ```
 */
export declare const getApplicationsByTerm: (entryTerm: string, entryYear: number, Application: any) => Promise<any[]>;
/**
 * Calculates application completion percentage.
 *
 * @param {string} applicationId - Application ID
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<number>} Completion percentage
 *
 * @example
 * ```typescript
 * const pct = await calculateApplicationCompletion('app123', ApplicationRequirement);
 * console.log(`${pct}% complete`);
 * ```
 */
export declare const calculateApplicationCompletion: (applicationId: string, ApplicationRequirement: any) => Promise<number>;
/**
 * Withdraws an application.
 *
 * @param {string} applicationId - Application ID
 * @param {string} reason - Withdrawal reason
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Updated application
 *
 * @example
 * ```typescript
 * await withdrawApplication('app123', 'Accepted elsewhere', Application);
 * ```
 */
export declare const withdrawApplication: (applicationId: string, reason: string, Application: any) => Promise<any>;
/**
 * Adds a requirement to application.
 *
 * @param {ApplicationRequirementData} requirementData - Requirement data
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Created requirement
 *
 * @example
 * ```typescript
 * await addApplicationRequirement({
 *   applicationId: 'app123',
 *   requirementType: 'portfolio',
 *   requirementName: 'Art Portfolio',
 *   isRequired: true,
 *   status: 'not_started'
 * }, ApplicationRequirement);
 * ```
 */
export declare const addApplicationRequirement: (requirementData: ApplicationRequirementData, ApplicationRequirement: any) => Promise<any>;
/**
 * Updates requirement status.
 *
 * @param {string} requirementId - Requirement ID
 * @param {string} newStatus - New status
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Updated requirement
 *
 * @example
 * ```typescript
 * await updateRequirementStatus('req123', 'submitted', ApplicationRequirement);
 * ```
 */
export declare const updateRequirementStatus: (requirementId: string, newStatus: string, ApplicationRequirement: any) => Promise<any>;
/**
 * Verifies a submitted requirement.
 *
 * @param {string} requirementId - Requirement ID
 * @param {string} verifiedBy - Verifier user ID
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Verified requirement
 *
 * @example
 * ```typescript
 * await verifyRequirement('req123', 'staff789', ApplicationRequirement);
 * ```
 */
export declare const verifyRequirement: (requirementId: string, verifiedBy: string, ApplicationRequirement: any) => Promise<any>;
/**
 * Waives a requirement.
 *
 * @param {string} requirementId - Requirement ID
 * @param {string} waivedBy - Waiver approver user ID
 * @param {string} reason - Waiver reason
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any>} Waived requirement
 *
 * @example
 * ```typescript
 * await waiveRequirement('req123', 'admin456', 'Test optional policy', ApplicationRequirement);
 * ```
 */
export declare const waiveRequirement: (requirementId: string, waivedBy: string, reason: string, ApplicationRequirement: any) => Promise<any>;
/**
 * Retrieves missing requirements for application.
 *
 * @param {string} applicationId - Application ID
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<any[]>} Missing requirements
 *
 * @example
 * ```typescript
 * const missing = await getMissingRequirements('app123', ApplicationRequirement);
 * ```
 */
export declare const getMissingRequirements: (applicationId: string, ApplicationRequirement: any) => Promise<any[]>;
/**
 * Sends requirement reminder notifications.
 *
 * @param {string} applicationId - Application ID
 * @param {Model} ApplicationRequirement - ApplicationRequirement model
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendRequirementReminders('app123', ApplicationRequirement);
 * ```
 */
export declare const sendRequirementReminders: (applicationId: string, ApplicationRequirement: any) => Promise<number>;
/**
 * Creates an admission decision.
 *
 * @param {AdmissionDecisionData} decisionData - Decision data
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Created decision
 *
 * @example
 * ```typescript
 * const decision = await createAdmissionDecision({
 *   applicationId: 'app123',
 *   decisionType: 'accepted',
 *   decisionDate: new Date(),
 *   decisionBy: 'committee',
 *   scholarshipOffered: 10000,
 *   enrollmentDeposit: 500
 * }, AdmissionDecision, Application);
 * ```
 */
export declare const createAdmissionDecision: (decisionData: AdmissionDecisionData, AdmissionDecision: any, Application: any) => Promise<any>;
/**
 * Sends decision notification to applicant.
 *
 * @param {string} decisionId - Decision ID
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @returns {Promise<any>} Updated decision
 *
 * @example
 * ```typescript
 * await sendDecisionNotification('dec123', AdmissionDecision);
 * ```
 */
export declare const sendDecisionNotification: (decisionId: string, AdmissionDecision: any) => Promise<any>;
/**
 * Processes enrollment confirmation.
 *
 * @param {string} decisionId - Decision ID
 * @param {boolean} confirmed - Enrollment confirmed
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @returns {Promise<any>} Updated decision
 *
 * @example
 * ```typescript
 * await processEnrollmentConfirmation('dec123', true, AdmissionDecision);
 * ```
 */
export declare const processEnrollmentConfirmation: (decisionId: string, confirmed: boolean, AdmissionDecision: any) => Promise<any>;
/**
 * Retrieves acceptance statistics for term.
 *
 * @param {string} entryTerm - Entry term
 * @param {number} entryYear - Entry year
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @param {Model} Application - Application model
 * @returns {Promise<any>} Statistics
 *
 * @example
 * ```typescript
 * const stats = await getAcceptanceStatistics('fall', 2025, AdmissionDecision, Application);
 * ```
 */
export declare const getAcceptanceStatistics: (entryTerm: string, entryYear: number, AdmissionDecision: any, Application: any) => Promise<any>;
/**
 * Manages waitlist for term.
 *
 * @param {string} entryTerm - Entry term
 * @param {number} entryYear - Entry year
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @returns {Promise<any[]>} Waitlisted applications
 *
 * @example
 * ```typescript
 * const waitlist = await manageWaitlist('fall', 2025, AdmissionDecision);
 * ```
 */
export declare const manageWaitlist: (entryTerm: string, entryYear: number, AdmissionDecision: any) => Promise<any[]>;
/**
 * Offers admission from waitlist.
 *
 * @param {string} decisionId - Decision ID
 * @param {Model} AdmissionDecision - AdmissionDecision model
 * @returns {Promise<any>} Updated decision
 *
 * @example
 * ```typescript
 * await offerAdmissionFromWaitlist('dec123', AdmissionDecision);
 * ```
 */
export declare const offerAdmissionFromWaitlist: (decisionId: string, AdmissionDecision: any) => Promise<any>;
/**
 * Assigns reviewer to application.
 *
 * @param {ReviewerAssignmentData} assignmentData - Assignment data
 * @returns {Promise<ReviewerAssignmentData>} Created assignment
 *
 * @example
 * ```typescript
 * await assignReviewer({
 *   applicationId: 'app123',
 *   reviewerId: 'rev456',
 *   reviewerRole: 'primary',
 *   assignedAt: new Date(),
 *   reviewStatus: 'pending'
 * });
 * ```
 */
export declare const assignReviewer: (assignmentData: ReviewerAssignmentData) => Promise<ReviewerAssignmentData>;
/**
 * Submits application review.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {number} score - Review score
 * @param {string} recommendation - Recommendation
 * @param {string} notes - Review notes
 * @returns {Promise<any>} Updated assignment
 *
 * @example
 * ```typescript
 * await submitApplicationReview('assign123', 85, 'accept', 'Strong candidate');
 * ```
 */
export declare const submitApplicationReview: (assignmentId: string, score: number, recommendation: string, notes: string) => Promise<any>;
/**
 * Calculates composite review score.
 *
 * @param {string} applicationId - Application ID
 * @returns {Promise<number>} Composite score
 *
 * @example
 * ```typescript
 * const score = await calculateCompositeScore('app123');
 * ```
 */
export declare const calculateCompositeScore: (applicationId: string) => Promise<number>;
/**
 * Retrieves review assignments for reviewer.
 *
 * @param {string} reviewerId - Reviewer ID
 * @returns {Promise<ReviewerAssignmentData[]>} Assignments
 *
 * @example
 * ```typescript
 * const assignments = await getReviewerAssignments('rev456');
 * ```
 */
export declare const getReviewerAssignments: (reviewerId: string) => Promise<ReviewerAssignmentData[]>;
/**
 * Generates review committee report.
 *
 * @param {string} applicationId - Application ID
 * @returns {Promise<any>} Committee report
 *
 * @example
 * ```typescript
 * const report = await generateCommitteeReport('app123');
 * ```
 */
export declare const generateCommitteeReport: (applicationId: string) => Promise<any>;
/**
 * Flags application for committee review.
 *
 * @param {string} applicationId - Application ID
 * @param {string} reason - Flag reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flagForCommitteeReview('app123', 'Exceptional test scores');
 * ```
 */
export declare const flagForCommitteeReview: (applicationId: string, reason: string) => Promise<void>;
/**
 * Imports application from Common App.
 *
 * @param {CommonAppData} commonAppData - Common App data
 * @param {Model} Application - Application model
 * @param {Model} Applicant - Applicant model
 * @returns {Promise<any>} Created application
 *
 * @example
 * ```typescript
 * const app = await importCommonAppApplication(commonAppData, Application, Applicant);
 * ```
 */
export declare const importCommonAppApplication: (commonAppData: CommonAppData, Application: any, Applicant: any) => Promise<any>;
/**
 * Syncs updates from Common App.
 *
 * @param {string} applicationId - Application ID
 * @returns {Promise<any>} Sync result
 *
 * @example
 * ```typescript
 * await syncCommonAppUpdates('app123');
 * ```
 */
export declare const syncCommonAppUpdates: (applicationId: string) => Promise<any>;
/**
 * Maps Common App fields to institution fields.
 *
 * @param {any} commonAppData - Common App data
 * @returns {ApplicationData} Mapped application data
 *
 * @example
 * ```typescript
 * const mapped = mapCommonAppFields(commonAppData);
 * ```
 */
export declare const mapCommonAppFields: (commonAppData: any) => ApplicationData;
/**
 * Validates Common App data integrity.
 *
 * @param {CommonAppData} commonAppData - Common App data
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCommonAppData(data);
 * ```
 */
export declare const validateCommonAppData: (commonAppData: CommonAppData) => {
    valid: boolean;
    errors: string[];
};
/**
 * Processes international student documents.
 *
 * @param {InternationalDocumentData} documentData - Document data
 * @returns {Promise<InternationalDocumentData>} Processed document
 *
 * @example
 * ```typescript
 * await processInternationalDocument({
 *   applicantId: 'app123',
 *   documentType: 'passport',
 *   issuingCountry: 'CAN',
 *   documentUrl: 's3://...',
 *   verificationStatus: 'pending'
 * });
 * ```
 */
export declare const processInternationalDocument: (documentData: InternationalDocumentData) => Promise<InternationalDocumentData>;
/**
 * Validates credential evaluation for international transcripts.
 *
 * @param {string} applicantId - Applicant ID
 * @param {string} evaluationAgency - Evaluation agency
 * @returns {Promise<{ valid: boolean; equivalentGPA?: number }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateCredentialEvaluation('app123', 'WES');
 * ```
 */
export declare const validateCredentialEvaluation: (applicantId: string, evaluationAgency: string) => Promise<{
    valid: boolean;
    equivalentGPA?: number;
}>;
/**
 * Calculates English proficiency requirement.
 *
 * @param {TestScoreData[]} testScores - Test scores
 * @returns {{ met: boolean; testType?: string; score?: number }} Proficiency result
 *
 * @example
 * ```typescript
 * const proficiency = calculateEnglishProficiency(testScores);
 * ```
 */
export declare const calculateEnglishProficiency: (testScores: TestScoreData[]) => {
    met: boolean;
    testType?: string;
    score?: number;
};
/**
 * Generates I-20 form data for accepted international students.
 *
 * @param {string} applicantId - Applicant ID
 * @param {Model} Applicant - Applicant model
 * @returns {Promise<any>} I-20 form data
 *
 * @example
 * ```typescript
 * const i20 = await generateI20FormData('app123', Applicant);
 * ```
 */
export declare const generateI20FormData: (applicantId: string, Applicant: any) => Promise<any>;
/**
 * Tracks visa application status.
 *
 * @param {string} applicantId - Applicant ID
 * @param {string} visaStatus - Visa status
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackVisaStatus('app123', 'approved');
 * ```
 */
export declare const trackVisaStatus: (applicantId: string, visaStatus: string) => Promise<void>;
/**
 * NestJS Injectable service for Admissions Management.
 *
 * @example
 * ```typescript
 * @Controller('admissions')
 * export class AdmissionsController {
 *   constructor(private readonly admissionsService: AdmissionsManagementService) {}
 *
 *   @Post('applications')
 *   async createApp(@Body() data: ApplicationData) {
 *     return this.admissionsService.createApplication(data);
 *   }
 * }
 * ```
 */
export declare class AdmissionsManagementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createApplication(data: ApplicationData): Promise<any>;
    submitApplication(applicationId: string): Promise<any>;
    createDecision(data: AdmissionDecisionData): Promise<any>;
}
/**
 * Default export with all admissions utilities.
 */
declare const _default: {
    createApplicantModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            firstName: string;
            lastName: string;
            middleName: string | null;
            email: string;
            phone: string;
            dateOfBirth: Date;
            citizenship: string;
            residencyStatus: string;
            address: Record<string, any>;
            demographics: Record<string, any>;
            parentInfo: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createApplicationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            applicantId: string;
            applicationType: string;
            entryTerm: string;
            entryYear: number;
            intendedMajor: string | null;
            secondaryMajor: string | null;
            academicInterests: string[];
            submittedAt: Date | null;
            status: string;
            applicationFee: number;
            feePaid: boolean;
            feeWaiverApproved: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createApplicationRequirementModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            applicationId: string;
            requirementType: string;
            requirementName: string;
            isRequired: boolean;
            dueDate: Date | null;
            status: string;
            documentUrl: string | null;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAdmissionDecisionModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            applicationId: string;
            decisionType: string;
            decisionDate: Date;
            notifiedDate: Date | null;
            decisionBy: string;
            scholarshipOffered: number;
            financialAidPackage: Record<string, any>;
            conditions: string[];
            responseDeadline: Date | null;
            enrollmentDeposit: number;
            enrollmentStatus: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createApplicant: (applicantData: ApplicantData, Applicant: any, transaction?: Transaction) => Promise<any>;
    updateApplicant: (applicantId: string, updates: Partial<ApplicantData>, Applicant: any) => Promise<any>;
    validateApplicantData: (applicantId: string, Applicant: any) => Promise<{
        complete: boolean;
        missing: string[];
    }>;
    searchApplicants: (searchCriteria: any, Applicant: any) => Promise<any[]>;
    mergeDuplicateApplicants: (primaryId: string, duplicateId: string, Applicant: any, Application: any) => Promise<any>;
    createApplication: (applicationData: ApplicationData, Application: any, ApplicationRequirement: any) => Promise<any>;
    submitApplication: (applicationId: string, Application: any, ApplicationRequirement: any) => Promise<any>;
    updateApplicationStatus: (applicationId: string, newStatus: "draft" | "submitted" | "under_review" | "complete" | "decided", Application: any) => Promise<any>;
    processApplicationFee: (applicationId: string, paymentId: string, Application: any) => Promise<any>;
    approveFeeWaiver: (applicationId: string, approvedBy: string, Application: any) => Promise<any>;
    getApplicationsByTerm: (entryTerm: string, entryYear: number, Application: any) => Promise<any[]>;
    calculateApplicationCompletion: (applicationId: string, ApplicationRequirement: any) => Promise<number>;
    withdrawApplication: (applicationId: string, reason: string, Application: any) => Promise<any>;
    addApplicationRequirement: (requirementData: ApplicationRequirementData, ApplicationRequirement: any) => Promise<any>;
    updateRequirementStatus: (requirementId: string, newStatus: string, ApplicationRequirement: any) => Promise<any>;
    verifyRequirement: (requirementId: string, verifiedBy: string, ApplicationRequirement: any) => Promise<any>;
    waiveRequirement: (requirementId: string, waivedBy: string, reason: string, ApplicationRequirement: any) => Promise<any>;
    getMissingRequirements: (applicationId: string, ApplicationRequirement: any) => Promise<any[]>;
    sendRequirementReminders: (applicationId: string, ApplicationRequirement: any) => Promise<number>;
    createAdmissionDecision: (decisionData: AdmissionDecisionData, AdmissionDecision: any, Application: any) => Promise<any>;
    sendDecisionNotification: (decisionId: string, AdmissionDecision: any) => Promise<any>;
    processEnrollmentConfirmation: (decisionId: string, confirmed: boolean, AdmissionDecision: any) => Promise<any>;
    getAcceptanceStatistics: (entryTerm: string, entryYear: number, AdmissionDecision: any, Application: any) => Promise<any>;
    manageWaitlist: (entryTerm: string, entryYear: number, AdmissionDecision: any) => Promise<any[]>;
    offerAdmissionFromWaitlist: (decisionId: string, AdmissionDecision: any) => Promise<any>;
    assignReviewer: (assignmentData: ReviewerAssignmentData) => Promise<ReviewerAssignmentData>;
    submitApplicationReview: (assignmentId: string, score: number, recommendation: string, notes: string) => Promise<any>;
    calculateCompositeScore: (applicationId: string) => Promise<number>;
    getReviewerAssignments: (reviewerId: string) => Promise<ReviewerAssignmentData[]>;
    generateCommitteeReport: (applicationId: string) => Promise<any>;
    flagForCommitteeReview: (applicationId: string, reason: string) => Promise<void>;
    importCommonAppApplication: (commonAppData: CommonAppData, Application: any, Applicant: any) => Promise<any>;
    syncCommonAppUpdates: (applicationId: string) => Promise<any>;
    mapCommonAppFields: (commonAppData: any) => ApplicationData;
    validateCommonAppData: (commonAppData: CommonAppData) => {
        valid: boolean;
        errors: string[];
    };
    processInternationalDocument: (documentData: InternationalDocumentData) => Promise<InternationalDocumentData>;
    validateCredentialEvaluation: (applicantId: string, evaluationAgency: string) => Promise<{
        valid: boolean;
        equivalentGPA?: number;
    }>;
    calculateEnglishProficiency: (testScores: TestScoreData[]) => {
        met: boolean;
        testType?: string;
        score?: number;
    };
    generateI20FormData: (applicantId: string, Applicant: any) => Promise<any>;
    trackVisaStatus: (applicantId: string, visaStatus: string) => Promise<void>;
    AdmissionsManagementService: typeof AdmissionsManagementService;
};
export default _default;
//# sourceMappingURL=admissions-management-kit.d.ts.map