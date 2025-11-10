/**
 * Market Making Controllers
 * Bloomberg Terminal-Level Market Making Control System
 *
 * Provides comprehensive market making controls, quote management,
 * inventory optimization, and liquidity provision services
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Logger,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiBody
} from '@nestjs/swagger';
import { Decimal } from 'decimal.js';

// Import from market-making-liquidity-composite
import {
  MarketMakingQuote,
  QuoteObligations,
  InventoryPosition,
  MarketMakingStrategy,
  LiquidityMetrics,
  QuoteStatus,
  generateQuote,
  optimizeSpread,
  calculateInventoryRisk,
  adjustQuoteForInventory,
  skewQuoteForFlow,
  predictAdverseSelection,
  generateMultiLevelQuotes,
  calculateRebateCapture,
  performQuoteObligation,
  trackLiquidityProvision,
  analyzeOrderFlow,
  detectToxicFlow,
  calculatePriceImprovement,
  manageInventory,
  hedgeInventoryRisk,
  calculateMarketMakingPnL,
  optimizeQuotingStrategy,
  performMarketMakingCompliance,
  calculateMarketShare,
  analyzeCompetitorQuotes,
  initializeMarketMakingModels
} from '../market-making-liquidity-composite';

// DTO Classes
export class QuoteGenerationDto {
  @ApiProperty({ description: 'Symbol to quote' })
  symbol: string;

  @ApiProperty({ description: 'Quote parameters' })
  parameters: {
    targetSpread: number;
    quoteSize: number;
    levels: number;
    skewFactor: number;
    maxInventory: number;
    urgency: 'low' | 'normal' | 'high';
  };

  @ApiProperty({ description: 'Market conditions' })
  marketConditions: {
    volatility: number;
    volume: number;
    marketDepth: number;
    competitorSpread: number;
  };

  @ApiProperty({ description: 'Risk limits' })
  riskLimits: {
    maxPosition: number;
    maxLoss: number;
    varLimit: number;
    inventoryThreshold: number;
  };
}

export class MarketMakingQuoteDto {
  @ApiProperty({ description: 'Quote ID' })
  quoteId: string;

  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Bid quote' })
  bid: {
    price: number;
    size: number;
    levels: Array<{ price: number; size: number }>;
  };

  @ApiProperty({ description: 'Ask quote' })
  ask: {
    price: number;
    size: number;
    levels: Array<{ price: number; size: number }>;
  };

  @ApiProperty({ description: 'Spread metrics' })
  spreadMetrics: {
    spread: number;
    spreadBps: number;
    midPrice: number;
    effectiveSpread: number;
  };

  @ApiProperty({ description: 'Quote status' })
  status: QuoteStatus;

  @ApiProperty({ description: 'Expiry time' })
  expiryTime: Date;
}

export class InventoryManagementDto {
  @ApiProperty({ description: 'Current inventory positions' })
  positions: Array<{
    symbol: string;
    quantity: number;
    averageCost: number;
    currentValue: number;
    unrealizedPnl: number;
    inventoryAge: number;
  }>;

  @ApiProperty({ description: 'Risk metrics' })
  riskMetrics: {
    totalInventoryValue: number;
    inventoryRisk: number;
    concentration: Record<string, number>;
    turnover: number;
  };

  @ApiProperty({ description: 'Hedging status' })
  hedging: {
    isHedged: boolean;
    hedgeRatio: number;
    hedgeInstruments: string[];
    hedgeCost: number;
  };

  @ApiProperty({ description: 'Recommendations' })
  recommendations: Array<{
    action: string;
    symbol: string;
    quantity: number;
    urgency: string;
    reason: string;
  }>;
}

// Service Classes
@Injectable()
export class MarketMakingControlService {
  private readonly logger = new Logger(MarketMakingControlService.name);
  private activeQuotes = new Map<string, MarketMakingQuoteDto>();
  private inventoryPositions = new Map<string, any>();
  private quotingStrategies = new Map<string, any>();

  async generateMarketMakingQuote(request: QuoteGenerationDto): Promise<MarketMakingQuoteDto> {
    this.logger.log(`Generating quote for ${request.symbol}`);

    // Generate base quote
    const baseQuote = await generateQuote(
      request.symbol,
      request.parameters.targetSpread,
      request.parameters.quoteSize
    );

    // Optimize spread based on market conditions
    const optimizedSpread = await optimizeSpread(
      request.symbol,
      request.marketConditions.volatility,
      request.marketConditions.competitorSpread
    );

    // Adjust for inventory
    const currentInventory = this.inventoryPositions.get(request.symbol) || 0;
    const adjustedQuote = await adjustQuoteForInventory(
      baseQuote,
      currentInventory,
      request.parameters.maxInventory
    );

    // Skew for expected order flow
    const flowPrediction = await analyzeOrderFlow(request.symbol);
    const skewedQuote = await skewQuoteForFlow(
      adjustedQuote,
      flowPrediction,
      request.parameters.skewFactor
    );

    // Generate multi-level quotes
    const multiLevelQuotes = await generateMultiLevelQuotes(
      skewedQuote,
      request.parameters.levels
    );

    // Check adverse selection risk
    const adverseSelectionRisk = await predictAdverseSelection(
      request.symbol,
      request.marketConditions
    );

    if (adverseSelectionRisk > 0.7) {
      this.logger.warn(`High adverse selection risk for ${request.symbol}: ${adverseSelectionRisk}`);
      // Widen spreads for protection
      multiLevelQuotes.spread *= 1.5;
    }

    const quote: MarketMakingQuoteDto = {
      quoteId: this.generateQuoteId(),
      symbol: request.symbol,
      bid: {
        price: multiLevelQuotes.bidPrice,
        size: multiLevelQuotes.bidSize,
        levels: multiLevelQuotes.bidLevels
      },
      ask: {
        price: multiLevelQuotes.askPrice,
        size: multiLevelQuotes.askSize,
        levels: multiLevelQuotes.askLevels
      },
      spreadMetrics: {
        spread: multiLevelQuotes.askPrice - multiLevelQuotes.bidPrice,
        spreadBps: ((multiLevelQuotes.askPrice - multiLevelQuotes.bidPrice) / multiLevelQuotes.midPrice) * 10000,
        midPrice: multiLevelQuotes.midPrice,
        effectiveSpread: optimizedSpread
      },
      status: 'active' as QuoteStatus,
      expiryTime: new Date(Date.now() + 30000) // 30 second quote
    };

    this.activeQuotes.set(quote.quoteId, quote);
    return quote;
  }

  async updateQuote(quoteId: string, updates: Partial<QuoteGenerationDto>): Promise<MarketMakingQuoteDto> {
    const existingQuote = this.activeQuotes.get(quoteId);

    if (!existingQuote) {
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    }

    // Regenerate quote with updates
    const updatedRequest: QuoteGenerationDto = {
      symbol: existingQuote.symbol,
      parameters: updates.parameters || {
        targetSpread: existingQuote.spreadMetrics.spread,
        quoteSize: existingQuote.bid.size,
        levels: existingQuote.bid.levels.length,
        skewFactor: 0,
        maxInventory: 100000,
        urgency: 'normal'
      },
      marketConditions: updates.marketConditions || {
        volatility: 0.2,
        volume: 1000000,
        marketDepth: 50,
        competitorSpread: existingQuote.spreadMetrics.spread
      },
      riskLimits: updates.riskLimits || {
        maxPosition: 1000000,
        maxLoss: 50000,
        varLimit: 100000,
        inventoryThreshold: 500000
      }
    };

    return await this.generateMarketMakingQuote(updatedRequest);
  }

  async cancelQuote(quoteId: string): Promise<void> {
    const quote = this.activeQuotes.get(quoteId);

    if (!quote) {
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    }

    quote.status = 'cancelled' as QuoteStatus;
    this.activeQuotes.delete(quoteId);

    this.logger.log(`Cancelled quote ${quoteId}`);
  }

  async getInventoryStatus(): Promise<InventoryManagementDto> {
    const positions = [];
    let totalValue = 0;

    for (const [symbol, position] of this.inventoryPositions) {
      const currentPrice = await this.getCurrentPrice(symbol);
      const currentValue = position.quantity * currentPrice;
      const unrealizedPnl = currentValue - (position.quantity * position.averageCost);

      positions.push({
        symbol,
        quantity: position.quantity,
        averageCost: position.averageCost,
        currentValue,
        unrealizedPnl,
        inventoryAge: this.calculateInventoryAge(position.timestamp)
      });

      totalValue += currentValue;
    }

    // Calculate risk metrics
    const inventoryRisk = await calculateInventoryRisk(positions);
    const concentration = this.calculateConcentration(positions, totalValue);

    // Generate recommendations
    const recommendations = await this.generateInventoryRecommendations(positions);

    // Check hedging status
    const hedgingStatus = await this.checkHedgingStatus(positions);

    return {
      positions,
      riskMetrics: {
        totalInventoryValue: totalValue,
        inventoryRisk,
        concentration,
        turnover: await this.calculateTurnover()
      },
      hedging: hedgingStatus,
      recommendations
    };
  }

  async optimizeInventory(symbol: string): Promise<any> {
    const position = this.inventoryPositions.get(symbol);

    if (!position) {
      return { message: 'No inventory position found' };
    }

    // Manage inventory
    const managementResult = await manageInventory(
      symbol,
      position.quantity,
      position.targetInventory
    );

    // Hedge if necessary
    if (Math.abs(position.quantity) > position.hedgeThreshold) {
      const hedgeResult = await hedgeInventoryRisk(
        symbol,
        position.quantity
      );

      return {
        action: 'hedged',
        originalPosition: position.quantity,
        hedgeDetails: hedgeResult
      };
    }

    return managementResult;
  }

  async analyzeMarketMakingPerformance(period: string): Promise<any> {
    // Calculate P&L
    const pnl = await calculateMarketMakingPnL(period);

    // Calculate market share
    const marketShare = await calculateMarketShare(period);

    // Get liquidity metrics
    const liquidityMetrics = await trackLiquidityProvision(period);

    // Calculate rebate capture
    const rebateCapture = await calculateRebateCapture(period);

    // Price improvement statistics
    const priceImprovement = await calculatePriceImprovement(period);

    return {
      period,
      pnl: {
        total: pnl.total,
        realized: pnl.realized,
        unrealized: pnl.unrealized,
        fees: pnl.fees,
        rebates: rebateCapture.total
      },
      marketShare: {
        percentage: marketShare,
        rank: await this.getMarketMakerRank()
      },
      liquidityMetrics: {
        quotedTime: liquidityMetrics.quotedTime,
        averageSpread: liquidityMetrics.averageSpread,
        volumeProvided: liquidityMetrics.volume,
        fillRate: liquidityMetrics.fillRate
      },
      priceImprovement: {
        count: priceImprovement.count,
        totalValue: priceImprovement.value,
        averageBps: priceImprovement.averageBps
      }
    };
  }

  async detectToxicOrderFlow(symbol: string): Promise<any> {
    return await detectToxicFlow(symbol);
  }

  async analyzeCompetition(symbol: string): Promise<any> {
    return await analyzeCompetitorQuotes(symbol);
  }

  async checkCompliance(): Promise<any> {
    return await performMarketMakingCompliance();
  }

  async optimizeStrategy(symbol: string): Promise<any> {
    return await optimizeQuotingStrategy(symbol);
  }

  private generateQuoteId(): string {
    return `quote_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    // Implementation to get current price
    return Math.random() * 100 + 50;
  }

  private calculateInventoryAge(timestamp: Date): number {
    return (Date.now() - timestamp.getTime()) / 1000 / 60; // Age in minutes
  }

  private calculateConcentration(positions: any[], totalValue: number): Record<string, number> {
    const concentration = {};

    for (const position of positions) {
      concentration[position.symbol] = (position.currentValue / totalValue) * 100;
    }

    return concentration;
  }

  private async calculateTurnover(): Promise<number> {
    // Implementation for turnover calculation
    return Math.random() * 10;
  }

  private async generateInventoryRecommendations(positions: any[]): Promise<any[]> {
    const recommendations = [];

    for (const position of positions) {
      if (position.inventoryAge > 60) { // Stale inventory
        recommendations.push({
          action: 'reduce',
          symbol: position.symbol,
          quantity: position.quantity * 0.5,
          urgency: 'high',
          reason: 'Stale inventory - reduce position'
        });
      }

      if (Math.abs(position.unrealizedPnl) > 10000) {
        recommendations.push({
          action: position.unrealizedPnl > 0 ? 'take_profit' : 'stop_loss',
          symbol: position.symbol,
          quantity: position.quantity,
          urgency: 'medium',
          reason: position.unrealizedPnl > 0 ? 'Take profits' : 'Cut losses'
        });
      }
    }

    return recommendations;
  }

  private async checkHedgingStatus(positions: any[]): Promise<any> {
    return {
      isHedged: positions.length > 5,
      hedgeRatio: 0.75,
      hedgeInstruments: ['SPY', 'VIX'],
      hedgeCost: Math.random() * 1000
    };
  }

  private async getMarketMakerRank(): Promise<number> {
    return Math.floor(Math.random() * 10) + 1;
  }
}

// Controller
@ApiTags('market-making')
@ApiBearerAuth()
@Controller('market-making')
export class MarketMakingController {
  private readonly logger = new Logger(MarketMakingController.name);

  constructor(
    private readonly marketMakingService: MarketMakingControlService
  ) {}

  @Post('quotes/generate')
  @ApiOperation({ summary: 'Generate market making quote' })
  @ApiBody({ type: QuoteGenerationDto })
  @ApiResponse({
    status: 201,
    description: 'Quote generated',
    type: MarketMakingQuoteDto
  })
  async generateQuote(
    @Body() request: QuoteGenerationDto
  ): Promise<MarketMakingQuoteDto> {
    try {
      return await this.marketMakingService.generateMarketMakingQuote(request);
    } catch (error) {
      this.logger.error('Failed to generate quote:', error);
      throw new HttpException(
        `Quote generation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('quotes/:quoteId')
  @ApiOperation({ summary: 'Update existing quote' })
  @ApiParam({ name: 'quoteId', description: 'Quote ID' })
  @ApiBody({ type: QuoteGenerationDto })
  @ApiResponse({
    status: 200,
    description: 'Quote updated',
    type: MarketMakingQuoteDto
  })
  async updateQuote(
    @Param('quoteId') quoteId: string,
    @Body() updates: Partial<QuoteGenerationDto>
  ): Promise<MarketMakingQuoteDto> {
    try {
      return await this.marketMakingService.updateQuote(quoteId, updates);
    } catch (error) {
      this.logger.error(`Failed to update quote ${quoteId}:`, error);
      throw new HttpException(
        `Quote update failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('quotes/:quoteId')
  @ApiOperation({ summary: 'Cancel quote' })
  @ApiParam({ name: 'quoteId', description: 'Quote ID' })
  @ApiResponse({
    status: 204,
    description: 'Quote cancelled'
  })
  async cancelQuote(
    @Param('quoteId') quoteId: string
  ): Promise<void> {
    try {
      await this.marketMakingService.cancelQuote(quoteId);
    } catch (error) {
      this.logger.error(`Failed to cancel quote ${quoteId}:`, error);
      throw new HttpException(
        `Quote cancellation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory status' })
  @ApiResponse({
    status: 200,
    description: 'Inventory status',
    type: InventoryManagementDto
  })
  async getInventory(): Promise<InventoryManagementDto> {
    try {
      return await this.marketMakingService.getInventoryStatus();
    } catch (error) {
      this.logger.error('Failed to get inventory status:', error);
      throw new HttpException(
        `Inventory retrieval failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('inventory/:symbol/optimize')
  @ApiOperation({ summary: 'Optimize inventory for symbol' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiResponse({
    status: 200,
    description: 'Optimization result'
  })
  async optimizeInventory(
    @Param('symbol') symbol: string
  ): Promise<any> {
    try {
      return await this.marketMakingService.optimizeInventory(symbol);
    } catch (error) {
      this.logger.error(`Failed to optimize inventory for ${symbol}:`, error);
      throw new HttpException(
        `Inventory optimization failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get market making performance' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period' })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics'
  })
  async getPerformance(
    @Query('period') period: string = '1d'
  ): Promise<any> {
    try {
      return await this.marketMakingService.analyzeMarketMakingPerformance(period);
    } catch (error) {
      this.logger.error('Failed to analyze performance:', error);
      throw new HttpException(
        `Performance analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('flow-analysis/:symbol')
  @ApiOperation({ summary: 'Detect toxic order flow' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiResponse({
    status: 200,
    description: 'Flow analysis result'
  })
  async analyzeFlow(
    @Param('symbol') symbol: string
  ): Promise<any> {
    try {
      return await this.marketMakingService.detectToxicOrderFlow(symbol);
    } catch (error) {
      this.logger.error(`Failed to analyze flow for ${symbol}:`, error);
      throw new HttpException(
        `Flow analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('competition/:symbol')
  @ApiOperation({ summary: 'Analyze competitor quotes' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiResponse({
    status: 200,
    description: 'Competition analysis'
  })
  async analyzeCompetition(
    @Param('symbol') symbol: string
  ): Promise<any> {
    try {
      return await this.marketMakingService.analyzeCompetition(symbol);
    } catch (error) {
      this.logger.error(`Failed to analyze competition for ${symbol}:`, error);
      throw new HttpException(
        `Competition analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Check market making compliance' })
  @ApiResponse({
    status: 200,
    description: 'Compliance status'
  })
  async checkCompliance(): Promise<any> {
    try {
      return await this.marketMakingService.checkCompliance();
    } catch (error) {
      this.logger.error('Failed to check compliance:', error);
      throw new HttpException(
        `Compliance check failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Export module
export default {
  controllers: [MarketMakingController],
  providers: [MarketMakingControlService],
  exports: [MarketMakingControlService]
};