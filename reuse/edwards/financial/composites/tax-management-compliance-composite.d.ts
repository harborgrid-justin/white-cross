/**
 * LOC: TAXCMP001
 * File: /reuse/edwards/financial/composites/tax-management-compliance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../accounts-payable-management-kit
 *   - ../accounts-receivable-management-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../multi-currency-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Tax management REST API controllers
 *   - Tax compliance services
 *   - 1099 processing services
 *   - Tax reporting modules
 *   - Sales/use tax calculation engines
 */
import { type Form1099 } from '../accounts-payable-management-kit';
import { type TaxExemptionCertificate } from '../accounts-receivable-management-kit';
import { type AuditEntry } from '../audit-trail-compliance-kit';
/**
 * Tax management API configuration
 */
export interface TaxApiConfig {
    baseUrl: string;
    enableRealTimeTaxCalc: boolean;
    enableAutomated1099: boolean;
    enableVATCompliance: boolean;
    defaultTaxJurisdiction: string;
    taxYearEnd: Date;
}
/**
 * Tax jurisdiction
 */
export interface TaxJurisdiction {
    jurisdictionId: string;
    jurisdictionName: string;
    jurisdictionType: 'federal' | 'state' | 'county' | 'city' | 'district';
    jurisdictionCode: string;
    parentJurisdiction?: string;
    isActive: boolean;
}
/**
 * Tax rate
 */
export interface TaxRate {
    rateId: string;
    jurisdictionId: string;
    taxType: 'sales' | 'use' | 'vat' | 'gst' | 'withholding' | 'property';
    rate: number;
    effectiveDate: Date;
    expirationDate?: Date;
    description: string;
}
/**
 * Tax calculation request
 */
export interface TaxCalculationRequest {
    transactionId: string;
    transactionDate: Date;
    transactionType: 'sale' | 'purchase' | 'service';
    subtotal: number;
    shippingAddress: Address;
    billingAddress: Address;
    lineItems: TaxLineItem[];
    exemptionCertificateId?: string;
}
/**
 * Address
 */
export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
/**
 * Tax line item
 */
export interface TaxLineItem {
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
    taxCategory?: string;
}
/**
 * Tax calculation result
 */
export interface TaxCalculationResult {
    calculationId: string;
    transactionId: string;
    subtotal: number;
    totalTax: number;
    totalAmount: number;
    taxBreakdown: TaxBreakdownItem[];
    appliedExemptions: string[];
    calculatedAt: Date;
}
/**
 * Tax breakdown item
 */
export interface TaxBreakdownItem {
    jurisdictionId: string;
    jurisdictionName: string;
    taxType: string;
    rate: number;
    taxableAmount: number;
    taxAmount: number;
}
/**
 * 1099 filing
 */
export interface Form1099Filing {
    filingId: string;
    taxYear: number;
    vendorId: string;
    form1099Type: '1099-MISC' | '1099-NEC' | '1099-INT' | '1099-DIV' | '1099-K';
    totalAmount: number;
    withheldAmount: number;
    filingStatus: 'draft' | 'ready' | 'filed' | 'corrected';
    filedDate?: Date;
    confirmationNumber?: string;
}
/**
 * Tax compliance status
 */
export interface TaxComplianceStatus {
    complianceId: string;
    entityId: number;
    taxType: string;
    taxPeriod: string;
    complianceStatus: 'compliant' | 'pending' | 'overdue' | 'filed';
    dueDate: Date;
    filedDate?: Date;
    issues: TaxComplianceIssue[];
}
/**
 * Tax compliance issue
 */
export interface TaxComplianceIssue {
    issueId: string;
    issueType: 'missing_filing' | 'late_payment' | 'calculation_error' | 'missing_documentation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    remediation: string;
    dueDate?: Date;
}
/**
 * Tax reconciliation
 */
export interface TaxReconciliation {
    reconciliationId: string;
    taxType: string;
    period: string;
    calculatedTax: number;
    filedTax: number;
    paidTax: number;
    variance: number;
    reconciled: boolean;
    reconciliationDate?: Date;
    notes: string;
}
/**
 * Nexus determination
 */
export interface NexusDetermination {
    nexusId: string;
    jurisdictionId: string;
    entityId: number;
    nexusType: 'physical' | 'economic' | 'affiliate' | 'click-through';
    hasNexus: boolean;
    nexusDate: Date;
    thresholdsMet: string[];
    requiresRegistration: boolean;
}
/**
 * Calculates comprehensive sales tax for transaction
 * Composes: calculateSalesTax, getApplicableJurisdictions, validateTaxExemption
 *
 * @param request - Tax calculation request
 * @param userId - User requesting calculation
 * @returns Tax calculation result with breakdown
 */
export declare const calculateComprehensiveSalesTax: (request: TaxCalculationRequest, userId: string) => Promise<{
    calculation: TaxCalculationResult;
    jurisdictions: TaxJurisdiction[];
    rates: TaxRate[];
    audit: AuditEntry;
}>;
/**
 * Calculates use tax for purchases
 * Composes: calculateUseTax, validateVendorTaxStatus, accrueUseTax
 *
 * @param invoiceId - Invoice identifier
 * @param userId - User calculating tax
 * @returns Use tax calculation
 */
export declare const calculateAndAccrueUseTax: (invoiceId: string, userId: string) => Promise<{
    useTaxAmount: number;
    accrualEntry: any;
    vendorTaxStatus: any;
    audit: AuditEntry;
}>;
/**
 * Calculates VAT for international transactions
 * Composes: calculateVAT, validateVATNumber, determineVATTreatment
 *
 * @param transactionData - Transaction data
 * @param userId - User calculating VAT
 * @returns VAT calculation result
 */
export declare const calculateVATForInternationalTransaction: (transactionData: any, userId: string) => Promise<{
    vatAmount: number;
    vatRate: number;
    vatTreatment: string;
    vatNumberValid: boolean;
    audit: AuditEntry;
}>;
/**
 * Creates tax jurisdiction with rate setup
 * Composes: createJurisdiction, createTaxRate, validateJurisdictionHierarchy
 *
 * @param jurisdictionData - Jurisdiction data
 * @param initialRates - Initial tax rates
 * @param userId - User creating jurisdiction
 * @returns Created jurisdiction with rates
 */
export declare const createJurisdictionWithRates: (jurisdictionData: Partial<TaxJurisdiction>, initialRates: Partial<TaxRate>[], userId: string) => Promise<{
    jurisdiction: TaxJurisdiction;
    rates: TaxRate[];
    audit: AuditEntry;
}>;
/**
 * Updates tax rates with effective dating
 * Composes: updateTaxRate, validateRateChange, createRateHistory
 *
 * @param rateId - Rate identifier
 * @param newRate - New tax rate
 * @param effectiveDate - Effective date
 * @param userId - User updating rate
 * @returns Updated rate with history
 */
export declare const updateTaxRateWithEffectiveDating: (rateId: string, newRate: number, effectiveDate: Date, userId: string) => Promise<{
    oldRate: TaxRate;
    newRate: TaxRate;
    audit: AuditEntry;
}>;
/**
 * Determines nexus for entity in jurisdiction
 * Composes: evaluateNexusFactors, checkEconomicThresholds, determineNexus
 *
 * @param entityId - Entity identifier
 * @param jurisdictionId - Jurisdiction identifier
 * @returns Nexus determination
 */
export declare const determineNexusForEntityInJurisdiction: (entityId: number, jurisdictionId: string) => Promise<NexusDetermination>;
/**
 * Generates 1099 forms for vendors with validation
 * Composes: generate1099, validate1099Data, create1099Filing
 *
 * @param vendorId - Vendor identifier
 * @param taxYear - Tax year
 * @param userId - User generating 1099
 * @returns 1099 filing with validation
 */
export declare const generate1099WithValidation: (vendorId: string, taxYear: number, userId: string) => Promise<{
    form1099: Form1099;
    filing: Form1099Filing;
    validation: any;
    audit: AuditEntry;
}>;
/**
 * Processes batch 1099 generation for all qualifying vendors
 * Composes: getQualifyingVendors, generate1099, validate1099Data
 *
 * @param taxYear - Tax year
 * @param userId - User processing batch
 * @returns Batch processing results
 */
export declare const processBatch1099Generation: (taxYear: number, userId: string) => Promise<{
    generated: number;
    failed: number;
    filings: Form1099Filing[];
    errors: any[];
    audit: AuditEntry;
}>;
/**
 * Files 1099 forms electronically
 * Composes: validateFiling, submitElectronic1099, recordFilingConfirmation
 *
 * @param filingIds - Filing identifiers
 * @param userId - User filing forms
 * @returns Filing results
 */
export declare const file1099Electronically: (filingIds: string[], userId: string) => Promise<{
    submitted: number;
    failed: number;
    confirmations: string[];
    errors: any[];
    audit: AuditEntry;
}>;
/**
 * Monitors tax compliance status across all jurisdictions
 * Composes: checkFilingRequirements, validatePaymentStatus, identifyComplianceGaps
 *
 * @param entityId - Entity identifier
 * @param period - Tax period
 * @returns Compliance status
 */
export declare const monitorComprehensiveTaxCompliance: (entityId: number, period: string) => Promise<{
    complianceStatuses: TaxComplianceStatus[];
    overallCompliance: boolean;
    criticalIssues: TaxComplianceIssue[];
    upcomingDeadlines: any[];
}>;
/**
 * Validates tax exemption certificates
 * Composes: validateTaxExemption, checkExpirationDate, verifyExemptionScope
 *
 * @param certificateId - Certificate identifier
 * @param transactionData - Transaction data
 * @returns Exemption validation result
 */
export declare const validateTaxExemptionCertificate: (certificateId: string, transactionData: any) => Promise<{
    valid: boolean;
    certificate: TaxExemptionCertificate;
    issues: string[];
    applicableToTransaction: boolean;
}>;
/**
 * Reconciles tax calculations with filed returns
 * Composes: calculateTaxLiability, getFiledReturns, identifyVariances
 *
 * @param entityId - Entity identifier
 * @param taxType - Tax type
 * @param period - Tax period
 * @returns Reconciliation result
 */
export declare const reconcileTaxCalculationsWithFiledReturns: (entityId: number, taxType: string, period: string) => Promise<{
    reconciliation: TaxReconciliation;
    variances: any[];
    requiresAdjustment: boolean;
    audit: AuditEntry;
}>;
/**
 * Reconciles 1099 reportable amounts
 * Composes: calculate1099Amounts, compare1099WithPayments, identify1099Discrepancies
 *
 * @param vendorId - Vendor identifier
 * @param taxYear - Tax year
 * @returns 1099 reconciliation
 */
export declare const reconcile1099ReportableAmounts: (vendorId: string, taxYear: number) => Promise<{
    calculated1099Amount: number;
    reported1099Amount: number;
    paymentTotal: number;
    variance: number;
    reconciled: boolean;
    discrepancies: any[];
}>;
/**
 * Generates comprehensive tax report
 * Composes: generateSalesTaxReport, generateUseTaxReport, generate1099Summary
 *
 * @param entityId - Entity identifier
 * @param period - Reporting period
 * @returns Comprehensive tax report
 */
export declare const generateComprehensiveTaxReport: (entityId: number, period: string) => Promise<{
    salesTaxReport: any;
    useTaxReport: any;
    form1099Summary: any;
    complianceStatus: any;
}>;
/**
 * Exports tax data for external filing
 * Composes: formatTaxDataForFiling, validateTaxExport, generateFilingPackage
 *
 * @param entityId - Entity identifier
 * @param taxType - Tax type
 * @param period - Tax period
 * @param format - Export format
 * @returns Tax export package
 */
export declare const exportTaxDataForFiling: (entityId: number, taxType: string, period: string, format: "xml" | "csv" | "json") => Promise<{
    exportData: any;
    validation: any;
    fileName: string;
}>;
export { calculateComprehensiveSalesTax, calculateAndAccrueUseTax, calculateVATForInternationalTransaction, createJurisdictionWithRates, updateTaxRateWithEffectiveDating, determineNexusForEntityInJurisdiction, generate1099WithValidation, processBatch1099Generation, file1099Electronically, monitorComprehensiveTaxCompliance, validateTaxExemptionCertificate, reconcileTaxCalculationsWithFiledReturns, reconcile1099ReportableAmounts, generateComprehensiveTaxReport, exportTaxDataForFiling, type TaxApiConfig, type TaxJurisdiction, type TaxRate, type TaxCalculationRequest, type TaxCalculationResult, type TaxBreakdownItem, type Form1099Filing, type TaxComplianceStatus, type TaxComplianceIssue, type TaxReconciliation, type NexusDetermination, type Address, type TaxLineItem, };
//# sourceMappingURL=tax-management-compliance-composite.d.ts.map