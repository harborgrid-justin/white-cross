/**
 * LOC: EDU-COMP-FINAID-001
 * File: /reuse/education/composites/financial-aid-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../financial-aid-kit
 *   - ../student-billing-kit
 *   - ../compliance-reporting-kit
 *   - ../student-records-kit
 *
 * DOWNSTREAM (imported by):
 *   - Financial aid office controllers
 *   - Award packaging services
 *   - Disbursement processors
 *   - COD reporting modules
 *   - Student aid portals
 */
import { Sequelize } from 'sequelize';
/**
 * Award types for financial aid
 */
export type AwardType = 'pell' | 'seog' | 'perkins' | 'subsidized_loan' | 'unsubsidized_loan' | 'plus_loan' | 'work_study' | 'institutional_grant' | 'institutional_scholarship' | 'state_grant' | 'external_scholarship' | 'private_loan';
/**
 * Award status
 */
export type AwardStatus = 'offered' | 'accepted' | 'declined' | 'cancelled' | 'disbursed' | 'completed';
/**
 * Verification status
 */
export type VerificationStatus = 'not_selected' | 'selected' | 'in_progress' | 'completed' | 'exempted';
/**
 * SAP status
 */
export type SAPStatus = 'meeting' | 'warning' | 'suspension' | 'appeal_pending' | 'probation';
/**
 * Dependency status
 */
export type DependencyStatus = 'dependent' | 'independent';
/**
 * Enrollment status for aid
 */
export type EnrollmentStatus = 'full-time' | 'three-quarter' | 'half-time' | 'less-than-half';
/**
 * Financial aid record
 */
export interface FinancialAidRecord {
    aidRecordId: string;
    studentId: string;
    awardYear: string;
    academicYear: string;
    dependencyStatus: DependencyStatus;
    efc: number;
    costOfAttendance: number;
    financialNeed: number;
    totalAwarded: number;
    totalDisbursed: number;
    totalAccepted: number;
    enrollmentStatus: EnrollmentStatus;
    housingStatus: 'on-campus' | 'off-campus' | 'with-parents';
    verificationStatus: VerificationStatus;
    packagingDate?: Date;
    acceptanceDate?: Date;
    isnaId?: string;
}
/**
 * FAFSA data
 */
export interface FAFSAData {
    fafsaId: string;
    studentId: string;
    awardYear: string;
    dependencyStatus: DependencyStatus;
    efc: number;
    studentAGI?: number;
    parentAGI?: number;
    householdSize: number;
    numberInCollege: number;
    stateOfResidence: string;
    citizenshipStatus: string;
    receivedDate: Date;
    processedDate?: Date;
    transactionNumber: number;
    isCorrection: boolean;
    verificationFlags: string[];
    pelligible: boolean;
    directLoanEligible: boolean;
}
/**
 * Award package
 */
export interface AwardPackage {
    packageId: string;
    studentId: string;
    awardYear: string;
    awards: Award[];
    totalOffered: number;
    grantTotal: number;
    loanTotal: number;
    workStudyTotal: number;
    unmetNeed: number;
    packagedDate: Date;
    packagedBy: string;
    notified: boolean;
    notificationDate?: Date;
}
/**
 * Individual award
 */
export interface Award {
    awardId: string;
    studentId: string;
    awardYear: string;
    awardType: AwardType;
    awardName: string;
    fundSource: string;
    fundCode: string;
    offeredAmount: number;
    acceptedAmount: number;
    disbursedAmount: number;
    remainingAmount: number;
    status: AwardStatus;
    offerDate: Date;
    acceptanceDate?: Date;
    isNeedBased: boolean;
    isFederal: boolean;
    isLoan: boolean;
    interestRate?: number;
    originationFee?: number;
    termAllocations?: Array<{
        termId: string;
        amount: number;
        disbursementDate?: Date;
    }>;
}
/**
 * Disbursement record
 */
export interface DisbursementRecord {
    disbursementId: string;
    awardId: string;
    studentId: string;
    termId: string;
    awardType: AwardType;
    scheduledAmount: number;
    disbursedAmount: number;
    scheduledDate: Date;
    disbursedDate?: Date;
    disbursementMethod: 'eft' | 'check' | 'credit_to_account';
    status: 'scheduled' | 'pending' | 'processed' | 'returned' | 'cancelled';
    transactionId?: string;
    codReported: boolean;
    codReportDate?: Date;
}
/**
 * COD (Common Origination and Disbursement) reporting data
 */
export interface CODReportData {
    reportId: string;
    reportType: 'origination' | 'disbursement' | 'change' | 'adjustment';
    awardYear: string;
    submissionDate: Date;
    studentRecords: Array<{
        studentId: string;
        ssn: string;
        awardType: AwardType;
        amount: number;
        disbursementDate: Date;
    }>;
    totalRecords: number;
    totalAmount: number;
    status: 'pending' | 'submitted' | 'accepted' | 'rejected';
    responseFile?: string;
    errors?: string[];
}
/**
 * Satisfactory Academic Progress (SAP) evaluation
 */
export interface SAPEvaluation {
    evaluationId: string;
    studentId: string;
    evaluationDate: Date;
    evaluationTerm: string;
    cumulativeGPA: number;
    requiredGPA: number;
    creditsAttempted: number;
    creditsCompleted: number;
    completionRate: number;
    requiredCompletionRate: number;
    maxTimeframe: number;
    currentProgress: number;
    sapStatus: SAPStatus;
    financialAidEligible: boolean;
    warningIssued: boolean;
    appealAllowed: boolean;
    comments?: string;
}
/**
 * R2T4 (Return of Title IV) calculation
 */
export interface R2T4Calculation {
    calculationId: string;
    studentId: string;
    termId: string;
    withdrawalDate: Date;
    termStartDate: Date;
    termEndDate: Date;
    daysInTerm: number;
    daysCompleted: number;
    percentageCompleted: number;
    totalAidDisbursed: number;
    earnedAid: number;
    unearnedAid: number;
    institutionResponsibility: number;
    studentResponsibility: number;
    returnAmount: number;
    postWithdrawalDisbursement: number;
    fundReturns: Array<{
        fundType: string;
        amount: number;
    }>;
}
/**
 * Verification tracking
 */
export interface VerificationTracking {
    verificationId: string;
    studentId: string;
    awardYear: string;
    verificationStatus: VerificationStatus;
    requiredDocuments: Array<{
        documentType: string;
        required: boolean;
        received: boolean;
        receivedDate?: Date;
    }>;
    completedDate?: Date;
    completedBy?: string;
    exemptionReason?: string;
}
/**
 * Professional judgment case
 */
export interface ProfessionalJudgmentCase {
    caseId: string;
    studentId: string;
    awardYear: string;
    circumstance: string;
    requestedAdjustment: string;
    originalEFC: number;
    adjustedEFC?: number;
}
/**
 * Award letter data
 */
export interface AwardLetter {
    letterId: string;
    studentId: string;
    awardYear: string;
    generatedDate: Date;
    costOfAttendance: {
        tuition: number;
        fees: number;
        housing: number;
        meals: number;
        books: number;
        transportation: number;
        personal: number;
        total: number;
    };
    resources: {
        efc: number;
        otherResources: number;
        total: number;
    };
    awards: Award[];
    totalAid: number;
    unmetNeed: number;
    acceptanceDeadline: Date;
    acceptanceStatus: 'pending' | 'accepted' | 'declined';
}
/**
 * Sequelize model for Financial Aid Records.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     FinancialAidRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         awardYear:
 *           type: string
 *         efc:
 *           type: number
 *         costOfAttendance:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialAidRecord model
 *
 * @example
 * ```typescript
 * const FinancialAid = createFinancialAidModel(sequelize);
 * const record = await FinancialAid.create({
 *   studentId: 'STU123456',
 *   awardYear: '2024-2025',
 *   dependencyStatus: 'dependent',
 *   efc: 5000
 * });
 * ```
 */
export declare const createFinancialAidModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        awardYear: string;
        dependencyStatus: DependencyStatus;
        efc: number;
        costOfAttendance: number;
        financialNeed: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Awards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Award model
 */
export declare const createAwardModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        awardYear: string;
        awardType: AwardType;
        awardName: string;
        offeredAmount: number;
        status: AwardStatus;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Disbursements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Disbursement model
 */
export declare const createDisbursementModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        awardId: string;
        studentId: string;
        termId: string;
        scheduledAmount: number;
        disbursedAmount: number;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for SAP Evaluations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SAPEvaluation model
 */
export declare const createSAPEvaluationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        evaluationDate: Date;
        evaluationTerm: string;
        sapStatus: SAPStatus;
        financialAidEligible: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Financial Aid Management Composite Service
 *
 * Provides comprehensive financial aid packaging, disbursement, compliance, and reporting
 * for higher education Title IV programs.
 */
export declare class FinancialAidManagementCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Imports FAFSA data from ISIR file.
     *
     * @param {string} isirFile - ISIR file content
     * @returns {Promise<FAFSAData[]>} Imported FAFSA records
     *
     * @example
     * ```typescript
     * const fafsaRecords = await service.importFAFSAData(isirFileContent);
     * console.log(`Imported ${fafsaRecords.length} FAFSA records`);
     * ```
     */
    importFAFSAData(isirFile: string): Promise<FAFSAData[]>;
    /**
     * 2. Processes FAFSA corrections and updates.
     *
     * @param {string} studentId - Student identifier
     * @param {FAFSAData} correctionData - Correction data
     * @returns {Promise<FAFSAData>} Updated FAFSA record
     *
     * @example
     * ```typescript
     * await service.processFAFSACorrection('STU123456', correctionData);
     * ```
     */
    processFAFSACorrection(studentId: string, correctionData: FAFSAData): Promise<FAFSAData>;
    /**
     * 3. Calculates Expected Family Contribution (EFC).
     *
     * @param {FAFSAData} fafsaData - FAFSA data
     * @returns {Promise<{efc: number; calculation: any}>} EFC calculation
     *
     * @example
     * ```typescript
     * const efcResult = await service.calculateEFC(fafsaData);
     * console.log(`Calculated EFC: $${efcResult.efc}`);
     * ```
     */
    calculateEFC(fafsaData: FAFSAData): Promise<{
        efc: number;
        calculation: any;
    }>;
    /**
     * 4. Calculates Cost of Attendance (COA).
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {EnrollmentStatus} enrollmentStatus - Enrollment status
     * @param {string} housingStatus - Housing status
     * @returns {Promise<{total: number; breakdown: any}>} COA calculation
     *
     * @example
     * ```typescript
     * const coa = await service.calculateCostOfAttendance(
     *   'STU123456',
     *   '2024-2025',
     *   'full-time',
   *   'on-campus'
     * );
     * ```
     */
    calculateCostOfAttendance(studentId: string, awardYear: string, enrollmentStatus: EnrollmentStatus, housingStatus: 'on-campus' | 'off-campus' | 'with-parents'): Promise<{
        total: number;
        breakdown: any;
    }>;
    /**
     * 5. Calculates financial need.
     *
     * @param {number} coa - Cost of Attendance
     * @param {number} efc - Expected Family Contribution
     * @param {number} otherResources - Other resources
     * @returns {Promise<number>} Financial need
     *
     * @example
     * ```typescript
     * const need = await service.calculateFinancialNeed(40000, 5000, 2000);
     * console.log(`Financial need: $${need}`);
     * ```
     */
    calculateFinancialNeed(coa: number, efc: number, otherResources: number): Promise<number>;
    /**
     * 6. Determines Pell Grant eligibility and amount.
     *
     * @param {number} efc - Expected Family Contribution
     * @param {EnrollmentStatus} enrollmentStatus - Enrollment status
     * @param {number} coa - Cost of Attendance
     * @returns {Promise<{eligible: boolean; amount: number}>} Pell eligibility
     *
     * @example
     * ```typescript
     * const pell = await service.determinePellEligibility(3500, 'full-time', 40000);
     * if (pell.eligible) {
     *   console.log(`Pell Grant: $${pell.amount}`);
     * }
     * ```
     */
    determinePellEligibility(efc: number, enrollmentStatus: EnrollmentStatus, coa: number): Promise<{
        eligible: boolean;
        amount: number;
    }>;
    /**
     * 7. Creates comprehensive financial aid package.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {FinancialAidRecord} aidRecord - Financial aid record
     * @returns {Promise<AwardPackage>} Award package
     *
     * @example
     * ```typescript
     * const package = await service.createAwardPackage('STU123456', '2024-2025', aidRecord);
     * console.log(`Total offered: $${package.totalOffered}`);
     * ```
     */
    createAwardPackage(studentId: string, awardYear: string, aidRecord: FinancialAidRecord): Promise<AwardPackage>;
    /**
     * 8. Adds award to package.
     *
     * @param {string} packageId - Package identifier
     * @param {Award} award - Award to add
     * @returns {Promise<AwardPackage>} Updated package
     *
     * @example
     * ```typescript
     * await service.addAwardToPackage('PKG-001', subsidizedLoanAward);
     * ```
     */
    addAwardToPackage(packageId: string, award: Award): Promise<AwardPackage>;
    /**
     * 9. Packages Direct Subsidized Loan.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {number} need - Remaining need
     * @param {string} gradeLevel - Grade level
     * @returns {Promise<Award>} Subsidized loan award
     *
     * @example
     * ```typescript
     * const loan = await service.packageSubsidizedLoan('STU123456', '2024-2025', 5000, 'sophomore');
     * ```
     */
    packageSubsidizedLoan(studentId: string, awardYear: string, need: number, gradeLevel: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate'): Promise<Award>;
    /**
     * 10. Packages Direct Unsubsidized Loan.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {DependencyStatus} dependencyStatus - Dependency status
     * @param {string} gradeLevel - Grade level
     * @returns {Promise<Award>} Unsubsidized loan award
     *
     * @example
     * ```typescript
     * const loan = await service.packageUnsubsidizedLoan(
     *   'STU123456',
     *   '2024-2025',
     *   'independent',
     *   'junior'
     * );
     * ```
     */
    packageUnsubsidizedLoan(studentId: string, awardYear: string, dependencyStatus: DependencyStatus, gradeLevel: string): Promise<Award>;
    /**
     * 11. Packages Federal Work-Study.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {number} need - Financial need
     * @returns {Promise<Award>} Work-study award
     *
     * @example
     * ```typescript
     * const ws = await service.packageWorkStudy('STU123456', '2024-2025', 3000);
     * ```
     */
    packageWorkStudy(studentId: string, awardYear: string, need: number): Promise<Award>;
    /**
     * 12. Packages institutional scholarship.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {string} scholarshipName - Scholarship name
     * @param {number} amount - Award amount
     * @param {boolean} renewable - Is renewable
     * @returns {Promise<Award>} Scholarship award
     *
     * @example
     * ```typescript
     * const scholarship = await service.packageInstitutionalScholarship(
     *   'STU123456',
     *   '2024-2025',
     *   'Presidential Scholarship',
     *   10000,
     *   true
     * );
     * ```
     */
    packageInstitutionalScholarship(studentId: string, awardYear: string, scholarshipName: string, amount: number, renewable: boolean): Promise<Award>;
    /**
     * 13. Processes award acceptance by student.
     *
     * @param {string} awardId - Award identifier
     * @param {number} acceptedAmount - Accepted amount
     * @returns {Promise<Award>} Updated award
     *
     * @example
     * ```typescript
     * await service.acceptAward('AWARD-001', 5500);
     * ```
     */
    acceptAward(awardId: string, acceptedAmount: number): Promise<Award>;
    /**
     * 14. Declines award.
     *
     * @param {string} awardId - Award identifier
     * @param {string} reason - Decline reason
     * @returns {Promise<Award>} Updated award
     *
     * @example
     * ```typescript
     * await service.declineAward('AWARD-002', 'Do not need loan');
     * ```
     */
    declineAward(awardId: string, reason: string): Promise<Award>;
    /**
     * 15. Schedules award disbursement for term.
     *
     * @param {string} awardId - Award identifier
     * @param {string} termId - Term identifier
     * @param {number} amount - Disbursement amount
     * @param {Date} disbursementDate - Scheduled disbursement date
     * @returns {Promise<DisbursementRecord>} Disbursement record
     *
     * @example
     * ```typescript
     * const disbursement = await service.scheduleDisbursement(
     *   'AWARD-001',
     *   'FALL2024',
     *   2750,
     *   new Date('2024-09-01')
     * );
     * ```
     */
    scheduleDisbursement(awardId: string, termId: string, amount: number, disbursementDate: Date): Promise<DisbursementRecord>;
    /**
     * 16. Processes scheduled disbursement.
     *
     * @param {string} disbursementId - Disbursement identifier
     * @returns {Promise<DisbursementRecord>} Updated disbursement
     *
     * @example
     * ```typescript
     * await service.processDisbursement('DISB-001');
     * ```
     */
    processDisbursement(disbursementId: string): Promise<DisbursementRecord>;
    /**
     * 17. Credits disbursement to student account.
     *
     * @param {string} disbursementId - Disbursement identifier
     * @param {string} accountNumber - Account number
     * @returns {Promise<{success: boolean; transactionId: string}>} Credit result
     *
     * @example
     * ```typescript
     * await service.creditDisbursementToAccount('DISB-001', 'ACC-2024-001');
     * ```
     */
    creditDisbursementToAccount(disbursementId: string, accountNumber: string): Promise<{
        success: boolean;
        transactionId: string;
    }>;
    /**
     * 18. Issues disbursement refund to student.
     *
     * @param {string} studentId - Student identifier
     * @param {number} amount - Refund amount
     * @param {string} method - Disbursement method
     * @returns {Promise<{refundId: string; amount: number; method: string}>} Refund record
     *
     * @example
     * ```typescript
     * const refund = await service.issueDisbursementRefund('STU123456', 1500, 'eft');
     * ```
     */
    issueDisbursementRefund(studentId: string, amount: number, method: 'eft' | 'check'): Promise<{
        refundId: string;
        amount: number;
        method: string;
    }>;
    /**
     * 19. Returns unearned disbursement.
     *
     * @param {string} disbursementId - Disbursement identifier
     * @param {number} returnAmount - Amount to return
     * @param {string} reason - Return reason
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.returnDisbursement('DISB-001', 500, 'Enrollment change');
     * ```
     */
    returnDisbursement(disbursementId: string, returnAmount: number, reason: string): Promise<boolean>;
    /**
     * 20. Cancels scheduled disbursement.
     *
     * @param {string} disbursementId - Disbursement identifier
     * @param {string} reason - Cancellation reason
     * @returns {Promise<DisbursementRecord>} Cancelled disbursement
     *
     * @example
     * ```typescript
     * await service.cancelDisbursement('DISB-002', 'Student withdrew');
     * ```
     */
    cancelDisbursement(disbursementId: string, reason: string): Promise<DisbursementRecord>;
    /**
     * 21. Generates COD origination record.
     *
     * @param {string} awardId - Award identifier
     * @returns {Promise<any>} COD origination record
     *
     * @example
     * ```typescript
     * const codRecord = await service.generateCODOrigination('AWARD-001');
     * ```
     */
    generateCODOrigination(awardId: string): Promise<any>;
    /**
     * 22. Generates COD disbursement record.
     *
     * @param {string} disbursementId - Disbursement identifier
     * @returns {Promise<any>} COD disbursement record
     *
     * @example
     * ```typescript
     * const codRecord = await service.generateCODDisbursement('DISB-001');
     * ```
     */
    generateCODDisbursement(disbursementId: string): Promise<any>;
    /**
     * 23. Submits COD batch file.
     *
     * @param {string} awardYear - Award year
     * @param {CODReportData} reportData - Report data
     * @returns {Promise<{submitted: boolean; batchId: string}>} Submission result
     *
     * @example
     * ```typescript
     * const result = await service.submitCODBatch('2024-2025', reportData);
     * ```
     */
    submitCODBatch(awardYear: string, reportData: CODReportData): Promise<{
        submitted: boolean;
        batchId: string;
    }>;
    /**
     * 24. Processes COD response file.
     *
     * @param {string} responseFile - Response file content
     * @returns {Promise<{accepted: number; rejected: number; errors: string[]}>} Processing result
     *
     * @example
     * ```typescript
     * const result = await service.processCODResponse(responseFileContent);
     * console.log(`Accepted: ${result.accepted}, Rejected: ${result.rejected}`);
     * ```
     */
    processCODResponse(responseFile: string): Promise<{
        accepted: number;
        rejected: number;
        errors: string[];
    }>;
    /**
     * 25. Reports NSLDS (National Student Loan Data System) enrollment.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {EnrollmentStatus} status - Enrollment status
     * @returns {Promise<boolean>} Report success
     *
     * @example
     * ```typescript
     * await service.reportNSLDSEnrollment('STU123456', 'FALL2024', 'full-time');
     * ```
     */
    reportNSLDSEnrollment(studentId: string, termId: string, status: EnrollmentStatus): Promise<boolean>;
    /**
     * 26. Evaluates Satisfactory Academic Progress (SAP).
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<SAPEvaluation>} SAP evaluation
     *
     * @example
     * ```typescript
     * const sap = await service.evaluateSAP('STU123456', 'FALL2024');
     * if (sap.sapStatus === 'suspension') {
     *   console.log('Student is on financial aid suspension');
     * }
     * ```
     */
    evaluateSAP(studentId: string, termId: string): Promise<SAPEvaluation>;
    /**
     * 27. Processes SAP appeal.
     *
     * @param {string} studentId - Student identifier
     * @param {string} appealReason - Appeal reason
     * @param {string[]} supportingDocs - Supporting documents
     * @returns {Promise<{appealId: string; status: string}>} Appeal record
     *
     * @example
     * ```typescript
     * await service.processSAPAppeal('STU123456', 'Medical emergency', ['doc1.pdf']);
     * ```
     */
    processSAPAppeal(studentId: string, appealReason: string, supportingDocs: string[]): Promise<{
        appealId: string;
        status: string;
    }>;
    /**
     * 28. Initiates verification process.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {string[]} requiredDocs - Required documents
     * @returns {Promise<VerificationTracking>} Verification tracking
     *
     * @example
     * ```typescript
     * const verification = await service.initiateVerification(
     *   'STU123456',
     *   '2024-2025',
     *   ['tax-return', 'w2', 'identity']
     * );
     * ```
     */
    initiateVerification(studentId: string, awardYear: string, requiredDocs: string[]): Promise<VerificationTracking>;
    /**
     * 29. Records verification document receipt.
     *
     * @param {string} verificationId - Verification identifier
     * @param {string} documentType - Document type
     * @returns {Promise<VerificationTracking>} Updated tracking
     *
     * @example
     * ```typescript
     * await service.receiveVerificationDocument('VER-001', 'tax-return');
     * ```
     */
    receiveVerificationDocument(verificationId: string, documentType: string): Promise<VerificationTracking>;
    /**
     * 30. Completes verification process.
     *
     * @param {string} verificationId - Verification identifier
     * @param {string} completedBy - Staff member identifier
     * @returns {Promise<VerificationTracking>} Completed verification
     *
     * @example
     * ```typescript
     * await service.completeVerification('VER-001', 'STAFF123');
     * ```
     */
    completeVerification(verificationId: string, completedBy: string): Promise<VerificationTracking>;
    /**
     * 31. Processes professional judgment case.
     *
     * @param {ProfessionalJudgmentCase} caseData - Case data
     * @returns {Promise<ProfessionalJudgmentCase>} Professional judgment case
     *
     * @example
     * ```typescript
     * const pjCase = await service.processProfessionalJudgment({
     *   caseId: 'PJ-001',
     *   studentId: 'STU123456',
     *   awardYear: '2024-2025',
     *   circumstance: 'Parent job loss',
     *   requestedAdjustment: 'Reduce parent income by $30,000',
     *   originalEFC: 8000,
     *   supportingDocuments: ['termination-letter.pdf'],
     *   submittedDate: new Date(),
     *   decision: 'pending'
     * });
     * ```
     */
    processProfessionalJudgment(caseData: ProfessionalJudgmentCase): Promise<ProfessionalJudgmentCase>;
    /**
     * 32. Applies EFC override from professional judgment.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {number} newEFC - New EFC
     * @param {string} reason - Override reason
     * @returns {Promise<FinancialAidRecord>} Updated aid record
     *
     * @example
     * ```typescript
     * await service.applyEFCOverride('STU123456', '2024-2025', 3000, 'PJ approved');
     * ```
     */
    applyEFCOverride(studentId: string, awardYear: string, newEFC: number, reason: string): Promise<FinancialAidRecord>;
    /**
     * 33. Calculates Return of Title IV (R2T4) funds.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {Date} withdrawalDate - Withdrawal date
     * @returns {Promise<R2T4Calculation>} R2T4 calculation
     *
     * @example
     * ```typescript
     * const r2t4 = await service.calculateR2T4(
     *   'STU123456',
     *   'FALL2024',
     *   new Date('2024-10-15')
     * );
     * console.log(`Return amount: $${r2t4.returnAmount}`);
     * ```
     */
    calculateR2T4(studentId: string, termId: string, withdrawalDate: Date): Promise<R2T4Calculation>;
    /**
     * 34. Processes R2T4 return.
     *
     * @param {string} calculationId - R2T4 calculation identifier
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.processR2T4Return('R2T4-001');
     * ```
     */
    processR2T4Return(calculationId: string): Promise<boolean>;
    /**
     * 35. Generates award letter.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @param {AwardPackage} package - Award package
     * @returns {Promise<AwardLetter>} Award letter
     *
     * @example
     * ```typescript
     * const letter = await service.generateAwardLetter('STU123456', '2024-2025', package);
     * ```
     */
    generateAwardLetter(studentId: string, awardYear: string, awardPackage: AwardPackage): Promise<AwardLetter>;
    /**
     * 36. Sends award letter to student.
     *
     * @param {string} letterId - Letter identifier
     * @param {string} email - Student email
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.sendAwardLetter('LETTER-001', 'student@university.edu');
     * ```
     */
    sendAwardLetter(letterId: string, email: string): Promise<boolean>;
    /**
     * 37. Generates award letter PDF.
     *
     * @param {string} letterId - Letter identifier
     * @returns {Promise<Buffer>} PDF buffer
     *
     * @example
     * ```typescript
     * const pdf = await service.generateAwardLetterPDF('LETTER-001');
     * ```
     */
    generateAwardLetterPDF(letterId: string): Promise<Buffer>;
    /**
     * 38. Tracks award letter acceptance.
     *
     * @param {string} letterId - Letter identifier
     * @param {boolean} accepted - Acceptance status
     * @returns {Promise<AwardLetter>} Updated letter
     *
     * @example
     * ```typescript
     * await service.trackAwardLetterAcceptance('LETTER-001', true);
     * ```
     */
    trackAwardLetterAcceptance(letterId: string, accepted: boolean): Promise<AwardLetter>;
    /**
     * 39. Generates financial aid shopping sheet.
     *
     * @param {string} studentId - Student identifier
     * @param {string} awardYear - Award year
     * @returns {Promise<any>} Shopping sheet
     *
     * @example
     * ```typescript
     * const sheet = await service.generateShoppingSheet('STU123456', '2024-2025');
     * ```
     */
    generateShoppingSheet(studentId: string, awardYear: string): Promise<any>;
    /**
     * 40. Calculates aggregate loan limits.
     *
     * @param {string} studentId - Student identifier
     * @param {string} gradeLevel - Grade level
     * @param {DependencyStatus} dependencyStatus - Dependency status
     * @returns {Promise<{used: number; remaining: number; limit: number}>} Loan limits
     *
     * @example
     * ```typescript
     * const limits = await service.calculateAggregateLoanLimits(
     *   'STU123456',
     *   'junior',
     *   'dependent'
     * );
     * ```
     */
    calculateAggregateLoanLimits(studentId: string, gradeLevel: string, dependencyStatus: DependencyStatus): Promise<{
        used: number;
        remaining: number;
        limit: number;
    }>;
    /**
     * 41. Tracks lifetime eligibility used (LEU) for Pell.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{yearsUsed: number; percentageUsed: number; remaining: number}>} LEU data
     *
     * @example
     * ```typescript
     * const leu = await service.trackPellLEU('STU123456');
     * console.log(`Pell LEU used: ${leu.percentageUsed}%`);
     * ```
     */
    trackPellLEU(studentId: string): Promise<{
        yearsUsed: number;
        percentageUsed: number;
        remaining: number;
    }>;
    /**
     * 42. Generates comprehensive aid history report.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<any>} Aid history
     *
     * @example
     * ```typescript
     * const history = await service.generateAidHistory('STU123456');
     * ```
     */
    generateAidHistory(studentId: string): Promise<any>;
}
export default FinancialAidManagementCompositeService;
//# sourceMappingURL=financial-aid-management-composite.d.ts.map