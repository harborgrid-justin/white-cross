/**
 * TAX CALCULATIONS MANAGEMENT KIT
 * LOC: FIN-TAX-001
 *
 * Comprehensive tax management functions for financial platforms.
 * Integrates with Avalara, Vertex, and custom tax engines.
 * Supports multi-jurisdiction tax compliance and calculations.
 *
 * @targetVersion NestJS 10.x, Sequelize 6.x
 * @compliance HIPAA, SOX, Tax Code
 * @features 40 enterprise tax functions across 10 categories
 */
import { Model, Sequelize } from 'sequelize';
interface TaxJurisdiction {
    id: string;
    code: string;
    name: string;
    country: string;
    state?: string;
    county?: string;
    active: boolean;
    taxEngine: 'AVALARA' | 'VERTEX' | 'CUSTOM';
    apiConfig?: Record<string, any>;
    effectiveDate: Date;
    deactivatedAt?: Date;
}
interface TaxRate {
    id: string;
    jurisdictionId: string;
    taxType: string;
    rate: number;
    effectiveDate: Date;
    expiryDate?: Date;
    active: boolean;
    notes?: string;
}
interface TaxJurisdictionModel extends Model<TaxJurisdiction>, TaxJurisdiction {
}
interface TaxRateModel extends Model<TaxRate>, TaxRate {
}
/**
 * Create new tax jurisdiction with tax engine configuration
 */
export declare function createTaxJurisdiction(sequelize: Sequelize, data: Partial<TaxJurisdiction>): Promise<TaxJurisdictionModel>;
/**
 * Get tax jurisdiction by code with complete configuration
 */
export declare function getTaxJurisdiction(sequelize: Sequelize, code: string): Promise<TaxJurisdictionModel | null>;
/**
 * Update tax jurisdiction configuration and engine settings
 */
export declare function updateTaxJurisdiction(sequelize: Sequelize, jurisdictionId: string, updates: Partial<TaxJurisdiction>): Promise<TaxJurisdictionModel>;
/**
 * Deactivate tax jurisdiction and archive related rules
 */
export declare function deactivateTaxJurisdiction(sequelize: Sequelize, jurisdictionId: string): Promise<void>;
/**
 * Create tax rate for jurisdiction with effective date
 */
export declare function createTaxRate(sequelize: Sequelize, jurisdictionId: string, taxType: string, rate: number, effectiveDate: Date): Promise<TaxRateModel>;
/**
 * Get effective tax rate for jurisdiction on specific date
 */
export declare function getEffectiveTaxRate(sequelize: Sequelize, jurisdictionId: string, taxType: string, onDate: Date): Promise<number | null>;
/**
 * Update tax rate with new percentage and expiry date
 */
export declare function updateTaxRate(sequelize: Sequelize, rateId: string, newRate: number, expiryDate?: Date): Promise<TaxRateModel>;
/**
 * Get historical tax rate records for audit trail
 */
export declare function getTaxRateHistory(sequelize: Sequelize, jurisdictionId: string, taxType: string, limit?: number): Promise<TaxRateModel[]>;
/**
 * Calculate sales tax based on jurisdiction and amount
 */
export declare function calculateSalesTax(sequelize: Sequelize, jurisdictionId: string, amount: number, date: Date): Promise<number>;
/**
 * Apply tax exemption to sales transaction and document
 */
export declare function applySalesTaxExemption(sequelize: Sequelize, transactionId: string, exemptionId: string, amount: number): Promise<{
    exemptedAmount: number;
    savedTax: number;
}>;
/**
 * Reverse sales tax charge and create credit memo
 */
export declare function reverseSalesTaxCharge(sequelize: Sequelize, transactionId: string, originalTaxAmount: number): Promise<{
    reversalId: string;
    creditAmount: number;
}>;
/**
 * Generate sales tax report for jurisdiction and period
 */
export declare function generateSalesTaxReport(sequelize: Sequelize, jurisdictionId: string, startDate: Date, endDate: Date): Promise<{
    totalSales: number;
    totalTax: number;
    exemptions: number;
}>;
/**
 * Calculate VAT/GST with multiple tax rates
 */
export declare function calculateVAT(sequelize: Sequelize, jurisdictionId: string, amount: number, taxCategory: string, date: Date): Promise<{
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
}>;
/**
 * Validate VAT registration and number format
 */
export declare function validateVATRegistration(sequelize: Sequelize, vatNumber: string, jurisdictionCode: string): Promise<boolean>;
/**
 * Reconcile input and output VAT for period
 */
export declare function reconcileVAT(sequelize: Sequelize, entityId: string, periodStart: Date, periodEnd: Date): Promise<{
    inputVAT: number;
    outputVAT: number;
    balance: number;
}>;
/**
 * File VAT return with jurisdiction authority
 */
export declare function fileVATReturn(sequelize: Sequelize, entityId: string, periodStart: Date, periodEnd: Date): Promise<{
    returnId: string;
    status: string;
    filingReference: string;
}>;
/**
 * Calculate income tax provision based on taxable income
 */
export declare function calculateIncomeTaxProvision(sequelize: Sequelize, entityId: string, taxableIncome: number, jurisdictionId: string): Promise<{
    provision: number;
    effectiveRate: number;
}>;
/**
 * Calculate deferred tax assets/liabilities
 */
export declare function calculateDeferredTax(sequelize: Sequelize, entityId: string, bookIncome: number, taxableIncome: number, taxRate: number): Promise<{
    deferredTaxAsset: number;
    deferredTaxLiability: number;
    netDeferred: number;
}>;
/**
 * Reconcile book income to taxable income for audit
 */
export declare function reconcileIncomeToTaxable(sequelize: Sequelize, entityId: string, periodStart: Date, periodEnd: Date): Promise<{
    bookIncome: number;
    adjustments: number;
    taxableIncome: number;
}>;
/**
 * Generate income tax report for filing
 */
export declare function generateIncomeTaxReport(sequelize: Sequelize, entityId: string, taxYear: number): Promise<{
    reportId: string;
    totalIncome: number;
    totalTax: number;
    status: string;
}>;
/**
 * Calculate withholding tax obligation on payment
 */
export declare function calculateWithholdingTax(sequelize: Sequelize, paymentAmount: number, paymentType: string, jurisdictionId: string): Promise<{
    grossAmount: number;
    withholding: number;
    netAmount: number;
}>;
/**
 * Apply withholding tax and create deduction record
 */
export declare function applyWithholdingTax(sequelize: Sequelize, paymentId: string, withholderEntityId: string, withholdingAmount: number): Promise<{
    deductionId: string;
    appliedAt: Date;
}>;
/**
 * Record withholding tax remittance to authority
 */
export declare function remitWithholdingTax(sequelize: Sequelize, entityId: string, taxAmount: number, dueDate: Date): Promise<{
    remittanceId: string;
    status: string;
    dueDate: Date;
}>;
/**
 * Generate withholding tax report and certificates
 */
export declare function generateWithholdingTaxReport(sequelize: Sequelize, entityId: string, periodStart: Date, periodEnd: Date): Promise<{
    reportId: string;
    totalWithholding: number;
    certificateCount: number;
}>;
/**
 * Apply tax exemption to entity for specific jurisdiction
 */
export declare function applyTaxExemption(sequelize: Sequelize, entityId: string, jurisdictionId: string, exemptionType: string, certificateNumber: string, expiryDate: Date): Promise<string>;
/**
 * Validate tax exemption certificate authenticity
 */
export declare function validateExemptionCertificate(sequelize: Sequelize, exemptionId: string, issuerDatabase: Record<string, any>): Promise<boolean>;
/**
 * Track exemption usage and document utilization
 */
export declare function trackExemptionUsage(sequelize: Sequelize, exemptionId: string, transactionAmount: number): Promise<{
    remainingExemption: number;
    utilisedAmount: number;
}>;
/**
 * Expire or deactivate tax exemption at end of term
 */
export declare function expireTaxExemption(sequelize: Sequelize, exemptionId: string): Promise<void>;
/**
 * Generate 1099 forms for contractor payments
 */
export declare function generate1099Report(sequelize: Sequelize, vendorId: string, year: number): Promise<{
    formId: string;
    grossPayments: number;
    nonEmployeeComp: number;
}>;
/**
 * Generate W2 forms for employee compensation
 */
export declare function generateW2Report(sequelize: Sequelize, employeeId: string, year: number): Promise<{
    formId: string;
    wages: number;
    withholdings: number;
}>;
/**
 * Generate sales tax return filing document
 */
export declare function generateSalesTaxReturnReport(sequelize: Sequelize, entityId: string, jurisdictionId: string, period: {
    start: Date;
    end: Date;
}): Promise<{
    returnId: string;
    taxAmount: number;
    filingDeadline: Date;
}>;
/**
 * Generate VAT return filing document
 */
export declare function generateVATReturnReport(sequelize: Sequelize, entityId: string, period: {
    start: Date;
    end: Date;
}): Promise<{
    returnId: string;
    status: string;
    filingReference: string;
}>;
/**
 * Reconcile tax accounts against GL for period
 */
export declare function reconcileTaxAccounts(sequelize: Sequelize, entityId: string, periodStart: Date, periodEnd: Date): Promise<{
    glBalance: number;
    taxBalance: number;
    variance: number;
    reconciled: boolean;
}>;
/**
 * Identify variance between expected and actual tax positions
 */
export declare function identifyTaxVariance(sequelize: Sequelize, entityId: string, toleranceThreshold?: number): Promise<{
    varianceFound: boolean;
    amount: number;
    causes: string[];
}>;
/**
 * Adjust tax position and record justification
 */
export declare function adjustTaxPosition(sequelize: Sequelize, reconciliationId: string, adjustmentAmount: number, reason: string): Promise<{
    adjustmentId: string;
    newVariance: number;
}>;
/**
 * Finalize tax reconciliation and close period
 */
export declare function finalizeTaxReconciliation(sequelize: Sequelize, reconciliationId: string): Promise<{
    status: string;
    closedAt: Date;
    finalVariance: number;
}>;
/**
 * Calculate arm's length transfer price for related party transaction
 */
export declare function calculateArmsLengthPrice(sequelize: Sequelize, entityId: string, relatedPartyId: string, transactionAmount: number, priceMethod: 'CUP' | 'RESALE' | 'COST_PLUS' | 'PROFIT_SPLIT'): Promise<{
    transferPrice: number;
    markup: number;
    margins: Record<string, number>;
}>;
/**
 * Document transfer pricing analysis and methodology
 */
export declare function documentTransferPricing(sequelize: Sequelize, entityId: string, relatedPartyId: string, priceMethod: string, comparableData: Record<string, any>): Promise<string>;
/**
 * Validate transfer pricing compliance with arm's length principle
 */
export declare function validateTransferPricing(sequelize: Sequelize, documentId: string, benchmarkData: Record<string, any>): Promise<{
    compliant: boolean;
    deviationPercent: number;
    recommendation: string;
}>;
/**
 * Archive transfer pricing documentation for audit trail
 */
export declare function archiveTransferPricingDoc(sequelize: Sequelize, documentId: string): Promise<{
    archivedAt: Date;
    archiveReference: string;
}>;
declare const _default: {
    createTaxJurisdiction: typeof createTaxJurisdiction;
    getTaxJurisdiction: typeof getTaxJurisdiction;
    updateTaxJurisdiction: typeof updateTaxJurisdiction;
    deactivateTaxJurisdiction: typeof deactivateTaxJurisdiction;
    createTaxRate: typeof createTaxRate;
    getEffectiveTaxRate: typeof getEffectiveTaxRate;
    updateTaxRate: typeof updateTaxRate;
    getTaxRateHistory: typeof getTaxRateHistory;
    calculateSalesTax: typeof calculateSalesTax;
    applySalesTaxExemption: typeof applySalesTaxExemption;
    reverseSalesTaxCharge: typeof reverseSalesTaxCharge;
    generateSalesTaxReport: typeof generateSalesTaxReport;
    calculateVAT: typeof calculateVAT;
    validateVATRegistration: typeof validateVATRegistration;
    reconcileVAT: typeof reconcileVAT;
    fileVATReturn: typeof fileVATReturn;
    calculateIncomeTaxProvision: typeof calculateIncomeTaxProvision;
    calculateDeferredTax: typeof calculateDeferredTax;
    reconcileIncomeToTaxable: typeof reconcileIncomeToTaxable;
    generateIncomeTaxReport: typeof generateIncomeTaxReport;
    calculateWithholdingTax: typeof calculateWithholdingTax;
    applyWithholdingTax: typeof applyWithholdingTax;
    remitWithholdingTax: typeof remitWithholdingTax;
    generateWithholdingTaxReport: typeof generateWithholdingTaxReport;
    applyTaxExemption: typeof applyTaxExemption;
    validateExemptionCertificate: typeof validateExemptionCertificate;
    trackExemptionUsage: typeof trackExemptionUsage;
    expireTaxExemption: typeof expireTaxExemption;
    generate1099Report: typeof generate1099Report;
    generateW2Report: typeof generateW2Report;
    generateSalesTaxReturnReport: typeof generateSalesTaxReturnReport;
    generateVATReturnReport: typeof generateVATReturnReport;
    reconcileTaxAccounts: typeof reconcileTaxAccounts;
    identifyTaxVariance: typeof identifyTaxVariance;
    adjustTaxPosition: typeof adjustTaxPosition;
    finalizeTaxReconciliation: typeof finalizeTaxReconciliation;
    calculateArmsLengthPrice: typeof calculateArmsLengthPrice;
    documentTransferPricing: typeof documentTransferPricing;
    validateTransferPricing: typeof validateTransferPricing;
    archiveTransferPricingDoc: typeof archiveTransferPricingDoc;
};
export default _default;
//# sourceMappingURL=tax-calculations-management-kit.d.ts.map