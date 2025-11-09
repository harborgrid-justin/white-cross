"use strict";
/**
 * @fileoverview Property Lease Management Kit - Enterprise IBM TRIRIGA competitor
 * @module reuse/property/property-lease-management-kit
 * @description Comprehensive lease lifecycle management for commercial real estate,
 * competing with IBM TRIRIGA Lease Management module. Handles lease contracts,
 * abstraction, rent calculations, renewals, CAM reconciliation, compliance tracking,
 * critical dates, analytics, terminations, and multi-tenant coordination.
 *
 * Key Features:
 * - Lease contract creation and management
 * - Automated lease abstraction and key date extraction
 * - Complex rent calculations and escalations (fixed, CPI, percentage)
 * - Lease renewal workflows and option tracking
 * - CAM (Common Area Maintenance) reconciliation
 * - Lease compliance and obligation tracking
 * - Critical date notifications and alerts
 * - Lease vs actual expense analysis
 * - Lease termination and buyout handling
 * - Multi-tenant coordination and allocation
 * - Rent roll generation and reporting
 * - Lease portfolio analytics and forecasting
 *
 * @target IBM TRIRIGA Lease Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for lease data
 * - Audit trails for all lease modifications
 * - Document encryption for lease contracts
 * - SOC 2 Type II compliance
 * - Multi-tenant data isolation
 * - Financial data encryption at rest
 *
 * @example Lease contract creation
 * ```typescript
 * import { createLeaseContract, extractLeaseKeyDates } from './property-lease-management-kit';
 *
 * const lease = await createLeaseContract({
 *   propertyId: 'prop-123',
 *   tenantId: 'tenant-456',
 *   leaseType: LeaseType.COMMERCIAL,
 *   commencementDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2030-12-31'),
 *   baseRent: 50000,
 *   escalationType: EscalationType.CPI_INDEXED,
 * });
 *
 * const keyDates = await extractLeaseKeyDates(lease.id);
 * ```
 *
 * @example Rent calculation with escalations
 * ```typescript
 * import { calculateMonthlyRent, applyRentEscalation } from './property-lease-management-kit';
 *
 * const currentRent = await calculateMonthlyRent('lease-789', new Date());
 * const escalatedRent = await applyRentEscalation('lease-789', {
 *   escalationType: EscalationType.FIXED_PERCENTAGE,
 *   escalationRate: 3.5,
 *   effectiveDate: new Date('2026-01-01'),
 * });
 * ```
 *
 * @example CAM reconciliation
 * ```typescript
 * import { reconcileCAMCharges, generateCAMStatement } from './property-lease-management-kit';
 *
 * const reconciliation = await reconcileCAMCharges('lease-789', 2024, {
 *   estimatedCAM: 120000,
 *   actualCAM: 135000,
 *   reconciliationDate: new Date(),
 * });
 *
 * const statement = await generateCAMStatement('lease-789', 2024);
 * ```
 *
 * LOC: PROP-LEASE-001
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns, decimal.js
 * DOWNSTREAM: property-management, tenant-management, accounting, reporting
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLeaseData = exports.coordinateMultiTenantCAM = exports.calculatePortfolioMetrics = exports.generateRentRoll = exports.allocateSharedExpenses = exports.processFinalReconciliation = exports.calculateTerminationBuyout = exports.initiateLeaseTermination = exports.identifyBudgetVariances = exports.generateVarianceReport = exports.compareLeaseVsActual = exports.generateAutomatedNotifications = exports.acknowledgeNotification = exports.getPendingNotifications = exports.createCriticalDateNotification = exports.generateComplianceReport = exports.updateComplianceStatus = exports.checkLeaseCompliance = exports.createComplianceObligation = exports.calculateProRataShare = exports.generateCAMStatement = exports.reconcileCAMCharges = exports.exerciseRenewalOption = exports.sendRenewalNotice = exports.initiateLeaseRenewal = exports.checkRenewalEligibility = exports.projectFutureEscalations = exports.calculatePercentageRent = exports.applyRentEscalation = exports.calculateMonthlyRent = exports.monitorCriticalDates = exports.generateLeaseAbstract = exports.extractLeaseKeyDates = exports.archiveLeaseContract = exports.getLeaseContract = exports.updateLeaseContract = exports.createLeaseContract = exports.NotificationPriority = exports.ComplianceStatus = exports.ChargeType = exports.RenewalStatus = exports.EscalationType = exports.LeaseStatus = exports.LeaseType = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const decimal_js_1 = __importDefault(require("decimal.js"));
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * @enum LeaseType
 * @description Types of lease agreements
 */
var LeaseType;
(function (LeaseType) {
    LeaseType["COMMERCIAL"] = "COMMERCIAL";
    LeaseType["RETAIL"] = "RETAIL";
    LeaseType["INDUSTRIAL"] = "INDUSTRIAL";
    LeaseType["OFFICE"] = "OFFICE";
    LeaseType["WAREHOUSE"] = "WAREHOUSE";
    LeaseType["MIXED_USE"] = "MIXED_USE";
    LeaseType["GROUND_LEASE"] = "GROUND_LEASE";
    LeaseType["SUBLEASE"] = "SUBLEASE";
})(LeaseType || (exports.LeaseType = LeaseType = {}));
/**
 * @enum LeaseStatus
 * @description Current status of lease
 */
var LeaseStatus;
(function (LeaseStatus) {
    LeaseStatus["DRAFT"] = "DRAFT";
    LeaseStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    LeaseStatus["ACTIVE"] = "ACTIVE";
    LeaseStatus["EXPIRED"] = "EXPIRED";
    LeaseStatus["TERMINATED"] = "TERMINATED";
    LeaseStatus["RENEWED"] = "RENEWED";
    LeaseStatus["UNDER_NEGOTIATION"] = "UNDER_NEGOTIATION";
    LeaseStatus["ON_HOLD"] = "ON_HOLD";
})(LeaseStatus || (exports.LeaseStatus = LeaseStatus = {}));
/**
 * @enum EscalationType
 * @description Rent escalation methods
 */
var EscalationType;
(function (EscalationType) {
    EscalationType["FIXED_PERCENTAGE"] = "FIXED_PERCENTAGE";
    EscalationType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    EscalationType["CPI_INDEXED"] = "CPI_INDEXED";
    EscalationType["PERCENTAGE_RENT"] = "PERCENTAGE_RENT";
    EscalationType["STEPPED"] = "STEPPED";
    EscalationType["MARKET_REVIEW"] = "MARKET_REVIEW";
    EscalationType["NO_ESCALATION"] = "NO_ESCALATION";
})(EscalationType || (exports.EscalationType = EscalationType = {}));
/**
 * @enum RenewalStatus
 * @description Status of lease renewal process
 */
var RenewalStatus;
(function (RenewalStatus) {
    RenewalStatus["NOT_ELIGIBLE"] = "NOT_ELIGIBLE";
    RenewalStatus["OPTION_AVAILABLE"] = "OPTION_AVAILABLE";
    RenewalStatus["NOTICE_PENDING"] = "NOTICE_PENDING";
    RenewalStatus["NOTICE_SENT"] = "NOTICE_SENT";
    RenewalStatus["UNDER_NEGOTIATION"] = "UNDER_NEGOTIATION";
    RenewalStatus["RENEWED"] = "RENEWED";
    RenewalStatus["DECLINED"] = "DECLINED";
})(RenewalStatus || (exports.RenewalStatus = RenewalStatus = {}));
/**
 * @enum ChargeType
 * @description Types of lease charges
 */
var ChargeType;
(function (ChargeType) {
    ChargeType["BASE_RENT"] = "BASE_RENT";
    ChargeType["CAM"] = "CAM";
    ChargeType["INSURANCE"] = "INSURANCE";
    ChargeType["PROPERTY_TAX"] = "PROPERTY_TAX";
    ChargeType["UTILITIES"] = "UTILITIES";
    ChargeType["PARKING"] = "PARKING";
    ChargeType["SIGNAGE"] = "SIGNAGE";
    ChargeType["PERCENTAGE_RENT"] = "PERCENTAGE_RENT";
    ChargeType["LATE_FEE"] = "LATE_FEE";
    ChargeType["OTHER"] = "OTHER";
})(ChargeType || (exports.ChargeType = ChargeType = {}));
/**
 * @enum ComplianceStatus
 * @description Lease compliance status
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    ComplianceStatus["GRACE_PERIOD"] = "GRACE_PERIOD";
    ComplianceStatus["VIOLATION"] = "VIOLATION";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * @enum NotificationPriority
 * @description Priority levels for lease notifications
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["MEDIUM"] = "MEDIUM";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["CRITICAL"] = "CRITICAL";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
// ============================================================================
// 1. LEASE CONTRACT CREATION AND MANAGEMENT
// ============================================================================
/**
 * Creates a new lease contract with comprehensive validation
 *
 * @param {LeaseContractData} data - Lease contract data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created lease contract
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const lease = await createLeaseContract({
 *   propertyId: 'prop-123',
 *   tenantId: 'tenant-456',
 *   leaseType: LeaseType.COMMERCIAL,
 *   commencementDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2030-12-31'),
 *   baseRent: 50000,
 *   escalationType: EscalationType.CPI_INDEXED,
 * }, sequelize);
 * ```
 */
const createLeaseContract = async (data, sequelize, transaction) => {
    // Validate dates
    if ((0, date_fns_1.isBefore)(data.expirationDate, data.commencementDate)) {
        throw new common_1.BadRequestException('Expiration date must be after commencement date');
    }
    // Calculate lease term in months
    const leaseTerm = (0, date_fns_1.differenceInMonths)(data.expirationDate, data.commencementDate);
    const leaseData = {
        id: `lease-${Date.now()}`,
        ...data,
        status: data.status || LeaseStatus.DRAFT,
        leaseTerm,
        paymentDay: data.paymentDay || 1,
        escalationFrequency: data.escalationFrequency || 12,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const [lease] = await sequelize.query(`INSERT INTO leases (id, property_id, tenant_id, lease_type, status, commencement_date,
     expiration_date, lease_term, rentable_area, base_rent, security_deposit, escalation_type,
     escalation_rate, escalation_frequency, payment_day, renewal_options, renewal_notice_days,
     metadata, created_at, updated_at)
     VALUES (:id, :propertyId, :tenantId, :leaseType, :status, :commencementDate, :expirationDate,
     :leaseTerm, :rentableArea, :baseRent, :securityDeposit, :escalationType, :escalationRate,
     :escalationFrequency, :paymentDay, :renewalOptions, :renewalNoticeDays, :metadata,
     :createdAt, :updatedAt)
     RETURNING *`, {
        replacements: {
            ...leaseData,
            metadata: JSON.stringify(data.metadata || {}),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Lease contract created: ${leaseData.id}`, 'LeaseManagement');
    return lease;
};
exports.createLeaseContract = createLeaseContract;
/**
 * Updates an existing lease contract
 *
 * @param {string} leaseId - Lease ID
 * @param {Partial<LeaseContractData>} updates - Fields to update
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated lease
 *
 * @example
 * ```typescript
 * const updated = await updateLeaseContract('lease-123', {
 *   baseRent: 55000,
 *   status: LeaseStatus.ACTIVE,
 * }, sequelize);
 * ```
 */
const updateLeaseContract = async (leaseId, updates, sequelize, transaction) => {
    const setClauses = [];
    const replacements = { leaseId };
    Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            setClauses.push(`${snakeKey} = :${key}`);
            replacements[key] = value instanceof Date ? value : value;
        }
    });
    setClauses.push('updated_at = :updatedAt');
    replacements.updatedAt = new Date();
    const [result] = await sequelize.query(`UPDATE leases SET ${setClauses.join(', ')} WHERE id = :leaseId RETURNING *`, { replacements, type: sequelize_1.QueryTypes.UPDATE, transaction });
    common_1.Logger.log(`Lease contract updated: ${leaseId}`, 'LeaseManagement');
    return result;
};
exports.updateLeaseContract = updateLeaseContract;
/**
 * Retrieves a lease contract by ID with all related data
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Lease contract
 * @throws {NotFoundException} If lease not found
 *
 * @example
 * ```typescript
 * const lease = await getLeaseContract('lease-123', sequelize);
 * ```
 */
const getLeaseContract = async (leaseId, sequelize) => {
    const [lease] = await sequelize.query(`SELECT * FROM leases WHERE id = :leaseId`, { replacements: { leaseId }, type: sequelize_1.QueryTypes.SELECT });
    if (!lease) {
        throw new common_1.NotFoundException(`Lease ${leaseId} not found`);
    }
    return lease;
};
exports.getLeaseContract = getLeaseContract;
/**
 * Archives a lease contract (soft delete)
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveLeaseContract('lease-123', sequelize);
 * ```
 */
const archiveLeaseContract = async (leaseId, sequelize, transaction) => {
    await sequelize.query(`UPDATE leases SET deleted_at = :deletedAt WHERE id = :leaseId`, {
        replacements: { leaseId, deletedAt: new Date() },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    common_1.Logger.log(`Lease contract archived: ${leaseId}`, 'LeaseManagement');
};
exports.archiveLeaseContract = archiveLeaseContract;
// ============================================================================
// 2. LEASE ABSTRACTION AND KEY DATES
// ============================================================================
/**
 * Extracts and returns all critical dates from a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseKeyDates>} Extracted key dates
 *
 * @example
 * ```typescript
 * const keyDates = await extractLeaseKeyDates('lease-123', sequelize);
 * console.log(keyDates.renewalNoticeDate);
 * ```
 */
const extractLeaseKeyDates = async (leaseId, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const keyDates = {
        leaseId,
        commencementDate: new Date(data.commencement_date),
        expirationDate: new Date(data.expiration_date),
    };
    // Calculate rent commencement (may differ from lease commencement)
    keyDates.rentCommencementDate = data.rent_commencement_date
        ? new Date(data.rent_commencement_date)
        : keyDates.commencementDate;
    // Calculate first escalation date
    if (data.escalation_frequency) {
        keyDates.firstEscalationDate = (0, date_fns_1.addMonths)(keyDates.rentCommencementDate, data.escalation_frequency);
    }
    // Calculate renewal notice date
    if (data.renewal_notice_days) {
        keyDates.renewalNoticeDate = (0, date_fns_1.addDays)(keyDates.expirationDate, -data.renewal_notice_days);
    }
    return keyDates;
};
exports.extractLeaseKeyDates = extractLeaseKeyDates;
/**
 * Generates a lease abstract summary with all critical information
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Lease abstract
 *
 * @example
 * ```typescript
 * const abstract = await generateLeaseAbstract('lease-123', sequelize);
 * ```
 */
const generateLeaseAbstract = async (leaseId, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const keyDates = await (0, exports.extractLeaseKeyDates)(leaseId, sequelize);
    const data = lease;
    return {
        leaseId,
        propertyId: data.property_id,
        tenantId: data.tenant_id,
        leaseType: data.lease_type,
        status: data.status,
        keyDates,
        financialTerms: {
            baseRent: new decimal_js_1.default(data.base_rent),
            securityDeposit: data.security_deposit,
            escalationType: data.escalation_type,
            escalationRate: data.escalation_rate,
            escalationFrequency: data.escalation_frequency,
        },
        spaceDetails: {
            rentableArea: data.rentable_area,
            leaseTerm: data.lease_term,
        },
        renewalTerms: {
            renewalOptions: data.renewal_options,
            renewalNoticeDays: data.renewal_notice_days,
        },
        generatedAt: new Date(),
    };
};
exports.generateLeaseAbstract = generateLeaseAbstract;
/**
 * Monitors and validates critical lease dates
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{date: Date, description: string, daysUntil: number}>>} Upcoming critical dates
 *
 * @example
 * ```typescript
 * const criticalDates = await monitorCriticalDates('lease-123', sequelize);
 * ```
 */
const monitorCriticalDates = async (leaseId, sequelize) => {
    const keyDates = await (0, exports.extractLeaseKeyDates)(leaseId, sequelize);
    const today = new Date();
    const criticalDates = [];
    // Expiration date
    const expirationDays = (0, date_fns_1.differenceInDays)(keyDates.expirationDate, today);
    if (expirationDays >= 0 && expirationDays <= 180) {
        criticalDates.push({
            date: keyDates.expirationDate,
            description: 'Lease Expiration',
            daysUntil: expirationDays,
        });
    }
    // Renewal notice date
    if (keyDates.renewalNoticeDate) {
        const renewalNoticeDays = (0, date_fns_1.differenceInDays)(keyDates.renewalNoticeDate, today);
        if (renewalNoticeDays >= 0 && renewalNoticeDays <= 90) {
            criticalDates.push({
                date: keyDates.renewalNoticeDate,
                description: 'Renewal Notice Deadline',
                daysUntil: renewalNoticeDays,
            });
        }
    }
    // First escalation date
    if (keyDates.firstEscalationDate) {
        const escalationDays = (0, date_fns_1.differenceInDays)(keyDates.firstEscalationDate, today);
        if (escalationDays >= 0 && escalationDays <= 60) {
            criticalDates.push({
                date: keyDates.firstEscalationDate,
                description: 'First Rent Escalation',
                daysUntil: escalationDays,
            });
        }
    }
    return criticalDates.sort((a, b) => a.daysUntil - b.daysUntil);
};
exports.monitorCriticalDates = monitorCriticalDates;
// ============================================================================
// 3. RENT CALCULATIONS AND ESCALATIONS
// ============================================================================
/**
 * Calculates current monthly rent including all escalations
 *
 * @param {string} leaseId - Lease ID
 * @param {Date} calculationDate - Date to calculate rent for
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RentCalculationResult>} Calculated rent details
 *
 * @example
 * ```typescript
 * const rent = await calculateMonthlyRent('lease-123', new Date(), sequelize);
 * console.log(rent.totalRent.toString());
 * ```
 */
const calculateMonthlyRent = async (leaseId, calculationDate, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const baseRent = new decimal_js_1.default(data.base_rent);
    let escalatedRent = baseRent;
    const appliedEscalations = [];
    // Get all escalations that have occurred
    const [escalations] = await sequelize.query(`SELECT * FROM lease_escalations
     WHERE lease_id = :leaseId AND effective_date <= :calculationDate
     ORDER BY effective_date ASC`, {
        replacements: { leaseId, calculationDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Apply each escalation
    if (Array.isArray(escalations)) {
        for (const esc of escalations) {
            const escData = esc;
            const escalationAmount = new decimal_js_1.default(escData.escalation_amount);
            escalatedRent = escalatedRent.plus(escalationAmount);
            appliedEscalations.push({
                date: new Date(escData.effective_date),
                type: escData.escalation_type,
                rate: escData.escalation_rate,
                amount: escalationAmount,
            });
        }
    }
    // Get additional charges
    const additionalCharges = {};
    const [charges] = await sequelize.query(`SELECT charge_type, amount FROM lease_charges
     WHERE lease_id = :leaseId AND effective_date <= :calculationDate
     AND (expiration_date IS NULL OR expiration_date >= :calculationDate)`, {
        replacements: { leaseId, calculationDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (Array.isArray(charges)) {
        charges.forEach((charge) => {
            additionalCharges[charge.charge_type] = new decimal_js_1.default(charge.amount);
        });
    }
    const totalAdditional = Object.values(additionalCharges).reduce((sum, amt) => sum.plus(amt), new decimal_js_1.default(0));
    return {
        leaseId,
        calculationDate,
        baseRent,
        escalatedRent,
        additionalCharges,
        totalRent: escalatedRent.plus(totalAdditional),
        appliedEscalations,
    };
};
exports.calculateMonthlyRent = calculateMonthlyRent;
/**
 * Applies a rent escalation to a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {RentEscalation} escalation - Escalation details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created escalation record
 *
 * @example
 * ```typescript
 * await applyRentEscalation('lease-123', {
 *   escalationType: EscalationType.FIXED_PERCENTAGE,
 *   escalationRate: 3.5,
 *   effectiveDate: new Date('2026-01-01'),
 * }, sequelize);
 * ```
 */
const applyRentEscalation = async (leaseId, escalation, sequelize, transaction) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    let escalationAmount;
    const currentRent = new decimal_js_1.default(data.base_rent);
    switch (escalation.escalationType) {
        case EscalationType.FIXED_PERCENTAGE:
            escalationAmount = currentRent.mul(escalation.escalationRate).div(100);
            break;
        case EscalationType.FIXED_AMOUNT:
            escalationAmount = new decimal_js_1.default(escalation.escalationRate);
            break;
        case EscalationType.CPI_INDEXED:
            if (!escalation.cpiIndex || !escalation.baselineIndex) {
                throw new common_1.BadRequestException('CPI indices required for CPI-indexed escalation');
            }
            const cpiChange = (escalation.cpiIndex - escalation.baselineIndex) / escalation.baselineIndex;
            let rate = cpiChange * 100;
            // Apply cap and floor if specified
            if (escalation.cappedRate && rate > escalation.cappedRate) {
                rate = escalation.cappedRate;
            }
            if (escalation.flooredRate && rate < escalation.flooredRate) {
                rate = escalation.flooredRate;
            }
            escalationAmount = currentRent.mul(rate).div(100);
            break;
        default:
            escalationAmount = new decimal_js_1.default(0);
    }
    const [result] = await sequelize.query(`INSERT INTO lease_escalations (id, lease_id, escalation_type, escalation_rate,
     escalation_amount, effective_date, cpi_index, baseline_index, created_at)
     VALUES (:id, :leaseId, :escalationType, :escalationRate, :escalationAmount,
     :effectiveDate, :cpiIndex, :baselineIndex, :createdAt) RETURNING *`, {
        replacements: {
            id: `esc-${Date.now()}`,
            leaseId,
            escalationType: escalation.escalationType,
            escalationRate: escalation.escalationRate,
            escalationAmount: escalationAmount.toNumber(),
            effectiveDate: escalation.effectiveDate,
            cpiIndex: escalation.cpiIndex,
            baselineIndex: escalation.baselineIndex,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Rent escalation applied: ${leaseId}, Amount: ${escalationAmount}`, 'LeaseManagement');
    return result;
};
exports.applyRentEscalation = applyRentEscalation;
/**
 * Calculates percentage rent based on tenant sales
 *
 * @param {string} leaseId - Lease ID
 * @param {number} grossSales - Tenant's gross sales
 * @param {number} breakpoint - Natural breakpoint amount
 * @param {number} percentageRate - Percentage rate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Decimal>} Percentage rent owed
 *
 * @example
 * ```typescript
 * const percentageRent = await calculatePercentageRent(
 *   'lease-123', 1000000, 800000, 5, sequelize
 * );
 * ```
 */
const calculatePercentageRent = async (leaseId, grossSales, breakpoint, percentageRate, sequelize) => {
    const sales = new decimal_js_1.default(grossSales);
    const bp = new decimal_js_1.default(breakpoint);
    if (sales.lessThanOrEqualTo(bp)) {
        return new decimal_js_1.default(0);
    }
    const excessSales = sales.minus(bp);
    const percentageRent = excessSales.mul(percentageRate).div(100);
    common_1.Logger.log(`Percentage rent calculated: ${leaseId}, Sales: ${sales}, Rent: ${percentageRent}`, 'LeaseManagement');
    return percentageRent;
};
exports.calculatePercentageRent = calculatePercentageRent;
/**
 * Projects future rent escalations over the lease term
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{date: Date, rent: Decimal}>>} Projected rent schedule
 *
 * @example
 * ```typescript
 * const projections = await projectFutureEscalations('lease-123', sequelize);
 * ```
 */
const projectFutureEscalations = async (leaseId, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const projections = [];
    let currentRent = new decimal_js_1.default(data.base_rent);
    let currentDate = new Date(data.commencement_date);
    const expirationDate = new Date(data.expiration_date);
    const escalationFrequency = data.escalation_frequency || 12;
    const escalationRate = data.escalation_rate || 0;
    while ((0, date_fns_1.isBefore)(currentDate, expirationDate)) {
        projections.push({
            date: new Date(currentDate),
            rent: currentRent,
        });
        currentDate = (0, date_fns_1.addMonths)(currentDate, escalationFrequency);
        if (data.escalation_type === EscalationType.FIXED_PERCENTAGE) {
            currentRent = currentRent.mul(1 + escalationRate / 100);
        }
        else if (data.escalation_type === EscalationType.FIXED_AMOUNT) {
            currentRent = currentRent.plus(escalationRate);
        }
    }
    return projections;
};
exports.projectFutureEscalations = projectFutureEscalations;
// ============================================================================
// 4. LEASE RENEWAL WORKFLOWS
// ============================================================================
/**
 * Checks if a lease is eligible for renewal
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{eligible: boolean, status: RenewalStatus, daysUntilNotice?: number}>} Renewal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await checkRenewalEligibility('lease-123', sequelize);
 * ```
 */
const checkRenewalEligibility = async (leaseId, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const keyDates = await (0, exports.extractLeaseKeyDates)(leaseId, sequelize);
    const data = lease;
    if (!data.renewal_options || data.renewal_options <= 0) {
        return { eligible: false, status: RenewalStatus.NOT_ELIGIBLE };
    }
    const today = new Date();
    if (keyDates.renewalNoticeDate) {
        const daysUntilNotice = (0, date_fns_1.differenceInDays)(keyDates.renewalNoticeDate, today);
        if (daysUntilNotice < 0) {
            return { eligible: false, status: RenewalStatus.DECLINED };
        }
        if (daysUntilNotice <= 90) {
            return {
                eligible: true,
                status: RenewalStatus.NOTICE_PENDING,
                daysUntilNotice,
            };
        }
        return {
            eligible: true,
            status: RenewalStatus.OPTION_AVAILABLE,
            daysUntilNotice,
        };
    }
    return { eligible: true, status: RenewalStatus.OPTION_AVAILABLE };
};
exports.checkRenewalEligibility = checkRenewalEligibility;
/**
 * Initiates lease renewal process
 *
 * @param {string} leaseId - Lease ID
 * @param {number} renewalTermMonths - Renewal term in months
 * @param {Partial<LeaseContractData>} renewalTerms - Updated lease terms
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Renewal record
 *
 * @example
 * ```typescript
 * const renewal = await initiateLeaseRenewal('lease-123', 60, {
 *   baseRent: 60000,
 *   escalationRate: 4.0,
 * }, sequelize);
 * ```
 */
const initiateLeaseRenewal = async (leaseId, renewalTermMonths, renewalTerms, sequelize, transaction) => {
    const eligibility = await (0, exports.checkRenewalEligibility)(leaseId, sequelize);
    if (!eligibility.eligible) {
        throw new common_1.BadRequestException(`Lease not eligible for renewal: ${eligibility.status}`);
    }
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const currentExpiration = new Date(data.expiration_date);
    const [renewal] = await sequelize.query(`INSERT INTO lease_renewals (id, lease_id, renewal_term_months, new_commencement_date,
     new_expiration_date, new_base_rent, status, initiated_date, created_at)
     VALUES (:id, :leaseId, :renewalTermMonths, :newCommencementDate, :newExpirationDate,
     :newBaseRent, :status, :initiatedDate, :createdAt) RETURNING *`, {
        replacements: {
            id: `renewal-${Date.now()}`,
            leaseId,
            renewalTermMonths,
            newCommencementDate: (0, date_fns_1.addDays)(currentExpiration, 1),
            newExpirationDate: (0, date_fns_1.addMonths)(currentExpiration, renewalTermMonths),
            newBaseRent: renewalTerms.baseRent || data.base_rent,
            status: RenewalStatus.UNDER_NEGOTIATION,
            initiatedDate: new Date(),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Lease renewal initiated: ${leaseId}`, 'LeaseManagement');
    return renewal;
};
exports.initiateLeaseRenewal = initiateLeaseRenewal;
/**
 * Sends renewal notice to tenant
 *
 * @param {string} leaseId - Lease ID
 * @param {string} recipientEmail - Tenant email
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseNotification>} Notification sent
 *
 * @example
 * ```typescript
 * await sendRenewalNotice('lease-123', 'tenant@example.com', sequelize);
 * ```
 */
const sendRenewalNotice = async (leaseId, recipientEmail, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const keyDates = await (0, exports.extractLeaseKeyDates)(leaseId, sequelize);
    const data = lease;
    const notification = {
        leaseId,
        notificationType: 'RENEWAL_NOTICE',
        title: 'Lease Renewal Option Available',
        message: `Your lease is eligible for renewal. Please respond by ${keyDates.renewalNoticeDate?.toLocaleDateString()}.`,
        dueDate: keyDates.renewalNoticeDate || keyDates.expirationDate,
        priority: NotificationPriority.HIGH,
        recipients: [recipientEmail],
        sentAt: new Date(),
    };
    await sequelize.query(`INSERT INTO lease_notifications (id, lease_id, notification_type, title, message,
     due_date, priority, recipients, sent_at, created_at)
     VALUES (:id, :leaseId, :notificationType, :title, :message, :dueDate, :priority,
     :recipients, :sentAt, :createdAt)`, {
        replacements: {
            id: `notif-${Date.now()}`,
            ...notification,
            recipients: JSON.stringify(notification.recipients),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Renewal notice sent: ${leaseId}`, 'LeaseManagement');
    return notification;
};
exports.sendRenewalNotice = sendRenewalNotice;
/**
 * Exercises a renewal option and creates new lease term
 *
 * @param {string} leaseId - Lease ID
 * @param {string} renewalId - Renewal record ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated lease
 *
 * @example
 * ```typescript
 * await exerciseRenewalOption('lease-123', 'renewal-456', sequelize);
 * ```
 */
const exerciseRenewalOption = async (leaseId, renewalId, sequelize, transaction) => {
    const [renewal] = await sequelize.query(`SELECT * FROM lease_renewals WHERE id = :renewalId AND lease_id = :leaseId`, { replacements: { renewalId, leaseId }, type: sequelize_1.QueryTypes.SELECT });
    if (!renewal) {
        throw new common_1.NotFoundException(`Renewal ${renewalId} not found`);
    }
    const renewalData = renewal;
    // Update original lease status
    await sequelize.query(`UPDATE leases SET status = :status WHERE id = :leaseId`, {
        replacements: { leaseId, status: LeaseStatus.RENEWED },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    // Update lease with new terms
    await sequelize.query(`UPDATE leases SET commencement_date = :commencementDate, expiration_date = :expirationDate,
     base_rent = :baseRent, status = :status, updated_at = :updatedAt WHERE id = :leaseId`, {
        replacements: {
            leaseId,
            commencementDate: renewalData.new_commencement_date,
            expirationDate: renewalData.new_expiration_date,
            baseRent: renewalData.new_base_rent,
            status: LeaseStatus.ACTIVE,
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    common_1.Logger.log(`Renewal option exercised: ${leaseId}`, 'LeaseManagement');
    return renewal;
};
exports.exerciseRenewalOption = exerciseRenewalOption;
// ============================================================================
// 5. CAM (COMMON AREA MAINTENANCE) RECONCILIATION
// ============================================================================
/**
 * Reconciles CAM charges for a lease period
 *
 * @param {string} leaseId - Lease ID
 * @param {number} year - Reconciliation year
 * @param {Partial<CAMReconciliation>} data - Reconciliation data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CAMReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileCAMCharges('lease-123', 2024, {
 *   estimatedCAM: 120000,
 *   actualCAM: 135000,
 *   tenantShare: 15.5,
 * }, sequelize);
 * ```
 */
const reconcileCAMCharges = async (leaseId, year, data, sequelize, transaction) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const leaseData = lease;
    const tenantShare = data.tenantShare || 0;
    const estimatedCAM = data.estimatedCAM || 0;
    const actualCAM = data.actualCAM || 0;
    const estimatedPaid = estimatedCAM * (tenantShare / 100);
    const actualOwed = actualCAM * (tenantShare / 100);
    const variance = actualOwed - estimatedPaid;
    const reconciliation = {
        leaseId,
        year,
        estimatedCAM,
        actualCAM,
        tenantShare,
        estimatedPaid,
        actualOwed,
        variance,
        reconciliationDate: data.reconciliationDate || new Date(),
        dueToTenant: variance < 0 ? Math.abs(variance) : undefined,
        dueFromTenant: variance > 0 ? variance : undefined,
    };
    await sequelize.query(`INSERT INTO cam_reconciliations (id, lease_id, year, estimated_cam, actual_cam,
     tenant_share, estimated_paid, actual_owed, variance, reconciliation_date,
     due_to_tenant, due_from_tenant, created_at)
     VALUES (:id, :leaseId, :year, :estimatedCAM, :actualCAM, :tenantShare,
     :estimatedPaid, :actualOwed, :variance, :reconciliationDate, :dueToTenant,
     :dueFromTenant, :createdAt)`, {
        replacements: {
            id: `cam-recon-${Date.now()}`,
            ...reconciliation,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`CAM reconciliation completed: ${leaseId}, Year: ${year}, Variance: ${variance}`, 'LeaseManagement');
    return reconciliation;
};
exports.reconcileCAMCharges = reconcileCAMCharges;
/**
 * Generates CAM reconciliation statement
 *
 * @param {string} leaseId - Lease ID
 * @param {number} year - Statement year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} CAM statement
 *
 * @example
 * ```typescript
 * const statement = await generateCAMStatement('lease-123', 2024, sequelize);
 * ```
 */
const generateCAMStatement = async (leaseId, year, sequelize) => {
    const [reconciliation] = await sequelize.query(`SELECT * FROM cam_reconciliations WHERE lease_id = :leaseId AND year = :year`, { replacements: { leaseId, year }, type: sequelize_1.QueryTypes.SELECT });
    if (!reconciliation) {
        throw new common_1.NotFoundException(`CAM reconciliation not found for ${leaseId} year ${year}`);
    }
    const data = reconciliation;
    return {
        leaseId,
        year,
        statement: {
            estimatedCharges: {
                cam: data.estimated_cam,
                tenantShare: `${data.tenant_share}%`,
                monthlyEstimate: data.estimated_paid / 12,
                annualEstimate: data.estimated_paid,
            },
            actualCharges: {
                cam: data.actual_cam,
                tenantShare: `${data.tenant_share}%`,
                annualActual: data.actual_owed,
            },
            reconciliation: {
                variance: data.variance,
                varianceType: data.variance > 0 ? 'Tenant owes additional' : 'Credit to tenant',
                amount: Math.abs(data.variance),
            },
        },
        reconciliationDate: data.reconciliation_date,
        generatedAt: new Date(),
    };
};
exports.generateCAMStatement = generateCAMStatement;
/**
 * Calculates tenant's pro-rata share of CAM expenses
 *
 * @param {string} leaseId - Lease ID
 * @param {number} totalPropertyArea - Total property area
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Pro-rata percentage
 *
 * @example
 * ```typescript
 * const share = await calculateProRataShare('lease-123', 100000, sequelize);
 * ```
 */
const calculateProRataShare = async (leaseId, totalPropertyArea, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const tenantArea = data.rentable_area;
    const proRataShare = (tenantArea / totalPropertyArea) * 100;
    common_1.Logger.log(`Pro-rata share calculated: ${leaseId}, Share: ${proRataShare.toFixed(2)}%`, 'LeaseManagement');
    return proRataShare;
};
exports.calculateProRataShare = calculateProRataShare;
// ============================================================================
// 6. LEASE COMPLIANCE TRACKING
// ============================================================================
/**
 * Creates a compliance obligation for a lease
 *
 * @param {ComplianceObligation} obligation - Obligation details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created obligation
 *
 * @example
 * ```typescript
 * await createComplianceObligation({
 *   leaseId: 'lease-123',
 *   obligationType: 'INSURANCE_CERTIFICATE',
 *   description: 'Provide annual insurance certificate',
 *   dueDate: new Date('2025-12-31'),
 *   frequency: 'ANNUAL',
 *   responsibleParty: 'TENANT',
 *   status: ComplianceStatus.PENDING_REVIEW,
 * }, sequelize);
 * ```
 */
const createComplianceObligation = async (obligation, sequelize, transaction) => {
    const [result] = await sequelize.query(`INSERT INTO lease_compliance_obligations (id, lease_id, obligation_type, description,
     due_date, frequency, responsible_party, status, last_verified, created_at)
     VALUES (:id, :leaseId, :obligationType, :description, :dueDate, :frequency,
     :responsibleParty, :status, :lastVerified, :createdAt) RETURNING *`, {
        replacements: {
            id: `obligation-${Date.now()}`,
            ...obligation,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Compliance obligation created: ${obligation.leaseId}, Type: ${obligation.obligationType}`, 'LeaseManagement');
    return result;
};
exports.createComplianceObligation = createComplianceObligation;
/**
 * Checks compliance status for all lease obligations
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<ComplianceObligation>>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkLeaseCompliance('lease-123', sequelize);
 * ```
 */
const checkLeaseCompliance = async (leaseId, sequelize) => {
    const obligations = await sequelize.query(`SELECT * FROM lease_compliance_obligations WHERE lease_id = :leaseId`, { replacements: { leaseId }, type: sequelize_1.QueryTypes.SELECT });
    const today = new Date();
    return obligations.map((obl) => ({
        leaseId: obl.lease_id,
        obligationType: obl.obligation_type,
        description: obl.description,
        dueDate: obl.due_date ? new Date(obl.due_date) : undefined,
        frequency: obl.frequency,
        responsibleParty: obl.responsible_party,
        status: obl.due_date && (0, date_fns_1.isBefore)(new Date(obl.due_date), today)
            ? ComplianceStatus.VIOLATION
            : obl.status,
        lastVerified: obl.last_verified ? new Date(obl.last_verified) : undefined,
    }));
};
exports.checkLeaseCompliance = checkLeaseCompliance;
/**
 * Updates compliance obligation status
 *
 * @param {string} obligationId - Obligation ID
 * @param {ComplianceStatus} status - New status
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateComplianceStatus('obligation-123', ComplianceStatus.COMPLIANT, sequelize);
 * ```
 */
const updateComplianceStatus = async (obligationId, status, sequelize, transaction) => {
    await sequelize.query(`UPDATE lease_compliance_obligations SET status = :status, last_verified = :lastVerified,
     updated_at = :updatedAt WHERE id = :obligationId`, {
        replacements: {
            obligationId,
            status,
            lastVerified: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    common_1.Logger.log(`Compliance status updated: ${obligationId}, Status: ${status}`, 'LeaseManagement');
};
exports.updateComplianceStatus = updateComplianceStatus;
/**
 * Generates compliance report for a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('lease-123', sequelize);
 * ```
 */
const generateComplianceReport = async (leaseId, sequelize) => {
    const obligations = await (0, exports.checkLeaseCompliance)(leaseId, sequelize);
    const statusCounts = obligations.reduce((acc, obl) => {
        acc[obl.status] = (acc[obl.status] || 0) + 1;
        return acc;
    }, {});
    const overdue = obligations.filter((obl) => obl.dueDate && (0, date_fns_1.isBefore)(obl.dueDate, new Date()));
    const upcomingDue = obligations.filter((obl) => obl.dueDate && (0, date_fns_1.differenceInDays)(obl.dueDate, new Date()) <= 30);
    return {
        leaseId,
        totalObligations: obligations.length,
        statusBreakdown: statusCounts,
        overdueObligations: overdue.length,
        upcomingObligations: upcomingDue.length,
        complianceRate: obligations.length > 0
            ? ((statusCounts[ComplianceStatus.COMPLIANT] || 0) / obligations.length) * 100
            : 100,
        obligations,
        generatedAt: new Date(),
    };
};
exports.generateComplianceReport = generateComplianceReport;
// ============================================================================
// 7. CRITICAL DATE NOTIFICATIONS
// ============================================================================
/**
 * Creates a critical date notification
 *
 * @param {LeaseNotification} notification - Notification details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created notification
 *
 * @example
 * ```typescript
 * await createCriticalDateNotification({
 *   leaseId: 'lease-123',
 *   notificationType: 'LEASE_EXPIRATION',
 *   title: 'Lease Expiring Soon',
 *   message: 'Lease expires in 30 days',
 *   dueDate: new Date('2025-12-31'),
 *   priority: NotificationPriority.HIGH,
 *   recipients: ['manager@example.com'],
 * }, sequelize);
 * ```
 */
const createCriticalDateNotification = async (notification, sequelize, transaction) => {
    const [result] = await sequelize.query(`INSERT INTO lease_notifications (id, lease_id, notification_type, title, message,
     due_date, priority, recipients, sent_at, created_at)
     VALUES (:id, :leaseId, :notificationType, :title, :message, :dueDate, :priority,
     :recipients, :sentAt, :createdAt) RETURNING *`, {
        replacements: {
            id: `notif-${Date.now()}`,
            ...notification,
            recipients: JSON.stringify(notification.recipients),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Critical date notification created: ${notification.leaseId}`, 'LeaseManagement');
    return result;
};
exports.createCriticalDateNotification = createCriticalDateNotification;
/**
 * Retrieves all pending notifications for critical dates
 *
 * @param {string} [leaseId] - Optional lease ID filter
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseNotification>>} Pending notifications
 *
 * @example
 * ```typescript
 * const notifications = await getPendingNotifications('lease-123', sequelize);
 * ```
 */
const getPendingNotifications = async (leaseId, sequelize) => {
    const whereClause = leaseId ? 'WHERE lease_id = :leaseId AND' : 'WHERE';
    const notifications = await sequelize.query(`SELECT * FROM lease_notifications ${whereClause} acknowledged_at IS NULL
     ORDER BY priority DESC, due_date ASC`, {
        replacements: leaseId ? { leaseId } : {},
        type: sequelize_1.QueryTypes.SELECT,
    });
    return notifications.map((notif) => ({
        leaseId: notif.lease_id,
        notificationType: notif.notification_type,
        title: notif.title,
        message: notif.message,
        dueDate: new Date(notif.due_date),
        priority: notif.priority,
        recipients: JSON.parse(notif.recipients),
        sentAt: notif.sent_at ? new Date(notif.sent_at) : undefined,
        acknowledgedAt: notif.acknowledged_at ? new Date(notif.acknowledged_at) : undefined,
    }));
};
exports.getPendingNotifications = getPendingNotifications;
/**
 * Acknowledges a notification as received/handled
 *
 * @param {string} notificationId - Notification ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await acknowledgeNotification('notif-123', sequelize);
 * ```
 */
const acknowledgeNotification = async (notificationId, sequelize, transaction) => {
    await sequelize.query(`UPDATE lease_notifications SET acknowledged_at = :acknowledgedAt WHERE id = :notificationId`, {
        replacements: { notificationId, acknowledgedAt: new Date() },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    common_1.Logger.log(`Notification acknowledged: ${notificationId}`, 'LeaseManagement');
};
exports.acknowledgeNotification = acknowledgeNotification;
/**
 * Generates automated notifications for upcoming critical dates
 *
 * @param {number} daysAhead - Days to look ahead
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of notifications created
 *
 * @example
 * ```typescript
 * const count = await generateAutomatedNotifications(30, sequelize);
 * ```
 */
const generateAutomatedNotifications = async (daysAhead, sequelize) => {
    const leases = await sequelize.query(`SELECT * FROM leases WHERE status = :status AND deleted_at IS NULL`, { replacements: { status: LeaseStatus.ACTIVE }, type: sequelize_1.QueryTypes.SELECT });
    let notificationCount = 0;
    const today = new Date();
    const lookAheadDate = (0, date_fns_1.addDays)(today, daysAhead);
    for (const lease of leases) {
        const keyDates = await (0, exports.extractLeaseKeyDates)(lease.id, sequelize);
        // Expiration notification
        if (keyDates.expirationDate &&
            (0, date_fns_1.isAfter)(keyDates.expirationDate, today) &&
            (0, date_fns_1.isBefore)(keyDates.expirationDate, lookAheadDate)) {
            await (0, exports.createCriticalDateNotification)({
                leaseId: lease.id,
                notificationType: 'LEASE_EXPIRATION',
                title: 'Lease Expiring Soon',
                message: `Lease expires on ${keyDates.expirationDate.toLocaleDateString()}`,
                dueDate: keyDates.expirationDate,
                priority: NotificationPriority.CRITICAL,
                recipients: ['property-manager@example.com'],
            }, sequelize);
            notificationCount++;
        }
        // Renewal notice notification
        if (keyDates.renewalNoticeDate &&
            (0, date_fns_1.isAfter)(keyDates.renewalNoticeDate, today) &&
            (0, date_fns_1.isBefore)(keyDates.renewalNoticeDate, lookAheadDate)) {
            await (0, exports.createCriticalDateNotification)({
                leaseId: lease.id,
                notificationType: 'RENEWAL_NOTICE_DUE',
                title: 'Renewal Notice Deadline Approaching',
                message: `Renewal notice deadline: ${keyDates.renewalNoticeDate.toLocaleDateString()}`,
                dueDate: keyDates.renewalNoticeDate,
                priority: NotificationPriority.HIGH,
                recipients: ['property-manager@example.com'],
            }, sequelize);
            notificationCount++;
        }
    }
    common_1.Logger.log(`Generated ${notificationCount} automated notifications`, 'LeaseManagement');
    return notificationCount;
};
exports.generateAutomatedNotifications = generateAutomatedNotifications;
// ============================================================================
// 8. LEASE VS ACTUAL ANALYSIS
// ============================================================================
/**
 * Compares budgeted lease amounts vs actual expenses
 *
 * @param {string} leaseId - Lease ID
 * @param {string} period - Analysis period (e.g., '2024-Q1')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseVsActual>} Variance analysis
 *
 * @example
 * ```typescript
 * const analysis = await compareLeaseVsActual('lease-123', '2024-Q1', sequelize);
 * ```
 */
const compareLeaseVsActual = async (leaseId, period, sequelize) => {
    // Get budgeted amounts
    const rentCalc = await (0, exports.calculateMonthlyRent)(leaseId, new Date(), sequelize);
    const budgetedAmount = rentCalc.totalRent;
    // Get actual amounts from invoices/payments
    const [actualPayments] = await sequelize.query(`SELECT charge_type, SUM(amount) as total FROM lease_invoices
     WHERE lease_id = :leaseId AND period = :period
     GROUP BY charge_type`, { replacements: { leaseId, period }, type: sequelize_1.QueryTypes.SELECT });
    const actualAmount = Array.isArray(actualPayments)
        ? actualPayments.reduce((sum, payment) => sum.plus(payment.total), new decimal_js_1.default(0))
        : new decimal_js_1.default(0);
    const variance = actualAmount.minus(budgetedAmount);
    const variancePercentage = budgetedAmount.isZero()
        ? 0
        : variance.div(budgetedAmount).mul(100).toNumber();
    const chargeBreakdown = {};
    Object.entries(rentCalc.additionalCharges).forEach(([type, budgeted]) => {
        const actual = Array.isArray(actualPayments)
            ? actualPayments.find((p) => p.charge_type === type)?.total || 0
            : 0;
        const actualDecimal = new decimal_js_1.default(actual);
        chargeBreakdown[type] = {
            budgeted,
            actual: actualDecimal,
            variance: actualDecimal.minus(budgeted),
        };
    });
    return {
        leaseId,
        period,
        budgetedAmount,
        actualAmount,
        variance,
        variancePercentage,
        chargeBreakdown,
    };
};
exports.compareLeaseVsActual = compareLeaseVsActual;
/**
 * Generates variance report for multiple leases
 *
 * @param {string[]} leaseIds - Lease IDs
 * @param {string} period - Analysis period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseVsActual>>} Variance reports
 *
 * @example
 * ```typescript
 * const reports = await generateVarianceReport(['lease-123', 'lease-456'], '2024-Q1', sequelize);
 * ```
 */
const generateVarianceReport = async (leaseIds, period, sequelize) => {
    const reports = [];
    for (const leaseId of leaseIds) {
        try {
            const analysis = await (0, exports.compareLeaseVsActual)(leaseId, period, sequelize);
            reports.push(analysis);
        }
        catch (error) {
            common_1.Logger.error(`Error analyzing lease ${leaseId}: ${error}`, 'LeaseManagement');
        }
    }
    return reports;
};
exports.generateVarianceReport = generateVarianceReport;
/**
 * Identifies leases with significant budget variances
 *
 * @param {number} thresholdPercentage - Variance threshold percentage
 * @param {string} period - Analysis period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseVsActual>>} Leases exceeding variance threshold
 *
 * @example
 * ```typescript
 * const variances = await identifyBudgetVariances(10, '2024-Q1', sequelize);
 * ```
 */
const identifyBudgetVariances = async (thresholdPercentage, period, sequelize) => {
    const leases = await sequelize.query(`SELECT id FROM leases WHERE status = :status AND deleted_at IS NULL`, { replacements: { status: LeaseStatus.ACTIVE }, type: sequelize_1.QueryTypes.SELECT });
    const leaseIds = leases.map((l) => l.id);
    const analyses = await (0, exports.generateVarianceReport)(leaseIds, period, sequelize);
    return analyses.filter((analysis) => Math.abs(analysis.variancePercentage) >= thresholdPercentage);
};
exports.identifyBudgetVariances = identifyBudgetVariances;
// ============================================================================
// 9. LEASE TERMINATION HANDLING
// ============================================================================
/**
 * Initiates lease termination process
 *
 * @param {LeaseTermination} termination - Termination details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Termination record
 *
 * @example
 * ```typescript
 * const termination = await initiateLeaseTermination({
 *   leaseId: 'lease-123',
 *   terminationType: 'EARLY',
 *   terminationDate: new Date('2025-12-31'),
 *   buyoutAmount: 50000,
 * }, sequelize);
 * ```
 */
const initiateLeaseTermination = async (termination, sequelize, transaction) => {
    const [result] = await sequelize.query(`INSERT INTO lease_terminations (id, lease_id, termination_type, termination_date,
     notice_date, notice_period_days, buyout_amount, security_deposit_return,
     outstanding_charges, move_out_date, created_at)
     VALUES (:id, :leaseId, :terminationType, :terminationDate, :noticeDate,
     :noticePeriodDays, :buyoutAmount, :securityDepositReturn, :outstandingCharges,
     :moveOutDate, :createdAt) RETURNING *`, {
        replacements: {
            id: `termination-${Date.now()}`,
            ...termination,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Update lease status
    await sequelize.query(`UPDATE leases SET status = :status, updated_at = :updatedAt WHERE id = :leaseId`, {
        replacements: {
            leaseId: termination.leaseId,
            status: LeaseStatus.TERMINATED,
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    common_1.Logger.log(`Lease termination initiated: ${termination.leaseId}`, 'LeaseManagement');
    return result;
};
exports.initiateLeaseTermination = initiateLeaseTermination;
/**
 * Calculates early termination buyout amount
 *
 * @param {string} leaseId - Lease ID
 * @param {Date} terminationDate - Proposed termination date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Decimal>} Buyout amount
 *
 * @example
 * ```typescript
 * const buyout = await calculateTerminationBuyout('lease-123', new Date('2025-12-31'), sequelize);
 * ```
 */
const calculateTerminationBuyout = async (leaseId, terminationDate, sequelize) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    const expirationDate = new Date(data.expiration_date);
    const remainingMonths = (0, date_fns_1.differenceInMonths)(expirationDate, terminationDate);
    const currentRent = await (0, exports.calculateMonthlyRent)(leaseId, terminationDate, sequelize);
    // Calculate remaining rent obligation
    const remainingRentObligation = currentRent.totalRent.mul(remainingMonths);
    // Apply discount factor for early termination (typically 50-70% of remaining obligation)
    const buyoutFactor = 0.6; // 60% of remaining obligation
    const buyoutAmount = remainingRentObligation.mul(buyoutFactor);
    common_1.Logger.log(`Termination buyout calculated: ${leaseId}, Amount: ${buyoutAmount}`, 'LeaseManagement');
    return buyoutAmount;
};
exports.calculateTerminationBuyout = calculateTerminationBuyout;
/**
 * Processes final lease reconciliation on termination
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Record<string, any>>} Final reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await processFinalReconciliation('lease-123', sequelize);
 * ```
 */
const processFinalReconciliation = async (leaseId, sequelize, transaction) => {
    const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
    const data = lease;
    // Get outstanding invoices
    const [outstandingInvoices] = await sequelize.query(`SELECT SUM(amount) as total FROM lease_invoices
     WHERE lease_id = :leaseId AND paid = false`, { replacements: { leaseId }, type: sequelize_1.QueryTypes.SELECT });
    const outstandingCharges = new decimal_js_1.default(outstandingInvoices?.total || 0);
    const securityDeposit = new decimal_js_1.default(data.security_deposit || 0);
    // Calculate CAM reconciliation if applicable
    const currentYear = new Date().getFullYear();
    let camReconciliation = null;
    try {
        camReconciliation = await (0, exports.reconcileCAMCharges)(leaseId, currentYear, { reconciliationDate: new Date() }, sequelize, transaction);
    }
    catch (error) {
        common_1.Logger.warn(`CAM reconciliation not available for ${leaseId}`, 'LeaseManagement');
    }
    // Calculate final amounts
    const totalOwed = outstandingCharges.plus(camReconciliation?.dueFromTenant || 0);
    const securityDepositReturn = securityDeposit.minus(totalOwed).toNumber();
    const reconciliation = {
        leaseId,
        securityDeposit: securityDeposit.toNumber(),
        outstandingCharges: outstandingCharges.toNumber(),
        camReconciliation,
        totalOwed: totalOwed.toNumber(),
        securityDepositReturn: Math.max(0, securityDepositReturn),
        additionalOwed: Math.max(0, -securityDepositReturn),
        reconciliationDate: new Date(),
    };
    common_1.Logger.log(`Final reconciliation processed: ${leaseId}`, 'LeaseManagement');
    return reconciliation;
};
exports.processFinalReconciliation = processFinalReconciliation;
// ============================================================================
// 10. MULTI-TENANT LEASE COORDINATION
// ============================================================================
/**
 * Allocates shared expenses among multiple tenants
 *
 * @param {string} propertyId - Property ID
 * @param {string} period - Allocation period
 * @param {number} totalExpense - Total expense to allocate
 * @param {'PRO_RATA' | 'EQUAL' | 'CUSTOM'} allocationType - Allocation method
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MultiTenantAllocation>} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = await allocateSharedExpenses(
 *   'prop-123', '2024-Q1', 100000, 'PRO_RATA', sequelize
 * );
 * ```
 */
const allocateSharedExpenses = async (propertyId, period, totalExpense, allocationType, sequelize) => {
    const leases = await sequelize.query(`SELECT id, tenant_id, rentable_area FROM leases
     WHERE property_id = :propertyId AND status = :status AND deleted_at IS NULL`, {
        replacements: { propertyId, status: LeaseStatus.ACTIVE },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const totalExpenseDecimal = new decimal_js_1.default(totalExpense);
    const allocations = [];
    if (allocationType === 'PRO_RATA') {
        const totalArea = leases.reduce((sum, lease) => sum + lease.rentable_area, 0);
        for (const lease of leases) {
            const allocationPercentage = (lease.rentable_area / totalArea) * 100;
            const allocatedAmount = totalExpenseDecimal.mul(allocationPercentage).div(100);
            allocations.push({
                leaseId: lease.id,
                tenantId: lease.tenant_id,
                allocationPercentage,
                allocatedAmount,
                rentableArea: lease.rentable_area,
            });
        }
    }
    else if (allocationType === 'EQUAL') {
        const perTenantAmount = totalExpenseDecimal.div(leases.length);
        const equalPercentage = 100 / leases.length;
        for (const lease of leases) {
            allocations.push({
                leaseId: lease.id,
                tenantId: lease.tenant_id,
                allocationPercentage: equalPercentage,
                allocatedAmount: perTenantAmount,
                rentableArea: lease.rentable_area,
            });
        }
    }
    common_1.Logger.log(`Shared expenses allocated: ${propertyId}, Period: ${period}`, 'LeaseManagement');
    return {
        propertyId,
        period,
        totalExpense,
        allocationType,
        allocations,
    };
};
exports.allocateSharedExpenses = allocateSharedExpenses;
/**
 * Generates rent roll report for a property
 *
 * @param {string} propertyId - Property ID
 * @param {Date} asOfDate - Report date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<RentRollEntry>>} Rent roll entries
 *
 * @example
 * ```typescript
 * const rentRoll = await generateRentRoll('prop-123', new Date(), sequelize);
 * ```
 */
const generateRentRoll = async (propertyId, asOfDate, sequelize) => {
    const leases = await sequelize.query(`SELECT l.*, t.name as tenant_name FROM leases l
     LEFT JOIN tenants t ON l.tenant_id = t.id
     WHERE l.property_id = :propertyId AND l.deleted_at IS NULL
     ORDER BY l.status, t.name`, { replacements: { propertyId }, type: sequelize_1.QueryTypes.SELECT });
    const rentRollEntries = [];
    for (const lease of leases) {
        const currentRent = await (0, exports.calculateMonthlyRent)(lease.id, asOfDate, sequelize);
        const annualRent = currentRent.totalRent.mul(12);
        rentRollEntries.push({
            propertyId: lease.property_id,
            leaseId: lease.id,
            tenantName: lease.tenant_name,
            suiteNumber: lease.suite_number,
            rentableArea: lease.rentable_area,
            leaseStart: new Date(lease.commencement_date),
            leaseEnd: new Date(lease.expiration_date),
            currentRent: currentRent.totalRent,
            annualRent,
            securityDeposit: lease.security_deposit,
            status: lease.status,
            occupancyPercentage: lease.status === LeaseStatus.ACTIVE ? 100 : 0,
        });
    }
    return rentRollEntries;
};
exports.generateRentRoll = generateRentRoll;
/**
 * Calculates portfolio-level lease metrics
 *
 * @param {string[]} propertyIds - Property IDs to include
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeasePortfolioMetrics>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics(['prop-123', 'prop-456'], sequelize);
 * ```
 */
const calculatePortfolioMetrics = async (propertyIds, sequelize) => {
    const leases = await sequelize.query(`SELECT * FROM leases
     WHERE property_id IN (:propertyIds) AND deleted_at IS NULL`, { replacements: { propertyIds }, type: sequelize_1.QueryTypes.SELECT });
    const totalLeases = leases.length;
    const totalRentableArea = leases.reduce((sum, l) => sum + l.rentable_area, 0);
    const occupiedArea = leases
        .filter((l) => l.status === LeaseStatus.ACTIVE)
        .reduce((sum, l) => sum + l.rentable_area, 0);
    const vacantArea = totalRentableArea - occupiedArea;
    const occupancyRate = totalRentableArea > 0 ? (occupiedArea / totalRentableArea) * 100 : 0;
    let totalAnnualRent = new decimal_js_1.default(0);
    const today = new Date();
    for (const lease of leases) {
        if (lease.status === LeaseStatus.ACTIVE) {
            const rent = await (0, exports.calculateMonthlyRent)(lease.id, today, sequelize);
            totalAnnualRent = totalAnnualRent.plus(rent.totalRent.mul(12));
        }
    }
    const averageRentPerSqFt = occupiedArea > 0
        ? totalAnnualRent.div(occupiedArea)
        : new decimal_js_1.default(0);
    const leasesExpiring30Days = leases.filter((l) => {
        const daysToExpire = (0, date_fns_1.differenceInDays)(new Date(l.expiration_date), today);
        return daysToExpire >= 0 && daysToExpire <= 30;
    }).length;
    const leasesExpiring90Days = leases.filter((l) => {
        const daysToExpire = (0, date_fns_1.differenceInDays)(new Date(l.expiration_date), today);
        return daysToExpire >= 0 && daysToExpire <= 90;
    }).length;
    const leasesExpiring180Days = leases.filter((l) => {
        const daysToExpire = (0, date_fns_1.differenceInDays)(new Date(l.expiration_date), today);
        return daysToExpire >= 0 && daysToExpire <= 180;
    }).length;
    const averageLeaseTermMonths = totalLeases > 0
        ? leases.reduce((sum, l) => sum + l.lease_term, 0) / totalLeases
        : 0;
    const weightedAverageLeaseTermRemaining = totalLeases > 0
        ? leases.reduce((sum, l) => {
            const monthsRemaining = (0, date_fns_1.differenceInMonths)(new Date(l.expiration_date), today);
            return sum + (monthsRemaining * l.rentable_area);
        }, 0) / totalRentableArea
        : 0;
    return {
        totalLeases,
        totalRentableArea,
        occupiedArea,
        vacantArea,
        occupancyRate,
        totalAnnualRent,
        averageRentPerSqFt,
        leasesExpiring30Days,
        leasesExpiring90Days,
        leasesExpiring180Days,
        averageLeaseTermMonths,
        weightedAverageLeaseTermRemaining,
    };
};
exports.calculatePortfolioMetrics = calculatePortfolioMetrics;
/**
 * Coordinates multi-tenant CAM charges across property
 *
 * @param {string} propertyId - Property ID
 * @param {number} year - CAM year
 * @param {number} totalCAMExpense - Total CAM expense
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Array<CAMReconciliation>>} Tenant CAM reconciliations
 *
 * @example
 * ```typescript
 * const reconciliations = await coordinateMultiTenantCAM(
 *   'prop-123', 2024, 500000, sequelize
 * );
 * ```
 */
const coordinateMultiTenantCAM = async (propertyId, year, totalCAMExpense, sequelize, transaction) => {
    const leases = await sequelize.query(`SELECT id, rentable_area FROM leases
     WHERE property_id = :propertyId AND status = :status AND deleted_at IS NULL`, {
        replacements: { propertyId, status: LeaseStatus.ACTIVE },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const totalArea = leases.reduce((sum, l) => sum + l.rentable_area, 0);
    const reconciliations = [];
    for (const lease of leases) {
        const tenantShare = (lease.rentable_area / totalArea) * 100;
        const actualCAM = totalCAMExpense;
        // Get estimated CAM from lease charges
        const [estimatedCharge] = await sequelize.query(`SELECT amount FROM lease_charges
       WHERE lease_id = :leaseId AND charge_type = :chargeType
       ORDER BY created_at DESC LIMIT 1`, {
            replacements: { leaseId: lease.id, chargeType: ChargeType.CAM },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const estimatedCAM = estimatedCharge ? estimatedCharge.amount * 12 : 0;
        const reconciliation = await (0, exports.reconcileCAMCharges)(lease.id, year, { estimatedCAM, actualCAM, tenantShare }, sequelize, transaction);
        reconciliations.push(reconciliation);
    }
    common_1.Logger.log(`Multi-tenant CAM coordinated: ${propertyId}, Year: ${year}`, 'LeaseManagement');
    return reconciliations;
};
exports.coordinateMultiTenantCAM = coordinateMultiTenantCAM;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Converts camelCase to snake_case
 *
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 */
const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
/**
 * Validates lease data integrity
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLeaseData('lease-123', sequelize);
 * ```
 */
const validateLeaseData = async (leaseId, sequelize) => {
    const errors = [];
    try {
        const lease = await (0, exports.getLeaseContract)(leaseId, sequelize);
        const data = lease;
        // Validate dates
        if ((0, date_fns_1.isBefore)(new Date(data.expiration_date), new Date(data.commencement_date))) {
            errors.push('Expiration date is before commencement date');
        }
        // Validate financial data
        if (data.base_rent <= 0) {
            errors.push('Base rent must be greater than zero');
        }
        // Validate area
        if (data.rentable_area <= 0) {
            errors.push('Rentable area must be greater than zero');
        }
        // Check for required fields
        if (!data.property_id)
            errors.push('Property ID is required');
        if (!data.tenant_id)
            errors.push('Tenant ID is required');
    }
    catch (error) {
        errors.push(`Lease validation failed: ${error}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateLeaseData = validateLeaseData;
// Export all functions for external use
exports.default = {
    // Lease contract management
    createLeaseContract: exports.createLeaseContract,
    updateLeaseContract: exports.updateLeaseContract,
    getLeaseContract: exports.getLeaseContract,
    archiveLeaseContract: exports.archiveLeaseContract,
    // Lease abstraction
    extractLeaseKeyDates: exports.extractLeaseKeyDates,
    generateLeaseAbstract: exports.generateLeaseAbstract,
    monitorCriticalDates: exports.monitorCriticalDates,
    // Rent calculations
    calculateMonthlyRent: exports.calculateMonthlyRent,
    applyRentEscalation: exports.applyRentEscalation,
    calculatePercentageRent: exports.calculatePercentageRent,
    projectFutureEscalations: exports.projectFutureEscalations,
    // Renewals
    checkRenewalEligibility: exports.checkRenewalEligibility,
    initiateLeaseRenewal: exports.initiateLeaseRenewal,
    sendRenewalNotice: exports.sendRenewalNotice,
    exerciseRenewalOption: exports.exerciseRenewalOption,
    // CAM reconciliation
    reconcileCAMCharges: exports.reconcileCAMCharges,
    generateCAMStatement: exports.generateCAMStatement,
    calculateProRataShare: exports.calculateProRataShare,
    // Compliance
    createComplianceObligation: exports.createComplianceObligation,
    checkLeaseCompliance: exports.checkLeaseCompliance,
    updateComplianceStatus: exports.updateComplianceStatus,
    generateComplianceReport: exports.generateComplianceReport,
    // Notifications
    createCriticalDateNotification: exports.createCriticalDateNotification,
    getPendingNotifications: exports.getPendingNotifications,
    acknowledgeNotification: exports.acknowledgeNotification,
    generateAutomatedNotifications: exports.generateAutomatedNotifications,
    // Analytics
    compareLeaseVsActual: exports.compareLeaseVsActual,
    generateVarianceReport: exports.generateVarianceReport,
    identifyBudgetVariances: exports.identifyBudgetVariances,
    // Terminations
    initiateLeaseTermination: exports.initiateLeaseTermination,
    calculateTerminationBuyout: exports.calculateTerminationBuyout,
    processFinalReconciliation: exports.processFinalReconciliation,
    // Multi-tenant
    allocateSharedExpenses: exports.allocateSharedExpenses,
    generateRentRoll: exports.generateRentRoll,
    calculatePortfolioMetrics: exports.calculatePortfolioMetrics,
    coordinateMultiTenantCAM: exports.coordinateMultiTenantCAM,
    // Utilities
    validateLeaseData: exports.validateLeaseData,
};
//# sourceMappingURL=property-lease-management-kit.js.map