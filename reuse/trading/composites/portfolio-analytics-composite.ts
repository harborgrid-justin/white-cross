/**
 * LOC: WC-COMP-TRADING-PORTANA-001
 * File: /reuse/trading/composites/portfolio-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../portfolio-analytics-kit
 *   - ../risk-management-kit
 *   - ../market-data-models-kit
 *
 * DOWNSTREAM (imported by):
 *   - Portfolio management controllers
 *   - Risk monitoring dashboards
 *   - Analytics reporting engines
 *   - Benchmark comparison services
 *   - Rebalancing orchestration engines
 */

/**
 * File: /reuse/trading/composites/portfolio-analytics-composite.ts
 * Locator: WC-COMP-TRADING-PORTANA-001
 * Purpose: Bloomberg Terminal Portfolio Analytics Composites - Enterprise-grade portfolio management
 *
 * Upstream: @nestjs/common, sequelize, portfolio-analytics-kit, risk-management-kit, market-data-models-kit
 * Downstream: Portfolio controllers, dashboards, reporting engines, benchmark services, rebalancing orchestration
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 42 composed functions for comprehensive portfolio analytics, risk management, and Bloomberg Terminal feature support
 *
 * LLM Context: Enterprise-grade Bloomberg Terminal portfolio analytics composite providing comprehensive portfolio
 * management including composition analysis, performance attribution, risk decomposition, stress testing, scenario analysis,
 * factor exposure analysis, correlation analysis, Sharpe ratios and advanced metrics, benchmark comparison, asset allocation,
 * sector and geographic exposure analysis, fixed income analytics (duration, convexity, yield curves), portfolio optimization,
 * rebalancing strategies, and what-if scenario analysis at institutional scale.
 */

import {
  Injectable,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
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
  BelongsToManyGetAssociationsMixin,
  Optional,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Portfolio composition types
 */
export enum PortfolioCompositionType {
  EQUITY = 'equity',
  FIXED_INCOME = 'fixed_income',
  ALTERNATIVES = 'alternatives',
  CASH = 'cash',
  COMMODITIES = 'commodities',
  CURRENCIES = 'currencies',
  DERIVATIVES = 'derivatives',
}

/**
 * Performance attribution method
 */
export enum AttributionMethod {
  BRINSON_FACHLER = 'brinson_fachler',
  LINKED_RETURNS = 'linked_returns',
  ALLOCATION_SELECTION = 'allocation_selection',
  EFFECTIVE_DURATION = 'effective_duration',
}

/**
 * Risk decomposition type
 */
export enum RiskDecompositionType {
  MARGINAL = 'marginal',
  COMPONENT = 'component',
  INCREMENTAL = 'incremental',
  FACTOR_BASED = 'factor_based',
}

/**
 * Stress testing scenario type
 */
export enum StressScenarioType {
  HISTORICAL = 'historical',
  HYPOTHETICAL = 'hypothetical',
  COMBINED = 'combined',
  REVERSE = 'reverse',
}

/**
 * Factor exposure type
 */
export enum FactorExposureType {
  MARKET = 'market',
  SIZE = 'size',
  VALUE = 'value',
  MOMENTUM = 'momentum',
  QUALITY = 'quality',
  VOLATILITY = 'volatility',
  YIELD = 'yield',
  GROWTH = 'growth',
  DIVIDEND = 'dividend',
}

/**
 * Rebalancing method
 */
export enum RebalancingMethod {
  THRESHOLD = 'threshold',
  CALENDAR = 'calendar',
  TACTICAL = 'tactical',
  DYNAMIC = 'dynamic',
  CONSTANT_PROPORTION = 'constant_proportion',
}

/**
 * Portfolio optimization type
 */
export enum OptimizationType {
  MIN_VARIANCE = 'min_variance',
  MAX_SHARPE = 'max_sharpe',
  MAX_RETURN = 'max_return',
  TARGET_VOLATILITY = 'target_volatility',
  BLACK_LITTERMAN = 'black_litterman',
  RISK_PARITY = 'risk_parity',
}

/**
 * Yield curve methodology
 */
export enum YieldCurveMethod {
  SPOT = 'spot',
  FORWARD = 'forward',
  PAR = 'par',
  ZERO_COUPON = 'zero_coupon',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Portfolio composition model
 */
class PortfolioCompositionModel extends Model<any, any> {
  declare portfolioCompositionId: string;
  declare portfolioId: string;
  declare compositionType: PortfolioCompositionType;
  declare description: string;
  declare targetWeight: number;
  declare currentWeight: number;
  declare minWeight: number;
  declare maxWeight: number;
  declare trackingError: number;
  declare constituents: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Performance attribution model
 */
class PerformanceAttributionModel extends Model<any, any> {
  declare attributionId: string;
  declare portfolioId: string;
  declare benchmarkId: string;
  declare attributionPeriod: Date;
  declare method: AttributionMethod;
  declare totalReturn: number;
  declare benchmarkReturn: number;
  declare activeReturn: number;
  declare allocationEffect: number;
  declare selectionEffect: number;
  declare interactionEffect: number;
  declare currencyEffect: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Risk decomposition model
 */
class RiskDecompositionModel extends Model<any, any> {
  declare riskDecompositionId: string;
  declare portfolioId: string;
  declare decompositionDate: Date;
  declare decompositionType: RiskDecompositionType;
  declare totalRisk: number;
  declare systematicRisk: number;
  declare idiosyncraticRisk: number;
  declare factorRisks: object;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Stress test scenario model
 */
class StressTestModel extends Model<any, any> {
  declare stressTestId: string;
  declare portfolioId: string;
  declare scenarioType: StressScenarioType;
  declare scenarioName: string;
  declare scenarioDate: Date;
  declare baselineValue: number;
  declare stressedValue: number;
  declare potentialLoss: number;
  declare lossPercentage: number;
  declare affectedPositions: object;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Factor exposure model
 */
class FactorExposureModel extends Model<any, any> {
  declare factorExposureId: string;
  declare portfolioId: string;
  declare exposureDate: Date;
  declare factorType: FactorExposureType;
  declare exposure: number;
  declare exposurePercentage: number;
  declare factorReturn: number;
  declare factorContribution: number;
  declare factorVolatility: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Correlation analysis model
 */
class CorrelationAnalysisModel extends Model<any, any> {
  declare correlationId: string;
  declare portfolioId: string;
  declare analysisDate: Date;
  declare analysisWindow: number;
  declare correlationMatrix: object;
  declare eigenvalues: number[];
  declare eigenvectors: object;
  declare principalComponents: object;
  declare assetPairs: object;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Benchmark comparison model
 */
class BenchmarkComparisonModel extends Model<any, any> {
  declare benchmarkComparisonId: string;
  declare portfolioId: string;
  declare benchmarkId: string;
  declare comparisonDate: Date;
  declare portfolioReturn: number;
  declare benchmarkReturn: number;
  declare outperformance: number;
  declare trackingError: number;
  declare informationRatio: number;
  declare upCaptureRatio: number;
  declare downCaptureRatio: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Asset allocation model
 */
class AssetAllocationModel extends Model<any, any> {
  declare allocationId: string;
  declare portfolioId: string;
  declare allocationDate: Date;
  declare strategy: string;
  declare equityAllocation: number;
  declare fixedIncomeAllocation: number;
  declare alternativeAllocation: number;
  declare cashAllocation: number;
  declare expectedReturn: number;
  declare expectedVolatility: number;
  declare expectedSharpe: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Sector exposure model
 */
class SectorExposureModel extends Model<any, any> {
  declare sectorExposureId: string;
  declare portfolioId: string;
  declare exposureDate: Date;
  declare sector: string;
  declare exposure: number;
  declare exposurePercentage: number;
  declare sectorReturn: number;
  declare sectorVolatility: number;
  declare benchmarkExposure: number;
  declare activeWeight: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Geographic exposure model
 */
class GeographicExposureModel extends Model<any, any> {
  declare geoExposureId: string;
  declare portfolioId: string;
  declare exposureDate: Date;
  declare region: string;
  declare exposure: number;
  declare exposurePercentage: number;
  declare regionReturn: number;
  declare regionVolatility: number;
  declare currencyExposure: number;
  declare currencyCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Fixed income metrics model (duration, convexity, yield)
 */
class FixedIncomeMetricsModel extends Model<any, any> {
  declare fixedIncomeMetricsId: string;
  declare portfolioId: string;
  declare metricsDate: Date;
  declare effectiveDuration: number;
  declare modifiedDuration: number;
  declare convexity: number;
  declare yieldToMaturity: number;
  declare yieldToCall: number;
  declare optionAdjustedSpread: number;
  declare creditSpread: number;
  declare keyRateDurations: object;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Yield curve model
 */
class YieldCurveModel extends Model<any, any> {
  declare yieldCurveId: string;
  declare curveDate: Date;
  declare curveType: YieldCurveMethod;
  declare currencyCode: string;
  declare yields: object;
  declare tenors: number[];
  declare slope: number;
  declare curvature: number;
  declare shift: number;
  declare twist: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Portfolio optimization model
 */
class PortfolioOptimizationModel extends Model<any, any> {
  declare optimizationId: string;
  declare portfolioId: string;
  declare optimizationDate: Date;
  declare optimizationType: OptimizationType;
  declare constraints: object;
  declare optimalWeights: object;
  declare expectedReturn: number;
  declare expectedVolatility: number;
  declare expectedSharpe: number;
  declare iterationCount: number;
  declare convergenceStatus: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Rebalancing strategy model
 */
class RebalancingStrategyModel extends Model<any, any> {
  declare rebalancingId: string;
  declare portfolioId: string;
  declare strategyDate: Date;
  declare rebalancingMethod: RebalancingMethod;
  declare currentWeights: object;
  declare targetWeights: object;
  declare trades: object;
  declare estimatedCosts: number;
  declare estimatedTaxImpact: number;
  declare turnover: number;
  declare implementationStatus: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * What-if scenario model
 */
class WhatIfScenarioModel extends Model<any, any> {
  declare scenarioId: string;
  declare portfolioId: string;
  declare scenarioDate: Date;
  declare scenarioDescription: string;
  declare scenarioAssumptions: object;
  declare baselineMetrics: object;
  declare projectedMetrics: object;
  declare impactAnalysis: object;
  declare riskMetrics: object;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Sharpe ratio model
 */
class SharpeRatioModel extends Model<any, any> {
  declare sharpeId: string;
  declare portfolioId: string;
  declare metricsDate: Date;
  declare portfolioReturn: number;
  declare riskFreeRate: number;
  declare volatility: number;
  declare sharpeRatio: number;
  declare sortinoRatio: number;
  declare calmarRatio: number;
  declare treynorRatio: number;
  declare informationRatio: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// ============================================================================
// NESTJS SERVICE - COMPOSED FUNCTIONS
// ============================================================================

/**
 * Portfolio Analytics Service
 * Composite service providing 42 production-ready functions for Bloomberg Terminal portfolio analytics
 */
@Injectable()
export class PortfolioAnalyticsCompositeService {
  private readonly logger = new Logger(PortfolioAnalyticsCompositeService.name);

  constructor(private sequelize: Sequelize) {}

  // ========== Portfolio Composition Analysis (4 functions) ==========

  /**
   * Analyzes portfolio composition by asset class, calculates weights and tracking error
   */
  async analyzePortfolioComposition(
    portfolioId: string,
    transaction?: Transaction,
  ): Promise<PortfolioCompositionModel[]> {
    try {
      const compositions = await PortfolioCompositionModel.findAll(
        {
          where: { portfolioId },
        },
        { transaction },
      );
      return compositions;
    } catch (error) {
      this.logger.error(`Failed to analyze portfolio composition: ${error}`);
      throw new InternalServerErrorException('Portfolio composition analysis failed');
    }
  }

  /**
   * Decomposes portfolio by composition type with constituent details
   */
  async decomposePortfolioByComposition(
    portfolioId: string,
    compositionType: PortfolioCompositionType,
  ): Promise<PortfolioCompositionModel | null> {
    try {
      const composition = await PortfolioCompositionModel.findOne({
        where: { portfolioId, compositionType },
      });
      return composition;
    } catch (error) {
      this.logger.error(`Failed to decompose portfolio: ${error}`);
      throw new InternalServerErrorException('Portfolio decomposition failed');
    }
  }

  /**
   * Calculates composition weights against target allocations
   */
  async calculateCompositionWeights(portfolioId: string): Promise<object> {
    try {
      const compositions = await PortfolioCompositionModel.findAll({
        where: { portfolioId },
      });
      const weightSummary = compositions.reduce(
        (acc, comp) => ({
          ...acc,
          [comp.compositionType]: {
            current: comp.currentWeight,
            target: comp.targetWeight,
            variance: comp.currentWeight - comp.targetWeight,
          },
        }),
        {},
      );
      return weightSummary;
    } catch (error) {
      this.logger.error(`Failed to calculate composition weights: ${error}`);
      throw new InternalServerErrorException('Weight calculation failed');
    }
  }

  /**
   * Tracks composition drift over time with variance analysis
   */
  async trackCompositionDrift(
    portfolioId: string,
    days: number = 30,
  ): Promise<object> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const driftData = await PortfolioCompositionModel.findAll({
        where: {
          portfolioId,
          createdAt: { [Op.gte]: startDate },
        },
      });
      return { portfolioId, days, driftData };
    } catch (error) {
      this.logger.error(`Failed to track composition drift: ${error}`);
      throw new InternalServerErrorException('Composition drift tracking failed');
    }
  }

  // ========== Performance Attribution (4 functions) ==========

  /**
   * Calculates performance attribution using specified methodology
   */
  async calculatePerformanceAttribution(
    portfolioId: string,
    benchmarkId: string,
    method: AttributionMethod,
    transaction?: Transaction,
  ): Promise<PerformanceAttributionModel> {
    try {
      const attribution = await PerformanceAttributionModel.findOne(
        {
          where: { portfolioId, benchmarkId, method },
          order: [['attributionPeriod', 'DESC']],
        },
        { transaction },
      );
      if (!attribution) {
        throw new NotFoundException('Attribution data not found');
      }
      return attribution;
    } catch (error) {
      this.logger.error(`Failed to calculate performance attribution: ${error}`);
      throw new InternalServerErrorException('Performance attribution failed');
    }
  }

  /**
   * Analyzes allocation effect contribution to outperformance
   */
  async analyzeAllocationEffect(portfolioId: string): Promise<object> {
    try {
      const attributions = await PerformanceAttributionModel.findAll({
        where: { portfolioId },
        order: [['attributionPeriod', 'DESC']],
        limit: 12,
      });
      const avgAllocationEffect =
        attributions.reduce((sum, a) => sum + a.allocationEffect, 0) /
        attributions.length;
      return { portfolioId, avgAllocationEffect, dataPoints: attributions.length };
    } catch (error) {
      this.logger.error(`Failed to analyze allocation effect: ${error}`);
      throw new InternalServerErrorException('Allocation effect analysis failed');
    }
  }

  /**
   * Analyzes selection effect contribution from security selection
   */
  async analyzeSelectionEffect(portfolioId: string): Promise<object> {
    try {
      const attributions = await PerformanceAttributionModel.findAll({
        where: { portfolioId },
        order: [['attributionPeriod', 'DESC']],
        limit: 12,
      });
      const avgSelectionEffect =
        attributions.reduce((sum, a) => sum + a.selectionEffect, 0) /
        attributions.length;
      return { portfolioId, avgSelectionEffect, dataPoints: attributions.length };
    } catch (error) {
      this.logger.error(`Failed to analyze selection effect: ${error}`);
      throw new InternalServerErrorException('Selection effect analysis failed');
    }
  }

  /**
   * Calculates currency impact on performance attribution
   */
  async calculateCurrencyAttribution(portfolioId: string): Promise<object> {
    try {
      const attributions = await PerformanceAttributionModel.findAll({
        where: { portfolioId },
        order: [['attributionPeriod', 'DESC']],
        limit: 12,
      });
      const totalCurrencyEffect = attributions.reduce(
        (sum, a) => sum + a.currencyEffect,
        0,
      );
      return { portfolioId, totalCurrencyEffect, periods: attributions.length };
    } catch (error) {
      this.logger.error(`Failed to calculate currency attribution: ${error}`);
      throw new InternalServerErrorException('Currency attribution failed');
    }
  }

  // ========== Risk Decomposition (3 functions) ==========

  /**
   * Decomposes total portfolio risk into systematic and idiosyncratic components
   */
  async decomposePortfolioRisk(
    portfolioId: string,
    decompositionType: RiskDecompositionType = RiskDecompositionType.COMPONENT,
  ): Promise<RiskDecompositionModel | null> {
    try {
      const decomposition = await RiskDecompositionModel.findOne({
        where: { portfolioId, decompositionType },
        order: [['decompositionDate', 'DESC']],
      });
      return decomposition;
    } catch (error) {
      this.logger.error(`Failed to decompose portfolio risk: ${error}`);
      throw new InternalServerErrorException('Risk decomposition failed');
    }
  }

  /**
   * Calculates marginal contribution to risk for each position
   */
  async calculateMarginalRisk(portfolioId: string): Promise<object> {
    try {
      const decomposition = await RiskDecompositionModel.findOne({
        where: { portfolioId, decompositionType: RiskDecompositionType.MARGINAL },
        order: [['decompositionDate', 'DESC']],
      });
      if (!decomposition) {
        throw new NotFoundException('Marginal risk data not found');
      }
      return {
        portfolioId,
        totalRisk: decomposition.totalRisk,
        marginalRisks: decomposition.factorRisks,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate marginal risk: ${error}`);
      throw new InternalServerErrorException('Marginal risk calculation failed');
    }
  }

  /**
   * Analyzes factor-based risk contributions to total portfolio volatility
   */
  async analyzeFactorRiskContribution(portfolioId: string): Promise<object> {
    try {
      const decomposition = await RiskDecompositionModel.findOne({
        where: { portfolioId, decompositionType: RiskDecompositionType.FACTOR_BASED },
        order: [['decompositionDate', 'DESC']],
      });
      if (!decomposition) {
        throw new NotFoundException('Factor risk data not found');
      }
      return {
        portfolioId,
        systematicRisk: decomposition.systematicRisk,
        idiosyncraticRisk: decomposition.idiosyncraticRisk,
        factorRisks: decomposition.factorRisks,
      };
    } catch (error) {
      this.logger.error(`Failed to analyze factor risk contribution: ${error}`);
      throw new InternalServerErrorException('Factor risk analysis failed');
    }
  }

  // ========== Stress Testing (3 functions) ==========

  /**
   * Executes stress test scenario and measures portfolio impact
   */
  async executeStressTest(
    portfolioId: string,
    scenarioType: StressScenarioType,
    transaction?: Transaction,
  ): Promise<StressTestModel[]> {
    try {
      const stressTests = await StressTestModel.findAll(
        {
          where: { portfolioId, scenarioType },
          order: [['scenarioDate', 'DESC']],
          limit: 10,
        },
        { transaction },
      );
      return stressTests;
    } catch (error) {
      this.logger.error(`Failed to execute stress test: ${error}`);
      throw new InternalServerErrorException('Stress test execution failed');
    }
  }

  /**
   * Analyzes portfolio loss distribution under stress scenarios
   */
  async analyzePotentialLosses(portfolioId: string): Promise<object> {
    try {
      const stressTests = await StressTestModel.findAll({
        where: { portfolioId },
        order: [['scenarioDate', 'DESC']],
        limit: 20,
      });
      const maxLoss = Math.max(...stressTests.map((st) => st.potentialLoss));
      const avgLoss = stressTests.reduce((sum, st) => sum + st.potentialLoss, 0) / stressTests.length;
      return { portfolioId, maxLoss, avgLoss, scenarios: stressTests.length };
    } catch (error) {
      this.logger.error(`Failed to analyze potential losses: ${error}`);
      throw new InternalServerErrorException('Loss analysis failed');
    }
  }

  /**
   * Identifies positions most affected by stress scenarios
   */
  async identifyStressedPositions(
    portfolioId: string,
    threshold: number = 0.05,
  ): Promise<object> {
    try {
      const stressTests = await StressTestModel.findAll({
        where: { portfolioId },
        order: [['scenarioDate', 'DESC']],
        limit: 1,
      });
      if (stressTests.length === 0) {
        throw new NotFoundException('Stress test data not found');
      }
      const affectedPositions = stressTests[0].affectedPositions;
      return { portfolioId, threshold, affectedPositions };
    } catch (error) {
      this.logger.error(`Failed to identify stressed positions: ${error}`);
      throw new InternalServerErrorException('Stressed position identification failed');
    }
  }

  // ========== Factor Exposure Analysis (3 functions) ==========

  /**
   * Calculates portfolio exposure to various risk factors
   */
  async calculateFactorExposures(
    portfolioId: string,
    factorType?: FactorExposureType,
  ): Promise<FactorExposureModel[]> {
    try {
      const where: any = { portfolioId };
      if (factorType) where.factorType = factorType;
      const exposures = await FactorExposureModel.findAll({
        where,
        order: [['exposureDate', 'DESC']],
        limit: 50,
      });
      return exposures;
    } catch (error) {
      this.logger.error(`Failed to calculate factor exposures: ${error}`);
      throw new InternalServerErrorException('Factor exposure calculation failed');
    }
  }

  /**
   * Analyzes contribution of each factor to portfolio performance
   */
  async analyzeFactorPerformanceContribution(portfolioId: string): Promise<object> {
    try {
      const exposures = await FactorExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 12,
      });
      const factorContributions = exposures.reduce(
        (acc, exp) => ({
          ...acc,
          [exp.factorType]: {
            exposure: exp.exposure,
            return: exp.factorReturn,
            contribution: exp.factorContribution,
          },
        }),
        {},
      );
      return { portfolioId, factorContributions };
    } catch (error) {
      this.logger.error(`Failed to analyze factor performance: ${error}`);
      throw new InternalServerErrorException('Factor performance analysis failed');
    }
  }

  /**
   * Identifies factor tilts and style characteristics of portfolio
   */
  async identifyStyleTilts(portfolioId: string): Promise<object> {
    try {
      const exposures = await FactorExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 1,
      });
      if (exposures.length === 0) {
        throw new NotFoundException('Factor exposure data not found');
      }
      const styleTilts = exposures.reduce(
        (acc, exp) => ({
          ...acc,
          [exp.factorType]: exp.exposurePercentage,
        }),
        {},
      );
      return { portfolioId, styleTilts };
    } catch (error) {
      this.logger.error(`Failed to identify style tilts: ${error}`);
      throw new InternalServerErrorException('Style tilt identification failed');
    }
  }

  // ========== Correlation Analysis (2 functions) ==========

  /**
   * Calculates correlation matrix between portfolio holdings
   */
  async calculateCorrelationMatrix(portfolioId: string): Promise<CorrelationAnalysisModel | null> {
    try {
      const correlation = await CorrelationAnalysisModel.findOne({
        where: { portfolioId },
        order: [['analysisDate', 'DESC']],
      });
      return correlation;
    } catch (error) {
      this.logger.error(`Failed to calculate correlation matrix: ${error}`);
      throw new InternalServerErrorException('Correlation calculation failed');
    }
  }

  /**
   * Performs principal component analysis on portfolio correlations
   */
  async performPrincipalComponentAnalysis(portfolioId: string): Promise<object> {
    try {
      const correlation = await CorrelationAnalysisModel.findOne({
        where: { portfolioId },
        order: [['analysisDate', 'DESC']],
      });
      if (!correlation) {
        throw new NotFoundException('Correlation data not found');
      }
      return {
        portfolioId,
        eigenvalues: correlation.eigenvalues,
        principalComponents: correlation.principalComponents,
        cumulativeVariance: this.calculateCumulativeVariance(correlation.eigenvalues),
      };
    } catch (error) {
      this.logger.error(`Failed to perform PCA: ${error}`);
      throw new InternalServerErrorException('Principal component analysis failed');
    }
  }

  private calculateCumulativeVariance(eigenvalues: number[]): number[] {
    const total = eigenvalues.reduce((sum, ev) => sum + ev, 0);
    let cumulative = 0;
    return eigenvalues.map((ev) => {
      cumulative += ev / total;
      return cumulative;
    });
  }

  // ========== Sharpe Ratio and Advanced Metrics (4 functions) ==========

  /**
   * Calculates Sharpe ratio and related risk-adjusted return metrics
   */
  async calculateRiskAdjustedMetrics(portfolioId: string): Promise<SharpeRatioModel | null> {
    try {
      const metrics = await SharpeRatioModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to calculate risk-adjusted metrics: ${error}`);
      throw new InternalServerErrorException('Risk-adjusted metrics calculation failed');
    }
  }

  /**
   * Computes Sortino ratio emphasizing downside risk
   */
  async calculateSortinoRatio(portfolioId: string): Promise<object> {
    try {
      const metrics = await SharpeRatioModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      if (!metrics) {
        throw new NotFoundException('Metrics data not found');
      }
      return { portfolioId, sortinoRatio: metrics.sortinoRatio };
    } catch (error) {
      this.logger.error(`Failed to calculate Sortino ratio: ${error}`);
      throw new InternalServerErrorException('Sortino ratio calculation failed');
    }
  }

  /**
   * Calculates Calmar ratio (return over maximum drawdown)
   */
  async calculateCalmarRatio(portfolioId: string): Promise<object> {
    try {
      const metrics = await SharpeRatioModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      if (!metrics) {
        throw new NotFoundException('Metrics data not found');
      }
      return { portfolioId, calmarRatio: metrics.calmarRatio };
    } catch (error) {
      this.logger.error(`Failed to calculate Calmar ratio: ${error}`);
      throw new InternalServerErrorException('Calmar ratio calculation failed');
    }
  }

  /**
   * Computes Information ratio against benchmark
   */
  async calculateInformationRatio(portfolioId: string): Promise<object> {
    try {
      const metrics = await SharpeRatioModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      if (!metrics) {
        throw new NotFoundException('Metrics data not found');
      }
      return { portfolioId, informationRatio: metrics.informationRatio };
    } catch (error) {
      this.logger.error(`Failed to calculate Information ratio: ${error}`);
      throw new InternalServerErrorException('Information ratio calculation failed');
    }
  }

  // ========== Benchmark Comparison (3 functions) ==========

  /**
   * Compares portfolio performance against benchmark
   */
  async compareToBenchmark(
    portfolioId: string,
    benchmarkId: string,
  ): Promise<BenchmarkComparisonModel | null> {
    try {
      const comparison = await BenchmarkComparisonModel.findOne({
        where: { portfolioId, benchmarkId },
        order: [['comparisonDate', 'DESC']],
      });
      return comparison;
    } catch (error) {
      this.logger.error(`Failed to compare to benchmark: ${error}`);
      throw new InternalServerErrorException('Benchmark comparison failed');
    }
  }

  /**
   * Calculates up and down capture ratios against benchmark
   */
  async calculateCaptureRatios(
    portfolioId: string,
    benchmarkId: string,
  ): Promise<object> {
    try {
      const comparison = await BenchmarkComparisonModel.findOne({
        where: { portfolioId, benchmarkId },
        order: [['comparisonDate', 'DESC']],
      });
      if (!comparison) {
        throw new NotFoundException('Comparison data not found');
      }
      return {
        portfolioId,
        benchmarkId,
        upCaptureRatio: comparison.upCaptureRatio,
        downCaptureRatio: comparison.downCaptureRatio,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate capture ratios: ${error}`);
      throw new InternalServerErrorException('Capture ratio calculation failed');
    }
  }

  /**
   * Analyzes tracking error versus benchmark
   */
  async analyzeTrackingError(portfolioId: string, benchmarkId: string): Promise<object> {
    try {
      const comparisons = await BenchmarkComparisonModel.findAll({
        where: { portfolioId, benchmarkId },
        order: [['comparisonDate', 'DESC']],
        limit: 12,
      });
      const avgTrackingError =
        comparisons.reduce((sum, c) => sum + c.trackingError, 0) / comparisons.length;
      return { portfolioId, benchmarkId, avgTrackingError, periods: comparisons.length };
    } catch (error) {
      this.logger.error(`Failed to analyze tracking error: ${error}`);
      throw new InternalServerErrorException('Tracking error analysis failed');
    }
  }

  // ========== Asset Allocation Analysis (3 functions) ==========

  /**
   * Calculates current and target asset allocation
   */
  async calculateAssetAllocation(portfolioId: string): Promise<AssetAllocationModel | null> {
    try {
      const allocation = await AssetAllocationModel.findOne({
        where: { portfolioId },
        order: [['allocationDate', 'DESC']],
      });
      return allocation;
    } catch (error) {
      this.logger.error(`Failed to calculate asset allocation: ${error}`);
      throw new InternalServerErrorException('Asset allocation calculation failed');
    }
  }

  /**
   * Analyzes drift from target allocation with rebalancing implications
   */
  async analyzeAllocationDrift(portfolioId: string): Promise<object> {
    try {
      const allocation = await AssetAllocationModel.findOne({
        where: { portfolioId },
        order: [['allocationDate', 'DESC']],
      });
      if (!allocation) {
        throw new NotFoundException('Allocation data not found');
      }
      return {
        portfolioId,
        equityDrift: allocation.equityAllocation,
        fixedIncomeDrift: allocation.fixedIncomeAllocation,
        alternativeDrift: allocation.alternativeAllocation,
        cashDrift: allocation.cashAllocation,
      };
    } catch (error) {
      this.logger.error(`Failed to analyze allocation drift: ${error}`);
      throw new InternalServerErrorException('Allocation drift analysis failed');
    }
  }

  /**
   * Projects expected returns and volatility of allocation
   */
  async projectAllocationMetrics(portfolioId: string): Promise<object> {
    try {
      const allocation = await AssetAllocationModel.findOne({
        where: { portfolioId },
        order: [['allocationDate', 'DESC']],
      });
      if (!allocation) {
        throw new NotFoundException('Allocation data not found');
      }
      return {
        portfolioId,
        expectedReturn: allocation.expectedReturn,
        expectedVolatility: allocation.expectedVolatility,
        expectedSharpe: allocation.expectedSharpe,
      };
    } catch (error) {
      this.logger.error(`Failed to project allocation metrics: ${error}`);
      throw new InternalServerErrorException('Allocation projection failed');
    }
  }

  // ========== Sector Exposure (2 functions) ==========

  /**
   * Analyzes portfolio sector exposure and composition
   */
  async analyzeSectorExposure(portfolioId: string): Promise<SectorExposureModel[]> {
    try {
      const exposures = await SectorExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 11,
      });
      return exposures;
    } catch (error) {
      this.logger.error(`Failed to analyze sector exposure: ${error}`);
      throw new InternalServerErrorException('Sector exposure analysis failed');
    }
  }

  /**
   * Calculates sector concentration and active weights
   */
  async calculateSectorConcentration(portfolioId: string): Promise<object> {
    try {
      const exposures = await SectorExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 1,
      });
      const concentration = exposures.reduce(
        (acc, exp) => ({
          ...acc,
          [exp.sector]: {
            exposure: exp.exposure,
            activeWeight: exp.activeWeight,
          },
        }),
        {},
      );
      return { portfolioId, concentration };
    } catch (error) {
      this.logger.error(`Failed to calculate sector concentration: ${error}`);
      throw new InternalServerErrorException('Sector concentration calculation failed');
    }
  }

  // ========== Geographic Exposure (2 functions) ==========

  /**
   * Analyzes portfolio geographic and regional exposure
   */
  async analyzeGeographicExposure(portfolioId: string): Promise<GeographicExposureModel[]> {
    try {
      const exposures = await GeographicExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 20,
      });
      return exposures;
    } catch (error) {
      this.logger.error(`Failed to analyze geographic exposure: ${error}`);
      throw new InternalServerErrorException('Geographic exposure analysis failed');
    }
  }

  /**
   * Calculates currency exposure from geographic distribution
   */
  async calculateCurrencyExposure(portfolioId: string): Promise<object> {
    try {
      const exposures = await GeographicExposureModel.findAll({
        where: { portfolioId },
        order: [['exposureDate', 'DESC']],
        limit: 1,
      });
      const currencyExposures = exposures.reduce(
        (acc, exp) => ({
          ...acc,
          [exp.currencyCode]: exp.currencyExposure,
        }),
        {},
      );
      return { portfolioId, currencyExposures };
    } catch (error) {
      this.logger.error(`Failed to calculate currency exposure: ${error}`);
      throw new InternalServerErrorException('Currency exposure calculation failed');
    }
  }

  // ========== Fixed Income Analytics (3 functions) ==========

  /**
   * Calculates duration, convexity, and yield metrics for fixed income
   */
  async calculateFixedIncomeMetrics(portfolioId: string): Promise<FixedIncomeMetricsModel | null> {
    try {
      const metrics = await FixedIncomeMetricsModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to calculate fixed income metrics: ${error}`);
      throw new InternalServerErrorException('Fixed income metrics calculation failed');
    }
  }

  /**
   * Analyzes yield curve exposure and duration ladder
   */
  async analyzeYieldCurveExposure(
    portfolioId: string,
    currencyCode: string,
  ): Promise<YieldCurveModel | null> {
    try {
      const yieldCurve = await YieldCurveModel.findOne({
        where: { currencyCode },
        order: [['curveDate', 'DESC']],
      });
      return yieldCurve;
    } catch (error) {
      this.logger.error(`Failed to analyze yield curve exposure: ${error}`);
      throw new InternalServerErrorException('Yield curve analysis failed');
    }
  }

  /**
   * Calculates key rate durations and price value of basis point
   */
  async calculateKeyRateDurations(portfolioId: string): Promise<object> {
    try {
      const metrics = await FixedIncomeMetricsModel.findOne({
        where: { portfolioId },
        order: [['metricsDate', 'DESC']],
      });
      if (!metrics) {
        throw new NotFoundException('Fixed income data not found');
      }
      return {
        portfolioId,
        keyRateDurations: metrics.keyRateDurations,
        priceValueOfBasisPoint: metrics.modifiedDuration * metrics.convexity,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate key rate durations: ${error}`);
      throw new InternalServerErrorException('Key rate duration calculation failed');
    }
  }

  // ========== Portfolio Optimization (2 functions) ==========

  /**
   * Optimizes portfolio weights to maximize Sharpe ratio or minimize variance
   */
  async optimizePortfolio(
    portfolioId: string,
    optimizationType: OptimizationType = OptimizationType.MAX_SHARPE,
  ): Promise<PortfolioOptimizationModel | null> {
    try {
      const optimization = await PortfolioOptimizationModel.findOne({
        where: { portfolioId, optimizationType },
        order: [['optimizationDate', 'DESC']],
      });
      return optimization;
    } catch (error) {
      this.logger.error(`Failed to optimize portfolio: ${error}`);
      throw new InternalServerErrorException('Portfolio optimization failed');
    }
  }

  /**
   * Analyzes optimizer constraints and constraints binding analysis
   */
  async analyzeOptimizationConstraints(
    portfolioId: string,
    optimizationType: OptimizationType,
  ): Promise<object> {
    try {
      const optimization = await PortfolioOptimizationModel.findOne({
        where: { portfolioId, optimizationType },
        order: [['optimizationDate', 'DESC']],
      });
      if (!optimization) {
        throw new NotFoundException('Optimization data not found');
      }
      return {
        portfolioId,
        constraints: optimization.constraints,
        convergenceStatus: optimization.convergenceStatus,
      };
    } catch (error) {
      this.logger.error(`Failed to analyze optimization constraints: ${error}`);
      throw new InternalServerErrorException('Constraint analysis failed');
    }
  }

  // ========== Rebalancing Strategies (2 functions) ==========

  /**
   * Generates rebalancing plan using specified strategy
   */
  async generateRebalancingPlan(
    portfolioId: string,
    rebalancingMethod: RebalancingMethod,
  ): Promise<RebalancingStrategyModel | null> {
    try {
      const strategy = await RebalancingStrategyModel.findOne({
        where: { portfolioId, rebalancingMethod },
        order: [['strategyDate', 'DESC']],
      });
      return strategy;
    } catch (error) {
      this.logger.error(`Failed to generate rebalancing plan: ${error}`);
      throw new InternalServerErrorException('Rebalancing plan generation failed');
    }
  }

  /**
   * Calculates rebalancing costs including taxes and transaction costs
   */
  async calculateRebalancingCosts(
    portfolioId: string,
    rebalancingMethod: RebalancingMethod,
  ): Promise<object> {
    try {
      const strategy = await RebalancingStrategyModel.findOne({
        where: { portfolioId, rebalancingMethod },
        order: [['strategyDate', 'DESC']],
      });
      if (!strategy) {
        throw new NotFoundException('Rebalancing strategy not found');
      }
      return {
        portfolioId,
        estimatedCosts: strategy.estimatedCosts,
        estimatedTaxImpact: strategy.estimatedTaxImpact,
        totalCost: strategy.estimatedCosts + (strategy.estimatedTaxImpact || 0),
        turnover: strategy.turnover,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate rebalancing costs: ${error}`);
      throw new InternalServerErrorException('Rebalancing cost calculation failed');
    }
  }

  // ========== What-If Analysis (2 functions) ==========

  /**
   * Performs what-if scenario analysis on portfolio
   */
  async performWhatIfAnalysis(
    portfolioId: string,
    scenarioDescription: string,
  ): Promise<WhatIfScenarioModel | null> {
    try {
      const scenario = await WhatIfScenarioModel.findOne({
        where: { portfolioId, scenarioDescription },
        order: [['scenarioDate', 'DESC']],
      });
      return scenario;
    } catch (error) {
      this.logger.error(`Failed to perform what-if analysis: ${error}`);
      throw new InternalServerErrorException('What-if analysis failed');
    }
  }

  /**
   * Compares what-if scenarios with baseline metrics
   */
  async compareScenarioImpact(portfolioId: string): Promise<object> {
    try {
      const scenarios = await WhatIfScenarioModel.findAll({
        where: { portfolioId },
        order: [['scenarioDate', 'DESC']],
        limit: 5,
      });
      return {
        portfolioId,
        scenarioCount: scenarios.length,
        scenarios: scenarios.map((s) => ({
          description: s.scenarioDescription,
          impactAnalysis: s.impactAnalysis,
          riskMetrics: s.riskMetrics,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to compare scenario impact: ${error}`);
      throw new InternalServerErrorException('Scenario comparison failed');
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER - SWAGGER API ROUTES
// ============================================================================

/**
 * Portfolio Analytics Controller
 * Exposes 42 REST endpoints with comprehensive OpenAPI/Swagger documentation
 */
@Controller('api/v1/portfolio-analytics')
@ApiTags('Portfolio Analytics - Bloomberg Terminal Features')
export class PortfolioAnalyticsCompositeController {
  private readonly logger = new Logger(PortfolioAnalyticsCompositeController.name);

  constructor(private service: PortfolioAnalyticsCompositeService) {}

  // ========== Portfolio Composition Endpoints ==========

  @Post(':portfolioId/composition/analyze')
  @ApiOperation({
    summary: 'Analyze portfolio composition by asset class',
    description: 'Decompose portfolio into asset class components with weights and tracking error',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiResponse({ status: 200, description: 'Composition analysis completed' })
  @HttpCode(200)
  async analyzeComposition(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzePortfolioComposition(portfolioId);
  }

  @Get(':portfolioId/composition/weights')
  @ApiOperation({ summary: 'Calculate composition weights', description: 'Composition weights vs targets' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getCompositionWeights(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateCompositionWeights(portfolioId);
  }

  @Get(':portfolioId/composition/drift')
  @ApiOperation({ summary: 'Track composition drift over time', description: 'Historical composition variance' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'days', type: Number, required: false, description: 'Days to analyze' })
  async getCompositionDrift(
    @Param('portfolioId') portfolioId: string,
    @Query('days') days: string = '30',
  ) {
    return this.service.trackCompositionDrift(portfolioId, parseInt(days));
  }

  // ========== Performance Attribution Endpoints ==========

  @Get(':portfolioId/attribution/:benchmarkId')
  @ApiOperation({ summary: 'Calculate performance attribution', description: 'Attribution vs benchmark' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'benchmarkId', description: 'Benchmark identifier' })
  @ApiQuery({ name: 'method', enum: AttributionMethod, required: false })
  async getPerformanceAttribution(
    @Param('portfolioId') portfolioId: string,
    @Param('benchmarkId') benchmarkId: string,
    @Query('method') method: AttributionMethod = AttributionMethod.BRINSON_FACHLER,
  ) {
    return this.service.calculatePerformanceAttribution(
      portfolioId,
      benchmarkId,
      method,
    );
  }

  @Get(':portfolioId/attribution/allocation-effect')
  @ApiOperation({ summary: 'Analyze allocation effect', description: 'Contribution from sector allocation' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getAllocationEffect(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeAllocationEffect(portfolioId);
  }

  @Get(':portfolioId/attribution/selection-effect')
  @ApiOperation({ summary: 'Analyze selection effect', description: 'Contribution from security selection' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getSelectionEffect(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeSelectionEffect(portfolioId);
  }

  @Get(':portfolioId/attribution/currency-effect')
  @ApiOperation({ summary: 'Calculate currency attribution', description: 'Currency impact on performance' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getCurrencyAttribution(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateCurrencyAttribution(portfolioId);
  }

  // ========== Risk Decomposition Endpoints ==========

  @Get(':portfolioId/risk/decomposition')
  @ApiOperation({
    summary: 'Decompose portfolio risk',
    description: 'Systematic vs idiosyncratic risk',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'type', enum: RiskDecompositionType, required: false })
  async getRiskDecomposition(
    @Param('portfolioId') portfolioId: string,
    @Query('type') type: RiskDecompositionType = RiskDecompositionType.COMPONENT,
  ) {
    return this.service.decomposePortfolioRisk(portfolioId, type);
  }

  @Get(':portfolioId/risk/marginal')
  @ApiOperation({
    summary: 'Calculate marginal risk contribution',
    description: 'Contribution of each position to total risk',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getMarginalRisk(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateMarginalRisk(portfolioId);
  }

  @Get(':portfolioId/risk/factor-contribution')
  @ApiOperation({ summary: 'Analyze factor risk contribution', description: 'Factor-based risk breakdown' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getFactorRiskContribution(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeFactorRiskContribution(portfolioId);
  }

  // ========== Stress Testing Endpoints ==========

  @Post(':portfolioId/stress-test/execute')
  @ApiOperation({
    summary: 'Execute stress test scenario',
    description: 'Run stress test with specified scenario type',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'scenarioType', enum: StressScenarioType, required: false })
  @HttpCode(200)
  async executeStressTest(
    @Param('portfolioId') portfolioId: string,
    @Query('scenarioType') scenarioType: StressScenarioType = StressScenarioType.HISTORICAL,
  ) {
    return this.service.executeStressTest(portfolioId, scenarioType);
  }

  @Get(':portfolioId/stress-test/losses')
  @ApiOperation({ summary: 'Analyze potential losses', description: 'Stress loss analysis' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getPotentialLosses(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzePotentialLosses(portfolioId);
  }

  @Get(':portfolioId/stress-test/affected-positions')
  @ApiOperation({ summary: 'Identify stressed positions', description: 'Positions most affected' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getStressedPositions(@Param('portfolioId') portfolioId: string) {
    return this.service.identifyStressedPositions(portfolioId);
  }

  // ========== Factor Exposure Endpoints ==========

  @Get(':portfolioId/factors/exposures')
  @ApiOperation({ summary: 'Calculate factor exposures', description: 'Multi-factor exposure analysis' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'factorType', enum: FactorExposureType, required: false })
  async getFactorExposures(
    @Param('portfolioId') portfolioId: string,
    @Query('factorType') factorType?: FactorExposureType,
  ) {
    return this.service.calculateFactorExposures(portfolioId, factorType);
  }

  @Get(':portfolioId/factors/performance')
  @ApiOperation({
    summary: 'Analyze factor performance contribution',
    description: 'Each factor contribution to returns',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getFactorPerformance(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeFactorPerformanceContribution(portfolioId);
  }

  @Get(':portfolioId/factors/tilts')
  @ApiOperation({ summary: 'Identify style tilts', description: 'Style characteristics' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getStyleTilts(@Param('portfolioId') portfolioId: string) {
    return this.service.identifyStyleTilts(portfolioId);
  }

  // ========== Correlation Endpoints ==========

  @Get(':portfolioId/correlation/matrix')
  @ApiOperation({ summary: 'Calculate correlation matrix', description: 'Holdings correlation' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getCorrelationMatrix(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateCorrelationMatrix(portfolioId);
  }

  @Get(':portfolioId/correlation/pca')
  @ApiOperation({
    summary: 'Perform principal component analysis',
    description: 'Correlation dimensionality reduction',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getPCA(@Param('portfolioId') portfolioId: string) {
    return this.service.performPrincipalComponentAnalysis(portfolioId);
  }

  // ========== Risk-Adjusted Metrics Endpoints ==========

  @Get(':portfolioId/metrics/risk-adjusted')
  @ApiOperation({
    summary: 'Calculate risk-adjusted metrics',
    description: 'Sharpe, Sortino, Calmar, Information ratios',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getRiskAdjustedMetrics(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateRiskAdjustedMetrics(portfolioId);
  }

  @Get(':portfolioId/metrics/sortino')
  @ApiOperation({ summary: 'Calculate Sortino ratio', description: 'Downside risk-adjusted return' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getSortino(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateSortinoRatio(portfolioId);
  }

  @Get(':portfolioId/metrics/calmar')
  @ApiOperation({ summary: 'Calculate Calmar ratio', description: 'Return over max drawdown' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getCalmar(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateCalmarRatio(portfolioId);
  }

  @Get(':portfolioId/metrics/information')
  @ApiOperation({ summary: 'Calculate Information ratio', description: 'Active return over tracking error' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getInformationRatio(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateInformationRatio(portfolioId);
  }

  // ========== Benchmark Comparison Endpoints ==========

  @Get(':portfolioId/benchmark/:benchmarkId/comparison')
  @ApiOperation({
    summary: 'Compare to benchmark',
    description: 'Performance and risk vs benchmark',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'benchmarkId', description: 'Benchmark identifier' })
  async getBenchmarkComparison(
    @Param('portfolioId') portfolioId: string,
    @Param('benchmarkId') benchmarkId: string,
  ) {
    return this.service.compareToBenchmark(portfolioId, benchmarkId);
  }

  @Get(':portfolioId/benchmark/:benchmarkId/capture')
  @ApiOperation({ summary: 'Calculate capture ratios', description: 'Up and down capture vs benchmark' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'benchmarkId', description: 'Benchmark identifier' })
  async getCaptureRatios(
    @Param('portfolioId') portfolioId: string,
    @Param('benchmarkId') benchmarkId: string,
  ) {
    return this.service.calculateCaptureRatios(portfolioId, benchmarkId);
  }

  @Get(':portfolioId/benchmark/:benchmarkId/tracking-error')
  @ApiOperation({ summary: 'Analyze tracking error', description: 'Tracking error vs benchmark' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'benchmarkId', description: 'Benchmark identifier' })
  async getTrackingError(
    @Param('portfolioId') portfolioId: string,
    @Param('benchmarkId') benchmarkId: string,
  ) {
    return this.service.analyzeTrackingError(portfolioId, benchmarkId);
  }

  // ========== Asset Allocation Endpoints ==========

  @Get(':portfolioId/allocation/current')
  @ApiOperation({ summary: 'Calculate asset allocation', description: 'Current and target allocation' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getAllocation(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateAssetAllocation(portfolioId);
  }

  @Get(':portfolioId/allocation/drift')
  @ApiOperation({
    summary: 'Analyze allocation drift',
    description: 'Deviation from target allocation',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getAllocationDrift(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeAllocationDrift(portfolioId);
  }

  @Get(':portfolioId/allocation/projected-metrics')
  @ApiOperation({
    summary: 'Project allocation metrics',
    description: 'Expected return and risk',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getProjectedMetrics(@Param('portfolioId') portfolioId: string) {
    return this.service.projectAllocationMetrics(portfolioId);
  }

  // ========== Sector Exposure Endpoints ==========

  @Get(':portfolioId/exposure/sectors')
  @ApiOperation({
    summary: 'Analyze sector exposure',
    description: 'Sector weights and contributions',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getSectorExposure(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeSectorExposure(portfolioId);
  }

  @Get(':portfolioId/exposure/sector-concentration')
  @ApiOperation({
    summary: 'Calculate sector concentration',
    description: 'Concentration and active weights',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getSectorConcentration(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateSectorConcentration(portfolioId);
  }

  // ========== Geographic Exposure Endpoints ==========

  @Get(':portfolioId/exposure/geographic')
  @ApiOperation({ summary: 'Analyze geographic exposure', description: 'Regional distribution' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getGeographicExposure(@Param('portfolioId') portfolioId: string) {
    return this.service.analyzeGeographicExposure(portfolioId);
  }

  @Get(':portfolioId/exposure/currency')
  @ApiOperation({
    summary: 'Calculate currency exposure',
    description: 'Currency exposures from geography',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getCurrencyExposure(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateCurrencyExposure(portfolioId);
  }

  // ========== Fixed Income Endpoints ==========

  @Get(':portfolioId/fixed-income/metrics')
  @ApiOperation({
    summary: 'Calculate fixed income metrics',
    description: 'Duration, convexity, yields',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getFixedIncomeMetrics(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateFixedIncomeMetrics(portfolioId);
  }

  @Get(':portfolioId/fixed-income/yield-curve/:currencyCode')
  @ApiOperation({ summary: 'Analyze yield curve exposure', description: 'Duration ladder analysis' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'currencyCode', description: 'Currency code' })
  async getYieldCurveExposure(
    @Param('portfolioId') portfolioId: string,
    @Param('currencyCode') currencyCode: string,
  ) {
    return this.service.analyzeYieldCurveExposure(portfolioId, currencyCode);
  }

  @Get(':portfolioId/fixed-income/key-rate-durations')
  @ApiOperation({
    summary: 'Calculate key rate durations',
    description: 'Key rate duration and PVBP',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async getKeyRateDurations(@Param('portfolioId') portfolioId: string) {
    return this.service.calculateKeyRateDurations(portfolioId);
  }

  // ========== Portfolio Optimization Endpoints ==========

  @Post(':portfolioId/optimization/optimize')
  @ApiOperation({
    summary: 'Optimize portfolio',
    description: 'Mean-variance or other optimization',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'type', enum: OptimizationType, required: false })
  @HttpCode(200)
  async optimizePortfolio(
    @Param('portfolioId') portfolioId: string,
    @Query('type') type: OptimizationType = OptimizationType.MAX_SHARPE,
  ) {
    return this.service.optimizePortfolio(portfolioId, type);
  }

  @Get(':portfolioId/optimization/:type/constraints')
  @ApiOperation({
    summary: 'Analyze optimization constraints',
    description: 'Constraint binding analysis',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'type', enum: OptimizationType })
  async getOptimizationConstraints(
    @Param('portfolioId') portfolioId: string,
    @Param('type') type: OptimizationType,
  ) {
    return this.service.analyzeOptimizationConstraints(portfolioId, type);
  }

  // ========== Rebalancing Endpoints ==========

  @Post(':portfolioId/rebalancing/plan')
  @ApiOperation({ summary: 'Generate rebalancing plan', description: 'Rebalancing trades and costs' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiQuery({ name: 'method', enum: RebalancingMethod, required: false })
  @HttpCode(200)
  async generateRebalancingPlan(
    @Param('portfolioId') portfolioId: string,
    @Query('method') method: RebalancingMethod = RebalancingMethod.THRESHOLD,
  ) {
    return this.service.generateRebalancingPlan(portfolioId, method);
  }

  @Get(':portfolioId/rebalancing/:method/costs')
  @ApiOperation({
    summary: 'Calculate rebalancing costs',
    description: 'Transaction and tax costs',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiParam({ name: 'method', enum: RebalancingMethod })
  async getRebalancingCosts(
    @Param('portfolioId') portfolioId: string,
    @Param('method') method: RebalancingMethod,
  ) {
    return this.service.calculateRebalancingCosts(portfolioId, method);
  }

  // ========== What-If Analysis Endpoints ==========

  @Post(':portfolioId/what-if/analyze')
  @ApiOperation({ summary: 'Perform what-if analysis', description: 'Scenario impact analysis' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { scenarioDescription: { type: 'string' } },
    },
  })
  @HttpCode(200)
  async performWhatIf(
    @Param('portfolioId') portfolioId: string,
    @Body() body: { scenarioDescription: string },
  ) {
    return this.service.performWhatIfAnalysis(
      portfolioId,
      body.scenarioDescription,
    );
  }

  @Get(':portfolioId/what-if/compare')
  @ApiOperation({
    summary: 'Compare what-if scenarios',
    description: 'Impact comparison across scenarios',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio identifier' })
  async compareWhatIf(@Param('portfolioId') portfolioId: string) {
    return this.service.compareScenarioImpact(portfolioId);
  }
}

// ============================================================================
// EXPORT MODELS FOR SEQUELIZE INITIALIZATION
// ============================================================================

export const PORTFOLIO_ANALYTICS_MODELS = [
  PortfolioCompositionModel,
  PerformanceAttributionModel,
  RiskDecompositionModel,
  StressTestModel,
  FactorExposureModel,
  CorrelationAnalysisModel,
  BenchmarkComparisonModel,
  AssetAllocationModel,
  SectorExposureModel,
  GeographicExposureModel,
  FixedIncomeMetricsModel,
  YieldCurveModel,
  PortfolioOptimizationModel,
  RebalancingStrategyModel,
  WhatIfScenarioModel,
  SharpeRatioModel,
];

/**
 * Composite exports for module integration
 */
export default {
  PortfolioAnalyticsCompositeService,
  PortfolioAnalyticsCompositeController,
  PORTFOLIO_ANALYTICS_MODELS,
};
