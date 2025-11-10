/**
 * LOC: FREIGHT-AUDIT-001
 * File: /reuse/logistics/transportation-freight-audit-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Freight audit controllers
 *   - Transportation payment services
 *   - Carrier invoice processors
 *   - Cost allocation modules
 */
/**
 * Freight invoice status enumeration
 */
export declare enum FreightInvoiceStatus {
    RECEIVED = "RECEIVED",
    PENDING_AUDIT = "PENDING_AUDIT",
    IN_AUDIT = "IN_AUDIT",
    AUDIT_PASSED = "AUDIT_PASSED",
    AUDIT_FAILED = "AUDIT_FAILED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAID = "PAID",
    DISPUTED = "DISPUTED",
    CANCELLED = "CANCELLED"
}
/**
 * Discrepancy severity levels
 */
export declare enum DiscrepancySeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * Discrepancy types
 */
export declare enum DiscrepancyType {
    RATE_VARIANCE = "RATE_VARIANCE",
    WEIGHT_VARIANCE = "WEIGHT_VARIANCE",
    DUPLICATE_CHARGE = "DUPLICATE_CHARGE",
    UNAUTHORIZED_ACCESSORIAL = "UNAUTHORIZED_ACCESSORIAL",
    INCORRECT_CLASSIFICATION = "INCORRECT_CLASSIFICATION",
    DELIVERY_PERFORMANCE = "DELIVERY_PERFORMANCE",
    MISSING_DOCUMENTATION = "MISSING_DOCUMENTATION",
    INCORRECT_FUEL_SURCHARGE = "INCORRECT_FUEL_SURCHARGE",
    INCORRECT_DISCOUNT = "INCORRECT_DISCOUNT",
    BILLING_ERROR = "BILLING_ERROR"
}
/**
 * Payment methods for freight
 */
export declare enum FreightPaymentMethod {
    CHECK = "CHECK",
    ACH = "ACH",
    WIRE_TRANSFER = "WIRE_TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    EFT = "EFT",
    PREPAID = "PREPAID",
    COLLECT = "COLLECT",
    THIRD_PARTY = "THIRD_PARTY"
}
/**
 * Audit rule types
 */
export declare enum AuditRuleType {
    RATE_VERIFICATION = "RATE_VERIFICATION",
    WEIGHT_VERIFICATION = "WEIGHT_VERIFICATION",
    ACCESSORIAL_VALIDATION = "ACCESSORIAL_VALIDATION",
    DUPLICATE_DETECTION = "DUPLICATE_DETECTION",
    DISCOUNT_VERIFICATION = "DISCOUNT_VERIFICATION",
    FUEL_SURCHARGE_VALIDATION = "FUEL_SURCHARGE_VALIDATION",
    SERVICE_LEVEL_VALIDATION = "SERVICE_LEVEL_VALIDATION",
    DOCUMENTATION_CHECK = "DOCUMENTATION_CHECK"
}
/**
 * Freight charge types
 */
export declare enum FreightChargeType {
    BASE_FREIGHT = "BASE_FREIGHT",
    FUEL_SURCHARGE = "FUEL_SURCHARGE",
    ACCESSORIAL = "ACCESSORIAL",
    DETENTION = "DETENTION",
    STORAGE = "STORAGE",
    REDELIVERY = "REDELIVERY",
    RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
    LIFTGATE = "LIFTGATE",
    INSIDE_DELIVERY = "INSIDE_DELIVERY",
    APPOINTMENT = "APPOINTMENT",
    HAZMAT = "HAZMAT",
    OVERSIZE = "OVERSIZE"
}
/**
 * Freight charge line item
 */
export interface FreightCharge {
    chargeId: string;
    type: FreightChargeType;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    expectedAmount?: number;
    variance?: number;
    approved: boolean;
    metadata?: Record<string, any>;
}
/**
 * Shipment reference information
 */
export interface ShipmentReference {
    shipmentId: string;
    billOfLading: string;
    proNumber?: string;
    purchaseOrder?: string;
    originZip: string;
    destinationZip: string;
    shipDate: Date;
    deliveryDate?: Date;
    weight: number;
    weightUnit: 'LBS' | 'KG';
    pieces: number;
    freightClass?: string;
    serviceLevel: string;
    carrierBookedRate?: number;
}
/**
 * Freight invoice
 */
export interface FreightInvoice {
    invoiceId: string;
    invoiceNumber: string;
    carrierId: string;
    carrierName: string;
    carrierSCAC: string;
    invoiceDate: Date;
    dueDate: Date;
    shipment: ShipmentReference;
    charges: FreightCharge[];
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    status: FreightInvoiceStatus;
    receivedDate: Date;
    auditedDate?: Date;
    approvedDate?: Date;
    paidDate?: Date;
    paymentMethod?: FreightPaymentMethod;
    paymentReference?: string;
    discrepancies: FreightDiscrepancy[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Freight discrepancy
 */
export interface FreightDiscrepancy {
    discrepancyId: string;
    type: DiscrepancyType;
    severity: DiscrepancySeverity;
    description: string;
    invoicedAmount: number;
    expectedAmount: number;
    varianceAmount: number;
    variancePercent: number;
    chargeId?: string;
    ruleId?: string;
    detectedDate: Date;
    resolvedDate?: Date;
    resolution?: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ACCEPTED';
    assignedTo?: string;
}
/**
 * Audit rule definition
 */
export interface AuditRule {
    ruleId: string;
    name: string;
    type: AuditRuleType;
    enabled: boolean;
    priority: number;
    conditions: AuditRuleCondition[];
    thresholds: AuditRuleThreshold;
    actions: AuditRuleAction[];
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit rule condition
 */
export interface AuditRuleCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN_RANGE';
    value: any;
    logicOperator?: 'AND' | 'OR';
}
/**
 * Audit rule threshold
 */
export interface AuditRuleThreshold {
    variancePercent?: number;
    varianceAmount?: number;
    minAmount?: number;
    maxAmount?: number;
    warningLevel?: number;
    criticalLevel?: number;
}
/**
 * Audit rule action
 */
export interface AuditRuleAction {
    type: 'FLAG_INVOICE' | 'CREATE_DISCREPANCY' | 'AUTO_APPROVE' | 'AUTO_REJECT' | 'NOTIFY' | 'ESCALATE';
    severity?: DiscrepancySeverity;
    recipient?: string;
    message?: string;
}
/**
 * Audit result
 */
export interface AuditResult {
    invoiceId: string;
    auditDate: Date;
    passed: boolean;
    rulesEvaluated: number;
    rulesPassed: number;
    rulesFailed: number;
    discrepanciesFound: number;
    totalVariance: number;
    potentialSavings: number;
    ruleResults: AuditRuleResult[];
    recommendations: string[];
}
/**
 * Individual audit rule result
 */
export interface AuditRuleResult {
    ruleId: string;
    ruleName: string;
    passed: boolean;
    variance?: number;
    message: string;
    discrepancyCreated?: boolean;
}
/**
 * Payment batch for freight invoices
 */
export interface FreightPaymentBatch {
    batchId: string;
    batchDate: Date;
    carrierId?: string;
    invoices: FreightInvoice[];
    totalAmount: number;
    invoiceCount: number;
    paymentMethod: FreightPaymentMethod;
    paymentDate?: Date;
    paymentReference?: string;
    status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    approvedBy?: string;
    processedBy?: string;
}
/**
 * Cost allocation rule
 */
export interface CostAllocationRule {
    allocationId: string;
    name: string;
    enabled: boolean;
    priority: number;
    conditions: AllocationCondition[];
    distributions: CostDistribution[];
    glAccounts: GLAccountMapping[];
}
/**
 * Cost allocation condition
 */
export interface AllocationCondition {
    field: string;
    operator: 'EQUALS' | 'CONTAINS' | 'IN_RANGE';
    value: any;
}
/**
 * Cost distribution definition
 */
export interface CostDistribution {
    entityType: 'DEPARTMENT' | 'COST_CENTER' | 'PROJECT' | 'CUSTOMER' | 'PRODUCT_LINE';
    entityId: string;
    percentage: number;
    amount?: number;
    glAccount?: string;
}
/**
 * GL account mapping
 */
export interface GLAccountMapping {
    chargeType: FreightChargeType;
    glAccount: string;
    glDescription: string;
    department?: string;
    costCenter?: string;
}
/**
 * Cost allocation result
 */
export interface CostAllocationResult {
    invoiceId: string;
    totalAmount: number;
    allocations: AllocatedCost[];
    glEntries: GLEntry[];
    allocationDate: Date;
}
/**
 * Allocated cost detail
 */
export interface AllocatedCost {
    entityType: string;
    entityId: string;
    entityName?: string;
    amount: number;
    percentage: number;
    chargeBreakdown: Record<FreightChargeType, number>;
}
/**
 * General ledger entry
 */
export interface GLEntry {
    entryId: string;
    glAccount: string;
    glDescription: string;
    debitAmount: number;
    creditAmount: number;
    department?: string;
    costCenter?: string;
    reference: string;
}
/**
 * Carrier rate agreement
 */
export interface CarrierRateAgreement {
    agreementId: string;
    carrierId: string;
    carrierName: string;
    effectiveDate: Date;
    expirationDate: Date;
    serviceLevel: string;
    rates: RateTableEntry[];
    fuelSurchargeTable: FuelSurchargeEntry[];
    discountPercent?: number;
    minimumCharge?: number;
    accessorialRates: AccessorialRate[];
}
/**
 * Rate table entry
 */
export interface RateTableEntry {
    originZip: string;
    destinationZip: string;
    weightMin: number;
    weightMax: number;
    rate: number;
    rateUnit: 'PER_CWT' | 'PER_MILE' | 'FLAT' | 'PER_PIECE';
}
/**
 * Fuel surcharge table entry
 */
export interface FuelSurchargeEntry {
    fuelPriceMin: number;
    fuelPriceMax: number;
    surchargePercent: number;
}
/**
 * Accessorial rate
 */
export interface AccessorialRate {
    accessorialType: string;
    rate: number;
    rateType: 'FLAT' | 'PER_CWT' | 'PERCENTAGE';
    requiresApproval: boolean;
}
/**
 * 1. Creates a new freight invoice from carrier bill.
 *
 * @param {Partial<FreightInvoice>} invoiceData - Invoice data from carrier
 * @returns {FreightInvoice} New freight invoice object
 *
 * @example
 * ```typescript
 * const invoice = createFreightInvoice({
 *   invoiceNumber: 'INV-12345',
 *   carrierId: 'CARRIER-001',
 *   carrierName: 'ABC Freight',
 *   carrierSCAC: 'ABCF',
 *   invoiceDate: new Date(),
 *   shipment: { shipmentId: 'SHIP-001', ... }
 * });
 * ```
 */
export declare function createFreightInvoice(invoiceData: Partial<FreightInvoice>): FreightInvoice;
/**
 * 2. Adds a charge to freight invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to update
 * @param {Partial<FreightCharge>} charge - Charge details
 * @returns {FreightInvoice} Updated invoice
 *
 * @example
 * ```typescript
 * const updated = addFreightCharge(invoice, {
 *   type: FreightChargeType.BASE_FREIGHT,
 *   description: 'Base freight charge',
 *   quantity: 1500,
 *   rate: 12.50,
 *   amount: 187.50
 * });
 * ```
 */
export declare function addFreightCharge(invoice: FreightInvoice, charge: Partial<FreightCharge>): FreightInvoice;
/**
 * 3. Removes a charge from freight invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to update
 * @param {string} chargeId - Charge ID to remove
 * @returns {FreightInvoice} Updated invoice
 *
 * @example
 * ```typescript
 * const updated = removeFreightCharge(invoice, 'charge-123');
 * ```
 */
export declare function removeFreightCharge(invoice: FreightInvoice, chargeId: string): FreightInvoice;
/**
 * 4. Updates charge amount in freight invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to update
 * @param {string} chargeId - Charge ID to update
 * @param {number} amount - New amount
 * @param {string} reason - Reason for update
 * @returns {FreightInvoice} Updated invoice
 *
 * @example
 * ```typescript
 * const updated = updateChargeAmount(invoice, 'charge-123', 150.00, 'Rate correction');
 * ```
 */
export declare function updateChargeAmount(invoice: FreightInvoice, chargeId: string, amount: number, reason: string): FreightInvoice;
/**
 * 5. Recalculates all invoice totals.
 *
 * @param {FreightInvoice} invoice - Invoice to recalculate
 * @returns {FreightInvoice} Updated invoice with recalculated totals
 *
 * @example
 * ```typescript
 * const updated = recalculateInvoiceTotals(invoice);
 * ```
 */
export declare function recalculateInvoiceTotals(invoice: FreightInvoice): FreightInvoice;
/**
 * 6. Parses invoice from EDI 210 format.
 *
 * @param {string} edi210Data - EDI 210 invoice data
 * @returns {FreightInvoice} Parsed freight invoice
 *
 * @example
 * ```typescript
 * const invoice = parseEDI210Invoice(ediData);
 * ```
 */
export declare function parseEDI210Invoice(edi210Data: string): FreightInvoice;
/**
 * 7. Validates invoice data completeness.
 *
 * @param {FreightInvoice} invoice - Invoice to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateInvoiceData(invoice);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateInvoiceData(invoice: FreightInvoice): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 8. Matches invoice to shipment record.
 *
 * @param {FreightInvoice} invoice - Invoice to match
 * @param {ShipmentReference[]} shipments - Available shipments
 * @returns {object} Match result
 *
 * @example
 * ```typescript
 * const result = matchInvoiceToShipment(invoice, shipmentRecords);
 * if (result.matched) {
 *   console.log('Matched to shipment:', result.shipment.shipmentId);
 * }
 * ```
 */
export declare function matchInvoiceToShipment(invoice: FreightInvoice, shipments: ShipmentReference[]): {
    matched: boolean;
    shipment?: ShipmentReference;
    confidence: number;
    matchCriteria: string[];
};
/**
 * 9. Creates an audit rule.
 *
 * @param {Partial<AuditRule>} ruleData - Rule configuration
 * @returns {AuditRule} New audit rule
 *
 * @example
 * ```typescript
 * const rule = createAuditRule({
 *   name: 'Rate Variance Check',
 *   type: AuditRuleType.RATE_VERIFICATION,
 *   thresholds: { variancePercent: 5 },
 *   actions: [{ type: 'CREATE_DISCREPANCY', severity: DiscrepancySeverity.HIGH }]
 * });
 * ```
 */
export declare function createAuditRule(ruleData: Partial<AuditRule>): AuditRule;
/**
 * 10. Evaluates audit rule against invoice.
 *
 * @param {AuditRule} rule - Audit rule to evaluate
 * @param {FreightInvoice} invoice - Invoice to audit
 * @param {CarrierRateAgreement} rateAgreement - Carrier rate agreement
 * @returns {AuditRuleResult} Rule evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateAuditRule(rateRule, invoice, agreement);
 * if (!result.passed) {
 *   console.log('Rule failed:', result.message);
 * }
 * ```
 */
export declare function evaluateAuditRule(rule: AuditRule, invoice: FreightInvoice, rateAgreement?: CarrierRateAgreement): AuditRuleResult;
/**
 * 11. Applies audit rules to invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to audit
 * @param {AuditRule[]} rules - Audit rules to apply
 * @param {CarrierRateAgreement} rateAgreement - Carrier rate agreement
 * @returns {AuditResult} Comprehensive audit result
 *
 * @example
 * ```typescript
 * const auditResult = applyAuditRules(invoice, allRules, agreement);
 * console.log(`Audit complete: ${auditResult.passed ? 'PASSED' : 'FAILED'}`);
 * console.log(`Potential savings: $${auditResult.potentialSavings}`);
 * ```
 */
export declare function applyAuditRules(invoice: FreightInvoice, rules: AuditRule[], rateAgreement?: CarrierRateAgreement): AuditResult;
/**
 * 12. Validates rate against carrier agreement.
 *
 * @param {FreightCharge} charge - Charge to validate
 * @param {ShipmentReference} shipment - Shipment details
 * @param {CarrierRateAgreement} agreement - Rate agreement
 * @returns {object} Rate validation result
 *
 * @example
 * ```typescript
 * const result = validateRateAgainstAgreement(charge, shipment, agreement);
 * if (!result.valid) {
 *   console.log(`Rate variance: $${result.variance}`);
 * }
 * ```
 */
export declare function validateRateAgainstAgreement(charge: FreightCharge, shipment: ShipmentReference, agreement: CarrierRateAgreement): {
    valid: boolean;
    expectedRate?: number;
    actualRate: number;
    variance: number;
    variancePercent: number;
    message: string;
};
/**
 * 13. Validates fuel surcharge calculation.
 *
 * @param {FreightCharge} fuelCharge - Fuel surcharge to validate
 * @param {FreightCharge} baseCharge - Base freight charge
 * @param {CarrierRateAgreement} agreement - Rate agreement with FSC table
 * @param {number} currentFuelPrice - Current fuel price
 * @returns {object} Fuel surcharge validation result
 *
 * @example
 * ```typescript
 * const result = validateFuelSurcharge(fuelCharge, baseCharge, agreement, 3.75);
 * if (!result.valid) {
 *   console.log(`FSC variance: $${result.variance}`);
 * }
 * ```
 */
export declare function validateFuelSurcharge(fuelCharge: FreightCharge, baseCharge: FreightCharge, agreement: CarrierRateAgreement, currentFuelPrice: number): {
    valid: boolean;
    expectedAmount: number;
    actualAmount: number;
    variance: number;
    surchargePercent: number;
    message: string;
};
/**
 * 14. Checks for duplicate invoice submission.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @param {FreightInvoice[]} existingInvoices - Previously submitted invoices
 * @returns {object} Duplicate check result
 *
 * @example
 * ```typescript
 * const result = checkDuplicateInvoice(newInvoice, allInvoices);
 * if (result.isDuplicate) {
 *   console.log('Duplicate found:', result.duplicateOf);
 * }
 * ```
 */
export declare function checkDuplicateInvoice(invoice: FreightInvoice, existingInvoices: FreightInvoice[]): {
    isDuplicate: boolean;
    duplicateOf?: string;
    matchScore: number;
    matchReasons: string[];
};
/**
 * 15. Generates audit summary report.
 *
 * @param {AuditResult[]} auditResults - Audit results for multiple invoices
 * @returns {object} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateAuditSummary(monthlyAudits);
 * console.log(`Total potential savings: $${summary.totalPotentialSavings}`);
 * ```
 */
export declare function generateAuditSummary(auditResults: AuditResult[]): {
    totalInvoicesAudited: number;
    invoicesPassed: number;
    invoicesFailed: number;
    passRate: number;
    totalDiscrepancies: number;
    totalVariance: number;
    totalPotentialSavings: number;
    topDiscrepancyTypes: Array<{
        type: string;
        count: number;
        amount: number;
    }>;
    averageAuditTime?: number;
};
/**
 * 16. Creates a discrepancy record.
 *
 * @param {Partial<FreightDiscrepancy>} discrepancyData - Discrepancy details
 * @returns {FreightDiscrepancy} New discrepancy record
 *
 * @example
 * ```typescript
 * const discrepancy = createDiscrepancy({
 *   type: DiscrepancyType.RATE_VARIANCE,
 *   severity: DiscrepancySeverity.HIGH,
 *   description: 'Rate exceeds contract by 15%',
 *   invoicedAmount: 500,
 *   expectedAmount: 435
 * });
 * ```
 */
export declare function createDiscrepancy(discrepancyData: Partial<FreightDiscrepancy>): FreightDiscrepancy;
/**
 * 17. Detects weight discrepancies.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @param {number} actualWeight - Actual shipment weight
 * @param {number} tolerancePercent - Acceptable tolerance percentage
 * @returns {FreightDiscrepancy | null} Discrepancy if found
 *
 * @example
 * ```typescript
 * const discrepancy = detectWeightDiscrepancy(invoice, 1500, 5);
 * if (discrepancy) {
 *   console.log('Weight discrepancy detected:', discrepancy.description);
 * }
 * ```
 */
export declare function detectWeightDiscrepancy(invoice: FreightInvoice, actualWeight: number, tolerancePercent?: number): FreightDiscrepancy | null;
/**
 * 18. Detects unauthorized accessorial charges.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @param {string[]} authorizedAccessorials - List of authorized accessorials
 * @returns {FreightDiscrepancy[]} List of unauthorized charges
 *
 * @example
 * ```typescript
 * const unauthorized = detectUnauthorizedAccessorials(invoice, ['LIFTGATE', 'RESIDENTIAL']);
 * if (unauthorized.length > 0) {
 *   console.log(`Found ${unauthorized.length} unauthorized charges`);
 * }
 * ```
 */
export declare function detectUnauthorizedAccessorials(invoice: FreightInvoice, authorizedAccessorials: string[]): FreightDiscrepancy[];
/**
 * 19. Detects duplicate charges within invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @returns {FreightDiscrepancy[]} List of duplicate charge discrepancies
 *
 * @example
 * ```typescript
 * const duplicates = detectDuplicateCharges(invoice);
 * if (duplicates.length > 0) {
 *   console.log('Duplicate charges found');
 * }
 * ```
 */
export declare function detectDuplicateCharges(invoice: FreightInvoice): FreightDiscrepancy[];
/**
 * 20. Detects delivery performance issues.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @param {Date} expectedDeliveryDate - Expected delivery date
 * @returns {FreightDiscrepancy | null} Discrepancy if performance issue found
 *
 * @example
 * ```typescript
 * const discrepancy = detectDeliveryPerformanceIssue(invoice, expectedDate);
 * if (discrepancy) {
 *   console.log('Delivery was late');
 * }
 * ```
 */
export declare function detectDeliveryPerformanceIssue(invoice: FreightInvoice, expectedDeliveryDate: Date): FreightDiscrepancy | null;
/**
 * 21. Validates discount application.
 *
 * @param {FreightInvoice} invoice - Invoice to check
 * @param {number} expectedDiscountPercent - Expected discount percentage
 * @returns {FreightDiscrepancy | null} Discrepancy if discount incorrect
 *
 * @example
 * ```typescript
 * const discrepancy = validateDiscountApplication(invoice, 2.5);
 * if (discrepancy) {
 *   console.log('Discount was not applied correctly');
 * }
 * ```
 */
export declare function validateDiscountApplication(invoice: FreightInvoice, expectedDiscountPercent: number): FreightDiscrepancy | null;
/**
 * 22. Resolves a discrepancy.
 *
 * @param {FreightDiscrepancy} discrepancy - Discrepancy to resolve
 * @param {string} resolution - Resolution details
 * @param {string} resolvedBy - User who resolved it
 * @returns {FreightDiscrepancy} Updated discrepancy
 *
 * @example
 * ```typescript
 * const resolved = resolveDiscrepancy(discrepancy, 'Rate corrected per contract', 'USER-123');
 * ```
 */
export declare function resolveDiscrepancy(discrepancy: FreightDiscrepancy, resolution: string, resolvedBy: string): FreightDiscrepancy;
/**
 * 23. Generates discrepancy report for invoice.
 *
 * @param {FreightInvoice} invoice - Invoice with discrepancies
 * @returns {object} Discrepancy report
 *
 * @example
 * ```typescript
 * const report = generateDiscrepancyReport(invoice);
 * console.log(`Total potential recovery: $${report.totalPotentialRecovery}`);
 * ```
 */
export declare function generateDiscrepancyReport(invoice: FreightInvoice): {
    invoiceId: string;
    invoiceNumber: string;
    totalDiscrepancies: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    totalPotentialRecovery: number;
    discrepanciesByType: Record<DiscrepancyType, number>;
    details: FreightDiscrepancy[];
};
/**
 * 24. Approves invoice for payment.
 *
 * @param {FreightInvoice} invoice - Invoice to approve
 * @param {string} approvedBy - User approving the invoice
 * @param {string} notes - Approval notes
 * @returns {FreightInvoice} Approved invoice
 *
 * @example
 * ```typescript
 * const approved = approveInvoiceForPayment(invoice, 'APPROVER-123', 'All audits passed');
 * ```
 */
export declare function approveInvoiceForPayment(invoice: FreightInvoice, approvedBy: string, notes?: string): FreightInvoice;
/**
 * 25. Rejects invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to reject
 * @param {string} reason - Rejection reason
 * @param {string} rejectedBy - User rejecting the invoice
 * @returns {FreightInvoice} Rejected invoice
 *
 * @example
 * ```typescript
 * const rejected = rejectInvoice(invoice, 'Rate discrepancy exceeds threshold', 'AUDITOR-456');
 * ```
 */
export declare function rejectInvoice(invoice: FreightInvoice, reason: string, rejectedBy: string): FreightInvoice;
/**
 * 26. Creates payment batch for multiple invoices.
 *
 * @param {FreightInvoice[]} invoices - Invoices to batch
 * @param {FreightPaymentMethod} paymentMethod - Payment method
 * @param {string} carrierId - Optional carrier ID to filter
 * @returns {FreightPaymentBatch} Payment batch
 *
 * @example
 * ```typescript
 * const batch = createPaymentBatch(approvedInvoices, FreightPaymentMethod.ACH, 'CARRIER-001');
 * console.log(`Batch total: $${batch.totalAmount}`);
 * ```
 */
export declare function createPaymentBatch(invoices: FreightInvoice[], paymentMethod: FreightPaymentMethod, carrierId?: string): FreightPaymentBatch;
/**
 * 27. Processes payment batch.
 *
 * @param {FreightPaymentBatch} batch - Payment batch to process
 * @param {string} processedBy - User processing the payment
 * @returns {FreightPaymentBatch} Processed batch
 *
 * @example
 * ```typescript
 * const processed = processPaymentBatch(batch, 'PAYABLES-789');
 * ```
 */
export declare function processPaymentBatch(batch: FreightPaymentBatch, processedBy: string): FreightPaymentBatch;
/**
 * 28. Marks invoice as paid.
 *
 * @param {FreightInvoice} invoice - Invoice to mark as paid
 * @param {FreightPaymentMethod} paymentMethod - Payment method used
 * @param {string} paymentReference - Payment reference number
 * @returns {FreightInvoice} Updated invoice
 *
 * @example
 * ```typescript
 * const paid = markInvoiceAsPaid(invoice, FreightPaymentMethod.ACH, 'ACH-20240115-001');
 * ```
 */
export declare function markInvoiceAsPaid(invoice: FreightInvoice, paymentMethod: FreightPaymentMethod, paymentReference: string): FreightInvoice;
/**
 * 29. Calculates payment terms discount.
 *
 * @param {number} amount - Invoice amount
 * @param {Date} invoiceDate - Invoice date
 * @param {Date} paymentDate - Payment date
 * @param {object} terms - Payment terms (e.g., 2/10 net 30)
 * @returns {object} Discount calculation
 *
 * @example
 * ```typescript
 * const discount = calculatePaymentTermsDiscount(
 *   1000,
 *   invoiceDate,
 *   paymentDate,
 *   { discountPercent: 2, discountDays: 10, netDays: 30 }
 * );
 * ```
 */
export declare function calculatePaymentTermsDiscount(amount: number, invoiceDate: Date, paymentDate: Date, terms: {
    discountPercent: number;
    discountDays: number;
    netDays: number;
}): {
    eligible: boolean;
    discountAmount: number;
    netAmount: number;
    daysSinceInvoice: number;
};
/**
 * 30. Generates payment remittance advice.
 *
 * @param {FreightPaymentBatch} batch - Payment batch
 * @returns {string} Remittance advice document
 *
 * @example
 * ```typescript
 * const remittance = generatePaymentRemittance(batch);
 * console.log(remittance);
 * ```
 */
export declare function generatePaymentRemittance(batch: FreightPaymentBatch): string;
/**
 * 31. Validates payment batch before processing.
 *
 * @param {FreightPaymentBatch} batch - Batch to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePaymentBatch(batch);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validatePaymentBatch(batch: FreightPaymentBatch): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 32. Creates cost allocation rule.
 *
 * @param {Partial<CostAllocationRule>} ruleData - Rule configuration
 * @returns {CostAllocationRule} New allocation rule
 *
 * @example
 * ```typescript
 * const rule = createCostAllocationRule({
 *   name: 'Allocate by Department',
 *   distributions: [
 *     { entityType: 'DEPARTMENT', entityId: 'DEPT-001', percentage: 60 },
 *     { entityType: 'DEPARTMENT', entityId: 'DEPT-002', percentage: 40 }
 *   ]
 * });
 * ```
 */
export declare function createCostAllocationRule(ruleData: Partial<CostAllocationRule>): CostAllocationRule;
/**
 * 33. Applies cost allocation to invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to allocate
 * @param {CostAllocationRule[]} rules - Allocation rules
 * @returns {CostAllocationResult} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = allocateInvoiceCosts(invoice, allocationRules);
 * console.log(`Allocated to ${allocation.allocations.length} entities`);
 * ```
 */
export declare function allocateInvoiceCosts(invoice: FreightInvoice, rules: CostAllocationRule[]): CostAllocationResult;
/**
 * 34. Distributes freight costs by shipment weight.
 *
 * @param {FreightInvoice[]} invoices - Invoices to distribute
 * @param {object[]} entities - Entities with weight shares
 * @returns {CostAllocationResult[]} Distribution results
 *
 * @example
 * ```typescript
 * const results = distributeCostsByWeight(invoices, [
 *   { entityId: 'DEPT-001', weight: 1000 },
 *   { entityId: 'DEPT-002', weight: 500 }
 * ]);
 * ```
 */
export declare function distributeCostsByWeight(invoices: FreightInvoice[], entities: Array<{
    entityId: string;
    weight: number;
}>): CostAllocationResult[];
/**
 * 35. Generates GL entries for freight invoice.
 *
 * @param {FreightInvoice} invoice - Invoice to process
 * @param {GLAccountMapping[]} accountMappings - GL account mappings
 * @returns {GLEntry[]} Generated GL entries
 *
 * @example
 * ```typescript
 * const entries = generateGLEntries(invoice, glMappings);
 * console.log(`Generated ${entries.length} GL entries`);
 * ```
 */
export declare function generateGLEntries(invoice: FreightInvoice, accountMappings: GLAccountMapping[]): GLEntry[];
/**
 * 36. Allocates costs to customer orders.
 *
 * @param {FreightInvoice} invoice - Invoice to allocate
 * @param {string[]} orderNumbers - Customer order numbers on shipment
 * @returns {CostAllocationResult} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = allocateToCustomerOrders(invoice, ['ORD-001', 'ORD-002', 'ORD-003']);
 * ```
 */
export declare function allocateToCustomerOrders(invoice: FreightInvoice, orderNumbers: string[]): CostAllocationResult;
/**
 * 37. Generates cost allocation summary report.
 *
 * @param {CostAllocationResult[]} allocations - Allocation results
 * @returns {object} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateAllocationSummary(monthlyAllocations);
 * console.log(`Total allocated: $${summary.totalAllocated}`);
 * ```
 */
export declare function generateAllocationSummary(allocations: CostAllocationResult[]): {
    totalInvoices: number;
    totalAllocated: number;
    allocationsByEntity: Record<string, number>;
    allocationsByType: Record<string, number>;
    glEntriesGenerated: number;
};
/**
 * 38. Exports GL entries to CSV format.
 *
 * @param {GLEntry[]} entries - GL entries to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportGLEntriesToCSV(glEntries);
 * fs.writeFileSync('gl_export.csv', csv);
 * ```
 */
export declare function exportGLEntriesToCSV(entries: GLEntry[]): string;
declare const _default: {
    createFreightInvoice: typeof createFreightInvoice;
    addFreightCharge: typeof addFreightCharge;
    removeFreightCharge: typeof removeFreightCharge;
    updateChargeAmount: typeof updateChargeAmount;
    recalculateInvoiceTotals: typeof recalculateInvoiceTotals;
    parseEDI210Invoice: typeof parseEDI210Invoice;
    validateInvoiceData: typeof validateInvoiceData;
    matchInvoiceToShipment: typeof matchInvoiceToShipment;
    createAuditRule: typeof createAuditRule;
    evaluateAuditRule: typeof evaluateAuditRule;
    applyAuditRules: typeof applyAuditRules;
    validateRateAgainstAgreement: typeof validateRateAgainstAgreement;
    validateFuelSurcharge: typeof validateFuelSurcharge;
    checkDuplicateInvoice: typeof checkDuplicateInvoice;
    generateAuditSummary: typeof generateAuditSummary;
    createDiscrepancy: typeof createDiscrepancy;
    detectWeightDiscrepancy: typeof detectWeightDiscrepancy;
    detectUnauthorizedAccessorials: typeof detectUnauthorizedAccessorials;
    detectDuplicateCharges: typeof detectDuplicateCharges;
    detectDeliveryPerformanceIssue: typeof detectDeliveryPerformanceIssue;
    validateDiscountApplication: typeof validateDiscountApplication;
    resolveDiscrepancy: typeof resolveDiscrepancy;
    generateDiscrepancyReport: typeof generateDiscrepancyReport;
    approveInvoiceForPayment: typeof approveInvoiceForPayment;
    rejectInvoice: typeof rejectInvoice;
    createPaymentBatch: typeof createPaymentBatch;
    processPaymentBatch: typeof processPaymentBatch;
    markInvoiceAsPaid: typeof markInvoiceAsPaid;
    calculatePaymentTermsDiscount: typeof calculatePaymentTermsDiscount;
    generatePaymentRemittance: typeof generatePaymentRemittance;
    validatePaymentBatch: typeof validatePaymentBatch;
    createCostAllocationRule: typeof createCostAllocationRule;
    allocateInvoiceCosts: typeof allocateInvoiceCosts;
    distributeCostsByWeight: typeof distributeCostsByWeight;
    generateGLEntries: typeof generateGLEntries;
    allocateToCustomerOrders: typeof allocateToCustomerOrders;
    generateAllocationSummary: typeof generateAllocationSummary;
    exportGLEntriesToCSV: typeof exportGLEntriesToCSV;
};
export default _default;
//# sourceMappingURL=transportation-freight-audit-kit.d.ts.map