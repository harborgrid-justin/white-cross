/**
 * LOC: WC-COMP-TRADING-CREDIT-001
 * File: /reuse/trading/composites/credit-risk-analysis-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../credit-analysis-kit
 *   - decimal.js (v10.x)
 *
 * DOWNSTREAM (imported by):
 *   - Credit risk controllers
 *   - Fixed income analytics services
 *   - Portfolio risk management systems
 *   - Counterparty risk engines
 *   - Regulatory capital calculators
 */

/**
 * File: /reuse/trading/composites/credit-risk-analysis-composite.ts
 * Locator: WC-COMP-TRADING-CREDIT-001
 * Purpose: Bloomberg Terminal Credit Risk Analytics Composite - Credit analysis, CDS pricing, CVA/DVA, counterparty risk
 *
 * Upstream: @nestjs/common, sequelize, credit-analysis-kit, decimal.js
 * Downstream: Credit controllers, risk services, fixed income processors, regulatory reporting
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Decimal.js 10.x
 * Exports: 45 composed functions for institutional-grade credit risk analytics
 *
 * LLM Context: Bloomberg Terminal-level credit analytics composite for trading platform.
 * Provides comprehensive credit risk assessment, default probability modeling, CDS pricing,
 * credit spread analysis, recovery rate estimation, CVA/DVA calculations, counterparty
 * exposure analytics, credit portfolio risk, and regulatory capital calculations.
 * All business logic uses production-ready credit models with arbitrary precision arithmetic.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';
import Decimal from 'decimal.js';
import * as CreditKit from '../credit-analysis-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Credit analysis methodology
 */
export enum CreditAnalysisMethodology {
  MERTON_STRUCTURAL = 'merton_structural',
  KMV_EDF = 'kmv_edf',
  BLACK_COX = 'black_cox',
  REDUCED_FORM = 'reduced_form',
  CREDITMETRICS = 'creditmetrics',
  CREDIT_RISK_PLUS = 'credit_risk_plus',
  ALTMAN_Z_SCORE = 'altman_z_score',
  CUSTOM_SCORING = 'custom_scoring',
}

/**
 * Credit exposure type
 */
export enum ExposureType {
  CURRENT_EXPOSURE = 'current_exposure',
  EXPECTED_EXPOSURE = 'expected_exposure',
  POTENTIAL_FUTURE_EXPOSURE = 'potential_future_exposure',
  EXPECTED_POSITIVE_EXPOSURE = 'expected_positive_exposure',
  EXPOSURE_AT_DEFAULT = 'exposure_at_default',
  EFFECTIVE_EXPECTED_EXPOSURE = 'effective_expected_exposure',
}

/**
 * CDS contract type
 */
export enum CDSContractType {
  SINGLE_NAME = 'single_name',
  INDEX = 'index',
  TRANCHE = 'tranche',
  BASKET = 'basket',
  SOVEREIGN = 'sovereign',
  LOAN_CDS = 'loan_cds',
}

/**
 * Credit event type
 */
export enum CreditEventType {
  BANKRUPTCY = 'bankruptcy',
  FAILURE_TO_PAY = 'failure_to_pay',
  RESTRUCTURING = 'restructuring',
  OBLIGATION_ACCELERATION = 'obligation_acceleration',
  OBLIGATION_DEFAULT = 'obligation_default',
  REPUDIATION_MORATORIUM = 'repudiation_moratorium',
}

/**
 * Debt seniority classification
 */
export enum DebtSeniority {
  SENIOR_SECURED = 'senior_secured',
  SENIOR_UNSECURED = 'senior_unsecured',
  SUBORDINATED = 'subordinated',
  JUNIOR_SUBORDINATED = 'junior_subordinated',
  EQUITY = 'equity',
}

/**
 * Portfolio risk measure
 */
export enum PortfolioRiskMeasure {
  VALUE_AT_RISK = 'value_at_risk',
  EXPECTED_SHORTFALL = 'expected_shortfall',
  EXPECTED_LOSS = 'expected_loss',
  UNEXPECTED_LOSS = 'unexpected_loss',
  ECONOMIC_CAPITAL = 'economic_capital',
  RAROC = 'raroc',
}

/**
 * Regulatory framework
 */
export enum RegulatoryFramework {
  BASEL_III = 'basel_iii',
  BASEL_IV = 'basel_iv',
  IFRS_9 = 'ifrs_9',
  CECL = 'cecl',
  CCAR = 'ccar',
  FRTB = 'frtb',
}

// ============================================================================
// SEQUELIZE MODEL: CreditAnalysis
// ============================================================================

/**
 * TypeScript interface for CreditAnalysis attributes
 */
export interface CreditAnalysisAttributes {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  analysisDate: Date;
  methodology: CreditAnalysisMethodology;
  creditRating: CreditKit.CreditRating;
  creditScore: number;
  zScore: number;
  distanceToDefault: number;
  probabilityOfDefault: number;
  expectedLoss: number;
  lossGivenDefault: number;
  exposureAtDefault: number;
  recoveryRate: number;
  creditSpread: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  financialMetrics: Record<string, any>;
  modelParameters: Record<string, any>;
  sensitivityAnalysis: Record<string, any>;
  analystNotes: string | null;
  nextReviewDate: Date;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreditAnalysisCreationAttributes extends Optional<CreditAnalysisAttributes, 'id' | 'analystNotes' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CreditAnalysis
 * Comprehensive credit risk analysis for counterparties
 */
export class CreditAnalysis extends Model<CreditAnalysisAttributes, CreditAnalysisCreationAttributes> implements CreditAnalysisAttributes {
  declare id: string;
  declare counterpartyId: string;
  declare counterpartyName: string;
  declare analysisDate: Date;
  declare methodology: CreditAnalysisMethodology;
  declare creditRating: CreditKit.CreditRating;
  declare creditScore: number;
  declare zScore: number;
  declare distanceToDefault: number;
  declare probabilityOfDefault: number;
  declare expectedLoss: number;
  declare lossGivenDefault: number;
  declare exposureAtDefault: number;
  declare recoveryRate: number;
  declare creditSpread: number;
  declare riskLevel: 'low' | 'medium' | 'high' | 'critical';
  declare financialMetrics: Record<string, any>;
  declare modelParameters: Record<string, any>;
  declare sensitivityAnalysis: Record<string, any>;
  declare analystNotes: string | null;
  declare nextReviewDate: Date;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getExposures: HasManyGetAssociationsMixin<CreditExposure>;
  declare addExposure: HasManyAddAssociationMixin<CreditExposure, string>;
  declare getCDSContracts: HasManyGetAssociationsMixin<CDSContract>;
  declare getMigrations: HasManyGetAssociationsMixin<CreditMigration>;

  declare static associations: {
    exposures: Association<CreditAnalysis, CreditExposure>;
    cdsContracts: Association<CreditAnalysis, CDSContract>;
    migrations: Association<CreditAnalysis, CreditMigration>;
  };

  /**
   * Initialize CreditAnalysis with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CreditAnalysis {
    CreditAnalysis.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        counterpartyId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'counterparty_id',
        },
        counterpartyName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'counterparty_name',
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'analysis_date',
        },
        methodology: {
          type: DataTypes.ENUM(...Object.values(CreditAnalysisMethodology)),
          allowNull: false,
          field: 'methodology',
        },
        creditRating: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'credit_rating',
        },
        creditScore: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'credit_score',
        },
        zScore: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'z_score',
        },
        distanceToDefault: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'distance_to_default',
        },
        probabilityOfDefault: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'probability_of_default',
        },
        expectedLoss: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_loss',
        },
        lossGivenDefault: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'loss_given_default',
        },
        exposureAtDefault: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'exposure_at_default',
        },
        recoveryRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'recovery_rate',
        },
        creditSpread: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'credit_spread',
        },
        riskLevel: {
          type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
          allowNull: false,
          field: 'risk_level',
        },
        financialMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'financial_metrics',
        },
        modelParameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'model_parameters',
        },
        sensitivityAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'sensitivity_analysis',
        },
        analystNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'analyst_notes',
        },
        nextReviewDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'next_review_date',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'credit_analyses',
        modelName: 'CreditAnalysis',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['counterparty_id'] },
          { fields: ['credit_rating'] },
          { fields: ['risk_level'] },
          { fields: ['analysis_date'] },
          { fields: ['methodology'] },
        ],
      }
    );

    return CreditAnalysis;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CreditExposure
// ============================================================================

/**
 * TypeScript interface for CreditExposure attributes
 */
export interface CreditExposureAttributes {
  id: string;
  creditAnalysisId: string;
  exposureType: ExposureType;
  exposureDate: Date;
  currentExposure: number;
  potentialFutureExposure: number;
  expectedExposure: number;
  expectedPositiveExposure: number;
  maxPFE: number;
  collateralAmount: number;
  netExposure: number;
  exposureProfile: Record<string, any>[];
  riskMitigants: Record<string, any>[];
  nettingAgreement: boolean;
  masterAgreementType: string | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreditExposureCreationAttributes extends Optional<CreditExposureAttributes, 'id' | 'masterAgreementType' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CreditExposure
 * Counterparty credit exposure tracking
 */
export class CreditExposure extends Model<CreditExposureAttributes, CreditExposureCreationAttributes> implements CreditExposureAttributes {
  declare id: string;
  declare creditAnalysisId: string;
  declare exposureType: ExposureType;
  declare exposureDate: Date;
  declare currentExposure: number;
  declare potentialFutureExposure: number;
  declare expectedExposure: number;
  declare expectedPositiveExposure: number;
  declare maxPFE: number;
  declare collateralAmount: number;
  declare netExposure: number;
  declare exposureProfile: Record<string, any>[];
  declare riskMitigants: Record<string, any>[];
  declare nettingAgreement: boolean;
  declare masterAgreementType: string | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getCreditAnalysis: BelongsToGetAssociationMixin<CreditAnalysis>;

  declare static associations: {
    creditAnalysis: Association<CreditExposure, CreditAnalysis>;
  };

  /**
   * Initialize CreditExposure with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CreditExposure {
    CreditExposure.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        creditAnalysisId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'credit_analyses',
            key: 'id',
          },
          field: 'credit_analysis_id',
        },
        exposureType: {
          type: DataTypes.ENUM(...Object.values(ExposureType)),
          allowNull: false,
          field: 'exposure_type',
        },
        exposureDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'exposure_date',
        },
        currentExposure: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'current_exposure',
        },
        potentialFutureExposure: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'potential_future_exposure',
        },
        expectedExposure: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_exposure',
        },
        expectedPositiveExposure: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_positive_exposure',
        },
        maxPFE: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'max_pfe',
        },
        collateralAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'collateral_amount',
        },
        netExposure: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'net_exposure',
        },
        exposureProfile: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'exposure_profile',
        },
        riskMitigants: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'risk_mitigants',
        },
        nettingAgreement: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'netting_agreement',
        },
        masterAgreementType: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'master_agreement_type',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'credit_exposures',
        modelName: 'CreditExposure',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['credit_analysis_id'] },
          { fields: ['exposure_type'] },
          { fields: ['exposure_date'] },
        ],
      }
    );

    return CreditExposure;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CDSContract
// ============================================================================

/**
 * TypeScript interface for CDSContract attributes
 */
export interface CDSContractAttributes {
  id: string;
  creditAnalysisId: string;
  contractType: CDSContractType;
  referenceEntity: string;
  notional: number;
  spread: number;
  upfrontPayment: number;
  maturityDate: Date;
  effectiveDate: Date;
  paymentFrequency: number;
  recoveryRate: number;
  fairSpread: number;
  presentValue: number;
  cs01: number;
  convexity: number;
  impliedDefaultProbability: number;
  defaultCurve: Record<string, any>[];
  marketData: Record<string, any>;
  pricing: Record<string, any>;
  greeks: Record<string, any>;
  isProtectionBuyer: boolean;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CDSContractCreationAttributes extends Optional<CDSContractAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CDSContract
 * Credit Default Swap contract tracking and pricing
 */
export class CDSContract extends Model<CDSContractAttributes, CDSContractCreationAttributes> implements CDSContractAttributes {
  declare id: string;
  declare creditAnalysisId: string;
  declare contractType: CDSContractType;
  declare referenceEntity: string;
  declare notional: number;
  declare spread: number;
  declare upfrontPayment: number;
  declare maturityDate: Date;
  declare effectiveDate: Date;
  declare paymentFrequency: number;
  declare recoveryRate: number;
  declare fairSpread: number;
  declare presentValue: number;
  declare cs01: number;
  declare convexity: number;
  declare impliedDefaultProbability: number;
  declare defaultCurve: Record<string, any>[];
  declare marketData: Record<string, any>;
  declare pricing: Record<string, any>;
  declare greeks: Record<string, any>;
  declare isProtectionBuyer: boolean;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getCreditAnalysis: BelongsToGetAssociationMixin<CreditAnalysis>;

  declare static associations: {
    creditAnalysis: Association<CDSContract, CreditAnalysis>;
  };

  /**
   * Initialize CDSContract with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CDSContract {
    CDSContract.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        creditAnalysisId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'credit_analyses',
            key: 'id',
          },
          field: 'credit_analysis_id',
        },
        contractType: {
          type: DataTypes.ENUM(...Object.values(CDSContractType)),
          allowNull: false,
          field: 'contract_type',
        },
        referenceEntity: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'reference_entity',
        },
        notional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'notional',
        },
        spread: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'spread',
        },
        upfrontPayment: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'upfront_payment',
        },
        maturityDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'maturity_date',
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'effective_date',
        },
        paymentFrequency: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 4,
          field: 'payment_frequency',
        },
        recoveryRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'recovery_rate',
        },
        fairSpread: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'fair_spread',
        },
        presentValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'present_value',
        },
        cs01: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'cs01',
        },
        convexity: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'convexity',
        },
        impliedDefaultProbability: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'implied_default_probability',
        },
        defaultCurve: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'default_curve',
        },
        marketData: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'market_data',
        },
        pricing: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'pricing',
        },
        greeks: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'greeks',
        },
        isProtectionBuyer: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_protection_buyer',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'cds_contracts',
        modelName: 'CDSContract',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['credit_analysis_id'] },
          { fields: ['contract_type'] },
          { fields: ['reference_entity'] },
          { fields: ['maturity_date'] },
        ],
      }
    );

    return CDSContract;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CreditMigration
// ============================================================================

/**
 * TypeScript interface for CreditMigration attributes
 */
export interface CreditMigrationAttributes {
  id: string;
  creditAnalysisId: string;
  fromRating: CreditKit.CreditRating;
  toRating: CreditKit.CreditRating;
  migrationDate: Date;
  migrationProbability: number;
  timeHorizon: number;
  migrationMatrix: Record<string, any>;
  driftAnalysis: Record<string, any>;
  upgradeProbability: number;
  downgradeProbability: number;
  defaultProbability: number;
  ratingChangeTriggers: string[];
  impactAnalysis: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreditMigrationCreationAttributes extends Optional<CreditMigrationAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CreditMigration
 * Credit rating migration tracking and analysis
 */
export class CreditMigration extends Model<CreditMigrationAttributes, CreditMigrationCreationAttributes> implements CreditMigrationAttributes {
  declare id: string;
  declare creditAnalysisId: string;
  declare fromRating: CreditKit.CreditRating;
  declare toRating: CreditKit.CreditRating;
  declare migrationDate: Date;
  declare migrationProbability: number;
  declare timeHorizon: number;
  declare migrationMatrix: Record<string, any>;
  declare driftAnalysis: Record<string, any>;
  declare upgradeProbability: number;
  declare downgradeProbability: number;
  declare defaultProbability: number;
  declare ratingChangeTriggers: string[];
  declare impactAnalysis: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getCreditAnalysis: BelongsToGetAssociationMixin<CreditAnalysis>;

  declare static associations: {
    creditAnalysis: Association<CreditMigration, CreditAnalysis>;
  };

  /**
   * Initialize CreditMigration with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CreditMigration {
    CreditMigration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        creditAnalysisId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'credit_analyses',
            key: 'id',
          },
          field: 'credit_analysis_id',
        },
        fromRating: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'from_rating',
        },
        toRating: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'to_rating',
        },
        migrationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'migration_date',
        },
        migrationProbability: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'migration_probability',
        },
        timeHorizon: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'time_horizon',
        },
        migrationMatrix: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'migration_matrix',
        },
        driftAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'drift_analysis',
        },
        upgradeProbability: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'upgrade_probability',
        },
        downgradeProbability: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'downgrade_probability',
        },
        defaultProbability: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'default_probability',
        },
        ratingChangeTriggers: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'rating_change_triggers',
        },
        impactAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'impact_analysis',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'credit_migrations',
        modelName: 'CreditMigration',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['credit_analysis_id'] },
          { fields: ['from_rating'] },
          { fields: ['to_rating'] },
          { fields: ['migration_date'] },
        ],
      }
    );

    return CreditMigration;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PortfolioCreditRisk
// ============================================================================

/**
 * TypeScript interface for PortfolioCreditRisk attributes
 */
export interface PortfolioCreditRiskAttributes {
  id: string;
  portfolioId: string;
  portfolioName: string;
  calculationDate: Date;
  expectedLoss: number;
  unexpectedLoss: number;
  valueAtRisk: number;
  expectedShortfall: number;
  economicCapital: number;
  diversificationBenefit: number;
  concentrationRisk: number;
  defaultCorrelation: number;
  lossDistribution: Record<string, any>;
  riskContributions: Record<string, any>[];
  capitalAllocation: Record<string, any>[];
  stressScenariosResults: Record<string, any>[];
  regulatoryMetrics: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PortfolioCreditRiskCreationAttributes extends Optional<PortfolioCreditRiskAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: PortfolioCreditRisk
 * Portfolio-level credit risk metrics and analytics
 */
export class PortfolioCreditRisk extends Model<PortfolioCreditRiskAttributes, PortfolioCreditRiskCreationAttributes> implements PortfolioCreditRiskAttributes {
  declare id: string;
  declare portfolioId: string;
  declare portfolioName: string;
  declare calculationDate: Date;
  declare expectedLoss: number;
  declare unexpectedLoss: number;
  declare valueAtRisk: number;
  declare expectedShortfall: number;
  declare economicCapital: number;
  declare diversificationBenefit: number;
  declare concentrationRisk: number;
  declare defaultCorrelation: number;
  declare lossDistribution: Record<string, any>;
  declare riskContributions: Record<string, any>[];
  declare capitalAllocation: Record<string, any>[];
  declare stressScenariosResults: Record<string, any>[];
  declare regulatoryMetrics: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize PortfolioCreditRisk with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof PortfolioCreditRisk {
    PortfolioCreditRisk.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        portfolioId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'portfolio_id',
        },
        portfolioName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'portfolio_name',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculation_date',
        },
        expectedLoss: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_loss',
        },
        unexpectedLoss: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'unexpected_loss',
        },
        valueAtRisk: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'value_at_risk',
        },
        expectedShortfall: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_shortfall',
        },
        economicCapital: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'economic_capital',
        },
        diversificationBenefit: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'diversification_benefit',
        },
        concentrationRisk: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'concentration_risk',
        },
        defaultCorrelation: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'default_correlation',
        },
        lossDistribution: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'loss_distribution',
        },
        riskContributions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'risk_contributions',
        },
        capitalAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'capital_allocation',
        },
        stressScenariosResults: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'stress_scenarios_results',
        },
        regulatoryMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'regulatory_metrics',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'portfolio_credit_risk',
        modelName: 'PortfolioCreditRisk',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['calculation_date'] },
        ],
      }
    );

    return PortfolioCreditRisk;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineCreditRiskAssociations(): void {
  CreditAnalysis.hasMany(CreditExposure, {
    foreignKey: 'creditAnalysisId',
    as: 'exposures',
    onDelete: 'CASCADE',
  });

  CreditExposure.belongsTo(CreditAnalysis, {
    foreignKey: 'creditAnalysisId',
    as: 'creditAnalysis',
  });

  CreditAnalysis.hasMany(CDSContract, {
    foreignKey: 'creditAnalysisId',
    as: 'cdsContracts',
    onDelete: 'CASCADE',
  });

  CDSContract.belongsTo(CreditAnalysis, {
    foreignKey: 'creditAnalysisId',
    as: 'creditAnalysis',
  });

  CreditAnalysis.hasMany(CreditMigration, {
    foreignKey: 'creditAnalysisId',
    as: 'migrations',
    onDelete: 'CASCADE',
  });

  CreditMigration.belongsTo(CreditAnalysis, {
    foreignKey: 'creditAnalysisId',
    as: 'creditAnalysis',
  });
}

// ============================================================================
// CREDIT ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Perform comprehensive credit analysis using Altman Z-Score
 * Bloomberg Equivalent: FGRS <GO>
 */
export async function performAltmanZScoreAnalysis(
  counterpartyId: string,
  counterpartyName: string,
  financialData: CreditKit.FinancialData,
  createdBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis> {
  const zScore = CreditKit.calculateAltmanZScore(financialData);
  const creditScore = CreditKit.calculateCreditScore(financialData);
  const creditRating = CreditKit.assignCreditRating(creditScore);

  // Determine risk level based on Z-Score
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (zScore.greaterThan(2.99)) riskLevel = 'low';
  else if (zScore.greaterThan(1.81)) riskLevel = 'medium';
  else if (zScore.greaterThan(1.0)) riskLevel = 'high';
  else riskLevel = 'critical';

  // Calculate basic default probability from rating
  const pd = CreditKit.calculateImpliedDefaultProbabilityFromCDS(
    100 * (10 - creditScore / 100), // Simplified spread estimation
    0.40
  );

  const analysisDate = new Date();
  const nextReviewDate = new Date(analysisDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  return await CreditAnalysis.create(
    {
      counterpartyId,
      counterpartyName,
      analysisDate,
      methodology: CreditAnalysisMethodology.ALTMAN_Z_SCORE,
      creditRating,
      creditScore,
      zScore: zScore.toNumber(),
      distanceToDefault: 0,
      probabilityOfDefault: pd.toNumber(),
      expectedLoss: 0,
      lossGivenDefault: 0.60,
      exposureAtDefault: 0,
      recoveryRate: 0.40,
      creditSpread: 0,
      riskLevel,
      financialMetrics: financialData,
      modelParameters: { zScoreThresholds: { safe: 2.99, gray: 1.81 } },
      sensitivityAnalysis: {},
      nextReviewDate,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform Merton structural model credit analysis
 * Bloomberg Equivalent: DRSK <GO>
 */
export async function performMertonModelAnalysis(
  counterpartyId: string,
  counterpartyName: string,
  assetValue: number,
  debtValue: number,
  assetVolatility: number,
  timeToMaturity: number,
  riskFreeRate: number,
  createdBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis> {
  const dd = CreditKit.calculateDistanceToDefault(assetValue, debtValue, assetVolatility, timeToMaturity, riskFreeRate);
  const pd = CreditKit.calculateMertonDefaultProbability(assetValue, debtValue, assetVolatility, timeToMaturity, riskFreeRate);

  // Estimate credit score from distance to default
  const creditScore = Math.min(1000, Math.max(0, dd.toNumber() * 200 + 500));
  const creditRating = CreditKit.assignCreditRating(creditScore);

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (dd.greaterThan(3)) riskLevel = 'low';
  else if (dd.greaterThan(2)) riskLevel = 'medium';
  else if (dd.greaterThan(1)) riskLevel = 'high';
  else riskLevel = 'critical';

  const analysisDate = new Date();
  const nextReviewDate = new Date(analysisDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  return await CreditAnalysis.create(
    {
      counterpartyId,
      counterpartyName,
      analysisDate,
      methodology: CreditAnalysisMethodology.MERTON_STRUCTURAL,
      creditRating,
      creditScore,
      zScore: 0,
      distanceToDefault: dd.toNumber(),
      probabilityOfDefault: pd.toNumber(),
      expectedLoss: 0,
      lossGivenDefault: 0.60,
      exposureAtDefault: 0,
      recoveryRate: 0.40,
      creditSpread: 0,
      riskLevel,
      financialMetrics: {},
      modelParameters: {
        assetValue,
        debtValue,
        assetVolatility,
        timeToMaturity,
        riskFreeRate,
      },
      sensitivityAnalysis: {},
      nextReviewDate,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform KMV-Merton EDF analysis
 * Bloomberg Equivalent: DRSK <GO>
 */
export async function performKMVEDFAnalysis(
  counterpartyId: string,
  counterpartyName: string,
  assetValue: number,
  shortTermDebt: number,
  longTermDebt: number,
  assetVolatility: number,
  assetReturn: number,
  createdBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis> {
  const debtValue = shortTermDebt + 0.5 * longTermDebt;
  const edf = CreditKit.calculateKMVDefaultProbability(assetValue, debtValue, assetVolatility, 1, assetReturn);

  const creditScore = Math.min(1000, Math.max(0, (1 - edf.toNumber()) * 1000));
  const creditRating = CreditKit.assignCreditRating(creditScore);

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (edf.lessThan(0.01)) riskLevel = 'low';
  else if (edf.lessThan(0.05)) riskLevel = 'medium';
  else if (edf.lessThan(0.20)) riskLevel = 'high';
  else riskLevel = 'critical';

  const analysisDate = new Date();
  const nextReviewDate = new Date(analysisDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  return await CreditAnalysis.create(
    {
      counterpartyId,
      counterpartyName,
      analysisDate,
      methodology: CreditAnalysisMethodology.KMV_EDF,
      creditRating,
      creditScore,
      zScore: 0,
      distanceToDefault: 0,
      probabilityOfDefault: edf.toNumber(),
      expectedLoss: 0,
      lossGivenDefault: 0.60,
      exposureAtDefault: 0,
      recoveryRate: 0.40,
      creditSpread: 0,
      riskLevel,
      financialMetrics: {},
      modelParameters: {
        assetValue,
        shortTermDebt,
        longTermDebt,
        assetVolatility,
        assetReturn,
      },
      sensitivityAnalysis: {},
      nextReviewDate,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate credit spread for counterparty
 * Bloomberg Equivalent: YAS <GO>
 */
export async function calculateCounterpartyCreditSpread(
  analysisId: string,
  bondYield: number,
  benchmarkYield: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis | null> {
  const analysis = await CreditAnalysis.findByPk(analysisId, { transaction });
  if (!analysis) return null;

  const creditSpread = CreditKit.calculateCreditSpread(bondYield, benchmarkYield);

  await analysis.update(
    {
      creditSpread: creditSpread.toNumber(),
      updatedBy,
    },
    { transaction }
  );

  return analysis;
}

/**
 * Update recovery rate estimation
 */
export async function updateRecoveryRateEstimate(
  analysisId: string,
  seniority: 'senior-secured' | 'senior-unsecured' | 'subordinated' | 'junior',
  collateralValue: number,
  exposureAtDefault: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis | null> {
  const analysis = await CreditAnalysis.findByPk(analysisId, { transaction });
  if (!analysis) return null;

  const recoveryRate = CreditKit.estimateSeniorityRecoveryRate(seniority, collateralValue, exposureAtDefault);
  const lgd = new Decimal(1).minus(recoveryRate);

  await analysis.update(
    {
      recoveryRate: recoveryRate.toNumber(),
      lossGivenDefault: lgd.toNumber(),
      updatedBy,
    },
    { transaction }
  );

  return analysis;
}

/**
 * Get credit analyses by rating
 */
export async function getCreditAnalysesByRating(
  rating: CreditKit.CreditRating,
  transaction?: Transaction
): Promise<CreditAnalysis[]> {
  return await CreditAnalysis.findAll({
    where: { creditRating: rating, isActive: true },
    order: [['analysisDate', 'DESC']],
    transaction,
  });
}

/**
 * Get credit analyses by risk level
 */
export async function getCreditAnalysesByRiskLevel(
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  transaction?: Transaction
): Promise<CreditAnalysis[]> {
  return await CreditAnalysis.findAll({
    where: { riskLevel, isActive: true },
    order: [['probabilityOfDefault', 'DESC']],
    transaction,
  });
}

/**
 * Calculate expected loss for credit analysis
 */
export async function calculateExpectedLoss(
  analysisId: string,
  exposureAtDefault: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<CreditAnalysis | null> {
  const analysis = await CreditAnalysis.findByPk(analysisId, { transaction });
  if (!analysis) return null;

  const expectedLoss = new Decimal(exposureAtDefault)
    .times(analysis.probabilityOfDefault)
    .times(analysis.lossGivenDefault);

  await analysis.update(
    {
      exposureAtDefault,
      expectedLoss: expectedLoss.toNumber(),
      updatedBy,
    },
    { transaction }
  );

  return analysis;
}

/**
 * Classify credit quality
 */
export async function classifyCounterpartyCreditQuality(
  analysisId: string,
  transaction?: Transaction
): Promise<string> {
  const analysis = await CreditAnalysis.findByPk(analysisId, { transaction });
  if (!analysis) throw new Error('Credit analysis not found');

  const metrics: CreditKit.CreditMetrics = {
    creditScore: analysis.creditScore,
    rating: analysis.creditRating,
    probabilityOfDefault: new Decimal(analysis.probabilityOfDefault),
    expectedLoss: new Decimal(analysis.expectedLoss),
    recoveryRate: new Decimal(analysis.recoveryRate),
    riskLevel: analysis.riskLevel,
  };

  return CreditKit.classifyCreditQuality(metrics);
}

// ============================================================================
// CDS CONTRACT FUNCTIONS
// ============================================================================

/**
 * Create and price CDS contract
 * Bloomberg Equivalent: CDSW <GO>
 */
export async function createAndPriceCDSContract(
  creditAnalysisId: string,
  contractData: {
    contractType: CDSContractType;
    referenceEntity: string;
    notional: number;
    spread: number;
    maturityDate: Date;
    effectiveDate: Date;
    recoveryRate: number;
    isProtectionBuyer: boolean;
  },
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  discountRates: number[],
  createdBy: string,
  transaction?: Transaction
): Promise<CDSContract> {
  const contract: CreditKit.CDSContract = {
    notional: contractData.notional,
    spread: contractData.spread,
    maturity: (contractData.maturityDate.getTime() - contractData.effectiveDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    recoveryRate: contractData.recoveryRate,
    frequency: 4,
  };

  const fairSpread = CreditKit.calculateCDSFairSpread(defaultCurve, discountRates, contractData.recoveryRate, 4);
  const presentValue = CreditKit.calculateCDSPresentValue(contract, defaultCurve, discountRates);
  const cs01 = CreditKit.calculateCDSDuration(contract, defaultCurve, discountRates);
  const convexity = CreditKit.calculateCDSConvexity(contract, defaultCurve, discountRates);
  const impliedPD = CreditKit.calculateImpliedDefaultProbabilityFromCDS(contractData.spread, contractData.recoveryRate);

  const upfrontPayment = CreditKit.calculateCDSUpfront(
    fairSpread.toNumber(),
    contractData.spread,
    contractData.notional,
    5 // Approximate duration
  );

  return await CDSContract.create(
    {
      creditAnalysisId,
      contractType: contractData.contractType,
      referenceEntity: contractData.referenceEntity,
      notional: contractData.notional,
      spread: contractData.spread,
      upfrontPayment: upfrontPayment.toNumber(),
      maturityDate: contractData.maturityDate,
      effectiveDate: contractData.effectiveDate,
      paymentFrequency: 4,
      recoveryRate: contractData.recoveryRate,
      fairSpread: fairSpread.toNumber(),
      presentValue: presentValue.toNumber(),
      cs01: cs01.toNumber(),
      convexity: convexity.toNumber(),
      impliedDefaultProbability: impliedPD.toNumber(),
      defaultCurve: defaultCurve.tenors.map((t, i) => ({
        tenor: t,
        cumulativePD: defaultCurve.probabilities[i].toNumber(),
        marginalPD: defaultCurve.marginalProbabilities[i].toNumber(),
      })),
      marketData: {},
      pricing: {
        fairSpread: fairSpread.toNumber(),
        presentValue: presentValue.toNumber(),
      },
      greeks: {
        cs01: cs01.toNumber(),
        convexity: convexity.toNumber(),
      },
      isProtectionBuyer: contractData.isProtectionBuyer,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Price CDS index
 */
export async function priceCDSIndexContract(
  constituentSpreads: number[],
  weights: number[],
  transaction?: Transaction
): Promise<{ indexSpread: number }> {
  const indexSpread = CreditKit.priceCDSIndex(constituentSpreads, weights);

  return {
    indexSpread: indexSpread.toNumber(),
  };
}

/**
 * Calculate CDS basis (bond-CDS basis)
 * Bloomberg Equivalent: CBAS <GO>
 */
export async function calculateBondCDSBasis(
  bondSpread: number,
  cdsSpread: number,
  transaction?: Transaction
): Promise<{ basis: number }> {
  const basis = CreditKit.calculateCDSBasis(bondSpread, cdsSpread);

  return {
    basis: basis.toNumber(),
  };
}

/**
 * Bootstrap CDS curve from market quotes
 */
export async function bootstrapMarketCDSCurve(
  tenors: number[],
  spreads: number[],
  recoveryRate: number,
  discountRates: number[],
  transaction?: Transaction
): Promise<CreditKit.DefaultProbabilityCurve> {
  return CreditKit.bootstrapCDSCurve(tenors, spreads, recoveryRate, discountRates);
}

/**
 * Get active CDS contracts
 */
export async function getActiveCDSContracts(
  creditAnalysisId: string,
  transaction?: Transaction
): Promise<CDSContract[]> {
  return await CDSContract.findAll({
    where: { creditAnalysisId, isActive: true },
    order: [['maturityDate', 'ASC']],
    transaction,
  });
}

/**
 * Update CDS contract pricing
 */
export async function updateCDSContractPricing(
  contractId: string,
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  discountRates: number[],
  updatedBy: string,
  transaction?: Transaction
): Promise<CDSContract | null> {
  const cdsContract = await CDSContract.findByPk(contractId, { transaction });
  if (!cdsContract) return null;

  const contract: CreditKit.CDSContract = {
    notional: cdsContract.notional,
    spread: cdsContract.spread,
    maturity: (cdsContract.maturityDate.getTime() - cdsContract.effectiveDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    recoveryRate: cdsContract.recoveryRate,
    frequency: cdsContract.paymentFrequency,
  };

  const fairSpread = CreditKit.calculateCDSFairSpread(defaultCurve, discountRates, cdsContract.recoveryRate, cdsContract.paymentFrequency);
  const presentValue = CreditKit.calculateCDSPresentValue(contract, defaultCurve, discountRates);
  const cs01 = CreditKit.calculateCDSDuration(contract, defaultCurve, discountRates);

  await cdsContract.update(
    {
      fairSpread: fairSpread.toNumber(),
      presentValue: presentValue.toNumber(),
      cs01: cs01.toNumber(),
      updatedBy,
    },
    { transaction }
  );

  return cdsContract;
}

// ============================================================================
// CREDIT EXPOSURE FUNCTIONS
// ============================================================================

/**
 * Create credit exposure profile
 * Bloomberg Equivalent: CVA <GO>
 */
export async function createCreditExposureProfile(
  creditAnalysisId: string,
  exposureScenarios: number[][],
  timestamps: Date[],
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  collateralAmount: number,
  nettingAgreement: boolean,
  createdBy: string,
  transaction?: Transaction
): Promise<CreditExposure> {
  const profile = CreditKit.buildCreditExposureProfile(exposureScenarios, timestamps, defaultCurve);

  const timeSteps = timestamps.map((_, i) => i + 1);
  const ead = CreditKit.calculateExposureAtDefault(profile.expectedExposure, defaultCurve);

  const currentExposure = profile.expectedExposure[0] || new Decimal(0);
  const netExposure = Decimal.max(currentExposure.minus(collateralAmount), 0);

  return await CreditExposure.create(
    {
      creditAnalysisId,
      exposureType: ExposureType.EXPECTED_EXPOSURE,
      exposureDate: new Date(),
      currentExposure: currentExposure.toNumber(),
      potentialFutureExposure: profile.maxPFE.toNumber(),
      expectedExposure: profile.expectedPositiveExposure.toNumber(),
      expectedPositiveExposure: profile.expectedPositiveExposure.toNumber(),
      maxPFE: profile.maxPFE.toNumber(),
      collateralAmount,
      netExposure: netExposure.toNumber(),
      exposureProfile: timestamps.map((t, i) => ({
        timestamp: t,
        ee: profile.expectedExposure[i].toNumber(),
        pfe: profile.potentialFutureExposure[i].toNumber(),
      })),
      riskMitigants: collateralAmount > 0 ? [{ type: 'collateral', amount: collateralAmount }] : [],
      nettingAgreement,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate expected exposure (EE)
 */
export async function calculateExpectedExposureProfile(
  exposureScenarios: number[][],
  transaction?: Transaction
): Promise<{ expectedExposure: number[] }> {
  const ee = CreditKit.calculateExpectedExposure(exposureScenarios);

  return {
    expectedExposure: ee.map(e => e.toNumber()),
  };
}

/**
 * Calculate potential future exposure (PFE)
 */
export async function calculatePotentialFutureExposureProfile(
  exposureScenarios: number[][],
  percentile: number = 0.95,
  transaction?: Transaction
): Promise<{ potentialFutureExposure: number[] }> {
  const pfe = CreditKit.calculatePotentialFutureExposure(exposureScenarios, percentile);

  return {
    potentialFutureExposure: pfe.map(p => p.toNumber()),
  };
}

/**
 * Calculate exposure at default (EAD)
 */
export async function calculateCounterpartyEAD(
  exposureId: string,
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  updatedBy: string,
  transaction?: Transaction
): Promise<CreditExposure | null> {
  const exposure = await CreditExposure.findByPk(exposureId, { transaction });
  if (!exposure) return null;

  const eeProfile = exposure.exposureProfile.map(p => new Decimal(p.ee));
  const ead = CreditKit.calculateExposureAtDefault(eeProfile, defaultCurve);

  await exposure.update(
    {
      expectedExposure: ead.toNumber(),
      updatedBy,
    },
    { transaction }
  );

  return exposure;
}

/**
 * Get exposures by type
 */
export async function getExposuresByType(
  creditAnalysisId: string,
  exposureType: ExposureType,
  transaction?: Transaction
): Promise<CreditExposure[]> {
  return await CreditExposure.findAll({
    where: { creditAnalysisId, exposureType },
    order: [['exposureDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// CVA/DVA CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate Credit Value Adjustment (CVA)
 * Bloomberg Equivalent: CVA <GO>
 */
export async function calculateCounterpartyCVA(
  exposureProfile: number[],
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  recoveryRate: number,
  discountRates: number[],
  transaction?: Transaction
): Promise<{ cva: number }> {
  const eeDecimal = exposureProfile.map(e => new Decimal(e));
  const cva = CreditKit.calculateCVA(eeDecimal, defaultCurve, recoveryRate, discountRates);

  return {
    cva: cva.toNumber(),
  };
}

/**
 * Calculate Debt Value Adjustment (DVA)
 */
export async function calculateCounterpartyDVA(
  exposureProfile: number[],
  ownDefaultCurve: CreditKit.DefaultProbabilityCurve,
  ownRecoveryRate: number,
  discountRates: number[],
  transaction?: Transaction
): Promise<{ dva: number }> {
  const eeDecimal = exposureProfile.map(e => new Decimal(e));
  const dva = CreditKit.calculateDVA(eeDecimal, ownDefaultCurve, ownRecoveryRate, discountRates);

  return {
    dva: dva.toNumber(),
  };
}

/**
 * Calculate Bilateral CVA
 */
export async function calculateBilateralCVA(
  cva: number,
  dva: number,
  transaction?: Transaction
): Promise<{ bilateralCVA: number }> {
  const bilateralCVA = CreditKit.calculateBilateralCVA(new Decimal(cva), new Decimal(dva));

  return {
    bilateralCVA: bilateralCVA.toNumber(),
  };
}

/**
 * Calculate CVA sensitivities (Greeks)
 */
export async function calculateCVASensitivities(
  exposureProfile: number[],
  defaultCurve: CreditKit.DefaultProbabilityCurve,
  recoveryRate: number,
  discountRates: number[],
  transaction?: Transaction
): Promise<{
  exposureDelta: number;
  spreadDelta: number;
  recoveryDelta: number;
}> {
  const eeDecimal = exposureProfile.map(e => new Decimal(e));
  const sensitivities = CreditKit.calculateCVASensitivities(eeDecimal, defaultCurve, recoveryRate, discountRates);

  return {
    exposureDelta: sensitivities.exposureDelta.toNumber(),
    spreadDelta: sensitivities.spreadDelta.toNumber(),
    recoveryDelta: sensitivities.recoveryDelta.toNumber(),
  };
}

/**
 * Adjust CVA for wrong-way risk
 */
export async function adjustCVAForWrongWayRisk(
  baseCVA: number,
  correlation: number,
  transaction?: Transaction
): Promise<{ adjustedCVA: number }> {
  const adjustedCVA = CreditKit.adjustCVAForWrongWayRisk(new Decimal(baseCVA), correlation);

  return {
    adjustedCVA: adjustedCVA.toNumber(),
  };
}

/**
 * Calculate collateral value adjustment
 */
export async function calculateCollateralAdjustment(
  cvaWithoutCollateral: number,
  collateralAmount: number,
  averageExposure: number,
  transaction?: Transaction
): Promise<{ cvaWithCollateral: number }> {
  const cvaWithCollateral = CreditKit.calculateCollateralValueAdjustment(
    new Decimal(cvaWithoutCollateral),
    collateralAmount,
    averageExposure
  );

  return {
    cvaWithCollateral: cvaWithCollateral.toNumber(),
  };
}

// ============================================================================
// CREDIT MIGRATION FUNCTIONS
// ============================================================================

/**
 * Create credit migration analysis
 */
export async function createCreditMigrationAnalysis(
  creditAnalysisId: string,
  fromRating: CreditKit.CreditRating,
  toRating: CreditKit.CreditRating,
  migrationMatrix: CreditKit.MigrationMatrix,
  createdBy: string,
  transaction?: Transaction
): Promise<CreditMigration> {
  const migrationProb = CreditKit.calculateRatingTransitionProbability(fromRating, toRating, migrationMatrix);
  const upgradeProb = CreditKit.calculateUpgradeProbability(fromRating, migrationMatrix);
  const downgradeProb = CreditKit.calculateDowngradeProbability(fromRating, migrationMatrix);
  const drift = CreditKit.analyzeRatingDrift(migrationMatrix, fromRating);

  const defaultIndex = migrationMatrix.ratings.indexOf('D');
  const fromIndex = migrationMatrix.ratings.indexOf(fromRating);
  const defaultProb = defaultIndex !== -1 && fromIndex !== -1
    ? new Decimal(migrationMatrix.transitionProbabilities[fromIndex][defaultIndex])
    : new Decimal(0);

  return await CreditMigration.create(
    {
      creditAnalysisId,
      fromRating,
      toRating,
      migrationDate: new Date(),
      migrationProbability: migrationProb.toNumber(),
      timeHorizon: migrationMatrix.timeHorizon,
      migrationMatrix: {
        ratings: migrationMatrix.ratings,
        probabilities: migrationMatrix.transitionProbabilities,
      },
      driftAnalysis: {
        drift: drift.toNumber(),
        interpretation: drift.greaterThan(0) ? 'upgrade tendency' : 'downgrade tendency',
      },
      upgradeProbability: upgradeProb.toNumber(),
      downgradeProbability: downgradeProb.toNumber(),
      defaultProbability: defaultProb.toNumber(),
      ratingChangeTriggers: [],
      impactAnalysis: {},
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Analyze rating drift
 */
export async function analyzeCounterpartyRatingDrift(
  migrationMatrix: CreditKit.MigrationMatrix,
  currentRating: CreditKit.CreditRating,
  transaction?: Transaction
): Promise<{
  drift: number;
  tendency: string;
  upgradeProb: number;
  downgradeProb: number;
}> {
  const drift = CreditKit.analyzeRatingDrift(migrationMatrix, currentRating);
  const upgradeProb = CreditKit.calculateUpgradeProbability(currentRating, migrationMatrix);
  const downgradeProb = CreditKit.calculateDowngradeProbability(currentRating, migrationMatrix);

  return {
    drift: drift.toNumber(),
    tendency: drift.greaterThan(0) ? 'upgrade' : drift.lessThan(0) ? 'downgrade' : 'stable',
    upgradeProb: upgradeProb.toNumber(),
    downgradeProb: downgradeProb.toNumber(),
  };
}

/**
 * Get credit migrations for analysis
 */
export async function getCreditMigrations(
  creditAnalysisId: string,
  transaction?: Transaction
): Promise<CreditMigration[]> {
  return await CreditMigration.findAll({
    where: { creditAnalysisId },
    order: [['migrationDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// PORTFOLIO CREDIT RISK FUNCTIONS
// ============================================================================

/**
 * Calculate portfolio credit risk metrics
 */
export async function calculatePortfolioCreditRisk(
  portfolioId: string,
  portfolioName: string,
  exposures: number[],
  defaultProbabilities: number[],
  recoveryRates: number[],
  correlation: number,
  createdBy: string,
  transaction?: Transaction
): Promise<PortfolioCreditRisk> {
  const lossDistribution = CreditKit.calculatePortfolioLossDistribution(
    exposures,
    defaultProbabilities,
    recoveryRates,
    correlation,
    10000
  );

  const lossGivenDefaults = recoveryRates.map(r => 1 - r);
  const expectedLoss = CreditKit.calculatePortfolioExpectedLoss(exposures, defaultProbabilities, lossGivenDefaults);
  const unexpectedLoss = CreditKit.calculatePortfolioUnexpectedLoss(lossDistribution);

  const diversificationBenefit = new Decimal(0); // Simplified

  return await PortfolioCreditRisk.create(
    {
      portfolioId,
      portfolioName,
      calculationDate: new Date(),
      expectedLoss: expectedLoss.toNumber(),
      unexpectedLoss: unexpectedLoss.toNumber(),
      valueAtRisk: lossDistribution.percentile95.toNumber(),
      expectedShortfall: lossDistribution.percentile99.toNumber(),
      economicCapital: unexpectedLoss.toNumber(),
      diversificationBenefit: diversificationBenefit.toNumber(),
      concentrationRisk: 0,
      defaultCorrelation: correlation,
      lossDistribution: {
        mean: lossDistribution.mean.toNumber(),
        stdDev: lossDistribution.stdDev.toNumber(),
        percentile95: lossDistribution.percentile95.toNumber(),
        percentile99: lossDistribution.percentile99.toNumber(),
      },
      riskContributions: [],
      capitalAllocation: [],
      stressScenariosResults: [],
      regulatoryMetrics: {},
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate portfolio expected loss
 */
export async function calculatePortfolioExpectedLoss(
  exposures: number[],
  defaultProbabilities: number[],
  lossGivenDefaults: number[],
  transaction?: Transaction
): Promise<{ expectedLoss: number }> {
  const el = CreditKit.calculatePortfolioExpectedLoss(exposures, defaultProbabilities, lossGivenDefaults);

  return {
    expectedLoss: el.toNumber(),
  };
}

/**
 * Allocate economic capital to portfolio positions
 */
export async function allocatePortfolioEconomicCapital(
  portfolioId: string,
  exposures: number[],
  marginalRisks: number[],
  totalCapital: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<PortfolioCreditRisk | null> {
  const portfolio = await PortfolioCreditRisk.findOne({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });

  if (!portfolio) return null;

  const allocations = CreditKit.allocateEconomicCapital(exposures, marginalRisks, totalCapital);

  const capitalAllocation = exposures.map((exp, i) => ({
    exposure: exp,
    marginalRisk: marginalRisks[i],
    allocatedCapital: allocations[i].toNumber(),
  }));

  await portfolio.update(
    {
      capitalAllocation,
      updatedBy,
    },
    { transaction }
  );

  return portfolio;
}

/**
 * Calculate portfolio default correlation
 */
export async function calculateDefaultCorrelation(
  asset1Returns: number[],
  asset2Returns: number[],
  transaction?: Transaction
): Promise<{ correlation: number }> {
  const correlation = CreditKit.calculatePortfolioDefaultCorrelation(asset1Returns, asset2Returns);

  return {
    correlation: correlation.toNumber(),
  };
}

/**
 * Get portfolio credit risk by ID
 */
export async function getPortfolioCreditRisk(
  portfolioId: string,
  transaction?: Transaction
): Promise<PortfolioCreditRisk | null> {
  return await PortfolioCreditRisk.findOne({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// ADVANCED ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Calculate credit VaR (Value at Risk)
 */
export async function calculateCreditVaR(
  portfolioLossDistribution: { percentile95: number; percentile99: number },
  confidenceLevel: 0.95 | 0.99,
  transaction?: Transaction
): Promise<{ creditVaR: number }> {
  const creditVaR = confidenceLevel === 0.95
    ? portfolioLossDistribution.percentile95
    : portfolioLossDistribution.percentile99;

  return { creditVaR };
}

/**
 * Calculate regulatory capital requirements
 */
export async function calculateRegulatoryCapital(
  framework: RegulatoryFramework,
  exposures: number[],
  riskWeights: number[],
  transaction?: Transaction
): Promise<{ regulatoryCapital: number; rwaTotal: number }> {
  // Simplified regulatory capital calculation
  let rwaTotal = new Decimal(0);

  for (let i = 0; i < exposures.length; i++) {
    const rwa = new Decimal(exposures[i]).times(riskWeights[i]);
    rwaTotal = rwaTotal.plus(rwa);
  }

  // Basel III minimum capital ratio: 8%
  const regulatoryCapital = rwaTotal.times(0.08);

  return {
    regulatoryCapital: regulatoryCapital.toNumber(),
    rwaTotal: rwaTotal.toNumber(),
  };
}

/**
 * Perform credit stress testing
 */
export async function performCreditStressTest(
  portfolioId: string,
  stressScenarios: Array<{
    name: string;
    pdMultiplier: number;
    lgdMultiplier: number;
    correlationShift: number;
  }>,
  baseExposures: number[],
  basePDs: number[],
  baseLGDs: number[],
  baseCorrelation: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<PortfolioCreditRisk | null> {
  const portfolio = await PortfolioCreditRisk.findOne({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });

  if (!portfolio) return null;

  const stressResults = stressScenarios.map(scenario => {
    const stressedPDs = basePDs.map(pd => pd * scenario.pdMultiplier);
    const stressedLGDs = baseLGDs.map(lgd => Math.min(1, lgd * scenario.lgdMultiplier));
    const stressedCorrelation = Math.min(1, Math.max(-1, baseCorrelation + scenario.correlationShift));

    const recoveryRates = stressedLGDs.map(lgd => 1 - lgd);
    const lossDistribution = CreditKit.calculatePortfolioLossDistribution(
      baseExposures,
      stressedPDs,
      recoveryRates,
      stressedCorrelation,
      10000
    );

    return {
      scenarioName: scenario.name,
      expectedLoss: lossDistribution.mean.toNumber(),
      valueAtRisk: lossDistribution.percentile95.toNumber(),
      expectedShortfall: lossDistribution.percentile99.toNumber(),
    };
  });

  await portfolio.update(
    {
      stressScenariosResults: stressResults,
      updatedBy,
    },
    { transaction }
  );

  return portfolio;
}

/**
 * Calculate IFRS 9 expected credit loss (ECL)
 */
export async function calculateIFRS9ExpectedCreditLoss(
  exposure: number,
  probabilityOfDefault: number,
  lossGivenDefault: number,
  effectiveInterestRate: number,
  timeHorizon: number,
  transaction?: Transaction
): Promise<{
  ecl12Month: number;
  eclLifetime: number;
  stage: 1 | 2 | 3;
}> {
  // Stage 1: 12-month ECL
  const ecl12Month = new Decimal(exposure)
    .times(probabilityOfDefault)
    .times(lossGivenDefault)
    .times(new Decimal(1).div(new Decimal(1).plus(effectiveInterestRate)));

  // Lifetime ECL (simplified)
  const eclLifetime = new Decimal(exposure)
    .times(probabilityOfDefault)
    .times(lossGivenDefault)
    .times(timeHorizon);

  // Stage determination
  let stage: 1 | 2 | 3;
  if (probabilityOfDefault > 0.20) stage = 3; // Credit-impaired
  else if (probabilityOfDefault > 0.05) stage = 2; // Significant increase in credit risk
  else stage = 1; // Performing

  return {
    ecl12Month: ecl12Month.toNumber(),
    eclLifetime: eclLifetime.toNumber(),
    stage,
  };
}

// ============================================================================
// EXPORT: Initialize all models
// ============================================================================

/**
 * Initialize all credit risk models
 */
export function initializeCreditRiskModels(sequelize: Sequelize): void {
  CreditAnalysis.initModel(sequelize);
  CreditExposure.initModel(sequelize);
  CDSContract.initModel(sequelize);
  CreditMigration.initModel(sequelize);
  PortfolioCreditRisk.initModel(sequelize);
  defineCreditRiskAssociations();
}
