/**
 * LOC: EDU-COMP-GRAD-001
 * File: /reuse/education/composites/graduation-completion-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../degree-audit-kit
 *   - ../credential-management-kit
 *   - ../student-records-kit
 *   - ../compliance-reporting-kit
 *   - ../alumni-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend graduation services
 *   - Degree completion processors
 *   - Certification modules
 *   - Alumni transition services
 */
import { Sequelize } from 'sequelize';
export type GraduationStatus = 'eligible' | 'pending_requirements' | 'applied' | 'approved' | 'conferred' | 'denied';
export type DegreeType = 'associate' | 'bachelor' | 'master' | 'doctoral' | 'certificate';
export type HonorsDesignation = 'summa_cum_laude' | 'magna_cum_laude' | 'cum_laude' | 'honors' | 'high_honors' | 'highest_honors';
export interface GraduationApplication {
    applicationId: string;
    studentId: string;
    programId: string;
    degreeType: DegreeType;
    expectedGraduationTerm: string;
    applicationDate: Date;
    status: GraduationStatus;
    ceremonyParticipation: boolean;
    honorsEligible: boolean;
    honorsDesignation?: HonorsDesignation;
    approvedBy?: string;
    approvalDate?: Date;
}
export interface DegreeRequirementStatus {
    requirementId: string;
    requirementName: string;
    category: string;
    status: 'completed' | 'in_progress' | 'not_started';
    creditsRequired: number;
    creditsCompleted: number;
    coursesRequired: string[];
    coursesCompleted: string[];
}
export interface DiplomaOrder {
    orderId: string;
    studentId: string;
    diplomaType: 'standard' | 'replacement' | 'duplicate';
    nameToPrint: string;
    mailingAddress: string;
    deliveryMethod: 'mail' | 'pickup';
    orderDate: Date;
    printedDate?: Date;
    deliveredDate?: Date;
    status: 'pending' | 'printing' | 'delivered';
}
export interface CommencementRegistration {
    registrationId: string;
    studentId: string;
    ceremonyId: string;
    ceremonyDate: Date;
    guestCount: number;
    regalia: {
        capGownSize: string;
        hoodRequired: boolean;
    };
    registrationDate: Date;
    checkedIn: boolean;
}
export declare class GraduationCompletionCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Evaluates student graduation eligibility.
     *
     * @param {string} studentId - Student ID
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Eligibility assessment
     *
     * @example
     * ```typescript
     * const eligibility = await service.evaluateGraduationEligibility('STU-001', 'PROG-CS-BS');
     * console.log('Eligible:', eligibility.eligible);
     * ```
     */
    evaluateGraduationEligibility(studentId: string, programId: string): Promise<any>;
    submitGraduationApplication(applicationData: Partial<GraduationApplication>): Promise<any>;
    approveGraduationApplication(applicationId: string, approvedBy: string): Promise<any>;
    denyGraduationApplication(applicationId: string, deniedBy: string, reason: string): Promise<any>;
    calculateGraduationDate(studentId: string, currentProgress: number): Promise<Date>;
    checkGraduationHolds(studentId: string): Promise<any[]>;
    trackGraduationApplicationStatus(applicationId: string): Promise<any>;
    generateGraduationChecklist(studentId: string, programId: string): Promise<any>;
    sendGraduationReminders(termId: string): Promise<number>;
    updateGraduationTimeline(applicationId: string, milestone: string): Promise<void>;
    conductFinalDegreeAudit(studentId: string, programId: string): Promise<any>;
    identifyMissingRequirements(studentId: string, programId: string): Promise<DegreeRequirementStatus[]>;
    processSubstitutionRequest(studentId: string, requiredCourseId: string, substituteCourseId: string, reason: string): Promise<any>;
    approveSubstitution(substitutionId: string, approvedBy: string): Promise<any>;
    processExemptionRequest(studentId: string, requirementId: string, justification: string): Promise<any>;
    verifyMinimumGPA(studentId: string, programId: string): Promise<any>;
    verifyResidencyRequirement(studentId: string, programId: string): Promise<any>;
    generateDegreeAuditReport(studentId: string, programId: string): Promise<any>;
    evaluateHonorsEligibility(studentId: string): Promise<any>;
    assignHonorsDesignation(studentId: string, designation: HonorsDesignation): Promise<any>;
    trackDeansListHistory(studentId: string): Promise<any[]>;
    calculateClassRank(studentId: string, cohort: string): Promise<any>;
    generateHonorsCertificate(studentId: string, honorType: string): Promise<any>;
    processHonorsSocietyNomination(studentId: string, societyName: string): Promise<any>;
    orderDiploma(orderData: Partial<DiplomaOrder>): Promise<any>;
    generateDiploma(studentId: string, programId: string, honorsDesignation?: HonorsDesignation): Promise<any>;
    verifyDiplomaData(studentId: string, programId: string): Promise<any>;
    trackDiplomaProduction(orderId: string): Promise<any>;
    processReplacementDiploma(studentId: string, reason: string, fee: number): Promise<any>;
    generateDigitalCredential(studentId: string, programId: string): Promise<any>;
    registerForCommencement(registrationData: Partial<CommencementRegistration>): Promise<any>;
    orderRegalia(studentId: string, sizes: any): Promise<any>;
    trackCommencementAttendance(ceremonyId: string): Promise<any>;
    generateCommencementProgram(ceremonyId: string): Promise<any>;
    processCommencementCheckIn(registrationId: string): Promise<any>;
    conferDegree(studentId: string, programId: string, conferralDate: Date): Promise<any>;
    generateDegreeVerificationLetter(studentId: string, programId: string): Promise<any>;
    transitionToAlumniStatus(studentId: string, graduationDate: Date): Promise<any>;
}
export default GraduationCompletionCompositeService;
//# sourceMappingURL=graduation-completion-composite.d.ts.map