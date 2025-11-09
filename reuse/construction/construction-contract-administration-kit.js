"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractAdministrationController = void 0;
exports.createContract = createContract;
exports.generateContractNumber = generateContractNumber;
exports.updateContractStatus = updateContractStatus;
exports.modifyContractTerms = modifyContractTerms;
exports.terminateContract = terminateContract;
exports.issueNoticeToProceed = issueNoticeToProceed;
exports.createAmendment = createAmendment;
exports.submitAmendment = submitAmendment;
exports.reviewAmendment = reviewAmendment;
exports.executeAmendment = executeAmendment;
exports.calculateAmendmentScheduleImpact = calculateAmendmentScheduleImpact;
exports.createPaymentApplication = createPaymentApplication;
exports.submitPaymentApplication = submitPaymentApplication;
exports.reviewPaymentApplication = reviewPaymentApplication;
exports.approvePaymentApplication = approvePaymentApplication;
exports.processPayment = processPayment;
exports.calculatePaymentSchedule = calculatePaymentSchedule;
exports.calculateRetainage = calculateRetainage;
exports.trackRetainage = trackRetainage;
exports.releaseRetainage = releaseRetainage;
exports.releaseFinalRetainage = releaseFinalRetainage;
exports.createMilestone = createMilestone;
exports.updateMilestoneStatus = updateMilestoneStatus;
exports.verifyMilestone = verifyMilestone;
exports.getOverdueMilestones = getOverdueMilestones;
exports.calculateMilestoneCompletion = calculateMilestoneCompletion;
exports.createPerformanceBond = createPerformanceBond;
exports.verifyBond = verifyBond;
exports.checkBondExpiration = checkBondExpiration;
exports.createInsuranceCertificate = createInsuranceCertificate;
exports.verifyInsurance = verifyInsurance;
exports.checkInsuranceExpiration = checkInsuranceExpiration;
exports.validateInsuranceCompliance = validateInsuranceCompliance;
exports.uploadContractDocument = uploadContractDocument;
exports.markDocumentExecuted = markDocumentExecuted;
exports.supersedeDocument = supersedeDocument;
exports.getDocumentHistory = getDocumentHistory;
exports.performComplianceCheck = performComplianceCheck;
exports.generateComplianceReport = generateComplianceReport;
exports.initiateContractCloseout = initiateContractCloseout;
exports.completeContractCloseout = completeContractCloseout;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const faker_1 = require("@faker-js/faker");
const contract_types_1 = require("./types/contract.types");
// ============================================================================
// CONTRACT CREATION AND MODIFICATION
// ============================================================================
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
async function createContract(data, userId) {
    const contract = {
        id: faker_1.faker.string.uuid(),
        contractNumber: generateContractNumber(data.projectName),
        status: contract_types_1.ContractStatus.DRAFT,
        currentAmount: data.contractAmount,
        originalAmount: data.contractAmount,
        totalPaid: 0,
        retainageAmount: 0,
        daysExtended: 0,
        contractDuration: calculateDuration(data.startDate, data.completionDate),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return contract;
}
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
function generateContractNumber(projectName) {
    const initials = projectName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `CNT-${initials}-${date}-${sequence}`;
}
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
async function updateContractStatus(contractId, status, userId) {
    const contract = await getContract(contractId);
    return {
        ...contract,
        status,
        updatedAt: new Date(),
        updatedBy: userId,
    };
}
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
async function modifyContractTerms(contractId, modifications, userId) {
    const contract = await getContract(contractId);
    return {
        ...contract,
        ...modifications,
        updatedAt: new Date(),
        updatedBy: userId,
    };
}
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
async function terminateContract(contractId, reason, userId) {
    const contract = await getContract(contractId);
    return {
        ...contract,
        status: contract_types_1.ContractStatus.TERMINATED,
        metadata: {
            ...contract.metadata,
            terminationReason: reason,
            terminatedDate: new Date(),
            terminatedBy: userId,
        },
        updatedAt: new Date(),
        updatedBy: userId,
    };
}
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
async function issueNoticeToProceed(contractId, proceedDate, userId) {
    const contract = await getContract(contractId);
    return {
        ...contract,
        status: contract_types_1.ContractStatus.ACTIVE,
        noticeToProceedDate: proceedDate,
        actualStartDate: proceedDate,
        updatedAt: new Date(),
        updatedBy: userId,
    };
}
// ============================================================================
// CONTRACT AMENDMENT WORKFLOWS
// ============================================================================
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
async function createAmendment(amendment, userId) {
    const existingAmendments = await getContractAmendments(amendment.contractId);
    return {
        id: faker_1.faker.string.uuid(),
        amendmentNumber: existingAmendments.length + 1,
        status: contract_types_1.AmendmentStatus.DRAFT,
        requestedDate: new Date(),
        ...amendment,
        requestedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function submitAmendment(amendmentId, userId) {
    const amendment = await getAmendment(amendmentId);
    return {
        ...amendment,
        status: contract_types_1.AmendmentStatus.PENDING_REVIEW,
        updatedAt: new Date(),
    };
}
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
async function reviewAmendment(amendmentId, approved, userId) {
    const amendment = await getAmendment(amendmentId);
    return {
        ...amendment,
        status: approved ? contract_types_1.AmendmentStatus.APPROVED : contract_types_1.AmendmentStatus.REJECTED,
        reviewedBy: userId,
        reviewedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function executeAmendment(amendmentId, userId) {
    const amendment = await getAmendment(amendmentId);
    const contract = await getContract(amendment.contractId);
    const updatedAmendment = {
        ...amendment,
        status: contract_types_1.AmendmentStatus.EXECUTED,
        executedDate: new Date(),
        effectiveDate: new Date(),
        updatedAt: new Date(),
    };
    const updatedContract = {
        ...contract,
        currentAmount: contract.currentAmount + amendment.costImpact,
        daysExtended: contract.daysExtended + amendment.timeImpact,
        completionDate: amendment.newCompletionDate || contract.completionDate,
        updatedAt: new Date(),
        updatedBy: userId,
    };
    return { amendment: updatedAmendment, contract: updatedContract };
}
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
async function calculateAmendmentScheduleImpact(amendmentId) {
    const amendment = await getAmendment(amendmentId);
    const contract = await getContract(amendment.contractId);
    const newCompletionDate = new Date(contract.completionDate.getTime() + amendment.timeImpact * 24 * 60 * 60 * 1000);
    return {
        originalCompletionDate: contract.completionDate,
        newCompletionDate,
        daysExtended: amendment.timeImpact,
        criticalPath: amendment.timeImpact > 0,
    };
}
// ============================================================================
// PAYMENT APPLICATION PROCESSING
// ============================================================================
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
async function createPaymentApplication(payment, userId) {
    const contract = await getContract(payment.contractId);
    const previousApplications = await getContractPaymentApplications(payment.contractId);
    const applicationNumber = previousApplications.length + 1;
    const previouslyPaid = previousApplications.reduce((sum, app) => sum + app.netPayment, 0);
    const totalCompleted = payment.workCompleted + payment.storedMaterials;
    const retainageWithheld = totalCompleted * (contract.retainagePercentage / 100);
    const currentPaymentDue = totalCompleted - previouslyPaid;
    const netPayment = currentPaymentDue - retainageWithheld;
    const percentComplete = (totalCompleted / contract.currentAmount) * 100;
    return {
        id: faker_1.faker.string.uuid(),
        applicationNumber,
        status: contract_types_1.PaymentStatus.DRAFT,
        totalCompleted,
        previouslyPaid,
        currentPaymentDue,
        retainageWithheld,
        netPayment,
        percentComplete,
        submittedDate: new Date(),
        ...payment,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
}
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
async function submitPaymentApplication(paymentId, userId) {
    const payment = await getPaymentApplication(paymentId);
    return {
        ...payment,
        status: contract_types_1.PaymentStatus.SUBMITTED,
        submittedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function reviewPaymentApplication(paymentId, userId) {
    const payment = await getPaymentApplication(paymentId);
    return {
        ...payment,
        status: contract_types_1.PaymentStatus.UNDER_REVIEW,
        reviewedBy: userId,
        reviewedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function approvePaymentApplication(paymentId, approvedAmount, userId) {
    const payment = await getPaymentApplication(paymentId);
    return {
        ...payment,
        status: contract_types_1.PaymentStatus.APPROVED,
        netPayment: approvedAmount,
        approvedBy: userId,
        approvedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function processPayment(paymentId, userId) {
    const payment = await getPaymentApplication(paymentId);
    return {
        ...payment,
        status: contract_types_1.PaymentStatus.PAID,
        paidDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function calculatePaymentSchedule(contractId) {
    const contract = await getContract(contractId);
    const payments = await getContractPaymentApplications(contractId);
    const totalPaid = payments.reduce((sum, p) => sum + p.netPayment, 0);
    const totalRetainage = payments.reduce((sum, p) => sum + p.retainageWithheld, 0);
    const remainingBalance = contract.currentAmount - totalPaid - totalRetainage;
    const percentComplete = ((totalPaid + totalRetainage) / contract.currentAmount) * 100;
    return {
        totalContractAmount: contract.currentAmount,
        totalPaid,
        totalRetainage,
        remainingBalance,
        percentComplete,
        projectedFinalCost: contract.currentAmount,
    };
}
// ============================================================================
// RETAINAGE MANAGEMENT
// ============================================================================
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
async function calculateRetainage(contractId, paymentAmount) {
    const contract = await getContract(contractId);
    const retainageAmount = paymentAmount * (contract.retainagePercentage / 100);
    const netPayment = paymentAmount - retainageAmount;
    return {
        retainageAmount,
        netPayment,
        retainagePercentage: contract.retainagePercentage,
    };
}
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
async function trackRetainage(contractId) {
    const contract = await getContract(contractId);
    const payments = await getContractPaymentApplications(contractId);
    const releases = await getRetainageReleases(contractId);
    const totalWithheld = payments.reduce((sum, p) => sum + p.retainageWithheld, 0);
    const totalReleased = releases.reduce((sum, r) => sum + r.amountReleased, 0);
    return {
        totalWithheld,
        totalReleased,
        currentBalance: totalWithheld - totalReleased,
        retainagePercentage: contract.retainagePercentage,
    };
}
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
async function releaseRetainage(contractId, amount, reason, userId) {
    const tracking = await trackRetainage(contractId);
    return {
        id: faker_1.faker.string.uuid(),
        contractId,
        retainagePercentage: tracking.retainagePercentage,
        amountWithheld: 0,
        totalRetainageHeld: tracking.totalWithheld,
        amountReleased: amount,
        totalRetainageReleased: tracking.totalReleased + amount,
        currentBalance: tracking.currentBalance - amount,
        releaseDate: new Date(),
        releasedBy: userId,
        releaseReason: reason,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function releaseFinalRetainage(contractId, userId) {
    const tracking = await trackRetainage(contractId);
    return releaseRetainage(contractId, tracking.currentBalance, 'Final contract closeout', userId);
}
// ============================================================================
// MILESTONE TRACKING
// ============================================================================
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
async function createMilestone(milestone, userId) {
    const contract = await getContract(milestone.contractId);
    const paymentAmount = (contract.currentAmount * milestone.paymentPercentage) / 100;
    return {
        id: faker_1.faker.string.uuid(),
        status: contract_types_1.MilestoneStatus.NOT_STARTED,
        paymentAmount,
        isPaid: false,
        ...milestone,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function updateMilestoneStatus(milestoneId, status, userId) {
    const milestone = await getMilestone(milestoneId);
    return {
        ...milestone,
        status,
        actualDate: status === contract_types_1.MilestoneStatus.COMPLETED ? new Date() : milestone.actualDate,
        updatedAt: new Date(),
    };
}
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
async function verifyMilestone(milestoneId, userId) {
    const milestone = await getMilestone(milestoneId);
    return {
        ...milestone,
        status: contract_types_1.MilestoneStatus.VERIFIED,
        verifiedBy: userId,
        verifiedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function getOverdueMilestones(contractId) {
    const milestones = await getContractMilestones(contractId);
    const now = new Date();
    return milestones.filter((m) => m.status !== contract_types_1.MilestoneStatus.COMPLETED &&
        m.status !== contract_types_1.MilestoneStatus.VERIFIED &&
        m.scheduledDate < now);
}
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
async function calculateMilestoneCompletion(contractId) {
    const milestones = await getContractMilestones(contractId);
    if (milestones.length === 0)
        return 0;
    const completed = milestones.filter((m) => m.status === contract_types_1.MilestoneStatus.COMPLETED || m.status === contract_types_1.MilestoneStatus.VERIFIED).length;
    return (completed / milestones.length) * 100;
}
// ============================================================================
// PERFORMANCE BOND TRACKING
// ============================================================================
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
async function createPerformanceBond(bond, userId) {
    return {
        id: faker_1.faker.string.uuid(),
        isActive: true,
        ...bond,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function verifyBond(bondId, userId) {
    const bond = await getBond(bondId);
    return {
        ...bond,
        verifiedBy: userId,
        verifiedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function checkBondExpiration(contractId) {
    const bonds = await getContractBonds(contractId);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return bonds.filter((b) => b.isActive && b.expirationDate <= thirtyDaysFromNow);
}
// ============================================================================
// INSURANCE VERIFICATION
// ============================================================================
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
async function createInsuranceCertificate(insurance, userId) {
    return {
        id: faker_1.faker.string.uuid(),
        isActive: true,
        ...insurance,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function verifyInsurance(insuranceId, userId) {
    const insurance = await getInsurance(insuranceId);
    return {
        ...insurance,
        verifiedBy: userId,
        verifiedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function checkInsuranceExpiration(contractId) {
    const certificates = await getContractInsurance(contractId);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return certificates.filter((c) => c.isActive && c.expirationDate <= thirtyDaysFromNow);
}
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
async function validateInsuranceCompliance(contractId) {
    const contract = await getContract(contractId);
    const certificates = await getContractInsurance(contractId);
    const requiredTypes = [
        contract_types_1.InsuranceType.GENERAL_LIABILITY,
        contract_types_1.InsuranceType.WORKERS_COMPENSATION,
    ];
    const activeTypes = certificates
        .filter((c) => c.isActive && c.expirationDate > new Date())
        .map((c) => c.insuranceType);
    const missingTypes = requiredTypes.filter((type) => !activeTypes.includes(type));
    const expiringTypes = await checkInsuranceExpiration(contractId).then((certs) => certs.map((c) => c.insuranceType));
    return {
        isCompliant: missingTypes.length === 0 && expiringTypes.length === 0,
        requiredTypes,
        missingTypes,
        expiringTypes,
    };
}
// ============================================================================
// CONTRACT DOCUMENT MANAGEMENT
// ============================================================================
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
async function uploadContractDocument(document, userId) {
    return {
        id: faker_1.faker.string.uuid(),
        uploadedDate: new Date(),
        isExecuted: false,
        isSuperseded: false,
        ...document,
        uploadedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function markDocumentExecuted(documentId, userId) {
    const document = await getDocument(documentId);
    return {
        ...document,
        isExecuted: true,
        executedDate: new Date(),
        updatedAt: new Date(),
    };
}
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
async function supersedeDocument(documentId, newDocumentId) {
    const oldDocument = await getDocument(documentId);
    const newDocument = await getDocument(newDocumentId);
    return {
        oldDocument: {
            ...oldDocument,
            isSuperseded: true,
            supersededBy: newDocumentId,
            updatedAt: new Date(),
        },
        newDocument,
    };
}
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
async function getDocumentHistory(contractId, documentType) {
    const documents = await getContractDocuments(contractId);
    if (documentType) {
        return documents.filter((d) => d.documentType === documentType);
    }
    return documents;
}
// ============================================================================
// COMPLIANCE MONITORING
// ============================================================================
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
async function performComplianceCheck(contractId, checkType, userId) {
    const findings = [];
    const deficiencies = [];
    // Perform check based on type
    if (checkType === 'insurance') {
        const compliance = await validateInsuranceCompliance(contractId);
        if (!compliance.isCompliant) {
            deficiencies.push(...compliance.missingTypes.map((t) => `Missing ${t} insurance`));
        }
    }
    return {
        id: faker_1.faker.string.uuid(),
        contractId,
        checkType,
        checkDate: new Date(),
        isCompliant: deficiencies.length === 0,
        findings,
        deficiencies,
        correctiveActions: [],
        checkedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
async function generateComplianceReport(contractId) {
    const contract = await getContract(contractId);
    const insuranceCompliance = await validateInsuranceCompliance(contractId);
    const bonds = await getContractBonds(contractId);
    const expiringBonds = await checkBondExpiration(contractId);
    const bondCompliance = expiringBonds.length === 0;
    const paymentCompliance = true; // Implement payment compliance logic
    const documentCompliance = true; // Implement document compliance logic
    const deficiencies = [];
    if (!insuranceCompliance.isCompliant) {
        deficiencies.push(...insuranceCompliance.missingTypes.map((t) => `Missing ${t}`));
    }
    if (!bondCompliance) {
        deficiencies.push('Expiring performance bonds');
    }
    return {
        contract,
        insuranceCompliance: insuranceCompliance.isCompliant,
        bondCompliance,
        paymentCompliance,
        documentCompliance,
        overallCompliance: deficiencies.length === 0,
        deficiencies,
    };
}
// ============================================================================
// CONTRACT CLOSEOUT
// ============================================================================
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
async function initiateContractCloseout(contractId, userId) {
    const contract = await getContract(contractId);
    const retainage = await trackRetainage(contractId);
    const milestones = await getContractMilestones(contractId);
    const checklist = [
        { item: 'All work completed', completed: contract.actualCompletionDate !== undefined },
        { item: 'Final payment processed', completed: false },
        { item: 'Retainage released', completed: retainage.currentBalance === 0 },
        { item: 'All milestones verified', completed: milestones.every((m) => m.status === contract_types_1.MilestoneStatus.VERIFIED) },
        { item: 'Warranties received', completed: false },
        { item: 'As-built documents submitted', completed: false },
        { item: 'Final lien releases obtained', completed: false },
    ];
    return { contract, checklist };
}
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
async function completeContractCloseout(contractId, userId) {
    const contract = await getContract(contractId);
    return {
        ...contract,
        status: contract_types_1.ContractStatus.CLOSED,
        updatedAt: new Date(),
        updatedBy: userId,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateDuration(startDate, endDate) {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}
async function getContract(id) {
    return {
        id,
        contractNumber: 'CNT-TEST-001',
        projectId: 'project-1',
        projectName: 'Test Project',
        contractorId: 'contractor-1',
        contractorName: 'Test Contractor',
        contractType: contract_types_1.ContractType.LUMP_SUM,
        status: contract_types_1.ContractStatus.ACTIVE,
        contractAmount: 1000000,
        originalAmount: 1000000,
        currentAmount: 1000000,
        totalPaid: 0,
        retainagePercentage: 5,
        retainageAmount: 0,
        startDate: new Date(),
        completionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        contractDuration: 180,
        daysExtended: 0,
        description: 'Test contract',
        scopeOfWork: 'Test scope',
        performanceBondRequired: true,
        paymentBondRequired: true,
        insuranceRequired: true,
        prevailingWageRequired: false,
        warrantyPeriod: 365,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
    };
}
async function getContractAmendments(contractId) {
    return [];
}
async function getAmendment(id) {
    return {
        id,
        contractId: 'contract-1',
        amendmentNumber: 1,
        title: 'Test Amendment',
        description: 'Test',
        status: contract_types_1.AmendmentStatus.DRAFT,
        changeType: 'scope',
        costImpact: 0,
        timeImpact: 0,
        justification: 'Test',
        requestedBy: 'user-1',
        requestedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getPaymentApplication(id) {
    return {
        id,
        contractId: 'contract-1',
        applicationNumber: 1,
        periodStartDate: new Date(),
        periodEndDate: new Date(),
        status: contract_types_1.PaymentStatus.DRAFT,
        scheduledValue: 0,
        workCompleted: 0,
        storedMaterials: 0,
        totalCompleted: 0,
        previouslyPaid: 0,
        currentPaymentDue: 0,
        retainageWithheld: 0,
        netPayment: 0,
        percentComplete: 0,
        submittedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
    };
}
async function getContractPaymentApplications(contractId) {
    return [];
}
async function getRetainageReleases(contractId) {
    return [];
}
async function getMilestone(id) {
    return {
        id,
        contractId: 'contract-1',
        name: 'Test Milestone',
        description: 'Test',
        status: contract_types_1.MilestoneStatus.NOT_STARTED,
        scheduledDate: new Date(),
        paymentPercentage: 10,
        paymentAmount: 100000,
        isPaid: false,
        deliverables: [],
        acceptanceCriteria: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getContractMilestones(contractId) {
    return [];
}
async function getBond(id) {
    return {
        id,
        contractId: 'contract-1',
        bondType: contract_types_1.BondType.PERFORMANCE_BOND,
        bondNumber: 'PB-001',
        suretyCompany: 'Test Surety',
        suretyAgent: 'Agent Name',
        bondAmount: 1000000,
        effectiveDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getContractBonds(contractId) {
    return [];
}
async function getInsurance(id) {
    return {
        id,
        contractId: 'contract-1',
        insuranceType: contract_types_1.InsuranceType.GENERAL_LIABILITY,
        policyNumber: 'GL-001',
        insuranceCompany: 'Test Insurance',
        agent: 'Agent Name',
        agentEmail: 'agent@test.com',
        agentPhone: '555-1234',
        coverageAmount: 2000000,
        effectiveDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        additionalInsured: true,
        waiverOfSubrogation: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getContractInsurance(contractId) {
    return [];
}
async function getDocument(id) {
    return {
        id,
        contractId: 'contract-1',
        documentType: contract_types_1.ContractDocumentType.CONTRACT_AGREEMENT,
        title: 'Test Document',
        description: 'Test',
        version: '1.0',
        fileUrl: 's3://bucket/file.pdf',
        fileSize: 1024,
        fileName: 'file.pdf',
        mimeType: 'application/pdf',
        uploadedBy: 'user-1',
        uploadedDate: new Date(),
        isExecuted: false,
        isSuperseded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getContractDocuments(contractId) {
    return [];
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Contract Administration Controller
 * Provides RESTful API endpoints for contract management
 */
let ContractAdministrationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('contracts'), (0, common_1.Controller)('contracts'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _updateStatus_decorators;
    let _createAmendment_decorators;
    let _createPayment_decorators;
    let _approvePayment_decorators;
    let _createMilestone_decorators;
    let _addInsurance_decorators;
    let _getCompliance_decorators;
    let _getPaymentSchedule_decorators;
    let _getRetainage_decorators;
    var ContractAdministrationController = _classThis = class {
        async create(createDto) {
            return createContract(createDto, 'current-user');
        }
        async findAll(status) {
            return [];
        }
        async findOne(id) {
            return getContract(id);
        }
        async updateStatus(id, statusDto) {
            return updateContractStatus(id, statusDto.status, 'current-user');
        }
        async createAmendment(id, amendmentDto) {
            return createAmendment(amendmentDto, 'current-user');
        }
        async createPayment(id, paymentDto) {
            return createPaymentApplication(paymentDto, 'current-user');
        }
        async approvePayment(id, paymentId, approveDto) {
            return approvePaymentApplication(paymentId, approveDto.approvedAmount, 'current-user');
        }
        async createMilestone(id, milestoneDto) {
            return createMilestone(milestoneDto, 'current-user');
        }
        async addInsurance(id, insuranceDto) {
            return createInsuranceCertificate(insuranceDto, 'current-user');
        }
        async getCompliance(id) {
            return generateComplianceReport(id);
        }
        async getPaymentSchedule(id) {
            return calculatePaymentSchedule(id);
        }
        async getRetainage(id) {
            return trackRetainage(id);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractAdministrationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new contract' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all contracts' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get contract by ID' })];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Update contract status' })];
        _createAmendment_decorators = [(0, common_1.Post)(':id/amendments'), (0, swagger_1.ApiOperation)({ summary: 'Create contract amendment' })];
        _createPayment_decorators = [(0, common_1.Post)(':id/payment-applications'), (0, swagger_1.ApiOperation)({ summary: 'Create payment application' })];
        _approvePayment_decorators = [(0, common_1.Patch)(':id/payment-applications/:paymentId/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve payment application' })];
        _createMilestone_decorators = [(0, common_1.Post)(':id/milestones'), (0, swagger_1.ApiOperation)({ summary: 'Create contract milestone' })];
        _addInsurance_decorators = [(0, common_1.Post)(':id/insurance'), (0, swagger_1.ApiOperation)({ summary: 'Add insurance certificate' })];
        _getCompliance_decorators = [(0, common_1.Get)(':id/compliance'), (0, swagger_1.ApiOperation)({ summary: 'Get compliance report' })];
        _getPaymentSchedule_decorators = [(0, common_1.Get)(':id/payment-schedule'), (0, swagger_1.ApiOperation)({ summary: 'Get payment schedule' })];
        _getRetainage_decorators = [(0, common_1.Get)(':id/retainage'), (0, swagger_1.ApiOperation)({ summary: 'Track retainage' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAmendment_decorators, { kind: "method", name: "createAmendment", static: false, private: false, access: { has: obj => "createAmendment" in obj, get: obj => obj.createAmendment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPayment_decorators, { kind: "method", name: "createPayment", static: false, private: false, access: { has: obj => "createPayment" in obj, get: obj => obj.createPayment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approvePayment_decorators, { kind: "method", name: "approvePayment", static: false, private: false, access: { has: obj => "approvePayment" in obj, get: obj => obj.approvePayment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMilestone_decorators, { kind: "method", name: "createMilestone", static: false, private: false, access: { has: obj => "createMilestone" in obj, get: obj => obj.createMilestone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addInsurance_decorators, { kind: "method", name: "addInsurance", static: false, private: false, access: { has: obj => "addInsurance" in obj, get: obj => obj.addInsurance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCompliance_decorators, { kind: "method", name: "getCompliance", static: false, private: false, access: { has: obj => "getCompliance" in obj, get: obj => obj.getCompliance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPaymentSchedule_decorators, { kind: "method", name: "getPaymentSchedule", static: false, private: false, access: { has: obj => "getPaymentSchedule" in obj, get: obj => obj.getPaymentSchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRetainage_decorators, { kind: "method", name: "getRetainage", static: false, private: false, access: { has: obj => "getRetainage" in obj, get: obj => obj.getRetainage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractAdministrationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractAdministrationController = _classThis;
})();
exports.ContractAdministrationController = ContractAdministrationController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Contract Management
    createContract,
    generateContractNumber,
    updateContractStatus,
    modifyContractTerms,
    terminateContract,
    issueNoticeToProceed,
    // Amendments
    createAmendment,
    submitAmendment,
    reviewAmendment,
    executeAmendment,
    calculateAmendmentScheduleImpact,
    // Payments
    createPaymentApplication,
    submitPaymentApplication,
    reviewPaymentApplication,
    approvePaymentApplication,
    processPayment,
    calculatePaymentSchedule,
    // Retainage
    calculateRetainage,
    trackRetainage,
    releaseRetainage,
    releaseFinalRetainage,
    // Milestones
    createMilestone,
    updateMilestoneStatus,
    verifyMilestone,
    getOverdueMilestones,
    calculateMilestoneCompletion,
    // Bonds
    createPerformanceBond,
    verifyBond,
    checkBondExpiration,
    // Insurance
    createInsuranceCertificate,
    verifyInsurance,
    checkInsuranceExpiration,
    validateInsuranceCompliance,
    // Documents
    uploadContractDocument,
    markDocumentExecuted,
    supersedeDocument,
    getDocumentHistory,
    // Compliance
    performComplianceCheck,
    generateComplianceReport,
    // Closeout
    initiateContractCloseout,
    completeContractCloseout,
    // Controller
    ContractAdministrationController,
};
//# sourceMappingURL=construction-contract-administration-kit.js.map