"use strict";
/**
 * LOC: INS-REINS-001
 * File: /reuse/insurance/reinsurance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - date-fns
 *   - decimal.js
 *
 * DOWNSTREAM (imported by):
 *   - Reinsurance controllers
 *   - Underwriting services
 *   - Claims processing modules
 *   - Risk management systems
 *   - Financial reporting services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTreatyPerformanceMetrics = exports.calculateNetRetention = exports.validateTreatyTerms = exports.monitorUnauthorizedReinsurance = exports.calculateUncollectibleAllowance = exports.performCollectibilityAssessment = exports.calculateReinsuranceLeverageRatio = exports.generateStatutoryScheduleF = exports.generateReinsuranceAccountingReport = exports.generateTreatyRenewal = exports.identifyExpiringTreaties = exports.optimizeRetentionLevel = exports.calculateAggregateExcessAttachment = exports.analyzeReinsuranceCapacity = exports.calculateRetrocessionPremium = exports.createRetrocessionProgram = exports.reconcileBordereauPayment = exports.submitBordereau = exports.createLossBordereau = exports.createPremiumBordereau = exports.generateCatastropheLossReport = exports.sendLossNotification = exports.updateRecoverableStatus = exports.allocateRecoverableToReinsurers = exports.calculateExcessOfLossRecoverable = exports.calculateQuotaShareRecoverable = exports.createReinsuranceRecoverable = exports.calculateContingentCommission = exports.calculateProfitCommission = exports.calculateSlidingScaleCommission = exports.calculateFlatCedingCommission = exports.calculateReinstatementPremium = exports.applySwingRatingAdjustment = exports.calculateExcessOfLossPremium = exports.calculateSurplusCededPremium = exports.calculateQuotaShareCededPremium = exports.calculateFacultativePremiumAllocation = exports.bindFacultativeCoverage = exports.submitFacultativeQuote = exports.createFacultativeCertificate = exports.getActiveTreatiesByType = exports.validateParticipationPercentages = exports.addReinsurerParticipation = exports.updateReinsuranceTreaty = exports.createReinsuranceTreaty = exports.createFacultativeCertificateModel = exports.createReinsuranceTreatyModel = exports.validateReinsuranceConfig = exports.loadReinsuranceConfig = void 0;
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const decimal_js_1 = __importDefault(require("decimal.js"));
/**
 * Loads reinsurance configuration from environment variables.
 *
 * @returns {ReinsuranceConfig} Reinsurance configuration object
 *
 * @example
 * ```typescript
 * const config = loadReinsuranceConfig();
 * console.log('Automatic treaties enabled:', config.enableAutomaticTreaties);
 * ```
 */
const loadReinsuranceConfig = () => {
    return {
        enableAutomaticTreaties: process.env.ENABLE_AUTOMATIC_TREATIES !== 'false',
        enableFacultativePlacement: process.env.ENABLE_FACULTATIVE_PLACEMENT !== 'false',
        defaultCedingCommissionPct: parseFloat(process.env.DEFAULT_CEDING_COMMISSION_PCT || '25'),
        retentionLimitMultiplier: parseFloat(process.env.RETENTION_LIMIT_MULTIPLIER || '10'),
        catastropheThresholdAmount: parseFloat(process.env.CATASTROPHE_THRESHOLD_AMOUNT || '10000000'),
        aggregateExcessAttachment: parseFloat(process.env.AGGREGATE_EXCESS_ATTACHMENT || '5000000'),
        bordereauSubmissionFrequency: process.env.BORDEREAU_SUBMISSION_FREQUENCY || 'monthly',
        paymentSettlementDays: parseInt(process.env.PAYMENT_SETTLEMENT_DAYS || '30', 10),
        collectibilityReviewDays: parseInt(process.env.COLLECTIBILITY_REVIEW_DAYS || '90', 10),
        retrocessionEnabled: process.env.RETROCESSION_ENABLED === 'true',
        minimumReinsurerRating: process.env.MINIMUM_REINSURER_RATING || 'A-',
        maxSingleReinsurerSharePct: parseFloat(process.env.MAX_SINGLE_REINSURER_SHARE_PCT || '25'),
    };
};
exports.loadReinsuranceConfig = loadReinsuranceConfig;
/**
 * Validates reinsurance configuration.
 *
 * @param {ReinsuranceConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateReinsuranceConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
const validateReinsuranceConfig = (config) => {
    const errors = [];
    if (config.defaultCedingCommissionPct < 0 || config.defaultCedingCommissionPct > 100) {
        errors.push('Default ceding commission must be between 0 and 100');
    }
    if (config.retentionLimitMultiplier < 1) {
        errors.push('Retention limit multiplier must be at least 1');
    }
    if (config.catastropheThresholdAmount <= 0) {
        errors.push('Catastrophe threshold must be positive');
    }
    if (config.maxSingleReinsurerSharePct < 0 || config.maxSingleReinsurerSharePct > 100) {
        errors.push('Max single reinsurer share must be between 0 and 100');
    }
    return errors;
};
exports.validateReinsuranceConfig = validateReinsuranceConfig;
/**
 * Creates ReinsuranceTreaty model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReinsuranceTreatyAttributes>>} ReinsuranceTreaty model
 *
 * @example
 * ```typescript
 * const TreatyModel = createReinsuranceTreatyModel(sequelize);
 * const treaty = await TreatyModel.create({
 *   treatyNumber: 'QS-2024-001',
 *   treatyName: 'Property Quota Share 2024',
 *   treatyType: 'quota_share',
 *   status: 'in_force'
 * });
 * ```
 */
const createReinsuranceTreatyModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        treatyNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique treaty identifier',
        },
        treatyName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        treatyType: {
            type: sequelize_1.DataTypes.ENUM('quota_share', 'surplus', 'excess_of_loss_per_risk', 'excess_of_loss_per_occurrence', 'catastrophe_excess', 'aggregate_excess', 'stop_loss', 'facultative'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending_approval', 'bound', 'in_force', 'expired', 'cancelled', 'renewed'),
            allowNull: false,
            defaultValue: 'draft',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        cancellationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cedingCompanyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'companies',
                key: 'id',
            },
        },
        reinsurerParticipations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of reinsurer participation details',
        },
        coverageTerms: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Coverage limits, retention, layers',
        },
        premiumTerms: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Premium calculation and payment terms',
        },
        commissionTerms: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Ceding commission structure',
        },
        settlementTerms: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Settlement and payment terms',
        },
        specialConditions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: true,
            defaultValue: [],
        },
        attachedDocuments: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    };
    const options = {
        tableName: 'reinsurance_treaties',
        timestamps: true,
        paranoid: false,
        indexes: [
            { fields: ['treatyNumber'], unique: true },
            { fields: ['treatyType'] },
            { fields: ['status'] },
            { fields: ['effectiveDate', 'expirationDate'] },
            { fields: ['cedingCompanyId'] },
        ],
    };
    return sequelize.define('ReinsuranceTreaty', attributes, options);
};
exports.createReinsuranceTreatyModel = createReinsuranceTreatyModel;
/**
 * Creates FacultativeCertificate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FacultativeCertificateAttributes>>} FacultativeCertificate model
 */
const createFacultativeCertificateModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        certificateNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'policies',
                key: 'id',
            },
        },
        policyNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        insuredName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        submissionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        boundDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cedingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        retentionAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        facultativeAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        reinsurerParticipations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        premiumDetails: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        underwritingInfo: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('quoted', 'bound', 'declined', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'quoted',
        },
        declinationReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        specialConditions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: true,
            defaultValue: [],
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    };
    const options = {
        tableName: 'facultative_certificates',
        timestamps: true,
        indexes: [
            { fields: ['certificateNumber'], unique: true },
            { fields: ['policyId'] },
            { fields: ['status'] },
            { fields: ['effectiveDate', 'expirationDate'] },
        ],
    };
    return sequelize.define('FacultativeCertificate', attributes, options);
};
exports.createFacultativeCertificateModel = createFacultativeCertificateModel;
// ============================================================================
// 1. TREATY MANAGEMENT
// ============================================================================
/**
 * 1. Creates a new reinsurance treaty.
 *
 * @param {Partial<ReinsuranceTreaty>} treatyData - Treaty data
 * @returns {Promise<ReinsuranceTreaty>} Created treaty
 *
 * @example
 * ```typescript
 * const treaty = await createReinsuranceTreaty({
 *   treatyName: 'Property Quota Share 2024',
 *   treatyType: 'quota_share',
 *   effectiveDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2024-12-31')
 * });
 * ```
 */
const createReinsuranceTreaty = async (treatyData) => {
    const treatyNumber = `RI-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
        id: crypto.randomUUID(),
        treatyNumber,
        treatyName: treatyData.treatyName || 'Untitled Treaty',
        treatyType: treatyData.treatyType || 'quota_share',
        status: 'draft',
        effectiveDate: treatyData.effectiveDate || new Date(),
        expirationDate: treatyData.expirationDate || (0, date_fns_1.addYears)(new Date(), 1),
        cedingCompanyId: treatyData.cedingCompanyId || crypto.randomUUID(),
        reinsurerParticipations: treatyData.reinsurerParticipations || [],
        coverageTerms: treatyData.coverageTerms || { limitAmount: 0 },
        premiumTerms: treatyData.premiumTerms || { premiumBasis: 'gross_written', premiumPaymentFrequency: 'quarterly' },
        settlementTerms: treatyData.settlementTerms || {
            bordereauFrequency: 'quarterly',
            paymentDueDays: 30,
            interestOnOverdue: 0,
            offsettingAllowed: false,
            currencySettlement: 'USD',
        },
        commissionTerms: treatyData.commissionTerms,
        specialConditions: treatyData.specialConditions,
        attachedDocuments: treatyData.attachedDocuments,
        createdBy: treatyData.createdBy || crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createReinsuranceTreaty = createReinsuranceTreaty;
/**
 * 2. Updates existing treaty.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Partial<ReinsuranceTreaty>} updates - Treaty updates
 * @returns {Promise<ReinsuranceTreaty>} Updated treaty
 *
 * @example
 * ```typescript
 * const updated = await updateReinsuranceTreaty(treatyId, {
 *   status: 'in_force'
 * });
 * ```
 */
const updateReinsuranceTreaty = async (treatyId, updates) => {
    // Placeholder for database update
    return {
        id: treatyId,
        ...updates,
        updatedAt: new Date(),
    };
};
exports.updateReinsuranceTreaty = updateReinsuranceTreaty;
/**
 * 3. Adds reinsurer participation to treaty.
 *
 * @param {string} treatyId - Treaty ID
 * @param {ReinsurerParticipation} participation - Reinsurer participation details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addReinsurerParticipation(treatyId, {
 *   reinsurerId: 'reinsurer-123',
 *   reinsurerName: 'Munich Re',
 *   participationPct: 30,
 *   rating: 'AA+',
 *   authorized: true
 * });
 * ```
 */
const addReinsurerParticipation = async (treatyId, participation) => {
    // Placeholder for adding reinsurer participation
};
exports.addReinsurerParticipation = addReinsurerParticipation;
/**
 * 4. Validates treaty participation percentages sum to 100.
 *
 * @param {ReinsurerParticipation[]} participations - Reinsurer participations
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateParticipationPercentages(participations);
 * if (!isValid) throw new Error('Participations must sum to 100%');
 * ```
 */
const validateParticipationPercentages = (participations) => {
    const total = participations.reduce((sum, p) => sum + p.participationPct, 0);
    return Math.abs(total - 100) < 0.01;
};
exports.validateParticipationPercentages = validateParticipationPercentages;
/**
 * 5. Gets active treaties by type.
 *
 * @param {TreatyType} treatyType - Treaty type
 * @param {Date} [effectiveDate] - Effective date
 * @returns {Promise<ReinsuranceTreaty[]>} Active treaties
 *
 * @example
 * ```typescript
 * const quotaShareTreaties = await getActiveTreatiesByType('quota_share');
 * ```
 */
const getActiveTreatiesByType = async (treatyType, effectiveDate = new Date()) => {
    return [];
};
exports.getActiveTreatiesByType = getActiveTreatiesByType;
// ============================================================================
// 2. FACULTATIVE PLACEMENT
// ============================================================================
/**
 * 6. Creates facultative certificate.
 *
 * @param {Partial<FacultativeCertificate>} certData - Certificate data
 * @returns {Promise<FacultativeCertificate>} Created certificate
 *
 * @example
 * ```typescript
 * const cert = await createFacultativeCertificate({
 *   policyId: 'policy-123',
 *   cedingAmount: 5000000,
 *   retentionAmount: 1000000,
 *   facultativeAmount: 4000000
 * });
 * ```
 */
const createFacultativeCertificate = async (certData) => {
    const certificateNumber = `FAC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
        id: crypto.randomUUID(),
        certificateNumber,
        policyId: certData.policyId || crypto.randomUUID(),
        policyNumber: certData.policyNumber || 'UNKNOWN',
        insuredName: certData.insuredName || 'Unknown Insured',
        effectiveDate: certData.effectiveDate || new Date(),
        expirationDate: certData.expirationDate || (0, date_fns_1.addYears)(new Date(), 1),
        submissionDate: certData.submissionDate || new Date(),
        boundDate: certData.boundDate,
        cedingAmount: certData.cedingAmount || 0,
        retentionAmount: certData.retentionAmount || 0,
        facultativeAmount: certData.facultativeAmount || 0,
        reinsurerParticipations: certData.reinsurerParticipations || [],
        premiumDetails: certData.premiumDetails || {
            grossPremium: 0,
            cedingPremiumPct: 0,
            cedingPremiumAmount: 0,
            cedingCommissionPct: 0,
            cedingCommissionAmount: 0,
        },
        underwritingInfo: certData.underwritingInfo || { riskDescription: '' },
        status: 'quoted',
        specialConditions: certData.specialConditions,
        createdBy: certData.createdBy || crypto.randomUUID(),
        createdAt: new Date(),
    };
};
exports.createFacultativeCertificate = createFacultativeCertificate;
/**
 * 7. Submits facultative quote request.
 *
 * @param {string} certificateId - Certificate ID
 * @param {string[]} reinsurerIds - Reinsurer IDs to quote
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await submitFacultativeQuote(certId, ['reinsurer-1', 'reinsurer-2']);
 * ```
 */
const submitFacultativeQuote = async (certificateId, reinsurerIds) => {
    // Placeholder for quote submission
};
exports.submitFacultativeQuote = submitFacultativeQuote;
/**
 * 8. Binds facultative coverage.
 *
 * @param {string} certificateId - Certificate ID
 * @param {ReinsurerParticipation[]} acceptedQuotes - Accepted reinsurer quotes
 * @returns {Promise<FacultativeCertificate>} Bound certificate
 *
 * @example
 * ```typescript
 * const bound = await bindFacultativeCoverage(certId, acceptedQuotes);
 * ```
 */
const bindFacultativeCoverage = async (certificateId, acceptedQuotes) => {
    return {};
};
exports.bindFacultativeCoverage = bindFacultativeCoverage;
/**
 * 9. Calculates facultative premium allocation.
 *
 * @param {number} grossPremium - Gross premium
 * @param {number} cedingPct - Ceding percentage
 * @param {number} commissionPct - Commission percentage
 * @returns {{ cedingPremium: number; commission: number; netPremium: number }}
 *
 * @example
 * ```typescript
 * const allocation = calculateFacultativePremiumAllocation(100000, 80, 25);
 * console.log('Net premium:', allocation.netPremium);
 * ```
 */
const calculateFacultativePremiumAllocation = (grossPremium, cedingPct, commissionPct) => {
    const cedingPremium = new decimal_js_1.default(grossPremium).times(cedingPct).div(100).toNumber();
    const commission = new decimal_js_1.default(cedingPremium).times(commissionPct).div(100).toNumber();
    const netPremium = new decimal_js_1.default(cedingPremium).minus(commission).toNumber();
    return { cedingPremium, commission, netPremium };
};
exports.calculateFacultativePremiumAllocation = calculateFacultativePremiumAllocation;
// ============================================================================
// 3. PREMIUM CALCULATIONS
// ============================================================================
/**
 * 10. Calculates quota share ceded premium.
 *
 * @param {number} grossPremium - Gross written premium
 * @param {number} quotaSharePct - Quota share percentage
 * @returns {number} Ceded premium
 *
 * @example
 * ```typescript
 * const ceded = calculateQuotaShareCededPremium(1000000, 30);
 * console.log('Ceded premium:', ceded); // 300000
 * ```
 */
const calculateQuotaShareCededPremium = (grossPremium, quotaSharePct) => {
    return new decimal_js_1.default(grossPremium).times(quotaSharePct).div(100).toNumber();
};
exports.calculateQuotaShareCededPremium = calculateQuotaShareCededPremium;
/**
 * 11. Calculates surplus treaty ceded premium.
 *
 * @param {number} policyLimit - Policy limit
 * @param {number} retention - Retention amount
 * @param {number} numberOfLines - Number of surplus lines
 * @param {number} premiumRate - Premium rate
 * @returns {number} Ceded premium
 *
 * @example
 * ```typescript
 * const ceded = calculateSurplusCededPremium(5000000, 1000000, 4, 0.05);
 * ```
 */
const calculateSurplusCededPremium = (policyLimit, retention, numberOfLines, premiumRate) => {
    const maxSurplus = new decimal_js_1.default(retention).times(numberOfLines);
    const cededLimit = decimal_js_1.default.min(new decimal_js_1.default(policyLimit).minus(retention), maxSurplus);
    return cededLimit.times(premiumRate).toNumber();
};
exports.calculateSurplusCededPremium = calculateSurplusCededPremium;
/**
 * 12. Calculates excess of loss premium.
 *
 * @param {number} subjectPremium - Subject premium
 * @param {number} rate - Excess of loss rate
 * @param {number} minimumPremium - Minimum premium
 * @returns {number} Excess of loss premium
 *
 * @example
 * ```typescript
 * const premium = calculateExcessOfLossPremium(10000000, 0.05, 250000);
 * ```
 */
const calculateExcessOfLossPremium = (subjectPremium, rate, minimumPremium = 0) => {
    const calculated = new decimal_js_1.default(subjectPremium).times(rate);
    return decimal_js_1.default.max(calculated, minimumPremium).toNumber();
};
exports.calculateExcessOfLossPremium = calculateExcessOfLossPremium;
/**
 * 13. Applies swing rating adjustment.
 *
 * @param {number} depositPremium - Deposit premium
 * @param {number} actualLossRatio - Actual loss ratio
 * @param {number} targetLossRatio - Target loss ratio
 * @param {number} maxSwingPct - Maximum swing percentage
 * @returns {number} Adjusted premium
 *
 * @example
 * ```typescript
 * const adjusted = applySwingRatingAdjustment(500000, 0.65, 0.60, 25);
 * ```
 */
const applySwingRatingAdjustment = (depositPremium, actualLossRatio, targetLossRatio, maxSwingPct) => {
    const adjustment = new decimal_js_1.default(actualLossRatio).minus(targetLossRatio).div(targetLossRatio);
    const cappedAdjustment = decimal_js_1.default.min(decimal_js_1.default.max(adjustment, new decimal_js_1.default(-maxSwingPct).div(100)), new decimal_js_1.default(maxSwingPct).div(100));
    return new decimal_js_1.default(depositPremium).times(new decimal_js_1.default(1).plus(cappedAdjustment)).toNumber();
};
exports.applySwingRatingAdjustment = applySwingRatingAdjustment;
/**
 * 14. Calculates reinstatement premium.
 *
 * @param {number} originalPremium - Original treaty premium
 * @param {number} lossAmount - Loss amount
 * @param {number} limit - Treaty limit
 * @param {number} reinstatementPct - Reinstatement premium percentage
 * @param {boolean} proRata - Pro rata reinstatement
 * @returns {number} Reinstatement premium
 *
 * @example
 * ```typescript
 * const reinstatement = calculateReinstatementPremium(1000000, 3000000, 5000000, 100, true);
 * ```
 */
const calculateReinstatementPremium = (originalPremium, lossAmount, limit, reinstatementPct, proRata) => {
    const base = new decimal_js_1.default(originalPremium).times(reinstatementPct).div(100);
    if (proRata) {
        return base.times(lossAmount).div(limit).toNumber();
    }
    return base.toNumber();
};
exports.calculateReinstatementPremium = calculateReinstatementPremium;
// ============================================================================
// 4. CEDING COMMISSION
// ============================================================================
/**
 * 15. Calculates flat ceding commission.
 *
 * @param {number} cedingPremium - Ceding premium
 * @param {number} commissionPct - Commission percentage
 * @returns {number} Commission amount
 *
 * @example
 * ```typescript
 * const commission = calculateFlatCedingCommission(500000, 25);
 * console.log('Commission:', commission); // 125000
 * ```
 */
const calculateFlatCedingCommission = (cedingPremium, commissionPct) => {
    return new decimal_js_1.default(cedingPremium).times(commissionPct).div(100).toNumber();
};
exports.calculateFlatCedingCommission = calculateFlatCedingCommission;
/**
 * 16. Calculates sliding scale commission.
 *
 * @param {number} cedingPremium - Ceding premium
 * @param {number} lossRatio - Loss ratio
 * @param {CommissionTerms['slidingScaleLadder']} ladder - Sliding scale ladder
 * @returns {number} Commission amount
 *
 * @example
 * ```typescript
 * const commission = calculateSlidingScaleCommission(1000000, 0.62, [
 *   { lossRatioMin: 0, lossRatioMax: 0.60, commissionPct: 30 },
 *   { lossRatioMin: 0.60, lossRatioMax: 0.70, commissionPct: 25 }
 * ]);
 * ```
 */
const calculateSlidingScaleCommission = (cedingPremium, lossRatio, ladder) => {
    if (!ladder || ladder.length === 0) {
        return 0;
    }
    const applicableTier = ladder.find((tier) => lossRatio >= tier.lossRatioMin && lossRatio < tier.lossRatioMax);
    if (!applicableTier) {
        return 0;
    }
    return new decimal_js_1.default(cedingPremium).times(applicableTier.commissionPct).div(100).toNumber();
};
exports.calculateSlidingScaleCommission = calculateSlidingScaleCommission;
/**
 * 17. Calculates profit commission.
 *
 * @param {number} earnedPremium - Earned premium
 * @param {number} incurredLosses - Incurred losses
 * @param {number} expenses - Expenses
 * @param {number} profitCommissionPct - Profit commission percentage
 * @returns {number} Profit commission
 *
 * @example
 * ```typescript
 * const profitComm = calculateProfitCommission(2000000, 1200000, 200000, 50);
 * ```
 */
const calculateProfitCommission = (earnedPremium, incurredLosses, expenses, profitCommissionPct) => {
    const profit = new decimal_js_1.default(earnedPremium).minus(incurredLosses).minus(expenses);
    if (profit.lessThanOrEqualTo(0)) {
        return 0;
    }
    return profit.times(profitCommissionPct).div(100).toNumber();
};
exports.calculateProfitCommission = calculateProfitCommission;
/**
 * 18. Calculates contingent commission.
 *
 * @param {number} totalPremium - Total premium
 * @param {number} totalLosses - Total losses
 * @param {number} targetLossRatio - Target loss ratio
 * @param {number} commissionRate - Commission rate if target met
 * @returns {number} Contingent commission
 *
 * @example
 * ```typescript
 * const contingent = calculateContingentCommission(5000000, 2800000, 0.60, 10);
 * ```
 */
const calculateContingentCommission = (totalPremium, totalLosses, targetLossRatio, commissionRate) => {
    const actualLossRatio = new decimal_js_1.default(totalLosses).div(totalPremium);
    if (actualLossRatio.greaterThan(targetLossRatio)) {
        return 0;
    }
    return new decimal_js_1.default(totalPremium).times(commissionRate).div(100).toNumber();
};
exports.calculateContingentCommission = calculateContingentCommission;
// ============================================================================
// 5. REINSURANCE RECOVERABLES
// ============================================================================
/**
 * 19. Creates reinsurance recoverable.
 *
 * @param {Partial<ReinsuranceRecoverable>} recoverableData - Recoverable data
 * @returns {Promise<ReinsuranceRecoverable>} Created recoverable
 *
 * @example
 * ```typescript
 * const recoverable = await createReinsuranceRecoverable({
 *   claimId: 'claim-123',
 *   totalIncurredAmount: 5000000,
 *   cedingRetention: 1000000,
 *   recoverableAmount: 4000000
 * });
 * ```
 */
const createReinsuranceRecoverable = async (recoverableData) => {
    return {
        id: crypto.randomUUID(),
        claimId: recoverableData.claimId || crypto.randomUUID(),
        claimNumber: recoverableData.claimNumber || 'UNKNOWN',
        treatyId: recoverableData.treatyId,
        facultativeCertId: recoverableData.facultativeCertId,
        lossDate: recoverableData.lossDate || new Date(),
        reportedDate: recoverableData.reportedDate || new Date(),
        paidLossAmount: recoverableData.paidLossAmount || 0,
        caseReserveAmount: recoverableData.caseReserveAmount || 0,
        ibnrAmount: recoverableData.ibnrAmount || 0,
        totalIncurredAmount: recoverableData.totalIncurredAmount || 0,
        cedingRetention: recoverableData.cedingRetention || 0,
        recoverableAmount: recoverableData.recoverableAmount || 0,
        reinsurerAllocations: recoverableData.reinsurerAllocations || [],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createReinsuranceRecoverable = createReinsuranceRecoverable;
/**
 * 20. Calculates recoverable amount under quota share.
 *
 * @param {number} totalIncurred - Total incurred loss
 * @param {number} retention - Retention amount
 * @param {number} quotaSharePct - Quota share percentage
 * @returns {number} Recoverable amount
 *
 * @example
 * ```typescript
 * const recoverable = calculateQuotaShareRecoverable(5000000, 0, 30);
 * console.log('Recoverable:', recoverable); // 1500000
 * ```
 */
const calculateQuotaShareRecoverable = (totalIncurred, retention, quotaSharePct) => {
    const cededAmount = new decimal_js_1.default(totalIncurred).minus(retention);
    if (cededAmount.lessThanOrEqualTo(0)) {
        return 0;
    }
    return cededAmount.times(quotaSharePct).div(100).toNumber();
};
exports.calculateQuotaShareRecoverable = calculateQuotaShareRecoverable;
/**
 * 21. Calculates recoverable under excess of loss.
 *
 * @param {number} lossAmount - Loss amount
 * @param {number} attachmentPoint - Attachment point
 * @param {number} limit - Layer limit
 * @returns {number} Recoverable amount
 *
 * @example
 * ```typescript
 * const recoverable = calculateExcessOfLossRecoverable(8000000, 2000000, 5000000);
 * console.log('Recoverable:', recoverable); // 5000000 (capped at limit)
 * ```
 */
const calculateExcessOfLossRecoverable = (lossAmount, attachmentPoint, limit) => {
    const excess = new decimal_js_1.default(lossAmount).minus(attachmentPoint);
    if (excess.lessThanOrEqualTo(0)) {
        return 0;
    }
    return decimal_js_1.default.min(excess, limit).toNumber();
};
exports.calculateExcessOfLossRecoverable = calculateExcessOfLossRecoverable;
/**
 * 22. Allocates recoverable to reinsurers.
 *
 * @param {number} totalRecoverable - Total recoverable amount
 * @param {ReinsurerParticipation[]} participations - Reinsurer participations
 * @returns {Array<{ reinsurerId: string; allocationPct: number; recoverableAmount: number }>}
 *
 * @example
 * ```typescript
 * const allocations = allocateRecoverableToReinsurers(4000000, participations);
 * ```
 */
const allocateRecoverableToReinsurers = (totalRecoverable, participations) => {
    return participations.map((p) => ({
        reinsurerId: p.reinsurerId,
        allocationPct: p.participationPct,
        recoverableAmount: new decimal_js_1.default(totalRecoverable).times(p.participationPct).div(100).toNumber(),
        paidAmount: 0,
        outstandingAmount: new decimal_js_1.default(totalRecoverable).times(p.participationPct).div(100).toNumber(),
    }));
};
exports.allocateRecoverableToReinsurers = allocateRecoverableToReinsurers;
/**
 * 23. Updates recoverable status.
 *
 * @param {string} recoverableId - Recoverable ID
 * @param {RecoverableStatus} status - New status
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateRecoverableStatus(recoverableId, 'collected');
 * ```
 */
const updateRecoverableStatus = async (recoverableId, status) => {
    // Placeholder for status update
};
exports.updateRecoverableStatus = updateRecoverableStatus;
// ============================================================================
// 6. LOSS NOTIFICATIONS
// ============================================================================
/**
 * 24. Sends loss notification to reinsurers.
 *
 * @param {string} claimId - Claim ID
 * @param {string[]} reinsurerIds - Reinsurer IDs
 * @param {Object} lossDetails - Loss details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendLossNotification(claimId, reinsurerIds, {
 *   lossDate: new Date(),
 *   estimatedAmount: 5000000,
 *   description: 'Major property damage'
 * });
 * ```
 */
const sendLossNotification = async (claimId, reinsurerIds, lossDetails) => {
    // Placeholder for notification
};
exports.sendLossNotification = sendLossNotification;
/**
 * 25. Generates catastrophe loss report.
 *
 * @param {Date} eventDate - Catastrophe event date
 * @param {string} eventName - Event name
 * @param {string[]} affectedClaimIds - Affected claim IDs
 * @returns {Promise<{ totalIncurred: number; totalRecoverable: number; affectedTreaties: string[] }>}
 *
 * @example
 * ```typescript
 * const catReport = await generateCatastropheLossReport(
 *   new Date('2024-08-15'),
 *   'Hurricane Alpha',
 *   affectedClaimIds
 * );
 * ```
 */
const generateCatastropheLossReport = async (eventDate, eventName, affectedClaimIds) => {
    return {
        totalIncurred: 0,
        totalRecoverable: 0,
        affectedTreaties: [],
    };
};
exports.generateCatastropheLossReport = generateCatastropheLossReport;
// ============================================================================
// 7. BORDEREAU PROCESSING
// ============================================================================
/**
 * 26. Creates premium bordereau.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {BordereauLineItem[]} lineItems - Line items
 * @returns {Promise<Bordereau>} Created bordereau
 *
 * @example
 * ```typescript
 * const bordereau = await createPremiumBordereau(
 *   treatyId,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   lineItems
 * );
 * ```
 */
const createPremiumBordereau = async (treatyId, periodStart, periodEnd, lineItems) => {
    const totalGrossPremium = lineItems.reduce((sum, item) => sum + item.grossAmount, 0);
    const totalCededPremium = lineItems.reduce((sum, item) => sum + item.cededAmount, 0);
    const totalCommission = lineItems.reduce((sum, item) => sum + (item.commissionAmount || 0), 0);
    return {
        id: crypto.randomUUID(),
        bordereauNumber: `BDX-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        treatyId,
        bordereauType: 'premium',
        periodStart,
        periodEnd,
        submissionDate: new Date(),
        lineItems,
        summary: {
            totalGrossPremium,
            totalCededPremium,
            totalCommission,
            netPremiumDue: totalCededPremium - totalCommission,
            numberOfItems: lineItems.length,
        },
        currency: 'USD',
        status: 'draft',
    };
};
exports.createPremiumBordereau = createPremiumBordereau;
/**
 * 27. Creates loss bordereau.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {BordereauLineItem[]} lossItems - Loss line items
 * @returns {Promise<Bordereau>} Created loss bordereau
 *
 * @example
 * ```typescript
 * const lossBordereau = await createLossBordereau(treatyId, periodStart, periodEnd, lossItems);
 * ```
 */
const createLossBordereau = async (treatyId, periodStart, periodEnd, lossItems) => {
    const totalLosses = lossItems.reduce((sum, item) => sum + item.grossAmount, 0);
    const totalRecoverables = lossItems.reduce((sum, item) => sum + item.cededAmount, 0);
    return {
        id: crypto.randomUUID(),
        bordereauNumber: `BDX-L-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        treatyId,
        bordereauType: 'loss',
        periodStart,
        periodEnd,
        submissionDate: new Date(),
        lineItems: lossItems,
        summary: {
            totalLosses,
            totalRecoverables,
            numberOfItems: lossItems.length,
        },
        currency: 'USD',
        status: 'draft',
    };
};
exports.createLossBordereau = createLossBordereau;
/**
 * 28. Submits bordereau to reinsurers.
 *
 * @param {string} bordereauId - Bordereau ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await submitBordereau(bordereauId);
 * ```
 */
const submitBordereau = async (bordereauId) => {
    // Placeholder for submission
};
exports.submitBordereau = submitBordereau;
/**
 * 29. Reconciles bordereau payments.
 *
 * @param {string} bordereauId - Bordereau ID
 * @param {number} paymentAmount - Payment amount
 * @param {Date} paymentDate - Payment date
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reconcileBordereauPayment(bordereauId, 450000, new Date());
 * ```
 */
const reconcileBordereauPayment = async (bordereauId, paymentAmount, paymentDate) => {
    // Placeholder for reconciliation
};
exports.reconcileBordereauPayment = reconcileBordereauPayment;
// ============================================================================
// 8. RETROCESSION MANAGEMENT
// ============================================================================
/**
 * 30. Creates retrocession program.
 *
 * @param {Partial<RetrocessionProgram>} programData - Program data
 * @returns {Promise<RetrocessionProgram>} Created program
 *
 * @example
 * ```typescript
 * const program = await createRetrocessionProgram({
 *   programName: 'Catastrophe Retro 2024',
 *   retrocededPct: 50,
 *   retainedPct: 50
 * });
 * ```
 */
const createRetrocessionProgram = async (programData) => {
    return {
        id: crypto.randomUUID(),
        programName: programData.programName || 'Untitled Retro Program',
        effectiveDate: programData.effectiveDate || new Date(),
        expirationDate: programData.expirationDate || (0, date_fns_1.addYears)(new Date(), 1),
        originalTreatyIds: programData.originalTreatyIds || [],
        retrocessionnaires: programData.retrocessionnaires || [],
        retrocededPct: programData.retrocededPct || 0,
        retainedPct: programData.retainedPct || 100,
        structure: programData.structure || 'proportional',
        status: 'active',
        createdAt: new Date(),
    };
};
exports.createRetrocessionProgram = createRetrocessionProgram;
/**
 * 31. Calculates retrocession ceded premium.
 *
 * @param {number} originalCededPremium - Original ceded premium
 * @param {number} retrocessionPct - Retrocession percentage
 * @returns {number} Retroceded premium
 *
 * @example
 * ```typescript
 * const retroceded = calculateRetrocessionPremium(5000000, 50);
 * console.log('Retroceded:', retroceded); // 2500000
 * ```
 */
const calculateRetrocessionPremium = (originalCededPremium, retrocessionPct) => {
    return new decimal_js_1.default(originalCededPremium).times(retrocessionPct).div(100).toNumber();
};
exports.calculateRetrocessionPremium = calculateRetrocessionPremium;
// ============================================================================
// 9. CAPACITY PLANNING
// ============================================================================
/**
 * 32. Analyzes reinsurance capacity.
 *
 * @param {string} lineOfBusiness - Line of business
 * @returns {Promise<CapacityAnalysis>} Capacity analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeReinsuranceCapacity('property');
 * console.log('Available capacity:', analysis.availableTreatyCapacity);
 * ```
 */
const analyzeReinsuranceCapacity = async (lineOfBusiness) => {
    return {
        analysisDate: new Date(),
        lineOfBusiness,
        currentRetention: 0,
        availableTreatyCapacity: 0,
        facultativeCapacity: 0,
        totalCapacity: 0,
        capacityUtilization: 0,
        capacityUtilizationPct: 0,
        projectedNeeds: 0,
        recommendations: [],
    };
};
exports.analyzeReinsuranceCapacity = analyzeReinsuranceCapacity;
/**
 * 33. Calculates aggregate excess attachment.
 *
 * @param {number} annualPremium - Annual premium
 * @param {number} expectedLossRatio - Expected loss ratio
 * @param {number} attachmentMultiple - Attachment point multiple
 * @returns {number} Attachment point
 *
 * @example
 * ```typescript
 * const attachment = calculateAggregateExcessAttachment(10000000, 0.65, 1.5);
 * ```
 */
const calculateAggregateExcessAttachment = (annualPremium, expectedLossRatio, attachmentMultiple) => {
    return new decimal_js_1.default(annualPremium).times(expectedLossRatio).times(attachmentMultiple).toNumber();
};
exports.calculateAggregateExcessAttachment = calculateAggregateExcessAttachment;
/**
 * 34. Optimizes retention levels.
 *
 * @param {number} capitalBase - Capital base
 * @param {number} riskTolerance - Risk tolerance percentage
 * @returns {number} Recommended retention
 *
 * @example
 * ```typescript
 * const retention = optimizeRetentionLevel(50000000, 0.10);
 * ```
 */
const optimizeRetentionLevel = (capitalBase, riskTolerance) => {
    return new decimal_js_1.default(capitalBase).times(riskTolerance).toNumber();
};
exports.optimizeRetentionLevel = optimizeRetentionLevel;
// ============================================================================
// 10. TREATY RENEWALS
// ============================================================================
/**
 * 35. Identifies expiring treaties.
 *
 * @param {number} daysThreshold - Days until expiration
 * @returns {Promise<ReinsuranceTreaty[]>} Expiring treaties
 *
 * @example
 * ```typescript
 * const expiring = await identifyExpiringTreaties(90);
 * console.log(`${expiring.length} treaties expiring in 90 days`);
 * ```
 */
const identifyExpiringTreaties = async (daysThreshold) => {
    return [];
};
exports.identifyExpiringTreaties = identifyExpiringTreaties;
/**
 * 36. Generates treaty renewal.
 *
 * @param {string} currentTreatyId - Current treaty ID
 * @param {Partial<ReinsuranceTreaty>} renewalTerms - Renewal terms
 * @returns {Promise<ReinsuranceTreaty>} Renewed treaty
 *
 * @example
 * ```typescript
 * const renewed = await generateTreatyRenewal(treatyId, {
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
const generateTreatyRenewal = async (currentTreatyId, renewalTerms) => {
    return {};
};
exports.generateTreatyRenewal = generateTreatyRenewal;
// ============================================================================
// 11. REPORTING AND ANALYTICS
// ============================================================================
/**
 * 37. Generates reinsurance accounting report.
 *
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ cededPremium: number; commission: number; recoverables: number; netPosition: number }>}
 *
 * @example
 * ```typescript
 * const report = await generateReinsuranceAccountingReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
const generateReinsuranceAccountingReport = async (periodStart, periodEnd) => {
    return {
        cededPremium: 0,
        commission: 0,
        recoverables: 0,
        netPosition: 0,
    };
};
exports.generateReinsuranceAccountingReport = generateReinsuranceAccountingReport;
/**
 * 38. Generates statutory schedule F.
 *
 * @param {number} year - Reporting year
 * @returns {Promise<any>} Schedule F data
 *
 * @example
 * ```typescript
 * const scheduleF = await generateStatutoryScheduleF(2024);
 * ```
 */
const generateStatutoryScheduleF = async (year) => {
    return {};
};
exports.generateStatutoryScheduleF = generateStatutoryScheduleF;
/**
 * 39. Calculates reinsurance leverage ratio.
 *
 * @param {number} cededPremium - Ceded premium
 * @param {number} netPremium - Net premium written
 * @returns {number} Leverage ratio
 *
 * @example
 * ```typescript
 * const leverage = calculateReinsuranceLeverageRatio(15000000, 50000000);
 * console.log('Leverage ratio:', leverage); // 0.30
 * ```
 */
const calculateReinsuranceLeverageRatio = (cededPremium, netPremium) => {
    return new decimal_js_1.default(cededPremium).div(netPremium).toNumber();
};
exports.calculateReinsuranceLeverageRatio = calculateReinsuranceLeverageRatio;
// ============================================================================
// 12. COLLECTIBILITY ASSESSMENT
// ============================================================================
/**
 * 40. Performs collectibility assessment.
 *
 * @param {string} reinsurerId - Reinsurer ID
 * @returns {Promise<CollectibilityAssessment>} Assessment
 *
 * @example
 * ```typescript
 * const assessment = await performCollectibilityAssessment('reinsurer-123');
 * console.log('Risk category:', assessment.riskCategory);
 * ```
 */
const performCollectibilityAssessment = async (reinsurerId) => {
    return {
        reinsurerId,
        assessmentDate: new Date(),
        currentRating: 'A',
        outstandingRecoverables: 0,
        overdueRecoverables: 0,
        collectionRate90Days: 0,
        disputeRate: 0,
        riskScore: 0,
        riskCategory: 'low',
        allowanceForDoubtfulAccounts: 0,
        allowancePct: 0,
        watchList: false,
        nextReviewDate: (0, date_fns_1.addMonths)(new Date(), 3),
    };
};
exports.performCollectibilityAssessment = performCollectibilityAssessment;
/**
 * 41. Calculates allowance for uncollectible reinsurance.
 *
 * @param {number} outstandingRecoverables - Outstanding recoverables
 * @param {ReinsurerRating} rating - Reinsurer rating
 * @param {number} overdueAmount - Overdue amount
 * @returns {number} Allowance amount
 *
 * @example
 * ```typescript
 * const allowance = calculateUncollectibleAllowance(5000000, 'BBB', 500000);
 * ```
 */
const calculateUncollectibleAllowance = (outstandingRecoverables, rating, overdueAmount) => {
    const ratingFactors = {
        AAA: 0.01,
        'AA+': 0.01,
        AA: 0.02,
        'AA-': 0.02,
        'A+': 0.03,
        A: 0.05,
        'A-': 0.07,
        'BBB+': 0.10,
        BBB: 0.15,
        'BBB-': 0.20,
        Below_Investment_Grade: 0.50,
    };
    const baseFactor = ratingFactors[rating] || 0.20;
    const baseAllowance = new decimal_js_1.default(outstandingRecoverables).times(baseFactor);
    const overdueAllowance = new decimal_js_1.default(overdueAmount).times(0.50);
    return baseAllowance.plus(overdueAllowance).toNumber();
};
exports.calculateUncollectibleAllowance = calculateUncollectibleAllowance;
/**
 * 42. Monitors unauthorized reinsurance.
 *
 * @param {string} reinsurerId - Reinsurer ID
 * @returns {Promise<{ authorized: boolean; collateralRequired: number; collateralPosted: number }>}
 *
 * @example
 * ```typescript
 * const status = await monitorUnauthorizedReinsurance('reinsurer-123');
 * if (!status.authorized) console.log('Collateral required:', status.collateralRequired);
 * ```
 */
const monitorUnauthorizedReinsurance = async (reinsurerId) => {
    return {
        authorized: true,
        collateralRequired: 0,
        collateralPosted: 0,
    };
};
exports.monitorUnauthorizedReinsurance = monitorUnauthorizedReinsurance;
// ============================================================================
// 13. ADDITIONAL FUNCTIONS
// ============================================================================
/**
 * 43. Validates treaty terms.
 *
 * @param {ReinsuranceTreaty} treaty - Treaty to validate
 * @returns {string[]} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateTreatyTerms(treaty);
 * if (errors.length > 0) console.error('Validation errors:', errors);
 * ```
 */
const validateTreatyTerms = (treaty) => {
    const errors = [];
    if (!treaty.treatyNumber) {
        errors.push('Treaty number is required');
    }
    if ((0, date_fns_1.isBefore)(treaty.expirationDate, treaty.effectiveDate)) {
        errors.push('Expiration date must be after effective date');
    }
    if (!(0, exports.validateParticipationPercentages)(treaty.reinsurerParticipations)) {
        errors.push('Reinsurer participations must sum to 100%');
    }
    return errors;
};
exports.validateTreatyTerms = validateTreatyTerms;
/**
 * 44. Calculates net retention.
 *
 * @param {number} policyLimit - Policy limit
 * @param {number} quotaShareCeded - Quota share ceded amount
 * @param {number} excessCeded - Excess ceded amount
 * @returns {number} Net retention
 *
 * @example
 * ```typescript
 * const retention = calculateNetRetention(10000000, 3000000, 5000000);
 * console.log('Net retention:', retention); // 2000000
 * ```
 */
const calculateNetRetention = (policyLimit, quotaShareCeded, excessCeded) => {
    return new decimal_js_1.default(policyLimit).minus(quotaShareCeded).minus(excessCeded).toNumber();
};
exports.calculateNetRetention = calculateNetRetention;
/**
 * 45. Generates treaty performance metrics.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ lossRatio: number; combinedRatio: number; profitMargin: number }>}
 *
 * @example
 * ```typescript
 * const metrics = await generateTreatyPerformanceMetrics(
 *   treatyId,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
const generateTreatyPerformanceMetrics = async (treatyId, periodStart, periodEnd) => {
    return {
        lossRatio: 0,
        combinedRatio: 0,
        profitMargin: 0,
    };
};
exports.generateTreatyPerformanceMetrics = generateTreatyPerformanceMetrics;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    loadReinsuranceConfig: exports.loadReinsuranceConfig,
    validateReinsuranceConfig: exports.validateReinsuranceConfig,
    // Models
    createReinsuranceTreatyModel: exports.createReinsuranceTreatyModel,
    createFacultativeCertificateModel: exports.createFacultativeCertificateModel,
    // Treaty Management
    createReinsuranceTreaty: exports.createReinsuranceTreaty,
    updateReinsuranceTreaty: exports.updateReinsuranceTreaty,
    addReinsurerParticipation: exports.addReinsurerParticipation,
    validateParticipationPercentages: exports.validateParticipationPercentages,
    getActiveTreatiesByType: exports.getActiveTreatiesByType,
    // Facultative Placement
    createFacultativeCertificate: exports.createFacultativeCertificate,
    submitFacultativeQuote: exports.submitFacultativeQuote,
    bindFacultativeCoverage: exports.bindFacultativeCoverage,
    calculateFacultativePremiumAllocation: exports.calculateFacultativePremiumAllocation,
    // Premium Calculations
    calculateQuotaShareCededPremium: exports.calculateQuotaShareCededPremium,
    calculateSurplusCededPremium: exports.calculateSurplusCededPremium,
    calculateExcessOfLossPremium: exports.calculateExcessOfLossPremium,
    applySwingRatingAdjustment: exports.applySwingRatingAdjustment,
    calculateReinstatementPremium: exports.calculateReinstatementPremium,
    // Ceding Commission
    calculateFlatCedingCommission: exports.calculateFlatCedingCommission,
    calculateSlidingScaleCommission: exports.calculateSlidingScaleCommission,
    calculateProfitCommission: exports.calculateProfitCommission,
    calculateContingentCommission: exports.calculateContingentCommission,
    // Recoverables
    createReinsuranceRecoverable: exports.createReinsuranceRecoverable,
    calculateQuotaShareRecoverable: exports.calculateQuotaShareRecoverable,
    calculateExcessOfLossRecoverable: exports.calculateExcessOfLossRecoverable,
    allocateRecoverableToReinsurers: exports.allocateRecoverableToReinsurers,
    updateRecoverableStatus: exports.updateRecoverableStatus,
    // Loss Notifications
    sendLossNotification: exports.sendLossNotification,
    generateCatastropheLossReport: exports.generateCatastropheLossReport,
    // Bordereau Processing
    createPremiumBordereau: exports.createPremiumBordereau,
    createLossBordereau: exports.createLossBordereau,
    submitBordereau: exports.submitBordereau,
    reconcileBordereauPayment: exports.reconcileBordereauPayment,
    // Retrocession
    createRetrocessionProgram: exports.createRetrocessionProgram,
    calculateRetrocessionPremium: exports.calculateRetrocessionPremium,
    // Capacity Planning
    analyzeReinsuranceCapacity: exports.analyzeReinsuranceCapacity,
    calculateAggregateExcessAttachment: exports.calculateAggregateExcessAttachment,
    optimizeRetentionLevel: exports.optimizeRetentionLevel,
    // Treaty Renewals
    identifyExpiringTreaties: exports.identifyExpiringTreaties,
    generateTreatyRenewal: exports.generateTreatyRenewal,
    // Reporting
    generateReinsuranceAccountingReport: exports.generateReinsuranceAccountingReport,
    generateStatutoryScheduleF: exports.generateStatutoryScheduleF,
    calculateReinsuranceLeverageRatio: exports.calculateReinsuranceLeverageRatio,
    // Collectibility
    performCollectibilityAssessment: exports.performCollectibilityAssessment,
    calculateUncollectibleAllowance: exports.calculateUncollectibleAllowance,
    monitorUnauthorizedReinsurance: exports.monitorUnauthorizedReinsurance,
    // Additional
    validateTreatyTerms: exports.validateTreatyTerms,
    calculateNetRetention: exports.calculateNetRetention,
    generateTreatyPerformanceMetrics: exports.generateTreatyPerformanceMetrics,
};
//# sourceMappingURL=reinsurance-management-kit.js.map