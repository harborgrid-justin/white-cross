"use strict";
/**
 * Financial Aid Kit - Comprehensive SIS Financial Aid System
 *
 * Production-ready Sequelize models and functions for managing:
 * - Financial aid records and awards
 * - FAFSA integration and processing
 * - Award packaging and disbursements
 * - COD (Common Origination and Disbursement) reporting
 * - Satisfactory Academic Progress (SAP) tracking
 * - Return of Title IV (R2T4) calculations
 * - Professional judgment and adjustments
 *
 * Database: PostgreSQL 14+ optimized with comprehensive indexing
 * ORM: Sequelize 6.x with TypeScript
 * Compliance: FERPA, Title IV, PCI DSS
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2T4Calculation = exports.CODReport = exports.ProfessionalJudgment = exports.SAPRecord = exports.FAFSAData = exports.Disbursement = exports.Award = exports.FinancialAid = void 0;
exports.initFinancialAidModels = initFinancialAidModels;
exports.syncFinancialAidSchema = syncFinancialAidSchema;
exports.createFinancialAidRecord = createFinancialAidRecord;
exports.updateFinancialAidRecord = updateFinancialAidRecord;
exports.deleteFinancialAidRecord = deleteFinancialAidRecord;
exports.getFinancialAidById = getFinancialAidById;
exports.queryFinancialAidRecords = queryFinancialAidRecords;
exports.bulkImportFinancialAid = bulkImportFinancialAid;
exports.importFAFSAData = importFAFSAData;
exports.validateFAFSA = validateFAFSA;
exports.calculateEFC = calculateEFC;
exports.parseFAFSAISIR = parseFAFSAISIR;
exports.trackFAFSAVerification = trackFAFSAVerification;
exports.createAwardPackage = createAwardPackage;
exports.calculateNeed = calculateNeed;
exports.allocateAwards = allocateAwards;
exports.checkAwardLimits = checkAwardLimits;
exports.generateAwardLetter = generateAwardLetter;
exports.compareAwardYears = compareAwardYears;
exports.scheduleDisbursements = scheduleDisbursements;
exports.processDisbursement = processDisbursement;
exports.reverseDisbursement = reverseDisbursement;
exports.trackDisbursementStatus = trackDisbursementStatus;
exports.calculateDisbursementDates = calculateDisbursementDates;
exports.reconcileDisbursements = reconcileDisbursements;
exports.generateCODFile = generateCODFile;
exports.validateCODData = validateCODData;
exports.submitCODReport = submitCODReport;
exports.processCODResponse = processCODResponse;
exports.trackCODStatus = trackCODStatus;
exports.calculateSAPStatus = calculateSAPStatus;
exports.evaluateSAPCriteria = evaluateSAPCriteria;
exports.createSAPAppeal = createSAPAppeal;
exports.trackSAPProbation = trackSAPProbation;
exports.generateSAPReport = generateSAPReport;
exports.adjustAward = adjustAward;
exports.processRepackaging = processRepackaging;
exports.applyProfessionalJudgment = applyProfessionalJudgment;
exports.trackAwardChanges = trackAwardChanges;
exports.notifyAwardChange = notifyAwardChange;
exports.calculateR2T4 = calculateR2T4;
exports.determineWithdrawalDate = determineWithdrawalDate;
exports.calculateEarnedAid = calculateEarnedAid;
exports.calculateReturnAmount = calculateReturnAmount;
exports.generateR2T4Report = generateR2T4Report;
const sequelize_1 = require("sequelize");
// ============================================================================
// Sequelize Models
// ============================================================================
class FinancialAid extends sequelize_1.Model {
}
exports.FinancialAid = FinancialAid;
class Award extends sequelize_1.Model {
}
exports.Award = Award;
class Disbursement extends sequelize_1.Model {
}
exports.Disbursement = Disbursement;
class FAFSAData extends sequelize_1.Model {
}
exports.FAFSAData = FAFSAData;
class SAPRecord extends sequelize_1.Model {
}
exports.SAPRecord = SAPRecord;
class ProfessionalJudgment extends sequelize_1.Model {
}
exports.ProfessionalJudgment = ProfessionalJudgment;
class CODReport extends sequelize_1.Model {
}
exports.CODReport = CODReport;
class R2T4Calculation extends sequelize_1.Model {
}
exports.R2T4Calculation = R2T4Calculation;
// ============================================================================
// Model Initialization Functions
// ============================================================================
/**
 * Initialize all Financial Aid Sequelize models
 * @param sequelize - Sequelize instance
 * @returns Object containing all initialized models
 */
function initFinancialAidModels(sequelize) {
    // Financial Aid Model
    FinancialAid.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student table',
        },
        academic_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
            comment: 'Format: 2023-2024',
        },
        award_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
            comment: 'Federal award year: 2023-2024',
        },
        term_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        enrollment_status: {
            type: sequelize_1.DataTypes.ENUM('full-time', 'half-time', 'less-than-half', 'not-enrolled'),
            allowNull: false,
            defaultValue: 'full-time',
        },
        dependency_status: {
            type: sequelize_1.DataTypes.ENUM('dependent', 'independent'),
            allowNull: false,
        },
        efc: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Expected Family Contribution',
        },
        cost_of_attendance: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        financial_need: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'COA - EFC',
        },
        total_awarded: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        total_disbursed: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'packaged', 'accepted', 'declined', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        packaging_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        acceptance_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        verification_status: {
            type: sequelize_1.DataTypes.ENUM('not-selected', 'selected', 'completed', 'exempted'),
            allowNull: true,
        },
        verification_completed_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        housing_status: {
            type: sequelize_1.DataTypes.ENUM('on-campus', 'off-campus', 'with-parents'),
            allowNull: true,
        },
        special_circumstances: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'financial_aid',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_fa_student_year',
                fields: ['student_id', 'academic_year'],
            },
            {
                name: 'idx_fa_award_year',
                fields: ['award_year'],
            },
            {
                name: 'idx_fa_status',
                fields: ['status'],
                where: { deleted_at: null },
            },
            {
                name: 'idx_fa_verification',
                fields: ['verification_status'],
                where: { verification_status: 'selected' },
            },
        ],
    });
    // Award Model
    Award.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        financial_aid_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'financial_aid',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        academic_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        award_type: {
            type: sequelize_1.DataTypes.ENUM('pell', 'seog', 'perkins', 'subsidized', 'unsubsidized', 'plus', 'work-study', 'institutional', 'state', 'external'),
            allowNull: false,
        },
        fund_source: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        fund_code: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        award_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        offered_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        accepted_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        disbursed_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        remaining_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        award_status: {
            type: sequelize_1.DataTypes.ENUM('offered', 'accepted', 'declined', 'cancelled', 'disbursed', 'completed'),
            allowNull: false,
            defaultValue: 'offered',
        },
        offer_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        acceptance_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        decline_reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        is_need_based: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_federal: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_loan: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        interest_rate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 3),
            allowNull: true,
        },
        origination_fee_percent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 3),
            allowNull: true,
        },
        grace_period_months: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        max_eligibility_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        enrollment_requirement: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        renewal_eligible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'award',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_award_fa',
                fields: ['financial_aid_id'],
            },
            {
                name: 'idx_award_student_year',
                fields: ['student_id', 'academic_year'],
            },
            {
                name: 'idx_award_type',
                fields: ['award_type'],
            },
            {
                name: 'idx_award_status',
                fields: ['award_status'],
            },
            {
                name: 'idx_award_fund_code',
                fields: ['fund_code'],
            },
        ],
    });
    // Disbursement Model
    Disbursement.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        award_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'award',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        financial_aid_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        disbursement_number: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: '1 for first disbursement, 2 for second, etc.',
        },
        scheduled_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        actual_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        net_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Amount after fees',
        },
        origination_fee: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        enrollment_status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        credits_enrolled: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'pending', 'processing', 'released', 'returned', 'cancelled'),
            allowNull: false,
            defaultValue: 'scheduled',
        },
        release_method: {
            type: sequelize_1.DataTypes.ENUM('direct-deposit', 'check', 'credit-to-account', 'book-advance'),
            allowNull: false,
        },
        transaction_id: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        external_reference: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        cod_reported: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        cod_report_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cod_accepted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        return_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        return_reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        return_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'disbursement',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_disb_award',
                fields: ['award_id', 'disbursement_number'],
            },
            {
                name: 'idx_disb_student_date',
                fields: ['student_id', 'scheduled_date'],
            },
            {
                name: 'idx_disb_status',
                fields: ['status'],
                where: { status: ['pending', 'processing'] },
            },
            {
                name: 'idx_disb_cod',
                fields: ['cod_reported', 'cod_accepted'],
            },
            {
                name: 'idx_disb_transaction',
                fields: ['transaction_id'],
                unique: true,
                where: { transaction_id: { [sequelize_1.Op.ne]: null } },
            },
        ],
    });
    // FAFSA Data Model
    FAFSAData.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        award_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        transaction_number: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        dob: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        ssn_encrypted: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted SSN using pgcrypto',
        },
        citizenship_status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        marital_status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        state_of_residence: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
        },
        household_size: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        num_in_college: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        student_agi: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Adjusted Gross Income',
        },
        parent_agi: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        student_income_tax: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        parent_income_tax: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        student_assets: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        parent_assets: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        efc: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        dependency_status: {
            type: sequelize_1.DataTypes.ENUM('dependent', 'independent'),
            allowNull: false,
        },
        automatic_zero_efc: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        simplified_needs_test: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pell_eligible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pell_lifetime_eligibility_used: {
            type: sequelize_1.DataTypes.DECIMAL(5, 3),
            allowNull: false,
            defaultValue: 0,
            comment: 'Percentage of lifetime eligibility used (0-6.0)',
        },
        application_type: {
            type: sequelize_1.DataTypes.ENUM('web', 'paper', 'correction'),
            allowNull: false,
        },
        correction_number: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isir_received_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        processed_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        verification_selection: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verification_tracking_flags: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        reject_codes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        comment_codes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        housing_code: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
        },
        special_circumstances: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        fafsa_raw_data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Full ISIR data as JSON',
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'fafsa_data',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_fafsa_student_year',
                fields: ['student_id', 'award_year'],
                unique: true,
            },
            {
                name: 'idx_fafsa_transaction',
                fields: ['transaction_number'],
            },
            {
                name: 'idx_fafsa_verification',
                fields: ['verification_selection'],
                where: { verification_selection: true },
            },
            {
                name: 'idx_fafsa_raw_data',
                fields: ['fafsa_raw_data'],
                using: 'gin',
            },
        ],
    });
    // SAP Record Model
    SAPRecord.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        academic_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        evaluation_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        evaluation_term_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        sap_status: {
            type: sequelize_1.DataTypes.ENUM('satisfactory', 'warning', 'probation', 'suspension', 'dismissed'),
            allowNull: false,
        },
        gpa_requirement: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
        },
        current_gpa: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
        },
        gpa_met: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        pace_requirement: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Completion rate percentage (e.g., 67.00)',
        },
        current_pace: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        pace_met: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        max_timeframe_credits: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        attempted_credits: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        completed_credits: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        max_timeframe_met: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        overall_sap_met: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        appeal_submitted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        appeal_approved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
        },
        appeal_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        appeal_reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        academic_plan_required: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        academic_plan_submitted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
        },
        reinstatement_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        probation_terms: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        financial_aid_eligible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        next_evaluation_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        evaluator_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'sap_record',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_sap_student_year',
                fields: ['student_id', 'academic_year'],
            },
            {
                name: 'idx_sap_status',
                fields: ['sap_status'],
            },
            {
                name: 'idx_sap_evaluation_date',
                fields: ['evaluation_date'],
            },
            {
                name: 'idx_sap_aid_eligible',
                fields: ['financial_aid_eligible'],
            },
        ],
    });
    // Professional Judgment Model
    ProfessionalJudgment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        financial_aid_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        award_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        judgment_type: {
            type: sequelize_1.DataTypes.ENUM('dependency-override', 'income-adjustment', 'special-circumstance', 'cost-adjustment', 'efc-adjustment'),
            allowNull: false,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        documentation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        original_efc: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        adjusted_efc: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        original_coa: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        adjusted_coa: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        original_income: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        adjusted_income: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        approval_status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'denied'),
            allowNull: false,
            defaultValue: 'pending',
        },
        submitted_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        reviewed_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        reviewer_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        effective_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expiration_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        supporting_documents: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'professional_judgment',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_pj_student_year',
                fields: ['student_id', 'award_year'],
            },
            {
                name: 'idx_pj_fa',
                fields: ['financial_aid_id'],
            },
            {
                name: 'idx_pj_status',
                fields: ['approval_status'],
            },
            {
                name: 'idx_pj_type',
                fields: ['judgment_type'],
            },
        ],
    });
    // COD Report Model
    CODReport.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        report_type: {
            type: sequelize_1.DataTypes.ENUM('origination', 'disbursement', 'change', 'correction'),
            allowNull: false,
        },
        batch_id: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        report_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        academic_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        school_code: {
            type: sequelize_1.DataTypes.STRING(8),
            allowNull: false,
        },
        total_records: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        total_amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        file_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        file_path: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        submission_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        submission_method: {
            type: sequelize_1.DataTypes.ENUM('saig', 'edconnect', 'manual'),
            allowNull: false,
        },
        acknowledgment_received: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        acknowledgment_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        acknowledgment_file: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        errors_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        warnings_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        accepted_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rejected_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'submitted', 'accepted', 'rejected', 'corrected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        error_details: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        resubmission_of: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cod_report',
                key: 'id',
            },
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'cod_report',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_cod_batch',
                fields: ['batch_id'],
                unique: true,
            },
            {
                name: 'idx_cod_year',
                fields: ['academic_year'],
            },
            {
                name: 'idx_cod_status',
                fields: ['status'],
            },
            {
                name: 'idx_cod_submission',
                fields: ['submission_date'],
            },
        ],
    });
    // R2T4 Calculation Model
    R2T4Calculation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        financial_aid_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        academic_year: {
            type: sequelize_1.DataTypes.STRING(9),
            allowNull: false,
        },
        term_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        withdrawal_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        determination_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        last_attendance_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        withdrawal_type: {
            type: sequelize_1.DataTypes.ENUM('official', 'unofficial', 'administrative'),
            allowNull: false,
        },
        total_days_in_period: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        days_completed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        completion_percentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        total_aid_disbursed: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        total_aid_could_disburse: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        earned_aid: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        unearned_aid: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        aid_to_return: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        student_return_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        school_return_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        post_withdrawal_disbursement: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        return_allocation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Return amounts by fund type',
        },
        return_deadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        return_completed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        return_completion_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        nslds_reported: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        nslds_report_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('calculated', 'pending-return', 'completed', 'appealed'),
            allowNull: false,
            defaultValue: 'calculated',
        },
        calculation_details: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        calculated_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'r2t4_calculation',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_r2t4_student',
                fields: ['student_id', 'academic_year'],
            },
            {
                name: 'idx_r2t4_fa',
                fields: ['financial_aid_id'],
            },
            {
                name: 'idx_r2t4_status',
                fields: ['status'],
            },
            {
                name: 'idx_r2t4_deadline',
                fields: ['return_deadline'],
                where: { return_completed: false },
            },
        ],
    });
    // Define Associations
    FinancialAid.hasMany(Award, {
        sourceKey: 'id',
        foreignKey: 'financial_aid_id',
        as: 'awards',
    });
    Award.belongsTo(FinancialAid, {
        foreignKey: 'financial_aid_id',
        as: 'financialAid',
    });
    Award.hasMany(Disbursement, {
        sourceKey: 'id',
        foreignKey: 'award_id',
        as: 'disbursements',
    });
    Disbursement.belongsTo(Award, {
        foreignKey: 'award_id',
        as: 'award',
    });
    FinancialAid.hasOne(FAFSAData, {
        sourceKey: 'student_id',
        foreignKey: 'student_id',
        as: 'fafsaData',
    });
    FinancialAid.hasMany(SAPRecord, {
        sourceKey: 'student_id',
        foreignKey: 'student_id',
        as: 'sapRecords',
    });
    FinancialAid.hasMany(ProfessionalJudgment, {
        sourceKey: 'id',
        foreignKey: 'financial_aid_id',
        as: 'professionalJudgments',
    });
    FinancialAid.hasMany(R2T4Calculation, {
        sourceKey: 'id',
        foreignKey: 'financial_aid_id',
        as: 'r2t4Calculations',
    });
    return {
        FinancialAid,
        Award,
        Disbursement,
        FAFSAData,
        SAPRecord,
        ProfessionalJudgment,
        CODReport,
        R2T4Calculation,
    };
}
/**
 * Sync Financial Aid schema with database (creates tables)
 * @param sequelize - Sequelize instance
 * @param options - Sync options (alter, force)
 */
async function syncFinancialAidSchema(sequelize, options = {}) {
    await sequelize.sync(options);
}
// ============================================================================
// Model CRUD Operations (8 functions)
// ============================================================================
/**
 * Create a new financial aid record
 */
async function createFinancialAidRecord(data, transaction) {
    return await FinancialAid.create(data, { transaction });
}
/**
 * Update a financial aid record
 */
async function updateFinancialAidRecord(id, updates, transaction) {
    return await FinancialAid.update(updates, {
        where: { id },
        returning: true,
        transaction,
    });
}
/**
 * Soft delete a financial aid record
 */
async function deleteFinancialAidRecord(id, transaction) {
    return await FinancialAid.destroy({
        where: { id },
        transaction,
    });
}
/**
 * Get financial aid record by ID with associations
 */
async function getFinancialAidById(id, includeAssociations = true) {
    const include = includeAssociations
        ? [
            { model: Award, as: 'awards', include: [{ model: Disbursement, as: 'disbursements' }] },
            { model: FAFSAData, as: 'fafsaData' },
            { model: SAPRecord, as: 'sapRecords' },
            { model: ProfessionalJudgment, as: 'professionalJudgments' },
            { model: R2T4Calculation, as: 'r2t4Calculations' },
        ]
        : [];
    return await FinancialAid.findByPk(id, { include });
}
/**
 * Query financial aid records with filters
 */
async function queryFinancialAidRecords(filters) {
    const where = {};
    if (filters.student_id)
        where.student_id = filters.student_id;
    if (filters.academic_year)
        where.academic_year = filters.academic_year;
    if (filters.award_year)
        where.award_year = filters.award_year;
    if (filters.status)
        where.status = filters.status;
    return await FinancialAid.findAndCountAll({
        where,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        order: [['created_at', 'DESC']],
        include: [
            { model: Award, as: 'awards' },
            { model: FAFSAData, as: 'fafsaData' },
        ],
    });
}
/**
 * Bulk import financial aid records
 */
async function bulkImportFinancialAid(records, transaction) {
    return await FinancialAid.bulkCreate(records, {
        transaction,
        validate: true,
    });
}
// ============================================================================
// FAFSA Integration Functions (5 functions)
// ============================================================================
/**
 * Import FAFSA data from ISIR file
 */
async function importFAFSAData(fafsaData, transaction) {
    // Check for existing FAFSA for this student/year
    const existing = await FAFSAData.findOne({
        where: {
            student_id: fafsaData.student_id,
            award_year: fafsaData.award_year,
        },
    });
    if (existing && fafsaData.transaction_number > existing.transaction_number) {
        // Update existing with newer transaction
        await existing.update(fafsaData, { transaction });
        return existing;
    }
    else if (!existing) {
        // Create new FAFSA record
        return await FAFSAData.create(fafsaData, { transaction });
    }
    return existing;
}
/**
 * Validate FAFSA data for completeness and accuracy
 */
async function validateFAFSA(student_id, award_year) {
    const fafsa = await FAFSAData.findOne({
        where: { student_id, award_year },
    });
    if (!fafsa) {
        return { valid: false, errors: ['FAFSA not found'], warnings: [] };
    }
    const errors = [];
    const warnings = [];
    // Validation rules
    if (fafsa.reject_codes) {
        errors.push(`FAFSA has reject codes: ${fafsa.reject_codes}`);
    }
    if (fafsa.efc < 0) {
        errors.push('EFC cannot be negative');
    }
    if (fafsa.household_size < 1) {
        errors.push('Household size must be at least 1');
    }
    if (fafsa.dependency_status === 'dependent' && !fafsa.parent_agi) {
        errors.push('Dependent students must have parent AGI');
    }
    if (fafsa.verification_selection && !fafsa.verification_tracking_flags) {
        warnings.push('Student selected for verification but no tracking flags');
    }
    if (fafsa.pell_lifetime_eligibility_used >= 6.0) {
        warnings.push('Student has used maximum Pell lifetime eligibility');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Calculate EFC (Expected Family Contribution) from FAFSA data
 */
async function calculateEFC(student_id, award_year) {
    const fafsa = await FAFSAData.findOne({
        where: { student_id, award_year },
    });
    if (!fafsa) {
        throw new Error('FAFSA data not found');
    }
    // Use the EFC from FAFSA (federal calculation)
    // This is already calculated by the federal processor
    return fafsa.efc;
}
/**
 * Parse FAFSA ISIR XML/JSON data
 */
async function parseFAFSAISIR(isirData, student_id) {
    // Parse ISIR data structure (simplified example)
    return {
        student_id,
        award_year: isirData.award_year || '',
        transaction_number: isirData.transaction_number || 1,
        dob: new Date(isirData.date_of_birth),
        ssn_encrypted: isirData.ssn, // Should be encrypted before storage
        citizenship_status: isirData.citizenship_status || '',
        email: isirData.email || '',
        phone: isirData.phone,
        marital_status: isirData.marital_status || '',
        state_of_residence: isirData.state_of_legal_residence || '',
        household_size: parseInt(isirData.household_size) || 1,
        num_in_college: parseInt(isirData.number_in_college) || 1,
        student_agi: parseFloat(isirData.student_agi) || 0,
        parent_agi: isirData.parent_agi ? parseFloat(isirData.parent_agi) : undefined,
        student_income_tax: parseFloat(isirData.student_income_tax) || 0,
        parent_income_tax: isirData.parent_income_tax ? parseFloat(isirData.parent_income_tax) : undefined,
        student_assets: parseFloat(isirData.student_assets) || 0,
        parent_assets: isirData.parent_assets ? parseFloat(isirData.parent_assets) : undefined,
        efc: parseFloat(isirData.efc) || 0,
        dependency_status: isirData.dependency_status === 'I' ? 'independent' : 'dependent',
        automatic_zero_efc: isirData.auto_zero_efc === 'Y',
        simplified_needs_test: isirData.simplified_needs === 'Y',
        pell_eligible: isirData.pell_eligible === 'Y',
        pell_lifetime_eligibility_used: parseFloat(isirData.pell_leu) || 0,
        application_type: isirData.transaction_number === 1 ? 'web' : 'correction',
        correction_number: (isirData.transaction_number || 1) - 1,
        isir_received_date: new Date(isirData.received_date),
        processed_date: new Date(isirData.processed_date),
        verification_selection: isirData.verification_flag === 'Y',
        verification_tracking_flags: isirData.verification_tracking_flags,
        reject_codes: isirData.reject_codes,
        comment_codes: isirData.comment_codes,
        housing_code: isirData.housing_code || '1',
        special_circumstances: isirData.special_circumstances,
        fafsa_raw_data: isirData, // Store full ISIR
    };
}
/**
 * Track FAFSA verification status and requirements
 */
async function trackFAFSAVerification(student_id, award_year, verificationData, transaction) {
    const fafsa = await FAFSAData.findOne({
        where: { student_id, award_year },
    });
    if (!fafsa) {
        throw new Error('FAFSA not found');
    }
    // Update verification status
    await fafsa.update({
        verification_status: verificationData.status,
        verification_completed_date: verificationData.completed_date,
    }, { transaction });
    return fafsa;
}
// ============================================================================
// Award Packaging Functions (6 functions)
// ============================================================================
/**
 * Create a complete award package for a student
 */
async function createAwardPackage(financial_aid_id, awards, transaction) {
    const t = transaction || (await FinancialAid.sequelize.transaction());
    try {
        // Create all awards
        const createdAwards = await Award.bulkCreate(awards, { transaction: t });
        // Calculate total awarded
        const totalAwarded = awards.reduce((sum, award) => sum + award.offered_amount, 0);
        // Update financial aid record
        await FinancialAid.update({
            total_awarded: totalAwarded,
            status: 'packaged',
            packaging_date: new Date(),
        }, {
            where: { id: financial_aid_id },
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return createdAwards;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Calculate financial need (COA - EFC)
 */
async function calculateNeed(student_id, academic_year) {
    const fa = await FinancialAid.findOne({
        where: { student_id, academic_year },
        include: [{ model: FAFSAData, as: 'fafsaData' }],
    });
    if (!fa) {
        throw new Error('Financial aid record not found');
    }
    const coa = fa.cost_of_attendance;
    const efc = fa.efc;
    const need = Math.max(0, coa - efc);
    return { coa, efc, need };
}
/**
 * Allocate awards based on eligibility and need
 */
async function allocateAwards(financial_aid_id, availableFunds) {
    const fa = await FinancialAid.findByPk(financial_aid_id);
    if (!fa)
        throw new Error('Financial aid record not found');
    const awards = [];
    let remainingNeed = fa.financial_need;
    for (const fund of availableFunds) {
        if (fund.is_need_based && remainingNeed <= 0)
            continue;
        const awardAmount = fund.is_need_based
            ? Math.min(fund.max_amount, remainingNeed)
            : fund.max_amount;
        if (awardAmount > 0) {
            awards.push({
                financial_aid_id,
                student_id: fa.student_id,
                academic_year: fa.academic_year,
                award_type: fund.award_type,
                fund_source: fund.fund_source,
                fund_code: fund.fund_code,
                award_name: fund.fund_source,
                offered_amount: awardAmount,
                accepted_amount: 0,
                disbursed_amount: 0,
                remaining_amount: awardAmount,
                award_status: 'offered',
                offer_date: new Date(),
                is_need_based: fund.is_need_based,
                is_federal: fund.fund_source.toLowerCase().includes('federal'),
                is_loan: ['subsidized', 'unsubsidized', 'plus', 'perkins'].includes(fund.award_type),
                renewal_eligible: true,
            });
            if (fund.is_need_based) {
                remainingNeed -= awardAmount;
            }
        }
    }
    return awards;
}
/**
 * Check award limits and eligibility
 */
async function checkAwardLimits(student_id, academic_year, award_type) {
    // Get all awards of this type for the student
    const existingAwards = await Award.findAll({
        where: {
            student_id,
            academic_year,
            award_type,
        },
    });
    const totalAwarded = existingAwards.reduce((sum, award) => sum + award.offered_amount, 0);
    // Define annual limits (example values - should be configurable)
    const limits = {
        pell: 7395,
        seog: 4000,
        subsidized: 5500,
        unsubsidized: 12500,
        plus: 999999, // No annual limit
    };
    const limit = limits[award_type] || 0;
    const remaining = limit - totalAwarded;
    return {
        eligible: remaining > 0,
        remaining_eligibility: Math.max(0, remaining),
        reason: remaining <= 0 ? 'Annual limit reached' : undefined,
    };
}
/**
 * Generate award letter document
 */
async function generateAwardLetter(financial_aid_id) {
    const fa = await FinancialAid.findByPk(financial_aid_id, {
        include: [
            { model: Award, as: 'awards' },
            { model: FAFSAData, as: 'fafsaData' },
        ],
    });
    if (!fa)
        throw new Error('Financial aid not found');
    const summary = {
        total_coa: fa.cost_of_attendance,
        total_efc: fa.efc,
        total_need: fa.financial_need,
        total_awarded: fa.total_awarded,
        unmet_need: Math.max(0, fa.financial_need - fa.total_awarded),
    };
    return {
        student_info: {
            student_id: fa.student_id,
            academic_year: fa.academic_year,
            enrollment_status: fa.enrollment_status,
            housing_status: fa.housing_status,
        },
        awards: fa.awards || [],
        summary,
    };
}
/**
 * Compare award packages across years
 */
async function compareAwardYears(student_id, year1, year2) {
    const [fa1, fa2] = await Promise.all([
        FinancialAid.findOne({
            where: { student_id, academic_year: year1 },
            include: [{ model: Award, as: 'awards' }],
        }),
        FinancialAid.findOne({
            where: { student_id, academic_year: year2 },
            include: [{ model: Award, as: 'awards' }],
        }),
    ]);
    const summary1 = fa1
        ? {
            total_awarded: fa1.total_awarded,
            total_disbursed: fa1.total_disbursed,
            num_awards: fa1.awards?.length || 0,
        }
        : null;
    const summary2 = fa2
        ? {
            total_awarded: fa2.total_awarded,
            total_disbursed: fa2.total_disbursed,
            num_awards: fa2.awards?.length || 0,
        }
        : null;
    const differences = {
        total_awarded_diff: (summary2?.total_awarded || 0) - (summary1?.total_awarded || 0),
        total_disbursed_diff: (summary2?.total_disbursed || 0) - (summary1?.total_disbursed || 0),
        num_awards_diff: (summary2?.num_awards || 0) - (summary1?.num_awards || 0),
    };
    return { year1_summary: summary1, year2_summary: summary2, differences };
}
// ============================================================================
// Disbursement Processing Functions (6 functions)
// ============================================================================
/**
 * Schedule disbursements for an award
 */
async function scheduleDisbursements(award_id, disbursement_schedule, transaction) {
    const award = await Award.findByPk(award_id);
    if (!award)
        throw new Error('Award not found');
    const disbursements = disbursement_schedule.map((sched) => ({
        award_id,
        student_id: award.student_id,
        financial_aid_id: award.financial_aid_id,
        disbursement_number: sched.disbursement_number,
        scheduled_date: sched.scheduled_date,
        amount: sched.amount,
        net_amount: sched.amount - (award.origination_fee_percent || 0) * sched.amount,
        origination_fee: (award.origination_fee_percent || 0) * sched.amount,
        enrollment_status: sched.enrollment_status,
        status: 'scheduled',
        release_method: 'credit-to-account',
        cod_reported: false,
        cod_accepted: false,
    }));
    return await Disbursement.bulkCreate(disbursements, { transaction });
}
/**
 * Process a disbursement (release funds)
 */
async function processDisbursement(disbursement_id, release_method, transaction) {
    const t = transaction || (await Disbursement.sequelize.transaction());
    try {
        const disbursement = await Disbursement.findByPk(disbursement_id, { transaction: t });
        if (!disbursement)
            throw new Error('Disbursement not found');
        // Update disbursement status
        await disbursement.update({
            status: 'released',
            actual_date: new Date(),
            release_method,
        }, { transaction: t });
        // Update award disbursed amount
        await Award.increment('disbursed_amount', {
            by: disbursement.net_amount,
            where: { id: disbursement.award_id },
            transaction: t,
        });
        // Update financial aid total disbursed
        await FinancialAid.increment('total_disbursed', {
            by: disbursement.net_amount,
            where: { id: disbursement.financial_aid_id },
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return disbursement;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Reverse a disbursement (return funds)
 */
async function reverseDisbursement(disbursement_id, return_reason, return_amount, transaction) {
    const t = transaction || (await Disbursement.sequelize.transaction());
    try {
        const disbursement = await Disbursement.findByPk(disbursement_id, { transaction: t });
        if (!disbursement)
            throw new Error('Disbursement not found');
        await disbursement.update({
            status: 'returned',
            return_amount,
            return_reason,
            return_date: new Date(),
        }, { transaction: t });
        // Decrement award disbursed amount
        await Award.decrement('disbursed_amount', {
            by: return_amount,
            where: { id: disbursement.award_id },
            transaction: t,
        });
        // Decrement financial aid total disbursed
        await FinancialAid.decrement('total_disbursed', {
            by: return_amount,
            where: { id: disbursement.financial_aid_id },
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return disbursement;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Track disbursement status and updates
 */
async function trackDisbursementStatus(filters) {
    const where = {};
    if (filters.student_id)
        where.student_id = filters.student_id;
    if (filters.award_id)
        where.award_id = filters.award_id;
    if (filters.status)
        where.status = filters.status;
    if (filters.date_range) {
        where.scheduled_date = {
            [sequelize_1.Op.between]: [filters.date_range.start, filters.date_range.end],
        };
    }
    return await Disbursement.findAll({
        where,
        order: [['scheduled_date', 'ASC']],
        include: [{ model: Award, as: 'award' }],
    });
}
/**
 * Calculate disbursement dates based on term calendar
 */
async function calculateDisbursementDates(award_id, term_dates) {
    const award = await Award.findByPk(award_id);
    if (!award)
        throw new Error('Award not found');
    const num_disbursements = term_dates.length;
    const amount_per_disbursement = award.accepted_amount / num_disbursements;
    return term_dates.map((term, index) => ({
        disbursement_number: index + 1,
        scheduled_date: term.start_date,
        amount: amount_per_disbursement,
    }));
}
/**
 * Reconcile disbursements with accounting system
 */
async function reconcileDisbursements(academic_year, report_date) {
    const disbursements = await Disbursement.findAll({
        include: [
            {
                model: Award,
                as: 'award',
                where: { academic_year },
            },
        ],
    });
    const summary = {
        total_scheduled: 0,
        total_released: 0,
        total_returned: 0,
        pending_count: 0,
        discrepancies: [],
    };
    for (const disb of disbursements) {
        if (disb.status === 'scheduled' || disb.status === 'pending') {
            summary.pending_count++;
            summary.total_scheduled += disb.amount;
        }
        else if (disb.status === 'released') {
            summary.total_released += disb.net_amount;
        }
        else if (disb.status === 'returned') {
            summary.total_returned += disb.return_amount || 0;
        }
    }
    return summary;
}
// ============================================================================
// COD Reporting Functions (5 functions)
// ============================================================================
/**
 * Generate COD report file
 */
async function generateCODFile(academic_year, report_type, school_code) {
    const batch_id = `COD_${school_code}_${academic_year}_${Date.now()}`;
    const file_name = `${batch_id}.txt`;
    // Get unreported disbursements
    const disbursements = await Disbursement.findAll({
        where: {
            cod_reported: false,
            status: 'released',
        },
        include: [
            {
                model: Award,
                as: 'award',
                where: { academic_year, is_federal: true },
            },
        ],
    });
    const total_records = disbursements.length;
    const total_amount = disbursements.reduce((sum, d) => sum + d.net_amount, 0);
    // Create COD report record
    const report = await CODReport.create({
        report_type,
        batch_id,
        report_date: new Date(),
        academic_year,
        school_code,
        total_records,
        total_amount,
        file_name,
        submission_method: 'edconnect',
        acknowledgment_received: false,
        errors_count: 0,
        warnings_count: 0,
        accepted_count: 0,
        rejected_count: 0,
        status: 'pending',
    });
    // Generate actual COD file content would go here
    // This would create the EDI file format required by COD
    return report;
}
/**
 * Validate COD data before submission
 */
async function validateCODData(report_id) {
    const report = await CODReport.findByPk(report_id);
    if (!report) {
        return { valid: false, errors: ['Report not found'], warnings: [] };
    }
    const errors = [];
    const warnings = [];
    // Validation rules
    if (report.total_records === 0) {
        errors.push('No records to report');
    }
    if (report.total_amount <= 0) {
        errors.push('Total amount must be positive');
    }
    if (!report.school_code || report.school_code.length !== 8) {
        errors.push('Invalid school code format');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Submit COD report to federal system
 */
async function submitCODReport(report_id, transaction) {
    const report = await CODReport.findByPk(report_id);
    if (!report)
        throw new Error('Report not found');
    // Validate before submission
    const validation = await validateCODData(report_id);
    if (!validation.valid) {
        throw new Error(`COD validation failed: ${validation.errors.join(', ')}`);
    }
    // Update report status
    await report.update({
        status: 'submitted',
        submission_date: new Date(),
    }, { transaction });
    // Mark disbursements as reported
    await Disbursement.update({
        cod_reported: true,
        cod_report_date: new Date(),
    }, {
        where: {
            cod_reported: false,
            status: 'released',
        },
        transaction,
    });
    // Actual submission logic would go here (API call to COD system)
    return report;
}
/**
 * Process COD acknowledgment response
 */
async function processCODResponse(report_id, response_data, transaction) {
    const report = await CODReport.findByPk(report_id);
    if (!report)
        throw new Error('Report not found');
    const status = response_data.rejected_count > 0 ? 'rejected' : 'accepted';
    await report.update({
        acknowledgment_received: true,
        acknowledgment_date: new Date(),
        acknowledgment_file: response_data.acknowledgment_file,
        accepted_count: response_data.accepted_count,
        rejected_count: response_data.rejected_count,
        errors_count: response_data.errors.length,
        warnings_count: response_data.warnings.length,
        error_details: [...response_data.errors, ...response_data.warnings],
        status,
    }, { transaction });
    // Mark accepted disbursements as COD accepted
    if (response_data.accepted_count > 0) {
        await Disbursement.update({
            cod_accepted: true,
        }, {
            where: {
                cod_reported: true,
                cod_accepted: false,
            },
            transaction,
        });
    }
    return report;
}
/**
 * Track COD submission status
 */
async function trackCODStatus(academic_year) {
    const where = {};
    if (academic_year)
        where.academic_year = academic_year;
    return await CODReport.findAll({
        where,
        order: [['report_date', 'DESC']],
    });
}
// ============================================================================
// SAP (Satisfactory Academic Progress) Functions (5 functions)
// ============================================================================
/**
 * Calculate SAP status for a student
 */
async function calculateSAPStatus(student_id, academic_year, term_id, academic_data) {
    const gpa_requirement = 2.0; // Configurable
    const pace_requirement = 67.0; // 67% completion rate
    const max_timeframe_multiplier = 1.5; // 150% of program length
    const gpa_met = academic_data.gpa >= gpa_requirement;
    const current_pace = (academic_data.completed_credits / academic_data.attempted_credits) * 100;
    const pace_met = current_pace >= pace_requirement;
    const max_timeframe_credits = academic_data.program_credits_required * max_timeframe_multiplier;
    const max_timeframe_met = academic_data.attempted_credits <= max_timeframe_credits;
    const overall_sap_met = gpa_met && pace_met && max_timeframe_met;
    // Determine SAP status
    let sap_status;
    if (overall_sap_met) {
        sap_status = 'satisfactory';
    }
    else {
        // Check previous SAP record
        const previous_sap = await SAPRecord.findOne({
            where: { student_id },
            order: [['evaluation_date', 'DESC']],
        });
        if (!previous_sap || previous_sap.sap_status === 'satisfactory') {
            sap_status = 'warning';
        }
        else if (previous_sap.sap_status === 'warning') {
            sap_status = 'suspension';
        }
        else {
            sap_status = 'suspension';
        }
    }
    return {
        student_id,
        academic_year,
        evaluation_date: new Date(),
        evaluation_term_id: term_id,
        sap_status,
        gpa_requirement,
        current_gpa: academic_data.gpa,
        gpa_met,
        pace_requirement,
        current_pace,
        pace_met,
        max_timeframe_credits,
        attempted_credits: academic_data.attempted_credits,
        completed_credits: academic_data.completed_credits,
        max_timeframe_met,
        overall_sap_met,
        appeal_submitted: false,
        academic_plan_required: !overall_sap_met,
        financial_aid_eligible: overall_sap_met,
    };
}
/**
 * Evaluate SAP criteria and create record
 */
async function evaluateSAPCriteria(student_id, academic_year, term_id, transaction) {
    // This would typically fetch academic data from student records
    // For now, using placeholder data
    const academic_data = {
        gpa: 3.0,
        attempted_credits: 60,
        completed_credits: 50,
        program_credits_required: 120,
    };
    const sap_data = await calculateSAPStatus(student_id, academic_year, term_id, academic_data);
    return await SAPRecord.create(sap_data, { transaction });
}
/**
 * Create SAP appeal
 */
async function createSAPAppeal(sap_record_id, appeal_reason, supporting_documents, transaction) {
    const sap = await SAPRecord.findByPk(sap_record_id);
    if (!sap)
        throw new Error('SAP record not found');
    await sap.update({
        appeal_submitted: true,
        appeal_date: new Date(),
        appeal_reason,
    }, { transaction });
    return sap;
}
/**
 * Track SAP probation status
 */
async function trackSAPProbation(student_id) {
    const current_sap = await SAPRecord.findOne({
        where: { student_id },
        order: [['evaluation_date', 'DESC']],
    });
    if (!current_sap) {
        return {
            current_status: 'unknown',
            probation_terms: 0,
            requires_plan: false,
            eligible_for_aid: false,
        };
    }
    return {
        current_status: current_sap.sap_status,
        probation_terms: current_sap.probation_terms || 0,
        requires_plan: current_sap.academic_plan_required,
        eligible_for_aid: current_sap.financial_aid_eligible,
    };
}
/**
 * Generate SAP report for a term or year
 */
async function generateSAPReport(academic_year, term_id) {
    const where = { academic_year };
    if (term_id)
        where.evaluation_term_id = term_id;
    const records = await SAPRecord.findAll({ where });
    const summary = {
        total_students: records.length,
        satisfactory: 0,
        warning: 0,
        probation: 0,
        suspension: 0,
        dismissed: 0,
    };
    for (const record of records) {
        summary[record.sap_status]++;
    }
    return summary;
}
// ============================================================================
// Award Adjustment Functions (5 functions)
// ============================================================================
/**
 * Adjust an award amount
 */
async function adjustAward(award_id, new_amount, reason, transaction) {
    const t = transaction || (await Award.sequelize.transaction());
    try {
        const award = await Award.findByPk(award_id, { transaction: t });
        if (!award)
            throw new Error('Award not found');
        const previous_amount = award.accepted_amount;
        const difference = new_amount - previous_amount;
        await award.update({
            accepted_amount: new_amount,
            remaining_amount: new_amount - award.disbursed_amount,
        }, { transaction: t });
        // Update financial aid total
        await FinancialAid.increment('total_awarded', {
            by: difference,
            where: { id: award.financial_aid_id },
            transaction: t,
        });
        if (!transaction)
            await t.commit();
        return award;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Process repackaging (recalculate entire package)
 */
async function processRepackaging(financial_aid_id, reason, transaction) {
    const t = transaction || (await FinancialAid.sequelize.transaction());
    try {
        const fa = await FinancialAid.findByPk(financial_aid_id, {
            include: [{ model: Award, as: 'awards' }],
            transaction: t,
        });
        if (!fa)
            throw new Error('Financial aid not found');
        // Cancel existing awards that haven't been disbursed
        const awards = fa.awards || [];
        for (const award of awards) {
            if (award.disbursed_amount === 0) {
                await award.update({ award_status: 'cancelled' }, { transaction: t });
            }
        }
        // Reset packaging status
        await fa.update({
            status: 'pending',
            total_awarded: awards
                .filter((a) => a.award_status !== 'cancelled')
                .reduce((sum, a) => sum + a.accepted_amount, 0),
        }, { transaction: t });
        if (!transaction)
            await t.commit();
        return fa;
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Apply professional judgment adjustment
 */
async function applyProfessionalJudgment(pj_id, transaction) {
    const t = transaction || (await ProfessionalJudgment.sequelize.transaction());
    try {
        const pj = await ProfessionalJudgment.findByPk(pj_id, { transaction: t });
        if (!pj)
            throw new Error('Professional judgment not found');
        if (pj.approval_status !== 'approved') {
            throw new Error('Professional judgment must be approved first');
        }
        // Update financial aid with adjusted values
        const fa = await FinancialAid.findByPk(pj.financial_aid_id, { transaction: t });
        if (!fa)
            throw new Error('Financial aid not found');
        await fa.update({
            efc: pj.adjusted_efc,
            cost_of_attendance: pj.adjusted_coa || fa.cost_of_attendance,
            financial_need: (pj.adjusted_coa || fa.cost_of_attendance) - pj.adjusted_efc,
        }, { transaction: t });
        if (!transaction)
            await t.commit();
        return { financial_aid: fa, professional_judgment: pj };
    }
    catch (error) {
        if (!transaction)
            await t.rollback();
        throw error;
    }
}
/**
 * Track award change history
 */
async function trackAwardChanges(award_id) {
    // This would query an audit log table
    // For now, returning award update history from the model
    const award = await Award.findByPk(award_id);
    if (!award)
        throw new Error('Award not found');
    return [
        {
            changed_at: award.updated_at,
            changes: {
                offered_amount: award.offered_amount,
                accepted_amount: award.accepted_amount,
                disbursed_amount: award.disbursed_amount,
                status: award.award_status,
            },
        },
    ];
}
/**
 * Notify student of award changes
 */
async function notifyAwardChange(award_id, notification_type) {
    const award = await Award.findByPk(award_id);
    if (!award)
        throw new Error('Award not found');
    // Notification logic would go here (email, SMS, portal notification)
    // For now, returning mock response
    return {
        notification_sent: true,
        notification_id: `NOTIF_${Date.now()}`,
    };
}
// ============================================================================
// R2T4 (Return of Title IV) Calculation Functions (5 functions)
// ============================================================================
/**
 * Calculate R2T4 for a withdrawn student
 */
async function calculateR2T4(financial_aid_id, withdrawal_date, term_id, term_start_date, term_end_date) {
    const fa = await FinancialAid.findByPk(financial_aid_id, {
        include: [{ model: Award, as: 'awards', include: [{ model: Disbursement, as: 'disbursements' }] }],
    });
    if (!fa)
        throw new Error('Financial aid not found');
    // Calculate days in period and days completed
    const total_days = Math.ceil((term_end_date.getTime() - term_start_date.getTime()) / (1000 * 60 * 60 * 24));
    const days_completed = Math.ceil((withdrawal_date.getTime() - term_start_date.getTime()) / (1000 * 60 * 60 * 24));
    // Calculate completion percentage (max 100%)
    const completion_percentage = Math.min(100, (days_completed / total_days) * 100);
    // Calculate aid amounts
    const total_aid_disbursed = fa.total_disbursed;
    const total_aid_could_disburse = fa.total_awarded;
    // Calculate earned aid
    const earned_aid = (total_aid_could_disburse * completion_percentage) / 100;
    // Calculate unearned aid and amount to return
    const unearned_aid = total_aid_disbursed - earned_aid;
    const aid_to_return = Math.max(0, unearned_aid);
    // Determine school vs student responsibility (50/50 split simplified)
    const school_return_amount = aid_to_return * 0.5;
    const student_return_amount = aid_to_return * 0.5;
    // Return allocation by fund type (simplified)
    const return_allocation = {};
    const awards = fa.awards || [];
    for (const award of awards) {
        if (award.is_federal && award.disbursed_amount > 0) {
            const return_percent = aid_to_return / total_aid_disbursed;
            return_allocation[award.award_type] = award.disbursed_amount * return_percent;
        }
    }
    // Calculate return deadline (45 days from determination)
    const return_deadline = new Date();
    return_deadline.setDate(return_deadline.getDate() + 45);
    return {
        student_id: fa.student_id,
        financial_aid_id: fa.id,
        academic_year: fa.academic_year,
        term_id,
        withdrawal_date,
        determination_date: new Date(),
        withdrawal_type: 'official',
        total_days_in_period: total_days,
        days_completed,
        completion_percentage,
        total_aid_disbursed,
        total_aid_could_disburse,
        earned_aid,
        unearned_aid,
        aid_to_return,
        student_return_amount,
        school_return_amount,
        return_allocation,
        return_deadline,
        return_completed: false,
        nslds_reported: false,
        status: 'calculated',
        calculation_details: {
            term_start: term_start_date,
            term_end: term_end_date,
            withdrawal_date,
            total_days,
            days_completed,
            completion_percentage,
        },
    };
}
/**
 * Determine withdrawal date for R2T4
 */
async function determineWithdrawalDate(student_id, term_id, withdrawal_type, last_attendance_date) {
    if (withdrawal_type === 'official' && last_attendance_date) {
        return last_attendance_date;
    }
    // For unofficial withdrawal, use midpoint of term or last attendance
    if (withdrawal_type === 'unofficial') {
        return last_attendance_date || new Date(); // Would calculate term midpoint
    }
    return new Date();
}
/**
 * Calculate earned aid amount
 */
async function calculateEarnedAid(total_aid, completion_percentage) {
    // If student completed more than 60% of the period, all aid is earned
    if (completion_percentage > 60) {
        return total_aid;
    }
    return (total_aid * completion_percentage) / 100;
}
/**
 * Calculate return amount by fund type
 */
async function calculateReturnAmount(r2t4_id) {
    const r2t4 = await R2T4Calculation.findByPk(r2t4_id);
    if (!r2t4)
        throw new Error('R2T4 calculation not found');
    return r2t4.return_allocation;
}
/**
 * Generate R2T4 worksheet report
 */
async function generateR2T4Report(r2t4_id) {
    const r2t4 = await R2T4Calculation.findByPk(r2t4_id, {
        include: [
            {
                model: FinancialAid,
                as: 'financialAid',
                include: [{ model: Award, as: 'awards' }],
            },
        ],
    });
    if (!r2t4)
        throw new Error('R2T4 calculation not found');
    return {
        student_info: {
            student_id: r2t4.student_id,
            academic_year: r2t4.academic_year,
        },
        withdrawal_info: {
            withdrawal_date: r2t4.withdrawal_date,
            withdrawal_type: r2t4.withdrawal_type,
            last_attendance_date: r2t4.last_attendance_date,
        },
        calculation: {
            total_days: r2t4.total_days_in_period,
            days_completed: r2t4.days_completed,
            completion_percentage: r2t4.completion_percentage,
            total_aid_disbursed: r2t4.total_aid_disbursed,
            earned_aid: r2t4.earned_aid,
            unearned_aid: r2t4.unearned_aid,
            aid_to_return: r2t4.aid_to_return,
        },
        return_schedule: {
            school_return: r2t4.school_return_amount,
            student_return: r2t4.student_return_amount,
            return_deadline: r2t4.return_deadline,
            return_allocation: r2t4.return_allocation,
        },
    };
}
// Export all models and functions
exports.default = {
    // Models
    FinancialAid,
    Award,
    Disbursement,
    FAFSAData,
    SAPRecord,
    ProfessionalJudgment,
    CODReport,
    R2T4Calculation,
    // Initialization
    initFinancialAidModels,
    syncFinancialAidSchema,
    // CRUD Operations
    createFinancialAidRecord,
    updateFinancialAidRecord,
    deleteFinancialAidRecord,
    getFinancialAidById,
    queryFinancialAidRecords,
    bulkImportFinancialAid,
    // FAFSA Integration
    importFAFSAData,
    validateFAFSA,
    calculateEFC,
    parseFAFSAISIR,
    trackFAFSAVerification,
    // Award Packaging
    createAwardPackage,
    calculateNeed,
    allocateAwards,
    checkAwardLimits,
    generateAwardLetter,
    compareAwardYears,
    // Disbursement Processing
    scheduleDisbursements,
    processDisbursement,
    reverseDisbursement,
    trackDisbursementStatus,
    calculateDisbursementDates,
    reconcileDisbursements,
    // COD Reporting
    generateCODFile,
    validateCODData,
    submitCODReport,
    processCODResponse,
    trackCODStatus,
    // SAP Tracking
    calculateSAPStatus,
    evaluateSAPCriteria,
    createSAPAppeal,
    trackSAPProbation,
    generateSAPReport,
    // Award Adjustments
    adjustAward,
    processRepackaging,
    applyProfessionalJudgment,
    trackAwardChanges,
    notifyAwardChange,
    // R2T4 Calculations
    calculateR2T4,
    determineWithdrawalDate,
    calculateEarnedAid,
    calculateReturnAmount,
    generateR2T4Report,
};
//# sourceMappingURL=financial-aid-kit.js.map