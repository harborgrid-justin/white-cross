/**
 * CONSTRUCTION CONTRACT ADMINISTRATION KIT
 *
 * Comprehensive contract administration system for construction projects.
 * Provides 45 specialized functions covering:
 * - Contract creation, modification, and termination
 * - Contract compliance monitoring and auditing
 * - Milestone tracking and validation
 * - Payment application processing
 * - Retainage management and tracking
 * - Contract document management
 * - Amendment workflows and approvals
 * - Performance bond tracking
 * - Insurance verification and management
 * - Subcontractor management
 * - Contract closeout procedures
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant contract documentation
 *
 * @module ConstructionContractAdministrationKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all contract data is audited and tracked
 * @example
 * ```typescript
 * import {
 *   createContract,
 *   processPaymentApplication,
 *   trackMilestone,
 *   verifyInsurance,
 *   calculateRetainage
 * } from './construction-contract-administration-kit';
 *
 * // Create a new contract
 * const contract = await createContract({
 *   contractNumber: 'CNT-2025-001',
 *   contractorId: 'contractor-123',
 *   projectId: 'project-456',
 *   contractAmount: 2000000,
 *   startDate: new Date(),
 *   completionDate: new Date('2025-12-31')
 * });
 *
 * // Process payment application
 * const payment = await processPaymentApplication(contract.id, {
 *   applicationNumber: 1,
 *   periodEndDate: new Date(),
 *   amountRequested: 250000
 * });
 * ```
 */
import { ConstructionContract } from './models/construction-contract.model';
import { PaymentApplication } from './models/payment-application.model';
import { ContractAmendment } from './models/contract-amendment.model';
import { ContractMilestone } from './models/contract-milestone.model';
import { ContractStatus, MilestoneStatus, InsuranceType, BondType, ContractDocumentType } from './types/contract.types';
/**
 * Retainage tracking interface
 */
export interface RetainageTracking {
    id: string;
    contractId: string;
    paymentApplicationId?: string;
    retainagePercentage: number;
    amountWithheld: number;
    totalRetainageHeld: number;
    amountReleased: number;
    totalRetainageReleased: number;
    currentBalance: number;
    releaseDate?: Date;
    releasedBy?: string;
    releaseReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Performance bond interface
 */
export interface PerformanceBond {
    id: string;
    contractId: string;
    bondType: BondType;
    bondNumber: string;
    suretyCompany: string;
    suretyAgent: string;
    bondAmount: number;
    effectiveDate: Date;
    expirationDate: Date;
    isActive: boolean;
    documentUrl?: string;
    verifiedDate?: Date;
    verifiedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insurance certificate interface
 */
export interface InsuranceCertificate {
    id: string;
    contractId: string;
    insuranceType: InsuranceType;
    policyNumber: string;
    insuranceCompany: string;
    agent: string;
    agentEmail: string;
    agentPhone: string;
    coverageAmount: number;
    effectiveDate: Date;
    expirationDate: Date;
    isActive: boolean;
    additionalInsured: boolean;
    waiverOfSubrogation: boolean;
    documentUrl?: string;
    verifiedDate?: Date;
    verifiedBy?: string;
    reminderSent?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract document interface
 */
export interface ContractDocument {
    id: string;
    contractId: string;
    documentType: ContractDocumentType;
    title: string;
    description: string;
    version: string;
    documentNumber?: string;
    fileUrl: string;
    fileSize: number;
    fileName: string;
    mimeType: string;
    uploadedBy: string;
    uploadedDate: Date;
    isExecuted: boolean;
    executedDate?: Date;
    isSuperseded: boolean;
    supersededBy?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance check interface
 */
export interface ComplianceCheck {
    id: string;
    contractId: string;
    checkType: 'insurance' | 'bond' | 'license' | 'certification' | 'payment' | 'reporting';
    checkDate: Date;
    isCompliant: boolean;
    findings: string[];
    deficiencies: string[];
    correctiveActions: string[];
    dueDate?: Date;
    completedDate?: Date;
    checkedBy: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a new construction contract
 *
 * @param data - Contract creation data
 * @param userId - User creating the contract
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   projectId: 'project-123',
 *   contractorId: 'contractor-456',
 *   contractType: ContractType.LUMP_SUM,
 *   contractAmount: 1500000,
 *   startDate: new Date('2025-01-01'),
 *   completionDate: new Date('2025-12-31')
 * }, 'user-789');
 * ```
 */
export declare function createContract(data: Omit<ConstructionContract, 'id' | 'contractNumber' | 'status' | 'currentAmount' | 'totalPaid' | 'retainageAmount' | 'daysExtended' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ConstructionContract>;
/**
 * Generates unique contract number
 *
 * @param projectName - Project name
 * @returns Formatted contract number
 *
 * @example
 * ```typescript
 * const contractNumber = generateContractNumber('Hospital Renovation');
 * // Returns: "CNT-HR-20250108-001"
 * ```
 */
export declare function generateContractNumber(projectName: string): string;
/**
 * Updates contract status
 *
 * @param contractId - Contract identifier
 * @param status - New status
 * @param userId - User updating status
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await updateContractStatus('contract-123', ContractStatus.ACTIVE, 'user-456');
 * ```
 */
export declare function updateContractStatus(contractId: string, status: ContractStatus, userId: string): Promise<ConstructionContract>;
/**
 * Modifies contract terms
 *
 * @param contractId - Contract identifier
 * @param modifications - Contract modifications
 * @param userId - User modifying contract
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await modifyContractTerms('contract-123', {
 *   completionDate: new Date('2026-01-31'),
 *   contractAmount: 1750000
 * }, 'user-456');
 * ```
 */
export declare function modifyContractTerms(contractId: string, modifications: Partial<ConstructionContract>, userId: string): Promise<ConstructionContract>;
/**
 * Terminates contract
 *
 * @param contractId - Contract identifier
 * @param reason - Termination reason
 * @param userId - User terminating contract
 * @returns Terminated contract
 *
 * @example
 * ```typescript
 * await terminateContract('contract-123', 'Contractor default', 'admin-456');
 * ```
 */
export declare function terminateContract(contractId: string, reason: string, userId: string): Promise<ConstructionContract>;
/**
 * Issues notice to proceed
 *
 * @param contractId - Contract identifier
 * @param proceedDate - Notice to proceed date
 * @param userId - User issuing notice
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await issueNoticeToProceed('contract-123', new Date(), 'admin-456');
 * ```
 */
export declare function issueNoticeToProceed(contractId: string, proceedDate: Date, userId: string): Promise<ConstructionContract>;
/**
 * Creates contract amendment
 *
 * @param amendment - Amendment data
 * @param userId - User creating amendment
 * @returns Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createAmendment({
 *   contractId: 'contract-123',
 *   title: 'Additional HVAC Work',
 *   costImpact: 50000,
 *   timeImpact: 14
 * }, 'user-456');
 * ```
 */
export declare function createAmendment(amendment: Omit<ContractAmendment, 'id' | 'amendmentNumber' | 'status' | 'requestedDate' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ContractAmendment>;
/**
 * Submits amendment for review
 *
 * @param amendmentId - Amendment identifier
 * @param userId - User submitting amendment
 * @returns Updated amendment
 *
 * @example
 * ```typescript
 * await submitAmendment('amendment-123', 'user-456');
 * ```
 */
export declare function submitAmendment(amendmentId: string, userId: string): Promise<ContractAmendment>;
/**
 * Reviews amendment
 *
 * @param amendmentId - Amendment identifier
 * @param approved - Approval status
 * @param userId - User reviewing amendment
 * @returns Updated amendment
 *
 * @example
 * ```typescript
 * await reviewAmendment('amendment-123', true, 'reviewer-456');
 * ```
 */
export declare function reviewAmendment(amendmentId: string, approved: boolean, userId: string): Promise<ContractAmendment>;
/**
 * Executes approved amendment
 *
 * @param amendmentId - Amendment identifier
 * @param userId - User executing amendment
 * @returns Updated amendment and contract
 *
 * @example
 * ```typescript
 * await executeAmendment('amendment-123', 'admin-456');
 * ```
 */
export declare function executeAmendment(amendmentId: string, userId: string): Promise<{
    amendment: ContractAmendment;
    contract: ConstructionContract;
}>;
/**
 * Calculates amendment impact on schedule
 *
 * @param amendmentId - Amendment identifier
 * @returns Schedule impact analysis
 *
 * @example
 * ```typescript
 * const impact = await calculateAmendmentScheduleImpact('amendment-123');
 * ```
 */
export declare function calculateAmendmentScheduleImpact(amendmentId: string): Promise<{
    originalCompletionDate: Date;
    newCompletionDate: Date;
    daysExtended: number;
    criticalPath: boolean;
}>;
/**
 * Creates payment application
 *
 * @param payment - Payment application data
 * @param userId - User creating payment application
 * @returns Created payment application
 *
 * @example
 * ```typescript
 * const payment = await createPaymentApplication({
 *   contractId: 'contract-123',
 *   periodEndDate: new Date(),
 *   workCompleted: 250000,
 *   storedMaterials: 50000
 * }, 'contractor-456');
 * ```
 */
export declare function createPaymentApplication(payment: Omit<PaymentApplication, 'id' | 'applicationNumber' | 'status' | 'totalCompleted' | 'previouslyPaid' | 'currentPaymentDue' | 'retainageWithheld' | 'netPayment' | 'percentComplete' | 'submittedDate' | 'createdAt' | 'updatedAt'>, userId: string): Promise<PaymentApplication>;
/**
 * Submits payment application for review
 *
 * @param paymentId - Payment application identifier
 * @param userId - User submitting payment
 * @returns Updated payment application
 *
 * @example
 * ```typescript
 * await submitPaymentApplication('payment-123', 'contractor-456');
 * ```
 */
export declare function submitPaymentApplication(paymentId: string, userId: string): Promise<PaymentApplication>;
/**
 * Reviews payment application
 *
 * @param paymentId - Payment application identifier
 * @param userId - User reviewing payment
 * @returns Updated payment application
 *
 * @example
 * ```typescript
 * await reviewPaymentApplication('payment-123', 'reviewer-456');
 * ```
 */
export declare function reviewPaymentApplication(paymentId: string, userId: string): Promise<PaymentApplication>;
/**
 * Approves payment application
 *
 * @param paymentId - Payment application identifier
 * @param approvedAmount - Approved payment amount
 * @param userId - User approving payment
 * @returns Updated payment application
 *
 * @example
 * ```typescript
 * await approvePaymentApplication('payment-123', 240000, 'admin-456');
 * ```
 */
export declare function approvePaymentApplication(paymentId: string, approvedAmount: number, userId: string): Promise<PaymentApplication>;
/**
 * Processes payment
 *
 * @param paymentId - Payment application identifier
 * @param userId - User processing payment
 * @returns Updated payment application
 *
 * @example
 * ```typescript
 * await processPayment('payment-123', 'finance-456');
 * ```
 */
export declare function processPayment(paymentId: string, userId: string): Promise<PaymentApplication>;
/**
 * Calculates payment schedule
 *
 * @param contractId - Contract identifier
 * @returns Payment schedule breakdown
 *
 * @example
 * ```typescript
 * const schedule = await calculatePaymentSchedule('contract-123');
 * ```
 */
export declare function calculatePaymentSchedule(contractId: string): Promise<{
    totalContractAmount: number;
    totalPaid: number;
    totalRetainage: number;
    remainingBalance: number;
    percentComplete: number;
    projectedFinalCost: number;
}>;
/**
 * Calculates retainage for payment
 *
 * @param contractId - Contract identifier
 * @param paymentAmount - Payment amount
 * @returns Retainage calculation
 *
 * @example
 * ```typescript
 * const retainage = await calculateRetainage('contract-123', 250000);
 * ```
 */
export declare function calculateRetainage(contractId: string, paymentAmount: number): Promise<{
    retainageAmount: number;
    netPayment: number;
    retainagePercentage: number;
}>;
/**
 * Tracks total retainage held
 *
 * @param contractId - Contract identifier
 * @returns Retainage tracking summary
 *
 * @example
 * ```typescript
 * const tracking = await trackRetainage('contract-123');
 * ```
 */
export declare function trackRetainage(contractId: string): Promise<{
    totalWithheld: number;
    totalReleased: number;
    currentBalance: number;
    retainagePercentage: number;
}>;
/**
 * Releases retainage
 *
 * @param contractId - Contract identifier
 * @param amount - Amount to release
 * @param reason - Release reason
 * @param userId - User releasing retainage
 * @returns Retainage release record
 *
 * @example
 * ```typescript
 * await releaseRetainage('contract-123', 75000, 'Substantial completion', 'admin-456');
 * ```
 */
export declare function releaseRetainage(contractId: string, amount: number, reason: string, userId: string): Promise<RetainageTracking>;
/**
 * Releases final retainage upon contract completion
 *
 * @param contractId - Contract identifier
 * @param userId - User releasing final retainage
 * @returns Final retainage release
 *
 * @example
 * ```typescript
 * await releaseFinalRetainage('contract-123', 'admin-456');
 * ```
 */
export declare function releaseFinalRetainage(contractId: string, userId: string): Promise<RetainageTracking>;
/**
 * Creates contract milestone
 *
 * @param milestone - Milestone data
 * @param userId - User creating milestone
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   contractId: 'contract-123',
 *   name: 'Foundation Complete',
 *   scheduledDate: new Date('2025-03-31'),
 *   paymentPercentage: 20
 * }, 'user-456');
 * ```
 */
export declare function createMilestone(milestone: Omit<ContractMilestone, 'id' | 'status' | 'paymentAmount' | 'isPaid' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ContractMilestone>;
/**
 * Updates milestone status
 *
 * @param milestoneId - Milestone identifier
 * @param status - New status
 * @param userId - User updating milestone
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await updateMilestoneStatus('milestone-123', MilestoneStatus.COMPLETED, 'user-456');
 * ```
 */
export declare function updateMilestoneStatus(milestoneId: string, status: MilestoneStatus, userId: string): Promise<ContractMilestone>;
/**
 * Verifies milestone completion
 *
 * @param milestoneId - Milestone identifier
 * @param userId - User verifying milestone
 * @returns Verified milestone
 *
 * @example
 * ```typescript
 * await verifyMilestone('milestone-123', 'inspector-456');
 * ```
 */
export declare function verifyMilestone(milestoneId: string, userId: string): Promise<ContractMilestone>;
/**
 * Gets overdue milestones
 *
 * @param contractId - Contract identifier
 * @returns Array of overdue milestones
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueMilestones('contract-123');
 * ```
 */
export declare function getOverdueMilestones(contractId: string): Promise<ContractMilestone[]>;
/**
 * Calculates milestone completion percentage
 *
 * @param contractId - Contract identifier
 * @returns Milestone completion percentage
 *
 * @example
 * ```typescript
 * const completion = await calculateMilestoneCompletion('contract-123');
 * ```
 */
export declare function calculateMilestoneCompletion(contractId: string): Promise<number>;
/**
 * Creates performance bond record
 *
 * @param bond - Bond data
 * @param userId - User creating bond record
 * @returns Created bond record
 *
 * @example
 * ```typescript
 * const bond = await createPerformanceBond({
 *   contractId: 'contract-123',
 *   bondType: BondType.PERFORMANCE_BOND,
 *   bondNumber: 'PB-2025-001',
 *   suretyCompany: 'ABC Surety',
 *   bondAmount: 1500000
 * }, 'user-456');
 * ```
 */
export declare function createPerformanceBond(bond: Omit<PerformanceBond, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>, userId: string): Promise<PerformanceBond>;
/**
 * Verifies bond validity
 *
 * @param bondId - Bond identifier
 * @param userId - User verifying bond
 * @returns Verified bond
 *
 * @example
 * ```typescript
 * await verifyBond('bond-123', 'admin-456');
 * ```
 */
export declare function verifyBond(bondId: string, userId: string): Promise<PerformanceBond>;
/**
 * Checks bond expiration
 *
 * @param contractId - Contract identifier
 * @returns Array of expiring bonds
 *
 * @example
 * ```typescript
 * const expiring = await checkBondExpiration('contract-123');
 * ```
 */
export declare function checkBondExpiration(contractId: string): Promise<PerformanceBond[]>;
/**
 * Creates insurance certificate record
 *
 * @param insurance - Insurance data
 * @param userId - User creating insurance record
 * @returns Created insurance record
 *
 * @example
 * ```typescript
 * const insurance = await createInsuranceCertificate({
 *   contractId: 'contract-123',
 *   insuranceType: InsuranceType.GENERAL_LIABILITY,
 *   policyNumber: 'GL-2025-001',
 *   coverageAmount: 2000000
 * }, 'user-456');
 * ```
 */
export declare function createInsuranceCertificate(insurance: Omit<InsuranceCertificate, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>, userId: string): Promise<InsuranceCertificate>;
/**
 * Verifies insurance certificate
 *
 * @param insuranceId - Insurance certificate identifier
 * @param userId - User verifying insurance
 * @returns Verified insurance certificate
 *
 * @example
 * ```typescript
 * await verifyInsurance('insurance-123', 'admin-456');
 * ```
 */
export declare function verifyInsurance(insuranceId: string, userId: string): Promise<InsuranceCertificate>;
/**
 * Checks insurance expiration and sends reminders
 *
 * @param contractId - Contract identifier
 * @returns Array of expiring insurance certificates
 *
 * @example
 * ```typescript
 * const expiring = await checkInsuranceExpiration('contract-123');
 * ```
 */
export declare function checkInsuranceExpiration(contractId: string): Promise<InsuranceCertificate[]>;
/**
 * Validates insurance compliance
 *
 * @param contractId - Contract identifier
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const compliance = await validateInsuranceCompliance('contract-123');
 * ```
 */
export declare function validateInsuranceCompliance(contractId: string): Promise<{
    isCompliant: boolean;
    requiredTypes: InsuranceType[];
    missingTypes: InsuranceType[];
    expiringTypes: InsuranceType[];
}>;
/**
 * Uploads contract document
 *
 * @param document - Document data
 * @param userId - User uploading document
 * @returns Created document record
 *
 * @example
 * ```typescript
 * const document = await uploadContractDocument({
 *   contractId: 'contract-123',
 *   documentType: ContractDocumentType.CONTRACT_AGREEMENT,
 *   title: 'Signed Contract Agreement',
 *   fileUrl: 's3://bucket/file.pdf'
 * }, 'user-456');
 * ```
 */
export declare function uploadContractDocument(document: Omit<ContractDocument, 'id' | 'uploadedDate' | 'isExecuted' | 'isSuperseded' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ContractDocument>;
/**
 * Marks document as executed
 *
 * @param documentId - Document identifier
 * @param userId - User marking as executed
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await markDocumentExecuted('document-123', 'admin-456');
 * ```
 */
export declare function markDocumentExecuted(documentId: string, userId: string): Promise<ContractDocument>;
/**
 * Supersedes document with newer version
 *
 * @param documentId - Document identifier
 * @param newDocumentId - New document identifier
 * @returns Updated documents
 *
 * @example
 * ```typescript
 * await supersedeDocument('old-document-123', 'new-document-456');
 * ```
 */
export declare function supersedeDocument(documentId: string, newDocumentId: string): Promise<{
    oldDocument: ContractDocument;
    newDocument: ContractDocument;
}>;
/**
 * Gets contract document history
 *
 * @param contractId - Contract identifier
 * @param documentType - Document type filter
 * @returns Document history
 *
 * @example
 * ```typescript
 * const history = await getDocumentHistory('contract-123', ContractDocumentType.AMENDMENT);
 * ```
 */
export declare function getDocumentHistory(contractId: string, documentType?: ContractDocumentType): Promise<ContractDocument[]>;
/**
 * Performs compliance check
 *
 * @param contractId - Contract identifier
 * @param checkType - Type of compliance check
 * @param userId - User performing check
 * @returns Compliance check result
 *
 * @example
 * ```typescript
 * const check = await performComplianceCheck('contract-123', 'insurance', 'admin-456');
 * ```
 */
export declare function performComplianceCheck(contractId: string, checkType: ComplianceCheck['checkType'], userId: string): Promise<ComplianceCheck>;
/**
 * Generates compliance report
 *
 * @param contractId - Contract identifier
 * @returns Comprehensive compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('contract-123');
 * ```
 */
export declare function generateComplianceReport(contractId: string): Promise<{
    contract: ConstructionContract;
    insuranceCompliance: boolean;
    bondCompliance: boolean;
    paymentCompliance: boolean;
    documentCompliance: boolean;
    overallCompliance: boolean;
    deficiencies: string[];
}>;
/**
 * Initiates contract closeout process
 *
 * @param contractId - Contract identifier
 * @param userId - User initiating closeout
 * @returns Closeout checklist
 *
 * @example
 * ```typescript
 * const closeout = await initiateContractCloseout('contract-123', 'admin-456');
 * ```
 */
export declare function initiateContractCloseout(contractId: string, userId: string): Promise<{
    contract: ConstructionContract;
    checklist: Array<{
        item: string;
        completed: boolean;
    }>;
}>;
/**
 * Completes contract closeout
 *
 * @param contractId - Contract identifier
 * @param userId - User completing closeout
 * @returns Closed contract
 *
 * @example
 * ```typescript
 * await completeContractCloseout('contract-123', 'admin-456');
 * ```
 */
export declare function completeContractCloseout(contractId: string, userId: string): Promise<ConstructionContract>;
/**
 * Contract Administration Controller
 * Provides RESTful API endpoints for contract management
 */
export declare class ContractAdministrationController {
    create(createDto: CreateContractDto): Promise<ConstructionContract>;
    findAll(status?: ContractStatus): Promise<never[]>;
    findOne(id: string): Promise<ConstructionContract>;
    updateStatus(id: string, statusDto: UpdateContractStatusDto): Promise<ConstructionContract>;
    createAmendment(id: string, amendmentDto: CreateAmendmentDto): Promise<ContractAmendment>;
    createPayment(id: string, paymentDto: CreatePaymentApplicationDto): Promise<PaymentApplication>;
    approvePayment(id: string, paymentId: string, approveDto: ApprovePaymentDto): Promise<PaymentApplication>;
    createMilestone(id: string, milestoneDto: CreateMilestoneDto): Promise<ContractMilestone>;
    addInsurance(id: string, insuranceDto: CreateInsuranceCertificateDto): Promise<InsuranceCertificate>;
    getCompliance(id: string): Promise<{
        contract: ConstructionContract;
        insuranceCompliance: boolean;
        bondCompliance: boolean;
        paymentCompliance: boolean;
        documentCompliance: boolean;
        overallCompliance: boolean;
        deficiencies: string[];
    }>;
    getPaymentSchedule(id: string): Promise<{
        totalContractAmount: number;
        totalPaid: number;
        totalRetainage: number;
        remainingBalance: number;
        percentComplete: number;
        projectedFinalCost: number;
    }>;
    getRetainage(id: string): Promise<{
        totalWithheld: number;
        totalReleased: number;
        currentBalance: number;
        retainagePercentage: number;
    }>;
}
declare const _default: {
    createContract: typeof createContract;
    generateContractNumber: typeof generateContractNumber;
    updateContractStatus: typeof updateContractStatus;
    modifyContractTerms: typeof modifyContractTerms;
    terminateContract: typeof terminateContract;
    issueNoticeToProceed: typeof issueNoticeToProceed;
    createAmendment: typeof createAmendment;
    submitAmendment: typeof submitAmendment;
    reviewAmendment: typeof reviewAmendment;
    executeAmendment: typeof executeAmendment;
    calculateAmendmentScheduleImpact: typeof calculateAmendmentScheduleImpact;
    createPaymentApplication: typeof createPaymentApplication;
    submitPaymentApplication: typeof submitPaymentApplication;
    reviewPaymentApplication: typeof reviewPaymentApplication;
    approvePaymentApplication: typeof approvePaymentApplication;
    processPayment: typeof processPayment;
    calculatePaymentSchedule: typeof calculatePaymentSchedule;
    calculateRetainage: typeof calculateRetainage;
    trackRetainage: typeof trackRetainage;
    releaseRetainage: typeof releaseRetainage;
    releaseFinalRetainage: typeof releaseFinalRetainage;
    createMilestone: typeof createMilestone;
    updateMilestoneStatus: typeof updateMilestoneStatus;
    verifyMilestone: typeof verifyMilestone;
    getOverdueMilestones: typeof getOverdueMilestones;
    calculateMilestoneCompletion: typeof calculateMilestoneCompletion;
    createPerformanceBond: typeof createPerformanceBond;
    verifyBond: typeof verifyBond;
    checkBondExpiration: typeof checkBondExpiration;
    createInsuranceCertificate: typeof createInsuranceCertificate;
    verifyInsurance: typeof verifyInsurance;
    checkInsuranceExpiration: typeof checkInsuranceExpiration;
    validateInsuranceCompliance: typeof validateInsuranceCompliance;
    uploadContractDocument: typeof uploadContractDocument;
    markDocumentExecuted: typeof markDocumentExecuted;
    supersedeDocument: typeof supersedeDocument;
    getDocumentHistory: typeof getDocumentHistory;
    performComplianceCheck: typeof performComplianceCheck;
    generateComplianceReport: typeof generateComplianceReport;
    initiateContractCloseout: typeof initiateContractCloseout;
    completeContractCloseout: typeof completeContractCloseout;
    ContractAdministrationController: typeof ContractAdministrationController;
};
export default _default;
//# sourceMappingURL=construction-contract-administration-kit.d.ts.map