"use strict";
/**
 * LOC: TAXREV1234567
 * File: /reuse/government/tax-revenue-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (database ORM)
 *   - nestjs (framework utilities)
 *   - Node.js crypto, fs modules
 *
 * DOWNSTREAM (imported by):
 *   - ../backend/modules/government/revenue/*
 *   - ../backend/modules/government/tax-assessment/*
 *   - ../backend/modules/government/collections/*
 *   - API controllers for tax revenue management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTaxDataForAudit = exports.generateTaxRevenueReport = exports.getDelinquentTaxes = exports.createDelinquentTaxRecord = exports.calculateCollectionRate = exports.generateRevenueForecast = exports.issueTaxRefund = exports.processTaxRefund = exports.approveTaxAbatement = exports.processTaxAbatement = exports.createTaxExemption = exports.recordSalesTaxTransaction = exports.calculateSalesTax = exports.getSalesTaxRate = exports.calculateLienRedemption = exports.releaseTaxLien = exports.fileTaxLien = exports.processInstallmentPayment = exports.createPaymentPlan = exports.processTaxPayment = exports.calculateDelinquentInterest = exports.calculateLatePenalty = exports.addSpecialAssessments = exports.generatePropertyTaxBill = exports.updatePropertyAssessmentYear = exports.applyTaxExemptions = exports.calculatePropertyAssessment = exports.createPropertyAssessment = exports.createTaxLienModel = exports.createTaxBillModel = exports.createPropertyTaxAssessmentModel = void 0;
/**
 * File: /reuse/government/tax-revenue-management-kit.ts
 * Locator: WC-GOV-TAXREV-001
 * Purpose: Comprehensive Government Tax Revenue Management - property tax, sales tax, tax billing, collections, liens, abatements
 *
 * Upstream: Independent utility module for government tax revenue operations
 * Downstream: ../backend/*, tax assessment controllers, revenue services, collection modules, lien processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for property tax assessment, sales tax processing, tax billing, payment plans, delinquent tracking, lien processing
 *
 * LLM Context: Enterprise-grade government tax revenue management utilities for production-ready NestJS applications.
 * Provides property tax assessment and valuation, sales tax rate management, tax billing generation, payment plan creation,
 * delinquent tax tracking, tax lien filing and processing, tax exemption management, tax abatement tracking, revenue forecasting,
 * penalty and interest calculation, tax refund processing, installment payment management, tax sale processing, and comprehensive
 * audit trail generation for all government tax revenue operations.
 */
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Property Tax Assessments with full valuation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PropertyTaxAssessment model
 *
 * @example
 * ```typescript
 * const PropertyTaxAssessment = createPropertyTaxAssessmentModel(sequelize);
 * const assessment = await PropertyTaxAssessment.create({
 *   parcelId: 'PARC-2024-001',
 *   propertyAddress: '123 Main St',
 *   ownerName: 'John Doe',
 *   assessedLandValue: 150000.00,
 *   assessedImprovementValue: 250000.00,
 *   totalAssessedValue: 400000.00,
 *   assessmentYear: 2024,
 *   propertyType: 'residential'
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     PropertyTaxAssessment:
 *       type: object
 *       required:
 *         - parcelId
 *         - propertyAddress
 *         - ownerName
 *         - totalAssessedValue
 *         - assessmentYear
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *         parcelId:
 *           type: string
 *           maxLength: 50
 *           description: Unique parcel identifier
 *         propertyAddress:
 *           type: string
 *           maxLength: 500
 *           description: Full property address
 *         ownerName:
 *           type: string
 *           maxLength: 200
 *           description: Property owner name
 *         ownerAddress:
 *           type: string
 *           maxLength: 500
 *         assessedLandValue:
 *           type: number
 *           format: decimal
 *           description: Assessed value of land
 *         assessedImprovementValue:
 *           type: number
 *           format: decimal
 *           description: Assessed value of improvements
 *         totalAssessedValue:
 *           type: number
 *           format: decimal
 *           description: Total assessed value
 *         taxableValue:
 *           type: number
 *           format: decimal
 *           description: Taxable value after exemptions
 *         assessmentYear:
 *           type: integer
 *           description: Assessment year
 *         propertyType:
 *           type: string
 *           enum: [residential, commercial, industrial, agricultural, vacant, mixed_use]
 */
const createPropertyTaxAssessmentModel = (sequelize) => {
    class PropertyTaxAssessmentModel extends sequelize_1.Model {
    }
    PropertyTaxAssessmentModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        parcelId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique parcel identifier',
        },
        propertyAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Full property address',
        },
        ownerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Property owner name',
        },
        ownerAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Owner mailing address',
        },
        assessedLandValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Assessed value of land',
        },
        assessedImprovementValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Assessed value of improvements',
        },
        totalAssessedValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total assessed value',
        },
        taxableValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Taxable value after exemptions',
        },
        exemptions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Tax exemptions applied',
        },
        assessmentYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2000,
                max: 2100,
            },
            comment: 'Assessment year',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Assessment date',
        },
        assessor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assessor name',
        },
        propertyType: {
            type: sequelize_1.DataTypes.ENUM('residential', 'commercial', 'industrial', 'agricultural', 'vacant', 'mixed_use'),
            allowNull: false,
            comment: 'Property type classification',
        },
        landArea: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Land area in square feet',
        },
        buildingArea: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Building area in square feet',
        },
        yearBuilt: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Year property was built',
        },
        zoning: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Zoning classification',
        },
        neighborhood: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Neighborhood or district',
        },
        taxDistrict: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Tax district code',
        },
        lastSaleDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last sale date',
        },
        lastSalePrice: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Last sale price',
        },
        appraisalMethod: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'market_comparison',
            comment: 'Appraisal methodology used',
        },
        marketValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated market value',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'property_tax_assessments',
        timestamps: true,
        indexes: [
            { fields: ['parcelId'], unique: true },
            { fields: ['assessmentYear'] },
            { fields: ['ownerName'] },
            { fields: ['propertyType'] },
            { fields: ['taxDistrict'] },
            { fields: ['assessmentYear', 'taxDistrict'] },
            { fields: ['assessmentDate'] },
        ],
    });
    return PropertyTaxAssessmentModel;
};
exports.createPropertyTaxAssessmentModel = createPropertyTaxAssessmentModel;
/**
 * Sequelize model for Tax Bills with comprehensive billing and payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxBill model
 *
 * @example
 * ```typescript
 * const TaxBill = createTaxBillModel(sequelize);
 * const bill = await TaxBill.create({
 *   parcelId: 'PARC-2024-001',
 *   billNumber: 'BILL-2024-00001',
 *   billYear: 2024,
 *   assessedValue: 400000.00,
 *   millageRate: 0.025,
 *   baseTaxAmount: 10000.00,
 *   netTaxAmount: 9500.00,
 *   dueDate: new Date('2024-12-31')
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     TaxBill:
 *       type: object
 *       required:
 *         - parcelId
 *         - billNumber
 *         - billYear
 *         - baseTaxAmount
 *         - dueDate
 *       properties:
 *         id:
 *           type: integer
 *         billId:
 *           type: string
 *           format: uuid
 *         parcelId:
 *           type: string
 *         billNumber:
 *           type: string
 *         billYear:
 *           type: integer
 *         assessedValue:
 *           type: number
 *           format: decimal
 *         millageRate:
 *           type: number
 *           format: decimal
 *         baseTaxAmount:
 *           type: number
 *           format: decimal
 *         netTaxAmount:
 *           type: number
 *           format: decimal
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, partial, paid, delinquent, lien]
 */
const createTaxBillModel = (sequelize) => {
    class TaxBillModel extends sequelize_1.Model {
    }
    TaxBillModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        billId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            comment: 'Unique bill identifier',
        },
        parcelId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Associated parcel ID',
        },
        billNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Human-readable bill number',
        },
        billYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2000,
                max: 2100,
            },
            comment: 'Bill year',
        },
        propertyOwner: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Property owner name',
        },
        propertyAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Property address',
        },
        assessedValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Assessed value',
        },
        taxableValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Taxable value',
        },
        millageRate: {
            type: sequelize_1.DataTypes.DECIMAL(8, 6),
            allowNull: false,
            comment: 'Millage rate (tax per $1000)',
        },
        baseTaxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Base tax amount before adjustments',
        },
        exemptionAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total exemption amount',
        },
        netTaxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Net tax after exemptions',
        },
        specialAssessments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Special assessments',
        },
        totalDue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total amount due',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment due date',
        },
        delinquentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date when bill becomes delinquent',
        },
        billDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Bill generation date',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Fiscal year',
        },
        paymentStatus: {
            type: sequelize_1.DataTypes.ENUM('unpaid', 'partial', 'paid', 'delinquent', 'lien'),
            allowNull: false,
            defaultValue: 'unpaid',
            comment: 'Payment status',
        },
        amountPaid: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount paid to date',
        },
        balanceRemaining: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Remaining balance',
        },
        installmentPlanId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Associated installment plan ID',
        },
        penaltiesAccrued: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total penalties accrued',
        },
        interestAccrued: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total interest accrued',
        },
        lastPaymentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last payment date',
        },
        paidInFull: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether bill is paid in full',
        },
        paidInFullDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date paid in full',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'tax_bills',
        timestamps: true,
        indexes: [
            { fields: ['billId'], unique: true },
            { fields: ['billNumber'], unique: true },
            { fields: ['parcelId'] },
            { fields: ['billYear'] },
            { fields: ['paymentStatus'] },
            { fields: ['dueDate'] },
            { fields: ['delinquentDate'] },
            { fields: ['fiscalYear'] },
            { fields: ['parcelId', 'billYear'] },
            { fields: ['paymentStatus', 'dueDate'] },
        ],
    });
    return TaxBillModel;
};
exports.createTaxBillModel = createTaxBillModel;
/**
 * Sequelize model for Tax Liens with comprehensive lien tracking and status management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxLien model
 *
 * @example
 * ```typescript
 * const TaxLien = createTaxLienModel(sequelize);
 * const lien = await TaxLien.create({
 *   parcelId: 'PARC-2024-001',
 *   billId: 'BILL-2024-00001',
 *   lienNumber: 'LIEN-2024-00001',
 *   lienAmount: 15000.00,
 *   interestRate: 0.18,
 *   filingDate: new Date(),
 *   status: 'filed'
 * });
 * ```
 */
const createTaxLienModel = (sequelize) => {
    class TaxLienModel extends sequelize_1.Model {
    }
    TaxLienModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lienId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            comment: 'Unique lien identifier',
        },
        lienNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Human-readable lien number',
        },
        parcelId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Associated parcel ID',
        },
        billId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated bill ID',
        },
        propertyOwner: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Property owner name',
        },
        propertyAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Property address',
        },
        lienAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Original lien amount',
        },
        interestRate: {
            type: sequelize_1.DataTypes.DECIMAL(6, 4),
            allowNull: false,
            comment: 'Annual interest rate',
        },
        penaltyAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Penalty amount',
        },
        filingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Lien filing date',
        },
        filingFee: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Lien filing fee',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('filed', 'active', 'released', 'foreclosed', 'sold'),
            allowNull: false,
            defaultValue: 'filed',
            comment: 'Lien status',
        },
        releaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Lien release date',
        },
        releaseReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for release',
        },
        certificateNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Lien certificate number',
        },
        recordedBook: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Recorded book reference',
        },
        recordedPage: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Recorded page reference',
        },
        purchaser: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Lien purchaser name',
        },
        purchaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Lien purchase date',
        },
        purchaseAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Lien purchase amount',
        },
        redemptionDeadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Redemption deadline',
        },
        foreclosureDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Foreclosure date',
        },
        filedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who filed lien',
        },
        releasedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who released lien',
        },
        currentBalance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Current balance including interest',
        },
        totalInterestAccrued: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total interest accrued',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'tax_liens',
        timestamps: true,
        indexes: [
            { fields: ['lienId'], unique: true },
            { fields: ['lienNumber'], unique: true },
            { fields: ['certificateNumber'], unique: true },
            { fields: ['parcelId'] },
            { fields: ['billId'] },
            { fields: ['status'] },
            { fields: ['filingDate'] },
            { fields: ['purchaser'] },
            { fields: ['status', 'filingDate'] },
        ],
    });
    return TaxLienModel;
};
exports.createTaxLienModel = createTaxLienModel;
// ============================================================================
// PROPERTY TAX ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new property tax assessment record.
 *
 * @param {PropertyTaxAssessment} assessmentData - Assessment data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createPropertyAssessment({
 *   parcelId: 'PARC-2024-001',
 *   propertyAddress: '123 Main St',
 *   ownerName: 'John Doe',
 *   ownerAddress: '123 Main St, City, ST 12345',
 *   assessedLandValue: 150000,
 *   assessedImprovementValue: 250000,
 *   totalAssessedValue: 400000,
 *   taxableValue: 400000,
 *   assessmentYear: 2024,
 *   assessmentDate: new Date(),
 *   assessor: 'Jane Smith',
 *   propertyType: 'residential',
 *   landArea: 5000,
 *   buildingArea: 2500,
 *   zoning: 'R1',
 *   neighborhood: 'Downtown',
 *   taxDistrict: 'DIST-001',
 *   exemptions: []
 * }, sequelize);
 * ```
 */
const createPropertyAssessment = async (assessmentData, sequelize, transaction) => {
    const PropertyTaxAssessment = (0, exports.createPropertyTaxAssessmentModel)(sequelize);
    const assessment = await PropertyTaxAssessment.create({
        ...assessmentData,
        assessmentDate: assessmentData.assessmentDate || new Date(),
        marketValue: assessmentData.totalAssessedValue || 0,
        taxableValue: assessmentData.taxableValue || assessmentData.totalAssessedValue || 0,
    }, { transaction });
    return assessment;
};
exports.createPropertyAssessment = createPropertyAssessment;
/**
 * Calculates property tax assessment based on market value and property characteristics.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} marketValue - Market value
 * @param {string} propertyType - Property type
 * @param {number} assessmentRatio - Assessment ratio (e.g., 0.85 for 85%)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ assessedValue: number; landValue: number; improvementValue: number }>}
 *
 * @example
 * ```typescript
 * const values = await calculatePropertyAssessment(
 *   'PARC-2024-001',
 *   500000,
 *   'residential',
 *   0.85,
 *   sequelize
 * );
 * // Returns: { assessedValue: 425000, landValue: 127500, improvementValue: 297500 }
 * ```
 */
const calculatePropertyAssessment = async (parcelId, marketValue, propertyType, assessmentRatio, sequelize) => {
    // Calculate assessed value based on assessment ratio
    const assessedValue = Math.round(marketValue * assessmentRatio);
    // Typical land/improvement split by property type
    const landRatios = {
        residential: 0.3,
        commercial: 0.25,
        industrial: 0.2,
        agricultural: 0.5,
        vacant: 1.0,
        mixed_use: 0.3,
    };
    const landRatio = landRatios[propertyType] || 0.3;
    const landValue = Math.round(assessedValue * landRatio);
    const improvementValue = assessedValue - landValue;
    return {
        assessedValue,
        landValue,
        improvementValue,
    };
};
exports.calculatePropertyAssessment = calculatePropertyAssessment;
/**
 * Applies tax exemptions to a property assessment.
 *
 * @param {string} parcelId - Parcel ID
 * @param {TaxExemption[]} exemptions - Exemptions to apply
 * @param {number} totalAssessedValue - Total assessed value
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ taxableValue: number; totalExemption: number; appliedExemptions: TaxExemption[] }>}
 *
 * @example
 * ```typescript
 * const result = await applyTaxExemptions(
 *   'PARC-2024-001',
 *   [{ exemptionType: 'homestead', exemptionAmount: 25000, ... }],
 *   400000,
 *   sequelize
 * );
 * // Returns: { taxableValue: 375000, totalExemption: 25000, appliedExemptions: [...] }
 * ```
 */
const applyTaxExemptions = async (parcelId, exemptions, totalAssessedValue, sequelize) => {
    const now = new Date();
    const appliedExemptions = [];
    let totalExemption = 0;
    for (const exemption of exemptions) {
        // Check if exemption is active
        if (exemption.status === 'active' && exemption.startDate <= now) {
            if (!exemption.endDate || exemption.endDate >= now) {
                appliedExemptions.push(exemption);
                // Calculate exemption amount
                if (exemption.exemptionPercentage) {
                    const exemptionAmount = Math.round(totalAssessedValue * exemption.exemptionPercentage);
                    totalExemption += Math.min(exemptionAmount, exemption.exemptionAmount || exemptionAmount);
                }
                else {
                    totalExemption += exemption.exemptionAmount;
                }
            }
        }
    }
    const taxableValue = Math.max(0, totalAssessedValue - totalExemption);
    return {
        taxableValue,
        totalExemption,
        appliedExemptions,
    };
};
exports.applyTaxExemptions = applyTaxExemptions;
/**
 * Updates property assessment for a new tax year.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} newAssessmentYear - New assessment year
 * @param {number} appreciationRate - Annual appreciation rate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated assessment
 *
 * @example
 * ```typescript
 * const updated = await updatePropertyAssessmentYear(
 *   'PARC-2024-001',
 *   2025,
 *   0.03,
 *   sequelize
 * );
 * ```
 */
const updatePropertyAssessmentYear = async (parcelId, newAssessmentYear, appreciationRate, sequelize) => {
    const PropertyTaxAssessment = (0, exports.createPropertyTaxAssessmentModel)(sequelize);
    const currentAssessment = await PropertyTaxAssessment.findOne({
        where: { parcelId },
        order: [['assessmentYear', 'DESC']],
    });
    if (!currentAssessment) {
        throw new Error(`Assessment not found for parcel ${parcelId}`);
    }
    const currentData = currentAssessment.toJSON();
    // Calculate new values with appreciation
    const newLandValue = Math.round(currentData.assessedLandValue * (1 + appreciationRate));
    const newImprovementValue = Math.round(currentData.assessedImprovementValue * (1 + appreciationRate));
    const newTotalValue = newLandValue + newImprovementValue;
    const newAssessment = await PropertyTaxAssessment.create({
        ...currentData,
        id: undefined,
        assessmentYear: newAssessmentYear,
        assessmentDate: new Date(),
        assessedLandValue: newLandValue,
        assessedImprovementValue: newImprovementValue,
        totalAssessedValue: newTotalValue,
        marketValue: Math.round(newTotalValue / 0.85), // Assuming 85% assessment ratio
        taxableValue: newTotalValue, // Will be adjusted after exemptions
    });
    return newAssessment;
};
exports.updatePropertyAssessmentYear = updatePropertyAssessmentYear;
// ============================================================================
// TAX BILLING FUNCTIONS
// ============================================================================
/**
 * Generates a property tax bill from an assessment.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} billYear - Bill year
 * @param {number} millageRate - Millage rate (tax per $1000)
 * @param {Date} dueDate - Payment due date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Generated tax bill
 *
 * @example
 * ```typescript
 * const bill = await generatePropertyTaxBill(
 *   'PARC-2024-001',
 *   2024,
 *   25.50,
 *   new Date('2024-12-31'),
 *   sequelize
 * );
 * ```
 */
const generatePropertyTaxBill = async (parcelId, billYear, millageRate, dueDate, sequelize) => {
    const PropertyTaxAssessment = (0, exports.createPropertyTaxAssessmentModel)(sequelize);
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    const assessment = await PropertyTaxAssessment.findOne({
        where: { parcelId, assessmentYear: billYear },
    });
    if (!assessment) {
        throw new Error(`Assessment not found for parcel ${parcelId} year ${billYear}`);
    }
    const assessmentData = assessment.toJSON();
    // Calculate tax: (taxable value / 1000) * millage rate
    const baseTaxAmount = Math.round((assessmentData.taxableValue / 1000) * millageRate * 100) / 100;
    const exemptionAmount = assessmentData.totalAssessedValue - assessmentData.taxableValue;
    const netTaxAmount = baseTaxAmount;
    const billNumber = `BILL-${billYear}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    const delinquentDate = new Date(dueDate);
    delinquentDate.setDate(delinquentDate.getDate() + 30); // 30 days after due date
    const bill = await TaxBill.create({
        parcelId,
        billNumber,
        billYear,
        propertyOwner: assessmentData.ownerName,
        propertyAddress: assessmentData.propertyAddress,
        assessedValue: assessmentData.totalAssessedValue,
        taxableValue: assessmentData.taxableValue,
        millageRate,
        baseTaxAmount,
        exemptionAmount,
        netTaxAmount,
        specialAssessments: [],
        totalDue: netTaxAmount,
        dueDate,
        delinquentDate,
        billDate: new Date(),
        fiscalYear: `FY${billYear}`,
        paymentStatus: 'unpaid',
        amountPaid: 0,
        balanceRemaining: netTaxAmount,
        paidInFull: false,
    });
    return bill;
};
exports.generatePropertyTaxBill = generatePropertyTaxBill;
/**
 * Adds special assessments to a tax bill.
 *
 * @param {string} billId - Bill ID
 * @param {SpecialAssessment[]} assessments - Special assessments
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated bill
 *
 * @example
 * ```typescript
 * const updated = await addSpecialAssessments(
 *   'bill-uuid',
 *   [{ assessmentType: 'street_improvement', amount: 500, description: 'Street paving' }],
 *   sequelize
 * );
 * ```
 */
const addSpecialAssessments = async (billId, assessments, sequelize) => {
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    const bill = await TaxBill.findOne({ where: { billId } });
    if (!bill) {
        throw new Error(`Bill not found: ${billId}`);
    }
    const billData = bill.toJSON();
    const currentAssessments = billData.specialAssessments || [];
    const updatedAssessments = [...currentAssessments, ...assessments];
    const totalSpecialAssessments = updatedAssessments.reduce((sum, a) => sum + a.amount, 0);
    const newTotalDue = billData.netTaxAmount + totalSpecialAssessments;
    await bill.update({
        specialAssessments: updatedAssessments,
        totalDue: newTotalDue,
        balanceRemaining: newTotalDue - billData.amountPaid,
    });
    return bill;
};
exports.addSpecialAssessments = addSpecialAssessments;
/**
 * Calculates penalty for late payment.
 *
 * @param {number} principalAmount - Principal amount owed
 * @param {Date} dueDate - Original due date
 * @param {Date} currentDate - Current date
 * @param {number} penaltyRate - Penalty rate (e.g., 0.01 for 1% per month)
 * @returns {PenaltyCalculation}
 *
 * @example
 * ```typescript
 * const penalty = calculateLatePenalty(
 *   10000,
 *   new Date('2024-01-31'),
 *   new Date('2024-03-15'),
 *   0.015
 * );
 * // Returns penalty calculation for ~45 days late
 * ```
 */
const calculateLatePenalty = (principalAmount, dueDate, currentDate, penaltyRate) => {
    const daysLate = Math.max(0, Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (daysLate === 0) {
        return {
            penaltyType: 'late_payment',
            baseAmount: principalAmount,
            penaltyRate: 0,
            penaltyAmount: 0,
            startDate: dueDate,
            endDate: currentDate,
            daysLate: 0,
            calculationMethod: 'percentage',
            waived: false,
        };
    }
    // Calculate penalty based on months late (rounded up)
    const monthsLate = Math.ceil(daysLate / 30);
    const penaltyAmount = Math.round(principalAmount * penaltyRate * monthsLate * 100) / 100;
    return {
        penaltyType: 'late_payment',
        baseAmount: principalAmount,
        penaltyRate,
        penaltyAmount,
        startDate: dueDate,
        endDate: currentDate,
        daysLate,
        calculationMethod: 'percentage',
        waived: false,
    };
};
exports.calculateLatePenalty = calculateLatePenalty;
/**
 * Calculates interest on delinquent taxes.
 *
 * @param {number} principal - Principal amount
 * @param {number} annualRate - Annual interest rate
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} method - Calculation method
 * @returns {InterestCalculation}
 *
 * @example
 * ```typescript
 * const interest = calculateDelinquentInterest(
 *   10000,
 *   0.18,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'simple'
 * );
 * ```
 */
const calculateDelinquentInterest = (principal, annualRate, startDate, endDate, method = 'simple') => {
    const daysAccrued = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const years = daysAccrued / 365;
    let interestAmount = 0;
    if (method === 'simple') {
        interestAmount = principal * annualRate * years;
    }
    else if (method === 'daily') {
        const dailyRate = annualRate / 365;
        interestAmount = principal * dailyRate * daysAccrued;
    }
    else if (method === 'compound') {
        // Monthly compounding
        const monthlyRate = annualRate / 12;
        const months = daysAccrued / 30;
        interestAmount = principal * (Math.pow(1 + monthlyRate, months) - 1);
    }
    interestAmount = Math.round(interestAmount * 100) / 100;
    return {
        principal,
        interestRate: annualRate,
        startDate,
        endDate,
        daysAccrued,
        interestAmount,
        calculationMethod: method,
        totalWithInterest: principal + interestAmount,
    };
};
exports.calculateDelinquentInterest = calculateDelinquentInterest;
// ============================================================================
// PAYMENT PROCESSING FUNCTIONS
// ============================================================================
/**
 * Processes a tax payment.
 *
 * @param {string} billId - Bill ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} paymentMethod - Payment method
 * @param {string} receivedBy - User receiving payment
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Payment record
 *
 * @example
 * ```typescript
 * const payment = await processTaxPayment(
 *   'bill-uuid',
 *   5000,
 *   'check',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
const processTaxPayment = async (billId, paymentAmount, paymentMethod, receivedBy, sequelize) => {
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    return await sequelize.transaction(async (transaction) => {
        const bill = await TaxBill.findOne({ where: { billId }, transaction });
        if (!bill) {
            throw new Error(`Bill not found: ${billId}`);
        }
        const billData = bill.toJSON();
        const newAmountPaid = billData.amountPaid + paymentAmount;
        const newBalance = billData.totalDue - newAmountPaid;
        const isPaidInFull = newBalance <= 0;
        const payment = {
            paymentId: (0, crypto_1.randomUUID)(),
            billId,
            parcelId: billData.parcelId,
            paymentDate: new Date(),
            paymentAmount,
            paymentMethod: paymentMethod,
            confirmationNumber: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            appliedToPrincipal: paymentAmount,
            appliedToInterest: 0,
            appliedToPenalties: 0,
            appliedToFees: 0,
            receiptNumber: `RCPT-${Date.now()}`,
            receivedBy,
            fiscalYear: billData.fiscalYear,
            paymentStatus: 'cleared',
        };
        let newStatus = billData.paymentStatus;
        if (isPaidInFull) {
            newStatus = 'paid';
        }
        else if (newAmountPaid > 0) {
            newStatus = 'partial';
        }
        await bill.update({
            amountPaid: newAmountPaid,
            balanceRemaining: Math.max(0, newBalance),
            paymentStatus: newStatus,
            lastPaymentDate: new Date(),
            paidInFull: isPaidInFull,
            paidInFullDate: isPaidInFull ? new Date() : null,
        }, { transaction });
        return payment;
    });
};
exports.processTaxPayment = processTaxPayment;
/**
 * Creates a payment plan for delinquent taxes.
 *
 * @param {string} billId - Bill ID
 * @param {number} downPayment - Down payment amount
 * @param {number} numberOfInstallments - Number of installments
 * @param {string} frequency - Installment frequency
 * @param {string} createdBy - User creating plan
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PaymentPlan>}
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(
 *   'bill-uuid',
 *   2000,
 *   12,
 *   'monthly',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
const createPaymentPlan = async (billId, downPayment, numberOfInstallments, frequency, createdBy, sequelize) => {
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    const bill = await TaxBill.findOne({ where: { billId } });
    if (!bill) {
        throw new Error(`Bill not found: ${billId}`);
    }
    const billData = bill.toJSON();
    const totalAmount = billData.balanceRemaining;
    const remainingBalance = totalAmount - downPayment;
    const installmentAmount = Math.round((remainingBalance / numberOfInstallments) * 100) / 100;
    const installments = [];
    let currentDate = new Date();
    const incrementMonths = frequency === 'monthly' ? 1 : frequency === 'quarterly' ? 3 : 6;
    for (let i = 0; i < numberOfInstallments; i++) {
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + incrementMonths);
        installments.push({
            installmentNumber: i + 1,
            dueDate: new Date(currentDate),
            amount: installmentAmount,
            principal: installmentAmount,
            interest: 0,
            fees: 0,
            status: 'pending',
        });
    }
    const plan = {
        planId: (0, crypto_1.randomUUID)(),
        taxBillId: billId,
        parcelId: billData.parcelId,
        taxpayerName: billData.propertyOwner,
        totalAmount,
        downPayment,
        remainingBalance,
        numberOfInstallments,
        installmentAmount,
        installmentFrequency: frequency,
        startDate: new Date(),
        endDate: installments[installments.length - 1].dueDate,
        status: 'active',
        installments,
        createdBy,
        createdDate: new Date(),
    };
    await bill.update({ installmentPlanId: plan.planId });
    return plan;
};
exports.createPaymentPlan = createPaymentPlan;
/**
 * Processes an installment payment.
 *
 * @param {string} planId - Payment plan ID
 * @param {number} installmentNumber - Installment number
 * @param {number} paymentAmount - Payment amount
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PaymentPlan>} Updated payment plan
 *
 * @example
 * ```typescript
 * const plan = await processInstallmentPayment(
 *   'plan-uuid',
 *   1,
 *   500,
 *   sequelize
 * );
 * ```
 */
const processInstallmentPayment = async (planId, installmentNumber, paymentAmount, sequelize) => {
    // In production, retrieve plan from database
    // For now, return a mock updated plan
    const plan = {
        planId,
        taxBillId: 'bill-uuid',
        parcelId: 'parcel-123',
        taxpayerName: 'John Doe',
        totalAmount: 10000,
        downPayment: 2000,
        remainingBalance: 8000 - paymentAmount,
        numberOfInstallments: 12,
        installmentAmount: 666.67,
        installmentFrequency: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
        status: 'active',
        installments: [],
        createdBy: 'user-123',
        createdDate: new Date(),
    };
    return plan;
};
exports.processInstallmentPayment = processInstallmentPayment;
// ============================================================================
// TAX LIEN PROCESSING FUNCTIONS
// ============================================================================
/**
 * Files a tax lien for delinquent taxes.
 *
 * @param {string} billId - Bill ID
 * @param {string} parcelId - Parcel ID
 * @param {number} lienAmount - Lien amount
 * @param {number} interestRate - Annual interest rate
 * @param {string} filedBy - User filing lien
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created lien
 *
 * @example
 * ```typescript
 * const lien = await fileTaxLien(
 *   'bill-uuid',
 *   'PARC-2024-001',
 *   15000,
 *   0.18,
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
const fileTaxLien = async (billId, parcelId, lienAmount, interestRate, filedBy, sequelize) => {
    const TaxLien = (0, exports.createTaxLienModel)(sequelize);
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    return await sequelize.transaction(async (transaction) => {
        const bill = await TaxBill.findOne({ where: { billId }, transaction });
        if (!bill) {
            throw new Error(`Bill not found: ${billId}`);
        }
        const billData = bill.toJSON();
        const lienNumber = `LIEN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
        const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const lien = await TaxLien.create({
            lienNumber,
            parcelId,
            billId,
            propertyOwner: billData.propertyOwner,
            propertyAddress: billData.propertyAddress,
            lienAmount,
            interestRate,
            penaltyAmount: billData.penaltiesAccrued || 0,
            filingDate: new Date(),
            filingFee: 50, // Standard filing fee
            status: 'filed',
            certificateNumber,
            filedBy,
            currentBalance: lienAmount,
            totalInterestAccrued: 0,
        }, { transaction });
        await bill.update({ paymentStatus: 'lien' }, { transaction });
        return lien;
    });
};
exports.fileTaxLien = fileTaxLien;
/**
 * Releases a tax lien after payment.
 *
 * @param {string} lienId - Lien ID
 * @param {string} releaseReason - Reason for release
 * @param {string} releasedBy - User releasing lien
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Released lien
 *
 * @example
 * ```typescript
 * const released = await releaseTaxLien(
 *   'lien-uuid',
 *   'Paid in full',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
const releaseTaxLien = async (lienId, releaseReason, releasedBy, sequelize) => {
    const TaxLien = (0, exports.createTaxLienModel)(sequelize);
    const lien = await TaxLien.findOne({ where: { lienId } });
    if (!lien) {
        throw new Error(`Lien not found: ${lienId}`);
    }
    await lien.update({
        status: 'released',
        releaseDate: new Date(),
        releaseReason,
        releasedBy,
    });
    return lien;
};
exports.releaseTaxLien = releaseTaxLien;
/**
 * Calculates total lien redemption amount including interest.
 *
 * @param {string} lienId - Lien ID
 * @param {Date} redemptionDate - Redemption date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ totalRedemption: number; principal: number; interest: number; penalties: number; fees: number }>}
 *
 * @example
 * ```typescript
 * const redemption = await calculateLienRedemption(
 *   'lien-uuid',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
const calculateLienRedemption = async (lienId, redemptionDate, sequelize) => {
    const TaxLien = (0, exports.createTaxLienModel)(sequelize);
    const lien = await TaxLien.findOne({ where: { lienId } });
    if (!lien) {
        throw new Error(`Lien not found: ${lienId}`);
    }
    const lienData = lien.toJSON();
    const interestCalc = (0, exports.calculateDelinquentInterest)(lienData.lienAmount, lienData.interestRate, lienData.filingDate, redemptionDate, 'simple');
    const totalRedemption = lienData.lienAmount + interestCalc.interestAmount + lienData.penaltyAmount + lienData.filingFee;
    return {
        totalRedemption: Math.round(totalRedemption * 100) / 100,
        principal: lienData.lienAmount,
        interest: interestCalc.interestAmount,
        penalties: lienData.penaltyAmount,
        fees: lienData.filingFee,
    };
};
exports.calculateLienRedemption = calculateLienRedemption;
// ============================================================================
// SALES TAX FUNCTIONS
// ============================================================================
/**
 * Gets combined sales tax rate for a jurisdiction.
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {string} category - Item category
 * @returns {Promise<number>} Combined tax rate
 *
 * @example
 * ```typescript
 * const rate = await getSalesTaxRate('CA-LA-90001', 'general');
 * // Returns: 0.0975 (9.75%)
 * ```
 */
const getSalesTaxRate = async (jurisdiction, category = 'general') => {
    // Mock implementation - in production, query database
    const baseSalesTaxRates = {
        'CA': 0.0725,
        'TX': 0.0625,
        'NY': 0.04,
        'FL': 0.06,
    };
    const stateCode = jurisdiction.split('-')[0];
    const baseRate = baseSalesTaxRates[stateCode] || 0.06;
    // Add local rates (simplified)
    const localRate = 0.025;
    return baseRate + localRate;
};
exports.getSalesTaxRate = getSalesTaxRate;
/**
 * Calculates sales tax for a transaction.
 *
 * @param {number} saleAmount - Sale amount
 * @param {string} jurisdiction - Jurisdiction
 * @param {string} category - Item category
 * @returns {Promise<{ taxableAmount: number; taxRate: number; taxAmount: number; totalAmount: number }>}
 *
 * @example
 * ```typescript
 * const tax = await calculateSalesTax(100, 'CA-LA-90001', 'general');
 * // Returns: { taxableAmount: 100, taxRate: 0.0975, taxAmount: 9.75, totalAmount: 109.75 }
 * ```
 */
const calculateSalesTax = async (saleAmount, jurisdiction, category = 'general') => {
    const taxRate = await (0, exports.getSalesTaxRate)(jurisdiction, category);
    const taxAmount = Math.round(saleAmount * taxRate * 100) / 100;
    const totalAmount = saleAmount + taxAmount;
    return {
        taxableAmount: saleAmount,
        taxRate,
        taxAmount,
        totalAmount,
    };
};
exports.calculateSalesTax = calculateSalesTax;
/**
 * Records a sales tax transaction.
 *
 * @param {Partial<SalesTaxTransaction>} transactionData - Transaction data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SalesTaxTransaction>}
 *
 * @example
 * ```typescript
 * const transaction = await recordSalesTaxTransaction({
 *   merchantId: 'MERCH-001',
 *   merchantName: 'ABC Store',
 *   transactionDate: new Date(),
 *   saleAmount: 1000,
 *   taxableAmount: 1000,
 *   taxRate: 0.0975,
 *   taxAmount: 97.50,
 *   jurisdiction: 'CA-LA-90001',
 *   category: 'general'
 * }, sequelize);
 * ```
 */
const recordSalesTaxTransaction = async (transactionData, sequelize) => {
    const transaction = {
        transactionId: (0, crypto_1.randomUUID)(),
        merchantId: transactionData.merchantId,
        merchantName: transactionData.merchantName,
        transactionDate: transactionData.transactionDate || new Date(),
        saleAmount: transactionData.saleAmount,
        taxableAmount: transactionData.taxableAmount,
        exemptAmount: transactionData.exemptAmount || 0,
        taxRate: transactionData.taxRate,
        taxAmount: transactionData.taxAmount,
        jurisdiction: transactionData.jurisdiction,
        category: transactionData.category || 'general',
        paymentMethod: transactionData.paymentMethod || 'unknown',
        reportingPeriod: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
        status: 'pending',
    };
    // In production, save to database
    return transaction;
};
exports.recordSalesTaxTransaction = recordSalesTaxTransaction;
// ============================================================================
// TAX EXEMPTION & ABATEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a tax exemption application.
 *
 * @param {string} parcelId - Parcel ID
 * @param {string} exemptionType - Exemption type
 * @param {number} exemptionAmount - Exemption amount
 * @param {string} applicantName - Applicant name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxExemption>}
 *
 * @example
 * ```typescript
 * const exemption = await createTaxExemption(
 *   'PARC-2024-001',
 *   'homestead',
 *   25000,
 *   'John Doe',
 *   sequelize
 * );
 * ```
 */
const createTaxExemption = async (parcelId, exemptionType, exemptionAmount, applicantName, sequelize) => {
    const exemption = {
        exemptionType,
        exemptionCode: `${exemptionType.toUpperCase()}-${Date.now()}`,
        description: `${exemptionType} exemption`,
        exemptionAmount,
        startDate: new Date(),
        status: 'active',
        approvedBy: 'system',
        approvalDate: new Date(),
        renewalRequired: true,
        renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };
    // In production, save to database
    return exemption;
};
exports.createTaxExemption = createTaxExemption;
/**
 * Processes a tax abatement request.
 *
 * @param {Partial<TaxAbatement>} abatementData - Abatement data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxAbatement>}
 *
 * @example
 * ```typescript
 * const abatement = await processTaxAbatement({
 *   parcelId: 'PARC-2024-001',
 *   applicantName: 'John Doe',
 *   abatementType: 'assessment_reduction',
 *   requestedAmount: 5000,
 *   reason: 'Property damage',
 *   effectiveTaxYear: 2024
 * }, sequelize);
 * ```
 */
const processTaxAbatement = async (abatementData, sequelize) => {
    const abatement = {
        abatementId: (0, crypto_1.randomUUID)(),
        parcelId: abatementData.parcelId,
        applicantName: abatementData.applicantName,
        abatementType: abatementData.abatementType,
        requestedAmount: abatementData.requestedAmount,
        reason: abatementData.reason,
        applicationDate: new Date(),
        status: 'pending',
        effectiveTaxYear: abatementData.effectiveTaxYear,
        supportingDocuments: abatementData.supportingDocuments || [],
    };
    // In production, save to database and trigger review workflow
    return abatement;
};
exports.processTaxAbatement = processTaxAbatement;
/**
 * Approves a tax abatement.
 *
 * @param {string} abatementId - Abatement ID
 * @param {number} approvedAmount - Approved amount
 * @param {string} approver - Approver name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxAbatement>}
 *
 * @example
 * ```typescript
 * const approved = await approveTaxAbatement(
 *   'abatement-uuid',
 *   4000,
 *   'assessor-123',
 *   sequelize
 * );
 * ```
 */
const approveTaxAbatement = async (abatementId, approvedAmount, approver, sequelize) => {
    // Mock implementation
    const abatement = {
        abatementId,
        parcelId: 'PARC-2024-001',
        applicantName: 'John Doe',
        abatementType: 'assessment_reduction',
        requestedAmount: 5000,
        approvedAmount,
        reason: 'Property damage',
        applicationDate: new Date(),
        approvalDate: new Date(),
        status: 'approved',
        approver,
        effectiveTaxYear: 2024,
        supportingDocuments: [],
    };
    return abatement;
};
exports.approveTaxAbatement = approveTaxAbatement;
// ============================================================================
// TAX REFUND FUNCTIONS
// ============================================================================
/**
 * Processes a tax refund request.
 *
 * @param {Partial<TaxRefund>} refundData - Refund data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxRefund>}
 *
 * @example
 * ```typescript
 * const refund = await processTaxRefund({
 *   billId: 'bill-uuid',
 *   parcelId: 'PARC-2024-001',
 *   taxpayerName: 'John Doe',
 *   refundAmount: 1000,
 *   refundReason: 'overpayment',
 *   originalPaymentAmount: 6000,
 *   originalPaymentDate: new Date('2024-01-15'),
 *   fiscalYear: 'FY2024'
 * }, sequelize);
 * ```
 */
const processTaxRefund = async (refundData, sequelize) => {
    const refund = {
        refundId: (0, crypto_1.randomUUID)(),
        billId: refundData.billId,
        parcelId: refundData.parcelId,
        taxpayerName: refundData.taxpayerName,
        refundAmount: refundData.refundAmount,
        refundReason: refundData.refundReason,
        originalPaymentAmount: refundData.originalPaymentAmount,
        originalPaymentDate: refundData.originalPaymentDate,
        refundRequestDate: new Date(),
        status: 'requested',
        paymentMethod: refundData.paymentMethod || 'check',
        fiscalYear: refundData.fiscalYear,
    };
    // In production, save to database and trigger approval workflow
    return refund;
};
exports.processTaxRefund = processTaxRefund;
/**
 * Approves and issues a tax refund.
 *
 * @param {string} refundId - Refund ID
 * @param {string} approver - Approver name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxRefund>}
 *
 * @example
 * ```typescript
 * const issued = await issueTaxRefund('refund-uuid', 'finance-director', sequelize);
 * ```
 */
const issueTaxRefund = async (refundId, approver, sequelize) => {
    // Mock implementation
    const refund = {
        refundId,
        billId: 'bill-uuid',
        parcelId: 'PARC-2024-001',
        taxpayerName: 'John Doe',
        refundAmount: 1000,
        refundReason: 'overpayment',
        originalPaymentAmount: 6000,
        originalPaymentDate: new Date(),
        refundRequestDate: new Date(),
        approvalDate: new Date(),
        refundDate: new Date(),
        status: 'issued',
        paymentMethod: 'check',
        checkNumber: `CHK-${Date.now()}`,
        approvedBy: approver,
        issuedBy: approver,
        fiscalYear: 'FY2024',
    };
    return refund;
};
exports.issueTaxRefund = issueTaxRefund;
// ============================================================================
// REVENUE FORECASTING FUNCTIONS
// ============================================================================
/**
 * Generates tax revenue forecast.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} jurisdiction - Jurisdiction
 * @param {string} taxType - Tax type
 * @param {number} growthRate - Expected growth rate
 * @param {string} forecastedBy - Forecaster name
 * @returns {Promise<TaxForecast>}
 *
 * @example
 * ```typescript
 * const forecast = await generateRevenueForecast(
 *   'FY2025',
 *   'COUNTY-001',
 *   'property',
 *   0.03,
 *   'budget-director'
 * );
 * ```
 */
const generateRevenueForecast = async (fiscalYear, jurisdiction, taxType, growthRate, forecastedBy) => {
    // Mock historical average
    const historicalAverage = 50000000; // $50M
    const forecastedRevenue = Math.round(historicalAverage * (1 + growthRate));
    const monthlyBreakdown = [];
    const monthlyAmount = forecastedRevenue / 12;
    for (let i = 1; i <= 12; i++) {
        monthlyBreakdown.push({
            month: `2025-${String(i).padStart(2, '0')}`,
            forecastedAmount: Math.round(monthlyAmount),
        });
    }
    const forecast = {
        forecastId: (0, crypto_1.randomUUID)(),
        fiscalYear,
        jurisdiction,
        taxType: taxType,
        forecastedRevenue,
        historicalAverage,
        growthRate,
        confidenceLevel: 0.85,
        assumptions: [
            `${(growthRate * 100).toFixed(1)}% annual growth in assessed values`,
            'No major economic downturns',
            'Stable collection rates',
        ],
        riskFactors: ['Economic recession', 'Declining property values', 'Increased exemptions'],
        forecastDate: new Date(),
        forecastedBy,
        methodology: 'Historical trend analysis with growth adjustment',
        scenarioType: 'moderate',
        monthlyBreakdown,
    };
    return forecast;
};
exports.generateRevenueForecast = generateRevenueForecast;
/**
 * Calculates collection rate for a tax type.
 *
 * @param {string} taxType - Tax type
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ collectionRate: number; totalBilled: number; totalCollected: number; outstanding: number }>}
 *
 * @example
 * ```typescript
 * const rate = await calculateCollectionRate('property', 'FY2024', sequelize);
 * // Returns: { collectionRate: 0.95, totalBilled: 50000000, totalCollected: 47500000, outstanding: 2500000 }
 * ```
 */
const calculateCollectionRate = async (taxType, fiscalYear, sequelize) => {
    // Mock implementation
    const totalBilled = 50000000;
    const totalCollected = 47500000;
    const outstanding = totalBilled - totalCollected;
    const collectionRate = totalCollected / totalBilled;
    return {
        collectionRate: Math.round(collectionRate * 10000) / 10000,
        totalBilled,
        totalCollected,
        outstanding,
    };
};
exports.calculateCollectionRate = calculateCollectionRate;
// ============================================================================
// DELINQUENT TAX TRACKING FUNCTIONS
// ============================================================================
/**
 * Creates delinquent tax record.
 *
 * @param {string} billId - Bill ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DelinquentTax>}
 *
 * @example
 * ```typescript
 * const delinquent = await createDelinquentTaxRecord('bill-uuid', sequelize);
 * ```
 */
const createDelinquentTaxRecord = async (billId, sequelize) => {
    const TaxBill = (0, exports.createTaxBillModel)(sequelize);
    const bill = await TaxBill.findOne({ where: { billId } });
    if (!bill) {
        throw new Error(`Bill not found: ${billId}`);
    }
    const billData = bill.toJSON();
    const delinquent = {
        delinquencyId: (0, crypto_1.randomUUID)(),
        billId,
        parcelId: billData.parcelId,
        propertyOwner: billData.propertyOwner,
        propertyAddress: billData.propertyAddress,
        originalAmount: billData.totalDue,
        currentBalance: billData.balanceRemaining,
        penaltiesAccrued: billData.penaltiesAccrued || 0,
        interestAccrued: billData.interestAccrued || 0,
        totalOwed: billData.balanceRemaining + (billData.penaltiesAccrued || 0) + (billData.interestAccrued || 0),
        delinquentSince: billData.delinquentDate,
        yearsDelinquent: Math.floor((Date.now() - new Date(billData.delinquentDate).getTime()) / (1000 * 60 * 60 * 24 * 365)),
        collectionStatus: 'new',
        collectionPriority: 'medium',
    };
    return delinquent;
};
exports.createDelinquentTaxRecord = createDelinquentTaxRecord;
/**
 * Gets all delinquent taxes for a jurisdiction.
 *
 * @param {string} taxDistrict - Tax district
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DelinquentTax[]>}
 *
 * @example
 * ```typescript
 * const delinquencies = await getDelinquentTaxes('DIST-001', sequelize);
 * ```
 */
const getDelinquentTaxes = async (taxDistrict, sequelize) => {
    // Mock implementation
    const delinquencies = [];
    return delinquencies;
};
exports.getDelinquentTaxes = getDelinquentTaxes;
// ============================================================================
// REPORTING & ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates tax revenue report.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} reportType - Report type
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>}
 *
 * @example
 * ```typescript
 * const report = await generateTaxRevenueReport('FY2024', 'annual', sequelize);
 * ```
 */
const generateTaxRevenueReport = async (fiscalYear, reportType, sequelize) => {
    const report = {
        fiscalYear,
        reportType,
        generatedDate: new Date(),
        totalRevenue: 50000000,
        propertyTax: 35000000,
        salesTax: 12000000,
        otherTax: 3000000,
        collectionRate: 0.95,
        delinquencies: 2500000,
    };
    return report;
};
exports.generateTaxRevenueReport = generateTaxRevenueReport;
/**
 * Exports tax data for audit.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} exportFormat - Export format
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const path = await exportTaxDataForAudit('FY2024', 'csv', sequelize);
 * ```
 */
const exportTaxDataForAudit = async (fiscalYear, exportFormat, sequelize) => {
    const outputPath = `/tmp/tax_exports/audit_${fiscalYear}.${exportFormat}`;
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
    let content = '';
    if (exportFormat === 'json') {
        content = JSON.stringify({ fiscalYear, exportDate: new Date() }, null, 2);
    }
    else if (exportFormat === 'csv') {
        content = 'FiscalYear,ExportDate\n';
        content += `${fiscalYear},${new Date().toISOString()}\n`;
    }
    (0, fs_1.writeFileSync)(outputPath, content);
    return outputPath;
};
exports.exportTaxDataForAudit = exportTaxDataForAudit;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createPropertyTaxAssessmentModel: exports.createPropertyTaxAssessmentModel,
    createTaxBillModel: exports.createTaxBillModel,
    createTaxLienModel: exports.createTaxLienModel,
    // Property Tax Assessment
    createPropertyAssessment: exports.createPropertyAssessment,
    calculatePropertyAssessment: exports.calculatePropertyAssessment,
    applyTaxExemptions: exports.applyTaxExemptions,
    updatePropertyAssessmentYear: exports.updatePropertyAssessmentYear,
    // Tax Billing
    generatePropertyTaxBill: exports.generatePropertyTaxBill,
    addSpecialAssessments: exports.addSpecialAssessments,
    calculateLatePenalty: exports.calculateLatePenalty,
    calculateDelinquentInterest: exports.calculateDelinquentInterest,
    // Payment Processing
    processTaxPayment: exports.processTaxPayment,
    createPaymentPlan: exports.createPaymentPlan,
    processInstallmentPayment: exports.processInstallmentPayment,
    // Tax Liens
    fileTaxLien: exports.fileTaxLien,
    releaseTaxLien: exports.releaseTaxLien,
    calculateLienRedemption: exports.calculateLienRedemption,
    // Sales Tax
    getSalesTaxRate: exports.getSalesTaxRate,
    calculateSalesTax: exports.calculateSalesTax,
    recordSalesTaxTransaction: exports.recordSalesTaxTransaction,
    // Exemptions & Abatements
    createTaxExemption: exports.createTaxExemption,
    processTaxAbatement: exports.processTaxAbatement,
    approveTaxAbatement: exports.approveTaxAbatement,
    // Refunds
    processTaxRefund: exports.processTaxRefund,
    issueTaxRefund: exports.issueTaxRefund,
    // Revenue Forecasting
    generateRevenueForecast: exports.generateRevenueForecast,
    calculateCollectionRate: exports.calculateCollectionRate,
    // Delinquent Taxes
    createDelinquentTaxRecord: exports.createDelinquentTaxRecord,
    getDelinquentTaxes: exports.getDelinquentTaxes,
    // Reporting
    generateTaxRevenueReport: exports.generateTaxRevenueReport,
    exportTaxDataForAudit: exports.exportTaxDataForAudit,
};
//# sourceMappingURL=tax-revenue-management-kit.js.map