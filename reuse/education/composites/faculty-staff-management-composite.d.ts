/**
 * LOC: EDU-COMP-FACULTY-001
 * File: /reuse/education/composites/faculty-staff-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../faculty-management-kit
 *   - ../credential-management-kit
 *   - ../class-scheduling-kit
 *   - ../course-catalog-kit
 *   - ../grading-assessment-kit
 *
 * DOWNSTREAM (imported by):
 *   - Faculty administration controllers
 *   - HR integration services
 *   - Workload management modules
 *   - Contract processing services
 *   - Faculty evaluation systems
 */
import { Sequelize } from 'sequelize';
import { ContractType, EvaluationType, QualificationType, DayOfWeek } from '../faculty-management-kit';
/**
 * Teaching load status
 */
export type LoadStatus = 'underloaded' | 'normal' | 'overloaded' | 'balanced';
/**
 * Contract renewal status
 */
export type RenewalStatus = 'pending_review' | 'approved' | 'denied' | 'expired' | 'active';
/**
 * Evaluation status
 */
export type EvalStatus = 'not_started' | 'in_progress' | 'completed' | 'approved';
/**
 * Professional development type
 */
export type DevType = 'workshop' | 'conference' | 'certification' | 'course' | 'research';
/**
 * Faculty profile with complete biographical information
 */
export interface FacultyProfileData {
    facultyId: string;
    biography?: string;
    officeLocation?: string;
    officePhone?: string;
    personalWebsite?: string;
    researchInterests?: string[];
    teachingPhilosophy?: string;
    publications?: Array<{
        title: string;
        authors: string[];
        year: number;
        venue: string;
        type: 'journal' | 'conference' | 'book' | 'chapter';
    }>;
    education?: Array<{
        degree: string;
        field: string;
        institution: string;
        year: number;
    }>;
    photoUrl?: string;
    cvUrl?: string;
}
/**
 * Teaching load assignment
 */
export interface TeachingLoadData {
    facultyId: string;
    academicYear: string;
    term: string;
    courseId: string;
    courseCode: string;
    courseName: string;
    creditHours: number;
    enrollmentCount: number;
    contactHours: number;
    loadUnits: number;
    isTeamTaught: boolean;
    teamMembers?: string[];
}
/**
 * Faculty contract information
 */
export interface FacultyContractData {
    facultyId: string;
    contractType: ContractType;
    startDate: Date;
    endDate: Date;
    renewalDate?: Date;
    annualSalary: number;
    benefits?: Record<string, any>;
    terms?: string;
    status: RenewalStatus;
    signedDate?: Date;
    approvedBy?: string;
}
/**
 * Faculty credential tracking
 */
export interface CredentialData {
    facultyId: string;
    credentialType: QualificationType;
    credentialName: string;
    issuingOrganization: string;
    issuedDate: Date;
    expiryDate?: Date;
    credentialNumber?: string;
    documentUrl?: string;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedDate?: Date;
}
/**
 * Office hours schedule
 */
export interface OfficeHoursData {
    facultyId: string;
    academicYear: string;
    term: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    location: string;
    isVirtual: boolean;
    virtualMeetingUrl?: string;
    appointmentRequired: boolean;
    maxCapacity?: number;
}
/**
 * Faculty evaluation record
 */
export interface FacultyEvaluationData {
    facultyId: string;
    evaluationType: EvaluationType;
    academicYear: string;
    evaluatorId: string;
    evaluationDate: Date;
    overallRating: number;
    teachingScore?: number;
    researchScore?: number;
    serviceScore?: number;
    strengths?: string[];
    areasForImprovement?: string[];
    goals?: string[];
    comments?: string;
    status: EvalStatus;
    nextReviewDate?: Date;
}
/**
 * Professional development activity
 */
export interface ProfessionalDevData {
    facultyId: string;
    activityType: DevType;
    activityName: string;
    provider?: string;
    startDate: Date;
    endDate?: Date;
    creditHours?: number;
    certificateUrl?: string;
    cost?: number;
    fundingSource?: string;
    completionStatus: 'registered' | 'in_progress' | 'completed' | 'cancelled';
}
/**
 * Sabbatical leave request
 */
export interface SabbaticalData {
    facultyId: string;
    requestDate: Date;
    startDate: Date;
    endDate: Date;
    sabbaticalType: 'research' | 'teaching' | 'professional_development';
    description: string;
    expectedOutcomes?: string[];
    status: 'pending' | 'approved' | 'denied' | 'active' | 'completed';
    approvedBy?: string;
    approvalDate?: Date;
    reportUrl?: string;
}
/**
 * Faculty workload summary
 */
export interface WorkloadSummary {
    facultyId: string;
    facultyName: string;
    totalCourses: number;
    totalCreditHours: number;
    totalContactHours: number;
    totalStudents: number;
    loadUnits: number;
    expectedLoad: number;
    loadStatus: LoadStatus;
    isBalanced: boolean;
    adviseeCount?: number;
    committeeCount?: number;
}
/**
 * Tenure review progress
 */
export interface TenureReviewData {
    facultyId: string;
    reviewYear: number;
    startDate: Date;
    expectedDecisionDate: Date;
    portfolioUrl?: string;
    externalReviewers?: string[];
    teachingEvaluations: number;
    publicationCount: number;
    serviceActivities: number;
    committeeRecommendation?: 'approve' | 'deny' | 'defer';
    status: 'preparation' | 'under_review' | 'decided';
    decision?: 'tenured' | 'denied' | 'deferred';
    decisionDate?: Date;
}
/**
 * Sequelize model for Faculty Profiles with complete biographical data.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     FacultyProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         facultyId:
 *           type: string
 *         biography:
 *           type: string
 *         officeLocation:
 *           type: string
 *         researchInterests:
 *           type: array
 *           items:
 *             type: string
 */
export declare const createFacultyProfileModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        facultyId: string;
        biography: string | null;
        officeLocation: string | null;
        officePhone: string | null;
        personalWebsite: string | null;
        researchInterests: string[];
        teachingPhilosophy: string | null;
        publications: any[];
        education: any[];
        photoUrl: string | null;
        cvUrl: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Teaching Load assignments.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     TeachingLoad:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         facultyId:
 *           type: string
 *         creditHours:
 *           type: number
 */
export declare const createTeachingLoadModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        facultyId: string;
        academicYear: string;
        term: string;
        courseId: string;
        courseCode: string;
        courseName: string;
        creditHours: number;
        enrollmentCount: number;
        contactHours: number;
        loadUnits: number;
        isTeamTaught: boolean;
        teamMembers: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Faculty & Staff Management Composite Service
 *
 * Provides comprehensive faculty administration, workload management, contract tracking,
 * and evaluation systems for higher education institutions.
 */
export declare class FacultyStaffManagementCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates comprehensive faculty profile with biographical information.
     *
     * @param {FacultyProfileData} profileData - Profile data
     * @returns {Promise<any>} Created profile
     *
     * @example
     * ```typescript
     * const profile = await service.createFacultyProfile({
     *   facultyId: 'fac-123',
     *   biography: 'Dr. Smith specializes in computer science...',
     *   officeLocation: 'Science Building 305',
     *   researchInterests: ['AI', 'Machine Learning', 'Data Science'],
     *   publications: [{
     *     title: 'Neural Networks in Education',
     *     year: 2024,
     *     venue: 'IEEE Transactions',
     *     type: 'journal'
     *   }]
     * });
     * ```
     */
    createFacultyProfile(profileData: FacultyProfileData): Promise<any>;
    /**
     * 2. Updates faculty biographical and contact information.
     *
     * @param {string} facultyId - Faculty ID
     * @param {Partial<FacultyProfileData>} updates - Profile updates
     * @returns {Promise<any>} Updated profile
     *
     * @example
     * ```typescript
     * const updated = await service.updateFacultyProfile('fac-123', {
     *   officePhone: '555-1234',
     *   officeLocation: 'Science Building 310'
     * });
     * ```
     */
    updateFacultyProfile(facultyId: string, updates: Partial<FacultyProfileData>): Promise<any>;
    /**
     * 3. Retrieves complete faculty profile with all details.
     *
     * @param {string} facultyId - Faculty ID
     * @returns {Promise<any>} Faculty profile
     *
     * @example
     * ```typescript
     * const profile = await service.getFacultyProfile('fac-123');
     * console.log(profile.researchInterests);
     * ```
     */
    getFacultyProfile(facultyId: string): Promise<any>;
    /**
     * 4. Adds publication to faculty profile.
     *
     * @param {string} facultyId - Faculty ID
     * @param {Object} publication - Publication data
     * @returns {Promise<any>} Updated profile
     *
     * @example
     * ```typescript
     * await service.addFacultyPublication('fac-123', {
     *   title: 'Deep Learning Applications',
     *   authors: ['Smith, J.', 'Doe, J.'],
     *   year: 2024,
     *   venue: 'ACM Conference',
     *   type: 'conference'
     * });
     * ```
     */
    addFacultyPublication(facultyId: string, publication: any): Promise<any>;
    /**
     * 5. Updates faculty research interests.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string[]} interests - Research interests
     * @returns {Promise<any>} Updated profile
     *
     * @example
     * ```typescript
     * await service.updateResearchInterests('fac-123', [
     *   'Artificial Intelligence',
     *   'Natural Language Processing',
     *   'Computer Vision'
     * ]);
     * ```
     */
    updateResearchInterests(facultyId: string, interests: string[]): Promise<any>;
    /**
     * 6. Uploads and associates faculty CV document.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} cvUrl - CV document URL
     * @returns {Promise<any>} Updated profile
     *
     * @example
     * ```typescript
     * await service.uploadFacultyCV('fac-123', 'https://cdn.example.com/cv/smith.pdf');
     * ```
     */
    uploadFacultyCV(facultyId: string, cvUrl: string): Promise<any>;
    /**
     * 7. Searches faculty by research interests or expertise.
     *
     * @param {string[]} interests - Research interests to search
     * @returns {Promise<any[]>} Matching faculty profiles
     *
     * @example
     * ```typescript
     * const experts = await service.searchFacultyByInterests(['Machine Learning', 'AI']);
     * ```
     */
    searchFacultyByInterests(interests: string[]): Promise<any[]>;
    /**
     * 8. Generates faculty directory with contact information.
     *
     * @param {Object} filters - Directory filters
     * @returns {Promise<any[]>} Faculty directory
     *
     * @example
     * ```typescript
     * const directory = await service.generateFacultyDirectory({
     *   departmentId: 'dept-cs',
     *   includeOfficeHours: true
     * });
     * ```
     */
    generateFacultyDirectory(filters?: any): Promise<any[]>;
    /**
     * 9. Assigns course to faculty teaching load.
     *
     * @param {TeachingLoadData} loadData - Load assignment data
     * @returns {Promise<any>} Created load assignment
     *
     * @example
     * ```typescript
     * const assignment = await service.assignCourseToFaculty({
     *   facultyId: 'fac-123',
     *   academicYear: '2024-2025',
     *   term: 'Fall',
     *   courseId: 'course-cs101',
     *   courseCode: 'CS-101',
     *   courseName: 'Intro to Computer Science',
     *   creditHours: 3,
     *   enrollmentCount: 35,
     *   contactHours: 3,
     *   loadUnits: 3
     * });
     * ```
     */
    assignCourseToFaculty(loadData: TeachingLoadData): Promise<any>;
    /**
     * 10. Calculates total teaching load for faculty member.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<WorkloadSummary>} Workload summary
     *
     * @example
     * ```typescript
     * const load = await service.calculateTeachingLoad('fac-123', '2024-2025', 'Fall');
     * console.log(`Load units: ${load.loadUnits}, Status: ${load.loadStatus}`);
     * ```
     */
    calculateTeachingLoad(facultyId: string, academicYear: string, term: string): Promise<WorkloadSummary>;
    /**
     * 11. Balances teaching loads across department faculty.
     *
     * @param {string} departmentId - Department ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Balancing recommendations
     *
     * @example
     * ```typescript
     * const recommendations = await service.balanceTeachingLoads(
     *   'dept-cs',
     *   '2024-2025',
     *   'Fall'
     * );
     * ```
     */
    balanceTeachingLoads(departmentId: string, academicYear: string, term: string): Promise<any>;
    /**
     * 12. Retrieves faculty teaching schedule.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any[]>} Teaching schedule
     *
     * @example
     * ```typescript
     * const schedule = await service.getFacultySchedule('fac-123', '2024-2025', 'Fall');
     * ```
     */
    getFacultySchedule(facultyId: string, academicYear: string, term: string): Promise<any[]>;
    /**
     * 13. Updates course enrollment count in teaching load.
     *
     * @param {string} loadId - Teaching load ID
     * @param {number} enrollmentCount - New enrollment count
     * @returns {Promise<any>} Updated load
     *
     * @example
     * ```typescript
     * await service.updateCourseEnrollment('load-123', 42);
     * ```
     */
    updateCourseEnrollment(loadId: string, enrollmentCount: number): Promise<any>;
    /**
     * 14. Assigns team teaching arrangement.
     *
     * @param {string} courseId - Course ID
     * @param {string[]} facultyIds - Faculty member IDs
     * @returns {Promise<any>} Team teaching assignment
     *
     * @example
     * ```typescript
     * await service.assignTeamTeaching('course-cs500', ['fac-123', 'fac-456']);
     * ```
     */
    assignTeamTeaching(courseId: string, facultyIds: string[]): Promise<any>;
    /**
     * 15. Generates department workload report.
     *
     * @param {string} departmentId - Department ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Workload report
     *
     * @example
     * ```typescript
     * const report = await service.generateWorkloadReport('dept-cs', '2024-2025', 'Fall');
     * ```
     */
    generateWorkloadReport(departmentId: string, academicYear: string, term: string): Promise<any>;
    /**
     * 16. Validates teaching load compliance with policies.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Compliance validation
     *
     * @example
     * ```typescript
     * const validation = await service.validateLoadCompliance('fac-123', '2024-2025', 'Fall');
     * if (!validation.compliant) {
     *   console.log('Violations:', validation.violations);
     * }
     * ```
     */
    validateLoadCompliance(facultyId: string, academicYear: string, term: string): Promise<any>;
    /**
     * 17. Creates new faculty contract.
     *
     * @param {FacultyContractData} contractData - Contract data
     * @returns {Promise<any>} Created contract
     *
     * @example
     * ```typescript
     * const contract = await service.createFacultyContract({
     *   facultyId: 'fac-123',
     *   contractType: ContractType.TENURE_TRACK,
     *   startDate: new Date('2024-08-15'),
     *   endDate: new Date('2025-05-15'),
     *   annualSalary: 85000,
     *   status: 'active'
     * });
     * ```
     */
    createFacultyContract(contractData: FacultyContractData): Promise<any>;
    /**
     * 18. Processes contract renewal request.
     *
     * @param {string} contractId - Contract ID
     * @param {Date} newEndDate - New end date
     * @param {number} newSalary - New salary
     * @returns {Promise<any>} Renewed contract
     *
     * @example
     * ```typescript
     * const renewed = await service.renewFacultyContract(
     *   'contract-123',
     *   new Date('2026-05-15'),
     *   90000
     * );
     * ```
     */
    renewFacultyContract(contractId: string, newEndDate: Date, newSalary: number): Promise<any>;
    /**
     * 19. Tracks contract expiration dates and sends alerts.
     *
     * @param {number} daysAhead - Days to look ahead
     * @returns {Promise<any[]>} Expiring contracts
     *
     * @example
     * ```typescript
     * const expiring = await service.trackContractExpirations(90);
     * console.log(`${expiring.length} contracts expiring in 90 days`);
     * ```
     */
    trackContractExpirations(daysAhead: number): Promise<any[]>;
    /**
     * 20. Updates contract terms and conditions.
     *
     * @param {string} contractId - Contract ID
     * @param {string} terms - Updated terms
     * @returns {Promise<any>} Updated contract
     *
     * @example
     * ```typescript
     * await service.updateContractTerms('contract-123', 'Updated terms...');
     * ```
     */
    updateContractTerms(contractId: string, terms: string): Promise<any>;
    /**
     * 21. Generates contract documentation.
     *
     * @param {string} contractId - Contract ID
     * @returns {Promise<any>} Contract document
     *
     * @example
     * ```typescript
     * const doc = await service.generateContractDocument('contract-123');
     * console.log(doc.pdfUrl);
     * ```
     */
    generateContractDocument(contractId: string): Promise<any>;
    /**
     * 22. Validates contract compliance with labor regulations.
     *
     * @param {string} contractId - Contract ID
     * @returns {Promise<any>} Compliance validation
     *
     * @example
     * ```typescript
     * const compliance = await service.validateContractCompliance('contract-123');
     * ```
     */
    validateContractCompliance(contractId: string): Promise<any>;
    /**
     * 23. Adds credential to faculty record.
     *
     * @param {CredentialData} credentialData - Credential data
     * @returns {Promise<any>} Created credential
     *
     * @example
     * ```typescript
     * const credential = await service.addFacultyCredential({
     *   facultyId: 'fac-123',
     *   credentialType: QualificationType.DEGREE,
     *   credentialName: 'Ph.D. Computer Science',
     *   issuingOrganization: 'MIT',
     *   issuedDate: new Date('2018-06-01'),
     *   isVerified: true
     * });
     * ```
     */
    addFacultyCredential(credentialData: CredentialData): Promise<any>;
    /**
     * 24. Verifies faculty credential authenticity.
     *
     * @param {string} credentialId - Credential ID
     * @param {string} verifiedBy - Verifier ID
     * @returns {Promise<any>} Verified credential
     *
     * @example
     * ```typescript
     * await service.verifyFacultyCredential('cred-123', 'admin-456');
     * ```
     */
    verifyFacultyCredential(credentialId: string, verifiedBy: string): Promise<any>;
    /**
     * 25. Tracks credential expiration dates.
     *
     * @param {string} facultyId - Faculty ID
     * @returns {Promise<any[]>} Expiring credentials
     *
     * @example
     * ```typescript
     * const expiring = await service.trackCredentialExpirations('fac-123');
     * ```
     */
    trackCredentialExpirations(facultyId: string): Promise<any[]>;
    /**
     * 26. Generates credential verification report.
     *
     * @param {string} facultyId - Faculty ID
     * @returns {Promise<any>} Verification report
     *
     * @example
     * ```typescript
     * const report = await service.generateCredentialReport('fac-123');
     * ```
     */
    generateCredentialReport(facultyId: string): Promise<any>;
    /**
     * 27. Validates teaching qualifications for course assignment.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} courseId - Course ID
     * @returns {Promise<any>} Qualification validation
     *
     * @example
     * ```typescript
     * const qualified = await service.validateTeachingQualification('fac-123', 'course-cs500');
     * if (!qualified.isQualified) {
     *   console.log('Missing qualifications:', qualified.missing);
     * }
     * ```
     */
    validateTeachingQualification(facultyId: string, courseId: string): Promise<any>;
    /**
     * 28. Updates credential documentation.
     *
     * @param {string} credentialId - Credential ID
     * @param {string} documentUrl - Document URL
     * @returns {Promise<any>} Updated credential
     *
     * @example
     * ```typescript
     * await service.updateCredentialDocument('cred-123', 'https://cdn.example.com/creds/doc.pdf');
     * ```
     */
    updateCredentialDocument(credentialId: string, documentUrl: string): Promise<any>;
    /**
     * 29. Creates faculty office hours schedule.
     *
     * @param {OfficeHoursData} officeHoursData - Office hours data
     * @returns {Promise<any>} Created office hours
     *
     * @example
     * ```typescript
     * const officeHours = await service.createOfficeHours({
     *   facultyId: 'fac-123',
     *   academicYear: '2024-2025',
     *   term: 'Fall',
     *   dayOfWeek: DayOfWeek.MONDAY,
     *   startTime: '14:00',
     *   endTime: '16:00',
     *   location: 'Science 305',
     *   isVirtual: false,
     *   appointmentRequired: false
     * });
     * ```
     */
    createOfficeHours(officeHoursData: OfficeHoursData): Promise<any>;
    /**
     * 30. Retrieves faculty availability schedule.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} term - Term
     * @returns {Promise<any[]>} Office hours schedule
     *
     * @example
     * ```typescript
     * const schedule = await service.getFacultyAvailability('fac-123', 'Fall');
     * ```
     */
    getFacultyAvailability(facultyId: string, term: string): Promise<any[]>;
    /**
     * 31. Manages office hours appointment bookings.
     *
     * @param {string} officeHoursId - Office hours ID
     * @param {string} studentId - Student ID
     * @param {Date} appointmentTime - Appointment time
     * @returns {Promise<any>} Booked appointment
     *
     * @example
     * ```typescript
     * const appointment = await service.bookOfficeHoursAppointment(
     *   'oh-123',
     *   'stu-456',
     *   new Date('2024-10-15T14:30:00')
     * );
     * ```
     */
    bookOfficeHoursAppointment(officeHoursId: string, studentId: string, appointmentTime: Date): Promise<any>;
    /**
     * 32. Updates office hours location or time.
     *
     * @param {string} officeHoursId - Office hours ID
     * @param {Partial<OfficeHoursData>} updates - Updates
     * @returns {Promise<any>} Updated office hours
     *
     * @example
     * ```typescript
     * await service.updateOfficeHours('oh-123', {
     *   location: 'Science 310',
     *   startTime: '15:00'
     * });
     * ```
     */
    updateOfficeHours(officeHoursId: string, updates: Partial<OfficeHoursData>): Promise<any>;
    /**
     * 33. Generates faculty availability report.
     *
     * @param {string} departmentId - Department ID
     * @param {string} term - Term
     * @returns {Promise<any>} Availability report
     *
     * @example
     * ```typescript
     * const report = await service.generateAvailabilityReport('dept-cs', 'Fall');
     * ```
     */
    generateAvailabilityReport(departmentId: string, term: string): Promise<any>;
    /**
     * 34. Creates faculty performance evaluation.
     *
     * @param {FacultyEvaluationData} evaluationData - Evaluation data
     * @returns {Promise<any>} Created evaluation
     *
     * @example
     * ```typescript
     * const evaluation = await service.createFacultyEvaluation({
     *   facultyId: 'fac-123',
     *   evaluationType: EvaluationType.ANNUAL_REVIEW,
     *   academicYear: '2023-2024',
     *   evaluatorId: 'admin-456',
     *   evaluationDate: new Date(),
     *   overallRating: 4.5,
     *   teachingScore: 4.7,
     *   researchScore: 4.3,
     *   serviceScore: 4.5,
     *   status: 'completed'
     * });
     * ```
     */
    createFacultyEvaluation(evaluationData: FacultyEvaluationData): Promise<any>;
    /**
     * 35. Processes peer evaluation submissions.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} peerId - Peer evaluator ID
     * @param {any} evaluationData - Evaluation data
     * @returns {Promise<any>} Peer evaluation
     *
     * @example
     * ```typescript
     * await service.submitPeerEvaluation('fac-123', 'fac-456', {
     *   teachingObservation: 'Excellent classroom management...',
     *   rating: 5
     * });
     * ```
     */
    submitPeerEvaluation(facultyId: string, peerId: string, evaluationData: any): Promise<any>;
    /**
     * 36. Aggregates student teaching evaluations.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Aggregated evaluations
     *
     * @example
     * ```typescript
     * const summary = await service.aggregateStudentEvaluations('fac-123', '2023-2024', 'Fall');
     * console.log(`Average rating: ${summary.averageRating}`);
     * ```
     */
    aggregateStudentEvaluations(facultyId: string, academicYear: string, term: string): Promise<any>;
    /**
     * 37. Generates comprehensive performance report.
     *
     * @param {string} facultyId - Faculty ID
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Performance report
     *
     * @example
     * ```typescript
     * const report = await service.generatePerformanceReport('fac-123', '2023-2024');
     * ```
     */
    generatePerformanceReport(facultyId: string, academicYear: string): Promise<any>;
    /**
     * 38. Tracks professional development activities.
     *
     * @param {ProfessionalDevData} devData - Development activity data
     * @returns {Promise<any>} Created activity record
     *
     * @example
     * ```typescript
     * await service.trackProfessionalDevelopment({
     *   facultyId: 'fac-123',
     *   activityType: 'workshop',
     *   activityName: 'Active Learning Strategies',
     *   startDate: new Date('2024-08-10'),
     *   creditHours: 8,
     *   completionStatus: 'completed'
     * });
     * ```
     */
    trackProfessionalDevelopment(devData: ProfessionalDevData): Promise<any>;
    /**
     * 39. Manages sabbatical leave requests.
     *
     * @param {SabbaticalData} sabbaticalData - Sabbatical request data
     * @returns {Promise<any>} Sabbatical request
     *
     * @example
     * ```typescript
     * const request = await service.requestSabbatical({
     *   facultyId: 'fac-123',
     *   requestDate: new Date(),
     *   startDate: new Date('2025-01-15'),
     *   endDate: new Date('2025-05-15'),
     *   sabbaticalType: 'research',
     *   description: 'Research on AI in education',
     *   status: 'pending'
     * });
     * ```
     */
    requestSabbatical(sabbaticalData: SabbaticalData): Promise<any>;
    /**
     * 40. Processes tenure review workflow.
     *
     * @param {TenureReviewData} tenureData - Tenure review data
     * @returns {Promise<any>} Tenure review record
     *
     * @example
     * ```typescript
     * const review = await service.processTenureReview({
     *   facultyId: 'fac-123',
     *   reviewYear: 2024,
     *   startDate: new Date('2024-01-15'),
     *   expectedDecisionDate: new Date('2024-12-15'),
     *   teachingEvaluations: 4.6,
     *   publicationCount: 15,
     *   serviceActivities: 8,
     *   status: 'under_review'
     * });
     * ```
     */
    processTenureReview(tenureData: TenureReviewData): Promise<any>;
    /**
     * 41. Updates evaluation goals and action plans.
     *
     * @param {string} evaluationId - Evaluation ID
     * @param {string[]} goals - Performance goals
     * @returns {Promise<any>} Updated evaluation
     *
     * @example
     * ```typescript
     * await service.updateEvaluationGoals('eval-123', [
     *   'Increase student engagement',
     *   'Publish 2 peer-reviewed papers',
     *   'Lead department committee'
     * ]);
     * ```
     */
    updateEvaluationGoals(evaluationId: string, goals: string[]): Promise<any>;
    /**
     * 42. Generates department-wide evaluation summary.
     *
     * @param {string} departmentId - Department ID
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Department evaluation summary
     *
     * @example
     * ```typescript
     * const summary = await service.generateDepartmentEvaluationSummary(
     *   'dept-cs',
     *   '2023-2024'
     * );
     * console.log(`Average department rating: ${summary.averageRating}`);
     * ```
     */
    generateDepartmentEvaluationSummary(departmentId: string, academicYear: string): Promise<any>;
}
export default FacultyStaffManagementCompositeService;
//# sourceMappingURL=faculty-staff-management-composite.d.ts.map