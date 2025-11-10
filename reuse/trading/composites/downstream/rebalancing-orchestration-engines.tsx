/**
 * @fileoverview Rebalancing Orchestration Engines for Portfolio Management
 * @module RebalancingOrchestrationEngines
 * @description Production-ready portfolio rebalancing engines with optimization,
 * constraint handling, tax efficiency, and automated execution
 *
 * @requires nestjs/common v10.x
 * @requires nestjs/swagger v7.x
 * @requires nestjs/schedule v3.x
 * @requires bull v4.x
 *
 * @upstream ../portfolio-analytics-composite
 * @downstream Portfolio management systems, Trading platforms, Asset managers
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  IsUUID,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import from portfolio analytics composite
import {
  PortfolioCompositionType,
  RebalancingMethod,
  AttributionMethod,
  RiskDecompositionType,
  calculatePortfolioComposition,
  analyzePerformanceAttribution,
  decomposePortfolioRisk,
  runScenarioAnalysis,
  calculateFactorExposures,
  performCorrelationAnalysis,
  calculateSharpeRatio,
  calculateInformationRatio,
  calculateTreynorRatio,
  compareVsBenchmark,
  analyzeAssetAllocation,
  analyzeSectorExposure,
  analyzeGeographicExposure,
  calculateDuration,
  calculateConvexity,
  generateYieldCurve,
  optimizePortfolio,
  generateRebalancingStrategy,
  executeRebalancing,
  runWhatIfAnalysis,
  calculateTrackingError,
  analyzeStyleDrift,
  calculateRiskContribution,
  performBacktest,
  generatePortfolioReport,
} from '../portfolio-analytics-composite';

// ============================================================================
// DTO DEFINITIONS
// ============================================================================

/**
 * DTO for rebalancing configuration
 */
export class RebalancingConfigDto {
  @ApiProperty({ description: 'Portfolio ID', example: 'port-001' })
  @IsUUID()
  portfolioId: string;

  @ApiProperty({ description: 'Rebalancing method', example: 'THRESHOLD' })
  @IsEnum(RebalancingMethod)
  method: RebalancingMethod;

  @ApiProperty({ description: 'Target allocations' })
  @ValidateNested({ each: true })
  @Type(() => AssetAllocationDto)
  targetAllocations: AssetAllocationDto[];

  @ApiProperty({ description: 'Rebalancing threshold (%)', example: 5 })
  @IsNumber()
  @Min(0.1)
  @Max(50)
  thresholdPercent: number;

  @ApiProperty({ description: 'Minimum trade size ($)', example: 1000 })
  @IsNumber()
  @Min(100)
  minTradeSize: number;

  @ApiProperty({ description: 'Maximum turnover (%)', example: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxTurnover?: number;

  @ApiProperty({ description: 'Consider tax implications', example: true })
  @IsBoolean()
  considerTaxes: boolean;

  @ApiProperty({ description: 'Tax rates' })
  @IsOptional()
  taxRates?: {
    shortTermCapitalGains: number;
    longTermCapitalGains: number;
    dividends: number;
  };

  @ApiProperty({ description: 'Include transaction costs', example: true })
  @IsBoolean()
  includeTransactionCosts: boolean;

  @ApiProperty({ description: 'Transaction cost basis points', example: 10 })
  @IsNumber()
  @IsOptional()
  transactionCostBps?: number;

  @ApiProperty({ description: 'Constraints' })
  @IsOptional()
  constraints?: RebalancingConstraintsDto;
}

/**
 * DTO for asset allocation
 */
export class AssetAllocationDto {
  @ApiProperty({ description: 'Asset class', example: 'EQUITY' })
  @IsEnum(PortfolioCompositionType)
  assetClass: PortfolioCompositionType;

  @ApiProperty({ description: 'Target weight (%)', example: 60 })
  @IsNumber()
  @Min(0)
  @Max(100)
  targetWeight: number;

  @ApiProperty({ description: 'Min weight (%)', example: 50 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minWeight?: number;

  @ApiProperty({ description: 'Max weight (%)', example: 70 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  maxWeight?: number;

  @ApiProperty({ description: 'Sub-allocations' })
  @IsOptional()
  subAllocations?: {
    category: string;
    targetWeight: number;
  }[];
}

/**
 * DTO for rebalancing constraints
 */
export class RebalancingConstraintsDto {
  @ApiProperty({ description: 'Max position size (%)', example: 10 })
  @IsNumber()
  @IsOptional()
  maxPositionSize?: number;

  @ApiProperty({ description: 'Min position size (%)', example: 1 })
  @IsNumber()
  @IsOptional()
  minPositionSize?: number;

  @ApiProperty({ description: 'Max sector exposure (%)', example: 30 })
  @IsNumber()
  @IsOptional()
  maxSectorExposure?: number;

  @ApiProperty({ description: 'Max geographic exposure (%)', example: 40 })
  @IsNumber()
  @IsOptional()
  maxGeographicExposure?: number;

  @ApiProperty({ description: 'Restricted securities', example: ['TICKER1', 'TICKER2'] })
  @IsArray()
  @IsOptional()
  restrictedSecurities?: string[];

  @ApiProperty({ description: 'ESG constraints' })
  @IsOptional()
  esgConstraints?: {
    minESGScore?: number;
    excludedSectors?: string[];
    requiredRatings?: string[];
  };
}

/**
 * DTO for optimization request
 */
export class PortfolioOptimizationDto {
  @ApiProperty({ description: 'Portfolio ID' })
  @IsUUID()
  portfolioId: string;

  @ApiProperty({ description: 'Optimization objective', example: 'MAX_SHARPE' })
  @IsString()
  objective: 'MAX_SHARPE' | 'MIN_RISK' | 'MAX_RETURN' | 'RISK_PARITY';

  @ApiProperty({ description: 'Risk target (%)', example: 15 })
  @IsNumber()
  @IsOptional()
  riskTarget?: number;

  @ApiProperty({ description: 'Return target (%)', example: 10 })
  @IsNumber()
  @IsOptional()
  returnTarget?: number;

  @ApiProperty({ description: 'Include alternative assets', example: false })
  @IsBoolean()
  @IsOptional()
  includeAlternatives?: boolean;

  @ApiProperty({ description: 'Use factor models', example: true })
  @IsBoolean()
  @IsOptional()
  useFactorModels?: boolean;
}

/**
 * DTO for rebalancing schedule
 */
export class RebalancingScheduleDto {
  @ApiProperty({ description: 'Portfolio IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  portfolioIds: string[];

  @ApiProperty({ description: 'Schedule type', example: 'DAILY' })
  @IsString()
  scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'CUSTOM';

  @ApiProperty({ description: 'Custom cron expression' })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Auto-execute trades', example: false })
  @IsBoolean()
  autoExecute: boolean;

  @ApiProperty({ description: 'Notification settings' })
  @IsOptional()
  notifications?: {
    email?: string[];
    webhook?: string;
    preRebalanceAlert?: boolean;
    postRebalanceReport?: boolean;
  };
}

// ============================================================================
// REBALANCING ORCHESTRATION SERVICE
// ============================================================================

/**
 * Service for portfolio rebalancing orchestration
 */
@Injectable()
export class RebalancingOrchestrationService {
  private readonly logger = new Logger(RebalancingOrchestrationService.name);
  private rebalancingSchedules: Map<string, any> = new Map();

  constructor(
    @InjectQueue('rebalancing') private rebalancingQueue: Queue,
    @Inject('REDIS_CLIENT') private redisClient: any,
    @Inject('TRADING_SERVICE') private tradingService: any,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Create and validate rebalancing plan
   */
  async createRebalancingPlan(config: RebalancingConfigDto): Promise<any> {
    try {
      this.logger.log(`Creating rebalancing plan for portfolio ${config.portfolioId}`);

      // Get current portfolio composition
      const currentComposition = await calculatePortfolioComposition(config.portfolioId);

      // Calculate deviations from target
      const deviations = this.calculateDeviations(currentComposition, config.targetAllocations);

      // Check if rebalancing is needed
      const rebalancingNeeded = this.isRebalancingNeeded(deviations, config.thresholdPercent);

      if (!rebalancingNeeded) {
        return {
          portfolioId: config.portfolioId,
          rebalancingNeeded: false,
          message: 'Portfolio is within target allocations',
          currentComposition,
          targetAllocations: config.targetAllocations,
          deviations,
        };
      }

      // Generate rebalancing strategy
      const strategy = await generateRebalancingStrategy(
        config.portfolioId,
        config.targetAllocations,
        config.method
      );

      // Apply constraints
      const constrainedStrategy = this.applyConstraints(strategy, config.constraints);

      // Calculate tax impact
      let taxImpact = null;
      if (config.considerTaxes) {
        taxImpact = await this.calculateTaxImpact(
          config.portfolioId,
          constrainedStrategy,
          config.taxRates
        );
      }

      // Calculate transaction costs
      let transactionCosts = 0;
      if (config.includeTransactionCosts) {
        transactionCosts = this.calculateTransactionCosts(
          constrainedStrategy,
          config.transactionCostBps || 10
        );
      }

      // Generate trades
      const trades = this.generateTrades(
        constrainedStrategy,
        config.minTradeSize,
        config.maxTurnover
      );

      return {
        portfolioId: config.portfolioId,
        rebalancingNeeded: true,
        currentComposition,
        targetAllocations: config.targetAllocations,
        deviations,
        strategy: constrainedStrategy,
        trades,
        taxImpact,
        transactionCosts,
        totalCost: (taxImpact?.totalTax || 0) + transactionCosts,
        estimatedExecutionTime: this.estimateExecutionTime(trades),
        createdAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to create rebalancing plan: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Execute rebalancing plan
   */
  async executeRebalancingPlan(
    portfolioId: string,
    planId: string,
    options?: {
      dryRun?: boolean;
      executionStrategy?: 'IMMEDIATE' | 'VWAP' | 'TWAP' | 'ADAPTIVE';
      slicingParams?: any;
    }
  ): Promise<any> {
    try {
      this.logger.log(`Executing rebalancing plan ${planId} for portfolio ${portfolioId}`);

      // Retrieve plan from cache
      const plan = await this.getRebalancingPlan(planId);
      if (!plan) {
        throw new NotFoundException(`Rebalancing plan ${planId} not found`);
      }

      // Perform pre-execution checks
      const preChecks = await this.performPreExecutionChecks(portfolioId, plan);
      if (!preChecks.passed) {
        throw new BadRequestException(`Pre-execution checks failed: ${preChecks.reason}`);
      }

      if (options?.dryRun) {
        return {
          status: 'DRY_RUN_COMPLETE',
          portfolioId,
          planId,
          expectedTrades: plan.trades,
          expectedImpact: {
            marketImpact: this.estimateMarketImpact(plan.trades),
            slippage: this.estimateSlippage(plan.trades),
            totalCost: plan.totalCost,
          },
        };
      }

      // Execute trades
      const executionResult = await executeRebalancing(
        portfolioId,
        plan.trades,
        options?.executionStrategy || 'IMMEDIATE'
      );

      // Update portfolio state
      await this.updatePortfolioState(portfolioId, executionResult);

      // Generate post-execution report
      const report = await this.generatePostExecutionReport(
        portfolioId,
        planId,
        executionResult
      );

      return {
        status: 'EXECUTED',
        portfolioId,
        planId,
        executionResult,
        report,
        executedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to execute rebalancing: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Optimize portfolio allocation
   */
  async optimizePortfolioAllocation(dto: PortfolioOptimizationDto): Promise<any> {
    try {
      this.logger.log(`Optimizing portfolio ${dto.portfolioId} for ${dto.objective}`);

      // Run optimization
      const optimizationResult = await optimizePortfolio(
        dto.portfolioId,
        dto.objective,
        {
          riskTarget: dto.riskTarget,
          returnTarget: dto.returnTarget,
          includeAlternatives: dto.includeAlternatives,
        }
      );

      // Calculate expected metrics
      const expectedMetrics = {
        expectedReturn: optimizationResult.expectedReturn,
        expectedRisk: optimizationResult.expectedRisk,
        sharpeRatio: await calculateSharpeRatio(dto.portfolioId, optimizationResult),
        informationRatio: await calculateInformationRatio(dto.portfolioId, optimizationResult),
        treynorRatio: await calculateTreynorRatio(dto.portfolioId, optimizationResult),
      };

      // Analyze factor exposures if requested
      let factorExposures = null;
      if (dto.useFactorModels) {
        factorExposures = await calculateFactorExposures(dto.portfolioId);
      }

      // Run backtesting
      const backtest = await performBacktest(dto.portfolioId, optimizationResult);

      return {
        portfolioId: dto.portfolioId,
        objective: dto.objective,
        currentAllocation: optimizationResult.currentAllocation,
        optimizedAllocation: optimizationResult.optimizedAllocation,
        expectedMetrics,
        factorExposures,
        backtest,
        improvementPotential: {
          returnImprovement: optimizationResult.returnImprovement,
          riskReduction: optimizationResult.riskReduction,
          sharpeImprovement: optimizationResult.sharpeImprovement,
        },
        implementation: {
          requiredTrades: optimizationResult.requiredTrades,
          estimatedCost: optimizationResult.estimatedCost,
          estimatedTime: optimizationResult.estimatedTime,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Portfolio optimization failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Schedule automated rebalancing
   */
  async scheduleRebalancing(schedule: RebalancingScheduleDto): Promise<any> {
    try {
      const scheduleId = `schedule-${Date.now()}`;
      this.logger.log(`Creating rebalancing schedule ${scheduleId}`);

      // Determine cron expression
      const cronExpression = this.getCronExpression(schedule.scheduleType, schedule.cronExpression);

      // Create scheduled job
      const job = await this.rebalancingQueue.add(
        'scheduled-rebalancing',
        {
          scheduleId,
          portfolioIds: schedule.portfolioIds,
          autoExecute: schedule.autoExecute,
          notifications: schedule.notifications,
        },
        {
          repeat: {
            cron: cronExpression,
            startDate: schedule.startDate,
            endDate: schedule.endDate,
          },
        }
      );

      // Store schedule configuration
      this.rebalancingSchedules.set(scheduleId, {
        ...schedule,
        cronExpression,
        jobId: job.id,
        status: 'ACTIVE',
      });

      await this.redisClient.set(
        `rebalancing-schedule:${scheduleId}`,
        JSON.stringify(schedule),
        'EX',
        86400 * 30 // 30 days
      );

      return {
        scheduleId,
        portfolios: schedule.portfolioIds,
        scheduleType: schedule.scheduleType,
        cronExpression,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        autoExecute: schedule.autoExecute,
        status: 'ACTIVE',
        nextRun: this.getNextRunTime(cronExpression),
      };
    } catch (error) {
      this.logger.error(`Failed to schedule rebalancing: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper methods
  private calculateDeviations(current: any, target: AssetAllocationDto[]): any {
    const deviations: any[] = [];

    for (const targetAlloc of target) {
      const currentWeight = current[targetAlloc.assetClass] || 0;
      const deviation = currentWeight - targetAlloc.targetWeight;

      deviations.push({
        assetClass: targetAlloc.assetClass,
        currentWeight,
        targetWeight: targetAlloc.targetWeight,
        deviation,
        deviationPercent: (deviation / targetAlloc.targetWeight) * 100,
      });
    }

    return deviations;
  }

  private isRebalancingNeeded(deviations: any[], threshold: number): boolean {
    return deviations.some(d => Math.abs(d.deviationPercent) > threshold);
  }

  private applyConstraints(strategy: any, constraints?: RebalancingConstraintsDto): any {
    if (!constraints) return strategy;

    // Apply position size constraints
    if (constraints.maxPositionSize) {
      strategy.positions = strategy.positions.filter(
        (p: any) => p.weight <= constraints.maxPositionSize!
      );
    }

    // Apply sector constraints
    if (constraints.maxSectorExposure) {
      // Group by sector and apply limits
      const sectorGroups = this.groupBySector(strategy.positions);
      for (const [sector, positions] of Object.entries(sectorGroups)) {
        const totalWeight = (positions as any[]).reduce((sum, p) => sum + p.weight, 0);
        if (totalWeight > constraints.maxSectorExposure) {
          // Scale down positions proportionally
          const scaleFactor = constraints.maxSectorExposure / totalWeight;
          (positions as any[]).forEach(p => {
            p.weight *= scaleFactor;
          });
        }
      }
    }

    // Filter restricted securities
    if (constraints.restrictedSecurities) {
      strategy.positions = strategy.positions.filter(
        (p: any) => !constraints.restrictedSecurities!.includes(p.symbol)
      );
    }

    return strategy;
  }

  private async calculateTaxImpact(portfolioId: string, strategy: any, taxRates?: any): Promise<any> {
    const taxableEvents = [];
    let totalTax = 0;

    for (const trade of strategy.trades) {
      if (trade.action === 'SELL') {
        const holdingPeriod = await this.getHoldingPeriod(portfolioId, trade.symbol);
        const gainLoss = trade.expectedPrice * trade.quantity - trade.costBasis;

        let taxRate = 0;
        if (gainLoss > 0) {
          taxRate = holdingPeriod > 365
            ? (taxRates?.longTermCapitalGains || 0.15)
            : (taxRates?.shortTermCapitalGains || 0.35);
        }

        const tax = gainLoss > 0 ? gainLoss * taxRate : 0;
        totalTax += tax;

        taxableEvents.push({
          symbol: trade.symbol,
          gainLoss,
          holdingPeriod,
          taxRate,
          tax,
        });
      }
    }

    return {
      taxableEvents,
      totalTax,
      effectiveTaxRate: totalTax / strategy.totalValue,
    };
  }

  private calculateTransactionCosts(strategy: any, costBps: number): number {
    return strategy.trades.reduce((total: number, trade: any) => {
      const tradeValue = trade.quantity * trade.expectedPrice;
      return total + (tradeValue * costBps / 10000);
    }, 0);
  }

  private generateTrades(strategy: any, minTradeSize: number, maxTurnover?: number): any[] {
    const trades = [];
    let totalTurnover = 0;

    for (const adjustment of strategy.adjustments) {
      const tradeValue = Math.abs(adjustment.value);

      // Skip trades below minimum size
      if (tradeValue < minTradeSize) continue;

      // Check turnover constraint
      if (maxTurnover) {
        const turnoverPercent = (totalTurnover + tradeValue) / strategy.totalValue * 100;
        if (turnoverPercent > maxTurnover) continue;
      }

      trades.push({
        symbol: adjustment.symbol,
        action: adjustment.value > 0 ? 'BUY' : 'SELL',
        quantity: Math.abs(adjustment.quantity),
        expectedPrice: adjustment.price,
        value: tradeValue,
      });

      totalTurnover += tradeValue;
    }

    return trades;
  }

  private estimateExecutionTime(trades: any[]): number {
    // Estimate based on number of trades and market conditions
    const baseTimePerTrade = 30; // seconds
    const parallelExecutionFactor = 0.3; // Can execute 30% in parallel
    return Math.ceil(trades.length * baseTimePerTrade * parallelExecutionFactor);
  }

  private async getRebalancingPlan(planId: string): Promise<any> {
    const planData = await this.redisClient.get(`rebalancing-plan:${planId}`);
    return planData ? JSON.parse(planData) : null;
  }

  private async performPreExecutionChecks(portfolioId: string, plan: any): Promise<any> {
    // Check market conditions
    const marketOpen = await this.checkMarketOpen();
    if (!marketOpen) {
      return { passed: false, reason: 'Market is closed' };
    }

    // Check liquidity
    const liquidityCheck = await this.checkLiquidity(plan.trades);
    if (!liquidityCheck.sufficient) {
      return { passed: false, reason: 'Insufficient liquidity' };
    }

    // Check risk limits
    const riskCheck = await this.checkRiskLimits(portfolioId, plan);
    if (!riskCheck.passed) {
      return { passed: false, reason: `Risk limit breach: ${riskCheck.breach}` };
    }

    return { passed: true };
  }

  private async updatePortfolioState(portfolioId: string, executionResult: any): Promise<void> {
    // Update portfolio positions
    // Update cash balance
    // Update performance metrics
    // Log execution history
  }

  private async generatePostExecutionReport(
    portfolioId: string,
    planId: string,
    executionResult: any
  ): Promise<any> {
    return await generatePortfolioReport(portfolioId);
  }

  private groupBySector(positions: any[]): Record<string, any[]> {
    return positions.reduce((groups, position) => {
      const sector = position.sector || 'OTHER';
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(position);
      return groups;
    }, {} as Record<string, any[]>);
  }

  private async getHoldingPeriod(portfolioId: string, symbol: string): Promise<number> {
    // Calculate days held
    return 400; // Placeholder
  }

  private estimateMarketImpact(trades: any[]): number {
    // Estimate based on trade size and market conditions
    return trades.reduce((impact, trade) => {
      return impact + (trade.value * 0.001); // 10 bps impact
    }, 0);
  }

  private estimateSlippage(trades: any[]): number {
    // Estimate execution slippage
    return trades.reduce((slippage, trade) => {
      return slippage + (trade.value * 0.0005); // 5 bps slippage
    }, 0);
  }

  private getCronExpression(scheduleType: string, customCron?: string): string {
    if (customCron) return customCron;

    switch (scheduleType) {
      case 'DAILY':
        return '0 9 * * 1-5'; // 9 AM weekdays
      case 'WEEKLY':
        return '0 9 * * MON'; // Mondays at 9 AM
      case 'MONTHLY':
        return '0 9 1 * *'; // First day of month at 9 AM
      case 'QUARTERLY':
        return '0 9 1 */3 *'; // First day of quarter at 9 AM
      default:
        return '0 9 * * 1-5';
    }
  }

  private getNextRunTime(cronExpression: string): Date {
    // Calculate next run time based on cron expression
    return new Date();
  }

  private async checkMarketOpen(): Promise<boolean> {
    // Check if market is open
    return true;
  }

  private async checkLiquidity(trades: any[]): Promise<any> {
    // Check market liquidity for trades
    return { sufficient: true };
  }

  private async checkRiskLimits(portfolioId: string, plan: any): Promise<any> {
    // Check if plan violates risk limits
    return { passed: true };
  }
}

// ============================================================================
// REBALANCING PROCESSOR
// ============================================================================

/**
 * Bull processor for rebalancing jobs
 */
@Processor('rebalancing')
export class RebalancingProcessor {
  private readonly logger = new Logger(RebalancingProcessor.name);

  constructor(
    private readonly rebalancingService: RebalancingOrchestrationService,
  ) {}

  @Process('scheduled-rebalancing')
  async handleScheduledRebalancing(job: Job) {
    this.logger.log(`Processing scheduled rebalancing: ${job.id}`);

    const { scheduleId, portfolioIds, autoExecute, notifications } = job.data;

    try {
      const results = [];

      for (const portfolioId of portfolioIds) {
        // Create rebalancing plan
        const config = await this.getPortfolioRebalancingConfig(portfolioId);
        const plan = await this.rebalancingService.createRebalancingPlan(config);

        if (plan.rebalancingNeeded) {
          if (autoExecute) {
            // Execute automatically
            const execution = await this.rebalancingService.executeRebalancingPlan(
              portfolioId,
              plan.id
            );
            results.push(execution);
          } else {
            // Send notification for manual review
            if (notifications?.email) {
              await this.sendRebalancingNotification(portfolioId, plan, notifications.email);
            }
            results.push(plan);
          }
        }
      }

      return {
        scheduleId,
        portfoliosProcessed: portfolioIds.length,
        results,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Scheduled rebalancing failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getPortfolioRebalancingConfig(portfolioId: string): Promise<RebalancingConfigDto> {
    // Retrieve saved configuration for portfolio
    return {} as RebalancingConfigDto;
  }

  private async sendRebalancingNotification(portfolioId: string, plan: any, emails: string[]): Promise<void> {
    // Send email notification
  }
}

// ============================================================================
// REBALANCING CONTROLLER
// ============================================================================

/**
 * Controller for rebalancing orchestration
 */
@ApiTags('Portfolio Rebalancing')
@ApiBearerAuth()
@Controller('api/v1/portfolio/rebalancing')
export class RebalancingController {
  constructor(
    private readonly rebalancingService: RebalancingOrchestrationService,
  ) {}

  /**
   * Create rebalancing plan
   */
  @Post('plan')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create portfolio rebalancing plan' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  async createPlan(@Body() dto: RebalancingConfigDto) {
    return await this.rebalancingService.createRebalancingPlan(dto);
  }

  /**
   * Execute rebalancing plan
   */
  @Post('execute/:portfolioId/:planId')
  @ApiOperation({ summary: 'Execute rebalancing plan' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio ID' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  async executePlan(
    @Param('portfolioId') portfolioId: string,
    @Param('planId') planId: string,
    @Query('dryRun') dryRun: boolean = false,
  ) {
    return await this.rebalancingService.executeRebalancingPlan(portfolioId, planId, { dryRun });
  }

  /**
   * Optimize portfolio
   */
  @Post('optimize')
  @ApiOperation({ summary: 'Optimize portfolio allocation' })
  async optimizePortfolio(@Body() dto: PortfolioOptimizationDto) {
    return await this.rebalancingService.optimizePortfolioAllocation(dto);
  }

  /**
   * Schedule automated rebalancing
   */
  @Post('schedule')
  @ApiOperation({ summary: 'Schedule automated rebalancing' })
  async scheduleRebalancing(@Body() dto: RebalancingScheduleDto) {
    return await this.rebalancingService.scheduleRebalancing(dto);
  }
}

// Export all components
export default {
  RebalancingOrchestrationService,
  RebalancingProcessor,
  RebalancingController,
  RebalancingConfigDto,
  AssetAllocationDto,
  RebalancingConstraintsDto,
  PortfolioOptimizationDto,
  RebalancingScheduleDto,
};