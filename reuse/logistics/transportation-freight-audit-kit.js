"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightChargeType = exports.AuditRuleType = exports.FreightPaymentMethod = exports.DiscrepancyType = exports.DiscrepancySeverity = exports.FreightInvoiceStatus = void 0;
exports.createFreightInvoice = createFreightInvoice;
exports.addFreightCharge = addFreightCharge;
exports.removeFreightCharge = removeFreightCharge;
exports.updateChargeAmount = updateChargeAmount;
exports.recalculateInvoiceTotals = recalculateInvoiceTotals;
exports.parseEDI210Invoice = parseEDI210Invoice;
exports.validateInvoiceData = validateInvoiceData;
exports.matchInvoiceToShipment = matchInvoiceToShipment;
exports.createAuditRule = createAuditRule;
exports.evaluateAuditRule = evaluateAuditRule;
exports.applyAuditRules = applyAuditRules;
exports.validateRateAgainstAgreement = validateRateAgainstAgreement;
exports.validateFuelSurcharge = validateFuelSurcharge;
exports.checkDuplicateInvoice = checkDuplicateInvoice;
exports.generateAuditSummary = generateAuditSummary;
exports.createDiscrepancy = createDiscrepancy;
exports.detectWeightDiscrepancy = detectWeightDiscrepancy;
exports.detectUnauthorizedAccessorials = detectUnauthorizedAccessorials;
exports.detectDuplicateCharges = detectDuplicateCharges;
exports.detectDeliveryPerformanceIssue = detectDeliveryPerformanceIssue;
exports.validateDiscountApplication = validateDiscountApplication;
exports.resolveDiscrepancy = resolveDiscrepancy;
exports.generateDiscrepancyReport = generateDiscrepancyReport;
exports.approveInvoiceForPayment = approveInvoiceForPayment;
exports.rejectInvoice = rejectInvoice;
exports.createPaymentBatch = createPaymentBatch;
exports.processPaymentBatch = processPaymentBatch;
exports.markInvoiceAsPaid = markInvoiceAsPaid;
exports.calculatePaymentTermsDiscount = calculatePaymentTermsDiscount;
exports.generatePaymentRemittance = generatePaymentRemittance;
exports.validatePaymentBatch = validatePaymentBatch;
exports.createCostAllocationRule = createCostAllocationRule;
exports.allocateInvoiceCosts = allocateInvoiceCosts;
exports.distributeCostsByWeight = distributeCostsByWeight;
exports.generateGLEntries = generateGLEntries;
exports.allocateToCustomerOrders = allocateToCustomerOrders;
exports.generateAllocationSummary = generateAllocationSummary;
exports.exportGLEntriesToCSV = exportGLEntriesToCSV;
/**
 * File: /reuse/logistics/transportation-freight-audit-kit.ts
 * Locator: WC-LOGISTICS-FREIGHT-AUDIT-001
 * Purpose: Comprehensive Freight Audit and Payment Management - Complete freight invoice audit lifecycle
 *
 * Upstream: Independent utility module for freight audit and payment operations
 * Downstream: ../backend/logistics/*, Transportation modules, Payment processors, Carrier management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for freight audit, invoice processing, discrepancy detection, payment
 *
 * LLM Context: Enterprise-grade freight audit and payment utilities to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive freight invoice processing, audit rule management, automated discrepancy detection,
 * payment processing, cost allocation, carrier performance tracking, rate verification, accessorial charge
 * validation, GL account distribution, and freight cost optimization.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Freight invoice status enumeration
 */
var FreightInvoiceStatus;
(function (FreightInvoiceStatus) {
    FreightInvoiceStatus["RECEIVED"] = "RECEIVED";
    FreightInvoiceStatus["PENDING_AUDIT"] = "PENDING_AUDIT";
    FreightInvoiceStatus["IN_AUDIT"] = "IN_AUDIT";
    FreightInvoiceStatus["AUDIT_PASSED"] = "AUDIT_PASSED";
    FreightInvoiceStatus["AUDIT_FAILED"] = "AUDIT_FAILED";
    FreightInvoiceStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    FreightInvoiceStatus["APPROVED"] = "APPROVED";
    FreightInvoiceStatus["REJECTED"] = "REJECTED";
    FreightInvoiceStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    FreightInvoiceStatus["PAID"] = "PAID";
    FreightInvoiceStatus["DISPUTED"] = "DISPUTED";
    FreightInvoiceStatus["CANCELLED"] = "CANCELLED";
})(FreightInvoiceStatus || (exports.FreightInvoiceStatus = FreightInvoiceStatus = {}));
/**
 * Discrepancy severity levels
 */
var DiscrepancySeverity;
(function (DiscrepancySeverity) {
    DiscrepancySeverity["CRITICAL"] = "CRITICAL";
    DiscrepancySeverity["HIGH"] = "HIGH";
    DiscrepancySeverity["MEDIUM"] = "MEDIUM";
    DiscrepancySeverity["LOW"] = "LOW";
    DiscrepancySeverity["INFORMATIONAL"] = "INFORMATIONAL";
})(DiscrepancySeverity || (exports.DiscrepancySeverity = DiscrepancySeverity = {}));
/**
 * Discrepancy types
 */
var DiscrepancyType;
(function (DiscrepancyType) {
    DiscrepancyType["RATE_VARIANCE"] = "RATE_VARIANCE";
    DiscrepancyType["WEIGHT_VARIANCE"] = "WEIGHT_VARIANCE";
    DiscrepancyType["DUPLICATE_CHARGE"] = "DUPLICATE_CHARGE";
    DiscrepancyType["UNAUTHORIZED_ACCESSORIAL"] = "UNAUTHORIZED_ACCESSORIAL";
    DiscrepancyType["INCORRECT_CLASSIFICATION"] = "INCORRECT_CLASSIFICATION";
    DiscrepancyType["DELIVERY_PERFORMANCE"] = "DELIVERY_PERFORMANCE";
    DiscrepancyType["MISSING_DOCUMENTATION"] = "MISSING_DOCUMENTATION";
    DiscrepancyType["INCORRECT_FUEL_SURCHARGE"] = "INCORRECT_FUEL_SURCHARGE";
    DiscrepancyType["INCORRECT_DISCOUNT"] = "INCORRECT_DISCOUNT";
    DiscrepancyType["BILLING_ERROR"] = "BILLING_ERROR";
})(DiscrepancyType || (exports.DiscrepancyType = DiscrepancyType = {}));
/**
 * Payment methods for freight
 */
var FreightPaymentMethod;
(function (FreightPaymentMethod) {
    FreightPaymentMethod["CHECK"] = "CHECK";
    FreightPaymentMethod["ACH"] = "ACH";
    FreightPaymentMethod["WIRE_TRANSFER"] = "WIRE_TRANSFER";
    FreightPaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    FreightPaymentMethod["EFT"] = "EFT";
    FreightPaymentMethod["PREPAID"] = "PREPAID";
    FreightPaymentMethod["COLLECT"] = "COLLECT";
    FreightPaymentMethod["THIRD_PARTY"] = "THIRD_PARTY";
})(FreightPaymentMethod || (exports.FreightPaymentMethod = FreightPaymentMethod = {}));
/**
 * Audit rule types
 */
var AuditRuleType;
(function (AuditRuleType) {
    AuditRuleType["RATE_VERIFICATION"] = "RATE_VERIFICATION";
    AuditRuleType["WEIGHT_VERIFICATION"] = "WEIGHT_VERIFICATION";
    AuditRuleType["ACCESSORIAL_VALIDATION"] = "ACCESSORIAL_VALIDATION";
    AuditRuleType["DUPLICATE_DETECTION"] = "DUPLICATE_DETECTION";
    AuditRuleType["DISCOUNT_VERIFICATION"] = "DISCOUNT_VERIFICATION";
    AuditRuleType["FUEL_SURCHARGE_VALIDATION"] = "FUEL_SURCHARGE_VALIDATION";
    AuditRuleType["SERVICE_LEVEL_VALIDATION"] = "SERVICE_LEVEL_VALIDATION";
    AuditRuleType["DOCUMENTATION_CHECK"] = "DOCUMENTATION_CHECK";
})(AuditRuleType || (exports.AuditRuleType = AuditRuleType = {}));
/**
 * Freight charge types
 */
var FreightChargeType;
(function (FreightChargeType) {
    FreightChargeType["BASE_FREIGHT"] = "BASE_FREIGHT";
    FreightChargeType["FUEL_SURCHARGE"] = "FUEL_SURCHARGE";
    FreightChargeType["ACCESSORIAL"] = "ACCESSORIAL";
    FreightChargeType["DETENTION"] = "DETENTION";
    FreightChargeType["STORAGE"] = "STORAGE";
    FreightChargeType["REDELIVERY"] = "REDELIVERY";
    FreightChargeType["RESIDENTIAL_DELIVERY"] = "RESIDENTIAL_DELIVERY";
    FreightChargeType["LIFTGATE"] = "LIFTGATE";
    FreightChargeType["INSIDE_DELIVERY"] = "INSIDE_DELIVERY";
    FreightChargeType["APPOINTMENT"] = "APPOINTMENT";
    FreightChargeType["HAZMAT"] = "HAZMAT";
    FreightChargeType["OVERSIZE"] = "OVERSIZE";
})(FreightChargeType || (exports.FreightChargeType = FreightChargeType = {}));
// ============================================================================
// SECTION 1: INVOICE PROCESSING (Functions 1-8)
// ============================================================================
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
function createFreightInvoice(invoiceData) {
    const invoiceId = generateInvoiceId();
    return {
        invoiceId,
        invoiceNumber: invoiceData.invoiceNumber || '',
        carrierId: invoiceData.carrierId || '',
        carrierName: invoiceData.carrierName || '',
        carrierSCAC: invoiceData.carrierSCAC || '',
        invoiceDate: invoiceData.invoiceDate || new Date(),
        dueDate: invoiceData.dueDate || calculateDueDate(new Date(), 30),
        shipment: invoiceData.shipment,
        charges: invoiceData.charges || [],
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
        status: FreightInvoiceStatus.RECEIVED,
        receivedDate: new Date(),
        discrepancies: [],
        notes: invoiceData.notes,
        metadata: invoiceData.metadata,
    };
}
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
function addFreightCharge(invoice, charge) {
    const chargeId = crypto.randomUUID();
    const quantity = charge.quantity || 1;
    const rate = charge.rate || 0;
    const amount = charge.amount || (quantity * rate);
    const freightCharge = {
        chargeId,
        type: charge.type || FreightChargeType.BASE_FREIGHT,
        description: charge.description || '',
        quantity,
        rate,
        amount,
        expectedAmount: charge.expectedAmount,
        variance: charge.expectedAmount ? amount - charge.expectedAmount : undefined,
        approved: false,
        metadata: charge.metadata,
    };
    const updatedInvoice = {
        ...invoice,
        charges: [...invoice.charges, freightCharge],
    };
    return recalculateInvoiceTotals(updatedInvoice);
}
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
function removeFreightCharge(invoice, chargeId) {
    const updatedInvoice = {
        ...invoice,
        charges: invoice.charges.filter(charge => charge.chargeId !== chargeId),
    };
    return recalculateInvoiceTotals(updatedInvoice);
}
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
function updateChargeAmount(invoice, chargeId, amount, reason) {
    const updatedInvoice = {
        ...invoice,
        charges: invoice.charges.map(charge => {
            if (charge.chargeId === chargeId) {
                return {
                    ...charge,
                    amount,
                    variance: charge.expectedAmount ? amount - charge.expectedAmount : undefined,
                    metadata: {
                        ...charge.metadata,
                        correctionReason: reason,
                        correctionDate: new Date().toISOString(),
                    },
                };
            }
            return charge;
        }),
    };
    return recalculateInvoiceTotals(updatedInvoice);
}
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
function recalculateInvoiceTotals(invoice) {
    const subtotal = invoice.charges.reduce((sum, charge) => sum + charge.amount, 0);
    const total = subtotal - invoice.discountAmount + invoice.taxAmount;
    return {
        ...invoice,
        subtotal,
        total,
    };
}
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
function parseEDI210Invoice(edi210Data) {
    // Simplified EDI parsing - in production, use full EDI parser
    const lines = edi210Data.split('\n');
    const invoice = createFreightInvoice({
        invoiceNumber: extractEDIField(lines, 'B3', 2),
        carrierSCAC: extractEDIField(lines, 'B3', 3),
    });
    // Parse shipment details from L3 segment
    const weight = parseFloat(extractEDIField(lines, 'L3', 1) || '0');
    const freight = parseFloat(extractEDIField(lines, 'L3', 2) || '0');
    if (invoice.shipment) {
        invoice.shipment.weight = weight;
    }
    // Add base freight charge
    if (freight > 0) {
        return addFreightCharge(invoice, {
            type: FreightChargeType.BASE_FREIGHT,
            description: 'Base Freight Charge',
            quantity: weight,
            rate: freight / weight,
            amount: freight,
        });
    }
    return invoice;
}
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
function validateInvoiceData(invoice) {
    const errors = [];
    const warnings = [];
    if (!invoice.invoiceNumber) {
        errors.push('Invoice number is required');
    }
    if (!invoice.carrierId) {
        errors.push('Carrier ID is required');
    }
    if (!invoice.shipment || !invoice.shipment.shipmentId) {
        errors.push('Shipment reference is required');
    }
    if (!invoice.charges || invoice.charges.length === 0) {
        errors.push('Invoice must have at least one charge');
    }
    if (invoice.total <= 0) {
        errors.push('Invoice total must be greater than zero');
    }
    if (!invoice.shipment?.billOfLading) {
        warnings.push('Bill of lading number is missing');
    }
    if (!invoice.shipment?.proNumber) {
        warnings.push('PRO number is missing');
    }
    if (invoice.dueDate < invoice.invoiceDate) {
        errors.push('Due date cannot be before invoice date');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function matchInvoiceToShipment(invoice, shipments) {
    const matchCriteria = [];
    let bestMatch;
    let highestScore = 0;
    for (const shipment of shipments) {
        let score = 0;
        const criteria = [];
        // Match by BOL
        if (invoice.shipment.billOfLading === shipment.billOfLading) {
            score += 50;
            criteria.push('BOL');
        }
        // Match by PRO number
        if (invoice.shipment.proNumber && invoice.shipment.proNumber === shipment.proNumber) {
            score += 40;
            criteria.push('PRO');
        }
        // Match by origin/destination
        if (invoice.shipment.originZip === shipment.originZip &&
            invoice.shipment.destinationZip === shipment.destinationZip) {
            score += 20;
            criteria.push('ORIGIN_DEST');
        }
        // Match by ship date (within 2 days)
        const dateDiff = Math.abs(invoice.shipment.shipDate.getTime() - shipment.shipDate.getTime());
        if (dateDiff <= 2 * 24 * 60 * 60 * 1000) {
            score += 15;
            criteria.push('SHIP_DATE');
        }
        // Match by weight (within 10%)
        const weightVariance = Math.abs(invoice.shipment.weight - shipment.weight) / shipment.weight;
        if (weightVariance <= 0.1) {
            score += 10;
            criteria.push('WEIGHT');
        }
        if (score > highestScore) {
            highestScore = score;
            bestMatch = shipment;
            matchCriteria.length = 0;
            matchCriteria.push(...criteria);
        }
    }
    return {
        matched: highestScore >= 50,
        shipment: bestMatch,
        confidence: Math.min(highestScore / 100, 1),
        matchCriteria,
    };
}
// ============================================================================
// SECTION 2: AUDIT RULES (Functions 9-15)
// ============================================================================
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
function createAuditRule(ruleData) {
    const ruleId = `RULE-${crypto.randomUUID()}`;
    return {
        ruleId,
        name: ruleData.name || '',
        type: ruleData.type || AuditRuleType.RATE_VERIFICATION,
        enabled: ruleData.enabled !== undefined ? ruleData.enabled : true,
        priority: ruleData.priority || 100,
        conditions: ruleData.conditions || [],
        thresholds: ruleData.thresholds || {},
        actions: ruleData.actions || [],
        description: ruleData.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
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
function evaluateAuditRule(rule, invoice, rateAgreement) {
    if (!rule.enabled) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: true,
            message: 'Rule disabled',
            discrepancyCreated: false,
        };
    }
    switch (rule.type) {
        case AuditRuleType.RATE_VERIFICATION:
            return evaluateRateVerificationRule(rule, invoice, rateAgreement);
        case AuditRuleType.WEIGHT_VERIFICATION:
            return evaluateWeightVerificationRule(rule, invoice);
        case AuditRuleType.ACCESSORIAL_VALIDATION:
            return evaluateAccessorialValidationRule(rule, invoice, rateAgreement);
        case AuditRuleType.DUPLICATE_DETECTION:
            return evaluateDuplicateDetectionRule(rule, invoice);
        case AuditRuleType.FUEL_SURCHARGE_VALIDATION:
            return evaluateFuelSurchargeRule(rule, invoice, rateAgreement);
        default:
            return {
                ruleId: rule.ruleId,
                ruleName: rule.name,
                passed: true,
                message: 'Rule type not implemented',
                discrepancyCreated: false,
            };
    }
}
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
function applyAuditRules(invoice, rules, rateAgreement) {
    const sortedRules = rules
        .filter(rule => rule.enabled)
        .sort((a, b) => a.priority - b.priority);
    const ruleResults = [];
    let totalVariance = 0;
    let potentialSavings = 0;
    for (const rule of sortedRules) {
        const result = evaluateAuditRule(rule, invoice, rateAgreement);
        ruleResults.push(result);
        if (!result.passed && result.variance) {
            totalVariance += Math.abs(result.variance);
            if (result.variance > 0) {
                potentialSavings += result.variance;
            }
        }
    }
    const passed = ruleResults.every(r => r.passed);
    const rulesFailed = ruleResults.filter(r => !r.passed).length;
    const discrepanciesFound = ruleResults.filter(r => r.discrepancyCreated).length;
    return {
        invoiceId: invoice.invoiceId,
        auditDate: new Date(),
        passed,
        rulesEvaluated: sortedRules.length,
        rulesPassed: sortedRules.length - rulesFailed,
        rulesFailed,
        discrepanciesFound,
        totalVariance,
        potentialSavings,
        ruleResults,
        recommendations: generateAuditRecommendations(ruleResults),
    };
}
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
function validateRateAgainstAgreement(charge, shipment, agreement) {
    if (charge.type !== FreightChargeType.BASE_FREIGHT) {
        return {
            valid: true,
            actualRate: charge.rate,
            variance: 0,
            variancePercent: 0,
            message: 'Not a base freight charge',
        };
    }
    const expectedRate = findApplicableRate(agreement, shipment);
    if (!expectedRate) {
        return {
            valid: false,
            actualRate: charge.rate,
            variance: 0,
            variancePercent: 0,
            message: 'No applicable rate found in agreement',
        };
    }
    const variance = charge.amount - expectedRate;
    const variancePercent = (variance / expectedRate) * 100;
    return {
        valid: Math.abs(variancePercent) <= 5, // 5% tolerance
        expectedRate,
        actualRate: charge.rate,
        variance,
        variancePercent,
        message: variance > 0 ? 'Overcharge detected' : variance < 0 ? 'Undercharge detected' : 'Rate matches',
    };
}
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
function validateFuelSurcharge(fuelCharge, baseCharge, agreement, currentFuelPrice) {
    const fscPercent = calculateFuelSurchargePercent(agreement.fuelSurchargeTable, currentFuelPrice);
    const expectedAmount = baseCharge.amount * (fscPercent / 100);
    const variance = fuelCharge.amount - expectedAmount;
    const variancePercent = Math.abs(variance / expectedAmount) * 100;
    return {
        valid: variancePercent <= 2, // 2% tolerance
        expectedAmount,
        actualAmount: fuelCharge.amount,
        variance,
        surchargePercent: fscPercent,
        message: variancePercent <= 2
            ? 'Fuel surcharge is correct'
            : `Fuel surcharge variance of ${variancePercent.toFixed(2)}%`,
    };
}
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
function checkDuplicateInvoice(invoice, existingInvoices) {
    const matchReasons = [];
    let highestScore = 0;
    let duplicateOfId;
    for (const existing of existingInvoices) {
        if (existing.invoiceId === invoice.invoiceId)
            continue;
        let score = 0;
        const reasons = [];
        // Same invoice number from same carrier
        if (invoice.invoiceNumber === existing.invoiceNumber &&
            invoice.carrierId === existing.carrierId) {
            score += 50;
            reasons.push('Same invoice number');
        }
        // Same BOL
        if (invoice.shipment.billOfLading === existing.shipment.billOfLading) {
            score += 30;
            reasons.push('Same BOL');
        }
        // Same amount and ship date
        if (Math.abs(invoice.total - existing.total) < 0.01 &&
            invoice.shipment.shipDate.toDateString() === existing.shipment.shipDate.toDateString()) {
            score += 20;
            reasons.push('Same amount and date');
        }
        if (score > highestScore) {
            highestScore = score;
            duplicateOfId = existing.invoiceId;
            matchReasons.length = 0;
            matchReasons.push(...reasons);
        }
    }
    return {
        isDuplicate: highestScore >= 50,
        duplicateOf: duplicateOfId,
        matchScore: highestScore,
        matchReasons,
    };
}
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
function generateAuditSummary(auditResults) {
    const totalInvoices = auditResults.length;
    const passed = auditResults.filter(r => r.passed).length;
    const totalDiscrepancies = auditResults.reduce((sum, r) => sum + r.discrepanciesFound, 0);
    const totalVariance = auditResults.reduce((sum, r) => sum + r.totalVariance, 0);
    const totalSavings = auditResults.reduce((sum, r) => sum + r.potentialSavings, 0);
    return {
        totalInvoicesAudited: totalInvoices,
        invoicesPassed: passed,
        invoicesFailed: totalInvoices - passed,
        passRate: totalInvoices > 0 ? (passed / totalInvoices) * 100 : 0,
        totalDiscrepancies,
        totalVariance,
        totalPotentialSavings: totalSavings,
        topDiscrepancyTypes: [],
    };
}
// ============================================================================
// SECTION 3: DISCREPANCY DETECTION (Functions 16-23)
// ============================================================================
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
function createDiscrepancy(discrepancyData) {
    const discrepancyId = `DISC-${crypto.randomUUID()}`;
    const invoiced = discrepancyData.invoicedAmount || 0;
    const expected = discrepancyData.expectedAmount || 0;
    const variance = invoiced - expected;
    const variancePercent = expected !== 0 ? (variance / expected) * 100 : 0;
    return {
        discrepancyId,
        type: discrepancyData.type || DiscrepancyType.BILLING_ERROR,
        severity: discrepancyData.severity || DiscrepancySeverity.MEDIUM,
        description: discrepancyData.description || '',
        invoicedAmount: invoiced,
        expectedAmount: expected,
        varianceAmount: variance,
        variancePercent,
        chargeId: discrepancyData.chargeId,
        ruleId: discrepancyData.ruleId,
        detectedDate: new Date(),
        status: 'OPEN',
        assignedTo: discrepancyData.assignedTo,
    };
}
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
function detectWeightDiscrepancy(invoice, actualWeight, tolerancePercent = 5) {
    const invoicedWeight = invoice.shipment.weight;
    const variance = Math.abs(invoicedWeight - actualWeight);
    const variancePercent = (variance / actualWeight) * 100;
    if (variancePercent > tolerancePercent) {
        return createDiscrepancy({
            type: DiscrepancyType.WEIGHT_VARIANCE,
            severity: variancePercent > 10 ? DiscrepancySeverity.HIGH : DiscrepancySeverity.MEDIUM,
            description: `Weight variance of ${variancePercent.toFixed(2)}% detected`,
            invoicedAmount: invoicedWeight,
            expectedAmount: actualWeight,
        });
    }
    return null;
}
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
function detectUnauthorizedAccessorials(invoice, authorizedAccessorials) {
    const discrepancies = [];
    for (const charge of invoice.charges) {
        if (charge.type === FreightChargeType.ACCESSORIAL) {
            const isAuthorized = authorizedAccessorials.some(auth => charge.description.toUpperCase().includes(auth.toUpperCase()));
            if (!isAuthorized) {
                discrepancies.push(createDiscrepancy({
                    type: DiscrepancyType.UNAUTHORIZED_ACCESSORIAL,
                    severity: DiscrepancySeverity.HIGH,
                    description: `Unauthorized accessorial charge: ${charge.description}`,
                    invoicedAmount: charge.amount,
                    expectedAmount: 0,
                    chargeId: charge.chargeId,
                }));
            }
        }
    }
    return discrepancies;
}
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
function detectDuplicateCharges(invoice) {
    const discrepancies = [];
    const seen = new Map();
    for (const charge of invoice.charges) {
        const key = `${charge.type}-${charge.description}-${charge.amount}`;
        if (seen.has(key)) {
            discrepancies.push(createDiscrepancy({
                type: DiscrepancyType.DUPLICATE_CHARGE,
                severity: DiscrepancySeverity.CRITICAL,
                description: `Duplicate charge detected: ${charge.description}`,
                invoicedAmount: charge.amount,
                expectedAmount: 0,
                chargeId: charge.chargeId,
            }));
        }
        else {
            seen.set(key, charge);
        }
    }
    return discrepancies;
}
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
function detectDeliveryPerformanceIssue(invoice, expectedDeliveryDate) {
    if (!invoice.shipment.deliveryDate) {
        return createDiscrepancy({
            type: DiscrepancyType.DELIVERY_PERFORMANCE,
            severity: DiscrepancySeverity.LOW,
            description: 'Delivery date not recorded on invoice',
            invoicedAmount: 0,
            expectedAmount: 0,
        });
    }
    const actualDelivery = invoice.shipment.deliveryDate;
    const daysLate = Math.floor((actualDelivery.getTime() - expectedDeliveryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLate > 0) {
        return createDiscrepancy({
            type: DiscrepancyType.DELIVERY_PERFORMANCE,
            severity: daysLate > 3 ? DiscrepancySeverity.HIGH : DiscrepancySeverity.MEDIUM,
            description: `Delivery was ${daysLate} day(s) late`,
            invoicedAmount: invoice.total,
            expectedAmount: invoice.total,
        });
    }
    return null;
}
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
function validateDiscountApplication(invoice, expectedDiscountPercent) {
    const expectedDiscount = invoice.subtotal * (expectedDiscountPercent / 100);
    const variance = Math.abs(invoice.discountAmount - expectedDiscount);
    const variancePercent = expectedDiscount !== 0 ? (variance / expectedDiscount) * 100 : 0;
    if (variancePercent > 1) { // 1% tolerance
        return createDiscrepancy({
            type: DiscrepancyType.INCORRECT_DISCOUNT,
            severity: DiscrepancySeverity.MEDIUM,
            description: `Discount variance: expected ${expectedDiscountPercent}%, got ${((invoice.discountAmount / invoice.subtotal) * 100).toFixed(2)}%`,
            invoicedAmount: invoice.discountAmount,
            expectedAmount: expectedDiscount,
        });
    }
    return null;
}
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
function resolveDiscrepancy(discrepancy, resolution, resolvedBy) {
    return {
        ...discrepancy,
        status: 'RESOLVED',
        resolution,
        resolvedDate: new Date(),
        assignedTo: resolvedBy,
    };
}
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
function generateDiscrepancyReport(invoice) {
    const bySeverity = {
        [DiscrepancySeverity.CRITICAL]: 0,
        [DiscrepancySeverity.HIGH]: 0,
        [DiscrepancySeverity.MEDIUM]: 0,
        [DiscrepancySeverity.LOW]: 0,
        [DiscrepancySeverity.INFORMATIONAL]: 0,
    };
    const byType = {};
    let potentialRecovery = 0;
    for (const disc of invoice.discrepancies) {
        bySeverity[disc.severity]++;
        byType[disc.type] = (byType[disc.type] || 0) + 1;
        if (disc.varianceAmount > 0) {
            potentialRecovery += disc.varianceAmount;
        }
    }
    return {
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        totalDiscrepancies: invoice.discrepancies.length,
        criticalCount: bySeverity[DiscrepancySeverity.CRITICAL],
        highCount: bySeverity[DiscrepancySeverity.HIGH],
        mediumCount: bySeverity[DiscrepancySeverity.MEDIUM],
        lowCount: bySeverity[DiscrepancySeverity.LOW],
        totalPotentialRecovery: potentialRecovery,
        discrepanciesByType: byType,
        details: invoice.discrepancies,
    };
}
// ============================================================================
// SECTION 4: PAYMENT PROCESSING (Functions 24-31)
// ============================================================================
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
function approveInvoiceForPayment(invoice, approvedBy, notes) {
    if (invoice.status === FreightInvoiceStatus.AUDIT_FAILED) {
        throw new Error('Cannot approve invoice that failed audit');
    }
    if (invoice.discrepancies.some(d => d.status === 'OPEN' && d.severity === DiscrepancySeverity.CRITICAL)) {
        throw new Error('Cannot approve invoice with unresolved critical discrepancies');
    }
    return {
        ...invoice,
        status: FreightInvoiceStatus.APPROVED,
        approvedDate: new Date(),
        notes: notes || invoice.notes,
        metadata: {
            ...invoice.metadata,
            approvedBy,
            approvalDate: new Date().toISOString(),
        },
    };
}
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
function rejectInvoice(invoice, reason, rejectedBy) {
    return {
        ...invoice,
        status: FreightInvoiceStatus.REJECTED,
        notes: reason,
        metadata: {
            ...invoice.metadata,
            rejectedBy,
            rejectionReason: reason,
            rejectionDate: new Date().toISOString(),
        },
    };
}
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
function createPaymentBatch(invoices, paymentMethod, carrierId) {
    let filteredInvoices = invoices.filter(inv => inv.status === FreightInvoiceStatus.APPROVED);
    if (carrierId) {
        filteredInvoices = filteredInvoices.filter(inv => inv.carrierId === carrierId);
    }
    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    return {
        batchId: `BATCH-${crypto.randomUUID()}`,
        batchDate: new Date(),
        carrierId,
        invoices: filteredInvoices,
        totalAmount,
        invoiceCount: filteredInvoices.length,
        paymentMethod,
        status: 'DRAFT',
    };
}
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
function processPaymentBatch(batch, processedBy) {
    if (batch.status !== 'DRAFT') {
        throw new Error('Only draft batches can be processed');
    }
    const paymentDate = new Date();
    const paymentReference = generatePaymentReference(batch);
    return {
        ...batch,
        status: 'PROCESSING',
        paymentDate,
        paymentReference,
        processedBy,
    };
}
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
function markInvoiceAsPaid(invoice, paymentMethod, paymentReference) {
    return {
        ...invoice,
        status: FreightInvoiceStatus.PAID,
        paidDate: new Date(),
        paymentMethod,
        paymentReference,
    };
}
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
function calculatePaymentTermsDiscount(amount, invoiceDate, paymentDate, terms) {
    const daysSinceInvoice = Math.floor((paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
    const eligible = daysSinceInvoice <= terms.discountDays;
    const discountAmount = eligible ? amount * (terms.discountPercent / 100) : 0;
    const netAmount = amount - discountAmount;
    return {
        eligible,
        discountAmount,
        netAmount,
        daysSinceInvoice,
    };
}
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
function generatePaymentRemittance(batch) {
    let remittance = '='.repeat(60) + '\n';
    remittance += 'FREIGHT PAYMENT REMITTANCE ADVICE\n';
    remittance += '='.repeat(60) + '\n\n';
    remittance += `Payment Batch: ${batch.batchId}\n`;
    remittance += `Payment Date: ${batch.paymentDate?.toLocaleDateString()}\n`;
    remittance += `Payment Method: ${batch.paymentMethod}\n`;
    remittance += `Payment Reference: ${batch.paymentReference}\n\n`;
    if (batch.carrierId) {
        remittance += `Carrier: ${batch.carrierId}\n\n`;
    }
    remittance += '-'.repeat(60) + '\n';
    remittance += 'INVOICES INCLUDED IN THIS PAYMENT:\n';
    remittance += '-'.repeat(60) + '\n\n';
    for (const invoice of batch.invoices) {
        remittance += `Invoice: ${invoice.invoiceNumber}\n`;
        remittance += `  BOL: ${invoice.shipment.billOfLading}\n`;
        remittance += `  Ship Date: ${invoice.shipment.shipDate.toLocaleDateString()}\n`;
        remittance += `  Amount: $${invoice.total.toFixed(2)}\n\n`;
    }
    remittance += '-'.repeat(60) + '\n';
    remittance += `Total Invoices: ${batch.invoiceCount}\n`;
    remittance += `TOTAL PAYMENT AMOUNT: $${batch.totalAmount.toFixed(2)}\n`;
    remittance += '='.repeat(60) + '\n';
    return remittance;
}
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
function validatePaymentBatch(batch) {
    const errors = [];
    const warnings = [];
    if (batch.invoices.length === 0) {
        errors.push('Payment batch must contain at least one invoice');
    }
    if (batch.totalAmount <= 0) {
        errors.push('Payment batch total must be greater than zero');
    }
    const unapprovedInvoices = batch.invoices.filter(inv => inv.status !== FreightInvoiceStatus.APPROVED);
    if (unapprovedInvoices.length > 0) {
        errors.push(`Batch contains ${unapprovedInvoices.length} unapproved invoices`);
    }
    const calculatedTotal = batch.invoices.reduce((sum, inv) => sum + inv.total, 0);
    if (Math.abs(calculatedTotal - batch.totalAmount) > 0.01) {
        errors.push('Batch total does not match sum of invoice totals');
    }
    const hasDiscrepancies = batch.invoices.some(inv => inv.discrepancies.some(d => d.status === 'OPEN' && d.severity === DiscrepancySeverity.HIGH));
    if (hasDiscrepancies) {
        warnings.push('Some invoices have unresolved high-severity discrepancies');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
// ============================================================================
// SECTION 5: COST ALLOCATION (Functions 32-38)
// ============================================================================
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
function createCostAllocationRule(ruleData) {
    const allocationId = `ALLOC-${crypto.randomUUID()}`;
    return {
        allocationId,
        name: ruleData.name || '',
        enabled: ruleData.enabled !== undefined ? ruleData.enabled : true,
        priority: ruleData.priority || 100,
        conditions: ruleData.conditions || [],
        distributions: ruleData.distributions || [],
        glAccounts: ruleData.glAccounts || [],
    };
}
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
function allocateInvoiceCosts(invoice, rules) {
    const applicableRule = findApplicableAllocationRule(invoice, rules);
    if (!applicableRule) {
        throw new Error('No applicable allocation rule found');
    }
    const allocations = [];
    const glEntries = [];
    for (const distribution of applicableRule.distributions) {
        const amount = invoice.total * (distribution.percentage / 100);
        const chargeBreakdown = calculateChargeBreakdown(invoice, distribution.percentage);
        allocations.push({
            entityType: distribution.entityType,
            entityId: distribution.entityId,
            amount,
            percentage: distribution.percentage,
            chargeBreakdown,
        });
        // Create GL entry for this allocation
        const glAccount = distribution.glAccount ||
            applicableRule.glAccounts.find(gl => gl.chargeType === FreightChargeType.BASE_FREIGHT)?.glAccount ||
            '5000-FREIGHT';
        glEntries.push({
            entryId: crypto.randomUUID(),
            glAccount,
            glDescription: `Freight charge - ${invoice.invoiceNumber}`,
            debitAmount: amount,
            creditAmount: 0,
            department: distribution.entityType === 'DEPARTMENT' ? distribution.entityId : undefined,
            costCenter: distribution.entityType === 'COST_CENTER' ? distribution.entityId : undefined,
            reference: invoice.invoiceNumber,
        });
    }
    return {
        invoiceId: invoice.invoiceId,
        totalAmount: invoice.total,
        allocations,
        glEntries,
        allocationDate: new Date(),
    };
}
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
function distributeCostsByWeight(invoices, entities) {
    const totalWeight = entities.reduce((sum, e) => sum + e.weight, 0);
    const results = [];
    for (const invoice of invoices) {
        const allocations = [];
        const glEntries = [];
        for (const entity of entities) {
            const percentage = (entity.weight / totalWeight) * 100;
            const amount = invoice.total * (percentage / 100);
            allocations.push({
                entityType: 'DEPARTMENT',
                entityId: entity.entityId,
                amount,
                percentage,
                chargeBreakdown: calculateChargeBreakdown(invoice, percentage),
            });
            glEntries.push({
                entryId: crypto.randomUUID(),
                glAccount: '5000-FREIGHT',
                glDescription: `Freight allocation - ${invoice.invoiceNumber}`,
                debitAmount: amount,
                creditAmount: 0,
                department: entity.entityId,
                reference: invoice.invoiceNumber,
            });
        }
        results.push({
            invoiceId: invoice.invoiceId,
            totalAmount: invoice.total,
            allocations,
            glEntries,
            allocationDate: new Date(),
        });
    }
    return results;
}
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
function generateGLEntries(invoice, accountMappings) {
    const entries = [];
    // Group charges by type
    const chargesByType = new Map();
    for (const charge of invoice.charges) {
        const current = chargesByType.get(charge.type) || 0;
        chargesByType.set(charge.type, current + charge.amount);
    }
    // Create debit entries for each charge type
    for (const [chargeType, amount] of chargesByType.entries()) {
        const mapping = accountMappings.find(m => m.chargeType === chargeType);
        const glAccount = mapping?.glAccount || '5000-FREIGHT-OTHER';
        const glDescription = mapping?.glDescription || `Freight charge - ${chargeType}`;
        entries.push({
            entryId: crypto.randomUUID(),
            glAccount,
            glDescription,
            debitAmount: amount,
            creditAmount: 0,
            department: mapping?.department,
            costCenter: mapping?.costCenter,
            reference: invoice.invoiceNumber,
        });
    }
    // Create credit entry for accounts payable
    entries.push({
        entryId: crypto.randomUUID(),
        glAccount: '2000-ACCOUNTS-PAYABLE',
        glDescription: `Freight payable - ${invoice.carrierName}`,
        debitAmount: 0,
        creditAmount: invoice.total,
        reference: invoice.invoiceNumber,
    });
    return entries;
}
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
function allocateToCustomerOrders(invoice, orderNumbers) {
    const allocations = [];
    const glEntries = [];
    const amountPerOrder = invoice.total / orderNumbers.length;
    const percentPerOrder = 100 / orderNumbers.length;
    for (const orderNumber of orderNumbers) {
        const chargeBreakdown = calculateChargeBreakdown(invoice, percentPerOrder);
        allocations.push({
            entityType: 'CUSTOMER',
            entityId: orderNumber,
            amount: amountPerOrder,
            percentage: percentPerOrder,
            chargeBreakdown,
        });
        glEntries.push({
            entryId: crypto.randomUUID(),
            glAccount: '1300-ACCOUNTS-RECEIVABLE',
            glDescription: `Freight charge - Order ${orderNumber}`,
            debitAmount: amountPerOrder,
            creditAmount: 0,
            reference: orderNumber,
        });
    }
    return {
        invoiceId: invoice.invoiceId,
        totalAmount: invoice.total,
        allocations,
        glEntries,
        allocationDate: new Date(),
    };
}
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
function generateAllocationSummary(allocations) {
    let totalAllocated = 0;
    let glEntriesCount = 0;
    const byEntity = {};
    const byType = {};
    for (const allocation of allocations) {
        totalAllocated += allocation.totalAmount;
        glEntriesCount += allocation.glEntries.length;
        for (const alloc of allocation.allocations) {
            const key = `${alloc.entityType}:${alloc.entityId}`;
            byEntity[key] = (byEntity[key] || 0) + alloc.amount;
            byType[alloc.entityType] = (byType[alloc.entityType] || 0) + alloc.amount;
        }
    }
    return {
        totalInvoices: allocations.length,
        totalAllocated,
        allocationsByEntity: byEntity,
        allocationsByType: byType,
        glEntriesGenerated: glEntriesCount,
    };
}
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
function exportGLEntriesToCSV(entries) {
    const headers = [
        'Entry ID',
        'GL Account',
        'Description',
        'Debit Amount',
        'Credit Amount',
        'Department',
        'Cost Center',
        'Reference',
    ];
    let csv = headers.join(',') + '\n';
    for (const entry of entries) {
        const row = [
            entry.entryId,
            entry.glAccount,
            `"${entry.glDescription}"`,
            entry.debitAmount.toFixed(2),
            entry.creditAmount.toFixed(2),
            entry.department || '',
            entry.costCenter || '',
            entry.reference,
        ];
        csv += row.join(',') + '\n';
    }
    return csv;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique invoice ID.
 */
function generateInvoiceId() {
    return `FINV-${crypto.randomUUID()}`;
}
/**
 * Helper: Calculates due date from invoice date.
 */
function calculateDueDate(invoiceDate, netDays) {
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + netDays);
    return dueDate;
}
/**
 * Helper: Extracts field from EDI segment.
 */
function extractEDIField(lines, segment, position) {
    const line = lines.find(l => l.startsWith(segment));
    if (!line)
        return null;
    const fields = line.split('*');
    return fields[position] || null;
}
/**
 * Helper: Evaluates rate verification rule.
 */
function evaluateRateVerificationRule(rule, invoice, rateAgreement) {
    if (!rateAgreement) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: false,
            message: 'No rate agreement available',
            discrepancyCreated: false,
        };
    }
    const baseCharge = invoice.charges.find(c => c.type === FreightChargeType.BASE_FREIGHT);
    if (!baseCharge) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: true,
            message: 'No base freight charge to validate',
            discrepancyCreated: false,
        };
    }
    const validation = validateRateAgainstAgreement(baseCharge, invoice.shipment, rateAgreement);
    const passed = Math.abs(validation.variancePercent) <= (rule.thresholds.variancePercent || 5);
    return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        passed,
        variance: validation.variance,
        message: validation.message,
        discrepancyCreated: !passed,
    };
}
/**
 * Helper: Evaluates weight verification rule.
 */
function evaluateWeightVerificationRule(rule, invoice) {
    const expectedWeight = invoice.shipment.carrierBookedRate;
    if (!expectedWeight) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: true,
            message: 'No expected weight available',
            discrepancyCreated: false,
        };
    }
    const variance = Math.abs(invoice.shipment.weight - expectedWeight);
    const variancePercent = (variance / expectedWeight) * 100;
    const passed = variancePercent <= (rule.thresholds.variancePercent || 10);
    return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        passed,
        variance,
        message: passed ? 'Weight within tolerance' : `Weight variance of ${variancePercent.toFixed(2)}%`,
        discrepancyCreated: !passed,
    };
}
/**
 * Helper: Evaluates accessorial validation rule.
 */
function evaluateAccessorialValidationRule(rule, invoice, rateAgreement) {
    const accessorialCharges = invoice.charges.filter(c => c.type === FreightChargeType.ACCESSORIAL);
    if (accessorialCharges.length === 0) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: true,
            message: 'No accessorial charges',
            discrepancyCreated: false,
        };
    }
    let totalVariance = 0;
    for (const charge of accessorialCharges) {
        if (rateAgreement) {
            const expectedRate = rateAgreement.accessorialRates.find(r => charge.description.toUpperCase().includes(r.accessorialType.toUpperCase()));
            if (expectedRate) {
                const variance = charge.amount - expectedRate.rate;
                totalVariance += Math.abs(variance);
            }
        }
    }
    const passed = totalVariance <= (rule.thresholds.varianceAmount || 50);
    return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        passed,
        variance: totalVariance,
        message: passed ? 'Accessorial charges valid' : `Accessorial variance: $${totalVariance.toFixed(2)}`,
        discrepancyCreated: !passed,
    };
}
/**
 * Helper: Evaluates duplicate detection rule.
 */
function evaluateDuplicateDetectionRule(rule, invoice) {
    const duplicates = detectDuplicateCharges(invoice);
    const passed = duplicates.length === 0;
    return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        passed,
        message: passed ? 'No duplicate charges' : `Found ${duplicates.length} duplicate charges`,
        discrepancyCreated: !passed,
    };
}
/**
 * Helper: Evaluates fuel surcharge rule.
 */
function evaluateFuelSurchargeRule(rule, invoice, rateAgreement) {
    const fuelCharge = invoice.charges.find(c => c.type === FreightChargeType.FUEL_SURCHARGE);
    const baseCharge = invoice.charges.find(c => c.type === FreightChargeType.BASE_FREIGHT);
    if (!fuelCharge || !baseCharge) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: true,
            message: 'No fuel surcharge to validate',
            discrepancyCreated: false,
        };
    }
    if (!rateAgreement) {
        return {
            ruleId: rule.ruleId,
            ruleName: rule.name,
            passed: false,
            message: 'No rate agreement with FSC table',
            discrepancyCreated: false,
        };
    }
    // Simplified validation - in production, get actual fuel price
    const currentFuelPrice = 3.50;
    const validation = validateFuelSurcharge(fuelCharge, baseCharge, rateAgreement, currentFuelPrice);
    return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        passed: validation.valid,
        variance: validation.variance,
        message: validation.message,
        discrepancyCreated: !validation.valid,
    };
}
/**
 * Helper: Generates audit recommendations.
 */
function generateAuditRecommendations(results) {
    const recommendations = [];
    const failed = results.filter(r => !r.passed);
    if (failed.length === 0) {
        recommendations.push('Invoice passed all audit checks');
        return recommendations;
    }
    for (const result of failed) {
        if (result.variance && result.variance > 0) {
            recommendations.push(`Challenge ${result.ruleName}: potential savings of $${result.variance.toFixed(2)}`);
        }
        else {
            recommendations.push(`Review ${result.ruleName}: ${result.message}`);
        }
    }
    return recommendations;
}
/**
 * Helper: Finds applicable rate in agreement.
 */
function findApplicableRate(agreement, shipment) {
    for (const rate of agreement.rates) {
        if (shipment.weight >= rate.weightMin && shipment.weight <= rate.weightMax) {
            if (rate.rateUnit === 'PER_CWT') {
                return (shipment.weight / 100) * rate.rate;
            }
            else if (rate.rateUnit === 'FLAT') {
                return rate.rate;
            }
        }
    }
    return null;
}
/**
 * Helper: Calculates fuel surcharge percentage.
 */
function calculateFuelSurchargePercent(table, fuelPrice) {
    for (const entry of table) {
        if (fuelPrice >= entry.fuelPriceMin && fuelPrice <= entry.fuelPriceMax) {
            return entry.surchargePercent;
        }
    }
    return 0;
}
/**
 * Helper: Finds applicable allocation rule.
 */
function findApplicableAllocationRule(invoice, rules) {
    const enabledRules = rules.filter(r => r.enabled).sort((a, b) => a.priority - b.priority);
    for (const rule of enabledRules) {
        if (rule.conditions.length === 0) {
            return rule; // Default rule with no conditions
        }
        const matches = rule.conditions.every(condition => {
            // Simplified condition matching
            return true;
        });
        if (matches) {
            return rule;
        }
    }
    return null;
}
/**
 * Helper: Calculates charge breakdown by percentage.
 */
function calculateChargeBreakdown(invoice, percentage) {
    const breakdown = {};
    for (const charge of invoice.charges) {
        const amount = charge.amount * (percentage / 100);
        breakdown[charge.type] = (breakdown[charge.type] || 0) + amount;
    }
    return breakdown;
}
/**
 * Helper: Generates payment reference number.
 */
function generatePaymentReference(batch) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const method = batch.paymentMethod.substring(0, 3);
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${method}-${date}-${random}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Invoice Processing
    createFreightInvoice,
    addFreightCharge,
    removeFreightCharge,
    updateChargeAmount,
    recalculateInvoiceTotals,
    parseEDI210Invoice,
    validateInvoiceData,
    matchInvoiceToShipment,
    // Audit Rules
    createAuditRule,
    evaluateAuditRule,
    applyAuditRules,
    validateRateAgainstAgreement,
    validateFuelSurcharge,
    checkDuplicateInvoice,
    generateAuditSummary,
    // Discrepancy Detection
    createDiscrepancy,
    detectWeightDiscrepancy,
    detectUnauthorizedAccessorials,
    detectDuplicateCharges,
    detectDeliveryPerformanceIssue,
    validateDiscountApplication,
    resolveDiscrepancy,
    generateDiscrepancyReport,
    // Payment Processing
    approveInvoiceForPayment,
    rejectInvoice,
    createPaymentBatch,
    processPaymentBatch,
    markInvoiceAsPaid,
    calculatePaymentTermsDiscount,
    generatePaymentRemittance,
    validatePaymentBatch,
    // Cost Allocation
    createCostAllocationRule,
    allocateInvoiceCosts,
    distributeCostsByWeight,
    generateGLEntries,
    allocateToCustomerOrders,
    generateAllocationSummary,
    exportGLEntriesToCSV,
};
//# sourceMappingURL=transportation-freight-audit-kit.js.map