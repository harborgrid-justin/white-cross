/**
 * LOC: EDU-ENROLL-001
 * File: /reuse/education/student-enrollment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Student information services
 *   - Registration services
 *   - Academic advising modules
 */
/**
 * File: /reuse/education/student-enrollment-kit.ts
 * Locator: WC-EDU-ENROLL-001
 * Purpose: Comprehensive Student Enrollment Management - Ellucian SIS-level enrollment processing, verification, capacity management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Student Services, Registration, Academic Advising
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for enrollment management, verification, transfer/international students, holds, capacity, waitlist, fees
 *
 * LLM Context: Enterprise-grade student enrollment management for higher education SIS.
 * Provides comprehensive enrollment processing, enrollment verification, transfer student handling,
 * international student enrollment, enrollment holds and restrictions, capacity management,
 * waitlist processing, enrollment fee calculation, SEVIS compliance, enrollment status tracking,
 * and full integration with academic calendar and course registration systems.
 */
import { Sequelize, Transaction } from 'sequelize';
interface EnrollmentMetrics {
    totalEnrollment: number;
    fullTimeCount: number;
    partTimeCount: number;
    newStudentsCount: number;
    returningStudentsCount: number;
    transferStudentsCount: number;
    internationalStudentsCount: number;
}
interface EnrollmentVerification {
    studentId: number;
    enrollmentId: number;
    verificationDate: Date;
    verificationType: 'full-time' | 'part-time' | 'graduated' | 'withdrawn' | 'on-leave';
    creditsEnrolled: number;
    verifiedBy: string;
    verificationDocument: string;
    expirationDate: Date;
}
interface TransferCredit {
    studentId: number;
    institutionName: string;
    institutionCode: string;
    courseTitle: string;
    courseNumber: string;
    credits: number;
    grade: string;
    transferStatus: 'pending' | 'approved' | 'denied' | 'in-review';
    equivalentCourseId?: number;
    evaluatedBy?: string;
    evaluationDate?: Date;
}
interface InternationalStudentData {
    studentId: number;
    sevisId: string;
    visaType: string;
    visaExpirationDate: Date;
    i20IssueDate: Date;
    programStartDate: Date;
    programEndDate: Date;
    fullTimeRequirement: number;
    countryOfOrigin: string;
    sponsorName?: string;
    financialDocumentDate: Date;
}
interface EnrollmentHold {
    holdId: string;
    studentId: number;
    holdType: 'financial' | 'academic' | 'disciplinary' | 'administrative' | 'medical' | 'immunization';
    holdReason: string;
    placedBy: string;
    placedDate: Date;
    releasedBy?: string;
    releasedDate?: Date;
    isActive: boolean;
    blockEnrollment: boolean;
    blockTranscripts: boolean;
    blockGraduation: boolean;
}
interface EnrollmentCapacity {
    courseId: number;
    sectionId: number;
    termId: number;
    maxCapacity: number;
    currentEnrollment: number;
    waitlistCapacity: number;
    currentWaitlist: number;
    reservedSeats: number;
    availableSeats: number;
}
interface WaitlistEntry {
    waitlistId: number;
    studentId: number;
    courseId: number;
    sectionId: number;
    termId: number;
    position: number;
    addedDate: Date;
    notifiedDate?: Date;
    expirationDate: Date;
    status: 'active' | 'notified' | 'enrolled' | 'expired' | 'cancelled';
}
interface EnrollmentFee {
    feeId: string;
    studentId: number;
    termId: number;
    feeType: 'tuition' | 'technology' | 'lab' | 'course' | 'activity' | 'health' | 'parking';
    feeAmount: number;
    credits: number;
    feePerCredit?: number;
    dueDate: Date;
    paidAmount: number;
    isPaid: boolean;
    paymentDate?: Date;
}
interface EnrollmentRestriction {
    restrictionId: string;
    studentId: number;
    restrictionType: string;
    restrictionReason: string;
    effectiveDate: Date;
    expirationDate?: Date;
    isActive: boolean;
    allowedOverride: boolean;
}
export declare class CreateStudentDto {
    studentNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    dateOfBirth: Date;
    admissionDate: Date;
    studentType: string;
    academicLevel: string;
}
export declare class CreateEnrollmentDto {
    studentId: number;
    courseId: number;
    sectionId: number;
    termId: number;
    enrollmentDate: Date;
    enrollmentStatus: string;
    credits: number;
    gradingOption: string;
}
export declare class EnrollmentVerificationDto {
    studentId: number;
    verificationType: string;
    termId: number;
    creditsEnrolled: number;
}
export declare class TransferCreditDto {
    studentId: number;
    institutionName: string;
    courseTitle: string;
    credits: number;
    grade: string;
}
/**
 * Sequelize model for Student with comprehensive academic tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Student model
 *
 * @example
 * ```typescript
 * const Student = createStudentModel(sequelize);
 * const student = await Student.create({
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * });
 * ```
 */
export declare const createStudentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        preferredName: string | null;
        email: string;
        alternateEmail: string | null;
        dateOfBirth: Date;
        ssn: string | null;
        gender: string | null;
        ethnicity: string | null;
        citizenship: string;
        admissionDate: Date;
        studentType: string;
        academicLevel: string;
        majorId: number | null;
        minorId: number | null;
        advisorId: number | null;
        enrollmentStatus: string;
        gpa: number;
        creditsEarned: number;
        creditsAttempted: number;
        expectedGraduationDate: Date | null;
        actualGraduationDate: Date | null;
        isInternational: boolean;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Enrollment with status tracking and capacity management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Enrollment model
 *
 * @example
 * ```typescript
 * const Enrollment = createEnrollmentModel(sequelize);
 * const enrollment = await Enrollment.create({
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3
 * });
 * ```
 */
export declare const createEnrollmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        courseId: number;
        sectionId: number;
        termId: number;
        enrollmentDate: Date;
        enrollmentStatus: string;
        credits: number;
        gradingOption: string;
        grade: string | null;
        gradePoints: number | null;
        midtermGrade: string | null;
        attendancePercentage: number;
        dropDate: Date | null;
        withdrawalDate: Date | null;
        withdrawalReason: string | null;
        lastAttendanceDate: Date | null;
        isAudit: boolean;
        repeatCourse: boolean;
        repeatCount: number;
        tuitionCharged: number;
        feesPaid: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly enrolledBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for EnrollmentStatus tracking and history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EnrollmentStatus model
 */
export declare const createEnrollmentStatusModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        termId: number;
        statusType: string;
        statusDate: Date;
        fullTimeStatus: boolean;
        creditsEnrolled: number;
        effectiveDate: Date;
        endDate: Date | null;
        verifiedBy: string | null;
        verificationDate: Date | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new student record in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateStudentDto} studentData - Student creation data
 * @param {string} userId - User creating the student
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created student
 *
 * @example
 * ```typescript
 * const student = await createStudent(sequelize, {
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   dateOfBirth: new Date('2000-01-15'),
 *   admissionDate: new Date(),
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * }, 'admin123');
 * ```
 */
export declare const createStudent: (sequelize: Sequelize, studentData: CreateStudentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Enrolls a student in a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEnrollmentDto} enrollmentData - Enrollment data
 * @param {string} userId - User creating the enrollment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollStudentInCourse(sequelize, {
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3,
 *   gradingOption: 'letter'
 * }, 'registrar123');
 * ```
 */
export declare const enrollStudentInCourse: (sequelize: Sequelize, enrollmentData: CreateEnrollmentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Drops a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} userId - User dropping the course
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropCourse(sequelize, 123, 'student123');
 * ```
 */
export declare const dropCourse: (sequelize: Sequelize, enrollmentId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Withdraws a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} reason - Withdrawal reason
 * @param {string} userId - User processing withdrawal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await withdrawFromCourse(sequelize, 123, 'Medical reasons', 'advisor123');
 * ```
 */
export declare const withdrawFromCourse: (sequelize: Sequelize, enrollmentId: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves all enrollments for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any[]>} Array of enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await getStudentEnrollments(sequelize, 1, 202401);
 * ```
 */
export declare const getStudentEnrollments: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any[]>;
/**
 * Calculates total credits enrolled for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Total credits enrolled
 *
 * @example
 * ```typescript
 * const credits = await calculateEnrolledCredits(sequelize, 1, 202401);
 * ```
 */
export declare const calculateEnrolledCredits: (sequelize: Sequelize, studentId: number, termId: number) => Promise<number>;
/**
 * Determines if student is full-time based on credits enrolled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} fullTimeThreshold - Full-time credit threshold (default 12)
 * @returns {Promise<boolean>} Whether student is full-time
 *
 * @example
 * ```typescript
 * const isFullTime = await isFullTimeStudent(sequelize, 1, 202401, 12);
 * ```
 */
export declare const isFullTimeStudent: (sequelize: Sequelize, studentId: number, termId: number, fullTimeThreshold?: number) => Promise<boolean>;
/**
 * Updates student academic level based on credits earned.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} userId - User updating the level
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} New academic level
 *
 * @example
 * ```typescript
 * const newLevel = await updateAcademicLevel(sequelize, 1, 'registrar123');
 * ```
 */
export declare const updateAcademicLevel: (sequelize: Sequelize, studentId: number, userId: string, transaction?: Transaction) => Promise<string>;
/**
 * Retrieves enrollment metrics for a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentMetrics>} Enrollment metrics
 *
 * @example
 * ```typescript
 * const metrics = await getEnrollmentMetrics(sequelize, 202401);
 * ```
 */
export declare const getEnrollmentMetrics: (sequelize: Sequelize, termId: number) => Promise<EnrollmentMetrics>;
/**
 * Changes grading option for an enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} newGradingOption - New grading option
 * @param {string} userId - User making the change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeGradingOption(sequelize, 123, 'pass-fail', 'student123');
 * ```
 */
export declare const changeGradingOption: (sequelize: Sequelize, enrollmentId: number, newGradingOption: "letter" | "pass-fail" | "audit" | "credit-no-credit", userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates enrollment verification record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentVerification} verificationData - Verification data
 * @param {string} userId - User creating verification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Verification record
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerification(sequelize, {
 *   studentId: 1,
 *   enrollmentId: 123,
 *   verificationDate: new Date(),
 *   verificationType: 'full-time',
 *   creditsEnrolled: 15,
 *   verifiedBy: 'registrar123',
 *   verificationDocument: 'DOC-2024-001',
 *   expirationDate: new Date('2024-12-31')
 * }, 'registrar123');
 * ```
 */
export declare const createEnrollmentVerification: (sequelize: Sequelize, verificationData: EnrollmentVerification, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Verifies student enrollment status for external requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Verification details
 *
 * @example
 * ```typescript
 * const verification = await verifyEnrollmentStatus(sequelize, 1, 202401);
 * ```
 */
export declare const verifyEnrollmentStatus: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any>;
/**
 * Generates enrollment verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} purpose - Purpose of verification
 * @returns {Promise<any>} Verification letter data
 *
 * @example
 * ```typescript
 * const letter = await generateVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
export declare const generateVerificationLetter: (sequelize: Sequelize, studentId: number, termId: number, purpose: string) => Promise<any>;
/**
 * Validates enrollment for financial aid eligibility.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ eligible: boolean; reason?: string }>} Eligibility status
 *
 * @example
 * ```typescript
 * const eligibility = await validateFinancialAidEligibility(sequelize, 1, 202401);
 * ```
 */
export declare const validateFinancialAidEligibility: (sequelize: Sequelize, studentId: number, termId: number) => Promise<{
    eligible: boolean;
    reason?: string;
}>;
/**
 * Checks enrollment compliance for international students (SEVIS).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkInternationalStudentCompliance(sequelize, 1, 202401);
 * ```
 */
export declare const checkInternationalStudentCompliance: (sequelize: Sequelize, studentId: number, termId: number) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Creates transfer credit record for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransferCredit} transferData - Transfer credit data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer credit record
 *
 * @example
 * ```typescript
 * const transfer = await createTransferCredit(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionCode: 'PREV-001',
 *   courseTitle: 'Introduction to Psychology',
 *   courseNumber: 'PSY-101',
 *   credits: 3,
 *   grade: 'B',
 *   transferStatus: 'pending'
 * }, 'registrar123');
 * ```
 */
export declare const createTransferCredit: (sequelize: Sequelize, transferData: TransferCredit, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Evaluates and approves transfer credits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferCreditId - Transfer credit ID
 * @param {number} equivalentCourseId - Equivalent course ID
 * @param {string} userId - User approving transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await evaluateTransferCredit(sequelize, 1, 101, 'evaluator123');
 * ```
 */
export declare const evaluateTransferCredit: (sequelize: Sequelize, transferCreditId: number, equivalentCourseId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates international student record with SEVIS information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {InternationalStudentData} internationalData - International student data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} International student record
 *
 * @example
 * ```typescript
 * const intlStudent = await createInternationalStudentRecord(sequelize, {
 *   studentId: 1,
 *   sevisId: 'N0012345678',
 *   visaType: 'F-1',
 *   visaExpirationDate: new Date('2025-12-31'),
 *   i20IssueDate: new Date(),
 *   programStartDate: new Date('2024-08-15'),
 *   programEndDate: new Date('2028-05-15'),
 *   fullTimeRequirement: 12,
 *   countryOfOrigin: 'China',
 *   financialDocumentDate: new Date()
 * }, 'iso123');
 * ```
 */
export declare const createInternationalStudentRecord: (sequelize: Sequelize, internationalData: InternationalStudentData, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates SEVIS status for international student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} sevisStatus - New SEVIS status
 * @param {string} userId - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSEVISStatus(sequelize, 1, 'Active', 'iso123');
 * ```
 */
export declare const updateSEVISStatus: (sequelize: Sequelize, studentId: number, sevisStatus: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Validates transfer student articulation agreements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} institutionCode - Institution code
 * @param {string} courseNumber - Course number
 * @returns {Promise<{ hasAgreement: boolean; equivalentCourse?: any }>} Articulation validation
 *
 * @example
 * ```typescript
 * const validation = await validateArticulationAgreement(sequelize, 'PREV-001', 'PSY-101');
 * ```
 */
export declare const validateArticulationAgreement: (sequelize: Sequelize, institutionCode: string, courseNumber: string) => Promise<{
    hasAgreement: boolean;
    equivalentCourse?: any;
}>;
/**
 * Places enrollment hold on student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeEnrollmentHold(sequelize, {
 *   holdId: 'HOLD-2024-001',
 *   studentId: 1,
 *   holdType: 'financial',
 *   holdReason: 'Unpaid tuition balance',
 *   placedBy: 'bursar123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   blockEnrollment: true,
 *   blockTranscripts: true,
 *   blockGraduation: false
 * }, 'bursar123');
 * ```
 */
export declare const placeEnrollmentHold: (sequelize: Sequelize, holdData: EnrollmentHold, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases enrollment hold from student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseEnrollmentHold(sequelize, 'HOLD-2024-001', 'bursar123');
 * ```
 */
export declare const releaseEnrollmentHold: (sequelize: Sequelize, holdId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Checks if student has any active enrollment holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkEnrollmentHolds(sequelize, 1);
 * ```
 */
export declare const checkEnrollmentHolds: (sequelize: Sequelize, studentId: number) => Promise<{
    hasHolds: boolean;
    holds: any[];
}>;
/**
 * Creates enrollment restriction for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentRestriction} restrictionData - Restriction data
 * @param {string} userId - User creating restriction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Restriction record
 *
 * @example
 * ```typescript
 * const restriction = await createEnrollmentRestriction(sequelize, {
 *   restrictionId: 'REST-2024-001',
 *   studentId: 1,
 *   restrictionType: 'probation',
 *   restrictionReason: 'Academic probation - GPA below 2.0',
 *   effectiveDate: new Date(),
 *   isActive: true,
 *   allowedOverride: false
 * }, 'dean123');
 * ```
 */
export declare const createEnrollmentRestriction: (sequelize: Sequelize, restrictionData: EnrollmentRestriction, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates enrollment permissions before registration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ canEnroll: boolean; blocks: string[] }>} Enrollment permission status
 *
 * @example
 * ```typescript
 * const permission = await validateEnrollmentPermission(sequelize, 1);
 * ```
 */
export declare const validateEnrollmentPermission: (sequelize: Sequelize, studentId: number) => Promise<{
    canEnroll: boolean;
    blocks: string[];
}>;
/**
 * Checks enrollment capacity for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ hasCapacity: boolean; capacity: EnrollmentCapacity }>} Capacity status
 *
 * @example
 * ```typescript
 * const capacity = await checkEnrollmentCapacity(sequelize, 101, 1, 202401);
 * ```
 */
export declare const checkEnrollmentCapacity: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number) => Promise<{
    hasCapacity: boolean;
    capacity: EnrollmentCapacity;
}>;
/**
 * Adds student to course waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {string} userId - User adding to waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry>} Waitlist entry
 *
 * @example
 * ```typescript
 * const waitlistEntry = await addToWaitlist(sequelize, 1, 101, 1, 202401, 'student123');
 * ```
 */
export declare const addToWaitlist: (sequelize: Sequelize, studentId: number, courseId: number, sectionId: number, termId: number, userId: string, transaction?: Transaction) => Promise<WaitlistEntry>;
/**
 * Removes student from waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} waitlistId - Waitlist entry ID
 * @param {string} userId - User removing from waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFromWaitlist(sequelize, 123, 'student123');
 * ```
 */
export declare const removeFromWaitlist: (sequelize: Sequelize, waitlistId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Processes waitlist when seat becomes available.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry | null>} Next waitlist entry or null
 *
 * @example
 * ```typescript
 * const nextStudent = await processWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
export declare const processWaitlist: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number, transaction?: Transaction) => Promise<WaitlistEntry | null>;
/**
 * Gets waitlist position for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<number | null>} Waitlist position or null
 *
 * @example
 * ```typescript
 * const position = await getWaitlistPosition(sequelize, 1, 101, 1, 202401);
 * ```
 */
export declare const getWaitlistPosition: (sequelize: Sequelize, studentId: number, courseId: number, sectionId: number, termId: number) => Promise<number | null>;
/**
 * Reorders waitlist positions after removal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
export declare const reorderWaitlist: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number, transaction?: Transaction) => Promise<void>;
/**
 * Expires old waitlist entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of expired entries
 *
 * @example
 * ```typescript
 * const expired = await expireWaitlistEntries(sequelize);
 * ```
 */
export declare const expireWaitlistEntries: (sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
/**
 * Sets reserved seats for course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {number} reservedCount - Number of reserved seats
 * @param {string} reservedFor - Who seats are reserved for
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setReservedSeats(sequelize, 1, 5, 'Honors Program Students');
 * ```
 */
export declare const setReservedSeats: (sequelize: Sequelize, sectionId: number, reservedCount: number, reservedFor: string, transaction?: Transaction) => Promise<void>;
/**
 * Releases reserved seats.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseReservedSeats(sequelize, 1);
 * ```
 */
export declare const releaseReservedSeats: (sequelize: Sequelize, sectionId: number, transaction?: Transaction) => Promise<void>;
/**
 * Gets enrollment statistics for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Enrollment statistics
 *
 * @example
 * ```typescript
 * const stats = await getSectionEnrollmentStats(sequelize, 101, 1, 202401);
 * ```
 */
export declare const getSectionEnrollmentStats: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number) => Promise<any>;
/**
 * Calculates enrollment fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentFee[]>} Calculated fees
 *
 * @example
 * ```typescript
 * const fees = await calculateEnrollmentFees(sequelize, 1, 202401);
 * ```
 */
export declare const calculateEnrollmentFees: (sequelize: Sequelize, studentId: number, termId: number) => Promise<EnrollmentFee[]>;
/**
 * Creates fee assessment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentFee} feeData - Fee data
 * @param {string} userId - User creating assessment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Fee assessment record
 *
 * @example
 * ```typescript
 * const assessment = await createFeeAssessment(sequelize, {
 *   feeId: 'TUI-202401-1',
 *   studentId: 1,
 *   termId: 202401,
 *   feeType: 'tuition',
 *   feeAmount: 6000,
 *   credits: 12,
 *   dueDate: new Date(),
 *   paidAmount: 0,
 *   isPaid: false
 * }, 'bursar123');
 * ```
 */
export declare const createFeeAssessment: (sequelize: Sequelize, feeData: EnrollmentFee, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes fee payment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processFeePayment(sequelize, 'TUI-202401-1', 6000, 'bursar123');
 * ```
 */
export declare const processFeePayment: (sequelize: Sequelize, feeId: string, paymentAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves outstanding fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any[]>} Outstanding fees
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingFees(sequelize, 1);
 * ```
 */
export declare const getOutstandingFees: (sequelize: Sequelize, studentId: number) => Promise<any[]>;
/**
 * Applies late fee for overdue payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} lateFeeAmount - Late fee amount
 * @param {string} userId - User applying late fee
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyLateFee(sequelize, 1, 202401, 50, 'bursar123');
 * ```
 */
export declare const applyLateFee: (sequelize: Sequelize, studentId: number, termId: number, lateFeeAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Processes enrollment fee refund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} refundAmount - Refund amount
 * @param {string} reason - Refund reason
 * @param {string} userId - User processing refund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processEnrollmentRefund(sequelize, 'TUI-202401-1', 3000, 'Course withdrawal', 'bursar123');
 * ```
 */
export declare const processEnrollmentRefund: (sequelize: Sequelize, feeId: string, refundAmount: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Calculates refund percentage based on withdrawal date.
 *
 * @param {Date} enrollmentDate - Enrollment date
 * @param {Date} withdrawalDate - Withdrawal date
 * @param {Date} termStartDate - Term start date
 * @returns {number} Refund percentage (0-100)
 *
 * @example
 * ```typescript
 * const refundPct = calculateRefundPercentage(
 *   new Date('2024-01-10'),
 *   new Date('2024-01-25'),
 *   new Date('2024-01-15')
 * );
 * ```
 */
export declare const calculateRefundPercentage: (enrollmentDate: Date, withdrawalDate: Date, termStartDate: Date) => number;
/**
 * Creates payment plan for student fees.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} totalAmount - Total amount
 * @param {number} installments - Number of installments
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment plan details
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 202401, 12000, 4, 'bursar123');
 * ```
 */
export declare const createPaymentPlan: (sequelize: Sequelize, studentId: number, termId: number, totalAmount: number, installments: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Waives fee for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {string} waiverReason - Waiver reason
 * @param {string} userId - User granting waiver
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await waiveFee(sequelize, 'TECH-202401-1', 'Financial hardship', 'dean123');
 * ```
 */
export declare const waiveFee: (sequelize: Sequelize, feeId: string, waiverReason: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Generates fee statement for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Fee statement
 *
 * @example
 * ```typescript
 * const statement = await generateFeeStatement(sequelize, 1, 202401);
 * ```
 */
export declare const generateFeeStatement: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createStudentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentNumber: string;
            firstName: string;
            lastName: string;
            middleName: string | null;
            preferredName: string | null;
            email: string;
            alternateEmail: string | null;
            dateOfBirth: Date;
            ssn: string | null;
            gender: string | null;
            ethnicity: string | null;
            citizenship: string;
            admissionDate: Date;
            studentType: string;
            academicLevel: string;
            majorId: number | null;
            minorId: number | null;
            advisorId: number | null;
            enrollmentStatus: string;
            gpa: number;
            creditsEarned: number;
            creditsAttempted: number;
            expectedGraduationDate: Date | null;
            actualGraduationDate: Date | null;
            isInternational: boolean;
            isActive: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createEnrollmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentId: number;
            courseId: number;
            sectionId: number;
            termId: number;
            enrollmentDate: Date;
            enrollmentStatus: string;
            credits: number;
            gradingOption: string;
            grade: string | null;
            gradePoints: number | null;
            midtermGrade: string | null;
            attendancePercentage: number;
            dropDate: Date | null;
            withdrawalDate: Date | null;
            withdrawalReason: string | null;
            lastAttendanceDate: Date | null;
            isAudit: boolean;
            repeatCourse: boolean;
            repeatCount: number;
            tuitionCharged: number;
            feesPaid: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly enrolledBy: string;
            readonly updatedBy: string;
        };
    };
    createEnrollmentStatusModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentId: number;
            termId: number;
            statusType: string;
            statusDate: Date;
            fullTimeStatus: boolean;
            creditsEnrolled: number;
            effectiveDate: Date;
            endDate: Date | null;
            verifiedBy: string | null;
            verificationDate: Date | null;
            notes: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createStudent: (sequelize: Sequelize, studentData: CreateStudentDto, userId: string, transaction?: Transaction) => Promise<any>;
    enrollStudentInCourse: (sequelize: Sequelize, enrollmentData: CreateEnrollmentDto, userId: string, transaction?: Transaction) => Promise<any>;
    dropCourse: (sequelize: Sequelize, enrollmentId: number, userId: string, transaction?: Transaction) => Promise<void>;
    withdrawFromCourse: (sequelize: Sequelize, enrollmentId: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
    getStudentEnrollments: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any[]>;
    calculateEnrolledCredits: (sequelize: Sequelize, studentId: number, termId: number) => Promise<number>;
    isFullTimeStudent: (sequelize: Sequelize, studentId: number, termId: number, fullTimeThreshold?: number) => Promise<boolean>;
    updateAcademicLevel: (sequelize: Sequelize, studentId: number, userId: string, transaction?: Transaction) => Promise<string>;
    getEnrollmentMetrics: (sequelize: Sequelize, termId: number) => Promise<EnrollmentMetrics>;
    changeGradingOption: (sequelize: Sequelize, enrollmentId: number, newGradingOption: "letter" | "pass-fail" | "audit" | "credit-no-credit", userId: string, transaction?: Transaction) => Promise<void>;
    createEnrollmentVerification: (sequelize: Sequelize, verificationData: EnrollmentVerification, userId: string, transaction?: Transaction) => Promise<any>;
    verifyEnrollmentStatus: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any>;
    generateVerificationLetter: (sequelize: Sequelize, studentId: number, termId: number, purpose: string) => Promise<any>;
    validateFinancialAidEligibility: (sequelize: Sequelize, studentId: number, termId: number) => Promise<{
        eligible: boolean;
        reason?: string;
    }>;
    checkInternationalStudentCompliance: (sequelize: Sequelize, studentId: number, termId: number) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    createTransferCredit: (sequelize: Sequelize, transferData: TransferCredit, userId: string, transaction?: Transaction) => Promise<any>;
    evaluateTransferCredit: (sequelize: Sequelize, transferCreditId: number, equivalentCourseId: number, userId: string, transaction?: Transaction) => Promise<void>;
    createInternationalStudentRecord: (sequelize: Sequelize, internationalData: InternationalStudentData, userId: string, transaction?: Transaction) => Promise<any>;
    updateSEVISStatus: (sequelize: Sequelize, studentId: number, sevisStatus: string, userId: string, transaction?: Transaction) => Promise<void>;
    validateArticulationAgreement: (sequelize: Sequelize, institutionCode: string, courseNumber: string) => Promise<{
        hasAgreement: boolean;
        equivalentCourse?: any;
    }>;
    placeEnrollmentHold: (sequelize: Sequelize, holdData: EnrollmentHold, userId: string, transaction?: Transaction) => Promise<any>;
    releaseEnrollmentHold: (sequelize: Sequelize, holdId: string, userId: string, transaction?: Transaction) => Promise<void>;
    checkEnrollmentHolds: (sequelize: Sequelize, studentId: number) => Promise<{
        hasHolds: boolean;
        holds: any[];
    }>;
    createEnrollmentRestriction: (sequelize: Sequelize, restrictionData: EnrollmentRestriction, userId: string, transaction?: Transaction) => Promise<any>;
    validateEnrollmentPermission: (sequelize: Sequelize, studentId: number) => Promise<{
        canEnroll: boolean;
        blocks: string[];
    }>;
    checkEnrollmentCapacity: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number) => Promise<{
        hasCapacity: boolean;
        capacity: EnrollmentCapacity;
    }>;
    addToWaitlist: (sequelize: Sequelize, studentId: number, courseId: number, sectionId: number, termId: number, userId: string, transaction?: Transaction) => Promise<WaitlistEntry>;
    removeFromWaitlist: (sequelize: Sequelize, waitlistId: number, userId: string, transaction?: Transaction) => Promise<void>;
    processWaitlist: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number, transaction?: Transaction) => Promise<WaitlistEntry | null>;
    getWaitlistPosition: (sequelize: Sequelize, studentId: number, courseId: number, sectionId: number, termId: number) => Promise<number | null>;
    reorderWaitlist: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number, transaction?: Transaction) => Promise<void>;
    expireWaitlistEntries: (sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
    setReservedSeats: (sequelize: Sequelize, sectionId: number, reservedCount: number, reservedFor: string, transaction?: Transaction) => Promise<void>;
    releaseReservedSeats: (sequelize: Sequelize, sectionId: number, transaction?: Transaction) => Promise<void>;
    getSectionEnrollmentStats: (sequelize: Sequelize, courseId: number, sectionId: number, termId: number) => Promise<any>;
    calculateEnrollmentFees: (sequelize: Sequelize, studentId: number, termId: number) => Promise<EnrollmentFee[]>;
    createFeeAssessment: (sequelize: Sequelize, feeData: EnrollmentFee, userId: string, transaction?: Transaction) => Promise<any>;
    processFeePayment: (sequelize: Sequelize, feeId: string, paymentAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
    getOutstandingFees: (sequelize: Sequelize, studentId: number) => Promise<any[]>;
    applyLateFee: (sequelize: Sequelize, studentId: number, termId: number, lateFeeAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
    processEnrollmentRefund: (sequelize: Sequelize, feeId: string, refundAmount: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
    calculateRefundPercentage: (enrollmentDate: Date, withdrawalDate: Date, termStartDate: Date) => number;
    createPaymentPlan: (sequelize: Sequelize, studentId: number, termId: number, totalAmount: number, installments: number, userId: string, transaction?: Transaction) => Promise<any>;
    waiveFee: (sequelize: Sequelize, feeId: string, waiverReason: string, userId: string, transaction?: Transaction) => Promise<void>;
    generateFeeStatement: (sequelize: Sequelize, studentId: number, termId: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=student-enrollment-kit.d.ts.map