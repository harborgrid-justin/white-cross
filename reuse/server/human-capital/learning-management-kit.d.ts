/**
 * LOC: HCMLRN12345
 * File: /reuse/server/human-capital/learning-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Learning management controllers
 *   - Training administration services
 *   - Compliance training services
 */
/**
 * File: /reuse/server/human-capital/learning-management-kit.ts
 * Locator: WC-HCM-LRN-001
 * Purpose: Comprehensive Learning Management System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, learning services, training administration, compliance management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 50+ utility functions for learning catalog, course management, training programs, enrollment,
 * ILT/VILT management, e-learning, SCORM, certifications, compliance training, assessments, analytics
 *
 * LLM Context: Enterprise-grade Learning Management System competing with SAP SuccessFactors Learning.
 * Provides complete learning catalog management, course creation and delivery, training program scheduling,
 * enrollment and waitlist management, instructor-led training (ILT), virtual instructor-led training (VILT),
 * e-learning content management, SCORM compliance, learning paths and curricula, certification tracking,
 * accreditation management, compliance training automation, attendance tracking, completion tracking,
 * learning assessments and quizzes, training feedback and evaluations, comprehensive learning analytics,
 * reporting dashboards, integration with HRIS and performance management systems.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Learning item types
 */
export declare enum LearningItemType {
    COURSE = "course",
    CURRICULUM = "curriculum",
    LEARNING_PATH = "learning_path",
    PROGRAM = "program",
    CERTIFICATION = "certification",
    ASSESSMENT = "assessment"
}
/**
 * Course delivery methods
 */
export declare enum DeliveryMethod {
    ILT = "ilt",// Instructor-Led Training
    VILT = "vilt",// Virtual Instructor-Led Training
    ELEARNING = "elearning",
    BLENDED = "blended",
    ON_THE_JOB = "on_the_job",
    SELF_PACED = "self_paced",
    WEBINAR = "webinar",
    WORKSHOP = "workshop"
}
/**
 * Course status values
 */
export declare enum CourseStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    UNDER_REVIEW = "under_review",
    RETIRED = "retired"
}
/**
 * Enrollment status values
 */
export declare enum EnrollmentStatus {
    WAITLISTED = "waitlisted",
    ENROLLED = "enrolled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    WITHDRAWN = "withdrawn"
}
/**
 * Training session status
 */
export declare enum SessionStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULED = "rescheduled"
}
/**
 * Attendance status
 */
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused",
    PARTIAL = "partial"
}
/**
 * Assessment status
 */
export declare enum AssessmentStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PASSED = "passed",
    FAILED = "failed",
    EXPIRED = "expired"
}
/**
 * Certification status
 */
export declare enum CertificationStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    REVOKED = "revoked",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
/**
 * SCORM version
 */
export declare enum ScormVersion {
    SCORM_1_2 = "scorm_1_2",
    SCORM_2004 = "scorm_2004",
    XAPI = "xapi",
    AICC = "aicc"
}
/**
 * Compliance training type
 */
export declare enum ComplianceType {
    MANDATORY = "mandatory",
    RECOMMENDED = "recommended",
    OPTIONAL = "optional",
    REGULATORY = "regulatory"
}
/**
 * Question types for assessments
 */
export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    TRUE_FALSE = "true_false",
    SHORT_ANSWER = "short_answer",
    ESSAY = "essay",
    MATCHING = "matching",
    FILL_IN_BLANK = "fill_in_blank"
}
/**
 * Learning course interface
 */
export interface LearningCourse {
    id: string;
    courseCode: string;
    courseName: string;
    description: string;
    type: LearningItemType;
    deliveryMethod: DeliveryMethod;
    status: CourseStatus;
    version: string;
    duration: number;
    credits: number;
    passingScore?: number;
    maxAttempts?: number;
    validityPeriod?: number;
    ownerId: string;
    categoryId?: string;
    competencyIds: string[];
    prerequisites: string[];
    tags: string[];
    isComplianceTraining: boolean;
    complianceType?: ComplianceType;
    scormCompliant: boolean;
    scormVersion?: ScormVersion;
    contentUrl?: string;
    thumbnailUrl?: string;
    language: string;
    targetAudience: string[];
    learningObjectives: string[];
    metadata: Record<string, any>;
    publishedAt?: Date;
    retiredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Training program interface
 */
export interface TrainingProgram {
    id: string;
    programCode: string;
    programName: string;
    description: string;
    programType: 'ONBOARDING' | 'LEADERSHIP' | 'TECHNICAL' | 'COMPLIANCE' | 'SOFT_SKILLS';
    status: CourseStatus;
    duration: number;
    startDate: Date;
    endDate: Date;
    capacity?: number;
    enrolledCount: number;
    waitlistedCount: number;
    courseIds: string[];
    requiredCompletionRate: number;
    coordinatorId: string;
    departmentId?: string;
    budget?: number;
    actualCost?: number;
    tags: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Course enrollment interface
 */
export interface CourseEnrollment {
    id: string;
    courseId: string;
    sessionId?: string;
    learningItemId: string;
    userId: string;
    enrollmentDate: Date;
    status: EnrollmentStatus;
    startDate?: Date;
    completionDate?: Date;
    dueDate?: Date;
    progress: number;
    attempts: number;
    lastAttemptDate?: Date;
    bestScore?: number;
    passingStatus?: 'passed' | 'failed' | 'pending';
    certificateIssued: boolean;
    certificateId?: string;
    enrolledBy: string;
    completedBy?: string;
    feedback?: string;
    rating?: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Training session interface (ILT/VILT)
 */
export interface TrainingSession {
    id: string;
    courseId: string;
    sessionCode: string;
    sessionName: string;
    deliveryMethod: DeliveryMethod;
    status: SessionStatus;
    startDateTime: Date;
    endDateTime: Date;
    duration: number;
    instructorId: string;
    coInstructorIds: string[];
    location?: string;
    virtualLink?: string;
    virtualPlatform?: string;
    capacity: number;
    enrolledCount: number;
    waitlistedCount: number;
    attendedCount: number;
    roomId?: string;
    facilityId?: string;
    equipmentRequired: string[];
    materialsRequired: string[];
    cost?: number;
    notes?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Learning path interface
 */
export interface LearningPath {
    id: string;
    pathCode: string;
    pathName: string;
    description: string;
    status: CourseStatus;
    items: Array<{
        itemId: string;
        itemType: LearningItemType;
        sequence: number;
        required: boolean;
    }>;
    totalDuration: number;
    totalCredits: number;
    targetRoles: string[];
    targetJobLevels: string[];
    completionCriteria: string;
    certificateAwarded: boolean;
    certificateTemplateId?: string;
    ownerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Certification interface
 */
export interface Certification {
    id: string;
    certificateNumber: string;
    certificateName: string;
    userId: string;
    courseId?: string;
    learningPathId?: string;
    issueDate: Date;
    expiryDate?: Date;
    status: CertificationStatus;
    score?: number;
    creditsEarned: number;
    certificateUrl?: string;
    verificationCode: string;
    issuedBy: string;
    accreditationBody?: string;
    renewalRequired: boolean;
    renewalPeriod?: number;
    lastRenewalDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Assessment interface
 */
export interface Assessment {
    id: string;
    assessmentCode: string;
    assessmentName: string;
    description: string;
    courseId?: string;
    type: 'QUIZ' | 'EXAM' | 'SURVEY' | 'EVALUATION' | 'PRE_TEST' | 'POST_TEST';
    totalQuestions: number;
    totalPoints: number;
    passingScore: number;
    duration?: number;
    maxAttempts: number;
    randomizeQuestions: boolean;
    showCorrectAnswers: boolean;
    showResultsImmediately: boolean;
    allowReview: boolean;
    questions: AssessmentQuestion[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Assessment question interface
 */
export interface AssessmentQuestion {
    id: string;
    assessmentId: string;
    questionType: QuestionType;
    questionText: string;
    points: number;
    sequence: number;
    options?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
    correctAnswer?: string;
    explanation?: string;
    metadata: Record<string, any>;
}
/**
 * Assessment attempt interface
 */
export interface AssessmentAttempt {
    id: string;
    assessmentId: string;
    userId: string;
    enrollmentId: string;
    attemptNumber: number;
    startTime: Date;
    endTime?: Date;
    status: AssessmentStatus;
    score?: number;
    percentage?: number;
    passed: boolean;
    answers: Array<{
        questionId: string;
        answer: any;
        isCorrect?: boolean;
        pointsAwarded: number;
    }>;
    timeTaken?: number;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Attendance record interface
 */
export interface AttendanceRecord {
    id: string;
    sessionId: string;
    enrollmentId: string;
    userId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    duration?: number;
    notes?: string;
    recordedBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Training feedback interface
 */
export interface TrainingFeedback {
    id: string;
    courseId: string;
    sessionId?: string;
    enrollmentId: string;
    userId: string;
    rating: number;
    contentRating?: number;
    instructorRating?: number;
    facilityRating?: number;
    relevanceRating?: number;
    comments?: string;
    wouldRecommend: boolean;
    strengths?: string;
    improvements?: string;
    submittedAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Learning analytics interface
 */
export interface LearningAnalytics {
    organizationId?: string;
    departmentId?: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalEnrollments: number;
    completedEnrollments: number;
    inProgressEnrollments: number;
    completionRate: number;
    averageCompletionTime: number;
    averageScore: number;
    totalHoursLearned: number;
    totalCertificatesIssued: number;
    complianceRate: number;
    topCourses: Array<{
        courseId: string;
        courseName: string;
        enrollments: number;
        completionRate: number;
    }>;
    topPerformers: Array<{
        userId: string;
        userName: string;
        completedCourses: number;
        certificatesEarned: number;
    }>;
    metadata: Record<string, any>;
}
/**
 * Create learning course DTO
 */
export declare class CreateLearningCourseDto {
    courseName: string;
    description: string;
    type: LearningItemType;
    deliveryMethod: DeliveryMethod;
    duration: number;
    credits: number;
    passingScore?: number;
    ownerId: string;
    isComplianceTraining?: boolean;
    complianceType?: ComplianceType;
    scormCompliant?: boolean;
    scormVersion?: ScormVersion;
    contentUrl?: string;
    language: string;
    targetAudience: string[];
    learningObjectives: string[];
}
/**
 * Create training program DTO
 */
export declare class CreateTrainingProgramDto {
    programName: string;
    description: string;
    programType: 'ONBOARDING' | 'LEADERSHIP' | 'TECHNICAL' | 'COMPLIANCE' | 'SOFT_SKILLS';
    startDate: Date;
    endDate: Date;
    capacity?: number;
    courseIds: string[];
    requiredCompletionRate: number;
    coordinatorId: string;
    budget?: number;
}
/**
 * Enroll user in course DTO
 */
export declare class EnrollUserDto {
    userId: string;
    courseId: string;
    sessionId?: string;
    dueDate?: Date;
    enrolledBy: string;
    autoEnrollFromWaitlist?: boolean;
}
/**
 * Create training session DTO
 */
export declare class CreateTrainingSessionDto {
    courseId: string;
    sessionName: string;
    deliveryMethod: DeliveryMethod;
    startDateTime: Date;
    endDateTime: Date;
    instructorId: string;
    coInstructorIds?: string[];
    location?: string;
    virtualLink?: string;
    virtualPlatform?: string;
    capacity: number;
}
/**
 * Create learning path DTO
 */
export declare class CreateLearningPathDto {
    pathName: string;
    description: string;
    targetRoles: string[];
    targetJobLevels: string[];
    certificateAwarded?: boolean;
    ownerId: string;
}
/**
 * Create assessment DTO
 */
export declare class CreateAssessmentDto {
    assessmentName: string;
    description: string;
    courseId?: string;
    type: 'QUIZ' | 'EXAM' | 'SURVEY' | 'EVALUATION' | 'PRE_TEST' | 'POST_TEST';
    passingScore: number;
    duration?: number;
    maxAttempts: number;
}
/**
 * Record attendance DTO
 */
export declare class RecordAttendanceDto {
    sessionId: string;
    userId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
}
/**
 * Submit training feedback DTO
 */
export declare class SubmitTrainingFeedbackDto {
    courseId: string;
    sessionId?: string;
    enrollmentId: string;
    rating: number;
    contentRating?: number;
    instructorRating?: number;
    comments?: string;
    wouldRecommend: boolean;
}
export declare const LearningCourseCreateSchema: any;
export declare const TrainingProgramCreateSchema: any;
export declare const EnrollUserSchema: any;
export declare const TrainingSessionCreateSchema: any;
export declare const LearningPathCreateSchema: any;
export declare const AssessmentCreateSchema: any;
export declare const AttendanceRecordSchema: any;
export declare const TrainingFeedbackSchema: any;
/**
 * Sequelize model for Learning Course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LearningCourse model
 *
 * @example
 * ```typescript
 * const LearningCourse = createLearningCourseModel(sequelize);
 * const course = await LearningCourse.create({
 *   courseName: 'Leadership Excellence',
 *   deliveryMethod: 'blended',
 *   duration: 480
 * });
 * ```
 */
export declare const createLearningCourseModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        courseCode: string;
        courseName: string;
        description: string;
        type: string;
        deliveryMethod: string;
        status: string;
        version: string;
        duration: number;
        credits: number;
        passingScore: number | null;
        maxAttempts: number | null;
        validityPeriod: number | null;
        ownerId: string;
        categoryId: string | null;
        competencyIds: string[];
        prerequisites: string[];
        tags: string[];
        isComplianceTraining: boolean;
        complianceType: string | null;
        scormCompliant: boolean;
        scormVersion: string | null;
        contentUrl: string | null;
        thumbnailUrl: string | null;
        language: string;
        targetAudience: string[];
        learningObjectives: string[];
        metadata: Record<string, any>;
        publishedAt: Date | null;
        retiredAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string | null;
    };
};
/**
 * Sequelize model for Training Program.
 */
export declare const createTrainingProgramModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        programCode: string;
        programName: string;
        description: string;
        programType: string;
        status: string;
        duration: number;
        startDate: Date;
        endDate: Date;
        capacity: number | null;
        enrolledCount: number;
        waitlistedCount: number;
        courseIds: string[];
        requiredCompletionRate: number;
        coordinatorId: string;
        departmentId: string | null;
        budget: number | null;
        actualCost: number | null;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Course Enrollment.
 */
export declare const createCourseEnrollmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        courseId: string;
        sessionId: string | null;
        learningItemId: string;
        userId: string;
        enrollmentDate: Date;
        status: string;
        startDate: Date | null;
        completionDate: Date | null;
        dueDate: Date | null;
        progress: number;
        attempts: number;
        lastAttemptDate: Date | null;
        bestScore: number | null;
        passingStatus: string | null;
        certificateIssued: boolean;
        certificateId: string | null;
        enrolledBy: string;
        completedBy: string | null;
        feedback: string | null;
        rating: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Training Session.
 */
export declare const createTrainingSessionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        courseId: string;
        sessionCode: string;
        sessionName: string;
        deliveryMethod: string;
        status: string;
        startDateTime: Date;
        endDateTime: Date;
        duration: number;
        instructorId: string;
        coInstructorIds: string[];
        location: string | null;
        virtualLink: string | null;
        virtualPlatform: string | null;
        capacity: number;
        enrolledCount: number;
        waitlistedCount: number;
        attendedCount: number;
        roomId: string | null;
        facilityId: string | null;
        equipmentRequired: string[];
        materialsRequired: string[];
        cost: number | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Certification.
 */
export declare const createCertificationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        certificateNumber: string;
        certificateName: string;
        userId: string;
        courseId: string | null;
        learningPathId: string | null;
        issueDate: Date;
        expiryDate: Date | null;
        status: string;
        score: number | null;
        creditsEarned: number;
        certificateUrl: string | null;
        verificationCode: string;
        issuedBy: string;
        accreditationBody: string | null;
        renewalRequired: boolean;
        renewalPeriod: number | null;
        lastRenewalDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new learning course with auto-generated course code.
 *
 * @param {object} courseData - Course creation data
 * @param {string} userId - User creating the course
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<LearningCourse>} Created course
 *
 * @example
 * ```typescript
 * const course = await createLearningCourse({
 *   courseName: 'Leadership Excellence Program',
 *   description: 'Comprehensive leadership training',
 *   deliveryMethod: DeliveryMethod.BLENDED,
 *   duration: 480,
 *   credits: 8,
 *   ownerId: 'user-123'
 * }, 'admin-456');
 * ```
 */
export declare const createLearningCourse: (courseData: Partial<LearningCourse>, userId: string, transaction?: Transaction) => Promise<LearningCourse>;
/**
 * Publishes a course, making it available for enrollment.
 *
 * @param {string} courseId - Course ID to publish
 * @param {string} userId - User publishing the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export declare const publishCourse: (courseId: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningCourse>>;
/**
 * Archives a course, removing it from active catalog.
 *
 * @param {string} courseId - Course ID to archive
 * @param {string} userId - User archiving the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export declare const archiveCourse: (courseId: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningCourse>>;
/**
 * Retires a course, preventing new enrollments.
 *
 * @param {string} courseId - Course ID to retire
 * @param {string} userId - User retiring the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export declare const retireCourse: (courseId: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningCourse>>;
/**
 * Versions a course, creating a new version.
 *
 * @param {string} courseId - Original course ID
 * @param {string} newVersion - New version number
 * @param {string} userId - User creating new version
 * @returns {Promise<LearningCourse>} New course version
 */
export declare const versionCourse: (courseId: string, newVersion: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningCourse>>;
/**
 * Searches courses by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningCourse[]>} Matching courses
 */
export declare const searchCourses: (filters: {
    query?: string;
    type?: LearningItemType;
    deliveryMethod?: DeliveryMethod;
    status?: CourseStatus;
    isComplianceTraining?: boolean;
    categoryId?: string;
    tags?: string[];
    language?: string;
    limit?: number;
    offset?: number;
}) => Promise<{
    courses: LearningCourse[];
    total: number;
}>;
/**
 * Gets course details by ID.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<LearningCourse>} Course details
 */
export declare const getCourseById: (courseId: string) => Promise<LearningCourse | null>;
/**
 * Updates course content and metadata.
 *
 * @param {string} courseId - Course ID
 * @param {object} updates - Course updates
 * @param {string} userId - User updating the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export declare const updateCourse: (courseId: string, updates: Partial<LearningCourse>, userId: string, transaction?: Transaction) => Promise<Partial<LearningCourse>>;
/**
 * Creates a new training program.
 *
 * @param {object} programData - Program creation data
 * @param {string} userId - User creating the program
 * @returns {Promise<TrainingProgram>} Created program
 */
export declare const createTrainingProgram: (programData: Partial<TrainingProgram>, userId: string, transaction?: Transaction) => Promise<TrainingProgram>;
/**
 * Adds courses to a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to add
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export declare const addCoursesToProgram: (programId: string, courseIds: string[], userId: string, transaction?: Transaction) => Promise<Partial<TrainingProgram>>;
/**
 * Removes courses from a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to remove
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export declare const removeCoursesFromProgram: (programId: string, courseIds: string[], userId: string, transaction?: Transaction) => Promise<Partial<TrainingProgram>>;
/**
 * Publishes a training program.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User publishing the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export declare const publishProgram: (programId: string, userId: string, transaction?: Transaction) => Promise<Partial<TrainingProgram>>;
/**
 * Calculates program completion for a user.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Completion statistics
 */
export declare const calculateProgramCompletion: (programId: string, userId: string) => Promise<{
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    completionPercentage: number;
    isProgramCompleted: boolean;
}>;
/**
 * Gets program enrollment statistics.
 *
 * @param {string} programId - Program ID
 * @returns {Promise<object>} Enrollment statistics
 */
export declare const getProgramEnrollmentStats: (programId: string) => Promise<{
    enrolledCount: number;
    waitlistedCount: number;
    completedCount: number;
    averageProgress: number;
    averageCompletionTime: number;
}>;
/**
 * Enrolls a user in a course.
 *
 * @param {object} enrollmentData - Enrollment data
 * @param {string} enrolledByUserId - User performing enrollment
 * @returns {Promise<CourseEnrollment>} Created enrollment
 */
export declare const enrollUserInCourse: (enrollmentData: {
    userId: string;
    courseId: string;
    sessionId?: string;
    dueDate?: Date;
    autoEnrollFromWaitlist?: boolean;
}, enrolledByUserId: string, transaction?: Transaction) => Promise<CourseEnrollment>;
/**
 * Adds a user to course waitlist.
 *
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} sessionId - Session ID
 * @param {string} enrolledByUserId - User adding to waitlist
 * @returns {Promise<CourseEnrollment>} Waitlist enrollment
 */
export declare const addToWaitlist: (userId: string, courseId: string, sessionId: string, enrolledByUserId: string, transaction?: Transaction) => Promise<CourseEnrollment>;
/**
 * Removes user from waitlist and enrolls them.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User processing enrollment
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export declare const enrollFromWaitlist: (enrollmentId: string, userId: string, transaction?: Transaction) => Promise<Partial<CourseEnrollment>>;
/**
 * Cancels an enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User canceling enrollment
 * @param {string} reason - Cancellation reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export declare const cancelEnrollment: (enrollmentId: string, userId: string, reason?: string, transaction?: Transaction) => Promise<Partial<CourseEnrollment>>;
/**
 * Withdraws a user from a course.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User withdrawing
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export declare const withdrawFromCourse: (enrollmentId: string, userId: string, reason?: string, transaction?: Transaction) => Promise<Partial<CourseEnrollment>>;
/**
 * Bulk enrolls users in a course.
 *
 * @param {string} courseId - Course ID
 * @param {string[]} userIds - User IDs to enroll
 * @param {string} enrolledByUserId - User performing bulk enrollment
 * @returns {Promise<CourseEnrollment[]>} Created enrollments
 */
export declare const bulkEnrollUsers: (courseId: string, userIds: string[], enrolledByUserId: string, options?: {
    sessionId?: string;
    dueDate?: Date;
}, transaction?: Transaction) => Promise<CourseEnrollment[]>;
/**
 * Gets user enrollments with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<CourseEnrollment[]>} User enrollments
 */
export declare const getUserEnrollments: (userId: string, filters?: {
    status?: EnrollmentStatus;
    courseId?: string;
    startDate?: Date;
    endDate?: Date;
}) => Promise<CourseEnrollment[]>;
/**
 * Gets course enrollment statistics.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Enrollment statistics
 */
export declare const getCourseEnrollmentStats: (courseId: string) => Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    waitlistedCount: number;
    completionRate: number;
    averageProgress: number;
    averageScore: number;
}>;
/**
 * Creates a new training session (ILT/VILT).
 *
 * @param {object} sessionData - Session creation data
 * @param {string} userId - User creating the session
 * @returns {Promise<TrainingSession>} Created session
 */
export declare const createTrainingSession: (sessionData: Partial<TrainingSession>, userId: string, transaction?: Transaction) => Promise<TrainingSession>;
/**
 * Updates a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {object} updates - Session updates
 * @param {string} userId - User updating the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export declare const updateTrainingSession: (sessionId: string, updates: Partial<TrainingSession>, userId: string, transaction?: Transaction) => Promise<Partial<TrainingSession>>;
/**
 * Cancels a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User canceling the session
 * @param {string} reason - Cancellation reason
 * @returns {Promise<TrainingSession>} Updated session
 */
export declare const cancelTrainingSession: (sessionId: string, userId: string, reason: string, transaction?: Transaction) => Promise<Partial<TrainingSession>>;
/**
 * Reschedules a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {Date} newStartDateTime - New start date/time
 * @param {Date} newEndDateTime - New end date/time
 * @param {string} userId - User rescheduling
 * @returns {Promise<TrainingSession>} Updated session
 */
export declare const rescheduleTrainingSession: (sessionId: string, newStartDateTime: Date, newEndDateTime: Date, userId: string, transaction?: Transaction) => Promise<Partial<TrainingSession>>;
/**
 * Starts a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User starting the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export declare const startTrainingSession: (sessionId: string, userId: string, transaction?: Transaction) => Promise<Partial<TrainingSession>>;
/**
 * Completes a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User completing the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export declare const completeTrainingSession: (sessionId: string, userId: string, transaction?: Transaction) => Promise<Partial<TrainingSession>>;
/**
 * Creates a new learning path.
 *
 * @param {object} pathData - Learning path creation data
 * @param {string} userId - User creating the path
 * @returns {Promise<LearningPath>} Created learning path
 */
export declare const createLearningPath: (pathData: Partial<LearningPath>, userId: string, transaction?: Transaction) => Promise<LearningPath>;
/**
 * Adds items to a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {array} items - Items to add
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export declare const addItemsToLearningPath: (pathId: string, items: Array<{
    itemId: string;
    itemType: LearningItemType;
    sequence: number;
    required: boolean;
}>, userId: string, transaction?: Transaction) => Promise<Partial<LearningPath>>;
/**
 * Removes items from a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string[]} itemIds - Item IDs to remove
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export declare const removeItemsFromLearningPath: (pathId: string, itemIds: string[], userId: string, transaction?: Transaction) => Promise<Partial<LearningPath>>;
/**
 * Calculates learning path progress for a user.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Progress statistics
 */
export declare const calculateLearningPathProgress: (pathId: string, userId: string) => Promise<{
    totalItems: number;
    completedItems: number;
    requiredItems: number;
    completedRequiredItems: number;
    progressPercentage: number;
    isCompleted: boolean;
}>;
/**
 * Publishes a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User publishing the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export declare const publishLearningPath: (pathId: string, userId: string, transaction?: Transaction) => Promise<Partial<LearningPath>>;
/**
 * Issues a certificate to a user.
 *
 * @param {object} certData - Certificate data
 * @param {string} issuedByUserId - User issuing the certificate
 * @returns {Promise<Certification>} Created certificate
 */
export declare const issueCertificate: (certData: {
    userId: string;
    certificateName: string;
    courseId?: string;
    learningPathId?: string;
    score?: number;
    creditsEarned: number;
    expiryDate?: Date;
    renewalRequired?: boolean;
    renewalPeriod?: number;
    accreditationBody?: string;
}, issuedByUserId: string, transaction?: Transaction) => Promise<Certification>;
/**
 * Verifies a certificate by verification code.
 *
 * @param {string} verificationCode - Verification code
 * @returns {Promise<Certification>} Certificate details if valid
 */
export declare const verifyCertificate: (verificationCode: string) => Promise<Certification | null>;
/**
 * Revokes a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {string} userId - User revoking the certificate
 * @param {string} reason - Revocation reason
 * @returns {Promise<Certification>} Updated certificate
 */
export declare const revokeCertificate: (certificateId: string, userId: string, reason: string, transaction?: Transaction) => Promise<Partial<Certification>>;
/**
 * Renews a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {number} renewalMonths - Renewal period in months
 * @param {string} userId - User renewing the certificate
 * @returns {Promise<Certification>} Updated certificate
 */
export declare const renewCertificate: (certificateId: string, renewalMonths: number, userId: string, transaction?: Transaction) => Promise<Partial<Certification>>;
/**
 * Gets user certificates.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Certification[]>} User certificates
 */
export declare const getUserCertificates: (userId: string, filters?: {
    status?: CertificationStatus;
    expiringWithinDays?: number;
}) => Promise<Certification[]>;
/**
 * Records attendance for a training session.
 *
 * @param {object} attendanceData - Attendance data
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord>} Created attendance record
 */
export declare const recordAttendance: (attendanceData: {
    sessionId: string;
    enrollmentId: string;
    userId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
}, recordedByUserId: string, transaction?: Transaction) => Promise<AttendanceRecord>;
/**
 * Bulk records attendance for multiple users.
 *
 * @param {string} sessionId - Session ID
 * @param {array} attendances - Attendance records
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord[]>} Created attendance records
 */
export declare const bulkRecordAttendance: (sessionId: string, attendances: Array<{
    userId: string;
    enrollmentId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
}>, recordedByUserId: string, transaction?: Transaction) => Promise<AttendanceRecord[]>;
/**
 * Marks course enrollment as completed.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User marking completion
 * @param {object} completionData - Completion data
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export declare const markEnrollmentCompleted: (enrollmentId: string, userId: string, completionData: {
    score?: number;
    passed: boolean;
    certificateIssued?: boolean;
    certificateId?: string;
}, transaction?: Transaction) => Promise<Partial<CourseEnrollment>>;
/**
 * Updates course progress for a user.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {number} progress - Progress percentage
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export declare const updateCourseProgress: (enrollmentId: string, progress: number, transaction?: Transaction) => Promise<Partial<CourseEnrollment>>;
/**
 * Creates a new assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating the assessment
 * @returns {Promise<Assessment>} Created assessment
 */
export declare const createAssessment: (assessmentData: Partial<Assessment>, userId: string, transaction?: Transaction) => Promise<Assessment>;
/**
 * Starts an assessment attempt.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User taking assessment
 * @param {string} enrollmentId - Enrollment ID
 * @returns {Promise<AssessmentAttempt>} Created attempt
 */
export declare const startAssessmentAttempt: (assessmentId: string, userId: string, enrollmentId: string, transaction?: Transaction) => Promise<AssessmentAttempt>;
/**
 * Submits an assessment attempt.
 *
 * @param {string} attemptId - Attempt ID
 * @param {array} answers - User answers
 * @returns {Promise<AssessmentAttempt>} Graded attempt
 */
export declare const submitAssessmentAttempt: (attemptId: string, answers: Array<{
    questionId: string;
    answer: any;
}>, transaction?: Transaction) => Promise<Partial<AssessmentAttempt>>;
/**
 * Gets assessment attempts for a user.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User ID
 * @returns {Promise<AssessmentAttempt[]>} Assessment attempts
 */
export declare const getUserAssessmentAttempts: (assessmentId: string, userId: string) => Promise<AssessmentAttempt[]>;
/**
 * Submits training feedback.
 *
 * @param {object} feedbackData - Feedback data
 * @param {string} userId - User submitting feedback
 * @returns {Promise<TrainingFeedback>} Created feedback
 */
export declare const submitTrainingFeedback: (feedbackData: {
    courseId: string;
    sessionId?: string;
    enrollmentId: string;
    rating: number;
    contentRating?: number;
    instructorRating?: number;
    facilityRating?: number;
    relevanceRating?: number;
    comments?: string;
    wouldRecommend: boolean;
    strengths?: string;
    improvements?: string;
}, userId: string, transaction?: Transaction) => Promise<TrainingFeedback>;
/**
 * Gets course feedback summary.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Feedback summary
 */
export declare const getCourseFeedbackSummary: (courseId: string) => Promise<{
    totalResponses: number;
    averageRating: number;
    averageContentRating: number;
    averageInstructorRating: number;
    recommendationRate: number;
    commonStrengths: string[];
    commonImprovements: string[];
}>;
/**
 * Gets comprehensive learning analytics.
 *
 * @param {object} filters - Analytics filters
 * @returns {Promise<LearningAnalytics>} Learning analytics
 */
export declare const getLearningAnalytics: (filters: {
    organizationId?: string;
    departmentId?: string;
    startDate: Date;
    endDate: Date;
    courseIds?: string[];
    userIds?: string[];
}) => Promise<LearningAnalytics>;
/**
 * Generates learning transcript for a user.
 *
 * @param {string} userId - User ID
 * @param {object} options - Transcript options
 * @returns {Promise<object>} Learning transcript
 */
export declare const generateLearningTranscript: (userId: string, options?: {
    includeInProgress?: boolean;
    startDate?: Date;
    endDate?: Date;
}) => Promise<{
    userId: string;
    userName: string;
    totalCoursesCompleted: number;
    totalCreditsEarned: number;
    totalHoursLearned: number;
    certificates: Certification[];
    courseHistory: Array<{
        courseId: string;
        courseName: string;
        completionDate?: Date;
        status: EnrollmentStatus;
        score?: number;
        creditsEarned: number;
    }>;
    generatedAt: Date;
}>;
/**
 * Example NestJS Controller for Learning Management
 */
export declare class LearningManagementController {
    createCourse(dto: CreateLearningCourseDto): Promise<LearningCourse>;
    publishCourseEndpoint(courseId: string): Promise<Partial<LearningCourse>>;
    enrollUser(dto: EnrollUserDto): Promise<CourseEnrollment>;
    createSession(dto: CreateTrainingSessionDto): Promise<TrainingSession>;
    recordSessionAttendance(dto: RecordAttendanceDto): Promise<AttendanceRecord>;
    issueCert(certData: any): Promise<Certification>;
    getAnalytics(startDate: string, endDate: string): Promise<LearningAnalytics>;
    getTranscript(userId: string): Promise<{
        userId: string;
        userName: string;
        totalCoursesCompleted: number;
        totalCreditsEarned: number;
        totalHoursLearned: number;
        certificates: Certification[];
        courseHistory: Array<{
            courseId: string;
            courseName: string;
            completionDate?: Date;
            status: EnrollmentStatus;
            score?: number;
            creditsEarned: number;
        }>;
        generatedAt: Date;
    }>;
}
//# sourceMappingURL=learning-management-kit.d.ts.map