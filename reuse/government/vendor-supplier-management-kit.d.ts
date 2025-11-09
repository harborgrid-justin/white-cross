/**
 * LOC: VENDSUPP1234567
 * File: /reuse/government/vendor-supplier-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Vendor management controllers
 *   - Procurement workflow engines
 */
/**
 * File: /reuse/government/vendor-supplier-management-kit.ts
 * Locator: WC-GOV-VEND-001
 * Purpose: Comprehensive Vendor & Supplier Management Utilities - Government procurement and vendor lifecycle
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Procurement controllers, vendor services, payment processing, diversity reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for vendor registration, certification tracking, performance evaluation, payments, 1099 reporting
 *
 * LLM Context: Enterprise-grade government vendor management system for procurement compliance.
 * Provides vendor lifecycle management, certification tracking (MBE/WBE/DBE), performance evaluation,
 * payment processing, 1099 reporting, insurance verification, contract management, diversity reporting,
 * dispute resolution, debarment checking, payment terms, portal integration, compliance validation.
 */
import { Sequelize, Transaction } from 'sequelize';
interface VendorRegistration {
    vendorName: string;
    taxId: string;
    businessType: 'CORPORATION' | 'LLC' | 'SOLE_PROPRIETORSHIP' | 'PARTNERSHIP' | 'NONPROFIT';
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    bankingInfo?: {
        accountNumber: string;
        routingNumber: string;
        bankName: string;
    };
}
interface VendorCertification {
    certificationType: 'MBE' | 'WBE' | 'DBE' | 'SDVOSB' | 'HUBZone' | '8A' | 'VOSB';
    certificationNumber: string;
    issuingAgency: string;
    issueDate: Date;
    expirationDate: Date;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    documentPath?: string;
}
interface VendorPerformance {
    vendorId: number;
    evaluationPeriod: {
        startDate: Date;
        endDate: Date;
    };
    qualityRating: number;
    deliveryRating: number;
    serviceRating: number;
    complianceRating: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    evaluatedBy: string;
    evaluatedAt: Date;
}
interface VendorPayment {
    vendorId: number;
    invoiceNumber: string;
    invoiceDate: Date;
    invoiceAmount: number;
    paymentAmount: number;
    paymentDate?: Date;
    paymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'CARD';
    paymentStatus: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'REJECTED' | 'CANCELLED';
    referenceNumber?: string;
    purchaseOrderNumber?: string;
    description: string;
}
interface Form1099Data {
    vendorId: number;
    taxYear: number;
    totalPayments: number;
    form1099Type: '1099-NEC' | '1099-MISC' | '1099-K';
    boxAmounts: Record<string, number>;
    withholdingAmount: number;
    filed: boolean;
    filedDate?: Date;
    corrected: boolean;
}
interface VendorInsurance {
    vendorId: number;
    insuranceType: 'GENERAL_LIABILITY' | 'WORKERS_COMP' | 'PROFESSIONAL_LIABILITY' | 'AUTO' | 'UMBRELLA';
    policyNumber: string;
    insuranceCarrier: string;
    coverageAmount: number;
    effectiveDate: Date;
    expirationDate: Date;
    verified: boolean;
    certificateOnFile: boolean;
    documentPath?: string;
}
interface VendorContract {
    contractNumber: string;
    vendorId: number;
    contractType: 'FIXED_PRICE' | 'TIME_AND_MATERIALS' | 'COST_PLUS' | 'BLANKET_PO' | 'IDIQ';
    contractAmount: number;
    startDate: Date;
    endDate: Date;
    status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED';
    renewalOptions?: number;
    performanceBond?: number;
    paymentBond?: number;
}
interface DiversityMetrics {
    fiscalYear: number;
    totalSpend: number;
    mbeSpend: number;
    wbeSpend: number;
    dbeSpend: number;
    veteranSpend: number;
    smallBusinessSpend: number;
    mbePercent: number;
    wbePercent: number;
    dbePercent: number;
}
interface VendorDispute {
    disputeId: string;
    vendorId: number;
    disputeType: 'PAYMENT' | 'CONTRACT' | 'PERFORMANCE' | 'COMPLIANCE' | 'OTHER';
    description: string;
    filedBy: string;
    filedDate: Date;
    status: 'OPEN' | 'UNDER_REVIEW' | 'MEDIATION' | 'RESOLVED' | 'ESCALATED';
    resolution?: string;
    resolvedBy?: string;
    resolvedDate?: Date;
}
interface DebarmentCheck {
    vendorId: number;
    vendorName: string;
    taxId: string;
    checkDate: Date;
    samChecked: boolean;
    epslsChecked: boolean;
    stateChecked: boolean;
    debarred: boolean;
    debarmentDetails?: {
        source: string;
        reason: string;
        effectiveDate: Date;
        expirationDate?: Date;
    };
}
interface PaymentTerms {
    vendorId: number;
    terms: 'NET_10' | 'NET_15' | 'NET_30' | 'NET_45' | 'NET_60' | 'IMMEDIATE' | 'CUSTOM';
    discountPercent?: number;
    discountDays?: number;
    lateFeePercent?: number;
    notes?: string;
}
/**
 * Sequelize model for Vendor Management with registration, certification, and compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Vendor model
 *
 * @example
 * ```typescript
 * const Vendor = createVendorModel(sequelize);
 * const vendor = await Vendor.create({
 *   vendorNumber: 'VND-2025-001',
 *   vendorName: 'ABC Construction Corp',
 *   taxId: '12-3456789',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export declare const createVendorModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        vendorNumber: string;
        vendorName: string;
        taxId: string;
        businessType: string;
        contactName: string;
        contactEmail: string;
        contactPhone: string;
        addressStreet: string;
        addressCity: string;
        addressState: string;
        addressZipCode: string;
        addressCountry: string;
        status: string;
        registrationDate: Date;
        approvedBy: string | null;
        approvedAt: Date | null;
        debarred: boolean;
        debarmentReason: string | null;
        performanceScore: number;
        totalContracts: number;
        totalSpend: number;
        bankingInfo: Record<string, any>;
        certifications: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Vendor Certifications with diversity and compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorCertification model
 *
 * @example
 * ```typescript
 * const VendorCertification = createVendorCertificationModel(sequelize);
 * const cert = await VendorCertification.create({
 *   vendorId: 1,
 *   certificationType: 'MBE',
 *   certificationNumber: 'MBE-2025-001',
 *   issuingAgency: 'NMSDC'
 * });
 * ```
 */
export declare const createVendorCertificationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        vendorId: number;
        certificationType: string;
        certificationNumber: string;
        issuingAgency: string;
        issueDate: Date;
        expirationDate: Date;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        documentPath: string | null;
        status: string;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Vendor Payments with invoice and payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorPayment model
 *
 * @example
 * ```typescript
 * const VendorPayment = createVendorPaymentModel(sequelize);
 * const payment = await VendorPayment.create({
 *   vendorId: 1,
 *   invoiceNumber: 'INV-2025-001',
 *   invoiceAmount: 15000,
 *   paymentMethod: 'ACH'
 * });
 * ```
 */
export declare const createVendorPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        paymentNumber: string;
        vendorId: number;
        invoiceNumber: string;
        invoiceDate: Date;
        invoiceAmount: number;
        paymentAmount: number;
        paymentDate: Date | null;
        paymentMethod: string;
        paymentStatus: string;
        referenceNumber: string | null;
        purchaseOrderNumber: string | null;
        description: string;
        fiscalYear: number;
        form1099Reportable: boolean;
        processedBy: string | null;
        approvedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Registers a new vendor with validation and initial setup.
 *
 * @param {VendorRegistration} registrationData - Vendor registration information
 * @param {string} registeredBy - User performing registration
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created vendor record
 *
 * @example
 * ```typescript
 * const vendor = await registerVendor({
 *   vendorName: 'ABC Construction Corp',
 *   taxId: '12-3456789',
 *   businessType: 'CORPORATION',
 *   contactName: 'John Doe',
 *   contactEmail: 'john@abc.com',
 *   contactPhone: '555-1234',
 *   address: {
 *     street: '123 Main St',
 *     city: 'Springfield',
 *     state: 'IL',
 *     zipCode: '62701',
 *     country: 'US'
 *   }
 * }, 'admin.user');
 * ```
 */
export declare const registerVendor: (registrationData: VendorRegistration, registeredBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates vendor registration data against government requirements.
 *
 * @param {VendorRegistration} registrationData - Registration data to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVendorRegistration(registrationData);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateVendorRegistration: (registrationData: VendorRegistration) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Approves vendor registration and activates vendor account.
 *
 * @param {number} vendorId - Vendor ID
 * @param {string} approvedBy - User approving registration
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Updated vendor record
 *
 * @example
 * ```typescript
 * const vendor = await approveVendorRegistration(5, 'procurement.manager');
 * ```
 */
export declare const approveVendorRegistration: (vendorId: number, approvedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates unique vendor number.
 *
 * @returns {string} Generated vendor number
 *
 * @example
 * ```typescript
 * const vendorNumber = generateVendorNumber();
 * // Returns: 'VND-2025-001234'
 * ```
 */
export declare const generateVendorNumber: () => string;
/**
 * Performs qualification assessment for vendor capabilities.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} qualificationCriteria - Qualification criteria
 * @returns {Promise<{ qualified: boolean; score: number; details: object }>} Qualification assessment
 *
 * @example
 * ```typescript
 * const assessment = await qualifyVendor(5, {
 *   financialStability: true,
 *   technicalCapability: true,
 *   pastPerformance: true,
 *   insuranceCoverage: true
 * });
 * ```
 */
export declare const qualifyVendor: (vendorId: number, qualificationCriteria: any) => Promise<{
    qualified: boolean;
    score: number;
    details: any;
}>;
/**
 * Adds certification to vendor profile.
 *
 * @param {VendorCertification} certificationData - Certification details
 * @param {string} addedBy - User adding certification
 * @returns {Promise<object>} Created certification record
 *
 * @example
 * ```typescript
 * const cert = await addVendorCertification({
 *   vendorId: 5,
 *   certificationType: 'MBE',
 *   certificationNumber: 'MBE-2025-001',
 *   issuingAgency: 'NMSDC',
 *   issueDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2027-01-01'),
 *   verified: false
 * }, 'admin');
 * ```
 */
export declare const addVendorCertification: (certificationData: VendorCertification, addedBy: string) => Promise<any>;
/**
 * Verifies vendor certification authenticity.
 *
 * @param {number} certificationId - Certification ID
 * @param {string} verifiedBy - User performing verification
 * @returns {Promise<object>} Updated certification with verification status
 *
 * @example
 * ```typescript
 * const verified = await verifyVendorCertification(10, 'compliance.officer');
 * ```
 */
export declare const verifyVendorCertification: (certificationId: number, verifiedBy: string) => Promise<any>;
/**
 * Retrieves certifications for a vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} [filters] - Optional filters (type, status)
 * @returns {Promise<VendorCertification[]>} Vendor certifications
 *
 * @example
 * ```typescript
 * const certs = await getVendorCertifications(5, { status: 'ACTIVE' });
 * ```
 */
export declare const getVendorCertifications: (vendorId: number, filters?: any) => Promise<VendorCertification[]>;
/**
 * Checks for expiring certifications and sends alerts.
 *
 * @param {number} daysBeforeExpiration - Number of days to look ahead
 * @returns {Promise<VendorCertification[]>} Expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await checkExpiringCertifications(30);
 * // Returns certifications expiring within 30 days
 * ```
 */
export declare const checkExpiringCertifications: (daysBeforeExpiration: number) => Promise<VendorCertification[]>;
/**
 * Renews vendor certification with new dates.
 *
 * @param {number} certificationId - Certification ID
 * @param {Date} newExpirationDate - New expiration date
 * @param {string} renewedBy - User renewing certification
 * @returns {Promise<object>} Updated certification
 *
 * @example
 * ```typescript
 * const renewed = await renewVendorCertification(10, new Date('2028-01-01'), 'admin');
 * ```
 */
export declare const renewVendorCertification: (certificationId: number, newExpirationDate: Date, renewedBy: string) => Promise<any>;
/**
 * Records vendor performance evaluation.
 *
 * @param {VendorPerformance} performanceData - Performance evaluation data
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created performance record
 *
 * @example
 * ```typescript
 * const evaluation = await recordVendorPerformance({
 *   vendorId: 5,
 *   evaluationPeriod: {
 *     startDate: new Date('2024-10-01'),
 *     endDate: new Date('2024-12-31')
 *   },
 *   qualityRating: 4.5,
 *   deliveryRating: 4.0,
 *   serviceRating: 5.0,
 *   complianceRating: 4.5,
 *   overallScore: 4.5,
 *   evaluatedBy: 'project.manager',
 *   evaluatedAt: new Date()
 * });
 * ```
 */
export declare const recordVendorPerformance: (performanceData: VendorPerformance, transaction?: Transaction) => Promise<any>;
/**
 * Calculates overall vendor performance score.
 *
 * @param {number} vendorId - Vendor ID
 * @param {Date} [startDate] - Optional start date for calculation
 * @param {Date} [endDate] - Optional end date for calculation
 * @returns {Promise<{ overallScore: number; evaluationCount: number; breakdown: object }>} Performance score
 *
 * @example
 * ```typescript
 * const score = await calculateVendorPerformanceScore(5);
 * console.log(`Overall score: ${score.overallScore}`);
 * ```
 */
export declare const calculateVendorPerformanceScore: (vendorId: number, startDate?: Date, endDate?: Date) => Promise<{
    overallScore: number;
    evaluationCount: number;
    breakdown: any;
}>;
/**
 * Retrieves performance history for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} [filters] - Optional filters (date range, rating threshold)
 * @returns {Promise<VendorPerformance[]>} Performance history
 *
 * @example
 * ```typescript
 * const history = await getVendorPerformanceHistory(5, { minScore: 4.0 });
 * ```
 */
export declare const getVendorPerformanceHistory: (vendorId: number, filters?: any) => Promise<VendorPerformance[]>;
/**
 * Identifies vendors with performance issues.
 *
 * @param {number} scoreThreshold - Minimum acceptable score
 * @returns {Promise<object[]>} Vendors below threshold
 *
 * @example
 * ```typescript
 * const underperforming = await identifyUnderperformingVendors(3.0);
 * ```
 */
export declare const identifyUnderperformingVendors: (scoreThreshold: number) => Promise<any[]>;
/**
 * Generates vendor performance report.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} reportOptions - Report configuration
 * @returns {Promise<object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateVendorPerformanceReport(5, {
 *   period: '2024-Q4',
 *   includeComparisons: true
 * });
 * ```
 */
export declare const generateVendorPerformanceReport: (vendorId: number, reportOptions: any) => Promise<any>;
/**
 * Creates vendor payment record from invoice.
 *
 * @param {VendorPayment} paymentData - Payment details
 * @param {string} createdBy - User creating payment
 * @returns {Promise<object>} Created payment record
 *
 * @example
 * ```typescript
 * const payment = await createVendorPayment({
 *   vendorId: 5,
 *   invoiceNumber: 'INV-2025-001',
 *   invoiceDate: new Date('2025-01-15'),
 *   invoiceAmount: 15000,
 *   paymentAmount: 15000,
 *   paymentMethod: 'ACH',
 *   description: 'Construction materials'
 * }, 'accounts.payable');
 * ```
 */
export declare const createVendorPayment: (paymentData: VendorPayment, createdBy: string) => Promise<any>;
/**
 * Approves vendor payment for processing.
 *
 * @param {number} paymentId - Payment ID
 * @param {string} approvedBy - User approving payment
 * @returns {Promise<object>} Updated payment record
 *
 * @example
 * ```typescript
 * const approved = await approveVendorPayment(100, 'finance.manager');
 * ```
 */
export declare const approveVendorPayment: (paymentId: number, approvedBy: string) => Promise<any>;
/**
 * Processes vendor payment and records transaction.
 *
 * @param {number} paymentId - Payment ID
 * @param {string} processedBy - User processing payment
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Processed payment with transaction details
 *
 * @example
 * ```typescript
 * const processed = await processVendorPayment(100, 'payment.processor');
 * ```
 */
export declare const processVendorPayment: (paymentId: number, processedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates unique payment number.
 *
 * @returns {string} Generated payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = generatePaymentNumber();
 * // Returns: 'PAY-2025-001234'
 * ```
 */
export declare const generatePaymentNumber: () => string;
/**
 * Retrieves payment history for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} [filters] - Optional filters (fiscal year, status)
 * @returns {Promise<VendorPayment[]>} Payment history
 *
 * @example
 * ```typescript
 * const payments = await getVendorPaymentHistory(5, { fiscalYear: 2025 });
 * ```
 */
export declare const getVendorPaymentHistory: (vendorId: number, filters?: any) => Promise<VendorPayment[]>;
/**
 * Calculates 1099 reportable amounts for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @param {number} taxYear - Tax year
 * @returns {Promise<Form1099Data>} 1099 data
 *
 * @example
 * ```typescript
 * const form1099 = await calculate1099ForVendor(5, 2024);
 * ```
 */
export declare const calculate1099ForVendor: (vendorId: number, taxYear: number) => Promise<Form1099Data>;
/**
 * Generates 1099 forms for all eligible vendors.
 *
 * @param {number} taxYear - Tax year
 * @param {number} [minimumThreshold=600] - Minimum reportable amount
 * @returns {Promise<Form1099Data[]>} Generated 1099 forms
 *
 * @example
 * ```typescript
 * const forms = await generate1099Forms(2024, 600);
 * ```
 */
export declare const generate1099Forms: (taxYear: number, minimumThreshold?: number) => Promise<Form1099Data[]>;
/**
 * Exports 1099 data for electronic filing.
 *
 * @param {number} taxYear - Tax year
 * @param {string} format - Export format ('IRS_FIRE' | 'CSV' | 'PDF')
 * @returns {Promise<Buffer>} Exported 1099 data
 *
 * @example
 * ```typescript
 * const fireFile = await export1099Data(2024, 'IRS_FIRE');
 * ```
 */
export declare const export1099Data: (taxYear: number, format: string) => Promise<Buffer>;
/**
 * Marks 1099 forms as filed with IRS.
 *
 * @param {number} taxYear - Tax year
 * @param {string} filedBy - User marking as filed
 * @returns {Promise<{ updated: number }>} Update result
 *
 * @example
 * ```typescript
 * const result = await mark1099AsFiled(2024, 'tax.admin');
 * ```
 */
export declare const mark1099AsFiled: (taxYear: number, filedBy: string) => Promise<{
    updated: number;
}>;
/**
 * Generates corrected 1099 form.
 *
 * @param {number} vendorId - Vendor ID
 * @param {number} taxYear - Tax year
 * @param {object} corrections - Correction details
 * @returns {Promise<Form1099Data>} Corrected 1099 form
 *
 * @example
 * ```typescript
 * const corrected = await generateCorrected1099(5, 2024, {
 *   box1: 128000,
 *   reason: 'Additional payment discovered'
 * });
 * ```
 */
export declare const generateCorrected1099: (vendorId: number, taxYear: number, corrections: any) => Promise<Form1099Data>;
/**
 * Adds insurance policy to vendor record.
 *
 * @param {VendorInsurance} insuranceData - Insurance policy details
 * @returns {Promise<object>} Created insurance record
 *
 * @example
 * ```typescript
 * const insurance = await addVendorInsurance({
 *   vendorId: 5,
 *   insuranceType: 'GENERAL_LIABILITY',
 *   policyNumber: 'POL-123456',
 *   insuranceCarrier: 'ABC Insurance Co',
 *   coverageAmount: 2000000,
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2026-01-01'),
 *   verified: false,
 *   certificateOnFile: true
 * });
 * ```
 */
export declare const addVendorInsurance: (insuranceData: VendorInsurance) => Promise<any>;
/**
 * Verifies vendor insurance coverage and limits.
 *
 * @param {number} insuranceId - Insurance record ID
 * @param {string} verifiedBy - User performing verification
 * @returns {Promise<object>} Verified insurance record
 *
 * @example
 * ```typescript
 * const verified = await verifyVendorInsurance(25, 'risk.manager');
 * ```
 */
export declare const verifyVendorInsurance: (insuranceId: number, verifiedBy: string) => Promise<any>;
/**
 * Retrieves all insurance policies for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<VendorInsurance[]>} Insurance policies
 *
 * @example
 * ```typescript
 * const policies = await getVendorInsurance(5);
 * ```
 */
export declare const getVendorInsurance: (vendorId: number) => Promise<VendorInsurance[]>;
/**
 * Checks for expiring insurance policies.
 *
 * @param {number} daysBeforeExpiration - Days to look ahead
 * @returns {Promise<VendorInsurance[]>} Expiring policies
 *
 * @example
 * ```typescript
 * const expiring = await checkExpiringInsurance(30);
 * ```
 */
export declare const checkExpiringInsurance: (daysBeforeExpiration: number) => Promise<VendorInsurance[]>;
/**
 * Validates vendor insurance meets requirements.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} requirements - Insurance requirements
 * @returns {Promise<{ compliant: boolean; missing: string[]; expiring: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateVendorInsuranceCompliance(5, {
 *   generalLiability: 2000000,
 *   workersComp: 1000000
 * });
 * ```
 */
export declare const validateVendorInsuranceCompliance: (vendorId: number, requirements: any) => Promise<{
    compliant: boolean;
    missing: string[];
    expiring: string[];
}>;
/**
 * Creates vendor contract record.
 *
 * @param {VendorContract} contractData - Contract details
 * @param {string} createdBy - User creating contract
 * @returns {Promise<object>} Created contract
 *
 * @example
 * ```typescript
 * const contract = await createVendorContract({
 *   contractNumber: 'CTR-2025-001',
 *   vendorId: 5,
 *   contractType: 'FIXED_PRICE',
 *   contractAmount: 500000,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   status: 'DRAFT'
 * }, 'contract.admin');
 * ```
 */
export declare const createVendorContract: (contractData: VendorContract, createdBy: string) => Promise<any>;
/**
 * Retrieves active contracts for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<VendorContract[]>} Active contracts
 *
 * @example
 * ```typescript
 * const contracts = await getVendorContracts(5);
 * ```
 */
export declare const getVendorContracts: (vendorId: number) => Promise<VendorContract[]>;
/**
 * Calculates contract utilization and remaining balance.
 *
 * @param {string} contractNumber - Contract number
 * @returns {Promise<{ totalValue: number; spent: number; remaining: number; percentUsed: number }>} Utilization data
 *
 * @example
 * ```typescript
 * const utilization = await calculateContractUtilization('CTR-2025-001');
 * ```
 */
export declare const calculateContractUtilization: (contractNumber: string) => Promise<{
    totalValue: number;
    spent: number;
    remaining: number;
    percentUsed: number;
}>;
/**
 * Renews vendor contract with new terms.
 *
 * @param {string} contractNumber - Original contract number
 * @param {object} renewalTerms - New contract terms
 * @param {string} renewedBy - User renewing contract
 * @returns {Promise<object>} New contract
 *
 * @example
 * ```typescript
 * const renewed = await renewVendorContract('CTR-2025-001', {
 *   contractAmount: 550000,
 *   endDate: new Date('2026-12-31')
 * }, 'contract.admin');
 * ```
 */
export declare const renewVendorContract: (contractNumber: string, renewalTerms: any, renewedBy: string) => Promise<any>;
/**
 * Generates unique contract number.
 *
 * @returns {string} Contract number
 *
 * @example
 * ```typescript
 * const contractNumber = generateContractNumber();
 * // Returns: 'CTR-2025-001234'
 * ```
 */
export declare const generateContractNumber: () => string;
/**
 * Calculates diversity spend metrics for fiscal year.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<DiversityMetrics>} Diversity spending data
 *
 * @example
 * ```typescript
 * const metrics = await calculateDiversityMetrics(2025);
 * ```
 */
export declare const calculateDiversityMetrics: (fiscalYear: number) => Promise<DiversityMetrics>;
/**
 * Generates diversity spending report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} [options] - Report options
 * @returns {Promise<object>} Diversity report
 *
 * @example
 * ```typescript
 * const report = await generateDiversityReport(2025, {
 *   breakdown: 'quarterly',
 *   includeVendorList: true
 * });
 * ```
 */
export declare const generateDiversityReport: (fiscalYear: number, options?: any) => Promise<any>;
/**
 * Retrieves vendors by certification type.
 *
 * @param {string} certificationType - Certification type
 * @returns {Promise<object[]>} Certified vendors
 *
 * @example
 * ```typescript
 * const mbeVendors = await getVendorsByCertification('MBE');
 * ```
 */
export declare const getVendorsByCertification: (certificationType: string) => Promise<any[]>;
/**
 * Tracks progress toward diversity goals.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} goals - Diversity goals
 * @returns {Promise<{ onTrack: boolean; gaps: object; recommendations: string[] }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackDiversityGoals(2025, {
 *   mbePercent: 15,
 *   wbePercent: 10,
 *   dbePercent: 10
 * });
 * ```
 */
export declare const trackDiversityGoals: (fiscalYear: number, goals: any) => Promise<{
    onTrack: boolean;
    gaps: any;
    recommendations: string[];
}>;
/**
 * Exports diversity data for regulatory compliance.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV')
 * @returns {Promise<Buffer>} Exported report
 *
 * @example
 * ```typescript
 * const report = await exportDiversityData(2025, 'PDF');
 * ```
 */
export declare const exportDiversityData: (fiscalYear: number, format: string) => Promise<Buffer>;
/**
 * Creates vendor dispute record.
 *
 * @param {VendorDispute} disputeData - Dispute details
 * @returns {Promise<object>} Created dispute
 *
 * @example
 * ```typescript
 * const dispute = await createVendorDispute({
 *   vendorId: 5,
 *   disputeType: 'PAYMENT',
 *   description: 'Invoice INV-2025-001 payment delayed',
 *   filedBy: 'vendor.contact',
 *   filedDate: new Date(),
 *   status: 'OPEN'
 * });
 * ```
 */
export declare const createVendorDispute: (disputeData: Partial<VendorDispute>) => Promise<any>;
/**
 * Updates dispute status and resolution.
 *
 * @param {string} disputeId - Dispute ID
 * @param {object} update - Update data
 * @returns {Promise<object>} Updated dispute
 *
 * @example
 * ```typescript
 * const resolved = await updateDisputeStatus('DSP-12345', {
 *   status: 'RESOLVED',
 *   resolution: 'Payment processed, issue resolved',
 *   resolvedBy: 'dispute.manager'
 * });
 * ```
 */
export declare const updateDisputeStatus: (disputeId: string, update: any) => Promise<any>;
/**
 * Retrieves disputes for vendor.
 *
 * @param {number} vendorId - Vendor ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<VendorDispute[]>} Vendor disputes
 *
 * @example
 * ```typescript
 * const disputes = await getVendorDisputes(5, { status: 'OPEN' });
 * ```
 */
export declare const getVendorDisputes: (vendorId: number, filters?: any) => Promise<VendorDispute[]>;
/**
 * Escalates dispute to higher authority.
 *
 * @param {string} disputeId - Dispute ID
 * @param {string} escalatedBy - User escalating dispute
 * @param {string} reason - Escalation reason
 * @returns {Promise<object>} Updated dispute
 *
 * @example
 * ```typescript
 * const escalated = await escalateDispute('DSP-12345', 'manager', 'Requires legal review');
 * ```
 */
export declare const escalateDispute: (disputeId: string, escalatedBy: string, reason: string) => Promise<any>;
/**
 * Generates dispute resolution report.
 *
 * @param {object} filters - Report filters
 * @returns {Promise<object>} Dispute report
 *
 * @example
 * ```typescript
 * const report = await generateDisputeReport({
 *   fiscalYear: 2025,
 *   includeResolved: true
 * });
 * ```
 */
export declare const generateDisputeReport: (filters: any) => Promise<any>;
/**
 * Performs debarment check against SAM.gov and state databases.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<DebarmentCheck>} Debarment check result
 *
 * @example
 * ```typescript
 * const check = await performDebarmentCheck(5);
 * if (check.debarred) {
 *   console.log('Vendor is debarred:', check.debarmentDetails);
 * }
 * ```
 */
export declare const performDebarmentCheck: (vendorId: number) => Promise<DebarmentCheck>;
/**
 * Sets payment terms for vendor.
 *
 * @param {PaymentTerms} termsData - Payment terms
 * @returns {Promise<object>} Created payment terms
 *
 * @example
 * ```typescript
 * const terms = await setVendorPaymentTerms({
 *   vendorId: 5,
 *   terms: 'NET_30',
 *   discountPercent: 2,
 *   discountDays: 10
 * });
 * ```
 */
export declare const setVendorPaymentTerms: (termsData: PaymentTerms) => Promise<any>;
/**
 * Retrieves vendor payment terms.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<PaymentTerms>} Payment terms
 *
 * @example
 * ```typescript
 * const terms = await getVendorPaymentTerms(5);
 * ```
 */
export declare const getVendorPaymentTerms: (vendorId: number) => Promise<PaymentTerms>;
/**
 * Generates vendor portal access credentials.
 *
 * @param {number} vendorId - Vendor ID
 * @param {string} contactEmail - Contact email for portal
 * @returns {Promise<{ username: string; temporaryPassword: string; portalUrl: string }>} Portal credentials
 *
 * @example
 * ```typescript
 * const credentials = await generateVendorPortalAccess(5, 'vendor@company.com');
 * ```
 */
export declare const generateVendorPortalAccess: (vendorId: number, contactEmail: string) => Promise<{
    username: string;
    temporaryPassword: string;
    portalUrl: string;
}>;
/**
 * Searches vendors by multiple criteria.
 *
 * @param {object} searchCriteria - Search filters
 * @returns {Promise<object[]>} Matching vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors({
 *   status: 'ACTIVE',
 *   certifications: ['MBE', 'WBE'],
 *   minPerformanceScore: 4.0,
 *   state: 'CA'
 * });
 * ```
 */
export declare const searchVendors: (searchCriteria: any) => Promise<any[]>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createVendorModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            vendorNumber: string;
            vendorName: string;
            taxId: string;
            businessType: string;
            contactName: string;
            contactEmail: string;
            contactPhone: string;
            addressStreet: string;
            addressCity: string;
            addressState: string;
            addressZipCode: string;
            addressCountry: string;
            status: string;
            registrationDate: Date;
            approvedBy: string | null;
            approvedAt: Date | null;
            debarred: boolean;
            debarmentReason: string | null;
            performanceScore: number;
            totalContracts: number;
            totalSpend: number;
            bankingInfo: Record<string, any>;
            certifications: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createVendorCertificationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            vendorId: number;
            certificationType: string;
            certificationNumber: string;
            issuingAgency: string;
            issueDate: Date;
            expirationDate: Date;
            verified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            documentPath: string | null;
            status: string;
            notes: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createVendorPaymentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            paymentNumber: string;
            vendorId: number;
            invoiceNumber: string;
            invoiceDate: Date;
            invoiceAmount: number;
            paymentAmount: number;
            paymentDate: Date | null;
            paymentMethod: string;
            paymentStatus: string;
            referenceNumber: string | null;
            purchaseOrderNumber: string | null;
            description: string;
            fiscalYear: number;
            form1099Reportable: boolean;
            processedBy: string | null;
            approvedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    registerVendor: (registrationData: VendorRegistration, registeredBy: string, transaction?: Transaction) => Promise<any>;
    validateVendorRegistration: (registrationData: VendorRegistration) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    approveVendorRegistration: (vendorId: number, approvedBy: string, transaction?: Transaction) => Promise<any>;
    generateVendorNumber: () => string;
    qualifyVendor: (vendorId: number, qualificationCriteria: any) => Promise<{
        qualified: boolean;
        score: number;
        details: any;
    }>;
    addVendorCertification: (certificationData: VendorCertification, addedBy: string) => Promise<any>;
    verifyVendorCertification: (certificationId: number, verifiedBy: string) => Promise<any>;
    getVendorCertifications: (vendorId: number, filters?: any) => Promise<VendorCertification[]>;
    checkExpiringCertifications: (daysBeforeExpiration: number) => Promise<VendorCertification[]>;
    renewVendorCertification: (certificationId: number, newExpirationDate: Date, renewedBy: string) => Promise<any>;
    recordVendorPerformance: (performanceData: VendorPerformance, transaction?: Transaction) => Promise<any>;
    calculateVendorPerformanceScore: (vendorId: number, startDate?: Date, endDate?: Date) => Promise<{
        overallScore: number;
        evaluationCount: number;
        breakdown: any;
    }>;
    getVendorPerformanceHistory: (vendorId: number, filters?: any) => Promise<VendorPerformance[]>;
    identifyUnderperformingVendors: (scoreThreshold: number) => Promise<any[]>;
    generateVendorPerformanceReport: (vendorId: number, reportOptions: any) => Promise<any>;
    createVendorPayment: (paymentData: VendorPayment, createdBy: string) => Promise<any>;
    approveVendorPayment: (paymentId: number, approvedBy: string) => Promise<any>;
    processVendorPayment: (paymentId: number, processedBy: string, transaction?: Transaction) => Promise<any>;
    generatePaymentNumber: () => string;
    getVendorPaymentHistory: (vendorId: number, filters?: any) => Promise<VendorPayment[]>;
    calculate1099ForVendor: (vendorId: number, taxYear: number) => Promise<Form1099Data>;
    generate1099Forms: (taxYear: number, minimumThreshold?: number) => Promise<Form1099Data[]>;
    export1099Data: (taxYear: number, format: string) => Promise<Buffer>;
    mark1099AsFiled: (taxYear: number, filedBy: string) => Promise<{
        updated: number;
    }>;
    generateCorrected1099: (vendorId: number, taxYear: number, corrections: any) => Promise<Form1099Data>;
    addVendorInsurance: (insuranceData: VendorInsurance) => Promise<any>;
    verifyVendorInsurance: (insuranceId: number, verifiedBy: string) => Promise<any>;
    getVendorInsurance: (vendorId: number) => Promise<VendorInsurance[]>;
    checkExpiringInsurance: (daysBeforeExpiration: number) => Promise<VendorInsurance[]>;
    validateVendorInsuranceCompliance: (vendorId: number, requirements: any) => Promise<{
        compliant: boolean;
        missing: string[];
        expiring: string[];
    }>;
    createVendorContract: (contractData: VendorContract, createdBy: string) => Promise<any>;
    getVendorContracts: (vendorId: number) => Promise<VendorContract[]>;
    calculateContractUtilization: (contractNumber: string) => Promise<{
        totalValue: number;
        spent: number;
        remaining: number;
        percentUsed: number;
    }>;
    renewVendorContract: (contractNumber: string, renewalTerms: any, renewedBy: string) => Promise<any>;
    generateContractNumber: () => string;
    calculateDiversityMetrics: (fiscalYear: number) => Promise<DiversityMetrics>;
    generateDiversityReport: (fiscalYear: number, options?: any) => Promise<any>;
    getVendorsByCertification: (certificationType: string) => Promise<any[]>;
    trackDiversityGoals: (fiscalYear: number, goals: any) => Promise<{
        onTrack: boolean;
        gaps: any;
        recommendations: string[];
    }>;
    exportDiversityData: (fiscalYear: number, format: string) => Promise<Buffer>;
    createVendorDispute: (disputeData: Partial<VendorDispute>) => Promise<any>;
    updateDisputeStatus: (disputeId: string, update: any) => Promise<any>;
    getVendorDisputes: (vendorId: number, filters?: any) => Promise<VendorDispute[]>;
    escalateDispute: (disputeId: string, escalatedBy: string, reason: string) => Promise<any>;
    generateDisputeReport: (filters: any) => Promise<any>;
    performDebarmentCheck: (vendorId: number) => Promise<DebarmentCheck>;
    setVendorPaymentTerms: (termsData: PaymentTerms) => Promise<any>;
    getVendorPaymentTerms: (vendorId: number) => Promise<PaymentTerms>;
    generateVendorPortalAccess: (vendorId: number, contactEmail: string) => Promise<{
        username: string;
        temporaryPassword: string;
        portalUrl: string;
    }>;
    searchVendors: (searchCriteria: any) => Promise<any[]>;
};
export default _default;
//# sourceMappingURL=vendor-supplier-management-kit.d.ts.map